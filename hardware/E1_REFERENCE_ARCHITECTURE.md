# E1 Signal Cube reference architecture

**Status: CONCEPT architecture; simulated transport contracts available.** This is the first complete engineering handoff boundary for a safe, externally powered Signal Cube. It is not a released schematic, PCB, procurement list or authorization to assemble hardware.

## Electrical partition

```text
External SELV bench supply
  → fuse / reverse-polarity barrier / surge boundary
  → constrained identification rail ──────────→ core MCU + CAN-FD service path
  → independently controlled load rail ───────→ cassette rails / indicators
                                               → never enabled by a bus message alone

Light / PV / temperature cassettes
  → keyed flex connectors → analog/digital acquisition → MCU → CAN-FD host
                                                ↘ chassis and board temperature channels
```

## Board set

| Board | Owns | Minimum M1/E1 evidence |
| --- | --- | --- |
| Core controller | MCU, watchdog, memory, debug lockout, cassette identity and health | schematic review, boot/fault state test, programming fixture |
| Input/protection | regulated SELV entry, reverse barrier, eFuse/load switch, rail and branch sensing | trip waveforms, inrush, polarity and short test |
| Surface interface | labeled flex sockets, light/temperature acquisition and PV separation | continuity, leakage and channel-map fixture |
| Band I/O | optional indicator and optical receiver separated by baffles | dark baseline and optical cross-talk result |

PV conditioning stays physically and electrically separate from precision light sensing. Battery, mains, direct solar-bus power, radio and actuator drive are excluded from E1.

## Required schematic release rules

- A hardware engineer selects every IC, protective component, connector, fuse and rating from the final operating envelope.
- Every connector pin has a net name, direction, voltage class, default state, test point and mate sequence.
- Default after reset, watchdog, brownout, firmware corruption or bus loss is load rail OFF.
- Provide current/voltage sense before rated external contacts and retain a measurement path during a trip.
- Define ground/chassis/ESD strategy before PCB layout; do not solve EMC with a late copper change.
- Make programming and factory test access physically controlled and incapable of silently overriding protection.

## Layout and thermal constraints

Maintain separate noisy power, CAN-FD and sensitive optical/temperature acquisition regions. Keep PV thermal paths away from temperature references unless the channel intentionally measures that stack. Specify flex bend radius, strain relief, connector retention and service sequence in the mechanical drawing. The mirror scales and alignment magnets are never electrical conductors for a rated path.

## Gate to prototype

Release requires peer-reviewed schematics, board stack-up, placement/routing rules, a component lifecycle check, defined test points, mechanical STEP interfaces, bring-up plan and protection calculations. Prototype requires serialized boards and controlled bench power. Validated requires repeatable measured evidence for that revision.

See [PCB release checklist](pcb/README.md), [firmware reference](../firmware/FIRMWARE_REFERENCE_IMPLEMENTATION.md), [CAN-FD profile](../protocols/LATTICELINK_CANFD_A0.md) and [M1 DVP](../manufacturing/test-jigs/M1-DVP.md).
