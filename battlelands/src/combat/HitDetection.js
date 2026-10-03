/* Shot-vs-body tests. 32 bodies is small enough that a flat loop with an
   early bounding-box reject beats maintaining a dynamic spatial structure. */
import { segCircle } from '../world/MapManager.js';

/* First living combatant crossed by a segment, ignoring `ignore`. */
export function segmentVsBodies(bodies, x1, y1, x2, y2, ignore, pad = 0) {
  const dx = x2 - x1, dy = y2 - y1;
  const minX = Math.min(x1, x2) - 40, maxX = Math.max(x1, x2) + 40;
  const minY = Math.min(y1, y2) - 40, maxY = Math.max(y1, y2) + 40;
  let best = null, bestT = 2;
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    if (!b.alive || b === ignore || b.airborne) continue;
    if (b.x < minX || b.x > maxX || b.y < minY || b.y > maxY) continue;
    const t = segCircle(x1, y1, dx, dy, b.x, b.y, b.radius + pad);
    if (t !== null && t < bestT) { bestT = t; best = b; }
  }
  return best ? { body: best, t: bestT } : null;
}

export function bodiesInRadius(bodies, x, y, r, fn) {
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    if (!b.alive || b.airborne) continue;
    const dx = b.x - x, dy = b.y - y, rr = r + b.radius;
    if (dx * dx + dy * dy <= rr * rr) fn(b, Math.sqrt(dx * dx + dy * dy));
  }
}
