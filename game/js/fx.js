// Visual effects: pooled particles, bullet tracers, explosions, shockwaves,
// floating damage numbers and screen shake.
import * as THREE from '../vendor/three.module.min.js';

const MAX_P = 900;
const MAX_T = 320;

export class FX {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    // particles
    this.pMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.6, emissive: '#000000' }), MAX_P);
    this.pMesh.frustumCulled = false;
    this.pMesh.castShadow = false;
    this.pMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.particles = [];
    for (let i = 0; i < MAX_P; i++) this.particles.push({ life: 0 });
    this.pMesh.setColorAt(0, new THREE.Color('#fff'));
    scene.add(this.pMesh);
    this.pNext = 0;
    // tracers
    this.tMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: '#fff6b0', transparent: true, opacity: 0.95 }), MAX_T);
    this.tMesh.frustumCulled = false;
    this.tMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.tMesh.setColorAt(0, new THREE.Color('#fff'));
    scene.add(this.tMesh);
    // shockwave rings
    this.rings = [];
    for (let i = 0; i < 8; i++) {
      const r = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 32), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
      r.rotation.x = -Math.PI / 2;
      r.visible = false;
      scene.add(r);
      this.rings.push({ mesh: r, life: 0 });
    }
    // damage numbers (DOM)
    this.numLayer = document.getElementById('dmg-layer');
    this.nums = [];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement('div');
      el.className = 'dmg-num';
      el.style.display = 'none';
      this.numLayer.appendChild(el);
      this.nums.push({ el, life: 0, x: 0, y: 0, z: 0 });
    }
    this.numNext = 0;
    this.shake = 0;
    this._m = new THREE.Matrix4();
    this._q = new THREE.Quaternion();
    this._v = new THREE.Vector3();
    this._s = new THREE.Vector3();
    this._c = new THREE.Color();
    this.camDir = new THREE.Vector3();
  }

  clear() {
    for (const p of this.particles) p.life = 0;
    for (const n of this.nums) { n.life = 0; n.el.style.display = 'none'; }
    for (const r of this.rings) { r.life = 0; r.mesh.visible = false; }
    this.shake = 0;
  }

  spawn(x, y, z, vx, vy, vz, life, size, color, gravity = -18, glow = false) {
    const p = this.particles[this.pNext];
    this.pNext = (this.pNext + 1) % MAX_P;
    p.x = x; p.y = y; p.z = z; p.vx = vx; p.vy = vy; p.vz = vz;
    p.life = life; p.max = life; p.size = size; p.g = gravity;
    p.color = color; p.glow = glow; p.rot = Math.random() * 6;
    p.colorDirty = true;
  }

  burst(x, y, z, n, color, speed = 4, size = 0.12, life = 0.5, gravity = -18) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, u = Math.random();
      this.spawn(x, y, z, Math.cos(a) * speed * u, speed * (0.4 + Math.random() * 0.8), Math.sin(a) * speed * u, life * (0.6 + Math.random() * 0.6), size * (0.6 + Math.random() * 0.8), color, gravity);
    }
  }

  impact(x, z, nx, nz, color = '#d8cfc0') {
    for (let i = 0; i < 5; i++) {
      this.spawn(x, 1.1, z, nx * 3 + (Math.random() - 0.5) * 3, 1 + Math.random() * 2, nz * 3 + (Math.random() - 0.5) * 3, 0.35, 0.07, color, -14);
    }
    this.spawn(x, 1.1, z, 0, 0, 0, 0.08, 0.18, '#fff6b0', 0);
  }

  hitPuff(x, z, armor) {
    this.burst(x, 1.1, z, 7, armor ? '#7fc3ff' : '#ff5d7a', 5, 0.12, 0.4);
  }

  muzzle(x, z, dirX, dirZ) {
    for (let i = 0; i < 3; i++) {
      this.spawn(x + dirX * 0.2, 1.1, z + dirZ * 0.2, dirX * 5 + (Math.random() - 0.5) * 2, 0.5, dirZ * 5 + (Math.random() - 0.5) * 2, 0.12, 0.08, '#ffd27a', 0);
    }
  }

  dust(x, z) {
    this.spawn(x + (Math.random() - 0.5) * 0.4, 0.15, z + (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.6, 0.6, (Math.random() - 0.5) * 0.6, 0.45, 0.12, '#e8e0cf', -1);
  }

  explosion(x, z, radius) {
    this.burst(x, 0.6, z, 26, '#ffb320', 9, 0.3, 0.6, -6);
    this.burst(x, 0.6, z, 18, '#ff5d3a', 7, 0.26, 0.5, -6);
    this.burst(x, 0.6, z, 16, '#555560', 4, 0.4, 1.1, 2);
    this.ring(x, z, radius, '#fff1b0');
  }

  confetti(x, z) {
    const cols = ['#ffd23f', '#ff4f8b', '#2ed3b7', '#8c5cff', '#3fb8ff'];
    for (let i = 0; i < 30; i++) {
      const a = Math.random() * Math.PI * 2;
      this.spawn(x, 1.2, z, Math.cos(a) * 4 * Math.random(), 5 + Math.random() * 4, Math.sin(a) * 4 * Math.random(), 1.2, 0.1, cols[i % 5], -12);
    }
    this.ring(x, z, 3, '#ffffff');
  }

  ring(x, z, radius, color) {
    const r = this.rings.find((q) => q.life <= 0) || this.rings[0];
    r.life = 0.45; r.max = 0.45; r.radius = radius;
    r.mesh.position.set(x, 0.2, z);
    r.mesh.material.color.set(color);
    r.mesh.visible = true;
  }

  damageNumber(x, z, amount, crit, armor) {
    const n = this.nums[this.numNext];
    this.numNext = (this.numNext + 1) % this.nums.length;
    n.life = 0.8; n.x = x + (Math.random() - 0.5) * 0.6; n.y = 2.2; n.z = z;
    n.el.textContent = Math.round(amount);
    n.el.className = 'dmg-num' + (crit ? ' crit' : '') + (armor ? ' armor' : '');
    n.el.style.display = 'block';
  }

  addShake(a) { this.shake = Math.min(1.2, this.shake + a); }

  update(dt, tracers) {
    // particles
    const m = this._m, q = this._q, v = this._v, s = this._s;
    let n = 0;
    for (const p of this.particles) {
      if (p.life <= 0) continue;
      p.life -= dt;
      if (p.life <= 0) continue;
      p.vy += p.g * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      if (p.y < 0.05) { p.y = 0.05; p.vy *= -0.3; p.vx *= 0.7; p.vz *= 0.7; }
      p.rot += dt * 4;
      const k = p.size * Math.min(1, (p.life / p.max) * 2);
      q.setFromAxisAngle(v.set(0.3, 1, 0.2).normalize(), p.rot);
      m.compose(v.set(p.x, p.y, p.z), q, s.set(k, k, k));
      this.pMesh.setMatrixAt(n, m);
      this.pMesh.setColorAt(n, this._c.set(p.color));
      n++;
    }
    this.pMesh.count = n;
    this.pMesh.instanceMatrix.needsUpdate = true;
    if (this.pMesh.instanceColor) this.pMesh.instanceColor.needsUpdate = true;

    // tracers: list of { x, z, dx, dz, len, color }
    let t = 0;
    const up = v.set(0, 1, 0);
    for (const tr of tracers) {
      if (t >= MAX_T) break;
      const ang = Math.atan2(tr.dx, tr.dz);
      q.setFromAxisAngle(up, ang);
      m.compose(this._s.set(tr.x - tr.dx * tr.len * 0.5, 1.1, tr.z - tr.dz * tr.len * 0.5), q, new THREE.Vector3(tr.w, tr.w, tr.len));
      this.tMesh.setMatrixAt(t, m);
      this.tMesh.setColorAt(t, this._c.set(tr.color));
      t++;
      up.set(0, 1, 0);
    }
    this.tMesh.count = t;
    this.tMesh.instanceMatrix.needsUpdate = true;
    if (this.tMesh.instanceColor) this.tMesh.instanceColor.needsUpdate = true;

    for (const r of this.rings) {
      if (r.life <= 0) continue;
      r.life -= dt;
      const k = 1 - r.life / r.max;
      r.mesh.scale.setScalar(0.5 + k * r.radius);
      r.mesh.material.opacity = (1 - k) * 0.8;
      if (r.life <= 0) r.mesh.visible = false;
    }
    this.shake = Math.max(0, this.shake - dt * 2.5);
  }

  // Project floating numbers to screen space (after camera update).
  updateNumbers(dt, w, h) {
    for (const n of this.nums) {
      if (n.life <= 0) continue;
      n.life -= dt;
      if (n.life <= 0) { n.el.style.display = 'none'; continue; }
      n.y += dt * 1.6;
      this._v.set(n.x, n.y, n.z).project(this.camera);
      const sx = (this._v.x * 0.5 + 0.5) * w, sy = (-this._v.y * 0.5 + 0.5) * h;
      n.el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%) scale(${0.8 + n.life * 0.5})`;
      n.el.style.opacity = Math.min(1, n.life * 3);
    }
  }
}
