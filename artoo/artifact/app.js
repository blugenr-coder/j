// Artoo Studio, the artifact edition. Everything runs in the viewer's browser;
// the claude.ai runtime adds a private per-person collection (db + user),
// file saving (downloads) and the modelling chat (sample: Claude, on the
// viewer's own account). Without them the studio still works for the session.
//
// Build: artoo/artifact/build.mjs concatenates engine.js, sample.js,
// viewer.js, ai.js, match.js and this file into one module. Imports here are
// for local runs.

import * as THREE from 'three';
import { buildModel, cutout, cutoutPreview, STAGES, STYLES, DEFAULTS, toGLB, toOBJ, toSTL, zip, loadImage } from '../public/js/engine.js';
import { cactusFront, cactusSide } from '../public/js/sample.js';
import { createViewer, VIEW_MODES, LIGHTS } from '../public/js/viewer.js';
import { loadAI, estimateDepth, depthPreview, removeBackground } from '../public/js/ai.js';
import { scoreCopy, autoCopy, frontRender, referenceCrop } from '../public/js/match.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Shape recipes the studio learns between. depthWeight only matters when the
// AI is on.
const RECIPES = [
  { id: 'round', label: 'Round', settings: { inflate: 1.0, smooth: 8, detail: 0.03, depthWeight: 0.5 } },
  { id: 'balanced', label: 'Balanced', settings: { inflate: 0.85, smooth: 6, detail: 0.05, depthWeight: 0.65 } },
  { id: 'puffy', label: 'Puffy', settings: { inflate: 1.2, smooth: 10, detail: 0.02, depthWeight: 0.45 } },
  { id: 'relief', label: 'Relief', settings: { inflate: 0.55, smooth: 5, detail: 0.1, depthWeight: 0.85 } },
  { id: 'crisp', label: 'Crisp', settings: { inflate: 0.9, smooth: 3, detail: 0.08, depthWeight: 0.75 } },
];
const QUALITY = { 80: 'Draft', 120: 'Standard', 144: 'High' };
const SHAPE_KEYS = ['inflate', 'smooth', 'detail', 'depthWeight', 'symmetry'];
const pick = (o, keys) => Object.fromEntries(keys.filter(k => o[k] !== undefined).map(k => [k, o[k]]));

// The runtime and both models, published next to the page. Models are Base64
// text parts: artifacts serve text, not raw binaries, under 16 MB a file.
const AI_SOURCES = window.ARTOO_AI_SOURCES || {
  wasm: ['ai/ort-wasm-simd-threaded.wasm'],
  depth: [1, 2, 3].map(k => `ai/depth-anything-v2-small-q8.${k}.b64.txt`),
  segEncoder: ['ai/slimsam-encoder-q8.b64.txt'],
  segDecoder: ['ai/slimsam-decoder-q8.b64.txt'],
  totalBytes: 14239897 + 3 * 12115024 + 11842888 + 6538416,
};
const AI_SIZE = '68 MB';

const ui = {
  front: null,              // { original, dataUrl, cut, cutBy, maskUrl, preview, small }
  extra: { side: null, back: null },
  style: 'textured', resolution: 120, tolerance: DEFAULTS.tolerance,
  shapeMode: 'auto', variants: 3,
  manual: { inflate: 0.85, smooth: 6, detail: 0.04, depthWeight: 0.65 },
  ai: { on: false, ready: false, loading: null }, depth: null, // depth: { key, map }
  bg: { extra: [], busy: false },
  parts: [],
  results: [], selected: -1, busy: false, autoAbort: null,
  arms: Object.fromEntries(RECIPES.map(r => [r.id, { n: 0, sum: 0 }])),
  gallery: [],
  store: null, downloads: null, sample: null, chat: { turns: [], abort: null },
};

// ---------------------------------------------------------------------------
// Learning (Thompson sampling over recipes)

function gammaDraw(k) {
  if (k < 1) return gammaDraw(k + 1) * Math.random() ** (1 / k);
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x, v;
    do {
      x = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
      v = 1 + c * x;
    } while (v <= 0);
    v = v ** 3;
    if (Math.log(Math.random()) < 0.5 * x * x + d - d * v + d * Math.log(v)) return d * v;
  }
}
const betaDraw = (a, b) => { const x = gammaDraw(a); return x / (x + gammaDraw(b)); };
const armMean = s => (1 + s.sum) / (2 + s.n);

function chooseRecipes(count) {
  return RECIPES.map(r => {
    const s = ui.arms[r.id];
    return { r, draw: betaDraw(1 + s.sum, 1 + s.n - s.sum) };
  }).sort((a, b) => b.draw - a.draw).slice(0, count).map(x => x.r);
}

function bestRecipe() {
  return [...RECIPES].sort((a, b) => armMean(ui.arms[b.id]) - armMean(ui.arms[a.id]) || ui.arms[b.id].n - ui.arms[a.id].n)[0];
}

// ---------------------------------------------------------------------------
// Your image

const checker = (ctx, w, h) => {
  for (let y = 0; y < h; y += 10) for (let x = 0; x < w; x += 10) {
    ctx.fillStyle = ((x + y) / 10) % 2 ? '#2b3439' : '#363f45';
    ctx.fillRect(x, y, 10, 10);
  }
};

// Cap big pictures, enlarge tiny ones (a 112-pixel screenshot has too few
// pixels to cut out or shape well), keep any transparency, and keep a
// flattened JPEG copy: the saved collection rebuilds from exactly that.
async function normalizeImage(source, maxSide) {
  const w0 = source.naturalWidth || source.width, h0 = source.naturalHeight || source.height;
  const long = Math.max(w0, h0);
  const s = long > maxSide ? maxSide / long : long < 512 ? 512 / long : 1;
  const c = document.createElement('canvas');
  c.width = Math.round(w0 * s); c.height = Math.round(h0 * s);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, c.width, c.height);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  let clear = 0;
  for (let i = 3; i < d.length; i += 4) if (d[i] < 250) clear++;
  const flat = document.createElement('canvas');
  flat.width = c.width; flat.height = c.height;
  const fctx = flat.getContext('2d');
  fctx.fillStyle = '#ffffff';
  fctx.fillRect(0, 0, flat.width, flat.height);
  fctx.drawImage(c, 0, 0);
  const dataUrl = flat.toDataURL('image/jpeg', 0.88);
  return { original: await loadImage(dataUrl), dataUrl, alphaCut: clear > c.width * c.height * 0.01 ? c : null, small: long < 256, srcSize: [w0, h0] };
}

const frontImage = () => ui.front.cut || ui.front.original;
const frontDepth = () => (ui.depth && ui.front && ui.depth.key === ui.front.dataUrl ? ui.depth.map : null);

