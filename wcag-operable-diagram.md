# WCAG 2.2 Principle 2: Operable – Roles & Testing

Success Criteria 2.x.x (34 SCs).

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

    N2_1_1((2.1.1)):::sc
    N2_1_1 --> R2_1_1_FE["Front-End Development"]:::role
    N2_1_1 --> R2_1_1_UX["UX Design"]:::role
    N2_1_1 --> T_2_1_1["ARRM: INP-004, INP-005, INP-006, INP-007, INP-008 +4 more"]:::arrm
    N2_1_1 --> TT_2_1_1["TT: 2.1.1.A, 2.1.1.B"]:::tt

    N2_1_2((2.1.2)):::sc
    N2_1_2 --> R2_1_2_FE["Front-End Development"]:::role
    N2_1_2 --> T_2_1_2["ARRM: INP-012"]:::arrm
    N2_1_2 --> TT_2_1_2["TT: 2.1.2.A"]:::tt

    N2_1_3((2.1.3)):::sc
    N2_1_3 --> R2_1_3_FE["Front-End Development"]:::role
    N2_1_3 --> T_2_1_3["ARRM: INP-013"]:::arrm
    N2_1_3 --> TT_2_1_3["TT: 2.1.3.A"]:::tt

    N2_1_4((2.1.4)):::sc
    N2_1_4 --> R2_1_4_FE["Front-End Development"]:::role
    N2_1_4 --> R2_1_4_UX["UX Design"]:::role
    N2_1_4 --> T_2_1_4["ARRM: INP-014"]:::arrm
    N2_1_4 --> TT_2_1_4["TT: 2.1.4.A"]:::tt

    N2_2_1((2.2.1)):::sc
    N2_2_1 --> R2_2_1_FE["Front-End Development"]:::role
    N2_2_1 --> R2_2_1_UX["UX Design"]:::role
    N2_2_1 --> T_2_2_1["ARRM: NAV-004, NAV-005"]:::arrm
    N2_2_1 --> TT_2_2_1["TT: 2.2.1.A, 2.2.1.B"]:::tt

    N2_2_2((2.2.2)):::sc
    N2_2_2 --> R2_2_2_FE["Front-End Development"]:::role
    N2_2_2 --> R2_2_2_UX["UX Design"]:::role
    N2_2_2 --> T_2_2_2["ARRM: NAV-006, ANM-030"]:::arrm
    N2_2_2 --> TT_2_2_2["TT: 2.2.2.A, 2.2.2.B"]:::tt

    N2_2_3((2.2.3)):::sc
    N2_2_3 --> R2_2_3_UX["UX Design"]:::role
    N2_2_3 --> R2_2_3_BUS["Business"]:::role
    N2_2_3 --> T_2_2_3["ARRM: ANM-031"]:::arrm
    N2_2_3 --> TT_2_2_3["TT: 2.2.3.A"]:::tt

    N2_2_4((2.2.4)):::sc
    N2_2_4 --> R2_2_4_UX["UX Design"]:::role
    N2_2_4 --> T_2_2_4["ARRM: NAV-007"]:::arrm
    N2_2_4 --> TT_2_2_4["TT: 2.2.4.A"]:::tt

    N2_2_5((2.2.5)):::sc
    N2_2_5 --> R2_2_5_FE["Front-End Development"]:::role
    N2_2_5 --> R2_2_5_BUS["Business"]:::role
    N2_2_5 --> T_2_2_5["ARRM: NAV-008"]:::arrm
    N2_2_5 --> TT_2_2_5["TT: 2.2.5.A"]:::tt

    N2_2_6((2.2.6)):::sc
    N2_2_6 --> R2_2_6_UX["UX Design"]:::role
    N2_2_6 --> R2_2_6_BUS["Business"]:::role
    N2_2_6 --> T_2_2_6["ARRM: ANM-032"]:::arrm
    N2_2_6 --> TT_2_2_6["TT: 2.2.6.A"]:::tt

    N2_3_1((2.3.1)):::sc
    N2_3_1 --> R2_3_1_CA["Content Authoring"]:::role
    N2_3_1 --> R2_3_1_VD["Visual Design"]:::role
    N2_3_1 --> T_2_3_1["ARRM: ANM-033"]:::arrm
    N2_3_1 --> TT_2_3_1["TT: 2.3.1.A"]:::tt

    N2_3_2((2.3.2)):::sc
    N2_3_2 --> R2_3_2_CA["Content Authoring"]:::role
    N2_3_2 --> T_2_3_2["ARRM: ANM-034"]:::arrm
    N2_3_2 --> TT_2_3_2["TT: 2.3.2.A"]:::tt

    N2_3_3((2.3.3)):::sc
    N2_3_3 --> R2_3_3_FE["Front-End Development"]:::role
    N2_3_3 --> R2_3_3_UX["UX Design"]:::role
    N2_3_3 --> T_2_3_3["ARRM: ANM-035, ANM-036"]:::arrm
    N2_3_3 --> TT_2_3_3["TT: 2.3.3.A"]:::tt

    N2_4_1((2.4.1)):::sc
    A_act_2_4_1["ACT: 3e11da"]:::act --> N2_4_1
    A_axe_2_4_1["AXE: bypass"]:::axe --> N2_4_1
    A_alfa_2_4_1["Alfa: SIA-R87"]:::alfa --> N2_4_1
    N2_4_1 --> R2_4_1_FE["Front-End Development"]:::role
    N2_4_1 --> T_2_4_1["ARRM: SEM-018, NAV-009, NAV-010, NAV-011, NAV-012"]:::arrm
    N2_4_1 --> TT_2_4_1["TT: 2.4.1.A"]:::tt

    N2_4_2((2.4.2)):::sc
    A_act_2_4_2["ACT: 2779a5"]:::act --> N2_4_2
    A_axe_2_4_2["AXE: document-title"]:::axe --> N2_4_2
    A_alfa_2_4_2["Alfa: SIA-R1"]:::alfa --> N2_4_2
    N2_4_2 --> R2_4_2_CA["Content Authoring"]:::role
    N2_4_2 --> R2_4_2_FE["Front-End Development"]:::role
    N2_4_2 --> T_2_4_2["ARRM: SEM-019, SEM-020"]:::arrm
    N2_4_2 --> TT_2_4_2["TT: 2.4.2.A"]:::tt

    N2_4_3((2.4.3)):::sc
    N2_4_3 --> R2_4_3_FE["Front-End Development"]:::role
    N2_4_3 --> R2_4_3_UX["UX Design"]:::role
    N2_4_3 --> T_2_4_3["ARRM: SEM-021, INP-015, INP-016, FRM-015, NAV-013 +4 more"]:::arrm
    N2_4_3 --> TT_2_4_3["TT: 2.4.3.A, 2.4.3.B"]:::tt

    N2_4_4((2.4.4)):::sc
    A_act_2_4_4["ACT: c487ae"]:::act --> N2_4_4
    A_axe_2_4_4["AXE: link-name"]:::axe --> N2_4_4
    A_alfa_2_4_4["Alfa: SIA-R10"]:::alfa --> N2_4_4
    N2_4_4 --> R2_4_4_CA["Content Authoring"]:::role
    N2_4_4 --> R2_4_4_FE["Front-End Development"]:::role
    N2_4_4 --> T_2_4_4["ARRM: NAV-018, NAV-019"]:::arrm
    N2_4_4 --> TT_2_4_4["TT: 2.4.4.A, 2.4.4.B"]:::tt

    N2_4_5((2.4.5)):::sc
    N2_4_5 --> R2_4_5_UX["UX Design"]:::role
    N2_4_5 --> R2_4_5_BUS["Business"]:::role
    N2_4_5 --> T_2_4_5["ARRM: NAV-020"]:::arrm
    N2_4_5 --> TT_2_4_5["TT: 2.4.5.A"]:::tt

    N2_4_6((2.4.6)):::sc
    N2_4_6 --> R2_4_6_CA["Content Authoring"]:::role
    N2_4_6 --> R2_4_6_FE["Front-End Development"]:::role
    N2_4_6 --> T_2_4_6["ARRM: SEM-022, SEM-023, FRM-016, TAB-017"]:::arrm
    N2_4_6 --> TT_2_4_6["TT: 2.4.6.A, 2.4.6.B"]:::tt

    N2_4_7((2.4.7)):::sc
    N2_4_7 --> R2_4_7_FE["Front-End Development"]:::role
    N2_4_7 --> R2_4_7_VD["Visual Design"]:::role
    N2_4_7 --> T_2_4_7["ARRM: INP-017, INP-018, CSS-022"]:::arrm
    N2_4_7 --> TT_2_4_7["TT: 2.4.7.A"]:::tt

    N2_4_8((2.4.8)):::sc
    N2_4_8 --> R2_4_8_UX["UX Design"]:::role
    N2_4_8 --> R2_4_8_CA["Content Authoring"]:::role
    N2_4_8 --> T_2_4_8["ARRM: NAV-021"]:::arrm
    N2_4_8 --> TT_2_4_8["TT: 2.4.8.A"]:::tt

    N2_4_9((2.4.9)):::sc
    N2_4_9 --> R2_4_9_CA["Content Authoring"]:::role
    N2_4_9 --> T_2_4_9["ARRM: NAV-022"]:::arrm
    N2_4_9 --> TT_2_4_9["TT: 2.4.9.A"]:::tt

    N2_4_10((2.4.10)):::sc
    N2_4_10 --> R2_4_10_CA["Content Authoring"]:::role
    N2_4_10 --> T_2_4_10["ARRM: NAV-023"]:::arrm
    N2_4_10 --> TT_2_4_10["TT: 2.4.10.A"]:::tt

    N2_4_11((2.4.11)):::sc
    A_act_2_4_11["ACT: 04639e"]:::act --> N2_4_11
    A_axe_2_4_11["AXE: focus-not-obscured"]:::axe --> N2_4_11
    A_alfa_2_4_11["Alfa: SIA-R109"]:::alfa --> N2_4_11
    N2_4_11 --> R2_4_11_UX["UX Design"]:::role
    N2_4_11 --> R2_4_11_FE["Front-End Development"]:::role
    N2_4_11 --> TT_2_4_11["TT: 2.4.11.A, 2.4.11.B"]:::tt

    N2_4_12((2.4.12)):::sc
    N2_4_12 --> R2_4_12_VD["Visual Design"]:::role
    N2_4_12 --> R2_4_12_UX["UX Design"]:::role
    N2_4_12 --> TT_2_4_12["TT: 2.4.12.A"]:::tt

    N2_4_13((2.4.13)):::sc
    A_act_2_4_13["ACT: 674b10"]:::act --> N2_4_13
    A_axe_2_4_13["AXE: focus-appearance"]:::axe --> N2_4_13
    A_alfa_2_4_13["Alfa: SIA-R110"]:::alfa --> N2_4_13
    N2_4_13 --> R2_4_13_VD["Visual Design"]:::role
    N2_4_13 --> TT_2_4_13["TT: 2.4.13.A, 2.4.13.B"]:::tt

    N2_5_1((2.5.1)):::sc
    N2_5_1 --> R2_5_1_FE["Front-End Development"]:::role
    N2_5_1 --> R2_5_1_UX["UX Design"]:::role
    N2_5_1 --> T_2_5_1["ARRM: INP-019"]:::arrm
    N2_5_1 --> TT_2_5_1["TT: 2.5.1.A"]:::tt

    N2_5_2((2.5.2)):::sc
    N2_5_2 --> R2_5_2_FE["Front-End Development"]:::role
    N2_5_2 --> T_2_5_2["ARRM: INP-020"]:::arrm
    N2_5_2 --> TT_2_5_2["TT: 2.5.2.A"]:::tt

    N2_5_3((2.5.3)):::sc
    A_act_2_5_3["ACT: 2ee8b8"]:::act --> N2_5_3
    A_axe_2_5_3["AXE: label-content-name-mismatch"]:::axe --> N2_5_3
    A_alfa_2_5_3["Alfa: SIA-R14"]:::alfa --> N2_5_3
    N2_5_3 --> R2_5_3_FE["Front-End Development"]:::role
    N2_5_3 --> R2_5_3_CA["Content Authoring"]:::role
    N2_5_3 --> T_2_5_3["ARRM: INP-021"]:::arrm
    N2_5_3 --> TT_2_5_3["TT: 2.5.3.A"]:::tt

    N2_5_4((2.5.4)):::sc
    N2_5_4 --> R2_5_4_FE["Front-End Development"]:::role
    N2_5_4 --> R2_5_4_UX["UX Design"]:::role
    N2_5_4 --> T_2_5_4["ARRM: INP-022, INP-023"]:::arrm
    N2_5_4 --> TT_2_5_4["TT: 2.5.4.A"]:::tt

    N2_5_5((2.5.5)):::sc
    N2_5_5 --> R2_5_5_VD["Visual Design"]:::role
    N2_5_5 --> R2_5_5_FE["Front-End Development"]:::role
    N2_5_5 --> T_2_5_5["ARRM: CSS-023"]:::arrm
    N2_5_5 --> TT_2_5_5["TT: 2.5.5.A"]:::tt

    N2_5_6((2.5.6)):::sc
    N2_5_6 --> R2_5_6_FE["Front-End Development"]:::role
    N2_5_6 --> T_2_5_6["ARRM: FRM-017"]:::arrm
    N2_5_6 --> TT_2_5_6["TT: 2.5.6.A"]:::tt

    N2_5_7((2.5.7)):::sc
    A_axe_2_5_7["AXE: dragging-movements"]:::axe --> N2_5_7
    N2_5_7 --> R2_5_7_UX["UX Design"]:::role
    N2_5_7 --> R2_5_7_FE["Front-End Development"]:::role
    N2_5_7 --> TT_2_5_7["TT: 2.5.7.A"]:::tt

    N2_5_8((2.5.8)):::sc
    A_act_2_5_8["ACT: a25f45"]:::act --> N2_5_8
    A_axe_2_5_8["AXE: target-size"]:::axe --> N2_5_8
    A_alfa_2_5_8["Alfa: SIA-R101"]:::alfa --> N2_5_8
    N2_5_8 --> R2_5_8_VD["Visual Design"]:::role
    N2_5_8 --> TT_2_5_8["TT: 2.5.8.A"]:::tt

    click T_2_1_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click TT_2_1_1 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_1_1 href "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html" _blank
    click T_2_1_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click TT_2_1_2 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_1_2 href "https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html" _blank
    click T_2_1_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click TT_2_1_3 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_1_3 href "https://www.w3.org/WAI/WCAG22/Understanding/keyboard-no-exception.html" _blank
    click T_2_1_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click TT_2_1_4 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_1_4 href "https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html" _blank
    click T_2_2_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click TT_2_2_1 href "https://section508coordinators.github.io/TrustedTester/timelimits.html" _blank
    click N2_2_1 href "https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html" _blank
    click T_2_2_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click TT_2_2_2 href "https://section508coordinators.github.io/TrustedTester/auto.html" _blank
    click N2_2_2 href "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html" _blank
    click T_2_2_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_2_2_3 href "https://section508coordinators.github.io/TrustedTester/timelimits.html" _blank
    click N2_2_3 href "https://www.w3.org/WAI/WCAG22/Understanding/no-timing.html" _blank
    click T_2_2_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click TT_2_2_4 href "https://section508coordinators.github.io/TrustedTester/timelimits.html" _blank
    click N2_2_4 href "https://www.w3.org/WAI/WCAG22/Understanding/interruptions.html" _blank
    click T_2_2_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click TT_2_2_5 href "https://section508coordinators.github.io/TrustedTester/timelimits.html" _blank
    click N2_2_5 href "https://www.w3.org/WAI/WCAG22/Understanding/re-authenticating.html" _blank
    click T_2_2_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_2_2_6 href "https://section508coordinators.github.io/TrustedTester/timelimits.html" _blank
    click N2_2_6 href "https://www.w3.org/WAI/WCAG22/Understanding/timeouts.html" _blank
    click T_2_3_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_2_3_1 href "https://section508coordinators.github.io/TrustedTester/flashing.html" _blank
    click N2_3_1 href "https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html" _blank
    click T_2_3_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_2_3_2 href "https://section508coordinators.github.io/TrustedTester/flashing.html" _blank
    click N2_3_2 href "https://www.w3.org/WAI/WCAG22/Understanding/three-flashes.html" _blank
    click T_2_3_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click TT_2_3_3 href "https://section508coordinators.github.io/TrustedTester/flashing.html" _blank
    click N2_3_3 href "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html" _blank
    click A_act_2_4_1 href "https://www.w3.org/WAI/standards-guidelines/act/rules/3e11da/" _blank
    click A_axe_2_4_1 href "https://dequeuniversity.com/rules/axe/4.11/bypass" _blank
    click A_alfa_2_4_1 href "https://alfa.siteimprove.com/rules/sia-r87" _blank
    click T_2_4_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click TT_2_4_1 href "https://section508coordinators.github.io/TrustedTester/repetitive.html" _blank
    click N2_4_1 href "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html" _blank
    click A_act_2_4_2 href "https://www.w3.org/WAI/standards-guidelines/act/rules/2779a5/" _blank
    click A_axe_2_4_2 href "https://dequeuniversity.com/rules/axe/4.11/document-title" _blank
    click A_alfa_2_4_2 href "https://alfa.siteimprove.com/rules/sia-r1" _blank
    click T_2_4_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click TT_2_4_2 href "https://section508coordinators.github.io/TrustedTester/titles.html" _blank
    click N2_4_2 href "https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html" _blank
    click T_2_4_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click TT_2_4_3 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_4_3 href "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html" _blank
    click A_act_2_4_4 href "https://www.w3.org/WAI/standards-guidelines/act/rules/c487ae/" _blank
    click A_axe_2_4_4 href "https://dequeuniversity.com/rules/axe/4.11/link-name" _blank
    click A_alfa_2_4_4 href "https://alfa.siteimprove.com/rules/sia-r10" _blank
    click T_2_4_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click TT_2_4_4 href "https://section508coordinators.github.io/TrustedTester/links.html" _blank
    click N2_4_4 href "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html" _blank
    click T_2_4_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click TT_2_4_5 href "https://section508coordinators.github.io/TrustedTester/multiple.html" _blank
    click N2_4_5 href "https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html" _blank
    click T_2_4_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click TT_2_4_6 href "https://section508coordinators.github.io/TrustedTester/structure.html" _blank
    click N2_4_6 href "https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html" _blank
    click T_2_4_7 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click TT_2_4_7 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_4_7 href "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" _blank
    click T_2_4_8 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click TT_2_4_8 href "https://section508coordinators.github.io/TrustedTester/repetitive.html" _blank
    click N2_4_8 href "https://www.w3.org/WAI/WCAG22/Understanding/location.html" _blank
    click T_2_4_9 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click TT_2_4_9 href "https://section508coordinators.github.io/TrustedTester/links.html" _blank
    click N2_4_9 href "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-link-only.html" _blank
    click T_2_4_10 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click TT_2_4_10 href "https://section508coordinators.github.io/TrustedTester/structure.html" _blank
    click N2_4_10 href "https://www.w3.org/WAI/WCAG22/Understanding/section-headings.html" _blank
    click A_act_2_4_11 href "https://www.w3.org/WAI/standards-guidelines/act/rules/04639e/" _blank
    click A_axe_2_4_11 href "https://dequeuniversity.com/rules/axe/4.11/focus-not-obscured" _blank
    click A_alfa_2_4_11 href "https://alfa.siteimprove.com/rules/sia-r109" _blank
    click TT_2_4_11 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_4_11 href "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html" _blank
    click TT_2_4_12 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_4_12 href "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html" _blank
    click A_act_2_4_13 href "https://www.w3.org/WAI/standards-guidelines/act/rules/674b10/" _blank
    click A_axe_2_4_13 href "https://dequeuniversity.com/rules/axe/4.11/focus-appearance" _blank
    click A_alfa_2_4_13 href "https://alfa.siteimprove.com/rules/sia-r110" _blank
    click TT_2_4_13 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_4_13 href "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html" _blank
    click T_2_5_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click TT_2_5_1 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_5_1 href "https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html" _blank
    click T_2_5_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click TT_2_5_2 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_5_2 href "https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html" _blank
    click A_act_2_5_3 href "https://www.w3.org/WAI/standards-guidelines/act/rules/2ee8b8/" _blank
    click A_axe_2_5_3 href "https://dequeuniversity.com/rules/axe/4.11/label-content-name-mismatch" _blank
    click A_alfa_2_5_3 href "https://alfa.siteimprove.com/rules/sia-r14" _blank
    click T_2_5_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click TT_2_5_3 href "https://section508coordinators.github.io/TrustedTester/forms.html" _blank
    click N2_5_3 href "https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html" _blank
    click T_2_5_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click TT_2_5_4 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_5_4 href "https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation.html" _blank
    click T_2_5_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click TT_2_5_5 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_5_5 href "https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html" _blank
    click T_2_5_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click TT_2_5_6 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_5_6 href "https://www.w3.org/WAI/WCAG22/Understanding/concurrent-input-mechanisms.html" _blank
    click A_axe_2_5_7 href "https://dequeuniversity.com/rules/axe/4.11/dragging-movements" _blank
    click TT_2_5_7 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_5_7 href "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html" _blank
    click A_act_2_5_8 href "https://www.w3.org/WAI/standards-guidelines/act/rules/a25f45/" _blank
    click A_axe_2_5_8 href "https://dequeuniversity.com/rules/axe/4.11/target-size" _blank
    click A_alfa_2_5_8 href "https://alfa.siteimprove.com/rules/sia-r101" _blank
    click TT_2_5_8 href "https://section508coordinators.github.io/TrustedTester/keyboard.html" _blank
    click N2_5_8 href "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html" _blank
```
