// The island: terrain, water, river and bridges, roads, every point of
// interest with enterable buildings, scatter (trees, rocks, bushes), fences,
// colliders, loot spawn points and breakable crates.
import * as THREE from '../vendor/three.module.min.js';
import { mulberry32, smoothNoise, clamp } from './util.js';
import { mat, geo } from './models.js';
import { Physics } from './physics.js';

const HALF = 200;
const RIVER_HALF = 5;
const BRIDGES = [-95, 5, 100];
const BRIDGE_HALF = 3.6;

export function islandRadius(a) {
  return 160 + 11 * Math.sin(3 * a + 1) + 7 * Math.sin(5 * a + 2.3) + 4 * Math.sin(9 * a + 0.7);
}
export function riverX(z) { return 18 + 13 * Math.sin(z / 34); }
export function shoreDist(x, z) { return islandRadius(Math.atan2(z, x)) - Math.hypot(x, z); }

// Spot on the north beach where the menu shows the selected character,
// with the sea as backdrop.
const SHOW_A = -1.95;
const SHOW_R = 160 + 11 * Math.sin(3 * SHOW_A + 1) + 7 * Math.sin(5 * SHOW_A + 2.3) + 4 * Math.sin(9 * SHOW_A + 0.7) - 7;
export const SHOWCASE = { x: Math.cos(SHOW_A) * SHOW_R, z: Math.sin(SHOW_A) * SHOW_R };

export const POIS = [
  { name: 'Pebble Town', x: -55, z: 5 },
  { name: 'Maple Row', x: -100, z: -72 },
  { name: 'Fort Grizzly', x: 92, z: -92 },
  { name: 'Rustworks', x: 104, z: 42 },
  { name: 'Big Box Depot', x: 50, z: 120 },
  { name: 'Clover Farms', x: -92, z: 92 },
  { name: 'Whisper Woods', x: -28, z: -128 },
  { name: 'Sunny Shore', x: -10, z: 150 },
  { name: 'Windy Fields', x: 62, z: -12 },
  { name: 'Old Lighthouse', x: -150, z: 8 },
];

// Simple instanced-box batcher: thousands of boxes in a few draw calls.
class BoxBatch {
  constructor(material, castShadow = true) { this.material = material; this.items = []; this.cast = castShadow; }
  add(x, y, z, sx, sy, sz, color, rotY = 0) { this.items.push([x, y, z, sx, sy, sz, color, rotY]); return this.items.length - 1; }
  build(scene) {
    if (!this.items.length) return null;
    const im = new THREE.InstancedMesh(geo.box, this.material, this.items.length);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), c = new THREE.Color();
    const e = new THREE.Euler();
    this.items.forEach(([x, y, z, sx, sy, sz, color, ry], i) => {
      q.setFromEuler(e.set(0, ry, 0));
      m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(sx, sy, sz));
      im.setMatrixAt(i, m);
      im.setColorAt(i, c.set(color));
    });
    im.castShadow = this.cast;
    im.receiveShadow = true;
    scene.add(im);
    this.mesh = im;
    return im;
  }
}

// Instanced arbitrary geometry (trees, rocks...).
class InstBatch {
  constructor(geometry, material, cast = true) { this.geometry = geometry; this.material = material; this.items = []; this.cast = cast; }
  add(x, y, z, sx, sy, sz, color, ry = 0, rx = 0, rz = 0) { this.items.push([x, y, z, sx, sy, sz, color, ry, rx, rz]); }
  build(scene) {
    if (!this.items.length) return null;
    const im = new THREE.InstancedMesh(this.geometry, this.material, this.items.length);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), c = new THREE.Color(), e = new THREE.Euler();
    this.items.forEach(([x, y, z, sx, sy, sz, color, ry, rx, rz], i) => {
      q.setFromEuler(e.set(rx, ry, rz));
      m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(sx, sy, sz));
      im.setMatrixAt(i, m);
      im.setColorAt(i, c.set(color));
    });
    im.castShadow = this.cast;
    im.receiveShadow = true;
    scene.add(im);
    return im;
  }
}

