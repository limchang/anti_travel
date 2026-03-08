import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';

const isNaverUrl = (raw = '') => {
  const v = String(raw || '').trim();
  return /^https?:\/\/(naver\.me|map\.naver\.com|pcmap\.place\.naver\.com)\//i.test(v);
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
  return ctx.evaluate(() => {
    const timeRows = Array.from(document.querySelectorAll('.UITkP, .A_cdD, .w9m60, time'));
    if (timeRows.length > 0) {
      return Array.from(new Set(timeRows.map((row) => row.innerText.trim().replace(/\n/g, ' ')))).join('\n');
    }
    const textRows = Array.from(document.querySelectorAll('span, div')).map((el) => (el.textContent || '').trim()).filter(Boolean);
    const candidates = textRows.filter((t) => /\d{1,2}:\d{2}/.test(t) || /영업|브레이크|라스트오더|입장마감/.test(t));
    return Array.from(new Set(candidates)).slice(0, 6).join('\n');
  }).catch(() => '');
};

const extractMenusInPage = async (ctx) => {
  return ctx.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('li, div'));
    const result = [];

    for (const el of rows) {
      const txt = (el.textContent || '').trim();
      if (!txt) continue;
      const m = txt.match(/([가-힣A-Za-z0-9\s\-\(\)\/]{2,40})\s*([0-9][0-9,]{2,})\s*원?/);
      if (!m) continue;
      const name = m[1].trim();
      const price = Number(String(m[2]).replace(/,/g, '')) || 0;
      if (!name || price <= 0) continue;
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
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1200);

    let title = (await page.title()) || '';
    title = title.replace(' - 네이버지도', '').replace('네이버 지도', '').trim();
    let address = '';
    let hours = '';
    let menus = [];

    const frameElement = await page.$('#entryIframe');
    if (frameElement) {
      const frame = await frameElement.contentFrame();
      if (frame) {
        await frame.waitForTimeout(1000);
        const inFrameTitle = await frame.evaluate(() => {
          const titleEl = document.querySelector('.Fc1rA') || document.querySelector('.GHAhO') || document.querySelector('span.Fc1rA');
          return titleEl ? titleEl.textContent?.trim() : '';
        }).catch(() => '');
        if (inFrameTitle) title = inFrameTitle;

        await frame.evaluate(() => {
          const expandBtns = Array.from(document.querySelectorAll('a, button'))
            .filter((e) => /영업시간|더보기/.test(e.textContent || ''));
          expandBtns.forEach((btn) => {
            try { btn.click(); } catch (_) { /* noop */ }
          });
        }).catch(() => {});

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

