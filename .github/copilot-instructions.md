# GitHub Copilot Instructions

> **Primary reference for AI coding agents contributing to this repository.**
> For comprehensive guidance, start with the files listed below before making any changes.

## Essential Reading

Before proposing or writing any code changes, read these project files in order:

1. **[/AGENTS.md](../AGENTS.md)** — Normative AI agent instructions: project overview, coding standards, data integrity rules, Mermaid diagram requirements, and a pre-submission checklist. This is the single most important file for agents working in this repo.
2. **[/ACCESSIBILITY.md](../ACCESSIBILITY.md)** — Accessibility commitment and WCAG 2.2 AA requirements that all contributions must satisfy.
3. **[/README.md](../README.md)** — Project overview, architecture, data schema, and getting-started guidance.
4. **[/examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md](../examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md)** — Normative reference for every Mermaid.js diagram produced or modified in this repo.

## Quick-Start Summary

This project is a **WCAG 2.2 data visualization dashboard** deployed via GitHub Pages. The key files are:

| File | Role |
|------|------|
| `index.html` | Main dashboard (Cards / Diagram / Table / ACT Rules views) |
| `assets/js/app.js` | All frontend logic — filters, Mermaid rendering, URL routing |
| `assets/css/style.css` | Dashboard styles — contrast ratios must stay WCAG-compliant |
| `data/master_spine.json` | Merged WCAG 2.2 data (auto-updated daily by CI) |
| `scripts/sync_data.py` | Python data orchestrator (standard library only) |
| `.github/workflows/sync_accessibility.yml` | Daily sync + GitHub Pages deploy |

## Non-Negotiable Rules

- **Never** remove or rename keys in `master_spine.json` — `app.js` depends on the exact schema.
- `_TT_IDS_IN_NODE=4` in `sync_data.py` and `TT_IDS_IN_NODE=4` in `app.js` **must stay in sync**.
- Every Mermaid diagram **must** include `%%accTitle` and `%%accDescr` at the top of the block.
- All color changes must pass WCAG 4.5:1 contrast (text) and 3:1 (non-text) in light **and** dark modes.
- `sync_data.py` uses **only** Python standard library — do not add third-party dependencies.
- `app.js` runs in the browser — no Node.js-specific APIs.

## Errors and Known Workarounds

- **CI data-sync failures**: The daily `sync_accessibility.yml` workflow fetches live data from W3C, Axe, Alfa, and Trusted Tester. Transient HTTP errors are expected; re-run the workflow before investigating further.
- **Mermaid render errors**: Syntax errors silently produce an empty diagram. Validate diagram syntax locally by opening `index.html` in a browser and checking the console before committing.

## Validation Checklist (run before every PR)

- [ ] `%%accTitle` (≤100 chars) and `%%accDescr` (≥10 chars) present in every diagram
- [ ] `master_spine.json` schema unchanged (no key additions or removals at top level)
- [ ] `python scripts/sync_data.py` completes without errors
- [ ] Dashboard renders all four views in a browser (Cards, Diagram, Table, ACT Rules)
- [ ] All interactive elements remain keyboard-accessible (Tab/Enter/Space)
- [ ] No new `var` declarations in `app.js`
