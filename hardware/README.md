# Hardware integration reference

**Status: CONCEPT.** This is the electrical/mechanical boundary between the mirror-scale shell and the central core.

## Signal Cube M1 partition

```text
S-L light cassette ─┐
S-P PV cassette ───┼─ labeled flex ── Core sensor / PV interfaces
S-T temperature ───┘                        │
                                                ├─ protected low-voltage input
                                                ├─ controller + memory + watchdog
                                                ├─ band indicator / receiver board
                                                └─ wired host + service test pads
```

The core is deliberately common. Surface cassettes are mechanically replaceable and electrically identified by location. PV conditioning is separate from low-level sensor acquisition. No mirror scale, magnet or decorative band may carry rated power.

## Interface rules

| Interface | Rule | M1 evidence |
| --- | --- | --- |
| Incoming power | External, constrained low voltage with protection before board rails | Controlled power-up and fault record |
| Light cassette | Short analog/digital route with a baffle-defined optical path | Finished-stack response + continuity |
| PV cassette | Dedicated conditioning input, insulated thermal path | I-V and temperature record |
| Temperature cassette | Insulated conductive contact or local digital sensor | Location mapping + thermal lag data |
| Host/service | Recessed wired connector and test access on the core | Packet loopback + insertion/access review |
| Carrier flex | Keyed, labeled, strain relieved and inspected pre/post closure | Fixture continuity record |

## Electrical safety boundary

M1 excludes mains, unreviewed batteries, high-current loads and direct solar-to-bus powering. The pilot uses a current-limited bench source or approved low-voltage supply. Unknown hardware remains unpowered beyond its constrained identification path. Any future actuator or battery work requires a separate protection review.

## Required release package

Schematic PDFs and source, stack-up, placement constraints, connector part numbers and ratings, power tree, harness drawings, thermal contact plan, test points, programming access, BOM alternates and a revision-controlled board bring-up plan. These must agree with the [M1 traveler](../manufacturing/assembly/SC-M1-TRAVELER.md).
