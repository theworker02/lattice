import test from 'node:test';
import assert from 'node:assert/strict';
import { SignalCube } from '../src/signal-cube.mjs';
test('cube smooths samples, applies threshold and delivers typed local messages',()=>{
 const cube=new SignalCube({sensor:'temperature',window:3,threshold:25,destination:'recorder'});
 cube.sample(20,0);cube.sample(30,1000);cube.sample(40,2000);
 assert.equal(cube.counts.filtered,2);assert.equal(cube.counts.delivered,1);
 assert.equal(cube.receipts[0].value,30);assert.equal(cube.receipts[0].unit,'°C');assert.equal(cube.receipts[0].destination,'recorder');
});
test('offline messages are bounded and expired messages never deliver',()=>{
 const cube=new SignalCube();for(let i=0;i<25;i++)cube.sample(800,i,false);
 assert.equal(cube.queue.length,20);assert.equal(cube.counts.dropped,5);
 cube.flush(6000,true);assert.equal(cube.receipts.length,0);assert.equal(cube.counts.dropped,25);
});
test('fresh pending messages deliver once when destination recovers',()=>{
 const cube=new SignalCube();cube.sample(100,0,false);cube.flush(1000,true);cube.flush(2000,true);
 assert.equal(cube.counts.delivered,1);assert.equal(cube.receipts[0].createdAt,0);assert.equal(cube.receipts[0].deliveredAt,1000);
});
test('route edits validate atomically and cannot misroute queued packets',()=>{
 const cube=new SignalCube();cube.sample(100,0,false);assert.throws(()=>cube.configure({sensor:'unknown'}));assert.equal(cube.queue.length,1);
 cube.configure({sensor:'temperature',window:1,threshold:20,destination:'recorder'});assert.equal(cube.queue.length,0);assert.equal(cube.counts.dropped,1);
 assert.throws(()=>cube.sample(NaN,1));assert.throws(()=>cube.sample(200,1));
 cube.sample(24,2);assert.throws(()=>cube.sample(24,1));
});
test('exports are detached and receipt history is bounded',()=>{
 const cube=new SignalCube();for(let i=0;i<150;i++)cube.sample(100,i);
 assert.equal(cube.receipts.length,100);const data=cube.export();data.receipts[0].value=-1;assert.equal(cube.receipts[0].value,100);
});
