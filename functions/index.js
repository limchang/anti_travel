const { setGlobalOptions } = require('firebase-functions');
const { onRequest } = require('firebase-functions/https');
const admin = require('firebase-admin');
const crypto = require('crypto');

setGlobalOptions({ maxInstances: 10, region: 'asia-northeast3' });

// Firebase Admin auto-initializes inside Functions (no credentials needed)
if (!admin.apps.length) {
  admin.initializeApp();
}

// ── Crypto helpers ──────────────────────────────────────────────────────────
const ALGORITHM = 'aes-256-gcm';

const getEncryptionKey = () => {
  const secret = String(process.env.AI_KEY_ENCRYPTION_SECRET || '').trim();
  if (!secret) throw new Error('AI_KEY_ENCRYPTION_SECRET is not configured');
  return crypto.createHash('sha256').update(secret).digest();
};

const encryptSecret = (plainText = '') => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(plainText || ''), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    content: encrypted.toString('base64'),
    alg: ALGORITHM,
  };
};

const decryptSecret = (payload = {}) => {
  const iv = Buffer.from(String(payload?.iv || ''), 'base64');
  const tag = Buffer.from(String(payload?.tag || ''), 'base64');
  const content = Buffer.from(String(payload?.content || ''), 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(content), decipher.final()]).toString('utf8');
};

// ── Auth helper ─────────────────────────────────────────────────────────────
const verifyBearerToken = async (req) => {
  const header = String(req.headers?.authorization || '');
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new Error('Missing bearer token');
  return admin.auth().verifyIdToken(match[1]);
};

// ── CORS helper ─────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://limchang.github.io',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:3001',
  // Vercel deployments
  /^https:\/\/anti-planer.*\.vercel\.app$/,
  /^https:\/\/.*anti-planer.*\.vercel\.app$/,
];

const isCorsAllowed = (origin) => {
  if (!origin) return true; // same-origin / no-CORS requests
  return ALLOWED_ORIGINS.some((o) => (typeof o === 'string' ? o === origin : o.test(origin)));
};

const setCors = (req, res) => {
  const origin = req.headers.origin || '';
  if (isCorsAllowed(origin)) {
    res.set('Access-Control-Allow-Origin', origin || '*');
  }
  res.set('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.set('Access-Control-Max-Age', '3600');
};

// groqAnalyze 등 공개 엔드포인트는 CORS 완전 개방 (Groq/Gemini API 키로 자체 보안)
const setCorsPublic = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.set('Access-Control-Max-Age', '3600');
};

// ── /api/ai-key ─────────────────────────────────────────────────────────────
exports.aiKey = onRequest({ invoker: 'public' }, async (req, res) => {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).send('');

  try {
    let decodedToken;
    try {
      decodedToken = await verifyBearerToken(req);
    } catch (error) {
      return res.status(401).json({ error: error?.message || 'Unauthorized' });
    }

    const docRef = admin.firestore().doc(`users/${decodedToken.uid}/private/ai`);

    if (req.method === 'GET') {
      const snap = await docRef.get();
      const data = snap.data() || {};
      return res.status(200).json({
        hasStoredKey: !!data?.groqKeyCipher?.content || !!data?.geminiKeyCipher?.content || !!data?.perplexityKeyCipher?.content,
        hasStoredGroqKey: !!data?.groqKeyCipher?.content,
        hasStoredGeminiKey: !!data?.geminiKeyCipher?.content,
        hasStoredPerplexityKey: !!data?.perplexityKeyCipher?.content,
        updatedAt: data?.updatedAt?.toDate?.()?.toISOString?.() || null,
      });
    }

    if (req.method === 'POST') {
      // 신버전: groqApiKey / geminiApiKey / perplexityApiKey 각각 지원
      // 구버전 호환: apiKey → groqApiKey 로 fallback
      const groqApiKey = String(req.body?.groqApiKey || req.body?.apiKey || '').trim();
      const geminiApiKey = String(req.body?.geminiApiKey || '').trim();
      const perplexityApiKey = String(req.body?.perplexityApiKey || '').trim();
      if (!groqApiKey && !geminiApiKey && !perplexityApiKey) {
        return res.status(400).json({ error: 'groqApiKey or geminiApiKey or perplexityApiKey is required' });
      }
      const nextPayload = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      if (groqApiKey) nextPayload.groqKeyCipher = encryptSecret(groqApiKey);
      if (geminiApiKey) nextPayload.geminiKeyCipher = encryptSecret(geminiApiKey);
      if (perplexityApiKey) nextPayload.perplexityKeyCipher = encryptSecret(perplexityApiKey);
      await docRef.set(nextPayload, { merge: true });
      return res.status(200).json({
        ok: true,
        hasStoredKey: true,
        hasStoredGroqKey: !!groqApiKey,
        hasStoredGeminiKey: !!geminiApiKey,
        hasStoredPerplexityKey: !!perplexityApiKey,
      });
    }

    if (req.method === 'DELETE') {
      const provider = String(req.query?.provider || req.body?.provider || '').trim().toLowerCase();
      const deletePayload = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
      if (!provider || provider === 'all') {
        deletePayload.groqKeyCipher = admin.firestore.FieldValue.delete();
        deletePayload.geminiKeyCipher = admin.firestore.FieldValue.delete();
        deletePayload.perplexityKeyCipher = admin.firestore.FieldValue.delete();
      } else if (provider === 'groq') {
        deletePayload.groqKeyCipher = admin.firestore.FieldValue.delete();
      } else if (provider === 'gemini') {
        deletePayload.geminiKeyCipher = admin.firestore.FieldValue.delete();
      } else if (provider === 'perplexity') {
        deletePayload.perplexityKeyCipher = admin.firestore.FieldValue.delete();
      } else {
        return res.status(400).json({ error: 'provider must be groq, gemini, perplexity, or all' });
      }
      await docRef.set(deletePayload, { merge: true });
      return res.status(200).json({ ok: true, hasStoredKey: false });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Unknown server error' });
  }
});

