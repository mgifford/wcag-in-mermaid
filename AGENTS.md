# AI Agent Instructions (AGENTS.md)

> **System instructions for AI coding assistants contributing to this project.**
>
> This file follows the [agents.md](https://agents.md) convention — a machine-readable manifest
> that tells AI agents how to work within this repository's standards and constraints.

This file provides guidance for AI agents (GitHub Copilot, Cursor, Claude, GPT-4, etc.) working on the **WCAG Spine** project — an interactive dashboard visualising WCAG 2.2 Success Criteria with Mermaid.js diagrams.

## Primary References

Before proposing or writing any changes, read these project files:

1. **[ACCESSIBILITY.md](./ACCESSIBILITY.md)** — Accessibility commitment and requirements (WCAG 2.2 AA)
2. **[examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md](./examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md)** — Normative reference for accessible Mermaid diagrams
3. **[README.md](./README.md)** — Project overview, data schema, and architecture

## Project Overview

This project is a **WCAG data visualisation dashboard** with three key components:

| File | Purpose |
|------|---------|
| `index.html` | GitHub Pages dashboard — filtering, cards, diagrams, table views |
| `assets/js/app.js` | Frontend logic — Mermaid rendering, filters, routing |
| `assets/css/style.css` | Dashboard styles — must maintain WCAG contrast ratios |
| `data/master_spine.json` | Merged WCAG 2.2 data (auto-updated daily) |
| `scripts/sync_data.py` | Python data orchestrator — fetches from W3C, Axe, Alfa, Trusted Tester |
| `.github/workflows/sync_accessibility.yml` | Daily sync + GitHub Pages deploy |

## Core Requirements

### Accessibility

- All dashboard features must comply with **WCAG 2.2 Level AA**
- The `index.html` must remain keyboard-navigable and screen reader compatible
- Follow **[examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md](./examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md)** for all Mermaid diagram work
- Every Mermaid diagram must include `%%accTitle` and `%%accDescr` metadata
- SVG output must use `role="img"`, `<title>`, `<desc>`, and `aria-labelledby` (Pattern 11)
- Color combinations must pass WCAG contrast ratios in both light and dark modes
- Use semantic HTML, proper ARIA attributes, and keyboard focus management

### Mermaid Diagram Standards

When generating or modifying Mermaid diagrams:

```mermaid
%%accTitle [Descriptive title, max 100 characters]
%%accDescr [Full description of diagram purpose, key nodes, and relationships]
graph LR
    %% diagram content...
```

- Always place `%%accTitle` and `%%accDescr` at the **top** of the diagram block
- Decision node edge labels must be **contextual** (e.g., `"Yes, grant access"` not `"Yes"`)
- Node labels must be **meaningful** — avoid single-letter identifiers in final output
- Use `classDef` for consistent color theming; always verify contrast ratios
- The spine diagram uses `graph LR` to stack SC nodes vertically — preserve this pattern

### Data Integrity

The `master_spine.json` schema must remain:

```json
{
  "meta": { "generated": "...", "wcag_version": "2.2", "sources": {} },
  "success_criteria": {
    "X.Y.Z": {
      "title": "...", "level": "A|AA|AAA", "principle": "...", "url": "...",
      "automation": { "act": [], "axe": [], "alfa": [] },
      "manual": {
        "roles": [],
        "tt_steps": [],
        "arrm_tasks": [{ "id": "...", "task": "...", "primary_ownership": "...",
                         "secondary_ownership": "...", "category_url": "...", "role_url": "..." }]
      }
    }
  }
}
```

- **Never** remove or rename top-level schema keys — `app.js` depends on this structure
- `_TT_IDS_IN_NODE=4` in `sync_data.py` and `TT_IDS_IN_NODE=4` in `app.js` must stay in sync
- SC keys must always be in format `"X.Y.Z"` (e.g., `"2.4.11"`)

### Code Quality

- Keep changes **minimal and request-scoped** — do not refactor unrelated code
- Maintain existing patterns in `app.js` (filter logic, Mermaid rendering, URL routing)
- Python code in `sync_data.py` uses only the standard library — do not add third-party dependencies
- All JavaScript in `app.js` runs in the browser — no Node.js-specific APIs
- Prefer `const`/`let` over `var`; use semantic variable names

### Documentation

- Keep all documentation links valid
- Update cross-references when adding new pages
- Follow the project's plain-language style

## Mermaid Diagram Review Checklist

Before submitting any Mermaid diagram change, verify:

- [ ] `%%accTitle` present and ≤100 characters
- [ ] `%%accDescr` present and ≥10 characters
- [ ] All `classDef` colors meet WCAG 4.5:1 contrast ratio against background
- [ ] Decision edges use contextual labels
- [ ] Node labels are meaningful (not single letters)
- [ ] Diagram renders without syntax errors
- [ ] SVG output uses `role="img"` and `aria-labelledby`

## Testing and Validation

- **Data sync:** Run `python scripts/sync_data.py` locally to validate data changes
- **Dashboard:** Open `index.html` in a browser; verify all three views (Cards, Diagram, Table)
- **Keyboard:** Tab through all interactive elements; confirm no keyboard traps
- **Screen reader:** Test with NVDA (Windows) or VoiceOver (macOS) on at least one view
- **Contrast:** Use browser DevTools or a contrast checker for any CSS color changes

## Priority Taxonomy

When identifying or reporting issues:

- **Critical:** Dashboard feature prevents users from completing core tasks (blocked navigation, keyboard trap)
- **High:** Significant accessibility barrier or WCAG data error
- **Medium:** Documentation clarity or incomplete examples
- **Low:** Minor improvements, typos, enhancements

Never introduce Critical or High severity accessibility issues.

## Quick Decision Framework

If uncertain about an approach:

1. Consult **[ACCESSIBILITY.md](./ACCESSIBILITY.md)** for project-level commitments
2. Consult **[examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md](./examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md)** for diagram specifics
3. Check existing patterns in `app.js` and `index.html`
4. When in doubt, choose the more accessible option

## Machine-Readable Standards Reference

This project's data is grounded in [wai-yaml-ld](https://github.com/mgifford/wai-yaml-ld) machine-readable standards:

- [WCAG 2.2 (YAML)](https://github.com/mgifford/wai-yaml-ld/blob/main/kitty-specs/001-wai-standards-yaml-ld-ingestion/research/wcag-2.2-normative.yaml)
- [ARIA Informative (YAML)](https://github.com/mgifford/wai-yaml-ld/blob/main/kitty-specs/001-wai-standards-yaml-ld-ingestion/research/wai-aria-informative.yaml)
- [Standards Link Graph (YAML)](https://github.com/mgifford/wai-yaml-ld/blob/main/kitty-specs/001-wai-standards-yaml-ld-ingestion/research/standards-link-graph.yaml)

## Continuous Improvement

Help maintain quality by:

- Suggesting accessibility improvements when reviewing code
- Documenting new patterns in `examples/` for reuse
- Sharing reasoning in PR descriptions
- Flagging outdated WCAG guidance or broken data source links

---

**Remember:** This project exists to make WCAG data more accessible. The tool must itself be a demonstration of good accessibility practice.
