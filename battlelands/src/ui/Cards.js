/* Shared cosmetic card rendering for Collection and Shop. Character art is a
   live canvas; everything else is an icon in the shared icon language. */
import { icon } from './Icons.js';
import { esc } from './dom.js';
import { t } from './i18n.js';
import { drawPortrait } from '../player/PlayerAnimation.js';
import { isOwned, priceOf, CATEGORIES } from '../progression/Cosmetics.js';

const RARITY_COLOR = { common: '#94A3B8', rare: '#3B82F6', epic: '#A78BFA', legendary: '#FF9F43' };
const RARITY_ICON = { common: 'info', rare: 'star', epic: 'sparkle', legendary: 'crown' };

export function rarityTag(r) {
  return `<span class="rarity-tag rarity-${r}">${icon(RARITY_ICON[r], { size: 12, color: r === 'rare' ? '#fff' : '#17213D' })}${t(r.toUpperCase())}</span>`;
}

export function artInner(cat, item, size = 64) {
  if (cat === 'characters') return `<canvas data-skin="${item.id}"></canvas>`;
  if (cat === 'emotes') return icon(item.glyph, { size, color: item.id === 'heart' ? '#F472B6' : item.id === 'fire' ? '#FF9F43' : item.id === 'crown' ? '#FFD43B' : '#F8FAFC' });
  if (cat === 'trails') return trailArt(item, size);
  if (cat === 'victory') return icon({ confetti: 'sparkle', fireworks: 'firework', stars: 'star', gold: 'coin' }[item.id] || 'sparkle', { size, color: { confetti: '#F472B6', fireworks: '#FF9F43', stars: '#7DD3FC', gold: '#FFD43B' }[item.id] });
  if (cat === 'icons') return icon(item.glyph, { size, color: item.color });
  return '';
}

function trailArt(item, size) {
  if (!item.color) return icon('close', { size: size * 0.7, color: '#475569' });
  const c = item.color === 'rainbow' ? 'url(#rb)' : item.color;
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="rb"><stop offset="0" stop-color="#FF6B6B"/><stop offset=".33" stop-color="#FFD43B"/><stop offset=".66" stop-color="#4ADE80"/><stop offset="1" stop-color="#60A5FA"/></linearGradient></defs>
    <circle cx="14" cy="44" r="5" fill="${c}" opacity=".45"/><circle cx="25" cy="37" r="6.5" fill="${c}" opacity=".65"/><circle cx="38" cy="29" r="8" fill="${c}" opacity=".85"/><circle cx="51" cy="20" r="9.5" fill="${c}"/></svg>`;
}

/* A collection/shop card. state: 'owned' | 'locked' | 'buy' ; selected: bool */
export function itemCard(cat, item, save, { selected = false, mode = 'collection', delay = 0 } = {}) {
  const owned = isOwned(save, cat, item.id);
  const price = priceOf(cat, item.id);
  let meta;
  if (mode === 'shop') {
    meta = owned ? `${icon('check', { size: 14, color: '#4ADE80' })} ${t('OWNED')}` : `${icon('coin', { size: 16, color: '#FFD43B', detail: '#B7791F' })} <b class="num" style="color:#FFD43B">${price}</b>`;
  } else if (owned) {
    meta = selected ? `${icon('check', { size: 14, color: '#FFD43B' })} ${t('EQUIPPED')}` : t('OWNED');
  } else if (item.unlock.level) meta = `${icon('lock', { size: 12 })} ${t('LEVEL')} ${item.unlock.level}`;
  else if (item.unlock.price) meta = `${icon('coin', { size: 14, color: '#FFD43B', detail: '#B7791F' })} <b class="num" style="color:#FFD43B">${item.unlock.price}</b>`;
  else meta = `${icon('lock', { size: 12 })} ${t('WIN A MATCH')}`;
  return `<button class="item-card ${owned ? '' : 'locked'} ${selected ? 'selected' : ''}" data-cat="${cat}" data-id="${item.id}" style="animation-delay:${delay}ms" aria-label="${esc(item.name)} — ${owned ? t('OWNED') : t('LOCKED')}">
    <span class="r-strip ${item.rarity}"></span>
    ${selected ? `<span class="check">${icon('check', { size: 18 })}</span>` : ''}
    <span class="art bg-${item.rarity}">${artInner(cat, item, 64)}</span>
    ${!owned && mode !== 'shop' ? `<span class="lock">${icon('lock', { size: 24 })}</span>` : ''}
    <span class="nm">${esc(item.name)}</span>
    <span class="meta">${meta}</span>
  </button>`;
}

/* Draw every character canvas inside root (static pose; cheap). */
export function paintPortraits(root, animated = false) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvases = [...root.querySelectorAll('canvas[data-skin]')];
  const paint = (tt = 0) => {
    for (const cv of canvases) {
      const w = cv.clientWidth || 100, h = cv.clientHeight || 100;
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      const ctx = cv.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      drawPortrait(ctx, cv.dataset.skin, cv.width / 2, cv.height * 0.56, Math.min(cv.width, cv.height) / 190, tt, { still: !animated });
    }
  };
  paint();
  return paint;
}

export { RARITY_COLOR, CATEGORIES };
