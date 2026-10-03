/* Circular minimap: a local window around the player with the safe zone,
   the next zone, POIs and you. Redrawn at ~20 Hz — plenty for something
   this size, and it keeps the main frame cheap. */
import { getGround, GROUND_SCALE } from '../render/GroundRenderer.js';
import { t } from './i18n.js';

export class Minimap {
  constructor(canvas, radiusUnits = 950) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.R = radiusUnits;
    this.acc = 0;
    this.resize();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const s = this.cv.clientWidth || 108;
    this.cv.width = this.cv.height = Math.round(s * dpr);
    this.px = this.cv.width;
  }

  update(dt, match) {
    this.acc += dt;
    if (this.acc < 0.05) return;
    this.acc = 0;
    const c = this.ctx, W = this.px, p = match.player, map = match.map, z = match.zone;
    const k = W / (this.R * 2);
    const cx = p.x, cy = p.y;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, W, W);
    c.save();
    c.beginPath(); c.arc(W / 2, W / 2, W / 2, 0, Math.PI * 2); c.clip();
    c.fillStyle = '#2C7DC0'; c.fillRect(0, 0, W, W);
    const g = getGround(map), gs = GROUND_SCALE;
    c.setTransform(k, 0, 0, k, W / 2 - cx * k, W / 2 - cy * k);
    const x0 = Math.max(0, cx - this.R), y0 = Math.max(0, cy - this.R), x1 = Math.min(map.size, cx + this.R), y1 = Math.min(map.size, cy + this.R);
    if (x1 > x0 && y1 > y0) c.drawImage(g, x0 * gs, y0 * gs, (x1 - x0) * gs, (y1 - y0) * gs, x0, y0, x1 - x0, y1 - y0);
    // buildings as blocks so towns read
    c.fillStyle = 'rgba(16,22,42,0.55)';
    for (const b of map.buildings) if (Math.abs(b.x - cx) < this.R + 200 && Math.abs(b.y - cy) < this.R + 200) c.fillRect(b.x, b.y, b.w, b.h);
    if (match.phase === 'live' || match.phase === 'over') {
      // outside the zone
      c.beginPath(); c.rect(cx - this.R * 2, cy - this.R * 2, this.R * 4, this.R * 4);
      c.arc(z.currentCenter.x, z.currentCenter.y, Math.max(0, z.currentRadius), 0, Math.PI * 2, true);
      c.fillStyle = 'rgba(255,107,107,0.38)'; c.fill('evenodd');
      c.lineWidth = 3 / k * 0.9; c.strokeStyle = '#FFFFFF';
      c.beginPath(); c.arc(z.currentCenter.x, z.currentCenter.y, Math.max(0, z.currentRadius), 0, Math.PI * 2); c.stroke();
      if ((z.stage === 'warning' || z.stage === 'shrinking') && z.nextCenter) {
        c.setLineDash([8 / k, 6 / k]); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 2 / k;
        c.beginPath(); c.arc(z.nextCenter.x, z.nextCenter.y, Math.max(1, z.nextRadius), 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
      }
    }
    // POIs: small diamonds, legendary towns in orange
    for (const q of map.pois) {
      if (Math.abs(q.x - cx) > this.R + 100 || Math.abs(q.y - cy) > this.R + 100) continue;
      c.fillStyle = q.tier === 3 ? '#FF9F43' : '#F8FAFC';
      c.save(); c.translate(q.x, q.y); c.rotate(Math.PI / 4); c.fillRect(-4 / k, -4 / k, 8 / k, 8 / k); c.restore();
    }
    c.restore();
    // player arrow, always centre
    c.setTransform(1, 0, 0, 1, W / 2, W / 2);
    c.rotate(p.aimAngle);
    const s = W / 108;
    c.fillStyle = '#FFD43B'; c.strokeStyle = '#10162A'; c.lineWidth = 2 * s;
    c.beginPath(); c.moveTo(9 * s, 0); c.lineTo(-6 * s, -6 * s); c.lineTo(-3 * s, 0); c.lineTo(-6 * s, 6 * s); c.closePath(); c.fill(); c.stroke();
    c.setTransform(1, 0, 0, 1, 0, 0);
  }
}

