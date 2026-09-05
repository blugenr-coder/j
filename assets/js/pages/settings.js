/* Settings: profile, appearance, and honest handling of the stored data. */
import { $, $$, el, toast, formatMinutes } from '../core/util.js';
import { mountShell, mountSideNav, href, requireUser, signOutAndGoHome } from '../core/shell.js';
import { startSync } from '../core/sync.js';
import * as api from '../core/api.js';
import { GRADES } from '../data/catalog.js';
import { currentUser, signIn, setTheme, getState, resetAll, summary } from '../core/store.js';

mountShell({ page: 'settings', nav: 'app', footer: false });
if (requireUser('settings.html')) render();

function render() {
  mountSideNav($('#side-nav-host'), 'settings');
  const user = currentUser();

  $('#avatar').textContent = user.initials || 'S';
  $('#user-name').textContent = user.name;
  $('#user-role').textContent = user.role === 'teacher' ? 'Teacher account' : 'Student account';
  $('#name').value = user.name;

  $('#grade').replaceChildren(...GRADES.map(g =>
    el('option', { value: g.id, text: `${g.name} — ${g.range}` })));
  $('#grade').value = user.grade;

  let role = user.role;
  const paintRole = () => {
    for (const b of $$('#role-choice button')) {
      const on = b.dataset.role === role;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    }
    $('#grade-field').hidden = role === 'teacher';
  };
  paintRole();
  for (const b of $$('#role-choice button')) b.addEventListener('click', () => { role = b.dataset.role; paintRole(); });

  $('#profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#name').value.trim() || user.name;
    const grade = $('#grade').value;
    signIn({ name, role, grade });

    /* On an account the change has to reach the server, or the next sync
       pulls the old name back and the save looks as though it was ignored. */
    const { online, user: account } = await startSync();
    if (online && account) {
      const res = await api.updateMe({ name, role, grade });
      if (!res.ok) {
        toast('Saved on this device, but the server did not accept it.');
        return;
      }
    }
    toast('Settings saved');
    setTimeout(() => location.reload(), 500);
  });

  /* ------------------------------ appearance ------------------------------ */
  const paintTheme = () => {
    const stored = getState().theme ?? 'system';
    for (const b of $$('#theme-choice button')) {
      const on = b.dataset.theme === stored;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    }
  };
  paintTheme();
  for (const b of $$('#theme-choice button')) {
    b.addEventListener('click', () => {
      setTheme(b.dataset.theme === 'system' ? null : b.dataset.theme);
      paintTheme();
    });
  }

  /* -------------------------------- data -------------------------------- */
  const state = getState();
  const s = summary();
  const rows = [
    ['Exercises opened', String(Object.keys(state.progress).length)],
    ['Questions answered', String(s.answered)],
    ['Saved exercises', String(state.favorites.length)],
    ['Achievements unlocked', String(state.achievements.length)],
    ['Practice time recorded', formatMinutes(s.minutes)],
    ['Teacher classes', String(state.teacher?.classes?.length ?? 0)],
    ['Assignments created', String(state.teacher?.assignments?.length ?? 0)]
  ];
  $('#data-summary').replaceChildren(...rows.map(([k, v]) =>
    el('div', { class: 'list-item' },
      el('span', { class: 'grow small', text: k }),
      el('strong', { class: 'mono small', text: v }))));

  $('#export-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: 'worksheethub-data.json' });
    document.body.append(a); a.click(); a.remove();
    toast('Downloaded');
  });

  $('#reset-btn').addEventListener('click', async () => {
    /* On an account this has to erase the server copy too. Clearing only the
       browser would look like it worked and then hand everything back on the
       next sync — worse than refusing to do it at all. */
    /* Asked directly rather than read off the document, because the flag on
       the root element is set by a promise that may not have resolved when
       somebody clicks this. Getting it wrong here erases the browser and
       leaves the account intact. */
    const { online, user: account } = await startSync();
    const onAccount = Boolean(online && account);
    const warning = onAccount
      ? 'Erase all progress, favourites, achievements and classes from your account and this browser? This cannot be undone, on any device.'
      : 'Erase all progress, favourites, achievements and teacher data from this browser? This cannot be undone.';
    if (!confirm(warning)) return;

    $('#reset-btn').disabled = true;
    if (onAccount) {
      const res = await api.eraseMyData();
      if (!res.ok) {
        $('#reset-btn').disabled = false;
        toast('Could not reach the server — nothing was erased.');
        return;
      }
      /* Signed out as well, so nothing re-syncs into the empty browser. */
      await api.logout();
    }
    resetAll();
    location.href = href('index.html');
  });

  $('#signout-btn').addEventListener('click', signOutAndGoHome);
}

/* What this page promises about the data depends on whether there is a server
   behind it, and getting that wrong in either direction is a lie: telling
   somebody their work is safe when it lives in one browser, or telling them
   nothing leaves their device when it is on an account. */
const note = $('#storage-note');
if (note) {
  startSync().then(({ online, user }) => {
    note.textContent = online && user
      ? 'Progress, favourites and classes are saved to your account, so they are on every device you sign in on. This browser also keeps a copy so the site works offline.'
      : 'Progress, favourites and teacher classes are stored in this browser only. Nothing is sent to a server, so clearing site data will erase them.';
  });
}
