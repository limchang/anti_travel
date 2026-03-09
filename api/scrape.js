import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
const normalizeSpace = (v = '') => String(v || '').replace(/\s+/g, ' ').trim();
const BAD_TEXT = /(translateX|translateY|이미지\s*개수|이전\s*페이지|다음\s*페이지|닫기|펼치기|접기|정보\s*더보기|지도|길찾기|리뷰|전화|저장|공유)/i;
const cleanTitle = (v = '') => normalizeSpace(v)
  .replace(/\s*-\s*네이버\s*지도.*/i, '')
  .replace(/\s*네이버\s*지도.*/i, '')
  .replace(/^네이버\s*지도\s*/i, '')
  .trim();
const isLikelyPlaceName = (v = '') => {
  const t = normalizeSpace(v);
  if (!t || t.length < 2 || t.length > 48) return false;
  if (BAD_TEXT.test(t)) return false;
  if (/(영업시간|운영시간|메뉴|주소|리뷰|평점|주차)/.test(t)) return false;
  if (!/[가-힣A-Za-z]/.test(t)) return false;
  return true;
};
const isLikelyAddress = (v = '') => {
  const t = normalizeSpace(v);
  if (!t || t.length < 8 || t.length > 120) return false;
  if (BAD_TEXT.test(t)) return false;
  if (!/(제주|서울|부산|인천|대구|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남)/.test(t)) return false;
  if (!/\d/.test(t)) return false;
  if (!/(로|길|대로|번길|읍|면|동|리)/.test(t)) return false;
  return true;
};
const sanitizeHoursText = (raw = '') => {
  const lines = String(raw || '')
    .split(/\r?\n/)
    .map((v) => normalizeSpace(v))
    .filter(Boolean)
    .filter((v) => !BAD_TEXT.test(v));
  const keep = lines.filter((t) =>
    /(월|화|수|목|금|토|일)\b/.test(t) ||
    /매일\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/.test(t) ||
    /\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/.test(t) ||
    /브레이크|라스트오더|입장마감|휴무/.test(t)
  );
  return Array.from(new Set(keep)).slice(0, 24).join('\n');
};

const isNaverUrl = (raw = '') => {
  const v = String(raw || '').trim();
  return /^https?:\/\/(naver\.me|map\.naver\.com|pcmap\.place\.naver\.com|m\.place\.naver\.com)\//i.test(v);
};

const extractAddressInPage = async (ctx) => {
  return ctx.evaluate(() => {
    const selectors = ['.LDgIH', '.IQ7jf', '.nQ7Lh', '.zPfVt', '[data-testid="address"]', 'span[class*="address"]'];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el?.textContent) {
        const txt = el.textContent.trim();
        if (txt && /[가-힣]/.test(txt)) return txt;
      }
    }
    const fallback = Array.from(document.querySelectorAll('span, div, a'))
      .map((el) => (el.textContent || '').trim())
      .find((t) => /(제주|서울|부산|인천|대구|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남)/.test(t) && /\d/.test(t) && /(로|길|대로|번길|읍|면|동|리)/.test(t));
    return fallback || '';
  }).catch(() => '');
};

const extractMetaInPage = async (ctx) => {
  return ctx.evaluate(() => {
    const pick = (sel) => document.querySelector(sel)?.getAttribute('content') || '';
    const title = pick('meta[property="og:title"]') || pick('meta[name="og:title"]') || '';
    const desc = pick('meta[property="og:description"]') || pick('meta[name="description"]') || '';
    const textBlob = (document.body?.innerText || '').slice(0, 12000);
    return { title, desc, textBlob };
  }).catch(() => ({ title: '', desc: '', textBlob: '' }));
};

const extractStructuredInPage = async (ctx) => {
  return ctx.evaluate(() => {
    const out = { title: '', address: '', hours: '' };
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    for (const s of scripts) {
      try {
        const json = JSON.parse(s.textContent || '{}');
        const nodes = Array.isArray(json) ? json : (Array.isArray(json['@graph']) ? json['@graph'] : [json]);
        for (const n of nodes) {
          if (!out.title && typeof n?.name === 'string') out.title = n.name;
          const adr = n?.address;
          if (!out.address && adr) {
            if (typeof adr === 'string') out.address = adr;
            else if (typeof adr === 'object') {
              const composed = [adr.addressRegion, adr.addressLocality, adr.streetAddress, adr.postalCode].filter(Boolean).join(' ');
              if (composed) out.address = composed;
            }
          }
          const oh = n?.openingHours || n?.openingHoursSpecification;
          if (!out.hours && oh) {
            if (Array.isArray(oh)) {
              out.hours = oh.map((v) => typeof v === 'string' ? v : `${v?.dayOfWeek || ''} ${v?.opens || ''}-${v?.closes || ''}`).join('\n');
            } else if (typeof oh === 'string') {
              out.hours = oh;
            }
          }
        }
      } catch (_) { /* noop */ }
    }
    return out;
  }).catch(() => ({ title: '', address: '', hours: '' }));
};

