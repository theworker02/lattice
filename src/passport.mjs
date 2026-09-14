export const STATUSES = ['CONCEPT', 'SIMULATED', 'ENGINEERED', 'PROTOTYPED', 'VALIDATED', 'PRODUCTION CANDIDATE'];
export const PRIORITIES = Object.freeze({ INFO: 0, NORMAL: 1, IMPORTANT: 2, CRITICAL: 3, EMERGENCY: 4 });
export const FAMILIES = Object.freeze({
  solarskin: ['optical', ['irradiance'], ['power', 'temperature']], mirror: ['optical', ['orientation'], ['position']],
  vector: ['sense', [], ['optical_vector']], temperature: ['sense', [], ['temperature']],
  energy: ['energy', ['power'], ['power', 'voltage', 'current']], battery: ['energy', ['charge'], ['level', 'power']],
  logic: ['logic', ['power'], ['enable']], motor: ['motion', ['enable'], ['position']],
  fusion: ['compute', ['optical_vector', 'temperature'], ['environment']], bridge: ['bridge', ['frame'], ['frame']],
});
export function passport(type, uid, serial) {
  if (!Object.hasOwn(FAMILIES, type)) throw new Error('Unknown module family.');
  const [family, inputs, outputs] = FAMILIES[type];
  return validatePassport({ schema_version: '0.5.0', uid, serial, family, type, hardware_revision: 'M0-CONCEPT', firmware: 'sim-0.5.0', status: 'SIMULATED', inputs, outputs, power: { nominal_voltage: 5, maximum_current_ma: type === 'motor' ? 500 : 100, safe_state: 'OFF' }, transport: 'virtual' });
}
export function validatePassport(p) {
  const keys = ['schema_version','uid','serial','family','type','hardware_revision','firmware','status','inputs','outputs','power','transport'];
  if (!p || typeof p !== 'object' || Object.keys(p).some(k => !keys.includes(k)) || keys.some(k => !Object.hasOwn(p,k))) throw new Error('Invalid module passport fields.');
  if (p.schema_version !== '0.5.0' || typeof p.uid !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(p.uid) || !STATUSES.includes(p.status)) throw new Error('Invalid passport identity or status.');
  for (const k of ['serial','family','type','hardware_revision','firmware']) if (typeof p[k] !== 'string' || !p[k].length || p[k].length > 64) throw new Error(`Invalid passport ${k}.`);
  if (!Object.hasOwn(FAMILIES,p.type) || p.family !== FAMILIES[p.type][0] || !['virtual','latticelink'].includes(p.transport)) throw new Error('Invalid passport capabilities.');
  for (const k of ['inputs','outputs']) if (!Array.isArray(p[k]) || p[k].length > 32 || new Set(p[k]).size !== p[k].length || p[k].some(v => typeof v !== 'string' || !/^[a-z][a-z0-9_]{0,31}$/.test(v))) throw new Error('Invalid passport ports.');
  const power = p.power;
  if (!power || Object.keys(power).sort().join() !== 'maximum_current_ma,nominal_voltage,safe_state' || !Number.isFinite(power.nominal_voltage) || power.nominal_voltage <= 0 || power.nominal_voltage > 60 || !Number.isFinite(power.maximum_current_ma) || power.maximum_current_ma <= 0 || power.maximum_current_ma > 10000 || power.safe_state !== 'OFF') throw new Error('Invalid passport power envelope.');
  return p;
}

/** Arbitration is deterministic. OFF wins a tie, and protection preempts NORMAL commands. */
export function arbitrate(commands) {
  if (!Array.isArray(commands) || !commands.length || commands.some(c => !c || !Object.hasOwn(PRIORITIES,c.priority) || typeof c.enable !== 'boolean' || typeof c.reason !== 'string')) throw new Error('Invalid command set.');
  return [...commands].sort((a,b) => PRIORITIES[b.priority] - PRIORITIES[a.priority] || Number(a.enable) - Number(b.enable))[0];
}

export class PowerBranch {
  constructor() { this.phase = 'DETECT'; this.age = 0; this.reason = 'Awaiting identification'; this.faults = 0; }
  reset() { this.phase = 'DETECT'; this.age = 0; this.reason = 'Manual re-arm'; }
  tick(dt, { known, voltage, minimum = 4.5, maximum = 5.5, current, limit = 0.5, temperature, fault = false }) {
    if (![dt,voltage,minimum,maximum,current,limit,temperature].every(Number.isFinite) || dt < 0 || minimum > maximum || current < 0 || limit <= 0) throw new Error('Invalid branch telemetry.');
    const trip = fault || temperature >= 60 || voltage < 0 || voltage > maximum || current > limit;
    if (trip && this.phase !== 'FAULT') { this.phase = 'FAULT'; this.reason = fault ? 'Injected branch fault' : temperature >= 60 ? 'Thermal shutdown' : current > limit ? 'Overcurrent' : 'Voltage protection'; this.faults++; }
    if (this.phase === 'FAULT') return false;
    if (!known || voltage < minimum) { this.phase = 'DETECT'; this.age = 0; this.reason = !known ? 'Identification unavailable' : 'Undervoltage'; return false; }
    this.age += dt;
    const phases = ['DETECT','IDENTIFY','CAPABILITIES','COMPATIBILITY','AUTHORIZE','NORMAL'];
    this.phase = phases[Math.min(5, Math.floor((this.age + 1e-9) / 0.2))];
    this.reason = this.phase === 'NORMAL' ? '5 V branch authorized' : 'Low-power identification only';
    return this.phase === 'NORMAL';
  }
}
