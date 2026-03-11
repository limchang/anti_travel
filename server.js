import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import groqAnalyzeHandler from './api/grok-analyze.js';
import aiKeyHandler from './api/ai-key.js';
import geminiLinkAnalyzeHandler from './api/gemini-link-analyze.js';
import perplexityNearbyHandler from './api/perplexity-nearby.js';
import routeVerifyHandler from './api/route-verify.js';

const app = express();
app.use(cors());
app.use(express.json());

app.all('/api/groq-analyze', (req, res) => groqAnalyzeHandler(req, res));
app.all('/api/grok-analyze', (req, res) => groqAnalyzeHandler(req, res));
app.all('/api/ai-key', (req, res) => aiKeyHandler(req, res));
app.all('/api/gemini-link-analyze', (req, res) => geminiLinkAnalyzeHandler(req, res));
app.all('/api/perplexity-nearby', (req, res) => perplexityNearbyHandler(req, res));
app.all('/api/route-verify', (req, res) => routeVerifyHandler(req, res));

app.post('/api/scrape', async (req, res) => {
    const { url } = req.body;
    if (!url || !url.includes('naver.com') && !url.includes('naver.me')) {
        return res.status(400).json({ error: 'Invalid Naver Map URL' });
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Set viewport
        await page.setViewport({ width: 1280, height: 800 });

        // Go to URL and wait for the entryIframe to load
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Naver Map dynamically loads content inside an iframe #entryIframe
        // If it's naver.me, it redirects to pcmap.place.naver.com or map.naver.com
        await page.waitForSelector('#entryIframe', { timeout: 10000 }).catch(() => { });

        let title = await page.title();
        title = title.replace(' - 네이버지도', '').replace('네이버 지도', '').trim();

        let frameElement = await page.$('#entryIframe');
        let hours = '';
        let menus = [];
        let address = '';

        if (frameElement) {
            const frame = await frameElement.contentFrame();

            // Wait a little bit for the frame to render
            await new Promise(r => setTimeout(r, 1000));

            // 1. Get title if not accurately fetched from main page
            const frameTitle = await frame.title();
            if (frameTitle) title = frameTitle.replace('네이버 지도', '').trim();

            // Try to find the title element inside the frame just in case
            const inFrameTitle = await frame.evaluate(() => {
                const titleEl = document.querySelector('.Fc1rA') || document.querySelector('.GHAhO') || document.querySelector('span.Fc1rA');
                return titleEl ? titleEl.innerText : null;
            });
            if (inFrameTitle) title = inFrameTitle;

            // 2. Get business hours (Very often placed under an element with '영업시간', or inside a specific class '.U7pYf', '.A_cdD')
            // Try to click the "영업시간 더보기" first if it exists
            await frame.evaluate(() => {
                const expandBtns = Array.from(document.querySelectorAll('a, button')).filter(e => e.innerText.includes('영업시간') || e.getAttribute('aria-expanded') === 'false');
                for (let btn of expandBtns) {
                    try { btn.click(); } catch (e) { }
                }
            }).catch(() => { });

            await new Promise(r => setTimeout(r, 500));

            hours = await frame.evaluate(() => {
                // Find elements that look like time
                const timeRows = Array.from(document.querySelectorAll('.UITkP, .A_cdD, .w9m60, time'));
                if (timeRows.length > 0) {
                    return Array.from(new Set(timeRows.map(row => row.innerText.trim().replace(/\n/g, ' ')))).join('\n---\n');
                }
                return '';
            }).catch(() => '');

            address = await frame.evaluate(() => {
                const selectors = ['.LDgIH', '.IQ7jf', '.nQ7Lh', '.zPfVt', '[data-testid="address"]', 'span[class*="address"]'];
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el?.textContent) {
                        const txt = el.textContent.trim();
                        if (txt && /[가-힣]/.test(txt)) return txt;
                    }
                }
                const fallback = Array.from(document.querySelectorAll('span, div, a'))
                    .map(el => (el.textContent || '').trim().replace(/\\s+/g, ' '))
                    .find(t => /(제주|서울|부산|인천|대구|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남)/.test(t) && /\\d/.test(t) && t.length < 60 && t.length > 5);
                return fallback || '';
            }).catch(() => '');

            // 3. Get Menus (Usually '.Sqg65' or '.lPzOq' is the item container, '.lPzOq' / '.YwYLL' for name, '.GXS1p' for price)
            menus = await frame.evaluate(() => {
                const items = Array.from(document.querySelectorAll('li, div')).filter(el => {
                    return el.querySelector('.lPzOq') || el.querySelector('.YwYLL') || el.className.includes('menu_item');
                });

                const result = [];
                for (let el of items) {
                    const nameEl = el.querySelector('.lPzOq') || el.querySelector('.YwYLL') || el.querySelector('.name');
                    const priceEl = el.querySelector('.GXS1p') || el.querySelector('.price');

                    if (nameEl && priceEl) {
                        const name = nameEl.innerText.trim();
                        const price = parseInt(priceEl.innerText.replace(/[^0-9]/g, ''), 10) || 0;

                        // Avoid duplicates
                        if (!result.find(r => r.name === name)) {
                            result.push({ name, price });
                        }
                    }
                }
                return result.slice(0, 3);
            }).catch(() => []);

        } else {
            // Direct pcmap context (mobile view)
            const inPageTitle = await page.evaluate(() => {
                const titleEl = document.querySelector('.Fc1rA') || document.querySelector('.GHAhO');
                return titleEl ? titleEl.innerText : null;
            });
            if (inPageTitle) title = inPageTitle;

            hours = await page.evaluate(() => {
                const timeRows = Array.from(document.querySelectorAll('.UITkP, .A_cdD, .w9m60, time'));
                if (timeRows.length > 0) {
                    return Array.from(new Set(timeRows.map(row => row.innerText.trim().replace(/\n/g, ' ')))).join('\n---\n');
                }
                return '';
            }).catch(() => '');

            address = await page.evaluate(() => {
                const selectors = ['.LDgIH', '.IQ7jf', '.nQ7Lh', '.zPfVt', '[data-testid="address"]', 'span[class*="address"]'];
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el?.textContent) {
                        const txt = el.textContent.trim();
                        if (txt && /[가-힣]/.test(txt)) return txt;
                    }
                }
                const fallback = Array.from(document.querySelectorAll('span, div, a'))
                    .map(el => (el.textContent || '').trim().replace(/\\s+/g, ' '))
                    .find(t => /(제주|서울|부산|인천|대구|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남)/.test(t) && /\\d/.test(t) && t.length < 60 && t.length > 5);
                return fallback || '';
            }).catch(() => '');

            menus = await page.evaluate(() => {
                const items = Array.from(document.querySelectorAll('li, div')).filter(el => {
                    return el.querySelector('.lPzOq') || el.querySelector('.YwYLL');
                });

                const result = [];
                for (let el of items) {
                    const nameEl = el.querySelector('.lPzOq') || el.querySelector('.YwYLL');
                    const priceEl = el.querySelector('.GXS1p');

                    if (nameEl && priceEl) {
                        const name = nameEl.innerText.trim();
                        const price = parseInt(priceEl.innerText.replace(/[^0-9]/g, ''), 10) || 0;

                        if (!result.find(r => r.name === name)) {
                            result.push({ name, price });
                        }
                    }
                }
                return result.slice(0, 3);
            }).catch(() => []);
        }

        res.json({ title, address, hours, menus });
    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({ error: 'Scraping failed', details: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Scraper server running on http://localhost:${PORT}`);
});
