// Artoo's in-browser 3D engine.
//
// What it does, step by step (the same steps the UI shows):
//   1. Cutout   — separate the subject from a plain background (or use alpha).
//   2. Shape    — solve a Poisson equation inside the silhouette and take its
//                 square root: every part gets a round cross-section whose
//                 thickness follows its own width, so a leg stays a leg and a
//                 body stays a body. With a side photo the depth comes from the
//                 side profile instead, and the side silhouette carves the
//                 volume too (a visual hull).
//   3. Surface  — sample that as a 3D field, extract it with marching cubes,
//                 then Taubin-smooth it (smoothing that doesn't shrink).
//   4. Texture  — project the photos back on: front, back (a real back photo
//                 or the front seen through) and side, picked per face, with
//                 colours bled past the outline so edges never pick up the
//                 background.
//   5. Style    — textured, clay, low-poly (flat facets) or voxel (blocks).
//
// It still cannot see what a photo hides. A server-side image-to-3D network
// does that; this is the free, instant, private path.

import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';

export const STYLES = {
  textured: 'Textured',
  clay: 'Clay',
  lowpoly: 'Low-poly',
  voxel: 'Voxel',
};

export const DEFAULTS = { style: 'textured', resolution: 112, inflate: 0.9, smooth: 5, detail: 0.06, tolerance: 38 };

const frame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('That file could not be read as an image. Use a PNG or JPG.'));
    img.src = src;
  });
}

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

function raster(img, maxSide) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const s = maxSide / Math.max(iw, ih);
  const c = canvas(iw * s, ih * s);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return { w: c.width, h: c.height, data: ctx.getImageData(0, 0, c.width, c.height).data };
}

// ---------------------------------------------------------------------------
// 1. Cutout

export function cutout(img, { tolerance = DEFAULTS.tolerance, maxSide = 256 } = {}) {
  const px = raster(img, maxSide);
  const { w, h, data } = px;
  const n = w * h;
  let mask = new Uint8Array(n);

  let clear = 0;
  for (let i = 0; i < n; i++) if (data[i * 4 + 3] < 128) clear++;
  if (clear > n * 0.02) {
    for (let i = 0; i < n; i++) mask[i] = data[i * 4 + 3] >= 128 ? 1 : 0;
  } else {
    // Background = what floods in from the border through pixels close to
    // the border's median colour. Enclosed areas of that colour stay inside.
    const border = [];
    for (let x = 0; x < w; x++) border.push(x, (h - 1) * w + x);
    for (let y = 1; y < h - 1; y++) border.push(y * w, y * w + w - 1);
    const med = k => border.map(i => data[i * 4 + k]).sort((a, b) => a - b)[border.length >> 1];
    const bg = [med(0), med(1), med(2)];
    const t2 = tolerance * tolerance;
    const near = i => {
      const r = data[i * 4] - bg[0], g = data[i * 4 + 1] - bg[1], b = data[i * 4 + 2] - bg[2];
      return 0.3 * r * r + 0.59 * g * g + 0.11 * b * b < t2 * 0.45;
    };
    const seen = new Uint8Array(n);
    const stack = border.filter(near);
    for (const i of stack) seen[i] = 1;
    while (stack.length) {
      const i = stack.pop(), x = i % w;
      if (x > 0 && !seen[i - 1] && near(i - 1)) { seen[i - 1] = 1; stack.push(i - 1); }
      if (x < w - 1 && !seen[i + 1] && near(i + 1)) { seen[i + 1] = 1; stack.push(i + 1); }
      if (i >= w && !seen[i - w] && near(i - w)) { seen[i - w] = 1; stack.push(i - w); }
      if (i < n - w && !seen[i + w] && near(i + w)) { seen[i + w] = 1; stack.push(i + w); }
    }
    for (let i = 0; i < n; i++) mask[i] = seen[i] ? 0 : 1;
  }

  mask = open(mask, w, h);
  mask = largestComponent(mask, w, h);
  let area = 0;
  for (let i = 0; i < n; i++) area += mask[i];
  const whole = area < n * 0.01 || area > n * 0.985;
  if (whole) mask.fill(1);
  return { w, h, data, mask, bbox: bbox(mask, w, h), whole };
}

// Remove one-pixel specks and hairlines: erode, then dilate.
function open(mask, w, h) {
  const morph = (src, keep) => {
    const out = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const nb = [src[i], x > 0 ? src[i - 1] : 0, x < w - 1 ? src[i + 1] : 0, y > 0 ? src[i - w] : 0, y < h - 1 ? src[i + w] : 0];
      out[i] = keep(nb) ? 1 : 0;
    }
    return out;
  };
  return morph(morph(mask, nb => nb.every(Boolean)), nb => nb.some(Boolean));
}

