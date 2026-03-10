#!/usr/bin/env python3
"""
WCAG Mirror Spine - Data Orchestrator
Synchronizes data from W3C ARRM, ACT Rules, Axe-core, and Alfa
to produce a consolidated master_spine.json covering all WCAG 2.2 SCs.

Data sources
------------
- W3C ACT Rules JSON (rules.json)         — ACT rule IDs and their WCAG SC mappings
- W3C ACT testcases JSON (testcases.json) — richer SC mappings, including secondary SCs
- Alfa rule index (TypeScript source)     — Alfa rule IDs and their WCAG Criterion mappings
- axe-core rules directory (JSON)         — axe rule IDs and their WCAG tag mappings
- W3C ARRM CSV files                      — responsible roles and task ownership per SC
- DHS Trusted Tester v5 HTML             — step-by-step federal test procedures per SC
"""

import csv
import json
import re
import sys
import urllib.request
import urllib.error
from io import StringIO
from pathlib import Path
from datetime import date

# ---------------------------------------------------------------------------
# Source URLs
# ---------------------------------------------------------------------------
ARRM_ALL_TASKS_URL = (
    "https://raw.githubusercontent.com/w3c/wai-arrm/draft/_data/arrm/arrm-all-tasks.csv"
)
ARRM_WCAG_SC_URL = (
    "https://raw.githubusercontent.com/w3c/wai-arrm/draft/_data/arrm/arrm-wcag-sc.csv"
)
# Machine-readable WCAG-to-ACT mapping published by W3C in the wcag-act-rules GitHub repo.
# This replaced the former rules.json endpoint at
#   https://www.w3.org/WAI/standards-guidelines/act/rules/data/rules.json
# which is no longer available.  Each entry includes an "accessibility_requirements" dict
# with keys like "wcag20:1.3.1" / "wcag21:1.3.5" (primary and secondary SCs).
ACT_RULES_URL = (
    "https://raw.githubusercontent.com/w3c/wcag-act-rules/main/wcag-mapping.json"
)
# W3C ACT testcases JSON — supplemental secondary-SC coverage.  The wcag-mapping.json
# already includes secondary requirements via accessibility_requirements, so this source
# is now a secondary enrichment only.  Fetch failures are handled gracefully.
ACT_TESTCASES_URL = (
    "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases.json"
)
# Alfa rules TypeScript index — exports every Alfa rule with its WCAG Criterion mapping.
# Parsing Criterion.of("X.Y.Z") calls gives us a direct SC→Alfa-rule-ID map.
ALFA_RULES_INDEX_URL = (
    "https://raw.githubusercontent.com/Siteimprove/alfa/main/packages/alfa-rules/src/index.ts"
)
# Alfa EARL implementation report — maps Alfa rules to ACT rules (all consistency
# levels, including partial/semi-automated implementations).
ALFA_ACT_EARL_URL = (
    "https://raw.githubusercontent.com/Siteimprove/alfa-act-r/main/reports/alfa-automated-report.json"
)
# axe-core GitHub raw rules directory listing (GitHub API JSON).
# Each entry names a JSON rule file; fetching select files gives us WCAG tags.
AXE_RULES_API_URL = (
    "https://api.github.com/repos/dequelabs/axe-core/contents/lib/rules"
)
# Fallback: fetch the compiled axe.js and regex-parse rule metadata when the API
# listing + individual file strategy is blocked or rate-limited.
AXE_CORE_JS_URL = (
    "https://raw.githubusercontent.com/dequelabs/axe-core/develop/axe.js"
)
TT_IMPLEMENTATIONS_URL = (
    "https://section508coordinators.github.io/TrustedTester/index.html"
)
# Section 508 Coordinator resources: https://github.com/Section508Coordinators

TT_BASE_URL = "https://section508coordinators.github.io/TrustedTester/"

# Maps each WCAG SC number to the most relevant TrustedTester section page.
# SCs not covered by TT v5 (WCAG 2.1/2.2 or AAA) are mapped to the closest
# equivalent section.  Source: appendixa.html cross-reference table.
TT_SC_PAGE: dict[str, str] = {
    # 1.1 – Text Alternatives
    "1.1.1": "images.html",
    # 1.2 – Time-based Media
    "1.2.1": "audiovideo.html",
    "1.2.2": "media.html",
    "1.2.3": "media.html",
    "1.2.4": "media.html",
    "1.2.5": "media.html",
    "1.2.6": "media.html",
    "1.2.7": "media.html",
    "1.2.8": "media.html",
    "1.2.9": "audiovideo.html",
    # 1.3 – Adaptable
    "1.3.1": "structure.html",
    "1.3.2": "css-content-position.html",
    "1.3.3": "sensory.html",
    "1.3.4": "keyboard.html",
    "1.3.5": "forms.html",
    "1.3.6": "structure.html",
    # 1.4 – Distinguishable
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
    # 2.1 – Keyboard Accessible
    "2.1.1": "keyboard.html",
    "2.1.2": "keyboard.html",
    "2.1.3": "keyboard.html",
    "2.1.4": "keyboard.html",
    # 2.2 – Enough Time
    "2.2.1": "timelimits.html",
    "2.2.2": "auto.html",
    "2.2.3": "timelimits.html",
    "2.2.4": "timelimits.html",
    "2.2.5": "timelimits.html",
    "2.2.6": "timelimits.html",
    # 2.3 – Seizures and Physical Reactions
    "2.3.1": "flashing.html",
    "2.3.2": "flashing.html",
    "2.3.3": "flashing.html",
    # 2.4 – Navigable
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
    # 2.5 – Input Modalities
    "2.5.1": "keyboard.html",
    "2.5.2": "keyboard.html",
    "2.5.3": "forms.html",
    "2.5.4": "keyboard.html",
    "2.5.5": "keyboard.html",
    "2.5.6": "keyboard.html",
    "2.5.7": "keyboard.html",
    "2.5.8": "keyboard.html",
    # 3.1 – Readable
    "3.1.1": "language.html",
    "3.1.2": "language.html",
    "3.1.3": "language.html",
    "3.1.4": "language.html",
    "3.1.5": "language.html",
    "3.1.6": "language.html",
    # 3.2 – Predictable
    "3.2.1": "keyboard.html",
    "3.2.2": "forms.html",
    "3.2.3": "repetitive.html",
    "3.2.4": "repetitive.html",
    "3.2.5": "repetitive.html",
    "3.2.6": "repetitive.html",
    # 3.3 – Input Assistance
    "3.3.1": "forms.html",
    "3.3.2": "forms.html",
    "3.3.3": "forms.html",
    "3.3.4": "forms.html",
    "3.3.5": "forms.html",
    "3.3.6": "forms.html",
    "3.3.7": "forms.html",
    "3.3.8": "forms.html",
    "3.3.9": "forms.html",
    # 4.1 – Compatible
    "4.1.1": "parsing.html",
    "4.1.2": "forms.html",
    "4.1.3": "forms.html",
}


def _tt_sc_url(sc_num: str) -> str:
    """Return the full TrustedTester URL for a WCAG SC number (e.g. '1.4.2').

    Falls back to appendixa.html for any SC not present in TT_SC_PAGE.

    Note: Mermaid diagram TT nodes represent all test steps for an SC at once,
    so only SC-level URLs are needed here.  Step-level overrides (e.g. 1.3.1.B
    → tables.html) are handled by ttStepUrl() in assets/js/app.js for the
    Cards and Table views.
    """
    return TT_BASE_URL + TT_SC_PAGE.get(sc_num, "appendixa.html")

# npm registry endpoint to resolve the latest published axe-core version
AXE_NPM_DIST_TAGS_URL = "https://registry.npmjs.org/-/package/axe-core/dist-tags"

# Fallback axe-core version used when the npm registry is unreachable
AXE_VERSION_FALLBACK = "4.11"

