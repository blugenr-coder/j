/* The four-slot inventory (2 weapons, healing, utility) and the floating
   loot card that compares what you hold with what you are standing on.
   DOM is only touched when a value actually changes. */
import { icon } from './Icons.js';
import { esc } from './dom.js';
import { t } from './i18n.js';
import { RARITY_INFO, weaponScore } from '../combat/WeaponManager.js';
import { ITEMS, itemName, itemIcon, itemColor } from '../world/LootManager.js';

export function slotsHTML() {
  return `<div class="slots" id="slots">
    <button class="slot" data-slot="0" aria-label="Weapon 1"><span class="k">1</span><span class="ic"></span><span class="am num"></span><i class="rbar"></i></button>
    <button class="slot" data-slot="1" aria-label="Weapon 2"><span class="k">2</span><span class="ic"></span><span class="am num"></span><i class="rbar"></i></button>
  </div>`;
}

const last = new WeakMap();

export function updateSlots(root, p) {
  const slots = root.querySelectorAll('.slot');
  slots.forEach((el, i) => {
    const w = p.weapons[i];
    const sel = p.activeSlot === i;
    const reloading = w && w.reloadT > 0;
    const key = w ? `${w.id}|${w.rarity}|${w.ammo}|${sel}|${reloading ? Math.round((1 - w.reloadT / w.reloadTime) * 10) : -1}` : `none|${sel}`;
    if (last.get(el) === key) return;
    last.set(el, key);
    el.classList.toggle('sel', sel);
    el.classList.toggle('empty', !w);
    const col = w ? RARITY_INFO[w.rarity].color : '#94A3B8';
    el.querySelector('.ic').innerHTML = icon(w ? w.def.icon : 'fist', { size: 30, color: w ? (w.rarity === 'common' ? '#F8FAFC' : col) : '#94A3B8' });
    const am = el.querySelector('.am');
    am.textContent = w ? (reloading ? '...' : w.ammo) : '';
    am.classList.toggle('low', !!w && !reloading && w.ammo <= Math.ceil(w.magazine * 0.25));
    const rb = el.querySelector('.rbar');
    rb.style.background = col;
    rb.style.width = w ? (reloading ? `${(1 - w.reloadT / w.reloadTime) * 100}%` : '100%') : '0';
    el.style.borderColor = sel ? '' : (w ? hexA(col, 0.6) : '');
  });
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function lootCardHTML() {
  return `<div class="loot-card" id="lootCard" role="group" aria-live="polite">
    <div class="ic"></div>
    <div class="info"><div class="nm"></div><div class="rr"></div><div class="cmp"></div></div>
    <button class="btn btn-primary take"></button>
  </div>`;
}

/* Fill the loot card for this item. Returns whether a tap is needed. */
export function fillLootCard(card, match, it) {
  const p = match.player;
  const col = itemColor(it);
  card.style.setProperty('--rc', col);
  card.querySelector('.ic').innerHTML = icon(itemIcon(it), { size: 34, color: it.rarity === 'common' ? '#F8FAFC' : col });
  card.querySelector('.nm').textContent = itemName(it) + (it.count > 1 ? ` ×${it.count}` : '');
  const r = RARITY_INFO[it.rarity];
  // rarity is never colour alone: icon + word as well
  card.querySelector('.rr').innerHTML = `<span style="color:${col}">${icon(r.rank >= 3 ? 'crown' : r.rank >= 2 ? 'sparkle' : r.rank >= 1 ? 'star' : 'info', { size: 12, color: col })} ${t(r.label)}</span>`;
  const cmp = card.querySelector('.cmp');
  let action = t('PICK UP');
  if (it.type === 'weapon') {
    const full = p.weapons[0] && p.weapons[1];
    const cur = full ? p.weapons[p.activeSlot] : null;
    if (cur) {
      action = t('SWAP');
      const dNew = Math.round(it.weapon.damage * (it.weapon.def.pellets || 1)), dCur = Math.round(cur.damage * (cur.def.pellets || 1));
      const sNew = Math.round(weaponScore(it.weapon)), sCur = Math.round(weaponScore(cur));
      cmp.innerHTML = `<span>${t('CURRENT')}: ${esc(cur.def.name)}</span>`
        + `<span class="${dNew >= dCur ? 'up' : 'down'}">DMG ${dCur}→${dNew}</span>`
        + `<span class="${sNew >= sCur ? 'up' : 'down'}">DPS ${sCur}→${sNew}</span>`;
    } else {
      cmp.innerHTML = `<span>DMG ${Math.round(it.weapon.damage * (it.weapon.def.pellets || 1))}</span><span>${it.weapon.magazine} ⁄ MAG</span>`;
    }
  } else if (it.type === 'armor') {
    cmp.innerHTML = `<span class="up">+${ITEMS.vest.amount[it.rarity]} ARMOR</span>` + (p.armor >= p.maxArmor ? `<span class="down">${t('FULL')}</span>` : '');
  } else {
    const slot = it.type === 'heal' ? p.heal : p.util;
    if (slot && slot.key !== it.key) { action = t('SWAP'); cmp.innerHTML = `<span>${t('CURRENT')}: ${esc(ITEMS[slot.key].name)} ×${slot.count}</span>`; }
    else if (slot && slot.count >= ITEMS[it.key].stack) cmp.innerHTML = `<span class="down">${t('FULL')}</span>`;
    else cmp.innerHTML = it.type === 'heal' ? `<span class="up">+${ITEMS[it.key].heal || ITEMS[it.key].armor} ${ITEMS[it.key].heal ? 'HP' : 'ARMOR'}</span>` : '';
  }
  if (match.loot.isBetter(p, it)) cmp.insertAdjacentHTML('afterbegin', `<span class="up">${icon('arrowup', { size: 12, color: '#4ADE80' })} ${t('BETTER')}</span>`);
  card.querySelector('.take').innerHTML = `<span>${action}</span>`;
}