function largestComponent(mask, w, h) {
  const label = new Int32Array(w * h);
  let best = 0, bestSize = 0, next = 0;
  for (let s = 0; s < w * h; s++) {
    if (!mask[s] || label[s]) continue;
    next++;
    let size = 0;
    const stack = [s];
    label[s] = next;
    while (stack.length) {
      const i = stack.pop(), x = i % w;
      size++;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j >= 0 && j < w * h && mask[j] && !label[j]) { label[j] = next; stack.push(j); }
      }
    }
    if (size > bestSize) { bestSize = size; best = next; }
  }
  const out = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = label[i] === best ? 1 : 0;
  return out;
}

function bbox(mask, w, h) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (mask[y * w + x]) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return { x0, y0, x1: x1 + 1, y1: y1 + 1 };
}

// The cutout drawn for people: subject in full colour over a checkerboard.
export function cutoutPreview(cut, size = 220) {
  const s = size / Math.max(cut.w, cut.h);
  const c = canvas(cut.w * s, cut.h * s);
  const ctx = c.getContext('2d');
  const sq = 8;
  for (let y = 0; y < c.height; y += sq) for (let x = 0; x < c.width; x += sq) {
    ctx.fillStyle = ((x + y) / sq) % 2 ? '#2b3439' : '#363f45';
    ctx.fillRect(x, y, sq, sq);
  }
  const m = canvas(cut.w, cut.h);
  const id = new ImageData(new Uint8ClampedArray(cut.data), cut.w, cut.h);
  for (let i = 0; i < cut.w * cut.h; i++) id.data[i * 4 + 3] = cut.mask[i] ? 255 : 0;
  m.getContext('2d').putImageData(id, 0, 0);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(m, 0, 0, c.width, c.height);
  return c;
}

// ---------------------------------------------------------------------------
// 2. Shape

// Exact Euclidean distance transform (Felzenszwalb & Huttenlocher), squared.
function edt(target, w, h) {
  const INF = 1e20;
  const f = new Float64Array(Math.max(w, h)), d = new Float64Array(Math.max(w, h));
  const v = new Int32Array(Math.max(w, h)), z = new Float64Array(Math.max(w, h) + 1);
  const out = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = target[i] ? 0 : INF;
  const pass = (n, get, set) => {
    for (let q = 0; q < n; q++) f[q] = get(q);
    let k = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < n; q++) {
      let s;
      do { const p = v[k]; s = ((f[q] + q * q) - (f[p] + p * p)) / (2 * q - 2 * p); } while (s <= z[k] && --k >= 0);
      k++; v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; const p = v[k]; d[q] = (q - p) * (q - p) + f[p]; }
    for (let q = 0; q < n; q++) set(q, d[q]);
  };
  for (let x = 0; x < w; x++) pass(h, y => out[y * w + x], (y, val) => { out[y * w + x] = val; });
  for (let y = 0; y < h; y++) pass(w, x => out[y * w + x], (x, val) => { out[y * w + x] = val; });
  return out;
}

// Signed distance to the outline in pixels: positive inside.
function signedDistance(mask, w, h) {
  const toOutside = edt(mask.map(m => 1 - m), w, h);
  const toInside = edt(mask, w, h);
  const sdf = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) sdf[i] = mask[i] ? Math.sqrt(toOutside[i]) - 0.5 : 0.5 - Math.sqrt(toInside[i]);
  return sdf;
}

// Solve Δp = -1 inside the mask, p = 0 outside (SOR). sqrt(2p) is then a
// semicircle across any strip of the shape: round, width-aware thickness.
function inflate(mask, sdf, w, h) {
  const p = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) if (mask[i]) p[i] = 0.5 * sdf[i] * sdf[i];
  const omega = 2 / (1 + Math.sin(Math.PI / Math.max(w, h)));
  const iters = Math.min(600, Math.max(w, h) * 2);
  for (let it = 0; it < iters; it++) {
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (!mask[i]) continue;
      const g = (p[i - 1] + p[i + 1] + p[i - w] + p[i + w] + 1) / 4;
      p[i] += omega * (g - p[i]);
    }
  }
  const out = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = mask[i] ? Math.sqrt(Math.max(0, 2 * p[i])) : 0;
  return out;
}

function bilinear(arr, w, h, x, y) {
  x = Math.min(Math.max(x - 0.5, 0), w - 1.001);
  y = Math.min(Math.max(y - 0.5, 0), h - 1.001);
  const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, i = y0 * w + x0;
  return (arr[i] * (1 - fx) + arr[i + 1] * fx) * (1 - fy) + (arr[i + w] * (1 - fx) + arr[i + w + 1] * fx) * fy;
}