// ── /api/groq-analyze ───────────────────────────────────────────────────────
const normalizeBusiness = (business = {}) => ({
  open: String(business?.open || '').trim(),
  close: String(business?.close || '').trim(),
  breakStart: String(business?.breakStart || '').trim(),
  breakEnd: String(business?.breakEnd || '').trim(),
  lastOrder: String(business?.lastOrder || '').trim(),
  entryClose: String(business?.entryClose || '').trim(),
  closedDays: Array.isArray(business?.closedDays)
    ? business.closedDays.map((item) => String(item || '').trim()).filter(Boolean)
    : [],
});

const extractJsonPayload = (text = '') => {
  const raw = String(text || '').trim();
  if (!raw) return null;
  const fenced = raw.match(/```json\s*([\s\S]*?)```/i) || raw.match(/```\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] || raw;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try { return JSON.parse(candidate.slice(start, end + 1)); } catch { return null; }
};

const normalizeResult = (raw = {}) => ({
  name: String(raw?.name || '').trim(),
  address: String(raw?.address || '').trim(),
  business: raw?.business ? normalizeBusiness(raw.business) : null,
  menus: Array.isArray(raw?.menus)
    ? raw.menus
      .map((item) => ({ name: String(item?.name || '').trim(), price: Number(item?.price) || 0 }))
      .filter((item) => item.name)
    : [],
});

const shouldUseReasoningEffort = (model = '') => /qwen\/qwen3|gpt-oss/i.test(String(model || ''));

const getStoredUserApiKey = async (req) => {
  try {
    const decodedToken = await verifyBearerToken(req);
    const snap = await admin.firestore().doc(`users/${decodedToken.uid}/private/ai`).get();
    const cipher = snap.data()?.groqKeyCipher;
    if (!cipher?.content) return '';
    return decryptSecret(cipher);
  } catch { return ''; }
};

exports.groqAnalyze = onRequest({ invoker: 'public' }, async (req, res) => {
  setCorsPublic(req, res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const requestApiKey = String(req.body?.apiKey || '').trim();
  const apiKey = requestApiKey || await getStoredUserApiKey(req) || process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY is not configured' });

  const mode = String(req.body?.mode || 'all');
  const text = String(req.body?.text || '');
  const imageDataUrl = String(req.body?.imageDataUrl || '');
  const apiBaseUrl = String(req.body?.apiBaseUrl || process.env.GROQ_API_BASE_URL || 'https://api.groq.com/openai/v1').trim();
  const model = String(req.body?.model || process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct').trim();

  if (!text && !imageDataUrl) return res.status(400).json({ error: 'No clipboard payload provided' });

  const systemPrompt = [
    'You extract Korean place information for a travel planner.',
    'Return strict JSON only.',
    'Schema:',
    '{"name":"","address":"","business":{"open":"","close":"","breakStart":"","breakEnd":"","lastOrder":"","entryClose":"","closedDays":[]},"menus":[{"name":"","price":0}]}',
    `Current extraction mode: ${mode}.`,
    'If mode is "address", prioritize address extraction and keep business/menus empty when uncertain.',
    'If mode is "business", prioritize business hours and keep menus empty when uncertain.',
    'If mode is "menus", prioritize menus and keep business empty when uncertain.',
    'If mode is "all", fill every field you can infer.',
    'For prices, return integers without currency symbols.',
    'For unknown fields, use empty strings, empty arrays, or null business.',
  ].join('\n');

  const userContent = [];
  if (text) userContent.push({ type: 'text', text: `Clipboard text:\n${text}` });
  if (imageDataUrl) userContent.push({ type: 'image_url', image_url: { url: imageDataUrl } });
  userContent.push({ type: 'text', text: 'Respond with strict JSON only. Do not include markdown blocks or extra text.' });

  // Multimodal 미지원 모델 호환성을 위한 메시지 구조 처리
  let finalMessages;
  if (!imageDataUrl && text) {
    finalMessages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Clipboard text:\n${text}\n\nRespond with strict JSON ONLY.` },
    ];
  } else {
    finalMessages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ];
  }

  try {
    const isScoutModel = /llama-4-scout/i.test(model);
    const requestBody = {
      model,
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      messages: finalMessages,
    };

    if (!isScoutModel) {
      requestBody.response_format = { type: 'json_object' };
    }
    if (shouldUseReasoningEffort(model)) requestBody.reasoning_effort = 'default';

    const response = await fetch(apiBaseUrl.replace(/\/$/, '') + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(requestBody),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Groq analyze failed',
        details: payload?.error?.message || payload?.error || payload,
      });
    }

    const content = payload?.choices?.[0]?.message?.content || '';
    const parsed = extractJsonPayload(content);
    if (!parsed) return res.status(502).json({ error: 'AI response did not contain valid JSON' });

    return res.status(200).json({ result: normalizeResult(parsed) });
  } catch (error) {
    return res.status(500).json({ error: 'Unexpected Groq analyze error', details: error?.message || 'unknown error' });
  }
});
