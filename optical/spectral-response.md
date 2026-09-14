# Spectral response / SolarSkin research

Status: **CONCEPT** material system; **SIMULATED** broadband energy model. No production optical material is selected.

At each wavelength, incidence angle and polarization, a passive stack obeys `R + T + A = 1`. Integrating solar generation requires the illuminant spectrum, finished-stack transmittance and PV spectral responsivity/EQE. Visible appearance uses different weighting from PV conversion. Lux is photometric; the simulator uses W/m² and deliberately does not infer lux, UV index or CCT from irradiance alone.

## Candidate evidence, accessed 2026-09-09

| Candidate / source | Manufacturer evidence | Implication / open test |
| --- | --- | --- |
| [Edmund 50R/50T VIS plate](https://www.edmundoptics.com/p/50-x-50mm-50-50RT-VIS-Plate-Beamsplitter/37200/) | 45° incidence; coating specification 50/50 ±5% at 550 nm and ±10% over 400–700 nm | Useful coupon reference; cannot assume the same split at normal incidence, in NIR, or after lamination |
| [SCHOTT RG850 datasheet collection](https://www.schott.com/-/media/project/onex/products/o/optical-filter-glass/downloads/schott-datasheet-collection-filter-en_112019.pdf?rev=766d730fb2ac41fd82165f3f74ee7ae3) | RG850 sheet includes spectral internal-transmittance curves at 1, 2, 3 mm; guaranteed/reference anchors below | Candidate dark NIR window, unsuitable for assuming visible display transmission |
| [ams OSRAM AS7341](https://ams-osram.com/products/sensor-solutions/ambient-light-color-spectral-proximity-sensors/ams-as7341-11-channel-spectral-color-sensor) | Visible spectral channels plus clear, NIR and flicker sensing | Candidate spectral sensing approach, not a UV-index or direction sensor by itself |
| [AS7341 calibration note](https://look.ams-osram.com/m/269928fe0dba7511/original/Spectral-Sensor-Calibration-Methods.pdf) | Manufacturer provides response plots and describes calibration of the assembled sensing system | Characterize with final cover, aperture and illuminant; channel ratios alone are not calibrated CCT |

RG850 source anchors at the 3 mm reference thickness: 50% internal-transmittance cutoff at 850 ±9 nm; upper internal-transmittance bound 1e-5 at 700 nm; lower bound 0.90 at 950 nm and 0.97 at 1200 nm. Reflection factor reference is 0.909. Internal transmission excludes surface reflection losses. The [CSV](rg850-reference-anchors.csv) preserves the different bound types; it must not be plotted as a measured continuous curve. The linked manufacturer sheet is the curve source. These limited anchors do not characterize a LATTICE assembly.

## Full stack selection record

Before selecting a material, record supplier, exact part/revision, substrate, coating faces, thickness, protective layer, adhesive, incidence range, polarization, temperature, and UV exposure. Attach manufacturer curves or calibrated measured CSVs with wavelength, hemispherical/specular R/T, uncertainty, method and sample ID. Measure at minimum the intended visible range and each sensor/emitter band. Do not claim an arbitrary dark plastic transmits 850 or 940 nm. Test the exact lot and thickness.

A visible-display window and an NIR-concealing window may be separate zones. Anti-glare texture scatters light and can change both useful collection and sensing angular response. Spectrally selective dielectric coatings are a candidate, not a way around conservation of energy.
