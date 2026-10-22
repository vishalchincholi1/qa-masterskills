# QA Skills — Complete Guide (Explained Simply)

> Author: Vishal Chincholi
> 37 skills. Every phase of software testing, plus security. Zero confusion — if you read this whole file.

---

## What Even Is This Folder?

Imagine you are a QA tester. Every day you do the same kinds of work:
- Reading a JIRA ticket and figuring out what to test
- Writing a test plan
- Designing test scenarios
- Writing actual test cases
- Running tests and tracking results
- Reporting bugs
- Closing out a test cycle
- Checking a live website for security and privacy problems

That is called the **STLC — Software Testing Life Cycle** (plus a security layer on top). This folder has **37 pre-built AI skill files** — one for each specific job in that cycle.

Each skill is a folder. Inside the folder is a `SKILL.md` file. That file tells the AI (Claude, Copilot, or any AI agent) **exactly how to help you** with that task.

Think of it like giving a new intern a cheat sheet. The cheat sheet says:
- "Here is your job"
- "Here is how to do it step by step"
- "Here is what your output should look like"
- "Here are the rules you must never break"

That cheat sheet = the SKILL.md file.

---

## Folder Structure at a Glance

```
skills/
│
├── 01-requirement-analysis/       ← Phase 1: Is this ticket ready to test?
│   └── jira-requirement-analyzer/
│
├── 02-test-planning/              ← Phase 2: Make a test plan
│   └── test-plan-generator/
│       ├── copilot/               ← GitHub Copilot version of the skill
│       ├── references/            ← Checklist + template files
│       └── scripts/               ← Shell script to fetch JIRA tickets
│
├── 03-test-design/                ← Phase 3: Design what to test
│   ├── test-scenario-designer/
│   └── api-test-designer/
│
├── 04-test-case-development/      ← Phase 4: Write the actual test cases
│   ├── test-case-writer/
│   └── test-data-generator/
│
├── 05-test-execution/             ← Phase 5: Run the tests
│   ├── automation-script-generator/
│   ├── test-execution-tracker/
│   └── regression-suite-selector/
│
├── 06-defect-management/          ← Phase 6: Handle bugs
│   ├── bug-reporter/
│   ├── bug-triage-assistant/
│   └── rca-analyzer/
│
├── 07-test-closure/               ← Phase 7: Wrap everything up
│   ├── test-coverage-analyzer/
│   └── test-closure-reporter/
│
├── 08-security-testing/           ← Phase 8: Check a live site for security & privacy gaps
│   └── blackbox-web-security-audit/
│       ├── config.json            ← Edit per engagement (targets, branding, metadata)
│       ├── report-data.js         ← Edit per engagement (findings + report content)
│       └── scripts/               ← Evidence collection + HTML/DOCX/PDF report generator
│
└── framework-packs/               ← Bonus: Automation tools (Playwright & Selenium)
    ├── playwright-pack/           ← 11 skills for Playwright (TypeScript)
    │   ├── pw-test-generator/
    │   ├── pw-page-object-builder/
    │   ├── pw-fixture-designer/
    │   ├── pw-api-tester/
    │   ├── pw-network-mocker/
    │   ├── pw-flaky-debugger/
    │   ├── pw-locator-fixer/
    │   ├── pw-trace-analyzer/
    │   ├── pw-visual-regression/
    │   ├── pw-accessibility-auditor/
    │   └── pw-ci-configurator/
    └── selenium-pack/             ← 11 skills for Selenium (Java + TestNG)
        ├── se-test-generator/
        ├── se-page-object-builder/
        ├── se-driver-manager/
        ├── se-wait-fixer/
        ├── se-locator-strategist/
        ├── se-flaky-debugger/
        ├── se-data-driven-designer/
        ├── se-cross-browser-runner/
        ├── se-grid-configurator/
        ├── se-framework-scaffolder/
        └── se-report-integrator/
```

---

## How Do You Use a Skill? (Step by Step, Super Simple)

### Step 1 — Find the skill you need

Ask yourself: "What am I trying to do right now?"

