import { displayNotice } from './alerts.mjs';
import { MODULE_GUIDES, createExperiment, explainFrame } from './portal.mjs';
import { Twin, mirrorfieldProject, validateProject, FAULTS, FAULT_TYPES } from './twin.mjs';
import { opticalBudget, routeRays } from './optics.mjs';
import { encodeLight, decodeLight, virtualBridge } from './latticelight.mjs';

const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const names = {solarskin:'SolarSkin',vector:'Optical vector',mirror:'Heliotropic cell',temperature:'Temperature',fusion:'Fusion',energy:'Energy controller',battery:'Battery',logic:'Logic',bridge:'Bridge',motor:'Motor'};
const configKeys = ['irradiance','azimuth','elevation','ambient','tracking','reflectivity','absorption','efficiency','routing','lighting','thresholdW','delayS','demandW','batteryWh'];
let project = mirrorfieldProject(), storageIssue = '';
try { const raw = localStorage.getItem('lattice.mirrorfield.v05'); if(raw) project = validateProject(JSON.parse(raw)); }
catch { storageIssue='Stored MIRRORFIELD project could not be read. A fresh virtual array is loaded.'; }
let twin = new Twin(project), selected = 'MF01', running = true, replay = null, activeTab = 'causality', timer;
const frame = () => twin.snapshot(replay ?? twin.frames.length-1);
function notice(message,error=false) { displayNotice($('notice'),message,error); }
function save() { try{localStorage.setItem('lattice.mirrorfield.v05',JSON.stringify(twin.project));$('save-status').textContent='Project saved on this device';}catch{$('save-status').textContent='Storage unavailable · export your project';} }
function syncControls() {
  for(const key of configKeys) { const el=$(key); if(el.type==='checkbox')el.checked=twin.project.config[key];else el.value=twin.project.config[key]; }
}
function buildArray() {
  $('array').innerHTML=twin.project.modules.map(m=>`<button class="cell family-${MODULE_GUIDES[m.passport.type][0]}" data-module="${m.id}" aria-label="Inspect ${names[m.passport.type]} ${m.id}"><b>${names[m.passport.type]}</b><small>${m.id}</small><strong></strong><span class="cell-state"></span></button>`).join('');
  $('overlay').innerHTML='<option value="">No overlay</option>'+twin.project.modules.map(m=>`<option value="${m.id}">${m.id} · ${names[m.passport.type]}</option>`).join('');
  $('topology-list').innerHTML=twin.topology().connections.map(c=>`<div class="link-row"><b>${c.from} ${c.kind==='bidirectional-power'?'⇄':'→'} ${c.to}</b><span>${c.kind}</span></div>`).join('');
  inspect();
}
function inspect() {
  const m=twin.project.modules.find(m=>m.id===selected);
  $('module-title').textContent=names[m.passport.type];
  $('module-description').textContent=MODULE_GUIDES[m.passport.type][1];
  $('module-purpose').textContent=MODULE_GUIDES[m.passport.type][2];
  document.querySelector('.inspect').dataset.family=MODULE_GUIDES[m.passport.type][0];$('module-id').textContent=`${selected} · ${names[m.passport.type]} / virtual module`;
  $('passport').textContent=JSON.stringify(m.passport,null,2);
  $('fault').innerHTML=FAULTS.filter(f=>f==='none'||FAULT_TYPES[f].includes(m.passport.type)).map(f=>`<option value="${f}">${f.replaceAll('_',' ')}</option>`).join('');
  $('fault').value=twin.faults[selected]??'none';
}
function cellValue(s, view) {
  if(view==='thermal')return `${s.temperature.toFixed(1)}°C`;
  if(view==='power')return `${s.watts.toFixed(2)} W`;
  if(s.type==='solarskin'||s.type==='energy')return `${s.watts.toFixed(2)} W`;
  if(s.type==='vector')return `${s.intensity.toFixed(0)} W/m²`;
  if(s.type==='temperature')return `${s.temperature.toFixed(1)}°C`;
  if(s.type==='mirror')return `${s.tilt.toFixed(0)}° tilt`;
  if(s.type==='battery')return `${(s.level*100).toFixed(1)}%`;
  if(s.type==='motor')return s.active?'ON':'OFF';
  if(s.type==='logic')return s.active?'TRUE':'FALSE';
  if(s.type==='fusion')return s.fusion?.safeToTrack?'TRACK':'HOLD';
  return 'VIRTUAL';
}
function renderScope(current) {
  const key=$('channel').value, overlay=$('overlay').value;
  const retained=twin.frames.filter(f=>f.id<=current.id).slice(-180);
  const series=[selected,...(overlay?[overlay]:[])].map(id=>({id,points:retained.map(f=>({t:f.time,value:f.states[id][key]})).filter(p=>typeof p.value==='number'||typeof p.value==='boolean')}));
  const values=series.flatMap(s=>s.points.map(p=>Number(p.value)));
  const min=Math.min(0,...values),max=Math.max(1,...values),start=retained[0]?.time??0,end=current.time;
  const colors=['#b8ccde','#d8b780'];
  $('scope-chart').innerHTML=series.map((s,i)=>`<polyline fill="none" stroke="${colors[i]}" stroke-width="2" points="${s.points.map(p=>`${30+(p.t-start)/Math.max(0.1,end-start)*550},${150-(Number(p.value)-min)/(max-min)*125}`).join(' ')}"/>`).join('')+`<text x="5" y="15" fill="#a0a8b2" font-size="10">${max.toFixed(2)}</text><text x="5" y="165" fill="#a0a8b2" font-size="10">${min.toFixed(2)}</text><text x="30" y="178" fill="#a0a8b2" font-size="10">${start.toFixed(1)}s → ${end.toFixed(1)}s</text>`;
  $('scope-caption').textContent=series.map((s,i)=>`${s.id} (${i?'amber':'silver'}): ${s.points.length?'recorded '+key:'channel unavailable'}`).join(' · ')+' · All readings simulated.';
}
function renderAnalysis(current) {
  if(activeTab==='causality') {
    $('reason').textContent=`${current.time.toFixed(1)} s · ${current.states.MF15.active?'Motor running':'Motor off'} · ${current.reason}`;
    const root=current.trace.find(s=>s.origin==='MF15'&&s.level==='L0');
    const needed=new Set();const visit=id=>{if(needed.has(id))return;needed.add(id);current.trace.find(s=>s.id===id)?.parents.forEach(visit);}; if(root)visit(root.id);
    $('trace').innerHTML=current.trace.filter(s=>needed.has(s.id)).map(s=>`<li><b>${s.origin}</b> · ${escape(s.transform)} <span>→ ${escape(typeof s.value==='object'?JSON.stringify(s.value):s.value)}</span><code>${s.id} · ${s.level}${s.unit?' / '+s.unit:''} · ${s.priority} · parents ${s.parents.join(', ')||'environment / local state'}</code></li>`).join('');
  }
  if(activeTab==='scope')renderScope(current);
  if(activeTab==='optics') {
    const t=current.totals;
    $('optical-ledger').innerHTML=[['Incident on four collection apertures',t.incident],['PV electrical (before controller interlock)',t.incident-t.heat-t.escaped],['Heat retained in stack',t.heat],['Reflected escape',t.escaped]].map(([k,v])=>`<div class="health-row"><span>${k}</span><span>${v.toFixed(3)} W</span></div>`).join('');
    $('tradeoffs').innerHTML=[0,0.25,0.5,0.75].map(r=>{if(r+current.config.absorption>1)return `<tr><td>${(r*100).toFixed(0)}%</td><td colspan="2">Unavailable: R + A exceeds 1</td></tr>`;const b=opticalBudget({...current.config,reflectivity:r,cosine:1,temperature:25});return `<tr><td>${(r*100).toFixed(0)}%</td><td>${b.electric.toFixed(3)} W</td><td>${b.heat.toFixed(3)} W</td></tr>`;}).join('');
    const rays=routeRays({angle:Number($('ray-angle').value)});$('ray-result').textContent=`${$('ray-angle').value}° · ${rays.hits} / ${rays.rays} rays intercepted · ${(rays.collectedFraction*100).toFixed(1)}% collected after assumed 85% reflectance.`;
  }
  if(activeTab==='sandbox') {
    $('checks').innerHTML=replay===null?twin.validateDeployment().checks.map(c=>`<div class="check-result"><b>${c.pass?'PASS':'BLOCK'}</b>${c.name}</div>`).join(''):'<p class="hint">Return to live to evaluate the current deployment sandbox.</p>';
  }
}
function render() {
  const current=frame(),view=$('view').value;
  const explanation=explainFrame(current);
  if($('outcome-title').textContent!==explanation.title)$('outcome-title').textContent=explanation.title;
  if($('outcome-detail').textContent!==explanation.detail)$('outcome-detail').textContent=explanation.detail;
  document.querySelector('.live-explanation').dataset.tone=explanation.tone;
  document.querySelectorAll('[data-preset]').forEach(button=>button.disabled=replay!==null);
  $('clock').textContent=`${current.time.toFixed(1)} s`;$('live-label').textContent=replay===null?'LIVE TWIN':'RECORDED FRAME';
  $('run').textContent=running?'Pause':'Run';$('run').disabled=replay!==null;$('step').disabled=running||replay!==null;
  $('timeline').max=twin.frames.length-1;$('timeline').value=replay??twin.frames.length-1;$('replay-time').textContent=`${current.time.toFixed(1)} s`;
  for(const key of configKeys)$(key).disabled=replay!==null;
  $('run-drill').disabled=replay!==null;$('inject').disabled=replay!==null;$('rearm').disabled=replay!==null;
  for(const key of ['irradiance','azimuth','elevation','reflectivity','routing'])$(`${key}-value`).textContent=key==='irradiance'?`${current.config[key]} W/m²`:['azimuth','elevation'].includes(key)?`${current.config[key]}°`:`${(current.config[key]*100).toFixed(0)}%`;
  $('orientation').textContent=`TILT ${current.states.MF03.tilt.toFixed(1)}° / ROT ${current.states.MF03.rotation.toFixed(1)}°`;
  const previous=twin.frames[Math.max(0,(replay??twin.frames.length-1)-1)];
  for(const m of twin.project.modules){const el=document.querySelector(`[data-module="${m.id}"]`),s=current.states[m.id];el.classList.toggle('selected',m.id===selected);el.classList.toggle('thermal',view==='thermal');el.classList.toggle('fault',(current.faults[m.id]??'none')!=='none'||s.temperature>=50);const changed=current.trace.some(signal=>signal.origin===m.id&&JSON.stringify(signal.value)!==JSON.stringify(previous?.trace.find(p=>p.origin===signal.origin&&p.transform===signal.transform)?.value));el.classList.toggle('lit',current.config.lighting!=='off'&&(current.config.lighting==='continuous'||changed));el.style.setProperty('--heat',String(Math.max(0,210-(s.temperature-20)*4)));el.querySelector('strong').textContent=cellValue(s,view);el.querySelector('.cell-state').textContent=s.status;}
  const t=current.totals;$('collected').textContent=`${t.collected.toFixed(2)} W`;$('battery').textContent=`${(current.states.MF11.level*100).toFixed(1)}%`;$('motor').textContent=`${t.motorW.toFixed(2)} W`;$('light-power').textContent=`${t.lightW.toFixed(3)} W`;
  const s=current.states[selected];
  $('health').innerHTML=[['State',s.status],['Power state',s.powerState],['Temperature',`${s.temperature.toFixed(2)} °C`],['Voltage',`${s.voltage.toFixed(2)} V`],['Current',`${s.current.toFixed(3)} A`],['Fault count',s.faultCount],['Communication',s.communication?'Virtual link available':'Unavailable'],['Uptime',`${s.uptime.toFixed(1)} s`],...(s.position!==undefined?[['Position',`${s.position.toFixed(1)}°`]]:[])].map(([k,v])=>`<div class="health-row"><span>${k}</span><span>${escape(v)}</span></div>`).join('');
  $('events').innerHTML=twin.events.filter(e=>e.time<=current.time).slice(0,20).map(e=>`<button class="event" ${e.frameId?`data-frame="${e.frameId}"`: 'disabled'}><time>${e.time.toFixed(1)}s · ${e.module} · ${e.priority}</time>${escape(e.message)}</button>`).join('')||'<p class="hint">No transitions yet.</p>';
  renderIncidents(current);
  renderAnalysis(current);
}
for(const key of configKeys)$(key).addEventListener('change',event=>{
  if(replay!==null)return;
  if(!event.target.reportValidity()||event.target.value===''){syncControls();return;}
  try{twin.configure(key,event.target.type==='checkbox'?event.target.checked:event.target.tagName==='SELECT'?event.target.value:Number(event.target.value));save();render();}
  catch(error){notice(error.message,true);syncControls();}
});
$('array').onclick=event=>{const id=event.target.closest('[data-module]')?.dataset.module;if(id){selected=id;inspect();render();}};
$('run').onclick=()=>{running=!running;render();};$('step').onclick=()=>{twin.step(.1);render();};
$('reset').onclick=()=>{twin.load(twin.project);replay=null;inspect();render();};
$('timeline').oninput=event=>{running=false;replay=Number(event.target.value);render();};$('live').onclick=()=>{replay=null;render();};
$('view').onchange=render;$('channel').onchange=render;$('overlay').onchange=render;$('ray-angle').oninput=render;
const tabs=[...document.querySelectorAll('[data-tab]')];
function showTab(button){activeTab=button.dataset.tab;for(const b of tabs){b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;$(b.dataset.tab).hidden=b!==button;}render();}
tabs.forEach((button,i)=>{button.tabIndex=button.dataset.tab==='causality'?0:-1;button.onclick=()=>showTab(button);button.onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;showTab(tabs[next]);tabs[next].focus();};});
$('inject').onclick=()=>{try{twin.inject(selected,$('fault').value);render();}catch(error){notice(error.message,true);}};
$('rearm').onclick=()=>{twin.rearm();render();};
$('events').onclick=event=>{const id=Number(event.target.closest('[data-frame]')?.dataset.frame);if(!id)return;const index=twin.frames.findIndex(f=>f.id===id);if(index<0){notice('This event is older than the retained frame window.');return;}running=false;replay=index;showTab(tabs.find(tab=>tab.dataset.tab==='causality'));};
function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export').onclick=()=>download('mirrorfield-project.json',twin.project);
$('export-run').onclick=()=>download('mirrorfield-run.json',{version:'0.5.0',status:'SIMULATED',project:twin.project,topology:twin.topology(),frames:twin.frames,events:twin.events,incidents:twin.incidents.export()});
$('import').onclick=()=>$('file').click();$('file').onchange=async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>1000000)throw new Error('Project file exceeds 1 MB.');const next=validateProject(JSON.parse(await file.text()));twin.load(next);replay=null;save();syncControls();buildArray();render();notice('Project imported. Simulation restarted.');}catch(error){notice(`Import failed: ${error.message}`,true);}event.target.value='';};
$('send-optical').onclick=()=>{try{const symbols=encodeLight($('optical-message').value);const received=decodeLight(symbols,{obstructed:$('obstructed').checked});$('diagnostic-result').textContent=JSON.stringify({transport:'virtual optical',symbols:symbols.length,crc:'passed',received},null,2);}catch(error){$('diagnostic-result').textContent=error.message;notice(error.message,true);}};
$('send-bridge').onclick=()=>{try{$('diagnostic-result').textContent=JSON.stringify(virtualBridge({version:'0.5.0',operation:'diagnostic',payload:$('optical-message').value}),null,2);}catch(error){$('diagnostic-result').textContent=error.message;notice(error.message,true);}};
document.querySelectorAll('[data-preset]').forEach(button=>button.onclick=()=>{
  const next=createExperiment(twin.project,button.dataset.preset);
  twin.load(next);replay=null;running=true;save();syncControls();buildArray();render();
  notice('Experiment loaded. The clock, battery and injected faults have been reset.');
});
syncControls();buildArray();render();if(storageIssue){$('save-status').textContent='Stored project unavailable';notice(storageIssue,true);}
setInterval(()=>{if(running&&replay===null&&!document.hidden){twin.step(.1);render();}},100);

