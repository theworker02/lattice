/** SIMULATED LatticeLight framing. No optical driver or hardware timing guarantee. */
export function crc8(bytes) {
  let crc = 0;
  for (const byte of bytes) { crc ^= byte; for (let bit=0;bit<8;bit++) crc = (crc & 0x80) ? ((crc<<1)^0x07)&255 : (crc<<1)&255; }
  return crc;
}
export function encodeLight(message) {
  if (typeof message!=='string') throw new Error('Optical payload must be text.');
  const payload = new TextEncoder().encode(message);
  if (!payload.length || payload.length>64) throw new Error('Optical payload must contain 1–64 UTF-8 bytes.');
  const frame = new Uint8Array([0xA5,1,payload.length,...payload,crc8(payload)]);
  return Array.from(frame).flatMap(byte=>Array.from({length:8},(_,i)=>byte&(1<<(7-i))?'10':'01')).join('');
}
export function decodeLight(symbols,{aligned=true,obstructed=false}={}) {
  if (!aligned || obstructed) throw new Error('Optical link unavailable: alignment or line of sight.');
  if (typeof symbols!=='string' || symbols.length<80 || symbols.length>1088 || symbols.length%16 || !/^[01]+$/.test(symbols)) throw new Error('Invalid optical frame length.');
  let bits='';
  for (let i=0;i<symbols.length;i+=2) { const pair=symbols.slice(i,i+2); if (!['01','10'].includes(pair)) throw new Error('Invalid Manchester pair.'); bits+=pair==='10'?'1':'0'; }
  const bytes=[];for(let i=0;i<bits.length;i+=8) bytes.push(parseInt(bits.slice(i,i+8),2));
  if (bytes[0]!==0xA5 || bytes[1]!==1 || bytes[2]<1 || bytes[2]>64 || bytes.length!==bytes[2]+4) throw new Error('Invalid optical header.');
  const payload = bytes.slice(3,-1); if (crc8(payload)!==bytes.at(-1)) throw new Error('Optical CRC mismatch.');
  return new TextDecoder('utf-8',{fatal:true}).decode(new Uint8Array(payload));
}

export function virtualBridge(frame) {
  if (!frame || frame.version!=='0.5.0' || frame.operation!=='diagnostic' || typeof frame.payload!=='string' || frame.payload.length>128 || Object.keys(frame).sort().join()!=='operation,payload,version') throw new Error('Bridge accepts bounded diagnostic frames only.');
  return {transport:'virtual-loopback',connectedHardware:false,received:frame.payload};
}
