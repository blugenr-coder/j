// AI depth: Depth Anything V2 Small (Apache-2.0), int8, run with ONNX
// Runtime Web on the CPU (WebAssembly, one thread, so it works without
// cross-origin isolation). About 1–3 s per photo.
//
// Where the files come from is the caller's choice: the claude.ai artifact
// publishes them next to the page in <15 MB parts (its file limit), the
// server app can point at Hugging Face directly.

const ORT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/ort.wasm.bundle.min.mjs';
const MEAN = [0.485, 0.456, 0.406], STD = [0.229, 0.224, 0.225];

let sessionPromise = null;
let ortModule = null;

// Fetch one logical file from one or more parts, reporting bytes as they land.
async function fetchParts(urls, onBytes) {
  const buffers = [];
  for (const url of urls) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Could not download the depth model (${res.status}).`);
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
 * sources: { wasm: [urls], model: [urls], totalBytes, ort?: url of the ORT module }
 * onProgress({ loaded, total, phase })
 */
export function loadDepthModel(sources, onProgress = () => {}) {
  if (sessionPromise) return sessionPromise;
  sessionPromise = (async () => {
    let loaded = 0;
    const tick = n => { loaded += n; onProgress({ loaded, total: sources.totalBytes, phase: 'download' }); };
    const [ort, wasm, model] = await Promise.all([import(sources.ort || ORT), fetchParts(sources.wasm, tick), fetchParts(sources.model, tick)]);
    onProgress({ loaded, total: sources.totalBytes, phase: 'start' });
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.wasmBinary = wasm.buffer;
    ortModule = ort;
    return ort.InferenceSession.create(model, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
  })();
  sessionPromise.catch(() => { sessionPromise = null; });
  return sessionPromise;
}

export const depthReady = () => Boolean(ortModule);

/**
 * Relative depth for an image: { data: Float32Array, w, h }, larger = nearer.
 * `side` is the long edge fed to the network (multiple of 14).
 */
export async function estimateDepth(img, side = 392) {
  const session = await sessionPromise;
  if (!session) throw new Error('Load the depth model first.');
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const k = side / Math.max(iw, ih);
  const W = Math.max(14, Math.round((iw * k) / 14) * 14), H = Math.max(14, Math.round((ih * k) / 14) * 14);
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, W, H);
  const px = ctx.getImageData(0, 0, W, H).data;
  const x = new Float32Array(3 * W * H);
  for (let i = 0; i < W * H; i++) for (let ch = 0; ch < 3; ch++) x[ch * W * H + i] = (px[i * 4 + ch] / 255 - MEAN[ch]) / STD[ch];
  const out = await session.run({ [session.inputNames[0]]: new ortModule.Tensor('float32', x, [1, 3, H, W]) });
  const t = out[session.outputNames[0]];
  return { data: Float32Array.from(t.data), w: t.dims[2], h: t.dims[1] };
}

// A greyscale picture of a depth map, for previews.
export function depthPreview(depth, size = 200) {
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
  const s = size / Math.max(depth.w, depth.h);
  const out = document.createElement('canvas');
  out.width = Math.round(depth.w * s); out.height = Math.round(depth.h * s);
  out.getContext('2d').drawImage(c, 0, 0, out.width, out.height);
  return out;
}
