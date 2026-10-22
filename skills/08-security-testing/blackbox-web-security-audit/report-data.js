// ============================================================================
// PER-ENGAGEMENT REPORT DATA  —  edit THIS file, not scripts/build_report.js.
// This is a complete worked example (the C4EC / Societal Thinking engagement).
// Replace the content with your own findings, keeping the same shapes.
// After editing:  npm run report && npm run pdf
// ============================================================================

// Report title/subtitle (client + date + version come from config.json).
exports.title = 'External Web Application Security Assessment';
exports.subtitle = 'Non-intrusive black-box assessment';

// Map short asset codes used in findings (e.g. 'C4EC') to full names in the report.
// Leave as identity (a => a) if you write full asset names directly in findings.
exports.assetName = a => a
  .replace('C4EC', 'Centre for Exponential Change')
  .replace('ST', 'Societal Thinking');

exports.revisions = [
  ['1.0', '9 October 2026', 'Initial release to client.'],
];

exports.confidentiality = 'This document contains security-sensitive information about the assessed systems. It is intended solely for the named recipients and must not be distributed further without the written consent of the client and the assessor.';

exports.execSummary = [
  'A non-intrusive external security assessment was conducted of two public websites. The objective was to identify security misconfigurations, information exposure and privacy-compliance gaps visible to an unauthenticated visitor, without affecting site availability or data.',
  'Overall, both websites demonstrate a sound security baseline. Transport encryption is current (TLS 1.3), both sites are served through a CDN, common WordPress attack surfaces (user enumeration and XML-RPC) are blocked, and the contact form is protected by an anti-automation challenge. No Critical-severity findings were identified within the passive scope.',
  'The most significant findings relate to privacy compliance: analytics data collection and cookies were observed before the visitor had given consent.',
  'The remaining findings are configuration-hardening items: absent HTTP security headers, a permissive email-authentication (DMARC) policy, and disclosure of software version information. Most can be remediated at the CDN edge or through plugin settings, without changes to website code.',
  'A review of WordPress core and plugin versions found most detectable components current, with one plugin one release behind and one closed (unmaintained) plugin in use on the second site.',
];

exports.ratings = [
  ['Critical', '9.0–10.0', 'Directly exploitable; likely to result in full compromise or large-scale data exposure.', 'Immediate (within 7 days)'],
  ['High', '7.0–8.9', 'Significant security or regulatory exposure; exploitation or non-compliance is likely.', 'Within 30 days'],
  ['Medium', '4.0–6.9', 'Exploitable under specific conditions, or a material weakness in a defensive control.', 'Within 60–90 days'],
  ['Low', '0.1–3.9', 'Limited impact; weakens defence-in-depth or eases reconnaissance.', 'Next maintenance cycle'],
  ['Informational', '—', 'Best-practice observation with no direct security impact.', 'At discretion'],
];
exports.methodNote = 'Technical findings with a direct attack path are scored using the CVSS v3.1 base metrics, and the severity follows the CVSS band. Compliance findings, and hardening findings with no direct exploit path, are not given a CVSS score ("N/A"). Their severity is the assessor\'s judgement of business and regulatory risk, and the rationale is stated in each finding.';

exports.approach = [
  'Passive collection of HTTP response headers, page source, TLS configuration and public DNS records.',
  'Review of client-side forms, third-party scripts and Subresource Integrity usage.',
  'Browser-based observation of cookies and network requests on first visit, before any interaction with the consent banner (clean browser profile).',
  'Passive WordPress core and plugin version identification (generator tags, asset version strings and public plugin readme files), compared with WordPress.org releases and public vulnerability databases (Patchstack, WPScan, NVD).',
  'Analysis aligned with the OWASP Web Security Testing Guide (WSTG), the OWASP Secure Headers Project and NIST SP 800-115, with findings classified against the OWASP Top 10:2025 and CWE.',
];
exports.outOfScope = [
  'Active exploitation, vulnerability scanning, brute-force, fuzzing, injection testing and denial-of-service testing.',
  'Form submission or any action that creates or modifies data.',
  'Authenticated areas, the WordPress administration interface, hosting infrastructure and the origin server behind the CDN.',
  'Source-code review, authenticated plugin enumeration, and commercial vulnerability-feed lookups. Version matching used public database sources only.',
];
exports.limitations = [
  'This assessment reflects the state of the websites during the testing window only. Configuration changes after that time are not reflected.',
  'The assessment was non-intrusive and time-boxed. It is not an exhaustive test, and the absence of a finding does not guarantee the absence of a vulnerability.',
  'Plugin versions can only be identified where the site exposes them. Paid, custom or inactive plugins may not be detected.',
  'Consent observations were made with an automated browser. Behaviour after a visitor accepts or rejects consent was not tested.',
  'Regulatory references are provided for context and do not constitute legal advice.',
];

