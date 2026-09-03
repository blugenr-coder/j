/* WorksheetHub — the app chrome shared by every page.
   Renders the header, navigation, mobile bottom bar and footer from one place
   so navigation never drifts between pages. Pages call mountShell() once. */

import { el, esc, $ } from './util.js';
import { applyTheme, setTheme, getState, currentUser, signOut, isTeacher } from './store.js';

/* Pages inside /teacher/ set data-base=".." so every link still resolves. */
export const base = () => document.body.dataset.base ? document.body.dataset.base.replace(/\/?$/, '/') : '';
export const href = path => base() + path;

const PUBLIC_NAV = [
  { id: 'home',      label: 'Home',         path: 'index.html' },
  { id: 'library',   label: 'Exercises',    path: 'library.html' },
  { id: 'subjects',  label: 'Subjects',     path: 'subjects.html' },
  { id: 'grades',    label: 'Grades',       path: 'grades.html' },
  { id: 'how',       label: 'How It Works', path: 'how-it-works.html' },
  { id: 'teachers',  label: 'For Teachers', path: 'teacher/index.html' }
];

const STUDENT_SIDE = [
  { group: null,          items: [
    { id: 'dashboard',    label: 'Dashboard',    icon: '🏠', path: 'dashboard.html' },
    { id: 'library',      label: 'Exercises',    icon: '📋', path: 'library.html' },
    { id: 'progress',     label: 'Progress',     icon: '📈', path: 'progress.html' },
    { id: 'favorites',    label: 'Favourites',   icon: '⭐', path: 'favorites.html' },
    { id: 'achievements', label: 'Achievements', icon: '🏆', path: 'achievements.html' }
  ]},
  { group: 'Browse',      items: [
    { id: 'subjects',     label: 'Subjects',     icon: '📚', path: 'subjects.html' },
    { id: 'grades',       label: 'Grades',       icon: '🎓', path: 'grades.html' },
    { id: 'join',         label: 'Join a class', icon: '🔑', path: 'join.html' }
  ]},
  { group: 'More',        items: [
    { id: 'teachers',     label: 'Teacher tools', icon: '👩‍🏫', path: 'teacher/index.html' },
    { id: 'settings',     label: 'Settings',      icon: '⚙️', path: 'settings.html' }
  ]}
];

const TEACHER_SIDE = [
  { group: null,        items: [
    { id: 't-home',     label: 'Teacher home', icon: '🏫', path: 'teacher/index.html' },
    { id: 't-create',   label: 'New assignment', icon: '➕', path: 'teacher/create.html' },
    { id: 't-analytics',label: 'Class analytics', icon: '📊', path: 'teacher/analytics.html' },
    { id: 't-builder',  label: 'Exercise builder', icon: '🛠️', path: 'teacher/builder.html' }
  ]},
  { group: 'Library',   items: [
    { id: 'library',    label: 'All exercises', icon: '📋', path: 'library.html' },
    { id: 'subjects',   label: 'Subjects',      icon: '📚', path: 'subjects.html' }
  ]},
  { group: 'More',      items: [
    { id: 'dashboard',  label: 'Student view',  icon: '🎒', path: 'dashboard.html' },
    { id: 'settings',   label: 'Settings',      icon: '⚙️', path: 'settings.html' }
  ]}
];

const BOTTOM_NAV = [
  { id: 'home',      label: 'Home',     icon: '🏠', path: 'index.html',     authPath: 'dashboard.html' },
  { id: 'library',   label: 'Exercises',icon: '📋', path: 'library.html' },
  { id: 'progress',  label: 'Progress', icon: '📈', path: 'progress.html' },
  { id: 'favorites', label: 'Saved',    icon: '⭐', path: 'favorites.html' },
  { id: 'profile',   label: 'Profile',  icon: '👤', path: 'settings.html' }
];

/**
 * Mount the shared chrome.
 * @param {object} opts
 *   page   – nav id to mark as current
 *   nav    – 'public' (marketing header) | 'app' (sidebar layout)
 *   mode   – 'student' | 'teacher' (drives the visual mode from section 22)
 *   footer – render the marketing footer (default true on public pages)
 */
export function mountShell({ page = '', nav = 'public', mode = null, footer = null } = {}) {
  applyTheme();
  document.documentElement.dataset.mode = mode ?? (isTeacher() ? 'teacher' : 'student');

  const header = buildHeader(page, nav);
  document.body.prepend(header);

  const skip = el('a', { class: 'skip-link', href: '#main', text: 'Skip to content' });
  document.body.prepend(skip);

  if (footer ?? (nav === 'public')) document.body.append(buildFooter());
  document.body.append(buildBottomNav(page));

  return { header };
}

/** Render the app sidebar into a container element (app-layout pages). */
export function mountSideNav(container, page) {
  const groups = isTeacher() ? TEACHER_SIDE : STUDENT_SIDE;
  const nav = el('nav', { class: 'side-nav', 'aria-label': 'Sections' });
  for (const g of groups) {
    if (g.group) nav.append(el('div', { class: 'side-label', text: g.group }));
    for (const item of g.items) {
      nav.append(el('a', {
        href: href(item.path),
        'aria-current': item.id === page ? 'page' : null
      },
        el('span', { class: 'ico', 'aria-hidden': 'true', text: item.icon }),
        item.label
      ));
    }
  }
  container.replaceChildren(nav);
  return nav;
}

