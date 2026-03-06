/**
 * WCAG Mirror Spine — Dashboard Application
 *
 * Loads master_spine.json, renders the data in three views:
 *  1. Diagram  – Mermaid.js "vertebra" graph
 *  2. Cards    – responsive card grid
 *  3. Table    – sortable data table
 *
 * Features:
 *  • Filter by Level (A / AA / AAA)
 *  • Filter by Role  (ARRM roles)
 *  • Filter by Automation coverage (any / full / partial / none)
 *  • Live search
 *  • URL hash routing  (#2.4.11 scrolls to / highlights that SC)
 */

/* ------------------------------------------------------------------ */
/*  Constants & state                                                   */
/* ------------------------------------------------------------------ */

const DATA_URL = "data/master_spine.json";

/**
 * Maximum number of ARRM task IDs to show inline in a single Mermaid diagram
 * node before appending "+N more".  Must match _ARRM_IDS_IN_NODE in sync_data.py.
 */
const ARRM_IDS_IN_NODE = 5;

/**
 * Maximum number of Trusted Tester step IDs to show inline in a single Mermaid
 * diagram node.  Must match _TT_IDS_IN_NODE in sync_data.py.
 */
const TT_IDS_IN_NODE = 4;

/**
 * Maps ARRM role / ownership names to their W3C WAI role pages.
 * Used to render linked role names in the Cards and Table views.
 *
 * Both short ("UX Design") and full ("User Experience (UX) Design") variants
 * are included because arrm-wcag-sc.csv uses the short form while
 * arrm-all-tasks.csv uses the full form.
 */
const ARRM_ROLE_URLS = {
  "Content Authoring":           "https://www.w3.org/WAI/planning/arrm/content-author/",
  "Front-End Development":       "https://www.w3.org/WAI/planning/arrm/front-end/",
  "UX Design":                   "https://www.w3.org/WAI/planning/arrm/user-experience/",
  "User Experience (UX) Design": "https://www.w3.org/WAI/planning/arrm/user-experience/",
  "Visual Design":               "https://www.w3.org/WAI/planning/arrm/visual-designer/",
};

/** @type {{ meta: object, success_criteria: Record<string, SCEntry> } | null} */
let spineData = null;

/** @type {Record<string, SCEntry>} currently visible subset */
let filteredSC = {};

let currentView = "cards"; // "cards" | "diagram" | "table"

/* ------------------------------------------------------------------ */
/*  Startup                                                             */
/* ------------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", async () => {
  showLoading(true);
  try {
    spineData = await fetchSpine();
    populateRoleFilter(spineData.success_criteria);
    bindControls();
    showLoading(false);
    switchView("cards");   // sets aria-selected and shows correct panel
    applyFilters();
    handleHashNavigation();
  } catch (err) {
    showError(err.message);
  }
  // showLoading(false) was already called on success path above;
});

window.addEventListener("hashchange", () => handleHashNavigation());

/* ------------------------------------------------------------------ */
/*  Data fetching                                                       */
/* ------------------------------------------------------------------ */

async function fetchSpine() {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`Failed to load data: ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Return the Deque University URL for an axe-core rule.
 *
 * Uses the ``axe_version`` stored in ``meta`` (e.g. ``"4.10"``) so links
 * point at the correct versioned documentation page.  Falls back to ``"4.11"``
 * when the version is unavailable.
 *
 * Must only be called after ``spineData`` has been populated (i.e. after the
 * initial data fetch completes).  The optional-chaining fallback ensures a
 * working URL is still returned if called earlier.
 *
 * @param {string} ruleId  The axe rule identifier, e.g. ``"image-alt"``.
 * @returns {string}
 */
function axeRuleUrl(ruleId) {
  const version = spineData?.meta?.axe_version ?? "4.11";
  return `https://dequeuniversity.com/rules/axe/${encodeURIComponent(version)}/${encodeURIComponent(ruleId)}`;
}

/* ------------------------------------------------------------------ */
/*  Controls & filtering                                                */
/* ------------------------------------------------------------------ */

function bindControls() {
  document.getElementById("filter-level").addEventListener("change", applyFilters);
  document.getElementById("filter-role").addEventListener("change", applyFilters);
  document.getElementById("filter-automation").addEventListener("change", applyFilters);
  document.getElementById("search-input").addEventListener("input", applyFilters);

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });
}

function populateRoleFilter(scMap) {
  const roles = new Set();
  Object.values(scMap).forEach(sc => {
    (sc.manual?.roles ?? []).forEach(r => roles.add(r));
  });
  const sel = document.getElementById("filter-role");
  [...roles].sort().forEach(role => {
    const opt = document.createElement("option");
    opt.value = role;
    opt.textContent = role;
    sel.appendChild(opt);
  });
}

