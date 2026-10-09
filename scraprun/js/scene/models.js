/* Low-poly models for the junkyard, built from primitives in code.

   There are no 3D model files in this project, so every machine and prop here
   is assembled from boxes, wedges and cylinders. Each builder returns
   { faces, shadow } in local space: `faces` for the renderer, and `shadow`
   (a footprint on the ground) so the scene can lay a soft contact shadow
   under it. Vehicles face +x; their width runs along z. */

import { box, cylinder, extrude, hexa, wedge, panel, place, weather, hex, mix, vec } from '../render/lowpoly.js';

export const PALETTE = {
  steel: hex('#7d8288'),
  darkSteel: hex('#3a3d42'),
  tyre: hex('#2a2827'),
  sidewall: hex('#3d3a37'),
  rust: hex('#9c4a1f'),
  rustLight: hex('#c0662b'),
  rustDark: hex('#5e2c14'),
  glass: hex('#35587d'),
  lamp: hex('#fff1b8'),
  hazard: hex('#f2b316'),
  black: hex('#141414'),
  concrete: hex('#b9ada0'),
  dirt: hex('#8a5531'),
  blue: hex('#1f6fd1'),
  orange: hex('#ff8a12'),
  red: hex('#d1301f'),
  green: hex('#4f9a2a'),
  white: hex('#e9e4dc')
};
const P = PALETTE;

