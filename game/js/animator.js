/* Procedural animation for BaseCharacter.

   Every frame builds a pose (a flat set of joint angles) for each state —
   idle, run, air — then blends them by weights that ease toward the
   controller's state. Landing is layered on top as a short compression.
   Because poses are blended rather than switched, there are no pops between
   states, and because everything is code, every skin animates identically. */

import { DIM } from './character.js';

const LEG = DIM.thigh + DIM.shin;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const damp = (a, b, rate, dt) => lerp(a, b, 1 - Math.exp(-rate * dt));

const KEYS = ['bodyY', 'pitch', 'roll', 'spineX', 'spineY', 'headX', 'headY',
  'armLX', 'armRX', 'armOut', 'elbL', 'elbR',
  'legLX', 'legRX', 'kneeL', 'kneeR', 'ankL', 'ankR', 'sy'];

const blank = () => Object.fromEntries(KEYS.map(k => [k, k === 'sy' ? 1 : 0]));

function mix(a, b, t) {
  const o = {};
  for (const k of KEYS) o[k] = lerp(a[k], b[k], t);
  return o;
}

/* Bend both knees by `a` radians with the feet staying planted under the
   hips: thigh forward, shin back twice as far, foot flat again. */
function crouch(p, a) {
  p.legLX -= a; p.legRX -= a;
  p.kneeL += 2 * a; p.kneeR += 2 * a;
  p.ankL -= a; p.ankR -= a;
  p.bodyY -= LEG * (1 - Math.cos(a));
  p.pitch += a * 0.25;
  return p;
}

export class Animator {
  constructor(character) {
    this.c = character;
    this.t = 0;
    this.phase = 0;
    this.runW = 0;
    this.airW = 0;
    this.landT = 1;
    this.landAmt = 0;
    this.jumpT = 1;
    this.roll = 0;
    this.blinkIn = 2.5;
    this.blinkT = 1;
  }

  jumped() { this.jumpT = 0; }

  landed(impactSpeed) {
    this.landT = 0;
    this.landAmt = clamp(impactSpeed / 16, 0.35, 1);
  }

  idle(t) {
    const p = blank();
    const breath = Math.sin(t * 2.1);
    p.bodyY = 0.012 * breath;
    p.sy = 1 + 0.014 * breath;
    p.spineY = 0.035 * Math.sin(t * 0.8);
    p.headY = 0.07 * Math.sin(t * 0.55) - p.spineY;
    p.headX = 0.02 * Math.sin(t * 1.3);
    p.armOut = 0.22 + 0.02 * breath;
    p.armLX = 0.04; p.armRX = 0.04;
    p.elbL = -0.18 - 0.03 * breath; p.elbR = -0.18 - 0.03 * breath;
    crouch(p, 0.06);
    return p;
  }

  run(phase, k) {
    const p = blank();
    const s = Math.sin(phase), c = Math.cos(phase);
    const A = lerp(0.45, 0.95, k);
    p.legLX = -s * A; p.legRX = s * A;
    p.kneeL = 0.2 + 1.25 * Math.max(0, c) * k;
    p.kneeR = 0.2 + 1.25 * Math.max(0, -c) * k;
    p.ankL = -0.35 * Math.max(0, c) + 0.2 * Math.max(0, -s);
    p.ankR = -0.35 * Math.max(0, -c) + 0.2 * Math.max(0, s);
    p.armLX = s * A * 0.95; p.armRX = -s * A * 0.95;
    p.elbL = -1.0 - 0.3 * Math.max(0, -s); p.elbR = -1.0 - 0.3 * Math.max(0, s);
    p.armOut = 0.27;
    p.bodyY = -0.07 + 0.11 * Math.abs(c) * k;
    p.pitch = 0.17 * k;
    p.roll = 0.04 * s * k;
    p.spineY = 0.16 * s * k;
    p.headY = -p.spineY * 0.85;      // head stays steady
    p.headX = -p.pitch * 0.7;
    p.sy = 1 + 0.025 * (Math.abs(c) - 0.5) * k;
    return p;
  }

