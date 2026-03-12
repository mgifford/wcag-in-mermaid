/**
 * WCAG Spine — QA Checklist Application
 *
 * Loads master_spine.json and renders a per-SC interactive checklist with:
 *  • Automated-tool checks  (ACT Rules, axe-core, Alfa)
 *  • Manual Trusted Tester v5 steps
 *  • ARRM role-based tasks
 *
 * Features:
 *  • URL hash routing  — #1.1.1  or compact form  #111 / #2411
 *  • localStorage persistence of pass / fail / skip / notes per item
 *  • Sequential SC navigation (prev / next buttons, dropdown)
 *  • Export results as JSON or CSV (current SC or all tested SCs)
 */

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const DATA_URL = "data/master_spine.json";

/** localStorage key prefix — increment suffix to bust old cached results */
const STORAGE_PREFIX = "wcag-qa-v1-";

/** Maximum number of ARRM task items to include in the checklist per SC */
const MAX_ARRM_ITEMS = 7;

/** Base URL for the Section 508 Trusted Tester v5 reference site */
const TT_BASE_URL = "https://section508coordinators.github.io/TrustedTester/";

/** Maps WCAG SC numbers to the most relevant TrustedTester section page */
const TT_SC_PAGE = {
  "1.1.1": "images.html",
  "1.2.1": "audiovideo.html",
  "1.2.2": "media.html",
  "1.2.3": "media.html",
  "1.2.4": "media.html",
  "1.2.5": "media.html",
  "1.2.6": "media.html",
  "1.2.7": "media.html",
  "1.2.8": "media.html",
  "1.2.9": "audiovideo.html",
  "1.3.1": "structure.html",
  "1.3.2": "css-content-position.html",
  "1.3.3": "sensory.html",
  "1.3.4": "keyboard.html",
  "1.3.5": "forms.html",
  "1.3.6": "structure.html",
  "1.4.1": "sensory.html",
  "1.4.2": "auto.html",
  "1.4.3": "sensory.html",
  "1.4.4": "resize.html",
  "1.4.5": "images.html",
  "1.4.6": "sensory.html",
  "1.4.7": "sensory.html",
  "1.4.8": "sensory.html",
  "1.4.9": "images.html",
  "1.4.10": "resize.html",
  "1.4.11": "sensory.html",
  "1.4.12": "resize.html",
  "1.4.13": "keyboard.html",
  "2.1.1": "keyboard.html",
  "2.1.2": "keyboard.html",
  "2.1.3": "keyboard.html",
  "2.1.4": "keyboard.html",
  "2.2.1": "timelimits.html",
  "2.2.2": "auto.html",
  "2.2.3": "timelimits.html",
  "2.2.4": "timelimits.html",
  "2.2.5": "timelimits.html",
  "2.2.6": "timelimits.html",
  "2.3.1": "flashing.html",
  "2.3.2": "flashing.html",
  "2.3.3": "flashing.html",
  "2.4.1": "repetitive.html",
  "2.4.2": "titles.html",
  "2.4.3": "keyboard.html",
  "2.4.4": "links.html",
  "2.4.5": "multiple.html",
  "2.4.6": "structure.html",
  "2.4.7": "keyboard.html",
  "2.4.8": "repetitive.html",
  "2.4.9": "links.html",
  "2.4.10": "structure.html",
  "2.4.11": "keyboard.html",
  "2.4.12": "keyboard.html",
  "2.4.13": "keyboard.html",
  "2.5.1": "keyboard.html",
  "2.5.2": "keyboard.html",
  "2.5.3": "forms.html",
  "2.5.4": "keyboard.html",
  "2.5.5": "keyboard.html",
  "2.5.6": "keyboard.html",
  "2.5.7": "keyboard.html",
  "2.5.8": "keyboard.html",
  "3.1.1": "language.html",
  "3.1.2": "language.html",
  "3.1.3": "language.html",
  "3.1.4": "language.html",
  "3.1.5": "language.html",
  "3.1.6": "language.html",
  "3.2.1": "keyboard.html",
  "3.2.2": "forms.html",
  "3.2.3": "repetitive.html",
  "3.2.4": "repetitive.html",
  "3.2.5": "repetitive.html",
  "3.2.6": "repetitive.html",
  "3.3.1": "forms.html",
  "3.3.2": "forms.html",
  "3.3.3": "forms.html",
  "3.3.4": "forms.html",
  "3.3.5": "forms.html",
  "3.3.6": "forms.html",
  "3.3.7": "forms.html",
  "3.3.8": "forms.html",
  "3.3.9": "forms.html",
  "4.1.1": "parsing.html",
  "4.1.2": "forms.html",
  "4.1.3": "forms.html",
};

