import { db, auth } from '../firebase.js';
import { normalizeGeoPoint, hasGeoCoords } from './geo.js';
import { normalizeBusiness, extractTimesFromText } from './time.js';
import { NAVER_PARSE_STOP_WORDS, KAKAO_API_KEY, ADDRESS_REGEX } from './constants.js';
import { parseBusinessHoursText, isLikelyParsedAddress, isLikelyMenuPriceLine, isLikelyMenuNameLine } from './parse.js';
import { safeLocalStorageGet } from './storage.js';

export const extractPlaceNameFromLines = (lines = []) => {
  for (const raw of lines) {
    const line = String(raw || '').trim();
    if (!line || NAVER_PARSE_STOP_WORDS.has(line)) continue;
    if (/^https?:\/\//i.test(line)) continue;
    if (isLikelyParsedAddress(line)) continue;
    if (/(방문자\s*리뷰|블로그\s*리뷰|별점|라스트오더|브레이크타임|영업\s*중|이미지\s*갯수|육류,고기요리|,카페|,한식|,중식|,양식|,일식)/.test(line)) {
      const cleaned = line
        .replace(/별점.*$/g, '')
        .replace(/방문자\s*리뷰.*$/g, '')
        .replace(/블로그\s*리뷰.*$/g, '')
        .replace(/(육류,고기요리|카페|한식|중식|양식|일식|베이커리|디저트|바\(BAR\)|펍|포장마차|분식|면요리|패스트푸드|피자|치킨|햄버거|스테이크|패밀리레스토랑|뷔페|해산물|일식당|고기집|한정식|백반|국밥|찌개|전골|탕|칼국수|수제비|냉면|소바|우동|이자카야|스시|라멘|돈가스|덮밥|카레|중식당|짜장면|짬뽕|마라탕|양꼬치|이탈리안|프랑스요리|스페인요리|태국요리|베트남요리|인도요리|멕시코요리|브런치|샌드위치|도너츠|케이크|쿠키|마카롱|빙수|전통찻집|호프|와인바|칵테일바)\s*$/g, '')
        .replace(/,\s*$/, '')
        .trim();
      if (cleaned && cleaned !== line && isLikelyMenuNameLine(cleaned)) return cleaned;
      continue;
    }
    if (isLikelyMenuNameLine(line)) return line;
  }
  return '';
};

export const extractMenusFromNaverLines = (lines = []) => {
  const menus = [];
  let block = [];

  const flushBlock = () => {
    if (block.length === 0) return;
    const priceLine = block.find((line) => isLikelyMenuPriceLine(line));
    const fixedPrice = priceLine && /^[0-9][0-9,]*원$/.test(priceLine)
      ? Number(priceLine.replace(/[^0-9]/g, '')) || 0
      : 0;
    const hasSuspiciousZeroPrice = priceLine === '0원';
    const name = block.find((line) => isLikelyMenuNameLine(line));
    if (name && (fixedPrice > 0 || hasSuspiciousZeroPrice) && !menus.find((item) => item.name === name)) {
      menus.push({ name, price: fixedPrice });
    }
    block = [];
  };

  lines.forEach((raw) => {
    const line = String(raw || '').trim();
    if (!line) return;
    if (isLikelyMenuPriceLine(line)) {
      block.push(line);
      flushBlock();
      return;
    }
    if (NAVER_PARSE_STOP_WORDS.has(line) || /^(주소|영업시간|전화번호|편의|저장 폴더)$/.test(line)) {
      flushBlock();
      return;
    }
    block.push(line);
    if (block.length > 4) block = block.slice(-4);
  });

  flushBlock();
  return menus;
};

export const parseNaverMapText = (text = '') => {
  const lines = String(text).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const res = {
    name: '',
    address: '',
    business: null,
    menus: []
  };

  res.name = extractPlaceNameFromLines(lines);

  // 주소: '주소' 키워드 다음 줄
  const addrIdx = lines.findIndex(l => l === '주소');
  if (addrIdx !== -1 && lines[addrIdx + 1]) {
    res.address = lines[addrIdx + 1];
  }

  // 영업시간: '영업시간' 키워드 다음
  const bizIdx = lines.findIndex(l => l === '영업시간');
  if (bizIdx !== -1) {
    const endIdx = lines.findIndex((l, i) => i > bizIdx && (l === '접기' || l === '전화번호' || l === '가격표' || l === '블로그'));
    const bizText = lines.slice(bizIdx + 1, endIdx !== -1 ? endIdx : undefined).join('\n');
    res.business = parseBusinessHoursText(bizText);
  }

  // 가격표: '가격표' 키워드 다음
  const priceIdx = lines.findIndex(l => l === '가격표');
  if (priceIdx !== -1) {
    const endIdx = lines.findIndex((l, i) => i > priceIdx && (l === '가격표 이미지로 보기' || l === '블로그' || l === '편의' || l === '리뷰'));
    const menuLines = lines.slice(priceIdx + 1, endIdx !== -1 ? endIdx : undefined);
    res.menus = extractMenusFromNaverLines(menuLines);
  } else {
    res.menus = extractMenusFromNaverLines(lines);
  }

  return res;
};

export const normalizeSmartFillResult = (raw = {}) => {
  const menus = Array.isArray(raw?.menus)
    ? raw.menus
      .filter(Boolean)
      .map((item) => ({
        name: String(item?.name || '').trim(),
        price: Number(item?.price) || 0,
      }))
      .filter((item) => item.name)
    : [];

  const VALID_TYPES = new Set(['food','cafe','tour','lodge','stay','ship','rest','pickup','openrun','view','experience','souvenir','place','quick']);
  const types = Array.isArray(raw?.types)
    ? raw.types.map((t) => String(t || '').trim().toLowerCase()).filter((t) => VALID_TYPES.has(t))
    : [];

  return {
    name: String(raw?.name || '').trim(),
    address: String(raw?.address || '').trim(),
    business: raw?.business ? normalizeBusiness(raw.business) : null,
    menus,
    types,
  };
};

export const DEFAULT_AI_SMART_FILL_CONFIG = {
  apiKey: '',
  geminiApiKey: '',
  perplexityApiKey: '',
  apiBaseUrl: 'https://api.groq.com/openai/v1',
  model: 'meta-llama/llama-4-scout-17b-16e-instruct',
  proxyBaseUrl: '',
};

export const GEMINI_LINK_MODEL = 'gemini-2.5-flash';
export const GEMINI_LINK_SYSTEM_PROMPT = `너는 대한민국 장소 정보를 추출하는 전문가야. 제공된 URL이나 텍스트에서 상호명, 주소, 영업시간, 휴일, 라스트 오더 정보를 추출해.

### CRITICAL RULES DO NOT FAIL:
1. **상호명(name) 정제**: 상호명 뒤에 붙어있는 '식당', '카페', '베이커리', '한식', '일식' 같은 업종 태그는 무조건 제거해. 
   - 예: "스타벅스 성수점 카페" -> "스타벅스 성수점"
   - 예: "맛있는갈비 육류,고기요리" -> "맛있는갈비"
2. **JSON 형식 엄수**: 응답은 오직 JSON 형식으로만 해. 다른 텍스트는 섞지 마.
3. **분석 범위**: 주소뿐만 아니라 정확한 영업시간 스케줄을 "10:00~20:00" 같은 형태로 추출해.
4. **메뉴 가격 규칙**: OCR 텍스트에 메뉴명 바로 뒤에 "0원"이 보이면 무료로 단정하지 마. 주변 숫자 문맥으로 가능한 실제 가격을 추정하고, 정확한 금액을 못 찾더라도 메뉴명은 유지해.`;

export const normalizeAiSmartFillConfig = (raw = {}) => ({
  apiKey: String(raw?.apiKey || '').trim(),
  geminiApiKey: String(raw?.geminiApiKey || '').trim(),
  perplexityApiKey: String(raw?.perplexityApiKey || '').trim(),
  apiBaseUrl: String(raw?.apiBaseUrl || 'https://api.groq.com/openai/v1').trim() || 'https://api.groq.com/openai/v1',
  model: String(raw?.model || 'meta-llama/llama-4-scout-17b-16e-instruct').trim() || 'meta-llama/llama-4-scout-17b-16e-instruct',
  proxyBaseUrl: String(raw?.proxyBaseUrl || '').trim(),
});

export const sanitizeAiSmartFillConfigForStorage = (raw = {}) => {
  const normalized = normalizeAiSmartFillConfig(raw);
  return { ...normalized, apiKey: '', geminiApiKey: '', perplexityApiKey: '' };
};

export const isLocalNetworkHost = (hostname = '') => {
  const value = String(hostname || '').trim().toLowerCase();
  if (!value) return false;
  if (value === 'localhost' || value === '127.0.0.1' || value === '::1') return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(value)) return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(value)) return true;
  return false;
};

