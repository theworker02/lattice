# Physical realization plan

This plan closes every stated LATTICE capability gap with an accountable evidence path. It does **not** replace physical work with documentation or label unbuilt hardware as validated.

| Gap | Delivered now | Required partner-led evidence to close it |
| --- | --- | --- |
| Physical discovery | Simulated CAN-FD A0 bus, UUID collision and TTL tests | CAN controller/transceiver, fixture traffic captures, cable/termination/EMC results |
| Deployment | GitHub Pages static portal and browser-local Twin | authenticated provisioning/service process and controlled physical rollout, if hardware deployment is needed |
| CAN driver/network | framed A0 reference and firmware state plan | target MCU HAL, real bus-off/recovery tests, node/cable budget and selected connector |
| PCB | E1 electrical partition, release checklist and board test requirements | reviewed schematic/layout, BOM, fab/assembly files, serialized bring-up boards |
| Motion mechanism | single-cell mechanism brief and simulator orientation model | CAD, force/torque budget, guards/stops, encoder and fatigue/glare tests |
| Optical material/SolarSkin | coupon protocol and supplier-data boundaries | selected exact stack, finished-stack R/T/A/EQE/I-V/thermal measurements and durability results |
| CCT/UV/IR | spectral-sensor candidate boundary and calibration record | chosen sensors, cover/window calibration and traceable test data |
| Thermal/energy model | bounded simulated model and explicit assumptions | instrumented cube, calibrated thermal/energy model and real operating envelope |
| Manufacturing cost | M1 cost model and RFQ fields | supplier quotes, tooling/MOQ/yield assumptions and landed-cost review |

## Gate sequence

1. **M0 visual/mechanical:** dimensioned cube CAD, non-powered shell and assembly/access review.
2. **M1 optical:** coupon stack selection and measured optical/PV/thermal evidence.
3. **E1 electronics:** protected externally powered core, one sensor, one CAN-FD host path and captured fault tests.
4. **ME1 integrated:** serialized shell/core/cassettes, calibrated measurement records, bounded Twin ingestion and service test.
5. **P1 candidate:** DFM, suppliers, yields, costs, environmental/EMC scope and release-control review.

Hardware can move from CONCEPT to ENGINEERED only when its drawings/calculations are reviewed; to PROTOTYPED only when the identified revision physically exists; and to VALIDATED only with passed evidence against pre-agreed limits. See [status](STATUS.md), [M1 pilot](../manufacturing/M1-PILOT-PROGRAM.md) and [manufacturer partnership](../MANUFACTURER_PARTNERSHIP.md).
