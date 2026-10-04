// A three.js viewer: orbit, studio light presets, fit-to-view, and the
// inspection modes 3D sites offer (textured, clay, wireframe, normals).

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const VIEW_MODES = { textured: 'Textured', clay: 'Clay', wireframe: 'Wireframe', normals: 'Normals' };
export const LIGHTS = { studio: 'Studio', warm: 'Warm', rim: 'Rim' };

const LIGHT_PRESETS = {
  studio: { key: [0xffffff, 1.6, [2, 4, 3]], fill: [0xdde6ea, 0x2a3236, 0.6], env: 0.7, exposure: 1 },
  warm: { key: [0xffd2a1, 2.0, [-3, 3, 2]], fill: [0xffe7cc, 0x3a2a22, 0.45], env: 0.55, exposure: 1.05 },
  rim: { key: [0x9fc6ff, 2.4, [-1.5, 2.5, -3]], fill: [0x8fa3b8, 0x101418, 0.35], env: 0.35, exposure: 1.1 },
};

export function createViewer(container, { autoRotate = true, zoom = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
  camera.position.set(0, 0.4, 3);

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 4;
  const fill = new THREE.HemisphereLight(0xdde6ea, 0x2a3236, 0.6);
  scene.add(key, fill);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.25 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = zoom;
  controls.enablePan = false;
  controls.autoRotate = autoRotate && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.autoRotateSpeed = 1.2;

  let current = null;
  let mode = 'textured';
  const loader = new GLTFLoader();
  const clay = new THREE.MeshStandardMaterial({ color: 0xb9b2a7, roughness: 0.9 });
  const normals = new THREE.MeshNormalMaterial();
  const wire = new THREE.MeshBasicMaterial({ color: 0xdfe6ea, wireframe: true, transparent: true, opacity: 0.55 });

  function setLighting(name) {
    const p = LIGHT_PRESETS[name] || LIGHT_PRESETS.studio;
    key.color.set(p.key[0]); key.intensity = p.key[1]; key.position.set(...p.key[2]);
    fill.color.set(p.fill[0]); fill.groundColor.set(p.fill[1]); fill.intensity = p.fill[2];
    scene.environmentIntensity = p.env;
    renderer.toneMappingExposure = p.exposure;
  }
  setLighting('studio');

  function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  function applyMode() {
    current?.traverse(o => {
      if (!o.isMesh) return;
      o.userData.original ??= o.material;
      o.material = mode === 'clay' ? clay : mode === 'normals' ? normals : mode === 'wireframe' ? wire : o.userData.original;
    });
  }

  // Scale to a 1.6-unit box, stand it on the ground, frame it.
  function setObject(obj, { keepCamera = false } = {}) {
    if (current) scene.remove(current);
    current = obj;
    obj.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    obj.scale.multiplyScalar(1.6 / Math.max(size.x, size.y, size.z || 1e-6));
    box.setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    obj.position.x -= center.x;
    obj.position.z -= center.z;
    obj.position.y -= box.min.y;
    scene.add(obj);
    applyMode();
    if (!keepCamera) {
      const h = box.max.y - box.min.y;
      controls.target.set(0, h / 2, 0);
      camera.position.set(0.9, h * 0.75, 3.3);
      controls.update();
    }
  }

  async function load(url) {
    const gltf = await loader.loadAsync(url);
    setObject(gltf.scene);
    return gltf.scene;
  }

  function setMode(m) { mode = m; applyMode(); }

  // A PNG of the current view, optionally square-cropped and resized.
  function snapshot(size) {
    renderer.render(scene, camera);
    if (!size) return renderer.domElement.toDataURL('image/png');
    const src = renderer.domElement, s = Math.min(src.width, src.height);
    const c = document.createElement('canvas');
    c.width = c.height = size;
    c.getContext('2d').drawImage(src, (src.width - s) / 2, (src.height - s) / 2, s, s, 0, 0, size, size);
    return c.toDataURL('image/jpeg', 0.82);
  }

  let raf;
  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(container);
  (function tick() {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    controls.update();
    renderer.render(scene, camera);
  })();

  function dispose() {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    controls.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  }

  return {
    scene, camera, controls, renderer, setObject, load, dispose, setMode, setLighting, snapshot,
    resetView() { if (current) setObject(current); },
    get object() { return current; },
  };
}