# npm registry endpoint to resolve the latest published Alfa version
ALFA_NPM_DIST_TAGS_URL = (
    "https://registry.npmjs.org/-/package/@siteimprove/alfa-rules/dist-tags"
)

# ---------------------------------------------------------------------------
# ARRM URL mappings
# ---------------------------------------------------------------------------
ARRM_BASE_URL = "https://www.w3.org/WAI/planning/arrm"

# Maps the task ID prefix (e.g. "IMG") to the anchor on the ARRM tasks page.
# Headings come from https://www.w3.org/WAI/planning/arrm/tasks/
ARRM_TASK_CATEGORY_URLS: dict[str, str] = {
    "IMG": f"{ARRM_BASE_URL}/tasks/#images-and-graphs",
    "SEM": f"{ARRM_BASE_URL}/tasks/#semantic-structure",
    "INP": f"{ARRM_BASE_URL}/tasks/#input-modalities",
    "FRM": f"{ARRM_BASE_URL}/tasks/#form-interactions",
    "CSS": f"{ARRM_BASE_URL}/tasks/#css-and-presentation",
    "NAV": f"{ARRM_BASE_URL}/tasks/#navigation",
    "TAB": f"{ARRM_BASE_URL}/tasks/#data-tables",
    "ANM": f"{ARRM_BASE_URL}/tasks/#animation-and-movement",
    "SCT": f"{ARRM_BASE_URL}/tasks/#static-content",
    "DYN": f"{ARRM_BASE_URL}/tasks/#dynamic-interactions",
}

# Maps the Primary Ownership role name to the ARRM role-specific page.
ARRM_ROLE_URLS: dict[str, str] = {
    "Content Authoring":          f"{ARRM_BASE_URL}/content-author/",
    "Front-End Development":      f"{ARRM_BASE_URL}/front-end/",
    "User Experience (UX) Design": f"{ARRM_BASE_URL}/user-experience/",
    "Visual Design":              f"{ARRM_BASE_URL}/visual-designer/",
}

# Maps role names (as they appear in master_spine.json manual.roles) to short
# abbreviations used as Mermaid node-ID suffixes.  Both the short form used by
# arrm-wcag-sc.csv and the long form used by arrm-all-tasks.csv are listed so
# that either can appear in the data without breaking node-ID generation.
ROLE_ABBREVIATIONS: dict[str, str] = {
    "Business":                    "BUS",
    "Content Authoring":           "CA",
    "Front-End Development":       "FE",
    "UX Design":                   "UX",
    "User Experience (UX) Design": "UX",
    "User Experience Design":      "UX",
    "Visual Design":               "VD",
}

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
SEED_FILE = DATA_DIR / "master_spine.json"
OUTPUT_FILE = DATA_DIR / "master_spine.json"
MERMAID_FILE = REPO_ROOT / "wcag-sc-roles-diagram.md"

# Per-principle diagram files (split to stay within GitHub's Mermaid size limit)
MERMAID_PRINCIPLE_FILES: dict[str, Path] = {
    "1": REPO_ROOT / "wcag-perceivable-diagram.md",
    "2": REPO_ROOT / "wcag-operable-diagram.md",
    "3": REPO_ROOT / "wcag-understandable-diagram.md",
    "4": REPO_ROOT / "wcag-robust-diagram.md",
}

PRINCIPLE_NAMES: dict[str, str] = {
    "1": "Perceivable",
    "2": "Operable",
    "3": "Understandable",
    "4": "Robust",
}

# Ordered list of the tool engines tracked in ``act_implementations``.  Used
# as the canonical key order for all per-engine dicts in this module.
IMPL_ENGINES: tuple[str, ...] = ("axe", "alfa", "equal_access", "qualweb")


def _empty_impl() -> dict[str, list[str]]:
    """Return a fresh empty implementation dict for one ACT rule."""
    return {engine: [] for engine in IMPL_ENGINES}


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def fetch_text(url: str, timeout: int = 30) -> str | None:
    """Fetch URL content as text; return None on failure."""
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "wcag-in-mermaid-sync/1.0 (https://github.com/mgifford/wcag-in-mermaid)"},
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:  # noqa: S310
            return resp.read().decode("utf-8")
    except (urllib.error.URLError, urllib.error.HTTPError, OSError) as exc:
        print(f"  WARNING: Could not fetch {url}: {exc}", file=sys.stderr)
        return None


def fetch_axe_version() -> str:
    """
    Return the latest published axe-core major.minor version string (e.g. "4.10").

    Resolves the version from the npm registry dist-tags endpoint.  If the
    registry is unreachable the hard-coded ``AXE_VERSION_FALLBACK`` is used so
    that the sync can still complete offline.
    """
    raw = fetch_text(AXE_NPM_DIST_TAGS_URL)
    if raw is not None:
        try:
            tags = json.loads(raw)
            full_version = tags.get("latest", "")
            # Keep only major.minor (e.g. "4.10.2" → "4.10")
            parts = full_version.split(".")
            if len(parts) >= 2:
                return f"{parts[0]}.{parts[1]}"
            print(
                f"  WARNING: Unexpected axe-core version format '{full_version}'; "
                f"using fallback {AXE_VERSION_FALLBACK}",
                file=sys.stderr,
            )
        except (json.JSONDecodeError, AttributeError) as exc:
            print(f"  WARNING: Could not parse axe-core version: {exc}", file=sys.stderr)
    print(f"  WARNING: Using axe-core fallback version {AXE_VERSION_FALLBACK}", file=sys.stderr)
    return AXE_VERSION_FALLBACK


def fetch_alfa_version() -> str | None:
    """
    Return the latest published @siteimprove/alfa-rules full version string
    (e.g. "0.112.0"), or None when the npm registry is unreachable.
    """
    raw = fetch_text(ALFA_NPM_DIST_TAGS_URL)
    if raw is not None:
        try:
            tags = json.loads(raw)
            version = tags.get("latest", "")
            if version:
                return version
        except (json.JSONDecodeError, AttributeError) as exc:
            print(f"  WARNING: Could not parse Alfa version: {exc}", file=sys.stderr)
    print("  WARNING: Could not determine Alfa version from npm.", file=sys.stderr)
    return None


def normalise_sc(raw: str) -> str | None:
    """Return a canonical 'X.Y.Z' SC number or None if unparseable."""
    # Accept forms like 1.1.1, SC 1.1.1, success-criterion-1-1-1
    match = re.search(r"(\d+)[\.\-](\d+)[\.\-](\d+)", raw)
    if match:
        return f"{match.group(1)}.{match.group(2)}.{match.group(3)}"
    return None


def load_seed() -> dict:
    """Load the pre-seeded master_spine.json from disk."""
    with SEED_FILE.open(encoding="utf-8") as fh:
        return json.load(fh)


# ---------------------------------------------------------------------------
# ACT Rules
# ---------------------------------------------------------------------------

def _extract_rule_ids(items: object) -> list[str]:
    """Extract rule ID strings from a value that may be a list of strings or dicts.

    For dict entries the first non-empty string among the keys ``id``,
    ``ruleId``, and ``rule`` is used.  The ``or`` chain intentionally treats
    empty strings as "missing" — rule IDs should never be empty strings.
    """
    result: list[str] = []
    if not isinstance(items, list):
        return result
    for item in items:
        if isinstance(item, str) and item:
            result.append(item)
        elif isinstance(item, dict):
            rule_id = item.get("id") or item.get("ruleId") or item.get("rule") or ""
            if rule_id:
                result.append(rule_id)
    return result