/** A square-section beam between two points — struts, cages, scaffolding. */
export function bar(a, b, t, color) {
  const d = vec.norm(vec.sub(b, a));
  const ref = Math.abs(d[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = vec.norm(vec.cross(d, ref)).map((x) => x * t / 2);
  const v = vec.norm(vec.cross(d, u)).map((x) => x * t / 2);
  const corner = (p, su, sv) => [p[0] + u[0] * su + v[0] * sv, p[1] + u[1] * su + v[1] * sv, p[2] + u[2] * su + v[2] * sv];
  return hexa([
    corner(a, -1, -1), corner(a, 1, -1), corner(a, 1, 1), corner(a, -1, 1),
    corner(b, -1, -1), corner(b, 1, -1), corner(b, 1, 1), corner(b, -1, 1)
  ], color);
}

/* ---------- vehicles ---------- */

/** A scrap-built combat machine. `weapon` is 'ram', 'saw' or 'flipper'. */
export function vehicle(rng, {
  body, accent, length = 4.4, width = 2.3, wheelR = 0.62, weapon = 'ram',
  wing = true, cage = true, stacks = true, cabinColor = body
}) {
  const L = length / 2, W = width / 2;
  const f = [];
  const add = (faces, t) => f.push(...place(faces, t));

  /* wheels: chunky, outboard, monster-truck stance */
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const at = { x: sx * L * 0.64, y: wheelR, z: sz * (W + 0.02) };
    add(cylinder(wheelR, 0.52, P.tyre, { axis: 'z', segments: 14, cap: P.sidewall }), at);
    add(cylinder(wheelR * 0.46, 0.58, P.darkSteel, { axis: 'z', segments: 8, cap: accent }), at);
    /* fender over each wheel */
    add(box(wheelR * 2.25, 0.12, 0.66, accent, { taper: 0.12 }), { x: at.x, y: wheelR * 2 + 0.06, z: sz * (W + 0.02) });
  }

  /* chassis and hull */
  add(box(length * 0.86, 0.3, width * 0.62, P.darkSteel), { y: wheelR * 0.62 });
  const hull = [[-L, 0.72], [L * 0.8, 0.72], [L, 0.98], [L * 0.86, 1.3], [-L * 0.9, 1.42], [-L, 1.16]];
  add(extrude(hull, width * 0.82, body));
  /* accent armour band down both sides */
  add(box(length * 0.78, 0.22, width * 0.86, accent), { x: -0.05, y: 0.86 });
  /* bolted scrap plates — every machine is patched */
  for (let i = 0; i < 5; i++) {
    const side = rng.chance(0.5) ? 1 : -1;
    add(box(rng.range(0.3, 0.7), rng.range(0.18, 0.3), 0.04, rng.pick([P.rust, P.rustLight, P.steel, P.darkSteel])),
      { x: rng.range(-L * 0.8, L * 0.6), y: rng.range(1.08, 1.2), z: side * (width * 0.41 + 0.02) });
  }

  /* cabin */
  const cabX = -L * 0.16, cabY = 1.36;
  add(box(1.55, 0.72, width * 0.66, cabinColor, {
    taper: 0.2, taperZ: 0.12, colors: { right: P.glass, front: mix(P.glass, cabinColor, 0.15), back: mix(P.glass, cabinColor, 0.15) }
  }), { x: cabX, y: cabY });
  add(box(1.35, 0.08, width * 0.6, accent), { x: cabX - 0.05, y: cabY + 0.72 });

  if (cage) {
    const h = cabY + 0.98, cz = width * 0.36;
    for (const sx of [-0.85, 0.55]) for (const sz of [-1, 1]) {
      f.push(...bar([cabX + sx, cabY - 0.05, sz * cz], [cabX + sx * 0.8, h, sz * cz * 0.9], 0.08, P.darkSteel));
    }
    for (const sz of [-1, 1]) f.push(...bar([cabX - 0.68, h, sz * cz * 0.9], [cabX + 0.44, h, sz * cz * 0.9], 0.08, P.darkSteel));
    for (const sx of [-0.68, 0.44]) f.push(...bar([cabX + sx, h, -cz * 0.9], [cabX + sx, h, cz * 0.9], 0.08, P.darkSteel));
  }

  if (stacks) {
    for (const sz of [-1, 1]) {
      add(cylinder(0.09, 1.0, P.steel, { axis: 'y', segments: 8 }), { x: -L * 0.72, y: 1.85, z: sz * width * 0.24 });
      add(cylinder(0.11, 0.14, P.black, { axis: 'y', segments: 8 }), { x: -L * 0.72, y: 2.36, z: sz * width * 0.24 });
    }
  }

  if (wing) {
    for (const sz of [-1, 1]) f.push(...bar([-L * 0.92, 1.3, sz * 0.62], [-L * 1.0, 2.02, sz * 0.62], 0.08, P.darkSteel));
    add(box(0.68, 0.07, width * 0.98, accent), { x: -L * 1.02, y: 2.0 });
  }

  /* spare tyre bolted to the tail */
  add(cylinder(0.42, 0.24, P.tyre, { axis: 'x', segments: 12, cap: P.sidewall }), { x: -L - 0.08, y: 1.08 });

  /* headlights */
  for (const sz of [-1, 1]) {
    add(box(0.06, 0.14, 0.26, P.lamp, { glow: true }), { x: L * 0.94, y: 1.02, z: sz * width * 0.27 });
  }

  /* weapon */
  if (weapon === 'ram') {
    const x0 = L + 0.08, t = 0.16, zw = W * 1.08;
    f.push(...hexa([
      [x0 + 0.36, 0.34, -zw], [x0 + 0.36 + t, 0.34, -zw], [x0 + 0.36 + t, 0.34, zw], [x0 + 0.36, 0.34, zw],
      [x0, 1.08, -zw], [x0 + t, 1.08, -zw], [x0 + t, 1.08, zw], [x0, 1.08, zw]
    ], accent, { top: P.steel }));
    for (const z of [-0.6, 0, 0.6]) {
      add(box(0.24, 0.62, 0.24, P.steel, { taper: 0.94 }), { x: x0 + 0.3, y: 0.78, z, roll: -Math.PI / 2 });
    }
  } else if (weapon === 'saw') {
    f.push(...bar([L * 0.7, 1.2, 0], [L + 0.55, 1.0, 0], 0.18, P.darkSteel));
    add(cylinder(0.82, 0.06, P.steel, { axis: 'z', segments: 18, cap: mix(P.steel, P.white, 0.25) }), { x: L + 0.6, y: 1.0 });
    add(cylinder(0.2, 0.14, accent, { axis: 'z', segments: 8 }), { x: L + 0.6, y: 1.0 });
  } else if (weapon === 'flipper') {
    add(wedge(width * 0.9, 0.62, 1.1, P.steel, P.hazard), { x: L + 0.45, y: 0.12, yaw: Math.PI / 2 });
  }

  return { faces: weather(f, rng, 0.06), shadow: { rx: L + 0.6, rz: W + 0.5, h: 1.6 } };
}

/* ---------- props ---------- */

export function tyreFlat(rng, r = 0.55) {
  const f = [
    ...cylinder(r, 0.36, P.tyre, { axis: 'y', segments: 14, cap: P.sidewall }),
    ...cylinder(r * 0.52, 0.38, P.black, { axis: 'y', segments: 10 })
  ];
  return { faces: place(f, { y: 0.18 }), shadow: { rx: r * 1.1, rz: r * 1.1, h: 0.3 } };
}

export function tyreStack(rng, count = 4, r = 0.55) {
  const f = [];
  for (let i = 0; i < count; i++) {
    const t = tyreFlat(rng, r);
    f.push(...place(t.faces, { y: i * 0.36, x: rng.range(-0.06, 0.06), z: rng.range(-0.06, 0.06), yaw: rng.range(0, 3) }));
  }
  return { faces: f, shadow: { rx: r * 1.15, rz: r * 1.15, h: count * 0.36 } };
}

export function tyreUpright(rng, r = 0.6) {
  const f = place(cylinder(r, 0.38, P.tyre, { axis: 'x', segments: 14, cap: P.sidewall }), { y: r });
  return { faces: f, shadow: { rx: 0.4, rz: r, h: r } };
}

export function barrel(rng, color = P.red) {
  const f = [
    ...cylinder(0.36, 1.0, color, { axis: 'y', segments: 12, cap: mix(color, P.black, 0.3) }),
    ...place(cylinder(0.375, 0.07, mix(color, P.black, 0.35), { axis: 'y', segments: 12 }), { y: 0.22 }),
    ...place(cylinder(0.375, 0.07, mix(color, P.black, 0.35), { axis: 'y', segments: 12 }), { y: -0.22 })
  ];
  return { faces: weather(place(f, { y: 0.5 }), rng, 0.1), shadow: { rx: 0.45, rz: 0.45, h: 1 } };
}

export function crate(rng, s = 1, color = P.rustLight) {
  return { faces: weather(box(s, s, s, color, { colors: { top: mix(color, P.white, 0.1) } }), rng, 0.08), shadow: { rx: s * 0.7, rz: s * 0.7, h: s } };
}

export function container(rng, color, length = 6) {
  const f = box(length, 2.6, 2.4, color);
  /* ribs: a few slim boxes standing proud of the long sides */
  for (let i = -2; i <= 2; i++) {
    f.push(...place(box(0.12, 2.5, 2.48, mix(color, P.black, 0.18)), { x: i * length / 5.5 }));
  }
  return { faces: weather(f, rng, 0.05), shadow: { rx: length / 2 + 0.5, rz: 1.6, h: 2.6 } };
}

/** A car crushed flat, for stacking into scrap towers. */
export function crushedCar(rng, color) {
  const h = rng.range(0.5, 0.75);
  const f = box(3.4, h, 1.7, color, {
    taper: rng.range(0.05, 0.18),
    colors: { top: mix(color, P.rust, 0.35) }
  });
  /* squashed wheel stubs */
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    if (rng.chance(0.4)) continue;
    f.push(...place(cylinder(0.32, 0.18, P.tyre, { axis: 'z', segments: 8, cap: P.sidewall }), { x: sx * 1.1, y: 0.18, z: sz * 0.86 }));
  }
  return weather(f, rng, 0.12);
}