// The subject over a checkerboard, so what was removed is obvious.
function frontPreview() {
  const f = ui.front, W = 360;
  const src = f.cut;
  if (!src) return cutoutPreview(cutout(f.original, { tolerance: ui.tolerance, maxSide: 256 }), W);
  const k = W / Math.max(src.width, src.height);
  const c = document.createElement('canvas');
  c.width = Math.round(src.width * k); c.height = Math.round(src.height * k);
  const ctx = c.getContext('2d');
  checker(ctx, c.width, c.height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

function renderFront() {
  const f = ui.front;
  const body = $('front-body');
  if (!f) { body.innerHTML = '<span class="hint">Drop, tap or paste an image<br><span class="small">A character, toy, animal or object</span></span>'; return; }
  f.preview = frontPreview();
  body.replaceChildren(f.preview);
  $('front-size').textContent = `${f.srcSize[0]}×${f.srcSize[1]}`;
  const words = {
    ai: 'Background removed by AI. Wrong? Fix it with a few clicks.',
    upload: 'Your image already had a transparent background.',
    color: ui.ai.on ? 'Removing the background…' : 'Plain-colour cutout. For busy or dark backgrounds, turn on AI tools.',
  };
  const tone = f.small ? 'warn' : '';
  $('front-status').className = `note ${tone}`;
  $('front-status').textContent = (f.small ? `Small image (${f.srcSize[0]}×${f.srcSize[1]} px): results improve a lot from 512 px up. ` : '') + words[f.cutBy];
  $('tol-field').hidden = f.cutBy !== 'color';
}

async function setFront(source, { quiet = false } = {}) {
  const n = await normalizeImage(source, 768);
  ui.front = { ...n, cut: n.alphaCut, cutBy: n.alphaCut ? 'upload' : 'color', maskUrl: null };
  ui.bg.extra = [];
  if (!quiet) ui.parts = [];
  renderFront();
  renderParts();
  if (ui.ai.on && !n.alphaCut) await aiCutout().catch(err => aiStatus(err.message, 'bad'));
  else if (ui.ai.on) ensureDepth().catch(err => aiStatus(err.message, 'bad'));
}

async function setExtra(view, source) {
  const n = await normalizeImage(source, 512);
  ui.extra[view] = { img: n.alphaCut || n.original, dataUrl: n.dataUrl, preview: null };
  ui.extra[view].preview = cutoutPreview(cutout(ui.extra[view].img, { tolerance: ui.tolerance, maxSide: 200 }), 200);
  renderExtras();
}

// Side and back stay optional: without them the hidden sides are predicted.
function renderExtras() {
  for (const slot of $('extras').children) {
    const v = slot.dataset.view, input = ui.extra[v];
    slot.classList.toggle('filled', Boolean(input));
    const body = slot.querySelector('.body');
    if (input) body.replaceChildren(input.preview);
    else body.innerHTML = '<span class="hint">Optional<br>drop or tap</span>';
    slot.querySelector('.x').hidden = !input;
  }
  const n = Object.values(ui.extra).filter(Boolean).length;
  $('extra-count').textContent = n ? `${n} added` : 'none, Artoo predicts the hidden sides';
}

async function fileToImage(file) {
  if (!file || !/^image\//.test(file.type)) throw new Error('Choose a PNG, JPG or WebP image.');
  const url = URL.createObjectURL(file);
  try { return await loadImage(url); } finally { setTimeout(() => URL.revokeObjectURL(url), 1000); }
}

$('front-file').addEventListener('change', async e => {
  try { await setFront(await fileToImage(e.target.files[0])); } catch (err) { toast(err.message); }
  e.target.value = '';
});
const drop = $('front-drop');
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', async e => {
  e.preventDefault();
  drop.classList.remove('over');
  try { await setFront(await fileToImage(e.dataTransfer.files[0])); } catch (err) { toast(err.message); }
});
document.addEventListener('paste', async e => {
  const file = [...(e.clipboardData?.files || [])].find(f => f.type.startsWith('image/'));
  if (!file) return;
  try { await setFront(await fileToImage(file)); toast('Pasted as your image.'); } catch (err) { toast(err.message); }
});
$('extras').addEventListener('change', async e => {
  const slot = e.target.closest('.slot');
  try { await setExtra(slot.dataset.view, await fileToImage(e.target.files[0])); } catch (err) { toast(err.message); }
  e.target.value = '';
});
$('extras').addEventListener('click', e => {
  const x = e.target.closest('.x');
  if (!x) return;
  e.preventDefault();
  ui.extra[x.closest('.slot').dataset.view] = null;
  renderExtras();
});

// ---------------------------------------------------------------------------
// AI tools: depth + background removal, on the viewer's device

function aiStatus(text, tone = '') {
  $('ai-note').textContent = text;
  $('ai-note').className = `note ${tone}`;
}

function aiMeter(fraction) {
  $('ai-meter').hidden = fraction == null;
  if (fraction != null) $('ai-meter').firstElementChild.style.width = `${Math.round(fraction * 100)}%`;
}

const AI_OFF = `Off. Turn on to remove backgrounds and read depth from real photos and game screenshots. One-time ${AI_SIZE} download; runs on your device.`;

async function setAI(on) {
  ui.ai.on = on;
  $('ai-toggle').setAttribute('aria-checked', on);
  $('ai-toggle').textContent = on ? 'On' : 'Off';
  try { localStorage.setItem('artoo.ai', on ? '1' : '0'); } catch { /* a preference only */ }
  if (!on) {
    $('ai-preview').hidden = true;
    aiStatus(AI_OFF);
    if (ui.front?.cutBy === 'ai') { ui.front.cut = null; ui.front.cutBy = 'color'; }
    if (ui.front) renderFront();
    return;
  }
  try {
    if (ui.front && ui.front.cutBy === 'color') await aiCutout();
    else await ensureDepth();
  } catch (err) { aiStatus(`Could not start the AI tools: ${err.message}`, 'bad'); aiMeter(null); }
}

async function ensureAI() {
  if (ui.ai.ready) return;
  ui.ai.loading ??= loadAI(AI_SOURCES, p => {
    if (p.phase === 'download') { aiStatus(`Downloading the AI models… ${(p.loaded / 1e6).toFixed(0)} of ${(p.total / 1e6).toFixed(0)} MB`); aiMeter(p.loaded / p.total); }
    else { aiStatus('Starting the AI models…'); aiMeter(null); }
  });
  try { await ui.ai.loading; } catch (err) { ui.ai.loading = null; throw err; }
  ui.ai.ready = true;
}

async function ensureDepth() {
  if (!ui.ai.on || !ui.front) return null;
  await ensureAI();
  if (frontDepth()) return frontDepth();
  const f = ui.front;
  aiStatus('Reading depth…');
  const map = await estimateDepth(f.original, 392);
  if (ui.front !== f) return null;
  ui.depth = { key: f.dataUrl, map };
  const prev = depthPreview(map, 56), c = $('ai-preview');
  c.width = prev.width; c.height = prev.height;
  c.getContext('2d').drawImage(prev, 0, 0);
  c.hidden = false;
  aiStatus('Depth ready. Lighter is nearer.', 'ok');
  return map;
}

// Segment Anything, pointed by depth (and by the viewer's clicks).
async function aiCutout() {
  const f = ui.front;
  if (!f || ui.bg.busy) return;
  ui.bg.busy = true;
  drawBgEditor();
  try {
    const depth = await ensureDepth();
    aiStatus('Separating the character from the background… (a few seconds the first time)');
    if (ui.front === f) { f.cutBy = 'color'; renderFront(); $('front-status').textContent = 'Removing the background…'; }
    const res = await removeBackground(f.original, { depth, extra: ui.bg.extra });
    if (ui.front !== f) return;
    f.cut = res.canvas;
    f.cutBy = 'ai';
    f.alpha = res.alpha;
    f.maskUrl = maskToUrl(res.alpha, res.canvas.width, res.canvas.height);
    f.coverage = res.coverage;
    ui.bg.points = res.points;
    renderFront();
    aiStatus(`Background removed; the character covers ${Math.round(res.coverage * 100)}% of the picture.`, 'ok');
  } finally {
    ui.bg.busy = false;
    drawBgEditor();
  }
}

// A compact PNG of the cutout's alpha, stored with saved models.
function maskToUrl(alpha, w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d'), id = ctx.createImageData(w, h);
  for (let i = 0; i < w * h; i++) { const v = Math.round(alpha[i] * 255); id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255; }
  ctx.putImageData(id, 0, 0);
  return c.toDataURL('image/png');
}

async function applyMask(original, maskUrl) {
  const m = await loadImage(maskUrl);
  const c = document.createElement('canvas');
  c.width = original.naturalWidth || original.width; c.height = original.naturalHeight || original.height;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(m, 0, 0, c.width, c.height);
  const md = ctx.getImageData(0, 0, c.width, c.height).data;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.drawImage(original, 0, 0, c.width, c.height);
  const id = ctx.getImageData(0, 0, c.width, c.height);
  for (let i = 0; i < c.width * c.height; i++) id.data[i * 4 + 3] = md[i * 4];
  ctx.putImageData(id, 0, 0);
  return c;
}

$('ai-toggle').addEventListener('click', () => setAI(!ui.ai.on));

// ---------------------------------------------------------------------------
// Background editor: click what is the character, click what is background

let bgTool = 'keep';
function drawBgEditor() {
  if (!$('bg-dlg').open || !ui.front) return;
  const f = ui.front, img = f.original;
  const W = img.naturalWidth, H = img.naturalHeight;
  const cv = $('bg-canvas'), k = Math.min(640 / W, 460 / H);
  cv.width = Math.round(W * k); cv.height = Math.round(H * k);
  const ctx = cv.getContext('2d');
  ctx.drawImage(img, 0, 0, cv.width, cv.height);
  if (f.cut) {
    // Removed parts are washed out in red, kept parts stay as they are.
    const keep = document.createElement('canvas');
    keep.width = cv.width; keep.height = cv.height;
    const kctx = keep.getContext('2d');
    kctx.fillStyle = 'rgba(190, 40, 50, 0.62)';
    kctx.fillRect(0, 0, cv.width, cv.height);
    kctx.globalCompositeOperation = 'destination-out';
    kctx.drawImage(f.cut, 0, 0, cv.width, cv.height);
    ctx.drawImage(keep, 0, 0);
  }
  for (const p of ui.bg.extra) {
    ctx.beginPath();
    ctx.arc(p.x * k, p.y * k, 7, 0, Math.PI * 2);
    ctx.fillStyle = p.on ? '#93d3aa' : '#f1a5a0';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1d2529';
    ctx.stroke();
  }
  $('bg-note').textContent = ui.bg.busy ? 'Updating…' : ui.bg.extra.length
    ? `${ui.bg.extra.length} correction${ui.bg.extra.length > 1 ? 's' : ''}. Red is what will be removed.`
    : 'Red is what will be removed. Click to correct it.';
}

$('bg-fix').addEventListener('click', async () => {
  if (!ui.front) return;
  if (!ui.ai.on) await setAI(true);
  $('bg-dlg').showModal();
  drawBgEditor();
});
$('bg-tool').addEventListener('click', e => {
  const b = e.target.closest('button[data-v]'); if (!b) return;
  bgTool = b.dataset.v;
  $('bg-tool').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
});
$('bg-canvas').addEventListener('click', async e => {
  if (ui.bg.busy || !ui.front) return;
  const cv = $('bg-canvas'), r = cv.getBoundingClientRect();
  const W = ui.front.original.naturalWidth;
  const k = cv.width / W;
  const x = ((e.clientX - r.left) / r.width) * cv.width / k, y = ((e.clientY - r.top) / r.height) * cv.height / k;
  ui.bg.extra.push({ x, y, on: bgTool === 'keep' });
  drawBgEditor();
  try { await aiCutout(); } catch (err) { $('bg-note').textContent = err.message; }
});
$('bg-undo').addEventListener('click', async () => { ui.bg.extra.pop(); drawBgEditor(); await aiCutout().catch(err => toast(err.message)); });
$('bg-reset').addEventListener('click', async () => { ui.bg.extra = []; drawBgEditor(); await aiCutout().catch(err => toast(err.message)); });
$('bg-done').addEventListener('click', () => { $('bg-dlg').close(); generate(); });
$('bg-close').addEventListener('click', () => $('bg-dlg').close());

// ---------------------------------------------------------------------------
// Controls

function segmented(el, options, current, onPick) {
  el.innerHTML = Object.entries(options).map(([v, label]) =>
    `<button type="button" data-v="${v}" aria-pressed="${String(v) === String(current)}">${esc(label)}</button>`).join('');
  el.addEventListener('click', e => {
    const b = e.target.closest('button[data-v]');
    if (!b) return;
    el.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    onPick(b.dataset.v);
  });
}
const pressSeg = (id, v) => $(id).querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === String(v)));