def _extract_implementations(rule: dict) -> dict[str, list[str]]:
    """
    Extract per-engine implementation rule IDs from an ACT rule dict.

    Handles two known formats from W3C rules.json:
      1. ``implementations`` is a dict keyed by consistency level whose values
         are dicts keyed by tool name:
         ``{"consistent": {"axe-core": [...], "Alfa": [...]}, ...}``
      2. ``implementations`` is a flat list of dicts each with ``technology``
         (or ``tool``) and ``rule`` (or ``id`` / ``ruleId``) fields:
         ``[{"technology": "axe-core", "rule": "image-alt"}, ...]``

    Returns a dict with keys ``axe``, ``alfa``, ``equal_access``, ``qualweb``
    mapping to sorted, deduplicated lists of rule ID strings.
    """
    axe_rules: list[str] = []
    alfa_rules: list[str] = []
    equal_access_rules: list[str] = []
    qualweb_rules: list[str] = []

    implementations = rule.get("implementations", {})

    if isinstance(implementations, dict):
        # Format 1: keyed by consistency level
        for tools in implementations.values():
            if not isinstance(tools, dict):
                continue
            axe_rules.extend(_extract_rule_ids(tools.get("axe-core") or tools.get("axe") or []))
            alfa_rules.extend(_extract_rule_ids(tools.get("Alfa") or tools.get("alfa") or []))
            equal_access_rules.extend(
                _extract_rule_ids(tools.get("Equal Access") or tools.get("equal_access") or [])
            )
            qualweb_rules.extend(
                _extract_rule_ids(tools.get("QualWeb") or tools.get("qualweb") or [])
            )
    elif isinstance(implementations, list):
        # Format 2: flat list of tool entries
        for impl in implementations:
            if not isinstance(impl, dict):
                continue
            tech = (impl.get("technology") or impl.get("tool") or "").lower()
            # Empty strings treated as missing — rule IDs should never be empty.
            rule_id = (
                impl.get("rule") or impl.get("id") or impl.get("ruleId") or ""
            )
            if not rule_id:
                continue
            if "axe" in tech:
                axe_rules.append(str(rule_id))
            elif "alfa" in tech:
                alfa_rules.append(str(rule_id))
            elif "equal" in tech or "ibm" in tech:
                equal_access_rules.append(str(rule_id))
            elif "qualweb" in tech:
                qualweb_rules.append(str(rule_id))

    return {
        "axe": sorted(set(axe_rules)),
        "alfa": sorted(set(alfa_rules)),
        "equal_access": sorted(set(equal_access_rules)),
        "qualweb": sorted(set(qualweb_rules)),
    }


def fetch_act_rules() -> tuple[dict[str, list[str]], dict[str, dict]]:
    """
    Download the W3C ACT rules mapping JSON and return:
      1. SC-to-ACT mapping: ``{ "X.Y.Z": ["rule_id", ...], ... }``
      2. ACT-rule-to-implementations mapping:
         ``{ "rule_id": {"axe": [...], "alfa": [...], "equal_access": [...], "qualweb": [...]}, ... }``

    Supports two JSON formats:

    **wcag-mapping.json** (current, hosted on GitHub):
    ``{"act-rules": [{"frontmatter": {"id": "...", "accessibility_requirements":
    {"wcag20:1.3.1": {...}, ...}}, ...}]}``

    SC numbers are extracted from ``accessibility_requirements`` keys with a
    ``wcag20:``, ``wcag21:``, or ``wcag22:`` prefix; both primary (``forConformance``)
    and secondary associations are included.

    **Legacy rules.json** (no longer available at the original W3C URL):
    list or ``{"rules": [...]}`` with ``id`` and ``successCriteria`` fields.

    The second dict is populated only when the source JSON includes
    ``implementations`` data for each rule; it will be empty otherwise.
    """
    sc_to_act: dict[str, list[str]] = {}
    act_implementations: dict[str, dict] = {}
    raw = fetch_text(ACT_RULES_URL)
    if raw is None:
        return sc_to_act, act_implementations
    try:
        rules = json.loads(raw)
    except json.JSONDecodeError as exc:
        print(f"  WARNING: ACT rules JSON decode error: {exc}", file=sys.stderr)
        return sc_to_act, act_implementations

    if isinstance(rules, dict) and "act-rules" in rules:
        # wcag-mapping.json format: {"act-rules": [{...}, ...]}
        rule_list = rules["act-rules"]
        for rule in rule_list:
            # Skip deprecated rules — they are no longer active ACT rules.
            if rule.get("deprecated", False):
                continue
            fm = rule.get("frontmatter", {})
            rule_id = fm.get("id", "") or rule.get("id", "")
            # SC numbers live in accessibility_requirements keys like "wcag20:1.3.1".
            reqs = fm.get("accessibility_requirements") or {}
            for req_key in reqs:
                if req_key.startswith(("wcag20:", "wcag21:", "wcag22:")):
                    sc_raw = req_key.split(":", 1)[1]
                    sc = normalise_sc(sc_raw)
                    if sc and rule_id:
                        sc_to_act.setdefault(sc, [])
                        if rule_id not in sc_to_act[sc]:
                            sc_to_act[sc].append(rule_id)
            if rule_id:
                impl = _extract_implementations(rule)
                if any(impl.values()):
                    act_implementations[rule_id] = impl
    else:
        # Legacy rules.json format: list or {"rules": [...]}
        rule_list = rules if isinstance(rules, list) else rules.get("rules", [])
        for rule in rule_list:
            rule_id = rule.get("id", "")
            sc_nums = rule.get("successCriteria", []) or rule.get("sc", []) or []
            for sc_raw in sc_nums:
                sc = normalise_sc(str(sc_raw))
                if sc:
                    sc_to_act.setdefault(sc, [])
                    if rule_id and rule_id not in sc_to_act[sc]:
                        sc_to_act[sc].append(rule_id)
            if rule_id:
                impl = _extract_implementations(rule)
                if any(impl.values()):
                    act_implementations[rule_id] = impl

    return sc_to_act, act_implementations


# ---------------------------------------------------------------------------
# EARL Implementation Report (Alfa)
# ---------------------------------------------------------------------------

def _extract_act_id_from_url(url_or_id: str) -> str | None:
    """Extract a 6-character ACT rule ID from a URL or plain ID string.

    Handles URLs like:
      https://act-rules.github.io/rules/09o5cg
      https://www.w3.org/WAI/standards-guidelines/act/rules/09o5cg/
    as well as plain 6-character IDs (e.g. ``"09o5cg"``).
    """
    match = re.search(r"/rules/([a-z0-9]{6})(?:/|$)", url_or_id)
    if match:
        return match.group(1)
    if re.fullmatch(r"[a-z0-9]{6}", url_or_id):
        return url_or_id
    return None


def _extract_alfa_id_from_url(url_or_id: str) -> str | None:
    """Extract an Alfa rule ID (``SIA-RXX``) from a URL or plain ID string.

    Handles URLs like:
      https://alfa.siteimprove.com/rules/sia-r66
    as well as plain IDs in ``SIA-RXX`` form (case-insensitive on input,
    upper-case on output).
    """
    match = re.search(r"/rules/(sia-r\d+)", url_or_id, re.IGNORECASE)
    if match:
        return match.group(1).upper()
    if re.match(r"^SIA-R\d+$", url_or_id, re.IGNORECASE):
        return url_or_id.upper()
    return None


def _parse_earl_assertions(data: object) -> list[dict]:
    """Return a flat list of assertion dicts from various EARL JSON structures.

    Handles:
      * A JSON-LD ``@graph`` array at the top level (or nested under a key).
      * A plain list of assertion dicts.
      * A dict with an ``"assertions"`` key.

    An empty list under any key is treated the same as a missing key (falsy
    ``or`` chain).  For EARL implementation reports an empty ``@graph`` means
    no assertions, so this fall-through behaviour is intentional.
    """
    if isinstance(data, list):
        return data
    if not isinstance(data, dict):
        return []
    # Use or-chaining: empty lists (no assertions) are equivalent to missing keys.
    return (
        data.get("@graph")
        or data.get("assertions")
        or data.get("results")
        or []
    )


