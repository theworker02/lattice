import test from 'node:test';
import assert from 'node:assert/strict';
import { Simulator, demo, validateGraph } from '../src/engine.mjs';

test('sunlight propagates through threshold and continuous delay to a powered motor', () => {
  const sim = new Simulator(demo());
  assert.equal(sim.state.M06.active, false);
  sim.tick(4.9); assert.equal(sim.state.M06.active, false);
  sim.tick(0.1); assert.equal(sim.state.M06.active, true);
  assert.equal(sim.state.L01.outputs.light.level, 'L1');
  assert.equal(sim.state.S04.outputs.watts.unit, 'W');
  assert.ok(Math.abs(sim.energyWh - 32.8 * 5 / 3600) < 1e-10);
});
test('delay resets immediately when light drops, including at threshold equality', () => {
  const sim = new Simulator(demo()); sim.tick(4);
  sim.graph.sunlight = 0.6; sim.tick(0);
  assert.equal(sim.state.D03.elapsed, 0);
  sim.graph.sunlight = 0.82; sim.tick(1);
  assert.equal(sim.state.M06.active, false);
  sim.tick(4); assert.equal(sim.state.M06.active, true);
});
test('motor peak demand is enforced and recovery is automatic', () => {
  const graph = demo(); graph.sunlight = 0.61;
  const sim = new Simulator(graph); sim.tick(5);
  assert.equal(sim.state.R05.active, true);
  assert.equal(sim.state.M06.status, 'Power blocked');
  sim.graph.sunlight = 0.9; sim.tick(0.1);
  assert.equal(sim.state.M06.status, 'Running');
});
test('fan-out consumes a shared source budget instead of duplicating energy', () => {
  const graph = demo(); graph.modules.push({ id: 'M07', type: 'motor', x: 1, y: 1, config: { peak: 20 } });
  graph.connections.push({ kind: 'power', from: 'R05', to: 'M07' });
  const sim = new Simulator(graph); sim.tick(5);
  assert.equal(sim.state.M06.active, true);
  assert.equal(sim.state.M07.status, 'Power blocked');
  assert.ok(Math.abs(sim.state.M07.available - 7.8) < 1e-9);
});
test('disconnected NOT and actuator fail inactive', () => {
  const graph = demo(); graph.connections = [];
  graph.modules.push({ id: 'N1', type: 'not', x: 0, y: 0, config: {} });
  const sim = new Simulator(graph); sim.tick(10);
  assert.equal(sim.state.N1.active, false); assert.equal(sim.state.M06.active, false);
});
test('empty patch works and serialized patch reload preserves configuration', () => {
  const graph = demo(); assert.deepEqual(new Simulator(JSON.parse(JSON.stringify(graph))).graph, graph);
  assert.equal(Object.keys(new Simulator({ ...graph, modules: [], connections: [] }).state).length, 0);
});
test('rejects duplicate IDs, unknown types, malformed config and unknown ports', () => {
  for (const mutate of [g => g.modules.push(g.modules[0]), g => g.modules[0].type = '__proto__', g => g.modules[1].config.threshold = NaN, g => g.connections[0].port = 'missing', g => g.sunlight = 2, g => g.modules[0].x = -1, g => g.modules[0].config.unrecognized = 2]) {
    const graph = demo(); mutate(graph); assert.throws(() => validateGraph(graph));
  }
});
test('rejects mismatched classes, multiply driven ports, invalid power wiring and cycles', () => {
  for (const connection of [
    { kind: 'signal', from: 'L01', port: 'light', to: 'D03', input: 'enable' },
    { kind: 'signal', from: 'T02', port: 'active', to: 'D03', input: 'enable' },
    { kind: 'power', from: 'L01', to: 'M06' },
    { kind: 'signal', from: 'R05', port: 'active', to: 'D03', input: 'enable' },
  ]) { const graph = demo(); graph.connections.push(connection); assert.throws(() => validateGraph(graph)); }
  const graph = demo(); graph.connections = [{ kind: 'signal', from: 'D03', port: 'active', to: 'R05', input: 'enable' }, { kind: 'signal', from: 'R05', port: 'active', to: 'D03', input: 'enable' }];
  assert.throws(() => validateGraph(graph), /Feedback/);
});
test('invalid time steps reject, bounded history and clean resets', () => {
  const sim = new Simulator(demo()); assert.throws(() => sim.tick(-1)); assert.throws(() => sim.tick(Infinity));
  for (let i = 0; i < 300; i++) sim.tick();
  assert.equal(sim.history.L01.length, 180); assert.ok(sim.events.length <= 100);
  sim.load(demo()); assert.equal(sim.time, 0); assert.equal(sim.energyWh, 0); assert.equal(sim.events.length, 0);
});
test('independent module array ordering still evaluates dependencies correctly', () => {
  const graph = demo(); graph.modules.reverse(); const sim = new Simulator(graph); sim.tick(5);
  assert.equal(sim.state.M06.active, true);
});

test('imported IDs cannot collide with inherited object properties', () => {
  const graph = demo(); graph.modules[0].id = 'constructor'; graph.connections[0].from = 'constructor';
  const sim = new Simulator(graph); sim.tick(5); assert.equal(sim.state.M06.active, true);
  assert.equal(sim.history.constructor.length, 2);
  graph.modules[0].type = ['light']; assert.throws(() => validateGraph(graph));
});