export class World {
  constructor(scene) {
    this.scene = scene;
    this.half = HALF;
    this.rng = mulberry32(1337);
    this.physics = new Physics(this);
    this.group = new THREE.Group();
    scene.add(this.group);
    this.reserved = [];      // rects scatter must avoid
    this.lootSpots = [];     // { x, z, inside, tier }
    this.crateSpots = [];    // { x, z, gold }
    this.roofs = [];         // { rect, mesh }
    this.buildings = [];
    this.animated = [];      // things to spin (windmill, lighthouse)
    this.landmarks = [];     // for the minimap
    this.roads = [];         // for the minimap
    this.minimapRects = [];  // buildings for the minimap
    const std = new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.85 });
    this.boxes = new BoxBatch(std);
    this.flat = new BoxBatch(new THREE.MeshStandardMaterial({ roughness: 0.95 }), false);
    this.trunks = new InstBatch(geo.cyl6, new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.9 }));
    this.pines = new InstBatch(geo.cone, new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.85 }));
    this.leafy = new InstBatch(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.85 }));
    this.rocks = new InstBatch(new THREE.DodecahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.95 }));
    this.bushes = new InstBatch(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.9 }), false);
    this.cyls = new InstBatch(geo.cyl, new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.7 }));
    this.cones = new InstBatch(geo.cone, new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.8 }));

    this.reserve(SHOWCASE.x - 16, SHOWCASE.z - 8, SHOWCASE.x + 16, SHOWCASE.z + 20);
    this.buildTerrain();
    this.buildWater();
    this.buildRoadsAndBridges();
    this.buildTown();
    this.buildResidential();
    this.buildMilitary();
    this.buildIndustrial();
    this.buildWarehouse();
    this.buildFarm();
    this.buildForest();
    this.buildBeach();
    this.buildFields();
    this.buildLighthouse();
    this.scatter();

    for (const b of [this.boxes, this.flat, this.trunks, this.pines, this.leafy, this.rocks, this.bushes, this.cyls, this.cones]) b.build(this.group);
    this.buildCrateMeshes();
  }

  // ---------------------------------------------------------------- queries
  isWalkable(x, z) {
    if (shoreDist(x, z) < 1.2) return false;
    if (Math.abs(x - riverX(z)) < RIVER_HALF) {
      for (const b of BRIDGES) if (Math.abs(z - b) < BRIDGE_HALF) return true;
      return false;
    }
    return true;
  }
  isReserved(x, z, pad = 0) {
    for (const r of this.reserved) if (x > r[0] - pad && x < r[2] + pad && z > r[1] - pad && z < r[3] + pad) return true;
    return false;
  }
  reserve(minX, minZ, maxX, maxZ) { this.reserved.push([minX, minZ, maxX, maxZ]); }

  // ---------------------------------------------------------------- terrain
  groundColor(x, z) {
    const sd = shoreDist(x, z);
    const n = smoothNoise(x * 0.08, z * 0.08);
    const n2 = smoothNoise(x * 0.3 + 50, z * 0.3);
    if (sd < 3) return [0.93, 0.83, 0.58];
    if (sd < 10) return [0.96, 0.87, 0.6];
    const rd = Math.abs(x - riverX(z));
    if (rd < RIVER_HALF + 1.5) return [0.78, 0.7, 0.5];
    // POI ground
    if (Math.hypot(x + 55, z - 5) < 16) return [0.78, 0.75, 0.7]; // plaza paving
    if (x > 64 && x < 122 && z > -122 && z < -62) return [0.62, 0.64, 0.56]; // base
    if (x > 78 && x < 132 && z > 18 && z < 68) return [0.5, 0.5, 0.52]; // industrial
    if (x > 26 && x < 76 && z > 104 && z < 138) return [0.6, 0.6, 0.62]; // depot lot
    if (x > -125 && x < -90 && z > 70 && z < 120) { // crop fields
      const stripe = Math.floor((x + 125) / 2.5) % 2;
      return stripe ? [0.55, 0.4, 0.24] : [0.7, 0.68, 0.25];
    }
    if (Math.hypot(x + 28, z + 128) < 34) return [0.25 + n * 0.08, 0.45 + n * 0.08, 0.22]; // forest floor
    if (Math.hypot(x - 62, z + 12) < 26) return [0.62 + n * 0.08, 0.76, 0.32]; // fields
    const g = 0.56 + n * 0.14 + n2 * 0.05;
    return [0.34 + n * 0.1 - n2 * 0.04, g, 0.24 + n2 * 0.06];
  }

  groundHeight(x, z) {
    const sd = shoreDist(x, z);
    let h = 0;
    if (sd < 2) h = sd > -8 ? -1.8 * ((2 - sd) / 10) : -1.8 - Math.min(4, (-sd - 8) * 0.25);
    const rd = Math.abs(x - riverX(z));
    if (rd < RIVER_HALF + 2 && sd > 0) {
      const t = clamp((RIVER_HALF + 2 - rd) / 3, 0, 1);
      h = Math.min(h, -1.8 * t);
    }
    return h;
  }

  buildTerrain() {
    const size = 440, seg = 220;
    const g = new THREE.PlaneGeometry(size, size, seg, seg);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      pos.setY(i, this.groundHeight(x, z));
      const c = this.groundColor(x, z);
      colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: false });
    const ground = new THREE.Mesh(g, m);
    ground.receiveShadow = true;
    this.group.add(ground);
  }

  buildWater() {
    const g = new THREE.PlaneGeometry(1400, 1400, 70, 70);
    g.rotateX(-Math.PI / 2);
    this.waterGeo = g;
    this.waterBase = Float32Array.from(g.attributes.position.array);
    const m = new THREE.MeshStandardMaterial({ color: '#2fb8e6', roughness: 0.35, metalness: 0.05, flatShading: true, transparent: true, opacity: 0.88 });
    this.water = new THREE.Mesh(g, m);
    this.water.position.y = -0.45;
    this.water.receiveShadow = true;
    this.group.add(this.water);
    // foam ring along the shore
    const pts = [];
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      const r = islandRadius(a) + 2.5;
      pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
    }
    const ring = new THREE.Shape(pts);
    const hole = new THREE.Path(pts.map((p) => p.clone().multiplyScalar(0.975)));
    ring.holes.push(hole);
    const foam = new THREE.Mesh(new THREE.ShapeGeometry(ring), new THREE.MeshBasicMaterial({ color: '#e9fbff', transparent: true, opacity: 0.55, depthWrite: false }));
    foam.rotation.x = Math.PI / 2;
    foam.position.y = -0.38;
    this.foam = foam;
    this.group.add(foam);
  }

  update(t) {
    const pos = this.waterGeo.attributes.position;
    const base = this.waterBase;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3], z = base[i * 3 + 2];
      pos.array[i * 3 + 1] = Math.sin(x * 0.07 + t * 1.3) * 0.18 + Math.cos(z * 0.09 + t * 1.1) * 0.15;
    }
    pos.needsUpdate = true;
    this.water.geometry.computeVertexNormals();
    this.foam.material.opacity = 0.4 + Math.sin(t * 1.5) * 0.15;
    for (const a of this.animated) a.fn(a.obj, t);
  }

  // ---------------------------------------------------------------- roads
  road(x0, z0, x1, z1, w = 6) {
    const minX = Math.min(x0, x1) - w / 2, maxX = Math.max(x0, x1) + w / 2;
    const minZ = Math.min(z0, z1) - w / 2, maxZ = Math.max(z0, z1) + w / 2;
    // Skip the stretch that crosses the river; bridges cover it.
    const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2;
    this.flat.add(cx, 0.03, cz, maxX - minX, 0.06, maxZ - minZ, '#4a4d57');
    const horizontal = maxX - minX > maxZ - minZ;
    const len = horizontal ? maxX - minX : maxZ - minZ;
    for (let d = 2; d < len - 2; d += 5) {
      if (horizontal) this.flat.add(minX + d, 0.07, cz, 2.2, 0.02, 0.25, '#ffd23f');
      else this.flat.add(cx, 0.07, minZ + d, 0.25, 0.02, 2.2, '#ffd23f');
    }
    this.reserve(minX, minZ, maxX, maxZ);
    this.roads.push([x0, z0, x1, z1, w]);
  }

  buildRoadsAndBridges() {
    // East-west roads, split at the river.
    for (const z of BRIDGES) {
      const rx = riverX(z);
      const r = this.edgeX(z);
      this.road(-r + 14, z, rx - RIVER_HALF - 1, z);
      this.road(rx + RIVER_HALF + 1, z, r - 14, z);
      // bridge
      const len = RIVER_HALF * 2 + 4;
      for (let i = 0; i < len; i += 0.9) this.boxes.add(rx - len / 2 + i + 0.4, 0.0, z, 0.8, 0.3, BRIDGE_HALF * 2 + 0.4, i % 1.8 < 0.9 ? '#a8754a' : '#956540');
      for (const s of [-1, 1]) {
        const zz = z + s * (BRIDGE_HALF + 0.2);
        this.boxes.add(rx, 0.75, zz, len, 0.18, 0.2, '#7a4f2e');
        for (let i = 0; i <= len; i += 2.4) this.boxes.add(rx - len / 2 + i, 0.4, zz, 0.25, 0.9, 0.25, '#6a4428');
        this.physics.addBox(rx - len / 2, zz - 0.2, rx + len / 2, zz + 0.2, { bullets: false, tag: 'fence' });
      }
      this.reserve(rx - len / 2 - 2, z - 6, rx + len / 2 + 2, z + 6);
    }
    // North-south roads on each side of the river.
    this.road(-55, -130, -55, 120);
    this.road(95, -125, 95, 108);
  }

  edgeX(z) {
    // distance along +x to the shore at this z (approximation by search)
    let x = 0;
    while (x < 220 && shoreDist(x, z) > 0) x += 2;
    let xn = 0;
    while (xn > -220 && shoreDist(xn, z) > 0) xn -= 2;
    return Math.min(x, -xn);
  }

  // ---------------------------------------------------------------- building
  // b: { x, z, w, d, h, wall, roof, floor, doors:['S','N','E','W'], roofType, furniture, loot, name }
  building(b) {
    const t = 0.4, h = b.h || 2.8, doorW = 2.6;
    const x0 = b.x - b.w / 2, x1 = b.x + b.w / 2, z0 = b.z - b.d / 2, z1 = b.z + b.d / 2;
    const doors = b.doors || ['S'];
    const wallColor = b.wall || '#f2e6cf';
    const trim = b.trim || '#ffffff';
    const addWall = (ax, az, bx, bz, side) => {
      const horizontal = az === bz;
      const len = horizontal ? bx - ax : bz - az;
      const hasDoor = doors.includes(side);
      const segs = [];
      if (hasDoor) {
        const mid = len / 2;
        segs.push([0, mid - doorW / 2], [mid + doorW / 2, len]);
      } else segs.push([0, len]);
      for (const [s, e] of segs) {
        const l = e - s;
        if (l <= 0.01) continue;
        let cx, cz, sx, sz;
        if (horizontal) { cx = ax + s + l / 2; cz = az; sx = l; sz = t; }
        else { cx = ax; cz = az + s + l / 2; sx = t; sz = l; }
        this.boxes.add(cx, h / 2, cz, sx, h, sz, wallColor);
        this.boxes.add(cx, 0.12, cz, sx + 0.06, 0.24, sz + 0.06, trim);
        this.physics.addBox(cx - sx / 2, cz - sz / 2, cx + sx / 2, cz + sz / 2, { tag: 'wall' });
        // windows
        if (b.windows !== false) {
          for (let wpos = 1.8; wpos < l - 1.2; wpos += 3.2) {
            const off = s + wpos;
            const wx = horizontal ? ax + off : ax, wz = horizontal ? az : az + off;
            const outward = side === 'S' ? 1 : side === 'N' ? -1 : side === 'E' ? 1 : -1;
            const ox = horizontal ? 0 : outward * 0.04, oz = horizontal ? outward * 0.04 : 0;
            this.boxes.add(wx + ox, h * 0.58, wz + oz, horizontal ? 1.1 : t + 0.02, 0.8, horizontal ? t + 0.02 : 1.1, '#5aa9d6');
            this.boxes.add(wx + ox, h * 0.58 - 0.45, wz + oz, horizontal ? 1.3 : t + 0.1, 0.1, horizontal ? t + 0.1 : 1.3, trim);
          }
        }
      }
      if (hasDoor) {
        const mid = len / 2;
        const lx = horizontal ? ax + mid : ax, lz = horizontal ? az : az + mid;
        this.boxes.add(lx, h - 0.3, lz, horizontal ? doorW : t, 0.6, horizontal ? t : doorW, wallColor);
      }
    };
    addWall(x0, z0, x1, z0, 'N');
    addWall(x0, z1, x1, z1, 'S');
    addWall(x0, z0, x0, z1, 'W');
    addWall(x1, z0, x1, z1, 'E');
    // floor
    this.boxes.add(b.x, 0.04, b.z, b.w - 0.1, 0.08, b.d - 0.1, b.floor || '#c89f74');
    // roof (separate mesh so it can fade when the player walks in)
    const roofColor = b.roof || '#e05a4f';
    const roofM = new THREE.MeshStandardMaterial({ color: roofColor, flatShading: true, roughness: 0.8, transparent: false, opacity: 1 });
    const roof = new THREE.Group();
    if (b.roofType === 'gable') {
      const shape = new THREE.Shape();
      const rw = b.w / 2 + 0.5;
      shape.moveTo(-rw, 0); shape.lineTo(rw, 0); shape.lineTo(0, Math.min(2.4, b.w * 0.28)); shape.lineTo(-rw, 0);
      const eg = new THREE.ExtrudeGeometry(shape, { depth: b.d + 1, bevelEnabled: false });
      eg.translate(0, 0, -(b.d + 1) / 2);
      const m = new THREE.Mesh(eg, roofM);
      m.castShadow = true;
      roof.add(m);
    } else {
      const m = new THREE.Mesh(geo.box, roofM);
      m.scale.set(b.w + 0.4, 0.35, b.d + 0.4);
      m.castShadow = true;
      roof.add(m);
      const lipM = new THREE.MeshStandardMaterial({ color: b.trim || '#d8d2c4', flatShading: true });
      for (const [sx, sz, px, pz] of [[b.w + 0.4, 0.3, 0, b.d / 2], [b.w + 0.4, 0.3, 0, -b.d / 2], [0.3, b.d + 0.4, b.w / 2, 0], [0.3, b.d + 0.4, -b.w / 2, 0]]) {
        const lip = new THREE.Mesh(geo.box, lipM);
        lip.scale.set(sx, 0.5, sz); lip.position.set(px, 0.3, pz);
        roof.add(lip);
      }
      if (b.w > 8) { // AC unit
        const ac = new THREE.Mesh(geo.box, new THREE.MeshStandardMaterial({ color: '#b8bec8', flatShading: true }));
        ac.scale.set(1.4, 0.8, 1.2); ac.position.set(b.w * 0.2, 0.55, -b.d * 0.15);
        roof.add(ac);
      }
    }
    roof.position.set(b.x, h, b.z);
    this.group.add(roof);
    const mats = [];
    roof.traverse((o) => { if (o.material && !mats.includes(o.material)) mats.push(o.material); });
    this.roofs.push({ rect: [x0, z0, x1, z1], roof, mats, fade: 1 });
    this.minimapRects.push([x0, z0, x1, z1, roofColor]);
    this.reserve(x0 - 1.5, z0 - 1.5, x1 + 1.5, z1 + 1.5);
    this.buildings.push(b);

    // furniture + loot
    const fr = this.rng;
    const inner = { x0: x0 + 1.2, x1: x1 - 1.2, z0: z0 + 1.2, z1: z1 - 1.2 };
    const furn = b.furniture || 'house';
    const pieces = Math.floor((b.w * b.d) / 26);
    for (let i = 0; i < pieces; i++) {
      const fx = inner.x0 + fr() * (inner.x1 - inner.x0), fz = inner.z0 + fr() * (inner.z1 - inner.z0);
      // keep doorways clear
      if (Math.abs(fx - b.x) < 2.2 || Math.abs(fz - b.z) < 2.2) continue;
      if (furn === 'house') {
        const kind = fr();
        if (kind < 0.35) this.prop(fx, fz, 1.6, 0.8, 1.0, '#8a5a3a', false); // table
        else if (kind < 0.65) this.prop(fx, fz, 2.0, 0.6, 1.0, fr() < 0.5 ? '#5a7ad8' : '#d85a7a', false); // sofa/bed
        else this.prop(fx, fz, 1.0, 1.8, 0.6, '#6b4a2b', true); // cupboard
      } else if (furn === 'shelves') {
        this.prop(fx, fz, 3.2, 2.0, 0.8, '#7f8a99', true);
        this.boxes.add(fx, 1.0, fz, 2.8, 0.25, 0.7, '#c8a46a');
      } else if (furn === 'machines') {
        this.prop(fx, fz, 2.4, 1.6, 1.6, '#4f6a8a', true);
      } else if (furn === 'barracks') {
        this.prop(fx, fz, 1.0, 0.6, 2.2, '#5d6b3a', false);
      } else if (furn === 'barn') {
        this.cyls.add(fx, 0.6, fz, 0.7, 1.2, 0.7, '#e2c25a', 0, 0, Math.PI / 2);
        this.physics.addBox(fx - 0.7, fz - 0.7, fx + 0.7, fz + 0.7, { tag: 'hay' });
      }
    }
    const lootCount = Math.max(2, b.loot ? b.loot + 1 : Math.round((b.w * b.d) / 22));
    for (let i = 0; i < lootCount; i++) {
      this.lootSpots.push({ x: inner.x0 + fr() * (inner.x1 - inner.x0), z: inner.z0 + fr() * (inner.z1 - inner.z0), inside: true, tier: b.tier || 0 });
    }
  }

  prop(x, z, w, h, d, color, blocksBullets) {
    this.boxes.add(x, h / 2, z, w, h, d, color);
    this.physics.addBox(x - w / 2, z - d / 2, x + w / 2, z + d / 2, { bullets: blocksBullets, tag: 'prop' });
  }

  solid(x, z, w, h, d, color, ry = 0) {
    this.boxes.add(x, h / 2, z, w, h, d, color, ry);
    this.physics.addBox(x - w / 2, z - d / 2, x + w / 2, z + d / 2, { tag: 'solid' });
    this.reserve(x - w / 2 - 1, z - d / 2 - 1, x + w / 2 + 1, z + d / 2 + 1);
  }

  fence(x0, z0, x1, z1, color = '#f4efe2') {
    const horizontal = Math.abs(z1 - z0) < Math.abs(x1 - x0);
    const len = horizontal ? Math.abs(x1 - x0) : Math.abs(z1 - z0);
    const sx = Math.min(x0, x1), sz = Math.min(z0, z1);
    for (let d = 0; d <= len + 0.01; d += 2) {
      const px = horizontal ? sx + d : x0, pz = horizontal ? z0 : sz + d;
      this.boxes.add(px, 0.55, pz, 0.18, 1.1, 0.18, color);
    }
    const cx = horizontal ? sx + len / 2 : x0, cz = horizontal ? z0 : sz + len / 2;
    for (const y of [0.45, 0.85]) this.boxes.add(cx, y, cz, horizontal ? len : 0.1, 0.12, horizontal ? 0.1 : len, color);
    this.physics.addBox(cx - (horizontal ? len / 2 : 0.12), cz - (horizontal ? 0.12 : len / 2), cx + (horizontal ? len / 2 : 0.12), cz + (horizontal ? 0.12 : len / 2), { bullets: false, tag: 'fence' });
  }

  tree(x, z, kind = 'leafy', s = 1) {
    const r = this.rng;
    const trunkH = (kind === 'pine' ? 1.4 : 1.8) * s;
    this.trunks.add(x, trunkH / 2, z, 0.28 * s, trunkH, 0.28 * s, '#7a5232');
    if (kind === 'pine') {
      const greens = ['#2f7d4a', '#2a6e43', '#36894f'];
      const c = greens[Math.floor(r() * 3)];
      this.pines.add(x, trunkH + 1.3 * s, z, 1.9 * s, 2.6 * s, 1.9 * s, c, r() * 6);
      this.pines.add(x, trunkH + 2.7 * s, z, 1.4 * s, 2.0 * s, 1.4 * s, c, r() * 6);
    } else if (kind === 'palm') {
      this.trunks.add(x + 0.3 * s, trunkH + 1.6 * s, z, 0.22 * s, 2.4 * s, 0.22 * s, '#a0784a');
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + r();
        this.leafy.add(x + 0.3 * s + Math.cos(a) * 1.1 * s, trunkH + 2.8 * s, z + Math.sin(a) * 1.1 * s, 1.4 * s, 0.18 * s, 0.5 * s, '#3fae4f', -a, 0, 0.3);
      }
    } else {
      const greens = ['#4caf50', '#5cbf4a', '#3e9e48', '#7cc84a'];
      const c = greens[Math.floor(r() * 4)];
      this.leafy.add(x, trunkH + 1.2 * s, z, 1.7 * s, 1.5 * s, 1.7 * s, c, r() * 6);
      this.leafy.add(x + 0.5 * s, trunkH + 1.9 * s, z - 0.3 * s, 1.1 * s, 1.0 * s, 1.1 * s, c, r() * 6);
    }
    this.physics.addCircle(x, z, 0.45 * s, { tag: 'tree' });
  }

  rock(x, z, s = 1) {
    const r = this.rng;
    const grey = ['#9aa0a8', '#8a9099', '#a9adb3'][Math.floor(r() * 3)];
    this.rocks.add(x, 0.3 * s, z, 1.2 * s, 0.9 * s, 1.0 * s, grey, r() * 6, r() * 0.3, r() * 0.3);
    this.physics.addCircle(x, z, 1.05 * s, { tag: 'rock' });
  }

  crate(x, z, gold = false) { this.crateSpots.push({ x, z, gold }); }
  loot(x, z, tier = 0) { this.lootSpots.push({ x, z, inside: false, tier }); }
  landmark(name, x, z) { this.landmarks.push({ name, x, z }); }

  // ---------------------------------------------------------------- POIs
  buildTown() {
    const cx = -55, cz = 5;
    // fountain landmark
    this.cyls.add(cx, 0.35, cz, 3.2, 0.7, 3.2, '#c9c4bb');
    this.cyls.add(cx, 0.6, cz, 2.8, 0.2, 2.8, '#46c1ef');
    this.cyls.add(cx, 1.4, cz, 0.4, 2.2, 0.4, '#c9c4bb');
    this.cyls.add(cx, 2.5, cz, 1.2, 0.2, 1.2, '#c9c4bb');
    this.physics.addCircle(cx, cz, 3.2, { bullets: false, tag: 'fountain' });
    this.reserve(cx - 16, cz - 16, cx + 16, cz + 16);
    // clock tower
    this.solid(cx + 12, cz - 12, 3, 9, 3, '#d8b48a');
    this.cones.add(cx + 12, 10.2, cz - 12, 2.6, 2.6, 2.6, '#3d5a9e', Math.PI / 4);
    this.boxes.add(cx + 12, 7.5, cz - 10.45, 1.6, 1.6, 0.1, '#ffffff');
    this.landmark('Clock Tower', cx + 12, cz - 12);
    const shops = [
      [cx - 24, cz - 18, 12, 9, '#f6c76b', '#c0503f', ['S', 'E']],
      [cx - 24, cz + 2, 10, 10, '#a8d8ea', '#3d5a9e', ['E']],
      [cx - 24, cz + 22, 12, 9, '#f2a7b9', '#7a3e8c', ['N', 'E']],
      [cx + 4, cz - 26, 11, 9, '#c5e3a6', '#3e7d4a', ['S']],
      [cx - 8, cz + 28, 10, 9, '#ffe08a', '#d0643a', ['N']],
      [cx + 10, cz + 26, 9, 9, '#e8d5c0', '#8a4a3a', ['N', 'W']],
      [cx + 28, cz - 2, 10, 14, '#bfe1f2', '#4a4a6a', ['W']],
      [cx + 26, cz + 18, 9, 9, '#f3c1a0', '#b0453a', ['W', 'N']],
    ];
    for (const [x, z, w, d, wall, roof, doors] of shops) {
      this.building({ x, z, w, d, wall, roof, doors, furniture: 'house', roofType: 'flat' });
    }
    // benches, lamps, cars
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const lx = cx + Math.cos(a) * 12, lz = cz + Math.sin(a) * 12;
      this.cyls.add(lx, 1.6, lz, 0.1, 3.2, 0.1, '#3a3a48');
      this.boxes.add(lx, 3.25, lz, 0.5, 0.3, 0.5, '#fff1b0');
    }
    this.car(cx - 10, cz + 14, '#ff6b6b');
    this.car(cx + 14, cz + 6, '#4fa3ff', true);
    this.car(cx - 40, cz + 5, '#ffd23f', true);
    this.crate(cx - 6, cz - 12); this.crate(cx + 6, cz + 12); this.crate(cx - 14, cz - 4, true);
    for (let i = 0; i < 6; i++) this.loot(cx - 14 + i * 5, cz + (i % 2 ? 9 : -9));
  }

  car(x, z, color, alongZ = false) {
    const w = alongZ ? 2 : 4, d = alongZ ? 4 : 2;
    this.boxes.add(x, 0.55, z, w, 0.7, d, color);
    this.boxes.add(x, 1.15, z, alongZ ? 1.7 : 2.2, 0.6, alongZ ? 2.2 : 1.7, '#bfe6ff');
    for (const [ox, oz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      this.boxes.add(x + ox * (w / 2 - 0.5), 0.3, z + oz * (d / 2 - 0.5), alongZ ? 0.3 : 0.6, 0.6, alongZ ? 0.6 : 0.3, '#22222c');
    }
    this.physics.addBox(x - w / 2, z - d / 2, x + w / 2, z + d / 2, { tag: 'car' });
    this.reserve(x - w / 2 - 1, z - d / 2 - 1, x + w / 2 + 1, z + d / 2 + 1);
  }

  buildResidential() {
    const cx = -100, cz = -72;
    const walls = ['#fff3d6', '#d6ecff', '#ffd9d9', '#e2f5d4', '#f5e1ff', '#fff0b8'];
    const roofs = ['#d95f4b', '#4d6fb5', '#5b8c4a', '#8c5ab5', '#c97a2b', '#4a4a5e'];
    let k = 0;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        const x = cx - 27 + col * 18, z = cz - 12 + row * 26;
        const door = row === 0 ? 'S' : 'N';
        this.building({ x, z, w: 10, d: 8, wall: walls[k % 6], roof: roofs[k % 6], doors: [door], roofType: 'gable', furniture: 'house' });
        // yard fence
        const fz = row === 0 ? z - 7 : z + 7;
        this.fence(x - 7, fz, x + 7, fz);
        this.fence(x - 7, row === 0 ? fz : z + 4, x - 7, row === 0 ? z - 4 : fz);
        this.tree(x + 6.5, row === 0 ? z - 5 : z + 5, 'leafy', 0.8);
        this.boxes.add(x + 2, 0.5, row === 0 ? z + 6 : z - 6, 0.3, 1.0, 0.3, '#4a4a5e');
        this.boxes.add(x + 2, 1.05, row === 0 ? z + 6 : z - 6, 0.5, 0.35, 0.7, '#3d6bd8');
        k++;
      }
    }
    this.road(cx - 38, cz + 1, cx + 38, cz + 1, 5);
    this.car(cx + 10, cz + 1, '#7ad8a0');
    this.crate(cx - 18, cz + 6); this.crate(cx + 26, cz - 4); this.crate(cx, cz - 26, true);
    // swimming pool behind a house
    this.flat.add(cx + 30, 0.02, cz - 28, 6, 0.06, 4, '#e8e4dc');
    this.flat.add(cx + 30, 0.05, cz - 28, 5, 0.06, 3, '#4fd1ff');
    this.landmark('Pool', cx + 30, cz - 28);
  }

  buildMilitary() {
    const cx = 92, cz = -92, hw = 28, hd = 28;
    const wallC = '#a8ab98';
    const seg = (x0, z0, x1, z1) => {
      const w = Math.max(0.8, Math.abs(x1 - x0)), d = Math.max(0.8, Math.abs(z1 - z0));
      this.solid((x0 + x1) / 2, (z0 + z1) / 2, w, 2.4, d, wallC);
    };
    // perimeter with gates on S and W
    seg(cx - hw, cz - hd, cx + hw, cz - hd);
    seg(cx - hw, cz + hd, cx - 4, cz + hd); seg(cx + 4, cz + hd, cx + hw, cz + hd);
    seg(cx - hw, cz - hd, cx - hw, cz - 4); seg(cx - hw, cz + 4, cx - hw, cz + hd);
    seg(cx + hw, cz - hd, cx + hw, cz + hd);
    this.reserve(cx - hw - 2, cz - hd - 2, cx + hw + 2, cz + hd + 2);
    // barracks + HQ
    this.building({ x: cx - 14, z: cz - 14, w: 14, d: 8, wall: '#7f8c5a', roof: '#4e5a34', trim: '#5c6640', doors: ['S', 'E'], furniture: 'barracks', roofType: 'flat', tier: 1 });
    this.building({ x: cx - 14, z: cz + 12, w: 14, d: 8, wall: '#7f8c5a', roof: '#4e5a34', trim: '#5c6640', doors: ['N', 'E'], furniture: 'barracks', roofType: 'flat', tier: 1 });
    this.building({ x: cx + 13, z: cz - 12, w: 12, d: 12, wall: '#c9c7b5', roof: '#5a5f4a', trim: '#8b8d78', doors: ['W', 'S'], furniture: 'machines', roofType: 'flat', tier: 2, loot: 4 });
    // radar dish landmark
    const rx = cx + 14, rz = cz + 14;
    this.solid(rx, rz, 2.2, 5, 2.2, '#8b8d78');
    const dish = new THREE.Group();
    const bowl = new THREE.Mesh(new THREE.SphereGeometry(3, 12, 6, 0, Math.PI * 2, 0, Math.PI / 3), mat('#e9ecef', { rough: 0.4 }));
    bowl.material.side = THREE.DoubleSide;
    bowl.rotation.x = Math.PI / 2.4;
    bowl.castShadow = true;
    dish.add(bowl);
    dish.position.set(rx, 6.5, rz);
    this.group.add(dish);
    this.animated.push({ obj: dish, fn: (o, t) => { o.rotation.y = t * 0.4; } });
    this.landmark('Radar', rx, rz);
    // watchtowers at corners
    for (const [sx, sz] of [[-1, -1], [1, 1]]) {
      const tx = cx + sx * (hw - 3), tz = cz + sz * (hd - 3);
      for (const [ox, oz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        this.boxes.add(tx + ox * 1.1, 2.5, tz + oz * 1.1, 0.3, 5, 0.3, '#6a5a3a');
        this.physics.addCircle(tx + ox * 1.1, tz + oz * 1.1, 0.25, { tag: 'post' });
      }
      this.boxes.add(tx, 5.1, tz, 3, 0.3, 3, '#7a6a48');
      this.cones.add(tx, 6.6, tz, 2.4, 1.4, 2.4, '#4e5a34', Math.PI / 4);
      this.loot(tx, tz, 1);
    }
    // sandbag cover + containers + helipad
    for (const [x, z, w, d] of [[cx - 4, cz - 2, 4, 1], [cx + 2, cz + 4, 1, 4], [cx - 2, cz + 20, 5, 1], [cx + 6, cz - 22, 5, 1]]) {
      this.boxes.add(x, 0.5, z, w, 1.0, d, '#c8b88a');
      this.physics.addBox(x - w / 2, z - d / 2, x + w / 2, z + d / 2, { tag: 'sandbag' });
    }
    this.container(cx + 20, cz - 1, '#3e7d4a');
    this.container(cx + 20, cz + 3, '#c0503f');
    this.flat.add(cx - 2, 0.05, cz + 2, 10, 0.05, 10, '#5c6640');
    this.flat.add(cx - 2, 0.08, cz + 2, 6, 0.05, 1, '#ffffff');
    this.flat.add(cx - 4.5, 0.08, cz + 2, 1, 0.05, 6, '#ffffff');
    this.flat.add(cx + 0.5, 0.08, cz + 2, 1, 0.05, 6, '#ffffff');
    this.crate(cx - 6, cz - 6, true); this.crate(cx + 4, cz + 12, true); this.crate(cx + 4, cz - 4);
    this.loot(cx - 2, cz + 2, 2); this.loot(cx + 8, cz + 8, 1); this.loot(cx - 20, cz, 1);
  }

  container(x, z, color, alongZ = false) {
    const w = alongZ ? 2.6 : 6, d = alongZ ? 6 : 2.6;
    this.solid(x, z, w, 2.6, d, color);
    for (let i = -2; i <= 2; i++) {
      if (alongZ) this.boxes.add(x + 1.32, 1.3, z + i * 1.1, 0.06, 2.4, 0.15, '#2a2a2a');
      else this.boxes.add(x + i * 1.1, 1.3, z + 1.32, 0.15, 2.4, 0.06, '#222222');
    }
  }

  buildIndustrial() {
    const cx = 104, cz = 42;
    this.building({ x: cx - 12, z: cz - 10, w: 20, d: 14, h: 4, wall: '#b8b2a6', roof: '#6a7f9a', trim: '#7b766c', doors: ['S', 'W', 'N'], furniture: 'machines', roofType: 'flat', tier: 1, loot: 5 });
    this.building({ x: cx + 12, z: cz + 12, w: 16, d: 12, h: 4, wall: '#c9a27a', roof: '#4a5a6a', trim: '#8a6a4a', doors: ['W', 'N'], furniture: 'machines', roofType: 'flat', loot: 4 });
    // chimneys landmark
    for (const [x, z] of [[cx + 14, cz - 14], [cx + 19, cz - 14]]) {
      this.cyls.add(x, 5, z, 1.2, 10, 1.2, '#d9d4cc');
      for (let y = 2; y < 10; y += 3.5) this.cyls.add(x, y, z, 1.26, 1.1, 1.26, '#e04a3f');
      this.physics.addCircle(x, z, 1.4, { tag: 'chimney' });
      this.reserve(x - 2, z - 2, x + 2, z + 2);
    }
    this.landmark('Chimneys', cx + 16, cz - 14);
    // storage tanks
    for (const [x, z] of [[cx - 16, cz + 14], [cx - 8, cz + 18]]) {
      this.cyls.add(x, 2.2, z, 3, 4.4, 3, '#e3e6ea');
      this.cyls.add(x, 4.5, z, 3.05, 0.25, 3.05, '#ffb320');
      this.physics.addCircle(x, z, 3, { tag: 'tank' });
      this.reserve(x - 4, z - 4, x + 4, z + 4);
    }
    this.container(cx + 2, cz - 22, '#2f7fd8');
    this.container(cx + 4, cz + 2, '#ffb320', true);
    this.container(cx + 24, cz - 2, '#c0503f', true);
    // pipes
    this.boxes.add(cx - 2, 2.2, cz + 2, 0.6, 0.6, 14, '#8a96a8');
    this.crate(cx, cz + 10); this.crate(cx + 10, cz - 4, true); this.crate(cx - 22, cz + 4);
    this.loot(cx + 8, cz - 20); this.loot(cx - 2, cz + 22); this.loot(cx + 22, cz + 24);
  }

  buildWarehouse() {
    const cx = 50, cz = 120;
    this.building({ x: cx, z: cz, w: 30, d: 16, h: 4.2, wall: '#d4cbb8', roof: '#5f7a8c', trim: '#9a8f7a', doors: ['N', 'W', 'E'], furniture: 'shelves', roofType: 'flat', tier: 1, loot: 7 });
    this.landmark('Depot', cx, cz);
    // loading docks / trucks
    this.truck(cx - 8, cz - 15);
    this.truck(cx + 9, cz - 15);
    for (let i = 0; i < 4; i++) this.crate(cx - 18 + i * 1.6, cz - 10 + (i % 2) * 1.8);
    this.crate(cx + 18, cz - 10, true);
    this.loot(cx - 17, cz + 2); this.loot(cx + 17, cz + 2);
  }

  truck(x, z) {
    this.boxes.add(x, 1.4, z + 1, 3, 2.6, 5, '#f2f2f2');
    this.boxes.add(x, 1.0, z - 2.7, 2.8, 1.8, 2.2, '#ff6b4f');
    this.boxes.add(x, 1.5, z - 3.82, 2.4, 0.8, 0.05, '#bfe6ff');
    for (const [ox, oz] of [[-1.5, -2.6], [1.5, -2.6], [-1.5, 2.5], [1.5, 2.5]]) this.boxes.add(x + ox, 0.45, z + oz, 0.4, 0.9, 0.9, '#22222c');
    this.physics.addBox(x - 1.5, z - 3.8, x + 1.5, z + 3.5, { tag: 'truck' });
    this.reserve(x - 2.5, z - 5, x + 2.5, z + 5);
  }

  buildFarm() {
    const cx = -92, cz = 92;
    // barn
    this.building({ x: cx + 22, z: cz - 14, w: 14, d: 10, h: 3.6, wall: '#c8423a', roof: '#6b3a2a', trim: '#ffffff', doors: ['W', 'E'], furniture: 'barn', roofType: 'gable', windows: false, loot: 3 });
    this.building({ x: cx + 24, z: cz + 8, w: 9, d: 8, wall: '#fff3d6', roof: '#3e7d4a', doors: ['W'], furniture: 'house', roofType: 'gable' });
    // silos landmark
    for (const [x, z] of [[cx + 34, cz - 22], [cx + 38, cz - 16]]) {
      this.cyls.add(x, 4, z, 2.2, 8, 2.2, '#c9ccd2');
      this.cones.add(x, 8.8, z, 2.4, 1.6, 2.4, '#8a96a8');
      this.physics.addCircle(x, z, 2.2, { tag: 'silo' });
      this.reserve(x - 3, z - 3, x + 3, z + 3);
    }
    this.landmark('Silos', cx + 36, cz - 19);
    // windmill
    const wx = cx - 2, wz = cz - 32;
    this.solid(wx, wz, 2, 7, 2, '#e9e1cf');
    const blades = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const b = new THREE.Mesh(geo.box, mat('#ffffff'));
      b.scale.set(0.5, 4.2, 0.1); b.position.y = 2.1;
      const p = new THREE.Group(); p.rotation.z = (i / 4) * Math.PI * 2; p.add(b);
      blades.add(p);
    }
    blades.position.set(wx, 6.6, wz + 1.2);
    this.group.add(blades);
    this.animated.push({ obj: blades, fn: (o, t) => { o.rotation.z = t * 1.2; } });
    this.landmark('Windmill', wx, wz);
    // crop rows
    for (let x = -123; x < -91; x += 2.5) {
      for (let z = 72; z < 118; z += 2) {
        if ((Math.floor((x + 125) / 2.5) % 2) === 1) continue;
        this.cones.add(x + 1.25, 0.35, z, 0.35, 0.7, 0.35, '#7cc84a', z);
      }
    }
    this.reserve(-125, 70, -90, 120);
    this.fence(-126, 69, -89, 69, '#c49a6c');
    this.fence(-126, 121, -89, 121, '#c49a6c');
    // hay bales
    for (const [x, z] of [[cx + 10, cz], [cx + 12, cz + 3], [cx + 8, cz + 18], [cx + 30, cz + 20]]) {
      this.cyls.add(x, 0.7, z, 0.75, 1.4, 0.75, '#e2c25a', 0, 0, Math.PI / 2);
      this.physics.addCircle(x, z, 0.8, { tag: 'hay' });
      this.reserve(x - 1.5, z - 1.5, x + 1.5, z + 1.5);
    }
    this.crate(cx + 14, cz - 4); this.crate(cx + 34, cz); this.crate(cx + 4, cz + 26, true);
    this.loot(cx + 6, cz - 10); this.loot(cx + 30, cz + 28); this.loot(-100, 66);
  }

  buildForest() {
    const cx = -28, cz = -128;
    const r = this.rng;
    // ranger cabin
    this.building({ x: cx + 6, z: cz + 4, w: 9, d: 7, wall: '#9a6a42', roof: '#4a6b3a', trim: '#6a4428', doors: ['S'], furniture: 'house', roofType: 'gable', tier: 1 });
    this.landmark('Cabin', cx + 6, cz + 4);
    // campfire
    this.cyls.add(cx - 6, 0.15, cz + 12, 1, 0.3, 1, '#7d7d86');
    this.cones.add(cx - 6, 0.6, cz + 12, 0.5, 0.9, 0.5, '#ff8a2a');
    this.loot(cx - 4, cz + 13, 1);
    for (let i = 0; i < 140; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 34;
      const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d;
      if (shoreDist(x, z) < 12 || this.isReserved(x, z, 1.5) || Math.abs(x - riverX(z)) < 8) continue;
      if (Math.hypot(x - cx + 6, z - cz - 12) < 4) continue;
      this.tree(x, z, r() < 0.7 ? 'pine' : 'leafy', 0.9 + r() * 0.6);
      this.reserve(x - 1.2, z - 1.2, x + 1.2, z + 1.2);
    }
    for (let i = 0; i < 6; i++) {
      const x = cx - 20 + r() * 40, z = cz - 18 + r() * 34;
      if (this.isReserved(x, z, 1) || shoreDist(x, z) < 12 || Math.abs(x - riverX(z)) < 8) continue;
      // fallen log
      this.cyls.add(x, 0.35, z, 0.35, 3.2, 0.35, '#7a5232', 0, 0, Math.PI / 2);
      this.physics.addBox(x - 1.6, z - 0.4, x + 1.6, z + 0.4, { tag: 'log' });
      this.reserve(x - 2, z - 1, x + 2, z + 1);
      this.loot(x, z + 1.5);
    }
    this.crate(cx - 10, cz - 6, true); this.crate(cx + 14, cz - 12);
  }

  buildBeach() {
    const r = this.rng;
    // lifeguard tower landmark + huts along the south shore
    const bx = -10, bz = 148;
    let sd = shoreDist(bx, bz);
    let tz = bz;
    while (sd < 12 && tz > 120) { tz -= 1; sd = shoreDist(bx, tz); }
    for (const [ox, oz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      this.boxes.add(bx + ox, 1.6, tz + oz, 0.25, 3.2, 0.25, '#ffffff');
      this.physics.addCircle(bx + ox, tz + oz, 0.2, { tag: 'post' });
    }
    this.boxes.add(bx, 3.3, tz, 3, 0.3, 3, '#ff4f6a');
    this.boxes.add(bx, 4.2, tz, 2.6, 1.4, 2.6, '#ff6b6b');
    this.cones.add(bx, 5.4, tz, 2.4, 1.0, 2.4, '#ffffff', Math.PI / 4);
    this.landmark('Lifeguard', bx, tz);
    this.loot(bx, tz, 1);
    this.reserve(bx - 3, tz - 3, bx + 3, tz + 3);
    const hutColors = ['#ffd23f', '#4fd1c5', '#ff8ab5', '#8ab4ff'];
    for (let i = 0; i < 4; i++) {
      const hx = bx - 34 + i * 16 + (i >= 2 ? 10 : 0);
      let hz = tz - 2;
      while (shoreDist(hx, hz) < 14 && hz > 100) hz -= 1;
      if (Math.abs(hx - riverX(hz)) < 12) continue;
      this.building({ x: hx, z: hz, w: 6, d: 6, h: 2.6, wall: hutColors[i], roof: '#c9a46a', doors: ['S'], furniture: 'house', roofType: 'gable', loot: 1 });
    }
    // umbrellas + palms around the whole shore
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2;
      const rr = islandRadius(a) - 5 - r() * 5;
      const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
      if (this.isReserved(x, z, 2) || Math.abs(x - riverX(z)) < 9) continue;
      if (r() < 0.6) this.tree(x, z, 'palm', 0.9 + r() * 0.4);
      else {
        const c = ['#ff4f6a', '#ffd23f', '#3fb8ff', '#8c5cff'][Math.floor(r() * 4)];
        this.cyls.add(x, 1.2, z, 0.06, 2.4, 0.06, '#ffffff');
        this.cones.add(x, 2.5, z, 1.8, 0.6, 1.8, c, r() * 3);
        this.boxes.add(x + 1.2, 0.12, z, 1, 0.12, 1.9, '#ffffff');
      }
      this.reserve(x - 1.5, z - 1.5, x + 1.5, z + 1.5);
    }
    // shipwreck on the east beach
    const wa = 0.15, wr = islandRadius(wa) - 6;
    const sx = Math.cos(wa) * wr, sz = Math.sin(wa) * wr;
    this.boxes.add(sx, 0.9, sz, 3.4, 1.8, 9, '#7a5232', 0.4);
    this.boxes.add(sx, 2.8, sz, 0.3, 4, 0.3, '#5a3a22');
    this.physics.addBox(sx - 2.4, sz - 4, sx + 2.4, sz + 4, { tag: 'wreck' });
    this.reserve(sx - 4, sz - 5, sx + 4, sz + 5);
    this.landmark('Shipwreck', sx, sz);
    this.crate(sx - 3, sz - 5, true);
  }

  buildFields() {
    const cx = 62, cz = -12;
    // haystacks and a lone tree as landmark
    this.tree(cx, cz, 'leafy', 2.0);
    this.reserve(cx - 3, cz - 3, cx + 3, cz + 3);
    this.landmark('Old Oak', cx, cz);
    for (const [x, z] of [[cx - 12, cz + 8], [cx + 14, cz - 6], [cx + 4, cz + 16], [cx - 16, cz - 12]]) {
      this.cyls.add(x, 0.7, z, 0.75, 1.4, 0.75, '#e2c25a', 0, 0, Math.PI / 2);
      this.physics.addCircle(x, z, 0.8, { tag: 'hay' });
      this.reserve(x - 1.5, z - 1.5, x + 1.5, z + 1.5);
      this.loot(x + 2, z);
    }
    this.fence(cx - 22, cz - 22, cx + 6, cz - 22, '#c49a6c');
    this.fence(cx - 22, cz + 22, cx + 22, cz + 22, '#c49a6c');
    this.building({ x: cx + 18, z: cz - 14, w: 7, d: 6, wall: '#e8d5c0', roof: '#7a5a3a', doors: ['S'], furniture: 'house', roofType: 'gable', loot: 2 });
    this.crate(cx + 6, cz + 4);
  }

  buildLighthouse() {
    const a = Math.PI;
    let r = islandRadius(a) - 10;
    const x = Math.cos(a) * r, z = Math.sin(a) * r + 8;
    for (let y = 0; y < 12; y += 2) this.cyls.add(x, y + 1, z, 1.8 - y * 0.05, 2, 1.8 - y * 0.05, (y / 2) % 2 ? '#e04a3f' : '#ffffff');
    this.cyls.add(x, 12.6, z, 1.4, 1.2, 1.4, '#fff1b0');
    this.cones.add(x, 13.8, z, 1.6, 1.2, 1.6, '#e04a3f');
    this.physics.addCircle(x, z, 1.9, { tag: 'lighthouse' });
    this.reserve(x - 3, z - 3, x + 3, z + 3);
    const beam = new THREE.Mesh(new THREE.ConeGeometry(2.5, 26, 10, 1, true), new THREE.MeshBasicMaterial({ color: '#fff6b0', transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide }));
    beam.rotation.z = Math.PI / 2;
    beam.position.x = 13;
    const pivot = new THREE.Group();
    pivot.position.set(x, 12.6, z);
    pivot.add(beam);
    this.group.add(pivot);
    this.animated.push({ obj: pivot, fn: (o, t) => { o.rotation.y = t * 0.8; } });
    this.landmark('Lighthouse', x, z);
    this.building({ x: x + 8, z: z + 6, w: 7, d: 6, wall: '#ffffff', roof: '#3d5a9e', doors: ['E'], furniture: 'house', roofType: 'gable', loot: 2, tier: 1 });
    this.crate(x + 4, z - 5, true);
  }

  // ---------------------------------------------------------------- scatter
  scatter() {
    const r = this.rng;
    let trees = 0, rocks = 0, bushes = 0;
    for (let i = 0; i < 2600 && (trees < 420 || rocks < 140); i++) {
      const x = (r() * 2 - 1) * 175, z = (r() * 2 - 1) * 175;
      const sd = shoreDist(x, z);
      if (sd < 13) continue;
      if (Math.abs(x - riverX(z)) < RIVER_HALF + 3) continue;
      if (this.isReserved(x, z, 2)) continue;
      // keep POI centres open
      let nearPoi = false;
      for (const p of POIS) if (Math.hypot(x - p.x, z - p.z) < 18) nearPoi = true;
      if (nearPoi) continue;
      const roll = r();
      if (roll < 0.62 && trees < 420) {
        this.tree(x, z, r() < 0.3 ? 'pine' : 'leafy', 0.8 + r() * 0.6);
        trees++;
      } else if (roll < 0.82 && rocks < 140) {
        this.rock(x, z, 0.6 + r() * 0.9);
        rocks++;
      } else {
        this.bushes.add(x, 0.4, z, 0.9 + r() * 0.5, 0.7, 0.9 + r() * 0.5, ['#5cbf4a', '#4caf50', '#6fcf5a'][Math.floor(r() * 3)], r() * 6);
        bushes++;
        if (r() < 0.45) this.loot(x + 1.2, z);
      }
      this.reserve(x - 1.3, z - 1.3, x + 1.3, z + 1.3);
    }
    // grass tufts: pure decoration, no collision
    for (let i = 0; i < 1400; i++) {
      const x = (r() * 2 - 1) * 170, z = (r() * 2 - 1) * 170;
      if (shoreDist(x, z) < 11 || Math.abs(x - riverX(z)) < RIVER_HALF + 2 || this.isReserved(x, z, 0.3)) continue;
      const c = ['#4f9a3a', '#5aab42', '#6bbb4a', '#3f8a35'][Math.floor(r() * 4)];
      const s2 = 0.5 + r() * 0.5;
      for (let k = 0; k < 3; k++) this.cones.add(x + (r() - 0.5) * 0.6, 0.25 * s2, z + (r() - 0.5) * 0.6, 0.12 * s2, 0.6 * s2, 0.12 * s2, c, r() * 6, (r() - 0.5) * 0.5, (r() - 0.5) * 0.5);
    }
    // river reeds and extra crates in the wild
    for (let z = -150; z < 150; z += 4) {
      const x = riverX(z) + (r() < 0.5 ? -1 : 1) * (RIVER_HALF + 1.2);
      if (shoreDist(x, z) < 8 || this.isReserved(x, z)) continue;
      this.cones.add(x, 0.5, z, 0.25, 1.0, 0.25, '#6a9a3a', r());
    }
    for (let i = 0; i < 90; i++) {
      const x = (r() * 2 - 1) * 150, z = (r() * 2 - 1) * 150;
      if (shoreDist(x, z) < 15 || this.isReserved(x, z, 1) || Math.abs(x - riverX(z)) < 9) continue;
      if (r() < 0.5) this.crate(x, z); else this.loot(x, z);
      this.reserve(x - 1, z - 1, x + 1, z + 1);
    }
  }

  // ---------------------------------------------------------------- crates
  buildCrateMeshes() {
    const tex = (base, line) => {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d');
      g.fillStyle = base; g.fillRect(0, 0, 64, 64);
      g.strokeStyle = line; g.lineWidth = 6; g.strokeRect(3, 3, 58, 58);
      g.beginPath(); g.moveTo(6, 6); g.lineTo(58, 58); g.stroke();
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    const n = this.crateSpots.length;
    this.crateMesh = new THREE.InstancedMesh(geo.box, new THREE.MeshStandardMaterial({ map: tex('#c8924f', '#7a4f2a'), roughness: 0.8 }), n);
    this.goldMesh = new THREE.InstancedMesh(geo.box, new THREE.MeshStandardMaterial({ map: tex('#ffcf3f', '#b07a10'), roughness: 0.4, metalness: 0.3, emissive: '#5a3a00', emissiveIntensity: 0.4 }), n);
    for (const m of [this.crateMesh, this.goldMesh]) { m.castShadow = true; m.receiveShadow = true; m.count = 0; this.group.add(m); }
  }

  // Called at the start of each match: recreate every breakable crate.
  resetCrates() {
    if (this.crates) for (const c of this.crates) this.physics.remove(c.collider);
    this.physics.compact();
    this.crates = [];
    let ni = 0, gi = 0;
    const m = new THREE.Matrix4();
    for (const s of this.crateSpots) {
      const size = s.gold ? 1.3 : 1.4;
      const mesh = s.gold ? this.goldMesh : this.crateMesh;
      const idx = s.gold ? gi++ : ni++;
      m.makeScale(size, size, size).setPosition(s.x, size / 2, s.z);
      mesh.setMatrixAt(idx, m);
      const crate = { x: s.x, z: s.z, gold: s.gold, hp: s.gold ? 90 : 55, mesh, idx, size, alive: true, shake: 0 };
      crate.collider = this.physics.addBox(s.x - size / 2, s.z - size / 2, s.x + size / 2, s.z + size / 2, { tag: 'crate', data: crate });
      this.crates.push(crate);
    }
    this.crateMesh.count = ni; this.goldMesh.count = gi;
    this.crateMesh.instanceMatrix.needsUpdate = true;
    this.goldMesh.instanceMatrix.needsUpdate = true;
  }

  setCrateMatrix(c, scale, ox = 0, oz = 0) {
    const m = new THREE.Matrix4().makeScale(scale, scale, scale).setPosition(c.x + ox, scale / 2, c.z + oz);
    c.mesh.setMatrixAt(c.idx, m);
    c.mesh.instanceMatrix.needsUpdate = true;
  }

  // Fade roofs of the building the camera target is inside.
  updateRoofs(px, pz, dt) {
    for (const r of this.roofs) {
      const [x0, z0, x1, z1] = r.rect;
      const inside = px > x0 - 0.3 && px < x1 + 0.3 && pz > z0 - 0.3 && pz < z1 + 0.3;
      const target = inside ? 0.0 : 1;
      if (Math.abs(r.fade - target) < 0.001) continue;
      r.fade += (target - r.fade) * Math.min(1, dt * 8);
      if (Math.abs(r.fade - target) < 0.01) r.fade = target;
      for (const m of r.mats) {
        // Opaque while fully shown, so roofs occlude in the opaque pass (the
        // player silhouette relies on that); transparent only while fading.
        m.transparent = r.fade < 0.99;
        m.opacity = r.fade; m.depthWrite = r.fade > 0.95;
      }
      r.roof.visible = r.fade > 0.02;
    }
  }
}