function renderIncidents(current){
  const active=current.incidents??[],critical=active.filter(i=>i.severity==='critical');
  $('incident-count').textContent=active.length;
  $('incident-banner').hidden=!active.length;
  $('incident-banner').dataset.severity=critical.length?'critical':'warning';
  const title=critical.length?`SYSTEM FAULT · ${critical.length} critical incident${critical.length===1?'':'s'}`:`ATTENTION · ${active.length} active warning${active.length===1?'':'s'}`;
  if($('incident-headline').textContent!==title)$('incident-headline').textContent=title;
  $('incident-summary').textContent=active.length?`${replay===null?'Live simulation':'Recorded state'} · ${active.map(i=>i.title).slice(0,3).join(' / ')}. Open the fault center for evidence and recovery steps.`:'';
  const entries=replay===null?twin.incidents.export():active;
  const shown=entries.filter(i=>$('incident-filter').value==='all'||i.resolvedAt===null);
  const signature=JSON.stringify([shown,replay!==null]);
  if($('incident-list').dataset.signature===signature)return;
  $('incident-list').dataset.signature=signature;
  $('incident-list').innerHTML=shown.map(i=>`<article class="incident-row" data-severity="${i.severity}" data-resolved="${i.resolvedAt!==null}"><small>${i.id} · ${i.severity.toUpperCase()} · opened ${i.openedAt.toFixed(1)}s</small><h3>${escape(i.title)}</h3><p>${escape(i.recovery)}</p><small>${i.resolvedAt===null?'ACTIVE':`RESOLVED at ${i.resolvedAt.toFixed(1)}s`} · ${i.acknowledgedAt===null?'Not acknowledged':`Acknowledged at ${i.acknowledgedAt.toFixed(1)}s`}</small><div><button data-incident-module="${i.module}">Inspect ${i.module}</button><button data-ack="${i.id}" ${replay!==null||i.acknowledgedAt!==null||i.resolvedAt!==null?'disabled':''}>Acknowledge</button></div><details><summary>Evidence when first detected</summary><pre>${escape(JSON.stringify(i.evidence,null,2))}</pre></details></article>`).join('')||'<p class="incident-empty">✓ No faults in this view. Ordinary low light and startup delays are not system errors.</p>';
}
$('incident-filter').onchange=()=>render();
$('review-incidents').onclick=()=>{showTab(tabs.find(t=>t.dataset.tab==='incidents'));$('incidents').scrollIntoView({block:'start'});};
$('incident-list').onclick=event=>{const module=event.target.closest('[data-incident-module]')?.dataset.incidentModule;if(module){selected=module;inspect();render();document.querySelector('.inspect').scrollIntoView({block:'start'});}const id=event.target.closest('[data-ack]')?.dataset.ack;if(id&&replay===null){try{twin.incidents.acknowledge(id,twin.time);twin.step(0);render();}catch(error){notice(error.message,true);}}};
$('run-drill').onclick=()=>{if(replay!==null)return;const drills={short:['MF15','short_circuit'],link:['MF14','communication'],heat:['MF15','overheating'],solar:['MF01','solar_collapse']};const [id,fault]=drills[$('fault-drill').value];twin.inject(id,fault);selected=id;inspect();render();};
$('export-incidents').onclick=()=>download('lattice-incidents.json',{version:'0.5.0',source:'simulation',exportedAt:new Date().toISOString(),simulationTime:twin.time,incidents:twin.incidents.export()});
window.addEventListener('error',event=>{running=false;notice(`Simulation paused: ${event.message}. Reload the page if it cannot recover.`,true);});
window.addEventListener('unhandledrejection',()=>{running=false;notice('An operation could not finish. The simulation is paused. Export your project if possible, then reload.',true);});
