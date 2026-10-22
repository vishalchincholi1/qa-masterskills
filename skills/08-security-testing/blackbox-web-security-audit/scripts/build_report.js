// Builds report.docx + report.html (client deliverable) from one data set.
// Metadata + branding come from config.json; the findings/inventory/owasp/roadmap data
// come from report-data.js (edit THAT per engagement, not this generator).
// Usage: npm i docx && node scripts/build_report.js [outDir]
const fs = require('fs');
const path = require('path');
const d = require('docx');

const OUT = process.argv[2] || '.';
const cfg = JSON.parse(fs.readFileSync(path.resolve('config.json'), 'utf8'));
const data = require(path.resolve('report-data.js'));

const b = cfg.branding;
const C = { blue: b.blue, navy: b.navy, teal: b.teal, charcoal: b.charcoal, muted: b.muted, border: b.border, surface: b.surface };
// amber/red are functional severity colours, not a brand palette
const SEV = { Critical: '7A1F1F', High: 'C23B3B', Medium: 'B7791F', Low: '2581C4', Informational: '6B7280' };

const e = cfg.engagement;
const meta = {
  title: data.title || 'External Web Application Security Assessment',
  subtitle: data.subtitle || 'Non-intrusive black-box assessment',
  client: e.client,
  by: e.by,
  date: e.date,
  window: e.window,
  version: e.version,
  classification: e.classification,
  assets: cfg.assets,
};

const revisions = data.revisions;
const confidentiality = data.confidentiality;
const execSummary = data.execSummary;
const ratings = data.ratings;
const methodNote = data.methodNote;
const approach = data.approach;
const outOfScope = data.outOfScope;
const limitations = data.limitations;
const findings = data.findings;
const positives = data.positives;
const noFinding = data.noFinding;
const roadmap = data.roadmap;
const headerRule = data.headerRule;
const htaccess = data.htaccess;
const cspNote = data.cspNote;
const owasp = data.owasp;
const owaspNote = data.owaspNote;
const wstg = data.wstg;
const inventory = data.inventory;
const inventoryNote = data.inventoryNote;
const tools = data.tools;
const glossary = data.glossary;
const assetName = data.assetName || (a => a);
const posture = e.overallPosture || 'Moderate';

const SEV_ORDER = Object.keys(SEV);
findings.sort((a, b) => SEV_ORDER.indexOf(a.sev) - SEV_ORDER.indexOf(b.sev));
const counts = Object.fromEntries(Object.keys(SEV).map(s => [s, findings.filter(f => f.sev === s).length]));

