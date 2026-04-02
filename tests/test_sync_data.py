"""
Tests for scripts/sync_data.py

Covers all pure helper functions and the data-merge logic using mocked HTTP
responses so that no real network traffic is needed.
"""

import json
import sys
import types
import unittest
import unittest.mock as mock
from io import StringIO
from pathlib import Path
from unittest.mock import MagicMock, patch, mock_open

# ---------------------------------------------------------------------------
# Make the scripts package importable without installing it as a package.
# ---------------------------------------------------------------------------
SCRIPTS_DIR = Path(__file__).resolve().parent.parent / "scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import sync_data  # noqa: E402 (must come after sys.path manipulation)


# ===========================================================================
# normalise_sc
# ===========================================================================

class TestNormaliseSc(unittest.TestCase):
    """normalise_sc converts various raw SC strings to canonical 'X.Y.Z' form."""

    def test_plain_dotted(self):
        self.assertEqual(sync_data.normalise_sc("1.4.3"), "1.4.3")

    def test_dotted_with_leading_text(self):
        self.assertEqual(sync_data.normalise_sc("SC 2.4.11"), "2.4.11")

    def test_success_criterion_dashed(self):
        self.assertEqual(
            sync_data.normalise_sc("success-criterion-1-1-1"), "1.1.1"
        )

    def test_wcag_prefix(self):
        self.assertEqual(sync_data.normalise_sc("wcag20:1.3.1"), "1.3.1")

    def test_dashed_digits(self):
        self.assertEqual(sync_data.normalise_sc("2-4-6"), "2.4.6")

    def test_mixed_separators(self):
        self.assertEqual(sync_data.normalise_sc("3.1-2"), "3.1.2")

    def test_triple_digit_sc(self):
        # WCAG 2.2 SCs like 2.4.11 have a two-digit third component
        self.assertEqual(sync_data.normalise_sc("2.4.11"), "2.4.11")

    def test_returns_none_for_garbage(self):
        self.assertIsNone(sync_data.normalise_sc("not a sc"))

    def test_returns_none_for_empty_string(self):
        self.assertIsNone(sync_data.normalise_sc(""))

    def test_returns_none_for_partial(self):
        self.assertIsNone(sync_data.normalise_sc("1.4"))


# ===========================================================================
# _extract_rule_ids
# ===========================================================================

class TestExtractRuleIds(unittest.TestCase):
    """_extract_rule_ids extracts rule ID strings from various list shapes."""

    def test_plain_string_list(self):
        self.assertEqual(
            sync_data._extract_rule_ids(["rule-a", "rule-b"]),
            ["rule-a", "rule-b"],
        )

    def test_dict_list_with_id_key(self):
        items = [{"id": "image-alt"}, {"id": "label"}]
        self.assertEqual(sync_data._extract_rule_ids(items), ["image-alt", "label"])

    def test_dict_list_with_ruleId_key(self):
        items = [{"ruleId": "abc123"}]
        self.assertEqual(sync_data._extract_rule_ids(items), ["abc123"])

    def test_dict_list_with_rule_key(self):
        items = [{"rule": "color-contrast"}]
        self.assertEqual(sync_data._extract_rule_ids(items), ["color-contrast"])

    def test_empty_string_in_list_skipped(self):
        self.assertEqual(sync_data._extract_rule_ids([""]), [])

    def test_non_list_input_returns_empty(self):
        self.assertEqual(sync_data._extract_rule_ids(None), [])
        self.assertEqual(sync_data._extract_rule_ids({"id": "x"}), [])

    def test_empty_list(self):
        self.assertEqual(sync_data._extract_rule_ids([]), [])

    def test_dict_with_empty_id_falls_through_to_ruleId(self):
        items = [{"id": "", "ruleId": "fallback"}]
        self.assertEqual(sync_data._extract_rule_ids(items), ["fallback"])


# ===========================================================================
# _extract_implementations
# ===========================================================================

