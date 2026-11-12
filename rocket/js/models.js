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

const SEG = 20;
// Builds a mesh group for one part. Origin at the bottom centre, +y up, height = def.h.
export function partMesh(def, cond = 1) {
  const g = new THREE.Group();
  const { h, r } = def;
  const worn = cond < 0.6;
  const base = mat(def.color, worn ? { roughness: 0.9, metalness: 0.1 } : {});
  const dark = mat(0x2b2f36);
  const metal = mat(0xa1a1aa, { metalness: 0.8, roughness: 0.3 });
  const add = (geo, m, y = 0, x = 0, z = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };

  switch (def.shape) {
    case 'probe': {
      add(new THREE.CylinderGeometry(r * 0.75, r, h * 0.7, 8), base, h * 0.35);
      add(new THREE.CylinderGeometry(r * 0.3, r * 0.75, h * 0.3, 8), dark, h * 0.85);
      add(new THREE.SphereGeometry(r * 0.12, 8, 6), mat(0x22d3ee, { emissive: 0x22d3ee, emissiveIntensity: 1.5 }), h * 0.5, 0, r * 0.82);
      break;
    }
    case 'capsule': {
      add(new THREE.CylinderGeometry(r * 0.35, r, h * 0.85, SEG), base, h * 0.425);
      add(new THREE.CylinderGeometry(r * 0.25, r * 0.35, h * 0.15, SEG), dark, h * 0.925);
      const win = add(new THREE.BoxGeometry(r * 0.35, h * 0.18, 0.05), mat(0x0c4a6e, { metalness: 0.9, roughness: 0.1 }), h * 0.5, 0, r * 0.7);
      win.rotation.x = -0.35;
      break;
    }
    case 'cone': add(new THREE.ConeGeometry(r, h, SEG), base, h / 2); break;
    case 'tank': {
      add(new THREE.CylinderGeometry(r, r, h, SEG), base, h / 2);
      for (const y of [0.04, h - 0.04]) add(new THREE.CylinderGeometry(r * 1.02, r * 1.02, 0.08, SEG), dark, y);
      if (h > 1.5) add(new THREE.CylinderGeometry(r * 1.01, r * 1.01, 0.12, SEG), mat(def.color === 0x1f2937 ? 0xf97316 : 0x1d4ed8), h * 0.62);
      break;
    }
    case 'engine': {
      add(new THREE.CylinderGeometry(r * 0.9, r * 0.7, h * 0.45, 12), dark, h * 0.775);
      add(new THREE.CylinderGeometry(r * 0.35, r * 0.95, h * 0.55, 16, 1, true), metal, h * 0.275).material = mat(0x71717a, { metalness: 0.85, roughness: 0.35, side: THREE.DoubleSide });
      break;
    }
    case 'vacengine': {
      add(new THREE.CylinderGeometry(r * 0.6, r * 0.5, h * 0.3, 12), dark, h * 0.85);
      add(new THREE.CylinderGeometry(r * 0.25, r, h * 0.7, 18, 1, true), mat(0x9a3412, { metalness: 0.7, roughness: 0.4, side: THREE.DoubleSide }), h * 0.35);
      break;
    }
    case 'srb': {
      add(new THREE.CylinderGeometry(r, r, h * 0.82, 14), base, h * 0.5);
      add(new THREE.ConeGeometry(r, h * 0.1, 14), base, h * 0.96);
      add(new THREE.CylinderGeometry(r * 0.5, r * 0.8, h * 0.09, 12), dark, h * 0.045);
      add(new THREE.CylinderGeometry(r * 1.01, r * 1.01, h * 0.08, 14), mat(0xdc2626), h * 0.7);
      break;
    }
    case 'decoupler': {
      const m = new THREE.MeshStandardMaterial({ map: stripes(), roughness: 0.6 });
      add(new THREE.CylinderGeometry(r, r, h, SEG), m, h / 2);
      break;
    }
    case 'ring': add(new THREE.CylinderGeometry(r, r, h, SEG), base, h / 2); add(new THREE.TorusGeometry(r, 0.06, 6, SEG), metal, h / 2).rotation.x = Math.PI / 2; break;
    case 'battery': add(new THREE.CylinderGeometry(r, r, h, SEG), mat(0x1f2937), h / 2); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; add(new THREE.BoxGeometry(0.18, h * 0.8, 0.08), base, h / 2, Math.cos(a) * r, Math.sin(a) * r).rotation.y = -a; } break;
    case 'box': add(new THREE.CylinderGeometry(r * 0.8, r * 0.8, h, 8), dark, h / 2); add(new THREE.BoxGeometry(r * 0.8, h * 0.7, r * 0.5), base, h / 2, 0, r * 0.6); break;
    case 'chute': {
      add(new THREE.CylinderGeometry(r, r, h * 0.6, SEG), dark, h * 0.3);
      add(new THREE.SphereGeometry(r, SEG, 8, 0, Math.PI * 2, 0, Math.PI / 2), base, h * 0.6).scale.y = 0.65;
      break;
    }
    case 'legs': {
      add(new THREE.CylinderGeometry(r * 0.75, r * 0.75, h, 12), dark, h / 2);
      for (let i = 0; i < 4; i++) {
        const a = i / 4 * Math.PI * 2 + Math.PI / 4;
        const leg = new THREE.Group(); leg.position.set(Math.cos(a) * r * 0.75, h * 0.9, Math.sin(a) * r * 0.75); leg.rotation.y = -a;
        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.08, h * 1.3, 0.08), base); strut.position.set(r * 0.25, -h * 0.55, 0); strut.rotation.z = 0.45; strut.castShadow = true; leg.add(strut);
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.06, 8), metal); foot.position.set(r * 0.55, -h * 1.12, 0); leg.add(foot);
        g.add(leg);
      }
      break;
    }
    case 'shield': add(new THREE.CylinderGeometry(r, r * 0.92, h, SEG), base, h / 2); add(new THREE.CylinderGeometry(r * 0.9, r * 0.9, 0.02, SEG), mat(0x7c2d12), 0.005); break;
    case 'fins': {
      add(new THREE.CylinderGeometry(r * 0.55, r * 0.55, h, 12), mat(0xe5e7eb), h / 2);
      for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2; const f = add(new THREE.BoxGeometry(0.05, h, r * 0.9), base, h / 2, Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85); f.rotation.y = -a + Math.PI / 2; }
      break;
    }
    case 'gridfins': {
      add(new THREE.CylinderGeometry(r * 0.6, r * 0.6, h, 14), dark, h / 2);
      for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2; const f = add(new THREE.BoxGeometry(0.35, h * 0.8, 0.1), base, h / 2, Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85); f.rotation.y = -a; }
      break;
    }
    case 'pod': {
      add(new THREE.CylinderGeometry(r, r, h, 12), mat(0xd4d4d8), h / 2);
      add(new THREE.BoxGeometry(r * 0.6, h * 0.6, 0.1), base, h / 2, 0, r * 0.98);
      add(new THREE.SphereGeometry(r * 0.15, 8, 6), mat(0xffffff, { emissive: def.color, emissiveIntensity: 0.8 }), h / 2, r * 0.7, r * 0.7);
      break;
    }
    case 'sat': {
      add(new THREE.CylinderGeometry(r, r, h, 6), base, h / 2).material = mat(def.color, { metalness: 0.9, roughness: 0.25 });
      add(new THREE.BoxGeometry(0.05, h * 0.7, r * 1.4), mat(0x1e3a8a, { metalness: 0.6, roughness: 0.2 }), h / 2, r * 0.95, 0);
      add(new THREE.BoxGeometry(0.05, h * 0.7, r * 1.4), mat(0x1e3a8a, { metalness: 0.6, roughness: 0.2 }), h / 2, -r * 0.95, 0);
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
