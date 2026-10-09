/* A tiny low-poly 3D renderer for Canvas 2D.

   The scenery is real geometry — boxes, wedges, cylinders and extruded
   profiles placed in a 3D world — projected through a perspective camera and
   flat-shaded with a warm sun, a blue sky fill and dusty atmospheric haze.
   Flat shading on purpose: faceted, chunky surfaces are the stylised look,
   and they need no textures that the project does not have.

   It is deliberately not a general engine. Faces are drawn back-to-front
   (painter's algorithm) after back-face culling, which is exact for convex
   parts and good enough for a scene that is rendered once into cached layers.

   Coordinates: x right, y up, z away from the camera. Metres, roughly. */

/* ---------- vectors ---------- */

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const centroid = (pts) => {
  const c = [0, 0, 0];
  for (const p of pts) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; }
  return [c[0] / pts.length, c[1] / pts.length, c[2] / pts.length];
};
export const vec = { sub, dot, cross, norm, centroid };

/* ---------- colour ---------- */

export function hex(h) {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const rgb = (c, a = 1) =>
  `rgba(${Math.max(0, Math.min(255, c[0])) | 0},${Math.max(0, Math.min(255, c[1])) | 0},${Math.max(0, Math.min(255, c[2])) | 0},${a})`;

/* ---------- faces & primitives ----------
   A face is { p: [[x,y,z]…], n: [x,y,z], c: [r,g,b], glow?: bool }.
   Every primitive is convex, so a face normal is oriented by pointing it away
   from the primitive's centre — no winding conventions to get wrong. */

function face(pts, color, center, extra) {
  let n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
  if (dot(n, sub(centroid(pts), center)) < 0) n = [-n[0], -n[1], -n[2]];
  return { p: pts, n, c: color, ...extra };
}

const HEXA_FACES = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
const HEXA_ROLE = ['bottom', 'top', 'front', 'right', 'back', 'left'];

/** Eight corners (bottom ring then top ring) → six faces.
    `colors` may override a side by role: { top, front, back, left, right, bottom }. */
export function hexa(v, color, colors = {}, extra) {
  const c = centroid(v);
  return HEXA_FACES.map((ix, i) => face(ix.map((k) => v[k]), colors[HEXA_ROLE[i]] || color, c, extra));
}

/** Axis-aligned box, sitting on y=0, centred on x and z. `taper` shrinks the
    top (0.2 → top is 80% the size), for cabins and crushed car bodies. */
export function box(w, h, d, color, { taper = 0, taperZ = taper, shiftZ = 0, colors, glow } = {}) {
  const x = w / 2, z = d / 2, tx = x * (1 - taper), tz = z * (1 - taperZ);
  return hexa([
    [-x, 0, -z], [x, 0, -z], [x, 0, z], [-x, 0, z],
    [-tx, h, -tz + shiftZ], [tx, h, -tz + shiftZ], [tx, h, tz + shiftZ], [-tx, h, tz + shiftZ]
  ], color, colors, glow ? { glow: true } : undefined);
}

/** Ramp rising along +z from height 0 to `h`. */
export function wedge(w, h, d, color, slopeColor = color) {
  const x = w / 2, z = d / 2;
  const A = [-x, 0, -z], B = [x, 0, -z], C = [x, 0, z], D = [-x, 0, z], E = [x, h, z], F = [-x, h, z];
  const cen = [0, h / 3, z / 3];
  return [
    face([A, B, C, D], color, cen),
    face([A, B, E, F], slopeColor, cen),
    face([D, C, E, F], color, cen),
    face([A, D, F], color, cen),
    face([B, C, E], color, cen)
  ];
}

/** Cylinder of `segments` sides along an axis ('x', 'y' or 'z'), centred on the
    origin. Caps take their own colour — that is what makes a tyre read as a
    tyre: dark tread, lighter sidewall. */
export function cylinder(r, len, color, { axis = 'x', segments = 12, cap = color, r2 = r } = {}) {
  const h = len / 2;
  const ring = (rad, at) => Array.from({ length: segments }, (_, i) => {
    const a = (i / segments) * Math.PI * 2 + Math.PI / segments;
    const u = Math.cos(a) * rad, v = Math.sin(a) * rad;
    if (axis === 'x') return [at, u, v];
    if (axis === 'y') return [u, at, v];
    return [u, v, at];
  });
  const A = ring(r, -h), B = ring(r2, h);
  const cen = [0, 0, 0];
  const faces = [face(A, cap, cen), face(B, cap, cen)];
  for (let i = 0; i < segments; i++) {
    const j = (i + 1) % segments;
    faces.push(face([A[i], A[j], B[j], B[i]], color, cen));
  }
  return faces;
}

/** A 2D outline in the x/y plane, extruded `depth` along z. Used for vehicle
    side profiles. The outline must be convex. */
export function extrude(outline, depth, color, { sideColor = color } = {}) {
  const h = depth / 2;
  const A = outline.map(([x, y]) => [x, y, -h]);
  const B = outline.map(([x, y]) => [x, y, h]);
  const cen = centroid(A.concat(B));
  const faces = [face(A, sideColor, cen), face(B, sideColor, cen)];
  for (let i = 0; i < outline.length; i++) {
    const j = (i + 1) % outline.length;
    faces.push(face([A[i], A[j], B[j], B[i]], color, cen));
  }
  return faces;
}

/** A thin flat panel (flags, signs, plates) — single face, visible both sides. */
export function panel(pts, color, extra) {
  const n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
  return [{ p: pts, n, c: color, twoSided: true, ...extra }];
}

/* ---------- transforms ---------- */

function rotator({ yaw = 0, pitch = 0, roll = 0 }) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const cr = Math.cos(roll), sr = Math.sin(roll);
  return ([x, y, z]) => {
    /* roll (z), then pitch (x), then yaw (y) */
    let x1 = x * cr - y * sr, y1 = x * sr + y * cr, z1 = z;
    let y2 = y1 * cp - z1 * sp, z2 = y1 * sp + z1 * cp, x2 = x1;
    return [x2 * cy + z2 * sy, y2, -x2 * sy + z2 * cy];
  };
}