export const getAiKeyEndpoint = () => {
  if (typeof window !== 'undefined' && isLocalNetworkHost(window.location.hostname)) {
    return '/api/ai-key';
  }
  return import.meta.env.VITE_AI_KEY_URL || '/api/ai-key';
};

export const getAiKeyEndpointCandidates = () => Array.from(new Set([
  getAiKeyEndpoint(),
  import.meta.env.VITE_AI_KEY_URL || '',
  '/api/ai-key',
].filter(Boolean)));

export const getPerplexityNearbyEndpoint = () => {
  if (typeof window !== 'undefined' && isLocalNetworkHost(window.location.hostname)) {
    return '/api/perplexity-nearby';
  }
  return import.meta.env.VITE_PERPLEXITY_NEARBY_URL || '/api/perplexity-nearby';
};

export const getRouteVerifyEndpointCandidates = (proxyBase = '') => {
  const normalizedProxyBase = String(proxyBase || '').trim().replace(/\/$/, '');
  const envApiBase = String(import.meta.env.VITE_AI_ANALYZE_API_BASE || '').trim().replace(/\/$/, '');
  return Array.from(new Set([
    normalizedProxyBase ? `${normalizedProxyBase}/api/route-verify` : '',
    envApiBase ? `${envApiBase}/api/route-verify` : '',
    import.meta.env.VITE_ROUTE_VERIFY_URL || '',
    'https://asia-northeast3-anti-planer.cloudfunctions.net/routeVerify',
    typeof window !== 'undefined' && isLocalNetworkHost(window.location.hostname) ? '/api/route-verify' : '',
    '/api/route-verify',
  ].filter(Boolean)));
};

