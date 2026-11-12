// DOM interface: hangar HUD, terminal (market / used / resell / blueprints / contract),
// flight instruments, event cards, memos and mission reports.
import { PARTS, PART, CATS, questLabel, questNeeds, fmtMoney, fmtDist, SCI_LABEL, SAT_LABEL } from './data.js';
import { S } from './state.js';
import { analyse, ATMO } from './sim.js';
import { HANGAR_EVENTS } from './events.js';
import { Audio } from './audio.js';
import { isTouch, Input } from './input.js';
import { WARPS } from './flight.js';
import { partThumb, rocketThumb } from './thumbs.js';

const $ = (s, r = document) => r.querySelector(s);
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (k === 'html') e.innerHTML = v; else if (v !== false && v != null) e.setAttribute(k, v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
};
const pn = def => def.id.toUpperCase().replace(/_/g, '-');
const pct = x => Math.round(x * 100) + '%';
const condClass = c => c > 0.75 ? 'ok' : c > 0.45 ? 'warn' : 'bad';
const kmh = m => Math.abs(m) >= 100000 ? (m / 1000).toFixed(0) + ' km' : Math.abs(m) >= 1000 ? (m / 1000).toFixed(1) + ' km' : Math.round(m) + ' m';

// side-profile silhouette of a part
export function partSVG(def, w = 44, hgt = 44) {
  const s = Math.min(w / (def.r * 2 + 0.6), hgt / (def.h + 0.2)) * 0.9;
  const W = def.r * s, H = def.h * s, cx = w / 2, by = (hgt + H) / 2, ty = by - H;
  const col = '#' + def.color.toString(16).padStart(6, '0');
  let body;
  switch (def.shape) {
    case 'cone': body = `<path d="M${cx - W} ${by}L${cx} ${ty}L${cx + W} ${by}Z" fill="${col}"/>`; break;
    case 'probe': case 'capsule': body = `<path d="M${cx - W} ${by}L${cx - W * 0.35} ${ty}L${cx + W * 0.35} ${ty}L${cx + W} ${by}Z" fill="${col}"/>`; break;
    case 'engine': case 'vacengine': body = `<rect x="${cx - W * 0.7}" y="${ty}" width="${W * 1.4}" height="${H * 0.4}" fill="#2b2f36"/><path d="M${cx - W * 0.35} ${ty + H * 0.4}L${cx - W} ${by}L${cx + W} ${by}L${cx + W * 0.35} ${ty + H * 0.4}Z" fill="${col}"/>`; break;
    case 'srb': body = `<path d="M${cx - W} ${by - H * 0.08}L${cx - W} ${ty + H * 0.1}L${cx} ${ty}L${cx + W} ${ty + H * 0.1}L${cx + W} ${by - H * 0.08}Z" fill="${col}"/><rect x="${cx - W * 0.6}" y="${by - H * 0.08}" width="${W * 1.2}" height="${H * 0.08}" fill="#2b2f36"/><rect x="${cx - W}" y="${ty + H * 0.25}" width="${W * 2}" height="${H * 0.06}" fill="#dc2626"/>`; break;
    case 'chute': body = `<rect x="${cx - W}" y="${ty + H * 0.4}" width="${W * 2}" height="${H * 0.6}" fill="#2b2f36"/><path d="M${cx - W} ${ty + H * 0.4}Q${cx} ${ty - H * 0.3} ${cx + W} ${ty + H * 0.4}Z" fill="${col}"/>`; break;
    case 'fins': case 'gridfins': body = `<rect x="${cx - W * 0.55}" y="${ty}" width="${W * 1.1}" height="${H}" fill="#d4d4d8"/><path d="M${cx - W * 0.55} ${ty}L${cx - W * 1.5} ${by}L${cx - W * 0.55} ${by}Z M${cx + W * 0.55} ${ty}L${cx + W * 1.5} ${by}L${cx + W * 0.55} ${by}Z" fill="${col}"/>`; break;
    case 'legs': body = `<rect x="${cx - W * 0.7}" y="${ty}" width="${W * 1.4}" height="${H * 0.6}" fill="#2b2f36"/><path d="M${cx - W * 0.6} ${ty + H * 0.3}L${cx - W * 1.4} ${by}M${cx + W * 0.6} ${ty + H * 0.3}L${cx + W * 1.4} ${by}" stroke="${col}" stroke-width="2.5"/>`; break;
    case 'decoupler': body = `<rect x="${cx - W}" y="${ty}" width="${W * 2}" height="${H}" fill="#facc15"/><path d="M${cx - W} ${ty}h${W * 2}v${H}h${-W * 2}z" fill="url(#hz)"/>`; break;
    case 'sat': body = `<rect x="${cx - W * 0.7}" y="${ty}" width="${W * 1.4}" height="${H}" fill="${col}"/><rect x="${cx - W * 1.5}" y="${ty + H * 0.2}" width="${W * 0.75}" height="${H * 0.6}" fill="#1e3a8a"/><rect x="${cx + W * 0.75}" y="${ty + H * 0.2}" width="${W * 0.75}" height="${H * 0.6}" fill="#1e3a8a"/>`; break;
    default: body = `<rect x="${cx - W}" y="${ty}" width="${W * 2}" height="${H}" fill="${col}"/>`;
  }
  return `<svg viewBox="0 0 ${w} ${hgt}" width="${w}" height="${hgt}" class="psvg"><defs><pattern id="hz" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="6" fill="#111"/></pattern></defs>${body}</svg>`;
}

function stackSVG(ids, maxH = 340, w = 120) {
  if (!ids.length) return `<svg width="${w}" height="80"><text x="${w / 2}" y="44" text-anchor="middle" class="svg-dim">EMPTY</text></svg>`;
  const defs = ids.map(id => PART[id]);
  const H = defs.reduce((a, d) => a + d.h, 0), R = Math.max(...defs.map(d => d.r));
  const s = Math.min(maxH / H, (w - 20) / (R * 3));
  const svgH = H * s + 10;
  let y = 5, out = '';
  defs.forEach((d, i) => {
    const ph = d.h * s, pw = d.r * s;
    out += `<g class="sv-part" data-i="${i}"><foreignObject x="0" y="0" width="0" height="0"></foreignObject>`;
    out += partSVG(d, pw * 3 + 4, ph).replace('<svg ', `<svg x="${w / 2 - (pw * 3 + 4) / 2}" y="${y}" preserveAspectRatio="none" `) + '</g>';
    y += ph;
  });
  return `<svg width="${w}" height="${svgH}" viewBox="0 0 ${w} ${svgH}">${out}</svg>`;
}

