// Artoo Studio, the artifact edition. Everything runs in the viewer's browser;
// the claude.ai runtime adds a private per-person collection (db + user) and
// file saving (downloads). Without them the studio still works for the session.
//
// Build: artoo/artifact/build.mjs concatenates engine.js, sample.js,
// viewer.js and this file into one module. Imports here are for local runs.

import * as THREE from 'three';
import { buildModel, cutout, cutoutPreview, STAGES, STYLES, DEFAULTS, toGLB, toOBJ, toSTL, zip, loadImage } from '../public/js/engine.js';
import { cactusFront, cactusSide } from '../public/js/sample.js';
import { createViewer, VIEW_MODES, LIGHTS } from '../public/js/viewer.js';
import { loadDepthModel, estimateDepth, depthPreview } from '../public/js/depth.js';
import { scoreCopy, autoCopy, frontRender, referenceCrop } from '../public/js/match.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Shape recipes the studio learns between. depthWeight only matters when AI
// depth is on.
const RECIPES = [
  { id: 'round', label: 'Round', settings: { inflate: 1.0, smooth: 8, detail: 0.03, depthWeight: 0.5 } },
  { id: 'balanced', label: 'Balanced', settings: { inflate: 0.85, smooth: 6, detail: 0.05, depthWeight: 0.65 } },
  { id: 'puffy', label: 'Puffy', settings: { inflate: 1.2, smooth: 10, detail: 0.02, depthWeight: 0.45 } },
  { id: 'relief', label: 'Relief', settings: { inflate: 0.55, smooth: 5, detail: 0.1, depthWeight: 0.85 } },
  { id: 'crisp', label: 'Crisp', settings: { inflate: 0.9, smooth: 3, detail: 0.08, depthWeight: 0.75 } },
];
const QUALITY = { 80: 'Draft', 120: 'Standard', 144: 'High' };
const CUT_MODES = { auto: 'Auto', color: 'Plain colour', depth: 'AI depth' };
const SHAPE_KEYS = ['inflate', 'smooth', 'detail', 'depthWeight', 'symmetry'];

// The depth network and its runtime, published next to the page. The model
// is Base64 text in three parts: artifacts serve text, not raw binaries, and
// cap each file below 16 MB.
const AI_SOURCES = window.ARTOO_AI_SOURCES || {
  wasm: ['ai/ort-wasm-simd-threaded.wasm'],
  model: [1, 2, 3].map(k => `ai/depth-anything-v2-small-q8.${k}.b64.txt`),
  totalBytes: 14239897 + 3 * 12115024,
};
const pick = (o, keys) => Object.fromEntries(keys.filter(k => o[k] !== undefined).map(k => [k, o[k]]));

