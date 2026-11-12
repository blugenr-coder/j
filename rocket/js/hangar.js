// First-person hangar: walk around, grab parts with your hands, stack them on the pad.
import * as THREE from '../vendor/three.module.min.js';
import { PART } from './data.js';
import { S } from './state.js';
import { partMesh, makeHand, poseHand, mat, rocketMesh, adapters } from './models.js';
import { makeEnv } from './thumbs.js';
import { getLevel } from './data.js';
import { Input, isTouch } from './input.js';
import { Audio } from './audio.js';

const ROOM = { x: 22, z: 22, h: 16 };
const PAD = { x: 0, z: 0, r: 3, h: 0.5 };
const DELIVERY = { x: 10, z: 13 };
const STORE = { x: -10, z: 13 };
const EYE = 1.65;

function signTex(text, sub, w = 512, h = 128, bg = '#111315', fg = '#e9e4d6', accent = '#ff5a1f') {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = accent; g.fillRect(0, 0, 14, h);
  g.fillStyle = fg; g.font = `700 ${h * 0.42}px "Barlow Condensed", "Arial Narrow", sans-serif`; g.textBaseline = 'middle';
  g.fillText(text, 34, sub ? h * 0.38 : h / 2);
  if (sub) { g.fillStyle = '#8b8a85'; g.font = `500 ${h * 0.2}px "JetBrains Mono", monospace`; g.fillText(sub, 36, h * 0.76); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function floorTex() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
  g.fillStyle = '#56585c'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) { const v = 80 + Math.random() * 25; g.fillStyle = `rgba(${v},${v},${v + 3},0.22)`; g.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 2, 1 + Math.random() * 2); }
  g.strokeStyle = 'rgba(30,32,35,0.55)'; g.lineWidth = 2;
  g.strokeRect(1, 1, 510, 510);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(11, 11); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// stencil text painted on the floor