/** Step-level URL overrides for more precise TT links */
const TT_STEP_PAGE_OVERRIDE = {
  "1.3.1.B": "tables.html",
  "2.4.6.B": "forms.html",
};

/** Maps ARRM role names to W3C WAI role pages */
const ARRM_ROLE_URLS = {
  "Content Authoring":           "https://www.w3.org/WAI/planning/arrm/content-author/",
  "Front-End Development":       "https://www.w3.org/WAI/planning/arrm/front-end/",
  "UX Design":                   "https://www.w3.org/WAI/planning/arrm/user-experience/",
  "User Experience (UX) Design": "https://www.w3.org/WAI/planning/arrm/user-experience/",
  "Visual Design":               "https://www.w3.org/WAI/planning/arrm/visual-designer/",
};

/* ------------------------------------------------------------------ */
/*  State                                                               */
/* ------------------------------------------------------------------ */

/** @type {{ meta: object, success_criteria: Record<string, object> } | null} */
let spineData = null;

/** Sorted array of all SC numbers (e.g. ["1.1.1", "1.2.1", …]) */
let allSCNums = [];

/** Currently displayed SC number */
let currentSC = null;

/* ------------------------------------------------------------------ */
/*  Startup                                                             */
/* ------------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", async () => {
  showLoading(true);
  try {
    spineData = await fetchSpine();
    allSCNums  = sortSCNums(Object.keys(spineData.success_criteria));
    populateSCSelector();
    bindControls();
    showLoading(false);

    const sc = parseSCFromHash() || allSCNums[0];
    navigateToSC(sc, false);
  } catch (err) {
    showError(err.message);
  }
});

window.addEventListener("hashchange", () => {
  const sc = parseSCFromHash();
  if (sc && sc !== currentSC) navigateToSC(sc, false);
});

/* ------------------------------------------------------------------ */
/*  Data fetching                                                       */
/* ------------------------------------------------------------------ */

async function fetchSpine() {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`Failed to load data: ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Sorts SC numbers numerically (1.1.1 < 1.2.1 < 2.4.11 etc.).
 *
 * @param {string[]} nums
 * @returns {string[]}
 */
function sortSCNums(nums) {
  return [...nums].sort((a, b) => {
    const [a1, a2, a3] = a.split(".").map(Number);
    const [b1, b2, b3] = b.split(".").map(Number);
    return a1 - b1 || a2 - b2 || a3 - b3;
  });
}

/* ------------------------------------------------------------------ */
/*  Hash-based navigation                                               */
/* ------------------------------------------------------------------ */

/**
 * Parse a WCAG SC number from the current URL hash.
 *
 * Accepts:
 *  • Standard format  "1.1.1"
 *  • 3-digit compact  "111"  → "1.1.1"
 *  • 4-digit compact  "2411" → "2.4.11"
 *
 * @returns {string|null} SC number or null if hash is empty / unrecognised
 */
function parseSCFromHash() {
  const hash = window.location.hash.slice(1).trim();
  if (!hash) return null;

  if (/^\d+\.\d+\.\d+$/.test(hash)) {
    return spineData?.success_criteria[hash] ? hash : null;
  }

  if (/^\d{3}$/.test(hash)) {
    const sc = `${hash[0]}.${hash[1]}.${hash[2]}`;
    return spineData?.success_criteria[sc] ? sc : null;
  }

  if (/^\d{4}$/.test(hash)) {
    const sc = `${hash[0]}.${hash[1]}.${hash.slice(2)}`;
    return spineData?.success_criteria[sc] ? sc : null;
  }

  return null;
}

/**
 * Navigate to the given SC: update hash, selector, render checklist,
 * and update prev/next button states.
 *
 * @param {string}  scNum       SC number in "X.Y.Z" format
 * @param {boolean} updateHash  Whether to push the new hash to the URL
 */
function navigateToSC(scNum, updateHash = true) {
  if (!spineData?.success_criteria[scNum]) return;

  currentSC = scNum;

  if (updateHash) {
    history.replaceState(null, "", `#${scNum}`);
  }

  const sel = document.getElementById("qa-sc-select");
  if (sel) sel.value = scNum;

  updateNavButtons();
  renderChecklist(scNum);

  // Update page title for browser history
  const entry = spineData.success_criteria[scNum];
  document.title = `QA: ${scNum} ${entry.title} — WCAG Spine`;
}

