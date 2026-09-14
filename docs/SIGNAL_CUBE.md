# LATTICE Signal Cube

The core product is a distinctive cube-shaped sensing and signal-routing device. It receives measurements from built-in sensors or connected equipment, interprets them locally, and forwards useful typed signals to other devices or software. MIRRORFIELD is an experimental surface system within this product direction; the flat 4 × 4 array is a research fixture, not the proposed core enclosure.

## Product layers

1. **Sense:** interchangeable optical/environmental sensing behind functional windows. External equipment enters through explicit adapter modules.
2. **Understand:** channel identity, units, quality, calibration metadata, smoothing and local rules.
3. **Route:** destinations, bounded buffering, freshness and delivery evidence. Physical power and informational messages remain distinct.
4. **Explain:** restrained surface indicators, local inspection, fault history and a digital counterpart.

Physical construction is CONCEPT. The portal's cube illustration is the selected appearance reference, and the [SC-A0 manufacturing design brief](../manufacturing/SIGNAL_CUBE_MANUFACTURING_PLAN.md) maps it to a proposed central hardware core and selected under-scale light, photovoltaic and temperature cassettes. Its 120 mm envelope is a packaging-study target, not released cube CAD or a fabrication instruction. No assembled electronics, wireless certification or sensor performance is implied. Existing 80 × 80 × 25.2 mm M0 CAD still describes the flat MIRRORFIELD fixture.

The current visual direction uses overlapping mirrored scales, not broad flat metallic panels. A recessed optical band interrupts the scales, separating the sensor view and restrained status illumination from decorative reflections. The portal includes a concept render, interactive anatomy and a labeled proposed section. Retention, sharp-edge treatment, cleanability, glare, optical cross-talk and electrical isolation remain unresolved engineering work.

The portal’s expanded eight-point anatomy distinguishes reflective-only scales from a selected optical window, under-scale light cassette, under-scale PV cassette and removable carrier. Its SolarSkin stack/environment diagrams show the proposed light path and required boundaries: a mirror must either reflect, use a defined optical path for measurement, or transmit enough light to a separately conditioned PV coupon. They are test-oriented concept diagrams, not selected material or performance claims.

## Implemented local routing lab

The standalone `SignalCube` model takes manually simulated light, temperature or vibration readings. Its ordered pipeline computes a moving average of 1–10 samples, applies a strict greater-than threshold, creates an L2 packet, and forwards it to a named local destination. During initial window fill, the mean uses available samples. Units are retained; vibration g is a hypothetical input, not a sampled accelerometer.

Packets contain a session-local sequence ID, source channel, simulated quality, raw and processed values, unit, sample count, threshold, destination, creation time and expiry. Delivery adds transport `local-memory` and delivery time. Browser timestamps use the monotonic performance clock in milliseconds, not UTC. The monitor shows its latest receipt; the recorder displays recent receipts. Neither is an external endpoint.

Offline queues hold 20 messages; oldest messages are dropped on overflow. Messages expire after five seconds and are never delivered after expiry. Recovery flushes fresh messages once. The session retains 100 delivered receipts and lifetime counters. Route changes clear the averaging window and count queued messages as dropped to prevent them being sent under a different route.

The route persists in local storage under its own key. Samples, queues, counters and receipts do not survive reload. JSON session export contains the retained receipts, pending queue and counters. The cube stream runs independently from the MIRRORFIELD simulation; pausing the array does not pause the cube. Hidden tabs stop generating samples; the monotonic expiry clock continues to age queued messages.

## Next engineering priority

Choose one sensor and one wired destination for an end-to-end physical prototype, before expanding interface variety. Establish stable identity, sample freshness, electrical requirements, calibration and explicit delivery semantics. Implement a real adapter only when hardware or a known destination exists. MQTT, USB, CAN, HTTP and cube-to-cube communication are future adapters, not available integrations. A physical cube should work locally without a required cloud account.
