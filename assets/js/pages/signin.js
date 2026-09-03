/* Sign in / create account.
   There is no auth server in this build: an account is a name, a role and a
   level, held in local storage. Everything downstream reads the same shape a
   real session would provide, so wiring a backend later touches only store.js. */

import { $, $$, el, qs } from '../core/util.js';
import { mountShell, href } from '../core/shell.js';
import { GRADES } from '../data/catalog.js';
import { signIn, currentUser } from '../core/store.js';

mountShell({ page: '', nav: 'public', footer: false });

const creating = qs('new') === '1';
const next = qs('next');

if (creating) {
  $('#form-title').textContent = 'Create your free account';
  $('#form-sub').textContent = 'No payment, no email, no password.';
  $('#submit-btn').textContent = 'Create account';
}
$('#switch-line').replaceChildren(
  creating
    ? el('span', {}, 'Already practising? ', el('a', { href: href('signin.html'), text: 'Sign in' }))
    : el('span', {}, 'New here? ', el('a', { href: href('signin.html?new=1'), text: 'Create an account' }))
);

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
  /* Teachers pick classes rather than a personal level. */
  $('#grade-field').hidden = value === 'teacher';
}
/* Prefill from an existing account, so this doubles as "switch role". */
if (existing) {
  $('#name').value = existing.name;
  gradeSelect.value = existing.grade;
}
setRole(role);

for (const btn of $$('#role-choice button')) {
  btn.addEventListener('click', () => setRole(btn.dataset.role));
}

$('#signin-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#name').value.trim();
  if (!name) { $('#name').focus(); return; }
  signIn({ name, role, grade: gradeSelect.value });
  location.href = href(next || (role === 'teacher' ? 'teacher/index.html' : 'dashboard.html'));
});
