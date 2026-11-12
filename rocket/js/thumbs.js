// Studio renders of parts and whole rockets for the shop, blueprint editor and reviews.
// One small offscreen WebGL renderer draws each part from its real 3D model with
// studio lighting and reflections; the results are cached as image URLs.
import * as THREE from '../vendor/three.module.min.js';
import { partMesh, rocketMesh } from './models.js';
import { PART } from './data.js';

let R = null, scene, cam, envTex, shadow;
const cache = new Map();

// A soft reflection environment: gradient dome + bright softbox panels.
export function makeEnv(renderer) {
  const s = new THREE.Scene();
  const dome = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: 'varying vec3 p; void main(){ p=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'varying vec3 p; void main(){ float h=normalize(p).y; vec3 top=vec3(0.75,0.78,0.82), mid=vec3(0.32,0.34,0.37), bot=vec3(0.08,0.08,0.09); vec3 c = h>0. ? mix(mid,top,pow(h,0.7)) : mix(mid,bot,pow(-h,0.5)); gl_FragColor=vec4(c,1.); }',
  }));
  s.add(dome);
  const panel = (w, hh, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k * 0.97), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  panel(10, 4, -8, 9, 6, 6); panel(6, 12, 12, 3, -4, 3.5); panel(14, 2, 0, 14, -8, 4);
  const pm = new THREE.PMREMGenerator(renderer);
  const t = pm.fromScene(s, 0.03).texture; pm.dispose();
  return t;
}

function init() {
  const c = document.createElement('canvas');
  R = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1);
  R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.15;
  R.outputColorSpace = THREE.SRGBColorSpace;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene();
  envTex = makeEnv(R);
  scene.environment = envTex;
  const key = new THREE.DirectionalLight(0xfff3e0, 2.2); key.position.set(-3, 5, 4); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 0.1, far: 30 }); key.shadow.radius = 6;
  scene.add(key); scene.userData.key = key;
  const rim = new THREE.DirectionalLight(0x9ccfff, 1.6); rim.position.set(4, 3, -5); scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xdfe7f0, 0x2a2a2a, 0.5));
  // soft contact shadow on an invisible floor
  shadow = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.35 }));
  shadow.rotation.x = -Math.PI / 2; shadow.receiveShadow = true; scene.add(shadow);
  cam = new THREE.PerspectiveCamera(28, 1, 0.05, 200);
}

function shoot(obj, w, h, { az = 0.62, el = 0.32, pad = 1.18 } = {}) {
  if (!R) init();
  R.setSize(w, h, false);
  obj.traverse(o => { if (o.isMesh) { o.castShadow = true; } });
  scene.add(obj);
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3()), ctr = box.getCenter(new THREE.Vector3());
  shadow.position.y = box.min.y - 0.002;
  cam.aspect = w / h; cam.updateProjectionMatrix();
  // distance so that both the height and the width fit the frame
  const vf = THREE.MathUtils.degToRad(cam.fov);
  const hf = 2 * Math.atan(Math.tan(vf / 2) * cam.aspect);
  const rad = Math.max(size.x, size.z) * 0.5;
  const dist = Math.max((size.y * 0.5 + rad * Math.sin(el)) / Math.tan(vf / 2), rad * 1.4 / Math.tan(hf / 2)) * pad + rad;
  cam.position.set(ctr.x + Math.sin(az) * Math.cos(el) * dist, ctr.y + Math.sin(el) * dist, ctr.z + Math.cos(az) * Math.cos(el) * dist);
  cam.lookAt(ctr);
  const k = scene.userData.key; k.target.position.copy(ctr); k.position.copy(ctr).add(new THREE.Vector3(-3, 5, 4).multiplyScalar(Math.max(1, size.y)));
  k.target.updateMatrixWorld(); k.shadow.camera.updateProjectionMatrix();
  R.render(scene, cam);
  const url = R.domElement.toDataURL('image/png');
  scene.remove(obj);
  obj.traverse(o => { if (o.isMesh) o.geometry.dispose(); });
  return url;
}

// Image URL of one part (worn parts look worn).
export function partThumb(def, worn = false, size = 160) {
  const key = def.id + (worn ? ':w' : '') + ':' + size;
  if (!cache.has(key)) cache.set(key, shoot(partMesh(def, worn ? 0.3 : 1), size, size));
  return cache.get(key);
}

// Image URL of a whole stack (ids top -> bottom).
export function rocketThumb(ids, w = 200, h = 360) {
  const key = ids.join(',') + ':' + w + 'x' + h;
  if (!cache.has(key)) {
    if (cache.size > 300) cache.clear();
    const g = rocketMesh(ids.map(id => PART[id]));
    cache.set(key, shoot(g, w, h, { az: 0.5, el: 0.12, pad: 1.05 }));
  }
  return cache.get(key);
}
