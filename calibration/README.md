# Calibration and measurement records

**Status: CONCEPT.** Optical surfaces and hidden sensors cannot be trusted from appearance alone. This folder defines the records that make a reading traceable.

## Every measurement record needs

- unit serial, core revision, cassette location ID and optical-stack/material lot;
- instrument name, serial, calibration due date and setup geometry;
- raw readings, reference readings, environmental conditions and uncertainty method;
- calibration transform/version, operator/date and approval status;
- known exclusions: saturation, angular limits, self-heating, source spectrum or sensor aging.

## M1 channel plans

| Channel | Reference | Required output | Critical limitation |
| --- | --- | --- | --- |
| S-L light | Traceable light meter and controlled-angle source | raw counts + calibrated unit/range + angle curve | A mirrored stack changes response with spectrum and angle |
| S-P PV | Controlled source, electronic load and temperature probe | I-V curve, max-power point and surface/core temperature | Power output is not a light-calibration substitute |
| S-T temperature | Reference probe and stepped thermal fixture | offset, response time and mounting condition | Scale thermal mass creates lag |
| Band receiver | Known emitter geometry and dark baseline | detection threshold and leakage baseline | Status illumination can contaminate results |

## Data rule

Store raw observations beside derived values. A later firmware transform must carry a calibration revision, and a changed optical stack invalidates the previous light/PV calibration until remeasured. M1’s [DVP](../manufacturing/test-jigs/M1-DVP.md) is the first measurement plan.
