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

export const DEFAULTS = {
  style: 'textured', resolution: 120, inflate: 0.85, smooth: 6, detail: 0.04, tolerance: 38,
  depthWeight: 0.65, symmetry: 'auto', flatBase: true, cutoutMode: 'auto',
};

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

/**
 * mode: 'auto' (plain colour if the backdrop is plain, else AI depth),
 *       'color' or 'depth'. depth: { data, w, h } from depth.js, optional.
 */
export function cutout(img, { tolerance = DEFAULTS.tolerance, maxSide = 256, depth = null, mode = 'auto' } = {}) {
  const px = raster(img, maxSide);
  const { w, h, data } = px;
  const n = w * h;
  let mask = new Uint8Array(n);
  let method = 'color';

  let clear = 0;
  for (let i = 0; i < n; i++) if (data[i * 4 + 3] < 128) clear++;
  if (clear > n * 0.02) {
    for (let i = 0; i < n; i++) mask[i] = data[i * 4 + 3] >= 128 ? 1 : 0;
    method = 'alpha';
  } else {
    const plain = colorMask(px, tolerance, mask);
    if (depth && (mode === 'depth' || (mode === 'auto' && plain < 0.6))) {
      depthMask(px, depth, mask);
      method = 'depth';
    }
  }

  mask = open(mask, w, h);
  mask = largestComponent(mask, w, h);
  fillHoles(mask, w, h);
  let area = 0;
  for (let i = 0; i < n; i++) area += mask[i];
  const whole = area < n * 0.01 || area > n * 0.985;
  if (whole) mask.fill(1);
  return { w, h, data, mask, bbox: bbox(mask, w, h), whole, method };
}

// Background = what floods in from the border through pixels close to the
// border's median colour. Returns how plain the border is (0–1).
function colorMask({ w, h, data }, tolerance, mask) {
  const n = w * h;
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
  const plain = stack.length / border.length;
  for (const i of stack) seen[i] = 1;
  while (stack.length) {
    const i = stack.pop(), x = i % w;
    if (x > 0 && !seen[i - 1] && near(i - 1)) { seen[i - 1] = 1; stack.push(i - 1); }
    if (x < w - 1 && !seen[i + 1] && near(i + 1)) { seen[i + 1] = 1; stack.push(i + 1); }
    if (i >= w && !seen[i - w] && near(i - w)) { seen[i - w] = 1; stack.push(i - w); }
    if (i < n - w && !seen[i + w] && near(i + w)) { seen[i + w] = 1; stack.push(i + w); }
  }
  for (let i = 0; i < n; i++) mask[i] = seen[i] ? 0 : 1;
  return plain;
}

// Sample a depth map onto a w×h grid.
function depthOnGrid(depth, w, h) {
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    out[y * w + x] = bilinear(depth.data, depth.w, depth.h, ((x + 0.5) * depth.w) / w, ((y + 0.5) * depth.h) / h);
  }
  return out;
}

// Subject = what stands out from the backdrop in depth. A floor or wall is
// also "near" at the bottom of a photo, so the backdrop is modelled row by
// row from the image's left and right edges (usually background), and the
// subject is what rises above that baseline (Otsu's threshold on the rise).
function depthMask({ w, h }, depth, mask) {
  const d = depthOnGrid(depth, w, h);
  let mn = Infinity, mx = -Infinity;
  for (const v of d) { if (v < mn) mn = v; if (v > mx) mx = v; }
  const range = mx - mn || 1;
  const edge = Math.max(2, Math.round(w * 0.06));
  const baseline = new Float32Array(h);
  for (let y = 0; y < h; y++) {
    const row = [];
    for (let x = 0; x < edge; x++) row.push(d[y * w + x], d[y * w + w - 1 - x]);
    row.sort((a, b) => a - b);
    baseline[y] = row[row.length >> 1];
  }
  smooth1d(baseline, 6);
  const rise = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) rise[y * w + x] = (d[y * w + x] - baseline[y]) / range;
  const bins = 128, lo = -0.2, hi = 1, hist = new Float64Array(bins);
  const bin = v => Math.min(bins - 1, Math.max(0, Math.floor(((v - lo) / (hi - lo)) * bins)));
  for (const v of rise) hist[bin(v)]++;
  let total = 0, sumAll = 0;
  for (let i = 0; i < bins; i++) { total += hist[i]; sumAll += i * hist[i]; }
  let wB = 0, sumB = 0, best = 0, thr = bin(0.08);
  for (let i = 0; i < bins; i++) {
    wB += hist[i]; if (!wB) continue;
    const wF = total - wB; if (!wF) break;
    sumB += i * hist[i];
    const between = wB * wF * (sumB / wB - (sumAll - sumB) / wF) ** 2;
    if (between > best) { best = between; thr = i; }
  }
  thr = Math.max(thr, bin(0.05));
  // Hysteresis: weaker rises (feet, wheels, anything touching the floor)
  // count when they touch the clear subject, within a short reach.
  const thrValue = lo + ((thr + 0.5) / bins) * (hi - lo);
  const weak = thrValue * 0.6, reach = Math.max(3, Math.round(Math.max(w, h) * 0.05));
  const steps = new Int32Array(w * h).fill(-1);
  let queue = [];
  for (let i = 0; i < w * h; i++) if (rise[i] > thrValue) { mask[i] = 1; steps[i] = 0; queue.push(i); } else mask[i] = 0;
  for (let k = 1; k <= reach && queue.length; k++) {
    const next = [];
    for (const i of queue) {
      const x = i % w;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j >= 0 && j < w * h && steps[j] < 0 && rise[j] > weak) { steps[j] = k; mask[j] = 1; next.push(j); }
      }
    }
    queue = next;
  }
}

