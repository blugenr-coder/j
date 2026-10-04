// Copy check and auto-copy: how closely does the 3D model reproduce the
// pictures it came from, and which settings make it closer?
//
// The model is rendered from the same viewpoints as the photos, with an
// orthographic camera framed on its bounding box; the photos' cutouts are
// framed the same way. Four measures, each 0–1:
//   outline  — overlap (IoU) of the front silhouettes
//   profile  — overlap of the side silhouettes (only with a side photo)
//   relief   — correlation of the model's front depth with the AI depth map
//              (only with AI depth)
//   smooth   — how free of bumps the surface is (from a normal-map render)
// The overall score is their weighted mean over what is available.

import * as THREE from 'three';
import { buildModel } from './engine.js';

const G = 128;
const WEIGHTS = { outline: 0.3, profile: 0.3, relief: 0.25, smooth: 0.15 };

let renderer, target, scene, white, depthMat, normalMat;

function setup() {
  if (renderer) return;
  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, preserveDrawingBuffer: true });
  renderer.setSize(G, G);
  target = new THREE.WebGLRenderTarget(G, G);
  scene = new THREE.Scene();
  white = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  depthMat = new THREE.MeshDepthMaterial({ side: THREE.DoubleSide });
  normalMat = new THREE.MeshNormalMaterial();
}

// Square ortho camera looking at the box from `dir` ('front' = from +z,
// 'side' = from -x, so +z is to the right like a side photo facing right).
function camera(box, dir) {
  const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
  const across = dir === 'front' ? s.x : s.z, half = (Math.max(across, s.y) * 1.04) / 2, far = Math.max(s.x, s.z) * 4 + 1;
  const cam = new THREE.OrthographicCamera(-half, half, half, -half, 0.01, far);
  if (dir === 'front') cam.position.set(c.x, c.y, box.max.z + 0.5);
  else cam.position.set(box.min.x - 0.5, c.y, c.z);
  cam.lookAt(c);
  cam.near = 0.5 - 0.001;
  cam.far = 0.5 + (dir === 'front' ? s.z : s.x) + 0.002;
  cam.updateProjectionMatrix();
  return cam;
}

function renderWith(object, material, cam) {
  const o = object.clone();
  if (material) o.traverse(m => { if (m.isMesh) m.material = material; });
  scene.add(o);
  renderer.setRenderTarget(target);
  renderer.setClearColor(0x000000, 0);
  renderer.clear();
  renderer.render(scene, cam);
  const px = new Uint8Array(G * G * 4);
  renderer.readRenderTargetPixels(target, 0, 0, G, G, px);
  renderer.setRenderTarget(null);
  scene.remove(o);
  // Pixels come bottom-up; flip to image order.
  const out = new Uint8Array(G * G * 4);
  for (let y = 0; y < G; y++) out.set(px.subarray((G - 1 - y) * G * 4, (G - y) * G * 4), y * G * 4);
  return out;
}

// A reference mask (and optional values) re-framed into the same G×G square.
function frameReference(mask, w, h, bbox, values) {
  const bw = bbox.x1 - bbox.x0, bh = bbox.y1 - bbox.y0, side = Math.max(bw, bh) * 1.04;
  const cx = (bbox.x0 + bbox.x1) / 2, cy = (bbox.y0 + bbox.y1) / 2;
  const m = new Uint8Array(G * G), v = values ? new Float32Array(G * G) : null;
  for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
    const sx = Math.floor(cx + ((x + 0.5) / G - 0.5) * side), sy = Math.floor(cy + ((y + 0.5) / G - 0.5) * side);
    if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue;
    m[y * G + x] = mask[sy * w + sx];
    if (v) v[y * G + x] = values[sy * w + sx];
  }
  return { m, v };
}

function erode(m, r) {
  for (let k = 0; k < r; k++) {
    const c = Uint8Array.from(m);
    for (let y = 1; y < G - 1; y++) for (let x = 1; x < G - 1; x++) {
      const i = y * G + x;
      if (c[i] && !(c[i - 1] && c[i + 1] && c[i - G] && c[i + G])) m[i] = 0;
    }
  }
}