/** Returns transformed copies of `faces`: scaled, rotated, then moved. */
export function place(faces, { x = 0, y = 0, z = 0, yaw = 0, pitch = 0, roll = 0, scale = 1 } = {}) {
  const rot = rotator({ yaw, pitch, roll });
  return faces.map((f) => ({
    ...f,
    p: f.p.map((pt) => { const r = rot([pt[0] * scale, pt[1] * scale, pt[2] * scale]); return [r[0] + x, r[1] + y, r[2] + z]; }),
    n: rot(f.n)
  }));
}

/** Nudge each face's colour a little so large flat areas don't look plastic. */
export function weather(faces, rng, amount = 0.08) {
  for (const f of faces) {
    const k = 1 + (rng.next() - 0.5) * 2 * amount;
    f.c = [f.c[0] * k, f.c[1] * k, f.c[2] * k];
  }
  return faces;
}

/* ---------- camera ---------- */

export class Camera {
  constructor({ pos = [0, 2, 0], pitch = 0, yaw = 0, fov = 50, width = 1920, height = 1080 } = {}) {
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.focal = (width / 2) / Math.tan((fov * Math.PI) / 360);
    const cp = Math.cos(pitch), sp = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw);
    /* pitch > 0 looks down */
    this.fwd = [sy * cp, -sp, cy * cp];
    this.up = [sy * sp, cp, cy * sp];
    this.right = [cy, 0, -sy];
  }

  /** World point → [screenX, screenY, depth]. Depth ≤ 0 is behind the lens. */
  project(p) {
    const d = sub(p, this.pos);
    const z = dot(d, this.fwd);
    const k = this.focal / Math.max(z, 1e-4);
    return [this.width / 2 + dot(d, this.right) * k, this.height / 2 - dot(d, this.up) * k, z];
  }

  /** Screen y of the horizon. */
  get horizonY() {
    return this.height / 2 - (this.fwd[1] / Math.hypot(this.fwd[0], this.fwd[2])) * -this.focal;
  }
}

/* ---------- lighting ---------- */

