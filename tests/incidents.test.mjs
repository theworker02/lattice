import test from 'node:test';
import assert from 'node:assert/strict';
import { Twin,mirrorfieldProject } from '../src/twin.mjs';

test('normal startup and insufficient sunlight do not produce incidents',()=>{
 const twin=new Twin(mirrorfieldProject());twin.configure('irradiance',0);twin.step(1);
 assert.deepEqual(twin.incidents.export(),[]);
});
test('repeated fault samples deduplicate while retaining opening evidence',()=>{
 const twin=new Twin(mirrorfieldProject());twin.inject('MF15','short_circuit');
 const initial=twin.incidents.export();for(let i=0;i<10;i++)twin.step(.1);
 assert.equal(twin.incidents.entries.length,initial.length);
 assert.deepEqual(twin.incidents.export().map(i=>i.evidence),initial.map(i=>i.evidence));
 const copy=twin.incidents.export();copy[0].evidence.state.temperature=999;assert.notEqual(twin.incidents.entries[0].evidence.state.temperature,999);
});
test('acknowledgement cannot bypass protection and replay retains the prior acknowledgement state',()=>{
 const twin=new Twin(mirrorfieldProject());twin.inject('MF15','short_circuit');const before=twin.snapshot();
 const id=twin.incidents.entries[0].id;twin.incidents.acknowledge(id,twin.time);twin.step(0);
 assert.equal(twin.snapshot().states.MF15.active,false);
 assert.equal(before.incidents.find(i=>i.id===id).acknowledgedAt,null);
 assert.equal(twin.snapshot().incidents.find(i=>i.id===id).acknowledgedAt,0);
});
test('clearing the cause resolves injection but leaves a latched branch incident until rearm',()=>{
 const twin=new Twin(mirrorfieldProject());twin.inject('MF15','short_circuit');twin.step(.1);twin.inject('MF15','none');
 assert.equal(twin.snapshot().incidents.length,1);assert.match(twin.snapshot().incidents[0].key,/latch/);
 twin.rearm();assert.equal(twin.snapshot().incidents.length,0);
 assert.ok(twin.incidents.export().every(i=>i.resolvedAt!==null));
});
test('recurring faults create a new incident and resetting the run clears its journal',()=>{
 const twin=new Twin(mirrorfieldProject());twin.inject('MF14','communication');const first=twin.incidents.entries[0].id;
 twin.inject('MF14','none');twin.inject('MF14','communication');assert.notEqual(twin.incidents.entries[0].id,first);
 twin.load(twin.project);assert.equal(twin.incidents.export().length,0);
});
