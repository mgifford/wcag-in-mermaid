# Testing Methods & Resources

> A companion guide to the [WCAG Mirror Spine dashboard](https://mgifford.github.io/wcag-in-mermaid)
> explaining how WCAG 2.2 Success Criteria are tested — both automatically and manually —
> and where the gaps lie.

---

## Contents

1. [Overview](#overview)
2. [Automated Testing](#automated-testing)
   - [What automation can detect](#what-automation-can-detect)
   - [What automation cannot detect](#what-automation-cannot-detect)
   - [Rule engines tracked in this project](#rule-engines-tracked-in-this-project)
3. [Manual Testing](#manual-testing)
   - [ARRM — roles and responsibilities](#arrm--roles-and-responsibilities)
   - [DHS Trusted Tester v5](#dhs-trusted-tester-v5)
4. [Coverage Landscape](#coverage-landscape)
   - [Overall statistics](#overall-statistics)
   - [Partially-covered Success Criteria](#partially-covered-success-criteria)
   - [Success Criteria with no automated rules](#success-criteria-with-no-automated-rules)
5. [Reading the Dashboard](#reading-the-dashboard)
6. [All Resources](#all-resources)

---

## Overview

Accessibility testing combines two complementary approaches:

| Approach | Strength | Limitation |
|----------|----------|------------|
| **Automated** | Fast, consistent, repeatable — catches concrete technical violations | Covers an estimated [30–57% of all accessibility issues](#all-resources) |
| **Manual** | Catches subjective, contextual, and experiential issues | Requires skilled testers and more time |

Neither approach alone is sufficient. A complete accessibility audit always uses both.

This project tracks data from automated rule engines (ACT Rules, axe-core, Alfa) and manual
testing frameworks (W3C ARRM, DHS Trusted Tester v5) for all 86 WCAG 2.2 Success Criteria.

---

## Automated Testing

### What automation can detect

Automated tools run programmatically against rendered HTML and reliably detect
concrete, deterministic violations such as:

- **Missing text alternatives** — `<img>` elements without `alt` attributes, or empty `alt` on
  informative images
- **Colour contrast failures** — foreground/background pairs that fall below the 4.5:1 (Level AA)
  or 3:1 (large text) ratio
- **Missing form labels** — `<input>` elements not associated with a visible `<label>` or
  `aria-label` / `aria-labelledby`
- **Absent page landmarks** — pages lacking `<main>`, `<nav>`, or `<header>` landmark regions
- **Invalid ARIA usage** — roles applied to inappropriate elements, or required owned elements
  missing from composite widgets
- **Missing page `<title>`** — documents with empty or absent `<title>` elements
- **Keyboard reachability** — interactive elements with `tabindex="-1"` or removed from the
  focus order without justification
- **Language attribute** — `<html lang>` missing or set to an invalid BCP 47 language tag

### What automation cannot detect

Automation **cannot** reliably determine whether:

- Alternative text is **accurate and meaningful** (it can only check that it exists and is non-empty)
- Reading order makes **logical sense** for users navigating linearly with a screen reader
- A user interface can be **operated in multiple ways** (e.g. SC 2.5.1 Pointer Gestures)
- Error messages are **helpful and clearly identify** the field in error (SC 3.3.1)
- Time limits are **appropriate** for the complexity of the user task (SC 2.2.1)
- Content relying on **colour alone** actually conveys meaning to a colour-blind user
- **Cognitive load** or language complexity is appropriate for the intended audience (SC 3.1.5)
- A live video stream includes **accurate captions** (SC 1.2.4)

These are the gaps that manual testing must fill.

### Rule engines tracked in this project

| Engine | Maintained by | Open source | ACT-aligned |
|--------|--------------|-------------|-------------|
| [ACT Rules](https://www.w3.org/WAI/standards-guidelines/act/rules/) | W3C WAI | ✔ | Vendor-neutral standard |
| [axe-core](https://github.com/dequelabs/axe-core) | Deque Systems | ✔ | Partial |
| [Alfa](https://github.com/siteimprove/alfa) | Siteimprove | ✔ | Strong ACT focus |
| [Equal Access](https://www.ibm.com/able/toolkit/tools/) | IBM | ✔ | Partial |
| [QualWeb](https://qualweb.di.fc.ul.pt/) | Univ. of Lisbon | ✔ | Strong ACT focus |

> **What are ACT Rules?**
> [Accessibility Conformance Testing (ACT) Rules](https://www.w3.org/WAI/standards-guidelines/act/)
> are a W3C standard format for writing automated test rules. Unlike proprietary rules,
> ACT Rules are vendor-neutral and designed to produce consistent results across tools.
> When multiple engines implement the same ACT rule, you can compare their results directly.

---

## Manual Testing

### ARRM — roles and responsibilities

The [W3C Accessibility Roles and Responsibilities Mapping (ARRM)](https://www.w3.org/WAI/planning/arrm/)
maps each WCAG Success Criterion to the roles responsible for testing and implementing it:

| Role | Examples of WCAG responsibilities |
|------|-----------------------------------|
| **Content Authoring** | Meaningful link text, clear headings, alt text accuracy |
| **UX Design** | Keyboard navigation flows, error prevention, timing |
| **Visual Design** | Colour contrast, non-colour cues, focus indicator visibility |
| **Front-End Development** | Semantic HTML, ARIA usage, keyboard event handling |

For each SC, ARRM defines specific **tasks** with **primary** and **secondary** ownership.
This project surfaces the ARRM task IDs on every SC card and in the Table view.

### DHS Trusted Tester v5

The [Department of Homeland Security Trusted Tester v5](https://section508.gov/test/trusted-tester/)
is a repeatable, prescriptive test process used by US federal agencies to evaluate Section 508
(WCAG 2.x) conformance. Each test procedure specifies:

- Which assistive technology to use (JAWS, keyboard-only, etc.)
- Exact steps to follow
- What a pass and fail look like

Trusted Tester step IDs are linked on every SC card and in the dashboard's Table view.

---

## Coverage Landscape

### Overall statistics

Based on the current `master_spine.json` data (86 WCAG 2.2 SCs):

| Coverage tier | Count | % of SCs | Description |
|--------------|-------|----------|-------------|
| **Full** | 17 | ~20% | ACT Rules, axe-core, and Alfa all have ≥1 rule mapped |
| **Partial** | 7 | ~8% | At least one engine has rules, but not all three |
| **None** | 62 | ~72% | No automated rules mapped — entirely manual |

> **Important:** "Full coverage" does not mean 100% of the SC is automatically testable.
> It means all three tracked engines have *some* coverage. A SC like 1.1.1 (Non-text Content)
> has 7 ACT rules, 7 axe-core rules, and 5 Alfa rules — yet those rules only cover specific
> *types* of non-text content. Human judgement is still needed to evaluate whether alternative
> text is *meaningful*.

### Partially-covered Success Criteria

These SCs have rules in at least one engine but gaps in others:

| SC | Title | Level | Gap |
|----|-------|-------|-----|
| 1.2.2 | Captions (Prerecorded) | A | Alfa has no rule |
| 1.4.4 | Resize Text | AA | ACT and Alfa have no rules |
| 1.4.6 | Contrast (Enhanced) | AAA | ACT and Alfa have no rules |
| 1.4.12 | Text Spacing | AA | axe-core has no rule |
| 2.5.7 | Dragging Movements | AA | ACT and Alfa have no rules |
| 3.2.6 | Consistent Help | A | axe-core and Alfa have no rules |
| 3.3.7 | Redundant Entry | A | ACT and Alfa have no rules |

These gaps often reflect:
- The SC requiring contextual human judgement that rules can't encode
- Rules being in development or not yet ACT-standardised
- Differences in which WCAG version the engine targets

### Success Criteria with no automated rules

The majority of WCAG 2.2 SCs (62 of 86, ~72%) have zero automated rules across all three
engines. This is especially common for:

- **AAA-level SCs** — stricter, more subjective requirements (e.g. 1.4.6 Contrast Enhanced,
  2.2.3 No Timing, 2.4.9 Link Purpose — Link Only)
- **Media SCs** — audio description, captions for live content, sign language (1.2.x series)
- **Cognitive and comprehension SCs** — reading level, pronunciation, unusual words (3.1.x)
- **New WCAG 2.2 SCs** — some newer criteria lack mature rule implementations

For these SCs, expert manual testing is the **only** way to evaluate conformance.

---

## Reading the Dashboard

The [WCAG Mirror Spine dashboard](https://mgifford.github.io/wcag-in-mermaid) provides five views:

| View | Best for |
|------|---------|
| **Cards** | Exploring the full detail of individual SCs |
| **Diagram** | Visualising SC → rule → role relationships |
| **Table** | Auditing or comparing many SCs at once |
| **ACT Rules** | Evaluating tool coverage by ACT rule ID |
| **Coverage** | Understanding automation gaps and planning a test strategy |

### Coverage bar interpretation

Each SC card shows a coverage bar labelled `N/3`. This counts how many of the three
tracked engines (ACT Rules, axe-core, Alfa) have at least one rule for that SC:

- `3/3` — All three engines covered (still requires manual testing)
- `1/3` or `2/3` — Partial automation; targeted manual review recommended
- `0/3` — No automation; entirely manual

### Filtering by automation

Use the **Automation** filter to focus on a specific tier:

- **Any Coverage** — Show all SCs (default)
- **0% — No automated rules** — Highlight SCs requiring manual testing
- **Partial — Some automated rules** — Find SCs where tools partially help
- **Full — All 3 engines covered** — Show best-automated SCs

---

## All Resources

### Specifications and standards

- [WCAG 2.2 Specification](https://www.w3.org/TR/WCAG22/) — W3C Recommendation
- [WCAG 2.2 Understanding Documents](https://www.w3.org/WAI/WCAG22/Understanding/) — intent, techniques, failure examples
- [WCAG 2.2 Techniques](https://www.w3.org/WAI/WCAG22/Techniques/) — sufficient and advisory techniques
- [ACT Rules Framework](https://www.w3.org/WAI/standards-guidelines/act/) — how to write interoperable test rules
- [ACT Rules Registry](https://www.w3.org/WAI/standards-guidelines/act/rules/) — all published ACT rules

### Automated testing tools

- [axe-core](https://github.com/dequelabs/axe-core) — Deque's open-source engine; integrates with browsers, CI/CD, and dev tools
- [Alfa](https://github.com/siteimprove/alfa) — Siteimprove's open-source engine with strong ACT alignment
- [IBM Equal Access Checker](https://www.ibm.com/able/toolkit/tools/) — free browser extension and CI tool
- [QualWeb](https://qualweb.di.fc.ul.pt/) — University of Lisbon evaluator implementing ACT rules
- [ACT Implementations Registry](https://www.w3.org/WAI/standards-guidelines/act/implementations/) — which tools implement which ACT rules
- [Deque's study: Automated testing covers ~57% of issues](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/)

### Manual testing frameworks

- [W3C ARRM](https://www.w3.org/WAI/planning/arrm/) — roles and tasks for each WCAG SC
- [DHS Trusted Tester v5](https://section508.gov/test/trusted-tester/) — federal step-by-step test procedures
- [Trusted Tester online reference](https://section508coordinators.github.io/TrustedTester/index.html) — full test procedure library
- [Easy Checks — A First Review](https://www.w3.org/WAI/test-evaluate/preliminary/) — W3C quick manual checks
- [WCAG-EM](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/) — Website Accessibility Conformance Evaluation Methodology
- [Section 508 ICT Testing Baseline](https://ictbaseline.access-board.gov/) — US federal testing baseline

### Data sources used by this project

| Source | URL |
|--------|-----|
| W3C ARRM (roles & tasks) | https://github.com/w3c/wai-arrm/tree/draft/_data/arrm |
| ACT Rules Registry | https://www.w3.org/WAI/standards-guidelines/act/rules/data/rules.json |
| axe-core rules | https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md |
| Alfa rules | https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md |
| DHS Trusted Tester | https://section508.gov/test/trusted-tester/ |
| Section 508 Coordinators | https://github.com/Section508Coordinators |

---

*This document is part of the [WCAG Mirror Spine](https://github.com/mgifford/wcag-in-mermaid) project.
Data is updated daily via the `sync_accessibility.yml` workflow.*
