# EDR-005 — SolarSkin architecture

Status: **CONCEPT** hardware; budget **SIMULATED** separately in register.

**Problem:** quantify the appearance/energy trade rather than assume a mirror can absorb reflected power.

**Alternatives:** exposed PV zone, partial reflector over PV, routed edge collection, patterned coating.

**Evidence:** opticalBudget conserves energy in tests; ray experiment is a restricted 2D baseline. No measured PV stack exists.

**Decision:** keep R/T/A explicit and recapture bounded; default recapture to zero. Report temperature, area and efficiency assumptions with results.

**Tradeoffs:** beauty may justify lower generation, but tracking/lighting and manufacturing costs need a complete budget. Broadband simulation cannot select a wavelength-dependent material. M1 must compare against a no-coating/no-routing control.
