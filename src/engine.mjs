/** LATTICE deterministic simulator. Power wiring and signal wiring are separate. */
export const CATALOG = Object.freeze({
  solar: { family: 'Energy', name: 'Solar input', inputs: [], outputs: ['watts'], powerOut: true, defaults: { capacity: 40 } },
  light: { family: 'Sense', name: 'Light sensor', inputs: [], outputs: ['light'], defaults: {} },
  threshold: { family: 'Logic', name: 'Threshold', inputs: ['value'], outputs: ['active'], defaults: { threshold: 0.6 } },
  compare: { family: 'Logic', name: 'Power compare', inputs: ['value'], outputs: ['active'], defaults: { thresholdW: 1 } },
  delay: { family: 'Logic', name: 'On delay', inputs: ['enable'], outputs: ['active'], defaults: { seconds: 5 } },
  and: { family: 'Logic', name: 'AND gate', inputs: ['a', 'b'], outputs: ['active'], defaults: {} },
  not: { family: 'Logic', name: 'NOT gate', inputs: ['enable'], outputs: ['active'], defaults: {} },
  relay: { family: 'Control', name: 'Relay', inputs: ['enable'], outputs: ['active'], powerIn: true, powerOut: true, defaults: {} },
  motor: { family: 'Motion', name: 'Motor', inputs: [], outputs: ['running'], powerIn: true, defaults: { peak: 25 } },
});

export function demo() {
  return {
    version: 1, name: 'Sunlight to motion', sunlight: 0.82,
    modules: [
      { id: 'L01', type: 'light', x: 45, y: 70, config: {} },
      { id: 'T02', type: 'threshold', x: 280, y: 70, config: { threshold: 0.6 } },
      { id: 'D03', type: 'delay', x: 515, y: 70, config: { seconds: 5 } },
      { id: 'S04', type: 'solar', x: 45, y: 300, config: { capacity: 40 } },
      { id: 'R05', type: 'relay', x: 515, y: 300, config: {} },
      { id: 'M06', type: 'motor', x: 750, y: 300, config: { peak: 25 } },
    ],
    connections: [
      { kind: 'signal', from: 'L01', port: 'light', to: 'T02', input: 'value' },
      { kind: 'signal', from: 'T02', port: 'active', to: 'D03', input: 'enable' },
      { kind: 'signal', from: 'D03', port: 'active', to: 'R05', input: 'enable' },
      { kind: 'power', from: 'S04', to: 'R05' },
      { kind: 'power', from: 'R05', to: 'M06' },
    ],
  };
}

const fail = (message) => { throw new Error(message); };
const finite = (n, min, max) => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
function order(graph) {
  const indegree = new Map(graph.modules.map(m => [m.id, 0]));
  for (const c of graph.connections) indegree.set(c.to, indegree.get(c.to) + 1);
  const queue = graph.modules.filter(m => !indegree.get(m.id)).map(m => m.id);
  for (let i = 0; i < queue.length; i++) {
    for (const c of graph.connections.filter(c => c.from === queue[i])) {
      indegree.set(c.to, indegree.get(c.to) - 1);
      if (!indegree.get(c.to)) queue.push(c.to);
    }
  }
  if (queue.length !== graph.modules.length) fail('Feedback loops are not supported in this simulator version.');
  return queue;
}

/** Validate untrusted imported graphs and all edits before simulation. */
export function validateGraph(graph) {
  if (!graph || graph.version !== 1 || typeof graph.name !== 'string' || graph.name.length > 100 || !finite(graph.sunlight, 0, 1)) fail('Invalid project header or sunlight value.');
  if (!Array.isArray(graph.modules) || graph.modules.length > 100 || !Array.isArray(graph.connections) || graph.connections.length > 300) fail('Projects support up to 100 modules and 300 connections.');
  const modules = new Map();
  for (const m of graph.modules) {
    if (!m || typeof m.type !== 'string' || !Object.hasOwn(CATALOG, m.type) || typeof m.id !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]{0,31}$/.test(m.id) || modules.has(m.id)) fail('Invalid module type or duplicate module ID.');
    if (!finite(m.x, 0, 2000) || !finite(m.y, 0, 2000) || !m.config || typeof m.config !== 'object' || Array.isArray(m.config)) fail(`Invalid position or configuration for ${m.id}.`);
    const limits = { capacity: [0, 10000], threshold: [0, 1], thresholdW: [0, 10000], seconds: [0, 3600], peak: [0.1, 10000] };
    for (const key of Object.keys(m.config)) if (!Object.hasOwn(CATALOG[m.type].defaults, key)) fail(`Unknown setting ${key} for ${m.id}.`);
    for (const key of Object.keys(CATALOG[m.type].defaults)) if (!finite(m.config[key], ...limits[key])) fail(`Invalid ${key} for ${m.id}.`);
    modules.set(m.id, m);
  }
  const occupied = new Set();
  for (const c of graph.connections) {
    if (!c || !modules.has(c.from) || !modules.has(c.to) || c.from === c.to) fail('Connection references an invalid module.');
    const source = CATALOG[modules.get(c.from).type], target = CATALOG[modules.get(c.to).type];
    if (c.kind === 'signal') {
      if (!source.outputs.includes(c.port) || !target.inputs.includes(c.input)) fail('Connection references an invalid signal port.');
      const sourceType = modules.get(c.from).type;
      const targetType = modules.get(c.to).type;
      const outputClass = sourceType === 'light' ? 'L1' : sourceType === 'solar' ? 'L2' : 'L0';
      const inputClass = targetType === 'threshold' ? 'L1' : targetType === 'compare' ? 'L2' : 'L0';
      if (outputClass !== inputClass) fail(`Incompatible signal classes: ${inputClass} input cannot accept ${outputClass}.`);
    } else if (c.kind === 'power') {
      if (!source.powerOut || !target.powerIn) fail('Incompatible power ports.');
    } else fail('Unknown connection kind.');
    const key = `${c.to}:${c.kind}:${c.kind === 'signal' ? c.input : 'power'}`;
    if (occupied.has(key)) fail('Each input accepts one connection. Use separate relay branches for power fan-out.');
    occupied.add(key);
  }
  order(graph);
  return graph;
}