// Background pockets the border can't reach belong to the subject.
function fillHoles(mask, w, h) {
  const out = new Uint8Array(w * h);
  const stack = [];
  const push = i => { if (!mask[i] && !out[i]) { out[i] = 1; stack.push(i); } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (stack.length) {
    const i = stack.pop(), x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < w * (h - 1)) push(i + w);
  }
  for (let i = 0; i < w * h; i++) if (!out[i]) mask[i] = 1;
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

// Separable Gaussian blur of a float field.
function gaussian(arr, w, h, sigma) {
  if (sigma < 0.3) return arr;
  const r = Math.ceil(sigma * 2.5), k = [];
  let sum = 0;
  for (let i = -r; i <= r; i++) { const v = Math.exp(-(i * i) / (2 * sigma * sigma)); k.push(v); sum += v; }
  for (let i = 0; i < k.length; i++) k[i] /= sum;
  const tmp = new Float32Array(w * h), out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let a = 0;
    for (let t = -r; t <= r; t++) a += arr[y * w + Math.min(w - 1, Math.max(0, x + t))] * k[t + r];
    tmp[y * w + x] = a;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let a = 0;
    for (let t = -r; t <= r; t++) a += tmp[Math.min(h - 1, Math.max(0, y + t)) * w + x] * k[t + r];
    out[y * w + x] = a;
  }
  return out;
}

function percentile(values, p) {
  const a = Float32Array.from(values).sort();
  return a[Math.min(a.length - 1, Math.max(0, Math.floor(p * a.length)))];
}

