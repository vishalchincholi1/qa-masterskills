---
name: blackbox-web-security-audit
description: Portable, non-destructive external (black-box) security audit skill for any web application. Collects passive evidence (headers, TLS, DNS, full HTML, browser cookies/trackers), triages false positives, scores findings, and generates a branded HTML + DOCX + PDF report. Parameterize the target in config.json and run the pipeline end to end.
version: 2.0.0
---

# Black-Box Web Security Audit Skill (Portable)

A reusable version of the methodology and tooling first built for the C4EC / Societal
Thinking engagement. Point it at any set of in-scope domains, run four commands, and get
the same deliverables: an HTML report, an editable Word (`.docx`) report, and an A4 PDF.

This file is the **operating procedure**. The companion files do the work:

| File | Role |
| :--- | :--- |
| `config.json` | **The one file you edit per engagement.** Target domains, paths, branding, report metadata, consent URLs. |
| `scripts/run_audit.sh` | Passive evidence collection (curl headers + full bodies, TLS, HTTP→HTTPS redirect, SPF/DMARC). Reads `config.json`. |
| `scripts/consent_check.js` | Headless Chrome on a fresh profile: trackers + cookies **before** consent. |
| `scripts/build_report.js` | Single source of truth for findings → generates `report.html` + `report.docx`. |
| `scripts/export_pdf.js` | Renders `report.html` → A4 PDF with page numbers + confidential footer. |
| `findings.sample.js` | A worked example findings dataset to copy into `build_report.js` data arrays. |
| `package.json` | npm scripts (`collect`, `consent`, `report`, `pdf`) and dependencies. |
| `README.md` | Quick start, requirements, per-engagement checklist. |

---

## Rules of engagement (do not skip)

1. **Written authorization first.** Get signed scope sign-off naming every in-scope domain
   before the first request. No authorization, no test.
2. **Passive and low-frequency only.** HTTP GET/HEAD, **≤1 request/second**, identified by a
   dedicated user agent (`Mozilla/5.0 (QA security audit - authorized)`).
3. **Forbidden:** brute force, fuzzing, injection payloads, form submission, data modification,
   DoS, authenticated testing, scanning the origin behind a CDN/WAF.
4. **Scope is the domains in `config.json` and nothing else.**
5. **Evidence or it didn't happen.** Every finding cites the evidence file and line. The
   `evidence/` folder is git-ignored; regenerate it locally per engagement.
6. A CDN WAF (Cloudflare etc.) may block or flag scans — keep to the rate limit, expect 403s.

---

## The pipeline

```
1. Edit config.json            (targets, paths, branding, metadata)
2. npm install                 (docx + puppeteer-core)
3. npm run collect             (passive evidence -> evidence/<domain>/)
4. npm run consent             (pre-consent cookies/trackers -> evidence/browser_preconsent.json)
5. Analyze evidence (Steps 1-5 below) and fill the findings data in build_report.js
6. npm run report              (report.html + report.docx)
7. npm run pdf                 (report PDF)
```

The whole point of `build_report.js` as a **single source of truth**: edit the `findings`,
`inventory`, `owasp`, `roadmap` data arrays only, then regenerate. Never hand-edit the
generated HTML/DOCX/PDF — the next build overwrites them.

---

## Step 1: Response headers

