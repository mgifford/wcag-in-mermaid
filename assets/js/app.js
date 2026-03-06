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

/** Base URL for the Section 508 Trusted Tester v5 reference site. */
const TT_BASE_URL = "https://section508coordinators.github.io/TrustedTester/";

/**
 * Maps each WCAG SC number to the most relevant TrustedTester section page.
 * Where a WCAG SC is covered by multiple TT sections the primary section is
 * used.  SCs not covered by TT v5 (WCAG 2.1 / 2.2 additions or AAA criteria)
 * are mapped to the closest equivalent section.
 *
 * Source: https://section508coordinators.github.io/TrustedTester/appendixa.html
 * (Section 508 / WCAG Requirement → Trusted Tester Test cross-reference)
 */
const TT_SC_PAGE = {
  // 1.1 – Text Alternatives
  "1.1.1": "images.html",
  // 1.2 – Time-based Media
  "1.2.1": "audiovideo.html",
  "1.2.2": "media.html",
  "1.2.3": "media.html",
  "1.2.4": "media.html",
  "1.2.5": "media.html",
  "1.2.6": "media.html",
  "1.2.7": "media.html",
  "1.2.8": "media.html",
  "1.2.9": "audiovideo.html",
  // 1.3 – Adaptable
  "1.3.1": "structure.html",          // primary; 1.3.1.B overridden to tables.html via TT_STEP_PAGE_OVERRIDE
  "1.3.2": "css-content-position.html",
  "1.3.3": "sensory.html",
  "1.3.4": "keyboard.html",           // WCAG 2.1 – closest: keyboard/focus
  "1.3.5": "forms.html",              // WCAG 2.1 – identify input purpose
  "1.3.6": "structure.html",          // WCAG 2.2 – identify purpose
  // 1.4 – Distinguishable
  "1.4.1": "sensory.html",
  "1.4.2": "auto.html",
  "1.4.3": "sensory.html",
  "1.4.4": "resize.html",
  "1.4.5": "images.html",
  "1.4.6": "sensory.html",
  "1.4.7": "sensory.html",
  "1.4.8": "sensory.html",
  "1.4.9": "images.html",
  "1.4.10": "resize.html",            // WCAG 2.1 – reflow
  "1.4.11": "sensory.html",           // WCAG 2.1 – non-text contrast
  "1.4.12": "resize.html",            // WCAG 2.1 – text spacing
  "1.4.13": "keyboard.html",          // WCAG 2.1 – content on hover/focus
  // 2.1 – Keyboard Accessible
  "2.1.1": "keyboard.html",
  "2.1.2": "keyboard.html",
  "2.1.3": "keyboard.html",
  "2.1.4": "keyboard.html",           // WCAG 2.1
  // 2.2 – Enough Time
  "2.2.1": "timelimits.html",
  "2.2.2": "auto.html",
  "2.2.3": "timelimits.html",
  "2.2.4": "timelimits.html",
  "2.2.5": "timelimits.html",
  "2.2.6": "timelimits.html",         // WCAG 2.1
  // 2.3 – Seizures and Physical Reactions
  "2.3.1": "flashing.html",
  "2.3.2": "flashing.html",
  "2.3.3": "flashing.html",           // WCAG 2.1
  // 2.4 – Navigable
  "2.4.1": "repetitive.html",
  "2.4.2": "titles.html",
  "2.4.3": "keyboard.html",
  "2.4.4": "links.html",
  "2.4.5": "multiple.html",
  "2.4.6": "structure.html",          // primary; 2.4.6.B overridden to forms.html via TT_STEP_PAGE_OVERRIDE
  "2.4.7": "keyboard.html",
  "2.4.8": "repetitive.html",
  "2.4.9": "links.html",
  "2.4.10": "structure.html",
  "2.4.11": "keyboard.html",          // WCAG 2.2
  "2.4.12": "keyboard.html",          // WCAG 2.2
  "2.4.13": "keyboard.html",          // WCAG 2.2
  // 2.5 – Input Modalities (WCAG 2.1 / 2.2)
  "2.5.1": "keyboard.html",
  "2.5.2": "keyboard.html",
  "2.5.3": "forms.html",
  "2.5.4": "keyboard.html",
  "2.5.5": "keyboard.html",
  "2.5.6": "keyboard.html",
  "2.5.7": "keyboard.html",
  "2.5.8": "keyboard.html",
  // 3.1 – Readable
  "3.1.1": "language.html",
  "3.1.2": "language.html",
  "3.1.3": "language.html",
  "3.1.4": "language.html",
  "3.1.5": "language.html",
  "3.1.6": "language.html",
  // 3.2 – Predictable
  "3.2.1": "keyboard.html",
  "3.2.2": "forms.html",
  "3.2.3": "repetitive.html",
  "3.2.4": "repetitive.html",
  "3.2.5": "repetitive.html",
  "3.2.6": "repetitive.html",         // WCAG 2.2
  // 3.3 – Input Assistance
  "3.3.1": "forms.html",
  "3.3.2": "forms.html",
  "3.3.3": "forms.html",
  "3.3.4": "forms.html",
  "3.3.5": "forms.html",
  "3.3.6": "forms.html",
  "3.3.7": "forms.html",              // WCAG 2.2
  "3.3.8": "forms.html",              // WCAG 2.2
  "3.3.9": "forms.html",              // WCAG 2.2
  // 4.1 – Compatible
  "4.1.1": "parsing.html",
  "4.1.2": "forms.html",
  "4.1.3": "forms.html",              // WCAG 2.1 – status messages
};