export const getSmartFillErrorMessage = (error, aiEnabled = false) => {
  const message = String(error?.message || '').trim();
  if (!message) {
    return aiEnabled ? 'Groq 스마트 붙여넣기에 실패했습니다.' : '스마트 붙여넣기에 실패했습니다.';
  }
  if (/NAVER_URL_ONLY/i.test(message)) return '네이버 지도 URL만으로는 자동 채우기가 불가합니다. 네이버 지도 페이지에서 텍스트를 길게 눌러 전체 선택 후 복사해 다시 시도해 주세요.';
  if (/Image smart fill requires AI/i.test(message)) return '이미지 스마트 붙여넣기는 AI를 켠 상태에서만 사용할 수 있습니다.';
  if (/No clipboard payload provided/i.test(message)) return '클립보드에 텍스트나 이미지가 없습니다.';
  if (/notallowederror|denied|clipboard/i.test(message)) return '클립보드 접근 권한을 허용해 주세요.';
  if (/GEMINI_API_KEY is not configured/i.test(message)) return 'Gemini 링크 분석용 API 키를 AI 설정에서 먼저 입력해 주세요.';
  if (/Gemini response did not contain valid JSON/i.test(message)) return 'Gemini 링크 분석 응답을 해석하지 못했습니다. 다시 시도해 주세요.';
  if (/Gemini/i.test(message)) return `Gemini 링크 분석 실패: ${message}`;
  if (/GROQ_API_KEY is not configured/i.test(message)) return 'Groq 설정이 비어 있습니다. AI 설정에서 API 키 또는 프록시를 확인해 주세요.';
  if (/did not contain valid JSON/i.test(message)) return 'Groq 응답 형식을 해석하지 못했습니다. 다시 시도해 주세요.';
  if (/HTTP 405/i.test(message)) return `AI 서버 연결에 실패했습니다(405). 현재 사용 중인 도메인이 AI 서버 허용 목록에 있는지 확인해 주세요.`;
  if (/HTTP 4\d\d/i.test(message)) return `Groq 요청이 거부되었습니다. (${message})`;
  if (/HTTP 5\d\d/i.test(message)) return `Groq 서버 응답에 실패했습니다. (${message})`;
  return aiEnabled ? `Groq 스마트 붙여넣기 실패: ${message}` : `스마트 붙여넣기 실패: ${message}`;
};