/* ------------------------------------------------------------------ */
/*  Checklist generation                                                */
/* ------------------------------------------------------------------ */

/**
 * Build the ordered list of test items for a given SC.
 *
 * Sections (in order):
 *  1. Automated tests — one item per tool that has mapped rules
 *  2. Manual Trusted Tester v5 steps — one item per TT step
 *  3. ARRM role tasks — up to MAX_ARRM_ITEMS items
 *
 * @param {string} scNum
 * @param {object} entry  SC entry from master_spine.json
 * @returns {Array<{id, section, canAutomate, tool, label, description, links}>}
 */
function generateChecklistItems(scNum, entry) {
  const items = [];
  const a = entry.automation ?? {};
  const m = entry.manual     ?? {};

  const axeIds    = a.axe  ?? [];
  const alfaIds   = a.alfa ?? [];
  const actIds    = a.act  ?? [];
  const ttSteps   = m.tt_steps   ?? [];
  const arrmTasks = m.arrm_tasks ?? [];

  /* ---- Section 1: Automated tests ---------------------------------- */

  if (axeIds.length > 0) {
    const preview = axeIds.slice(0, 5).join(", ") + (axeIds.length > 5 ? ` +${axeIds.length - 5} more` : "");
    items.push({
      id:           "auto-axe",
      section:      "automated",
      canAutomate:  true,
      tool:         "axe-core",
      label:        "Run axe-core automated scan — verify zero violations",
      description:  `Rules: ${preview}`,
      links:        axeIds.map(id => ({ label: `axe:${id}`, url: axeRuleUrl(id) })),
    });
  }

  if (alfaIds.length > 0) {
    items.push({
      id:           "auto-alfa",
      section:      "automated",
      canAutomate:  true,
      tool:         "Alfa (Siteimprove)",
      label:        "Run Alfa automated scan — verify zero violations",
      description:  `Rules: ${alfaIds.join(", ")}`,
      links:        alfaIds.map(id => ({ label: id, url: alfaRuleUrl(id) })),
    });
  }

  if (actIds.length > 0) {
    const preview = actIds.slice(0, 5).join(", ") + (actIds.length > 5 ? ` +${actIds.length - 5} more` : "");
    items.push({
      id:           "auto-act",
      section:      "automated",
      canAutomate:  true,
      tool:         "W3C ACT Rules",
      label:        "Verify W3C ACT rules pass for this Success Criterion",
      description:  `Rules: ${preview}`,
      links:        actIds.map(id => ({
        label: `ACT:${id}`,
        url:   `https://www.w3.org/WAI/standards-guidelines/act/rules/${encodeURIComponent(id)}/`,
      })),
    });
  }

  /* ---- Section 2: Trusted Tester manual steps ---------------------- */

  for (const step of ttSteps) {
    const stepId = step.split(" - ")[0];
    items.push({
      id:           `tt-${stepId}`,
      section:      "manual-tt",
      canAutomate:  false,
      tool:         "Trusted Tester v5",
      label:        step,
      description:  null,
      links:        [{ label: `TT: ${stepId}`, url: ttStepUrl(stepId) }],
    });
  }

  /* ---- Section 3: ARRM role tasks ---------------------------------- */

  for (const task of arrmTasks.slice(0, MAX_ARRM_ITEMS)) {
    const roleUrl = ARRM_ROLE_URLS[task.primary_ownership] ?? task.role_url ?? null;
    items.push({
      id:           `arrm-${task.id}`,
      section:      "manual-arrm",
      canAutomate:  false,
      tool:         task.primary_ownership,
      label:        `${task.id}: ${task.task}`,
      description:  task.secondary_ownership
                      ? `Also involves: ${task.secondary_ownership}`
                      : null,
      links: [
        { label: task.id, url: task.category_url },
        ...(roleUrl ? [{ label: task.primary_ownership, url: roleUrl }] : []),
      ],
    });
  }

  return items;
}

/* ------------------------------------------------------------------ */
/*  Rendering                                                           */
/* ------------------------------------------------------------------ */

/**
 * Full render of the checklist for the given SC.
 * Populates #qa-main.
 *
 * @param {string} scNum
 */
