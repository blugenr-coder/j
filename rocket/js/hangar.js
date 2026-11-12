// First-person hangar: walk around, grab parts with your hands, stack them on the pad.
import * as THREE from '../vendor/three.module.min.js';
import { PART } from './data.js';
import { S } from './state.js';
import { partMesh, makeHand, poseHand, mat } from './models.js';
import { Input, isTouch } from './input.js';
import { Audio } from './audio.js';

const ROOM = { x: 22, z: 22, h: 16 };
const PAD = { x: 0, z: 0, r: 3, h: 0.5 };
const DELIVERY = { x: 13, z: 12 };
const STORE = { x: -12, z: 12 };
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
  const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d');
  g.fillStyle = '#4a4b4c'; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 9000; i++) { const v = 60 + Math.random() * 30; g.fillStyle = `rgba(${v},${v},${v},0.25)`; g.fillRect(Math.random() * 1024, Math.random() * 1024, 2 + Math.random() * 3, 2 + Math.random() * 3); }
  for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(20,20,20,0.12)'; g.beginPath(); g.ellipse(Math.random() * 1024, Math.random() * 1024, 20 + Math.random() * 80, 10 + Math.random() * 40, Math.random() * 3, 0, 7); g.fill(); }
  g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 3;
  for (let i = 0; i <= 1024; i += 256) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 1024); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(1024, i); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(11, 11); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export class Hangar {
  constructor(renderer, ui) {
    this.renderer = renderer; this.ui = ui;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0c0d);
    this.scene.fog = new THREE.Fog(0x0b0c0d, 30, 70);
    this.camera = new THREE.PerspectiveCamera(70, 1, 0.03, 200);
    this.scene.add(this.camera);
    this.player = { x: -4, z: 9, yaw: -0.35, pitch: -0.08, vx: 0, vz: 0, bob: 0 };
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
    const hemi = new THREE.HemisphereLight(0xcfd8e3, 0x2a2622, 0.55); sc.add(hemi); this.hemi = hemi;
    const key = new THREE.DirectionalLight(0xfff2e0, 1.6); key.position.set(10, 20, 6);
    if (!isTouch) { key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 60 }); key.shadow.bias = -0.0005; }
    sc.add(key); this.key = key;
    this.lamps = [];
    for (const [x, z] of [[-10, -10], [10, -10], [-10, 10], [10, 10], [0, 0]]) {
      const l = new THREE.PointLight(0xffe2b8, x === 0 ? 40 : 25, 26, 1.6); l.position.set(x, ROOM.h - 1.5, z); sc.add(l); this.lamps.push(l);
      const fx = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.2, 0.4, 16), mat(0x222222)); fx.position.set(x, ROOM.h - 1, z); sc.add(fx);
      const bulb = new THREE.Mesh(new THREE.CircleGeometry(0.85, 16), new THREE.MeshBasicMaterial({ color: 0xfff1d6 })); bulb.rotation.x = Math.PI / 2; bulb.position.set(x, ROOM.h - 1.21, z); sc.add(bulb); this.lamps.push(bulb);
    }
    // floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.x * 2, ROOM.z * 2), new THREE.MeshStandardMaterial({ map: floorTex(), roughness: 0.85, metalness: 0.05 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; sc.add(floor);
    // painted zones
    const paint = (x, z, w, d, color) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ color, roughness: 0.7, transparent: true, opacity: 0.9 })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.005, z); m.receiveShadow = true; sc.add(m); };
    for (const [cx, cz, col] of [[DELIVERY.x, DELIVERY.z, 0xf5b301], [STORE.x, STORE.z, 0xd8d3c4]]) {
      paint(cx, cz - 5, 12, 0.18, col); paint(cx, cz + 5, 12, 0.18, col); paint(cx - 6, cz, 0.18, 10, col); paint(cx + 6, cz, 0.18, 10, col);
    }
    // walls with ribs
    const wallM = new THREE.MeshStandardMaterial({ color: 0x2b2d30, roughness: 0.9, metalness: 0.2 });
    const wall = (w, h, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallM); m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true; sc.add(m); };
    wall(ROOM.x * 2, ROOM.h, 0, ROOM.h / 2, -ROOM.z, 0); wall(ROOM.x * 2, ROOM.h, 0, ROOM.h / 2, ROOM.z, Math.PI);
    wall(ROOM.z * 2, ROOM.h, -ROOM.x, ROOM.h / 2, 0, Math.PI / 2); wall(ROOM.z * 2, ROOM.h, ROOM.x, ROOM.h / 2, 0, -Math.PI / 2);
    const rib = mat(0x3a3d42, { metalness: 0.6, roughness: 0.5 });
    for (let i = -ROOM.x; i <= ROOM.x; i += 5.5) for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.4, ROOM.h, 0.5), rib); b.position.set(i, ROOM.h / 2, s * (ROOM.z - 0.25)); sc.add(b); }
    for (let i = -ROOM.z; i <= ROOM.z; i += 5.5) for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, ROOM.h, 0.4), rib); b.position.set(s * (ROOM.x - 0.25), ROOM.h / 2, i); sc.add(b); }
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.x * 2, ROOM.z * 2), mat(0x1a1b1d)); ceil.rotation.x = Math.PI / 2; ceil.position.y = ROOM.h; sc.add(ceil);
    for (let i = -ROOM.x; i <= ROOM.x; i += 5.5) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.8, ROOM.z * 2), rib); t.position.set(i, ROOM.h - 0.4, 0); sc.add(t); }
    // big hangar door
    const door = new THREE.Mesh(new THREE.PlaneGeometry(16, 13), new THREE.MeshStandardMaterial({ color: 0x5b6168, metalness: 0.5, roughness: 0.6 })); door.position.set(0, 6.5, -ROOM.z + 0.05); sc.add(door);
    for (let y = 0.6; y < 13; y += 1.2) { const s = new THREE.Mesh(new THREE.BoxGeometry(16, 0.08, 0.1), rib); s.position.set(0, y, -ROOM.z + 0.1); sc.add(s); }
    const bayTex = signTex('BAY 01 — VERTICAL ASSEMBLY', 'MAX STACK 40 M · KEEP CLEAR WHEN CRANE IS ACTIVE', 1024, 140);
    const bay = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.37), new THREE.MeshBasicMaterial({ map: bayTex })); bay.position.set(0, 14, -ROOM.z + 0.2); sc.add(bay);

    // launch pad
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(PAD.r, PAD.r + 0.3, PAD.h, 40), mat(0x3f3f46, { roughness: 0.8 }));
    pad.position.set(PAD.x, PAD.h / 2, PAD.z); pad.receiveShadow = true; pad.castShadow = true; sc.add(pad);
    const ring = new THREE.Mesh(new THREE.RingGeometry(PAD.r - 0.35, PAD.r - 0.15, 48), new THREE.MeshBasicMaterial({ color: 0xff5a1f })); ring.rotation.x = -Math.PI / 2; ring.position.set(0, PAD.h + 0.01, 0); sc.add(ring);
    this.padRing = ring;
    // gantry tower
    const tw = mat(0xb45309, { metalness: 0.5, roughness: 0.5 });
    const tower = new THREE.Group(); tower.position.set(-4.6, 0, 0);
    for (const [x, z] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.15, 15, 0.15), tw); p.position.set(x, 7.5, z); p.castShadow = true; tower.add(p); }
    for (let y = 1; y < 15; y += 1.5) { for (const r of [0, Math.PI / 2]) { const b = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.08, 0.08), tw); b.position.y = y; b.rotation.y = r; tower.add(b.clone()); const b2 = b.clone(); b2.position.set(r ? 0.6 : 0, y, r ? 0 : 0.6); tower.add(b2); const b3 = b.clone(); b3.position.set(r ? -0.6 : 0, y, r ? 0 : -0.6); tower.add(b3); } }
    sc.add(tower);
    this.colliders.push({ x0: -5.4, x1: -3.8, z0: -0.8, z1: 0.8 });
    // crane hook
    this.hook = new THREE.Group();
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 6), mat(0x111111)); cable.position.y = 0.5; this.hook.add(cable); this.cable = cable;
    const hk = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.06, 6, 12, Math.PI * 1.4), mat(0xf5b301, { metalness: 0.6 })); this.hook.add(hk);
    this.hook.position.set(0, ROOM.h - 2, 0); sc.add(this.hook);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(ROOM.x * 2, 0.5, 0.6), mat(0xf5b301, { metalness: 0.4 })); rail.position.set(0, ROOM.h - 1.2, 0); sc.add(rail);

    // terminal desk
    const term = new THREE.Group(); term.position.set(-15, 0, -8); term.rotation.y = Math.PI / 4;
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 1.2), mat(0x27272a)); desk.position.y = 0.45; desk.castShadow = true; term.add(desk);
    const scr = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.3, 0.1), mat(0x111111)); scr.position.set(0, 1.65, -0.35); scr.rotation.x = -0.15; term.add(scr);
    this.screenTex = signTex('PROCUREMENT', 'MARKET · USED · RESELL · BLUEPRINTS', 900, 300, '#0d1210', '#7dffb0', '#7dffb0');
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 1.15), new THREE.MeshBasicMaterial({ map: this.screenTex })); glow.position.set(0, 1.65, -0.29); glow.rotation.x = -0.15; term.add(glow);
    this.termScreen = glow;
    const tsign = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.75), new THREE.MeshBasicMaterial({ map: signTex('TERMINAL', 'PARTS · CONTRACTS') })); tsign.position.set(0, 3, -0.4); term.add(tsign);
    sc.add(term); this.terminal = term;
    this.colliders.push(boxAround(-15, -8, 1.9));
    // launch console
    const con = new THREE.Group(); con.position.set(9, 0, -7); con.rotation.y = -Math.PI / 5;
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 1), mat(0x3f3f46)); base.position.y = 0.55; base.castShadow = true; con.add(base);
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.1, 1.1), mat(0x18181b)); top.position.y = 1.12; top.rotation.x = -0.2; con.add(top);
    const cover = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.12, 20), mat(0x18181b)); cover.position.set(0, 1.2, 0); con.add(cover);
    this.bigButton = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.1, 20), mat(0xdc2626, { emissive: 0x7f1d1d, emissiveIntensity: 1 })); this.bigButton.position.set(0, 1.26, 0); con.add(this.bigButton);
    for (let i = 0; i < 6; i++) { const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 4), mat(0x22c55e, { emissive: 0x22c55e, emissiveIntensity: 2 })); led.position.set(-0.6 + i * 0.24, 1.2, 0.38); con.add(led); }
    const lsign = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.6), new THREE.MeshBasicMaterial({ map: signTex('LAUNCH', 'ROLL OUT & IGNITE', 512, 128, '#111315', '#e9e4d6', '#dc2626') })); lsign.position.set(0, 2.3, 0); con.add(lsign);
    sc.add(con); this.console = con;
    this.colliders.push(boxAround(9, -7, 1.1));
    // zone signs
    for (const [x, z, t, s, c] of [[DELIVERY.x, DELIVERY.z - 5.6, 'DELIVERY', 'NEW & USED PARTS ARRIVE HERE', '#f5b301'], [STORE.x, STORE.z - 5.6, 'STORAGE', 'RECOVERED PARTS', '#d8d3c4']]) {
      const sg = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.8), new THREE.MeshBasicMaterial({ map: signTex(t, s, 512, 128, '#111315', '#e9e4d6', c), side: THREE.DoubleSide }));
      sg.position.set(x, 3.2, z); sc.add(sg);
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.2, 0.1), mat(0x52525b)); post.position.set(x, 1.6, z); sc.add(post);
    }
    // delivery chute in ceiling
    const hatch = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 1, 20, 1, true), mat(0x52525b, { side: THREE.DoubleSide })); hatch.position.set(DELIVERY.x, ROOM.h - 0.5, DELIVERY.z); sc.add(hatch);
    // clutter: barrels and crates
    const barrel = mat(0x1e40af, { roughness: 0.6 });
    for (const [x, z] of [[19, -3], [19.2, -1.7], [18, -2.4], [-19, -4], [-19, 2]]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.2, 14), barrel); b.position.set(x, 0.6, z); b.castShadow = true; sc.add(b); this.colliders.push(boxAround(x, z, 0.45)); }
    for (const [x, z, s] of [[18.5, 4, 1.2], [18.6, 5.4, 0.9], [-18.5, -15, 1.4]]) { const c = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), mat(0x8a6a3c, { roughness: 0.9 })); c.position.set(x, s / 2, z); c.castShadow = true; sc.add(c); this.colliders.push(boxAround(x, z, s / 2 + 0.1)); }

    // blueprint hologram projector
    const proj = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.3, 20), mat(0x18181b)); proj.position.set(4.5, 0.15, 2.5); sc.add(proj);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.4, 20), new THREE.MeshBasicMaterial({ color: 0x7dd3fc })); lens.rotation.x = -Math.PI / 2; lens.position.set(4.5, 0.31, 2.5); sc.add(lens);
    this.holo = new THREE.Group(); this.holo.position.set(4.5, 0.4, 2.5); sc.add(this.holo);
    this.colliders.push(boxAround(4.5, 2.5, 0.6));

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
          it.vel.set((Math.random() - 0.5) * 3, -2, (Math.random() - 0.5) * 3); it.av = (Math.random() - 0.5) * 4;
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
    this.dirty = false;
  }

  buildHolo() {
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
    this.lamps.forEach(l => { if (l.isLight) l.intensity = dark ? (Math.random() < 0.02 ? 6 : 0.4) : (l.position.x === 0 ? 40 : 25); });
    this.key.intensity = dark ? 0.08 : 1.6; this.hemi.intensity = dark ? 0.12 : 0.55;

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
        if (impact > 8.5 && !it.fresh) this.hurt(it, (impact - 8.5) * 0.025);
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
