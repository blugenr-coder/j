import { mountShell, api, toast, esc, starsHtml, icons } from './shell.js';
import { createViewer } from './viewer.js';
import { loadImage, buildModel, toGLB } from './engine.js';

mountShell();

const $ = id => document.getElementById(id);
let models = [], config, imageData = null, imageEl = null, count = 1;
const viewers = [];

// Shrink big photos before upload: engines don't need 6000px, and the upload
// is base64 JSON. Transparency survives as PNG.
async function prepare(file) {
  const src = URL.createObjectURL(file);
  const img = await loadImage(src);
  const s = Math.min(1, 1536 / Math.max(img.naturalWidth, img.naturalHeight));
  const c = Object.assign(document.createElement('canvas'), { width: Math.round(img.naturalWidth * s), height: Math.round(img.naturalHeight * s) });
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  URL.revokeObjectURL(src);
  const png = file.type === 'image/png';
  const data = c.toDataURL(png ? 'image/png' : 'image/jpeg', 0.92);
  return { data, img: await loadImage(data) };
}

async function setFile(file) {
  if (!file || !/^image\/(png|jpeg)$/.test(file.type)) return toast('Use a PNG or JPG image', true);
  try {
    ({ data: imageData, img: imageEl } = await prepare(file));
    $('drop-text').innerHTML = `<img src="${imageData}" alt="Selected image">`;
    $('go').disabled = !models.length;
  } catch (e) { toast(e.message, true); }
}

function updateNote() {
  const model = models.find(m => m.id === $('model').value);
  const note = $('engine-note');
  if (!model) { note.hidden = true; return; }
  if (model.engine === 'demo') {
    note.hidden = false;
    note.textContent = 'Browser engine: free and instant. It rounds the outline into a solid and paints the photo on, so hidden sides are a guess. Use a Meshy model when the back matters.';
  } else {
    note.hidden = config.engines.meshy;
    note.textContent = 'The server has no MESHY_API_KEY, so this model cannot generate yet.';
  }
  $('leader').textContent = model.rated
    ? `Best settings so far: ${model.best.label} (${model.rated} ratings)`
    : 'No ratings yet — the model is still exploring its settings.';
}

function card(gen) {
  const el = document.createElement('article');
  el.className = 'card';
  el.dataset.id = gen.id;
  el.innerHTML = `
    <div class="viewer"><div class="overlay"><div><span class="status">Starting…</span><div class="progress"><span style="width:0%"></span></div></div></div></div>
    <div class="card-body">
      <div class="card-row"><strong>${esc(gen.armLabel)}</strong><span class="tag">${esc(gen.engine)}</span></div>
      <div class="card-row">${starsHtml(gen.rating)}<a class="btn ghost small dl" hidden download>${icons.download} GLB</a></div>
    </div>`;
  return el;
}

function setStatus(el, text, pct) {
  const ov = el.querySelector('.overlay');
  if (text === null) { ov.hidden = true; return; }
  ov.hidden = false;
  ov.querySelector('.status').textContent = text;
  ov.querySelector('.progress span').style.width = `${pct ?? 0}%`;
}

async function show(el, gen) {
  setStatus(el, null);
  const v = createViewer(el.querySelector('.viewer'));
  viewers.push(v);
  await v.load(gen.glb);
  const dl = el.querySelector('.dl');
  dl.href = gen.glb; dl.download = `${gen.name || 'artoo'}-${gen.armId}.glb`; dl.hidden = false;
}

async function runDemo(el, gen) {
  try {
    const { object } = await buildModel({ front: imageEl }, gen.settings, (i, stage) => setStatus(el, `${stage}…`, (i + 1) * 20));
    const glb = await toGLB(object);
    const saved = await api(`generations/${gen.id}/glb`, { method: 'PUT', raw: glb });
    await show(el, saved);
  } catch (e) {
    setStatus(el, `Failed: ${e.message}`, 0);
  }
}

async function poll(el, gen) {
  for (;;) {
    const g = await api(`generations/${gen.id}`).catch(e => ({ ...gen, error: e.message }));
    if (g.status === 'done') return show(el, g);
    if (g.status === 'failed') return setStatus(el, `Failed: ${g.error || 'unknown error'}`, 0);
    setStatus(el, `Generating… ${g.progress || 0}%${g.error ? ' (retrying)' : ''}`, g.progress);
    await new Promise(r => setTimeout(r, 5000));
  }
}

$('results').addEventListener('click', async e => {
  const star = e.target.closest('[data-star]');
  if (!star) return;
  const el = star.closest('.card');
  const current = el.querySelectorAll('.stars .on').length;
  const n = Number(star.dataset.star);
  const rating = n === current ? null : n; // click the same star again to clear
  try {
    const { model } = await api(`generations/${el.dataset.id}/rate`, { method: 'POST', body: { rating } });
    el.querySelector('.stars').outerHTML = starsHtml(rating);
    models = models.map(m => (m.id === model.id ? model : m));
    updateNote();
  } catch (err) { toast(err.message, true); }
});

$('form').addEventListener('submit', async e => {
  e.preventDefault();
  if (!imageData) return toast('Choose an image first', true);
  $('go').disabled = true;
  try {
    const gens = await api('generate', { method: 'POST', body: { modelId: $('model').value, image: imageData, candidates: count, name: $('name').value } });
    viewers.splice(0).forEach(v => v.dispose());
    $('results').replaceChildren(...gens.map(card));
    const els = [...$('results').children];
    await Promise.all(gens.map((g, i) =>
      g.status === 'failed' ? setStatus(els[i], `Failed: ${g.error}`, 0)
        : g.engine === 'demo' ? runDemo(els[i], g) : poll(els[i], g)));
    toast('Done. Rate each result to train the model.');
  } catch (err) {
    toast(err.message, true);
  } finally {
    $('go').disabled = false;
  }
});

$('file').addEventListener('change', e => setFile(e.target.files[0]));
const drop = $('drop');
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('over'); setFile(e.dataTransfer.files[0]); });

$('count').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  count = Number(b.dataset.n);
  $('count').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
});
$('model').addEventListener('change', updateNote);

// First visit: create a starter model so the studio works straight away.
[config, models] = await Promise.all([api('config'), api('models')]);
if (!models.length) {
  const engine = config.engines.meshy ? 'meshy' : 'demo';
  models = [await api('models', { method: 'POST', body: { name: engine === 'meshy' ? 'My first model' : 'Demo model', engine } })];
}
const wanted = new URLSearchParams(location.search).get('model');
$('model').innerHTML = models.map(m => `<option value="${m.id}"${m.id === wanted ? ' selected' : ''}>${esc(m.name)} · ${m.engine}</option>`).join('');
updateNote();
$('go').disabled = !imageData;