function renderChecklist(scNum) {
  const entry   = spineData.success_criteria[scNum];
  const items   = generateChecklistItems(scNum, entry);
  const results = loadResults(scNum);

  const main = document.getElementById("qa-main");
  main.innerHTML = "";

  main.appendChild(buildSCHeader(scNum, entry));
  main.appendChild(buildProgress(items, results));

  const SECTIONS = [
    {
      id:         "automated",
      title:      "🤖 Automated Tests",
      badge:      "Automated",
      badgeClass: "qa-badge-auto",
      note:       "Run with automated tools — highlight rules that do and do not fire.",
    },
    {
      id:         "manual-tt",
      title:      "🔬 Manual Tests — Trusted Tester v5",
      badge:      "Manual",
      badgeClass: "qa-badge-manual",
      note:       "Requires human judgement; these aspects cannot be fully automated.",
    },
    {
      id:         "manual-arrm",
      title:      "👤 Role Tasks — ARRM",
      badge:      "Manual",
      badgeClass: "qa-badge-manual",
      note:       "Responsibilities mapped to roles by the W3C Accessibility ARRM.",
    },
  ];

  for (const sec of SECTIONS) {
    const sectionItems = items.filter(i => i.section === sec.id);
    if (sectionItems.length === 0) continue;
    main.appendChild(buildSection(scNum, sec, sectionItems, results));
  }

  main.appendChild(buildActionsFooter(scNum));

  // Update position counter
  updateSCPosition();
}

/**
 * Build the SC header bar (dark blue, shows number, title, level, principle).
 *
 * @param {string} scNum
 * @param {object} entry
 * @returns {HTMLElement}
 */
function buildSCHeader(scNum, entry) {
  const div = document.createElement("div");
  div.className = "qa-sc-header";
  div.setAttribute("aria-labelledby", "qa-sc-heading");
  div.innerHTML = `
    <div class="qa-sc-meta">
      <span class="qa-sc-num" aria-label="Success Criterion ${escapeHTML(scNum)}">${escapeHTML(scNum)}</span>
      <span class="qa-sc-title" id="qa-sc-heading">
        <a href="${escapeAttr(entry.url ?? "#")}" target="_blank" rel="noopener noreferrer">
          ${escapeHTML(entry.title)}
        </a>
      </span>
      <span class="level-badge level-${escapeHTML(entry.level)}" aria-label="Level ${escapeHTML(entry.level)}">
        ${escapeHTML(entry.level)}
      </span>
    </div>
    <p class="qa-sc-principle">
      ${escapeHTML(entry.principle ?? "")} —
      <a href="${escapeAttr(entry.url ?? "#")}" target="_blank" rel="noopener noreferrer" style="color:rgba(255,255,255,.85)">
        WCAG Understanding document
      </a>
    </p>`;
  return div;
}

/**
 * Build the progress bar section.
 *
 * @param {Array}  items
 * @param {object} results  localStorage results map
 * @returns {HTMLElement}
 */
function buildProgress(items, results) {
  const total   = items.length;
  const passed  = items.filter(i => results[i.id]?.status === "pass").length;
  const failed  = items.filter(i => results[i.id]?.status === "fail").length;
  const skipped = items.filter(i => results[i.id]?.status === "skip").length;
  const tested  = passed + failed + skipped;
  const pct     = total > 0 ? Math.round(tested / total * 100) : 0;

  const div = document.createElement("div");
  div.className = "qa-progress";
  div.id = "qa-progress";
  div.setAttribute("role", "status");
  div.setAttribute("aria-label",
    `Testing progress: ${tested} of ${total} items completed. ${passed} pass, ${failed} fail, ${skipped} skip.`);
  div.innerHTML = `
    <span class="qa-progress-label">${tested}/${total} tested (${pct}%)</span>
    <div class="qa-progress-track" aria-hidden="true">
      <div class="qa-progress-fill" style="width:${pct}%"></div>
    </div>
    <div class="qa-progress-stats" aria-hidden="true">
      <span class="qa-stat-pass">✅ ${passed} pass</span>
      <span class="qa-stat-fail">❌ ${failed} fail</span>
      <span class="qa-stat-skip">⏭️ ${skipped} skip</span>
      ${total === 0 ? "" : `<span class="qa-stat-pct">${pct}% complete</span>`}
    </div>`;
  return div;
}

/**
 * Build a checklist section (e.g. "Automated Tests").
 *
 * @param {string}  scNum
 * @param {object}  section   Section descriptor
 * @param {Array}   items     Items belonging to this section
 * @param {object}  results   Results map for current SC
 * @returns {HTMLElement}
 */
