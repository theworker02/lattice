# LATTICE Twin implementation

Status: **SIMULATED**. Virtual state is synchronized to local model execution. Physical synchronization remains **CONCEPT**.

`Twin` owns a versioned project, UUID passports, a fixed 16-slot demonstrator topology, configuration, runtime physics, fault counts, module health, rule evaluator, power branch, provenance and bounded snapshots. `Simulator` remains the shared acyclic graph IR evaluator used by both workbenches. MIRRORFIELD feeds collected watts into an L2 comparator, then an on-delay, relay, and motor. The legacy patchboard still supports editable graphs and v1 JSON.

Runtime steps are explicit 0–1 s. The UI requests 0.1 s and pauses hidden tabs; wall-clock time is not simulated. Snapshots contain the configuration and injected faults at that instant, per-module state, energy totals and a frame-local causal signal graph. Up to 600 frames and 200 events are retained. Exported runs preserve the retained window, not an unbounded recorder. Event links older than that window report missing evidence.

Replay is inspection only: it pauses simulation and disables model edits until returning to live. Snapshots are deep copies to callers. Project import/export persists configuration and identity; runtime energy and history restart. Exported recorded runs are inspection artifacts, not accepted as project imports. There is no rewind-and-branch execution yet.

Each trace signal has a unique run-local ID, origin, value, transform, parent IDs, level, unit, priority, simulation time and `quality: simulated`. Motor evidence includes environment → vector → orientation → collection → controller → threshold → delay, along with battery budget and power arbitration. Battery history is available in snapshots; the frame-local budget parent is local state, not an unlimited recursive chain to past charging events. Configuration changes and fault injections are separately recorded.

The thermal model uses a lumped first-order RC node per cell, 8 K/W and 20 J/K. It has no inter-cell conduction, emissivity, view factors, detailed electronics losses or measured thermal constants. The physical thermal view is a 4 × 4 arrangement of these numeric states. Scope supports unit-preserving overlays for temperature, power, voltage, current, position, intensity and digital state; absent channels are reported rather than fabricated.

The vector's intensity, azimuth and elevation come from virtual environment inputs. CCT, UV and IR are explicitly unknown. Heliotropic tilt/rotation is rate-limited; the simulator does not calculate a glare-safe specular target, neighbor shadowing or collision constraints. Fusion combines modeled light and temperature deterministically. The bridge diagnostics are a bounded local loopback, not GPIO, MQTT or network access.