segmented($('style'), STYLES, ui.style, v => { ui.style = v; });
segmented($('quality'), QUALITY, ui.resolution, v => { ui.resolution = Number(v); });
segmented($('viewmode'), VIEW_MODES, 'textured', v => viewer.setMode(v));
segmented($('light'), LIGHTS, 'studio', v => viewer.setLighting(v));

$('shape-mode').addEventListener('click', e => {
  const b = e.target.closest('button[data-v]'); if (!b) return;
  ui.shapeMode = b.dataset.v;
  $('shape-mode').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
  $('manual').hidden = ui.shapeMode !== 'manual';
  $('variants-f').hidden = ui.shapeMode === 'manual';
});
$('variants').addEventListener('click', e => {
  const b = e.target.closest('button[data-v]'); if (!b) return;
  ui.variants = Number(b.dataset.v);
  $('variants').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
});

function bindRange(id, get, set, fmt) {
  const el = $(id), out = $(`${id}-v`);
  el.value = get();
  out.textContent = fmt(get());
  el.addEventListener('input', () => { set(Number(el.value)); out.textContent = fmt(Number(el.value)); });
  return el;
}
bindRange('inflate', () => ui.manual.inflate, v => { ui.manual.inflate = v; }, v => v.toFixed(2));
bindRange('smooth', () => ui.manual.smooth, v => { ui.manual.smooth = v; }, v => `${v}×`);
bindRange('detail', () => ui.manual.detail, v => { ui.manual.detail = v; }, v => v.toFixed(2));
bindRange('depthWeight', () => ui.manual.depthWeight, v => { ui.manual.depthWeight = v; }, v => v.toFixed(2));
let previewTimer;
bindRange('tolerance', () => ui.tolerance, v => {
  ui.tolerance = v;
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => { if (ui.front) renderFront(); for (const k of Object.keys(ui.extra)) if (ui.extra[k]) ui.extra[k].preview = cutoutPreview(cutout(ui.extra[k].img, { tolerance: v, maxSide: 200 }), 200); renderExtras(); }, 120);
}, v => String(v));

// ---------------------------------------------------------------------------
// Stage

const viewer = createViewer($('stage'));
$('spin').addEventListener('click', () => {
  const on = $('spin').getAttribute('aria-pressed') !== 'true';
  $('spin').setAttribute('aria-pressed', on);
  viewer.controls.autoRotate = on;
});
$('reset').addEventListener('click', () => viewer.resetView());

