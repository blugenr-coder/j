// Flight-scene scenery: launch complex, ground shading without visible tiling,
// sky dome with sun, and a physically sized parachute.
import * as THREE from '../vendor/three.module.min.js';
import { mat } from './models.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
const tex = (c, rep = true) => { const t = new THREE.CanvasTexture(c); if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

// ---------- ground ----------
function grassTex() {
  const [c, g] = canvas(1024, 1024);
  g.fillStyle = '#5f6f3c'; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 26000; i++) {
    const v = Math.random(); g.fillStyle = v < 0.33 ? 'rgba(78,96,46,.55)' : v < 0.66 ? 'rgba(112,128,66,.45)' : 'rgba(132,122,78,.35)';
    const x = Math.random() * 1024, y = Math.random() * 1024; g.fillRect(x, y, 1.5, 3 + Math.random() * 4);
  }
  for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${rnd(60, 110)},${rnd(80, 115)},${rnd(40, 60)},.18)`; g.beginPath(); g.ellipse(Math.random() * 1024, Math.random() * 1024, rnd(30, 140), rnd(20, 90), Math.random() * 3, 0, 7); g.fill(); }
  return tex(c);
}
// large-scale variation: fields, woods, dry patches and dirt tracks (no visible tiling)
function macroTex() {
  const [c, g] = canvas(1024, 1024);
  g.fillStyle = '#8c8c8c'; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 160; i++) {
    const cols = ['#9a9d84', '#7b876a', '#a39b78', '#6f7d5c', '#b0a780', '#8a9a72'];
    g.fillStyle = cols[i % cols.length]; g.save(); g.translate(Math.random() * 1024, Math.random() * 1024); g.rotate(rnd(-0.3, 0.3));
    g.fillRect(0, 0, rnd(30, 120), rnd(20, 90)); g.restore();
  }
  for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(55,75,45,.55)'; g.beginPath(); g.ellipse(Math.random() * 1024, Math.random() * 1024, rnd(20, 90), rnd(15, 60), Math.random() * 3, 0, 7); g.fill(); }
  g.strokeStyle = 'rgba(140,125,95,.6)'; g.lineWidth = 2;
  for (let i = 0; i < 10; i++) { g.beginPath(); g.moveTo(Math.random() * 1024, 0); g.bezierCurveTo(Math.random() * 1024, 340, Math.random() * 1024, 680, Math.random() * 1024, 1024); g.stroke(); }
  return tex(c);
}
export function groundMaterial(shift) {
  const m = new THREE.MeshStandardMaterial({ map: grassTex(), roughness: 1, metalness: 0, transparent: true });
  const macro = macroTex();
  m.onBeforeCompile = sh => {
    sh.uniforms.uShift = shift; sh.uniforms.uMacro = { value: macro };
    sh.vertexShader = 'uniform float uShift;\nvarying vec2 vMacro;\n' + sh.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\n  vec2 wp = vec2(position.x - uShift, position.y);\n  vMapUv = wp / 260.0;\n  vMacro = wp / 18000.0;');
    sh.fragmentShader = 'uniform sampler2D uMacro;\nvarying vec2 vMacro;\n' + sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n  vec3 mc = texture2D(uMacro, vMacro).rgb;\n  vec3 mc2 = texture2D(uMacro, vMacro * 7.31 + 0.37).rgb;\n  diffuseColor.rgb *= mc * 1.25 * (0.75 + 0.5 * mc2);');
  };
  return m;
}

function concreteTex() {
  const [c, g] = canvas(1024, 1024);
  g.fillStyle = '#9b9a95'; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 20000; i++) { const v = rnd(130, 175); g.fillStyle = `rgba(${v},${v},${v - 4},.25)`; g.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2); }
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(40,38,35,${rnd(0.02, 0.05)})`; g.beginPath(); g.ellipse(Math.random() * 1024, Math.random() * 1024, rnd(20, 90), rnd(10, 50), Math.random() * 3, 0, 7); g.fill(); }
  g.strokeStyle = 'rgba(50,50,50,.5)'; g.lineWidth = 3;
  for (let x = 0; x <= 1024; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1024); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(1024, x); g.stroke(); }
  return tex(c);
}
// scorch marks around the pad
function scorchTex() {
  const [c, g] = canvas(512, 512);
  const grd = g.createRadialGradient(256, 256, 20, 256, 256, 256);
  grd.addColorStop(0, 'rgba(10,8,6,.7)'); grd.addColorStop(0.35, 'rgba(25,20,15,.3)'); grd.addColorStop(1, 'rgba(25,20,15,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(0,0,0,.06)'; const a = Math.random() * 6.28, d = rnd(40, 240); g.beginPath(); g.ellipse(256 + Math.cos(a) * d, 256 + Math.sin(a) * d, rnd(3, 18), rnd(2, 8), a, 0, 7); g.fill(); }
  return tex(c, false);
}

