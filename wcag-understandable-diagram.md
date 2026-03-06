# WCAG 2.2 Principle 3: Understandable – Roles & Testing

Success Criteria 3.x.x (21 SCs).

SC nodes form a **vertical spine** running top to bottom in the centre.
Automated testing tools (ACT, AXE, Alfa) branch off to the **left** of each SC.
Responsible roles branch off to the **right** of each SC.
ARRM task IDs and Trusted Tester steps branch off from each SC node.
(`graph LR` is used so that root SC nodes stack vertically, not horizontally.)

**Legend**

| Colour | Meaning |
|--------|---------|
| 🔵 Blue | Success Criterion |
| 🟠 Orange | Responsible Role |
| 🟣 Purple | ACT Automated Rules |
| 🟡 Yellow | AXE Automated Rules |
| 🩷 Pink | Alfa Automated Rules |
| 🟦 Indigo | ARRM Task IDs |
| 🟩 Teal | Trusted Tester v5 |

```mermaid
graph LR
    classDef sc   fill:#e1f5fe,stroke:#01579b,color:#000
    classDef role fill:#fff3e0,stroke:#e65100,color:#000
    classDef act  fill:#f3e5f5,stroke:#6a1b9a,color:#000
    classDef axe  fill:#fffde7,stroke:#f57f17,color:#000
    classDef alfa fill:#fce4ec,stroke:#880e4f,color:#000
    classDef arrm fill:#e8eaf6,stroke:#3949ab,color:#000
    classDef tt   fill:#e0f2f1,stroke:#00695c,color:#000

    N3_1_1((3.1.1)):::sc
    A_act_3_1_1["ACT: bf051a"]:::act --> N3_1_1
    A_axe_3_1_1["AXE: html-has-lang, html-lang-valid"]:::axe --> N3_1_1
    A_alfa_3_1_1["Alfa: SIA-R4"]:::alfa --> N3_1_1
    N3_1_1 --> R3_1_1_FE["Front-End Development"]:::role
    N3_1_1 --> R3_1_1_CA["Content Authoring"]:::role
    N3_1_1 --> T_3_1_1["ARRM: SCT-020, SCT-021"]:::arrm
    N3_1_1 --> TT_3_1_1["TT: 3.1.1.A"]:::tt

    N3_1_2((3.1.2)):::sc
    A_act_3_1_2["ACT: de46e4"]:::act --> N3_1_2
    A_axe_3_1_2["AXE: valid-lang"]:::axe --> N3_1_2
    A_alfa_3_1_2["Alfa: SIA-R5"]:::alfa --> N3_1_2
    N3_1_2 --> R3_1_2_CA["Content Authoring"]:::role
    N3_1_2 --> R3_1_2_FE["Front-End Development"]:::role
    N3_1_2 --> T_3_1_2["ARRM: SCT-022"]:::arrm
    N3_1_2 --> TT_3_1_2["TT: 3.1.2.A"]:::tt

    N3_1_3((3.1.3)):::sc
    N3_1_3 --> R3_1_3_CA["Content Authoring"]:::role
    N3_1_3 --> T_3_1_3["ARRM: SCT-023, SCT-024"]:::arrm
    N3_1_3 --> TT_3_1_3["TT: 3.1.3.A"]:::tt

    N3_1_4((3.1.4)):::sc
    N3_1_4 --> R3_1_4_CA["Content Authoring"]:::role
    N3_1_4 --> T_3_1_4["ARRM: SCT-025"]:::arrm
    N3_1_4 --> TT_3_1_4["TT: 3.1.4.A"]:::tt

    N3_1_5((3.1.5)):::sc
    N3_1_5 --> R3_1_5_CA["Content Authoring"]:::role
    N3_1_5 --> T_3_1_5["ARRM: SCT-026, SCT-027, SCT-028"]:::arrm
    N3_1_5 --> TT_3_1_5["TT: 3.1.5.A"]:::tt

    N3_1_6((3.1.6)):::sc
    N3_1_6 --> R3_1_6_CA["Content Authoring"]:::role
    N3_1_6 --> T_3_1_6["ARRM: SCT-029"]:::arrm
    N3_1_6 --> TT_3_1_6["TT: 3.1.6.A"]:::tt

    N3_2_1((3.2.1)):::sc
    N3_2_1 --> R3_2_1_FE["Front-End Development"]:::role
    N3_2_1 --> T_3_2_1["ARRM: FRM-018, NAV-024"]:::arrm
    N3_2_1 --> TT_3_2_1["TT: 3.2.1.A"]:::tt

    N3_2_2((3.2.2)):::sc
    N3_2_2 --> R3_2_2_FE["Front-End Development"]:::role
    N3_2_2 --> R3_2_2_UX["UX Design"]:::role
    N3_2_2 --> T_3_2_2["ARRM: INP-024, FRM-019, FRM-020, NAV-025"]:::arrm
    N3_2_2 --> TT_3_2_2["TT: 3.2.2.A"]:::tt

    N3_2_3((3.2.3)):::sc
    N3_2_3 --> R3_2_3_UX["UX Design"]:::role
    N3_2_3 --> R3_2_3_FE["Front-End Development"]:::role
    N3_2_3 --> T_3_2_3["ARRM: NAV-026"]:::arrm
    N3_2_3 --> TT_3_2_3["TT: 3.2.3.A"]:::tt

    N3_2_4((3.2.4)):::sc
    N3_2_4 --> R3_2_4_UX["UX Design"]:::role
    N3_2_4 --> R3_2_4_CA["Content Authoring"]:::role
    N3_2_4 --> T_3_2_4["ARRM: FRM-021, FRM-022, NAV-027, NAV-028, NAV-029"]:::arrm
    N3_2_4 --> TT_3_2_4["TT: 3.2.4.A"]:::tt

    N3_2_5((3.2.5)):::sc
    N3_2_5 --> R3_2_5_UX["UX Design"]:::role
    N3_2_5 --> R3_2_5_FE["Front-End Development"]:::role
    N3_2_5 --> T_3_2_5["ARRM: NAV-030, NAV-031"]:::arrm
    N3_2_5 --> TT_3_2_5["TT: 3.2.5.A"]:::tt

    N3_2_6((3.2.6)):::sc
    A_act_3_2_6["ACT: 30b328"]:::act --> N3_2_6
    N3_2_6 --> R3_2_6_CA["Content Authoring"]:::role
    N3_2_6 --> R3_2_6_BUS["Business"]:::role
    N3_2_6 --> TT_3_2_6["TT: 3.2.6.A"]:::tt

    N3_3_1((3.3.1)):::sc
    N3_3_1 --> R3_3_1_FE["Front-End Development"]:::role
    N3_3_1 --> R3_3_1_UX["UX Design"]:::role
    N3_3_1 --> T_3_3_1["ARRM: FRM-023, FRM-024"]:::arrm
    N3_3_1 --> TT_3_3_1["TT: 3.3.1.A, 3.3.1.B"]:::tt

    N3_3_2((3.3.2)):::sc
    N3_3_2 --> R3_3_2_CA["Content Authoring"]:::role
    N3_3_2 --> R3_3_2_UX["UX Design"]:::role
    N3_3_2 --> T_3_3_2["ARRM: FRM-025, FRM-026, FRM-027, FRM-028, FRM-029 +3 more"]:::arrm
    N3_3_2 --> TT_3_3_2["TT: 3.3.2.A, 3.3.2.B"]:::tt

    N3_3_3((3.3.3)):::sc
    N3_3_3 --> R3_3_3_UX["UX Design"]:::role
    N3_3_3 --> R3_3_3_CA["Content Authoring"]:::role
    N3_3_3 --> T_3_3_3["ARRM: FRM-033, FRM-034, FRM-035"]:::arrm
    N3_3_3 --> TT_3_3_3["TT: 3.3.3.A"]:::tt

    N3_3_4((3.3.4)):::sc
    N3_3_4 --> R3_3_4_UX["UX Design"]:::role
    N3_3_4 --> R3_3_4_BUS["Business"]:::role
    N3_3_4 --> T_3_3_4["ARRM: FRM-036, FRM-037"]:::arrm
    N3_3_4 --> TT_3_3_4["TT: 3.3.4.A"]:::tt

    N3_3_5((3.3.5)):::sc
    N3_3_5 --> R3_3_5_UX["UX Design"]:::role
    N3_3_5 --> R3_3_5_CA["Content Authoring"]:::role
    N3_3_5 --> T_3_3_5["ARRM: FRM-038"]:::arrm
    N3_3_5 --> TT_3_3_5["TT: 3.3.5.A"]:::tt

    N3_3_6((3.3.6)):::sc
    N3_3_6 --> R3_3_6_UX["UX Design"]:::role
    N3_3_6 --> R3_3_6_BUS["Business"]:::role
    N3_3_6 --> T_3_3_6["ARRM: FRM-039"]:::arrm
    N3_3_6 --> TT_3_3_6["TT: 3.3.6.A"]:::tt

    N3_3_7((3.3.7)):::sc
    A_axe_3_3_7["AXE: no-redundant-entry"]:::axe --> N3_3_7
    N3_3_7 --> R3_3_7_UX["UX Design"]:::role
    N3_3_7 --> R3_3_7_FE["Front-End Development"]:::role
    N3_3_7 --> TT_3_3_7["TT: 3.3.7.A"]:::tt

    N3_3_8((3.3.8)):::sc
    N3_3_8 --> R3_3_8_BUS["Business"]:::role
    N3_3_8 --> R3_3_8_UX["UX Design"]:::role
    N3_3_8 --> TT_3_3_8["TT: 3.3.8.A"]:::tt

    N3_3_9((3.3.9)):::sc
    N3_3_9 --> R3_3_9_BUS["Business"]:::role
    N3_3_9 --> TT_3_3_9["TT: 3.3.9.A"]:::tt

    click A_act_3_1_1 href "https://www.w3.org/WAI/standards-guidelines/act/rules/bf051a/" _blank
    click A_axe_3_1_1 href "https://dequeuniversity.com/rules/axe/4.11/html-has-lang" _blank
    click A_alfa_3_1_1 href "https://alfa.siteimprove.com/rules/sia-r4" _blank
    click T_3_1_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click TT_3_1_1 href "https://section508coordinators.github.io/TrustedTester/language.html" _blank
    click N3_1_1 href "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html" _blank
    click A_act_3_1_2 href "https://www.w3.org/WAI/standards-guidelines/act/rules/de46e4/" _blank
    click A_axe_3_1_2 href "https://dequeuniversity.com/rules/axe/4.11/valid-lang" _blank
    click A_alfa_3_1_2 href "https://alfa.siteimprove.com/rules/sia-r5" _blank
    click T_3_1_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click TT_3_1_2 href "https://section508coordinators.github.io/TrustedTester/language.html" _blank
    click N3_1_2 href "https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html" _blank
    click T_3_1_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click TT_3_1_3 href "https://section508coordinators.github.io/TrustedTester/language.html" _blank
    click N3_1_3 href "https://www.w3.org/WAI/WCAG22/Understanding/unusual-words.html" _blank
    click T_3_1_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click TT_3_1_4 href "https://section508coordinators.github.io/TrustedTester/language.html" _blank
    click N3_1_4 href "https://www.w3.org/WAI/WCAG22/Understanding/abbreviations.html" _blank
    click T_3_1_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click TT_3_1_5 href "https://section508coordinators.github.io/TrustedTester/language.html" _blank
    click N3_1_5 href "https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html" _blank
    click T_3_1_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click TT_3_1_6 href "https://section508coordinators.github.io/TrustedTester/language.html" _blank
    click N3_1_6 href "https://www.w3.org/WAI/WCAG22/Understanding/pronunciation.html" _blank
    click T_3_2_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click TT_3_2_1 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N3_2_1 href "https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html" _blank
    click T_3_2_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click TT_3_2_2 href "https://section508coordinators.github.io/TrustedTester/forms.html" _blank
    click N3_2_2 href "https://www.w3.org/WAI/WCAG22/Understanding/on-input.html" _blank
    click T_3_2_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click TT_3_2_3 href "https://section508coordinators.github.io/TrustedTester/repetitive.html" _blank
    click N3_2_3 href "https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html" _blank
    click T_3_2_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click TT_3_2_4 href "https://section508coordinators.github.io/TrustedTester/repetitive.html" _blank
    click N3_2_4 href "https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html" _blank
    click T_3_2_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click TT_3_2_5 href "https://section508coordinators.github.io/TrustedTester/repetitive.html" _blank
    click N3_2_5 href "https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html" _blank
    click A_act_3_2_6 href "https://www.w3.org/WAI/standards-guidelines/act/rules/30b328/" _blank
    click TT_3_2_6 href "https://section508coordinators.github.io/TrustedTester/repetitive.html" _blank
    click N3_2_6 href "https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html" _blank
    click T_3_3_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click TT_3_3_1 href "https://section508coordinators.github.io/TrustedTester/forms.html" _blank
    click N3_3_1 href "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html" _blank
    click T_3_3_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click TT_3_3_2 href "https://section508coordinators.github.io/TrustedTester/forms.html" _blank
    click N3_3_2 href "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html" _blank
    click T_3_3_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click TT_3_3_3 href "https://section508coordinators.github.io/TrustedTester/forms.html" _blank
    click N3_3_3 href "https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html" _blank
    click T_3_3_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click TT_3_3_4 href "https://section508coordinators.github.io/TrustedTester/forms.html" _blank
    click N3_3_4 href "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html" _blank
    click T_3_3_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click TT_3_3_5 href "https://section508coordinators.github.io/TrustedTester/forms.html" _blank
    click N3_3_5 href "https://www.w3.org/WAI/WCAG22/Understanding/help.html" _blank
    click T_3_3_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click TT_3_3_6 href "https://section508coordinators.github.io/TrustedTester/forms.html" _blank
    click N3_3_6 href "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-all.html" _blank
    click A_axe_3_3_7 href "https://dequeuniversity.com/rules/axe/4.11/no-redundant-entry" _blank
    click TT_3_3_7 href "https://section508coordinators.github.io/TrustedTester/forms.html" _blank
    click N3_3_7 href "https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html" _blank
    click TT_3_3_8 href "https://section508coordinators.github.io/TrustedTester/forms.html" _blank
    click N3_3_8 href "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html" _blank
    click TT_3_3_9 href "https://section508coordinators.github.io/TrustedTester/forms.html" _blank
    click N3_3_9 href "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-enhanced.html" _blank
```