const extractAddressFromBlob = (blob = '') => {
  const lines = String(blob || '').split(/\r?\n/).map((v) => normalizeSpace(v)).filter(Boolean);
  const patterns = [
    /(제주특별자치도\s*[가-힣A-Za-z0-9\s\-]+?\d+(?:-\d+)?)/,
    /((?:서울|부산|인천|대구|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)\s*[가-힣A-Za-z0-9\s\-]+?\d+(?:-\d+)?)/,
  ];
  for (const line of lines) {
    if (BAD_TEXT.test(line)) continue;
    for (const p of patterns) {
      const m = line.match(p);
      if (m?.[1] && isLikelyAddress(m[1])) return normalizeSpace(m[1]);
    }
  }
  const text = normalizeSpace(blob);
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[1] && isLikelyAddress(m[1])) return normalizeSpace(m[1]);
  }
  return '';
};

const extractHoursFromBlob = (blob = '') => {
  const lines = String(blob || '')
    .split(/\r?\n/)
    .map((v) => normalizeSpace(v))
    .filter(Boolean);
  const rich = lines.filter((t) =>
    /(월|화|수|목|금|토|일)\b/.test(t) ||
    /매일\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/.test(t) ||
    /\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/.test(t) ||
    /브레이크|라스트오더|입장마감|휴무|영업시간|운영시간/.test(t)
  );
  return sanitizeHoursText(Array.from(new Set(rich)).slice(0, 24).join('\n'));
};

const extractMenusFromBlob = (blob = '') => {
  const lines = String(blob || '')
    .split(/\r?\n/)
    .map((v) => normalizeSpace(v))
    .filter(Boolean);
  const result = [];
  for (const txt of lines) {
    const m = txt.match(/([가-힣A-Za-z0-9\s\-\(\)\/]{2,40})\s*([0-9][0-9,]{2,})\s*원?/);
    if (!m) continue;
    const name = normalizeSpace(m[1]);
    const price = Number(String(m[2]).replace(/,/g, '')) || 0;
    if (!name || price <= 0) continue;
    if (BAD_TEXT.test(name)) continue;
    if (/영업|리뷰|사진|예약|전화|길찾기|주차|주소|페이지/.test(name)) continue;
    if (!result.find((r) => r.name === name)) result.push({ name, price });
    if (result.length >= 5) break;
  }
  return result;
};

const extractHoursInPage = async (ctx) => {
  // 영업시간 요약 라인(영업 중/종료)과 더보기 버튼을 반복 클릭해서 상세 시간을 펼친다.
  const expandHours = async () => {
    await ctx.evaluate(() => {
      const clickables = Array.from(document.querySelectorAll('a, button, [role="button"], div, span'));
      clickables.forEach((el) => {
        const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!t) return;
        if (/(영업\s*시간|운영\s*시간|영업\s*정보|영업\s*중|영업\s*종료|더보기|전체보기|펼치기|정보\s*더보기|매일\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})/i.test(t)) {
          try { el.click(); } catch (_) { /* noop */ }
        }
      });
    }).catch(() => {});
  };
  await expandHours();
  await wait(500);
  await expandHours();
  await wait(700);

  return ctx.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('li, div, span, p'))
      .map((el) => (el.textContent || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    const rich = rows.filter((t) =>
      /(월|화|수|목|금|토|일)/.test(t) ||
      /매일\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/.test(t) ||
      /\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/.test(t) ||
      /브레이크|라스트오더|입장마감|휴무|영업\s*종료|영업\s*중|영업시간|운영시간/.test(t)
    );
    const unique = Array.from(new Set(rich))
      .filter((t) => t.length >= 4 && t.length <= 80)
      .slice(0, 20);
    return unique.join('\n');
  }).catch(() => '');
};

