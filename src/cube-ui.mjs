import { SignalCube,SENSORS,DEFAULT_ROUTE } from './signal-cube.mjs';
import { displayNotice } from './alerts.mjs';
const el=id=>document.getElementById(id);
let route=DEFAULT_ROUTE,loadError=false;
try{const saved=localStorage.getItem('lattice.cube.route');if(saved)route=JSON.parse(saved);new SignalCube(route);}catch{route=DEFAULT_ROUTE;loadError=true;}
const cube=new SignalCube(route);let running=false;
function inform(message,error=false){displayNotice(el('notice'),message,error);}
function sync(){el('cube-source').value=cube.route.sensor;el('cube-window').value=cube.route.window;el('cube-threshold').value=cube.route.threshold;el('cube-destination').value=cube.route.destination;const s=SENSORS[cube.route.sensor];el('cube-value').min=s.min;el('cube-value').max=s.max;el('cube-value').step=cube.route.sensor==='vibration'?.1:1;el('cube-value').value=s.default;el('cube-threshold').min=s.min;el('cube-threshold').max=s.max;el('cube-unit').textContent=s.unit;}
function render(){
  const online=el('cube-online').checked;
  el('cube-run').textContent=running?'Pause stream':'Start stream';
  el('cube-reading').textContent=cube.last?`${cube.last.value.toFixed(2)} ${cube.last.unit}`:'Ready';
  el('cube-state').textContent=!online?'DESTINATION OFFLINE':running?'ROUTING LIVE':'STREAM PAUSED';
  el('cube-body').dataset.state=online?'online':'offline';
  el('cube-explanation').textContent=!online?`The local destination is unavailable. ${cube.queue.length} messages are waiting; messages expire after five seconds. Restore the destination to deliver fresh messages.`:cube.last?(cube.last.passed?`The smoothed reading passed the ${cube.route.threshold} ${cube.last.unit} threshold with local ${cube.route.destination} selected. Delivered messages appear below.`:`The smoothed reading did not exceed ${cube.route.threshold} ${cube.last.unit}. The cube withheld this sample.`):'Choose a sensor, adjust the sample value and send it through the cube. This demonstration runs separately from the array below.';
  el('cube-counts').textContent=`${cube.counts.sampled} sampled · ${cube.counts.filtered} filtered · ${cube.counts.delivered} delivered · ${cube.queue.length} queued · ${cube.counts.dropped} dropped`;
  const monitor=cube.receipts.find(p=>p.destination==='monitor');el('cube-monitor').textContent=monitor?`${monitor.value.toFixed(2)} ${monitor.unit} / ${monitor.source}`:'No message delivered to the monitor yet.';
  const logs=cube.receipts.filter(p=>p.destination==='recorder');el('cube-log').textContent=logs.length?logs.slice(0,6).map(p=>`${p.id}  ${p.value.toFixed(2)} ${p.unit}  (${p.samples}-sample mean)`).join('\n'):'No message delivered to the recorder yet.';
  el('cube-packet').textContent=cube.receipts[0]?JSON.stringify(cube.receipts[0],null,2):'Send a sample to inspect the resulting packet.';
}
function sample(){try{if(!el('cube-value').reportValidity()||el('cube-value').value==='')throw new Error('Enter a valid sensor reading.');cube.sample(Number(el('cube-value').value),performance.now(),el('cube-online').checked);render();}catch(error){running=false;inform(error.message,true);render();}}
el('cube-apply').onclick=()=>{try{if(!el('cube-threshold').reportValidity()||el('cube-threshold').value==='')throw new Error('Enter a valid threshold.');const next={sensor:el('cube-source').value,window:Number(el('cube-window').value),threshold:Number(el('cube-threshold').value),destination:el('cube-destination').value};cube.configure(next);try{localStorage.setItem('lattice.cube.route',JSON.stringify(next));}catch{inform('Route applied, but browser storage is unavailable. It will not survive reload.',true);}sync();render();}catch(error){inform(error.message,true);}};
el('cube-source').onchange=()=>{const s=SENSORS[el('cube-source').value];el('cube-threshold').min=s.min;el('cube-threshold').max=s.max;el('cube-threshold').value=s.min;};
el('cube-send').onclick=sample;el('cube-run').onclick=()=>{running=!running;if(running)sample();else render();};
el('cube-online').onchange=()=>{cube.flush(performance.now(),el('cube-online').checked);render();};
el('cube-export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(cube.export(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='lattice-cube-session.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
sync();render();if(loadError)inform('The saved cube route was invalid or unavailable. Default settings were loaded.',true);
setInterval(()=>{if(document.hidden)return;if(running)sample();else{cube.flush(performance.now(),el('cube-online').checked);render();}},1000);
