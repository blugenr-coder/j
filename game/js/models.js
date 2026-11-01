// Procedural low-poly models: characters, weapons, loot, plane, parachute.
import * as THREE from '../vendor/three.module.min.js';
import { WEAPONS, RARITY, AMMO, ITEMS } from './config.js';

const matCache = new Map();
export function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: opts.rough ?? 0.75, metalness: opts.metal ?? 0, emissive: opts.emissive || 0x000000, emissiveIntensity: opts.ei ?? 1, transparent: !!opts.transparent, opacity: opts.opacity ?? 1 });
    matCache.set(key, m);
  }
  return m;
}

const geo = {
  box: new THREE.BoxGeometry(1, 1, 1),
  sphere: new THREE.IcosahedronGeometry(1, 1),
  sphereLo: new THREE.IcosahedronGeometry(1, 0),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 8),
  cyl6: new THREE.CylinderGeometry(1, 1, 1, 6),
  cone: new THREE.ConeGeometry(1, 1, 6),
  capsule: new THREE.CapsuleGeometry(0.5, 0.6, 3, 8),
};
export { geo };

function mesh(g, m, sx = 1, sy = 1, sz = 1, x = 0, y = 0, z = 0, shadow = true) {
  const o = new THREE.Mesh(g, m);
  o.scale.set(sx, sy, sz);
  o.position.set(x, y, z);
  o.castShadow = shadow;
  return o;
}

// ---------------------------------------------------------------- weapons
export function makeWeaponModel(id, rarity = 0, scale = 1) {
  const g = new THREE.Group();
  const w = WEAPONS[id];
  if (!w || !w.shape.length) return g;
  const body = mat('#2d2f3a', { rough: 0.5, metal: 0.3 });
  const accent = mat(RARITY[rarity].color, { rough: 0.4, emissive: RARITY[rarity].color, ei: rarity >= 3 ? 0.35 : 0.08 });
  w.shape.forEach(([x, y, l, h], i) => {
    const width = i === 0 ? 0.16 : 0.1;
    const m = mesh(geo.box, i === 0 ? accent : body, width, h, l, 0, y + h / 2, x + l / 2);
    g.add(m);
  });
  g.scale.setScalar(scale);
  return g;
}

// Draw a flat weapon icon on a canvas from the same side profile.
export function drawWeaponIcon(ctx, id, x, y, w, h, color = '#fff') {
  const W = WEAPONS[id];
  if (!W) return;
  if (!W.shape.length) {
    // fist icon
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x + w * 0.3, y + h * 0.25, w * 0.4, h * 0.5, 6);
    ctx.fill();
    return;
  }
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [bx, by, bl, bh] of W.shape) {
    minX = Math.min(minX, bx); maxX = Math.max(maxX, bx + bl);
    minY = Math.min(minY, by); maxY = Math.max(maxY, by + bh);
  }
  const s = Math.min(w / (maxX - minX), h / (maxY - minY)) * 0.9;
  const ox = x + (w - (maxX - minX) * s) / 2, oy = y + (h - (maxY - minY) * s) / 2;
  ctx.fillStyle = color;
  for (const [bx, by, bl, bh] of W.shape) {
    ctx.beginPath();
    ctx.roundRect(ox + (bx - minX) * s, oy + (maxY - (by + bh)) * s, bl * s, bh * s, 2);
    ctx.fill();
  }
}