const SCRAP_COLORS = [P.rust, P.rustLight, P.rustDark, hex('#6e7f8c'), hex('#8c3a2a'), hex('#3f6f7a'), hex('#b8913a'), hex('#5a6a3a'), hex('#a8a39a')];

export function scrapTower(rng, levels = 6) {
  const f = [];
  let y = 0;
  for (let i = 0; i < levels; i++) {
    const car = crushedCar(rng, rng.pick(SCRAP_COLORS));
    f.push(...place(car, { y, yaw: rng.range(-0.35, 0.35), x: rng.range(-0.3, 0.3), z: rng.range(-0.3, 0.3), roll: rng.range(-0.05, 0.05) }));
    y += 0.62;
  }
  return { faces: f, shadow: { rx: 2.4, rz: 1.5, h: y } };
}

/** A heap of junk: a low mound with scrap poking out of it. */
export function scrapPile(rng, radius = 5, height = 2.4) {
  const f = [];
  const mound = hexa([
    [-radius, 0, -radius * 0.7], [radius, 0, -radius * 0.7], [radius, 0, radius * 0.7], [-radius, 0, radius * 0.7],
    [-radius * 0.14, height, -radius * 0.1], [radius * 0.1, height, -radius * 0.12], [radius * 0.16, height, radius * 0.1], [-radius * 0.1, height, radius * 0.12]
  ], P.rustDark, { top: mix(P.rustDark, P.rust, 0.4) });
  f.push(...mound);
  const n = Math.round(radius * 9);
  for (let i = 0; i < n; i++) {
    const a = rng.range(0, Math.PI * 2), d = Math.sqrt(rng.next()) * 0.85;
    const x = Math.cos(a) * d * radius, z = Math.sin(a) * d * radius * 0.7;
    const y = height * Math.max(0, 1 - d) * 0.95;
    const t = { x, y, z, yaw: rng.range(0, Math.PI * 2), pitch: rng.range(-0.6, 0.6), roll: rng.range(-0.6, 0.6) };
    const kind = rng.next();
    const col = rng.pick(SCRAP_COLORS);
    if (kind < 0.35) f.push(...place(box(rng.range(0.6, 2.2), rng.range(0.15, 0.6), rng.range(0.5, 1.4), col), t));
    else if (kind < 0.55) f.push(...place(cylinder(rng.range(0.4, 0.65), 0.34, P.tyre, { axis: 'x', segments: 10, cap: P.sidewall }), t));
    else if (kind < 0.72) f.push(...place(cylinder(rng.range(0.1, 0.25), rng.range(1.5, 3.5), col, { axis: 'x', segments: 7 }), t));
    else if (kind < 0.86) f.push(...place(box(rng.range(1, 2.4), 0.05, rng.range(0.8, 1.6), col), t));
    else f.push(...place(cylinder(0.35, 1, rng.pick([P.red, P.hazard, P.blue]), { axis: 'y', segments: 10 }), t));
  }
  return { faces: weather(f, rng, 0.1), shadow: { rx: radius * 1.05, rz: radius * 0.75, h: height } };
}

