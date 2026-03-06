# WCAG 2.2 Principle 1: Perceivable – Roles & Testing

Success Criteria 1.x.x (29 SCs).

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

    N1_1_1((1.1.1)):::sc
    A_act_1_1_1["ACT: 23a2a8, 3ea0c8, 59796f, 9eb3f6, a25f45, c3232f, de46e4"]:::act --> N1_1_1
    A_axe_1_1_1["AXE: area-alt, image-alt, input-image-alt, object-alt, role-img-alt, svg-img-alt, input-button-name"]:::axe --> N1_1_1
    A_alfa_1_1_1["Alfa: SIA-R2, SIA-R3, SIA-R25, SIA-R26, SIA-R41"]:::alfa --> N1_1_1
    N1_1_1 --> R1_1_1_CA["Content Authoring"]:::role
    N1_1_1 --> R1_1_1_FE["Front-End Development"]:::role
    N1_1_1 --> R1_1_1_UX["UX Design"]:::role
    N1_1_1 --> T_1_1_1["ARRM: IMG-001, IMG-002, IMG-003, IMG-004, IMG-005 +18 more"]:::arrm
    N1_1_1 --> TT_1_1_1["TT: 1.1.1.A, 1.1.1.B, 1.1.1.C, 1.1.1.D +1 more"]:::tt

    N1_2_1((1.2.1)):::sc
    N1_2_1 --> R1_2_1_CA["Content Authoring"]:::role
    N1_2_1 --> R1_2_1_UX["UX Design"]:::role
    N1_2_1 --> T_1_2_1["ARRM: ANM-001, ANM-002, ANM-003, ANM-004, ANM-005 +1 more"]:::arrm
    N1_2_1 --> TT_1_2_1["TT: 1.2.1.A, 1.2.1.B"]:::tt

    N1_2_2((1.2.2)):::sc
    A_act_1_2_2["ACT: eac66b"]:::act --> N1_2_2
    A_axe_1_2_2["AXE: video-caption"]:::axe --> N1_2_2
    N1_2_2 --> R1_2_2_CA["Content Authoring"]:::role
    N1_2_2 --> T_1_2_2["ARRM: ANM-007, ANM-008, ANM-009"]:::arrm
    N1_2_2 --> TT_1_2_2["TT: 1.2.2.A, 1.2.2.B"]:::tt

    N1_2_3((1.2.3)):::sc
    N1_2_3 --> R1_2_3_CA["Content Authoring"]:::role
    N1_2_3 --> T_1_2_3["ARRM: ANM-010, ANM-011"]:::arrm
    N1_2_3 --> TT_1_2_3["TT: 1.2.3.A"]:::tt

    N1_2_4((1.2.4)):::sc
    N1_2_4 --> R1_2_4_CA["Content Authoring"]:::role
    N1_2_4 --> T_1_2_4["ARRM: ANM-012, ANM-013"]:::arrm
    N1_2_4 --> TT_1_2_4["TT: 1.2.4.A"]:::tt

    N1_2_5((1.2.5)):::sc
    N1_2_5 --> R1_2_5_CA["Content Authoring"]:::role
    N1_2_5 --> T_1_2_5["ARRM: ANM-014, ANM-015, ANM-016"]:::arrm
    N1_2_5 --> TT_1_2_5["TT: 1.2.5.A"]:::tt

    N1_2_6((1.2.6)):::sc
    N1_2_6 --> R1_2_6_CA["Content Authoring"]:::role
    N1_2_6 --> T_1_2_6["ARRM: ANM-017"]:::arrm
    N1_2_6 --> TT_1_2_6["TT: 1.2.6.A"]:::tt

    N1_2_7((1.2.7)):::sc
    N1_2_7 --> R1_2_7_CA["Content Authoring"]:::role
    N1_2_7 --> T_1_2_7["ARRM: ANM-018"]:::arrm
    N1_2_7 --> TT_1_2_7["TT: 1.2.7.A"]:::tt

    N1_2_8((1.2.8)):::sc
    N1_2_8 --> R1_2_8_CA["Content Authoring"]:::role
    N1_2_8 --> T_1_2_8["ARRM: ANM-019, ANM-020"]:::arrm
    N1_2_8 --> TT_1_2_8["TT: 1.2.8.A"]:::tt

    N1_2_9((1.2.9)):::sc
    N1_2_9 --> R1_2_9_CA["Content Authoring"]:::role
    N1_2_9 --> T_1_2_9["ARRM: ANM-021"]:::arrm
    N1_2_9 --> TT_1_2_9["TT: 1.2.9.A"]:::tt

    N1_3_1((1.3.1)):::sc
    A_act_1_3_1["ACT: 307n5z, 3e12e1, 674b10, 78fd32, 7d6734, b49b2e, d0f69e, d9e9d9, eba20a, f51b46"]:::act --> N1_3_1
    A_axe_1_3_1["AXE: definition-list, dlitem, list, listitem, landmark-one-main, table-duplicate-name, td-headers-attr, th-has-data-cells"]:::axe --> N1_3_1
    A_alfa_1_3_1["Alfa: SIA-R1, SIA-R4, SIA-R7, SIA-R13, SIA-R16, SIA-R39, SIA-R53"]:::alfa --> N1_3_1
    N1_3_1 --> R1_3_1_FE["Front-End Development"]:::role
    N1_3_1 --> R1_3_1_CA["Content Authoring"]:::role
    N1_3_1 --> R1_3_1_UX["UX Design"]:::role
    N1_3_1 --> T_1_3_1["ARRM: SEM-001, SEM-002, SEM-003, SEM-004, SEM-005 +44 more"]:::arrm
    N1_3_1 --> TT_1_3_1["TT: 1.3.1.A, 1.3.1.B, 1.3.1.C, 1.3.1.D"]:::tt

    N1_3_2((1.3.2)):::sc
    N1_3_2 --> R1_3_2_FE["Front-End Development"]:::role
    N1_3_2 --> R1_3_2_UX["UX Design"]:::role
    N1_3_2 --> T_1_3_2["ARRM: SEM-017, FRM-011, TAB-016, SCT-008, SCT-009"]:::arrm
    N1_3_2 --> TT_1_3_2["TT: 1.3.2.A"]:::tt

    N1_3_3((1.3.3)):::sc
    N1_3_3 --> R1_3_3_CA["Content Authoring"]:::role
    N1_3_3 --> R1_3_3_UX["UX Design"]:::role
    N1_3_3 --> T_1_3_3["ARRM: CSS-006, CSS-007, NAV-002, SCT-010, SCT-011 +5 more"]:::arrm
    N1_3_3 --> TT_1_3_3["TT: 1.3.3.A"]:::tt

    N1_3_4((1.3.4)):::sc
    A_act_1_3_4["ACT: b33eff"]:::act --> N1_3_4
    A_axe_1_3_4["AXE: css-orientation-lock"]:::axe --> N1_3_4
    A_alfa_1_3_4["Alfa: SIA-R9"]:::alfa --> N1_3_4
    N1_3_4 --> R1_3_4_FE["Front-End Development"]:::role
    N1_3_4 --> R1_3_4_UX["UX Design"]:::role
    N1_3_4 --> T_1_3_4["ARRM: CSS-008"]:::arrm
    N1_3_4 --> TT_1_3_4["TT: 1.3.4.A"]:::tt

    N1_3_5((1.3.5)):::sc
    A_act_1_3_5["ACT: 135hje"]:::act --> N1_3_5
    A_axe_1_3_5["AXE: autocomplete-valid"]:::axe --> N1_3_5
    A_alfa_1_3_5["Alfa: SIA-R8"]:::alfa --> N1_3_5
    N1_3_5 --> R1_3_5_FE["Front-End Development"]:::role
    N1_3_5 --> T_1_3_5["ARRM: FRM-012, FRM-013"]:::arrm
    N1_3_5 --> TT_1_3_5["TT: 1.3.5.A"]:::tt

    N1_3_6((1.3.6)):::sc
    N1_3_6 --> R1_3_6_FE["Front-End Development"]:::role
    N1_3_6 --> R1_3_6_UX["UX Design"]:::role
    N1_3_6 --> T_1_3_6["ARRM: FRM-014"]:::arrm
    N1_3_6 --> TT_1_3_6["TT: 1.3.6.A"]:::tt

    N1_4_1((1.4.1)):::sc
    N1_4_1 --> R1_4_1_VD["Visual Design"]:::role
    N1_4_1 --> R1_4_1_CA["Content Authoring"]:::role
    N1_4_1 --> T_1_4_1["ARRM: CSS-009, CSS-010, NAV-003"]:::arrm
    N1_4_1 --> TT_1_4_1["TT: 1.4.1.A"]:::tt

    N1_4_2((1.4.2)):::sc
    N1_4_2 --> R1_4_2_FE["Front-End Development"]:::role
    N1_4_2 --> R1_4_2_UX["UX Design"]:::role
    N1_4_2 --> T_1_4_2["ARRM: ANM-022, ANM-023, ANM-024, ANM-025, ANM-026"]:::arrm
    N1_4_2 --> TT_1_4_2["TT: 1.4.2.A"]:::tt

    N1_4_3((1.4.3)):::sc
    A_act_1_4_3["ACT: 09o5cg, afw4f7"]:::act --> N1_4_3
    A_axe_1_4_3["AXE: color-contrast"]:::axe --> N1_4_3
    A_alfa_1_4_3["Alfa: SIA-R69"]:::alfa --> N1_4_3
    N1_4_3 --> R1_4_3_VD["Visual Design"]:::role
    N1_4_3 --> T_1_4_3["ARRM: CSS-011, CSS-012"]:::arrm
    N1_4_3 --> TT_1_4_3["TT: 1.4.3.A, 1.4.3.B"]:::tt

    N1_4_4((1.4.4)):::sc
    A_axe_1_4_4["AXE: meta-viewport"]:::axe --> N1_4_4
    N1_4_4 --> R1_4_4_FE["Front-End Development"]:::role
    N1_4_4 --> R1_4_4_VD["Visual Design"]:::role
    N1_4_4 --> T_1_4_4["ARRM: CSS-013, CSS-014"]:::arrm
    N1_4_4 --> TT_1_4_4["TT: 1.4.4.A"]:::tt

    N1_4_5((1.4.5)):::sc
    N1_4_5 --> R1_4_5_VD["Visual Design"]:::role
    N1_4_5 --> R1_4_5_CA["Content Authoring"]:::role
    N1_4_5 --> T_1_4_5["ARRM: IMG-019, IMG-020, IMG-021, CSS-015, SCT-017"]:::arrm
    N1_4_5 --> TT_1_4_5["TT: 1.4.5.A"]:::tt

    N1_4_6((1.4.6)):::sc
    A_axe_1_4_6["AXE: color-contrast-enhanced"]:::axe --> N1_4_6
    N1_4_6 --> R1_4_6_VD["Visual Design"]:::role
    N1_4_6 --> T_1_4_6["ARRM: CSS-016, CSS-017"]:::arrm
    N1_4_6 --> TT_1_4_6["TT: 1.4.6.A, 1.4.6.B"]:::tt

    N1_4_7((1.4.7)):::sc
    N1_4_7 --> R1_4_7_CA["Content Authoring"]:::role
    N1_4_7 --> T_1_4_7["ARRM: ANM-027, ANM-028"]:::arrm
    N1_4_7 --> TT_1_4_7["TT: 1.4.7.A"]:::tt

    N1_4_8((1.4.8)):::sc
    N1_4_8 --> R1_4_8_VD["Visual Design"]:::role
    N1_4_8 --> R1_4_8_FE["Front-End Development"]:::role
    N1_4_8 --> T_1_4_8["ARRM: SCT-018, SCT-019"]:::arrm
    N1_4_8 --> TT_1_4_8["TT: 1.4.8.A"]:::tt

    N1_4_9((1.4.9)):::sc
    N1_4_9 --> R1_4_9_VD["Visual Design"]:::role
    N1_4_9 --> T_1_4_9["ARRM: IMG-022"]:::arrm
    N1_4_9 --> TT_1_4_9["TT: 1.4.9.A"]:::tt

    N1_4_10((1.4.10)):::sc
    N1_4_10 --> R1_4_10_FE["Front-End Development"]:::role
    N1_4_10 --> R1_4_10_VD["Visual Design"]:::role
    N1_4_10 --> T_1_4_10["ARRM: CSS-018, CSS-019"]:::arrm
    N1_4_10 --> TT_1_4_10["TT: 1.4.10.A"]:::tt

    N1_4_11((1.4.11)):::sc
    A_act_1_4_11["ACT: 4c31df"]:::act --> N1_4_11
    A_axe_1_4_11["AXE: non-text-color-contrast"]:::axe --> N1_4_11
    A_alfa_1_4_11["Alfa: SIA-R70"]:::alfa --> N1_4_11
    N1_4_11 --> R1_4_11_VD["Visual Design"]:::role
    N1_4_11 --> T_1_4_11["ARRM: CSS-020"]:::arrm
    N1_4_11 --> TT_1_4_11["TT: 1.4.11.A, 1.4.11.B"]:::tt

    N1_4_12((1.4.12)):::sc
    A_act_1_4_12["ACT: 9e45ec"]:::act --> N1_4_12
    A_alfa_1_4_12["Alfa: SIA-R86"]:::alfa --> N1_4_12
    N1_4_12 --> R1_4_12_FE["Front-End Development"]:::role
    N1_4_12 --> R1_4_12_VD["Visual Design"]:::role
    N1_4_12 --> T_1_4_12["ARRM: CSS-021"]:::arrm
    N1_4_12 --> TT_1_4_12["TT: 1.4.12.A"]:::tt

    N1_4_13((1.4.13)):::sc
    N1_4_13 --> R1_4_13_FE["Front-End Development"]:::role
    N1_4_13 --> R1_4_13_UX["UX Design"]:::role
    N1_4_13 --> T_1_4_13["ARRM: INP-001, INP-002, INP-003"]:::arrm
    N1_4_13 --> TT_1_4_13["TT: 1.4.13.A, 1.4.13.B"]:::tt

    click A_act_1_1_1 href "https://www.w3.org/WAI/standards-guidelines/act/rules/23a2a8/" _blank
    click A_axe_1_1_1 href "https://dequeuniversity.com/rules/axe/4.11/area-alt" _blank
    click A_alfa_1_1_1 href "https://alfa.siteimprove.com/rules/sia-r2" _blank
    click T_1_1_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#images-and-graphs" _blank
    click TT_1_1_1 href "https://section508coordinators.github.io/TrustedTester/images.html" _blank
    click N1_1_1 href "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html" _blank
    click T_1_2_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_1_2_1 href "https://section508coordinators.github.io/TrustedTester/audiovideo.html" _blank
    click N1_2_1 href "https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html" _blank
    click A_act_1_2_2 href "https://www.w3.org/WAI/standards-guidelines/act/rules/eac66b/" _blank
    click A_axe_1_2_2 href "https://dequeuniversity.com/rules/axe/4.11/video-caption" _blank
    click T_1_2_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_1_2_2 href "https://section508coordinators.github.io/TrustedTester/media.html" _blank
    click N1_2_2 href "https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html" _blank
    click T_1_2_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_1_2_3 href "https://section508coordinators.github.io/TrustedTester/media.html" _blank
    click N1_2_3 href "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded.html" _blank
    click T_1_2_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_1_2_4 href "https://section508coordinators.github.io/TrustedTester/media.html" _blank
    click N1_2_4 href "https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html" _blank
    click T_1_2_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_1_2_5 href "https://section508coordinators.github.io/TrustedTester/media.html" _blank
    click N1_2_5 href "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html" _blank
    click T_1_2_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_1_2_6 href "https://section508coordinators.github.io/TrustedTester/media.html" _blank
    click N1_2_6 href "https://www.w3.org/WAI/WCAG22/Understanding/sign-language-prerecorded.html" _blank
    click T_1_2_7 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_1_2_7 href "https://section508coordinators.github.io/TrustedTester/media.html" _blank
    click N1_2_7 href "https://www.w3.org/WAI/WCAG22/Understanding/extended-audio-description-prerecorded.html" _blank
    click T_1_2_8 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_1_2_8 href "https://section508coordinators.github.io/TrustedTester/media.html" _blank
    click N1_2_8 href "https://www.w3.org/WAI/WCAG22/Understanding/media-alternative-prerecorded.html" _blank
    click T_1_2_9 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_1_2_9 href "https://section508coordinators.github.io/TrustedTester/audiovideo.html" _blank
    click N1_2_9 href "https://www.w3.org/WAI/WCAG22/Understanding/audio-only-live.html" _blank
    click A_act_1_3_1 href "https://www.w3.org/WAI/standards-guidelines/act/rules/307n5z/" _blank
    click A_axe_1_3_1 href "https://dequeuniversity.com/rules/axe/4.11/definition-list" _blank
    click A_alfa_1_3_1 href "https://alfa.siteimprove.com/rules/sia-r1" _blank
    click T_1_3_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click TT_1_3_1 href "https://section508coordinators.github.io/TrustedTester/structure.html" _blank
    click N1_3_1 href "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html" _blank
    click T_1_3_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click TT_1_3_2 href "https://section508coordinators.github.io/TrustedTester/css-content-position.html" _blank
    click N1_3_2 href "https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html" _blank
    click T_1_3_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click TT_1_3_3 href "https://section508coordinators.github.io/TrustedTester/sensory.html" _blank
    click N1_3_3 href "https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html" _blank
    click A_act_1_3_4 href "https://www.w3.org/WAI/standards-guidelines/act/rules/b33eff/" _blank
    click A_axe_1_3_4 href "https://dequeuniversity.com/rules/axe/4.11/css-orientation-lock" _blank
    click A_alfa_1_3_4 href "https://alfa.siteimprove.com/rules/sia-r9" _blank
    click T_1_3_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click TT_1_3_4 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N1_3_4 href "https://www.w3.org/WAI/WCAG22/Understanding/orientation.html" _blank
    click A_act_1_3_5 href "https://www.w3.org/WAI/standards-guidelines/act/rules/135hje/" _blank
    click A_axe_1_3_5 href "https://dequeuniversity.com/rules/axe/4.11/autocomplete-valid" _blank
    click A_alfa_1_3_5 href "https://alfa.siteimprove.com/rules/sia-r8" _blank
    click T_1_3_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click TT_1_3_5 href "https://section508coordinators.github.io/TrustedTester/forms.html" _blank
    click N1_3_5 href "https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html" _blank
    click T_1_3_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click TT_1_3_6 href "https://section508coordinators.github.io/TrustedTester/structure.html" _blank
    click N1_3_6 href "https://www.w3.org/WAI/WCAG22/Understanding/identify-purpose.html" _blank
    click T_1_4_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click TT_1_4_1 href "https://section508coordinators.github.io/TrustedTester/sensory.html" _blank
    click N1_4_1 href "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html" _blank
    click T_1_4_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_1_4_2 href "https://section508coordinators.github.io/TrustedTester/auto.html" _blank
    click N1_4_2 href "https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html" _blank
    click A_act_1_4_3 href "https://www.w3.org/WAI/standards-guidelines/act/rules/09o5cg/" _blank
    click A_axe_1_4_3 href "https://dequeuniversity.com/rules/axe/4.11/color-contrast" _blank
    click A_alfa_1_4_3 href "https://alfa.siteimprove.com/rules/sia-r69" _blank
    click T_1_4_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click TT_1_4_3 href "https://section508coordinators.github.io/TrustedTester/sensory.html" _blank
    click N1_4_3 href "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" _blank
    click A_axe_1_4_4 href "https://dequeuniversity.com/rules/axe/4.11/meta-viewport" _blank
    click T_1_4_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click TT_1_4_4 href "https://section508coordinators.github.io/TrustedTester/resize.html" _blank
    click N1_4_4 href "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html" _blank
    click T_1_4_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#images-and-graphs" _blank
    click TT_1_4_5 href "https://section508coordinators.github.io/TrustedTester/images.html" _blank
    click N1_4_5 href "https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html" _blank
    click A_axe_1_4_6 href "https://dequeuniversity.com/rules/axe/4.11/color-contrast-enhanced" _blank
    click T_1_4_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click TT_1_4_6 href "https://section508coordinators.github.io/TrustedTester/sensory.html" _blank
    click N1_4_6 href "https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html" _blank
    click T_1_4_7 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_1_4_7 href "https://section508coordinators.github.io/TrustedTester/sensory.html" _blank
    click N1_4_7 href "https://www.w3.org/WAI/WCAG22/Understanding/low-or-no-background-audio.html" _blank
    click T_1_4_8 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click TT_1_4_8 href "https://section508coordinators.github.io/TrustedTester/sensory.html" _blank
    click N1_4_8 href "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html" _blank
    click T_1_4_9 href "https://www.w3.org/WAI/planning/arrm/tasks/#images-and-graphs" _blank
    click TT_1_4_9 href "https://section508coordinators.github.io/TrustedTester/images.html" _blank
    click N1_4_9 href "https://www.w3.org/WAI/WCAG22/Understanding/images-of-text-no-exception.html" _blank
    click T_1_4_10 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click TT_1_4_10 href "https://section508coordinators.github.io/TrustedTester/resize.html" _blank
    click N1_4_10 href "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html" _blank
    click A_act_1_4_11 href "https://www.w3.org/WAI/standards-guidelines/act/rules/4c31df/" _blank
    click A_axe_1_4_11 href "https://dequeuniversity.com/rules/axe/4.11/non-text-color-contrast" _blank
    click A_alfa_1_4_11 href "https://alfa.siteimprove.com/rules/sia-r70" _blank
    click T_1_4_11 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click TT_1_4_11 href "https://section508coordinators.github.io/TrustedTester/sensory.html" _blank
    click N1_4_11 href "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" _blank
    click A_act_1_4_12 href "https://www.w3.org/WAI/standards-guidelines/act/rules/9e45ec/" _blank
    click A_alfa_1_4_12 href "https://alfa.siteimprove.com/rules/sia-r86" _blank
    click T_1_4_12 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click TT_1_4_12 href "https://section508coordinators.github.io/TrustedTester/resize.html" _blank
    click N1_4_12 href "https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html" _blank
    click T_1_4_13 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click TT_1_4_13 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N1_4_13 href "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html" _blank
```