function buildSection(scNum, section, items, results) {
  const el = document.createElement("section");
  el.className = "qa-section";
  el.setAttribute("aria-labelledby", `qa-sec-heading-${escapeAttr(section.id)}`);

  el.innerHTML = `
    <div class="qa-section-header">
      <h2 id="qa-sec-heading-${escapeAttr(section.id)}" class="qa-section-title">${section.title}</h2>
      <span class="qa-section-badge ${escapeHTML(section.badgeClass)}">${escapeHTML(section.badge)}</span>
      <span class="qa-section-note">${escapeHTML(section.note)}</span>
    </div>
    <div class="qa-item-list" role="list"></div>`;

  const list = el.querySelector(".qa-item-list");
  for (const item of items) {
    list.appendChild(buildItem(scNum, item, results[item.id]));
  }

  return el;
}

/**
 * Build a single checklist item with pass/fail/skip buttons and a notes textarea.
 *
 * @param {string}       scNum
 * @param {object}       item
 * @param {object|undefined} result  Existing result from localStorage
 * @returns {HTMLElement}
 */
function buildItem(scNum, item, result) {
  const status = result?.status ?? null;
  const notes  = result?.notes  ?? "";

  const el = document.createElement("div");
  el.className  = `qa-item${status ? ` qa-item-${escapeHTML(status)}` : ""}`;
  el.setAttribute("role", "listitem");
  el.dataset.itemId = item.id;

  const htmlId  = `qa-item-${item.id.replace(/[^a-z0-9]/gi, "_")}`;
  const notesId = `${htmlId}-notes`;

  const toolClass = item.canAutomate ? "qa-item-tool-auto" : "qa-item-tool-manual";

  const linksHtml = item.links.map(l =>
    `<a class="qa-item-link" href="${escapeAttr(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(l.label)}</a>`
  ).join(" &middot; ");

  el.innerHTML = `
    <div class="qa-status-group" role="group" aria-label="Status for: ${escapeAttr(item.label)}">
      <button class="qa-status-btn${status === "pass" ? " active-pass" : ""}"
        data-status="pass"
        aria-pressed="${status === "pass"}"
        aria-label="Pass"
        title="Mark as Pass">✅</button>
      <button class="qa-status-btn${status === "fail" ? " active-fail" : ""}"
        data-status="fail"
        aria-pressed="${status === "fail"}"
        aria-label="Fail"
        title="Mark as Fail">❌</button>
      <button class="qa-status-btn${status === "skip" ? " active-skip" : ""}"
        data-status="skip"
        aria-pressed="${status === "skip"}"
        aria-label="Skip"
        title="Skip this item">⏭️</button>
    </div>
    <div class="qa-item-content">
      <p class="qa-item-label">${escapeHTML(item.label)}</p>
      ${item.description ? `<p class="qa-item-desc">${escapeHTML(item.description)}</p>` : ""}
      <div class="qa-item-meta">
        <span class="qa-item-tool ${escapeHTML(toolClass)}">${escapeHTML(item.tool)}</span>
        ${linksHtml}
      </div>
      <label for="${escapeAttr(notesId)}" class="visually-hidden">
        Notes for: ${escapeAttr(item.label)}
      </label>
      <textarea
        id="${escapeAttr(notesId)}"
        class="qa-item-notes"
        placeholder="Add notes, observations, or failure details…"
        rows="2"
      >${escapeHTML(notes)}</textarea>
    </div>`;

  /* Status button events */
  el.querySelectorAll(".qa-status-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const clicked = btn.dataset.status;
      // Clicking the active status clears it (toggle behaviour)
      const finalStatus = status === clicked ? null : clicked;
      handleStatusChange(scNum, item.id, finalStatus);
    });
  });

  /* Notes textarea — debounced save */
  let notesTimer;
  el.querySelector(".qa-item-notes").addEventListener("input", e => {
    clearTimeout(notesTimer);
    notesTimer = setTimeout(() => {
      handleNotesChange(scNum, item.id, e.target.value);
    }, 500);
  });

  return el;
}

/**
 * Build the export / reset footer bar at the bottom of the checklist.
 *
 * @param {string} scNum
 * @returns {HTMLElement}
 */
