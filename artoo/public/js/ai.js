// On-device AI for Artoo, run with ONNX Runtime Web on the CPU (WebAssembly,
// one thread, so it works without cross-origin isolation):
//
//   Depth    Depth Anything V2 Small (Apache-2.0, int8): how near each pixel
//            is. About 1–3 s per photo.
//   Cutout   SlimSAM-77 (Segment Anything, Apache-2.0, int8): separates the
//            character from the background. Prompted with points: depth
//            says roughly where the subject is, so positive points go inside
//            it and negative ones on the far background; the viewer can add
//            more by clicking. Encoding takes a few seconds once per image,
//            each correction after that a fraction of a second.
//
// Where the files come from is the caller's choice: the claude.ai artifact
// publishes them next to the page (Base64 text parts, its file rules), the
// server app can point at Hugging Face directly.

import { cutout } from './engine.js';

const ORT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/ort.wasm.bundle.min.mjs';
const MEAN = [0.485, 0.456, 0.406], STD = [0.229, 0.224, 0.225];

let loading = null;
let ort = null;
const sessions = {};

// Fetch one logical file from one or more parts, reporting bytes as they land.
async function fetchParts(urls, onBytes) {
  const buffers = [];
  for (const url of urls) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Could not download the AI models (${res.status}).`);
    const reader = res.body.getReader();
    const chunks = [];
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      onBytes(value.length);
    }
    // Parts named *.b64.txt are Base64 text (for hosts that serve text and
    // web media types only); each part decodes on its own.
    if (url.endsWith('.b64.txt')) {
      const bin = atob(new TextDecoder().decode(join(chunks)).trim());
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      buffers.push(bytes);
    } else {
      buffers.push(join(chunks));
    }
  }
  return join(buffers);
}

function join(buffers) {
  const out = new Uint8Array(buffers.reduce((n, b) => n + b.length, 0));
  let o = 0;
  for (const b of buffers) { out.set(b, o); o += b.length; }
  return out;
}

/**
 * sources: { wasm, depth, segEncoder, segDecoder: [urls], totalBytes, ort? }
 * onProgress({ loaded, total, phase: 'download' | 'start' })
 */
export function loadAI(sources, onProgress = () => {}) {
  if (loading) return loading;
  loading = (async () => {
    let loaded = 0;
    const tick = n => { loaded += n; onProgress({ loaded, total: sources.totalBytes, phase: 'download' }); };
    const [mod, wasm, depth, enc, dec] = await Promise.all([
      import(sources.ort || ORT),
      fetchParts(sources.wasm, tick), fetchParts(sources.depth, tick),
      fetchParts(sources.segEncoder, tick), fetchParts(sources.segDecoder, tick),
    ]);
    onProgress({ loaded, total: sources.totalBytes, phase: 'start' });
    mod.env.wasm.numThreads = 1;
    mod.env.wasm.wasmBinary = wasm.buffer;
    const opts = { executionProviders: ['wasm'], graphOptimizationLevel: 'all' };
    sessions.depth = await mod.InferenceSession.create(depth, opts);
    sessions.enc = await mod.InferenceSession.create(enc, opts);
    sessions.dec = await mod.InferenceSession.create(dec, opts);
    ort = mod;
  })();
  loading.catch(() => { loading = null; });
  return loading;
}

export const aiReady = () => Boolean(ort);

function pixels(img, W, H) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, W, H);
  return ctx.getImageData(0, 0, W, H).data;
}

const size = img => [img.naturalWidth || img.width, img.naturalHeight || img.height];

// ---------------------------------------------------------------------------
// Depth

/** Relative depth: { data: Float32Array, w, h }, larger = nearer. */
export async function estimateDepth(img, side = 392) {
  if (!ort) throw new Error('The AI models are not loaded yet.');
  const [iw, ih] = size(img), k = side / Math.max(iw, ih);
  const W = Math.max(14, Math.round((iw * k) / 14) * 14), H = Math.max(14, Math.round((ih * k) / 14) * 14);
  const px = pixels(img, W, H), x = new Float32Array(3 * W * H);
  for (let i = 0; i < W * H; i++) for (let ch = 0; ch < 3; ch++) x[ch * W * H + i] = (px[i * 4 + ch] / 255 - MEAN[ch]) / STD[ch];
  const s = sessions.depth;
  const out = await s.run({ [s.inputNames[0]]: new ort.Tensor('float32', x, [1, 3, H, W]) });
  const t = out[s.outputNames[0]];
  return { data: Float32Array.from(t.data), w: t.dims[2], h: t.dims[1] };
}

/** A greyscale picture of a depth map, for previews. */
export function depthPreview(depth, px = 200) {
  let mn = Infinity, mx = -Infinity;
  for (const v of depth.data) { if (v < mn) mn = v; if (v > mx) mx = v; }
  const c = document.createElement('canvas');
  c.width = depth.w; c.height = depth.h;
  const ctx = c.getContext('2d');
  const id = ctx.createImageData(depth.w, depth.h);
  for (let i = 0; i < depth.data.length; i++) {
    const g = (255 * (depth.data[i] - mn)) / (mx - mn || 1);
    id.data[i * 4] = g * 0.92; id.data[i * 4 + 1] = g * 0.97; id.data[i * 4 + 2] = g; id.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(id, 0, 0);
  const s = px / Math.max(depth.w, depth.h);
  const out = document.createElement('canvas');
  out.width = Math.round(depth.w * s); out.height = Math.round(depth.h * s);
  out.getContext('2d').drawImage(c, 0, 0, out.width, out.height);
  return out;
}

// ---------------------------------------------------------------------------
// Background removal

const embeddings = new WeakMap();

async function embed(img) {
  if (embeddings.has(img)) return embeddings.get(img);
  const [W, H] = size(img), k = 1024 / Math.max(W, H);
  const rw = Math.round(W * k), rh = Math.round(H * k);
  const c = document.createElement('canvas');
  c.width = c.height = 1024;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, rw, rh);
  const px = ctx.getImageData(0, 0, 1024, 1024).data, x = new Float32Array(3 * 1024 * 1024);
  for (let y = 0; y < rh; y++) for (let xx = 0; xx < rw; xx++) {
    const i = y * 1024 + xx;
    for (let ch = 0; ch < 3; ch++) x[ch * 1048576 + i] = (px[i * 4 + ch] / 255 - MEAN[ch]) / STD[ch];
  }
  const e = await sessions.enc.run({ pixel_values: new ort.Tensor('float32', x, [1, 3, 1024, 1024]) });
  const handle = { e, W, H, k };
  embeddings.set(img, handle);
  return handle;
}

// points: [{ x, y, on }] in image pixels; on = true for "character".
async function decode(handle, points) {
  const n = points.length + 1;
  const P = new Float32Array(n * 2), L = new BigInt64Array(n);
  points.forEach((p, i) => { P[i * 2] = p.x * handle.k; P[i * 2 + 1] = p.y * handle.k; L[i] = p.on ? 1n : 0n; });
  L[n - 1] = -10n; // "not a point" padding, as the model was trained with
  const d = await sessions.dec.run({
    input_points: new ort.Tensor('float32', P, [1, 1, n, 2]),
    input_labels: new ort.Tensor('int64', L, [1, 1, n]),
    image_embeddings: handle.e.image_embeddings,
    image_positional_embeddings: handle.e.image_positional_embeddings,
  });
  return { logits: d.pred_masks.data, scores: Array.from(d.iou_scores.data) };
}

// One of the three proposed masks, as logits sampled on a w×h grid.
function logitsOnGrid(handle, logits, m, w, h) {
  const S = 256, out = new Float32Array(w * h), base = m * S * S;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let lx = (((x + 0.5) * handle.W) / w) * handle.k / 4 - 0.5, ly = (((y + 0.5) * handle.H) / h) * handle.k / 4 - 0.5;
    lx = Math.min(Math.max(lx, 0), S - 1.001); ly = Math.min(Math.max(ly, 0), S - 1.001);
    const x0 = lx | 0, y0 = ly | 0, fx = lx - x0, fy = ly - y0, i = base + y0 * S + x0;
    out[y * w + x] = (logits[i] * (1 - fx) + logits[i + 1] * fx) * (1 - fy) + (logits[i + S] * (1 - fx) + logits[i + S + 1] * fx) * fy;
  }
  return out;
}

// Chamfer distance to the nearest pixel outside `mask` (or inside, when inverted).
function distanceIn(mask, w, h) {
  const d = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) d[i] = mask[i] ? 1e9 : 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x; if (!d[i]) continue;
    d[i] = Math.min(d[i], x ? d[i - 1] + 1 : 1, y ? d[i - w] + 1 : 1);
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x; if (!d[i]) continue;
    d[i] = Math.min(d[i], x < w - 1 ? d[i + 1] + 1 : 1, y < h - 1 ? d[i + w] + 1 : 1);
  }
  return d;
}

// The n most interior points of a mask, kept apart from each other.
function interiorPoints(mask, w, h, n, minRatio) {
  const d = distanceIn(mask, w, h), pts = [];
  let first = 0;
  for (let k = 0; k < n; k++) {
    let best = -1, bi = -1;
    for (let i = 0; i < w * h; i++) if (d[i] > best) { best = d[i]; bi = i; }
    if (bi < 0 || best <= 0 || (k && best < first * minRatio)) break;
    if (!k) first = best;
    const bx = bi % w, by = (bi / w) | 0;
    pts.push({ x: bx + 0.5, y: by + 0.5 });
    const r = Math.max(best * 2, Math.max(w, h) * 0.12);
    for (let y = Math.max(0, by - r | 0); y < Math.min(h, by + r + 1); y++) for (let x = Math.max(0, bx - r | 0); x < Math.min(w, bx + r + 1); x++) {
      if ((x - bx) ** 2 + (y - by) ** 2 < r * r) d[y * w + x] = 0;
    }
  }
  return pts;
}

/**
 * Separate the subject from the background.
 * depth (optional) guides where to point; extra = [{x, y, on}] the viewer
 * clicked, in image pixels. Returns { canvas (subject with transparent
 * background, image size), alpha, points, coverage }.
 */
export async function removeBackground(img, { depth = null, extra = [] } = {}) {
  if (!ort) throw new Error('The AI models are not loaded yet.');
  const handle = await embed(img);
  const [W, H] = size(img);

  // A rough guess of the subject: depth's cutout, or the middle of the frame.
  const g = depth ? cutout(img, { depth, mode: 'depth', maxSide: 160 }) : null;
  const gw = g ? g.w : 160, gh = g ? g.h : Math.max(8, Math.round((160 * H) / W));
  let guess = g && !g.whole ? g.mask : null;
  if (!guess) {
    guess = new Uint8Array(gw * gh);
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) guess[y * gw + x] = ((x / gw - 0.5) / 0.32) ** 2 + ((y / gh - 0.52) / 0.38) ** 2 < 1 ? 1 : 0;
  }
  const sx = W / gw, sy = H / gh;
  const inside = interiorPoints(guess, gw, gh, 3, 0.45).map(p => ({ x: p.x * sx, y: p.y * sy, on: true }));
  const outside = interiorPoints(guess.map(v => 1 - v), gw, gh, 4, 0.3).map(p => ({ x: p.x * sx, y: p.y * sy, on: false }));
  const corners = [[0.02, 0.02], [0.98, 0.02], [0.02, 0.98], [0.98, 0.98]].map(([u, v]) => ({ x: u * W, y: v * H, on: false }));
  const auto = [...inside, ...outside, ...corners];

  // Depth on the guess grid, and the level that separates subject from
  // backdrop: halfway between their typical depths.
  let near = null, farLevel = -Infinity;
  if (depth) {
    near = new Float32Array(gw * gh);
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const dx = Math.min(depth.w - 1, Math.floor(((x + 0.5) * depth.w) / gw)), dy = Math.min(depth.h - 1, Math.floor(((y + 0.5) * depth.h) / gh));
      near[y * gw + x] = depth.data[dy * depth.w + dx];
    }
    const ins = [], outs = [];
    for (let i = 0; i < gw * gh; i++) (guess[i] ? ins : outs).push(near[i]);
    const med = a => a.sort((p, q) => p - q)[a.length >> 1];
    if (ins.length && outs.length) farLevel = (med(ins) + med(outs)) / 2;
  }

  // Several ways of pointing, three proposals each. The winner is the one
  // the model is sure of that agrees with the guess, does not run off the
  // edges of the picture, and holds little that is far away (walls, panels).
  const promptSets = extra.length
    ? [[...auto, ...extra], [...inside, ...extra], extra]
    : [auto, [...inside, ...corners], inside];
  let best = null;
  for (const points of promptSets) {
    if (!points.some(p => p.on)) continue;
    const { logits, scores } = await decode(handle, points);
    for (let m = 0; m < 3; m++) {
      const l = logitsOnGrid(handle, logits, m, gw, gh);
      let area = 0, both = 0, any = 0, edge = 0, edgeN = 0, far = 0, clickOk = 0;
      for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
        const i = y * gw + x, on = l[i] > 0;
        area += on;
        if (on && guess[i]) both++;
        if (on || guess[i]) any++;
        if (x === 0 || y === 0 || x === gw - 1 || y === gh - 1) { edgeN++; edge += on; }
        if (on && near && near[i] < farLevel) far++;
      }
      for (const p of extra) {
        const gx = Math.min(gw - 1, Math.floor(p.x / sx)), gy = Math.min(gh - 1, Math.floor(p.y / sy));
        if ((l[gy * gw + gx] > 0) === p.on) clickOk++;
      }
      const frac = area / (gw * gh);
      const s = scores[m]
        * (0.4 + 0.6 * (any ? both / any : 0))
        * (1 - 0.8 * (edge / edgeN))
        * (frac > 0.01 && frac < 0.95 ? 1 : 0.2)
        * (1 - 0.7 * (area ? far / area : 0))
        * (extra.length ? 0.3 + 0.7 * (clickOk / extra.length) : 1); // the viewer's clicks must hold
      if (!best || s > best.s) best = { s, logits, m, points };
    }
  }
  const { logits, m: chosen, points } = best;

  // Full-resolution alpha with soft edges; keep the largest piece.
  const l = logitsOnGrid(handle, logits, chosen, W, H);
  // Clearly far regions the mask still holds are backdrop: drop them,
  // unless the viewer clicked "character" on such a region.
  const gridAt = (x, y) => Math.min(gh - 1, Math.floor(y / sy)) * gw + Math.min(gw - 1, Math.floor(x / sx));
  const keepFar = extra.some(p => p.on && !guess[gridAt(p.x, p.y)] && near && near[gridAt(p.x, p.y)] < farLevel);
  if (near && !keepFar) {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const gi = gridAt(x, y);
      if (!guess[gi] && near[gi] < farLevel && l[y * W + x] > 0) l[y * W + x] = -1;
    }
  }
  const alpha = new Float32Array(W * H), hard = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) { alpha[i] = 1 / (1 + Math.exp(-l[i] * 1.5)); hard[i] = l[i] > 0 ? 1 : 0; }
  const keep = largestPiece(hard, W, H);
  let covered = 0;
  for (let i = 0; i < W * H; i++) { if (!keep[i]) alpha[i] = 0; else if (!hard[i]) alpha[i] = 1; covered += keep[i]; }

  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0, W, H);
  const id = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < W * H; i++) id.data[i * 4 + 3] = Math.round(id.data[i * 4 + 3] * alpha[i]);
  ctx.putImageData(id, 0, 0);
  return { canvas: c, alpha, points, auto, coverage: covered / (W * H) };
}

function largestPiece(mask, w, h) {
  const label = new Int32Array(w * h);
  let best = 0, bestSize = 0, next = 0;
  for (let s = 0; s < w * h; s++) {
    if (!mask[s] || label[s]) continue;
    next++;
    let n = 0;
    const stack = [s];
    label[s] = next;
    while (stack.length) {
      const i = stack.pop(), x = i % w;
      n++;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j >= 0 && j < w * h && mask[j] && !label[j]) { label[j] = next; stack.push(j); }
      }
    }
    if (n > bestSize) { bestSize = n; best = next; }
  }
  const out = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = label[i] === best ? 1 : 0;
  // Holes inside the subject (between arm and body stay open: they touch
  // the background through the outline) are filled.
  const outside = new Uint8Array(w * h), stack = [];
  const push = i => { if (!out[i] && !outside[i]) { outside[i] = 1; stack.push(i); } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (stack.length) {
    const i = stack.pop(), x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < w * (h - 1)) push(i + w);
  }
  for (let i = 0; i < w * h; i++) if (!outside[i]) out[i] = 1;
  return out;
}