// Everything the volume needs, in front-image pixel units: a depth field D
// (half-thickness inside, signed distance outside), a per-row centre zc, and
// optionally the side silhouette's signed distance.
function buildShape(front, side, settings) {
  const { w, h, mask } = front;
  const sdf = signedDistance(mask, w, h);
  const hgt = inflate(mask, sdf, w, h);

  // Surface detail: brighter areas swell a little, darker ones sink.
  if (settings.detail) {
    let sum = 0, cnt = 0;
    const lum = i => (0.299 * front.data[i * 4] + 0.587 * front.data[i * 4 + 1] + 0.114 * front.data[i * 4 + 2]) / 255;
    for (let i = 0; i < w * h; i++) if (mask[i]) { sum += lum(i); cnt++; }
    const mean = sum / cnt;
    for (let i = 0; i < w * h; i++) if (mask[i]) hgt[i] *= 1 + settings.detail * 2 * (lum(i) - mean);
  }

  const D = new Float32Array(w * h);
  const zc = new Float32Array(h);
  let sideInfo = null;

  if (side && !side.whole) {
    // Line the side photo up with the front: same height, same top.
    const fb = front.bbox, sb = side.bbox;
    const ks = (fb.y1 - fb.y0) / Math.max(1, sb.y1 - sb.y0);
    const sxc = (sb.x0 + sb.x1) / 2;
    const sideSdf = signedDistance(side.mask, side.w, side.h);
    const rz = new Float32Array(h);
    for (let y = 0; y < h; y++) {
      const b = Math.round((y + 0.5 - fb.y0) / ks + sb.y0 - 0.5);
      if (b < 0 || b >= side.h) continue;
      let a0 = -1, a1 = -1;
      for (let a = 0; a < side.w; a++) if (side.mask[b * side.w + a]) { if (a0 < 0) a0 = a; a1 = a + 1; }
      if (a0 < 0) continue;
      rz[y] = ((a1 - a0) / 2) * ks;
      zc[y] = ((a0 + a1) / 2 - sxc) * ks;
    }
    // Row-to-row noise in these profiles shows up as ridges; smooth them.
    const rowMax = new Float32Array(h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) rowMax[y] = Math.max(rowMax[y], hgt[y * w + x]);
    for (const arr of [rz, zc, rowMax]) smooth1d(arr, 4);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        D[i] = mask[i] ? (rowMax[y] > 0 ? Math.min(1.15, hgt[i] / rowMax[y]) * rz[y] : 0) : sdf[i];
      }
    }
    sideInfo = { cut: side, sdf: sideSdf, ks, sxc, fy0: fb.y0, sy0: sb.y0 };
  } else {
    for (let i = 0; i < w * h; i++) D[i] = mask[i] ? hgt[i] * settings.inflate : sdf[i];
  }

  let depth = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const d = D[y * w + x];
    if (d > 0) depth = Math.max(depth, Math.abs(zc[y]) + d);
  }
  return { w, h, D, zc, side: sideInfo, depth };
}

// [1 2 1] blur along a 1D profile, leaving empty (zero) rows empty.
function smooth1d(a, passes) {
  for (let p = 0; p < passes; p++) {
    const b = Float32Array.from(a);
    for (let i = 1; i < a.length - 1; i++) if (a[i]) b[i] = (a[i - 1] + 2 * a[i] + a[i + 1]) / 4 || a[i];
    a.set(b);
  }
}

