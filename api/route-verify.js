import { setCors, handleOptions } from './_cors.js';

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const DEFAULT_KAKAO_REST_KEY = 'b312628369f47e04894f338b7fc0b318';

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

const verifyDurationMins = (distanceKm, straightKm, rawDurationMins, isSameAddress) => {
  const d = Math.max(0, Number(distanceKm) || 0);
  const s = Math.max(0, Number(straightKm) || 0);
  const raw = Math.max(1, Number(rawDurationMins) || 1);
  if (isSameAddress) return raw;

  const byRoadSpeed = Math.ceil((d / 18) * 60);
  const byStraight = Math.ceil((s / 22) * 60);
  const signalPenalty = d >= 0.25 ? 3 : 2;
  const shortTripFloor = d >= 0.25 && d < 1.2 ? 6 : (d < 0.25 ? 4 : 0);
  return Math.max(raw, byRoadSpeed + signalPenalty, byStraight + signalPenalty, shortTripFloor);
};

const getCandidateQueries = (address = '') => {
  const addr = String(address || '').trim();
  return [
    addr,
    addr.split(/[,\(]/)[0].trim(),
    addr.replace(/제주특별자치도/g, '제주').replace(/특별자치도/g, '').trim(),
  ].filter(Boolean);
};

const fetchKakaoJson = async (url, restKey) => {
  const r = await fetch(url, {
    headers: { Authorization: `KakaoAK ${restKey}` },
  });
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`kakao http ${r.status}: ${body.slice(0, 180)}`);
  }
  return r.json();
};

const fetchJson = async (url, headers = {}) => {
  const r = await fetch(url, { headers });
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`http ${r.status}: ${body.slice(0, 180)}`);
  }
  return r.json();
};

const geocodeWithKakao = async ({ address, restKey }) => {
  const queries = getCandidateQueries(address);
  for (const q of queries) {
    const addrUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(q)}&size=1`;
    const addrJson = await fetchKakaoJson(addrUrl, restKey);
    if (Array.isArray(addrJson?.documents) && addrJson.documents.length > 0) {
      const doc = addrJson.documents[0];
      const lat = toNum(doc.y);
      const lon = toNum(doc.x);
      if (lat != null && lon != null) return { lat, lon, source: 'address', query: q };
    }

    const kwUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(q)}&size=1`;
    const kwJson = await fetchKakaoJson(kwUrl, restKey);
    if (Array.isArray(kwJson?.documents) && kwJson.documents.length > 0) {
      const doc = kwJson.documents[0];
      const lat = toNum(doc.y);
      const lon = toNum(doc.x);
      if (lat != null && lon != null) return { lat, lon, source: 'keyword-address', query: q };
    }
  }
  return null;
};

const geocodeWithNominatim = async ({ address }) => {
  const queries = getCandidateQueries(address);
  for (const q of queries) {
    const json = await fetchJson(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=kr&accept-language=ko&q=${encodeURIComponent(q)}`,
      { Accept: 'application/json', 'Accept-Language': 'ko' }
    );
    if (Array.isArray(json) && json.length > 0) {
      const doc = json[0];
      const lat = toNum(doc.lat);
      const lon = toNum(doc.lon);
      if (lat != null && lon != null) return { lat, lon, source: 'nominatim', query: q };
    }
  }
  return null;
};

const requestDirection = async ({ origin, destination, restKey, priority }) => {
  const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin.lon},${origin.lat}&destination=${destination.lon},${destination.lat}&priority=${priority}`;
  const json = await fetchKakaoJson(url, restKey);
  const summary = json?.routes?.[0]?.summary;
  if (!summary) throw new Error(`kakao directions empty (${priority})`);
  const distanceKm = Number(summary.distance || 0) / 1000;
  const durationMins = Math.ceil(Number(summary.duration || 0) / 60);
  return {
    priority,
    distanceKm: Math.max(0, distanceKm),
    durationMins: Math.max(1, durationMins),
  };
};

const requestOsrmDirection = async ({ origin, destination }) => {
  const json = await fetchJson(`https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=false`);
  const summary = json?.routes?.[0];
  if (!summary) throw new Error('osrm route unavailable');
  return {
    priority: 'OSRM',
    distanceKm: Math.max(0, Number(summary.distance || 0) / 1000),
    durationMins: Math.max(1, Math.ceil(Number(summary.duration || 0) / 60)),
  };
};

export default async function handler(req, res) {
  setCors(req, res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const restKey = process.env.KAKAO_REST_API_KEY || process.env.KAKAO_API_KEY || DEFAULT_KAKAO_REST_KEY;
  const {
    fromAddress = '',
    toAddress = '',
    fromCoord: rawFromCoord = null,
    toCoord: rawToCoord = null,
  } = req.body || {};

  if (!String(fromAddress).trim() || !String(toAddress).trim()) {
    return res.status(400).json({ error: 'fromAddress and toAddress are required' });
  }

  try {
    const clientFromCoord = rawFromCoord && toNum(rawFromCoord.lat) != null && toNum(rawFromCoord.lon) != null
      ? { lat: toNum(rawFromCoord.lat), lon: toNum(rawFromCoord.lon), source: 'client-geo', query: String(fromAddress || '').trim() }
      : null;
    const clientToCoord = rawToCoord && toNum(rawToCoord.lat) != null && toNum(rawToCoord.lon) != null
      ? { lat: toNum(rawToCoord.lat), lon: toNum(rawToCoord.lon), source: 'client-geo', query: String(toAddress || '').trim() }
      : null;

    const geocoder = restKey ? geocodeWithKakao : geocodeWithNominatim;
    const [fromCoord, toCoord] = await Promise.all([
      clientFromCoord ? Promise.resolve(clientFromCoord) : geocoder({ address: fromAddress, restKey }),
      clientToCoord ? Promise.resolve(clientToCoord) : geocoder({ address: toAddress, restKey }),
    ]);
    if (!fromCoord || !toCoord) {
      return res.status(422).json({ error: 'geocode failed', fromCoord: !!fromCoord, toCoord: !!toCoord });
    }

    if (!restKey) {
      return res.status(500).json({ error: 'kakao rest key missing' });
    }

    const [recommend, timeBased] = await Promise.allSettled([
      requestDirection({ origin: fromCoord, destination: toCoord, restKey, priority: 'RECOMMEND' }),
      requestDirection({ origin: fromCoord, destination: toCoord, restKey, priority: 'TIME' }),
    ]);

    const candidates = [recommend, timeBased]
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);
    if (!candidates.length) return res.status(502).json({ error: 'kakao directions failed' });
    const primary = candidates[0];
    const secondary = candidates[1] || candidates[0];

    const baseDistance = (primary.distanceKm + secondary.distanceKm) / 2;
    const baseDuration = Math.max(primary.durationMins, secondary.durationMins);
    const straightKm = haversineKm(fromCoord.lat, fromCoord.lon, toCoord.lat, toCoord.lon);
    const isSameAddress = String(fromAddress).trim() === String(toAddress).trim();
    const verifiedDuration = verifyDurationMins(baseDistance, straightKm, baseDuration, isSameAddress);

    return res.status(200).json({
      provider: 'kakao',
      distanceKm: +baseDistance.toFixed(1),
      durationMins: verifiedDuration,
      review: {
        primary,
        secondary,
        straightKm: +straightKm.toFixed(3),
        adjusted: verifiedDuration !== baseDuration,
      },
      geocode: {
        from: fromCoord,
        to: toCoord,
      },
    });
  } catch (e) {
    return res.status(500).json({ error: 'route verify failed', details: e?.message || 'unknown error' });
  }
}