// ---------------------------------------------------------------- character
export function makeCharacter(c) {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const skin = new THREE.MeshStandardMaterial({ color: c.skin, flatShading: true, roughness: 0.8 });
  const shirt = new THREE.MeshStandardMaterial({ color: c.shirt, flatShading: true, roughness: 0.8 });
  const pants = new THREE.MeshStandardMaterial({ color: c.pants, flatShading: true, roughness: 0.85 });
  const hatM = new THREE.MeshStandardMaterial({ color: c.hatColor, flatShading: true, roughness: 0.7 });
  const packM = new THREE.MeshStandardMaterial({ color: c.pack, flatShading: true, roughness: 0.8 });
  const mats = [skin, shirt, pants, hatM, packM];

  // legs (pivot at hips)
  const legL = new THREE.Group(), legR = new THREE.Group();
  legL.position.set(-0.17, 0.62, 0); legR.position.set(0.17, 0.62, 0);
  legL.add(mesh(geo.box, pants, 0.22, 0.6, 0.24, 0, -0.3, 0));
  legR.add(mesh(geo.box, pants, 0.22, 0.6, 0.24, 0, -0.3, 0));
  legL.add(mesh(geo.box, mat('#2a2a35'), 0.24, 0.12, 0.34, 0, -0.58, 0.05));
  legR.add(mesh(geo.box, mat('#2a2a35'), 0.24, 0.12, 0.34, 0, -0.58, 0.05));
  body.add(legL, legR);

  const torso = new THREE.Group();
  torso.position.y = 0.62;
  body.add(torso);
  torso.add(mesh(geo.capsule, shirt, 0.82, 0.62, 0.62, 0, 0.42, 0));
  torso.add(mesh(geo.box, packM, 0.5, 0.55, 0.28, 0, 0.5, -0.35));

  // head
  const head = new THREE.Group();
  head.position.y = 1.18;
  torso.add(head);
  head.add(mesh(geo.sphere, skin, 0.36, 0.36, 0.36, 0, 0, 0));
  const eyeM = mat('#1b1b26');
  head.add(mesh(geo.sphereLo, eyeM, 0.05, 0.07, 0.04, -0.12, 0.04, 0.32, false));
  head.add(mesh(geo.sphereLo, eyeM, 0.05, 0.07, 0.04, 0.12, 0.04, 0.32, false));
  addHat(head, c.hat, hatM);

  // arms reach forward to hold the weapon (pivot at shoulders)
  const armL = new THREE.Group(), armR = new THREE.Group();
  armL.position.set(-0.4, 0.82, 0); armR.position.set(0.4, 0.82, 0);
  armL.add(mesh(geo.box, shirt, 0.18, 0.18, 0.5, 0, 0, 0.22));
  armL.add(mesh(geo.sphereLo, skin, 0.11, 0.11, 0.11, 0, 0, 0.5));
  armR.add(mesh(geo.box, shirt, 0.18, 0.18, 0.5, 0, 0, 0.22));
  armR.add(mesh(geo.sphereLo, skin, 0.11, 0.11, 0.11, 0, 0, 0.5));
  armL.rotation.y = 0.35; armR.rotation.y = -0.2;
  torso.add(armL, armR);

  const gunMount = new THREE.Group();
  gunMount.position.set(0.12, 0.78, 0.45);
  torso.add(gunMount);

  // flash
  const flash = new THREE.Mesh(geo.sphereLo, new THREE.MeshBasicMaterial({ color: '#fff3a0', transparent: true, opacity: 0.95 }));
  flash.visible = false;
  root.add(flash);

  root.userData = { body, torso, head, legL, legR, armL, armR, gunMount, flash, mats, weaponId: null };
  return root;
}

