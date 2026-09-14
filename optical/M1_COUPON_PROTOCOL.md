# M1 SolarSkin coupon protocol

**Status: CONCEPT measurement procedure.** This protocol converts optical claims into comparable samples before any enclosure tooling decision.

Build at least three coupons per stack plus an unexposed control. A coupon record must name the exact substrate, coating faces, thickness, adhesive, PV/detector part, baffle geometry, thermal backing, lot, operator and date.

| Test | Setup | Required recorded outputs |
| --- | --- | --- |
| Spectral R/T | Calibrated instrument across visible and every sensor/emitter band, multiple incidence angles | wavelength, R, T, A, uncertainty, sample ID and method |
| Light sensing | Controlled source and reference meter through finished stack | raw counts, reference, angle, dark baseline, saturation and calibration revision |
| PV | Controlled irradiance, load sweep and temperature probe | irradiance spectrum, I-V curve, max power, stack/core temperature |
| Status cross-talk | Indicator on/off with detector source controlled | baseline shift, detection threshold and baffle configuration |
| Heat | Power/irradiance staircase and calibrated probes | transient and steady temperatures, ambient and thermal interface ID |
| Durability screen | Defined cleaning, UV and thermal cycle exposures | before/after R/T, haze, adhesion/edge observation and photos |

The acceptance limits must be set by the engineering team before seeing results. Upload raw data beside the processed plot and never substitute a supplier curve for a finished-stack measurement. See [spectral response](spectral-response.md), [SolarSkin model](solarskin.md) and the [M1 DVP](../manufacturing/test-jigs/M1-DVP.md).
