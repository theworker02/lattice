/** SIMULATED: lumped optical energy accounting, not measured coating data. */
const radians = degrees => degrees * Math.PI / 180;
export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export function incidence(azimuth, elevation, tilt, rotation) {
  const e = radians(elevation), t = radians(tilt), d = radians(azimuth - rotation);
  return clamp(Math.sin(e) * Math.cos(t) + Math.cos(e) * Math.sin(t) * Math.cos(d), 0, 1);
}
export function opticalBudget({ irradiance, area = 0.0064, cosine = 1, reflectivity, absorption = 0.08, efficiency = 0.2, routing = 0, temperature = 25 }) {
  for (const n of [irradiance, area, cosine, reflectivity, absorption, efficiency, routing, temperature]) if (!Number.isFinite(n)) throw new Error('Optical inputs must be finite.');
  if (irradiance < 0 || area <= 0 || cosine < 0 || cosine > 1 || reflectivity < 0 || absorption < 0 || reflectivity + absorption > 1 || efficiency < 0 || efficiency > 1 || routing < 0 || routing > 1) throw new Error('Invalid optical energy fractions.');
  const incident = irradiance * area * cosine;
  const reflected = incident * reflectivity;
  const coatingHeat = incident * absorption;
  const transmitted = incident - reflected - coatingHeat;
  // Routing recaptures part of the reflected budget once, without adding incident energy.
  const routed = reflected * routing;
  const pvInput = transmitted + routed;
  const conversion = clamp(efficiency * (1 - 0.004 * (temperature - 25)), 0, 1);
  const electric = pvInput * conversion;
  const heat = coatingHeat + pvInput - electric;
  const escaped = reflected - routed;
  return { incident, reflected, transmitted, routed, electric, heat, escaped, conversion };
}

/** 2D single-bounce ray experiment: a 45-degree mirror directs normal rays to an edge collector. */
export function routeRays({ rays = 1000, angle = 0, reflectivity = 0.85, collectorHeight = 0.2 } = {}) {
  if (!Number.isInteger(rays) || rays < 1 || rays > 100000 || !Number.isFinite(angle) || Math.abs(angle) > 80 || !Number.isFinite(reflectivity) || reflectivity < 0 || reflectivity > 1 || !Number.isFinite(collectorHeight) || collectorHeight < 0 || collectorHeight > 1) throw new Error('Invalid ray experiment.');
  let hits = 0;
  const dx = Math.sin(radians(angle)), dy = -Math.cos(radians(angle));
  // Mirror segment y=x; reflected direction swaps x and y components.
  for (let i = 0; i < rays; i++) {
    const x0 = (i + 0.5) / rays;
    const t = (x0 - 1) / (dy - dx), x = x0 + t * dx;
    if (t < 0 || x < 0 || x > 1) continue;
    const rx = dy, ry = dx, travel = -x / rx, y = x + travel * ry;
    if (travel >= 0 && y >= (1 - collectorHeight) / 2 && y <= (1 + collectorHeight) / 2) hits++;
  }
  return { rays, hits, geometricCapture: hits / rays, collectedFraction: hits / rays * reflectivity, status: 'SIMULATED' };
}
