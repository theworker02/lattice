import { displayNotice } from './alerts.mjs';
import { CATALOG, Simulator, demo, validateGraph } from './engine.mjs';

const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const icons = { solar: '◈', light: '☼', threshold: '>', compare: '≥', delay: '◷', and: '&', not: '¬', relay: '⌁', motor: '↻' };
let initial = demo(), storageError = '';
try { const saved = localStorage.getItem('lattice.patch.v1'); if (saved) initial = validateGraph(JSON.parse(saved)); }
catch { storageError = 'Saved patch could not be read. The example is loaded; storage will be retried when you edit.'; }
let sim = new Simulator(initial), selected = initial.modules.find(m => m.type === 'solar')?.id ?? initial.modules[0]?.id;
let playing = true, drag = null, noticeTimer;
function notice(message,error=false) { displayNotice($('notice'),message,error); }
function save() {
  try { localStorage.setItem('lattice.patch.v1', JSON.stringify(sim.graph)); $('save-status').textContent = 'Saved on this device'; }
  catch { $('save-status').textContent = 'Storage unavailable · export to keep your patch'; }
}
function edit(change) {
  const graph = structuredClone(sim.graph);
  try { change(graph); validateGraph(graph); sim.load(graph); save(); renderStructure(); renderLive(); }
  catch (error) { notice(error.message,true); }
}
function valueFor(m, s) {
  if (m.type === 'solar') return `${s.watts.toFixed(1)} W`;
  if (m.type === 'light') return `${Math.round(sim.graph.sunlight * 100)}%`;
  if (m.type === 'threshold') return s.active ? 'TRUE' : 'FALSE';
  if (m.type === 'delay') return `${Math.min(s.elapsed, m.config.seconds).toFixed(1)} / ${m.config.seconds}s`;
  if (m.type === 'relay') return s.active ? 'CLOSED' : 'OPEN';
  if (m.type === 'motor') return s.active ? 'ON' : 'OFF';
  return s.active ? 'TRUE' : 'FALSE';
}
function renderStructure() {
  document.querySelector('h1').textContent = sim.graph.name;
  $('sun').value = sim.graph.sunlight * 100;
  const maxX = Math.max(990, ...sim.graph.modules.map(m => m.x + 220));
  const maxY = Math.max(505, ...sim.graph.modules.map(m => m.y + 160));
  $('board').style.width = `${maxX}px`; $('board').style.height = `${maxY}px`;
  $('modules').innerHTML = sim.graph.modules.map(m => `<article class="module" id="module-${m.id}" style="left:${m.x}px;top:${m.y}px"><button class="module-handle" data-drag="${m.id}" title="Drag to move, or use arrow keys">${icons[m.type]} ${escape(CATALOG[m.type].name)}<small>${m.id}</small></button><button class="module-body" data-select="${m.id}" aria-label="Inspect ${m.id}"><span class="module-value"></span><span class="module-status"></span></button><i class="port left"></i><i class="port right"></i></article>`).join('');
  $('connection-list').innerHTML = sim.graph.connections.map((c, i) => `<div class="connection-row"><span class="kind ${c.kind}">${c.kind}</span><span>${escape(c.from)}${c.port ? ` / ${escape(c.port)}` : ''} → ${escape(c.to)}${c.input ? ` / ${escape(c.input)}` : ''}</span><button data-disconnect="${i}" aria-label="Remove connection ${i + 1}">×</button></div>`).join('') || '<p class="muted">No connections. Choose ports above to wire your first module.</p>';
  connectionOptions(); inspector();
}
function connectionOptions() {
  const kind = $('kind').value;
  for (const [element, direction] of [['from', 'outputs'], ['to', 'inputs']]) {
    $(element).innerHTML = sim.graph.modules.flatMap(m => {
      const spec = CATALOG[m.type];
      const ports = kind === 'signal' ? spec[direction] : spec[element === 'from' ? 'powerOut' : 'powerIn'] ? ['power'] : [];
      return ports.map(p => `<option value="${m.id}:${p}">${m.id} · ${escape(spec.name)} / ${p}</option>`);
    }).join('');
  }
  $('connect').querySelector('button').disabled = !$('from').value || !$('to').value;
}
function inspector() {
  const m = sim.graph.modules.find(m => m.id === selected);
  $('remove').disabled = !m;
  if (!m) { $('inspect-title').textContent = 'Select a module'; $('inspect-meta').textContent = 'Add a module from the library to begin.'; $('settings').innerHTML = ''; $('discovery').textContent = ''; return; }
  const spec = CATALOG[m.type];
  $('inspect-title').textContent = spec.name;
  $('inspect-meta').textContent = `${m.id} / LATTICE ${spec.family}`;
  const labels = { capacity: 'Solar capacity at full sunlight (W)', threshold: 'Threshold · normalized 0–1', thresholdW: 'Power threshold (W)', seconds: 'Continuous on-delay (seconds)', peak: 'Motor peak demand (W)' };
  const limits = { capacity: [0, 10000, 1], threshold: [0, 1, 0.01], thresholdW: [0, 10000, 0.1], seconds: [0, 3600, 0.1], peak: [0.1, 10000, 0.1] };
  $('settings').innerHTML = Object.entries(m.config).map(([key, value]) => `<label class="setting">${labels[key]}<input type="number" data-config="${key}" value="${value}" min="${limits[key][0]}" max="${limits[key][1]}" step="${limits[key][2]}"></label>`).join('') + '<p class="muted">Patch edits restart simulation time. Drag module headers to arrange, or focus a header and use arrow keys.</p>';
  $('discovery').textContent = JSON.stringify({ id: m.id, type: m.type, family: spec.family, transport: 'virtual', inputs: spec.inputs, outputs: spec.outputs, power: { input: !!spec.powerIn, output: !!spec.powerOut } }, null, 2);
}
function renderLive() {
  $('clock').textContent = `${Math.floor(sim.time / 60).toString().padStart(2, '0')}:${(sim.time % 60).toFixed(1).padStart(4, '0')}`;
  $('sun-value').textContent = `${Math.round(sim.graph.sunlight * 100)}%`;
  $('generation').textContent = `${sim.graph.modules.filter(m => m.type === 'solar').reduce((sum, m) => sum + sim.state[m.id].watts, 0).toFixed(1)} W`;
  $('energy').textContent = `${sim.energyWh.toFixed(3)} Wh`;
  for (const m of sim.graph.modules) {
    const el = $(`module-${m.id}`), s = sim.state[m.id];
    el.classList.toggle('selected', m.id === selected); el.classList.toggle('active', s.active); el.classList.toggle('blocked', s.status === 'Power blocked');
    el.querySelector('.module-value').textContent = valueFor(m, s);
    el.querySelector('.module-status').textContent = `${s.status} · ${CATALOG[m.type].family}`;
  }
  $('wires').innerHTML = sim.graph.connections.map(c => {
    const a = sim.graph.modules.find(m => m.id === c.from), b = sim.graph.modules.find(m => m.id === c.to);
    const x1 = a.x + 180, y1 = a.y + 66, x2 = b.x, y2 = b.y + 66;
    const live = c.kind === 'power' ? sim.state[c.from].watts > 0 : Boolean(sim.state[c.from].outputs[c.port]?.value);
    return `<path class="wire ${c.kind} ${live && playing ? 'live' : ''}" d="M${x1} ${y1} C${x1 + 60} ${y1},${x2 - 60} ${y2},${x2} ${y2}"/>`;
  }).join('');
  const m = sim.graph.modules.find(m => m.id === selected);
  if (m) {
    const s = sim.state[m.id];
    $('reading').innerHTML = `${escape(valueFor(m, s))}<small>${escape(s.status)}${m.type === 'motor' ? ` · Peak ${m.config.peak.toFixed(1)} W / available ${(s.available ?? 0).toFixed(1)} W` : ''}</small>`;
    const points = sim.history[m.id], min = Math.min(0, ...points.map(p => p.value)), max = Math.max(1, ...points.map(p => p.value));
    $('scope').innerHTML = `<polyline fill="none" stroke="#a8b9fc" stroke-width="2" points="${points.map((p, i) => `${i / Math.max(1, points.length - 1) * 250 + 5},${85 - (p.value - min) / (max - min) * 75}`).join(' ')}"/><text x="6" y="12" fill="#8f98a8" font-size="9">${max.toFixed(1)}</text><text x="6" y="93" fill="#8f98a8" font-size="9">${min.toFixed(1)} · last ${((points.at(-1)?.time ?? 0) - (points[0]?.time ?? 0)).toFixed(1)}s · simulation time</text>`;
  } else { $('reading').textContent = '—'; $('scope').innerHTML = ''; }
  $('event-count').textContent = sim.events.length;
  $('events').innerHTML = sim.events.slice(0, 20).map(e => `<div class="event"><time>${e.time.toFixed(1)}s · ${e.module}</time>${escape(e.message)}</div>`).join('') || '<p class="muted">Waiting for a state change. Adjust sunlight or step the clock.</p>';
}

