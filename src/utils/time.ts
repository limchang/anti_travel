// 시간 관련 유틸리티

export const normalizeBusiness = (business = {}) => ({
  open: String(business.open || ''),
  close: String(business.close || ''),
  breakStart: String(business.breakStart || ''),
  breakEnd: String(business.breakEnd || ''),
  lastOrder: String(business.lastOrder || ''),
  entryClose: String(business.entryClose || ''),
  closedDays: Array.isArray(business.closedDays) ? [...new Set(business.closedDays)] : [],
});

export function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  const hrs = parseInt(parts[0], 10);
  const mins = parseInt(parts[1], 10);
  if (hrs === 24 && mins === 0) return 1440;
  return (isNaN(hrs) ? 0 : hrs) * 60 + (isNaN(mins) ? 0 : mins);
}

export function minutesToTime(minutes) {
  if (typeof minutes !== 'number' || isNaN(minutes)) return "00:00";
  if (minutes === 1440) return "24:00";
  let h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h >= 24) h = h % 24;
  if (h < 0) h = 24 + (h % 24);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function getNextDayClockMinutes(timeStr) {
  return timeToMinutes(timeStr) + 1440;
}

export const fmtMinutesLabel = (mins, options = {}) => {
  const safe = Math.max(0, Math.round(Number(mins) || 0));
  const compact = !!options.compact;
  if (safe < 60) return `${safe}분`;
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  if (minutes === 0) return compact ? `${hours}시` : `${hours}시간`;
  return compact ? `${hours}시 ${minutes}분` : `${hours}시간 ${minutes}분`;
};

export const fmtDur = (mins) => fmtMinutesLabel(mins);
export const fmtDurCompact = (mins) => fmtMinutesLabel(mins, { compact: true });

export const normalizeTimeToken = (raw = '') => {
  const m = String(raw).trim().match(/(\d{1,2})(?::(\d{2}))?/);
  if (!m) return '';
  const hh = Number(m[1]);
  const mm = Number(m[2] || '0');
  if (Number.isNaN(hh) || Number.isNaN(mm) || hh < 0 || hh > 24 || mm < 0 || mm > 59) return '';
  if (hh === 24 && mm > 0) return '';
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};

export const extractTimesFromText = (text = '') => {
  const out = [];
  const re = /(\d{1,2})\s*[:시]\s*(\d{1,2})?\s*분?/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const hh = m[1];
    const mm = m[2] || '00';
    const t = normalizeTimeToken(`${hh}:${mm}`);
    if (t) out.push(t);
  }
  if (out.length === 0) {
    const re2 = /(\d{1,2})\s*시/g;
    while ((m = re2.exec(text)) !== null) {
      const t = normalizeTimeToken(`${m[1]}:00`);
      if (t) out.push(t);
    }
  }
  return [...new Set(out)];
};

// 페리 시간 관련
export const getShipLoadingRange = (item = {}) => {
  const times = extractTimesFromText(String(item?.receipt?.shipDetails?.loading || ''));
  return { start: times[0] || '', end: times[1] || '' };
};

export const getShipBoardTimeValue = (item = {}) => String(item?.boardTime || item?.receipt?.shipDetails?.depart || '').trim();
export const getShipLoadEndTimeValue = (item = {}) => String(item?.loadEndTime || getShipLoadingRange(item).end || getShipBoardTimeValue(item) || '').trim();
export const getShipLoadStartTimeValue = (item = {}) => String(item?.time || getShipLoadingRange(item).start || '').trim();

export const resolveShipAbsoluteMinutes = (baseClock, minAbsolute = 0) => {
  let absolute = timeToMinutes(baseClock || '00:00');
  while (absolute < minAbsolute) absolute += 1440;
  return absolute;
};

export const getShipTimeline = (item = {}) => {
  const loadStartLabel = getShipLoadStartTimeValue(item) || '00:00';
  const loadStart = timeToMinutes(loadStartLabel);
  const loadEndLabel = getShipLoadEndTimeValue(item) || loadStartLabel;
  const loadEnd = resolveShipAbsoluteMinutes(loadEndLabel, loadStart);
  const boardLabel = getShipBoardTimeValue(item) || loadEndLabel || loadStartLabel;
  const board = resolveShipAbsoluteMinutes(boardLabel, loadEnd);
  const sailDuration = Math.max(30, Number(item?.sailDuration) || 240);
  const disembark = board + sailDuration;
  return {
    loadStart, loadEnd, board, disembark, sailDuration,
    loadStartLabel: minutesToTime(loadStart),
    loadEndLabel: minutesToTime(loadEnd),
    boardLabel: minutesToTime(board),
    disembarkLabel: minutesToTime(disembark),
  };
};