function applyFilters() {
  const level = document.getElementById("filter-level").value;
  const role = document.getElementById("filter-role").value;
  const automation = document.getElementById("filter-automation").value;
  const query = document.getElementById("search-input").value.trim().toLowerCase();

  filteredSC = {};
  const scMap = spineData.success_criteria;

  for (const [num, entry] of Object.entries(scMap)) {
    if (level && entry.level !== level) continue;
    if (role && !(entry.manual?.roles ?? []).includes(role)) continue;
    if (automation) {
      const count = automationCount(entry);
      if (automation === "none"    && count !== 0) continue;
      if (automation === "partial" && count === 0) continue;
      if (automation === "full"    && count < 3)   continue;
    }
    if (query) {
      const arrmTaskText = (entry.manual?.arrm_tasks ?? [])
        .map(t => `${t.id} ${t.task}`).join(" ");
      const ttStepText = (entry.manual?.tt_steps ?? []).join(" ");
      const haystack = `${num} ${entry.title} ${(entry.manual?.roles ?? []).join(" ")} ${arrmTaskText} ${ttStepText}`.toLowerCase();
      if (!haystack.includes(query)) continue;
    }
    filteredSC[num] = entry;
  }

  updateSummaryBar();
  renderCurrentView();
}

function automationCount(entry) {
  const a = entry.automation ?? {};
  let count = 0;
  if ((a.act  ?? []).length) count++;
  if ((a.axe  ?? []).length) count++;
  if ((a.alfa ?? []).length) count++;
  return count;
}

function updateSummaryBar() {
  const total = Object.keys(spineData.success_criteria).length;
  const shown = Object.keys(filteredSC).length;
  document.getElementById("summary-bar").textContent =
    `Showing ${shown} of ${total} Success Criteria`;
}

/* ------------------------------------------------------------------ */
/*  View switching                                                      */
/* ------------------------------------------------------------------ */

function switchView(view) {
  currentView = view;
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.setAttribute("aria-selected", String(b.dataset.view === view));
  });
  document.getElementById("diagram-view").hidden = view !== "diagram";
  document.getElementById("cards-view").hidden   = view !== "cards";
  document.getElementById("table-view").hidden   = view !== "table";
  document.getElementById("act-view").hidden     = view !== "act";
  renderCurrentView();
}

function renderCurrentView() {
  if (currentView === "diagram") renderDiagram();
  else if (currentView === "cards") renderCards();
  else if (currentView === "act") renderActRules();
  else renderTable();
}

/* ------------------------------------------------------------------ */
/*  Cards view                                                          */
/* ------------------------------------------------------------------ */

function renderCards() {
  const container = document.getElementById("cards-view");
  container.innerHTML = "";

  const entries = Object.entries(filteredSC);
  if (entries.length === 0) {
    container.innerHTML = emptyStateHTML("No Success Criteria match your filters.");
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const [num, entry] of entries) {
    fragment.appendChild(buildCard(num, entry));
  }
  container.appendChild(fragment);
}