class TestExtractImplementations(unittest.TestCase):
    """_extract_implementations parses both dict and list formats."""

    def test_dict_format_consistent_key(self):
        rule = {
            "implementations": {
                "consistent": {
                    "axe-core": [{"id": "image-alt"}],
                    "Alfa": [{"id": "SIA-R2"}],
                }
            }
        }
        result = sync_data._extract_implementations(rule)
        self.assertEqual(result["axe"], ["image-alt"])
        self.assertEqual(result["alfa"], ["SIA-R2"])
        self.assertEqual(result["equal_access"], [])
        self.assertEqual(result["qualweb"], [])

    def test_dict_format_multiple_levels(self):
        rule = {
            "implementations": {
                "consistent": {"axe-core": [{"id": "rule-1"}]},
                "partial": {"axe-core": [{"id": "rule-2"}]},
            }
        }
        result = sync_data._extract_implementations(rule)
        self.assertIn("rule-1", result["axe"])
        self.assertIn("rule-2", result["axe"])

    def test_dict_format_deduplicates(self):
        rule = {
            "implementations": {
                "consistent": {"axe-core": [{"id": "rule-1"}]},
                "partial":    {"axe-core": [{"id": "rule-1"}]},
            }
        }
        result = sync_data._extract_implementations(rule)
        self.assertEqual(result["axe"].count("rule-1"), 1)

    def test_list_format_axe(self):
        rule = {
            "implementations": [
                {"technology": "axe-core", "rule": "image-alt"},
            ]
        }
        result = sync_data._extract_implementations(rule)
        self.assertEqual(result["axe"], ["image-alt"])

    def test_list_format_alfa(self):
        rule = {
            "implementations": [
                {"technology": "Alfa", "rule": "SIA-R2"},
            ]
        }
        result = sync_data._extract_implementations(rule)
        self.assertEqual(result["alfa"], ["SIA-R2"])

    def test_list_format_equal_access(self):
        rule = {
            "implementations": [
                {"technology": "Equal Access", "rule": "IBMA_Color_Contrast_WCAG2AA"},
            ]
        }
        result = sync_data._extract_implementations(rule)
        self.assertIn("IBMA_Color_Contrast_WCAG2AA", result["equal_access"])

    def test_list_format_qualweb(self):
        rule = {
            "implementations": [
                {"technology": "QualWeb", "rule": "QW-ACT-R4"},
            ]
        }
        result = sync_data._extract_implementations(rule)
        self.assertIn("QW-ACT-R4", result["qualweb"])

    def test_list_format_empty_rule_id_skipped(self):
        rule = {
            "implementations": [
                {"technology": "axe-core", "rule": ""},
            ]
        }
        result = sync_data._extract_implementations(rule)
        self.assertEqual(result["axe"], [])

    def test_no_implementations_key(self):
        result = sync_data._extract_implementations({})
        self.assertEqual(result["axe"], [])
        self.assertEqual(result["alfa"], [])

    def test_axe_alias_key(self):
        rule = {
            "implementations": {
                "consistent": {"axe": [{"id": "rule-x"}]}
            }
        }
        result = sync_data._extract_implementations(rule)
        self.assertEqual(result["axe"], ["rule-x"])


# ===========================================================================
# _extract_act_id_from_url
# ===========================================================================

class TestExtractActIdFromUrl(unittest.TestCase):
    """_extract_act_id_from_url extracts 6-char ACT rule IDs."""

    def test_url_with_trailing_slash(self):
        url = "https://www.w3.org/WAI/standards-guidelines/act/rules/09o5cg/"
        self.assertEqual(sync_data._extract_act_id_from_url(url), "09o5cg")

    def test_url_without_trailing_slash(self):
        url = "https://act-rules.github.io/rules/b49b2e"
        self.assertEqual(sync_data._extract_act_id_from_url(url), "b49b2e")

    def test_plain_6_char_id(self):
        self.assertEqual(sync_data._extract_act_id_from_url("09o5cg"), "09o5cg")

    def test_invalid_id_returns_none(self):
        self.assertIsNone(sync_data._extract_act_id_from_url("not-an-act-id"))

    def test_empty_string_returns_none(self):
        self.assertIsNone(sync_data._extract_act_id_from_url(""))

    def test_seven_char_plain_id_returns_none(self):
        self.assertIsNone(sync_data._extract_act_id_from_url("abcdefg"))


# ===========================================================================
# _extract_alfa_id_from_url
# ===========================================================================

class TestExtractAlfaIdFromUrl(unittest.TestCase):
    """_extract_alfa_id_from_url extracts SIA-RXX Alfa rule IDs."""

    def test_url_with_lowercase(self):
        url = "https://alfa.siteimprove.com/rules/sia-r66"
        self.assertEqual(sync_data._extract_alfa_id_from_url(url), "SIA-R66")

    def test_plain_id_lowercase(self):
        self.assertEqual(sync_data._extract_alfa_id_from_url("sia-r2"), "SIA-R2")

    def test_plain_id_uppercase(self):
        self.assertEqual(sync_data._extract_alfa_id_from_url("SIA-R100"), "SIA-R100")

    def test_underscore_variant_url(self):
        url = "https://alfa.siteimprove.com/rules/sia-r3"
        self.assertEqual(sync_data._extract_alfa_id_from_url(url), "SIA-R3")

    def test_invalid_returns_none(self):
        self.assertIsNone(sync_data._extract_alfa_id_from_url("not-an-alfa-rule"))

    def test_empty_string_returns_none(self):
        self.assertIsNone(sync_data._extract_alfa_id_from_url(""))


# ===========================================================================
# _parse_earl_assertions
# ===========================================================================

class TestParseEarlAssertions(unittest.TestCase):
    """_parse_earl_assertions handles multiple EARL JSON shapes."""

    def test_plain_list(self):
        data = [{"test": "a"}, {"test": "b"}]
        self.assertEqual(sync_data._parse_earl_assertions(data), data)

    def test_graph_key(self):
        items = [{"earl:test": "x"}]
        data = {"@graph": items}
        self.assertEqual(sync_data._parse_earl_assertions(data), items)

    def test_assertions_key(self):
        items = [{"subject": "y"}]
        data = {"assertions": items}
        self.assertEqual(sync_data._parse_earl_assertions(data), items)

    def test_results_key(self):
        items = [{"result": "z"}]
        data = {"results": items}
        self.assertEqual(sync_data._parse_earl_assertions(data), items)

    def test_empty_graph_falls_through_to_assertions(self):
        items = [{"x": 1}]
        data = {"@graph": [], "assertions": items}
        # Empty @graph is falsy — falls through to assertions
        self.assertEqual(sync_data._parse_earl_assertions(data), items)

    def test_non_dict_non_list_returns_empty(self):
        self.assertEqual(sync_data._parse_earl_assertions("string"), [])
        self.assertEqual(sync_data._parse_earl_assertions(42), [])
        self.assertEqual(sync_data._parse_earl_assertions(None), [])

    def test_empty_dict_returns_empty(self):
        self.assertEqual(sync_data._parse_earl_assertions({}), [])


