# Accessibility Commitment (ACCESSIBILITY.md)

## 1. Our Commitment <a href="#1-our-commitment" aria-label="Link to 1. Our Commitment section">#</a>

We believe accessibility is a subset of quality. The WCAG Spine project commits to **WCAG 2.2 AA** standards for all documentation, code examples, and the interactive dashboard itself. We track our progress publicly to remain accountable to our users.

This project is specifically focused on making WCAG Success Criteria data more understandable and navigable — it should itself be a model of accessibility.

## 2. Real-Time Health Metrics <a href="#2-real-time-health-metrics" aria-label="Link to 2. Real-Time Health Metrics section">#</a>

| Metric | Status / Value |
| :--- | :--- |
| **Open A11y Issues** | [View open accessibility issues](https://github.com/mgifford/wcag-spine/labels/accessibility) |
| **Automated Test Pass Rate** | Monitored via GitHub Actions (see `.github/workflows/sync_accessibility.yml`) |
| **A11y PRs Merged (MTD)** | Tracked in [project insights](https://github.com/mgifford/wcag-spine/pulse) |
| **Browser Support** | Last 2 major versions of Chrome, Firefox, Safari |
| **Dashboard Conformance** | WCAG 2.2 AA — keyboard navigable, screen reader compatible |

## 3. Anchor Links Accessibility <a href="#3-anchor-links-accessibility" aria-label="Link to 3. Anchor Links Accessibility section">#</a>

All in-page navigation (skip links, heading permalinks, deep-link hash navigation) **must** follow our anchor-link best practices:

- **[examples/ANCHOR_LINKS_ACCESSIBILITY_BEST_PRACTICES.md](./examples/ANCHOR_LINKS_ACCESSIBILITY_BEST_PRACTICES.md)** — Normative reference for accessible anchor links

Key requirements:

- Skip links must be the first focusable element and visible on focus
- Skip-link targets (`<main>`, etc.) must have `tabindex="-1"` to receive programmatic focus
- Deep-link targets must call `.focus({ preventScroll: true })` after `scrollIntoView()`
- All `id` values must be unique, stable, and meaningful
- Smooth-scroll animation must be wrapped in `@media (prefers-reduced-motion: no-preference)`
- Every permalink icon must have an accessible name via `aria-label` or visually-hidden text

## 4. Contributor Requirements (The Guardrails) <a href="#4-contributor-requirements-the-guardrails" aria-label="Link to 4. Contributor Requirements (The Guardrails) section">#</a>

To contribute to this repo, you must follow these guidelines:

- **Dashboard Accessibility:** The `index.html` dashboard must remain keyboard-navigable and screen reader compatible
- **Anchor Links:** Follow [examples/ANCHOR_LINKS_ACCESSIBILITY_BEST_PRACTICES.md](./examples/ANCHOR_LINKS_ACCESSIBILITY_BEST_PRACTICES.md) for all in-page navigation
- **Visualisations:** All custom components (Spine View, Flow Diagram) must use semantic HTML and SVG-like accessibility patterns
- **Data Integrity:** `master_spine.json` changes must not break accessible rendering of WCAG success criteria. Data sources must be clearly attributed (Synced vs AI-summarized).
- **Inclusive Language:** Use person-centered, respectful language throughout
- **Color Contrast:** All UI elements must maintain WCAG 4.5:1 (text) and 3:1 (non-text) contrast ratios

## 6. Reporting & Severity Taxonomy <a href="#6-reporting--severity-taxonomy" aria-label="Link to 6. Reporting & Severity Taxonomy section">#</a>

Please use our [issue tracker](https://github.com/mgifford/wcag-spine/issues/new) when reporting issues. We prioritize based on:

- **Critical:** A dashboard feature prevents users from completing core tasks (e.g., cannot navigate to a WCAG SC, broken keyboard navigation)
- **High:** A significant accessibility barrier or misleading WCAG guidance
- **Medium:** Documentation clarity issues or incomplete examples
- **Low:** Minor improvements, typos, or enhancements

## 7. Dashboard Accessibility Features <a href="#7-dashboard-accessibility-features" aria-label="Link to 7. Dashboard Accessibility Features section">#</a>

The WCAG Spine dashboard (`index.html`) provides:

- **Keyboard navigation** — All interactive elements (filters, cards, spine nodes) are keyboard accessible
- **Screen reader support** — Semantic HTML, appropriate ARIA roles, and live regions for dynamic content
- **Three views** — Cards, Spine (HTML), and Table — each with accessible markup
- **Filter controls** — Labeled form controls for Level, Role, Automation, and Search
- **Deep-linking** — Direct URL access to any Success Criterion (e.g., `#2.4.11`)

## 8. Automated Check Coverage <a href="#8-automated-check-coverage" aria-label="Link to 8. Automated Check Coverage section">#</a>

Our CI pipeline validates:

- **Data sync** — `sync_accessibility.yml` runs daily to keep WCAG data current
- **Accessibility Gate** — Continuous audits via Playwright (Axe-core) and Lighthouse CI
- **Dashboard deployment** — GitHub Pages deployment after each sync

## 9. Local Audits (Development Workflow) <a href="#9-local-audits" aria-label="Link to 9. Local Audits section">#</a>

Contributors must run accessibility audits locally before pushing code:

```bash
# Install dependencies (first time only)
npm install

# Run all accessibility audits (Playwright + Lighthouse CI)
npm run test:a11y

# Run theme-specific tests in Light/Dark mode
npm run test:playwright
```

Success criteria for PRs:
- **0** accessibility violations via Axe-core
- **100%** accessibility score via Lighthouse CI


## 9. Browser & Assistive Technology Support <a href="#9-browser--assistive-technology-support" aria-label="Link to 9. Browser & Assistive Technology Support section">#</a>

### Browser Support <a href="#browser-support" aria-label="Link to Browser Support section">#</a>

This project supports the **last 2 major versions** of all major browser engines:
- **Chrome/Chromium** (including Edge, Brave)
- **Firefox**
- **Safari/WebKit** (macOS and iOS)

### Assistive Technology Testing <a href="#assistive-technology-testing" aria-label="Link to Assistive Technology Testing section">#</a>

Contributors are encouraged to test the dashboard with:

- **Screen readers:** JAWS, NVDA, VoiceOver, TalkBack
- **Keyboard navigation:** Tab, arrow keys, standard shortcuts
- **Magnification:** Browser zoom up to 200%, screen magnifiers
- **Voice control:** Dragon, Voice Control

## 10. Known Limitations <a href="#10-known-limitations" aria-label="Link to 10. Known Limitations section">#</a>

- **Spine view** — The spine graph is a visual representation; while keyboard accessible, complex views may be verbose for some users
- **Data Providence** — While many fields are live-synced from W3C and DHS, some mappings and Trusted Tester descriptions may be AI-summarized and require human verification.
- **Large data sets** — The full 78-SC view may be verbose for screen readers; use filters to narrow results
- **Dynamic content** — Filter results update the DOM dynamically; ARIA live regions are used but may vary across screen reader implementations

## 11. Getting Help <a href="#11-getting-help" aria-label="Link to 11. Getting Help section">#</a>

- **Questions:** Open a [discussion](https://github.com/mgifford/wcag-spine/discussions)
- **Bugs or gaps:** Open an [issue](https://github.com/mgifford/wcag-spine/issues)
- **Contributions:** See [README.md](./README.md)
- **Accommodations:** Request via issue with `accessibility-accommodation` label

## 12. Continuous Improvement <a href="#12-continuous-improvement" aria-label="Link to 12. Continuous Improvement section">#</a>

We regularly review and update:
- WCAG conformance as standards evolve (targeting 2.2 AA, monitoring 3.0)
- Visualisation components as accessibility patterns mature
- Tool recommendations and automation examples
- inclusive language and terminology

---

Last updated: 2026-04-12 (Local CI/CD Setup)
