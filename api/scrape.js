import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';

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
  await ctx.waitForTimeout?.(500).catch(() => {});
  await expandHours();
  await ctx.waitForTimeout?.(700).catch(() => {});

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
  await ctx.waitForTimeout?.(600).catch(() => {});

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
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1800);

    let title = (await page.title()) || '';
    title = title.replace(' - 네이버지도', '').replace('네이버 지도', '').trim();
    let address = '';
    let hours = '';
    let menus = [];

    const frameElement = await page.$('#entryIframe');
    if (frameElement) {
      const frame = await frameElement.contentFrame();
      if (frame) {
        await frame.waitForTimeout(1500);
        const inFrameTitle = await frame.evaluate(() => {
          const titleEl = document.querySelector('.Fc1rA') || document.querySelector('.GHAhO') || document.querySelector('span.Fc1rA');
          return titleEl ? titleEl.textContent?.trim() : '';
        }).catch(() => '');
        if (inFrameTitle) title = inFrameTitle;

        hours = await extractHoursInPage(frame);
        address = await extractAddressInPage(frame);
        menus = await extractMenusInPage(frame);
      }
    } else {
      hours = await extractHoursInPage(page);
      address = await extractAddressInPage(page);
      menus = await extractMenusInPage(page);
    }

    return res.status(200).json({ title, address, hours, menus });
  } catch (error) {
    return res.status(500).json({ error: 'Scraping failed', details: error?.message || 'unknown error' });
  } finally {
    if (browser) {
      try { await browser.close(); } catch (_) { /* noop */ }
    }
  }
}
