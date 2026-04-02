"""
Tests for scripts/check_updates.py

Covers all check functions and the report builder using mocked HTTP responses
and in-memory spine data so that no real network traffic is needed.
"""

import json
import os
import sys
import tempfile
import unittest
import unittest.mock as mock
from pathlib import Path
from unittest.mock import MagicMock, patch

# ---------------------------------------------------------------------------
# Make the scripts package importable without installing it as a package.
# ---------------------------------------------------------------------------
SCRIPTS_DIR = Path(__file__).resolve().parent.parent / "scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import check_updates  # noqa: E402


# ===========================================================================
# Helpers / fixtures
# ===========================================================================

def _spine_with_meta(**meta_kwargs) -> dict:
    """Return a minimal spine dict whose meta is populated from kwargs."""
    meta = {
        "axe_version": "4.10",
        "alfa_version": "0.112.0",
    }
    meta.update(meta_kwargs)
    return {"meta": meta, "success_criteria": {}}


def _spine_with_act_rules(*rule_ids: str) -> dict:
    """Return a spine dict referencing the given ACT rule IDs."""
    sc_dict = {}
    for i, rid in enumerate(rule_ids):
        sc_dict[f"1.1.{i + 1}"] = {
            "automation": {"act": [rid], "axe": [], "alfa": []},
            "manual": {"roles": [], "tt_steps": []},
        }
    return {"meta": {}, "success_criteria": sc_dict}


# ===========================================================================
# build_report
# ===========================================================================

class TestBuildReport(unittest.TestCase):
    """build_report produces a valid Markdown string from result dicts."""

    def _ok(self, name: str) -> dict:
        return {"name": name, "status": "ok", "changed": False, "detail": "All good."}

    def _changed(self, name: str) -> dict:
        return {"name": name, "status": "changed", "changed": True, "detail": "Something changed."}

    def _error(self, name: str) -> dict:
        return {"name": name, "status": "error", "changed": False, "detail": "Could not reach."}

    def test_returns_string(self):
        report = check_updates.build_report([self._ok("axe")], "2024-01-01")
        self.assertIsInstance(report, str)

    def test_contains_run_date(self):
        report = check_updates.build_report([self._ok("axe")], "2024-06-15")
        self.assertIn("2024-06-15", report)

    def test_contains_check_name_in_table(self):
        report = check_updates.build_report([self._ok("axe-core version")], "2024-01-01")
        self.assertIn("axe-core version", report)

    def test_ok_status_uses_checkmark(self):
        report = check_updates.build_report([self._ok("axe")], "2024-01-01")
        self.assertIn("✅", report)

    def test_changed_status_uses_warning(self):
        report = check_updates.build_report([self._changed("axe")], "2024-01-01")
        self.assertIn("⚠️", report)

    def test_error_status_uses_cross(self):
        report = check_updates.build_report([self._error("axe")], "2024-01-01")
        self.assertIn("❌", report)

    def test_changed_section_present_when_changes(self):
        report = check_updates.build_report([self._changed("axe")], "2024-01-01")
        self.assertIn("change(s) detected", report)

    def test_no_changed_section_when_all_ok(self):
        report = check_updates.build_report([self._ok("axe")], "2024-01-01")
        self.assertNotIn("change(s) detected", report)

    def test_error_section_present_when_errors(self):
        report = check_updates.build_report([self._error("axe")], "2024-01-01")
        self.assertIn("could not reach upstream", report)

    def test_multiple_results_all_in_table(self):
        results = [self._ok("a"), self._changed("b"), self._error("c")]
        report = check_updates.build_report(results, "2024-01-01")
        self.assertIn("| a |", report)
        self.assertIn("| b |", report)
        self.assertIn("| c |", report)

    def test_ends_with_newline(self):
        report = check_updates.build_report([self._ok("axe")], "2024-01-01")
        self.assertTrue(report.endswith("\n"))

    def test_recommended_action_present_when_changed(self):
        report = check_updates.build_report([self._changed("axe")], "2024-01-01")
        self.assertIn("sync_data.py", report)

    def test_multiline_detail_collapsed_in_table(self):
        result = {
            "name": "test",
            "status": "ok",
            "changed": False,
            "detail": "Line one.\nLine two.",
        }
        report = check_updates.build_report([result], "2024-01-01")
        # Table cells should not contain raw newlines
        table_lines = [l for l in report.splitlines() if "| test |" in l]
        self.assertTrue(len(table_lines) == 1)
        self.assertNotIn("\n", table_lines[0])


