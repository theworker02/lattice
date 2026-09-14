# Observatory product surface

The Observatory is the local interface for the LATTICE Twin, editable patchboard and Signal Cube routing lab. **Status: SIMULATED / local-only.**

## User promise

For every visible state, the interface should make four things clear: what was measured or modeled, which module transformed it, where it was sent, and what protection/fault state affected the result. It should never decorate an unknown condition as a healthy one.

## Core screens

| Surface | Primary question | Current implementation |
| --- | --- | --- |
| Patchboard | What graph is connected? | Editable graph with signal/power validation |
| Mirrorfield Twin | How do light, energy, heat and logic interact? | Local 4×4 virtual array, history and causal replay |
| Signal Cube | Where does this reading go? | Local typed route, threshold, bounded queue and receipts |
| Scope | What changed over time? | Retained simulated histories and overlays |
| Fault center | What failed and what is still inhibited? | Incident records, recovery guidance and explicit re-arm |

## Physical-pilot mode requirements

Before an Observatory view may label a reading as physical, it needs a unit serial, channel/cassette ID, sample freshness, unit, calibration revision and communication status. Any unavailable field remains visibly unavailable. Pilot records should link into the quality/unit record, not be merged with simulated history.
