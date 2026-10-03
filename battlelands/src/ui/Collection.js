/* Collection: every cosmetic by category. Owned → tap to equip.
   Locked → shows how to unlock (level, price → shop purchase). */
import { icon } from './Icons.js';
import { $, $$, press, toast, esc } from './dom.js';
import { t } from './i18n.js';
import { CATEGORIES, isOwned, findItem } from '../progression/Cosmetics.js';
import { itemCard, paintPortraits } from './Cards.js';
import { purchase } from './Shop.js';

let lastCat = 'characters';

export function renderCollection({ app, menu, panel }) {
  const s = app.save;
  panel.innerHTML = `
    <div class="panel-head"><h1 class="h2">${t('COLLECTION')}</h1></div>
    <div class="tabs" role="tablist">${Object.entries(CATEGORIES).map(([k, c]) => `<button class="tab ${k === lastCat ? 'active' : ''}" role="tab" data-cat="${k}" aria-selected="${k === lastCat}">${t(c.label)}</button>`).join('')}</div>
    <div class="scroll"><div class="grid" id="grid"></div></div>`;
  const grid = $('#grid', panel);
  const draw = () => {
    const cat = CATEGORIES[lastCat];
    const owned = cat.items.filter(i => isOwned(s, lastCat, i.id)).length;
    grid.innerHTML = cat.items.map((it, i) => itemCard(lastCat, it, s, { selected: s.equipped[cat.slot] === it.id, delay: i * 25 })).join('');
    $('.panel-head', panel).innerHTML = `<h1 class="h2">${t('COLLECTION')}</h1><span class="pill"><b class="num">${owned}/${cat.items.length}</b></span>`;
    paintPortraits(grid);
    $$('.item-card', grid).forEach(card => press(card, () => onCard(card.dataset.id), { sound: null }));
  };
  const onCard = id => {
    const cat = CATEGORIES[lastCat];
    const item = findItem(lastCat, id);
    if (isOwned(s, lastCat, id)) {
      if (s.equipped[cat.slot] === id) { app.audio.play('click'); return; }
      s.equipped[cat.slot] = id;
      app.persist();
      app.audio.play('reward');
      toast(`${item.name} — ${t('EQUIPPED')}`, 'success', 1200);
      draw();
      menu.refreshTop();
    } else if (item.unlock.price) {
      purchase(app, menu, lastCat, item, () => draw());
    } else {
      app.audio.play('error');
      const why = item.unlock.level ? `${t('REACH LEVEL')} ${item.unlock.level}` : t('WIN A MATCH TO UNLOCK');
      toast(`${esc(item.name)}: ${why}`, 'info');
      const c = $(`.item-card[data-id="${id}"]`, grid);
      c?.classList.remove('shake'); void c?.offsetWidth; c?.classList.add('shake');
    }
  };
  $$('.tab', panel).forEach(b => press(b, () => {
    lastCat = b.dataset.cat;
    $$('.tab', panel).forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-selected', x === b); });
    draw();
  }));
  draw();
  void icon;
}
