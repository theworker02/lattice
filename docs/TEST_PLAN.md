# MIRRORFIELD evidence and validation plan

Software status: **SIMULATED**. All proposed physical tests below: **CONCEPT**, not executed. No environmental rating is claimed.

## Software regression

Run `node --test tests/*.test.mjs`; syntax-check browser modules with `node --check`. Tests cover baseline wiring, delay reset, shared power, typed inputs, invalid graphs, optical conservation, ray counts, battery limits, branch negotiation and protection, priority arbitration, immutable bounded snapshots, provenance, UUID imports, optical corruption and Bridge boundaries. Verify stored JSON survives reload and malformed JSON cannot replace valid state. No network dependency is required.

Browser acceptance: run/pause/step/reset; all three array modes; inspect cells; adjust optics including invalid R+A; clear/re-arm faults; select event evidence and scrub; test scope overlays and absent channels; export/import configuration; local-storage rejection; blocked optical diagnostic; narrow layout, keyboard tabs and reduced motion. Browser execution results must be recorded separately from static DOM checks.

## Proposed physical tests

Use at least three labeled samples per candidate condition plus an unexposed control for exploratory screening. Record sample serial/revision, instrument/calibration, setup, raw data, uncertainty, operator/date and photos. Screening results are not certification. The following severities and limits are provisional engineering targets for review, not product ratings.

| Test | Proposed screening condition | Record / proposed acceptance |
| --- | --- | --- |
| Temperature | Unpowered −10 to 50°C, 10 cycles; powered test only after thermal/electrical review | Fit, delamination, sensor drift; no irreversible functional loss |
| Humidity | 40°C / 85% RH for 48 h, no deliberate condensation | Insulation, corrosion, optical haze; compare control |
| Sunlight / irradiance | 0/250/500/1000 W/m² calibrated source, logged spectrum and angle | R/T/PV and temperatures; energy balance within instrument uncertainty |
| UV | Defined source spectrum/dose approved for chosen polymer/coating; dark control | Dose, haze, color and R/T change; limit set before exposure |
| Vibration | Fixture-defined 5–100 Hz exploratory sweep, low initial amplitude | Loose parts, intermittent contacts; detailed profile set after mount design |
| Dust | Controlled nonconductive dust with documented size/loading | Optical contamination, contact obstruction; no IP claim |
| Connector cycling | 500 unpowered mate/unmate cycles initially | Force, wear, contact resistance vs selected connector specification |
| Drop | M0 dummy, 0.5 m onto defined surface, faces/edges | Fragment retention and fit; powered/battery drop deferred |
| Surface scratch | Defined stylus/load and repeated cleaning coupon comparison | Haze, coating breakthrough; no hardness rating inferred |
| Corrosion | Material-specific coupon exposure agreed with supplier | Mass/appearance/contact resistance; no generic salt-spray rating |
| Thermal coupling | Power staircase with calibrated hotspot sensors | Accessible and internal temperatures below reviewed limits |
| Optical privacy | Full-stack spectral scan + angular tests | Correct passband and blocking; no assumed NIR transmission |
| Glare | Observe mapped reflection directions at multiple viewing angles | Avoid hazardous/uncomfortable viewing directions; professional review |

## E1 fault tests

Use independently current-limited equipment and reviewed fixtures. Check unknown device insertion, identity timeout, incompatible voltage/current, reversed wiring through protected test fixture, overcurrent, short, thermal trip, watchdog, signal staleness and brownout. Record voltage/current waveforms, trip energy and recovery. A software FAULT message alone does not pass a protection test.

## Evidence promotion

ENGINEERED needs reviewed drawings/calculations. PROTOTYPED needs an identified physical assembly. VALIDATED needs signed test evidence against agreed limits on that revision. PRODUCTION CANDIDATE additionally needs DFM, manufacturing test coverage and supply/revision control. Tests in this repository do not promote physical hardware beyond CONCEPT.
