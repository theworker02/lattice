# v0.5 maturity register

Each entry carries one status. Hardware and its software model are separate entries. No LATTICE hardware is labeled ENGINEERED, PROTOTYPED, VALIDATED or PRODUCTION CANDIDATE.

| Major component | Status | Evidence / boundary |
| --- | --- | --- |
| Mirrorfield industrial design and functional enclosure | CONCEPT | LATTICE_DESIGN_LANGUAGE.md and design/ |
| Signal Cube mirror-scale shell, under-scale cassettes and central hardware core | CONCEPT | SC-A0 design brief, assembly drawing and unquoted cube BOM; no released cube CAD or circuits |
| Signal Cube M1 12-unit manufacturer pilot | CONCEPT | Pilot program, DVP, RFQ, traveler and risk register; no partner, order, result or yield data |
| Firmware, hardware, protocol, calibration, quality, compliance and operations frameworks | CONCEPT | Detailed release boundaries; no physical implementation or qualification evidence |
| Optical architecture / spectral and material research | CONCEPT | optical/; linked manufacturer data, no selected stack |
| M0 envelope CAD / dimensions / renders | CONCEPT | manufacturing/cad, drawings, renders |
| LatticeLink electrical interface / independent fusing | CONCEPT | docs/LATTICELINK.md, POWER_ARCHITECTURE.md |
| Branch power-negotiation model | SIMULATED | PowerBranch tests and motor interlock |
| LSP physical transport | CONCEPT | No CAN, wiring or deployment adapter |
| LSP values / provenance / priority model | SIMULATED | engine, Twin trace, arbitration tests |
| Passports and virtual topology | SIMULATED | JSON Schema, runtime validator, UUIDs and derived links |
| Physical discovery and synchronized hardware Twin | CONCEPT | Explicit future transport boundary |
| Local digital Twin / history / causal replay | SIMULATED | 600-frame recorder and event-to-frame evidence |
| Patchboard and Mirrorfield Observatory | SIMULATED | Browser application, retained editable legacy graph |
| SolarSkin optical budget / ray experiment | SIMULATED | Conservation and routing tests; hypothetical parameters |
| Semi-reflective PV / routing hardware | CONCEPT | Coupon plan and RFE |
| Heliotropic orientation model | SIMULATED | Incidence and rate-limited tilt/rotation |
| Heliotropic mechanism / neighbor collision / glare control | CONCEPT | No motion CAD or physical actuation |
| Light-vector and deterministic fusion | SIMULATED | Virtual intensity/direction; CCT/UV/IR unavailable |
| Spectral/UV sensor hardware | CONCEPT | Candidate research, calibration needed |
| LatticeLight codec and diagnostic loopback | SIMULATED | CRC/Manchester framing and blocked-path tests |
| Physical optical communication | CONCEPT | No emitter/receiver driver or analog link budget |
| Edge-light and energy display / budget | SIMULATED | Off/event/continuous assumptions and numeric flows |
| Edge guides / touch / hidden display / e-paper | CONCEPT | Design and ergonomic research |
| Thermal map and scope overlays | SIMULATED | Lumped cells, histories, absent-channel states |
| Thermal enclosure / graphite / heat pipes | CONCEPT | Candidate materials, no calibrated model |
| Battery energy buffer | SIMULATED | Bounds, charge/discharge efficiency assumptions |
| Battery pack / charge controller / USB-C PD | CONCEPT | No chemistry or hardware selected |
| Actuator safe states / fault injection / sandbox | SIMULATED | Priority and isolation tests; no physical deploy |
| Bridge physical interfaces and internet providers | CONCEPT | Diagnostic-only loopback; no fake API integrations |
| Environmental tests / durability / anti-glare | CONCEPT | TEST_PLAN.md and material matrix |
| Manufacturing BOM / DFM / supplier costing | CONCEPT | Frameworks with unquoted costs |
| Engineering request / decisions / roadmap | CONCEPT | RFE-0001, decisions/, ROADMAP.md |

Release definition: executable simulator and reviewable design foundation, not physical realization of all proposed modules. See test results in [verification](VERIFICATION.md). Open engineering questions remain visible in the RFE and decisions; none are silently counted as validated features.
