# WCAG 2.2 Success Criteria – Roles & Testing

The full diagram has been split into four files by WCAG principle to stay
within GitHub's maximum Mermaid diagram size.

| Principle | File | SCs |
|-----------|------|-----|
| 1. Perceivable | [wcag-perceivable-diagram.md](wcag-perceivable-diagram.md) | 29 |
| 2. Operable | [wcag-operable-diagram.md](wcag-operable-diagram.md) | 34 |
| 3. Understandable | [wcag-understandable-diagram.md](wcag-understandable-diagram.md) | 21 |
| 4. Robust | [wcag-robust-diagram.md](wcag-robust-diagram.md) | 2 |

---

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

