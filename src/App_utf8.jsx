/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, no-useless-escape */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import {
  Navigation, MessageSquare, LogOut, User as UserIcon,
  Hourglass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  ArrowUpRight, ArrowUpLeft, ArrowDownRight, ArrowDownLeft,
  PlusCircle, Waves, QrCode, CheckSquare, Square,
  Plus, Minus, MapPin, Trash2, Map as MapIcon, ExternalLink,
  ChevronsRight, Sparkles, CornerDownRight, GitBranch, Umbrella, ArrowLeftRight, Store, Lock, ChevronLeft, ChevronRight, Timer, Anchor, Utensils, Coffee, Camera, Bed, ChevronDown, ChevronUp, Package, Eye, Star, Pencil, Calendar, GripVertical
} from 'lucide-react';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Runtime render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', padding: 24, fontFamily: 'sans-serif', background: '#F8FAFC', color: '#0F172A' }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>앱 렌더링 오류가 발생했습니다.</h1>
          <p style={{ marginTop: 8, fontSize: 13, color: '#475569' }}>새로고침 후에도 동일하면 콘솔 오류를 확인해주세요.</p>
          <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap', fontSize: 12, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
            {String(this.state.error?.message || this.state.error || 'unknown error')}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const safeLocalStorageGet = (key, fallback = '') => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (e) {
    console.warn(`localStorage read failed (${key})`, e);
    return fallback;
  }
};

const safeLocalStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`localStorage write failed (${key})`, e);
  }
};

const getTimeOfDayOverlay = (timeStr) => {
  const [h = '12', m = '0'] = (timeStr || '12:00').split(':');
  const mins = parseInt(h, 10) * 60 + parseInt(m, 10);
  // 색조(RGBA), 이름
  if (mins < 60) return { color: 'rgba(10,8,40,0.13)', label: '자정' };
  if (mins < 300) return { color: 'rgba(15,10,50,0.11)', label: '새벽' };
  if (mins < 360) return { color: 'rgba(200,80,30,0.09)', label: '여명' };
  if (mins < 480) return { color: 'rgba(255,140,60,0.08)', label: '일출' };
  if (mins < 660) return { color: 'rgba(120,190,255,0.07)', label: '오전' };
  if (mins < 840) return { color: 'rgba(190,225,255,0.06)', label: '한낮' };
  if (mins < 960) return { color: 'rgba(255,210,100,0.08)', label: '오후' };
  if (mins < 1080) return { color: 'rgba(255,100,40,0.10)', label: '일몰' };
  if (mins < 1200) return { color: 'rgba(90,30,120,0.10)', label: '황혼' };
  if (mins < 1320) return { color: 'rgba(30,15,70,0.11)', label: '밤' };
  return { color: 'rgba(10,8,40,0.13)', label: '심야' };
};

