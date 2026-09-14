# LatticeLink CAN-FD A0 reference profile

**Transport model: SIMULATED. Physical CAN-FD hardware: CONCEPT.** This profile gives M1/E1 engineers a bounded, testable starting point without claiming a selected transceiver, connector, bit rate, cable, EMC result or deployed bus.

## Purpose

CAN-FD is a candidate wired transport for noisy, distributed low-voltage LATTICE systems. It carries identity, health, typed samples and receipts. It never directly authorizes a power rail: separate hardware protection and a low-power identification path remain mandatory.

## A0 frame registry

| Standard ID | Name | Required fields | Safety boundary |
| --- | --- | --- | --- |
| `0x120` | HELLO | protocol version, UUID, serial | announcement only; no power permission |
| `0x121` | PASSPORT | UUID, hardware revision | summary only; full descriptor is retrieved through a reviewed service path |
| `0x220` | SAMPLE | discovered address, declared-port index, value, sequence, source time | units/quality are bound to the approved port map in this compact A0 test vector; measurements cannot energize an output |
| `0x320` | HEALTH | UUID, temperature, input voltage, current, fault count, uptime | missing health becomes stale, never healthy by default |
| `0x420` | RECEIPT | correlation ID, bounded outcome | diagnostics only until command authority is designed and reviewed |

The executable reference [`src/latticelink.mjs`](../src/latticelink.mjs) encodes a maximum 64-byte UTF-8 JSON payload to make test vectors readable. HELLO carries the UUID once; later frames use the discovered one-byte address and compact keys (`t`, `a`, `p`, `v`, `n`, `x`) so the model respects the frame limit. This is **not** a final on-wire binary encoding. E1 must replace it with a reviewed packing specification, endianness policy, sequence rollover behavior and error handling.

## Discovery and stale-data behavior

1. A newly attached module remains unpowered beyond the constrained identification path.
2. It sends HELLO and a passport summary.
3. The host validates UUID uniqueness, revision compatibility and declared ports.
4. Sample and health traffic refresh a node's presence.
5. After the configured TTL, the node becomes **STALE**; its last values may be displayed as historical but cannot be used as fresh control input.
6. Any real branch authorization is independently checked by protection hardware and its local controller.

The virtual bus defaults to a 1.5-second TTL for model behavior. Physical cadence, timing, arbitration, bus-load limit, termination, common-mode range and recovery policy are open E1 design decisions.

## E1 bring-up requirements

- Select an isolated or non-isolated CAN-FD transceiver only after grounding, cable and fault-domain review.
- Freeze a commodity keyed connector, conductor gauge, termination arrangement and node-count/cable-length envelope.
- Add controller error counters, bus-off handling, timestamp source and fault injection to the firmware test fixture.
- Capture traffic, rail state and branch current during unknown insertion, duplicated identity, unplug, stale heartbeat and brownout tests.
- Require a local safe state when bus traffic is lost. A CAN message cannot be the only fault path.

See [LatticeLink](../docs/LATTICELINK.md), [power architecture](../docs/POWER_ARCHITECTURE.md), [E1 reference architecture](../hardware/E1_REFERENCE_ARCHITECTURE.md) and [realization plan](../docs/REALIZATION_PLAN.md).
