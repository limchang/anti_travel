import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Pane, Polyline, Popup, TileLayer, Tooltip, Circle, useMap, useMapEvents } from 'react-leaflet';
import { ChevronDown, ChevronUp, Plus, Minus, Pencil, X, Eye, RotateCcw, MapPin, Sparkles, LoaderCircle, Anchor, GripVertical, Map as MapIcon, Utensils, Coffee, Navigation } from 'lucide-react';
import { safeLocalStorageGet, safeLocalStorageSet } from '../../utils/storage.js';
import { normalizeGeoPoint, hasGeoCoords } from '../../utils/geo.js';
import { TAG_OPTIONS, MODIFIER_TAGS, getPreferredMapCategory, normalizeTagOrder, toggleTagSelection, getTagButtonClass, KAKAO_API_KEY } from '../../utils/constants.js';
import { timeToMinutes } from '../../utils/time.js';

export const loadKakaoMapSdk = (() => {
  let sdkPromise = null;
  return (appKey) => {
    if (typeof window === 'undefined') return Promise.reject(new Error('window unavailable'));
    if (window.kakao?.maps?.load && window.kakao?.maps?.services) {
      return new Promise((resolve) => {
        window.kakao.maps.load(() => resolve(window.kakao));
      });
    }
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&libraries=services&appkey=${appKey}`;
      script.async = true;
      script.onload = () => {
        if (!window.kakao?.maps?.load) {
          sdkPromise = null;
          reject(new Error('kakao maps unavailable'));
          return;
        }
        window.kakao.maps.load(() => resolve(window.kakao));
      };
      script.onerror = () => {
        sdkPromise = null;
        reject(new Error('kakao maps script failed'));
      };
      document.head.appendChild(script);
    });
    return sdkPromise;
  };
})();

export const ROUTE_PREVIEW_DEFAULT_CENTER = (() => {
  try {
    const raw = localStorage.getItem('last_map_center');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 2 && isFinite(parsed[0]) && isFinite(parsed[1])) return parsed;
    }
  } catch {}
  return [37.5665, 126.9780]; // 서울 시청 (폴백)
})();
export const toLeafletLatLng = (point) => {
  const rawLat = point?.lat;
  const rawLon = point?.lon;
  if (rawLat === '' || rawLat === null || rawLat === undefined) return null;
  if (rawLon === '' || rawLon === null || rawLon === undefined) return null;

  let lat = Number(rawLat);
  let lon = Number(rawLon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat === 0 && lon === 0) return null;

  if (Math.abs(lat) > 90 && Math.abs(lon) <= 90) {
    const temp = lat;
    lat = lon;
    lon = temp;
  } else if (Math.abs(lat) > 90) {
    return null;
  }

  return [lat, lon];
};

export const getMapCategoryColor = (type = 'place') => {
  switch (type) {
    case 'food': return '#F43F5E';
    case 'cafe': return '#D97706';
    case 'tour': return '#8B5CF6';
    case 'lodge': return '#4F46E5';
    case 'stay': return '#7C3AED';
    case 'rest': return '#06B6D4';
    case 'ship': return '#2563EB';
    case 'openrun': return '#EF4444';
    case 'view': return '#0EA5E9';
    case 'experience': return '#10B981';
    case 'souvenir': return '#14B8A6';
    case 'snack': return '#CA8A04';
    case 'pickup': return '#F97316';
    case 'home': return '#B45309';
    default: return '#64748B';
  }
};

export const getMapCategoryLabel = (type = 'place') => {
  const found = TAG_OPTIONS.find((tag) => tag.value === type);
  return found?.label || '장소';
};
// Lucide 스타일 선형 아이콘 (stroke white, viewBox 0 0 24 24)
const _s = 'stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"';
const MAP_CATEGORY_ICON = {
  food: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" ${_s}/>`,
  cafe: `<path d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 2v4M10 2v4M14 2v4" ${_s}/>`,
  tour: `<path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z" ${_s}/><circle cx="12" cy="13" r="3" ${_s}/>`,
  lodge: `<path d="M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8v9" ${_s}/>`,
  stay: `<path d="M12 3a6 6 0 019 9 9 9 0 11-9-9z" ${_s}/>`,
  ship: `<path d="M2 20a7 7 0 0010 0 7 7 0 0010 0M4 18l2-6h12l2 6M12 2v10M8 6h8" ${_s}/>`,
  rest: `<path d="M18 2H6v7a6 6 0 0012 0V2zM6 2H2M22 2h-4M9 22h6M12 15v7" ${_s}/>`,
  pickup: `<path d="M21 8l-2-4H5L3 8M3 8v10a1 1 0 001 1h1M3 8h18M21 8v10a1 1 0 01-1 1h-1M7.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" ${_s}/>`,
  openrun: `<circle cx="12" cy="12" r="10" ${_s}/><path d="M12 6v6l4 2" ${_s}/>`,
  view: `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" ${_s}/><circle cx="12" cy="12" r="3" ${_s}/>`,
  experience: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" ${_s}/>`,
  souvenir: `<path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" ${_s}/>`,
  snack: `<path d="M15 11h.01M11 15h.01M16 16s1.5-2 1.5-3.5S16 9 16 9M2 16l20 6-6-20L8 8z" ${_s}/>`,
  home: `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" ${_s}/><path d="M9 22V12h6v10" ${_s}/>`,
  place: `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" ${_s}/><circle cx="12" cy="10" r="3" ${_s}/>`,
  quick: `<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" ${_s}/>`,
};
export const MAP_CATEGORY_EMOJI = MAP_CATEGORY_ICON; // 하위 호환
export const getMapCategoryEmoji = (type = 'place') => MAP_CATEGORY_ICON[type] || MAP_CATEGORY_ICON.place;

export const buildTimelineMarkerIcon = (dayColor, label, isFocused, categoryColor = '#FFFFFF', categoryLabel = '', isFirst = false, isLast = false, extraTailH = 0, placeName = '', showName = false) => {
  const sz = isFocused ? 36 : 28;
  const tailW = isFocused ? 6 : 5;
  const tailH = (isFocused ? 7 : 6) + extraTailH;
  const radius = isFocused ? 4 : 3;
  const badgeText = isFirst ? 'START' : (isLast ? 'END' : '');
  const badgeColor = isFirst ? '#10B981' : '#EF4444';
  const badgeH = badgeText ? 14 : 0;
  const shadow = isFocused
    ? 'drop-shadow(0 5px 14px rgba(15,23,42,0.45))'
    : 'drop-shadow(0 3px 8px rgba(15,23,42,0.32))';

  // 이름 표시 모드: 숫자 옆에 이름을 가로로 (내장소와 동일)
  if (showName && placeName) {
    const nameMaxW = isFocused ? 120 : 90;
    const pillH = sz;
    const totalH = badgeH + (badgeH ? 2 : 0) + pillH + tailH;
    const totalW = sz + nameMaxW;
    return L.divIcon({
      className: '',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:${shadow};">
          ${badgeText ? `<div style="margin-bottom:2px;padding:0 5px;height:${badgeH}px;border-radius:999px;background:${badgeColor};color:#fff;font-size:7px;font-weight:900;line-height:${badgeH}px;white-space:nowrap;letter-spacing:0.06em;">${badgeText}</div>` : ''}
          <div style="display:flex;align-items:center;border-radius:${radius}px;border:${isFocused ? '2.5px' : '2px'} solid rgba(255,255,255,0.9);box-shadow:0 0 0 1.5px ${dayColor};overflow:hidden;background:#fff;">
            <div style="width:${sz}px;height:${pillH}px;background:${dayColor};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="font-size:${isFocused ? '16px' : '13px'};font-weight:900;color:#fff;line-height:1;letter-spacing:-0.5px;text-shadow:0 1px 3px rgba(0,0,0,0.25);">${label}</span>
            </div>
            <div style="padding:0 6px;max-width:${nameMaxW}px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:${isFocused ? '12px' : '10px'};font-weight:900;color:#334155;line-height:${pillH}px;">
              ${placeName}
            </div>
          </div>
          <div style="width:0;height:0;border-left:${tailW}px solid transparent;border-right:${tailW}px solid transparent;border-top:${tailH}px solid ${dayColor};margin-top:-1px;"></div>
        </div>
      `,
      iconSize: [totalW, totalH],
      iconAnchor: [sz / 2, totalH],
    });
  }

  // 기본: 숫자만
  const totalH = badgeH + (badgeH ? 2 : 0) + sz + tailH;
  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:${shadow};">
        ${badgeText ? `<div style="margin-bottom:2px;padding:0 5px;height:${badgeH}px;border-radius:999px;background:${badgeColor};color:#fff;font-size:7px;font-weight:900;line-height:${badgeH}px;white-space:nowrap;letter-spacing:0.06em;">${badgeText}</div>` : ''}
        <div style="width:${sz}px;height:${sz}px;border-radius:${radius}px;background:${dayColor};border:${isFocused ? '2.5px' : '2px'} solid rgba(255,255,255,0.9);box-shadow:0 0 0 1.5px ${dayColor};display:flex;align-items:center;justify-content:center;">
          <span style="font-size:${isFocused ? '16px' : '13px'};font-weight:900;color:#fff;line-height:1;letter-spacing:-0.5px;text-shadow:0 1px 3px rgba(0,0,0,0.25);">${label}</span>
        </div>
        ${extraTailH > 0 ? `<div style="display:flex;flex-direction:column;align-items:center;margin-top:-1px;"><div style="width:${tailW-1}px;height:${extraTailH}px;background:${dayColor};"></div><div style="width:0;height:0;border-left:${tailW}px solid transparent;border-right:${tailW}px solid transparent;border-top:${isFocused?7:6}px solid ${dayColor};"></div></div>` : `<div style="width:0;height:0;border-left:${tailW}px solid transparent;border-right:${tailW}px solid transparent;border-top:${tailH}px solid ${dayColor};margin-top:-1px;"></div>`}
      </div>
    `,
    iconSize: [sz, totalH],
    iconAnchor: [sz / 2, totalH],
  });
};

// 같은 위치 타임라인 마커 그룹 (예: 6 | 7)
export const buildGroupedTimelineMarkerIcon = (items, isFocused, showName = false, showAddButton = false) => {
  const n = items.length;
  const sz = isFocused ? 36 : 28;
  const radius = isFocused ? 4 : 3;
  const tailH = isFocused ? 7 : 6;
  const tailW = isFocused ? 6 : 5;
  const shadow = isFocused
    ? 'drop-shadow(0 5px 14px rgba(15,23,42,0.45))'
    : 'drop-shadow(0 3px 8px rgba(15,23,42,0.32))';

  // 이름 표시 모드: 하나의 카드 안에 행을 쌓기
  if (showName) {
    const nameMaxW = isFocused ? 120 : 90;
    const addBtnSz = isFocused ? 20 : 16;
    const hasAnyAdd = showAddButton && items.some(it => it._isOverlay);
    const addColW = hasAnyAdd ? (addBtnSz + 8) : 0;
    const rowH = sz; // 아이콘 정사각형 유지
    const totalCardH = n * rowH;
    const totalH = totalCardH + tailH;
    const totalW = sz + nameMaxW + addColW;
    const tailColor = items[items.length - 1]?.color || items[0].color;

    const rows = items.map((item, i) => {
      const label = item.label || item.order;
      const isLast = i === n - 1;
      const isOverlay = !!item._isOverlay;
      const iconContent = isOverlay
        ? `<svg width="${isFocused ? 16 : 13}" height="${isFocused ? 16 : 13}" viewBox="0 0 24 24" fill="none" style="filter:drop-shadow(1px 1px 1px rgba(0,0,0,0.5));">${getMapCategoryEmoji(item.primaryType || item.categoryLabel || '')}</svg>`
        : `<span style="font-size:${isFocused ? '14px' : '11px'};font-weight:900;color:#fff;line-height:1;text-shadow:0 1px 3px rgba(0,0,0,0.25);">${item.order}</span>`;
      const addBtn = (hasAnyAdd && isOverlay) ? `
        <div data-group-idx="${i}" data-library-add="true" style="width:${addColW}px;height:${rowH}px;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;">
          <div style="width:${addBtnSz}px;height:${addBtnSz}px;border-radius:${addBtnSz}px;background:rgba(49,130,246,0.12);display:flex;align-items:center;justify-content:center;">
            <svg width="${isFocused ? 11 : 9}" height="${isFocused ? 11 : 9}" viewBox="0 0 24 24" fill="none" stroke="#3182F6" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
        </div>` : (hasAnyAdd ? `<div style="width:${addColW}px;height:${rowH}px;flex-shrink:0;"></div>` : '');
      return `
        <div data-group-idx="${i}" style="display:flex;align-items:center;height:${rowH}px;${!isLast ? `border-bottom:1px solid rgba(0,0,0,0.06);` : ''}">
          <div style="width:${sz}px;height:${rowH}px;background:${item.color};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${iconContent}
          </div>
          <div style="padding:0 6px;max-width:${nameMaxW}px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:${isFocused ? '11px' : '10px'};font-weight:900;color:#334155;line-height:${rowH}px;flex:1;">
            ${label}
          </div>
          ${addBtn}
        </div>`;
    }).join('');

    return L.divIcon({
      className: '',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:${shadow};">
          <div style="border-radius:${radius}px;border:${isFocused ? '2.5px' : '2px'} solid rgba(255,255,255,0.9);box-shadow:0 0 0 1.5px ${tailColor};overflow:hidden;background:#fff;">
            ${rows}
          </div>
          <div style="width:0;height:0;border-left:${tailW}px solid transparent;border-right:${tailW}px solid transparent;border-top:${tailH}px solid ${tailColor};margin-top:-1px;"></div>
        </div>
      `,
      iconSize: [totalW, totalH],
      iconAnchor: [totalW / 2, totalH],
    });
  }

  // 기본: 숫자만 가로로 합치기
  const cellW = isFocused ? 32 : 26;
  const h = sz;
  const gapW = 3;
  const totalW = cellW * n + gapW * (n - 1) + 6;
  const totalH = h + tailH + 4;

  const cells = items.map((item, i) => {
    return `
      <div data-group-idx="${i}" style="
        width:${cellW}px;height:${h}px;border-radius:${radius}px;
        background:${item.color};
        display:flex;align-items:center;justify-content:center;
        cursor:pointer;
        ${i > 0 ? `margin-left:${gapW}px;` : ''}
      ">
        <span style="font-size:${isFocused?'15px':'12px'};font-weight:900;color:#fff;line-height:1;text-shadow:0 1px 3px rgba(0,0,0,0.25);">${item.order}</span>
      </div>`;
  }).join('');

  const tailColor = items[Math.floor(n / 2)]?.color || items[0].color;

  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:${shadow};">
        <div style="display:flex;align-items:center;border-radius:${radius + 2}px;border:${isFocused?'2.5px':'2px'} solid rgba(255,255,255,0.9);box-shadow:0 0 0 1.5px ${tailColor};padding:2px;background:rgba(255,255,255,0.9);">
          ${cells}
        </div>
        <div style="width:0;height:0;border-left:${isFocused?6:5}px solid transparent;border-right:${isFocused?6:5}px solid transparent;border-top:${tailH}px solid ${tailColor};margin-top:-1px;"></div>
      </div>
    `,
    iconSize: [totalW, totalH],
    iconAnchor: [totalW / 2, totalH],
  });
};

export const buildLibraryMarkerIcon = (categoryColor, categoryLabel, isFocused, _canAdd = false, _extraTailH = 0, _timelineFocused = false, clusterCount = 0, clusterColors = [], categoryType = '', clusterTypes = [], placeName = '', clusterNames = [], showName = false, starred = false, showAddButton = false) => {
  const isCluster = clusterCount > 1;
  const sz = isFocused ? 36 : 28;
  const shadow = isFocused
    ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.35))'
    : 'drop-shadow(0 2px 5px rgba(15,23,42,0.22))';
  const borderStyle = isFocused ? `2px solid rgba(255,255,255,0.95)` : `2px solid rgba(255,255,255,0.85)`;
  const radius = isFocused ? '10px' : '8px';

  if (isCluster) {
    const cRadius = isFocused ? 10 : 8;
    const tailH = isFocused ? 7 : 6;
    const tailW = isFocused ? 6 : 5;
    const colors = clusterColors.length ? clusterColors : [categoryColor];
    const types = clusterTypes.length ? clusterTypes : [categoryType || categoryLabel];
    const names = clusterNames.length ? clusterNames : [];
    const tailColor = colors[0] || categoryColor;

    // 이름 표시 모드: 일정 그룹과 동일한 카드 스택
    if (showName) {
      const nameMaxW = isFocused ? 120 : 90;
      const rowH = sz; // 아이콘 정사각형 유지
      const clusterIconSz = isFocused ? 14 : 11;
      const visibleN = Math.min(clusterCount, 5);
      const hasOverflow = clusterCount > 5;
      const addBtnSzC = isFocused ? 20 : 16;
      const addColWC = showAddButton ? (addBtnSzC + 8) : 0;
      const totalCardH = (visibleN + (hasOverflow ? 1 : 0)) * rowH;
      const totalH = totalCardH + tailH;
      const totalW = sz + nameMaxW + addColWC;
      const rows = Array.from({ length: visibleN }, (_, i) => {
        const color = colors[i] || colors[colors.length - 1] || categoryColor;
        const type = types[i] || categoryType || categoryLabel;
        const name = names[i] || '';
        const svgIcon = getMapCategoryEmoji(type);
        const isLast = !hasOverflow && i === visibleN - 1;
        const addBtn = showAddButton ? `
          <div data-cluster-idx="${i}" data-library-add="true" style="width:${addColWC}px;height:${rowH}px;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;">
            <div style="width:${addBtnSzC}px;height:${addBtnSzC}px;border-radius:${addBtnSzC}px;background:rgba(49,130,246,0.12);display:flex;align-items:center;justify-content:center;">
              <svg width="${isFocused ? 11 : 9}" height="${isFocused ? 11 : 9}" viewBox="0 0 24 24" fill="none" stroke="#3182F6" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
          </div>` : '';
        return `
          <div data-cluster-idx="${i}" style="display:flex;align-items:center;height:${rowH}px;cursor:pointer;${!isLast ? `border-bottom:1px solid rgba(0,0,0,0.06);` : ''}">
            <div style="width:${sz}px;height:${rowH}px;background:${color};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg width="${clusterIconSz}" height="${clusterIconSz}" viewBox="0 0 24 24" fill="none" style="filter:drop-shadow(1px 1px 1px rgba(0,0,0,0.5));">${svgIcon}</svg>
            </div>
            <div style="padding:0 6px;max-width:${nameMaxW}px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:${isFocused ? '11px' : '10px'};font-weight:900;color:#334155;line-height:${rowH}px;flex:1;">
              ${name || type}
            </div>
            ${addBtn}
          </div>`;
      }).join('');

      const overflowRow = hasOverflow ? `
        <div style="display:flex;align-items:center;height:${rowH}px;cursor:pointer;">
          <div style="width:${sz}px;height:${rowH}px;background:#475569;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <span style="font-size:${isFocused ? '11px' : '9px'};font-weight:900;color:#fff;">+${clusterCount - visibleN}</span>
          </div>
          <div style="padding:0 6px;font-size:${isFocused ? '10px' : '9px'};font-weight:700;color:#94A3B8;line-height:${rowH}px;">
            외 ${clusterCount - visibleN}곳
          </div>
        </div>` : '';

      return L.divIcon({
        className: '',
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:${shadow};">
            <div style="border-radius:${cRadius}px;border:${isFocused ? '2.5px' : '2px'} solid rgba(255,255,255,0.9);box-shadow:0 0 0 1.5px ${tailColor};overflow:hidden;background:#fff;">
              ${rows}${overflowRow}
            </div>
            <div style="width:0;height:0;border-left:${tailW}px solid transparent;border-right:${tailW}px solid transparent;border-top:${tailH}px solid ${tailColor};margin-top:-1px;"></div>
          </div>
        `,
        iconSize: [totalW, totalH],
        iconAnchor: [totalW / 2, totalH],
      });
    }

    // 기본: 아이콘만 가로로
    const showAll = clusterCount <= 3;
    const visibleN = showAll ? clusterCount : 3;
    const cellW = isFocused ? 32 : 26;
    const h = isFocused ? 36 : 28;
    const dividerW = 1;
    const totalW = cellW * visibleN + dividerW * (visibleN - 1);
    const totalH = h + tailH;
    const clusterIconSz = isFocused ? 16 : 13;
    const cells = Array.from({ length: visibleN }, (_, i) => {
      const isFirst = i === 0;
      const isLast = i === visibleN - 1;
      const isOverflow = !showAll && isLast;
      const color = isOverflow ? '#475569' : (colors[i] || colors[colors.length - 1] || categoryColor);
      const cellSvg = isOverflow ? '' : getMapCategoryEmoji(types[i] || categoryType || categoryLabel);
      const cellContent = isOverflow
        ? `<span style="font-size:${isFocused?'11px':'9px'};font-weight:900;color:#fff;line-height:1;">+${clusterCount - 2}</span>`
        : `<svg width="${clusterIconSz}" height="${clusterIconSz}" viewBox="0 0 24 24" fill="none" style="filter:drop-shadow(1px 1px 1px rgba(0,0,0,0.5)) drop-shadow(0 0 2px rgba(0,0,0,0.25));">${cellSvg}</svg>`;
      const br = `border-radius:${isFirst ? `${cRadius}px 0 0 ${cRadius}px` : isLast ? `0 ${cRadius}px ${cRadius}px 0` : '0'};`;
      return `<div data-cluster-idx="${i}" data-cluster-overflow="${isOverflow}" style="width:${cellW}px;height:${h}px;${br}background:${color};display:flex;align-items:center;justify-content:center;cursor:pointer;${i > 0 ? `border-left:${dividerW}px solid rgba(255,255,255,0.5);` : ''}">
        ${cellContent}
      </div>`;
    }).join('');
    return L.divIcon({
      className: '',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:${shadow};">
          <div style="display:flex;border-radius:${cRadius}px;border:${isFocused?'2.5px':'2px'} solid rgba(255,255,255,0.9);overflow:hidden;box-shadow:0 0 0 1.5px ${tailColor};">
            ${cells}
          </div>
          <div style="width:0;height:0;border-left:${isFocused?6:5}px solid transparent;border-right:${isFocused?6:5}px solid transparent;border-top:${tailH}px solid ${tailColor};margin-top:-1px;"></div>
        </div>
      `,
      iconSize: [totalW, totalH],
      iconAnchor: [totalW / 2, totalH],
    });
  }

  const svgIcon = getMapCategoryEmoji(categoryType || categoryLabel);
  const iconSz = isFocused ? 18 : 14;
  const tailW = isFocused ? 6 : 5;
  const tailH = isFocused ? 7 : 6;
  const starBadge = starred ? `<div style="position:absolute;top:-4px;left:-4px;width:16px;height:16px;background:#FBBF24;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;z-index:1;box-shadow:0 1px 3px rgba(0,0,0,0.3);"><svg width="9" height="9" viewBox="0 0 24 24" fill="#fff" stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg></div>` : '';

  // showName 모드: 아이콘 + 이름을 가로로 표시
  const displayName = placeName || '';
  if (showName && displayName && !isCluster) {
    const nameMaxW = isFocused ? 120 : 90;
    const addBtnSz = isFocused ? 20 : 16;
    const addColW = showAddButton ? (addBtnSz + 8) : 0;
    const pillH = sz;
    const totalH = pillH + tailH;
    const totalW = sz + nameMaxW + addColW;
    const addBtnHtml = showAddButton ? `
      <div data-library-add="true" style="width:${addColW}px;height:${pillH}px;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;">
        <div style="width:${addBtnSz}px;height:${addBtnSz}px;border-radius:${addBtnSz}px;background:rgba(49,130,246,0.12);display:flex;align-items:center;justify-content:center;">
          <svg width="${isFocused ? 11 : 9}" height="${isFocused ? 11 : 9}" viewBox="0 0 24 24" fill="none" stroke="#3182F6" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </div>
      </div>` : '';
    return L.divIcon({
      className: '',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:${shadow};">
          <div style="position:relative;border-radius:${radius};border:${borderStyle};box-shadow:0 0 0 1.5px ${categoryColor};overflow:visible;background:#fff;">
            ${starBadge}
            <div style="display:flex;align-items:center;border-radius:calc(${radius} - 2px);overflow:hidden;">
              <div style="width:${sz}px;height:${pillH}px;background:${categoryColor};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <svg width="${iconSz}" height="${iconSz}" viewBox="0 0 24 24" fill="none" style="filter:drop-shadow(1px 1px 1px rgba(0,0,0,0.5)) drop-shadow(0 0 2px rgba(0,0,0,0.25));">${svgIcon}</svg>
              </div>
              <div style="padding:0 6px;max-width:${nameMaxW}px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:${isFocused ? '12px' : '10px'};font-weight:900;color:#334155;line-height:${pillH}px;flex:1;">
                ${displayName}
              </div>
              ${addBtnHtml}
            </div>
          </div>
          <div style="width:0;height:0;border-left:${tailW}px solid transparent;border-right:${tailW}px solid transparent;border-top:${tailH}px solid ${categoryColor};margin-top:-1px;"></div>
        </div>
      `,
      iconSize: [totalW, totalH],
      iconAnchor: [sz / 2, totalH],
    });
  }

  const totalH = sz + tailH;
  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:${shadow};">
        <div style="position:relative;
          width:${sz}px;height:${sz}px;border-radius:${radius};
          background:${categoryColor};border:${borderStyle};
          box-shadow:0 0 0 1.5px ${categoryColor};
          display:flex;align-items:center;justify-content:center;overflow:visible;
        ">
          ${starBadge}
          <svg width="${iconSz}" height="${iconSz}" viewBox="0 0 24 24" fill="none" style="filter:drop-shadow(1px 1px 1px rgba(0,0,0,0.5)) drop-shadow(0 0 2px rgba(0,0,0,0.25));">${svgIcon}</svg>
        </div>
        <div style="width:0;height:0;border-left:${tailW}px solid transparent;border-right:${tailW}px solid transparent;border-top:${tailH}px solid ${categoryColor};margin-top:-1px;"></div>
      </div>
    `,
    iconSize: [sz, totalH],
    iconAnchor: [sz / 2, totalH],
  });
};

export const buildOverlayMarkerIcon = (fillColor, glyph, isFocused) => L.divIcon({
  className: '',
  html: `
    <div style="
      width:${isFocused ? '22px' : '18px'};
      height:${isFocused ? '22px' : '18px'};
      border-radius:999px;
      border:${isFocused ? '3px' : '2px'} solid ${isFocused ? '#0F172A' : '#FFFFFF'};
      background:${fillColor};
      color:#FFFFFF;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:${isFocused ? '12px' : '10px'};
      font-weight:900;
      box-shadow:0 10px 22px -18px rgba(15,23,42,0.5);
    ">${glyph}</div>
  `,
  iconSize: [isFocused ? 22 : 18, isFocused ? 22 : 18],
  iconAnchor: [isFocused ? 11 : 9, isFocused ? 11 : 9],
});

export const buildSegmentLabelIcon = (color, label, isFocused) => {
  const w = isFocused ? 64 : 54;
  const h = isFocused ? 20 : 17;
  return L.divIcon({
    className: '',
    html: `
      <div style="
        display:flex;
        align-items:center;
        justify-content:center;
        height:${h}px;
        padding:0 4px;
        border-radius:999px;
        background:${color};
        color:#fff;
        font-size:${isFocused ? '10px' : '9px'};
        font-weight:900;
        white-space:nowrap;
        box-shadow:0 4px 12px -6px rgba(15,23,42,0.55);
        border:2px solid rgba(255,255,255,0.9);
        pointer-events:none;
        letter-spacing:-0.3px;
      ">${label}</div>
    `,
    iconSize: [w, h],
    iconAnchor: [w / 2, h / 2],
  });
};

// leaflet [lat,lon] 배열에서 두 점 사이 각도(deg, 동=0, 북=90 등 지도 기준)
export const calcBearingDeg = (p1, p2) => {
  if (!p1 || !p2) return 0;
  // CSS transform rotate: 오른쪽이 0, 시계방향 증가 → atan2(dLon, dLat) * (180/π) - 90
  const dLat = p2[0] - p1[0];
  const dLon = p2[1] - p1[1];
  return Math.atan2(dLon, dLat) * (180 / Math.PI);
};

export const buildArrowIcon = (color, bearingDeg, isFocused) => {
  const sz = isFocused ? 8 : 6;
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${sz}px;
      height:${sz}px;
      display:flex;
      align-items:center;
      justify-content:center;
      pointer-events:none;
      transform:rotate(${Math.round(bearingDeg)}deg);
      filter:drop-shadow(0 1px 2px rgba(15,23,42,0.35));
    ">
      <svg width="${sz}" height="${sz}" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="6,0 12,10 6,7 0,10" fill="white"/>
      </svg>
    </div>`,
    iconSize: [sz, sz],
    iconAnchor: [sz / 2, sz / 2],
  });
};

// 경로 좌표 배열을 픽셀 간격(m 기준)으로 샘플링해서 화살표 배치 위치+각도 반환
export const sampleRouteArrows = (positions, intervalMeters = 120) => {
  if (!positions || positions.length < 2) return [];
  const R = 6371000;
  const toRad = (d) => d * Math.PI / 180;
  const dist = (a, b) => {
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  };
  const arrows = [];
  let accumulated = 0;
  let nextThreshold = intervalMeters * 0.5; // 첫 화살표는 중간에서 시작
  for (let i = 1; i < positions.length; i += 1) {
    const segDist = dist(positions[i - 1], positions[i]);
    const prev = accumulated;
    accumulated += segDist;
    while (nextThreshold <= accumulated) {
      const ratio = segDist > 0 ? (nextThreshold - prev) / segDist : 0;
      const lat = positions[i - 1][0] + ratio * (positions[i][0] - positions[i - 1][0]);
      const lon = positions[i - 1][1] + ratio * (positions[i][1] - positions[i - 1][1]);
      const bearing = calcBearingDeg(positions[i - 1], positions[i]);
      arrows.push({ pos: [lat, lon], bearing });
      nextThreshold += intervalMeters;
    }
  }
  return arrows;
};

export const LeafletMapViewportController = ({
  boundsPoints = [],
  focusedPoints = [],
  animateFocus = true,
  resizeKey = '',
  onZoomChange = null,
  scopeKey = '',
}) => {
  const map = useMap();
  useEffect(() => {
    if (!onZoomChange) return;
    onZoomChange(map.getZoom());
    const handler = () => onZoomChange(map.getZoom());
    map.on('zoomend', handler);
    return () => map.off('zoomend', handler);
  }, [map, onZoomChange]);
  const boundsSignature = useMemo(
    () => boundsPoints.map((point) => `${point[0].toFixed(5)}:${point[1].toFixed(5)}`).join('|'),
    [boundsPoints]
  );
  const focusSignature = useMemo(
    () => focusedPoints.map((point) => `${point[0].toFixed(5)}:${point[1].toFixed(5)}`).join('|'),
    [focusedPoints]
  );

  useEffect(() => {
    const container = map.getContainer();
    if (!container) return undefined;
    let rafId = 0;
    const syncSize = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        map.invalidateSize({ pan: false });
      });
    };
    syncSize();
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => syncSize())
      : null;
    observer?.observe(container);
    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [map, resizeKey]);

  // scopeKey(탭 전환)가 바뀔 때만 전체 bounds로 리셋
  useEffect(() => {
    if (!scopeKey) return undefined;
    const timer = window.setTimeout(() => {
      map.invalidateSize({ pan: false });
      if (boundsPoints.length) {
        const bounds = L.latLngBounds(boundsPoints);
        if (bounds.isValid()) {
          map.fitBounds(bounds.pad(0.08), { animate: true, padding: [20, 20] });
          return;
        }
      }
      map.setView(ROUTE_PREVIEW_DEFAULT_CENTER, 10, { animate: false });
    }, 60);
    return () => window.clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeKey, boundsSignature]);

  // focusedPoints가 바뀔 때 포커스 이동 (줌 강제 변경 없음 - 사용자 줌 유지)
  useEffect(() => {
    if (!focusSignature) return undefined;
    const timer = window.setTimeout(() => {
      if (focusedPoints.length >= 2) {
        const focusBounds = L.latLngBounds(focusedPoints);
        if (focusBounds.isValid()) {
          map.fitBounds(focusBounds.pad(0.38), { animate: false, padding: [28, 28] });
          return;
        }
      }
      if (focusedPoints.length === 1) {
        map.setView(focusedPoints[0], Math.max(map.getZoom(), 13), { animate: false });
      }
    }, 20);
    return () => window.clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusSignature]);

  return null;
};

export const LeafletMapBackgroundClickHandler = ({ onBackgroundClick }) => {
  useMapEvents({
    click: () => {
      onBackgroundClick?.();
    },
  });
  return null;
};

export const LeafletMapContextMenuHandler = ({ onContextMenu, onMapMove }) => {
  useMapEvents({
    contextmenu: (e) => {
      const map = e.target;
      const containerPoint = e.containerPoint;
      onContextMenu?.({ lat: e.latlng.lat, lng: e.latlng.lng, x: containerPoint.x, y: containerPoint.y, zoom: map.getZoom() });
    },
    click: () => onContextMenu?.(null),
    move: (e) => onMapMove?.(e.target),
    zoom: (e) => onMapMove?.(e.target),
  });
  return null;
};

export const POPUP_TAG_OPTIONS = TAG_OPTIONS.filter(t => !['new','revisit'].includes(t.value));

// LibraryMarkerTypePopover 제거 — 팝업 칩 클릭 시 App 레벨 모달로 대체

export const RoutePreviewCanvas = ({
  routePreviewMap = [],
  height = 240,
  className = '',
  libraryPoints = [],
  recommendationPoints = [],
  focusedTarget = null,
  onMarkerClick = null,
  onLibraryMarkerAddClick = null,
  onLibraryMarkerFocus = null,
  onLibraryMarkerTypeChange = null,
  onLibraryMarkerTypeEdit = null,
  onLibraryMarkerNameClick = null,
  onBackgroundClick = null,
  onSegmentLabelClick = null,
  interactive = true,
  mapEditMode = false,
  tileIndex = 0,
  showTimelineMarkers = true,
  showRouteLines = true,
  showOverlayMarkers = true,
  scopeKey = '',
  focusedLibraryMarkerId = null,
  hideLongSegments = false,
  activeItemId = null,
}) => {
  const tileProviders = useMemo(() => ([
    {
      id: 'osm',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    {
      id: 'gray',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    },
    {
      id: 'dark',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    },
  ]), []);
  const focusedTimelinePointIds = focusedTarget?.kind === 'timeline'
    ? (Array.isArray(focusedTarget?.routePointIds) && focusedTarget.routePointIds.length
      ? focusedTarget.routePointIds
      : [focusedTarget?.id].filter(Boolean))
    : [];
  const focusedOverlayKey = focusedTarget?.kind && focusedTarget?.id ? `${focusedTarget.kind}:${focusedTarget.id}` : '';
  const timelineEntries = useMemo(() => (
    routePreviewMap.flatMap((day) => {
      const validPoints = (day.points || [])
        .map((point, index) => {
          const position = toLeafletLatLng(point);
          if (!position) return null;
          return { point, index, position };
        })
        .filter(Boolean);
      const lastIdx = validPoints.length - 1;
      return validPoints.map(({ point, index, position }, validIndex) => {
        const pointId = point.itemId || point.id;
        const isFocused = focusedTarget?.kind === 'timeline'
          && (focusedTimelinePointIds.includes(point?.id) || focusedTimelinePointIds.includes(pointId));
        return {
          id: pointId,
          pointId: point.id,
          day: day.day,
          order: index + 1,
          label: point.label,
          address: point.address,
          position,
          color: day.color,
          categoryColor: getMapCategoryColor(point.primaryType || 'place'),
          categoryLabel: point.categoryLabel || getMapCategoryLabel(point.primaryType || 'place'),
          isFocused,
          isFirst: validIndex === 0,
          isLast: validIndex === lastIdx,
        };
      });
    })
  ), [focusedTarget?.kind, focusedTimelinePointIds, routePreviewMap]);
  const segmentEntries = useMemo(() => {
    const allSegments = routePreviewMap.flatMap((day) => (
      ((Array.isArray(day.segments) && day.segments.length)
        ? day.segments
        : ((day.points || []).slice(1).map((point, index) => ({
          id: `fallback-${day.day}-${index}`,
          fromId: day.points?.[index]?.id,
          toId: point?.id,
          fromPoint: day.points?.[index],
          toPoint: point,
          path: [],
        }))))
        .map((segment, index) => {
          const rawPath = Array.isArray(segment.path) && segment.path.length
            ? segment.path
            : [segment.fromPoint, segment.toPoint].filter(Boolean);
          const positions = rawPath.map(toLeafletLatLng).filter(Boolean);
          if (positions.length < 2) return null;
          const isFocused = focusedTarget?.kind === 'timeline'
            && focusedTimelinePointIds.includes(segment?.fromId);
          const isFallbackLine = !(Array.isArray(segment.path) && segment.path.length);
          const midIdx = Math.floor(positions.length / 2);
          const midPos = positions[midIdx] || positions[0];
          const arrowPoints = isFallbackLine ? [] : sampleRouteArrows(positions, 150);
          return {
            id: segment.id || `segment-${day.day}-${index}`,
            fromId: segment.fromId,
            toId: segment.toId,
            positions,
            color: day.color,
            isFallbackLine,
            isShipRoute: !!segment.isShipRoute,
            isFocused,
            midPos,
            arrowPoints: segment.isShipRoute ? [] : arrowPoints,
            durationMins: Number.isFinite(Number(segment.durationMins)) ? Number(segment.durationMins) : null,
            distance: Number.isFinite(Number(segment.distance)) ? Number(segment.distance) : null,
            toItemId: segment.toPoint?.itemId || segment.toId,
          };
        })
        .filter(Boolean)
    ));
    return allSegments;
  }, [focusedTarget?.kind, focusedTimelinePointIds, routePreviewMap]);
  const overlayEntries = useMemo(() => (
    [
      ...(Array.isArray(libraryPoints) ? libraryPoints : []),
      ...(Array.isArray(recommendationPoints) ? recommendationPoints : []),
    ]
      .map((point) => {
        const position = toLeafletLatLng(point);
        if (!position) return null;
        const pointKey = `${point.kind}:${point.id}`;
        const isFocused = pointKey === focusedOverlayKey;
        return {
          ...point,
          position,
          isFocused,
          fillColor: point.kind === 'recommendation' ? '#F97316' : '#2563EB',
          glyph: point.kind === 'recommendation' ? '★' : '●',
        };
      })
      .filter(Boolean)
  ), [focusedOverlayKey, libraryPoints, recommendationPoints]);
  // boundsPoints: 일정(timeline+segment)만 기준 — 내장소(overlay) 제외하여 지도 범위가 내장소에 의해 축소되지 않도록
  // 단, 일정 포인트가 없으면 내장소 밀집 지역으로 fallback
  const boundsSegments = useMemo(() => (
    showRouteLines
      ? (hideLongSegments ? segmentEntries.filter((s) => !(s.durationMins != null && s.durationMins >= 60)) : segmentEntries)
      : []
  ), [hideLongSegments, segmentEntries, showRouteLines]);
  const segmentBoundsPoints = useMemo(() => (
    boundsSegments.flatMap((segment) => segment.positions)
  ), [boundsSegments]);
  const timelineBoundsPoints = useMemo(() => (
    showTimelineMarkers ? timelineEntries.map((point) => point.position) : []
  ), [showTimelineMarkers, timelineEntries]);
  // 경로가 있으면 경로 영역만, 없으면 마커 → 내장소 순서로 fallback
  const allBoundsPoints = useMemo(() => (
    segmentBoundsPoints.length > 0
      ? segmentBoundsPoints
      : timelineBoundsPoints.length > 0
        ? timelineBoundsPoints
        : overlayEntries.map((e) => e.position)
  ), [segmentBoundsPoints, timelineBoundsPoints, overlayEntries]);
  const focusedViewportPoints = useMemo(() => {
    if (focusedTarget?.kind === 'timeline') {
      const focusedTimelinePoints = (showTimelineMarkers ? timelineEntries : [])
        .filter((point) => point.isFocused)
        .map((point) => point.position);
      if (focusedTimelinePoints.length) return focusedTimelinePoints;
      const focusedSegments = (showRouteLines ? segmentEntries : [])
        .filter((segment) => segment.isFocused)
        .flatMap((segment) => segment.positions);
      return focusedSegments;
    }
    return (showOverlayMarkers ? overlayEntries : [])
      .filter((point) => point.isFocused)
      .map((point) => point.position);
  }, [focusedTarget?.kind, overlayEntries, segmentEntries, showOverlayMarkers, showRouteLines, showTimelineMarkers, timelineEntries]);
  const rawVisibleTimelineEntries = showTimelineMarkers ? timelineEntries : [];
  const visibleSegmentEntries = showRouteLines
    ? (hideLongSegments ? segmentEntries.filter((s) => !(s.durationMins != null && s.durationMins >= 60)) : segmentEntries)
    : [];
  const rawVisibleOverlayEntries = showOverlayMarkers ? overlayEntries : [];

  const [tileProviderIndex, setTileProviderIndex] = useState(tileIndex);
  useEffect(() => { if (tileIndex < tileProviders.length) setTileProviderIndex(tileIndex); }, [tileIndex, tileProviders.length]);
  const [mapZoom, setMapZoom] = useState(10);
  const showLibraryNames = mapZoom >= 11;
  const [contextMenuInfo, setContextMenuInfo] = useState(null); // { lat, lng, x, y, zoom, locationName }

  // 클러스터 + 방사형 분산 처리 (줌 레벨 기반)
  const [visibleTimelineEntries, visibleOverlayEntries] = useMemo(() => {
    const OFFSET_DEG = 0.00018; // 약 20m
    const posKey = (pos) => `${Number(pos[0]).toFixed(5)}:${Number(pos[1]).toFixed(5)}`;

    // 줌 레벨에 따른 클러스터 반경 계산 (픽셀 40px 기준 → 도 단위 변환)
    // 위도 1도 ≈ 111km, 줌 z에서 1픽셀 ≈ 156543 * cos(lat) / 2^z 미터
    const metersPerPixel = 156543 / Math.pow(2, mapZoom);
    const clusterRadiusDeg = (metersPerPixel * 40) / 111320; // 40px 반경

    // 1) 내장소(place) 마커끼리 근접 클러스터링 (줌 기반 반경)
    const placeEntries = rawVisibleOverlayEntries.filter((e) => e.kind === 'place');
    const clusteredPlaceIds = new Set();
    const clusteredOverlayEntries = [];

    for (let i = 0; i < placeEntries.length; i++) {
      if (clusteredPlaceIds.has(placeEntries[i].id)) continue;
      const group = [placeEntries[i]];
      for (let j = i + 1; j < placeEntries.length; j++) {
        if (clusteredPlaceIds.has(placeEntries[j].id)) continue;
        const dLat = placeEntries[i].position[0] - placeEntries[j].position[0];
        const dLon = placeEntries[i].position[1] - placeEntries[j].position[1];
        const dist = Math.sqrt(dLat * dLat + dLon * dLon);
        if (dist <= clusterRadiusDeg) group.push(placeEntries[j]);
      }
      if (group.length >= 2) {
        // 중심점 계산
        const avgLat = group.reduce((s, e) => s + e.position[0], 0) / group.length;
        const avgLon = group.reduce((s, e) => s + e.position[1], 0) / group.length;
        const rep = group[0];
        clusteredOverlayEntries.push({
          ...rep,
          position: [avgLat, avgLon],
          _clusterCount: group.length,
          _clusterIds: group.map((e) => e.id),
          _clusterItems: group,
        });
        group.forEach((e) => clusteredPlaceIds.add(e.id));
      }
    }

    // 클러스터에 포함되지 않은 overlay 엔트리 (단독 내장소 + 추천 등)
    const remainingOverlay = rawVisibleOverlayEntries.filter((e) => !clusteredPlaceIds.has(e.id));
    const processedOverlay = [...remainingOverlay, ...clusteredOverlayEntries];

    // 2) 타임라인 마커 → 근접 거리 기반 그룹 마커로 병합
    const tlClusterRadius = showLibraryNames ? clusterRadiusDeg * 1.5 : 0; // 이름 모드에서만 거리 기반
    const groupedTlIds = new Set();
    const groupedTlEntries = [];
    if (tlClusterRadius > 0) {
      // 거리 기반 클러스터링
      const tlEntries = [...rawVisibleTimelineEntries];
      for (let i = 0; i < tlEntries.length; i++) {
        if (groupedTlIds.has(tlEntries[i].pointId || tlEntries[i].id)) continue;
        const group = [tlEntries[i]];
        for (let j = i + 1; j < tlEntries.length; j++) {
          if (groupedTlIds.has(tlEntries[j].pointId || tlEntries[j].id)) continue;
          const dLat = tlEntries[i].position[0] - tlEntries[j].position[0];
          const dLon = tlEntries[i].position[1] - tlEntries[j].position[1];
          if (Math.sqrt(dLat * dLat + dLon * dLon) <= tlClusterRadius) group.push(tlEntries[j]);
        }
        if (group.length >= 2) {
          groupedTlEntries.push({ ...group[0], _isGrouped: true, _groupItems: group });
          group.forEach((e) => groupedTlIds.add(e.pointId || e.id));
        }
      }
    } else {
      // 기본: 완전 일치만
      const tlPosGroups = new Map();
      rawVisibleTimelineEntries.forEach((e) => {
        const k = posKey(e.position);
        if (!tlPosGroups.has(k)) tlPosGroups.set(k, []);
        tlPosGroups.get(k).push(e);
      });
      tlPosGroups.forEach((entries) => {
        if (entries.length >= 2) {
          groupedTlEntries.push({ ...entries[0], _isGrouped: true, _groupItems: entries });
          entries.forEach((e) => groupedTlIds.add(e.pointId || e.id));
        }
      });
    }
    const singleTlEntries = rawVisibleTimelineEntries.filter((e) => !groupedTlIds.has(e.pointId || e.id));
    const processedTl = [...singleTlEntries, ...groupedTlEntries];

    // 3) timeline + overlay 통합 처리
    const mergedOverlayIds = new Set(); // 이름 모드에서 timeline 그룹에 병합된 overlay
    if (showLibraryNames) {
      // 이름 모드: 근접한 timeline+overlay를 통합 그룹으로
      for (let ti = 0; ti < processedTl.length; ti++) {
        const tlEntry = processedTl[ti];
        const nearbyOverlay = processedOverlay.filter(oe => {
          if (oe._clusterCount > 1) return false; // 이미 클러스터된 overlay는 제외
          if (mergedOverlayIds.has(oe.id)) return false;
          const dLat = tlEntry.position[0] - oe.position[0];
          const dLon = tlEntry.position[1] - oe.position[1];
          return Math.sqrt(dLat * dLat + dLon * dLon) <= clusterRadiusDeg * 1.5;
        });
        if (nearbyOverlay.length > 0) {
          // overlay를 timeline 그룹에 병합
          const existingItems = tlEntry._isGrouped ? tlEntry._groupItems : [tlEntry];
          const overlayAsItems = nearbyOverlay.map(oe => ({
            ...oe,
            order: oe.categoryLabel || '📍',
            color: oe.categoryColor || '#64748B',
            label: oe.label || oe.placeName || '',
            _isOverlay: true,
          }));
          processedTl[ti] = {
            ...tlEntry,
            _isGrouped: true,
            _groupItems: [...existingItems, ...overlayAsItems],
          };
          nearbyOverlay.forEach(oe => mergedOverlayIds.add(oe.id));
        }
      }
    }
    const finalOverlay = processedOverlay.filter(oe => !mergedOverlayIds.has(oe.id));

    // 방사형 분산 (겹침 처리)
    const groups = new Map();
    const allEntries = [
      ...processedTl.map((e) => ({ ...e, _layer: 'timeline' })),
      ...finalOverlay.map((e) => ({ ...e, _layer: 'overlay' })),
    ];
    allEntries.forEach((e) => {
      const k = posKey(e.position);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(e);
    });
    const offsetMap = new Map();
    groups.forEach((entries) => {
      if (entries.length < 2) return;
      const n = entries.length;
      entries.forEach((e, i) => {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        const r = n === 2 ? OFFSET_DEG * 0.8 : OFFSET_DEG;
        offsetMap.set(e, [
          e.position[0] + r * Math.cos(angle),
          e.position[1] + r * Math.sin(angle) * 1.5,
        ]);
      });
    });
    const applyOffset = (entries, layer) => entries.map((e) => {
      const match = allEntries.find((a) => a._layer === layer && (a.id === e.id) && (a.pointId === e.pointId || a._isGrouped === e._isGrouped));
      const off = match ? offsetMap.get(match) : null;
      return off ? { ...e, position: off } : e;
    });
    const tl = applyOffset(processedTl.map((e) => ({ ...e, _layer: 'timeline' })), 'timeline');
    const ov = applyOffset(finalOverlay.map((e) => ({ ...e, _layer: 'overlay' })), 'overlay');
    return [tl, ov];
  }, [rawVisibleTimelineEntries, rawVisibleOverlayEntries, mapZoom]);
  const renderableTimelinePointCount = visibleTimelineEntries.length;
  const renderableSegmentCount = visibleSegmentEntries.length;
  const renderableOverlayCount = visibleOverlayEntries.length;
  const hasRenderableData = renderableTimelinePointCount > 0 || renderableSegmentCount > 0 || renderableOverlayCount > 0;
  const boundsSignature = useMemo(
    () => allBoundsPoints.map((point) => `${point[0].toFixed(5)}:${point[1].toFixed(5)}`).join('|'),
    [allBoundsPoints]
  );
  // overlay(내장소) 제외한 timeline+segment만의 signature - 내장소 토글 시 지도 배율 변경 방지
  const routeOnlyBoundsSignature = useMemo(() => {
    const pts = [
      ...(showRouteLines ? segmentEntries.flatMap((s) => s.positions) : []),
      ...(showTimelineMarkers ? timelineEntries.map((p) => p.position) : []),
    ];
    return pts.map((p) => `${p[0].toFixed(5)}:${p[1].toFixed(5)}`).join('|');
  }, [segmentEntries, showRouteLines, showTimelineMarkers, timelineEntries]);
  const [tileStatus, setTileStatus] = useState(() => (hasRenderableData ? 'loading' : 'idle'));
  const tileFailureCountRef = useRef(0);

  useEffect(() => {
    if (!hasRenderableData) {
      tileFailureCountRef.current = 0;
      setTileProviderIndex(0);
      setTileStatus('idle');
      return;
    }
    tileFailureCountRef.current = 0;
    setTileProviderIndex(tileIndex < tileProviders.length ? tileIndex : 0);
    setTileStatus('loading');
  }, [boundsSignature, hasRenderableData, tileIndex, tileProviders.length]);

  useEffect(() => {
    if (!hasRenderableData || tileStatus === 'ready' || tileStatus === 'error') return undefined;
    const timer = window.setTimeout(() => {
      setTileStatus('ready');
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [hasRenderableData, tileStatus]);

  if (!hasRenderableData) {
    return (
      <div className={`flex w-full flex-col items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(180deg,rgba(239,246,255,0.94),rgba(255,255,255,0.98))] px-4 text-center ${className}`.trim()} style={{ height }}>
        <MapIcon size={18} className="text-slate-300" />
        <p className="text-[10px] font-bold text-slate-400">지도에 표시할 좌표를 아직 충분히 확인하지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,rgba(226,240,248,0.92),rgba(255,255,255,0.98))] ${className}`.trim()} style={{ height }}>
      <MapContainer
        center={ROUTE_PREVIEW_DEFAULT_CENTER}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        scrollWheelZoom={interactive}
        boxZoom={interactive}
        keyboard={interactive}
        className="h-full w-full bg-[#d9edf7]"
      >
        <TileLayer
          key={tileProviders[tileProviderIndex].id}
          url={tileProviders[tileProviderIndex].url}
          attribution={tileProviders[tileProviderIndex].attribution}
          opacity={0.6}
          eventHandlers={{
            loading: () => setTileStatus((prev) => (prev === 'ready' ? prev : 'loading')),
            tileloadstart: () => setTileStatus((prev) => (prev === 'ready' ? prev : 'loading')),
            tileload: () => setTileStatus('ready'),
            tileerror: () => {
              tileFailureCountRef.current += 1;
              if (tileFailureCountRef.current >= 6) {
                if (tileProviderIndex < tileProviders.length - 1) {
                  tileFailureCountRef.current = 0;
                  setTileProviderIndex((prev) => prev + 1);
                  setTileStatus('loading');
                } else {
                  setTileStatus('error');
                }
              }
            },
          }}
        />
        <LeafletMapViewportController
          boundsPoints={allBoundsPoints}
          focusedPoints={focusedViewportPoints}
          animateFocus={interactive}
          resizeKey={`${height}:${interactive ? 'on' : 'off'}`}
          scopeKey={scopeKey || routeOnlyBoundsSignature}
          onZoomChange={setMapZoom}
        />
        <LeafletMapBackgroundClickHandler onBackgroundClick={onBackgroundClick} />
        <LeafletMapContextMenuHandler onContextMenu={async (info) => {
          if (!info) { setContextMenuInfo(null); return; }
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${info.lat}&lon=${info.lng}&format=json&accept-language=ko`, { headers: { 'Accept-Language': 'ko' } });
            const data = await res.json();
            const addr = data.address || {};
            const city = addr.city || addr.county || addr.municipality || addr.state || '';
            const district = addr.borough || addr.suburb || addr.quarter || addr.neighbourhood || addr.town || addr.village || addr.hamlet || '';
            const locationName = [city, district].filter(Boolean).join(' ');
            setContextMenuInfo({ ...info, locationName });
          } catch {
            setContextMenuInfo({ ...info, locationName: '' });
          }
        }} onMapMove={(map) => {
          setContextMenuInfo(prev => {
            if (!prev) return prev;
            try {
              const pt = map.latLngToContainerPoint([prev.lat, prev.lng]);
              return { ...prev, x: pt.x, y: pt.y, zoom: map.getZoom() };
            } catch { return prev; }
          });
          try {
            const c = map.getCenter();
            safeLocalStorageSet('last_map_center', JSON.stringify([c.lat, c.lng]));
          } catch {}
        }} />
        {(() => {
          const ZoomTracker = () => {
            useMapEvents({ zoomend: (e) => setMapZoom(e.target.getZoom()) });
            return null;
          };
          return <ZoomTracker />;
        })()}
        <Pane name="route-lines" style={{ zIndex: 420 }}>
          {(() => {
            const hasFocus = focusedTarget?.kind === 'timeline' && focusedTimelinePointIds.length > 0;
            return visibleSegmentEntries.map((segment) => {
              let weight, opacity;
              if (segment.isFocused) {
                weight = 11; opacity = 1;
              } else if (hasFocus) {
                weight = segment.isFallbackLine ? 3 : 5; opacity = segment.isFallbackLine ? 0.25 : 0.5;
              } else {
                weight = segment.isFallbackLine ? 4 : 8; opacity = segment.isFallbackLine ? 0.45 : 0.9;
              }
              return (
                <Polyline
                  key={segment.id}
                  positions={segment.positions}
                  bubblingMouseEvents={false}
                  pathOptions={{
                    color: segment.color,
                    weight: segment.isShipRoute ? Math.max(3, weight - 2) : weight,
                    opacity: segment.isShipRoute ? opacity * 0.75 : opacity,
                    dashArray: segment.isShipRoute ? '4 8' : segment.isFallbackLine ? '6 8' : undefined,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
              );
            });
          })()}
        </Pane>
        <Pane name="route-arrows" style={{ zIndex: 460 }}>
          {(() => {
            const arrowStep = Math.max(1, Math.round(Math.pow(3, 13 - mapZoom)));
            return visibleSegmentEntries.flatMap((segment) =>
              (segment.arrowPoints || [])
                .filter((_, i) => i % arrowStep === 0)
                .map((ap, i) => (
                  <Marker
                    key={`arrow-${segment.id}-${i}`}
                    position={ap.pos}
                    bubblingMouseEvents={false}
                    icon={buildArrowIcon(segment.color, ap.bearing, segment.isFocused)}
                  />
                ))
            );
          })()}
        </Pane>
        <Pane name="route-labels" style={{ zIndex: 470 }}>
          {visibleSegmentEntries.map((segment) => {
            if (!segment.midPos || segment.isFallbackLine) return null;
            const mins = segment.durationMins;
            if (!mins || mins < 5) return null;
            const label = mins >= 60
              ? `${Math.floor(mins / 60)}시간${mins % 60 > 0 ? ` ${mins % 60}분` : ''}`
              : `${mins}분`;
            return (
              <Marker
                key={`segment-label-${segment.id}`}
                position={segment.midPos}
                bubblingMouseEvents={false}
                icon={buildSegmentLabelIcon(segment.color, label, segment.isFocused)}
                eventHandlers={interactive && onSegmentLabelClick && segment.toItemId ? {
                  click: () => onSegmentLabelClick(segment.toItemId),
                } : undefined}
              />
            );
          })}
        </Pane>
        <Pane name="timeline-points" style={{ zIndex: 520 }}>
          {visibleTimelineEntries.map((point) => {
            if (point._isGrouped && point._groupItems?.length >= 2) {
              const isFocused = point._groupItems.some(gi => gi.isFocused);
              return (
                <Marker
                  key={`timeline-group-${point._groupItems.map(gi => gi.pointId).join('-')}`}
                  position={point.position}
                  bubblingMouseEvents={false}
                  icon={buildGroupedTimelineMarkerIcon(point._groupItems, isFocused, showLibraryNames, !!(activeItemId && showLibraryNames))}
                  eventHandlers={interactive && typeof onMarkerClick === 'function' ? {
                    mouseover: (e) => { e.target.setZIndexOffset(10000); },
                    mouseout: (e) => { e.target.setZIndexOffset(0); },
                    click: (e) => {
                      // + 버튼 클릭 감지
                      const addEl = e.originalEvent?.target instanceof Element ? e.originalEvent.target.closest('[data-library-add]') : null;
                      if (addEl) {
                        const idx = parseInt(addEl.closest('[data-group-idx]')?.getAttribute('data-group-idx') ?? '-1', 10);
                        const target = point._groupItems[idx];
                        if (target?._isOverlay && typeof onLibraryMarkerAddClick === 'function') {
                          onLibraryMarkerAddClick({ id: target.id, label: target.label });
                          return;
                        }
                      }
                      const items = point._groupItems;
                      // data-group-idx 속성으로 정확히 어느 셀인지 판단
                      const orig = e.originalEvent;
                      const cellEl = orig?.target instanceof Element
                        ? orig.target.closest('[data-group-idx]')
                        : null;
                      const idxAttr = cellEl?.getAttribute('data-group-idx');
                      const idx = idxAttr != null
                        ? Math.min(items.length - 1, Math.max(0, Number(idxAttr)))
                        : (() => {
                            // fallback: clientX 기반 계산
                            const rect = orig?.target instanceof Element
                              ? orig.target.closest('[data-group-idx]')?.parentElement?.getBoundingClientRect()
                              : null;
                            if (!rect) return 0;
                            const relX = orig.clientX - rect.left;
                            return Math.min(items.length - 1, Math.max(0, Math.floor(relX / (rect.width / items.length))));
                          })();
                      const target = items[idx] || items[0];
                      if (target._isOverlay) {
                        onMarkerClick({ kind: 'place', id: target.id, label: target.label });
                      } else {
                        onMarkerClick({ kind: 'timeline', id: target.id, pointId: target.pointId, day: target.day, label: target.label, address: target.address });
                      }
                    },
                  } : undefined}
                />
              );
            }
            return (
            <Marker
              key={`timeline-point-${point.pointId}-z${showLibraryNames ? 'n' : 'i'}`}
              position={point.position}
              bubblingMouseEvents={false}
              icon={buildTimelineMarkerIcon(point.color, String(point.order), point.isFocused, point.categoryColor, point.categoryLabel, point.isFirst, point.isLast, 0, point.label || '', showLibraryNames)}
              eventHandlers={interactive && typeof onMarkerClick === 'function' ? {
                mouseover: (e) => { e.target.setZIndexOffset(10000); },
                mouseout: (e) => { e.target.setZIndexOffset(0); },
                click: () => onMarkerClick({
                  kind: 'timeline',
                  id: point.id,
                  pointId: point.pointId,
                  day: point.day,
                  label: point.label,
                  address: point.address,
                }),
              } : undefined}
            />
            );
          })}
        </Pane>
        <Pane name="overlay-points" style={{ zIndex: 480 }}>
          {(() => {
            const timelineFocusActive = focusedTarget?.kind === 'timeline' && focusedTimelinePointIds.length > 0;
            return visibleOverlayEntries.map((point) => {
            const isCluster = !!(point._clusterCount && point._clusterCount > 1);
            const clusterCount = isCluster ? point._clusterCount : 0;
            const clusterColors = isCluster ? (point._clusterItems || []).map((e) => e.categoryColor || '#2563EB') : [];
            const clusterTypes = isCluster ? (point._clusterItems || []).map((e) => e.primaryType || '') : [];
            const clusterNames = isCluster ? (point._clusterItems || []).map((e) => e.label || '') : [];
            // 클러스터 팝업에 표시할 아이템들
            const clusterItems = isCluster ? (point._clusterItems || []) : [];
            const isFocusedLibrary = point.kind === 'place' && (focusedLibraryMarkerId === point.id || String(focusedLibraryMarkerId || '').startsWith(point.id) || (isCluster && clusterItems.some(item => item.id === focusedLibraryMarkerId)));
            return (
              <Marker
                key={`overlay-point-${point.kind}-${point.id}-z${showLibraryNames ? 'n' : 'i'}`}
                position={point.position}
                bubblingMouseEvents={false}
                icon={point.kind === 'place'
                  ? buildLibraryMarkerIcon(point.categoryColor || '#2563EB', point.categoryLabel || '내장소', isFocusedLibrary, false, 0, timelineFocusActive, clusterCount, clusterColors, point.primaryType || '', clusterTypes, point.label || '', clusterNames, showLibraryNames, point.starred, !!(activeItemId && showLibraryNames))
                  : buildOverlayMarkerIcon(point.fillColor, point.glyph, point.isFocused)}
                eventHandlers={interactive ? {
                  mouseover: (e) => { e.target.setZIndexOffset(10000); },
                  mouseout: (e) => { e.target.setZIndexOffset(0); },
                  click: (e) => {
                    // + 버튼 클릭 감지
                    const addEl = e.originalEvent?.target instanceof Element ? e.originalEvent.target.closest('[data-library-add]') : null;
                    if (addEl && point.kind === 'place') {
                      if (isCluster) {
                        const clusterIdx = addEl.closest('[data-cluster-idx]');
                        const idx = clusterIdx ? parseInt(clusterIdx.getAttribute('data-cluster-idx'), 10) : -1;
                        const item = idx >= 0 && clusterItems[idx] ? clusterItems[idx] : null;
                        if (item && typeof onLibraryMarkerAddClick === 'function') {
                          onLibraryMarkerAddClick({ id: item.id, label: item.label });
                        }
                      } else {
                        if (typeof onLibraryMarkerAddClick === 'function') {
                          onLibraryMarkerAddClick({ id: point.id, label: point.label });
                        }
                      }
                      return;
                    }
                    if (point.kind === 'place') {
                      if (isCluster) {
                        // 클러스터: 클릭된 셀 확인
                        const target = e.originalEvent?.target instanceof Element ? e.originalEvent.target : null;
                        const cell = target?.closest('[data-cluster-idx]');
                        const isOverflow = cell?.getAttribute('data-cluster-overflow') === 'true';
                        const idx = cell ? parseInt(cell.getAttribute('data-cluster-idx'), 10) : -1;
                        if (isOverflow) {
                          // +N 셀 클릭 → 전체 팝업 (특별 접미사로 구분)
                          if (typeof onLibraryMarkerFocus === 'function') onLibraryMarkerFocus(`${point.id}:cluster-all`);
                        } else if (idx >= 0 && clusterItems[idx]) {
                          // 개별 셀 클릭 → 해당 장소만 포커스
                          if (typeof onLibraryMarkerFocus === 'function') onLibraryMarkerFocus(clusterItems[idx].id);
                        } else {
                          if (typeof onLibraryMarkerFocus === 'function') onLibraryMarkerFocus(`${point.id}:cluster-all`);
                        }
                      } else {
                        if (typeof onLibraryMarkerFocus === 'function') onLibraryMarkerFocus(point.id);
                      }
                    } else if (typeof onMarkerClick === 'function') {
                      onMarkerClick({ kind: point.kind, id: point.id, label: point.label, address: point.address });
                    }
                  },
                } : undefined}
              >
                {interactive && point.kind === 'place' && !mapEditMode && (
                  <Popup
                    offset={[0, -14]}
                    closeButton={false}
                    autoPan={false}
                    className="library-marker-popup"
                  >
                    <div style={{ minWidth: '160px', maxWidth: '220px', padding: '0', fontFamily: 'inherit' }}>
                      {(() => {
                        // 클러스터 내 개별 아이템이 포커스된 경우 해당 아이템만 단일 팝업
                        const isClusterAllMode = isCluster && String(focusedLibraryMarkerId || '').endsWith(':cluster-all');
                        const focusedClusterItem = isCluster && !isClusterAllMode
                          ? clusterItems.find((item) => item.id === focusedLibraryMarkerId)
                          : null;
                        const showFullList = isCluster && !focusedClusterItem;
                        const singleItem = focusedClusterItem || (!isCluster ? point : null);

                        if (showFullList) {
                          // 전체 클러스터 팝업 (+N 클릭)
                          return (
                            <div>
                              <div style={{ padding: '8px 10px 4px', fontSize: '10px', fontWeight: 900, color: '#64748B', borderBottom: '1px solid #F1F5F9' }}>
                                내장소 {clusterCount}곳
                              </div>
                              {clusterItems.map((item) => (
                                <div key={item.id} style={{ padding: '6px 10px', borderBottom: '1px solid #F1F5F9' }}>
                                  <div style={{ fontSize: '11px', fontWeight: 900, color: '#1E293B', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</div>
                                  {item.address && <div style={{ fontSize: '9px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.address}</div>}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); if (typeof onLibraryMarkerAddClick === 'function') onLibraryMarkerAddClick({ id: item.id, label: item.label }); if (typeof onLibraryMarkerFocus === 'function') onLibraryMarkerFocus(null); }}
                                    style={{ marginTop: '4px', width: '100%', padding: '3px 6px', borderRadius: '6px', background: '#3182F6', color: '#fff', fontSize: '10px', fontWeight: 900, border: 'none', cursor: 'pointer' }}
                                  >+ 일정 등록</button>
                                </div>
                              ))}
                            </div>
                          );
                        }

                        // 단일 마커 팝업 (개별 또는 클러스터 내 개별)
                        const itemId = singleItem?.id || point.id;
                        const itemLabel = singleItem?.label || point.label;
                        const itemAddress = singleItem?.address || point.address;
                        const itemColor = singleItem?.categoryColor || point.categoryColor || '#2563EB';
                        const itemCatLabel = singleItem?.categoryLabel || point.categoryLabel || '내장소';
                        return (
                          <div style={{ padding: '8px 10px' }}>
                            <div style={{ marginBottom: '4px' }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); if (typeof onLibraryMarkerTypeEdit === 'function') onLibraryMarkerTypeEdit(itemId, e); }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: 0, cursor: typeof onLibraryMarkerTypeEdit === 'function' ? 'pointer' : 'default' }}
                              >
                                <div style={{ width: '8px', height: '8px', borderRadius: '3px', background: itemColor, flexShrink: 0 }} />
                                <span style={{ fontSize: '9px', fontWeight: 900, color: itemColor }}>{itemCatLabel}</span>
                              </button>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); if (typeof onLibraryMarkerNameClick === 'function') onLibraryMarkerNameClick(itemId); }}
                              style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: typeof onLibraryMarkerNameClick === 'function' ? 'pointer' : 'default', fontSize: '12px', fontWeight: 900, color: '#1E293B', marginBottom: '3px', wordBreak: 'break-all', textDecoration: typeof onLibraryMarkerNameClick === 'function' ? 'underline' : 'none' }}
                            >{itemLabel}</button>
                            {itemAddress && <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '6px', wordBreak: 'break-all' }}>{itemAddress}</div>}
                            <button
                              onClick={(e) => { e.stopPropagation(); if (typeof onLibraryMarkerAddClick === 'function') onLibraryMarkerAddClick({ id: itemId, label: itemLabel }); if (typeof onLibraryMarkerFocus === 'function') onLibraryMarkerFocus(null); }}
                              style={{ width: '100%', padding: '5px 8px', borderRadius: '8px', background: '#3182F6', color: '#fff', fontSize: '11px', fontWeight: 900, border: 'none', cursor: 'pointer' }}
                            >+ 일정 등록</button>
                          </div>
                        );
                      })()}
                    </div>
                  </Popup>
                )}
              </Marker>
            );
          });
          })()}
        </Pane>
        {/* 선택된 일정 주변 15분 거리 원 */}
        {activeItemId && (() => {
          const activePoint = visibleTimelineEntries.find(p => p.id === activeItemId);
          if (!activePoint?.position) return null;
          return (
            <Circle
              center={activePoint.position}
              radius={10000}
              pathOptions={{ color: '#3182F6', weight: 1.5, opacity: 0.5, fillColor: '#3182F6', fillOpacity: 0.04, dashArray: '8 6' }}
            />
          );
        })()}
      </MapContainer>
      {tileStatus === 'loading' && (
        <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/85 bg-white/92 px-3 py-1 text-[10px] font-black text-slate-500 shadow-sm">
          지도 타일 불러오는 중...
        </div>
      )}
      {tileStatus === 'error' && (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-2xl border border-amber-200 bg-amber-50/94 px-3 py-2 text-[10px] font-bold text-amber-700 shadow-sm">
          지도 배경을 불러오지 못해 경로만 표시합니다.
        </div>
      )}
      <div className="pointer-events-none absolute bottom-2 right-2 rounded-md border border-white/70 bg-white/80 px-1.5 py-0.5 text-[9px] font-black text-slate-500 shadow-sm backdrop-blur-sm">
        z{mapZoom}
      </div>
      {/* 우클릭 컨텍스트 메뉴 */}
      {contextMenuInfo && (
        <div
          style={{ position: 'absolute', left: contextMenuInfo.x, top: contextMenuInfo.y, zIndex: 99999, pointerEvents: 'auto', transform: 'translate(8px, 8px)' }}
          className="bg-white border border-slate-200 rounded-[14px] shadow-[0_8px_28px_-6px_rgba(15,23,42,0.26)] overflow-hidden min-w-[180px]"
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenuInfo.locationName && (
            <div className="px-3 py-2 border-b border-slate-100 text-[10px] font-black text-slate-500 tracking-tight">{contextMenuInfo.locationName}</div>
          )}
          <button
            className="w-full px-3 py-2 text-left text-[11px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100"
            onClick={() => {
              const { lat, lng, zoom } = contextMenuInfo;
              window.open(`https://map.naver.com/p/entry/coords/${lat},${lng}?c=${lng},${lat},${Math.max(14, zoom)},0,0,0,dh`, '_blank', 'noopener,noreferrer');
              setContextMenuInfo(null);
            }}
          >
            <MapIcon size={11} className="text-[#3182F6] shrink-0" /> 네이버 지도로 열기
          </button>
          {[
            { label: '가볼만한 곳', keyword: '가볼만한 곳', icon: <Navigation size={11} className="text-emerald-500 shrink-0" /> },
            { label: '맛집', keyword: '맛집', icon: <Utensils size={11} className="text-rose-500 shrink-0" /> },
            { label: '카페', keyword: '카페', icon: <Coffee size={11} className="text-amber-500 shrink-0" /> },
          ].map(({ label, keyword, icon }) => {
            const { lat, lng, zoom, locationName } = contextMenuInfo;
            const query = locationName ? `${locationName} ${keyword}` : keyword;
            const zoomLevel = Math.max(14, zoom);
            return (
              <button
                key={keyword}
                className="w-full px-3 py-2 text-left text-[11px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                onClick={() => {
                  window.open(`https://map.naver.com/p/search/${encodeURIComponent(query)}?searchType=place&c=${lng},${lat},${zoomLevel},0,0,0,dh`, '_blank', 'noopener,noreferrer');
                  setContextMenuInfo(null);
                }}
              >
                {icon} {locationName ? `${locationName} ${label}` : label} 검색
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