/** A hazard-striped launch ramp, rising along +z. */
export function ramp(rng, w = 3.4, h = 1.3, d = 4) {
  const f = wedge(w, h, d, P.darkSteel, P.steel);
  const strips = 7;
  for (let i = 0; i < strips; i++) {
    const a = i / strips, b = (i + 1) / strips;
    const pt = (s, x) => [x, h * s + 0.02, -d / 2 + d * s];
    f.push(...panel([pt(a, -w / 2), pt(a, w / 2), pt(b, w / 2), pt(b, -w / 2)], i % 2 ? P.black : P.hazard));
  }
  return { faces: weather(f, rng, 0.05), shadow: { rx: w * 0.6, rz: d * 0.6, h } };
}

/** A jersey barrier — the arena edge. */
export function barrier(rng, length = 3, striped = false) {
  const prof = [[-0.32, 0], [0.32, 0], [0.13, 0.32], [0.09, 0.85], [-0.09, 0.85], [-0.13, 0.32]];
  /* extrude() runs along z; turn it so the barrier runs along x */
  const f = place(extrude(prof, length, P.concrete), { yaw: Math.PI / 2 });
  if (striped) {
    for (let i = 0; i < 4; i++) {
      const x0 = -length / 2 + (i + 0.25) * length / 4;
      f.push(...panel([[x0, 0.62, -0.115], [x0 + length / 8, 0.62, -0.115], [x0 + length / 8, 0.78, -0.115], [x0, 0.78, -0.115]], P.orange));
    }
  }
  return { faces: weather(f, rng, 0.06), shadow: { rx: length / 2 + 0.2, rz: 0.5, h: 0.85 } };
}