# ===========================================================================
# _parse_axe_rule_tags
# ===========================================================================

class TestParseAxeRuleTags(unittest.TestCase):
    """_parse_axe_rule_tags converts axe tag strings to canonical SC numbers."""

    def test_three_digit_sc(self):
        self.assertIn("1.4.3", sync_data._parse_axe_rule_tags(["wcag143"]))

    def test_four_digit_sc(self):
        self.assertIn("1.4.11", sync_data._parse_axe_rule_tags(["wcag1411"]))

    def test_level_tag_ignored(self):
        self.assertEqual(sync_data._parse_axe_rule_tags(["wcag2a"]), [])
        self.assertEqual(sync_data._parse_axe_rule_tags(["wcag21aa"]), [])

    def test_mixed_tags(self):
        result = sync_data._parse_axe_rule_tags(["wcag2a", "wcag143", "best-practice"])
        self.assertEqual(result, ["1.4.3"])

    def test_empty_list(self):
        self.assertEqual(sync_data._parse_axe_rule_tags([]), [])

    def test_case_insensitive(self):
        self.assertIn("1.4.3", sync_data._parse_axe_rule_tags(["WCAG143"]))

    def test_multiple_scs(self):
        result = sync_data._parse_axe_rule_tags(["wcag111", "wcag246"])
        self.assertIn("1.1.1", result)
        self.assertIn("2.4.6", result)

    def test_principle_2_sc(self):
        self.assertIn("2.4.10", sync_data._parse_axe_rule_tags(["wcag2410"]))


# ===========================================================================
# sanitise_id / sanitise_label
# ===========================================================================

class TestSanitiseHelpers(unittest.TestCase):
    """sanitise_id and sanitise_label produce safe Mermaid strings."""

    def test_sanitise_id_replaces_dots(self):
        self.assertEqual(sync_data.sanitise_id("1.4.3"), "1_4_3")

    def test_sanitise_id_replaces_spaces(self):
        self.assertEqual(sync_data.sanitise_id("my label"), "my_label")

    def test_sanitise_id_keeps_alphanumeric(self):
        self.assertEqual(sync_data.sanitise_id("Node123"), "Node123")

    def test_sanitise_id_replaces_special_chars(self):
        result = sync_data.sanitise_id("a:b/c-d")
        self.assertNotIn(":", result)
        self.assertNotIn("/", result)
        self.assertNotIn("-", result)

    def test_sanitise_label_wraps_in_quotes(self):
        result = sync_data.sanitise_label("Hello World")
        self.assertTrue(result.startswith('["'))
        self.assertTrue(result.endswith('"]'))

    def test_sanitise_label_escapes_double_quotes(self):
        result = sync_data.sanitise_label('Say "hello"')
        self.assertNotIn('"hello"', result)
        self.assertIn("'hello'", result)

    def test_sanitise_label_empty_string(self):
        result = sync_data.sanitise_label("")
        self.assertEqual(result, '[""]')


# ===========================================================================
# _tt_sc_url
# ===========================================================================

class TestTtScUrl(unittest.TestCase):
    """_tt_sc_url returns correct TrustedTester page URLs."""

    def test_known_sc_returns_specific_page(self):
        url = sync_data._tt_sc_url("1.1.1")
        self.assertTrue(url.startswith(sync_data.TT_BASE_URL))
        self.assertNotEqual(url, sync_data.TT_BASE_URL + "appendixa.html")

    def test_unknown_sc_falls_back_to_appendixa(self):
        url = sync_data._tt_sc_url("9.9.9")
        self.assertEqual(url, sync_data.TT_BASE_URL + "appendixa.html")

    def test_url_contains_base(self):
        url = sync_data._tt_sc_url("2.1.1")
        self.assertTrue(url.startswith("https://section508coordinators.github.io/TrustedTester/"))


# ===========================================================================
# _empty_impl
# ===========================================================================

class TestEmptyImpl(unittest.TestCase):
    """_empty_impl returns a fresh dict with all engine keys set to []."""

    def test_has_all_engine_keys(self):
        impl = sync_data._empty_impl()
        for engine in sync_data.IMPL_ENGINES:
            self.assertIn(engine, impl)
            self.assertEqual(impl[engine], [])

    def test_is_independent_instance(self):
        a = sync_data._empty_impl()
        b = sync_data._empty_impl()
        a["axe"].append("rule-x")
        self.assertEqual(b["axe"], [])


# ===========================================================================
# fetch_text (mocked)
# ===========================================================================

