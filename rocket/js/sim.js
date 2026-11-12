// Flight physics. Pure maths, no rendering, so it can be tested headless in Node.
// The flight is simulated in 2D (the plane of the trajectory) around a round planet,
// with inverse-square gravity, an exponential atmosphere, drag, staging, fuel burn,
// variable Isp, aerodynamic stability, re-entry heating and a damage model.
import { PART } from './data.js';

export const R = 300000;          // planet radius (m) - small so orbit fits a mobile session
export const G0 = 9.81;
export const GM = G0 * R * R;
export const ATMO = 45000;        // top of atmosphere (m)
export const SCALE_H = 5500;      // atmospheric scale height (m)
export const RHO0 = 1.225;        // sea-level air density (kg/m3)

export function density(alt) {
  if (alt >= ATMO || alt < -1000) return alt < 0 ? RHO0 : 0;
  const fade = alt > ATMO - 6000 ? (ATMO - alt) / 6000 : 1;
  return RHO0 * Math.exp(-alt / SCALE_H) * fade;
}

let uidCounter = 1;

function makePart(s) {
  const d = PART[s.id];
  const cond = s.cond ?? 1;
  const maxHp = d.hp || 60;
  return {
    uid: s.uid ?? 'v' + uidCounter++, id: s.id, def: d, cond,
    maxHp, hp: maxHp * (0.35 + 0.65 * cond),
    fuel: d.fuel || 0, fuelMax: d.fuel || 0,
    payload: d.payload || 0, abl: d.shield ? d.shield.abl : 0,
    destroyed: false, stage: 0, thrustMul: 1, offT: 0, burning: false,
  };
}

