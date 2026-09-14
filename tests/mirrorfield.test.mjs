import test from 'node:test';
import assert from 'node:assert/strict';
import { Twin,mirrorfieldProject,validateProject } from '../src/twin.mjs';
import { opticalBudget,incidence,routeRays } from '../src/optics.mjs';
import { PowerBranch,arbitrate,validatePassport } from '../src/passport.mjs';
import { encodeLight,decodeLight,virtualBridge } from '../src/latticelight.mjs';
const advance=(t,seconds)=>{for(let i=0;i<seconds*10;i++)t.step(.1);return t.snapshot();};
test('optical accounting conserves energy across the entire hypothesis range',()=>{
  for(let r=0;r<=.9;r+=.1)for(const routing of [0,.1,.2]){const b=opticalBudget({irradiance:1000,reflectivity:r,routing});assert.ok(Math.abs(b.incident-b.heat-b.electric-b.escaped)<1e-10);assert.ok(b.electric>=0);}
  assert.throws(()=>opticalBudget({irradiance:1000,reflectivity:.95,absorption:.1}));
});
test('reflection tradeoff reduces collection, oblique surfaces reduce interception',()=>{
  assert.ok(opticalBudget({irradiance:900,reflectivity:.2}).electric>opticalBudget({irradiance:900,reflectivity:.8}).electric);
  assert.equal(incidence(0,0,0,0),0);assert.ok(Math.abs(incidence(217,43,47,217)-1)<1e-12);
});
test('ray routing is bounded, angle-dependent and repeatable',()=>{
  assert.deepEqual(routeRays(),routeRays());assert.equal(routeRays().hits,200);
  assert.notEqual(routeRays({angle:40}).hits,routeRays().hits);
  assert.throws(()=>routeRays({rays:Infinity}));
});
test('mirrorfield starts off, negotiates, delays, then powers modeled demand',()=>{
  const twin=new Twin(mirrorfieldProject());assert.equal(twin.snapshot().states.MF15.active,false);
  const frame=advance(twin,5);assert.equal(frame.states.MF15.active,true);assert.equal(frame.states.MF15.powerState,'NORMAL');assert.equal(frame.totals.motorW,1.2);
  assert.ok(frame.states.MF03.tilt>0);assert.ok(frame.totals.generatedWh>0);
});
test('optical collection survives motor short and short requires explicit re-arm',()=>{
  const twin=new Twin(mirrorfieldProject());advance(twin,4);twin.inject('MF15','short_circuit');
  assert.equal(twin.snapshot().states.MF15.active,false);assert.ok(twin.snapshot().totals.collected>0);
  twin.inject('MF15','none');advance(twin,2);assert.equal(twin.branch.phase,'FAULT');
  twin.rearm();advance(twin,2);assert.equal(twin.snapshot().states.MF15.active,true);
});
test('communication loss preempts normal automation and recovery renegotiates',()=>{
  const twin=new Twin(mirrorfieldProject());advance(twin,3);twin.inject('MF14','communication');assert.equal(twin.snapshot().states.MF15.active,false);
  twin.inject('MF14','none');assert.equal(twin.snapshot().states.MF15.active,false);advance(twin,2);assert.equal(twin.snapshot().states.MF15.active,true);
});
test('motor overheating latches off and cools only with elapsed time',()=>{
  const twin=new Twin(mirrorfieldProject());advance(twin,3);twin.inject('MF15','overheating');assert.equal(twin.branch.phase,'FAULT');assert.equal(twin.snapshot().states.MF15.active,false);
  twin.inject('MF15','none');const before=twin.snapshot().states.MF15.temperature;twin.step(0);assert.equal(twin.snapshot().states.MF15.temperature,before);advance(twin,1);assert.ok(twin.snapshot().states.MF15.temperature<before);
});
test('battery charge and discharge remain within stored energy and charge limits',()=>{
  const p=mirrorfieldProject();p.config.initialCharge=0;p.config.batteryWh=.01;const twin=new Twin(p);advance(twin,60);assert.ok(twin.energy>=0&&twin.energy<=.01);
  twin.inject('MF11','depleted');assert.equal(twin.energy,0);twin.configure('irradiance',0);advance(twin,10);assert.equal(twin.energy,0);assert.equal(twin.snapshot().states.MF15.active,false);
});
test('turning lighting off eliminates its accounted power',()=>{
  const twin=new Twin(mirrorfieldProject());twin.configure('lighting','off');advance(twin,2);assert.equal(twin.snapshot().totals.lightW,0);assert.equal(twin.snapshot().totals.lightWh,0);
});
test('snapshot history is immutable to callers and causal parents resolve',()=>{
  const twin=new Twin(mirrorfieldProject());const s=advance(twin,4);s.states.MF15.active=false;assert.equal(twin.snapshot().states.MF15.active,true);
  const ids=new Set(s.trace.map(s=>s.id));for(const signal of s.trace)for(const parent of signal.parents)assert.ok(ids.has(parent));
  const event=twin.events.find(e=>e.message==='Motor OFF → ON');assert.ok(event.signalId);assert.ok(twin.frames.some(f=>f.id===event.frameId));
});
test('retention bounded; serialization preserves passport UUIDs and configurations',()=>{
  const p=mirrorfieldProject();const twin=new Twin(JSON.parse(JSON.stringify(p)));advance(twin,65);assert.equal(twin.frames.length,600);assert.deepEqual(twin.project,p);
  assert.throws(()=>twin.snapshot(-1));assert.equal(twin.validateDeployment().hardwareDeployable,false);
});
test('malformed, impossible, duplicate, hardware-claimed imports are rejected',()=>{
  for(const mutate of [p=>p.config.reflectivity=NaN,p=>p.config.reflectivity=.99,p=>{p.config.reflectivity=.8;p.config.absorption=.3;},p=>p.modules[0].passport.status='VALIDATED',p=>p.modules[1].passport.uid=p.modules[0].passport.uid,p=>p.modules=[],p=>p.config.tracking='true',p=>p.modules[0].passport.power.nominal_voltage=100,p=>p.modules[0].passport.transport='latticelink']){
    const p=mirrorfieldProject();mutate(p);assert.throws(()=>validateProject(p));
  }
});
test('invalid configuration is atomic and fault compatibility is checked',()=>{
  const twin=new Twin(mirrorfieldProject());const before=structuredClone(twin.project);assert.throws(()=>twin.configure('efficiency',2));assert.deepEqual(twin.project,before);
  assert.throws(()=>twin.inject('MF01','depleted'));assert.throws(()=>twin.inject('missing','none'));assert.throws(()=>twin.step(10));
});
test('passport schema runtime handles unique identity and bounded ports',()=>{
  const p=mirrorfieldProject().modules[0].passport;assert.equal(validatePassport(p),p);p.outputs=['power','power'];assert.throws(()=>validatePassport(p));
});
test('power branch refuses unknown, undervoltage, overvoltage, reverse polarity and excess current',()=>{
  const telemetry={known:true,voltage:5,current:.2,temperature:25};
  for(const change of [{known:false},{voltage:3},{voltage:7},{voltage:-5},{current:2}]){const branch=new PowerBranch();assert.equal(branch.tick(2,{...telemetry,...change}),false);}
  const branch=new PowerBranch();assert.equal(branch.tick(.1,telemetry),false);assert.equal(branch.tick(.9,telemetry),true);
});
test('priority arbitration lets safety win and OFF wins equal priority',()=>{
  assert.equal(arbitrate([{enable:true,priority:'NORMAL',reason:'user'},{enable:false,priority:'EMERGENCY',reason:'thermal'}]).enable,false);
  assert.equal(arbitrate([{enable:true,priority:'NORMAL',reason:'a'},{enable:false,priority:'NORMAL',reason:'b'}]).enable,false);
});
test('LatticeLight round trips text, rejects corruption and blocked paths',()=>{
  const wire=encodeLight('WHO:MF14 ◈');assert.equal(decodeLight(wire),'WHO:MF14 ◈');
  assert.throws(()=>decodeLight(wire,{obstructed:true}));assert.throws(()=>decodeLight(wire.slice(0,48)+'00'+wire.slice(50)));
  const flip=wire.slice(0,48)+(wire.slice(48,50)==='01'?'10':'01')+wire.slice(50);assert.throws(()=>decodeLight(flip),/CRC/);
  assert.throws(()=>encodeLight('a'.repeat(65)));
});
test('Bridge accepts diagnostics only and honestly labels loopback',()=>{
  assert.equal(virtualBridge({version:'0.5.0',operation:'diagnostic',payload:'ping'}).connectedHardware,false);
  assert.throws(()=>virtualBridge({version:'0.5.0',operation:'motor_on',payload:'go'}));
});

test('a valid imported passport with an incompatible voltage blocks energization',()=>{
  const p=mirrorfieldProject();p.modules[14].passport.power.nominal_voltage=12;const twin=new Twin(p);advance(twin,5);
  assert.equal(twin.snapshot().states.MF15.active,false);
  assert.equal(twin.validateDeployment().checks.find(c=>c.name.includes('voltage compatible')).pass,false);
});