// Thumbnails come from a small renderer of their own, so the stage never blinks.
const thumbRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
thumbRenderer.setSize(240, 240);
thumbRenderer.toneMapping = THREE.ACESFilmicToneMapping;
const thumbScene = new THREE.Scene();
thumbScene.add(new THREE.HemisphereLight(0xeef2f4, 0x2c353b, 1.4));
const thumbKey = new THREE.DirectionalLight(0xffffff, 1.6);
thumbKey.position.set(2, 3, 3);
thumbScene.add(thumbKey);
const thumbCam = new THREE.PerspectiveCamera(32, 1, 0.01, 50);

function thumbnail(object, angle = 0.38) {
  const o = object.clone();
  o.position.set(0, 0, 0); o.scale.set(1, 1, 1);
  const box = new THREE.Box3().setFromObject(o);
  const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  o.position.sub(c);
  thumbScene.add(o);
  const r = Math.max(size.x, size.y, size.z) * 2.45;
  thumbCam.position.set(Math.sin(angle) * r, r * 0.18, Math.cos(angle) * r);
  thumbCam.lookAt(0, 0, 0);
  thumbRenderer.setClearColor(0x3b464d, 1);
  thumbRenderer.render(thumbScene, thumbCam);
  thumbScene.remove(o);
  return thumbRenderer.domElement.toDataURL('image/jpeg', 0.82);
}

// ---------------------------------------------------------------------------
// Added parts (from the chat): simple shapes placed in model space, where
// the model stands on y = 0, is 1 unit tall, faces +z and is centred on x/z.

const PART_SHAPES = ['sphere', 'box', 'cylinder', 'cone', 'capsule', 'torus'];

function partMesh(p) {
  const geo = {
    sphere: () => new THREE.SphereGeometry(0.5, 32, 20),
    box: () => new THREE.BoxGeometry(1, 1, 1),
    cylinder: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    cone: () => new THREE.ConeGeometry(0.5, 1, 32),
    capsule: () => new THREE.CapsuleGeometry(0.5, 1, 8, 24).scale(1, 0.5, 1),
    torus: () => new THREE.TorusGeometry(0.4, 0.1, 16, 48),
  }[p.shape]?.() ?? new THREE.SphereGeometry(0.5, 32, 20);
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: new THREE.Color(p.color || '#888888'), roughness: 0.6, metalness: p.metal ? 0.6 : 0 }));
  m.position.fromArray(p.position);
  m.scale.fromArray(p.size.map(v => Math.max(0.005, v)));
  m.rotation.set(...p.rotation.map(d => (d * Math.PI) / 180));
  m.name = `part:${p.name}`;
  m.castShadow = true;
  return m;
}

function attachParts(object) {
  object.getObjectByName('artoo-parts')?.removeFromParent();
  if (!ui.parts.length) return;
  const g = new THREE.Group();
  g.name = 'artoo-parts';
  for (const p of ui.parts) g.add(partMesh(p));
  object.add(g);
}

function partsChanged() {
  const r = ui.results[ui.selected];
  if (r) {
    attachParts(r.object);
    viewer.setObject(r.object, { keepCamera: true });
    r.thumb = thumbnail(r.object);
    r.copy = null; r.copyImages = null;
    renderVariants();
    renderCopy(r);
  }
  renderParts();
}

function renderParts() {
  $('parts').innerHTML = ui.parts.map(p => `<span class="chip"><i style="background:${esc(p.color)}"></i>${esc(p.name)}<button type="button" data-part="${esc(p.name)}" aria-label="Remove ${esc(p.name)}">×</button></span>`).join('');
  $('parts-row').hidden = !ui.parts.length;
}
$('parts').addEventListener('click', e => {
  const b = e.target.closest('[data-part]');
  if (!b) return;
  ui.parts = ui.parts.filter(p => p.name !== b.dataset.part);
  partsChanged();
});

// ---------------------------------------------------------------------------
// Generation

let pipeStart = 0, pipeTimer;
function showPipeline(title) {
  $('pipeline').hidden = false;
  $('pipe-title').textContent = title;
  $('pipe-steps').innerHTML = STAGES.map(s => `<li>${s}</li>`).join('');
  pipeStart = performance.now();
  clearInterval(pipeTimer);
  pipeTimer = setInterval(() => { $('pipe-time').textContent = `${((performance.now() - pipeStart) / 1000).toFixed(1)} s`; }, 100);
}
function pipelineStage(i) {
  [...$('pipe-steps').children].forEach((li, k) => { li.className = k < i ? 'done' : k === i ? 'now' : ''; });
}
function hidePipeline() {
  clearInterval(pipeTimer);
  [...$('pipe-steps').children].forEach(li => { li.className = 'done'; });
  setTimeout(() => { $('pipeline').hidden = true; }, 700);
}

function currentInputs() {
  return { front: frontImage(), side: ui.extra.side?.img, back: ui.extra.back?.img, depth: frontDepth() };
}

async function generate({ recipes, quiet = false, append = false, label } = {}) {
  if (ui.busy) return null;
  if (!ui.front) { toast('Add your image first.'); return null; }
  ui.busy = true;
  $('go').disabled = true;
  $('auto-copy').disabled = true;
  try { if (ui.ai.on) await ensureDepth(); } catch (err) { aiStatus(`AI tools unavailable: ${err.message}`, 'bad'); }
  const list = recipes || (ui.shapeMode === 'manual'
    ? [{ id: 'manual', label: 'Manual', settings: { ...ui.manual } }]
    : chooseRecipes(ui.variants));
  const base = { style: ui.style, resolution: ui.resolution, tolerance: ui.tolerance, usedDepth: Boolean(frontDepth()) };
  const saved = { front: ui.front.dataUrl, frontMask: ui.front.cutBy === 'ai' ? ui.front.maskUrl : null, side: ui.extra.side?.dataUrl || null, back: ui.extra.back?.dataUrl || null };
  const results = [];
  try {
    for (let i = 0; i < list.length; i++) {
      const r = list[i];
      showPipeline(list.length > 1 ? `Candidate ${i + 1} of ${list.length} · ${r.label}` : `Building · ${label || r.label}`);
      const settings = { ...base, ...r.settings };
      const out = await buildModel(currentInputs(), settings, k => pipelineStage(k));
      attachParts(out.object);
      results.push({
        key: `g-${Date.now().toString(36)}-${i}`, recipe: r.id, recipeLabel: label || r.label, settings, images: saved, parts: ui.parts.map(p => ({ ...p })),
        object: out.object, build: out, stats: out.stats, thumb: thumbnail(out.object), rating: 0, storedRating: 0,
      });
      if (append) { ui.results.push(results.at(-1)); select(ui.results.length - 1); }
      else if (i === 0) { ui.results = results; select(0); }
      renderVariants();
    }
    if (!quiet && results.length > 1) toast('Compare the candidates, then rate the ones you like.');
    return results.at(-1);
  } catch (err) {
    toast(err.message);
    return null;
  } finally {
    hidePipeline();
    ui.busy = false;
    $('go').disabled = false;
    $('auto-copy').disabled = false;
  }
}
$('go').addEventListener('click', () => generate());

function select(i) {
  ui.selected = i;
  const r = ui.results[i];
  if (!r) return;
  viewer.setObject(r.object);
  renderVariants();
  renderResult();
  renderCopy(r);
}

