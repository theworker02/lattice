# Simulator scenarios and model governance

The runnable simulator lives in `src/`; this folder records scenarios, model boundaries and future fixture-to-Twin work. **Status: SIMULATED.**

## Scenario library

| Scenario | Input change | Expected observable outcome | Physical interpretation limit |
| --- | --- | --- | --- |
| Bright collection | Raise virtual irradiance | SolarSkin collection increases within the optical budget | Not a calibrated solar yield prediction |
| Mirror trade | Raise modeled reflection | Appearance fraction rises while direct collection falls | No physical coating has been selected |
| Power constraint | Raise motor demand above supply | Protection prevents normal motor operation | Not an electrical short test |
| Thermal trip | Raise modeled motor temperature | Safety priority latches the branch off | No enclosure temperature prediction |
| Optical obstruction | Block virtual LatticeLight path | Diagnostic frame fails visibly | Not a physical link budget |
| Signal Cube offline route | Disable local destination | Fresh messages queue then expire or deliver on recovery | Local browser model, not transport validation |

## Model governance

Every exported Twin run records assumptions and model version. Measured data, when available, must be tagged with instrument/calibration context and never silently overwrite simulated values. A display must distinguish `simulated`, `measured`, `estimated` and `unavailable`.

The simulator is a design decision tool: it identifies questions worth testing, validates local software behavior and provides a visual causal chain. It cannot qualify optical materials, thermals, circuits, power protection or manufacturing yield.
