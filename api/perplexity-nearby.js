import { getAdminDb, verifyBearerToken } from './_firebaseAdmin.js';
import { decryptSecret } from './_crypto.js';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_MODEL = process.env.PERPLEXITY_MODEL || 'sonar';
const GEMINI_MODEL = process.env.GEMINI_NEARBY_MODEL || process.env.GEMINI_LINK_MODEL || 'gemini-2.5-flash';

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

const getStoredPerplexityApiKey = async (req) => {
  try {
    const decodedToken = await verifyBearerToken(req);
    const snap = await getAdminDb().doc(`users/${decodedToken.uid}/private/ai`).get();
    const cipher = snap.data()?.perplexityKeyCipher;
    if (!cipher?.content) return '';
    return decryptSecret(cipher);
  } catch {
    return '';
  }
};

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

const normalizeRecommendation = (item = {}) => ({
  name: String(item?.name || '').trim(),
  address: String(item?.address || '').trim(),
  category: String(item?.category || '').trim(),
  why: String(item?.why || item?.reason || '').trim(),
  suggestedTime: String(item?.suggestedTime || '').trim(),
  estimatedTravelMinutes: Math.max(0, Number(item?.estimatedTravelMinutes) || 0),
  hoursSummary: String(item?.hoursSummary || '').trim(),
  priceNote: String(item?.priceNote || '').trim(),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const requestApiKey = String(req.body?.perplexityApiKey || '').trim();
  const requestGeminiApiKey = String(req.body?.geminiApiKey || '').trim();
  const perplexityApiKey = requestApiKey || await getStoredPerplexityApiKey(req) || process.env.PERPLEXITY_API_KEY;
  const geminiApiKey = requestGeminiApiKey || await getStoredGeminiApiKey(req) || process.env.GEMINI_API_KEY;
  if (!perplexityApiKey && !geminiApiKey) {
    return res.status(500).json({ error: 'PERPLEXITY_API_KEY or GEMINI_API_KEY is not configured' });
  }

  const placeName = String(req.body?.placeName || '').trim();
  const placeAddress = String(req.body?.placeAddress || '').trim();
  if (!placeName || !placeAddress) {
    return res.status(400).json({ error: 'placeName and placeAddress are required' });
  }

  const tripRegion = String(req.body?.tripRegion || '').trim();
  const dayLabel = String(req.body?.dayLabel || '').trim();
  const dateLabel = String(req.body?.dateLabel || '').trim();
  const currentStartTime = String(req.body?.currentStartTime || '').trim();
  const currentEndTime = String(req.body?.currentEndTime || '').trim();
  const nextItemName = String(req.body?.nextItemName || '').trim();
  const nextItemAddress = String(req.body?.nextItemAddress || '').trim();
  const nextItemStartTime = String(req.body?.nextItemStartTime || '').trim();
  const currentBusinessSummary = String(req.body?.currentBusinessSummary || '').trim();
  const userPrompt = [
    `현재 여행 지역: ${tripRegion || '정보 없음'}`,
    `현재 일정 일자: ${dayLabel || '정보 없음'} ${dateLabel || ''}`.trim(),
    `현재 장소: ${placeName}`,
    `현재 주소: ${placeAddress}`,
    `현재 일정 시작 시각: ${currentStartTime || '정보 없음'}`,
    `현재 일정 종료 예상 시각: ${currentEndTime || '정보 없음'}`,
    `현재 장소 운영정보 요약: ${currentBusinessSummary || '정보 없음'}`,
    `다음 일정 이름: ${nextItemName || '없음'}`,
    `다음 일정 주소: ${nextItemAddress || '없음'}`,
    `다음 일정 시작 시각: ${nextItemStartTime || '없음'}`,
    '해야 할 일:',
    '1. 현재 장소 기준으로 근처에서 들르기 좋은 장소 3곳만 추천',
    '2. 현재 일정 종료 시각과 다음 일정 시작 시각 사이에 현실적으로 넣을 수 있는지 우선 판단',
    '3. 영업시간, 휴무 가능성, 이동 시간을 고려해 추천',
    '4. 관광/카페/식당 등 카테고리도 함께 제안',
    '5. JSON 형식으로만 응답',
    'JSON 스키마:',
    '{"summary":"","recommendations":[{"name":"","address":"","category":"","why":"","suggestedTime":"","estimatedTravelMinutes":0,"hoursSummary":"","priceNote":""}]}',
  ].join('\n');

  try {
    if (perplexityApiKey) {
      const response = await fetch(PERPLEXITY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${perplexityApiKey}`,
        },
        body: JSON.stringify({
          model: PERPLEXITY_MODEL,
          temperature: 0.2,
          messages: [
            {
              role: 'system',
              content: [
                '너는 한국 여행 동선을 추천하는 전문가다.',
                '반드시 실제 영업시간과 위치를 최대한 확인해서 현실적으로 이동 가능한 추천만 해야 한다.',
                '응답은 반드시 JSON 객체 하나로만 반환한다.',
              ].join(' '),
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (response.ok) {
        const content = payload?.choices?.[0]?.message?.content || '';
        const parsed = extractJsonPayload(content);
        if (!parsed) {
          return res.status(502).json({ error: 'Perplexity response did not contain valid JSON' });
        }

        return res.status(200).json({
          provider: 'perplexity',
          summary: String(parsed?.summary || '').trim(),
          recommendations: Array.isArray(parsed?.recommendations) ? parsed.recommendations.map(normalizeRecommendation).filter((item) => item.name) : [],
          citations: Array.isArray(payload?.citations) ? payload.citations.filter(Boolean).map((url) => String(url)) : [],
        });
      }
    }

    if (!geminiApiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: [
              '너는 한국 여행 동선을 추천하는 전문가다.',
              '반드시 실제 영업시간과 위치를 최대한 확인해서 현실적으로 이동 가능한 추천만 해야 한다.',
              '응답은 반드시 JSON 객체 하나로만 반환한다.',
            ].join(' '),
          }],
        },
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.2,
        },
        contents: [{
          role: 'user',
          parts: [{ text: userPrompt }],
        }],
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Gemini nearby recommend failed',
        details: payload?.error?.message || payload?.error?.status || payload,
      });
    }

    const content = payload?.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('\n') || '';
    const parsed = extractJsonPayload(content);
    if (!parsed) {
      return res.status(502).json({ error: 'Gemini response did not contain valid JSON' });
    }

    const citations = (payload?.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .map((chunk) => chunk?.web?.uri || '')
      .filter(Boolean);

    return res.status(200).json({
      provider: 'gemini',
      summary: String(parsed?.summary || '').trim(),
      recommendations: Array.isArray(parsed?.recommendations) ? parsed.recommendations.map(normalizeRecommendation).filter((item) => item.name) : [],
      citations,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Unexpected AI nearby recommend error',
      details: error?.message || 'unknown error',
    });
  }
}