// ---------------------------------------------------------------------------
// Copy: the model against the picture it came from

const PART_LABELS = { outline: 'Outline', profile: 'Side profile', relief: 'Relief (AI depth)', smooth: 'Smoothness' };
const pct = v => `${Math.round(v * 100)}%`;

function renderCopy(r) {
  if (!r || !ui.front) return;
  r.copy ??= scoreCopy(r.build);
  r.copyImages ??= { ref: referenceCrop(frontImage(), r.build.cutouts.front), model: frontRender({ ...r.build, object: r.object }) };
  $('copy-ref').src = r.copyImages.ref;
  $('copy-model').src = r.copyImages.model;
  const d = $('copy-diff');
  d.width = d.height = r.copy.overlay.width;
  d.getContext('2d').drawImage(r.copy.overlay, 0, 0);
  $('copy-score').textContent = pct(r.copy.score);
  $('copy-parts').innerHTML = Object.entries(PART_LABELS).map(([k, label]) => {
    const v = r.copy.parts[k];
    return `<div class="arm${v === undefined ? ' off' : ''}"><span>${label}</span><span class="num">${v === undefined ? (k === 'profile' ? 'add a side view' : 'turn on AI tools') : pct(v)}</span>
      <div class="bar-t"><span style="width:${v === undefined ? 0 : Math.round(v * 100)}%"></span></div></div>`;
  }).join('');
  const m = $('stats').querySelector('[data-copy]');
  if (m) m.textContent = pct(r.copy.score);
}

$('auto-copy').addEventListener('click', async () => {
  if (ui.autoAbort) { ui.autoAbort.abort(); return; }
  const r = ui.results[ui.selected];
  if (!r || ui.busy) return;
  ui.busy = true;
  ui.autoAbort = new AbortController();
  $('go').disabled = true;
  $('auto-copy').textContent = 'Stop';
  const before = r.copy?.score ?? scoreCopy(r.build).score;
  try {
    if (ui.ai.on) await ensureDepth().catch(() => {});
    const start = { ...pick(r.settings, ['style', 'tolerance', ...SHAPE_KEYS]) };
    const res = await autoCopy(currentInputs(), start, {
      signal: ui.autoAbort.signal,
      onStep: s => { $('auto-note').textContent = `Try ${s.i} of ${s.total} · best ${pct(s.best)}`; },
    });
    ui.busy = false;
    const now = await generate({ recipes: [{ id: 'copy', label: 'Auto-copy', settings: pick(res.settings, SHAPE_KEYS) }], quiet: true, append: true });
    if (now) $('auto-note').textContent = `Copy match ${pct(before)} → ${pct(now.copy.score)}. Settings: thickness ${now.settings.inflate.toFixed(2)}, smoothing ${now.settings.smooth}×, detail ${now.settings.detail.toFixed(2)}${now.settings.usedDepth ? `, AI depth ${now.settings.depthWeight.toFixed(2)}` : ''}.`;
  } catch (err) {
    $('auto-note').textContent = err.name === 'AbortError' ? 'Stopped.' : `Auto-copy failed: ${err.message}`;
  } finally {
    ui.busy = false;
    ui.autoAbort = null;
    $('go').disabled = false;
    $('auto-copy').textContent = 'Auto-copy';
  }
});

function renderVariants() {
  const box = $('variant-list');
  if (ui.results.length < 2) { box.innerHTML = ''; return; }
  box.innerHTML = ui.results.map((r, i) => `
    <button type="button" class="variant" data-i="${i}" aria-pressed="${i === ui.selected}" aria-label="Show ${esc(r.recipeLabel)} version">
      <img src="${r.thumb}" alt="">
      <span><span>${esc(r.recipeLabel)}</span><span class="stars-mini">${'★'.repeat(r.rating)}</span></span>
    </button>`).join('');
}
$('variant-list').addEventListener('click', e => {
  const b = e.target.closest('.variant');
  if (b) select(Number(b.dataset.i));
});

const fmtInt = n => n.toLocaleString('en-US');

function renderResult() {
  const r = ui.results[ui.selected];
  $('result-title').textContent = r ? `${STYLES[r.settings.style]} · ${r.recipeLabel}` : 'Result';
  $('result-tag').textContent = r?.sample ? 'Sample' : '';
  $('stats').innerHTML = r ? `
    <div><dt>Triangles</dt><dd>${fmtInt(r.stats.triangles)}</dd></div>
    <div><dt>Vertices</dt><dd>${fmtInt(r.stats.vertices)}</dd></div>
    <div><dt>Views used</dt><dd>${r.stats.views}</dd></div>
    <div><dt>Build time</dt><dd>${(r.stats.ms / 1000).toFixed(2)} s</dd></div>
    <div><dt>Copy match</dt><dd data-copy>${r.copy ? pct(r.copy.score) : '…'}</dd></div>
    <div><dt>Cutout</dt><dd>${esc({ alpha: ui.front?.cutBy === 'ai' ? 'AI' : 'Alpha', color: 'Colour', depth: 'AI depth' }[r.build.cutouts.front.method] || '')}</dd></div>` : '';
  $('caption').innerHTML = r ? `<b>${esc(r.recipeLabel)}</b> · thickness ${r.settings.inflate.toFixed(2)} · smoothing ${r.settings.smooth}× · detail ${r.settings.detail.toFixed(2)}${r.settings.usedDepth ? ` · AI depth ${r.settings.depthWeight.toFixed(2)}` : ''}` : '';
  $('stars').innerHTML = [1, 2, 3, 4, 5].map(n =>
    `<button type="button" data-n="${n}" class="${r && r.rating >= n ? 'on' : ''}" aria-label="${n} star${n > 1 ? 's' : ''}" aria-pressed="${r?.rating === n}">★</button>`).join('');
  $('rate-note').className = 'note';
  $('rate-note').textContent = !r ? '' : !ui.arms[r.recipe]
    ? 'These settings are saved but do not train the recipes.'
    : r.rating ? (ui.store ? 'Saved to your collection.' : 'Rated for this session.') : 'Ratings teach Artoo which shape settings to use for you.';
}

// ---------------------------------------------------------------------------
// Modelling chat: Claude sees your image and the model, and edits it with
// the studio's own controls. It runs on the viewer's Claude account.

const CHAT_RULES = `You are the modelling assistant inside Artoo Studio, a web app that turns one picture into a 3D model in the browser.
How the model is made: the character is cut out of the picture, every part gets a rounded thickness from its outline (a Poisson "inflation"), AI depth pushes nearer parts forward, and the back is predicted (big forms continue round, small details stay on the front). The picture is projected on as the texture.
You change it with tools:
- set_shape: overall thickness (inflate 0.3-1.4), smoothing (0-12), surface detail (0-0.3), AI depth strength (0-1), symmetry (auto/on/off), style (textured/clay/lowpoly/voxel). It rebuilds the model.
- fix_background: when the cutout kept background or lost part of the character, give points in the PICTURE as fractions (0-1, from the top-left) to keep or remove.
- add_part / update_part / remove_part: simple shapes (sphere, box, cylinder, cone, capsule, torus) for details the picture can't give: a weapon, a hat brim, horns, a tail, the back of a hood. Model space: the model stands on y=0 and is 1 unit tall; x points to the right of the picture, y up, z out of the picture toward the viewer; it is centred on x=0, z=0 (state.model.size gives its width, height and depth). A part's size is its full width, height and depth; rotation is in degrees (x, y, z).
Work like a 3D modeller: fix the big forms first (cutout, thickness, proportions), then secondary forms, then small details. Prefer a few well-placed parts over many. Use colours sampled from the picture.
Be honest about limits: hidden sides are predictions, and a tiny or dark picture limits quality. Reply in the user's language, briefly: say what you changed and why, in plain words.`;