function iou(a, b) {
  let both = 0, any = 0;
  for (let i = 0; i < a.length; i++) { if (a[i] && b[i]) both++; if (a[i] || b[i]) any++; }
  return any ? both / any : 0;
}

function pearson(a, b, use) {
  let n = 0, sa = 0, sb = 0;
  for (let i = 0; i < a.length; i++) if (use[i]) { n++; sa += a[i]; sb += b[i]; }
  if (n < 20) return 0;
  const ma = sa / n, mb = sb / n;
  let cov = 0, va = 0, vb = 0;
  for (let i = 0; i < a.length; i++) if (use[i]) { const da = a[i] - ma, db = b[i] - mb; cov += da * db; va += da * da; vb += db * db; }
  return va && vb ? cov / Math.sqrt(va * vb) : 0;
}

// Bumpiness: mean change of the rendered normal between neighbouring pixels.
function smoothness(px) {
  let sum = 0, n = 0;
  for (let y = 1; y < G - 1; y++) for (let x = 1; x < G - 1; x++) {
    const i = (y * G + x) * 4;
    if (!px[i + 3] || !px[i + 7] || !px[i - 1] || !px[i + G * 4 + 3] || !px[i - G * 4 + 3]) continue;
    const lap = [0, 1, 2].reduce((a, c) => a + Math.abs(4 * px[i + c] - px[i + c - 4] - px[i + c + 4] - px[i + c - G * 4] - px[i + c + G * 4]), 0);
    sum += lap; n++;
  }
  const rough = n ? sum / n / 255 : 0;
  return Math.max(0, Math.min(1, 1 - rough / 0.35));
}

/**
 * Score a built model against its own references (result: what buildModel
 * returned; its depthGrid is the AI depth on the front cutout grid, if any).
 */
export function scoreCopy(result) {
  const depthOnFront = result.depthGrid;
  setup();
  const obj = result.object;
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj);
  const f = result.cutouts.front;
  const camF = camera(box, 'front');

  const silF = renderWith(obj, white, camF);
  const modelF = new Uint8Array(G * G);
  for (let i = 0; i < G * G; i++) modelF[i] = silF[i * 4 + 3] > 127 ? 1 : 0;
  const refF = frameReference(f.mask, f.w, f.h, f.bbox, depthOnFront);
  const parts = { outline: iou(modelF, refF.m) };

  const s = result.cutouts.side;
  if (s && !s.whole) {
    const silS = renderWith(obj, white, camera(box, 'side'));
    const modelS = new Uint8Array(G * G);
    for (let i = 0; i < G * G; i++) modelS[i] = silS[i * 4 + 3] > 127 ? 1 : 0;
    parts.profile = iou(modelS, frameReference(s.mask, s.w, s.h, s.bbox).m);
  }

  if (depthOnFront) {
    const dpx = renderWith(obj, depthMat, camF);
    const near = new Float32Array(G * G), use = new Uint8Array(G * G);
    for (let i = 0; i < G * G; i++) { near[i] = dpx[i * 4] / 255; use[i] = modelF[i] && refF.m[i] ? 1 : 0; }
    // Compare the interior only: every model is rounded at its outline, and
    // that falloff would swamp the relief inside.
    erode(use, Math.round(G * 0.06));
    parts.relief = Math.max(0, pearson(near, refF.v, use));
  }

  parts.smooth = smoothness(renderWith(obj, normalMat, camF));

  let total = 0, wsum = 0;
  for (const [k, v] of Object.entries(parts)) { total += v * WEIGHTS[k]; wsum += WEIGHTS[k]; }
  return { score: total / wsum, parts, overlay: overlayCanvas(modelF, refF.m) };
}

