/**
 * SIMULATED CAN-FD transport boundary. This models bounded discovery and stale
 * health behavior; it is not an MCU driver, a CAN controller configuration, or
 * evidence that a physical LatticeLink network exists.
 */
import {validatePassport} from './passport.mjs';

export const CAN_A0 = Object.freeze({
  hello: 0x120, passport: 0x121, sample: 0x220, health: 0x320, receipt: 0x420,
  maxPayload: 64, defaultTtlMs: 1500,
});

function clone(value) { return structuredClone(value); }
function fail(message) { throw new Error(`LatticeLink A0: ${message}`); }

export function encodeCanFd(id, message) {
  if (!Number.isInteger(id) || id < 0 || id > 0x7ff) fail('standard CAN identifier must be 0–0x7FF.');
  if (!message || typeof message !== 'object' || Array.isArray(message)) fail('message must be an object.');
  const bytes = new TextEncoder().encode(JSON.stringify(message));
  if (!bytes.length || bytes.length > CAN_A0.maxPayload) fail('payload must encode to 1–64 bytes.');
  return Object.freeze({id, dlc: bytes.length, bytes: Array.from(bytes)});
}

export function decodeCanFd(frame) {
  if (!frame || !Number.isInteger(frame.id) || !Number.isInteger(frame.dlc) || !Array.isArray(frame.bytes) || frame.dlc !== frame.bytes.length || frame.dlc < 1 || frame.dlc > CAN_A0.maxPayload || frame.bytes.some(b => !Number.isInteger(b) || b < 0 || b > 255)) fail('invalid CAN-FD frame.');
  try { return JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(new Uint8Array(frame.bytes))); }
  catch { fail('payload is not UTF-8 JSON.'); }
}

export class VirtualLatticeBus {
  constructor({ttlMs = CAN_A0.defaultTtlMs} = {}) {
    if (!Number.isFinite(ttlMs) || ttlMs < 100 || ttlMs > 60_000) fail('TTL must be 100–60000 ms.');
    this.ttlMs = ttlMs; this.now = 0; this.nodes = new Map(); this.frames = []; this.nextAddress = 1;
  }
  attach(passport) {
    validatePassport(passport);
    if (passport.transport !== 'latticelink') fail('only LatticeLink passports may attach.');
    if (this.nodes.has(passport.uid)) fail('duplicate module UUID.');
    if (this.nextAddress > 255) fail('A0 reference supports at most 255 discovered nodes.');
    const node = {passport: clone(passport), address: this.nextAddress++, lastSeen: this.now, online: true, samples: 0};
    this.nodes.set(passport.uid, node);
    this.#emit(CAN_A0.hello, {t: 'h', a: node.address, u: passport.uid});
    this.#emit(CAN_A0.passport, {t: 'p', a: node.address, r: passport.hardware_revision});
    return this.describe(passport.uid);
  }
  detach(uid) { if (!this.nodes.delete(uid)) fail('unknown module UUID.'); }
  publishSample(uid, {port, value, unit, quality = 'GOOD', sequence}) {
    const node = this.#node(uid);
    if (!node.passport.outputs.includes(port)) fail('sample port is not declared by passport.');
    if (typeof unit !== 'string' || !unit || unit.length > 16 || !['GOOD', 'SUSPECT', 'STALE'].includes(quality) || !Number.isFinite(value) || !Number.isInteger(sequence) || sequence < 0) fail('invalid typed sample.');
    node.lastSeen = this.now; node.online = true; node.samples++;
    // Unit and quality are validated against the local passport/configuration;
    // they are intentionally omitted from the compact A0 test vector.
    this.#emit(CAN_A0.sample, {t: 's', a: node.address, p: node.passport.outputs.indexOf(port), v: value, n: sequence, x: this.now});
  }
  publishHealth(uid, {temperature_c, input_v, current_a, fault_count, uptime_ms}) {
    const node = this.#node(uid);
    if (![temperature_c, input_v, current_a, fault_count, uptime_ms].every(Number.isFinite) || fault_count < 0 || uptime_ms < 0) fail('invalid health payload.');
    node.lastSeen = this.now; node.online = true;
    this.#emit(CAN_A0.health, {t: 'm', a: node.address, c: temperature_c, v: input_v, i: current_a, f: fault_count, x: uptime_ms});
  }
  tick(milliseconds) {
    if (!Number.isFinite(milliseconds) || milliseconds < 0 || milliseconds > 60_000) fail('tick must be 0–60000 ms.');
    this.now += milliseconds;
    for (const [uid, node] of this.nodes) {
      if (node.online && this.now - node.lastSeen > this.ttlMs) {
        node.online = false;
        this.#emit(CAN_A0.health, {t: 'z', a: node.address, x: this.now - node.lastSeen});
      }
    }
  }
  topology() { return [...this.nodes.keys()].sort().map(uid => this.describe(uid)); }
  describe(uid) { const node = this.#node(uid); return clone({uid, address: node.address, serial: node.passport.serial, type: node.passport.type, online: node.online, lastSeen: node.lastSeen, samples: node.samples}); }
  drainFrames() { const frames = clone(this.frames); this.frames.length = 0; return frames; }
  #node(uid) { if (typeof uid !== 'string' || !this.nodes.has(uid)) fail('unknown module UUID.'); return this.nodes.get(uid); }
  #emit(id, message) { this.frames.push(encodeCanFd(id, message)); }
}