function chatState() {
  const r = ui.results[ui.selected];
  return JSON.stringify({
    picture: ui.front ? { width: ui.front.srcSize[0], height: ui.front.srcSize[1], background: ui.front.cutBy, aiTools: ui.ai.on } : null,
    model: r ? { style: r.settings.style, ...pick(r.settings, SHAPE_KEYS), copyMatch: r.copy ? r.copy.parts : null, triangles: r.stats.triangles,
      size: (() => { const o = r.object.clone(); o.position.set(0, 0, 0); o.scale.set(1, 1, 1); o.getObjectByName('artoo-parts')?.removeFromParent(); const s = new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3()); return [s.x, s.y, s.z].map(v => +v.toFixed(3)); })() } : null,
    parts: ui.parts,
  });
}

function chatLine(role, text) {
  const el = document.createElement('div');
  el.className = `msg ${role}`;
  el.textContent = text;
  $('chat-log').append(el);
  $('chat-log').scrollTop = $('chat-log').scrollHeight;
  return el;
}

async function canvasBlob(canvas, type = 'image/png') {
  return new Promise(res => canvas.toBlob(res, type, 0.9));
}

function rebuildWith(patch, label) {
  const r = ui.results[ui.selected];
  const settings = { ...pick(r?.settings || {}, SHAPE_KEYS), ...pick(patch, SHAPE_KEYS) };
  if (patch.style && STYLES[patch.style]) { ui.style = patch.style; pressSeg('style', ui.style); }
  return generate({ recipes: [{ id: 'chat', label, settings }], quiet: true, append: true, label });
}

const num = (v, lo, hi) => (Number.isFinite(Number(v)) ? Math.min(hi, Math.max(lo, Number(v))) : undefined);
const vec = (v, d) => (Array.isArray(v) && v.length === 3 ? v.map(x => Number(x) || 0) : d);

const CHAT_TOOLS = [
  {
    name: 'set_shape',
    description: 'Rebuild the model with new settings. Returns the new copy-match scores. Only pass what should change.',
    inputSchema: { type: 'object', properties: {
      inflate: { type: 'number' }, smooth: { type: 'number' }, detail: { type: 'number' }, depthWeight: { type: 'number' },
      symmetry: { type: 'string', enum: ['auto', 'on', 'off'] }, style: { type: 'string', enum: Object.keys(STYLES) },
    } },
    async execute(input) {
      chatLine('tool', 'Rebuilding with new shape settings…');
      const patch = { inflate: num(input.inflate, 0.3, 1.4), smooth: num(input.smooth, 0, 12), detail: num(input.detail, 0, 0.3), depthWeight: num(input.depthWeight, 0, 1), symmetry: ['auto', 'on', 'off'].includes(input.symmetry) ? input.symmetry : undefined, style: input.style };
      const r = await rebuildWith(patch, 'Chat edit');
      if (!r) return { ok: false, reason: 'The rebuild did not run (busy or no image).' };
      r.copy ??= scoreCopy(r.build);
      return { ok: true, settings: pick(r.settings, SHAPE_KEYS), copyMatch: r.copy.parts };
    },
  },
  {
    name: 'fix_background',
    description: 'Correct the cutout with points on the PICTURE (x, y as 0-1 fractions from the top-left): keep = part of the character, remove = background. Needs AI tools (turned on automatically). Returns how much of the picture the character now covers.',
    inputSchema: { type: 'object', properties: {
      keep: { type: 'array', items: { type: 'array', items: { type: 'number' } } },
      remove: { type: 'array', items: { type: 'array', items: { type: 'number' } } },
    } },
    async execute(input) {
      if (!ui.front) return { ok: false, reason: 'No picture.' };
      chatLine('tool', 'Correcting the background cutout…');
      if (!ui.ai.on) await setAI(true);
      const W = ui.front.original.naturalWidth, H = ui.front.original.naturalHeight;
      for (const [on, list] of [[true, input.keep], [false, input.remove]]) {
        for (const p of Array.isArray(list) ? list.slice(0, 8) : []) ui.bg.extra.push({ x: num(p[0], 0, 1) * W, y: num(p[1], 0, 1) * H, on });
      }
      await aiCutout();
      const r = await rebuildWith({}, 'Chat edit');
      return { ok: true, characterCoverage: ui.front.coverage ?? null, copyMatch: r?.copy?.parts };
    },
  },
  {
    name: 'add_part',
    description: 'Add a simple shape to the model. Returns the list of parts.',
    inputSchema: { type: 'object', required: ['name', 'shape', 'position', 'size'], properties: {
      name: { type: 'string' }, shape: { type: 'string', enum: PART_SHAPES },
      position: { type: 'array', items: { type: 'number' } }, size: { type: 'array', items: { type: 'number' } },
      rotation: { type: 'array', items: { type: 'number' } }, color: { type: 'string' }, metal: { type: 'boolean' },
    } },
    async execute(input) {
      const name = String(input.name || `part ${ui.parts.length + 1}`).slice(0, 40);
      if (ui.parts.length >= 24) return { ok: false, reason: 'Too many parts (24 max).' };
      ui.parts = ui.parts.filter(p => p.name !== name);
      ui.parts.push({ name, shape: PART_SHAPES.includes(input.shape) ? input.shape : 'sphere', position: vec(input.position, [0, 0.5, 0]), size: vec(input.size, [0.1, 0.1, 0.1]), rotation: vec(input.rotation, [0, 0, 0]), color: /^#[0-9a-f]{6}$/i.test(input.color || '') ? input.color : '#888888', metal: Boolean(input.metal) });
      chatLine('tool', `Added ${name}.`);
      partsChanged();
      return { ok: true, parts: ui.parts.map(p => p.name) };
    },
  },
  {
    name: 'update_part',
    description: 'Change an added part by name (any of shape, position, size, rotation, color, metal).',
    inputSchema: { type: 'object', required: ['name'], properties: {
      name: { type: 'string' }, shape: { type: 'string', enum: PART_SHAPES }, position: { type: 'array', items: { type: 'number' } },
      size: { type: 'array', items: { type: 'number' } }, rotation: { type: 'array', items: { type: 'number' } }, color: { type: 'string' }, metal: { type: 'boolean' },
    } },
    async execute(input) {
      const p = ui.parts.find(x => x.name === input.name);
      if (!p) return { ok: false, reason: `No part called ${input.name}.`, parts: ui.parts.map(x => x.name) };
      if (PART_SHAPES.includes(input.shape)) p.shape = input.shape;
      p.position = vec(input.position, p.position); p.size = vec(input.size, p.size); p.rotation = vec(input.rotation, p.rotation);
      if (/^#[0-9a-f]{6}$/i.test(input.color || '')) p.color = input.color;
      if (typeof input.metal === 'boolean') p.metal = input.metal;
      chatLine('tool', `Changed ${p.name}.`);
      partsChanged();
      return { ok: true };
    },
  },
  {
    name: 'remove_part',
    description: 'Remove an added part by name.',
    inputSchema: { type: 'object', required: ['name'], properties: { name: { type: 'string' } } },
    async execute(input) {
      const before = ui.parts.length;
      ui.parts = ui.parts.filter(p => p.name !== input.name);
      if (before !== ui.parts.length) { chatLine('tool', `Removed ${input.name}.`); partsChanged(); }
      return { ok: before !== ui.parts.length, parts: ui.parts.map(p => p.name) };
    },
  },
];

async function sendChat(text) {
  if (!ui.sample || !text.trim()) return;
  if (!ui.results[ui.selected]) { toast('Make a model first.'); return; }
  chatLine('user', text);
  const reply = chatLine('assistant', 'Thinking…');
  ui.chat.abort = new AbortController();
  $('chat-send').hidden = true;
  $('chat-stop').hidden = false;
  const turns = [{ role: 'user', content: CHAT_RULES }, ...ui.chat.turns.slice(-8),
    { role: 'user', content: `${text}\n\n(Current state, JSON: ${chatState()})${ui.chatImages ? '\nImages: 1) the picture after background removal, 2) the model seen from the front, 3) the model from a three-quarter angle.' : ''}` }];
  try {
    let images;
    if (ui.chatImages) {
      const r = ui.results[ui.selected];
      const pic = document.createElement('canvas');
      const src = frontImage(), k = Math.min(1, 768 / Math.max(src.width || src.naturalWidth, src.height || src.naturalHeight));
      pic.width = Math.round((src.width || src.naturalWidth) * k); pic.height = Math.round((src.height || src.naturalHeight) * k);
      const pctx = pic.getContext('2d'); pctx.fillStyle = '#7f8c93'; pctx.fillRect(0, 0, pic.width, pic.height); pctx.drawImage(src, 0, 0, pic.width, pic.height);
      const front = await loadImage(frontRender({ ...r.build, object: r.object }, 384));
      const fc = document.createElement('canvas'); fc.width = fc.height = 384; fc.getContext('2d').drawImage(front, 0, 0);
      const three = await loadImage(thumbnail(r.object, 0.8));
      const tc = document.createElement('canvas'); tc.width = tc.height = 240; tc.getContext('2d').drawImage(three, 0, 0);
      images = (await Promise.all([canvasBlob(pic, 'image/jpeg'), canvasBlob(fc), canvasBlob(tc, 'image/jpeg')])).slice(0, ui.chatImages);
    }
    const { text: answer } = await ui.sample(turns, {
      cache: false, signal: ui.chat.abort.signal, tools: CHAT_TOOLS, images,
      onText: ({ text: t }) => { reply.textContent = t; $('chat-log').scrollTop = $('chat-log').scrollHeight; },
    });
    reply.textContent = answer;
    ui.chat.turns.push({ role: 'user', content: text }, { role: 'assistant', content: answer });
  } catch (err) {
    reply.textContent = err.text || '';
    const why = { cancelled: 'Stopped.', not_granted: 'The chat needs your permission to use Claude.', rate_limited: 'Too many requests at once; try again in a moment.' }[err.code] || `The chat failed: ${err.message || err.code}`;
    chatLine('tool', why);
    if (err.code === 'not_granted') $('chat').hidden = true;
  } finally {
    ui.chat.abort = null;
    $('chat-send').hidden = false;
    $('chat-stop').hidden = true;
  }
}

$('chat-form').addEventListener('submit', e => {
  e.preventDefault();
  const text = $('chat-input').value;
  $('chat-input').value = '';
  sendChat(text);
});
$('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('chat-form').requestSubmit(); }
});
$('chat-stop').addEventListener('click', () => ui.chat.abort?.abort());
$('chat-suggest').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (b) sendChat(b.textContent);
});