export const isAiSmartFillSource = (source = '') => ['ai', 'gemini'].includes(String(source || '').trim());

export const shouldUseReasoningEffort = (model = '') => /qwen\/qwen3|gpt-oss/i.test(String(model || ''));
export const extractNaverMapLink = (raw = '') => {
  const m = String(raw || '').match(/https?:\/\/(?:naver\.me|map\.naver\.com|pcmap\.place\.naver\.com|m\.place\.naver\.com)\/[^\s)>\]"']+/i);
  if (!m?.[0]) return '';
  return m[0].replace(/[),.;]+$/, '');
};

export const normalizeClosedDaysInput = (rawClosedDays = []) => {
  const weekdayMap = { 월: 'mon', 화: 'tue', 수: 'wed', 목: 'thu', 금: 'fri', 토: 'sat', 일: 'sun', mon: 'mon', tue: 'tue', wed: 'wed', thu: 'thu', fri: 'fri', sat: 'sat', sun: 'sun' };
  return Array.isArray(rawClosedDays)
    ? [...new Set(rawClosedDays.map((day) => weekdayMap[String(day || '').trim().slice(0, 3)] || weekdayMap[String(day || '').trim()] || '').filter(Boolean))]
    : [];
};

export const normalizeGeminiLinkResult = (raw = {}) => normalizeSmartFillResult({
  name: String(raw?.name || '').trim(),
  address: String(raw?.address || '').trim(),
  business: {
    open: String(raw?.business?.open || '').trim(),
    close: String(raw?.business?.close || '').trim(),
    breakStart: String(raw?.business?.breakStart || '').trim(),
    breakEnd: String(raw?.business?.breakEnd || '').trim(),
    lastOrder: String(raw?.business?.lastOrder || '').trim(),
    entryClose: String(raw?.business?.entryClose || '').trim(),
    closedDays: normalizeClosedDaysInput(raw?.business?.closedDays),
  },
  menus: Array.isArray(raw?.menus) ? raw.menus : [],
});

export const fetchGeminiPlaceInfoFromMapLink = async ({ url, geminiApiKey, bearerToken = '' }) => {
  const cleanUrl = String(url || '').trim();
  const cleanKey = String(geminiApiKey || '').trim();
  if (!cleanUrl) return null;
  const envApiBase = (import.meta.env.VITE_AI_ANALYZE_API_BASE || '').replace(/\/$/, '');
  const endpointCandidates = Array.from(new Set([
    envApiBase ? `${envApiBase}/api/gemini-link-analyze` : '',
    '/api/gemini-link-analyze',
  ].filter(Boolean)));

  let lastError = null;
  for (const endpoint of endpointCandidates) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        },
        body: JSON.stringify({
          url: cleanUrl,
          geminiApiKey: cleanKey,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.details || data?.error || `HTTP ${response.status}`);
      }
      return normalizeGeminiLinkResult(data?.result || data);
    } catch (error) {
      lastError = error;
    }
  }

  if (!cleanKey) throw lastError || new Error('GEMINI_API_KEY is not configured');

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_LINK_MODEL}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': cleanKey,
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
            `이 링크 정보 좀 분석해서 정리해줘: ${cleanUrl}`,
            '아래 JSON 형식으로만 응답해줘.',
            '{"name":"","address":"","business":{"open":"","close":"","breakStart":"","breakEnd":"","lastOrder":"","entryClose":"","closedDays":[]},"menus":[]}',
          ].join('\n'),
        }],
      }],
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || data?.error?.status || data?.error || `Gemini HTTP ${response.status}`);
  }
  const rawText = data?.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('\n') || '';
  const parsed = extractJsonPayload(rawText);
  if (!parsed) throw new Error('Gemini response did not contain valid JSON');
  return normalizeGeminiLinkResult(parsed);
};