- Checking if a ticket is testable? → `01-requirement-analysis/jira-requirement-analyzer`
- Writing a test plan? → `02-test-planning/test-plan-generator`
- Making test scenarios? → `03-test-design/test-scenario-designer`
- Writing test cases? → `04-test-case-development/test-case-writer`
- Writing Playwright tests? → `framework-packs/playwright-pack/pw-test-generator`
- Fixing a flaky Selenium test? → `framework-packs/selenium-pack/se-flaky-debugger`
- Security-checking a live website? → `08-security-testing/blackbox-web-security-audit`

### Step 2 — Open the SKILL.md file inside that folder

Every skill folder has one file: `SKILL.md`. Open it.

### Step 3 — Drop it into your AI tool

**For Claude Code:**
Copy the skill folder into `~/.claude/skills/`. Claude will automatically pick it up.

```bash
# Example: install the jira analyzer skill
cp -r ./01-requirement-analysis/jira-requirement-analyzer ~/.claude/skills/
```

**For GitHub Copilot:**
Copy the contents of SKILL.md into `.github/prompts/your-skill-name.prompt.md`.
Then in VS Code Copilot Chat, type `/your-skill-name` to use it.

**For any other AI (ChatGPT, Gemini, etc.):**
Just paste the contents of the SKILL.md file as your system prompt or at the start of your conversation.

### Step 4 — Give the AI your input

Once the skill is loaded, just talk to the AI normally. For example:

> "Analyze JIRA ticket PROJ-1234 and tell me if it is ready to test"

or

> "Write test scenarios for this feature: users can reset their password by email"

or

> "Generate a Playwright test for the login flow"

The AI will follow the instructions in the SKILL.md and produce structured, useful output.

### Step 5 — Review the output before using it

**Every single skill in this pack has a HUMAN REVIEW GATE.**

That means the AI will produce a DRAFT and then say:
> "Please review this before treating it as final."

**Do not skip this.** The AI cannot know your real app, your real URLs, your real data, or your real requirements. YOU are the expert. The AI is the assistant. Always review what it gives you.

---

## The 7 STLC Phases — What Each Skill Does

---

### Phase 1 — Requirement Analysis
**Folder:** `01-requirement-analysis/`

#### `jira-requirement-analyzer`
**What it does:** Reads a JIRA ticket and decides if it is actually ready to be tested.

**Why you need it:** Bad tickets waste everyone's time. This skill finds the holes — missing acceptance criteria, vague wording, no error paths defined — BEFORE you start testing.

**Say this to the AI:**
> "Analyze this ticket: [paste your JIRA ticket or give the key like PROJ-123]"

**What you get back:**
- A verdict: READY or NOT READY
- A list of gaps (things missing from the ticket)
- A list of ambiguities (things that could mean two different things)
- A list of risks (things that could break in production)
- Specific questions you can send back to the developer or product owner

**Real example:**
You get ticket PROJ-456: "As a user I want to log in."
The AI will flag: No acceptance criteria. No error case for wrong password. No account lockout rules. No mention of what happens after login. NOT READY.

---

### Phase 2 — Test Planning
**Folder:** `02-test-planning/`

#### `test-plan-generator`
**What it does:** Turns a JIRA ticket into a complete, structured test plan.

**Why you need it:** A test plan is your roadmap. Without it, you're testing randomly and missing things. This skill builds the full plan — scope, scenarios, risks, entry/exit criteria — all from the ticket.

**Say this to the AI:**
> "Write a test plan for JIRA ticket PROJ-789"

**What you get back:**
- Scope (what's in and what's out)
- Gaps and questions for the author
- Test scenarios tagged P0/P1/P2 (P0 = must test, P2 = nice to test)
- Test data and environment needs
- Risks and assumptions
- Entry and exit criteria

**Bonus files in this folder:**
- `references/requirement-checklist.md` — a checklist the AI uses to spot gaps
- `references/test-plan-template.md` — the template the test plan is filled into
- `scripts/fetch_jira.sh` — a shell script that fetches the ticket from JIRA automatically
- `copilot/test-plan.prompt.md` — the same skill formatted for GitHub Copilot

