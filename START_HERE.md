# Start here: what LATTICE is

LATTICE is a project for building physical objects that can sense something, understand it locally, and send a useful signal somewhere else.

The first product direction is the **Signal Cube**: a small mirror-scale cube with selected sensors under its outer scales and its main electronics in a protected core inside. A light sensor might notice a change in a room, the cube can decide whether that change matters, and a connected computer or device can receive a clear message about it.

```text
Something changes in the real world
        ↓
The Signal Cube measures it
        ↓
Local logic gives it meaning
        ↓
A typed signal goes to a chosen destination
        ↓
The Observatory explains what happened
```

## What you can try right now

When the repository is running locally, open the [Mirrorfield portal](mirrorfield.html). The published portal is available at [the GitHub Pages site](https://theworker02.github.io/lattice/). The Signal Cube demonstration lets you select a simulated light, temperature, or vibration input; smooth it; apply a threshold; and watch a local monitor or recorder receive the resulting message. It is working local software, but it is not connected to real hardware.

The original [Patchboard](index.html) is another local simulator. It lets you wire virtual sensing, logic, energy and motor blocks together.

## What exists and what does not

| Exists now | Still a plan |
| --- | --- |
| Local Signal Cube routing demonstration | A fabricated mirror-scale cube |
| Twin, patchboard, rules, fault and provenance simulations | Selected mirror coating, solar stack or sensors |
| Visual direction and an internal-core proposal | Production CAD, PCB, tooling or firmware image |
| M1 pilot plan, test questions and supplier response pack | A supplier, quote, manufactured unit, test result or certification |

The status labels are intentional. A simulation can be useful without being mistaken for a physical test.

## Choose your path

### I am curious

Read [the Signal Cube story](docs/SIGNAL_CUBE.md), try the portal, then see [three practical examples](examples/README.md). You do not need to understand circuits to follow the main idea.

### I build hardware or work with a manufacturer

Read [the manufacturing partnership note](MANUFACTURER_PARTNERSHIP.md) first. Then read the [M1 Pilot Program](manufacturing/M1-PILOT-PROGRAM.md). It explains the proposed 12-cube engineering build, the shared internal core, the sensor scales, the test gates, and the exact work a partner would need to do.

### I want to help develop LATTICE

Read [the contribution guide](CONTRIBUTING.md), [project glossary](docs/GLOSSARY.md), [architecture](docs/ARCHITECTURE.md), and [status register](docs/STATUS.md). Start with a specific question or evidence gap; do not make physical-performance claims from the simulator.

## The smallest useful mental model

The reflective outer shell makes the object distinctive. Some selected scales hide a sensor or photovoltaic coupon behind an appropriate optical window. The main controller, protected power system and wired connection sit inside the core. The software Twin gives people a way to see and explain the signals.

That is the complete idea at this stage. Everything else in the repository exists to help turn that idea into a testable, buildable product with the right partner.
