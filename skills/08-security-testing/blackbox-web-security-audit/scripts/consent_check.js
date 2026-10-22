// Fresh-profile load, no banner interaction: which trackers fire + which cookies exist
// pre-consent. Reads config.json for chromePath and consentUrls.
// Usage: npm i puppeteer-core && node scripts/consent_check.js
//   or:  node scripts/consent_check.js <outFile> <url>...
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const cfg = JSON.parse(fs.readFileSync(path.resolve('config.json'), 'utf8'));
let [, , outFile, ...urls] = process.argv;
outFile = outFile || 'evidence/browser_preconsent.json';
if (urls.length === 0) urls = cfg.consentUrls || [];
if (urls.length === 0) { console.error('No consent URLs. Set consentUrls in config.json or pass them as args.'); process.exit(1); }

const TRACK = /google-analytics\.com|googletagmanager\.com|analytics\.google|doubleclick|facebook\.(com|net)|connect\.facebook|youtube\.com|mailerlite|hotjar|clarity\.ms|linkedin/i;

(async () => {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: cfg.chromePath,
    headless: true,
  });
  const results = {};
  for (const url of urls) {
    const ctx = await browser.createBrowserContext(); // fresh, empty profile
    const page = await ctx.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36');
    const reqs = [];
    page.on('request', r => { if (TRACK.test(r.url())) reqs.push(r.method() + ' ' + r.url().slice(0, 160)); });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.evaluate(() => window.scrollBy(0, 800)); // some optimizers delay scripts until interaction
    await new Promise(r => setTimeout(r, 8000));
    const cdp = await page.createCDPSession();
    const { cookies } = await cdp.send('Network.getAllCookies');
    const banner = await page.evaluate(() => {
      const el = document.querySelector('#cookie-law-info-bar, .cky-consent-container, #cookie-notice, [id*="cookie"][class*="banner"], [class*="cookie-consent"], #CybotCookiebotDialog');
      return el ? { selector: el.id || el.className, visible: !!(el.offsetWidth || el.offsetHeight), text: el.innerText.slice(0, 200) } : null;
    });
    const consentMode = await page.evaluate(() =>
      (window.dataLayer || []).filter(e => e && e[0] === 'consent').map(e => Array.from(e)));
    results[url] = {
      banner, consentMode,
      trackerRequests: [...new Set(reqs)],
      collectHits: reqs.filter(r => /\/g\/collect|\/collect\?/.test(r)).length,
      cookies: cookies.map(c => ({ name: c.name, domain: c.domain, secure: c.secure, httpOnly: c.httpOnly, sameSite: c.sameSite || 'unset', expires: c.expires > 0 ? new Date(c.expires * 1000).toISOString().slice(0, 10) : 'session' })),
    };
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
