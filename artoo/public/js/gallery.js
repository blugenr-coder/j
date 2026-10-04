import { mountShell, api, toast, esc, starsHtml, timeAgo, icons } from './shell.js';
import { createViewer } from './viewer.js';

mountShell();

const $ = id => document.getElementById(id);
let gens = [], models = {}, viewer = null;

function sorted() {
  const f = $('filter').value;
  const list = gens.filter(g => g.status === 'done' && (!f || g.modelId === f));
  const by = $('sort').value;
  if (by === 'best') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (by === 'unrated') list.sort((a, b) => (a.rating ? 1 : 0) - (b.rating ? 1 : 0));
  return list;
}

function render() {
  const list = sorted();
  $('grid').innerHTML = list.length ? list.map(g => `
    <article class="card" data-id="${g.id}">
      <button class="open" aria-label="Open ${esc(g.name || 'generation')} in 3D"><img class="thumb" src="${esc(g.image)}" alt="" loading="lazy"></button>
      <div class="card-body">
        <div class="card-row"><strong>${esc(g.name || models[g.modelId]?.name || 'Untitled')}</strong><span class="tag">${esc(g.engine)}</span></div>
        <div class="muted small">${esc(g.armLabel)} · ${timeAgo(g.createdAt)}</div>
        <div class="card-row">${starsHtml(g.rating)}<button class="icon-btn" data-del aria-label="Delete">${icons.trash}</button></div>
      </div>
    </article>`).join('')
    : '<div class="empty" style="grid-column:1/-1">Nothing here yet. <a href="/studio">Make your first 3D model</a>.</div>';
}

async function rate(id, n) {
  const g = gens.find(x => x.id === id);
  const rating = g.rating === n ? null : n;
  const res = await api(`generations/${id}/rate`, { method: 'POST', body: { rating } });
  Object.assign(g, res.generation);
  return g;
}

function openDialog(g) {
  $('dlg-side').innerHTML = `
    <h2 style="margin:0">${esc(g.name || models[g.modelId]?.name || 'Untitled')}</h2>
    <div class="muted small">${esc(models[g.modelId]?.name || '')} · ${esc(g.armLabel)}</div>
    <img src="${esc(g.image)}" alt="Source image">
    ${starsHtml(g.rating)}
    <a class="btn" href="${esc(g.glb)}" download>${icons.download} Download GLB</a>
    <button class="btn ghost" id="dlg-close">Close</button>`;
  $('dlg-side').dataset.id = g.id;
  $('dlg').showModal();
  viewer?.dispose();
  viewer = createViewer($('dlg-viewer'));
  viewer.load(g.glb).catch(e => toast(e.message, true));
}

$('grid').addEventListener('click', async e => {
  const card = e.target.closest('.card'); if (!card) return;
  const g = gens.find(x => x.id === card.dataset.id);
  try {
    const star = e.target.closest('[data-star]');
    if (star) { await rate(g.id, Number(star.dataset.star)); return render(); }
    if (e.target.closest('[data-del]')) {
      if (!confirm('Delete this generation?')) return;
      await api(`generations/${g.id}`, { method: 'DELETE' });
      gens = gens.filter(x => x !== g);
      return render();
    }
    if (e.target.closest('.open')) openDialog(g);
  } catch (err) { toast(err.message, true); }
});

$('dlg-side').addEventListener('click', async e => {
  if (e.target.id === 'dlg-close') return $('dlg').close();
  const star = e.target.closest('[data-star]'); if (!star) return;
  try {
    const g = await rate($('dlg-side').dataset.id, Number(star.dataset.star));
    $('dlg-side').querySelector('.stars').outerHTML = starsHtml(g.rating);
    render();
  } catch (err) { toast(err.message, true); }
});
$('dlg').addEventListener('close', () => { viewer?.dispose(); viewer = null; });
$('filter').addEventListener('change', render);
$('sort').addEventListener('change', render);

const [g, m] = await Promise.all([api('generations'), api('models')]);
gens = g;
models = Object.fromEntries(m.map(x => [x.id, x]));
$('filter').insertAdjacentHTML('beforeend', m.map(x => `<option value="${x.id}">${esc(x.name)}</option>`).join(''));
render();
