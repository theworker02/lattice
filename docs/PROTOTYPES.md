# Prototype generations and demonstrator

All physical generations are **CONCEPT** until built. The running 4 × 4 demonstrator is **SIMULATED**.

| Generation | Question | Required deliverables before promotion |
| --- | --- | --- |
| M0 visual | Does the envelope and appearance work? | Printed/machined dummy cells, arrangement, ergonomic notes, dimensional inspection, photographed samples |
| M1 optical | Can the stack conceal sensors and collect useful energy? | Measured R/T curves, illumination contrast, PV I-V measurements, temperatures, matched routing baseline |
| E1 electronic | Can known devices discover and negotiate safely? | Reviewed schematics, bounded bench supply, firmware/transport fixtures, fault and independent shutdown evidence |
| ME1 integrated | Do mechanics, optics and electronics coexist? | Integrated assemblies, thermal/EMC screening, coupling errors, service and safety review |
| P1 manufacturer | Is the product repeatably buildable? | External DFM, tolerance stack, pilot yield, tooling quotes, approved production-intent test plan |

## M1 pilot configuration

The Signal Cube M1 pilot is proposed as 12 units: a stable central core and carrier architecture, three controlled optical-stack variants across four units each, three S-L light cassettes, one S-P PV cassette and two S-T thermal cassettes per unit. It uses external constrained low-voltage power and one reviewed wired host path. Its companion [program](../manufacturing/M1-PILOT-PROGRAM.md), [RFQ](../manufacturing/suppliers/RFQ-SC-M1.md), [traveler](../manufacturing/assembly/SC-M1-TRAVELER.md) and [DVP](../manufacturing/test-jigs/M1-DVP.md) define the evidence needed before a later ME1 decision.

The 16 virtual positions are four SolarSkin cells, three mirrored heliotropic cells, two temperature cells, one vector sensor, fusion, energy controller, battery, logic, Bridge and motor. A suitable physical demonstrator should begin under a controlled diffuse lamp on a tabletop; a wall mounting and specular redirection require separate mechanical and glare review.

Simulator acceptance: changing irradiance changes collection; tracking changes modeled incidence; power crosses a threshold and delay; negotiated motor output activates; battery charge is bounded; motor faults isolate the load; thermal values and causal history are inspectable. The software does not fabricate an 812 lux or 4.72 W reading: values follow the current inputs and model assumptions.

Physical acceptance is later: record calibrated light field, current/voltage at collection and load, actual actuator position, temperatures and synchronized sequence IDs. Demonstrate that motor activation is explained by captured measurements. Measure tracking overhead and optical improvement separately, so movement is not mistaken for positive net energy gain.
