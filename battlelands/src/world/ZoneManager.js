/* The safe zone: wait → warning → shrink, repeated. Each next circle sits
   somewhere random inside the current one (never just the exact centre), on
   land, fully on the island. The wait before each shrink stretches or
   compresses with how many players are still alive. */

import { CONFIG } from '../core/config.js';
import { clamp, lerp, dist } from '../core/math.js';

export class ZoneManager {
  constructor(match, rng) {
    this.match = match;
    this.rng = rng;
    const S = CONFIG.map.size;
    this.cfg = CONFIG.zone;
    this.currentCenter = { x: S / 2 + rng.range(-120, 120), y: S / 2 + rng.range(-120, 120) };
    this.currentRadius = this.cfg.startRadius;
    this.startCenter = { ...this.currentCenter };
    this.startRadius = this.currentRadius;
    this.phaseIndex = 0;
    this.stage = 'idle';        // idle | wait | warning | shrinking | final
    this.timer = 0;
    this.stageDuration = 0;
    this.nextCenter = null;
    this.nextRadius = 0;
    this.dps = 1;
    this.pressure = 1;
  }

  get phase() { return this.cfg.phases[this.phaseIndex]; }

  start() { this._beginWait(); }

  _pickNext() {
    const map = this.match.map;
    const p = this.phase;
    const S = map.size;
    const R = this.currentRadius, r = p.radius;
    const c = this.currentCenter;
    for (let i = 0; i < 40; i++) {
      const a = this.rng.range(0, Math.PI * 2);
      const d = Math.sqrt(this.rng.next()) * Math.max(0, R - r) * 0.92;
      const x = c.x + Math.cos(a) * d, y = c.y + Math.sin(a) * d;
      const m = map.border + Math.max(r * 0.55, 90);
      if (x < m || y < m || x > S - m || y > S - m) continue;
      if (r < 400 && map.isWater(x, y, 40) && i < 35) continue; // small circles end on dry land
      return { x, y };
    }
    return { x: clamp(c.x, map.border + 200, S - map.border - 200), y: clamp(c.y, map.border + 200, S - map.border - 200) };
  }

  _beginWait() {
    const p = this.phase;
    // Pacing controller: more alive than planned → shorter wait.
    const alive = this.match.aliveCount();
    const ratio = (alive - p.targetAlive) / Math.max(4, p.targetAlive);
    this.pressure = clamp(1 - ratio * 0.5, this.cfg.pressureMin, this.cfg.pressureMax);
    this.stage = 'wait';
    this.stageDuration = p.wait * this.pressure;
    this.timer = this.stageDuration;
    this.nextRadius = p.radius;
    this.nextCenter = this._pickNext();
    this.dps = this.phaseIndex === 0 ? 1 : this.cfg.phases[this.phaseIndex - 1].dps;
  }

  update(dt) {
    if (this.stage === 'idle' || this.stage === 'final') return;
    this.timer -= dt;
    if (this.stage === 'wait' && this.timer <= 0) {
      this.stage = 'warning';
      this.stageDuration = this.timer = this.phase.warning;
      this.match.bus.emit('zoneWarning', { phase: this.phaseIndex, center: this.nextCenter, radius: this.nextRadius, time: this.phase.warning });
    } else if (this.stage === 'warning' && this.timer <= 0) {
      this.stage = 'shrinking';
      this.stageDuration = this.timer = this.phase.shrink;
      this.startCenter = { ...this.currentCenter };
      this.startRadius = this.currentRadius;
      this.dps = this.phase.dps;
      this.match.bus.emit('zoneShrink', { phase: this.phaseIndex });
    } else if (this.stage === 'shrinking') {
      const t = clamp(1 - this.timer / this.stageDuration, 0, 1);
      this.currentCenter.x = lerp(this.startCenter.x, this.nextCenter.x, t);
      this.currentCenter.y = lerp(this.startCenter.y, this.nextCenter.y, t);
      this.currentRadius = lerp(this.startRadius, this.nextRadius, t);
      if (this.timer <= 0) {
        this.currentRadius = this.nextRadius;
        this.match.bus.emit('zoneSettled', { phase: this.phaseIndex });
        if (this.phaseIndex < this.cfg.phases.length - 1) { this.phaseIndex++; this._beginWait(); }
        else { this.stage = 'final'; this.dps = this.phase.dps * 1.5; }
      }
    }
  }

  isOutside(x, y, pad = 0) { return dist(x, y, this.currentCenter.x, this.currentCenter.y) > this.currentRadius - pad; }
  insideNext(x, y, pad = 0) {
    if (!this.nextCenter) return !this.isOutside(x, y, pad);
    return dist(x, y, this.nextCenter.x, this.nextCenter.y) < this.nextRadius - pad;
  }

  /* Where to stand to be safe: the next circle while it's announced, else current. */
  safeTarget() {
    const useNext = this.stage === 'warning' || this.stage === 'shrinking';
    return useNext && this.nextCenter
      ? { x: this.nextCenter.x, y: this.nextCenter.y, r: this.nextRadius }
      : { x: this.currentCenter.x, y: this.currentCenter.y, r: this.currentRadius };
  }

  /* Seconds until the circle next starts moving (for the HUD). */
  countdown() {
    if (this.stage === 'wait') return this.timer + this.phase.warning;
    if (this.stage === 'warning') return this.timer;
    return this.timer;
  }
}