// Smooth minimum: intersects two shapes with a rounded seam instead of a crease.
function smin(a, b, k = 4) {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

// The field at a point (u, v in front pixels, z in the same units, 0 = middle).
function fieldAt(shape, u, v, z) {
  const { w, h, D, zc } = shape;
  const vy = Math.min(Math.max(v - 0.5, 0), h - 1);
  const zrow = zc[vy | 0] + (zc[Math.min(h - 1, (vy | 0) + 1)] - zc[vy | 0]) * (vy - (vy | 0));
  let f = bilinear(D, w, h, u, v) - Math.abs(z - zrow);
  if (shape.side) f = smin(f, sideField(shape.side, v, z));
  return f;
}

function sideField(s, v, z) {
  const a = z / s.ks + s.sxc, b = (v - s.fy0) / s.ks + s.sy0;
  return bilinear(s.sdf, s.cut.w, s.cut.h, a, b) * s.ks;
}

// ---------------------------------------------------------------------------
// 3. Surface

function volumeTransform(shape, N) {
  const pad = 4;
  const span = Math.max(shape.w, shape.h, shape.depth * 2 + 2);
  const s = (N - 2 * pad) / span;
  return {
    s, N,
    // voxel index → front pixel coordinates
    u: ix => (ix - N / 2) / s + shape.w / 2,
    v: iy => (N / 2 - iy) / s + shape.h / 2,
    z: iz => (iz - N / 2) / s,
  };
}

function marchingCubes(shape, N) {
  const T = volumeTransform(shape, N);
  const mc = new MarchingCubes(N, new THREE.MeshBasicMaterial(), false, false, Math.min(1.2e6, N * N * 24));
  mc.isolation = 0;
  const field = mc.field;
  const N2 = N * N;
  const zs = Float32Array.from({ length: N }, (_, iz) => T.z(iz));
  const sidePlane = shape.side ? new Float32Array(N2) : null;
  if (sidePlane) for (let iy = 0; iy < N; iy++) for (let iz = 0; iz < N; iz++) sidePlane[iy * N + iz] = sideField(shape.side, T.v(iy), zs[iz]);

  for (let iy = 0; iy < N; iy++) {
    const v = T.v(iy);
    const vy = Math.min(Math.max(v - 0.5, 0), shape.h - 1);
    const zrow = shape.zc[vy | 0] + (shape.zc[Math.min(shape.h - 1, (vy | 0) + 1)] - shape.zc[vy | 0]) * (vy - (vy | 0));
    for (let ix = 0; ix < N; ix++) {
      const d = bilinear(shape.D, shape.w, shape.h, T.u(ix), v);
      const base = ix + iy * N;
      for (let iz = 0; iz < N; iz++) {
        let f = d - Math.abs(zs[iz] - zrow);
        if (sidePlane) f = smin(f, sidePlane[iy * N + iz]);
        // Keep the outermost shell empty so every surface closes.
        if (ix < 1 || iy < 1 || iz < 1 || ix > N - 2 || iy > N - 2 || iz > N - 2) f = -1;
        field[base + iz * N2] = f * T.s;
      }
    }
  }
  mc.update();
  const count = mc.count;
  if (count < 3) throw new Error('No shape came out. Try a picture with one clear subject on a plain background, or raise the cutout tolerance.');
  const pos = mc.positionArray.slice(0, count * 3);
  // MarchingCubes works in [-1, 1]; back to voxel indices, then pixels.
  const half = N / 2;
  for (let i = 0; i < count; i++) {
    pos[i * 3] = T.u(pos[i * 3] * half + half);
    pos[i * 3 + 1] = T.v(pos[i * 3 + 1] * half + half);
    pos[i * 3 + 2] = T.z(pos[i * 3 + 2] * half + half);
  }
  mc.geometry.dispose();
  let geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo = mergeVertices(geo, 1e-4);
  return geo;
}

// Taubin λ|μ smoothing: removes the marching-cubes terracing without the
// shrinking plain averaging causes.
function taubin(geo, iterations) {
  if (!iterations) return;
  const pos = geo.attributes.position.array, idx = geo.index.array, n = pos.length / 3;
  const deg = new Uint32Array(n + 1);
  for (let t = 0; t < idx.length; t += 3) for (let k = 0; k < 3; k++) deg[idx[t + k] + 1] += 2;
  for (let i = 0; i < n; i++) deg[i + 1] += deg[i];
  const nb = new Uint32Array(deg[n]), fill = deg.slice(0, n);
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t], b = idx[t + 1], c = idx[t + 2];
    nb[fill[a]++] = b; nb[fill[a]++] = c;
    nb[fill[b]++] = a; nb[fill[b]++] = c;
    nb[fill[c]++] = a; nb[fill[c]++] = b;
  }
  const tmp = new Float32Array(pos.length);
  const step = f => {
    for (let i = 0; i < n; i++) {
      const s = deg[i], e = deg[i + 1];
      if (e === s) { tmp[i * 3] = pos[i * 3]; tmp[i * 3 + 1] = pos[i * 3 + 1]; tmp[i * 3 + 2] = pos[i * 3 + 2]; continue; }
      let x = 0, y = 0, z = 0;
      for (let k = s; k < e; k++) { const j = nb[k] * 3; x += pos[j]; y += pos[j + 1]; z += pos[j + 2]; }
      const m = 1 / (e - s);
      tmp[i * 3] = pos[i * 3] + f * (x * m - pos[i * 3]);
      tmp[i * 3 + 1] = pos[i * 3 + 1] + f * (y * m - pos[i * 3 + 1]);
      tmp[i * 3 + 2] = pos[i * 3 + 2] + f * (z * m - pos[i * 3 + 2]);
    }
    pos.set(tmp);
  };
  for (let it = 0; it < iterations; it++) { step(0.5); step(-0.53); }
}

