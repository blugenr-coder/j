// Rail, top bar and the small helpers every page uses. The page names itself
// with <body data-page="...">, so the header is written once, here.

const PAGES = [
  ['index', 'Home', '/'],
  ['studio', 'Studio', '/studio'],
  ['models', 'Models', '/models'],
  ['gallery', 'Gallery', '/gallery'],
  ['about', 'How it works', '/about'],
];

export const icons = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h10M4 17h16"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/></svg>',
  cube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>',
};

export function mountShell() {
  const page = document.body.dataset.page;
  const links = PAGES.map(([key, label, href]) =>
    `<a href="${href}"${key === page ? ' aria-current="page"' : ''}>${label}</a>`).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <aside class="rail" aria-label="Sidebar">
      <a class="icon-btn" href="/models" aria-label="Your models">${icons.menu}</a>
      <nav class="rail-social" aria-label="Formats">
        <a href="/gallery">GLB</a><a href="/models">Train</a><a href="/studio">Make</a>
      </nav>
    </aside>
    <div class="shell">
      <header class="topbar">
        <a class="logo" href="/" aria-label="Artoo home">Art<span class="oo">oo</span><span class="dot">.</span></a>
        <nav class="nav" aria-label="Main">${links}</nav>
        <div class="topbar-right">
          <a class="icon-btn" href="/gallery" aria-label="Search the gallery">${icons.search}</a>
          <a class="btn" href="/studio">Start work</a>
        </div>
      </header>
      <nav class="mobile-nav" aria-label="Main">${links}</nav>
    </div>`);

  // Move the page's own <main> inside the shell.
  const main = document.querySelector('body > main');
  if (main) document.querySelector('.shell').append(main);
}

export async function api(path, { method = 'GET', body, raw } = {}) {
  const res = await fetch(`/api/${path}`, {
    method,
    headers: raw ? { 'Content-Type': 'application/octet-stream' } : body ? { 'Content-Type': 'application/json' } : {},
    body: raw ?? (body ? JSON.stringify(body) : undefined),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

let toastTimer;
export function toast(message, isError = false) {
  document.querySelector('.toast')?.remove();
  const el = Object.assign(document.createElement('div'), { className: `toast${isError ? ' err' : ''}`, textContent: message });
  el.setAttribute('role', isError ? 'alert' : 'status');
  document.body.append(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), isError ? 7000 : 3500);
}

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function starsHtml(rating) {
  return `<div class="stars" role="group" aria-label="Rate this model">${[1, 2, 3, 4, 5].map(n =>
    `<button type="button" data-star="${n}" class="${rating >= n ? 'on' : ''}" aria-label="${n} star${n > 1 ? 's' : ''}" aria-pressed="${rating === n}">★</button>`).join('')}</div>`;
}

export const timeAgo = ms => {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(ms).toLocaleDateString();
};
