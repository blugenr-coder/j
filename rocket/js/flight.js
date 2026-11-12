// Flight: renders the vessel around a round planet with a floating origin
// (the rocket is always at 0,0,0 so precision never breaks down at orbital distances).
import * as THREE from '../vendor/three.module.min.js';
import { PART, SPACE_ALT } from './data.js';
import { Vessel, R, ATMO, density, wrap } from './sim.js';
import { rocketMesh, partMesh, mat, Particles } from './models.js';
import { FlightEvents } from './events.js';
import { Input, isTouch } from './input.js';
import { Audio } from './audio.js';
import { S } from './state.js';

const WARPS = [1, 2, 4, 10, 50, 100];

function planetTex() {
  const w = 1024, h = 512, c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  const img = g.createImageData(w, h);
  const N = (x, y, s) => { let v = 0, a = 1, f = s; for (let o = 0; o < 5; o++) { v += a * (Math.sin(x * f + Math.sin(y * f * 1.7 + o) * 2) * Math.cos(y * f * 1.3 + Math.cos(x * f * 0.7 + o * 3))); a *= 0.5; f *= 2.1; } return v; };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = x / w * Math.PI * 2, vv = y / h * Math.PI;
    const n = N(u, vv, 1.6) + 0.15;
    const lat = Math.abs(y / h - 0.5) * 2;
    let r, gg, b;
    if (lat > 0.88) { r = gg = b = 235; }
    else if (n < 0) { const d = Math.min(1, -n * 1.5); r = 18 + 20 * (1 - d); gg = 60 + 50 * (1 - d); b = 110 + 60 * (1 - d); }
    else if (n < 0.06) { r = 194; gg = 178; b = 128; }
    else { const k = Math.min(1, n * 1.4); r = 70 + 70 * k * lat; gg = 110 - 20 * k; b = 50 + 10 * k; if (k > 0.8) { r = gg = b = 150 + 60 * (k - 0.8) * 5; } }
    const i = (y * w + x) * 4; img.data[i] = r; img.data[i + 1] = gg; img.data[i + 2] = b; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function groundTex() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
  g.fillStyle = '#5d6b3a'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 260; i++) { const cols = ['#6b7a40', '#4f5d31', '#7a7348', '#56653a', '#8a8255']; g.fillStyle = cols[i % cols.length]; g.globalAlpha = 0.5; g.beginPath(); g.ellipse(Math.random() * 512, Math.random() * 512, 10 + Math.random() * 60, 6 + Math.random() * 30, Math.random() * 3, 0, 7); g.fill(); }
  g.globalAlpha = 0.25; g.strokeStyle = '#3a3f2a'; g.lineWidth = 2; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(Math.random() * 512, 0); g.bezierCurveTo(Math.random() * 512, 170, Math.random() * 512, 340, Math.random() * 512, 512); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export class Flight {
  constructor(renderer, ui) {
    this.renderer = renderer; this.ui = ui;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.5, 4e6);
    this.scene.add(this.camera);
    this.sun = new THREE.DirectionalLight(0xfff4e0, 2.4); this.sun.position.set(-0.5, 0.8, 0.6).multiplyScalar(100); this.scene.add(this.sun);
    this.amb = new THREE.HemisphereLight(0xbcd8ff, 0x3a3020, 0.6); this.scene.add(this.amb);

    this.planet = new THREE.Group(); this.scene.add(this.planet);
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(R - 40, 160, 80), new THREE.MeshStandardMaterial({ map: planetTex(), roughness: 1, metalness: 0 }));
    sphere.rotation.x = Math.PI / 2; this.planet.add(sphere); this.sphere = sphere;
    const halo = new THREE.Mesh(new THREE.SphereGeometry(R + ATMO * 0.9, 96, 48), new THREE.ShaderMaterial({
      uniforms: { c: { value: new THREE.Color(0x5aa0ff) } }, side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec3 vN; varying vec3 vV;
        #include <common>
        #include <logdepthbuf_pars_vertex>
        void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv;
        #include <logdepthbuf_vertex>
        }`,
      fragmentShader: `uniform vec3 c; varying vec3 vN; varying vec3 vV;
        #include <logdepthbuf_pars_fragment>
        void main(){
        #include <logdepthbuf_fragment>
        float f=pow(1.0-abs(dot(vN,vV)),3.0); gl_FragColor=vec4(c*f*1.2,f);}`,
    }));
    this.planet.add(halo);
    // launch complex in planet coordinates (pad sits at the top of the planet, angle 90 degrees)
    const site = new THREE.Group(); site.position.set(0, R, 0);
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(12, 14, 1.2, 32), mat(0x6b6b6b, { roughness: 0.9 })); pad.position.y = -0.6; site.add(pad);
    const tw = mat(0xb45309, { metalness: 0.4 });
    const tower = new THREE.Mesh(new THREE.BoxGeometry(2, 34, 2), tw); tower.position.set(-7, 17, 0); site.add(tower);
    for (let y = 4; y < 34; y += 6) { const arm = new THREE.Mesh(new THREE.BoxGeometry(5, 0.4, 0.6), tw); arm.position.set(-4.5, y, 0); site.add(arm); }
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(40, 18, 30), mat(0x52525b)); bldg.position.set(80, 9, -60); site.add(bldg);
    const bldg2 = new THREE.Mesh(new THREE.BoxGeometry(14, 30, 14), mat(0xe5e7eb)); bldg2.position.set(-60, 15, -90); site.add(bldg2);
    for (let i = 0; i < 40; i++) { const tr = new THREE.Mesh(new THREE.ConeGeometry(2 + Math.random() * 2, 6 + Math.random() * 6, 6), mat(0x2f4f2a, { roughness: 1 })); const a = Math.random() * 6.28, d = 60 + Math.random() * 300; tr.position.set(Math.cos(a) * d, 4, Math.sin(a) * d); site.add(tr); }
    this.planet.add(site); this.site = site;
    // local ground disk with real curvature (precise near the rocket)
    const dg = new THREE.CircleGeometry(40000, 96, 0, Math.PI * 2);
    const pos = dg.attributes.position;
    for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, -(x * x + y * y) / (2 * R)); }
    dg.computeVertexNormals();
    this.gTex = groundTex(); this.gTex.repeat.set(160, 160);
    this.ground = new THREE.Mesh(dg, new THREE.MeshStandardMaterial({ map: this.gTex, roughness: 1, metalness: 0, transparent: true }));
    this.ground.rotation.x = -Math.PI / 2; this.scene.add(this.ground);
    // clouds
    this.clouds = new Particles(140, { additive: false, size: 1 });
    this.cloudData = [];
    for (let i = 0; i < 140; i++) this.cloudData.push({ a: Math.PI / 2 + (Math.random() - 0.5) * 0.6, r: R + 1800 + Math.random() * 4500, z: (Math.random() - 0.5) * 30000, s: 1500 + Math.random() * 2500 });
    this.scene.add(this.clouds.points);
    // stars
    const sg = new THREE.BufferGeometry(); const sp = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(3e6); sp.set([v.x, v.y, v.z], i * 3); }
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false }));
    this.scene.add(this.stars);

    this.fx = new Particles(1800, { additive: true, size: 1 });
    this.smoke = new Particles(1400, { additive: false, size: 1 });
    this.scene.add(this.fx.points); this.scene.add(this.smoke.points);

    this.cam = { yaw: 0.6, pitch: 0.12, dist: 30, shake: 0 };
    this.drag = null;
    const cv = renderer.domElement;
    cv.addEventListener('mousedown', e => { if (this.active && !isTouch) this.drag = { x: e.clientX, y: e.clientY }; });
    addEventListener('mouseup', () => { this.drag = null; });
    addEventListener('mousemove', e => { if (this.drag) { this.cam.yaw -= (e.clientX - this.drag.x) * 0.006; this.cam.pitch += (e.clientY - this.drag.y) * 0.005; this.drag = { x: e.clientX, y: e.clientY }; } });
    cv.addEventListener('wheel', e => { if (this.active) this.cam.dist = Math.max(4, Math.min(600, this.cam.dist * (e.deltaY > 0 ? 1.1 : 0.9))); }, { passive: true });
  }

  resize(w, h) { this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); }

  start() {
    this.active = true; Input.mode = 'flight'; Input.wantLock = false; Input.release();
    const stack = S.flightStack();
    const v = this.v = new Vessel(stack);
    if (S.flags.engineer) { v.repairs++; }
    if (S.flags.cat) v.catBonus = true;
    this.events = new FlightEvents(v, S.level);
    if (S.visit?.windy) this.events.rate *= 1.4;
    this.level = S.lvl();
    this.quests = this.level.quests.map(q => ({ ...q, done: false, failed: false }));
    this.bonus = (this.level.bonus || []).map(q => ({ ...q, done: false }));
    this.rocketValue = S.padValue();
    this.deployedSats = new Set();
    this.warpI = 0; this.ended = false; this.endT = 0;
    if (this.rocket) this.scene.remove(this.rocket);
    this.buildRocket();
    this.debris = [];
    this.cam = { yaw: -0.6, pitch: 0.08, dist: Math.max(14, this.rocketH * 2.4 + 6), shake: 0 };
    this.fx.n = 0; this.smoke.n = 0;
    this.prevPhi = v.phi;
    this.ui.showFlight(this);
  }
  stop() { this.active = false; Audio.engine(0, 0); Audio.wind(0); }

  buildRocket() {
    const live = this.v.live();
    const g = rocketMesh(live.map(p => ({ def: p.def, cond: p.cond, uid: p.uid })));
    this.rocket = g; this.rocketH = g.userData.height;
    this.partMeshes = new Map(g.userData.parts.map(pm => [pm.uid, pm]));
    // flame meshes for each engine
    this.flames = [];
    for (const p of live) if (p.def.engine) {
      const pm = this.partMeshes.get(p.uid);
      const fl = new THREE.Mesh(new THREE.ConeGeometry(p.def.r * 0.75, 1, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xffb35c, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      fl.rotation.x = Math.PI; fl.visible = false;
      const core = new THREE.Mesh(new THREE.ConeGeometry(p.def.r * 0.4, 1, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff6d8, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
      core.rotation.x = Math.PI; fl.add(core); core.position.y = 0.2; core.scale.set(1, 0.5, 1);
      pm.mesh.add(fl);
      this.flames.push({ p, fl });
    }
    // parachute canopy
    this.canopy = new THREE.Group();
    const cm = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2.2), new THREE.MeshStandardMaterial({ color: 0xff5a1f, side: THREE.DoubleSide, roughness: 0.8 }));
    const stripes = new THREE.Mesh(new THREE.SphereGeometry(1.01, 20, 10, 0, Math.PI * 2, Math.PI / 4.2, 0.12), new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    this.canopy.add(cm); this.canopy.add(stripes);
    const lineM = new THREE.LineBasicMaterial({ color: 0xdddddd });
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const lg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(Math.cos(a) * 0.95, 0.15, Math.sin(a) * 0.95), new THREE.Vector3(0, -1.6, 0)]); this.canopy.add(new THREE.Line(lg, lineM)); }
    this.canopy.visible = false; g.add(this.canopy);
    this.scene.add(g);
  }

  // in the local frame: +y = local up at the rocket, x = horizontal along the trajectory plane
  toLocal(px, py) {
    const v = this.v, phi = v.phi, a = -(phi - Math.PI / 2);
    const dx = px - v.x, dy = py - v.y;
    const c = Math.cos(a), s = Math.sin(a);
    return new THREE.Vector3(dx * c - dy * s, dx * s + dy * c, 0);
  }

  // ---------- controls ----------
  control(dt) {
    const v = this.v, k = Input.keys;
    let rot = (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0) - (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0);
    rot += this.ui.touchRot || 0;
    v.input = Math.max(-1, Math.min(1, rot));
    if (k.has('KeyW') || k.has('ShiftLeft') || k.has('ArrowUp')) v.throttle = Math.min(1, v.throttle + dt * 0.8);
    if (k.has('KeyS') || k.has('ControlLeft') || k.has('ArrowDown')) v.throttle = Math.max(0, v.throttle - dt * 0.8);
    if (Input.hit('KeyZ')) v.throttle = 1;
    if (Input.hit('KeyX')) v.throttle = 0;
    if (Input.hit('Space')) this.doStage();
    if (Input.hit('KeyP') || Input.hit('KeyC')) v.deployChute();
    if (Input.hit('Period')) this.setWarp(this.warpI + 1);
    if (Input.hit('Comma')) this.setWarp(this.warpI - 1);
    const ev = this.events.active;
    if (ev) {
      if (Input.hit('KeyE') || Input.hit('Enter')) this.events.tap();
      this.events.setHold(k.has('KeyE') || k.has('Enter') || this.ui.holding);
      if (ev.def.kind === 'choice') for (let i = 0; i < 3; i++) if (Input.hit('Digit' + (i + 1))) this.events.choose(i);
    }
    if (Input.hit('KeyV')) this.cam.dist = this.cam.dist > 60 ? Math.max(14, this.rocketH * 2.4 + 6) : 160;
  }
  doStage() { this.v.stage(); if (this.v.dropped.length) this.spawnDebris(); }
  maxWarp() {
    const v = this.v;
    if (!v.liftoff || this.events.active) return 0;
    if (v.alt < 120 + Math.abs(v.vVert) * 6) return 0;
    const thrusting = v.live().some(p => p.burning);
    if (thrusting) return 2;
    if (v.alt > ATMO) return 5;
    if (v.chuteOn) return 4;
    return 3;
  }
  setWarp(i) { this.warpI = Math.max(0, Math.min(this.maxWarp(), i)); }

  // ---------- frame ----------
  update(dt) {
    const v = this.v;
    if (!this.ended) this.control(dt);
    if (this.warpI > this.maxWarp()) this.warpI = this.maxWarp();
    const warp = WARPS[this.warpI];
    const simT = Math.min(dt, 0.05) * warp;
    const sub = Math.min(400, Math.ceil(simT / (1 / 60)));
    const h = simT / sub;
    const ox = v.x, oy = v.y;
    for (let i = 0; i < sub && !v.ended; i++) { v.step(h); this.events.update(h); }
    this.checkQuests();
    if (v.dropped.length) this.spawnDebris();
    for (const sname of v.sounds.splice(0)) Audio.cue(sname);
    // parts destroyed: hide their meshes
    for (const p of v.parts) if (p.destroyed && !p.hidden) { p.hidden = true; const pm = this.partMeshes.get(p.uid); if (pm) { this.blast(pm.mesh, 0.6); pm.mesh.visible = p.def.core ? false : Math.random() < 0.5; pm.mesh.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.material.color?.multiplyScalar(0.25); } }); } }
    // shift in local frame for world-anchored particles
    const disp = this.toLocal(ox, oy).multiplyScalar(1);  // previous position in new local frame
    this.render3D(dt, simT, disp);
    if (v.ended && !this.ended) { this.ended = true; this.endT = 0; if (v.crashed) this.explode(); }
    if (this.ended) { this.endT += dt; if (this.endT > (v.crashed ? 3 : 2) && !this.resultShown) { this.resultShown = true; this.finish(); } }
    else this.resultShown = false;
    this.ui.updateFlight(this, dt);
  }

  render3D(dt, simT, disp) {
    const v = this.v, alt = Math.max(0, v.alt), rho = density(alt);
    // planet placement
    this.planet.position.set(0, -v.r, 0);
    this.planet.rotation.z = -(v.phi - Math.PI / 2);
    this.ground.position.set(0, -alt, 0);
    this.ground.visible = alt < 45000;
    this.ground.material.opacity = Math.max(0, Math.min(1, (45000 - alt) / 20000));
    // the far-view sphere sits well below the detailed ground disk while that disk is visible
    const gap = alt < 25000 ? 3000 : alt < 45000 ? 3000 - (alt - 25000) / 20000 * 2950 : 50;
    this.sphere.scale.setScalar((R - gap) / (R - 40));
    const downrange = (Math.PI / 2 - v.phi) * R;
    this.gTex.offset.set(downrange / 40000 * 80 % 1, 0);
    // rocket attitude
    this.rocket.rotation.set(0, 0, v.pitch);
    // sky
    const k = Math.min(1, alt / ATMO);
    const sky = new THREE.Color(0x86b8e3).lerp(new THREE.Color(0x03040a), Math.pow(k, 0.6));
    if (v.heat > 20) sky.lerp(new THREE.Color(0xff6a2a), Math.min(0.25, (v.heat - 20) / 300));
    this.scene.background = sky;
    this.stars.material.opacity = Math.max(0, (k - 0.4) * 1.6);
    this.amb.intensity = 0.25 + 0.4 * (1 - k);
    // clouds in planet frame
    this.clouds.n = 0;
    for (const c of this.cloudData) {
      const px = Math.cos(c.a) * c.r, py = Math.sin(c.a) * c.r;
      const l = this.toLocal(px, py); l.z = c.z;
      if (l.length() > 60000) continue;
      const i = this.clouds.n++;
      this.clouds.pos.set([l.x, l.y, l.z], i * 3); this.clouds.col.set([0.95, 0.96, 1], i * 3); this.clouds.size[i] = c.s / 2.5;
    }
    const cg = this.clouds.points.geometry; cg.setDrawRange(0, this.clouds.n); cg.attributes.position.needsUpdate = cg.attributes.color.needsUpdate = cg.attributes.size.needsUpdate = true;
    // flames + particles
    const pAmb = rho / 1.225;
    const nose = new THREE.Vector3(-Math.sin(v.pitch), Math.cos(v.pitch), 0);
    const vel = this.toLocal(v.x + v.vx, v.y + v.vy);  // velocity vector in local frame
    const rate = Math.min(1, simT * 3) / Math.max(1, simT / dt);
    let anyBurn = 0;
    for (const { p, fl } of this.flames) {
      fl.visible = p.burning && !p.gone;
      if (!fl.visible) continue;
      anyBurn = Math.max(anyBurn, p.def.engine.srb ? 1 : v.throttle);
      const thr = p.def.engine.srb ? 1 : (v.mod.throttleStuck >= 0 ? v.mod.throttleStuck : v.throttle);
      const len = p.def.r * (2.2 + 6 * thr) * (1 + (1 - pAmb) * 1.2) * (0.9 + Math.random() * 0.2);
      const wide = 1 + (1 - pAmb) * 1.6;
      fl.scale.set(wide, len, wide); fl.position.y = -len / 2;
      fl.material.color.setHex(p.def.engine.srb ? 0xffc27a : pAmb > 0.3 ? 0xff9b4a : 0x8fb7ff);
      // particles from the nozzle
      const pm = this.partMeshes.get(p.uid);
      const wp = new THREE.Vector3(); pm.mesh.getWorldPosition(wp);
      const n = Math.ceil(6 * thr);
      for (let i = 0; i < n; i++) {
        const spread = new THREE.Vector3((Math.random() - 0.5), 0, (Math.random() - 0.5)).multiplyScalar(p.def.r);
        const ex = nose.clone().multiplyScalar(-(25 + Math.random() * 20) * (1 + (1 - pAmb)));
        const pv = vel.clone().add(ex);
        this.fx.emit([wp.x + spread.x, wp.y + spread.y - p.def.r * 0.3, wp.z + spread.z], [pv.x, pv.y, pv.z], 0.25 + Math.random() * 0.2, [1, 0.8, 0.45], [0.6, 0.15, 0.05], p.def.r * 1.4, p.def.r * 3, 2);
        if (rho > 0.03 && Math.random() < 0.6) {
          const g = 0.55 + Math.random() * 0.25;
          this.smoke.emit([wp.x + spread.x, wp.y - len * 0.6, wp.z + spread.z], [vel.x * 0.2 + ex.x * 0.3, vel.y * 0.2 + ex.y * 0.3, ex.z], 4 + Math.random() * 4, [g, g, g], [g * 0.9, g * 0.9, g * 0.95], p.def.r * 2.5, p.def.r * 14 * (1 + alt / 8000), 1.2);
        }
      }
    }
    // re-entry plasma
    if (v.heat > 15 && rho > 0) {
      const dir = vel.clone().normalize();
      for (let i = 0; i < 5; i++) {
        const o = new THREE.Vector3((Math.random() - 0.5) * this.rocket.userData.height * 0.3, 0, (Math.random() - 0.5) * 2);
        this.fx.emit([dir.x * 2 + o.x, dir.y * 2 + o.y, o.z], [-dir.x * 60, -dir.y * 60, 0], 0.4, [1, 0.5, 0.2], [0.6, 0.1, 0.4], 2 + v.heat / 30, 5, 1);
      }
    }
    // canopy
    this.canopy.visible = v.chuteFrac > 0 && v.live().some(p => p.def.chute && !p.destroyed);
    if (this.canopy.visible) {
      const top = this.rocketTop();
      const s = 1 + v.chuteFrac * Math.sqrt(v.chuteArea() / 3) * 0.9 * v.mod.chuteMul;
      this.canopy.position.set(Math.sin(performance.now() / 700) * 0.2, top + 1.2 + s * 1.6, 0);
      this.canopy.scale.set(s, s * (0.6 + 0.4 * v.chuteFrac), s);
      // keep the canopy upright-ish against the airflow
      this.canopy.rotation.z = -v.pitch * 0.7;
    }
    // world-anchored particles move opposite to the rocket
    const shift = [disp.x, disp.y, 0];
    this.fx.update(dt, null);
    this.smoke.update(dt, shift);
    for (let i = 0; i < this.fx.n; i++) { /* exhaust already moves with its own velocity relative to rocket */ }
    // debris
    for (const d of this.debris) {
      d.t += simT;
      const steps = Math.ceil(simT / 0.05);
      for (let i = 0; i < steps; i++) {
        const hh = simT / steps, r = Math.hypot(d.x, d.y), g = 9.81 * (R / r) ** 2, rr = density(r - R);
        const sp = Math.hypot(d.vx, d.vy), drag = 0.5 * rr * sp * 3 / d.m;
        d.vx += (-g * d.x / r - drag * d.vx) * hh; d.vy += (-g * d.y / r - drag * d.vy) * hh;
        d.x += d.vx * hh; d.y += d.vy * hh; d.heading += d.omega * hh;
        if (r - R < 0 && !d.dead) { d.dead = true; d.vx = d.vy = 0; const l = this.toLocal(d.x, d.y); if (l.length() < 3000) this.burst(l, 30, 3); }
      }
      const l = this.toLocal(d.x, d.y); d.mesh.position.copy(l); d.mesh.rotation.z = d.heading - v.phi;
      d.mesh.visible = !d.dead && l.length() < 20000;
    }
    this.debris = this.debris.filter(d => { if (d.t > 120 || d.dead) { this.scene.remove(d.mesh); return false; } return true; });

    // camera orbit around the rocket centre
    const c = this.cam;
    c.pitch = Math.max(-1.2, Math.min(1.4, c.pitch));
    if (isTouch && !this.ui.anyFlightTouch) { c.yaw -= Input.look.x * 0.006; c.pitch += Input.look.y * 0.005; }
    const H = this.rocket.userData.height;
    const center = new THREE.Vector3(0, H / 2, 0).applyEuler(this.rocket.rotation);
    const cp = new THREE.Vector3(Math.sin(c.yaw) * Math.cos(c.pitch), Math.sin(c.pitch), Math.cos(c.yaw) * Math.cos(c.pitch)).multiplyScalar(c.dist).add(center);
    // don't go under the ground
    if (cp.y < -alt + 2) cp.y = -alt + 2;
    const q = 0.5 * rho * v.speed * v.speed;
    c.shake = Math.max(c.shake * Math.exp(-dt * 3), anyBurn * (0.05 + pAmb * 0.15) + Math.min(0.4, q / 60000) + v.heat / 400);
    const sh = c.shake * (this.ended ? 0 : 1);
    this.camera.position.copy(cp).add(new THREE.Vector3((Math.random() - 0.5) * sh, (Math.random() - 0.5) * sh, (Math.random() - 0.5) * sh));
    this.camera.lookAt(center);
    Audio.engine(anyBurn, Math.max(0.15, pAmb));
    Audio.wind(Math.min(1, q / 30000) * 0.4);
  }
  rocketTop() { return this.v.live().reduce((a, p) => a + p.def.h, 0) + (this.rocketBaseOffset || 0); }

  spawnDebris() {
    const v = this.v;
    for (const d of v.dropped.splice(0)) {
      const g = rocketMesh(d.parts.map(p => ({ def: PART[p.id], uid: p.uid })));
      // remove those parts from the live rocket mesh, and shift the rest down
      for (const p of d.parts) { const pm = this.partMeshes.get(p.uid); if (pm) pm.mesh.parent.remove(pm.mesh); }
      this.rocket.children.forEach(ch => { if (ch !== this.canopy) ch.position.y -= d.dh; });
      this.rocket.userData.height -= d.dh;
      this.scene.add(g);
      const push = 3;
      this.debris.push({ mesh: g, x: d.x - Math.cos(d.heading) * 0.1, y: d.y - Math.sin(d.heading) * 0.1, vx: d.vx - Math.cos(d.heading) * push, vy: d.vy - Math.sin(d.heading) * push, heading: d.heading, omega: (Math.random() - 0.5) * 0.6, t: 0, m: d.parts.reduce((a, p) => a + PART[p.id].mass, 0) + 1 });
      this.burst(new THREE.Vector3(0, 0, 0), 25, 1.2, [1, 1, 0.9]);
    }
  }
  burst(at, n, size, col = [1, 0.6, 0.2]) {
    for (let i = 0; i < n; i++) {
      const d = new THREE.Vector3().randomDirection().multiplyScalar(5 + Math.random() * 20 * size);
      this.fx.emit([at.x, at.y, at.z], [d.x, d.y, d.z], 0.5 + Math.random() * 0.8, col, [0.4, 0.1, 0.05], size * 2, size * 6, 2.5);
      if (density(this.v.alt) > 0.05) this.smoke.emit([at.x, at.y, at.z], [d.x * 0.3, d.y * 0.3, d.z * 0.3], 3 + Math.random() * 3, [0.3, 0.3, 0.3], [0.5, 0.5, 0.5], size * 3, size * 14, 1);
    }
  }
  blast(mesh, s) { const wp = new THREE.Vector3(); mesh.getWorldPosition(wp); this.burst(wp, 30, s * 2); }
  explode() {
    const H = this.rocket.userData.height;
    for (let i = 0; i < 4; i++) this.burst(new THREE.Vector3(0, H * Math.random(), 0), 70, 3);
    // scatter the remaining parts as debris
    for (const pm of this.partMeshes.values()) {
      if (!pm.mesh.parent) continue;
      const wp = new THREE.Vector3(); pm.mesh.getWorldPosition(wp);
      pm.mesh.parent.remove(pm.mesh);
      const d = new THREE.Vector3().randomDirection().multiplyScalar(8 + Math.random() * 18); d.y = Math.abs(d.y) + 5;
      pm.mesh.position.copy(wp); this.scene.add(pm.mesh);
      this.flying = this.flying || []; this.flying.push({ m: pm.mesh, v: d, av: new THREE.Vector3().randomDirection().multiplyScalar(4) });
    }
    this.canopy.visible = false;
    this.cam.shake = 2;
  }

  // ---------- quests ----------
  questMet(q, atLanding) {
    const v = this.v, o = v.orbit();
    switch (q.type) {
      case 'alt': return v.maxAlt >= q.v;
      case 'speed': return v.maxSpeed >= q.v;
      case 'apo': return v.liftoff && (o.apo >= q.v || o.escape);
      case 'orbit': return v.alt > ATMO && o.pe >= Math.max(ATMO, q.v);
      case 'air': return v.airT >= q.v;
      case 'events': return v.resolved >= q.v;
      case 'crew': return atLanding ? v.crew() : false;
      case 'near': return atLanding && v.landed && v.landed.dist <= q.v;
      case 'hull': return atLanding && v.landed && v.landed.hull * 100 >= q.v;
      case 'fuel': return atLanding && v.landed && v.landed.fuel * 100 >= q.v;
      default: return false; // sci/deploy are completed by button
    }
  }
  checkQuests() {
    for (const q of [...this.quests, ...this.bonus]) if (!q.done && !q.failed && this.questMet(q, false)) { q.done = true; this.ui.toast(`Objective complete: ${this.ui.qLabel(q)}`, 'good'); Audio.cue('chime'); }
  }
  // which experiment / deploy buttons are available, and whether they are useful now
  actions() {
    const v = this.v, out = [];
    if (!v.liftoff || v.ended) return out;
    const sciKinds = new Set(v.live().filter(p => p.def.sci && !p.destroyed).map(p => p.def.sci));
    for (const k of sciKinds) {
      const qs = [...this.quests, ...this.bonus].filter(q => q.type === 'sci' && q.k === k && !q.done);
      const ok = qs.some(q => this.sciOk(q));
      out.push({ id: 'sci:' + k, label: { baro: 'BARO', thermo: 'THERMO', photo: 'PHOTO', sample: 'SAMPLE' }[k], ready: ok, pending: qs.length > 0 });
    }
    for (const p of v.live()) if (p.def.sat && !this.deployedSats.has(p.uid) && !p.destroyed) {
      const qs = [...this.quests, ...this.bonus].filter(q => q.type === 'deploy' && q.k === p.def.sat && !q.done);
      const blocked = v.fx.satBlocked.has(p.uid);
      out.push({ id: 'sat:' + p.uid, label: 'DEPLOY ' + (p.def.sat === 'cube' ? 'CUBESAT' : 'COMSAT'), ready: !blocked && qs.some(q => this.deployOk(q)), pending: qs.length > 0, blocked });
    }
    return out;
  }
  sciOk(q) { const v = this.v; return q.orbit ? v.inOrbit() : (v.alt >= q.min && v.alt <= (q.max || 1e12)); }
  deployOk(q) { const v = this.v; return q.orbit ? v.inOrbit() : v.alt >= q.min; }
  doAction(id) {
    const v = this.v;
    if (id.startsWith('sci:')) {
      const k = id.slice(4);
      const q = [...this.quests, ...this.bonus].find(q => q.type === 'sci' && q.k === k && !q.done && this.sciOk(q));
      if (q) { q.done = true; this.ui.toast(`Data collected: ${this.ui.qLabel(q)}`, 'good'); Audio.cue('chime'); }
      else { v.msg('Reading logged - no contract needs data here', 'warn'); Audio.cue('buzz'); }
    } else if (id.startsWith('sat:')) {
      const uid = id.slice(4); const p = v.live().find(x => x.uid === uid); if (!p) return;
      if (v.fx.satBlocked.has(uid)) { v.msg('Payload blocked by parts above it!', 'bad'); Audio.cue('error'); return; }
      const q = [...this.quests, ...this.bonus].find(q => q.type === 'deploy' && q.k === p.def.sat && !q.done && this.deployOk(q));
      this.deployedSats.add(uid); p.payload = 0;
      if (q) { q.done = true; this.ui.toast(`Satellite deployed: ${this.ui.qLabel(q)}`, 'good'); Audio.cue('chime'); }
      else {
        const qq = [...this.quests].find(q => q.type === 'deploy' && q.k === p.def.sat && !q.done);
        if (qq) { qq.failed = true; v.msg('Satellite released in the wrong place - contract objective failed', 'bad'); Audio.cue('fail'); }
      }
      this.burst(new THREE.Vector3(0, this.rocketTop(), 0), 12, 0.5, [0.8, 0.9, 1]);
    }
  }
  abort() { if (!this.v.ended) this.v.crash('Mission aborted'); }

  finish() {
    const v = this.v;
    const landed = !!v.landed;
    for (const q of [...this.quests, ...this.bonus]) if (!q.done && !q.failed && landed && this.questMet(q, true)) q.done = true;
    const allDone = this.quests.every(q => q.done);
    const success = landed && allDone;
    const survivors = landed ? v.live().filter(p => !p.destroyed).map(p => ({ uid: p.uid, cond: Math.max(0.05, Math.round(Math.min(p.cond - 0.06 - Math.random() * 0.06, p.cond * (0.4 + 0.6 * p.hp / p.maxHp)) * 100) / 100) })) : [];
    const reason = v.crashed ? v.crashed.reason : !allDone ? 'Landed, but contract objectives were not completed' : 'Mission accomplished';
    const r = { success, landed, crashed: !!v.crashed, survivors, bonusCash: v.bonusCash || 0, bonusDone: this.bonus.filter(b => b.done).map(b => b.reward), reason, rocketValue: this.rocketValue };
    const stats = { maxAlt: v.maxAlt, maxSpeed: v.maxSpeed, air: v.airT, hull: landed ? v.landed.hull : 0, impact: landed ? v.landed.impact : null, resolved: v.resolved, dist: landed ? v.landed.dist : null };
    const out = S.applyResult(r);
    if (success) Audio.cue('success');
    this.ui.showResult({ ...r, stats, quests: this.quests, bonus: this.bonus, lines: out.lines, level: this.level, recovered: survivors.length });
  }

  render(dt) {
    if (this.flying) for (const f of this.flying) { f.v.y -= 9.81 * dt; f.m.position.addScaledVector(f.v, dt); f.m.rotation.x += f.av.x * dt; f.m.rotation.z += f.av.z * dt; }
    this.renderer.render(this.scene, this.camera);
  }
  cleanup() {
    if (this.flying) { this.flying.forEach(f => this.scene.remove(f.m)); this.flying = null; }
    this.debris?.forEach(d => this.scene.remove(d.mesh)); this.debris = [];
    if (this.rocket) { this.scene.remove(this.rocket); this.rocket = null; }
  }
}
export { WARPS };