function addHat(head, type, m) {
  switch (type) {
    case 'cap':
      head.add(mesh(geo.sphere, m, 0.38, 0.22, 0.38, 0, 0.14, 0));
      head.add(mesh(geo.box, m, 0.4, 0.05, 0.3, 0, 0.12, 0.38));
      break;
    case 'beanie':
      head.add(mesh(geo.sphere, m, 0.39, 0.3, 0.39, 0, 0.12, 0));
      head.add(mesh(geo.sphereLo, m, 0.1, 0.1, 0.1, 0, 0.44, 0));
      break;
    case 'helmet':
      head.add(mesh(geo.sphere, m, 0.43, 0.3, 0.43, 0, 0.1, 0));
      head.add(mesh(geo.cyl, m, 0.46, 0.04, 0.46, 0, 0.0, 0));
      break;
    case 'phones':
      head.add(mesh(geo.box, m, 0.82, 0.06, 0.08, 0, 0.36, 0));
      head.add(mesh(geo.cyl, m, 0.14, 0.1, 0.14, -0.38, 0.02, 0).rotateZ(Math.PI / 2));
      head.add(mesh(geo.cyl, m, 0.14, 0.1, 0.14, 0.38, 0.02, 0).rotateZ(Math.PI / 2));
      head.add(mesh(geo.sphere, mat('#3a2a20'), 0.37, 0.2, 0.37, 0, 0.16, -0.02));
      break;
    case 'bandana':
      head.add(mesh(geo.sphere, m, 0.375, 0.2, 0.375, 0, 0.16, 0));
      head.add(mesh(geo.box, m, 0.08, 0.2, 0.08, 0.1, 0.05, -0.38));
      break;
    case 'visor':
      head.add(mesh(geo.sphere, mat('#f2f4f8'), 0.42, 0.42, 0.42, 0, 0.02, -0.02));
      head.add(mesh(geo.sphere, mat('#3fb8ff', { rough: 0.2, metal: 0.4, emissive: '#1a6aa0', ei: 0.4 }), 0.3, 0.18, 0.2, 0, 0.04, 0.26));
      break;
  }
}

export function setCharacterWeapon(model, id, rarity) {
  const ud = model.userData;
  const key = id + ':' + rarity;
  if (ud.weaponId === key) return;
  ud.weaponId = key;
  ud.gunMount.clear();
  if (id && WEAPONS[id].shape.length) ud.gunMount.add(makeWeaponModel(id, rarity, 0.9));
}

// ---------------------------------------------------------------- loot
export function makeLootModel(item) {
  const g = new THREE.Group();
  const inner = new THREE.Group();
  g.add(inner);
  let color = '#ffffff';
  if (item.type === 'weapon') {
    color = RARITY[item.rarity].color;
    const w = makeWeaponModel(item.id, item.rarity, 1.1);
    w.rotation.y = Math.PI / 2;
    w.position.x = -0.3;
    inner.add(w);
  } else if (item.type === 'ammo') {
    color = AMMO[item.id].color;
    inner.add(mesh(geo.box, mat('#3b3f2e'), 0.55, 0.32, 0.36, 0, 0, 0));
    inner.add(mesh(geo.box, mat(color), 0.57, 0.1, 0.38, 0, 0.1, 0));
  } else if (item.type === 'medkit') {
    color = ITEMS.medkit.color;
    inner.add(mesh(geo.box, mat('#f4f4f4'), 0.6, 0.38, 0.45, 0, 0, 0));
    inner.add(mesh(geo.box, mat('#ff3b55'), 0.36, 0.4, 0.1, 0, 0, 0.0));
    inner.add(mesh(geo.box, mat('#ff3b55'), 0.1, 0.4, 0.36, 0, 0, 0.0));
  } else if (item.type === 'armor') {
    color = RARITY[item.tier].color;
    inner.add(mesh(geo.box, mat(color), 0.62, 0.7, 0.26, 0, 0, 0));
    inner.add(mesh(geo.box, mat('#2c2c3c'), 0.16, 0.74, 0.28, -0.2, 0, 0));
    inner.add(mesh(geo.box, mat('#2c2c3c'), 0.16, 0.74, 0.28, 0.2, 0, 0));
  } else if (item.type === 'grenade') {
    color = ITEMS.grenade.color;
    inner.add(mesh(geo.sphere, mat('#3e7a3a'), 0.24, 0.28, 0.24, 0, 0, 0));
    inner.add(mesh(geo.cyl, mat('#9aa0a8'), 0.08, 0.14, 0.08, 0, 0.3, 0));
  } else if (item.type === 'soda') {
    color = ITEMS.soda.color;
    inner.add(mesh(geo.cyl, mat(color), 0.16, 0.5, 0.16, 0, 0, 0));
    inner.add(mesh(geo.cyl, mat('#e8e8f0', { metal: 0.6, rough: 0.3 }), 0.165, 0.06, 0.165, 0, 0.26, 0));
  }
  // rarity glow disc
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.75, 20), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.45, depthWrite: false }));
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 0.04;
  g.add(disc);
  if ((item.type === 'weapon' && item.rarity >= 3) || (item.type === 'armor' && item.tier >= 3)) {
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.45, 6, 8, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }));
    beam.position.y = 3;
    g.add(beam);
  }
  inner.position.y = 0.65;
  g.userData = { inner, disc };
  return g;
}