export const scrapePlaceFromMapLinkUrl = async (url) => {
  const cleanUrl = String(url || '').trim();
  if (!cleanUrl) return null;
  const apiBase = (import.meta.env.VITE_SCRAPER_API_BASE || '').replace(/\/$/, '');
  const candidates = Array.from(new Set([
    apiBase ? `${apiBase}/api/scrape` : '',
    '/api/scrape',
  ].filter(Boolean)));

  let data = null;
  let lastErr = null;
  for (const endpoint of candidates) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.details || errBody?.error || `HTTP ${res.status}`);
      }
      data = await res.json();
      if (data) break;
    } catch (err) {
      lastErr = err;
    }
  }
  if (!data) throw lastErr || new Error('스크래핑 응답이 없습니다.');

  const parsedBusiness = parseBusinessHoursText(String(data?.hours || ''));
  const parsedMenus = Array.isArray(data?.menus)
    ? data.menus
      .map((m) => ({ name: String(m?.name || '').trim(), price: Number(m?.price) || 0 }))
      .filter((m) => m.name && m.price >= 0)
    : [];

  return normalizeSmartFillResult({
    name: String(data?.title || '').trim(),
    address: String(data?.address || '').trim(),
    business: parsedBusiness,
    menus: parsedMenus,
  });
};

export const extractJsonPayload = (text = '') => {
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

export const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(String(reader.result || ''));
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});

export const readClipboardPayload = async () => {
  let text = '';
  let imageDataUrl = '';
  let lastClipboardError = null;

  if (navigator?.clipboard?.read) {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        if (!text && item.types.includes('text/plain')) {
          const textBlob = await item.getType('text/plain');
          text = await textBlob.text();
        }
        const imageType = item.types.find((type) => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          imageDataUrl = await blobToDataUrl(blob);
          if (text) break;
        }
      }
    } catch (error) {
      lastClipboardError = error;
    }
  }

  if (navigator?.clipboard?.readText) {
    try {
      text = text || await navigator.clipboard.readText();
    } catch (error) {
      lastClipboardError = lastClipboardError || error;
    }
  }

  if (!text && !imageDataUrl && lastClipboardError) {
    throw lastClipboardError;
  }

  return { text: String(text || ''), imageDataUrl: String(imageDataUrl || '') };
};

export const getCurrentUserBearerToken = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.isGuest) return '';
    return await currentUser.getIdToken();
  } catch {
    return '';
  }
};