  air(vy) {
    const p = blank();
    const tuck = clamp(1 - Math.abs(vy) / 9, 0, 1);
    if (vy > 0) {
      p.legLX = -0.25 - 0.45 * tuck; p.kneeL = 0.35 + 1.0 * tuck; p.ankL = -0.1;
      p.legRX = 0.25;                 p.kneeR = 0.45 + 0.5 * tuck; p.ankR = 0.25;
      p.armLX = -0.5; p.armRX = -0.2;
      p.armOut = 0.55 + 0.25 * tuck;
      p.elbL = -0.9; p.elbR = -0.5;
      p.pitch = 0.06;
    } else {
      const f = clamp(-vy / 12, 0, 1);  // reach for the ground as it nears
      p.legLX = -0.35 + 0.2 * f; p.kneeL = 0.9 - 0.6 * f; p.ankL = -0.1;
      p.legRX = 0.1;             p.kneeR = 0.6 - 0.35 * f; p.ankR = 0.1;
      p.armLX = -0.3; p.armRX = -0.1;
      p.armOut = 0.75 + 0.2 * f;
      p.elbL = -0.7; p.elbR = -0.6;
      p.pitch = -0.04;
    }
    p.headX = -0.08;
    p.sy = 1 + 0.03 * clamp(vy / 10, -1, 1);
    return p;
  }

  /**
   * state: { speed, maxSpeed, grounded, vy, yawRate }
   */
  update(dt, state) {
    this.t += dt;
    const k = clamp(state.speed / state.maxSpeed, 0, 1);
    this.runW = damp(this.runW, state.grounded ? k : this.runW, 12, dt);
    this.airW = damp(this.airW, state.grounded ? 0 : 1, state.grounded ? 20 : 14, dt);
    this.phase += dt * (4 + state.speed * 1.75);

    let p = mix(this.idle(this.t), this.run(this.phase, Math.max(k, 0.35)), clamp(this.runW * 1.6, 0, 1));
    p = mix(p, this.air(state.vy), this.airW);

    // Take-off push: start crouched, snap the legs straight while rising.
    if (this.jumpT < 0.18) {
      const u = this.jumpT / 0.18;
      const ext = 1 - u;
      crouch(p, 0.55 * ext * ext);
      p.armLX -= 0.9 * u * ext * 2; p.armRX -= 0.9 * u * ext * 2;
      p.ankL += 0.5 * u * ext * 2; p.ankR += 0.5 * u * ext * 2;
      p.sy *= 1 + 0.07 * u * ext * 4;
      this.jumpT += dt;
    }

    // Landing: fast drop into the knees, slower recovery, body squashes.
    if (this.landT < 1) {
      this.landT = Math.min(1, this.landT + dt / 0.32);
      const u = this.landT;
      const c = (u < 0.25 ? u / 0.25 : 1 - (u - 0.25) / 0.75) ** 1.2 * this.landAmt;
      crouch(p, 0.55 * c);
      p.armOut += 0.25 * c;
      p.elbL -= 0.35 * c; p.elbR -= 0.35 * c;
      p.headX += 0.12 * c;
      p.sy *= 1 - 0.07 * c;
    }

    // Lean into turns.
    this.roll = damp(this.roll, clamp(-state.yawRate * 0.045 * k, -0.18, 0.18), 8, dt);
    p.roll += this.roll;

    this.apply(p);
    this.blink(dt);
  }

  blink(dt) {
    this.blinkIn -= dt;
    if (this.blinkIn <= 0) { this.blinkT = 0; this.blinkIn = 2 + Math.random() * 3.5; }
    if (this.blinkT < 1) {
      this.blinkT = Math.min(1, this.blinkT + dt / 0.16);
      this.c.setBlink(Math.sin(this.blinkT * Math.PI));
    }
  }

  apply(p) {
    const j = this.c.joints;
    j.body.position.y = DIM.hipY + p.bodyY;
    j.body.rotation.set(p.pitch, 0, p.roll);
    // squash/stretch the upper body only: scaling the body pivot would
    // shorten the legs and lift the boots off the ground
    j.spine.scale.set(1 + (1 - p.sy) * 0.6, p.sy, 1 + (1 - p.sy) * 0.6);
    j.spine.rotation.set(p.spineX, p.spineY, 0);
    j.head.rotation.set(p.headX, p.headY, 0);
    j.shL.rotation.set(p.armLX, 0, p.armOut);
    j.shR.rotation.set(p.armRX, 0, -p.armOut);
    j.elL.rotation.x = p.elbL;
    j.elR.rotation.x = p.elbR;
    // legs are counter-rotated by the body's pitch so leaning forward
    // doesn't kick the feet backward
    j.hipL.rotation.x = p.legLX - p.pitch;
    j.hipR.rotation.x = p.legRX - p.pitch;
    j.knL.rotation.x = p.kneeL;
    j.knR.rotation.x = p.kneeR;
    j.anL.rotation.x = p.ankL;
    j.anR.rotation.x = p.ankR;
  }
}
