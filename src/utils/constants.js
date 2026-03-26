import {
  Utensils, Coffee, Camera, Bed, Anchor, Hourglass, Eye, Star,
  Gift, Package, MapPin, Home,
} from 'lucide-react';

// 장소 타입 정의 (아이콘 포함)
export const PLACE_TYPES = [
  { label: '식당', types: ['food'], Icon: Utensils, className: 'text-rose-500 bg-red-50 border-red-200 hover:bg-red-100' },
  { label: '카페', types: ['cafe'], Icon: Coffee, className: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' },
  { label: '관광', types: ['tour'], Icon: Camera, className: 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100' },
  { label: '숙소', types: ['lodge'], Icon: Bed, className: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100' },
  { label: '페리', types: ['ship'], Icon: Anchor, className: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100' },
  { label: '휴식', types: ['rest'], Icon: Hourglass, className: 'text-cyan-600 bg-cyan-50 border-cyan-200 hover:bg-cyan-100' },
  { label: '뷰맛집', types: ['view'], Icon: Eye, className: 'text-sky-600 bg-sky-50 border-sky-200 hover:bg-sky-100' },
  { label: '체험', types: ['experience'], Icon: Star, className: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
  { label: '기념품샵', types: ['souvenir'], Icon: Gift, className: 'text-teal-600 bg-teal-50 border-teal-200 hover:bg-teal-100' },
  { label: '픽업', types: ['pickup'], Icon: Package, className: 'text-orange-500 bg-orange-50 border-orange-200 hover:bg-orange-100' },
  { label: '집', types: ['home'], Icon: Home, className: 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100' },
  { label: '장소', types: ['place'], Icon: MapPin, className: 'text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100' },
];

// 태그 옵션
export const TAG_OPTIONS = [
  { label: '식당', value: 'food' },
  { label: '카페', value: 'cafe' },
  { label: '관광', value: 'tour' },
  { label: '숙소', value: 'lodge' },
  { label: '숙박', value: 'stay' },
  { label: '페리', value: 'ship' },
  { label: '휴식', value: 'rest' },
  { label: '픽업', value: 'pickup' },
  { label: '오픈런', value: 'openrun' },
  { label: '뷰맛집', value: 'view' },
  { label: '체험', value: 'experience' },
  { label: '기념품샵', value: 'souvenir' },
  { label: '집', value: 'home' },
  { label: '장소', value: 'place' },
  { label: '퀵등록', value: 'quick' },
  { label: '신규', value: 'new' },
  { label: '재방문', value: 'revisit' },
];

export const TAG_VALUES = new Set(TAG_OPTIONS.map(t => t.value));
export const MODIFIER_TAGS = new Set(['revisit', 'new']);

export const getPreferredMapCategory = (types = [], fallbackType = 'place') => {
  const normalized = Array.isArray(types) ? types.filter(Boolean) : [];
  const preferred = normalized.find((type) => !MODIFIER_TAGS.has(type) && type !== 'lodge' && type !== 'place');
  return preferred || normalized.find((type) => !MODIFIER_TAGS.has(type)) || fallbackType;
};

export const normalizeTagOrder = (input) => {
  const list = Array.isArray(input) ? input : [];
  const modifiers = [...new Set(list.filter(t => MODIFIER_TAGS.has(t)))];
  const catTags = list.filter(t => !MODIFIER_TAGS.has(t) && TAG_VALUES.has(t));
  const customTags = list
    .filter(t => !MODIFIER_TAGS.has(t) && !TAG_VALUES.has(t))
    .map(t => String(t || '').trim())
    .filter(Boolean);
  const unique = [...new Set(catTags)].slice(0, 2);
  const uniqueCustom = [...new Set(customTags)];
  if (unique.length === 0 && uniqueCustom.length === 0 && modifiers.length === 0) return ['place'];
  return [...unique, ...modifiers, ...uniqueCustom];
};

export const toggleTagSelection = (current, tagValue) => {
  const normalized = normalizeTagOrder(current);
  if (MODIFIER_TAGS.has(tagValue)) {
    return normalized.includes(tagValue)
      ? normalizeTagOrder(normalized.filter(t => t !== tagValue))
      : normalizeTagOrder([...normalized, tagValue]);
  }
  const catTags = normalized.filter(t => !MODIFIER_TAGS.has(t));
  const modifiers = normalized.filter(t => MODIFIER_TAGS.has(t));
  let newCatTags;
  if (catTags.includes(tagValue)) {
    newCatTags = catTags.filter(t => t !== tagValue);
    if (newCatTags.length === 0) newCatTags = ['place'];
  } else {
    newCatTags = catTags.length >= 2 ? [catTags[0], tagValue] : [...catTags, tagValue];
  }
  return [...newCatTags, ...modifiers];
};

export const getTagButtonClass = (value, active) => {
  if (!active) return 'bg-white text-slate-400 border-slate-200 hover:border-slate-300';
  if (value === 'food') return 'text-rose-500 bg-red-50 border-red-200';
  if (value === 'cafe') return 'text-amber-600 bg-amber-50 border-amber-200';
  if (value === 'tour') return 'text-purple-600 bg-purple-50 border-purple-200';
  if (value === 'lodge') return 'text-indigo-600 bg-indigo-50 border-indigo-200';
  if (value === 'ship') return 'text-blue-600 bg-blue-50 border-blue-200';
  if (value === 'rest') return 'text-cyan-600 bg-cyan-50 border-cyan-200';
  if (value === 'pickup') return 'text-orange-500 bg-orange-50 border-orange-200';
  if (value === 'openrun') return 'text-red-500 bg-red-50 border-red-100';
  if (value === 'view') return 'text-sky-600 bg-sky-50 border-sky-200';
  if (value === 'experience') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (value === 'souvenir') return 'text-teal-600 bg-teal-50 border-teal-200';
  if (value === 'new') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (value === 'revisit') return 'text-blue-600 bg-blue-50 border-blue-200';
  return 'text-slate-500 bg-slate-100 border-slate-200';
};

// 영업시간 관련 상수
export const WEEKDAY_OPTIONS = [
  { label: '월', value: 'mon' },
  { label: '화', value: 'tue' },
  { label: '수', value: 'wed' },
  { label: '목', value: 'thu' },
  { label: '금', value: 'fri' },
  { label: '토', value: 'sat' },
  { label: '일', value: 'sun' },
];

export const formatClosedDaysSummary = (closedDays = []) => {
  const labels = closedDays
    .map((value) => WEEKDAY_OPTIONS.find((day) => day.value === value)?.label || String(value || '').trim())
    .filter(Boolean);
  if (!labels.length) return '';
  return labels.join(' ');
};

export const EMPTY_BUSINESS = { open: '', close: '', breakStart: '', breakEnd: '', lastOrder: '', entryClose: '', closedDays: [] };

export const BUSINESS_PRESETS = {
  open: ['06:00', '08:00', '09:00', '10:00', '10:30', '11:00'],
  close: ['19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
  breakStart: ['12:00', '13:00', '14:00', '15:00'],
  breakEnd: ['13:00', '14:00', '15:00', '16:00', '17:00'],
  lastOrder: ['19:30', '20:00', '20:30', '21:00', '21:30'],
  entryClose: ['18:00', '19:00', '20:00', '20:30'],
};

export const DEFAULT_BUSINESS = { open: '', close: '', breakStart: '', breakEnd: '', lastOrder: '', entryClose: '', closedDays: [] };

export const KAKAO_API_KEY = 'b312628369f47e04894f338b7fc0b318';

// 주소 인식 정규식
export const ADDRESS_REGEX = /^(제주|서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|충청|전북|전남|전라|경북|경남|경상|제주특별자치도|서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|강원특별자치도|충청북도|충청남도|전라북도|전북특별자치도|전라남도|경상북도|경상남도)/;

// 네이버 파싱 불용어
export const NAVER_PARSE_STOP_WORDS = new Set([
  '업체', '알림받기', '출발', '도착', '저장', '거리뷰', '공유', '홈', '소식', '메뉴', '리뷰', '사진', '정보',
  '저장 폴더', '펼쳐보기', '주소', '찾아가는길', '영업시간', '접기', '영업시간 수정 제안하기', '전화번호', '편의',
  '대표', '페이지 닫기',
]);

// 여러 장소 추가 파싱용 카테고리 매핑
const BULK_KW_MAP = {
  cafe: ['카페', '디저트', '베이커리', '토스트', '한과', '떡카페', '빙수', '마카롱', '케이크', '도너츠', '베이글', '전통찻집', '브런치', '샌드위치'],
  food: ['국수', '한식', '중식당', '전복요리', '고사리육개장', '분식', '일식', '양식', '중국집', '피자', '횟집', '생선회', '해물', '생선요리', '고깃집', '삼겹살', '갈비', '족발', '보쌈', '맛집', '전문점', '식당', '음식', '육류', '고기요리', '치킨', '닭강정', '햄버거', '치킨집', '김밥', '만두', '우동', '소바', '해장국', '국밥', '찌개', '탕', '냉면', '칼국수', '수제비', '라멘', '돈가스', '스시', '이자카야', '포장마차', '핫도그', '떡볶이', '면요리', '패스트푸드', '뷔페', '스테이크', '곱창', '막창'],
  stay: ['호텔', '펜션', '숙박', '게스트하우스', '민박', '리조트', '모텔', '캠핑장', '글램핑'],
  tour: ['수목원', '식물원', '계곡', '지역명소', '야시장', '해수욕장', '해변', '공원', '놀이공원', '테마파크', '행정지명', '관광', '관광명소', '명소', '전망대', '등대', '폭포', '유적지', '박물관', '미술관'],
  experience: ['키즈카페', '실내놀이터', '관람', '체험', '협동조합', '공방', '액티비티'],
  place: ['마트', '편의점', '미용실', '기념품샵'],
};

export const bulkKwToType = (kw) => {
  // 쉼표로 구분된 카테고리 처리
  const keywords = String(kw || '').split(/[,\s]+/).map(s => s.trim()).filter(Boolean);
  for (const keyword of keywords) {
    for (const [type, list] of Object.entries(BULK_KW_MAP)) {
      if (list.includes(keyword)) return type;
    }
  }
  return null;
};
