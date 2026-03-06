# WCAG Mirror Spine

> An interactive GitHub Pages dashboard that visualises the "Mirror Spine" of
> WCAG 2.2 — bridging Responsibility (ARRM) and Technical Testing
> (ACT, Axe-core, Alfa, Trusted Tester) for every Success Criterion.

[![Sync Accessibility Data](https://github.com/mgifford/wcag-in-mermaid/actions/workflows/sync_accessibility.yml/badge.svg)](https://github.com/mgifford/wcag-in-mermaid/actions/workflows/sync_accessibility.yml)

---

> [!WARNING]
> **🚧 Experimental — AI-generated content, not yet validated**
>
> Most of this site was generated with AI assistance. **All content needs to be
> validated in real-world conditions before it is relied upon.**
>
> - Impacts may vary significantly depending on where and how the tool is implemented.
> - People with experience conducting studies on accessibility impact and the cost of
>   AI cycles should be involved in any evaluation or adoption decisions.
> - **Please provide feedback in the
>   [issue queue](https://github.com/mgifford/wcag-in-mermaid/issues)** if you have
>   positive or negative results from using this tool. Include links and references so
>   that claims can be discussed and verified.

---

## Live Demo

**[mgifford.github.io/wcag-in-mermaid](https://mgifford.github.io/wcag-in-mermaid)**

Deep-link directly to any SC:

```
https://mgifford.github.io/wcag-in-mermaid/#2.4.11
```

---

## What It Shows

For every WCAG 2.2 Success Criterion (1.1.1 → 4.1.3) the dashboard renders a
"vertebra" — a three-part view of:

| Side | Content |
|------|---------|
| **Centre** (spine) | SC number, title, conformance level |
| **Left** 🤖 Automation | ACT Rule IDs · Axe-core rule IDs · Alfa rule IDs |
| **Right** 👤 Human | ARRM responsibility roles · Trusted Tester procedure steps |

### Five views

| View | Description |
|------|-------------|
| **Cards** | Responsive card grid — the default view |
| **Diagram** | Mermaid.js spine graph (first 20 filtered SCs) |
| **Table** | Sortable/scannable data table |
| **ACT Rules** | Browse by ACT rule ID, showing engine implementations |
| **Coverage** | Automation coverage statistics and testing methodology |

### Filters

- **Level** — A / AA / AAA
- **Role** — filter by ARRM responsibility (e.g. *Visual Design*)
- **Automation** — Any · Partial · Full (all 3 engines) · None (0%)
- **Search** — free-text search on SC number or keyword

---

## Repository Structure

```
wcag-in-mermaid/
├── index.html                          # GitHub Pages entry point
├── assets/
│   ├── css/style.css                   # Dashboard styles
│   └── js/app.js                       # Frontend logic (filtering, Mermaid, routing)
├── data/
│   └── master_spine.json               # Merged WCAG 2.2 data (auto-updated daily)
├── scripts/
│   └── sync_data.py                    # Python data orchestrator
├── testing-methods.md                  # Testing methodology & resource documentation
├── wcag-sc-roles-diagram.md            # Index linking to per-principle diagrams
├── wcag-perceivable-diagram.md         # Principle 1 – Perceivable (1.x.x)
├── wcag-operable-diagram.md            # Principle 2 – Operable (2.x.x)
├── wcag-understandable-diagram.md      # Principle 3 – Understandable (3.x.x)
├── wcag-robust-diagram.md              # Principle 4 – Robust (4.x.x)
├── .github/
│   └── workflows/
│       └── sync_accessibility.yml      # Daily sync + GitHub Pages deploy
└── requirements.txt
```

> **Note on diagram splitting:** GitHub enforces a maximum text size for Mermaid
> diagrams. To stay within that limit, the diagrams are split one file per WCAG
> principle (Perceivable / Operable / Understandable / Robust). The overview file
> [`wcag-sc-roles-diagram.md`](wcag-sc-roles-diagram.md) links to each.

---

## Data Sources

| Source | URL |
|--------|-----|
| W3C ARRM (roles & tasks) | https://github.com/w3c/wai-arrm/tree/draft/_data/arrm |
| ACT Rules Registry | https://www.w3.org/WAI/standards-guidelines/act/rules/data/rules.json |
| Axe-core Rules | https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md |
| Alfa Rules (Siteimprove) | https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md |
| DHS Trusted Tester | https://section508.gov/test/trusted-tester/ |

---

## Running the Sync Script Locally

```bash
# No third-party dependencies — uses only the Python standard library
python scripts/sync_data.py
```

The script:
1. Downloads the latest ARRM CSV and ACT Rules JSON from W3C.
2. Merges them by SC number into `data/master_spine.json`.
3. Prints a summary of how many mappings were updated.

---

## master_spine.json Schema

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

## GitHub Pages Setup

1. Go to **Settings → Pages**.
2. Set **Source** to *GitHub Actions*.
3. Push to `main` — the workflow deploys automatically.

The daily `sync_accessibility.yml` workflow also re-deploys after updating
`master_spine.json`.

---

## Contributing

Pull requests are welcome! To add or correct a rule mapping:

1. Edit `data/master_spine.json` directly, **or**
2. Update `scripts/sync_data.py` if the source data format changes.

---

## Documentation

| Document | Description |
|----------|-------------|
| [`testing-methods.md`](testing-methods.md) | Testing methodology, resource links, and coverage gap analysis |
| [`examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md`](examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md) | How to write accessible Mermaid diagrams |
| [`ACCESSIBILITY.md`](ACCESSIBILITY.md) | Project accessibility commitments |
| [`wcag-sc-roles-diagram.md`](wcag-sc-roles-diagram.md) | Per-principle static Mermaid diagrams |

---

## License

[MIT](LICENSE) · Data sourced from W3C (CC BY 4.0) and open-source projects.
