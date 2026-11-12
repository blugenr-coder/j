// Random events. Flight events are failures (and a few opportunities) that fire during
// a flight and must be handled with a quick action. Hangar events are situations
// between flights that you answer with a decision.
import { PARTS, PART, CATS, fmtMoney } from './data.js';
import { ATMO, density } from './sim.js';

const pick = a => a[Math.floor(Math.random() * a.length)];
const rnd = (a, b) => a + Math.random() * (b - a);
const engines = v => v.live().filter(p => p.def.engine && !p.destroyed && p.stage === v.curStage);
const tanks = v => v.live().filter(p => p.def.fuel && !p.def.engine && !p.destroyed && p.stage === v.curStage && p.fuel > 0);
const burning = v => engines(v).some(p => p.burning);
const inAir = v => v.liftoff && !v.ended;
const lowAtmo = v => inAir(v) && v.alt < 15000;
const atmo = v => inAir(v) && v.alt < ATMO;
const space = v => inAir(v) && v.alt >= ATMO;
const descending = v => inAir(v) && v.vVert < -20 && v.maxAlt > 3000;

// kinds: tap | hold | mash | timing | choice | steer | info
// Each event: when(v) gate, weight, time window, plus fail/win/tick handlers.
export const FLIGHT_EVENTS = [
  { id: 'flameout', title: 'ENGINE FLAMEOUT', text: 'Combustion lost. Hit RELIGHT in the green window.', kind: 'timing', time: 6, when: v => burning(v) && engines(v).some(e => !e.def.engine.srb), weight: 3,
    start(v, e) { e.eng = pick(engines(v).filter(p => !p.def.engine.srb)); e.eng.offT = 999; },
    win(v, e) { e.eng.offT = 0; }, fail(v, e) { e.eng.offT = 8; v.msg(`${e.eng.def.name} offline 8 s`, 'bad'); } },
  { id: 'leak', title: 'FUEL LINE LEAK', text: 'Propellant venting overboard. HOLD to seal.', kind: 'hold', hold: 2, time: 8, when: v => inAir(v) && tanks(v).length, weight: 3,
    start(v) { v.mod.leak += 6 + v.mass() * 0.002; }, win(v) { v.mod.leak = 0; },
    fail(v) { v.mod.leak *= 0.5; v.msg('Leak only partly sealed - still losing fuel', 'bad'); } },
  { id: 'bird', title: 'BIRD STRIKE', text: 'Flock on the trajectory! Steer clear: roll LEFT or RIGHT.', kind: 'choice', time: 4, when: v => inAir(v) && v.alt < 2500 && v.vVert > 0, weight: 2,
    choices: [{ label: 'Roll left' }, { label: 'Roll right' }],
    start(_, e) { e.safe = Math.floor(Math.random() * 2); },
    choose(v, e, i) { if (i === e.safe) { v.msg('Missed the flock', 'good'); return true; } v.damageRandom(30, d => d.shape === 'cone' || d.core || d.shape === 'tank', 'bird strike'); return false; },
    fail(v) { v.damageRandom(30, () => true, 'bird strike'); } },
  { id: 'shear', title: 'WIND SHEAR', text: 'Crosswind is shoving you sideways. Hold the nose within 10° of your heading for 4 s.', kind: 'steer', hold: 4, time: 10, when: v => inAir(v) && v.alt > 1000 && v.alt < 14000, weight: 3,
    start(v, e) { e.dir = Math.random() < 0.5 ? -1 : 1; e.target = v.pitch; v.mod.spin = e.dir * 0.5; v.mod.gust = e.dir * v.mass() * 3; },
    ok(v, e) { return Math.abs(v.pitch - e.target) < 0.18; },
    end(v) { v.mod.spin = 0; v.mod.gust = 0; }, fail(v) { v.damageRandom(15, () => true, 'wind loads'); } },
  { id: 'lightning', title: 'LIGHTNING STRIKE', text: 'Avionics browned out. TAP to reboot before control is lost.', kind: 'tap', time: 3.5, elec: true, when: v => inAir(v) && v.alt < 9000, weight: 1.5,
    fail(v) { v.mod.sasOff = 8; v.mod.steer = 0.2; setTimeout(() => { v.mod.steer = 1; }, 8000); v.msg('Flight computer rebooting: 8 s without control', 'bad'); } },
  { id: 'gimbal', title: 'GIMBAL JAMMED', text: 'Engine nozzle stuck. MASH to free the actuator.', kind: 'mash', n: 10, time: 5, when: v => burning(v), weight: 2,
    start(v) { v.mod.steer = 0.35; }, win(v) { v.mod.steer = 1; }, fail(v) { v.mod.steer = 0.55; v.msg('Steering at 55% for the rest of the stage', 'bad'); } },
  { id: 'pogo', title: 'POGO OSCILLATION', text: 'Thrust is surging. Hit DAMP at the low point of the wave.', kind: 'timing', time: 6, when: v => burning(v) && atmo(v), weight: 2,
    fail(v) { v.damageRandom(25, d => d.engine || d.fuel, 'pogo'); v.damageRandom(15, () => true, 'pogo'); } },
  { id: 'overpressure', title: 'TANK OVERPRESSURE', text: 'Pressure spiking. HOLD to vent before it ruptures.', kind: 'hold', hold: 1.5, time: 5, when: v => inAir(v) && tanks(v).length, weight: 2,
    start(v, e) { e.tank = pick(tanks(v)); },
    win(v, e) { e.tank.fuel *= 0.95; }, fail(v, e) { e.tank.fuel *= 0.5; v.damage(e.tank, 60, 'rupture'); } },
  { id: 'sensor', title: 'SENSOR GLITCH', text: 'Telemetry is garbage. Pick the backup you trust.', kind: 'choice', time: 6, elec: true, when: inAir, weight: 2,
    choices: [{ label: 'Inertial unit' }, { label: 'Radar alt' }, { label: 'GPS' }],
    start(_, e) { e.safe = Math.floor(Math.random() * 3); },
    choose(v, e, i) { if (i === e.safe) return true; v.mod.hudGlitch = 12; v.msg('Wrong unit - readouts scrambled 12 s', 'bad'); return false; },
    fail(v) { v.mod.hudGlitch = 15; } },
  { id: 'valve', title: 'VALVE FROZEN', text: 'Cryogenic valve iced shut. MASH heaters.', kind: 'mash', n: 12, time: 6, when: v => space(v) && engines(v).some(e => !e.def.engine.srb), weight: 2,
    start(v, e) { e.engs = engines(v).filter(p => !p.def.engine.srb); e.engs.forEach(p => p.offT = 999); },
    win(v, e) { e.engs.forEach(p => p.offT = 0); }, fail(v, e) { e.engs.forEach(p => p.offT = 20); v.msg('Engines locked out 20 s', 'bad'); } },
  { id: 'flare', title: 'SOLAR FLARE', text: 'Radiation storm incoming. TAP to switch electronics to shielded mode.', kind: 'tap', time: 3, elec: true, when: space, weight: 1.5,
    fail(v) { v.damageRandom(35, d => d.core || d.sci || d.resist, 'radiation'); v.mod.hudGlitch = 6; } },
  { id: 'micro', title: 'MICROMETEOROID HIT', text: 'Hull punctured. HOLD to patch.', kind: 'hold', hold: 2.5, time: 7, when: space, weight: 2,
    start(v, e) { e.p = v.damageRandom(15, () => true, 'micrometeoroid'); },
    fail(v, e) { if (e.p) v.damage(e.p, 40, 'decompression'); if (e.p?.fuel) e.p.fuel *= 0.4; } },
  { id: 'debris', title: 'DEBRIS ON COLLISION COURSE', text: 'Old rocket body closing fast. Dodge NOW in the window.', kind: 'timing', time: 5, when: space, weight: 1.5,
    fail(v) { v.damageRandom(70, () => true, 'debris impact'); } },
  { id: 'reboot', title: 'COMPUTER WATCHDOG', text: 'Flight software hung. Confirm reboot in the window.', kind: 'timing', time: 6, elec: true, when: inAir, weight: 1.5,
    fail(v) { v.mod.sasOff = 6; v.throttle = 0; v.msg('Throttle cut by reboot', 'bad'); } },
  { id: 'stuck_sep', title: 'PYRO BOLTS DUD', text: 'Separator will not fire. MASH the backup circuit.', kind: 'mash', n: 14, time: 7, when: v => inAir(v) && v.curStage < v.maxStage, weight: 1.5,
    start(v) { v.mod.decouplerStuck = true; }, win(v) { v.mod.decouplerStuck = false; },
    fail(v) { setTimeout(() => { v.mod.decouplerStuck = false; v.msg('Backup pyros finally armed', 'good'); }, 15000); v.msg('Separator locked for 15 s', 'bad'); } },
  { id: 'chute_tangle', title: 'CHUTE LINES TANGLED', text: 'Canopy only half open. MASH to cut and reef the lines.', kind: 'mash', n: 12, time: 6, when: v => v.chuteOn && v.chuteFrac > 0.5 && v.alt > 600, weight: 3,
    start(v) { v.mod.chuteMul = 0.35; }, win(v) { v.mod.chuteMul = 1; }, fail(v) { v.mod.chuteMul = 0.6; v.msg('Parachute at 60% - expect a hard landing', 'bad'); } },
  { id: 'shield_crack', title: 'HEAT SHIELD CRACK', text: 'Plasma is getting in. Hold the shield straight into the airflow: keep the nose pointing backward for 3 s.', kind: 'steer', hold: 3, time: 8, when: v => v.heat > 40 && atmo(v), weight: 3,
    ok(v) { const back = Math.atan2(-v.vy, -v.vx); return Math.abs(((v.heading - back + 3 * Math.PI) % (2 * Math.PI)) - Math.PI) > 2.8; },
    fail(v) { v.heat += 40; } },
  { id: 'blackout', title: 'COMMS BLACKOUT', text: 'Plasma sheath. Telemetry lost - fly by feel.', kind: 'info', time: 10, when: v => v.heat > 30, weight: 2,
    start(v) { v.mod.hudGlitch = 10; } },
  { id: 'contam', title: 'OXIDIZER CONTAMINATION', text: 'Bad batch in the lines. Dump some propellant, or burn it and lose thrust?', kind: 'choice', time: 7, when: v => burning(v) && tanks(v).length, weight: 1.5,
    choices: [{ label: 'Dump 10% fuel' }, { label: 'Burn it (-30% thrust 20 s)' }],
    choose(v, e, i) { if (i === 0) tanks(v).forEach(t => t.fuel *= 0.9); else { const es = engines(v); es.forEach(p => p.thrustMul = 0.7); setTimeout(() => es.forEach(p => p.thrustMul = 1), 20000); } return true; },
    fail(v) { engines(v).forEach(p => p.thrustMul = 0.6); v.msg('Engines running rough for the rest of the stage', 'bad'); } },
  { id: 'battery_hot', title: 'BATTERY THERMAL RUNAWAY', text: 'Cells overheating. HOLD coolant purge.', kind: 'hold', hold: 2, time: 6, elec: true, when: inAir, weight: 1.5,
    fail(v) { v.damageRandom(45, d => d.core || d.resist, 'battery fire'); } },
  { id: 'bolt', title: 'LOOSE BOLT RATTLE', text: 'Something is shaking loose. TAP to torque it.', kind: 'tap', time: 4, when: v => atmo(v) && v.speed > 150, weight: 2,
    fail(v) { v.damageRandom(25, () => true, 'loose joint'); } },
  { id: 'cavitation', title: 'TURBOPUMP CAVITATION', text: 'Pump starving. Hit SYNC in the window.', kind: 'timing', time: 6, when: v => burning(v) && engines(v).some(e => !e.def.engine.srb), weight: 2,
    fail(v) { const e = pick(engines(v)); if (e) v.damage(e, 50, 'pump failure'); } },
  { id: 'short', title: 'ELECTRICAL SHORT', text: 'Breaker tripped. MASH to reset.', kind: 'mash', n: 8, time: 4, elec: true, when: inAir, weight: 2,
    fail(v) { v.mod.sasOff = 10; v.msg('Gyros offline 10 s', 'bad'); } },
  { id: 'gyro', title: 'GYRO DRIFT', text: 'Attitude reference drifting. TAP to recalibrate.', kind: 'tap', time: 4, elec: true, when: inAir, weight: 2,
    start(v) { v.mod.spin = (Math.random() < 0.5 ? -1 : 1) * 0.25; }, end(v) { v.mod.spin = 0; },
    fail(v) { v.mod.spin = (Math.random() < 0.5 ? -1 : 1) * 0.12; setTimeout(() => { v.mod.spin = 0; }, 10000); } },
  { id: 'throttle_stuck', title: 'THROTTLE STUCK', text: 'Throttle valve frozen at its current setting.', kind: 'choice', time: 6, when: v => burning(v) && engines(v).some(e => !e.def.engine.srb), weight: 1.5,
    choices: [{ label: 'Reboot (engines off 4 s)' }, { label: 'Live with it 15 s' }],
    choose(v, e, i) { if (i === 0) { engines(v).forEach(p => p.offT = 4); } else { v.mod.throttleStuck = v.throttle; setTimeout(() => { v.mod.throttleStuck = -1; }, 15000); } return true; },
    fail(v) { v.mod.throttleStuck = v.throttle; setTimeout(() => { v.mod.throttleStuck = -1; }, 25000); } },
  { id: 'fire', title: 'ENGINE BAY FIRE', text: 'Fire behind the heat shield. HOLD extinguisher.', kind: 'hold', hold: 2.5, time: 7, when: v => burning(v), weight: 1.5,
    start(v, e) { e.eng = pick(engines(v)); }, tick(v, e, dt) { if (e.eng) v.damage(e.eng, 6 * dt, 'fire'); },
    fail(v, e) { if (e.eng) v.damage(e.eng, 80, 'fire'); } },
  { id: 'plasma', title: 'PLASMA BUILDUP', text: 'Hot spot forming. Hit TRIM in the window.', kind: 'timing', time: 5, when: v => v.heat > 50, weight: 2,
    fail(v) { v.heat += 35; } },
  { id: 'hydraulic', title: 'HYDRAULIC LEAK', text: 'Landing leg actuators losing pressure. HOLD to bypass.', kind: 'hold', hold: 2, time: 6, when: v => descending(v) && v.has(d => d.legs), weight: 2.5,
    fail(v) { v.mod.legsBroken = true; v.msg('Legs will not lock - touchdown limit 6 m/s', 'bad'); } },
  { id: 'leg_jam', title: 'LEG DEPLOY JAMMED', text: 'One leg stuck folded. MASH to kick it out.', kind: 'mash', n: 10, time: 6, when: v => descending(v) && v.alt < 5000 && v.has(d => d.legs), weight: 2,
    fail(v) { v.mod.legsBroken = true; } },
  { id: 'rcs_stuck', title: 'THRUSTER STUCK OPEN', text: 'Attitude thruster firing nonstop - you are spinning. MASH to close it.', kind: 'mash', n: 12, time: 6, when: inAir, weight: 2,
    start(v) { v.mod.spin = (Math.random() < 0.5 ? -1 : 1) * 0.9; }, end(v) { v.mod.spin = 0; },
    fail(v) { v.mod.spin = 0; v.omega += 1.5; } },
  { id: 'fairing', title: 'PANEL FLUTTER', text: 'Skin panel flapping at high speed. HOLD to throttle back the stress.', kind: 'hold', hold: 2, time: 5, when: v => atmo(v) && v.speed > 250, weight: 1.5,
    fail(v) { v.damageRandom(30, () => true, 'panel tore off'); } },
  { id: 'slosh', title: 'FUEL SLOSH', text: 'Propellant sloshing, rocket wobbling. Keep the nose steady within 10° for 3 s.', kind: 'steer', hold: 3, time: 8, when: v => burning(v) && v.alt > 500, weight: 2,
    start(v, e) { e.target = v.pitch; e.ph = 0; }, tick(v, e, dt) { e.ph += dt * 5; v.mod.spin = Math.sin(e.ph) * 0.7; },
    ok(v, e) { return Math.abs(v.pitch - e.target) < 0.18; }, end(v) { v.mod.spin = 0; }, fail(v) { v.damageRandom(15, d => d.fuel, 'slosh loads'); } },
  { id: 'obstacle', title: 'TERRAIN BELOW', text: 'Rocky ground under you. Choose where to come down.', kind: 'choice', time: 6, when: v => descending(v) && v.alt < 2500 && v.alt > 400, weight: 3,
    choices: [{ label: 'Drift left' }, { label: 'Hold position' }, { label: 'Drift right' }],
    start(_, e) { e.safe = Math.floor(Math.random() * 3); },
    choose(v, e, i) { if (i === e.safe) { v.msg('Clear flat ground below', 'good'); return true; } v.mod.landPenalty = 1; v.msg('Boulder field - landing will hurt', 'bad'); return false; },
    fail(v) { v.mod.landPenalty = 1; } },
  { id: 'gust_final', title: 'GUST ON FINAL', text: 'Crosswind near the ground. Keep upright within 10° for 3 s.', kind: 'steer', hold: 3, time: 8, when: v => descending(v) && v.alt < 3000, weight: 2,
    start(v, e) { e.dir = Math.random() < 0.5 ? -1 : 1; v.mod.spin = e.dir * 0.35; v.mod.gust = e.dir * v.mass() * 1.5; },
    ok(v) { return Math.abs(v.pitch) < 0.18 || v.chuteOn; }, end(v) { v.mod.spin = 0; v.mod.gust = 0; }, fail(v) { v.mod.landPenalty = 1; } },
  { id: 'bitflip', title: 'COSMIC RAY BIT-FLIP', text: 'Memory corrupted. Hit PARITY in the window.', kind: 'timing', time: 5, elec: true, when: space, weight: 1.5,
    fail(v) { v.throttle = Math.random(); v.omega += (Math.random() - 0.5) * 2; v.msg('Throttle and attitude scrambled', 'bad'); } },
  { id: 'thermal', title: 'THERMAL IMBALANCE', text: 'One side is cooking in sunlight. TAP to start a barbecue roll.', kind: 'tap', time: 5, when: space, weight: 1.5,
    fail(v) { v.damageRandom(20, d => d.fuel || d.sci, 'thermal stress'); } },
  { id: 'ice', title: 'ICE SHEDDING', text: 'Ice chunks breaking off the tank. TAP to angle away.', kind: 'tap', time: 3, when: v => inAir(v) && v.alt < 6000 && v.vVert > 0, weight: 1.5,
    fail(v) { v.damageRandom(18, d => d.engine || d.aero, 'ice impact'); } },
  { id: 'crew_panic', title: 'CREW ALARM', text: 'Cabin alarm is screaming. TAP to talk the crew down.', kind: 'tap', time: 4, when: v => inAir(v) && v.crew(), weight: 2,
    fail(v) { v.omega += (Math.random() - 0.5) * 1.5; v.throttle = Math.min(v.throttle, 0.5); v.msg('Crew grabbed the stick', 'bad'); } },
  { id: 'harmonic', title: 'STRUCTURAL RESONANCE', text: 'The whole stack is humming. HOLD to detune.', kind: 'hold', hold: 2, time: 6, when: v => burning(v) && v.fx && v.fx.stress > 0, weight: 4,
    fail(v) { v.damageRandom(45, () => true, 'resonance'); } },
  { id: 'scorch', title: 'EXHAUST BACKWASH', text: 'Exhaust is cooking the parts below the engine. Throttle down or ride it out?', kind: 'choice', time: 6, when: v => v.fx && v.fx.blocked.length && burning(v), weight: 6,
    choices: [{ label: 'Throttle to 40%' }, { label: 'Full power, accept damage' }],
    choose(v, e, i) { if (i === 0) v.throttle = Math.min(v.throttle, 0.4); else v.damageRandom(35, () => true, 'backwash'); return true; },
    fail(v) { v.damageRandom(40, () => true, 'backwash'); } },
  // ---- opportunities (positive) ----
  { id: 'ufo', title: 'UNIDENTIFIED OBJECT', text: 'Something weird out the window. TAP to photograph it - the tabloids pay.', kind: 'tap', time: 3, positive: true, when: v => inAir(v) && v.alt > 20000, weight: 0.7,
    win(v) { v.bonusCash = (v.bonusCash || 0) + 4000; v.msg('Tabloid pays $4k for the photo', 'good'); } },
  { id: 'updraft', title: 'THERMAL UPDRAFT', text: 'Rising air column! TAP to ride it.', kind: 'tap', time: 3, positive: true, when: v => inAir(v) && v.alt < 6000 && v.vVert > 0, weight: 1,
    win(v) { const r = v.r; v.vx += v.x / r * 25; v.vy += v.y / r * 25; v.msg('+25 m/s from the updraft', 'good'); } },
  { id: 'stream', title: 'LIVE STREAM SPIKE', text: 'A million viewers just tuned in. TAP to wave at the camera.', kind: 'tap', time: 3, positive: true, when: inAir, weight: 0.8,
    win(v) { v.bonusCash = (v.bonusCash || 0) + 2500; v.msg('Sponsors pay $2.5k', 'good'); } },
  { id: 'satflyby', title: 'SATELLITE FLYBY', text: 'A rival satellite is passing close. Snap a photo in the window.', kind: 'timing', time: 5, positive: true, when: space, weight: 0.8,
    win(v) { v.bonusCash = (v.bonusCash || 0) + 5000; v.msg('Intelligence agency buys the photo: $5k', 'good'); } },
];

