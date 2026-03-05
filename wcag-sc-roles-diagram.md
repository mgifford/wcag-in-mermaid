# WCAG 2.2 Success Criteria – Roles & Testing

SC nodes form a **vertical spine** running top to bottom on the left.
Responsible roles and testing tools branch off to the right of each SC.
(`graph LR` is used so that root SC nodes stack vertically, not horizontally.)

**Legend**

| Colour | Meaning |
|--------|---------|
| 🔵 Blue | Success Criterion |
| 🟠 Orange | Responsible Role |
| 🟢 Green | Testing approach |

```mermaid
graph LR
    classDef sc   fill:#e1f5fe,stroke:#01579b,color:#000
    classDef role fill:#fff3e0,stroke:#e65100,color:#000
    classDef test fill:#f1f8e9,stroke:#33691e,color:#000

    N1_1_1((1.1.1)):::sc --> R1_1_1_B[Business]:::role
    N1_1_1 --> R1_1_1_CA[Content Authoring]:::role
    N1_1_1 --> R1_1_1_VD[Visual Design]:::role
    N1_1_1 --> R1_1_1_UX[User Experience Design]:::role
    N1_1_1 --> R1_1_1_FE[Front-End Development]:::role
    N1_1_1 --- T1_1_1>"ACT: Rule 59796f (Partial)<br/>TT: ANDI / Manual Alt Audit"]:::test

    N1_2_1((1.2.1)):::sc --> R1_2_1_CA[Content Authoring]:::role
    N1_2_1 --> R1_2_1_VD[Visual Design]:::role
    N1_2_1 --> R1_2_1_UX[User Experience Design]:::role

    N1_2_2((1.2.2)):::sc --> R1_2_2_CA[Content Authoring]:::role
    N1_2_2 --> R1_2_2_UX[User Experience Design]:::role

    N1_2_3((1.2.3)):::sc --> R1_2_3_CA[Content Authoring]:::role

    N1_2_4((1.2.4)):::sc --> R1_2_4_CA[Content Authoring]:::role
    N1_2_4 --> R1_2_4_UX[User Experience Design]:::role

    N1_2_5((1.2.5)):::sc --> R1_2_5_CA[Content Authoring]:::role
    N1_2_5 --> R1_2_5_UX[User Experience Design]:::role

    N1_2_6((1.2.6)):::sc --> R1_2_6_CA[Content Authoring]:::role
    N1_2_6 --> R1_2_6_UX[User Experience Design]:::role

    N1_2_7((1.2.7)):::sc --> R1_2_7_CA[Content Authoring]:::role
    N1_2_7 --> R1_2_7_UX[User Experience Design]:::role

    N1_2_8((1.2.8)):::sc --> R1_2_8_CA[Content Authoring]:::role
    N1_2_8 --> R1_2_8_UX[User Experience Design]:::role

    N1_2_9((1.2.9)):::sc --> R1_2_9_CA[Content Authoring]:::role
    N1_2_9 --> R1_2_9_UX[User Experience Design]:::role

    N1_3_1((1.3.1)):::sc --> R1_3_1_CA[Content Authoring]:::role
    N1_3_1 --> R1_3_1_VD[Visual Design]:::role
    N1_3_1 --> R1_3_1_UX[User Experience Design]:::role
    N1_3_1 --> R1_3_1_FE[Front-End Development]:::role

    N1_3_2((1.3.2)):::sc --> R1_3_2_VD[Visual Design]:::role
    N1_3_2 --> R1_3_2_UX[User Experience Design]:::role
    N1_3_2 --> R1_3_2_FE[Front-End Development]:::role

    N1_3_3((1.3.3)):::sc --> R1_3_3_B[Business]:::role
    N1_3_3 --> R1_3_3_CA[Content Authoring]:::role
    N1_3_3 --> R1_3_3_VD[Visual Design]:::role
    N1_3_3 --> R1_3_3_UX[User Experience Design]:::role
    N1_3_3 --> R1_3_3_FE[Front-End Development]:::role

    N1_3_4((1.3.4)):::sc --> R1_3_4_VD[Visual Design]:::role
    N1_3_4 --> R1_3_4_UX[User Experience Design]:::role

    N1_3_5((1.3.5)):::sc --> R1_3_5_UX[User Experience Design]:::role
    N1_3_5 --> R1_3_5_FE[Front-End Development]:::role

    N1_3_6((1.3.6)):::sc --> R1_3_6_UX[User Experience Design]:::role
    N1_3_6 --> R1_3_6_FE[Front-End Development]:::role

    N1_4_1((1.4.1)):::sc --> R1_4_1_CA[Content Authoring]:::role
    N1_4_1 --> R1_4_1_VD[Visual Design]:::role
    N1_4_1 --> R1_4_1_UX[User Experience Design]:::role

    N1_4_2((1.4.2)):::sc --> R1_4_2_UX[User Experience Design]:::role

    N1_4_3((1.4.3)):::sc --> R1_4_3_VD[Visual Design]:::role
    N1_4_3 --- T1_4_3>"ACT: Rule afw4f (Full)<br/>TT: Contrast Analyzer"]:::test

    N1_4_4((1.4.4)):::sc --> R1_4_4_VD[Visual Design]:::role
    N1_4_4 --> R1_4_4_UX[User Experience Design]:::role
    N1_4_4 --> R1_4_4_FE[Front-End Development]:::role

    N1_4_5((1.4.5)):::sc --> R1_4_5_CA[Content Authoring]:::role
    N1_4_5 --> R1_4_5_VD[Visual Design]:::role
    N1_4_5 --> R1_4_5_FE[Front-End Development]:::role

    N1_4_6((1.4.6)):::sc --> R1_4_6_VD[Visual Design]:::role

    N1_4_7((1.4.7)):::sc --> R1_4_7_CA[Content Authoring]:::role
    N1_4_7 --> R1_4_7_UX[User Experience Design]:::role
    N1_4_7 --> R1_4_7_FE[Front-End Development]:::role

    N1_4_8((1.4.8)):::sc --> R1_4_8_VD[Visual Design]:::role
    N1_4_8 --> R1_4_8_UX[User Experience Design]:::role
    N1_4_8 --> R1_4_8_FE[Front-End Development]:::role

    N1_4_9((1.4.9)):::sc --> R1_4_9_CA[Content Authoring]:::role
    N1_4_9 --> R1_4_9_VD[Visual Design]:::role

    N1_4_10((1.4.10)):::sc --> R1_4_10_VD[Visual Design]:::role
    N1_4_10 --> R1_4_10_UX[User Experience Design]:::role
    N1_4_10 --> R1_4_10_FE[Front-End Development]:::role

    N1_4_11((1.4.11)):::sc --> R1_4_11_VD[Visual Design]:::role

    N1_4_12((1.4.12)):::sc --> R1_4_12_VD[Visual Design]:::role
    N1_4_12 --> R1_4_12_FE[Front-End Development]:::role

    N1_4_13((1.4.13)):::sc --> R1_4_13_UX[User Experience Design]:::role
    N1_4_13 --> R1_4_13_FE[Front-End Development]:::role

    N2_1_1((2.1.1)):::sc --> R2_1_1_VD[Visual Design]:::role
    N2_1_1 --> R2_1_1_UX[User Experience Design]:::role
    N2_1_1 --> R2_1_1_FE[Front-End Development]:::role

    N2_1_2((2.1.2)):::sc --> R2_1_2_FE[Front-End Development]:::role

    N2_1_3((2.1.3)):::sc --> R2_1_3_UX[User Experience Design]:::role
    N2_1_3 --> R2_1_3_FE[Front-End Development]:::role

    N2_1_4((2.1.4)):::sc --> R2_1_4_UX[User Experience Design]:::role

    N2_2_1((2.2.1)):::sc --> R2_2_1_B[Business]:::role
    N2_2_1 --> R2_2_1_UX[User Experience Design]:::role

    N2_2_2((2.2.2)):::sc --> R2_2_2_VD[Visual Design]:::role
    N2_2_2 --> R2_2_2_UX[User Experience Design]:::role

    N2_2_3((2.2.3)):::sc --> R2_2_3_UX[User Experience Design]:::role

    N2_2_4((2.2.4)):::sc --> R2_2_4_UX[User Experience Design]:::role

    N2_2_5((2.2.5)):::sc --> R2_2_5_UX[User Experience Design]:::role

    N2_2_6((2.2.6)):::sc --> R2_2_6_UX[User Experience Design]:::role

    N2_3_1((2.3.1)):::sc --> R2_3_1_VD[Visual Design]:::role
    N2_3_1 --> R2_3_1_UX[User Experience Design]:::role

    N2_3_2((2.3.2)):::sc --> R2_3_2_VD[Visual Design]:::role
    N2_3_2 --> R2_3_2_UX[User Experience Design]:::role

    N2_3_3((2.3.3)):::sc --> R2_3_3_UX[User Experience Design]:::role

    N2_4_1((2.4.1)):::sc --> R2_4_1_CA[Content Authoring]:::role
    N2_4_1 --> R2_4_1_UX[User Experience Design]:::role
    N2_4_1 --> R2_4_1_FE[Front-End Development]:::role

    N2_4_2((2.4.2)):::sc --> R2_4_2_CA[Content Authoring]:::role
    N2_4_2 --> R2_4_2_UX[User Experience Design]:::role

    N2_4_3((2.4.3)):::sc --> R2_4_3_VD[Visual Design]:::role
    N2_4_3 --> R2_4_3_UX[User Experience Design]:::role
    N2_4_3 --> R2_4_3_FE[Front-End Development]:::role

    N2_4_4((2.4.4)):::sc --> R2_4_4_CA[Content Authoring]:::role
    N2_4_4 --> R2_4_4_FE[Front-End Development]:::role

    N2_4_5((2.4.5)):::sc --> R2_4_5_UX[User Experience Design]:::role

    N2_4_6((2.4.6)):::sc --> R2_4_6_CA[Content Authoring]:::role
    N2_4_6 --> R2_4_6_UX[User Experience Design]:::role
    N2_4_6 --> R2_4_6_FE[Front-End Development]:::role

    N2_4_7((2.4.7)):::sc --> R2_4_7_VD[Visual Design]:::role
    N2_4_7 --> R2_4_7_UX[User Experience Design]:::role
    N2_4_7 --> R2_4_7_FE[Front-End Development]:::role

    N2_4_8((2.4.8)):::sc --> R2_4_8_VD[Visual Design]:::role
    N2_4_8 --> R2_4_8_UX[User Experience Design]:::role

    N2_4_9((2.4.9)):::sc --> R2_4_9_CA[Content Authoring]:::role
    N2_4_9 --> R2_4_9_UX[User Experience Design]:::role

    N2_4_10((2.4.10)):::sc --> R2_4_10_CA[Content Authoring]:::role
    N2_4_10 --> R2_4_10_UX[User Experience Design]:::role
    N2_4_10 --> R2_4_10_FE[Front-End Development]:::role

    N2_5_1((2.5.1)):::sc --> R2_5_1_UX[User Experience Design]:::role

    N2_5_2((2.5.2)):::sc --> R2_5_2_UX[User Experience Design]:::role

    N2_5_3((2.5.3)):::sc --> R2_5_3_CA[Content Authoring]:::role
    N2_5_3 --> R2_5_3_UX[User Experience Design]:::role

    N2_5_4((2.5.4)):::sc --> R2_5_4_UX[User Experience Design]:::role

    N2_5_5((2.5.5)):::sc --> R2_5_5_VD[Visual Design]:::role

    N2_5_6((2.5.6)):::sc --> R2_5_6_UX[User Experience Design]:::role
    N2_5_6 --> R2_5_6_FE[Front-End Development]:::role

    N3_1_1((3.1.1)):::sc --> R3_1_1_CA[Content Authoring]:::role
    N3_1_1 --> R3_1_1_FE[Front-End Development]:::role

    N3_1_2((3.1.2)):::sc --> R3_1_2_CA[Content Authoring]:::role
    N3_1_2 --> R3_1_2_FE[Front-End Development]:::role

    N3_1_3((3.1.3)):::sc --> R3_1_3_CA[Content Authoring]:::role
    N3_1_3 --> R3_1_3_UX[User Experience Design]:::role

    N3_1_4((3.1.4)):::sc --> R3_1_4_FE[Front-End Development]:::role

    N3_1_5((3.1.5)):::sc --> R3_1_5_CA[Content Authoring]:::role
    N3_1_5 --> R3_1_5_VD[Visual Design]:::role
    N3_1_5 --> R3_1_5_UX[User Experience Design]:::role

    N3_1_6((3.1.6)):::sc --> R3_1_6_CA[Content Authoring]:::role
    N3_1_6 --> R3_1_6_UX[User Experience Design]:::role
    N3_1_6 --> R3_1_6_FE[Front-End Development]:::role

    N3_2_1((3.2.1)):::sc --> R3_2_1_UX[User Experience Design]:::role
    N3_2_1 --> R3_2_1_FE[Front-End Development]:::role

    N3_2_2((3.2.2)):::sc --> R3_2_2_UX[User Experience Design]:::role
    N3_2_2 --> R3_2_2_FE[Front-End Development]:::role

    N3_2_3((3.2.3)):::sc --> R3_2_3_VD[Visual Design]:::role
    N3_2_3 --> R3_2_3_UX[User Experience Design]:::role

    N3_2_4((3.2.4)):::sc --> R3_2_4_CA[Content Authoring]:::role
    N3_2_4 --> R3_2_4_VD[Visual Design]:::role
    N3_2_4 --> R3_2_4_UX[User Experience Design]:::role

    N3_2_5((3.2.5)):::sc --> R3_2_5_CA[Content Authoring]:::role
    N3_2_5 --> R3_2_5_VD[Visual Design]:::role
    N3_2_5 --> R3_2_5_UX[User Experience Design]:::role
    N3_2_5 --> R3_2_5_FE[Front-End Development]:::role

    N3_3_1((3.3.1)):::sc --> R3_3_1_VD[Visual Design]:::role
    N3_3_1 --> R3_3_1_UX[User Experience Design]:::role

    N3_3_2((3.3.2)):::sc --> R3_3_2_CA[Content Authoring]:::role
    N3_3_2 --> R3_3_2_VD[Visual Design]:::role
    N3_3_2 --> R3_3_2_UX[User Experience Design]:::role
    N3_3_2 --> R3_3_2_FE[Front-End Development]:::role

    N3_3_3((3.3.3)):::sc --> R3_3_3_CA[Content Authoring]:::role
    N3_3_3 --> R3_3_3_VD[Visual Design]:::role
    N3_3_3 --> R3_3_3_UX[User Experience Design]:::role
    N3_3_3 --> R3_3_3_FE[Front-End Development]:::role

    N3_3_4((3.3.4)):::sc --> R3_3_4_B[Business]:::role
    N3_3_4 --> R3_3_4_UX[User Experience Design]:::role
    N3_3_4 --> R3_3_4_FE[Front-End Development]:::role

    N3_3_5((3.3.5)):::sc --> R3_3_5_CA[Content Authoring]:::role
    N3_3_5 --> R3_3_5_UX[User Experience Design]:::role

    N3_3_6((3.3.6)):::sc --> R3_3_6_B[Business]:::role
    N3_3_6 --> R3_3_6_UX[User Experience Design]:::role

    N4_1_1((4.1.1)):::sc --> R4_1_1_FE[Front-End Development]:::role

    N4_1_2((4.1.2)):::sc --> R4_1_2_CA[Content Authoring]:::role
    N4_1_2 --> R4_1_2_UX[User Experience Design]:::role
    N4_1_2 --> R4_1_2_FE[Front-End Development]:::role

    N4_1_3((4.1.3)):::sc --> R4_1_3_UX[User Experience Design]:::role
    N4_1_3 --> R4_1_3_FE[Front-End Development]:::role
```