class TestFetchText(unittest.TestCase):
    """fetch_text returns decoded body on success and None on failure."""

    def test_returns_body_on_success(self):
        fake_resp = MagicMock()
        fake_resp.read.return_value = b"hello world"
        fake_resp.__enter__ = lambda s: s
        fake_resp.__exit__ = MagicMock(return_value=False)

        with patch("urllib.request.urlopen", return_value=fake_resp):
            result = sync_data.fetch_text("https://example.com/data")
        self.assertEqual(result, "hello world")

    def test_returns_none_on_url_error(self):
        import urllib.error
        with patch(
            "urllib.request.urlopen",
            side_effect=urllib.error.URLError("timeout"),
        ):
            result = sync_data.fetch_text("https://example.com/data")
        self.assertIsNone(result)

    def test_returns_none_on_http_error(self):
        import urllib.error
        with patch(
            "urllib.request.urlopen",
            side_effect=urllib.error.HTTPError(
                "https://example.com", 404, "Not Found", {}, None
            ),
        ):
            result = sync_data.fetch_text("https://example.com/missing")
        self.assertIsNone(result)


# ===========================================================================
# fetch_axe_version (mocked)
# ===========================================================================

class TestFetchAxeVersion(unittest.TestCase):
    """fetch_axe_version resolves the latest axe-core major.minor."""

    def _make_fetch(self, body: str | None):
        return patch.object(sync_data, "fetch_text", return_value=body)

    def test_extracts_major_minor(self):
        payload = json.dumps({"latest": "4.10.2"})
        with self._make_fetch(payload):
            result = sync_data.fetch_axe_version()
        self.assertEqual(result, "4.10")

    def test_fallback_on_none(self):
        with self._make_fetch(None):
            result = sync_data.fetch_axe_version()
        self.assertEqual(result, sync_data.AXE_VERSION_FALLBACK)

    def test_fallback_on_bad_json(self):
        with self._make_fetch("not json"):
            result = sync_data.fetch_axe_version()
        self.assertEqual(result, sync_data.AXE_VERSION_FALLBACK)

    def test_fallback_on_unexpected_version_format(self):
        payload = json.dumps({"latest": "4"})
        with self._make_fetch(payload):
            result = sync_data.fetch_axe_version()
        self.assertEqual(result, sync_data.AXE_VERSION_FALLBACK)


# ===========================================================================
# fetch_alfa_version (mocked)
# ===========================================================================

class TestFetchAlfaVersion(unittest.TestCase):
    """fetch_alfa_version returns a full semver string or None on failure."""

    def _make_fetch(self, body: str | None):
        return patch.object(sync_data, "fetch_text", return_value=body)

    def test_returns_latest_version(self):
        payload = json.dumps({"latest": "0.112.0"})
        with self._make_fetch(payload):
            result = sync_data.fetch_alfa_version()
        self.assertEqual(result, "0.112.0")

    def test_returns_none_on_http_failure(self):
        with self._make_fetch(None):
            result = sync_data.fetch_alfa_version()
        self.assertIsNone(result)

    def test_returns_none_on_missing_key(self):
        payload = json.dumps({"other": "value"})
        with self._make_fetch(payload):
            result = sync_data.fetch_alfa_version()
        self.assertIsNone(result)


# ===========================================================================
# fetch_fpc_map (mocked)
# ===========================================================================

class TestFetchFpcMap(unittest.TestCase):
    """fetch_fpc_map parses the Section 508 FPC CSV."""

    # Minimal CSV matching the expected column structure.
    # The LLCLA column name contains a comma, so it must be CSV-quoted.
    _CSV = (
        'WCAG 2.0 SC,Without Vision (WV),Limited Vision (LV),'
        'Without Perception of Color (WPC),Without Hearing (WH),'
        'Limited Hearing (LH),Without Speech (WS),'
        'Limited Manipulation (LM),Limited Reach and Strength (LRS),'
        '"Limited Language, Cognitive, and Learning Abilities (LLCLA)"\r\n'
        "1.1.1,WV,LV,,,,,,,LLCLA\r\n"
        "2.4.6,,,,,,,,,\r\n"
    )

    def test_parses_fpc_codes(self):
        with patch.object(sync_data, "fetch_text", return_value=self._CSV):
            result = sync_data.fetch_fpc_map()
        self.assertIn("1.1.1", result)
        self.assertIn("WV", result["1.1.1"])
        self.assertIn("LV", result["1.1.1"])
        self.assertIn("LLCLA", result["1.1.1"])

    def test_empty_fpc_list_for_sc_with_no_codes(self):
        with patch.object(sync_data, "fetch_text", return_value=self._CSV):
            result = sync_data.fetch_fpc_map()
        self.assertEqual(result.get("2.4.6"), [])

    def test_returns_empty_on_http_failure(self):
        with patch.object(sync_data, "fetch_text", return_value=None):
            result = sync_data.fetch_fpc_map()
        self.assertEqual(result, {})

    def test_returns_empty_on_bad_csv(self):
        with patch.object(sync_data, "fetch_text", return_value="not,a,valid,csv\n"):
            result = sync_data.fetch_fpc_map()
        # No sc-num column so no entries should be produced
        self.assertEqual(result, {})


# ===========================================================================
# fetch_act_rules (mocked)
# ===========================================================================

