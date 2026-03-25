import { normalizeTagOrder, EMPTY_BUSINESS } from './constants.js';
import { normalizeBusiness } from './time.js';
import { normalizeGeoPoint, hasGeoCoords } from './geo.js';

// 순수 유틸 — App.jsx에서도 동일 정의가 있지만 helpers.js 내부에서 필요
export const getMenuQty = (menu) => {
  const parsed = Number(menu?.qty);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return parsed;
};
export const getMenuLineTotal = (menu) => Number(menu?.price || 0) * getMenuQty(menu);

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


// === Schedule & Timeline helpers ===

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

export const getBusinessWarningNow = (businessRaw) => {
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

export const buildRouteFlowMeta = (days = []) => (
  (days || []).map((day, dayIdx) => ({
    day: day?.day || dayIdx + 1,
    routes: (day?.plan || [])
      .map((_, targetIdx) => getRouteFlowEntry(days, dayIdx, targetIdx))
      .filter((entry) => entry.targetItem)
      .map((entry) => ({
        targetIdx: entry.targetIdx,
        targetItemId: entry.targetItemId,
        prevItemId: entry.prevItemId,
        fromAddress: entry.fromAddress,
        toAddress: entry.toAddress,
        status: entry.status,
      })),
  }))
);

export const recalculateSchedule = (dayPlan) => {
  if (!Array.isArray(dayPlan)) return [];
  dayPlan.forEach((item) => {
    ensureBaseDuration(item);
    primeTimelineDurationFromBase(item);
  });
  runSchedulePass(dayPlan);
  const timelineSnapshot = [{ day: 1, plan: dayPlan }];
  if (applyAutoStretchAcrossTimeline(timelineSnapshot)) {
    runSchedulePass(dayPlan);
  }
  return dayPlan;
};

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