# ===========================================================================
# check_axe_version
# ===========================================================================

class TestCheckAxeVersion(unittest.TestCase):
    """check_axe_version compares stored vs npm axe-core version."""

    def _meta_with_version(self, version: str) -> dict:
        return {"axe_version": version}

    def _make_fetch(self, body):
        return patch.object(check_updates, "fetch_json", return_value=body)

    def test_detects_version_change(self):
        with self._make_fetch({"latest": "4.11.0"}):
            result = check_updates.check_axe_version(self._meta_with_version("4.10"))
        self.assertTrue(result["changed"])
        self.assertEqual(result["status"], "changed")

    def test_no_change_when_versions_match(self):
        with self._make_fetch({"latest": "4.10.2"}):
            result = check_updates.check_axe_version(self._meta_with_version("4.10"))
        self.assertFalse(result["changed"])
        self.assertEqual(result["status"], "ok")

    def test_error_status_on_fetch_failure(self):
        with self._make_fetch(None):
            result = check_updates.check_axe_version(self._meta_with_version("4.10"))
        self.assertEqual(result["status"], "error")
        self.assertFalse(result["changed"])

    def test_result_contains_name(self):
        with self._make_fetch({"latest": "4.10.0"}):
            result = check_updates.check_axe_version({})
        self.assertEqual(result["name"], "axe-core version")

    def test_upstream_field_set(self):
        with self._make_fetch({"latest": "4.11.1"}):
            result = check_updates.check_axe_version(self._meta_with_version("4.10"))
        self.assertEqual(result["upstream"], "4.11")


# ===========================================================================
# check_alfa_version
# ===========================================================================

class TestCheckAlfaVersion(unittest.TestCase):
    """check_alfa_version compares stored vs npm Alfa version."""

    def _make_fetch(self, body):
        return patch.object(check_updates, "fetch_json", return_value=body)

    def test_detects_version_change(self):
        with self._make_fetch({"latest": "0.113.0"}):
            result = check_updates.check_alfa_version({"alfa_version": "0.112.0"})
        self.assertTrue(result["changed"])

    def test_no_change_when_versions_match(self):
        with self._make_fetch({"latest": "0.112.0"}):
            result = check_updates.check_alfa_version({"alfa_version": "0.112.0"})
        self.assertFalse(result["changed"])

    def test_error_on_fetch_failure(self):
        with self._make_fetch(None):
            result = check_updates.check_alfa_version({"alfa_version": "0.112.0"})
        self.assertEqual(result["status"], "error")

    def test_unknown_stored_version(self):
        with self._make_fetch({"latest": "0.112.0"}):
            result = check_updates.check_alfa_version({})
        self.assertEqual(result["stored"], "unknown")

    def test_result_name(self):
        with self._make_fetch({"latest": "0.112.0"}):
            result = check_updates.check_alfa_version({})
        self.assertIn("Alfa", result["name"])


# ===========================================================================
# check_act_rules
# ===========================================================================

class TestCheckActRules(unittest.TestCase):
    """check_act_rules discovers new rules not yet in the spine."""

    def _make_fetch(self, body):
        return patch.object(check_updates, "fetch_json", return_value=body)

    def test_detects_new_rules(self):
        spine = _spine_with_act_rules("old-rule")
        upstream = {"rules": [{"id": "old-rule"}, {"id": "new-rule"}]}
        with self._make_fetch(upstream):
            result = check_updates.check_act_rules(spine)
        self.assertTrue(result["changed"])
        self.assertIn("new-rule", result["new_rules"])

    def test_no_change_when_all_known(self):
        spine = _spine_with_act_rules("rule-1", "rule-2")
        upstream = {"rules": [{"id": "rule-1"}, {"id": "rule-2"}]}
        with self._make_fetch(upstream):
            result = check_updates.check_act_rules(spine)
        self.assertFalse(result["changed"])
        self.assertEqual(result["new_rules"], [])

    def test_error_on_fetch_failure(self):
        spine = _spine_with_act_rules()
        with self._make_fetch(None):
            result = check_updates.check_act_rules(spine)
        self.assertEqual(result["status"], "error")

    def test_upstream_count_reported(self):
        spine = _spine_with_act_rules("rule-1")
        upstream = [{"id": "rule-1"}, {"id": "rule-2"}]  # list format
        with self._make_fetch(upstream):
            result = check_updates.check_act_rules(spine)
        self.assertEqual(result["upstream_count"], 2)

    def test_spine_count_reported(self):
        spine = _spine_with_act_rules("rule-1", "rule-2")
        upstream = {"rules": [{"id": "rule-1"}]}
        with self._make_fetch(upstream):
            result = check_updates.check_act_rules(spine)
        self.assertEqual(result["spine_count"], 2)

    def test_empty_spine_all_rules_are_new(self):
        spine = {"meta": {}, "success_criteria": {}}
        upstream = {"rules": [{"id": "brand-new"}]}
        with self._make_fetch(upstream):
            result = check_updates.check_act_rules(spine)
        self.assertIn("brand-new", result["new_rules"])

    def test_result_name(self):
        spine = _spine_with_act_rules()
        with self._make_fetch({"rules": []}):
            result = check_updates.check_act_rules(spine)
        self.assertEqual(result["name"], "ACT rules")


