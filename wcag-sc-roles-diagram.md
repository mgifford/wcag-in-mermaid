# WCAG 2.2 Success Criteria – Roles & Testing

SC nodes form a **vertical spine** running top to bottom in the centre.
Automated testing tools (ACT, AXE, Alfa) branch off to the **left** of each SC.
Responsible roles branch off to the **right** of each SC.
ARRM task IDs branch off from each SC node.
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

```mermaid
graph LR
    classDef sc   fill:#e1f5fe,stroke:#01579b,color:#000
    classDef role fill:#fff3e0,stroke:#e65100,color:#000
    classDef act  fill:#f3e5f5,stroke:#6a1b9a,color:#000
    classDef axe  fill:#fffde7,stroke:#f57f17,color:#000
    classDef alfa fill:#fce4ec,stroke:#880e4f,color:#000
    classDef arrm fill:#e8eaf6,stroke:#3949ab,color:#000

    N1_1_1((1.1.1)):::sc
    A_act_1_1_1["ACT: 23a2a8, 3ea0c8, 59796f, 9eb3f6, a25f45, c3232f, de46e4"]:::act --> N1_1_1
    A_axe_1_1_1["AXE: area-alt, image-alt, input-image-alt, object-alt, role-img-alt, svg-img-alt, input-button-name"]:::axe --> N1_1_1
    A_alfa_1_1_1["Alfa: SIA-R2, SIA-R3, SIA-R25, SIA-R26, SIA-R41"]:::alfa --> N1_1_1
    N1_1_1 --> R1_1_1_CA["Content Authoring"]:::role
    N1_1_1 --> R1_1_1_FE["Front-End Development"]:::role
    N1_1_1 --> R1_1_1_UX["UX Design"]:::role
    N1_1_1 --> T_1_1_1["ARRM: IMG-001, IMG-002, IMG-003, IMG-004, IMG-005 +18 more"]:::arrm

    N1_2_1((1.2.1)):::sc
    N1_2_1 --> R1_2_1_CA["Content Authoring"]:::role
    N1_2_1 --> R1_2_1_UX["UX Design"]:::role
    N1_2_1 --> T_1_2_1["ARRM: ANM-001, ANM-002, ANM-003, ANM-004, ANM-005 +1 more"]:::arrm

    N1_2_2((1.2.2)):::sc
    A_act_1_2_2["ACT: eac66b"]:::act --> N1_2_2
    A_axe_1_2_2["AXE: video-caption"]:::axe --> N1_2_2
    N1_2_2 --> R1_2_2_CA["Content Authoring"]:::role
    N1_2_2 --> T_1_2_2["ARRM: ANM-007, ANM-008, ANM-009"]:::arrm

    N1_2_3((1.2.3)):::sc
    N1_2_3 --> R1_2_3_CA["Content Authoring"]:::role
    N1_2_3 --> T_1_2_3["ARRM: ANM-010, ANM-011"]:::arrm

    N1_2_4((1.2.4)):::sc
    N1_2_4 --> R1_2_4_CA["Content Authoring"]:::role
    N1_2_4 --> T_1_2_4["ARRM: ANM-012, ANM-013"]:::arrm

    N1_2_5((1.2.5)):::sc
    N1_2_5 --> R1_2_5_CA["Content Authoring"]:::role
    N1_2_5 --> T_1_2_5["ARRM: ANM-014, ANM-015, ANM-016"]:::arrm

    N1_2_6((1.2.6)):::sc
    N1_2_6 --> R1_2_6_CA["Content Authoring"]:::role
    N1_2_6 --> T_1_2_6["ARRM: ANM-017"]:::arrm

    N1_2_7((1.2.7)):::sc
    N1_2_7 --> R1_2_7_CA["Content Authoring"]:::role
    N1_2_7 --> T_1_2_7["ARRM: ANM-018"]:::arrm

    N1_2_8((1.2.8)):::sc
    N1_2_8 --> R1_2_8_CA["Content Authoring"]:::role
    N1_2_8 --> T_1_2_8["ARRM: ANM-019, ANM-020"]:::arrm

    N1_2_9((1.2.9)):::sc
    N1_2_9 --> R1_2_9_CA["Content Authoring"]:::role
    N1_2_9 --> T_1_2_9["ARRM: ANM-021"]:::arrm

    N1_3_1((1.3.1)):::sc
    A_act_1_3_1["ACT: 307n5z, 3e12e1, 674b10, 78fd32, 7d6734, b49b2e, d0f69e, d9e9d9, eba20a, f51b46"]:::act --> N1_3_1
    A_axe_1_3_1["AXE: definition-list, dlitem, list, listitem, landmark-one-main, table-duplicate-name, td-headers-attr, th-has-data-cells"]:::axe --> N1_3_1
    A_alfa_1_3_1["Alfa: SIA-R1, SIA-R4, SIA-R7, SIA-R13, SIA-R16, SIA-R39, SIA-R53"]:::alfa --> N1_3_1
    N1_3_1 --> R1_3_1_FE["Front-End Development"]:::role
    N1_3_1 --> R1_3_1_CA["Content Authoring"]:::role
    N1_3_1 --> R1_3_1_UX["UX Design"]:::role
    N1_3_1 --> T_1_3_1["ARRM: SEM-001, SEM-002, SEM-003, SEM-004, SEM-005 +44 more"]:::arrm

    N1_3_2((1.3.2)):::sc
    N1_3_2 --> R1_3_2_FE["Front-End Development"]:::role
    N1_3_2 --> R1_3_2_UX["UX Design"]:::role
    N1_3_2 --> T_1_3_2["ARRM: SEM-017, FRM-011, TAB-016, SCT-008, SCT-009"]:::arrm

    N1_3_3((1.3.3)):::sc
    N1_3_3 --> R1_3_3_CA["Content Authoring"]:::role
    N1_3_3 --> R1_3_3_UX["UX Design"]:::role
    N1_3_3 --> T_1_3_3["ARRM: CSS-006, CSS-007, NAV-002, SCT-010, SCT-011 +5 more"]:::arrm

    N1_3_4((1.3.4)):::sc
    A_act_1_3_4["ACT: b33eff"]:::act --> N1_3_4
    A_axe_1_3_4["AXE: css-orientation-lock"]:::axe --> N1_3_4
    A_alfa_1_3_4["Alfa: SIA-R9"]:::alfa --> N1_3_4
    N1_3_4 --> R1_3_4_FE["Front-End Development"]:::role
    N1_3_4 --> R1_3_4_UX["UX Design"]:::role
    N1_3_4 --> T_1_3_4["ARRM: CSS-008"]:::arrm

    N1_3_5((1.3.5)):::sc
    A_act_1_3_5["ACT: 135hje"]:::act --> N1_3_5
    A_axe_1_3_5["AXE: autocomplete-valid"]:::axe --> N1_3_5
    A_alfa_1_3_5["Alfa: SIA-R8"]:::alfa --> N1_3_5
    N1_3_5 --> R1_3_5_FE["Front-End Development"]:::role
    N1_3_5 --> T_1_3_5["ARRM: FRM-012, FRM-013"]:::arrm

    N1_3_6((1.3.6)):::sc
    N1_3_6 --> R1_3_6_FE["Front-End Development"]:::role
    N1_3_6 --> R1_3_6_UX["UX Design"]:::role
    N1_3_6 --> T_1_3_6["ARRM: FRM-014"]:::arrm

    N1_4_1((1.4.1)):::sc
    N1_4_1 --> R1_4_1_VD["Visual Design"]:::role
    N1_4_1 --> R1_4_1_CA["Content Authoring"]:::role
    N1_4_1 --> T_1_4_1["ARRM: CSS-009, CSS-010, NAV-003"]:::arrm

    N1_4_2((1.4.2)):::sc
    N1_4_2 --> R1_4_2_FE["Front-End Development"]:::role
    N1_4_2 --> R1_4_2_UX["UX Design"]:::role
    N1_4_2 --> T_1_4_2["ARRM: ANM-022, ANM-023, ANM-024, ANM-025, ANM-026"]:::arrm

    N1_4_3((1.4.3)):::sc
    A_act_1_4_3["ACT: 09o5cg, afw4f7"]:::act --> N1_4_3
    A_axe_1_4_3["AXE: color-contrast"]:::axe --> N1_4_3
    A_alfa_1_4_3["Alfa: SIA-R69"]:::alfa --> N1_4_3
    N1_4_3 --> R1_4_3_VD["Visual Design"]:::role
    N1_4_3 --> T_1_4_3["ARRM: CSS-011, CSS-012"]:::arrm

    N1_4_4((1.4.4)):::sc
    A_axe_1_4_4["AXE: meta-viewport"]:::axe --> N1_4_4
    N1_4_4 --> R1_4_4_FE["Front-End Development"]:::role
    N1_4_4 --> R1_4_4_VD["Visual Design"]:::role
    N1_4_4 --> T_1_4_4["ARRM: CSS-013, CSS-014"]:::arrm

    N1_4_5((1.4.5)):::sc
    N1_4_5 --> R1_4_5_VD["Visual Design"]:::role
    N1_4_5 --> R1_4_5_CA["Content Authoring"]:::role
    N1_4_5 --> T_1_4_5["ARRM: IMG-019, IMG-020, IMG-021, CSS-015, SCT-017"]:::arrm

    N1_4_6((1.4.6)):::sc
    A_axe_1_4_6["AXE: color-contrast-enhanced"]:::axe --> N1_4_6
    N1_4_6 --> R1_4_6_VD["Visual Design"]:::role
    N1_4_6 --> T_1_4_6["ARRM: CSS-016, CSS-017"]:::arrm

    N1_4_7((1.4.7)):::sc
    N1_4_7 --> R1_4_7_CA["Content Authoring"]:::role
    N1_4_7 --> T_1_4_7["ARRM: ANM-027, ANM-028"]:::arrm

    N1_4_8((1.4.8)):::sc
    N1_4_8 --> R1_4_8_VD["Visual Design"]:::role
    N1_4_8 --> R1_4_8_FE["Front-End Development"]:::role
    N1_4_8 --> T_1_4_8["ARRM: SCT-018, SCT-019"]:::arrm

    N1_4_9((1.4.9)):::sc
    N1_4_9 --> R1_4_9_VD["Visual Design"]:::role
    N1_4_9 --> T_1_4_9["ARRM: IMG-022"]:::arrm

    N1_4_10((1.4.10)):::sc
    N1_4_10 --> R1_4_10_FE["Front-End Development"]:::role
    N1_4_10 --> R1_4_10_VD["Visual Design"]:::role
    N1_4_10 --> T_1_4_10["ARRM: CSS-018, CSS-019"]:::arrm

    N1_4_11((1.4.11)):::sc
    A_act_1_4_11["ACT: 4c31df"]:::act --> N1_4_11
    A_axe_1_4_11["AXE: non-text-color-contrast"]:::axe --> N1_4_11
    A_alfa_1_4_11["Alfa: SIA-R70"]:::alfa --> N1_4_11
    N1_4_11 --> R1_4_11_VD["Visual Design"]:::role
    N1_4_11 --> T_1_4_11["ARRM: CSS-020"]:::arrm

    N1_4_12((1.4.12)):::sc
    A_act_1_4_12["ACT: 9e45ec"]:::act --> N1_4_12
    A_alfa_1_4_12["Alfa: SIA-R86"]:::alfa --> N1_4_12
    N1_4_12 --> R1_4_12_FE["Front-End Development"]:::role
    N1_4_12 --> R1_4_12_VD["Visual Design"]:::role
    N1_4_12 --> T_1_4_12["ARRM: CSS-021"]:::arrm

    N1_4_13((1.4.13)):::sc
    N1_4_13 --> R1_4_13_FE["Front-End Development"]:::role
    N1_4_13 --> R1_4_13_UX["UX Design"]:::role
    N1_4_13 --> T_1_4_13["ARRM: INP-001, INP-002, INP-003"]:::arrm

    N2_1_1((2.1.1)):::sc
    N2_1_1 --> R2_1_1_FE["Front-End Development"]:::role
    N2_1_1 --> R2_1_1_UX["UX Design"]:::role
    N2_1_1 --> T_2_1_1["ARRM: INP-004, INP-005, INP-006, INP-007, INP-008 +4 more"]:::arrm

    N2_1_2((2.1.2)):::sc
    N2_1_2 --> R2_1_2_FE["Front-End Development"]:::role
    N2_1_2 --> T_2_1_2["ARRM: INP-012"]:::arrm

    N2_1_3((2.1.3)):::sc
    N2_1_3 --> R2_1_3_FE["Front-End Development"]:::role
    N2_1_3 --> T_2_1_3["ARRM: INP-013"]:::arrm

    N2_1_4((2.1.4)):::sc
    N2_1_4 --> R2_1_4_FE["Front-End Development"]:::role
    N2_1_4 --> R2_1_4_UX["UX Design"]:::role
    N2_1_4 --> T_2_1_4["ARRM: INP-014"]:::arrm

    N2_2_1((2.2.1)):::sc
    N2_2_1 --> R2_2_1_FE["Front-End Development"]:::role
    N2_2_1 --> R2_2_1_UX["UX Design"]:::role
    N2_2_1 --> T_2_2_1["ARRM: NAV-004, NAV-005"]:::arrm

    N2_2_2((2.2.2)):::sc
    N2_2_2 --> R2_2_2_FE["Front-End Development"]:::role
    N2_2_2 --> R2_2_2_UX["UX Design"]:::role
    N2_2_2 --> T_2_2_2["ARRM: NAV-006, ANM-030"]:::arrm

    N2_2_3((2.2.3)):::sc
    N2_2_3 --> R2_2_3_UX["UX Design"]:::role
    N2_2_3 --> R2_2_3_BUS["Business"]:::role
    N2_2_3 --> T_2_2_3["ARRM: ANM-031"]:::arrm

    N2_2_4((2.2.4)):::sc
    N2_2_4 --> R2_2_4_UX["UX Design"]:::role
    N2_2_4 --> T_2_2_4["ARRM: NAV-007"]:::arrm

    N2_2_5((2.2.5)):::sc
    N2_2_5 --> R2_2_5_FE["Front-End Development"]:::role
    N2_2_5 --> R2_2_5_BUS["Business"]:::role
    N2_2_5 --> T_2_2_5["ARRM: NAV-008"]:::arrm

    N2_2_6((2.2.6)):::sc
    N2_2_6 --> R2_2_6_UX["UX Design"]:::role
    N2_2_6 --> R2_2_6_BUS["Business"]:::role
    N2_2_6 --> T_2_2_6["ARRM: ANM-032"]:::arrm

    N2_3_1((2.3.1)):::sc
    N2_3_1 --> R2_3_1_CA["Content Authoring"]:::role
    N2_3_1 --> R2_3_1_VD["Visual Design"]:::role
    N2_3_1 --> T_2_3_1["ARRM: ANM-033"]:::arrm

    N2_3_2((2.3.2)):::sc
    N2_3_2 --> R2_3_2_CA["Content Authoring"]:::role
    N2_3_2 --> T_2_3_2["ARRM: ANM-034"]:::arrm

    N2_3_3((2.3.3)):::sc
    N2_3_3 --> R2_3_3_FE["Front-End Development"]:::role
    N2_3_3 --> R2_3_3_UX["UX Design"]:::role
    N2_3_3 --> T_2_3_3["ARRM: ANM-035, ANM-036"]:::arrm

    N2_4_1((2.4.1)):::sc
    A_act_2_4_1["ACT: 3e11da"]:::act --> N2_4_1
    A_axe_2_4_1["AXE: bypass"]:::axe --> N2_4_1
    A_alfa_2_4_1["Alfa: SIA-R87"]:::alfa --> N2_4_1
    N2_4_1 --> R2_4_1_FE["Front-End Development"]:::role
    N2_4_1 --> T_2_4_1["ARRM: SEM-018, NAV-009, NAV-010, NAV-011, NAV-012"]:::arrm

    N2_4_2((2.4.2)):::sc
    A_act_2_4_2["ACT: 2779a5"]:::act --> N2_4_2
    A_axe_2_4_2["AXE: document-title"]:::axe --> N2_4_2
    A_alfa_2_4_2["Alfa: SIA-R1"]:::alfa --> N2_4_2
    N2_4_2 --> R2_4_2_CA["Content Authoring"]:::role
    N2_4_2 --> R2_4_2_FE["Front-End Development"]:::role
    N2_4_2 --> T_2_4_2["ARRM: SEM-019, SEM-020"]:::arrm

    N2_4_3((2.4.3)):::sc
    N2_4_3 --> R2_4_3_FE["Front-End Development"]:::role
    N2_4_3 --> R2_4_3_UX["UX Design"]:::role
    N2_4_3 --> T_2_4_3["ARRM: SEM-021, INP-015, INP-016, FRM-015, NAV-013 +4 more"]:::arrm

    N2_4_4((2.4.4)):::sc
    A_act_2_4_4["ACT: c487ae"]:::act --> N2_4_4
    A_axe_2_4_4["AXE: link-name"]:::axe --> N2_4_4
    A_alfa_2_4_4["Alfa: SIA-R10"]:::alfa --> N2_4_4
    N2_4_4 --> R2_4_4_CA["Content Authoring"]:::role
    N2_4_4 --> R2_4_4_FE["Front-End Development"]:::role
    N2_4_4 --> T_2_4_4["ARRM: NAV-018, NAV-019"]:::arrm

    N2_4_5((2.4.5)):::sc
    N2_4_5 --> R2_4_5_UX["UX Design"]:::role
    N2_4_5 --> R2_4_5_BUS["Business"]:::role
    N2_4_5 --> T_2_4_5["ARRM: NAV-020"]:::arrm

    N2_4_6((2.4.6)):::sc
    N2_4_6 --> R2_4_6_CA["Content Authoring"]:::role
    N2_4_6 --> R2_4_6_FE["Front-End Development"]:::role
    N2_4_6 --> T_2_4_6["ARRM: SEM-022, SEM-023, FRM-016, TAB-017"]:::arrm

    N2_4_7((2.4.7)):::sc
    N2_4_7 --> R2_4_7_FE["Front-End Development"]:::role
    N2_4_7 --> R2_4_7_VD["Visual Design"]:::role
    N2_4_7 --> T_2_4_7["ARRM: INP-017, INP-018, CSS-022"]:::arrm

    N2_4_8((2.4.8)):::sc
    N2_4_8 --> R2_4_8_UX["UX Design"]:::role
    N2_4_8 --> R2_4_8_CA["Content Authoring"]:::role
    N2_4_8 --> T_2_4_8["ARRM: NAV-021"]:::arrm

    N2_4_9((2.4.9)):::sc
    N2_4_9 --> R2_4_9_CA["Content Authoring"]:::role
    N2_4_9 --> T_2_4_9["ARRM: NAV-022"]:::arrm

    N2_4_10((2.4.10)):::sc
    N2_4_10 --> R2_4_10_CA["Content Authoring"]:::role
    N2_4_10 --> T_2_4_10["ARRM: NAV-023"]:::arrm

    N2_4_11((2.4.11)):::sc
    A_act_2_4_11["ACT: 04639e"]:::act --> N2_4_11
    A_axe_2_4_11["AXE: focus-not-obscured"]:::axe --> N2_4_11
    A_alfa_2_4_11["Alfa: SIA-R109"]:::alfa --> N2_4_11
    N2_4_11 --> R2_4_11_UX["UX Design"]:::role
    N2_4_11 --> R2_4_11_FE["Front-End Development"]:::role

    N2_4_12((2.4.12)):::sc
    N2_4_12 --> R2_4_12_VD["Visual Design"]:::role
    N2_4_12 --> R2_4_12_UX["UX Design"]:::role

    N2_4_13((2.4.13)):::sc
    A_act_2_4_13["ACT: 674b10"]:::act --> N2_4_13
    A_axe_2_4_13["AXE: focus-appearance"]:::axe --> N2_4_13
    A_alfa_2_4_13["Alfa: SIA-R110"]:::alfa --> N2_4_13
    N2_4_13 --> R2_4_13_VD["Visual Design"]:::role

    N2_5_1((2.5.1)):::sc
    N2_5_1 --> R2_5_1_FE["Front-End Development"]:::role
    N2_5_1 --> R2_5_1_UX["UX Design"]:::role
    N2_5_1 --> T_2_5_1["ARRM: INP-019"]:::arrm

    N2_5_2((2.5.2)):::sc
    N2_5_2 --> R2_5_2_FE["Front-End Development"]:::role
    N2_5_2 --> T_2_5_2["ARRM: INP-020"]:::arrm

    N2_5_3((2.5.3)):::sc
    A_act_2_5_3["ACT: 2ee8b8"]:::act --> N2_5_3
    A_axe_2_5_3["AXE: label-content-name-mismatch"]:::axe --> N2_5_3
    A_alfa_2_5_3["Alfa: SIA-R14"]:::alfa --> N2_5_3
    N2_5_3 --> R2_5_3_FE["Front-End Development"]:::role
    N2_5_3 --> R2_5_3_CA["Content Authoring"]:::role
    N2_5_3 --> T_2_5_3["ARRM: INP-021"]:::arrm

    N2_5_4((2.5.4)):::sc
    N2_5_4 --> R2_5_4_FE["Front-End Development"]:::role
    N2_5_4 --> R2_5_4_UX["UX Design"]:::role
    N2_5_4 --> T_2_5_4["ARRM: INP-022, INP-023"]:::arrm

    N2_5_5((2.5.5)):::sc
    N2_5_5 --> R2_5_5_VD["Visual Design"]:::role
    N2_5_5 --> R2_5_5_FE["Front-End Development"]:::role
    N2_5_5 --> T_2_5_5["ARRM: CSS-023"]:::arrm

    N2_5_6((2.5.6)):::sc
    N2_5_6 --> R2_5_6_FE["Front-End Development"]:::role
    N2_5_6 --> T_2_5_6["ARRM: FRM-017"]:::arrm

    N2_5_7((2.5.7)):::sc
    A_axe_2_5_7["AXE: dragging-movements"]:::axe --> N2_5_7
    N2_5_7 --> R2_5_7_UX["UX Design"]:::role
    N2_5_7 --> R2_5_7_FE["Front-End Development"]:::role

    N2_5_8((2.5.8)):::sc
    A_act_2_5_8["ACT: a25f45"]:::act --> N2_5_8
    A_axe_2_5_8["AXE: target-size"]:::axe --> N2_5_8
    A_alfa_2_5_8["Alfa: SIA-R101"]:::alfa --> N2_5_8
    N2_5_8 --> R2_5_8_VD["Visual Design"]:::role

    N3_1_1((3.1.1)):::sc
    A_act_3_1_1["ACT: bf051a"]:::act --> N3_1_1
    A_axe_3_1_1["AXE: html-has-lang, html-lang-valid"]:::axe --> N3_1_1
    A_alfa_3_1_1["Alfa: SIA-R4"]:::alfa --> N3_1_1
    N3_1_1 --> R3_1_1_FE["Front-End Development"]:::role
    N3_1_1 --> R3_1_1_CA["Content Authoring"]:::role
    N3_1_1 --> T_3_1_1["ARRM: SCT-020, SCT-021"]:::arrm

    N3_1_2((3.1.2)):::sc
    A_act_3_1_2["ACT: de46e4"]:::act --> N3_1_2
    A_axe_3_1_2["AXE: valid-lang"]:::axe --> N3_1_2
    A_alfa_3_1_2["Alfa: SIA-R5"]:::alfa --> N3_1_2
    N3_1_2 --> R3_1_2_CA["Content Authoring"]:::role
    N3_1_2 --> R3_1_2_FE["Front-End Development"]:::role
    N3_1_2 --> T_3_1_2["ARRM: SCT-022"]:::arrm

    N3_1_3((3.1.3)):::sc
    N3_1_3 --> R3_1_3_CA["Content Authoring"]:::role
    N3_1_3 --> T_3_1_3["ARRM: SCT-023, SCT-024"]:::arrm

    N3_1_4((3.1.4)):::sc
    N3_1_4 --> R3_1_4_CA["Content Authoring"]:::role
    N3_1_4 --> T_3_1_4["ARRM: SCT-025"]:::arrm

    N3_1_5((3.1.5)):::sc
    N3_1_5 --> R3_1_5_CA["Content Authoring"]:::role
    N3_1_5 --> T_3_1_5["ARRM: SCT-026, SCT-027, SCT-028"]:::arrm

    N3_1_6((3.1.6)):::sc
    N3_1_6 --> R3_1_6_CA["Content Authoring"]:::role
    N3_1_6 --> T_3_1_6["ARRM: SCT-029"]:::arrm

    N3_2_1((3.2.1)):::sc
    N3_2_1 --> R3_2_1_FE["Front-End Development"]:::role
    N3_2_1 --> T_3_2_1["ARRM: FRM-018, NAV-024"]:::arrm

    N3_2_2((3.2.2)):::sc
    N3_2_2 --> R3_2_2_FE["Front-End Development"]:::role
    N3_2_2 --> R3_2_2_UX["UX Design"]:::role
    N3_2_2 --> T_3_2_2["ARRM: INP-024, FRM-019, FRM-020, NAV-025"]:::arrm

    N3_2_3((3.2.3)):::sc
    N3_2_3 --> R3_2_3_UX["UX Design"]:::role
    N3_2_3 --> R3_2_3_FE["Front-End Development"]:::role
    N3_2_3 --> T_3_2_3["ARRM: NAV-026"]:::arrm

    N3_2_4((3.2.4)):::sc
    N3_2_4 --> R3_2_4_UX["UX Design"]:::role
    N3_2_4 --> R3_2_4_CA["Content Authoring"]:::role
    N3_2_4 --> T_3_2_4["ARRM: FRM-021, FRM-022, NAV-027, NAV-028, NAV-029"]:::arrm

    N3_2_5((3.2.5)):::sc
    N3_2_5 --> R3_2_5_UX["UX Design"]:::role
    N3_2_5 --> R3_2_5_FE["Front-End Development"]:::role
    N3_2_5 --> T_3_2_5["ARRM: NAV-030, NAV-031"]:::arrm

    N3_2_6((3.2.6)):::sc
    A_act_3_2_6["ACT: 30b328"]:::act --> N3_2_6
    N3_2_6 --> R3_2_6_CA["Content Authoring"]:::role
    N3_2_6 --> R3_2_6_BUS["Business"]:::role

    N3_3_1((3.3.1)):::sc
    N3_3_1 --> R3_3_1_FE["Front-End Development"]:::role
    N3_3_1 --> R3_3_1_UX["UX Design"]:::role
    N3_3_1 --> T_3_3_1["ARRM: FRM-023, FRM-024"]:::arrm

    N3_3_2((3.3.2)):::sc
    N3_3_2 --> R3_3_2_CA["Content Authoring"]:::role
    N3_3_2 --> R3_3_2_UX["UX Design"]:::role
    N3_3_2 --> T_3_3_2["ARRM: FRM-025, FRM-026, FRM-027, FRM-028, FRM-029 +3 more"]:::arrm

    N3_3_3((3.3.3)):::sc
    N3_3_3 --> R3_3_3_UX["UX Design"]:::role
    N3_3_3 --> R3_3_3_CA["Content Authoring"]:::role
    N3_3_3 --> T_3_3_3["ARRM: FRM-033, FRM-034, FRM-035"]:::arrm

    N3_3_4((3.3.4)):::sc
    N3_3_4 --> R3_3_4_UX["UX Design"]:::role
    N3_3_4 --> R3_3_4_BUS["Business"]:::role
    N3_3_4 --> T_3_3_4["ARRM: FRM-036, FRM-037"]:::arrm

    N3_3_5((3.3.5)):::sc
    N3_3_5 --> R3_3_5_UX["UX Design"]:::role
    N3_3_5 --> R3_3_5_CA["Content Authoring"]:::role
    N3_3_5 --> T_3_3_5["ARRM: FRM-038"]:::arrm

    N3_3_6((3.3.6)):::sc
    N3_3_6 --> R3_3_6_UX["UX Design"]:::role
    N3_3_6 --> R3_3_6_BUS["Business"]:::role
    N3_3_6 --> T_3_3_6["ARRM: FRM-039"]:::arrm

    N3_3_7((3.3.7)):::sc
    A_axe_3_3_7["AXE: no-redundant-entry"]:::axe --> N3_3_7
    N3_3_7 --> R3_3_7_UX["UX Design"]:::role
    N3_3_7 --> R3_3_7_FE["Front-End Development"]:::role

    N3_3_8((3.3.8)):::sc
    N3_3_8 --> R3_3_8_BUS["Business"]:::role
    N3_3_8 --> R3_3_8_UX["UX Design"]:::role

    N3_3_9((3.3.9)):::sc
    N3_3_9 --> R3_3_9_BUS["Business"]:::role

    N4_1_2((4.1.2)):::sc
    A_act_4_1_2["ACT: 4e8ab6, 6cfa84, 97a4e1, eac66b, m6b1q3, rs8a50, sm249k, cae760, 07b338, 1a02b0, 2e1954, 3e12e1, 4e8ab6, 59796f"]:::act --> N4_1_2
    A_axe_4_1_2["AXE: aria-allowed-attr, aria-command-name, aria-input-field-name, aria-meter-name, aria-progressbar-name, aria-required-attr, aria-required-children, aria-required-parent, aria-roles, aria-toggle-field-name, aria-tooltip-name, aria-valid-attr, aria-valid-attr-value, button-name, select-name"]:::axe --> N4_1_2
    A_alfa_4_1_2["Alfa: SIA-R11, SIA-R12, SIA-R13, SIA-R15, SIA-R20, SIA-R21, SIA-R22, SIA-R23, SIA-R24, SIA-R28, SIA-R29, SIA-R30, SIA-R31"]:::alfa --> N4_1_2
    N4_1_2 --> R4_1_2_FE["Front-End Development"]:::role
    N4_1_2 --> T_4_1_2["ARRM: SEM-028, SEM-029, ANM-037"]:::arrm

    N4_1_3((4.1.3)):::sc
    A_act_4_1_3["ACT: 0sstp9"]:::act --> N4_1_3
    A_axe_4_1_3["AXE: status-messages"]:::axe --> N4_1_3
    A_alfa_4_1_3["Alfa: SIA-R90"]:::alfa --> N4_1_3
    N4_1_3 --> R4_1_3_FE["Front-End Development"]:::role
    N4_1_3 --> R4_1_3_UX["UX Design"]:::role
    N4_1_3 --> T_4_1_3["ARRM: DYN-001, DYN-002, DYN-003"]:::arrm

    click A_act_1_1_1 href "https://www.w3.org/WAI/standards-guidelines/act/rules/23a2a8/" _blank
    click A_axe_1_1_1 href "https://dequeuniversity.com/rules/axe/latest/area-alt" _blank
    click A_alfa_1_1_1 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_1_1_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#images-and-graphs" _blank
    click N1_1_1 href "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html" _blank
    click T_1_2_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N1_2_1 href "https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html" _blank
    click A_act_1_2_2 href "https://www.w3.org/WAI/standards-guidelines/act/rules/eac66b/" _blank
    click A_axe_1_2_2 href "https://dequeuniversity.com/rules/axe/latest/video-caption" _blank
    click T_1_2_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N1_2_2 href "https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html" _blank
    click T_1_2_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N1_2_3 href "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded.html" _blank
    click T_1_2_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N1_2_4 href "https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html" _blank
    click T_1_2_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N1_2_5 href "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html" _blank
    click T_1_2_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N1_2_6 href "https://www.w3.org/WAI/WCAG22/Understanding/sign-language-prerecorded.html" _blank
    click T_1_2_7 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N1_2_7 href "https://www.w3.org/WAI/WCAG22/Understanding/extended-audio-description-prerecorded.html" _blank
    click T_1_2_8 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N1_2_8 href "https://www.w3.org/WAI/WCAG22/Understanding/media-alternative-prerecorded.html" _blank
    click T_1_2_9 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N1_2_9 href "https://www.w3.org/WAI/WCAG22/Understanding/audio-only-live.html" _blank
    click A_act_1_3_1 href "https://www.w3.org/WAI/standards-guidelines/act/rules/307n5z/" _blank
    click A_axe_1_3_1 href "https://dequeuniversity.com/rules/axe/latest/definition-list" _blank
    click A_alfa_1_3_1 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_1_3_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click N1_3_1 href "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html" _blank
    click T_1_3_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click N1_3_2 href "https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html" _blank
    click T_1_3_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click N1_3_3 href "https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html" _blank
    click A_act_1_3_4 href "https://www.w3.org/WAI/standards-guidelines/act/rules/b33eff/" _blank
    click A_axe_1_3_4 href "https://dequeuniversity.com/rules/axe/latest/css-orientation-lock" _blank
    click A_alfa_1_3_4 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_1_3_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click N1_3_4 href "https://www.w3.org/WAI/WCAG22/Understanding/orientation.html" _blank
    click A_act_1_3_5 href "https://www.w3.org/WAI/standards-guidelines/act/rules/135hje/" _blank
    click A_axe_1_3_5 href "https://dequeuniversity.com/rules/axe/latest/autocomplete-valid" _blank
    click A_alfa_1_3_5 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_1_3_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click N1_3_5 href "https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html" _blank
    click T_1_3_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click N1_3_6 href "https://www.w3.org/WAI/WCAG22/Understanding/identify-purpose.html" _blank
    click T_1_4_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click N1_4_1 href "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html" _blank
    click T_1_4_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N1_4_2 href "https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html" _blank
    click A_act_1_4_3 href "https://www.w3.org/WAI/standards-guidelines/act/rules/09o5cg/" _blank
    click A_axe_1_4_3 href "https://dequeuniversity.com/rules/axe/latest/color-contrast" _blank
    click A_alfa_1_4_3 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_1_4_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click N1_4_3 href "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" _blank
    click A_axe_1_4_4 href "https://dequeuniversity.com/rules/axe/latest/meta-viewport" _blank
    click T_1_4_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click N1_4_4 href "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html" _blank
    click T_1_4_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#images-and-graphs" _blank
    click N1_4_5 href "https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html" _blank
    click A_axe_1_4_6 href "https://dequeuniversity.com/rules/axe/latest/color-contrast-enhanced" _blank
    click T_1_4_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click N1_4_6 href "https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html" _blank
    click T_1_4_7 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N1_4_7 href "https://www.w3.org/WAI/WCAG22/Understanding/low-or-no-background-audio.html" _blank
    click T_1_4_8 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click N1_4_8 href "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html" _blank
    click T_1_4_9 href "https://www.w3.org/WAI/planning/arrm/tasks/#images-and-graphs" _blank
    click N1_4_9 href "https://www.w3.org/WAI/WCAG22/Understanding/images-of-text-no-exception.html" _blank
    click T_1_4_10 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click N1_4_10 href "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html" _blank
    click A_act_1_4_11 href "https://www.w3.org/WAI/standards-guidelines/act/rules/4c31df/" _blank
    click A_axe_1_4_11 href "https://dequeuniversity.com/rules/axe/latest/non-text-color-contrast" _blank
    click A_alfa_1_4_11 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_1_4_11 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click N1_4_11 href "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" _blank
    click A_act_1_4_12 href "https://www.w3.org/WAI/standards-guidelines/act/rules/9e45ec/" _blank
    click A_alfa_1_4_12 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_1_4_12 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click N1_4_12 href "https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html" _blank
    click T_1_4_13 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click N1_4_13 href "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html" _blank
    click T_2_1_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click N2_1_1 href "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html" _blank
    click T_2_1_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click N2_1_2 href "https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html" _blank
    click T_2_1_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click N2_1_3 href "https://www.w3.org/WAI/WCAG22/Understanding/keyboard-no-exception.html" _blank
    click T_2_1_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click N2_1_4 href "https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html" _blank
    click T_2_2_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click N2_2_1 href "https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html" _blank
    click T_2_2_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click N2_2_2 href "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html" _blank
    click T_2_2_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N2_2_3 href "https://www.w3.org/WAI/WCAG22/Understanding/no-timing.html" _blank
    click T_2_2_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click N2_2_4 href "https://www.w3.org/WAI/WCAG22/Understanding/interruptions.html" _blank
    click T_2_2_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click N2_2_5 href "https://www.w3.org/WAI/WCAG22/Understanding/re-authenticating.html" _blank
    click T_2_2_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N2_2_6 href "https://www.w3.org/WAI/WCAG22/Understanding/timeouts.html" _blank
    click T_2_3_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N2_3_1 href "https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html" _blank
    click T_2_3_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N2_3_2 href "https://www.w3.org/WAI/WCAG22/Understanding/three-flashes.html" _blank
    click T_2_3_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#animation-and-movement" _blank
    click N2_3_3 href "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html" _blank
    click A_act_2_4_1 href "https://www.w3.org/WAI/standards-guidelines/act/rules/3e11da/" _blank
    click A_axe_2_4_1 href "https://dequeuniversity.com/rules/axe/latest/bypass" _blank
    click A_alfa_2_4_1 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_2_4_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click N2_4_1 href "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html" _blank
    click A_act_2_4_2 href "https://www.w3.org/WAI/standards-guidelines/act/rules/2779a5/" _blank
    click A_axe_2_4_2 href "https://dequeuniversity.com/rules/axe/latest/document-title" _blank
    click A_alfa_2_4_2 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_2_4_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click N2_4_2 href "https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html" _blank
    click T_2_4_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click N2_4_3 href "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html" _blank
    click A_act_2_4_4 href "https://www.w3.org/WAI/standards-guidelines/act/rules/c487ae/" _blank
    click A_axe_2_4_4 href "https://dequeuniversity.com/rules/axe/latest/link-name" _blank
    click A_alfa_2_4_4 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_2_4_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click N2_4_4 href "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html" _blank
    click T_2_4_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click N2_4_5 href "https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html" _blank
    click T_2_4_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click N2_4_6 href "https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html" _blank
    click T_2_4_7 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click N2_4_7 href "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" _blank
    click T_2_4_8 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click N2_4_8 href "https://www.w3.org/WAI/WCAG22/Understanding/location.html" _blank
    click T_2_4_9 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click N2_4_9 href "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-link-only.html" _blank
    click T_2_4_10 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click N2_4_10 href "https://www.w3.org/WAI/WCAG22/Understanding/section-headings.html" _blank
    click A_act_2_4_11 href "https://www.w3.org/WAI/standards-guidelines/act/rules/04639e/" _blank
    click A_axe_2_4_11 href "https://dequeuniversity.com/rules/axe/latest/focus-not-obscured" _blank
    click A_alfa_2_4_11 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click N2_4_11 href "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html" _blank
    click N2_4_12 href "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html" _blank
    click A_act_2_4_13 href "https://www.w3.org/WAI/standards-guidelines/act/rules/674b10/" _blank
    click A_axe_2_4_13 href "https://dequeuniversity.com/rules/axe/latest/focus-appearance" _blank
    click A_alfa_2_4_13 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click N2_4_13 href "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html" _blank
    click T_2_5_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click N2_5_1 href "https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html" _blank
    click T_2_5_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click N2_5_2 href "https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html" _blank
    click A_act_2_5_3 href "https://www.w3.org/WAI/standards-guidelines/act/rules/2ee8b8/" _blank
    click A_axe_2_5_3 href "https://dequeuniversity.com/rules/axe/latest/label-content-name-mismatch" _blank
    click A_alfa_2_5_3 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_2_5_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click N2_5_3 href "https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html" _blank
    click T_2_5_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click N2_5_4 href "https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation.html" _blank
    click T_2_5_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#css-and-presentation" _blank
    click N2_5_5 href "https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html" _blank
    click T_2_5_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click N2_5_6 href "https://www.w3.org/WAI/WCAG22/Understanding/concurrent-input-mechanisms.html" _blank
    click A_axe_2_5_7 href "https://dequeuniversity.com/rules/axe/latest/dragging-movements" _blank
    click N2_5_7 href "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html" _blank
    click A_act_2_5_8 href "https://www.w3.org/WAI/standards-guidelines/act/rules/a25f45/" _blank
    click A_axe_2_5_8 href "https://dequeuniversity.com/rules/axe/latest/target-size" _blank
    click A_alfa_2_5_8 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click N2_5_8 href "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html" _blank
    click A_act_3_1_1 href "https://www.w3.org/WAI/standards-guidelines/act/rules/bf051a/" _blank
    click A_axe_3_1_1 href "https://dequeuniversity.com/rules/axe/latest/html-has-lang" _blank
    click A_alfa_3_1_1 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_3_1_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click N3_1_1 href "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html" _blank
    click A_act_3_1_2 href "https://www.w3.org/WAI/standards-guidelines/act/rules/de46e4/" _blank
    click A_axe_3_1_2 href "https://dequeuniversity.com/rules/axe/latest/valid-lang" _blank
    click A_alfa_3_1_2 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_3_1_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click N3_1_2 href "https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html" _blank
    click T_3_1_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click N3_1_3 href "https://www.w3.org/WAI/WCAG22/Understanding/unusual-words.html" _blank
    click T_3_1_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click N3_1_4 href "https://www.w3.org/WAI/WCAG22/Understanding/abbreviations.html" _blank
    click T_3_1_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click N3_1_5 href "https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html" _blank
    click T_3_1_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#static-content" _blank
    click N3_1_6 href "https://www.w3.org/WAI/WCAG22/Understanding/pronunciation.html" _blank
    click T_3_2_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click N3_2_1 href "https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html" _blank
    click T_3_2_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#input-modalities" _blank
    click N3_2_2 href "https://www.w3.org/WAI/WCAG22/Understanding/on-input.html" _blank
    click T_3_2_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click N3_2_3 href "https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html" _blank
    click T_3_2_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click N3_2_4 href "https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html" _blank
    click T_3_2_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#navigation" _blank
    click N3_2_5 href "https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html" _blank
    click A_act_3_2_6 href "https://www.w3.org/WAI/standards-guidelines/act/rules/30b328/" _blank
    click N3_2_6 href "https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html" _blank
    click T_3_3_1 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click N3_3_1 href "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html" _blank
    click T_3_3_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click N3_3_2 href "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html" _blank
    click T_3_3_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click N3_3_3 href "https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html" _blank
    click T_3_3_4 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click N3_3_4 href "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html" _blank
    click T_3_3_5 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click N3_3_5 href "https://www.w3.org/WAI/WCAG22/Understanding/help.html" _blank
    click T_3_3_6 href "https://www.w3.org/WAI/planning/arrm/tasks/#form-interactions" _blank
    click N3_3_6 href "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-all.html" _blank
    click A_axe_3_3_7 href "https://dequeuniversity.com/rules/axe/latest/no-redundant-entry" _blank
    click N3_3_7 href "https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html" _blank
    click N3_3_8 href "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html" _blank
    click N3_3_9 href "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-enhanced.html" _blank
    click A_act_4_1_2 href "https://www.w3.org/WAI/standards-guidelines/act/rules/4e8ab6/" _blank
    click A_axe_4_1_2 href "https://dequeuniversity.com/rules/axe/latest/aria-allowed-attr" _blank
    click A_alfa_4_1_2 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_4_1_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click N4_1_2 href "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html" _blank
    click A_act_4_1_3 href "https://www.w3.org/WAI/standards-guidelines/act/rules/0sstp9/" _blank
    click A_axe_4_1_3 href "https://dequeuniversity.com/rules/axe/latest/status-messages" _blank
    click A_alfa_4_1_3 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_4_1_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#dynamic-interactions" _blank
    click N4_1_3 href "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html" _blank
    click R1_1_1_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_1_1_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R1_1_1_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R1_2_1_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_2_1_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R1_2_2_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_2_3_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_2_4_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_2_5_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_2_6_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_2_7_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_2_8_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_2_9_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_3_1_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R1_3_1_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_3_1_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R1_3_2_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R1_3_2_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R1_3_3_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_3_3_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R1_3_4_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R1_3_4_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R1_3_5_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R1_3_6_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R1_3_6_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R1_4_1_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R1_4_1_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_4_2_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R1_4_2_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R1_4_3_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R1_4_4_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R1_4_4_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R1_4_5_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R1_4_5_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_4_6_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R1_4_7_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R1_4_8_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R1_4_8_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R1_4_9_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R1_4_10_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R1_4_10_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R1_4_11_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R1_4_12_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R1_4_12_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R1_4_13_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R1_4_13_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_1_1_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_1_1_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_1_2_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_1_3_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_1_4_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_1_4_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_2_1_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_2_1_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_2_2_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_2_2_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_2_3_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_2_4_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_2_5_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_2_6_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_3_1_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R2_3_1_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R2_3_2_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R2_3_3_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_3_3_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_4_1_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_4_2_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R2_4_2_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_4_3_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_4_3_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_4_4_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R2_4_4_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_4_5_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_4_6_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R2_4_6_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_4_7_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_4_7_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R2_4_8_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_4_8_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R2_4_9_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R2_4_10_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R2_4_11_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_4_11_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_4_12_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R2_4_12_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_4_13_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R2_5_1_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_5_1_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_5_2_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_5_3_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_5_3_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R2_5_4_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_5_4_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_5_5_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R2_5_5_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_5_6_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_5_7_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R2_5_7_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R2_5_8_VD href "https://www.w3.org/WAI/planning/arrm/visual-designer" _blank
    click R3_1_1_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R3_1_1_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R3_1_2_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R3_1_2_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R3_1_3_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R3_1_4_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R3_1_5_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R3_1_6_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R3_2_1_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R3_2_2_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R3_2_2_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R3_2_3_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R3_2_3_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R3_2_4_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R3_2_4_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R3_2_5_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R3_2_5_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R3_2_6_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R3_3_1_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R3_3_1_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R3_3_2_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R3_3_2_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R3_3_3_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R3_3_3_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R3_3_4_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R3_3_5_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R3_3_5_CA href "https://www.w3.org/WAI/planning/arrm/content-author" _blank
    click R3_3_6_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R3_3_7_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R3_3_7_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R3_3_8_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
    click R4_1_2_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R4_1_3_FE href "https://www.w3.org/WAI/planning/arrm/front-end/" _blank
    click R4_1_3_UX href "https://www.w3.org/WAI/planning/arrm/user-experience" _blank
```