// ---------- event runner ----------
export class FlightEvents {
  constructor(v, level) {
    this.v = v; this.active = null; this.cool = 12;
    this.rate = 1 / Math.max(14, 30 - level * 1.6);  // events per second when eligible
    this.seen = {};
  }
  update(dt) {
    const v = this.v;
    if (this.active) {
      const e = this.active;
      e.left -= dt;
      e.def.tick?.(v, e, dt);
      if (e.def.kind === 'steer') { if (e.def.ok(v, e)) e.prog += dt; else e.prog = Math.max(0, e.prog - dt * 0.5); if (e.prog >= e.def.hold) return this.resolve(true); }
      if (e.def.kind === 'hold') { if (e.holding) e.prog += dt; if (e.prog >= e.def.hold) return this.resolve(true); }
      if (e.def.kind === 'timing') e.phase = (e.phase + dt * e.speed) % 2;
      if (e.left <= 0) this.resolve(e.def.kind === 'info');
      return;
    }
    if (!v.liftoff || v.ended) return;
    this.cool -= dt;
    if (this.cool > 0) return;
    // worn parts make failures more likely
    const wear = v.live().reduce((a, p) => a + (1 - p.cond), 0) / Math.max(1, v.live().length);
    if (Math.random() > dt * this.rate * (1 + wear * 2.5)) return;
    const pool = FLIGHT_EVENTS.filter(d => { try { return d.when(v); } catch { return false; } });
    if (!pool.length) return;
    let tot = pool.reduce((a, d) => a + d.weight / (1 + (this.seen[d.id] || 0)), 0) * Math.random();
    let def = pool[0];
    for (const d of pool) { tot -= d.weight / (1 + (this.seen[d.id] || 0)); if (tot <= 0) { def = d; break; } }
    this.start(def);
  }
  start(def) {
    const v = this.v;
    // electrical problems can be shrugged off by redundant hardware
    if (def.elec && Math.random() > v.resistElec()) { v.msg(`${def.title.toLowerCase()} - backup power absorbed it`, 'good'); this.cool = 6; return; }
    this.seen[def.id] = (this.seen[def.id] || 0) + 1;
    const e = { def, left: def.time, prog: 0, taps: 0, phase: Math.random() * 2, speed: 1.1 + Math.random() * 0.7, zone: 0.55 + Math.random() * 0.8, holding: false };
    this.active = e;
    def.start?.(v, e);
    v.sounds.push(def.positive ? 'chime' : 'alarm');
    if (!def.positive && def.kind !== 'info' && v.repairs > 0) {
      v.repairs--; e.autoFix = 1.2;
      setTimeout(() => { if (this.active === e) { v.msg('Repair kit fixed it', 'good'); this.resolve(true); } }, 1200);
    }
  }
  // input from UI
  tap() {
    const e = this.active; if (!e) return;
    const k = e.def.kind;
    if (k === 'tap') this.resolve(true);
    else if (k === 'mash') { e.taps++; this.v.sounds.push('tick'); if (e.taps >= e.def.n) this.resolve(true); }
    else if (k === 'timing') {
      const p = e.phase < 1 ? e.phase : 2 - e.phase;   // 0..1 ping-pong
      if (Math.abs(p - e.zone / 1.35) < 0.11) this.resolve(true);
      else { e.misses = (e.misses || 0) + 1; this.v.sounds.push('buzz'); if (e.misses >= 2) this.resolve(false); }
    }
  }
  choose(i) {
    const e = this.active; if (!e || e.def.kind !== 'choice') return;
    const ok = e.def.choose(this.v, e, i);
    this.finish(e, ok, true);
  }
  setHold(h) { if (this.active) this.active.holding = h; }
  resolve(ok) { const e = this.active; if (!e) return; if (ok) e.def.win?.(this.v, e); else e.def.fail?.(this.v, e); this.finish(e, ok, false); }
  finish(e, ok, chosen) {
    e.def.end?.(this.v, e);
    if (!chosen && !ok && e.def.kind === 'choice') { /* fail already applied */ }
    if (ok && !e.def.positive && e.def.kind !== 'info') this.v.resolved++;
    if (!e.def.positive && e.def.kind !== 'info') { this.v.msg(ok ? `${e.def.title}: handled` : `${e.def.title}: failed`, ok ? 'good' : 'bad'); this.v.sounds.push(ok ? 'ok' : 'fail'); }
    this.active = null; this.cool = 7 + Math.random() * 8;
  }
}

