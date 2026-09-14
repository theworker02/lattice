# Lattice Signal Protocol — MIRRORFIELD draft 0.5

Status: **SIMULATED** typed values and causal envelopes; physical wire protocol **CONCEPT**.

MIRRORFIELD adds an L2 power comparator to the shared graph IR and L4 optical-vector, orientation, fusion and protection records in the Twin. L3 remains reserved for a future external event contract; local UI events are not claimed to implement an interoperable L3 bus. Legacy patchboard outputs retain their v0.1 envelope below.

Twin trace envelope: `{id, origin, transform, value, parents, level, unit, priority, time, quality}`. IDs are unique within a run; parents resolve in the retained frame's trace. `time` is simulation seconds and `quality` is `simulated`. Priorities: INFO, NORMAL, IMPORTANT, CRITICAL, EMERGENCY. Arbiter uses higher priority first, OFF for ties. Safety acts on execution, not only display.

Optical vector currently provides virtual intensity (W/m²), azimuth and elevation. CCT, UV and IR are null because there is no calibrated spectral model. Do not convert irradiance to lux using a universal constant. Health exposes simulated temperature, voltage, current, uptime, fault count, firmware, communication and power state. A physical adapter must add sample freshness, quality and calibration metadata before those values are trusted.

The module passport JSON Schema is in `schemas/module-passport.schema.json`. Physical discovery, authenticated command framing, transport fragmentation, replay defense, rate limits, unit negotiation and stale-input TTL remain open. LatticeLight diagnostic framing is documented in [Bridge](BRIDGE.md); it is not a replacement for LatticeLink or a safety command path.

## Legacy patchboard contract

Status: **project-local design proposal, not a published or interoperable hardware standard.**

LSP separates information about power from electrical power itself. A measurement of 25 W does not transfer 25 W and does not authorize a load.

| Class | Meaning | Draft value | Simulator |
| --- | --- | --- | --- |
| L0 | Boolean | `true` / `false` | Logic, relay, motor |
| L1 | Normalized scalar | Finite number in `[0, 1]` | Light |
| L2 | Physical measurement | Finite number and declared unit | Solar watts |
| L3 | Event | Named event and occurrence metadata | Reserved |
| L4 | Structured | Schema-identified bounded object | Reserved |

## Implemented virtual output

```json
{"level":"L2","value":32.8,"timestamp":5.0,"unit":"W"}
```

The timestamp uses simulation seconds. Module and port identity are supplied by the enclosing state dictionary: `state[moduleId].outputs[port]`. This object is not a CAN frame. No byte encoding, arbitration ID, framing, or wire compatibility is implied.

Current compatibility is deliberately narrow: the light sensor's L1 output feeds threshold input; L0 outputs feed delay, AND, NOT, and relay inputs. Solar L2 is inspectable but no L2 consumer is implemented. There is no implicit measurement-to-normalized conversion.

## Discovery proposal

The virtual catalog exposes module identity, type, family, input/output names, and power port presence. Real discovery still needs versioned descriptors with per-port classes, physical units, ranges, sampling rate, electrical operating envelope, firmware identity, capabilities, and health state.

Before a physical LSP transport is specified, resolve addressing and collision handling, topology observation, message ordering, freshness, timeout behavior, error codes, bounded payloads, event deduplication, schema negotiation, transport authentication where needed, and safe behavior on bus loss. Device enumeration on a shared bus alone cannot reveal physical cable adjacency; that requires link-level observation or separate detection mechanisms.