const PLACE_TYPES = [
  { label: '식당', types: ['food'], Icon: Utensils, className: 'text-rose-500 bg-red-50 border-red-200 hover:bg-red-100' },
  { label: '카페', types: ['cafe'], Icon: Coffee, className: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' },
  { label: '관광', types: ['tour'], Icon: Camera, className: 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100' },
  { label: '숙소', types: ['lodge'], Icon: Bed, className: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100' },
  { label: '뷰맛집', types: ['view'], Icon: Eye, className: 'text-sky-600 bg-sky-50 border-sky-200 hover:bg-sky-100' },
  { label: '체험', types: ['experience'], Icon: Star, className: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
  { label: '픽업', types: ['pickup'], Icon: Package, className: 'text-orange-500 bg-orange-50 border-orange-200 hover:bg-orange-100' },
  { label: '장소', types: ['place'], Icon: MapPin, className: 'text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100' },
];

const TAG_OPTIONS = [
  { label: '식당', value: 'food' },
  { label: '카페', value: 'cafe' },
  { label: '관광', value: 'tour' },
  { label: '숙소', value: 'lodge' },
  { label: '픽업', value: 'pickup' },
  { label: '오픈런', value: 'openrun' },
  { label: '뷰맛집', value: 'view' },
  { label: '체험', value: 'experience' },
  { label: '장소', value: 'place' },
  { label: '신규', value: 'new' },
  { label: '재방문', value: 'revisit' },
];
const TAG_VALUES = new Set(TAG_OPTIONS.map(t => t.value));
const MODIFIER_TAGS = new Set(['revisit', 'new']);
const normalizeTagOrder = (input) => {
  const list = Array.isArray(input) ? input : [];
  const modifiers = [...new Set(list.filter(t => MODIFIER_TAGS.has(t)))];
  const catTags = list.filter(t => !MODIFIER_TAGS.has(t) && TAG_VALUES.has(t));
  const unique = [...new Set(catTags)].slice(0, 2);
  if (unique.length === 0 && modifiers.length === 0) return ['place'];
  return [...unique, ...modifiers];
};
const toggleTagSelection = (current, tagValue) => {
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
const getTagButtonClass = (value, active) => {
  if (!active) return 'bg-white text-slate-400 border-slate-200 hover:border-slate-300';
  if (value === 'food') return 'text-rose-500 bg-red-50 border-red-200';
  if (value === 'cafe') return 'text-amber-600 bg-amber-50 border-amber-200';
  if (value === 'tour') return 'text-purple-600 bg-purple-50 border-purple-200';
  if (value === 'lodge') return 'text-indigo-600 bg-indigo-50 border-indigo-200';
  if (value === 'pickup') return 'text-orange-500 bg-orange-50 border-orange-200';
  if (value === 'openrun') return 'text-red-500 bg-red-50 border-red-100';
  if (value === 'view') return 'text-sky-600 bg-sky-50 border-sky-200';
  if (value === 'experience') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (value === 'new') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (value === 'revisit') return 'text-blue-600 bg-blue-50 border-blue-200';
  return 'text-slate-500 bg-slate-100 border-slate-200';
};
const OrderedTagPicker = ({ value = ['place'], onChange, title = '태그', className = '' }) => {
  const selected = normalizeTagOrder(value);
  const [customInput, setCustomInput] = React.useState('');

  const handleAddCustom = () => {
    const val = customInput.trim();
    if (val && !selected.includes(val)) {
      onChange(normalizeTagOrder([...selected, val]));
    }
    setCustomInput('');
  };

  const predefinedValues = new Set(TAG_OPTIONS.map(v => v.value));
  const customTags = selected.filter(v => !predefinedValues.has(v) && v !== 'place');

  return (
    <div className={className}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <div className="flex flex-wrap gap-1 items-center">
        {TAG_OPTIONS.map(t => {
          const active = selected.includes(t.value);
          return (
            <button key={t.value} type="button" onClick={() => onChange(toggleTagSelection(selected, t.value))}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black border transition-colors ${getTagButtonClass(t.value, active)}`}>
              {t.label}
            </button>
          );
        })}
        {customTags.map(t => (
          <button key={t} type="button" onClick={() => onChange(normalizeTagOrder(selected.filter(v => v !== t)))}
            className="px-2 py-0.5 rounded-lg text-[10px] font-black border transition-colors text-slate-600 bg-slate-100 border-slate-300 hover:bg-slate-200">
            {t} <span className="text-slate-400 ml-0.5">✕</span>
          </button>
        ))}
        <input
          type="text"
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustom(); } }}
          onBlur={handleAddCustom}
          placeholder="+ 직접 입력"
          className="ml-1 w-20 px-2 py-0.5 rounded-lg text-[10px] font-black border border-slate-200 bg-white placeholder:text-slate-300 outline-none focus:border-[#3182F6]"
        />
      </div>
    </div>
  );
};
const WEEKDAY_OPTIONS = [
  { label: '월', value: 'mon' },
  { label: '화', value: 'tue' },
  { label: '수', value: 'wed' },
  { label: '목', value: 'thu' },
  { label: '금', value: 'fri' },
  { label: '토', value: 'sat' },
  { label: '일', value: 'sun' },
];
const EMPTY_BUSINESS = { open: '', close: '', breakStart: '', breakEnd: '', lastOrder: '', closedDays: [] };
const DEFAULT_BUSINESS = { open: '10:00', close: '20:00', breakStart: '15:00', breakEnd: '17:00', lastOrder: '', closedDays: [] };
const normalizeTimeToken = (raw = '') => {
  const m = String(raw).trim().match(/(\d{1,2})(?::(\d{2}))?/);
  if (!m) return '';
  const hh = Number(m[1]);
  const mm = Number(m[2] || '0');
  if (Number.isNaN(hh) || Number.isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) return '';
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};
const extractTimesFromText = (text = '') => {
  const out = [];
  const re = /(\d{1,2})(?::(\d{2}))?\s*시?/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const t = normalizeTimeToken(`${m[1]}:${m[2] || '00'}`);
    if (t) out.push(t);
  }
  return out;
};
// 붙여넣기 예시:
// 10:30 - 22:00
// 15:00 - 17:00 브레이크타임
// 21:00 라스트오더
const parseBusinessHoursText = (text = '') => {
  const parsed = { open: '', close: '', breakStart: '', breakEnd: '', lastOrder: '' };
  const lines = String(text)
    .split(/\r?\n/)
    .map(v => v.trim())
    .filter(Boolean);
  const normalizedLines = lines.length ? lines : [String(text).trim()].filter(Boolean);

  normalizedLines.forEach((line) => {
    const lower = line.toLowerCase();
    const times = extractTimesFromText(line);
    if (times.length === 0) return;
    if (/(라스트\s*오더|last\s*order|lastorder|마감주문)/i.test(lower)) {
      parsed.lastOrder = times[0] || parsed.lastOrder;
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

  if (!parsed.open || !parsed.close) {
    const allTimes = extractTimesFromText(String(text));
    if (!parsed.open && allTimes[0]) parsed.open = allTimes[0];
    if (!parsed.close && allTimes[1]) parsed.close = allTimes[1];
    if (!parsed.breakStart && allTimes[2]) parsed.breakStart = allTimes[2];
    if (!parsed.breakEnd && allTimes[3]) parsed.breakEnd = allTimes[3];
    if (!parsed.lastOrder && allTimes[4]) parsed.lastOrder = allTimes[4];
  }

  return parsed;
};

// 24시간 형식 시간 입력 컴포넌트 (오전/오후 없음)
const TimeInput = ({ value, onChange, className = '', title = '' }) => {
  const handleChange = (e) => {
    let v = e.target.value.replace(/[^0-9:]/g, '');
    if (v.length === 2 && !v.includes(':')) v = v + ':';
    if (v.length > 5) v = v.slice(0, 5);
    onChange(v);
  };
  const handleBlur = (e) => {
    let v = e.target.value.trim();
    if (/^\d{4}$/.test(v)) v = v.slice(0, 2) + ':' + v.slice(2);
    if (!/^\d{2}:\d{2}$/.test(v)) { onChange(v); return; }
    const [h, min] = v.split(':').map(Number);
    if (h > 23 || min > 59) { onChange(''); return; }
    onChange(v);
  };
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="00:00"
      maxLength={5}
      title={title}
      className={className}
    />
  );
};
const fmtDur = (mins) => {
  if (!mins || mins <= 0) return '0분';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간${m}분`;
};
const normalizeBusiness = (business = {}) => ({
  open: String(business.open || ''),
  close: String(business.close || ''),
  breakStart: String(business.breakStart || ''),
  breakEnd: String(business.breakEnd || ''),
  lastOrder: String(business.lastOrder || ''),
  closedDays: Array.isArray(business.closedDays) ? [...new Set(business.closedDays)] : [],
});


const KAKAO_API_KEY = 'b312628369f47e04894f338b7fc0b318';

// kakaoKey 있으면 카카오 먼저 시도, 없거나 실패 시 Nominatim fallback
const searchAddressFromPlaceName = async (keyword, regionHint = '', kakaoKey = KAKAO_API_KEY) => {
  const query = keyword.trim();
  if (!query) return { address: '', source: '', error: '' };
  const searchQuery = `${regionHint?.trim() || ''} ${query}`.trim();

  // 1번: 카카오 로컈 키워드 검색 API (한국 주소 가장 정확)
  if (kakaoKey) {
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
          if (addr) return { address: addr, lat: first.y, lon: first.x, source: '카카오' };
        }
        return { address: '', source: '카카오', error: '검색 결과 없음' };
      }
    } catch (e) {
      // 카카오 실패 시 Nominatim으로 fallback
    }
  }

  // 2번: Nominatim — 여러 쿼리 시도 + 도로명 주소 구성
  const buildRoadAddress = (a) => {
    if (!a) return '';
    const road = a.road || a.pedestrian || a.footway || '';
    const num = a.house_number || '';
    const dong = a.quarter || a.suburb || a.neighbourhood || '';
    const gu = a.city_district || a.county || '';
    const city = a.city || a.town || a.village || '';
    if (road) {
      const parts = [city || gu, road, num].filter(Boolean);
      return parts.join(' ');
    }
    if (dong) return [city, gu, dong].filter(Boolean).join(' ');
    return '';
  };

  const queries = [...new Set([searchQuery, query, regionHint ? `${regionHint} ${query}`.trim() : null].filter(Boolean))];
  for (const q of queries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&countrycodes=kr&accept-language=ko&addressdetails=1&q=${encodeURIComponent(q)}`,
        { method: 'GET', headers: { Accept: 'application/json', 'Accept-Language': 'ko' }, signal: controller.signal }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const results = await response.json();
      clearTimeout(timeoutId);
      if (!results?.length) continue;
      // 도로명 주소 우선 구성
      for (const r of results) {
        const road = buildRoadAddress(r.address);
        if (road) return { address: road, lat: r.lat, lon: r.lon, source: 'Nominatim' };
      }
      const raw = results[0].display_name || '';
      if (raw) {
        // 한국 주소 역순 정제: "번지, 도로명, 동, 시, 도, 대한민국" → "시 도로명 번지"
        const parts = raw.split(', ').filter(p => p !== '대한민국' && !/^\d{5}$/.test(p));
        return { address: parts.slice(0, 4).reverse().join(' '), lat: results[0].lat, lon: results[0].lon, source: 'Nominatim' };
      }
    } catch (e) {
      clearTimeout(timeoutId);
      continue;
    }
  }
  return { address: '', source: 'Nominatim', error: '검색 결과 없음 (카카오 API 키 등록 시 정확도 향상)' };
};

const DateRangePicker = ({ startDate, endDate, onStartChange, onEndChange, onClose }) => {
  const parseDate = (s) => s ? new Date(s + 'T00:00:00') : null;
  const toYmd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const initDate = start || new Date();
  const [year, setYear] = React.useState(initDate.getFullYear());
  const [month, setMonth] = React.useState(initDate.getMonth());
  const [phase, setPhase] = React.useState('start');
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  const handleDay = (d) => {
    const s = toYmd(d);
    if (phase === 'start') {
      onStartChange(s);
      if (end && d > end) onEndChange('');
      setPhase('end');
    } else {
      if (start && d < start) { onStartChange(s); onEndChange(''); }
      else { onEndChange(s); setTimeout(onClose, 150); }
    }
  };
  const isSame = (a, b) => a && b && toYmd(a) === toYmd(b);
  const prevM = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextM = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };
  const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-72 z-[300]">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevM} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><ChevronLeft size={14} /></button>
        <span className="text-[13px] font-black text-slate-800">{year}년 {MONTHS[month]}</span>
        <button onClick={nextM} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><ChevronRight size={14} /></button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => <span key={d} className={`text-center text-[9px] font-black pb-1 ${i === 0 ? 'text-rose-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const isS = isSame(d, start), isE = isSame(d, end);
          const inR = start && end && d > start && d < end;
          const dow = d.getDay();
          return (
            <button key={i} onClick={() => handleDay(d)}
              className={`h-8 w-full text-[11px] font-bold transition-all
                ${isS || isE ? 'bg-[#3182F6] text-white font-black rounded-lg' : ''}
                ${inR ? 'bg-blue-50 text-[#3182F6] rounded-none' : ''}
                ${!isS && !isE && !inR ? `hover:bg-slate-100 rounded-lg ${dow === 0 ? 'text-rose-400' : dow === 6 ? 'text-blue-500' : 'text-slate-700'}` : ''}
              `}>{d.getDate()}</button>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className={`flex flex-col ${phase === 'start' ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
          <span className="text-[8px] font-black text-[#3182F6] uppercase tracking-wider">시작일</span>
          <span className="text-[12px] font-black text-slate-800">{startDate ? startDate.slice(5).replace('-', '/') : '—'}</span>
        </div>
        <span className="text-slate-300 font-black text-sm">→</span>
        <div className={`flex flex-col items-end ${phase === 'end' ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
          <span className="text-[8px] font-black text-[#3182F6] uppercase tracking-wider">종료일</span>
          <span className="text-[12px] font-black text-slate-800">{endDate ? endDate.slice(5).replace('-', '/') : '—'}</span>
        </div>
      </div>
      <p className="text-[9px] text-center text-slate-400 font-bold mt-1.5">
        {phase === 'start' ? '시작일을 선택하세요' : '종료일을 선택하세요'}
      </p>
    </div>
  );
};

const PlaceAddForm = ({ newPlaceName, setNewPlaceName, newPlaceTypes, setNewPlaceTypes, regionHint, onAdd, onCancel }) => {
  const [business, setBusiness] = React.useState(DEFAULT_BUSINESS);
  const [menus, setMenus] = React.useState([]);
  const [menuInput, setMenuInput] = React.useState({ name: '', price: '' });
  const [address, setAddress] = React.useState('');
  const [memo, setMemo] = React.useState('');
  const [isSearchingAddress, setIsSearchingAddress] = React.useState(false);
  const [addressSearchNote, setAddressSearchNote] = React.useState('');

  const addMenu = () => {
    if (!menuInput.name.trim()) return;
    setMenus(prev => [...prev, { name: menuInput.name.trim(), price: Number(menuInput.price) || 0 }]);
    setMenuInput({ name: '', price: '' });
  };

  const handleAdd = () => {
    onAdd({ types: normalizeTagOrder(newPlaceTypes), menus, address, memo, business: normalizeBusiness(business) });
  };

  const tryAutoFillAddress = async (force = false) => {
    if (isSearchingAddress) return;
    if (!newPlaceName.trim()) return;
    if (address.trim() && !force) return;

    setIsSearchingAddress(true);
    setAddressSearchNote('주소 검색 중...');

    try {
      const foundAddress = await searchAddressFromPlaceName(newPlaceName, regionHint);
      if (!foundAddress?.address) {
        setAddressSearchNote('검색 결과가 없습니다.');
        return;
      }
      setAddress(foundAddress.address);
      setAddressSearchNote('주소가 자동 입력되었습니다.');
    } catch {
      setAddressSearchNote('자동 입력에 실패했습니다.');
    } finally {
      setIsSearchingAddress(false);
    }
  };

  return (
    <div className="mb-4 w-full shrink-0 rounded-[20px] border border-slate-100 bg-white shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100/60 bg-slate-50/50 flex items-center justify-between">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">새 장소 등록</p>
      </div>

      <div className="p-3 flex flex-col gap-2.5">
        <OrderedTagPicker value={newPlaceTypes} onChange={setNewPlaceTypes} title="태그" />

        <input
          autoFocus
          value={newPlaceName}
          onChange={(e) => setNewPlaceName(e.target.value)}
          onBlur={() => { void tryAutoFillAddress(false); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter') {
              e.preventDefault();
              void tryAutoFillAddress(true);
            }
          }}
          placeholder="일정 이름 입력"
          className="w-full bg-transparent text-[17px] font-black text-slate-800 leading-tight outline-none border-b border-slate-200 focus:border-slate-400 transition-colors pb-1"
        />

        <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <MapPin size={12} className="text-[#3182F6]" />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소를 입력하세요"
            className="bg-transparent border-none outline-none text-[11px] font-bold w-full text-slate-600 placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => { void tryAutoFillAddress(true); }}
            disabled={isSearchingAddress || !newPlaceName.trim()}
            className="shrink-0 px-1.5 py-1 rounded-md text-[9px] font-black border border-slate-200 bg-white text-slate-500 disabled:opacity-50 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
            title="일정 이름으로 주소 자동 입력"
          >
            <Sparkles size={9} />
          </button>
        </div>
        {addressSearchNote && (
          <p className={`text-[9px] font-bold -mt-1 ${addressSearchNote.includes('실패') || addressSearchNote.includes('없습니다') ? 'text-amber-500' : 'text-slate-400'}`}>
            {addressSearchNote}
          </p>
        )}

        <input
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모를 입력하세요..."
          className="w-full bg-slate-50/70 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none focus:border-slate-300 focus:bg-white transition-all"
        />

        <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-2">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">영업 정보 (선택) · 붙여넣기로 자동 입력</p>
          <textarea
            rows={3}
            placeholder={'10:30 - 22:00\n15:00 - 17:00 브레이크타임\n21:00 라스트오더'}
            className="w-full mb-1.5 text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-[#3182F6] text-slate-600 placeholder:text-slate-300 resize-none"
            onBlur={(e) => {
              const parsed = parseBusinessHoursText(e.target.value);
              if (parsed.open || parsed.close || parsed.breakStart || parsed.breakEnd || parsed.lastOrder) {
                setBusiness(prev => ({ ...prev, ...parsed }));
              }
            }}
          />
          <div className="grid grid-cols-2 gap-1.5 mb-1.5">
            <TimeInput value={business.open} onChange={(v) => setBusiness(prev => ({ ...prev, open: v }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]" title="운영 시작" />
            <TimeInput value={business.close} onChange={(v) => setBusiness(prev => ({ ...prev, close: v }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]" title="운영 종료" />
            <TimeInput value={business.breakStart} onChange={(v) => setBusiness(prev => ({ ...prev, breakStart: v }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]" title="브레이크 시작" />
            <TimeInput value={business.breakEnd} onChange={(v) => setBusiness(prev => ({ ...prev, breakEnd: v }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]" title="브레이크 종료" />
            <TimeInput value={business.lastOrder || ''} onChange={(v) => setBusiness(prev => ({ ...prev, lastOrder: v }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6] col-span-2" title="라스트오더" />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {WEEKDAY_OPTIONS.map(d => {
              const active = business.closedDays.includes(d.value);
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setBusiness(prev => ({ ...prev, closedDays: active ? prev.closedDays.filter(v => v !== d.value) : [...prev.closedDays, d.value] }))}
                  className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${active ? 'text-red-500 bg-red-50 border-red-200' : 'text-slate-400 bg-white border-slate-200'}`}
                >
                  {d.label} 휴무
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-xl p-2">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5">대표 메뉴</p>
          {menus.length === 0 && (
            <p className="text-[10px] text-slate-400 font-semibold mb-2">메뉴를 추가하면 일정 셀 하단 영수증과 동일하게 반영됩니다.</p>
          )}
          {menus.map((m, i) => (
            <div key={i} className="flex items-center gap-1.5 mb-1.5 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1">
              <span className="flex-1 truncate">{m.name}</span>
              <span className="text-slate-400">₩{m.price.toLocaleString()}</span>
              <button onClick={() => setMenus(prev => prev.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-400 ml-1">✕</button>
            </div>
          ))}
          <div className="grid grid-cols-[minmax(0,1fr)_4.25rem_auto] gap-1">
            <input
              value={menuInput.name}
              onChange={(e) => setMenuInput(p => ({ ...p, name: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') addMenu(); }}
              placeholder="메뉴 이름"
              className="min-w-0 text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]"
            />
            <input
              value={menuInput.price}
              onChange={(e) => setMenuInput(p => ({ ...p, price: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') addMenu(); }}
              placeholder="가격"
              type="number"
              className="w-[4.25rem] text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6] [appearance:textfield]"
            />
            <button onClick={addMenu} className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 hover:bg-slate-200 whitespace-nowrap">+</button>
          </div>
        </div>
      </div>

      <div className="px-3 py-2.5 border-t border-slate-100 flex items-center justify-between bg-white">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Estimated Cost</span>
        <span className="text-[16px] font-black text-[#3182F6]">₩{menus.reduce((sum, m) => sum + (Number(m.price) || 0), 0).toLocaleString()}</span>
      </div>

      <div className="px-3 pb-3 flex gap-1.5">
        <button onClick={handleAdd} className="flex-1 py-1.5 bg-[#3182F6] text-white text-[11px] font-black rounded-lg">추가</button>
        <button onClick={onCancel} className="flex-1 py-1.5 bg-slate-100 text-slate-500 text-[11px] font-black rounded-lg">취소</button>
      </div>
    </div>
  );
};
const App = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // ── 인증 감시 ──
  useEffect(() => {
    let isMounted = true;
    let hasResolvedAuth = false;

    // 인증 확인이 예상보다 오래 걸릴 때 화면 고정 방지
    const failsafe = setTimeout(() => {
      if (isMounted && !hasResolvedAuth) {
        console.warn('Auth initialization timeout fallback');
        setAuthLoading(false);
      }
    }, 12000);

    const initAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (e) {
        console.warn('Auth persistence setup failed:', e?.code || e?.message);
      }

      try {
        await getRedirectResult(auth);
      } catch (e) {
        if (isMounted && e.code !== 'auth/redirect-cancelled-by-user') {
          console.warn('Redirect Login Note:', e?.code || e?.message);
          setAuthError(`로그인 처리 중 오류: ${e?.code || e?.message || 'unknown'}`);
        }
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (isMounted) {
        hasResolvedAuth = true;
        clearTimeout(failsafe);
        setAuthError('');
        setUser(u);
        setAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(failsafe);
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error('로그인 에러 상세:', e?.code, e?.message);
      let errorMsg = '로그인 과정을 시작할 수 없습니다.';

      if (e.code === 'auth/configuration-not-found') {
        errorMsg = 'Firebase 프로젝트에서 "구글 로그인"이 활성화되지 않았습니다.\n\n해결 방법:\n1. Firebase Console 접속\n2. Authentication > Sign-in method\n3. [Add new provider] 클릭 후 "Google" 활성화';
      } else if (e.code === 'auth/unauthorized-domain') {
        errorMsg = `현재 도메인(${window.location.hostname})이 Firebase 승인 된 도메인에 없습니다.\n\n해결 방법:\n1. Firebase Console > Authentication > Settings\n2. [Authorized domains]에 "${window.location.hostname}" 추가`;
      } else if (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request' || e.code === 'auth/operation-not-supported-in-this-environment') {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        await signInWithRedirect(auth, provider);
        return;
      } else {
        errorMsg += `\n(오류 코드: ${e.code || e.message})`;
      }
      setAuthError(errorMsg);
      alert(errorMsg);
    }
  };

  // 로그인 없이 로컬 모드로 시작하기 (임시 방편)
  const handleGuestMode = () => {
    if (window.confirm('계정 없이 시작하시겠습니까? 데이터가 서버에 저장되지 않을 수 있습니다.')) {
      setUser({ uid: 'guest_user', displayName: 'GUEST', isGuest: true });
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) return;
    try {
      await signOut(auth);
      // 로그아웃 시 모든 개인화 상태 초기화
      setItinerary({ days: [], places: [] });
      setHistory([]);
      setActiveItemId(null);
      setBasePlanRef(null);
      setLoading(true);
    } catch (e) {
      console.error('로그아웃 실패:', e);
    }
  };

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [currentTripId, setCurrentTripId] = useState(() => safeLocalStorageGet('current_trip_id', null));
  const [showTripModal, setShowTripModal] = useState(false);
  const [newTripDraft, setNewTripDraft] = useState({ title: '', region: '제주시', start: '', end: '' });
  const [draggingFromLibrary, setDraggingFromLibrary] = useState(null);
  const [placeFilterTags, setPlaceFilterTags] = useState([]); // 내 장소 필터링 태그
  const [draggingFromTimeline, setDraggingFromTimeline] = useState(null);
  const [isDroppingOnDeleteZone, setIsDroppingOnDeleteZone] = useState(false);
  const [dropTarget, setDropTarget] = useState(null);
  const [dropOnItem, setDropOnItem] = useState(null); // { dayIdx, pIdx } — Plan B 드롭 대상
  const [isDragCopy, setIsDragCopy] = useState(false); // Ctrl+드래그 시 복사 모드
  const [dragCoord, setDragCoord] = useState({ x: 0, y: 0 });
  const ctrlHeldRef = useRef(false);
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceTypes, setNewPlaceTypes] = useState(['food']);
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [editPlaceDraft, setEditPlaceDraft] = useState(null);
  const [tripRegion, setTripRegion] = useState(() => safeLocalStorageGet('trip_region_hint', '제주시'));
  const [tripStartDate, setTripStartDate] = useState(() => safeLocalStorageGet('trip_start_date', ''));
  const [tripEndDate, setTripEndDate] = useState(() => safeLocalStorageGet('trip_end_date', ''));
  // 초기 상태 안전하게 설정
  const [itinerary, setItinerary] = useState({ days: [], places: [] });
  const [history, setHistory] = useState([]);
  const [undoToast, setUndoToast] = useState(false);
  const undoToastTimerRef = React.useRef(null);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedPlaceId, setExpandedPlaceId] = useState(null);
  const [lastAction, setLastAction] = useState("3일차 시작 일정이 수정되었습니다.");
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [activeDay, setActiveDay] = useState(1);
  const [activeItemId, setActiveItemId] = useState(null);
  const isNavScrolling = React.useRef(false);
  const navScrollTimeout = React.useRef(null);
  const longPressTimerRef = useRef(null);
  const touchStartPosRef = useRef({ x: 0, y: 0 });
  const isDraggingActiveRef = useRef(false);
  const dragGhostRef = useRef(null);
  const handleNavClick = (dayNum, itemId = null) => {
    isNavScrolling.current = true;
    if (navScrollTimeout.current) clearTimeout(navScrollTimeout.current);

    if (dayNum) setActiveDay(dayNum);

    let targetItemId = itemId;
    if (!targetItemId) {
      // Day 클릭 시 해당 일자의 첫 일정 활성화
      const targetDay = itinerary.days?.find(d => d.day === dayNum);
      const firstItem = targetDay?.plan?.find(p => p.type !== 'backup');
      if (firstItem) targetItemId = firstItem.id;
    }

    if (targetItemId) {
      setActiveItemId(targetItemId);
      setHighlightedItemId(targetItemId);
      setTimeout(() => setHighlightedItemId(null), 1500);

      // 해당 일정을 기준 장소(basePlanRef)로 자동 지정 (toggleReceipt와 동일 로직)
      let found = null;
      for (const d of itinerary.days || []) {
        found = d.plan?.find(p => p.id === targetItemId);
        if (found) break;
      }
      if (found) {
        const addr = getRouteAddress(found, 'to');
        if (addr) {
          setBasePlanRef({ id: found.id, name: found.activity, address: addr });
        } else {
          setBasePlanRef({ id: found.id, name: found.activity, address: '' });
        }
      }
    }

    let targetElId = itemId || `day-marker-${dayNum}`;

    const el = document.getElementById(targetElId);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: itemId ? 'center' : 'start'
      });
    }

    // 스크롤 중 Observer가 다른 일정을 가로채지 못하도록 1.5초간 잠금
    navScrollTimeout.current = setTimeout(() => {
      isNavScrolling.current = false;
    }, 1500);
  };
  const [basePlanRef, setBasePlanRef] = useState(null); // { dayIdx, pIdx, id, name, address }
  const [placeDistanceMap, setPlaceDistanceMap] = useState({});
  const [col1Collapsed, setCol1Collapsed] = useState(false);
  const [col2Collapsed, setCol2Collapsed] = useState(false);
  const [tagEditorTarget, setTagEditorTarget] = useState(null); // {dayIdx, pIdx}
  const [businessEditorTarget, setBusinessEditorTarget] = useState(null); // {dayIdx, pIdx}
  const [viewingPlanIdx, setViewingPlanIdx] = useState({}); // {[itemId]: altIdx} — -1 = main plan A
  const [ferryEditField, setFerryEditField] = useState(null); // { pId, field: 'load'|'depart' }
  const [routeCache, setRouteCache] = useState({});
  const [calculatingRouteId, setCalculatingRouteId] = useState(null);
  const [isCalculatingAllRoutes, setIsCalculatingAllRoutes] = useState(false);
  const [dashboardHeight, setDashboardHeight] = useState(200);
  const dashboardRef = useRef(null);
  const heroSentinelRef = useRef(null);
  const [heroCollapsed, setHeroCollapsed] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState(null);

  const scrollIntervalRef = useRef(null);
  const lastTouchYRef = useRef(null);

  const startAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) return;
    scrollIntervalRef.current = setInterval(() => {
      if (lastTouchYRef.current === null) return;
      const y = lastTouchYRef.current;
      const threshold = 120;
      const speedMultiplier = 1.2;
      if (y < threshold) {
        window.scrollBy(0, -Math.pow((threshold - y) / 8, speedMultiplier) - 2);
      } else if (y > window.innerHeight - threshold) {
        window.scrollBy(0, Math.pow((y - (window.innerHeight - threshold)) / 8, speedMultiplier) + 2);
      }
    }, 16);
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    lastTouchYRef.current = null;
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Control') ctrlHeldRef.current = true; };
    const onKeyUp = (e) => { if (e.key === 'Control') ctrlHeldRef.current = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, []);

  useEffect(() => {
    if (!dashboardRef.current) return;
    setDashboardHeight(dashboardRef.current.offsetHeight);
    const observer = new ResizeObserver(entries => {
      setDashboardHeight(entries[0].contentRect.height);
    });
    observer.observe(dashboardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    safeLocalStorageSet('trip_region_hint', tripRegion);
  }, [tripRegion]);
  useEffect(() => {
    safeLocalStorageSet('trip_start_date', tripStartDate);
  }, [tripStartDate]);
  useEffect(() => {
    safeLocalStorageSet('trip_end_date', tripEndDate);
  }, [tripEndDate]);

  useEffect(() => {
    let aborted = false;
    const run = async () => {
      if (!basePlanRef?.address) {
        setPlaceDistanceMap({});
        return;
      }
      const baseCoord = await geocodeAddress(basePlanRef.address);
      if (!baseCoord || aborted) return;
      const pairs = await Promise.all((itinerary.places || []).map(async (p) => {
        const addr = (p.address || p.receipt?.address || '').trim();
        if (!addr) return [p.id, null];
        const c = await geocodeAddress(addr);
        if (!c) return [p.id, null];
        return [p.id, +haversineKm(baseCoord.lat, baseCoord.lon, c.lat, c.lon).toFixed(1)];
      }));
      if (aborted) return;
      setPlaceDistanceMap(Object.fromEntries(pairs));
    };
    void run();
    return () => { aborted = true; };
  }, [basePlanRef?.address, itinerary.places]);

  // 히어로 카드 스크롤 감지 → 컴팩트 스티키 바 전환
  useEffect(() => {
    const el = heroSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setHeroCollapsed(!entry.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // 모바일 감지 → 양쪽 패널 자동 접기
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 768) {
        setCol1Collapsed(true);
        setCol2Collapsed(true);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // 스크롤 감지 → activeDay + activeItemId 자동 업데이트
  useEffect(() => {
    if (!itinerary.days?.length) return;
    const observers = [];
    itinerary.days.forEach((d) => {
      const el = document.getElementById(`day-marker-${d.day}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting && !isNavScrolling.current) setActiveDay(d.day); },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    itinerary.days.forEach((d) => {
      (d.plan || []).filter(p => p.type !== 'backup').forEach((p, pIdx) => {
        const elemId = pIdx === 0 ? `day-marker-${d.day}` : p.id;
        const el = document.getElementById(elemId);
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => { if (entry.isIntersecting && !isNavScrolling.current) setActiveItemId(p.id); },
          { rootMargin: '-5% 0px -85% 0px', threshold: 0 }
        );
        obs.observe(el);
        observers.push(obs);
      });
    });
    return () => observers.forEach(o => o.disconnect());
  }, [itinerary.days]);


  const MAX_BUDGET = itinerary.maxBudget || 1500000;
  const [editingBudget, setEditingBudget] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const FUEL_PRICE_PER_LITER = 1700;
  const CAR_EFFICIENCY = 13;
  // 코드 오류 수정 및 3일차 일정 변경 키
  const STORAGE_KEY = 'travel_planner_v105_fix_syntax_day3';
  const TIME_UNIT = 1;
  const DEFAULT_TRAVEL_MINS = 15;
  const DEFAULT_BUFFER_MINS = 10;
  const BUFFER_STEP = 1;
  const getMenuQty = (menu) => {
    const parsed = Number(menu?.qty);
    if (!Number.isFinite(parsed) || parsed <= 0) return 1;
    return parsed;
  };
  const getMenuLineTotal = (menu) => Number(menu?.price || 0) * getMenuQty(menu);
  const isRevisitCourse = (item) => {
    if (typeof item?.revisit === 'boolean') return item.revisit;
    const receiptNames = Array.isArray(item?.receipt?.items) ? item.receipt.items.map(m => m?.name || '').join(' ') : '';
    const hints = `${item?.memo || ''} ${receiptNames}`;
    return /재방문/i.test(hints);
  };
  const parseMinsLabel = (value, fallback) => {
    const hit = String(value || '').match(/(\d+)/);
    if (!hit) return fallback;
    const parsed = parseInt(hit[1], 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  };
  const haversineKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (d) => d * (Math.PI / 180);
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };
  const geoCacheRef = useRef({});

  // 1) basePlanRef 변경 시 내 장소들의 거리를 계산
  useEffect(() => {
    if (!basePlanRef?.address) {
      setPlaceDistanceMap({});
      return;
    }

    const calc = async () => {
      try {
        setLastAction("내 장소 거리 계산 중...");
        const baseRes = await searchAddressFromPlaceName(basePlanRef.address);
        if (!baseRes?.lat || !baseRes?.lon) {
          setLastAction("기준 일정의 좌표를 찾을 수 없습니다.");
          return;
        }
        const bLat = parseFloat(baseRes.lat);
        const bLon = parseFloat(baseRes.lon);

        const newMap = {};
        const places = itinerary.places || [];
        for (const p of places) {
          if (!p.receipt?.address && !p.address) continue;
          const queryAddr = p.receipt?.address || p.address;
          if (geoCacheRef.current[queryAddr]) {
            const { lat, lon } = geoCacheRef.current[queryAddr];
            newMap[p.id] = +haversineKm(bLat, bLon, lat, lon).toFixed(1);
          } else {
            const pRes = await searchAddressFromPlaceName(queryAddr);
            if (pRes?.lat && pRes?.lon) {
              geoCacheRef.current[queryAddr] = { lat: parseFloat(pRes.lat), lon: parseFloat(pRes.lon) };
              newMap[p.id] = +haversineKm(bLat, bLon, parseFloat(pRes.lat), parseFloat(pRes.lon)).toFixed(1);
            }
          }
        }
        setPlaceDistanceMap(newMap);
        setLastAction(`'${basePlanRef.name}' 기준으로 내 장소 거리를 업데이트했습니다.`);
      } catch (e) {
        console.error(e);
      }
    };
    calc();
  }, [basePlanRef?.id, basePlanRef?.address, itinerary.places]);

  const formatDistanceText = (distance) => {
    const num = Number(distance);
    if (!Number.isFinite(num) || num <= 0) return '미계산';
    return `${num}km`;
  };
  const getRouteAddress = (item, role = 'from') => {
    if (!item) return '';
    if (item.types?.includes('ship')) {
      if (role === 'from') return (item.endAddress || item.endPoint || '').trim();
      return (item.receipt?.address || item.startPoint || '').trim();
    }
    return (item.receipt?.address || item.address || '').trim();
  };
  const geocodeAddress = async (address) => {
    const key = String(address || '').trim();
    if (!key) return null;
    if (geoCacheRef.current[key]) return geoCacheRef.current[key];
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(key)}&format=json&limit=1`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return null;
      const coord = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      geoCacheRef.current[key] = coord;
      return coord;
    } catch {
      return null;
    }
  };
  const deepClone = (value) => JSON.parse(JSON.stringify(value));
  const normalizeAlternative = (alt = {}) => {
    const receipt = alt.receipt
      ? deepClone(alt.receipt)
      : { address: alt.address || '', items: deepClone(alt.items || []) };
    if (!Array.isArray(receipt.items)) receipt.items = [];
    return {
      activity: alt.activity || alt.name || '새로운 플랜',
      price: Number(alt.price || 0),
      memo: alt.memo || '',
      revisit: typeof alt.revisit === 'boolean' ? alt.revisit : false,
      business: normalizeBusiness(alt.business || {}),
      types: Array.isArray(alt.types) && alt.types.length ? deepClone(alt.types) : ['place'],
      duration: Number(alt.duration || 60),
      receipt,
    };
  };
  const toAlternativeFromItem = (item = {}) => normalizeAlternative({
    activity: item.activity,
    price: item.price,
    memo: item.memo,
    revisit: typeof item.revisit === 'boolean' ? item.revisit : isRevisitCourse(item),
    business: normalizeBusiness(item.business || {}),
    types: item.types,
    duration: item.duration,
    receipt: item.receipt || { address: item.address || '', items: [] }
  });
  const toAlternativeFromPlace = (place = {}) => normalizeAlternative({
    activity: place.name,
    price: place.price,
    memo: place.memo,
    revisit: typeof place.revisit === 'boolean' ? place.revisit : false,
    business: normalizeBusiness(place.business || {}),
    types: place.types,
    duration: place.duration || 60,
    receipt: place.receipt || { address: place.address || '', items: [] }
  });

  const calculateFuelCost = (km) => Math.round((km / CAR_EFFICIENCY) * FUEL_PRICE_PER_LITER);

  const timeToMinutes = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const parts = timeStr.split(':');
    if (parts.length < 2) return 0;
    const hrs = parseInt(parts[0], 10);
    const mins = parseInt(parts[1], 10);
    return (isNaN(hrs) ? 0 : hrs) * 60 + (isNaN(mins) ? 0 : mins);
  };

  const minutesToTime = (minutes) => {
    if (typeof minutes !== 'number' || isNaN(minutes)) return "00:00";
    let h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h >= 24) h = h % 24;
    if (h < 0) h = 24 + (h % 24);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };
  const getWeekdayForDayIndex = (dayIdx) => {
    if (!tripStartDate) return null;
    const date = new Date(tripStartDate);
    if (Number.isNaN(date.getTime())) return null;
    date.setDate(date.getDate() + dayIdx);
    const map = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return map[date.getDay()];
  };
  const getBusinessWarning = (item, dayIdx) => {
    const business = normalizeBusiness(item?.business || {});
    const hasBiz = business.open || business.close || business.breakStart || business.breakEnd || business.lastOrder || business.closedDays.length;
    if (!hasBiz) return '';
    const start = timeToMinutes(item?.time || '00:00');
    const end = start + (item?.duration || 60);
    if (business.open && start < timeToMinutes(business.open)) return `운영 시작 전 방문 (${business.open} 이후 권장)`;
    if (business.close && start >= timeToMinutes(business.close)) return `운영 종료 후 방문 (${business.close} 이전 권장)`;
    if (business.lastOrder && start > timeToMinutes(business.lastOrder)) return `라스트오더 이후 방문 (${business.lastOrder} 이전 권장)`;
    if (business.breakStart && business.breakEnd) {
      const bs = timeToMinutes(business.breakStart);
      const be = timeToMinutes(business.breakEnd);
      if (start < be && end > bs) return `브레이크 타임 겹침 (${business.breakStart}-${business.breakEnd})`;
    }
    const weekday = getWeekdayForDayIndex(dayIdx);
    if (weekday && business.closedDays.includes(weekday)) {
      const dayLabel = WEEKDAY_OPTIONS.find(d => d.value === weekday)?.label || weekday;
      return `${dayLabel}요일 휴무일 방문`;
    }
    return '';
  };
  const getDropWarning = (place, dIdx, insertAfterPIdx) => {
    if (!place?.business) return '';
    const business = normalizeBusiness(place.business || {});
    const hasBiz = business.open || business.close || business.breakStart || business.breakEnd || business.lastOrder || business.closedDays.length;
    if (!hasBiz) return '';
    const day = itinerary.days?.[dIdx];
    if (!day) return '';
    const prevItem = day.plan[insertAfterPIdx];
    const nextItem = day.plan[insertAfterPIdx + 1];
    const estimatedMins = prevItem
      ? timeToMinutes(prevItem.time || '00:00') + (prevItem.duration || 60)
      : nextItem ? timeToMinutes(nextItem.time || '00:00') : 0;
    const weekday = getWeekdayForDayIndex(dIdx);
    if (weekday && business.closedDays.includes(weekday)) {
      const label = WEEKDAY_OPTIONS.find(d => d.value === weekday)?.label || weekday;
      return `${label} 휴무`;
    }
    if (business.open && estimatedMins < timeToMinutes(business.open)) return `영업 전 (${business.open}~)`;
    if (business.close && estimatedMins >= timeToMinutes(business.close)) return `영업 종료`;
    if (business.lastOrder && estimatedMins > timeToMinutes(business.lastOrder)) return `라스트오더 이후`;
    if (business.breakStart && business.breakEnd) {
      const bs = timeToMinutes(business.breakStart);
      const be = timeToMinutes(business.breakEnd);
      if (estimatedMins >= bs && estimatedMins < be) return `브레이크 (${business.breakStart}~${business.breakEnd})`;
    }
    return '';
  };

  // 현재 스크롤 위치 아이템(activeItemId) 기준 시각/요일 계산
  const getActiveRefContext = () => {
    const weekdayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    for (let dIdx = 0; dIdx < (itinerary.days?.length || 0); dIdx++) {
      const day = itinerary.days[dIdx];
      const item = day.plan?.find(p => p.id === activeItemId && p.time);
      if (item) {
        let todayKey = weekdayMap[new Date().getDay()];
        if (tripStartDate) {
          const d = new Date(tripStartDate);
          d.setDate(d.getDate() + dIdx);
          todayKey = weekdayMap[d.getDay()];
        }
        return { refMins: timeToMinutes(item.time), todayKey, refTime: item.time };
      }
    }
    // fallback: 활성 일차 첫 아이템
    const activeDayData = itinerary.days?.find(d => d.day === activeDay);
    const firstItem = activeDayData?.plan?.find(p => p.type !== 'backup' && p.time);
    let todayKey = weekdayMap[new Date().getDay()];
    if (tripStartDate && activeDayData) {
      const d = new Date(tripStartDate);
      d.setDate(d.getDate() + (activeDayData.day - 1));
      todayKey = weekdayMap[d.getDay()];
    }
    const refMins = firstItem ? timeToMinutes(firstItem.time) : (new Date().getHours() * 60 + new Date().getMinutes());
    return { refMins, todayKey, refTime: firstItem?.time || null };
  };

  const getBusinessWarningNow = (businessRaw) => {
    const business = normalizeBusiness(businessRaw || {});
    const hasBiz = business.open || business.close || business.breakStart || business.breakEnd || business.lastOrder || business.closedDays.length;
    if (!hasBiz) return '';
    const { refMins, todayKey } = getActiveRefContext();
    if (business.closedDays.includes(todayKey)) {
      const label = WEEKDAY_OPTIONS.find(d => d.value === todayKey)?.label || todayKey;
      return `${label} 휴무일`;
    }
    if (business.open && refMins < timeToMinutes(business.open)) return `영업 전 (${business.open} 오픈)`;
    if (business.close && refMins >= timeToMinutes(business.close)) return `영업 종료 (${business.close} 마감)`;
    if (business.lastOrder && refMins > timeToMinutes(business.lastOrder)) return `라스트오더 이후 (${business.lastOrder})`;
    if (business.breakStart && business.breakEnd) {
      const bs = timeToMinutes(business.breakStart);
      const be = timeToMinutes(business.breakEnd);
      if (refMins >= bs && refMins < be) return `브레이크 타임 (${business.breakStart}~${business.breakEnd})`;
    }
    return '';
  };

  const formatBusinessSummary = (businessRaw) => {
    const business = normalizeBusiness(businessRaw || {});
    const segs = [];
    if (business.open || business.close) segs.push(`영업 ${business.open || '--:--'}~${business.close || '--:--'}`);
    if (business.breakStart || business.breakEnd) segs.push(`브레이크 ${business.breakStart || '--:--'}~${business.breakEnd || '--:--'}`);
    if (business.lastOrder) segs.push(`라스트오더 ${business.lastOrder}`);
    if (business.closedDays.length) {
      const labels = business.closedDays.map(v => WEEKDAY_OPTIONS.find(d => d.value === v)?.label || v).join(',');
      segs.push(`휴무 ${labels}`);
    }
    return segs.length ? segs.join(' · ') : '미설정';
  };

  const saveHistory = () => {
    setHistory(prev => {
      try {
        const newHistory = [...prev, JSON.parse(JSON.stringify(itinerary))];
        // 토스트 표시
        setUndoToast(true);
        if (undoToastTimerRef.current) clearTimeout(undoToastTimerRef.current);
        undoToastTimerRef.current = setTimeout(() => setUndoToast(false), 3000);
        return newHistory.slice(-20);
      } catch (e) { return prev; }
    });
  };

  const handleUndo = () => {
    if (history.length === 0) {
      setLastAction("되돌릴 작업이 없습니다.");
      return;
    }
    const previousState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setItinerary(previousState);
    setLastAction("이전 상태로 복구했습니다.");
  };

  // 숙소 overnight 소요 시간 크로스-데이 계산 (체크인 ~ 다음날 체크아웃)
  const recalculateLodgeDurations = (days) => {
    if (!Array.isArray(days)) return days;
    for (let dIdx = 0; dIdx < days.length - 1; dIdx++) {
      const day = days[dIdx];
      if (!day?.plan) continue;
      const mainItems = day.plan.filter(p => p.type !== 'backup');
      if (!mainItems.length) continue;
      const lastMain = mainItems[mainItems.length - 1];
      if (!lastMain.types?.includes('lodge')) continue;
      const nextDay = days[dIdx + 1];
      const nextMain = (nextDay?.plan || []).filter(p => p.type !== 'backup');
      if (!nextMain.length) continue;
      const nextFirst = nextMain[0];
      const checkinMins = timeToMinutes(lastMain.time || '00:00');
      const checkoutMins = timeToMinutes(nextFirst.time)
        - parseMinsLabel(nextFirst.travelTimeOverride, DEFAULT_TRAVEL_MINS)
        - parseMinsLabel(nextFirst.bufferTimeOverride, DEFAULT_BUFFER_MINS);
      // 숙소는 항상 다음 날 체크아웃이므로 +1440(24h) 보정
      const actualCheckout = checkoutMins <= checkinMins ? checkoutMins + 1440 : checkoutMins;
      const duration = Math.max(30, actualCheckout - checkinMins);
      const lodgeItem = day.plan.find(p => p.id === lastMain.id);
      if (lodgeItem) lodgeItem.duration = duration;
    }
    return days;
  };

  const recalculateSchedule = (dayPlan) => {
    if (!Array.isArray(dayPlan)) return [];

    let currentEndMinutes = 0;
    let lastMainItemIndex = -1;

    for (let i = 0; i < dayPlan.length; i++) {
      const currentItem = dayPlan[i];
      if (!currentItem || currentItem.type === 'backup') continue;

      if (lastMainItemIndex === -1) {
        const waiting = currentItem.waitingTime || 0;
        if (currentItem.types?.includes('ship') && currentItem.boardTime && currentItem.sailDuration != null) {
          currentEndMinutes = timeToMinutes(currentItem.boardTime) + currentItem.sailDuration;
        } else {
          currentEndMinutes = timeToMinutes(currentItem.time) + waiting + (currentItem.duration || 0);
        }
        lastMainItemIndex = i;
        continue;
      }

      const travelMinutes = parseMinsLabel(currentItem.travelTimeOverride, DEFAULT_TRAVEL_MINS);
      const bufferMinutes = parseMinsLabel(currentItem.bufferTimeOverride, DEFAULT_BUFFER_MINS);
      const waiting = currentItem.waitingTime || 0;

      const naturalArrivalMinutes = currentEndMinutes + travelMinutes + bufferMinutes;

      if (currentItem.isTimeFixed) {
        const fixedStartMinutes = timeToMinutes(currentItem.time);
        const requiredArrivalMinutes = fixedStartMinutes - waiting;
        const diff = requiredArrivalMinutes - naturalArrivalMinutes;

        if (diff !== 0 && lastMainItemIndex !== -1) {
          const prevItem = dayPlan[lastMainItemIndex];
          // 페리는 duration 자동 조정 금지 (하선 시간 기준으로 고정)
          if (!prevItem.types?.includes('ship')) {
            const oldDuration = prevItem.duration || 0;
            const newDuration = Math.max(0, oldDuration + diff);
            prevItem.duration = newDuration;
            const actualDiff = newDuration - oldDuration;
            currentEndMinutes += actualDiff;
          }
        }
      } else {
        const actualStartMinutes = naturalArrivalMinutes + waiting;
        currentItem.time = minutesToTime(actualStartMinutes);
      }

      const currentStartMinutes = timeToMinutes(currentItem.time);
      const currentWaiting = currentItem.waitingTime || 0;
      if (currentItem.types?.includes('ship') && currentItem.boardTime && currentItem.sailDuration != null) {
        // 페리: 하선 시간(출항 + 소요) 기준으로 다음 일정 계산
        currentEndMinutes = timeToMinutes(currentItem.boardTime) + currentItem.sailDuration;
      } else {
        currentEndMinutes = currentStartMinutes + currentWaiting + (currentItem.duration || 0);
      }
      lastMainItemIndex = i;
    }
    return dayPlan;
  };

  const updateStartTime = (dayIdx, pIdx, delta) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];

      const currentMinutes = timeToMinutes(item.time);
      item.time = minutesToTime(currentMinutes + delta);
      item.isTimeFixed = true;

      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      recalculateLodgeDurations(nextData.days);
      return nextData;
    });
    setLastAction("시작 시간을 조정했습니다.");
  };

  const updateStartHour = (dayIdx, pIdx, deltaHour) => {
    updateStartTime(dayIdx, pIdx, deltaHour * 60);
  };

  const updateStartMinute = (dayIdx, pIdx, deltaMinute) => {
    updateStartTime(dayIdx, pIdx, deltaMinute);
  };

  const updateDuration = (dayIdx, pIdx, delta) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];

      item.duration = Math.max(0, (item.duration || 0) + delta);
      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });
    setLastAction("소요 시간을 변경했습니다.");
  };

  const resetDuration = (dayIdx, pIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];

      item.duration = 60;
      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });
    setLastAction("소요 시간을 60분으로 초기화했습니다.");
  };

  const updateWaitingTime = (dayIdx, pIdx, delta) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];

      item.waitingTime = Math.max(0, (item.waitingTime || 0) + delta);
      if (item.waitingTime === 0) delete item.waitingTime;

      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });

    if (delta > 0) setLastAction("대기 시간을 추가했습니다.");
    else setLastAction("대기 시간을 줄였습니다.");
  };

  const updateTravelTime = (dayIdx, pIdx, delta) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];

      let minutes = parseMinsLabel(item.travelTimeOverride, DEFAULT_TRAVEL_MINS);

      minutes = Math.max(0, minutes + delta);
      item.travelTimeOverride = `${minutes}분`;

      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      recalculateLodgeDurations(nextData.days);
      return nextData;
    });
    setLastAction("이동 시간을 조정했습니다.");
  };

  const updateBufferTime = (dayIdx, pIdx, delta) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];

      let minutes = parseMinsLabel(item.bufferTimeOverride, DEFAULT_BUFFER_MINS);
      minutes = Math.max(0, minutes + delta);
      item.bufferTimeOverride = `${minutes}분`;

      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      recalculateLodgeDurations(nextData.days);
      return nextData;
    });
    setLastAction("버퍼 시간을 조정했습니다.");
  };

  const resetTravelTime = (dayIdx, pIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const autoTime = nextData.days[dayIdx].plan[pIdx].travelTimeAuto;
      nextData.days[dayIdx].plan[pIdx].travelTimeOverride = autoTime || '15분';
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
    setLastAction("이동 시간을 기본값으로 초기화했습니다.");
  };

  const toggleTimeFix = (dayIdx, pIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];

      item.isTimeFixed = !item.isTimeFixed;
      if (!item.isTimeFixed) {
        nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      }
      return nextData;
    });
    setLastAction(itinerary.days[dayIdx].plan[pIdx].isTimeFixed ? "시간이 고정되었습니다." : "시간 고정이 해제되었습니다.");
  };

  const budgetSummary = useMemo(() => {
    let totalSpent = 0;
    if (!itinerary || !itinerary.days) return { total: 0, remaining: MAX_BUDGET };
    itinerary.days.forEach(day => {
      day.plan?.forEach(p => {
        if (p.type !== 'backup') {
          totalSpent += Number(p.price || 0);
          if (p.distance) totalSpent += calculateFuelCost(p.distance);
        }
      });
    });
    return { total: totalSpent, remaining: MAX_BUDGET - totalSpent };
  }, [itinerary]);

  const distanceSortedPlaces = useMemo(() => {
    const list = [...(itinerary.places || [])];
    if (!basePlanRef?.id) {
      // 가나다 순(알파벳) 정렬
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko'));
    }
    return list.sort((a, b) => {
      const da = placeDistanceMap[a.id];
      const db = placeDistanceMap[b.id];
      if (da == null && db == null) return (a.name || '').localeCompare(b.name || '', 'ko');
      if (da == null) return 1;
      if (db == null) return -1;
      return da - db;
    });
  }, [itinerary.places, placeDistanceMap, basePlanRef?.id]);

  const updateMemo = (dayIdx, pIdx, value) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.days[dayIdx].plan[pIdx].memo = value;
      return nextData;
    });
  };
  const updatePlanBusinessField = (dayIdx, pIdx, field, value) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      item.business = normalizeBusiness(item.business || {});
      item.business[field] = value;
      return nextData;
    });
  };
  const togglePlanClosedDay = (dayIdx, pIdx, weekday) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      item.business = normalizeBusiness(item.business || {});
      item.business.closedDays = item.business.closedDays.includes(weekday)
        ? item.business.closedDays.filter(v => v !== weekday)
        : [...item.business.closedDays, weekday];
      return nextData;
    });
  };

  const updateAddress = (dayIdx, pIdx, value) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      if (!item.receipt) item.receipt = { address: '', items: [] };
      item.receipt.address = value;
      return nextData;
    });
  };

  const updateActivityName = (dayIdx, pIdx, value) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.days[dayIdx].plan[pIdx].activity = value;
      return nextData;
    });
  };

  const updatePlanTags = (dayIdx, pIdx, tags) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      item.types = normalizeTagOrder(tags);
      return nextData;
    });
    setLastAction("태그를 업데이트했습니다.");
  };

  const updateMenuData = (dayIdx, pIdx, menuIdx, field, value) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const planItem = nextData.days[dayIdx].plan[pIdx];
      const items = planItem.receipt?.items || [];
      const target = items[menuIdx];
      if (!target) return nextData;
      if (field === 'toggle') {
        target.selected = !target.selected;
        if (target.selected && (target.qty || 0) === 0) target.qty = 1;
      } else if (field === 'qty') {
        target.qty = Math.max(0, (target.qty || 0) + value);
        target.selected = target.qty > 0;
      } else if (field === 'name') {
        target.name = value;
      } else if (field === 'price') {
        target.price = value === '' ? 0 : Number(value);
      }
      planItem.price = items.reduce((sum, m) => sum + (m.selected ? getMenuLineTotal(m) : 0), 0);
      return nextData;
    });
    setLastAction("메뉴 정보가 저장되었습니다.");
  };

  const addMenuItem = (dayIdx, pIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const planItem = nextData.days[dayIdx].plan[pIdx];
      if (!planItem.receipt) planItem.receipt = { address: '', items: [] };
      if (!planItem.receipt.items) planItem.receipt.items = [];
      planItem.receipt.items.push({ name: "새 메뉴", price: 0, qty: 1, selected: true });
      return nextData;
    });
  };

  const deleteMenuItem = (dayIdx, pIdx, menuIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const planItem = nextData.days[dayIdx].plan[pIdx];
      if (planItem.receipt && planItem.receipt.items) {
        planItem.receipt.items.splice(menuIdx, 1);
        planItem.price = planItem.receipt.items.reduce((sum, m) => sum + (m.selected ? getMenuLineTotal(m) : 0), 0);
      }
      return nextData;
    });
  };

  const updateShipPoint = (dayIdx, pIdx, field, value) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.days[dayIdx].plan[pIdx][field] = value;
      return nextData;
    });
  };

  const updateFerryBoardTime = (dayIdx, pIdx, deltaMinutes) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      const loadMins = timeToMinutes(item.time || '00:00');
      const currentBoard = timeToMinutes(item.boardTime || minutesToTime(loadMins + 60));
      const newBoard = Math.max(loadMins, currentBoard + deltaMinutes);
      item.boardTime = minutesToTime(newBoard);
      const sailDur = item.sailDuration ?? 240;
      item.duration = (newBoard - loadMins) + sailDur;
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
  };

  const updateFerrySailDuration = (dayIdx, pIdx, deltaMinutes) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      const loadMins = timeToMinutes(item.time || '00:00');
      const boardMins = timeToMinutes(item.boardTime || minutesToTime(loadMins + 60));
      const newSail = Math.max(30, (item.sailDuration ?? 240) + deltaMinutes);
      item.sailDuration = newSail;
      item.duration = (boardMins - loadMins) + newSail;
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
  };

  const parseFerryTimeInput = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (!digits) return null;
    let h, m;
    if (digits.length <= 2) { h = parseInt(digits); m = 0; }
    else { h = parseInt(digits.slice(0, digits.length - 2)); m = parseInt(digits.slice(-2)); }
    h = Math.min(23, Math.max(0, h));
    m = Math.min(59, Math.max(0, m));
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const commitFerryTime = (dayIdx, pIdx, field, raw) => {
    if (field === 'sail') {
      const mins = Math.max(30, parseInt(raw, 10) || 30);
      setItinerary(prev => {
        const nextData = JSON.parse(JSON.stringify(prev));
        const item = nextData.days[dayIdx].plan[pIdx];
        const loadMins = timeToMinutes(item.time || '00:00');
        const boardMins = timeToMinutes(item.boardTime || minutesToTime(loadMins + 60));
        item.sailDuration = mins;
        item.duration = Math.max(0, boardMins - loadMins) + mins;
        nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
        return nextData;
      });
      setFerryEditField(null);
      return;
    }
    const time = parseFerryTimeInput(raw);
    if (!time) return;
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      if (field === 'load') {
        item.time = time;
        item.isTimeFixed = true;
      } else if (field === 'depart') {
        item.boardTime = time;
        const loadMins = timeToMinutes(item.time || '00:00');
        const boardMins = timeToMinutes(time);
        item.duration = Math.max(0, boardMins - loadMins) + (item.sailDuration ?? 240);
      } else if (field === 'disembark') {
        const boardMins = timeToMinutes(item.boardTime || minutesToTime(timeToMinutes(item.time || '00:00') + 60));
        const disMins = timeToMinutes(time);
        item.sailDuration = Math.max(30, disMins - boardMins);
        const loadMins = timeToMinutes(item.time || '00:00');
        item.duration = Math.max(0, boardMins - loadMins) + item.sailDuration;
      }
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
    setFerryEditField(null);
  };


  const addPlaceAsPlanB = (dayIdx, pIdx, place) => {
    saveHistory();
    setItinerary(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const item = next.days[dayIdx].plan[pIdx];
      if (!item.alternatives) item.alternatives = [];
      item.alternatives.push(toAlternativeFromPlace(place));
      return next;
    });
    setLastAction(`'${place.name}'이(가) 플랜 B로 추가되었습니다.`);
  };

  const dropAltOnLibrary = (dayIdx, pIdx, altIdx) => {
    const alt = normalizeAlternative(itinerary.days[dayIdx].plan[pIdx].alternatives[altIdx]);
    saveHistory();
    setItinerary(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.days[dayIdx].plan[pIdx].alternatives.splice(altIdx, 1);
      if (!next.places) next.places = [];
      next.places.push({
        id: `place_${Date.now()}`,
        name: alt.activity,
        types: alt.types || ['place'],
        revisit: typeof alt.revisit === 'boolean' ? alt.revisit : false,
        business: normalizeBusiness(alt.business || {}),
        address: alt.receipt?.address || '',
        price: alt.price || 0,
        memo: alt.memo || '',
        receipt: deepClone(alt.receipt || { address: '', items: [] })
      });
      return next;
    });
    setLastAction(`'${alt.activity}'이(가) 장소 목록으로 이동되었습니다.`);
  };

  const insertAlternativeToTimeline = (targetDayIdx, insertAfterPIdx, sourceDayIdx, sourcePIdx, sourceAltIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const sourcePlanItem = nextData.days[sourceDayIdx]?.plan?.[sourcePIdx];
      const rawAlt = sourcePlanItem?.alternatives?.[sourceAltIdx];
      if (!rawAlt) return nextData;

      const alt = normalizeAlternative(rawAlt);
      sourcePlanItem.alternatives.splice(sourceAltIdx, 1);

      const targetDayPlan = nextData.days[targetDayIdx].plan;
      const prevItem = targetDayPlan[insertAfterPIdx];
      if (!prevItem) return nextData;

      const prevEnd = timeToMinutes(prevItem.time) + (prevItem.duration || 0) + (prevItem.waitingTime || 0);
      const travelMins = parseMinsLabel(prevItem.travelTimeOverride, DEFAULT_TRAVEL_MINS);
      const bufferMins = parseMinsLabel(prevItem.bufferTimeOverride, DEFAULT_BUFFER_MINS);

      targetDayPlan.splice(insertAfterPIdx + 1, 0, {
        id: `item_${Date.now()}`,
        time: minutesToTime(prevEnd + travelMins + bufferMins),
        activity: alt.activity,
        types: deepClone(alt.types || ['place']),
        revisit: typeof alt.revisit === 'boolean' ? alt.revisit : false,
        business: normalizeBusiness(alt.business || {}),
        price: Number(alt.price || 0),
        duration: Number(alt.duration || 60),
        state: 'unconfirmed',
        travelTimeOverride: `${DEFAULT_TRAVEL_MINS}분`,
        bufferTimeOverride: `${DEFAULT_BUFFER_MINS}분`,
        receipt: deepClone(alt.receipt || { address: '', items: [] }),
        memo: alt.memo || ''
      });

      nextData.days[targetDayIdx].plan = recalculateSchedule(targetDayPlan);
      return nextData;
    });
    setLastAction("플랜 B를 일정표에 추가했습니다.");
  };

  const removeAlternative = (dayIdx, pIdx, altIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const targetItem = nextData.days[dayIdx].plan[pIdx];
      if (targetItem.alternatives) {
        targetItem.alternatives.splice(altIdx, 1);
      }
      return nextData;
    });
    setLastAction("플랜이 삭제되었습니다.");
  };

  const swapAlternative = (dayIdx, pIdx, altIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];

      if (!item.alternatives || !item.alternatives[altIdx]) return nextData;

      const alt = normalizeAlternative(item.alternatives[altIdx]);
      const currentAsAlt = toAlternativeFromItem(item);

      item.activity = alt.activity;
      item.price = alt.price;
      item.memo = alt.memo;
      item.revisit = typeof alt.revisit === 'boolean' ? alt.revisit : false;
      item.business = normalizeBusiness(alt.business || {});
      item.types = deepClone(alt.types || ['place']);
      item.duration = alt.duration || item.duration || 60;
      item.receipt = deepClone(alt.receipt || { address: '', items: [] });

      item.alternatives[altIdx] = currentAsAlt;

      return nextData;
    });
    setLastAction("플랜을 교체했습니다.");
  };

  const rotatePlan = (dayIdx, pIdx, dir) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      if (!item.alternatives || item.alternatives.length === 0) return nextData;
      const alts = item.alternatives;
      const currentAsAlt = toAlternativeFromItem(item);
      const nextMain = normalizeAlternative(dir > 0 ? alts[0] : alts[alts.length - 1]);
      item.activity = nextMain.activity;
      item.price = nextMain.price;
      item.memo = nextMain.memo;
      item.revisit = typeof nextMain.revisit === 'boolean' ? nextMain.revisit : false;
      item.business = normalizeBusiness(nextMain.business || {});
      item.types = deepClone(nextMain.types || ['place']);
      item.duration = nextMain.duration || item.duration || 60;
      item.receipt = deepClone(nextMain.receipt || { address: '', items: [] });
      item.alternatives = dir > 0 ? [...alts.slice(1), currentAsAlt] : [currentAsAlt, ...alts.slice(0, -1)];
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
    setLastAction("플랜을 변경했습니다.");
  };

  const updateAlternative = (dayIdx, pIdx, altIdx, field, value) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const alt = nextData.days[dayIdx].plan[pIdx].alternatives[altIdx];
      if (alt) {
        if (field === 'price') alt.price = value === '' ? 0 : Number(value);
        else alt[field] = value;
      }
      return nextData;
    });
  };

  const deletePlanItem = (dayIdx, pIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.days[dayIdx].plan.splice(pIdx, 1);
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
    setLastAction("일정이 삭제되었습니다.");
  };

  const movePlanItem = (sourceDayIdx, sourcePIdx, targetDayIdx, insertAfterPIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const sourcePlan = nextData.days[sourceDayIdx].plan;
      const targetPlan = nextData.days[targetDayIdx].plan;
      const [item] = sourcePlan.splice(sourcePIdx, 1);

      // 같은 일차 내에서 뒤로 이동할 경우 인덱스 보정
      let targetIdx = insertAfterPIdx + 1;
      if (sourceDayIdx === targetDayIdx && sourcePIdx < targetIdx) {
        targetIdx--;
      }

      targetPlan.splice(targetIdx, 0, item);

      nextData.days[sourceDayIdx].plan = recalculateSchedule(sourcePlan);
      if (sourceDayIdx !== targetDayIdx) {
        nextData.days[targetDayIdx].plan = recalculateSchedule(targetPlan);
      }
      return nextData;
    });
    setLastAction("일정 순서를 변경했습니다.");
  };

  const toggleReceipt = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
    if (expandedId !== id) {
      let found = null;
      for (const d of itinerary.days || []) {
        found = d.plan?.find(p => p.id === id);
        if (found) break;
      }
      if (found) {
        const addr = getRouteAddress(found, 'to');
        if (addr) {
          setBasePlanRef({ id: found.id, name: found.activity, address: addr });
          setLastAction(`'${found.activity}'을(를) 내 장소 거리 계산 기준으로 설정했습니다.`);
        } else {
          setBasePlanRef({ id: found.id, name: found.activity, address: '' });
          setLastAction(`'${found.activity}'엔 주소 정보가 없어 거리를 계산할 수 없습니다.`);
        }
      }
    }
  };


  const getCategoryBadge = (type) => {
    const style = "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0";
    switch (type) {
      case 'food': return <div key={type} className={`${style} text-rose-500 bg-red-50 border-red-100`}><Utensils size={10} /> 식당</div>;
      case 'cafe': return <div key={type} className={`${style} text-amber-600 bg-amber-50 border-amber-100`}><Coffee size={10} /> 카페</div>;
      case 'tour': return <div key={type} className={`${style} text-purple-600 bg-purple-50 border-purple-100`}><Camera size={10} /> 관광</div>;
      case 'lodge': return <div key={type} className={`${style} text-indigo-600 bg-indigo-50 border-indigo-100`}><Bed size={10} /> 숙소</div>;
      case 'ship': return <div key={type} className={`${style} text-blue-600 bg-blue-50 border-blue-100`}><Anchor size={10} /> 선박</div>;
      case 'openrun': return <div key={type} className={`${style} text-red-500 bg-red-50 border-red-100`}><Timer size={10} /> 오픈런</div>;
      case 'view': return <div key={type} className={`${style} text-sky-600 bg-sky-50 border-sky-100`}><Eye size={10} /> 뷰맛집</div>;
      case 'experience': return <div key={type} className={`${style} text-emerald-600 bg-emerald-50 border-emerald-100`}><Star size={10} /> 체험</div>;
      case 'pickup': return <div key={type} className={`${style} text-orange-500 bg-orange-50 border-orange-100`}><Package size={10} /> 픽업</div>;
      case 'new': return <span key="new" className={style + ' text-emerald-600 bg-emerald-50 border-emerald-200'}>신규</span>;
      case 'revisit': return <span key="revisit" className={style + ' text-blue-600 bg-blue-50 border-blue-200'}>재방문</span>;
      case 'place': return <div key={type} className={`${style} text-slate-500 bg-slate-100 border-slate-200`}><MapIcon size={10} /> 장소</div>;
      default: return <div key={type} className={`${style} text-slate-500 bg-slate-100 border-slate-200`}># {type}</div>;
    }
  };

  const addPlace = (formData) => {
    if (!newPlaceName.trim()) return;
    const { types = ['place'], menus = [], address = '', memo = '', revisit = false, business = EMPTY_BUSINESS } = formData || {};
    setItinerary(prev => ({
      ...prev,
      places: [...(prev.places || []), {
        id: `place_${Date.now()}`,
        name: newPlaceName.trim(),
        types: normalizeTagOrder(types),
        revisit: !!revisit,
        business: normalizeBusiness(business),
        address: address.trim(),
        price: menus.reduce((sum, m) => sum + (Number(m.price) || 0), 0),
        memo: memo.trim(),
        receipt: { address: address.trim(), items: menus.map(m => ({ ...m, qty: 1, selected: true })) }
      }]
    }));
    setNewPlaceName('');
    setNewPlaceTypes(['food']);
    setIsAddingPlace(false);
    setLastAction(`'${newPlaceName.trim()}'이(가) 장소 목록에 추가되었습니다.`);
  };

  const removePlace = (placeId) => {
    setItinerary(prev => ({
      ...prev,
      places: (prev.places || []).filter(p => p.id !== placeId)
    }));
  };

  const updatePlace = (placeId, data) => {
    setItinerary(prev => ({
      ...prev,
      places: (prev.places || []).map(p => p.id === placeId ? { ...p, ...data } : p)
    }));
  };

  const dropTimelineItemOnLibrary = (dayIdx, pIdx, planBMode = 'with_all') => {
    const item = itinerary.days[dayIdx].plan[pIdx];
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const planItem = nextData.days[dayIdx].plan[pIdx];
      const alternatives = planItem?.alternatives || [];

      if (planBMode === 'replace_with_planb' && alternatives.length > 0) {
        const replacement = normalizeAlternative(alternatives[0]);
        planItem.activity = replacement.activity;
        planItem.types = replacement.types;
        planItem.revisit = replacement.revisit;
        planItem.business = replacement.business;
        planItem.memo = replacement.memo;
        planItem.price = replacement.price;
        planItem.duration = replacement.duration || planItem.duration || 60;
        planItem.receipt = deepClone(replacement.receipt || { address: '', items: [] });
        planItem.alternatives = alternatives.slice(1);
      } else {
        nextData.days[dayIdx].plan.splice(pIdx, 1);
      }
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      if (!nextData.places) nextData.places = [];
      nextData.places.push({
        id: `place_${Date.now()}`,
        name: item.activity,
        types: item.types || ['place'],
        revisit: typeof item.revisit === 'boolean' ? item.revisit : isRevisitCourse(item),
        business: normalizeBusiness(item.business || {}),
        address: item.receipt?.address || '',
        price: item.price || 0,
        memo: item.memo || '',
        receipt: item.receipt || { items: [] }
      });
      if (planBMode === 'with_all') {
        (item.alternatives || []).forEach((altRaw, idx) => {
          const alt = normalizeAlternative(altRaw);
          nextData.places.push({
            id: `place_${Date.now()}_${idx}`,
            name: alt.activity,
            types: alt.types || ['place'],
            revisit: typeof alt.revisit === 'boolean' ? alt.revisit : false,
            business: normalizeBusiness(alt.business || {}),
            address: alt.receipt?.address || '',
            price: alt.price || 0,
            memo: alt.memo || '',
            receipt: deepClone(alt.receipt || { address: '', items: [] })
          });
        });
      }
      return nextData;
    });
    if (planBMode === 'replace_with_planb') {
      setLastAction(`'${item.activity}'은(는) 내 장소로 이동, 일정은 플랜 B로 대체했습니다.`);
    } else if (planBMode === 'with_all') {
      setLastAction(`'${item.activity}' 일정과 플랜 B가 내 장소로 이동되었습니다.`);
    } else {
      setLastAction(`'${item.activity}' 일정이 내 장소로 이동되었습니다.`);
    }
  };
  const askPlanBMoveMode = (item) => {
    const altCount = item?.alternatives?.length || 0;
    if (altCount === 0) return 'only_main';
    const withAll = window.confirm(`플랜 B ${altCount}개가 있습니다.\n같이 내 장소로 보낼까요?`);
    if (withAll) return 'with_all';
    const replace = window.confirm('기준 일정을 플랜 B 1안으로 대체할까요?\n(확인: 대체 / 취소: 기준 일정만 내 장소로 이동)');
    return replace ? 'replace_with_planb' : 'only_main';
  };

  const addNewItem = (dayIdx, insertIndex, types = ['place'], placeData = null) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const prevItem = dayPlan[insertIndex];
      const prevEnd = timeToMinutes(prevItem.time) + (prevItem.duration || 0) + (prevItem.waitingTime || 0);

      const travelMins = parseMinsLabel(prevItem.travelTimeOverride, DEFAULT_TRAVEL_MINS);
      const bufferMins = parseMinsLabel(prevItem.bufferTimeOverride, DEFAULT_BUFFER_MINS);
      const newTime = minutesToTime(prevEnd + travelMins + bufferMins);

      const label = PLACE_TYPES.find(t => t.types[0] === (placeData?.types?.[0] || types[0]))?.label || '장소';
      const receiptPayload = placeData?.receipt
        ? deepClone(placeData.receipt)
        : { address: placeData?.address || '주소 미정', items: [] };
      const priceFromReceipt = Array.isArray(receiptPayload.items)
        ? receiptPayload.items.reduce((sum, m) => sum + (m.selected === false ? 0 : getMenuLineTotal(m)), 0)
        : 0;

      dayPlan.splice(insertIndex + 1, 0, {
        id: `item_${Date.now()}`,
        time: newTime,
        activity: placeData?.name || `새 ${label}`,
        types: placeData?.types || types,
        revisit: typeof placeData?.revisit === 'boolean' ? placeData.revisit : false,
        business: normalizeBusiness(placeData?.business || {}),
        price: placeData ? (priceFromReceipt || placeData.price || 0) : 0,
        duration: 60,
        state: 'unconfirmed',
        travelTimeOverride: '15분',
        bufferTimeOverride: '10분',
        receipt: receiptPayload,
        memo: placeData?.memo || ''
      });
      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });
    setLastAction(placeData ? `'${placeData.name}'이(가) 일정에 추가되었습니다.` : "새 일정이 추가되었습니다.");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    saveHistory();
    const updatedDays = itinerary.days.map(day => ({
      ...day,
      plan: recalculateSchedule(day.plan.map(item => ({ ...item })))
    }));
    setTimeout(() => {
      setItinerary(prev => ({ ...prev, days: updatedDays }));
      setLastAction("시간 및 일정이 재계산되었습니다.");
      setRefreshing(false);
    }, 600);
  };

  const addSuggestionAsAlternative = (dayIdx, pIdx, suggestion) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const targetItem = nextData.days[dayIdx].plan[pIdx];

      if (!targetItem.alternatives) targetItem.alternatives = [];

      targetItem.alternatives.push(normalizeAlternative({
        activity: suggestion.name,
        price: suggestion.price,
        memo: 'AI 추천 장소',
        types: ['place'],
        receipt: { address: suggestion.address || '', items: [] }
      }));
      return nextData;
    });
    setAiSuggestions(prev => {
      const next = { ...prev };
      delete next[itinerary.days[dayIdx].plan[pIdx].id];
      return next;
    });
    setLastAction(`'${suggestion.name}'이(가) 대안 일정으로 등록되었습니다.`);
  };

  const autoCalculateRouteFor = async (dayIdx, targetIdx) => {
    let prevItem;
    if (targetIdx === 0 && dayIdx > 0) {
      const prevDayPlan = itinerary.days[dayIdx - 1].plan;
      prevItem = prevDayPlan[prevDayPlan.length - 1];
    } else {
      prevItem = itinerary.days[dayIdx].plan[targetIdx - 1];
    }
    const targetItem = itinerary.days[dayIdx].plan[targetIdx];
    const addr1 = getRouteAddress(prevItem, 'from');
    const addr2 = getRouteAddress(targetItem, 'to');

    if (!addr1 || !addr2 || addr1.includes('없음') || addr2.includes('없음')) {
      setLastAction("두 장소의 올바른 주소가 필요합니다.");
      return;
    }

    const key = `${addr1}|${addr2}`;
    if (routeCache[key] && !routeCache[key].failed) {
      applyRoute(dayIdx, targetIdx, routeCache[key]);
      return;
    }

    setCalculatingRouteId(`${dayIdx}_${targetIdx}`);
    setLastAction("경로와 거리를 자동 계산 중입니다...");

    try {
      const getCoords = async (addr, name = '') => {
        const candidates = [
          String(addr || '').trim(),
          String(addr || '').split(/[,\(]/)[0].trim(),
          String(addr || '').replace(/제주특별자치도/g, '제주').trim(),
          String(addr || '').replace(/특별자치도/g, '').trim(),
          `${tripRegion} ${String(name || '').trim()}`.trim(),
          String(name || '').trim(),
        ].filter(Boolean);
        for (const raw of candidates) {
          const q = raw.split(/\s+/).slice(0, 8).join(' ');
          const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`);
          const data = await r.json();
          if (data && data.length > 0) return { lat: data[0].lat, lon: data[0].lon };
        }
        return null;
      };

      const c1 = await getCoords(addr1, prevItem?.activity);
      if (!c1) throw new Error("출발지 좌표를 찾지 못했습니다.");
      await new Promise(r => setTimeout(r, 1000)); // Respect OpenStreetMaps limits
      const c2 = await getCoords(addr2, targetItem?.activity);
      if (!c2) throw new Error("도착지 좌표를 찾지 못했습니다.");

      const r2 = await fetch(`https://router.project-osrm.org/route/v1/driving/${c1.lon},${c1.lat};${c2.lon},${c2.lat}?overview=false`);
      const d2 = await r2.json();

      if (d2 && d2.routes && d2.routes.length > 0) {
        const osrmDistanceKm = d2.routes[0].distance / 1000;
        const osrmDurationMins = Math.ceil(d2.routes[0].duration / 60);
        const straightKm = haversineKm(
          parseFloat(c1.lat), parseFloat(c1.lon),
          parseFloat(c2.lat), parseFloat(c2.lon)
        );
        const isSameAddress = addr1.trim() === addr2.trim();
        const isSuspiciousZero = !isSameAddress && osrmDistanceKm < 0.05 && straightKm > 0.3;

        const routeData = {
          distance: +(isSuspiciousZero ? straightKm : osrmDistanceKm).toFixed(1),
          durationMins: Math.max(1, isSuspiciousZero ? Math.ceil((straightKm / 35) * 60) : osrmDurationMins)
        };
        setRouteCache(prev => ({ ...prev, [key]: routeData }));
        applyRoute(dayIdx, targetIdx, routeData);
        setLastAction(isSuspiciousZero
          ? `경로 보정: ${routeData.distance}km, ${routeData.durationMins}분`
          : `경로 확인: ${routeData.distance}km, ${routeData.durationMins}분`);
      } else {
        const straightKm = haversineKm(
          parseFloat(c1.lat), parseFloat(c1.lon),
          parseFloat(c2.lat), parseFloat(c2.lon)
        );
        const routeData = {
          distance: +Math.max(0.1, straightKm).toFixed(1),
          durationMins: Math.max(1, Math.ceil((Math.max(0.1, straightKm) / 35) * 60))
        };
        setRouteCache(prev => ({ ...prev, [key]: routeData }));
        applyRoute(dayIdx, targetIdx, routeData);
        setLastAction(`경로 보정: ${routeData.distance}km, ${routeData.durationMins}분`);
        return;
      }
    } catch (e) {
      console.error(e);
      // 좌표/경로 API 실패 시 마지막 안전망: 주소 문자열 기반 대략치
      const roughDistance = Math.max(0.3, Math.min(25, Math.abs(addr1.length - addr2.length) * 0.4));
      const fallbackData = {
        distance: +roughDistance.toFixed(1),
        durationMins: Math.max(1, Math.ceil((roughDistance / 30) * 60))
      };
      setRouteCache(prev => ({ ...prev, [key]: fallbackData }));
      applyRoute(dayIdx, targetIdx, fallbackData);
      setLastAction(`경로 보정(대체): ${fallbackData.distance}km, ${fallbackData.durationMins}분`);
    } finally {
      setCalculatingRouteId(null);
    }
  };

  const autoCalculateAllRoutes = async () => {
    setIsCalculatingAllRoutes(true);
    setLastAction("전체 경로 재탐색 시작...");
    for (let di = 0; di < itinerary.days.length; di++) {
      const plan = itinerary.days[di].plan || [];
      for (let pi = 0; pi < plan.length; pi++) {
        if (plan[pi].type === 'backup' || plan[pi].types?.includes('ship')) continue;
        await autoCalculateRouteFor(di, pi);
        await new Promise(r => setTimeout(r, 500));
      }
    }
    setIsCalculatingAllRoutes(false);
    setLastAction("전체 경로 재탐색 완료!");
  };

  const applyRoute = (dayIdx, targetIdx, { distance, durationMins }) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const p = nextData.days[dayIdx].plan[targetIdx];
      p.distance = distance;
      p.travelTimeOverride = `${durationMins}분`;
      p.travelTimeAuto = `${durationMins}분`;
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
  };



  const addBackupItem = (dayIdx, insertIndex) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.days[dayIdx].plan.splice(insertIndex + 1, 0, {
        id: `backup_${Date.now()}`,
        time: '-',
        activity: '별도 일정',
        type: 'backup',
        price: 0,
        duration: 60,
        state: 'unconfirmed',
        receipt: { address: '장소 미정', items: [] },
        types: ['place']
      });
      return nextData;
    });
    setLastAction("별도 일정이 추가되었습니다.");
  };

  // Firestore 저장 (1초 디바운스, 사용자 UID 기준)
  useEffect(() => {
    if (!user || loading || !itinerary || !itinerary.days || itinerary.days.length === 0) return;
    if (user.isGuest) {
      safeLocalStorageSet('guest_itinerary', JSON.stringify(itinerary));
      return;
    }
    const timer = setTimeout(() => {
      setDoc(doc(db, 'users', user.uid, 'itinerary', 'main'), itinerary)
        .catch(e => console.error('Firestore 저장 실패:', e));
    }, 1000);
    return () => clearTimeout(timer);
  }, [itinerary, loading, user]);

  // Firestore 로드 (사용자 UID 기준 + 마이그레이션 로직)
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      if (user.isGuest) {
        try {
          const raw = safeLocalStorageGet('guest_itinerary', '');
          const parsed = raw ? JSON.parse(raw) : null;
          if (parsed && Array.isArray(parsed.days)) {
            setItinerary(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('게스트 로컬 데이터 로드 실패:', e);
        }
      }
      try {
        // 1. 먼저 내 고유 데이터가 있는지 확인
        const snap = await getDoc(doc(db, 'users', user.uid, 'itinerary', 'main'));
        let finalData = null;

        if (snap.exists()) {
          finalData = snap.data();
        } else {
          // 2. 고유 데이터가 없다면, 기존에 공용으로 쓰던 데이터가 있는지 확인
          const commonSnap = await getDoc(doc(db, 'itinerary', 'main'));
          if (commonSnap.exists()) {
            finalData = commonSnap.data();
            // 3. 공용 데이터를 찾았다면, 내 계정으로 즉시 복사 (마이그레이션)
            await setDoc(doc(db, 'users', user.uid, 'itinerary', 'main'), finalData);
            console.log('기존 데이터를 내 계정으로 성공적으로 가져왔습니다.');
          }
        }

        if (finalData && Array.isArray(finalData.days)) {
          const patchedDays = finalData.days.map(d => ({
            ...d,
            plan: (d.plan || []).map(p => {
              let updatedP = { ...p };
              if (updatedP.types?.includes('ship')) {
                const defaultStart = d.day === 1 ? '목포항' : '제주항';
                const defaultEnd = d.day === 1 ? '제주항' : '목포항';
                updatedP.startPoint = updatedP.startPoint || defaultStart;
                updatedP.endPoint = updatedP.endPoint || defaultEnd;
              }
              if (updatedP.receipt?.items) {
                updatedP.price = updatedP.receipt.items.reduce((sum, m) => sum + (m.selected ? getMenuLineTotal(m) : 0), 0);
              }
              return updatedP;
            })
          }));
          setItinerary({ days: patchedDays, places: finalData.places || [] });
          setLoading(false);
          return;
        }
      } catch (e) { console.error('Firestore 로드/마이그레이션 실패:', e); }

      // 초기 데이터
      const initialData = {
        days: [
          {
            day: 1,
            plan: [
              { id: 'd1_s1', time: '01:00', activity: '퀸 제누비아 2호', types: ['ship'], startPoint: '목포항', endPoint: '제주항', price: 310000, duration: 300, state: 'confirmed', isTimeFixed: true, receipt: { address: '전남 목포시 해안로 148', shipDetails: { depart: '01:00', loading: '22:30 ~ 00:00' }, items: [{ name: '차량 선적', price: 160000, qty: 1, selected: true }, { name: '주니어룸 (3인)', price: 150000, qty: 1, selected: true }] } },
              { id: 'd1_p1', time: '06:30', activity: '진아떡집', types: ['food', 'pickup'], price: 24000, duration: 15, state: 'confirmed', distance: 2, travelTimeOverride: '5분', receipt: { address: '제주 제주시 동문로4길 7-1', items: [{ name: '오메기떡 8알팩', price: 12000, qty: 2, selected: true }] }, memo: '오메기떡 픽업 필수!' },
              { id: 'd1_c1', time: '06:50', activity: '카페 듀포레', types: ['cafe', 'view'], price: 38500, duration: 145, state: 'confirmed', distance: 8, receipt: { address: '제주시 서해안로 579', items: [{ name: '아메리카노', price: 6500, qty: 2, selected: true }, { name: '비행기 팡도르', price: 12500, qty: 1, selected: true }, { name: '크로와상', price: 13000, qty: 1, selected: true }] }, memo: '비행기 이착륙 뷰 맛집' },
              { id: 'd1_f1', time: '09:30', activity: '말고기연구소', types: ['food', 'openrun'], price: 36000, duration: 60, state: 'confirmed', distance: 3, isTimeFixed: true, receipt: { address: '제주시 북성로 43', items: [{ name: '말육회 부각초밥', price: 12000, qty: 3, selected: true }] }, memo: '10:00 영업 시작' },
              { id: 'd1_c2', time: '12:30', activity: '만다리노카페 & 승마', types: ['cafe', 'experience'], price: 26000, duration: 120, state: 'confirmed', distance: 18, receipt: { address: '조천읍 함와로 585', items: [{ name: '만다리노 라떼', price: 8000, qty: 2, selected: true }, { name: '승마 체험', price: 10000, qty: 1, selected: true }, { name: '귤 따기 체험', price: 10000, qty: 1, selected: false }] }, memo: '승마 및 귤 체험 가능' },
              { id: 'd1_t1', time: '15:00', activity: '함덕잠수함', types: ['tour'], price: 79000, duration: 90, state: 'confirmed', distance: 10, receipt: { address: '조천읍 조함해안로 378', items: [{ name: '입장권', price: 28000, qty: 2, selected: true }] }, memo: '사전 예약 확인 필요' },
              { id: 'd1_f2', time: '18:30', activity: '존맛식당', types: ['food'], price: 69000, duration: 90, state: 'confirmed', distance: 2, receipt: { address: '제주시 조천읍 신북로 493', items: [{ name: '문어철판볶음', price: 39000, qty: 1, selected: true }] }, memo: '저녁 웨이팅 있을 수 있음' }
            ]
          },
          {
            day: 2,
            plan: [
              { id: 'd2_c1', time: '09:00', activity: '델문도', types: ['cafe', 'view'], price: 42500, duration: 60, state: 'confirmed', distance: 2, receipt: { address: '함덕 조함해안로 519-10', items: [{ name: '문도샌드', price: 12000, qty: 1, selected: true }] } },
              { id: 'd2_f1', time: '11:00', activity: '존맛식당', types: ['food'], price: 69000, duration: 90, state: 'confirmed', distance: 1, receipt: { address: '조천읍 신북로 493', items: [{ name: '재방문', price: 69000, qty: 1, selected: true }] } },
              { id: 'd2_l1', time: '20:00', activity: '통나무파크', types: ['lodge'], price: 100000, duration: 600, state: 'confirmed', distance: 45, receipt: { address: '애월읍 도치돌길 303', items: [{ name: '숙박비', price: 100000, qty: 1, selected: true }] } }
            ]
          },
          {
            day: 3,
            plan: [
              { id: 'd3_t1', time: '09:00', activity: '도치돌알파카', types: ['tour', 'experience'], price: 21000, duration: 120, state: 'confirmed', distance: 0, travelTimeOverride: '30분', receipt: { address: '애월읍 도치돌길 303', items: [{ name: '입장권', price: 7000, qty: 3, selected: true }] } },
              {
                id: 'd3_s1',
                time: '15:15',
                activity: '퀸 제누비아 2호',
                types: ['ship'],
                startPoint: '제주항',
                endPoint: '목포항',
                price: 260000,
                duration: 300,
                state: 'confirmed',
                distance: 25,
                isTimeFixed: true,
                receipt: {
                  address: '제주항',
                  shipDetails: { depart: '16:45', loading: '14:45 ~ 15:45' },
                  items: [{ name: '차량 선적', price: 160000, qty: 1, selected: true }, { name: '이코노미 인원권', price: 100000, qty: 1, selected: true }]
                },
                memo: '동승자 하차 후 차량 선적 (셔틀 이동) / 16:45 출항'
              }
            ]
          }
        ]
      };

      // 초기 로딩 시 한 번 전체 계산
      const calculatedDays = initialData.days.map(day => ({
        ...day,
        plan: recalculateSchedule(day.plan)
      }));

      setItinerary({ days: calculatedDays, places: [] });
      setLoading(false);
    })();
  }, [user]);

  if (authLoading) return (
    <div className="min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#3182F6]/20 border-t-[#3182F6] rounded-full animate-spin" />
      <div className="font-black text-slate-400 text-sm animate-pulse">본인 인증 확인 중...</div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* 장식용 배경 */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="bg-white/80 backdrop-blur-2xl border border-white p-12 rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.06)] max-w-[480px] w-full text-center flex flex-col gap-8 z-10">
          <div className="flex flex-col gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-[#3182F6] to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 mb-2 transform hover:scale-110 transition-transform">
              <Navigation size={32} className="text-white fill-white/20" />
            </div>
            <h1 className="text-[32px] font-black tracking-tight text-slate-800 leading-tight">나만의 여행 계획<br /><span className="text-[#3182F6]">Anti Planer</span></h1>
            <p className="text-slate-500 font-bold text-[15px] leading-relaxed">복잡한 여행 계획은 잊으세요.<br />당신에게 최적화된 동선을 만들어 드립니다.</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogin}
              className="group relative flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-[#3182F6] hover:bg-blue-50/50 px-8 py-4.5 rounded-[24px] transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-95"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
              <span className="text-[17px] font-black text-slate-700 group-hover:text-[#3182F6]">Google 계정으로 시작하기</span>
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <button
              onClick={handleGuestMode}
              className="text-[13px] font-bold text-slate-400 hover:text-slate-600 transition-colors py-2"
            >
              로그인 없이 일단 둘러보기 (로컬 전용)
            </button>
          </div>

          <p className="text-[12px] font-bold text-slate-400 tracking-wide">로그인 시 개인별 맞춤 일정을 저장하고 불러올 수 있습니다.</p>
          {authError && (
            <div className="text-left text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2 whitespace-pre-wrap">
              {authError}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading || !itinerary) return (
    <div className="min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#3182F6]/20 border-t-[#3182F6] rounded-full animate-spin" />
      <div className="font-black text-slate-400 text-sm animate-pulse">일정을 불러오고 있습니다...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans flex overflow-x-hidden font-bold flex-row relative">
      {/* ── 장소 수정 모달 ── */}
      {editingPlaceId && editPlaceDraft && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => { setEditingPlaceId(null); setEditPlaceDraft(null); }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[440px] max-h-[85vh] overflow-y-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <p className="text-[12px] font-black text-slate-600">장소 수정</p>
              <button onClick={() => { setEditingPlaceId(null); setEditPlaceDraft(null); }} className="text-slate-300 hover:text-slate-500 p-1">✕</button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <OrderedTagPicker title="태그" value={editPlaceDraft.types || ['place']} onChange={(tags) => setEditPlaceDraft(d => ({ ...d, types: tags }))} />
              <input value={editPlaceDraft.name} onChange={(e) => setEditPlaceDraft(d => ({ ...d, name: e.target.value }))} placeholder="장소 이름" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-black text-slate-800 outline-none focus:border-[#3182F6]" />
              <input value={editPlaceDraft.address || ''} onChange={(e) => setEditPlaceDraft(d => ({ ...d, address: e.target.value }))} placeholder="주소" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-600 outline-none focus:border-[#3182F6]" />
              <input value={editPlaceDraft.memo || ''} onChange={(e) => setEditPlaceDraft(d => ({ ...d, memo: e.target.value }))} placeholder="메모" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none focus:border-[#3182F6]" />
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">메뉴 / 금액</p>
                {(editPlaceDraft.receipt?.items || []).map((m, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 mb-1.5">
                    <input value={m.name || ''} onChange={(e) => setEditPlaceDraft(d => { const items = [...(d.receipt?.items || [])]; items[idx] = { ...items[idx], name: e.target.value }; return { ...d, receipt: { ...(d.receipt || {}), items } }; })} placeholder="메뉴명" className="flex-1 min-w-0 text-[11px] font-bold bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-[#3182F6]" />
                    <input type="number" value={m.price || 0} onChange={(e) => setEditPlaceDraft(d => { const items = [...(d.receipt?.items || [])]; items[idx] = { ...items[idx], price: Number(e.target.value) || 0 }; return { ...d, receipt: { ...(d.receipt || {}), items } }; })} placeholder="가격" className="w-20 text-[11px] font-bold bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-[#3182F6] [appearance:textfield]" />
                    <input type="number" value={getMenuQty(m)} onChange={(e) => setEditPlaceDraft(d => { const items = [...(d.receipt?.items || [])]; items[idx] = { ...items[idx], qty: Math.max(1, Number(e.target.value) || 1) }; return { ...d, receipt: { ...(d.receipt || {}), items } }; })} placeholder="수량" className="w-12 text-[11px] font-bold bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-[#3182F6] [appearance:textfield]" />
                    <button type="button" onClick={() => setEditPlaceDraft(d => { const items = [...(d.receipt?.items || [])]; items.splice(idx, 1); return { ...d, receipt: { ...(d.receipt || {}), items } }; })} className="text-slate-300 hover:text-red-500 px-1">✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => setEditPlaceDraft(d => ({ ...d, receipt: { ...(d.receipt || {}), items: [...(d.receipt?.items || []), { name: '', price: 0, qty: 1, selected: true }] } }))} className="w-full py-1.5 border border-dashed border-slate-300 rounded text-[11px] font-bold text-slate-400 hover:text-[#3182F6] hover:bg-white mt-1">+ 메뉴 추가</button>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <button type="button" onClick={() => setEditPlaceDraft(d => ({ ...d, showBusinessEditor: !d.showBusinessEditor }))} className="w-full flex items-center justify-between text-left mb-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">영업 정보</span>
                  {!editPlaceDraft.showBusinessEditor && <span className="text-[10px] font-bold text-slate-500 truncate ml-2">{formatBusinessSummary(editPlaceDraft.business)}</span>}
                </button>
                {editPlaceDraft.showBusinessEditor && (
                  <div className="mt-2"
                    onPaste={(e) => {
                      const text = e.clipboardData.getData('text');
                      const parsed = parseBusinessHoursText(text);
                      if (parsed.open || parsed.close || parsed.breakStart || parsed.breakEnd || parsed.lastOrder) {
                        e.preventDefault();
                        setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), ...parsed } }));
                      }
                    }}
                  >
                    <textarea
                      rows={3}
                      placeholder={'10:30 - 22:00\n15:00 - 17:00 브레이크타임\n21:00 라스트오더'}
                      className="w-full mb-1.5 text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-[#3182F6] text-slate-600 placeholder:text-slate-300 resize-none"
                      onBlur={(e) => {
                        const parsed = parseBusinessHoursText(e.target.value);
                        if (parsed.open || parsed.close || parsed.breakStart || parsed.breakEnd || parsed.lastOrder) {
                          setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), ...parsed } }));
                        }
                      }}
                    />
                    <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                      <TimeInput value={editPlaceDraft.business?.open || ''} onChange={(v) => setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), open: v } }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]" title="운영 시작" />
                      <TimeInput value={editPlaceDraft.business?.close || ''} onChange={(v) => setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), close: v } }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]" title="운영 종료" />
                      <TimeInput value={editPlaceDraft.business?.breakStart || ''} onChange={(v) => setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), breakStart: v } }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]" title="브레이크 시작" />
                      <TimeInput value={editPlaceDraft.business?.breakEnd || ''} onChange={(v) => setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), breakEnd: v } }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]" title="브레이크 종료" />
                      <TimeInput value={editPlaceDraft.business?.lastOrder || ''} onChange={(v) => setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), lastOrder: v } }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6] col-span-2" title="라스트오더" />
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {WEEKDAY_OPTIONS.map(w => { const active = (editPlaceDraft.business?.closedDays || []).includes(w.value); return (<button key={w.value} type="button" onClick={() => setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), closedDays: active ? normalizeBusiness(d.business).closedDays.filter(v => v !== w.value) : [...normalizeBusiness(d.business).closedDays, w.value] } }))} className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${active ? 'text-red-500 bg-red-50 border-red-200' : 'text-slate-400 bg-white border-slate-200'}`}>{w.label} 휴무</button>); })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-4 pb-4 flex gap-2 sticky bottom-0 bg-white pt-2 border-t border-slate-100">
              <button onClick={() => { const receipt = deepClone(editPlaceDraft.receipt || { address: editPlaceDraft.address || '', items: [] }); if (!Array.isArray(receipt.items)) receipt.items = []; receipt.address = editPlaceDraft.address || receipt.address || ''; const price = receipt.items.reduce((sum, m) => sum + (m.selected === false ? 0 : getMenuLineTotal(m)), 0); updatePlace(editPlaceDraft.id, { ...editPlaceDraft, business: normalizeBusiness(editPlaceDraft.business || {}), receipt, price }); setEditingPlaceId(null); setEditPlaceDraft(null); }} className="flex-1 py-2 bg-[#3182F6] text-white text-[12px] font-black rounded-xl">저장</button>
              <button onClick={() => { setEditingPlaceId(null); setEditPlaceDraft(null); }} className="flex-1 py-2 bg-slate-100 text-slate-500 text-[12px] font-black rounded-xl">취소</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Col1 테두리 탭 (오른쪽 경계) ── */}
      <div
        className="fixed z-[141] top-1/2 transition-all duration-300"
        style={{ left: col1Collapsed ? 44 : 260, transform: 'translateX(-50%) translateY(-50%)' }}
      >
        <button
          onClick={() => setCol1Collapsed(v => !v)}
          className="w-5 h-10 bg-white border border-[#E5E8EB] rounded-full flex items-center justify-center shadow-sm hover:border-[#3182F6] hover:text-[#3182F6] text-slate-400 transition-colors"
        >
          {col1Collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </div>
      {/* ── Col2 Toggle (Floating) ── */}
      <div
        className="fixed z-[150] top-1/2 transition-all duration-300 pointer-events-none"
        style={{ right: col2Collapsed ? 44 : 310, transform: 'translateX(50%) translateY(-50%)' }}
      >
        <button
          onClick={() => setCol2Collapsed(v => !v)}
          className="w-5 h-10 bg-white border border-[#E5E8EB] rounded-full flex items-center justify-center shadow-lg hover:border-[#3182F6] hover:text-[#3182F6] text-slate-400 transition-all hover:scale-110 active:scale-95 group pointer-events-auto"
          title={col2Collapsed ? "내 장소 열기" : "내 장소 접기"}
        >
          {col2Collapsed ? <ChevronLeft size={11} className="group-hover:-translate-x-0.5 transition-transform" /> : <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />}
        </button>
      </div>

      {/* ── Col1: 예산 + 일정 네비게이션 ── */}
      <div
        className="flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-[#E5E8EB] z-[140] shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 overflow-hidden"
        style={{ width: col1Collapsed ? 44 : 260 }}
      >
        {col1Collapsed ? (
          <div className="flex-1 flex items-center justify-center">
            <MapIcon size={14} className="text-slate-300" />
          </div>
        ) : (
          <>
            {/* ── 고정 헤더 ── */}
            <div className="px-5 pt-5 pb-3 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2.5 mb-3">
                <button
                  onClick={() => { setCurrentTripId(null); localStorage.removeItem('current_trip_id'); }}
                  className="w-7 h-7 flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 rounded-lg transition-all"
                  title="나의 여행 목록으로"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="w-px h-4 bg-slate-200" />
                <h2 className="text-[14px] font-black text-slate-800 tracking-tight flex-1 truncate">{trips.find(t => t.id === currentTripId)?.title || '일정 안내'}</h2>
              </div>
              <button
                onClick={autoCalculateAllRoutes}
                disabled={isCalculatingAllRoutes}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#3182F6] text-[11px] font-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Navigation size={11} />
                {isCalculatingAllRoutes ? '탐색중...' : '전체경로'}
              </button>
            </div>
            {/* ── 스크롤 컨텐츠 ── */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-5 flex flex-col">
              <nav className="flex flex-col gap-6 relative -ml-2">
                {itinerary.days?.map((d, dNavIdx) => (
                  <div key={d.day} className="flex items-start gap-1.5 group">
                    <div
                      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-[15px] font-black shadow-sm transition-all duration-300 cursor-pointer ${activeDay === d.day ? 'bg-[#3182F6] text-white ring-4 ring-blue-50' : 'bg-white text-slate-400 border border-slate-200 group-hover:border-[#3182F6] group-hover:text-[#3182F6]'}`}
                      onClick={() => handleNavClick(d.day)}
                    >
                      {d.day}
                    </div>
                    <div className="flex flex-col pt-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[15px] tracking-tight transition-colors duration-300 whitespace-nowrap cursor-pointer ${activeDay === d.day ? 'text-[#3182F6] font-black' : 'text-slate-500 font-bold group-hover:text-slate-800'}`}
                          onClick={() => handleNavClick(d.day)}
                        >Day {d.day}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const items = (d.plan || []).filter(p => p.type !== 'backup' && (p.receipt?.address || p.activity));
                            if (items.length === 0) return;
                            const INVALID_ADDRS = ['주소 정보 없음', '주소 미정', '장소 미정'];
                            const validItems = items.filter(p => {
                              if (p.types?.includes('ship')) return false;
                              const addr = (p.receipt?.address || '').trim();
                              return addr && !INVALID_ADDRS.includes(addr);
                            });
                            if (validItems.length === 0) return;
                            const toSegment = (p) => {
                              const addr = (p.receipt?.address || p.activity).trim();
                              const name = encodeURIComponent(p.activity || addr);
                              const query = encodeURIComponent(addr);
                              return `-,-,${name},${query},TEXT`;
                            };
                            if (validItems.length === 1) { window.open(`https://map.naver.com/p/search/${encodeURIComponent(`${validItems[0].activity} ${validItems[0].receipt?.address || ''}`.trim())}`, '_blank', 'noopener,width=1280,height=900'); return; }
                            const start = toSegment(validItems[0]);
                            const end = toSegment(validItems[validItems.length - 1]);
                            const vias = validItems.slice(1, -1).slice(0, 3).map(toSegment);
                            const viaPath = vias.length > 0 ? vias.join('/') + '/' : '';
                            window.open(`https://map.naver.com/p/directions/${start}/${viaPath}${end}/-/car`, '_blank', 'noopener,width=1280,height=900');
                          }}
                          className="p-1 rounded-md border border-slate-200 text-slate-300 hover:text-[#3182F6] hover:border-[#3182F6] hover:bg-blue-50 transition-all"
                          title="네이버 지도에서 동선 보기"
                        >
                          <ExternalLink size={10} />
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-400 font-semibold whitespace-nowrap truncate max-w-[170px]">{d.plan?.filter(p => p.type !== 'backup').length || 0}개 일정 · {tripRegion || '지역 미설정'}</span>
                      {/* 일정 제목 목록 */}
                      <div className="flex flex-col gap-0.5 mt-2 -ml-[40px]">
                        {(d.plan || []).filter(p => p.type !== 'backup').map((p, pIdx, arr) => {
                          const isActive = activeItemId === p.id;
                          const nextP = arr[pIdx + 1];
                          const freeMin = nextP ? timeToMinutes(nextP.time) - (timeToMinutes(p.time) + (p.duration || 60)) : 0;
                          const isLongItem = (p.duration || 0) >= 120 && !p.types?.includes('lodge') && !p.types?.includes('ship');
                          return (
                            <div key={p.id}>
                              <button
                                onClick={() => handleNavClick(d.day, p.id)}
                                className={`w-full text-left flex items-center gap-1.5 px-0.5 py-0.5 rounded-lg transition-all ${isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                              >
                                <span className={`shrink-0 text-[10px] w-8 text-center tabular-nums leading-none ${isActive ? 'font-black text-[#3182F6]' : 'font-bold text-slate-400'}`}>{p.time || '--:--'}</span>
                                <div className={`shrink-0 scale-90 origin-left transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>{getCategoryBadge((p.types?.[0]) || p.type || 'place')}</div>
                                <span className={`text-[10px] truncate max-w-[100px] leading-none transition-all ${isActive ? 'font-black text-[#3182F6]' : 'font-bold text-slate-500'}`}>{p.activity}</span>
                                {!p.types?.includes('ship') && (() => {
                                  // 숙소 마지막 항목: overnight duration 계산
                                  const isLastLodge = p.types?.includes('lodge') && pIdx === arr.length - 1;
                                  let dispDur = p.duration;
                                  if (isLastLodge) {
                                    const nextDay = itinerary.days[dNavIdx + 1];
                                    const nextMain = (nextDay?.plan || []).filter(x => x.type !== 'backup');
                                    if (nextMain.length) {
                                      const nf = nextMain[0];
                                      const cin = timeToMinutes(p.time || '00:00');
                                      const cout = timeToMinutes(nf.time)
                                        - parseMinsLabel(nf.travelTimeOverride, DEFAULT_TRAVEL_MINS)
                                        - parseMinsLabel(nf.bufferTimeOverride, DEFAULT_BUFFER_MINS);
                                      dispDur = Math.max(30, (cout <= cin ? cout + 1440 : cout) - cin);
                                    }
                                  }
                                  if (!(dispDur > 0)) return null;
                                  return (
                                    <span className={`ml-auto shrink-0 text-[8px] font-black rounded px-1 py-px leading-none whitespace-nowrap ${dispDur >= 120 ? 'text-orange-400 bg-orange-50 border border-orange-200' : 'text-slate-300'}`}>
                                      {fmtDur(dispDur)}
                                    </span>
                                  );
                                })()}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* ── 하단 고정: 사용자 정보 & 로그아웃 버튼 ── */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 mt-auto">
              <div className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  {user.photoURL ? <img src={user.photoURL} alt="User" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center"><UserIcon size={12} className="text-slate-400" /></div>}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] font-black text-slate-700 truncate">{user.displayName || '사용자'}</span>
                </div>
                <button onClick={handleLogout} className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all" title="로그아웃">
                  <LogOut size={12} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div
        className="flex flex-col fixed top-0 bottom-0 bg-white/80 backdrop-blur-3xl border-l border-slate-100/60 z-[140] shadow-[-8px_0_32px_rgba(0,0,0,0.02)] transition-all duration-300 overflow-hidden"
        style={{ right: 0, width: col2Collapsed ? 44 : 310 }}
      >
        {col2Collapsed ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Package size={14} className="text-slate-300" />
          </div>
        ) : (
          <>
            {/* ── 고정 헤더 ── */}
            <div className="px-5 pt-6 pb-4 border-b border-slate-100/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Package size={14} className="text-[#3182F6]" />
                </div>
                <p className="text-[14px] font-black text-slate-800 tracking-tight flex-1">내 장소</p>
                {(() => {
                  const { refTime } = getActiveRefContext();
                  return refTime ? (
                    <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md tracking-wider shrink-0" title={`영업 경고 기준 시각`}>
                      {(() => {
                        const wdMap = { sun: '일', mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토' };
                        const { todayKey: tk } = getActiveRefContext();
                        const dayLabel = wdMap[tk] || '';
                        if (tripStartDate) {
                          const activeDayData2 = itinerary.days?.find(d => d.day === activeDay);
                          if (activeDayData2) {
                            const dt = new Date(tripStartDate);
                            dt.setDate(dt.getDate() + (activeDayData2.day - 1));
                            const mm = String(dt.getMonth() + 1).padStart(2, '0');
                            const dd = String(dt.getDate()).padStart(2, '0');
                            return `${mm}/${dd}(${dayLabel}) ${refTime}`;
                          }
                        }
                        return `(${dayLabel}) ${refTime}`;
                      })()}
                    </span>
                  ) : null;
                })()}
                <button
                  onClick={() => setIsAddingPlace(v => !v)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-[#3182F6] transition-colors shrink-0"
                >
                  <Plus size={11} />
                </button>
              </div>
            </div>

            {/* ── 스크롤 컨텐츠 ── */}
            <div
              className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-8 flex flex-col"
              data-library-dropzone="true"
              onDragOver={(e) => { if (draggingFromTimeline) e.preventDefault(); }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggingFromTimeline) {
                  if (draggingFromTimeline.altIdx !== undefined) {
                    dropAltOnLibrary(draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, draggingFromTimeline.altIdx);
                  } else {
                    const src = itinerary.days?.[draggingFromTimeline.dayIdx]?.plan?.[draggingFromTimeline.pIdx];
                    dropTimelineItemOnLibrary(draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, askPlanBMoveMode(src));
                  }
                  setDraggingFromTimeline(null);
                }
              }}
            >

              {/* 장소 추가 폼 */}
              {isAddingPlace && (
                <PlaceAddForm
                  newPlaceName={newPlaceName}
                  setNewPlaceName={setNewPlaceName}
                  newPlaceTypes={newPlaceTypes}
                  setNewPlaceTypes={setNewPlaceTypes}
                  regionHint={tripRegion}
                  onAdd={addPlace}
                  onCancel={() => setIsAddingPlace(false)}
                />
              )}

              {/* 장소 목록 */}
              {(() => {
                // 활성 일정의 시간 기준으로 영업 여부 판단
                const activeItem = activeItemId
                  ? itinerary.days?.flatMap(d => d.plan || []).find(p => p.id === activeItemId)
                  : null;
                const activeTimeMins = activeItem ? timeToMinutes(activeItem.time || '00:00') : null;
                const isOpenAt = (business) => {
                  if (activeTimeMins === null || !business?.open || !business?.close) return null;
                  const openMins = timeToMinutes(business.open);
                  const closeMins = timeToMinutes(business.close);
                  if (closeMins <= openMins) return activeTimeMins >= openMins || activeTimeMins < closeMins;
                  return activeTimeMins >= openMins && activeTimeMins < closeMins;
                };
                // 필터링 적용
                let visiblePlaces = activeTimeMins !== null
                  ? [...distanceSortedPlaces].sort((a, b) => {
                    const aO = isOpenAt(a.business), bO = isOpenAt(b.business);
                    if (aO && !bO) return -1;
                    if (!aO && bO) return 1;
                    return 0;
                  })
                  : distanceSortedPlaces;

                if (placeFilterTags.length > 0) {
                  visiblePlaces = visiblePlaces.filter(p => {
                    const pTags = p.types || [];
                    return placeFilterTags.every(ft => pTags.includes(ft));
                  });
                }
                return (
                  <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1 items-center min-h-0">
                    {/* 필터 및 정렬 상태 표시기 */}
                    <div className="w-full flex flex-col gap-1 mb-2">
                      <div className="flex flex-wrap gap-1 px-1">
                        {TAG_OPTIONS.filter(t => t.value !== 'place' && t.value !== 'new' && t.value !== 'revisit').map(t => {
                          const active = placeFilterTags.includes(t.value);
                          return (
                            <button
                              key={t.value}
                              onClick={() => setPlaceFilterTags(prev => active ? prev.filter(v => v !== t.value) : [...prev, t.value])}
                              className={`px-2 py-0.5 rounded-lg text-[9px] font-black border transition-all ${active ? 'bg-[#3182F6] text-white border-[#3182F6] shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                            >
                              {t.label}
                            </button>
                          );
                        })}
                        {placeFilterTags.length > 0 && (
                          <button
                            onClick={() => setPlaceFilterTags([])}
                            className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 transition-all"
                          >
                            초기화 ✕
                          </button>
                        )}
                      </div>

                      {basePlanRef?.id && (
                        <div
                          onClick={() => {
                            setBasePlanRef(null);
                            setLastAction("거리순 정렬을 해제하고 이름순으로 정렬했습니다.");
                          }}
                          className="w-full px-3 py-2 rounded-[14px] border border-blue-100 bg-blue-50/50 text-[11px] font-black text-[#3182F6] flex items-center gap-1.5 shadow-[0_2px_8px_-2px_rgba(49,130,246,0.08)] cursor-pointer hover:bg-blue-100 transition-colors mt-1"
                        >
                          <MapPin size={12} className="text-blue-400" />
                          <span className="truncate flex-1">기준 <span className="text-blue-700">{basePlanRef.name}</span> 거리순 정렬</span>
                          <span className="text-[9px] text-blue-300">✕</span>
                        </div>
                      )}
                    </div>
                    {visiblePlaces.length === 0 && !isAddingPlace && (
                      <p className="text-[10px] text-slate-400 text-center py-6 font-semibold leading-relaxed">
                        + 버튼으로 장소를 추가하고<br />타임라인으로 드래그하세요
                      </p>
                    )}
                    {visiblePlaces.map(place => {
                      const chips = place.types ? place.types.map(t => getCategoryBadge(t)) : [getCategoryBadge('place')];
                      const isEditing = editingPlaceId === place.id;
                      const isPlaceExpanded = expandedPlaceId === place.id;
                      const bizWarningNow = getBusinessWarningNow(place.business);
                      const openStatus = isOpenAt(place.business); // true=영업중, false=마감, null=정보없음
                      const baseDistance = placeDistanceMap[place.id];


                      return (
                        <div
                          key={place.id}
                          draggable
                          onDragStart={(e) => {
                            const copy = ctrlHeldRef.current;
                            setDraggingFromLibrary(place);
                            setIsDragCopy(copy);
                            e.dataTransfer.effectAllowed = copy ? 'copy' : 'move';
                          }}
                          onDragEnd={() => { setDraggingFromLibrary(null); setDropTarget(null); setDropOnItem(null); setIsDragCopy(false); }}
                          onDragOver={(e) => {
                            if (draggingFromTimeline) { e.preventDefault(); e.stopPropagation(); }
                          }}
                          onDrop={(e) => {
                            if (draggingFromTimeline) {
                              e.preventDefault(); e.stopPropagation();
                              if (draggingFromTimeline.altIdx !== undefined) {
                                dropAltOnLibrary(draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, draggingFromTimeline.altIdx);
                              } else {
                                const src = itinerary.days?.[draggingFromTimeline.dayIdx]?.plan?.[draggingFromTimeline.pIdx];
                                dropTimelineItemOnLibrary(draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, askPlanBMoveMode(src));
                              }
                              setDraggingFromTimeline(null);
                            }
                          }}
                          className={`relative w-full shrink-0 rounded-[20px] border bg-white cursor-grab active:cursor-grabbing select-none transition-all duration-300 group overflow-hidden hover:-translate-y-0.5
                    ${draggingFromLibrary?.id === place.id ? 'pointer-events-none opacity-50' : ''}
                    ${bizWarningNow ? 'border-orange-200 hover:shadow-[0_8px_24px_-4px_rgba(249,115,22,0.15)] ring-1 ring-orange-100' : openStatus === true ? 'border-[#3182F6]/30 shadow-[0_4px_16px_-4px_rgba(49,130,246,0.1)] hover:shadow-[0_8px_24px_-4px_rgba(49,130,246,0.15)] ring-1 ring-[#3182F6]/10' : 'border-slate-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] hover:border-slate-200'}`}
                        >
                          {/* 모바일용 상단 드래그 핸들 전용 영역 */}
                          <div
                            className="absolute top-0 left-0 right-0 h-14 z-50 touch-none flex items-start justify-center pt-2"
                            onTouchStart={(e) => {
                              const touch = e.touches[0];
                              const startX = touch.clientX;
                              const startY = touch.clientY;
                              touchStartPosRef.current = { x: startX, y: startY };
                              isDraggingActiveRef.current = false;

                              if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                              longPressTimerRef.current = setTimeout(() => {
                                if (window.navigator.vibrate) window.navigator.vibrate(20);
                                isDraggingActiveRef.current = true;
                                setDragCoord({ x: startX, y: startY });
                                setDraggingFromLibrary(place);
                                setIsDragCopy(false);
                                startAutoScroll();
                              }, 300);
                            }}
                            onTouchMove={(e) => {
                              const touch = e.touches[0];
                              const moveX = touch.clientX;
                              const moveY = touch.clientY;

                              if (!isDraggingActiveRef.current) {
                                const dist = Math.hypot(moveX - touchStartPosRef.current.x, moveY - touchStartPosRef.current.y);
                                if (dist > 10) {
                                  if (longPressTimerRef.current) {
                                    clearTimeout(longPressTimerRef.current);
                                    longPressTimerRef.current = null;
                                  }
                                }
                                return;
                              }

                              e.preventDefault();
                              const x = moveX;
                              const y = moveY;

                              if (dragGhostRef.current) {
                                dragGhostRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -120%)`;
                              }

                              lastTouchYRef.current = y;
                              const el = document.elementFromPoint(x, y);
                              const dropEl = el?.closest('[data-droptarget]');
                              const dropItemEl = el?.closest('[data-dropitem]');
                              if (dropEl) {
                                const [di, pi] = dropEl.dataset.droptarget.split('-').map(Number);
                                setDropTarget({ dayIdx: di, insertAfterPIdx: pi });
                                setDropOnItem(null);
                              } else if (dropItemEl) {
                                const [di, pi] = dropItemEl.dataset.dropitem.split('-').map(Number);
                                setDropTarget(null);
                                setDropOnItem({ dayIdx: di, pIdx: pi });
                              } else {
                                setDropTarget(null);
                                setDropOnItem(null);
                              }
                            }}
                            onTouchEnd={(e) => {
                              if (longPressTimerRef.current) {
                                clearTimeout(longPressTimerRef.current);
                                longPressTimerRef.current = null;
                              }
                              stopAutoScroll();
                              if (isDraggingActiveRef.current && draggingFromLibrary) {
                                const touch = e.changedTouches[0];
                                const el = document.elementFromPoint(touch.clientX, touch.clientY);
                                // ... existing drop logic is already using states, but we need to ensure the final states are correct
                                if (dropTarget) {
                                  addNewItem(dropTarget.dayIdx, dropTarget.insertAfterPIdx, draggingFromLibrary.types, draggingFromLibrary);
                                  if (!isDragCopy) removePlace(draggingFromLibrary.id);
                                } else if (dropOnItem) {
                                  addPlaceAsPlanB(dropOnItem.dayIdx, dropOnItem.pIdx, draggingFromLibrary);
                                  if (!isDragCopy) removePlace(draggingFromLibrary.id);
                                }
                              }
                              isDraggingActiveRef.current = false;
                              setDraggingFromLibrary(null); setDropTarget(null); setDropOnItem(null); setIsDragCopy(false);
                            }}
                          >
                            <div className="w-12 h-1 bg-slate-200 group-hover:bg-[#3182F6]/40 rounded-full transition-all" />
                          </div>
                          <div className="p-4 flex flex-col gap-2.5">
                            <div className="flex items-center gap-1.5 flex-wrap pr-12 cursor-pointer" onClick={(e) => { e.stopPropagation(); setEditingPlaceId(place.id); setEditPlaceDraft({ ...place, address: place.address || place.receipt?.address || '', business: normalizeBusiness(place.business || {}), receipt: deepClone(place.receipt || { address: place.address || '', items: [] }), showBusinessEditor: !!(place.business?.open || place.business?.close || place.business?.breakStart || place.business?.breakEnd || place.business?.lastOrder || place.business?.closedDays?.length) }); }}>
                              {chips}
                              {baseDistance != null && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200 bg-blue-50 text-blue-600">
                                  {baseDistance}km
                                </span>
                              )}
                            </div>
                            <span className="text-[22px] font-black text-slate-800 leading-tight break-words whitespace-normal">{place.name}</span>
                            {place.address && (
                              <div className="flex items-center gap-2 text-slate-500 bg-slate-50 w-full px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:border-[#3182F6]/50 hover:bg-blue-50/30 transition-all" onClick={(e) => { e.stopPropagation(); window.open(`https://map.naver.com/v5/search/${encodeURIComponent(`${place.name} ${place.address}`.trim())}`, '_blank', 'noopener,width=1280,height=900'); }}>
                                <MapPin size={11} className="text-[#3182F6] shrink-0" />
                                <span className="text-[10px] font-bold break-words whitespace-normal">{place.address}</span>
                              </div>
                            )}
                            <div
                              className={`w-full px-2.5 py-1 rounded-lg border text-[10px] font-bold break-words whitespace-normal cursor-pointer transition-all hover:shadow-sm ${bizWarningNow ? 'border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-100' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-[#3182F6]/40 hover:bg-blue-50/40 hover:text-[#3182F6]'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                const hasBiz = place.business?.open || place.business?.close || place.business?.breakStart || place.business?.breakEnd || place.business?.lastOrder || place.business?.closedDays?.length;
                                const bizDefaults = hasBiz ? normalizeBusiness(place.business || {}) : { ...DEFAULT_BUSINESS };
                                setEditingPlaceId(place.id);
                                setEditPlaceDraft({ ...place, address: place.address || place.receipt?.address || '', business: bizDefaults, receipt: deepClone(place.receipt || { address: place.address || '', items: [] }), showBusinessEditor: true });
                              }}
                            >
                              {bizWarningNow || formatBusinessSummary(place.business)}
                            </div>
                            {place.memo && (
                              <div className="w-full bg-slate-50/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-medium text-slate-600 break-words whitespace-normal">
                                {place.memo}
                              </div>
                            )}
                          </div>
                          {
                            isPlaceExpanded && (
                              <div className="px-3 py-2 border-t border-slate-100 bg-white">
                                <div className="space-y-1.5">
                                  {(place.receipt?.items || []).map((m, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-[10px]">
                                      <span className="text-slate-600 font-bold truncate">{m.name || '-'}</span>
                                      <span className="text-slate-400 font-bold">x{getMenuQty(m)}</span>
                                      <span className="text-[#3182F6] font-black">₩{getMenuLineTotal(m).toLocaleString()}</span>
                                    </div>
                                  ))}
                                  {(place.receipt?.items || []).length === 0 && (
                                    <p className="text-[10px] text-slate-400 font-semibold">등록된 메뉴가 없습니다.</p>
                                  )}
                                </div>
                              </div>
                            )
                          }
                          <div
                            className="px-3 py-2 border-t border-slate-100 flex items-center justify-between bg-white cursor-pointer hover:bg-slate-50/70"
                            onClick={(e) => { e.stopPropagation(); setExpandedPlaceId(prev => (prev === place.id ? null : place.id)); }}
                          >
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              Total <ChevronDown size={12} className={`transition-transform ${isPlaceExpanded ? 'rotate-180' : ''}`} />
                            </span>
                            <span className="text-[14px] font-black text-[#3182F6]">₩{Number(place.price || 0).toLocaleString()}</span>
                          </div>
                          {/* 호버 버튼: 지도 + 수정 + 삭제 */}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            {(place.address || place.name) && (
                              <button
                                onClick={(e) => { e.stopPropagation(); const q = `${place.name} ${place.address || ''}`.trim(); window.open(`https://map.naver.com/v5/search/${encodeURIComponent(q)}`, '_blank', 'noopener,width=1280,height=900'); }}
                                className="p-1.5 hover:text-[#3182F6] hover:bg-blue-50 text-slate-300 rounded-md transition-all"
                                title="네이버 지도로 보기"
                              ><MapPin size={11} /></button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPlaceId(place.id);
                                setEditPlaceDraft({
                                  ...place,
                                  address: place.address || place.receipt?.address || '',
                                  business: normalizeBusiness(place.business || {}),
                                  receipt: deepClone(place.receipt || { address: place.address || '', items: [] }),
                                  showBusinessEditor: !!(place.business?.open || place.business?.close || place.business?.breakStart || place.business?.breakEnd || place.business?.lastOrder || place.business?.closedDays?.length)
                                });
                              }}
                              className="p-1.5 hover:text-[#3182F6] hover:bg-blue-50 text-slate-300 rounded-md transition-all"
                            ><Pencil size={11} /></button>
                            <button
                              onClick={(e) => { e.stopPropagation(); removePlace(place.id); }}
                              className="p-1.5 hover:text-red-500 hover:bg-red-50 text-slate-300 rounded-md transition-all"
                            ><Trash2 size={11} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
            {/* ── 삭제 존 (타임라인에서 드래그 시 하단 표시) ── */}
            {draggingFromTimeline && (
              <div
                className={`shrink-0 mx-4 mb-4 h-14 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-all ${isDroppingOnDeleteZone ? 'border-red-400 bg-red-50 text-red-500' : 'border-slate-200 bg-slate-50 text-slate-400'}`}
                data-deletezone="true"
                onDragOver={(e) => { e.preventDefault(); setIsDroppingOnDeleteZone(true); }}
                onDragLeave={() => setIsDroppingOnDeleteZone(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDroppingOnDeleteZone(false);
                  if (draggingFromTimeline && draggingFromTimeline.altIdx === undefined) {
                    deletePlanItem(draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx);
                  }
                  setDraggingFromTimeline(null);
                }}
              >
                <Trash2 size={14} />
                <span className="text-[11px] font-black">{isDroppingOnDeleteZone ? '놓으면 삭제' : '여기로 드래그하면 삭제'}</span>
              </div>
            )}
          </>
        )
        }
      </div >

      <div className="flex-1 flex flex-col items-center w-full bg-white min-h-screen" style={{ marginLeft: col1Collapsed ? 44 : 260, marginRight: col2Collapsed ? 44 : 300 }}>
        {/* 일정 목록 */}
        <div className="w-full px-4 pt-8 pb-32">

          {/* ── 여행 헤더 카드 ── */}
          {(() => {
            const tripDays = (tripStartDate && tripEndDate)
              ? Math.max(1, Math.round((new Date(tripEndDate) - new Date(tripStartDate)) / 86400000) + 1)
              : (itinerary.days?.length || 0);
            const tripNights = Math.max(0, tripDays - 1);
            const usedPct = MAX_BUDGET > 0 ? Math.min(100, Math.round((budgetSummary.total / MAX_BUDGET) * 100)) : 0;
            return (
              <div className="mb-8 sticky top-0 z-[120]">
                {/* 컴팩트 스티키 바 (스크롤 시) */}
                {heroCollapsed && (
                  <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-[20px] px-5 py-3.5 flex items-center justify-between gap-4 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] mx-4 mt-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                        <MapPin size={12} className="text-[#3182F6]" />
                      </div>
                      <span className="text-[14px] font-black text-slate-800 truncate">{tripRegion || '여행지'}</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">남은 예산</p>
                        <p className="text-[15px] font-black text-[#3182F6] tabular-nums leading-none tracking-tight">₩{budgetSummary.remaining.toLocaleString()}</p>
                      </div>
                      <div className="w-px h-8 bg-slate-100" />
                      <div className="flex flex-col gap-1.5 items-end">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#3182F6] to-indigo-500 rounded-full" style={{ width: `${usedPct}%` }} />
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold tabular-nums tracking-wider">{usedPct}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 풀 카드 (최상단) */}
                {!heroCollapsed && (
                  <section className="mb-10 px-4 mt-6">
                    <div className="max-w-[560px] mx-auto rounded-[40px] relative overflow-hidden bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100/80">
                      {/* 🖼️ 배경 이미지 (절반 높이) */}
                      <div className="absolute top-0 left-0 w-full h-[52%] overflow-hidden pointer-events-none">
                        <img
                          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
                          className="w-full h-full object-cover opacity-90 scale-105"
                          alt="travel background"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white" />
                      </div>

                      <div className="relative z-10 p-8 sm:p-10 flex flex-col gap-10">
                        {/* 🌟 1. 타이틀 & 일정 */}
                        <div className="flex flex-col gap-5">
                          <input
                            value={tripRegion}
                            onChange={(e) => setTripRegion(e.target.value)}
                            placeholder="어디로 떠나시나요?"
                            className="bg-transparent border-none outline-none text-[36px] sm:text-[44px] font-extrabold text-white drop-shadow-md placeholder:text-white/50 w-full tracking-tight leading-none"
                          />
                          <div className="relative flex items-center gap-2">
                            <button
                              onClick={() => setShowDatePicker(v => !v)}
                              className="flex items-center gap-2.5 bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl transition-all group hover:bg-white/30"
                            >
                              <Calendar size={14} className="text-white group-hover:scale-110 transition-transform shrink-0" />
                              <div className="flex items-center gap-1.5 pt-0.5">
                                <span className="text-[12px] font-black text-white">
                                  {tripStartDate ? tripStartDate.replace(/-/g, '. ') : '시작일'}
                                </span>
                                <span className="text-white/50 text-[10px] font-black">~</span>
                                <span className="text-[12px] font-black text-white">
                                  {tripEndDate ? tripEndDate.replace(/-/g, '. ') : '종료일'}
                                </span>
                              </div>
                            </button>
                            <div className="px-4 py-2 bg-black/10 backdrop-blur-sm border border-white/10 rounded-2xl">
                              <span className="text-[12px] font-black text-white/90">
                                {tripDays > 0 ? `${tripNights}박 ${tripDays}일` : `${itinerary.days?.length || 0}일 일정`}
                              </span>
                            </div>

                            {showDatePicker && (
                              <>
                                <div className="fixed inset-0 z-[299]" onClick={() => setShowDatePicker(false)} />
                                <div className="absolute top-full left-0 z-[300] mt-3">
                                  <DateRangePicker
                                    startDate={tripStartDate} endDate={tripEndDate}
                                    onStartChange={setTripStartDate} onEndChange={setTripEndDate}
                                    onClose={() => setShowDatePicker(false)}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* 🌟 2. 예산 현황 요약 (연결된 셀 스타일) */}
                        <div className="flex flex-col gap-8">
                          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden flex flex-col pt-8 pb-7 px-8 items-center text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Total Remaining Budget</p>
                            <p className="text-[48px] font-black text-[#3182F6] leading-none tabular-nums tracking-tighter mb-8">
                              ₩{budgetSummary.remaining.toLocaleString()}
                            </p>

                            <div className="w-full flex items-stretch bg-white/50 rounded-2xl border border-white/20 overflow-hidden min-h-[72px]">
                              <div className="flex-1 p-4 flex flex-col items-center justify-center gap-1 border-r border-slate-100">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Spent</p>
                                <p className="text-[14px] font-black text-slate-700 tabular-nums">₩{budgetSummary.total.toLocaleString()}</p>
                              </div>
                              <div
                                className="flex-1 p-4 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#3182F6]/5 transition-all group"
                                onClick={() => setEditingBudget(true)}
                              >
                                <p className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                  Budget <Plus size={9} className="text-[#3182F6] opacity-0 group-hover:opacity-100" />
                                </p>
                                {editingBudget ? (
                                  <input
                                    type="number"
                                    defaultValue={MAX_BUDGET}
                                    autoFocus
                                    className="text-[14px] font-black text-[#3182F6] w-24 bg-transparent border-b border-blue-200 outline-none tabular-nums text-center"
                                    onBlur={(e) => { const val = Number(e.target.value); if (val > 0) setItinerary(prev => ({ ...prev, maxBudget: val })); setEditingBudget(false); }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setEditingBudget(false); }}
                                  />
                                ) : (
                                  <p className="text-[14px] font-black text-slate-400 tabular-nums">₩{MAX_BUDGET.toLocaleString()}</p>
                                )}
                              </div>
                            </div>

                            <div className="w-full flex items-center gap-3 mt-8">
                              <div className="flex-1 h-3 bg-slate-100/50 rounded-full overflow-hidden flex items-center shadow-inner">
                                <div className="h-full bg-gradient-to-r from-[#3182F6] via-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(49,130,246,0.3)]" style={{ width: `${usedPct}%` }} />
                              </div>
                              <span className="text-[11px] font-black text-[#3182F6] tabular-nums whitespace-nowrap">{usedPct}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            );
          })()}
          {/* sentinel: 이 지점이 뷰포트 밖으로 나가면 heroCollapsed = true */}
          <div ref={heroSentinelRef} className="h-px -mt-1" />

          <div className="w-full max-w-[560px] mx-auto flex flex-col gap-6 relative z-0">

            {itinerary.days?.map((d, dIdx) => d.plan?.map((p, pIdx) => {
              const isExpanded = expandedId === p.id;
              let stateStyles;
              if (p.types?.includes('lodge')) stateStyles = 'bg-slate-50 border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]';
              else if (p.types?.includes('ship')) stateStyles = 'bg-[#f4fafe] border-blue-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]';
              else if (p.isTimeFixed) stateStyles = 'bg-white border-[#3182F6]/30 shadow-[0_8px_30px_-4px_rgba(49,130,246,0.08)] ring-1 ring-[#3182F6]/10';
              else stateStyles = 'bg-white border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] hover:border-slate-200';

              const chips = p.types ? p.types.map(t => getCategoryBadge(t)) : (p.type ? [getCategoryBadge(p.type)] : []);
              const isNextFixed = (pIdx < d.plan.length - 1) && d.plan[pIdx + 1]?.isTimeFixed;
              const isLodge = p.types?.includes('lodge');
              const isShip = p.types?.includes('ship');
              const businessWarning = !isShip ? getBusinessWarning(p, dIdx) : '';
              const planBCount = p.alternatives?.length || 0;
              const hasPlanB = planBCount > 0;
              // 스마트 락(숙소 자동 계산) 여부 확인
              const isAutoLocked = p.isAutoDuration;
              // Plan B 캐러셀 — 즉시 교체
              const planPos = viewingPlanIdx[p.id] ?? 0; // 0-based 위치 표시용
              const totalPlans = planBCount + 1;
              const cyclePlan = (dir) => {
                rotatePlan(dIdx, pIdx, dir);
                setViewingPlanIdx(prev => {
                  const cur = prev[p.id] ?? 0;
                  const next = ((cur + dir) % totalPlans + totalPlans) % totalPlans;
                  return { ...prev, [p.id]: next };
                });
              };

              return (
                <div
                  key={p.id}
                  id={pIdx === 0 ? `day-marker-${d.day}` : p.id}
                  className={`relative group transition-all duration-300 ${highlightedItemId === p.id ? 'scale-[1.02]' : ''}`}
                >
                  {d.day > 1 && pIdx === 0 && (
                    <div className="flex items-center justify-center pb-6 w-full">
                      <div className="flex items-center bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm gap-2">
                        {/* 이동 시간 */}
                        <div className="flex items-center gap-1.5">
                          <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx, -TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Minus size={10} /></button>
                          <span
                            className={`min-w-[3rem] text-center tracking-tight text-xs font-black ${p.travelTimeAuto && p.travelTimeOverride !== p.travelTimeAuto ? 'text-[#3182F6] cursor-pointer' : 'text-slate-800'}`}
                            onClick={(e) => { e.stopPropagation(); if (p.travelTimeAuto && p.travelTimeOverride !== p.travelTimeAuto) resetTravelTime(dIdx, pIdx); }}
                            title={p.travelTimeAuto && p.travelTimeOverride !== p.travelTimeAuto ? '클릭하여 경로 계산 시간으로 초기화' : undefined}
                          >{p.travelTimeOverride || '15분'}</span>
                          <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx, TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Plus size={10} /></button>
                        </div>
                        {/* 거리 */}
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                          <MapIcon size={11} /><span>{formatDistanceText(p.distance)}</span>
                        </div>
                        {/* 자동경로 */}
                        {(() => {
                          const rid = `${dIdx}_${pIdx}`; const busy = calculatingRouteId === rid; return (
                            <button onClick={(e) => { e.stopPropagation(); autoCalculateRouteFor(dIdx, pIdx); }} disabled={!!calculatingRouteId} className={`flex items-center gap-1 transition-colors border rounded-lg px-2 py-1 text-[10px] font-black ${busy ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white hover:bg-[#3182F6] hover:text-white text-slate-400 border-slate-200 hover:border-[#3182F6]'}`}>
                              <Sparkles size={10} /> {busy ? '계산중' : '자동경로'}
                            </button>);
                        })()}
                        {/* 구분선 */}
                        <div className="w-px h-4 bg-slate-200 mx-0.5" />
                        {/* 여유 시간 */}
                        <div className="flex items-center gap-1.5">
                          <button onClick={(e) => { e.stopPropagation(); updateBufferTime(dIdx, pIdx, -BUFFER_STEP); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Minus size={10} /></button>
                          <span className="min-w-[3rem] text-center tracking-tight text-xs font-black text-slate-500">{p.bufferTimeOverride || '10분'}</span>
                          <button onClick={(e) => { e.stopPropagation(); updateBufferTime(dIdx, pIdx, BUFFER_STEP); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Plus size={10} /></button>
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Plan B 외부 ◀▶ 버튼 wrapper */}
                  <div className="relative">
                    {hasPlanB && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); cyclePlan(-1); }}
                          className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 bg-white border border-slate-200 rounded-xl shadow-md flex items-center justify-center text-slate-400 hover:text-[#3182F6] hover:border-[#3182F6] transition-all"
                        ><ChevronLeft size={14} /></button>
                        <button
                          onClick={(e) => { e.stopPropagation(); cyclePlan(1); }}
                          className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 bg-white border border-slate-200 rounded-xl shadow-md flex items-center justify-center text-slate-400 hover:text-[#3182F6] hover:border-[#3182F6] transition-all"
                        ><ChevronRight size={14} /></button>
                      </>
                    )}
                    <div
                      data-dropitem={`${dIdx}-${pIdx}`}
                      draggable={p.type !== 'backup'}
                      onDragStart={(e) => {
                        if (p.type === 'backup' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') { e.preventDefault(); return; }
                        setDraggingFromTimeline({ dayIdx: dIdx, pIdx, altIdx: planPos > 0 ? planPos - 1 : undefined });
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragEnd={() => setDraggingFromTimeline(null)}
                      onDragOver={(e) => {
                        if (draggingFromLibrary && p.type !== 'backup') {
                          e.preventDefault(); e.stopPropagation();
                          setDropOnItem({ dayIdx: dIdx, pIdx });
                        }
                      }}
                      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropOnItem(null); }}
                      onDrop={(e) => {
                        if (draggingFromLibrary && dropOnItem?.dayIdx === dIdx && dropOnItem?.pIdx === pIdx) {
                          e.preventDefault(); e.stopPropagation();
                          addPlaceAsPlanB(dIdx, pIdx, draggingFromLibrary);
                          if (!isDragCopy) removePlace(draggingFromLibrary.id);
                          setDraggingFromLibrary(null); setDropOnItem(null); setIsDragCopy(false);
                        }
                      }}
                      className={`relative w-full flex flex-col border rounded-[24px] transition-all overflow-hidden cursor-grab active:cursor-grabbing group ${draggingFromTimeline?.dayIdx === dIdx && draggingFromTimeline?.pIdx === pIdx ? 'opacity-50 pointer-events-none scale-[0.99]' : ''} ${dropOnItem?.dayIdx === dIdx && dropOnItem?.pIdx === pIdx ? 'ring-2 ring-[#3182F6] ring-offset-2 ring-offset-[#F2F4F6]' : ''} ${hasPlanB ? 'ring-1 ring-amber-100' : ''} ${stateStyles}`}
                      onClick={() => toggleReceipt(p.id)}
                    >
                      {/* 모바일용 상단 드래그 핸들 전용 영역 */}
                      <div
                        className="absolute top-0 left-0 right-0 h-14 z-50 touch-none flex items-start justify-center pt-2"
                        onTouchStart={(e) => {
                          if (p.type === 'backup' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
                          const touch = e.touches[0];
                          const startX = touch.clientX;
                          const startY = touch.clientY;
                          touchStartPosRef.current = { x: startX, y: startY };
                          isDraggingActiveRef.current = false;

                          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                          longPressTimerRef.current = setTimeout(() => {
                            if (window.navigator.vibrate) window.navigator.vibrate(20);
                            isDraggingActiveRef.current = true;
                            setDragCoord({ x: startX, y: startY });
                            setDraggingFromTimeline({ dayIdx: dIdx, pIdx, altIdx: planPos > 0 ? planPos - 1 : undefined });
                            startAutoScroll();
                          }, 300);
                        }}
                        onTouchMove={(e) => {
                          const touch = e.touches[0];
                          const moveX = touch.clientX;
                          const moveY = touch.clientY;

                          if (!isDraggingActiveRef.current) {
                            const dist = Math.hypot(moveX - touchStartPosRef.current.x, moveY - touchStartPosRef.current.y);
                            if (dist > 10) {
                              if (longPressTimerRef.current) {
                                clearTimeout(longPressTimerRef.current);
                                longPressTimerRef.current = null;
                              }
                            }
                            return;
                          }

                          e.preventDefault();
                          const x = moveX;
                          const y = moveY;

                          if (dragGhostRef.current) {
                            dragGhostRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -120%)`;
                          }

                          lastTouchYRef.current = y;
                          const el = document.elementFromPoint(x, y);
                          setIsDroppingOnDeleteZone(false);
                          const isDel = !!el?.closest('[data-deletezone]');
                          const isLib = !!el?.closest('[data-library-dropzone]');
                          const dropEl = el?.closest('[data-droptarget]');

                          if (isDel) setIsDroppingOnDeleteZone(true);
                          if (dropEl) {
                            const [di, pi] = dropEl.dataset.droptarget.split('-').map(Number);
                            setDropTarget({ dayIdx: di, insertAfterPIdx: pi });
                          } else {
                            setDropTarget(null);
                          }
                        }}
                        onTouchEnd={(e) => {
                          if (longPressTimerRef.current) {
                            clearTimeout(longPressTimerRef.current);
                            longPressTimerRef.current = null;
                          }
                          stopAutoScroll();
                          if (isDraggingActiveRef.current && draggingFromTimeline) {
                            const touch = e.changedTouches[0];
                            const el = document.elementFromPoint(touch.clientX, touch.clientY);
                            const isDel = !!el?.closest('[data-deletezone]');
                            const isLib = !!el?.closest('[data-library-dropzone]');
                            const dropEl = el?.closest('[data-droptarget]');

                            if (isDel) {
                              if (draggingFromTimeline.altIdx === undefined) {
                                deletePlanItem(draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx);
                              }
                            } else if (isLib) {
                              if (draggingFromTimeline.altIdx !== undefined) {
                                dropAltOnLibrary(draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, draggingFromTimeline.altIdx);
                              } else {
                                const src = itinerary.days?.[draggingFromTimeline.dayIdx]?.plan?.[draggingFromTimeline.pIdx];
                                dropTimelineItemOnLibrary(draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, askPlanBMoveMode(src));
                              }
                            } else if (dropEl) {
                              const [di, pi] = dropEl.dataset.droptarget.split('-').map(Number);
                              if (draggingFromTimeline.altIdx !== undefined) {
                                insertAlternativeToTimeline(di, pi, draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, draggingFromTimeline.altIdx);
                              } else {
                                movePlanItem(draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, di, pi);
                              }
                            }
                          }
                          isDraggingActiveRef.current = false;
                          setDraggingFromTimeline(null); setDropTarget(null); setDropOnItem(null); setIsDroppingOnDeleteZone(false);
                        }}
                      >
                        <div className="w-12 h-1 bg-slate-200 group-hover:bg-[#3182F6]/40 rounded-full transition-all" />
                      </div>
                      {/* Plan B 페이지 인디케이터 */}
                      {hasPlanB && (
                        <div className="absolute top-2.5 right-11 z-20 pointer-events-none">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md border min-w-[32px] text-center text-slate-400 bg-white border-slate-200">
                            {planPos + 1}/{totalPlans}
                          </span>
                        </div>
                      )}
                      <div className="flex items-stretch border-b border-slate-100 border-dashed">

                        {/* 🟢 좌측 컨트롤 타워 */}
                        {!isShip && !isLodge && <div className={`relative flex flex-col items-center justify-center gap-2 w-[110px] sm:w-[9rem] shrink-0 ${p.isTimeFixed ? 'bg-blue-50/20' : 'bg-transparent'} border-r border-slate-100 flex-none py-4 px-2 sm:px-3 overflow-hidden transition-all duration-300`}>
                          {/* 락 상태일 때 컨트롤 타워 전체에 은은하게 깔리는 거대 자물쇠 */}
                          {p.isTimeFixed && (
                            <Lock size={90} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 opacity-[0.035] pointer-events-none" />
                          )}

                          {/* 시간 조절 */}
                          <div
                            className={`relative w-full px-1 py-1 rounded-2xl cursor-pointer select-none z-10 transition-colors ${p.isTimeFixed ? 'hover:bg-blue-100/50' : 'hover:bg-slate-200/50'}`}
                            onClick={(e) => { e.stopPropagation(); toggleTimeFix(dIdx, pIdx); }}
                          >
                            <div className="relative flex items-center justify-center gap-1.5 z-10">
                              {(() => {
                                const [hourStr = '00', minuteStr = '00'] = (p.time || '00:00').split(':');
                                const hour = parseInt(hourStr, 10);
                                const minute = parseInt(minuteStr, 10);

                                const btnTone = p.isTimeFixed
                                  ? 'text-blue-400 hover:text-blue-600 hover:bg-blue-100/60'
                                  : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100';

                                return (
                                  <>
                                    <div className="flex flex-col items-center">
                                      <button onClick={(e) => { e.stopPropagation(); updateStartHour(dIdx, pIdx, 1); }} className={`w-6 h-4 flex items-center justify-center rounded-lg transition-colors ${btnTone}`}><ChevronUp size={11} /></button>
                                      <span className={`min-w-[2ch] text-[20px] sm:text-[22px] text-center font-black tracking-tighter leading-none py-0.5 transition-colors ${p.isTimeFixed ? 'text-[#3182F6]' : 'text-slate-800'}`}>{String(isNaN(hour) ? 0 : hour).padStart(2, '0')}</span>
                                      <button onClick={(e) => { e.stopPropagation(); updateStartHour(dIdx, pIdx, -1); }} className={`w-6 h-4 flex items-center justify-center rounded-lg transition-colors ${btnTone}`}><ChevronDown size={11} /></button>
                                    </div>
                                    <span className={`text-[18px] sm:text-[20px] font-black ${p.isTimeFixed ? 'text-[#3182F6]' : 'text-slate-700'}`}>:</span>
                                    <div className="flex flex-col items-center">
                                      <button onClick={(e) => { e.stopPropagation(); updateStartMinute(dIdx, pIdx, TIME_UNIT); }} className={`w-6 h-4 flex items-center justify-center rounded-lg transition-colors ${btnTone}`}><ChevronUp size={11} /></button>
                                      <span className={`min-w-[2ch] text-[20px] sm:text-[22px] text-center font-black tracking-tighter leading-none py-0.5 transition-colors ${p.isTimeFixed ? 'text-[#3182F6]' : 'text-slate-800'}`}>{String(isNaN(minute) ? 0 : minute).padStart(2, '0')}</span>
                                      <button onClick={(e) => { e.stopPropagation(); updateStartMinute(dIdx, pIdx, -TIME_UNIT); }} className={`w-6 h-4 flex items-center justify-center rounded-lg transition-colors ${btnTone}`}><ChevronDown size={11} /></button>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>

                          {/* ✅ 소요 시간 조절 */}
                          {(
                            <div className={`flex items-center justify-between w-[90%] bg-white px-2 py-1.5 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border my-1 transition-colors ${isNextFixed || isAutoLocked ? 'border-orange-200/60' : 'border-slate-100/60'}`} onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => updateDuration(dIdx, pIdx, -TIME_UNIT)} className={`w-4 sm:w-5 h-5 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors shrink-0 ${isNextFixed || isAutoLocked ? 'text-orange-300' : 'text-slate-400 hover:text-blue-500'}`}><Minus size={10} /></button>
                              <span
                                className={`text-[12px] whitespace-nowrap font-extrabold tabular-nums cursor-pointer hover:underline ${isNextFixed || isAutoLocked ? 'text-orange-500' : 'text-slate-600 hover:text-blue-600'}`}
                                onClick={() => resetDuration(dIdx, pIdx)}
                                title={isNextFixed || isAutoLocked ? "다음 일정에 맞춰 자동으로 계산된 시간입니다" : "60분으로 초기화"}
                              >{fmtDur(p.duration)}</span>
                              <button onClick={() => updateDuration(dIdx, pIdx, TIME_UNIT)} className={`w-4 sm:w-5 h-5 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors shrink-0 ${isNextFixed || isAutoLocked ? 'text-orange-300 hover:text-orange-500' : 'text-slate-400 hover:text-blue-500'}`}><Plus size={10} /></button>
                            </div>
                          )}

                        </div>}

                        {/* 🟢 우측 정보 영역 */}
                        <div className="flex-1 min-w-0 flex flex-col justify-start p-3 sm:p-4 gap-2">
                          {isShip ? (
                            <div className="flex flex-col gap-2 py-0.5" onClick={(e) => e.stopPropagation()}>
                              {/* 페리 이름 */}
                              <div className="flex items-center gap-1.5">
                                <Anchor size={11} className="text-blue-400 shrink-0" />
                                <input
                                  value={p.activity}
                                  onChange={(e) => updateActivityName(dIdx, pIdx, e.target.value)}
                                  onFocus={(e) => e.target.select()}
                                  className="flex-1 min-w-0 bg-transparent text-[15px] font-black text-blue-900 leading-tight focus:outline-none truncate"
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="페리 이름"
                                />
                              </div>
                              {/* 루트 배너 */}
                              <div className="flex items-center bg-gradient-to-r from-blue-700 to-cyan-600 rounded-xl px-3 py-2 gap-2">
                                <div className="flex flex-col items-start min-w-0">
                                  <span className="text-[8px] text-blue-200 font-bold tracking-widest uppercase">Departure</span>
                                  <input
                                    value={p.startPoint || '목포항'}
                                    onChange={(e) => { e.stopPropagation(); updateShipPoint(dIdx, pIdx, 'startPoint', e.target.value); }}
                                    onClick={(e) => e.stopPropagation()}
                                    onFocus={(e) => e.target.select()}
                                    className="text-[14px] font-black text-white bg-transparent outline-none w-16 focus:border-b focus:border-white/50"
                                  />
                                  <input
                                    value={p.receipt?.address || ''}
                                    onChange={(e) => { e.stopPropagation(); setItinerary(prev => { const d = JSON.parse(JSON.stringify(prev)); d.days[dIdx].plan[pIdx].receipt = { ...d.days[dIdx].plan[pIdx].receipt, address: e.target.value }; return d; }); }}
                                    onClick={(e) => e.stopPropagation()}
                                    onFocus={async (e) => { e.target.select(); if (p.startPoint) { const r = await searchAddressFromPlaceName(p.startPoint); if (r?.address) setItinerary(prev => { const d = JSON.parse(JSON.stringify(prev)); d.days[dIdx].plan[pIdx].receipt = { ...d.days[dIdx].plan[pIdx].receipt, address: r.address }; return d; }); } }}
                                    placeholder="클릭 시 자동 입력"
                                    className="text-[9px] text-blue-200/80 bg-transparent outline-none w-24 focus:border-b focus:border-white/30 truncate cursor-pointer"
                                  />
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-0.5">
                                  <div className="w-full border-t border-dashed border-white/30" />
                                  <span className="text-[9px] text-white/60 font-bold">
                                    {(() => { const s = p.sailDuration ?? 240; return `${Math.floor(s / 60)}h${s % 60 > 0 ? ` ${s % 60}m` : ''}`; })()}
                                  </span>
                                </div>
                                <div className="flex flex-col items-end min-w-0">
                                  <span className="text-[8px] text-blue-200 font-bold tracking-widest uppercase">Arrival</span>
                                  <input
                                    value={p.endPoint || '제주항'}
                                    onChange={(e) => { e.stopPropagation(); updateShipPoint(dIdx, pIdx, 'endPoint', e.target.value); }}
                                    onClick={(e) => e.stopPropagation()}
                                    onFocus={(e) => e.target.select()}
                                    className="text-[14px] font-black text-white bg-transparent outline-none w-16 text-right focus:border-b focus:border-white/50"
                                  />
                                  <input
                                    value={p.endAddress || ''}
                                    onChange={(e) => { e.stopPropagation(); updateShipPoint(dIdx, pIdx, 'endAddress', e.target.value); }}
                                    onClick={(e) => e.stopPropagation()}
                                    onFocus={async (e) => { e.target.select(); if (p.endPoint) { const r = await searchAddressFromPlaceName(p.endPoint); if (r?.address) updateShipPoint(dIdx, pIdx, 'endAddress', r.address); } }}
                                    placeholder="클릭 시 자동 입력"
                                    className="text-[9px] text-blue-200/80 bg-transparent outline-none w-24 text-right focus:border-b focus:border-white/30 truncate cursor-pointer"
                                  />
                                </div>
                              </div>
                              {/* 시간 정보 행 — 드래그로 조절 */}
                              {(() => {
                                const loadMins = timeToMinutes(p.time || '00:00');
                                const boardMins = timeToMinutes(p.boardTime || minutesToTime(loadMins + 60));
                                const sailDur = p.sailDuration ?? 240;
                                const disTime = minutesToTime(boardMins + sailDur);
                                const editKey = (field) => ferryEditField?.pId === p.id && ferryEditField?.field === field;
                                const makeDrag = (onDelta, step = TIME_UNIT) => (e) => {
                                  e.stopPropagation();
                                  const el = e.currentTarget;
                                  el.setPointerCapture(e.pointerId);
                                  const startY = e.clientY; let last = 0; let dragging = false;
                                  const move = (ev) => {
                                    if (!dragging && Math.abs(ev.clientY - startY) > 6) dragging = true;
                                    if (dragging) { const s = Math.round((startY - ev.clientY) / 6); if (s !== last) { onDelta((s - last) * step); last = s; } }
                                  };
                                  el.addEventListener('pointermove', move);
                                  el.addEventListener('pointerup', () => {
                                    el.removeEventListener('pointermove', move);
                                    if (dragging) el.addEventListener('click', (ev) => { ev.stopPropagation(); ev.preventDefault(); }, { once: true, capture: true });
                                  }, { once: true });
                                };
                                const timeInput = (field, displayVal, onDelta, step) => editKey(field)
                                  ? <input
                                    autoFocus
                                    defaultValue={displayVal.replace(':', '')}
                                    onFocus={(e) => e.target.select()}
                                    className="w-14 text-center text-[13px] font-black text-blue-800 bg-white border-b-2 border-[#3182F6] outline-none tabular-nums rounded"
                                    onBlur={(e) => commitFerryTime(dIdx, pIdx, field, e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setFerryEditField(null); }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  : <span
                                    className="text-[13px] font-black text-blue-800 tabular-nums cursor-pointer"
                                    title="탭: 직접 입력 / 드래그: 조절"
                                    onPointerDown={makeDrag(onDelta, step)}
                                    onClick={(e) => { e.stopPropagation(); setFerryEditField({ pId: p.id, field }); }}
                                  >{displayVal}</span>;
                                const sailInput = editKey('sail')
                                  ? <input
                                    autoFocus
                                    defaultValue={sailDur}
                                    onFocus={(e) => e.target.select()}
                                    className="w-10 text-center text-[13px] font-black text-blue-800 bg-white border-b-2 border-[#3182F6] outline-none tabular-nums rounded"
                                    onBlur={(e) => commitFerryTime(dIdx, pIdx, 'sail', e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setFerryEditField(null); }}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="분"
                                  />
                                  : <span
                                    className="text-[13px] font-black text-blue-800 tabular-nums cursor-pointer"
                                    title="탭: 분 단위 입력 / 드래그: 조절"
                                    onPointerDown={makeDrag(d => updateFerrySailDuration(dIdx, pIdx, d), 30)}
                                    onClick={(e) => { e.stopPropagation(); setFerryEditField({ pId: p.id, field: 'sail' }); }}
                                  >{minutesToTime(sailDur)}</span>;
                                return (
                                  <div className="flex gap-2 select-none">
                                    {/* 선적 셀 */}
                                    <div className="flex-1 flex flex-col items-center gap-1 bg-blue-50/80 border border-blue-100 rounded-xl px-2 py-2.5">
                                      <span className="text-[8px] text-blue-400 font-black tracking-widest uppercase">선적</span>
                                      {timeInput('load', p.time || '00:00', d => updateStartTime(dIdx, pIdx, d))}
                                    </div>
                                    {/* 출항 셀 */}
                                    <div className="flex-1 flex flex-col items-center gap-1 bg-sky-50/80 border border-sky-100 rounded-xl px-2 py-2.5">
                                      <span className="text-[8px] text-sky-400 font-black tracking-widest uppercase">출항</span>
                                      {timeInput('depart', minutesToTime(boardMins), d => updateFerryBoardTime(dIdx, pIdx, d))}
                                    </div>
                                    {/* 소요 셀 */}
                                    <div className="flex-1 flex flex-col items-center gap-1 bg-indigo-50/80 border border-indigo-100 rounded-xl px-2 py-2.5">
                                      <span className="text-[8px] text-indigo-400 font-black tracking-widest uppercase">소요</span>
                                      {sailInput}
                                    </div>
                                    {/* 하선 셀 */}
                                    <div className="flex-1 flex flex-col items-center gap-1 bg-violet-50/80 border border-violet-100 rounded-xl px-2 py-2.5">
                                      <span className="text-[8px] text-violet-500 font-black tracking-widest uppercase">하선</span>
                                      {timeInput('disembark', disTime, d => updateFerrySailDuration(dIdx, pIdx, d), 30)}
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          ) : isLodge ? (
                            <div className="flex flex-col gap-2 py-0.5" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1.5">
                                <Bed size={11} className="text-indigo-400 shrink-0" />
                                <input
                                  value={p.activity}
                                  onChange={(e) => updateActivityName(dIdx, pIdx, e.target.value)}
                                  onFocus={(e) => e.target.select()}
                                  className="flex-1 min-w-0 bg-transparent text-[15px] font-black text-indigo-900 leading-tight focus:outline-none truncate"
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="숙소 이름"
                                />
                              </div>
                              <div className="flex items-center gap-2 text-slate-500 bg-white w-fit max-w-full px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
                                <MapPin size={12} className="text-[#3182F6] shrink-0" />
                                <span className="text-[11px] font-bold truncate">{p.receipt?.address || '주소 정보 없음'}</span>
                              </div>
                              <div className="flex gap-2">
                                {/* 체크인 셀 */}
                                <div className="flex-1 bg-indigo-50/70 rounded-xl border border-indigo-100 p-3 flex flex-col items-center gap-1">
                                  <span className="text-[9px] font-black tracking-widest text-indigo-400">체크인</span>
                                  <div className="flex items-center justify-center gap-1.5">
                                    {(() => {
                                      const [h = '00', m = '00'] = (p.time || '00:00').split(':');
                                      const hour = parseInt(h, 10);
                                      const minute = parseInt(m, 10);
                                      return (
                                        <>
                                          <div className="flex flex-col items-center">
                                            <button onClick={(e) => { e.stopPropagation(); updateStartHour(dIdx, pIdx, 1); }} className="w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors"><ChevronUp size={11} /></button>
                                            <span className="min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-indigo-900">{String(isNaN(hour) ? 0 : hour).padStart(2, '0')}</span>
                                            <button onClick={(e) => { e.stopPropagation(); updateStartHour(dIdx, pIdx, -1); }} className="w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors"><ChevronDown size={11} /></button>
                                          </div>
                                          <span className="text-[16px] font-black text-indigo-900">:</span>
                                          <div className="flex flex-col items-center">
                                            <button onClick={(e) => { e.stopPropagation(); updateStartMinute(dIdx, pIdx, TIME_UNIT); }} className="w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors"><ChevronUp size={11} /></button>
                                            <span className="min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-indigo-900">{String(isNaN(minute) ? 0 : minute).padStart(2, '0')}</span>
                                            <button onClick={(e) => { e.stopPropagation(); updateStartMinute(dIdx, pIdx, -TIME_UNIT); }} className="w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors"><ChevronDown size={11} /></button>
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                                {/* 체크아웃 셀 */}
                                <div className="flex-1 bg-violet-50/70 rounded-xl border border-violet-100 p-3 flex flex-col items-center gap-1">
                                  <span className="text-[9px] font-black tracking-widest text-violet-400">체크아웃</span>
                                  <div className="flex items-center justify-center gap-1.5">
                                    {(() => {
                                      const nextDay = itinerary.days[dIdx + 1];
                                      const nextItem = nextDay?.plan?.[0];
                                      const checkoutMins = nextItem && nextItem.type !== 'backup'
                                        ? timeToMinutes(nextItem.time) - parseMinsLabel(nextItem.travelTimeOverride, DEFAULT_TRAVEL_MINS) - parseMinsLabel(nextItem.bufferTimeOverride, DEFAULT_BUFFER_MINS)
                                        : timeToMinutes(p.time || '00:00') + (p.duration || 0);
                                      const [h = '00', m = '00'] = minutesToTime(checkoutMins).split(':');
                                      const hour = parseInt(h, 10);
                                      const minute = parseInt(m, 10);
                                      return (
                                        <>
                                          <div className="flex flex-col items-center">
                                            <button onClick={(e) => { e.stopPropagation(); if (nextItem && nextItem.type !== 'backup') updateBufferTime(dIdx + 1, 0, -60); }} className="w-6 h-4 flex items-center justify-center rounded-lg text-violet-300 hover:text-violet-500 hover:bg-violet-100/70 transition-colors"><ChevronUp size={11} /></button>
                                            <span className="min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-violet-900">{String(isNaN(hour) ? 0 : hour).padStart(2, '0')}</span>
                                            <button onClick={(e) => { e.stopPropagation(); if (nextItem && nextItem.type !== 'backup') updateBufferTime(dIdx + 1, 0, 60); }} className="w-6 h-4 flex items-center justify-center rounded-lg text-violet-300 hover:text-violet-500 hover:bg-violet-100/70 transition-colors"><ChevronDown size={11} /></button>
                                          </div>
                                          <span className="text-[16px] font-black text-violet-900">:</span>
                                          <div className="flex flex-col items-center">
                                            <button onClick={(e) => { e.stopPropagation(); if (nextItem && nextItem.type !== 'backup') updateBufferTime(dIdx + 1, 0, -TIME_UNIT); }} className="w-6 h-4 flex items-center justify-center rounded-lg text-violet-300 hover:text-violet-500 hover:bg-violet-100/70 transition-colors"><ChevronUp size={11} /></button>
                                            <span className="min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-violet-900">{String(isNaN(minute) ? 0 : minute).padStart(2, '0')}</span>
                                            <button onClick={(e) => { e.stopPropagation(); if (nextItem && nextItem.type !== 'backup') updateBufferTime(dIdx + 1, 0, TIME_UNIT); }} className="w-6 h-4 flex items-center justify-center rounded-lg text-violet-300 hover:text-violet-500 hover:bg-violet-100/70 transition-colors"><ChevronDown size={11} /></button>
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                              <input
                                value={p.memo || ''}
                                onChange={(e) => updateMemo(dIdx, pIdx, e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all"
                                placeholder="메모를 입력하세요..."
                              />
                            </div>
                          ) : (
                            <>
                              {/* 1행: 카테고리 칩 (클릭 → 태그 편집) + NEW + 재방문 */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <div
                                  className={`flex items-center gap-1 flex-wrap cursor-pointer rounded-lg px-1 py-0.5 -ml-1 transition-colors ${tagEditorTarget?.dayIdx === dIdx && tagEditorTarget?.pIdx === pIdx ? 'bg-blue-50 ring-1 ring-[#3182F6]/30' : 'hover:bg-slate-100/60'}`}
                                  title="클릭하여 태그 편집"
                                  onClick={(e) => { e.stopPropagation(); setTagEditorTarget(prev => prev?.dayIdx === dIdx && prev?.pIdx === pIdx ? null : { dayIdx: dIdx, pIdx }); }}
                                >
                                  {chips}
                                </div>
                              </div>

                              {tagEditorTarget?.dayIdx === dIdx && tagEditorTarget?.pIdx === pIdx && (
                                <div className="-mt-1 mb-0.5" onClick={(e) => e.stopPropagation()}>
                                  <OrderedTagPicker
                                    title="태그"
                                    value={p.types || ['place']}
                                    onChange={(tags) => updatePlanTags(dIdx, pIdx, tags)}
                                  />
                                </div>
                              )}

                              {/* 2행: 이름 (수정 가능한 Input) */}
                              <div className="w-full flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                  value={p.activity}
                                  onChange={(e) => updateActivityName(dIdx, pIdx, e.target.value)}
                                  onFocus={(e) => e.target.select()}
                                  onKeyDown={async (e) => {
                                    if (e.key === 'Enter' && p.activity.trim()) {
                                      e.preventDefault();
                                      setLastAction('주소 검색 중...');
                                      const result = await searchAddressFromPlaceName(p.activity, tripRegion);
                                      if (result?.address) { updateAddress(dIdx, pIdx, result.address); setLastAction(`주소 자동 입력: ${result.address}`); }
                                      else setLastAction('주소를 찾을 수 없습니다.');
                                    }
                                  }}
                                  className="flex-1 bg-transparent text-xl font-black text-slate-800 truncate leading-tight focus:outline-none focus:border-b focus:border-slate-300 transition-colors min-w-0"
                                  placeholder="일정 이름 입력 후 Enter"
                                />
                                <button
                                  onClick={(e) => { e.stopPropagation(); const q = [p.activity, p.receipt?.address].filter(Boolean).join(' '); window.open(`https://map.naver.com/v5/search/${encodeURIComponent(q)}`, '_blank', 'noopener,width=1280,height=900'); }}
                                  className="shrink-0 p-1.5 rounded-lg border border-slate-200 hover:border-[#3182F6] hover:bg-blue-50 text-slate-300 hover:text-[#3182F6] transition-all"
                                  title="네이버 지도에서 검색"
                                >
                                  <MapPin size={13} />
                                </button>
                              </div>

                              {/* 3행: 주소 박스 (수정 + 자동검색) */}
                              {(() => {
                                let isSearchingAddr = false;
                                const handleAutoAddr = async () => {
                                  if (isSearchingAddr || !p.activity?.trim()) return;
                                  isSearchingAddr = true;
                                  try {
                                    const found = await searchAddressFromPlaceName(p.activity, tripRegion);
                                    if (found?.address) updateAddress(dIdx, pIdx, found.address);
                                  } catch (e) { /* silent */ }
                                  finally { isSearchingAddr = false; }
                                };
                                return (
                                  <div className="flex items-center gap-2 text-slate-500 bg-white w-full px-2 py-1 rounded-lg border border-slate-200 shadow-sm" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      title="내 장소 정렬 기준 설정"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setBasePlanRef({ id: p.id, name: p.activity, address: p.receipt?.address || '' });
                                        setLastAction(`'${p.activity}'을(를) 거리 계산 기준으로 설정했습니다.`);
                                      }}
                                      className="shrink-0 transition-colors hover:bg-amber-50 p-1 -ml-1 rounded-md"
                                    >
                                      <MapPin size={12} className={basePlanRef?.id === p.id ? "text-amber-500" : "text-[#3182F6]"} />
                                    </button>
                                    <input
                                      value={p.receipt?.address || ''}
                                      onChange={(e) => updateAddress(dIdx, pIdx, e.target.value)}
                                      placeholder="주소 정보 없음"
                                      className="flex-1 min-w-0 bg-transparent border-none outline-none text-[11px] font-bold text-slate-600 placeholder:text-slate-300"
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); void handleAutoAddr(); }}
                                      title="일정 이름으로 주소 자동 검색"
                                      className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                                    >
                                      <Sparkles size={9} />
                                    </button>
                                  </div>
                                );
                              })()}
                              {businessWarning && (
                                <div className="w-full px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 text-red-600 text-[10px] font-black">
                                  {businessWarning}
                                </div>
                              )}
                              <div className="w-full bg-slate-50/60 border border-slate-200 rounded-lg py-1.5 px-2.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => setBusinessEditorTarget(prev => (prev?.dayIdx === dIdx && prev?.pIdx === pIdx ? null : { dayIdx: dIdx, pIdx }))}
                                  className="w-full flex items-center gap-2 text-left"
                                >
                                  {formatBusinessSummary(p.business) === '미설정' ? (
                                    <span className="text-[10px] font-bold text-slate-400">영업 정보 (선택)</span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-slate-600 truncate flex-1">{formatBusinessSummary(p.business)}</span>
                                  )}
                                </button>
                                {businessEditorTarget?.dayIdx === dIdx && businessEditorTarget?.pIdx === pIdx && (
                                  <>
                                    <p className="text-[9px] text-slate-400 font-semibold mt-1 mb-1.5">현재 일정 시간과 충돌하면 위에 빨간 경고가 표시됩니다.</p>
                                    <textarea
                                      rows={3}
                                      placeholder={'10:30 - 22:00\n15:00 - 17:00 브레이크타임\n21:00 라스트오더'}
                                      className="w-full mb-1.5 text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-[#3182F6] text-slate-600 placeholder:text-slate-300 resize-none"
                                      onBlur={(e) => {
                                        const parsed = parseBusinessHoursText(e.target.value);
                                        if (parsed.open || parsed.close || parsed.breakStart || parsed.breakEnd || parsed.lastOrder) {
                                          Object.entries(parsed).forEach(([k, v]) => { if (v) updatePlanBusinessField(dIdx, pIdx, k, v); });
                                        }
                                      }}
                                    />
                                    <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                                      <TimeInput value={p.business?.open || ''} onChange={(v) => updatePlanBusinessField(dIdx, pIdx, 'open', v)} className="text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3182F6]" title="운영 시작" />
                                      <TimeInput value={p.business?.close || ''} onChange={(v) => updatePlanBusinessField(dIdx, pIdx, 'close', v)} className="text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3182F6]" title="운영 종료" />
                                      <TimeInput value={p.business?.breakStart || ''} onChange={(v) => updatePlanBusinessField(dIdx, pIdx, 'breakStart', v)} className="text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3182F6]" title="브레이크 시작" />
                                      <TimeInput value={p.business?.breakEnd || ''} onChange={(v) => updatePlanBusinessField(dIdx, pIdx, 'breakEnd', v)} className="text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3182F6]" title="브레이크 종료" />
                                      <TimeInput value={p.business?.lastOrder || ''} onChange={(v) => updatePlanBusinessField(dIdx, pIdx, 'lastOrder', v)} className="text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3182F6] col-span-2" title="라스트오더" />
                                    </div>
                                    <div className="flex items-center gap-1 flex-wrap">
                                      {WEEKDAY_OPTIONS.map(w => {
                                        const active = (p.business?.closedDays || []).includes(w.value);
                                        return (
                                          <button
                                            key={w.value}
                                            type="button"
                                            onClick={() => togglePlanClosedDay(dIdx, pIdx, w.value)}
                                            className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${active ? 'text-red-500 bg-red-50 border-red-200' : 'text-slate-400 bg-white border-slate-200'}`}
                                          >
                                            {w.label} 휴무
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* 4행: 메모 입력란 */}
                              <div onClick={(e) => e.stopPropagation()}>
                                <input
                                  value={p.memo || ''}
                                  onChange={(e) => updateMemo(dIdx, pIdx, e.target.value)}
                                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-medium text-slate-600 outline-none placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all"
                                  placeholder="메모를 입력하세요..."
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 🟩 하단 영수증 영역 (전체 너비 100%) */}
                      {p.type !== 'backup' && (
                        <div className="w-full bg-slate-50/50" onClick={(e) => e.stopPropagation()}>
                          {isExpanded && (
                            <div className="px-5 py-4 animate-in slide-in-from-top-1 bg-white border-b border-slate-100 border-dashed">
                              {p.types?.includes('ship') && (
                                <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3 mb-4 text-xs text-slate-600 font-bold flex flex-col gap-1.5">
                                  {p.receipt?.shipDetails?.loading && (
                                    <div>🚗 선적 가능: <span className="text-red-500">{p.receipt.shipDetails.loading}</span></div>
                                  )}
                                  <div className="flex items-center gap-1.5">
                                    <span>🧍 승선:</span>
                                    <input
                                      value={p.receipt?.shipDetails?.boarding || ''}
                                      onChange={(e) => { e.stopPropagation(); setItinerary(prev => { const d = JSON.parse(JSON.stringify(prev)); const item = d.days[dIdx].plan[pIdx]; if (!item.receipt) item.receipt = {}; if (!item.receipt.shipDetails) item.receipt.shipDetails = {}; item.receipt.shipDetails.boarding = e.target.value; return d; }); }}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="승선 가능 시간 입력"
                                      className="flex-1 bg-transparent outline-none text-slate-700 font-bold focus:border-b focus:border-blue-300"
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="space-y-3 mb-3">
                                <p className="text-[10px] text-slate-400 font-semibold -mb-1">메뉴명/수량/가격을 직접 수정하면 총액이 자동 계산됩니다.</p>
                                {p.receipt?.items?.map((m, mIdx) => (
                                  <div key={mIdx} className="flex justify-between items-center text-xs group/item">
                                    <div className="flex items-center gap-2 flex-1">
                                      <div className="cursor-pointer text-slate-300 hover:text-[#3182F6]" onClick={(e) => { e.stopPropagation(); updateMenuData(dIdx, pIdx, mIdx, 'toggle'); }}>
                                        {m.selected ? <CheckSquare size={14} className="text-[#3182F6]" /> : <Square size={14} />}
                                      </div>
                                      <input value={m.name} onChange={(e) => updateMenuData(dIdx, pIdx, mIdx, 'name', e.target.value)} onClick={(e) => e.stopPropagation()} className="bg-transparent border-none outline-none text-slate-700 font-bold w-full" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                                        <button onClick={(e) => { e.stopPropagation(); updateMenuData(dIdx, pIdx, mIdx, 'qty', -1); }}><Minus size={10} /></button>
                                        <span className="w-4 text-center text-[10px]">{getMenuQty(m)}</span>
                                        <button onClick={(e) => { e.stopPropagation(); updateMenuData(dIdx, pIdx, mIdx, 'qty', 1); }}><Plus size={10} /></button>
                                      </div>
                                      <input type="number" value={m.price} onChange={(e) => { e.stopPropagation(); updateMenuData(dIdx, pIdx, mIdx, 'price', e.target.value); }} onClick={(e) => e.stopPropagation()} className="w-16 text-right font-bold text-slate-500 bg-transparent border-none outline-none focus:border-b focus:border-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                      <span className="w-20 text-right font-black text-[#3182F6]">₩{getMenuLineTotal(m).toLocaleString()}</span>
                                      <button onClick={(e) => { e.stopPropagation(); deleteMenuItem(dIdx, pIdx, mIdx); }} className="text-slate-300 hover:text-red-500"><Trash2 size={12} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); addMenuItem(dIdx, pIdx); }} className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-[10px] font-bold text-slate-400 hover:text-[#3182F6] hover:bg-white transition-all">+ 메뉴 추가</button>

                              {/* 플랜 B 목록 → 카드 상단 ◀▶ 캐러셀로 이동 */}
                            </div>
                          )}

                          {/* 🟢 하단: 총액 표시 (상시 노출) */}
                          <div className="flex justify-between items-center px-4 py-2 hover:bg-slate-100/50 transition-colors cursor-pointer" onClick={() => toggleReceipt(p.id)}>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              Total Estimated Cost {isExpanded ? <ChevronDown size={12} className="rotate-180 transition-transform" /> : <ChevronDown size={12} className="transition-transform" />}
                            </span>
                            <span className="text-xl font-black text-[#3182F6]">₩{Number(p.price).toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>{/* /Plan B wrapper */}

                  {/* 일차 마지막 아이템 아래 드롭 존 */}
                  {pIdx === d.plan.length - 1 && p.type !== 'backup' && (draggingFromLibrary || draggingFromTimeline?.altIdx !== undefined) && (() => {
                    const isDropHere = dropTarget?.dayIdx === dIdx && dropTarget?.insertAfterPIdx === pIdx;
                    const dropWarn = isDropHere && draggingFromLibrary ? getDropWarning(draggingFromLibrary, dIdx, pIdx) : '';
                    return (
                      <div
                        className="relative w-full pt-3 -mb-3 z-10 cursor-copy"
                        data-droptarget={`${dIdx}-${pIdx}`}
                        onDragOver={(e) => { e.preventDefault(); setDropTarget({ dayIdx: dIdx, insertAfterPIdx: pIdx }); }}
                        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropTarget(null); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggingFromLibrary) {
                            addNewItem(dIdx, pIdx, draggingFromLibrary.types, draggingFromLibrary);
                            if (!isDragCopy) removePlace(draggingFromLibrary.id);
                          } else if (draggingFromTimeline?.altIdx !== undefined) {
                            insertAlternativeToTimeline(dIdx, pIdx, draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, draggingFromTimeline.altIdx);
                          }
                          setDraggingFromLibrary(null); setDraggingFromTimeline(null); setDropTarget(null); setIsDragCopy(false);
                        }}
                      >
                        <div className={`w-full flex items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed transition-all duration-150 text-[11px] font-black ${isDropHere ? (dropWarn ? 'h-14 border-orange-400 bg-orange-50 text-orange-500' : 'h-12 border-[#3182F6] bg-blue-50 text-[#3182F6]') : 'h-8 border-slate-200 text-slate-300'}`}>
                          <Plus size={11} /> {isDropHere && dropWarn ? dropWarn : '이곳에 놓아주세요'}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 이동 정보 칩 / 드롭 존 */}
                  {pIdx < d.plan.length - 1 && p.type !== 'backup' && (
                    <div className="flex items-center pt-3 pb-0 -mb-3 relative w-full">
                      {(() => {
                        const nextItem = d.plan[pIdx + 1];
                        if (!nextItem || nextItem.type === 'backup') return null;

                        if (draggingFromLibrary || draggingFromTimeline?.altIdx !== undefined) {
                          const isDropHere = dropTarget?.dayIdx === dIdx && dropTarget?.insertAfterPIdx === pIdx;
                          const dropWarn = isDropHere && draggingFromLibrary ? getDropWarning(draggingFromLibrary, dIdx, pIdx) : '';
                          return (
                            <div
                              className="z-10 w-full cursor-copy"
                              data-droptarget={`${dIdx}-${pIdx}`}
                              onDragOver={(e) => { e.preventDefault(); setDropTarget({ dayIdx: dIdx, insertAfterPIdx: pIdx }); }}
                              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropTarget(null); }}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (draggingFromLibrary) {
                                  addNewItem(dIdx, pIdx, draggingFromLibrary.types, draggingFromLibrary);
                                  if (!isDragCopy) removePlace(draggingFromLibrary.id);
                                } else if (draggingFromTimeline?.altIdx !== undefined) {
                                  insertAlternativeToTimeline(dIdx, pIdx, draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, draggingFromTimeline.altIdx);
                                }
                                setDraggingFromLibrary(null); setDraggingFromTimeline(null); setDropTarget(null); setIsDragCopy(false);
                              }}
                            >
                              <div className={`w-full flex items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed transition-all duration-150 text-[11px] font-black ${isDropHere ? (dropWarn ? 'h-14 border-orange-400 bg-orange-50 text-orange-500' : 'h-12 border-[#3182F6] bg-blue-50 text-[#3182F6]') : 'h-8 border-slate-200 text-slate-300'}`}>
                                <Plus size={11} /> {isDropHere && dropWarn ? dropWarn : '이곳에 놓아주세요'}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div className="z-10 flex items-center justify-center w-full">
                            <div className="flex items-center bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm gap-2">
                              {/* 이동 시간 */}
                              <div className="flex items-center gap-1.5">
                                <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx + 1, -TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Minus size={10} /></button>
                                <span
                                  className={`min-w-[3rem] text-center tracking-tight text-xs font-black ${nextItem.travelTimeAuto && nextItem.travelTimeOverride !== nextItem.travelTimeAuto ? 'text-[#3182F6] cursor-pointer' : 'text-slate-800'}`}
                                  onClick={(e) => { e.stopPropagation(); if (nextItem.travelTimeAuto && nextItem.travelTimeOverride !== nextItem.travelTimeAuto) resetTravelTime(dIdx, pIdx + 1); }}
                                  title={nextItem.travelTimeAuto && nextItem.travelTimeOverride !== nextItem.travelTimeAuto ? '클릭하여 경로 계산 시간으로 초기화' : undefined}
                                >{nextItem.travelTimeOverride || '15분'}</span>
                                <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx + 1, TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Plus size={10} /></button>
                              </div>
                              {/* 거리 */}
                              <button
                                className="flex items-center gap-1 text-slate-400 text-xs font-bold hover:text-[#3182F6] transition-colors cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const INVALID = ['주소 정보 없음', '주소 미정', '장소 미정', ''];
                                  const fromAddr = (p.receipt?.address || p.activity || '').trim();
                                  const toAddr = (nextItem.receipt?.address || nextItem.activity || '').trim();
                                  const from = !INVALID.includes(fromAddr) ? fromAddr : p.activity;
                                  const to = !INVALID.includes(toAddr) ? toAddr : nextItem.activity;
                                  const seg = (s) => `-,-,${encodeURIComponent(s)},-,TEXT`;
                                  window.open(`https://map.naver.com/p/directions/${seg(from)}/${seg(to)}/-/car`, '_blank', 'noopener,width=1280,height=900');
                                }}
                                title="네이버 지도로 이 구간 길찾기"
                              >
                                <MapIcon size={11} /><span>{formatDistanceText(nextItem.distance)}</span>
                              </button>
                              {/* 자동경로 */}
                              {(() => {
                                const rid = `${dIdx}_${pIdx + 1}`; const busy = calculatingRouteId === rid; return (
                                  <button onClick={(e) => { e.stopPropagation(); autoCalculateRouteFor(dIdx, pIdx + 1); }} disabled={!!calculatingRouteId} className={`flex items-center gap-1 transition-colors border rounded-lg px-2 py-1 text-[10px] font-black ${busy ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white hover:bg-[#3182F6] hover:text-white text-slate-400 border-slate-200 hover:border-[#3182F6]'}`}>
                                    <Sparkles size={10} /> {busy ? '계산중' : '자동경로'}
                                  </button>);
                              })()}
                              {/* 구분선 */}
                              <div className="w-px h-4 bg-slate-200 mx-0.5" />
                              {/* 여유 시간 */}
                              <div className="flex items-center gap-1.5">
                                <button onClick={(e) => { e.stopPropagation(); updateBufferTime(dIdx, pIdx + 1, -BUFFER_STEP); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Minus size={10} /></button>
                                <span className="min-w-[3rem] text-center tracking-tight text-xs font-black text-slate-500">{nextItem.bufferTimeOverride || '10분'}</span>
                                <button onClick={(e) => { e.stopPropagation(); updateBufferTime(dIdx, pIdx + 1, BUFFER_STEP); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Plus size={10} /></button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            }))}
          </div>
        </div>

        <footer className="fixed bottom-0 bg-white/95 backdrop-blur-xl border-t px-8 py-3.5 flex items-center gap-3 z-[130] shadow-[0_-5px_20px_rgba(0,0,0,0.02)]" style={{ left: col1Collapsed ? 44 : 260, right: col2Collapsed ? 44 : 300 }}>
          <MessageSquare size={16} className="text-[#3182F6] shrink-0" />
          <p className="text-[12px] font-bold text-slate-500 truncate flex-1">"{lastAction}"</p>
        </footer>

        {/* 되돌리기 토스트 */}
        {
          undoToast && (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[150] animate-in">
              <div className="flex items-center gap-3 bg-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-xl">
                <span className="text-[12px] font-bold">작업이 저장되었습니다</span>
                <button
                  onClick={() => { handleUndo(); setUndoToast(false); }}
                  className="text-[11px] font-black text-[#3182F6] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
                >
                  되돌리기
                </button>
                <button onClick={() => setUndoToast(false)} className="text-white/40 hover:text-white/80 transition-colors ml-1">
                  ✕
                </button>
              </div>
            </div>
          )
        }

        {/* ── 드래그 프리뷰 고스트 (모바일용) ── */}
        {(draggingFromLibrary || draggingFromTimeline) && (
          <div
            ref={dragGhostRef}
            className="fixed pointer-events-none z-[9999] bg-white/95 backdrop-blur-xl border-2 border-[#3182F6] rounded-2xl px-5 py-3.5 shadow-[0_20px_50px_rgba(49,130,246,0.3)] flex items-center gap-4 animate-in fade-in zoom-in duration-200"
            style={{
              left: 0,
              top: 0,
              transform: `translate3d(${dragCoord.x}px, ${dragCoord.y}px, 0) translate(-50%, -120%)`,
              minWidth: '180px',
              willChange: 'transform'
            }}
          >
            <div className="w-1.5 h-10 bg-gradient-to-b from-[#3182F6] to-indigo-500 rounded-full shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-[#3182F6] uppercase tracking-[0.15em]">Dragging Object</span>
              <span className="text-[15px] font-black text-slate-800 truncate max-w-[140px]">
                {draggingFromLibrary?.name ||
                  (itinerary.days?.[draggingFromTimeline?.dayIdx]?.plan?.[draggingFromTimeline?.pIdx]?.activity) ||
                  '일정 이동 중'}
              </span>
            </div>
          </div>
        )}
      </div >

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;900&display=swap');
        body { font-family: 'Pretendard', -apple-system, sans-serif; letter-spacing: -0.02em; margin: 0; background-color: #F2F4F6; }
        .animate-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        /* input number 스피너 숨기기 */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
      `}</style>
    </div >
  );
};

const AppWithBoundary = () => (
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);

export default AppWithBoundary;