// Everything the volume needs, in front-image pixel units: the front and back
// half-thicknesses Df / Db (signed distance outside the outline), a per-row
// centre zc, and optionally the side silhouette's signed distance.
function buildShape(front, side, settings, depth) {
  const { w, h, mask } = front;
  const sdf = signedDistance(mask, w, h);
  const hgt = inflate(mask, sdf, w, h);

  // Surface detail: brighter areas swell a little, darker ones sink.
  if (settings.detail) {
    const lumRaw = new Float32Array(w * h);
    let sum = 0, cnt = 0;
    for (let i = 0; i < w * h; i++) {
      lumRaw[i] = (0.299 * front.data[i * 4] + 0.587 * front.data[i * 4 + 1] + 0.114 * front.data[i * 4 + 2]) / 255;
      if (mask[i]) { sum += lumRaw[i]; cnt++; }
    }
    const lum = gaussian(lumRaw, w, h, 1.5), mean = sum / cnt;
    for (let i = 0; i < w * h; i++) if (mask[i]) hgt[i] *= 1 + settings.detail * 2 * (lum[i] - mean);
  }

  const base = new Float32Array(w * h); // smooth body thickness, both sides
  const zc = new Float32Array(h);
  let sideInfo = null;

  if (side && !side.whole) {
    // Line the side photo up with the front: same height, same top.
    const fb = front.bbox, sb = side.bbox;
    const ks = (fb.y1 - fb.y0) / Math.max(1, sb.y1 - sb.y0);
    const sxc = (sb.x0 + sb.x1) / 2;
    const sideSdf = gaussian(signedDistance(side.mask, side.w, side.h), side.w, side.h, 1);
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
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (mask[i]) base[i] = rowMax[y] > 0 ? Math.min(1.15, hgt[i] / rowMax[y]) * rz[y] : 0;
    }
    sideInfo = { cut: side, sdf: sideSdf, ks, sxc, fy0: fb.y0, sy0: sb.y0 };
  } else {
    for (let i = 0; i < w * h; i++) if (mask[i]) base[i] = hgt[i] * settings.inflate;
  }

  // AI depth reshapes the front: what the network sees as nearer comes
  // forward. Its scale is relative, so it is mapped onto the body's own
  // thickness, and tapered to zero at the outline so edges stay round.
  const front3d = Float32Array.from(base);
  const wDepth = depth ? settings.depthWeight : 0;
  if (wDepth > 0) {
    const d = gaussian(depthOnGrid(depth, w, h), w, h, 0.8);
    const inside = [], baseIn = [];
    for (let i = 0; i < w * h; i++) if (mask[i]) { inside.push(d[i]); baseIn.push(base[i]); }
    const lo = percentile(inside, 0.03), hi = percentile(inside, 0.97);
    const scale = percentile(baseIn, 0.97);
    let maxSdf = 0;
    for (let i = 0; i < w * h; i++) if (sdf[i] > maxSdf) maxSdf = sdf[i];
    const rim = Math.max(2, maxSdf * 0.18);
    for (let i = 0; i < w * h; i++) {
      if (!mask[i]) continue;
      const dn = Math.min(1, Math.max(0, (d[i] - lo) / (hi - lo || 1)));
      const taper = Math.sqrt(Math.min(1, sdf[i] / rim));
      const hd = taper * (0.3 + 0.7 * dn) * scale;
      front3d[i] = (1 - wDepth) * base[i] + wDepth * hd;
    }
  }

  // Mirror-symmetric subjects get mirror-symmetric depth.
  const fb = front.bbox;
  let symmetric = settings.symmetry === 'on';
  if (settings.symmetry === 'auto') {
    let both = 0, any = 0;
    for (let y = fb.y0; y < fb.y1; y++) for (let x = fb.x0; x < fb.x1; x++) {
      const m = mask[y * w + x], mm = mask[y * w + (fb.x0 + fb.x1 - 1 - x)];
      if (m && mm) both++;
      if (m || mm) any++;
    }
    symmetric = any > 0 && both / any > 0.9;
  }
  if (symmetric) {
    for (const arr of [front3d, base]) {
      const copy = Float32Array.from(arr);
      for (let y = fb.y0; y < fb.y1; y++) for (let x = fb.x0; x < fb.x1; x++) {
        const i = y * w + x, j = y * w + (fb.x0 + fb.x1 - 1 - x);
        if (mask[i] && mask[j]) arr[i] = (copy[i] + copy[j]) / 2;
      }
    }
  }

  // The back is never seen, so it is predicted the way a modeller blocks it
  // out: the big forms of the front (a head, a belly) carry round to the
  // back, the small ones (a nose, buttons) do not.
  const back3d = Float32Array.from(base);
  if (wDepth > 0) {
    const rel = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) if (mask[i]) rel[i] = front3d[i] - base[i];
    const low = gaussian(rel, w, h, Math.max(2, 0.05 * Math.max(w, h)));
    for (let i = 0; i < w * h; i++) if (mask[i]) back3d[i] = Math.max(base[i] * 0.6, base[i] + 0.55 * low[i]);
  }

  // One field per side: thickness inside, signed distance outside. A light
  // blur rounds the pixel staircase off the outline and the Poisson grid.
  const sigma = 0.8 + 0.12 * settings.smooth;
  const Df = new Float32Array(w * h), Db = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    Df[i] = mask[i] ? front3d[i] : sdf[i];
    Db[i] = mask[i] ? back3d[i] : sdf[i];
  }
  const shape = {
    w, h, bbox: fb, Df: gaussian(Df, w, h, sigma), Db: gaussian(Db, w, h, sigma), zc, side: sideInfo, depth: 0, symmetric,
    base: settings.flatBase && !front.whole ? fb.y1 - 0.02 * (fb.y1 - fb.y0) : Infinity,
  };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    shape.depth = Math.max(shape.depth, Math.abs(zc[y]) + Math.max(shape.Df[i], shape.Db[i], 0));
  }
  return shape;
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

function rowCentre(shape, v) {
  const { h, zc } = shape;
  const vy = Math.min(Math.max(v - 0.5, 0), h - 1), y0 = vy | 0;
  return zc[y0] + (zc[Math.min(h - 1, y0 + 1)] - zc[y0]) * (vy - y0);
}