**To fetch JIRA tickets automatically**, set these environment variables first:
```bash
export JIRA_BASE_URL=https://yourcompany.atlassian.net
export JIRA_EMAIL=you@yourcompany.com
export JIRA_TOKEN=your_api_token
```
Then run: `./scripts/fetch_jira.sh PROJ-789`

---

### Phase 3 — Test Design
**Folder:** `03-test-design/`

#### `test-scenario-designer`
**What it does:** Takes your requirements or acceptance criteria and maps out ALL the things that should be tested — before anyone writes a single test case.

**Why you need it:** Most testers only test the happy path. This skill forces coverage of positive, negative, boundary, and cross-role scenarios. You find out "what could go wrong" before you write any steps.

**Say this to the AI:**
> "Design test scenarios for this feature: [paste your AC or feature description]"

**What you get back:**
A table like this:
```
| ID   | Scenario                              | Type     | Risk | Covers AC |
| TS-1 | User logs in with valid credentials   | positive | P0   | AC-1      |
| TS-2 | User logs in with wrong password      | negative | P0   | AC-1      |
| TS-3 | User logs in with empty password      | boundary | P1   | AC-1      |
| TS-4 | Admin logs in vs regular user         | cross-role| P1  | AC-2      |
```

#### `api-test-designer`
**What it does:** Designs what to test for a specific API endpoint. You give it the endpoint, it gives you the full coverage matrix.

**Why you need it:** API testing is not just "does it return 200". This skill covers auth, schema, negative inputs, boundaries, and idempotency — the stuff most teams skip.

**Say this to the AI:**
> "Design API tests for POST /api/orders — here is the OpenAPI spec: [paste spec]"

**What you get back:**
```
| ID   | Dimension   | Request              | Expected status | Assert            |
| AT-1 | happy path  | valid body           | 201             | body matches schema|
| AT-2 | schema      | missing required field| 400            | error code        |
| AT-3 | auth        | no token             | 401             | unauthorized      |
```

---

### Phase 4 — Test Case Development
**Folder:** `04-test-case-development/`

#### `test-case-writer`
**What it does:** Takes your approved test scenarios and expands them into detailed, step-by-step test cases that anyone can run.

**Why you need it:** Scenarios are high-level ("test the login"). Test cases are specific ("Step 1: Go to /login. Step 2: Enter email. Step 3: Click submit. Expected: Dashboard appears"). This skill turns one into the other.

**Important:** Only give it APPROVED scenarios. If the scenario is still a draft, the AI will refuse to write cases for it and ask you to approve the scenario first.

**Say this to the AI:**
> "Write test cases for scenario TS-2: User logs in with wrong password"

**What you get back:**
```
TC-1  Wrong password shows error message  (from TS-2, AC-1)   Priority: P0
  Preconditions: User account exists. User is on login page.
  Test data: valid email, wrong password
  Steps:
    1. Enter valid email in email field    -> Expected: Email accepted
    2. Enter wrong password in password field -> Expected: Password field accepts input
    3. Click Sign In button               -> Expected: Error message "Invalid credentials" appears
    4. Verify URL stays at /login         -> Expected: User is NOT redirected to dashboard
  Postconditions: No session created
```

#### `test-data-generator`
**What it does:** Generates the actual test data values you need — valid inputs, invalid inputs, boundary values, and fake but realistic records.

**Why you need it:** You need data to run your tests. This skill creates it — covering all the edge cases automatically. It never uses real customer data.

**Say this to the AI:**
> "Generate test data for the email field in the registration form. It must be a valid email format, max 255 characters."

**What you get back:**
```
Valid:    ["user@example.com", "name+tag@company.org"]  → expected: accepted
Invalid:  ["notanemail", "@nodomain.com", "missing@"]    → expected: rejected
Boundary: ["", "a@b.co" (min), "a"×249+"@b.co" (255 chars), "a"×250+"@b.co" (over limit)]
Synthetic: ["john.doe87@testmail.com", "sara_m@workplace.net"]  env: NON-PROD ONLY
```