export class Vessel {
  constructor(stack) {
    this.parts = stack.map(makePart);
    let sid = 0;
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i]; p.stage = sid; if (p.def.decoupler) sid++;
    }
    this.maxStage = sid; this.curStage = 0; this.ignited = false;
    this.computeFlaws();
    this.x = 0; this.y = R; this.vx = 0; this.vy = 0;
    this.heading = Math.PI / 2; this.omega = 0;
    this.throttle = 1; this.input = 0;
    this.t = 0; this.airT = 0; this.liftoff = false;
    this.landed = null; this.crashed = null; this.ended = false;
    this.heat = 0; this.chuteOn = false; this.chuteFrac = 0;
    this.maxAlt = 0; this.maxSpeed = 0;
    this.fuel0 = this.totalFuel();
    this.repairs = this.parts.reduce((a, p) => a + (p.def.repair || 0), 0);
    this.resolved = 0;
    // event-driven modifiers
    this.mod = { steer: 1, leak: 0, sasOff: 0, spin: 0, throttleStuck: -1, stuckT: 0, hudGlitch: 0, gust: 0, legsBroken: false, chuteMul: 1 };
    // weather for this flight: surface wind, jet stream and gusts (difficulty scales them)
    const lvl = stack.level || 0;
    const W = 1 + lvl * 0.12;
    this.wind = { dir: Math.random() < 0.5 ? -1 : 1, base: (2 + Math.random() * 6) * W, jet: (12 + Math.random() * 22) * W, gust: (1.5 + Math.random() * 3) * W, ph: [Math.random() * 9, Math.random() * 9, Math.random() * 9] };
    // every engine is mounted slightly off-axis; worn engines more so
    for (const p of this.parts) if (p.def.engine) p.mis = (Math.random() - 0.5) * 2 * (0.004 + (1 - p.cond) * 0.03);
    this.com = 0; this.H = 0;
    this.messages = [];     // {t,text,kind} for the HUD log
    this.dropped = [];      // separated stages, consumed by the renderer
    this.sounds = [];       // sound cues, consumed by the renderer
  }

  computeFlaws() {
    const lv = this.parts.filter(p => p.stage >= (this.curStage || 0) && !p.gone);
    const list = findFlaws(lv.map(p => p.def), lv.map(p => p.stage));
    const fx = { blocked: [], finFlip: new Set(), stress: 0, chuteMul: new Map(), satBlocked: new Set(), sepSmall: new Set(), legsOk: new Set(), shieldOk: new Set(), noseOk: false, topHeavy: false };
    for (const f of list) {
      const p = lv[f.i];
      if (f.key === 'engine_blocked') { const below = []; for (let j = f.i + 1; j < lv.length && lv[j].stage === p.stage; j++) if (!AROUND_ENGINE.has(lv[j].def.shape)) below.push(lv[j]); fx.blocked.push([p, below]); }
      if (f.key === 'fins_high') fx.finFlip.add(p.uid);
      if (f.key === 'overhang') fx.stress += 1;
      if (f.key === 'thin') fx.stress += 1.5;
      if (f.key === 'chute_buried') fx.chuteMul.set(p.uid, 0.4);
      if (f.key === 'sat_blocked') fx.satBlocked.add(p.uid);
      if (f.key === 'sep_small') fx.sepSmall.add(p.uid);
      if (f.key === 'top_heavy') fx.topHeavy = true;
    }
    // dynamic placement checks on the current stack
    const n = lv.length;
    lv.forEach((p, i) => {
      if (p.def.legs && (i === n - 1 || lv[i + 1].def.decoupler)) fx.legsOk.add(p.uid);
      if (p.def.shield) { let j = i + 1; while (j < n && lv[j].def.legs) j++; if (j === n || lv[j].def.decoupler) fx.shieldOk.add(p.uid); }
    });
    fx.noseOk = n > 0 && lv[0].def.shape === 'cone';
    this.fx = fx; this.flaws = list;
  }

  // ----- derived quantities -----
  live() { return this.parts.filter(p => p.stage >= this.curStage && !p.gone); }
  get r() { return Math.hypot(this.x, this.y); }
  get alt() { return this.r - R; }
  get speed() { return Math.hypot(this.vx, this.vy); }
  get phi() { return Math.atan2(this.y, this.x); }       // position angle on planet
  get pitch() { return wrap(this.heading - this.phi); }  // 0 = straight up
  get vVert() { return (this.vx * this.x + this.vy * this.y) / this.r; }
  get vHorz() { return (this.x * this.vy - this.y * this.vx) / this.r; }
  mass() { let m = 0; for (const p of this.live()) m += p.def.mass + p.fuel + p.payload; return m; }
  totalFuel() { let f = 0; for (const p of this.live()) f += p.fuel; return f; }
  stageFuel(s = this.curStage) { let f = 0, fm = 0; for (const p of this.parts) if (p.stage === s && !p.gone && !p.def.engine?.srb) { f += p.fuel; fm += p.fuelMax; } return [f, fm]; }
  srbFuel() { let f = 0, fm = 0; for (const p of this.parts) if (p.stage === this.curStage && !p.gone && p.def.engine?.srb) { f += p.fuel; fm += p.fuelMax; } return [f, fm]; }
  hull() { let h = 0, m = 0; for (const p of this.live()) { h += Math.max(0, p.hp); m += p.maxHp; } return m ? h / m : 0; }
  has(fn) { return this.live().some(p => !p.destroyed && fn(p.def, p)); }
  core() { return this.live().find(p => p.def.core); }
  crew() { return this.live().some(p => p.def.crew && !p.destroyed); }
  sas() { return this.live().reduce((a, p) => a + (!p.destroyed && p.def.core ? p.def.core.sas : 0), 0); }
  resistElec() { let r = 1; for (const p of this.live()) if (!p.destroyed && p.def.resist?.elec) r *= p.def.resist.elec; return r; }
  armor() { let a = 0; for (const p of this.live()) if (!p.destroyed && p.def.armor) a += p.def.armor; return Math.min(0.6, a); }
  landLimit() { if (this.mod.legsBroken) return 5; let l = 5; for (const p of this.live()) if (!p.destroyed && p.def.legs && this.fx.legsOk.has(p.uid)) l = Math.max(l, p.def.legs.limit); return l; }
  stackHeight() { return this.live().reduce((a, p) => a + p.def.h, 0); }
  maxRadius() { return this.live().reduce((a, p) => Math.max(a, p.def.r), 0.3); }

  orbit() {
    const r = this.r, v2 = this.vx ** 2 + this.vy ** 2;
    const eps = v2 / 2 - GM / r;
    const h = this.x * this.vy - this.y * this.vx;
    const e = Math.sqrt(Math.max(0, 1 + 2 * eps * h * h / (GM * GM)));
    if (eps >= 0) return { apo: Infinity, pe: (h * h / GM) / (1 + e) - R, e, escape: true };
    const a = -GM / (2 * eps);
    return { apo: a * (1 + e) - R, pe: a * (1 - e) - R, e, escape: false, period: 2 * Math.PI * Math.sqrt(a ** 3 / GM) };
  }
  inOrbit() { const o = this.orbit(); return o.pe > ATMO && this.alt > ATMO; }
  phase() {
    if (!this.liftoff) return 'pad';
    if (this.alt > ATMO) return 'space';
    if (this.vVert < -50 && this.speed > 700) return 'reentry';
    if (this.vVert < 0 && this.maxAlt > 2000) return 'descent';
    return 'ascent';
  }

  windAt(alt) {
    const w = this.wind; if (alt > ATMO) return 0;
    let v = w.base + (w.jet - w.base) * Math.min(1, Math.max(0, alt) / 11000);
    if (alt > 15000) v *= Math.max(0, 1 - (alt - 15000) / 25000);
    const t = this.t, ph = w.ph;
    const gust = w.gust * (Math.sin(t * 0.7 + ph[0]) + 0.6 * Math.sin(t * 1.9 + ph[1]) + 0.35 * Math.sin(t * 4.7 + ph[2])) * (alt < 20000 ? 1 : 0.3);
    return w.dir * v + gust;
  }
  msg(text, kind = 'info') { this.messages.push({ t: this.t, text, kind }); if (this.messages.length > 6) this.messages.shift(); }

  // ----- actions -----
  stage() {
    if (this.ended) return;
    if (!this.ignited || (!this.liftoff && this.parts.some(p => p.hangFire))) {
      // liquid engines can fail to light; worn ones fail more often
      let failed = 0;
      for (const p of this.parts) if (p.def.engine && p.stage === this.curStage && !p.gone && !p.destroyed && (!this.ignited || p.hangFire)) {
        p.spool = 0;
        const chance = p.def.engine.srb ? 0.02 : 0.08 + (1 - p.cond) * 0.35;
        if (Math.random() < chance) { p.hangFire = true; p.offT = 1e9; failed++; } else { p.hangFire = false; p.offT = 0; }
      }
      this.ignited = true; this.sounds.push('ignite');
      if (failed) this.msg(`${failed} engine${failed > 1 ? 's' : ''} failed to light - press IGNITE again`, 'bad');
      else this.msg('Ignition!', 'good');
      return;
    }
    if (this.curStage >= this.maxStage) { this.msg('No more stages'); return; }
    if (this.mod.decouplerStuck) { this.msg('Separator jammed!', 'bad'); return; }
    const drop = this.parts.filter(p => p.stage === this.curStage && !p.gone);
    const sep = drop.find(p => p.def.decoupler);
    if (sep && this.fx.sepSmall.has(sep.uid) && Math.random() < 0.5) { this.msg('Undersized separator jammed - press STAGE again', 'bad'); this.sounds.push('clunk'); this.damage(sep, 15, 'jam'); return; }
    const dh = drop.reduce((a, p) => a + p.def.h, 0);
    drop.forEach(p => { p.gone = true; });
    this.dropped.push({ parts: drop.map(p => ({ id: p.id, uid: p.uid })), x: this.x, y: this.y, vx: this.vx, vy: this.vy, heading: this.heading, omega: this.omega, dh });
    // reference point = bottom of remaining stack, so move it up
    this.x += Math.cos(this.heading) * dh; this.y += Math.sin(this.heading) * dh;
    this.curStage++;
    this.computeFlaws();
    this.msg('Stage separated', 'good');
    this.sounds.push('stage');
  }
  deployChute() {
    if (this.chuteOn || this.ended) return;
    const c = this.live().filter(p => p.def.chute && !p.destroyed);
    if (!c.length) { this.msg('No working parachute', 'bad'); return; }
    if (this.speed > 300 && density(this.alt) > 0.02) {
      c.forEach(p => { p.destroyed = true; p.hp = 0; });
      this.msg('Parachute ripped apart - too fast!', 'bad'); this.sounds.push('rip'); return;
    }
    this.chuteOn = true; this.msg('Parachute deployed', 'good'); this.sounds.push('chute');
  }
  chuteArea() { return this.live().reduce((a, p) => a + (p.def.chute && !p.destroyed ? p.def.chute.area * (this.fx.chuteMul.get(p.uid) ?? 1) : 0), 0) * this.mod.chuteMul; }

  // ----- damage -----
  damage(part, amount, reason) {
    if (!part || part.destroyed) return;
    amount *= 1 - this.armor();
    part.hp -= amount;
    if (part.hp <= 0) this.destroy(part, reason);
  }
  damageRandom(amount, filter = () => true, reason) {
    const c = this.live().filter(p => !p.destroyed && filter(p.def, p));
    if (!c.length) return null;
    // worn parts are more likely to be the ones that fail
    const w = c.map(p => 1.4 - p.cond); let s = w.reduce((a, b) => a + b, 0) * Math.random();
    for (let i = 0; i < c.length; i++) { s -= w[i]; if (s <= 0) { this.damage(c[i], amount, reason); return c[i]; } }
    this.damage(c[0], amount, reason); return c[0];
  }
  destroy(p, reason) {
    if (p.destroyed) return;
    p.destroyed = true; p.hp = 0;
    this.msg(`${p.def.name} destroyed${reason ? ' (' + reason + ')' : ''}`, 'bad');
    this.sounds.push('break');
    if (p.def.core && !this.live().some(q => q.def.core && !q.destroyed)) this.crash('Command part lost');
    if (p.fuel > 0 && p.def.fuel) { p.fuel = 0; if (Math.random() < 0.35) this.damageRandom(40, () => true, 'tank burst'); }
  }
  crash(reason) {
    if (this.ended) return;
    this.crashed = { reason, alt: this.alt, t: this.t }; this.ended = true;
    this.msg('MISSION LOST: ' + reason, 'bad'); this.sounds.push('explode');
  }

  // ----- physics step -----
  step(dt) {
    if (this.ended) return;
    this.t += dt;
    const live = this.live();
    const alt = this.alt, rho = density(alt), r = this.r;
    const ux = this.x / r, uy = this.y / r;               // local up
    const nx = Math.cos(this.heading), ny = Math.sin(this.heading);
    const speed = this.speed;
    const q = 0.5 * rho * speed * speed;                  // dynamic pressure (Pa)
    let m = this.mass();

    // --- engines ---
    let thrust = 0, gimbal = 0;
    const pAmb = rho / RHO0;
    let throttle = this.mod.throttleStuck >= 0 ? this.mod.throttleStuck : this.throttle;
    const stageTanks = live.filter(p => p.stage === this.curStage && p.def.fuel && !p.def.engine && !p.destroyed);
    let tankFuel = stageTanks.reduce((a, p) => a + p.fuel, 0);
    for (const p of live) {
      p.burning = false;
      const e = p.def.engine; if (!e || p.stage !== this.curStage || !this.ignited || p.destroyed) continue;
      if (p.offT > 0) { p.offT -= dt; continue; }
      const isp = e.ispVac + (e.ispSL - e.ispVac) * Math.min(1, pAmb);
      // engines do not respond instantly: spool-up after ignition and throttle lag
      p.spool = Math.min(1, (p.spool ?? 0) + dt / (e.srb ? 0.3 : 1.4));
      const target = e.srb ? 1 : throttle;
      p.thrNow = (p.thrNow ?? 0) + (target - (p.thrNow ?? 0)) * (1 - Math.exp(-dt / 0.35));
      const thr = p.thrNow * p.spool;
      p.F = 0;
      if (thr <= 0.001) continue;
      // combustion roughness
      const rough = 1 + (Math.random() - 0.5) * (0.03 + (1 - p.cond) * 0.12);
      let F = e.thrust * 1000 * (isp / e.ispVac) * thr * p.thrustMul * (0.85 + 0.15 * p.cond) * rough;
      let mdot = F / (isp * G0);
      if (e.srb) {
        if (p.fuel <= 0) continue;
        const use = Math.min(p.fuel, mdot * dt); p.fuel -= use; F *= use / (mdot * dt || 1);
      } else {
        if (tankFuel <= 0) continue;
        const use = Math.min(tankFuel, mdot * dt);
        F *= use / (mdot * dt || 1);
        for (const t of stageTanks) { const share = tankFuel > 0 ? t.fuel / tankFuel : 0; t.fuel = Math.max(0, t.fuel - use * share); }
        tankFuel -= use;
      }
      p.burning = F > 0; p.F = F;
      thrust += F; gimbal += (e.gimbal || 0) * (F > 0 ? 1 : 0);
    }
    // build flaw: an engine firing into parts below it
    for (const [eng, below] of this.fx.blocked) {
      if (!eng.burning) continue;
      thrust *= 0.75;
      for (const b of below) if (!b.gone && !b.destroyed) this.damage(b, 9 * dt, 'scorched by engine above');
      if (Math.random() < dt * 0.3) this.msg(`${eng.def.name} is scorching the parts below it!`, 'bad');
    }
    // continuous leaks from events
    if (this.mod.leak > 0 && tankFuel > 0) {
      const leak = Math.min(tankFuel, this.mod.leak * dt);
      for (const t of stageTanks) t.fuel = Math.max(0, t.fuel - leak * (t.fuel / tankFuel));
    }

    // --- drag ---
    const rm = this.maxRadius();
    let cd = 0.75; if (this.fx.noseOk && !live[0].destroyed) cd += -0.25;
    if (this.chuteOn) this.chuteFrac = Math.min(1, this.chuteFrac + dt / 2.5);
    let CdA = cd * Math.PI * rm * rm + this.chuteFrac * this.chuteArea() * 1.0;
    if (this.landed) CdA = 0;
    // wind: horizontal, grows with height up to the jet stream, plus gusts
    const wv = this.liftoff && !this.landed ? this.windAt(alt) : 0;
    const rvx = this.vx - (-uy) * wv, rvy = this.vy - ux * wv;   // air-relative velocity
    const air = Math.hypot(rvx, rvy);
    const qa = 0.5 * rho * air * air;
    const drag = air > 0 ? 0.5 * rho * air * CdA : 0;   // F = drag * v_rel (vector form)

    // --- gravity ---
    const g = GM / (r * r);

    // --- wind gusts (events) ---
    const gx = -uy * this.mod.gust, gy = ux * this.mod.gust;

    let ax = -g * ux + (thrust * nx - drag * rvx) / m + gx / m;
    let ay = -g * uy + (thrust * ny - drag * rvy) / m + gy / m;

    // --- attitude: torques about the centre of mass, divided by the moment of inertia ---
    let yb = 0, M = 0, My = 0; const seg = [];
    for (let i = live.length - 1; i >= 0; i--) { const p = live[i]; const mi = p.def.mass + p.fuel + p.payload; seg.push([p, yb, mi]); M += mi; My += mi * (yb + p.def.h / 2); yb += p.def.h; }
    const H = Math.max(0.5, yb), com = My / M;
    let I = 0; for (const [p, y0, mi] of seg) { const d = y0 + p.def.h / 2 - com; I += mi * (d * d + p.def.h * p.def.h / 12 + p.def.r * p.def.r / 4); }
    this.com = com; this.H = H;
    const sasOn = this.mod.sasOff <= 0;
    if (this.mod.sasOff > 0) this.mod.sasOff -= dt;
    const sas = sasOn ? this.sas() : 0;
    const S = Math.PI * rm * rm;
    let tau = 0;
    // engines: gimbal authority and off-axis thrust
    let gimbalT = 0;
    for (const [p, y0] of seg) if (p.burning) {
      const lever = com - (y0 + p.def.h * 0.75);
      tau += p.F * Math.sin(p.mis || 0) * lever;
      gimbalT += p.F * Math.sin(0.04 * (p.def.engine.gimbal || 0)) * Math.abs(lever);
    }
    const rwT = sas * 260;                                         // reaction wheels (N m)
    const steerT = live.reduce((a2, p) => a2 + (!p.destroyed && p.def.aero?.steer ? p.def.aero.steer : 0), 0) * qa * S * H * 0.04;
    const ctl = (gimbalT + rwT + steerT) * this.mod.steer;
    tau += this.input * ctl;
    // SAS only damps rotation; it does not hold your heading
    if (this.input === 0 && sasOn) tau += Math.max(-ctl * 0.8, Math.min(ctl * 0.8, -this.omega * I * 2.2));
    // aerodynamics: normal force on the nose (destabilising) and on fins/tail (stabilising)
    if (air > 8 && rho > 0) {
      const aoa = wrap(Math.atan2(rvy, rvx) - this.heading);
      const sa = Math.sin(aoa);
      tau += qa * S * 0.55 * sa * (com - H * 0.72);
      for (const [p, y0] of seg) {
        if (p.destroyed) continue;
        let area = 0;
        if (p.def.aero?.stab) area = p.def.aero.stab * 2.2 * p.def.r * p.def.r;
        else if (p.def.legs) area = 0.5 * p.def.r * p.def.r;
        else if (p.def.engine) area = 0.25 * p.def.r * p.def.r;
        if (area) tau += qa * area * sa * (com - (y0 + p.def.h / 2));
      }
      tau += -this.omega * qa * S * H * H * 0.9 / Math.max(air, 15);   // pitch damping
      // turbulence
      tau += (Math.random() - 0.5) * qa * S * H * (0.02 + this.wind.gust * 0.003);
      // structural stress when flying sideways at high dynamic pressure
      if (Math.abs(aoa) > 0.5 && qa > 12000 && Math.abs(aoa) < Math.PI - 0.3) {
        if (Math.random() < dt * 2) this.damageRandom(qa / 3000 * dt * 8, () => true, 'aerodynamic stress');
      }
    }
    // build flaw: weak joints / slender stack flex and wobble under dynamic pressure
    if (this.fx.stress > 0 && qa > 6000) {
      tau += (Math.random() - 0.5) * this.fx.stress * qa * S * H * 0.25;
      if (qa > 14000 && Math.random() < dt * this.fx.stress * 0.8) this.damageRandom(qa / 1500 * this.fx.stress, () => true, 'structure flexing');
    }
    // parachute: pulls the top of the rocket along the airflow, so it hangs underneath
    if (this.chuteFrac > 0.05 && air > 1) {
      const Fc = 0.5 * rho * air * air * this.chuteFrac * this.chuteArea();
      const back = wrap(Math.atan2(-rvy, -rvx) - this.heading);
      tau += Fc * (H - com) * Math.sin(back) - this.omega * I * 1.5;
    }
    let alpha = tau / I + this.mod.spin * 1.2;
    alpha = Math.max(-15, Math.min(15, alpha));
    this.omega += alpha * dt;
    this.omega *= Math.exp(-0.05 * dt);
    const h0 = this.heading;
    this.heading += this.omega * dt;
    // the rocket turns about its centre of mass, so the bottom of the stack swings
    if (this.liftoff) { this.x -= com * (Math.cos(this.heading) - Math.cos(h0)); this.y -= com * (Math.sin(this.heading) - Math.sin(h0)); }

    // --- on the pad / ground ---
    if (!this.liftoff) {
      const up = (thrust / m) - g;
      if (up <= 0) { this.vx = this.vy = 0; this.heading = this.phi; this.omega = 0; this.t -= dt; return; }
      if (alt > 3) { this.liftoff = true; this.msg('Liftoff!', 'good'); this.sounds.push('liftoff'); }
    }

    this.vx += ax * dt; this.vy += ay * dt;
    this.x += this.vx * dt; this.y += this.vy * dt;
    if (this.liftoff) this.airT += dt;

    // --- heating ---
    if (rho > 0 && speed > 700) {
      let rate = 9e-6 * rho * Math.pow(speed - 700, 3);
      const sh = live.find(p => p.def.shield && !p.destroyed && p.abl > 0 && this.fx.shieldOk.has(p.uid));
      if (sh) { sh.abl -= rate * dt * 0.05; rate *= 0.08; }
      this.heat += rate * dt;
    }
    this.heat = Math.max(0, this.heat - dt * (rho > 0 ? 4 : 2.5));
    if (this.heat > 100) {
      this.damageRandom((this.heat - 100) * dt * 2.5, () => true, 'overheating');
      if (this.heat > 160) this.heat = 160;
    }

    // --- stats ---
    const a2 = this.alt;
    if (a2 > this.maxAlt) this.maxAlt = a2;
    if (this.speed > this.maxSpeed) this.maxSpeed = this.speed;

    // --- touchdown ---
    if (a2 <= 0 && this.liftoff) this.touchdown();
  }

  touchdown() {
    const vr = this.vVert, vt = this.vHorz;
    const impact = Math.abs(vr), slide = Math.abs(vt);
    const limit = this.landLimit() * (this.mod.landPenalty ? 0.6 : 1);
    const tilt = Math.abs(this.pitch);
    // put the vessel on the surface
    const r = this.r; this.x *= R / r; this.y *= R / r;
    if (impact > limit * 2 || slide > 20 || (impact > 4 && tilt > 1.2)) {
      this.crash(`impact at ${impact.toFixed(1)} m/s`); return;
    }
    let dmg = 0;
    if (impact > limit) dmg += (impact - limit) / limit * 120;
    if (tilt > 0.45) dmg += 25 + tilt * 30;
    if (slide > 7) dmg += (slide - 7) * 6;
    if (dmg > 0) {
      // the bottom of the rocket takes the hit
      const lv = this.live();
      for (let i = lv.length - 1, k = 0; i >= 0 && k < 3; i--, k++) this.damage(lv[i], dmg * (k === 0 ? 1 : 0.5), 'hard landing');
      this.msg(`Hard landing at ${impact.toFixed(1)} m/s`, 'warn');
    }
    if (this.ended) return;
    this.vx = this.vy = 0; this.omega = 0;
    this.landed = { impact, slide, tilt, t: this.t, hull: this.hull(), fuel: this.fuel0 > 0 ? this.totalFuel() / this.fuel0 : 0, dist: this.phi !== undefined ? Math.abs(wrap(this.phi - Math.PI / 2)) * R : 0, damaged: dmg > 0 };
    this.ended = true;
    this.msg('Touchdown!', 'good'); this.sounds.push('land');
  }
}