function buildCard(num, entry) {
  const card = document.createElement("article");
  card.className = "sc-card";
  card.id = `sc-${num.replace(/\./g, "_")}`;
  card.dataset.sc = num;

  const a = entry.automation ?? {};
  const m = entry.manual ?? {};
  const actIds    = a.act        ?? [];
  const axeIds    = a.axe        ?? [];
  const alfaIds   = a.alfa       ?? [];
  const roles     = m.roles      ?? [];
  const steps     = m.tt_steps   ?? [];
  const arrmTasks = m.arrm_tasks ?? [];

  const wcagUrl = entry.url ?? `https://www.w3.org/WAI/WCAG22/Understanding/`;

  // Build role list items, linking to the ARRM role page when available.
  const roleItems = roles.map(r => {
    const url = ARRM_ROLE_URLS[r];
    return url
      ? `<li><a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(r)}</a></li>`
      : `<li>${escapeHTML(r)}</li>`;
  }).join("");

  // Build ARRM task list items.
  // Each task ID links to the task-category section; a secondary link goes to
  // the primary ownership role page.
  const arrmTaskItems = arrmTasks.map(t => {
    const idLink = `<a class="arrm-task-id" href="${escapeAttr(t.category_url)}" target="_blank" rel="noopener noreferrer" title="View ${escapeAttr(t.id)} in ARRM task list">${escapeHTML(t.id)}</a>`;
    const roleLink = t.role_url
      ? `<a class="arrm-task-role" href="${escapeAttr(t.role_url)}" target="_blank" rel="noopener noreferrer" title="View ${escapeAttr(t.primary_ownership)} responsibilities">${escapeHTML(t.primary_ownership)}</a>`
      : `<span class="arrm-task-role">${escapeHTML(t.primary_ownership)}</span>`;
    return `<li class="arrm-task-item">
      <span class="arrm-task-header">${idLink} — ${roleLink}</span>
      <span class="arrm-task-desc">${escapeHTML(t.task)}</span>
    </li>`;
  }).join("");

  card.innerHTML = `
    <header class="sc-card-header">
      <span class="sc-number" aria-label="Success Criterion ${num}">${num}</span>
      <span class="sc-title">
        <a href="${escapeAttr(wcagUrl)}" target="_blank" rel="noopener noreferrer">
          ${escapeHTML(entry.title)}
        </a>
      </span>
      <span class="level-badge level-${escapeHTML(entry.level)}" aria-label="Level ${escapeHTML(entry.level)}">
        ${escapeHTML(entry.level)}
      </span>
    </header>
    <div class="sc-card-body">
      <div class="sc-col col-auto">
        <div class="col-header">🤖 Automated Rules</div>
        ${actIds.length + axeIds.length + alfaIds.length === 0
          ? `<p class="no-data">No automated rules mapped</p>`
          : `
            <ul class="tag-list" aria-label="Automated rule IDs">
              ${actIds.map(id =>
                `<li><a class="tag tag-act" href="https://www.w3.org/WAI/standards-guidelines/act/rules/${encodeURIComponent(id)}/" target="_blank" rel="noopener noreferrer" title="ACT Rule ${escapeHTML(id)}">ACT:${escapeHTML(id)}</a></li>`
              ).join("")}
              ${axeIds.map(id =>
                `<li><a class="tag tag-axe" href="${axeRuleUrl(id)}" target="_blank" rel="noopener noreferrer" title="Axe rule ${escapeHTML(id)}">axe:${escapeHTML(id)}</a></li>`
              ).join("")}
              ${alfaIds.map(id =>
                `<li><span class="tag tag-alfa" title="Alfa rule ${escapeHTML(id)}">${escapeHTML(id)}</span></li>`
              ).join("")}
            </ul>
            <div class="coverage-bar" aria-label="Automation coverage: ${automationCount(entry)} of 3 rule engines">
              <div class="coverage-track">
                <div class="coverage-fill" style="width:${Math.round(automationCount(entry) / 3 * 100)}%"></div>
              </div>
              <span>${automationCount(entry)}/3</span>
            </div>
          `
        }
      </div>
      <div class="sc-col col-manual">
        <div class="col-header">👤 Roles &amp; Testing</div>
        ${roles.length === 0
          ? `<p class="no-data">No roles mapped</p>`
          : `<ul class="role-list" aria-label="Responsible roles">
              ${roleItems}
             </ul>`
        }
        ${steps.length > 0
          ? `<div class="tt-section">
              <div class="tt-sub-header">
                🔬 <a href="https://www.w3.org/WAI/standards-guidelines/act/implementations/trusted-tester/" target="_blank" rel="noopener noreferrer" title="W3C WAI: Trusted Tester implementation overview">Trusted Tester v5</a>
              </div>
              <ul class="step-list" aria-label="Trusted Tester test steps">
                ${steps.map(s => {
                  const stepId = s.split(" - ")[0];
                  return `<li><a class="tt-step-link" href="https://section508.gov/test/trusted-tester/" target="_blank" rel="noopener noreferrer" title="Trusted Tester step ${escapeAttr(stepId)}">${escapeHTML(s)}</a></li>`;
                }).join("")}
              </ul>
            </div>`
          : ""
        }
        ${arrmTasks.length > 0
          ? `<details class="arrm-tasks-details">
              <summary class="arrm-tasks-summary">
                ARRM Tasks (<a href="https://www.w3.org/WAI/planning/arrm/tasks/" target="_blank" rel="noopener noreferrer">${arrmTasks.length} task${arrmTasks.length !== 1 ? "s" : ""}</a>)
              </summary>
              <ul class="arrm-task-list" aria-label="ARRM tasks for SC ${escapeHTML(num)}">
                ${arrmTaskItems}
              </ul>
            </details>`
          : ""
        }
      </div>
    </div>`;
  return card;
}

/* ------------------------------------------------------------------ */
/*  Table view                                                          */
/* ------------------------------------------------------------------ */

