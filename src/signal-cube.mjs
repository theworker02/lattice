/** Local signal-routing simulator. No physical transport or network requests. */
export const SENSORS={light:{name:'Light',unit:'W/m²',min:0,max:1200,default:800},temperature:{name:'Temperature',unit:'°C',min:-20,max:100,default:24},vibration:{name:'Vibration',unit:'g',min:0,max:10,default:0.2}};
export const DEFAULT_ROUTE={sensor:'light',window:1,threshold:0,destination:'monitor'};
export function validateRoute(route){
  if(!route||Object.keys(route).sort().join()!=='destination,sensor,threshold,window'||!Object.hasOwn(SENSORS,route.sensor)||!['monitor','recorder'].includes(route.destination)||!Number.isInteger(route.window)||route.window<1||route.window>10||!Number.isFinite(route.threshold)||route.threshold<SENSORS[route.sensor].min||route.threshold>SENSORS[route.sensor].max)throw new Error('Choose a supported sensor, destination, threshold and a smoothing window of 1–10 samples.');
  return route;
}
export class SignalCube{
  constructor(route=DEFAULT_ROUTE){this.route={...validateRoute(route)};this.samples=[];this.queue=[];this.receipts=[];this.last=null;this.sequence=0;this.lastTime=-Infinity;this.counts={sampled:0,filtered:0,delivered:0,dropped:0};}
  configure(route){validateRoute(route);this.route={...route};this.samples=[];this.counts.dropped+=this.queue.length;this.queue=[];this.last=null;}
  sample(value,time,online=true){
    const sensor=SENSORS[this.route.sensor];
    if(!Number.isFinite(value)||value<sensor.min||value>sensor.max||!Number.isFinite(time)||time<this.lastTime||typeof online!=='boolean')throw new Error('Invalid sensor sample or non-monotonic timestamp.');
    this.lastTime=time;this.counts.sampled++;
    this.samples.push(value);if(this.samples.length>this.route.window)this.samples.shift();
    const filtered=this.samples.reduce((a,b)=>a+b,0)/this.samples.length;
    this.last={raw:value,value:filtered,unit:sensor.unit,passed:filtered>this.route.threshold};
    if(this.last.passed){
      const packet={id:`CUBE-${++this.sequence}`,source:`cube-01/${this.route.sensor}`,quality:'simulated',level:'L2',unit:sensor.unit,value:filtered,raw:value,samples:this.samples.length,threshold:this.route.threshold,destination:this.route.destination,createdAt:time,expiresAt:time+5000};
      if(this.queue.length>=20){this.queue.shift();this.counts.dropped++;}this.queue.push(packet);
    }else this.counts.filtered++;
    this.flush(time,online);
    return structuredClone(this.last);
  }
  flush(time,online=true){
    if(!Number.isFinite(time)||time<this.lastTime||typeof online!=='boolean')throw new Error('Invalid delivery clock.');
    this.lastTime=time;
    this.queue=this.queue.filter(p=>{if(time>=p.expiresAt){this.counts.dropped++;return false;}return true;});
    if(online){for(const packet of this.queue){this.receipts.unshift({...packet,deliveredAt:time,transport:'local-memory'});this.counts.delivered++;}this.queue=[];this.receipts=this.receipts.slice(0,100);}
  }
  export(){return structuredClone({route:this.route,counts:this.counts,queued:this.queue,receipts:this.receipts});}
}
