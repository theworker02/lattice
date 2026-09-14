# Heliotropic cell mechanism brief

**Status: CONCEPT.** The simulator can orient virtual surfaces; no motion mechanism, gear train, encoder, collision envelope or physical glare-control behavior exists.

The first mechanism experiment should be a single non-powered motion mockup, not a 4 × 4 moving field. It needs a fixed datum, two bounded axes, a positive hard stop, a pinch-safe perimeter, routed flex with controlled bend radius, a parking orientation and a way to measure actual angle. Mirror scales remain fixed to the carrier during motion; they are not hinges.

## Required engineering inputs

| Decision | Evidence needed before prototype |
| --- | --- |
| Axes and range | Neighbor/fixture clearance envelope and glare study |
| Actuator | torque/speed/backdrive budget at worst orientation and temperature |
| Position sensing | repeatability, zeroing method and safe behavior after lost position |
| Cable routing | bend-cycle test, strain relief and service path |
| Stop and fault | mechanical stop, current/temperature trip and safe parked state |
| Surface loads | mirror/cassette mass, center of gravity and retention test |

Do not use the virtual sun vector as a physical tracking algorithm until directional sensors are calibrated through the finished optical stack. The first powered mechanism requires a separate low-voltage protection and guarded-motion review.
