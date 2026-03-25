import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { timeToMinutes, minutesToTime, extractTimesFromText, normalizeBusiness } from '../../utils/time.js';
import { WEEKDAY_OPTIONS, BUSINESS_PRESETS, DEFAULT_BUSINESS, EMPTY_BUSINESS } from '../../utils/constants.js';

export const TimeInput = ({ value, onChange, onFocus, onBlurExtra, className = '', title = '', placeholder = '', inputRef = null, onKeyDown }) => {
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
      draggable={false}
      data-no-drag="true"
      value={value}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={handleBlur}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      placeholder={placeholder}
      maxLength={5}
      title={title}
      className={className}
    />
  );
};
export const buildBusinessQuickEditSegments = (businessRaw = {}) => {
  const business = normalizeBusiness(businessRaw || {});
  const segments = [];
  if (business.open || business.close) segments.push({ fieldKey: 'open', label: `운영 ${business.open || '--:--'} - ${business.close || '--:--'}` });
  if (business.breakStart || business.breakEnd) segments.push({ fieldKey: 'breakStart', label: `휴식 ${business.breakStart || '--:--'} - ${business.breakEnd || '--:--'}` });
  if (business.lastOrder || business.entryClose) segments.push({ fieldKey: 'lastOrder', label: `마감 ${business.lastOrder || business.entryClose || '--:--'}` });
  if (business.closedDays?.length) segments.push({ fieldKey: 'closedDays', label: `휴무 : ${formatClosedDaysSummary(business.closedDays)}` });
  return segments;
};
// 영업 정보 공통 에디터 (내장소 수정 모달 / 일정 카드 / 새 장소 추가 공통)
export const BusinessHoursEditor = ({ business = {}, onChange, focusField = null }) => {
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
      data-no-drag="true"
      draggable={false}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
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


// 주소/장소 문자열을 카카오 API로 직접 조회
export const searchAddressFromPlaceName = async (keyword, regionHint = '', kakaoKey = KAKAO_API_KEY) => {
  const query = keyword.trim();
  if (!query) return { address: '', source: '', error: '' };
  const searchQuery = `${regionHint?.trim() || ''} ${query}`.trim();

  // 1) 카카오 주소 검색 API 우선
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
    } catch (_) {
      // next
    }
    // 2) 주소 검색 미검출 시 카카오 키워드 검색 1회
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
    } catch (_) {
      // noop
    }
  }

  return { address: '', source: '카카오', error: '카카오 주소 검색 결과 없음' };
};