// ---------------------------------------------------------------------------
// 4. Texture

// Fill everything outside the subject with the nearest subject colours
// (push-pull through a mip pyramid), so faces at the rim never sample the
// backdrop.
function bleed(src) {
  const levels = [src];
  while (levels.at(-1).width > 4 && levels.at(-1).height > 4) {
    const prev = levels.at(-1);
    const c = canvas(prev.width / 2, prev.height / 2);
    c.getContext('2d').drawImage(prev, 0, 0, c.width, c.height);
    levels.push(c);
  }
  for (let i = levels.length - 2; i >= 0; i--) {
    const ctx = levels[i].getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    for (let k = 0; k < 3; k++) ctx.drawImage(levels[i + 1], 0, 0, levels[i].width, levels[i].height);
    ctx.globalCompositeOperation = 'source-over';
  }
  return src;
}

// The texture mask is shrunk by two pixels: outline pixels are part
// background (anti-aliasing), and would paint a pale rim on the model.
function maskCanvas(cut) {
  const { w, h } = cut;
  let m = cut.mask;
  for (let pass = 0; pass < 2; pass++) {
    const e = new Uint8Array(w * h);
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      e[i] = m[i] && m[i - 1] && m[i + 1] && m[i - w] && m[i + w] ? 1 : 0;
    }
    m = e;
  }
  const c = canvas(w, h);
  const id = c.getContext('2d').createImageData(w, h);
  for (let i = 0; i < w * h; i++) { id.data[i * 4 + 3] = m[i] ? 255 : 0; }
  c.getContext('2d').putImageData(id, 0, 0);
  return c;
}

// The subject alone, at texture resolution, colours bled outward.
function subjectTexture(img, cut, tw, th, place) {
  const c = canvas(tw, th);
  const ctx = c.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  place(ctx, img);
  ctx.globalCompositeOperation = 'destination-in';
  const m = maskCanvas(cut);
  place(ctx, m);
  ctx.globalCompositeOperation = 'source-over';
  return bleed(c);
}

const TILE = 1024;

// Atlas: [front | back | side], each tile a square stretched over its image.
function buildAtlas(inputs, cuts) {
  const { front } = cuts;
  const tiles = cuts.side ? 3 : 2;
  const atlas = canvas(TILE * tiles, TILE);
  const ctx = atlas.getContext('2d');
  ctx.fillStyle = '#8a8580';
  ctx.fillRect(0, 0, atlas.width, atlas.height);
  const fullFront = (c, im) => c.drawImage(im, 0, 0, TILE, TILE);

  const frontTex = subjectTexture(inputs.front, front, TILE, TILE, fullFront);
  ctx.drawImage(frontTex, 0, 0);

  if (cuts.back && !cuts.back.whole) {
    // Back photo, mirrored, its outline fitted to the front's.
    const fb = front.bbox, bb = cuts.back.bbox;
    const sx = TILE / front.w, sy = TILE / front.h;
    const place = (c, im) => {
      const k = im.width / cuts.back.w; // image px per cut px
      c.save();
      c.translate(fb.x1 * sx, fb.y0 * sy);
      c.scale(-((fb.x1 - fb.x0) * sx) / ((bb.x1 - bb.x0) * k), ((fb.y1 - fb.y0) * sy) / ((bb.y1 - bb.y0) * k));
      c.drawImage(im, -bb.x0 * k, -bb.y0 * k);
      c.restore();
    };
    const backImg = imageAt(inputs.back, cuts.back);
    ctx.drawImage(subjectTexture(backImg, cuts.back, TILE, TILE, place), TILE, 0);
  } else {
    ctx.drawImage(frontTex, TILE, 0);
  }
  if (cuts.side) ctx.drawImage(subjectTexture(inputs.side, cuts.side, TILE, TILE, (c, im) => c.drawImage(im, 0, 0, TILE, TILE)), TILE * 2, 0);
  return { canvas: atlas, tiles };
}

// A canvas of the image at the cut's resolution (so place() can scale by k).
function imageAt(img, cut) {
  const c = canvas(cut.w * 4, cut.h * 4);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c;
}