# ===========================================================================
# check_wcag_document
# ===========================================================================

class TestCheckWcagDocument(unittest.TestCase):
    """check_wcag_document reports the Last-Modified header."""

    def _make_fetch(self, value):
        return patch.object(check_updates, "fetch_last_modified", return_value=value)

    def test_returns_last_modified(self):
        with self._make_fetch("Mon, 01 Jan 2024 00:00:00 GMT"):
            result = check_updates.check_wcag_document()
        self.assertEqual(result["last_modified"], "Mon, 01 Jan 2024 00:00:00 GMT")
        self.assertEqual(result["status"], "ok")

    def test_error_when_unreachable(self):
        with self._make_fetch(None):
            result = check_updates.check_wcag_document()
        self.assertEqual(result["status"], "error")

    def test_never_marks_changed(self):
        with self._make_fetch("Mon, 01 Jan 2024 00:00:00 GMT"):
            result = check_updates.check_wcag_document()
        self.assertFalse(result["changed"])


# ===========================================================================
# check_wcag30
# ===========================================================================

class TestCheckWcag30(unittest.TestCase):
    """check_wcag30 flags WCAG 3.0 publication when HTTP 200 is returned."""

    def _make_fetch(self, status_code):
        return patch.object(check_updates, "fetch_status_code", return_value=status_code)

    def test_changed_when_published(self):
        with self._make_fetch(200):
            result = check_updates.check_wcag30()
        self.assertTrue(result["changed"])
        self.assertEqual(result["status"], "changed")

    def test_not_changed_when_404(self):
        with self._make_fetch(404):
            result = check_updates.check_wcag30()
        self.assertFalse(result["changed"])
        self.assertEqual(result["status"], "ok")

    def test_not_changed_when_unreachable(self):
        with self._make_fetch(None):
            result = check_updates.check_wcag30()
        self.assertFalse(result["changed"])

    def test_http_status_included_in_result(self):
        with self._make_fetch(404):
            result = check_updates.check_wcag30()
        self.assertEqual(result["http_status"], 404)


# ===========================================================================
# set_gha_output
# ===========================================================================