// ---------- hangar events ----------
// Each returns { title, text, choices:[{label, cost?, run(S)->string}] } built from current state.
const randomPart = (filter = () => true) => pick(PARTS.filter(filter));
const catName = id => CATS.find(c => c.id === id).name;

export const HANGAR_EVENTS = [
  S => { const c = pick(CATS).id; return { title: 'Supplier flash sale', text: `A supplier is clearing stock: ${catName(c)} are 30% off while you are in the hangar.`, choices: [{ label: 'Nice', run() { S.visit.mult[c] = 0.7; return `${catName(c)} discounted.`; } }] }; },
  S => { const c = pick(['engine', 'tank', 'core']); return { title: 'Price surge', text: `Supply shortage. ${catName(c)} cost 25% more on this visit.`, choices: [{ label: 'Ugh', run() { S.visit.mult[c] = 1.25; return 'Prices up.'; } }] }; },
  S => { const fine = Math.round(S.grant() * 0.06); return { title: 'Safety inspector', text: `An inspector wants to "review your paperwork". Pay the ${fmtMoney(fine)} expedite fee, or let them dig?`, choices: [
    { label: `Pay ${fmtMoney(fine)}`, run() { S.cash -= fine; return 'Inspector leaves happy.'; } },
    { label: 'Let them dig', run() { if (Math.random() < 0.5) return 'Paperwork was clean. Inspector leaves.'; S.cash -= fine * 2; return `Violations found. Fined ${fmtMoney(fine * 2)}.`; } }] }; },
  S => { const pay = Math.round(S.grant() * 0.15); return { title: 'Sponsor offer', text: `A soda brand offers ${fmtMoney(pay)} to put their logo on your rocket. Condition: you must also hit their stunt bonus or pay it back.`, choices: [
    { label: 'Sign', run() { S.cash += pay; S.flags.sponsorDebt = pay; return `+${fmtMoney(pay)}. Complete the bonus objective or repay it.`; } },
    { label: 'Decline', run() { return 'You keep your rocket clean.'; } }] }; },
  S => { const c = Math.round(S.grant() * 0.05); return { title: 'Crane crew strike', text: 'The crane operators walked out. Without them, no auto-assembly: you build by hand.', choices: [
    { label: `Settle (${fmtMoney(c)})`, run() { S.cash -= c; return 'Crane crew back at work.'; } },
    { label: 'Build by hand', run() { S.visit.craneOff = true; return 'Crane offline this visit.'; } }] }; },
  S => { const p = randomPart(p => p.price < S.grant() * 0.3); return { title: 'Delivery mix-up', text: `A truck dropped off a ${p.name} nobody ordered. The supplier says keep it.`, choices: [{ label: 'Free stuff', run() { S.addPart(p.id, 0.8 + Math.random() * 0.2, true); return `${p.name} delivered to the bay.`; } }] }; },
  S => { const p = randomPart(p => p.price > 4000 && p.price < S.grant()); const price = Math.round(p.price * 0.25); return { title: 'Too good to be true', text: `Someone online sells a "like new" ${p.name} for ${fmtMoney(price)}.`, choices: [
    { label: `Buy for ${fmtMoney(price)}`, run() { if (S.cash < price) return 'Not enough cash.'; S.cash -= price; const ok = Math.random() < 0.5; S.addPart(p.id, ok ? 0.9 : 0.08, true); return ok ? 'It is legit! Bargain.' : 'It arrived barely holding together (8% condition).'; } },
    { label: 'Pass', run() { return 'Probably wise.'; } }] }; },
  S => { const c = Math.round(S.grant() * 0.08); return { title: 'Engineer poached', text: 'A rival agency is offering your lead engineer double. Without them you lose your free repair kit next flight.', choices: [
    { label: `Counter-offer ${fmtMoney(c)}`, run() { S.cash -= c; S.flags.engineer = true; return 'Engineer stays - and brings a repair kit to the next flight.'; } },
    { label: 'Let them go', run() { S.flags.engineer = false; return 'Engineer gone.'; } }] }; },
  S => ({ title: 'Government audit', text: 'Auditors are looking at your books.', choices: [{ label: 'Open the books', run() { const loss = Math.round(Math.max(0, S.cash) * 0.05); S.cash -= loss; return loss ? `Clawed back ${fmtMoney(loss)} of unspent money.` : 'Nothing to claw back.'; } }] }),
  S => ({ title: 'Storm front', text: 'Meteorologists forecast strong winds at launch time.', choices: [
    { label: 'Launch anyway', run() { S.visit.windy = true; return 'Expect wind shear on ascent.'; } },
    { label: 'Pay to delay ($2k)', run() { S.cash -= 2000; return 'Storm passes.'; } }] }),
  S => { const p = randomPart(p => p.price < 10000); return { title: 'Storage room find', text: `Cleaning out storage, you find an old ${p.name}.`, choices: [{ label: 'Dust it off', run() { S.addPart(p.id, 0.35 + Math.random() * 0.35, true); return `${p.name} added (well used).`; } }] }; },
  S => { const p = S.randomInventory(); if (!p) return null; return { title: 'Rats in the wiring', text: `Rats have chewed on your ${PART[p.id].name}.`, choices: [
    { label: 'Pest control ($1.5k)', run() { S.cash -= 1500; return 'Rats gone, part saved.'; } },
    { label: 'Ignore', run() { p.cond = Math.max(0.05, p.cond - 0.25); S.refreshPart(p); return `${PART[p.id].name} condition dropped to ${Math.round(p.cond * 100)}%.`; } }] }; },
  S => ({ title: 'Fuel price spike', text: 'Propellant costs are up. Tanks cost 20% more this visit.', choices: [{ label: 'OK', run() { S.visit.mult.tank = 1.2; return 'Tanks cost more.'; } }] }),
  S => { const g = Math.round(S.grant() * (0.04 + Math.random() * 0.06)); return { title: 'Fan donations', text: `Space fans crowdfunded ${fmtMoney(g)} for your program.`, choices: [{ label: 'Thank them', run() { S.cash += g; return `+${fmtMoney(g)}`; } }] }; },
  S => { const p = randomPart(); return { title: 'Manufacturing breakthrough', text: `The ${p.name} supplier found a cheaper process. Permanently 15% cheaper.`, choices: [{ label: 'Great', run() { S.partMods[p.id] = (S.partMods[p.id] || 1) * 0.85; return 'Price lowered.'; } }] }; },
  S => { const p = S.randomInventory(); if (!p) return null; const def = PART[p.id]; return { title: 'Recall notice', text: `The ${def.name} batch has a defect. Return yours for a full refund, or keep it and risk it?`, choices: [
    { label: `Return (+${fmtMoney(def.price * p.cond)})`, run() { S.cash += Math.round(def.price * p.cond); S.removePart(p.uid); return 'Refunded.'; } },
    { label: 'Keep it', run() { p.cond = Math.max(0.1, p.cond - 0.3); S.refreshPart(p); return 'Kept. It is now flagged as unreliable.'; } }] }; },
  S => ({ title: 'Crane malfunction', text: 'The assembly crane threw a gear.', choices: [
    { label: 'Repair ($3k)', run() { S.cash -= 3000; return 'Crane fixed.'; } },
    { label: 'Build by hand', run() { S.visit.craneOff = true; return 'Crane offline this visit.'; } }] }),
  S => ({ title: 'Press interview', text: 'A journalist asks how confident you are.', choices: [
    { label: 'Totally confident', run() { S.cash += 3000; S.visit.hype = true; return '+$3k in hype money. Failure now costs you more trust.'; } },
    { label: 'Cautiously optimistic', run() { return 'Sensible answer, no headline.'; } }] }),
  S => { const p = randomPart(p => p.price > 5000); return { title: 'Coffee incident', text: 'An intern spilled coffee on the parts shelf.', choices: [{ label: 'Sigh', run() { const q = S.randomInventory(); if (!q) return 'Luckily nothing was on the shelf.'; q.cond = Math.max(0.05, q.cond - 0.1); S.refreshPart(q); return `${PART[q.id].name} lost 10% condition.`; } }] }; },
  S => { const p = randomPart(p => p.price > 8000); const price = Math.round(p.price * 0.6); return { title: 'Grey market dealer', text: `A dealer offers a ${p.name} for ${fmtMoney(price)}. 25% chance customs seizes it.`, choices: [
    { label: `Risk ${fmtMoney(price)}`, run() { if (S.cash < price) return 'Not enough cash.'; S.cash -= price; if (Math.random() < 0.25) return 'Seized at customs. Money gone.'; S.addPart(p.id, 1, true); return `${p.name} delivered.`; } },
    { label: 'No thanks', run() { return 'Dealer shrugs.'; } }] }; },
  S => { const c = Math.round(S.grant() * 0.05); return { title: 'Launch insurance', text: `Insure this flight for ${fmtMoney(c)}. If it crashes, you get half the rocket value back.`, choices: [
    { label: 'Insure', run() { S.cash -= c; S.flags.insured = true; return 'Insured for this flight.'; } },
    { label: 'Fly naked', run() { return 'No insurance.'; } }] }; },
  S => ({ title: 'University partnership', text: 'A university lends you a science instrument.', choices: [{ label: 'Accept', run() { const p = pick(['sci_baro', 'sci_thermo', 'sci_sampler']); S.addPart(p, 0.9, true); return `${PART[p].name} added.`; } }] }),
  S => ({ title: 'Power outage', text: 'The hangar lost main power. Emergency lights only for a while.', choices: [{ label: 'Find a flashlight', run() { S.visit.dark = 60; return 'Lights out.'; } }] }),
  S => ({ title: 'Earth tremor', text: 'A small earthquake rattles the hangar! Loose parts on the floor are thrown around.', choices: [{ label: 'Hold on', run() { S.visit.quake = 3; return 'Check your parts for damage.'; } }] }),
  S => ({ title: 'Competitor bankrupt', text: 'A rival went bust. The used market is flooded with cheap parts.', choices: [{ label: 'Look', run() { S.refreshUsed(10, 0.35); return 'Used market restocked cheaply.'; } }] }),
  S => { const g = 1500 + Math.round(Math.random() * 4000); return { title: 'Tax refund', text: `Overpaid last quarter. ${fmtMoney(g)} back.`, choices: [{ label: 'Collect', run() { S.cash += g; return `+${fmtMoney(g)}`; } }] }; },
  S => { const c = pick(CATS).id; return { title: 'Supply chain delay', text: `${catName(c)} are out of stock on the new market this visit.`, choices: [{ label: 'Work around it', run() { S.visit.out = c; return `${catName(c)} unavailable new. Try the used market.`; } }] }; },
  S => ({ title: 'Mentor visit', text: 'A retired flight director drops by with advice and a gift.', choices: [{ label: 'Listen', run() { S.addPart('repair_kit', 1, true); return 'Free Onboard Repair Kit. Tip: put fins low and parachutes on top.'; } }] }),
  S => { const c = Math.round(S.grant() * 0.1); return { title: 'Bank loan offer', text: `Take ${fmtMoney(c)} now. Next level's grant will be reduced by ${fmtMoney(c * 1.3)}.`, choices: [
    { label: 'Take loan', run() { S.cash += c; S.flags.loan = (S.flags.loan || 0) + c * 1.3; return `+${fmtMoney(c)}`; } },
    { label: 'No debt', run() { return 'Declined.'; } }] }; },
  S => ({ title: 'Blueprint leak', text: 'Your designs leaked to a rival. Sue them?', choices: [
    { label: 'Sue ($4k)', run() { S.cash -= 4000; if (Math.random() < 0.5) { S.cash += 12000; return 'You won! +$12k settlement.'; } return 'Case dismissed.'; } },
    { label: 'Let it go', run() { return 'Moving on.'; } }] }),
  S => ({ title: 'Hangar cat', text: 'A stray cat has moved into the hangar. The crew wants to keep it.', choices: [
    { label: 'Keep the cat', run() { S.flags.cat = true; return 'The crew is happier. Repair kits are slightly faster to use.'; } },
    { label: 'Shelter', run() { return 'The cat is rehomed.'; } }] }),
  S => { const p = S.randomInventory(); if (!p) return null; const def = PART[p.id]; return { title: 'Collector offer', text: `A museum wants your ${def.name} and pays 90% of new price.`, choices: [
    { label: `Sell (+${fmtMoney(def.price * 0.9)})`, run() { S.cash += Math.round(def.price * 0.9); S.removePart(p.uid); return 'Sold to the museum.'; } },
    { label: 'Keep', run() { return 'Kept.'; } }] }; },
  S => ({ title: 'Overtime crew', text: 'The night shift offers to refurbish your worst part for $2k.', choices: [
    { label: 'Pay $2k', run() { const q = S.worstInventory(); if (!q) return 'Nothing to refurbish.'; S.cash -= 2000; q.cond = Math.min(1, q.cond + 0.4); S.refreshPart(q); return `${PART[q.id].name} refurbished to ${Math.round(q.cond * 100)}%.`; } },
    { label: 'No', run() { return 'Night shift goes home.'; } }] }),
];
