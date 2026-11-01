// The shrinking storm. Phases come from the match mode.
import * as THREE from '../vendor/three.module.min.js';
import { shoreDist } from './world.js';

export class Zone {
  constructor(scene, phases, rng) {
    this.scene = scene;
    this.phases = phases;
    this.rng = rng;
    this.cx = 0; this.cz = 0; this.r = 215;
    this.fromX = 0; this.fromZ = 0; this.fromR = 215;
    this.phase = 0;
    this.state = 'idle';
    this.timer = 0;
    this.active = false;
    this.pickNext();

    this.wall = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 40, 96, 1, true),
      new THREE.MeshBasicMaterial({ color: '#9b4dff', transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false }),
    );
    this.wall.position.y = 18;
    scene.add(this.wall);
    this.edge = new THREE.Mesh(new THREE.RingGeometry(0.985, 1, 128), new THREE.MeshBasicMaterial({ color: '#d7a8ff', transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
    this.edge.rotation.x = -Math.PI / 2;
    this.edge.position.y = 0.15;
    scene.add(this.edge);
    this.nextRing = new THREE.Mesh(new THREE.RingGeometry(0.99, 1, 128), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false }));
    this.nextRing.rotation.x = -Math.PI / 2;
    this.nextRing.position.y = 0.18;
    scene.add(this.nextRing);
    this.syncMeshes();
  }

  dispose() { this.scene.remove(this.wall, this.edge, this.nextRing); }

  pickNext() {
    const p = this.phases[this.phase];
    if (!p) { this.nx = this.cx; this.nz = this.cz; this.nr = 0; return; }
    const target = p[2];
    // a new centre fully inside the current circle and on land
    for (let i = 0; i < 40; i++) {
      const maxOff = Math.max(0, (this.phase === 0 ? 90 : this.r) - target);
      const a = this.rng() * Math.PI * 2, d = Math.sqrt(this.rng()) * maxOff * 0.85;
      const x = this.cx + Math.cos(a) * d, z = this.cz + Math.sin(a) * d;
      if (shoreDist(x, z) > 25 || target > 60) { this.nx = x; this.nz = z; this.nr = target; return; }
    }
    this.nx = this.cx; this.nz = this.cz; this.nr = target;
  }

  start() {
    this.active = true;
    this.state = 'wait';
    this.timer = this.phases[0][0];
  }

  get dps() {
    const p = this.phases[Math.min(this.phase, this.phases.length - 1)];
    return p ? p[3] : 20;
  }

  // Returns an event string when something changes, for HUD banners.
  update(dt) {
    if (!this.active) return null;
    let ev = null;
    this.timer -= dt;
    if (this.state === 'wait') {
      if (this.timer <= 0) {
        this.state = 'shrink';
        this.timer = this.phases[this.phase][1];
        this.shrinkDur = this.timer;
        this.fromX = this.cx; this.fromZ = this.cz; this.fromR = this.r;
        ev = 'shrink';
      }
    } else if (this.state === 'shrink') {
      const k = 1 - Math.max(0, this.timer) / this.shrinkDur;
      this.cx = this.fromX + (this.nx - this.fromX) * k;
      this.cz = this.fromZ + (this.nz - this.fromZ) * k;
      this.r = this.fromR + (this.nr - this.fromR) * k;
      if (this.timer <= 0) {
        this.cx = this.nx; this.cz = this.nz; this.r = this.nr;
        this.phase++;
        if (this.phase >= this.phases.length) { this.state = 'done'; ev = 'final'; }
        else {
          this.state = 'wait';
          this.timer = this.phases[this.phase][0];
          this.pickNext();
          ev = 'wait';
        }
      }
    }
    this.syncMeshes();
    return ev;
  }

  syncMeshes() {
    this.wall.visible = this.edge.visible = this.active;
    const r = Math.max(0.01, this.r);
    this.wall.scale.set(r, 1, r);
    this.wall.position.x = this.cx; this.wall.position.z = this.cz;
    this.edge.scale.set(r, r, 1);
    this.edge.position.x = this.cx; this.edge.position.z = this.cz;
    this.nextRing.visible = this.active && this.state !== 'done' && this.nr > 0;
    this.nextRing.scale.set(Math.max(0.01, this.nr), Math.max(0.01, this.nr), 1);
    this.nextRing.position.x = this.nx; this.nextRing.position.z = this.nz;
  }

  outside(x, z, margin = 0) { return Math.hypot(x - this.cx, z - this.cz) > this.r - margin; }
  outsideNext(x, z, margin = 0) { return Math.hypot(x - this.nx, z - this.nz) > this.nr - margin; }
  timeLeft() { return Math.max(0, this.timer); }
}
