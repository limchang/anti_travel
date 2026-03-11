import { getAdminDb, verifyBearerToken } from './_firebaseAdmin.js';
import { decryptSecret } from './_crypto.js';

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
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
};

const normalizeResult = (raw = {}) => ({
  name: String(raw?.name || '').trim(),
  address: String(raw?.address || '').trim(),
  business: raw?.business ? normalizeBusiness(raw.business) : null,
  menus: Array.isArray(raw?.menus)
    ? raw.menus
      .map((item) => ({
        name: String(item?.name || '').trim(),
        price: Number(item?.price) || 0,
      }))
      .filter((item) => item.name)
    : [],
});

const shouldUseReasoningEffort = (model = '') => /qwen\/qwen3|gpt-oss/i.test(String(model || ''));

const getStoredUserApiKey = async (req) => {
  try {
    const decodedToken = await verifyBearerToken(req);
    const snap = await getAdminDb().doc(`users/${decodedToken.uid}/private/ai`).get();
    const cipher = snap.data()?.groqKeyCipher;
    if (!cipher?.content) return '';
    return decryptSecret(cipher);
  } catch {
    return '';
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const requestApiKey = String(req.body?.apiKey || '').trim();
  const apiKey = requestApiKey || await getStoredUserApiKey(req) || process.env.GROQ_API_KEY || process.env.XAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured' });
  }

  const mode = String(req.body?.mode || 'all');
  const text = String(req.body?.text || '');
  const imageDataUrl = String(req.body?.imageDataUrl || '');
  const apiBaseUrl = String(req.body?.apiBaseUrl || process.env.GROQ_API_BASE_URL || 'https://api.groq.com/openai/v1').trim();
  const model = String(req.body?.model || process.env.GROQ_MODEL || process.env.XAI_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct').trim();

  if (!text && !imageDataUrl) {
    return res.status(400).json({ error: 'No clipboard payload provided' });
  }

  const systemPrompt = [
    'You extract Korean place information for a travel planner.',
    'Return strict JSON only.',
    'Schema:',
    '{"name":"","address":"","business":{"open":"","close":"","breakStart":"","breakEnd":"","lastOrder":"","entryClose":"","closedDays":[]},"menus":[{"name":"","price":0}]}',
    `Current extraction mode: ${mode}.`,
    'If mode is "business", prioritize business hours and keep menus empty when uncertain.',
    'If mode is "menus", prioritize menus and keep business empty when uncertain.',
    'If mode is "all", fill every field you can infer.',
    'For prices, return integers without currency symbols.',
    'For unknown fields, use empty strings, empty arrays, or null business.',
  ].join('\n');

  const userContent = [];
  if (text) {
    userContent.push({
      type: 'text',
      text: `Clipboard text:\n${text}`,
    });
  }
  if (imageDataUrl) {
    userContent.push({
      type: 'image_url',
      image_url: { url: imageDataUrl },
    });
  }
  userContent.push({
    type: 'text',
    text: 'Respond with JSON only.',
  });

  try {
    const requestBody = {
      model,
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
    };
    if (shouldUseReasoningEffort(model)) {
      requestBody.reasoning_effort = 'default';
    }

    const response = await fetch(apiBaseUrl.replace(/\/$/, '') + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
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
    if (!parsed) {
      return res.status(502).json({ error: 'AI response did not contain valid JSON' });
    }

    return res.status(200).json({ result: normalizeResult(parsed) });
  } catch (error) {
    return res.status(500).json({
      error: 'Unexpected Groq analyze error',
      details: error?.message || 'unknown error',
    });
  }
}
