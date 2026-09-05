/* Sign in / create account.

   This page has two modes and picks between them by asking the server whether
   it exists. With a backend it is a real account: an email, a password, and a
   session that follows the person to any device. Without one it is what it
   always was — a name held in this browser — because the site is still a
   folder of static files that has to work when opened from one.

   The page renders in local mode first and upgrades when the probe answers,
   so a slow network never leaves somebody looking at an empty card. */

import { $, $$, el, qs } from '../core/util.js';
import { mountShell, href } from '../core/shell.js';
import { GRADES } from '../data/catalog.js';
import { logoMark } from '../core/logo.js';
import { signIn, currentUser, hydrate } from '../core/store.js';
import * as api from '../core/api.js';
import { restartSync } from '../core/sync.js';

mountShell({ page: '', nav: 'public', footer: false });
$('#signin-mark').innerHTML = logoMark({ size: 38, solid: true });

const creating = qs('new') === '1';
const next = qs('next');
let hasServer = false;

const gradeSelect = $('#grade');
gradeSelect.replaceChildren(...GRADES.map(g =>
  el('option', { value: g.id, text: `${g.name} — ${g.range}` })));

const existing = currentUser();
let role = existing?.role ?? 'student';

function setRole(value) {
  role = value;
  for (const btn of $$('#role-choice button')) {
    const on = btn.dataset.role === value;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', String(on));
  }
  /* Teachers pick classes rather than a personal level. The rest of the
     field visibility depends on whether there is a server, so it is all
     decided in one place. */
  paint();
}

if (existing) {
  $('#name').value = existing.name;
  if (existing.grade) gradeSelect.value = existing.grade;
  if (existing.email) $('#email').value = existing.email;
}
setRole(role);

for (const btn of $$('#role-choice button')) {
  btn.addEventListener('click', () => setRole(btn.dataset.role));
}

/* ------------------------------ the two modes ------------------------------ */
function paint() {
  $('#form-title').textContent = creating ? 'Create your free account' : 'Welcome back!';
  $('#submit-btn').textContent = creating ? 'Create account' : 'Sign in';

  $('#email-field').hidden = !hasServer;
  $('#password-field').hidden = !hasServer;
  $('#name-field').hidden = hasServer && !creating;
  /* Signing in only needs the email and password; the rest is on the account. */
  $('#grade-field').hidden = role === 'teacher' || (hasServer && !creating);
  $('#role-field').hidden = hasServer && !creating;

  $('#email').required = hasServer;
  $('#password').required = hasServer;
  $('#name').required = !hasServer || creating;
  $('#password').autocomplete = creating ? 'new-password' : 'current-password';
  $('#password-hint').hidden = !creating;

  $('#form-sub').textContent = hasServer
    ? (creating ? 'One account, and your work follows you to any device.'
                : 'Sign in to continue to WorksheetHub')
    : (creating ? 'No payment, no email, no password.'
                : 'Sign in to continue to WorksheetHub');

  $('#storage-text').textContent = hasServer
    ? 'Your account, progress and classes are saved to your WorksheetHub account, so they are there on every device you sign in on.'
    : 'This copy is running without a server, so your account and progress are saved in this browser only — nothing leaves your device.';

  $('#switch-line').replaceChildren(
    creating
      ? el('span', {}, 'Already practising? ', el('a', { href: href('signin.html'), text: 'Sign in' }))
      : el('span', {}, 'New here? ', el('a', { href: href('signin.html?new=1'), text: 'Create an account' }))
  );
}
paint();

api.backendAvailable().then(available => {
  hasServer = available;
  paint();
});

/* --------------------------------- submit --------------------------------- */
const error = message => {
  const box = $('#signin-error');
  box.hidden = !message;
  box.textContent = message ?? '';
};

let busy = false;

$('#signin-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (busy) return;
  error(null);

  const name = $('#name').value.trim();
  const grade = gradeSelect.value;

  /* No server: exactly the old behaviour, unchanged. */
  if (!hasServer) {
    if (!name) { $('#name').focus(); return; }
    signIn({ name, role, grade });
    return go();
  }

  const email = $('#email').value.trim();
  const password = $('#password').value;
  if (!email) { $('#email').focus(); return error('Enter your email address.'); }
  if (!password) { $('#password').focus(); return error('Enter your password.'); }
  if (creating && !name) { $('#name').focus(); return error('Enter your name.'); }

  busy = true;
  $('#submit-btn').disabled = true;
  $('#submit-btn').textContent = creating ? 'Creating account…' : 'Signing in…';

  const res = creating
    ? await api.registerUser({ email, password, name, role, grade })
    : await api.login({ email, password });

  busy = false;
  $('#submit-btn').disabled = false;
  paint();

  if (!res.ok) {
    /* The server's own words. It knows why it refused; guessing here would
       produce a message that is friendlier and wrong. */
    return error(res.error === 'offline'
      ? 'Could not reach the server. Check your connection and try again.'
      : res.error);
  }

  /* Signed in. Take the account, then pull everything behind it before
     leaving this page, so the next screen is already right. */
  signIn({
    name: res.data.user.name,
    role: res.data.user.role,
    grade: res.data.user.grade ?? grade
  });
  hydrate({ user: res.data.user });
  await restartSync();
  go(res.data.user.role);
});

function go(finalRole = role) {
  location.href = href(next || (finalRole === 'teacher' ? 'teacher/index.html' : 'dashboard.html'));
}
