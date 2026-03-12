/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, no-useless-escape */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { db, auth, messaging } from './firebase';
import { PlaceAddForm } from './components/place/PlaceAddForm';
import { PlaceEditorCard, PlaceLibraryCard } from './components/place/PlaceCards';
import { getToken, onMessage } from 'firebase/messaging';
import updateLog from './update-log.json';
import { collection, doc, getDoc, getDocs, setDoc, query, limit } from 'firebase/firestore';
import { onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import {
  Navigation, MessageSquare, LogOut, User as UserIcon,
  Hourglass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  ArrowUpRight, ArrowUpLeft, ArrowDownRight, ArrowDownLeft,
  PlusCircle, Waves, QrCode, CheckSquare, Square,
  Plus, Minus, MapPin, Trash2, Map as MapIcon,
  ChevronsRight, Sparkles, Wand2, CornerDownRight, GitBranch, Umbrella, ArrowLeftRight, Store, Lock, Unlock, ChevronLeft, ChevronRight, Timer, Anchor, Utensils, Coffee, Camera, Bed, MoonStar, ChevronDown, ChevronUp, Package, Eye, Star, Pencil, Edit3, Calendar, GripVertical, Gift, X, Share2, SlidersHorizontal, Move, LoaderCircle, Info
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

const normalizeGeoPoint = (raw = {}, fallbackAddress = '') => {
  const address = String(raw?.address || fallbackAddress || '').trim();
  const lat = Number(raw?.lat);
  const lon = Number(raw?.lon);
  const source = String(raw?.source || '').trim();
  const updatedAt = String(raw?.updatedAt || '').trim();
  if (!address && !Number.isFinite(lat) && !Number.isFinite(lon)) return null;
  return {
    address,
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
    source,
    updatedAt: updatedAt || null,
  };
};

const hasGeoCoords = (geo) => Number.isFinite(Number(geo?.lat)) && Number.isFinite(Number(geo?.lon));

const isGeoStaleForAddress = (geo, address = '') => {
  const normalizedAddress = String(address || '').trim();
  if (!normalizedAddress) return false;
  const current = normalizeGeoPoint(geo, normalizedAddress);
  if (!current) return true;
  return current.address !== normalizedAddress || !hasGeoCoords(current);
};

const makePushTokenDocId = (token = '') => encodeURIComponent(String(token || '').trim()).slice(0, 1500);

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
  { label: '페리', types: ['ship'], Icon: Anchor, className: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100' },
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
  { label: '숙박', value: 'stay' },
  { label: '페리', value: 'ship' },
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
  const customTags = list
    .filter(t => !MODIFIER_TAGS.has(t) && !TAG_VALUES.has(t))
    .map(t => String(t || '').trim())
    .filter(Boolean);
  const unique = [...new Set(catTags)].slice(0, 2);
  const uniqueCustom = [...new Set(customTags)];
  if (unique.length === 0 && uniqueCustom.length === 0 && modifiers.length === 0) return ['place'];
  return [...unique, ...modifiers, ...uniqueCustom];
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
const OrderedTagPicker = ({ value = ['place'], onChange, title = '태그', className = '' }) => {
  const selected = normalizeTagOrder(value);
  const [customInput, setCustomInput] = React.useState('');
  const [isAddingCustom, setIsAddingCustom] = React.useState(false);
  const inputRef = React.useRef(null);

  const handleAddCustom = () => {
    const val = customInput.trim();
    if (val && !selected.includes(val)) {
      onChange(normalizeTagOrder([...selected, val]));
    }
    setCustomInput('');
    setIsAddingCustom(false);
  };

  const predefinedValues = new Set(TAG_OPTIONS.map(v => v.value));
  const activeTags = selected.filter(v => v !== 'place');
  const customTags = activeTags.filter(v => !predefinedValues.has(v));

  React.useEffect(() => {
    if (isAddingCustom && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingCustom]);

  return (
    <div className={className}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5">{title}</p>
      <div className="flex flex-wrap gap-1.5 items-center">
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
            {t}
          </button>
        ))}

        {!isAddingCustom ? (
          <button
            type="button"
            onClick={() => setIsAddingCustom(true)}
            className="w-6 h-6 flex items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400 hover:text-[#3182F6] hover:border-[#3182F6] hover:bg-blue-50 transition-all"
            title="커스텀 태그 추가"
          >
            <Plus size={12} />
          </button>
        ) : (
          <div className="flex items-center gap-1 animate-in zoom-in-95 duration-200">
            <input
              ref={inputRef}
              type="text"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); handleAddCustom(); }
                if (e.key === 'Escape') { setIsAddingCustom(false); setCustomInput(''); }
              }}
              onBlur={() => { if (!customInput.trim()) setIsAddingCustom(false); }}
              placeholder="태그 입력"
              className="w-20 px-2 py-0.5 rounded-lg text-[10px] font-black border border-[#3182F6] bg-white outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="text-[10px] font-bold text-[#3182F6] px-1"
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
const getCustomTagLabel = (tag) => String(tag || '').trim();
const ACTION_SLOT_CLASS = 'shrink-0 flex items-center justify-end gap-1 min-w-[3.25rem]';

const SharedNameRow = ({
  value,
  onChange,
  onFocus,
  onKeyDown,
  onPaste,
  autoFocus = false,
  placeholder,
  actionButton = null,
  readOnly = false,
  onContainerClick,
}) => (
  <div className="w-full flex items-center gap-2 text-slate-500 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-all focus-within:border-[#3182F6]/50" onClick={onContainerClick}>
    <input
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      autoFocus={autoFocus}
      readOnly={readOnly}
      className="flex-1 bg-transparent text-[13px] font-black text-slate-800 truncate leading-tight focus:outline-none min-w-0"
      placeholder={placeholder}
    />
    {actionButton ? <div className={ACTION_SLOT_CLASS}>{actionButton}</div> : null}
  </div>
);
const SharedAddressRow = ({
  value,
  onChange,
  placeholder = '주소 정보 없음',
  leading = null,
  actions = null,
  onContainerClick,
}) => (
  <div className="flex items-center gap-2 text-slate-500 bg-white w-full px-2 py-1 rounded-lg border border-slate-200 shadow-sm" onClick={onContainerClick}>
    {leading}
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="flex-1 min-w-0 bg-transparent border-none outline-none text-[11px] font-bold text-slate-600 placeholder:text-slate-300"
    />
    {actions ? <div className={ACTION_SLOT_CLASS}>{actions}</div> : null}
  </div>
);
const SharedBusinessRow = ({
  summary,
  placeholder = '영업 정보 (선택)',
  onToggle,
  actionButton = null,
  expanded = null,
  onContainerClick,
  quickEditSegments = null,
  onQuickEdit = null,
}) => (
  <div className="w-full bg-slate-50/60 border border-slate-200 rounded-lg py-1.5 px-2.5" onClick={onContainerClick}>
    <div className="w-full flex items-center gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.(e);
        }}
        className="flex-1 flex items-center gap-2 text-left min-w-0"
      >
        {summary === '미설정' || !summary ? (
          <span className="text-[10px] font-bold text-slate-400">{placeholder}</span>
        ) : quickEditSegments?.length && onQuickEdit ? (
          <span className="text-[10px] font-bold text-slate-600 truncate flex-1 flex items-center gap-1 flex-wrap">
            {quickEditSegments.map((segment, idx) => (
              <React.Fragment key={`${segment.fieldKey}-${idx}`}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickEdit(segment.fieldKey);
                  }}
                  className="hover:text-[#3182F6] transition-colors"
                >
                  {segment.label}
                </button>
                {idx < quickEditSegments.length - 1 && <span className="text-slate-300">·</span>}
              </React.Fragment>
            ))}
          </span>
        ) : (
          <span className="text-[10px] font-bold text-slate-600 truncate flex-1">{summary}</span>
        )}
      </button>
      {actionButton ? <div className={ACTION_SLOT_CLASS}>{actionButton}</div> : null}
    </div>
    {expanded}
  </div>
);
const SharedMemoRow = ({ value, onChange, placeholder = '메모를 입력하세요...', onContainerClick, readOnly = false }) => (
  <div onClick={onContainerClick}>
    <input
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-medium text-slate-600 outline-none placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all"
      placeholder={placeholder}
    />
  </div>
);
const MenuPriceInput = ({ value = 0, onCommit, className = '', onClick = null }) => {
  const normalizedValue = Number(value) || 0;
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftValue, setDraftValue] = React.useState('');

  React.useEffect(() => {
    if (!isEditing) {
      setDraftValue(String(normalizedValue || ''));
    }
  }, [normalizedValue, isEditing]);

  return (
    <input
      type="text"
      inputMode="numeric"
      value={isEditing ? draftValue : String(normalizedValue || '')}
      placeholder={isEditing ? String(normalizedValue || 0) : ''}
      onFocus={(e) => {
        setIsEditing(true);
        setDraftValue('');
        requestAnimationFrame(() => e.target.select());
      }}
      onChange={(e) => setDraftValue(e.target.value.replace(/[^\d]/g, ''))}
      onBlur={() => {
        if (draftValue.trim() !== '') {
          onCommit(Number(draftValue) || 0);
        }
        setIsEditing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
        if (e.key === 'Escape') {
          setDraftValue(String(normalizedValue || ''));
          setIsEditing(false);
          e.currentTarget.blur();
        }
      }}
      onClick={onClick}
      className={className}
    />
  );
};
const SharedTotalFooter = ({ expanded, onToggle, total }) => (
  <div
    onClick={onToggle}
    className={`mt-auto px-5 py-3.5 flex items-center justify-between cursor-pointer transition-all ${expanded ? 'bg-blue-50/50 border-t border-blue-100/60' : 'bg-[#FAFBFC] hover:bg-slate-50/80'}`}
  >
    <div className="flex flex-col gap-0.5 text-left">
      <span className="text-[10px] text-slate-400 font-extrabold tracking-[0.15em] flex items-center gap-1.5">
        TOTAL <ChevronDown size={12} className={`transition-transform duration-300 ${expanded ? 'rotate-180 text-[#3182F6]' : ''}`} />
      </span>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-[21px] font-black tabular-nums transition-colors ${expanded ? 'text-[#3182F6]' : 'text-slate-800'}`}>
        ₩{Number(total || 0).toLocaleString()}
      </span>
    </div>
  </div>
);
const createPlaceEditorDraft = (place = {}, overrides = {}) => {
  const business = normalizeBusiness(overrides.business ?? place.business ?? {});
  const cloneValue = (value) => JSON.parse(JSON.stringify(value));

  const rawReceipt = overrides.receipt ?? place.receipt ?? { address: overrides.address ?? place.address ?? '', items: [] };
  const receipt = cloneValue(rawReceipt);

  if (!Array.isArray(receipt.items)) receipt.items = [];
  receipt.items = receipt.items
    .filter(Boolean)
    .map((item) => ({
      name: String(item?.name || '').trim(),
      price: Number(item?.price) || 0,
      qty: Math.max(1, Number(item?.qty) || 1),
      selected: item?.selected !== false,
    }));

  return {
    ...place,
    ...overrides,
    name: overrides.name ?? place.name ?? '',
    address: overrides.address ?? place.address ?? place.receipt?.address ?? '',
    memo: overrides.memo ?? place.memo ?? '',
    types: normalizeTagOrder(Array.isArray(overrides.types ?? place.types) && (overrides.types ?? place.types).length ? (overrides.types ?? place.types) : ['place']),
    business,
    receipt: {
      ...receipt,
      address: overrides.receipt?.address ?? overrides.address ?? place.receipt?.address ?? place.address ?? '',
    },
    showBusinessEditor: overrides.showBusinessEditor ?? true,
    businessFocusField: overrides.businessFocusField ?? null,
  };
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
const formatClosedDaysSummary = (closedDays = []) => {
  const labels = closedDays
    .map((value) => WEEKDAY_OPTIONS.find((day) => day.value === value)?.label || String(value || '').trim())
    .filter(Boolean);
  if (!labels.length) return '';
  return labels.join(' ');
};
const EMPTY_BUSINESS = { open: '', close: '', breakStart: '', breakEnd: '', lastOrder: '', entryClose: '', closedDays: [] };
// 터치 시 나오는 시간 컨트롤러 프리셋 (필드별)
const BUSINESS_PRESETS = {
  open: ['06:00', '08:00', '09:00', '10:00', '10:30', '11:00'],
  close: ['19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
  breakStart: ['12:00', '13:00', '14:00', '15:00'],
  breakEnd: ['13:00', '14:00', '15:00', '16:00', '17:00'],
  lastOrder: ['19:30', '20:00', '20:30', '21:00', '21:30'],
  entryClose: ['18:00', '19:00', '20:00', '20:30'],
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
  // HH:MM or HH시 MM분 or HH시
  // Improved regex for Korean time patterns
  const re = /(\d{1,2})\s*[:시]\s*(\d{1,2})?\s*분?/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const hh = m[1];
    const mm = m[2] || '00';
    // Case like "12시 0분에" -> catch MM correctly
    const t = normalizeTimeToken(`${hh}:${mm}`);
    if (t) out.push(t);
  }
  // If nothing found or to be extra safe, try digit + 시
  if (out.length === 0) {
    const re2 = /(\d{1,2})\s*시/g;
    while ((m = re2.exec(text)) !== null) {
      const t = normalizeTimeToken(`${m[1]}:00`);
      if (t) out.push(t);
    }
  }
  return [...new Set(out)]; // Remove duplicates from the same line if any
};
// 붙여넣기 예시:
// 10:30 - 22:00
// 15:00 - 17:00 브레이크타임
// 21:00 라스트오더
const parseBusinessHoursText = (text = '') => {
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

    // 요일별 휴무 표기: "일 정기휴무", "월 휴무", ...
    if (dayMatch && /(휴무|정기휴무|휴점|정기\s*휴일)/i.test(lower)) {
      const dayKey = weekdayMap[dayMatch[1]];
      if (dayKey && !parsed.closedDays.includes(dayKey)) parsed.closedDays.push(dayKey);
      return;
    }
    // 문장형 휴무 표기: "매주 일요일 휴무", "정기휴무(매주 일요일)"
    if (/(휴무|정기휴무|휴점|정기\s*휴일)/i.test(lower)) {
      const dayChars = [...new Set((line.match(/[월화수목금토일]/g) || []))];
      dayChars.forEach((dc) => {
        const dayKey = weekdayMap[dc];
        if (dayKey && !parsed.closedDays.includes(dayKey)) parsed.closedDays.push(dayKey);
      });
    }

    // 요일별 운영시간 표기: "월 10:00 - 17:30"
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

  // 요요일별 수집된 정보가 있다면, 개별 라인에서 추출된 open/close보다 우선시함
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

const NAVER_PARSE_STOP_WORDS = new Set([
  '업체', '알림받기', '출발', '도착', '저장', '거리뷰', '공유', '홈', '소식', '메뉴', '리뷰', '사진', '정보',
  '저장 폴더', '펼쳐보기', '주소', '찾아가는길', '영업시간', '접기', '영업시간 수정 제안하기', '전화번호', '편의',
  '대표', '페이지 닫기',
]);

const isLikelyParsedAddress = (line = '') => /(제주|서울|부산|인천|대구|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남)/.test(line) && /(로|길|대로|번길|읍|면|동|리)\s*\d/.test(line);
const isLikelyMenuPriceLine = (line = '') => /^[0-9][0-9,]*원$/.test(line) || /변동/.test(line);
const isLikelyMenuNameLine = (line = '') => {
  const trimmed = String(line || '').trim();
  if (!trimmed || NAVER_PARSE_STOP_WORDS.has(trimmed)) return false;
  if (isLikelyMenuPriceLine(trimmed)) return false;
  if (isLikelyParsedAddress(trimmed)) return false;
  if (/^https?:\/\//i.test(trimmed)) return false;
  if (/(라스트오더|브레이크타임|영업\s*중|방문자\s*리뷰|블로그\s*리뷰|별점|내용\s*더보기|이미지\s*갯수|안내복사)/.test(trimmed)) return false;
  if (trimmed.length > 40) return false;
  return /[가-힣A-Za-z0-9]/.test(trimmed);
};

const extractPlaceNameFromLines = (lines = []) => {
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

const extractMenusFromNaverLines = (lines = []) => {
  const menus = [];
  let block = [];

  const flushBlock = () => {
    if (block.length === 0) return;
    const priceLine = block.find((line) => isLikelyMenuPriceLine(line));
    const fixedPrice = priceLine && /^[0-9][0-9,]*원$/.test(priceLine)
      ? Number(priceLine.replace(/[^0-9]/g, '')) || 0
      : 0;
    const name = block.find((line) => isLikelyMenuNameLine(line));
    if (name && fixedPrice > 0 && !menus.find((item) => item.name === name)) {
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

const parseNaverMapText = (text = '') => {
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

const normalizeSmartFillResult = (raw = {}) => {
  const menus = Array.isArray(raw?.menus)
    ? raw.menus
      .filter(Boolean)
      .map((item) => ({
        name: String(item?.name || '').trim(),
        price: Number(item?.price) || 0,
      }))
      .filter((item) => item.name)
    : [];

  return {
    name: String(raw?.name || '').trim(),
    address: String(raw?.address || '').trim(),
    business: raw?.business ? normalizeBusiness(raw.business) : null,
    menus,
  };
};

const DEFAULT_AI_SMART_FILL_CONFIG = {
  apiKey: '',
  geminiApiKey: '',
  perplexityApiKey: '',
  apiBaseUrl: 'https://api.groq.com/openai/v1',
  model: 'meta-llama/llama-4-scout-17b-16e-instruct',
  proxyBaseUrl: '',
};

const GEMINI_LINK_MODEL = 'gemini-2.5-flash';
const GEMINI_LINK_SYSTEM_PROMPT = `너는 대한민국 장소 정보를 추출하는 전문가야. 제공된 URL이나 텍스트에서 상호명, 주소, 영업시간, 휴일, 라스트 오더 정보를 추출해.

### CRITICAL RULES DO NOT FAIL:
1. **상호명(name) 정제**: 상호명 뒤에 붙어있는 '식당', '카페', '베이커리', '한식', '일식' 같은 업종 태그는 무조건 제거해. 
   - 예: "스타벅스 성수점 카페" -> "스타벅스 성수점"
   - 예: "맛있는갈비 육류,고기요리" -> "맛있는갈비"
2. **JSON 형식 엄수**: 응답은 오직 JSON 형식으로만 해. 다른 텍스트는 섞지 마.
3. **분석 범위**: 주소뿐만 아니라 정확한 영업시간 스케줄을 "10:00~20:00" 같은 형태로 추출해.`;

const normalizeAiSmartFillConfig = (raw = {}) => ({
  apiKey: String(raw?.apiKey || '').trim(),
  geminiApiKey: String(raw?.geminiApiKey || '').trim(),
  perplexityApiKey: String(raw?.perplexityApiKey || '').trim(),
  apiBaseUrl: String(raw?.apiBaseUrl || 'https://api.groq.com/openai/v1').trim() || 'https://api.groq.com/openai/v1',
  model: String(raw?.model || 'meta-llama/llama-4-scout-17b-16e-instruct').trim() || 'meta-llama/llama-4-scout-17b-16e-instruct',
  proxyBaseUrl: String(raw?.proxyBaseUrl || '').trim(),
});

const sanitizeAiSmartFillConfigForStorage = (raw = {}) => {
  const normalized = normalizeAiSmartFillConfig(raw);
  return { ...normalized, apiKey: '', geminiApiKey: '', perplexityApiKey: '' };
};

const isLocalNetworkHost = (hostname = '') => {
  const value = String(hostname || '').trim().toLowerCase();
  if (!value) return false;
  if (value === 'localhost' || value === '127.0.0.1' || value === '::1') return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(value)) return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(value)) return true;
  return false;
};

const getAiKeyEndpoint = () => {
  if (typeof window !== 'undefined' && isLocalNetworkHost(window.location.hostname)) {
    return '/api/ai-key';
  }
  return import.meta.env.VITE_AI_KEY_URL || '/api/ai-key';
};

const getAiKeyEndpointCandidates = () => Array.from(new Set([
  getAiKeyEndpoint(),
  import.meta.env.VITE_AI_KEY_URL || '',
  '/api/ai-key',
].filter(Boolean)));

const getPerplexityNearbyEndpoint = () => {
  if (typeof window !== 'undefined' && isLocalNetworkHost(window.location.hostname)) {
    return '/api/perplexity-nearby';
  }
  return import.meta.env.VITE_PERPLEXITY_NEARBY_URL || '/api/perplexity-nearby';
};

const getRouteVerifyEndpointCandidates = (proxyBase = '') => {
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

const getSmartFillErrorMessage = (error, aiEnabled = false) => {
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

const isAiSmartFillSource = (source = '') => ['ai', 'gemini'].includes(String(source || '').trim());

const shouldUseReasoningEffort = (model = '') => /qwen\/qwen3|gpt-oss/i.test(String(model || ''));
const extractNaverMapLink = (raw = '') => {
  const m = String(raw || '').match(/https?:\/\/(?:naver\.me|map\.naver\.com|pcmap\.place\.naver\.com|m\.place\.naver\.com)\/[^\s)>\]"']+/i);
  if (!m?.[0]) return '';
  return m[0].replace(/[),.;]+$/, '');
};

const normalizeClosedDaysInput = (rawClosedDays = []) => {
  const weekdayMap = { 월: 'mon', 화: 'tue', 수: 'wed', 목: 'thu', 금: 'fri', 토: 'sat', 일: 'sun', mon: 'mon', tue: 'tue', wed: 'wed', thu: 'thu', fri: 'fri', sat: 'sat', sun: 'sun' };
  return Array.isArray(rawClosedDays)
    ? [...new Set(rawClosedDays.map((day) => weekdayMap[String(day || '').trim().slice(0, 3)] || weekdayMap[String(day || '').trim()] || '').filter(Boolean))]
    : [];
};

const normalizeGeminiLinkResult = (raw = {}) => normalizeSmartFillResult({
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

const fetchGeminiPlaceInfoFromMapLink = async ({ url, geminiApiKey, bearerToken = '' }) => {
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

const scrapePlaceFromMapLinkUrl = async (url) => {
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

const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(String(reader.result || ''));
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});

const readClipboardPayload = async () => {
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

const getCurrentUserBearerToken = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.isGuest) return '';
    return await currentUser.getIdToken();
  } catch {
    return '';
  }
};

const runGroqSmartFill = async ({
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
        'Schema: {"name":"","address":"","business":{"open":"","close":"","breakStart":"","breakEnd":"","lastOrder":"","entryClose":"","closedDays":[]},"menus":[{"name":"","price":0}]}',
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

const analyzeClipboardSmartFill = async ({ mode = 'all', aiEnabled = false, aiSettings = DEFAULT_AI_SMART_FILL_CONFIG } = {}) => {
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

// 24시간 형식 시간 입력 컴포넌트 (오전/오후 없음, 24:00 지원)
const TimeInput = ({ value, onChange, onFocus, onBlurExtra, className = '', title = '', placeholder = '', inputRef = null, onKeyDown }) => {
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
      ref={inputRef}
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={handleBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      maxLength={5}
      title={title}
      className={className}
    />
  );
};
const buildBusinessQuickEditSegments = (businessRaw = {}) => {
  const business = normalizeBusiness(businessRaw || {});
  const segments = [];
  if (business.open || business.close) segments.push({ fieldKey: 'open', label: `운영 ${business.open || '--:--'} - ${business.close || '--:--'}` });
  if (business.breakStart || business.breakEnd) segments.push({ fieldKey: 'breakStart', label: `휴식 ${business.breakStart || '--:--'} - ${business.breakEnd || '--:--'}` });
  if (business.lastOrder || business.entryClose) segments.push({ fieldKey: 'lastOrder', label: `마감 ${business.lastOrder || business.entryClose || '--:--'}` });
  if (business.closedDays?.length) segments.push({ fieldKey: 'closedDays', label: `휴무 : ${formatClosedDaysSummary(business.closedDays)}` });
  return segments;
};
// 영업 정보 공통 에디터 (내장소 수정 모달 / 일정 카드 / 새 장소 추가 공통)
const BusinessHoursEditor = ({ business = {}, onChange, focusField = null }) => {
  const [activeField, setActiveField] = React.useState(null);
  const inputRefs = React.useRef({});
  const biz = normalizeBusiness(business);
  const set = (key, v) => onChange({ ...biz, [key]: v });
  const setMulti = (obj) => onChange({ ...biz, ...obj });
  const ROWS = [
    {
      key: 'operating',
      label: '운영',
      accent: 'text-[#245BDB]',
      labelTone: 'text-[#7CA4FF]',
      cardTone: 'bg-[#f4f8ff] border-[#d8e4ff]',
      fields: [{ key: 'open', label: '시작' }, { key: 'close', label: '종료' }],
    },
    {
      key: 'rest',
      label: '휴식',
      accent: 'text-slate-700',
      labelTone: 'text-slate-400',
      cardTone: 'bg-[#f7fafc] border-[#e2e8f0]',
      fields: [{ key: 'breakStart', label: '시작' }, { key: 'breakEnd', label: '종료' }],
    },
    {
      key: 'closing',
      label: '마감',
      accent: 'text-orange-600',
      labelTone: 'text-orange-300',
      cardTone: 'bg-[#fff7ed] border-[#fed7aa]',
      fields: [{ key: 'lastOrder', label: '라스트오더' }, { key: 'entryClose', label: '입장마감' }],
    },
  ];
  const valueCls = 'w-full border-0 bg-transparent px-0 py-0 text-center text-[13px] font-black leading-none tracking-tight text-slate-900 outline-none placeholder:text-slate-300 focus:ring-0';

  React.useEffect(() => {
    if (!activeField) return;
    const node = inputRefs.current[activeField];
    if (!node) return;
    node.focus();
    node.select?.();
  }, [activeField]);

  React.useEffect(() => {
    if (focusField) setActiveField(focusField);
  }, [focusField]);

  const cardCls = 'rounded-xl border px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]';
  const activeCardCls = 'ring-1 ring-[#3182F6]/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_12px_30px_-24px_rgba(49,130,246,0.35)]';
  const summaryValue = (a, b, empty = '--:--') => {
    const left = a || empty;
    const right = b || empty;
    return `${left} - ${right}`;
  };
  const closingSummaryValue = (a, b, empty = '--:--') => a || b || empty;
  const renderSummarySlots = (left, right, accentClass, singleValue = false) => {
    if (singleValue) {
      return <div className={`text-center text-[13px] font-black tracking-tight tabular-nums ${accentClass}`}>{left}</div>;
    }
    return (
      <div className={`grid grid-cols-[minmax(0,1fr)_14px_minmax(0,1fr)] items-center justify-items-center text-[13px] font-black tracking-tight tabular-nums ${accentClass}`}>
        <span className="w-[52px] text-center">{left}</span>
        <span className="text-slate-300">-</span>
        <span className="w-[52px] text-center">{right}</span>
      </div>
    );
  };
  const isRowActive = (row) => row.fields.some((field) => activeField === field.key);
  const renderEditableValue = (row, field) => {
    const isActive = activeField === field.key;
    const value = biz[field.key] || '';
    if (isActive) {
      return (
        <div className="flex min-w-0 flex-col items-center gap-0.5">
          <TimeInput
            value={value}
            onChange={(v) => set(field.key, v)}
            onFocus={() => setActiveField(field.key)}
            onBlurExtra={() => setTimeout(() => setActiveField((current) => (current === field.key ? null : current)), 140)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur();
            }}
            inputRef={(node) => {
              inputRefs.current[field.key] = node;
            }}
            className={valueCls}
            title={`${row.label} ${field.label}`}
            placeholder="00:00"
          />
        </div>
      );
    }
    return (
      <button
        type="button"
        onClick={() => setActiveField(field.key)}
        className={`min-w-0 text-center text-[13px] font-black leading-none tracking-tight tabular-nums transition-colors ${value ? row.accent : 'text-slate-300 hover:text-slate-400'}`}
        title={`${row.label} ${field.label} 수정`}
      >
        {value || '--:--'}
      </button>
    );
  };
  const closedSummary = (biz.closedDays || []).length ? formatClosedDaysSummary(biz.closedDays) : '없음';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPaste={(e) => {
        const text = e.clipboardData.getData('text');
        const parsed = parseBusinessHoursText(text);
        if (parsed.open || parsed.close || parsed.breakStart || parsed.breakEnd || parsed.lastOrder || parsed.entryClose) {
          e.preventDefault();
          setMulti(parsed);
        }
      }}
    >
      <div className="grid grid-cols-2 gap-2.5">
        {ROWS.map((row) => (
          <div
            key={row.key}
            onClick={() => {
              if (!isRowActive(row)) setActiveField(row.fields[0].key);
            }}
            className={`${cardCls} ${row.cardTone} ${isRowActive(row) ? activeCardCls : ''} flex cursor-pointer flex-col items-center gap-1 transition-all hover:translate-y-[-1px]`}
          >
            <div className={`text-center text-[9px] font-black tracking-[0.12em] ${row.labelTone}`}>{row.label}</div>
            <div className="flex items-center justify-center gap-1">
              {isRowActive(row) ? (
                <>
                  {renderEditableValue(row, row.fields[0])}
                  <span className="text-[13px] font-black text-slate-300">-</span>
                  {renderEditableValue(row, row.fields[1])}
                </>
              ) : (
                row.key === 'closing'
                  ? renderSummarySlots(closingSummaryValue(biz[row.fields[0].key], biz[row.fields[1].key]), '', row.accent, true)
                  : renderSummarySlots(biz[row.fields[0].key] || '--:--', biz[row.fields[1].key] || '--:--', row.accent)
              )}
            </div>
          </div>
        ))}
        <section className={`${cardCls} border-[#e9d5ff] bg-[#f7f2ff] ${activeField === 'closedDays' ? activeCardCls : ''} flex flex-col items-center gap-1`}>
          <button
            type="button"
            onClick={() => setActiveField((current) => (current === 'closedDays' ? null : 'closedDays'))}
            className="flex flex-1 flex-col justify-between text-left"
          >
            <div className="text-center text-[9px] font-black tracking-[0.12em] text-violet-400">휴무</div>
            <div className="flex items-center justify-center text-center text-[13px] font-black tracking-tight text-violet-600">
              {closedSummary}
            </div>
          </button>
          {activeField === 'closedDays' && (
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1">
              {WEEKDAY_OPTIONS.map(w => {
                const active = (biz.closedDays || []).includes(w.value);
                return (
                  <button
                    key={w.value}
                    type="button"
                    onClick={() => onChange({ ...biz, closedDays: active ? biz.closedDays.filter(v => v !== w.value) : [...biz.closedDays, w.value] })}
                    className={`min-w-[1.7rem] rounded-full border px-1.5 py-0.5 text-[9px] font-black leading-none transition-colors ${active ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 bg-white/90 text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                  >
                    {w.label}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const fmtDur = (mins) => {
  const safe = Math.max(0, Math.round(Number(mins) || 0));
  return `${safe}분`;
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

function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  const hrs = parseInt(parts[0], 10);
  const mins = parseInt(parts[1], 10);
  if (hrs === 24 && mins === 0) return 1440;
  return (isNaN(hrs) ? 0 : hrs) * 60 + (isNaN(mins) ? 0 : mins);
}

function minutesToTime(minutes) {
  if (typeof minutes !== 'number' || isNaN(minutes)) return "00:00";
  if (minutes === 1440) return "24:00";
  let h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h >= 24) h = h % 24;
  if (h < 0) h = 24 + (h % 24);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const getShipLoadingRange = (item = {}) => {
  const times = extractTimesFromText(String(item?.receipt?.shipDetails?.loading || ''));
  return {
    start: times[0] || '',
    end: times[1] || '',
  };
};

const getShipBoardTimeValue = (item = {}) => String(item?.boardTime || item?.receipt?.shipDetails?.depart || '').trim();
const getShipLoadEndTimeValue = (item = {}) => String(item?.loadEndTime || getShipLoadingRange(item).end || getShipBoardTimeValue(item) || '').trim();
const getShipLoadStartTimeValue = (item = {}) => String(item?.time || getShipLoadingRange(item).start || '').trim();
const resolveShipAbsoluteMinutes = (baseClock, minAbsolute = 0) => {
  let absolute = timeToMinutes(baseClock || '00:00');
  while (absolute < minAbsolute) absolute += 1440;
  return absolute;
};
const getShipTimeline = (item = {}) => {
  const loadStartLabel = getShipLoadStartTimeValue(item) || '00:00';
  const loadStart = timeToMinutes(loadStartLabel);
  const loadEndLabel = getShipLoadEndTimeValue(item) || loadStartLabel;
  const loadEnd = resolveShipAbsoluteMinutes(loadEndLabel, loadStart);
  const boardLabel = getShipBoardTimeValue(item) || loadEndLabel || loadStartLabel;
  const board = resolveShipAbsoluteMinutes(boardLabel, loadEnd);
  const sailDuration = Math.max(30, Number(item?.sailDuration) || 240);
  const disembark = board + sailDuration;
  return {
    loadStart,
    loadEnd,
    board,
    disembark,
    sailDuration,
    loadStartLabel: minutesToTime(loadStart),
    loadEndLabel: minutesToTime(loadEnd),
    boardLabel: minutesToTime(board),
    disembarkLabel: minutesToTime(disembark),
  };
};


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

  // 3번: 서버 스크래퍼 fallback (네이버 지도 검색 기반)
  try {
    const apiBase = (import.meta.env.VITE_SCRAPER_API_BASE || '').replace(/\/$/, '');
    const endpoints = Array.from(new Set([
      apiBase ? `${apiBase}/api/scrape` : '',
      '/api/scrape',
    ].filter(Boolean)));
    const naverSearchUrl = `https://map.naver.com/v5/search/${encodeURIComponent(searchQuery)}`;
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: naverSearchUrl }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const addr = String(data?.address || '').trim();
        if (addr && /[가-힣]/.test(addr) && /\d/.test(addr) && /(로|길|대로|번길|읍|면|동|리)/.test(addr)) {
          return { address: addr, source: 'NaverScrape' };
        }
      } catch (_) {
        // 다음 endpoint 시도
      }
    }
  } catch (_) {
    // noop
  }

  return { address: '', source: 'Nominatim', error: '검색 결과 없음 (카카오/네이버 보강 실패)' };
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

const latestUpdate = updateLog.lastUpdates[0] || { version: '0.0.0', timestamp: new Date().toISOString() };
const APP_VERSION = latestUpdate.version;
const LAST_PUSH_TIME = latestUpdate.timestamp;
const ROUTE_PREVIEW_COLORS = ['#34C759', '#FF8A3D', '#8B5CF6', '#3182F6', '#EF4444', '#14B8A6'];

const loadKakaoMapSdk = (() => {
  let sdkPromise = null;
  return (appKey) => {
    if (typeof window === 'undefined') return Promise.reject(new Error('window unavailable'));
    if (window.kakao?.maps?.load) {
      return new Promise((resolve) => {
        window.kakao.maps.load(() => resolve(window.kakao));
      });
    }
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}`;
      script.async = true;
      script.onload = () => {
        if (!window.kakao?.maps?.load) {
          reject(new Error('kakao maps unavailable'));
          return;
        }
        window.kakao.maps.load(() => resolve(window.kakao));
      };
      script.onerror = () => reject(new Error('kakao maps script failed'));
      document.head.appendChild(script);
    });
    return sdkPromise;
  };
})();

const RoutePreviewCanvas = ({ routePreviewMap = [], height = 240, className = '' }) => {
  const mapRef = React.useRef(null);
  const [useFallback, setUseFallback] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    let overlays = [];

    const render = async () => {
      if (!mapRef.current || !routePreviewMap.length) return;
      try {
        const kakao = await loadKakaoMapSdk(KAKAO_API_KEY);
        if (cancelled || !mapRef.current) return;

        const map = new kakao.maps.Map(mapRef.current, {
          center: new kakao.maps.LatLng(routePreviewMap[0].points[0].lat, routePreviewMap[0].points[0].lon),
          level: 10,
        });

        const bounds = new kakao.maps.LatLngBounds();
        routePreviewMap.forEach((day) => {
          const path = day.points.map((point) => {
            const latLng = new kakao.maps.LatLng(point.lat, point.lon);
            bounds.extend(latLng);
            return latLng;
          });

          const polyline = new kakao.maps.Polyline({
            path,
            strokeWeight: 4,
            strokeColor: day.color,
            strokeOpacity: 0.95,
            strokeStyle: 'solid',
          });
          polyline.setMap(map);
          overlays.push(polyline);

          day.points.forEach((point, index) => {
            const marker = new kakao.maps.Circle({
              center: new kakao.maps.LatLng(point.lat, point.lon),
              radius: 110,
              strokeWeight: 2,
              strokeColor: '#FFFFFF',
              strokeOpacity: 1,
              fillColor: day.color,
              fillOpacity: 0.95,
            });
            marker.setMap(map);
            overlays.push(marker);

            const label = new kakao.maps.CustomOverlay({
              position: new kakao.maps.LatLng(point.lat, point.lon),
              yAnchor: 2.2,
              content: `<div style="padding:2px 6px;border-radius:999px;background:white;border:1px solid rgba(226,232,240,0.95);font-size:10px;font-weight:800;color:#334155;box-shadow:0 8px 16px -14px rgba(15,23,42,0.35)">D${day.day}-${index + 1}</div>`,
            });
            label.setMap(map);
            overlays.push(label);
          });
        });

        if (!bounds.isEmpty()) map.setBounds(bounds, 40, 40, 40, 40);
      } catch (error) {
        console.warn('Route preview map fallback:', error);
        if (!cancelled) setUseFallback(true);
      }
    };

    void render();
    return () => {
      cancelled = true;
      overlays.forEach((overlay) => overlay.setMap?.(null));
      overlays = [];
    };
  }, [routePreviewMap]);

  if (useFallback) {
    return (
      <svg viewBox="0 0 100 100" className={`w-full ${className}`} style={{ height }}>
        <path d="M10 58 C18 42, 34 30, 52 28 C69 26, 86 35, 92 50 C95 59, 90 72, 79 79 C66 87, 44 89, 26 83 C15 79, 8 69, 10 58Z" fill="rgba(187,247,208,0.82)" stroke="rgba(110,231,183,0.95)" strokeWidth="1.2" />
        <path d="M21 40 C28 47, 31 56, 30 67" stroke="rgba(255,255,255,0.88)" strokeWidth="0.7" strokeDasharray="2 2" />
        <path d="M39 33 C46 42, 49 54, 48 71" stroke="rgba(255,255,255,0.84)" strokeWidth="0.7" strokeDasharray="2 2" />
        <path d="M60 31 C67 43, 69 56, 67 76" stroke="rgba(255,255,255,0.84)" strokeWidth="0.7" strokeDasharray="2 2" />
        <path d="M76 39 C81 48, 83 60, 81 70" stroke="rgba(255,255,255,0.82)" strokeWidth="0.7" strokeDasharray="2 2" />
        {routePreviewMap.map((day) => (
          <g key={`fallback-route-${day.day}`}>
            <polyline
              points={day.points.map((point) => `${point.x},${point.y}`).join(' ')}
              fill="none"
              stroke={day.color}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
            />
            {day.points.map((point, idx) => (
              <g key={`${day.day}-fallback-${point.id}-${idx}`}>
                <circle cx={point.x} cy={point.y} r="2.7" fill={day.color} />
                <circle cx={point.x} cy={point.y} r="1.1" fill="white" />
              </g>
            ))}
          </g>
        ))}
      </svg>
    );
  }

  return <div ref={mapRef} className={`w-full rounded-[18px] ${className}`.trim()} style={{ height }} />;
};

// ── AI 자동입력 학습 지침 모달 ───────────────────────────────────────────────
const GUIDE_DOC_PATH = 'meta/smartFillGuide';
const SmartFillGuideModal = ({ onClose }) => {
  const [guideContent, setGuideContent] = React.useState('');
  const [editContent, setEditContent] = React.useState('');
  const [guideLoading, setGuideLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('guide'); // 'guide' | 'history'
  const [historyCases, setHistoryCases] = React.useState([]);
  const [historyLoading, setHistoryLoading] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, GUIDE_DOC_PATH));
        const stored = snap.data()?.content;
        if (stored) { setGuideContent(stored); setGuideLoading(false); return; }
      } catch { /* ignore */ }
      const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
      fetch(`${base}/SMART_FILL_FEEDBACK.md`)
        .then((r) => r.ok ? r.text() : Promise.reject(r))
        .then((t) => { setGuideContent(t); setGuideLoading(false); })
        .catch(() => { setGuideContent('학습 지침 파일을 불러오지 못했습니다.'); setGuideLoading(false); });
    };
    load();
  }, []);

  React.useEffect(() => {
    if (activeTab === 'history' && historyCases.length === 0) {
      const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
          const q = await getDocs(collection(db, 'meta', 'aiLearning', 'cases'));
          const cases = q.docs.map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setHistoryCases(cases);
        } catch (e) { console.error(e); }
        setHistoryLoading(false);
      };
      fetchHistory();
    }
  }, [activeTab]);

  const handleEdit = () => { setEditContent(guideContent); setIsEditing(true); setSaveMsg(''); };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, GUIDE_DOC_PATH), { content: editContent, updatedAt: new Date().toISOString() }, { merge: true });
      setGuideContent(editContent);
      setIsEditing(false);
      setSaveMsg('저장 완료 ✓');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (e) { setSaveMsg(`저장 실패: ${e?.message}`); } finally { setIsSaving(false); }
  };

  const renderMd = (md) => md.split('\n').map((line, i) => {
    if (/^###\s/.test(line)) return <p key={i} className="text-[12px] font-black text-slate-700 mt-4 mb-1">{line.replace(/^###\s/, '')}</p>;
    if (/^##\s/.test(line)) return <p key={i} className="text-[13px] font-black text-[#3182F6] mt-5 mb-1 pb-1 border-b border-blue-100">{line.replace(/^##\s/, '')}</p>;
    if (/^#\s/.test(line)) return <p key={i} className="text-[14px] font-black text-slate-800 mt-2 mb-3">{line.replace(/^#\s/, '')}</p>;
    if (/^---/.test(line)) return <div key={i} className="h-px bg-slate-100 my-3" />;
    if (/^-\s/.test(line)) return <p key={i} className="text-[11px] text-slate-600 font-semibold pl-3 leading-relaxed">· {line.replace(/^-\s/, '')}</p>;
    if (line.trim() === '') return <div key={i} className="h-1" />;
    return <p key={i} className="text-[11px] text-slate-600 leading-relaxed">{line}</p>;
  });

  return (
    <>
      <div className="fixed inset-0 z-[260] bg-black/20" onClick={isEditing ? undefined : onClose} />
      <div className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-[261] max-w-lg mx-auto bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="px-5 pt-4 pb-1 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] font-black text-slate-700">AI 입력 학습 관리</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{isEditing ? '✎ 지침 편집 중' : '교차 검증 및 지침 갱신'}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {!isEditing && activeTab === 'guide' && !guideLoading && (
                <button onClick={handleEdit} className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-black text-slate-500 hover:text-[#3182F6] transition-colors flex items-center gap-1">
                  <Pencil size={9} /> 편집
                </button>
              )}
              {saveMsg && <span className="text-[10px] font-bold text-emerald-500">{saveMsg}</span>}
              <button onClick={isEditing ? () => setIsEditing(false) : onClose} className="p-1.5 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
          {/* 탭 버튼 */}
          {!isEditing && (
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('guide')}
                className={`pb-2 text-[11px] font-black transition-all border-b-2 ${activeTab === 'guide' ? 'border-[#3182F6] text-[#3182F6]' : 'border-transparent text-slate-400'}`}
              >
                학습 지침(Instruction)
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-2 text-[11px] font-black transition-all border-b-2 ${activeTab === 'history' ? 'border-[#3182F6] text-[#3182F6]' : 'border-transparent text-slate-400'}`}
              >
                교정 사례(Cross-Check)
                {historyCases.length > 0 && <span className="ml-1 px-1 bg-[#3182F6] text-white rounded text-[8px]">{historyCases.length}</span>}
              </button>
            </div>
          )}
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/30">
          {activeTab === 'guide' ? (
            guideLoading ? (
              <div className="flex items-center justify-center flex-1 text-[12px] text-slate-400 font-bold">지침 불러오는 중...</div>
            ) : isEditing ? (
              <textarea
                value={editContent} onChange={(e) => setEditContent(e.target.value)}
                className="flex-1 w-full px-5 py-4 text-[11px] font-mono text-slate-700 leading-relaxed resize-none outline-none border-none bg-slate-50/50"
                placeholder="AI 지침을 수정하세요..." spellCheck={false}
              />
            ) : (
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="space-y-0.5">{renderMd(guideContent)}</div>
              </div>
            )
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {historyLoading ? (
                <div className="flex items-center justify-center py-10 text-[12px] text-slate-400 font-bold animate-pulse">사례 데이터를 불러오는 중...</div>
              ) : historyCases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-300 gap-2">
                  <Sparkles size={24} className="opacity-20" />
                  <p className="text-[11px] font-bold">아직 기록된 교정 사례가 없습니다.</p>
                </div>
              ) : (
                historyCases.map((c, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-[10px]">
                    <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex justify-between items-center font-bold text-slate-400">
                      <span>Case #{historyCases.length - i} · {new Date(c.timestamp).toLocaleString()}</span>
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded text-[8px] uppercase">{c.inputType}</span>
                    </div>
                    <div className="p-3 space-y-3">
                      <div>
                        <p className="text-[#3182F6] font-black mb-1">❶ 원본 데이터(Raw Source)</p>
                        <div className="bg-slate-50 rounded-lg p-2 text-slate-500 italic max-h-24 overflow-y-auto no-scrollbar font-mono break-all whitespace-pre-wrap">
                          {c.rawSource?.text || '(이미지 데이터)'}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-slate-400 font-black mb-1">❷ AI 결과</p>
                          <div className="bg-red-50/30 rounded-lg p-2 text-slate-400 border border-red-50/50 font-mono overflow-x-auto no-scrollbar">
                            <pre className="text-[9px]">{JSON.stringify(c.aiResult, null, 1)}</pre>
                          </div>
                        </div>
                        <div>
                          <p className="text-emerald-500 font-black mb-1">❸ 사용자 교정(Fixed)</p>
                          <div className="bg-emerald-50/30 rounded-lg p-2 text-emerald-600 border border-emerald-50/50 font-mono overflow-x-auto no-scrollbar">
                            <pre className="text-[9px]">{JSON.stringify(c.userFixed, null, 1)}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 하단 제어 */}
        {isEditing && (
          <div className="shrink-0 px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-black text-slate-500 hover:bg-slate-50 transition-colors">취소</button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black disabled:opacity-60 hover:bg-blue-600 transition-colors flex items-center gap-1.5">
              {isSaving && <LoaderCircle size={10} className="animate-spin" />} {isSaving ? '저장 중...' : '지침 업데이트'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const askPlanBMoveMode = (item) => item?.alternatives?.length > 0 ? window.confirm(`Plan B도 함께 이동하시겠습니까? (취소 시 현재 기준 일정만 이동합니다)`) : false;
const App = () => {



  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // ── 업데이트 정보 (버전 & 경과 시간) ──
  const [timeSincePush, setTimeSincePush] = useState('');
  useEffect(() => {
    const update = () => {
      const diff = Date.now() - new Date(LAST_PUSH_TIME).getTime();
      const absDiff = Math.abs(diff); // 혹시 모를 시차 대비
      const mins = Math.floor(absDiff / 60000);
      const hrs = Math.floor(mins / 60);
      const days = Math.floor(hrs / 24);
      if (mins < 1) setTimeSincePush('방금 전');
      else if (mins < 60) setTimeSincePush(`${mins}분 전`);
      else if (hrs < 24) setTimeSincePush(`${hrs}시간 전`);
      else setTimeSincePush(`${days}일 전`);
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

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
  const emptyPlanRecoveryKeyRef = useRef('');
  const [showPlanManager, setShowPlanManager] = useState(false);
  const [showEntryChooser, setShowEntryChooser] = useState(false);
  const [newPlanRegion, setNewPlanRegion] = useState('');
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [showShareManager, setShowShareManager] = useState(false);
  const [navDayMenu, setNavDayMenu] = useState(null); // { dayIdx, day }
  const [perplexityNearbyModal, setPerplexityNearbyModal] = useState({ open: false, loading: false, provider: '', itemName: '', summary: '', recommendations: [], citations: [], error: '' });
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [showPlanOptions, setShowPlanOptions] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [showSmartFillGuide, setShowSmartFillGuide] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareSettings, setShareSettings] = useState({ visibility: 'private', permission: 'viewer' });
  const [isSharedReadOnly, setIsSharedReadOnly] = useState(false);
  const [sharedSource, setSharedSource] = useState(null); // { ownerId, planId }
  const entryChooserShownRef = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [draggingFromLibrary, setDraggingFromLibrary] = useState(null);
  const [placeFilterTags, setPlaceFilterTags] = useState([]); // 내 장소 필터링 태그
  const [showPlaceCategoryManager, setShowPlaceCategoryManager] = useState(false);
  const [draggingFromTimeline, setDraggingFromTimeline] = useState(null);
  const [isDroppingOnDeleteZone, setIsDroppingOnDeleteZone] = useState(false);
  const [dragBottomTarget, setDragBottomTarget] = useState('');
  const [dropTarget, setDropTarget] = useState(null);
  const [dropOnItem, setDropOnItem] = useState(null); // { dayIdx, pIdx } — Plan B 드롭 대상
  const [isDragCopy, setIsDragCopy] = useState(false); // Ctrl+드래그 시 복사 모드
  const [dragCoord, setDragCoord] = useState({ x: 0, y: 0 });
  const desktopDragRef = useRef(null);
  const ctrlHeldRef = useRef(false);
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceTypes, setNewPlaceTypes] = useState(['food']);
  const resetNewPlaceDraft = useCallback(() => {
    setNewPlaceName('');
    setNewPlaceTypes(['food']);
    setIsAddingPlace(false);
  }, []);
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [editPlaceDraft, setEditPlaceDraft] = useState(null);
  const [editingPlanTarget, setEditingPlanTarget] = useState(null);
  const [editPlanDraft, setEditPlanDraft] = useState(null);
  const [useAiSmartFill, setUseAiSmartFill] = useState(() => safeLocalStorageGet('use_ai_smart_fill', 'true') === 'true');
  const [aiSmartFillConfig, setAiSmartFillConfig] = useState(() => {
    const raw = safeLocalStorageGet('ai_smart_fill_config', '');
    if (!raw) return DEFAULT_AI_SMART_FILL_CONFIG;
    try {
      return normalizeAiSmartFillConfig({ ...JSON.parse(raw), apiKey: '' });
    } catch {
      return DEFAULT_AI_SMART_FILL_CONFIG;
    }
  });
  const [serverAiKeyStatus, setServerAiKeyStatus] = useState({ hasStoredKey: false, hasStoredGroqKey: false, hasStoredGeminiKey: false, hasStoredPerplexityKey: false, updatedAt: null, loading: false });
  const [tripRegion, setTripRegion] = useState(() => safeLocalStorageGet('trip_region_hint', '제주시'));
  const [tripStartDate, setTripStartDate] = useState(() => safeLocalStorageGet('trip_start_date', ''));
  const [tripEndDate, setTripEndDate] = useState(() => safeLocalStorageGet('trip_end_date', ''));
  const [planOptionRegion, setPlanOptionRegion] = useState('');
  const [planOptionStartDate, setPlanOptionStartDate] = useState('');
  const [planOptionEndDate, setPlanOptionEndDate] = useState('');
  const [planOptionBudget, setPlanOptionBudget] = useState('0');
  // 초기 상태 안전하게 설정
  const [itinerary, setItinerary] = useState({ days: [], places: [] });
  const customPlaceCategories = useMemo(() => {
    const collected = new Set();
    (itinerary.places || []).forEach((place) => {
      (Array.isArray(place?.types) ? place.types : []).forEach((tag) => {
        const normalized = String(tag || '').trim();
        if (!normalized || TAG_VALUES.has(normalized)) return;
        collected.add(normalized);
      });
    });
    return [...collected].sort((a, b) => a.localeCompare(b, 'ko'));
  }, [itinerary.places]);
  const [history, setHistory] = useState([]);
  const [pendingAutoRouteJobs, setPendingAutoRouteJobs] = useState([]);
  const [undoToast, setUndoToast] = useState(false);
  const [undoMessage, setUndoMessage] = useState("");
  const [infoToast, setInfoToast] = useState('');
  const undoToastTimerRef = React.useRef(null);
  const infoToastTimerRef = React.useRef(null);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedPlaceId, setExpandedPlaceId] = useState(null);
  const [pendingPlanMenuFocus, setPendingPlanMenuFocus] = useState(null); // { dayIdx, pIdx, menuIdx }
  // durationControllerTarget 제거됨 — 시간 셀 확장으로 통합
  const [timeControllerTarget, setTimeControllerTarget] = useState(null); // { dayIdx, pIdx }
  const [timelineEndTimeDraft, setTimelineEndTimeDraft] = useState(null); // { key, value }
  const [lodgeCheckoutDraft, setLodgeCheckoutDraft] = useState(null); // { key, value }
  const [timeControlStep, setTimeControlStep] = useState(5);

  // 시작 시간 컨트롤러 외부 클릭 시 닫기
  useEffect(() => {
    const handleOutside = (e) => {
      if (!timeControllerTarget) return;
      // data-time-trigger가 붙은 요소(버튼)나 그 내부를 클릭했을 때는 토글 로직이 우선하므로 무시
      if (e.target.closest('[data-time-trigger="true"]')) return;
      // 컨트롤 타워 자체를 클릭한 경우도 닫지 않음 (디테일 조절 중일 수 있으므로)
      if (e.target.closest('.group\\/tower')) return;

      setTimeControllerTarget(null);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [timeControllerTarget]);

  useEffect(() => {
    if (!pendingPlanMenuFocus) return;
    const { dayIdx, pIdx, menuIdx } = pendingPlanMenuFocus;
    const target = document.querySelector(`[data-plan-menu-name="${dayIdx}-${pIdx}-${menuIdx}"]`);
    if (target instanceof HTMLInputElement) {
      target.focus();
      target.select();
    }
    setPendingPlanMenuFocus(null);
  }, [pendingPlanMenuFocus, itinerary.days]);

  useEffect(() => {
    safeLocalStorageSet('use_ai_smart_fill', useAiSmartFill ? 'true' : 'false');
  }, [useAiSmartFill]);

  useEffect(() => {
    safeLocalStorageSet('ai_smart_fill_config', JSON.stringify(sanitizeAiSmartFillConfigForStorage(aiSmartFillConfig)));
  }, [aiSmartFillConfig]);

  // Web Push (FCM) 등록 및 수신 설정
  useEffect(() => {
    let unsubscribe = () => { };

    const setupPush = async () => {
      try {
        if (typeof window === 'undefined' || typeof Notification === 'undefined' || !('serviceWorker' in navigator)) {
          return;
        }

        const serviceWorkerUrl = `${import.meta.env.BASE_URL || '/'}firebase-messaging-sw.js`;
        const registration = await navigator.serviceWorker.register(serviceWorkerUrl);
        const permission = Notification.permission === 'granted'
          ? 'granted'
          : await Notification.requestPermission();
        if (permission !== 'granted') return;

        const token = await getToken(messaging, {
          vapidKey: 'BHz_T_119pUOfcByY9_S2Eon9N60MIs17h_7-gXWl4SNDmI7jX27p_R4pYw7XN-Q5O4V4e1_vX9_Y',
          serviceWorkerRegistration: registration,
        }).catch((e) => {
          console.warn('FCM Token error:', e);
          return '';
        });

        if (token) {
          console.log('FCM Token:', token);
          if (auth.currentUser && !auth.currentUser.isGuest) {
            const payload = {
              token,
              updatedAt: new Date().toISOString(),
              userAgent: navigator.userAgent,
              version: APP_VERSION,
              platform: 'web',
            };
            await setDoc(doc(db, `users/${auth.currentUser.uid}/private/push`), payload, { merge: true });
            await setDoc(doc(db, `users/${auth.currentUser.uid}/private/pushTokens/${makePushTokenDocId(token)}`), payload, { merge: true });
          }
        }

        unsubscribe = onMessage(messaging, (payload) => {
          console.log('Foreground Message received:', payload);
          if (payload.notification) {
            showInfoToast(`🔔 ${payload.notification.title}: ${payload.notification.body}`);
          }
        });
      } catch (error) {
        console.error('Push setup failed:', error);
      }
    };

    setupPush();

    return () => unsubscribe();
  }, [user?.uid]);

  const [planVariantPicker, setPlanVariantPicker] = useState(null); // { dayIdx, pIdx, left, top }
  const conflictAlertKeyRef = useRef('');
  const [lastAction, setLastAction] = useState("3일차 시작 일정이 수정되었습니다.");
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [aiLearningCapture, setAiLearningCapture] = useState(null); // { itemId, rawSource, aiResult, inputType }
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [activeItemId, setActiveItemId] = useState(null);

  // AI 학습 피드백 자동 제출: 카드가 닫힐 때 혹은 편집 모드가 끝날 때 체크
  useEffect(() => {
    if (!expandedId && aiLearningCapture?.itemId && aiLearningCapture.itemId !== 'new') {
      const targetId = aiLearningCapture.itemId;
      // 현재 일정에서 해당 아이템 찾기
      let found = null;
      for (const day of itinerary.days || []) {
        found = day.plan?.find(p => p.id === targetId);
        if (found) break;
      }
      if (found) {
        submitAiLearningCase(found, targetId);
      }
    }
  }, [expandedId, aiLearningCapture]);

  const submitAiLearningCase = async (finalData, targetId) => {
    if (!aiLearningCapture || !aiLearningCapture.aiResult) return;
    if (aiLearningCapture.itemId !== targetId && aiLearningCapture.itemId !== 'new') return;

    // 단순 비교를 위해 필드 정규화
    const aiComp = JSON.stringify(aiLearningCapture.aiResult);
    const userComp = JSON.stringify({
      name: finalData.name || finalData.activity || '',
      address: finalData.address || (finalData.receipt?.address) || '',
      business: finalData.business || {},
      menus: (finalData.receipt?.items || []).map(m => ({ name: m.name, price: m.price }))
    });

    if (aiComp === userComp) return; // 변경사항 없으면 스킵

    try {
      const docRef = doc(collection(db, 'meta', 'aiLearning', 'cases'));
      await setDoc(docRef, {
        timestamp: new Date().toISOString(),
        itemId: targetId,
        inputType: aiLearningCapture.inputType,
        rawSource: aiLearningCapture.rawSource,
        aiResult: aiLearningCapture.aiResult,
        userFixed: {
          name: finalData.name || finalData.activity || '',
          address: finalData.address || (finalData.receipt?.address) || '',
          business: finalData.business || {},
          menus: (finalData.receipt?.items || []).map(m => ({ name: m.name, price: m.price }))
        },
        version: APP_VERSION
      });
      console.log("AI Learning feedback captured.");
      setAiLearningCapture(null);
    } catch (e) {
      console.warn("AI Feedback logging failed", e);
    }
  };
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
  const handleNavClick = (dayNum, itemId = null, scrollTargetId = null) => {
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
      if (scrollTargetId) {
        const byScrollTarget = document.getElementById(scrollTargetId);
        if (byScrollTarget) return byScrollTarget;
      }

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
        block: targetItemId || scrollTargetId ? 'center' : 'start'
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
  const parseInsertDropTargetValue = (rawValue = '') => {
    const value = String(rawValue || '').trim();
    if (!value) return null;
    const pipeMatch = value.match(/^(-?\d+)\|(-?\d+)$/);
    if (pipeMatch) {
      return { dayIdx: Number(pipeMatch[1]), insertAfterPIdx: Number(pipeMatch[2]) };
    }
    const dashParts = value.split('-').map(Number);
    if (dashParts.length === 2 && dashParts.every((part) => Number.isFinite(part))) {
      return { dayIdx: dashParts[0], insertAfterPIdx: dashParts[1] };
    }
    return null;
  };
  const applyInsertAtDropTarget = (targetDayIdx, insertAfterPIdx, source) => {
    if (source?.kind === 'library') {
      const place = source.place;
      if (!place) return false;
      if (insertAfterPIdx < 0) addInitialItem(targetDayIdx, place);
      else addNewItem(targetDayIdx, insertAfterPIdx, place.types, place);
      if (!source.isCopy) removePlace(place.id);
      return true;
    }
    if (source?.kind === 'timeline') {
      const payload = source.payload;
      if (!payload) return false;
      if (payload.altIdx !== undefined) {
        if (insertAfterPIdx < 0) {
          const altItem = itinerary.days?.[payload.dayIdx]?.plan?.[payload.pIdx]?.alternatives?.[payload.altIdx];
          if (!altItem) return false;
          addInitialItem(targetDayIdx, {
            ...normalizeAlternative(altItem),
            name: altItem.activity,
            address: altItem.receipt?.address || '',
          });
          removeAlternative(payload.dayIdx, payload.pIdx, payload.altIdx);
          return true;
        }
        insertAlternativeToTimeline(targetDayIdx, insertAfterPIdx, payload.dayIdx, payload.pIdx, payload.altIdx);
        return true;
      }
      moveTimelineItem(targetDayIdx, insertAfterPIdx, payload.dayIdx, payload.pIdx, !!source.isCopy, payload.planPos);
      return true;
    }
    return false;
  };
  const getActiveTimelineDragPayload = () => {
    if (draggingFromTimeline) return draggingFromTimeline;
    if (desktopDragRef.current?.kind === 'timeline') return desktopDragRef.current.payload || null;
    if (touchDragSourceRef.current?.kind === 'timeline') return touchDragSourceRef.current.payload || null;
    return null;
  };
  const applyTimelineBottomAction = (action, payload) => {
    if (!payload || !action) return false;
    if (action === 'move_to_library') {
      if (payload.altIdx !== undefined) {
        dropAltOnLibrary(payload.dayIdx, payload.pIdx, payload.altIdx);
      } else {
        const item = itinerary.days?.[payload.dayIdx]?.plan?.[payload.pIdx];
        dropTimelineItemOnLibrary(payload.dayIdx, payload.pIdx, askPlanBMoveMode(item));
      }
      return true;
    }
    if (action === 'delete') {
      if (payload.altIdx === undefined) {
        deletePlanItem(payload.dayIdx, payload.pIdx);
        return true;
      }
      return false;
    }
    if (action === 'copy_to_library') {
      if (payload.altIdx !== undefined) {
        copyAlternativeToLibrary(payload.dayIdx, payload.pIdx, payload.altIdx);
      } else {
        copyTimelineItemToLibrary(payload.dayIdx, payload.pIdx);
      }
      return true;
    }
    return false;
  };
  const [basePlanRef, setBasePlanRef] = useState(null); // { dayIdx, pIdx, id, name, address }
  const [placeDistanceMap, setPlaceDistanceMap] = useState({});
  const [col1Collapsed, setCol1Collapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1100);
  const [col2Collapsed, setCol2Collapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1100);
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280));
  const [tagEditorTarget, setTagEditorTarget] = useState(null); // {dayIdx, pIdx}
  const [businessEditorTarget, setBusinessEditorTarget] = useState(null); // {dayIdx, pIdx}
  const [viewingPlanIdx, setViewingPlanIdx] = useState({}); // {[itemId]: altIdx} — -1 = main plan A
  const [ferryEditField, setFerryEditField] = useState(null); // { pId, field: 'load'|'depart' }
  const [routeCache, setRouteCache] = useState({});
  const [calculatingRouteId, setCalculatingRouteId] = useState(null);
  const [isCalculatingAllRoutes, setIsCalculatingAllRoutes] = useState(false);
  const [routeCalcProgress, setRouteCalcProgress] = useState(0);
  const [routePreviewDays, setRoutePreviewDays] = useState([]);
  const [routePreviewLoading, setRoutePreviewLoading] = useState(false);
  const [showRoutePreviewModal, setShowRoutePreviewModal] = useState(false);
  const [hiddenRoutePreviewEndpoints, setHiddenRoutePreviewEndpoints] = useState({});
  const routeRetryCooldownMs = 45000;
  const autoRouteQueuedRef = useRef(new Set());
  const [dashboardHeight, setDashboardHeight] = useState(200);
  const [showTravelIntensityInfo, setShowTravelIntensityInfo] = useState(false);
  const dashboardRef = useRef(null);
  const heroTriggerRef = useRef(null);
  const [heroCollapsed, setHeroCollapsed] = useState(false);
  const [heroSummaryExpanded, setHeroSummaryExpanded] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  const isMobileLayout = viewportWidth < 1100;
  const rightExpandedWidth = isMobileLayout ? Math.min(360, Math.round(viewportWidth * 0.86)) : 310;
  const leftExpandedWidth = isMobileLayout ? Math.min(360, Math.round(viewportWidth * 0.86)) : rightExpandedWidth;
  const leftCollapsedWidth = isMobileLayout ? 0 : 44;
  const rightCollapsedWidth = isMobileLayout ? 0 : 44;
  const leftSidebarWidth = col1Collapsed ? leftCollapsedWidth : leftExpandedWidth;
  const rightSidebarWidth = col2Collapsed ? rightCollapsedWidth : rightExpandedWidth;
  const isCompactTimeline = isMobileLayout || viewportWidth < 1380 || (!col1Collapsed && !col2Collapsed && viewportWidth < 1720);
  const timelineMaxClass = isCompactTimeline ? 'max-w-[500px]' : 'max-w-[560px]';

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

  useEffect(() => {
    if (isMobileLayout) return;
    const requiredWidthForBothPanels = leftExpandedWidth + rightExpandedWidth + 560 + 96;
    if (viewportWidth >= requiredWidthForBothPanels && (col1Collapsed || col2Collapsed)) {
      setCol1Collapsed(false);
      setCol2Collapsed(false);
    }
  }, [viewportWidth, isMobileLayout, leftExpandedWidth, rightExpandedWidth, col1Collapsed, col2Collapsed]);

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

  const createDefaultJejuPlanData = () => ({
    days: [
      {
        day: 1,
        plan: [
          { id: 'd1_s1', time: '22:30', loadEndTime: '00:00', boardTime: '01:00', activity: '퀸 제누비아 2호', types: ['ship'], startPoint: '목포항', endPoint: '제주항', price: 310000, duration: 390, sailDuration: 240, state: 'confirmed', isTimeFixed: true, receipt: { address: '전남 목포시 해안로 148', shipDetails: { depart: '01:00', loading: '22:30 ~ 00:00' }, items: [{ name: '차량 선적', price: 160000, qty: 1, selected: true }, { name: '주니어룸 (3인)', price: 150000, qty: 1, selected: true }] } },
          { id: 'd1_p1', time: '06:30', activity: '진아떡집', types: ['food', 'pickup'], price: 24000, duration: 15, state: 'confirmed', distance: 2, travelTimeOverride: '5분', receipt: { address: '제주 제주시 동문로4길 7-1', items: [{ name: '오메기떡 8알팩', price: 12000, qty: 2, selected: true }] }, memo: '오메기떡 픽업 필수!' },
          { id: 'd1_c1', time: '06:50', activity: '카페 듀포레', types: ['cafe', 'view'], price: 38500, duration: 145, state: 'confirmed', distance: 8, receipt: { address: '제주시 서해안로 579', items: [{ name: '아메리카노', price: 6500, qty: 2, selected: true }, { name: '비행기 팡도르', price: 12500, qty: 1, selected: true }, { name: '크로와상', price: 13000, qty: 1, selected: true }] }, memo: '비행기 이착륙 뷰 맛집' },
          { id: 'd1_f1', time: '09:30', activity: '말고기연구소', types: ['food', 'openrun'], price: 36000, duration: 60, state: 'confirmed', distance: 3, isTimeFixed: true, receipt: { address: '제주시 북성로 43', items: [{ name: '말육회 부각초밥', price: 12000, qty: 3, selected: true }] }, memo: '10:00 영업 시작' },
          { id: 'd1_c2', time: '12:30', activity: '만다리노카페 & 승마', types: ['cafe', 'experience'], price: 26000, duration: 120, state: 'confirmed', distance: 18, receipt: { address: '조천읍 함와로 585', items: [{ name: '만다리노 라떼', price: 8000, qty: 2, selected: true }, { name: '승마 체험', price: 10000, qty: 1, selected: true }, { name: '귤 따기 체험', price: 10000, qty: 1, selected: false }] }, memo: '승마 및 귤 체험 가능' },
          { id: 'd1_t1', time: '15:00', activity: '함덕잠수함', types: ['tour'], price: 79000, duration: 90, state: 'confirmed', distance: 10, receipt: { address: '조천읍 조함해안로 378', items: [{ name: '입장권', price: 28000, qty: 2, selected: true }] }, memo: '사전 예약 확인 필요' },
          { id: 'd1_f2', time: '18:30', activity: '존맛식당', types: ['food'], price: 69000, duration: 90, state: 'confirmed', distance: 2, receipt: { address: '제주시 조천읍 신북로 493', items: [{ name: '문어철판볶음', price: 39000, qty: 1, selected: true }] }, memo: '저녁 웨이팅 있을 수 있음' },
        ],
      },
      {
        day: 2,
        plan: [
          { id: 'd2_c1', time: '09:00', activity: '델문도', types: ['cafe', 'view'], price: 42500, duration: 60, state: 'confirmed', distance: 2, receipt: { address: '함덕 조함해안로 519-10', items: [{ name: '문도샌드', price: 12000, qty: 1, selected: true }] } },
          { id: 'd2_f1', time: '11:00', activity: '존맛식당', types: ['food'], price: 69000, duration: 90, state: 'confirmed', distance: 1, receipt: { address: '조천읍 신북로 493', items: [{ name: '재방문', price: 69000, qty: 1, selected: true }] } },
          { id: 'd2_l1', time: '20:00', activity: '통나무파크', types: ['lodge'], price: 100000, duration: 600, state: 'confirmed', distance: 45, receipt: { address: '애월읍 도치돌길 303', items: [{ name: '숙박비', price: 100000, qty: 1, selected: true }] } },
        ],
      },
      {
        day: 3,
        plan: [
          { id: 'd3_t1', time: '09:00', activity: '도치돌알파카', types: ['tour', 'experience'], price: 21000, duration: 120, state: 'confirmed', distance: 0, travelTimeOverride: '30분', receipt: { address: '애월읍 도치돌길 303', items: [{ name: '입장권', price: 7000, qty: 3, selected: true }] } },
          { id: 'd3_s1', time: '15:15', loadEndTime: '15:45', activity: '퀸 제누비아 2호', types: ['ship'], startPoint: '제주항', endPoint: '목포항', price: 260000, duration: 330, sailDuration: 240, state: 'confirmed', distance: 25, isTimeFixed: true, receipt: { address: '제주항', shipDetails: { depart: '16:45', loading: '14:45 ~ 15:45' }, items: [{ name: '차량 선적', price: 160000, qty: 1, selected: true }, { name: '이코노미 인원권', price: 100000, qty: 1, selected: true }] }, memo: '동승자 하차 후 차량 선적 (셔틀 이동) / 16:45 출항' },
        ],
      },
    ],
    places: [],
    maxBudget: 1500000,
    tripRegion: '제주',
    tripStartDate: '2026-03-26',
    tripEndDate: '2026-03-28',
    planTitle: '제주 여행',
    planCode: makePlanCode('제주', '2026-03-26'),
    share: { visibility: 'private', permission: 'viewer' },
    updatedAt: Date.now(),
  });

  const hasNoItineraryContent = (data = {}) => {
    const days = Array.isArray(data?.days) ? data.days : [];
    const places = Array.isArray(data?.places) ? data.places : [];
    const totalItems = days.reduce((sum, day) => sum + ((day?.plan || []).filter(Boolean).length), 0);
    return days.length > 0 && totalItems === 0 && places.length === 0;
  };

  const isJejuRecoveryContext = (data = {}) => {
    const region = String(data?.tripRegion || tripRegion || '').trim();
    const startDate = String(data?.tripStartDate || tripStartDate || '').trim();
    const endDate = String(data?.tripEndDate || tripEndDate || '').trim();
    const days = Array.isArray(data?.days) ? data.days : [];
    const expectedDays = (startDate && endDate)
      ? Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
      : days.length;
    return /제주/.test(region) && (expectedDays === 3 || days.length === 3);
  };

  const isRecoverableEmptyJejuMainPlan = (data = {}) => (
    currentPlanId === 'main'
    && hasNoItineraryContent(data)
    && isJejuRecoveryContext(data)
  );

  const buildRecoveredJejuPlanState = () => {
    const recovered = createDefaultJejuPlanData();
    const calculatedDays = recovered.days.map((day) => ({
      ...day,
      plan: recalculateSchedule(day.plan),
    }));
    return {
      recovered,
      nextState: {
        days: calculatedDays,
        places: recovered.places || [],
        maxBudget: recovered.maxBudget || 1500000,
        share: normalizeShare(recovered.share || {}),
        planTitle: recovered.planTitle || `${recovered.tripRegion || '여행'} 일정`,
        planCode: recovered.planCode || makePlanCode(recovered.tripRegion || '여행', recovered.tripStartDate || ''),
      },
      calculatedDays,
    };
  };

  const ensureShipItemDefaults = (item, dayNumber = 1) => {
    if (!item || !Array.isArray(item.types) || !item.types.includes('ship')) return item;
    const isOutbound = Number(dayNumber || 1) === 1;
    const defaultLoadStart = isOutbound ? '22:30' : '14:45';
    item.activity = String(item.activity || '').trim() || '새 페리 일정';
    item.startPoint = item.startPoint || (isOutbound ? '목포항' : '제주항');
    item.endPoint = item.endPoint || (isOutbound ? '제주항' : '목포항');
    item.time = String(item.time || defaultLoadStart).trim() || defaultLoadStart;
    item.loadEndTime = String(item.loadEndTime || minutesToTime(timeToMinutes(item.time) + 90)).trim() || minutesToTime(timeToMinutes(item.time) + 90);
    item.boardTime = String(getShipBoardTimeValue(item) || minutesToTime(timeToMinutes(item.loadEndTime) + 60)).trim() || minutesToTime(timeToMinutes(item.loadEndTime) + 60);
    item.sailDuration = Math.max(30, Number(item.sailDuration) || 240);
    item.isTimeFixed = true;
    item.travelTimeOverride = item.travelTimeOverride || '15분';
    item.bufferTimeOverride = item.bufferTimeOverride || '10분';
    if (!item.receipt) item.receipt = { address: '', items: [] };
    if (!Array.isArray(item.receipt.items)) item.receipt.items = [];
    item.receipt.address = item.receipt.address || item.startPoint;
    item.receipt.shipDetails = {
      ...(item.receipt.shipDetails || {}),
      depart: item.boardTime,
      loading: `${item.time} ~ ${item.loadEndTime}`,
    };
    const shipTimeline = getShipTimeline(item);
    item.time = shipTimeline.loadStartLabel;
    item.loadEndTime = shipTimeline.loadEndLabel;
    item.boardTime = shipTimeline.boardLabel;
    item.sailDuration = shipTimeline.sailDuration;
    item.duration = Math.max(0, shipTimeline.board - shipTimeline.loadStart) + shipTimeline.sailDuration;
    if (item.receipt?.shipDetails) {
      item.receipt.shipDetails.depart = shipTimeline.boardLabel;
      item.receipt.shipDetails.loading = `${shipTimeline.loadStartLabel} ~ ${shipTimeline.loadEndLabel}`;
    }
    if (Array.isArray(item.receipt?.items)) {
      item.price = item.receipt.items.reduce((sum, menu) => sum + (menu?.selected === false ? 0 : getMenuLineTotal(menu)), 0);
    }
    return item;
  };

  const normalizeLodgeSegmentTime = (raw, fallback = '18:00') => {
    const value = String(raw || '').trim();
    if (!value) return fallback;
    if (/^\d{1,2}:\d{1,2}$/.test(value)) {
      const [hourRaw, minuteRaw] = value.split(':');
      const hours = Number.parseInt(hourRaw, 10);
      const minutes = Number.parseInt(minuteRaw, 10);
      if (!Number.isFinite(hours) || !Number.isFinite(minutes) || hours < 0 || hours > 24 || minutes < 0 || minutes > 59 || (hours === 24 && minutes > 0)) {
        return fallback;
      }
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (!digits) return fallback;
    const hours = digits.length <= 2 ? Number.parseInt(digits, 10) : Number.parseInt(digits.slice(0, digits.length - 2), 10);
    const minutes = digits.length <= 2 ? 0 : Number.parseInt(digits.slice(-2), 10);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes) || hours < 0 || hours > 24 || minutes < 0 || minutes > 59 || (hours === 24 && minutes > 0)) {
      return fallback;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const ensureLodgeStaySegments = (item = {}) => {
    if (!isFullLodgeStayItem(item)) return item;
    const fallbackTime = String(item.time || '18:00').trim() || '18:00';
    item.staySegments = (Array.isArray(item.staySegments) ? item.staySegments : [])
      .filter(Boolean)
      .map((segment, index) => ({
        id: segment.id || `stay_${Date.now()}_${index}`,
        type: String(segment.type || 'rest').trim() || 'rest',
        label: String(segment.label || '').trim() || '숙소 일정',
        time: normalizeLodgeSegmentTime(segment.time, fallbackTime),
        duration: Math.max(10, Number(segment.duration) || 60),
        note: String(segment.note || '').trim(),
      }))
      .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    return item;
  };

  const getLodgeSegmentDragItems = (place = {}) => {
    if (!isLodgeStay(place?.types)) return [];
    const defaultStayDuration = (() => {
      const checkin = timeToMinutes(place.time || '15:00');
      const checkout = timeToMinutes(place.lodgeCheckoutTime || '11:00');
      const overnightCheckout = checkout <= checkin ? checkout + 1440 : checkout;
      return Math.max(30, overnightCheckout - checkin);
    })();
    return [
      { id: `${place.id}_stay`, type: 'stay', label: '숙박', time: normalizeLodgeSegmentTime(place.time, '15:00'), duration: defaultStayDuration, note: '' },
      { id: `${place.id}_rest`, type: 'rest', label: '휴식', time: normalizeLodgeSegmentTime(place.time, '15:00'), duration: 60, note: '' },
      { id: `${place.id}_swim`, type: 'swim', label: '물놀이', time: normalizeLodgeSegmentTime(place.time, '15:00'), duration: 90, note: '' },
    ];
  };

  const extractLodgeSegmentMemo = (parentMemo = '', segmentType = '') => {
    const normalizedType = String(segmentType || '').trim();
    if (!normalizedType) return '';
    const labelMap = {
      stay: ['숙박'],
      rest: ['휴식'],
      swim: ['물놀이'],
    };
    const labels = labelMap[normalizedType] || [];
    if (!labels.length) return '';
    const lines = String(parentMemo || '')
      .split(/\r?\n/)
      .map((line) => String(line || '').trim())
      .filter(Boolean);
    const matched = lines
      .map((line) => {
        const match = line.match(/^([^:：-]+?)\s*[:：-]\s*(.+)$/);
        if (!match) return '';
        const [, rawLabel, content] = match;
        return labels.includes(String(rawLabel || '').trim()) ? String(content || '').trim() : '';
      })
      .filter(Boolean);
    return matched.join('\n');
  };

  const buildLibraryPayloadFromLodgeSegment = (place = {}, segment = {}) => {
    const segmentType = String(segment.type || 'rest').trim() || 'rest';
    const segmentMemo = extractLodgeSegmentMemo(place.memo || '', segmentType) || segment.note || '';
    const baseTypes = segmentType === 'stay'
      ? ['lodge', 'stay']
      : segmentType === 'swim'
        ? ['lodge', 'experience']
        : ['lodge', 'rest'];
    return normalizeLibraryPlace({
      id: `place_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: `${place.name || place.activity || '숙소'} · ${segment.label || '내부 일정'}`,
      types: baseTypes,
      address: place.address || place.receipt?.address || '',
      memo: segmentMemo,
      duration: Math.max(10, Number(segment.duration) || 30),
      time: normalizeLodgeSegmentTime(segment.time, place.time || '15:00'),
      receipt: { address: place.address || place.receipt?.address || '', items: [] },
      business: normalizeBusiness(place.business || {}),
      revisit: typeof place.revisit === 'boolean' ? place.revisit : false,
      sourceLodgeId: place.id,
      sourceLodgeName: place.name || place.activity || '숙소',
      segmentType,
      renderAsSegmentCard: true,
    });
  };

  const getPlanItemPrimaryAddress = (item = {}) => String(item?.receipt?.address || item?.address || '').trim();
  const getShipStartAddress = (item = {}) => String(item?.receipt?.address || item?.startPoint || '').trim();
  const getShipEndAddress = (item = {}) => String(item?.endAddress || item?.endPoint || '').trim();
  const applyGeoFieldsToRecord = (record = {}) => {
    if (!record || typeof record !== 'object') return record;
    if (Array.isArray(record?.types) && record.types.includes('ship')) {
      const startAddress = getShipStartAddress(record);
      const endAddress = getShipEndAddress(record);
      record.geoStart = isGeoStaleForAddress(record.geoStart, startAddress)
        ? normalizeGeoPoint({ address: startAddress }, startAddress)
        : normalizeGeoPoint(record.geoStart, startAddress);
      record.geoEnd = isGeoStaleForAddress(record.geoEnd, endAddress)
        ? normalizeGeoPoint({ address: endAddress }, endAddress)
        : normalizeGeoPoint(record.geoEnd, endAddress);
      delete record.geo;
      return record;
    }
    const address = getPlanItemPrimaryAddress(record);
    record.geo = isGeoStaleForAddress(record.geo, address)
      ? normalizeGeoPoint({ address }, address)
      : normalizeGeoPoint(record.geo, address);
    delete record.geoStart;
    delete record.geoEnd;
    return record;
  };

  const cloneGeoForRecord = (record = {}) => {
    if (Array.isArray(record?.types) && record.types.includes('ship')) {
      return {
        geoStart: normalizeGeoPoint(record.geoStart, getShipStartAddress(record)),
        geoEnd: normalizeGeoPoint(record.geoEnd, getShipEndAddress(record)),
      };
    }
    return { geo: normalizeGeoPoint(record.geo, getPlanItemPrimaryAddress(record)) };
  };

  const normalizeLibraryPlace = (place, dayNumber = 1) => {
    if (!place) return place;
    place.types = normalizeTagOrder(Array.isArray(place.types) && place.types.length ? place.types : ['place']);
    place.business = normalizeBusiness(place.business || {});
    if (!place.receipt) place.receipt = { address: place.address || '', items: [] };
    if (!Array.isArray(place.receipt.items)) place.receipt.items = [];
    place.receipt.items = place.receipt.items
      .filter(Boolean)
      .map((item) => ({
        ...item,
        name: String(item?.name || '').trim(),
        price: Number(item?.price) || 0,
        qty: Math.max(1, Number(item?.qty) || 1),
        selected: item?.selected !== false,
      }));

    if (place.types.includes('ship')) {
      const shipItem = ensureShipItemDefaults({
        ...place,
        activity: place.name || place.activity || '',
        receipt: deepClone(place.receipt),
      }, dayNumber);
      place.name = shipItem.activity;
      place.time = shipItem.time;
      place.loadEndTime = shipItem.loadEndTime;
      place.boardTime = shipItem.boardTime;
      place.sailDuration = shipItem.sailDuration;
      place.duration = shipItem.duration;
      place.startPoint = shipItem.startPoint;
      place.endPoint = shipItem.endPoint;
      place.endAddress = shipItem.endAddress || place.endAddress || '';
      place.isTimeFixed = true;
      place.travelTimeOverride = shipItem.travelTimeOverride;
      place.bufferTimeOverride = shipItem.bufferTimeOverride;
      place.receipt = shipItem.receipt;
      place.address = shipItem.receipt?.address || place.address || shipItem.startPoint || '';
      place.price = Number(shipItem.price) || 0;
      applyGeoFieldsToRecord(place);
      return place;
    }

    place.name = String(place.name || place.activity || '').trim();
    place.address = String(place.address || place.receipt.address || '').trim();
    place.receipt.address = place.address || place.receipt.address || '';
    place.price = place.receipt.items.reduce((sum, item) => sum + (item.selected === false ? 0 : getMenuLineTotal(item)), 0);
    if (isFullLodgeStayItem(place)) ensureLodgeStaySegments(place);
    applyGeoFieldsToRecord(place);
    return place;
  };

  const createTimelineItem = ({ dayNumber = 1, baseTime = '09:00', types = ['place'], placeData = null, fallbackLabel = '장소' }) => {
    const normalizedTypes = normalizeTagOrder(placeData?.types || types);
    const isStandaloneLodgeSegment = isStandaloneLodgeSegmentItem({
      types: normalizedTypes,
      renderAsSegmentCard: placeData?.renderAsSegmentCard,
      segmentType: placeData?.segmentType,
    });
    const isFullLodge = isLodgeStay(normalizedTypes) && !isStandaloneLodgeSegment;
    const receiptPayload = placeData?.receipt
      ? deepClone(placeData.receipt)
      : { address: placeData?.address || '', items: [] };
    const priceFromReceipt = Array.isArray(receiptPayload.items)
      ? receiptPayload.items.reduce((sum, menu) => sum + (menu?.selected === false ? 0 : getMenuLineTotal(menu)), 0)
      : 0;
    const isShip = normalizedTypes.includes('ship');
    const nextItem = {
      id: `item_${Date.now()}`,
      time: placeData?.time || baseTime,
      loadEndTime: placeData?.loadEndTime,
      boardTime: placeData?.boardTime,
      activity: placeData?.name || placeData?.activity || (isShip ? '새 페리 일정' : `새 ${fallbackLabel}`),
      types: normalizedTypes,
      revisit: typeof placeData?.revisit === 'boolean' ? placeData.revisit : false,
      business: normalizeBusiness(placeData?.business || {}),
      price: isStandaloneLodgeSegment ? 0 : (placeData ? (priceFromReceipt || placeData.price || 0) : 0),
      duration: Number(placeData?.duration || (isShip ? 330 : 60)),
      sailDuration: Number(placeData?.sailDuration || (isShip ? 240 : 0)) || undefined,
      startPoint: placeData?.startPoint,
      endPoint: placeData?.endPoint,
      state: placeData?.state || 'unconfirmed',
      travelTimeOverride: placeData?.travelTimeOverride || '15분',
      bufferTimeOverride: placeData?.bufferTimeOverride || '10분',
      receipt: receiptPayload,
      memo: placeData?.memo || '',
      isTimeFixed: isShip ? true : !!placeData?.isTimeFixed,
      staySegments: isFullLodge ? deepClone(placeData?.staySegments || []) : undefined,
      sourceLodgeId: placeData?.sourceLodgeId,
      sourceLodgeName: placeData?.sourceLodgeName,
      segmentType: placeData?.segmentType,
      renderAsSegmentCard: !!placeData?.renderAsSegmentCard,
      ...cloneGeoForRecord(placeData || {}),
    };
    if (isShip) ensureShipItemDefaults(nextItem, dayNumber);
    if (isFullLodge) ensureLodgeStaySegments(nextItem);
    applyGeoFieldsToRecord(nextItem);
    return nextItem;
  };

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

  const createNewPlan = async (regionOverride = '') => {
    if (!user || user.isGuest) {
      setLastAction('게스트 모드에서는 새 일정 생성이 제한됩니다.');
      return;
    }
    const id = `plan_${Date.now()}`;
    const region = String(regionOverride || newPlanRegion || '').trim() || '새 여행지';
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
    const isEditableElement = (el) => {
      if (!(el instanceof HTMLElement)) return false;
      if (el.isContentEditable) return true;
      const tagName = el.tagName;
      if (tagName === 'TEXTAREA') return true;
      if (tagName !== 'INPUT') return false;
      const type = (el.getAttribute('type') || 'text').toLowerCase();
      return !['button', 'checkbox', 'radio', 'range', 'submit', 'reset', 'file', 'color'].includes(type);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Control') ctrlHeldRef.current = true;
      if (e.key === 'Backspace' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target instanceof HTMLElement ? e.target : document.activeElement;
        if (!isEditableElement(target)) {
          e.preventDefault();
        }
      }
    };
    const onKeyUp = (e) => { if (e.key === 'Control') ctrlHeldRef.current = false; };
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp);
    };
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
          plan: (d.plan || []).map((p) => {
            const nextItem = { ...p };
            if (!nextItem.receipt) nextItem.receipt = { address: nextItem.address || '', items: [] };
            if (!Array.isArray(nextItem.receipt.items)) nextItem.receipt.items = [];
            applyGeoFieldsToRecord(nextItem);
            return nextItem;
          })
        }));
        setItinerary({
          days: patchedDays,
          places: (sharedData.places || []).map((place) => normalizeLibraryPlace({ ...place })),
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

  // [DEPRECATED] 중복된 메타데이터 전용 저장 로직 제거 (아래 6656번 라인의 통합 저장 로직으로 대체)
  /* useEffect(() => {
    if (!user || user.isGuest || loading || isSharedReadOnly) return;
    const timer = setTimeout(() => {
      ...
    }, 350);
    return () => clearTimeout(timer);
  }, [...]); */

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
    // 자동 열기 제거 — 사용자가 직접 목록열기 버튼으로 열도록 변경
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
        startAutoScroll();
      }
      if (isDraggingActiveRef.current) {
        e.preventDefault();
        lastTouchYRef.current = t.clientY;
        setDragCoord({ x: t.clientX, y: t.clientY });
        const el = document.elementFromPoint(t.clientX, t.clientY);
        const droptargetEl = el?.closest('[data-droptarget]');
        const dropitemEl = el?.closest('[data-dropitem]');
        const dropdelEl = el?.closest('[data-deletezone]');
        const dropActionEl = el?.closest('[data-drag-action]');
        if (droptargetEl) {
          const parsedTarget = parseInsertDropTargetValue(droptargetEl.dataset.droptarget);
          if (parsedTarget) {
            setDropTarget(parsedTarget);
            setDropOnItem(null);
            setDragBottomTarget('');
          }
        } else if (dropitemEl) {
          const [dIdx, pIdx] = dropitemEl.dataset.dropitem.split('-').map(Number);
          setDropOnItem({ dayIdx: dIdx, pIdx });
          setDropTarget(null);
          setDragBottomTarget('');
        } else if (dropActionEl) {
          setDragBottomTarget(dropActionEl.getAttribute('data-drag-action') || '');
          setDropTarget(null);
          setDropOnItem(null);
        } else {
          setDropTarget(null);
          setDropOnItem(null);
          setDragBottomTarget('');
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
      stopAutoScroll();
      touchDragSourceRef.current = null;
      isDraggingActiveRef.current = false;
      setDraggingFromLibrary(null);
      setDraggingFromTimeline(null);
      setDropTarget(null);
      setDropOnItem(null);
      setIsDroppingOnDeleteZone(false);
      setDragBottomTarget('');
    };
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [startAutoScroll, stopAutoScroll]); // refs + stable setters only

  const endTouchDragLock = () => { };

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
    if (!tripStartDate || !tripEndDate) return;
    const expectedDays = Math.max(1, Math.round((new Date(tripEndDate) - new Date(tripStartDate)) / 86400000) + 1);
    if (!Number.isFinite(expectedDays) || expectedDays <= 0) return;

    setItinerary((prev) => {
      const currentDays = Array.isArray(prev?.days) ? prev.days : [];
      if (!currentDays.length) {
        return {
          ...prev,
          days: Array.from({ length: expectedDays }, (_, idx) => ({ day: idx + 1, plan: [] })),
        };
      }

      let nextDays = currentDays.map((day, idx) => ({
        ...day,
        day: idx + 1,
        plan: Array.isArray(day?.plan) ? day.plan : [],
      }));
      let changed = false;

      if (nextDays.length < expectedDays) {
        nextDays = [
          ...nextDays,
          ...Array.from({ length: expectedDays - nextDays.length }, (_, extraIdx) => ({ day: nextDays.length + extraIdx + 1, plan: [] })),
        ];
        changed = true;
      } else if (nextDays.length > expectedDays) {
        const overflowDays = nextDays.slice(expectedDays);
        const canTrimOverflow = overflowDays.every((day) => (day.plan || []).filter(Boolean).length === 0);
        if (canTrimOverflow) {
          nextDays = nextDays.slice(0, expectedDays);
          changed = true;
        }
      }

      if (!changed && nextDays.every((day, idx) => day.day === idx + 1)) return prev;
      return { ...prev, days: nextDays };
    });
  }, [tripStartDate, tripEndDate]);

  useEffect(() => {
    if (loading || !user || user.isGuest || isSharedReadOnly) return;
    const currentData = { ...itinerary, tripRegion, tripStartDate, tripEndDate };

    // [보안/안정성] 이미 로드된 데이터가 있거나, 사용자가 의도적으로 비운 경우(places가 한때 있었던 경우 등) 복구 방지
    // local storage에 한 번이라도 저장이 되었다면 신규 계정의 초기 상태가 아니라고 판단
    const hasBeenInitialized = !!safeLocalStorageGet(`init_done_${user.uid}_${currentPlanId}`, '');
    if (hasBeenInitialized) return;

    if (!isRecoverableEmptyJejuMainPlan(currentData)) return;
    const recoveryKey = `${user.uid}:${currentPlanId}:${tripStartDate}:${tripEndDate}`;
    if (emptyPlanRecoveryKeyRef.current === recoveryKey) return;
    emptyPlanRecoveryKeyRef.current = recoveryKey;

    const { recovered, nextState, calculatedDays } = buildRecoveredJejuPlanState();
    setItinerary(nextState);
    setTripRegion(recovered.tripRegion || '제주');
    setTripStartDate(recovered.tripStartDate || '');
    setTripEndDate(recovered.tripEndDate || '');
    setLastAction('비어 있던 제주 기본 일정 셸을 샘플 일정으로 복구했습니다.');

    safeLocalStorageSet(`init_done_${user.uid}_${currentPlanId}`, 'true');

    setDoc(doc(db, 'users', user.uid, 'itinerary', currentPlanId || 'main'), {
      ...recovered,
      days: calculatedDays,
      updatedAt: Date.now(),
    }).catch((e) => console.error('빈 일정 자동 복구 저장 실패:', e));
  }, [loading, user, isSharedReadOnly, itinerary.days, itinerary.places, tripRegion, tripStartDate, tripEndDate, currentPlanId]);

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
        const c = hasGeoCoords(p.geo) && !isGeoStaleForAddress(p.geo, addr)
          ? p.geo
          : await geocodeAddress(addr);
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
    // 카드 하단(바닥 기준)이 상단에 닿을 때 축소되도록 기준을 늦춘다.
    const COLLAPSE_AT = 0;
    const EXPAND_AT = 56;
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
    if (!planVariantPicker) return;
    const close = () => setPlanVariantPicker(null);
    const closeOnOutside = (e) => {
      const target = e.target;
      if (target?.closest?.('[data-plan-picker="true"]')) return;
      if (target?.closest?.('[data-plan-picker-trigger="true"]')) return;
      setPlanVariantPicker(null);
    };
    document.addEventListener('pointerdown', closeOnOutside, true);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside, true);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [planVariantPicker]);


  const MAX_BUDGET = itinerary.maxBudget || 1500000;
  const [editingBudget, setEditingBudget] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const totalTimelineItems = useMemo(
    () => (itinerary.days || []).reduce((sum, d) => sum + ((d?.plan || []).filter(p => p.type !== 'backup').length), 0),
    [itinerary.days]
  );
  const FUEL_PRICE_PER_LITER = 1700;
  const CAR_EFFICIENCY = 13;
  // 코드 오류 수정 및 3일차 일정 변경 키
  const STORAGE_KEY = 'travel_planner_v105_fix_syntax_day3';
  const TIME_UNIT = 1;
  const DEFAULT_TRAVEL_MINS = 15;
  const DEFAULT_BUFFER_MINS = 10;
  const BUFFER_STEP = 1;
  const SHOW_HERO_COMPACT_BAR = true;
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

    // 2차 검수: 지나친 과소값만 보정 (기존 18km/h 하한은 과보정 발생)
    const byRoadSpeed = Math.ceil((d / 35) * 60); // 35km/h 기준
    const byStraight = Math.ceil((s / 45) * 60); // 직선거리 45km/h 기준
    const signalPenalty = d >= 0.25 ? 2 : 1;
    const shortTripFloor = d >= 0.25 && d < 1.2 ? 4 : (d < 0.25 ? 2 : 0);

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
          if (hasGeoCoords(p.geo) && !isGeoStaleForAddress(p.geo, queryAddr)) {
            newMap[p.id] = +haversineKm(bLat, bLon, p.geo.lat, p.geo.lon).toFixed(1);
          } else if (geoCacheRef.current[queryAddr]) {
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
    if (!Number.isFinite(num) || num < 0) return '미계산';
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
  const isStandaloneLodgeSegmentItem = (item = {}) => (
    !!item?.renderAsSegmentCard
    && !!item?.sourceLodgeId
    && !!String(item?.segmentType || '').trim()
  );
  const isFullLodgeStayItem = (item = {}) => isLodgeStay(item?.types) && !isStandaloneLodgeSegmentItem(item);
  const getEffectivePlanPrice = (item = {}) => {
    if (isStandaloneLodgeSegmentItem(item)) return 0;
    return Number(item?.price || 0);
  };
  const getPlaceSearchName = (item = {}) => String(item?.sourceLodgeName || item?.activity || item?.name || '').trim();
  const isOvernightBusinessWindow = (business = {}) => {
    if (!business?.open || !business?.close) return false;
    return timeToMinutes(business.close) <= timeToMinutes(business.open);
  };
  const isMinuteWithinBusinessWindow = (minute, business = {}) => {
    if (!business?.open && !business?.close) return true;
    const openMinute = business?.open ? timeToMinutes(business.open) : null;
    const closeMinute = business?.close ? timeToMinutes(business.close) : null;
    if (openMinute === null || closeMinute === null) return true;
    if (!isOvernightBusinessWindow(business)) return minute >= openMinute && minute < closeMinute;
    return minute >= openMinute || minute < closeMinute;
  };
  const getOpenCloseWarningText = (minute, business = {}, beforeText, afterText) => {
    if (!business?.open || !business?.close) return '';
    const openMinute = timeToMinutes(business.open);
    const closeMinute = timeToMinutes(business.close);
    if (isMinuteWithinBusinessWindow(minute, business)) return '';
    if (!isOvernightBusinessWindow(business)) {
      return minute < openMinute ? beforeText : afterText;
    }
    if (minute >= closeMinute && minute < openMinute) return beforeText;
    return afterText;
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
      if (role === 'from') {
        return String(
          item.endAddress
          || item.geoEnd?.address
          || item.endPoint
          || ''
        ).trim();
      }
      return String(
        item.receipt?.address
        || item.geoStart?.address
        || item.startPoint
        || ''
      ).trim();
    }
    return String(
      item.receipt?.address
      || item.address
      || item.geo?.address
      || ''
    ).trim();
  };
  const getRouteGeoPoint = (item, role = 'from') => {
    if (!item) return null;
    if (item.types?.includes('ship')) {
      const geo = role === 'from'
        ? normalizeGeoPoint(item.geoEnd, getShipEndAddress(item))
        : normalizeGeoPoint(item.geoStart, getShipStartAddress(item));
      return hasGeoCoords(geo) ? geo : null;
    }
    const geo = normalizeGeoPoint(item.geo, getPlanItemPrimaryAddress(item));
    return hasGeoCoords(geo) ? geo : null;
  };
  const getRouteCacheKey = (fromAddress = '', toAddress = '') => `${String(fromAddress || '').trim()}|${String(toAddress || '').trim()}`;
  const summarizeRouteFailureReason = (errorMessage = '') => {
    const normalized = String(errorMessage || '').trim();
    if (!normalized) return '경로실패';
    if (/kakao/i.test(normalized)) return '카카오경로실패';
    if (normalized.includes('출발지 좌표')) return '출발지 찾기실패';
    if (normalized.includes('도착지 좌표')) return '도착지 찾기실패';
    if (normalized.includes('route unavailable') || normalized.includes('near-zero route') || normalized.includes('directions failed')) return '경로없음';
    return '주소확인';
  };
  const getRouteDistanceStatus = (prevItem, targetItem) => {
    if (!prevItem) return '출발지없음';
    if (!targetItem) return '도착지없음';
    const fromAddress = getRouteAddress(prevItem, 'from');
    const toAddress = getRouteAddress(targetItem, 'to');
    if (!String(fromAddress || '').trim()) return '출발지없음';
    if (!String(toAddress || '').trim()) return '도착지없음';
    if (String(fromAddress).includes('없음') || String(toAddress).includes('없음')) return '주소확인';
    const cacheKey = getRouteCacheKey(fromAddress, toAddress);
    const cachedRoute = routeCache[cacheKey];
    if (cachedRoute?.failed) return cachedRoute.failedReason || '경로실패';
    if (Number.isFinite(Number(cachedRoute?.distance)) && Number(cachedRoute.distance) >= 0) {
      return formatDistanceText(cachedRoute.distance);
    }
    return formatDistanceText(targetItem?.distance);
  };
  const shouldAutoCalculateRoute = (dayIdx, targetIdx) => {
    let prevItem;
    if (targetIdx === 0) {
      if (dayIdx <= 0) return false;
      const prevDayPlan = (itinerary.days?.[dayIdx - 1]?.plan || []).filter((item) => item && item.type !== 'backup');
      prevItem = prevDayPlan[prevDayPlan.length - 1];
    } else {
      prevItem = itinerary.days?.[dayIdx]?.plan?.[targetIdx - 1];
    }
    const targetItem = itinerary.days?.[dayIdx]?.plan?.[targetIdx];
    if (!prevItem || !targetItem || targetItem.type === 'backup' || targetItem.types?.includes('ship')) return false;
    const fromAddress = getRouteAddress(prevItem, 'from');
    const toAddress = getRouteAddress(targetItem, 'to');
    if (!fromAddress || !toAddress || fromAddress.includes('없음') || toAddress.includes('없음')) return false;
    const hasDistance = Number.isFinite(Number(targetItem.distance)) && Number(targetItem.distance) >= 0;
    const hasTravelAuto = String(targetItem.travelTimeAuto || '').trim() !== '';
    return !hasDistance || !hasTravelAuto;
  };
  const geocodeAddress = useCallback(async (address) => {
    const key = String(address || '').trim();
    if (!key) return null;
    if (geoCacheRef.current[key]) return geoCacheRef.current[key];
    try {
      const result = await searchAddressFromPlaceName(key, tripRegion);
      if (result?.lat && result?.lon) {
        const coord = {
          address: String(result.address || key).trim(),
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          source: result.source || 'lookup',
          updatedAt: new Date().toISOString(),
        };
        geoCacheRef.current[key] = coord;
        return coord;
      }
    } catch {
      // fallback below
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(key)}&format=json&limit=1`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return null;
      const coord = {
        address: key,
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        source: 'nominatim',
        updatedAt: new Date().toISOString(),
      };
      geoCacheRef.current[key] = coord;
      return coord;
    } catch {
      return null;
    }
  }, [tripRegion]);

  const geoSyncRequestKeyRef = useRef('');
  const deepClone = (value) => JSON.parse(JSON.stringify(value));
  const routePreviewEndpointActions = useMemo(() => {
    const allShips = (itinerary.days || []).flatMap((day, dayIdx) => (
      (day.plan || [])
        .filter((item) => item && item.type !== 'backup' && item.types?.includes('ship'))
        .map((item, shipIdx) => ({ item, dayIdx, shipIdx }))
    ));
    const firstShip = allShips[0]?.item || null;
    const lastShip = allShips[allShips.length - 1]?.item || null;

    const actions = [];
    if (firstShip) {
      actions.push({
        id: `${firstShip.id}:ship-start`,
        label: '첫 페리 출발지 제외',
        hidden: !!hiddenRoutePreviewEndpoints[`${firstShip.id}:ship-start`],
      });
    }
    if (lastShip) {
      actions.push({
        id: `${lastShip.id}:ship-end`,
        label: '마지막 페리 도착지 제외',
        hidden: !!hiddenRoutePreviewEndpoints[`${lastShip.id}:ship-end`],
      });
    }
    return actions;
  }, [itinerary.days, hiddenRoutePreviewEndpoints]);

  const routePreviewPointSource = useMemo(() => {
    const allShips = (itinerary.days || []).flatMap((day, dayIdx) => (
      (day.plan || [])
        .filter((item) => item && item.type !== 'backup' && item.types?.includes('ship'))
        .map((item, shipIdx) => ({ item, dayIdx, shipIdx }))
    ));
    const firstShip = allShips[0]?.item || null;
    const lastShip = allShips[allShips.length - 1]?.item || null;

    return (itinerary.days || []).map((day, index) => {
      const points = (day.plan || [])
        .filter((item) => item && item.type !== 'backup')
        .flatMap((item) => {
          if (item.types?.includes('ship')) {
            const startKey = `${item.id}:ship-start`;
            const endKey = `${item.id}:ship-end`;
            const startAddress = String(item.receipt?.address || item.startPoint || '').trim();
            const endAddress = String(item.endAddress || item.endPoint || '').trim();
            const startPoint = {
              id: startKey,
              label: `${item.activity || '페리'} 출발`,
              address: startAddress,
              geo: normalizeGeoPoint(item.geoStart, startAddress),
              isEndpointToggle: item.id === firstShip?.id,
              endpointLabel: '첫 페리 출발지 제외',
            };
            const endPoint = {
              id: endKey,
              label: `${item.activity || '페리'} 도착`,
              address: endAddress,
              geo: normalizeGeoPoint(item.geoEnd, endAddress),
              isEndpointToggle: item.id === lastShip?.id,
              endpointLabel: '마지막 페리 도착지 제외',
            };
            return [startPoint, endPoint]
              .filter((point) => point.address)
              .filter((point) => !hiddenRoutePreviewEndpoints[point.id]);
          }
          const address = String(item.receipt?.address || item.address || '').trim();
          if (!address) return [];
          return [{
            id: item.id,
            label: item.activity || item.name || '일정',
            address,
            geo: normalizeGeoPoint(item.geo, address),
            isEndpointToggle: false,
            endpointLabel: '',
          }];
        });

      return {
        day: day.day || index + 1,
        color: ROUTE_PREVIEW_COLORS[index % ROUTE_PREVIEW_COLORS.length],
        points,
      };
    }).filter((entry) => entry.points.length >= 2);
  }, [itinerary.days, hiddenRoutePreviewEndpoints]);

  useEffect(() => {
    let cancelled = false;
    const jobs = [];

    (itinerary.places || []).forEach((place, placeIdx) => {
      const address = String(place?.address || place?.receipt?.address || '').trim();
      if (!address || !isGeoStaleForAddress(place?.geo, address)) return;
      jobs.push({ kind: 'place', placeIdx, field: 'geo', address });
    });

    (itinerary.days || []).forEach((day, dayIdx) => {
      (day.plan || []).forEach((item, pIdx) => {
        if (!item || item.type === 'backup') return;
        if (item.types?.includes('ship')) {
          const startAddress = getShipStartAddress(item);
          const endAddress = getShipEndAddress(item);
          if (startAddress && isGeoStaleForAddress(item.geoStart, startAddress)) {
            jobs.push({ kind: 'plan', dayIdx, pIdx, field: 'geoStart', address: startAddress });
          }
          if (endAddress && isGeoStaleForAddress(item.geoEnd, endAddress)) {
            jobs.push({ kind: 'plan', dayIdx, pIdx, field: 'geoEnd', address: endAddress });
          }
          return;
        }
        const address = getPlanItemPrimaryAddress(item);
        if (!address || !isGeoStaleForAddress(item.geo, address)) return;
        jobs.push({ kind: 'plan', dayIdx, pIdx, field: 'geo', address });
      });
    });

    if (!jobs.length) {
      geoSyncRequestKeyRef.current = '';
      return undefined;
    }

    const requestKey = jobs.map((job) => `${job.kind}:${job.field}:${job.address}`).join('|');
    if (geoSyncRequestKeyRef.current === requestKey) return undefined;
    geoSyncRequestKeyRef.current = requestKey;

    const syncGeo = async () => {
      const uniqueAddresses = [...new Set(jobs.map((job) => job.address))];
      const resolvedMap = {};
      for (const address of uniqueAddresses) {
        resolvedMap[address] = await geocodeAddress(address);
        if (cancelled) return;
      }
      if (cancelled) return;
      setItinerary((prev) => {
        const nextData = JSON.parse(JSON.stringify(prev));
        let changed = false;
        jobs.forEach((job) => {
          const resolved = resolvedMap[job.address];
          if (!hasGeoCoords(resolved)) return;
          const nextGeo = normalizeGeoPoint({
            address: job.address,
            lat: resolved.lat,
            lon: resolved.lon,
            source: resolved.source || 'lookup',
            updatedAt: resolved.updatedAt || new Date().toISOString(),
          }, job.address);
          if (job.kind === 'place') {
            const place = nextData.places?.[job.placeIdx];
            if (!place || !isGeoStaleForAddress(place[job.field], job.address)) return;
            place[job.field] = nextGeo;
            changed = true;
            return;
          }
          const item = nextData.days?.[job.dayIdx]?.plan?.[job.pIdx];
          if (!item || !isGeoStaleForAddress(item[job.field], job.address)) return;
          item[job.field] = nextGeo;
          changed = true;
        });
        return changed ? nextData : prev;
      });
      geoSyncRequestKeyRef.current = '';
    };

    void syncGeo();
    return () => {
      cancelled = true;
    };
  }, [itinerary.days, itinerary.places, geocodeAddress]);

  useEffect(() => {
    let cancelled = false;

    const buildRoutePreview = async () => {
      const dayEntries = routePreviewPointSource;
      if (!dayEntries.length) {
        if (!cancelled) setRoutePreviewDays([]);
        return;
      }

      setRoutePreviewLoading(true);
      try {
        const nextDays = [];
        for (const entry of dayEntries) {
          const coords = [];
          for (const point of entry.points) {
            const geo = hasGeoCoords(point.geo) && !isGeoStaleForAddress(point.geo, point.address)
              ? point.geo
              : await geocodeAddress(point.address);
            if (!geo?.lat || !geo?.lon) continue;
            coords.push({
              ...point,
              lat: Number(geo.lat),
              lon: Number(geo.lon),
            });
          }
          if (coords.length >= 2) {
            nextDays.push({ ...entry, points: coords });
          }
        }
        if (!cancelled) setRoutePreviewDays(nextDays);
      } finally {
        if (!cancelled) setRoutePreviewLoading(false);
      }
    };

    void buildRoutePreview();
    return () => {
      cancelled = true;
    };
  }, [routePreviewPointSource, geocodeAddress]);

  const routePreviewMap = useMemo(() => {
    const allPoints = routePreviewDays.flatMap((day) => day.points || []);
    if (!allPoints.length) return [];

    const lats = allPoints.map((point) => point.lat);
    const lons = allPoints.map((point) => point.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const latRange = Math.max(0.01, maxLat - minLat);
    const lonRange = Math.max(0.01, maxLon - minLon);

    return routePreviewDays.map((day) => ({
      ...day,
      points: day.points.map((point) => ({
        ...point,
        x: 12 + ((point.lon - minLon) / lonRange) * 76,
        y: 12 + (1 - ((point.lat - minLat) / latRange)) * 76,
      })),
    }));
  }, [routePreviewDays]);

  const normalizeAlternative = (alt = {}) => {
    const receipt = alt.receipt
      ? deepClone(alt.receipt)
      : { address: alt.address || '', items: deepClone(alt.items || []) };
    if (!Array.isArray(receipt.items)) receipt.items = [];
    const normalized = {
      activity: alt.activity || alt.name || '새로운 플랜',
      price: Number(alt.price || 0),
      memo: alt.memo || '',
      revisit: typeof alt.revisit === 'boolean' ? alt.revisit : false,
      business: normalizeBusiness(alt.business || {}),
      types: Array.isArray(alt.types) && alt.types.length ? deepClone(alt.types) : ['place'],
      duration: Number(alt.duration || 60),
      receipt,
      ...cloneGeoForRecord({ ...alt, receipt }),
    };
    applyGeoFieldsToRecord(normalized);
    return normalized;
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

  const budgetSummary = useMemo(() => {
    let totalSpent = 0;
    if (!itinerary || !itinerary.days) return { total: 0, remaining: MAX_BUDGET };
    itinerary.days.forEach(day => {
      day.plan?.forEach(p => {
        if (p.type !== 'backup') {
          totalSpent += (Number(p.price) || 0);
          if (p.distance) totalSpent += calculateFuelCost(p.distance);
        }
      });
    });
    return { total: totalSpent, remaining: (MAX_BUDGET || 0) - totalSpent };
  }, [itinerary, MAX_BUDGET]);

  const distanceSortedPlaces = useMemo(() => {
    const list = [...(itinerary.places || [])];
    if (!basePlanRef?.id) {
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko'));
    }
    return list.sort((a, b) => {
      const da = placeDistanceMap[a.id] ?? Infinity;
      const db = placeDistanceMap[b.id] ?? Infinity;
      return da - db;
    });
  }, [itinerary.places, basePlanRef, placeDistanceMap]);

  const updateMemo = (dayIdx, pIdx, val) => {
    setItinerary(prev => {
      const draft = JSON.parse(JSON.stringify(prev));
      if (!draft.days?.[dayIdx]?.plan?.[pIdx]) return prev;
      draft.days[dayIdx].plan[pIdx].memo = val;
      return draft;
    });
  };

  const getTimingConflictRecommendation = (dayIdx, pIdx) => null;
  const applyTimingConflictRecommendation = (dayIdx, pIdx) => { };


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
    if (business.open && business.close) {
      if (!isMinuteWithinBusinessWindow(start, business)) {
        const openMinute = timeToMinutes(business.open);
        const closeMinute = timeToMinutes(business.close);
        if (!isOvernightBusinessWindow(business) && start < openMinute) {
          return `운영 시작 전 방문 (${business.open} 이후 권장)`;
        }
        if (isOvernightBusinessWindow(business) && start >= closeMinute && start < openMinute) {
          return `운영 시작 전 방문 (${business.open} 이후 권장)`;
        }
        return `운영 종료 후 방문 (${business.close} 이전 권장)`;
      }
    } else {
      if (business.open && start < timeToMinutes(business.open)) return `운영 시작 전 방문 (${business.open} 이후 권장)`;
      if (business.close && start >= timeToMinutes(business.close)) return `운영 종료 후 방문 (${business.close} 이전 권장)`;
    }
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
    if (business.open && business.close) {
      const openCloseWarn = getOpenCloseWarningText(estimatedMins, business, `영업 전 (${business.open}~)`, '영업 종료');
      if (openCloseWarn) return openCloseWarn;
    } else {
      if (business.open && estimatedMins < timeToMinutes(business.open)) return `영업 전 (${business.open}~)`;
      if (business.close && estimatedMins >= timeToMinutes(business.close)) return `영업 종료`;
    }
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
    if (business.open && business.close) {
      const openCloseWarn = getOpenCloseWarningText(
        refMins,
        business,
        `영업 전 (${business.open} 오픈)`,
        `영업 종료 (${business.close} 마감)`
      );
      if (openCloseWarn) return openCloseWarn;
    } else {
      if (business.open && refMins < timeToMinutes(business.open)) return `영업 전 (${business.open} 오픈)`;
      if (business.close && refMins >= timeToMinutes(business.close)) return `영업 종료 (${business.close} 마감)`;
    }
    if (business.lastOrder && refMins > timeToMinutes(business.lastOrder)) return `라스트오더 이후 (${business.lastOrder})`;
    if (business.entryClose && refMins > timeToMinutes(business.entryClose)) return `입장 마감 이후 (${business.entryClose})`;
    if (business.breakStart && business.breakEnd) {
      const bs = timeToMinutes(business.breakStart);
      const be = timeToMinutes(business.breakEnd);
      if (refMins >= bs && refMins < be) return `브레이크 타임 (${business.breakStart}~${business.breakEnd})`;
    }
    return '';
  };

  const formatBusinessSummary = (businessRaw, context = null) => {
    const business = normalizeBusiness(businessRaw || {});
    const normalizedTypes = Array.isArray(context?.types)
      ? context.types
      : Array.isArray(context)
        ? context
        : [];
    const isLodgeContext = isLodgeStay(normalizedTypes);
    const segs = [];
    if (business.open || business.close) segs.push(`${isLodgeContext ? '체크인' : '운영'} ${business.open || '--:--'} - ${business.close || '--:--'}`);
    if (business.breakStart || business.breakEnd) segs.push(`휴식 ${business.breakStart || '--:--'} - ${business.breakEnd || '--:--'}`);
    if (business.lastOrder || business.entryClose) {
      segs.push(`${isLodgeContext ? '체크아웃' : '마감'} ${business.lastOrder || business.entryClose || '--:--'}`);
    }
    if (business.closedDays.length) {
      segs.push(`휴무 : ${formatClosedDaysSummary(business.closedDays)}`);
    }
    return segs.length ? segs.join(' · ') : '미설정';
  };

  const saveHistory = () => {
    setHistory(prev => {
      try {
        const newHistory = [...prev, JSON.parse(JSON.stringify(itinerary))];
        return newHistory.slice(-20);
      } catch (e) { return prev; }
    });
  };

  const triggerUndoToast = (msg = "변경 사항이 저장되었습니다.") => {
    setUndoMessage(msg);
    setUndoToast(true);
    if (undoToastTimerRef.current) clearTimeout(undoToastTimerRef.current);
    undoToastTimerRef.current = setTimeout(() => setUndoToast(false), 3000);
  };

  const showInfoToast = (msg = '') => {
    const next = String(msg || '').trim();
    if (!next) return;
    setLastAction(next);
    setInfoToast(next);
    if (infoToastTimerRef.current) clearTimeout(infoToastTimerRef.current);
    infoToastTimerRef.current = setTimeout(() => setInfoToast(''), 2600);
  };

  const callAiKeyApi = useCallback(async ({ method = 'GET', token = '', body = undefined } = {}) => {
    let lastError = null;
    for (const endpoint of getAiKeyEndpointCandidates()) {
      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.error || `HTTP ${response.status}`);
        }
        return data;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('AI key API request failed');
  }, []);

  const fetchServerAiKeyStatus = useCallback(async () => {
    if (!auth.currentUser || auth.currentUser.isGuest) {
      setServerAiKeyStatus({ hasStoredKey: false, hasStoredGroqKey: false, hasStoredGeminiKey: false, hasStoredPerplexityKey: false, updatedAt: null, loading: false });
      return;
    }
    setServerAiKeyStatus((prev) => ({ ...prev, loading: true }));
    try {
      const token = await auth.currentUser.getIdToken();
      const data = await callAiKeyApi({ method: 'GET', token });
      setServerAiKeyStatus({
        hasStoredKey: !!data?.hasStoredKey,
        hasStoredGroqKey: !!data?.hasStoredGroqKey,
        hasStoredGeminiKey: !!data?.hasStoredGeminiKey,
        hasStoredPerplexityKey: !!data?.hasStoredPerplexityKey,
        updatedAt: data?.updatedAt || null,
        loading: false,
      });
    } catch (error) {
      setServerAiKeyStatus((prev) => ({ ...prev, loading: false }));
      showInfoToast(`AI 키 상태 확인 실패: ${error?.message || '알 수 없는 오류'}`);
    }
  }, [callAiKeyApi]);

  const saveServerAiKey = useCallback(async () => {
    const nextGroqKey = String(aiSmartFillConfig.apiKey || '').trim();
    const nextGeminiKey = String(aiSmartFillConfig.geminiApiKey || '').trim();
    const nextPerplexityKey = String(aiSmartFillConfig.perplexityApiKey || '').trim();
    if (!nextGroqKey && !nextGeminiKey && !nextPerplexityKey) {
      showInfoToast('저장할 Groq, Gemini 또는 Perplexity API Key를 먼저 입력해 주세요.');
      return;
    }
    if (!auth.currentUser || auth.currentUser.isGuest) {
      showInfoToast('로그인한 계정에서만 암호화 저장을 사용할 수 있습니다.');
      return;
    }
    try {
      const token = await auth.currentUser.getIdToken();
      await callAiKeyApi({
        method: 'POST',
        token,
        body: { groqApiKey: nextGroqKey, geminiApiKey: nextGeminiKey, perplexityApiKey: nextPerplexityKey },
      });
      setAiSmartFillConfig((prev) => ({ ...prev, apiKey: '', geminiApiKey: '', perplexityApiKey: '' }));
      setServerAiKeyStatus((prev) => ({
        ...prev,
        hasStoredKey: true,
        hasStoredGroqKey: prev.hasStoredGroqKey || !!nextGroqKey,
        hasStoredGeminiKey: prev.hasStoredGeminiKey || !!nextGeminiKey,
        hasStoredPerplexityKey: prev.hasStoredPerplexityKey || !!nextPerplexityKey,
        updatedAt: null,
        loading: false,
      }));
      showInfoToast([
        nextGroqKey ? 'Groq API Key 저장 완료' : '',
        nextGeminiKey ? 'Gemini API Key 저장 완료' : '',
        nextPerplexityKey ? 'Perplexity API Key 저장 완료' : '',
      ].filter(Boolean).join(' / '));
      void fetchServerAiKeyStatus();
    } catch (error) {
      showInfoToast(`AI 키 저장 실패: ${error?.message || '알 수 없는 오류'}`);
    }
  }, [aiSmartFillConfig.apiKey, aiSmartFillConfig.geminiApiKey, aiSmartFillConfig.perplexityApiKey, callAiKeyApi, fetchServerAiKeyStatus]);

  const deleteServerAiKey = useCallback(async () => {
    if (!auth.currentUser || auth.currentUser.isGuest) {
      showInfoToast('로그인한 계정에서만 저장된 키를 삭제할 수 있습니다.');
      return;
    }
    try {
      const token = await auth.currentUser.getIdToken();
      await callAiKeyApi({
        method: 'DELETE',
        token,
      });
      setServerAiKeyStatus({ hasStoredKey: false, hasStoredGroqKey: false, hasStoredGeminiKey: false, hasStoredPerplexityKey: false, updatedAt: null, loading: false });
      showInfoToast('저장된 Groq / Gemini / Perplexity API Key를 삭제했습니다.');
    } catch (error) {
      showInfoToast(`저장된 AI 키 삭제 실패: ${error?.message || '알 수 없는 오류'}`);
    }
  }, [callAiKeyApi]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.isGuest) {
      setServerAiKeyStatus({ hasStoredKey: false, hasStoredGroqKey: false, hasStoredGeminiKey: false, hasStoredPerplexityKey: false, updatedAt: null, loading: false });
      return;
    }
    void fetchServerAiKeyStatus();
  }, [authLoading, user?.uid, user?.isGuest, fetchServerAiKeyStatus]);

  useEffect(() => {
    if (showAiSettings) {
      void fetchServerAiKeyStatus();
    }
  }, [showAiSettings, fetchServerAiKeyStatus]);

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
      if (!isFullLodgeStayItem(lastMain)) continue;
      const nextDay = days[dIdx + 1];
      const nextMain = (nextDay?.plan || []).filter(p => p.type !== 'backup');
      if (!nextMain.length) continue;
      const nextFirst = nextMain[0];
      const checkinMins = timeToMinutes(lastMain.time || '00:00');
      const derivedCheckoutMins = timeToMinutes(nextFirst.time)
        - parseMinsLabel(nextFirst.travelTimeOverride, DEFAULT_TRAVEL_MINS)
        - parseMinsLabel(nextFirst.bufferTimeOverride, DEFAULT_BUFFER_MINS);
      const checkoutMins = lastMain.lodgeCheckoutFixed && lastMain.lodgeCheckoutTime
        ? timeToMinutes(lastMain.lodgeCheckoutTime)
        : derivedCheckoutMins;
      if (lastMain.lodgeCheckoutFixed && lastMain.lodgeCheckoutTime) {
        const nextStart = checkoutMins
          + parseMinsLabel(nextFirst.travelTimeOverride, DEFAULT_TRAVEL_MINS)
          + parseMinsLabel(nextFirst.bufferTimeOverride, DEFAULT_BUFFER_MINS);
        nextFirst.time = minutesToTime(nextStart);
      } else if (lastMain.lodgeCheckoutTime) {
        lastMain.lodgeCheckoutTime = minutesToTime(derivedCheckoutMins);
      }
      // 숙소는 항상 다음 날 체크아웃이므로 +1440(24h) 보정
      const actualCheckout = checkoutMins <= checkinMins ? checkoutMins + 1440 : checkoutMins;
      const duration = Math.max(30, actualCheckout - checkinMins);
      const lodgeItem = day.plan.find(p => p.id === lastMain.id);
      if (lodgeItem) {
        lodgeItem.duration = duration;
        if (!lodgeItem.lodgeCheckoutTime) lodgeItem.lodgeCheckoutTime = minutesToTime(derivedCheckoutMins);
      }
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
        if (item?.type !== 'backup' && isFullLodgeStayItem(item)) lastLodgeIdx = idx;
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
        if (item?.type !== 'backup' && isFullLodgeStayItem(item)) lastLodgeIdx = idx;
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
        if (currentItem.types?.includes('ship')) {
          const shipTimeline = getShipTimeline(currentItem);
          currentEndMinutes = shipTimeline.disembark;
        } else {
          currentEndMinutes = timeToMinutes(currentItem.time) + waiting + (currentItem.duration || 0);
        }
        lastMainItemIndex = i;
        continue;
      }

      const travelMinutes = parseMinsLabel(currentItem.travelTimeOverride, DEFAULT_TRAVEL_MINS);
      const displayedBufferMinutes = parseMinsLabel(currentItem.bufferTimeOverride, DEFAULT_BUFFER_MINS);
      const manualBufferLabel = currentItem._manualBufferTimeOverride
        || (!currentItem._isBufferCoordinated ? currentItem.bufferTimeOverride : null)
        || `${DEFAULT_BUFFER_MINS}분`;
      const baseBufferMinutes = parseMinsLabel(manualBufferLabel, DEFAULT_BUFFER_MINS);
      const coordinatedExtraMinutes = currentItem._isBufferCoordinated
        ? Math.max(0, displayedBufferMinutes - baseBufferMinutes)
        : 0;
      currentItem._manualBufferTimeOverride = `${baseBufferMinutes}분`;
      currentItem.bufferTimeOverride = `${baseBufferMinutes}분`;
      currentItem._isBufferCoordinated = false;
      const bufferMinutes = baseBufferMinutes;
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
          if (diff > 0) {
            // 여분 시간이 생김 -> 버퍼 타임으로 흡수 (이동칩 옆 보정 수치)
            const newBuffer = baseBufferMinutes + diff;
            currentItem.bufferTimeOverride = `${newBuffer}분`;
            currentItem._isBufferCoordinated = true;
            currentEndMinutes += diff; // 스케줄 동기화
          } else {
            // 시간이 부족함 -> 1순위로 주황 보정 버퍼를 먼저 소진하고, 남으면 이전 일정 소요시간 축소
            let remainingShortage = Math.abs(diff);
            if (coordinatedExtraMinutes > 0) {
              const consumed = Math.min(coordinatedExtraMinutes, remainingShortage);
              const nextBuffer = displayedBufferMinutes - consumed;
              currentItem.bufferTimeOverride = `${Math.max(baseBufferMinutes, nextBuffer)}분`;
              currentItem._isBufferCoordinated = nextBuffer > baseBufferMinutes;
              remainingShortage -= consumed;
            }

            if (remainingShortage > 0 && !prevItem.types?.includes('ship') && !prevItem.isTimeFixed && !prevItem.isDurationFixed) {
              const oldDuration = prevItem.duration || 0;
              const newDuration = Math.max(30, oldDuration - remainingShortage);
              prevItem.duration = newDuration;
              const actualDiff = newDuration - oldDuration;
              currentEndMinutes += actualDiff;
            } else if (remainingShortage > 0) {
              currentItem._timingConflict = true;
              currentItem._timingConflictReason = '고정/잠금 조건으로 시간 보정 불가';
            }
          }
        }
      } else {
        const actualStartMinutes = naturalArrivalMinutes + waiting;
        currentItem.time = minutesToTime(actualStartMinutes);
      }

      const currentStartMinutes = timeToMinutes(currentItem.time);
      const currentWaiting = currentItem.waitingTime || 0;
      if (currentItem.types?.includes('ship')) {
        const shipTimeline = getShipTimeline(currentItem);
        currentEndMinutes = shipTimeline.disembark;
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

      if (item.types?.includes('ship')) {
        const shipTimeline = getShipTimeline(item);
        const nextLoadStart = shipTimeline.loadStart + delta;
        const loadGap = Math.max(0, shipTimeline.loadEnd - shipTimeline.loadStart);
        const boardAbsolute = shipTimeline.board;
        const nextLoadEnd = Math.min(boardAbsolute, Math.max(nextLoadStart, nextLoadStart + loadGap));
        item.time = minutesToTime(nextLoadStart);
        item.loadEndTime = minutesToTime(nextLoadEnd);
        item.boardTime = minutesToTime(boardAbsolute);
        item.sailDuration = shipTimeline.sailDuration;
        item.duration = Math.max(0, boardAbsolute - nextLoadStart) + item.sailDuration;
        item.isTimeFixed = true;
        if (item.receipt?.shipDetails) {
          item.receipt.shipDetails.depart = item.boardTime;
          item.receipt.shipDetails.loading = `${item.time} ~ ${item.loadEndTime}`;
        }
      } else {
        const currentMinutes = timeToMinutes(item.time);
        item.time = minutesToTime(currentMinutes + delta);
        item.isTimeFixed = true;
      }

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

  const updateLodgeCheckoutTime = (dayIdx, pIdx, delta) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days?.[dayIdx]?.plan?.[pIdx];
      const nextDayPlan = nextData.days?.[dayIdx + 1]?.plan || [];
      const nextFirstIdx = nextDayPlan.findIndex(candidate => candidate?.type !== 'backup');
      if (!item || nextFirstIdx < 0) return prev;

      const nextFirst = nextDayPlan[nextFirstIdx];
      const baseCheckout = item.lodgeCheckoutTime
        ? timeToMinutes(item.lodgeCheckoutTime)
        : timeToMinutes(nextFirst.time)
        - parseMinsLabel(nextFirst.travelTimeOverride, DEFAULT_TRAVEL_MINS)
        - parseMinsLabel(nextFirst.bufferTimeOverride, DEFAULT_BUFFER_MINS);
      const nextCheckout = baseCheckout + delta;

      item.lodgeCheckoutTime = minutesToTime(nextCheckout);
      item.lodgeCheckoutFixed = true;
      nextFirst.time = minutesToTime(
        nextCheckout
        + parseMinsLabel(nextFirst.travelTimeOverride, DEFAULT_TRAVEL_MINS)
        + parseMinsLabel(nextFirst.bufferTimeOverride, DEFAULT_BUFFER_MINS)
      );

      nextData.days[dayIdx + 1].plan = recalculateSchedule(nextDayPlan);
      recalculateLodgeDurations(nextData.days);
      return nextData;
    });
    setLastAction('숙소 체크아웃 시간을 조정했습니다.');
  };

  const setLodgeCheckoutTimeValue = (dayIdx, pIdx, nextLabel) => {
    const normalized = String(nextLabel || '').trim();
    if (!/^\d{2}:\d{2}$/.test(normalized)) {
      setLastAction('체크아웃 시간 형식이 올바르지 않습니다.');
      return;
    }
    const [hours, minutes] = normalized.split(':').map(Number);
    if (hours > 24 || minutes > 59 || (hours === 24 && minutes > 0)) {
      setLastAction('체크아웃 시간 형식이 올바르지 않습니다.');
      return;
    }
    saveHistory();
    let updated = false;
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days?.[dayIdx]?.plan?.[pIdx];
      const nextDayPlan = nextData.days?.[dayIdx + 1]?.plan || [];
      const nextFirstIdx = nextDayPlan.findIndex(candidate => candidate?.type !== 'backup');
      if (!item || nextFirstIdx < 0) return prev;

      const nextFirst = nextDayPlan[nextFirstIdx];
      const checkoutMinutes = timeToMinutes(normalized);
      item.lodgeCheckoutTime = normalized;
      item.lodgeCheckoutFixed = true;
      nextFirst.time = minutesToTime(
        checkoutMinutes
        + parseMinsLabel(nextFirst.travelTimeOverride, DEFAULT_TRAVEL_MINS)
        + parseMinsLabel(nextFirst.bufferTimeOverride, DEFAULT_BUFFER_MINS)
      );

      nextData.days[dayIdx + 1].plan = recalculateSchedule(nextDayPlan);
      recalculateLodgeDurations(nextData.days);
      updated = true;
      return nextData;
    });
    setLastAction(updated ? '숙소 체크아웃 시간을 설정했습니다.' : '조정할 다음 일정이 없어 체크아웃 시간을 고정할 수 없습니다.');
  };

  const toggleLodgeCheckoutFix = (dayIdx, pIdx) => {
    let fixed = false;
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days?.[dayIdx]?.plan?.[pIdx];
      if (!item) return prev;
      item.lodgeCheckoutFixed = !item.lodgeCheckoutFixed;
      fixed = !!item.lodgeCheckoutFixed;
      if (!item.lodgeCheckoutFixed) delete item.lodgeCheckoutTime;
      nextData.days.forEach(day => {
        day.plan = recalculateSchedule(day.plan || []);
      });
      recalculateLodgeDurations(nextData.days);
      return nextData;
    });
    setLastAction(fixed ? '숙소 체크아웃 시간이 고정되었습니다.' : '숙소 체크아웃 시간 고정이 해제되었습니다.');
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

  const setPlanEndTimeValue = (dayIdx, pIdx, nextLabel) => {
    const normalized = String(nextLabel || '').trim();
    if (!/^\d{2}:\d{2}$/.test(normalized)) {
      setLastAction('종료 시간 형식이 올바르지 않습니다.');
      return;
    }
    const [hours, minutes] = normalized.split(':').map(Number);
    if (hours > 24 || minutes > 59 || (hours === 24 && minutes > 0)) {
      setLastAction('종료 시간 형식이 올바르지 않습니다.');
      return;
    }
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days?.[dayIdx]?.plan;
      const item = dayPlan?.[pIdx];
      if (!item) return prev;
      const startMinutes = timeToMinutes(item.time || '00:00');
      const endMinutesRaw = timeToMinutes(normalized);
      const endMinutes = endMinutesRaw <= startMinutes ? endMinutesRaw + 1440 : endMinutesRaw;
      item.duration = Math.max(0, endMinutes - startMinutes);
      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });
    setLastAction('종료 시간을 기준으로 소요 시간을 다시 계산했습니다.');
  };

  const updatePlanEndTime = (dayIdx, pIdx, delta) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days?.[dayIdx]?.plan;
      const item = dayPlan?.[pIdx];
      if (!item) return prev;
      const startMinutes = timeToMinutes(item.time || '00:00');
      const currentEndMinutes = startMinutes + (item.duration || 0);
      const nextEndMinutes = currentEndMinutes + delta;
      item.duration = Math.max(0, nextEndMinutes - startMinutes);
      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });
    setLastAction('끝 시각을 조정했습니다.');
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
      item._manualBufferTimeOverride = `${minutes}분`;
      item._isBufferCoordinated = false;

      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      recalculateLodgeDurations(nextData.days);
      return nextData;
    });
    setLastAction("버퍼 시간을 조정했습니다.");
  };

  const resetBufferTimeById = (dayIdx, itemId, minutes = DEFAULT_BUFFER_MINS) => {
    const nextMinutes = Math.max(0, Number(minutes) || 0);
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx]?.plan || [];
      const item = dayPlan.find((entry) => entry?.id === itemId);
      if (!item) return prev;
      const wasBufferCoordinated = !!item._isBufferCoordinated;

      item.bufferTimeOverride = `${nextMinutes}분`;
      item._manualBufferTimeOverride = `${nextMinutes}분`;
      item._isBufferCoordinated = false;
      if (wasBufferCoordinated && item.isTimeFixed) {
        item.isTimeFixed = false;
      }

      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      recalculateLodgeDurations(nextData.days);
      return nextData;
    });
    setLastAction(`보정 시간을 ${nextMinutes}분으로 초기화하고 주변 일정을 다시 계산했습니다.`);
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
    setItinerary(prev => {
      const draft = JSON.parse(JSON.stringify(prev));
      draft.days[dayIdx].plan[pIdx].isTimeFixed = !draft.days[dayIdx].plan[pIdx].isTimeFixed;
      return draft;
    });
  };
  const toggleDurationFix = (dayIdx, pIdx) => {
    setItinerary(prev => {
      const draft = JSON.parse(JSON.stringify(prev));
      const p = draft.days[dayIdx].plan[pIdx];
      p.isDurationFixed = !p.isDurationFixed;
      if (p.isDurationFixed) p.isEndTimeFixed = false;
      return draft;
    });
  };
  const toggleEndTimeFix = (dayIdx, pIdx) => {
    setItinerary(prev => {
      const draft = JSON.parse(JSON.stringify(prev));
      const p = draft.days[dayIdx].plan[pIdx];
      p.isEndTimeFixed = !p.isEndTimeFixed;
      if (p.isEndTimeFixed) p.isDurationFixed = false;
      return draft;
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
      applyGeoFieldsToRecord(item);
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
      if (item.types.includes('ship')) {
        ensureShipItemDefaults(item, nextData.days[dayIdx]?.day || dayIdx + 1);
      }
      applyGeoFieldsToRecord(item);
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
    setLastAction("태그를 업데이트했습니다.");
  };

  const openPlanEditModal = (dayIdx, pIdx, overrides = {}) => {
    const item = itinerary.days?.[dayIdx]?.plan?.[pIdx];
    if (!item || item.type === 'backup') return;
    const receipt = deepClone(item.receipt || { address: item.address || '', items: [] });
    if (!Array.isArray(receipt.items)) receipt.items = [];
    receipt.address = receipt.address || item.address || '';
    setEditingPlanTarget({ dayIdx, pIdx });
    setEditPlanDraft(createPlaceEditorDraft({
      id: item.id,
      name: item.activity || item.name || '',
      address: receipt.address,
      memo: item.memo || '',
      types: item.types || ['place'],
      business: normalizeBusiness(item.business || {}),
      receipt,
    }, overrides));
  };

  const savePlanEditDraft = (nextDraft) => {
    if (!editingPlanTarget) return;
    const { dayIdx, pIdx } = editingPlanTarget;
    const receipt = deepClone(nextDraft.receipt || { address: nextDraft.address || '', items: [] });
    if (!Array.isArray(receipt.items)) receipt.items = [];
    receipt.address = nextDraft.address || receipt.address || '';
    setItinerary((prev) => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days?.[dayIdx]?.plan?.[pIdx];
      if (!item) return prev;
      item.activity = nextDraft.name || item.activity || '';
      item.types = normalizeTagOrder(nextDraft.types || item.types || ['place']);
      item.business = normalizeBusiness(nextDraft.business || {});
      item.memo = nextDraft.memo || '';
      item.receipt = receipt;
      item.price = isStandaloneLodgeSegmentItem(item)
        ? 0
        : receipt.items.reduce((sum, menu) => sum + (menu?.selected === false ? 0 : getMenuLineTotal(menu)), 0);
      if (item.types.includes('ship')) {
        ensureShipItemDefaults(item, nextData.days?.[dayIdx]?.day || dayIdx + 1);
      }
      applyGeoFieldsToRecord(item);
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      recalculateLodgeDurations(nextData.days);
      return nextData;
    });
    submitAiLearningCase(nextDraft, editingPlanTarget.id || itinerary.days[dayIdx].plan[pIdx].id);
    setEditingPlanTarget(null);
    setEditPlanDraft(null);
  };

  const removeCustomCategoryEverywhere = (tagValue) => {
    const targetTag = String(tagValue || '').trim();
    if (!targetTag) return;
    saveHistory();
    setItinerary((prev) => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.places = (nextData.places || []).map((place) => ({
        ...place,
        types: normalizeTagOrder((Array.isArray(place?.types) ? place.types : []).filter((tag) => tag !== targetTag)),
      }));
      nextData.days = (nextData.days || []).map((day) => ({
        ...day,
        plan: (day.plan || []).map((item) => ({
          ...item,
          types: normalizeTagOrder((Array.isArray(item?.types) ? item.types : []).filter((tag) => tag !== targetTag)),
          alternatives: Array.isArray(item?.alternatives)
            ? item.alternatives.map((alt) => ({
              ...alt,
              types: normalizeTagOrder((Array.isArray(alt?.types) ? alt.types : []).filter((tag) => tag !== targetTag)),
            }))
            : item?.alternatives,
        })),
      }));
      return nextData;
    });
    setPlaceFilterTags((prev) => prev.filter((tag) => tag !== targetTag));
    setLastAction(`'${targetTag}' 카테고리를 전체 데이터에서 제거했습니다.`);
    showInfoToast(`'${targetTag}' 카테고리를 삭제했습니다.`);
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
      planItem.receipt.items.push({ name: "", price: 0, qty: 1, selected: true });
      return nextData;
    });
    setPendingPlanMenuFocus({ dayIdx, pIdx, menuIdx: (itinerary.days?.[dayIdx]?.plan?.[pIdx]?.receipt?.items || []).length });
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
      applyGeoFieldsToRecord(nextData.days[dayIdx].plan[pIdx]);
      return nextData;
    });
  };

  const updateFerryBoardTime = (dayIdx, pIdx, deltaMinutes) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      const shipTimeline = getShipTimeline(item);
      const newBoard = Math.max(shipTimeline.loadEnd, shipTimeline.board + deltaMinutes);
      item.boardTime = minutesToTime(newBoard);
      item.sailDuration = shipTimeline.sailDuration;
      item.duration = Math.max(0, newBoard - shipTimeline.loadStart) + item.sailDuration;
      item.isTimeFixed = true;
      if (item.receipt?.shipDetails) {
        item.receipt.shipDetails.depart = item.boardTime;
        item.receipt.shipDetails.loading = `${item.time || '00:00'} ~ ${item.loadEndTime || item.boardTime}`;
      }
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
  };

  const updateFerryLoadEndTime = (dayIdx, pIdx, deltaMinutes) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      const shipTimeline = getShipTimeline(item);
      const newLoadEnd = Math.min(shipTimeline.board, Math.max(shipTimeline.loadStart, shipTimeline.loadEnd + deltaMinutes));
      item.loadEndTime = minutesToTime(newLoadEnd);
      item.duration = Math.max(0, shipTimeline.board - shipTimeline.loadStart) + shipTimeline.sailDuration;
      item.isTimeFixed = true;
      if (item.receipt?.shipDetails) {
        item.receipt.shipDetails.loading = `${item.time || '00:00'} ~ ${item.loadEndTime}`;
      }
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
  };

  const updateFerrySailDuration = (dayIdx, pIdx, deltaMinutes) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      const shipTimeline = getShipTimeline(item);
      const newSail = Math.max(30, (item.sailDuration ?? 240) + deltaMinutes);
      item.sailDuration = newSail;
      item.duration = Math.max(0, shipTimeline.board - shipTimeline.loadStart) + newSail;
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
    h = Math.max(0, h);
    m = Math.max(0, m);
    if (h > 24 || m > 59 || (h === 24 && m > 0)) return null;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const parseFerryDurationInput = (raw) => {
    const value = String(raw || '').trim();
    if (!value) return null;
    if (value.includes(':')) {
      const [hourRaw, minuteRaw = '0'] = value.split(':');
      const hours = Number.parseInt(String(hourRaw).trim(), 10);
      const minutes = Number.parseInt(String(minuteRaw).trim(), 10);
      if (!Number.isFinite(hours) || !Number.isFinite(minutes) || hours < 0 || minutes < 0 || minutes > 59) return null;
      return (hours * 60) + minutes;
    }
    const minutesOnly = Number.parseInt(value.replace(/[^\d]/g, ''), 10);
    if (!Number.isFinite(minutesOnly) || minutesOnly < 0) return null;
    return minutesOnly;
  };

  const commitFerryTime = (dayIdx, pIdx, field, raw) => {
    if (field === 'sail') {
      const parsedDuration = parseFerryDurationInput(raw);
      const mins = Math.max(30, parsedDuration || 30);
      setItinerary(prev => {
        const nextData = JSON.parse(JSON.stringify(prev));
        const item = nextData.days[dayIdx].plan[pIdx];
        const shipTimeline = getShipTimeline(item);
        item.sailDuration = mins;
        item.duration = Math.max(0, shipTimeline.board - shipTimeline.loadStart) + mins;
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
      const shipTimeline = getShipTimeline(item);
      if (field === 'load') {
        item.time = time;
        item.isTimeFixed = true;
        const nextLoadStart = resolveShipAbsoluteMinutes(time, 0);
        const nextLoadEnd = Math.min(shipTimeline.board, Math.max(nextLoadStart, shipTimeline.loadEnd));
        item.loadEndTime = minutesToTime(nextLoadEnd);
      } else if (field === 'depart' || field === 'loadEnd') {
        if (field === 'loadEnd') {
          const nextLoadEnd = resolveShipAbsoluteMinutes(time, shipTimeline.loadStart);
          const clampedLoadEnd = Math.min(shipTimeline.board, Math.max(shipTimeline.loadStart, nextLoadEnd));
          item.loadEndTime = minutesToTime(clampedLoadEnd);
        } else {
          const nextBoard = resolveShipAbsoluteMinutes(time, shipTimeline.loadEnd);
          item.boardTime = minutesToTime(nextBoard);
        }
        item.isTimeFixed = true;
      } else if (field === 'disembark') {
        const disMins = resolveShipAbsoluteMinutes(time, shipTimeline.board);
        item.sailDuration = Math.max(30, disMins - shipTimeline.board);
      }
      const refreshedTimeline = getShipTimeline({ ...item, sailDuration: item.sailDuration });
      item.duration = Math.max(0, refreshedTimeline.board - refreshedTimeline.loadStart) + refreshedTimeline.sailDuration;
      if (item.receipt?.shipDetails) {
        item.receipt.shipDetails.depart = item.boardTime || item.receipt.shipDetails.depart;
        item.receipt.shipDetails.loading = `${item.time || '00:00'} ~ ${item.loadEndTime || item.boardTime || '00:00'}`;
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
        receipt: deepClone(alt.receipt || { address: '', items: [] }),
        ...cloneGeoForRecord(alt),
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
        memo: alt.memo || '',
        ...cloneGeoForRecord(alt),
      });

      nextData.days[targetDayIdx].plan = recalculateSchedule(targetDayPlan);
      return nextData;
    });
    setLastAction("플랜 B를 일정표에 추가했습니다.");
    setPendingAutoRouteJobs(prev => [...prev, { dayIdx: targetDayIdx, targetIdx: insertAfterPIdx + 1 }]);
  };

  const moveTimelineItem = (targetDayIdx, insertAfterPIdx, sourceDayIdx, sourcePIdx, isCopy, activePlanPos) => {
    if (!isCopy && targetDayIdx === sourceDayIdx && insertAfterPIdx === sourcePIdx) return;
    saveHistory();
    let sourceIdToReset = null;
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const src = nextData.days[sourceDayIdx]?.plan?.[sourcePIdx];
      if (!src) return nextData;

      const hasAlts = src.alternatives?.length > 0;
      let itemToMove;
      let sourceRemoved = false;

      if (hasAlts && activePlanPos !== undefined && !isCopy) {
        sourceIdToReset = src.id;
        if (activePlanPos === 0) {
          // 메인 플랜만 이동 — 첫 번째 대안이 새 메인으로 승격
          itemToMove = deepClone(src);
          delete itemToMove.alternatives;
          itemToMove.id = `item_${Date.now()}`;
          const [newMain, ...rest] = src.alternatives;
          Object.assign(src, {
            activity: newMain.activity, price: newMain.price, memo: newMain.memo,
            revisit: newMain.revisit, business: newMain.business, types: newMain.types,
            duration: newMain.duration, receipt: newMain.receipt, alternatives: rest
          });
        } else {
          // 현재 보이는 대안만 이동 — 대안 배열에서 제거
          const altIdx = activePlanPos - 1;
          const alt = src.alternatives[altIdx];
          itemToMove = {
            id: `item_${Date.now()}`, time: src.time, duration: alt.duration || src.duration,
            activity: alt.activity, price: alt.price, memo: alt.memo, revisit: alt.revisit,
            business: alt.business, types: alt.types, receipt: alt.receipt,
            state: src.state, isTimeFixed: src.isTimeFixed
          };
          src.alternatives.splice(altIdx, 1);
        }
        nextData.days[sourceDayIdx].plan = recalculateSchedule(nextData.days[sourceDayIdx].plan);
      } else {
        itemToMove = deepClone(src);
        itemToMove.id = `item_${Date.now()}`;
        if (!isCopy) {
          nextData.days[sourceDayIdx].plan.splice(sourcePIdx, 1);
          nextData.days[sourceDayIdx].plan = recalculateSchedule(nextData.days[sourceDayIdx].plan);
          if (targetDayIdx === sourceDayIdx && insertAfterPIdx > sourcePIdx) insertAfterPIdx--;
          sourceRemoved = true;
        }
      }

      nextData.days[targetDayIdx].plan.splice(insertAfterPIdx + 1, 0, itemToMove);
      nextData.days[targetDayIdx].plan = recalculateSchedule(nextData.days[targetDayIdx].plan);
      return nextData;
    });
    if (sourceIdToReset) setViewingPlanIdx(prev => { const n = { ...prev }; delete n[sourceIdToReset]; return n; });
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
    triggerUndoToast("플랜이 삭제되었습니다.");
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
      // 플랜 교체 시 기존 일정의 시간축(소요시간)을 유지
      item.duration = item.duration || 60;
      item.receipt = deepClone(alt.receipt || { address: '', items: [] });
      if (item.types.includes('ship')) {
        item.geoStart = normalizeGeoPoint(alt.geoStart, getShipStartAddress(alt));
        item.geoEnd = normalizeGeoPoint(alt.geoEnd, getShipEndAddress(alt));
      } else {
        item.geo = normalizeGeoPoint(alt.geo, getPlanItemPrimaryAddress(alt));
      }
      applyGeoFieldsToRecord(item);

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
      // 플랜 회전 시 기존 일정의 시간축(소요시간)을 유지
      item.duration = item.duration || 60;
      item.receipt = deepClone(nextMain.receipt || { address: '', items: [] });
      if (item.types.includes('ship')) {
        item.geoStart = normalizeGeoPoint(nextMain.geoStart, getShipStartAddress(nextMain));
        item.geoEnd = normalizeGeoPoint(nextMain.geoEnd, getShipEndAddress(nextMain));
      } else {
        item.geo = normalizeGeoPoint(nextMain.geo, getPlanItemPrimaryAddress(nextMain));
      }
      applyGeoFieldsToRecord(item);
      item.alternatives = dir > 0 ? [...alts.slice(1), currentAsAlt] : [currentAsAlt, ...alts.slice(0, -1)];
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
    setPendingAutoRouteJobs(prev => [...prev, { dayIdx, targetIdx: pIdx }, { dayIdx, targetIdx: pIdx + 1 }]);
    setLastAction("플랜을 변경했습니다.");
  };

  const selectPlanVariantAt = (dayIdx, pIdx, targetPos) => {
    const item = itinerary.days?.[dayIdx]?.plan?.[pIdx];
    if (!item) return;
    const total = (item.alternatives?.length || 0) + 1;
    const safePos = Math.max(0, Math.min(total - 1, Number(targetPos) || 0));
    setHighlightedItemId(item.id); // 선택 시 해당 아이템 강조
    if (safePos === 0) {
      setViewingPlanIdx(prev => ({ ...prev, [item.id]: 0 }));
      setPlanVariantPicker(null);
      return;
    }
    swapAlternative(dayIdx, pIdx, safePos - 1);
    setViewingPlanIdx(prev => ({ ...prev, [item.id]: safePos }));
    setPlanVariantPicker(null);
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
    triggerUndoToast("일정이 삭제되었습니다.");
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
      case 'stay': return <div key={type} className={`${style} text-violet-600 bg-violet-50 border-violet-100`}><MoonStar size={10} /> 숙박</div>;
      case 'rest': return <div key={type} className={`${style} text-cyan-600 bg-cyan-50 border-cyan-100`}><Hourglass size={10} /> 휴식</div>;
      case 'ship': return <div key={type} className={`${style} text-blue-600 bg-blue-50 border-blue-100`}><Anchor size={10} /> 페리</div>;
      case 'openrun': return <div key={type} className={`${style} text-red-500 bg-red-50 border-red-100`}><Timer size={10} /> 오픈런</div>;
      case 'view': return <div key={type} className={`${style} text-sky-600 bg-sky-50 border-sky-100`}><Eye size={10} /> 뷰맛집</div>;
      case 'experience': return <div key={type} className={`${style} text-emerald-600 bg-emerald-50 border-emerald-100`}><Star size={10} /> 체험</div>;
      case 'souvenir': return <div key={type} className={`${style} text-teal-600 bg-teal-50 border-teal-100`}><Gift size={10} /> 기념품샵</div>;
      case 'pickup': return <div key={type} className={`${style} text-orange-500 bg-orange-50 border-orange-100`}><Package size={10} /> 픽업</div>;
      case 'new': return <span key="new" className={style + ' text-emerald-600 bg-emerald-50 border-emerald-200'}>신규</span>;
      case 'revisit': return <span key="revisit" className={style + ' text-blue-600 bg-blue-50 border-blue-200'}>재방문</span>;
      case 'place': return <div key={type} className={`${style} text-slate-500 bg-slate-100 border-slate-200`}><MapIcon size={10} /> 장소</div>;
      default: return <div key={type} className={`${style} text-slate-500 bg-slate-100 border-slate-200`}>{getCustomTagLabel(type)}</div>;
    }
  };
  const getPreferredNavCategory = (types = [], fallbackType = 'place') => {
    const normalized = Array.isArray(types) ? types.filter(Boolean) : [];
    const preferred = normalized.find((type) => !MODIFIER_TAGS.has(type) && type !== 'lodge' && type !== 'place');
    return preferred || normalized.find((type) => !MODIFIER_TAGS.has(type)) || fallbackType;
  };

  const addPlace = (formData) => {
    const { name = '', types = ['place'], menus = [], address = '', memo = '', revisit = false, business = EMPTY_BUSINESS } = formData || {};
    const resolvedName = String(name || newPlaceName || '').trim();
    if (!resolvedName) return;
    const normalizedMenus = (Array.isArray(menus) ? menus : []).filter(Boolean).map((menu) => ({
      ...menu,
      name: String(menu?.name || '').trim(),
      price: Number(menu?.price) || 0,
      qty: Math.max(1, Number(menu?.qty) || 1),
      selected: menu?.selected !== false,
    }));
    const nextPlace = normalizeLibraryPlace({
      id: `place_${Date.now()}`,
      name: resolvedName,
      types: normalizeTagOrder(types),
      revisit: !!revisit,
      business: normalizeBusiness(business),
      address: address.trim(),
      memo: memo.trim(),
      receipt: { address: address.trim(), items: normalizedMenus },
    });
    setItinerary(prev => ({
      ...prev,
      places: [...(prev.places || []), nextPlace]
    }));
    resetNewPlaceDraft();
    setLastAction(`'${resolvedName}'이(가) 장소 목록에 추가되었습니다.`);
  };

  const inferPlaceTypesFromRecommendation = (category = '') => {
    const normalized = String(category || '').toLowerCase();
    if (!normalized) return ['place'];
    if (/카페|cafe|coffee|dessert|bakery/.test(normalized)) return ['cafe'];
    if (/식당|맛집|restaurant|food|dining|bar|pub/.test(normalized)) return ['food'];
    if (/관광|명소|tour|museum|attraction|view|beach|park/.test(normalized)) return ['tour'];
    return ['place'];
  };

  const addRecommendedPlaceToLibrary = (recommendation) => {
    const name = String(recommendation?.name || '').trim();
    const address = String(recommendation?.address || '').trim();
    if (!name || !address) {
      showInfoToast('추천 결과에 이름 또는 주소가 없어 내 장소에 추가할 수 없습니다.');
      return;
    }
    const memo = [
      recommendation?.why ? `추천 이유: ${recommendation.why}` : '',
      recommendation?.hoursSummary ? `운영시간: ${recommendation.hoursSummary}` : '',
      recommendation?.suggestedTime ? `추천 시간: ${recommendation.suggestedTime}` : '',
      recommendation?.priceNote ? `비용 메모: ${recommendation.priceNote}` : '',
    ].filter(Boolean).join(' / ');
    const nextPlace = normalizeLibraryPlace({
      id: `place_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      types: inferPlaceTypesFromRecommendation(recommendation?.category),
      business: EMPTY_BUSINESS,
      address,
      memo,
      receipt: { address, items: [] },
    });
    setItinerary((prev) => ({
      ...prev,
      places: [...(prev.places || []), nextPlace],
    }));
    showInfoToast(`'${name}' 추천 장소를 내 장소에 추가했습니다.`);
  };

  const requestPerplexityNearbyRecommendations = async (dayIdx, pIdx) => {
    const item = itinerary.days?.[dayIdx]?.plan?.[pIdx];
    if (!item || item.type === 'backup') return;
    const itemName = String(item.activity || item.name || '').trim();
    const itemAddress = String(item.receipt?.address || item.address || '').trim();
    if (!itemName || !itemAddress) {
      showInfoToast('추천을 받으려면 현재 일정의 이름과 주소가 필요합니다.');
      return;
    }

    const day = itinerary.days?.[dayIdx];
    const planItems = (day?.plan || []).filter((entry) => entry && entry.type !== 'backup');
    const currentIndex = planItems.findIndex((entry) => entry.id === item.id);
    const nextItem = currentIndex >= 0 ? planItems[currentIndex + 1] : null;
    const itemEndTime = item.types?.includes('ship')
      ? getShipTimeline(item).disembarkLabel
      : minutesToTime(timeToMinutes(item.time || '00:00') + (item.duration || 0));
    const dayLabel = `${day?.day || dayIdx + 1}일차`;
    const dateInfo = getNavDateLabelForDay(day?.day || dayIdx + 1);
    const currentBusinessSummary = formatBusinessSummary(item.business || {}, item);

    setPerplexityNearbyModal({
      open: true,
      loading: true,
      provider: '',
      itemName,
      summary: '',
      recommendations: [],
      citations: [],
      error: '',
    });

    try {
      const endpoint = getPerplexityNearbyEndpoint();
      const bearerToken = await getCurrentUserBearerToken();
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        },
        body: JSON.stringify({
          perplexityApiKey: String(aiSmartFillConfig.perplexityApiKey || '').trim(),
          geminiApiKey: String(aiSmartFillConfig.geminiApiKey || '').trim(),
          tripRegion,
          dayLabel,
          dateLabel: [dateInfo?.primary, dateInfo?.secondary].filter(Boolean).join(' '),
          placeName: itemName,
          placeAddress: itemAddress,
          currentStartTime: item.time || '',
          currentEndTime: itemEndTime,
          currentBusinessSummary,
          nextItemName: nextItem?.activity || '',
          nextItemAddress: nextItem?.receipt?.address || nextItem?.address || '',
          nextItemStartTime: nextItem?.time || '',
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || data?.details || `HTTP ${response.status}`);
      }
      setPerplexityNearbyModal({
        open: true,
        loading: false,
        provider: String(data?.provider || '').trim(),
        itemName,
        summary: String(data?.summary || '').trim(),
        recommendations: Array.isArray(data?.recommendations) ? data.recommendations.filter((entry) => entry?.name) : [],
        citations: Array.isArray(data?.citations) ? data.citations.filter(Boolean) : [],
        error: '',
      });
    } catch (error) {
      setPerplexityNearbyModal({
        open: true,
        loading: false,
        provider: '',
        itemName,
        summary: '',
        recommendations: [],
        citations: [],
        error: error?.message || '알 수 없는 오류',
      });
    }
  };

  const removePlace = (placeId) => {
    saveHistory();
    setItinerary(prev => ({
      ...prev,
      places: (prev.places || []).filter(p => p.id !== placeId)
    }));
    triggerUndoToast("내 장소가 삭제되었습니다.");
  };

  const updatePlace = (placeId, data) => {
    saveHistory();
    const updatedPlaces = (itinerary.places || []).map((p) => {
      if (p.id !== placeId) return p;
      return normalizeLibraryPlace({ ...p, ...data });
    });

    // AI 학습 데이터 제출 (장소 수정 완료 시)
    if (aiLearningCapture && aiLearningCapture.itemId === placeId) {
      const target = updatedPlaces.find(p => p.id === placeId);
      if (target) submitAiLearningCase(target, placeId);
    }

    setItinerary(prev => ({
      ...prev,
      places: updatedPlaces
    }));
  };

  const toLibraryPlaceFromPlanItem = (item) => {
    if (!item) return null;
    const receipt = deepClone(item.receipt || { address: '', items: [] });
    if (!Array.isArray(receipt.items)) receipt.items = [];
    const resolvedAddress = item.receipt?.address || item.address || getRouteAddress(item, 'to') || '';
    receipt.address = receipt.address || resolvedAddress;
    return normalizeLibraryPlace({
      id: `place_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: item.activity || item.name || '장소',
      types: normalizeTagOrder(item.types || ['place']),
      revisit: typeof item.revisit === 'boolean' ? item.revisit : isRevisitCourse(item),
      business: normalizeBusiness(item.business || {}),
      address: resolvedAddress,
      price: Number(item.price) || 0,
      memo: item.memo || '',
      receipt,
      ...cloneGeoForRecord(item),
      startPoint: item.startPoint,
      endPoint: item.endPoint,
      endAddress: item.endAddress,
      time: item.time,
      loadEndTime: item.loadEndTime,
      boardTime: item.boardTime,
      sailDuration: item.sailDuration,
      duration: item.duration,
      staySegments: deepClone(item.staySegments || []),
      isTimeFixed: item.isTimeFixed,
      travelTimeOverride: item.travelTimeOverride,
      bufferTimeOverride: item.bufferTimeOverride,
    });
  };

  const copyTimelineItemToLibrary = (dayIdx, pIdx) => {
    const item = itinerary.days?.[dayIdx]?.plan?.[pIdx];
    if (!item) return;
    const libraryPlace = toLibraryPlaceFromPlanItem(item);
    if (!libraryPlace) return;
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      if (!nextData.places) nextData.places = [];
      nextData.places.push(libraryPlace);
      return nextData;
    });
    setLastAction(`'${item.activity}' 일정을 내 장소로 복제했습니다.`);
  };

  const copyAlternativeToLibrary = (dayIdx, pIdx, altIdx) => {
    const alt = normalizeAlternative(itinerary.days?.[dayIdx]?.plan?.[pIdx]?.alternatives?.[altIdx]);
    if (!alt) return;
    const libraryPlace = toLibraryPlaceFromPlanItem({
      ...alt,
      activity: alt.activity,
      receipt: alt.receipt || { address: alt.receipt?.address || '', items: [] },
    });
    if (!libraryPlace) return;
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      if (!nextData.places) nextData.places = [];
      nextData.places.push(libraryPlace);
      return nextData;
    });
    setLastAction(`'${alt.activity}' 플랜 B를 내 장소로 복제했습니다.`);
  };

  const dropTimelineItemOnLibrary = (dayIdx, pIdx) => {
    const item = itinerary.days?.[dayIdx]?.plan?.[pIdx];
    if (!item) return;
    const libraryPlace = toLibraryPlaceFromPlanItem(item);
    if (!libraryPlace) return;
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.days[dayIdx].plan.splice(pIdx, 1);
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      if (!nextData.places) nextData.places = [];
      nextData.places.push(libraryPlace);
      return nextData;
    });
    setLastAction(`'${item.activity}' 일정이 내 장소로 이동되었습니다.`);
  };

  const moveDayPlanItemsToLibrary = (dayIdx) => {
    const dayData = itinerary.days?.[dayIdx];
    const planItems = (dayData?.plan || []).filter((item) => item && item.type !== 'backup');
    if (!dayData || planItems.length === 0) {
      setLastAction('이 날짜에는 내 장소로 보낼 일정이 없습니다.');
      return;
    }

    const libraryPlaces = planItems
      .map((item) => toLibraryPlaceFromPlanItem(item))
      .filter(Boolean);
    if (libraryPlaces.length === 0) {
      setLastAction('내 장소로 변환할 수 있는 일정이 없습니다.');
      return;
    }

    saveHistory();
    setItinerary((prev) => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const targetDay = nextData.days?.[dayIdx];
      if (!targetDay) return prev;
      targetDay.plan = recalculateSchedule((targetDay.plan || []).filter((item) => item?.type === 'backup'));
      if (!nextData.places) nextData.places = [];
      nextData.places.push(...libraryPlaces);
      recalculateLodgeDurations(nextData.days);
      return nextData;
    });
    setNavDayMenu(null);
    setLastAction(`${dayData.day}일차 일정 ${libraryPlaces.length}개를 내 장소로 이동했습니다.`);
  };

  const addInitialItem = (dayIdx = 0, placeData = null) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      if (!Array.isArray(nextData.days) || nextData.days.length === 0) {
        nextData.days = [{ day: 1, plan: [] }];
      }
      if (!nextData.days[dayIdx]) {
        nextData.days[dayIdx] = { day: dayIdx + 1, plan: [] };
      }
      if (!Array.isArray(nextData.days[dayIdx].plan)) {
        nextData.days[dayIdx].plan = [];
      }
      nextData.days[dayIdx].plan.push(createTimelineItem({
        dayNumber: nextData.days[dayIdx]?.day || dayIdx + 1,
        baseTime: '09:00',
        types: placeData?.types || ['place'],
        placeData,
        fallbackLabel: '일정',
      }));
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
    setLastAction(placeData ? `'${placeData.name}'이(가) 첫 일정으로 추가되었습니다.` : '첫 일정이 추가되었습니다.');
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
      dayPlan.splice(insertIndex + 1, 0, createTimelineItem({
        dayNumber: nextData.days[dayIdx]?.day || dayIdx + 1,
        baseTime: newTime,
        types: placeData?.types || types,
        placeData,
        fallbackLabel: label,
      }));
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

  const fetchKakaoVerifiedRoute = async ({ fromAddress, toAddress, fromCoord = null, toCoord = null }) => {
    const endpoints = getRouteVerifyEndpointCandidates(aiSmartFillConfig?.proxyBaseUrl);
    let lastError = null;
    for (const endpoint of endpoints) {
      try {
        const r = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromAddress,
            toAddress,
            fromCoord: hasGeoCoords(fromCoord) ? { lat: Number(fromCoord.lat), lon: Number(fromCoord.lon) } : null,
            toCoord: hasGeoCoords(toCoord) ? { lat: Number(toCoord.lat), lon: Number(toCoord.lon) } : null,
          }),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          throw new Error(data?.details || data?.error || `HTTP ${r.status}`);
        }
        if (!Number.isFinite(Number(data?.distanceKm)) || !Number.isFinite(Number(data?.durationMins))) {
          throw new Error('kakao verify invalid payload');
        }
        return {
          distance: +Number(data.distanceKm).toFixed(1),
          durationMins: Math.max(1, Math.round(Number(data.durationMins))),
          provider: data.provider || 'kakao',
          review: data.review || null,
          geocode: data.geocode || null,
        };
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('kakao verify failed');
  };

  const autoCalculateRouteFor = async (dayIdx, targetIdx, options = {}) => {
    const silent = !!options.silent;
    const forceRefresh = !!options.forceRefresh;
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

    const key = getRouteCacheKey(addr1, addr2);
    const cachedRoute = routeCache[key];
    const failedRecently = cachedRoute?.failedAt && (Date.now() - cachedRoute.failedAt < routeRetryCooldownMs);
    if (!forceRefresh && cachedRoute && !cachedRoute.failed) {
      const cached = routeCache[key];
      const cachedDistance = Math.max(0, Number(cached.distance) || 0);
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
    if (!forceRefresh && failedRecently) {
      return;
    }

    setCalculatingRouteId(`${dayIdx}_${targetIdx}`);
    if (!silent) setLastAction("경로와 거리를 자동 계산 중입니다...");

    try {
      const fromCoord = getRouteGeoPoint(prevItem, 'from');
      const toCoord = getRouteGeoPoint(targetItem, 'to');
      const kakaoRoute = await fetchKakaoVerifiedRoute({
        fromAddress: addr1,
        toAddress: addr2,
        fromCoord,
        toCoord,
      });
      setRouteCache(prev => ({ ...prev, [key]: kakaoRoute }));
      applyRoute(dayIdx, targetIdx, kakaoRoute);
      if (!silent) setLastAction(`카카오 경로 확인: ${kakaoRoute.distance}km, ${kakaoRoute.durationMins}분`);
    } catch (e) {
      console.error(e);
      const failedReason = summarizeRouteFailureReason(e?.message || e);
      setRouteCache(prev => ({ ...prev, [key]: { failed: true, failedAt: Date.now(), failedReason } }));
      if (!silent) setLastAction(`자동차 경로 계산 실패: ${failedReason}`);
    } finally {
      setCalculatingRouteId(null);
    }
  };

  useEffect(() => {
    if (!pendingAutoRouteJobs.length) return;
    const job = pendingAutoRouteJobs[0];
    setPendingAutoRouteJobs(prev => prev.slice(1));
    autoRouteQueuedRef.current.delete(`${job.dayIdx}:${job.targetIdx}`);
    const run = async () => {
      await autoCalculateRouteFor(job.dayIdx, job.targetIdx, { silent: true });
      const nextExists = !!itinerary.days?.[job.dayIdx]?.plan?.[job.targetIdx + 1];
      if (nextExists) {
        await autoCalculateRouteFor(job.dayIdx, job.targetIdx + 1, { silent: true });
      }
    };
    void run();
  }, [itinerary, pendingAutoRouteJobs]);

  useEffect(() => {
    if (isCalculatingAllRoutes || calculatingRouteId) return;
    const missingJobs = [];
    for (let dayIdx = 0; dayIdx < (itinerary.days || []).length; dayIdx++) {
      const plan = itinerary.days?.[dayIdx]?.plan || [];
      for (let targetIdx = 0; targetIdx < plan.length; targetIdx++) {
        if (!shouldAutoCalculateRoute(dayIdx, targetIdx)) continue;
        const jobKey = `${dayIdx}:${targetIdx}`;
        if (autoRouteQueuedRef.current.has(jobKey)) continue;
        missingJobs.push({ dayIdx, targetIdx, key: jobKey });
      }
    }
    if (!missingJobs.length) return;
    for (const job of missingJobs) {
      autoRouteQueuedRef.current.add(job.key);
    }
    setPendingAutoRouteJobs((prev) => [
      ...prev,
      ...missingJobs.map(({ dayIdx, targetIdx }) => ({ dayIdx, targetIdx })),
    ]);
  }, [itinerary, calculatingRouteId, isCalculatingAllRoutes]);

  const autoCalculateAllRoutes = async () => {
    setIsCalculatingAllRoutes(true);
    setRouteCalcProgress(0);
    setRouteCache({});
    setLastAction("전체 경로 내역을 지우고 재탐색 시작...");
    const jobs = [];
    for (let di = 0; di < itinerary.days.length; di++) {
      const plan = itinerary.days[di].plan || [];
      for (let pi = 0; pi < plan.length; pi++) {
        if (plan[pi].type === 'backup' || plan[pi].types?.includes('ship')) continue;
        jobs.push({ dayIdx: di, pIdx: pi });
      }
    }
    if (jobs.length === 0) {
      setIsCalculatingAllRoutes(false);
      setLastAction("재탐색할 경로가 없습니다.");
      return;
    }
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      await autoCalculateRouteFor(job.dayIdx, job.pIdx, { forceRefresh: true });
      setRouteCalcProgress(Math.round(((i + 1) / jobs.length) * 100));
      await new Promise(r => setTimeout(r, 350));
    }
    setRouteCalcProgress(100);
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
              plan: (d.plan || []).map((p) => {
                const nextItem = { ...p };
                if (!nextItem.receipt) nextItem.receipt = { address: nextItem.address || '', items: [] };
                if (!Array.isArray(nextItem.receipt.items)) nextItem.receipt.items = [];
                applyGeoFieldsToRecord(nextItem);
                return nextItem;
              })
            }));
            setItinerary({
              days: patchedDays,
              places: (sharedData.places || []).map((place) => normalizeLibraryPlace({ ...place })),
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
          const recoveryProbe = {
            ...finalData,
            tripRegion: finalData.tripRegion || tripRegion,
            tripStartDate: finalData.tripStartDate || tripStartDate,
            tripEndDate: finalData.tripEndDate || tripEndDate,
          };
          if (targetPlanId === 'main' && hasNoItineraryContent(recoveryProbe) && isJejuRecoveryContext(recoveryProbe)) {
            finalData = createDefaultJejuPlanData();
            await setDoc(doc(db, 'users', user.uid, 'itinerary', targetPlanId), finalData);
            setLastAction('비어 있던 제주 기본 일정 셸을 샘플 일정으로 복구했습니다.');
          }
          const patchedDays = finalData.days.map(d => ({
            ...d,
            plan: (d.plan || []).map(p => {
              let updatedP = { ...p };
              if (!updatedP.receipt) updatedP.receipt = { address: updatedP.address || '', items: [] };
              if (!Array.isArray(updatedP.receipt.items)) updatedP.receipt.items = [];
              if (updatedP.types?.includes('ship')) {
                const defaultStart = d.day === 1 ? '목포항' : '제주항';
                const defaultEnd = d.day === 1 ? '제주항' : '목포항';
                updatedP.startPoint = updatedP.startPoint || defaultStart;
                updatedP.endPoint = updatedP.endPoint || defaultEnd;
                const shipTimeline = getShipTimeline(updatedP);
                updatedP.time = shipTimeline.loadStartLabel;
                updatedP.loadEndTime = shipTimeline.loadEndLabel;
                updatedP.boardTime = shipTimeline.boardLabel;
                updatedP.sailDuration = shipTimeline.sailDuration;
                updatedP.duration = Math.max(0, shipTimeline.board - shipTimeline.loadStart) + shipTimeline.sailDuration;
                updatedP.isTimeFixed = true;
                if (updatedP.receipt?.shipDetails) {
                  updatedP.receipt.shipDetails.depart = shipTimeline.boardLabel;
                  updatedP.receipt.shipDetails.loading = `${shipTimeline.loadStartLabel} ~ ${shipTimeline.loadEndLabel}`;
                }
              }
              if (updatedP.receipt?.items) {
                updatedP.price = updatedP.receipt.items.reduce((sum, m) => sum + (m.selected ? getMenuLineTotal(m) : 0), 0);
              }
              applyGeoFieldsToRecord(updatedP);
              return updatedP;
            })
          }));
          setItinerary({
            days: patchedDays,
            places: (finalData.places || []).map((place) => normalizeLibraryPlace({ ...place })),
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
      const initialData = createDefaultJejuPlanData();

      // 초기 로딩 시 한 번 전체 계산
      const calculatedDays = initialData.days.map(day => ({
        ...day,
        plan: recalculateSchedule(day.plan)
      }));

      setItinerary({
        days: calculatedDays,
        places: (initialData.places || []).map((place) => normalizeLibraryPlace({ ...place })),
        maxBudget: initialData.maxBudget || 1500000,
        share: normalizeShare(initialData.share || {}),
        planTitle: initialData.planTitle || `${initialData.tripRegion || '여행'} 일정`,
        planCode: initialData.planCode || makePlanCode(initialData.tripRegion || '여행', initialData.tripStartDate || ''),
      });
      setTripRegion(initialData.tripRegion || '제주');
      setTripStartDate(initialData.tripStartDate || '');
      setTripEndDate(initialData.tripEndDate || '');
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
  const tripDays = (tripStartDate && tripEndDate)
    ? Math.max(1, Math.floor((new Date(tripEndDate).setHours(0, 0, 0, 0) - new Date(tripStartDate).setHours(0, 0, 0, 0)) / 86400000) + 1)
    : (itinerary.days?.length || 0);
  const tripNights = Math.max(0, tripDays - 1);

  // 터치 드래그 드롭 실행 — 매 렌더마다 최신 클로저로 갱신
  executeTouchDropRef.current = (x, y) => {
    const src = touchDragSourceRef.current;
    if (!src) return;
    let changedByDrag = false;
    const el = document.elementFromPoint(x, y);
    const droptargetEl = el?.closest('[data-droptarget]');
    const dropitemEl = el?.closest('[data-dropitem]');
    const droplibEl = el?.closest('[data-library-dropzone]');
    const dropdelEl = el?.closest('[data-deletezone]');
    const dropActionEl = el?.closest('[data-drag-action]');
    if (src.kind === 'library') {
      const p = src.place;
      if (droptargetEl) {
        const parsedTarget = parseInsertDropTargetValue(droptargetEl.dataset.droptarget);
        if (parsedTarget) {
          changedByDrag = applyInsertAtDropTarget(parsedTarget.dayIdx, parsedTarget.insertAfterPIdx, { kind: 'library', place: p, isCopy: false }) || changedByDrag;
        }
      } else if (dropitemEl) {
        const [dIdx, pIdx] = dropitemEl.dataset.dropitem.split('-').map(Number);
        addPlaceAsPlanB(dIdx, pIdx, p);
        removePlace(p.id);
        changedByDrag = true;
      }
    } else if (src.kind === 'timeline') {
      const payload = src.payload;
      if (dropActionEl) {
        const action = dropActionEl.getAttribute('data-drag-action');
        changedByDrag = applyTimelineBottomAction(action, payload) || changedByDrag;
      } else if (droplibEl) {
        if (payload.altIdx !== undefined) {
          dropAltOnLibrary(payload.dayIdx, payload.pIdx, payload.altIdx);
          changedByDrag = true;
        } else {
          const item = itinerary.days?.[payload.dayIdx]?.plan?.[payload.pIdx];
          dropTimelineItemOnLibrary(payload.dayIdx, payload.pIdx, askPlanBMoveMode(item));
          changedByDrag = true;
        }
      } else if (dropdelEl && payload.altIdx === undefined) {
        deletePlanItem(payload.dayIdx, payload.pIdx);
        changedByDrag = true;
      } else if (droptargetEl) {
        const parsedTarget = parseInsertDropTargetValue(droptargetEl.dataset.droptarget);
        if (parsedTarget) {
          changedByDrag = applyInsertAtDropTarget(parsedTarget.dayIdx, parsedTarget.insertAfterPIdx, { kind: 'timeline', payload, isCopy: false }) || changedByDrag;
        }
      } else if (dropitemEl && payload.altIdx === undefined) {
        const [dIdx, pIdx] = dropitemEl.dataset.dropitem.split('-').map(Number);
        const sourcePlanItem = itinerary.days?.[payload.dayIdx]?.plan?.[payload.pIdx];
        if (sourcePlanItem && (payload.dayIdx !== dIdx || payload.pIdx !== pIdx)) {
          addPlaceAsPlanB(dIdx, pIdx, toAlternativeFromItem(sourcePlanItem));
          deletePlanItem(payload.dayIdx, payload.pIdx);
          changedByDrag = true;
        }
      }
    }
    if (changedByDrag) triggerUndoToast();
  };

  const renderNavInsertTarget = (dayIdx, insertAfterPIdx, key, warnText = '') => {
    if (!(draggingFromLibrary || draggingFromTimeline)) return null;
    const isDropHere = dropTarget?.dayIdx === dayIdx && dropTarget?.insertAfterPIdx === insertAfterPIdx;
    return (
      <div
        key={key}
        className={`px-1.5 transition-all duration-200 ${isDropHere ? 'py-2.5' : 'py-0.5'}`}
        data-droptarget={`${dayIdx}|${insertAfterPIdx}`}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDropTarget({ dayIdx, insertAfterPIdx });
          setDropOnItem(null);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setDropTarget(null);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const changed = draggingFromLibrary
            ? applyInsertAtDropTarget(dayIdx, insertAfterPIdx, { kind: 'library', place: draggingFromLibrary, isCopy: isDragCopy })
            : applyInsertAtDropTarget(dayIdx, insertAfterPIdx, { kind: 'timeline', payload: draggingFromTimeline, isCopy: isDragCopy });
          if (changed) triggerUndoToast();
          setDraggingFromLibrary(null);
          setDraggingFromTimeline(null);
          setDropTarget(null);
          setDropOnItem(null);
          setIsDragCopy(false);
        }}
      >
        <div
          className={`w-full rounded-[14px] transition-all duration-200 ${isDropHere ? (warnText ? 'h-8 bg-orange-50/90 border border-orange-200/70' : 'h-8 bg-blue-50/85 border border-blue-200/60') : 'h-0.5 bg-transparent border border-transparent'}`}
          title={isDropHere ? (warnText || '여기에 배치됩니다.') : undefined}
        />
      </div>
    );
  };

  const renderTimelineInsertGuide = (isDropHere, warnText = '') => {
    const activeText = warnText || '여기야 · 드래그해주세요.';
    if (!isDropHere) {
      return <div className="h-2 w-full" />;
    }
    return (
      <div className="z-10 flex w-full items-center justify-center">
        <div
          className={`relative flex min-h-[56px] w-full max-w-[320px] items-center justify-center rounded-[20px] border bg-slate-50/98 px-4 py-2.5 transition-all duration-200 ${isDropHere
            ? warnText
              ? 'border-orange-300 bg-orange-50 text-orange-600 shadow-[0_22px_38px_-18px_rgba(251,146,60,0.55)] ring-2 ring-orange-200/70 scale-[1.02]'
              : 'border-[#3182F6]/30 bg-blue-50 text-[#3182F6] shadow-[0_22px_38px_-18px_rgba(49,130,246,0.45)] ring-2 ring-blue-200/70 scale-[1.02]'
            : 'border-slate-300 text-slate-400 shadow-[0_10px_18px_-14px_rgba(15,23,42,0.35)]'
            }`}
        >
          <span className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-current/20" />
          <span className="relative flex items-center justify-center rounded-full bg-white/90 px-3 py-1 text-[12px] font-black leading-none tracking-tight shadow-sm">
            {isDropHere ? activeText : '드래그해주세요.'}
          </span>
        </div>
      </div>
    );
  };

  const renderTimeStepButtons = ({ selectedStep, onSelect, activeTone = 'slate', compact = false }) => {
    const activeClassMap = {
      slate: 'bg-slate-700 text-white',
      blue: 'bg-[#3182F6] text-white',
      indigo: 'bg-indigo-500 text-white',
      violet: 'bg-violet-500 text-white',
    };
    const inactiveClass = compact
      ? 'bg-white/85 text-slate-400 hover:bg-white hover:text-slate-700 border border-white/70'
      : 'bg-slate-50 text-slate-400 hover:bg-slate-100';
    return (
      <>
        {[1, 5, 15, 30].map((step) => (
          <button
            key={step}
            onClick={(e) => { e.stopPropagation(); onSelect(step); }}
            className={`w-full rounded-lg text-center font-black transition-all ${compact ? 'py-1.5 text-[10px]' : 'py-1 text-[9px]'} ${selectedStep === step ? activeClassMap[activeTone] || activeClassMap.slate : inactiveClass}`}
          >
            {step}
          </button>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans flex overflow-x-hidden font-bold flex-row relative">
      {/* ── 장소 수정 모달 ── */}
      {editingPlaceId && editPlaceDraft && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => { setEditingPlaceId(null); setEditPlaceDraft(null); }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative max-h-[85vh] overflow-y-auto no-scrollbar px-3" onClick={(e) => e.stopPropagation()}>
            <PlaceEditorCard
              className="w-[min(360px,calc(100vw-24px))] mx-auto"
              title="장소 수정"
              draft={editPlaceDraft}
              createDraft={createPlaceEditorDraft}
              normalizeBusiness={normalizeBusiness}
              formatClosedDaysSummary={formatClosedDaysSummary}
              buildBusinessQuickEditSegments={buildBusinessQuickEditSegments}
              searchAddressFromPlaceName={searchAddressFromPlaceName}
              BusinessHoursEditor={BusinessHoursEditor}
              onDraftChange={setEditPlaceDraft}
              onSubmit={(nextDraft) => {
                const receipt = deepClone(nextDraft.receipt || { address: nextDraft.address || '', items: [] });
                if (!Array.isArray(receipt.items)) receipt.items = [];
                receipt.address = nextDraft.address || receipt.address || '';
                const price = receipt.items.reduce((sum, item) => sum + (item.selected === false ? 0 : getMenuLineTotal(item)), 0);
                updatePlace(nextDraft.id, { ...nextDraft, business: normalizeBusiness(nextDraft.business || {}), receipt, price });
                setEditingPlaceId(null);
                setEditPlaceDraft(null);
              }}
              onCancel={() => { setEditingPlaceId(null); setEditPlaceDraft(null); }}
              submitLabel="저장"
              cancelLabel="취소"
              regionHint={tripRegion}
              forceReceiptExpanded
              onSmartPasteAll={async () => {
                try {
                  const result = await analyzeClipboardSmartFill({ mode: 'all', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                  const parsed = result?.parsed;
                  if (parsed) {
                    setEditPlaceDraft((current) => createPlaceEditorDraft({
                      ...current,
                      name: parsed.name || current.name,
                      address: parsed.address || current.address,
                      business: parsed.business ? normalizeBusiness(parsed.business) : current.business,
                      receipt: { ...(current.receipt || {}), items: parsed.menus.length ? parsed.menus.filter(Boolean).map((item) => ({ ...item, qty: 1, selected: true })) : (current.receipt?.items || []) },
                    }));
                    showInfoToast(isAiSmartFillSource(result?.source) ? 'AI 스마트 전체 붙여넣기 완료' : '스마트 전체 붙여넣기 완료');
                  } else {
                    showInfoToast(useAiSmartFill ? 'Groq가 붙여넣을 내용을 찾지 못했습니다.' : '붙여넣을 내용을 찾지 못했습니다.');
                  }
                } catch (error) {
                  showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill));
                }
              }}
              onSuperSmartPaste={async () => {
                try {
                  const result = await analyzeClipboardSmartFill({ mode: 'all', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                  const parsed = result?.parsed;
                  if (parsed) {
                    const nextName = parsed.name || editPlaceDraft.name;
                    let nextAddress = parsed.address || editPlaceDraft.address;
                    if (!nextAddress && nextName) {
                      const searchRes = await searchAddressFromPlaceName(nextName, tripRegion);
                      if (searchRes?.address) nextAddress = searchRes.address;
                    }

                    setEditPlaceDraft((current) => createPlaceEditorDraft(current, {
                      name: nextName,
                      address: nextAddress,
                      business: parsed.business ? normalizeBusiness(parsed.business) : current.business,
                      receipt: { ...(current.receipt || {}), items: parsed.menus?.length ? parsed.menus.filter(Boolean).map((item) => ({ ...item, qty: 1, selected: true })) : (current.receipt?.items || []) },
                    }));
                    showInfoToast(isAiSmartFillSource(result?.source) ? 'AI 슈퍼 자동 채우기 완료' : '슈퍼 자동 채우기 완료');
                  } else {
                    showInfoToast(useAiSmartFill ? 'AI가 정보를 찾지 못했습니다.' : '정보를 찾지 못했습니다.');
                  }
                } catch (error) {
                  showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill));
                }
              }}
              onSmartPasteAddress={async () => {
                try {
                  const result = await analyzeClipboardSmartFill({ mode: 'address', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                  if (result?.parsed?.address) {
                    setEditPlaceDraft((current) => createPlaceEditorDraft(current, { address: result.parsed.address }));
                    showInfoToast(isAiSmartFillSource(result?.source) ? 'AI 주소 스마트 입력 완료' : '주소 스마트 입력 완료');
                  } else {
                    showInfoToast('주소를 찾지 못했습니다.');
                  }
                } catch (error) {
                  showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill));
                }
              }}
              onSmartPasteBusiness={async () => {
                try {
                  const result = await analyzeClipboardSmartFill({ mode: 'business', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                  const parsed = result?.parsed;
                  if (parsed?.business) {
                    setEditPlaceDraft((current) => createPlaceEditorDraft({ ...current, business: normalizeBusiness(parsed.business) }));
                    showInfoToast(isAiSmartFillSource(result?.source) ? 'AI 영업정보 스마트 입력 완료' : '영업 정보만 스마트 입력 완료');
                  } else {
                    showInfoToast(useAiSmartFill ? 'Groq가 영업 정보를 찾지 못했습니다.' : '영업 정보를 찾지 못했습니다.');
                  }
                } catch (error) {
                  showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill));
                }
              }}
              onSmartPasteMenus={async () => {
                try {
                  const result = await analyzeClipboardSmartFill({ mode: 'menus', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                  const parsed = result?.parsed;
                  if (parsed?.menus?.length) {
                    setEditPlaceDraft((current) => createPlaceEditorDraft({
                      ...current,
                      receipt: { ...(current.receipt || {}), items: parsed.menus.filter(Boolean).map((item) => ({ ...item, qty: 1, selected: true })) },
                    }));
                    showInfoToast(isAiSmartFillSource(result?.source) ? 'AI 메뉴 스마트 입력 완료' : '메뉴 정보만 스마트 입력 완료');
                  } else {
                    showInfoToast(useAiSmartFill ? 'Groq가 메뉴 정보를 찾지 못했습니다.' : '메뉴 정보를 찾지 못했습니다.');
                  }
                } catch (error) {
                  showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill));
                }
              }}
            />
          </div>
        </div>
      )}
      {editingPlanTarget && editPlanDraft && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => { setEditingPlanTarget(null); setEditPlanDraft(null); }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative max-h-[85vh] overflow-y-auto no-scrollbar px-3" onClick={(e) => e.stopPropagation()}>
            <PlaceEditorCard
              className="w-[min(360px,calc(100vw-24px))] mx-auto"
              title="일정 수정"
              draft={editPlanDraft}
              createDraft={createPlaceEditorDraft}
              normalizeBusiness={normalizeBusiness}
              formatClosedDaysSummary={formatClosedDaysSummary}
              buildBusinessQuickEditSegments={buildBusinessQuickEditSegments}
              searchAddressFromPlaceName={searchAddressFromPlaceName}
              BusinessHoursEditor={BusinessHoursEditor}
              onDraftChange={setEditPlanDraft}
              onSubmit={savePlanEditDraft}
              onCancel={() => { setEditingPlanTarget(null); setEditPlanDraft(null); }}
              submitLabel="저장"
              cancelLabel="취소"
              regionHint={tripRegion}
              forceReceiptExpanded
              onSmartPasteAll={async () => {
                try {
                  const result = await analyzeClipboardSmartFill({ mode: 'all', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                  const parsed = result?.parsed;
                  if (parsed) {
                    setEditPlanDraft((current) => createPlaceEditorDraft({
                      ...current,
                      name: parsed.name || current.name,
                      address: parsed.address || current.address,
                      business: parsed.business ? normalizeBusiness(parsed.business) : current.business,
                      receipt: { ...(current.receipt || {}), items: parsed.menus.length ? parsed.menus.filter(Boolean).map((item) => ({ ...item, qty: 1, selected: true })) : (current.receipt?.items || []) },
                    }));
                    showInfoToast(isAiSmartFillSource(result?.source) ? 'AI 스마트 전체 붙여넣기 완료' : '스마트 전체 붙여넣기 완료');
                  } else {
                    showInfoToast(useAiSmartFill ? 'Groq가 붙여넣을 내용을 찾지 못했습니다.' : '붙여넣을 내용을 찾지 못했습니다.');
                  }
                } catch (error) {
                  showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill));
                }
              }}
              onSuperSmartPaste={async () => {
                try {
                  const result = await analyzeClipboardSmartFill({ mode: 'all', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                  const parsed = result?.parsed;
                  if (parsed) {
                    const nextName = parsed.name || editPlanDraft.name;
                    let nextAddress = parsed.address || editPlanDraft.address;
                    if (!nextAddress && nextName) {
                      const searchRes = await searchAddressFromPlaceName(nextName, tripRegion);
                      if (searchRes?.address) nextAddress = searchRes.address;
                    }

                    setEditPlanDraft((current) => createPlaceEditorDraft(current, {
                      name: nextName,
                      address: nextAddress,
                      business: parsed.business ? normalizeBusiness(parsed.business) : current.business,
                      receipt: { ...(current.receipt || {}), items: parsed.menus?.length ? parsed.menus.filter(Boolean).map((item) => ({ ...item, qty: 1, selected: true })) : (current.receipt?.items || []) },
                    }));
                    showInfoToast(isAiSmartFillSource(result?.source) ? 'AI 슈퍼 자동 채우기 완료' : '슈퍼 자동 채우기 완료');
                  } else {
                    showInfoToast(useAiSmartFill ? 'AI가 정보를 찾지 못했습니다.' : '정보를 찾지 못했습니다.');
                  }
                } catch (error) {
                  showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill));
                }
              }}
              onSmartPasteAddress={async () => {
                try {
                  const result = await analyzeClipboardSmartFill({ mode: 'address', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                  if (result?.parsed?.address) {
                    setEditPlanDraft((current) => createPlaceEditorDraft(current, { address: result.parsed.address }));
                    showInfoToast(isAiSmartFillSource(result?.source) ? 'AI 주소 스마트 입력 완료' : '주소 스마트 입력 완료');
                  } else {
                    showInfoToast('주소를 찾지 못했습니다.');
                  }
                } catch (error) {
                  showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill));
                }
              }}
              onSmartPasteBusiness={async () => {
                try {
                  const result = await analyzeClipboardSmartFill({ mode: 'business', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                  const parsed = result?.parsed;
                  if (parsed?.business) {
                    setEditPlanDraft((current) => createPlaceEditorDraft({ ...current, business: normalizeBusiness(parsed.business) }));
                    showInfoToast(isAiSmartFillSource(result?.source) ? 'AI 영업정보 스마트 입력 완료' : '영업 정보만 스마트 입력 완료');
                  } else {
                    showInfoToast(useAiSmartFill ? 'Groq가 영업 정보를 찾지 못했습니다.' : '영업 정보를 찾지 못했습니다.');
                  }
                } catch (error) {
                  showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill));
                }
              }}
              onSmartPasteMenus={async () => {
                try {
                  const result = await analyzeClipboardSmartFill({ mode: 'menus', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                  const parsed = result?.parsed;
                  if (parsed?.menus?.length) {
                    setEditPlanDraft((current) => createPlaceEditorDraft({
                      ...current,
                      receipt: { ...(current.receipt || {}), items: parsed.menus.filter(Boolean).map((item) => ({ ...item, qty: 1, selected: true })) },
                    }));
                    showInfoToast(isAiSmartFillSource(result?.source) ? 'AI 메뉴 스마트 입력 완료' : '메뉴 정보만 스마트 입력 완료');
                  } else {
                    showInfoToast(useAiSmartFill ? 'Groq가 메뉴 정보를 찾지 못했습니다.' : '메뉴 정보를 찾지 못했습니다.');
                  }
                } catch (error) {
                  showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill));
                }
              }}
            />
          </div>
        </div>
      )}
      {isAddingPlace && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={resetNewPlaceDraft}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative max-h-[85vh] overflow-y-auto no-scrollbar px-3" onClick={(e) => e.stopPropagation()}>
            <PlaceAddForm
              newPlaceName={newPlaceName}
              setNewPlaceName={setNewPlaceName}
              newPlaceTypes={newPlaceTypes}
              setNewPlaceTypes={setNewPlaceTypes}
              regionHint={tripRegion}
              onAdd={addPlace}
              onCancel={resetNewPlaceDraft}
              aiEnabled={useAiSmartFill}
              aiSettings={aiSmartFillConfig}
              onNotify={showInfoToast}
              aiLearningCapture={aiLearningCapture}
              submitAiLearningCase={submitAiLearningCase}
              setAiLearningCapture={setAiLearningCapture}
              createPlaceEditorDraft={createPlaceEditorDraft}
              normalizeBusiness={normalizeBusiness}
              EMPTY_BUSINESS={EMPTY_BUSINESS}
              formatClosedDaysSummary={formatClosedDaysSummary}
              buildBusinessQuickEditSegments={buildBusinessQuickEditSegments}
              searchAddressFromPlaceName={searchAddressFromPlaceName}
              BusinessHoursEditor={BusinessHoursEditor}
              normalizeAiSmartFillConfig={normalizeAiSmartFillConfig}
              getCurrentUserBearerToken={getCurrentUserBearerToken}
              fetchGeminiPlaceInfoFromMapLink={fetchGeminiPlaceInfoFromMapLink}
              runGroqSmartFill={runGroqSmartFill}
              parseBusinessHoursText={parseBusinessHoursText}
              analyzeClipboardSmartFill={analyzeClipboardSmartFill}
              extractNaverMapLink={extractNaverMapLink}
              normalizeSmartFillResult={normalizeSmartFillResult}
              parseNaverMapText={parseNaverMapText}
              isAiSmartFillSource={isAiSmartFillSource}
              getSmartFillErrorMessage={getSmartFillErrorMessage}
            />
          </div>
        </div>
      )}
      {showRoutePreviewModal && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center" onClick={() => setShowRoutePreviewModal(false)}>
          <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />
          <div className="relative w-[min(520px,92vw)] rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[14px] font-black text-slate-800">전체 동선 지도 보기</p>
                <p className="mt-1 text-[10px] font-bold text-slate-400">Day별 이동 흐름 요약</p>
              </div>
              <button type="button" onClick={() => setShowRoutePreviewModal(false)} className="w-8 h-8 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-5">
              <div className="rounded-[24px] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.35),_rgba(255,255,255,0.96)_55%)] p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  {routePreviewMap.map((day) => (
                    <div key={`modal-day-${day.day}`} className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-slate-200 px-2.5 py-1 text-[10px] font-black text-slate-600 shadow-sm">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: day.color }} />
                      <span>Day {day.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  {routePreviewEndpointActions.map((action) => (
                    <button
                      key={`modal-toggle-${action.id}`}
                      type="button"
                      onClick={() => setHiddenRoutePreviewEndpoints((prev) => ({ ...prev, [action.id]: !prev[action.id] }))}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black transition-colors ${action.hidden ? 'border-slate-200 bg-white text-slate-400' : 'border-amber-200 bg-amber-50 text-amber-600'}`}
                    >
                      {action.hidden ? '복원' : '제거'}
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
                <div className="relative overflow-hidden rounded-[22px] border border-sky-100 bg-[linear-gradient(180deg,rgba(186,230,253,0.75),rgba(239,246,255,0.9))] p-3">
                  <RoutePreviewCanvas routePreviewMap={routePreviewMap} height={300} />
                </div>
              </div>
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
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                  <MapIcon size={14} className="text-[#3182F6]" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-[13px] font-black tracking-[0.18em] text-slate-800 uppercase leading-none">Anti Planer</h2>
                  <p className="mt-1 text-[10px] font-bold text-slate-400 leading-none">v{APP_VERSION} · {timeSincePush}</p>
                </div>
              </div>
            </div>
            {/* ── 스크롤 컨텐츠 ── */}
            <div className="flex-1 overflow-y-auto overscroll-none no-scrollbar py-6 px-5 flex flex-col">
              <nav className="relative -ml-1.5 flex flex-col gap-5">
                {itinerary.days?.map((d, dNavIdx) => (
                  <div key={d.day} className={`rounded-[24px] border px-2.5 py-2.5 transition-all ${activeDay === d.day ? 'border-blue-200 bg-[linear-gradient(180deg,rgba(239,246,255,0.88),rgba(255,255,255,0.98))] shadow-[0_18px_40px_-28px_rgba(49,130,246,0.45)]' : 'border-slate-200/80 bg-white shadow-[0_10px_24px_-20px_rgba(15,23,42,0.16)]'}`}>
                    <div className={`mb-2 rounded-[18px] border px-2.5 py-2 ${activeDay === d.day ? 'border-blue-200/90 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]' : 'border-slate-200 bg-slate-50/80'}`}>
                      <div className={`rounded-[14px] border px-2.5 py-2 ${activeDay === d.day ? 'border-blue-200 bg-blue-50/60' : 'border-slate-200 bg-white/90'}`}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setNavDayMenu({ dayIdx: dNavIdx, day: d.day })}
                            className={`text-[14px] tracking-tight transition-colors duration-300 whitespace-nowrap ${activeDay === d.day ? 'text-[#3182F6] font-black' : 'text-slate-700 font-black hover:text-slate-900'}`}
                            title={`${d.day}일차 메뉴 열기`}
                          >
                            {getNavDateLabelForDay(d.day).primary}
                          </button>
                          <span className={`inline-flex h-5 items-center justify-center text-[10px] font-black rounded-md px-1.5 leading-none ${activeDay === d.day ? 'text-[#3182F6] bg-white border border-blue-200 shadow-sm' : 'text-slate-400 bg-slate-50 border border-slate-200'}`}>
                            {getNavDateLabelForDay(d.day).secondary || '요일'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-1" />
                    <div className="flex flex-col gap-1">
                      {(() => {
                        const navPlanItems = (d.plan || []).filter(p => p.type !== 'backup');
                        const expectedNightSlot = d.day <= tripNights;
                        const lastStayIndex = navPlanItems.findIndex((item, index, arr) =>
                          index === arr.length - 1 && (isFullLodgeStayItem(item) || (Array.isArray(item.types) && item.types.includes('stay')))
                        );
                        const lastStayItem = lastStayIndex >= 0 ? navPlanItems[lastStayIndex] : null;
                        if (navPlanItems.length === 0) {
                          return (
                            <>
                              {renderNavInsertTarget(dNavIdx, -1, `nav-insert-empty-${d.day}`)}
                              {expectedNightSlot && (
                                <div
                                  data-droptarget={`${dNavIdx}|-1`}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDropTarget({ dayIdx: dNavIdx, insertAfterPIdx: -1 });
                                    setDropOnItem(null);
                                  }}
                                  onDragLeave={(e) => {
                                    if (!e.currentTarget.contains(e.relatedTarget)) setDropTarget(null);
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const changed = draggingFromLibrary
                                      ? applyInsertAtDropTarget(dNavIdx, -1, { kind: 'library', place: draggingFromLibrary, isCopy: isDragCopy })
                                      : applyInsertAtDropTarget(dNavIdx, -1, { kind: 'timeline', payload: draggingFromTimeline, isCopy: isDragCopy });
                                    if (changed) triggerUndoToast();
                                    setDraggingFromLibrary(null);
                                    setDraggingFromTimeline(null);
                                    setDropTarget(null);
                                    setDropOnItem(null);
                                    setIsDragCopy(false);
                                  }}
                                  className={`mt-2 flex min-h-[42px] w-full items-center gap-1.5 rounded-[14px] border px-2 py-1.5 text-left transition-all ${dropTarget?.dayIdx === dNavIdx && dropTarget?.insertAfterPIdx === -1
                                    ? 'border-indigo-300 bg-indigo-50/90 shadow-[0_14px_24px_-20px_rgba(99,102,241,0.28)]'
                                    : 'border-indigo-200 bg-[linear-gradient(180deg,rgba(238,242,255,0.8),rgba(255,255,255,0.98))]'
                                    }`}
                                >
                                  <div className="shrink-0 scale-[0.88] origin-left opacity-80">{getCategoryBadge('stay')}</div>
                                  <span className="truncate text-[10px] font-bold leading-none text-slate-400">
                                    {dropTarget?.dayIdx === dNavIdx && dropTarget?.insertAfterPIdx === -1 ? '여기에 숙박 배치' : '숙박 드래그'}
                                  </span>
                                </div>
                              )}
                            </>
                          );
                        }
                        return (
                          <>
                            {renderNavInsertTarget(dNavIdx, -1, `nav-insert-start-${d.day}`)}
                            {navPlanItems.map((p, pIdx, arr) => {
                              const isActive = activeItemId === p.id;
                              const isLastLodge = (isFullLodgeStayItem(p) || (Array.isArray(p.types) && p.types.includes('stay'))) && pIdx === arr.length - 1;
                              const navPrimaryType = getPreferredNavCategory(p.types, p.type || 'place');
                              const isFixedTimeNav = !!p.isTimeFixed || p.types?.includes('ship');
                              const navConflictRecommendation = getTimingConflictRecommendation(dNavIdx, pIdx);
                              const navBizWarn = !p.types?.includes('ship') ? getBusinessWarning(p, dNavIdx) : '';
                              const nextNavItem = arr[pIdx + 1];
                              const showBufferConnector = !!nextNavItem?._isBufferCoordinated;
                              const navDropWarn = draggingFromLibrary ? getDropWarning(draggingFromLibrary, dNavIdx, pIdx) : '';
                              const navDragPayload = { dayIdx: dNavIdx, pIdx };
                              return (
                                <React.Fragment key={p.id}>
                                  {isLastLodge && <div className="mt-1.5 border-t border-dashed border-indigo-100/90" />}
                                  <button
                                    draggable={isEditMode}
                                    onTouchStart={(e) => {
                                      if (!isEditMode) return;
                                      const targetEl = e.target instanceof Element ? e.target : null;
                                      const interactiveEl = targetEl?.closest('button,a,input,textarea,[contenteditable],[data-no-drag]');
                                      if (interactiveEl && interactiveEl !== e.currentTarget) return;
                                      touchDragSourceRef.current = { kind: 'timeline', payload: navDragPayload, startX: e.touches[0].clientX, startY: e.touches[0].clientY };
                                      isDraggingActiveRef.current = false;
                                    }}
                                    onDragStart={(e) => {
                                      if (!isEditMode) {
                                        e.preventDefault();
                                        return;
                                      }
                                      const targetEl = e.target instanceof Element ? e.target : null;
                                      const interactiveEl = targetEl?.closest('button, a, input, textarea, [contenteditable="true"], [data-no-drag="true"]');
                                      const isInteractiveTarget = !!interactiveEl && interactiveEl !== e.currentTarget;
                                      if (isInteractiveTarget) {
                                        e.preventDefault();
                                        return;
                                      }
                                      const copy = ctrlHeldRef.current;
                                      desktopDragRef.current = { kind: 'timeline', payload: navDragPayload, copy };
                                      e.dataTransfer.effectAllowed = copy ? 'copy' : 'move';
                                      try {
                                        e.dataTransfer.setData('text/plain', `timeline:${p.id || `${dNavIdx}-${pIdx}`}`);
                                      } catch (_) { /* noop */ }
                                      requestAnimationFrame(() => {
                                        setIsDragCopy(copy);
                                        setDraggingFromTimeline(navDragPayload);
                                      });
                                    }}
                                    onDragEnd={() => {
                                      desktopDragRef.current = null;
                                      setDraggingFromTimeline(null);
                                      setDropTarget(null);
                                      setDropOnItem(null);
                                      setIsDragCopy(false);
                                      endTouchDragLock();
                                    }}
                                    onClick={() => handleNavClick(d.day, p.id)}
                                    className={`${isLastLodge ? 'flex flex-col' : 'grid grid-cols-[2.45rem_1fr_auto]'} items-center gap-1.5 rounded-[14px] border px-2 py-1.5 text-left transition-all ${p._timingConflict ? 'border-red-200 bg-red-50/85 shadow-[0_8px_18px_-16px_rgba(239,68,68,0.55)] hover:bg-red-100/80' : isLastLodge ? 'mt-2 border-indigo-200 bg-[linear-gradient(180deg,rgba(238,242,255,0.95),rgba(255,255,255,0.98))] shadow-[0_14px_24px_-20px_rgba(99,102,241,0.28)] hover:border-indigo-300 hover:bg-indigo-50/90' : isActive ? 'border-blue-200 bg-[linear-gradient(180deg,rgba(239,246,255,0.95),rgba(255,255,255,0.98))] shadow-[0_14px_24px_-18px_rgba(49,130,246,0.42)]' : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50/90'}`}
                                  >
                                    {isLastLodge ? (
                                      <div className="w-full min-w-0 flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                          <div className={`shrink-0 scale-[0.88] origin-left transition-opacity ${isActive ? 'opacity-100' : 'opacity-70'}`}>{getCategoryBadge(navPrimaryType)}</div>
                                          <span className={`truncate text-[10px] leading-none ${p._timingConflict ? 'font-black text-red-600' : isActive ? 'font-black text-slate-700' : 'font-bold text-slate-500'}`}>{p.activity}</span>
                                          {(p.alternatives?.length || 0) > 0 && (
                                            <span className={`shrink-0 text-[8px] leading-none px-1.5 py-0.5 rounded border ${isActive ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-amber-500 bg-amber-50/70 border-amber-200/80'}`}>
                                              B {p.alternatives.length}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <span className={`text-[11px] tabular-nums leading-none ${p._timingConflict ? 'font-black text-red-500' : isFixedTimeNav ? 'font-black text-[#3182F6]' : isActive ? 'font-black text-slate-700' : 'font-bold text-slate-400'}`}>{p.time || '--:--'}</span>
                                        <div className="min-w-0 flex items-center gap-1.5 overflow-hidden">
                                          <div className={`shrink-0 scale-[0.88] origin-left transition-opacity ${isActive ? 'opacity-100' : 'opacity-70'}`}>{getCategoryBadge(navPrimaryType)}</div>
                                          <span className={`truncate text-[10px] leading-none ${p._timingConflict ? 'font-black text-red-600' : isActive ? 'font-black text-slate-700' : 'font-bold text-slate-500'}`}>{p.activity}</span>
                                          {(p.alternatives?.length || 0) > 0 && (
                                            <span className={`shrink-0 text-[8px] leading-none px-1.5 py-0.5 rounded border ${isActive ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-amber-500 bg-amber-50/70 border-amber-200/80'}`}>
                                              B {p.alternatives.length}
                                            </span>
                                          )}
                                        </div>
                                        {!p.types?.includes('ship') && (() => {
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
                                                  openNaverPlaceSearch(getPlaceSearchName(p), p.receipt?.address || p.address || '');
                                                }}
                                                data-no-drag="true"
                                                className={`text-[8px] font-black rounded-md px-1.5 py-0.5 leading-none whitespace-nowrap border transition-colors ${dispDur >= 120 ? 'text-orange-500 bg-orange-50 border-orange-200 hover:bg-orange-100' : isActive ? 'text-slate-500 bg-slate-100 border-slate-200 hover:text-[#3182F6]' : 'text-slate-400 bg-slate-50 border-slate-200 hover:text-[#3182F6] hover:bg-slate-100'}`}
                                                title="네이버 지도에서 장소 검색"
                                              >
                                                {fmtDur(dispDur)}
                                              </button>
                                            </div>
                                          );
                                        })()}
                                      </>
                                    )}
                                  </button>
                                  {p._timingConflict && navConflictRecommendation && (
                                    <div className="grid grid-cols-[2.45rem_1fr_auto] items-center gap-1.5 px-1 py-0.5">
                                      <span />
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          applyTimingConflictRecommendation(dNavIdx, pIdx);
                                        }}
                                        className="col-span-2 flex w-full items-center justify-center rounded-[12px] border border-red-200 bg-red-50 px-2 py-1 text-[9px] font-black leading-none text-red-600 hover:bg-red-100"
                                        title={p._timingConflictReason || '시간 충돌 추천 개선 적용'}
                                      >
                                        추천개선 · {navConflictRecommendation.label}
                                      </button>
                                    </div>
                                  )}
                                  {showBufferConnector && (
                                    <div className="px-1 py-0.5">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleNavClick(d.day, nextNavItem.id, `travel-chip-${dNavIdx}-${pIdx}`);
                                        }}
                                        className="grid w-full grid-cols-[2.45rem_1fr_auto] items-center gap-1.5 rounded-[14px] border border-orange-300 bg-orange-400 px-2 py-1.5 text-left transition-all hover:bg-orange-500"
                                        title={`${nextNavItem.activity || '다음 일정'} 진입 전 이동칩 위치로 이동`}
                                      >
                                        <span className="text-[11px] tabular-nums leading-none opacity-0 select-none">
                                          {nextNavItem.time || '--:--'}
                                        </span>
                                        <span className="text-center text-[10px] font-black leading-none text-white">
                                          {nextNavItem.bufferTimeOverride || `${DEFAULT_BUFFER_MINS}분`}
                                        </span>
                                        <span className="justify-self-end min-w-[2rem] opacity-0 select-none text-[8px] font-black leading-none">
                                          00분
                                        </span>
                                      </button>
                                    </div>
                                  )}
                                  {renderNavInsertTarget(dNavIdx, pIdx, `nav-insert-${p.id}`, navDropWarn)}
                                </React.Fragment>
                              );
                            })}
                            {expectedNightSlot && !lastStayItem && (
                              <div
                                data-droptarget={`${dNavIdx}|${navPlanItems.length - 1}`}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDropTarget({ dayIdx: dNavIdx, insertAfterPIdx: navPlanItems.length - 1 });
                                  setDropOnItem(null);
                                }}
                                onDragLeave={(e) => {
                                  if (!e.currentTarget.contains(e.relatedTarget)) setDropTarget(null);
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const changed = draggingFromLibrary
                                    ? applyInsertAtDropTarget(dNavIdx, navPlanItems.length - 1, { kind: 'library', place: draggingFromLibrary, isCopy: isDragCopy })
                                    : applyInsertAtDropTarget(dNavIdx, navPlanItems.length - 1, { kind: 'timeline', payload: draggingFromTimeline, isCopy: isDragCopy });
                                  if (changed) triggerUndoToast();
                                  setDraggingFromLibrary(null);
                                  setDraggingFromTimeline(null);
                                  setDropTarget(null);
                                  setDropOnItem(null);
                                  setIsDragCopy(false);
                                }}
                                className={`mt-2 flex min-h-[42px] w-full items-center gap-1.5 rounded-[14px] border px-2 py-1.5 text-left transition-all ${dropTarget?.dayIdx === dNavIdx && dropTarget?.insertAfterPIdx === navPlanItems.length - 1
                                  ? 'border-indigo-300 bg-indigo-50/90 shadow-[0_14px_24px_-20px_rgba(99,102,241,0.28)]'
                                  : 'border-indigo-200 bg-[linear-gradient(180deg,rgba(238,242,255,0.8),rgba(255,255,255,0.98))]'
                                  }`}
                              >
                                <div className="shrink-0 scale-[0.88] origin-left opacity-80">{getCategoryBadge('stay')}</div>
                                <span className="truncate text-[10px] font-bold leading-none text-slate-400">
                                  {dropTarget?.dayIdx === dNavIdx && dropTarget?.insertAfterPIdx === navPlanItems.length - 1 ? '여기에 숙박 배치' : '숙박 드래그'}
                                </span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* ── 하단 고정: 사용자 정보 & 로그아웃 버튼 ── */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 mt-auto">
              {canManagePlan && (
                <div className="relative mb-2">
                  <button
                    onClick={() => setShowNavMenu((v) => !v)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black text-slate-500 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors flex items-center justify-between gap-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                      메뉴
                    </span>
                    <span className={`transition-transform ${showNavMenu ? 'rotate-180' : ''}`}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </span>
                  </button>
                  {showNavMenu && (
                    <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10 animate-in slide-in-from-bottom-2">
                      <button
                        onClick={() => { setShowPlanManager(true); setShowNavMenu(false); }}
                        className="w-full px-3 py-2.5 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                        일정 목록
                      </button>
                      <div className="h-px bg-slate-100 mx-3" />
                      <button
                        onClick={() => { setShowAiSettings(true); setShowNavMenu(false); }}
                        className="w-full px-3 py-2.5 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M4.93 4.93A10 10 0 0 0 19.07 19.07" /></svg>
                        AI 설정
                      </button>
                      <div className="h-px bg-slate-100 mx-3" />
                      <button
                        onClick={() => { setUseAiSmartFill((prev) => !prev); setShowNavMenu(false); }}
                        className="w-full px-3 py-2.5 text-left text-[11px] font-bold flex items-center gap-2.5 transition-colors hover:bg-slate-50"
                      >
                        <span className={`w-7 h-4 rounded-full flex items-center transition-colors shrink-0 ${useAiSmartFill ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                          <span className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform mx-0.5 ${useAiSmartFill ? 'translate-x-3' : 'translate-x-0'}`} />
                        </span>
                        <span className={useAiSmartFill ? 'text-indigo-600' : 'text-slate-500'}>
                          AI 자동채우기 {useAiSmartFill ? 'ON' : 'OFF'}
                        </span>
                      </button>
                      <div className="h-px bg-slate-100 mx-3" />
                      <button
                        onClick={() => { setShowSmartFillGuide(true); setShowNavMenu(false); }}
                        className="w-full px-3 py-2.5 text-left text-[11px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                        자동입력 학습 지침
                      </button>
                    </div>
                  )}
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
        {/* 버전 뱃지 — 비활성화 */}
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
                  onClick={() => {
                    if (isAddingPlace) resetNewPlaceDraft();
                    else setIsAddingPlace(true);
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-[#3182F6] transition-colors shrink-0"
                >
                  <Plus size={11} />
                </button>
              </div>
            </div>

            {/* ── 스크롤 컨텐츠 ── */}
            <div
              className="flex-1 overflow-y-auto overscroll-none no-scrollbar px-5 pt-4 pb-2 flex flex-col"
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
                let visiblePlaces = [...distanceSortedPlaces].filter(Boolean);

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
                const filterTagOptions = [
                  ...TAG_OPTIONS.filter(t => t.value !== 'place' && t.value !== 'new' && t.value !== 'revisit').map((tag) => ({ ...tag, isCustom: false })),
                  ...customPlaceCategories.map((tag) => ({ value: tag, label: getCustomTagLabel(tag), isCustom: true })),
                ];
                return (
                  <div className="w-full flex flex-col gap-1.5 items-stretch">
                    {draggingFromTimeline && (
                      <div
                        className={`w-full mb-2 rounded-[20px] border-2 border-dashed px-4 py-4 flex items-center justify-center gap-3 text-center transition-all ${dragBottomTarget === 'move_to_library' ? 'border-[#3182F6] bg-blue-50 text-[#3182F6] shadow-[0_12px_26px_-18px_rgba(49,130,246,0.45)]' : 'border-slate-200 bg-white/90 text-slate-500'}`}
                        data-drag-action="move_to_library"
                        onDragOver={(e) => { e.preventDefault(); setDragBottomTarget('move_to_library'); }}
                        onDragLeave={() => setDragBottomTarget(prev => (prev === 'move_to_library' ? '' : prev))}
                        onDrop={(e) => {
                          e.preventDefault();
                          const payload = draggingFromTimeline;
                          if (!payload) return;
                          if (payload.altIdx !== undefined) {
                            dropAltOnLibrary(payload.dayIdx, payload.pIdx, payload.altIdx);
                          } else {
                            dropTimelineItemOnLibrary(payload.dayIdx, payload.pIdx);
                          }
                          triggerUndoToast("내 장소로 이동되었습니다.");
                          setDragBottomTarget('');
                          setDraggingFromTimeline(null);
                        }}
                      >
                        <Package size={18} />
                        <div className="flex flex-col items-start">
                          <span className="text-[12px] font-black">여기에 드래그해서 내 장소로 이동</span>
                          <span className="text-[10px] font-bold opacity-70">일정 카드나 플랜 B를 놓으면 오른쪽 목록으로 옮깁니다.</span>
                        </div>
                      </div>
                    )}
                    {/* 필터 및 정렬 상태 표시기 */}
                    <div className="w-full flex flex-col gap-1 mb-2">
                      <div className="flex items-start gap-1 px-1">
                        <div className="flex flex-1 flex-wrap gap-1">
                          {filterTagOptions.map(t => {
                            const active = placeFilterTags.includes(t.value);
                            return (
                              <button
                                key={t.value}
                                onClick={() => setPlaceFilterTags(prev => active ? prev.filter(v => v !== t.value) : [...prev, t.value])}
                                className={`px-2 py-0.5 rounded-lg text-[9px] font-black border transition-all ${active ? 'bg-[#3182F6] text-white border-[#3182F6] shadow-sm' : t.isCustom ? 'bg-slate-50 text-slate-600 border-slate-300 hover:border-slate-400' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                              >
                                <span>{t.label}</span>
                                <span className={`ml-1 px-1 rounded text-[8px] font-black ${active ? 'bg-white/30 text-white' : t.isCustom ? 'bg-white text-slate-500 border border-slate-200' : 'bg-slate-100 text-slate-500'}`}>
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
                        <button
                          type="button"
                          onClick={() => setShowPlaceCategoryManager((prev) => !prev)}
                          className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${showPlaceCategoryManager ? 'border-[#3182F6] bg-blue-50 text-[#3182F6]' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'}`}
                          title="카테고리 관리"
                        >
                          <SlidersHorizontal size={12} />
                        </button>
                      </div>

                      {showPlaceCategoryManager && (
                        <div className="mx-1 rounded-[14px] border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                          <p className="text-[10px] font-black text-slate-600">카테고리 관리</p>
                          <p className="mt-0.5 text-[9px] font-bold text-slate-400">직접 추가한 카테고리를 전체 데이터에서 제거합니다.</p>
                          {customPlaceCategories.length === 0 ? (
                            <p className="mt-2 text-[10px] font-bold text-slate-400">삭제 가능한 사용자 카테고리가 없습니다.</p>
                          ) : (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {customPlaceCategories.map((tag) => (
                                <button
                                  key={`manager-${tag}`}
                                  type="button"
                                  onClick={() => removeCustomCategoryEverywhere(tag)}
                                  className="flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-[10px] font-black text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors"
                                  title={`'${tag}' 카테고리 삭제`}
                                >
                                  <span>{getCustomTagLabel(tag)}</span>
                                  <Trash2 size={10} />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

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
                    {visiblePlaces.filter(place => place && (place.id || place.name)).map(place => {
                      const chips = place.types ? place.types.map(t => getCategoryBadge(t)) : [getCategoryBadge('place')];
                      const isPlaceExpanded = expandedPlaceId === place.id;
                      const bizWarningNow = getBusinessWarningNow(place.business);
                      const bizSummary = formatBusinessSummary(place.business, place);
                      const hasBizSummary = bizSummary !== '미설정';
                      const openStatus = isOpenAt(place.business); // true=영업중, false=마감, null=정보없음
                      const baseDistance = placeDistanceMap[place.id];
                      const placeCardClass = `${draggingFromLibrary?.id === place.id ? 'opacity-40 animate-pulse' : 'hover:shadow-[0_14px_32px_-14px_rgba(49,130,246,0.22)] hover:border-[#3182F6]/25'} ${isPlaceExpanded ? 'scale-[1.01]' : ''}`.trim();
                      const statusChip = bizWarningNow
                        ? <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border border-orange-200 bg-orange-50 text-orange-600">영업 주의</span>
                        : openStatus === true
                          ? <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border border-[#3182F6]/20 bg-blue-50 text-[#3182F6]">영업중</span>
                          : null;
                      const lodgeSegmentItems = isLodgeStay(place.types) ? getLodgeSegmentDragItems(place) : [];

                      return (
                        <PlaceLibraryCard
                          key={place.id}
                          buildBusinessQuickEditSegments={buildBusinessQuickEditSegments}
                          cardProps={{
                            draggable: isEditMode,
                            onTouchStart: (e) => {
                              if (!isEditMode) return;
                              const targetEl = e.target instanceof Element ? e.target : null;
                              if (targetEl?.closest('input,button,a,textarea,[contenteditable],[data-no-drag]')) return;
                              touchDragSourceRef.current = { kind: 'library', place, startX: e.touches[0].clientX, startY: e.touches[0].clientY };
                              isDraggingActiveRef.current = false;
                            },
                            onDragStart: (e) => {
                              if (!isEditMode) { e.preventDefault(); return; }
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
                            },
                            onDragEnd: () => { desktopDragRef.current = null; setDraggingFromLibrary(null); setDropTarget(null); setDropOnItem(null); setIsDragCopy(false); },
                            onDragOver: (e) => {
                              if (draggingFromTimeline) { e.preventDefault(); e.stopPropagation(); }
                            },
                            onDrop: (e) => {
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
                            },
                            className: placeCardClass,
                          }}
                          place={place}
                          chips={chips}
                          baseDistance={baseDistance}
                          statusChip={statusChip}
                          businessSummary={bizWarningNow ? `주의 · ${hasBizSummary ? bizSummary : '영업 정보 미설정'}` : (hasBizSummary ? bizSummary : '미설정')}
                          isExpanded={isPlaceExpanded}
                          extraContent={isLodgeStay(place.types) ? (
                            <div className="mt-0.5 rounded-2xl border border-indigo-100 bg-indigo-50/45 px-3 py-3" data-no-drag="true" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className="text-[10px] font-black tracking-[0.18em] uppercase text-indigo-400">숙소 세그먼트</p>
                                  <p className="text-[10px] font-bold text-slate-400">전체 숙소는 카드 자체를, 세그먼트는 아래 chips를 드래그하세요.</p>
                                </div>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {lodgeSegmentItems.map((segment) => {
                                  const segmentPayload = buildLibraryPayloadFromLodgeSegment(place, segment);
                                  return (
                                    <div
                                      key={segment.id}
                                      role="button"
                                      tabIndex={0}
                                      draggable
                                      data-no-drag="true"
                                      onMouseDown={(e) => e.stopPropagation()}
                                      onTouchStart={(e) => {
                                        e.stopPropagation();
                                        touchDragSourceRef.current = { kind: 'library', place: segmentPayload, startX: e.touches[0].clientX, startY: e.touches[0].clientY };
                                        isDraggingActiveRef.current = false;
                                      }}
                                      onDragStart={(e) => {
                                        e.stopPropagation();
                                        const copy = true;
                                        desktopDragRef.current = { kind: 'library', place: segmentPayload, copy };
                                        e.dataTransfer.effectAllowed = 'copy';
                                        try {
                                          e.dataTransfer.setData('text/plain', `library-segment:${segmentPayload.id}`);
                                        } catch (_) { /* noop */ }
                                        requestAnimationFrame(() => {
                                          setDraggingFromLibrary(segmentPayload);
                                          setIsDragCopy(true);
                                        });
                                      }}
                                      onDragEnd={() => { desktopDragRef.current = null; setDraggingFromLibrary(null); setDropTarget(null); setDropOnItem(null); setIsDragCopy(false); }}
                                      className={`inline-flex items-center gap-1.5 rounded-xl border px-2 py-1 text-[10px] font-black transition-colors cursor-grab active:cursor-grabbing select-none ${segment.type === 'stay' ? 'border-violet-200 bg-violet-50 text-violet-600' : segment.type === 'swim' ? 'border-cyan-200 bg-cyan-50 text-cyan-600' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600'}`}
                                      title="드래그하여 일정에 복제"
                                    >
                                      <GripVertical size={10} className="shrink-0" />
                                      <span>{segment.label}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}
                          onEdit={(e) => {
                            e?.stopPropagation?.();
                            setEditingPlaceId(place.id);
                            setEditPlaceDraft(createPlaceEditorDraft(place));
                          }}
                          onOpenMap={(e) => { e.stopPropagation(); openNaverPlaceSearch(place.name, place.address || place.receipt?.address || ''); }}
                          onBusinessEdit={(e) => {
                            e.stopPropagation();
                            const hasBiz = place.business?.open || place.business?.close || place.business?.breakStart || place.business?.breakEnd || place.business?.lastOrder || place.business?.entryClose || place.business?.closedDays?.length;
                            const bizDefaults = hasBiz ? normalizeBusiness(place.business || {}) : { ...DEFAULT_BUSINESS };
                            setEditingPlaceId(place.id);
                            setEditPlaceDraft(createPlaceEditorDraft(place, { business: bizDefaults, showBusinessEditor: true }));
                          }}
                          onBusinessQuickEdit={(fieldKey) => {
                            const hasBiz = place.business?.open || place.business?.close || place.business?.breakStart || place.business?.breakEnd || place.business?.lastOrder || place.business?.entryClose || place.business?.closedDays?.length;
                            const bizDefaults = hasBiz ? normalizeBusiness(place.business || {}) : { ...DEFAULT_BUSINESS };
                            setEditingPlaceId(place.id);
                            setEditPlaceDraft(createPlaceEditorDraft(place, { business: bizDefaults, showBusinessEditor: true, businessFocusField: fieldKey }));
                          }}
                          onToggleExpand={(e) => { e.stopPropagation(); setExpandedPlaceId(prev => (prev === place.id ? null : place.id)); }}
                          onDelete={(e) => { e.stopPropagation(); removePlace(place.id); }}
                          getMenuQtyValue={getMenuQty}
                          getMenuLineTotalValue={getMenuLineTotal}
                        />
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </>
        )
        }
      </div>

      <div className="flex-1 flex flex-col items-center w-full bg-slate-50 min-h-screen" style={{ marginLeft: leftSidebarWidth, marginRight: isMobileLayout ? rightSidebarWidth : (col2Collapsed ? 44 : 300) }}>
        {/* 일정 목록 */}
        <div className="w-full px-4 pt-8 pb-32">
          {isSharedReadOnly && (
            <div className={`mx-auto mb-3 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-[11px] font-black text-amber-700 ${isCompactTimeline ? 'max-w-[500px]' : 'max-w-[560px]'}`}>
              공유 일정 보기 모드입니다. (편집 권한 없음)
            </div>
          )}

          {/* ── 플랜B 변형 선택 팝업 (루트 레벨 fixed — overflow-hidden 카드 영향 없음) ── */}
          {planVariantPicker && (() => {
            const allDays = itinerary.days || [];
            const day = allDays[planVariantPicker.dayIdx];
            const item = day?.plan?.[planVariantPicker.pIdx];
            if (!item) return null;
            const variants = [item, ...(item.alternatives || [])];
            const curPos = viewingPlanIdx[item.id] ?? 0;
            return (
              <>
                <div className="fixed inset-0 z-[169]" onClick={() => setPlanVariantPicker(null)} />
                <div
                  data-plan-picker="true"
                  className="fixed z-[170] w-[250px] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_18px_36px_-18px_rgba(15,23,42,0.35)] p-2.5"
                  style={{ left: planVariantPicker.left, top: planVariantPicker.top }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">플랜 목록 ({variants.length}개)</p>
                  <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto no-scrollbar">
                    {variants.map((v, idx) => {
                      const active = idx === curPos;
                      return (
                        <button
                          key={`${item.id}_variant_${idx}`}
                          type="button"
                          onClick={() => { selectPlanVariantAt(planVariantPicker.dayIdx, planVariantPicker.pIdx, idx); setPlanVariantPicker(null); }}
                          className={`w-full text-left px-2.5 py-2 rounded-xl border transition-colors ${active ? 'border-[#3182F6] bg-blue-50 text-[#3182F6]' : 'border-slate-200 bg-white text-slate-700 hover:border-[#3182F6] hover:text-[#3182F6]'}`}
                        >
                          <p className="text-[11px] font-black truncate">{v.activity || `플랜 ${idx + 1}`}</p>
                          <p className="text-[10px] font-bold text-slate-400 truncate">{(v.receipt?.address || '').trim() || '주소 미정'}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}

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

          {navDayMenu && (
            <>
              <div className="fixed inset-0 z-[260] bg-black/20" onClick={() => setNavDayMenu(null)} />
              <div className="fixed z-[261] top-1/2 left-1/2 w-[min(360px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-black text-slate-800">일별 수정 메뉴</p>
                    <p className="mt-1 text-[11px] font-bold text-slate-400">
                      {getNavDateLabelForDay(navDayMenu.day).primary} · {getNavDateLabelForDay(navDayMenu.day).secondary}
                    </p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600" onClick={() => setNavDayMenu(null)}><X size={16} /></button>
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleNavClick(navDayMenu.day);
                      setNavDayMenu(null);
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-[#3182F6] hover:bg-blue-50/60"
                  >
                    <span>
                      <span className="block text-[12px] font-black text-slate-700">이 날짜로 이동</span>
                      <span className="block mt-1 text-[10px] font-bold text-slate-400">메인 일정 화면을 해당 날짜 위치로 이동</span>
                    </span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDayPlanItemsToLibrary(navDayMenu.dayIdx)}
                    className="flex w-full items-center justify-between rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-left transition-colors hover:bg-blue-100/70"
                  >
                    <span>
                      <span className="block text-[12px] font-black text-[#3182F6]">모든 일정 내장소로 보내기</span>
                      <span className="block mt-1 text-[10px] font-bold text-blue-400">이 날짜의 일반 일정을 한 번에 내 장소로 이동</span>
                    </span>
                    <Package size={15} className="text-[#3182F6]" />
                  </button>
                </div>
              </div>
            </>
          )}

          {showPlanManager && (
            <>
              <div className="fixed inset-0 z-[260] bg-black/20" onClick={() => setShowPlanManager(false)} />
              <div className="fixed z-[261] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,94vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[14px] font-black text-slate-800">일정 관리 (도시별 예시)</p>
                  <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowPlanManager(false)}><X size={16} /></button>
                </div>
                <button
                  onClick={() => {
                    const regionInput = window.prompt('새 일정 지역을 입력하세요. (예: 부산)', '') || '';
                    void createNewPlan(regionInput);
                  }}
                  className="w-full mb-3 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black"
                >
                  새 도시 일정 만들기
                </button>
                <div className="max-h-[52vh] overflow-y-auto">
                  {(planList || []).length === 0 ? (
                    <p className="text-[11px] text-slate-400 font-bold p-3">생성된 일정이 없습니다.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            className={`relative overflow-hidden rounded-2xl border text-left min-h-[170px] transition-all hover:-translate-y-0.5 ${currentPlanId === plan.id ? 'border-[#3182F6] ring-2 ring-[#3182F6]/20' : 'border-slate-200 hover:border-slate-300'}`}
                          >
                            <img
                              src={getRegionCoverImage(meta.region)}
                              alt="plan cover"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55" />
                            <div className="relative z-10 p-4 flex flex-col gap-1.5 text-white">
                              <p className="text-[18px] font-black truncate">{meta.region}</p>
                              {meta.startDate && (
                                <p className="text-[11px] font-bold text-white/85">{meta.startDate.replace(/-/g, '.')}</p>
                              )}
                              {meta.code && meta.code !== 'main' && (
                                <p className="text-[11px] font-black text-white/95 tracking-wide">{meta.code}</p>
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

          {showAiSettings && (
            <>
              <div className="fixed inset-0 z-[260] bg-black/20" onClick={() => setShowAiSettings(false)} />
              <div className="fixed z-[261] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(480px,92vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[14px] font-black text-slate-800">AI 스마트 채우기 설정</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">로그인 상태에서는 서버 암호화 저장을 우선 사용합니다.</p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowAiSettings(false)}><X size={16} /></button>
                </div>
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500">Groq API Key</span>
                    <input
                      type="password"
                      value={aiSmartFillConfig.apiKey}
                      onChange={(e) => setAiSmartFillConfig((prev) => normalizeAiSmartFillConfig({ ...prev, apiKey: e.target.value }))}
                      placeholder={serverAiKeyStatus.hasStoredGroqKey ? '새 Groq 키로 교체하려면 다시 입력' : '암호화 저장할 Groq API 키 입력'}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500">Gemini API Key (네이버 링크 전용)</span>
                    <input
                      type="password"
                      value={aiSmartFillConfig.geminiApiKey}
                      onChange={(e) => setAiSmartFillConfig((prev) => normalizeAiSmartFillConfig({ ...prev, geminiApiKey: e.target.value }))}
                      placeholder={serverAiKeyStatus.hasStoredGeminiKey ? '새 Gemini 키로 교체하려면 다시 입력' : '암호화 저장할 Gemini API 키 입력'}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                    />
                    <p className="mt-1 text-[9px] font-bold text-slate-400">Gemini는 링크 기반 정보 추출 전용이며, 텍스트/이미지 자동채우기는 계속 Groq를 사용합니다.</p>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500">Perplexity API Key (선택, 있으면 우선 사용)</span>
                    <input
                      type="password"
                      value={aiSmartFillConfig.perplexityApiKey}
                      onChange={(e) => setAiSmartFillConfig((prev) => normalizeAiSmartFillConfig({ ...prev, perplexityApiKey: e.target.value }))}
                      placeholder={serverAiKeyStatus.hasStoredPerplexityKey ? '새 Perplexity 키로 교체하려면 다시 입력' : '암호화 저장할 Perplexity API 키 입력'}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                    />
                    <p className="mt-1 text-[9px] font-bold text-slate-400">없으면 Gemini 키로 무료 AI 추천을 시도하고, 있으면 Perplexity를 우선 사용합니다.</p>
                  </label>
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-500 leading-relaxed">
                    {auth.currentUser && !auth.currentUser.isGuest ? (
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <span>{serverAiKeyStatus.loading ? '저장 상태 확인 중...' : `Groq ${serverAiKeyStatus.hasStoredGroqKey ? '저장됨' : '없음'} · Gemini ${serverAiKeyStatus.hasStoredGeminiKey ? '저장됨' : '없음'} · Perplexity ${serverAiKeyStatus.hasStoredPerplexityKey ? '저장됨' : '없음'}`}</span>
                          <button
                            type="button"
                            onClick={() => { void fetchServerAiKeyStatus(); }}
                            className="text-[10px] font-black text-[#3182F6]"
                          >
                            새로고침
                          </button>
                        </div>
                        {serverAiKeyStatus.updatedAt && (
                          <div className="mt-1 text-[9px] text-slate-400">최근 저장: {new Date(serverAiKeyStatus.updatedAt).toLocaleString('ko-KR')}</div>
                        )}
                      </>
                    ) : (
                      <span>게스트/비로그인 상태에서는 현재 세션 동안만 메모리에 보관됩니다.</span>
                    )}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-500 leading-relaxed">
                    로그인 상태에서는 서버가 Groq/Gemini/Perplexity 키를 암호화해 Firestore에 저장합니다. Groq 분석, Gemini 링크 분석, 근처 AI 추천은 저장된 서버 키를 재사용할 수 있고, 이 브라우저 localStorage에는 평문 키를 저장하지 않습니다.
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { void saveServerAiKey(); }}
                    className="px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-[11px] font-black text-[#3182F6] hover:bg-blue-100"
                  >
                    키 저장
                  </button>
                  <button
                    type="button"
                    onClick={() => { void deleteServerAiKey(); }}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-black text-slate-500 hover:border-slate-300"
                  >
                    저장 키 삭제
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiSmartFillConfig((prev) => ({ ...DEFAULT_AI_SMART_FILL_CONFIG, apiKey: '', geminiApiKey: '', perplexityApiKey: '' }))}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-black text-slate-500 hover:border-slate-300"
                  >
                    입력 초기화
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAiSettings(false)}
                    className="px-4 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </>
          )}

          {showSmartFillGuide && <SmartFillGuideModal onClose={() => setShowSmartFillGuide(false)} />}

          {perplexityNearbyModal.open && (
            <>
              <div
                className="fixed inset-0 z-[262] bg-black/20"
                onClick={() => setPerplexityNearbyModal({ open: false, loading: false, provider: '', itemName: '', summary: '', recommendations: [], citations: [], error: '' })}
              />
              <div className="fixed z-[263] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(560px,94vw)] bg-white border border-slate-200 rounded-3xl shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-[linear-gradient(135deg,#faf5ff,#ffffff)] flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-black text-slate-800">AI 근처 추천</p>
                    <p className="mt-1 text-[10px] font-bold text-slate-400 truncate">{perplexityNearbyModal.itemName || '현재 일정'} 기준 주변 추천</p>
                  </div>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600"
                    onClick={() => setPerplexityNearbyModal({ open: false, loading: false, provider: '', itemName: '', summary: '', recommendations: [], citations: [], error: '' })}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="px-5 py-4 max-h-[68vh] overflow-y-auto no-scrollbar">

                  {perplexityNearbyModal.loading ? (
                    <div className="rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-6 text-center">
                      <p className="text-[13px] font-black text-violet-700">AI가 주변 장소를 찾는 중입니다.</p>
                      <p className="mt-1 text-[10px] font-bold text-violet-400">현재 장소, 주소, 다음 일정 시간까지 고려해서 추천합니다.</p>
                    </div>
                  ) : perplexityNearbyModal.error ? (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-5 text-center">
                      <p className="text-[12px] font-black text-red-600">추천을 불러오지 못했습니다.</p>
                      <p className="mt-1 text-[10px] font-bold text-red-400 break-words">{perplexityNearbyModal.error}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {perplexityNearbyModal.summary && (
                        <div className="rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-3 text-[11px] font-bold text-violet-700 leading-relaxed">
                          {perplexityNearbyModal.provider && <div className="mb-1 text-[9px] uppercase tracking-[0.12em] text-violet-400">{perplexityNearbyModal.provider === 'perplexity' ? 'Perplexity' : 'Gemini'}</div>}
                          {perplexityNearbyModal.summary}
                        </div>
                      )}
                      {perplexityNearbyModal.recommendations.map((recommendation, index) => (
                        <div key={`${recommendation.name}-${index}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.2)]">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-black text-violet-600 border border-violet-100">추천 {index + 1}</span>
                                {recommendation.category && <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-black text-slate-500 border border-slate-200">{recommendation.category}</span>}
                              </div>
                              <p className="mt-2 text-[15px] font-black text-slate-800 break-words">{recommendation.name}</p>
                              <p className="mt-1 text-[11px] font-bold text-slate-400 break-words">{recommendation.address || '주소 정보 없음'}</p>
                            </div>
                            <div className="shrink-0 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openNaverPlaceSearch(recommendation.name, recommendation.address)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-[#3182F6] hover:border-[#3182F6]/30 hover:bg-blue-50 transition-colors"
                                title="네이버 지도에서 보기"
                              >
                                <MapIcon size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => addRecommendedPlaceToLibrary(recommendation)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition-colors"
                                title="내 장소에 추가"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.12em]">추천 시간</p>
                              <p className="mt-1 text-[12px] font-black text-slate-700">{recommendation.suggestedTime || '정보 없음'}</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.12em]">예상 이동</p>
                              <p className="mt-1 text-[12px] font-black text-slate-700">{recommendation.estimatedTravelMinutes ? `${recommendation.estimatedTravelMinutes}분` : '정보 없음'}</p>
                            </div>
                          </div>
                          {(recommendation.hoursSummary || recommendation.why || recommendation.priceNote) && (
                            <div className="mt-3 space-y-1.5 text-[11px] font-bold text-slate-600 leading-relaxed">
                              {recommendation.hoursSummary && <p><span className="text-slate-400">운영시간:</span> {recommendation.hoursSummary}</p>}
                              {recommendation.why && <p><span className="text-slate-400">추천 이유:</span> {recommendation.why}</p>}
                              {recommendation.priceNote && <p><span className="text-slate-400">비용 메모:</span> {recommendation.priceNote}</p>}
                            </div>
                          )}
                        </div>
                      ))}
                      {!perplexityNearbyModal.recommendations.length && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-[11px] font-bold text-slate-500">
                          추천 결과가 없습니다. 주소를 더 정확히 입력하거나 Gemini/Perplexity 키 상태를 확인해 주세요.
                        </div>
                      )}
                      {!!perplexityNearbyModal.citations.length && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <p className="text-[10px] font-black text-slate-500 mb-2">참고 링크</p>
                          <div className="flex flex-col gap-1.5">
                            {perplexityNearbyModal.citations.slice(0, 5).map((url) => (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-bold text-[#3182F6] truncate hover:underline"
                              >
                                {url}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── 여행 헤더 카드 ── */}
          {(() => {
            const usedPct = MAX_BUDGET > 0 ? Math.min(100, Math.round((budgetSummary.total / MAX_BUDGET) * 100)) : 0;
            const allSummaryItems = (itinerary.days || []).flatMap((day) => (day.plan || []))
              .filter((item) => item && item.type !== 'backup' && !item.types?.includes('ship'));
            const revisitCount = allSummaryItems.filter((item) => (typeof item.revisit === 'boolean' ? item.revisit : isRevisitCourse(item))).length;
            const newCount = Math.max(0, allSummaryItems.length - revisitCount);
            const revisitPct = allSummaryItems.length > 0 ? Math.round((revisitCount / allSummaryItems.length) * 100) : 0;
            const newPct = allSummaryItems.length > 0 ? Math.round((newCount / allSummaryItems.length) * 100) : 0;
            const allBudgetItems = (itinerary.days || []).flatMap((day) => (day.plan || []))
              .filter((item) => item && item.type !== 'backup');
            const categoryLabelMap = {
              ship: '페리',
              lodge: '숙소',
              food: '식당',
              cafe: '카페',
              tour: '관광',
              rest: '휴식',
              pickup: '픽업',
              openrun: '오픈런',
              view: '뷰맛집',
              experience: '체험',
              souvenir: '기념품샵',
              place: '장소',
              transport: '이동비',
            };
            const categorySpendMap = allBudgetItems.reduce((acc, item) => {
              const types = Array.isArray(item.types) ? item.types : [];
              const baseType = types.find((t) => !MODIFIER_TAGS.has(t) && t !== 'place') || types.find((t) => !MODIFIER_TAGS.has(t)) || 'place';
              const itemPrice = getEffectivePlanPrice(item);
              acc[baseType] = (acc[baseType] || 0) + itemPrice;
              if (item.distance) {
                acc.transport = (acc.transport || 0) + calculateFuelCost(item.distance);
              }
              return acc;
            }, {});
            const totalCategorySpend = Object.values(categorySpendMap).reduce((sum, v) => sum + Number(v || 0), 0);
            const categorySpendRows = Object.entries(categorySpendMap)
              .map(([key, value]) => {
                const label = categoryLabelMap[key] || key;
                const amount = Number(value) || 0;
                const pct = totalCategorySpend > 0 ? Math.round((amount / totalCategorySpend) * 100) : 0;
                return { key, label, amount, pct };
              })
              .sort((a, b) => b.amount - a.amount);
            const totalPlanCount = (itinerary.days || []).reduce((sum, day) => (
              sum + ((day.plan || []).filter((item) => item && item.type !== 'backup').length)
            ), 0);
            const visitItemsByDay = (itinerary.days || []).map((day) => (
              (day.plan || []).filter((item) => {
                if (!item || item.type === 'backup') return false;
                const types = Array.isArray(item.types) ? item.types : [];
                return !types.includes('lodge') && !types.includes('rest') && !types.includes('ship');
              })
            ));
            const visitPlanCount = visitItemsByDay.reduce((sum, dayItems) => sum + dayItems.length, 0);
            const visitDayStats = visitItemsByDay.map((dayItems) => {
              if (!dayItems.length) return { count: 0, spanHours: 0, travelMinutes: 0 };
              const startMinutes = timeToMinutes(dayItems[0]?.time || '00:00');
              const endItem = dayItems[dayItems.length - 1];
              const endMinutes = timeToMinutes(endItem?.time || '00:00') + (Number(endItem?.duration) || 0);
              const spanHours = Math.max(0.5, Math.max(0, endMinutes - startMinutes) / 60);
              const travelMinutes = dayItems.reduce((sum, item) => sum + parseMinsLabel(item.travelTimeOverride || item.travelTimeAuto, 0), 0);
              return { count: dayItems.length, spanHours, travelMinutes };
            });
            const activeVisitDayCount = visitDayStats.filter((stat) => stat.count > 0).length || 1;
            const totalVisitSpanHours = visitDayStats.reduce((sum, stat) => sum + stat.spanHours, 0);
            const visitPerHour = totalVisitSpanHours > 0 ? (visitPlanCount / totalVisitSpanHours) : 0;
            const averageTravelMinutes = activeVisitDayCount > 0
              ? visitDayStats.reduce((sum, stat) => sum + stat.travelMinutes, 0) / activeVisitDayCount
              : 0;
            const lodgingConstraintCount = (itinerary.days || []).reduce((sum, day) => sum + ((day.plan || []).reduce((daySum, item) => {
              if (!item || item.type === 'backup' || !isFullLodgeStayItem(item)) return daySum;
              return daySum
                + (item.isTimeFixed ? 1 : 0)
                + (item.lodgeCheckoutFixed && item.lodgeCheckoutTime ? 1 : 0);
            }, 0)), 0);
            const averageSpanHours = activeVisitDayCount > 0
              ? visitDayStats.reduce((sum, stat) => sum + stat.spanHours, 0) / activeVisitDayCount
              : 0;
            const intensityScore = [
              visitPerHour >= 0.95 ? 2 : visitPerHour >= 0.7 ? 1 : 0,
              averageSpanHours >= 11 ? 2 : averageSpanHours >= 8.5 ? 1 : 0,
              averageTravelMinutes >= 120 ? 2 : averageTravelMinutes >= 70 ? 1 : 0,
              lodgingConstraintCount >= 3 ? 2 : lodgingConstraintCount >= 1 ? 1 : 0,
            ].reduce((sum, value) => sum + value, 0);
            const travelIntensity = intensityScore >= 5
              ? { label: '매우 빠듯함', note: '이동/체류 여유 적음' }
              : intensityScore >= 3
                ? { label: '빠듯함', note: '조정 여지 확인 필요' }
                : intensityScore >= 1
                  ? { label: '보통', note: '무난한 이동 밀도' }
                  : { label: '널널함', note: '여유 있는 흐름' };
            const averageTravelHoursLabel = averageTravelMinutes >= 60
              ? `${(averageTravelMinutes / 60).toFixed(1)}시간`
              : `${Math.round(averageTravelMinutes)}분`;
            return (
              <div className="mb-8 relative">
                {/* 컴팩트 플로팅 바 (스크롤 시) */}
                {SHOW_HERO_COMPACT_BAR && heroCollapsed && (
                  <div
                    className="fixed top-0 z-[120] pointer-events-none"
                    style={{ left: isMobileLayout ? 0 : leftSidebarWidth, right: isMobileLayout ? 0 : (col2Collapsed ? 44 : 300) }}
                  >
                    <div className="w-full bg-white/98 backdrop-blur-2xl border-b border-slate-200/90 shadow-[0_4px_20px_-10px_rgba(15,23,42,0.15)] pointer-events-auto min-h-[56px] px-6 py-2 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-xl bg-[#3182F6] flex items-center justify-center shrink-0 shadow-sm">
                          <MapPin size={13} className="text-white" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[14px] font-black text-slate-900 truncate tracking-tight">{tripRegion || '여행지'}</span>
                          <span className="text-[10px] font-bold text-slate-400 leading-none">
                            {(tripStartDate && tripEndDate)
                              ? `${tripStartDate.slice(5).replace('-', '.')}~${tripEndDate.slice(5).replace('-', '.')}`
                              : `${tripNights}박 ${tripDays}일`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-[14px] font-black text-[#3182F6] tabular-nums tracking-tight">₩{budgetSummary.remaining.toLocaleString()}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-[#3182F6] rounded-full transition-all duration-700" style={{ width: `${usedPct}%` }} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 tabular-nums">{usedPct}%</span>
                          </div>
                        </div>

                        {canManagePlan && (
                          <div className="flex items-center gap-1.5 border-l border-slate-100 pl-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); setIsEditMode(!isEditMode); }}
                              className={`w-8 h-8 rounded-xl border transition-all flex items-center justify-center shadow-sm ${isEditMode ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-slate-100 text-slate-400'}`}
                              title={isEditMode ? '편집 모드 종료' : '편집 모드 시작 (드래그 활성화)'}
                            >
                              {isEditMode ? <Edit3 size={13} /> : <Lock size={13} />}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setIsAddingPlace(true); }}
                              className="w-8 h-8 rounded-xl border border-blue-200 bg-blue-50 text-[#3182F6] hover:bg-[#3182F6] hover:text-white transition-all flex items-center justify-center shadow-sm"
                              title="내 장소에 일정 추가"
                            >
                              <PlusCircle size={15} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); autoCalculateAllRoutes(); }}
                              disabled={isCalculatingAllRoutes}
                              className="w-8 h-8 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-[#3182F6]/40 hover:text-[#3182F6] hover:bg-white transition-all flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              title="전체 경로 다시 계산"
                            >
                              {isCalculatingAllRoutes ? (
                                <div className="relative flex items-center justify-center">
                                  <div className="absolute inset-0 animate-spin border-t-2 border-[#3182F6] rounded-full scale-125 opacity-20" />
                                  <span className="text-[8px] font-black text-[#3182F6]">{routeCalcProgress}</span>
                                </div>
                              ) : (
                                <Navigation size={14} />
                              )}
                            </button>
                            <button
                              onClick={() => setShowPlanOptions(true)}
                              className="w-8 h-8 rounded-xl border border-slate-100 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-all flex items-center justify-center shadow-sm"
                            >
                              <SlidersHorizontal size={13} />
                            </button>
                            <button
                              onClick={() => setShowShareManager(true)}
                              className="w-8 h-8 rounded-xl border border-blue-100 bg-blue-50 text-[#3182F6] hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                            >
                              <Share2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 풀 카드 (최상단) */}
                {(!SHOW_HERO_COMPACT_BAR || !heroCollapsed) && (
                  <section className="mb-10 -mx-4 -mt-8">
                    <div className="w-full relative overflow-hidden bg-transparent">
                      {canManagePlan && <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setIsEditMode(!isEditMode); }}
                          className={`w-10 h-10 rounded-xl border backdrop-blur transition-all flex items-center justify-center shadow-lg ${isEditMode ? 'bg-amber-400/90 border-amber-300 text-white font-black' : 'bg-white/85 border-white/40 text-slate-700'}`}
                          title={isEditMode ? '편집 모드 종료' : '편집 모드 시작 (드래그 활성화)'}
                        >
                          {isEditMode ? <Edit3 size={18} /> : <Lock size={18} />}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setIsAddingPlace(true); }}
                          className="w-10 h-10 rounded-xl border border-white/40 bg-white/85 backdrop-blur text-slate-700 hover:border-[#3182F6]/50 hover:text-[#3182F6] transition-colors flex items-center justify-center shadow-lg"
                          title="내 장소에 일정 추가"
                        >
                          <PlusCircle size={20} className="text-[#3182F6]" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); autoCalculateAllRoutes(); }}
                          disabled={isCalculatingAllRoutes}
                          className="w-10 h-10 rounded-xl border border-white/40 bg-white/85 backdrop-blur text-slate-700 hover:border-[#3182F6]/50 hover:text-[#3182F6] transition-colors flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="전체 경로 다시 계산"
                        >
                          {isCalculatingAllRoutes ? (
                            <div className="relative flex items-center justify-center">
                              <div className="absolute inset-0 animate-spin border-t-2 border-[#3182F6] rounded-full scale-150 opacity-10" />
                              <span className="text-[10px] font-black text-[#3182F6]">{routeCalcProgress}%</span>
                            </div>
                          ) : (
                            <Navigation size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => setShowPlanOptions(true)}
                          className="w-10 h-10 rounded-xl border border-white/40 bg-white/85 backdrop-blur text-slate-700 hover:border-[#3182F6]/50 hover:text-[#3182F6] transition-colors flex items-center justify-center shadow-lg"
                          title="일정 옵션"
                        >
                          <SlidersHorizontal size={16} />
                        </button>
                        <button
                          onClick={() => setShowShareManager(true)}
                          className="w-10 h-10 rounded-xl border border-white/40 bg-white/85 backdrop-blur text-slate-700 hover:border-[#3182F6]/50 hover:text-[#3182F6] transition-colors flex items-center justify-center shadow-lg"
                          title="공유 설정"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>}
                      {/* 🖼️ 배경 이미지 (고정 높이, 요약 확장과 무관) */}
                      <div className="absolute left-0 right-0 top-0 h-[430px] sm:h-[450px] overflow-hidden pointer-events-none">
                        <img
                          src={getRegionCoverImage(tripRegion)}
                          className="w-full h-full object-cover opacity-95 scale-105"
                          alt="travel background"
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.26) 0%, rgba(15,23,42,0.12) 46%, rgba(242,244,246,0.16) 62%, rgba(242,244,246,0) 76%, rgba(242,244,246,0) 100%)' }}
                        />
                      </div>

                      <div className={`relative z-10 flex flex-col gap-10 w-full mx-auto ${timelineMaxClass}`}>
                        {/* 🌟 1. 타이틀 & 일정 */}
                        <div className="flex flex-col gap-5 px-6 pt-8 sm:px-8 sm:pt-10">
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

                        {/* 🌟 2. 여행 한눈에 보기 */}
                        <div className="flex flex-col gap-8 px-3 sm:px-0">
                          <div className="w-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden flex flex-col pt-8 pb-7 px-8 items-center text-center">
                            <div className="relative w-full grid grid-cols-1 sm:grid-cols-3 bg-white/50 rounded-2xl border border-white/20 overflow-visible min-h-[108px]">
                              <div className="p-4 flex flex-col items-center justify-center gap-1 border-b sm:border-b-0 sm:border-r border-slate-100">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">예산 사용</p>
                                <p className="text-[28px] leading-none font-black text-[#3182F6] tabular-nums">{usedPct}%</p>
                                <p className="text-[11px] font-bold text-slate-500 tabular-nums">총 예상 ₩{MAX_BUDGET.toLocaleString()}</p>
                              </div>
                              <div className="relative p-4 flex flex-col items-center justify-center gap-1 border-b sm:border-b-0 sm:border-r border-slate-100">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">여행 강도</p>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowTravelIntensityInfo((prev) => !prev);
                                    }}
                                    className="w-4 h-4 rounded-full border border-slate-300 text-slate-400 hover:text-[#3182F6] hover:border-[#3182F6]/40 transition-colors flex items-center justify-center"
                                    title="여행 강도 계산식 보기"
                                  >
                                    <Info size={10} />
                                  </button>
                                </div>
                                <p className="text-[24px] leading-none font-black text-slate-700 text-center">{travelIntensity.label}</p>
                                <p className="text-[11px] font-bold text-slate-500 text-center">{travelIntensity.note}</p>
                                {showTravelIntensityInfo && (
                                  <div className="absolute left-1/2 top-7 z-20 w-[250px] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left shadow-[0_16px_30px_-18px_rgba(15,23,42,0.35)]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">계산식</p>
                                    <p className="mt-2 text-[11px] font-bold text-slate-600">시간당 방문 수: {visitPerHour.toFixed(2)}개</p>
                                    <p className="mt-1 text-[11px] font-bold text-slate-600">하루 활동 시간: 평균 {averageSpanHours.toFixed(1)}시간</p>
                                    <p className="mt-1 text-[11px] font-bold text-slate-600">하루 이동 시간: 평균 {averageTravelHoursLabel}</p>
                                    <p className="mt-1 text-[11px] font-bold text-slate-600">숙소 고정 제약: {lodgingConstraintCount}개</p>
                                    <p className="mt-2 text-[10px] font-bold text-slate-400">방문 수는 `숙소/휴식/페리`를 제외한 일정만 세며, 숙소의 고정 체크인/체크아웃도 강도 점수에 반영합니다.</p>
                                  </div>
                                )}
                              </div>
                              <div className="p-4 flex flex-col items-center justify-center gap-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                  방문 밀도
                                </p>
                                <p className="text-[28px] leading-none font-black text-slate-700 text-center tabular-nums">{visitPerHour.toFixed(1)}개/h</p>
                                <p className="text-[11px] font-bold text-slate-500 text-center">방문 일정 {visitPlanCount}개 기준</p>
                              </div>
                            </div>

                            <div className="mt-4 w-full rounded-[24px] border border-slate-200 bg-white/72 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.32)] overflow-hidden">
                              <div className="px-4 pt-3 pb-2 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                                <div className="min-w-0">
                                  <p className="text-[12px] font-black text-slate-800 truncate">Day Route Map</p>
                                  <p className="mt-0.5 text-[9px] font-bold text-slate-400">Day 1 · Day 2 · Day 3 경로 확인</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setShowRoutePreviewModal(true)}
                                  className="shrink-0 px-2.5 py-1 rounded-full border border-slate-200 bg-white text-[9px] font-black text-slate-500 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                                >
                                  크게 보기
                                </button>
                              </div>
                              <div className="p-3">
                                <div className="mb-2 flex flex-wrap gap-1.5">
                                  {routePreviewMap.length > 0 ? routePreviewMap.slice(0, 4).map((day) => (
                                    <div key={`hero-day-${day.day}`} className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-slate-200 px-2 py-0.5 text-[9px] font-black text-slate-600 shadow-sm">
                                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: day.color }} />
                                      <span>Day {day.day}</span>
                                    </div>
                                  )) : (
                                    <div className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-slate-200 px-2 py-0.5 text-[9px] font-black text-slate-400 shadow-sm">
                                      경로 준비 중
                                    </div>
                                  )}
                                </div>
                                <div className="mb-2 flex flex-wrap gap-1.5">
                                  {routePreviewEndpointActions.map((action) => (
                                    <button
                                      key={`hero-toggle-${action.id}`}
                                      type="button"
                                      onClick={() => setHiddenRoutePreviewEndpoints((prev) => ({ ...prev, [action.id]: !prev[action.id] }))}
                                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-black transition-colors ${action.hidden ? 'border-slate-200 bg-white text-slate-400' : 'border-amber-200 bg-amber-50 text-amber-600'}`}
                                    >
                                      {action.hidden ? '복원' : '제거'}
                                      <span>{action.label}</span>
                                    </button>
                                  ))}
                                </div>
                                <div className="relative overflow-hidden rounded-[18px] border border-white/70 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_rgba(219,234,254,0.35)_72%)] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                                  {routePreviewLoading ? (
                                    <div className="flex items-center justify-center h-[220px] text-[11px] font-bold text-slate-400">
                                      지도 좌표 계산 중...
                                    </div>
                                  ) : routePreviewMap.length > 0 ? (
                                    <RoutePreviewCanvas routePreviewMap={routePreviewMap} height={220} />
                                  ) : (
                                    <div className="h-[220px] flex flex-col items-center justify-center gap-1 text-center">
                                      <MapIcon size={18} className="text-slate-300" />
                                      <p className="text-[10px] font-bold text-slate-400">주소가 있는 일정이 2개 이상 있어야 경로를 표시합니다.</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setHeroSummaryExpanded(v => !v)}
                              className="mt-4 w-full sm:w-[380px] justify-center px-4 py-3 rounded-2xl border border-slate-200 bg-white text-[11px] font-black text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors flex items-center gap-1.5"
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
          <div ref={heroTriggerRef} className="h-px w-full" />
          <div className={`w-full mx-auto flex flex-col relative z-0 ${timelineMaxClass} ${isCompactTimeline ? 'gap-4' : 'gap-6'}`}>
            {totalTimelineItems === 0 && (
              <div
                data-droptarget="empty-timeline"
                onDragOver={(e) => {
                  if (draggingFromLibrary) {
                    e.preventDefault();
                    setDropTarget({ dayIdx: 0, insertAfterPIdx: -1 });
                  }
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setDropTarget(null);
                }}
                onDrop={(e) => {
                  if (!draggingFromLibrary) return;
                  e.preventDefault();
                  addInitialItem(0, draggingFromLibrary);
                  if (!isDragCopy) removePlace(draggingFromLibrary.id);
                  setDraggingFromLibrary(null);
                  setDropTarget(null);
                  setIsDragCopy(false);
                }}
                className={`w-full rounded-[24px] border bg-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.2)] p-5 flex flex-col items-center gap-3 transition-all ${draggingFromLibrary ? 'cursor-copy border-[#3182F6]/40' : 'border-slate-200'} ${dropTarget?.dayIdx === 0 && dropTarget?.insertAfterPIdx === -1 ? 'ring-2 ring-[#3182F6] bg-blue-50/40' : ''}`}
              >
                <p className="text-[12px] font-black text-slate-500">아직 등록된 일정이 없습니다.</p>
                <button
                  type="button"
                  onClick={() => addInitialItem(0)}
                  className="px-4 py-2 rounded-xl bg-[#3182F6] text-white text-[12px] font-black hover:bg-blue-600 transition-colors"
                >
                  + 첫 일정 추가
                </button>
                {draggingFromLibrary && (
                  <p className="text-[11px] font-black text-[#3182F6]">내 장소 카드를 여기로 드래그해서 바로 추가할 수 있습니다.</p>
                )}
              </div>
            )}

            <React.Fragment>
              {itinerary.days?.map((d, dIdx) => d.plan?.map((p, pIdx) => {
                const isExpanded = expandedId === p.id;
                const isLodge = isFullLodgeStayItem(p);
                const isLodgeSegmentCard = isStandaloneLodgeSegmentItem(p);
                const isLodgeTagged = Array.isArray(p.types) && p.types.includes('lodge');
                const isShip = p.types?.includes('ship');
                const isTimelineDragActive = Boolean(draggingFromLibrary || draggingFromTimeline);
                const planBCount = p.alternatives?.length || 0;
                const hasPlanB = planBCount > 0;
                const planPos = viewingPlanIdx[p.id] ?? 0;
                const isPlanBActive = planPos > 0;

                let stateStyles;
                if (isLodge) stateStyles = 'bg-[linear-gradient(180deg,rgba(244,245,255,0.98),rgba(255,255,255,0.98))] border-indigo-200 shadow-[0_12px_28px_-12px_rgba(99,102,241,0.18)]';
                else if (isLodgeTagged) stateStyles = 'bg-[linear-gradient(180deg,rgba(249,245,255,0.98),rgba(255,255,255,0.98))] border-violet-200 shadow-[0_12px_28px_-14px_rgba(139,92,246,0.16)]';
                else if (isShip) stateStyles = 'bg-[#f4fafe] border-blue-200 shadow-[0_8px_24px_-8px_rgba(29,78,216,0.12)]';
                else if (hasPlanB) stateStyles = 'bg-white border-amber-300 shadow-[0_10px_30px_-8px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/20';
                else if (p.isTimeFixed) stateStyles = 'bg-white border-[#3182F6]/40 shadow-[0_10px_30px_-8px_rgba(49,130,246,0.12)] ring-1 ring-[#3182F6]/15';
                else stateStyles = 'bg-white border-slate-200 shadow-[0_8px_24px_-10px_rgba(15,23,42,0.10)] hover:shadow-[0_12px_28px_-10px_rgba(15,23,42,0.14)] hover:border-slate-300';

                const chips = p.types ? p.types.map(t => getCategoryBadge(t)) : (p.type ? [getCategoryBadge(p.type)] : []);
                const businessWarning = !isShip ? getBusinessWarning(p, dIdx) : '';
                // 스마트 락(숙소 자동 계산) 여부 확인
                const isAutoLocked = p.isAutoDuration;
                const isDurationLocked = !!p.isDurationFixed || isAutoLocked;
                const isDurationControlBlocked = isAutoLocked;
                const isEndTimeFixed = !!p.isEndTimeFixed;
                // Plan B 캐러셀 — 즉시 교체
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
                      <div className="flex w-full items-center justify-center my-3">
                        {isTimelineDragActive ? (
                          <div
                            className="z-10 w-full my-0.5 cursor-copy"
                            data-droptarget={`day-start-${dIdx}`}
                            onDragOver={(e) => { e.preventDefault(); setDropTarget({ dayIdx: dIdx, insertAfterPIdx: -1 }); }}
                            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropTarget(null); }}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (draggingFromLibrary) {
                                addNewItem(dIdx, -1, draggingFromLibrary.types, draggingFromLibrary);
                                if (!isDragCopy) removePlace(draggingFromLibrary.id);
                              } else if (draggingFromTimeline?.altIdx !== undefined) {
                                insertAlternativeToTimeline(dIdx, -1, draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, draggingFromTimeline.altIdx);
                              } else if (draggingFromTimeline && draggingFromTimeline.altIdx === undefined) {
                                moveTimelineItem(dIdx, -1, draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, isDragCopy, draggingFromTimeline.planPos);
                              }
                              setDraggingFromLibrary(null); setDraggingFromTimeline(null); setDropTarget(null); setIsDragCopy(false);
                            }}
                          >
                            {renderTimelineInsertGuide(dropTarget?.dayIdx === dIdx && dropTarget?.insertAfterPIdx === -1, dropTarget?.dayIdx === dIdx && dropTarget?.insertAfterPIdx === -1 && draggingFromLibrary ? getDropWarning(draggingFromLibrary, dIdx, -1) : '')}
                          </div>
                        ) : (
                          <div className="flex w-full items-center justify-center rounded-[18px] border border-slate-200 bg-white px-4 py-2.5 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.24)] gap-2">
                            {(() => {
                              const rid = `${dIdx}_${pIdx}`;
                              const busy = calculatingRouteId === rid;
                              let prevRouteItem;
                              if (pIdx === 0 && dIdx > 0) {
                                const prevDayPlan = itinerary.days[dIdx - 1]?.plan || [];
                                prevRouteItem = prevDayPlan[prevDayPlan.length - 1];
                              } else {
                                prevRouteItem = d.plan?.[pIdx - 1];
                              }
                              return (
                                <>
                                  {/* 이동 시간 */}
                                  <div className="flex flex-col items-center">
                                    <span
                                      className={`min-w-[3rem] text-center tracking-tight text-xs font-black transition-colors ${busy ? 'text-[#3182F6]' : (p._isBufferCoordinated ? 'text-orange-500' : (p.travelTimeAuto && p.travelTimeOverride !== p.travelTimeAuto ? 'text-[#3182F6] cursor-pointer' : 'text-slate-800'))}`}
                                      onClick={(e) => { e.stopPropagation(); if (p.travelTimeAuto && p.travelTimeOverride !== p.travelTimeAuto) resetTravelTime(dIdx, pIdx); }}
                                      title={p.travelTimeAuto && p.travelTimeOverride !== p.travelTimeAuto ? '클릭하여 경로 계산 시간으로 초기화' : undefined}
                                    >{p.travelTimeOverride || '15분'}</span>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx, TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Plus size={10} /></button>

                                  {/* 거리 */}
                                  <button
                                    type="button"
                                    className={`flex items-center gap-1 text-xs font-bold transition-colors ${busy ? 'text-[#3182F6]' : 'text-slate-400 hover:text-[#3182F6]'}`}
                                    title={busy ? '경로 계산 중' : '클릭하여 네이버 길찾기 열기'}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (busy) return;
                                      const fromAddr = getRouteAddress(prevRouteItem, 'from');
                                      const toAddr = getRouteAddress(p, 'to');
                                      if (!fromAddr || !toAddr) {
                                        setLastAction("길찾기용 출발/도착 주소가 필요합니다.");
                                        return;
                                      }
                                      openNaverRouteSearch(prevRouteItem?.activity || '출발지', fromAddr, p.activity || '도착지', toAddr);
                                    }}
                                  >
                                    {busy ? <LoaderCircle size={11} className="animate-spin" /> : <MapIcon size={11} />}
                                    <span>{busy ? '계산중' : getRouteDistanceStatus(prevRouteItem, p)}</span>
                                  </button>

                                  {/* 자동경로 */}
                                  <button onClick={(e) => { e.stopPropagation(); autoCalculateRouteFor(dIdx, pIdx, { forceRefresh: true }); }} disabled={!!calculatingRouteId} title={busy ? '계산 중' : '자동경로 계산'} className={`flex items-center justify-center w-6 h-6 transition-colors border rounded-lg text-[10px] font-black ${busy ? 'bg-[#3182F6]/10 text-[#3182F6] border-[#3182F6]/30' : 'bg-white hover:bg-[#3182F6] hover:text-white text-slate-400 border-slate-200 hover:border-[#3182F6]'}`}>
                                    {busy ? <LoaderCircle size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                  </button>

                                  {/* 구분선 */}
                                  <div className="w-px h-4 bg-slate-200 mx-0.5" />

                                  {/* 여유 시간 */}
                                  <div className="flex items-center gap-1.5">
                                    <button onClick={(e) => { e.stopPropagation(); updateBufferTime(dIdx, pIdx, -BUFFER_STEP); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Minus size={10} /></button>
                                    <span className="min-w-[3rem] text-center tracking-tight text-xs font-black text-slate-500">{p.bufferTimeOverride || '10분'}</span>
                                    <button onClick={(e) => { e.stopPropagation(); updateBufferTime(dIdx, pIdx, BUFFER_STEP); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Plus size={10} /></button>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      data-dropitem={`${dIdx}-${pIdx}`}
                      draggable={isEditMode}
                      onTouchStart={(e) => {
                        if (!isEditMode) return;
                        const targetEl = e.target instanceof Element ? e.target : null;
                        if (targetEl?.closest('input,button,a,textarea,[contenteditable],[data-no-drag]')) return;
                        // 카드 드래그는 항상 현재 화면에 보이는(메인) 일정을 이동
                        const payload = { dayIdx: dIdx, pIdx, planPos: hasPlanB ? planPos : undefined };
                        touchDragSourceRef.current = { kind: 'timeline', payload, startX: e.touches[0].clientX, startY: e.touches[0].clientY };
                        isDraggingActiveRef.current = false;
                      }}
                      onDragStart={(e) => {
                        const copy = ctrlHeldRef.current;
                        const targetEl = e.target instanceof Element ? e.target : null;
                        const isInteractiveTarget = !!targetEl?.closest('input, button, a, textarea, [contenteditable="true"], [data-no-drag="true"]');
                        if (isInteractiveTarget) { e.preventDefault(); return; }
                        // 카드 드래그는 항상 현재 화면에 보이는(메인) 일정을 이동
                        const payload = { dayIdx: dIdx, pIdx, planPos: hasPlanB ? planPos : undefined };
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
                      className={`relative z-10 w-full flex flex-col transition-all group ${draggingFromTimeline?.dayIdx === dIdx && draggingFromTimeline?.pIdx === pIdx ? 'opacity-50 pointer-events-none scale-[0.99]' : ''} ${isTimelineDragActive ? 'scale-[0.99]' : ''} ${dropOnItem?.dayIdx === dIdx && dropOnItem?.pIdx === pIdx ? 'ring-2 ring-[#3182F6] ring-offset-2 ring-offset-[#F2F4F6]' : ''}`}
                      onClick={() => toggleReceipt(p.id)}
                    >


                      {/* 🟢 카드 본체 (내부 라운드 셀) */}
                      <div className={`relative w-full flex flex-col border overflow-hidden rounded-[24px] transition-all duration-300 ${stateStyles}`}>
                        {/* Plan B 페이지 인디케이터 */}
                        {hasPlanB && (
                          <div className="absolute top-2 right-2 z-20 pointer-events-none">
                            <button
                              type="button"
                              data-plan-picker-trigger="true"
                              className="pointer-events-auto text-[11px] font-black px-2 py-1 rounded-lg border min-w-[44px] text-center text-slate-500 bg-white/95 border-slate-200 shadow-[0_8px_16px_-10px_rgba(15,23,42,0.35)] hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                // 이미 이 항목의 팝업이 열려 있으면 닫기
                                if (planVariantPicker?.dayIdx === dIdx && planVariantPicker?.pIdx === pIdx) {
                                  setPlanVariantPicker(null);
                                  return;
                                }
                                const panelW = 250;
                                const panelH = 200;
                                const left = Math.max(12, Math.min(window.innerWidth - panelW - 12, rect.right - panelW));
                                const top = Math.max(8, Math.min(window.innerHeight - panelH - 8, rect.bottom + 8));
                                setPlanVariantPicker({ dayIdx: dIdx, pIdx, left, top });
                              }}
                              title="플랜 목록 보기"
                            >
                              {planPos + 1}/{totalPlans}
                            </button>
                          </div>
                        )}
                        {/* planVariantPicker 팝업은 overflow-hidden 카드 밖 루트 레벨에서 렌더링 */}
                        <div className="flex items-stretch border-b border-slate-100 border-dashed">

                          {!isShip && !isLodge && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setTimeControllerTarget(prev => (
                                  prev?.dayIdx === dIdx && prev?.pIdx === pIdx
                                    ? null
                                    : { dayIdx: dIdx, pIdx }
                                ));
                              }}
                              className={`relative flex flex-col items-center justify-center shrink-0 border-r border-slate-100 flex-none overflow-hidden transition-all duration-500 cursor-pointer group/tower ${timeControllerTarget?.dayIdx === dIdx && timeControllerTarget?.pIdx === pIdx
                                ? 'w-[170px] sm:w-[180px] bg-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.02)]'
                                : (isCompactTimeline ? 'w-[30%] py-2' : 'w-[30%] py-4 px-2 sm:px-3')
                                } ${p.isTimeFixed ? 'bg-blue-50/20' : 'bg-transparent'}`}
                            >
                              {/* 락 상태일 때 컨트롤 타워 전체에 은은하게 깔리는 거대 자물쇠 */}
                              {p.isTimeFixed && (
                                <Lock size={90} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 opacity-[0.035] pointer-events-none" />
                              )}

                              {/* 시간 조절 */}
                              <div
                                data-time-trigger="true"
                                className={`relative w-full px-1 py-1 rounded-2xl select-none z-10 transition-all ${timeControllerTarget?.dayIdx === dIdx && timeControllerTarget?.pIdx === pIdx ? 'scale-100' : 'group-hover/tower:bg-slate-100/30'}`}
                              >
                                <div className="relative flex flex-col items-center justify-center gap-3 z-10">
                                  {(() => {
                                    const [hourStr = '00', minuteStr = '00'] = (p.time || '00:00').split(':');
                                    const hour = parseInt(hourStr, 10);
                                    const minute = parseInt(minuteStr, 10);

                                    const btnTone = p.isTimeFixed
                                      ? 'text-blue-400 hover:text-blue-600 hover:bg-blue-100/60'
                                      : 'text-slate-400 hover:text-blue-500 hover:bg-blue-100/50';

                                    const isExpanded = timeControllerTarget?.dayIdx === dIdx && timeControllerTarget?.pIdx === pIdx;

                                    if (!isExpanded) {
                                      const [hh, mm] = (p.time || '00:00').split(':');
                                      const endMins = timeToMinutes(p.time || '00:00') + (p.duration || 0);
                                      const [ehh, emm] = minutesToTime(endMins).split(':');
                                      return (
                                        <div className="flex w-full flex-col items-center justify-center gap-3 px-3 py-2 select-none">
                                          <div className={`relative flex w-full min-h-[78px] items-center justify-center rounded-[18px] border px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] transition-all ${p.isTimeFixed ? 'border-blue-100 bg-blue-50/60' : 'border-slate-200 bg-white/88 group-hover/tower:border-blue-100 group-hover/tower:bg-slate-50/95'}`}>
                                            {p.isTimeFixed && (
                                              <div className="absolute left-3 top-2.5 flex items-center gap-0.5">
                                                <Lock size={8} className="text-[#3182F6]" />
                                                <span className="text-[8px] font-bold text-[#3182F6] uppercase tracking-[0.14em]">FIXED</span>
                                              </div>
                                            )}
                                            <span className={`text-[28px] font-black tabular-nums tracking-[-0.08em] leading-none transition-colors ${p.isTimeFixed ? 'text-[#1f5fd6]' : 'text-slate-900 group-hover/tower:text-[#244f9e]'}`}>
                                              {hh}<span className="mx-[-1px] opacity-80">:</span>{mm}
                                            </span>
                                          </div>

                                          <div className="relative flex w-full items-center justify-center">
                                            <button
                                              type="button"
                                              className={`relative z-10 flex min-h-[54px] min-w-[112px] items-center justify-center gap-3 rounded-[12px] border px-4 py-2 shadow-[0_10px_24px_-14px_rgba(15,23,42,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98] ${isAutoLocked
                                                ? 'bg-red-500 text-white'
                                                : isDurationLocked
                                                  ? 'bg-[#ff8a1a] text-white'
                                                  : 'border border-slate-200 bg-white text-[#244f9e] hover:border-slate-300'
                                                }`}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (isAutoLocked) {
                                                  setLastAction('자동 연동 일정은 소요시간을 조절할 수 없습니다.');
                                                  return;
                                                }
                                                setTimeControllerTarget({ dayIdx: dIdx, pIdx });
                                              }}
                                            >
                                              <ChevronLeft size={12} />
                                              <span className="text-[11px] font-black tabular-nums tracking-[0.18em]">{fmtDur(p.duration).replace('분', ' MIN')}</span>
                                              <ChevronRight size={12} />
                                            </button>
                                          </div>

                                          <div className="flex w-full min-h-[78px] items-center justify-center rounded-[18px] border border-slate-200 bg-slate-50/92 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] transition-all group-hover/tower:border-slate-300 group-hover/tower:bg-slate-100/95">
                                            <span className="text-[28px] font-black tabular-nums tracking-[-0.08em] leading-none text-slate-400">
                                              {ehh}<span className="mx-[-1px] opacity-75">:</span>{emm}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    }

                                    const mStep = timeControlStep;
                                    const endMins = timeToMinutes(p.time || '00:00') + (p.duration || 0);
                                    const endLabel = minutesToTime(endMins);
                                    const [endHour = '00', endMinute = '00'] = endLabel.split(':');
                                    return (
                                      <div className="flex flex-col gap-3 w-full animate-in fade-in zoom-in-95 duration-300">
                                        {/* ── 최신 UI 타임 컨트롤러 ── */}
                                        {/* 시작 & 종료 셀 */}
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                          {/* 시작 시각 셀 */}
                                          <div
                                            onClick={(e) => { e.stopPropagation(); toggleTimeFix(dIdx, pIdx); }}
                                            className={`cursor-pointer group relative flex flex-col items-center p-2 rounded-[20px] transition-all border-2 ${p.isTimeFixed ? 'bg-blue-50 border-[#3182F6]' : 'bg-white border-blue-50/50 hover:border-blue-100'}`}
                                          >
                                            <span className={`text-[9px] font-black ${p.isTimeFixed ? 'text-[#3182F6]' : 'text-slate-300'} mb-1`}>START</span>
                                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                              <div className="flex flex-col items-center">
                                                <button onClick={(e) => { e.stopPropagation(); updateStartHour(dIdx, pIdx, 1); }} className="text-slate-200 hover:text-blue-400"><ChevronUp size={14} /></button>
                                                <span className={`text-[22px] font-black tabular-nums leading-none ${p.isTimeFixed ? 'text-[#3182F6]' : 'text-slate-800'}`}>{hourStr}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updateStartHour(dIdx, pIdx, -1); }} className="text-slate-200 hover:text-blue-400"><ChevronDown size={14} /></button>
                                              </div>
                                              <span className="text-slate-200 font-bold -mt-0.5">:</span>
                                              <div className="flex flex-col items-center">
                                                <button onClick={(e) => { e.stopPropagation(); updateStartMinute(dIdx, pIdx, mStep); }} className="text-slate-200 hover:text-blue-400"><ChevronUp size={14} /></button>
                                                <span className={`text-[22px] font-black tabular-nums leading-none ${p.isTimeFixed ? 'text-[#3182F6]' : 'text-slate-800'}`}>{minuteStr}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updateStartMinute(dIdx, pIdx, -mStep); }} className="text-slate-200 hover:text-blue-400"><ChevronDown size={14} /></button>
                                              </div>
                                            </div>
                                            {p.isTimeFixed && <div className="absolute top-1 right-2"><Lock size={8} className="text-[#3182F6]" /></div>}
                                          </div>

                                          {/* 종료 시각 셀 */}
                                          <div
                                            onClick={(e) => { e.stopPropagation(); if (isAutoLocked) return; toggleEndTimeFix(dIdx, pIdx); }}
                                            className={`cursor-pointer group relative flex flex-col items-center p-2 rounded-[20px] transition-all border-2 ${isEndTimeFixed ? 'bg-amber-50 border-amber-400' : 'bg-white border-amber-50/50 hover:border-amber-100'}`}
                                          >
                                            <span className={`text-[9px] font-black ${isEndTimeFixed ? 'text-amber-500' : 'text-slate-300'} mb-1`}>END</span>
                                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                              <div className="flex flex-col items-center">
                                                <button onClick={(e) => { e.stopPropagation(); updatePlanEndTime(dIdx, pIdx, 60); }} className="text-amber-100 hover:text-amber-400"><ChevronUp size={14} /></button>
                                                <span className={`text-[22px] font-black tabular-nums leading-none ${isEndTimeFixed ? 'text-amber-600' : 'text-slate-800'}`}>{endHour}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updatePlanEndTime(dIdx, pIdx, -60); }} className="text-amber-100 hover:text-amber-400"><ChevronDown size={14} /></button>
                                              </div>
                                              <span className="text-amber-100 font-bold -mt-0.5">:</span>
                                              <div className="flex flex-col items-center">
                                                <button onClick={(e) => { e.stopPropagation(); updatePlanEndTime(dIdx, pIdx, mStep); }} className="text-amber-100 hover:text-amber-400"><ChevronUp size={14} /></button>
                                                <span className={`text-[22px] font-black tabular-nums leading-none ${isEndTimeFixed ? 'text-amber-600' : 'text-slate-800'}`}>{endMinute}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updatePlanEndTime(dIdx, pIdx, -mStep); }} className="text-amber-100 hover:text-amber-400"><ChevronDown size={14} /></button>
                                              </div>
                                            </div>
                                            {isEndTimeFixed && <div className="absolute top-1 right-2"><Lock size={8} className="text-amber-500" /></div>}
                                          </div>
                                        </div>

                                        {/* DURATION 벨트 */}
                                        <div className="flex flex-col gap-2 p-3 bg-slate-50/80 rounded-[20px] border border-slate-100">
                                          <div className="flex items-center justify-between px-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DURATION</span>
                                            <div
                                              className={`flex items-center gap-3 cursor-pointer select-none ${isDurationLocked ? 'text-blue-500' : 'text-slate-700'}`}
                                              onClick={(e) => { e.stopPropagation(); toggleDurationFix(dIdx, pIdx); }}
                                            >
                                              <button onClick={(e) => { e.stopPropagation(); updateDuration(dIdx, pIdx, -TIME_UNIT); }} className="text-slate-300 hover:text-slate-600 active:scale-90"><Minus size={14} strokeWidth={3} /></button>
                                              <span className="text-[20px] font-black tabular-nums">{fmtDur(p.duration)}</span>
                                              <button onClick={(e) => { e.stopPropagation(); updateDuration(dIdx, pIdx, TIME_UNIT); }} className="text-slate-300 hover:text-slate-600 active:scale-90"><Plus size={14} strokeWidth={3} /></button>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-4 gap-1.5 mt-1">
                                            {[15, 30, 60, 120].map((val) => (
                                              <button
                                                key={val}
                                                onClick={(e) => { e.stopPropagation(); updateDuration(dIdx, pIdx, val); }}
                                                className="py-1.5 rounded-xl bg-white border border-slate-200/60 text-[10px] font-black text-slate-500 hover:border-[#3182F6] hover:bg-blue-50 hover:text-[#3182F6] transition-all shadow-sm"
                                              >
                                                +{val >= 60 ? `${val / 60}h` : `${val}m`}
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {/* 하단 락버튼 & 스텝 */}
                                        <div className="flex items-center gap-2 mt-1">
                                          <button
                                            onClick={(e) => { e.stopPropagation(); toggleTimeFix(dIdx, pIdx); }}
                                            className={`h-11 flex-1 flex flex-col items-center justify-center rounded-[20px] text-[11px] font-black transition-all border-2 ${p.isTimeFixed ? 'bg-[#3182F6] text-white border-[#3182F6]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                                          >
                                            <div className="flex items-center gap-1.5 leading-tight">
                                              <Lock size={12} fill={p.isTimeFixed ? "currentColor" : "none"} />
                                              <span>{p.isTimeFixed ? '고정 해제' : '고정'}</span>
                                            </div>
                                          </button>
                                          <div className="h-11 flex items-center gap-1 bg-slate-50 border border-slate-100 p-1.5 rounded-[20px]">
                                            {[1, 5, 10].map(s => (
                                              <button
                                                key={s}
                                                onClick={(e) => { e.stopPropagation(); setTimeControlStep(s); }}
                                                className={`w-8 h-8 rounded-xl text-[11px] font-extrabold transition-all ${mStep === s ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-300 hover:text-slate-500'}`}
                                              >
                                                {s}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>

                            </div>
                          )}

                          {/* 🟢 우측 정보 영역 */}
                          <div className={`${(isShip || isLodge) ? 'flex-1' : 'w-[70%] flex-none'} min-w-0 flex flex-col justify-start transition-all duration-500 overflow-hidden ${isTimelineDragActive ? 'gap-1.5 p-2.5 sm:p-3' : isCompactTimeline ? 'gap-2 p-2.5 sm:p-3' : 'gap-2 p-3 sm:p-4'}`}>
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
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); openPlanEditModal(dIdx, pIdx); }}
                                    className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                                    title="일정 수정"
                                  >
                                    <Pencil size={9} />
                                  </button>
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
                                  <div className="relative flex-1 self-stretch">
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-white/30" />
                                    <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-blue-700/80 px-1.5 py-0.5 text-[9px] text-white/70 font-bold">
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
                                {/* 시간 정보 행 — 클릭 후 직접 입력 */}
                                {(() => {
                                  const shipTimeline = getShipTimeline(p);
                                  const sailDur = shipTimeline.sailDuration;
                                  const disTime = shipTimeline.disembarkLabel;
                                  const editKey = (field) => ferryEditField?.pId === p.id && ferryEditField?.field === field;
                                  const timeInput = (field, displayVal) => editKey(field)
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
                                      title="클릭: 직접 입력"
                                      onClick={(e) => { e.stopPropagation(); setFerryEditField({ pId: p.id, field }); }}
                                    >{displayVal}</span>;
                                  const sailInput = editKey('sail')
                                    ? <input
                                      autoFocus
                                      defaultValue={minutesToTime(sailDur)}
                                      onFocus={(e) => e.target.select()}
                                      className="w-14 text-center text-[13px] font-black text-blue-800 bg-white border-b-2 border-[#3182F6] outline-none tabular-nums rounded"
                                      onBlur={(e) => commitFerryTime(dIdx, pIdx, 'sail', e.target.value)}
                                      onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setFerryEditField(null); }}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="시:분/분"
                                    />
                                    : <span
                                      className="text-[13px] font-black text-blue-800 tabular-nums cursor-pointer"
                                      title="클릭: 시:분 또는 분 입력"
                                      onClick={(e) => { e.stopPropagation(); setFerryEditField({ pId: p.id, field: 'sail' }); }}
                                    >{minutesToTime(sailDur)}</span>;
                                  return (
                                    <div className="flex gap-2 select-none">
                                      {/* 선적 셀 */}
                                      <div className="flex-1 flex flex-col items-center gap-1 bg-blue-50/80 border border-blue-100 rounded-xl px-2 py-2.5">
                                        <span className="text-[8px] text-blue-400 font-black tracking-widest uppercase">선적</span>
                                        <div className="flex items-center gap-1 text-[13px] font-black text-blue-800 tabular-nums">
                                          {timeInput('load', shipTimeline.loadStartLabel)}
                                          <span className="text-blue-400">-</span>
                                          {timeInput('loadEnd', shipTimeline.loadEndLabel)}
                                        </div>
                                      </div>
                                      {/* 출항 셀 */}
                                      <div className="flex-1 flex flex-col items-center gap-1 bg-sky-50/80 border border-sky-100 rounded-xl px-2 py-2.5">
                                        <span className="text-[8px] text-sky-400 font-black tracking-widest uppercase">출항</span>
                                        {timeInput('depart', shipTimeline.boardLabel)}
                                      </div>
                                      {/* 소요 셀 */}
                                      <div className="flex-1 flex flex-col items-center gap-1 bg-indigo-50/80 border border-indigo-100 rounded-xl px-2 py-2.5">
                                        <span className="text-[8px] text-indigo-400 font-black tracking-widest uppercase">소요</span>
                                        {sailInput}
                                      </div>
                                      {/* 하선 셀 */}
                                      <div className="flex-1 flex flex-col items-center gap-1 bg-violet-50/80 border border-violet-100 rounded-xl px-2 py-2.5">
                                        <span className="text-[8px] text-violet-500 font-black tracking-widest uppercase">하선</span>
                                        {timeInput('disembark', disTime)}
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
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); openPlanEditModal(dIdx, pIdx); }}
                                    className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                                    title="일정 수정"
                                  >
                                    <Pencil size={9} />
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); openNaverPlaceSearch(getPlaceSearchName(p), p.receipt?.address || p.address || ''); }}
                                  className="flex items-center gap-2 text-slate-500 bg-white w-fit max-w-full px-2 py-1 rounded-lg border border-slate-200 shadow-sm hover:border-[#3182F6]/50 hover:bg-blue-50/40 transition-colors text-left"
                                  title="네이버 지도에서 장소 검색"
                                >
                                  <MapPin size={12} className="text-[#3182F6] shrink-0" />
                                  <span className="text-[11px] font-bold truncate">{p.receipt?.address || '주소 정보 없음'}</span>
                                </button>
                                <div className="flex gap-2">
                                  {/* 체크인 셀 */}
                                  {(() => {
                                    const lodgeCheckoutKey = `${dIdx}-${pIdx}-lodge-out`;
                                    const lodgeCheckinKey = `${dIdx}-${pIdx}-lodge-in`;
                                    const checkoutTarget = timeControllerTarget?.key === lodgeCheckoutKey;
                                    const checkinTarget = timeControllerTarget?.key === lodgeCheckinKey;
                                    const lodgeStep = timeControlStep;
                                    const nextDay = itinerary.days[dIdx + 1];
                                    const nextItem = nextDay?.plan?.find(candidate => candidate?.type !== 'backup');
                                    const rawCheckoutMins = p.lodgeCheckoutTime
                                      ? timeToMinutes(p.lodgeCheckoutTime)
                                      : nextItem
                                        ? timeToMinutes(nextItem.time) - parseMinsLabel(nextItem.travelTimeOverride, DEFAULT_TRAVEL_MINS) - parseMinsLabel(nextItem.bufferTimeOverride, DEFAULT_BUFFER_MINS)
                                        : timeToMinutes(p.time || '00:00') + (p.duration || 0);
                                    const checkoutLabel = minutesToTime(rawCheckoutMins);
                                    const stayDurationMins = (() => {
                                      const checkinMins = timeToMinutes(p.time || '15:00');
                                      const checkoutMins = timeToMinutes(checkoutLabel);
                                      const overnightCheckout = checkoutMins <= checkinMins ? checkoutMins + 1440 : checkoutMins;
                                      return Math.max(0, overnightCheckout - checkinMins);
                                    })();
                                    const [checkinHour = '00', checkinMinute = '00'] = String(p.time || '00:00').split(':');
                                    const [checkoutHour = '00', checkoutMinute = '00'] = String(checkoutLabel).split(':');
                                    const lodgeButtonTone = p.isTimeFixed ? 'bg-[#3182F6] text-white ring-2 ring-[#3182F6]/30 ring-offset-1' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50';
                                    const lodgeCheckoutButtonTone = p.lodgeCheckoutFixed ? 'bg-violet-500 text-white ring-2 ring-violet-400/30 ring-offset-1' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50';

                                    return (
                                      <>
                                        {(checkinTarget || checkoutTarget) && (
                                          <div className="w-full grid grid-cols-2 gap-2 mb-2">
                                            <button onClick={(e) => { e.stopPropagation(); toggleTimeFix(dIdx, pIdx); }} className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${lodgeButtonTone}`}>
                                              {p.isTimeFixed ? <Lock size={10} /> : <Unlock size={10} />} 체크인 {p.isTimeFixed ? '고정' : '해제'}
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); if (!nextItem) return; toggleLodgeCheckoutFix(dIdx, pIdx); }} disabled={!nextItem} className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-black transition-all disabled:opacity-40 ${lodgeCheckoutButtonTone}`}>
                                              {p.lodgeCheckoutFixed ? <Lock size={10} /> : <Unlock size={10} />} 체크아웃 {p.lodgeCheckoutFixed ? '고정' : '해제'}
                                            </button>
                                          </div>
                                        )}
                                        <div
                                          data-time-trigger="true"
                                          className={`relative overflow-hidden flex-1 rounded-xl border p-3 flex flex-col items-center justify-center gap-2 min-h-[96px] cursor-pointer transition-colors ${checkinTarget ? 'bg-indigo-100/80 border-indigo-300' : 'bg-indigo-50/70 border-indigo-100'}`}
                                          onClick={() => setTimeControllerTarget(prev => prev?.key === lodgeCheckinKey ? null : { key: lodgeCheckinKey })}
                                        >
                                          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[56px] font-black tracking-[0.08em] text-indigo-200/55 select-none">IN</span>
                                          <div className="flex flex-col items-center gap-1 relative z-10">
                                            <span className="text-[8px] font-black tracking-[0.18em] text-indigo-400">CHECK-IN</span>
                                            {!checkinTarget && (
                                              <span className={`text-[22px] font-black tabular-nums tracking-tight ${p.isTimeFixed ? 'text-[#3182F6]' : 'text-indigo-900'}`}>{checkinHour}:{checkinMinute}</span>
                                            )}
                                          </div>
                                          {checkinTarget && (
                                            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 w-full relative z-10">
                                              <div className="flex flex-col items-center">
                                                <button onClick={(e) => { e.stopPropagation(); updateStartHour(dIdx, pIdx, 1); }} className="w-7 h-5 flex items-center justify-center rounded-md text-indigo-300 hover:text-indigo-600 hover:bg-white/80 transition-colors"><ChevronUp size={12} /></button>
                                                <span className="text-[22px] font-black tracking-tight tabular-nums text-indigo-900 leading-none">{checkinHour}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updateStartHour(dIdx, pIdx, -1); }} className="w-7 h-5 flex items-center justify-center rounded-md text-indigo-300 hover:text-indigo-600 hover:bg-white/80 transition-colors"><ChevronDown size={12} /></button>
                                              </div>
                                              <div className="flex flex-col items-center">
                                                <button onClick={(e) => { e.stopPropagation(); updateStartMinute(dIdx, pIdx, lodgeStep); }} className="w-7 h-5 flex items-center justify-center rounded-md text-indigo-300 hover:text-indigo-600 hover:bg-white/80 transition-colors"><ChevronUp size={12} /></button>
                                                <span className="text-[22px] font-black tracking-tight tabular-nums text-indigo-900 leading-none">{checkinMinute}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updateStartMinute(dIdx, pIdx, -lodgeStep); }} className="w-7 h-5 flex items-center justify-center rounded-md text-indigo-300 hover:text-indigo-600 hover:bg-white/80 transition-colors"><ChevronDown size={12} /></button>
                                              </div>
                                              <div className="col-span-2 grid grid-cols-4 gap-1">
                                                {renderTimeStepButtons({
                                                  selectedStep: lodgeStep,
                                                  onSelect: setTimeControlStep,
                                                  activeTone: 'indigo',
                                                  compact: true,
                                                })}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        {/* 체크아웃 셀 */}
                                        <div
                                          data-time-trigger="true"
                                          className={`relative overflow-hidden flex-1 rounded-xl border p-3 flex flex-col items-center justify-center gap-2 min-h-[96px] cursor-pointer transition-colors ${checkoutTarget ? 'bg-violet-100/80 border-violet-300' : 'bg-violet-50/70 border-violet-100'}`}
                                          onClick={() => setTimeControllerTarget(prev => prev?.key === lodgeCheckoutKey ? null : { key: lodgeCheckoutKey })}
                                        >
                                          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[52px] font-black tracking-[0.06em] text-violet-200/55 select-none">OUT</span>
                                          <div className="flex flex-col items-center gap-1 relative z-10">
                                            <span className="text-[8px] font-black tracking-[0.18em] text-violet-500">CHECK-OUT</span>
                                            {!checkoutTarget && (
                                              <span className={`text-[22px] font-black tabular-nums tracking-tight ${p.lodgeCheckoutFixed ? 'text-violet-600' : 'text-violet-900'}`}>{checkoutHour}:{checkoutMinute}</span>
                                            )}
                                          </div>
                                          {checkoutTarget && (
                                            <div className="w-full relative z-10 flex flex-col items-center gap-2">
                                              <TimeInput
                                                value={lodgeCheckoutDraft?.key === lodgeCheckoutKey ? lodgeCheckoutDraft.value : checkoutLabel}
                                                onChange={(value) => setLodgeCheckoutDraft({ key: lodgeCheckoutKey, value })}
                                                onFocus={() => setLodgeCheckoutDraft({ key: lodgeCheckoutKey, value: checkoutLabel })}
                                                onBlurExtra={() => {
                                                  const draftValue = lodgeCheckoutDraft?.key === lodgeCheckoutKey ? lodgeCheckoutDraft.value : checkoutLabel;
                                                  if (nextItem && /^\d{2}:\d{2}$/.test(draftValue || '')) {
                                                    setLodgeCheckoutTimeValue(dIdx, pIdx, draftValue);
                                                  }
                                                  setLodgeCheckoutDraft(null);
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.key === 'Enter') e.currentTarget.blur();
                                                  if (e.key === 'Escape') {
                                                    setLodgeCheckoutDraft(null);
                                                    e.currentTarget.blur();
                                                  }
                                                }}
                                                title="체크아웃 시간 직접 입력"
                                                placeholder="01:00"
                                                className="w-[112px] rounded-xl border border-violet-200 bg-white/90 px-3 py-2 text-center text-[24px] font-black tracking-tight tabular-nums text-violet-700 outline-none focus:border-violet-400"
                                              />
                                              <div className="text-[10px] font-bold text-violet-400">종료시간을 다시 입력하면 시작 기준으로 자동 재계산됩니다.</div>
                                            </div>
                                          )}
                                        </div>
                                        {(checkinTarget || checkoutTarget) && (
                                          <div className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 flex flex-col gap-2 mt-2">
                                            <div className="flex items-center justify-between gap-2">
                                              <span className="text-[10px] font-black tracking-[0.16em] text-slate-400 uppercase">자동 소요</span>
                                              <span className="text-[14px] font-black tabular-nums text-slate-700">{fmtDur(stayDurationMins)}</span>
                                            </div>
                                            <div className="grid grid-cols-4 gap-1.5">
                                              {[5, 10, 20, 30].map((value) => (
                                                <button
                                                  key={value}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!nextItem) return;
                                                    updateLodgeCheckoutTime(dIdx, pIdx, value);
                                                  }}
                                                  disabled={!nextItem}
                                                  className="rounded-lg border border-violet-100 bg-violet-50/70 py-1.5 text-[10px] font-black text-violet-600 transition-colors hover:bg-violet-500 hover:text-white disabled:opacity-40"
                                                >
                                                  +{value}m
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                                {String(p.memo || '').trim() ? (
                                  <input
                                    value={p.memo || ''}
                                    onChange={(e) => updateMemo(dIdx, pIdx, e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all"
                                    placeholder="메모를 입력하세요..."
                                  />
                                ) : null}
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
                                  {hasPlanB && (
                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200 leading-none shadow-sm animate-in fade-in zoom-in duration-300">PLAN B {isPlanBActive ? 'ACTIVE' : ''}</span>
                                  )}
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
                                <SharedNameRow
                                  value={p.activity}
                                  onChange={(e) => updateActivityName(dIdx, pIdx, e.target.value)}
                                  onFocus={(e) => e.target.select()}
                                  onKeyDown={async (e) => {
                                    if (e.key === 'Enter' && p.activity.trim()) {
                                      e.preventDefault();
                                      setLastAction('주소 검색 중...');
                                      const result = await searchAddressFromPlaceName(getPlaceSearchName(p), tripRegion);
                                      if (result?.address) { updateAddress(dIdx, pIdx, result.address); setLastAction(`주소 자동 입력: ${result.address}`); }
                                      else setLastAction('주소를 찾을 수 없습니다.');
                                    }
                                  }}
                                  placeholder="일정 이름 입력 후 Enter"
                                  onContainerClick={(e) => e.stopPropagation()}
                                  actionButton={
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); openPlanEditModal(dIdx, pIdx); }}
                                        className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                                        title="일정 수정"
                                      >
                                        <Pencil size={9} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            const result = await analyzeClipboardSmartFill({ mode: 'all', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                                            const parsed = result?.parsed;
                                            if (parsed) {
                                              setAiLearningCapture({
                                                itemId: p.id,
                                                rawSource: result.rawPayload,
                                                aiResult: parsed,
                                                inputType: result.inputType
                                              });
                                              if (parsed.name) updateActivityName(dIdx, pIdx, parsed.name);
                                              if (parsed.address) updateAddress(dIdx, pIdx, parsed.address);
                                              if (parsed.business) setItinerary(prev => { const d = JSON.parse(JSON.stringify(prev)); d.days[dIdx].plan[pIdx].business = normalizeBusiness(parsed.business); return d; });
                                              if (parsed.menus.length) setItinerary(prev => { const d = JSON.parse(JSON.stringify(prev)); d.days[dIdx].plan[pIdx].receipt = { ...(d.days[dIdx].plan[pIdx].receipt || {}), items: parsed.menus.filter(Boolean) }; return d; });
                                              showInfoToast(isAiSmartFillSource(result?.source) ? `AI 스마트 전체 붙여넣기 완료${result?.usedImage ? ' (이미지 포함)' : ''}` : '스마트 전체 붙여넣기 완료');
                                            } else {
                                              showInfoToast(useAiSmartFill ? 'Groq가 붙여넣을 내용을 찾지 못했습니다.' : '붙여넣을 내용을 찾지 못했습니다.');
                                            }
                                          } catch (error) { showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill)); }
                                        }}
                                        className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                                        title="스마트 전체 붙여넣기"
                                      >
                                        <Sparkles size={9} />
                                      </button>
                                    </div>
                                  }
                                />

                                {/* 3행: 주소 박스 (수정 + 자동검색) */}
                                {(() => {
                                  let isSearchingAddr = false;
                                  const handleAutoAddr = async () => {
                                    if (isSearchingAddr || !p.activity?.trim()) return;
                                    isSearchingAddr = true;
                                    try {
                                      const found = await searchAddressFromPlaceName(getPlaceSearchName(p), tripRegion);
                                      if (found?.address) updateAddress(dIdx, pIdx, found.address);
                                    } catch (e) { /* silent */ }
                                    finally { isSearchingAddr = false; }
                                  };
                                  return (
                                    <SharedAddressRow
                                      value={p.receipt?.address || ''}
                                      onChange={(e) => updateAddress(dIdx, pIdx, e.target.value)}
                                      onContainerClick={(e) => e.stopPropagation()}
                                      leading={
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
                                      }
                                      actions={
                                        <>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openNaverPlaceSearch(getPlaceSearchName(p), p.receipt?.address || p.address || '');
                                            }}
                                            title="네이버 지도에서 장소 검색"
                                            className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                                          >
                                            <MapIcon size={9} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              void requestPerplexityNearbyRecommendations(dIdx, pIdx);
                                            }}
                                            title="AI로 근처 추천 받기"
                                            className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                                          >
                                            <Star size={9} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); void handleAutoAddr(); }}
                                            title="일정 이름으로 주소 자동 검색"
                                            className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                                          >
                                            <Sparkles size={9} />
                                          </button>
                                        </>
                                      }
                                    />
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
                                <SharedBusinessRow
                                  summary={formatBusinessSummary(p.business, p)}
                                  onContainerClick={(e) => e.stopPropagation()}
                                  quickEditSegments={buildBusinessQuickEditSegments(p.business || {})}
                                  onQuickEdit={(fieldKey) => setBusinessEditorTarget({ dayIdx: dIdx, pIdx, fieldKey })}
                                  onToggle={() => setBusinessEditorTarget(prev => (prev?.dayIdx === dIdx && prev?.pIdx === pIdx ? null : { dayIdx: dIdx, pIdx, fieldKey: null }))}
                                  actionButton={
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        try {
                                          const result = await analyzeClipboardSmartFill({ mode: 'business', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                                          const parsed = result?.parsed;
                                          if (parsed?.business) {
                                            setAiLearningCapture({
                                              itemId: p.id,
                                              rawSource: result.rawPayload,
                                              aiResult: parsed,
                                              inputType: result.inputType
                                            });
                                            setItinerary(prev => { const d = JSON.parse(JSON.stringify(prev)); d.days[dIdx].plan[pIdx].business = normalizeBusiness(parsed.business); return d; });
                                            showInfoToast(isAiSmartFillSource(result?.source) ? `AI 영업정보 스마트 입력 완료${result?.usedImage ? ' (이미지 포함)' : ''}` : '영업 정보만 스마트 입력 완료');
                                          } else {
                                            showInfoToast(useAiSmartFill ? 'Groq가 영업 정보를 찾지 못했습니다.' : '영업 정보를 찾지 못했습니다.');
                                          }
                                        } catch (error) { showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill)); }
                                      }}
                                      className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors"
                                      title="영업정보만 스마트 붙여넣기"
                                    >
                                      <Sparkles size={9} />
                                    </button>
                                  }
                                  expanded={businessEditorTarget?.dayIdx === dIdx && businessEditorTarget?.pIdx === pIdx ? (
                                    <div className="mt-1.5">
                                      <p className="text-[9px] text-slate-400 font-semibold mb-1.5">현재 일정 시간과 충돌하면 위에 빨간 경고가 표시됩니다.</p>
                                      <BusinessHoursEditor
                                        business={p.business || {}}
                                        focusField={businessEditorTarget?.dayIdx === dIdx && businessEditorTarget?.pIdx === pIdx ? businessEditorTarget?.fieldKey : null}
                                        onChange={(b) => updatePlanBusiness(dIdx, pIdx, b)}
                                      />
                                    </div>
                                  ) : null}
                                />

                                {/* 4행: 메모 입력란 */}
                                {String(p.memo || '').trim() ? (
                                  <SharedMemoRow
                                    value={p.memo || ''}
                                    onChange={(e) => updateMemo(dIdx, pIdx, e.target.value)}
                                    onContainerClick={(e) => e.stopPropagation()}
                                  />
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>

                        {/* 🟩 하단 영수증 영역 (전체 너비 100%) */}
                        {
                          p.type !== 'backup' && !isLodgeSegmentCard && (
                            <div className="mx-3 mb-3 mt-1.5 rounded-2xl overflow-hidden border border-slate-100/80" onClick={(e) => e.stopPropagation()}>
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
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-[10px] text-slate-400 font-semibold">메뉴명/수량/가격을 직접 수정하면 총액이 자동 계산됩니다.</p>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            const result = await analyzeClipboardSmartFill({ mode: 'menus', aiEnabled: useAiSmartFill, aiSettings: aiSmartFillConfig });
                                            const parsed = result?.parsed;
                                            if (parsed?.menus?.length) {
                                              setAiLearningCapture({
                                                itemId: p.id,
                                                rawSource: result.rawPayload,
                                                aiResult: parsed,
                                                inputType: result.inputType
                                              });
                                              setItinerary(prev => { const d = JSON.parse(JSON.stringify(prev)); d.days[dIdx].plan[pIdx].receipt = { ...(d.days[dIdx].plan[pIdx].receipt || {}), items: parsed.menus }; return d; });
                                              showInfoToast(isAiSmartFillSource(result?.source) ? `AI 메뉴 스마트 입력 완료${result?.usedImage ? ' (이미지 포함)' : ''}` : '메뉴 정보만 스마트 입력 완료');
                                            } else {
                                              showInfoToast(useAiSmartFill ? 'Groq가 메뉴 정보를 찾지 못했습니다.' : '메뉴 정보를 찾지 못했습니다.');
                                            }
                                          } catch (error) { showInfoToast(getSmartFillErrorMessage(error, useAiSmartFill)); }
                                        }}
                                        className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:bg-blue-50 hover:text-[#3182F6] hover:border-blue-200 transition-colors"
                                        title="메뉴만 스마트 붙여넣기"
                                      >
                                        <Sparkles size={9} />
                                      </button>
                                    </div>
                                    {p.receipt?.items?.map((m, mIdx) => (
                                      <div key={mIdx} className="flex justify-between items-center text-xs group/item">
                                        <div className="flex items-center gap-2 flex-1">
                                          <div className="cursor-pointer text-slate-300 hover:text-[#3182F6]" onClick={(e) => { e.stopPropagation(); updateMenuData(dIdx, pIdx, mIdx, 'toggle'); }}>
                                            {m.selected ? <CheckSquare size={14} className="text-[#3182F6]" /> : <Square size={14} />}
                                          </div>
                                          <input data-plan-menu-name={`${dIdx}-${pIdx}-${mIdx}`} value={m.name} onChange={(e) => updateMenuData(dIdx, pIdx, mIdx, 'name', e.target.value)} onClick={(e) => e.stopPropagation()} className="bg-transparent border-none outline-none text-slate-700 font-bold w-full" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <MenuPriceInput value={m.price} onCommit={(nextPrice) => updateMenuData(dIdx, pIdx, mIdx, 'price', nextPrice)} onClick={(e) => e.stopPropagation()} className="w-16 text-right font-bold text-slate-500 bg-transparent border-none outline-none placeholder:text-slate-300 focus:border-b focus:border-slate-300" />
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

                              {/* ✅ 하단 통합 요금 정보 */}
                              <SharedTotalFooter
                                expanded={isExpanded}
                                total={p.price}
                                onToggle={(e) => { e.stopPropagation(); toggleReceipt(p.id); }}
                              />
                            </div>
                          )
                        }
                      </div>
                    </div>{/* /Plan B drag box */}

                    {/* 일차 마지막 아이템 아래 드롭 존 */}
                    {
                      pIdx === d.plan.length - 1 && p.type !== 'backup' && (draggingFromLibrary || (draggingFromTimeline && draggingFromTimeline !== null)) && (() => {
                        const isDropHere = dropTarget?.dayIdx === dIdx && dropTarget?.insertAfterPIdx === pIdx;
                        const dropWarn = isDropHere && draggingFromLibrary ? getDropWarning(draggingFromLibrary, dIdx, pIdx) : '';
                        return (
                          <div
                            className="relative z-10 w-full py-2 cursor-copy"
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
                                moveTimelineItem(dIdx, pIdx, draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, isDragCopy, draggingFromTimeline.planPos);
                              }
                              setDraggingFromLibrary(null); setDraggingFromTimeline(null); setDropTarget(null); setIsDragCopy(false);
                            }}
                          >
                            {renderTimelineInsertGuide(isDropHere, dropWarn)}
                          </div>
                        );
                      })()
                    }

                    {/* 이동 정보 칩 / 드롭 존 */}
                    {
                      pIdx < d.plan.length - 1 && (
                        <div className="relative flex w-full items-center py-2">
                          {(() => {
                            const nextItem = d.plan[pIdx + 1];
                            if (!nextItem) return null;

                            if (draggingFromLibrary || draggingFromTimeline !== null) {
                              const isDropHere = dropTarget?.dayIdx === dIdx && dropTarget?.insertAfterPIdx === pIdx;
                              const dropWarn = isDropHere && draggingFromLibrary ? getDropWarning(draggingFromLibrary, dIdx, pIdx) : '';
                              return (
                                <div
                                  className="z-10 w-full py-2 cursor-copy"
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
                                      moveTimelineItem(dIdx, pIdx, draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, isDragCopy, draggingFromTimeline.planPos);
                                    }
                                    setDraggingFromLibrary(null); setDraggingFromTimeline(null); setDropTarget(null); setIsDragCopy(false);
                                  }}
                                >
                                  {renderTimelineInsertGuide(isDropHere, dropWarn)}
                                </div>
                              );
                            }

                            return (
                              <div id={`travel-chip-${dIdx}-${pIdx}`} className="z-10 my-3 flex w-full items-center justify-center">
                              <div className="flex w-full items-center justify-center rounded-[18px] border border-slate-200 bg-white px-4 py-2.5 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.24)] gap-2">
                                  {(() => {
                                    const rid = `${dIdx}_${pIdx + 1}`;
                                    const busy = calculatingRouteId === rid;
                                    return (
                                      <>
                                        {/* 이동 시간 */}
                                        <div className="flex items-center gap-1.5">
                                          <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx + 1, -TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Minus size={10} /></button>
                                          <span
                                            className={`min-w-[3rem] text-center tracking-tight text-xs font-black ${busy ? 'text-[#3182F6]' : (nextItem.travelTimeAuto && nextItem.travelTimeOverride !== nextItem.travelTimeAuto ? 'text-[#3182F6] cursor-pointer' : 'text-slate-800')}`}
                                            onClick={(e) => { e.stopPropagation(); if (nextItem.travelTimeAuto && nextItem.travelTimeOverride !== nextItem.travelTimeAuto) resetTravelTime(dIdx, pIdx + 1); }}
                                            title={nextItem.travelTimeAuto && nextItem.travelTimeOverride !== nextItem.travelTimeAuto ? '클릭하여 경로 계산 시간으로 초기화' : undefined}
                                          >{nextItem.travelTimeOverride || '15분'}</span>
                                          <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx + 1, TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Plus size={10} /></button>
                                        </div>
                                        {/* 거리 */}
                                        <button
                                          type="button"
                                          className={`flex items-center gap-1 text-xs font-bold transition-colors ${busy ? 'text-[#3182F6]' : 'text-slate-400 hover:text-[#3182F6]'}`}
                                          title={busy ? '경로 계산 중' : '구간 거리'}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (busy) return;
                                            const prevAddr = getRouteAddress(p, 'from');
                                            const toAddr = getRouteAddress(nextItem, 'to');
                                            if (!prevAddr || !toAddr) {
                                              setLastAction("길찾기용 출발/도착 주소가 필요합니다.");
                                              return;
                                            }
                                            openNaverRouteSearch(p.activity || '출발지', prevAddr, nextItem.activity || '도착지', toAddr);
                                          }}
                                        >
                                          {busy ? <LoaderCircle size={11} className="animate-spin" /> : <MapIcon size={11} />}
                                          <span>{busy ? '계산중' : getRouteDistanceStatus(p, nextItem)}</span>
                                        </button>
                                        {/* 자동경로 */}
                                        <button onClick={(e) => { e.stopPropagation(); autoCalculateRouteFor(dIdx, pIdx + 1, { forceRefresh: true }); }} disabled={!!calculatingRouteId} title={busy ? '계산 중' : '자동경로 계산'} className={`flex items-center justify-center w-6 h-6 transition-colors border rounded-lg text-[10px] font-black ${busy ? 'bg-[#3182F6]/10 text-[#3182F6] border-[#3182F6]/30' : 'bg-white hover:bg-[#3182F6] hover:text-white text-slate-400 border-slate-200 hover:border-[#3182F6]'}`}>
                                          {busy ? <LoaderCircle size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                        </button>
                                        {/* 구분선 */}
                                        <div className="w-px h-4 bg-slate-200 mx-0.5" />
                                        <div className="flex items-center gap-1.5">
                                          <button onClick={(e) => { e.stopPropagation(); updateBufferTime(dIdx, pIdx + 1, -BUFFER_STEP); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Minus size={10} /></button>
                                          <div className="flex flex-col items-center">
                                            <span
                                              className={`min-w-[3rem] cursor-pointer text-center tracking-tight text-xs font-black transition-colors ${nextItem._isBufferCoordinated ? 'text-orange-500 hover:text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                resetBufferTimeById(dIdx, nextItem.id, DEFAULT_BUFFER_MINS);
                                              }}
                                              title="클릭하여 보정 시간을 10분으로 초기화"
                                            >
                                              {nextItem.bufferTimeOverride || '10분'}
                                            </span>
                                          </div>
                                          <button onClick={(e) => { e.stopPropagation(); updateBufferTime(dIdx, pIdx + 1, BUFFER_STEP); }} className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500"><Plus size={10} /></button>
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                  </div>
                );
              }))}
            </React.Fragment>
          </div >

          {/* 되돌리기 토스트 */}
          {
            infoToast && (
              <div className="fixed inset-x-0 bottom-20 z-[320] flex justify-center px-4">
                <div className="flex items-center gap-3 bg-white/95 backdrop-blur-xl border border-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl shadow-[0_14px_30px_-16px_rgba(15,23,42,0.45)]">
                  <span className="text-[12px] font-bold">{infoToast}</span>
                  <button onClick={() => setInfoToast('')} className="text-slate-300 hover:text-slate-500 transition-colors ml-1">
                    ✕
                  </button>
                </div>
              </div>
            )
          }

          {
            undoToast && (
              <div className="fixed inset-x-0 bottom-20 z-[320] flex justify-center px-4">
                <div className="flex items-center gap-3 bg-white/95 backdrop-blur-xl border border-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl shadow-[0_14px_30px_-16px_rgba(15,23,42,0.45)]">
                  <span className="text-[12px] font-bold">{undoMessage || "변경 사항이 저장되었습니다"}</span>
                  <button
                    onClick={() => { handleUndo(); setUndoToast(false); }}
                    className="text-[11px] font-black text-[#3182F6] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors border border-blue-100"
                  >
                    되돌리기
                  </button>
                  <button onClick={() => setUndoToast(false)} className="text-slate-300 hover:text-slate-500 transition-colors ml-1">
                    ✕
                  </button>
                </div>
              </div>
            )
          }


          {
            draggingFromTimeline && (
              <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-[230] w-[min(680px,94vw)]">
                <div className="grid grid-cols-3 gap-2">
                  <div
                    data-drag-action="move_to_library"
                    onDragOver={(e) => { e.preventDefault(); setDragBottomTarget('move_to_library'); }}
                    onDragLeave={() => setDragBottomTarget(prev => (prev === 'move_to_library' ? '' : prev))}
                    onDrop={(e) => {
                      e.preventDefault();
                      const payload = getActiveTimelineDragPayload();
                      if (!payload) return;
                      const changed = applyTimelineBottomAction('move_to_library', payload);
                      if (changed) triggerUndoToast();
                      setDragBottomTarget('');
                      setDraggingFromTimeline(null);
                      desktopDragRef.current = null;
                    }}
                    className={`h-16 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-[11px] font-black transition-all ${dragBottomTarget === 'move_to_library' ? 'border-[#3182F6] bg-blue-50 text-[#3182F6]' : 'border-slate-200 bg-white text-slate-500'}`}
                  >
                    <Package size={13} />
                    <span>내장소로 이동</span>
                    <span className="text-[9px] font-bold opacity-70">여기에 드래그</span>
                  </div>
                  <div
                    data-drag-action="delete"
                    onDragOver={(e) => { e.preventDefault(); setDragBottomTarget('delete'); }}
                    onDragLeave={() => setDragBottomTarget(prev => (prev === 'delete' ? '' : prev))}
                    onDrop={(e) => {
                      e.preventDefault();
                      const payload = getActiveTimelineDragPayload();
                      if (!payload) return;
                      const changed = applyTimelineBottomAction('delete', payload);
                      if (changed) triggerUndoToast();
                      setDragBottomTarget('');
                      setDraggingFromTimeline(null);
                      desktopDragRef.current = null;
                    }}
                    className={`h-16 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-[11px] font-black transition-all ${dragBottomTarget === 'delete' ? 'border-red-400 bg-red-50 text-red-500' : 'border-slate-200 bg-white text-slate-500'}`}
                  >
                    <Trash2 size={13} />
                    <span>삭제</span>
                    <span className="text-[9px] font-bold opacity-70">여기에 드래그</span>
                  </div>
                  <div
                    data-drag-action="copy_to_library"
                    onDragOver={(e) => { e.preventDefault(); setDragBottomTarget('copy_to_library'); }}
                    onDragLeave={() => setDragBottomTarget(prev => (prev === 'copy_to_library' ? '' : prev))}
                    onDrop={(e) => {
                      e.preventDefault();
                      const payload = getActiveTimelineDragPayload();
                      if (!payload) return;
                      const changed = applyTimelineBottomAction('copy_to_library', payload);
                      if (changed) triggerUndoToast();
                      setDragBottomTarget('');
                      setDraggingFromTimeline(null);
                      desktopDragRef.current = null;
                    }}
                    className={`h-16 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-[11px] font-black transition-all ${dragBottomTarget === 'copy_to_library' ? 'border-emerald-400 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-white text-slate-500'}`}
                  >
                    <PlusCircle size={13} />
                    <span>내장소로 복제</span>
                    <span className="text-[9px] font-bold opacity-70">여기에 드래그</span>
                  </div>
                </div>
              </div>
            )
          }

          {/* ── 드래그 프리뷰 고스트 (모바일용) ── */}
          {
            (draggingFromLibrary || draggingFromTimeline) && (
              <div
                ref={dragGhostRef}
                className="fixed pointer-events-none z-[9999] bg-white/96 backdrop-blur-xl border border-[#3182F6]/25 rounded-full px-3.5 py-2 shadow-[0_12px_28px_rgba(49,130,246,0.22)] flex items-center gap-2.5 animate-in fade-in zoom-in duration-150"
                style={{
                  left: 0,
                  top: 0,
                  transform: `translate3d(${dragCoord.x}px, ${dragCoord.y}px, 0) translate(-50%, -120%)`,
                  willChange: 'transform'
                }}
              >
                <Move size={12} className="text-[#3182F6] shrink-0" />
                <span className="text-[12px] font-black text-slate-800 truncate max-w-[180px]">
                  {draggingFromLibrary?.name ||
                    (itinerary.days?.[draggingFromTimeline?.dayIdx]?.plan?.[draggingFromTimeline?.pIdx]?.activity) ||
                    '일정 이동 중'}
                </span>
              </div>
            )
          }
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
    </div >
  );
};

const AppWithBoundary = () => (
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);

export default AppWithBoundary;
