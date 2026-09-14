# PCB architecture — CONCEPT

Partition low-power identity/MCU, sensor analog, switched load, and external bus interfaces. Plan thermal/voltage/current sensing at protected branches and battery. Keep optical receiver/emitter supply noise away from analog sensors. Reserve debug and production-test access without exposing unprotected load rails. No schematic or Gerber exists yet: E1 requires engineer-reviewed schematics, ERC, stackup, clearance rules, component variants and fault calculations.
