/* Tiny DOM toolkit: element builder, press feedback, toasts, modals.
   Every button in the game goes through press() so they all feel the same:
   instant scale-down on touch, a click sound, a light buzz. */
import { icon } from './Icons.js';
import { t } from './i18n.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function el(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  return tpl.content.firstElementChild;
}

export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let audioRef = null;
export function setAudio(a) { audioRef = a; }
export const sfx = (name, g) => audioRef?.play(name, g);
export const buzz = p => audioRef?.vibrate(p);

/* Wire a click with the shared feel. Uses pointerup so it fires instantly on
   touch, with a keyboard fallback for accessibility. */
export function press(node, fn, { sound = 'click', vibrate = 8 } = {}) {
  if (!node) return;
  node.addEventListener('click', e => {
    if (node.classList.contains('is-disabled') || node.getAttribute('aria-disabled') === 'true') {
      node.classList.remove('shake'); void node.offsetWidth; node.classList.add('shake');
      sfx('error');
      return;
    }
    if (sound) sfx(sound);
    if (vibrate) buzz(vibrate);
    fn(e);
  });
}

export function toast(text, kind = 'info', ms = 1800) {
  const host = $('#toasts');
  if (!host) return;
  const ic = kind === 'success' ? 'check' : kind === 'error' ? 'warning' : 'info';
  const n = el(`<div class="toast toast-${kind}" role="status">${icon(ic, { size: 20 })}<span>${esc(text)}</span></div>`);
  host.appendChild(n);
  setTimeout(() => { n.classList.add('out'); setTimeout(() => n.remove(), 260); }, ms);
}

/* Centered modal card over a dark overlay. Returns { close, node }. */
export function modal({ title, body = '', actions = [], dismissable = true, cls = '' }) {
  const host = $('#modals');
  const node = el(`<div class="modal-overlay" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="modal card ${cls}">
      ${dismissable ? `<button class="icon-btn modal-x" aria-label="${t('CLOSE')}">${icon('close', { size: 22 })}</button>` : ''}
      <h2 class="h2">${esc(title)}</h2>
      <div class="modal-body"></div>
      <div class="modal-actions"></div>
    </div></div>`);
  const b = $('.modal-body', node);
  if (typeof body === 'string') b.innerHTML = body; else b.appendChild(body);
  const close = () => { node.classList.add('out'); setTimeout(() => node.remove(), 220); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape' && dismissable) { sfx('back'); close(); } };
  document.addEventListener('keydown', onKey);
  for (const a of actions) {
    const btn = el(`<button class="btn ${a.cls || 'btn-secondary'}">${a.icon ? icon(a.icon, { size: 20 }) : ''}<span>${esc(a.label)}</span></button>`);
    press(btn, () => { const keep = a.onClick?.(btn); if (keep !== true) close(); }, { sound: a.sound ?? 'click' });
    $('.modal-actions', node).appendChild(btn);
  }
  if (dismissable) {
    press($('.modal-x', node), close, { sound: 'back' });
    node.addEventListener('pointerdown', e => { if (e.target === node) { sfx('back'); close(); } });
  }
  host.appendChild(node);
  const first = $('.modal-actions .btn', node);
  first?.focus({ preventScroll: true });
  return { close, node };
}

export function formatTime(sec) {
  sec = Math.max(0, Math.round(sec));
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

export const fmt = n => Math.round(n).toLocaleString('en-US');

export function coinPill(amount, id = '') {
  return `<div class="pill pill-coins" ${id ? `id="${id}"` : ''}>${icon('coin', { size: 22, color: '#FFD43B', detail: '#B7791F' })}<b class="num">${fmt(amount)}</b></div>`;
}
