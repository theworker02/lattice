# MIRRORFIELD M1 Pilot Program — the Manufacturer Edition

Revision MP-01 · **CONCEPT — proposed joint engineering program**

## The product worth building

The Signal Cube is a 120 mm-class physical signal hub whose mirror-scale exterior is a functional shell. Selected scale positions contain light, photovoltaic or temperature cassettes. A common central chassis contains the controller, protected low-voltage power path, wired host interface, diagnostics and all surface connections. The [approved exterior image](../design/concepts/mirror-scale-cube.png) remains the visual authority; the [SC-A0 brief](SIGNAL_CUBE_MANUFACTURING_PLAN.md) defines the present architecture.

M1 is deliberately not a marketing prototype. It is a small, repeatable engineering pilot that answers the questions a manufacturing partner needs answered: Can the reflective skin be produced, can selected functional scales be installed without losing appearance, can the core be tested before final closure, and can an assembled unit be serviced and measured?

## Pilot definition

| Item | Proposed M1 decision | Why a manufacturer benefits |
| --- | --- | --- |
| Build quantity | 12 instrumented Signal Cubes plus coupon and fixture spares | Enough repeatability to expose yield, assembly-time and cosmetic variation without pretending to be a production run |
| Architecture | One common core, removable face carriers and keyed surface cassettes | Mechanical, electrical and optical work can improve independently instead of scrapping whole units |
| Functional positions | 3 light cassettes, 1 PV cassette and 2 surface-temperature cassettes per cube | The pilot tests actual optical and electrical boundaries while preserving a predominantly mirrored object |
| Appearance variants | Three controlled optical-stack variants, four units each | A/B/C evidence replaces arguments about reflectivity, transmission, fingerprinting and cosmetic acceptability |
| Power boundary | External constrained low-voltage supply only | Lets the partner focus on enclosure, optics and protected electronics before battery, charging or regulatory scope expands |
| Communication boundary | One reviewed wired host path and a documented local packet test | Creates a testable end-to-end behavior instead of a list of unimplemented connectors |
| Release intent | Engineering evidence and a DFM decision, not customer shipment | Prevents a pilot from becoming an unsupported field product |

## What is common, and what is intentionally swappable

```text
               MIRROR-SCALE FACE CARRIER
       ┌──────────────────────────────────────┐
       │ S-R  S-L  S-R  S-P  S-R  S-T          │  selected cassettes
       └───────────────┬──────────────────────┘
                       │ labeled flex tails
       ┌───────────────▼──────────────────────┐
       │ COMMON CENTRAL CORE                   │
       │ controller · protected power · host   │
       │ diagnostics · band PCB · test access  │
       └───────────────┬──────────────────────┘
                       │
       ┌───────────────▼──────────────────────┐
       │ FIXTURE + LOCAL TEST APPLICATION      │
       │ identity · power · optical · packets  │
       └──────────────────────────────────────┘
```

The common core is held stable across all 12 units. Only the selected optical finish/cassette combination changes by variant. That makes material results comparable and permits a manufacturer to improve a carrier, flex route or test fixture without requalifying unrelated electronics.

## Controlled optical variants

Each candidate must preserve the same scale outline, gaps, middle band and expected reflection character. A variant is a finished stack, not merely a coating sample.

| Variant | Proposed construction question | Required evidence before comparison |
| --- | --- | --- |
| A / concealed aperture | Opaque mirror scale with a precisely placed dark optical inset | Aperture alignment, ambient-light angular response, observer-distance visibility and baffle leakage |
| B / semi-reflective stack | Partial reflector on clear substrate above S-L/S-P cassette | Finished-stack spectral R/T/A, glare, PV I-V curve, temperature and visual uniformity |
| C / split-function carrier | Reflective scale plus separate neighboring optical tile under the same scale rhythm | Assembly time, serviceability, cosmetic seam consistency and optical cross-talk |

No variant can be called “solar mirror,” “transparent mirror,” or efficient without its own measured data. The selected M1 stack becomes an engineering decision record only after the comparison is reviewed.

## The manufacturer work package

A partner is asked to co-own the conversion from concept to a buildable pilot, not merely quote an unreviewed rendering.

1. **Exterior and carrier engineering:** six-face parametric CAD, corner transitions, scale retention, edge treatment, datum scheme, service access and cosmetic inspection limits.
2. **Core and harness packaging:** board outlines, bosses, flex routing, strain relief, heat paths, connector insertion loads and fixture datum access.
3. **Optical cassette development:** material coupons, coatings/windows, baffles, PV thermal backing and a measurement method tied to finished stacks.
4. **DFM and assembly design:** documented sequence, rework path, torque/adhesive controls where applicable, visual work instructions and pilot yield tracking.
5. **Test engineering:** fixture interface, safe power-up, identity read, sensor checks, optical stimulus, packet loopback and serialized unit record.
6. **Pilot review:** per-unit as-built record, nonconformance log, costed bill of process and a recommendation for ME1 or a design correction loop.

## M1 acceptance gates

| Gate | Evidence required | Decision unlocked |
| --- | --- | --- |
| G0 — architecture freeze | Reviewed six-face CAD, connector/power boundary, cassette map and risk register | Order representative materials and fixture concept work |
| G1 — coupon selection | R/T/A, scratch/cleaning observations, thermal screening, edge safety and optical-window/baffle results | Select one optical stack for pilot assembly |
| G2 — core readiness | Reviewed schematics/PCB outputs, protected bench power, firmware identity read and test access | Populate and test common cores before enclosure closure |
| G3 — first article | Measured dimensions, cassette fit, core closure/re-open result and complete functional fixture record | Correct tooling/assembly issues before remaining units |
| G4 — 12-unit evidence | Yield, rework time, visual inspection, sensor/PV/thermal/packet records and nonconformance disposition | Decide whether ME1 is justified |
| G5 — ME1 proposal | Updated DFM, costed process, unresolved risks and test plan | Authorize the next revision only through a recorded decision |

Any failed gate produces a correction loop. It does not silently become a passing result because the cube looks attractive.

## What makes this commercially interesting

The pilot combines high-value problems in one coherent object: optical finish development, low-profile sensing, photovoltaic integration, serviceable consumer-grade assembly, protective power design, test automation and a physical/digital observability story. Yet its first electrical boundary stays intentionally modest: external low-voltage power and one wired route. That gives a manufacturer a credible path to demonstrate industrial-design capability and build-process ownership before expensive certification, batteries, wireless radios or production tools enter scope.

The output is more than twelve display objects. It is a reusable cassette/core platform, a visual inspection standard, an electrical test interface, material evidence and an as-built data trail that can inform later LATTICE modules.

## Explicit exclusions

M1 does not authorize customer sale, outdoor exposure claims, IP ratings, battery shipment, mains operation, wireless certification, high-current interconnects, production tooling, quantity pricing or product safety certification. Those scope items remain separate engineering programs.

## Partner entry point

Use the [SC-M1 RFQ response pack](suppliers/RFQ-SC-M1.md), [pilot DVP](test-jigs/M1-DVP.md), [assembly traveler](assembly/SC-M1-TRAVELER.md) and [DFM risk register](dfm/SC-A0-RISK-REGISTER.md). A strong response includes a recommended process, an assumptions list, a schedule range, identified design changes, an estimate for NRE/pilot build/test fixtures, and evidence the partner can produce—not a promise based on the simulator.

The manufacturing partner is expected to perform the majority of detailed engineering and pilot realization. LATTICE is supplying design intent, system plans and review criteria for a potential partnership. See [Manufacturing partnership note](../MANUFACTURER_PARTNERSHIP.md).
