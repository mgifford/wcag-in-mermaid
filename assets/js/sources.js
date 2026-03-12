/**
 * sources.js — Data Sources & Provenance page logic for WCAG Spine.
 *
 * Loads master_spine.json to populate:
 *  - Meta generation info (date, versions)
 *  - Live upstream source URLs from meta.sources
 *  - Known data corrections from meta.data_quality.known_corrections
 *  - An interconnection diagram (Mermaid) showing the data flow
 */

"use strict";

(async function initSources() {
  const loadingEl = document.getElementById("sources-loading");
  const contentEl = document.getElementById("sources-content");

  /** Safely set text content of an element by id. */
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || "—";
  }

  /** Escape HTML special characters. */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ---------------------------------------------------------------------------
  // Fetch spine data
  // ---------------------------------------------------------------------------
  let meta = {};
  try {
    const resp = await fetch("data/master_spine.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    meta = data.meta || {};
  } catch (err) {
    loadingEl.textContent = `Failed to load data: ${err.message}. Some sections may be unavailable.`;
    loadingEl.setAttribute("role", "alert");
    // Still show the static content
    if (contentEl) {
      loadingEl.hidden = true;
      contentEl.hidden = false;
    }
    return;
  }

  // ---------------------------------------------------------------------------
  // Populate meta info
  // ---------------------------------------------------------------------------
  setText("meta-generated", meta.generated);
  setText("meta-wcag", meta.wcag_version ? `WCAG ${meta.wcag_version}` : null);
  setText("meta-axe", meta.axe_version ? `axe-core ${meta.axe_version}` : null);
  setText("meta-alfa", meta.alfa_version ? `@siteimprove/alfa-rules ${meta.alfa_version}` : null);

  // ---------------------------------------------------------------------------
  // Render live upstream source URLs
  // ---------------------------------------------------------------------------
  const liveSourcesEl = document.getElementById("live-sources-content");
  if (liveSourcesEl && meta.sources) {
    const SOURCE_LABELS = {
      act_rules:             "ACT Rules — WCAG mapping (W3C GitHub)",
      arrm:                  "ARRM all tasks CSV (W3C WAI)",
      axe_core:              "Axe-core rule descriptions (Deque)",
      alfa:                  "Alfa rules README (Siteimprove)",
      trusted_tester:        "Trusted Tester v5 (Section508Coordinators)",
      section508_coordinators: "Section 508 Coordinators (GitHub org)",
      act_testcases:         "ACT testcases JSON (W3C)",
      alfa_rules_index:      "Alfa rules TypeScript index (Siteimprove)",
      axe_rules_api:         "Axe-core rules GitHub API",
      alfa_earl:             "Alfa EARL implementation report (alfa-act-r)",
      fpc_mapping:           "Section 508 FPC mapping (CivicActions)",
    };

    const rows = Object.entries(meta.sources).map(([key, url]) => {
      const label = SOURCE_LABELS[key] || key;
      return `<tr>
        <td><code>${escHtml(key)}</code></td>
        <td>${escHtml(label)}</td>
        <td class="source-url-cell"><a href="${escHtml(url)}" target="_blank" rel="noopener noreferrer">${escHtml(url)}</a></td>
      </tr>`;
    }).join("\n");

    liveSourcesEl.innerHTML = `
      <div class="table-wrapper" role="region" aria-label="Upstream source URLs" tabindex="0">
        <table class="sources-table">
          <caption>Upstream source URLs from the last data sync</caption>
          <thead>
            <tr>
              <th scope="col">Key</th>
              <th scope="col">Description</th>
              <th scope="col">URL</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  } else if (liveSourcesEl) {
    liveSourcesEl.innerHTML = "<p>Source URL data not available.</p>";
  }

  // ---------------------------------------------------------------------------
  // Render known corrections
  // ---------------------------------------------------------------------------
  const correctionsEl = document.getElementById("corrections-content");
  if (correctionsEl) {
    const corrections = meta.data_quality && meta.data_quality.known_corrections;
    if (corrections && corrections.length > 0) {
      const rows = corrections.map(c => `<tr>
        <td><a href="index.html#checklist/${escHtml(c.sc)}">${escHtml(c.sc)}</a></td>
        <td><code>${escHtml(c.field)}</code></td>
        <td>${escHtml(c.correction)}</td>
        <td>${escHtml(c.reported_by || "—")}</td>
        <td>${escHtml(c.date || "—")}</td>
      </tr>`).join("\n");

      correctionsEl.innerHTML = `
        <div class="table-wrapper" role="region" aria-label="Known data corrections" tabindex="0">
          <table class="sources-table">
            <caption>Known corrections applied to master_spine.json data</caption>
            <thead>
              <tr>
                <th scope="col">SC</th>
                <th scope="col">Field</th>
                <th scope="col">Correction</th>
                <th scope="col">Reported by</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    } else {
      correctionsEl.innerHTML = "<p>No corrections have been logged yet.</p>";
    }
  }

  // ---------------------------------------------------------------------------
  // Render Mermaid interconnection diagram
  // ---------------------------------------------------------------------------
  const diagramEl = document.getElementById("sources-diagram");
  if (diagramEl && window.mermaid) {
    const diagramDef = `%%accTitle Data flow from upstream sources to WCAG Spine dashboard
%%accDescr Upstream sources (W3C ACT Rules, Deque axe-core, Siteimprove Alfa, W3C ARRM, DHS Trusted Tester, CivicActions FPC, W3C WCAG 2.2) feed into sync_data.py which writes master_spine.json. app.js reads master_spine.json and powers the dashboard views.
graph LR
    subgraph Upstream["Upstream Sources"]
        ACT["W3C ACT Rules\\nwcag-mapping.json"]:::upstream
        AXE["Deque axe-core\\nlib/rules/"]:::upstream
        ALFA["Siteimprove Alfa\\nalfa-rules/src/index.ts"]:::upstream
        EARL["Alfa EARL Report\\nalfa-automated-report.json"]:::upstream
        ARRM["W3C ARRM\\narrm-all-tasks.csv"]:::upstream
        TT["DHS Trusted Tester v5"]:::ai
        FPC["CivicActions FPC\\nmapping-wcag-to-fpc.csv"]:::upstream
        WCAG["W3C WCAG 2.2\\nSpecification"]:::upstream
    end

    subgraph Sync["Daily Sync (GitHub Actions)"]
        PY["scripts/sync_data.py"]:::sync
    end

    subgraph Data["Data"]
        JSON["data/master_spine.json"]:::data
    end

    subgraph Dashboard["WCAG Spine Dashboard"]
        APP["assets/js/app.js"]:::app
        CARDS["Cards view"]:::view
        TABLE["Table view"]:::view
        DIAG["Diagram view"]:::view
        ACT_VIEW["ACT Rules view"]:::view
        COV["Coverage view"]:::view
        CHK["Checklist view"]:::view
    end

    ACT --> PY
    AXE --> PY
    ALFA --> PY
    EARL --> PY
    ARRM --> PY
    TT --> PY
    FPC --> PY
    WCAG --> PY

    PY --> JSON
    JSON --> APP

    APP --> CARDS
    APP --> TABLE
    APP --> DIAG
    APP --> ACT_VIEW
    APP --> COV
    APP --> CHK

    classDef upstream fill:#0d47a1,stroke:#0d47a1,color:#fff
    classDef ai fill:#e65100,stroke:#e65100,color:#fff
    classDef sync fill:#1b5e20,stroke:#1b5e20,color:#fff
    classDef data fill:#4a148c,stroke:#4a148c,color:#fff
    classDef app fill:#2e7d32,stroke:#2e7d32,color:#fff
    classDef view fill:#37474f,stroke:#37474f,color:#fff`;

    try {
      const id = "sources-interconnect-diagram";
      const { svg } = await window.mermaid.render(id, diagramDef);
      diagramEl.innerHTML = svg;

      // Apply accessible SVG attributes
      const svgEl = diagramEl.querySelector("svg");
      if (svgEl) {
        svgEl.setAttribute("role", "img");
        svgEl.setAttribute("aria-labelledby", "interconnect-diagram-title interconnect-diagram-desc");
      }
    } catch (err) {
      diagramEl.innerHTML = `<p class="diagram-error">Diagram could not be rendered: ${escHtml(err.message)}</p>`;
    }
  }

  // ---------------------------------------------------------------------------
  // Show content, hide loading
  // ---------------------------------------------------------------------------
  if (loadingEl) loadingEl.hidden = true;
  if (contentEl) contentEl.hidden = false;
})();
