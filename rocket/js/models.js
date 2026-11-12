// Procedural low-poly meshes: rocket parts and the player's hands.
import * as THREE from '../vendor/three.module.min.js';

const matCache = new Map();
export function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.25, ...opts }));
  return matCache.get(key);
}

let stripeTex = null;
function stripes() {
  if (stripeTex) return stripeTex;
  const c = document.createElement('canvas'); c.width = 64; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#facc15'; g.fillRect(0, 0, 64, 64);
  g.fillStyle = '#111'; for (let i = -64; i < 128; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 8, 0); g.lineTo(i + 72, 64); g.lineTo(i + 64, 64); g.fill(); }
  stripeTex = new THREE.CanvasTexture(c); stripeTex.wrapS = stripeTex.wrapT = THREE.RepeatWrapping; stripeTex.repeat.set(6, 1);
  stripeTex.colorSpace = THREE.SRGBColorSpace;
  return stripeTex;
}

const SEG = 28;
const V2 = (x, y) => new THREE.Vector2(x, y);
const lathe = (pts, seg = SEG) => new THREE.LatheGeometry(pts.map(([x, y]) => V2(Math.max(0.001, x), y)), seg);

// Painted skin for tanks and boosters: weld seams, stringers, stencilled name and a stripe.
const skinCache = new Map();
function skinTex(def, label, stripe = '#1d4ed8') {
  const key = def.id + label;
  if (skinCache.has(key)) return skinCache.get(key);
  const W = 512, H = 512, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const col = '#' + def.color.toString(16).padStart(6, '0');
  g.fillStyle = col; g.fillRect(0, 0, W, H);
  // subtle vertical shading + noise so it reads as painted metal
  for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.035})`; g.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 3, 1 + Math.random() * 6); }
  g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 2;
  for (let x = 0; x < W; x += W / 12) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  g.strokeStyle = 'rgba(0,0,0,0.32)'; g.lineWidth = 3;
  for (const y of [H * 0.02, H * 0.34, H * 0.66, H * 0.98]) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  // rivet rows along the seams
  g.fillStyle = 'rgba(0,0,0,0.28)';
  for (const y of [H * 0.05, H * 0.95]) for (let x = 4; x < W; x += 10) g.fillRect(x, y, 2, 2);
  // stripe and stencil
  g.fillStyle = stripe; g.fillRect(0, H * 0.43, W, H * 0.06);
  const dark = def.color === 0x1f2937;
  g.fillStyle = dark ? '#e5e7eb' : '#1f2328';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  // label twice around the tank so one copy always faces you
  for (const u of [0.08, 0.58]) {
    g.font = `800 ${H * 0.1}px "Barlow Condensed", "Arial Narrow", sans-serif`; g.fillText(label, W * u, H * 0.57);
    g.font = `600 ${H * 0.032}px "JetBrains Mono", monospace`; g.fillText('PADWORKS', W * u, H * 0.65);
  }
  g.fillText('NO STEP', W * 0.33, H * 0.2);
  // small flag block
  for (const u of [0.24, 0.74]) { g.fillStyle = '#ff5a1f'; g.fillRect(W * u, H * 0.54, W * 0.03, H * 0.06); g.fillStyle = '#e9e4d6'; g.fillRect(W * (u + 0.03), H * 0.54, W * 0.03, H * 0.06); g.fillStyle = '#16181a'; g.fillRect(W * (u + 0.06), H * 0.54, W * 0.03, H * 0.06); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  skinCache.set(key, t); return t;
}
let solarTex = null;
function solar() {
  if (solarTex) return solarTex;
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  g.fillStyle = '#0f2a5c'; g.fillRect(0, 0, 128, 128);
  for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) { g.fillStyle = (x + y) % 2 ? '#1e3f86' : '#18357a'; g.fillRect(x * 16 + 1, y * 16 + 1, 14, 14); }
  g.strokeStyle = '#9ca3af'; g.lineWidth = 2; g.strokeRect(1, 1, 126, 126);
  solarTex = new THREE.CanvasTexture(c); solarTex.colorSpace = THREE.SRGBColorSpace; return solarTex;
}

// Builds a mesh group for one part. Origin at the bottom centre, +y up, height = def.h.
export function partMesh(def, cond = 1) {
  const g = new THREE.Group();
  const { h, r } = def;
  const worn = cond < 0.6;
  const wear = worn ? { roughness: 0.92, metalness: 0.05 } : {};
  const base = mat(def.color, { roughness: 0.45, metalness: 0.2, ...wear });
  const dark = mat(0x2b2f36, { roughness: 0.6, metalness: 0.4 });
  const metal = mat(0xb8bcc4, { metalness: 0.9, roughness: 0.28 });
  const steel = mat(0x7a7f87, { metalness: 0.85, roughness: 0.35 });
  const add = (geo, m, y = 0, x = 0, z = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  const ringAt = (y, rr, m = metal, t = 0.035) => { const o = add(new THREE.TorusGeometry(rr, t, 6, SEG), m, y); o.rotation.x = Math.PI / 2; return o; };
  const skinMat = (label, stripe) => new THREE.MeshStandardMaterial({ map: skinTex(def, label, stripe), roughness: worn ? 0.9 : 0.42, metalness: 0.2, color: worn ? 0xb9b4a8 : 0xffffff });

  switch (def.shape) {
    case 'probe': {
      add(lathe([[r, 0], [r, h * 0.1], [r * 0.86, h * 0.62], [r * 0.5, h * 0.78], [r * 0.32, h * 0.9], [0, h * 0.9]], 8), base);
      add(new THREE.CylinderGeometry(r * 0.88, r * 0.95, h * 0.18, 8), mat(0xd4a017, { metalness: 0.9, roughness: 0.35 }), h * 0.38);
      add(new THREE.CylinderGeometry(0.015, 0.015, h * 0.55, 6), metal, h * 1.12, r * 0.15);
      const dish = add(new THREE.SphereGeometry(r * 0.22, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.2), metal, h * 0.92, -r * 0.1); dish.material = mat(0xe5e7eb, { side: THREE.DoubleSide, metalness: 0.6, roughness: 0.3 });
      add(new THREE.SphereGeometry(r * 0.07, 8, 6), mat(0x22d3ee, { emissive: 0x22d3ee, emissiveIntensity: 2 }), h * 0.55, 0, r * 0.84);
      break;
    }
    case 'capsule': {
      add(lathe([[r, 0], [r, h * 0.05], [r * 0.95, h * 0.1], [r * 0.42, h * 0.84], [r * 0.34, h * 0.88], [r * 0.34, h], [0, h]]), base);
      add(new THREE.CylinderGeometry(r * 1.01, r * 0.98, h * 0.07, SEG), mat(0x3f2a1d, { roughness: 0.95 }), h * 0.035);
      ringAt(h * 0.88, r * 0.36, metal, 0.03); ringAt(h, r * 0.3, metal, 0.04);
      for (const a of [-0.45, 0.45]) {
        const yy = h * 0.5, rr = r * (0.95 - (0.53 * (yy / h - 0.1)) / 0.74) + 0.01;
        const w = add(new THREE.CircleGeometry(r * 0.12, 16), mat(0x0b1d2e, { metalness: 0.95, roughness: 0.05 }), yy, Math.sin(a) * rr, Math.cos(a) * rr);
        w.lookAt(Math.sin(a) * rr * 3, yy + h * 0.25, Math.cos(a) * rr * 3);
      }
      for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + 0.6; add(new THREE.BoxGeometry(0.08, 0.08, 0.05), dark, h * 0.75, Math.sin(a) * r * 0.5, Math.cos(a) * r * 0.5).lookAt(0, h * 0.75, 0); }
      break;
    }
    case 'cone': {
      const pts = []; for (let i = 0; i <= 14; i++) { const t = i / 14; pts.push([r * Math.pow(1 - t, 0.55) * (1 - 0.04 * t), h * t]); }
      add(lathe(pts), base);
      ringAt(0.02, r * 1.0, metal, 0.03);
      add(new THREE.SphereGeometry(r * 0.06, 8, 6), metal, h * 0.99);
      break;
    }
    case 'tank': {
      const short = def.name.split(' ')[0];
      add(new THREE.CylinderGeometry(r, r, h, SEG, 1, true), skinMat(short, def.color === 0x1f2937 ? '#f97316' : '#1d4ed8'), h / 2);
      add(new THREE.CircleGeometry(r, SEG), steel, h - 0.001).rotation.x = -Math.PI / 2;
      add(new THREE.CircleGeometry(r, SEG), steel, 0.001).rotation.x = Math.PI / 2;
      for (const y of [0.03, h - 0.03]) add(new THREE.CylinderGeometry(r * 1.025, r * 1.025, 0.06, SEG), steel, y);
      // fuel feed line running down the side
      add(new THREE.CylinderGeometry(0.035, 0.035, h * 0.9, 6), metal, h / 2, r * 1.03, 0);
      break;
    }
    case 'engine': {
      add(new THREE.CylinderGeometry(r * 0.62, r * 0.42, h * 0.2, 16), dark, h * 0.9);            // thrust frame
      ringAt(h * 0.99, r * 0.6, steel, 0.03);
      add(new THREE.CylinderGeometry(r * 0.3, r * 0.3, h * 0.25, 14), steel, h * 0.68);           // combustion chamber
      add(new THREE.CylinderGeometry(r * 0.17, r * 0.17, h * 0.22, 10), metal, h * 0.75, r * 0.5, 0); // turbopump
      add(new THREE.CylinderGeometry(r * 0.12, r * 0.12, h * 0.16, 10), metal, h * 0.72, -r * 0.42, r * 0.2);
      const pipe = add(new THREE.TorusGeometry(r * 0.32, 0.025, 6, 12, Math.PI), metal, h * 0.62, r * 0.18, 0); pipe.rotation.set(0, 0, Math.PI / 2);
      const bell = []; for (let i = 0; i <= 12; i++) { const t = i / 12; bell.push([r * (0.28 + 0.68 * Math.pow(t, 0.62)), h * 0.56 * (1 - t)]); }
      add(lathe(bell), mat(0x8a8f98, { metalness: 0.88, roughness: 0.3, side: THREE.DoubleSide }));
      ringAt(h * 0.02, r * 0.955, steel, 0.025); ringAt(h * 0.2, r * 0.82, steel, 0.02);
      break;
    }
    case 'vacengine': {
      add(new THREE.CylinderGeometry(r * 0.6, r * 0.45, h * 0.18, 14), dark, h * 0.91);
      add(new THREE.CylinderGeometry(r * 0.2, r * 0.2, h * 0.16, 12), steel, h * 0.76);
      add(new THREE.CylinderGeometry(r * 0.12, r * 0.12, h * 0.14, 10), metal, h * 0.8, r * 0.35, 0);
      const up = [], lo = [];
      for (let i = 0; i <= 8; i++) { const t = i / 8; up.push([r * (0.18 + 0.4 * Math.pow(t, 0.6)), h * (0.68 - 0.3 * t)]); }
      for (let i = 0; i <= 10; i++) { const t = i / 10; lo.push([r * (0.58 + 0.42 * Math.pow(t, 0.7)), h * 0.38 * (1 - t)]); }
      add(lathe(up.reverse().reverse()), mat(0x9a6b3a, { metalness: 0.9, roughness: 0.3, side: THREE.DoubleSide }));
      add(lathe(lo), mat(0x3b3f46, { metalness: 0.7, roughness: 0.45, side: THREE.DoubleSide }));
      ringAt(h * 0.38, r * 0.59, metal, 0.025);
      break;
    }
    case 'srb': {
      add(new THREE.CylinderGeometry(r, r, h * 0.8, SEG, 1, true), skinMat(def.name.split(' ')[0].toUpperCase(), '#dc2626'), h * 0.5);
      const nose = []; for (let i = 0; i <= 10; i++) { const t = i / 10; nose.push([r * Math.pow(1 - t, 0.5), h * (0.9 + 0.1 * t)]); }
      add(lathe(nose), base);
      for (const y of [h * 0.1, h * 0.9]) add(new THREE.CylinderGeometry(r * 1.03, r * 1.03, h * 0.025, SEG), steel, y);
      const bell = []; for (let i = 0; i <= 8; i++) { const t = i / 8; bell.push([r * (0.35 + 0.45 * Math.pow(t, 0.7)), h * 0.1 * (1 - t)]); }
      add(lathe(bell), mat(0x3f3f46, { metalness: 0.6, roughness: 0.5, side: THREE.DoubleSide }));
      break;
    }
    case 'decoupler': {
      const m = new THREE.MeshStandardMaterial({ map: stripes(), roughness: 0.55 });
      add(new THREE.CylinderGeometry(r, r, h * 0.6, SEG), m, h / 2);
      for (const y of [h * 0.1, h * 0.9]) add(new THREE.CylinderGeometry(r * 1.02, r * 1.02, h * 0.2, SEG), steel, y);
      break;
    }
    case 'ring': {
      add(new THREE.CylinderGeometry(r, r, h, SEG), base, h / 2);
      for (const y of [h * 0.15, h * 0.85]) ringAt(y, r * 1.0, metal, 0.03);
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; add(new THREE.CylinderGeometry(0.025, 0.025, 0.04, 6), metal, h / 2, Math.cos(a) * r, Math.sin(a) * r).rotation.z = Math.PI / 2; }
      break;
    }
    case 'battery': {
      add(new THREE.CylinderGeometry(r * 0.92, r * 0.92, h, SEG), dark, h / 2);
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const b2 = add(new THREE.BoxGeometry(0.22, h * 0.82, 0.1), base, h / 2, Math.cos(a) * r * 0.92, Math.sin(a) * r * 0.92); b2.rotation.y = -a + Math.PI / 2; }
      for (const y of [0.02, h - 0.02]) add(new THREE.CylinderGeometry(r, r, 0.04, SEG), steel, y);
      break;
    }
    case 'box': {
      add(new THREE.CylinderGeometry(r * 0.85, r * 0.85, h, 12), dark, h / 2);
      add(new THREE.BoxGeometry(r * 0.95, h * 0.72, r * 0.55), base, h / 2, 0, r * 0.62);
      add(new THREE.BoxGeometry(r * 0.3, h * 0.08, 0.04), mat(0x111111), h * 0.75, 0, r * 0.9);
      add(new THREE.BoxGeometry(0.06, h * 0.3, 0.02), mat(0xffffff), h * 0.45, 0, r * 0.9 + 0.005);
      add(new THREE.BoxGeometry(h * 0.3, 0.06, 0.02), mat(0xffffff), h * 0.45, 0, r * 0.9 + 0.005);
      break;
    }
    case 'chute': {
      add(lathe([[r, 0], [r, h * 0.55], [r * 0.92, h * 0.6], [0, h * 0.6]]), dark);
      add(new THREE.SphereGeometry(r * 0.96, SEG, 10, 0, Math.PI * 2, 0, Math.PI / 2), base, h * 0.58).scale.y = 0.75;
      for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2; add(new THREE.BoxGeometry(0.04, h * 0.6, 0.03), mat(0xf5b301), h * 0.3, Math.cos(a) * r * 1.01, Math.sin(a) * r * 1.01).rotation.y = -a; }
      ringAt(0.02, r, metal, 0.03);
      break;
    }
    case 'legs': {
      add(new THREE.CylinderGeometry(r * 0.75, r * 0.75, h, 16), dark, h / 2);
      ringAt(h * 0.95, r * 0.76, metal, 0.03);
      for (let i = 0; i < 4; i++) {
        const a = i / 4 * Math.PI * 2 + Math.PI / 4;
        const leg = new THREE.Group(); leg.position.set(Math.cos(a) * r * 0.75, h * 0.9, Math.sin(a) * r * 0.75); leg.rotation.y = -a;
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, h * 0.8, 8), base); upper.position.set(r * 0.16, -h * 0.32, 0); upper.rotation.z = 0.45; leg.add(upper);
        const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, h * 0.7, 8), metal); lower.position.set(r * 0.4, -h * 0.82, 0); lower.rotation.z = 0.45; leg.add(lower);
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.05, 12), steel); foot.position.set(r * 0.56, -h * 1.12, 0); leg.add(foot);
        leg.traverse(o => { if (o.isMesh) o.castShadow = true; });
        g.add(leg);
      }
      break;
    }
    case 'shield': {
      add(lathe([[0, 0], [r * 0.8, h * 0.08], [r, h * 0.3], [r, h * 0.7], [r * 0.9, h], [0, h]]), mat(0x4a3424, { roughness: 0.95, metalness: 0 }));
      ringAt(h * 0.7, r * 0.99, steel, 0.03);
      break;
    }
    case 'fins': {
      add(new THREE.CylinderGeometry(r * 0.55, r * 0.55, h, 16), mat(0xe5e7eb, { roughness: 0.45 }), h / 2);
      const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(r * 0.75, -h * 0.15); sh.lineTo(r * 0.75, h * 0.35); sh.lineTo(0, h * 0.95); sh.lineTo(0, 0);
      const fg = new THREE.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 1 });
      for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2; const f = add(fg, base, 0); f.position.set(Math.cos(a) * r * 0.52, h * 0.02, Math.sin(a) * r * 0.52); f.rotation.y = -a; }
      break;
    }
    case 'gridfins': {
      add(new THREE.CylinderGeometry(r * 0.6, r * 0.6, h, 16), dark, h / 2);
      for (let i = 0; i < 4; i++) {
        const a = i / 4 * Math.PI * 2, fin = new THREE.Group();
        fin.position.set(Math.cos(a) * r * 0.85, h / 2, Math.sin(a) * r * 0.85); fin.rotation.y = -a + Math.PI / 2;
        const W = 0.5, H2 = h * 0.85;
        for (const [w, hh, x, y] of [[W, 0.03, 0, H2 / 2], [W, 0.03, 0, -H2 / 2], [0.03, H2, W / 2, 0], [0.03, H2, -W / 2, 0]]) { const m2 = new THREE.Mesh(new THREE.BoxGeometry(w, hh, 0.1), base); m2.position.set(x, y, 0); fin.add(m2); }
        for (let k = 1; k < 4; k++) { const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.012, H2, 0.09), base); b2.position.x = -W / 2 + k * W / 4; b2.rotation.z = 0.6; fin.add(b2); const b3 = b2.clone(); b3.rotation.z = -0.6; fin.add(b3); }
        g.add(fin);
      }
      break;
    }
    case 'pod': {
      add(new THREE.CylinderGeometry(r, r, h, 16), mat(0xd4d4d8, { roughness: 0.4, metalness: 0.4 }), h / 2);
      add(new THREE.BoxGeometry(r * 0.7, h * 0.6, 0.08), base, h / 2, 0, r * 0.98);
      add(new THREE.CylinderGeometry(0.012, 0.012, r * 0.9, 6), metal, h * 0.7, r * 1.3, 0).rotation.z = Math.PI / 2;
      add(new THREE.SphereGeometry(r * 0.1, 10, 8), mat(0xffffff, { emissive: def.color, emissiveIntensity: 1.2 }), h * 0.7, r * 1.75, 0);
      for (const y of [0.02, h - 0.02]) add(new THREE.CylinderGeometry(r * 1.02, r * 1.02, 0.04, 16), steel, y);
      break;
    }
    case 'sat': {
      add(new THREE.CylinderGeometry(r * 0.8, r * 0.8, h * 0.85, 6), mat(0xd4a017, { metalness: 0.95, roughness: 0.32 }), h / 2);
      add(new THREE.CylinderGeometry(r, r, h * 0.06, 6), steel, h * 0.04); add(new THREE.CylinderGeometry(r, r, h * 0.06, 6), steel, h * 0.96);
      const pm = new THREE.MeshStandardMaterial({ map: solar(), metalness: 0.5, roughness: 0.25 });
      for (const sgn of [-1, 1]) { add(new THREE.BoxGeometry(r * 1.3, h * 0.6, 0.03), pm, h / 2, sgn * r * 1.5, 0); add(new THREE.CylinderGeometry(0.02, 0.02, r * 0.4, 6), metal, h / 2, sgn * r * 0.85, 0).rotation.z = Math.PI / 2; }
      const dish = add(new THREE.SphereGeometry(r * 0.35, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3), mat(0xf3f4f6, { side: THREE.DoubleSide, roughness: 0.3 }), h * 0.6, 0, r * 0.95); dish.rotation.x = -Math.PI / 2;
      break;
    }
    default: add(new THREE.CylinderGeometry(r, r, h, 12), base, h / 2);
  }
  g.userData.def = def;
  return g;
}

// Rocket assembly: parts top->bottom, stacked from y=0 upward. Returns group with userData.parts [{mesh, y}].
export function rocketMesh(stack) {
  const g = new THREE.Group();
  let y = 0; const list = [];
  for (let i = stack.length - 1; i >= 0; i--) {
    const s = stack[i];
    const m = partMesh(s.def || s, s.cond ?? 1);
    m.position.y = y; g.add(m); list.unshift({ mesh: m, y, uid: s.uid });
    y += (s.def || s).h;
  }
  g.userData.parts = list; g.userData.height = y;
  return g;
}

// ---------- hands ----------
const skin = () => mat(0xe0ac8a, { roughness: 0.75, metalness: 0 });
const glove = () => mat(0x334155, { roughness: 0.8, metalness: 0.05 });
const sleeve = () => mat(0xea580c, { roughness: 0.85, metalness: 0 });

function finger(len, w) {
  const root = new THREE.Group();
  const s1 = new THREE.Mesh(new THREE.BoxGeometry(w, w, len * 0.55), glove()); s1.position.z = -len * 0.275;
  const j = new THREE.Group(); j.position.z = -len * 0.55;
  const s2 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, w * 0.92, len * 0.45), glove()); s2.position.z = -len * 0.225;
  root.add(s1); root.add(j); j.add(s2);
  root.userData.j = j;
  return root;
}

export function makeHand(side) {
  // side = 1 right, -1 left
  const hand = new THREE.Group();
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.03, 0.095), glove());
  hand.add(palm);
  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.2, 10), sleeve());
  cuff.rotation.x = Math.PI / 2; cuff.position.set(0, -0.005, 0.14); hand.add(cuff);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.02, 10), mat(0x22d3ee, { emissive: 0x0891b2, emissiveIntensity: 1 }));
  band.rotation.x = Math.PI / 2; band.position.set(0, -0.005, 0.05); hand.add(band);
  const fingers = [];
  for (let i = 0; i < 4; i++) {
    const f = finger(0.075 - Math.abs(i - 1.5) * 0.008, 0.018);
    f.position.set((i - 1.5) * 0.021, 0.002, -0.047);
    hand.add(f); fingers.push(f);
  }
  const thumb = finger(0.06, 0.02);
  thumb.position.set(side * -0.045, -0.004, -0.01); thumb.rotation.y = side * 0.9; thumb.rotation.z = side * -0.3;
  hand.add(thumb);
  hand.userData = { fingers, thumb, band, side };
  return hand;
}

// curl 0..1 (open..fist)
export function poseHand(hand, curl, point = false) {
  const { fingers, thumb } = hand.userData;
  fingers.forEach((f, i) => {
    const c = point && i === 0 ? 0.05 : curl;
    f.rotation.x = -c * 1.3; f.userData.j.rotation.x = -c * 1.5;
  });
  thumb.rotation.x = -curl * 0.8;
}

// ---------- particles ----------
let dotTex = null;
export function softDot() {
  if (dotTex) return dotTex;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.4, 'rgba(255,255,255,0.5)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  dotTex = new THREE.CanvasTexture(c); return dotTex;
}

// Simple CPU particle system on THREE.Points with per-particle colour/size/life.
export class Particles {
  constructor(max, { additive = true, size = 1 } = {}) {
    this.max = max; this.n = 0;
    this.pos = new Float32Array(max * 3); this.col = new Float32Array(max * 3); this.size = new Float32Array(max);
    this.vel = new Float32Array(max * 3); this.life = new Float32Array(max); this.maxLife = new Float32Array(max);
    this.c0 = new Float32Array(max * 3); this.c1 = new Float32Array(max * 3); this.s0 = new Float32Array(max); this.s1 = new Float32Array(max);
    this.drag = new Float32Array(max);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(this.size, 1));
    const m = new THREE.ShaderMaterial({
      uniforms: { map: { value: softDot() }, scale: { value: size } },
      vertexShader: `attribute float size; varying vec3 vC; uniform float scale;
        #include <common>
        #include <logdepthbuf_pars_vertex>
        void main(){ vC=color; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=size*scale*300.0/max(0.1,-mv.z); gl_Position=projectionMatrix*mv;
        #include <logdepthbuf_vertex>
        }`,
      fragmentShader: `uniform sampler2D map; varying vec3 vC;
        #include <logdepthbuf_pars_fragment>
        void main(){
        #include <logdepthbuf_fragment>
        vec4 t=texture2D(map,gl_PointCoord); if(t.a<0.02) discard; gl_FragColor=vec4(vC*t.a, t.a);}`,
      vertexColors: true, transparent: true, depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    if (!additive) m.fragmentShader = m.fragmentShader.replace('vec4(vC*t.a, t.a)', 'vec4(vC, t.a*0.55)');
    this.points = new THREE.Points(geo, m); this.points.frustumCulled = false;
  }
  emit(p, v, life, c0, c1, s0, s1, drag = 0) {
    let i = this.n < this.max ? this.n++ : Math.floor(Math.random() * this.max);
    this.pos.set(p, i * 3); this.vel.set(v, i * 3); this.life[i] = life; this.maxLife[i] = life;
    this.c0.set(c0, i * 3); this.c1.set(c1, i * 3); this.s0[i] = s0; this.s1[i] = s1; this.drag[i] = drag;
  }
  update(dt, shift) {
    for (let i = 0; i < this.n; i++) {
      this.life[i] -= dt;
      if (this.life[i] <= 0) {
        const l = --this.n;
        if (i !== l) {
          for (const a of [this.pos, this.vel, this.c0, this.c1]) a.copyWithin(i * 3, l * 3, l * 3 + 3);
          for (const a of [this.life, this.maxLife, this.s0, this.s1, this.drag]) a[i] = a[l];
        }
        i--; continue;
      }
      const k = 1 - this.life[i] / this.maxLife[i];
      const d = Math.exp(-this.drag[i] * dt);
      for (let a = 0; a < 3; a++) {
        this.vel[i * 3 + a] *= d;
        this.pos[i * 3 + a] += this.vel[i * 3 + a] * dt + (shift ? shift[a] : 0);
        this.col[i * 3 + a] = this.c0[i * 3 + a] + (this.c1[i * 3 + a] - this.c0[i * 3 + a]) * k;
      }
      this.size[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * k;
      const fade = Math.min(1, this.life[i] * 3);
      for (let a = 0; a < 3; a++) this.col[i * 3 + a] *= fade;
    }
    const g = this.points.geometry; g.setDrawRange(0, this.n);
    g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true; g.attributes.size.needsUpdate = true;
  }
}