def fetch_earl_alfa_mappings(
    sc_to_act: dict[str, list[str]],
) -> tuple[dict[str, list[str]], dict[str, dict]]:
    """Fetch the Alfa ACT-R EARL implementation report and extract mappings.

    Uses ``sc_to_act`` (from :func:`fetch_act_rules`) to resolve the WCAG SCs
    for each ACT rule found in the report, then returns:

    1. ``sc_to_alfa`` — ``{"X.Y.Z": ["SIA-R66", ...]}``
       Alfa rules keyed by WCAG SC number, derived from the EARL assertions.
    2. ``act_impl_updates`` — ``{"09o5cg": {"alfa": ["SIA-R66"]}}``
       Updates to merge into ``meta.act_implementations`` so the ACT Rules
       view can show which Alfa rule backs each ACT rule.

    The function processes *all* consistency levels (consistent, partial, etc.)
    so that semi-automated implementations are included alongside full ones.
    Network or parse failures are handled gracefully: both dicts are empty.
    """
    sc_to_alfa: dict[str, list[str]] = {}
    act_impl_updates: dict[str, dict] = {}

    # Build a reverse map: ACT rule ID → list of SC numbers.
    act_to_scs: dict[str, list[str]] = {}
    for sc, rule_ids in sc_to_act.items():
        for rid in rule_ids:
            act_to_scs.setdefault(rid, []).append(sc)

    raw = fetch_text(ALFA_ACT_EARL_URL)
    if raw is None:
        return sc_to_alfa, act_impl_updates

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        print(f"  WARNING: Alfa EARL report JSON decode error: {exc}", file=sys.stderr)
        return sc_to_alfa, act_impl_updates

    assertions = _parse_earl_assertions(data)
    processed = 0
    for assertion in assertions:
        if not isinstance(assertion, dict):
            continue

        # --- Extract the ACT rule ID from the "test" field ---
        test_val = (
            assertion.get("earl:test")
            or assertion.get("test")
            or {}
        )
        if isinstance(test_val, str):
            act_id = _extract_act_id_from_url(test_val)
        elif isinstance(test_val, dict):
            raw_id = (
                test_val.get("@id")
                or test_val.get("id")
                or test_val.get("url")
                or ""
            )
            act_id = _extract_act_id_from_url(str(raw_id))
        else:
            continue

        if not act_id:
            continue

        # --- Extract the Alfa rule ID from the "subject" field ---
        subj_val = (
            assertion.get("earl:subject")
            or assertion.get("subject")
            or {}
        )
        if isinstance(subj_val, str):
            alfa_id = _extract_alfa_id_from_url(subj_val)
        elif isinstance(subj_val, dict):
            raw_id = (
                subj_val.get("@id")
                or subj_val.get("id")
                or subj_val.get("url")
                or ""
            )
            alfa_id = _extract_alfa_id_from_url(str(raw_id))
            if not alfa_id:
                title = (
                    subj_val.get("dct:title")
                    or subj_val.get("title")
                    or ""
                )
                alfa_id = _extract_alfa_id_from_url(str(title))
        else:
            continue

        if not alfa_id:
            continue

        # --- Map Alfa rule to each WCAG SC covered by this ACT rule ---
        scs_for_act = act_to_scs.get(act_id, [])
        for sc in scs_for_act:
            lst = sc_to_alfa.setdefault(sc, [])
            if alfa_id not in lst:
                lst.append(alfa_id)

        # --- Record the Alfa rule in act_impl_updates ---
        entry = act_impl_updates.setdefault(act_id, _empty_impl())
        if alfa_id not in entry["alfa"]:
            entry["alfa"].append(alfa_id)

        processed += 1

    print(f"  → Processed {processed} EARL assertions from Alfa report")
    return sc_to_alfa, act_impl_updates


def fetch_act_testcases_sc_map() -> dict[str, list[str]]:
    """
    Download the W3C ACT testcases JSON and build a supplemental SC-to-ACT mapping.

    The testcases.json is richer than rules.json for secondary-SC coverage: a rule
    like ``09o5cg`` ("Text has minimum contrast") has test cases tagged for both
    1.4.3 and 1.4.6, so fetching testcases gives us those secondary associations
    that rules.json may omit.

    Returns ``{ "X.Y.Z": ["rule_id", ...], ... }`` — same shape as ``fetch_act_rules()``.
    """
    sc_to_act: dict[str, list[str]] = {}
    raw = fetch_text(ACT_TESTCASES_URL)
    if raw is None:
        return sc_to_act
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        print(f"  WARNING: ACT testcases JSON decode error: {exc}", file=sys.stderr)
        return sc_to_act

    # The testcases.json is a list of test-case objects.  Each has at least
    # "ruleId" (string) and "successCriteria" (list of strings like "1.4.3").
    testcases = data if isinstance(data, list) else data.get("testcases", [])
    for tc in testcases:
        if not isinstance(tc, dict):
            continue
        rule_id = (tc.get("ruleId") or tc.get("rule_id") or tc.get("rule") or "").strip()
        if not rule_id:
            continue
        # successCriteria may be a list of strings like ["1.4.3"] or ["1.4.3", "1.4.6"]
        sc_list = tc.get("successCriteria") or tc.get("sc") or []
        if isinstance(sc_list, str):
            sc_list = [sc_list]
        for sc_raw in sc_list:
            sc = normalise_sc(str(sc_raw))
            if sc:
                sc_to_act.setdefault(sc, [])
                if rule_id not in sc_to_act[sc]:
                    sc_to_act[sc].append(rule_id)

    total = sum(len(v) for v in sc_to_act.values())
    print(f"  → ACT testcases: {total} rule/SC pairs from testcases.json")
    return sc_to_act


