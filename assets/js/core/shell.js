/* WorksheetHub — the app chrome shared by every page.
   Renders the header, navigation, mobile bottom bar and footer from one place
   so navigation never drifts between pages. Pages call mountShell() once. */

import { el, esc, $ } from './util.js';
import { icon, iconHtml } from './icons.js';
import { logoTile } from './logo.js';
import { applyTheme, setTheme, getState, currentUser, signOut, isTeacher } from './store.js';
import { LANGUAGES, currentLanguage, setLanguage, initLanguage, whenReady } from './i18n.js';

/* Pages inside /teacher/ set data-base=".." so every link still resolves. */
export const base = () => document.body.dataset.base ? document.body.dataset.base.replace(/\/?$/, '/') : '';
export const href = path => base() + path;

const PUBLIC_NAV = [
  { id: 'home',      label: 'Home',         path: 'index.html' },
  { id: 'library',   label: 'Worksheets',   path: 'library.html' },
  { id: 'subjects',  label: 'Subjects',     path: 'subjects.html' },
  { id: 'grades',    label: 'Grades',       path: 'grades.html' },
  { id: 'how',       label: 'How It Works', path: 'how-it-works.html' },
  { id: 'teachers',  label: 'For Teachers', path: 'teacher/index.html' }
];

const STUDENT_SIDE = [
  { group: null,          items: [
    { id: 'dashboard',    label: 'Dashboard',    icon: 'home', path: 'dashboard.html' },
    { id: 'library',      label: 'Worksheets',   icon: 'library', path: 'library.html' },
    { id: 'progress',     label: 'Progress',     icon: 'progress', path: 'progress.html' },
    { id: 'favorites',    label: 'Favourites',   icon: 'star', path: 'favorites.html' },
    { id: 'achievements', label: 'Achievements', icon: 'trophy', path: 'achievements.html' }
  ]},
  { group: 'Browse',      items: [
    { id: 'subjects',     label: 'Subjects',     icon: 'subjects', path: 'subjects.html' },
    { id: 'grades',       label: 'Grades',       icon: 'grades', path: 'grades.html' },
    { id: 'join',         label: 'My classes',   icon: 'users', path: 'join.html' }
  ]},
  { group: 'More',        items: [
    { id: 'teachers',     label: 'Teacher tools', icon: 'teacher', path: 'teacher/index.html' },
    { id: 'settings',     label: 'Settings',      icon: 'settings', path: 'settings.html' }
  ]}
];

const TEACHER_SIDE = [
  { group: null,        items: [
    { id: 't-home',     label: 'Teacher home', icon: 'teacher', path: 'teacher/index.html' },
    { id: 't-classes',  label: 'Classes',      icon: 'users', path: 'teacher/classes.html' },
    { id: 't-create',   label: 'Set work',     icon: 'plus', path: 'teacher/create.html' },
    { id: 't-analytics',label: 'Class analytics', icon: 'progress', path: 'teacher/analytics.html' },
    { id: 't-builder',  label: 'Worksheet builder', icon: 'settings', path: 'teacher/builder.html' }
  ]},
  { group: 'Library',   items: [
    { id: 'library',    label: 'All worksheets', icon: 'library', path: 'library.html' },
    { id: 'subjects',   label: 'Subjects',      icon: 'subjects', path: 'subjects.html' }
  ]},
  { group: 'More',      items: [
    { id: 'dashboard',  label: 'Student view',  icon: 'user', path: 'dashboard.html' },
    { id: 'settings',   label: 'Settings',      icon: 'settings', path: 'settings.html' }
  ]}
];

const BOTTOM_NAV = [
  { id: 'home',      label: 'Home',     icon: 'home', path: 'index.html',     authPath: 'dashboard.html' },
  { id: 'library',   label: 'Worksheets', icon: 'library', path: 'library.html' },
  { id: 'progress',  label: 'Progress', icon: 'progress', path: 'progress.html' },
  { id: 'favorites', label: 'Saved',    icon: 'star', path: 'favorites.html' },
  { id: 'profile',   label: 'Profile',  icon: 'user', path: 'settings.html' }
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
  hydrateIcons();
  document.documentElement.dataset.mode = mode ?? (isTeacher() ? 'teacher' : 'student');

  const header = buildHeader(page, nav);
  document.body.prepend(header);

  const skip = el('a', { class: 'skip-link', href: '#main', text: 'Skip to content' });
  document.body.prepend(skip);

  if (footer ?? (nav === 'public')) document.body.append(buildFooter());
  document.body.append(buildBottomNav(page));

  /* Translation runs after the chrome exists and keeps running as pages render
     into it. English is the source language, so it costs nothing there. */
  initLanguage();

  return { header };
}

