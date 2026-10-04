// The demo engine. Cuts the subject out of the picture, then "inflates" it like
// a balloon (height grows with distance from the outline) and adds a little
// relief from the image's brightness. It cannot see what is behind the subject,
// so it is 2.5D — a quick stand-in, not image-to-3D. Real engines live on the
// server (see server.mjs).

import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read that image'));
    img.src = src;
  });
}

function pixels(img, maxSide) {
  const s = maxSide / Math.max(img.naturalWidth, img.naturalHeight);
  const w = Math.max(8, Math.round(img.naturalWidth * s));
  const h = Math.max(8, Math.round(img.naturalHeight * s));
  const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  return { w, h, data: ctx.getImageData(0, 0, w, h).data };
}

// Foreground = everything NOT reachable from the border through
// background-coloured pixels. Transparent PNGs use their alpha directly.
function subjectMask({ w, h, data }) {
  const mask = new Uint8Array(w * h);
  let transparent = 0;
  for (let i = 0; i < w * h; i++) if (data[i * 4 + 3] < 128) transparent++;
  if (transparent > w * h * 0.03) {
    for (let i = 0; i < w * h; i++) mask[i] = data[i * 4 + 3] >= 128 ? 1 : 0;
    return mask;
  }

  const border = [];
  for (let x = 0; x < w; x++) border.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) border.push(y * w, y * w + w - 1);
  const med = k => border.map(i => data[i * 4 + k]).sort((a, b) => a - b)[border.length >> 1];
  const bg = [med(0), med(1), med(2)];
  const isBg = i => {
    const dr = data[i * 4] - bg[0], dg = data[i * 4 + 1] - bg[1], db = data[i * 4 + 2] - bg[2];
    return dr * dr + dg * dg + db * db < 42 * 42;
  };

  const seen = new Uint8Array(w * h);
  const stack = border.filter(isBg);
  for (const i of stack) seen[i] = 1;
  while (stack.length) {
    const i = stack.pop(), x = i % w, y = (i / w) | 0;
    for (const j of [x > 0 && i - 1, x < w - 1 && i + 1, y > 0 && i - w, y < h - 1 && i + w]) {
      if (j !== false && !seen[j] && isBg(j)) { seen[j] = 1; stack.push(j); }
    }
  }
  let count = 0;
  for (let i = 0; i < w * h; i++) { mask[i] = seen[i] ? 0 : 1; count += mask[i]; }
  // Nothing sensible found (busy photo, no clear backdrop): use the whole frame.
  if (count < w * h * 0.03 || count > w * h * 0.97) mask.fill(1);
  return mask;
}

// Two-pass chamfer distance from the outline, in pixels.
function distance(mask, w, h) {
  const d = new Float32Array(w * h);
  const INF = 1e9;
  for (let i = 0; i < w * h; i++) d[i] = mask[i] ? INF : 0;
  const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : d[y * w + x]);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x; if (!d[i]) continue;
    d[i] = Math.min(d[i], at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + 1.414, at(x + 1, y - 1) + 1.414);
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x; if (!d[i]) continue;
    d[i] = Math.min(d[i], at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + 1.414, at(x - 1, y + 1) + 1.414);
  }
  return d;
}

function blur(field, mask, w, h, passes) {
  let a = field;
  for (let p = 0; p < passes; p++) {
    const b = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!mask[i]) continue;
      let s = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
        const j = yy * w + xx;
        if (mask[j]) { s += a[j]; n++; }
      }
      b[i] = s / n;
    }
    a = b;
  }
  return a;
}

export async function buildRelief(img, { inflate = 0.6, detail = 0.1, resolution = 96, smooth = 2 } = {}) {
  const px = pixels(img, resolution);
  const { w, h, data } = px;
  const mask = subjectMask(px);
  const dist = distance(mask, w, h);
  let maxD = 1;
  for (const v of dist) if (v > maxD) maxD = v;

  const lum = i => (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
  let height = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    if (!mask[i]) continue;
    const t = dist[i] / maxD;
    height[i] = inflate * Math.sqrt(t) + detail * (lum(i) - 0.5) * Math.min(1, t * 4);
  }
  height = blur(height, mask, w, h, smooth);

  // Grid vertices sit on pixel centres. A vertex is on the rim when any
  // neighbour is outside the subject; the rim is pinned to z=0 so the front and
  // back shells meet there.
  const worldW = w / Math.max(w, h), worldH = h / Math.max(w, h);
  const thickness = 0.35 * Math.max(worldW, worldH);
  const rim = i => {
    const x = i % w, y = (i / w) | 0;
    return x === 0 || y === 0 || x === w - 1 || y === h - 1 || !mask[i - 1] || !mask[i + 1] || !mask[i - w] || !mask[i + w];
  };

  const pos = [], uv = [], index = [];
  const front = new Int32Array(w * h).fill(-1), back = new Int32Array(w * h).fill(-1);
  for (let i = 0; i < w * h; i++) {
    if (!mask[i]) continue;
    const x = i % w, y = (i / w) | 0;
    const X = (x / (w - 1) - 0.5) * worldW, Y = (1 - y / (h - 1)) * worldH;
    const z = rim(i) ? 0 : Math.max(0, height[i]) * thickness;
    const u = x / (w - 1), v = 1 - y / (h - 1);
    front[i] = pos.length / 3; pos.push(X, Y, z); uv.push(u, v);
    back[i] = pos.length / 3; pos.push(X, Y, -z * 0.8); uv.push(u, v);
  }
  for (let y = 0; y < h - 1; y++) for (let x = 0; x < w - 1; x++) {
    const a = y * w + x, b = a + 1, c = a + w, d = c + 1;
    if (!(mask[a] && mask[b] && mask[c] && mask[d])) continue;
    index.push(front[a], front[c], front[b], front[b], front[c], front[d]);
    index.push(back[a], back[b], back[c], back[b], back[d], back[c]);
  }
  if (!index.length) throw new Error('Could not find a subject in that image');

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.computeVertexNormals();

  // Texture at a higher resolution than the mesh.
  const tex = pixels(img, 1024);
  const tc = Object.assign(document.createElement('canvas'), { width: tex.w, height: tex.h });
  tc.getContext('2d').putImageData(new ImageData(tex.data, tex.w, tex.h), 0, 0);
  const map = new THREE.CanvasTexture(tc);
  map.colorSpace = THREE.SRGBColorSpace;

  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map, roughness: 0.65, metalness: 0, side: THREE.DoubleSide }));
  mesh.name = 'artoo-relief';
  const group = new THREE.Group();
  group.add(mesh);
  return group;
}

export function toGlb(object) {
  return new GLTFExporter().parseAsync(object, { binary: true });
}