// -------------------- FINDINGS --------------------
// Each finding: { id, t(itle), assets, sev, cvss, cls, desc, ev[], impact, rationale, fix[], refs }
// sev must be one of: Critical | High | Medium | Low | Informational
// cvss: 'N/A' for compliance/hardening, or '4.3 · CVSS:3.1/AV:N/...' where an attack path exists.
exports.findings = [
  { id: 'F-01', t: 'Analytics data collected before user consent', assets: 'C4EC', sev: 'High', cvss: 'N/A',
    cls: 'Privacy / Consent management (outside OWASP Top 10 scope) · CWE-359 (Exposure of Private Personal Information)',
    desc: 'The website displays a consent banner offering "Accept All" and "Reject All". However, Google Analytics loads and sends a measurement request, and analytics cookies are set, on the first page view, before the visitor interacts with the banner. No Google Consent Mode default state was present.',
    ev: [
      'Observed with the consent banner visible and unanswered:',
      'POST https://www.google-analytics.com/g/collect?v=2&tid=G-XXXXXXXXXX…',
      'Cookies set: _ga, _ga_XXXXXXXXXX (expiry ~13 months)',
    ],
    impact: 'Visitor data is processed before a consent choice is made. Where the visitor audience falls under consent-based regimes (EU GDPR / ePrivacy Art. 5(3), or India\'s DPDP Act 2023), this may create regulatory and reputational exposure.',
    rationale: 'Rated High on regulatory and reputational risk; not CVSS-scored because it is not a technical vulnerability.',
    fix: [
      'Enable script blocking before consent, and Google Consent Mode v2 with a default of "denied" for analytics_storage and ad_storage.',
      'Re-test that no requests to google-analytics.com occur before consent, and none after "Reject All".',
    ],
    refs: 'EDPB Guidelines 05/2020 on consent; ePrivacy Directive Art. 5(3); Google Consent Mode v2 documentation' },
  { id: 'F-03', t: 'Missing HTTP security response headers', assets: 'C4EC, ST', sev: 'Medium', cvss: '4.3 · CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:L/A:N',
    cls: 'OWASP A02:2025 Security Misconfiguration · CWE-1021, CWE-693',
    desc: 'The following headers are absent on all tested pages of both websites: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy.',
    ev: ['GET / and /contact/: none of the listed headers present in the response.', 'Response headers present: Server: cloudflare, x-turbo-charged-by: LiteSpeed, cf-cache-status.'],
    impact: 'Without framing controls, the pages can be embedded in a third-party site and used for clickjacking. Without a Content Security Policy, the browser has no second line of defence if a malicious script is ever injected.',
    rationale: 'CVSS reflects the clickjacking vector; the other headers are defence-in-depth.',
    fix: ['Add the headers at the CDN edge using a Transform Rule (see Appendix A).', 'Introduce a full Content-Security-Policy in Report-Only mode first, then enforce it.'],
    refs: 'OWASP Secure Headers Project; OWASP WSTG-CONF-14, WSTG-CLNT-09' },
  { id: 'F-04', t: 'HTTP Strict Transport Security (HSTS) not enabled', assets: 'C4EC', sev: 'Medium', cvss: '4.2 · CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:L/A:N',
    cls: 'OWASP A04:2025 Cryptographic Failures · CWE-319',
    desc: 'HTTP requests are redirected to HTTPS (301), but the Strict-Transport-Security header is not returned, so browsers do not enforce HTTPS on later visits.',
    ev: ['GET http://…/ → 301 Location: https://…/', 'GET https://…/ → no Strict-Transport-Security header.'],
    impact: 'An attacker on the same network as a visitor (e.g. public Wi-Fi) can intercept the initial HTTP request and downgrade the connection (SSL stripping).',
    rationale: 'Requires a network-positioned attacker and user interaction (AC:H, UI:R).',
    fix: ['At the CDN/SSL settings, enable HSTS: max-age=31536000; includeSubDomains.', 'Confirm all subdomains serve valid HTTPS before enabling includeSubDomains. Consider preload after a stable period.'],
    refs: 'RFC 6797; OWASP WSTG-CONF-07' },
  { id: 'F-05', t: 'Permissive email authentication policy (DMARC p=none, SPF soft-fail)', assets: 'C4EC, ST', sev: 'Medium', cvss: 'N/A',
    cls: 'Email security configuration (outside OWASP Top 10 scope) · Domain spoofing',
    desc: 'Both domains publish a DMARC policy of p=none (monitor only) and an SPF record ending in ~all (soft fail). Receiving mail servers are therefore not instructed to reject or quarantine mail that fails authentication.',
    ev: ['_dmarc: v=DMARC1; p=none; sp=none; rua=mailto:…', 'SPF: v=spf1 ip4:… ~all'],
    impact: 'Third parties can send email that appears to originate from these domains, enabling phishing or fraud, with reputational impact.',
    rationale: 'Rated Medium given the organisations\' public profile; not CVSS-scored.',
    fix: ['Review DMARC aggregate reports to confirm all legitimate senders are covered by SPF and DKIM.', 'Move to p=quarantine, then p=reject. Change SPF to -all once senders are confirmed.'],
    refs: 'RFC 7489 (DMARC); RFC 7208 (SPF)' },
  { id: 'F-07', t: 'Software version disclosure', assets: 'C4EC, ST', sev: 'Low', cvss: 'N/A',
    cls: 'OWASP A02:2025 Security Misconfiguration · CWE-497',
    desc: 'Page source and response headers disclose the CMS, plugins and exact versions in use.',
    ev: ['<meta name="generator">: WordPress 7.1.3; Elementor 4.3.4; WPML 4.9.4', 'Response header: x-turbo-charged-by: LiteSpeed', 'Asset URLs carry ?ver= version parameters'],
    impact: 'Lets an attacker quickly match the deployed versions to publicly known vulnerabilities.',
    rationale: 'No direct exploit path; reconnaissance aid only.',
    fix: ['Remove x-turbo-charged-by with a CDN Transform Rule (Appendix A).', 'Suppress generator meta tags.', 'Keep core and plugins patched and run a periodic vulnerability check.'],
    refs: 'OWASP WSTG-INFO-02, WSTG-INFO-08' },
  { id: 'F-10', t: 'Third-party scripts loaded without Subresource Integrity (SRI)', assets: 'C4EC, ST', sev: 'Low', cvss: 'N/A',
    cls: 'OWASP A08:2025 Software or Data Integrity Failures · CWE-353',
    desc: 'Version-pinned JavaScript libraries are loaded from public CDNs without an integrity attribute. One library is referenced by a floating major version.',
    ev: ['cdnjs.cloudflare.com/ajax/libs/gsap/3.12.3/gsap.min.js', 'cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js (floating version)'],
    impact: 'If a CDN-hosted file were tampered with, the modified script would run in visitors\' browsers (supply-chain risk).',
    rationale: 'Depends on a third-party CDN compromise; defence-in-depth.',
    fix: ['Add integrity and crossorigin="anonymous" attributes to the pinned script tags.', 'Pin floating versions to an exact version, or self-host.', 'Note: dynamic loaders (GTM, Turnstile, YouTube, MailerLite) cannot use SRI and are excluded.'],
    refs: 'W3C Subresource Integrity; OWASP Third Party JavaScript Management Cheat Sheet' },
  { id: 'F-13', t: 'No security.txt vulnerability-disclosure contact published', assets: 'C4EC, ST', sev: 'Informational', cvss: 'N/A',
    cls: 'Security governance · Vulnerability disclosure (RFC 9116)',
    desc: 'Neither website publishes a /.well-known/security.txt file identifying how security researchers should report vulnerabilities.',
    ev: ['GET /.well-known/security.txt → HTTP 404 (both domains)'],
    impact: 'People who discover a vulnerability have no clear channel to report it privately.',
    rationale: 'Governance best practice; no direct security impact.',
    fix: ['Publish /.well-known/security.txt with a Contact and an Expires field.'],
    refs: 'RFC 9116; OWASP Vulnerability Disclosure Cheat Sheet' },
  { id: 'F-06', t: 'Closed (unmaintained) plugin in use', assets: 'ST', sev: 'Medium', cvss: 'N/A',
    cls: 'OWASP A03:2025 Software Supply Chain Failures · CWE-1104',
    desc: 'The site loads a plugin that WordPress.org has closed for a guideline violation, so it is no longer maintained and will receive no further security updates. The installed version could not be determined because the site blocks plugin readme files.',
    ev: ['Page source references the plugin assets on home and /connect/', 'api.wordpress.org plugin_information → error: "closed"', 'GET /wp-content/plugins/<slug>/readme.txt → HTTP 403'],
    impact: 'Any vulnerability found in this plugin from now on will not be patched by its vendor.',
    rationale: 'Rated Medium: unmaintained code on a public site with an unconfirmed installed version. Not CVSS-scored because exploitability depends on the unknown version.',
    fix: ['Replace the plugin with an actively maintained equivalent, or remove it.', 'Until then, confirm the latest fixed version is installed from WordPress admin.'],
    refs: 'Patchstack; WordPress.org plugin directory' },
];

