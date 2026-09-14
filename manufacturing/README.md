# MIRRORFIELD manufacturing package — CONCEPT

## Primary product: exact mirror-scale cube appearance

The user-selected [mirror-scale cube image](../design/concepts/mirror-scale-cube.png) is the exterior reference for the **Signal Cube**. Start with the [Signal Cube manufacturing design brief](SIGNAL_CUBE_MANUFACTURING_PLAN.md), [surface-to-core drawing](drawings/signal-cube-core.svg) and [cube BOM framework](bom/signal-cube.csv). Selected mirror scales contain sensors or PV underneath; the central internal core contains the main controller, power and communication hardware. The visible middle band is the exposed edge of that core.

The existing M0 planar files below are research-fixture geometry and must not be mistaken for cube production CAD. The cube brief is detailed design input, not authorization to fabricate an unreviewed electrical assembly.

## Next phase: M1 Pilot Program

The [M1 Pilot Program](M1-PILOT-PROGRAM.md) turns the cube into a manufacturer-facing 12-unit engineering build: a common internal core, replaceable functional scale cassettes, three controlled optical-stack variants, a defined fixture path and evidence gates. It is designed to let an engineering/manufacturing partner own real improvements in yield, serviceability, optical behavior and cost without prematurely treating the design as a production release.

Use its companion [RFQ response pack](suppliers/RFQ-SC-M1.md), [DVP](test-jigs/M1-DVP.md), [pilot traveler](assembly/SC-M1-TRAVELER.md) and [DFM risk register](dfm/SC-A0-RISK-REGISTER.md) together. All are CONCEPT templates until a physical program opens.

This package is an engineering-review starting point, not build authorization. The current outputs are M0 envelope CAD and drawings, a BOM framework, process/test requirements and cost/DFM worksheets. There are no production Gerbers, PCBA drawings, qualified suppliers, injection molds or certification reports.

## Partner-led execution

LATTICE provides this package as a design-intent and collaboration starting point. A manufacturing partner must do the majority of product-realization work: detailed design, materials and coating development, electrical design, sourcing, DFM, fixtures, tooling, fabrication, tests, quality controls and applicable certification. See the repository-wide [manufacturing partnership note](../MANUFACTURER_PARTNERSHIP.md) for the explicit division of responsibility.

| Folder | Contents / purpose |
| --- | --- |
| bom | Quantity framework, sourcing and maturity columns |
| pcb / pcba | Electrical partitioning and assembly release requirements |
| cad / drawings / renders | Generated envelope source, meshes and views |
| tolerances | Datum and tolerance-stack questions |
| materials / finishes | Selection and coupon traceability |
| assembly | Reversible prototype sequence |
| test-jigs | M0/M1/E1 fixtures and evidence |
| packaging | Protection and handling assumptions |
| suppliers / costing | Request fields and quote framework |
| dfm | Review checklist and release gates |

Regenerate geometry: `python tools/generate-cad.py`. Both STL objects are closed meshes, separate cover and chassis; they intentionally touch at the assembly plane. OpenSCAD shows an exploded cover. No external CAD renderer is required to produce the included geometry-derived SVGs. These are orthographic technical renders, not photographs or verified production fits.