class TestFetchActRules(unittest.TestCase):
    """fetch_act_rules handles both the wcag-mapping.json and legacy formats."""

    # ---------- wcag-mapping.json (current format) ----------

    def _wcag_mapping_payload(self):
        return json.dumps({
            "act-rules": [
                {
                    "frontmatter": {
                        "id": "09o5cg",
                        "accessibility_requirements": {
                            "wcag20:1.4.3": {"forConformance": True},
                            "wcag20:1.4.6": {"forConformance": False},
                        },
                    }
                },
                {
                    "frontmatter": {
                        "id": "abc123",
                        "accessibility_requirements": {
                            "wcag21:1.3.5": {"forConformance": True},
                        },
                    },
                    "deprecated": True,  # Should be skipped
                },
            ]
        })

    def test_wcag_mapping_parses_sc(self):
        with patch.object(sync_data, "fetch_text", return_value=self._wcag_mapping_payload()):
            sc_map, _ = sync_data.fetch_act_rules()
        self.assertIn("09o5cg", sc_map.get("1.4.3", []))
        self.assertIn("09o5cg", sc_map.get("1.4.6", []))

    def test_deprecated_rules_skipped(self):
        with patch.object(sync_data, "fetch_text", return_value=self._wcag_mapping_payload()):
            sc_map, _ = sync_data.fetch_act_rules()
        for sc_rules in sc_map.values():
            self.assertNotIn("abc123", sc_rules)

    def test_returns_empty_on_http_failure(self):
        with patch.object(sync_data, "fetch_text", return_value=None):
            sc_map, impls = sync_data.fetch_act_rules()
        self.assertEqual(sc_map, {})
        self.assertEqual(impls, {})

    def test_returns_empty_on_bad_json(self):
        with patch.object(sync_data, "fetch_text", return_value="not json"):
            sc_map, impls = sync_data.fetch_act_rules()
        self.assertEqual(sc_map, {})

    # ---------- Legacy rules.json (list format) ----------

    def _legacy_list_payload(self):
        return json.dumps([
            {"id": "legacy-rule", "successCriteria": ["1.1.1", "1.4.3"]},
        ])

    def test_legacy_list_format(self):
        with patch.object(sync_data, "fetch_text", return_value=self._legacy_list_payload()):
            sc_map, _ = sync_data.fetch_act_rules()
        self.assertIn("legacy-rule", sc_map.get("1.1.1", []))
        self.assertIn("legacy-rule", sc_map.get("1.4.3", []))

    def _legacy_dict_payload(self):
        return json.dumps({
            "rules": [
                {"id": "dict-rule", "successCriteria": ["2.4.6"]},
            ]
        })

    def test_legacy_dict_format(self):
        with patch.object(sync_data, "fetch_text", return_value=self._legacy_dict_payload()):
            sc_map, _ = sync_data.fetch_act_rules()
        self.assertIn("dict-rule", sc_map.get("2.4.6", []))

    def test_no_duplicate_rule_ids_per_sc(self):
        payload = json.dumps({
            "act-rules": [
                {
                    "frontmatter": {
                        "id": "dup-rule",
                        "accessibility_requirements": {
                            "wcag20:1.4.3": {},
                        },
                    }
                },
                {
                    "frontmatter": {
                        "id": "dup-rule",
                        "accessibility_requirements": {
                            "wcag20:1.4.3": {},
                        },
                    }
                },
            ]
        })
        with patch.object(sync_data, "fetch_text", return_value=payload):
            sc_map, _ = sync_data.fetch_act_rules()
        self.assertEqual(sc_map.get("1.4.3", []).count("dup-rule"), 1)


# ===========================================================================
# fetch_act_testcases_sc_map (mocked)
# ===========================================================================

class TestFetchActTestcasesScMap(unittest.TestCase):
    """fetch_act_testcases_sc_map builds SC-to-ACT map from testcases.json."""

    def _payload(self):
        return json.dumps([
            {"ruleId": "09o5cg", "successCriteria": ["1.4.3", "1.4.6"]},
            {"ruleId": "abc123", "successCriteria": ["1.1.1"]},
            {"ruleId": "", "successCriteria": ["1.1.1"]},  # Should be skipped
        ])

    def test_parses_testcases(self):
        with patch.object(sync_data, "fetch_text", return_value=self._payload()):
            result = sync_data.fetch_act_testcases_sc_map()
        self.assertIn("09o5cg", result.get("1.4.3", []))
        self.assertIn("09o5cg", result.get("1.4.6", []))
        self.assertIn("abc123", result.get("1.1.1", []))

    def test_skips_empty_rule_ids(self):
        with patch.object(sync_data, "fetch_text", return_value=self._payload()):
            result = sync_data.fetch_act_testcases_sc_map()
        self.assertNotIn("", result.get("1.1.1", []))

    def test_returns_empty_on_http_failure(self):
        with patch.object(sync_data, "fetch_text", return_value=None):
            result = sync_data.fetch_act_testcases_sc_map()
        self.assertEqual(result, {})

    def test_testcases_dict_format(self):
        payload = json.dumps({"testcases": [
            {"ruleId": "xyz789", "successCriteria": ["2.1.1"]},
        ]})
        with patch.object(sync_data, "fetch_text", return_value=payload):
            result = sync_data.fetch_act_testcases_sc_map()
        self.assertIn("xyz789", result.get("2.1.1", []))

    def test_sc_as_string_normalised(self):
        payload = json.dumps([{"ruleId": "r1", "sc": "1.3.1"}])
        with patch.object(sync_data, "fetch_text", return_value=payload):
            result = sync_data.fetch_act_testcases_sc_map()
        self.assertIn("r1", result.get("1.3.1", []))


# ===========================================================================
# fetch_arrm_roles (mocked)
# ===========================================================================

