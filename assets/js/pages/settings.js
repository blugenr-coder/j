/* Settings: profile, appearance, and honest handling of the stored data. */
import { $, $$, el, toast, formatMinutes } from '../core/util.js';
import { mountShell, mountSideNav, href, requireUser, signOutAndGoHome } from '../core/shell.js';
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

  $('#profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    signIn({ name: $('#name').value.trim() || user.name, role, grade: $('#grade').value });
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

  $('#reset-btn').addEventListener('click', () => {
    if (!confirm('Erase all progress, favourites, achievements and teacher data from this browser? This cannot be undone.')) return;
    resetAll();
    location.href = href('index.html');
  });

  $('#signout-btn').addEventListener('click', signOutAndGoHome);
}
