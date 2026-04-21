# WCAG Spine

> An interactive GitHub Pages dashboard that visualises the "Mirror Spine" of
> WCAG 2.2 — bridging Responsibility (ARRM) and Technical Testing
> (ACT, Axe-core, Alfa, Trusted Tester) for every Success Criterion.

[![Sync Accessibility Data](https://github.com/mgifford/wcag-spine/actions/workflows/sync_accessibility.yml/badge.svg)](https://github.com/mgifford/wcag-spine/actions/workflows/sync_accessibility.yml)

---

> [!WARNING]
> **🚧 Experimental — AI-assisted code, not yet fully validated**
>
> The **code** for this site (HTML/CSS/JS frontend, Python data-pipeline, CI workflows,
> and documentation) was largely written with AI assistance. The **source data** — WCAG
> 2.2 Success Criteria, ACT Rules, Axe-core/Alfa rule IDs, ARRM roles, and Trusted
> Tester steps — comes directly from authoritative W3C and DHS sources (see
> [Data Sources](#data-sources-) below) and is **not** AI-generated.
>
> Automated tests (Playwright + Axe-core, Lighthouse CI, and Python unit tests) run on
> every commit and are listed in [Testing & Accessibility Audits](#testing--accessibility-audits).
> However, the full codebase has **not** yet received a comprehensive human code review,
> and real-world edge cases may not be covered. Use with appropriate caution.
>
> - Impacts may vary significantly depending on where and how the tool is implemented.
> - People with experience conducting studies on accessibility impact and the cost of
>   AI cycles should be involved in any evaluation or adoption decisions.
> - **Please provide feedback in the
>   [issue queue](https://github.com/mgifford/wcag-spine/issues)** if you have
>   positive or negative results from using this tool. Include links and references so
>   that claims can be discussed and verified.

---

## Live Demo <a href="#live-demo" aria-label="Link to Live Demo section">#</a>

**[mgifford.github.io/wcag-spine](https://mgifford.github.io/wcag-spine)**

Deep-link directly to any SC:

```
https://mgifford.github.io/wcag-spine/#2.4.11
```

---

## What It Shows <a href="#what-it-shows" aria-label="Link to What It Shows section">#</a>

For every WCAG 2.2 Success Criterion (1.1.1 → 4.1.3) the dashboard renders a
"vertebra" — a three-part view of:

| Side | Content |
|------|---------|
| **Centre** (spine) | SC number, title, conformance level |
| **Left** 🤖 Automation | ACT Rule IDs · Axe-core rule IDs · Alfa rule IDs |
| **Right** 👤 Human | ARRM responsibility roles · Trusted Tester procedure steps |

### Five views <a href="#five-views" aria-label="Link to Five views section">#</a>

| View | Description |
|------|-------------|
| **Cards** | Responsive card grid — the default view |
| **Spine** | Interactive HTML/CSS "vertebra" graph |
| **Table** | Sortable/scannable data table |
| **ACT Rules** | Browse by ACT rule ID, showing engine implementations |
| **Coverage** | Automation coverage statistics and testing methodology |

### Filters <a href="#filters" aria-label="Link to Filters section">#</a>

- **Level** — A / AA / AAA
- **Role** — filter by ARRM responsibility (e.g. *Visual Design*)
- **Automation** — Any · Partial · Full (all 3 engines) · None (0%)
- **Search** — free-text search on SC number or keyword

---

## Repository Structure <a href="#repository-structure" aria-label="Link to Repository Structure section">#</a>

```
wcag-spine/
├── index.html                          # GitHub Pages entry point
├── assets/
│   ├── css/style.css                   # Dashboard styles
│   └── js/app.js                       # Frontend logic (filtering, spine generation, routing)
├── data/
│   └── master_spine.json               # Merged WCAG 2.2 data (auto-updated daily)
├── scripts/
│   └── sync_data.py                    # Python data orchestrator
├── testing-methods.md                  # Testing methodology & resource documentation
├── .github/
│   └── workflows/
│       └── sync_accessibility.yml      # Daily sync + GitHub Pages deploy
└── requirements.txt
```


---

## Data Sources <a href="#data-sources" aria-label="Link to Data Sources section">#</a>

| Source | URL | Machine-readable |
|--------|-----|-----------------|
| W3C ARRM (roles & tasks) | https://github.com/w3c/wai-arrm/tree/draft/_data/arrm | ✔ CSV |
| ACT Rules Mapping (W3C GitHub) | https://github.com/w3c/wcag-act-rules/blob/main/wcag-mapping.json | ✔ JSON |
| ACT Rules Registry (human-readable) | https://www.w3.org/WAI/standards-guidelines/act/rules/ | ✘ HTML only |
| EARL ACT document | https://github.com/w3c/wcag-act/blob/main/earl-act.json | ✔ JSON-LD |
| ACT Tools | https://github.com/act-rules/act-tools/ | ✔ (library) |
| Axe-core Rules | https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md | ✘ Markdown |
| Alfa Rules (Siteimprove) | https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md | ✘ Markdown |
| DHS Trusted Tester | https://section508.gov/test/trusted-tester/ | ✘ HTML only |

---

## Running the Sync Script Locally <a href="#running-the-sync-script-locally" aria-label="Link to Running the Sync Script Locally section">#</a>

```bash
# No third-party dependencies — uses only the Python standard library
python scripts/sync_data.py
```

The script:
1. Downloads the latest ARRM CSV and ACT Rules mapping JSON from W3C / GitHub.
2. Merges them by SC number into `data/master_spine.json`.
3. Prints a summary of how many mappings were updated.

---

## master_spine.json Schema <a href="#master_spinejson-schema" aria-label="Link to master_spine.json Schema section">#</a>

```json
{
  "meta": {
    "generated": "2026-03-05",
    "wcag_version": "2.2",
    "sources": { "...": "..." }
  },
  "success_criteria": {
    "2.4.11": {
      "title": "Focus Not Obscured (Minimum)",
      "level": "AA",
      "principle": "Operable",
      "url": "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html",
      "automation": {
        "act":  ["04639e"],
        "axe":  ["focus-not-obscured"],
        "alfa": ["SIA-R109"]
      },
      "manual": {
        "roles":    ["UX Design", "Front-End Development"],
        "tt_steps": ["2.4.11.A - Focus Visibility with Sticky Headers", "2.4.11.B - Focus with Overlays"]
      }
    }
  }
}
```

---

## GitHub Pages Setup <a href="#github-pages-setup" aria-label="Link to GitHub Pages Setup section">#</a>

1. Go to **Settings → Pages**.
2. Set **Source** to *GitHub Actions*.
3. Push to `main` — the workflow deploys automatically.

The daily `sync_accessibility.yml` workflow also re-deploys after updating
`master_spine.json`.

---

## Contributing <a href="#contributing" aria-label="Link to Contributing section">#</a>

Pull requests are welcome! To add or correct a rule mapping:

1. Edit `data/master_spine.json` directly, **or**
2. Update `scripts/sync_data.py` if the source data format changes.

---

## Testing & Accessibility Audits
To maintain our commitment to WCAG 2.2 AA, developers must run local audits:

1. **Install tools**: `npm install`
2. **Run All Audits**: `npm run test:a11y`
   - Runs **Playwright + Axe-core** in both Light and Dark modes.
   - Runs **Lighthouse CI** to ensure an accessibility score of 100%.

---

## AI Disclosure <a href="#ai-disclosure" aria-label="Link to AI Disclosure section">#</a>

Transparency about AI use is a core commitment of this project. Below is a record of every AI tool
that has been used, and how it was used. If you contribute using an AI tool, please add it to this
table (see [`AGENTS.md`](AGENTS.md) for instructions).

### What AI did — and did not — generate

To answer the natural question *"which parts of this project are AI-generated?"*:

| Layer | AI-generated? | Notes |
|-------|:---:|-------|
| **Source data** (WCAG 2.2 SCs, ACT Rules, Axe-core/Alfa IDs, ARRM roles, Trusted Tester steps) | ❌ No | Fetched directly from authoritative W3C and DHS sources by the sync script |
| **Data-pipeline code** (`scripts/sync_data.py`, CI workflows) | ✅ Yes | Written with AI assistance; covered by Python unit tests in `tests/` |
| **Frontend code** (`index.html`, `assets/js/app.js`, `assets/css/style.css`) | ✅ Yes | Written with AI assistance; covered by Playwright + Axe-core + Lighthouse CI |
| **Documentation** (`README.md`, `ACCESSIBILITY.md`, `AGENTS.md`, etc.) | ✅ Yes | Authored with AI assistance; reviewed and edited by the project maintainer |

### Human review & testing

The following safeguards are in place for AI-generated code:

- **Automated CI** runs on every commit: Playwright + Axe-core (0 violations required), Lighthouse CI (100% accessibility score required), and Python unit tests (`python3 -m pytest`).
- **Daily data sync** re-runs `sync_data.py` against live W3C/DHS endpoints and redeploys; failures are visible in the [Actions tab](https://github.com/mgifford/wcag-spine/actions).
- **Maintainer review** — all AI-generated PRs are reviewed by the project maintainer before merging.
- **Not yet fully audited** — a comprehensive independent human code review of the full codebase has not yet been completed. Contributions and reviews are welcome via the [issue queue](https://github.com/mgifford/wcag-spine/issues).

### AI tools used in development

| Tool | Layer(s) affected | Role |
|------|:---:|------|
| **GitHub Copilot** (Coding Agent / `copilot-swe-agent`) | Frontend · Data pipeline · Documentation | Code generation, documentation authoring, PR automation, and project scaffolding throughout the build of this project |
| **Antigravity** (AI Coding Assistant) | Frontend · Data pipeline | Removal of MermaidJS dependency; Implementation of pure HTML/CSS Spine View and data flow visualisations; Implementation of live Trusted Tester v5 scraper and data provenance source badges; Implementation of theme-aware (Light/Dark) accessibility CI/CD pipeline (Playwright + Axe-core + Lighthouse); Remediation of WCAG 2.2 AA violations (contrast, nested interactive, target-size) |
| **Claude Sonnet** (GitHub Copilot Task Agent / `claude-sonnet-4.5`) | Data pipeline | Fixed false-positive WCAG 3.0 Recommendation check in `scripts/check_updates.py` — added `fetch_content_snippet()` helper and updated `check_wcag30()` to verify "W3C Recommendation" in page content rather than relying solely on HTTP 200; updated unit tests accordingly |

### Runtime AI

**None.** The dashboard is a fully static site. When a user opens the application, no LLM or
AI API is called. All data is pre-built by the daily CI sync script and served as a static JSON
file (`data/master_spine.json`).

### Browser-based AI

**None.** No on-device or browser-based AI features are present. The frontend (`app.js`) does not
load any AI SDK, call any inference endpoint, or delegate any logic to a browser AI API.

---

## Documentation <a href="#documentation" aria-label="Link to Documentation section">#</a>

| [`testing-methods.md`](testing-methods.md) | Testing methodology, resource links, and coverage gap analysis |
| [`ACCESSIBILITY.md`](ACCESSIBILITY.md) | Project accessibility commitments |

---

## License <a href="#license" aria-label="Link to License section">#</a>

[MIT](LICENSE) · Data sourced from W3C (CC BY 4.0) and open-source projects.