def fetch_alfa_sc_map() -> dict[str, list[str]]:
    """
    Fetch Alfa rule→WCAG SC mappings from the Alfa rules TypeScript index.

    The Alfa source file exports every rule with ``Criterion.of("X.Y.Z")`` calls
    inside each rule's ``requirements`` array.  A simple regex extracts both the
    rule IDs (``"SIA-RNNN"``) and the criteria they reference.

    Returns ``{ "X.Y.Z": ["SIA-RNNN", ...], ... }``.
    """
    sc_to_alfa: dict[str, list[str]] = {}
    raw = fetch_text(ALFA_RULES_INDEX_URL)
    if raw is None:
        return sc_to_alfa

    # Match rule blocks: export { default as SIA_R66 } from "./rules/sia-r66"; followed
    # by the rule definition containing Criterion.of("1.4.6").
    # Strategy: split by rule identifier lines and parse each chunk.
    #
    # The Alfa index TypeScript lists re-exports like:
    #   export { default as SIA_R66 } from "./rules/sia-r66";
    # We collect rule IDs from these lines and then scan the file for
    # Criterion references near each rule to build the map.
    #
    # Simpler regex approach: find every occurrence of
    #   SIA-Rnn ... Criterion.of("X.Y.Z")   (within reason)
    # by scanning for blocks that contain both.

    # Pattern 1: in-line export with criterion, e.g. from generated metadata files.
    # Pattern 2: parse the TypeScript source which lists rules as re-exports and
    # individual rule files that contain Criterion.of("X.Y.Z").
    #
    # Since the index file is a re-export only, we parse it to get rule IDs, then
    # attempt to fetch each rule file.  However, to avoid ~130 HTTP requests we
    # use a bulk regex over the entire index for any embedded criterion references.

    # Build the list of Alfa rule IDs from export lines.
    # Lines look like: export { default as SIA_R3 } from "./rules/sia-r3";
    rule_id_re = re.compile(r'\bSIA[_-]R(\d+)\b', re.IGNORECASE)
    alfa_ids = sorted(set(
        f"SIA-R{m.group(1)}" for m in rule_id_re.finditer(raw)
    ), key=lambda x: int(x.split("-R", 1)[1]) if "-R" in x else 0)

    # If the index already embeds Criterion.of("X.Y.Z") mappings, extract them.
    # Build a coarse mapping: for each criterion found adjacent to each rule mention.
    # This works when the rule source is inlined or concatenated into the index.
    crit_re = re.compile(r'Criterion\.of\(["\'](\d+\.\d+\.\d+)["\']', re.IGNORECASE)
    sc_mentions = [m.group(1) for m in crit_re.finditer(raw)]
    if sc_mentions:
        # There are inlined criteria; pair them with the nearest preceding rule ID.
        for m_crit in crit_re.finditer(raw):
            sc = m_crit.group(1)
            pos = m_crit.start()
            # Find the closest SIA-Rnn mention before this position (within 4 KB).
            window = raw[max(0, pos - 4096):pos]
            matches = list(rule_id_re.finditer(window))
            if matches:
                rid = f"SIA-R{matches[-1].group(1)}"
                sc_to_alfa.setdefault(sc, [])
                if rid not in sc_to_alfa[sc]:
                    sc_to_alfa[sc].append(rid)

    if sc_to_alfa:
        total = sum(len(v) for v in sc_to_alfa.values())
        print(f"  → Alfa index: {total} rule/SC pairs from inline criteria")
        return sc_to_alfa

    # Fallback: the index is a thin re-export file without inlined criteria.
    # Fetch individual rule files; limit to a batch to avoid excess HTTP calls.
    # Rule files are at: .../packages/alfa-rules/src/rules/sia-rNNN.ts
    base_rule_url = ALFA_RULES_INDEX_URL.rsplit("/", 1)[0] + "/rules/"
    fetched = 0
    for rid in alfa_ids:
        rule_file_url = base_rule_url + rid.lower() + ".ts"
        rule_src = fetch_text(rule_file_url)
        if rule_src is None:
            continue
        fetched += 1
        for m_crit in crit_re.finditer(rule_src):
            sc = m_crit.group(1)
            sc_to_alfa.setdefault(sc, [])
            if rid not in sc_to_alfa[sc]:
                sc_to_alfa[sc].append(rid)

    total = sum(len(v) for v in sc_to_alfa.values())
    print(f"  → Alfa rules: {total} rule/SC pairs from {fetched} individual rule files")
    return sc_to_alfa


def _parse_axe_rule_tags(tags: list) -> list[str]:
    """
    Convert axe-core rule ``tags`` to a list of canonical WCAG SC numbers.

    axe tags use the form ``"wcag143"`` for 1.4.3, ``"wcag1411"`` for 1.4.11,
    or ``"wcag2a"`` / ``"wcag21aa"`` (level tags, which are ignored).

    Format: ``wcag`` + [principle 1-4] + [guideline 1-5] + [SC number 1-99+]
    """
    sc_list: list[str] = []
    for tag in tags:
        tag_str = str(tag)
        # SC-specific tags: wcag + single principle digit + single guideline digit
        # + one-or-more digits for the SC number (e.g. wcag143 → 1.4.3,
        # wcag1411 → 1.4.11, wcag2410 → 2.4.10).
        # Level tags like "wcag2a", "wcag21aa" do NOT end with \d+ so are excluded.
        # Using [1-4] for principle and \d for guideline (single digit, future-proof
        # beyond guideline 5 while still capturing only meaningful single-digit guidelines).
        m = re.fullmatch(r'wcag([1-4])(\d)(\d+)', tag_str, re.IGNORECASE)
        if m:
            sc_list.append(f"{m.group(1)}.{m.group(2)}.{m.group(3)}")
    return sc_list


def fetch_axe_sc_map() -> dict[str, list[str]]:
    """
    Fetch axe-core rule→WCAG SC mappings from the axe-core GitHub source.

    Strategy
    --------
    1. Fetch the GitHub API directory listing for ``lib/rules``.
    2. For each ``*.json`` rule file, fetch its content and read the ``tags`` array.
    3. Convert tags like ``"wcag143"`` → ``"1.4.3"`` and build the SC→rule map.

    Falls back to regex-parsing the compiled ``axe.js`` when the API listing is
    unavailable (e.g. rate-limited).

    Returns ``{ "X.Y.Z": ["rule-id", ...], ... }``.
    """
    sc_to_axe: dict[str, list[str]] = {}

    # --- Strategy 1: GitHub API listing + individual rule JSON files ---
    listing_raw = fetch_text(AXE_RULES_API_URL)
    if listing_raw is not None:
        try:
            listing = json.loads(listing_raw)
        except json.JSONDecodeError:
            listing = []

        if isinstance(listing, list):
            rule_files = [
                entry for entry in listing
                if isinstance(entry, dict)
                and entry.get("name", "").endswith(".json")
                and entry.get("type") == "file"
            ]
            fetched = 0
            for rf in rule_files:
                raw_url = rf.get("download_url", "")
                if not raw_url:
                    continue
                rule_raw = fetch_text(raw_url)
                if rule_raw is None:
                    continue
                try:
                    rule_obj = json.loads(rule_raw)
                except json.JSONDecodeError:
                    continue
                # Rule ID is the file name without extension, or the "id" field.
                rule_id = (
                    rule_obj.get("id")
                    or rf.get("name", "").removesuffix(".json")
                )
                if not rule_id:
                    continue
                tags = rule_obj.get("tags", [])
                for sc in _parse_axe_rule_tags(tags):
                    sc_to_axe.setdefault(sc, [])
                    if rule_id not in sc_to_axe[sc]:
                        sc_to_axe[sc].append(rule_id)
                fetched += 1

            if sc_to_axe:
                total = sum(len(v) for v in sc_to_axe.values())
                print(f"  → axe-core: {total} rule/SC pairs from {fetched} rule JSON files")
                return sc_to_axe

    # --- Strategy 2: Regex over compiled axe.js ---
    print("  → axe-core: falling back to axe.js regex parsing", file=sys.stderr)
    axe_js = fetch_text(AXE_CORE_JS_URL)
    if axe_js is None:
        print("  WARNING: Could not fetch axe.js for rule metadata", file=sys.stderr)
        return sc_to_axe

    # Match rule-metadata blocks: id:"some-rule", ... tags:["wcag2a","wcag143",...]
    # This is a heuristic over minified/bundled JS.
    block_re = re.compile(
        r'"id"\s*:\s*"([^"]+)"[^}]{0,500}?"tags"\s*:\s*\[([^\]]+)\]',
        re.DOTALL,
    )
    tag_str_re = re.compile(r'"(wcag\d[^"]*)"', re.IGNORECASE)
    for m in block_re.finditer(axe_js):
        rule_id = m.group(1)
        tags_blob = m.group(2)
        tags = tag_str_re.findall(tags_blob)
        for sc in _parse_axe_rule_tags(tags):
            sc_to_axe.setdefault(sc, [])
            if rule_id not in sc_to_axe[sc]:
                sc_to_axe[sc].append(rule_id)

    total = sum(len(v) for v in sc_to_axe.values())
    print(f"  → axe-core: {total} rule/SC pairs from axe.js (regex fallback)")
    return sc_to_axe


# ---------------------------------------------------------------------------
# W3C ARRM
# ---------------------------------------------------------------------------

def fetch_arrm_roles() -> dict[str, list[str]]:
    """
    Download arrm-wcag-sc.csv and return:
      { "X.Y.Z": ["Role A", "Role B"], ... }
    """
    sc_to_roles: dict[str, list[str]] = {}
    raw = fetch_text(ARRM_WCAG_SC_URL)
    if raw is None:
        return sc_to_roles
    reader = csv.DictReader(StringIO(raw))
    for row in reader:
        # Common column names for the SC number
        sc_raw = (
            row.get("sc_num")
            or row.get("scNum")
            or row.get("sc-num")
            or row.get("sc")
            or row.get("successCriterion")
            or ""
        )
        sc = normalise_sc(sc_raw)
        if not sc:
            continue
        role = (
            row.get("role")
            or row.get("Role")
            or row.get("responsibility")
            or ""
        ).strip()
        if role:
            sc_to_roles.setdefault(sc, [])
            if role not in sc_to_roles[sc]:
                sc_to_roles[sc].append(role)
    return sc_to_roles