// Pick a projection per face and write UVs. Expects non-indexed geometry in
// front-pixel space.
function projectUVs(geo, shape, tiles) {
  const p = geo.attributes.position.array;
  const uv = new Float32Array((p.length / 3) * 2);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const tileOf = new Uint8Array(p.length / 9);
  const out = Math.sign(signedVolume(geo)) || 1; // makes n point outward
  for (let f = 0; f < p.length / 9; f++) {
    a.fromArray(p, f * 9); b.fromArray(p, f * 9 + 3); c.fromArray(p, f * 9 + 6);
    const n = b.clone().sub(a).cross(c.clone().sub(a));
    const nx = Math.abs(n.x), nz = n.z * out;
    let tile = nz >= 0 ? 0 : 1;
    if (shape.side && nx > Math.abs(nz) * 1.15) tile = 2;
    tileOf[f] = tile;
    for (let k = 0; k < 3; k++) {
      const i = f * 3 + k, x = p[i * 3], y = p[i * 3 + 1], z = p[i * 3 + 2];
      let s, t;
      if (tile === 2) {
        const sd = shape.side;
        s = (z / sd.ks + sd.sxc) / sd.cut.w;
        t = ((y - sd.fy0) / sd.ks + sd.sy0) / sd.cut.h;
      } else {
        s = x / shape.w; t = y / shape.h;
      }
      s = Math.min(Math.max(s, 0.001), 0.999); t = Math.min(Math.max(t, 0.001), 0.999);
      uv[i * 2] = (tile + s) / tiles;
      uv[i * 2 + 1] = 1 - t;
    }
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return tileOf;
}

// Pixel space → model space: y up, z toward the front camera, sitting on the
// ground, 1 unit tall.
function toModelSpace(geo, shape) {
  const p = geo.attributes.position.array;
  for (let i = 0; i < p.length; i += 3) { p[i + 1] = -p[i + 1]; }
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const k = 1 / Math.max(1e-6, bb.max.y - bb.min.y);
  const cx = (bb.max.x + bb.min.x) / 2, cz = (bb.max.z + bb.min.z) / 2;
  for (let i = 0; i < p.length; i += 3) {
    p[i] = (p[i] - cx) * k;
    p[i + 1] = (p[i + 1] - bb.min.y) * k;
    p[i + 2] = (p[i + 2] - cz) * k;
  }
  geo.attributes.position.needsUpdate = true;
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
}

// Signed volume: positive when triangles wind counter-clockwise seen from
// outside. Measured rather than assumed, because the pipeline mirrors axes.
function signedVolume(geo) {
  const p = geo.attributes.position.array, idx = geo.index?.array;
  const n = idx ? idx.length : p.length / 3;
  let v = 0;
  for (let t = 0; t < n; t += 3) {
    const a = (idx ? idx[t] : t) * 3, b = (idx ? idx[t + 1] : t + 1) * 3, c = (idx ? idx[t + 2] : t + 2) * 3;
    v += p[a] * (p[b + 1] * p[c + 2] - p[b + 2] * p[c + 1])
       - p[a + 1] * (p[b] * p[c + 2] - p[b + 2] * p[c])
       + p[a + 2] * (p[b] * p[c + 1] - p[b + 1] * p[c]);
  }
  return v / 6;
}

// Make every face wind outward (non-indexed geometry: swap two corners).
function ensureOutward(geo) {
  if (signedVolume(geo) >= 0) return;
  for (const attr of Object.values(geo.attributes)) {
    const a = attr.array, k = attr.itemSize;
    for (let t = 0; t < attr.count; t += 3) for (let j = 0; j < k; j++) {
      const s = a[(t + 1) * k + j]; a[(t + 1) * k + j] = a[(t + 2) * k + j]; a[(t + 2) * k + j] = s;
    }
  }
}

function sampleAtlas(atlasData, aw, ah, s, t) {
  const x = Math.min(aw - 1, Math.max(0, Math.floor(s * aw)));
  const y = Math.min(ah - 1, Math.max(0, Math.floor((1 - t) * ah)));
  const i = (y * aw + x) * 4;
  return [atlasData[i] / 255, atlasData[i + 1] / 255, atlasData[i + 2] / 255];
}

// ---------------------------------------------------------------------------
// 5. Styles + the whole pipeline

const STAGES = ['Cutout', 'Shape', 'Surface', 'Texture', 'Style'];
export { STAGES };

/**
 * inputs: { front: Image, side?: Image, back?: Image }
 * settings: see DEFAULTS
 * onStage(index, name): called as each stage starts
 */
export async function buildModel(inputs, settings = {}, onStage = () => {}) {
  const S = { ...DEFAULTS, ...settings };
  const t0 = performance.now();
  const step = async i => { onStage(i, STAGES[i]); await frame(); };

  await step(0);
  const work = Math.min(256, Math.max(96, Math.round(S.resolution * 2)));
  const cuts = {
    front: cutout(inputs.front, { tolerance: S.tolerance, maxSide: work }),
    side: inputs.side ? cutout(inputs.side, { tolerance: S.tolerance, maxSide: work }) : null,
    back: inputs.back ? cutout(inputs.back, { tolerance: S.tolerance, maxSide: work }) : null,
  };

  await step(1);
  const shape = buildShape(cuts.front, cuts.side, S);

  await step(2);
  const N = S.style === 'lowpoly' ? Math.round(Math.min(S.resolution, 44)) : S.style === 'voxel' ? 0 : Math.round(S.resolution);
  let geo = null;
  if (N) {
    geo = marchingCubes(shape, N);
    taubin(geo, S.style === 'lowpoly' ? Math.min(2, S.smooth) : S.smooth);
  }

  await step(3);
  const atlas = buildAtlas(inputs, cuts);
  const map = new THREE.CanvasTexture(atlas.canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  map.userData.mimeType = 'image/jpeg';

  await step(4);
  const group = new THREE.Group();
  group.name = 'artoo-model';
  let mesh;

  if (S.style === 'voxel') {
    mesh = voxelMesh(shape, atlas, S);
  } else {
    geo = geo.toNonIndexed();
    projectUVs(geo, shape, atlas.tiles);
    toModelSpace(geo, shape);
    ensureOutward(geo);
    if (S.style === 'lowpoly') {
      geo.computeVertexNormals(); // non-indexed → flat facets
      const ctx = atlas.canvas.getContext('2d');
      const data = ctx.getImageData(0, 0, atlas.canvas.width, atlas.canvas.height).data;
      const uv = geo.attributes.uv.array, col = new Float32Array(geo.attributes.position.count * 3);
      for (let f = 0; f < uv.length / 6; f++) {
        const s = (uv[f * 6] + uv[f * 6 + 2] + uv[f * 6 + 4]) / 3, t = (uv[f * 6 + 1] + uv[f * 6 + 3] + uv[f * 6 + 5]) / 3;
        const [r, g, b] = sampleAtlas(data, atlas.canvas.width, atlas.canvas.height, s, t);
        for (let k = 0; k < 3; k++) col.set([r, g, b], (f * 3 + k) * 3);
      }
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geo.deleteAttribute('uv');
      mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.75 }));
      linearizeVertexColors(geo);
    } else {
      // Smooth normals across the per-face UV split.
      const indexed = mergeVertices(geo.clone().deleteAttribute('uv'), 1e-5);
      indexed.computeVertexNormals();
      copyNormals(indexed, geo);
      const mat = S.style === 'clay'
        ? new THREE.MeshStandardMaterial({ color: 0xb9b2a7, roughness: 0.92 })
        : new THREE.MeshStandardMaterial({ map, roughness: 0.68 });
      mesh = new THREE.Mesh(geo, mat);
    }
  }
  mesh.name = 'artoo-mesh';
  group.add(mesh);

  const g = mesh.geometry;
  const triangles = g.index ? g.index.count / 3 : g.attributes.position.count / 3;
  return {
    object: group,
    atlas: atlas.canvas,
    cutouts: cuts,
    stats: { triangles, vertices: g.attributes.position.count, ms: Math.round(performance.now() - t0), views: 1 + !!cuts.side + !!cuts.back },
  };
}

