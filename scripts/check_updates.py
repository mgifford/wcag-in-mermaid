#!/usr/bin/env python3
"""
WCAG Spine – Update Checker

Compares upstream source versions and rule counts against what is recorded in
master_spine.json and writes a Markdown report summarising any changes.

Exits with code 1 when at least one upstream value has changed, so that a
calling GitHub Actions workflow can decide to open an issue.

Checks performed
----------------
1. axe-core latest version      (npm dist-tags)
2. Alfa latest version           (npm dist-tags for @siteimprove/alfa-rules)
3. ACT rules total count         (W3C rules.json)
4. New ACT rule IDs not yet in   the local spine (signals newly published rules)
5. WCAG document Last-Modified   header (signals any W3C WCAG 2.2 update)
"""

import json
import os
import sys
import urllib.request
import urllib.error
from datetime import date
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths & shared constants
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
SPINE_FILE = DATA_DIR / "master_spine.json"

# npm dist-tags endpoints
AXE_DIST_TAGS_URL = "https://registry.npmjs.org/-/package/axe-core/dist-tags"
ALFA_DIST_TAGS_URL = (
    "https://registry.npmjs.org/-/package/@siteimprove/alfa-rules/dist-tags"
)

# W3C ACT rules JSON
ACT_RULES_URL = (
    "https://www.w3.org/WAI/standards-guidelines/act/rules/data/rules.json"
)

# W3C WCAG 2.2 document (HEAD request for Last-Modified)
WCAG22_DOC_URL = "https://www.w3.org/TR/WCAG22/"

# W3C WCAG 3.0 candidate (HEAD request — 200 OK means it has been published)
WCAG30_DOC_URL = "https://www.w3.org/TR/wcag-3.0/"

# Path where the Markdown report is written (read by the workflow)
REPORT_FILE = REPO_ROOT / "update-report.md"


# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

def _request(url: str, method: str = "GET", timeout: int = 30):
    """Open *url* and return the response object, or None on failure."""
    try:
        req = urllib.request.Request(
            url,
            method=method,
            headers={
                "User-Agent": (
                    "wcag-spine-update-checker/1.0 "
                    "(https://github.com/mgifford/wcag-spine)"
                )
            },
        )
        return urllib.request.urlopen(req, timeout=timeout)  # noqa: S310
    except (urllib.error.URLError, urllib.error.HTTPError, OSError) as exc:
        print(f"  WARNING: Could not reach {url}: {exc}", file=sys.stderr)
        return None


def fetch_json(url: str) -> dict | list | None:
    """Fetch *url* and JSON-decode the response body."""
    resp = _request(url)
    if resp is None:
        return None
    try:
        return json.loads(resp.read().decode("utf-8"))
    except (json.JSONDecodeError, OSError) as exc:
        print(f"  WARNING: Could not parse JSON from {url}: {exc}", file=sys.stderr)
        return None


def fetch_last_modified(url: str) -> str | None:
    """Return the Last-Modified header for *url* (HEAD request), or None."""
    resp = _request(url, method="HEAD")
    if resp is None:
        return None
    return resp.headers.get("Last-Modified") or resp.headers.get("last-modified")


def fetch_status_code(url: str) -> int | None:
    """Return the HTTP status code for *url* (GET request), or None on error."""
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": (
                    "wcag-spine-update-checker/1.0 "
                    "(https://github.com/mgifford/wcag-spine)"
                )
            },
        )
        with urllib.request.urlopen(req, timeout=30) as resp:  # noqa: S310
            return resp.status
    except urllib.error.HTTPError as exc:
        return exc.code
    except (urllib.error.URLError, OSError):
        return None


# ---------------------------------------------------------------------------
# Individual checks
# ---------------------------------------------------------------------------

def check_axe_version(spine_meta: dict) -> dict:
    """Compare the stored axe-core version to the latest on npm."""
    stored = spine_meta.get("axe_version", "unknown")
    data = fetch_json(AXE_DIST_TAGS_URL)
    if data is None:
        return {
            "name": "axe-core version",
            "status": "error",
            "stored": stored,
            "upstream": None,
            "changed": False,
            "detail": "Could not reach npm registry.",
        }
    latest_full = data.get("latest", "")
    parts = latest_full.split(".")
    upstream = f"{parts[0]}.{parts[1]}" if len(parts) >= 2 else latest_full
    changed = upstream != stored and upstream != ""
    return {
        "name": "axe-core version",
        "status": "changed" if changed else "ok",
        "stored": stored,
        "upstream": upstream,
        "upstream_full": latest_full,
        "changed": changed,
        "detail": (
            f"npm reports `{latest_full}`; spine records `{stored}`."
            if changed
            else f"Both at `{stored}` (full: `{latest_full}`)."
        ),
    }