// ---------------- HTML ----------------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const badge = s => `<span class="sev sev-${s.toLowerCase()}">${s}</span>`;
const ul = a => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
const rows = (h, data, fmt = x => esc(x)) => `<div class="tbl"><table><thead><tr>${h.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${data.map(r => `<tr>${r.map((c, i) => `<td>${fmt(c, i)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Security Assessment Report</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;700;800&family=Merriweather+Sans:wght@400;700&display=swap" rel="stylesheet">
<style>
:root{--ink:#38383E;--muted:#6B7280;--border:#D5DAE2;--surface:#F7F8FA;--raised:#fff;--code:#EDEFF3;--accent:#2581C4;
--critical:#7A1F1F;--high:#C23B3B;--medium:#B7791F;--low:#2581C4;--informational:#6B7280}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--ink:#F2F4F7;--muted:#9AA5B4;--border:#5C77A6;--surface:#041C3B;--raised:#0D2C4E;--code:#02121F;--accent:#5AA9E0;--low:#5AA9E0;--informational:#9AA5B4;--high:#E06666;--medium:#E0A84A;--critical:#F08080}}
:root[data-theme="dark"]{--ink:#F2F4F7;--muted:#9AA5B4;--border:#5C77A6;--surface:#041C3B;--raised:#0D2C4E;--code:#02121F;--accent:#5AA9E0;--low:#5AA9E0;--informational:#9AA5B4;--high:#E06666;--medium:#E0A84A;--critical:#F08080}
*{box-sizing:border-box}
body{margin:0;background:var(--surface);color:var(--ink);font:15px/24px "Merriweather Sans",Arial,sans-serif}
h1,h2,h3,th,dt{font-family:Rubik,Arial,sans-serif}
a{color:var(--accent)}
header{background:linear-gradient(150deg,#2581C4 0%,#1E274A 100%);color:#fff;padding:48px 16px}
header .wrap,main{max-width:1040px;margin:auto}
.kicker{font:600 12px/16px Rubik,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#66CCCC}
header h1{font-size:36px;line-height:44px;font-weight:800;margin:8px 0}
header p{margin:4px 0;color:#DCE6F2}
main{padding:24px 16px 64px}
section{background:var(--raised);border:1px solid var(--border);border-radius:16px;padding:24px;margin:24px 0}
h2{font-size:24px;line-height:32px;margin:0 0 16px}
h3{font-size:17px;line-height:26px;margin:20px 0 8px}
.notice{border-left:4px solid var(--high);padding:8px 16px;background:var(--code);border-radius:4px;font-size:14px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin:16px 0}
.stat{border:1px solid var(--border);border-radius:8px;padding:12px 16px;border-top:4px solid var(--c)}
.stat b{display:block;font:800 32px/40px Rubik,sans-serif;color:var(--c)}
.stat span{font:600 12px/16px Rubik,sans-serif;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.posture{display:inline-block;background:#9A6618;color:#fff;font:700 14px/20px Rubik,sans-serif;padding:6px 14px;border-radius:999px}
.sev{display:inline-block;font:600 12px/16px Rubik,sans-serif;padding:3px 10px;border-radius:999px;color:#fff;white-space:nowrap}
.sev-critical{background:#7A1F1F}.sev-high{background:#C23B3B}.sev-medium{background:#9A6618}.sev-low{background:#1F6FA8}.sev-informational{background:#6B7280}
.tbl{width:100%;overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:14px;line-height:20px}
th{font-weight:600;font-size:12px;line-height:16px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);text-align:left;border-bottom:2px solid var(--border);padding:8px}
td{border-bottom:1px solid var(--border);padding:10px 8px;vertical-align:top}
.finding{border:1px solid var(--border);border-left:6px solid var(--c);border-radius:8px;padding:16px 20px;margin:20px 0}
.finding .top{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}
.finding .top h3{margin:0}
.finding dl{display:grid;grid-template-columns:150px 1fr;gap:8px 16px;margin:14px 0 0}
.finding dt{font-weight:600;font-size:12px;line-height:22px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
.finding dd{margin:0;overflow-wrap:anywhere}
.finding dd ul{margin:0}
.ev{font-family:Consolas,"Courier New",monospace;font-size:13px;line-height:20px;background:var(--code);border-radius:4px;padding:10px 12px;margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
@media (max-width:640px){.finding dl{grid-template-columns:1fr}.finding dt{margin-top:6px}header h1{font-size:28px;line-height:36px}}
ul{padding-left:20px;margin:8px 0}li{margin:4px 0}
code,pre{font-family:Consolas,"Courier New",monospace;font-size:13px;background:var(--code);border-radius:4px}
pre{padding:14px;overflow-x:auto;line-height:20px}
.muted{color:var(--muted)}
footer{text-align:center;color:var(--muted);font-size:13px;padding:24px 16px}
@media print{
*{-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{background:#fff;color:#38383E;font-size:10pt;line-height:1.5}
header{min-height:250mm;display:flex;align-items:flex-end;padding:0 14mm 24mm;border-radius:6px;break-after:page}
header h1{font-size:30pt;line-height:1.15}
header p{font-size:11pt}
main{max-width:none;padding:0}
section{background:none;border:0;border-radius:0;padding:0;margin:0 0 9mm}
section.np{break-before:page}
h2{font-size:17pt;line-height:1.3;margin:0 0 5mm;padding-bottom:2mm;border-bottom:2px solid #66CCCC;color:#041C3B;break-after:avoid}
h3{font-size:12pt;break-after:avoid;color:#041C3B}
.tbl{overflow:visible}
table{font-size:8.5pt;line-height:1.4}
thead{display:table-header-group}
th{background:#041C3B;color:#fff;border-bottom:0;padding:5px 7px}
td{padding:5px 7px}
tr,.stat,li{break-inside:avoid}
.stats{gap:3mm}
.stat b{font-size:20pt;line-height:1.2}
.stat{padding:2.5mm 3mm}.stat span{font-size:6.5pt;letter-spacing:.03em}
.finding{break-inside:avoid;margin:0 0 7mm;padding:4mm 5mm;border-radius:4px}
.finding .top h3{font-size:12pt;margin:0}
.finding dl{grid-template-columns:34mm 1fr;gap:2mm 4mm;font-size:9pt;line-height:1.45}
.finding dt{font-size:7.5pt;line-height:1.6}
.ev,pre{font-size:7.5pt;line-height:1.45;padding:2.5mm 3mm}
p,li{orphans:3;widows:3}
.notice{font-size:8.5pt}
footer{display:none}
}
</style></head><body>
<header><div class="wrap">
<div class="kicker">${esc(meta.classification.split(' — ')[0])} · Security Assessment Report</div>
<h1>${esc(meta.title)}</h1>
<p>Prepared for: ${esc(meta.client)}</p>
<p>Prepared by: ${esc(meta.by)} · ${esc(meta.date)} · Version ${meta.version}</p>
</div></header>
<main>
<section><h2>Document control</h2>
${rows(['Field', 'Detail'], [['Document', meta.title], ['Version', `${meta.version} — Final`], ['Report date', meta.date], ['Testing window', meta.window], ['Prepared for', meta.client], ['Prepared by', meta.by], ['Classification', meta.classification]])}
<h3>Revision history</h3>${rows(['Version', 'Date', 'Change'], revisions)}
<p class="notice">${esc(confidentiality)}</p>
</section>
<section class="np"><h2>1. Executive summary</h2>
<p><span class="posture">Overall risk posture: ${esc(posture)}</span></p>
<div class="stats">${Object.entries(counts).map(([s, n]) => `<div class="stat" style="--c:var(--${s.toLowerCase()})"><b>${n}</b><span>${s}</span></div>`).join('')}</div>
${execSummary.map(p => `<p>${esc(p)}</p>`).join('')}
</section>
<section class="np"><h2>2. Engagement overview</h2>
<h3>2.1 Scope</h3>
${rows(['Asset', 'URL', 'Description'], meta.assets)}
<h3>2.2 Approach</h3>
<p>Assessment type: external, unauthenticated, non-intrusive (black-box). All requests were standard HTTP GET/HEAD requests at no more than one request per second, identified by a dedicated user-agent string.</p>
${ul(approach)}
<h3>2.3 Out of scope</h3>${ul(outOfScope)}
<h3>2.4 Limitations</h3>${ul(limitations)}
</section>
<section><h2>3. Risk rating methodology</h2>
${rows(['Severity', 'CVSS v3.1', 'Definition', 'Recommended remediation'], ratings, (c, i) => i === 0 ? badge(c) : esc(c))}
<p class="muted">${esc(methodNote)}</p>
</section>
<section class="np"><h2>4. Summary of findings</h2>
${rows(['ID', 'Finding', 'Affected asset(s)', 'Severity', 'CVSS', 'Status'], findings.map(f => [f.id, f.t, assetName(f.assets), f.sev, f.cvss.split(' · ')[0], 'Open']),
  (c, i) => i === 0 ? `<a href="#${c}">${c}</a>` : i === 3 ? badge(c) : esc(c))}
</section>
<section class="np"><h2>5. Detailed findings</h2>
${findings.map(f => `<div class="finding" id="${f.id}" style="--c:var(--${f.sev.toLowerCase()})">
<div class="top"><h3>${f.id} — ${esc(f.t)}</h3>${badge(f.sev)}</div>
<dl>
<dt>Affected asset(s)</dt><dd>${esc(assetName(f.assets))}</dd>
<dt>CVSS v3.1</dt><dd>${esc(f.cvss)}</dd>
<dt>Classification</dt><dd>${esc(f.cls)}</dd>
<dt>Status</dt><dd>Open</dd>
<dt>Description</dt><dd>${esc(f.desc)}</dd>
<dt>Evidence</dt><dd><pre class="ev">${esc(f.ev.join('\n'))}</pre></dd>
<dt>Impact</dt><dd>${esc(f.impact)}</dd>
<dt>Severity rationale</dt><dd>${esc(f.rationale)}</dd>
<dt>Recommendation</dt><dd>${ul(f.fix)}</dd>
<dt>References</dt><dd>${esc(f.refs)}</dd>
</dl></div>`).join('')}
</section>
${inventory && inventory.length ? `<section class="np"><h2>6. Component / version review</h2>
${rows(['Component', ...(data.inventoryCols || ['Installed', 'Latest available', 'Status'])], inventory, (c, i) => i === 0 ? `<b>${esc(c)}</b>` : esc(c))}
<p class="muted">${esc(inventoryNote || '')}</p></section>` : ''}
<section class="np"><h2>7. OWASP Top 10:2025 coverage</h2>
${rows(['Category', 'Name', 'Coverage', 'What was assessed', 'Findings'], owasp, (c, i) => i === 0 ? `<b>${esc(c)}</b>` : esc(c))}
<p class="muted">${esc(owaspNote)}</p></section>
<section><h2>8. Positive observations</h2>${ul(positives)}</section>
<section><h2>9. Areas assessed with no findings</h2>${rows(['Area', 'Observation'], noFinding)}</section>
<section><h2>10. Remediation roadmap</h2>${rows(['Timeframe', 'Findings', 'Action'], roadmap)}</section>
<section class="np"><h2>Appendix A — Recommended security header configuration</h2>
<p>At the CDN edge (e.g. Cloudflare → Rules → Transform Rules → <b>Modify Response Header</b>), applied per zone to all incoming requests:</p>
${rows(['Action', 'Header', 'Value'], headerRule, (c, i) => i === 0 ? esc(c) : `<code>${esc(c)}</code>`)}
<p>${esc(cspNote)}</p>
<p>Equivalent origin-server configuration (LiteSpeed / Apache <code>.htaccess</code>):</p>
<pre>${esc(htaccess)}</pre>
</section>
<section><h2>Appendix B — OWASP WSTG test cases performed</h2>${rows(['Test ID', 'Test case', 'Result'], wstg, (c, i) => i === 0 ? `<code>${esc(c)}</code>` : esc(c))}</section>
<section><h2>Appendix C — Tools used</h2>${rows(['Tool', 'Purpose'], tools)}</section>
<section><h2>Appendix D — Glossary</h2>${rows(['Term', 'Meaning'], glossary)}</section>
</main>
<footer>${esc(meta.by)} · ${esc(meta.classification)}</footer>
</body></html>`;
fs.writeFileSync(path.join(OUT, cfg.output.html), html);

// ---------------- DOCX (A4 portrait; 1" margins -> 9026 DXA content width) ----------------
const W = 9026;
const F = 'Calibri'; // Rubik/Merriweather not installed on most client PCs; Word substitutes badly
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, HeadingLevel,
  AlignmentType, LevelFormat, Footer, Header, PageNumber, PageBreak } = d;
const R = (text, o = {}) => new TextRun({ text: String(text), font: F, size: 21, ...o });
const P = (runs, o = {}) => new Paragraph({ spacing: { after: 120, line: 300 }, ...o, children: Array.isArray(runs) ? runs : [R(runs)] });
const bullet = (t, size) => new Paragraph({ numbering: { reference: 'b', level: 0 }, spacing: { after: 60, line: 276 }, children: [R(t, size ? { size } : {})] });
const thin = { style: BorderStyle.SINGLE, size: 4, color: C.border };
const borders = { top: thin, bottom: thin, left: thin, right: thin };
const cell = (content, w, o = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA }, borders, margins: { top: 70, bottom: 70, left: 110, right: 110 },
  shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
  children: o.paras || [new Paragraph({ children: [R(content, { size: 18, ...(o.run || {}) })] })],
});
const headRow = (labels, widths) => new TableRow({ tableHeader: true, children: labels.map((l, i) => cell(l, widths[i], { fill: C.navy, run: { color: 'FFFFFF', bold: true } })) });
const sevCell = (s, w) => cell(s, w, { fill: SEV[s], run: { color: 'FFFFFF', bold: true } });
const table = (widths, rws) => new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, rows: rws });
const simple = (labels, widths, dataArr, sevCol = -1) => table(widths, [headRow(labels, widths),
  ...dataArr.map(r => new TableRow({ cantSplit: true, children: r.map((c, i) => i === sevCol ? sevCell(c, widths[i]) : cell(c, widths[i])) }))]);
