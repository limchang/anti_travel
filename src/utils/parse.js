import { extractTimesFromText, normalizeTimeToken } from './time.js';
import { NAVER_PARSE_STOP_WORDS, WEEKDAY_OPTIONS } from './constants.js';

// 영업시간 텍스트 파싱
export const parseBusinessHoursText = (text = '') => {
  const parsed = { open: '', close: '', breakStart: '', breakEnd: '', lastOrder: '', entryClose: '', closedDays: [] };
  const weekdayMap = { 월: 'mon', 화: 'tue', 수: 'wed', 목: 'thu', 금: 'fri', 토: 'sat', 일: 'sun' };
  const weekdayRanges = {};
  let pendingWeekday = '';
  const lines = String(text)
    .split(/\r?\n/)
    .map(v => v.trim())
    .filter(Boolean);
  const normalizedLines = lines.length ? lines : [String(text).trim()].filter(Boolean);

  normalizedLines.forEach((line) => {
    const lower = line.toLowerCase();
    const times = extractTimesFromText(line);
    const dayMatch = line.match(/^(월|화|수|목|금|토|일)\b/);

    if (/^(월|화|수|목|금|토|일)$/.test(line)) {
      pendingWeekday = line;
      return;
    }
    if (pendingWeekday && times.length >= 2) {
      weekdayRanges[pendingWeekday] = `${times[0]}-${times[1]}`;
      pendingWeekday = '';
    }

    if (dayMatch && /(휴무|정기휴무|휴점|정기\s*휴일)/i.test(lower)) {
      const dayKey = weekdayMap[dayMatch[1]];
      if (dayKey && !parsed.closedDays.includes(dayKey)) parsed.closedDays.push(dayKey);
      return;
    }
    if (/(휴무|정기휴무|휴점|정기\s*휴일)/i.test(lower)) {
      const dayChars = [...new Set((line.match(/[월화수목금토일]/g) || []))];
      dayChars.forEach((dc) => {
        const dayKey = weekdayMap[dc];
        if (dayKey && !parsed.closedDays.includes(dayKey)) parsed.closedDays.push(dayKey);
      });
    }

    if (dayMatch && times.length >= 2) {
      weekdayRanges[dayMatch[1]] = `${times[0]}-${times[1]}`;
    }

    if (times.length === 0) return;
    if (/(라스트\s*오더|last\s*order|lastorder|마감주문)/i.test(lower)) {
      parsed.lastOrder = times[0] || parsed.lastOrder;
      return;
    }
    if (/(입장\s*마감|입장마감|마지막\s*입장|입장\s*종료|last\s*entry|lastentry|ticket\s*cutoff)/i.test(lower)) {
      parsed.entryClose = times[0] || parsed.entryClose;
      return;
    }
    if (/(브레이크|break)/i.test(lower)) {
      parsed.breakStart = times[0] || parsed.breakStart;
      parsed.breakEnd = times[1] || parsed.breakEnd;
      return;
    }
    if (!parsed.open && times[0]) parsed.open = times[0];
    if (!parsed.close && times[1]) parsed.close = times[1];
  });

  const ranges = Object.values(weekdayRanges);
  if (ranges.length > 0) {
    const freq = ranges.reduce((acc, r) => ({ ...acc, [r]: (acc[r] || 0) + 1 }), {});
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const top = sorted[0]?.[0];
    if (top) {
      const [op, cl] = top.split('-');
      if (op) parsed.open = op;
      if (cl) parsed.close = cl;
    }
  }

  const allTimes = extractTimesFromText(String(text));
  if (!parsed.open && allTimes[0]) parsed.open = allTimes[0];
  if (!parsed.close && allTimes[1]) parsed.close = allTimes[1];
  if (!parsed.breakStart && allTimes[2]) parsed.breakStart = allTimes[2];
  if (!parsed.breakEnd && allTimes[3]) parsed.breakEnd = allTimes[3];
  if (!parsed.lastOrder && allTimes[4]) parsed.lastOrder = allTimes[4];
  if (!parsed.entryClose && allTimes[5]) parsed.entryClose = allTimes[5];

  return { ...parsed, closedDays: [...new Set(parsed.closedDays)] };
};

// 주소 판별
export const isLikelyParsedAddress = (line = '') => /(제주|서울|부산|인천|대구|광주|대전|울산|세종|경기|강원|충북|충남|충청|전북|전남|전라|경북|경남|경상)/.test(line) && /(로|길|대로|번길|읍|면|동|리)\s*\d/.test(line);

// 메뉴/가격 판별
export const isLikelyMenuPriceLine = (line = '') => /\d{1,3}(,\d{3})+\s*원?$/.test(String(line || '').trim());
export const isLikelyMenuNameLine = (line = '', stopWords = NAVER_PARSE_STOP_WORDS) => {
  const trimmed = String(line || '').trim();
  if (!trimmed || trimmed.length > 40) return false;
  if (stopWords.has(trimmed)) return false;
  if (/^\d/.test(trimmed)) return false;
  if (/^(http|www\.|ftp:)/i.test(trimmed)) return false;
  if (/^[#@]/.test(trimmed)) return false;
  return true;
};
