import test from 'node:test';
import assert from 'node:assert/strict';
import {CAN_A0, decodeCanFd, encodeCanFd, VirtualLatticeBus} from '../src/latticelink.mjs';

const passport = (uid, type = 'vector') => ({schema_version:'0.5.0',uid,serial:`LAT-${uid.slice(0,4)}`,family:type === 'vector' ? 'sense' : 'motion',type,hardware_revision:'E1-REFERENCE',firmware:'reference-0.1',status:'SIMULATED',inputs:[],outputs:type === 'vector' ? ['optical_vector'] : ['position'],power:{nominal_voltage:5,maximum_current_ma:100,safe_state:'OFF'},transport:'latticelink'});
const uid='123e4567-e89b-42d3-a456-426614174000';

test('CAN A0 frames are bounded, immutable and decode to their original message',()=>{
  const frame=encodeCanFd(CAN_A0.hello,{t:'h',u:uid});
  assert.equal(frame.dlc,frame.bytes.length);assert.deepEqual(decodeCanFd(frame),{t:'h',u:uid});
  assert.throws(()=>encodeCanFd(0x800,{x:1}));assert.throws(()=>encodeCanFd(1,{x:'a'.repeat(100)}));
});
test('virtual discovery announces a declared LatticeLink passport and rejects duplicate identity',()=>{
  const bus=new VirtualLatticeBus();assert.equal(bus.attach(passport(uid)).online,true);
  assert.deepEqual(bus.drainFrames().map(f=>f.id),[CAN_A0.hello,CAN_A0.passport]);
  assert.throws(()=>bus.attach(passport(uid)),/duplicate/);
});
test('typed samples remain bound to declared ports and stale health removes a module from live topology',()=>{
  const bus=new VirtualLatticeBus({ttlMs:200});bus.attach(passport(uid));bus.drainFrames();
  bus.publishSample(uid,{port:'optical_vector',value:.73,unit:'ratio',sequence:1});assert.equal(decodeCanFd(bus.drainFrames()[0]).t,'s');
  assert.throws(()=>bus.publishSample(uid,{port:'position',value:1,unit:'deg',sequence:2}),/declared/);
  bus.tick(201);assert.equal(bus.topology()[0].online,false);assert.equal(decodeCanFd(bus.drainFrames()[0]).t,'z');
});