const H1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const H2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const H3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const pb = () => new Paragraph({ children: [new PageBreak()] });
const gap = () => P('');

const cover = [
  new Paragraph({ spacing: { before: 2200 }, children: [R(meta.classification.split(' — ')[0] + ' · SECURITY ASSESSMENT REPORT', { bold: true, color: C.blue, size: 22 })] }),
  new Paragraph({ spacing: { after: 200 }, children: [R(meta.title, { bold: true, color: C.navy, size: 56 })] }),
  new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: C.teal, space: 8 } }, spacing: { after: 400 }, children: [R(meta.subtitle, { size: 28, color: C.charcoal })] }),
  P([R('Prepared for:  ', { bold: true }), R(meta.client)]),
  P([R('Prepared by:  ', { bold: true }), R(meta.by)]),
  P([R('Report date:  ', { bold: true }), R(meta.date)]),
  P([R('Version:  ', { bold: true }), R(meta.version + ' — Final')]),
  new Paragraph({ spacing: { before: 2400 }, children: [R(confidentiality, { size: 17, color: C.muted, italics: true })] }),
  pb(),
];
const dc = [
  H1('Document control'),
  simple(['Field', 'Detail'], [2400, 6626], [['Document', meta.title], ['Version', `${meta.version} — Final`], ['Report date', meta.date], ['Testing window', meta.window], ['Prepared for', meta.client], ['Prepared by', meta.by], ['Classification', meta.classification]]),
  H3('Revision history'),
  simple(['Version', 'Date', 'Change'], [1200, 2000, 5826], revisions),
  gap(),
  P([R(confidentiality, { italics: true, color: C.muted })]),
  pb(),
];
const sevKeys = Object.keys(SEV);
const statW = [1805, 1805, 1805, 1805, 1806];
const exec = [
  H1('1. Executive summary'),
  P([R('Overall risk posture: ', { bold: true }), R(posture, { bold: true, color: SEV.Medium })]),
  table(statW, [new TableRow({ children: sevKeys.map((s, i) => cell('', statW[i], { paras: [new Paragraph({ alignment: AlignmentType.CENTER, children: [R(counts[s], { bold: true, size: 40, color: SEV[s] })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [R(s, { bold: true, size: 16, color: C.muted })] })] })) })]),
  gap(),
  ...execSummary.map(s => P(s)),
  pb(),
];
const eng = [
  H1('2. Engagement overview'),
  H2('2.1 Scope'),
  simple(['Asset', 'URL', 'Description'], [3000, 3300, 2726], meta.assets),
  H2('2.2 Approach'),
  P('Assessment type: external, unauthenticated, non-intrusive (black-box). All requests were standard HTTP GET/HEAD requests at no more than one request per second, identified by a dedicated user-agent string.'),
  ...approach.map(x => bullet(x)),
  H2('2.3 Out of scope'), ...outOfScope.map(x => bullet(x)),
  H2('2.4 Limitations'), ...limitations.map(x => bullet(x)),
  H1('3. Risk rating methodology'),
  simple(['Severity', 'CVSS v3.1', 'Definition', 'Recommended remediation'], [1500, 1100, 4226, 2200], ratings, 0),
  gap(),
  P([R(methodNote, { italics: true, color: C.muted })]),
  pb(),
  H1('4. Summary of findings'),
  simple(['ID', 'Finding', 'Affected asset(s)', 'Severity', 'CVSS', 'Status'], [700, 3626, 1800, 1300, 800, 800],
    findings.map(f => [f.id, f.t, assetName(f.assets), f.sev, f.cvss.split(' · ')[0], 'Open']), 3),
  pb(),
  H1('5. Detailed findings'),
];
const KW = 2000, VW = W - KW;
const kv = (k, paras) => new TableRow({ children: [cell(k, KW, { fill: C.surface, run: { bold: true } }), cell('', VW, { paras })] });
const txt = t => [new Paragraph({ children: [R(t, { size: 18 })] })];
const detail = findings.flatMap(f => [
  H2(`${f.id} — ${f.t}`),
  table([KW, VW], [
    new TableRow({ children: [cell('Severity', KW, { fill: C.surface, run: { bold: true } }), sevCell(f.sev, VW)] }),
    kv('Affected asset(s)', txt(assetName(f.assets))),
    kv('CVSS v3.1', txt(f.cvss)),
    kv('Classification', txt(f.cls)),
    kv('Status', txt('Open')),
    kv('Description', txt(f.desc)),
    kv('Evidence', f.ev.map(l => new Paragraph({ shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'EDEFF3' }, children: [R(l, { font: 'Consolas', size: 16 })] }))),
    kv('Impact', txt(f.impact)),
    kv('Severity rationale', txt(f.rationale)),
    kv('Recommendation', f.fix.map(x => bullet(x, 18))),
    kv('References', txt(f.refs)),
  ]),
  gap(),
]);
const invCols = data.inventoryCols || ['Installed', 'Latest available', 'Status'];
const tail = [
  pb(),
  ...(inventory && inventory.length ? [
    H1('6. Component / version review'),
    simple(['Component', ...invCols], [2300].concat(invCols.map(() => Math.floor(6726 / invCols.length))), inventory),
    gap(), P([R(inventoryNote || '', { italics: true, color: C.muted })]),
    pb(),
  ] : []),
  H1('7. OWASP Top 10:2025 coverage'),
  simple(['Category', 'Name', 'Coverage', 'What was assessed', 'Findings'], [1100, 1800, 1300, 3426, 1400], owasp),
  gap(), P([R(owaspNote, { italics: true, color: C.muted })]),
  H1('8. Positive observations'), ...positives.map(x => bullet(x)),
  H1('9. Areas assessed with no findings'),
  simple(['Area', 'Observation'], [2600, 6426], noFinding),
  H1('10. Remediation roadmap'),
  simple(['Timeframe', 'Findings', 'Action'], [2000, 2100, 4926], roadmap),
  pb(),
  H1('Appendix A — Recommended security header configuration'),
  P('At the CDN edge (e.g. Cloudflare → Rules → Transform Rules → Modify Response Header), applied per zone to all incoming requests:'),
  table([1500, 2800, 4726], [headRow(['Action', 'Header', 'Value'], [1500, 2800, 4726]),
    ...headerRule.map(r => new TableRow({ children: [cell(r[0], 1500), cell(r[1], 2800, { run: { font: 'Consolas' } }), cell(r[2], 4726, { run: { font: 'Consolas' } })] }))]),
  gap(), P(cspNote),
  P('Equivalent origin-server configuration (LiteSpeed / Apache .htaccess):'),
  ...htaccess.split('\n').map(l => new Paragraph({ shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'EDEFF3' }, spacing: { after: 0 }, children: [R(l, { font: 'Consolas', size: 17 })] })),
  H1('Appendix B — OWASP WSTG test cases performed'),
  simple(['Test ID', 'Test case', 'Result'], [1800, 4726, 2500], wstg),
  H1('Appendix C — Tools used'),
  simple(['Tool', 'Purpose'], [3400, 5626], tools),
  H1('Appendix D — Glossary'),
  simple(['Term', 'Meaning'], [1800, 7226], glossary),
];

const doc = new Document({
  creator: meta.by, title: meta.title, description: meta.classification,
  styles: {
    default: { document: { run: { font: F, size: 21, color: C.charcoal } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: F, size: 32, bold: true, color: C.navy }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0, keepNext: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: F, size: 24, bold: true, color: C.blue }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1, keepNext: true } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: F, size: 22, bold: true, color: C.navy }, paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2, keepNext: true } },
    ],
  },
  numbering: { config: [{ reference: 'b', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 240 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } }, titlePage: true },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [R('Security Assessment Report · CONFIDENTIAL', { size: 16, color: C.muted })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [R(`${meta.by} · v${meta.version} · Page `, { size: 16, color: C.muted }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.muted, font: F })] })] }) },
    children: [...cover, ...dc, ...exec, ...eng, ...detail, ...tail],
  }],
});
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(path.join(OUT, cfg.output.docx), buf); console.log('written', path.join(OUT, cfg.output.html), 'and', path.join(OUT, cfg.output.docx)); });