// ---------------------------------------------------------------- plane / chute
export function makePlane() {
  const g = new THREE.Group();
  const white = mat('#f4f1ea'), red = mat('#ff4f6a'), dark = mat('#2d3550'), yellow = mat('#ffd23f');
  g.add(mesh(geo.capsule, white, 3.2, 3.2, 12, 0, 0, 0).rotateX(Math.PI / 2));
  g.children[0].scale.set(3.2, 12, 3.2);
  g.add(mesh(geo.box, red, 22, 0.35, 3.2, 0, 0.2, 0.5));
  g.add(mesh(geo.box, red, 7, 0.3, 2, 0, 0.8, -8.5));
  g.add(mesh(geo.box, red, 0.35, 3.2, 2.4, 0, 2.2, -8.6));
  g.add(mesh(geo.sphere, dark, 1.0, 0.7, 1.3, 0, 1.0, 6.2));
  for (const x of [-6, 6]) {
    g.add(mesh(geo.cyl, yellow, 0.8, 2.4, 0.8, x, -0.3, 1.6).rotateX(Math.PI / 2));
    const prop = mesh(geo.box, dark, 3.4, 0.25, 0.08, x, -0.3, 2.9);
    prop.name = 'prop';
    g.add(prop);
  }
  return g;
}

export function makeParachute(color) {
  const g = new THREE.Group();
  const canopyGeo = new THREE.SphereGeometry(2.2, 10, 4, 0, Math.PI * 2, 0, Math.PI / 2.4);
  const colors = [];
  const pos = canopyGeo.attributes.position;
  const c1 = new THREE.Color(color), c2 = new THREE.Color('#ffffff');
  for (let i = 0; i < pos.count; i++) {
    const a = Math.atan2(pos.getZ(i), pos.getX(i));
    const band = Math.floor(((a + Math.PI) / (Math.PI * 2)) * 10) % 2;
    const c = band ? c1 : c2;
    colors.push(c.r, c.g, c.b);
  }
  canopyGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const canopy = new THREE.Mesh(canopyGeo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, side: THREE.DoubleSide }));
  canopy.position.y = 3.6;
  canopy.scale.y = 0.7;
  canopy.castShadow = true;
  g.add(canopy);
  const lineM = new THREE.LineBasicMaterial({ color: '#333333' });
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    pts.push(new THREE.Vector3(0, 1.4, 0), new THREE.Vector3(Math.cos(a) * 1.9, 3.7, Math.sin(a) * 1.9));
  }
  g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), lineM));
  return g;
}

// Billboarded overhead health bar.
export function makeHealthBar() {
  const g = new THREE.Group();
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.16), new THREE.MeshBasicMaterial({ color: '#1d1b2e', transparent: true, opacity: 0.75, depthTest: false }));
  const armor = new THREE.Mesh(new THREE.PlaneGeometry(1.12, 0.05), new THREE.MeshBasicMaterial({ color: '#4fa3ff', depthTest: false }));
  const fill = new THREE.Mesh(new THREE.PlaneGeometry(1.12, 0.08), new THREE.MeshBasicMaterial({ color: '#5ef07a', depthTest: false }));
  fill.position.set(0, -0.02, 0.001); armor.position.set(0, 0.05, 0.001);
  bg.renderOrder = 10; fill.renderOrder = 11; armor.renderOrder = 11;
  g.add(bg, fill, armor);
  g.userData = { fill, armor };
  return g;
}
