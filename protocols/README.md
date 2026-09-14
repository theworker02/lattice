# Protocol release area

**Status: CONCEPT for physical transport; SIMULATED for local typed envelopes.** This folder is where a future LatticeLink/LSP release becomes versioned and testable instead of living only in product copy.

## Release layers

| Layer | Current boundary | Physical release must settle |
| --- | --- | --- |
| Identity | Passport schema validates locally | stable serial, hardware revision, port/cassette map and trust/provisioning policy |
| Sample | Typed values use level, unit, quality and provenance | byte encoding, range, calibration revision, timestamps and stale-data TTL |
| Command | Rule engine models desired state | authentication, authorization, idempotency, rate limit and fail-safe acknowledgement |
| Health | Twin exposes virtual telemetry | sampling cadence, error vocabulary, fault latch and diagnostic privileges |
| Transport | Local loopback only | selected wired PHY, framing, addressing, loss/retry behavior and bus-load budget |

## M1 wire exercise

M1 needs one wired host path only. The minimum transaction is: core announces its serial/revision → host reads a passport summary → core publishes a calibrated typed sample → host returns a local receipt → core publishes health/fault state. Record source and time bases explicitly; do not pass a simulated browser timestamp off as a hardware timestamp.

## Non-negotiable protocol rules

- Measurement messages cannot energize a load.
- A status LED cannot acknowledge a command or clear a safety latch.
- Commands require a correlation ID, bounded lifetime and explicit outcome.
- Missing/expired samples must be represented, never silently held as fresh.
- Unknown fields are ignored only where the version policy allows; unknown safety requirements fail closed.
- A bridge translates interfaces; it does not make every module expose every bus.

The current draft lives in [LSP](../docs/LSP.md), [LatticeLink](../docs/LATTICELINK.md), [passport schema](../schemas/module-passport.schema.json) and [safety architecture](../docs/SAFETY_ARCHITECTURE.md).
