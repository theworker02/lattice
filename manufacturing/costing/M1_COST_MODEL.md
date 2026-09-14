# M1 pilot cost model and quote rules

**Status: CONCEPT estimate framework.** Costs are intentionally unquoted until suppliers receive a controlled scope and return dated quotes.

## Quote structure

| Cost bucket | Supplier must separate | Why it matters |
| --- | --- | --- |
| NRE | industrial design engineering, CAD, DFM, PCB layout, fixture design, coating development | prevents hiding one-time work in unit price |
| Tooling | prototype tooling, carrier/scale fixtures, inspection gauges, optical/functional test fixtures | establishes ownership and reuse terms |
| Unit materials | shell, scales, coatings, cassettes, PCBA, flex, connectors, thermal materials, packaging | makes substitutions and MOQ visible |
| Unit labor | assembly, test, calibration, rework and packing | exposes serviceability/yield trade-offs |
| Validation | coupon metrology, electrical protection tests, environmental screening and reports | distinguishes evidence from assembly |
| Logistics | shipping, customs, insurance and storage | keeps landed cost honest |

## Required quote assumptions

Each quote must identify currency, Incoterm, validity date, MOQ, lead time, payment schedule, yield/rework assumption, scrap ownership, tooling ownership, material alternatives, excluded tests, IP/confidentiality terms and the exact drawing/BOM revisions used. Quote three quantities where practical: coupon lot, 12-unit M1 pilot and a later 100-unit engineering lot.

Use [`quote-template.csv`](quote-template.csv) to record received values. Do not fill empty cells with simulated values, and do not compute a production price from an M1 prototype quote.