export const DateRangePicker = ({ startDate, endDate, onStartChange, onEndChange, onClose }) => {
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


export const TIME_WHEEL_ITEM_HEIGHT = 28;

export const TimeWheelColumn = ({
  label = '',
  value = 0,
  values = [],
  onChange,
  onInteract,
  formatter = (next) => String(next).padStart(2, '0'),
  accentClass = 'text-slate-900',
  cyclic = false,
  onDragStateChange,
  liveOnDrag = false,
}) => {
  const EDGE_PAD_COUNT = cyclic ? 0 : 2;
  const listRef = React.useRef(null);
  const settleTimerRef = React.useRef(null);
  const isProgrammaticRef = React.useRef(false);
  const pointerDragRef = React.useRef({ active: false, pointerId: null, startY: 0, startTop: 0, accY: 0 });
  const touchDragRef = React.useRef({ active: false, startY: 0, startTop: 0 });
  const dragMovedRef = React.useRef(false);
  const lastEmittedValueRef = React.useRef(value);
  const [isDragging, setIsDragging] = React.useState(false);

  const renderedValues = React.useMemo(() => {
    if (!cyclic) return values;
    return [...values, ...values, ...values];
  }, [cyclic, values]);
  const renderedEntries = React.useMemo(() => {
    if (cyclic) return renderedValues;
    return [null, null, ...renderedValues, null, null];
  }, [cyclic, renderedValues]);

  React.useEffect(() => {
    lastEmittedValueRef.current = value;
  }, [value]);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (pointerDragRef.current.active || touchDragRef.current.active) return;
    const baseIndex = Math.max(0, values.indexOf(value));
    const currentIndex = cyclic ? (baseIndex + values.length) : (baseIndex + EDGE_PAD_COUNT);
    const targetTop = currentIndex * TIME_WHEEL_ITEM_HEIGHT;
    if (Math.abs(list.scrollTop - targetTop) < 2) return;
    isProgrammaticRef.current = true;
    // settle 타이머가 있으면 취소 — 프로그래매틱 스크롤 후 onChange 오발 방지
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    list.scrollTop = targetTop;
    setTimeout(() => {
      isProgrammaticRef.current = false;
    }, 150);
  }, [cyclic, value, values]);

  React.useEffect(() => () => {
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
  }, []);

  const getClosestValue = React.useCallback(() => {
    const list = listRef.current;
    if (!list || !values.length) return null;
    const renderedLength = renderedEntries.length;
    if (!renderedLength) return null;
    const rawIndex = Math.max(0, Math.min(renderedLength - 1, Math.round(list.scrollTop / TIME_WHEEL_ITEM_HEIGHT)));
    const normalizedIndex = cyclic
      ? ((rawIndex % values.length) + values.length) % values.length
      : (rawIndex - EDGE_PAD_COUNT);
    const nextIndex = Math.max(0, Math.min(values.length - 1, normalizedIndex));
    return values[nextIndex];
  }, [EDGE_PAD_COUNT, cyclic, renderedEntries.length, values]);

  const commitClosestValue = React.useCallback(() => {
    const list = listRef.current;
    if (!list || !values.length) return;
    const renderedLength = renderedEntries.length;
    if (!renderedLength) return;
    const hasZeroPriority = !cyclic && values[0] === 0;
    if (hasZeroPriority) {
      const zeroPriorityCutoff = (EDGE_PAD_COUNT + 1) * TIME_WHEEL_ITEM_HEIGHT;
      if (list.scrollTop <= zeroPriorityCutoff) {
        const centerIndex = EDGE_PAD_COUNT;
        const targetTop = centerIndex * TIME_WHEEL_ITEM_HEIGHT;
        if (Math.abs(list.scrollTop - targetTop) > 1) {
          isProgrammaticRef.current = true;
          list.scrollTo({ top: targetTop, behavior: 'smooth' });
          setTimeout(() => {
            isProgrammaticRef.current = false;
          }, 140);
        }
        lastEmittedValueRef.current = values[0];
        onChange?.(values[0]);
        return;
      }
    }
    const rawIndex = Math.max(0, Math.min(renderedLength - 1, Math.round(list.scrollTop / TIME_WHEEL_ITEM_HEIGHT)));
    const normalizedIndex = cyclic
      ? ((rawIndex % values.length) + values.length) % values.length
      : (rawIndex - EDGE_PAD_COUNT);
    let nextIndex = Math.max(0, Math.min(values.length - 1, normalizedIndex));
    const centerIndex = cyclic ? (nextIndex + values.length) : (nextIndex + EDGE_PAD_COUNT);
    const targetTop = centerIndex * TIME_WHEEL_ITEM_HEIGHT;
    if (Math.abs(list.scrollTop - targetTop) > 1) {
      isProgrammaticRef.current = true;
      list.scrollTo({ top: targetTop, behavior: 'smooth' });
      setTimeout(() => {
        isProgrammaticRef.current = false;
      }, 140);
    }
    lastEmittedValueRef.current = values[nextIndex];
    onChange?.(values[nextIndex]);
  }, [EDGE_PAD_COUNT, cyclic, onChange, renderedEntries.length, value, values]);

  const commitSpecificValue = React.useCallback((nextValue) => {
    if (!values.length) return;
    const list = listRef.current;
    const baseIndex = Math.max(0, values.indexOf(nextValue));
    const centerIndex = cyclic ? (baseIndex + values.length) : (baseIndex + EDGE_PAD_COUNT);
    const targetTop = centerIndex * TIME_WHEEL_ITEM_HEIGHT;
    if (list) {
      isProgrammaticRef.current = true;
      list.scrollTo({ top: targetTop, behavior: 'smooth' });
      setTimeout(() => {
        isProgrammaticRef.current = false;
      }, 140);
    }
    lastEmittedValueRef.current = nextValue;
    onChange?.(nextValue);
  }, [EDGE_PAD_COUNT, cyclic, onChange, values]);

  const handleScroll = React.useCallback(() => {
    if (pointerDragRef.current.active) return;
    if (isProgrammaticRef.current) return;
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    settleTimerRef.current = setTimeout(commitClosestValue, 90);
  }, [commitClosestValue]);

  const handlePointerDown = React.useCallback((e) => {
    if (e.pointerType === 'touch') return;
    const list = listRef.current;
    if (!list) return;
    onInteract?.();
    dragMovedRef.current = false;
    pointerDragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startY: e.clientY,
      startTop: list.scrollTop,
      accY: 0,
    };
    try {
      list.setPointerCapture(e.pointerId);
    } catch {
      // no-op
    }
    onDragStateChange?.(true);
    setIsDragging(true);
    e.stopPropagation();
  }, [onDragStateChange, onInteract]);

  const handlePointerMove = React.useCallback((e) => {
    if (e.pointerType === 'touch') return;
    const list = listRef.current;
    const state = pointerDragRef.current;
    if (!list || !state.active || state.pointerId !== e.pointerId) return;
    onInteract?.();
    // movementY는 OS 마우스 가속도 무관한 실제 물리 이동량
    state.accY += e.movementY;
    if (Math.abs(state.accY) >= 2) dragMovedRef.current = true;
    list.scrollTop = state.startTop - state.accY;
    if (liveOnDrag) {
      const nextValue = getClosestValue();
      if (nextValue !== null && nextValue !== lastEmittedValueRef.current) {
        lastEmittedValueRef.current = nextValue;
        onChange?.(nextValue);
      }
    }
    e.preventDefault();
    e.stopPropagation();
  }, [getClosestValue, liveOnDrag, onChange, onInteract]);

  const handlePointerUp = React.useCallback((e) => {
    if (e.pointerType === 'touch') return;
    const list = listRef.current;
    const state = pointerDragRef.current;
    if (!list || !state.active || state.pointerId !== e.pointerId) return;
    onInteract?.();
    pointerDragRef.current = { active: false, pointerId: null, startY: 0, startTop: 0, accY: 0 };
    try {
      list.releasePointerCapture(e.pointerId);
    } catch {
      // no-op
    }
    onDragStateChange?.(false);
    setIsDragging(false);
    commitClosestValue();
    e.stopPropagation();
  }, [commitClosestValue, onDragStateChange, onInteract]);

  const handleTouchStart = React.useCallback((e) => {
    const list = listRef.current;
    if (!list) return;
    const touch = e.touches?.[0];
    if (!touch) return;
    onInteract?.();
    dragMovedRef.current = false;
    touchDragRef.current = {
      active: true,
      startY: touch.clientY,
      startTop: list.scrollTop,
    };
    onDragStateChange?.(true);
    setIsDragging(true);
    e.stopPropagation();
  }, [onDragStateChange, onInteract]);

  const handleTouchMove = React.useCallback((e) => {
    const list = listRef.current;
    const state = touchDragRef.current;
    if (!list || !state.active) return;
    const touch = e.touches?.[0];
    if (!touch) return;
    onInteract?.();
    const deltaY = touch.clientY - state.startY;
    if (Math.abs(deltaY) >= 2) dragMovedRef.current = true;
    list.scrollTop = state.startTop - deltaY;
    if (liveOnDrag && !touchDragRef.current.active) {
      const nextValue = getClosestValue();
      if (nextValue !== null && nextValue !== lastEmittedValueRef.current) {
        lastEmittedValueRef.current = nextValue;
        onChange?.(nextValue);
      }
    }
    e.preventDefault();
    e.stopPropagation();
  }, [getClosestValue, liveOnDrag, onChange, onInteract]);

  const handleTouchEnd = React.useCallback((e) => {
    if (!touchDragRef.current.active) return;
    onInteract?.();
    touchDragRef.current = { active: false, startY: 0, startTop: 0 };
    onDragStateChange?.(false);
    setIsDragging(false);
    commitClosestValue();
    e.stopPropagation();
  }, [commitClosestValue, onDragStateChange, onInteract]);

  React.useEffect(() => {
    const onWindowPointerMove = (e) => handlePointerMove(e);
    const onWindowPointerUp = (e) => handlePointerUp(e);
    window.addEventListener('pointermove', onWindowPointerMove, { passive: false });
    window.addEventListener('pointerup', onWindowPointerUp, { passive: true });
    window.addEventListener('pointercancel', onWindowPointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return (
    <div
      data-no-drag="true"
      draggable={false}
      className="flex-1 min-w-0 touch-none select-none"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {label ? <p className="mb-0.5 text-center text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p> : null}
      <div className="relative rounded-[18px] border border-slate-200 bg-white/92">
        <div className="pointer-events-none absolute inset-x-1.5 top-1/2 h-[28px] -translate-y-1/2 rounded-[10px] border border-slate-300 bg-slate-100 shadow-[0_8px_18px_-16px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.95)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-5 rounded-t-[18px] bg-gradient-to-b from-white via-white/88 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 rounded-b-[18px] bg-gradient-to-t from-white via-white/88 to-transparent" />
        <div
          ref={listRef}
          onScroll={handleScroll}
          className={`relative h-[84px] overflow-y-auto no-scrollbar py-[28px] touch-pan-y ${isDragging ? 'snap-none' : 'snap-y snap-mandatory'}`}
        >
          {renderedEntries.map((entry, idx) => {
            if (entry === null) {
              return <div key={`${label}-pad-${idx}`} className="h-[28px] snap-start" aria-hidden="true" />;
            }
            const active = entry === value;
            return (
              <button
                key={`${label}-${entry}-${idx}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (dragMovedRef.current) return;
                  onInteract?.();
                  commitSpecificValue(entry);
                }}
                className={`flex h-[28px] w-full snap-start items-center justify-center text-[18px] font-black tabular-nums ${isDragging ? 'transition-none' : 'transition-all'} ${active ? `${accentClass} scale-100` : 'scale-[0.9] text-slate-300/90'}`}
              >
                {formatter(entry)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
