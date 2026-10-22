# Black-Box Web Security Audit — Portable Skill

A reusable, non-intrusive external security audit kit for web applications. Point it at any
set of in-scope domains, run four commands, and get an HTML report, an editable Word (`.docx`)
report and an A4 PDF — the same deliverables produced for the original C4EC / Societal Thinking
engagement, generalized.

> **CONFIDENTIAL.** Reports contain security-sensitive information about client systems. Keep
> each engagement's output private.

## What this does

Passive (black-box) assessment of public web apps: HTTP security headers, TLS, HTTP→HTTPS
redirect, HSTS, forms & third-party scripts (SRI), cookies & pre-consent tracking
(GDPR/ePrivacy/DPDP), WordPress attack surface (user enumeration, XML-RPC, wp-cron, readme,
version disclosure), plugin/theme version inventory with CVE lookup, and SPF/DMARC email
authentication. Findings are triaged against false-positive rules, scored (CVSS v3.1 where a
real attack path exists), and rendered into a structured report.

See [`SKILL.md`](SKILL.md) for the full methodology, the step-by-step checks, and the
false-positive triage rules.

## Requirements

- Node.js 18+ and Google Chrome (set the path in `config.json` → `chromePath`)
- Bash (Git Bash on Windows), `curl`, `openssl`, `nslookup`

```bash
npm install
```

## Per-engagement checklist

1. **Get written authorization** naming every in-scope domain.
2. Copy this folder to a new engagement directory.
3. Edit **`config.json`**: `client`, `date`, `version`, `assets`, `domains`, `paths`,
   `consentUrls`, `branding`, `chromePath`.
4. Run the pipeline:

   ```bash
   npm run collect   # passive evidence  -> evidence/<domain>/
   npm run consent   # pre-consent cookies & trackers -> evidence/browser_preconsent.json
   ```

5. **Analyze** the evidence following `SKILL.md` Steps 1–5, then edit **`report-data.js`**
   (findings, inventory, OWASP coverage, roadmap, positives, etc.). This is the single source
   of truth for the report — a complete worked example ships in it; replace the content.
6. Generate the deliverables:

   ```bash
   npm run report    # report.html + report.docx
   npm run pdf       # <output.pdf from config.json>
   ```

## Files

| Path | What it is |
|---|---|
| `config.json` | **Edit per engagement.** Targets, paths, branding, report metadata. |
| `report-data.js` | **Edit per engagement.** Findings and report content (worked example included). |
| `scripts/run_audit.sh` | Passive evidence collection (reads `config.json`). |
| `scripts/consent_check.js` | Headless-Chrome pre-consent cookie/tracker capture. |
| `scripts/build_report.js` | Report generator → HTML + DOCX. Do not edit per engagement. |
| `scripts/export_pdf.js` | HTML → A4 PDF. |
| `SKILL.md` | The methodology, checks and triage rules. |
| `evidence/` | Raw captures. Git-ignored; regenerate per engagement. |

## Rules of engagement (enforced by the methodology)

- Passive, ≤1 request/second, dedicated user agent. GET/HEAD only.
- No brute force, fuzzing, injection, form submission, DoS, or authenticated testing.
- Only the domains in `config.json` are in scope.
- Every finding cites an evidence file. No evidence, no finding.

## Notes & known limitations

- Version-to-CVE matching uses public sources only (Patchstack, WPScan, NVD).
- Sites that hide plugin versions need WordPress admin or an authenticated WPScan run for a
  full patch check.
- Consent behaviour *after* "Accept" / "Reject All" is not covered unless you capture it.
- OWASP categories needing active or authenticated testing are reported as "Not tested".
- `curl` cannot see JS-set cookies or runtime trackers — that is why the browser step exists.
  On Windows, run `npm run collect` in Git Bash (PowerShell's `curl` alias is `Invoke-WebRequest`).