function renderTable() {
  const container = document.getElementById("table-view");
  const entries = Object.entries(filteredSC);

  if (entries.length === 0) {
    container.innerHTML = emptyStateHTML("No Success Criteria match your filters.");
    return;
  }

  const rows = entries.map(([num, e]) => {
    const a = e.automation ?? {};
    const actLinks  = (a.act  ?? []).map(i =>
      `<a href="https://www.w3.org/WAI/standards-guidelines/act/rules/${encodeURIComponent(i)}/" target="_blank" rel="noopener noreferrer" title="ACT Rule ${escapeHTML(i)}">ACT:${escapeHTML(i)}</a>`
    );
    const axeLinks  = (a.axe  ?? []).map(i =>
      `<a href="${axeRuleUrl(i)}" target="_blank" rel="noopener noreferrer" title="Axe rule ${escapeHTML(i)}">axe:${escapeHTML(i)}</a>`
    );
    const alfaLinks = (a.alfa ?? []).map(i =>
      `<a href="https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" target="_blank" rel="noopener noreferrer" title="Alfa rule ${escapeHTML(i)}">${escapeHTML(i)}</a>`
    );
    const allRuleLinks = [...actLinks, ...axeLinks, ...alfaLinks];

    // Roles with optional links to ARRM role pages
    const roleLinks = (e.manual?.roles ?? []).map(r => {
      const url = ARRM_ROLE_URLS[r];
      return url
        ? `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(r)}</a>`
        : escapeHTML(r);
    });

    // ARRM task IDs with links to the task category section
    const arrmTasks = e.manual?.arrm_tasks ?? [];
    const arrmTaskLinks = arrmTasks.map(t =>
      `<a href="${escapeAttr(t.category_url)}" target="_blank" rel="noopener noreferrer" title="${escapeAttr(t.task)}">${escapeHTML(t.id)}</a>`
    );

    // Trusted Tester step IDs, each linked to section508.gov
    const ttSteps = e.manual?.tt_steps ?? [];
    const ttStepLinks = ttSteps.map(s => {
      const stepId = s.split(" - ")[0];
      return `<a href="https://section508.gov/test/trusted-tester/" target="_blank" rel="noopener noreferrer" title="${escapeAttr(s)}">${escapeHTML(stepId)}</a>`;
    });

    return `
      <tr>
        <td>${escapeHTML(num)}</td>
        <td><a href="${escapeAttr(e.url ?? "#")}" target="_blank" rel="noopener noreferrer">${escapeHTML(e.title)}</a></td>
        <td><span class="level-badge level-${escapeHTML(e.level)}">${escapeHTML(e.level)}</span></td>
        <td>${escapeHTML(e.principle ?? "")}</td>
        <td>${allRuleLinks.length ? allRuleLinks.join(", ") : '<span class="no-data">—</span>'}</td>
        <td>${roleLinks.length ? roleLinks.join(", ") : '<span class="no-data">—</span>'}</td>
        <td>${ttStepLinks.length ? ttStepLinks.join(", ") : '<span class="no-data">—</span>'}</td>
        <td>${arrmTaskLinks.length ? arrmTaskLinks.join(", ") : '<span class="no-data">—</span>'}</td>
        <td>${automationCount(e)}/3</td>
      </tr>`;
  }).join("");

  container.innerHTML = `
    <table id="sc-table" aria-label="WCAG 2.2 Success Criteria">
      <thead>
        <tr>
          <th scope="col">SC</th>
          <th scope="col">Title</th>
          <th scope="col">Level</th>
          <th scope="col">Principle</th>
          <th scope="col">Automated Rules</th>
          <th scope="col">Roles</th>
          <th scope="col"><a href="https://www.w3.org/WAI/standards-guidelines/act/implementations/trusted-tester/" target="_blank" rel="noopener noreferrer" style="color:#fff">Trusted Tester</a></th>
          <th scope="col">ARRM Tasks</th>
          <th scope="col">Coverage</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

/* ------------------------------------------------------------------ */
/*  ACT Rules view                                                      */
/* ------------------------------------------------------------------ */

/**
 * ACT Rules view — shows W3C ACT rules found in the currently filtered set of
 * Success Criteria, grouped by ACT rule ID.
 *
 * For each ACT rule the card shows:
 *   • Link to the W3C ACT rule page
 *   • Which WCAG SCs the rule addresses
 *   • Which engine rules implement it (axe-core, Alfa, Equal Access, QualWeb)
 *     when ``meta.act_implementations`` data is available
 *
 * Below the ACT rule cards a second section lists any engine-specific rules
 * that have not been mapped to an ACT rule, grouped by engine.
 *
 * When no ACT rules are found in the filtered set an appropriate empty-state
 * message is shown.
 */
function renderActRules() {
  const container = document.getElementById("act-view");
  const entries = Object.entries(filteredSC);

  if (entries.length === 0) {
    container.innerHTML = emptyStateHTML("No Success Criteria match your filters.");
    return;
  }

  // --- Build ACT rule → SC mapping from filtered SCs ---
  // actRuleToScs: { actRuleId → [scNum, ...] }
  const actRuleToScs = {};
  for (const [num, entry] of entries) {
    for (const actId of (entry.automation?.act ?? [])) {
      actRuleToScs[actId] = actRuleToScs[actId] ?? [];
      if (!actRuleToScs[actId].includes(num)) actRuleToScs[actId].push(num);
    }
  }

  // --- Implementation data from meta (may be absent) ---
  const actImpls = spineData?.meta?.act_implementations ?? {};

  // Determine which axe / alfa / equal_access / qualweb rules are ACT-aligned
  // (i.e. listed as an implementation of at least one ACT rule in `actImpls`).
  const actAlignedAxe         = new Set();
  const actAlignedAlfa        = new Set();
  const actAlignedEqualAccess = new Set();
  const actAlignedQualweb     = new Set();
  for (const impl of Object.values(actImpls)) {
    (impl.axe         ?? []).forEach(r => actAlignedAxe.add(r));
    (impl.alfa        ?? []).forEach(r => actAlignedAlfa.add(r));
    (impl.equal_access ?? []).forEach(r => actAlignedEqualAccess.add(r));
    (impl.qualweb     ?? []).forEach(r => actAlignedQualweb.add(r));
  }

  // --- Collect engine-specific (non-ACT) rules from the filtered SCs ---
  const engineSpecific = { axe: new Set(), alfa: new Set(), equal_access: new Set(), qualweb: new Set() };
  for (const [, entry] of entries) {
    (entry.automation?.axe  ?? []).forEach(r => { if (!actAlignedAxe.has(r))         engineSpecific.axe.add(r); });
    (entry.automation?.alfa ?? []).forEach(r => { if (!actAlignedAlfa.has(r))        engineSpecific.alfa.add(r); });
  }

  const hasActRules = Object.keys(actRuleToScs).length > 0;
  const hasImplData = Object.keys(actImpls).length > 0;
  // Only show engine-specific section when we have implementation data to determine
  // which rules are ACT-aligned vs proprietary.  Without it, we cannot distinguish.
  const hasEngineSpecific = hasImplData && Object.values(engineSpecific).some(s => s.size > 0);

  const fragment = document.createDocumentFragment();

  // --- Intro bar ---
  const intro = document.createElement("div");
  intro.className = "act-intro";
  const actCount = Object.keys(actRuleToScs).length;
  intro.innerHTML = hasActRules
    ? `<p>
        <strong>${actCount} ACT rule${actCount !== 1 ? "s" : ""}</strong> found across the
        ${entries.length} filtered Success Criteria.
        ${hasImplData
          ? "Engine implementation data is available — see which tools cover each rule below."
          : "Run <code>python scripts/sync_data.py</code> to fetch engine implementation mappings."}
       </p>
       <p>
        <a href="https://www.w3.org/WAI/standards-guidelines/act/rules/" target="_blank" rel="noopener noreferrer">ACT Rules overview</a> ·
        <a href="https://www.w3.org/WAI/standards-guidelines/act/implementations/" target="_blank" rel="noopener noreferrer">Implementations</a>
       </p>`
    : `<p>No ACT rules are mapped to the currently filtered Success Criteria.</p>`;
  fragment.appendChild(intro);

  // --- ACT rule cards ---
  if (hasActRules) {
    const grid = document.createElement("div");
    grid.className = "act-rules-grid";
    grid.setAttribute("role", "list");

    for (const [actId, scNums] of Object.entries(actRuleToScs).sort()) {
      const impl = actImpls[actId] ?? {};
      const axeRules   = impl.axe         ?? [];
      const alfaRules  = impl.alfa        ?? [];
      const eaRules    = impl.equal_access ?? [];
      const qwRules    = impl.qualweb     ?? [];

      const hasAnyImpl = axeRules.length + alfaRules.length + eaRules.length + qwRules.length > 0;

      const card = document.createElement("article");
      card.className = "act-rule-card";
      card.setAttribute("role", "listitem");

      const scLinks = scNums
        .sort()
        .map(n => {
          const e = spineData.success_criteria[n];
          const href = e?.url ?? `#sc-${n.replace(/\./g, "_")}`;
          return `<a class="act-sc-badge" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer" title="${escapeAttr(e?.title ?? n)}">
            ${escapeHTML(n)}
          </a>`;
        })
        .join("");

      const engineRows = hasAnyImpl ? `
        <dl class="act-impl-list">
          ${axeRules.length ? `
            <dt class="act-engine act-engine-axe">axe-core</dt>
            <dd>${axeRules.map(r =>
              `<a class="tag tag-axe" href="${axeRuleUrl(r)}" target="_blank" rel="noopener noreferrer" title="Axe rule ${escapeHTML(r)}">${escapeHTML(r)}</a>`
            ).join(" ")}</dd>` : ""}
          ${alfaRules.length ? `
            <dt class="act-engine act-engine-alfa">Alfa</dt>
            <dd>${alfaRules.map(r =>
              `<span class="tag tag-alfa" title="Alfa rule ${escapeHTML(r)}">${escapeHTML(r)}</span>`
            ).join(" ")}</dd>` : ""}
          ${eaRules.length ? `
            <dt class="act-engine act-engine-ea">Equal Access</dt>
            <dd>${eaRules.map(r =>
              `<a class="tag tag-ea" href="https://www.ibm.com/able/requirements/checker-rule-sets" target="_blank" rel="noopener noreferrer" title="Equal Access rule ${escapeHTML(r)}">${escapeHTML(r)}</a>`
            ).join(" ")}</dd>` : ""}
          ${qwRules.length ? `
            <dt class="act-engine act-engine-qw">QualWeb</dt>
            <dd>${qwRules.map(r =>
              `<a class="tag tag-qw" href="https://qualweb.di.fc.ul.pt/evaluator" target="_blank" rel="noopener noreferrer" title="QualWeb rule ${escapeHTML(r)}">${escapeHTML(r)}</a>`
            ).join(" ")}</dd>` : ""}
        </dl>` : `<p class="no-data act-no-impl">No engine implementation data. Run sync to fetch mappings.</p>`;

      card.innerHTML = `
        <header class="act-rule-header">
          <a class="act-rule-id" href="https://www.w3.org/WAI/standards-guidelines/act/rules/${encodeURIComponent(actId)}/" target="_blank" rel="noopener noreferrer" title="View ACT Rule ${escapeHTML(actId)} on W3C WAI">
            ${escapeHTML(actId)}
          </a>
          <span class="act-rule-engines" aria-label="${hasAnyImpl ? "Implemented by" : "No implementation data"}">
            ${hasAnyImpl
              ? `${axeRules.length ? `<span class="act-engine-badge act-engine-badge-axe" title="${axeRules.length} axe-core rule${axeRules.length !== 1 ? "s" : ""}">axe</span>` : ""}${alfaRules.length ? `<span class="act-engine-badge act-engine-badge-alfa" title="${alfaRules.length} Alfa rule${alfaRules.length !== 1 ? "s" : ""}">Alfa</span>` : ""}${eaRules.length ? `<span class="act-engine-badge act-engine-badge-ea" title="${eaRules.length} Equal Access rule${eaRules.length !== 1 ? "s" : ""}">Equal Access</span>` : ""}${qwRules.length ? `<span class="act-engine-badge act-engine-badge-qw" title="${qwRules.length} QualWeb rule${qwRules.length !== 1 ? "s" : ""}">QualWeb</span>` : ""}`
              : `<span class="act-engine-badge act-engine-badge-none">no impl. data</span>`}
          </span>
        </header>
        <div class="act-rule-body">
          <div class="act-sc-section">
            <span class="act-section-label">WCAG SC</span>
            <span class="act-sc-list" aria-label="WCAG Success Criteria covered by this ACT rule">${scLinks}</span>
          </div>
          ${engineRows}
        </div>`;

      grid.appendChild(card);
    }
    fragment.appendChild(grid);
  }

  // --- Engine-specific rules section ---
  if (hasEngineSpecific) {
    const section = document.createElement("section");
    section.className = "act-engine-specific";
    section.setAttribute("aria-labelledby", "act-engine-specific-heading");

    const heading = document.createElement("h2");
    heading.id = "act-engine-specific-heading";
    heading.className = "act-section-heading";
    heading.textContent = "Engine-specific rules (not mapped to an ACT rule)";
    section.appendChild(heading);

    const note = document.createElement("p");
    note.className = "act-engine-specific-note";
    note.innerHTML = hasImplData
      ? "These rules from axe-core or Alfa are present in the filtered Success Criteria but are <strong>not listed as implementations</strong> of any W3C ACT rule. They may be proprietary rules or newly added rules not yet covered by ACT."
      : "Engine-specific status cannot be determined without implementation data. Run <code>python scripts/sync_data.py</code> to fetch mappings.";
    section.appendChild(note);

    if (engineSpecific.axe.size > 0) {
      const dl = document.createElement("dl");
      dl.className = "act-impl-list";
      dl.innerHTML = `
        <dt class="act-engine act-engine-axe">axe-core (engine-specific)</dt>
        <dd>${[...engineSpecific.axe].sort().map(r =>
          `<a class="tag tag-axe" href="${axeRuleUrl(r)}" target="_blank" rel="noopener noreferrer" title="Axe rule ${escapeHTML(r)}">${escapeHTML(r)}</a>`
        ).join(" ")}</dd>`;
      section.appendChild(dl);
    }

    if (engineSpecific.alfa.size > 0) {
      const dl = document.createElement("dl");
      dl.className = "act-impl-list";
      dl.innerHTML = `
        <dt class="act-engine act-engine-alfa">Alfa (engine-specific)</dt>
        <dd>${[...engineSpecific.alfa].sort().map(r =>
          `<span class="tag tag-alfa" title="Alfa rule ${escapeHTML(r)}">${escapeHTML(r)}</span>`
        ).join(" ")}</dd>`;
      section.appendChild(dl);
    }

    fragment.appendChild(section);
  }

  container.innerHTML = "";
  container.appendChild(fragment);
}