/** L0, L1 and L2 envelopes emitted by the virtual modules. */
const signal = (level, value, time, unit) => ({ level, value, timestamp: time, ...(unit ? { unit } : {}) });

export class Simulator {
  constructor(graph) { this.load(graph); }
  load(graph) {
    this.graph = structuredClone(validateGraph(graph));
    this.time = 0;
    this.state = Object.create(null);
    this.history = Object.create(null);
    this.events = [];
    this.energyWh = 0;
    this.tick(0);
  }
  tick(dt = 0.1) {
    if (!finite(dt, 0, 60)) fail('Simulation step must be between 0 and 60 seconds.');
    this.time += dt;
    const graph = this.graph, next = Object.create(null), budgets = new Map();
    const modules = new Map(graph.modules.map(m => [m.id, m]));
    for (const id of order(graph)) {
      const m = modules.get(id), prev = this.state[id];
      const input = name => {
        const wire = graph.connections.find(c => c.kind === 'signal' && c.to === id && c.input === name);
        return wire ? next[wire.from]?.outputs[wire.port]?.value : undefined;
      };
      const s = { outputs: {}, active: false, watts: 0, status: 'Idle', elapsed: 0, root: null };
      const bool = value => { s.active = value; s.outputs.active = signal('L0', value, this.time); s.status = value ? 'Active' : 'Idle'; };
      switch (m.type) {
        case 'light': s.outputs.light = signal('L1', graph.sunlight, this.time); s.status = 'Sensing'; break;
        case 'solar':
          s.watts = m.config.capacity * graph.sunlight; s.root = id;
          budgets.set(id, s.watts); s.outputs.watts = signal('L2', s.watts, this.time, 'W'); s.status = 'Generating';
          this.energyWh += s.watts * dt / 3600; break;
        case 'threshold': bool(input('value') !== undefined && input('value') > m.config.threshold); break;
        case 'compare': bool(input('value') !== undefined && input('value') > m.config.thresholdW); break;
        case 'and': bool(input('a') === true && input('b') === true); break;
        case 'not': bool(input('enable') !== undefined && !input('enable')); break;
        case 'delay':
          s.elapsed = input('enable') === true ? (prev?.elapsed ?? 0) + dt : 0;
          bool(input('enable') === true && s.elapsed + 1e-9 >= m.config.seconds);
          if (input('enable') === true && !s.active) s.status = 'Timing';
          break;
        case 'relay': bool(input('enable') === true); s.status = s.active ? 'Closed' : 'Open'; break;
      }
      if (CATALOG[m.type].powerIn) {
        const wire = graph.connections.find(c => c.kind === 'power' && c.to === id);
        const upstream = wire && next[wire.from];
        s.root = upstream?.root ?? null;
        if (m.type === 'relay') {
          if (!s.active) s.root = null;
          s.watts = s.root ? budgets.get(s.root) : 0;
        } else if (m.type === 'motor') {
          const available = s.root ? budgets.get(s.root) : 0;
          s.available = available;
          s.active = !!s.root && available + 1e-9 >= m.config.peak;
          s.status = s.active ? 'Running' : s.root ? 'Power blocked' : 'No power';
          s.watts = s.active ? m.config.peak : 0;
          if (s.active) budgets.set(s.root, available - s.watts);
          s.outputs.running = signal('L0', s.active, this.time);
        }
      }
      next[id] = s;
      if (prev && prev.status !== s.status) this.events.unshift({ time: this.time, module: id, message: `${prev.status} → ${s.status}` });
      const value = Object.values(s.outputs)[0]?.value ?? s.watts;
      this.history[id] ??= [];
      this.history[id].push({ time: this.time, value: Number(value) });
      if (this.history[id].length > 180) this.history[id].shift();
    }
    this.events = this.events.slice(0, 100);
    this.state = next;
    return next;
  }
}