const pimg = (d, worn = false) => `<img class="pimg" alt="" src="${partThumb(d, worn)}">`;
const rimg = (ids, w, hh) => ids.length ? `<img class="rimg" alt="" src="${rocketThumb(ids, w, hh)}">` : '<div class="rimg-empty">EMPTY STACK</div>';

export class UI {
  constructor(game) {
    this.game = game;
    this.queue = new Set();
    this.toastsEl = $('#toasts');
    this.promptEl = $('#prompt');
    this.tab = 'contract';
    this.marketCat = 'core';
    this.editIds = null; this.editName = ''; this.editSel = -1;
    this.bindStatic();
    S.on(() => { this.refreshTop(); if (this.termOpen) this.renderTab(); });
  }
  consume(k) { if (this.queue.has(k)) { this.queue.delete(k); return true; } return false; }
  modalOpen() { return this.termOpen || !!$('#modal').classList.contains('on') || $('#menu').classList.contains('on'); }
  qLabel(q) { return questLabel(q); }

  bindStatic() {
    const tap = (id, fn) => { const e = $(id); e.addEventListener('click', ev => { ev.stopPropagation(); Audio.unlock(); fn(ev); }); };
    tap('#btn-primary', () => this.queue.add('primary'));
    tap('#btn-throw', () => this.queue.add('throw'));
    tap('#btn-term', () => this.openTerminal());
    tap('#btn-menu', () => this.game.showMenu());
    tap('#btn-sound', () => { Audio.setMuted(!Audio.muted); $('#btn-sound').classList.toggle('off', Audio.muted); });
    tap('#term-close', () => this.closeTerminal());
    document.querySelectorAll('#term-tabs button').forEach(b => b.addEventListener('click', () => { Audio.cue('click'); this.tab = b.dataset.tab; this.renderTab(); }));
    // flight controls
    const hold = (el, on, off) => {
      const start = e => { e.preventDefault(); e.stopPropagation(); Audio.unlock(); on(); el.classList.add('down'); };
      const end = e => { e.preventDefault(); off(); el.classList.remove('down'); };
      el.addEventListener('pointerdown', start); el.addEventListener('pointerup', end); el.addEventListener('pointerleave', end); el.addEventListener('pointercancel', end);
    };
    hold($('#rot-l'), () => this.touchRot = 1, () => this.touchRot = 0);
    hold($('#rot-r'), () => this.touchRot = -1, () => this.touchRot = 0);
    tap('#f-stage', () => this.flight?.doStage());
    tap('#f-chute', () => this.flight?.v.deployChute());
    tap('#f-warp-up', () => this.flight?.setWarp(this.flight.warpI + 1));
    tap('#f-warp-dn', () => this.flight?.setWarp(this.flight.warpI - 1));
    tap('#f-abort', () => this.confirm('ABORT MISSION', 'The rocket is destroyed by range safety. This counts as a failed attempt.', 'Abort', () => this.flight?.abort()));
    tap('#f-cam', () => { const f = this.flight; if (f) f.cam.dist = f.cam.dist > 60 ? Math.max(14, f.rocketH * 2.4 + 6) : 160; });
    // throttle slider
    const thr = $('#throttle');
    const setT = e => { const r = thr.getBoundingClientRect(); const y = (e.touches ? e.touches[0].clientY : e.clientY); if (this.flight) this.flight.v.throttle = Math.max(0, Math.min(1, 1 - (y - r.top) / r.height)); };
    thr.addEventListener('pointerdown', e => { e.stopPropagation(); this.thrDrag = true; thr.setPointerCapture(e.pointerId); setT(e); });
    thr.addEventListener('pointermove', e => { if (this.thrDrag) setT(e); });
    thr.addEventListener('pointerup', () => { this.thrDrag = false; });
    $('#hud-flight').addEventListener('pointerdown', e => { if (e.target.closest('button,#throttle,.ev-card')) this.anyFlightTouch = true; });
    $('#hud-flight').addEventListener('pointerup', () => { this.anyFlightTouch = false; });
    // event card input
    const evBtn = $('#ev-act');
    evBtn.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); Audio.unlock(); this.holding = true; this.flight?.events.tap(); evBtn.classList.add('down'); });
    const evUp = () => { this.holding = false; evBtn.classList.remove('down'); };
    evBtn.addEventListener('pointerup', evUp); evBtn.addEventListener('pointerleave', evUp); evBtn.addEventListener('pointercancel', evUp);
    document.body.classList.toggle('touch', isTouch);
  }

  // ---------- hangar HUD ----------
  enterHangar() {
    this.flight = null;
    $('#hud-flight').classList.remove('on'); $('#hud-hangar').classList.add('on');
    this.refreshTop();
  }
  refreshTop() {
    const L = S.lvl();
    $('#lvl-code').textContent = `CONTRACT ${String(L.n + 1).padStart(2, '0')}`;
    $('#lvl-name').textContent = L.name.toUpperCase();
    $('#lvl-attempt').textContent = S.attempt > 1 ? `ATTEMPT ${S.attempt}` : 'FIRST ATTEMPT';
    $('#funds').textContent = fmtMoney(S.cash);
    $('#funds').classList.toggle('neg', S.cash < 0);
    const ul = $('#obj-list'); ul.innerHTML = '';
    for (const q of L.quests) ul.append(h('li', {}, questLabel(q)));
    ul.append(h('li', { class: 'land' }, 'Land the rocket'));
    for (const b of L.bonus || []) ul.append(h('li', { class: 'bonus' }, `${questLabel(b)} `, h('b', {}, `+${fmtMoney(b.reward)}`)));
    const st = analyse(S.flightStack().map(p => p.id));
    this.refreshHint();
    $('#pad-info').textContent = S.pad.length ? `PAD · ${S.pad.length} PARTS · ${(st.wet / 1000).toFixed(1)} t · ΔV ${Math.round(st.totalDv)} m/s` : 'PAD EMPTY';
  }
  refreshHint() {
    const g = this.game.guide, el = $('#next-step');
    const t = g && !g.active ? g.nextHint() : '';
    if (el.dataset.t !== t) { el.dataset.t = t; el.innerHTML = t ? `<b>NEXT STEP</b>${t}` : ''; }
  }
  setPrompt(label, action, holding) {
    const p = this.promptEl;
    if (p.dataset.l !== label) {
      p.dataset.l = label;
      p.innerHTML = label ? `<kbd>${isTouch ? '' : action === 'terminal' || action === 'launch' ? 'E' : 'E'}</kbd><span>${label}</span>` : '';
      p.classList.toggle('on', !!label);
    }
    const b = $('#btn-primary');
    const txt = { grab: 'GRAB', place: 'PLACE', drop: 'DROP', terminal: 'USE', launch: 'LAUNCH' }[action] || (holding ? 'DROP' : '—');
    if (b.textContent !== txt) b.textContent = txt;
    b.classList.toggle('dim', !action && !holding);
    $('#btn-throw').classList.toggle('on', holding);
    $('#crosshair').classList.toggle('hot', !!action);
  }
  toast(text, kind = 'info') {
    const t = h('div', { class: 'toast ' + kind }, text);
    this.toastsEl.append(t);
    setTimeout(() => t.classList.add('out'), 3800); setTimeout(() => t.remove(), 4300);
    while (this.toastsEl.children.length > 5) this.toastsEl.firstChild.remove();
  }
  onStackChanged() { this.refreshTop(); }

  // ---------- terminal ----------
  openTerminal(tab) {
    if (tab) this.tab = tab;
    this.termOpen = true; Input.release();
    $('#terminal').classList.add('on'); this.renderTab();
  }
  closeTerminal() { this.termOpen = false; $('#terminal').classList.remove('on'); }
  renderTab() {
    document.querySelectorAll('#term-tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === this.tab));
    $('#term-funds').textContent = fmtMoney(S.cash);
    const body = $('#term-body');
    const scroll = body.scrollTop;
    body.innerHTML = '';
    this['tab_' + this.tab](body);
    body.scrollTop = scroll;
  }
  owned(id) { return S.inventory.filter(p => p.id === id && !S.pad.includes(p.uid)).length; }

  tab_contract(b) {
    const L = S.lvl();
    b.append(h('div', { class: 'brief' },
      h('div', { class: 'brief-head' }, h('span', { class: 'code' }, `CONTRACT ${String(L.n + 1).padStart(2, '0')} · ${L.generated ? 'GENERATED' : 'PROGRAM'}`), h('h2', {}, L.name)),
      h('p', { class: 'brief-text' }, L.brief),
      h('div', { class: 'brief-grid' },
        h('div', {}, h('h4', {}, 'Required'), h('ol', { class: 'checks' }, ...L.quests.map(q => h('li', {}, questLabel(q), questNeeds(q) ? h('small', {}, needText(questNeeds(q))) : null)), h('li', { class: 'land' }, 'Land the rocket (damaged is fine, destroyed is not)'))),
        h('div', {}, h('h4', {}, 'Bonus'), h('ol', { class: 'checks bonus' }, ...(L.bonus || []).map(q => h('li', {}, questLabel(q), h('b', {}, ' +' + fmtMoney(q.reward)))))),
        h('div', {}, h('h4', {}, 'Budget'), h('dl', { class: 'kv' },
          h('dt', {}, 'Grant'), h('dd', {}, fmtMoney(L.grant)),
          h('dt', {}, 'Available'), h('dd', {}, fmtMoney(S.cash)),
          h('dt', {}, 'Next grant'), h('dd', {}, fmtMoney(S.lvl().n + 1 < 999 ? (import_getLevel(L.n + 1).grant) : 0)),
          h('dt', {}, 'Failure'), h('dd', {}, 'Repeat with 45–60% grant'))),
      ),
      h('div', { class: 'rules' }, h('h4', {}, 'Flight rules'),
        h('p', {}, 'Complete every required objective, then land. A rocket that lands with damage still counts. A crash, or landing without the objectives, means repeating the contract with a smaller re-try grant. Recovered parts come back to storage worn; resell them or fly them again (worn parts fail more often).')),
      S.history.length ? h('div', { class: 'hist' }, h('h4', {}, 'Flight log'), h('table', {}, ...S.history.slice(0, 8).map(e => h('tr', {}, h('td', {}, `C${String(e.level + 1).padStart(2, '0')}`), h('td', {}, e.name), h('td', { class: e.success ? 'ok' : 'bad' }, e.success ? 'SUCCESS' : 'FAILED'), h('td', { class: 'dim' }, e.reason))))) : null,
    ));
  }

  tab_market(b) {
    const out = S.visit?.out;
    const chips = h('div', { class: 'chips' }, ...CATS.map(c => h('button', { class: c.id === this.marketCat ? 'on' : '', onclick: () => { this.marketCat = c.id; Audio.cue('click'); this.renderTab(); } }, c.name, S.visit?.mult[c.id] ? h('i', { class: S.visit.mult[c.id] < 1 ? 'sale' : 'up' }, S.visit.mult[c.id] < 1 ? 'SALE' : '+') : null)));
    b.append(chips);
    if (out === this.marketCat) b.append(h('div', { class: 'notice bad' }, 'OUT OF STOCK THIS VISIT — check the used market.'));
    const list = h('div', { class: 'rows cards' });
    for (const d of PARTS.filter(p => p.cat === this.marketCat)) {
      const price = S.price(d.id), base = d.price;
      const can = S.cash >= price && out !== d.cat;
      list.append(h('div', { class: 'row' },
        h('div', { class: 'ico', html: pimg(d) }),
        h('div', { class: 'info' }, h('div', { class: 'nm' }, d.name, h('span', { class: 'pn' }, pn(d))), h('div', { class: 'spec' }, specLine(d)), h('div', { class: 'desc' }, d.desc || '')),
        h('div', { class: 'own' }, this.owned(d.id) ? `×${this.owned(d.id)} owned` : ''),
        h('div', { class: 'price' + (price < base ? ' sale' : price > base ? ' up' : '') }, fmtMoney(price), price !== base ? h('s', {}, fmtMoney(base)) : null),
        h('button', { class: 'buy', disabled: !can, onclick: () => { if (S.buy(d.id)) { Audio.cue('buy'); this.toast(`${d.name} ordered — arriving at DELIVERY`, 'good'); } else Audio.cue('error'); } }, 'BUY'),
      ));
    }
    b.append(list);
  }

  tab_used(b) {
    b.append(h('div', { class: 'notice' }, 'Second-hand parts from other programs. Cheap, but worn parts break more often in flight and survive less damage.'));
    const list = h('div', { class: 'rows cards' });
    if (!S.used.length) list.append(h('div', { class: 'empty' }, 'Nothing listed. New listings arrive after each flight.'));
    for (const u of S.used) {
      const d = PART[u.id];
      list.append(h('div', { class: 'row' },
        h('div', { class: 'ico', html: pimg(d, u.cond < 0.6) }),
        h('div', { class: 'info' }, h('div', { class: 'nm' }, d.name, h('span', { class: 'pn' }, 'USED · ' + pn(d))), h('div', { class: 'spec' }, specLine(d))),
        condBar(u.cond),
        h('div', { class: 'price' }, fmtMoney(u.price), h('s', {}, fmtMoney(d.price))),
        h('button', { class: 'buy', disabled: S.cash < u.price, onclick: () => { if (S.buyUsed(u.uid)) { Audio.cue('buy'); this.toast(`${d.name} (used) arriving at DELIVERY`, 'good'); } else Audio.cue('error'); } }, 'BUY'),
      ));
    }
    b.append(list);
  }

  tab_resell(b) {
    const inv = S.inventory.filter(p => !S.pad.includes(p.uid)).sort((a, b) => PART[a.id].cat.localeCompare(PART[b.id].cat));
    b.append(h('div', { class: 'notice' }, 'Sell parts you are not using. Value depends on condition. Parts stacked on the pad cannot be sold.'));
    const list = h('div', { class: 'rows cards' });
    if (!inv.length) list.append(h('div', { class: 'empty' }, 'No spare parts in the hangar.'));
    for (const p of inv) {
      const d = PART[p.id], v = S.sellValue(p);
      list.append(h('div', { class: 'row' },
        h('div', { class: 'ico', html: pimg(d, p.cond < 0.6) }),
        h('div', { class: 'info' }, h('div', { class: 'nm' }, d.name, h('span', { class: 'pn' }, pn(d))), h('div', { class: 'spec' }, specLine(d))),
        condBar(p.cond),
        h('div', { class: 'price' }, fmtMoney(v)),
        h('button', { class: 'sell', onclick: () => { const got = S.sell(p.uid); if (got) { Audio.cue('sell'); this.toast(`Sold ${d.name} for ${fmtMoney(got)}`, 'good'); } } }, 'SELL'),
      ));
    }
    b.append(list);
  }

  tab_blueprints(b) {
    if (!this.editIds) { const bp = S.blueprints[S.plan]; this.editIds = bp ? bp.ids.slice() : []; this.editName = bp ? bp.name : 'New design'; this.editIdx = S.plan; }
    const ids = this.editIds;
    const A = analyse(ids);
    // saved designs bar
    const saved = h('div', { class: 'bp-saved' },
      h('span', { class: 'lbl' }, 'DESIGNS'),
      ...S.blueprints.map((bp, i) => h('button', { class: (i === this.editIdx ? 'on ' : '') + (i === S.plan ? 'active' : ''), onclick: () => { this.editIds = bp.ids.slice(); this.editName = bp.name; this.editIdx = i; this.editSel = -1; this.renderTab(); } }, bp.name)),
      h('button', { class: 'ghost', onclick: () => { this.editIds = []; this.editName = 'Design ' + (S.blueprints.length + 1); this.editIdx = null; this.editSel = -1; this.renderTab(); } }, '+ NEW'));
    b.append(saved);

    const grid = h('div', { class: 'bp-grid' });
    // palette
    const pal = h('div', { class: 'bp-pal' }, h('h4', {}, 'Add part ', h('small', {}, this.editSel >= 0 ? 'inserts above selection' : 'adds to top')));
    for (const c of CATS) {
      pal.append(h('div', { class: 'pal-cat' }, c.name));
      for (const d of PARTS.filter(p => p.cat === c.id)) pal.append(h('button', { class: 'pal-item', onclick: () => { Audio.cue('click'); const at = this.editSel >= 0 ? this.editSel : 0; ids.splice(at, 0, d.id); if (this.editSel >= 0) this.editSel++; this.renderTab(); } }, h('span', { class: 'ico', html: pimg(d) }), h('span', {}, d.name), h('em', {}, fmtMoney(S.price(d.id)))));
    }
    // stack
    const stackCol = h('div', { class: 'bp-stack' },
      h('input', { class: 'bp-name', value: this.editName, oninput: e => { this.editName = e.target.value; } }),
      h('div', { class: 'bp-vis', html: rimg(ids, 260, 420) }),
    );
    const flawIdx = new Map(A.flaws.filter(f => f.i >= 0).map(f => [f.i, f]));
    const lst = h('ol', { class: 'bp-list' });
    ids.forEach((id, i) => {
      const d = PART[id], have = 0;
      const fl = flawIdx.get(i);
      lst.append(h('li', { class: (i === this.editSel ? 'sel ' : '') + (fl ? 'flaw' : '') + (A.stageOf[i] !== A.stageOf[i - 1] && i > 0 ? ' newstage' : ''), onclick: () => { this.editSel = this.editSel === i ? -1 : i; this.renderTab(); } },
        h('span', { class: 'stg' }, 'S' + (A.stageOf[i] + 1)),
        h('span', { class: 'ico', html: pimg(d) }), h('span', { class: 'n' }, d.name),
        h('span', { class: 'ctl' },
          h('button', { onclick: e => { e.stopPropagation(); if (i > 0) { [ids[i - 1], ids[i]] = [ids[i], ids[i - 1]]; this.editSel = i - 1; this.renderTab(); } } }, '▲'),
          h('button', { onclick: e => { e.stopPropagation(); if (i < ids.length - 1) { [ids[i + 1], ids[i]] = [ids[i], ids[i + 1]]; this.editSel = i + 1; this.renderTab(); } } }, '▼'),
          h('button', { onclick: e => { e.stopPropagation(); ids.splice(i, 1); this.editSel = -1; this.renderTab(); } }, '✕'))));
    });
    stackCol.append(h('div', { class: 'bp-listhead' }, h('span', {}, 'TOP'), h('span', {}, 'tap to select')), lst, h('div', { class: 'bp-listhead' }, h('span', {}, 'BOTTOM · fires first'), h('span', {})));
    // analysis
    const counts = {}; ids.forEach(id => counts[id] = (counts[id] || 0) + 1);
    const avail = {}; S.inventory.forEach(p => { avail[p.id] = (avail[p.id] || 0) + 1; });
    let missingCost = 0; const missing = [];
    for (const [id, n] of Object.entries(counts)) { const m = Math.max(0, n - (avail[id] || 0)); for (let k = 0; k < m; k++) { missing.push(id); missingCost += S.price(id); } }
    const stat = h('div', { class: 'bp-stat' },
      h('h4', {}, 'Engineering'),
      h('dl', { class: 'kv big' },
        h('dt', {}, 'Total ΔV'), h('dd', {}, Math.round(A.totalDv) + ' m/s'),
        h('dt', {}, 'Launch TWR'), h('dd', { class: A.stages[0] && A.stages[0].twrSL < 1.15 ? 'bad' : '' }, A.stages[0] ? A.stages[0].twrSL.toFixed(2) : '—'),
        h('dt', {}, 'Mass'), h('dd', {}, (A.wet / 1000).toFixed(2) + ' t'),
        h('dt', {}, 'New cost'), h('dd', {}, fmtMoney(ids.reduce((a, id) => a + S.price(id), 0))),
        h('dt', {}, 'Still to buy'), h('dd', { class: missingCost > S.cash ? 'bad' : '' }, missing.length ? `${missing.length} · ${fmtMoney(missingCost)}` : 'nothing')),
      h('table', { class: 'stages' }, h('tr', {}, h('th', {}, 'STG'), h('th', {}, 'ΔV vac'), h('th', {}, 'TWR'), h('th', {}, 'mass')),
        ...A.stages.map(s => h('tr', {}, h('td', {}, 'S' + (s.s + 1)), h('td', {}, Math.round(s.dvVac)), h('td', {}, s.engines ? s.twrSL.toFixed(2) + ' / ' + s.twrVac.toFixed(2) : '—'), h('td', {}, (s.wet / 1000).toFixed(1) + 't')))),
      h('p', { class: 'hint' }, 'Reference: ~1,500 m/s to reach space, ~2,300 m/s for orbit, plus fuel or parachutes to land.'),
    );
    if (A.flaws.length || A.warnings.length) {
      stat.append(h('h4', { class: 'flaw-h' }, `Build review · ${A.flaws.length + A.warnings.length} issue${A.flaws.length + A.warnings.length > 1 ? 's' : ''}`));
      stat.append(h('ul', { class: 'flaws' }, ...A.warnings.map(w => h('li', { class: 'sev3' }, w)), ...A.flaws.map(f => h('li', { class: 'sev' + f.sev }, f.text))));
    } else if (ids.length) stat.append(h('div', { class: 'notice ok' }, 'Build review: no structural issues found.'));
    const L = S.lvl(); const need = L.quests.map(questNeeds).filter(Boolean);
    const lacking = need.filter(n => !ids.some(id => (n.sci && PART[id].sci === n.sci) || (n.sat && PART[id].sat === n.sat) || (n.crew && PART[id].crew)));
    if (lacking.length) stat.append(h('div', { class: 'notice bad' }, 'Contract needs: ' + lacking.map(needText).join(', ')));
    // actions
    const act = h('div', { class: 'bp-actions' },
      h('button', { onclick: () => this.saveBP(false) }, 'SAVE'),
      h('button', { onclick: () => this.saveBP(true) }, 'SAVE AS NEW'),
      h('button', { class: 'pri', onclick: () => { const i = this.saveBP(false, true); S.plan = i; S.save(); S.emit(); this.toast('Active blueprint set — the pad hologram shows the build order', 'good'); } }, 'SET ACTIVE'),
      h('button', { class: 'buy-missing', disabled: !missing.length || missingCost > S.cash, onclick: () => { for (const id of missing) S.buy(id); Audio.cue('buy'); this.toast(`Ordered ${missing.length} parts`, 'good'); } }, missing.length ? `BUY MISSING ${fmtMoney(missingCost)}` : 'ALL PARTS OWNED'),
      h('button', { class: S.visit?.craneOff ? 'dim' : '', onclick: () => { const i = this.saveBP(false, true); S.plan = i; S.save(); const err = this.game.hangar.autoAssemble(); if (err) { this.toast(err, 'bad'); Audio.cue('error'); } else { this.toast('Crane assembling…', 'good'); this.closeTerminal(); } } }, 'CRANE ASSEMBLE'),
      h('button', { class: 'warn', onclick: () => { this.game.hangar.clearPad(); this.toast('Pad cleared', 'info'); } }, 'CLEAR PAD'),
      this.editIdx != null ? h('button', { class: 'ghost', onclick: () => { S.blueprints.splice(this.editIdx, 1); if (S.plan === this.editIdx) S.plan = null; else if (S.plan > this.editIdx) S.plan--; this.editIds = null; S.save(); this.renderTab(); } }, 'DELETE') : null,
    );
    grid.append(pal, stackCol, stat);
    b.append(grid, act);
  }
  saveBP(asNew, quiet) {
    const bp = { name: (this.editName || 'Design').slice(0, 32), ids: this.editIds.slice() };
    let i = this.editIdx;
    if (asNew || i == null) { S.blueprints.push(bp); i = S.blueprints.length - 1; } else S.blueprints[i] = bp;
    this.editIdx = i; S.save(); S.emit();
    if (!quiet) { Audio.cue('click'); this.toast('Blueprint saved', 'good'); }
    return i;
  }

  // ---------- modals ----------
  modal(content, cls = '') {
    const m = $('#modal'); m.className = 'on ' + cls; const box = $('#modal-box'); box.innerHTML = ''; box.append(content);
    Input.release();
  }
  closeModal() { $('#modal').className = ''; }
  confirm(title, text, ok, fn) {
    this.modal(h('div', { class: 'dlg' }, h('h3', {}, title), h('p', {}, text), h('div', { class: 'dlg-btns' }, h('button', { onclick: () => this.closeModal() }, 'Cancel'), h('button', { class: 'pri', onclick: () => { this.closeModal(); fn(); } }, ok))));
  }

  hangarEvent() {
    if (this.modalOpen() || this.termOpen) return false;
    const pool = HANGAR_EVENTS.slice();
    for (let tries = 0; tries < 8; tries++) {
      const e = pool[Math.floor(Math.random() * pool.length)](S);
      if (!e) continue;
      Audio.cue('chime');
      const memo = h('div', { class: 'memo' },
        h('div', { class: 'memo-head' }, h('span', {}, 'INTERNAL MEMO'), h('span', {}, `REF ${Math.floor(Math.random() * 9000 + 1000)}-${String(S.level + 1).padStart(2, '0')}`)),
        h('h3', {}, e.title), h('p', {}, e.text),
        h('div', { class: 'memo-btns' }, ...e.choices.map(c => h('button', { onclick: () => { const res = c.run(); S.save(); S.emit(); Audio.cue('click'); this.closeModal(); if (res) this.toast(res, 'info'); } }, c.label))),
        h('div', { class: 'stamp' }, 'ACTION REQUIRED'));
      this.modal(memo, 'paper');
      return true;
    }
    return false;
  }

  requestLaunch() {
    const stack = S.flightStack();
    if (!stack.length) { this.toast('The pad is empty. Stack parts on the pad first.', 'bad'); Audio.cue('error'); return; }
    const A = analyse(stack.map(p => p.id));
    const L = S.lvl();
    const lacking = L.quests.map(questNeeds).filter(Boolean).filter(n => !stack.some(p => (n.sci && PART[p.id].sci === n.sci) || (n.sat && PART[p.id].sat === n.sat) || (n.crew && PART[p.id].crew)));
    const worn = stack.filter(p => p.cond < 0.5);
    const issues = [...A.warnings.map(t => ({ sev: 3, text: t })), ...A.flaws, ...lacking.map(n => ({ sev: 3, text: `Contract needs ${needText(n)} — not on the rocket.` })), ...worn.map(p => ({ sev: 1, text: `${PART[p.id].name} is worn (${pct(p.cond)}) and more likely to fail.` }))];
    const go = A.stages[0]?.twrSL >= 1 && stack.some(p => PART[p.id].core);
    const box = h('div', { class: 'dlg review' },
      h('div', { class: 'rev-head' }, h('span', { class: 'code' }, 'PRE-FLIGHT REVIEW'), h('h3', {}, go ? (issues.length ? 'GO WITH RISKS' : 'ALL SYSTEMS GO') : 'NO-GO')),
      h('div', { class: 'rev-body' },
        h('div', { class: 'rev-vis', html: rimg(stack.map(p => p.id), 180, 300) }),
        h('div', {},
          h('dl', { class: 'kv' }, h('dt', {}, 'Parts'), h('dd', {}, stack.length), h('dt', {}, 'Mass'), h('dd', {}, (A.wet / 1000).toFixed(2) + ' t'), h('dt', {}, 'ΔV'), h('dd', {}, Math.round(A.totalDv) + ' m/s'), h('dt', {}, 'TWR'), h('dd', {}, A.stages[0] ? A.stages[0].twrSL.toFixed(2) : '—'), h('dt', {}, 'Stages'), h('dd', {}, A.stages.length)),
          issues.length ? h('ul', { class: 'flaws' }, ...issues.map(f => h('li', { class: 'sev' + f.sev }, f.text))) : h('div', { class: 'notice ok' }, 'No issues found.'))),
      h('div', { class: 'dlg-btns' }, h('button', { onclick: () => this.closeModal() }, 'Scrub'), h('button', { class: 'pri', disabled: !go, onclick: () => { this.closeModal(); this.game.launch(); } }, go ? 'ROLL OUT' : 'CANNOT FLY')));
    this.modal(box);
  }

  // ---------- flight HUD ----------
  showFlight(f) {
    this.flight = f;
    this.closeTerminal();
    $('#hud-hangar').classList.remove('on'); $('#hud-flight').classList.add('on');
    const ql = $('#f-quests'); ql.innerHTML = '';
    this.qEls = [];
    for (const q of f.quests) { const li = h('li', {}, questLabel(q)); ql.append(li); this.qEls.push([q, li]); }
    const land = h('li', { class: 'land' }, 'Land safely'); ql.append(land); this.landEl = land;
    for (const q of f.bonus) { const li = h('li', { class: 'bonus' }, questLabel(q)); ql.append(li); this.qEls.push([q, li]); }
    this.lastActions = '';
    $('#f-log').innerHTML = '';
    this.lastMsgCount = 0;
    if (!this.game.guide?.active) this.toast('Press IGNITE (Space) to start the engines', 'info');
  }

  updateFlight(f, dt) {
    const v = f.v, o = v.orbit();
    const g = v.mod.hudGlitch > 0;
    if (g) v.mod.hudGlitch -= dt;
    const sc = x => g ? scramble(x) : x;
    $('#t-alt').textContent = sc(kmh(v.alt));
    $('#t-spd').textContent = sc(Math.round(v.speed) + ' m/s');
    $('#t-vs').textContent = sc((v.vVert >= 0 ? '+' : '') + Math.round(v.vVert) + ' m/s');
    $('#t-hs').textContent = sc(Math.round(Math.abs(v.vHorz)) + ' m/s');
    $('#t-apo').textContent = sc(o.escape ? 'ESCAPE' : kmh(Math.max(o.apo, -R0)));
    $('#t-pe').textContent = sc(o.escape ? '—' : o.pe < -R0 + 1000 ? '—' : kmh(o.pe));
    $('#t-pe').className = o.pe > ATMO ? 'ok' : '';
    $('#t-time').textContent = 'T+' + fmtT(v.airT);
    $('#t-zone').textContent = v.alt > ATMO ? (v.inOrbit() ? 'STABLE ORBIT' : 'SPACE') : v.alt > 20000 ? 'UPPER ATMOSPHERE' : v.liftoff ? 'LOWER ATMOSPHERE' : 'ON PAD';
    // bars
    const [sf, sfm] = v.stageFuel(); const [bf, bfm] = v.srbFuel();
    const fuel = sfm + bfm > 0 ? (sf + bf) / (sfm + bfm) : 0;
    setBar('#b-fuel', fuel, fuel < 0.15 ? 'bad' : '');
    $('#b-fuel-v').textContent = sfm + bfm ? pct(fuel) : 'NONE';
    const tf = v.fuel0 ? v.totalFuel() / v.fuel0 : 0; setBar('#b-tfuel', tf); $('#b-tfuel-v').textContent = pct(tf);
    setBar('#b-heat', Math.min(1, v.heat / 100), v.heat > 70 ? 'bad' : v.heat > 35 ? 'warn' : ''); $('#b-heat-v').textContent = Math.round(v.heat) + '%';
    const hull = v.hull(); setBar('#b-hull', hull, hull < 0.4 ? 'bad' : hull < 0.7 ? 'warn' : ''); $('#b-hull-v').textContent = pct(hull);
    const thr = v.mod.throttleStuck >= 0 ? v.mod.throttleStuck : v.throttle;
    $('#thr-fill').style.height = thr * 100 + '%'; $('#thr-v').textContent = Math.round(thr * 100);
    $('#throttle').classList.toggle('stuck', v.mod.throttleStuck >= 0);
    // attitude
    $('#att-rocket').style.transform = `rotate(${-v.pitch * 180 / Math.PI}deg)`;
    const pro = Math.atan2(v.vHorz, v.vVert);
    $("#att-pro").style.transform = `rotate(${(v.speed > 5 ? -pro : 0) * 180 / Math.PI}deg)`;
    $('#att-pro').style.opacity = v.speed > 5 ? 1 : 0.2;
    $('#t-pitch').textContent = Math.round(v.pitch * 180 / Math.PI) + '°';
    // stage + misc
    $('#f-stage').innerHTML = !v.ignited ? 'IGNITE<small>SPACE</small>' : (!v.liftoff && v.parts.some(p => p.hangFire)) ? 'RETRY IGNITION<small>SPACE</small>' : v.curStage < v.maxStage ? `STAGE ${v.curStage + 2}<small>SPACE</small>` : 'NO STAGES<small>—</small>';
    $('#f-stage').classList.toggle('dim', v.ignited && v.curStage >= v.maxStage);
    const hasChute = v.live().some(p => p.def.chute && !p.destroyed);
    $('#f-chute').classList.toggle('dim', !hasChute || v.chuteOn);
    $('#f-chute').innerHTML = v.chuteOn ? 'CHUTE OUT' : hasChute ? `CHUTE<small>${v.speed > 300 && v.alt < ATMO ? 'TOO FAST' : 'P'}</small>` : 'NO CHUTE';
    $('#f-chute').classList.toggle('danger', hasChute && !v.chuteOn && v.speed > 300 && v.alt < ATMO);
    $('#f-warp').textContent = WARPS[f.warpI] + '×';
    $('#f-warp-up').classList.toggle('dim', f.warpI >= f.maxWarp());
    $('#f-repairs').textContent = v.repairs ? `REPAIR KITS ${v.repairs}` : '';
    $('#f-land').textContent = `TOUCHDOWN LIMIT ${v.landLimit().toFixed(0)} m/s`;
    // ground proximity warning
    const tti = v.vVert < -1 ? v.alt / -v.vVert : 99;
    const warn = v.liftoff && !v.ended && v.alt < 3000 && -v.vVert > v.landLimit() && tti < 25;
    $('#t-vs').classList.toggle('blink', warn);
    $('#gpws').classList.toggle('on', warn && tti < 12);
    // objectives
    for (const [q, li] of this.qEls) { li.classList.toggle('done', q.done); li.classList.toggle('failed', !!q.failed); }
    this.landEl.classList.toggle('done', !!v.landed);
    // action buttons
    const acts = f.actions();
    const sig = acts.map(a => a.id + a.ready + a.pending).join('|');
    if (sig !== this.lastActions) {
      this.lastActions = sig;
      const box = $('#f-actions'); box.innerHTML = '';
      for (const a of acts) box.append(h('button', { class: (a.ready ? 'ready ' : '') + (a.blocked ? 'blocked' : ''), onclick: e => { e.stopPropagation(); f.doAction(a.id); } }, a.label, h('small', {}, a.blocked ? 'BLOCKED' : a.ready ? 'IN RANGE' : a.pending ? 'NOT YET' : 'NO TASK')));
    }
    // log
    if (v.messages.length && v.messages[v.messages.length - 1] !== this.lastMsg) {
      this.lastMsg = v.messages[v.messages.length - 1];
      const log = $('#f-log'); log.innerHTML = '';
      for (const m of v.messages.slice(-5)) log.append(h('div', { class: m.kind }, `T+${fmtT(m.t)}  ${m.text}`));
    }
    this.updateEvent(f);
  }

  updateEvent(f) {
    const e = f.events.active, card = $('#ev');
    if (!e) { card.classList.remove('on'); this.evShown = null; return; }
    const d = e.def;
    if (this.evShown !== e) {
      this.evShown = e;
      card.className = 'on ' + (d.positive ? 'pos' : 'neg') + ' k-' + d.kind;
      $('#ev-tag').textContent = d.positive ? 'OPPORTUNITY' : d.kind === 'info' ? 'ADVISORY' : 'MASTER CAUTION';
      $('#ev-title').textContent = d.title; $('#ev-text').textContent = e.autoFix ? 'Repair kit engaging…' : d.text;
      const ch = $('#ev-choices'); ch.innerHTML = '';
      if (d.kind === 'choice') d.choices.forEach((c, i) => ch.append(h('button', { onclick: ev => { ev.stopPropagation(); f.events.choose(i); } }, h('kbd', {}, i + 1), c.label)));
      $('#ev-act').textContent = { tap: 'ACT NOW', mash: 'MASH', hold: 'HOLD', timing: 'NOW' }[d.kind] || '';
      $('#ev-act').style.display = ['tap', 'mash', 'hold', 'timing'].includes(d.kind) ? '' : 'none';
      $('#ev-zone').style.display = d.kind === 'timing' ? '' : 'none';
      $('#ev-zone-ok').style.left = ((e.zone / 1.35) - 0.11) * 100 + '%';
    }
    $('#ev-time').style.width = Math.max(0, e.left / d.time) * 100 + '%';
    let prog = '';
    if (d.kind === 'mash') prog = `${e.taps}/${d.n}`;
    if (d.kind === 'hold' || d.kind === 'steer') { prog = Math.round(Math.min(1, e.prog / d.hold) * 100) + '%'; }
    if (d.kind === 'steer') prog += ' · steer ◀ ▶';
    $('#ev-prog').textContent = prog;
    if (d.kind === 'timing') { const p = e.phase < 1 ? e.phase : 2 - e.phase; $('#ev-needle').style.left = p * 100 + '%'; }
  }

  showResult(r) {
    const won = r.success;
    const title = won ? 'MISSION SUCCESS' : r.crashed ? 'VEHICLE LOST' : 'CONTRACT INCOMPLETE';
    const st = r.stats;
    const box = h('div', { class: 'report ' + (won ? 'win' : 'lose') },
      h('div', { class: 'rep-head' }, h('span', { class: 'code' }, `FLIGHT REPORT · ${r.level.name.toUpperCase()}`), h('h2', {}, title), h('p', {}, r.reason)),
      h('div', { class: 'rep-grid' },
        h('div', {}, h('h4', {}, 'Objectives'), h('ul', { class: 'checks' },
          ...r.quests.map(q => h('li', { class: q.done ? 'done' : 'miss' }, questLabel(q))),
          h('li', { class: r.landed ? 'done' : 'miss' }, r.landed ? `Landed at ${st.impact.toFixed(1)} m/s` : 'Landing'),
          ...r.bonus.map(q => h('li', { class: (q.done ? 'done' : 'miss') + ' bonus' }, questLabel(q), ' ', h('b', {}, '+' + fmtMoney(q.reward)))))),
        h('div', {}, h('h4', {}, 'Telemetry'), h('dl', { class: 'kv' },
          h('dt', {}, 'Max altitude'), h('dd', {}, kmh(st.maxAlt)), h('dt', {}, 'Max speed'), h('dd', {}, Math.round(st.maxSpeed) + ' m/s'),
          h('dt', {}, 'Flight time'), h('dd', {}, fmtT(st.air)), h('dt', {}, 'Failures handled'), h('dd', {}, st.resolved),
          h('dt', {}, 'Hull at landing'), h('dd', {}, r.landed ? pct(st.hull) : '—'), h('dt', {}, 'Downrange'), h('dd', {}, st.dist != null ? kmh(st.dist) : '—'),
          h('dt', {}, 'Parts recovered'), h('dd', {}, r.recovered))),
        h('div', {}, h('h4', {}, 'Funding'), h('table', { class: 'money' }, ...r.lines.map(([k, v]) => h('tr', {}, h('td', {}, k), h('td', { class: v < 0 ? 'bad' : 'ok' }, (v >= 0 ? '+' : '') + fmtMoney(v)))), h('tr', { class: 'tot' }, h('td', {}, 'Available now'), h('td', {}, fmtMoney(S.cash))))),
      ),
      won ? h('p', { class: 'trust' }, 'The ministry is impressed. Next contract unlocked with a larger budget.') : h('p', { class: 'trust' }, 'Trust is down. You must repeat this contract on a reduced re-try grant.'),
      h('div', { class: 'dlg-btns' }, h('button', { class: 'pri', onclick: () => { this.closeModal(); this.game.toHangar(); } }, 'RETURN TO HANGAR')),
      h('div', { class: 'stamp big' }, won ? 'APPROVED' : 'REJECTED'));
    this.modal(box, 'report-wrap');
  }
}

