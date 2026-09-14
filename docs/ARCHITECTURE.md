# Observatory architecture

MIRRORFIELD 0.5 adds the [Twin architecture](TWIN.md), [power model](POWER_ARCHITECTURE.md) and [passport contract](MODULE_FAMILIES.md). The sections below describe the retained v1 editable patchboard. The MIRRORFIELD demonstrator reuses its evaluator and adds the L2 power comparator; it maintains a separate versioned project and local-storage key.

## One graph, two connection kinds

A version-1 project holds a name, sunlight fraction, modules, and connections. Module IDs are unique; positions are presentation metadata. Each module exposes a catalog-defined set of signal inputs/outputs and power capabilities. All edits and imported graphs pass the same validator. One incoming connection is permitted per named signal input and per power input. Output fan-out is supported.

The engine computes a topological ordering across both connection kinds. Acyclic graphs evaluate their dependencies in the same tick, independent of layout and module listing order. Feedback is rejected until a defined sample/state boundary exists. Disconnected logic is inactive, including NOT: an absent input is not treated as a valid false signal.

## Time and signals

`Simulator.tick(dt)` advances explicit simulation time. The browser requests 0.1 s steps; paused manual stepping uses the same evaluator. Input is treated as held during each step. A delay accumulates elapsed time while enabled and resets as soon as it evaluates a false or missing input. Transitions are resolved at step boundaries. This is a discrete behavioral simulation, not a circuit solver or a wall-clock controller.

Each output carries an L0/L1/L2 envelope with a value and simulation timestamp, plus a unit for measurements. The history retains 180 samples per module. The event stream retains the most recent 100 state transitions and displays 20. Changing sunlight while paused reevaluates at zero elapsed time. Multiple same-time samples can therefore exist.

## Power model

Each solar module supplies `capacity × sunlight` watts. Closed relays propagate the source identity; open relays break the power path. Every motor reserves its configured peak demand from that source's remaining budget. Multiple branches share the same budget. Allocation is deterministic in topological traversal order; among otherwise competing loads, project order resolves priority. There is no fairness scheduler.

The motor's peak allocation is conservatively held throughout operation. Motor readings report the supply budget seen at its allocation turn. Relay readings represent the upstream budget at relay evaluation, not measured current or final downstream consumption. Animated power wires mean an energized path, not a measurement of load current.

Generated energy integrates solar watts over simulation time, whether consumed or not. It is available source energy, not energy stored in a battery. The model excludes wiring loss, voltage compatibility, current limits, startup transients, temperature, short circuits, reverse current, converter efficiency, and battery chemistry. Logic devices do not consume simulated power in this version.

## Persistence and boundaries

Only project configuration is persisted. JSON import is limited to 1 MB, 100 modules, and 300 connections. Numeric settings, module identity, port compatibility, and cycles are checked before replacing the running graph. Imported text is escaped before HTML rendering. No imported code executes. Engine state is cloned from the accepted project.

The UI adapter depends on the engine; the engine has no DOM, network, filesystem, or hardware dependencies. Future graphical, physical, and code interfaces should converge on a validated graph contract. Hardware adapters must supply their own authenticated commands, device lifecycle, stale-signal behavior, and electrical interlocks.