/**
 * The language control. A native <select> rather than a custom menu: it is one
 * element, it is reachable by keyboard and screen reader without any work, and
 * on a phone the platform gives it a proper picker.
 */
function languagePicker(where = 'in-header') {
  const code = currentLanguage();
  const select = el('select', {
    class: 'lang-select', 'aria-label': 'Language',
    onchange: e => setLanguage(e.target.value)
  }, LANGUAGES.map(l => el('option', { value: l.code, text: l.native })));
  select.value = code;
  const wrap = el('div', { class: `lang-picker lang-${where}` },
    el('span', { class: 'lang-globe', 'aria-hidden': 'true' }, icon('globe', { size: 16 })),
    select);
  return wrap;
}

/**
 * Fill in <span class="ico" data-icon="name"> placeholders written in the HTML.
 * Markup stays readable and the icon set stays in one module.
 */
export function hydrateIcons(root = document) {
  for (const node of root.querySelectorAll('[data-icon]')) {
    const size = Number(node.dataset.size) || 20;
    node.innerHTML = iconHtml(node.dataset.icon, { size });
    node.setAttribute('aria-hidden', 'true');
    delete node.dataset.icon;
  }
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
        icon(item.icon, { size: 18 }),
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

  const brandLink = el('a', {
    class: 'brand', href: href(user ? 'dashboard.html' : 'index.html'),
    html: `${logoTile({ size: 34 })}<span class="brand-word" translate="no">Worksheet<span class="brand-word-accent">Hub</span></span>`
  });
  wrap.append(brandLink);

  const list = el('nav', { class: 'main-nav', id: 'main-nav', 'aria-label': 'Main' });
  for (const item of PUBLIC_NAV) {
    if (nav === 'app' && item.id === 'home') continue;
    list.append(el('a', {
      href: href(item.path),
      'aria-current': item.id === page ? 'page' : null,
      text: item.label
    }));
  }
  /* The picker is rendered twice, and CSS shows one. On a phone the header has
     room for the brand, one call to action and the menu button — nothing else —
     so there the language control lives at the foot of the nav panel, which is
     where a phone user looks for site-wide settings anyway. */
  list.append(languagePicker('in-nav'));
  wrap.append(list);

  const actions = el('div', { class: 'header-actions' });

  actions.append(el('a', {
    class: 'icon-btn', href: href('library.html'),
    title: 'Search worksheets', 'aria-label': 'Search worksheets', html: iconHtml('search')
  }));

  const themeBtn = el('button', {
    class: 'icon-btn theme-btn', type: 'button', 'aria-label': 'Switch colour theme', title: 'Switch colour theme',
    onclick: () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
      themeBtn.innerHTML = iconHtml(next === 'dark' ? 'sun' : 'moon');
    }
  });
  themeBtn.innerHTML = iconHtml(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon');
  actions.append(themeBtn);
  actions.append(languagePicker());

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
    'aria-controls': 'main-nav', 'aria-label': 'Toggle navigation', html: iconHtml('menu'),
    onclick: () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      list.hidden = open;
    }
  });
  actions.append(toggle);

  wrap.append(actions);
  header.append(wrap);

  /* ------------------------- does the nav still fit? -------------------------
     A breakpoint cannot answer this. The nav is six links whose combined width
     depends on the language — English needs about 560px, German about 710 —
     so the width at which the row stops fitting is a property of the words,
     not of the device. Measure the nav's natural width once, then compare it
     against the space the brand and the buttons leave over.

     Measured once because a hidden nav has no width to measure: after the
     first collapse there is nothing left to read back. */
  /* Collapsing the nav also changes the buttons beside it — the menu button
     appears, the language picker moves into the panel — so "how much room is
     there" is different depending on the answer we are trying to reach. The
     first version compared a cached nav width against whatever room the
     current state happened to leave, and oscillated: collapse freed 78px, so
     it expanded, which took the room away, so it collapsed.

     Both numbers are therefore read in the same configuration. The row is
     forced to its expanded layout for the measurement and put back before the
     browser paints, so nothing flickers and the comparison is between two
     quantities that belong together. */
  const measure = () => {
    /* Two pieces of state hide the answer, and both have to be lifted: the
       class changes which buttons share the row, and `hidden` leaves the nav
       with no width at all to read. Restored before the browser paints. */
    const collapsed = header.classList.contains('nav-as-menu');
    const wasHidden = list.hidden;
    if (collapsed) header.classList.remove('nav-as-menu');
    if (wasHidden) list.hidden = false;

    const style = getComputedStyle(wrap);
    const gaps = (parseFloat(style.columnGap) || parseFloat(style.gap) || 0) * 2;
    /* Reading offsetWidth forces the changes above to be applied first. */
    const room = wrap.clientWidth
      - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0)
      - brandLink.offsetWidth - actions.offsetWidth - gaps;
    const need = list.scrollWidth;

    if (wasHidden) list.hidden = true;
    if (collapsed) header.classList.add('nav-as-menu');
    return { room, need };
  };

  const fitNav = () => {
    const small = window.matchMedia('(max-width: 900px)').matches;
    if (small) {
      header.classList.remove('nav-as-menu');
    } else {
      const { room, need } = measure();
      /* Measured fresh each time. An earlier version kept the widest reading
         ever seen, to survive measuring a hidden nav — but `measure` now lifts
         that state, and the high-water mark had its own failure: the fallback
         font is wider than the web font, so one reading taken before the fonts
         arrived collapsed the nav permanently. */
      header.classList.toggle('nav-as-menu', need > room);
    }
    const asMenu = small || header.classList.contains('nav-as-menu');
    if (!asMenu) toggle.setAttribute('aria-expanded', 'false');
    list.hidden = asMenu && toggle.getAttribute('aria-expanded') !== 'true';
  };

  let queued = false;
  const refit = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fitNav(); });
  };

  requestAnimationFrame(fitNav);
  document.fonts?.ready.then(refit).catch(() => {});
  window.addEventListener('resize', fitNav);

  /* The link text itself is what changes, and it changes late: the header is
     inserted after the language pack has already swept the document, so the
     translation reaches these links through the i18n MutationObserver, after
     everything else has settled. A ResizeObserver does not see it either — the
     nav is a clamped flex item, so its border box stays exactly the same width
     while its content grows past it. Watching the text is the only signal that
     actually fires. */
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(refit).observe(list,
      { childList: true, subtree: true, characterData: true });
  }
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(refit).observe(wrap);

  /* `data-nav-ready` marks the point where the header has been measured
     against the text it will actually show. Tests wait for it instead of
     guessing a delay, and it costs one attribute. */
  const markReady = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    fitNav();
    document.documentElement.dataset.navReady = '1';
  }));
  whenReady().then(markReady).catch(markReady);
  fitNav();

  return header;
}

function buildFooter() {
  const cols = [
    { title: 'Practise', links: [
      ['Browse worksheets', 'library.html'], ['By subject', 'subjects.html'],
      ['By grade', 'grades.html'], ['Join a class', 'join.html']] },
    { title: 'Teachers', links: [
      ['Teacher home', 'teacher/index.html'], ['Classes', 'teacher/classes.html'],
      ['Set work', 'teacher/create.html'], ['Worksheet builder', 'teacher/builder.html']] },
    { title: 'About', links: [
      ['How it works', 'how-it-works.html'], ['Progress tracking', 'progress.html'],
      ['Achievements', 'achievements.html'], ['Settings', 'settings.html']] }
  ];

  const footer = el('footer', { class: 'site-footer' });
  const grid = el('div', { class: 'footer-grid' });

  grid.append(el('div', {},
    el('a', {
      class: 'brand', href: href('index.html'),
      html: `${logoTile({ size: 30 })}<span class="brand-word" translate="no">Worksheet<span class="brand-word-accent">Hub</span></span>`
    }),
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
      icon(item.icon, { size: 20, cls: 'ico' }),
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