export const runGroqSmartFill = async ({
  mode = 'all', text = '', imageDataUrl = '',
  aiSettings = DEFAULT_AI_SMART_FILL_CONFIG,
  inputType = 'text',
  instructions = '',
  learningContext = []
} = {}) => {
  const normalizedSettings = normalizeAiSmartFillConfig(aiSettings);
  const directApiKey = normalizedSettings.apiKey;
  const bearerToken = await getCurrentUserBearerToken();
  let lastError = null;

  if (directApiKey) {
    try {
      const systemContent = [
        'You extract Korean place information for a travel planner.',
        'Return strict JSON only.',
        `Current extraction mode: ${mode}.`,
        'Schema: {"name":"","address":"","types":[],"business":{"open":"","close":"","breakStart":"","breakEnd":"","lastOrder":"","entryClose":"","closedDays":[]},"menus":[{"name":"","price":0}]}',
        'For the "types" field, infer the category from context and use one or more of these values: food, cafe, tour, lodge, stay, ship, rest, pickup, openrun, view, experience, souvenir, place. Examples: restaurant→["food"], coffee shop→["cafe"], attraction→["tour"], hotel→["lodge","stay"], scenic viewpoint→["tour","view"].',
        'For menu extraction, if OCR or copied text shows "0원", do not assume the menu is free.',
        'When a menu name appears right before "0원", keep that menu in the result and infer the most plausible non-zero price from nearby context when possible.',
        'If the exact non-zero price cannot be recovered, still keep the menu name with price 0 instead of dropping the menu.',
      ];

      if (instructions) {
        systemContent.push('\n### IMPORTANT GUIDELINES FROM USER:');
        systemContent.push(instructions);
      }

      if (learningContext?.length > 0) {
        systemContent.push('\n### LEARN FROM PREVIOUS CORRECTIONS (FEW-SHOT):');
        learningContext.forEach((c, idx) => {
          systemContent.push(`Case #${idx + 1}:`);
          systemContent.push(`- AI originally extracted: ${JSON.stringify(c.aiResult)}`);
          systemContent.push(`- USER CORRECTED TO (FOLLOW THIS PATTERN): ${JSON.stringify(c.userFixed)}`);
        });
      }

      const requestBody = {
        model: normalizedSettings.model,
        temperature: 0.1, // 정밀도 향상을 위해 낮춤
        max_completion_tokens: 1024,
        top_p: 1,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: systemContent.join('\n'),
          },
          {
            role: 'user',
            content: [
              text ? { type: 'text', text: `Clipboard text:\n${text}` } : null,
              imageDataUrl ? { type: 'image_url', image_url: { url: imageDataUrl } } : null,
              { type: 'text', text: 'Respond with JSON only.' },
            ].filter(Boolean),
          },
        ],
      };
      if (shouldUseReasoningEffort(normalizedSettings.model)) {
        requestBody.reasoning_effort = 'default';
      }
      const response = await fetch(`${normalizedSettings.apiBaseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${directApiKey}`,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error?.message || data?.error || `HTTP ${response.status}`);
      }
      const rawContent = data?.choices?.[0]?.message?.content || '';
      const parsedJson = extractJsonPayload(typeof rawContent === 'string' ? rawContent : Array.isArray(rawContent) ? rawContent.map((part) => part?.text || '').join('\n') : '');
      if (parsedJson) {
        return {
          parsed: normalizeSmartFillResult(parsedJson),
          source: 'ai',
          usedImage: !!imageDataUrl,
          inputType,
          rawPayload: { text, imageDataUrl }
        };
      }
      throw new Error('AI response did not contain valid JSON');
    } catch (error) {
      lastError = error;
    }
  }

  const envApiBase = (import.meta.env.VITE_AI_ANALYZE_API_BASE || '').replace(/\/$/, '');
  const proxyBase = normalizedSettings.proxyBaseUrl.replace(/\/$/, '');
  const endpoints = Array.from(new Set([
    proxyBase ? `${proxyBase}/api/groq-analyze` : '',
    envApiBase ? `${envApiBase}/api/groq-analyze` : '',
    import.meta.env.VITE_GROQ_ANALYZE_URL || '',
    '/api/groq-analyze',
    proxyBase ? `${proxyBase}/api/grok-analyze` : '',
    envApiBase ? `${envApiBase}/api/grok-analyze` : '',
    '/api/grok-analyze',
  ].filter(Boolean)));
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        },
        body: JSON.stringify({
          mode,
          text,
          imageDataUrl,
          apiKey: directApiKey,
          apiBaseUrl: normalizedSettings.apiBaseUrl,
          model: normalizedSettings.model,
          instructions, // 프록시 서버에서도 지원할 수 있도록 전달
          learningContext,
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.details || errBody?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return {
        parsed: normalizeSmartFillResult(data?.result || data),
        source: 'ai',
        usedImage: !!imageDataUrl,
        inputType,
        rawPayload: { text, imageDataUrl }
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('GROQ_API_KEY is not configured');
};

export const analyzeClipboardSmartFill = async ({ mode = 'all', aiEnabled = false, aiSettings = DEFAULT_AI_SMART_FILL_CONFIG } = {}) => {
  const payload = await readClipboardPayload();
  const inputType = payload.text && payload.imageDataUrl ? 'mixed' : payload.imageDataUrl ? 'image' : payload.text ? 'text' : 'empty';
  if (!payload.text && !payload.imageDataUrl) return null;
  if (inputType === 'image' && !aiEnabled) {
    throw new Error('Image smart fill requires AI');
  }

  // AI 학습 데이터 페치
  let instructions = '';
  let learningContext = [];
  if (aiEnabled) {
    try {
      const [instrSnap, casesSnap] = await Promise.all([
        getDoc(doc(db, 'meta', 'smartFillGuide')),
        getDocs(query(collection(db, 'meta', 'aiLearning', 'cases'), limit(5)))
      ]);
      instructions = instrSnap.data()?.content || '';
      learningContext = casesSnap.docs.map(d => d.data());
    } catch (e) { console.warn("AI context fetch failed", e); }
  }

  const normalizedSettings = normalizeAiSmartFillConfig(aiSettings);
  const mapUrl = extractNaverMapLink(payload.text);
  if (mapUrl) {
    const bearerToken = await getCurrentUserBearerToken();
    let geminiError = null;
    if (normalizedSettings.geminiApiKey || bearerToken) {
      try {
        const geminiParsed = await fetchGeminiPlaceInfoFromMapLink({ url: mapUrl, geminiApiKey: normalizedSettings.geminiApiKey, bearerToken });
        let finalParsed = geminiParsed;
        if (aiEnabled) {
          try {
            return await runGroqSmartFill({
              mode,
              text: [
                'Gemini extracted the following place information from a Naver Map URL.',
                `Source URL: ${mapUrl}`,
                JSON.stringify(geminiParsed, null, 2),
              ].join('\n\n'),
              imageDataUrl: '',
              aiSettings: normalizedSettings,
              inputType: 'text',
              instructions,
              learningContext
            });
          } catch {
            return {
              parsed: geminiParsed,
              source: 'gemini',
              usedImage: false,
              inputType,
              rawPayload: payload
            };
          }
        }
        return {
          parsed: geminiParsed,
          source: 'gemini',
          usedImage: false,
          inputType,
          rawPayload: payload
        };
      } catch (error) {
        geminiError = error;
      }
    }
    try {
      const parsed = await scrapePlaceFromMapLinkUrl(mapUrl);
      if (parsed?.name || parsed?.address || parsed?.business || parsed?.menus?.length) {
        return {
          parsed,
          source: 'link',
          usedImage: false,
          inputType,
          rawPayload: payload
        };
      }
    } catch (scrapeError) {
      if (geminiError) {
        // Gemini 에러가 명확히 있지만, 뒤에 텍스트가 충분하다면 Groq에게 기회를 줌
        const extraText = String(payload.text || '').replace(mapUrl, '').trim();
        if (extraText.length < 30) throw geminiError;
      }

      // 링크 외의 나머지 텍스트가 너무 짧으면(예: '[네이버 지도]' 등) 사실상 링크만 있는 것으로 간주하여 방어
      const subText = String(payload.text || '').replace(mapUrl, '').trim();
      if (inputType === 'text' && subText.length < 15) {
        throw new Error('NAVER_URL_ONLY');
      }

      // [UPDATE] 네이버 지도 링크인 경우에도 뒤에 텍스트 내용이 많으면 Groq로 Fall-through 허용
      // (단, 링크 정보만 있고 텍스트가 짧으면 무의미한 호출 방지를 위해 거절)
      if (subText.length < 30) {
        if (geminiError) throw geminiError;
        throw new Error('NAVER_URL_ONLY');
      }
    }
  }

  if (aiEnabled) {
    try {
      return await runGroqSmartFill({
        mode,
        text: payload.text,
        imageDataUrl: payload.imageDataUrl,
        aiSettings: normalizedSettings,
        inputType,
        instructions,
        learningContext
      });
    } catch (lastError) {
      if (!payload.text) throw lastError;
    }
  }

  const parsed = parseNaverMapText(payload.text);
  if (!parsed) return null;
  return {
    parsed: normalizeSmartFillResult(parsed),
    source: 'text',
    usedImage: false,
    inputType,
    rawPayload: payload
  };
};

export const searchAddressFromPlaceName = async (keyword, regionHint = '', kakaoKey = KAKAO_API_KEY) => {
  const query = keyword.trim();
  if (!query) return { address: '', source: '', error: '' };
  const searchQuery = `${regionHint?.trim() || ''} ${query}`.trim();
  if (kakaoKey) {
    try {
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(searchQuery)}&size=1`,
        { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
      );
      if (res.ok) {
        const data = await res.json();
        const first = data.documents?.[0];
        if (first) {
          const addr = first.road_address?.address_name || first.address?.address_name || '';
          if (addr) return { address: addr, lat: first.y, lon: first.x, source: '카카오주소' };
        }
      }
    } catch (_) {}
    try {
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(searchQuery)}&size=1`,
        { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
      );
      if (res.ok) {
        const data = await res.json();
        const first = data.documents?.[0];
        if (first) {
          const addr = first.road_address_name || first.address_name || '';
          if (addr) return { address: addr, lat: first.y, lon: first.x, source: '카카오키워드' };
        }
      }
    } catch (_) {}
  }
  return { address: '', source: '카카오', error: '카카오 주소 검색 결과 없음' };
};
