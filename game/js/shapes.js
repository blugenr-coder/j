/* Geometry helpers for the character and the world.

   Everything round on the character is a "superellipsoid": a sphere whose
   points are pushed toward a box by an exponent, then scaled and tapered.
   One primitive, tuned per part, is what keeps the whole body reading as a
   single chunky toy instead of a kit of mismatched shapes. */

import * as THREE from '../vendor/three.module.min.js';

/* Average the normals of vertices that share a position. SphereGeometry
   duplicates its seam and poles, and without this the seam shows up as a
   hard crease down the back of every limb. */
export function smoothNormals(geo) {
  geo.computeVertexNormals();
  const pos = geo.attributes.position, nor = geo.attributes.normal;
  const groups = new Map();
  for (let i = 0; i < pos.count; i++) {
    const k = `${pos.getX(i).toFixed(4)},${pos.getY(i).toFixed(4)},${pos.getZ(i).toFixed(4)}`;
    let g = groups.get(k);
    if (!g) groups.set(k, g = []);
    g.push(i);
  }
  const n = new THREE.Vector3();
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    n.set(0, 0, 0);
    for (const i of g) n.x += nor.getX(i), n.y += nor.getY(i), n.z += nor.getZ(i);
    n.normalize();
    for (const i of g) nor.setXYZ(i, n.x, n.y, n.z);
  }
  nor.needsUpdate = true;
  return geo;
}

/**
 * A rounded block of size w × h × d centred on the origin.
 *  box    0 = ellipsoid, toward 1 = boxier (0.3–0.5 is "chunky toy")
 *  top    width/depth multiplier at the top edge (taper)
 *  bottom width/depth multiplier at the bottom edge
 *  front  extra push of the +z face (bellies, toecaps)
 */
export function blob(w, h, d, { box = 0.35, top = 1, bottom = 1, front = 0, seg = 28 } = {}) {
  const geo = new THREE.SphereGeometry(0.5, seg, Math.round(seg * 0.75));
  const p = geo.attributes.position;
  const e = 1 - box * 0.85;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i) * 2, y = p.getY(i) * 2, z = p.getZ(i) * 2;
    x = Math.sign(x) * Math.abs(x) ** e;
    y = Math.sign(y) * Math.abs(y) ** e;
    z = Math.sign(z) * Math.abs(z) ** e;
    const t = (y + 1) / 2;
    const s = bottom + (top - bottom) * t;
    if (z > 0) z *= 1 + front;
    p.setXYZ(i, x * s * w / 2, y * h / 2, z * s * d / 2);
  }
  return smoothNormals(geo);
}

/* The head: a near-sphere with a jaw that narrows toward the chin and a
   slightly fuller cranium, so the face sits on a gentle egg rather than a
   ball. */
export function headGeometry(w, h, d) {
  const geo = new THREE.SphereGeometry(0.5, 48, 36);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (y < 0) {
      const t = (-y / 0.5) ** 1.6;
      x *= 1 - 0.12 * t;
      z *= 1 - 0.06 * t;
      if (z > 0) z *= 1 - 0.05 * t;
    } else {
      x *= 1 + 0.03 * Math.sin((y / 0.5) * Math.PI);
    }
    // soften the front a touch so features sit on a broad face, smoothly
    if (z > 0) z *= 1 - 0.1 * (z / 0.5) ** 2;
    p.setXYZ(i, x * w, y * h, z * d);
  }
  return smoothNormals(geo);
}

/** Tapered capsule hanging down from its pivot: the top cap is centred on
    the pivot and the bottom cap on the next joint, so consecutive segments of
    matching radius blend into one smooth limb with no pinch at the joint. */
export function limb(rTop, rBottom, len, { seg = 18 } = {}) {
  const g = new THREE.CapsuleGeometry(rTop, len, 8, seg);
  g.translate(0, -len / 2, 0);
  const p = g.attributes.position;
  const k = rBottom / rTop;
  for (let i = 0; i < p.count; i++) {
    const t = Math.min(1, Math.max(0, -p.getY(i) / len));
    const s = 1 + (k - 1) * t;
    p.setX(i, p.getX(i) * s);
    p.setZ(i, p.getZ(i) * s);
    if (p.getY(i) < -len) p.setY(i, -len + (p.getY(i) + len) * k);
  }
  return smoothNormals(g);
}

export function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0, ...opts });
}

export function mesh(geo, material, { shadow = true } = {}) {
  const m = new THREE.Mesh(geo, material);
  m.castShadow = shadow;
  m.receiveShadow = true;
  return m;
}
