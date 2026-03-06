#!/usr/bin/env python3
"""
WCAG Mirror Spine - Data Orchestrator
Synchronizes data from W3C ARRM, ACT Rules, Axe-core, and Alfa
to produce a consolidated master_spine.json covering all WCAG 2.2 SCs.
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
ACT_RULES_URL = (
    "https://www.w3.org/WAI/standards-guidelines/act/rules/data/rules.json"
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

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
SEED_FILE = DATA_DIR / "master_spine.json"
OUTPUT_FILE = DATA_DIR / "master_spine.json"


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

def fetch_act_rules() -> dict[str, list[str]]:
    """
    Download ACT rules JSON and return a mapping:
      { "X.Y.Z": ["rule_id", ...], ... }
    """
    sc_to_act: dict[str, list[str]] = {}
    raw = fetch_text(ACT_RULES_URL)
    if raw is None:
        return sc_to_act
    try:
        rules = json.loads(raw)
    except json.JSONDecodeError as exc:
        print(f"  WARNING: ACT rules JSON decode error: {exc}", file=sys.stderr)
        return sc_to_act

    # The rules.json structure may vary; support both list and dict forms.
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
    return sc_to_act


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

def merge_into_spine(spine: dict, act_map: dict, roles_map: dict, tasks_map: dict) -> None:
    """Merge fetched data into the in-memory spine (mutates in place)."""
    sc_dict = spine.get("success_criteria", {})
    for sc_num, entry in sc_dict.items():
        # --- ACT ---
        live_act = act_map.get(sc_num, [])
        if live_act:
            merged_act = sorted(set(entry["automation"]["act"]) | set(live_act))
            entry["automation"]["act"] = merged_act

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
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    print("Loading seed data …")
    spine = load_seed()

    print("Fetching ACT rules …")
    act_map = fetch_act_rules()
    print(f"  → {sum(len(v) for v in act_map.values())} ACT rule/SC mappings found")

    print("Fetching ARRM roles …")
    roles_map = fetch_arrm_roles()
    print(f"  → {sum(len(v) for v in roles_map.values())} role/SC mappings found")

    print("Fetching ARRM tasks …")
    tasks_map = fetch_arrm_tasks()
    print(f"  → {sum(len(v) for v in tasks_map.values())} task/SC mappings found")

    print("Merging data …")
    merge_into_spine(spine, act_map, roles_map, tasks_map)

    spine["meta"]["generated"] = date.today().isoformat()

    print(f"Writing {OUTPUT_FILE} …")
    with OUTPUT_FILE.open("w", encoding="utf-8") as fh:
        json.dump(spine, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    total_sc = len(spine.get("success_criteria", {}))
    print(f"Done — {total_sc} Success Criteria written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
