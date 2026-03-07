/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, no-useless-escape */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  Navigation, MessageSquare,
  Hourglass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  ArrowUpRight, ArrowUpLeft, ArrowDownRight, ArrowDownLeft,
  PlusCircle, Waves, QrCode, CheckSquare, Square,
  Plus, Minus, MapPin, Trash2, Map as MapIcon, ExternalLink,
  ChevronsRight, Sparkles, CornerDownRight, GitBranch, Umbrella, ArrowLeftRight, Store, Lock, ChevronLeft, Timer, Anchor, Utensils, Coffee, Camera, Bed, ChevronDown, ChevronUp, Package, Eye, Star, Pencil
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
];
const TAG_VALUES = new Set(TAG_OPTIONS.map(t => t.value));
const normalizeTagOrder = (input) => {
  const list = Array.isArray(input) ? input.filter(t => TAG_VALUES.has(t)) : [];
  const unique = [...new Set(list)];
  if (unique.length === 0) return ['place'];
  return unique.slice(0, 2);
};
const toggleTagSelection = (current, tagValue, max = 2) => {
  const base = normalizeTagOrder(current);
  if (base.includes(tagValue)) {
    const removed = base.filter(t => t !== tagValue);
    return removed.length ? removed : ['place'];
  }
  const nextBase = base.length === 1 && base[0] === 'place' && tagValue !== 'place' ? [] : base;
  if (nextBase.length >= max) return [nextBase[0], tagValue];
  return [...nextBase, tagValue];
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
  return 'text-slate-500 bg-slate-100 border-slate-200';
};
const OrderedTagPicker = ({ value = ['place'], onChange, title = '태그', className = '' }) => {
  const selected = normalizeTagOrder(value);
  return (
    <div className={className}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-center gap-1 mb-1.5">
        <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[9px] font-black text-slate-500">1태그: {(TAG_OPTIONS.find(t => t.value === selected[0])?.label) || '-'}</span>
        <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[9px] font-black text-slate-500">2태그: {(TAG_OPTIONS.find(t => t.value === selected[1])?.label) || '-'}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {TAG_OPTIONS.map(t => {
          const active = selected.includes(t.value);
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange(toggleTagSelection(selected, t.value))}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black border transition-colors ${getTagButtonClass(t.value, active)}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
const VisitStateChips = ({ isRevisit = false, onSelectNew, onSelectRevisit }) => (
  <div className="flex items-center gap-1.5">
    <button
      type="button"
      onClick={onSelectNew}
      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 transition-colors ${!isRevisit ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-400 bg-white border-slate-200 hover:border-slate-300'}`}
    >
      NEW
    </button>
    <button
      type="button"
      onClick={onSelectRevisit}
      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 transition-colors ${isRevisit ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-slate-400 bg-white border-slate-200 hover:border-slate-300'}`}
    >
      재방문
    </button>
  </div>
);
const WEEKDAY_OPTIONS = [
  { label: '월', value: 'mon' },
  { label: '화', value: 'tue' },
  { label: '수', value: 'wed' },
  { label: '목', value: 'thu' },
  { label: '금', value: 'fri' },
  { label: '토', value: 'sat' },
  { label: '일', value: 'sun' },
];
const EMPTY_BUSINESS = { open: '', close: '', breakStart: '', breakEnd: '', closedDays: [] };
const normalizeBusiness = (business = {}) => ({
  open: String(business.open || ''),
  close: String(business.close || ''),
  breakStart: String(business.breakStart || ''),
  breakEnd: String(business.breakEnd || ''),
  closedDays: Array.isArray(business.closedDays) ? [...new Set(business.closedDays)] : [],
});

// API 키는 각 사용자의 로컬스토리지에만 저장됩니다 (서버 미전송)
const analyzeImageWithGemini = async (base64Data, mimeType = 'image/jpeg', apiKey = '') => {
  if (!apiKey) throw new Error('Gemini API 키가 설정되지 않았습니다.');
  const prompt = `이 이미지는 한국 지도/리뷰 앱(네이버 지도, 카카오맵 등)의 장소 정보 화면 또는 블로그/영수증입니다.
아래 JSON 형식으로만 응답해주세요. 확인할 수 없는 항목은 빈 값으로 두세요.

{
  "name": "장소명",
  "address": "주소 (전체 주소)",
  "category": "food 또는 cafe 또는 tour 또는 lodge 또는 pickup 또는 openrun 또는 view 또는 experience 또는 place 중 하나",
  "extraTags": ["food","cafe","tour","lodge","pickup","openrun","view","experience","place" 중 최대 1개],
  "memo": "메모 (영업시간, 예약 필요 여부 등 핵심 사항만 한 줄로)",
  "menus": [
    {"name": "메뉴명", "price": 숫자(원)}
  ]
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64Data } }
          ]
        }]
      })
    }
  );
  if (!res.ok) throw new Error(`Gemini API 오류: ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('응답 파싱 실패');
  return JSON.parse(jsonMatch[0]);
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
          if (addr) return { address: addr, source: '카카오' };
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
        if (road) return { address: road, source: 'Nominatim' };
      }
      // 도로명 없으면 display_name 정제
      const raw = results[0].display_name || '';
      if (raw) {
        // 한국 주소 역순 정제: "번지, 도로명, 동, 시, 도, 대한민국" → "시 도로명 번지"
        const parts = raw.split(', ').filter(p => p !== '대한민국' && !/^\d{5}$/.test(p));
        return { address: parts.slice(0, 4).reverse().join(' '), source: 'Nominatim' };
      }
    } catch (e) {
      clearTimeout(timeoutId);
      continue;
    }
  }
  return { address: '', source: 'Nominatim', error: '검색 결과 없음 (카카오 API 키 등록 시 정확도 향상)' };
};

