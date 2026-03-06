# WCAG 2.2 Principle 4: Robust – Roles & Testing

Success Criteria 4.x.x (2 SCs).

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

    N4_1_2((4.1.2)):::sc
    A_act_4_1_2["ACT: 4e8ab6, 6cfa84, 97a4e1, eac66b, m6b1q3, rs8a50, sm249k, cae760, 07b338, 1a02b0, 2e1954, 3e12e1, 4e8ab6, 59796f"]:::act --> N4_1_2
    A_axe_4_1_2["AXE: aria-allowed-attr, aria-command-name, aria-input-field-name, aria-meter-name, aria-progressbar-name, aria-required-attr, aria-required-children, aria-required-parent, aria-roles, aria-toggle-field-name, aria-tooltip-name, aria-valid-attr, aria-valid-attr-value, button-name, select-name"]:::axe --> N4_1_2
    A_alfa_4_1_2["Alfa: SIA-R11, SIA-R12, SIA-R13, SIA-R15, SIA-R20, SIA-R21, SIA-R22, SIA-R23, SIA-R24, SIA-R28, SIA-R29, SIA-R30, SIA-R31"]:::alfa --> N4_1_2
    N4_1_2 --> R4_1_2_FE["Front-End Development"]:::role
    N4_1_2 --> T_4_1_2["ARRM: SEM-028, SEM-029, ANM-037"]:::arrm
    N4_1_2 --> TT_4_1_2["TT: 4.1.2.A, 4.1.2.B, 4.1.2.C, 4.1.2.D"]:::tt

    N4_1_3((4.1.3)):::sc
    A_act_4_1_3["ACT: 0sstp9"]:::act --> N4_1_3
    A_axe_4_1_3["AXE: status-messages"]:::axe --> N4_1_3
    A_alfa_4_1_3["Alfa: SIA-R90"]:::alfa --> N4_1_3
    N4_1_3 --> R4_1_3_FE["Front-End Development"]:::role
    N4_1_3 --> R4_1_3_UX["UX Design"]:::role
    N4_1_3 --> T_4_1_3["ARRM: DYN-001, DYN-002, DYN-003"]:::arrm
    N4_1_3 --> TT_4_1_3["TT: 4.1.3.A, 4.1.3.B"]:::tt

    click A_act_4_1_2 href "https://www.w3.org/WAI/standards-guidelines/act/rules/4e8ab6/" _blank
    click A_axe_4_1_2 href "https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr" _blank
    click A_alfa_4_1_2 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_4_1_2 href "https://www.w3.org/WAI/planning/arrm/tasks/#semantic-structure" _blank
    click TT_4_1_2 href "https://www.w3.org/WAI/standards-guidelines/act/implementations/trusted-tester/" _blank
    click N4_1_2 href "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html" _blank
    click A_act_4_1_3 href "https://www.w3.org/WAI/standards-guidelines/act/rules/0sstp9/" _blank
    click A_axe_4_1_3 href "https://dequeuniversity.com/rules/axe/4.11/status-messages" _blank
    click A_alfa_4_1_3 href "https://github.com/siteimprove/alfa/blob/main/packages/alfa-rules/README.md" _blank
    click T_4_1_3 href "https://www.w3.org/WAI/planning/arrm/tasks/#dynamic-interactions" _blank
    click TT_4_1_3 href "https://www.w3.org/WAI/standards-guidelines/act/implementations/trusted-tester/" _blank
    click N4_1_3 href "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html" _blank
```