def check_alfa_version(spine_meta: dict) -> dict:
    """Compare the stored Alfa version to the latest on npm."""
    stored = spine_meta.get("alfa_version", "unknown")
    data = fetch_json(ALFA_DIST_TAGS_URL)
    if data is None:
        return {
            "name": "Alfa version (@siteimprove/alfa-rules)",
            "status": "error",
            "stored": stored,
            "upstream": None,
            "changed": False,
            "detail": "Could not reach npm registry.",
        }
    upstream = data.get("latest", "")
    changed = upstream != stored and upstream != ""
    return {
        "name": "Alfa version (@siteimprove/alfa-rules)",
        "status": "changed" if changed else "ok",
        "stored": stored,
        "upstream": upstream,
        "changed": changed,
        "detail": (
            f"npm reports `{upstream}`; spine records `{stored}`."
            if changed
            else f"Both at `{stored}`."
        ),
    }


def check_act_rules(spine: dict) -> dict:
    """Check total ACT rule count and discover any rules not yet in the spine."""
    data = fetch_json(ACT_RULES_URL)
    if data is None:
        return {
            "name": "ACT rules",
            "status": "error",
            "upstream_count": None,
            "spine_count": None,
            "new_rules": [],
            "changed": False,
            "detail": "Could not reach W3C ACT rules endpoint.",
        }

    rule_list = data if isinstance(data, list) else data.get("rules", [])
    upstream_ids: set[str] = {
        r.get("id", "") for r in rule_list if isinstance(r, dict) and r.get("id")
    }
    upstream_count = len(upstream_ids)

    # Collect all ACT rule IDs currently referenced in the spine
    spine_act_ids: set[str] = set()
    for entry in spine.get("success_criteria", {}).values():
        for act_id in entry.get("automation", {}).get("act", []):
            if act_id:
                spine_act_ids.add(act_id)

    new_rules = sorted(upstream_ids - spine_act_ids)
    spine_count = len(spine_act_ids)
    changed = len(new_rules) > 0

    detail_parts = [
        f"W3C catalogue: **{upstream_count}** rules total; spine references **{spine_count}** unique rule IDs."
    ]
    if new_rules:
        detail_parts.append(
            f"**{len(new_rules)} rule(s) in W3C catalogue not yet in spine:** "
            + ", ".join(f"`{r}`" for r in new_rules[:20])
            + (" …" if len(new_rules) > 20 else "")
        )
    else:
        detail_parts.append("All W3C catalogue rules are already referenced in the spine.")

    return {
        "name": "ACT rules",
        "status": "changed" if changed else "ok",
        "upstream_count": upstream_count,
        "spine_count": spine_count,
        "new_rules": new_rules,
        "changed": changed,
        "detail": "  \n".join(detail_parts),
    }


def check_wcag_document() -> dict:
    """Check whether the W3C WCAG 2.2 document has been modified recently."""
    last_mod = fetch_last_modified(WCAG22_DOC_URL)
    if last_mod is None:
        return {
            "name": "WCAG 2.2 document (Last-Modified)",
            "status": "error",
            "last_modified": None,
            "changed": False,
            "detail": "Could not reach the W3C WCAG 2.2 document.",
        }
    return {
        "name": "WCAG 2.2 document (Last-Modified)",
        "status": "ok",
        "last_modified": last_mod,
        "changed": False,
        "detail": f"W3C reports Last-Modified: `{last_mod}`. Review if unexpected.",
    }


def check_wcag30() -> dict:
    """Check whether a WCAG 3.0 document has been published at the W3C."""
    status_code = fetch_status_code(WCAG30_DOC_URL)
    published = status_code is not None and status_code == 200
    return {
        "name": "WCAG 3.0 publication",
        "status": "changed" if published else "ok",
        "http_status": status_code,
        "changed": published,
        "detail": (
            f"⚠️ WCAG 3.0 appears to be published at {WCAG30_DOC_URL} "
            f"(HTTP {status_code}). Review immediately."
            if published
            else f"Not yet published (HTTP {status_code})."
        ),
    }


# ---------------------------------------------------------------------------
# Report builder
# ---------------------------------------------------------------------------