const PlaceAddForm = ({ newPlaceName, setNewPlaceName, newPlaceTypes, setNewPlaceTypes, regionHint, onAdd, onCancel, geminiApiKey = '' }) => {
  const [isRevisit, setIsRevisit] = React.useState(false);
  const [business, setBusiness] = React.useState(EMPTY_BUSINESS);
  const [menus, setMenus] = React.useState([]);
  const [menuInput, setMenuInput] = React.useState({ name: '', price: '' });
  const [address, setAddress] = React.useState('');
  const [memo, setMemo] = React.useState('');
  const [isSearchingAddress, setIsSearchingAddress] = React.useState(false);
  const [addressSearchNote, setAddressSearchNote] = React.useState('');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analyzeNote, setAnalyzeNote] = React.useState('');
  const [previewImg, setPreviewImg] = React.useState(null);
  const imageInputRef = React.useRef(null);

  // 이미지 파일 → Gemini 분석 → 폼 자동 입력
  const handleImageAnalyze = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsAnalyzing(true);
    setAnalyzeNote('🔍 AI가 이미지를 분석 중...');
    setPreviewImg(URL.createObjectURL(file));
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await analyzeImageWithGemini(base64, file.type, geminiApiKey);
      if (result.name) setNewPlaceName(result.name);
      if (result.address) setAddress(result.address);
      if (result.category || Array.isArray(result.extraTags)) {
        const analyzedTags = normalizeTagOrder([result.category, ...(Array.isArray(result.extraTags) ? result.extraTags : [])]);
        setNewPlaceTypes(analyzedTags);
      }
      if (result.memo) setMemo(result.memo);
      if (Array.isArray(result.menus) && result.menus.length > 0) {
        setMenus(result.menus.map(m => ({ name: m.name || '', price: Number(m.price) || 0 })));
      }
      setAnalyzeNote('✅ 분석 완료! 내용을 확인하고 수정하세요.');
    } catch (e) {
      console.error(e);
      setAnalyzeNote(`❌ 분석 실패: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 붙여넣기(Ctrl+V)로 이미지 입력
  React.useEffect(() => {
    const onPaste = (e) => {
      const item = Array.from(e.clipboardData?.items || []).find(i => i.type.startsWith('image/'));
      if (item) handleImageAnalyze(item.getAsFile());
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  const addMenu = () => {
    if (!menuInput.name.trim()) return;
    setMenus(prev => [...prev, { name: menuInput.name.trim(), price: Number(menuInput.price) || 0 }]);
    setMenuInput({ name: '', price: '' });
  };

  const handleAdd = () => {
    onAdd({ types: normalizeTagOrder(newPlaceTypes), menus, address, memo, revisit: isRevisit, business: normalizeBusiness(business) });
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
    <div className="mb-3 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">새 장소 등록</p>
        <div className="flex items-center gap-1.5">
          {isAnalyzing && <span className="text-[9px] text-[#3182F6] font-black animate-pulse">AI 분석 중...</span>}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 text-[9px] font-black text-slate-500 hover:border-[#3182F6] hover:text-[#3182F6] bg-white transition-all"
            title="이미지로 자동 입력 (Ctrl+V 붙여넣기도 가능)"
          >
            <Camera size={10} /> 이미지로 입력
          </button>
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageAnalyze(e.target.files[0]); }} />
        </div>
      </div>

      {/* 미리보기 + 분석 결과 노트 */}
      {previewImg && (
        <div className="flex items-start gap-2 px-3 pt-2.5">
          <img src={previewImg} alt="분석 이미지" className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0" />
          <div className="flex-1 flex flex-col gap-1">
            <p className={`text-[10px] font-bold ${analyzeNote.startsWith('❌') ? 'text-red-500' : analyzeNote.startsWith('✅') ? 'text-emerald-500' : 'text-[#3182F6]'}`}>{analyzeNote}</p>
            <button onClick={() => { setPreviewImg(null); setAnalyzeNote(''); }} className="text-[9px] text-slate-400 hover:text-red-400 font-bold w-fit">미리보기 닫기</button>
          </div>
        </div>
      )}

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

        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">방문 상태</p>
          <VisitStateChips
            isRevisit={isRevisit}
            onSelectNew={() => setIsRevisit(false)}
            onSelectRevisit={() => setIsRevisit(true)}
          />
        </div>
        <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-2">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">영업 정보 (선택)</p>
          <div className="grid grid-cols-2 gap-1.5 mb-1.5">
            <input
              type="time"
              value={business.open}
              onChange={(e) => setBusiness(prev => ({ ...prev, open: e.target.value }))}
              className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]"
              title="운영 시작"
            />
            <input
              type="time"
              value={business.close}
              onChange={(e) => setBusiness(prev => ({ ...prev, close: e.target.value }))}
              className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]"
              title="운영 종료"
            />
            <input
              type="time"
              value={business.breakStart}
              onChange={(e) => setBusiness(prev => ({ ...prev, breakStart: e.target.value }))}
              className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]"
              title="브레이크 시작"
            />
            <input
              type="time"
              value={business.breakEnd}
              onChange={(e) => setBusiness(prev => ({ ...prev, breakEnd: e.target.value }))}
              className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]"
              title="브레이크 종료"
            />
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [draggingFromLibrary, setDraggingFromLibrary] = useState(null);
  const [draggingFromTimeline, setDraggingFromTimeline] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [dropOnItem, setDropOnItem] = useState(null); // { dayIdx, pIdx } — Plan B 드롭 대상
  const [isDragCopy, setIsDragCopy] = useState(false); // Ctrl+드래그 시 복사 모드
  const ctrlHeldRef = useRef(false);
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceTypes, setNewPlaceTypes] = useState(['food']);
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [editPlaceDraft, setEditPlaceDraft] = useState(null);
  const [tripRegion, setTripRegion] = useState(() => safeLocalStorageGet('trip_region_hint', '제주시'));
  const [tripStartDate, setTripStartDate] = useState(() => safeLocalStorageGet('trip_start_date', ''));
  const [geminiApiKey, setGeminiApiKey] = useState(() => safeLocalStorageGet('gemini_api_key', ''));
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  // 초기 상태 안전하게 설정
  const [itinerary, setItinerary] = useState({ days: [], places: [] });
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [lastAction, setLastAction] = useState("3일차 시작 일정이 수정되었습니다.");
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [activeDay, setActiveDay] = useState(1);
  const [activeItemId, setActiveItemId] = useState(null);
  const [tagEditorTarget, setTagEditorTarget] = useState(null); // {dayIdx, pIdx}
  const [businessEditorTarget, setBusinessEditorTarget] = useState(null); // {dayIdx, pIdx}
  const [ferryEditField, setFerryEditField] = useState(null); // { pId, field: 'load'|'depart' }
  const [routeCache, setRouteCache] = useState({});
  const [calculatingRouteId, setCalculatingRouteId] = useState(null);
  const [isCalculatingAllRoutes, setIsCalculatingAllRoutes] = useState(false);
  const [dashboardHeight, setDashboardHeight] = useState(200);
  const dashboardRef = useRef(null);

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

  // 스크롤 감지 → activeDay + activeItemId 자동 업데이트
  useEffect(() => {
    if (!itinerary.days?.length) return;
    const observers = [];
    itinerary.days.forEach((d) => {
      const el = document.getElementById(`day-marker-${d.day}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveDay(d.day); },
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
          ([entry]) => { if (entry.isIntersecting) setActiveItemId(p.id); },
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
    const hasBiz = business.open || business.close || business.breakStart || business.breakEnd || business.closedDays.length;
    if (!hasBiz) return '';
    const start = timeToMinutes(item?.time || '00:00');
    const end = start + (item?.duration || 60);
    if (business.open && start < timeToMinutes(business.open)) return `운영 시작 전 방문 (${business.open} 이후 권장)`;
    if (business.close && start >= timeToMinutes(business.close)) return `운영 종료 후 방문 (${business.close} 이전 권장)`;
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
  const formatBusinessSummary = (businessRaw) => {
    const business = normalizeBusiness(businessRaw || {});
    const segs = [];
    if (business.open || business.close) segs.push(`영업 ${business.open || '--:--'}~${business.close || '--:--'}`);
    if (business.breakStart || business.breakEnd) segs.push(`브레이크 ${business.breakStart || '--:--'}~${business.breakEnd || '--:--'}`);
    if (business.closedDays.length) {
      const labels = business.closedDays.map(v => WEEKDAY_OPTIONS.find(d => d.value === v)?.label || v).join(',');
      segs.push(`휴무 ${labels}`);
    }
    return segs.length ? segs.join(' · ') : '영업 정보 미설정';
  };

  const getPlanLabel = (index) => `Plan ${String.fromCharCode(66 + index)}`;

  const saveHistory = () => {
    setHistory(prev => {
      try {
        const newHistory = [...prev, JSON.parse(JSON.stringify(itinerary))];
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
  const toggleRevisit = (dayIdx, pIdx) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      item.revisit = !isRevisitCourse(item);
      return nextData;
    });
    setLastAction("재방문 상태를 업데이트했습니다.");
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

  const toggleReceipt = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
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
      default: return <div key={type} className={`${style} text-slate-500 bg-slate-100 border-slate-200`}><MapIcon size={10} /> 장소</div>;
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

  const dropTimelineItemOnLibrary = (dayIdx, pIdx) => {
    const item = itinerary.days[dayIdx].plan[pIdx];
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.days[dayIdx].plan.splice(pIdx, 1);
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
      return nextData;
    });
    setLastAction(`'${item.activity}' 일정과 플랜 B가 내 장소로 이동되었습니다.`);
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

  useEffect(() => {
    const handleScroll = () => {
      const dayElements = document.querySelectorAll('[data-day]');
      let currentActiveDay = null; // Will store the ID of closest element
      let minDistance = Infinity;

      dayElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Calculate offset (roughly targeting near top of the window, ~200px)
        const distance = Math.abs(rect.top - 200);
        if (distance < minDistance) {
          minDistance = distance;
          currentActiveDay = parseInt(el.getAttribute('data-day'), 10);
        }
      });
      if (currentActiveDay) setActiveDay(currentActiveDay);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Firestore 저장 (1초 디바운스)
  useEffect(() => {
    if (!loading && itinerary && itinerary.days && itinerary.days.length > 0) {
      const timer = setTimeout(() => {
        setDoc(doc(db, 'itinerary', 'main'), itinerary)
          .catch(e => console.error('Firestore 저장 실패:', e));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [itinerary, loading]);

  // Firestore 로드
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'itinerary', 'main'));
        if (snap.exists()) {
          const parsed = snap.data();
          if (parsed && Array.isArray(parsed.days)) {
            const patchedDays = parsed.days.map(d => ({
              ...d,
              plan: d.plan.map(p => {
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
            setItinerary({ days: patchedDays, places: parsed.places || [] });
            setLoading(false);
            return;
          }
        }
      } catch (e) { console.error('Firestore 로드 실패:', e); }

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
  }, []);

  if (loading) return <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center font-bold text-slate-400">PLANNER LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans flex overflow-x-hidden font-bold flex-row relative">
      {/* 🟢 좌측 네비게이션바 (사이드바) */}
      <div className="flex flex-col w-[420px] fixed left-0 top-0 bottom-0 bg-white border-r border-[#E5E8EB] z-[140] py-10 px-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-y-auto no-scrollbar">
        <h2 className="text-[22px] font-black text-slate-800 tracking-tight mb-10 flex items-center gap-2">
          <MapIcon className="text-[#3182F6]" size={24} /> 전체 일정 안내
        </h2>
        {/* 예산 요약 */}
        <div className="mb-6 pb-5 border-b border-slate-100">
          <div className="flex flex-col gap-1 mb-3">
            <span className="text-[10px] text-[#3182F6] font-black uppercase tracking-wider">남은 예산</span>
            <span className="text-[28px] font-black tracking-tighter text-[#3182F6] leading-none">₩{budgetSummary.remaining.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">지출 합계</span>
              <span className="text-[15px] font-black tracking-tighter text-slate-800">₩{budgetSummary.total.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-0.5 items-end">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">총 예산</span>
              {editingBudget ? (
                <input
                  type="number"
                  defaultValue={MAX_BUDGET}
                  autoFocus
                  className="text-[15px] font-black tracking-tighter text-slate-600 w-28 text-right bg-transparent border-b border-[#3182F6] outline-none"
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    if (val > 0) setItinerary(prev => ({ ...prev, maxBudget: val }));
                    setEditingBudget(false);
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setEditingBudget(false); }}
                />
              ) : (
                <span
                  className="text-[15px] font-black tracking-tighter text-slate-400 cursor-pointer hover:text-[#3182F6] transition-colors"
                  onClick={() => setEditingBudget(true)}
                  title="클릭하여 수정"
                >₩{MAX_BUDGET.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 pb-4 border-b border-slate-100">
          <div className="mt-0 flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 whitespace-nowrap">
            <MapPin size={11} className="text-[#3182F6]" />
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider whitespace-nowrap">여행지</span>
            <input
              value={tripRegion}
              onChange={(e) => setTripRegion(e.target.value)}
              placeholder="예: 제주시"
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-[11px] font-black text-slate-700 placeholder:text-slate-400 whitespace-nowrap"
            />
          </div>
          <div className="mt-2 flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 whitespace-nowrap">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider whitespace-nowrap">시작일</span>
            <input
              type="date"
              value={tripStartDate}
              onChange={(e) => setTripStartDate(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-[11px] font-black text-slate-700"
            />
          </div>
        </div>
        {/* Gemini API 키 설정 */}
        <div className="mb-6 pb-4 border-b border-slate-100">
          <button
            onClick={() => setShowApiKeyInput(v => !v)}
            className="flex items-center gap-1.5 w-full text-[10px] font-black text-slate-400 uppercase tracking-wider hover:text-[#3182F6] transition-colors mb-1.5"
          >
            <Sparkles size={10} /> AI 이미지 분석
            <span className={`ml-auto text-[8px] px-1.5 py-0.5 rounded-full font-black ${geminiApiKey ? 'bg-emerald-50 text-emerald-500 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
              {geminiApiKey ? '설정됨' : '키 필요'}
            </span>
          </button>
          {showApiKeyInput && (
            <div className="flex flex-col gap-1.5">
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => {
                  setGeminiApiKey(e.target.value);
                  safeLocalStorageSet('gemini_api_key', e.target.value);
                }}
                placeholder="AIza... (Google AI Studio)"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-slate-700 outline-none focus:border-[#3182F6] placeholder:text-slate-300"
              />
              <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                로카4스토리지에만 저장되며 서버로 전송되지 않습니다.<br />
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[#3182F6] hover:underline">Google AI Studio</a>에서 무료 발급
              </p>
              {geminiApiKey && (
                <button
                  onClick={() => { setGeminiApiKey(''); safeLocalStorageSet('gemini_api_key', ''); }}
                  className="text-[9px] text-red-400 hover:text-red-600 font-bold text-left"
                >
                  키 삭제
                </button>
              )}
            </div>
          )}
        </div>
        <nav className="flex flex-col gap-6 relative -ml-2">
          <div className="absolute left-[15px] top-4 bottom-8 w-px bg-slate-100 -z-10" />
          {itinerary.days?.map((d) => (
            <div key={d.day} className="flex items-start gap-1.5 group">
              <div
                className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-[15px] font-black shadow-sm transition-all duration-300 cursor-pointer ${activeDay === d.day ? 'bg-[#3182F6] text-white ring-4 ring-blue-50' : 'bg-white text-slate-400 border border-slate-200 group-hover:border-[#3182F6] group-hover:text-[#3182F6]'}`}
                onClick={() => { document.getElementById(`day-marker-${d.day}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveDay(d.day); }}
              >
                {d.day}
              </div>
              <div className="flex flex-col pt-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[15px] tracking-tight transition-colors duration-300 whitespace-nowrap cursor-pointer ${activeDay === d.day ? 'text-[#3182F6] font-black' : 'text-slate-500 font-bold group-hover:text-slate-800'}`}
                    onClick={() => { document.getElementById(`day-marker-${d.day}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveDay(d.day); }}
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
                      if (validItems.length === 1) { window.open(`https://map.naver.com/p/search/${encodeURIComponent(validItems[0].receipt?.address || validItems[0].activity)}`, '_blank'); return; }
                      const start = toSegment(validItems[0]);
                      const end = toSegment(validItems[validItems.length - 1]);
                      const vias = validItems.slice(1, -1).slice(0, 3).map(toSegment);
                      const viaPath = vias.length > 0 ? vias.join('/') + '/' : '';
                      window.open(`https://map.naver.com/p/directions/${start}/${viaPath}${end}/-/car`, '_blank');
                    }}
                    className="p-1 rounded-md border border-slate-200 text-slate-300 hover:text-[#3182F6] hover:border-[#3182F6] hover:bg-blue-50 transition-all"
                    title="네이버 지도에서 동선 보기"
                  >
                    <ExternalLink size={10} />
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold whitespace-nowrap truncate max-w-[170px]">{d.plan?.filter(p => p.type !== 'backup').length || 0}개 일정 · {tripRegion || '지역 미설정'}</span>
                {/* 일정 제목 목록 */}
                <div className="flex flex-col gap-0.5 mt-1 -ml-3">
                  {(d.plan || []).filter(p => p.type !== 'backup').map((p, pIdx, arr) => {
                    const isActive = activeItemId === p.id;
                    const nextP = arr[pIdx + 1];
                    const freeMin = nextP ? timeToMinutes(nextP.time) - (timeToMinutes(p.time) + (p.duration || 60)) : 0;
                    const isLongItem = (p.duration || 0) >= 120 && !p.types?.includes('lodge') && !p.types?.includes('ship');
                    return (
                      <div key={p.id}>
                        <button
                          onClick={() => { document.getElementById(pIdx === 0 ? `day-marker-${d.day}` : p.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
                          className={`w-full text-left flex items-center gap-1.5 px-0.5 py-0.5 rounded-lg transition-all ${isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                        >
                          <span className={`shrink-0 text-[9px] tabular-nums leading-none ${isActive ? 'font-black text-[#3182F6]' : 'font-bold text-slate-400'}`}>{p.time || '--:--'}</span>
                          <div className={`shrink-0 scale-90 origin-left transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>{getCategoryBadge((p.types?.[0]) || p.type || 'place')}</div>
                          <span className={`text-[10px] truncate max-w-[85px] leading-none transition-all ${isActive ? 'font-black text-[#3182F6]' : 'font-bold text-slate-500'}`}>{p.activity}</span>
                          {isLongItem && (
                            <span className="ml-auto shrink-0 text-[8px] font-black text-orange-400 bg-orange-50 border border-orange-200 rounded px-1 py-px leading-none">
                              {Math.floor(p.duration / 60)}h+
                            </span>
                          )}
                        </button>
                        {isLongItem && (
                          <div className="flex items-center gap-1 pl-0.5 py-0.5">
                            <div className="w-[1.5px] h-3 bg-orange-300 rounded-full" />
                            <span className="text-[9px] font-black text-orange-400">일정 추가 가능</span>
                          </div>
                        )}
                        {freeMin >= 60 && (
                          <div className="flex items-center gap-1 pl-0.5 py-0.5">
                            <div className="w-[1.5px] h-3 bg-amber-300 rounded-full" />
                            <span className="text-[9px] font-black text-amber-500">여유 {Math.floor(freeMin / 60)}h{freeMin % 60 > 0 ? ` ${freeMin % 60}m` : ''}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* 장소 라이브러리 */}
        <div
          className="mt-8 pt-6 border-t border-slate-100 flex flex-col flex-1"
          onDragOver={(e) => { if (draggingFromTimeline) e.preventDefault(); }}
          onDrop={(e) => {
            e.preventDefault();
            if (draggingFromTimeline) {
              if (draggingFromTimeline.altIdx !== undefined) {
                dropAltOnLibrary(draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx, draggingFromTimeline.altIdx);
              } else {
                dropTimelineItemOnLibrary(draggingFromTimeline.dayIdx, draggingFromTimeline.pIdx);
              }
              setDraggingFromTimeline(null);
            }
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">내 장소</p>
            <button
              onClick={() => setIsAddingPlace(v => !v)}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-[#3182F6] transition-colors"
            >
              <Plus size={10} />
            </button>
          </div>

          {/* 타임라인 드래그 중: 드롭 유도 영역 */}
          {draggingFromTimeline && (
            <div className="mb-3 flex items-center justify-center gap-1.5 h-12 rounded-xl border-2 border-dashed border-[#3182F6] bg-blue-50 text-[#3182F6] text-[11px] font-black animate-pulse">
              여기에 드롭해서 목록으로
            </div>
          )}

          {/* 장소 추가 폼 */}
          {isAddingPlace && (
            <PlaceAddForm
              newPlaceName={newPlaceName}
              setNewPlaceName={setNewPlaceName}
              newPlaceTypes={newPlaceTypes}
              setNewPlaceTypes={setNewPlaceTypes}
              regionHint={tripRegion}
              geminiApiKey={geminiApiKey}
              onAdd={addPlace}
              onCancel={() => setIsAddingPlace(false)}
            />
          )}

          {/* 장소 목록 */}
          <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1">
            {(itinerary.places || []).length === 0 && !isAddingPlace && (
              <p className="text-[10px] text-slate-400 text-center py-6 font-semibold leading-relaxed">
                + 버튼으로 장소를 추가하고<br />타임라인으로 드래그하세요
              </p>
            )}
            {(itinerary.places || []).map(place => {
              const chips = place.types ? place.types.map(t => getCategoryBadge(t)) : [getCategoryBadge('place')];
              const isEditing = editingPlaceId === place.id;
              const isPlaceRevisit = typeof place.revisit === 'boolean' ? place.revisit : false;

              if (isEditing && editPlaceDraft) {
                return (
                  <div key={place.id} className="rounded-2xl border-2 border-[#3182F6] bg-white overflow-hidden">
                    <div className="p-3 flex flex-col gap-2">
                      <OrderedTagPicker
                        title="태그"
                        value={editPlaceDraft.types || ['place']}
                        onChange={(tags) => setEditPlaceDraft(d => ({ ...d, types: tags }))}
                      />
                      <input
                        value={editPlaceDraft.name}
                        onChange={(e) => setEditPlaceDraft(d => ({ ...d, name: e.target.value }))}
                        placeholder="장소 이름"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[13px] font-black text-slate-800 outline-none focus:border-[#3182F6]"
                      />
                      <input
                        value={editPlaceDraft.address || ''}
                        onChange={(e) => setEditPlaceDraft(d => ({ ...d, address: e.target.value }))}
                        placeholder="주소"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-600 outline-none focus:border-[#3182F6]"
                      />
                      <input
                        value={editPlaceDraft.memo || ''}
                        onChange={(e) => setEditPlaceDraft(d => ({ ...d, memo: e.target.value }))}
                        placeholder="메모"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-600 outline-none focus:border-[#3182F6]"
                      />
                      <div className="bg-slate-50/60 border border-slate-200 rounded-lg p-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">메뉴 / 금액</p>
                        <p className="text-[9px] text-slate-400 font-semibold mb-1.5">메뉴를 수정하면 총액이 자동 반영됩니다.</p>
                        {(editPlaceDraft.receipt?.items || []).map((m, idx) => (
                          <div key={idx} className="flex items-center gap-1 mb-1">
                            <input
                              value={m.name || ''}
                              onChange={(e) => setEditPlaceDraft(d => {
                                const items = [...(d.receipt?.items || [])];
                                items[idx] = { ...items[idx], name: e.target.value };
                                return { ...d, receipt: { ...(d.receipt || {}), items } };
                              })}
                              placeholder="메뉴명"
                              className="flex-1 min-w-0 text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3182F6]"
                            />
                            <input
                              type="number"
                              value={m.price || 0}
                              onChange={(e) => setEditPlaceDraft(d => {
                                const items = [...(d.receipt?.items || [])];
                                items[idx] = { ...items[idx], price: Number(e.target.value) || 0 };
                                return { ...d, receipt: { ...(d.receipt || {}), items } };
                              })}
                              placeholder="가격"
                              className="w-16 text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3182F6]"
                            />
                            <input
                              type="number"
                              value={getMenuQty(m)}
                              onChange={(e) => setEditPlaceDraft(d => {
                                const items = [...(d.receipt?.items || [])];
                                items[idx] = { ...items[idx], qty: Math.max(1, Number(e.target.value) || 1), selected: items[idx]?.selected !== false };
                                return { ...d, receipt: { ...(d.receipt || {}), items } };
                              })}
                              placeholder="수량"
                              className="w-12 text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3182F6]"
                            />
                            <button
                              type="button"
                              onClick={() => setEditPlaceDraft(d => {
                                const items = [...(d.receipt?.items || [])];
                                items.splice(idx, 1);
                                return { ...d, receipt: { ...(d.receipt || {}), items } };
                              })}
                              className="px-1.5 py-1 text-[10px] text-slate-300 hover:text-red-500"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditPlaceDraft(d => ({ ...d, receipt: { ...(d.receipt || {}), items: [...(d.receipt?.items || []), { name: '', price: 0, qty: 1, selected: true }] } }))}
                          className="w-full py-1 border border-dashed border-slate-300 rounded text-[10px] font-bold text-slate-400 hover:text-[#3182F6] hover:bg-white"
                        >
                          + 메뉴 추가
                        </button>
                      </div>
                      <input
                        type="number"
                        value={(editPlaceDraft.receipt?.items || []).reduce((sum, m) => sum + (m.selected === false ? 0 : getMenuLineTotal(m)), 0)}
                        readOnly
                        placeholder="예상 금액(자동)"
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-600 outline-none [appearance:textfield]"
                      />
                      <div className="bg-slate-50/60 border border-slate-200 rounded-lg p-2">
                        <button
                          type="button"
                          onClick={() => setEditPlaceDraft(d => ({ ...d, showBusinessEditor: !d.showBusinessEditor }))}
                          className="w-full flex items-center justify-between text-left"
                        >
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">영업 정보</span>
                          <span className="text-[10px] font-bold text-slate-500 truncate ml-2">{formatBusinessSummary(editPlaceDraft.business)}</span>
                        </button>
                        {editPlaceDraft.showBusinessEditor && (
                          <>
                            <p className="text-[9px] text-slate-400 font-semibold mt-1 mb-1.5">기본은 접힘 상태이며, 필요할 때만 펼쳐 수정하세요.</p>
                            <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                              <input type="time" value={editPlaceDraft.business?.open || ''} onChange={(e) => setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), open: e.target.value } }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]" />
                              <input type="time" value={editPlaceDraft.business?.close || ''} onChange={(e) => setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), close: e.target.value } }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]" />
                              <input type="time" value={editPlaceDraft.business?.breakStart || ''} onChange={(e) => setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), breakStart: e.target.value } }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]" />
                              <input type="time" value={editPlaceDraft.business?.breakEnd || ''} onChange={(e) => setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), breakEnd: e.target.value } }))} className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]" />
                            </div>
                            <div className="flex items-center gap-1 flex-wrap">
                              {WEEKDAY_OPTIONS.map(w => {
                                const active = (editPlaceDraft.business?.closedDays || []).includes(w.value);
                                return (
                                  <button
                                    key={w.value}
                                    type="button"
                                    onClick={() => setEditPlaceDraft(d => ({ ...d, business: { ...normalizeBusiness(d.business), closedDays: active ? normalizeBusiness(d.business).closedDays.filter(v => v !== w.value) : [...normalizeBusiness(d.business).closedDays, w.value] } }))}
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
                      <VisitStateChips
                        isRevisit={!!editPlaceDraft.revisit}
                        onSelectNew={() => setEditPlaceDraft(d => ({ ...d, revisit: false }))}
                        onSelectRevisit={() => setEditPlaceDraft(d => ({ ...d, revisit: true }))}
                      />
                    </div>
                    <div className="px-3 pb-3 flex gap-1.5">
                      <button
                        onClick={() => {
                          const receipt = deepClone(editPlaceDraft.receipt || { address: editPlaceDraft.address || '', items: [] });
                          if (!Array.isArray(receipt.items)) receipt.items = [];
                          receipt.address = editPlaceDraft.address || receipt.address || '';
                          const price = receipt.items.reduce((sum, m) => sum + (m.selected === false ? 0 : getMenuLineTotal(m)), 0);
                          updatePlace(place.id, { ...editPlaceDraft, business: normalizeBusiness(editPlaceDraft.business || {}), receipt, price });
                          setEditingPlaceId(null);
                          setEditPlaceDraft(null);
                        }}
                        className="flex-1 py-1.5 bg-[#3182F6] text-white text-[11px] font-black rounded-lg"
                      >
                        저장
                      </button>
                      <button onClick={() => { setEditingPlaceId(null); setEditPlaceDraft(null); }} className="flex-1 py-1.5 bg-slate-100 text-slate-500 text-[11px] font-black rounded-lg">취소</button>
                    </div>
                  </div>
                );
              }

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
                  className="relative rounded-3xl border-2 border-slate-200 bg-white cursor-grab active:cursor-grabbing select-none transition-all hover:shadow-lg group overflow-hidden"
                >
                  <div className="p-4 flex flex-col gap-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap pr-12">
                      {chips}
                      {!isPlaceRevisit && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 text-emerald-600 bg-emerald-50 border-emerald-200">NEW</span>
                      )}
                    </div>
                    <span className="text-[22px] font-black text-slate-800 leading-tight truncate">{place.name}</span>
                    {place.address && (
                      <div className="flex items-center gap-2 text-slate-500 bg-slate-50 w-full px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:border-[#3182F6]/50 hover:bg-blue-50/30 transition-all" onClick={(e) => { e.stopPropagation(); window.open(`https://map.naver.com/v5/search/${encodeURIComponent(place.address)}`, '_blank'); }}>
                        <MapPin size={11} className="text-[#3182F6] shrink-0" />
                        <span className="text-[10px] font-bold truncate">{place.address}</span>
                      </div>
                    )}
                    <div className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 truncate">
                      {formatBusinessSummary(place.business)}
                    </div>
                    {place.memo && (
                      <div className="w-full bg-slate-50/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-medium text-slate-600 truncate">
                        {place.memo}
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between bg-white">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
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
                          showBusinessEditor: false
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
          {(itinerary.places || []).length > 0 && !draggingFromTimeline && (
            <p className="text-[10px] text-slate-400 font-semibold mt-3 text-center">
              드래그해서 일정에 추가
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center ml-[420px] w-full">
        {/* 일정 목록 */}
        <div className="w-full max-w-2xl px-5 pt-10 pb-32">
          <div
            className="rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 animate-in font-bold overflow-hidden bg-white"
          >
            <div className="px-6 pt-16 pb-6 flex flex-col gap-6 relative z-0">

              {itinerary.days?.map((d, dIdx) => d.plan?.map((p, pIdx) => {
                const isExpanded = expandedId === p.id;
                let stateStyles;
                if (p.types?.includes('lodge')) stateStyles = 'bg-[#F4F6FB] border-[#C7D2FE] shadow-sm';
                else if (p.types?.includes('ship')) stateStyles = 'bg-blue-50/20 border-blue-200 shadow-sm';
                else if (p.isTimeFixed) stateStyles = 'bg-white border-[#3182F6]/50 shadow-md';
                else stateStyles = 'bg-white border-slate-200';

                const chips = p.types ? p.types.map(t => getCategoryBadge(t)) : (p.type ? [getCategoryBadge(p.type)] : []);
                const isRevisit = isRevisitCourse(p);
                const isNextFixed = (pIdx < d.plan.length - 1) && d.plan[pIdx + 1]?.isTimeFixed;
                const isLodge = p.types?.includes('lodge');
                const isShip = p.types?.includes('ship');
                const businessWarning = !isShip ? getBusinessWarning(p, dIdx) : '';
                const planBCount = p.alternatives?.length || 0;
                const hasPlanB = planBCount > 0;
                // 스마트 락(숙소 자동 계산) 여부 확인
                const isAutoLocked = p.isAutoDuration;

                return (
                  <div
                    key={p.id}
                    id={pIdx === 0 ? `day-marker-${d.day}` : p.id}
                    className="relative group"
                  >
                    {d.day > 1 && pIdx === 0 && (
                      <div className="flex items-center justify-center pb-6 w-full">
                        <div className="flex items-center gap-2 w-fit max-w-full mx-auto">
                          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm w-fit">
                            <div className="flex items-center gap-2 bg-slate-50 px-2 py-1.5 rounded-xl border border-slate-100">
                              <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx, -TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-blue-50 text-slate-500"><Minus size={10} /></button>
                              <span
                                className={`min-w-[3rem] text-center tracking-tight text-xs font-black ${p.travelTimeAuto && p.travelTimeOverride !== p.travelTimeAuto ? 'text-[#3182F6] cursor-pointer' : 'text-slate-800'}`}
                                onClick={(e) => { e.stopPropagation(); if (p.travelTimeAuto && p.travelTimeOverride !== p.travelTimeAuto) resetTravelTime(dIdx, pIdx); }}
                                title={p.travelTimeAuto && p.travelTimeOverride !== p.travelTimeAuto ? '클릭하여 경로 계산 시간으로 초기화' : undefined}
                              >{p.travelTimeOverride || '15분'}</span>
                              <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx, TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-blue-50 text-slate-500"><Plus size={10} /></button>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold px-1.5">
                              <MapIcon size={12} /><span>{formatDistanceText(p.distance)}</span>
                            </div>
                            {(() => {
                              const rid = `${dIdx}_${pIdx}`; const busy = calculatingRouteId === rid; return (
                                <button onClick={(e) => { e.stopPropagation(); autoCalculateRouteFor(dIdx, pIdx); }} disabled={!!calculatingRouteId} className={`flex items-center gap-1 transition-colors border rounded-lg px-2 py-1.5 text-[10px] font-black shadow-sm ${busy ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white hover:bg-[#3182F6] hover:text-white text-slate-400 border-slate-200 hover:border-[#3182F6]'}`}>
                                  <Sparkles size={10} /> {busy ? '계산중' : '자동경로'}
                                </button>);
                            })()}
                          </div>
                          <div className="flex items-center bg-white px-2 py-1.5 rounded-full border border-slate-200 shadow-sm w-fit">
                            <div className="flex items-center gap-2 bg-slate-50 px-2 py-1.5 rounded-xl border border-slate-100">
                              <button onClick={(e) => { e.stopPropagation(); updateBufferTime(dIdx, pIdx, -BUFFER_STEP); }} className="w-5 h-5 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-blue-50 text-slate-500"><Minus size={10} /></button>
                              <span className="min-w-[3rem] text-center tracking-tight text-xs font-black text-slate-800">{p.bufferTimeOverride || '10분'}</span>
                              <button onClick={(e) => { e.stopPropagation(); updateBufferTime(dIdx, pIdx, BUFFER_STEP); }} className="w-5 h-5 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-blue-50 text-slate-500"><Plus size={10} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}


                    <div
                      draggable={p.type !== 'backup'}
                      onDragStart={(e) => {
                        if (p.type === 'backup' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') { e.preventDefault(); return; }
                        setDraggingFromTimeline({ dayIdx: dIdx, pIdx });
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
                      className={`relative flex flex-col border-2 rounded-3xl hover:shadow-lg transition-all overflow-hidden cursor-grab active:cursor-grabbing ${draggingFromTimeline?.dayIdx === dIdx && draggingFromTimeline?.pIdx === pIdx ? 'opacity-50 scale-[0.99]' : ''} ${dropOnItem?.dayIdx === dIdx && dropOnItem?.pIdx === pIdx ? 'ring-2 ring-[#3182F6] ring-offset-2 ring-offset-[#F2F4F6]' : ''} ${hasPlanB ? 'ring-1 ring-amber-100' : ''} ${stateStyles}`}
                      onClick={() => toggleReceipt(p.id)}
                    >
                      {hasPlanB && (
                        <div className="absolute top-3 right-11 px-2 py-0.5 rounded-md border border-amber-200 bg-amber-50 text-[9px] font-black text-amber-600 z-20">
                          PLAN B {planBCount}
                        </div>
                      )}
                      <div className="flex items-stretch border-b border-slate-100 border-dashed">

                        {/* 🟢 좌측 컨트롤 타워 */}
                        {!isShip && !isLodge && <div className={`relative flex flex-col items-center justify-center gap-2 w-[110px] sm:w-[9rem] shrink-0 ${p.isTimeFixed ? 'bg-blue-50/80' : 'bg-black/[0.02]'} border-r border-slate-100/50 py-3 sm:py-4 px-2 sm:px-3 overflow-hidden transition-all duration-300`}>
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
                            <div className={`flex items-center justify-between w-full bg-white px-1 sm:px-2 py-1 rounded-xl border shadow-sm my-1.5 transition-colors ${isNextFixed || isAutoLocked ? 'border-orange-200 ring-1 ring-orange-100' : 'border-slate-200'}`} onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => updateDuration(dIdx, pIdx, -TIME_UNIT)} className={`w-4 sm:w-5 h-5 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors shrink-0 ${isNextFixed || isAutoLocked ? 'text-orange-300' : 'text-slate-400 hover:text-blue-500'}`}><Minus size={10} /></button>
                              <span
                                className={`text-[12px] whitespace-nowrap font-extrabold tabular-nums cursor-pointer hover:underline ${isNextFixed || isAutoLocked ? 'text-orange-500' : 'text-slate-600 hover:text-blue-600'}`}
                                onClick={() => resetDuration(dIdx, pIdx)}
                                title={isNextFixed || isAutoLocked ? "다음 일정에 맞춰 자동으로 계산된 시간입니다" : "60분으로 초기화"}
                              >{p.duration}분</span>
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
                                  <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-2 select-none">
                                    <div className="flex flex-col items-center gap-0.5">
                                      <span className="text-[8px] text-blue-400 font-bold tracking-widest">선적</span>
                                      {timeInput('load', p.time || '00:00', d => updateStartTime(dIdx, pIdx, d))}
                                    </div>
                                    <span className="text-blue-200 text-xs">›</span>
                                    <div className="flex flex-col items-center gap-0.5">
                                      <span className="text-[8px] text-blue-400 font-bold tracking-widest">출항</span>
                                      {timeInput('depart', minutesToTime(boardMins), d => updateFerryBoardTime(dIdx, pIdx, d))}
                                    </div>
                                    <span className="text-blue-200 text-xs">›</span>
                                    <div className="flex flex-col items-center gap-0.5">
                                      <span className="text-[8px] text-blue-400 font-bold tracking-widest">소요</span>
                                      {sailInput}
                                    </div>
                                    <span className="text-blue-200 text-xs">›</span>
                                    <div className="flex flex-col items-center gap-0.5">
                                      <span className="text-[8px] text-blue-500 font-black tracking-widest">하선</span>
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
                              <div className="bg-indigo-50/70 rounded-xl border border-indigo-100 p-3">
                                <div className="grid grid-cols-2 divide-x divide-indigo-100">
                                  <div className="flex flex-col items-center gap-1 px-3">
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
                                  <div className="flex flex-col items-center gap-1 px-3">
                                    <span className="text-[9px] font-black tracking-widest text-indigo-400">체크아웃</span>
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
                                              <button onClick={(e) => { e.stopPropagation(); if (nextItem && nextItem.type !== 'backup') updateBufferTime(dIdx + 1, 0, -60); }} className="w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors"><ChevronUp size={11} /></button>
                                              <span className="min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-indigo-900">{String(isNaN(hour) ? 0 : hour).padStart(2, '0')}</span>
                                              <button onClick={(e) => { e.stopPropagation(); if (nextItem && nextItem.type !== 'backup') updateBufferTime(dIdx + 1, 0, 60); }} className="w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors"><ChevronDown size={11} /></button>
                                            </div>
                                            <span className="text-[16px] font-black text-indigo-900">:</span>
                                            <div className="flex flex-col items-center">
                                              <button onClick={(e) => { e.stopPropagation(); if (nextItem && nextItem.type !== 'backup') updateBufferTime(dIdx + 1, 0, -TIME_UNIT); }} className="w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors"><ChevronUp size={11} /></button>
                                              <span className="min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-indigo-900">{String(isNaN(minute) ? 0 : minute).padStart(2, '0')}</span>
                                              <button onClick={(e) => { e.stopPropagation(); if (nextItem && nextItem.type !== 'backup') updateBufferTime(dIdx + 1, 0, TIME_UNIT); }} className="w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors"><ChevronDown size={11} /></button>
                                            </div>
                                          </>
                                        );
                                      })()}
                                    </div>
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
                              {/* 1행: 카테고리 칩 + 오픈런 */}
                              <div className="flex items-center gap-2 flex-wrap">
                                {chips}
                                {!isRevisit && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 text-emerald-600 bg-emerald-50 border-emerald-200">NEW</span>
                                )}
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleRevisit(dIdx, pIdx); }}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 transition-colors ${isRevisit ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-slate-400 bg-white border-slate-200 hover:border-blue-200 hover:text-blue-600'}`}
                                  title="재방문 여부"
                                >
                                  재방문
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTagEditorTarget(prev =>
                                      prev?.dayIdx === dIdx && prev?.pIdx === pIdx ? null : { dayIdx: dIdx, pIdx }
                                    );
                                  }}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black border transition-colors ${tagEditorTarget?.dayIdx === dIdx && tagEditorTarget?.pIdx === pIdx ? 'bg-[#3182F6] text-white border-[#3182F6]' : 'bg-white text-slate-400 border-slate-200 hover:border-[#3182F6] hover:text-[#3182F6]'}`}
                                  title="추가 태그 편집"
                                >
                                  태그
                                </button>
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
                                  onClick={(e) => { e.stopPropagation(); const q = [p.activity, p.receipt?.address].filter(Boolean).join(' '); window.open(`https://map.naver.com/v5/search/${encodeURIComponent(q)}`, '_blank'); }}
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
                                    <MapPin size={12} className="text-[#3182F6] shrink-0" />
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
                              <div className="w-full bg-slate-50/60 border border-slate-200 rounded-lg p-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => setBusinessEditorTarget(prev => (prev?.dayIdx === dIdx && prev?.pIdx === pIdx ? null : { dayIdx: dIdx, pIdx }))}
                                  className="w-full flex items-center justify-between text-left"
                                >
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">영업 정보 (선택)</span>
                                  <span className="text-[10px] font-bold text-slate-500 truncate ml-2">{formatBusinessSummary(p.business)}</span>
                                </button>
                                {businessEditorTarget?.dayIdx === dIdx && businessEditorTarget?.pIdx === pIdx && (
                                  <>
                                    <p className="text-[9px] text-slate-400 font-semibold mt-1 mb-1.5">현재 일정 시간과 충돌하면 위에 빨간 경고가 표시됩니다.</p>
                                    <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                                      <input type="time" value={p.business?.open || ''} onChange={(e) => updatePlanBusinessField(dIdx, pIdx, 'open', e.target.value)} className="text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3182F6]" />
                                      <input type="time" value={p.business?.close || ''} onChange={(e) => updatePlanBusinessField(dIdx, pIdx, 'close', e.target.value)} className="text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3182F6]" />
                                      <input type="time" value={p.business?.breakStart || ''} onChange={(e) => updatePlanBusinessField(dIdx, pIdx, 'breakStart', e.target.value)} className="text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3182F6]" />
                                      <input type="time" value={p.business?.breakEnd || ''} onChange={(e) => updatePlanBusinessField(dIdx, pIdx, 'breakEnd', e.target.value)} className="text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3182F6]" />
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

                              {/* 플랜 B 목록 */}
                              <div className="mt-3 flex flex-col gap-2">
                                {p.alternatives?.map((alt, altIdx) => (
                                  <div
                                    key={altIdx}
                                    draggable
                                    onDragStart={(e) => { e.stopPropagation(); setDraggingFromTimeline({ dayIdx: dIdx, pIdx, altIdx }); e.dataTransfer.effectAllowed = 'move'; }}
                                    onDragEnd={() => setDraggingFromTimeline(null)}
                                    className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-sm transition-all"
                                  >
                                    <div className="px-3 py-2.5 flex flex-col gap-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-black text-white bg-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">{getPlanLabel(altIdx)}</span>
                                        <span className="text-[13px] font-black text-slate-800 truncate">{alt.activity}</span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const q = encodeURIComponent(alt.receipt?.address || alt.activity || '');
                                            window.open(`https://map.naver.com/v5/search/${q}`, '_blank');
                                          }}
                                          className="ml-auto p-1 text-slate-300 hover:text-[#3182F6] hover:bg-blue-50 rounded-md transition-colors"
                                          title="네이버 지도에서 보기"
                                        >
                                          <MapPin size={11} />
                                        </button>
                                      </div>
                                      {alt.memo && (
                                        <div className="text-[10px] font-medium text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-100 truncate">{alt.memo}</div>
                                      )}
                                    </div>
                                    <div className="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between">
                                      <span className="text-[13px] font-black text-[#3182F6]">₩{Number(alt.price || 0).toLocaleString()}</span>
                                      <div className="flex items-center gap-1.5">
                                        <button onClick={(e) => { e.stopPropagation(); swapAlternative(dIdx, pIdx, altIdx); }} className="text-[10px] bg-[#3182F6] text-white px-2.5 py-1 rounded-lg font-black hover:bg-blue-600 transition-colors">선택</button>
                                        <button onClick={(e) => { e.stopPropagation(); removeAlternative(dIdx, pIdx, altIdx); }} className="p-1 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
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

                      {/* 삭제 버튼 (hover 시 표시) */}
                      <button
                        onClick={(e) => { e.stopPropagation(); deletePlanItem(dIdx, pIdx); }}
                        className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all z-20"
                        title="일정 삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* 일차 마지막 아이템 아래 드롭 존 */}
                    {pIdx === d.plan.length - 1 && p.type !== 'backup' && (draggingFromLibrary || draggingFromTimeline?.altIdx !== undefined) && (() => {
                      const isDropHere = dropTarget?.dayIdx === dIdx && dropTarget?.insertAfterPIdx === pIdx;
                      return (
                        <div
                          className="relative w-full pt-3 -mb-3 z-10 cursor-copy"
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
                          <div className={`w-full flex items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed transition-all duration-150 text-[11px] font-black ${isDropHere ? 'h-12 border-[#3182F6] bg-blue-50 text-[#3182F6]' : 'h-8 border-slate-200 text-slate-300'}`}>
                            <Plus size={11} /> 이곳에 놓아주세요
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
                            return (
                              <div
                                className="z-10 w-full cursor-copy"
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
                                <div className={`w-full flex items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed transition-all duration-150 text-[11px] font-black ${isDropHere ? 'h-12 border-[#3182F6] bg-blue-50 text-[#3182F6]' : 'h-8 border-slate-200 text-slate-300'}`}>
                                  <Plus size={11} /> 이곳에 놓아주세요
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div className="z-10 flex items-center justify-center gap-2 w-full">
                              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm w-fit">
                                <div className="flex items-center gap-2 bg-slate-50 px-2 py-1.5 rounded-xl border border-slate-100">
                                  <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx + 1, -TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-blue-50 text-slate-500"><Minus size={10} /></button>
                                  <span
                                    className={`min-w-[3rem] text-center tracking-tight text-xs font-black ${nextItem.travelTimeAuto && nextItem.travelTimeOverride !== nextItem.travelTimeAuto ? 'text-[#3182F6] cursor-pointer hover:line-through' : 'text-slate-800'}`}
                                    onClick={(e) => { e.stopPropagation(); if (nextItem.travelTimeAuto && nextItem.travelTimeOverride !== nextItem.travelTimeAuto) resetTravelTime(dIdx, pIdx + 1); }}
                                    title={nextItem.travelTimeAuto && nextItem.travelTimeOverride !== nextItem.travelTimeAuto ? '클릭하여 경로 계산 시간으로 초기화' : undefined}
                                  >{nextItem.travelTimeOverride || '15분'}</span>
                                  <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx + 1, TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-blue-50 text-slate-500"><Plus size={10} /></button>
                                </div>
                                <button
                                  className="flex items-center gap-1.5 text-slate-400 text-xs font-bold px-1.5 hover:text-[#3182F6] transition-colors cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const INVALID = ['주소 정보 없음', '주소 미정', '장소 미정', ''];
                                    const fromAddr = (p.receipt?.address || p.activity || '').trim();
                                    const toAddr = (nextItem.receipt?.address || nextItem.activity || '').trim();
                                    const from = !INVALID.includes(fromAddr) ? fromAddr : p.activity;
                                    const to = !INVALID.includes(toAddr) ? toAddr : nextItem.activity;
                                    const seg = (s) => `-,-,${encodeURIComponent(s)},-,TEXT`;
                                    window.open(`https://map.naver.com/p/directions/${seg(from)}/${seg(to)}/-/car`, '_blank');
                                  }}
                                  title="네이버 지도로 이 구간 길찾기"
                                >
                                  <MapIcon size={12} /><span>{formatDistanceText(nextItem.distance)}</span>
                                </button>
                                {(() => {
                                  const rid = `${dIdx}_${pIdx + 1}`; const busy = calculatingRouteId === rid; return (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); autoCalculateRouteFor(dIdx, pIdx + 1); }}
                                      disabled={!!calculatingRouteId}
                                      className={`flex items-center gap-1 transition-colors border rounded-lg px-2 py-1.5 text-[10px] font-black shadow-sm ${busy ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white hover:bg-[#3182F6] hover:text-white text-slate-400 border-slate-200 hover:border-[#3182F6]'}`}
                                    >
                                      <Sparkles size={10} /> {busy ? '계산중' : '자동경로'}
                                    </button>);
                                })()}
                              </div>
                              <div className="flex items-center bg-white px-2 py-1.5 rounded-full border border-slate-200 shadow-sm w-fit">
                                <div className="flex items-center gap-2 bg-slate-50 px-2 py-1.5 rounded-xl border border-slate-100">
                                  <button onClick={(e) => { e.stopPropagation(); updateBufferTime(dIdx, pIdx + 1, -BUFFER_STEP); }} className="w-5 h-5 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-blue-50 text-slate-500"><Minus size={10} /></button>
                                  <span className="min-w-[3rem] text-center tracking-tight text-xs font-black text-slate-800">{nextItem.bufferTimeOverride || '10분'}</span>
                                  <button onClick={(e) => { e.stopPropagation(); updateBufferTime(dIdx, pIdx + 1, BUFFER_STEP); }} className="w-5 h-5 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-blue-50 text-slate-500"><Plus size={10} /></button>
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
        </div>

        <footer className="fixed bottom-0 left-0 left-[420px] right-0 bg-white/95 backdrop-blur-xl border-t px-8 py-5 flex items-center gap-5 z-[130] shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
          <MessageSquare size={20} className="text-[#3182F6]" />
          <p className="text-[13px] font-bold text-slate-600 truncate flex-1 animate-pulse">"{lastAction}"</p>
          {history.length > 0 && (
            <button onClick={handleUndo} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6] text-[11px] font-black transition-all shrink-0">
              <ChevronLeft size={12} /> 되돌리기
            </button>
          )}
          <button
            onClick={autoCalculateAllRoutes}
            disabled={isCalculatingAllRoutes || !!calculatingRouteId}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-black transition-all shrink-0 ${isCalculatingAllRoutes ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white border-slate-200 text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6]'}`}
          >
            <Sparkles size={12} /> {isCalculatingAllRoutes ? '탐색중...' : '전체 경로'}
          </button>
          <div className="bg-[#3182F6]/10 text-[#3182F6] px-3 py-1.5 rounded-lg border border-[#3182F6]/20 tracking-widest text-[9px] font-black uppercase">Active Agent v19.5</div>
        </footer>
      </div>

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