// The field at a point (u, v in front pixels, z in the same units, 0 = middle;
// +z faces the front camera). Positive inside.
function fieldAt(shape, u, v, z) {
  const dz = z - rowCentre(shape, v);
  let f = Math.min(bilinear(shape.Df, shape.w, shape.h, u, v) - dz, bilinear(shape.Db, shape.w, shape.h, u, v) + dz);
  if (shape.side) f = smin(f, sideField(shape.side, v, z));
  if (shape.base !== Infinity) f = Math.min(f, shape.base - v);
  return f;
}

function sideField(s, v, z) {
  const a = z / s.ks + s.sxc, b = (v - s.fy0) / s.ks + s.sy0;
  return bilinear(s.sdf, s.cut.w, s.cut.h, a, b) * s.ks;
}

// ---------------------------------------------------------------------------
// 3. Surface

// The voxel grid covers the subject, not the whole photo, so a small subject
// in a big frame still gets the full resolution.
function volumeTransform(shape, N) {
  const pad = 4, b = shape.bbox;
  const span = Math.max(b.x1 - b.x0 + 4, b.y1 - b.y0 + 4, shape.depth * 2 + 2);
  const s = (N - 2 * pad) / span;
  const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
  return {
    s, N,
    // voxel index → front pixel coordinates
    u: ix => (ix - N / 2) / s + cx,
    v: iy => (N / 2 - iy) / s + cy,
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
    const zrow = rowCentre(shape, v);
    const floor = shape.base - v;
    for (let ix = 0; ix < N; ix++) {
      const u = T.u(ix);
      const df = bilinear(shape.Df, shape.w, shape.h, u, v), db = bilinear(shape.Db, shape.w, shape.h, u, v);
      const base = ix + iy * N;
      for (let iz = 0; iz < N; iz++) {
        const dz = zs[iz] - zrow;
        let f = Math.min(df - dz, db + dz);
        if (sidePlane) f = smin(f, sidePlane[iy * N + iz]);
        if (floor < f) f = floor;
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
    ctx.drawImage(unseenSide(frontTex, front), TILE, 0);
  }
  if (cuts.side) ctx.drawImage(subjectTexture(inputs.side, cuts.side, TILE, TILE, (c, im) => c.drawImage(im, 0, 0, TILE, TILE)), TILE * 2, 0);
  return { canvas: atlas, tiles, predictedBack: !(cuts.back && !cuts.back.whole) };
}

// Colour for surfaces no photo shows, guessed the way a painter would: the
// character's big colour areas (a hood, fur, a coat) continue round the
// back; small ones (eyes, cheeks, a mouth, a logo) belong to the front.
// The front's palette is found with k-means; colours covering little of the
// subject are replaced by the nearest big one, then everything is blurred.
function unseenSide(tex, cut) {
  const S = 48;
  const small = canvas(S, S);
  const sctx = small.getContext('2d', { willReadFrequently: true });
  sctx.imageSmoothingQuality = 'high';
  sctx.drawImage(tex, 0, 0, S, S);
  const px = sctx.getImageData(0, 0, S, S);
  const d = px.data;

  // Which samples are the subject (the bled texture is opaque everywhere).
  const m = canvas(S, S), mctx = m.getContext('2d', { willReadFrequently: true });
  mctx.drawImage(maskCanvas(cut), 0, 0, S, S);
  const md = mctx.getImageData(0, 0, S, S).data;
  const samples = [];
  for (let i = 0; i < S * S; i++) if (md[i * 4 + 3] > 128) samples.push([d[i * 4], d[i * 4 + 1], d[i * 4 + 2]]);
  if (samples.length < 8) return small;

  const K = Math.min(5, samples.length);
  let centres = Array.from({ length: K }, (_, k) => samples[Math.floor(((k + 0.5) * samples.length) / K)].slice());
  const nearest = (c, list) => {
    let best = 0, bd = Infinity;
    list.forEach((q, k) => { const dd = (c[0] - q[0]) ** 2 + (c[1] - q[1]) ** 2 + (c[2] - q[2]) ** 2; if (dd < bd) { bd = dd; best = k; } });
    return best;
  };
  let counts;
  for (let it = 0; it < 10; it++) {
    const sum = centres.map(() => [0, 0, 0]);
    counts = centres.map(() => 0);
    for (const c of samples) { const k = nearest(c, centres); counts[k]++; sum[k][0] += c[0]; sum[k][1] += c[1]; sum[k][2] += c[2]; }
    centres = centres.map((q, k) => (counts[k] ? sum[k].map(v => v / counts[k]) : q));
  }
  const major = centres.filter((_, k) => counts[k] / samples.length >= 0.12);
  const palette = major.length ? major : [centres[counts.indexOf(Math.max(...counts))]];

  for (let i = 0; i < S * S; i++) {
    const c = [d[i * 4], d[i * 4 + 1], d[i * 4 + 2]], q = palette[nearest(c, palette)];
    d[i * 4] = q[0] * 0.92 + c[0] * 0.08; d[i * 4 + 1] = q[1] * 0.92 + c[1] * 0.08; d[i * 4 + 2] = q[2] * 0.92 + c[2] * 0.08;
  }
  sctx.putImageData(px, 0, 0);
  const tiny = canvas(S / 3, S / 3);
  const tctx = tiny.getContext('2d');
  tctx.imageSmoothingQuality = 'high';
  tctx.drawImage(small, 0, 0, tiny.width, tiny.height);
  const out = canvas(TILE, TILE);
  const octx = out.getContext('2d');
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(small, 0, 0, TILE, TILE);
  octx.globalAlpha = 0.6;
  octx.drawImage(tiny, 0, 0, TILE, TILE);
  return out;
}

// A canvas of the image at the cut's resolution (so place() can scale by k).
function imageAt(img, cut) {
  const c = canvas(cut.w * 4, cut.h * 4);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c;
}

// Pick a projection per face and write UVs. Expects non-indexed geometry in
// front-pixel space.
function projectUVs(geo, shape, tiles, predictedBack = false) {
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
    // Faces the camera only grazes would stretch the photo into streaks;
    // without a side photo they take the predicted colours instead.
    else if (!shape.side && predictedBack && Math.abs(nz) < 0.3 * n.length()) tile = 1;
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
 * inputs: { front: Image, side?: Image, back?: Image, depth?: depth map of front (depth.js) }
 * settings: see DEFAULTS
 * onStage(index, name): called as each stage starts
 */
export async function buildModel(inputs, settings = {}, onStage = () => {}) {
  const S = { ...DEFAULTS, ...settings };
  const t0 = performance.now();
  const step = async i => { onStage(i, STAGES[i]); await frame(); };

  await step(0);
  const work = Math.min(256, Math.max(96, Math.round(S.resolution * 2)));
  // inputs.cache (an object) lets repeated builds reuse the cutouts.
  const key = [S.tolerance, work, S.cutoutMode].join('|');
  let cuts = inputs.cache?.key === key ? inputs.cache.cuts : null;
  if (!cuts) {
    cuts = {
      front: cutout(inputs.front, { tolerance: S.tolerance, maxSide: work, depth: inputs.depth, mode: S.cutoutMode }),
      side: inputs.side ? cutout(inputs.side, { tolerance: S.tolerance, maxSide: work }) : null,
      back: inputs.back ? cutout(inputs.back, { tolerance: S.tolerance, maxSide: work }) : null,
    };
    if (inputs.cache) Object.assign(inputs.cache, { key, cuts });
  }

  await step(1);
  const shape = buildShape(cuts.front, cuts.side, S, inputs.depth);

  await step(2);
  const N = S.preview ? Math.round(S.resolution)
    : S.style === 'lowpoly' ? Math.round(Math.min(S.resolution, 44)) : S.style === 'voxel' ? 0 : Math.round(S.resolution);
  let geo = null;
  if (N) {
    geo = marchingCubes(shape, N);
    // Smoothing is given per 120 voxels so it looks the same at every detail level.
    taubin(geo, S.style === 'lowpoly' ? Math.min(2, S.smooth) : Math.round(S.smooth * Math.max(1, N / 120)));
  }

  // Preview builds (auto-copy's search) skip texturing: shape only, in clay.
  if (S.preview && geo) {
    toModelSpace(geo, shape);
    if (signedVolume(geo) < 0) {
      const idx = geo.index.array;
      for (let t = 0; t < idx.length; t += 3) { const k = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = k; }
    }
    geo.computeVertexNormals();
    const group = new THREE.Group();
    group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xb9b2a7, roughness: 0.9 })));
    return {
      object: group, cutouts: cuts,
      depthGrid: inputs.depth ? depthOnGrid(inputs.depth, cuts.front.w, cuts.front.h) : null,
      stats: { triangles: geo.index.count / 3, vertices: geo.attributes.position.count, ms: Math.round(performance.now() - t0), views: 1 + !!cuts.side + !!cuts.back },
    };
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
    projectUVs(geo, shape, atlas.tiles, atlas.predictedBack);
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
    depthGrid: inputs.depth ? depthOnGrid(inputs.depth, cuts.front.w, cuts.front.h) : null,
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