function buildHeader(page, nav) {
  const user = currentUser();
  const header = el('header', { class: 'site-header' });
  const wrap = el('div', { class: 'wrap' });

  wrap.append(el('a', { class: 'brand', href: href(user ? 'dashboard.html' : 'index.html') },
    el('span', { class: 'brand-mark', 'aria-hidden': 'true', text: 'W' }),
    'WorksheetHub'
  ));

  const list = el('nav', { class: 'main-nav', id: 'main-nav', 'aria-label': 'Main' });
  for (const item of PUBLIC_NAV) {
    if (nav === 'app' && item.id === 'home') continue;
    list.append(el('a', {
      href: href(item.path),
      'aria-current': item.id === page ? 'page' : null,
      text: item.label
    }));
  }
  wrap.append(list);

  const actions = el('div', { class: 'header-actions' });

  actions.append(el('a', {
    class: 'icon-btn', href: href('library.html'), title: 'Search exercises', 'aria-label': 'Search exercises', html: '🔍'
  }));

  const themeBtn = el('button', {
    class: 'icon-btn', type: 'button', 'aria-label': 'Switch colour theme', title: 'Switch colour theme',
    onclick: () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
      themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    }
  });
  themeBtn.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
  actions.append(themeBtn);

  if (user) {
    actions.append(el('a', { class: 'user-chip', href: href('settings.html') },
      el('span', { class: 'avatar', text: user.initials || 'S' }),
      el('span', { class: 'name', text: user.name.split(' ')[0] })
    ));
  } else {
    actions.append(
      el('a', { class: 'btn btn-ghost btn-sm', href: href('signin.html'), text: 'Sign in' }),
      el('a', { class: 'btn btn-primary btn-sm', href: href('signin.html?new=1'), text: 'Get started' })
    );
  }

  const toggle = el('button', {
    class: 'icon-btn nav-toggle', type: 'button', 'aria-expanded': 'false',
    'aria-controls': 'main-nav', 'aria-label': 'Toggle navigation', html: '☰',
    onclick: () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      list.hidden = open;
    }
  });
  actions.append(toggle);

  /* The nav is a dropdown only on small screens; CSS handles the layout, but
     the hidden attribute must start correct for keyboard users. */
  const applyViewport = () => {
    const small = window.matchMedia('(max-width: 900px)').matches;
    list.hidden = small && toggle.getAttribute('aria-expanded') !== 'true';
  };
  applyViewport();
  window.addEventListener('resize', applyViewport);

  wrap.append(actions);
  header.append(wrap);
  return header;
}

function buildFooter() {
  const cols = [
    { title: 'Practise', links: [
      ['Browse exercises', 'library.html'], ['By subject', 'subjects.html'],
      ['By grade', 'grades.html'], ['Join with a code', 'join.html']] },
    { title: 'Teachers', links: [
      ['Teacher home', 'teacher/index.html'], ['Create an assignment', 'teacher/create.html'],
      ['Class analytics', 'teacher/analytics.html'], ['Exercise builder', 'teacher/builder.html']] },
    { title: 'About', links: [
      ['How it works', 'how-it-works.html'], ['Progress tracking', 'progress.html'],
      ['Achievements', 'achievements.html'], ['Settings', 'settings.html']] }
  ];

  const footer = el('footer', { class: 'site-footer' });
  const grid = el('div', { class: 'footer-grid' });

  grid.append(el('div', {},
    el('a', { class: 'brand', href: href('index.html') },
      el('span', { class: 'brand-mark', 'aria-hidden': 'true', text: 'W' }), 'WorksheetHub'),
    el('p', { class: 'small', style: 'margin-top:12px;max-width:34ch',
      text: 'One place to practise, print, track and improve — for every grade and every subject.' })
  ));

  for (const col of cols) {
    grid.append(el('div', {},
      el('h5', { text: col.title }),
      el('ul', { class: 'footer-links' },
        col.links.map(([label, path]) => el('li', {}, el('a', { href: href(path), text: label }))))
    ));
  }

  footer.append(el('div', { class: 'wrap' }, grid,
    el('div', { class: 'footer-bottom' },
      el('span', { text: `© ${new Date().getFullYear()} WorksheetHub` }),
      el('span', { text: 'Practice anything. Learn everything.' })
    )
  ));
  return footer;
}

function buildBottomNav(page) {
  const user = currentUser();
  const nav = el('nav', { class: 'bottom-nav', 'aria-label': 'Mobile' });
  for (const item of BOTTOM_NAV) {
    const path = (user && item.authPath) ? item.authPath : item.path;
    nav.append(el('a', {
      href: href(path),
      'aria-current': item.id === page ? 'page' : null
    },
      el('span', { class: 'ico', 'aria-hidden': 'true', text: item.icon }),
      el('span', { text: item.label })
    ));
  }
  return nav;
}

/** Guard for pages that need an account; sends visitors to sign-in and back. */
export function requireUser(nextPath) {
  if (currentUser()) return true;
  const back = nextPath ?? location.pathname.split('/').pop() + location.search;
  location.replace(href(`signin.html?next=${encodeURIComponent(back)}`));
  return false;
}

export function signOutAndGoHome() {
  signOut();
  location.href = href('index.html');
}

/** Shared breadcrumb, used on grade/subject/exercise pages. */
export function breadcrumb(items) {
  const nav = el('nav', { class: 'small muted', 'aria-label': 'Breadcrumb', style: 'margin-bottom:16px' });
  items.forEach((item, i) => {
    if (i) nav.append(document.createTextNode('  ›  '));
    nav.append(item.path
      ? el('a', { href: href(item.path), text: item.label })
      : el('span', { text: item.label, 'aria-current': 'page' }));
  });
  return nav;
}