// ---------- build flaws ----------
// Mistakes in how the stack is assembled. Each has a real physical effect in flight
// (see Vessel.computeFlaws / step), and the blueprint editor lists them before you buy.
const AROUND_ENGINE = new Set(['legs', 'fins', 'gridfins']);
export function findFlaws(defs, stageOf) {
  const out = [];
  const n = defs.length; if (!n) return out;
  if (!stageOf) { stageOf = []; let s = 0; for (let i = n - 1; i >= 0; i--) { stageOf[i] = s; if (defs[i].decoupler) s++; } }
  const H = defs.reduce((a, d) => a + d.h, 0);
  const maxR = defs.reduce((a, d) => Math.max(a, d.r), 0.3);
  // height of each part's centre from the bottom
  const yc = []; let y = 0; for (let i = n - 1; i >= 0; i--) { yc[i] = y + defs[i].h / 2; y += defs[i].h; }
  for (let i = 0; i < n; i++) {
    const d = defs[i];
    if (d.engine) {
      const below = [];
      for (let j = i + 1; j < n && stageOf[j] === stageOf[i]; j++) if (!AROUND_ENGINE.has(defs[j].shape)) below.push(j);
      if (below.length) out.push({ key: 'engine_blocked', sev: 3, i, text: `${d.name} fires straight into ${defs[below[0]].name} below it. Engines must be at the bottom of their stage.` });
    }
    if ((d.shape === 'fins' || d.shape === 'gridfins') && yc[i] > H * 0.5 && n > 2) out.push({ key: 'fins_high', sev: 2, i, text: `${d.name} sit in the upper half: fins up there flip the rocket instead of steadying it.` });
    if (i + 1 < n && d.r > defs[i + 1].r * 1.4 + 0.1 && !['shield', 'legs', 'fins', 'gridfins', 'chute', 'cone'].includes(d.shape) && !['fins', 'gridfins', 'legs', 'engine', 'vacengine', 'decoupler'].includes(defs[i + 1].shape)) out.push({ key: 'overhang', sev: 2, i, text: `Wide ${d.name} sits on narrow ${defs[i + 1].name}: weak joint that cracks under air pressure.` });
    if (d.shape === 'cone' && i !== 0) out.push({ key: 'nose_low', sev: 1, i, text: `${d.name} is not on top: no drag benefit, just dead weight.` });
    if (d.chute && i > 2) out.push({ key: 'chute_buried', sev: 2, i, text: `${d.name} is buried under ${i} parts: the lines snag and it only gives 40% of its drag.` });
    if (d.sat && defs.slice(0, i).some(o => o.shape !== 'cone')) out.push({ key: 'sat_blocked', sev: 3, i, text: `${d.name} has parts above it: the satellite cannot get out. Only a nose cone may sit above a payload.` });
    if (d.decoupler && i > 0 && d.r < defs[i - 1].r * 0.7) out.push({ key: 'sep_small', sev: 2, i, text: `${d.name} is too narrow for ${defs[i - 1].name} above it: separation can jam.` });
    if (d.legs) { const bot = i === n - 1 || defs[i + 1].decoupler; if (!bot) out.push({ key: 'legs_high', sev: 2, i, text: `${d.name} are not at the bottom of a stage: they will never touch the ground.` }); }
    if (d.shield) { let j = i + 1; while (j < n && defs[j].legs) j++; if (!(j === n || defs[j].decoupler)) out.push({ key: 'shield_misplaced', sev: 2, i, text: `${d.name} is not at the bottom of its stage: it cannot face the heat on re-entry.` }); }
  }
  if (H / (2 * maxR) > 15) out.push({ key: 'thin', sev: 2, i: -1, text: `Very tall and thin (${H.toFixed(1)} m tall): it flexes and wobbles at high speed.` });
  const M = defs.reduce((a, d) => a + d.mass + (d.fuel || 0) + (d.payload || 0), 0);
  const com = defs.reduce((a, d, i) => a + (d.mass + (d.fuel || 0) + (d.payload || 0)) * yc[i], 0) / M;
  const lowFins = defs.some((d, i) => d.aero?.stab && yc[i] <= H * 0.5);
  if (n > 2 && com > H * 0.62 && !lowFins) out.push({ key: 'top_heavy', sev: 2, i: -1, text: 'Top-heavy with no low fins: it will try to tumble whenever the engines stop pushing.' });
  return out;
}