// ---------- launch complex (in planet coordinates; y = 0 is ground level at the pad) ----------
export function buildSite(site) {
  const add = (geo, m, x, y, z, ry = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.y = ry; o.castShadow = true; o.receiveShadow = true; site.add(o); return o; };
  const flat = (geo, m, x, z, y = 0.04, ry = 0) => { const o = new THREE.Mesh(geo, m); o.rotation.set(-Math.PI / 2, 0, ry); o.position.set(x, y, z); o.receiveShadow = true; site.add(o); return o; };
  const conc = concreteTex(); conc.repeat.set(10, 10);
  const concM = new THREE.MeshStandardMaterial({ map: conc, roughness: 0.92, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  flat(new THREE.CircleGeometry(75, 64), concM, 0, 0, 0.05);
  // scorched area, flame trench and exhaust channel
  flat(new THREE.PlaneGeometry(36, 36), new THREE.MeshBasicMaterial({ map: scorchTex(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }), 0, 0, 0.08);
  const trenchM = new THREE.MeshStandardMaterial({ color: 0x15130f, roughness: 1, polygonOffset: true, polygonOffsetFactor: -6 });
  flat(new THREE.PlaneGeometry(46, 7), trenchM, 28, 0, 0.1);
  for (const s of [-1, 1]) add(new THREE.BoxGeometry(46, 0.5, 0.6), mat(0x6f6e6a, { roughness: 0.95 }), 28, 0.25, s * 3.8);
  // launch mount: steel ring with hold-down clamps around the base of the rocket
  const steel = mat(0x5c6168, { metalness: 0.75, roughness: 0.4 });
  const ring = add(new THREE.TorusGeometry(2.3, 0.16, 10, 40), steel, 0, 0.16, 0); ring.rotation.x = Math.PI / 2;
  for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + Math.PI / 4; add(new THREE.BoxGeometry(0.35, 0.7, 0.9), steel, Math.cos(a) * 2.4, 0.35, Math.sin(a) * 2.4, -a); }
  // lattice service tower with arms, lightning mast and warning light
  const tw = mat(0xc2410c, { metalness: 0.45, roughness: 0.5 }), TX = 0, TZ = -10, TH = 42, TW = 4;
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) add(new THREE.BoxGeometry(0.35, TH, 0.35), tw, TX + x * TW / 2, TH / 2, TZ + z * TW / 2);
  for (let y = 0; y < TH; y += 3) {
    for (const [ax, az, ry] of [[0, TW / 2, 0], [0, -TW / 2, 0], [TW / 2, 0, Math.PI / 2], [-TW / 2, 0, Math.PI / 2]]) {
      add(new THREE.BoxGeometry(TW, 0.18, 0.18), tw, TX + ax, y + 0.1, TZ + az, ry);
      const d = add(new THREE.BoxGeometry(Math.hypot(TW, 3), 0.12, 0.12), tw, TX + ax, y + 1.6, TZ + az, ry); d.rotation.z = Math.atan2(3, TW) * (y % 6 ? 1 : -1);
    }
  }
  for (const y of [12, 22, 32]) add(new THREE.BoxGeometry(1.2, 0.5, 6), tw, TX, y, TZ + 5);
  add(new THREE.CylinderGeometry(0.08, 0.15, 14, 6), steel, TX, TH + 7, TZ);
  add(new THREE.SphereGeometry(0.35, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff2a1a }), TX, TH + 0.5, TZ + 2.2);
  // floodlight masts
  for (let i = 0; i < 4; i++) {
    const a = i / 4 * Math.PI * 2 + 0.3, x = Math.cos(a) * 55, z = Math.sin(a) * 55;
    add(new THREE.CylinderGeometry(0.25, 0.4, 24, 8), mat(0x9ca3af, { metalness: 0.6 }), x, 12, z);
    const lb = add(new THREE.BoxGeometry(3, 1.6, 0.8), mat(0x27272a), x, 24.5, z, -a + Math.PI / 2);
    add(new THREE.PlaneGeometry(2.6, 1.2), new THREE.MeshBasicMaterial({ color: 0xfff6dd }), x - Math.cos(a) * 0.45, 24.5, z - Math.sin(a) * 0.45, -a - Math.PI / 2);
  }
  // water deluge tower
  for (const [x, z] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) add(new THREE.CylinderGeometry(0.25, 0.25, 22, 6), steel, 70 + x, 11, -40 + z);
  add(new THREE.SphereGeometry(6, 24, 16), mat(0xe5e7eb, { roughness: 0.4, metalness: 0.3 }), 70, 27, -40);
  // propellant spheres
  for (const x of [-60, -76]) { add(new THREE.SphereGeometry(6.5, 28, 18), mat(0xf3f4f6, { roughness: 0.35, metalness: 0.4 }), x, 8.5, 34); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; add(new THREE.CylinderGeometry(0.25, 0.25, 6, 6), steel, x + Math.cos(a) * 4.8, 3, 34 + Math.sin(a) * 4.8); } }
  add(new THREE.CylinderGeometry(0.5, 0.5, 50, 8), steel, -62, 0.6, 8).rotation.set(Math.PI / 2, 0, 0);
  // assembly building and blockhouse
  const vab = add(new THREE.BoxGeometry(60, 70, 50), mat(0xd8d6cf, { roughness: 0.8 }), 190, 35, -170);
  add(new THREE.PlaneGeometry(18, 55), mat(0x5f646b, { metalness: 0.4 }), 190, 27.5, -144.9);
  add(new THREE.PlaneGeometry(26, 14), mat(0x1d4ed8), 172, 58, -144.9);
  add(new THREE.BoxGeometry(14, 4, 10), mat(0x8a8a85, { roughness: 0.95 }), -45, 2, -40);
  // roads
  const road = new THREE.MeshStandardMaterial({ color: 0x2f3134, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -2 });
  flat(new THREE.PlaneGeometry(9, 260), road, 95, -85, 0.06, Math.atan2(190, 170));
  flat(new THREE.PlaneGeometry(7, 200), road, -100, 30, 0.06, Math.PI / 2);
  // trees, as instanced meshes
  const N = 420;
  const crown = new THREE.InstancedMesh(new THREE.ConeGeometry(2.6, 9, 7), mat(0x2d4a26, { roughness: 1 }), N);
  const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.3, 0.4, 3, 5), mat(0x4a3826, { roughness: 1 }), N);
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    let x, z; do { x = rnd(-600, 600); z = rnd(-600, 600); } while (Math.hypot(x, z) < 110 || (Math.abs(x - 190) < 50 && Math.abs(z + 170) < 45));
    const s = rnd(0.7, 1.5); sc.set(s, s * rnd(0.8, 1.3), s);
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * 6);
    M.compose(new THREE.Vector3(x, 3 * s + 4.5 * sc.y, z), q, sc); crown.setMatrixAt(i, M);
    M.compose(new THREE.Vector3(x, 1.5 * s, z), q, new THREE.Vector3(s, s, s)); trunk.setMatrixAt(i, M);
  }
  crown.castShadow = true; site.add(crown); site.add(trunk);
}