const extractMenusInPage = async (ctx) => {
  await ctx.evaluate(() => {
    const clickables = Array.from(document.querySelectorAll('a, button, [role="button"]'));
    const menuTab = clickables.find((el) => /메뉴/.test((el.textContent || '').trim()));
    if (menuTab) {
      try { menuTab.click(); } catch (_) { /* noop */ }
    }
  }).catch(() => {});
  await wait(600);

  return ctx.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('li, div'));
    const result = [];

    for (const el of rows) {
      const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!txt) continue;
      const m = txt.match(/([가-힣A-Za-z0-9\s\-\(\)\/]{2,40})\s*([0-9][0-9,]{2,})\s*원?/);
      if (!m) continue;
      const name = m[1].trim();
      const price = Number(String(m[2]).replace(/,/g, '')) || 0;
      if (!name || price <= 0) continue;
      if (/영업|리뷰|사진|예약|전화|길찾기|페이지|translate/i.test(name)) continue;
      if (!result.find((r) => r.name === name)) result.push({ name, price });
      if (result.length >= 5) break;
    }
    return result;
  }).catch(() => []);
};

async function launchBrowser() {
  const onVercel = !!process.env.VERCEL;
  if (onVercel) {
    const executablePath = await chromium.executablePath();
    return puppeteerCore.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 900 },
      executablePath,
      headless: true,
    });
  }
  return puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 900 },
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body || {};
  if (!isNaverUrl(url)) {
    return res.status(400).json({ error: 'Invalid Naver map URL' });
  }

  let browser;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });
    await wait(2200);

    let title = cleanTitle((await page.title()) || '');
    let address = '';
    let hours = '';
    let menus = [];
    let textBlob = '';

    const rootMeta = await extractMetaInPage(page);
    const rootStructured = await extractStructuredInPage(page);
    if (rootMeta?.title) title = cleanTitle(rootMeta.title) || title;
    if (rootStructured?.title) title = cleanTitle(rootStructured.title) || title;
    if (!address && rootStructured?.address) address = normalizeSpace(rootStructured.address);
    if (!hours && rootStructured?.hours) hours = sanitizeHoursText(rootStructured.hours);
    textBlob += `\n${rootMeta?.desc || ''}\n${rootMeta?.textBlob || ''}`;

    const frameElement = await page.$('#entryIframe');
    if (frameElement) {
      const frame = await frameElement.contentFrame();
      if (frame) {
        await wait(1500);
        const inFrameTitle = await frame.evaluate(() => {
          const titleEl = document.querySelector('.Fc1rA') || document.querySelector('.GHAhO') || document.querySelector('span.Fc1rA');
          return titleEl ? titleEl.textContent?.trim() : '';
        }).catch(() => '');
        if (inFrameTitle) title = cleanTitle(inFrameTitle);

        hours = await extractHoursInPage(frame);
        address = await extractAddressInPage(frame);
        menus = await extractMenusInPage(frame);
        const frameMeta = await extractMetaInPage(frame);
        const frameStructured = await extractStructuredInPage(frame);
        if (frameStructured?.title) title = cleanTitle(frameStructured.title) || title;
        if (!address && frameStructured?.address) address = normalizeSpace(frameStructured.address);
        if (!hours && frameStructured?.hours) hours = sanitizeHoursText(frameStructured.hours);
        textBlob += `\n${frameMeta?.desc || ''}\n${frameMeta?.textBlob || ''}`;
      }
    } else {
      hours = await extractHoursInPage(page);
      address = await extractAddressInPage(page);
      menus = await extractMenusInPage(page);
    }

    if (!title) {
      // 본문 첫 줄 후보에서 장소명 추출
      const firstPlaceLine = String(textBlob || '')
        .split(/\r?\n/)
        .map((v) => normalizeSpace(v))
        .find((v) => isLikelyPlaceName(v));
      if (firstPlaceLine) title = firstPlaceLine;
    }
    if (!address) address = extractAddressFromBlob(textBlob);
    if (!hours) hours = extractHoursFromBlob(textBlob);
    if (!menus?.length) menus = extractMenusFromBlob(textBlob);

    title = cleanTitle(title);
    if (!isLikelyPlaceName(title)) title = '';
    address = isLikelyAddress(address) ? normalizeSpace(address) : '';
    hours = sanitizeHoursText(String(hours || '').trim());
    menus = Array.isArray(menus) ? menus.filter((m) => isLikelyPlaceName(m?.name || '') && Number(m?.price) > 0).slice(0, 5) : [];

    return res.status(200).json({ title, address, hours, menus, finalUrl: page.url() });
  } catch (error) {
    return res.status(500).json({ error: 'Scraping failed', details: error?.message || 'unknown error' });
  } finally {
    if (browser) {
      try { await browser.close(); } catch (_) { /* noop */ }
    }
  }
}
