# EDR-001 — CAN FD versus RS-485

Status: **CONCEPT** / proposed, unresolved physical selection.

**Problem:** choose a robust local transport with bounded messages and manageable prototype cost.

**Alternatives:** CAN FD, classical CAN, RS-485 with application arbitration, USB gateway.

**Evidence:** [Bosch CAN FD](https://www.bosch-semiconductors.com/products/ip-modules/can-protocols/can-fd/) supports larger payloads than classical CAN, up to 64 bytes. This does not provide discovery, authorization or electrical protection by itself. No prototype signal-integrity/EMC measurements exist.

**Decision:** retain transport-neutral LSP and favor CAN FD for evaluation; do not freeze bit rates, topology or pins.

**Tradeoffs:** CAN requires transceivers, proper topology/termination and firmware support; RS-485 could be inexpensive but needs bus ownership/error semantics. E1 must compare cost, wiring, cable length and diagnostic behavior before acceptance.