- Check `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options` /
  `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **Disclosure:** flag headers/meta that reveal **product or version** (`X-Powered-By`,
  `x-turbo-charged-by`, `<meta name="generator">`, `?ver=` strings).
  `Server: cloudflare` (no version) is **not** a finding.
- **Remediation syntax:** detect the origin before suggesting syntax. CDN edge rules
  (e.g. Cloudflare Transform Rules → Modify Response Header) first; origin fallback in the
  server's own syntax (LiteSpeed/Apache → `.htaccess` `Header set`; Nginx → `add_header`).
- **Transport:** confirm HTTP→HTTPS redirect (301), TLS version/cipher, certificate validity,
  and whether HSTS is present (`max-age`, `includeSubDomains`, `preload`).

## Step 2: Forms and scripts (parse the full HTML body, not grep output)

- Minified HTML puts many tags on one line — **parse the saved body**, don't grep it.
- Forms: record `action`, `method`, target origin, hidden inputs, captcha
  (Turnstile/reCAPTCHA).
  - Missing CSRF token matters **only** for forms that change state for an *authenticated*
    session. Unauthenticated contact/newsletter forms → Informational at most.
- SRI: flag missing `integrity` **only** on third-party, version-pinned static files
  (e.g. `cdnjs .../gsap/3.12.3/gsap.min.js`).
  - Skip same-origin scripts and dynamic third-party loaders (GTM, Turnstile,
    YouTube iframe_api, MailerLite) — they serve changing content and *cannot* use SRI.
  - Floating versions (`swiper@11`) → recommend pinning first.

## Step 3: Cookies and consent (browser evidence required)

- curl **cannot** see JS-set cookies or runtime tracker requests. If browser evidence is
  absent, mark the check "Not tested".
- Cookie flags: `Secure` + `SameSite` on all cookies. `HttpOnly` is expected only on
  server-set session/auth cookies; JS-set analytics cookies can't have it.
- Consent: in a **fresh profile**, before interacting with the banner, list requests to
  analytics/ad endpoints (`google-analytics.com/g/collect`, `facebook.com/tr`,
  `stats.g.doubleclick.net`). Any hit before consent = finding (GDPR / ePrivacy / DPDP Act).
- Record the banner's presence/selector and any Google Consent Mode default state.

## Step 4: CMS / DNS extras (adapt to the detected stack)

For WordPress (most common):
- `/wp-json/wp/v2/users` returning usernames → user enumeration (Low/Medium).
- `/xmlrpc.php` reachable (200/405) → brute-force amplification surface.
- `/wp-cron.php` publicly reachable, `/readme.html` present → Low.
- Plugin/theme version inventory: `generator` meta, `?ver=` strings, plugin `readme.txt`.
  Compare against WordPress.org core/plugin APIs and public CVE sources
  (Patchstack, WPScan, NVD). Flag **closed/unmaintained** plugins and outdated versions.

For any site:
- DMARC `p=none` / SPF `~all` → spoofing risk (Medium, judgment-scored).
- `/.well-known/security.txt` missing → Informational (RFC 9116).

## Step 5: Triage, then score

- Drop or downgrade anything hit by the exclusions above (the false-positive rules).
- **CVSS v3.1 only where a concrete attack path exists.** Defense-in-depth gaps (missing
  headers with no exploitable sink) → Low/Informational with a one-line reason. Compliance
  and hardening findings get `N/A` for CVSS and a judgment-based severity.
- Never pre-declare "Critical: 0" as a guarantee — write "0 identified within passive scope".

### False-positive rules (apply before scoring)

| Rule | Why it misfires |
| :--- | :--- |
| "Flag every form missing a CSRF token" | Unauthenticated contact/newsletter forms have no session to forge. Captcha-protected or cross-origin (MailerLite) forms carry their own protection. → Informational. |
| "Flag every script missing SRI" | Same-origin and dynamic third-party loaders (GTM, Turnstile, YouTube, MailerLite) can't use SRI. Only pinned CDN files qualify. |
| "`Server` header = version disclosure" | `Server: cloudflare` has no version. Real disclosures are `x-turbo-charged-by`, generator meta, `?ver=`. |
| "CVSS-score every finding" | Inflated CVSS on defense-in-depth gaps loses credibility. Score Low/Informational unless a concrete exploit exists. |
| "Output Nginx snippets" | Detect the real origin first. LiteSpeed/Apache use `.htaccess`; prefer CDN edge rules. |
| "Critical: 0 (guaranteed safe)" | Non-intrusive scope can't prove absence. Write "0 identified within passive scope". |

### Scoring table (populate per finding in `build_report.js`)

| Finding | Category (OWASP/CWE) | Evidence (file:line) | CVSS v3.1 | Severity | Business Impact | CDN / No-Code Remediation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

---

## Report structure (generated by build_report.js)

Document control → 1. Executive summary (severity counts + risk posture) →
2. Engagement overview (scope / approach / out-of-scope / limitations) →
3. Risk rating methodology → 4. Summary of findings → 5. Detailed findings →
6. Component/version review → 7. OWASP Top 10:2025 coverage → 8. Positive observations →
9. Areas assessed with no findings → 10. Remediation roadmap →
Appendix A (recommended header config) → B (WSTG test cases) → C (tools) → D (glossary).

Each detailed finding carries: Affected asset(s), CVSS v3.1, Classification (OWASP + CWE),
Status, Description, Evidence (monospace block), Impact, Severity rationale, Recommendation
(bulleted), References.

## Known limitations to state in every report

- Reflects the testing window only; later config changes aren't covered.
- Non-intrusive and time-boxed: absence of a finding is not proof of absence of a vulnerability.
- Versions only identifiable where the site exposes them; hidden versions need admin/authenticated access.
- Consent behavior *after* Accept/Reject may be untested unless explicitly captured.
- OWASP categories needing active/authenticated testing (injection, insecure design,
  auth failures, logging) are "Not tested", not "clean".