/**
 * Step-level URL overrides: maps a full TT step ID (e.g. "1.3.1.B") to a
 * more precise TT page when the SC-level mapping would be less specific.
 */
const TT_STEP_PAGE_OVERRIDE = {
  "1.3.1.B": "tables.html",   // Data Table Structure
  "2.4.6.B": "forms.html",    // Label Descriptiveness
};

/**
 * Returns the full TrustedTester URL for a given step ID (e.g. "1.4.2.A").
 * Checks TT_STEP_PAGE_OVERRIDE first, then falls back to the SC-level mapping
 * in TT_SC_PAGE, and finally to appendixa.html for any unmapped SC.
 *
 * @param {string} stepId - TT step ID in "X.Y.Z.Letter" format.
 * @returns {string} Full URL to the relevant TrustedTester section page.
 */
function ttStepUrl(stepId) {
  if (TT_STEP_PAGE_OVERRIDE[stepId]) {
    return TT_BASE_URL + TT_STEP_PAGE_OVERRIDE[stepId];
  }
  const sc = stepId.split(".").slice(0, 3).join(".");
  return TT_BASE_URL + (TT_SC_PAGE[sc] ?? "appendixa.html");
}

/**
 * Returns the full TrustedTester URL for a given WCAG SC number (e.g. "1.4.2").
 * Falls back to appendixa.html for any unmapped SC.
 *
 * @param {string} scNum - WCAG SC number in "X.Y.Z" format.
 * @returns {string} Full URL to the relevant TrustedTester section page.
 */
function ttScUrl(scNum) {
  return TT_BASE_URL + (TT_SC_PAGE[scNum] ?? "appendixa.html");
}

/** @type {{ meta: object, success_criteria: Record<string, SCEntry> } | null} */
let spineData = null;

/** @type {Record<string, SCEntry>} currently visible subset */
let filteredSC = {};

let currentView = "cards"; // "cards" | "diagram" | "table"

/**
 * Plain-language descriptions shown below the view tabs.
 * Each entry explains what the view shows and when to use it.
 */