function renderDiagram() {
  const container = document.getElementById("mermaid-container");
  const entries = Object.entries(filteredSC);

  if (entries.length === 0) {
    container.innerHTML = emptyStateHTML("No Success Criteria match your filters.");
    return;
  }

  // Limit diagram to keep Mermaid performant; warn if over threshold
  const MAX_NODES = 20;
  const shown = entries.slice(0, MAX_NODES);
  const clipped = entries.length > MAX_NODES;

  const lines = [];
  lines.push("graph TD");
  lines.push("  classDef sc fill:#e1f5fe,stroke:#01579b,stroke-width:4px,color:#000");
  lines.push("  classDef auto fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#000");
  lines.push("  classDef manual fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000");
  lines.push("  classDef arrm fill:#e8eaf6,stroke:#3949ab,stroke-width:2px,color:#000");
  lines.push("  classDef tt fill:#e0f2f1,stroke:#00695c,stroke-width:2px,color:#000");
  lines.push("");

  const prevId = [];
  shown.forEach(([num, entry], idx) => {
    const safeNum = num.replace(/\./g, "_");
    const scId    = `SC_${safeNum}`;

    const a = entry.automation ?? {};
    const m = entry.manual ?? {};
    const autoItems = [
      ...(a.act  ?? []).map(i => `ACT:${sanitiseMermaid(i)}`),
      ...(a.axe  ?? []).map(i => `axe:${sanitiseMermaid(i)}`),
      ...(a.alfa ?? []).map(i => sanitiseMermaid(i)),
    ];
    const manualItems = [
      ...(m.roles ?? []).map(r => sanitiseMermaid(r)),
    ];
    const arrmTaskIds = (m.arrm_tasks ?? []).map(t => t.id);
    const ttStepIds   = (m.tt_steps  ?? []).map(s => s.split(" - ")[0]);

    const autoLabel  = autoItems.length
      ? `🤖 ${autoItems.slice(0, 4).join(", ")}${autoItems.length > 4 ? " …" : ""}`
      : "🤖 No automated rules";
    const manualLabel = manualItems.length
      ? `👤 ${manualItems.slice(0, 3).join(", ")}${manualItems.length > 3 ? " …" : ""}`
      : "👤 No roles mapped";
    const arrmLabel = arrmTaskIds.length
      ? `🎯 ${arrmTaskIds.slice(0, ARRM_IDS_IN_NODE).join(", ")}${arrmTaskIds.length > ARRM_IDS_IN_NODE ? ` +${arrmTaskIds.length - ARRM_IDS_IN_NODE} more` : ""}`
      : null;
    const ttLabel = ttStepIds.length
      ? `🔬 TT: ${ttStepIds.slice(0, TT_IDS_IN_NODE).join(", ")}${ttStepIds.length > TT_IDS_IN_NODE ? ` +${ttStepIds.length - TT_IDS_IN_NODE} more` : ""}`
      : null;

    const autoId  = `AUTO_${safeNum}`;
    const manId   = `MAN_${safeNum}`;
    const arrmId  = `ARRM_${safeNum}`;
    const ttId    = `TT_${safeNum}`;
    const autoEsc  = autoLabel.replace(/"/g, "'");
    const manEsc   = manualLabel.replace(/"/g, "'");
    const scTitle  = `${num}: ${entry.title}`.replace(/"/g, "'");
    const lvl      = entry.level;

    lines.push(`  subgraph Row_${safeNum} ["${scTitle} (${lvl})"]`);
    lines.push("    direction LR");
    lines.push(`    ${autoId}["${autoEsc}"]:::auto`);
    lines.push(`    ${scId}(("${num}")):::sc`);
    lines.push(`    ${manId}["${manEsc}"]:::manual`);
    lines.push(`    ${autoId} --- ${scId} --- ${manId}`);
    if (arrmLabel) {
      const arrmEsc = arrmLabel.replace(/"/g, "'");
      lines.push(`    ${arrmId}["${arrmEsc}"]:::arrm`);
      lines.push(`    ${scId} --- ${arrmId}`);
    }
    if (ttLabel) {
      const ttEsc = ttLabel.replace(/"/g, "'");
      lines.push(`    ${ttId}["${ttEsc}"]:::tt`);
      lines.push(`    ${scId} --- ${ttId}`);
    }
    lines.push("  end");
    lines.push("");

    // Add clickable links for SC and automation nodes
    const wcagUrl = entry.url;
    if (wcagUrl) {
      lines.push(`  click ${scId} href "${wcagUrl}" _blank`);
      if (autoItems.length > 0) {
        lines.push(`  click ${autoId} href "${wcagUrl}" _blank`);
      }
      lines.push("");
    }

    // ARRM click → ARRM tasks page section
    if (arrmLabel) {
      const arrmTaskUrl = (m.arrm_tasks[0]?.category_url) ?? "https://www.w3.org/WAI/planning/arrm/tasks/";
      lines.push(`  click ${arrmId} href "${arrmTaskUrl}" _blank`);
      lines.push("");
    }

    // TT click → W3C WAI Trusted Tester implementations page
    if (ttLabel) {
      lines.push(`  click ${ttId} href "https://www.w3.org/WAI/standards-guidelines/act/implementations/trusted-tester/" _blank`);
      lines.push("");
    }

    // Chain spine vertically
    if (idx > 0) {
      const prevScId = `SC_${prevId[prevId.length - 1]}`;
      lines.push(`  ${prevScId} ==> ${scId}`);
      lines.push("");
    }
    prevId.push(safeNum);
  });

  const definition = lines.join("\n");

  if (clipped) {
    const notice = document.createElement("p");
    notice.style.cssText = "text-align:center;color:#e65100;font-size:.85rem;margin-bottom:8px;";
    notice.textContent = `⚠️ Diagram shows first ${MAX_NODES} of ${entries.length} filtered SCs. Use the Cards or Table view for all results.`;
    container.innerHTML = "";
    container.appendChild(notice);
  } else {
    container.innerHTML = "";
  }

  const mermaidDiv = document.createElement("div");
  mermaidDiv.className = "mermaid";
  mermaidDiv.textContent = definition;
  container.appendChild(mermaidDiv);

  // Re-render Mermaid
  if (window.mermaid) {
    window.mermaid.run({ nodes: [mermaidDiv] }).catch(err => {
      console.error("Mermaid render error:", err);
      mermaidDiv.innerHTML = `<pre style="color:red;white-space:pre-wrap">${escapeHTML(definition)}</pre>`;
    });
  }
}

function sanitiseMermaid(str) {
  return String(str).replace(/["\(\)\[\]{}<>]/g, "").replace(/-/g, " ").trim();
}

/* ------------------------------------------------------------------ */
/*  Hash-based navigation / deep linking                               */
/* ------------------------------------------------------------------ */

function handleHashNavigation() {
  const hash = window.location.hash.slice(1); // e.g. "2.4.11"
  if (!hash) return;

  // Normalise: allow both "2.4.11" and "sc-2_4_11"
  const scNum = hash.replace(/^sc-/, "").replace(/_/g, ".");
  const cardId = `sc-${scNum.replace(/\./g, "_")}`;

  // If we're not on cards view, switch to it
  if (currentView !== "cards") switchView("cards");

  // Ensure the SC is visible (reset filters if needed)
  if (!filteredSC[scNum]) {
    resetFilters();
    applyFilters();
  }

  // Scroll + highlight
  requestAnimationFrame(() => {
    const el = document.getElementById(cardId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.remove("highlighted");
      void el.offsetWidth; // trigger reflow
      el.classList.add("highlighted");
    }
  });
}

function resetFilters() {
  document.getElementById("filter-level").value     = "";
  document.getElementById("filter-role").value      = "";
  document.getElementById("filter-automation").value = "";
  document.getElementById("search-input").value     = "";
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function showLoading(show) {
  document.getElementById("loading").hidden = !show;
  document.getElementById("view-tabs").hidden = show;
  document.getElementById("diagram-view").hidden = show || currentView !== "diagram";
  document.getElementById("cards-view").hidden   = show || currentView !== "cards";
  document.getElementById("table-view").hidden   = show || currentView !== "table";
  document.getElementById("act-view").hidden     = show || currentView !== "act";
}

function showError(msg) {
  document.getElementById("loading").hidden = true;
  document.getElementById("view-tabs").hidden = true;
  const main = document.querySelector("main");
  main.innerHTML = `
    <div class="empty-state" role="alert">
      <h2>⚠️ Error loading data</h2>
      <p>${escapeHTML(msg)}</p>
      <p>Please check the browser console for details.</p>
    </div>`;
}

function emptyStateHTML(msg) {
  return `<div class="empty-state"><h2>No results</h2><p>${escapeHTML(msg)}</p></div>`;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
}
