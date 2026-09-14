# EDR-002 — Initial voltage domain

Status: **CONCEPT** electrical choice; simulation uses 5 V.

**Problem:** prevent unknown devices from seeing unrestricted load voltage.

**Alternatives:** fixed 5 V domain, 12/24 V backbone with local conversion, negotiated multi-voltage distribution.

**Evidence:** no load list, wire gauge or rated connector is frozen; simulator motor uses 5 V / up to 0.5 A. Higher-voltage operation cannot be inferred from eFuse candidate ratings.

**Decision:** constrain the simulation to a 5 V source and passport compatibility; require an independently limited identity supply and normally disabled load switch in E1 design.

**Tradeoffs:** low-voltage distribution limits power and increases current for larger loads. A later backbone requires new protection, contact and conversion decisions. Review demand and loss budgets before a hardware voltage commitment.