function copyNormals(indexed, flat) {
  const map = new Map();
  const ip = indexed.attributes.position.array, inn = indexed.attributes.normal.array;
  const key = (a, i) => `${a[i].toFixed(5)},${a[i + 1].toFixed(5)},${a[i + 2].toFixed(5)}`;
  for (let i = 0; i < ip.length; i += 3) map.set(key(ip, i), i);
  const fp = flat.attributes.position.array, fn = new Float32Array(fp.length);
  for (let i = 0; i < fp.length; i += 3) {
    const j = map.get(key(fp, i));
    if (j !== undefined) { fn[i] = inn[j]; fn[i + 1] = inn[j + 1]; fn[i + 2] = inn[j + 2]; }
  }
  flat.setAttribute('normal', new THREE.BufferAttribute(fn, 3));
}

// Vertex colours sampled from an sRGB image must be stored linear.
function linearizeVertexColors(geo) {
  const c = geo.attributes.color.array, col = new THREE.Color();
  for (let i = 0; i < c.length; i += 3) { col.setRGB(c[i], c[i + 1], c[i + 2], THREE.SRGBColorSpace); c[i] = col.r; c[i + 1] = col.g; c[i + 2] = col.b; }
}

// Blocks: sample the same field on a coarse grid, emit only exposed faces.
function voxelMesh(shape, atlas, S) {
  const B = Math.max(16, Math.min(56, Math.round(S.resolution / 2.6)));
  const T = volumeTransform(shape, B);
  const solid = new Uint8Array(B * B * B);
  const at = (x, y, z) => (x < 0 || y < 0 || z < 0 || x >= B || y >= B || z >= B ? 0 : solid[x + y * B + z * B * B]);
  for (let z = 0; z < B; z++) for (let y = 0; y < B; y++) for (let x = 0; x < B; x++) {
    solid[x + y * B + z * B * B] = fieldAt(shape, T.u(x + 0.5), T.v(y + 0.5), T.z(z + 0.5)) > 0 ? 1 : 0;
  }
  const data = atlas.canvas.getContext('2d').getImageData(0, 0, atlas.canvas.width, atlas.canvas.height).data;
  const aw = atlas.canvas.width, ah = atlas.canvas.height;
  const colorFor = (x, y, z, dir) => {
    const u = T.u(x + 0.5), v = T.v(y + 0.5), zz = T.z(z + 0.5);
    let tile = dir[2] < 0 ? 1 : 0, s = u / shape.w, t = v / shape.h;
    if (shape.side && dir[0] !== 0) {
      tile = 2;
      s = (zz / shape.side.ks + shape.side.sxc) / shape.side.cut.w;
      t = ((v - shape.side.fy0) / shape.side.ks + shape.side.sy0) / shape.side.cut.h;
    }
    s = Math.min(Math.max(s, 0), 0.999); t = Math.min(Math.max(t, 0), 0.999);
    return sampleAtlas(data, aw, ah, (tile + s) / atlas.tiles, 1 - t);
  };
  // Directions in voxel space (+y voxel = up in the model).
  const FACES = [
    { d: [1, 0, 0], c: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]] },
    { d: [-1, 0, 0], c: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]] },
    { d: [0, 1, 0], c: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]] },
    { d: [0, -1, 0], c: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]] },
    { d: [0, 0, 1], c: [[1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]] },
    { d: [0, 0, -1], c: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]] },
  ];
  const pos = [], col = [], nor = [];
  for (let z = 0; z < B; z++) for (let y = 0; y < B; y++) for (let x = 0; x < B; x++) {
    if (!at(x, y, z)) continue;
    for (const f of FACES) {
      if (at(x + f.d[0], y + f.d[1], z + f.d[2])) continue;
      const [r, g, b] = colorFor(x, y, z, f.d);
      const q = f.c.map(o => [x + o[0], y + o[1], z + o[2]]);
      for (const k of [0, 1, 2, 0, 2, 3]) { pos.push(...q[k]); col.push(r, g, b); nor.push(...f.d); }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  linearizeVertexColors(geo);
  geo.computeBoundingBox();
  const bb = geo.boundingBox, k = 1 / (bb.max.y - bb.min.y);
  geo.translate(-(bb.max.x + bb.min.x) / 2, -bb.min.y, -(bb.max.z + bb.min.z) / 2);
  geo.scale(k, k, k);
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 }));
}

