import { mountShell, api, toast, esc, icons } from './shell.js';

mountShell();

const list = document.getElementById('models');
let config;

function render(models) {
  if (!models.length) {
    list.innerHTML = '<div class="panel empty">No models yet. Create one on the left.</div>';
    return;
  }
  list.innerHTML = models.map(m => {
    const leader = m.rated ? m.best.id : null;
    const arms = [...m.arms].sort((a, b) => b.mean - a.mean).map(a => `
      <div class="arm${a.id === leader ? ' leader' : ''}">
        <span>${esc(a.label)} ${a.id === leader ? '<span class="tag best">best so far</span>' : ''}</span>
        <span class="muted">${a.n ? `${Math.round(a.mean * 100)}% · ${a.n} rating${a.n > 1 ? 's' : ''}` : 'untested'}</span>
        <div class="bar"><span style="width:${Math.round(a.mean * 100)}%"></span></div>
      </div>`).join('');
    const blocked = m.engine === 'meshy' && !config.engines.meshy;
    return `
      <article class="panel" data-id="${m.id}">
        <div class="model-head">
          <div>
            <h2 style="margin:0">${esc(m.name)}</h2>
            <p class="muted small" style="margin:4px 0 0">${esc(m.engine)} · ${m.generations} generations · ${m.rated} rated${m.description ? ` · ${esc(m.description)}` : ''}</p>
            ${blocked ? '<p class="small" style="color:var(--bad);margin:6px 0 0">The server has no MESHY_API_KEY — this model cannot generate yet.</p>' : ''}
          </div>
          <div class="actions">
            <a class="btn primary" href="/studio?model=${m.id}">${icons.cube} Generate</a>
            <a class="btn" href="/api/models/${m.id}/dataset.jsonl" title="Every rated image→model pair, for a future fine-tune">${icons.download} Dataset</a>
            <button class="btn ghost" data-act="reset">Reset training</button>
            <button class="btn ghost danger" data-act="delete" aria-label="Delete ${esc(m.name)}">${icons.trash}</button>
          </div>
        </div>
        ${arms}
      </article>`;
  }).join('');
}

const refresh = async () => render(await api('models'));

document.getElementById('create').addEventListener('submit', async e => {
  e.preventDefault();
  try {
    await api('models', { method: 'POST', body: {
      name: document.getElementById('name').value,
      engine: document.getElementById('engine').value,
      description: document.getElementById('desc').value,
    } });
    e.target.reset();
    toast('Model created');
    await refresh();
  } catch (err) { toast(err.message, true); }
});

list.addEventListener('click', async e => {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const card = btn.closest('[data-id]');
  const name = card.querySelector('h2').textContent;
  try {
    if (btn.dataset.act === 'reset') {
      if (!confirm(`Forget all ratings for "${name}"? The generated files stay.`)) return;
      await api(`models/${card.dataset.id}/reset`, { method: 'POST' });
    } else {
      if (!confirm(`Delete "${name}" and all its generations? This cannot be undone.`)) return;
      await api(`models/${card.dataset.id}`, { method: 'DELETE' });
    }
    await refresh();
  } catch (err) { toast(err.message, true); }
});

config = await api('config');
if (!config.engines.meshy) document.getElementById('engine').value = 'demo';
await refresh();