// Green: both. Red: in the photo, missing from the model. Blue: extra.
function overlayCanvas(model, ref) {
  const c = document.createElement('canvas');
  c.width = c.height = G;
  const ctx = c.getContext('2d'), id = ctx.createImageData(G, G);
  for (let i = 0; i < G * G; i++) {
    const col = model[i] && ref[i] ? [126, 200, 150, 255] : ref[i] ? [241, 120, 110, 255] : model[i] ? [110, 160, 240, 255] : [0, 0, 0, 0];
    id.data.set(col, i * 4);
  }
  ctx.putImageData(id, 0, 0);
  return c;
}

// The model as seen from the photo's viewpoint, for side-by-side display.
export function frontRender(result, size = 256) {
  setup();
  const box = new THREE.Box3().setFromObject(result.object);
  const cam = camera(box, 'front');
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  r.setSize(size, size);
  r.toneMapping = THREE.ACESFilmicToneMapping;
  const sc = new THREE.Scene();
  sc.add(new THREE.HemisphereLight(0xffffff, 0x445055, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(1, 2, 3);
  sc.add(key);
  sc.add(result.object.clone());
  r.render(sc, cam);
  const url = r.domElement.toDataURL('image/png');
  r.dispose();
  r.forceContextLoss();
  return url;
}

// The photo cropped the same way.
export function referenceCrop(img, cut, size = 256) {
  const b = cut.bbox, k = (img.naturalWidth || img.width) / cut.w;
  const side = Math.max(b.x1 - b.x0, b.y1 - b.y0) * 1.04;
  const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  c.getContext('2d').drawImage(img, (cx - side / 2) * k, (cy - side / 2) * k, side * k, side * k, 0, 0, size, size);
  return c.toDataURL('image/jpeg', 0.85);
}

/**
 * Auto-copy: coordinate search over the settings the score can judge.
 * Builds at draft detail while searching; the caller rebuilds the winner.
 * onStep({ i, total, score, settings, best }) after each try; signal aborts.
 * inputs.depth (if set) makes the AI-depth strength one of the settings.
 */
export async function autoCopy(inputs, start, { onStep = () => {}, signal } = {}) {
  const knobs = [
    { key: 'smooth', min: 0, max: 12, step: 3, round: true },
    { key: 'detail', min: 0, max: 0.24, step: 0.06 },
  ];
  // Thickness is left alone: a front photo can't show it, and a flatter
  // model would only look "smoother". A side photo already sets it.
  if (inputs.side) knobs.unshift({ key: 'symmetry', values: ['auto', 'off'] });
  if (inputs.depth) knobs.unshift({ key: 'depthWeight', min: 0, max: 1, step: 0.25 });

  const search = { ...inputs, cache: {} }; // the cutout is the same every try
  const total = 1 + 3 * knobs.reduce((n, k) => n + (k.values ? 1 : 2), 0);
  let i = 0;
  const evaluate = async settings => {
    if (signal?.aborted) throw new DOMException('Stopped', 'AbortError');
    const result = await buildModel(search, { ...settings, resolution: 72, preview: true });
    const { score } = scoreCopy(result);
    i++;
    return score;
  };

  let best = { ...start }, bestScore = await evaluate(best);
  onStep({ i, total, score: bestScore, settings: best, best: bestScore });
  for (let round = 0; round < 3; round++) {
    for (const k of knobs) {
      const options = k.values
        ? k.values.filter(v => v !== (best[k.key] ?? k.values[0]))
        : [-1, 1].map(d => {
          const v = Math.min(k.max, Math.max(k.min, (best[k.key] ?? k.min) + (d * k.step) / 2 ** round));
          return k.round ? Math.round(v) : Math.round(v * 1000) / 1000;
        }).filter(v => v !== best[k.key]);
      for (const v of options) {
        const trial = { ...best, [k.key]: v };
        const sc = await evaluate(trial);
        if (sc > bestScore + 1e-4) { best = trial; bestScore = sc; }
        onStep({ i, total, score: sc, settings: trial, best: bestScore });
      }
    }
  }
  return { settings: best, score: bestScore };
}