// ---------- sky dome ----------
export function makeSky(sunDir) {
  const m = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { uK: { value: 0 }, uSun: { value: sunDir.clone().normalize() } },
    vertexShader: `varying vec3 vDir;
      #include <common>
      #include <logdepthbuf_pars_vertex>
      void main(){ vDir = normalize(position); vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv;
      #include <logdepthbuf_vertex>
      }`,
    fragmentShader: `uniform float uK; uniform vec3 uSun; varying vec3 vDir;
      #include <logdepthbuf_pars_fragment>
      void main(){
      #include <logdepthbuf_fragment>
        float h = vDir.y;
        vec3 zen = mix(vec3(0.16,0.38,0.78), vec3(0.0,0.0,0.015), pow(uK,0.55));
        vec3 hor = mix(vec3(0.74,0.84,0.95), vec3(0.05,0.08,0.16), pow(uK,0.7));
        vec3 c = mix(hor, zen, pow(clamp(h,0.0,1.0), 0.45));
        c = mix(c, hor * 0.8, clamp(-h * 4.0, 0.0, 1.0));
        float sd = max(dot(normalize(vDir), uSun), 0.0);
        c += vec3(1.0,0.92,0.75) * (pow(sd, 900.0) * 6.0 + pow(sd, 18.0) * 0.25 * (1.0 - uK * 0.8));
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const s = new THREE.Mesh(new THREE.SphereGeometry(3.4e6, 48, 24), m);
  s.renderOrder = -10; s.frustumCulled = false;
  return s;
}

// ---------- parachute ----------
function goreTex(color) {
  const [c, g] = canvas(1024, 128);
  const gores = 16;
  for (let i = 0; i < gores; i++) {
    g.fillStyle = i % 2 ? '#f4f1ea' : color; g.fillRect(i * 1024 / gores, 0, 1024 / gores, 128);
    g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(i * 1024 / gores, 0, 2, 128);
  }
  g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, 118, 1024, 10);
  return tex(c, false);
}
export class Parachute {
  constructor(scene) {
    const prof = [];
    for (let i = 0; i <= 18; i++) { const t = i / 18, th = t * Math.PI / 2; prof.push(new THREE.Vector2(0.09 + 0.91 * Math.sin(th), 0.6 * Math.cos(th) - (t > 0.92 ? (t - 0.92) * 0.6 : 0))); }
    const geo = new THREE.LatheGeometry(prof, 48);
    this.mat = new THREE.MeshStandardMaterial({ map: goreTex('#ff5a1f'), side: THREE.DoubleSide, roughness: 0.85, metalness: 0 });
    this.canopy = new THREE.Mesh(geo, this.mat); this.canopy.castShadow = true;
    this.group = new THREE.Group(); this.group.add(this.canopy); this.group.visible = false;
    const n = 16; this.n = n;
    this.lineGeo = new THREE.BufferGeometry(); this.lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 2 * 3), 3));
    this.lines = new THREE.LineSegments(this.lineGeo, new THREE.LineBasicMaterial({ color: 0xd9d4c7, transparent: true, opacity: 0.85 }));
    this.lines.frustumCulled = false; this.lines.visible = false;
    scene.add(this.group); scene.add(this.lines);
    this.t = 0; this.collapse = 0;
  }
  // attach: rocket top in local frame; dir: unit vector pointing up the riser (against the airflow)
  update(dt, show, attach, dir, area, frac, landed, groundY) {
    this.group.visible = this.lines.visible = show;
    if (!show) { this.collapse = 0; return 0; }
    this.t += dt;
    if (landed) this.collapse = Math.min(1, this.collapse + dt * 0.6);
    const D = Math.sqrt(4 * area / Math.PI);           // real canopy diameter
    const infl = frac * frac * (3 - 2 * frac);
    const radius = D / 2 * (0.1 + 0.9 * infl) * (1 + Math.sin(this.t * 2.6) * 0.025 * infl) * (1 - this.collapse * 0.6);
    const riser = D * 1.15 * (0.35 + 0.65 * Math.min(1, frac * 2));
    // pendulum sway
    const sway = new THREE.Vector3(Math.sin(this.t * 0.83) * 0.07, 0, Math.cos(this.t * 0.61) * 0.07);
    const d = dir.clone().add(sway).normalize();
    let skirt = attach.clone().addScaledVector(d, riser);
    if (this.collapse > 0) { skirt.lerp(new THREE.Vector3(attach.x + D * 0.8, groundY + 0.5, attach.z), this.collapse); }
    this.group.position.copy(skirt);
    this.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.collapse > 0 ? d.clone().lerp(new THREE.Vector3(1, 0, 0), this.collapse).normalize() : d);
    this.canopy.scale.set(radius, radius * (0.55 + 0.45 * infl) * (1 - this.collapse * 0.8), radius);
    this.canopy.rotation.y = this.t * 0.15;
    // suspension lines from the skirt to the attach point
    const pos = this.lineGeo.attributes.position.array;
    const m = new THREE.Matrix4().compose(skirt, this.group.quaternion, new THREE.Vector3(1, 1, 1));
    for (let i = 0; i < this.n; i++) {
      const a = i / this.n * Math.PI * 2 + this.canopy.rotation.y;
      const p = new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius).applyMatrix4(m);
      pos.set([p.x, p.y, p.z, attach.x, attach.y, attach.z], i * 6);
    }
    this.lineGeo.attributes.position.needsUpdate = true;
    return D;
  }
}
