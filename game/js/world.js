/* The arena: a small original battle-royale clearing — grass, a dirt path,
   crates to climb, a ruined wall, a lookout tower, trees and rocks.

   Every solid thing registers a simple collider:
     box  { type:'box', min:{x,y,z}, max:{x,y,z} }   (axis-aligned)
     cyl  { type:'cyl', x, z, r, y0, y1 }            (upright cylinder)
   The controller only ever reads these; the meshes are decoration. */

import * as THREE from '../vendor/three.module.min.js';
import { mat, mesh } from './shapes.js';

export const ARENA = 46; // half-size of the playable square

export function buildWorld(scene) {
  const colliders = [];
  const flat = (c, o = {}) => mat(c, { flatShading: true, roughness: 0.95, ...o });

  // ── ground ──
  const groundTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = '#6fb34a'; g.fillRect(0, 0, 512, 512);
    let s = 3;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = r() > 0.5 ? 'rgba(90,160,60,0.55)' : 'rgba(130,195,85,0.5)';
      g.fillRect(r() * 512, r() * 512, 3 + r() * 6, 2 + r() * 4);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(14, 14);
    t.anisotropy = 8;
    return t;
  })();
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat(0xffffff, { map: groundTex, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // dirt path crossing the clearing
  const path = new THREE.Mesh(new THREE.PlaneGeometry(5, 120), mat(0xc9a46b, { roughness: 1 }));
  path.rotation.set(-Math.PI / 2, 0, 0.35);
  path.position.y = 0.01;
  path.receiveShadow = true;
  scene.add(path);
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(5.5, 40), mat(0xc4a878, { roughness: 1 }));
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(0, 0.012, 0);
  plaza.receiveShadow = true;
  scene.add(plaza);

  const addBox = (x, z, w, h, d, material, { y = 0, rotY = 0, collide = true } = {}) => {
    const m = mesh(new THREE.BoxGeometry(w, h, d), material);
    m.position.set(x, y + h / 2, z);
    m.rotation.y = rotY;
    scene.add(m);
    if (collide) {
      // rotated boxes collide by their axis-aligned bounds (only small turns are used)
      const c = Math.abs(Math.cos(rotY)), s = Math.abs(Math.sin(rotY));
      const hw = (w * c + d * s) / 2, hd = (w * s + d * c) / 2;
      colliders.push({ type: 'box', min: { x: x - hw, y, z: z - hd }, max: { x: x + hw, y: y + h, z: z + hd } });
    }
    return m;
  };

  // ── crates ──
  const crateTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#a8713f'; g.fillRect(0, 0, 128, 128);
    g.fillStyle = '#8d5b30';
    for (let i = 0; i < 4; i++) g.fillRect(0, i * 32 + 30, 128, 3);
    g.strokeStyle = '#6b4222'; g.lineWidth = 12; g.strokeRect(6, 6, 116, 116);
    g.lineWidth = 9; g.beginPath(); g.moveTo(10, 118); g.lineTo(118, 10); g.stroke();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const crateMat = mat(0xffffff, { map: crateTex, roughness: 0.9 });
  const crate = (x, z, s = 1.6, y = 0, r = 0) => addBox(x, z, s, s, s, crateMat, { y, rotY: r });

  // a staircase of crates leading up to the lookout
  crate(6, -4, 1.4);
  crate(8, -5.6, 1.6, 0);
  crate(8, -5.6, 1.6, 1.6);
  crate(-7, 5, 1.6, 0, 0.1);
  crate(-8.8, 5.6, 1.4, 0, -0.08);
  crate(-7.8, 5.3, 1.3, 1.6);
  crate(14, 10, 1.8);
  crate(-15, -12, 1.8, 0, 0.2);

  // ── loot chest (blue, glowing seam) ──
  {
    const chest = new THREE.Group();
    const body = mesh(new THREE.BoxGeometry(1.6, 0.9, 1.1), mat(0x2f6fe0, { roughness: 0.5 }));
    body.position.y = 0.45;
    const lid = mesh(new THREE.BoxGeometry(1.7, 0.35, 1.2), mat(0x3d82f2, { roughness: 0.45 }));
    lid.position.y = 1.05;
    const seam = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.06, 1.22), new THREE.MeshBasicMaterial({ color: 0x9fe8ff }));
    seam.position.y = 0.9;
    const lock = mesh(new THREE.BoxGeometry(0.3, 0.3, 0.1), mat(0xf5c13a, { metalness: 0.6, roughness: 0.3 }));
    lock.position.set(0, 0.85, 0.6);
    chest.add(body, lid, seam, lock);
    chest.position.set(-4, 0, -6);
    chest.rotation.y = 0.5;
    scene.add(chest);
    colliders.push({ type: 'cyl', x: -4, z: -6, r: 0.95, y0: 0, y1: 1.22 });
    scene.userData.chestSeam = seam;
  }

  // ── ruined stone wall ──
  const stone = flat(0x9aa0a8);
  const stoneDark = flat(0x7d838c);
  addBox(-16, 2, 1.2, 3.2, 9, stone);
  addBox(-16, 8.5, 1.2, 1.8, 3, stoneDark);
  addBox(-13.5, -3, 6, 2.4, 1.2, stone);
  addBox(-11, -3, 1.4, 3.6, 1.4, stoneDark);

  // ── lookout tower (platform reachable from the crate stairs) ──
  {
    const wood = flat(0x8a5a33);
    const woodDark = flat(0x6d4526);
    const tx = 11.4, tz = -7.6, top = 3.2, half = 2;
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const post = mesh(new THREE.BoxGeometry(0.4, top + 3, 0.4), woodDark);
      post.position.set(tx + dx * (half - 0.2), (top + 3) / 2, tz + dz * (half - 0.2));
      scene.add(post);
      colliders.push({ type: 'cyl', x: post.position.x, z: post.position.z, r: 0.28, y0: 0, y1: top + 3 });
    }
    addBox(tx, tz, half * 2, 0.3, half * 2, wood, { y: top - 0.3 });
    // railings on three sides (the side facing the crates stays open)
    addBox(tx, tz - half + 0.1, half * 2, 0.9, 0.15, woodDark, { y: top });
    addBox(tx + half - 0.1, tz, 0.15, 0.9, half * 2, woodDark, { y: top });
    addBox(tx, tz + half - 0.1, half * 2, 0.9, 0.15, woodDark, { y: top });
    const roof = mesh(new THREE.ConeGeometry(3.1, 1.6, 4), flat(0xc0503a));
    roof.position.set(tx, top + 3.7, tz);
    roof.rotation.y = Math.PI / 4;
    scene.add(roof);
  }

  // ── trees and rocks ──
  const leafMats = [flat(0x3f9a3a), flat(0x52ad3f), flat(0x358a3a)];
  const trunkMat = flat(0x7a5233);
  const rockMat = flat(0x8d939b);
  let seed = 42;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  const tree = (x, z, s = 1) => {
    const g = new THREE.Group();
    const trunk = mesh(new THREE.CylinderGeometry(0.28 * s, 0.4 * s, 2.2 * s, 7), trunkMat);
    trunk.position.y = 1.1 * s;
    g.add(trunk);
    const lm = leafMats[Math.floor(rnd() * leafMats.length)];
    for (const [dy, r, ox] of [[2.8, 1.7, 0], [3.9, 1.35, 0.25], [4.8, 0.95, -0.15]]) {
      const leaf = mesh(new THREE.IcosahedronGeometry(r * s, 1), lm);
      leaf.position.set(ox * s, dy * s, 0);
      leaf.rotation.set(rnd(), rnd(), rnd());
      g.add(leaf);
    }
    g.position.set(x, 0, z);
    scene.add(g);
    colliders.push({ type: 'cyl', x, z, r: 0.5 * s, y0: 0, y1: 5 * s });
  };
  const rock = (x, z, s = 1) => {
    const m = mesh(new THREE.DodecahedronGeometry(s, 0), rockMat);
    m.scale.set(1.2, 0.7, 1);
    m.position.set(x, s * 0.35, z);
    m.rotation.set(rnd(), rnd() * 6, rnd() * 0.3);
    scene.add(m);
    colliders.push({ type: 'cyl', x, z, r: s * 0.95, y0: 0, y1: s * 0.95 });
  };

  for (const [x, z, s] of [[-10, 14, 1.1], [-21, 6, 1.3], [18, 2, 1.2], [20, 16, 1], [4, 18, 1.3],
    [-6, -17, 1.2], [9, -18, 1.1], [-24, -8, 1.4], [26, -12, 1.2], [-3, 26, 1.1], [16, -26, 1.3],
    [-18, 22, 1.2], [30, 6, 1.4], [-30, 20, 1.3], [24, 28, 1.2], [-26, -26, 1.3]]) tree(x, z, s);
  for (const [x, z, s] of [[4, 8, 0.8], [-9, -9, 1], [12, 4, 0.6], [-20, -2, 0.9], [2, -12, 0.7], [18, -10, 1.1]]) rock(x, z, s);

  // ring of trees and hills at the edge, plus invisible walls
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const r = ARENA + 3 + rnd() * 6;
    tree(Math.cos(a) * r, Math.sin(a) * r, 1.2 + rnd() * 0.6);
  }
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.3;
    const hill = mesh(new THREE.SphereGeometry(18, 12, 8), flat(0x5c9e45), { shadow: false });
    hill.scale.set(1.6, 0.45, 1.2);
    hill.position.set(Math.cos(a) * 90, -2, Math.sin(a) * 90);
    scene.add(hill);
  }
  for (const [x, z, w, d] of [[0, ARENA, ARENA * 2, 1], [0, -ARENA, ARENA * 2, 1], [ARENA, 0, 1, ARENA * 2], [-ARENA, 0, 1, ARENA * 2]]) {
    colliders.push({ type: 'box', min: { x: x - w / 2, y: 0, z: z - d / 2 }, max: { x: x + w / 2, y: 50, z: z + d / 2 } });
  }

  // ── sky dressing: clouds and a balloon ──
  const cloudMat = mat(0xffffff, { roughness: 1, flatShading: true });
  const clouds = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const c = new THREE.Group();
    for (let k = 0; k < 4; k++) {
      const p = new THREE.Mesh(new THREE.IcosahedronGeometry(2 + rnd() * 2, 0), cloudMat);
      p.position.set(k * 2.6 - 4, rnd() * 1.2, rnd() * 2);
      c.add(p);
    }
    const a = rnd() * Math.PI * 2;
    c.position.set(Math.cos(a) * (40 + rnd() * 30), 24 + rnd() * 8, Math.sin(a) * (40 + rnd() * 30));
    clouds.add(c);
  }
  scene.add(clouds);
  const balloon = new THREE.Group();
  const env = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 12), flat(0x6b5fc2));
  env.scale.y = 1.15;
  const basket = new THREE.Mesh(new THREE.BoxGeometry(1, 0.8, 1), flat(0x8a5a33));
  basket.position.y = -3.4;
  balloon.add(env, basket);
  balloon.position.set(-30, 22, -34);
  scene.add(balloon);
  scene.userData.sky = { clouds, balloon };

  return { colliders, spawn: new THREE.Vector3(0, 0, 3) };
}
