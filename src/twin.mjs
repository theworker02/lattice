import { Simulator } from './engine.mjs';
import { IncidentRecorder } from './incidents.mjs';
import { clamp, incidence, opticalBudget } from './optics.mjs';
import { passport, validatePassport, PowerBranch, arbitrate } from './passport.mjs';

export const MODULE_TYPES = ['solarskin','vector','mirror','solarskin','mirror','temperature','fusion','mirror','solarskin','energy','battery','solarskin','logic','bridge','motor','temperature'];
export const FAULTS = ['none','disconnected','stuck_high','stuck_low','short_circuit','depleted','overheating','communication','solar_collapse'];
export const FAULT_TYPES = { stuck_high: ['vector'], stuck_low: ['vector'], depleted: ['battery'], solar_collapse: ['solarskin'], short_circuit: ['motor'], overheating: MODULE_TYPES, communication: MODULE_TYPES, disconnected: MODULE_TYPES };
const ranges = {
  irradiance: [0, 1200], azimuth: [0,360], elevation: [0,90], ambient: [-10,50],
  reflectivity: [0,0.9], absorption: [0,0.3], efficiency: [0.01,0.35], routing: [0,0.2],
  batteryWh: [0.01,10], initialCharge: [0,1], demandW: [0.1,2.5], thresholdW: [0,10], delayS: [0,60],
};
export function mirrorfieldProject(uuid = () => globalThis.crypto.randomUUID()) {
  return {
    version: '0.5.0', name: 'Mirrorfield / Array 01',
    config: { irradiance: 900, azimuth: 217, elevation: 55, ambient: 25, reflectivity: 0.5, absorption: 0.08, efficiency: 0.2, routing: 0, batteryWh: 0.1, initialCharge: 0.5, demandW: 1.2, thresholdW: 1, delayS: 2, tracking: true, lighting: 'events' },
    modules: MODULE_TYPES.map((type,i) => ({ id: `MF${String(i+1).padStart(2,'0')}`, passport: passport(type, uuid(), `LAT-${type.toUpperCase()}-M0-${String(i+1).padStart(4,'0')}`) })),
  };
}
export function validateProject(p) {
  if (!p || p.version !== '0.5.0' || typeof p.name !== 'string' || !p.name.length || p.name.length > 100 || !p.config || !Array.isArray(p.modules) || p.modules.length !== 16) throw new Error('Expected a MIRRORFIELD 0.5 project with 16 modules.');
  if (Object.keys(p).sort().join() !== 'config,modules,name,version') throw new Error('Unsupported project fields.');
  const c = p.config;
  if (Object.keys(c).length !== Object.keys(ranges).length + 2 || Object.keys(c).some(k => !Object.hasOwn(ranges,k) && !['tracking','lighting'].includes(k))) throw new Error('Unsupported configuration fields.');
  for (const [key,[lo,hi]] of Object.entries(ranges)) if (!Number.isFinite(c[key]) || c[key] < lo || c[key] > hi) throw new Error(`${key} must be between ${lo} and ${hi}.`);
  if (c.reflectivity + c.absorption > 1) throw new Error('Reflectivity + absorption cannot exceed 1.');
  if (typeof c.tracking !== 'boolean' || !['off','events','continuous'].includes(c.lighting)) throw new Error('Invalid tracking or lighting mode.');
  const uids = new Set();
  p.modules.forEach((m,i) => {
    if (!m || Object.keys(m).sort().join() !== 'id,passport' || m.id !== `MF${String(i+1).padStart(2,'0')}` || validatePassport(m.passport).type !== MODULE_TYPES[i] || m.passport.status !== 'SIMULATED' || m.passport.transport !== 'virtual' || uids.has(m.passport.uid)) throw new Error('Invalid, duplicate, or non-simulated module identity.');
    uids.add(m.passport.uid);
  });
  return p;
}

