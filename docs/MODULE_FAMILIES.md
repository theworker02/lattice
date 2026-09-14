# Module ecosystem and passports

Status: **CONCEPT** ecosystem; listed simulator modules **SIMULATED**.

| Family | Intended members | Implemented virtual members |
| --- | --- | --- |
| SENSE | Light, temperature, humidity, pressure, motion, distance, optical vector | Light (patchboard), temperature, vector |
| LOGIC | Boolean, threshold, timer, counter, sequence | AND/NOT, normalized threshold, power compare, on-delay |
| ENERGY | Solar, battery, USB-C PD, meter, distribution | Solar, SolarSkin collection controller, energy buffer |
| MOTION | Servo, linear, motor, heliotropic | Motor state/angle; virtual heliotropic orientation |
| CONTROL | Relay, PWM, PID | Relay |
| COMPUTE | MCU, Linux, gateway, fusion | Deterministic fusion |
| OPTICAL | Mirror, SolarSkin, LatticeLight, display | Optical budget, orientation, optical codec diagnostics |
| BRIDGE | GPIO, CAN, USB, Ethernet, wireless | Diagnostic loopback only |

Each MIRRORFIELD module receives a random UUID v4 on project creation. UUID identity survives project export/import; short MF slot IDs identify positions, not globally unique hardware. Human-readable serials are descriptive prototype labels; production serial allocation requires an issuer registry. The simulator assigns no hardware certification by generating an ID.

[Passport schema](../schemas/module-passport.schema.json) defines version, UUID, serial, family/type, hardware revision, firmware, maturity, ports, transport and bounded power envelope. `validatePassport()` enforces the supported runtime subset. Project import additionally requires `SIMULATED` and `virtual`, fixed 16-slot types and distinct UUIDs; it cannot assert physical discovery.

The Observatory builds array labels, inspector identity and applicable fault controls from these passports. Future physical descriptors need per-port units/ranges, voltage ranges, firmware authenticity, calibration provenance, supported sample rates and health freshness. Current string port arrays are not sufficient for arbitrary hardware deployment.
