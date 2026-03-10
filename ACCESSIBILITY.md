# Accessibility Commitment (ACCESSIBILITY.md)

## 1. Our Commitment

We believe accessibility is a subset of quality. The WCAG Spine project commits to **WCAG 2.2 AA** standards for all documentation, code examples, and the interactive dashboard itself. We track our progress publicly to remain accountable to our users.

This project is specifically focused on making WCAG Success Criteria data more understandable and navigable — it should itself be a model of accessibility.

## 2. Real-Time Health Metrics

| Metric | Status / Value |
| :--- | :--- |
| **Open A11y Issues** | [View open accessibility issues](https://github.com/mgifford/wcag-spine/labels/accessibility) |
| **Automated Test Pass Rate** | Monitored via GitHub Actions (see `.github/workflows/sync_accessibility.yml`) |
| **A11y PRs Merged (MTD)** | Tracked in [project insights](https://github.com/mgifford/wcag-spine/pulse) |
| **Browser Support** | Last 2 major versions of Chrome, Firefox, Safari |
| **Dashboard Conformance** | WCAG 2.2 AA — keyboard navigable, screen reader compatible |

## 3. Mermaid Diagram Accessibility

A core feature of this project is Mermaid.js diagram generation. Every diagram we produce **must** follow our accessibility best practices:

- **[examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md](./examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md)** — Normative reference for accessible Mermaid diagrams

Key requirements for all Mermaid diagrams in this project:

```mermaid
%%accTitle Brief, meaningful title (max 100 characters)
%%accDescr Detailed description of what the diagram shows
```

- All diagrams must include `%%accTitle` and `%%accDescr` metadata
- SVG output must implement [Pattern 11](./examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md#2-svg-accessibility-requirements) (`role="img"`, `<title>`, `<desc>`, `aria-labelledby`)
- Color combinations must meet WCAG contrast ratios in both light and dark modes
- Decision node labels must be contextual (e.g., "Yes, proceed" not just "Yes")

## 4. Contributor Requirements (The Guardrails)

To contribute to this repo, you must follow these guidelines:

- **Dashboard Accessibility:** The `index.html` dashboard must remain keyboard-navigable and screen reader compatible
- **Mermaid Diagrams:** Follow [examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md](./examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md) for all diagram content
- **Data Integrity:** `master_spine.json` changes must not break accessible rendering of WCAG success criteria
- **Inclusive Language:** Use person-centered, respectful language throughout
- **Color Contrast:** All UI elements must maintain WCAG 4.5:1 (text) and 3:1 (non-text) contrast ratios

## 5. Reporting & Severity Taxonomy

Please use our [issue tracker](https://github.com/mgifford/wcag-spine/issues/new) when reporting issues. We prioritize based on:

- **Critical:** A dashboard feature prevents users from completing core tasks (e.g., cannot navigate to a WCAG SC, broken keyboard navigation)
- **High:** A significant accessibility barrier or misleading WCAG guidance
- **Medium:** Documentation clarity issues or incomplete examples
- **Low:** Minor improvements, typos, or enhancements

## 6. Dashboard Accessibility Features

The WCAG Spine dashboard (`index.html`) provides:

- **Keyboard navigation** — All interactive elements (filters, cards, diagrams) are keyboard accessible
- **Screen reader support** — Semantic HTML, appropriate ARIA roles, and live regions for dynamic content
- **Three views** — Cards, Diagram (Mermaid), and Table — each with accessible markup
- **Filter controls** — Labeled form controls for Level, Role, Automation, and Search
- **Deep-linking** — Direct URL access to any Success Criterion (e.g., `#2.4.11`)

## 7. Automated Check Coverage

Our CI pipeline validates:

- **Data sync** — `sync_accessibility.yml` runs daily to keep WCAG data current
- **Dashboard deployment** — GitHub Pages deployment after each sync
- **Manual testing guidance** — See [examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md](./examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md) for diagram validation checklist

## 8. Browser & Assistive Technology Support

### Browser Support

This project supports the **last 2 major versions** of all major browser engines:
- **Chrome/Chromium** (including Edge, Brave)
- **Firefox**
- **Safari/WebKit** (macOS and iOS)

### Assistive Technology Testing

Contributors are encouraged to test the dashboard with:

- **Screen readers:** JAWS, NVDA, VoiceOver, TalkBack
- **Keyboard navigation:** Tab, arrow keys, standard shortcuts
- **Magnification:** Browser zoom up to 200%, screen magnifiers
- **Voice control:** Dragon, Voice Control

## 9. Known Limitations

- **Mermaid diagram view** — The spine graph (first 20 filtered SCs) is a visual representation; complex diagrams may be difficult to navigate by keyboard alone
- **Large data sets** — The full 78-SC view may be verbose for screen readers; use filters to narrow results
- **Dynamic content** — Filter results update the DOM dynamically; ARIA live regions are used but may vary across screen reader implementations

## 10. Getting Help

- **Questions:** Open a [discussion](https://github.com/mgifford/wcag-spine/discussions)
- **Bugs or gaps:** Open an [issue](https://github.com/mgifford/wcag-spine/issues)
- **Contributions:** See [README.md](./README.md)
- **Accommodations:** Request via issue with `accessibility-accommodation` label

## 11. Continuous Improvement

We regularly review and update:
- WCAG conformance as standards evolve (targeting 2.2 AA, monitoring 3.0)
- Mermaid diagram best practices as the library matures
- Tool recommendations and automation examples
- Inclusive language and terminology

---

Last updated: 2026-03-06