function buildActionsFooter(scNum) {
  const div = document.createElement("div");
  div.className = "qa-actions-footer";
  div.setAttribute("role", "group");
  div.setAttribute("aria-label", "Export and reset checklist results");
  div.innerHTML = `
    <div class="qa-actions-group">
      <span class="qa-actions-label">Export results:</span>
      <button class="qa-action-btn" data-action="json-sc">📥 JSON (this SC)</button>
      <button class="qa-action-btn" data-action="csv-sc">📊 CSV (this SC)</button>
      <button class="qa-action-btn" data-action="json-all">📦 JSON (all SCs)</button>
      <button class="qa-action-btn" data-action="csv-all">📊 CSV (all SCs)</button>
    </div>
    <div class="qa-actions-group">
      <button class="qa-action-btn qa-btn-danger" data-action="reset">🗑️ Reset this SC</button>
    </div>`;

  div.querySelector('[data-action="json-sc"]').addEventListener("click",  () => exportJSON(scNum));
  div.querySelector('[data-action="csv-sc"]').addEventListener("click",   () => exportCSV(scNum));
  div.querySelector('[data-action="json-all"]').addEventListener("click", () => exportAllJSON());
  div.querySelector('[data-action="csv-all"]').addEventListener("click",  () => exportAllCSV());
  div.querySelector('[data-action="reset"]').addEventListener("click", () => {
    if (confirm(`Clear all test results for SC ${scNum}?`)) {
      resetResults(scNum);
      renderChecklist(scNum);
      announce("Results cleared.");
    }
  });

  return div;
}

/* ------------------------------------------------------------------ */
/*  In-place status update                                              */
/* ------------------------------------------------------------------ */

/**
 * Update a single checklist item element in-place after a status change,
 * without re-rendering the full checklist (preserves textarea content).
 *
 * @param {string}      itemId
 * @param {string|null} status  "pass" | "fail" | "skip" | null
 */
function updateItemElement(itemId, status) {
  const selector = `[data-item-id="${itemId.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"]`;
  const itemEl = document.querySelector(selector);
  if (!itemEl) return;

  // Update background colour
  itemEl.className = `qa-item${status ? ` qa-item-${status}` : ""}`;
  itemEl.dataset.itemId = itemId; // restore data attribute

  // Update button states
  itemEl.querySelectorAll(".qa-status-btn").forEach(btn => {
    const s = btn.dataset.status;
    btn.classList.toggle("active-pass", s === "pass" && status === "pass");
    btn.classList.toggle("active-fail", s === "fail" && status === "fail");
    btn.classList.toggle("active-skip", s === "skip" && status === "skip");
    btn.setAttribute("aria-pressed", String(s === status));
  });
}

/**
 * Re-render only the progress bar without touching checklist items.
 *
 * @param {string} scNum
 */
function refreshProgress(scNum) {
  const entry   = spineData.success_criteria[scNum];
  const items   = generateChecklistItems(scNum, entry);
  const results = loadResults(scNum);
  const oldBar  = document.getElementById("qa-progress");
  if (!oldBar) return;
  const newBar = buildProgress(items, results);
  oldBar.replaceWith(newBar);
}

/* ------------------------------------------------------------------ */
/*  State management                                                    */
/* ------------------------------------------------------------------ */

function getStorageKey(scNum) {
  return `${STORAGE_PREFIX}${scNum}`;
}

/**
 * Load the results object for a given SC from localStorage.
 *
 * @param {string} scNum
 * @returns {Record<string, {status: string, notes: string, timestamp: string}>}
 */
