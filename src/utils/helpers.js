import { normalizeTagOrder, EMPTY_BUSINESS, WEEKDAY_OPTIONS, formatClosedDaysSummary } from './constants.js';
import { timeToMinutes, minutesToTime, normalizeBusiness, getShipTimeline, getShipBoardTimeValue } from './time.js';
import { normalizeGeoPoint, hasGeoCoords, isGeoStaleForAddress } from './geo.js';

// ── 순수 유틸 ──

export const deepClone = (value) => JSON.parse(JSON.stringify(value));

export const getMenuQty = (menu) => {
  const parsed = Number(menu?.qty);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return parsed;
};
export const getMenuLineTotal = (menu) => Number(menu?.price || 0) * getMenuQty(menu);

export const parseMinsLabel = (value, fallback) => {
  const hit = String(value || '').match(/(\d+)/);
  if (!hit) return fallback;
  const parsed = parseInt(hit[1], 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const DEFAULT_TRAVEL_MINS = 15;
export const DEFAULT_BUFFER_MINS = 10;

// ── Duration 관련 ──

const getBaseDurationValue = (item = {}) => {
  const current = Math.max(0, Number(item?.duration) || 0);
  const stored = Number(item?.baseDuration);
  return Number.isFinite(stored) && stored >= 0 ? stored : current;
};
export const ensureBaseDuration = (item = {}) => {
  if (!item || item.type === 'backup') return 0;
  const safe = getBaseDurationValue(item);
  item.baseDuration = safe;
  return safe;
};
export const syncBaseDuration = (item = {}, minutes = item?.duration) => {
  if (!item || item.type === 'backup') return 0;
  const safe = Math.max(0, Number(minutes) || 0);
  item.baseDuration = safe;
  return safe;
};

// ── Lodge/Tag 판별 ──

export const hasRestTag = (types = []) => {
  const normalized = (Array.isArray(types) ? types : []).map(v => String(v || '').trim().toLowerCase());
  return normalized.includes('rest') || normalized.includes('휴식');
};
export const isLodgeStay = (types = []) => {
  const normalized = (Array.isArray(types) ? types : []).map(v => String(v || '').trim().toLowerCase());
  return normalized.includes('lodge') && !hasRestTag(normalized);
};
export const isStandaloneLodgeSegmentItem = (item = {}) => (
  !!item?.renderAsSegmentCard
  && !!item?.sourceLodgeId
  && !!String(item?.segmentType || '').trim()
);
export const isFullLodgeStayItem = (item = {}) => isLodgeStay(item?.types) && !isStandaloneLodgeSegmentItem(item);
export const isOvernightLodgeTimelineItem = (item = {}) => (
  isFullLodgeStayItem(item)
  || (isStandaloneLodgeSegmentItem(item) && String(item?.segmentType || '').trim() === 'stay')
);

export const primeTimelineDurationFromBase = (item = {}) => {
  if (!item || item.type === 'backup') return;
  const baseDuration = ensureBaseDuration(item);
  if (item.types?.includes('ship') || isOvernightLodgeTimelineItem(item)) return;
  if (item.isDurationFixed || item.isEndTimeFixed) return;
  item.duration = baseDuration;
};

export const isAutoStretchEligible = (item = {}) => {
  if (!item || item.type === 'backup') return false;
  if (item.types?.includes('ship') || item.types?.includes('pickup')) return false;
  if (item.isDurationFixed || item.isEndTimeFixed) return false;
  if (isOvernightLodgeTimelineItem(item)) return false;
  return true;
};

// ── Geo 관련 ──

export const getPlanItemPrimaryAddress = (item = {}) => String(item?.receipt?.address || item?.address || item?.sourceLodgeAddress || '').trim();
export const getShipStartAddress = (item = {}) => String(item?.receipt?.address || item?.startPoint || '').trim();
export const getShipEndAddress = (item = {}) => String(item?.endAddress || item?.endPoint || '').trim();

export const applyGeoFieldsToRecord = (record = {}, forceRefresh = false) => {
  if (!record || typeof record !== 'object') return record;
  if (Array.isArray(record?.types) && record.types.includes('ship')) {
    const startAddress = getShipStartAddress(record);
    const endAddress = getShipEndAddress(record);
    record.geoStart = (forceRefresh || isGeoStaleForAddress(record.geoStart, startAddress))
      ? normalizeGeoPoint({ address: startAddress }, startAddress)
      : normalizeGeoPoint(record.geoStart, startAddress);
    record.geoEnd = (forceRefresh || isGeoStaleForAddress(record.geoEnd, endAddress))
      ? normalizeGeoPoint({ address: endAddress }, endAddress)
      : normalizeGeoPoint(record.geoEnd, endAddress);
    delete record.geo;
    return record;
  }
  const address = getPlanItemPrimaryAddress(record);
  record.geo = (forceRefresh || isGeoStaleForAddress(record.geo, address))
    ? normalizeGeoPoint({ address }, address)
    : normalizeGeoPoint(record.geo, address);
  delete record.geoStart;
  delete record.geoEnd;
  return record;
};

export const cloneGeoForRecord = (record = {}) => {
  if (Array.isArray(record?.types) && record.types.includes('ship')) {
    return {
      geoStart: normalizeGeoPoint(record.geoStart, getShipStartAddress(record)),
      geoEnd: normalizeGeoPoint(record.geoEnd, getShipEndAddress(record)),
    };
  }
  return { geo: normalizeGeoPoint(record.geo, getPlanItemPrimaryAddress(record)) };
};

// ── Lodge segment time ──

export const normalizeLodgeSegmentTime = (raw, fallback = '18:00') => {
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

export const ensureLodgeStaySegments = (item = {}) => {
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

// ── Ship item defaults ──

export const ensureShipItemDefaults = (item, dayNumber = 1) => {
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

// ── normalizeLibraryPlace ──

export const normalizeLibraryPlace = (place, dayNumber = 1) => {
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

// ── Business 관련 (순수 함수만) ──

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
export const getOpenCloseWarningText = (minute, business = {}, beforeText, afterText) => {
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

export const formatBusinessSummary = (businessRaw, context = null) => {
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

// ── Schedule 계산 ──

export const runSchedulePass = (dayPlan) => {
  if (!Array.isArray(dayPlan)) return dayPlan;
  const mainIndices = [];
  for (let idx = 0; idx < dayPlan.length; idx += 1) {
    const item = dayPlan[idx];
    if (!item || item.type === 'backup') continue;
    mainIndices.push(idx);
  }
  if (!mainIndices.length) return dayPlan;

  let prevEndMinutes = 0;
  for (let seq = 0; seq < mainIndices.length; seq += 1) {
    const planIdx = mainIndices[seq];
    const item = dayPlan[planIdx];
    if (!item) continue;

    item._timingConflict = false;
    item._timingConflictReason = '';
    ensureBaseDuration(item);

    const duration = Math.max(0, Number(item.duration) || 0);

    if (seq === 0) {
      const start = timeToMinutes(item.time || '00:00');
      if (!item.time) item.time = minutesToTime(start);
      if (item.types?.includes('ship')) {
        const shipTimeline = getShipTimeline(item);
        item.time = minutesToTime(shipTimeline.loadStart);
        item.duration = Math.max(0, shipTimeline.disembark - shipTimeline.loadStart);
        syncBaseDuration(item, item.duration);
        prevEndMinutes = shipTimeline.disembark;
      } else {
        if (isOvernightLodgeTimelineItem(item)) syncBaseDuration(item, duration);
        prevEndMinutes = start + duration;
      }
      continue;
    }

    const travel = parseMinsLabel(item.travelTimeOverride, DEFAULT_TRAVEL_MINS);
    const currentBuffer = parseMinsLabel(item.bufferTimeOverride, DEFAULT_BUFFER_MINS);
    const manualBufferBase = item._isBufferCoordinated
      ? parseMinsLabel(item._manualBufferTimeOverride, DEFAULT_BUFFER_MINS)
      : currentBuffer;
    if (!item._manualBufferTimeOverride) item._manualBufferTimeOverride = `${manualBufferBase}분`;
    let effectiveBuffer = manualBufferBase;
    const earliestStart = prevEndMinutes + travel + manualBufferBase;

    let startMinutes = earliestStart;
    if (item.isTimeFixed) {
      startMinutes = timeToMinutes(item.time || '00:00');
      const baseArrival = prevEndMinutes + travel;
      effectiveBuffer = Math.max(0, startMinutes - baseArrival);
      item.bufferTimeOverride = `${effectiveBuffer}분`;
      item._manualBufferTimeOverride = `${effectiveBuffer}분`;
      item._isBufferCoordinated = item.isTimeFixed && effectiveBuffer > 0;
    } else {
      if (item._isBufferCoordinated) {
        item.bufferTimeOverride = `${manualBufferBase}분`;
        item._isBufferCoordinated = false;
      }
      item.time = minutesToTime(startMinutes);
    }

    if (item.types?.includes('ship')) {
      const shipTimeline = getShipTimeline(item);
      prevEndMinutes = shipTimeline.disembark;
      item.duration = Math.max(0, shipTimeline.disembark - timeToMinutes(item.time || '00:00'));
      syncBaseDuration(item, item.duration);
    } else {
      let effectiveDuration = Math.max(0, Number(item.duration) || 0);
      if (item.isEndTimeFixed && item._fixedEndMinutes != null) {
        effectiveDuration = Math.max(0, Number(item._fixedEndMinutes) - startMinutes);
      }
      item.duration = effectiveDuration;
      if (isOvernightLodgeTimelineItem(item)) syncBaseDuration(item, effectiveDuration);
      prevEndMinutes = startMinutes + effectiveDuration;
    }
  }
  return dayPlan;
};

export const runSchedulePassAcrossDays = (days) => {
  if (!Array.isArray(days)) return days;

  let prevEndMinutes = null;
  for (let dayIdx = 0; dayIdx < days.length; dayIdx += 1) {
    const dayPlan = days?.[dayIdx]?.plan || [];
    for (let idx = 0; idx < dayPlan.length; idx += 1) {
      const item = dayPlan[idx];
      if (!item || item.type === 'backup') continue;

      item._timingConflict = false;
      item._timingConflictReason = '';
      ensureBaseDuration(item);

      const duration = Math.max(0, Number(item.duration) || 0);

      if (prevEndMinutes === null) {
        const start = timeToMinutes(item.time || '00:00');
        if (!item.time) item.time = minutesToTime(start);
        if (item.types?.includes('ship')) {
          const shipTimeline = getShipTimeline(item);
          item.time = minutesToTime(shipTimeline.loadStart);
          item.duration = Math.max(0, shipTimeline.disembark - shipTimeline.loadStart);
          syncBaseDuration(item, item.duration);
          prevEndMinutes = shipTimeline.disembark;
        } else {
          if (isOvernightLodgeTimelineItem(item)) syncBaseDuration(item, duration);
          prevEndMinutes = start + duration;
        }
        continue;
      }

      const travel = parseMinsLabel(item.travelTimeOverride, DEFAULT_TRAVEL_MINS);
      const currentBuffer = parseMinsLabel(item.bufferTimeOverride, DEFAULT_BUFFER_MINS);
      const manualBufferBase = item._isBufferCoordinated
        ? parseMinsLabel(item._manualBufferTimeOverride, DEFAULT_BUFFER_MINS)
        : currentBuffer;
      if (!item._manualBufferTimeOverride) item._manualBufferTimeOverride = `${manualBufferBase}분`;

      let startMinutes = prevEndMinutes + travel + manualBufferBase;
      if (item.isTimeFixed) {
        startMinutes = (Math.max(0, Number(dayIdx) || 0) * 1440) + timeToMinutes(item.time || '00:00');
        const baseArrival = prevEndMinutes + travel;
        const effectiveBuffer = Math.max(0, startMinutes - baseArrival);
        item.bufferTimeOverride = `${effectiveBuffer}분`;
        item._manualBufferTimeOverride = `${effectiveBuffer}분`;
        item._isBufferCoordinated = effectiveBuffer > 0;
      } else {
        if (item._isBufferCoordinated) {
          item.bufferTimeOverride = `${manualBufferBase}분`;
          item._isBufferCoordinated = false;
        }
        item.time = minutesToTime(startMinutes);
      }

      if (item.types?.includes('ship')) {
        const shipTimeline = getShipTimeline(item);
        prevEndMinutes = shipTimeline.disembark;
        item.duration = Math.max(0, shipTimeline.disembark - timeToMinutes(item.time || '00:00'));
        syncBaseDuration(item, item.duration);
      } else {
        const effectiveDuration = Math.max(0, Number(item.duration) || 0);
        item.duration = effectiveDuration;
        if (isOvernightLodgeTimelineItem(item)) syncBaseDuration(item, effectiveDuration);
        prevEndMinutes = startMinutes + effectiveDuration;
      }
    }
  }

  return days;
};

// ── createTimelineItem ──

export const createTimelineItem = ({ dayNumber = 1, baseTime = '09:00', types = ['place'], placeData = null, fallbackLabel = '장소' }) => {
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
    duration: Number(placeData?.duration || (isShip ? 330 : normalizedTypes.includes('home') ? 0 : 60)),
    baseDuration: Number(placeData?.baseDuration ?? placeData?.duration ?? (isShip ? 330 : normalizedTypes.includes('home') ? 0 : 60)),
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
  ensureBaseDuration(nextItem);
  applyGeoFieldsToRecord(nextItem);
  return nextItem;
};