/** Rusted scaffolding tower with a deck and a flag on top. */
export function scaffold(rng, { w = 3, d = 3, h = 9, flag = P.orange } = {}) {
  const f = [];
  const col = P.rust, t = 0.14;
  const xs = [-w / 2, w / 2], zs = [-d / 2, d / 2];
  for (const x of xs) for (const z of zs) f.push(...bar([x, 0, z], [x, h, z], t, col));
  for (let y = 2.2; y <= h; y += 2.2) {
    for (const z of zs) f.push(...bar([-w / 2, y, z], [w / 2, y, z], t * 0.8, col));
    for (const x of xs) f.push(...bar([x, y, -d / 2], [x, y, d / 2], t * 0.8, col));
  }
  /* cross bracing on the faces we see */
  for (let y = 0; y < h - 0.5; y += 2.2) {
    const y2 = Math.min(h, y + 2.2);
    f.push(...bar([-w / 2, y, -d / 2], [w / 2, y2, -d / 2], t * 0.6, P.rustDark));
    f.push(...bar([w / 2, y, -d / 2], [w / 2, y2, d / 2], t * 0.6, P.rustDark));
  }
  f.push(...place(box(w + 0.6, 0.18, d + 0.6, P.darkSteel), { y: h }));
  /* railing */
  for (const x of [-w / 2 - 0.3, w / 2 + 0.3]) for (const z of zs) f.push(...bar([x, h, z * 1.2], [x, h + 1, z * 1.2], 0.07, P.hazard));
  for (const z of zs) f.push(...bar([-w / 2 - 0.3, h + 1, z * 1.2], [w / 2 + 0.3, h + 1, z * 1.2], 0.07, P.hazard));
  /* flag pole and flag */
  f.push(...bar([w / 2, h, 0], [w / 2, h + 4.2, 0], 0.09, P.steel));
  f.push(...flagCloth([w / 2, h + 4.1, 0], 2.2, 1.3, flag, rng));
  return { faces: weather(f, rng, 0.08), shadow: { rx: w * 0.8, rz: d * 0.8, h } };
}

/** A two-segment flag, kinked so it reads as cloth catching wind. */
export function flagCloth(top, len, height, color, rng) {
  const [x, y, z] = top;
  const k1 = rng.range(-0.4, 0.4), k2 = rng.range(-0.5, 0.5);
  const a = [x, y, z], b = [x, y - height, z];
  const c = [x + len * 0.5, y - 0.08, z + k1], d = [x + len * 0.5, y - height - 0.05, z + k1];
  const e = [x + len, y - 0.2, z + k2], g = [x + len, y - height - 0.1, z + k2];
  return [
    ...panel([a, c, d, b], color),
    ...panel([c, e, g, d], mix(color, P.black, 0.12))
  ];
}

/** Floodlight tower; its lamp faces glow and are also returned as positions so
    the atmosphere layer can bloom them. */