def fetch_arrm_tasks() -> dict[str, list[dict]]:
    """
    Download arrm-all-tasks.csv and return a mapping of SC number to a list of
    structured task objects:
      {
        "X.Y.Z": [
          {
            "id":                  "IMG-001",
            "task":                "Informative alternate text …",
            "primary_ownership":   "Content Authoring",
            "secondary_ownership": "User Experience (UX) Design",
            "category_url":        "https://…/tasks/#images-and-graphs",
            "role_url":            "https://…/content-author/"
          },
          ...
        ],
        ...
      }
    """
    sc_to_tasks: dict[str, list[dict]] = {}
    raw = fetch_text(ARRM_ALL_TASKS_URL)
    if raw is None:
        return sc_to_tasks
    reader = csv.DictReader(StringIO(raw))
    for row in reader:
        sc_raw = (
            row.get("WCAG SC")
            or row.get("sc_num")
            or row.get("scNum")
            or row.get("sc-num")
            or row.get("sc")
            or row.get("successCriterion")
            or ""
        )
        sc = normalise_sc(sc_raw)
        if not sc:
            continue

        task_id = (row.get("ID") or "").strip()
        task_desc = (row.get("Task") or row.get("task") or row.get("description") or "").strip()
        if not task_id or not task_desc:
            continue

        primary = (row.get("Primary Ownership") or row.get("primary_ownership") or "").strip()
        secondary = (row.get("Secondary Ownership") or row.get("secondary_ownership") or "").strip()
        if secondary.lower() == "none":
            secondary = ""

        # Derive URLs from the prefix (e.g. "IMG" from "IMG-001")
        prefix = task_id.split("-")[0] if "-" in task_id else ""
        category_url = ARRM_TASK_CATEGORY_URLS.get(prefix, f"{ARRM_BASE_URL}/tasks/")
        role_url = ARRM_ROLE_URLS.get(primary, "")

        task_obj = {
            "id":                  task_id,
            "task":                task_desc,
            "primary_ownership":   primary,
            "secondary_ownership": secondary,
            "category_url":        category_url,
            "role_url":            role_url,
        }

        existing_ids = {t["id"] for t in sc_to_tasks.get(sc, [])}
        if task_id not in existing_ids:
            sc_to_tasks.setdefault(sc, []).append(task_obj)

    return sc_to_tasks


# ---------------------------------------------------------------------------
# Merge logic
# ---------------------------------------------------------------------------

def merge_into_spine(
    spine: dict,
    act_map: dict,
    roles_map: dict,
    tasks_map: dict,
    act_implementations: dict | None = None,
    axe_map: dict | None = None,
    alfa_map: dict | None = None,
) -> None:
    """Merge fetched data into the in-memory spine (mutates in place).

    Parameters
    ----------
    spine:               The in-memory spine (loaded from master_spine.json).
    act_map:             SC → list of ACT rule IDs.
    roles_map:           SC → list of ARRM role names.
    tasks_map:           SC → list of ARRM task dicts.
    act_implementations: ACT rule ID → engine implementation dict (freshly fetched).
    axe_map:             SC → list of axe-core rule IDs (directly fetched).
    alfa_map:            SC → list of Alfa rule IDs (directly fetched).

    Automation propagation
    ----------------------
    After merging per-SC ACT, axe, and Alfa rule IDs, the function also
    *derives* additional axe/Alfa rules from the combined implementation data
    (seed data already stored in ``meta.act_implementations`` **plus** any
    freshly fetched ``act_implementations``).  For every ACT rule mapped to an
    SC the engine rules in that implementation entry are added to the SC's
    ``automation.axe`` / ``automation.alfa`` arrays.

    This means:
    * If ACT rule ``09o5cg`` maps to SC 1.4.6 (via the seed or a live fetch),
      and its implementation data shows Alfa uses ``SIA-R66``, then 1.4.6 also
      gets ``SIA-R66`` — without requiring a manual seed-data edit.
    * The propagation works even offline, because seed data in
      ``meta.act_implementations`` is always available as the baseline.
    """
    sc_dict = spine.get("success_criteria", {})

    # Build the combined implementation map: start from what is already stored
    # in the spine (seed + any prior syncs) and layer fresh data on top.
    # This ensures propagation works even when network fetches return nothing.
    combined_impl: dict[str, dict] = {}
    seed_impl = spine.get("meta", {}).get("act_implementations", {})
    for act_id, impl in seed_impl.items():
        combined_impl[act_id] = {k: list(v) for k, v in impl.items()}
    for act_id, impl in (act_implementations or {}).items():
        if act_id not in combined_impl:
            combined_impl[act_id] = {k: list(v) for k, v in impl.items()}
        else:
            for engine in ("axe", "alfa", "equal_access", "qualweb"):
                merged = list(dict.fromkeys(
                    combined_impl[act_id].get(engine, []) + impl.get(engine, [])
                ))
                combined_impl[act_id][engine] = merged

    for sc_num, entry in sc_dict.items():
        # --- ACT ---
        live_act = act_map.get(sc_num, [])
        if live_act:
            merged_act = sorted(set(entry["automation"]["act"]) | set(live_act))
            entry["automation"]["act"] = merged_act

        # --- axe-core (directly fetched) ---
        if axe_map:
            live_axe = axe_map.get(sc_num, [])
            if live_axe:
                merged_axe = sorted(set(entry["automation"]["axe"]) | set(live_axe))
                entry["automation"]["axe"] = merged_axe

        # --- Alfa (directly fetched) ---
        if alfa_map:
            live_alfa = alfa_map.get(sc_num, [])
            if live_alfa:
                merged_alfa = sorted(set(entry["automation"]["alfa"]) | set(live_alfa))
                entry["automation"]["alfa"] = merged_alfa

        # --- Propagate ACT implementation data to per-SC engine arrays ---
        # For every ACT rule that applies to this SC, add the engine rules
        # listed in combined_impl to the SC's axe / alfa arrays.
        if combined_impl:
            current_act = entry["automation"]["act"]
            derived_axe  = set(entry["automation"]["axe"])
            derived_alfa = set(entry["automation"]["alfa"])
            for act_id in current_act:
                impl = combined_impl.get(act_id, {})
                derived_axe.update(impl.get("axe", []))
                derived_alfa.update(impl.get("alfa", []))
            entry["automation"]["axe"]  = sorted(derived_axe)
            entry["automation"]["alfa"] = sorted(derived_alfa)

        # --- ARRM roles ---
        live_roles = roles_map.get(sc_num, [])
        if live_roles:
            merged_roles = list(dict.fromkeys(entry["manual"]["roles"] + live_roles))
            entry["manual"]["roles"] = merged_roles

        # --- ARRM structured tasks ---
        # Stored separately from tt_steps (Trusted Tester procedures).
        live_tasks = tasks_map.get(sc_num, [])
        if live_tasks:
            existing = entry["manual"].setdefault("arrm_tasks", [])
            existing_ids = {t["id"] for t in existing}
            for t in live_tasks:
                if t["id"] not in existing_ids:
                    existing.append(t)
                    existing_ids.add(t["id"])

    # --- Store updated ACT implementation data in meta ---
    # Write back the combined (seed + fresh) implementation map so future syncs
    # can use accumulated data as their baseline.
    existing_meta_impl = spine.setdefault("meta", {}).setdefault("act_implementations", {})
    for act_id, impl in combined_impl.items():
        existing_meta_impl[act_id] = impl


