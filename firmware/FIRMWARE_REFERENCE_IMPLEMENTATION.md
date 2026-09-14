# Firmware reference implementation plan

**Status: CONCEPT for firmware on a physical MCU; SIMULATED for protocol behavior.** A real board target must be selected before source can be built for hardware.

## Deterministic safety state machine

```text
RESET → SELF_TEST → IDENTIFY_CASSETTES → ANNOUNCE → SERVICE_READY
                                      │                  │
                                      └── failure ───→ FAULT_LATCHED
SERVICE_READY → NORMAL_SAMPLING → STALE_BUS → SAFE_OUTPUT_OFF
```

`FAULT_LATCHED` and `SAFE_OUTPUT_OFF` request the independent load-disable path. They never depend on an LED update, a cloud connection or a received "continue" command.

## First board firmware slice

1. Verify boot image, watchdog and board revision; start with load rail inhibited.
2. Read cassette-location IDs and reject any map not provisioned for the board revision.
3. Acquire one light channel and one temperature channel with raw counts, calibration revision, freshness and saturation state.
4. Publish HELLO, passport summary, SAMPLE and HEALTH with the [CAN-FD A0 profile](../protocols/LATTICELINK_CANFD_A0.md).
5. Enter safe output off on a failed self-test, brownout, stale bus, invalid calibration marker or watchdog reset.
6. Produce a serial/service log that contains reset reason, rail state and fault counter without exposing unrestricted actuator control.

## Test requirements

Build the firmware reproducibly, pin a compiler version, and run host-side tests for framing, calibration transforms, sequence rollover, TTL, fault states and malformed descriptors. On hardware, record boot, bus-off, unplug, duplicate UUID, stale sample, ADC saturation, temperature limit and brownout outcomes using a current-limited fixture. Each capture must identify board, firmware and fixture revisions.
