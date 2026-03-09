/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, no-useless-escape */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { db, auth } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import {
  Navigation, MessageSquare, LogOut, User as UserIcon,
  Hourglass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  ArrowUpRight, ArrowUpLeft, ArrowDownRight, ArrowDownLeft,
  PlusCircle, Waves, QrCode, CheckSquare, Square,
  Plus, Minus, MapPin, Trash2, Map as MapIcon,
  ChevronsRight, Sparkles, CornerDownRight, GitBranch, Umbrella, ArrowLeftRight, Store, Lock, ChevronLeft, ChevronRight, Timer, Anchor, Utensils, Coffee, Camera, Bed, ChevronDown, ChevronUp, Package, Eye, Star, Pencil, Calendar, GripVertical, Gift, X, Share2, SlidersHorizontal
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
  { label: '휴식', types: ['rest'], Icon: Hourglass, className: 'text-cyan-600 bg-cyan-50 border-cyan-200 hover:bg-cyan-100' },
  { label: '뷰맛집', types: ['view'], Icon: Eye, className: 'text-sky-600 bg-sky-50 border-sky-200 hover:bg-sky-100' },
  { label: '체험', types: ['experience'], Icon: Star, className: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
  { label: '기념품샵', types: ['souvenir'], Icon: Gift, className: 'text-teal-600 bg-teal-50 border-teal-200 hover:bg-teal-100' },
  { label: '픽업', types: ['pickup'], Icon: Package, className: 'text-orange-500 bg-orange-50 border-orange-200 hover:bg-orange-100' },
  { label: '장소', types: ['place'], Icon: MapPin, className: 'text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100' },
];

const TAG_OPTIONS = [
  { label: '식당', value: 'food' },
  { label: '카페', value: 'cafe' },
  { label: '관광', value: 'tour' },
  { label: '숙소', value: 'lodge' },
  { label: '휴식', value: 'rest' },
  { label: '픽업', value: 'pickup' },
  { label: '오픈런', value: 'openrun' },
  { label: '뷰맛집', value: 'view' },
  { label: '체험', value: 'experience' },
  { label: '기념품샵', value: 'souvenir' },
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
const EMPTY_BUSINESS = { open: '', close: '', breakStart: '', breakEnd: '', lastOrder: '', entryClose: '', closedDays: [] };
// 터치 시 나오는 시간 컨트롤러 프리셋 (필드별)
const BUSINESS_PRESETS = {
  open:       ['06:00','08:00','09:00','10:00','10:30','11:00'],
  close:      ['19:00','20:00','21:00','22:00','23:00','24:00'],
  breakStart: ['12:00','13:00','14:00','15:00'],
  breakEnd:   ['13:00','14:00','15:00','16:00','17:00'],
  lastOrder:  ['19:30','20:00','20:30','21:00','21:30'],
  entryClose: ['18:00','19:00','20:00','20:30'],
};
const DEFAULT_BUSINESS = { open: '', close: '', breakStart: '', breakEnd: '', lastOrder: '', entryClose: '', closedDays: [] };
const normalizeTimeToken = (raw = '') => {
  const m = String(raw).trim().match(/(\d{1,2})(?::(\d{2}))?/);
  if (!m) return '';
  const hh = Number(m[1]);
  const mm = Number(m[2] || '0');
  if (Number.isNaN(hh) || Number.isNaN(mm) || hh < 0 || hh > 24 || mm < 0 || mm > 59) return '';
  if (hh === 24 && mm > 0) return ''; // 24:00만 허용
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
  const parsed = { open: '', close: '', breakStart: '', breakEnd: '', lastOrder: '', entryClose: '' };
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

  if (!parsed.open || !parsed.close) {
    const allTimes = extractTimesFromText(String(text));
    if (!parsed.open && allTimes[0]) parsed.open = allTimes[0];
    if (!parsed.close && allTimes[1]) parsed.close = allTimes[1];
    if (!parsed.breakStart && allTimes[2]) parsed.breakStart = allTimes[2];
    if (!parsed.breakEnd && allTimes[3]) parsed.breakEnd = allTimes[3];
    if (!parsed.lastOrder && allTimes[4]) parsed.lastOrder = allTimes[4];
    if (!parsed.entryClose && allTimes[5]) parsed.entryClose = allTimes[5];
  }

  return parsed;
};

// 24시간 형식 시간 입력 컴포넌트 (오전/오후 없음, 24:00 지원)
const TimeInput = ({ value, onChange, onFocus, onBlurExtra, className = '', title = '', placeholder = '' }) => {
  const handleChange = (e) => {
    let v = e.target.value.replace(/[^0-9:]/g, '');
    if (v.length === 2 && !v.includes(':')) v = v + ':';
    if (v.length > 5) v = v.slice(0, 5);
    onChange(v);
  };
  const handleBlur = (e) => {
    let v = e.target.value.trim();
    if (/^\d{4}$/.test(v)) v = v.slice(0, 2) + ':' + v.slice(2);
    if (!/^\d{2}:\d{2}$/.test(v)) { onChange(v); onBlurExtra?.(); return; }
    const [h, min] = v.split(':').map(Number);
    // 24:00 = 자정(영업 종료) 허용, 그 외 h>23 불허
    if (h > 24 || min > 59 || (h === 24 && min > 0)) { onChange(''); onBlurExtra?.(); return; }
    onChange(v);
    onBlurExtra?.();
  };
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      maxLength={5}
      title={title}
      className={className}
    />
  );
};
// 영업 정보 공통 에디터 (내장소 수정 모달 / 일정 카드 / 새 장소 추가 공통)
const BusinessHoursEditor = ({ business = {}, onChange }) => {
  const [activeField, setActiveField] = React.useState(null);
  const biz = normalizeBusiness(business);
  const set = (key, v) => onChange({ ...biz, [key]: v });
  const setMulti = (obj) => onChange({ ...biz, ...obj });
  const fieldCls = 'text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6] w-full';
  const LABELS = { open:'오픈', close:'마감', breakStart:'브레이크 시작', breakEnd:'브레이크 종료', lastOrder:'라스트오더', entryClose:'입장 마감' };
  const FIELDS = ['open','close','breakStart','breakEnd','lastOrder','entryClose'];

  return (
    <div
      onPaste={(e) => {
        const text = e.clipboardData.getData('text');
        const parsed = parseBusinessHoursText(text);
        if (parsed.open || parsed.close || parsed.breakStart || parsed.breakEnd || parsed.lastOrder || parsed.entryClose) {
          e.preventDefault();
          setMulti(parsed);
        }
      }}
    >
      <textarea
        rows={3}
        placeholder={'10:30 - 22:00\n15:00 - 17:00 브레이크타임\n21:00 라스트오더\n20:30 입장마감'}
        className="w-full mb-1.5 text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-[#3182F6] text-slate-600 placeholder:text-slate-300 resize-none"
        onBlur={(e) => {
          const parsed = parseBusinessHoursText(e.target.value);
          if (parsed.open || parsed.close || parsed.breakStart || parsed.breakEnd || parsed.lastOrder || parsed.entryClose) {
            setMulti(parsed);
          }
        }}
      />
      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        {FIELDS.map(field => (
          <div key={field} className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-slate-400">{LABELS[field]}</span>
            <TimeInput
              value={biz[field]}
              onChange={(v) => set(field, v)}
              onFocus={() => setActiveField(field)}
              onBlurExtra={() => setTimeout(() => setActiveField(f => f === field ? null : f), 160)}
              className={fieldCls}
              title={LABELS[field]}
            />
            {activeField === field && BUSINESS_PRESETS[field]?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-0.5" onMouseDown={(e) => e.preventDefault()}>
                {BUSINESS_PRESETS[field].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { set(field, t); setActiveField(null); }}
                    className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-50 border border-blue-200 text-[#3182F6] hover:bg-blue-100 active:bg-blue-200"
                  >{t}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        {WEEKDAY_OPTIONS.map(w => {
          const active = (biz.closedDays || []).includes(w.value);
          return (
            <button
              key={w.value}
              type="button"
              onClick={() => onChange({ ...biz, closedDays: active ? biz.closedDays.filter(v => v !== w.value) : [...biz.closedDays, w.value] })}
              className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${active ? 'text-red-500 bg-red-50 border-red-200' : 'text-slate-400 bg-white border-slate-200'}`}
            >{w.label} 휴무</button>
          );
        })}
      </div>
    </div>
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
  entryClose: String(business.entryClose || ''),
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
  const [business, setBusiness] = React.useState(EMPTY_BUSINESS);
  const [menus, setMenus] = React.useState([]);
  const [menuInput, setMenuInput] = React.useState({ name: '', price: '' });
  const [address, setAddress] = React.useState('');
  const [memo, setMemo] = React.useState('');
  const [isSearchingAddress, setIsSearchingAddress] = React.useState(false);
  const [addressSearchNote, setAddressSearchNote] = React.useState('');
  const lastScrapedUrlRef = React.useRef('');
  const extractMapLink = (raw = '') => {
    const m = String(raw || '').match(/https?:\/\/(?:naver\.me|map\.naver\.com|pcmap\.place\.naver\.com|m\.place\.naver\.com)\/[^\s)>\]"']+/i);
    if (!m?.[0]) return '';
    return m[0].replace(/[),.;]+$/, '');
  };

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

  const scrapePlaceFromMapLink = async (url) => {
    const cleanUrl = String(url || '').trim();
    if (!cleanUrl) return;
    if (lastScrapedUrlRef.current === cleanUrl) return;
    lastScrapedUrlRef.current = cleanUrl;

    setIsSearchingAddress(true);
    setAddressSearchNote('지도 링크 분석 중...');
    try {
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

      if (!data) {
        throw lastErr || new Error('스크래핑 응답이 없습니다.');
      }

      if (data?.title) setNewPlaceName(String(data.title).trim());
      if (data?.address) setAddress(String(data.address).trim());

      const parsed = parseBusinessHoursText(String(data?.hours || ''));
      if (parsed.open || parsed.close || parsed.breakStart || parsed.breakEnd || parsed.lastOrder || parsed.entryClose) {
        setBusiness(prev => ({ ...prev, ...parsed }));
      }

      if (Array.isArray(data?.menus) && data.menus.length > 0) {
        const normalizedMenus = data.menus
          .map((m) => ({ name: String(m?.name || '').trim(), price: Number(m?.price) || 0 }))
          .filter((m) => m.name);
        if (normalizedMenus.length) setMenus(normalizedMenus.slice(0, 5));
      }

      setAddressSearchNote('지도 링크에서 장소 정보를 불러왔습니다.');
      if (!data?.address && data?.title) {
        const foundAddress = await searchAddressFromPlaceName(String(data.title), regionHint);
        if (foundAddress?.address) setAddress(foundAddress.address);
      }
    } catch (e) {
      setAddressSearchNote(`지도 자동 추출 실패: ${e?.message || '알 수 없는 오류'}`);
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
          onChange={(e) => {
            const val = e.target.value;
            const mapUrl = extractMapLink(val);
            if (mapUrl) {
              void scrapePlaceFromMapLink(mapUrl);
            } else {
              setNewPlaceName(val);
            }
          }}
          onBlur={() => { void tryAutoFillAddress(false); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter') {
              e.preventDefault();
              void tryAutoFillAddress(true);
            }
          }}
          placeholder="일정 이름 입력 (지도 링크 붙여넣기 가능)"
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
          <BusinessHoursEditor business={business} onChange={(b) => setBusiness(b)} />
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

  const [loading, setLoading] = useState(true);
  const [currentPlanId, setCurrentPlanId] = useState('main');
  const [planList, setPlanList] = useState([]);
  const [showPlanManager, setShowPlanManager] = useState(false);
  const [showEntryChooser, setShowEntryChooser] = useState(false);
  const [newPlanRegion, setNewPlanRegion] = useState('');
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [showShareManager, setShowShareManager] = useState(false);
  const [showPlanOptions, setShowPlanOptions] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareSettings, setShareSettings] = useState({ visibility: 'private', permission: 'viewer' });
  const [isSharedReadOnly, setIsSharedReadOnly] = useState(false);
  const [sharedSource, setSharedSource] = useState(null); // { ownerId, planId }
  const entryChooserShownRef = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [draggingFromLibrary, setDraggingFromLibrary] = useState(null);
  const [placeFilterTags, setPlaceFilterTags] = useState([]); // 내 장소 필터링 태그
  const [draggingFromTimeline, setDraggingFromTimeline] = useState(null);
  const [isDroppingOnDeleteZone, setIsDroppingOnDeleteZone] = useState(false);
  const [dropTarget, setDropTarget] = useState(null);
  const [dropOnItem, setDropOnItem] = useState(null); // { dayIdx, pIdx } — Plan B 드롭 대상
  const [isDragCopy, setIsDragCopy] = useState(false); // Ctrl+드래그 시 복사 모드
  const [dragCoord, setDragCoord] = useState({ x: 0, y: 0 });
  const desktopDragRef = useRef(null);
  const ctrlHeldRef = useRef(false);
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceTypes, setNewPlaceTypes] = useState(['food']);
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [editPlaceDraft, setEditPlaceDraft] = useState(null);
  const [tripRegion, setTripRegion] = useState(() => safeLocalStorageGet('trip_region_hint', '제주시'));
  const [tripStartDate, setTripStartDate] = useState(() => safeLocalStorageGet('trip_start_date', ''));
  const [tripEndDate, setTripEndDate] = useState(() => safeLocalStorageGet('trip_end_date', ''));
  const [planOptionRegion, setPlanOptionRegion] = useState('');
  const [planOptionStartDate, setPlanOptionStartDate] = useState('');
  const [planOptionEndDate, setPlanOptionEndDate] = useState('');
  const [planOptionBudget, setPlanOptionBudget] = useState('0');
  // 초기 상태 안전하게 설정
  const [itinerary, setItinerary] = useState({ days: [], places: [] });
  const [history, setHistory] = useState([]);
  const [pendingAutoRouteJobs, setPendingAutoRouteJobs] = useState([]);
  const [undoToast, setUndoToast] = useState(false);
  const undoToastTimerRef = React.useRef(null);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedPlaceId, setExpandedPlaceId] = useState(null);
  const [durationControllerTarget, setDurationControllerTarget] = useState(null); // { dayIdx, pIdx, left, top }
  const conflictAlertKeyRef = useRef('');
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
  const [touchDragLock, setTouchDragLock] = useState(false);
  const touchLockStateRef = useRef({ overflow: '', touchAction: '' });
  const touchDragSourceRef = useRef(null); // { kind, place?, payload?, startX, startY }
  const executeTouchDropRef = useRef(null);
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

    const resolveTargetElement = () => {
      // 1) 일반 일정 카드 id
      if (targetItemId) {
        const byItemId = document.getElementById(targetItemId);
        if (byItemId) return byItemId;
      }

      // 2) 일자 첫 카드 마커
      const byDayMarker = document.getElementById(`day-marker-${dayNum}`);
      if (byDayMarker) return byDayMarker;

      // 3) data-plan-id fallback (첫 일정 id 충돌/대체 대비)
      if (targetItemId) {
        const byDataId = document.querySelector(`[data-plan-id="${CSS.escape(String(targetItemId))}"]`);
        if (byDataId) return byDataId;
      }
      return null;
    };

    const scrollToTarget = () => {
      const el = resolveTargetElement();
      if (!el) return false;
      el.scrollIntoView({
        behavior: 'smooth',
        block: targetItemId ? 'center' : 'start'
      });
      return true;
    };

    // 렌더 타이밍/레이아웃 변동 대비 재시도
    if (!scrollToTarget()) {
      requestAnimationFrame(() => {
        if (!scrollToTarget()) setTimeout(scrollToTarget, 120);
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
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280));
  const [tagEditorTarget, setTagEditorTarget] = useState(null); // {dayIdx, pIdx}
  const [businessEditorTarget, setBusinessEditorTarget] = useState(null); // {dayIdx, pIdx}
  const [viewingPlanIdx, setViewingPlanIdx] = useState({}); // {[itemId]: altIdx} — -1 = main plan A
  const [ferryEditField, setFerryEditField] = useState(null); // { pId, field: 'load'|'depart' }
  const [routeCache, setRouteCache] = useState({});
  const [calculatingRouteId, setCalculatingRouteId] = useState(null);
  const [isCalculatingAllRoutes, setIsCalculatingAllRoutes] = useState(false);
  const [dashboardHeight, setDashboardHeight] = useState(200);
  const dashboardRef = useRef(null);
  const heroTriggerRef = useRef(null);
  const [heroCollapsed, setHeroCollapsed] = useState(false);
  const [heroSummaryExpanded, setHeroSummaryExpanded] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  const isMobileLayout = viewportWidth < 1100;
  const leftExpandedWidth = isMobileLayout ? Math.min(340, Math.round(viewportWidth * 0.82)) : 260;
  const rightExpandedWidth = isMobileLayout ? Math.min(360, Math.round(viewportWidth * 0.86)) : 310;
  const leftCollapsedWidth = isMobileLayout ? 0 : 44;
  const rightCollapsedWidth = isMobileLayout ? 0 : 44;
  const leftSidebarWidth = col1Collapsed ? leftCollapsedWidth : leftExpandedWidth;
  const rightSidebarWidth = col2Collapsed ? rightCollapsedWidth : rightExpandedWidth;
  const isCompactTimeline = isMobileLayout || viewportWidth < 1380 || (!col1Collapsed && !col2Collapsed && viewportWidth < 1720);

  const scrollIntervalRef = useRef(null);
  const lastTouchYRef = useRef(null);
  const mobileSwitchRef = useRef(isMobileLayout);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isMobileLayout && !mobileSwitchRef.current) {
      setCol1Collapsed(true);
      setCol2Collapsed(true);
    }
    mobileSwitchRef.current = isMobileLayout;
  }, [isMobileLayout]);

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

  const normalizeShare = (raw = {}) => ({
    visibility: ['private', 'link', 'public'].includes(raw?.visibility) ? raw.visibility : 'private',
    permission: ['viewer', 'editor'].includes(raw?.permission) ? raw.permission : 'viewer',
  });

  const buildShareLink = (ownerId, planId) => {
    const url = new URL(window.location.href);
    url.searchParams.set('owner', ownerId);
    url.searchParams.set('plan', planId || 'main');
    return url.toString();
  };

  const sanitizeRegionCode = (region = '') => {
    const raw = String(region || '').trim().replace(/\s+/g, '');
    if (!raw) return 'TRIP';
    return raw.slice(0, 6).toUpperCase();
  };
  const makePlanCode = (region = '', dateStr = '') => {
    const baseDate = String(dateStr || '').trim();
    const yyyyMM = /^\d{4}-\d{2}/.test(baseDate)
      ? baseDate.slice(0, 7).replace('-', '')
      : new Date().toISOString().slice(0, 7).replace('-', '');
    const suffix = String(Date.now()).slice(-4);
    return `${sanitizeRegionCode(region)}-${yyyyMM}-${suffix}`;
  };
  const makePlanCodeStable = (region = '', dateStr = '', planId = '') => {
    const baseDate = String(dateStr || '').trim();
    const yyyyMM = /^\d{4}-\d{2}/.test(baseDate)
      ? baseDate.slice(0, 7).replace('-', '')
      : new Date().toISOString().slice(0, 7).replace('-', '');
    const tail = String(planId || 'main').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase().padStart(4, '0');
    return `${sanitizeRegionCode(region)}-${yyyyMM}-${tail}`;
  };
  const resolvePlanMetaForCard = (plan = {}) => {
    const isCurrent = plan.id === currentPlanId;
    const region = (isCurrent ? tripRegion : plan.region) || '여행지';
    const title = (isCurrent ? (itinerary.planTitle || '') : plan.title) || `${region} 일정`;
    const startDate = (isCurrent ? tripStartDate : plan.startDate) || '';
    const code = (isCurrent ? itinerary.planCode : plan.planCode) || makePlanCodeStable(region, startDate, plan.id || currentPlanId);
    return { region, title, startDate, code };
  };
  const getRegionCoverImage = (region = '') => {
    const r = String(region || '').toLowerCase();
    if (/(제주|jeju)/.test(r)) return 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop';
    if (/(부산|busan)/.test(r)) return 'https://images.unsplash.com/photo-1526481280695-3c4696659f38?q=80&w=1600&auto=format&fit=crop';
    if (/(서울|seoul)/.test(r)) return 'https://images.unsplash.com/photo-1538485399081-7c897f6e6f68?q=80&w=1600&auto=format&fit=crop';
    if (/(강릉|속초|동해|gangneung|sokcho)/.test(r)) return 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=1600&auto=format&fit=crop';
    if (/(도쿄|tokyo)/.test(r)) return 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop';
    if (/(오사카|osaka)/.test(r)) return 'https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=1600&auto=format&fit=crop';
    if (/(후쿠오카|fukuoka)/.test(r)) return 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1600&auto=format&fit=crop';
    if (/(파리|paris)/.test(r)) return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop';
    if (/(뉴욕|new york|nyc)/.test(r)) return 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=1600&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop';
  };

  const createBlankPlan = (region = '새 여행지', title = '') => ({
    days: [{ day: 1, plan: [] }],
    places: [],
    maxBudget: 1500000,
    tripRegion: region,
    tripStartDate: '',
    tripEndDate: '',
    planTitle: title || `${region} 여행`,
    planCode: makePlanCode(region, ''),
    share: { visibility: 'private', permission: 'viewer' },
    updatedAt: Date.now(),
  });

  const refreshPlanList = useCallback(async (uid) => {
    if (!uid) return;
    try {
      const snap = await getDocs(collection(db, 'users', uid, 'itinerary'));
      const list = snap.docs.map((d) => {
        const data = d.data() || {};
        return {
          id: d.id,
          title: data.planTitle || `${data.tripRegion || '여행'} 일정`,
          region: data.tripRegion || '',
          planCode: data.planCode || '',
          startDate: data.tripStartDate || '',
          updatedAt: Number(data.updatedAt || 0),
        };
      }).sort((a, b) => b.updatedAt - a.updatedAt);
      setPlanList(list);
    } catch (e) {
      console.error('일정 목록 로드 실패:', e);
    }
  }, []);

  const createNewPlan = async () => {
    if (!user || user.isGuest) {
      setLastAction('게스트 모드에서는 새 일정 생성이 제한됩니다.');
      return;
    }
    const id = `plan_${Date.now()}`;
    const region = newPlanRegion.trim() || '새 여행지';
    const title = newPlanTitle.trim() || `${region} 여행`;
    const payload = createBlankPlan(region, title);
    payload.planCode = makePlanCode(region, payload.tripStartDate || '');
    await setDoc(doc(db, 'users', user.uid, 'itinerary', id), payload);
    await refreshPlanList(user.uid);
    setCurrentPlanId(id);
    setNewPlanRegion('');
    setNewPlanTitle('');
    setShowPlanManager(false);
    setShowEntryChooser(false);
    setLastAction(`'${title}' 일정이 생성되었습니다.`);
  };

  const updateShareConfig = (next) => {
    const normalized = normalizeShare(next);
    setShareSettings(normalized);
    setItinerary(prev => ({ ...prev, share: normalized }));
  };

  const copyShareLink = async () => {
    if (!user || user.isGuest) {
      setLastAction('게스트 모드에서는 공유 링크를 만들 수 없습니다.');
      return;
    }
    const link = buildShareLink(user.uid, currentPlanId);
    try {
      await navigator.clipboard.writeText(link);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1400);
      setLastAction('공유 링크를 복사했습니다.');
    } catch {
      setLastAction(`공유 링크: ${link}`);
    }
  };

  useEffect(() => {
    if (!showPlanOptions) return;
    setPlanOptionRegion(tripRegion || '');
    setPlanOptionStartDate(tripStartDate || '');
    setPlanOptionEndDate(tripEndDate || '');
    setPlanOptionBudget(String(itinerary?.maxBudget || 0));
  }, [showPlanOptions, tripRegion, tripStartDate, tripEndDate, itinerary?.maxBudget]);

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Control') ctrlHeldRef.current = true; };
    const onKeyUp = (e) => { if (e.key === 'Control') ctrlHeldRef.current = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ownerId = params.get('owner');
    const planId = params.get('plan') || 'main';
    if (ownerId) {
      setSharedSource({ ownerId, planId });
      setCurrentPlanId(planId);
    }
  }, []);

  useEffect(() => {
    if (user || !sharedSource?.ownerId) return;
    (async () => {
      setLoading(true);
      try {
        const sharedSnap = await getDoc(doc(db, 'users', sharedSource.ownerId, 'itinerary', sharedSource.planId || 'main'));
        if (!sharedSnap.exists()) {
          setLastAction('공유 일정을 찾을 수 없습니다.');
          setLoading(false);
          return;
        }
        const sharedData = sharedSnap.data();
        const sharedConfig = normalizeShare(sharedData.share || {});
        if (sharedConfig.visibility === 'private') {
          setLastAction('공유가 비공개라 접근할 수 없습니다.');
          setLoading(false);
          return;
        }
        const patchedDays = (sharedData.days || []).map(d => ({
          ...d,
          plan: (d.plan || []).map(p => ({ ...p }))
        }));
        setItinerary({
          days: patchedDays,
          places: sharedData.places || [],
          maxBudget: sharedData.maxBudget || 1500000,
          share: sharedConfig,
          planTitle: sharedData.planTitle || `${sharedData.tripRegion || '공유'} 일정`,
          planCode: sharedData.planCode || makePlanCode(sharedData.tripRegion || '공유', sharedData.tripStartDate || ''),
        });
        setShareSettings(sharedConfig);
        if (sharedData.tripRegion) setTripRegion(sharedData.tripRegion);
        if (typeof sharedData.tripStartDate === 'string') setTripStartDate(sharedData.tripStartDate);
        if (typeof sharedData.tripEndDate === 'string') setTripEndDate(sharedData.tripEndDate);
        setCurrentPlanId(sharedSource.planId || 'main');
        setIsSharedReadOnly(sharedConfig.permission !== 'editor');
      } catch (e) {
        console.error('공유 일정 로드 실패:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, sharedSource]);

  useEffect(() => {
    if (!user || user.isGuest) return;
    void refreshPlanList(user.uid);
  }, [user, refreshPlanList]);

  useEffect(() => {
    if (!user || user.isGuest || loading || isSharedReadOnly) return;
    const timer = setTimeout(() => {
      const patch = {
        planTitle: itinerary.planTitle || `${tripRegion || '여행지'} 일정`,
        planCode: itinerary.planCode || makePlanCodeStable(tripRegion || '여행지', tripStartDate || '', currentPlanId),
        tripRegion: tripRegion || '여행지',
        tripStartDate: tripStartDate || '',
        tripEndDate: tripEndDate || '',
        updatedAt: Date.now(),
      };
      setDoc(doc(db, 'users', user.uid, 'itinerary', currentPlanId || 'main'), patch, { merge: true })
        .then(() => refreshPlanList(user.uid))
        .catch(() => {});
    }, 350);
    return () => clearTimeout(timer);
  }, [user, loading, isSharedReadOnly, currentPlanId, itinerary.planTitle, itinerary.planCode, tripRegion, tripStartDate, tripEndDate, refreshPlanList]);

  useEffect(() => {
    if (!user) {
      entryChooserShownRef.current = false;
      setShowEntryChooser(false);
      return;
    }
    if (user.isGuest) {
      setShowEntryChooser(false);
      return;
    }
    if (sharedSource?.ownerId) {
      setShowEntryChooser(false);
      return;
    }
    if (loading) return;
    if (entryChooserShownRef.current) return;
    entryChooserShownRef.current = true;
    setShowEntryChooser(true);
  }, [user, loading, sharedSource]);

  // 모바일 터치 드래그 — HTML5 DnD는 모바일에서 동작 안 하므로 터치 전용 구현
  useEffect(() => {
    const onTouchMove = (e) => {
      const src = touchDragSourceRef.current;
      if (!src) return;
      const t = e.touches[0];
      if (!isDraggingActiveRef.current) {
        const dx = t.clientX - src.startX;
        const dy = t.clientY - src.startY;
        if (Math.sqrt(dx * dx + dy * dy) < 10) return;
        isDraggingActiveRef.current = true;
        if (src.kind === 'library') setDraggingFromLibrary(src.place);
        else setDraggingFromTimeline(src.payload);
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
      }
      if (isDraggingActiveRef.current) {
        e.preventDefault();
        setDragCoord({ x: t.clientX, y: t.clientY });
        const el = document.elementFromPoint(t.clientX, t.clientY);
        const droptargetEl = el?.closest('[data-droptarget]');
        const dropitemEl = el?.closest('[data-dropitem]');
        const dropdelEl = el?.closest('[data-deletezone]');
        if (droptargetEl) {
          const [dIdx, pIdx] = droptargetEl.dataset.droptarget.split('-').map(Number);
          setDropTarget({ dayIdx: dIdx, insertAfterPIdx: pIdx });
          setDropOnItem(null);
        } else if (dropitemEl) {
          const [dIdx, pIdx] = dropitemEl.dataset.dropitem.split('-').map(Number);
          setDropOnItem({ dayIdx: dIdx, pIdx });
          setDropTarget(null);
        } else {
          setDropTarget(null);
          setDropOnItem(null);
        }
        setIsDroppingOnDeleteZone(!!dropdelEl);
      }
    };
    const onTouchEnd = (e) => {
      const src = touchDragSourceRef.current;
      if (!src) return;
      if (isDraggingActiveRef.current) {
        const t = e.changedTouches[0];
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        executeTouchDropRef.current?.(t.clientX, t.clientY);
      }
      touchDragSourceRef.current = null;
      isDraggingActiveRef.current = false;
      setDraggingFromLibrary(null);
      setDraggingFromTimeline(null);
      setDropTarget(null);
      setDropOnItem(null);
      setIsDroppingOnDeleteZone(false);
    };
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []); // refs + stable setters only

  const endTouchDragLock = () => {};

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
    const conflicts = [];
    (itinerary.days || []).forEach((d, dIdx) => {
      (d.plan || []).forEach((p, pIdx) => {
        if (p?._timingConflict) conflicts.push(`${dIdx}-${pIdx}-${p.id}`);
      });
    });
    if (conflicts.length === 0) {
      conflictAlertKeyRef.current = '';
      return;
    }
    const key = conflicts.join('|');
    if (key === conflictAlertKeyRef.current) return;
    conflictAlertKeyRef.current = key;
    setLastAction('시간 충돌: 고정/잠금 조건으로 자동 계산이 불가한 구간이 있습니다.');
    window.alert('시간 충돌이 발생했습니다.\n소요시간 잠금 또는 시작시간 고정을 일부 해제해 주세요.');
  }, [itinerary.days]);
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

  // 히어로 카드 스크롤 감지 → 컴팩트 플로팅 바 전환 (히스테리시스)
  useEffect(() => {
    const COLLAPSE_AT = -90;
    const EXPAND_AT = -24;
    let ticking = false;

    const evaluate = () => {
      const anchor = heroTriggerRef.current;
      if (!anchor) return;
      const top = anchor.getBoundingClientRect().top;
      setHeroCollapsed((prev) => {
        if (!prev && top <= COLLAPSE_AT) return true;
        if (prev && top >= EXPAND_AT) return false;
        return prev;
      });
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        evaluate();
        ticking = false;
      });
    };
    onScrollOrResize();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
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

  useEffect(() => {
    if (!durationControllerTarget) return;
    const close = () => setDurationControllerTarget(null);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [durationControllerTarget]);


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
  const verifyRouteDurationMins = ({ distanceKm, straightKm, rawDurationMins, isSameAddress }) => {
    const d = Math.max(0, Number(distanceKm) || 0);
    const s = Math.max(0, Number(straightKm) || 0);
    const raw = Math.max(1, Number(rawDurationMins) || 1);
    if (isSameAddress) return raw;

    // 2차 검수: 도심 체감 주행 하한(신호/진출입 포함)
    const byRoadSpeed = Math.ceil((d / 18) * 60); // 18km/h 기준
    const byStraight = Math.ceil((s / 22) * 60); // 직선거리 22km/h 기준
    const signalPenalty = d >= 0.25 ? 3 : 2;
    const shortTripFloor = d >= 0.25 && d < 1.2 ? 6 : (d < 0.25 ? 4 : 0);

    return Math.max(raw, byRoadSpeed + signalPenalty, byStraight + signalPenalty, shortTripFloor);
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
  const hasRestTag = (types = []) => {
    const normalized = (Array.isArray(types) ? types : []).map(v => String(v || '').trim().toLowerCase());
    return normalized.includes('rest') || normalized.includes('휴식');
  };
  const isLodgeStay = (types = []) => {
    const normalized = (Array.isArray(types) ? types : []).map(v => String(v || '').trim().toLowerCase());
    return normalized.includes('lodge') && !hasRestTag(normalized);
  };
  const openNaverPlaceSearch = (name = '', address = '') => {
    const query = `${String(name || '').trim()} ${String(address || '').trim()}`.trim();
    if (!query) return;
    window.open(`https://map.naver.com/v5/search/${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  };
  const openNaverRouteSearch = (fromName = '', fromAddress = '', toName = '', toAddress = '') => {
    const query = `${String(fromName || '').trim()} ${String(fromAddress || '').trim()} ${String(toName || '').trim()} ${String(toAddress || '').trim()} 길찾기`.trim();
    if (!query) return;
    window.open(`https://map.naver.com/v5/search/${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
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
    if (hrs === 24 && mins === 0) return 1440; // 24:00 = 자정 마감 (하루 끝)
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
  const getNavDateLabelForDay = (dayNo) => {
    if (!tripStartDate) return { primary: '날짜 미설정', secondary: '' };
    const dt = new Date(tripStartDate);
    if (Number.isNaN(dt.getTime())) return { primary: '날짜 미설정', secondary: '' };
    dt.setDate(dt.getDate() + ((dayNo || 1) - 1));
    const y = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    const wd = ['일', '월', '화', '수', '목', '금', '토'][dt.getDay()];
    return { primary: `${y}.${mm}.${dd}`, secondary: `${wd}요일` };
  };
  const getBusinessWarning = (item, dayIdx) => {
    const business = normalizeBusiness(item?.business || {});
    const hasBiz = business.open || business.close || business.breakStart || business.breakEnd || business.lastOrder || business.entryClose || business.closedDays.length;
    if (!hasBiz) return '';
    const start = timeToMinutes(item?.time || '00:00');
    const end = start + (item?.duration || 60);
    if (business.open && start < timeToMinutes(business.open)) return `운영 시작 전 방문 (${business.open} 이후 권장)`;
    if (business.close && start >= timeToMinutes(business.close)) return `운영 종료 후 방문 (${business.close} 이전 권장)`;
    if (business.lastOrder && start > timeToMinutes(business.lastOrder)) return `라스트오더 이후 방문 (${business.lastOrder} 이전 권장)`;
    if (business.entryClose && start > timeToMinutes(business.entryClose)) return `입장 마감 이후 방문 (${business.entryClose} 이전 권장)`;
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
  const applyBusinessWarningFix = (dayIdx, pIdx) => {
    saveHistory();
    let applied = false;
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days?.[dayIdx]?.plan?.[pIdx];
      if (!item) return prev;
      const business = normalizeBusiness(item.business || {});
      if (!business.open) return prev;

      const start = timeToMinutes(item.time || '00:00');
      const openMins = timeToMinutes(business.open);
      if (start >= openMins) return prev;

      item.time = business.open;
      item.isTimeFixed = true;
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      recalculateLodgeDurations(nextData.days);
      applied = true;
      return nextData;
    });
    setLastAction(applied ? "운영 시작 시간으로 일정을 보정했습니다." : "보정할 운영 시작 전 경고가 없습니다.");
  };
  const getDropWarning = (place, dIdx, insertAfterPIdx) => {
    if (!place?.business) return '';
    const business = normalizeBusiness(place.business || {});
    const hasBiz = business.open || business.close || business.breakStart || business.breakEnd || business.lastOrder || business.entryClose || business.closedDays.length;
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
    if (business.entryClose && estimatedMins > timeToMinutes(business.entryClose)) return `입장 마감 이후`;
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
    const hasBiz = business.open || business.close || business.breakStart || business.breakEnd || business.lastOrder || business.entryClose || business.closedDays.length;
    if (!hasBiz) return '';
    const { refMins, todayKey } = getActiveRefContext();
    if (business.closedDays.includes(todayKey)) {
      const label = WEEKDAY_OPTIONS.find(d => d.value === todayKey)?.label || todayKey;
      return `${label} 휴무일`;
    }
    if (business.open && refMins < timeToMinutes(business.open)) return `영업 전 (${business.open} 오픈)`;
    if (business.close && refMins >= timeToMinutes(business.close)) return `영업 종료 (${business.close} 마감)`;
    if (business.lastOrder && refMins > timeToMinutes(business.lastOrder)) return `라스트오더 이후 (${business.lastOrder})`;
    if (business.entryClose && refMins > timeToMinutes(business.entryClose)) return `입장 마감 이후 (${business.entryClose})`;
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
    if (business.entryClose) segs.push(`입장마감 ${business.entryClose}`);
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
      if (!isLodgeStay(lastMain.types)) continue;
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

  // 숙소(실숙박) 이후에 같은 Day에 붙어버린 일정을 다음 Day로 자동 분리
  const normalizeDaySplitByLodge = (days) => {
    if (!Array.isArray(days) || days.length === 0) return false;
    let changed = false;

    for (let dIdx = 0; dIdx < days.length; dIdx++) {
      const day = days[dIdx];
      if (!day?.plan || day.plan.length === 0) continue;

      let lastLodgeIdx = -1;
      day.plan.forEach((item, idx) => {
        if (item?.type !== 'backup' && isLodgeStay(item?.types)) lastLodgeIdx = idx;
      });
      if (lastLodgeIdx === -1) continue;
      if (lastLodgeIdx >= day.plan.length - 1) continue;

      const moving = day.plan.splice(lastLodgeIdx + 1);
      if (!moving.length) continue;

      if (!days[dIdx + 1]) {
        days.splice(dIdx + 1, 0, { day: dIdx + 2, plan: [] });
      }
      days[dIdx + 1].plan = [...moving, ...(days[dIdx + 1].plan || [])];
      changed = true;
    }

    if (changed) {
      days.forEach((d, i) => {
        d.day = i + 1;
        if (!Array.isArray(d.plan)) d.plan = [];
      });
    }

    return changed;
  };

  // 실숙박 일정 뒤에 같은 Day 일반 일정이 남아있는지 검사
  const hasInvalidLodgeSplit = (days) => {
    if (!Array.isArray(days) || days.length === 0) return false;
    for (const day of days) {
      if (!Array.isArray(day?.plan) || day.plan.length === 0) continue;
      let lastLodgeIdx = -1;
      day.plan.forEach((item, idx) => {
        if (item?.type !== 'backup' && isLodgeStay(item?.types)) lastLodgeIdx = idx;
      });
      if (lastLodgeIdx !== -1 && lastLodgeIdx < day.plan.length - 1) return true;
    }
    return false;
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
      currentItem._timingConflict = false;
      currentItem._timingConflictReason = '';

      if (currentItem.isTimeFixed) {
        const fixedStartMinutes = timeToMinutes(currentItem.time);
        const requiredArrivalMinutes = fixedStartMinutes - waiting;
        const diff = requiredArrivalMinutes - naturalArrivalMinutes;

        if (diff !== 0 && lastMainItemIndex !== -1) {
          const prevItem = dayPlan[lastMainItemIndex];
          // 페리는 duration 자동 조정 금지 (하선 시간 기준으로 고정)
          // 고정 일정의 60분은 유지 (사용자 수동 리셋/고정 의도 우선)
          if (!prevItem.types?.includes('ship') && !prevItem.isTimeFixed && !prevItem.isDurationFixed) {
            const oldDuration = prevItem.duration || 0;
            // 최소 30분 보장 — 고정 일정 사이에 끼어도 소요시간이 0이 되지 않게
            const newDuration = Math.max(30, oldDuration + diff);
            prevItem.duration = newDuration;
            const actualDiff = newDuration - oldDuration;
            currentEndMinutes += actualDiff;
          } else {
            currentItem._timingConflict = true;
            currentItem._timingConflictReason = '고정/잠금 조건으로 시간 보정 불가';
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

  // 실숙박 일정은 Day 경계를 강제한다.
  useEffect(() => {
    if (!hasInvalidLodgeSplit(itinerary?.days)) return;

    setItinerary(prev => {
      if (!hasInvalidLodgeSplit(prev?.days)) return prev;
      const nextData = JSON.parse(JSON.stringify(prev));
      if (!Array.isArray(nextData.days)) return prev;

      // 연쇄적으로 뒤 Day로 이동할 수 있어 고정점까지 반복
      while (normalizeDaySplitByLodge(nextData.days)) {
        // no-op
      }

      nextData.days.forEach(day => {
        day.plan = recalculateSchedule(day.plan || []);
      });
      recalculateLodgeDurations(nextData.days);
      return nextData;
    });
  }, [itinerary?.days]);

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

  const setDurationValue = (dayIdx, pIdx, minutes) => {
    const nextMinutes = Math.max(0, Number(minutes) || 0);
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];
      item.duration = nextMinutes;
      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });
    setLastAction(`소요 시간을 ${nextMinutes}분으로 설정했습니다.`);
  };

  const toggleDurationLock = (dayIdx, pIdx) => {
    saveHistory();
    let locked = false;
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];
      item.isDurationFixed = !item.isDurationFixed;
      locked = !!item.isDurationFixed;
      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });
    setLastAction(locked ? "소요시간 잠금이 켜졌습니다." : "소요시간 잠금이 해제되었습니다.");
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
    let nextAction = "시작 시간 고정이 해제되었습니다.";
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];

      item.isTimeFixed = !item.isTimeFixed;
      if (item.isTimeFixed) {
        nextAction = "시작 시간이 고정되었습니다.";
        nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      } else {
        nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
        nextAction = "시작 시간 고정이 해제되었습니다.";
      }
      return nextData;
    });
    setLastAction(nextAction);
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
  const updatePlanBusiness = (dayIdx, pIdx, newBusiness) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.days[dayIdx].plan[pIdx].business = normalizeBusiness(newBusiness || {});
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
    const alt = place?.activity
      ? normalizeAlternative(place)
      : toAlternativeFromPlace(place || {});
    saveHistory();
    setItinerary(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const item = next.days[dayIdx].plan[pIdx];
      if (!item.alternatives) item.alternatives = [];
      item.alternatives.push(alt);
      return next;
    });
    setLastAction(`'${alt.activity}'이(가) 플랜 B로 추가되었습니다.`);
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
    setPendingAutoRouteJobs(prev => [...prev, { dayIdx: targetDayIdx, targetIdx: insertAfterPIdx + 1 }]);
  };

  const moveTimelineItem = (targetDayIdx, insertAfterPIdx, sourceDayIdx, sourcePIdx, isCopy) => {
    if (!isCopy && targetDayIdx === sourceDayIdx && insertAfterPIdx === sourcePIdx) return;
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const sourcePlanItem = nextData.days[sourceDayIdx]?.plan?.[sourcePIdx];
      if (!sourcePlanItem) return nextData;

      const itemToMove = deepClone(sourcePlanItem);
      itemToMove.id = `item_${Date.now()}`;
      if (!isCopy) {
        nextData.days[sourceDayIdx].plan.splice(sourcePIdx, 1);
        nextData.days[sourceDayIdx].plan = recalculateSchedule(nextData.days[sourceDayIdx].plan);
        if (targetDayIdx === sourceDayIdx && insertAfterPIdx > sourcePIdx) {
          insertAfterPIdx--;
        }
      }

      nextData.days[targetDayIdx].plan.splice(insertAfterPIdx + 1, 0, itemToMove);
      nextData.days[targetDayIdx].plan = recalculateSchedule(nextData.days[targetDayIdx].plan);
      return nextData;
    });
    setLastAction(isCopy ? "일정을 복사했습니다." : "일정을 이동했습니다.");
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
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);

      return nextData;
    });
    setPendingAutoRouteJobs(prev => [...prev, { dayIdx, targetIdx: pIdx }, { dayIdx, targetIdx: pIdx + 1 }]);
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
    setPendingAutoRouteJobs(prev => [...prev, { dayIdx, targetIdx: pIdx }, { dayIdx, targetIdx: pIdx + 1 }]);
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
      case 'rest': return <div key={type} className={`${style} text-cyan-600 bg-cyan-50 border-cyan-100`}><Hourglass size={10} /> 휴식</div>;
      case 'ship': return <div key={type} className={`${style} text-blue-600 bg-blue-50 border-blue-100`}><Anchor size={10} /> 선박</div>;
      case 'openrun': return <div key={type} className={`${style} text-red-500 bg-red-50 border-red-100`}><Timer size={10} /> 오픈런</div>;
      case 'view': return <div key={type} className={`${style} text-sky-600 bg-sky-50 border-sky-100`}><Eye size={10} /> 뷰맛집</div>;
      case 'experience': return <div key={type} className={`${style} text-emerald-600 bg-emerald-50 border-emerald-100`}><Star size={10} /> 체험</div>;
      case 'souvenir': return <div key={type} className={`${style} text-teal-600 bg-teal-50 border-teal-100`}><Gift size={10} /> 기념품샵</div>;
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
    setPendingAutoRouteJobs(prev => [...prev, { dayIdx, targetIdx: insertIndex + 1 }]);
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

  const fetchKakaoVerifiedRoute = async ({ fromAddress, toAddress, fromName, toName }) => {
    const r = await fetch('/api/route-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromAddress,
        toAddress,
        fromName,
        toName,
        region: tripRegion,
      }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      throw new Error(`kakao verify failed: ${r.status} ${txt.slice(0, 140)}`);
    }
    const data = await r.json();
    if (!Number.isFinite(Number(data?.distanceKm)) || !Number.isFinite(Number(data?.durationMins))) {
      throw new Error('kakao verify invalid payload');
    }
    return {
      distance: +Number(data.distanceKm).toFixed(1),
      durationMins: Math.max(1, Math.round(Number(data.durationMins))),
      provider: data.provider || 'kakao',
      review: data.review || null,
    };
  };

  const autoCalculateRouteFor = async (dayIdx, targetIdx, options = {}) => {
    const silent = !!options.silent;
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
      if (!silent) setLastAction("두 장소의 올바른 주소가 필요합니다.");
      return;
    }

    const key = `${addr1}|${addr2}`;
    if (routeCache[key] && !routeCache[key].failed) {
      const cached = routeCache[key];
      const cachedDistance = Math.max(0.1, Number(cached.distance) || 0.1);
      const verifiedCachedDuration = verifyRouteDurationMins({
        distanceKm: cachedDistance,
        straightKm: cachedDistance,
        rawDurationMins: Number(cached.durationMins) || 1,
        isSameAddress: addr1.trim() === addr2.trim()
      });
      const verifiedCached = { distance: cachedDistance, durationMins: verifiedCachedDuration };
      if (verifiedCached.durationMins !== cached.durationMins) {
        setRouteCache(prev => ({ ...prev, [key]: verifiedCached }));
      }
      applyRoute(dayIdx, targetIdx, verifiedCached);
      return;
    }

    setCalculatingRouteId(`${dayIdx}_${targetIdx}`);
    if (!silent) setLastAction("경로와 거리를 자동 계산 중입니다...");

    try {
      // 1) 카카오 경로 + 검수 우선
      try {
        const kakaoRoute = await fetchKakaoVerifiedRoute({
          fromAddress: addr1,
          toAddress: addr2,
          fromName: prevItem?.activity || '',
          toName: targetItem?.activity || '',
        });
        setRouteCache(prev => ({ ...prev, [key]: kakaoRoute }));
        applyRoute(dayIdx, targetIdx, kakaoRoute);
        if (!silent) setLastAction(`카카오 검수 경로: ${kakaoRoute.distance}km, ${kakaoRoute.durationMins}분`);
        return;
      } catch (kakaoErr) {
        if (!silent) {
          setLastAction("카카오 검수 경로 실패, 대체 경로로 재시도합니다.");
        }
      }

      // 2) 대체(OSRM + 하한 검수)
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
        if (isSuspiciousZero) throw new Error('osrm suspicious near-zero route');
        const baseDistanceKm = osrmDistanceKm;
        const verifiedDurationMins = verifyRouteDurationMins({
          distanceKm: baseDistanceKm,
          straightKm,
          rawDurationMins: osrmDurationMins,
          isSameAddress
        });
        const routeData = {
          distance: +baseDistanceKm.toFixed(1),
          durationMins: verifiedDurationMins
        };
        setRouteCache(prev => ({ ...prev, [key]: routeData }));
        applyRoute(dayIdx, targetIdx, routeData);
        if (!silent) {
          setLastAction(`대체경로 확인: ${routeData.distance}km, ${routeData.durationMins}분`);
        }
      } else {
        throw new Error('osrm route unavailable');
      }
    } catch (e) {
      console.error(e);
      setRouteCache(prev => ({ ...prev, [key]: { failed: true } }));
      if (!silent) setLastAction("자동차 경로 계산 실패: 주소 확인 후 다시 시도해주세요.");
    } finally {
      setCalculatingRouteId(null);
    }
  };

  useEffect(() => {
    if (!pendingAutoRouteJobs.length) return;
    const job = pendingAutoRouteJobs[0];
    setPendingAutoRouteJobs(prev => prev.slice(1));
    const run = async () => {
      await autoCalculateRouteFor(job.dayIdx, job.targetIdx, { silent: true });
      const nextExists = !!itinerary.days?.[job.dayIdx]?.plan?.[job.targetIdx + 1];
      if (nextExists) {
        await autoCalculateRouteFor(job.dayIdx, job.targetIdx + 1, { silent: true });
      }
    };
    void run();
  }, [itinerary, pendingAutoRouteJobs]);

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
    if (isSharedReadOnly) return;
    if (user.isGuest) {
      safeLocalStorageSet('guest_itinerary', JSON.stringify(itinerary));
      return;
    }
    const timer = setTimeout(() => {
      const payload = {
        ...itinerary,
        tripRegion,
        tripStartDate,
        tripEndDate,
        planTitle: itinerary.planTitle || `${tripRegion || '여행'} 일정`,
        planCode: itinerary.planCode || makePlanCode(tripRegion || '여행', tripStartDate || ''),
        share: normalizeShare(itinerary.share || shareSettings),
        updatedAt: Date.now(),
      };
      setDoc(doc(db, 'users', user.uid, 'itinerary', currentPlanId || 'main'), payload)
        .catch(e => console.error('Firestore 저장 실패:', e));
    }, 1000);
    return () => clearTimeout(timer);
  }, [itinerary, loading, user, currentPlanId, tripRegion, tripStartDate, tripEndDate, isSharedReadOnly, shareSettings]);

  // Firestore 로드 (사용자 UID 기준 + 마이그레이션 로직)
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      setIsSharedReadOnly(false);
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
        if (sharedSource?.ownerId && sharedSource.ownerId !== user.uid) {
          const sharedSnap = await getDoc(doc(db, 'users', sharedSource.ownerId, 'itinerary', sharedSource.planId || 'main'));
          if (sharedSnap.exists()) {
            const sharedData = sharedSnap.data();
            const sharedConfig = normalizeShare(sharedData.share || {});
            if (sharedConfig.visibility === 'private') {
              setLastAction('공유가 비공개라 접근할 수 없습니다.');
              setLoading(false);
              return;
            }
            const patchedDays = (sharedData.days || []).map(d => ({
              ...d,
              plan: (d.plan || []).map(p => ({ ...p }))
            }));
            setItinerary({
              days: patchedDays,
              places: sharedData.places || [],
              maxBudget: sharedData.maxBudget || 1500000,
              share: sharedConfig,
              planTitle: sharedData.planTitle || `${sharedData.tripRegion || '공유'} 일정`,
              planCode: sharedData.planCode || makePlanCode(sharedData.tripRegion || '공유', sharedData.tripStartDate || ''),
            });
            setShareSettings(sharedConfig);
            if (sharedData.tripRegion) setTripRegion(sharedData.tripRegion);
            if (typeof sharedData.tripStartDate === 'string') setTripStartDate(sharedData.tripStartDate);
            if (typeof sharedData.tripEndDate === 'string') setTripEndDate(sharedData.tripEndDate);
            setCurrentPlanId(sharedSource.planId || 'main');
            setIsSharedReadOnly(sharedConfig.permission !== 'editor');
            setLoading(false);
            return;
          }
        }

        // 1. 먼저 내 고유 데이터가 있는지 확인
        const targetPlanId = currentPlanId || 'main';
        const snap = await getDoc(doc(db, 'users', user.uid, 'itinerary', targetPlanId));
        let finalData = null;

        if (snap.exists()) {
          finalData = snap.data();
        } else {
          // 2. 고유 데이터가 없다면, 기존에 공용으로 쓰던 데이터가 있는지 확인
          if (targetPlanId === 'main') {
            const commonSnap = await getDoc(doc(db, 'itinerary', 'main'));
            if (commonSnap.exists()) {
              finalData = commonSnap.data();
              // 3. 공용 데이터를 찾았다면, 내 계정으로 즉시 복사 (마이그레이션)
              await setDoc(doc(db, 'users', user.uid, 'itinerary', 'main'), finalData);
              console.log('기존 데이터를 내 계정으로 성공적으로 가져왔습니다.');
            }
          } else {
            finalData = createBlankPlan(newPlanRegion || tripRegion || '새 여행지');
            await setDoc(doc(db, 'users', user.uid, 'itinerary', targetPlanId), finalData);
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
          setItinerary({
            days: patchedDays,
            places: finalData.places || [],
            maxBudget: finalData.maxBudget || 1500000,
            share: normalizeShare(finalData.share || {}),
            planTitle: finalData.planTitle || `${finalData.tripRegion || tripRegion || '여행'} 일정`,
            planCode: finalData.planCode || makePlanCode(finalData.tripRegion || tripRegion || '여행', finalData.tripStartDate || ''),
          });
          setShareSettings(normalizeShare(finalData.share || {}));
          if (finalData.tripRegion) setTripRegion(finalData.tripRegion);
          if (typeof finalData.tripStartDate === 'string') setTripStartDate(finalData.tripStartDate);
          if (typeof finalData.tripEndDate === 'string') setTripEndDate(finalData.tripEndDate);
          if (!user.isGuest) await refreshPlanList(user.uid);
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
      if (!user.isGuest) await refreshPlanList(user.uid);
      setLoading(false);
    })();
  }, [user, currentPlanId, refreshPlanList, sharedSource]);

  if (authLoading) return (
    <div className="min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#3182F6]/20 border-t-[#3182F6] rounded-full animate-spin" />
      <div className="font-black text-slate-400 text-sm animate-pulse">본인 인증 확인 중...</div>
    </div>
  );

  if (!user && !sharedSource?.ownerId) {
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

  if (!itinerary) return null;

  const isOwnerSession = !!user && !user.isGuest && (!sharedSource?.ownerId || sharedSource.ownerId === user.uid);
  const canManagePlan = isOwnerSession && !isSharedReadOnly;

  // 터치 드래그 드롭 실행 — 매 렌더마다 최신 클로저로 갱신
  executeTouchDropRef.current = (x, y) => {
    const src = touchDragSourceRef.current;
    if (!src) return;
    const el = document.elementFromPoint(x, y);
    const droptargetEl = el?.closest('[data-droptarget]');
    const dropitemEl = el?.closest('[data-dropitem]');
    const droplibEl = el?.closest('[data-library-dropzone]');
    const dropdelEl = el?.closest('[data-deletezone]');
    if (src.kind === 'library') {
      const p = src.place;
      if (droptargetEl) {
        const [dIdx, pIdx] = droptargetEl.dataset.droptarget.split('-').map(Number);
        addNewItem(dIdx, pIdx, p.types, p);
        removePlace(p.id);
      } else if (dropitemEl) {
        const [dIdx, pIdx] = dropitemEl.dataset.dropitem.split('-').map(Number);
        addPlaceAsPlanB(dIdx, pIdx, p);
        removePlace(p.id);
      }
    } else if (src.kind === 'timeline') {
      const payload = src.payload;
      if (droplibEl) {
        if (payload.altIdx !== undefined) {
          dropAltOnLibrary(payload.dayIdx, payload.pIdx, payload.altIdx);
        } else {
          const item = itinerary.days?.[payload.dayIdx]?.plan?.[payload.pIdx];
          dropTimelineItemOnLibrary(payload.dayIdx, payload.pIdx, askPlanBMoveMode(item));
        }
      } else if (dropdelEl && payload.altIdx === undefined) {
        deletePlanItem(payload.dayIdx, payload.pIdx);
      } else if (droptargetEl) {
        const [dIdx, pIdx] = droptargetEl.dataset.droptarget.split('-').map(Number);
        if (payload.altIdx !== undefined) {
          insertAlternativeToTimeline(dIdx, pIdx, payload.dayIdx, payload.pIdx, payload.altIdx);
        } else {
          moveTimelineItem(dIdx, pIdx, payload.dayIdx, payload.pIdx, false);
        }
      } else if (dropitemEl && payload.altIdx === undefined) {
        const [dIdx, pIdx] = dropitemEl.dataset.dropitem.split('-').map(Number);
        const sourcePlanItem = itinerary.days?.[payload.dayIdx]?.plan?.[payload.pIdx];
        if (sourcePlanItem && (payload.dayIdx !== dIdx || payload.pIdx !== pIdx)) {
          addPlaceAsPlanB(dIdx, pIdx, toAlternativeFromItem(sourcePlanItem));
          deletePlanItem(payload.dayIdx, payload.pIdx);
        }
      }
    }
  };

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
                  <div className="mt-2">
                    <BusinessHoursEditor
                      business={editPlaceDraft.business || {}}
                      onChange={(b) => setEditPlaceDraft(d => ({ ...d, business: b }))}
                    />
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
        style={{
          left: isMobileLayout ? (col1Collapsed ? 12 : Math.max(8, leftSidebarWidth - 6)) : leftSidebarWidth,
          transform: isMobileLayout ? 'translateY(-50%)' : 'translateX(-50%) translateY(-50%)'
        }}
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
        style={{
          right: isMobileLayout ? (col2Collapsed ? 12 : Math.max(8, rightSidebarWidth - 6)) : (col2Collapsed ? 44 : 310),
          transform: isMobileLayout ? 'translateY(-50%)' : 'translateX(50%) translateY(-50%)'
        }}
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
        style={{ width: leftSidebarWidth }}
      >
        {col1Collapsed ? (
          <div className="flex-1 flex items-center justify-center">
            <MapIcon size={14} className="text-slate-300" />
          </div>
        ) : (
          <>
            {/* ── 고정 헤더 ── */}
            <div className="px-5 pt-5 pb-3 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2.5 flex-1 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <MapIcon size={14} className="text-[#3182F6]" />
                </div>
                <h2 className="text-[14px] font-black text-slate-800 tracking-tight flex-1">일정 안내</h2>
                <button
                  onClick={autoCalculateAllRoutes}
                  disabled={isCalculatingAllRoutes}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#3182F6] text-[11px] font-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Navigation size={11} />
                  {isCalculatingAllRoutes ? '탐색중...' : '전체경로'}
                </button>
              </div>
            </div>
            {/* ── 스크롤 컨텐츠 ── */}
            <div className="flex-1 overflow-y-auto overscroll-none no-scrollbar py-6 px-5 flex flex-col">
              <nav className="flex flex-col gap-6 relative -ml-2">
                {itinerary.days?.map((d, dNavIdx) => (
                  <div key={d.day} className={`rounded-2xl border p-2.5 transition-all ${activeDay === d.day ? 'border-blue-200 bg-blue-50/40' : 'border-slate-100 bg-white'}`}>
                    <div className={`rounded-xl border px-2.5 py-2 mb-2 ${activeDay === d.day ? 'border-blue-200 bg-white' : 'border-slate-100 bg-slate-50/70'}`}>
                      <div className={`rounded-lg border px-2 py-1.5 ${activeDay === d.day ? 'border-blue-200 bg-blue-50/50' : 'border-slate-100 bg-white/80'}`}>
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => handleNavClick(d.day)}
                            className={`text-[14px] tracking-tight transition-colors duration-300 whitespace-nowrap ${activeDay === d.day ? 'text-[#3182F6] font-black' : 'text-slate-700 font-black hover:text-slate-900'}`}
                          >
                            {getNavDateLabelForDay(d.day).primary}
                          </button>
                          <span className={`text-[10px] font-black rounded-md px-1.5 py-0.5 leading-none ${activeDay === d.day ? 'text-[#3182F6] bg-white border border-blue-200' : 'text-slate-400 bg-slate-50 border border-slate-200'}`}>
                            {getNavDateLabelForDay(d.day).secondary || '요일'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-1.5" />
                    <div className="flex flex-col gap-0.5">
                      {(d.plan || []).filter(p => p.type !== 'backup').map((p, pIdx, arr) => {
                        const isActive = activeItemId === p.id;
                        const navBizWarn = !p.types?.includes('ship') ? getBusinessWarning(p, dNavIdx) : '';
                        return (
                          <button
                            key={p.id}
                            onClick={() => handleNavClick(d.day, p.id)}
                            className={`grid grid-cols-[2.2rem_1fr_auto] items-center gap-1 px-1.5 py-1 rounded-lg text-left transition-all ${isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                          >
                            <span className={`text-[10px] tabular-nums leading-none ${isActive ? 'font-black text-[#3182F6]' : 'font-bold text-slate-400'}`}>{p.time || '--:--'}</span>
                            <div className="min-w-0 flex items-center gap-1.5">
                              <div className={`shrink-0 scale-90 origin-left transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>{getCategoryBadge((p.types?.[0]) || p.type || 'place')}</div>
                              <span className={`text-[10px] truncate leading-none ${isActive ? 'font-black text-[#3182F6]' : 'font-bold text-slate-500'}`}>{p.activity}</span>
                              {(p.alternatives?.length || 0) > 0 && (
                                <span className={`shrink-0 text-[8px] leading-none px-1.5 py-0.5 rounded border ${isActive ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-amber-500 bg-amber-50/70 border-amber-200/80'}`}>
                                  B {p.alternatives.length}
                                </span>
                              )}
                            </div>
                            {!p.types?.includes('ship') && (() => {
                              const isLastLodge = isLodgeStay(p.types) && pIdx === arr.length - 1;
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
                                <div className="shrink-0 flex items-center gap-1">
                                  {navBizWarn && <span className="w-1.5 h-1.5 rounded-full bg-red-400" title={navBizWarn} />}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openNaverPlaceSearch(p.activity, p.receipt?.address || p.address || '');
                                    }}
                                    className={`text-[8px] font-black rounded px-1 py-px leading-none whitespace-nowrap ${dispDur >= 120 ? 'text-orange-400 bg-orange-50 border border-orange-200 hover:bg-orange-100' : 'text-slate-300 hover:text-[#3182F6]'}`}
                                    title="네이버 지도에서 장소 검색"
                                  >
                                    {fmtDur(dispDur)}
                                  </button>
                                </div>
                              );
                            })()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* ── 하단 고정: 사용자 정보 & 로그아웃 버튼 ── */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 mt-auto">
              {canManagePlan && (
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <button
                    onClick={() => setShowPlanManager(true)}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-black text-slate-500 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                  >
                    목록보기
                  </button>
                  <button
                    onClick={() => setShowShareManager(true)}
                    className="px-2 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-[10px] font-black text-[#3182F6] hover:bg-blue-100 transition-colors"
                  >
                    공유하기
                  </button>
                </div>
              )}
              {user ? (
                <div className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                    {user.photoURL ? <img src={user.photoURL} alt="User" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center"><UserIcon size={12} className="text-slate-400" /></div>}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[11px] font-black text-slate-700 truncate">{user.displayName || '사용자'}</span>
                  </div>
                  {!user.isGuest ? (
                    <button onClick={handleLogout} className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all" title="로그아웃">
                      <LogOut size={12} />
                    </button>
                  ) : (
                    <button onClick={handleLogin} className="px-2 py-1 rounded-lg text-[10px] font-black text-[#3182F6] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors" title="로그인">
                      로그인
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-500">공유 보기 모드</span>
                  <button onClick={handleLogin} className="px-2 py-1 rounded-lg text-[10px] font-black text-[#3182F6] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors" title="로그인">
                    로그인
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div
        className="flex flex-col fixed top-0 bottom-0 bg-white/80 backdrop-blur-3xl border-l border-slate-100/60 z-[140] shadow-[-8px_0_32px_rgba(0,0,0,0.02)] transition-all duration-300 overflow-hidden"
        style={{ right: 0, width: rightSidebarWidth }}
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
              className="flex-1 overflow-y-auto overscroll-none no-scrollbar px-5 pt-4 pb-8 flex flex-col"
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
                // 필터링 적용: 기준 일정이 있으면 영업 상태와 무관하게 거리순 유지
                let visiblePlaces = [...distanceSortedPlaces];

                if (placeFilterTags.length > 0) {
                  visiblePlaces = visiblePlaces.filter(p => {
                    const pTags = p.types || [];
                    return placeFilterTags.some(ft => pTags.includes(ft));
                  });
                }
                const categoryCounts = (distanceSortedPlaces || []).reduce((acc, place) => {
                  const tags = Array.isArray(place?.types) ? place.types : [];
                  tags.forEach((tag) => {
                    acc[tag] = (acc[tag] || 0) + 1;
                  });
                  return acc;
                }, {});
                return (
                  <div className="flex flex-col gap-1.5 overflow-y-auto overscroll-none no-scrollbar flex-1 items-center min-h-0">
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
                              <span>{t.label}</span>
                              <span className={`ml-1 px-1 rounded text-[8px] font-black ${active ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {categoryCounts[t.value] || 0}
                              </span>
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
                          <span className="truncate flex-1"><span className="text-blue-700">{basePlanRef.name}</span> 기준 거리순 정렬</span>
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
                      const bizSummary = formatBusinessSummary(place.business);
                      const hasBizSummary = bizSummary !== '미설정';
                      const openStatus = isOpenAt(place.business); // true=영업중, false=마감, null=정보없음
                      const baseDistance = placeDistanceMap[place.id];


                      return (
                        <div
                          key={place.id}
                          draggable
                          onTouchStart={(e) => {
                            const targetEl = e.target instanceof Element ? e.target : null;
                            if (targetEl?.closest('input,button,a,textarea,[contenteditable],[data-no-drag]')) return;
                            touchDragSourceRef.current = { kind: 'library', place, startX: e.touches[0].clientX, startY: e.touches[0].clientY };
                            isDraggingActiveRef.current = false;
                          }}
                          onDragStart={(e) => {
                            const copy = ctrlHeldRef.current;
                            const targetEl = e.target instanceof Element ? e.target : null;
                            const isInteractiveTarget = !!targetEl?.closest('input, button, a, textarea, [contenteditable="true"], [data-no-drag="true"]');
                            if (isInteractiveTarget) { e.preventDefault(); return; }
                            desktopDragRef.current = { kind: 'library', place, copy };
                            e.dataTransfer.effectAllowed = copy ? 'copy' : 'move';
                            try {
                              e.dataTransfer.setData('text/plain', `library:${place.id || place.name || 'item'}`);
                            } catch (_) { /* noop */ }
                            requestAnimationFrame(() => {
                              setDraggingFromLibrary(place);
                              setIsDragCopy(copy);
                            });
                          }}
                          onDragEnd={() => { desktopDragRef.current = null; setDraggingFromLibrary(null); setDropTarget(null); setDropOnItem(null); setIsDragCopy(false); }}
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
                          <div className="p-4 flex flex-col gap-2.5">
                            <div className="flex items-center gap-1.5 flex-wrap pr-12 cursor-pointer" data-no-drag="true" onClick={(e) => { e.stopPropagation(); setEditingPlaceId(place.id); setEditPlaceDraft({ ...place, address: place.address || place.receipt?.address || '', business: normalizeBusiness(place.business || {}), receipt: deepClone(place.receipt || { address: place.address || '', items: [] }), showBusinessEditor: !!(place.business?.open || place.business?.close || place.business?.breakStart || place.business?.breakEnd || place.business?.lastOrder || place.business?.entryClose || place.business?.closedDays?.length) }); }}>
                              {chips}
                              {baseDistance != null && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200 bg-blue-50 text-blue-600">
                                  {baseDistance}km
                                </span>
                              )}
                            </div>
                            <span className="text-[22px] font-black text-slate-800 leading-tight break-words whitespace-normal">{place.name}</span>
                            {place.address && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); openNaverPlaceSearch(place.name, place.address); }}
                                className="flex items-center gap-2 text-slate-500 bg-slate-50 w-full px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:border-[#3182F6]/50 hover:bg-blue-50/40 transition-colors text-left"
                                title="네이버 지도에서 장소 검색"
                              >
                                <MapPin size={11} className="text-[#3182F6] shrink-0" />
                                <span className="text-[10px] font-bold break-words whitespace-normal">{place.address}</span>
                              </button>
                            )}
                            <div
                              className={`w-full px-2.5 py-1 rounded-lg border text-[10px] font-bold break-words whitespace-normal cursor-pointer transition-all hover:shadow-sm ${bizWarningNow ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-[#3182F6]/40 hover:bg-blue-50/40 hover:text-[#3182F6]'}`}
                              data-no-drag="true"
                              onClick={(e) => {
                                e.stopPropagation();
                                const hasBiz = place.business?.open || place.business?.close || place.business?.breakStart || place.business?.breakEnd || place.business?.lastOrder || place.business?.entryClose || place.business?.closedDays?.length;
                                const bizDefaults = hasBiz ? normalizeBusiness(place.business || {}) : { ...DEFAULT_BUSINESS };
                                setEditingPlaceId(place.id);
                                setEditPlaceDraft({ ...place, address: place.address || place.receipt?.address || '', business: bizDefaults, receipt: deepClone(place.receipt || { address: place.address || '', items: [] }), showBusinessEditor: true });
                              }}
                            >
                              {bizWarningNow
                                ? `주의 · ${hasBizSummary ? bizSummary : '영업 정보 미설정'}`
                                : (hasBizSummary ? bizSummary : '영업 정보 미설정')}
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
                          {/* 호버 버튼: 수정 + 삭제 */}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPlaceId(place.id);
                                setEditPlaceDraft({
                                  ...place,
                                  address: place.address || place.receipt?.address || '',
                                  business: normalizeBusiness(place.business || {}),
                                  receipt: deepClone(place.receipt || { address: place.address || '', items: [] }),
                                  showBusinessEditor: !!(place.business?.open || place.business?.close || place.business?.breakStart || place.business?.breakEnd || place.business?.lastOrder || place.business?.entryClose || place.business?.closedDays?.length)
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

      <div className="flex-1 flex flex-col items-center w-full bg-slate-50 min-h-screen" style={{ marginLeft: isMobileLayout ? 0 : leftSidebarWidth, marginRight: isMobileLayout ? 0 : (col2Collapsed ? 44 : 300) }}>
        {/* 일정 목록 */}
        <div className="w-full px-4 pt-8 pb-32">
          {isSharedReadOnly && (
            <div className={`mx-auto mb-3 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-[11px] font-black text-amber-700 ${isCompactTimeline ? 'max-w-[500px]' : 'max-w-[560px]'}`}>
              공유 일정 보기 모드입니다. (편집 권한 없음)
            </div>
          )}

          {showEntryChooser && !user?.isGuest && !sharedSource?.ownerId && (
            <>
              <div className="fixed inset-0 z-[270] bg-black/25 backdrop-blur-[1px]" />
              <div className="fixed z-[271] inset-0 flex items-center justify-center p-4">
                <div className="w-[min(640px,94vw)] bg-white border border-slate-200 rounded-3xl shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[16px] font-black text-slate-800">일정 선택</p>
                    <button
                      onClick={() => setShowEntryChooser(false)}
                      className="text-slate-400 hover:text-slate-600"
                      title="닫기"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold mb-3">
                    로그인 후에는 먼저 기존 일정을 고르거나 새 일정을 만들 수 있습니다.
                  </p>
                  <div className="mb-3">
                    <input
                      value={newPlanRegion}
                      onChange={(e) => setNewPlanRegion(e.target.value)}
                      placeholder="도시 (예: 부산)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                    />
                  </div>
                  <button
                    onClick={() => { void createNewPlan(); }}
                    className="w-full mb-3 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black"
                  >
                    새 일정 생성
                  </button>
                  <div className="max-h-[52vh] overflow-y-auto">
                    {(planList || []).length === 0 ? (
                      <p className="text-[11px] text-slate-400 font-bold p-3">기존 일정이 없습니다. 새 일정을 생성하세요.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(planList || []).map((plan) => {
                          const meta = resolvePlanMetaForCard(plan);
                          return (
                            <button
                              key={plan.id}
                              onClick={() => {
                                setCurrentPlanId(plan.id);
                                setShowEntryChooser(false);
                                setLastAction(`'${meta.title}' 일정을 열었습니다.`);
                              }}
                              className={`relative overflow-hidden rounded-2xl border text-left min-h-[130px] transition-all hover:-translate-y-0.5 ${currentPlanId === plan.id ? 'border-[#3182F6] ring-2 ring-[#3182F6]/20' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                              <img
                                src={getRegionCoverImage(meta.region)}
                                alt="plan cover"
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55" />
                              <div className="relative z-10 p-3 flex flex-col gap-1 text-white">
                                <p className="text-[14px] font-black truncate">{meta.region}</p>
                                {meta.startDate && (
                                  <p className="text-[10px] font-bold text-white/80">{meta.startDate.replace(/-/g, '.')}</p>
                                )}
                                {meta.code && meta.code !== 'main' && (
                                  <p className="text-[10px] font-black text-white/95 tracking-wide">{meta.code}</p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {showPlanManager && (
            <>
              <div className="fixed inset-0 z-[260] bg-black/20" onClick={() => setShowPlanManager(false)} />
              <div className="fixed z-[261] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(560px,92vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[14px] font-black text-slate-800">일정 관리 (도시별 예시)</p>
                  <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowPlanManager(false)}><X size={16} /></button>
                </div>
                <div className="mb-3">
                  <input
                    value={newPlanRegion}
                    onChange={(e) => setNewPlanRegion(e.target.value)}
                    placeholder="도시 (예: 부산)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                  />
                </div>
                <button
                  onClick={() => { void createNewPlan(); }}
                  className="w-full mb-3 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black"
                >
                  새 도시 일정 만들기
                </button>
                <div className="max-h-[52vh] overflow-y-auto">
                  {(planList || []).length === 0 ? (
                    <p className="text-[11px] text-slate-400 font-bold p-3">생성된 일정이 없습니다.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(planList || []).map((plan) => {
                        const meta = resolvePlanMetaForCard(plan);
                        return (
                          <button
                            key={plan.id}
                            onClick={() => {
                              setCurrentPlanId(plan.id);
                              setShowPlanManager(false);
                              setLastAction(`'${meta.title}' 일정으로 전환했습니다.`);
                            }}
                            className={`relative overflow-hidden rounded-2xl border text-left min-h-[130px] transition-all hover:-translate-y-0.5 ${currentPlanId === plan.id ? 'border-[#3182F6] ring-2 ring-[#3182F6]/20' : 'border-slate-200 hover:border-slate-300'}`}
                          >
                            <img
                              src={getRegionCoverImage(meta.region)}
                              alt="plan cover"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55" />
                            <div className="relative z-10 p-3 flex flex-col gap-1 text-white">
                              <p className="text-[14px] font-black truncate">{meta.region}</p>
                              {meta.startDate && (
                                <p className="text-[10px] font-bold text-white/80">{meta.startDate.replace(/-/g, '.')}</p>
                              )}
                              {meta.code && meta.code !== 'main' && (
                                <p className="text-[10px] font-black text-white/95 tracking-wide">{meta.code}</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {showPlanOptions && (
            <>
              <div className="fixed inset-0 z-[260] bg-black/20" onClick={() => setShowPlanOptions(false)} />
              <div className="fixed z-[261] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(460px,92vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[14px] font-black text-slate-800">일정 옵션</p>
                  <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowPlanOptions(false)}><X size={16} /></button>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 mb-1">여행지</p>
                    <input
                      value={planOptionRegion}
                      onChange={(e) => setPlanOptionRegion(e.target.value)}
                      placeholder="여행지"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-1">시작일</p>
                      <input
                        type="date"
                        value={planOptionStartDate}
                        onChange={(e) => setPlanOptionStartDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-1">종료일</p>
                      <input
                        type="date"
                        value={planOptionEndDate}
                        onChange={(e) => setPlanOptionEndDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 mb-1">총 예산</p>
                    <input
                      type="number"
                      value={planOptionBudget}
                      onChange={(e) => setPlanOptionBudget(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => {
                      setShowPlanOptions(false);
                      setShowPlanManager(true);
                    }}
                    className="flex-1 py-2 rounded-xl border border-slate-200 bg-white text-[11px] font-black text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                  >
                    목록 열기
                  </button>
                  <button
                    onClick={() => {
                      setTripRegion(String(planOptionRegion || '').trim());
                      setTripStartDate(planOptionStartDate || '');
                      setTripEndDate(planOptionEndDate || '');
                      setItinerary(prev => ({ ...prev, maxBudget: Number(planOptionBudget) || 0 }));
                      setShowPlanOptions(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black"
                  >
                    완료
                  </button>
                </div>
              </div>
            </>
          )}

          {showShareManager && (
            <>
              <div className="fixed inset-0 z-[260] bg-black/20" onClick={() => setShowShareManager(false)} />
              <div className="fixed z-[261] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(460px,92vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[14px] font-black text-slate-800">공유 범위 / 편집 권한</p>
                  <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowShareManager(false)}><X size={16} /></button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <select
                    value={shareSettings.visibility}
                    onChange={(e) => updateShareConfig({ ...shareSettings, visibility: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                  >
                    <option value="private">비공개</option>
                    <option value="link">링크 소지자 공개</option>
                    <option value="public">공개</option>
                  </select>
                  <select
                    value={shareSettings.permission}
                    onChange={(e) => updateShareConfig({ ...shareSettings, permission: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                  >
                    <option value="viewer">보기만</option>
                    <option value="editor">편집 가능</option>
                  </select>
                </div>
                <button
                  onClick={() => { void copyShareLink(); }}
                  className="w-full py-2 rounded-xl border border-blue-200 bg-blue-50 text-[#3182F6] text-[11px] font-black hover:bg-blue-100 transition-colors"
                >
                  {shareCopied ? '복사됨' : '공유 링크 복사'}
                </button>
                <p className="text-[10px] text-slate-400 font-bold mt-2">
                  링크에는 현재 플랜 ID가 포함됩니다. (예: 다른 도시 일정 분리 공유)
                </p>
              </div>
            </>
          )}

          <div ref={heroTriggerRef} className="h-px w-full" />

          {/* ── 여행 헤더 카드 ── */}
          {(() => {
            const tripDays = (tripStartDate && tripEndDate)
              ? Math.max(1, Math.round((new Date(tripEndDate) - new Date(tripStartDate)) / 86400000) + 1)
              : (itinerary.days?.length || 0);
            const tripNights = Math.max(0, tripDays - 1);
            const usedPct = MAX_BUDGET > 0 ? Math.min(100, Math.round((budgetSummary.total / MAX_BUDGET) * 100)) : 0;
            const allSummaryItems = (itinerary.days || []).flatMap((day) => (day.plan || []))
              .filter((item) => item && item.type !== 'backup' && !item.types?.includes('ship'));
            const revisitCount = allSummaryItems.filter((item) => (typeof item.revisit === 'boolean' ? item.revisit : isRevisitCourse(item))).length;
            const newCount = Math.max(0, allSummaryItems.length - revisitCount);
            const revisitPct = allSummaryItems.length > 0 ? Math.round((revisitCount / allSummaryItems.length) * 100) : 0;
            const newPct = allSummaryItems.length > 0 ? Math.round((newCount / allSummaryItems.length) * 100) : 0;
            const categorySpendMap = allSummaryItems.reduce((acc, item) => {
              const types = Array.isArray(item.types) ? item.types : [];
              const baseType = types.find((t) => !MODIFIER_TAGS.has(t) && t !== 'place') || types.find((t) => !MODIFIER_TAGS.has(t)) || 'place';
              acc[baseType] = (acc[baseType] || 0) + (Number(item.price) || 0);
              return acc;
            }, {});
            const totalCategorySpend = Object.values(categorySpendMap).reduce((sum, v) => sum + Number(v || 0), 0);
            const categorySpendRows = Object.entries(categorySpendMap)
              .map(([key, value]) => {
                const tag = TAG_OPTIONS.find((t) => t.value === key);
                const label = tag?.label || key;
                const amount = Number(value) || 0;
                const pct = totalCategorySpend > 0 ? Math.round((amount / totalCategorySpend) * 100) : 0;
                return { key, label, amount, pct };
              })
              .sort((a, b) => b.amount - a.amount);
            return (
              <div className="mb-8 relative">
                {/* 컴팩트 플로팅 바 (스크롤 시) */}
                {heroCollapsed && (
                  <div
                    className="fixed top-0 z-[190] pointer-events-none"
                    style={{ left: isMobileLayout ? 12 : leftSidebarWidth, right: isMobileLayout ? 12 : (col2Collapsed ? 44 : 300) }}
                  >
                    <div className="w-full bg-white/96 backdrop-blur-2xl border-b border-slate-200/90 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.5)] pointer-events-auto min-h-[88px] px-4 py-2.5 flex flex-col justify-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                          <MapPin size={11} className="text-[#3182F6]" />
                        </div>
                        <span className="text-[13px] font-black text-slate-800 truncate flex-1">{tripRegion || '여행지'}</span>
                        <span className="text-[11px] font-black text-slate-400 shrink-0 tabular-nums">
                          {(tripStartDate && tripEndDate)
                            ? `${tripStartDate.slice(5).replace('-', '.')}~${tripEndDate.slice(5).replace('-', '.')}`
                            : `${tripNights}박 ${tripDays}일`}
                        </span>
                        {canManagePlan && <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setShowPlanOptions(true)}
                            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors flex items-center justify-center"
                            title="일정 옵션"
                          >
                            <SlidersHorizontal size={13} />
                          </button>
                          <button
                            onClick={() => setShowShareManager(true)}
                            className="w-8 h-8 rounded-lg border border-blue-200 bg-blue-50 text-[#3182F6] hover:bg-blue-100 transition-colors flex items-center justify-center"
                            title="공유 설정"
                          >
                            <Share2 size={13} />
                          </button>
                        </div>}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#3182F6] to-indigo-500 rounded-full" style={{ width: `${usedPct}%` }} />
                        </div>
                        <span className="text-[11px] font-black text-slate-500 tabular-nums shrink-0">{usedPct}%</span>
                        <span className="text-[14px] font-black text-[#3182F6] tabular-nums tracking-tight shrink-0">₩{budgetSummary.remaining.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 풀 카드 (최상단) */}
                {!heroCollapsed && (
                  <section className="mb-10 px-4 mt-6">
                    <div className={`mx-auto rounded-[40px] relative overflow-hidden bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100/80 ${isCompactTimeline ? 'max-w-[500px]' : 'max-w-[560px]'}`}>
                      {canManagePlan && <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                        <button
                          onClick={() => setShowPlanOptions(true)}
                          className="w-10 h-10 rounded-xl border border-white/40 bg-white/85 backdrop-blur text-slate-700 hover:border-[#3182F6]/50 hover:text-[#3182F6] transition-colors flex items-center justify-center"
                          title="일정 옵션"
                        >
                          <SlidersHorizontal size={16} />
                        </button>
                        <button
                          onClick={() => setShowShareManager(true)}
                          className="w-10 h-10 rounded-xl border border-blue-200 bg-blue-50/90 backdrop-blur text-[#3182F6] hover:bg-blue-100 transition-colors flex items-center justify-center"
                          title="공유 설정"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>}
                      {/* 🖼️ 배경 이미지 (절반 높이) */}
                      <div className="absolute top-0 left-0 w-full h-[52%] overflow-hidden pointer-events-none">
                        <img
                          src={getRegionCoverImage(tripRegion)}
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

                            <button
                              type="button"
                              onClick={() => setHeroSummaryExpanded(v => !v)}
                              className="mt-4 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[10px] font-black text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors flex items-center gap-1.5"
                            >
                              여행 요약 확장
                              <ChevronDown size={12} className={`transition-transform ${heroSummaryExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            {heroSummaryExpanded && (
                              <div className="mt-3 w-full p-3 rounded-2xl border border-slate-200 bg-white/85 text-left">
                                <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">신규 / 재방문 비율 비교</p>
                                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                                  <div className="h-full bg-emerald-400" style={{ width: `${newPct}%` }} />
                                  <div className="h-full bg-blue-400" style={{ width: `${revisitPct}%` }} />
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-2">
                                    <p className="text-[9px] font-black text-emerald-600">신규</p>
                                    <p className="text-[14px] font-black text-emerald-700 tabular-nums">{newCount}개 ({newPct}%)</p>
                                  </div>
                                  <div className="rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-2">
                                    <p className="text-[9px] font-black text-blue-600">재방문</p>
                                    <p className="text-[14px] font-black text-blue-700 tabular-nums">{revisitCount}개 ({revisitPct}%)</p>
                                  </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-slate-200">
                                  <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">카테고리별 지출 비율</p>
                                  {categorySpendRows.length === 0 ? (
                                    <p className="text-[10px] font-bold text-slate-400">지출 데이터가 없습니다.</p>
                                  ) : (
                                    <div className="space-y-1.5">
                                      {categorySpendRows.map((row) => (
                                        <div key={row.key} className="rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-black text-slate-700">{row.label}</span>
                                            <span className="text-[10px] font-black text-[#3182F6] tabular-nums">₩{row.amount.toLocaleString()} · {row.pct}%</span>
                                          </div>
                                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-[#3182F6] to-indigo-500" style={{ width: `${row.pct}%` }} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            );
          })()}
          <div className={`w-full mx-auto flex flex-col relative z-0 ${isCompactTimeline ? 'max-w-[500px] gap-4' : 'max-w-[560px] gap-6'}`}>

            {itinerary.days?.map((d, dIdx) => d.plan?.map((p, pIdx) => {
              const isExpanded = expandedId === p.id;
              let stateStyles;
              if (isLodgeStay(p.types)) stateStyles = 'bg-white border-slate-300 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.08)]';
              else if (p.types?.includes('ship')) stateStyles = 'bg-[#f4fafe] border-blue-200 shadow-[0_8px_24px_-8px_rgba(29,78,216,0.12)]';
              else if (p.isTimeFixed) stateStyles = 'bg-white border-[#3182F6]/40 shadow-[0_10px_30px_-8px_rgba(49,130,246,0.12)] ring-1 ring-[#3182F6]/15';
              else stateStyles = 'bg-white border-slate-200 shadow-[0_8px_24px_-10px_rgba(15,23,42,0.10)] hover:shadow-[0_12px_28px_-10px_rgba(15,23,42,0.14)] hover:border-slate-300';

              const chips = p.types ? p.types.map(t => getCategoryBadge(t)) : (p.type ? [getCategoryBadge(p.type)] : []);
              const isLodge = isLodgeStay(p.types);
              const isShip = p.types?.includes('ship');
              const businessWarning = !isShip ? getBusinessWarning(p, dIdx) : '';
              const planBCount = p.alternatives?.length || 0;
              const hasPlanB = planBCount > 0;
              // 스마트 락(숙소 자동 계산) 여부 확인
              const isAutoLocked = p.isAutoDuration;
              const isDurationLocked = !!p.isDurationFixed || isAutoLocked;
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
                  data-plan-id={p.id}
                  className={`relative group transition-all duration-300 ${highlightedItemId === p.id ? 'scale-[1.02]' : ''}`}
                >
                  {d.day > 1 && pIdx === 0 && (
                    <div className="flex items-center justify-center py-3 w-full">
                      <div className="flex items-center bg-slate-50/95 px-3 py-1.5 rounded-full border border-slate-300 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.45)] gap-2">
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
                        <button
                          type="button"
                          className="flex items-center gap-1 text-slate-400 text-xs font-bold hover:text-[#3182F6] transition-colors"
                          title="클릭하여 네이버 길찾기 열기"
                          onClick={(e) => {
                            e.stopPropagation();
                            let prevItem;
                            if (pIdx === 0 && dIdx > 0) {
                              const prevDayPlan = itinerary.days[dIdx - 1]?.plan || [];
                              prevItem = prevDayPlan[prevDayPlan.length - 1];
                            } else {
                              prevItem = d.plan?.[pIdx - 1];
                            }
                            const fromAddr = getRouteAddress(prevItem, 'from');
                            const toAddr = getRouteAddress(p, 'to');
                            if (!fromAddr || !toAddr) {
                              setLastAction("길찾기용 출발/도착 주소가 필요합니다.");
                              return;
                            }
                            openNaverRouteSearch(prevItem?.activity || '출발지', fromAddr, p.activity || '도착지', toAddr);
                          }}
                        >
                          <MapIcon size={11} />
                          <span>{formatDistanceText(p.distance)}</span>
                        </button>
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
                        <div className="absolute top-1 bottom-1 -left-10 z-0 flex items-stretch">
                          <div className="w-9 h-full rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.45)] flex items-center justify-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); cyclePlan(-1); }}
                              className="pointer-events-auto w-7 h-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-[#3182F6] hover:border-[#3182F6] transition-all"
                              title="이전 플랜"
                            ><ChevronLeft size={14} /></button>
                          </div>
                        </div>
                        <div className="absolute top-1 bottom-1 -right-10 z-0 flex items-stretch">
                          <div className="w-9 h-full rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.45)] flex items-center justify-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); cyclePlan(1); }}
                              className="pointer-events-auto w-7 h-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-[#3182F6] hover:border-[#3182F6] transition-all"
                              title="다음 플랜"
                            ><ChevronRight size={14} /></button>
                          </div>
                        </div>
                      </>
                    )}
                    <div
                      data-dropitem={`${dIdx}-${pIdx}`}
                      draggable
                      onTouchStart={(e) => {
                        const targetEl = e.target instanceof Element ? e.target : null;
                        if (targetEl?.closest('input,button,a,textarea,[contenteditable],[data-no-drag]')) return;
                        const payload = { dayIdx: dIdx, pIdx, altIdx: planPos > 0 ? planPos - 1 : undefined };
                        touchDragSourceRef.current = { kind: 'timeline', payload, startX: e.touches[0].clientX, startY: e.touches[0].clientY };
                        isDraggingActiveRef.current = false;
                      }}
                      onDragStart={(e) => {
                        const copy = ctrlHeldRef.current;
                        const targetEl = e.target instanceof Element ? e.target : null;
                        const isInteractiveTarget = !!targetEl?.closest('input, button, a, textarea, [contenteditable="true"], [data-no-drag="true"]');
                        if (isInteractiveTarget) { e.preventDefault(); return; }
                        const payload = { dayIdx: dIdx, pIdx, altIdx: planPos > 0 ? planPos - 1 : undefined };
                        desktopDragRef.current = { kind: 'timeline', payload, copy };
                        e.dataTransfer.effectAllowed = copy ? 'copy' : 'move';
                        try {
                          e.dataTransfer.setData('text/plain', `timeline:${p.id || `${dIdx}-${pIdx}`}`);
                        } catch (_) { /* noop */ }
                        requestAnimationFrame(() => {
                          setIsDragCopy(copy);
                          setDraggingFromTimeline(payload);
                        });
                      }}
                      onDragEnd={() => { desktopDragRef.current = null; setDraggingFromTimeline(null); setIsDragCopy(false); endTouchDragLock(); }}
                      onDragOver={(e) => {
                        if ((draggingFromLibrary || draggingFromTimeline) && p.type !== 'backup') {
                          e.preventDefault(); e.stopPropagation();
                          setDropOnItem({ dayIdx: dIdx, pIdx });
                        }
                      }}
                      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropOnItem(null); }}
                      onDrop={(e) => {
                        if (dropOnItem?.dayIdx === dIdx && dropOnItem?.pIdx === pIdx) {
                          e.preventDefault(); e.stopPropagation();
                          if (draggingFromLibrary) {
                            addPlaceAsPlanB(dIdx, pIdx, draggingFromLibrary);
                            if (!isDragCopy) removePlace(draggingFromLibrary.id);
                          } else if (draggingFromTimeline && draggingFromTimeline.altIdx === undefined) {
                            const sourcePlanItem = itinerary.days[draggingFromTimeline.dayIdx]?.plan?.[draggingFromTimeline.pIdx];
                            if (sourcePlanItem && (draggingFromTimeline.dayIdx !== dIdx || draggingFromTimeline.pIdx !== pIdx)) {
                              addPlaceAsPlanB(dIdx, pIdx, toAlternativeFromItem(sourcePlanItem));
                              if (!isDragCopy) {
                                deletePlanItem(draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx);
                              }
                            }
                          }
                          setDraggingFromLibrary(null); setDraggingFromTimeline(null); setDropOnItem(null); setIsDragCopy(false);
                        }
                      }}
                      className={`relative z-10 w-full flex flex-col border rounded-[24px] transition-all overflow-hidden cursor-grab active:cursor-grabbing group ${draggingFromTimeline?.dayIdx === dIdx && draggingFromTimeline?.pIdx === pIdx ? 'opacity-50 pointer-events-none scale-[0.99]' : ''} ${dropOnItem?.dayIdx === dIdx && dropOnItem?.pIdx === pIdx ? 'ring-2 ring-[#3182F6] ring-offset-2 ring-offset-[#F2F4F6]' : ''} ${hasPlanB ? 'ring-1 ring-amber-100' : ''} ${stateStyles}`}
                      onClick={() => toggleReceipt(p.id)}
                    >
                      {/* Plan B 페이지 인디케이터 */}
                      {hasPlanB && (
                        <div className="absolute top-2 right-2 z-20 pointer-events-none">
                          <span className="text-[11px] font-black px-2 py-1 rounded-lg border min-w-[44px] text-center text-slate-500 bg-white/95 border-slate-200 shadow-[0_8px_16px_-10px_rgba(15,23,42,0.35)]">
                            {planPos + 1}/{totalPlans}
                          </span>
                        </div>
                      )}
                      <div className="flex items-stretch border-b border-slate-100 border-dashed">

                        {/* 🟢 좌측 컨트롤 타워 */}
                        {!isShip && !isLodge && <div className={`relative flex flex-col items-center justify-center gap-2 shrink-0 ${isCompactTimeline ? 'w-[94px] sm:w-[6.5rem] py-3 px-1.5 sm:px-2' : 'w-[110px] sm:w-[9rem] py-4 px-2 sm:px-3'} ${p.isTimeFixed ? 'bg-blue-50/20' : 'bg-transparent'} border-r border-slate-100 flex-none overflow-visible transition-all duration-300`}>
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
                            <div className={`flex items-center justify-between w-[90%] bg-white px-2 py-1.5 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border my-1 transition-colors ${isDurationLocked ? 'border-orange-200/80' : 'border-slate-100/60'}`} onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  if (isDurationLocked) { setLastAction(isAutoLocked ? '자동 연동 일정은 소요시간을 변경할 수 없습니다.' : '소요시간 잠금이 켜져 있습니다.'); return; }
                                  updateDuration(dIdx, pIdx, -TIME_UNIT);
                                }}
                                className={`w-4 sm:w-5 h-5 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors shrink-0 ${isDurationLocked ? 'text-orange-300' : 'text-slate-400 hover:text-blue-500'}`}
                              ><Minus size={10} /></button>
                              <span
                                className={`text-[12px] whitespace-nowrap font-extrabold tabular-nums ${isAutoLocked ? 'cursor-not-allowed text-orange-500' : (p.isDurationFixed ? 'cursor-pointer text-orange-500 hover:underline' : 'cursor-pointer hover:underline text-slate-600 hover:text-blue-600')}`}
                                onClick={(e) => {
                                  if (isAutoLocked) {
                                    setLastAction('자동 연동 일정은 소요시간 컨트롤러를 열 수 없습니다.');
                                    return;
                                  }
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const popW = 184;
                                  const popH = 104;
                                  const safeLeft = Math.min(
                                    window.innerWidth - popW - 12,
                                    Math.max(12, rect.left + rect.width / 2 - popW / 2)
                                  );
                                  // 소요시간 칩과 겹치도록 상단에 오버레이 배치
                                  const preferredTop = rect.top - 18;
                                  const safeTop = Math.max(8, Math.min(window.innerHeight - popH - 8, preferredTop));
                                  setDurationControllerTarget(prev =>
                                    (prev?.dayIdx === dIdx && prev?.pIdx === pIdx)
                                      ? null
                                      : { dayIdx: dIdx, pIdx, left: safeLeft, top: safeTop }
                                  );
                                }}
                                title="소요시간 컨트롤러 열기"
                              >{fmtDur(p.duration)}</span>
                              <button
                                onClick={() => {
                                  if (isDurationLocked) { setLastAction(isAutoLocked ? '자동 연동 일정은 소요시간을 변경할 수 없습니다.' : '소요시간 잠금이 켜져 있습니다.'); return; }
                                  updateDuration(dIdx, pIdx, TIME_UNIT);
                                }}
                                className={`w-4 sm:w-5 h-5 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors shrink-0 ${isDurationLocked ? 'text-orange-300' : 'text-slate-400 hover:text-blue-500'}`}
                              ><Plus size={10} /></button>
                            </div>
                          )}
                          {!isDurationLocked && durationControllerTarget?.dayIdx === dIdx && durationControllerTarget?.pIdx === pIdx && (
                            <div
                              className="fixed z-[140] w-[184px] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_14px_32px_-12px_rgba(15,23,42,0.25)] p-2"
                              style={{ left: durationControllerTarget.left, top: durationControllerTarget.top }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                className="w-full mb-2 py-1 rounded-lg border border-dashed border-slate-300 bg-white/40 text-center text-[11px] font-black text-slate-700"
                                title="현재 소요 시간"
                              >
                                {fmtDur(p.duration)}
                              </div>
                              <div className="grid grid-cols-3 gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => { setDurationValue(dIdx, pIdx, 10); setDurationControllerTarget(null); }}
                                  className="py-1 rounded-lg bg-blue-50 border border-blue-200 text-[10px] font-black text-[#3182F6] hover:bg-blue-100"
                                >
                                  10분
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setDurationValue(dIdx, pIdx, 30); setDurationControllerTarget(null); }}
                                  className="py-1 rounded-lg bg-blue-50 border border-blue-200 text-[10px] font-black text-[#3182F6] hover:bg-blue-100"
                                >
                                  30분
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setDurationValue(dIdx, pIdx, 60); setDurationControllerTarget(null); }}
                                  className="py-1 rounded-lg bg-blue-50 border border-blue-200 text-[10px] font-black text-[#3182F6] hover:bg-blue-100"
                                >
                                  60분
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => { toggleDurationLock(dIdx, pIdx); setDurationControllerTarget(null); }}
                                className={`mt-2 w-full py-1 rounded-lg border text-[10px] font-black transition-colors ${p.isDurationFixed ? 'border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#3182F6] hover:text-[#3182F6]'}`}
                              >
                                {p.isDurationFixed ? '소요시간 잠금 해제' : '소요시간 잠그기'}
                              </button>
                            </div>
                          )}

                        </div>}

                        {/* 🟢 우측 정보 영역 */}
                        <div className={`flex-1 min-w-0 flex flex-col justify-start gap-2 ${isCompactTimeline ? 'p-2.5 sm:p-3' : 'p-3 sm:p-4'}`}>
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
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); openNaverPlaceSearch(p.activity, p.receipt?.address || p.address || ''); }}
                                className="flex items-center gap-2 text-slate-500 bg-white w-fit max-w-full px-2 py-1 rounded-lg border border-slate-200 shadow-sm hover:border-[#3182F6]/50 hover:bg-blue-50/40 transition-colors text-left"
                                title="네이버 지도에서 장소 검색"
                              >
                                <MapPin size={12} className="text-[#3182F6] shrink-0" />
                                <span className="text-[11px] font-bold truncate">{p.receipt?.address || '주소 정보 없음'}</span>
                              </button>
                              <div className="flex gap-2">
                                {/* 체크인 셀 */}
                                <div className="relative overflow-hidden flex-1 bg-indigo-50/70 rounded-xl border border-indigo-100 p-3 flex flex-col items-center justify-center gap-1 min-h-[96px]">
                                  <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[56px] font-black tracking-[0.08em] text-indigo-200/55 select-none">IN</span>
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
                                <div className="relative overflow-hidden flex-1 bg-violet-50/70 rounded-xl border border-violet-100 p-3 flex flex-col items-center justify-center gap-1 min-h-[96px]">
                                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[52px] font-black tracking-[0.06em] text-violet-200/55 select-none">OUT</span>
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
                                  className={`flex items-center gap-1 flex-wrap cursor-grab active:cursor-grabbing rounded-lg px-1 py-0.5 -ml-1 transition-colors ${tagEditorTarget?.dayIdx === dIdx && tagEditorTarget?.pIdx === pIdx ? 'bg-blue-50 ring-1 ring-[#3182F6]/30' : 'hover:bg-slate-100/60'}`}
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openNaverPlaceSearch(p.activity, p.receipt?.address || p.address || '');
                                      }}
                                      title="네이버 지도에서 장소 검색"
                                      className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                                    >
                                      <MapIcon size={9} />
                                    </button>
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
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (businessWarning.includes('운영 시작 전 방문')) {
                                      applyBusinessWarningFix(dIdx, pIdx);
                                    }
                                  }}
                                  className="w-full px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 text-red-600 text-[10px] font-black text-left hover:bg-red-100/80 transition-colors"
                                  title={businessWarning.includes('운영 시작 전 방문') ? '클릭하면 운영 시작 시간으로 보정합니다.' : undefined}
                                >
                                  {businessWarning}
                                </button>
                              )}
                              {p._timingConflict && (
                                <div
                                  className="w-full px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-black text-left"
                                  title="고정/잠금 조건 때문에 자동 보정이 불가능한 구간입니다."
                                >
                                  시간 충돌: 고정/잠금 조건으로 자동 계산 불가
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
                                  <div className="mt-1.5">
                                    <p className="text-[9px] text-slate-400 font-semibold mb-1.5">현재 일정 시간과 충돌하면 위에 빨간 경고가 표시됩니다.</p>
                                    <BusinessHoursEditor
                                      business={p.business || {}}
                                      onChange={(b) => updatePlanBusiness(dIdx, pIdx, b)}
                                    />
                                  </div>
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
                                      <input type="number" value={m.price} onChange={(e) => { e.stopPropagation(); updateMenuData(dIdx, pIdx, mIdx, 'price', e.target.value); }} onClick={(e) => e.stopPropagation()} className="w-16 text-right font-bold text-slate-500 bg-transparent border-none outline-none focus:border-b focus:border-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                                        <button onClick={(e) => { e.stopPropagation(); updateMenuData(dIdx, pIdx, mIdx, 'qty', -1); }}><Minus size={10} /></button>
                                        <span className="w-4 text-center text-[10px]">{getMenuQty(m)}</span>
                                        <button onClick={(e) => { e.stopPropagation(); updateMenuData(dIdx, pIdx, mIdx, 'qty', 1); }}><Plus size={10} /></button>
                                      </div>
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
                  {pIdx === d.plan.length - 1 && p.type !== 'backup' && (draggingFromLibrary || draggingFromTimeline !== null) && (() => {
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
                          } else if (draggingFromTimeline && draggingFromTimeline.altIdx === undefined) {
                            moveTimelineItem(dIdx, pIdx, draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, isDragCopy);
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
                  {pIdx < d.plan.length - 1 && (
                    <div className="flex items-center pt-3 pb-0 -mb-3 relative w-full">
                      {(() => {
                        const nextItem = d.plan[pIdx + 1];
                        if (!nextItem) return null;

                        if (draggingFromLibrary || draggingFromTimeline !== null) {
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
                                } else if (draggingFromTimeline && draggingFromTimeline.altIdx === undefined) {
                                  moveTimelineItem(dIdx, pIdx, draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, isDragCopy);
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
                            <div className="my-2 flex items-center bg-slate-50/95 px-3 py-1.5 rounded-full border border-slate-300 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.45)] gap-2">
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
                                type="button"
                                className="flex items-center gap-1 text-slate-400 text-xs font-bold hover:text-[#3182F6] transition-colors"
                                title="구간 거리"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const prevAddr = getRouteAddress(p, 'from');
                                  const toAddr = getRouteAddress(nextItem, 'to');
                                  if (!prevAddr || !toAddr) {
                                    setLastAction("길찾기용 출발/도착 주소가 필요합니다.");
                                    return;
                                  }
                                  openNaverRouteSearch(p.activity || '출발지', prevAddr, nextItem.activity || '도착지', toAddr);
                                }}
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