exports.positives = [
  'TLS 1.3 with AES-256-GCM and a valid, trusted certificate on both websites; HTTP is redirected to HTTPS (301).',
  'WordPress user enumeration (/wp-json/wp/v2/users) and XML-RPC (/xmlrpc.php) are blocked (HTTP 403) on both websites.',
  'The contact form uses anti-automation (Cloudflare Turnstile) and enforces input length limits.',
  'No server-issued session cookies on public pages, which limits session-related attack surface.',
  'Error pages (HTTP 403/404) are generic and expose no stack traces, file paths or server versions.',
];
exports.noFinding = [
  ['Cross-Site Request Forgery (CSRF) on forms', 'The contact form is unauthenticated and protected by a captcha; the newsletter form posts cross-origin to a provider with its own anti-CSRF token. With no authenticated session to abuse, no CSRF risk was identified.'],
  ['Server banner', 'The Server header returns "cloudflare" with no version and does not expose the origin technology.'],
];
exports.roadmap = [
  ['Immediate (≤30 days)', 'F-01', 'Enable pre-consent script blocking and Consent Mode v2; deploy a consent-management platform where missing.'],
  ['Short term (≤60 days)', 'F-03, F-04, F-06, F-07', 'Apply the CDN header and WAF rules in Appendix A; enable HSTS. Replace the closed plugin.'],
  ['Medium term (≤90 days)', 'F-05', 'Move DMARC from p=none to quarantine/reject after reviewing aggregate reports.'],
  ['Next maintenance cycle', 'F-10, F-13', 'Add SRI to CDN scripts; publish security.txt.'],
  ['After remediation', 'All', 'Re-test to verify fixes, including consent behaviour after "Reject All".'],
];