export function wrap(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }

// Static design analysis for the blueprint editor: delta-v and TWR per stage.
export function analyse(ids) {
  const parts = ids.map(id => PART[id]).filter(Boolean);
  let sid = 0; const stageOf = [];
  for (let i = parts.length - 1; i >= 0; i--) { stageOf[i] = sid; if (parts[i].decoupler) sid++; }
  const stages = [];
  let total = 0;
  for (let s = 0; s <= sid; s++) {
    const above = parts.filter((p, i) => stageOf[i] >= s);
    const mine = parts.filter((p, i) => stageOf[i] === s);
    const wet = above.reduce((a, p) => a + p.mass + (p.fuel || 0) + (p.payload || 0), 0);
    const engines = mine.filter(p => p.engine);
    const liquidFuel = mine.filter(p => p.fuel && !p.engine).reduce((a, p) => a + p.fuel, 0);
    const srbFuel = engines.filter(e => e.engine.srb).reduce((a, p) => a + p.fuel, 0);
    const hasLiquid = engines.some(e => !e.engine.srb);
    const burnable = (hasLiquid ? liquidFuel : 0) + srbFuel;
    const dry = wet - burnable;
    const tv = engines.reduce((a, e) => a + e.engine.thrust, 0);
    const ispV = tv ? tv / engines.reduce((a, e) => a + e.engine.thrust / e.engine.ispVac, 0) : 0;
    const tsl = engines.reduce((a, e) => a + e.engine.thrust * e.engine.ispSL / e.engine.ispVac, 0);
    const ispS = tsl ? tsl / engines.reduce((a, e) => a + e.engine.thrust * e.engine.ispSL / e.engine.ispVac / e.engine.ispSL, 0) : 0;
    const dvV = engines.length && dry > 0 ? ispV * G0 * Math.log(wet / dry) : 0;
    const dvS = engines.length && dry > 0 ? ispS * G0 * Math.log(wet / dry) : 0;
    stages.push({ s, wet, dry, dvVac: dvV, dvSL: dvS, twrSL: tsl * 1000 / (wet * G0), twrVac: tv * 1000 / (wet * G0), engines: engines.length, unusedFuel: !hasLiquid && liquidFuel > 0 });
    total += dvV;
  }
  const cost = parts.reduce((a, p) => a + p.price, 0);
  const wet = parts.reduce((a, p) => a + p.mass + (p.fuel || 0) + (p.payload || 0), 0);
  const warnings = [];
  if (!parts.some(p => p.core)) warnings.push('No command part: the rocket cannot be controlled.');
  if (!parts.some(p => p.engine)) warnings.push('No engine.');
  if (stages[0] && stages[0].engines === 0 && parts.length) warnings.push('The bottom stage has no engine: it will never leave the pad.');
  if (stages[0] && stages[0].twrSL < 1 && stages[0].engines) warnings.push(`Launch thrust-to-weight ${stages[0].twrSL.toFixed(2)} is below 1: it will not lift off.`);
  if (stages.some(s => s.unusedFuel)) warnings.push('A stage has fuel tanks but only solid boosters: that fuel is dead weight.');
  if (!parts.some(p => p.chute || p.legs)) warnings.push('No parachute or landing legs: landing will be very hard.');
  if (parts.length && !parts.some(p => p.aero?.stab)) warnings.push('No fins: the rocket is aerodynamically unstable when not thrusting.');
  stages.forEach((s, i) => { if (i > 0 && s.engines === 0 && parts.filter((p, k) => stageOf[k] === i).some(p => p.fuel)) warnings.push(`Stage ${i + 1} has fuel but no engine.`); });
  const flaws = findFlaws(parts, stageOf);
  return { stages, totalDv: total, cost, wet, warnings, stageOf, flaws };
}
