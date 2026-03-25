// 좌표/주소 관련 유틸리티

export const normalizeGeoPoint = (raw = {}, fallbackAddress = '') => {
  const address = String(raw?.address || fallbackAddress || '').trim();
  const rawLat = raw?.lat;
  const rawLon = raw?.lon;
  const lat = rawLat !== '' && rawLat !== null && rawLat !== undefined ? Number(rawLat) : NaN;
  const lon = rawLon !== '' && rawLon !== null && rawLon !== undefined ? Number(rawLon) : NaN;
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

export const hasGeoCoords = (geo) => {
  const lat = Number(geo?.lat);
  const lon = Number(geo?.lon);
  return Number.isFinite(lat) && Number.isFinite(lon) && !(lat === 0 && lon === 0) && Math.abs(lat) <= 90;
};

export const isGeoStaleForAddress = (geo, address = '') => {
  const normalizedAddress = String(address || '').trim();
  if (!normalizedAddress) return false;
  const current = normalizeGeoPoint(geo, normalizedAddress);
  if (!current) return true;
  return current.address !== normalizedAddress || !hasGeoCoords(current);
};

export const makePushTokenDocId = (token = '') => encodeURIComponent(String(token || '').trim()).slice(0, 1500);

export const getTimeOfDayOverlay = (timeStr) => {
  const [h = '12', m = '0'] = (timeStr || '12:00').split(':');
  const mins = parseInt(h, 10) * 60 + parseInt(m, 10);
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
