/* Skins: pure data on top of BaseCharacter.

   A skin may recolour or texture the material slots, choose clothing layers
   (sleeves, long trousers, socks, mask) and mount accessories on named
   attachment points. It cannot change the body, so every skin keeps the
   exact same proportions and plays the exact same animations.

   To add a skin: copy one of the entries below, give it a new id, and add it
   to SKINS. Textures are drawn at runtime from canvases; nothing here is
   copied from any existing game. */

import * as THREE from '../vendor/three.module.min.js';
import { DIM } from './character.js';
import { blob, mat, mesh } from './shapes.js';

/* ───────────── procedural textures ───────────── */

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

// Seeded so the camo/flower layout is the same every load.
function rng(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

const tex = {};
const lazy = (k, make) => () => (tex[k] ??= make());

const camo = lazy('camo', () => canvasTexture(256, 256, (g, w, h) => {
  const r = rng(7);
  g.fillStyle = '#5d6b3a'; g.fillRect(0, 0, w, h);
  for (const col of ['#7a8650', '#3f4a27', '#8a7a4e', '#2f3820']) {
    g.fillStyle = col;
    for (let i = 0; i < 16; i++) {
      const x = r() * w, y = r() * h, rad = 10 + r() * 22;
      g.beginPath();
      for (let a = 0; a < 7; a++) {
        const t = (a / 7) * Math.PI * 2, rr = rad * (0.6 + r() * 0.6);
        g.lineTo(x + Math.cos(t) * rr * 1.4, y + Math.sin(t) * rr);
      }
      g.fill();
      // wrap so the texture tiles without a seam
      g.save(); g.translate(x > w / 2 ? -w : w, 0); g.fill(); g.restore();
    }
  }
}));

/* Jersey: on SphereGeometry UVs the front of the torso is u = 0.25 and the
   back u = 0.75, so the number is drawn at both. */
const jersey = lazy('jersey', () => canvasTexture(512, 256, (g, w, h) => {
  g.fillStyle = '#d8323a'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#ffffff';
  g.fillRect(0, h * 0.09, w, 6);
  g.font = '900 92px "Lilita One", Impact, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = 8; g.strokeStyle = '#8f1c22';
  for (const u of [0.25, 0.75]) {
    g.strokeText('23', w * u, h * 0.55);
    g.fillText('23', w * u, h * 0.55);
  }
}));

const hawaiian = lazy('hawaiian', () => canvasTexture(256, 256, (g, w, h) => {
  const r = rng(11);
  g.fillStyle = '#2f86d9'; g.fillRect(0, 0, w, h);
  const flower = (x, y, s, petal, core) => {
    g.fillStyle = petal;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      g.beginPath();
      g.ellipse(x + Math.cos(a) * s * 0.55, y + Math.sin(a) * s * 0.55, s * 0.5, s * 0.32, a, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = core;
    g.beginPath(); g.arc(x, y, s * 0.22, 0, Math.PI * 2); g.fill();
  };
  for (let i = 0; i < 14; i++) {
    g.fillStyle = '#1e6a3b';
    const x = r() * w, y = r() * h;
    g.beginPath(); g.ellipse(x, y, 16, 6, r() * 3, 0, Math.PI * 2); g.fill();
  }
  for (let i = 0; i < 12; i++) {
    flower(r() * w, r() * h, 14 + r() * 8, r() > 0.4 ? '#f4f7fb' : '#ffd23f', '#f2a33a');
  }
}));

/* ───────────── accessories ───────────── */

const { w: HW, h: HH, d: HD } = DIM.head;

function helmet(color) {
  const g = new THREE.Group();
  const m = mat(color, { roughness: 0.85 });
  const shell = mesh(new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.46), m);
  shell.scale.set(HW * 1.1, HH * 1.0, HD * 1.1);
  shell.position.y = 0.06;
  g.add(shell);
  const brim = mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 32), m);
  brim.scale.set(HW * 1.14, 1, HD * 1.18);
  brim.position.set(0, 0.07, 0.02);
  g.add(brim);
  const strap = mesh(new THREE.TorusGeometry(0.42, 0.018, 6, 24, Math.PI), mat(0x3a3f22));
  strap.rotation.z = Math.PI;
  strap.scale.set(1, 1.05, 1);
  strap.position.set(0, 0.04, -0.02);
  g.add(strap);
  return g;
}

function hood(color) {
  // A shell around the skull with an oval cut out for the face: triangles
  // whose centre falls inside the opening are simply dropped.
  const geo = new THREE.SphereGeometry(0.5, 40, 30, 0, Math.PI * 2, 0, Math.PI * 0.8);
  const pos = geo.attributes.position, idx = geo.index.array, keep = [];
  const v = new THREE.Vector3();
  for (let i = 0; i < idx.length; i += 3) {
    v.set(0, 0, 0);
    for (let k = 0; k < 3; k++) v.x += pos.getX(idx[i + k]) / 3, v.y += pos.getY(idx[i + k]) / 3, v.z += pos.getZ(idx[i + k]) / 3;
    const inFace = v.z > 0 && (v.x / 0.33) ** 2 + ((v.y + 0.08) / 0.38) ** 2 < 1;
    if (!inFace) keep.push(idx[i], idx[i + 1], idx[i + 2]);
  }
  geo.setIndex(keep);
  geo.computeVertexNormals();
  const shell = mesh(geo, mat(color, { roughness: 0.92, side: THREE.DoubleSide }));
  shell.scale.set(HW * 1.14, HH * 1.08, HD * 1.12);
  shell.position.set(0, 0.04, -0.02);
  const g = new THREE.Group();
  g.add(shell);
  return g;
}