/* Full-island map (tap the minimap, or M). Also used on the deploy screen. */
export function drawFullMap(canvas, match, opts = {}) {
  const map = match.map;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const size = canvas.clientWidth;
  canvas.width = canvas.height = Math.round(size * dpr);
  const c = canvas.getContext('2d');
  const k = (size * dpr) / map.size;
  c.setTransform(k, 0, 0, k, 0, 0);
  c.drawImage(getGround(map), 0, 0, map.size, map.size);
  c.fillStyle = 'rgba(16,22,42,0.6)';
  for (const b of map.buildings) c.fillRect(b.x, b.y, b.w, b.h);
  const z = match.zone;
  if (opts.zone !== false && (match.phase === 'live' || match.phase === 'over')) {
    c.beginPath(); c.rect(0, 0, map.size, map.size);
    c.arc(z.currentCenter.x, z.currentCenter.y, Math.max(0, z.currentRadius), 0, Math.PI * 2, true);
    c.fillStyle = 'rgba(255,107,107,0.35)'; c.fill('evenodd');
    c.lineWidth = 3 / k * dpr; c.strokeStyle = '#FFFFFF'; c.beginPath(); c.arc(z.currentCenter.x, z.currentCenter.y, Math.max(0, z.currentRadius), 0, Math.PI * 2); c.stroke();
    if ((z.stage === 'warning' || z.stage === 'shrinking') && z.nextCenter) {
      c.setLineDash([10 / k, 8 / k]); c.lineWidth = 2.5 / k * dpr; c.beginPath(); c.arc(z.nextCenter.x, z.nextCenter.y, Math.max(1, z.nextRadius), 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
    }
  }
  // POI labels
  const fs = Math.max(10, size / 36);
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.textAlign = 'center'; c.textBaseline = 'middle';
  for (const q of map.pois) {
    c.font = `900 ${fs}px Nunito, Arial, sans-serif`;
    const half = c.measureText(q.name).width / 2 + 4;
    const x = Math.min(size - half, Math.max(half, (q.x / map.size) * size)), y = (q.y / map.size) * size;
    c.lineWidth = 4; c.strokeStyle = 'rgba(16,22,42,0.85)'; c.lineJoin = 'round';
    c.strokeText(q.name, x, y - fs * 0.2);
    c.fillStyle = q.tier === 3 ? '#FFD43B' : '#FFFFFF'; c.fillText(q.name, x, y - fs * 0.2);
    if (q.tier === 3 && opts.labels !== false) {
      c.font = `900 ${fs * 0.7}px Nunito, Arial, sans-serif`;
      c.strokeText(t('HIGH LOOT'), x, y + fs * 0.85); c.fillStyle = '#FF9F43'; c.fillText(t('HIGH LOOT'), x, y + fs * 0.85);
    }
  }
  const p = match.player;
  if (opts.marker) {
    const [mx, my] = opts.marker;
    const x = (mx / map.size) * size, y = (my / map.size) * size;
    c.fillStyle = 'rgba(255,212,59,0.3)'; c.beginPath(); c.arc(x, y, 22, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#FFD43B'; c.strokeStyle = '#10162A'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x - 11, y - 20); c.arc(x, y - 22, 11, Math.PI, 0); c.lineTo(x, y); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#10162A'; c.beginPath(); c.arc(x, y - 22, 4, 0, Math.PI * 2); c.fill();
  } else if (p.alive) {
    const x = (p.x / map.size) * size, y = (p.y / map.size) * size;
    c.fillStyle = '#FFD43B'; c.strokeStyle = '#10162A'; c.lineWidth = 3;
    c.beginPath(); c.arc(x, y, 7, 0, Math.PI * 2); c.fill(); c.stroke();
  }
  return { scale: size / map.size };
}
