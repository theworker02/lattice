# RFE-0001 — MIRRORFIELD

Request for Engineering · **CONCEPT** · Open for technical review · 0.5.0

LATTICE is developing a modular physical computing fabric whose enclosure participates in optics, sensing, power and interaction. We seek a feasible low-cost prototype route, not certification of an unbuilt design. This request has not been sent to any supplier or engineer.

## Updated primary scope: mirror-scale Signal Cube

Use the **exact** [approved appearance image](design/concepts/mirror-scale-cube.png), [SC-A0 design brief](manufacturing/SIGNAL_CUBE_MANUFACTURING_PLAN.md), [internal-core drawing](manufacturing/drawings/signal-cube-core.svg) and [cube BOM](manufacturing/bom/signal-cube.csv). Engineer selected light-sensing, photovoltaic and temperature-sensing cassettes underneath the mirror scales. Engineer the central core for the main controller, power protection, interfaces and internal connections, with the narrow middle band as its external optical/indicator perimeter. Resolve full-stack transmission and optical baffles explicitly. Preserve the depicted exterior; record necessary deviations for review.

The 120 mm cube envelope is a provisional packaging study, not a measurement from the image. Deliver a reviewed full cube model and circuits before tooling. The earlier flat-array envelope below remains supporting research only.

## Proposed partner engagement: M1 Pilot Program

The preferred next engagement is the [12-unit M1 Pilot Program](manufacturing/M1-PILOT-PROGRAM.md), not a speculative production order. It keeps the central core common, uses removable carriers and functional mirror-scale cassettes, and compares three controlled optical-stack variants. Please respond using the [RFQ response pack](manufacturing/suppliers/RFQ-SC-M1.md) and identify which aspects you would alter before first article. The [DVP](manufacturing/test-jigs/M1-DVP.md) and [risk register](manufacturing/dfm/SC-A0-RISK-REGISTER.md) define the desired evidence and open risks.

## Preliminary envelope and artifacts

- 80 × 80 × 25.2 mm M0 cell; 86 mm pitch; 4 × 4 / 338 × 338 mm cell footprint.
- Static chassis with 2 mm walls/floor and one 6 mm clipped corner; 1.2 mm optical cover envelope.
- Proposed 5 V initial regulated load domain, negotiated power, separate protected branches; ratings not frozen.
- SolarSkin aperture modeled at 0.0064 m² gross area; actual aperture must subtract framing and functional zones.
- Passive spreader, dark optical windows, optional touch/display region and controllable edge guide.

![M0 array render](manufacturing/renders/m0-array.svg)
![M0 exploded render](manufacturing/renders/m0-exploded.svg)

[Dimensioned drawing](manufacturing/drawings/m0-envelope.svg) · [OpenSCAD](manufacturing/cad/mirrorfield-m0.scad) · [STL chassis](manufacturing/cad/m0-chassis.stl) · [STL cover](manufacturing/cad/m0-cover.stl) · [BOM framework](manufacturing/bom/mirrorfield.csv) · [design authority](LATTICE_DESIGN_LANGUAGE.md)

## Requested responses

| Question | Desired evidence / deliverable |
| --- | --- |
| 1. Mirror coating construction | Substrate/coating alternatives; wavelength/angle-dependent R/T/A; protective finish and edge treatment |
| 2. PV integration | Usable aperture, cell technology, assembly process, expected derating, thermal coupling and repair strategy |
| 3. Optical transmission | Finished-stack spectral curves for candidate visible display and NIR windows; test geometry and uncertainty |
| 4. Enclosure material | Polymer vs metal tradeoffs, touch/RF implications, drop and scratch coupon plan |
| 5. Thermal performance | Hot-spot analysis; measured spreader/contact resistances; cover and accessible-surface limits |
| 6. PCB architecture | MCU/transceiver, separate sensor and power domains, test access, watchdog and branch protection review |
| 7. LatticeLink connector | Commodity prototype candidates with documented ratings; keying, contact sequencing and cable strategy |
| 8. Power negotiation | Low-power ID path, unknown-device behavior, hardware interrupt path and recovery test procedure |
| 9. Magnetic alignment | Force/tolerance analysis, magnet capture, pole keying, independent electrical contacts |
| 10. Manufacturability | Assembly sequence, yield risks, bonding/rework, tolerance stack and inspection |
| 11. Tooling requirements | Separate M0/M1 tooling from ME1/P1 production-intent fixtures; MOQ and lead time |
| 12. Prototype cost | Itemized non-recurring, per-part, labor, test, shipping and contingency quotes for 1/4/16 cells |

Provide an assumptions list, exclusions, supporting data, open risks, estimated schedule, and recommended next experiment. Identify where the current envelope must change. Do not infer that the simulator establishes optical efficiency, current rating, touch behavior, EMC or environmental qualification.

## Acceptance of engineering review

We expect a reviewed feasibility report, annotated geometry, proposed electrical block diagram, coupon/test plan and budget range with source/date. A response does not automatically promote maturity status. The project owner must review evidence and record accepted decisions in `docs/decisions/` before an E1 or ME1 build release.