const ui = {
  inputs: { front: null, side: null, back: null },   // { img, dataUrl, preview }
  style: 'textured', resolution: 120, tolerance: DEFAULTS.tolerance, cutoutMode: 'auto',
  shapeMode: 'auto', variants: 3,
  manual: { inflate: 0.85, smooth: 6, detail: 0.04, depthWeight: 0.65 },
  ai: { on: false, ready: false, loading: null }, depth: null, // depth: { key, map }
  autoAbort: null,
  results: [], selected: -1, busy: false,
  arms: Object.fromEntries(RECIPES.map(r => [r.id, { n: 0, sum: 0 }])),
  gallery: [],
  store: null, uid: null, downloads: null,
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
// Inputs

const VIEW_LABELS = { front: 'Front', side: 'Side', back: 'Back' };

// Flatten onto white, cap the size, and generate from the encoded copy, so
// the saved collection rebuilds exactly what was rated.
async function normalizeImage(source, maxSide) {
  const w0 = source.naturalWidth || source.width, h0 = source.naturalHeight || source.height;
  const s = Math.min(1, maxSide / Math.max(w0, h0));
  const c = document.createElement('canvas');
  c.width = Math.round(w0 * s); c.height = Math.round(h0 * s);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(source, 0, 0, c.width, c.height);
  const dataUrl = c.toDataURL('image/jpeg', 0.86);
  return { img: await loadImage(dataUrl), dataUrl };
}

function previewFor(view, img) {
  const depth = view === 'front' ? frontDepth() : null;
  return cutoutPreview(cutout(img, { tolerance: ui.tolerance, maxSide: 200, depth, mode: view === 'front' ? ui.cutoutMode : 'color' }), 200);
}

async function setView(view, source) {
  const { img, dataUrl } = await normalizeImage(source, view === 'front' ? 640 : 448);
  ui.inputs[view] = { img, dataUrl, preview: null };
  ui.inputs[view].preview = previewFor(view, img);
  renderViews();
  if (view === 'front') ensureDepth().catch(err => aiStatus(err.message, 'bad'));
}

function refreshPreviews() {
  for (const v of Object.keys(ui.inputs)) {
    const input = ui.inputs[v];
    if (input) input.preview = previewFor(v, input.img);
  }
  renderViews();
}

// ---------------------------------------------------------------------------
// AI depth

const frontDepth = () => (ui.depth && ui.inputs.front && ui.depth.key === ui.inputs.front.dataUrl ? ui.depth.map : null);

function aiStatus(text, tone = '') {
  $('ai-note').textContent = text;
  $('ai-note').className = `note ${tone}`;
}

function aiMeter(fraction) {
  $('ai-meter').hidden = fraction == null;
  if (fraction != null) $('ai-meter').firstElementChild.style.width = `${Math.round(fraction * 100)}%`;
}

async function setAI(on) {
  ui.ai.on = on;
  $('ai-toggle').setAttribute('aria-checked', on);
  $('ai-toggle').textContent = on ? 'On' : 'Off';
  try { localStorage.setItem('artoo.aiDepth', on ? '1' : '0'); } catch { /* preference only */ }
  if (!on) {
    $('ai-preview').hidden = true;
    aiStatus('Off. Turn on for real photos: finds the subject and its relief. One-time 50 MB download, runs on your device.');
    refreshPreviews();
    return;
  }
  try { await ensureDepth(); } catch (err) { aiStatus(`Could not start AI depth: ${err.message}`, 'bad'); aiMeter(null); }
}

async function ensureDepth() {
  if (!ui.ai.on || !ui.inputs.front) return;
  if (!ui.ai.ready) {
    ui.ai.loading ??= loadDepthModel(AI_SOURCES, p => {
      if (p.phase === 'download') { aiStatus(`Downloading the depth model… ${(p.loaded / 1e6).toFixed(0)} of ${(p.total / 1e6).toFixed(0)} MB`); aiMeter(p.loaded / p.total); }
      else aiStatus('Starting the depth model…');
    });
    try { await ui.ai.loading; } catch (err) { ui.ai.loading = null; throw err; }
    ui.ai.ready = true;
  }
  const front = ui.inputs.front;
  if (frontDepth()) return;
  aiStatus('Reading depth from the front view…');
  aiMeter(null);
  const t = performance.now();
  const map = await estimateDepth(front.img, 392);
  if (ui.inputs.front !== front) return; // replaced meanwhile
  ui.depth = { key: front.dataUrl, map };
  const prev = depthPreview(map, 56);
  const c = $('ai-preview');
  c.width = prev.width; c.height = prev.height;
  c.getContext('2d').drawImage(prev, 0, 0);
  c.hidden = false;
  aiStatus(`Depth read in ${((performance.now() - t) / 1000).toFixed(1)} s. Lighter is nearer.`, 'ok');
  refreshPreviews();
}

// Slots are built once and updated in place: replacing them would drop a
// file the viewer is choosing while a preview refreshes.
function renderViews() {
  const box = $('views');
  if (!box.children.length) {
    for (const v of Object.keys(VIEW_LABELS)) {
      const slot = document.createElement('label');
      slot.className = 'slot';
      slot.dataset.view = v;
      slot.innerHTML = `<span class="body"></span><span class="tag">${VIEW_LABELS[v]}</span>
        <input type="file" accept="image/png,image/jpeg,image/webp" aria-label="${VIEW_LABELS[v]} view image">`;
      if (v !== 'front') {
        const x = Object.assign(document.createElement('button'), { className: 'x', type: 'button', textContent: '×', hidden: true });
        x.setAttribute('aria-label', `Remove ${VIEW_LABELS[v].toLowerCase()} view`);
        x.addEventListener('click', e => { e.preventDefault(); ui.inputs[v] = null; renderViews(); });
        slot.append(x);
      }
      box.append(slot);
    }
  }
  for (const slot of box.children) {
    const v = slot.dataset.view, input = ui.inputs[v];
    slot.classList.toggle('filled', Boolean(input));
    const body = slot.querySelector('.body');
    if (input) body.replaceChildren(input.preview);
    else body.innerHTML = `<span class="hint">${v === 'front' ? 'Required' : 'Optional'}<br>drop or tap</span>`;
    const x = slot.querySelector('.x');
    if (x) x.hidden = !input;
  }
  const n = Object.values(ui.inputs).filter(Boolean).length;
  $('view-count').textContent = `${n} of 3`;
}

async function fileToImage(file) {
  if (!file || !/^image\//.test(file.type)) throw new Error('Choose a PNG, JPG or WebP image.');
  const url = URL.createObjectURL(file);
  try { return await loadImage(url); } finally { setTimeout(() => URL.revokeObjectURL(url), 1000); }
}

$('views').addEventListener('change', async e => {
  const slot = e.target.closest('.slot');
  try { await setView(slot.dataset.view, await fileToImage(e.target.files[0])); }
  catch (err) { toast(err.message); }
  e.target.value = ''; // so choosing the same file again still counts
});
$('views').addEventListener('dragover', e => { const s = e.target.closest('.slot'); if (s) { e.preventDefault(); s.classList.add('over'); } });
$('views').addEventListener('dragleave', e => e.target.closest('.slot')?.classList.remove('over'));
$('views').addEventListener('drop', async e => {
  const slot = e.target.closest('.slot');
  if (!slot) return;
  e.preventDefault();
  slot.classList.remove('over');
  try { await setView(slot.dataset.view, await fileToImage(e.dataTransfer.files[0])); }
  catch (err) { toast(err.message); }
});
// A pasted image goes to the front slot.
document.addEventListener('paste', async e => {
  const file = [...(e.clipboardData?.files || [])].find(f => f.type.startsWith('image/'));
  if (!file) return;
  try { await setView('front', await fileToImage(file)); toast('Pasted as the front view.'); }
  catch (err) { toast(err.message); }
});

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

segmented($('style'), STYLES, ui.style, v => { ui.style = v; });
segmented($('quality'), QUALITY, ui.resolution, v => { ui.resolution = Number(v); });
segmented($('cutmode'), CUT_MODES, ui.cutoutMode, v => {
  ui.cutoutMode = v;
  if (v === 'depth' && !ui.ai.on) setAI(true); else refreshPreviews();
});
$('ai-toggle').addEventListener('click', () => setAI(!ui.ai.on));
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
  previewTimer = setTimeout(refreshPreviews, 120);
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

function thumbnail(object) {
  const o = object.clone();
  const box = new THREE.Box3().setFromObject(o);
  const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  o.position.sub(c);
  thumbScene.add(o);
  const r = Math.max(size.x, size.y, size.z);
  thumbCam.position.set(r * 0.9, r * 0.45, r * 2.3);
  thumbCam.lookAt(0, 0, 0);
  thumbRenderer.setClearColor(0x3b464d, 1);
  thumbRenderer.render(thumbScene, thumbCam);
  thumbScene.remove(o);
  return thumbRenderer.domElement.toDataURL('image/jpeg', 0.8);
}

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
  return { front: ui.inputs.front.img, side: ui.inputs.side?.img, back: ui.inputs.back?.img, depth: frontDepth() };
}

async function generate({ recipes, quiet = false, append = false } = {}) {
  if (ui.busy) return;
  if (!ui.inputs.front) { toast('Add a front view first.'); return; }
  ui.busy = true;
  $('go').disabled = true;
  $('auto-copy').disabled = true;
  try { await ensureDepth(); } catch (err) { aiStatus(`AI depth unavailable: ${err.message}`, 'bad'); }
  const list = recipes || (ui.shapeMode === 'manual'
    ? [{ id: 'manual', label: 'Manual', settings: { ...ui.manual } }]
    : chooseRecipes(ui.variants));
  const base = { style: ui.style, resolution: ui.resolution, tolerance: ui.tolerance, cutoutMode: ui.cutoutMode, usedDepth: Boolean(frontDepth()) };
  const saved = { front: ui.inputs.front.dataUrl, side: ui.inputs.side?.dataUrl || null, back: ui.inputs.back?.dataUrl || null };
  const results = [];
  try {
    for (let i = 0; i < list.length; i++) {
      const r = list[i];
      showPipeline(list.length > 1 ? `Candidate ${i + 1} of ${list.length} · ${r.label}` : `Building · ${r.label}`);
      const settings = { ...base, ...r.settings };
      const out = await buildModel(currentInputs(), settings, k => pipelineStage(k));
      results.push({
        key: `g-${Date.now().toString(36)}-${i}`, recipe: r.id, recipeLabel: r.label, settings, images: saved,
        object: out.object, build: out, stats: out.stats, thumb: thumbnail(out.object), rating: 0, storedRating: 0,
      });
      if (append) { ui.results.push(results.at(-1)); select(ui.results.length - 1); }
      else if (i === 0) { ui.results = results; select(0); }
      renderVariants();
    }
    if (!quiet && results.length > 1) toast('Compare the candidates, then rate the ones you like.');
  } catch (err) {
    toast(err.message);
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
  if (!r) return;
  r.copy ??= scoreCopy(r.build);
  r.copyImages ??= { ref: referenceCrop(ui.inputs.front.img, r.build.cutouts.front), model: frontRender(r.build) };
  $('copy-ref').src = r.copyImages.ref;
  $('copy-model').src = r.copyImages.model;
  const d = $('copy-diff');
  d.width = d.height = r.copy.overlay.width;
  d.getContext('2d').drawImage(r.copy.overlay, 0, 0);
  $('copy-score').textContent = pct(r.copy.score);
  $('copy-parts').innerHTML = Object.entries(PART_LABELS).map(([k, label]) => {
    const v = r.copy.parts[k];
    return `<div class="arm${v === undefined ? ' off' : ''}"><span>${label}</span><span class="num">${v === undefined ? (k === 'profile' ? 'add a side view' : 'turn on AI depth') : pct(v)}</span>
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
    await ensureDepth().catch(() => {});
    const start = { ...pick(r.settings, ['style', 'tolerance', 'cutoutMode', ...SHAPE_KEYS]) };
    const res = await autoCopy(currentInputs(), start, {
      signal: ui.autoAbort.signal,
      onStep: s => { $('auto-note').textContent = `Try ${s.i} of ${s.total} · best ${pct(s.best)}`; },
    });
    ui.busy = false;
    await generate({ recipes: [{ id: 'copy', label: 'Auto-copy', settings: pick(res.settings, SHAPE_KEYS) }], quiet: true, append: true });
    const now = ui.results[ui.selected];
    $('auto-note').textContent = `Copy match ${pct(before)} → ${pct(now.copy.score)}. Settings: thickness ${now.settings.inflate.toFixed(2)}, smoothing ${now.settings.smooth}×, detail ${now.settings.detail.toFixed(2)}${now.settings.usedDepth ? `, AI depth ${now.settings.depthWeight.toFixed(2)}` : ''}.`;
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
    <button type="button" class="variant" data-i="${i}" aria-pressed="${i === ui.selected}" aria-label="Show ${esc(r.recipeLabel)} candidate">
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
    <div><dt>Cutout</dt><dd>${esc({ alpha: 'Alpha', color: 'Colour', depth: 'AI depth' }[r.build.cutouts.front.method] || '')}</dd></div>` : '';
  $('caption').innerHTML = r ? `<b>${esc(r.recipeLabel)}</b> · thickness ${r.settings.inflate.toFixed(2)} · smoothing ${r.settings.smooth}× · detail ${r.settings.detail.toFixed(2)}${r.settings.usedDepth ? ` · AI depth ${r.settings.depthWeight.toFixed(2)}` : ''}` : '';
  $('stars').innerHTML = [1, 2, 3, 4, 5].map(n =>
    `<button type="button" data-n="${n}" class="${r && r.rating >= n ? 'on' : ''}" aria-label="${n} star${n > 1 ? 's' : ''}" aria-pressed="${r?.rating === n}">★</button>`).join('');
  $('rate-note').className = 'note';
  $('rate-note').textContent = !r ? '' : r.recipe === 'manual' || r.recipe === 'copy'
    ? 'These settings are saved but do not train the recipes.'
    : r.rating ? (ui.store ? 'Saved to your collection.' : 'Rated for this session.') : 'Ratings teach Artoo which shape settings to use for you.';
}

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
        createdAt: Date.now(), recipe: r.recipe, recipeLabel: r.recipeLabel, settings: r.settings,
        rating: r.rating, thumb: r.thumb, front: r.images.front, side: r.images.side, back: r.images.back,
      };
      if (JSON.stringify(doc).length > 250_000) { doc.back = null; }
      if (JSON.stringify(doc).length > 250_000) { doc.side = null; }
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
      ? 'Rate a model and it is saved here, with the photos it came from.'
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

// A saved model is rebuilt from its photos and settings.
async function reopen(g) {
  ui.inputs = { front: null, side: null, back: null };
  for (const v of ['front', 'side', 'back']) if (g[v]) await setView(v, await loadImage(g[v]));
  ui.tolerance = g.settings.tolerance; $('tolerance').value = ui.tolerance; $('tolerance-v').textContent = ui.tolerance;
  ui.style = g.settings.style; ui.resolution = g.settings.resolution;
  if (g.settings.cutoutMode) ui.cutoutMode = g.settings.cutoutMode;
  if (g.settings.usedDepth && !ui.ai.on) await setAI(true);
  for (const [id, v] of [['style', ui.style], ['quality', ui.resolution], ['cutmode', ui.cutoutMode]]) {
    $(id).querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === String(v)));
  }
  await generate({ recipes: [{ id: g.recipe, label: g.recipeLabel, settings: pick(g.settings, SHAPE_KEYS) }], quiet: true });
  const r = ui.results[0];
  if (r) {
    Object.assign(r, { key: g.key, rating: g.rating, storedRating: g.rating });
    renderResult();
  }
  document.getElementById('studio').scrollIntoView({ behavior: 'smooth' });
}

// Session-only collection when there is no store.
function rememberLocally(r) {
  if (ui.store || !r.rating) return;
  const existing = ui.gallery.find(g => g.key === r.key);
  const entry = { key: r.key, recipe: r.recipe, recipeLabel: r.recipeLabel, settings: r.settings, rating: r.rating, thumb: r.thumb, ...r.images };
  if (existing) Object.assign(existing, entry); else ui.gallery.unshift(entry);
  renderShelf();
}
$('stars').addEventListener('click', () => rememberLocally(ui.results[ui.selected]));

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
    const glb = await toGLB(r.object);
    const blob = zip({
      [`${name}.glb`]: glb,
      [`${name}.obj`]: toOBJ(r.object),
      [`${name}.stl`]: toSTL(r.object),
      'README.txt': `Made with Artoo Studio.\n\n${name}.glb  textured model, 1 unit (metre) tall. Open in Blender, three.js, Unity, Unreal or any glTF viewer.\n${name}.obj  geometry only, same scale.\n${name}.stl  for 3D printing, 100 mm tall.\n\nStyle: ${STYLES[r.settings.style]}. Recipe: ${r.recipeLabel}. ${r.stats.triangles} triangles.\n`,
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
// Start: a sample model on screen, then light up storage and saving.

renderViews();
renderArms();
renderShelf();
renderResult();

let aiPref = false;
try { aiPref = localStorage.getItem('artoo.aiDepth') === '1'; } catch { /* no storage */ }
aiStatus('Off. Turn on for real photos: finds the subject and its relief. One-time 50 MB download, runs on your device.');
await setView('front', cactusFront(640));
await setView('side', cactusSide(448));
await generate({ recipes: [RECIPES[1]], quiet: true });
if (ui.results[0]) { ui.results[0].sample = true; renderResult(); }
if (aiPref) setAI(true);

(async () => {
  const runtime = window.claude;
  if (!runtime?.use) { $('store-note').textContent = 'Session only'; return; }
  const [store, user, downloads] = await Promise.all([runtime.use('db'), runtime.use('user'), runtime.use('downloads')]);
  ui.downloads = downloads;
  if (!downloads) { $('dl-note').textContent = 'Saving files is not available in this view.'; $('dl-zip').disabled = $('dl-png').disabled = true; }
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
