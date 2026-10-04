import * as THREE from 'three';
import { mountShell, api, esc, timeAgo } from './shell.js';
import { createViewer } from './viewer.js';

mountShell();

// The hero elephant, modelled from primitives so the page needs no asset.
function elephant() {
  const clay = new THREE.MeshStandardMaterial({ color: 0x7c8287, roughness: 0.82 });
  const ivory = new THREE.MeshStandardMaterial({ color: 0xf1ede4, roughness: 0.45 });
  const ink = new THREE.MeshStandardMaterial({ color: 0x15191c, roughness: 0.25 });
  const g = new THREE.Group();
  const add = (geo, mat, [x, y, z], [sx, sy, sz] = [1, 1, 1], rot = [0, 0, 0]) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.set(...rot);
    g.add(m); return m;
  };
  const sphere = new THREE.SphereGeometry(1, 48, 32);

  add(sphere, clay, [0, 0.95, -0.1], [0.78, 0.68, 0.92]);                 // body
  add(sphere, clay, [0, 1.62, 0.45], [0.72, 0.66, 0.66]);                  // head
  for (const s of [-1, 1]) {
    add(sphere, clay, [s * 0.78, 1.62, 0.2], [0.5, 0.58, 0.09], [0, s * -0.45, s * 0.12]); // ears
    add(new THREE.CylinderGeometry(0.2, 0.23, 0.7, 32), clay, [s * 0.36, 0.35, 0.32]);    // front legs
    add(new THREE.CylinderGeometry(0.2, 0.23, 0.7, 32), clay, [s * 0.36, 0.35, -0.5]);    // back legs
    add(sphere, clay, [s * 0.36, 0.03, 0.34], [0.24, 0.09, 0.25]);                         // feet
    add(sphere, clay, [s * 0.36, 0.03, -0.48], [0.24, 0.09, 0.25]);
    add(sphere, ink, [s * 0.27, 1.72, 1.0], [0.085, 0.1, 0.06]);                           // eyes
    add(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff }), [s * 0.25, 1.75, 1.05], [0.022, 0.022, 0.02]);
    add(new THREE.ConeGeometry(0.05, 0.32, 24), ivory, [s * 0.2, 1.17, 0.98], [1, 1, 1], [2.3, 0, s * 0.25]); // tusks
  }
  // Trunk: a tapering tube curling forward at the tip.
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.48, 0.98), new THREE.Vector3(0, 1.1, 1.13),
    new THREE.Vector3(0, 0.72, 1.12), new THREE.Vector3(0, 0.5, 1.22), new THREE.Vector3(0, 0.46, 1.34),
  ]);
  const tube = new THREE.TubeGeometry(curve, 64, 1, 24, false);
  const p = tube.attributes.position, n = tube.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    const t = Math.floor(i / 25) / 64;
    const r = 0.2 - 0.11 * t;
    const c = curve.getPoint(t);
    p.setXYZ(i, c.x + n.getX(i) * r, c.y + n.getY(i) * r, c.z + n.getZ(i) * r);
  }
  tube.computeVertexNormals();
  g.add(new THREE.Mesh(tube, clay));
  add(sphere, clay, [0, 0.46, 1.34], [0.09, 0.09, 0.09]);
  add(new THREE.CylinderGeometry(0.025, 0.04, 0.5, 12), clay, [0, 0.95, -1.0], [1, 1, 1], [0.5, 0, 0]); // tail
  return g;
}

const v = createViewer(document.getElementById('stage'), { zoom: false });
v.controls.autoRotateSpeed = 0.6;
v.controls.minPolarAngle = v.controls.maxPolarAngle = Math.PI / 2.2;
v.setObject(elephant());
v.camera.position.set(2.2, 1.0, 2.6);
v.controls.update();

// Fill the bottom strip from the user's own work.
try {
  const [gens, models] = await Promise.all([api('generations'), api('models')]);
  const done = gens.filter(g => g.status === 'done');
  const byId = Object.fromEntries(models.map(m => [m.id, m]));
  done.slice(0, 2).forEach((g, i) => {
    document.getElementById(`latest-${i + 1}`).innerHTML = `
      <div class="label">${i ? '&nbsp;' : 'LATEST'}</div>
      <div class="title">${esc(g.name || byId[g.modelId]?.name || 'Untitled')}</div>
      <div class="sub">${esc(g.armLabel)} · ${timeAgo(g.createdAt)}</div>`;
  });
  if (done[0]) document.getElementById('latest-pic').innerHTML = `<img src="${esc(done[0].image)}" alt="Source image of the latest generation">`;
  const trained = models.filter(m => m.rated).sort((a, b) => b.rated - a.rated)[0];
  if (trained) {
    document.getElementById('news').innerHTML = `
      <div class="label">BEST SETTINGS · ${esc(trained.name)}</div>
      <div class="title">${esc(trained.best.label)}</div>
      <div class="sub">${Math.round(trained.best.mean * 100)}% expected score · ${trained.rated} ratings</div>`;
  }
} catch { /* the strip keeps its placeholder text */ }
