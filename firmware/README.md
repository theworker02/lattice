# Firmware platform

**Status: CONCEPT.** This folder defines the boundary for firmware that will eventually run inside the Signal Cube central core. It does not claim that a physical MCU firmware image exists.

## Firmware responsibilities

```text
Boot + self-test
  → safe power state
  → passport / hardware revision read
  → surface cassette discovery
  → calibrated sample acquisition
  → local rule evaluation
  → typed LSP publication
  → health, fault and service interface
```

The firmware must start with powered outputs inhibited. It may only enable a branch after identifying the local hardware revision, validating the configured cassette map, confirming input voltage and completing a reviewed self-test. An indicator can report a fault, but it cannot be the sole safety mechanism.

## Proposed component boundaries

| Component | Owns | Must not own |
| --- | --- | --- |
| `boot` | image integrity, watchdog startup, safe defaults | sensor calibration policy |
| `board` | pins, rails, ADC/I²C/SPI drivers, board revision | product logic |
| `cassette` | location ID, sensor driver, calibration reference, freshness | global power authorization |
| `signal` | LSP envelopes, time/freshness, local transformations | direct electrical switching |
| `control` | deterministic local rules and requested states | protection override |
| `safety` | fault latch, output inhibition, independent shutdown request | cosmetic animation |
| `service` | diagnostics, provisioning, bounded firmware update workflow | unauthenticated actuator control |

## M1 firmware minimum

1. Read a unique core identifier and a versioned cassette map.
2. Sample one selected light channel and one temperature channel with raw values, units, freshness and a calibration revision.
3. Emit one typed sample over the reviewed wired host path and receive a local receipt.
4. Publish health: firmware revision, uptime, rail state, reset reason, temperature and fault count.
5. Refuse normal operation on an unmapped cassette, expired calibration marker, failed self-test or invalid supply state.
6. Make every test mode visibly and digitally identifiable; no silent diagnostic override.

## Required artifacts before E1

- target MCU/RTOS decision record and memory/power budget;
- reviewed state machine for boot, fault, service and normal operation;
- source, reproducible build, version/signing policy and test fixture protocol;
- pin/rail map synchronized with released schematic and manufacturing test;
- fault injection tests for watchdog, stale sensor, bus loss and brownout.

See [hardware integration](../hardware/README.md), [protocol release](../protocols/README.md), [calibration](../calibration/README.md) and [quality records](../quality/README.md).