---

### Phase 5 — Test Execution
**Folder:** `05-test-execution/`

#### `automation-script-generator`
**What it does:** Takes an approved test case and turns it into a runnable automation script — either Playwright (TypeScript) or Selenium (Java).

**Why you need it:** Writing automation from scratch is slow. This skill gives you the skeleton — mapped step by step from your test case — so you just fill in the real selectors and run it.

**Say this to the AI:**
> "Automate TC-1 using Playwright: [paste the test case]"

**What you get back:**
```typescript
// TC-1  Wrong password shows error — DRAFT, unrun
import { test, expect } from '@playwright/test';

test('TC-1 Wrong password shows error', async ({ page }) => {
  await page.goto('/login'); // TODO: confirm route
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('wrongpassword');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByTestId('error-message')).toBeVisible(); // TODO: confirm selector
});
// HUMAN REVIEW GATE: check TODOs, run locally before committing
```

#### `test-execution-tracker`
**What it does:** Logs your test run results in a structured format — pass, fail, blocked, not-run — and rolls up the numbers.

**Why you need it:** You need to know how many tests passed, how many failed, and why. This skill keeps an honest record. It never guesses — if you didn't report a result, the test is "not run", not "pass".

**Say this to the AI:**
> "Log these test results: TC-1 passed, TC-2 failed with screenshot link, TC-3 blocked by BUG-44"

**What you get back:**
```
| Case | Status  | Evidence      | Defect |
| TC-1 | pass    | -             | -      |
| TC-2 | fail    | screenshot.png| BUG-55 |
| TC-3 | blocked | BUG-44 blocks | BUG-44 |
Summary: executed 3/5 (60%) | pass 33% | fail 1 | blocked 1 | not run 2
```

#### `regression-suite-selector`
**What it does:** Looks at a code change (like a PR) and tells you which tests you actually need to run — instead of running the entire suite every time.

**Why you need it:** Running all 500 tests for every tiny change wastes time. This skill maps the change to the affected areas and recommends the minimum safe set of tests.

**Say this to the AI:**
> "Which regression tests should I run for this PR? It changes the checkout payment module."

**What you get back:**
```
Must-run:    [TC-10, TC-11, TC-12 — directly test payment]
Should-run:  [TC-5, TC-6 — cart flow that feeds checkout]
Safety net:  [smoke tests — always run no matter what]
Skip:        [TC-20 — login module, unaffected]
NOT covered: order history page (manual check recommended)
```

---

### Phase 6 — Defect Management
**Folder:** `06-defect-management/`

#### `bug-reporter`
**What it does:** Turns a messy "something broke" description into a clean, reproducible bug report ready to file in your tracker.

**Why you need it:** Developers can't fix what they can't reproduce. This skill structures your bug properly — title, steps, expected vs actual, severity, evidence — so developers can fix it first time.

**Say this to the AI:**
> "Write a bug report: on the checkout page, clicking Pay Now with an expired card shows a spinner forever. It never shows an error."

**What you get back:**
```
## Bug — Checkout: Pay Now spins forever when card is expired
Environment: build 2.1.4 | staging | Chrome 124
Severity: S2 (blocks purchase)   Priority: P1   Suspected area: payment-service
Steps:
  1. Add item to cart
  2. Go to checkout
  3. Enter expired card: 4111 1111 1111 1111, expiry 01/20
  4. Click Pay Now
Expected: Error message "Your card has expired" appears
Actual:   Spinner appears and never stops. No error shown.
Frequency: 5/5 attempts
```

#### `bug-triage-assistant`
**What it does:** Takes a whole backlog of bugs and sorts them — finds duplicates, suggests priorities, routes each to the right team, and flags ones with missing information.

**Why you need it:** When you have 40 open bugs before a triage meeting, this skill does the sorting work so your team can spend time deciding, not reading.

**Say this to the AI:**
> "Triage these 15 bugs: [paste the list]"

