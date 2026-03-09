import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
const normalizeSpace = (v = '') => String(v || '').replace(/\s+/g, ' ').trim();
const cleanTitle = (v = '') => normalizeSpace(v)
  .replace(/\s*-\s*네이버\s*지도.*/i, '')
  .replace(/\s*네이버\s*지도.*/i, '')
  .replace(/^네이버\s*지도\s*/i, '')
  .trim();

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
      .find((t) => /(제주|서울|부산|인천|대구|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남)/.test(t) && /\d/.test(t));
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

const extractAddressFromBlob = (blob = '') => {
  const text = normalizeSpace(blob);
  const patterns = [
    /(제주특별자치도\s*[가-힣A-Za-z0-9\s\-]+?\d+(?:-\d+)?)/,
    /((?:서울|부산|인천|대구|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)\s*[가-힣A-Za-z0-9\s\-]+?\d+(?:-\d+)?)/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[1]) return normalizeSpace(m[1]);
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
    /브레이크|라스트오더|입장마감|휴무|영업\s*종료|영업\s*중|영업시간|운영시간/.test(t)
  );
  return Array.from(new Set(rich)).slice(0, 24).join('\n');
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
    if (/영업|리뷰|사진|예약|전화|길찾기|주차|주소/.test(name)) continue;
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
      if (/영업|리뷰|사진|예약|전화|길찾기/.test(name)) continue;
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
    if (rootMeta?.title) title = cleanTitle(rootMeta.title) || title;
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
        .find((v) => v && !/네이버|지도|리뷰|길찾기|전화/.test(v) && /[가-힣A-Za-z]/.test(v) && v.length <= 40);
      if (firstPlaceLine) title = firstPlaceLine;
    }
    if (!address) address = extractAddressFromBlob(textBlob);
    if (!hours) hours = extractHoursFromBlob(textBlob);
    if (!menus?.length) menus = extractMenusFromBlob(textBlob);

    title = cleanTitle(title);
    address = normalizeSpace(address);
    hours = String(hours || '').trim();
    menus = Array.isArray(menus) ? menus : [];

    return res.status(200).json({ title, address, hours, menus, finalUrl: page.url() });
  } catch (error) {
    return res.status(500).json({ error: 'Scraping failed', details: error?.message || 'unknown error' });
  } finally {
    if (browser) {
      try { await browser.close(); } catch (_) { /* noop */ }
    }
  }
}