const R0 = 300000;
function scramble(s) { return String(s).replace(/[0-9]/g, () => Math.floor(Math.random() * 10)); }
function fmtT(t) { t = Math.max(0, Math.floor(t)); const m = Math.floor(t / 60), s = t % 60; return (m >= 60 ? Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0'); }
function setBar(sel, f, cls = '') { const e = $(sel); e.style.width = Math.max(0, Math.min(1, f)) * 100 + '%'; e.className = 'fill ' + cls; }
function condBar(c) { return h('div', { class: 'cond ' + condClass(c) }, h('div', { class: 'cbar' }, h('i', { style: `width:${c * 100}%` })), h('span', {}, pct(c))); }
function needText(n) { return n.sci ? `${SCI_LABEL[n.sci].toLowerCase()} instrument` : n.sat ? `${SAT_LABEL[n.sat]} payload` : 'a crew pod'; }
function specLine(d) {
  const p = [`${d.mass} kg`, `Ø${(d.r * 2).toFixed(1)} m`];
  if (d.fuel) p.push(`${d.fuel} kg fuel`);
  if (d.engine) p.push(`${d.engine.thrust} kN`, `Isp ${d.engine.ispSL}/${d.engine.ispVac}`, d.engine.srb ? 'solid' : 'liquid');
  if (d.chute) p.push(`${d.chute.area} m² canopy`);
  if (d.legs) p.push(`≤${d.legs.limit} m/s`);
  if (d.shield) p.push(`ablator ${d.shield.abl}`);
  if (d.core) p.push(`SAS ${d.core.sas}`);
  if (d.crew) p.push(`${d.crew} crew`);
  if (d.payload) p.push(`${d.payload} kg payload`);
  return p.join(' · ');
}
import { getLevel as import_getLevel } from './data.js';
