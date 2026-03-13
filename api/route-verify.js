import { setCors, handleOptions } from './_cors.js';

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const DEFAULT_KAKAO_REST_KEY = 'b312628369f47e04894f338b7fc0b318';

const getCandidateQueries = (address = '', placeName = '') => {
  const addr = String(address || '').trim();
  const name = String(placeName || '').trim();
  const normalizedAddr = addr.replace(/제주특별자치도/g, '제주').replace(/특별자치도/g, '').trim();
  return [
    name && addr ? `${name} ${addr}`.trim() : '',
    name && normalizedAddr ? `${name} ${normalizedAddr}`.trim() : '',
    name,
    addr,
    addr.split(/[,\(]/)[0].trim(),
    normalizedAddr,
  ].filter(Boolean).filter((value, index, list) => list.indexOf(value) === index);
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

const looksDetailedAddress = (address = '') => /(\d|번길|로\s*\d|길\s*\d|로\b|길\b)/.test(String(address || '').trim());

const tryKeywordSearch = async (query, restKey) => {
  const kwUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=1`;
  const kwJson = await fetchKakaoJson(kwUrl, restKey);
  if (Array.isArray(kwJson?.documents) && kwJson.documents.length > 0) {
    const doc = kwJson.documents[0];
    const lat = toNum(doc.y);
    const lon = toNum(doc.x);
    if (lat != null && lon != null) {
      return { lat, lon, source: 'keyword', query, placeName: String(doc.place_name || '').trim() };
    }
  }
  return null;
};

const tryAddressSearch = async (query, restKey) => {
  const addrUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}&size=1`;
  const addrJson = await fetchKakaoJson(addrUrl, restKey);
  if (Array.isArray(addrJson?.documents) && addrJson.documents.length > 0) {
    const doc = addrJson.documents[0];
    const lat = toNum(doc.y);
    const lon = toNum(doc.x);
    if (lat != null && lon != null) {
      return { lat, lon, source: 'address', query };
    }
  }
  return null;
};

const geocodeWithKakao = async ({ address, placeName = '', restKey }) => {
  const queries = getCandidateQueries(address, placeName);
  const addressIsDetailed = looksDetailedAddress(address);
  const nameQueries = queries.filter((query) => String(placeName || '').trim() && query.includes(String(placeName || '').trim()));
  const addressQueries = queries.filter((query) => !nameQueries.includes(query));

  if (!addressIsDetailed) {
    for (const q of nameQueries) {
      const keywordMatch = await tryKeywordSearch(q, restKey);
      if (keywordMatch) return keywordMatch;
    }
  }

  for (const q of addressQueries) {
    const addressMatch = await tryAddressSearch(q, restKey);
    if (addressMatch) return addressMatch;
  }

  for (const q of [...nameQueries, ...addressQueries]) {
    const keywordMatch = await tryKeywordSearch(q, restKey);
    if (keywordMatch) return keywordMatch;
  }

  if (addressIsDetailed) {
    for (const q of nameQueries) {
      const keywordMatch = await tryKeywordSearch(q, restKey);
      if (keywordMatch) return keywordMatch;
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
  const route = json?.routes?.[0];
  const summary = route?.summary;
  if (!summary) throw new Error(`kakao directions empty (${priority})`);
  const distanceKm = Number(summary.distance || 0) / 1000;
  const durationMins = Math.ceil(Number(summary.duration || 0) / 60);
  const path = (route?.sections || []).flatMap((section) => (
    Array.isArray(section?.roads)
      ? section.roads.flatMap((road) => {
        const vertices = Array.isArray(road?.vertexes) ? road.vertexes : [];
        const points = [];
        for (let idx = 0; idx < vertices.length; idx += 2) {
          const lon = toNum(vertices[idx]);
          const lat = toNum(vertices[idx + 1]);
          if (lat == null || lon == null) continue;
          points.push({ lat, lon });
        }
        return points;
      })
      : []
  ));
  return {
    priority,
    distanceKm: Math.max(0, distanceKm),
    durationMins: Math.max(1, durationMins),
    path,
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
    fromName = '',
    toName = '',
  } = req.body || {};

  if (!String(fromAddress).trim() || !String(toAddress).trim()) {
    return res.status(400).json({ error: 'fromAddress and toAddress are required' });
  }

  try {
    const geocoder = restKey ? geocodeWithKakao : geocodeWithNominatim;
    const [fromCoord, toCoord] = await Promise.all([
      geocoder({ address: fromAddress, placeName: fromName, restKey }),
      geocoder({ address: toAddress, placeName: toName, restKey }),
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
    const primary = recommend.status === 'fulfilled'
      ? recommend.value
      : timeBased.status === 'fulfilled'
        ? timeBased.value
        : null;
    const secondary = timeBased.status === 'fulfilled'
      ? timeBased.value
      : recommend.status === 'fulfilled'
        ? recommend.value
        : null;
    if (!primary) return res.status(502).json({ error: 'kakao directions failed' });

    return res.status(200).json({
      provider: 'kakao',
      priority: primary.priority,
      distanceKm: +Number(primary.distanceKm || 0).toFixed(1),
      durationMins: Math.max(1, Math.ceil(Number(primary.durationMins) || 0)),
      path: Array.isArray(primary.path) ? primary.path : [],
      review: {
        primary,
        secondary,
        geocodeMode: {
          from: fromCoord?.source || '',
          to: toCoord?.source || '',
        },
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