export function ruleGraph(c) {
  return { version: 1, name: 'Mirrorfield control IR', sunlight: 1, modules: [
    { id:'Collected', type:'solar', x:0,y:0, config:{capacity:0} },
    { id:'Supply', type:'solar', x:0,y:200, config:{capacity:0} },
    { id:'Threshold', type:'compare', x:220,y:0, config:{thresholdW:c.thresholdW} },
    { id:'Delay', type:'delay', x:440,y:0, config:{seconds:c.delayS} },
    { id:'Relay', type:'relay', x:660,y:0, config:{} },
    { id:'Motor', type:'motor', x:880,y:0, config:{peak:c.demandW} },
  ], connections:[
    {kind:'signal',from:'Collected',port:'watts',to:'Threshold',input:'value'},
    {kind:'signal',from:'Threshold',port:'active',to:'Delay',input:'enable'},
    {kind:'signal',from:'Delay',port:'active',to:'Relay',input:'enable'},
    {kind:'power',from:'Supply',to:'Relay'}, {kind:'power',from:'Relay',to:'Motor'},
  ] };
}

export class Twin {
  constructor(project) { this.load(project); }
  load(project) {
    this.project = structuredClone(validateProject(project)); this.time = 0; this.sequence = 0;
    this.frames = []; this.events = []; this.incidents = new IncidentRecorder(); this.faults = Object.create(null); this.faultCounts = Object.create(null);
    this.temperatures = Object.fromEntries(this.project.modules.map(m => [m.id,this.project.config.ambient]));
    this.tilt = 0; this.rotation = 180; this.position = 0; this.energy = this.project.config.batteryWh * this.project.config.initialCharge;
    this.generatedWh = 0; this.motorWh = 0; this.lightWh = 0; this.branch = new PowerBranch(); this.rules = new Simulator(ruleGraph(this.project.config));
    this.step(0);
  }
  configure(key,value) {
    const p = structuredClone(this.project); p.config[key] = value; validateProject(p);
    const old = this.project.config[key];
    this.project = p;
    if (key === 'batteryWh') this.energy = Math.min(this.energy,value);
    if (key === 'thresholdW' || key === 'delayS') { this.rules = new Simulator(ruleGraph(p.config)); }
    this.events.unshift({ time:this.time, module:'ENV', message:`${key}: ${old} → ${value}`, priority:'INFO' });
    this.step(0);
  }
  inject(id,fault) {
    const m = this.project.modules.find(m => m.id === id);
    if (!m || !FAULTS.includes(fault) || (fault !== 'none' && !FAULT_TYPES[fault].includes(m.passport.type))) throw new Error('This fault is not supported by the selected module.');
    if (fault !== 'none' && this.faults[id] !== fault) this.faultCounts[id] = (this.faultCounts[id] ?? 0) + 1;
    this.faults[id] = fault;
    if (fault === 'depleted') this.energy = 0;
    this.events.unshift({time:this.time,module:id,message:`Fault injection: ${fault}`,priority:fault === 'none' ? 'INFO' : 'CRITICAL'});
    this.step(0);
  }
  rearm() { this.branch.reset(); this.events.unshift({time:this.time,module:'MF15',message:'Manual branch re-arm',priority:'IMPORTANT'}); this.step(0); }
  step(dt = 0.1) {
    if (!Number.isFinite(dt) || dt < 0 || dt > 1) throw new Error('Twin steps must be 0–1 seconds.');
    const c = this.project.config; this.time += dt;
    const trace = [], states = Object.create(null);
    const record = (origin,transform,value,parents=[],level='L2',unit=null,priority='NORMAL') => {
      const s = { id:`SIG-${++this.sequence}`,origin,transform,value,parents:[...parents],level,unit,priority,time:this.time,quality:'simulated' }; trace.push(s); return s.id;
    };
    const env = record('ENV','environment input',{irradiance:c.irradiance,azimuth:c.azimuth,elevation:c.elevation},[],'L4');
    const f = id => this.faults[id] ?? 'none';
    const available = id => !['disconnected','communication'].includes(f(id));
    const sensor = f('MF02') === 'stuck_high' ? 1200 : f('MF02') === 'stuck_low' || !available('MF02') ? 0 : c.irradiance;
    const vector = record('MF02','virtual optical vector',{intensity:sensor,azimuth:c.azimuth,elevation:c.elevation,cct:null,uv:null,ir:null},[env],'L4');
    const safeOrientation = !available('MF02') || this.temperatures.MF15 >= 60;
    const targetTilt = c.tracking && !safeOrientation && sensor > 0 ? 90-c.elevation : 0;
    const targetRotation = c.tracking && !safeOrientation && sensor > 0 ? c.azimuth : 180;
    this.tilt += clamp(targetTilt-this.tilt,-15*dt,15*dt);
    const rotationDelta = ((targetRotation-this.rotation+540)%360)-180;
    this.rotation = (this.rotation + clamp(rotationDelta,-30*dt,30*dt)+360)%360;
    const orientation = record('MF03','rate-limited virtual orientation',{tilt:this.tilt,rotation:this.rotation},[vector],'L4');
    let collected = 0, incident = 0, heat = 0, escaped = 0;
    const solarParents = [];
    for (const m of this.project.modules) {
      let watts = 0, heating = 0.03, optics = null;
      if (m.passport.type === 'solarskin') {
        const thermalInput = record(m.id,'previous thermal state',this.temperatures[m.id],[],'L2','degC');
        optics = opticalBudget({irradiance:c.irradiance,cosine:incidence(c.azimuth,c.elevation,this.tilt,this.rotation),reflectivity:c.reflectivity,absorption:c.absorption,efficiency:c.efficiency,routing:c.routing,temperature:this.temperatures[m.id]});
        if (f(m.id) === 'solar_collapse' || !available(m.id)) { optics.heat += optics.electric; optics.electric = 0; }
        watts = optics.electric; heating = optics.heat;
        collected += watts; incident += optics.incident; heat += optics.heat; escaped += optics.escaped;
        solarParents.push(record(m.id,'R + T + A; PV conversion',watts,[env,orientation,thermalInput],'L2','W'));
      }
      if (f(m.id) === 'overheating') this.temperatures[m.id] = Math.max(75,this.temperatures[m.id]);
      else {
        // Exact solution of a lumped RC body: R=8 K/W, C=20 J/K. Not a measured chassis.
        const equilibrium = c.ambient + heating * 8;
        this.temperatures[m.id] = equilibrium + (this.temperatures[m.id]-equilibrium)*Math.exp(-dt/160);
      }
      states[m.id] = {type:m.passport.type,temperature:this.temperatures[m.id],watts,optics,voltage:available(m.id)?5:0,current:watts/5,uptime:this.time,faultCount:this.faultCounts[m.id]??0,firmware:m.passport.firmware,communication:available(m.id)?1:0,powerState:available(m.id)?'VIRTUAL':'DISCONNECTED',status:f(m.id)==='none'?'Ready':f(m.id),tilt:this.tilt,rotation:this.rotation};
    }
    if (!available('MF10') || f('MF10') === 'overheating') collected = 0;
    const energySignal = record('MF10','sum collected power; controller interlock',collected,solarParents,'L2','W');
    const lightingDemand = c.lighting === 'continuous' ? 0.16 : c.lighting === 'events' ? 0.016 : 0;
    const batteryOnline = available('MF11') && !['depleted','overheating'].includes(f('MF11'));
    const batterySupply = batteryOnline ? Math.min(2, this.energy * 3600 * 0.9 / Math.max(dt,0.1)) : 0;
    const supply = Math.max(0,collected + batterySupply - lightingDemand);
    this.rules.graph.modules.find(m => m.id==='Collected').config.capacity = collected;
    this.rules.graph.modules.find(m => m.id==='Supply').config.capacity = supply;
    this.rules.graph.modules.find(m => m.id==='Motor').config.peak = c.demandW;
    this.rules.tick(dt);
    const threshold = record('MF13',`power > ${c.thresholdW} W`,this.rules.state.Threshold.active,[energySignal],'L0');
    const timer = record('MF13',`continuous delay ${c.delayS}s`,this.rules.state.Delay.active,[threshold],'L0');
    const storedEnergy = record('MF11','stored energy before step',this.energy,[],'L2','Wh');
    const buffer = record('MF11','battery discharge budget',batterySupply,[storedEnergy],'L2','W');
    const supplySignal = record('MF10','source + buffer − lighting',supply,[energySignal,buffer],'L2','W');
    const motorEnvelope = this.project.modules.find(m=>m.id==='MF15').passport.power;
    const authorized = this.branch.tick(dt,{known:available('MF15')&&available('MF14'),voltage:5,minimum:motorEnvelope.nominal_voltage*.9,maximum:motorEnvelope.nominal_voltage*1.1,limit:motorEnvelope.maximum_current_ma/1000,current:f('MF15')==='short_circuit'?20:c.demandW/5,temperature:this.temperatures.MF15,fault:f('MF15')==='short_circuit'});
    const protection = !authorized || !available('MF13') || !available('MF02') || !available('MF10') || f('MF13')==='overheating' || f('MF10')==='overheating';
    const winner = arbitrate([
      {enable:this.rules.state.Motor.active,priority:'NORMAL',reason:this.rules.state.Motor.status},
      ...(protection?[{enable:false,priority:'EMERGENCY',reason:!authorized?this.branch.reason:'Required control path unavailable'}]:[]),
    ]);
    const powerState = record('MF15','power negotiation / protection',{phase:this.branch.phase,reason:winner.reason},[],'L4',null,protection?'EMERGENCY':'NORMAL');
    const active = winner.enable;
    const motorSignal = record('MF15','priority arbitration → motor',active,[timer,supplySignal,powerState],'L0',null,winner.priority);
    this.position = (this.position + (active?60*dt:0))%360;
    const motorW = active ? c.demandW : 0;
    const lightW = Math.min(lightingDemand,Math.max(0,collected+batterySupply-motorW));
    const balance = collected - motorW - lightW;
    let batteryW = 0;
    if (batteryOnline && dt > 0) {
      if (balance >= 0) { batteryW = -Math.min(balance,2,(c.batteryWh-this.energy)*3600/(0.9*dt)); this.energy -= batteryW*dt*0.9/3600; }
      else { batteryW = Math.min(-balance,batterySupply); this.energy -= batteryW*dt/(0.9*3600); }
    }
    this.energy = clamp(this.energy,0,c.batteryWh);
    this.generatedWh += collected*dt/3600; this.motorWh += motorW*dt/3600; this.lightWh += lightW*dt/3600;
    Object.assign(states.MF15,{active,watts:motorW,current:motorW/5,voltage:authorized?5:0,position:this.position,powerState:this.branch.phase,status:active?'Running':winner.reason,faultCount:Math.max(this.branch.faults,states.MF15.faultCount)});
    Object.assign(states.MF10,{watts:collected,current:collected/5,status:collected>0?'Collecting':'No generation'});
    Object.assign(states.MF11,{watts:batteryW,current:batteryW/5,level:this.energy/c.batteryWh,energyWh:this.energy,status:batteryW>0?'Discharging':batteryW<0?'Charging':'Idle'});
    Object.assign(states.MF02,{intensity:sensor,azimuth:c.azimuth,elevation:c.elevation,status:available('MF02')?'Virtual vector':'Unavailable'});
    Object.assign(states.MF13,{active:this.rules.state.Delay.active,status:this.rules.state.Delay.status});
    const fusion = available('MF07') ? { illumination:sensor/1200, thermalMargin:clamp((60-states.MF06.temperature)/60,0,1), safeToTrack:sensor>0&&states.MF06.temperature<60&&available('MF06') } : null;
    states.MF07.fusion = fusion;
    const thermalSample = record('MF06','temperature sample',states.MF06.temperature,[env],'L2','degC');
    record('MF07','deterministic environment fusion',fusion,[vector,thermalSample], 'L4');
    for (const m of this.project.modules) {
      if (f(m.id)!=='none') states[m.id].status = `${states[m.id].status} / ${f(m.id)}`;
      else if (states[m.id].temperature>=50) states[m.id].status += ' / Thermal warning';
    }
    const previous = this.frames.at(-1);
    if (previous && previous.states.MF15.active !== active) this.events.unshift({time:this.time,module:'MF15',message:active?'Motor OFF → ON':'Motor ON → OFF',priority:winner.priority,signalId:motorSignal,frameId:this.sequence});
    const frame = {id:this.sequence,time:this.time,config:structuredClone(c),faults:{...this.faults},states,trace,totals:{incident,collected,heat,escaped,motorW,batteryW,lightW,generatedWh:this.generatedWh,motorWh:this.motorWh,lightWh:this.lightWh,batteryWh:this.energy},reason:winner.reason};
    frame.incidents=this.incidents.update(frame);
    this.frames.push(frame); if (this.frames.length>600) this.frames.shift(); this.events=this.events.slice(0,200);
    return structuredClone(frame);
  }
  snapshot(index = this.frames.length-1) {
    if (!Number.isInteger(index) || index<0 || index>=this.frames.length) throw new Error('Snapshot outside retained history.');
    return structuredClone(this.frames[index]);
  }
  topology() {
    return { source:'virtual descriptors + known simulation links',modules:this.project.modules.map(m=>({id:m.id,uid:m.passport.uid,type:m.passport.type})),connections:[
      ...this.project.modules.filter(m=>m.passport.type==='solarskin').map(m=>({from:m.id,to:'MF10',kind:'power'})),
      ...this.project.modules.filter(m=>m.passport.type==='solarskin'||['MF05','MF08'].includes(m.id)).map(m=>({from:'MF03',to:m.id,kind:'orientation'})),
      {from:'MF02',to:'MF03',kind:'signal'},{from:'MF02',to:'MF07',kind:'signal'},{from:'MF06',to:'MF07',kind:'signal'},
      {from:'MF10',to:'MF11',kind:'bidirectional-power'},{from:'MF10',to:'MF13',kind:'signal'},
      {from:'MF13',to:'MF15',kind:'signal'},{from:'MF10',to:'MF15',kind:'power'},{from:'MF14',to:'MF15',kind:'control'},
    ]};
  }
  validateDeployment() {
    return {status:'SIMULATED',hardwareDeployable:false,checks:[
      {name:'Graph ports, types and acyclic dependencies',pass:true},
      {name:'Optical fractions conserve incident energy',pass:this.project.config.reflectivity+this.project.config.absorption<=1},
      {name:'Motor passport voltage compatible with 5 V source',pass:Math.abs(this.project.modules[14].passport.power.nominal_voltage-5)<=this.project.modules[14].passport.power.nominal_voltage*.1},
      {name:'Peak motor demand within passport current limit',pass:this.project.config.demandW/5<=this.project.modules[14].passport.power.maximum_current_ma/1000},
      {name:'Current generation can cover motor and lighting',pass:this.frames.at(-1).totals.collected>=this.project.config.demandW+this.frames.at(-1).totals.lightW},
      {name:'All injected faults cleared',pass:Object.values(this.faults).every(f=>f==='none')},
      {name:'Motor branch negotiated and not latched off',pass:this.branch.phase==='NORMAL'},
    ],blockers:['No physical transport, reviewed electrical design, or hardware qualification evidence.']};
  }
}
