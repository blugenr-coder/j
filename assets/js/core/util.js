/* WorksheetHub — small DOM and formatting helpers.
   Deliberately dependency-free: the whole site runs from static files. */

export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Escape user- or content-supplied text before it goes into innerHTML. */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Build an element from a tag, attributes and children. */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

/**
 * Replace an element's children, flattening arrays and dropping empties.
 * `replaceChildren()` takes varargs, so handing it an array stringifies it into
 * "[object HTMLDivElement]" — silently, with no error. This does what `el()`
 * already does for its children.
 */
export function fill(host, ...children) {
  host.replaceChildren(...children.flat(Infinity)
    .filter(c => c !== null && c !== undefined && c !== false));
  return host;
}

export const qs = (key, url = location.href) => new URL(url).searchParams.get(key);

export function setQs(params, { replace = true } = {}) {
  const url = new URL(location.href);
  for (const [k, v] of Object.entries(params)) {
    if (v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) url.searchParams.delete(k);
    else url.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
  }
  history[replace ? 'replaceState' : 'pushState']({}, '', url);
}

export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
export const pct = (part, whole) => whole > 0 ? Math.round((part / whole) * 100) : 0;

export function plural(n, one, many = one + 's') { return `${n} ${n === 1 ? one : many}`; }

export function formatMinutes(mins) {
  if (!mins) return '0m';
  const h = Math.floor(mins / 60), m = Math.round(mins % 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function timeAgo(ts) {
  if (!ts) return '';
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? 'yesterday' : `${d}d ago`;
}

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function shuffle(list, seed) {
  const arr = [...list];
  /* Seeded so a question's shuffled options stay stable while you work on it. */
  let s = seed ?? Math.floor(Math.random() * 1e9);
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const hashCode = str => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/** Render a donut progress ring. Returns an element. */
export function donut(value, { size = 96, label = null, colorVar = '--primary' } = {}) {
  const r = 42, c = 2 * Math.PI * r;
  const wrap = el('div', { class: 'donut', style: `width:${size}px;height:${size}px` });
  wrap.innerHTML = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle class="track" cx="50" cy="50" r="${r}"></circle>
      <circle class="value" cx="50" cy="50" r="${r}"
              style="stroke: var(${colorVar}); stroke-dasharray: ${(c * clamp(value, 0, 100)) / 100} ${c}"></circle>
    </svg>
    <span class="donut-label">${esc(label ?? value + '%')}</span>`;
  return wrap;
}

let toastHost = null;
export function toast(message, ms = 2600) {
  if (!toastHost) {
    toastHost = el('div', { class: 'toast-host', role: 'status', 'aria-live': 'polite' });
    document.body.append(toastHost);
  }
  const node = el('div', { class: 'toast', text: message });
  toastHost.append(node);
  setTimeout(() => node.remove(), ms);
}

/** Compact number formatting for stat tiles: 1200 -> 1.2k */
export function compact(n) {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
  return (n / 1_000_000).toFixed(1) + 'M';
}