export const DEFAULT_LIGHT = {
  sun: norm([0.78, 0.48, -0.12]),         // low from the right: long shadows thrown across the arena
  sunColor: [1.22, 0.98, 0.74],           // warm key
  skyColor: [0.42, 0.48, 0.60],           // cool fill from above
  bounceColor: [0.36, 0.22, 0.12],        // warm light bouncing off the dirt
  haze: hex('#e9a56f'),                   // dusty atmosphere
  hazeStart: 18,
  hazeDensity: 0.010,
  hazeMax: 0.78
};

function shade(f, cam, light) {
  const n = f.n;
  const center = centroid(f.p);
  let c;
  if (f.glow) {
    c = f.c;
  } else {
    const sun = Math.max(0, dot(n, light.sun));
    const sky = 0.55 + 0.45 * n[1];
    const bounce = Math.max(0, -n[1]) + 0.25 * (1 - Math.abs(n[1]));
    const k = [0, 1, 2].map((i) =>
      light.skyColor[i] * sky + light.bounceColor[i] * bounce + light.sunColor[i] * sun);
    /* cheap ambient occlusion: surfaces close to the ground get less light */
    const ao = 0.72 + 0.28 * Math.min(1, Math.max(0, center[1] - (f.base ?? 0)) / 0.9);
    c = [f.c[0] * k[0] * ao, f.c[1] * k[1] * ao, f.c[2] * k[2] * ao];
  }
  const dist = Math.hypot(...sub(center, cam.pos));
  const fog = Math.min(light.hazeMax, 1 - Math.exp(-Math.max(0, dist - light.hazeStart) * light.hazeDensity));
  return { color: mix(c, light.haze, fog), fog };
}

/* ---------- drawing ---------- */

function area(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return Math.abs(a) / 2;
}

/** Projects, culls, shades, sorts and fills `faces` into a 2D context whose
    transform already maps the 1920×1080 design space onto the canvas.
    With `rng`, larger faces also get wear: a bevel highlight along their
    edges and grime and scratches inside — the hand-painted look of stylised
    game art, done at build time so it costs nothing per frame. */