let lastFamily = '';
$('catalog').innerHTML = Object.entries(CATALOG).map(([type, spec]) => {
  const heading = spec.family !== lastFamily ? `<div class="family">${spec.family}</div>` : ''; lastFamily = spec.family;
  return `${heading}<button class="catalog-item" data-add="${type}"><span>${icons[type]}</span>${spec.name}<span>+</span></button>`;
}).join('');
$('catalog').addEventListener('click', event => {
  const type = event.target.closest('[data-add]')?.dataset.add;
  if (!type) return;
  edit(g => { let n = 1; while (g.modules.some(m => m.id === `N${n}`)) n++; selected = `N${n}`; g.modules.push({ id: selected, type, x: 70 + g.modules.length % 4 * 220, y: 520 + Math.floor(g.modules.length / 4) * 155, config: { ...CATALOG[type].defaults } }); });
  $(`module-${selected}`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
});
$('modules').addEventListener('click', event => { const id = event.target.closest('[data-select]')?.dataset.select; if (id) { selected = id; inspector(); renderLive(); } });
$('modules').addEventListener('pointerdown', event => {
  const handle = event.target.closest('[data-drag]'); if (!handle || event.button !== 0) return;
  const m = sim.graph.modules.find(m => m.id === handle.dataset.drag); selected = m.id;
  drag = { id: m.id, startX: event.clientX, startY: event.clientY, x: m.x, y: m.y, handle };
  handle.setPointerCapture(event.pointerId); inspector(); renderLive();
});
$('modules').addEventListener('pointermove', event => {
  if (!drag) return;
  const m = sim.graph.modules.find(m => m.id === drag.id);
  m.x = Math.round(Math.max(0, Math.min(2000, drag.x + event.clientX - drag.startX)));
  m.y = Math.round(Math.max(0, Math.min(2000, drag.y + event.clientY - drag.startY)));
  const el = $(`module-${m.id}`); el.style.left = `${m.x}px`; el.style.top = `${m.y}px`; renderLive();
});
for (const type of ['pointerup', 'pointercancel']) $('modules').addEventListener(type, () => { if (drag) { drag = null; save(); renderStructure(); renderLive(); } });
$('modules').addEventListener('keydown', event => {
  const id = event.target.closest('[data-drag]')?.dataset.drag;
  const delta = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }[event.key];
  if (!id || !delta) return; event.preventDefault();
  const m = sim.graph.modules.find(m => m.id === id); m.x = Math.max(0, Math.min(2000, m.x + delta[0])); m.y = Math.max(0, Math.min(2000, m.y + delta[1]));
  save(); renderStructure(); renderLive(); document.querySelector(`[data-drag="${id}"]`).focus();
});
$('settings').addEventListener('change', event => {
  const key = event.target.dataset.config; if (!key) return;
  const input = event.target;
  if (!input.reportValidity() || input.value === '') { inspector(); return; }
  edit(g => g.modules.find(m => m.id === selected).config[key] = Number(input.value));
});
$('remove').onclick = () => edit(g => { g.modules = g.modules.filter(m => m.id !== selected); g.connections = g.connections.filter(c => c.from !== selected && c.to !== selected); selected = g.modules[0]?.id; });
$('kind').onchange = connectionOptions;
$('connect').onsubmit = event => {
  event.preventDefault(); const [from, port] = $('from').value.split(':'), [to, input] = $('to').value.split(':');
  edit(g => g.connections.push({ kind: $('kind').value, from, to, ...($('kind').value === 'signal' ? { port, input } : {}) }));
};
$('connection-list').onclick = event => { const button = event.target.closest('[data-disconnect]'); if (button) edit(g => g.connections.splice(Number(button.dataset.disconnect), 1)); };
$('sun').oninput = event => { sim.graph.sunlight = Number(event.target.value) / 100; sim.tick(0); save(); renderLive(); };
$('play').onclick = () => { playing = !playing; $('play').textContent = playing ? 'Pause' : 'Run'; $('step').disabled = playing; renderLive(); };
$('step').onclick = () => { sim.tick(0.1); renderLive(); };
$('reset').onclick = () => { sim.load(sim.graph); renderLive(); };
$('demo').onclick = () => { sim.load(demo()); selected = 'S04'; save(); renderStructure(); renderLive(); notice('Example loaded. Export your patch before replacing it to keep a separate copy.'); };
$('export').onclick = () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(sim.graph, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = 'lattice-patch.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$('import').onclick = () => $('file').click();
$('file').onchange = async event => {
  const file = event.target.files[0]; if (!file) return;
  try { if (file.size > 1_000_000) throw new Error('Patch files must be smaller than 1 MB.'); const graph = validateGraph(JSON.parse(await file.text())); sim.load(graph); selected = graph.modules[0]?.id; save(); renderStructure(); renderLive(); notice('Patch imported.'); }
  catch (error) { notice(`Import failed: ${error.message}`,true); }
  event.target.value = '';
};
$('step').disabled = playing;
renderStructure(); renderLive();
if (storageError) { $('save-status').textContent = 'Saved patch unavailable'; notice(storageError,true); }
setInterval(() => { if (playing && !document.hidden) { sim.tick(0.1); renderLive(); } }, 100);