const VIEW_DESCRIPTIONS = {
  cards:   "Browse each WCAG 2.2 Success Criterion as an individual card. " +
           "Each card shows the SC number and title, conformance level, automated test coverage " +
           "(ACT rules, axe-core, Alfa), responsible ARRM roles, and Trusted Tester v5 steps. " +
           "Use this view to explore the full details of individual criteria.",
  diagram: "Visualise the filtered Success Criteria as a Mermaid.js graph — a \"spine\" " +
           "that connects each SC to its automation rules on the left and manual-testing roles on the right. " +
           "Nodes link out to WCAG, ACT, ARRM, and Trusted Tester pages. " +
           "Use this view to understand relationships at a glance. " +
           "Performance cap: the diagram renders at most 20 SCs at a time.",
  table:   "Compare all filtered Success Criteria side-by-side in a compact, sortable table. " +
           "Columns cover SC number, title, conformance level, WCAG principle, automated rules, " +
           "ARRM roles, Trusted Tester steps, ARRM tasks, and overall automation coverage. " +
           "Use this view for quick auditing or to scan many criteria at once.",
  act:     "Browse by ACT (Accessibility Conformance Testing) rule ID rather than by Success Criterion. " +
           "Each card shows which WCAG SCs the rule addresses and which testing engines " +
           "(axe-core, Alfa, Equal Access, QualWeb) implement it. " +
           "A second section lists engine-specific rules not yet mapped to a W3C ACT rule. " +
           "Use this view to evaluate automated testing tool coverage or compare engine implementations.",
  coverage: "Understand the automation coverage landscape for WCAG 2.2 Success Criteria. " +
            "See which SCs are fully covered by automated rules, which are only partially covered, " +
            "and which require entirely manual testing. Automated tools can only test a portion of each SC — " +
            "this view highlights the gaps and helps you plan a complete testing strategy.",
};

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
    switchView("cards", false);   // sets aria-selected and shows correct panel
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

/**
 * Build the canonical URL for a Siteimprove Alfa rule documentation page.
 *
 * Rule IDs are stored as upper-case (e.g. ``"SIA-R3"``) but the Alfa docs site
 * uses lower-case paths (e.g. ``https://alfa.siteimprove.com/rules/sia-r3``).
 *
 * @param {string} ruleId  The Alfa rule identifier, e.g. ``"SIA-R3"``.
 * @returns {string}
 */
function alfaRuleUrl(ruleId) {
  return `https://alfa.siteimprove.com/rules/${encodeURIComponent(ruleId.toLowerCase())}`;
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

function switchView(view, updateHash = true) {
  currentView = view;
  if (updateHash) {
    history.replaceState(null, "", "#" + view);
  }
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.setAttribute("aria-selected", String(b.dataset.view === view));
  });
  document.getElementById("diagram-view").hidden = view !== "diagram";
  document.getElementById("cards-view").hidden   = view !== "cards";
  document.getElementById("table-view").hidden   = view !== "table";
  document.getElementById("act-view").hidden     = view !== "act";
  document.getElementById("coverage-view").hidden = view !== "coverage";
  const descEl = document.getElementById("view-description");
  if (descEl) {
    descEl.textContent = VIEW_DESCRIPTIONS[view] ?? "";
    descEl.hidden = false;
  }
  renderCurrentView();
}

