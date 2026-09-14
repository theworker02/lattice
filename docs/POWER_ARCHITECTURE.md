# Power and protection architecture

Status: **SIMULATED** branch controller and battery budget; electrical implementation **CONCEPT**.

The simulation uses a regulated 5 V load domain and a 0.5 A motor-branch ceiling. These are model settings, not connector ratings. The solar inputs feed an abstract energy controller. A single bidirectional virtual battery buffers the shared domain. Four SolarSkin outputs are summed once. The battery cannot charge and discharge simultaneously in a step.

Battery assumptions: configurable 0.01–10 Wh capacity, default 0.1 Wh at 50% initial state, 2 W charge/discharge limit, 90% efficiency each direction. Discharge budget is bounded by stored Wh and timestep; charging is bounded by remaining capacity. Charge state is an energy integrator, not a chemistry/BMS model. Changing capacity clips stored energy and records a configuration event; it is an experiment edit, not a conserved physical operation.

The motor reserves configured peak demand while active. Lighting draws a modeled 0 W, 0.016 W event-duty average, or 0.16 W continuous array demand when supply permits. General compute and tracking motors are not yet electrically budgeted. Base thermal heating on non-PV cells is a separate placeholder heat source. Consequently the simulator is not a full-system efficiency estimate.

Physical branch architecture: source protection → polarity/reverse-current barrier → independently controlled eFuse/load switch → branch current/voltage sense → rated contacts → sink. Identification has its own constrained supply path. Battery packs require a reviewed charger, BMS, temperature monitoring and containment; solar panels require a regulator/charge controller. These are not interchangeable with a generic relay.

Candidate evidence: [TI TPS2663](https://www.ti.com/product/TPS2663) provides an industrial eFuse family with programmable protection and current/inrush functions. Feature implementation depends on variant and external components; its ratings are not adopted as LatticeLink ratings. The [evaluation board](https://edgeworker.ti.com/tool/TPS2663-166EVM) documents external circuitry for specific reverse-polarity protection. Part selection requires a schematic and operating-envelope review.

The model state sequence is DETECT → IDENTIFY → CAPABILITIES → COMPATIBILITY → AUTHORIZE → NORMAL, with 0.2 s illustrative stages. Missing identity/communication or undervoltage revokes permission. Overcurrent, overvoltage, negative voltage and motor overtemperature latch FAULT. A user must clear the cause and re-arm; re-arm cannot bypass an active fault. Physical timing, threshold tolerances, fault energy and interrupt circuitry require measurement.
