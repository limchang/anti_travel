import { getAdminDb, verifyBearerToken } from './_firebaseAdmin.js';
import { decryptSecret } from './_crypto.js';
import { setCors, handleOptions } from './_cors.js';

const DAY_TO_INTERNAL = {
  // 한글
  월: 'mon', 화: 'tue', 수: 'wed', 목: 'thu', 금: 'fri', 토: 'sat', 일: 'sun',
  월요일: 'mon', 화요일: 'tue', 수요일: 'wed', 목요일: 'thu', 금요일: 'fri', 토요일: 'sat', 일요일: 'sun',
  // 영문 풀네임
  monday: 'mon', tuesday: 'tue', wednesday: 'wed', thursday: 'thu', friday: 'fri', saturday: 'sat', sunday: 'sun',
  // 영문 약어 (AI가 잘못 출력하는 케이스 방어)
  mon: 'mon', tue: 'tue', wed: 'wed', thu: 'thu', fri: 'fri', sat: 'sat', sun: 'sun',
};
const normalizeClosedDay = (raw) => {
  const key = String(raw || '').trim().toLowerCase();
  return DAY_TO_INTERNAL[key] || DAY_TO_INTERNAL[key.replace(/요일$/, '')] || null;
};

const normalizeBusiness = (business = {}) => ({
  open: String(business?.open || '').trim(),
  close: String(business?.close || '').trim(),
  breakStart: String(business?.breakStart || '').trim(),
  breakEnd: String(business?.breakEnd || '').trim(),
  lastOrder: String(business?.lastOrder || '').trim(),
  entryClose: String(business?.entryClose || '').trim(),
  closedDays: Array.isArray(business?.closedDays)
    ? [...new Set(business.closedDays.map(normalizeClosedDay).filter(Boolean))]
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
  setCors(req, res);
  if (handleOptions(req, res)) return;

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
    'Return strict JSON only — no markdown, no explanation.',
    'Schema:',
    '{"name":"","address":"","business":{"open":"","close":"","breakStart":"","breakEnd":"","lastOrder":"","entryClose":"","closedDays":[]},"menus":[{"name":"","price":0}]}',
    `Current extraction mode: ${mode}.`,
    'If mode is "business", prioritize business hours and keep menus empty when uncertain.',
    'If mode is "menus", prioritize menus and keep business empty when uncertain.',
    'If mode is "all", fill every field you can infer.',
    'For prices, return integers without currency symbols.',
    'For unknown fields, use empty strings, empty arrays, or null business.',
    '',
    '--- closedDays rules (STRICT) ---',
    'closedDays must only contain these exact values: mon, tue, wed, thu, fri, sat, sun',
    'Convert Korean: 월→mon, 화→tue, 수→wed, 목→thu, 금→fri, 토→sat, 일→sun',
    'Convert English full names: monday→mon, tuesday→tue, wednesday→wed, thursday→thu, friday→fri, saturday→sat, sunday→sun',
    'NEVER output Korean names, English full names, "목요일", "thursday", etc. — only the 3-letter internal codes above.',
    '',
    '--- menus rules ---',
    'Extract actual menu items with prices (name string + integer price).',
    'Do NOT include restaurant descriptions, intro sentences, or non-menu content.',
    'If no clear menu name + price pair exists, return an empty array.',
    '',
    '--- uncertainty rule ---',
    'Leave uncertain fields as empty string or empty array. Do not guess or fabricate values.',
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
    text: 'Respond with strict JSON only. Do not include markdown blocks or extra text.',
  });

  // Multimodal을 지원하지 않는 모델이나 특정 가이드 준수를 위해 텍스트만 있는 경우 문자열로 변환
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

    // Scout 모델이거나 특정 모델의 경우 response_format이 거부 사유가 될 수 있으므로 조건부 적용
    if (!isScoutModel) {
      requestBody.response_format = { type: 'json_object' };
    }
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
