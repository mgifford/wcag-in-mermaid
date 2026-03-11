# Issue #1 Gap Analysis

> Items requested in [Issue #1 ("Initial idea")](https://github.com/mgifford/wcag-spine/issues/1)
> that have **not yet been implemented** in this project — provided for your review.
>
> Each item includes a current-state summary, the original request, and notes to help
> you decide whether and how to bring it in.

---

## Contents

1. [ARRM Category CSV Files Not Found Upstream](#1-arrm-category-csv-files-not-found-upstream)
2. [ARRM Data Gaps for New WCAG 2.2 SCs](#2-arrm-data-gaps-for-new-wcag-22-scs)
3. [Ownership Level (Primary / Secondary / Contributor) Not Surfaced](#3-ownership-level-primary--secondary--contributor-not-surfaced)
4. [Separate Per-Engine Mermaid Nodes in the Diagram View](#4-separate-per-engine-mermaid-nodes-in-the-diagram-view)
5. [Hyperlinks Inside Mermaid Node Labels](#5-hyperlinks-inside-mermaid-node-labels)
6. [Original ACT Rules JSON Endpoint Is Gone](#6-original-act-rules-json-endpoint-is-gone)

---

## 1. ARRM Category CSV Files Not Found Upstream

**Issue requested:**

> Key Files to Monitor:
> `arrm-all-tasks.csv`, `arrm-wcag-sc.csv`, **`forms.csv`, `images.csv`, `semantic.csv`, `navigation.csv`**
> — https://github.com/w3c/wai-arrm/tree/draft/_data/arrm

**Current state:**

The W3C ARRM repository's `_data/arrm/` directory (draft branch) contains **only two files**:

- `arrm-all-tasks.csv` — fetched and fully parsed ✅
- `arrm-wcag-sc.csv` — fetched and fully parsed ✅

The four category-specific files (`forms.csv`, `images.csv`, `semantic.csv`, `navigation.csv`)
**do not exist** in that repository. They were either planned for future addition, or were
anticipated files that have not yet been published by W3C.

**What is already available:**

The data these files would represent is _partially_ present in `arrm-all-tasks.csv`:
tasks carry category-prefix IDs such as `FRM-001` (forms), `IMG-004` (images),
`SEM-012` (semantic structure), `NAV-002` (navigation). The current sync script
already maps these prefixes to their ARRM task-category section URLs.

**Recommended action:**

Monitor the W3C ARRM draft branch for future publication of these files. If they appear,
`sync_data.py` could be extended to fetch them in addition to `arrm-all-tasks.csv`.
No action is required today — the equivalent category data is already ingested via the
all-tasks file.

---

## 2. ARRM Data Gaps for New WCAG 2.2 SCs

**Issue requested:**

A complete "Verification Trio" for **every** SC — including all new WCAG 2.2 additions.

**Current state:**

`arrm-wcag-sc.csv` covers only WCAG 2.0 / 2.1 Success Criteria (78 rows, ending at 4.1.3).
The **9 new WCAG 2.2 SCs** are absent from the upstream ARRM data:

| SC | Title | Level |
|----|-------|-------|
| 2.4.11 | Focus Not Obscured (Minimum) | AA |
| 2.4.12 | Focus Not Obscured (Enhanced) | AAA |
| 2.4.13 | Focus Appearance | AAA |
| 2.5.7 | Dragging Movements | AA |
| 2.5.8 | Target Size (Minimum) | AA |
| 3.2.6 | Consistent Help | A |
| 3.3.7 | Redundant Entry | A |
| 3.3.8 | Accessible Authentication (Minimum) | AA |
| 3.3.9 | Accessible Authentication (Enhanced) | AAA |

The `master_spine.json` seed data for these SCs contains role and task data that was
hand-populated at project creation, but it is not sourced from the W3C ARRM CSV.

**Recommended action (options):**

**Option A — Wait for W3C.** The W3C ARRM group is actively adding WCAG 2.2 coverage.
Once published, the sync script will pick them up automatically.

**Option B — Maintain a local supplement.** Add a `data/arrm_supplement_wcag22.json`
file with hand-curated role and task data for the 9 missing SCs. The sync script could
merge this supplement at build time, clearly marking supplemented entries so users know
they are not from the upstream W3C source.

---

## 3. Ownership Level (Primary / Secondary / Contributor) Not Surfaced

**Issue requested:**

Use the ARRM role data to show which role is **primarily responsible** vs. supporting.

**Current state:**

`arrm-wcag-sc.csv` encodes ownership levels as `P` (Primary), `S` (Secondary), and
`C` (Contributor) for each role column. For example, SC 1.1.1 shows:

```
Business=C, Content Authoring="P, S, C", Visual Design="P, S, C", UX Design="P, S, C", Front-End="P, C"
```

The current sync script reads role names but **discards** the P/S/C level codes.
`master_spine.json` stores only a flat list of role names in `manual.roles`.

ARRM task entries from `arrm-all-tasks.csv` do preserve a `primary_ownership` and
`secondary_ownership` field per task — these are stored and displayed in the Cards
and Table views. However, the SC-level role list in `manual.roles` does not indicate
which roles are primary vs. secondary.

**Impact on users:**

A UX designer reviewing SC 1.4.3 (Contrast Minimum) would see their role listed
without knowing they are only a Secondary owner, while Visual Design is Primary.
The Role filter operates on all roles equally with no ownership-level weighting.

**Recommended action:**

Extend the `manual.roles` schema to store structured role entries, for example:

```json
"roles": [
  { "name": "Visual Design",   "level": "P" },
  { "name": "Content Authoring", "level": "S" }
]
```

This would require updates to both `sync_data.py` (parsing P/S/C from the CSV) and
`app.js` (rendering and filtering logic). The Cards and Table views could then display
role ownership levels visually (e.g., a "Primary" badge). The Role filter could
optionally filter to Primary owners only.

---

## 4. Separate Per-Engine Mermaid Nodes in the Diagram View

**Issue requested** (from the second issue comment):

```mermaid
subgraph Row_2_4_11 ["SC 2.4.11: Focus Not Obscured"]
    direction LR
    ACT_2411["ACT: 04639e"]:::act
    AXE_2411["Axe: focus-not-obscured"]:::axe
    ALFA_2411["Alfa: SIA-R109"]:::alfa
    TT_2411["👤 UX, Front-End / TT: 24.11.A, 24.11.B"]:::tt
    ACT_2411 & AXE_2411 & ALFA_2411 --- SC_2_4_11
    SC_2_4_11 --- TT_2411
end
```

With distinct colors per engine:
- Axe: `fill:#e3f2fd,stroke:#1565c0` (blue)
- ACT: `fill:#f3e5f5,stroke:#7b1fa2` (purple)
- Alfa: `fill:#e8f5e9,stroke:#2e7d32` (green)
- TT: `fill:#fff3e0,stroke:#e65100` (orange)

**Current state:**

The diagram view uses a **single merged `auto` node** for all three automation engines
combined (ACT + axe-core + Alfa), plus a `manual` node for roles, an `arrm` node for
task IDs, and a `tt` node for Trusted Tester steps.

This is a deliberate simplification to keep the diagram readable (a SC with 7 ACT rules,
5 axe rules, and 3 Alfa rules would produce 15+ separate nodes per SC in the issue's model).

**Tradeoffs:**

| Approach | Pro | Con |
|----------|-----|-----|
| **Current (merged)** | Compact, readable at 20 SCs; contrast ratios already validated | Less granular — can't see which engine covers what at a glance |
| **Proposed (per-engine)** | Clear visual breakdown; matches the issue's intended "vertebra" | Produces 4–6 nodes per SC; diagram becomes unwieldy with many SCs filtered in; requires performance re-tuning |

**Recommended action:**

Consider adding a **diagram density toggle**: a "Detailed" mode renders per-engine nodes
(matching the issue's design), while "Compact" mode keeps the current merged layout.
The diagram cap of 20 SCs would remain in both modes.

---

## 5. Hyperlinks Inside Mermaid Node Labels

**Issue requested** (from the second issue comment):

```
ACT_2411["<a href='https://www.w3.org/WAI/standards-guidelines/act/rules/04639e/'>ACT: 04639e</a>"]:::act
```

Individual rule IDs as clickable `<a>` links within the Mermaid node label text.

**Current state:**

The Mermaid diagram uses the `click <nodeId> href "url" _blank` directive, which makes
the **entire node** clickable (linking to the WCAG Understanding page for the SC).
Individual rule IDs within the combined auto node are not separately clickable.

**Technical constraint:**

Embedding raw `<a href>` HTML in Mermaid node labels requires setting Mermaid's
`securityLevel` to `'loose'`. The [Mermaid documentation explicitly warns](https://mermaid.js.org/config/usage.html#securitylevel)
that `'loose'` mode trusts the diagram source and introduces an **XSS risk** if
diagrams include user-controlled content. Since WCAG Spine generates diagrams from
its own data (not user input), the practical risk is low — but it is a deliberate
security trade-off that should be made consciously.

**Recommended action:**

If per-rule links in the diagram are a priority, consider these alternatives:

1. **Accept `securityLevel: 'loose'`** — document the decision. Rule IDs are
   generated from `master_spine.json` (W3C/Deque/Siteimprove data), so the XSS
   surface is limited to the sync pipeline output.

2. **Keep the Cards view as the "clickable rules" view** — the Cards view already
   renders every ACT, axe, and Alfa rule as a labelled hyperlink. The Diagram view
   can remain a structural overview with whole-node click navigation.

3. **Render an SVG overlay** — instead of Mermaid-native links, post-process the
   Mermaid SVG output with JavaScript to inject `<a>` wrappers around rule-ID text
   nodes. This avoids the `securityLevel` change but adds post-render complexity.

---

## 6. Original ACT Rules JSON Endpoint Is Gone

**Issue requested:**

> ACT Rules JSON Data: `https://www.w3.org/WAI/standards-guidelines/act/rules/data/rules.json`

**Current state:**

This URL is **no longer available**. The project already addresses this:

```python
# Machine-readable WCAG-to-ACT mapping published by W3C in the wcag-act-rules GitHub repo.
# This replaced the former rules.json endpoint at
#   https://www.w3.org/WAI/standards-guidelines/act/rules/data/rules.json
# which is no longer available.
ACT_RULES_URL = "https://raw.githubusercontent.com/w3c/wcag-act-rules/main/wcag-mapping.json"
```

The replacement URL (`wcag-mapping.json`) covers all active ACT rules and is used
as the primary ACT data source. The code comment documents the change.

**Status: Already resolved.** No action required. Included here for completeness.

---

## Summary Table

| # | Item | Status | Effort to implement |
|---|------|--------|---------------------|
| 1 | ARRM category CSVs (`forms.csv` etc.) | ⚠️ Upstream files don't exist yet | Low (monitor; extend sync when available) |
| 2 | ARRM data for 9 new WCAG 2.2 SCs | ⚠️ Gap in upstream data | Medium (wait for W3C, or add local supplement) |
| 3 | P/S/C ownership levels from ARRM | 🔵 Not surfaced | Medium (schema + UI changes) |
| 4 | Per-engine Mermaid nodes with distinct colors | 🔵 Simplified to merged node | Medium–High (diagram complexity, density toggle) |
| 5 | Clickable `<a>` links inside Mermaid node labels | 🔵 Requires `securityLevel: 'loose'` | Low–Medium (security decision + implementation) |
| 6 | Original ACT rules JSON URL | ✅ Already resolved | None — done |

---

*Generated from review of [Issue #1](https://github.com/mgifford/wcag-spine/issues/1) against the current
codebase. Last reviewed: 2026-03-10.*