class TestFetchArrmRoles(unittest.TestCase):
    """fetch_arrm_roles builds SC-to-roles map from arrm-wcag-sc.csv."""

    _CSV = "sc_num,role\n1.1.1,Front-End Development\n1.1.1,Content Authoring\n2.4.6,UX Design\n"

    def test_parses_roles(self):
        with patch.object(sync_data, "fetch_text", return_value=self._CSV):
            result = sync_data.fetch_arrm_roles()
        self.assertIn("Front-End Development", result.get("1.1.1", []))
        self.assertIn("Content Authoring", result.get("1.1.1", []))
        self.assertIn("UX Design", result.get("2.4.6", []))

    def test_no_duplicate_roles(self):
        csv = "sc_num,role\n1.1.1,Content Authoring\n1.1.1,Content Authoring\n"
        with patch.object(sync_data, "fetch_text", return_value=csv):
            result = sync_data.fetch_arrm_roles()
        self.assertEqual(result["1.1.1"].count("Content Authoring"), 1)

    def test_returns_empty_on_http_failure(self):
        with patch.object(sync_data, "fetch_text", return_value=None):
            result = sync_data.fetch_arrm_roles()
        self.assertEqual(result, {})

    def test_skips_rows_with_no_sc_number(self):
        csv = "sc_num,role\n,Content Authoring\n"
        with patch.object(sync_data, "fetch_text", return_value=csv):
            result = sync_data.fetch_arrm_roles()
        self.assertEqual(result, {})

    def test_skips_rows_with_no_role(self):
        csv = "sc_num,role\n1.1.1,\n"
        with patch.object(sync_data, "fetch_text", return_value=csv):
            result = sync_data.fetch_arrm_roles()
        self.assertEqual(result, {})


# ===========================================================================
# fetch_arrm_tasks (mocked)
# ===========================================================================

class TestFetchArrmTasks(unittest.TestCase):
    """fetch_arrm_tasks builds SC-to-tasks map from arrm-all-tasks.csv."""

    _CSV = (
        "WCAG SC,ID,Task,Primary Ownership,Secondary Ownership\n"
        "1.1.1,IMG-001,Provide text alternatives,Content Authoring,Front-End Development\n"
        "1.1.1,IMG-002,Use longdesc for complex images,Content Authoring,None\n"
        "2.4.6,NAV-001,Use descriptive headings,Content Authoring,\n"
    )

    def test_parses_tasks(self):
        with patch.object(sync_data, "fetch_text", return_value=self._CSV):
            result = sync_data.fetch_arrm_tasks()
        tasks_111 = result.get("1.1.1", [])
        self.assertEqual(len(tasks_111), 2)
        self.assertEqual(tasks_111[0]["id"], "IMG-001")
        self.assertEqual(tasks_111[0]["task"], "Provide text alternatives")
        self.assertEqual(tasks_111[0]["primary_ownership"], "Content Authoring")
        self.assertEqual(tasks_111[0]["secondary_ownership"], "Front-End Development")

    def test_none_secondary_ownership_becomes_empty_string(self):
        with patch.object(sync_data, "fetch_text", return_value=self._CSV):
            result = sync_data.fetch_arrm_tasks()
        task = result["1.1.1"][1]
        self.assertEqual(task["secondary_ownership"], "")

    def test_no_duplicate_task_ids(self):
        csv = (
            "WCAG SC,ID,Task,Primary Ownership,Secondary Ownership\n"
            "1.1.1,IMG-001,Task A,Content Authoring,\n"
            "1.1.1,IMG-001,Task A duplicate,Content Authoring,\n"
        )
        with patch.object(sync_data, "fetch_text", return_value=csv):
            result = sync_data.fetch_arrm_tasks()
        ids = [t["id"] for t in result.get("1.1.1", [])]
        self.assertEqual(ids.count("IMG-001"), 1)

    def test_returns_empty_on_http_failure(self):
        with patch.object(sync_data, "fetch_text", return_value=None):
            result = sync_data.fetch_arrm_tasks()
        self.assertEqual(result, {})

    def test_task_has_category_url(self):
        with patch.object(sync_data, "fetch_text", return_value=self._CSV):
            result = sync_data.fetch_arrm_tasks()
        task = result["1.1.1"][0]
        self.assertIn("category_url", task)
        self.assertTrue(task["category_url"].startswith("http"))

    def test_task_has_role_url(self):
        with patch.object(sync_data, "fetch_text", return_value=self._CSV):
            result = sync_data.fetch_arrm_tasks()
        task = result["1.1.1"][0]
        self.assertIn("role_url", task)


# ===========================================================================
# merge_into_spine
# ===========================================================================

def _make_spine(sc_num: str = "1.4.3") -> dict:
    """Return a minimal valid spine dict with a single SC entry."""
    return {
        "meta": {"act_implementations": {}},
        "success_criteria": {
            sc_num: {
                "title": "Contrast (Minimum)",
                "level": "AA",
                "principle": "Perceivable",
                "url": f"https://www.w3.org/TR/WCAG22/#contrast-minimum",
                "automation": {"act": [], "axe": [], "alfa": []},
                "manual": {"roles": [], "tt_steps": [], "arrm_tasks": []},
            }
        },
    }


