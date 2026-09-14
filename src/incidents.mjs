/** Simulator incidents: recognition, immutable opening evidence and operator acknowledgement. */
export function detectIncidents(frame) {
  const found=[];
  for(const [module,state] of Object.entries(frame.states)) {
    const fault=frame.faults[module]??'none';
    if(fault!=='none') found.push({key:`${module}:injection:${fault}`,module,severity:['short_circuit','overheating'].includes(fault)?'critical':'warning',title:`${module} · ${fault.replaceAll('_',' ')}`,recovery:fault==='overheating'?'Clear the injected heat source and allow the module to cool. Re-arm the motor only after it is below its trip threshold.':fault==='short_circuit'?'Clear the short-circuit injection, then re-arm the motor branch.': 'Select this module and set its injected fault to none. Check its state before resuming the experiment.'});
    if(state.temperature>=50 && fault!=='overheating') found.push({key:`${module}:thermal`,module,severity:state.temperature>=60?'critical':'warning',title:`${module} · elevated temperature`,recovery:'Reduce heat input or ambient temperature. The thermal warning clears below 50°C; a latched motor still requires re-arming.'});
    if(state.powerState==='FAULT') found.push({key:`${module}:latch`,module,severity:'critical',title:`${module} · power branch locked out`,recovery:'Remove the cause, check temperature and electrical compatibility, then re-arm. Acknowledgement does not authorize power.'});
  }
  return found;
}
export class IncidentRecorder {
  constructor(){this.entries=[];this.serial=0;}
  update(frame){
    const detected=detectIncidents(frame),keys=new Set(detected.map(i=>i.key));
    for(const entry of this.entries) if(entry.resolvedAt===null&&!keys.has(entry.key))entry.resolvedAt=frame.time;
    for(const item of detected){
      let entry=this.entries.find(i=>i.key===item.key&&i.resolvedAt===null);
      if(!entry){entry={...item,id:`INC-${++this.serial}`,openedAt:frame.time,resolvedAt:null,acknowledgedAt:null,frameId:frame.id,evidence:structuredClone({state:frame.states[item.module],totals:frame.totals,reason:frame.reason,fault:frame.faults[item.module]??'none'})};this.entries.unshift(entry);}
      entry.severity=item.severity;
    }
    // Preserve every open incident; discard oldest resolved entries first.
    while(this.entries.length>200){let i=this.entries.findLastIndex(e=>e.resolvedAt!==null);if(i<0)break;this.entries.splice(i,1);}
    return structuredClone(this.entries.filter(i=>i.resolvedAt===null));
  }
  acknowledge(id,time){const entry=this.entries.find(i=>i.id===id);if(!entry||entry.resolvedAt!==null)throw new Error('This incident is no longer active.');entry.acknowledgedAt??=time;}
  export(){return structuredClone(this.entries);}
}
