# M1 design verification plan

**CONCEPT** · Test method definition before pilot release. Results fields remain intentionally blank until physical evidence exists.

| ID | System | Test | Method / fixture | Unit sample | Pass evidence | Result |
| --- | --- | --- | --- | --- | --- | --- |
| OPT-01 | S-L cassette | Ambient-light transfer | Calibrated source, angle fixture, dark enclosure | 3 per optical variant | Raw reading versus angle and reference meter; stack ID recorded | Not run |
| OPT-02 | S-P cassette | PV behavior | Controlled illumination, load sweep and temperature probe | 3 per optical variant | I-V sweep, temperature and exact finished stack | Not run |
| OPT-03 | Band | Cross-talk | Emitter active, receiver and surface sensors sampled | First article + 3 units | Leakage baseline and baffle configuration | Not run |
| MEC-01 | Shell | Scale retention / edge quality | Carrier install/remove and visual/tactile inspection | First article + all units | Retention record, no unsafe exposed edge, documented rework path | Not run |
| MEC-02 | Core | Serviceability | Open/close using defined sequence | First article + 3 units | Reassembled unit passes functional fixture test | Not run |
| THM-01 | PV/core | Temperature rise | Worst approved optical stimulus and external power load | 3 units | Internal/chassis/surface records; limits defined by engineering review | Not run |
| ELE-01 | Power | Safe initial power-up | Current-limited bench supply and fault monitor | Every core | No unintended high-current path; rails and protection log | Not run |
| ELE-02 | Harness | Surface mapping | Fixture reads each labeled connector/cassette | Every unit | Passport location agrees with fixture result | Not run |
| SIG-01 | Core | End-to-end packet route | Wired host, local diagnostic application | Every unit | ID, typed sample, freshness and receipt record match | Not run |
| MFG-01 | Build | Cycle and yield | Traveler timestamps and nonconformance log | 12 units | Process time, rework class, cosmetic result and cause codes | Not run |

Calibration source, fixture serial, operator, unit serial, firmware revision, material lot and environmental conditions must accompany every completed record. A passed software simulation is not evidence for any row.
