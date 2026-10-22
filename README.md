# QA Master Skills

> Author: Vishal Chincholi
> **37 pre-built AI skill files** covering every phase of software testing — plus a full security-audit toolkit.

A library of ready-to-use AI skills for QA engineers. Each skill is a folder with a `SKILL.md`
that tells an AI assistant (Claude, GitHub Copilot, ChatGPT, Gemini, or any agent) exactly how to
help with one specific testing job: how to do it, what the output should look like, and the rules
it must never break.

Think of each skill as a cheat sheet you hand a new intern — except the intern is your AI tool.

## What's inside

The skills are organized by the **STLC (Software Testing Life Cycle)**, plus a security phase and
two automation framework packs:

| Phase | Folder | Skills |
|---|---|---|
| 1 — Requirement Analysis | [`skills/01-requirement-analysis`](skills/01-requirement-analysis) | `jira-requirement-analyzer` |
| 2 — Test Planning | [`skills/02-test-planning`](skills/02-test-planning) | `test-plan-generator` |
| 3 — Test Design | [`skills/03-test-design`](skills/03-test-design) | `test-scenario-designer`, `api-test-designer` |
| 4 — Test Case Development | [`skills/04-test-case-development`](skills/04-test-case-development) | `test-case-writer`, `test-data-generator` |
| 5 — Test Execution | [`skills/05-test-execution`](skills/05-test-execution) | `automation-script-generator`, `test-execution-tracker`, `regression-suite-selector` |
| 6 — Defect Management | [`skills/06-defect-management`](skills/06-defect-management) | `bug-reporter`, `bug-triage-assistant`, `rca-analyzer` |
| 7 — Test Closure | [`skills/07-test-closure`](skills/07-test-closure) | `test-coverage-analyzer`, `test-closure-reporter` |
| 8 — Security Testing | [`skills/08-security-testing`](skills/08-security-testing) | `blackbox-web-security-audit` |
| Framework Pack — Playwright (TS) | [`skills/framework-packs/playwright-pack`](skills/framework-packs/playwright-pack) | 11 skills |
| Framework Pack — Selenium (Java) | [`skills/framework-packs/selenium-pack`](skills/framework-packs/selenium-pack) | 11 skills |

## Full guide

The complete, plain-English walkthrough of every skill — what it does, why you need it, what to
say to the AI, and what you get back — lives here:

**→ [`skills/README.md`](skills/README.md)**

## How to use a skill (in short)

1. Find the skill that matches your task (see the table above or the full guide).
2. Open its `SKILL.md`.
3. Load it into your AI tool:
   - **Claude Code:** `cp -r ./skills/<path-to-skill> ~/.claude/skills/`
   - **GitHub Copilot:** copy `SKILL.md` into `.github/prompts/<name>.prompt.md`, then type `/<name>` in Copilot Chat
   - **Any other AI:** paste the `SKILL.md` contents as your system prompt
4. Give the AI your input (a ticket, a feature, an endpoint, a bug, etc.).
5. **Review the output.** Every skill produces a draft behind a HUMAN REVIEW GATE — the AI assists,
   you decide.

## Golden rules

- **The AI drafts, you decide.** It doesn't know your real app, URLs, or data.
- **Never skip the review gate.** Every skill ends with one.
- **Skills work in order** (phases 1→7 feed into each other). Phase 8 (security) runs against a
  live, deployed site and stands apart from that flow.
- **The AI never invents things** — unknowns are marked TODO or asked back to you.
- **For the security audit, get written authorization first.** The `blackbox-web-security-audit`
  skill touches real, live websites. Keep it passive and rate-limited, and never point it at a
  domain you don't own or have permission to test.

## License

[MIT](LICENSE)

---

*Built by Vishal Chincholi — for QA engineers who want to test smarter, not harder.*
