# Acquisition Brief â€” lattice

**Date:** 2026-09-22  
**Repository:** https://github.com/theworker02/lattice  
**Default branch:** `main`  
**Primary language:** JavaScript  
**Status:** Diligence briefing only. **No acquisition has occurred** by virtue of this file.  
**License:** Proprietary â€” sale, written commercial license, or completed asset transfer required (see root `LICENSE`).  
**Valuation:** Not stated.  
**Contact:** GitHub [@theworker02](https://github.com/theworker02) Â· [thanks.dev/u/gh/theworker02](https://thanks.dev/u/gh/theworker02)

> Cloning or forking this repository does **not** grant production, redistribution, SaaS, OEM, or commercial rights.

---

## 1. Executive thesis

<img src="brand/lattice-wordmark-github.svg" alt="LATTICE Ã¢â‚¬â€ Physical Computing Fabric" width="680"> <a href="docs/STATUS.md"><img src="https://img.shields.io/badge/status-simulated-516f82?style=flat-square" alt="Status: simulated"></a> <a href="docs/VERIFICATION.md"><img src="https://img.shields.io/badge/tests-47%20passing-2f7a6f?style=flat-square" alt="47 tests passing"></a>

**Why a buyer cares:** lattice packages transferable product IP â€” source, docs, in-repo brand assets, and a diligence room under `docs/acquisition/` â€” under a clear proprietary posture so diligence can proceed without mistaking the repo for open source.

---

## 2. Product snapshot

| Item | Detail |
|------|--------|
| Product | lattice |
| Repo | `theworker02/lattice` |
| Language | JavaScript |
| Open source? | **No** â€” proprietary |
| Rightsholder | theworker02 |
| Diligence pack | `docs/acquisition/` |

### Capability highlights (from current materials)

- **Collection:** explicit reflection/transmission/absorption and bounded recapture; separate geometric ray experiment.
- **Energy:** bounded battery charge/discharge, load demand and lighting power accounting.
- **Control:** the same acyclic graph evaluator used by the patchboard, extended with an L2 power comparator.
- **Protection:** staged virtual negotiation, passport voltage/current checks, fail-safe OFF, priority arbitration and latched motor faults.
- **Twin:** health, causal signal IDs and parent references, 600 retained snapshots, event-to-frame inspection, scope overlays and run export.
- **Diagnostics:** simulated LatticeLight Manchester/CRC round trip and explicitly virtual Bridge loopback.
- [Design language](LATTICE_DESIGN_LANGUAGE.md), [spectral research](optical/spectral-response.md), [SolarSkin budget](optical/solarskin.md).
- [Signal Cube manufacturing brief](manufacturing/SIGNAL_CUBE_MANUFACTURING_PLAN.md), [surface-to-core drawing](manufacturing/drawings/signal-cube-core.svg), [cube BOM framework](manufacturing/bom/signal-cube.csv), [manufacturing package](manufacturing/README.md).
- [M1 12-unit manufacturer pilot](manufacturing/M1-PILOT-PROGRAM.md), [supplier RFQ pack](manufacturing/suppliers/RFQ-SC-M1.md), [design verification plan](manufacturing/test-jigs/M1-DVP.md), [pilot traveler](manufacturing/assembly/SC-M1-TRAVELER.md), [DFM risk register](manufacturing/dfm/SC-A0-RISK-REGISTER.md).
- [Manufacturing partnership note](MANUFACTURER_PARTNERSHIP.md): the partner-led engineering and fabrication boundary for a GitHub reader.
- [M0 CAD](manufacturing/cad/mirrorfield-m0.scad) and [drawing](manufacturing/drawings/m0-envelope.svg) for the separate flat-array research fixture.
- [Engineering request](RFE-0001-MIRRORFIELD.md), [decisions](docs/decisions/EDR-001-CAN-vs-RS485.md), [prototype generations](docs/PROTOTYPES.md).

---

## 3. Problem / opportunity

Teams evaluating lattice typically need either (a) a commercial right to run or embed it, or (b) outright ownership of the Product IP for strategic build-out. Public GitHub visibility without a proprietary license creates false assumptions about free production use. This brief and the linked data room make the commercial path explicit.

---

## 4. What ships today

Honest maturity: treat repository contents, README claims, tests, and release tags as the source of truth. Do not assume production customers, ARR, filed patents, or SLAs unless separately evidenced in diligence.

Typical transferable surfaces:

- Source tree and build/test scripts present in-repo
- Documentation and design notes
- Acquisition / diligence markdown under `docs/acquisition/`
- Branding assets committed to the repository (if any)

---

## 5. Demo / evaluation path (buyer)

Minimal path (no secrets required unless README says otherwise):

```
```text
Environment Ã¢â€ â€™ sensor Ã¢â€ â€™ local logic Ã¢â€ â€™ typed signal Ã¢â€ â€™ chosen destination
                  Ã¢â€ â€˜                         Ã¢â€ â€œ
          functional mirror skin      Twin / Observatory
```
```powershell
python -m http.server 4173 --bind 127.0.0.1
```
```powershell
node --test tests/*.test.mjs
node --check src/mirrorfield-app.mjs
node --check src/twin.mjs
python tools/generate-cad.py
python tools/verify-artifacts.py
```
```

Extended evaluation: `docs/acquisition/BUYER_EVALUATION.md`. Written NDA / evaluation grants may be required for private materials.

---

## 6. What a transaction typically includes

Subject to definitive schedules:

| Included (typical) | Excluded (typical) |
|--------------------|--------------------|
| Repo materials + asserted original IP | Seller personal accounts / unrelated repos |
| Docs + diligence room at closing | Third-party dependency source under separate licenses |
| In-repo brand marks as assigned | Secrets without rotation plan |
| Know-how captured in docs | Fabricated revenue, user, or adoption metrics |

---

## 7. Suggested deal structures

| Structure | When it fits |
|-----------|--------------|
| Non-exclusive commercial license | Deploy/run under seat or environment terms |
| Exclusive field-of-use license | Buyer wants exclusivity; seller may retain entity |
| Asset / IP assignment | Buyer wants ownership of Materials outright |
| OEM / redistribution | Separate agreement â€” not implied here |

Commercial terms (price, earnouts, escrow) are negotiated under NDA with counsel.

---

## 8. Buyer diligence checklist

- [ ] Confirm Rightsholder identity and authority to sell/license
- [ ] Inventory Materials (`docs/acquisition/ASSET_INVENTORY.md`)
- [ ] Review IP posture (`IP_PROVENANCE.md`) and dependencies (`DEPENDENCY_INVENTORY.md`)
- [ ] Run evaluation script (`BUYER_EVALUATION.md`)
- [ ] Review risks (`RISK_REGISTER.md`)
- [ ] Agree transfer scope (`TRANSFER_MANIFEST.md`) and handoff (`HANDOFF_CHECKLIST.md`)
- [ ] Supersede root `LICENSE` at closing via definitive agreement

---

## 9. Related documents

| Document | Purpose |
|----------|---------|
| `LICENSE` | Proprietary â€” no default grant |
| `docs/acquisition/README.md` | Data-room index |
| `docs/acquisition/EXECUTIVE_SUMMARY.md` | One-page thesis |
| `README.md` | Product overview |
| `SECURITY.md` | Vulnerability reporting |
| `COMMERCIAL.md` | Licensing contact path |
| `.github/FUNDING.yml` | Sponsors / thanks.dev |

---

## 10. Disclaimer

This package is informational and **does not** create a binding offer, grant of rights, or investment advice. Engage counsel for any transaction.

---

*Document version: 2.0.0 / 2026-09-22 Â· Classification: acquisition briefing*
