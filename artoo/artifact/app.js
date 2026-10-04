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

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Shape recipes the studio learns between.
const RECIPES = [
  { id: 'round', label: 'Round', settings: { inflate: 1.0, smooth: 6, detail: 0.04 } },
  { id: 'balanced', label: 'Balanced', settings: { inflate: 0.85, smooth: 4, detail: 0.08 } },
  { id: 'puffy', label: 'Puffy', settings: { inflate: 1.25, smooth: 8, detail: 0.02 } },
  { id: 'relief', label: 'Relief', settings: { inflate: 0.5, smooth: 3, detail: 0.16 } },
  { id: 'crisp', label: 'Crisp', settings: { inflate: 0.9, smooth: 2, detail: 0.12 } },
];
const QUALITY = { 72: 'Draft', 112: 'Standard', 144: 'High' };

const ui = {
  inputs: { front: null, side: null, back: null },   // { img, dataUrl, preview }
  style: 'textured', resolution: 112, tolerance: DEFAULTS.tolerance,
  shapeMode: 'auto', variants: 3,
  manual: { inflate: 0.9, smooth: 5, detail: 0.06 },
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

async function setView(view, source) {
  const { img, dataUrl } = await normalizeImage(source, view === 'front' ? 640 : 448);
  ui.inputs[view] = { img, dataUrl, preview: cutoutPreview(cutout(img, { tolerance: ui.tolerance, maxSide: 200 }), 200) };
  renderViews();
}

function refreshPreviews() {
  for (const v of Object.keys(ui.inputs)) {
    const input = ui.inputs[v];
    if (input) input.preview = cutoutPreview(cutout(input.img, { tolerance: ui.tolerance, maxSide: 200 }), 200);
  }
  renderViews();
}

function renderViews() {
  const box = $('views');
  box.replaceChildren(...Object.keys(VIEW_LABELS).map(v => {
    const input = ui.inputs[v];
    const slot = document.createElement('label');
    slot.className = `slot${input ? ' filled' : ''}`;
    slot.dataset.view = v;
    slot.innerHTML = `<span class="tag">${VIEW_LABELS[v]}</span>
      ${input ? '' : `<span class="hint">${v === 'front' ? 'Required' : 'Optional'}<br>drop or tap</span>`}
      <input type="file" accept="image/png,image/jpeg,image/webp" aria-label="${VIEW_LABELS[v]} view image">`;
    if (input) {
      slot.prepend(input.preview);
      if (v !== 'front') {
        const x = Object.assign(document.createElement('button'), { className: 'x', type: 'button', textContent: '×' });
        x.setAttribute('aria-label', `Remove ${VIEW_LABELS[v].toLowerCase()} view`);
        x.addEventListener('click', e => { e.preventDefault(); ui.inputs[v] = null; renderViews(); });
        slot.append(x);
      }
    }
    return slot;
  }));
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
  return { front: ui.inputs.front.img, side: ui.inputs.side?.img, back: ui.inputs.back?.img };
}

async function generate({ recipes, quiet = false } = {}) {
  if (ui.busy) return;
  if (!ui.inputs.front) { toast('Add a front view first.'); return; }
  ui.busy = true;
  $('go').disabled = true;
  const list = recipes || (ui.shapeMode === 'manual'
    ? [{ id: 'manual', label: 'Manual', settings: { ...ui.manual } }]
    : chooseRecipes(ui.variants));
  const base = { style: ui.style, resolution: ui.resolution, tolerance: ui.tolerance };
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
        object: out.object, stats: out.stats, thumb: thumbnail(out.object), rating: 0, storedRating: 0,
      });
      if (i === 0) { ui.results = results; select(0); }
      renderVariants();
    }
    if (!quiet && results.length > 1) toast('Compare the candidates, then rate the ones you like.');
  } catch (err) {
    toast(err.message);
  } finally {
    hidePipeline();
    ui.busy = false;
    $('go').disabled = false;
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
}

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
    <div><dt>Build time</dt><dd>${(r.stats.ms / 1000).toFixed(2)} s</dd></div>` : '';
  $('caption').innerHTML = r ? `<b>${esc(r.recipeLabel)}</b> · thickness ${r.settings.inflate.toFixed(2)} · smoothing ${r.settings.smooth}× · detail ${r.settings.detail.toFixed(2)}` : '';
  $('stars').innerHTML = [1, 2, 3, 4, 5].map(n =>
    `<button type="button" data-n="${n}" class="${r && r.rating >= n ? 'on' : ''}" aria-label="${n} star${n > 1 ? 's' : ''}" aria-pressed="${r?.rating === n}">★</button>`).join('');
  $('rate-note').className = 'note';
  $('rate-note').textContent = !r ? '' : r.recipe === 'manual'
    ? 'Manual settings are saved but do not train the recipes.'
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
  for (const [id, v] of [['style', ui.style], ['quality', ui.resolution]]) {
    $(id).querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === String(v)));
  }
  await generate({ recipes: [{ id: g.recipe, label: g.recipeLabel, settings: { inflate: g.settings.inflate, smooth: g.settings.smooth, detail: g.settings.detail } }], quiet: true });
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

await setView('front', cactusFront(640));
await setView('side', cactusSide(448));
await generate({ recipes: [RECIPES[1]], quiet: true });
if (ui.results[0]) { ui.results[0].sample = true; renderResult(); }

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