// ---------------------------------------------------------------------------
// Rating, learning, saving

$('stars').addEventListener('click', async e => {
  const b = e.target.closest('button[data-n]');
  const r = ui.results[ui.selected];
  if (!b || !r) return;
  const n = Number(b.dataset.n);
  const next = r.rating === n ? 0 : n;
  applyArm(r.recipe, r.rating, next);
  r.rating = next;
  renderResult();
  renderVariants();
  renderArms();
  rememberLocally(r);
  await persist(r);
});

function applyArm(recipe, oldStars, newStars) {
  const s = ui.arms[recipe];
  if (!s) return;
  if (oldStars) { s.n -= 1; s.sum -= (oldStars - 1) / 4; }
  if (newStars) { s.n += 1; s.sum += (newStars - 1) / 4; }
}

function renderArms() {
  const lead = bestRecipe();
  const rated = RECIPES.reduce((t, r) => t + ui.arms[r.id].n, 0);
  $('learn-n').textContent = `${rated} rating${rated === 1 ? '' : 's'}`;
  $('arms').innerHTML = [...RECIPES].sort((a, b) => armMean(ui.arms[b.id]) - armMean(ui.arms[a.id])).map(r => {
    const s = ui.arms[r.id], m = armMean(s), isLead = rated && r.id === lead.id;
    return `<div class="arm${isLead ? ' lead' : ''}">
      <span>${esc(r.label)}${isLead ? '<span class="pill">best so far</span>' : ''}</span>
      <span class="num">${s.n ? `${Math.round(m * 100)}% · ${s.n}` : 'untried'}</span>
      <div class="bar-t"><span style="width:${Math.round(m * 100)}%"></span></div>
    </div>`;
  }).join('');
}

// One document per saved model, kept under 256 KiB, plus one for the recipe stats.
async function persist(r) {
  if (!ui.store) return;
  try {
    await ui.store.doc('arms').set({ arms: ui.arms, updatedAt: Date.now() });
    if (r.rating || r.storedRating) {
      const doc = {
        createdAt: Date.now(), recipe: r.recipe, recipeLabel: r.recipeLabel, settings: r.settings, parts: r.parts,
        rating: r.rating, thumb: r.thumb, front: r.images.front, frontMask: r.images.frontMask, side: r.images.side, back: r.images.back,
      };
      for (const drop of ['back', 'side', 'frontMask']) if (JSON.stringify(doc).length > 250_000) doc[drop] = null;
      await ui.store.doc(r.key).set(doc);
      r.storedRating = r.rating;
    }
  } catch (err) {
    $('rate-note').className = 'note bad';
    $('rate-note').textContent = `Not saved: ${err.message || err.code}. Your rating still counts for this session.`;
  }
}

function renderShelf() {
  const shelf = $('shelf');
  if (!ui.gallery.length) {
    shelf.innerHTML = `<div class="empty" style="grid-column:span 3">${ui.store
      ? 'Rate a model and it is saved here, with the picture it came from.'
      : 'Your rated models appear here for this session. Open this page signed in to claude.ai to keep them.'}</div>`;
    return;
  }
  shelf.innerHTML = ui.gallery.map(g => `
    <article class="item" data-key="${esc(g.key)}">
      <button class="open" type="button" aria-label="Rebuild ${esc(g.recipeLabel)} model"><img src="${g.thumb}" alt=""></button>
      <div class="meta">
        <span>${esc(STYLES[g.settings.style] || '')} · ${esc(g.recipeLabel)}</span>
        <span class="sub"><span style="color:var(--star)">${'★'.repeat(g.rating || 0)}</span><button class="del" type="button">Delete</button></span>
      </div>
    </article>`).join('');
}