function renderCurrentView() {
  if (currentView === "diagram") renderDiagram();
  else if (currentView === "cards") renderCards();
  else if (currentView === "act") renderActRules();
  else if (currentView === "coverage") renderCoverage();
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
                `<li><a class="tag tag-alfa" href="${alfaRuleUrl(id)}" target="_blank" rel="noopener noreferrer" title="Alfa rule ${escapeHTML(id)}">${escapeHTML(id)}</a></li>`
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
                🔬 <a href="https://section508coordinators.github.io/TrustedTester/index.html" target="_blank" rel="noopener noreferrer" title="Section 508 Trusted Tester v5 resource">Trusted Tester v5</a>
              </div>
              <ul class="step-list" aria-label="Trusted Tester test steps">
                ${steps.map(s => {
                  const stepId = s.split(" - ")[0];
                  return `<li><a class="tt-step-link" href="${escapeAttr(ttStepUrl(stepId))}" target="_blank" rel="noopener noreferrer" title="Trusted Tester step ${escapeAttr(stepId)}">${escapeHTML(s)}</a></li>`;
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
      `<a href="${alfaRuleUrl(i)}" target="_blank" rel="noopener noreferrer" title="Alfa rule ${escapeHTML(i)}">${escapeHTML(i)}</a>`
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
      return `<a href="${escapeAttr(ttStepUrl(stepId))}" target="_blank" rel="noopener noreferrer" title="${escapeAttr(s)}">${escapeHTML(stepId)}</a>`;
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
          <th scope="col"><a href="https://section508coordinators.github.io/TrustedTester/index.html" target="_blank" rel="noopener noreferrer" style="color:#fff">Trusted Tester</a></th>
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
              `<a class="tag tag-alfa" href="${alfaRuleUrl(r)}" target="_blank" rel="noopener noreferrer" title="Alfa rule ${escapeHTML(r)}">${escapeHTML(r)}</a>`
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
          `<a class="tag tag-alfa" href="${alfaRuleUrl(r)}" target="_blank" rel="noopener noreferrer" title="Alfa rule ${escapeHTML(r)}">${escapeHTML(r)}</a>`
        ).join(" ")}</dd>`;
      section.appendChild(dl);
    }

    fragment.appendChild(section);
  }

  container.innerHTML = "";
  container.appendChild(fragment);
}

/* ------------------------------------------------------------------ */
/*  Coverage view                                                       */
/* ------------------------------------------------------------------ */

/**
 * Coverage view — analyses automation coverage across all WCAG 2.2 SCs and
 * explains manual vs automated testing.
 *
 * Sections:
 *  1. Summary statistics (full / partial / none across all 86 SCs)
 *  2. What automation can and cannot test — methodology explanation
 *  3. Breakdown table: partially-covered SCs showing which engines are present
 *  4. Resource links for further reading
 */
function renderCoverage() {
  const container = document.getElementById("coverage-view");
  const allSC = Object.entries(spineData.success_criteria);

  /* ----- Compute statistics over ALL SCs (not just filtered) ---------- */
  const stats = { full: [], partial: [], none: [] };
  const byPrinciple = {};
  const byLevel = { A: { full: 0, partial: 0, none: 0 }, AA: { full: 0, partial: 0, none: 0 }, AAA: { full: 0, partial: 0, none: 0 } };

  for (const [num, entry] of allSC) {
    const count = automationCount(entry);
    const cat   = count === 3 ? "full" : count > 0 ? "partial" : "none";
    stats[cat].push(num);

    const principle = entry.principle ?? "Unknown";
    if (!byPrinciple[principle]) byPrinciple[principle] = { full: 0, partial: 0, none: 0, total: 0 };
    byPrinciple[principle][cat]++;
    byPrinciple[principle].total++;

    const level = entry.level ?? "?";
    if (byLevel[level]) byLevel[level][cat]++;
  }

  const total = allSC.length;
  const pct = n => Math.round(n / total * 100);

  const fragment = document.createDocumentFragment();

  /* ----- 1. Summary statistics --------------------------------------- */
  const summarySection = document.createElement("section");
  summarySection.className = "cov-section";
  summarySection.setAttribute("aria-labelledby", "cov-summary-heading");
  summarySection.innerHTML = `
    <h2 id="cov-summary-heading" class="cov-heading">Automation Coverage Summary</h2>
    <p class="cov-intro-text">
      Of the ${total} WCAG 2.2 Success Criteria, only a fraction can be tested automatically.
      "Full coverage" means all three major rule engines (ACT&nbsp;Rules, axe-core, and Alfa) have
      at least one rule mapped to the SC. Even fully-covered SCs are only partially verifiable
      by automation — automated tools find concrete technical violations but cannot assess
      context, intent, or subjective quality.
    </p>
    <div class="cov-stat-grid" role="list" aria-label="Automation coverage statistics">
      <div class="cov-stat cov-stat-full" role="listitem">
        <span class="cov-stat-value">${stats.full.length}</span>
        <span class="cov-stat-label">Fully covered</span>
        <span class="cov-stat-pct">${pct(stats.full.length)}% of SCs</span>
        <p class="cov-stat-desc">ACT Rules, axe-core, and Alfa all have at least one rule mapped.</p>
      </div>
      <div class="cov-stat cov-stat-partial" role="listitem">
        <span class="cov-stat-value">${stats.partial.length}</span>
        <span class="cov-stat-label">Partially covered</span>
        <span class="cov-stat-pct">${pct(stats.partial.length)}% of SCs</span>
        <p class="cov-stat-desc">At least one engine has rules, but not all three engines are represented.</p>
      </div>
      <div class="cov-stat cov-stat-none" role="listitem">
        <span class="cov-stat-value">${stats.none.length}</span>
        <span class="cov-stat-label">No automation</span>
        <span class="cov-stat-pct">${pct(stats.none.length)}% of SCs</span>
        <p class="cov-stat-desc">No automated rules are mapped. These SCs require entirely manual testing.</p>
      </div>
    </div>`;
  fragment.appendChild(summarySection);

  /* ----- 2. What automation can and cannot test ---------------------- */
  const methodSection = document.createElement("section");
  methodSection.className = "cov-section";
  methodSection.setAttribute("aria-labelledby", "cov-method-heading");
  methodSection.innerHTML = `
    <h2 id="cov-method-heading" class="cov-heading">Manual vs Automated Testing</h2>
    <div class="cov-method-grid">
      <div class="cov-method-card cov-method-auto">
        <h3 class="cov-method-title">🤖 Automated Testing</h3>
        <p>Automated rules run programmatically against rendered HTML and can reliably detect:</p>
        <ul>
          <li>Missing or empty <code>alt</code> attributes on images</li>
          <li>Insufficient colour contrast ratios</li>
          <li>Form inputs without associated labels</li>
          <li>Missing page <code>&lt;title&gt;</code> or landmark structure</li>
          <li>Interactive elements not reachable by keyboard</li>
          <li>ARIA attributes used incorrectly</li>
        </ul>
        <p class="cov-method-note">
          <strong>Limitation:</strong> Automated tools cover an estimated
          <a href="https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/" target="_blank" rel="noopener noreferrer">~57% of accessibility issues, according to Deque's study</a>.
          They cannot judge context, meaning, or user experience.
        </p>
        <h4 class="cov-engine-heading">Rule engines tracked in this dashboard</h4>
        <dl class="cov-engine-list">
          <dt><a href="https://www.w3.org/WAI/standards-guidelines/act/rules/" target="_blank" rel="noopener noreferrer">ACT Rules</a></dt>
          <dd>W3C standard test rules; vendor-neutral and interoperable. Implemented by multiple engines.</dd>
          <dt><a href="https://github.com/dequelabs/axe-core" target="_blank" rel="noopener noreferrer">axe-core</a> (Deque)</dt>
          <dd>Open-source engine powering axe DevTools, browser extensions, and CI integrations.</dd>
          <dt><a href="https://github.com/siteimprove/alfa" target="_blank" rel="noopener noreferrer">Alfa</a> (Siteimprove)</dt>
          <dd>Open-source engine with a strong focus on ACT rule compliance and formal verification.</dd>
        </dl>
      </div>
      <div class="cov-method-card cov-method-manual">
        <h3 class="cov-method-title">👤 Manual Testing</h3>
        <p>Manual testing is essential for SCs that require human judgement, including:</p>
        <ul>
          <li>Assessing whether alternative text is meaningful and accurate</li>
          <li>Evaluating logical reading order and information structure</li>
          <li>Verifying that instructions don't rely solely on colour or shape</li>
          <li>Testing with real assistive technologies (screen readers, switch access)</li>
          <li>Checking that time limits are appropriate for user tasks</li>
          <li>Evaluating error messages for clarity and helpfulness</li>
        </ul>
        <p class="cov-method-note">
          <strong>Key resources:</strong> The
          <a href="https://www.w3.org/WAI/planning/arrm/" target="_blank" rel="noopener noreferrer">ARRM (Accessibility Roles and Responsibilities Mapping)</a>
          defines which roles (UX Design, Front-End Development, Content Authoring, etc.) own each testing task.
          The <a href="https://section508.gov/test/trusted-tester/" target="_blank" rel="noopener noreferrer">DHS Trusted Tester v5</a>
          provides step-by-step manual test procedures for Section 508 / WCAG conformance.
        </p>
        <h4 class="cov-engine-heading">Manual testing frameworks tracked</h4>
        <dl class="cov-engine-list">
          <dt><a href="https://www.w3.org/WAI/planning/arrm/" target="_blank" rel="noopener noreferrer">W3C ARRM</a></dt>
          <dd>Maps every WCAG SC to the responsible roles and the tasks each role must perform.</dd>
          <dt><a href="https://section508coordinators.github.io/TrustedTester/index.html" target="_blank" rel="noopener noreferrer">DHS Trusted Tester v5</a></dt>
          <dd>Repeatable test procedures used by federal agencies; aligns with WCAG 2.x success criteria.</dd>
        </dl>
      </div>
    </div>`;
  fragment.appendChild(methodSection);

  /* ----- 3. Breakdown by principle ----------------------------------- */
  const principleSection = document.createElement("section");
  principleSection.className = "cov-section";
  principleSection.setAttribute("aria-labelledby", "cov-principle-heading");

  const principleRows = Object.entries(byPrinciple)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([principle, counts]) => {
      const fullPct    = Math.round(counts.full    / counts.total * 100);
      const partialPct = Math.round(counts.partial / counts.total * 100);
      const nonePct    = Math.round(counts.none    / counts.total * 100);
      return `<tr>
        <td>${escapeHTML(principle)}</td>
        <td class="cov-num">${counts.total}</td>
        <td class="cov-num cov-full">${counts.full} <span class="cov-pct">(${fullPct}%)</span></td>
        <td class="cov-num cov-partial">${counts.partial} <span class="cov-pct">(${partialPct}%)</span></td>
        <td class="cov-num cov-none">${counts.none} <span class="cov-pct">(${nonePct}%)</span></td>
      </tr>`;
    }).join("");

  const levelRows = Object.entries(byLevel).map(([level, counts]) => {
    const lvlTotal   = counts.full + counts.partial + counts.none;
    const fullPct    = lvlTotal ? Math.round(counts.full    / lvlTotal * 100) : 0;
    const partialPct = lvlTotal ? Math.round(counts.partial / lvlTotal * 100) : 0;
    const nonePct    = lvlTotal ? Math.round(counts.none    / lvlTotal * 100) : 0;
    return `<tr>
      <td><span class="level-badge level-${escapeHTML(level)}">${escapeHTML(level)}</span></td>
      <td class="cov-num">${lvlTotal}</td>
      <td class="cov-num cov-full">${counts.full} <span class="cov-pct">(${fullPct}%)</span></td>
      <td class="cov-num cov-partial">${counts.partial} <span class="cov-pct">(${partialPct}%)</span></td>
      <td class="cov-num cov-none">${counts.none} <span class="cov-pct">(${nonePct}%)</span></td>
    </tr>`;
  }).join("");

  principleSection.innerHTML = `
    <h2 id="cov-principle-heading" class="cov-heading">Coverage by Principle &amp; Level</h2>
    <div class="cov-table-pair">
      <div>
        <h3 class="cov-sub-heading">By WCAG Principle</h3>
        <table class="cov-table" aria-label="Automation coverage by WCAG principle">
          <thead>
            <tr>
              <th scope="col">Principle</th>
              <th scope="col" class="cov-num">SCs</th>
              <th scope="col" class="cov-num">Full</th>
              <th scope="col" class="cov-num">Partial</th>
              <th scope="col" class="cov-num">None</th>
            </tr>
          </thead>
          <tbody>${principleRows}</tbody>
        </table>
      </div>
      <div>
        <h3 class="cov-sub-heading">By Conformance Level</h3>
        <table class="cov-table" aria-label="Automation coverage by conformance level">
          <thead>
            <tr>
              <th scope="col">Level</th>
              <th scope="col" class="cov-num">SCs</th>
              <th scope="col" class="cov-num">Full</th>
              <th scope="col" class="cov-num">Partial</th>
              <th scope="col" class="cov-num">None</th>
            </tr>
          </thead>
          <tbody>${levelRows}</tbody>
        </table>
      </div>
    </div>`;
  fragment.appendChild(principleSection);

  /* ----- 4. Partially-covered SCs ------------------------------------ */
  const partialSection = document.createElement("section");
  partialSection.className = "cov-section";
  partialSection.setAttribute("aria-labelledby", "cov-partial-heading");

  const partialRows = stats.partial
    .sort()
    .map(num => {
      const entry = spineData.success_criteria[num];
      const a = entry.automation ?? {};
      const hasAct  = (a.act  ?? []).length > 0;
      const hasAxe  = (a.axe  ?? []).length > 0;
      const hasAlfa = (a.alfa ?? []).length > 0;

      const actCell  = hasAct  ? `<span class="cov-engine-yes" aria-label="ACT Rules covered">✔ ACT</span>`  : `<span class="cov-engine-gap" aria-label="ACT Rules not covered">✖ ACT</span>`;
      const axeCell  = hasAxe  ? `<span class="cov-engine-yes" aria-label="axe-core covered">✔ axe</span>`  : `<span class="cov-engine-gap" aria-label="axe-core not covered">✖ axe</span>`;
      const alfaCell = hasAlfa ? `<span class="cov-engine-yes" aria-label="Alfa covered">✔ Alfa</span>` : `<span class="cov-engine-gap" aria-label="Alfa not covered">✖ Alfa</span>`;

      return `<tr>
        <td><a href="${escapeAttr(entry.url ?? "#")}" target="_blank" rel="noopener noreferrer">${escapeHTML(num)}</a></td>
        <td>${escapeHTML(entry.title)}</td>
        <td><span class="level-badge level-${escapeHTML(entry.level)}">${escapeHTML(entry.level)}</span></td>
        <td>${actCell} ${axeCell} ${alfaCell}</td>
      </tr>`;
    }).join("");

  partialSection.innerHTML = `
    <h2 id="cov-partial-heading" class="cov-heading">Partially-Covered Success Criteria</h2>
    <p class="cov-intro-text">
      These ${stats.partial.length} SCs have at least one automated rule but are not covered by all three engines.
      Engine gaps may reflect genuine tool limitations, rules in development, or proprietary-only implementations.
      Treat these SCs as requiring both automated scanning and targeted manual review.
    </p>
    <table class="cov-table cov-partial-table" aria-label="Partially-covered WCAG 2.2 Success Criteria">
      <thead>
        <tr>
          <th scope="col">SC</th>
          <th scope="col">Title</th>
          <th scope="col">Level</th>
          <th scope="col">Engine coverage</th>
        </tr>
      </thead>
      <tbody>${partialRows}</tbody>
    </table>`;
  fragment.appendChild(partialSection);

  /* ----- 5. Resource links ------------------------------------------ */
  const resourceSection = document.createElement("section");
  resourceSection.className = "cov-section";
  resourceSection.setAttribute("aria-labelledby", "cov-resources-heading");
  resourceSection.innerHTML = `
    <h2 id="cov-resources-heading" class="cov-heading">Resources &amp; Further Reading</h2>
    <div class="cov-resource-grid">
      <div class="cov-resource-card">
        <h3 class="cov-resource-title">Specifications &amp; Standards</h3>
        <ul class="cov-resource-list">
          <li><a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener noreferrer">WCAG 2.2 Specification</a> — W3C Recommendation</li>
          <li><a href="https://www.w3.org/WAI/WCAG22/Understanding/" target="_blank" rel="noopener noreferrer">WCAG 2.2 Understanding Documents</a> — intent, techniques, and failure examples</li>
          <li><a href="https://www.w3.org/WAI/standards-guidelines/act/" target="_blank" rel="noopener noreferrer">ACT Rules Framework</a> — W3C standard for writing automated test rules</li>
          <li><a href="https://www.w3.org/WAI/standards-guidelines/act/rules/" target="_blank" rel="noopener noreferrer">ACT Rules Registry</a> — all published ACT rules with SC mappings</li>
        </ul>
      </div>
      <div class="cov-resource-card">
        <h3 class="cov-resource-title">Automated Testing Tools</h3>
        <ul class="cov-resource-list">
          <li><a href="https://github.com/dequelabs/axe-core" target="_blank" rel="noopener noreferrer">axe-core</a> — Open-source accessibility engine by Deque Systems</li>
          <li><a href="https://github.com/siteimprove/alfa" target="_blank" rel="noopener noreferrer">Alfa</a> — Open-source accessibility engine by Siteimprove</li>
          <li><a href="https://www.ibm.com/able/toolkit/tools/" target="_blank" rel="noopener noreferrer">IBM Equal Access Checker</a> — free accessibility scanner</li>
          <li><a href="https://qualweb.di.fc.ul.pt/" target="_blank" rel="noopener noreferrer">QualWeb</a> — open-source evaluator implementing ACT rules</li>
          <li><a href="https://www.w3.org/WAI/standards-guidelines/act/implementations/" target="_blank" rel="noopener noreferrer">ACT Implementations Registry</a> — which tools implement which ACT rules</li>
        </ul>
      </div>
      <div class="cov-resource-card">
        <h3 class="cov-resource-title">Manual Testing Frameworks</h3>
        <ul class="cov-resource-list">
          <li><a href="https://www.w3.org/WAI/planning/arrm/" target="_blank" rel="noopener noreferrer">W3C ARRM</a> — roles and tasks for each WCAG SC</li>
          <li><a href="https://section508.gov/test/trusted-tester/" target="_blank" rel="noopener noreferrer">DHS Trusted Tester v5</a> — step-by-step federal testing procedures</li>
          <li><a href="https://section508coordinators.github.io/TrustedTester/index.html" target="_blank" rel="noopener noreferrer">Trusted Tester online reference</a> — full test procedure library</li>
          <li><a href="https://www.w3.org/WAI/test-evaluate/preliminary/" target="_blank" rel="noopener noreferrer">Easy Checks — A First Review</a> — W3C quick manual checks</li>
          <li><a href="https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/" target="_blank" rel="noopener noreferrer">WCAG-EM</a> — Website Accessibility Conformance Evaluation Methodology</li>
        </ul>
      </div>
      <div class="cov-resource-card">
        <h3 class="cov-resource-title">Understanding Coverage Gaps</h3>
        <ul class="cov-resource-list">
          <li><a href="https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/" target="_blank" rel="noopener noreferrer">Deque: Automated testing covers ~57% of issues</a></li>
          <li><a href="https://alphagov.github.io/wcag-primer/" target="_blank" rel="noopener noreferrer">GOV.UK WCAG 2.1 Primer</a> — plain-language SC explanations</li>
          <li><a href="testing-methods.md" target="_blank" rel="noopener noreferrer">Testing Methods &amp; Resources</a> — this project's companion documentation</li>
        </ul>
      </div>
    </div>`;
  fragment.appendChild(resourceSection);

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

    // TT click → most relevant TrustedTester section page for this SC
    if (ttLabel) {
      lines.push(`  click ${ttId} href "${ttScUrl(num)}" _blank`);
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
  const hash = window.location.hash.slice(1); // e.g. "cards", "diagram", "2.4.11"
  if (!hash) return;

  // If the hash is a known tab name, switch to that tab
  const TAB_VIEWS = ["cards", "diagram", "table", "act", "coverage"];
  if (TAB_VIEWS.includes(hash)) {
    switchView(hash);
    return;
  }

  // Normalise: allow both "2.4.11" and "sc-2_4_11"
  const scNum = hash.replace(/^sc-/, "").replace(/_/g, ".");
  const cardId = `sc-${scNum.replace(/\./g, "_")}`;

  // If we're not on cards view, switch to it (don't overwrite the SC hash)
  if (currentView !== "cards") switchView("cards", false);

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
  document.getElementById("view-description").hidden = show;
  document.getElementById("diagram-view").hidden = show || currentView !== "diagram";
  document.getElementById("cards-view").hidden   = show || currentView !== "cards";
  document.getElementById("table-view").hidden   = show || currentView !== "table";
  document.getElementById("act-view").hidden     = show || currentView !== "act";
  document.getElementById("coverage-view").hidden = show || currentView !== "coverage";
}

function showError(msg) {
  document.getElementById("loading").hidden = true;
  document.getElementById("view-tabs").hidden = true;
  document.getElementById("view-description").hidden = true;
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
