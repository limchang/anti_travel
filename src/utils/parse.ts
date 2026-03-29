import { extractTimesFromText, normalizeTimeToken } from './time';
import { NAVER_PARSE_STOP_WORDS, WEEKDAY_OPTIONS, bulkKwToType, ADDRESS_REGEX } from './constants';
import { safeLocalStorageGet } from './storage';

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

export const parseBulkPlaceText = (text) => {
  if (!text?.trim()) return [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const results = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // 주소 줄 패턴: "제주특별자치도" 또는 "서울" 등으로 시작하는 행
    const isAddressLine = /^(제주|서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|충청|전북|전남|전라|경북|경남|경상|제주특별자치도|서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|강원특별자치도|충청북도|충청남도|전라북도|전북특별자치도|전라남도|경상북도|경상남도)[\s도시구군읍면리동로길]/.test(line);
    if (isAddressLine) { i++; continue; }
    // 이름+카테고리 줄 패턴 파싱
    // 예: "스무돈가스" / "말고기연구소 제주공항점육류,고기요리" / "🏡 키즈펜션 로그밸리펜션펜션"
    const nameLine = line.replace(/^[^\w가-힣a-zA-Z0-9]+/, ''); // 앞 이모지 제거
    // 쉼표 앞까지가 이름 원본, 쉼표 뒤는 카테고리 참고용 (이름 자동 편집 없음)
    const commaIdx = nameLine.indexOf(',');
    const rawName = commaIdx > 0 ? nameLine.slice(0, commaIdx).trim() : nameLine.trim();
    let detectedTypes = [];
    if (commaIdx > 0) {
      const suffixTokens = nameLine.slice(commaIdx + 1).split(',').map(s => s.trim()).filter(Boolean);
      for (const token of suffixTokens) {
        const mapped = bulkKwToType(token);
        if (mapped) detectedTypes.push(mapped);
      }
    }
    // 학습 데이터 적용: 이전에 사용자가 수정한 패턴이 있으면 적용
    const corrections = JSON.parse(safeLocalStorageGet('bulk_name_corrections', '{}'));
    const finalName = corrections[rawName] || rawName;
    // 다음 줄이 주소인지 확인
    const nextLine = lines[i + 1] || '';
    const nextIsAddress = /^(제주|서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|충청|전북|전남|전라|경북|경남|경상|제주특별자치도|서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|강원특별자치도|충청북도|충청남도|전라북도|전북특별자치도|전라남도|경상북도|경상남도)[\s도시구군읍면리동로길]/.test(nextLine);
    if (nextIsAddress) {
      // 이름 + 주소 쌍
      const address = nextLine;
      if (finalName.length >= 1) {
        const types = detectedTypes.length > 0 ? [...new Set(detectedTypes)] : ['place'];
        const dupKey = `${finalName.toLowerCase()}::${address.toLowerCase()}`;
        if (!results.some(r => `${r.name.toLowerCase()}::${r.address.toLowerCase()}` === dupKey)) {
          results.push({ name: finalName, address, types, selected: true, _rawName: rawName });
        }
      }
      i += 2;
    } else {
      // 이름만 (주소 없음)
      if (finalName.length >= 1) {
        const types = detectedTypes.length > 0 ? [...new Set(detectedTypes)] : ['place'];
        const dupKey = finalName.toLowerCase();
        if (!results.some(r => r.name.toLowerCase() === dupKey && !r.address)) {
          results.push({ name: finalName, address: '', types, selected: true, _rawName: rawName });
        }
      }
      i++;
    }
  }
  return results;
};