// ---------------------------------------------------------------------------
// Export: GLB (+ textures), OBJ, STL (100 mm tall, for printing), as one zip.

export function toGLB(object) {
  return new GLTFExporter().parseAsync(object, { binary: true });
}

export function toOBJ(object) {
  return new OBJExporter().parse(object);
}

export function toSTL(object) {
  const clone = object.clone();
  clone.scale.setScalar(100);
  clone.updateMatrixWorld(true);
  return new STLExporter().parse(clone, { binary: true }).buffer;
}

const CRC = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// A stored (uncompressed) zip: small code, opens everywhere.
export function zip(files) {
  const enc = new TextEncoder();
  const parts = [], central = [];
  let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const data = typeof content === 'string' ? enc.encode(content) : new Uint8Array(content);
    const nameBytes = enc.encode(name);
    const crc = crc32(data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true); local.setUint16(4, 20, true); local.setUint16(8, 0, true);
    local.setUint32(14, crc, true); local.setUint32(18, data.length, true); local.setUint32(22, data.length, true);
    local.setUint16(26, nameBytes.length, true);
    parts.push(local.buffer, nameBytes, data);
    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true); cd.setUint16(4, 20, true); cd.setUint16(6, 20, true);
    cd.setUint32(16, crc, true); cd.setUint32(20, data.length, true); cd.setUint32(24, data.length, true);
    cd.setUint16(28, nameBytes.length, true); cd.setUint32(42, offset, true);
    central.push(cd.buffer, nameBytes);
    offset += 30 + nameBytes.length + data.length;
  }
  const cdSize = central.reduce((s, p) => s + p.byteLength, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, Object.keys(files).length, true); end.setUint16(10, Object.keys(files).length, true);
  end.setUint32(12, cdSize, true); end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, end.buffer], { type: 'application/zip' });
}
