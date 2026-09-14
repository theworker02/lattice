# PCB release checklist

**Status: CONCEPT.** No Gerbers, pick-and-place files or released board layouts are included.

Before sending any PCB to fabrication, a manufacturer or electrical engineer must attach: controlled schematic/PDF, PCB source, stack-up/impedance requirements, fab drawing, assembly drawing, centroid, BOM with approved alternates, programming fixture, test-point map, revision ID and a signed design review record.

The review must explicitly cover protection defaults, CAN-FD termination/transceiver selection, ESD, creepage/clearance appropriate to the selected SELV envelope, PV/sensor separation, flex connectors, thermal paths, debug access, component availability and assembly inspection. The E1 architecture in [../E1_REFERENCE_ARCHITECTURE.md](../E1_REFERENCE_ARCHITECTURE.md) intentionally does not substitute for these artifacts.
