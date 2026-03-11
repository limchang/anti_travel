import { getAdminDb, verifyBearerToken } from './_firebaseAdmin.js';
import { decryptSecret } from './_crypto.js';

const GEMINI_LINK_MODEL = process.env.GEMINI_LINK_MODEL || 'gemini-2.5-flash';
const GEMINI_LINK_SYSTEM_PROMPT = '너는 장소 정보를 추출하는 전문가야. 제공된 URL이나 텍스트에서 상호명, 주소, 영업시간, 휴일, 라스트 오더 정보를 찾아서 JSON 형식으로만 응답해줘.';

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

const normalizeClosedDays = (rawClosedDays = []) => {
  const weekdayMap = {
    mon: 'mon', tue: 'tue', wed: 'wed', thu: 'thu', fri: 'fri', sat: 'sat', sun: 'sun',
    월: 'mon', 화: 'tue', 수: 'wed', 목: 'thu', 금: 'fri', 토: 'sat', 일: 'sun',
  };
  return Array.isArray(rawClosedDays)
    ? [...new Set(rawClosedDays.map((day) => weekdayMap[String(day || '').trim().slice(0, 3)] || weekdayMap[String(day || '').trim()] || '').filter(Boolean))]
    : [];
};

const normalizeResult = (raw = {}) => ({
  name: String(raw?.name || '').trim(),
  address: String(raw?.address || '').trim(),
  business: raw?.business ? {
    open: String(raw?.business?.open || '').trim(),
    close: String(raw?.business?.close || '').trim(),
    breakStart: String(raw?.business?.breakStart || '').trim(),
    breakEnd: String(raw?.business?.breakEnd || '').trim(),
    lastOrder: String(raw?.business?.lastOrder || '').trim(),
    entryClose: String(raw?.business?.entryClose || '').trim(),
    closedDays: normalizeClosedDays(raw?.business?.closedDays),
  } : null,
  menus: [],
});

const getStoredGeminiApiKey = async (req) => {
  try {
    const decodedToken = await verifyBearerToken(req);
    const snap = await getAdminDb().doc(`users/${decodedToken.uid}/private/ai`).get();
    const cipher = snap.data()?.geminiKeyCipher;
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

  const url = String(req.body?.url || '').trim();
  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }

  const requestApiKey = String(req.body?.geminiApiKey || '').trim();
  const apiKey = requestApiKey || await getStoredGeminiApiKey(req) || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_LINK_MODEL}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: GEMINI_LINK_SYSTEM_PROMPT }],
        },
        tools: [{ url_context: {} }, { google_search: {} }],
        generationConfig: {
          temperature: 0.2,
        },
        contents: [{
          role: 'user',
          parts: [{
            text: [
              `이 링크 정보 좀 분석해서 정리해줘: ${url}`,
              '아래 JSON 형식으로만 응답해줘.',
              '{"name":"","address":"","business":{"open":"","close":"","breakStart":"","breakEnd":"","lastOrder":"","entryClose":"","closedDays":[]},"menus":[]}',
            ].join('\n'),
          }],
        }],
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Gemini link analyze failed',
        details: payload?.error?.message || payload?.error?.status || payload,
      });
    }
    const content = payload?.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('\n') || '';
    const parsed = extractJsonPayload(content);
    if (!parsed) {
      return res.status(502).json({ error: 'Gemini response did not contain valid JSON' });
    }
    return res.status(200).json({ result: normalizeResult(parsed) });
  } catch (error) {
    return res.status(500).json({
      error: 'Unexpected Gemini analyze error',
      details: error?.message || 'unknown error',
    });
  }
}