**What you get back:**
```
Suggested duplicates: [BUG-3 and BUG-7 are probably the same issue]
Prioritized:
| BUG-1 | S2 | P1 | payment-team  |
| BUG-3 | S3 | P2 | frontend-team |
Needs info (send back): BUG-9 (no repro steps), BUG-12 (no environment)
```

#### `rca-analyzer`
**What it does:** Runs a proper Root Cause Analysis (RCA) on a defect using 5-Whys and fishbone methods. Finds WHY it happened, not just WHAT happened.

**Why you need it:** Fixing the symptom without fixing the cause means the bug comes back. This skill digs to the root — process, tooling, people, environment — so you fix it for real.

**Say this to the AI:**
> "Do an RCA for this production bug: payment service returned wrong totals for 2 hours on Thursday. Here are the logs: [paste logs]"

**What you get back:**
```
5-Whys:
  Symptom: Wrong totals displayed
  Why 1: Tax calculation returned null → evidence: log line 4521
  Why 2: Tax service was unreachable → evidence: network timeout logs
  Why 3: Tax service deployment happened without health check → hypothesis
  Why 4: Deployment pipeline has no health check step → confirmed
  Root cause: Missing health check gate in deployment pipeline

Escape point: No monitoring alert for tax service calls — failure was silent

Actions:
  Corrective: Add health check to deployment pipeline (owner: DevOps)
  Preventive: Add alert for tax service error rate > 1% (owner: SRE)
```

---

### Phase 7 — Test Closure
**Folder:** `07-test-closure/`

#### `test-coverage-analyzer`
**What it does:** Compares your requirements list with your test list and finds the gaps — what was never tested, what was tested but only on happy path, and orphan tests that test nothing real.

**Why you need it:** Before releasing software, you need to prove you tested what you were supposed to test. This skill builds that proof — or shows you what you missed.

**Say this to the AI:**
> "Check coverage: we have 8 acceptance criteria and these test cases [list them]. What's untested?"

**What you get back:**
```
| AC-1 | TC-1, TC-2      | covered       |
| AC-2 | TC-3 only       | thin (no negative path) |
| AC-5 | nothing         | UNTESTED — high risk   |
Orphan tests: TC-9 — maps to no requirement
Top risk: AC-5 is untested and relates to payment processing
```

#### `test-closure-reporter`
**What it does:** Writes the final closure report for a test cycle — pass rate, defect density, open criticals, coverage %, and a GO/NO-GO recommendation.

**Why you need it:** Before shipping, someone needs to decide "are we ready?". This skill writes the evidence document that makes that decision informed. The recommendation is advisory — YOU decide.

**Say this to the AI:**
> "Write the closure report. We ran 120 tests, 108 passed, 8 failed, 4 blocked. 3 open critical bugs. Coverage is 87%."

**What you get back:**
```
Metrics: executed 120/120 (100%) | pass 90% | open defects: 3 critical / 2 high
Recommendation (ADVISORY): NO-GO — 3 open critical defects must be resolved first
```

---

### Phase 8 — Security Testing
**Folder:** `08-security-testing/`

This phase is different from phases 1–7. The others help you test a feature *before* it ships.
This one checks a website that is *already live* for security and privacy problems — the way an
outside attacker (or a privacy regulator) would see it. It is a full, runnable toolkit, not just
a prompt file.

#### `blackbox-web-security-audit`
**What it does:** Runs a non-intrusive external ("black-box") security assessment of any set of
public websites, then generates a professional report in three formats: an HTML page, an editable
Word document, and a print-ready A4 PDF.

**Why you need it:** Clients and auditors want proof that a website is configured safely and
handles visitor data lawfully. This skill checks the things an unauthenticated visitor can see —
no logins, no attacks, no risk to the site — and turns the evidence into a client-ready deliverable.
It was built from a real engagement and generalized so you point it at any target.