function loadResults(scNum) {
  try {
    const raw = localStorage.getItem(getStorageKey(scNum));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Persist results to localStorage.
 *
 * @param {string} scNum
 * @param {object} results
 */
function saveResults(scNum, results) {
  try {
    localStorage.setItem(getStorageKey(scNum), JSON.stringify(results));
  } catch (e) {
    console.warn("localStorage write failed:", e);
  }
}

/**
 * Handle a status button click: persist change and update UI in-place.
 *
 * @param {string}      scNum
 * @param {string}      itemId
 * @param {string|null} status  New status or null to clear
 */
function handleStatusChange(scNum, itemId, status) {
  const results = loadResults(scNum);

  if (status === null) {
    delete results[itemId];
  } else {
    results[itemId] = {
      ...results[itemId],
      status,
      timestamp: new Date().toISOString(),
    };
  }

  saveResults(scNum, results);
  updateItemElement(itemId, status);
  refreshProgress(scNum);
  announce(status ? `Marked as ${status}.` : "Status cleared.");
}

/**
 * Handle a notes textarea change: persist notes without re-rendering.
 *
 * @param {string} scNum
 * @param {string} itemId
 * @param {string} notes
 */
function handleNotesChange(scNum, itemId, notes) {
  const results = loadResults(scNum);
  results[itemId] = {
    ...results[itemId],
    notes,
    timestamp: results[itemId]?.timestamp ?? new Date().toISOString(),
  };
  saveResults(scNum, results);
}

/**
 * Remove all saved results for a given SC.
 *
 * @param {string} scNum
 */
function resetResults(scNum) {
  try {
    localStorage.removeItem(getStorageKey(scNum));
  } catch (e) {
    console.warn("localStorage remove failed:", e);
  }
}

/* ------------------------------------------------------------------ */
/*  Export                                                              */
/* ------------------------------------------------------------------ */

/**
 * Export JSON results for a single SC.
 *
 * @param {string} scNum
 */
function exportJSON(scNum) {
  const entry   = spineData.success_criteria[scNum];
  const results = loadResults(scNum);
  const items   = generateChecklistItems(scNum, entry);

  const data = {
    exported:  new Date().toISOString(),
    tool:      "WCAG Spine QA Checklist",
    sc:        scNum,
    title:     entry.title,
    level:     entry.level,
    principle: entry.principle ?? "",
    url:       entry.url ?? "",
    items: items.map(item => ({
      id:          item.id,
      section:     item.section,
      canAutomate: item.canAutomate,
      tool:        item.tool,
      label:       item.label,
      status:      results[item.id]?.status    ?? "not-tested",
      notes:       results[item.id]?.notes     ?? "",
      timestamp:   results[item.id]?.timestamp ?? null,
    })),
  };

  downloadFile(
    JSON.stringify(data, null, 2),
    `wcag-qa-${scNum.replace(/\./g, "")}.json`,
    "application/json"
  );
}

/**
 * Export CSV results for a single SC.
 *
 * @param {string} scNum
 */
function exportCSV(scNum) {
  const entry   = spineData.success_criteria[scNum];
  const results = loadResults(scNum);
  const items   = generateChecklistItems(scNum, entry);

  const rows = [[
    "SC", "Title", "Level", "Principle",
    "Test ID", "Section", "Can Automate", "Tool", "Test Description",
    "Status", "Notes", "Timestamp",
  ]];

  for (const item of items) {
    const r = results[item.id] ?? {};
    rows.push([
      scNum,
      entry.title,
      entry.level,
      entry.principle ?? "",
      item.id,
      item.section,
      item.canAutomate ? "yes" : "no",
      item.tool,
      item.label,
      r.status    ?? "not-tested",
      r.notes     ?? "",
      r.timestamp ?? "",
    ]);
  }

  downloadFile(
    rowsToCSV(rows),
    `wcag-qa-${scNum.replace(/\./g, "")}.csv`,
    "text/csv;charset=utf-8"
  );
}

/**
 * Export JSON results for all SCs that have at least one recorded result.
 */
function exportAllJSON() {
  const exportData = {
    exported: new Date().toISOString(),
    tool:     "WCAG Spine QA Checklist",
    results:  [],
  };

  for (const scNum of allSCNums) {
    const results = loadResults(scNum);
    if (Object.keys(results).length === 0) continue;

    const entry = spineData.success_criteria[scNum];
    const items = generateChecklistItems(scNum, entry);

    exportData.results.push({
      sc:        scNum,
      title:     entry.title,
      level:     entry.level,
      principle: entry.principle ?? "",
      items: items.map(item => ({
        id:        item.id,
        section:   item.section,
        label:     item.label,
        status:    results[item.id]?.status    ?? "not-tested",
        notes:     results[item.id]?.notes     ?? "",
        timestamp: results[item.id]?.timestamp ?? null,
      })),
    });
  }

  downloadFile(
    JSON.stringify(exportData, null, 2),
    "wcag-qa-all-results.json",
    "application/json"
  );
}

/**
 * Export CSV results for all SCs that have at least one recorded result.
 */
function exportAllCSV() {
  const rows = [[
    "SC", "Title", "Level", "Principle",
    "Test ID", "Section", "Can Automate", "Tool", "Test Description",
    "Status", "Notes", "Timestamp",
  ]];

  for (const scNum of allSCNums) {
    const results = loadResults(scNum);
    if (Object.keys(results).length === 0) continue;

    const entry = spineData.success_criteria[scNum];
    const items = generateChecklistItems(scNum, entry);

    for (const item of items) {
      const r = results[item.id] ?? {};
      rows.push([
        scNum,
        entry.title,
        entry.level,
        entry.principle ?? "",
        item.id,
        item.section,
        item.canAutomate ? "yes" : "no",
        item.tool,
        item.label,
        r.status    ?? "not-tested",
        r.notes     ?? "",
        r.timestamp ?? "",
      ]);
    }
  }

  downloadFile(
    rowsToCSV(rows),
    "wcag-qa-all-results.csv",
    "text/csv;charset=utf-8"
  );
}

/**
 * Convert a 2-D array of strings into a RFC 4180-compliant CSV string.
 *
 * @param {string[][]} rows
 * @returns {string}
 */
function rowsToCSV(rows) {
  return rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  ).join("\r\n");
}

/**
 * Trigger a file download in the browser.
 *
 * @param {string} content
 * @param {string} filename
 * @param {string} mimeType
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/*  Navigation controls                                                 */
/* ------------------------------------------------------------------ */

/**
 * Populate the SC dropdown with all available Success Criteria.
 */
function populateSCSelector() {
  const sel = document.getElementById("qa-sc-select");
  sel.innerHTML = "";
  for (const scNum of allSCNums) {
    const entry = spineData.success_criteria[scNum];
    const opt   = document.createElement("option");
    opt.value   = scNum;
    opt.textContent = `${scNum} — ${entry.title} (Level ${entry.level})`;
    sel.appendChild(opt);
  }
}

/**
 * Bind event listeners for all persistent controls (top bar buttons and
 * the header export/reset buttons).
 */
function bindControls() {
  document.getElementById("qa-sc-select").addEventListener("change", e => {
    navigateToSC(e.target.value);
  });

  document.getElementById("qa-prev-btn").addEventListener("click", () => {
    const idx = allSCNums.indexOf(currentSC);
    if (idx > 0) navigateToSC(allSCNums[idx - 1]);
  });

  document.getElementById("qa-next-btn").addEventListener("click", () => {
    const idx = allSCNums.indexOf(currentSC);
    if (idx < allSCNums.length - 1) navigateToSC(allSCNums[idx + 1]);
  });

  // Controls bar export / reset buttons
  document.getElementById("qa-export-json-btn").addEventListener("click",     () => exportJSON(currentSC));
  document.getElementById("qa-export-csv-btn").addEventListener("click",      () => exportCSV(currentSC));
  document.getElementById("qa-export-all-json-btn").addEventListener("click", () => exportAllJSON());
  document.getElementById("qa-export-all-csv-btn").addEventListener("click",  () => exportAllCSV());
  document.getElementById("qa-reset-btn").addEventListener("click", () => {
    if (confirm(`Clear all test results for SC ${currentSC}?`)) {
      resetResults(currentSC);
      renderChecklist(currentSC);
      announce("Results cleared.");
    }
  });
}

/**
 * Enable/disable prev/next buttons based on current position.
 */
function updateNavButtons() {
  const idx = allSCNums.indexOf(currentSC);
  document.getElementById("qa-prev-btn").disabled = idx <= 0;
  document.getElementById("qa-next-btn").disabled = idx >= allSCNums.length - 1;
}

/**
 * Update the "X of Y" position counter.
 */
function updateSCPosition() {
  const idx = allSCNums.indexOf(currentSC);
  const el  = document.getElementById("qa-sc-position");
  if (el) el.textContent = `${idx + 1} of ${allSCNums.length}`;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function showLoading(show) {
  document.getElementById("qa-loading").hidden = !show;
  document.getElementById("qa-controls").hidden = show;
}

function showError(msg) {
  document.getElementById("qa-loading").hidden = true;
  document.getElementById("qa-controls").hidden = true;
  document.getElementById("qa-main").innerHTML = `
    <div class="empty-state" role="alert">
      <h2>⚠️ Error loading data</h2>
      <p>${escapeHTML(msg)}</p>
      <p>Please check the browser console for details.</p>
    </div>`;
}

/**
 * Post a message to the ARIA live region for screen-reader announcements.
 *
 * @param {string} msg
 */
function announce(msg) {
  const el = document.getElementById("qa-status-announcer");
  if (!el) return;
  el.textContent = "";
  // Tiny delay ensures the change is picked up by screen readers.
  requestAnimationFrame(() => { el.textContent = msg; });
}

function axeRuleUrl(ruleId) {
  const version = spineData?.meta?.axe_version ?? "4.11";
  return `https://dequeuniversity.com/rules/axe/${encodeURIComponent(version)}/${encodeURIComponent(ruleId)}`;
}

function alfaRuleUrl(ruleId) {
  return `https://alfa.siteimprove.com/rules/${encodeURIComponent(ruleId.toLowerCase())}`;
}

function ttStepUrl(stepId) {
  if (TT_STEP_PAGE_OVERRIDE[stepId]) {
    return TT_BASE_URL + TT_STEP_PAGE_OVERRIDE[stepId];
  }
  const sc = stepId.split(".").slice(0, 3).join(".");
  return TT_BASE_URL + (TT_SC_PAGE[sc] ?? "appendixa.html");
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#39;");
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
}