export function renderFaces(ctx, faces, cam, { light = DEFAULT_LIGHT, rng = null } = {}) {
  const visible = [];
  for (const f of faces) {
    const cen = centroid(f.p);
    const toFace = sub(cen, cam.pos);
    let n = f.n;
    if (dot(n, toFace) >= 0) {
      if (!f.twoSided) continue;
      n = [-n[0], -n[1], -n[2]];
    }
    const pts = f.p.map((p) => cam.project(p));
    if (pts.some((p) => p[2] < 0.05)) continue;
    const { color, fog } = shade({ ...f, n }, cam, light);
    visible.push({ pts, depth: dot(toFace, cam.fwd), color, fog, glow: f.glow, clean: f.clean || !!f.label, label: f.label });
  }
  visible.sort((a, b) => b.depth - a.depth);

  /* A hairline stroke in the fill colour closes the anti-aliasing cracks that
     otherwise show between adjacent faces. */
  const t = ctx.getTransform();
  const px = 1 / (t.a || 1);
  ctx.lineJoin = 'round';
  for (const v of visible) {
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(v.pts[0][0], v.pts[0][1]);
      for (let i = 1; i < v.pts.length; i++) ctx.lineTo(v.pts[i][0], v.pts[i][1]);
      ctx.closePath();
    };
    path();
    const col = rgb(v.color);
    ctx.fillStyle = col;
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.1 * px;
    ctx.fill();
    ctx.stroke();
    if (v.label) drawLabel(ctx, v);

    if (!rng || v.glow || v.clean) continue;
    const a = area(v.pts);
    if (a < 400) continue;
    const vis = 1 - v.fog;
    ctx.save();
    ctx.clip();
    /* bevel: a light line just inside the edge */
    ctx.lineWidth = Math.min(5, 1.5 + Math.sqrt(a) * 0.02);
    ctx.strokeStyle = `rgba(255,236,205,${0.09 * vis})`;
    ctx.stroke();
    if (a > 900) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const p of v.pts) { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
      const w = maxX - minX, h = maxY - minY;
      /* grime collects low on a surface */
      const g = ctx.createLinearGradient(0, minY, 0, maxY);
      g.addColorStop(0, 'rgba(40,18,6,0)');
      g.addColorStop(1, `rgba(40,18,6,${0.28 * vis})`);
      ctx.fillStyle = g;
      ctx.fillRect(minX, minY, w, h);
      const blots = Math.min(10, Math.round(Math.sqrt(a) / 14));
      for (let i = 0; i < blots; i++) {
        const x = minX + rng.next() * w, y = minY + rng.next() * h, r = 3 + rng.next() * Math.sqrt(a) * 0.18;
        const b = ctx.createRadialGradient(x, y, 0, x, y, r);
        const rust = rng.chance(0.55);
        b.addColorStop(0, rust ? `rgba(150,62,20,${0.2 * vis})` : `rgba(30,16,8,${0.16 * vis})`);
        b.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = b;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(255,232,200,${0.22 * vis})`;
      for (let i = 0; i < blots / 3; i++) {
        const x = minX + rng.next() * w, y = minY + rng.next() * h, len = 4 + rng.next() * 16;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y + rng.range(-3, 3)); ctx.stroke();
      }
    }
    ctx.restore();
  }
}

/** Paints text onto a quad face whose corners were given top-left, top-right,
    bottom-right, bottom-left. An affine map from the first three corners is
    exact for a flat sign seen at this distance and keeps the text crisp. */
function drawLabel(ctx, v) {
  const { text, aspect = 0.25, color = '#ffb800', font = '"Black Ops One", Impact, sans-serif', size = 0.62 } = v.label;
  const [a, b, , d] = v.pts;
  const vw = 1000, vh = vw * aspect;
  ctx.save();
  ctx.transform((b[0] - a[0]) / vw, (b[1] - a[1]) / vw, (d[0] - a[0]) / vh, (d[1] - a[1]) / vh, a[0], a[1]);
  ctx.globalAlpha = 1 - v.fog * 0.85;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.round(vh * size)}px ${font}`;
  /* shrink to fit the board, leaving a margin */
  const w = ctx.measureText(text).width;
  if (w > vw * 0.9) ctx.font = `${Math.round(vh * size * (vw * 0.9) / w)}px ${font}`;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillText(text, vw / 2 + vh * 0.03, vh / 2 + vh * 0.05);
  ctx.fillStyle = color;
  ctx.fillText(text, vw / 2, vh / 2);
  ctx.restore();
}

/** Hard shadows cast on the ground (y = 0) by `faces`, drawn opaque into
    their own canvas and then laid onto `ctx` at `strength`, so overlapping
    faces don't stack into darker patches. */
export function renderCastShadows(ctx, faces, cam, { light = DEFAULT_LIGHT, strength = 0.42, blur = 2 } = {}) {
  const s = light.sun;
  const c = document.createElement('canvas');
  c.width = ctx.canvas.width;
  c.height = ctx.canvas.height;
  const sctx = c.getContext('2d');
  sctx.setTransform(ctx.getTransform());
  sctx.fillStyle = '#000';
  for (const f of faces) {
    if (f.glow && f.noShadow) continue;
    if (f.p.every((p) => p[1] < 0.03)) continue;
    sctx.beginPath();
    f.p.forEach((p, i) => {
      const k = p[1] / s[1];
      const q = cam.project([p[0] - s[0] * k, 0, p[2] - s[2] * k]);
      if (i) sctx.lineTo(q[0], q[1]); else sctx.moveTo(q[0], q[1]);
    });
    sctx.closePath();
    sctx.fill();
  }
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = strength;
  if (blur) ctx.filter = `blur(${blur}px)`;
  ctx.globalCompositeOperation = 'multiply';
  /* tint the shadow warm-brown rather than grey, as it is on dusty ground */
  const tint = document.createElement('canvas');
  tint.width = c.width; tint.height = c.height;
  const tctx = tint.getContext('2d');
  tctx.drawImage(c, 0, 0);
  tctx.globalCompositeOperation = 'source-in';
  tctx.fillStyle = '#3a1a08';
  tctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(tint, 0, 0);
  ctx.restore();
}