**What it checks:**
- HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- TLS version, certificate, and HTTP→HTTPS redirect
- Forms, third-party scripts, and Subresource Integrity (SRI)
- Cookies and whether analytics/ad trackers fire **before** the visitor gives consent (GDPR / ePrivacy / DPDP)
- WordPress attack surface: user enumeration, XML-RPC, wp-cron, exposed readme, version disclosure
- Plugin/theme version inventory with public CVE lookup (Patchstack, WPScan, NVD)
- Email authentication (SPF and DMARC)

**The golden rule here is safety, not just review.** This skill only ever does passive, low-rate
requests (GET/HEAD, ≤1 per second). It never brute-forces, fuzzes, injects payloads, submits forms,
or touches authenticated areas. **You must get written authorization naming every in-scope domain
before running it.** Every finding must cite an evidence file — no evidence, no finding.

**How to use it (it runs locally, it is not just a prompt):**
1. Edit `config.json` — your target domains, paths, consent URLs, branding, and report metadata.
2. `npm install` (needs Node.js 18+ and Google Chrome).
3. `npm run collect` — gathers headers, TLS, DNS and page bodies into `evidence/`.
4. `npm run consent` — opens a fresh headless Chrome to record pre-consent cookies and trackers.
5. Read the evidence, follow `SKILL.md` steps 1–5, and fill in `report-data.js` with your findings.
6. `npm run report` then `npm run pdf` — produces the HTML, DOCX and PDF reports.

**What you get back:** A structured report with an executive summary and severity counts, scope and
methodology, CVSS v3.1-scored findings (only where a real attack path exists — hardening and
compliance gaps are judgment-scored, not inflated), a WordPress component review, OWASP Top 10:2025
coverage, a remediation roadmap, and appendices (recommended header config, OWASP WSTG test cases,
tools, glossary).

**Files in this folder:**
- `SKILL.md` — the methodology: rules of engagement, the 5 analysis steps, and false-positive triage rules
- `config.json` — the one file you edit per engagement (targets, branding, metadata)
- `report-data.js` — findings and report content, shipped with a complete worked example to copy from
- `scripts/run_audit.sh` — passive evidence collection (curl headers + bodies, TLS, SPF/DMARC)
- `scripts/consent_check.js` — headless-Chrome pre-consent cookie and tracker capture
- `scripts/build_report.js` — the report generator (HTML + DOCX); don't edit this per engagement
- `scripts/export_pdf.js` — renders the HTML report to an A4 PDF
- `README.md` — quick start and the per-engagement checklist

---

## Framework Packs — Automation Skills
**Folder:** `framework-packs/`

These skills are for engineers who write automated tests. Two packs: one for Playwright (TypeScript), one for Selenium (Java + TestNG).

---

### Playwright Pack — 11 Skills
**Folder:** `framework-packs/playwright-pack/`

> Playwright is a modern browser automation tool. It's fast, reliable, and uses TypeScript.

#### `pw-test-generator`
Writes a complete Playwright spec from a user flow description.
> Say: "Write a Playwright test for: user adds item to cart and checks out"

#### `pw-page-object-builder`
Creates a Page Object Model class for a page — all locators and actions in one reusable file.
> Say: "Build a page object for the Login page at /login with username, password, submit button"

#### `pw-fixture-designer`
Designs Playwright fixtures — shared setup/teardown code like "log in once and reuse across tests".
> Say: "Create an auth fixture that logs in as admin before each test"

#### `pw-api-tester`
Writes Playwright API tests (no browser, just HTTP requests) with schema validation.
> Say: "Write API tests for GET /api/users — should return 200 with array of user objects"

#### `pw-network-mocker`
Sets up route interception to fake API responses — test what happens when the API returns errors.
> Say: "Mock the /api/orders endpoint to return a 500 error and test that the error banner shows"

#### `pw-flaky-debugger`
Diagnoses why a Playwright test passes sometimes and fails other times.
> Say: "This test is flaky — [paste your test code]. It fails about 1 in 5 runs"

#### `pw-locator-fixer`
Scans Playwright code for brittle selectors (XPath, CSS class names, nth-child) and rewrites them to stable ones.
> Say: "Fix these locators: [paste code with page.locator('.btn-primary') etc]"