class TestSetGhaOutput(unittest.TestCase):
    """set_gha_output writes name=value pairs to the GITHUB_OUTPUT file."""

    def test_writes_to_github_output_file(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as fh:
            path = fh.name

        try:
            with patch.dict(os.environ, {"GITHUB_OUTPUT": path}):
                check_updates.set_gha_output("my_key", "my_value")

            content = Path(path).read_text()
            self.assertIn("my_key", content)
            self.assertIn("my_value", content)
        finally:
            Path(path).unlink(missing_ok=True)

    def test_no_op_when_env_var_missing(self):
        env_without_output = {k: v for k, v in os.environ.items() if k != "GITHUB_OUTPUT"}
        with patch.dict(os.environ, env_without_output, clear=True):
            # Should not raise
            check_updates.set_gha_output("key", "value")

    def test_no_op_when_path_not_a_file(self):
        with patch.dict(os.environ, {"GITHUB_OUTPUT": "/tmp/nonexistent_gha_output_xyz.txt"}):
            # Should not raise
            check_updates.set_gha_output("key", "value")

    def test_multiline_value_uses_heredoc(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as fh:
            path = fh.name

        try:
            with patch.dict(os.environ, {"GITHUB_OUTPUT": path}):
                check_updates.set_gha_output("report", "line1\nline2")

            content = Path(path).read_text()
            self.assertIn("EOF", content)
            self.assertIn("line1", content)
            self.assertIn("line2", content)
        finally:
            Path(path).unlink(missing_ok=True)


# ===========================================================================
# write_step_summary
# ===========================================================================

class TestWriteStepSummary(unittest.TestCase):
    """write_step_summary appends content to the GITHUB_STEP_SUMMARY file."""

    def test_appends_content(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".md", delete=False) as fh:
            path = fh.name

        try:
            with patch.dict(os.environ, {"GITHUB_STEP_SUMMARY": path}):
                check_updates.write_step_summary("## My Summary\n")

            content = Path(path).read_text()
            self.assertIn("## My Summary", content)
        finally:
            Path(path).unlink(missing_ok=True)

    def test_no_op_when_env_var_missing(self):
        env_without = {k: v for k, v in os.environ.items() if k != "GITHUB_STEP_SUMMARY"}
        with patch.dict(os.environ, env_without, clear=True):
            check_updates.write_step_summary("content")

    def test_no_op_when_path_not_a_file(self):
        with patch.dict(os.environ, {"GITHUB_STEP_SUMMARY": "/tmp/nonexistent_summary_xyz.md"}):
            check_updates.write_step_summary("content")


# ===========================================================================
# fetch_json (mocked at urllib level)
# ===========================================================================

class TestFetchJson(unittest.TestCase):
    """fetch_json decodes JSON from HTTP response body."""

    def test_returns_parsed_json(self):
        payload = json.dumps({"latest": "4.10.0"}).encode()
        fake_resp = MagicMock()
        fake_resp.read.return_value = payload
        with patch.object(check_updates, "_request", return_value=fake_resp):
            result = check_updates.fetch_json("https://example.com/")
        self.assertEqual(result, {"latest": "4.10.0"})

    def test_returns_none_on_bad_json(self):
        fake_resp = MagicMock()
        fake_resp.read.return_value = b"not json"
        with patch.object(check_updates, "_request", return_value=fake_resp):
            result = check_updates.fetch_json("https://example.com/")
        self.assertIsNone(result)

    def test_returns_none_when_request_fails(self):
        with patch.object(check_updates, "_request", return_value=None):
            result = check_updates.fetch_json("https://example.com/")
        self.assertIsNone(result)


# ===========================================================================
# fetch_last_modified (mocked)
# ===========================================================================

class TestFetchLastModified(unittest.TestCase):
    """fetch_last_modified returns the Last-Modified header value."""

    def test_returns_last_modified_header(self):
        fake_resp = MagicMock()
        fake_resp.headers.get.side_effect = lambda k: (
            "Fri, 01 Jan 2021 00:00:00 GMT" if k == "Last-Modified" else None
        )
        with patch.object(check_updates, "_request", return_value=fake_resp):
            result = check_updates.fetch_last_modified("https://example.com/")
        self.assertEqual(result, "Fri, 01 Jan 2021 00:00:00 GMT")

    def test_returns_none_when_request_fails(self):
        with patch.object(check_updates, "_request", return_value=None):
            result = check_updates.fetch_last_modified("https://example.com/")
        self.assertIsNone(result)


# ===========================================================================
# fetch_status_code (mocked)
# ===========================================================================

class TestFetchStatusCode(unittest.TestCase):
    """fetch_status_code returns the HTTP status integer."""

    def test_returns_200(self):
        import urllib.error
        # Simulate a successful response returning status 200
        fake_resp = MagicMock()
        fake_resp.status = 200
        fake_resp.__enter__ = lambda s: s
        fake_resp.__exit__ = MagicMock(return_value=False)
        with patch("urllib.request.urlopen", return_value=fake_resp):
            result = check_updates.fetch_status_code("https://example.com/")
        self.assertEqual(result, 200)

    def test_returns_404_for_http_error(self):
        import urllib.error
        with patch(
            "urllib.request.urlopen",
            side_effect=urllib.error.HTTPError(
                "https://example.com", 404, "Not Found", {}, None
            ),
        ):
            result = check_updates.fetch_status_code("https://example.com/")
        self.assertEqual(result, 404)

    def test_returns_none_on_url_error(self):
        import urllib.error
        with patch(
            "urllib.request.urlopen",
            side_effect=urllib.error.URLError("no route"),
        ):
            result = check_updates.fetch_status_code("https://example.com/")
        self.assertIsNone(result)


