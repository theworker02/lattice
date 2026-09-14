/** Plain-language presentation and reproducible experiments, independent of the DOM. */
import { mirrorfieldProject } from './twin.mjs';
export const MODULE_GUIDES = {
  solarskin: ['optical', 'A reflective surface with a solar layer underneath. Some light escapes, some becomes heat, and the rest can generate electricity.', 'Feeds electricity into the energy controller. Compare reflectivity with its power reading.'],
  vector: ['sense', 'Measures where the light comes from and how strong it is. In this lab those readings come from your environment controls.', 'Provides the direction used to orient the array.'],
  mirror: ['optical', 'A surface that changes its orientation toward the light. Tilt is its lean; rotation is its direction around the array.', 'Following the sun changes the amount of light intercepted by the collection surfaces.'],
  temperature: ['sense', 'Tracks the modeled temperature of a cell. The thermal view colors the array while keeping exact temperatures readable.', 'Helps reveal heating and supplies a temperature input to the Fusion module.'],
  fusion: ['logic', 'Combines light and temperature into a simple assessment of environmental conditions.', 'Reports whether conditions favor tracking. This is an observation, not an override of motor protection.'],
  energy: ['energy', 'Collects electricity from the four SolarSkin cells and manages the shared supply.', 'Sends collected watts to the rule and supplies the motor and battery.'],
  battery: ['energy', 'Stores surplus energy and helps cover demand when generation alone is insufficient. Its capacity is measured in watt-hours.', 'Charging increases its percentage; discharging reduces it. It cannot override the collected-power rule.'],
  logic: ['logic', 'The decision-making part of the machine. It compares collected power with your threshold and waits for the full delay.', 'A true result requests motor activation. Low light resets the waiting period.'],
  bridge: ['bridge', 'Represents the communication connection between modules and a controller.', 'This lab supports local diagnostic loopback. Physical network connections are not implemented.'],
  motor: ['motion', 'Turns electrical energy into modeled rotation. It runs only when the rule, available power and protection checks all agree.', 'Try a short-circuit fault to see protection stop motion while solar collection continues.'],
};
export const PRESETS = {
  sunny: { irradiance:900, reflectivity:0.5, absorption:0.08, thresholdW:1, delayS:2, demandW:1.2, tracking:true },
  cloudy: { irradiance:150, reflectivity:0.5, absorption:0.08, thresholdW:1, delayS:2, demandW:1.2, tracking:true },
  mirror: { irradiance:900, reflectivity:0.85, absorption:0.08, thresholdW:1, delayS:2, demandW:1.2, tracking:true },
};
export function createExperiment(project, key) {
  if (!Object.hasOwn(PRESETS,key)) throw new Error('Unknown experiment.');
  const next=structuredClone(project);
  next.config={...mirrorfieldProject().config,...PRESETS[key]};
  return next;
}
export function explainFrame(frame) {
  const power=frame.totals.collected.toFixed(2), threshold=frame.config.thresholdW;
  if(frame.states.MF15.active) return {tone:'success',title:'The motor is running',detail:`The array collects ${power} W. The ${threshold} W rule has passed its ${frame.config.delayS}-second delay, and the motor has permission and enough supply to run.`};
  if(frame.states.MF15.powerState==='FAULT') return {tone:'warning',title:'Protection has stopped the motor',detail:'The motor branch is latched off. Select the motor, clear the fault, allow any heat to fall, then choose Re-arm motor branch.'};
  if(frame.totals.collected<=threshold) return {tone:'waiting',title:'Waiting for more collected power',detail:`The array currently collects ${power} W; the rule needs more than ${threshold} W. Increase light strength or reduce reflectivity. Stored battery energy does not bypass this rule.`};
  return {tone:'waiting',title:'The motor is waiting for permission',detail:`Collected power is ${power} W. The delay, supply budget and protection checks must all pass. Current reason: ${frame.reason}.`};
}
