# Changelog

## GitHub Pages migration — 2026-09-13

- Replaced the Cloudflare Worker deployment path with a GitHub Actions GitHub Pages workflow.
- Added a Pages artifact builder that publishes Mirrorfield at the project URL and preserves Patchboard at `/patchboard.html`.
- Added GitHub Pages setup, verification, publishing and rollback instructions.
- Removed four Worker-only regression tests; 44 browser-local simulation and routing tests remain.

## GitHub README presentation — 2026-09-13

- Added a light-background official wordmark so the LATTICE identity remains visible on GitHub.
- Added project status, test, license and Cloudflare Workers badges to the README header.

## Official identity and public license — 2026-09-13

- Added the official LATTICE mirrored-facet brand kit, wordmark, monochrome mark and favicon.
- Applied the official mark to Patchboard, Mirrorfield and the Cloudflare asset bundle.
- Added the MIT License for Magnexis and @theworker02, plus a separate brand-use and trademark statement.

## Official brand kit and README expansion — 2026-09-13

- Added an official mirrored-facet mark, wordmark, monochrome mark, favicon and usage guide in `brand/`.
- Expanded the README with the official wordmark, a plain-language product story, use paths, public promise and SolarSkin explanation.
- Added brand assets to the Cloudflare public bundle.

## Cloudflare release readiness — 2026-09-13

- Added Worker regression tests for root routing, asset caching, security headers, HEAD behavior and rejected write methods.
- Added a public deployment checklist covering message review, bundle inspection, manual Cloudflare validation and post-deploy smoke checks.

## Cloudflare Workers preparation — 2026-09-13

- Added a static-first Worker, asset-bundle build script, Worker configuration, public 404 page and deployment guide.
- Added restrictive response headers and cache rules without introducing a cloud database, telemetry, user account or hardware-control endpoint.
- Kept deployment manual and excluded local development/tooling files from the public bundle.

## SolarSkin visual explainer — 2026-09-13

- Expanded the mirror-scale anatomy from four to eight numbered inspection points, including the optical window, light cassette, PV cassette and removable carrier.
- Added detailed SolarSkin stack and light-environment diagrams to distinguish reflection, measurement, PV collection, status-light cross-talk and heat.
- Kept all optical and PV properties explicitly at CONCEPT pending selected materials and measured M1 evidence.

## Outsider onboarding — 2026-09-13

- Added a plain-language Start Here guide, manufacturer onboarding guide, glossary and contribution guide.
- Linked newcomer and manufacturer routes from the README and added an uncluttered orientation section to the portal.

## Manufacturing partnership boundary — 2026-09-13

- Added a GitHub-facing manufacturing partnership note that clearly assigns detailed engineering, fabrication, testing, quality and certification work to a prospective partner.
- Linked the responsibility boundary from the repository README, manufacturing package and M1 pilot program.

## Project blueprint expansion — 2026-09-13

- Added firmware, hardware, protocols, calibration, quality, compliance, simulator, Observatory, examples and operations work areas.
- Added concrete M1 boundaries for boot/safety, cassette integration, measurement traceability, pilot quality, compliance scope, scenario governance and supervised demonstrations.
- Added a repository blueprint to the README and portal.

## M1 manufacturer pilot program — 2026-09-13

- Defined a 12-unit manufacturer-facing Signal Cube pilot with a common core, removable functional scale cassettes and three controlled optical-stack variants.
- Added an RFQ response pack, DVP matrix, build traveler and open DFM risk register.
- Added manufacturer-pilot links and a clear evidence-gate story to the portal and engineering documentation.

## Signal Cube manufacturing direction — 2026-09-13

- Made the selected mirrored-scale image the binding appearance reference for SC-A0 design review.
- Added a detailed surface-to-core assembly drawing, proposed central controller/power/interface core, and sensor/PV/temperature cassettes beneath selected scales.
- Added a preliminary cube BOM and linked the manufacturing plan from the portal, product specification and design language.
- Kept the package at CONCEPT: the dimensions are a packaging study, and no production CAD, selected optical stack or fabricated electronics is claimed.