# ---------------------------------------------------------------------------
# Mermaid sanitisation helpers (used by the frontend generator too)
# ---------------------------------------------------------------------------

def sanitise_id(text: str) -> str:
    """Strip characters that break Mermaid node IDs."""
    return re.sub(r"[^A-Za-z0-9_]", "_", text)


def sanitise_label(text: str) -> str:
    """Wrap text in double-quotes for safe Mermaid labels."""
    cleaned = text.replace('"', "'")
    return f'["{cleaned}"]'


# ---------------------------------------------------------------------------
# Mermaid diagram generator
# ---------------------------------------------------------------------------

# Maximum ARRM task IDs to show inline in a single diagram node before
# appending "+N more".
_ARRM_IDS_IN_NODE = 5

# Maximum Trusted Tester step IDs to show inline in a single diagram node.
_TT_IDS_IN_NODE = 4


_LEGEND = (
    "**Legend**\n"
    "\n"
    "| Colour | Meaning |\n"
    "|--------|---------|\n"
    "| 🔵 Blue | Success Criterion |\n"
    "| 🟠 Orange | Responsible Role |\n"
    "| 🟣 Purple | ACT Automated Rules |\n"
    "| 🟡 Yellow | AXE Automated Rules |\n"
    "| 🩷 Pink | Alfa Automated Rules |\n"
    "| 🟦 Indigo | ARRM Task IDs |\n"
    "| 🟩 Teal | Trusted Tester v5 |\n"
)

_DIAGRAM_INTRO = (
    "SC nodes form a **vertical spine** running top to bottom in the centre.\n"
    "Automated testing tools (ACT, AXE, Alfa) branch off to the **left** of each SC.\n"
    "Responsible roles branch off to the **right** of each SC.\n"
    "ARRM task IDs and Trusted Tester steps branch off from each SC node.\n"
    "(`graph LR` is used so that root SC nodes stack vertically, not horizontally.)\n"
)


def _build_principle_diagram(sc_dict: dict, axe_version: str = AXE_VERSION_FALLBACK) -> str:
    """
    Build the Mermaid ``graph LR`` block for the given subset of SCs.

    Returns the full diagram as a string (including the fenced code block).
    All ``click`` directives are appended after the node definitions so the
    node declarations stay readable.

    ``axe_version`` is the axe-core major.minor string (e.g. ``"4.10"``) used
    to build versioned Deque University rule URLs.
    """
    node_lines: list[str] = []
    click_lines: list[str] = []

    node_lines.append("```mermaid")
    node_lines.append("graph LR")
    node_lines.append("    classDef sc   fill:#e1f5fe,stroke:#01579b,color:#000")
    node_lines.append("    classDef role fill:#fff3e0,stroke:#e65100,color:#000")
    node_lines.append("    classDef act  fill:#f3e5f5,stroke:#6a1b9a,color:#000")
    node_lines.append("    classDef axe  fill:#fffde7,stroke:#f57f17,color:#000")
    node_lines.append("    classDef alfa fill:#fce4ec,stroke:#880e4f,color:#000")
    node_lines.append("    classDef arrm fill:#e8eaf6,stroke:#3949ab,color:#000")
    node_lines.append("    classDef tt   fill:#e0f2f1,stroke:#00695c,color:#000")
    node_lines.append("")

    for sc_num, entry in sc_dict.items():
        safe = sc_num.replace(".", "_")
        sc_node = f"N{safe}"

        a = entry.get("automation", {})
        m = entry.get("manual", {})
        act_ids    = a.get("act", [])
        axe_ids    = a.get("axe", [])
        alfa_ids   = a.get("alfa", [])
        roles      = m.get("roles", [])
        tt_steps   = m.get("tt_steps", [])
        arrm_tasks = m.get("arrm_tasks", [])

        node_lines.append(f"    {sc_node}(({sc_num})):::sc")

        # --- Automation nodes (point INTO the SC) ---
        if act_ids:
            act_label = "ACT: " + ", ".join(act_ids)
            node_lines.append(f'    A_act_{safe}["{act_label}"]:::act --> {sc_node}')
            click_lines.append(
                f'    click A_act_{safe} href '
                f'"https://www.w3.org/WAI/standards-guidelines/act/rules/{act_ids[0]}/" _blank'
            )

        if axe_ids:
            axe_label = "AXE: " + ", ".join(axe_ids)
            node_lines.append(f'    A_axe_{safe}["{axe_label}"]:::axe --> {sc_node}')
            click_lines.append(
                f'    click A_axe_{safe} href '
                f'"https://dequeuniversity.com/rules/axe/{axe_version}/{axe_ids[0]}" _blank'
            )

        if alfa_ids:
            alfa_label = "Alfa: " + ", ".join(alfa_ids)
            node_lines.append(f'    A_alfa_{safe}["{alfa_label}"]:::alfa --> {sc_node}')
            click_lines.append(
                f'    click A_alfa_{safe} href '
                f'"https://alfa.siteimprove.com/rules/{alfa_ids[0].lower()}" _blank'
            )

        # --- Role nodes (point OUT of the SC) ---
        seen_abbrs: set[str] = set()
        for role in roles:
            abbr = ROLE_ABBREVIATIONS.get(role)
            if abbr is None:
                # Fallback: initials of each word
                abbr = "".join(w[0] for w in role.split() if w).upper()
            # Deduplicate within this SC (two roles mapping to same abbr is unlikely
            # but guard against it to keep IDs unique).
            unique_abbr = abbr
            suffix = 2
            while unique_abbr in seen_abbrs:
                unique_abbr = f"{abbr}{suffix}"
                suffix += 1
            seen_abbrs.add(unique_abbr)
            role_node = f"R{safe}_{unique_abbr}"
            safe_role_label = role.replace('"', "'")
            node_lines.append(f'    {sc_node} --> {role_node}["{safe_role_label}"]:::role')

        # --- ARRM task-IDs node ---
        if arrm_tasks:
            task_ids = [t["id"] for t in arrm_tasks]
            if len(task_ids) <= _ARRM_IDS_IN_NODE:
                ids_label = ", ".join(task_ids)
            else:
                ids_label = (
                    ", ".join(task_ids[:_ARRM_IDS_IN_NODE])
                    + f" +{len(task_ids) - _ARRM_IDS_IN_NODE} more"
                )
            arrm_node = f"T_{safe}"
            node_lines.append(f'    {sc_node} --> {arrm_node}["ARRM: {ids_label}"]:::arrm')
            category_url = arrm_tasks[0].get(
                "category_url", "https://www.w3.org/WAI/planning/arrm/tasks/"
            )
            click_lines.append(
                f'    click {arrm_node} href "{category_url}" _blank'
            )

        # --- Trusted Tester node ---
        if tt_steps:
            step_ids = [s.split(" - ")[0] for s in tt_steps]
            if len(step_ids) <= _TT_IDS_IN_NODE:
                tt_label = "TT: " + ", ".join(step_ids)
            else:
                tt_label = (
                    "TT: " + ", ".join(step_ids[:_TT_IDS_IN_NODE])
                    + f" +{len(step_ids) - _TT_IDS_IN_NODE} more"
                )
            tt_node = f"TT_{safe}"
            node_lines.append(f'    {sc_node} --> {tt_node}["{tt_label}"]:::tt')
            click_lines.append(
                f'    click {tt_node} href "{_tt_sc_url(sc_num)}" _blank'
            )

        # SC click
        sc_url = entry.get("url", "")
        if sc_url:
            click_lines.append(f'    click {sc_node} href "{sc_url}" _blank')

        node_lines.append("")

    diagram_lines = node_lines + click_lines + ["```"]
    return "\n".join(diagram_lines) + "\n"


