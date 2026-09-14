# SolarSkin optical architecture

Status: **SIMULATED** lumped energy budget; physical stack **CONCEPT**.

Proposed sequence: protective cover → partial reflector / patterned optical coating → optional routing cavity → PV → electrically insulated thermal interface → chassis spreader. Compare a zoned design with clear PV apertures against a fully overcoated design before tooling. The optical aperture in M0 will be smaller than the 80 mm gross cell; simulator results use 0.0064 m² gross area and therefore omit frame-area losses.

The engine computes `incident = irradiance × area × max(0, sun·normal)`. It allocates coating absorption, reflection and transmission; optional one-bounce recapture removes a fraction from reflected escape. PV input is transmitted plus recaptured light. Conversion uses an assumed efficiency and an assumed −0.4%/K coefficient relative to 25°C, clamped to physical fractions. Non-electrical PV input becomes heat. Electrical + heat + escaped = incident. There is no energy gain from duplicating reflected rays.

At normal incidence, 1000 W/m², area 0.0064 m², absorption 8%, efficiency 20%, 25°C, and no routing:

| Reflectivity | Transmission | Electrical W | Heat W | Escaped W |
| --- | --- | --- | --- | --- |
| 0% | 92% | 1.1776 | 5.2224 | 0 |
| 25% | 67% | 0.8576 | 3.9424 | 1.6000 |
| 50% | 42% | 0.5376 | 2.6624 | 3.2000 |
| 75% | 17% | 0.2176 | 1.3824 | 4.8000 |

These are arithmetic consequences of assumptions, not measured material efficiencies. Reflectivity may improve the desired appearance while reducing collection. Cost, durability and production yield cannot be calculated from these fractions; capture quotations and coupon testing in the material matrix.

The separate `routeRays()` experiment traces 1,000 evenly spaced 2D rays against a diagonal ideal mirror toward a finite edge receiver. It counts geometric hits and applies assumed reflectance once. At normal incidence, a receiver covering 20% of cavity height captures 200 rays; at 85% reflectance this is 17% of incident ray weight. It omits 3D étendue, Fresnel effects, wavelength, shading, multiple reflections and real light-guide coupling. The UI's recapture parameter is an independent hypothesis, not calibrated from this experiment.

M1 should compare mirror channels, TIR light guides, microprismatic films, diffusers, and edge collection under direct and diffuse illumination. Measure electrical gain against a no-routing baseline with identical aperture, temperature and light field. Concentrator prototypes need a glare/hot-spot assessment before powered exposure; no concentrating hardware is released here.