$('shelf').addEventListener('click', async e => {
  const item = e.target.closest('.item');
  if (!item) return;
  const g = ui.gallery.find(x => x.key === item.dataset.key);
  const del = e.target.closest('.del');
  if (del) {
    if (del.dataset.armed !== '1') { del.dataset.armed = '1'; del.textContent = 'Confirm'; setTimeout(() => { del.dataset.armed = ''; del.textContent = 'Delete'; }, 3000); return; }
    applyArm(g.recipe, g.rating, 0);
    renderArms();
    if (ui.store) { await ui.store.doc(g.key).delete().catch(() => {}); await ui.store.doc('arms').set({ arms: ui.arms, updatedAt: Date.now() }).catch(() => {}); }
    else { ui.gallery = ui.gallery.filter(x => x !== g); renderShelf(); }
    return;
  }
  if (e.target.closest('.open')) await reopen(g);
});

// A saved model is rebuilt from its picture, cutout, settings and parts.
async function reopen(g) {
  ui.extra = { side: null, back: null };
  await setFront(await loadImage(g.front), { quiet: true });
  if (g.frontMask) {
    ui.front.cut = await applyMask(ui.front.original, g.frontMask);
    ui.front.cutBy = 'ai';
    ui.front.maskUrl = g.frontMask;
    renderFront();
  }
  for (const v of ['side', 'back']) if (g[v]) await setExtra(v, await loadImage(g[v]));
  renderExtras();
  ui.parts = (g.parts || []).map(p => ({ ...p }));
  renderParts();
  ui.tolerance = g.settings.tolerance; $('tolerance').value = ui.tolerance; $('tolerance-v').textContent = ui.tolerance;
  ui.style = g.settings.style; ui.resolution = g.settings.resolution;
  if (g.settings.usedDepth && !ui.ai.on) await setAI(true);
  pressSeg('style', ui.style);
  pressSeg('quality', ui.resolution);
  await generate({ recipes: [{ id: g.recipe, label: g.recipeLabel, settings: pick(g.settings, SHAPE_KEYS) }], quiet: true });
  const r = ui.results[0];
  if (r) {
    Object.assign(r, { key: g.key, rating: g.rating, storedRating: g.rating });
    renderResult();
  }
  $('studio').scrollIntoView({ behavior: 'smooth' });
}

// Session-only collection when there is no store.
function rememberLocally(r) {
  if (ui.store || !r?.rating) return;
  const existing = ui.gallery.find(g => g.key === r.key);
  const entry = { key: r.key, recipe: r.recipe, recipeLabel: r.recipeLabel, settings: r.settings, parts: r.parts, rating: r.rating, thumb: r.thumb, ...r.images };
  if (existing) Object.assign(existing, entry); else ui.gallery.unshift(entry);
  renderShelf();
}

// ---------------------------------------------------------------------------
// Export

async function offer(filename, data) {
  if (!ui.downloads) { toast('Saving files is not available in this view.'); return; }
  try {
    await ui.downloads.save({ filename, data });
  } catch (err) {
    if (err?.code === 'declined') return;
    toast(err?.code === 'extension_not_enabled' ? 'Zip files cannot be saved in this view.' : `Could not save the file: ${err?.message || err?.code}`);
  }
}

$('dl-zip').addEventListener('click', async () => {
  const r = ui.results[ui.selected];
  if (!r) return;
  $('dl-zip').disabled = true;
  try {
    const name = `artoo-${r.settings.style}-${r.recipe}`;
    const clean = r.object.clone();
    clean.position.set(0, 0, 0); clean.scale.set(1, 1, 1);
    const glb = await toGLB(clean);
    const blob = zip({
      [`${name}.glb`]: glb,
      [`${name}.obj`]: toOBJ(clean),
      [`${name}.stl`]: toSTL(clean),
      'README.txt': `Made with Artoo Studio.\n\n${name}.glb  textured model, 1 unit (metre) tall. Open in Blender, three.js, Unity, Unreal or any glTF viewer.\n${name}.obj  geometry only, same scale.\n${name}.stl  for 3D printing, 100 mm tall.\n\nStyle: ${STYLES[r.settings.style]}. Recipe: ${r.recipeLabel}. ${r.stats.triangles} triangles${ui.parts.length ? `, plus ${ui.parts.length} added part(s)` : ''}.\n`,
    });
    await offer(`${name}.zip`, blob);
  } finally {
    $('dl-zip').disabled = false;
  }
});

$('dl-png').addEventListener('click', async () => {
  const url = viewer.snapshot();
  const bytes = Uint8Array.from(atob(url.split(',')[1]), c => c.charCodeAt(0));
  await offer('artoo-view.png', bytes);
});

let toastTimer;
function toast(message) {
  document.querySelector('.toast')?.remove();
  const el = Object.assign(document.createElement('div'), { className: 'toast', textContent: message });
  el.setAttribute('role', 'status');
  document.body.append(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 5000);
}

// ---------------------------------------------------------------------------
// Start: a sample model on screen, then light up storage, saving and chat.

renderFront();
renderExtras();
renderArms();
renderShelf();
renderResult();
renderParts();
aiStatus(AI_OFF);

let aiPref = false;
try { aiPref = localStorage.getItem('artoo.ai') === '1'; } catch { /* no storage */ }
await setFront(cactusFront(640));
await generate({ recipes: [RECIPES[1]], quiet: true });
if (ui.results[0]) { ui.results[0].sample = true; renderResult(); }
if (aiPref) setAI(true);

(async () => {
  const runtime = window.claude;
  if (!runtime?.use) { $('store-note').textContent = 'Session only'; return; }
  const [store, user, downloads, sample] = await Promise.all([runtime.use('db'), runtime.use('user'), runtime.use('downloads'), runtime.use('sample')]);
  ui.downloads = downloads;
  if (!downloads) { $('dl-note').textContent = 'Saving files is not available in this view.'; $('dl-zip').disabled = $('dl-png').disabled = true; }
  if (sample) {
    const caps = await sample.limits().catch(() => null);
    if (caps?.tools) {
      ui.sample = sample;
      ui.chatImages = caps?.images ? Math.min(3, caps.images.maxCount || 0) : 0;
      $('chat').hidden = false;
      $('chat-note').textContent = ui.chatImages ? 'Claude sees your picture and the model.' : 'Claude reads the model\'s settings (pictures are not available in this view).';
    }
  }
  const uid = user ? await user.id() : null;
  if (!store || !uid) { $('store-note').textContent = 'Session only · sign in to keep your collection'; renderShelf(); return; }
  ui.store = store.collection(`data/users/${uid}`);
  $('store-note').textContent = 'Private to you';
  renderShelf();
  ui.store.onSnapshot(snap => {
    const gallery = [];
    for (const d of snap.docs) {
      const data = d.data();
      if (d.id === 'arms') {
        for (const r of RECIPES) if (data.arms?.[r.id]) ui.arms[r.id] = { n: Number(data.arms[r.id].n) || 0, sum: Number(data.arms[r.id].sum) || 0 };
      } else if (d.id.startsWith('g-') && data.settings) {
        gallery.push({ key: d.id, ...data });
      }
    }
    ui.gallery = gallery.sort((a, b) => b.createdAt - a.createdAt);
    renderShelf();
    renderArms();
  }, () => { $('store-note').textContent = 'Could not load your collection'; });
})();