export function floodlight(rng, h = 14) {
  const f = [];
  const base = 0.9;
  const legs = [[-base, -base], [base, -base], [0, base]];
  for (const [x, z] of legs) f.push(...bar([x, 0, z], [x * 0.2, h, z * 0.2], 0.18, P.darkSteel));
  for (let y = 2; y < h; y += 2.5) {
    const k = 1 - (y / h) * 0.8;
    for (let i = 0; i < 3; i++) {
      const [x1, z1] = legs[i], [x2, z2] = legs[(i + 1) % 3];
      f.push(...bar([x1 * k, y, z1 * k], [x2 * k, y, z2 * k], 0.08, P.darkSteel));
    }
  }
  /* lamp head: a dark frame with a grid of glowing cells facing the arena */
  f.push(...place(box(3.4, 1.6, 0.5, P.darkSteel), { y: h }));
  const lamps = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
    const x = -1.2 + i * 0.8, y = h + 0.4 + j * 0.8;
    f.push(...place(box(0.6, 0.6, 0.06, P.lamp, { glow: true }), { x, y: y - 0.3, z: -0.28 }));
    lamps.push([x, y, -0.3]);
  }
  return { faces: f, lamps, shadow: { rx: 1.4, rz: 1.4, h: 4 } };
}

/** A tall crane silhouette for the far distance. */
export function crane(rng, h = 30, reach = 26) {
  const f = [];
  const s = 1.1;
  for (const [x, z] of [[-s, -s], [s, -s], [s, s], [-s, s]]) f.push(...bar([x, 0, z], [x, h, z], 0.3, P.hazard));
  for (let y = 0; y < h; y += 3) {
    f.push(...bar([-s, y, -s], [s, y + 3, -s], 0.18, P.hazard));
    f.push(...bar([-s, y, -s], [s, y, -s], 0.18, P.hazard));
  }
  f.push(...bar([-reach * 0.3, h + 1, 0], [reach, h + 1, 0], 0.7, P.hazard));
  f.push(...bar([0, h + 5, 0], [reach * 0.85, h + 1.3, 0], 0.15, P.darkSteel));
  f.push(...bar([0, h + 5, 0], [-reach * 0.3, h + 1.3, 0], 0.15, P.darkSteel));
  f.push(...bar([0, h, 0], [0, h + 5, 0], 0.4, P.hazard));
  f.push(...place(box(3, 2.2, 2.4, P.darkSteel), { x: -reach * 0.25, y: h - 1 }));
  /* hanging hook block */
  f.push(...bar([reach * 0.7, h + 1, 0], [reach * 0.7, h - 9, 0], 0.06, P.black));
  f.push(...place(box(0.9, 1.1, 0.9, P.hazard), { x: reach * 0.7, y: h - 10 }));
  return { faces: f, shadow: null };
}

/** Bunting: triangular pennants hanging from a sagging line. */
export function bunting(rng, a, b, count = 12, colors = [P.orange, P.hazard, P.blue, P.red, P.white]) {
  const f = [];
  const sag = 1.2;
  const at = (t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - Math.sin(t * Math.PI) * sag, a[2] + (b[2] - a[2]) * t];
  for (let i = 0; i < count; i++) {
    const t0 = (i + 0.1) / count, t1 = (i + 0.9) / count;
    const p0 = at(t0), p1 = at(t1);
    const tip = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - 0.75, (p0[2] + p1[2]) / 2 + rng.range(-0.15, 0.15)];
    f.push(...panel([p0, p1, tip], colors[i % colors.length]));
    f.push(...bar(at(i / count), at((i + 1) / count), 0.04, P.black));
  }
  return { faces: f, shadow: null };
}

export function pipe(rng, len = 4, r = 0.3, color = P.rust) {
  const f = cylinder(r, len, color, { axis: 'x', segments: 10, cap: P.black });
  return { faces: weather(place(f, { y: r }), rng, 0.1), shadow: { rx: len / 2, rz: r * 1.5, h: r * 2 } };
}
