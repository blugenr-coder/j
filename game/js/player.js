/* Player controller: input → velocity → collision → ground detection.

   The player is an upright cylinder (radius R, height H) standing on its
   feet position. Horizontal movement is resolved against the world's boxes
   and cylinders by pushing out along the shortest direction; vertical
   movement snaps to the highest surface under the feet, which is what lets
   the character stand on crates, step up small ledges and walk off edges. */

import * as THREE from '../vendor/three.module.min.js';

const R = 0.55, H = 3.4, STEP = 0.45;
const GRAVITY = 32, JUMP_V = 12.5, COYOTE = 0.1, BUFFER = 0.12;
export const RUN_SPEED = 7.5;

const damp = (a, b, rate, dt) => a + (b - a) * (1 - Math.exp(-rate * dt));
const wrapAngle = a => Math.atan2(Math.sin(a), Math.cos(a));

export class Player {
  constructor(character, animator, colliders, spawn) {
    this.char = character;
    this.anim = animator;
    this.colliders = colliders;
    this.pos = spawn.clone();
    this.vel = new THREE.Vector3();
    this.grounded = true;
    this.yaw = 0.45;             // three-quarter view toward the camera on load
    this.yawRate = 0;
    this.sinceGround = 0;
    this.jumpBuffered = 1;
    this.peakVy = 0;
  }

  requestJump() { this.jumpBuffered = 0; }

  /** move: {x, z} in world space, length ≤ 1. */
  update(dt, move) {
    // Fixed small sub-steps keep collisions stable at low frame rates.
    const steps = Math.ceil(dt / (1 / 120));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) this.#step(h, move);

    // Turn toward the direction of travel.
    const speed = Math.hypot(this.vel.x, this.vel.z);
    const prevYaw = this.yaw;
    if (Math.hypot(move.x, move.z) > 0.1) {
      const target = Math.atan2(move.x, move.z);
      this.yaw += wrapAngle(target - this.yaw) * (1 - Math.exp(-14 * dt));
    }
    this.yawRate = dt > 0 ? wrapAngle(this.yaw - prevYaw) / dt : 0;

    const root = this.char.root;
    root.position.copy(this.pos);
    root.rotation.y = this.yaw;

    this.anim.update(dt, {
      speed, maxSpeed: RUN_SPEED, grounded: this.grounded, vy: this.vel.y, yawRate: this.yawRate,
    });
  }

  #step(dt, move) {
    const { vel, pos } = this;
    const accel = this.grounded ? 60 : 18;
    vel.x = damp(vel.x, move.x * RUN_SPEED, accel / RUN_SPEED, dt);
    vel.z = damp(vel.z, move.z * RUN_SPEED, accel / RUN_SPEED, dt);

    // jump, with a short coyote window and input buffer so it feels fair
    this.jumpBuffered += dt;
    this.sinceGround = this.grounded ? 0 : this.sinceGround + dt;
    if (this.jumpBuffered < BUFFER && this.sinceGround < COYOTE && vel.y <= 0.01) {
      vel.y = JUMP_V;
      this.grounded = false;
      this.sinceGround = COYOTE;
      this.jumpBuffered = BUFFER;
      this.anim.jumped();
    }

    vel.y -= GRAVITY * dt;

    pos.x += vel.x * dt;
    pos.z += vel.z * dt;
    this.#resolveHorizontal();

    const prevY = pos.y;
    pos.y += vel.y * dt;
    this.#ceiling(prevY);

    const ground = this.groundHeight(pos.x, pos.z, Math.max(prevY, pos.y) + STEP);
    if (pos.y <= ground && vel.y <= 0) {
      if (!this.grounded && -vel.y > 4) this.anim.landed(-vel.y);
      pos.y = ground;
      vel.y = 0;
      this.grounded = true;
    } else if (this.grounded && pos.y - ground < STEP && vel.y <= 0) {
      pos.y = ground; // walking down a small ledge stays glued to it
      vel.y = 0;
    } else {
      this.grounded = false;
    }
  }

  /** Highest walkable surface under the player whose top is below maxTop. */
  groundHeight(x, z, maxTop) {
    let best = 0;
    const r = R * 0.7;
    for (const c of this.colliders) {
      let top, over;
      if (c.type === 'box') {
        top = c.max.y;
        over = x > c.min.x - r && x < c.max.x + r && z > c.min.z - r && z < c.max.z + r;
      } else {
        top = c.y1;
        over = Math.hypot(x - c.x, z - c.z) < c.r + r;
      }
      if (over && top <= maxTop && top > best) best = top;
    }
    return best;
  }

  #overlapsY(y0, y1) {
    // a top within STEP of the feet is something to step onto, not a wall
    return y1 - this.pos.y > STEP && this.pos.y + H > y0;
  }

  #resolveHorizontal() {
    const p = this.pos;
    for (let iter = 0; iter < 2; iter++) {
      for (const c of this.colliders) {
        if (c.type === 'box') {
          if (!this.#overlapsY(c.min.y, c.max.y)) continue;
          const cx = Math.max(c.min.x, Math.min(p.x, c.max.x));
          const cz = Math.max(c.min.z, Math.min(p.z, c.max.z));
          let dx = p.x - cx, dz = p.z - cz;
          const d = Math.hypot(dx, dz);
          if (d >= R) continue;
          if (d > 1e-5) {
            p.x = cx + (dx / d) * R;
            p.z = cz + (dz / d) * R;
            this.#cancelInto(dx / d, dz / d);
          } else {
            // centre inside the box: leave by the nearest face
            const opts = [[c.min.x - R - p.x, 0], [c.max.x + R - p.x, 0], [0, c.min.z - R - p.z], [0, c.max.z + R - p.z]];
            opts.sort((a, b) => Math.abs(a[0] + a[1]) - Math.abs(b[0] + b[1]));
            p.x += opts[0][0]; p.z += opts[0][1];
          }
        } else {
          if (!this.#overlapsY(c.y0, c.y1)) continue;
          const dx = p.x - c.x, dz = p.z - c.z;
          const d = Math.hypot(dx, dz), min = R + c.r;
          if (d >= min || d < 1e-5) continue;
          p.x = c.x + (dx / d) * min;
          p.z = c.z + (dz / d) * min;
          this.#cancelInto(dx / d, dz / d);
        }
      }
    }
  }

  // remove the part of the velocity pushing into a surface (slide along it)
  #cancelInto(nx, nz) {
    const into = this.vel.x * nx + this.vel.z * nz;
    if (into < 0) { this.vel.x -= into * nx; this.vel.z -= into * nz; }
  }

  #ceiling(prevY) {
    if (this.vel.y <= 0) return;
    const p = this.pos;
    for (const c of this.colliders) {
      if (c.type !== 'box') continue;
      const over = p.x > c.min.x - R * 0.6 && p.x < c.max.x + R * 0.6 && p.z > c.min.z - R * 0.6 && p.z < c.max.z + R * 0.6;
      if (over && prevY + H <= c.min.y + 0.01 && p.y + H > c.min.y) {
        p.y = c.min.y - H;
        this.vel.y = 0;
      }
    }
  }
}
