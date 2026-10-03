/* Fake-currency shop. Coins are earned by playing; nothing here touches
   real money. Featured item rotates daily. */
import { icon } from './Icons.js';
import { el, $, $$, press, toast, modal, esc, fmt } from './dom.js';
import { t } from './i18n.js';
import { CHARACTERS, EMOTES, TRAILS, BUNDLES, isOwned, findItem, priceOf, CATEGORIES } from '../progression/Cosmetics.js';
import { itemCard, paintPortraits, rarityTag, artInner } from './Cards.js';
import { makeRng, hashString } from '../core/rng.js';
import { todayKey } from '../progression/Missions.js';

function featuredItem(save) {
  const pool = CHARACTERS.filter(c => c.unlock.price && (c.rarity === 'legendary' || c.rarity === 'epic'));
  const rng = makeRng(hashString('featured' + todayKey()));
  const notOwned = pool.filter(c => !isOwned(save, 'characters', c.id));
  return rng.pick(notOwned.length ? notOwned : pool);
}

/* Confirm → spend → celebrate. Error state if the player can't afford it. */
export function purchase(app, menu, cat, item, after, priceOverride = null, grant = null) {
  const s = app.save;
  const price = priceOverride ?? priceOf(cat, item.id);
  const art = el(`<div><div style="width:140px;height:140px;margin:0 auto 10px;border-radius:20px;display:grid;place-items:center" class="art bg-${item.rarity || 'epic'}">${cat === 'bundle' ? icon('gift', { size: 72, color: '#FFD43B' }) : artInner(cat, item, 80)}</div>
    <div>${item.rarity ? rarityTag(item.rarity) : ''}</div>
    <div class="price" style="justify-content:center;margin-top:10px">${icon('coin', { size: 26, color: '#FFD43B', detail: '#B7791F' })}<span class="num">${fmt(price)}</span></div></div>`);
  if (cat === 'characters') { const cv = art.querySelector('canvas'); cv.style.width = '140px'; cv.style.height = '140px'; requestAnimationFrame(() => paintPortraits(art)); }
  const canAfford = s.coins >= price;
  modal({
    title: item.name, body: art,
    actions: [
      { label: canAfford ? `${t('BUY FOR')} ${fmt(price)}` : t('NOT ENOUGH COINS'), cls: canAfford ? 'btn-play' : 'btn-play is-disabled', icon: canAfford ? 'coin' : 'lock', sound: null, onClick: btn => {
        if (s.coins < price) {
          btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake');
          app.audio.play('error'); toast(t('NOT ENOUGH COINS'), 'error');
          return true;
        }
        s.coins -= price;
        if (grant) grant(); else if (!s.owned.includes(`${cat}:${item.id}`)) s.owned.push(`${cat}:${item.id}`);
        app.persist();
        app.audio.play('buy'); app.audio.vibrate([20, 40, 20]);
        toast(`${item.name} — ${t('PURCHASED')}`, 'success');
        menu.bumpCoins();
        after?.();
      } },
      { label: t('CANCEL'), cls: 'btn-secondary', sound: 'back' },
    ],
  });
}