def build_report(results: list[dict], run_date: str) -> str:
    """Return a Markdown report string from a list of check result dicts."""
    changed = [r for r in results if r.get("changed")]
    errors = [r for r in results if r.get("status") == "error"]

    lines: list[str] = [
        "## WCAG Spine – Monthly Update Check",
        "",
        f"**Run date:** {run_date}",
        "",
    ]

    if changed:
        lines += [
            f"### ⚠️ {len(changed)} change(s) detected",
            "",
            "The following upstream sources have new content that may need to be "
            "reflected in `master_spine.json` or the dashboard.",
            "",
        ]
        for r in changed:
            lines += [
                f"#### {r['name']}",
                "",
                r["detail"],
                "",
            ]
        lines += [
            "---",
            "",
            "**Recommended action:** run `python scripts/sync_data.py` locally "
            "(or trigger the *Sync Accessibility Data* workflow) to pull the latest "
            "data, review the diff, and merge.",
            "",
        ]

    if errors:
        lines += [
            f"### ⚡ {len(errors)} check(s) could not reach upstream",
            "",
        ]
        for r in errors:
            lines += [f"- **{r['name']}**: {r['detail']}"]
        lines += [""]

    lines += ["### All checks", ""]
    lines += ["| Check | Status | Detail |", "|-------|--------|--------|"]
    for r in results:
        icon = {"ok": "✅", "changed": "⚠️", "error": "❌"}.get(r["status"], "❓")
        # Collapse detail to single line for table cell
        detail_oneliner = r["detail"].replace("\n", " ").replace("  ", " ")
        lines.append(f"| {r['name']} | {icon} {r['status']} | {detail_oneliner} |")

    lines += [
        "",
        "---",
        "_Generated by `scripts/check_updates.py` – "
        "[WCAG Spine](https://github.com/mgifford/wcag-spine)_",
    ]
    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------------------
# GitHub Actions helpers
# ---------------------------------------------------------------------------

def set_gha_output(name: str, value: str) -> None:
    """Write a key=value pair to $GITHUB_OUTPUT (no-op outside GHA)."""
    gh_output = os.environ.get("GITHUB_OUTPUT")
    if not gh_output:
        return
    gh_output_path = Path(gh_output)
    if not gh_output_path.is_file():
        print(f"  WARNING: GITHUB_OUTPUT path is not a file: {gh_output}", file=sys.stderr)
        return
    with gh_output_path.open("a", encoding="utf-8") as fh:
        # Multi-line values use the heredoc syntax
        delimiter = "EOF"
        fh.write(f"{name}<<{delimiter}\n{value}\n{delimiter}\n")


def write_step_summary(content: str) -> None:
    """Append *content* to the GitHub Actions step summary."""
    gh_summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if not gh_summary:
        return
    gh_summary_path = Path(gh_summary)
    if not gh_summary_path.is_file():
        print(f"  WARNING: GITHUB_STEP_SUMMARY path is not a file: {gh_summary}", file=sys.stderr)
        return
    with gh_summary_path.open("a", encoding="utf-8") as fh:
        fh.write(content)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    print("Loading master_spine.json …")
    if not SPINE_FILE.exists():
        print(f"ERROR: {SPINE_FILE} not found.", file=sys.stderr)
        return 2
    with SPINE_FILE.open(encoding="utf-8") as fh:
        spine = json.load(fh)
    spine_meta = spine.get("meta", {})

    run_date = date.today().isoformat()
    print(f"Run date: {run_date}")

    print("Checking axe-core version …")
    axe_result = check_axe_version(spine_meta)
    print(f"  {axe_result['status']}: {axe_result['detail']}")

    print("Checking Alfa version …")
    alfa_result = check_alfa_version(spine_meta)
    print(f"  {alfa_result['status']}: {alfa_result['detail']}")

    print("Checking ACT rules …")
    act_result = check_act_rules(spine)
    print(f"  {act_result['status']}: {act_result['detail']}")

    print("Checking WCAG 2.2 document …")
    wcag22_result = check_wcag_document()
    print(f"  {wcag22_result['status']}: {wcag22_result['detail']}")

    print("Checking WCAG 3.0 publication …")
    wcag30_result = check_wcag30()
    print(f"  {wcag30_result['status']}: {wcag30_result['detail']}")

    results = [axe_result, alfa_result, act_result, wcag22_result, wcag30_result]
    report_md = build_report(results, run_date)

    # Write the report file (consumed by the workflow to populate the issue body)
    REPORT_FILE.write_text(report_md, encoding="utf-8")
    print(f"\nReport written to {REPORT_FILE}")

    # Surface in GitHub Actions step summary
    write_step_summary(report_md)

    # Signal to the workflow whether an issue should be created
    any_changed = any(r.get("changed") for r in results)
    set_gha_output("changes_detected", "true" if any_changed else "false")
    set_gha_output("report_date", run_date)

    if any_changed:
        print("\n⚠️  Changes detected — exiting with code 1.")
        return 1

    print("\n✅  No changes detected.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
