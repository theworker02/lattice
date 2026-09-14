# LatticeLink A0 / MIRRORFIELD 0.5

Status: **CONCEPT** physical interface. The power state machine is **SIMULATED** in `src/passport.mjs`.

## Capability and power negotiation

Physical connection → DETECT → low-power IDENTIFY → CAPABILITIES → voltage/current COMPATIBILITY → AUTHORIZE → NORMAL. Unknown, malformed, stale or incompatible identification must leave load power disabled. No maximum bus voltage is exposed just because a connector mates.

Use a separate constrained identification supply or equivalent engineered isolation from the switched load rail. The conceptual five roles POWER+, POWER−, DATA+, DATA−, DETECT do not by themselves implement a safe identity supply; the engineer must resolve extra contacts, multiplexing or isolation. No pin assignment is frozen. A DETECT contact is not a sufficient authorization signal.

The simulator negotiates a 5 V motor supply against its passport nominal voltage (±10% model band) and maximum current, with illustrative 0.2 s stages. Firmware cannot override the model's fault latch. The physical design needs independent interrupt circuitry, actual tolerances, undervoltage hysteresis, inrush limits, connection debounce, authorization expiry, and bounded recovery timing. See [power](POWER_ARCHITECTURE.md) and [safety](SAFETY_ARCHITECTURE.md).

Proposed descriptor exchange: protocol version, UUID, revision, capabilities, power requirements, safe state and health. Duplicate identities, conflicting outputs or unknown port classes must prevent deployment. Wired bus enumeration does not reveal physical adjacency; per-link observation or explicit wiring metadata is required. The current topology is built from simulation links, not fabricated cable discovery.

## Open mechanical and electrical requirements

Status: conceptual interface boundary. **No connector, pin assignment, electrical ratings, or hot-plug behavior is specified by this repository.**

The intended connector roles are power positive, power return, differential data, and identification/detection. CAN FD is a candidate transport to evaluate, not an implemented choice. Commodity connectors should be evaluated before any custom mechanical tooling.

The engineering specification must establish supply domains, connector keying, mating order, current ratings, termination, grounding, isolation needs, cable limits, EMC behavior, polarity protection, inrush control, fusing, reverse-current protection, and independently enforced fault shutdown. Power permission messages must remain separate from the circuitry that physically enables or interrupts power.

Battery chemistry, charge control, solar input regulation, and USB-C negotiation each require dedicated designs. The virtual simulator's `available watts >= peak watts` check is a scheduling model, not evidence that a proposed electrical connection is safe or compatible.

This document intentionally provides no assembly instructions. Future A0 deliverables should include reviewed schematics, a defined low-voltage operating envelope, interface test fixtures, and measured validation results before hardware compatibility is claimed.