function drawstrings() {
  const g = new THREE.Group();
  for (const s of [1, -1]) {
    const c = mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.22, 6), mat(0xe8e8e8));
    c.position.set(0.08 * s, 0.6, 0.29);
    g.add(c);
  }
  return g;
}

function headband() {
  const g = new THREE.Group();
  const band = mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 40, 1, true), mat(0xffffff, { side: THREE.DoubleSide }));
  band.scale.set(HW * 0.95, 1, HD * 0.97);
  band.position.y = 0.24;
  band.rotation.x = -0.12;
  g.add(band);
  const stripe = mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.03, 40, 1, true), mat(0xd8323a, { side: THREE.DoubleSide }));
  stripe.scale.set(HW * 0.955, 1, HD * 0.975);
  stripe.position.y = 0.24;
  stripe.rotation.x = -0.12;
  g.add(stripe);
  return g;
}

function sunglasses(char) {
  const g = new THREE.Group();
  const lens = mat(0x14161c, { roughness: 0.15, metalness: 0.4 });
  const frame = mat(0xf2b632, { roughness: 0.35, metalness: 0.5 });
  for (const eye of char.eyes) {
    const l = mesh(blob(0.23, 0.17, 0.05, { box: 0.55 }), lens);
    l.position.copy(eye.position).add(new THREE.Vector3(0, 0.02, 0.05));
    l.quaternion.copy(eye.quaternion);
    g.add(l);
    const f = mesh(blob(0.25, 0.04, 0.05, { box: 0.6 }), frame);
    f.position.copy(l.position).add(new THREE.Vector3(0, 0.08, 0.005));
    f.quaternion.copy(eye.quaternion);
    g.add(f);
    // temple arm back to the ear
    const s = eye.userData.side;
    const arm = mesh(new THREE.BoxGeometry(0.025, 0.025, 0.42), frame);
    arm.position.set(0.39 * s, 0.07, 0.17);
    arm.rotation.y = 0.1 * s;
    g.add(arm);
  }
  const bridge = mesh(new THREE.BoxGeometry(0.1, 0.025, 0.03), frame);
  bridge.position.set(0, 0.08, char.eyes[0].position.z + 0.07);
  g.add(bridge);
  return g;
}

function vest() {
  const g = new THREE.Group();
  const m = mat(0x1d2026, { roughness: 0.9 });
  const v = mesh(blob(0.86, 0.62, 0.6, { box: 0.6, bottom: 0.88 }), m);
  v.position.y = 0.36;
  g.add(v);
  for (const x of [-0.2, 0, 0.2]) {
    const p = mesh(blob(0.16, 0.18, 0.1, { box: 0.7 }), mat(0x2a2e35));
    p.position.set(x, 0.22, 0.3);
    g.add(p);
  }
  return g;
}

/* ───────────── the skins ───────────── */

export const SKINS = [
  {
    id: 'default', name: 'Default',
    colors: {},
  },
  {
    id: 'army', name: 'Army',
    colors: { shirt: camo(), sleeve: camo(), shorts: camo(), pants: camo(), belt: 0x3a3f22, boots: 0x3a2a1c, gloves: 0x3a3f22 },
    sleeves: 'long', longPants: true,
    accessories: c => [c.mount('head', helmet(0x56653a))],
  },
  {
    id: 'hoodie', name: 'Hoodie',
    colors: { shirt: 0x3a4357, sleeve: 0x3a4357, shorts: 0x2b3140, pants: 0x2b3140, belt: 0x3a4357, boots: 0x1f2024, gloves: 0x1f2024 },
    sleeves: 'long', longPants: true,
    accessories: c => [c.mount('head', hood(0x3a4357)), c.mount('spine', drawstrings())],
  },
  {
    id: 'sports', name: 'Sports',
    colors: { shirt: jersey(), sleeve: 0xd8323a, shorts: 0xd8323a, belt: 0xffffff, boots: 0xf4f4f4, gloves: 0xd8323a, sock: 0xffffff },
    sleeves: 'none', socks: true,
    accessories: c => [c.mount('head', headband())],
  },
  {
    id: 'masked', name: 'Masked',
    colors: { head: 0x1a1b1f, shirt: 0x30343c, sleeve: 0x23262c, shorts: 0x3a3e46, pants: 0x3a3e46, belt: 0x1a1b1f, boots: 0x141417, gloves: 0x141417 },
    sleeves: 'long', longPants: true, mask: true,
    accessories: c => [c.mount('spine', vest())],
  },
  {
    id: 'beach', name: 'Beach',
    colors: { shirt: hawaiian(), sleeve: hawaiian(), shorts: 0x2a3550, belt: 0x2a3550, boots: 0x2b2b30 },
    sleeves: 'short',
    accessories: c => [c.mount('head', sunglasses(c))],
  },
];

export const skinById = id => SKINS.find(s => s.id === id) ?? SKINS[0];
