import test from 'node:test';
import assert from 'node:assert/strict';
import { Twin, mirrorfieldProject } from '../src/twin.mjs';
import { MODULE_GUIDES, createExperiment, explainFrame } from '../src/portal.mjs';

test('sunny preset runs the motor and cloudy / reflective presets explain their power shortage',()=>{
  for(const key of ['sunny','cloudy','mirror']){
    const twin=new Twin(createExperiment(mirrorfieldProject(),key));
    for(let i=0;i<100;i++)twin.step(.1);
    const frame=twin.snapshot();
    assert.equal(frame.states.MF15.active,key==='sunny');
    assert.equal(explainFrame(frame).tone,key==='sunny'?'success':'waiting');
  }
});
test('experiments restore reproducible settings while preserving module identities and original project',()=>{
  const p=mirrorfieldProject();p.config.efficiency=.01;p.config.ambient=50;
  const next=createExperiment(p,'sunny');assert.equal(next.config.efficiency,.2);
  assert.deepEqual(next.modules,p.modules);assert.equal(p.config.efficiency,.01);
  assert.throws(()=>createExperiment(p,'missing'));
});
test('protection explanation takes precedence over a low-power message',()=>{
  const twin=new Twin(mirrorfieldProject());twin.inject('MF15','short_circuit');twin.configure('irradiance',0);
  const explanation=explainFrame(twin.snapshot());assert.equal(explanation.tone,'warning');assert.match(explanation.detail,/Re-arm/);
});
test('all demonstrator modules have a family, description and role',()=>{
  for(const m of mirrorfieldProject().modules){const guide=MODULE_GUIDES[m.passport.type];assert.equal(guide.length,3);assert.ok(guide[1].length>40);assert.ok(guide[2].length>30);}
});