#### `pw-trace-analyzer`
Reads a Playwright trace.zip failure and explains exactly what went wrong and how to fix it.
> Say: "Analyze this failure: [paste the error message and stack trace]"

#### `pw-visual-regression`
Sets up screenshot comparison tests — takes a snapshot of a component and detects visual changes.
> Say: "Add visual regression tests for the dashboard summary card"

#### `pw-accessibility-auditor`
Adds automated accessibility (a11y) checks using axe-core — finds things like missing labels, poor contrast, WCAG violations.
> Say: "Add accessibility checks to the checkout page tests"

#### `pw-ci-configurator`
Generates GitHub Actions CI config to run your Playwright suite in the cloud — with sharding, test reports, and artifact uploads.
> Say: "Set up GitHub Actions for my Playwright suite. Node 20, Chromium only, 4 shards."

---

### Selenium Pack — 11 Skills
**Folder:** `framework-packs/selenium-pack/`

> Selenium is the classic browser automation tool. This pack uses Java + TestNG.

#### `se-test-generator`
Writes a Selenium + TestNG test class from a plain-language scenario.
> Say: "Write a Selenium test for login with valid credentials. URL is /login."

#### `se-page-object-builder`
Creates a Java Page Object class (PageFactory or explicit By locators) for a given page.
> Say: "Build a Page Object for the login page with username, password, and submit fields"

#### `se-driver-manager`
Sets up a thread-safe WebDriver factory using Selenium Manager — no manual chromedriver paths needed.
> Say: "Set up a thread-safe ChromeDriver factory for my parallel TestNG tests"

#### `se-wait-fixer`
Finds all Thread.sleep calls and implicit/explicit wait mixing in your code and replaces them with proper WebDriverWait.
> Say: "Remove Thread.sleep from this code and fix the synchronization: [paste code]"

#### `se-locator-strategist`
Reviews brittle XPath selectors and recommends stable alternatives (By.id, By.cssSelector, relative locators).
> Say: "This XPath keeps breaking: //div[2]/form/button[1]. Give me a stable alternative."

#### `se-flaky-debugger`
Diagnoses Selenium flakiness — StaleElementReferenceException, timing races, CI vs local differences.
> Say: "My test throws StaleElementReferenceException intermittently. Here's the code: [paste]"

#### `se-data-driven-designer`
Designs TestNG @DataProvider tests with valid, invalid, and boundary data sets — or reads from CSV/Excel/JSON.
> Say: "Make the login test data-driven with valid, invalid, and boundary inputs"

#### `se-cross-browser-runner`
Sets up TestNG to run the same tests across Chrome, Firefox, and Edge in parallel.
> Say: "Set up cross-browser testing for Chrome and Firefox using testng.xml parameters"

#### `se-grid-configurator`
Configures Selenium Grid 4 (local JARs or Docker) and wires tests to run via RemoteWebDriver.
> Say: "Set up Selenium Grid 4 with Docker for Chrome and Firefox nodes"

#### `se-framework-scaffolder`
Scaffolds an entire Maven Selenium framework from scratch — folder structure, pom.xml, BaseTest, config, reporting.
> Say: "Scaffold a Maven Selenium + TestNG framework with Allure reporting"

#### `se-report-integrator`
Adds Allure or ExtentReports to a TestNG suite — with screenshot-on-failure and step logging.
> Say: "Add Allure reporting to my TestNG suite with screenshots on test failure"

---

## The Golden Rules (Read These)

**Rule 1 — The AI drafts, you decide.**
Every skill produces a DRAFT. The AI does not know your real app. You must review everything before using it.

**Rule 2 — Never skip the HUMAN REVIEW GATE.**
Every skill ends with a review gate. This is not decoration. Stop. Read. Check. Then proceed.

**Rule 3 — Skills work in order.**
The phases feed into each other:
```
01 Analyze ticket
    ↓
02 Write test plan
    ↓
03 Design scenarios
    ↓
04 Write test cases + generate test data
    ↓
05 Execute (generate automation scripts, track results, pick regression tests)
    ↓
06 Handle defects (report bugs, triage, do RCA)
    ↓
07 Close the cycle (analyze coverage, write closure report)
```
Don't skip steps. If you try to write test cases without approved scenarios, the skill will tell you to go back.