export function renderShop({ app, menu, panel }) {
  const s = app.save;
  const draw = () => {
    const f = featuredItem(s);
    const fOwned = isOwned(s, 'characters', f.id);
    const giftReady = s.giftDay !== todayKey();
    panel.innerHTML = `
      <div class="panel-head"><h1 class="h2">${t('SHOP')}</h1></div>
      <div class="scroll">
        <div class="featured card">
          <canvas data-skin="${f.id}"></canvas>
          <div class="info">
            <span class="badge">${icon('star', { size: 14 })}${t('FEATURED')}</span>
            <div class="h2">${esc(f.name)}</div>
            ${rarityTag(f.rarity)}
            <div class="price">${icon('coin', { size: 24, color: '#FFD43B', detail: '#B7791F' })}<span class="num">${fmt(f.unlock.price)}</span></div>
            <button class="btn ${fOwned ? 'btn-secondary is-disabled' : 'btn-play'} btn-sm" id="buyF">${fOwned ? icon('check', { size: 18 }) + t('OWNED') : icon('coin', { size: 20, color: '#17213D', detail: '#FFD43B' }) + t('BUY')}</button>
          </div>
        </div>
        <div class="section-title">${icon('gift', { size: 18 })}${t('DAILY GIFT')}</div>
        <div class="gift">${icon('coin', { size: 40, color: '#FFD43B', detail: '#B7791F' })}<div class="txt"><div class="h3">+100 ${t('COINS')}</div></div>
          <button class="btn ${giftReady ? 'btn-success' : 'btn-secondary is-disabled'} btn-sm" id="gift">${giftReady ? t('CLAIM') : icon('check', { size: 18 }) + t('CLAIMED')}</button></div>
        <div class="section-title">${icon('user', { size: 18 })}${t('CHARACTERS')}</div>
        <div class="carousel" id="cChars"></div>
        <div class="section-title">${icon('smile', { size: 18 })}${t('EMOTES')}</div>
        <div class="carousel" id="cEmotes"></div>
        <div class="section-title">${icon('trail', { size: 18 })}${t('TRAILS')}</div>
        <div class="carousel" id="cTrails"></div>
        <div class="section-title">${icon('gift', { size: 18 })}${t('BUNDLES')}</div>
        <div id="bundles"></div>
        <p class="small disclaimer">${t('Fake currency for this prototype. No real payments.')}</p>
      </div>`;
    const fill = (id, cat, items) => {
      const host = $(id, panel);
      host.innerHTML = items.filter(i => i.unlock.price).map((it, i) => itemCard(cat, it, s, { mode: 'shop', delay: i * 30 })).join('');
      $$('.item-card', host).forEach(c => press(c, () => {
        if (isOwned(s, cat, c.dataset.id)) { app.audio.play('click'); toast(t('OWNED'), 'info', 900); return; }
        purchase(app, menu, cat, findItem(cat, c.dataset.id), draw);
      }, { sound: null }));
    };
    fill('#cChars', 'characters', CHARACTERS);
    fill('#cEmotes', 'emotes', EMOTES);
    fill('#cTrails', 'trails', TRAILS);
    const bh = $('#bundles', panel);
    for (const b of BUNDLES) {
      const all = b.items.every(([c, id]) => isOwned(s, c, id));
      const worth = b.items.reduce((sum, [c, id]) => sum + (priceOf(c, id) || 0), 0);
      const node = el(`<div class="bundle card" style="border-color:${b.color}55">
        <div class="stack">${b.items.map(([c, id]) => `<div class="art bg-${findItem(c, id).rarity}">${artInner(c, findItem(c, id), 36)}</div>`).join('')}</div>
        <div class="txt"><div class="h3">${esc(b.name)}</div><div class="small">${b.items.length} ${t('ITEMS')} · <s>${fmt(worth)}</s></div>
          <div class="price">${icon('coin', { size: 20, color: '#FFD43B', detail: '#B7791F' })}<span class="num">${fmt(b.price)}</span></div></div>
        <button class="btn ${all ? 'btn-secondary is-disabled' : 'btn-primary'} btn-sm">${all ? t('OWNED') : t('BUY')}</button></div>`);
      press(node.querySelector('.btn'), () => {
        if (all) return;
        purchase(app, menu, 'bundle', { name: b.name, rarity: 'legendary' }, draw, b.price, () => {
          for (const [c, id] of b.items) if (!s.owned.includes(`${c}:${id}`)) s.owned.push(`${c}:${id}`);
        });
      }, { sound: null });
      bh.appendChild(node);
    }
    paintPortraits(panel);
    press($('#buyF', panel), () => { if (!fOwned) purchase(app, menu, 'characters', f, draw); }, { sound: null });
    press($('#gift', panel), () => {
      if (s.giftDay === todayKey()) return;
      s.giftDay = todayKey(); s.coins += 100; app.persist();
      app.audio.play('buy'); toast('+100 ' + t('COINS'), 'success');
      menu.bumpCoins(); draw();
    }, { sound: null });
  };
  draw();
  void CATEGORIES;
}