def generate_mermaid_md(spine: dict, axe_version: str = AXE_VERSION_FALLBACK) -> None:
    """
    Regenerate the per-principle Mermaid diagram files from the in-memory spine.

    GitHub enforces a maximum diagram text size, so a single diagram covering
    all 86 WCAG 2.2 SCs exceeds that limit.  Instead we generate one file per
    WCAG principle (Perceivable / Operable / Understandable / Robust) plus an
    overview index (wcag-sc-roles-diagram.md) that links to each principle file.

    Layout (per diagram)
    --------------------
    graph LR
      AUTO  -->  SC  -->  ROLE(s)
                  |
                 ARRM task-IDs node  (indigo)
                  |
                 TT steps node       (teal)

    All ``click`` directives are collected and written at the end of the
    diagram block so the node definitions stay readable.

    ``axe_version`` is the axe-core major.minor string (e.g. ``"4.10"``) used
    to build versioned Deque University rule URLs.
    """
    sc_dict = spine.get("success_criteria", {})

    # --- Write one diagram file per WCAG principle ---
    for prefix, out_path in MERMAID_PRINCIPLE_FILES.items():
        principle_name = PRINCIPLE_NAMES[prefix]
        principle_scs = {
            num: entry
            for num, entry in sc_dict.items()
            if num.startswith(f"{prefix}.")
        }

        header = (
            f"# WCAG 2.2 Principle {prefix}: {principle_name} – Roles & Testing\n"
            "\n"
            f"Success Criteria {prefix}.x.x ({len(principle_scs)} SCs).\n"
            "\n"
        ) + _DIAGRAM_INTRO + "\n" + _LEGEND + "\n"

        content = header + _build_principle_diagram(principle_scs, axe_version=axe_version)
        out_path.write_text(content, encoding="utf-8")
        print(f"  → Wrote {out_path} ({len(principle_scs)} SCs, {len(content)} chars)")

    # --- Write the overview index ---
    index_lines = [
        "# WCAG 2.2 Success Criteria – Roles & Testing",
        "",
        "The full diagram has been split into four files by WCAG principle to stay",
        "within GitHub's maximum Mermaid diagram size.",
        "",
        "| Principle | File | SCs |",
        "|-----------|------|-----|",
    ]
    for prefix, out_path in MERMAID_PRINCIPLE_FILES.items():
        principle_name = PRINCIPLE_NAMES[prefix]
        principle_scs = [num for num in sc_dict if num.startswith(f"{prefix}.")]
        index_lines.append(
            f"| {prefix}. {principle_name} | [{out_path.name}]({out_path.name}) | {len(principle_scs)} |"
        )

    index_lines += [
        "",
        "---",
        "",
        _DIAGRAM_INTRO,
        _LEGEND,
    ]

    MERMAID_FILE.write_text("\n".join(index_lines) + "\n", encoding="utf-8")
    print(f"  → Wrote {MERMAID_FILE} (index, {len(sc_dict)} total SCs)")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    print("Loading seed data …")
    spine = load_seed()

    print("Fetching axe-core version …")
    axe_version = fetch_axe_version()
    print(f"  → axe-core version: {axe_version}")

    print("Fetching Alfa version …")
    alfa_version = fetch_alfa_version()
    print(f"  → Alfa version: {alfa_version or '(unavailable)'}")

    print("Fetching ACT rules (wcag-mapping.json) …")
    act_map, act_implementations = fetch_act_rules()
    print(f"  → {sum(len(v) for v in act_map.values())} ACT rule/SC mappings found")
    if act_implementations:
        print(f"  → Implementation data found for {len(act_implementations)} ACT rules")

    print("Fetching ACT rules (testcases.json — secondary SC coverage) …")
    act_testcases_map = fetch_act_testcases_sc_map()
    if act_testcases_map:
        # Merge testcases SC map into act_map (testcases may have secondary SCs).
        for sc, rule_ids in act_testcases_map.items():
            existing = act_map.setdefault(sc, [])
            for rid in rule_ids:
                if rid not in existing:
                    existing.append(rid)
        print(f"  → After merging testcases: {sum(len(v) for v in act_map.values())} total ACT rule/SC pairs")
    else:
        print("  → Testcases source unavailable; using rules.json only")

    print("Fetching Alfa rules (SC mapping) …")
    alfa_map = fetch_alfa_sc_map()
    if alfa_map:
        print(f"  → {sum(len(v) for v in alfa_map.values())} Alfa rule/SC pairs found")
    else:
        print("  → Alfa SC map unavailable; engine propagation will rely on ACT implementations")

    print("Fetching axe-core rules (SC mapping) …")
    axe_map = fetch_axe_sc_map()
    if axe_map:
        print(f"  → {sum(len(v) for v in axe_map.values())} axe-core rule/SC pairs found")
    else:
        print("  → axe-core SC map unavailable; engine propagation will rely on ACT implementations")

    print("Fetching ARRM roles …")
    roles_map = fetch_arrm_roles()
    print(f"  → {sum(len(v) for v in roles_map.values())} role/SC mappings found")

    print("Fetching ARRM tasks …")
    tasks_map = fetch_arrm_tasks()
    print(f"  → {sum(len(v) for v in tasks_map.values())} task/SC mappings found")

    print("Fetching Alfa EARL implementation report …")
    earl_alfa_map, earl_act_impl = fetch_earl_alfa_mappings(act_map)
    if earl_alfa_map:
        print(
            f"  → Alfa EARL: {sum(len(v) for v in earl_alfa_map.values())} "
            f"Alfa rule/SC mappings across {len(earl_alfa_map)} SCs"
        )
        # Merge EARL-derived Alfa rules into alfa_map so merge_into_spine picks them up.
        for sc, rule_ids in earl_alfa_map.items():
            existing = alfa_map.setdefault(sc, [])
            for rid in rule_ids:
                if rid not in existing:
                    existing.append(rid)
    # Merge EARL-derived ACT implementation updates so the propagation logic in
    # merge_into_spine can derive axe/alfa engine rules from combined_impl.
    for act_id, impl in earl_act_impl.items():
        if act_id not in act_implementations:
            act_implementations[act_id] = impl
        else:
            for engine in IMPL_ENGINES:
                merged = list(dict.fromkeys(
                    act_implementations[act_id].get(engine, [])
                    + impl.get(engine, [])
                ))
                act_implementations[act_id][engine] = merged

    print("Merging data …")
    merge_into_spine(
        spine,
        act_map,
        roles_map,
        tasks_map,
        act_implementations=act_implementations,
        axe_map=axe_map or {},
        alfa_map=alfa_map or {},
    )

    spine["meta"]["generated"] = date.today().isoformat()
    spine["meta"]["axe_version"] = axe_version
    if alfa_version:
        spine["meta"]["alfa_version"] = alfa_version
    spine["meta"].setdefault("sources", {})["trusted_tester"] = TT_IMPLEMENTATIONS_URL
    spine["meta"]["sources"]["section508_coordinators"] = "https://github.com/Section508Coordinators"
    spine["meta"]["sources"]["act_rules"] = ACT_RULES_URL
    spine["meta"]["sources"]["act_testcases"] = ACT_TESTCASES_URL
    spine["meta"]["sources"]["alfa_rules_index"] = ALFA_RULES_INDEX_URL
    spine["meta"]["sources"]["alfa_earl"] = ALFA_ACT_EARL_URL
    spine["meta"]["sources"]["axe_rules_api"] = AXE_RULES_API_URL

    print(f"Writing {OUTPUT_FILE} …")
    with OUTPUT_FILE.open("w", encoding="utf-8") as fh:
        json.dump(spine, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    total_sc = len(spine.get("success_criteria", {}))
    print(f"Done — {total_sc} Success Criteria written to {OUTPUT_FILE}")

    print("Generating Mermaid diagram …")
    generate_mermaid_md(spine, axe_version=axe_version)


if __name__ == "__main__":
    main()
