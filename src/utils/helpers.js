import { normalizeTagOrder, EMPTY_BUSINESS } from './constants.js';
import { normalizeBusiness } from './time.js';
import { normalizeGeoPoint, hasGeoCoords } from './geo.js';

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