exports.headerRule = [
  ['Set static', 'X-Frame-Options', 'SAMEORIGIN'],
  ['Set static', 'X-Content-Type-Options', 'nosniff'],
  ['Set static', 'Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Set static', 'Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
  ['Set static', 'Content-Security-Policy', "frame-ancestors 'self'; upgrade-insecure-requests"],
  ['Remove', 'x-turbo-charged-by', '—'],
];
exports.htaccess = `<IfModule mod_headers.c>
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  Header always set Content-Security-Policy "frame-ancestors 'self'; upgrade-insecure-requests"
</IfModule>`;
exports.cspNote = 'The Content-Security-Policy above covers framing only. A full script-source policy should first be deployed as Content-Security-Policy-Report-Only and monitored for at least two weeks before enforcement, because the sites load scripts from several third parties.';

exports.owasp = [
  ['A01:2025', 'Broken Access Control', 'Partial', 'Unauthenticated access to restricted WordPress endpoints checked; user enumeration and XML-RPC correctly denied (403). Authorisation testing out of scope.', '—'],
  ['A02:2025', 'Security Misconfiguration', 'Assessed', 'HTTP security headers, information disclosure, exposed default files and endpoints, cookie attributes.', 'F-03, F-07'],
  ['A03:2025', 'Software Supply Chain Failures', 'Partial', 'Third-party script inventory reviewed; detected component versions compared with releases and public vulnerability databases.', 'F-06, F-07, F-10'],
  ['A04:2025', 'Cryptographic Failures', 'Assessed (transport)', 'TLS protocol, cipher suite, certificate validity, HTTPS redirect and HSTS.', 'F-04'],
  ['A05:2025', 'Injection', 'Not tested', 'Requires active payload testing, which is out of scope. Absence of CSP (F-03) removes a browser-side defence.', '—'],
  ['A06:2025', 'Insecure Design', 'Not tested', 'Requires design documentation or threat modelling; not assessable black-box.', '—'],
  ['A07:2025', 'Authentication Failures', 'Not tested', 'Login and authenticated functions out of scope. XML-RPC is blocked.', '—'],
  ['A08:2025', 'Software or Data Integrity Failures', 'Assessed (client-side)', 'Subresource Integrity on third-party scripts.', 'F-10'],
  ['A09:2025', 'Security Logging & Alerting Failures', 'Not tested', 'Server-side logging and alerting are not observable externally.', '—'],
  ['A10:2025', 'Mishandling of Exceptional Conditions', 'Partial', 'Error responses (403/404) reviewed; generic pages with no stack traces or version leakage.', '—'],
];
exports.owaspNote = 'Coverage reflects the non-intrusive scope of this engagement. Categories marked "Not tested" were not assessed and should not be read as free of issues. A follow-up authenticated or active test is recommended to cover them.';

exports.wstg = [
  ['WSTG-INFO-02', 'Fingerprint web server', 'F-07'],
  ['WSTG-INFO-08', 'Fingerprint web application framework', 'F-06, F-07'],
  ['WSTG-CONF-04', 'Review old, backup and unreferenced files', 'No finding'],
  ['WSTG-CONF-05', 'Enumerate infrastructure and application admin interfaces', 'No finding (403)'],
  ['WSTG-CONF-07', 'Test HTTP Strict Transport Security', 'F-04'],
  ['WSTG-CONF-14', 'Test other HTTP security header misconfigurations', 'F-03'],
  ['WSTG-CRYP-01', 'Test for weak transport layer security', 'No finding'],
  ['WSTG-SESS-02', 'Test for cookie attributes', 'No finding'],
  ['WSTG-ERRH-01', 'Test for improper error handling', 'No finding'],
  ['WSTG-CLNT-09', 'Test for clickjacking', 'F-03'],
];

// Component/version table. Set to [] to omit Section 6 entirely (for non-WordPress sites).
// inventoryCols defines the column headers AFTER the "Component" column.
exports.inventoryCols = ['Site A installed', 'Site B installed', 'Latest available', 'Status'];
exports.inventory = [
  ['WordPress core', '7.1.3', '7.1.3', '7.1.3', 'Current'],
  ['Elementor', '4.3.4', '4.3.4', '4.3.4', 'Current'],
  ['Contact Form 7', '6.1.7', 'Version hidden', '6.2.1', 'Outdated on Site A'],
  ['TOP Table of Contents', '—', 'Version hidden', 'Closed', 'Unmaintained (F-06)'],
];
exports.inventoryNote = 'Latest versions are taken from the WordPress.org plugin and core APIs on the testing date. No known vulnerabilities were found for any confirmed installed version.';

exports.tools = [
  ['curl', 'HTTP header and page retrieval (GET/HEAD)'],
  ['OpenSSL', 'TLS protocol and certificate inspection'],
  ['nslookup', 'SPF and DMARC DNS record lookup'],
  ['Google Chrome (headless, via Puppeteer)', 'Cookie and network-request observation in a clean profile'],
  ['WordPress.org Plugin & Core APIs', 'Latest released versions and plugin directory status'],
  ['Patchstack, WPScan and NVD databases', 'Public vulnerability lookup for identified components'],
];
exports.glossary = [
  ['CVSS', 'Common Vulnerability Scoring System, an industry standard for rating the technical severity of vulnerabilities (0–10).'],
  ['OWASP', 'Open Worldwide Application Security Project, publisher of the OWASP Top 10 and the Web Security Testing Guide (WSTG).'],
  ['CWE', 'Common Weakness Enumeration, a standard catalogue of software weakness types.'],
  ['CSP', 'Content Security Policy, a browser header that restricts where scripts and content may load from.'],
  ['Clickjacking', 'An attack that hides a legitimate page inside an invisible frame to trick users into clicking.'],
  ['HSTS', 'HTTP Strict Transport Security, a header instructing browsers to always use HTTPS for the site.'],
  ['SPF / DMARC', 'DNS-based email authentication standards that help receivers reject forged email.'],
  ['SRI', 'Subresource Integrity, a hash on a script tag that lets the browser block tampered files.'],
  ['CMP', 'Consent Management Platform, the tool that displays the cookie banner and enforces visitor choices.'],
];