class TestMergeIntoSpine(unittest.TestCase):
    """merge_into_spine correctly mutates the in-memory spine dict."""

    def test_merges_act_rules(self):
        spine = _make_spine("1.4.3")
        sync_data.merge_into_spine(spine, {"1.4.3": ["09o5cg"]}, {}, {})
        self.assertIn("09o5cg", spine["success_criteria"]["1.4.3"]["automation"]["act"])

    def test_merges_axe_rules(self):
        spine = _make_spine("1.4.3")
        sync_data.merge_into_spine(spine, {}, {}, {}, axe_map={"1.4.3": ["color-contrast"]})
        self.assertIn("color-contrast", spine["success_criteria"]["1.4.3"]["automation"]["axe"])

    def test_merges_alfa_rules(self):
        spine = _make_spine("1.4.3")
        sync_data.merge_into_spine(spine, {}, {}, {}, alfa_map={"1.4.3": ["SIA-R69"]})
        self.assertIn("SIA-R69", spine["success_criteria"]["1.4.3"]["automation"]["alfa"])

    def test_merges_roles(self):
        spine = _make_spine("1.4.3")
        sync_data.merge_into_spine(spine, {}, {"1.4.3": ["Visual Design"]}, {})
        self.assertIn("Visual Design", spine["success_criteria"]["1.4.3"]["manual"]["roles"])

    def test_merges_arrm_tasks(self):
        spine = _make_spine("1.4.3")
        task = {
            "id": "CSS-001",
            "task": "Use sufficient contrast",
            "primary_ownership": "Visual Design",
            "secondary_ownership": "",
            "category_url": "https://www.w3.org/WAI/planning/arrm/tasks/",
            "role_url": "",
        }
        sync_data.merge_into_spine(spine, {}, {}, {"1.4.3": [task]})
        self.assertEqual(len(spine["success_criteria"]["1.4.3"]["manual"]["arrm_tasks"]), 1)
        self.assertEqual(
            spine["success_criteria"]["1.4.3"]["manual"]["arrm_tasks"][0]["id"], "CSS-001"
        )

    def test_no_duplicate_act_rules(self):
        spine = _make_spine("1.4.3")
        spine["success_criteria"]["1.4.3"]["automation"]["act"] = ["09o5cg"]
        sync_data.merge_into_spine(spine, {"1.4.3": ["09o5cg"]}, {}, {})
        act = spine["success_criteria"]["1.4.3"]["automation"]["act"]
        self.assertEqual(act.count("09o5cg"), 1)

    def test_fpc_written_when_provided(self):
        spine = _make_spine("1.4.3")
        sync_data.merge_into_spine(spine, {}, {}, {}, fpc_map={"1.4.3": ["WV", "LV"]})
        self.assertEqual(spine["success_criteria"]["1.4.3"]["fpc"], ["WV", "LV"])

    def test_fpc_empty_list_when_not_in_sc(self):
        spine = _make_spine("1.4.3")
        sync_data.merge_into_spine(spine, {}, {}, {}, fpc_map={"2.4.6": ["WV"]})
        self.assertEqual(spine["success_criteria"]["1.4.3"].get("fpc", []), [])

    def test_propagates_engine_rules_from_act_implementations(self):
        spine = _make_spine("1.4.3")
        spine["success_criteria"]["1.4.3"]["automation"]["act"] = ["09o5cg"]
        impl_data = {"09o5cg": {"axe": ["color-contrast"], "alfa": [], "equal_access": [], "qualweb": []}}
        sync_data.merge_into_spine(spine, {}, {}, {}, act_implementations=impl_data)
        self.assertIn("color-contrast", spine["success_criteria"]["1.4.3"]["automation"]["axe"])

    def test_act_implementations_stored_in_meta(self):
        spine = _make_spine("1.4.3")
        impl_data = {"09o5cg": {"axe": ["color-contrast"], "alfa": [], "equal_access": [], "qualweb": []}}
        sync_data.merge_into_spine(spine, {}, {}, {}, act_implementations=impl_data)
        self.assertIn("09o5cg", spine["meta"]["act_implementations"])

    def test_no_duplicate_arrm_task_ids(self):
        spine = _make_spine("1.4.3")
        task = {
            "id": "CSS-001",
            "task": "Use sufficient contrast",
            "primary_ownership": "Visual Design",
            "secondary_ownership": "",
            "category_url": "https://example.com/",
            "role_url": "",
        }
        # Pre-populate with the same task
        spine["success_criteria"]["1.4.3"]["manual"]["arrm_tasks"] = [task]
        sync_data.merge_into_spine(spine, {}, {}, {"1.4.3": [task]})
        tasks = spine["success_criteria"]["1.4.3"]["manual"]["arrm_tasks"]
        self.assertEqual(len(tasks), 1)

    def test_no_duplicate_roles(self):
        spine = _make_spine("1.4.3")
        spine["success_criteria"]["1.4.3"]["manual"]["roles"] = ["Visual Design"]
        sync_data.merge_into_spine(spine, {}, {"1.4.3": ["Visual Design"]}, {})
        roles = spine["success_criteria"]["1.4.3"]["manual"]["roles"]
        self.assertEqual(roles.count("Visual Design"), 1)

    def test_sc_not_in_any_map_unchanged(self):
        spine = _make_spine("1.4.3")
        original_act = list(spine["success_criteria"]["1.4.3"]["automation"]["act"])
        sync_data.merge_into_spine(spine, {"2.4.6": ["other-rule"]}, {}, {})
        self.assertEqual(spine["success_criteria"]["1.4.3"]["automation"]["act"], original_act)


