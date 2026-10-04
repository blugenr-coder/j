/* Skins: pure data on top of the Blender model.

   A skin may recolour or texture any material of character.glb (Skin,
   HeadSkin, Shirt, Sleeve, Shorts, Pants, Belt, Boots, Gloves, Helmet, Hood…)
   and choose which optional layers are shown (see OPTIONAL_LAYERS in
   character.js). Every layer was modelled in Blender around the same body,
   so no skin can change proportions or animation.

   To add a skin: copy an entry below, give it a new id, add it to SKINS.
   Textures are drawn at runtime from canvases; nothing is copied from any
   existing game. */

import * as THREE from '../vendor/three.module.min.js';

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

const cache = {};
const lazy = (k, make) => () => (cache[k] ??= make());

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

/* Jersey: the Blender shirts are unwrapped as a cylinder around the body
   with the chest at u = 0.5 and the seam down the spine, so the back number
   is drawn half at each edge. Canvas top = collar. */
const jersey = lazy('jersey', () => canvasTexture(512, 256, (g, w, h) => {
  g.fillStyle = '#d8323a'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#ffffff';
  g.fillRect(0, h * 0.05, w, 6);
  g.font = '900 92px "Lilita One", Impact, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = 8; g.strokeStyle = '#8f1c22';
  for (const u of [0, 0.5, 1]) {
    g.strokeText('23', w * u, h * 0.42);
    g.fillText('23', w * u, h * 0.42);
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

/* ───────────── the skins ───────────── */

const tex = (map, repeat) => ({ map: map(), repeat });

export const SKINS = [
  {
    id: 'default', name: 'Default',
    show: ['ShirtTank', 'Shorts'],
    colors: {},
  },
  {
    id: 'army', name: 'Army',
    show: ['ShirtCrew', 'SleeveLong', 'Pants', 'Helmet'],
    colors: {
      Shirt: tex(camo, [2.5, 1]), Sleeve: tex(camo, [1, 1]), Pants: tex(camo, [2, 1]),
      Belt: 0x3a3f22, Boots: 0x3a2a1c, Gloves: 0x3a3f22, Helmet: 0x56653a,
    },
  },
  {
    id: 'hoodie', name: 'Hoodie',
    show: ['ShirtCrew', 'SleeveLong', 'Pants', 'Hood', 'Drawstrings'],
    colors: { Shirt: 0x3a4357, Sleeve: 0x3a4357, Hood: 0x3a4357, Pants: 0x2b3140, Belt: 0x3a4357, Boots: 0x1f2024, Gloves: 0x1f2024 },
  },
  {
    id: 'sports', name: 'Sports',
    show: ['ShirtTank', 'Shorts', 'Socks', 'Headband', 'HeadbandStripe'],
    colors: { Shirt: tex(jersey, [1, 1]), Shorts: 0xd8323a, Belt: 0xffffff, Boots: 0xf4f4f4, Gloves: 0xd8323a },
  },
  {
    id: 'masked', name: 'Masked',
    show: ['ShirtCrew', 'SleeveLong', 'Pants', 'Vest', 'VestPouches'],
    colors: { Shirt: 0x30343c, Sleeve: 0x23262c, Pants: 0x3a3e46, Belt: 0x1a1b1f, Boots: 0x141417, Gloves: 0x141417 },
    mask: true,
  },
  {
    id: 'beach', name: 'Beach',
    show: ['ShirtCrew', 'SleeveShort', 'Shorts', 'Sunglasses'],
    colors: { Shirt: tex(hawaiian, [2.5, 1]), Sleeve: tex(hawaiian, [1, 0.8]), Shorts: 0x2a3550, Belt: 0x2a3550, Boots: 0x2b2b30 },
  },
];

export const skinById = id => SKINS.find(s => s.id === id) ?? SKINS[0];