function floorText(text, sub, color, w = 1024, h = 256) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  g.strokeStyle = color; g.lineWidth = 10; g.strokeRect(8, 8, w - 16, h - 16);
  g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `800 ${h * 0.46}px "Barlow Condensed", "Arial Narrow", sans-serif`;
  g.fillText(text, w / 2, sub ? h * 0.42 : h / 2);
  if (sub) { g.font = `600 ${h * 0.14}px "JetBrains Mono", monospace`; g.globalAlpha = 0.85; g.fillText(sub, w / 2, h * 0.78); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function hazardTex() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 32; const g = c.getContext('2d');
  g.fillStyle = '#f5b301'; g.fillRect(0, 0, 512, 32); g.fillStyle = '#16181a';
  for (let x = -32; x < 544; x += 32) { g.beginPath(); g.moveTo(x, 32); g.lineTo(x + 16, 32); g.lineTo(x + 32, 0); g.lineTo(x + 16, 0); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}

export class Hangar {
  constructor(renderer, ui) {
    this.renderer = renderer; this.ui = ui;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0c0d);
    this.scene.fog = new THREE.Fog(0x0b0c0d, 30, 70);
    this.camera = new THREE.PerspectiveCamera(70, 1, 0.03, 200);
    this.scene.add(this.camera);
    this.player = { x: 0, z: 15, yaw: 0, pitch: -0.08, vx: 0, vz: 0, bob: 0 };
    this.items = new Map();   // uid -> item {uid, obj, pos, vel, yaw, av, def, onPad}
    this.held = null;
    this.colliders = [];      // {x0,x1,z0,z1}
    this.ray = new THREE.Raycaster();
    this.anim = { reach: 0, throwT: 0, place: [] };
    this.build();
    this.sync();
    S.on(() => { this.dirty = true; });
  }

  // ---------- scene ----------
  build() {
    const sc = this.scene;
    sc.background = new THREE.Color(0x1b1d20); sc.fog = new THREE.Fog(0x1b1d20, 40, 90);
    const hemi = new THREE.HemisphereLight(0xe3e8ef, 0x4a4540, 0.7); sc.add(hemi); this.hemi = hemi;
    const key = new THREE.DirectionalLight(0xfff4e6, 1.5); key.position.set(8, 20, 10);
    if (!isTouch) { key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 60 }); key.shadow.bias = -0.0005; }
    sc.add(key); this.key = key;
    this.lamps = [];
    const lampAt = (x, z, inten) => {
      const l = new THREE.PointLight(0xfff0dc, inten, 30, 1.4); l.position.set(x, ROOM.h - 1.6, z); l.userData.base = inten; sc.add(l); this.lamps.push(l);
      const fx = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.25, 0.7), mat(0x2a2c30)); fx.position.set(x, ROOM.h - 1.1, z); sc.add(fx);
      const bulb = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.5), new THREE.MeshBasicMaterial({ color: 0xfff6e8 })); bulb.rotation.x = Math.PI / 2; bulb.position.set(x, ROOM.h - 1.24, z); sc.add(bulb);
    };
    // fewer, stronger lights on phones: each light costs every pixel some work
    const spots = isTouch ? [[0, 0, 50], [-11, -8, 30], [11, -8, 30], [-11, 10, 30], [11, 10, 30]] : [];
    if (!isTouch) for (const x of [-11, 0, 11]) for (const z of [-11, 0, 11]) spots.push([x, z, x === 0 && z === 0 ? 45 : 22]);
    for (const [x, z, i] of spots) lampAt(x, z, i);

    // ---- floor: clean concrete + painted markings ----
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.x * 2, ROOM.z * 2), new THREE.MeshStandardMaterial({ map: floorTex(), roughness: 0.55, metalness: 0.1 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; sc.add(floor);
    let lift = 0.004;
    const flat = (w, d, x, z, m, ry = 0) => { const o = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); o.rotation.set(-Math.PI / 2, 0, ry); o.position.set(x, lift += 0.0005, z); o.receiveShadow = true; sc.add(o); return o; };
    const paintM = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, transparent: true, opacity: 0.92, depthWrite: false });
    // walkways from the spawn point to every station (dashed safety lines)
    const dash = paintM(0xe8c547);
    const walk = (x0, z0, x1, z1) => { const L = Math.hypot(x1 - x0, z1 - z0), a = Math.atan2(x1 - x0, z1 - z0); for (let t = 0.6; t < L - 0.6; t += 1.6) { const k = t / L; flat(0.14, 0.9, x0 + (x1 - x0) * k, z0 + (z1 - z0) * k, dash, a); } };
    walk(0, 15, 0, 5); walk(-1, 8, -10.5, 1); walk(1, 8, 10.5, 1); walk(-1.5, 12, -6, 12); walk(1.5, 12, 6, 12);
    // zones
    const zone = (cx, cz, w, d, col) => { const m = paintM(col); flat(w, 0.22, cx, cz - d / 2, m); flat(w, 0.22, cx, cz + d / 2, m); flat(0.22, d, cx - w / 2, cz, m); flat(0.22, d, cx + w / 2, cz, m); const f = paintM(col); f.opacity = 0.08; flat(w, d, cx, cz, f); };
    zone(DELIVERY.x, DELIVERY.z, 9, 8, 0xf5b301);
    zone(STORE.x, STORE.z, 11, 8, 0xd8d3c4);
    zone(-14.5, 0, 5, 6, 0x5fd38d);
    zone(14.5, 0, 5, 6, 0xff4433);
    // floor labels (readable from the spawn point)
    const label = (t, sub, col, x, z, w, ry = 0) => flat(w, w / 4, x, z, new THREE.MeshBasicMaterial({ map: floorText(t, sub, col), transparent: true, depthWrite: false, opacity: 0.9 }), ry);
    label('DELIVERY', 'NEW PARTS DROP HERE', '#f5b301', DELIVERY.x, DELIVERY.z + 2.6, 6);
    label('STORAGE', 'RECOVERED PARTS', '#d8d3c4', STORE.x, STORE.z + 2.6, 6);
    label('TERMINAL', 'BUY · DESIGN · CONTRACT', '#5fd38d', -12.6, 0, 4.4, -Math.PI / 2);
    label('LAUNCH', 'ROLL OUT', '#ff5a1f', 12.6, 0, 4.4, Math.PI / 2);
    label('ASSEMBLY PAD', 'BUILD BOTTOM-UP', '#e9e4d6', 0, 4.6, 4.4);
    // hazard ring around the pad
    const hz = hazardTex(); hz.repeat.set(10, 1);
    const hring = new THREE.Mesh(new THREE.RingGeometry(PAD.r + 0.45, PAD.r + 0.75, 64, 1), new THREE.MeshStandardMaterial({ map: hz, roughness: 0.6 }));
    hring.rotation.x = -Math.PI / 2; hring.position.y = 0.006; sc.add(hring);

    // ---- walls: light upper panels, dark lower band, orange stripe ----
    const upper = new THREE.MeshStandardMaterial({ color: 0x8d9298, roughness: 0.85, metalness: 0.1 });
    const lower = new THREE.MeshStandardMaterial({ color: 0x33363a, roughness: 0.9 });
    const stripe = mat(0xff5a1f, { roughness: 0.6, metalness: 0 });
    const wall = (len, x, z, ry) => {
      const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry;
      const u = new THREE.Mesh(new THREE.PlaneGeometry(len, ROOM.h - 2.6), upper); u.position.y = 2.6 + (ROOM.h - 2.6) / 2; u.receiveShadow = true; g.add(u);
      const l = new THREE.Mesh(new THREE.PlaneGeometry(len, 2.5), lower); l.position.y = 1.25; g.add(l);
      const st = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.18), stripe); st.position.set(0, 2.55, 0.01); g.add(st);
      for (let i = -len / 2; i <= len / 2 + 0.1; i += 5.5) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.35, ROOM.h, 0.35), mat(0x5c6168, { metalness: 0.5, roughness: 0.5 })); r.position.set(i, ROOM.h / 2, 0.18); g.add(r); }
      sc.add(g);
    };
    wall(ROOM.x * 2, 0, -ROOM.z, 0); wall(ROOM.x * 2, 0, ROOM.z, Math.PI);
    wall(ROOM.z * 2, -ROOM.x, 0, Math.PI / 2); wall(ROOM.z * 2, ROOM.x, 0, -Math.PI / 2);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.x * 2, ROOM.z * 2), mat(0x3a3d42)); ceil.rotation.x = Math.PI / 2; ceil.position.y = ROOM.h; sc.add(ceil);
    for (let i = -ROOM.x + 5.5; i < ROOM.x; i += 5.5) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.7, ROOM.z * 2), mat(0x52565c, { metalness: 0.5 })); t.position.set(i, ROOM.h - 0.35, 0); sc.add(t); }
    // big hangar door behind the pad
    const door = new THREE.Mesh(new THREE.PlaneGeometry(16, 13), new THREE.MeshStandardMaterial({ color: 0x6b7178, metalness: 0.5, roughness: 0.55 })); door.position.set(0, 6.5, -ROOM.z + 0.06); sc.add(door);
    for (let y = 0.6; y < 13; y += 1.2) { const s2 = new THREE.Mesh(new THREE.BoxGeometry(16, 0.07, 0.08), mat(0x50555b)); s2.position.set(0, y, -ROOM.z + 0.1); sc.add(s2); }
    const bay = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.37), new THREE.MeshBasicMaterial({ map: signTex('BAY 01 · VERTICAL ASSEMBLY', 'KEEP CLEAR WHEN THE CRANE IS MOVING', 1024, 140) })); bay.position.set(0, 14.2, -ROOM.z + 0.2); sc.add(bay);

    // ---- launch pad ----
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(PAD.r, PAD.r + 0.3, PAD.h, 48), mat(0x45474d, { roughness: 0.7 }));
    pad.position.set(PAD.x, PAD.h / 2, PAD.z); pad.receiveShadow = true; pad.castShadow = true; sc.add(pad);
    const ring = new THREE.Mesh(new THREE.RingGeometry(PAD.r - 0.35, PAD.r - 0.15, 48), new THREE.MeshBasicMaterial({ color: 0xff5a1f })); ring.rotation.x = -Math.PI / 2; ring.position.set(0, PAD.h + 0.01, 0); sc.add(ring);
    this.padRing = ring;
    // slim service tower behind the pad (frames it instead of blocking the view)
    const tw = mat(0xc2410c, { metalness: 0.4, roughness: 0.5 });
    const tower = new THREE.Group(); tower.position.set(0, 0, -4.7);
    for (const [x, z] of [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.14, 14, 0.14), tw); p.position.set(x, 7, z); p.castShadow = true; tower.add(p); }
    for (let y = 1.5; y < 14; y += 2) for (const [x, z, ry] of [[0, 0.55, 0], [0, -0.55, 0], [0.55, 0, Math.PI / 2], [-0.55, 0, Math.PI / 2]]) { const b2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.07, 0.07), tw); b2.position.set(x, y, z); b2.rotation.y = ry; tower.add(b2); }
    for (const y of [4, 8, 12]) { const arm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 1.4), tw); arm.position.set(0, y, 1.2); tower.add(arm); }
    sc.add(tower);
    this.colliders.push({ x0: -0.8, x1: 0.8, z0: -5.5, z1: -3.9 });
    // crane
    this.hook = new THREE.Group();
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 6), mat(0x111111)); cable.position.y = 0.5; this.hook.add(cable); this.cable = cable;
    const hk = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.06, 6, 12, Math.PI * 1.4), mat(0xf5b301, { metalness: 0.6 })); this.hook.add(hk);
    this.hook.position.set(0, ROOM.h - 2, 0); sc.add(this.hook);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(ROOM.x * 2, 0.5, 0.6), mat(0xf5b301, { metalness: 0.4 })); rail.position.set(0, ROOM.h - 1.2, 0); sc.add(rail);

    // ---- station helper: hanging sign + coloured light ----
    const station = (x, z, ry, title, sub, color, hex) => {
      const sg = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.05), new THREE.MeshBasicMaterial({ map: signTex(title, sub, 640, 160, '#111315', '#f2eee4', color), side: THREE.DoubleSide }));
      sg.position.set(x, 4.6, z); sg.rotation.y = ry; sc.add(sg);
      for (const s3 of [-1.6, 1.6]) { const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, ROOM.h - 5.1, 4), mat(0x222222)); const off = new THREE.Vector3(s3, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), ry); c2.position.set(x + off.x, 5.1 + (ROOM.h - 5.1) / 2, z + off.z); sc.add(c2); }
      const l = new THREE.PointLight(hex, 14, 9, 1.5); l.position.set(x, 3.2, z); l.userData.base = 14; sc.add(l); this.lamps.push(l);
    };

    // ---- terminal (west wall, facing the pad) ----
    const term = new THREE.Group(); term.position.set(-16.5, 0, 0); term.rotation.y = Math.PI / 2;
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.95, 1.2), mat(0x2a2d31)); desk.position.y = 0.475; desk.castShadow = true; term.add(desk);
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.06, 1.3), mat(0x5fd38d, { emissive: 0x1d6b3e, emissiveIntensity: 0.6 })); deskTop.position.y = 0.97; term.add(deskTop);
    const scr = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.5, 0.12), mat(0x111111)); scr.position.set(0, 1.85, -0.35); scr.rotation.x = -0.12; term.add(scr);
    this.screenTex = signTex('PROCUREMENT', 'MARKET · USED · RESELL · BLUEPRINTS', 1200, 300, '#0d1210', '#7dffb0', '#7dffb0');
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.45, 1.35), new THREE.MeshBasicMaterial({ map: this.screenTex })); glow.position.set(0, 1.85, -0.28); glow.rotation.x = -0.12; term.add(glow);
    this.termScreen = glow;
    sc.add(term); this.terminal = term;
    this.colliders.push({ x0: -17.3, x1: -15.7, z0: -1.9, z1: 1.9 });
    station(-15.8, 0, Math.PI / 2, 'TERMINAL', 'CONTRACT · BLUEPRINTS · MARKETS', '#5fd38d', 0x5fd38d);

    // ---- launch control (east wall) ----
    const con = new THREE.Group(); con.position.set(16.3, 0, 0); con.rotation.y = -Math.PI / 2;
    const base = new THREE.Mesh(new THREE.BoxGeometry(2, 1.1, 1.1), mat(0x3a3d42)); base.position.y = 0.55; base.castShadow = true; con.add(base);
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.1, 1.2), mat(0x18181b)); top.position.y = 1.12; top.rotation.x = -0.2; con.add(top);
    const cover = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.12, 24), mat(0xf5b301)); cover.position.set(0, 1.2, 0); con.add(cover);
    this.bigButton = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 24), mat(0xdc2626, { emissive: 0x7f1d1d, emissiveIntensity: 1 })); this.bigButton.position.set(0, 1.28, 0); con.add(this.bigButton);
    for (let i = 0; i < 6; i++) { const led = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 4), mat(0x22c55e, { emissive: 0x22c55e, emissiveIntensity: 2 })); led.position.set(-0.75 + i * 0.3, 1.2, 0.42); con.add(led); }
    const win = new THREE.Mesh(new THREE.PlaneGeometry(4, 2.2), new THREE.MeshBasicMaterial({ color: 0x86b8e3 })); win.position.set(0, 3, -1.1); con.add(win);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.4, 0.05), mat(0x2a2d31)); frame.position.set(0, 3, -1.14); con.add(frame);
    sc.add(con); this.console = con;
    this.colliders.push({ x0: 15.6, x1: 17, z0: -1.2, z1: 1.2 });
    station(15.6, 0, -Math.PI / 2, 'LAUNCH CONTROL', 'PRESS THE RED BUTTON', '#ff4433', 0xff5533);

    // ---- delivery + storage bays (behind the spawn point) ----
    const hatch = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 1, 20, 1, true), mat(0x52525b, { side: THREE.DoubleSide })); hatch.position.set(DELIVERY.x, ROOM.h - 0.5, DELIVERY.z); sc.add(hatch);
    const hatchLight = new THREE.PointLight(0xffc040, 16, 12, 1.5); hatchLight.position.set(DELIVERY.x, 5, DELIVERY.z); hatchLight.userData.base = 16; sc.add(hatchLight); this.lamps.push(hatchLight);
    // tidy pallets in the far corners only
    for (const [x, z] of [[-19.5, -19.5], [19.5, -19.5]]) {
      const pal = new THREE.Mesh(new THREE.BoxGeometry(2, 0.15, 2), mat(0x8a6a3c, { roughness: 0.9 })); pal.position.set(x, 0.075, z); sc.add(pal);
      for (const [dx, dz, h] of [[-0.45, -0.45, 1], [0.45, -0.45, 1], [-0.45, 0.45, 1], [0.45, 0.45, 0.6]]) { const crate = new THREE.Mesh(new THREE.BoxGeometry(0.85, h, 0.85), mat(0x9a7a4a, { roughness: 0.9 })); crate.position.set(x + dx, 0.15 + h / 2, z + dz); crate.castShadow = true; sc.add(crate); }
      this.colliders.push(boxAround(x, z, 1.1));
    }


    // ================= set dressing (kept against the walls, walkways stay clear) =================
    sc.environment = makeEnv(this.renderer); sc.environmentIntensity = 0.55;
    const box = (w, hh, d, m, x, y, z, ry = 0, collide = false) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), m); o.position.set(x, y, z); o.rotation.y = ry; o.castShadow = true; o.receiveShadow = true; sc.add(o); if (collide) this.colliders.push({ x0: x - w / 2 - 0.05, x1: x + w / 2 + 0.05, z0: z - d / 2 - 0.05, z1: z + d / 2 + 0.05 }); return o; };
    const cyl = (r0, r1, hh, m, x, y, z, seg = 16) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, hh, seg), m); o.position.set(x, y, z); o.castShadow = true; sc.add(o); return o; };
    const steelM = mat(0x8b9097, { metalness: 0.85, roughness: 0.35 });
    const darkM = mat(0x2a2d31, { roughness: 0.6, metalness: 0.3 });
    const yellowM = mat(0xf5b301, { roughness: 0.5, metalness: 0.2 });
    const redM = mat(0xc81e1e, { roughness: 0.45, metalness: 0.2 });
    const wallPanel = (tex, w, hh, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 })); m.position.set(x, y, z); m.rotation.y = ry; sc.add(m); return m; };

    // --- contract board (west wall, north of the terminal): shows real progress ---
    this.boardCanvas = document.createElement('canvas'); this.boardCanvas.width = 1024; this.boardCanvas.height = 700;
    this.boardTex = new THREE.CanvasTexture(this.boardCanvas); this.boardTex.colorSpace = THREE.SRGBColorSpace; this.boardTex.anisotropy = 4;
    box(5.3, 3.6, 0.12, darkM, -21.85, 3.4, -7, Math.PI / 2);
    wallPanel(this.boardTex, 5, 3.4, -21.75, 3.4, -7, Math.PI / 2);

    // --- tool cabinet + workbench (west wall, south of the terminal) ---
    const cab = box(0.8, 1.1, 2.2, redM, -21.4, 0.55, 6.2, 0, true);
    for (let i = 0; i < 5; i++) { box(0.02, 0.16, 2.0, darkM, -20.99, 0.2 + i * 0.2, 6.2); box(0.04, 0.03, 0.5, steelM, -20.96, 0.2 + i * 0.2, 6.2); }
    box(1.1, 0.06, 2.6, mat(0x6b4f2a, { roughness: 0.8 }), -21.3, 0.95, 9.4);
    for (const dz of [-1.15, 1.15]) for (const dx of [-0.45, 0.45]) box(0.06, 0.92, 0.06, steelM, -21.3 + dx, 0.46, 9.4 + dz);
    this.colliders.push({ x0: -22, x1: -20.6, z0: 8, z1: 10.8 });
    box(0.25, 0.2, 0.35, darkM, -21.2, 1.08, 8.5); box(0.06, 0.08, 0.5, steelM, -21.05, 1.2, 8.5);                 // vise
    const lap = box(0.45, 0.02, 0.32, darkM, -21.3, 0.99, 9.9); const scrn = box(0.45, 0.3, 0.02, mat(0x0d1210, { emissive: 0x2d7a50, emissiveIntensity: 0.8 }), -21.5, 1.14, 9.9, Math.PI / 2); scrn.rotation.z = 0.25;
    for (let i = 0; i < 5; i++) box(0.04, 0.03, 0.25 + Math.random() * 0.15, i % 2 ? redM : steelM, -21.1 - Math.random() * 0.3, 1, 10.3 + i * 0.12, Math.random() * 0.4);
    const peg = box(0.04, 1.4, 2.4, mat(0xb5a27a, { roughness: 0.9 }), -21.96, 2, 9.4);
    for (let i = 0; i < 9; i++) { const t = box(0.03, 0.35 + (i % 3) * 0.1, 0.05, i % 3 ? steelM : redM, -21.9, 2 + ((i % 3) - 1) * 0.35, 8.5 + (i % 5) * 0.4); t.rotation.x = 0.1; }

    // --- gas cylinders + electrical panel + safety board (east wall) ---
    for (let i = 0; i < 6; i++) { const c3 = cyl(0.17, 0.17, 1.5, mat([0x1f7a3a, 0x1e40af, 0x9ca3af][i % 3], { metalness: 0.5, roughness: 0.4 }), 21.5, 0.75, -7.5 + i * 0.42); cyl(0.06, 0.08, 0.15, steelM, 21.5, 1.58, -7.5 + i * 0.42); }
    box(0.1, 0.05, 2.7, yellowM, 21.3, 1.1, -6.45); this.colliders.push({ x0: 21.1, x1: 22, z0: -7.8, z1: -5.1 });
    box(0.3, 1.6, 1.1, mat(0x9ca3af, { metalness: 0.6, roughness: 0.4 }), -0 + 21.8, 1.8, 6);
    box(0.02, 0.18, 0.18, mat(0xf5b301), 21.64, 2.2, 6);
    for (let i = 0; i < 4; i++) cyl(0.05, 0.05, ROOM.h - 2.6, darkM, 21.85, 2.6 + (ROOM.h - 2.6) / 2, 5.65 + i * 0.22, 6);
    this.safetyCanvas = document.createElement('canvas'); this.safetyCanvas.width = 512; this.safetyCanvas.height = 320;
    this.safetyTex = new THREE.CanvasTexture(this.safetyCanvas); this.safetyTex.colorSpace = THREE.SRGBColorSpace;
    wallPanel(this.safetyTex, 2.6, 1.6, 21.75, 3.6, 9.5, -Math.PI / 2);
    this.drawBoard();

    // --- fire extinguishers at each station ---
    for (const [x, z] of [[-20.9, 2.6], [20.9, 2.6], [7.4, 17.4], [-7.4, 17.4]]) { cyl(0.11, 0.11, 0.55, redM, x, 0.28, z, 12); cyl(0.03, 0.05, 0.12, darkM, x, 0.6, z, 8); }

    // --- display rocket on a pedestal (north-west) ---
    const disp = rocketMesh(['nose_cone', 'core_probe', 'chute_s', 'tank_m', 'tank_s', 'fins', 'eng_hornet'].map(id => PART[id]));
    disp.position.set(-15, 0.6, -16); disp.rotation.y = 0.5; sc.add(disp);
    cyl(1.4, 1.6, 0.6, darkM, -15, 0.3, -16, 24); cyl(1.42, 1.42, 0.04, yellowM, -15, 0.6, -16, 24);
    this.colliders.push(boxAround(-15, -16, 1.6));
    const plq = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.55), new THREE.MeshBasicMaterial({ map: signTex('PW-0 PATHFINDER', 'OUR FIRST ROCKET · NEVER FLEW', 512, 170) }));
    plq.position.set(-14.1, 0.55, -14.45); plq.rotation.set(-0.5, 0.6, 0.29); sc.add(plq);
    const spot = new THREE.SpotLight(0xfff1dc, 60, 20, 0.45, 0.6, 1.4); spot.position.set(-12, 12, -12); spot.target.position.set(-15, 3, -16); sc.add(spot); sc.add(spot.target); spot.userData.base = 60; this.lamps.push(spot);

    // --- catwalk along the north wall (east side) with railing ---
    const deck = box(11, 0.15, 1.8, mat(0x4b5057, { metalness: 0.6, roughness: 0.5 }), 14.5, 5, -21);
    for (let x = 9.2; x <= 19.8; x += 1.325) box(0.05, 1.05, 0.05, yellowM, x, 5.6, -20.15);
    box(11, 0.06, 0.06, yellowM, 14.5, 6.1, -20.15); box(11, 0.05, 0.05, yellowM, 14.5, 5.6, -20.15);
    for (const x of [9.5, 14.5, 19.5]) box(0.2, 5, 0.2, steelM, x, 2.5, -20.3);
    for (let i = 0; i < 4; i++) { const cr = box(0.7, 0.7, 0.7, mat(0x9a7a4a, { roughness: 0.9 }), 11 + i * 2.3, 5.43, -21.2, i * 0.3); }

    // --- forklift parked beside the delivery bay ---
    const fk = new THREE.Group(); fk.position.set(17.5, 0, 8.5); fk.rotation.y = -Math.PI / 2;
    const fkM = mat(0xf59e0b, { roughness: 0.45, metalness: 0.2 });
    const fb = (w, hh, d, m, x, y, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), m); o.position.set(x, y, z); o.castShadow = true; fk.add(o); };
    fb(1.2, 0.7, 2, fkM, 0, 0.65, 0); fb(1.1, 0.6, 0.6, darkM, 0, 1.25, 0.6);
    for (const x of [-0.5, 0.5]) { fb(0.06, 1.3, 0.06, darkM, x, 1.75, -0.3); fb(0.06, 1.3, 0.06, darkM, x, 1.75, 0.5); }
    fb(1.1, 0.06, 0.9, darkM, 0, 2.4, 0.1);
    fb(0.1, 2.2, 0.1, darkM, -0.35, 1.1, -1.05); fb(0.1, 2.2, 0.1, darkM, 0.35, 1.1, -1.05);
    fb(0.12, 0.05, 1.1, steelM, -0.3, 0.1, -1.6); fb(0.12, 0.05, 1.1, steelM, 0.3, 0.1, -1.6);
    for (const [x, z, rr] of [[-0.62, -0.6, 0.3], [0.62, -0.6, 0.3], [-0.62, 0.7, 0.25], [0.62, 0.7, 0.25]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, 0.22, 14), mat(0x111111, { roughness: 0.9 })); w.rotation.z = Math.PI / 2; w.position.set(x, rr, z); fk.add(w); }
    sc.add(fk); this.colliders.push({ x0: 16.4, x1: 19.4, z0: 7.7, z1: 9.3 });

    // --- bollards at the pad approach ---
    for (const a of [0.6, -0.6, Math.PI - 0.6, Math.PI + 0.6]) { const bx = Math.sin(a) * 4.6, bz = Math.cos(a) * 4.6; cyl(0.12, 0.12, 0.9, yellowM, bx, 0.45, bz, 12); cyl(0.125, 0.125, 0.12, darkM, bx, 0.7, bz, 12); this.colliders.push(boxAround(bx, bz, 0.15)); }

    // --- ceiling: ducts, cable trays, skylights, banners ---
    for (const z of [-15, 15]) { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, ROOM.x * 2, 16), steelM); d.rotation.z = Math.PI / 2; d.position.set(0, ROOM.h - 2.4, z); sc.add(d); for (let x = -18; x <= 18; x += 6) cyl(0.47, 0.47, 0.08, darkM, x, ROOM.h - 2.4, z).rotation.z = Math.PI / 2; }
    for (const x of [-19, 19]) box(0.5, 0.08, ROOM.z * 2, mat(0x6b7280, { metalness: 0.6 }), x, ROOM.h - 3.2, 0);
    for (const x of [-16.5, -5.5, 5.5, 16.5]) { const sk = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 30), new THREE.MeshBasicMaterial({ color: 0xc9dcf0 })); sk.rotation.x = Math.PI / 2; sk.position.set(x, ROOM.h - 0.02, 0); sc.add(sk); }
    const bannerTex = c => { const cv = document.createElement('canvas'); cv.width = 128; cv.height = 512; const g = cv.getContext('2d'); g.fillStyle = c; g.fillRect(0, 0, 128, 512); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 470, 128, 42); g.fillStyle = '#16181a'; g.font = '800 64px "Barlow Condensed", sans-serif'; g.save(); g.translate(64, 256); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PADWORKS', 0, 0); g.restore(); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; };
    [['#ff5a1f', -8], ['#e9e4d6', -2.7], ['#ff5a1f', 2.7], ['#e9e4d6', 8]].forEach(([c, x]) => { const b = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 5.2), new THREE.MeshStandardMaterial({ map: bannerTex(c), side: THREE.DoubleSide, roughness: 0.9 })); b.position.set(x, ROOM.h - 4.4, -19); sc.add(b); });

    // blueprint hologram projector
    const proj = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.3, 20), mat(0x18181b)); proj.position.set(4.6, 0.15, 1.6); sc.add(proj);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.4, 20), new THREE.MeshBasicMaterial({ color: 0x7dd3fc })); lens.rotation.x = -Math.PI / 2; lens.position.set(4.6, 0.31, 1.6); sc.add(lens);
    this.holo = new THREE.Group(); this.holo.position.set(4.6, 0.4, 1.6); sc.add(this.holo);
    this.colliders.push(boxAround(4.6, 1.6, 0.6));

    // pad stack container
    this.padGroup = new THREE.Group(); this.padGroup.position.set(PAD.x, PAD.h, PAD.z); sc.add(this.padGroup);
    // ghost
    this.ghost = new THREE.Group(); this.ghost.visible = false; sc.add(this.ghost);

    // hands
    this.hands = { r: makeHand(1), l: makeHand(-1) };
    this.camera.add(this.hands.r); this.camera.add(this.hands.l);
    this.handRest = { r: new THREE.Vector3(0.22, -0.2, -0.38), l: new THREE.Vector3(-0.22, -0.21, -0.38) };
    // hands must render over world geometry so they never clip into parts
    for (const h of [this.hands.r, this.hands.l]) h.traverse(o => { if (o.isMesh) { o.renderOrder = 10; o.material = o.material.clone(); o.material.depthTest = true; } });
  }

  drawBoard() {
    const g = this.boardCanvas.getContext('2d'), W = 1024, H = 700;
    g.fillStyle = '#f1ede1'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#16181a'; g.fillRect(0, 0, W, 92);
    g.fillStyle = '#ff5a1f'; g.fillRect(0, 92, W, 8);
    g.fillStyle = '#f1ede1'; g.font = '800 58px "Barlow Condensed", sans-serif'; g.textBaseline = 'middle'; g.fillText('CONTRACT BOARD', 30, 48);
    g.font = '600 22px "JetBrains Mono", monospace'; g.textAlign = 'right'; g.fillText('GOVT. LAUNCH PROGRAM', W - 30, 48); g.textAlign = 'left';
    const start = Math.max(0, Math.min(S.level - 3, S.level));
    for (let i = 0; i < 8; i++) {
      const n = start + i, L = getLevel(n), y = 140 + i * 68;
      const done = n < S.level, cur = n === S.level;
      if (cur) { g.fillStyle = 'rgba(255,90,31,.16)'; g.fillRect(16, y - 30, W - 32, 60); g.fillStyle = '#ff5a1f'; g.fillRect(16, y - 30, 8, 60); }
      g.fillStyle = done ? '#2f8f5b' : cur ? '#16181a' : '#a29d90';
      g.font = '600 26px "JetBrains Mono", monospace'; g.fillText(String(n + 1).padStart(2, '0'), 44, y);
      g.font = `${cur ? 800 : 700} 38px "Barlow Condensed", sans-serif`; g.fillText(L.name.toUpperCase().slice(0, 28), 110, y);
      g.textAlign = 'right'; g.font = '600 24px "JetBrains Mono", monospace';
      g.fillText(done ? 'COMPLETE ✓' : cur ? `$${Math.round(L.grant / 1000)}k · NOW` : 'LOCKED', W - 34, y); g.textAlign = 'left';
      g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 2; g.beginPath(); g.moveTo(16, y + 34); g.lineTo(W - 16, y + 34); g.stroke();
    }
    this.boardTex.needsUpdate = true;
    // safety board: flights since the last crash
    let n = 0; for (const e of S.history) { if (!e.success && /impact|lost|abort|Command/i.test(e.reason || '')) break; n++; }
    const sg = this.safetyCanvas.getContext('2d');
    sg.fillStyle = '#f5b301'; sg.fillRect(0, 0, 512, 320); sg.fillStyle = '#16181a'; sg.fillRect(14, 14, 484, 292);
    sg.fillStyle = '#f5b301'; sg.font = '800 40px "Barlow Condensed", sans-serif'; sg.textAlign = 'center'; sg.fillText('FLIGHTS WITHOUT A CRASH', 256, 70);
    sg.fillStyle = '#f1ede1'; sg.font = '800 170px "Barlow Condensed", sans-serif'; sg.fillText(String(n), 256, 236);
    sg.fillStyle = '#8b8a85'; sg.font = '600 20px "JetBrains Mono", monospace'; sg.fillText('SAFETY IS EVERYONE\'S JOB', 256, 288);
    this.safetyTex.needsUpdate = true;
    this.boardLevel = S.level; this.boardHist = S.history.length;
  }

  // ---------- sync physical objects with inventory ----------
  sync() {
    const inv = new Map(S.inventory.map(p => [p.uid, p]));
    for (const [uid, it] of this.items) if (!inv.has(uid)) { it.obj.parent?.remove(it.obj); this.items.delete(uid); if (this.held === it) this.held = null; }
    let k = 0;
    for (const p of S.inventory) {
      let it = this.items.get(p.uid);
      if (it && it.cond !== p.cond) { it.obj.parent?.remove(it.obj); this.items.delete(p.uid); it = null; }
      if (!it) {
        const def = PART[p.id];
        const obj = partMesh(def, p.cond);
        obj.userData.uid = p.uid;
        it = { uid: p.uid, def, cond: p.cond, obj, pos: new THREE.Vector3(), vel: new THREE.Vector3(), yaw: Math.random() * 6, av: 0, tilt: 0, onPad: false };
        const spawnIdx = S.visit?.spawn.indexOf(p.uid) ?? -1;
        if (spawnIdx >= 0) {
          it.pos.set(DELIVERY.x + (Math.random() - 0.5) * 2, ROOM.h - 1 - def.h, DELIVERY.z + (Math.random() - 0.5) * 2);
          it.vel.set((Math.random() - 0.5) * 3, -2, (Math.random() - 0.5) * 3); it.av = (Math.random() - 0.5) * 4; it.delivery = true;
          S.visit.spawn.splice(spawnIdx, 1);
        } else {
          // recovered/stored parts line up in storage
          const n = k++; it.pos.set(STORE.x - 4.5 + (n % 5) * 2.2, 0, STORE.z - 3.5 + Math.floor(n / 5) * 2.4);
        }
        this.items.set(p.uid, it);
        this.scene.add(obj);
      }
    }
    // pad stack
    const padSet = new Set(S.pad);
    let y = 0;
    for (const uid of S.pad) {
      const it = this.items.get(uid); if (!it) continue;
      if (!it.onPad) { it.onPad = true; this.scene.remove(it.obj); this.padGroup.add(it.obj); }
      if (!this.anim.place.some(a => a.it === it)) { it.obj.position.set(0, y, 0); it.obj.rotation.set(0, 0, 0); }
      it.padY = y; y += it.def.h;
    }
    this.stackH = y;
    for (const it of this.items.values()) if (it.onPad && !padSet.has(it.uid)) { it.onPad = false; this.padGroup.remove(it.obj); this.scene.add(it.obj); }
    this.buildHolo();
    if (this.boardLevel !== S.level || this.boardHist !== S.history.length) this.drawBoard();
    this.dirty = false;
  }

  buildHolo() {
    if (this.padAdapters) this.padGroup.remove(this.padAdapters);
    this.padAdapters = adapters(S.padStack().map(p => PART[p.id])); this.padGroup.add(this.padAdapters);
    this.holo.clear();
    const bp = S.blueprints[S.plan];
    this.nextPlanId = null;
    if (!bp || !bp.ids.length) return;
    const ids = bp.ids.slice().reverse(); // bottom -> top
    const built = S.padStack().map(p => p.id);
    let matchN = 0; while (matchN < built.length && matchN < ids.length && built[matchN] === ids[matchN]) matchN++;
    this.nextPlanId = matchN === built.length && matchN < ids.length ? ids[matchN] : null;
    const H = ids.reduce((a, id) => a + PART[id].h, 0);
    const s = Math.min(0.35, 3.2 / Math.max(1, H));
    let y = 0;
    ids.forEach((id, i) => {
      const def = PART[id];
      const done = i < matchN, next = id === this.nextPlanId && i === matchN;
      const m = partMesh(def);
      const col = done ? 0x22d3ee : next ? 0xff5a1f : 0x7dd3fc;
      m.traverse(o => { if (o.isMesh) { o.material = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: done ? 0.55 : next ? 0.8 : 0.18, wireframe: !done && !next, depthWrite: false }); o.castShadow = false; } });
      m.position.y = y; m.userData.next = next; y += def.h; this.holo.add(m);
    });
    this.holo.scale.setScalar(s);
    this.holoNext = this.holo.children.find(c => c.userData.next);
  }

  // ---------- frame ----------
  enter() {
    Input.mode = 'hangar'; Input.wantLock = true;
    this.sync();
    const { r, l } = this.hands; r.visible = l.visible = true;
  }
  resize(w, h) { this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); }

  update(dt) {
    if (this.dirty) this.sync();
    const P = this.player;
    // look
    const sens = isTouch ? 0.0042 : 0.0022;
    if (!this.ui.modalOpen()) { P.yaw -= Input.look.x * sens; P.pitch -= Input.look.y * sens; }
    P.pitch = Math.max(-1.45, Math.min(1.45, P.pitch));
    // move
    const ax = this.ui.modalOpen() ? { x: 0, y: 0 } : Input.axis();
    const run = Input.keys.has('ShiftLeft') ? 1.7 : 1;
    const sp = 4.2 * run * (this.held ? 1 / (1 + this.held.def.mass / 2500) : 1);
    const fx = -Math.sin(P.yaw), fz = -Math.cos(P.yaw);
    const tx = (fx * ax.y - fz * ax.x) * sp, tz = (fz * ax.y + fx * ax.x) * sp;
    const acc = 1 - Math.exp(-dt * 10);
    P.vx += (tx - P.vx) * acc; P.vz += (tz - P.vz) * acc;
    this.movePlayer(P.vx * dt, P.vz * dt);
    const speed = Math.hypot(P.vx, P.vz);
    P.bob += dt * speed * 2.1;
    this.camera.position.set(P.x, EYE + Math.sin(P.bob * 2) * 0.03 * Math.min(1, speed / 3), P.z);
    this.camera.rotation.set(P.pitch, P.yaw, 0, 'YXZ');
    this.camera.updateMatrixWorld();

    // events: quake shakes loose items
    if (S.visit?.quake > 0) {
      S.visit.quake -= dt;
      this.camera.position.x += (Math.random() - 0.5) * 0.06; this.camera.position.y += (Math.random() - 0.5) * 0.05;
      for (const it of this.items.values()) if (!it.onPad && it !== this.held && Math.random() < dt * 3) { it.vel.x += (Math.random() - 0.5) * 4; it.vel.y += Math.random() * 3; it.vel.z += (Math.random() - 0.5) * 4; it.av += (Math.random() - 0.5) * 3; }
    }
    if (S.visit?.dark > 0) S.visit.dark -= dt;
    const dark = S.visit?.dark > 0;
    this.lamps.forEach(l => { if (l.isLight) l.intensity = dark ? (Math.random() < 0.02 ? 6 : 0.4) : l.userData.base; });
    this.key.intensity = dark ? 0.08 : 1.5; this.hemi.intensity = dark ? 0.12 : 0.7;

    this.updateItems(dt);
    this.interact(dt);
    this.updateHands(dt, speed);
    this.updateCrane(dt);
    // animations
    this.holo.rotation.y += dt * 0.5;
    if (this.holoNext) this.holoNext.visible = Math.sin(performance.now() / 180) > -0.4;
    this.bigButton.material.emissiveIntensity = 0.6 + Math.sin(performance.now() / 300) * 0.4;
    this.padRing.material.color.setHex(this.held && this.ghost.visible ? 0x22d3ee : 0xff5a1f);
  }

  movePlayer(dx, dz) {
    const P = this.player, r = 0.35;
    const blocked = (x, z) => {
      if (Math.abs(x) > ROOM.x - 0.8 || Math.abs(z) > ROOM.z - 0.8) return true;
      if (Math.hypot(x - PAD.x, z - PAD.z) < PAD.r + 0.3 + r) return true;
      return this.colliders.some(c => x > c.x0 - r && x < c.x1 + r && z > c.z0 - r && z < c.z1 + r);
    };
    if (!blocked(P.x + dx, P.z)) P.x += dx;
    if (!blocked(P.x, P.z + dz)) P.z += dz;
  }

  // simple rigid-ish physics for parts lying around: gravity, bounce, friction, push apart
  updateItems(dt) {
    const list = [...this.items.values()].filter(it => !it.onPad);
    for (const it of list) {
      if (it === this.held) continue;
      it.vel.y -= 9.81 * dt;
      it.pos.addScaledVector(it.vel, dt);
      if (it.pos.y <= 0) {
        const impact = -it.vel.y;
        it.pos.y = 0;
        if (impact > 1.2) { Audio.cue(impact > 5 ? 'thud' : 'drop'); it.tilt = Math.min(0.5, impact * 0.04); }
        if (impact > 8.5 && !it.fresh && !it.delivery) this.hurt(it, (impact - 8.5) * 0.025);
        if (impact < 1) it.delivery = false;
        it.vel.y = impact > 1 ? impact * 0.22 : 0;
        const f = Math.exp(-dt * 6); it.vel.x *= f; it.vel.z *= f; it.av *= Math.exp(-dt * 4);
      }
      it.fresh = false;
      // walls
      const rr = it.def.r;
      for (const [k, lim] of [['x', ROOM.x - rr], ['z', ROOM.z - rr]]) if (Math.abs(it.pos[k]) > lim) { it.pos[k] = Math.sign(it.pos[k]) * lim; it.vel[k] *= -0.3; }
      // pad and colliders
      const dpx = it.pos.x - PAD.x, dpz = it.pos.z - PAD.z, dp = Math.hypot(dpx, dpz), minD = PAD.r + rr;
      if (dp < minD && it.pos.y < PAD.h) { it.pos.x = PAD.x + dpx / (dp || 1) * minD; it.pos.z = PAD.z + dpz / (dp || 1) * minD; }
      for (const c of this.colliders) if (it.pos.y < 1.2 && it.pos.x > c.x0 - rr && it.pos.x < c.x1 + rr && it.pos.z > c.z0 - rr && it.pos.z < c.z1 + rr) {
        const dx0 = it.pos.x - (c.x0 - rr), dx1 = c.x1 + rr - it.pos.x, dz0 = it.pos.z - (c.z0 - rr), dz1 = c.z1 + rr - it.pos.z;
        const m = Math.min(dx0, dx1, dz0, dz1);
        if (m === dx0) it.pos.x = c.x0 - rr; else if (m === dx1) it.pos.x = c.x1 + rr; else if (m === dz0) it.pos.z = c.z0 - rr; else it.pos.z = c.z1 + rr;
      }
      it.yaw += it.av * dt;
      it.tilt *= Math.exp(-dt * 5);
    }
    // push apart (parts stand upright, so treat them as circles)
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j]; if (a === this.held || b === this.held) continue;
      const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z, d = Math.hypot(dx, dz), m = a.def.r + b.def.r + 0.05;
      if (d < m && d > 0.0001 && Math.abs(a.pos.y - b.pos.y) < Math.max(a.def.h, b.def.h)) {
        const push = (m - d) / 2, nx = dx / d, nz = dz / d;
        const wa = b.def.mass / (a.def.mass + b.def.mass), wb = 1 - wa;
        a.pos.x -= nx * push * wa * 2; a.pos.z -= nz * push * wa * 2; b.pos.x += nx * push * wb * 2; b.pos.z += nz * push * wb * 2;
      }
    }
    for (const it of list) {
      if (it === this.held) continue;
      it.obj.position.copy(it.pos); it.obj.rotation.set(Math.sin(performance.now() / 60) * it.tilt * 0.3, it.yaw, it.tilt * 0.5);
    }
  }
  hurt(it, amt) {
    const p = S.get(it.uid); if (!p) return;
    p.cond = Math.max(0.05, Math.round((p.cond - amt) * 100) / 100);
    it.cond = p.cond;
    this.ui.toast(`${it.def.name} dented on impact — condition ${Math.round(p.cond * 100)}%`, 'bad');
    S.save();
  }

  // ---------- interaction ----------
  aim() {
    this.ray.setFromCamera({ x: 0, y: 0 }, this.camera);
    this.ray.far = 7;
    const targets = [];
    for (const it of this.items.values()) if (it !== this.held) targets.push(it.obj);
    targets.push(this.terminal, this.console);
    const hits = this.ray.intersectObjects(targets, true);
    if (!hits.length) return null;
    let o = hits[0].object;
    while (o && !o.userData.uid && o !== this.terminal && o !== this.console) o = o.parent;
    if (!o) return null;
    if (o === this.terminal) return { kind: 'terminal', d: hits[0].distance };
    if (o === this.console) return { kind: 'launch', d: hits[0].distance };
    return { kind: 'item', it: this.items.get(o.userData.uid), d: hits[0].distance };
  }

  padAim() {
    // closest approach of the view ray to the pad's vertical axis
    const o = this.camera.position, d = new THREE.Vector3(); this.camera.getWorldDirection(d);
    const dx = PAD.x - o.x, dz = PAD.z - o.z;
    const t = (dx * d.x + dz * d.z) / Math.max(1e-4, d.x * d.x + d.z * d.z);
    if (t < 0 || t > 14) return false;
    const px = o.x + d.x * t - PAD.x, pz = o.z + d.z * t - PAD.z, py = o.y + d.y * t;
    return Math.hypot(px, pz) < PAD.r + 0.5 && py > -1 && py < PAD.h + this.stackH + 6;
  }

  interact(dt) {
    const modal = this.ui.modalOpen();
    const tgt = modal ? null : this.aim();
    this.target = tgt;
    let label = '', action = null;
    const canPlace = this.held && this.padAim();
    this.ghost.visible = false;
    if (this.held) {
      if (canPlace) {
        const next = this.nextPlanId;
        const off = next && next !== this.held.def.id;
        label = off ? `PLACE ${this.held.def.name.toUpperCase()} · blueprint expects ${PART[next].name}` : `PLACE ON STACK · ${this.held.def.name}`;
        action = 'place';
        this.showGhost(off);
      } else { label = `DROP ${this.held.def.name.toUpperCase()}`; action = 'drop'; }
    } else if (tgt) {
      if (tgt.kind === 'terminal' && tgt.d < 4) { label = 'USE TERMINAL'; action = 'terminal'; }
      else if (tgt.kind === 'launch' && tgt.d < 3.5) { label = S.pad.length ? 'LAUNCH ROCKET' : 'LAUNCH (pad is empty)'; action = 'launch'; }
      else if (tgt.kind === 'item') {
        const it = tgt.it, p = S.get(it.uid);
        const topUid = S.pad[S.pad.length - 1];
        if (it.onPad && it.uid !== topUid) { label = `${it.def.name} · remove parts above first`; }
        else { label = `GRAB ${it.def.name.toUpperCase()} · ${Math.round((p?.cond ?? 1) * 100)}%`; action = 'grab'; }
      }
    }
    this.ui.setPrompt(label, action, !!this.held);
    if (modal) return;
    const primary = Input.hit('KeyE') || Input.hit('Mouse0') || Input.hit('KeyF') || this.ui.consume('primary');
    const throwIt = Input.hit('Mouse2') || Input.hit('KeyQ') || this.ui.consume('throw');
    if (throwIt && this.held) return this.release(true);
    if (!primary) return;
    if (action === 'place') this.place();
    else if (action === 'drop') this.release(false);
    else if (action === 'grab') this.grab(tgt.it);
    else if (action === 'terminal') { Audio.cue('click'); this.ui.openTerminal(); }
    else if (action === 'launch') this.ui.requestLaunch();
  }

  showGhost(off) {
    const it = this.held; const g = this.ghost;
    if (g.userData.uid !== it.uid + off) {
      g.clear(); const m = partMesh(it.def);
      m.traverse(o => { if (o.isMesh) o.material = new THREE.MeshBasicMaterial({ color: off ? 0xf59e0b : 0x22d3ee, transparent: true, opacity: 0.35, depthWrite: false }); });
      g.add(m); g.userData.uid = it.uid + off;
    }
    g.position.set(PAD.x, PAD.h + this.stackH, PAD.z); g.visible = true;
    g.children[0].scale.setScalar(1 + Math.sin(performance.now() / 150) * 0.015);
  }

  grab(it) {
    if (it.onPad) {
      if (S.pad[S.pad.length - 1] !== it.uid) return;
      S.pad.pop(); S.save();
      const wp = new THREE.Vector3(); it.obj.getWorldPosition(wp);
      this.padGroup.remove(it.obj); this.scene.add(it.obj); it.onPad = false; it.pos.copy(wp);
      this.stackH -= it.def.h; this.buildHolo(); this.ui.onStackChanged();
    }
    this.held = it; it.vel.set(0, 0, 0); this.anim.reach = 1;
    Audio.cue('grab');
  }
  holdTarget() {
    const d = new THREE.Vector3(); this.camera.getWorldDirection(d);
    const dist = 1.7 + Math.max(it_size(this.held.def), 0.4) * 1.1;
    const p = this.camera.position.clone().addScaledVector(d, dist);
    p.y -= this.held.def.h * 0.5 + 0.45;
    p.y = Math.max(0, p.y);
    return p;
  }
  release(throwIt) {
    const it = this.held; if (!it) return;
    this.held = null;
    if (throwIt) {
      const d = new THREE.Vector3(); this.camera.getWorldDirection(d);
      const power = 11 / (1 + it.def.mass / 600);
      it.vel.copy(d.multiplyScalar(power)); it.vel.y += 2.5; it.av = (Math.random() - 0.5) * 8;
      this.anim.throwT = 1; Audio.cue('grab');
    }
    it.fresh = !throwIt;
  }
  place() {
    const it = this.held; if (!it) return;
    this.held = null;
    S.pad.push(it.uid); S.save();
    const wp = it.obj.position.clone();
    this.scene.remove(it.obj); this.padGroup.add(it.obj); it.onPad = true;
    const from = wp.sub(this.padGroup.position);
    this.anim.place.push({ it, from, to: new THREE.Vector3(0, this.stackH, 0), t: 0, yaw: it.yaw });
    it.padY = this.stackH; this.stackH += it.def.h;
    this.buildHolo();
    this.ui.onStackChanged();
  }

  // crane auto-assembly from the active blueprint
  autoAssemble() {
    const bp = S.blueprints[S.plan];
    if (!bp) return 'No active blueprint.';
    if (S.visit?.craneOff) return 'Crane is offline this visit. Build by hand.';
    const want = bp.ids.slice().reverse();
    const have = S.padStack().map(p => p.id);
    for (let i = 0; i < have.length; i++) if (have[i] !== want[i]) return 'The pad stack does not match the blueprint. Clear it first.';
    const queue = [];
    const used = new Set(S.pad);
    for (let i = have.length; i < want.length; i++) {
      const cands = S.inventory.filter(p => p.id === want[i] && !used.has(p.uid)).sort((a, b) => b.cond - a.cond);
      if (!cands.length) return `Missing ${PART[want[i]].name}. Buy it first.`;
      used.add(cands[0].uid); queue.push(cands[0].uid);
    }
    if (!queue.length) return 'Already assembled.';
    if (this.held) this.release(false);
    this.crane = { queue, cur: null, t: 0 };
    return null;
  }
  clearPad() {
    if (this.crane || !S.pad.length) return;
    const uids = S.pad.slice(); S.pad = []; S.save();
    uids.forEach((u, i) => {
      const it = this.items.get(u); if (!it) return;
      const wp = new THREE.Vector3(); it.obj.getWorldPosition(wp);
      this.padGroup.remove(it.obj); this.scene.add(it.obj); it.onPad = false;
      it.pos.set(PAD.x + Math.cos(i * 1.3) * (PAD.r + 1.5), wp.y, PAD.z + Math.sin(i * 1.3) * (PAD.r + 1.5));
      it.vel.set(0, 0, 0);
    });
    this.stackH = 0; this.buildHolo(); this.ui.onStackChanged();
  }
  updateCrane(dt) {
    // finish snap animations
    for (const a of this.anim.place) {
      a.t = Math.min(1, a.t + dt * 3.2);
      const e = 1 - Math.pow(1 - a.t, 3);
      a.it.obj.position.lerpVectors(a.from, a.to, e);
      a.it.obj.position.y += Math.sin(a.t * Math.PI) * 0.4;
      a.it.obj.rotation.set(0, a.yaw * (1 - e), 0);
      if (a.t >= 1 && !a.done) { a.done = true; Audio.cue('clank'); }
    }
    this.anim.place = this.anim.place.filter(a => !a.done);
    const c = this.crane;
    if (!c) { this.hook.position.lerp(new THREE.Vector3(0, ROOM.h - 2, 0), dt * 2); this.cable.scale.y = 1; this.cable.position.y = 0.5; return; }
    if (!c.cur) {
      const uid = c.queue.shift();
      if (!uid) { this.crane = null; this.ui.toast('Crane: assembly complete', 'good'); this.ui.onStackChanged(); return; }
      const it = this.items.get(uid); if (!it || it.onPad) return;
      c.cur = it; c.t = 0; c.from = it.pos.clone(); c.top = this.stackH;
    }
    const it = c.cur; c.t += dt * 0.9;
    const t = Math.min(1, c.t);
    // lift, travel, lower
    const liftY = Math.max(c.from.y, PAD.h + c.top) + 2.5;
    const target = new THREE.Vector3(PAD.x, PAD.h + c.top, PAD.z);
    let p;
    if (t < 0.25) p = c.from.clone().setY(c.from.y + (liftY - c.from.y) * (t / 0.25));
    else if (t < 0.75) { const k = (t - 0.25) / 0.5, e = k * k * (3 - 2 * k); p = new THREE.Vector3(c.from.x + (target.x - c.from.x) * e, liftY, c.from.z + (target.z - c.from.z) * e); }
    else p = target.clone().setY(liftY + (target.y - liftY) * ((t - 0.75) / 0.25));
    it.pos.copy(p); it.vel.set(0, 0, 0); it.obj.position.copy(p); it.obj.rotation.set(Math.sin(c.t * 7) * 0.03, it.yaw, 0);
    this.hook.position.set(p.x, p.y + it.def.h + 0.4, p.z);
    const len = ROOM.h - 1.2 - this.hook.position.y; this.cable.scale.y = Math.max(0.1, len); this.cable.position.y = len / 2;
    if (t >= 1) {
      this.scene.remove(it.obj); this.padGroup.add(it.obj); it.onPad = true;
      it.obj.position.set(0, c.top, 0); it.obj.rotation.set(0, 0, 0); it.padY = c.top; this.stackH += it.def.h;
      S.pad.push(it.uid); S.save(); Audio.cue('clank'); this.buildHolo(); this.ui.onStackChanged();
      c.cur = null;
    }
  }

  updateHands(dt, speed) {
    const { r, l } = this.hands, t = performance.now() / 1000;
    this.anim.reach = Math.max(0, this.anim.reach - dt * 3);
    this.anim.throwT = Math.max(0, this.anim.throwT - dt * 4);
    const bobX = Math.sin(this.player.bob) * 0.012 * Math.min(1, speed / 3), bobY = Math.abs(Math.cos(this.player.bob)) * 0.012 * Math.min(1, speed / 3);
    const idle = Math.sin(t * 1.4) * 0.004;
    const holding = !!this.held;
    const pointing = !holding && this.target && (this.target.kind === 'terminal' || this.target.kind === 'launch') && this.target.d < 4;
    // targets
    const rT = this.handRest.r.clone(), lT = this.handRest.l.clone();
    let rRot = new THREE.Euler(0.15, 0.1, -0.15), lRot = new THREE.Euler(0.15, -0.1, 0.15);
    if (holding) {
      const strain = Math.min(1, this.held.def.mass / 1500);
      rT.set(0.2, -0.1 - strain * 0.03 + Math.sin(t * 9) * strain * 0.004, -0.5); lT.set(-0.2, -0.1 - strain * 0.03, -0.5);
      rRot = new THREE.Euler(0.9, 0.35, -0.6); lRot = new THREE.Euler(0.9, -0.35, 0.6);
    }
    if (this.anim.reach > 0) rT.z -= this.anim.reach * 0.25;
    if (this.anim.throwT > 0) { rT.z -= Math.sin(this.anim.throwT * Math.PI) * 0.35; lT.z -= Math.sin(this.anim.throwT * Math.PI) * 0.35; }
    if (pointing) { lT.set(-0.12, -0.13, -0.5); lRot = new THREE.Euler(0.3, -0.1, 0.1); }
    rT.x += bobX; rT.y += bobY + idle; lT.x += bobX; lT.y += bobY - idle;
    const k = 1 - Math.exp(-dt * 14);
    r.position.lerp(rT, k); l.position.lerp(lT, k);
    r.quaternion.slerp(new THREE.Quaternion().setFromEuler(rRot), k); l.quaternion.slerp(new THREE.Quaternion().setFromEuler(lRot), k);
    const curl = holding ? 0.85 : this.anim.reach > 0 ? 0.3 + this.anim.reach * 0.6 : 0.25;
    r.userData.curl = (r.userData.curl ?? 0.25) + (curl - (r.userData.curl ?? 0.25)) * k;
    l.userData.curl = (l.userData.curl ?? 0.25) + ((pointing ? 0.9 : curl) - (l.userData.curl ?? 0.25)) * k;
    poseHand(r, r.userData.curl); poseHand(l, l.userData.curl, pointing);
    // glove bands glow while the mag-lift is engaged
    for (const h of [r, l]) h.userData.band.material.emissiveIntensity = holding ? 3 + Math.sin(t * 12) * 0.8 : 0.8;
    // held part springs toward the hold point: heavy parts lag behind
    if (holding) {
      const it = this.held, target = this.holdTarget();
      const stiff = 70 / (1 + it.def.mass / 350), damp = 2 * Math.sqrt(stiff) * 0.9;
      const acc = target.clone().sub(it.pos).multiplyScalar(stiff).addScaledVector(it.vel, -damp);
      it.vel.addScaledVector(acc, dt); it.pos.addScaledVector(it.vel, dt);
      if (it.pos.y < 0) { it.pos.y = 0; it.vel.y = 0; }
      const sway = new THREE.Vector3().subVectors(target, it.pos);
      it.yaw += (this.player.yaw + 0.6 - it.yaw) * Math.min(1, dt * 3);
      it.obj.position.copy(it.pos); it.obj.rotation.set(sway.z * 0.25, it.yaw, -sway.x * 0.25);
    }
  }

  render() { this.renderer.render(this.scene, this.camera); }
}

function boxAround(x, z, h) { return { x0: x - h, x1: x + h, z0: z - h, z1: z + h }; }
function it_size(def) { return Math.max(def.r * 2, def.h); }