# ===========================================================================
# _build_principle_diagram
# ===========================================================================

class TestBuildPrincipleDiagram(unittest.TestCase):
    """_build_principle_diagram produces valid Mermaid diagram text."""

    def _make_sc_dict(self):
        return {
            "1.4.3": {
                "url": "https://www.w3.org/TR/WCAG22/#contrast-minimum",
                "automation": {
                    "act": ["09o5cg"],
                    "axe": ["color-contrast"],
                    "alfa": ["SIA-R69"],
                },
                "manual": {
                    "roles": ["Visual Design"],
                    "tt_steps": ["7.A - Verify contrast ratio"],
                    "arrm_tasks": [
                        {
                            "id": "CSS-001",
                            "task": "Check contrast",
                            "primary_ownership": "Visual Design",
                            "secondary_ownership": "",
                            "category_url": "https://www.w3.org/WAI/planning/arrm/tasks/",
                            "role_url": "",
                        }
                    ],
                },
            }
        }

    def test_starts_and_ends_with_mermaid_fence(self):
        diagram = sync_data._build_principle_diagram(self._make_sc_dict())
        self.assertIn("```mermaid", diagram)
        self.assertIn("```", diagram.strip().splitlines()[-1])

    def test_contains_graph_lr(self):
        diagram = sync_data._build_principle_diagram(self._make_sc_dict())
        self.assertIn("graph LR", diagram)

    def test_contains_sc_node(self):
        diagram = sync_data._build_principle_diagram(self._make_sc_dict())
        self.assertIn("N1_4_3", diagram)

    def test_contains_act_node(self):
        diagram = sync_data._build_principle_diagram(self._make_sc_dict())
        self.assertIn("A_act_1_4_3", diagram)
        self.assertIn("09o5cg", diagram)

    def test_contains_axe_node(self):
        diagram = sync_data._build_principle_diagram(self._make_sc_dict())
        self.assertIn("A_axe_1_4_3", diagram)
        self.assertIn("color-contrast", diagram)

    def test_contains_alfa_node(self):
        diagram = sync_data._build_principle_diagram(self._make_sc_dict())
        self.assertIn("A_alfa_1_4_3", diagram)
        self.assertIn("SIA-R69", diagram)

    def test_contains_role_node(self):
        diagram = sync_data._build_principle_diagram(self._make_sc_dict())
        self.assertIn("Visual Design", diagram)

    def test_contains_tt_node(self):
        diagram = sync_data._build_principle_diagram(self._make_sc_dict())
        self.assertIn("TT_1_4_3", diagram)
        self.assertIn("7.A", diagram)

    def test_contains_arrm_node(self):
        diagram = sync_data._build_principle_diagram(self._make_sc_dict())
        self.assertIn("T_1_4_3", diagram)
        self.assertIn("CSS-001", diagram)

    def test_empty_sc_dict_produces_minimal_diagram(self):
        diagram = sync_data._build_principle_diagram({})
        self.assertIn("```mermaid", diagram)
        self.assertIn("graph LR", diagram)

    def test_axe_version_in_click_url(self):
        diagram = sync_data._build_principle_diagram(self._make_sc_dict(), axe_version="4.10")
        self.assertIn("4.10", diagram)

    def test_tt_truncation_when_many_steps(self):
        sc_dict = {
            "1.4.3": {
                "url": "",
                "automation": {"act": [], "axe": [], "alfa": []},
                "manual": {
                    "roles": [],
                    "tt_steps": ["1.A - step", "1.B - step", "1.C - step", "1.D - step", "1.E - step"],
                    "arrm_tasks": [],
                },
            }
        }
        diagram = sync_data._build_principle_diagram(sc_dict)
        self.assertIn("+1 more", diagram)

    def test_arrm_truncation_when_many_tasks(self):
        tasks = [
            {"id": f"T-{i:03d}", "task": "x", "primary_ownership": "", "secondary_ownership": "",
             "category_url": "", "role_url": ""}
            for i in range(7)
        ]
        sc_dict = {
            "1.4.3": {
                "url": "",
                "automation": {"act": [], "axe": [], "alfa": []},
                "manual": {"roles": [], "tt_steps": [], "arrm_tasks": tasks},
            }
        }
        diagram = sync_data._build_principle_diagram(sc_dict)
        self.assertIn("+2 more", diagram)

    def test_click_directive_for_sc(self):
        diagram = sync_data._build_principle_diagram(self._make_sc_dict())
        self.assertIn("click N1_4_3", diagram)
        self.assertIn("https://www.w3.org/TR/WCAG22/#contrast-minimum", diagram)

    def test_role_abbreviation_applied(self):
        sc_dict = {
            "1.4.3": {
                "url": "",
                "automation": {"act": [], "axe": [], "alfa": []},
                "manual": {
                    "roles": ["Front-End Development"],
                    "tt_steps": [],
                    "arrm_tasks": [],
                },
            }
        }
        diagram = sync_data._build_principle_diagram(sc_dict)
        # "Front-End Development" → abbreviation "FE"
        self.assertIn("_FE", diagram)


