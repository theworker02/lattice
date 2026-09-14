# Deterministic safety and fault model

Status: **SIMULATED** software arbitration; physical protective system **CONCEPT**.

Actuator normal state is graph-controlled. Safe state is OFF. Fault state is OFF with a latched motor branch for short circuit or thermal trip. Missing required vector, controller, logic, or bridge communication preempts motor operation. Recovery of a negotiated link must complete negotiation again. Configuration, source changes and trace inspection remain local when internet access is unavailable.

Priorities are INFO < NORMAL < IMPORTANT < CRITICAL < EMERGENCY. Higher priority wins; OFF wins ties. Safety arbitration runs after ordinary rule evaluation and before motor energy accounting. It is not merely a visual warning. No user-facing hardware deployment control exists.

| Injection | Implemented effect | Recovery |
| --- | --- | --- |
| Disconnect / communication | Selected module unavailable; required control paths disable motor | Clear; affected branch renegotiates |
| Vector stuck high / low | Corrupt virtual intensity estimate; changes tracking target | Clear sensor fault |
| Motor short | Branch FAULT, motor OFF, solar continues | Clear then manual re-arm |
| Battery depleted | Zero stored energy, battery excluded | Clear; resume charging |
| Overheating | Force selected cell to ≥75°C; motor trips, controller/logic interlock | Clear cause; modeled cooling; motor re-arm below threshold |
| Solar collapse | Selected collection cell produces zero electrical output | Clear |

The thermal fault threshold of 60°C is an illustrative control threshold, not an acceptable touch-temperature rating. Generic overheating/communication flags on passive cells are diagnostics and do not model every possible propagation path. Fault injection does not model short-circuit currents, arcs, fusing I²t, bus transients, battery damage or controller process death. It validates software response to declared faults, not hardware survivability.

Before E1: independent protection must work even when firmware hangs; audit unknown-device energization, sensor plausibility, stale telemetry TTL, competing power sources, safe boot/reset, watchdog, contact bounce, reverse feed and battery isolation. No component in this repository is a safety-certified control device.