Phase 08 (security testing) runs on a live, deployed site and stands apart from this flow — reach for it whenever you need to assess a running website, not just at the end of a cycle.

**Rule 4 — The AI never invents things.**
If a field, locator, requirement, or data value is unknown, the AI will mark it as a TODO or ask you to provide it. It will never make something up and present it as real.

**Rule 5 — Install only the skills you need.**
You do not need all 37 skills active at once. Pick the one that matches your current task.

**Rule 6 — For security testing, get authorization first.**
The `blackbox-web-security-audit` skill touches real, live websites. Never point it at a domain you
do not own or have written permission to test. Keep it passive and rate-limited, exactly as the
skill specifies.

---

## Quick Reference: Which Skill for Which Problem?

| Problem you have                                | Skill to use                            |
|-------------------------------------------------|-----------------------------------------|
| Is this JIRA ticket ready to test?              | `jira-requirement-analyzer`             |
| I need a test plan for this story               | `test-plan-generator`                   |
| What scenarios should I test?                   | `test-scenario-designer`                |
| What should I test for this API endpoint?       | `api-test-designer`                     |
| I need to write detailed test cases             | `test-case-writer`                      |
| I need test data (valid, invalid, boundary)     | `test-data-generator`                   |
| Automate this test case in Playwright           | `automation-script-generator`           |
| Automate this test case in Selenium             | `se-test-generator`                     |
| Track my test run results                       | `test-execution-tracker`                |
| Which tests do I run for this PR?               | `regression-suite-selector`             |
| Write a proper bug report                       | `bug-reporter`                          |
| Sort and prioritize my bug backlog              | `bug-triage-assistant`                  |
| Why did this bug escape testing?                | `rca-analyzer`                          |
| What requirements are not tested?               | `test-coverage-analyzer`                |
| Write the end-of-cycle closure report           | `test-closure-reporter`                 |
| Security & privacy audit of a live website      | `blackbox-web-security-audit`           |
| Write a Playwright test from scratch            | `pw-test-generator`                     |
| Build a Playwright Page Object                  | `pw-page-object-builder`                |
| Create Playwright fixtures (auth, data setup)   | `pw-fixture-designer`                   |
| Write Playwright API tests                      | `pw-api-tester`                         |
| Mock a backend API in Playwright tests          | `pw-network-mocker`                     |
| Fix a flaky Playwright test                     | `pw-flaky-debugger`                     |
| Replace bad locators in Playwright              | `pw-locator-fixer`                      |
| Read a Playwright trace.zip failure             | `pw-trace-analyzer`                     |
| Add visual screenshot regression                | `pw-visual-regression`                  |
| Add accessibility (a11y) checks                 | `pw-accessibility-auditor`              |
| Set up Playwright in GitHub Actions CI          | `pw-ci-configurator`                    |
| Write a Selenium test from scratch              | `se-test-generator`                     |
| Build a Selenium Page Object (Java)             | `se-page-object-builder`                |
| Set up WebDriver factory (thread-safe)          | `se-driver-manager`                     |
| Remove Thread.sleep from Selenium code          | `se-wait-fixer`                         |
| Fix brittle XPath locators in Selenium          | `se-locator-strategist`                 |
| Debug flaky Selenium tests                      | `se-flaky-debugger`                     |
| Make a Selenium test data-driven                | `se-data-driven-designer`               |
| Run Selenium tests on Chrome + Firefox + Edge   | `se-cross-browser-runner`               |
| Set up Selenium Grid / Docker grid              | `se-grid-configurator`                  |
| Build a Maven Selenium framework from zero      | `se-framework-scaffolder`               |
| Add Allure or ExtentReports to TestNG           | `se-report-integrator`                  |

---

*Built by Vishal Chincholi — for QA engineers who want to test smarter, not harder.*