## Mirror-scale exterior and product guide — 2026-09-13

- Replaced the generic cube drawing with a detailed mirrored-scale industrial-design concept.
- Added four interactive anatomy callouts and a labeled six-part proposed enclosure section.
- Extended the page after experiment export with a concrete signal walkthrough, three application directions, FAQs and product navigation.
- Kept conceptual hardware illustrations and illustrative messages distinct from live software receipts and manufacturing CAD.

## Signal Cube direction — 2026-09-13

- Refocused the portal around a cube-shaped sensing and routing product, retaining MIRRORFIELD as its surface/material lab.
- Added a standalone local signal router with moving-average filtering, thresholds, typed packets, separate local destinations and bounded expiring buffers.
- Added an interactive cube presentation, route persistence, packet inspection, delivery counters and session export.
- Added five regression tests for signal processing, recovery, expiry, route changes and bounded history.

## Fault center expansion — 2026-09-13

- Added persistent critical-fault banners, stronger module fault styling and dismissible operation errors in both workbenches.
- Added a bounded incident journal with immutable opening evidence, acknowledgement, resolution tracking, replay snapshots and JSON report export.
- Added four interactive fault drills and module-specific recovery guidance.
- Added five regression tests covering classification, deduplication, acknowledgement, latched recovery and recurrence.


## Portal refinement — 2026-09-13

- Added an explanatory product introduction, guided experiments, live motor explanations and module role descriptions.
- Added consistent family colors, clearer control labels and a more spacious portal presentation.
- Moved detailed causal signals into an expandable section and removed the maturity-stage footer from the product UI.
- Added regression tests for presets, preserved module identity and protection explanations.


## [0.5.0] — MIRRORFIELD

### Added — SIMULATED

- MIRRORFIELD 4 × 4 Observatory and local LATTICE Twin with UUID passports, derived virtual topology, health and 600-frame history.
- SolarSkin optical accounting, appearance/collection trade table and bounded 2D light-routing experiment.
- Virtual light vector, rate-limited orientation, deterministic sensor fusion and battery energy buffer.
- Thermal array view, unit-preserving scope overlays, power display and configurable lighting budget.
- Signal provenance, event-linked time-travel inspection and retained-run export.
- Staged capability/power negotiation, passport voltage/current compatibility, fail-safe OFF, priority arbitration and branch fault latch.
- Deployment sandbox checks and compatible module fault injection.
- LatticeLight Manchester/CRC diagnostics and a bounded virtual Bridge loopback.

### Added — CONCEPT / engineering documentation

- Mirrorfield industrial design system and functional surface zoning.
- Spectral research, material matrix, hidden displays, touch/e-paper and anti-glare research.
- Magnetic alignment and rated-contact requirements, independent electronic protection architecture.
- Preliminary M0 CAD, dimensions, technical renders and manufacturing BOM/DFM/cost frameworks.
- RFE-0001 engineering request, six engineering decision records, environmental test plans, prototype generations and roadmap.

### Changed

- Enclosure is specified as an optical, thermal and interaction subsystem.
- LatticeLink proposal includes low-power identification and capability/power negotiation.
- Shared graph evaluator now accepts an L2 power comparator; legacy patchboard and v1 saves remain available.
- LATTICE identity now uses a central mirrored hexagonal facet and PHYSICAL COMPUTING FABRIC descriptor.

### Experimental / not physically implemented

- Semi-reflective photovoltaic stacks, heliotropic mechanisms, optical communication hardware and light guides.
- Hidden/touch displays, adaptive optical surfaces, real network discovery and synchronized physical twins.
- Hardware Bridge adapters and cloud providers; no deployment or manufacturing qualification claimed.

## 0.1.0 — 2026-09-08

- Introduced the local Observatory patchboard with eight virtual module types.
- Added typed signal evaluation, continuous on-delay, shared source power budgets, and motor activation constraints.
- Added editable connections, draggable and keyboard-positionable modules, inspection, scope history, and state transition events.
- Added local patch persistence and validated JSON import/export.
- Documented LSP and LatticeLink as draft research boundaries with explicit implementation limits.
- Added deterministic engine regression tests.
