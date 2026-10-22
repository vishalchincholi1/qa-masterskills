// HTML report -> A4 PDF via headless Chrome. Reads config.json for chromePath + footer.
// Usage: node scripts/export_pdf.js [in.html] [out.pdf]
const p = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const cfg = JSON.parse(fs.readFileSync(path.resolve('config.json'), 'utf8'));
const inHtml = process.argv[2] || cfg.output.html;
const outPdf = process.argv[3] || cfg.output.pdf;
const foot1 = `${cfg.branding.footerText} v${cfg.engagement.version} · ${cfg.engagement.classification.split(' — ')[0]}`;

(async () => {
  const b = await p.launch({ executablePath: cfg.chromePath });
  const pg = await b.newPage();
  await pg.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await pg.goto(require('url').pathToFileURL(path.resolve(inHtml)).href, { waitUntil: 'networkidle0' });
  await pg.evaluateHandle('document.fonts.ready');
  const foot = '<div style="width:100%;font:8px Arial,sans-serif;color:#6B7280;padding:0 16mm;display:flex;justify-content:space-between">'
    + `<span>${foot1}</span>`
    + '<span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>';
  await pg.pdf({
    path: outPdf, format: 'A4', printBackground: true,
    margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' },
    displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: foot,
  });
  await b.close();
  console.log('written', outPdf);
})().catch(e => { console.error(e); process.exit(1); });
