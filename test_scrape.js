import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('https://naver.me/FN7XYjmW', { waitUntil: 'networkidle2' });

    // Wait for the place title to be parsed. Naver place title often has class 'Fc1rA' or similar, but let's just get window title.
    const title = await page.title();

    // Let's get the full pcmap url
    const url = page.url();
    console.log('Redirected to:', url);
    console.log('Title:', title);

    // Evaluate to find basic texts inside the app-root
    const texts = await page.evaluate(() => {
        return document.body.innerText.substring(0, 1000);
    });
    console.log('Body Text:', texts);
    await browser.close();
})();
