/* Teacher home — section 14. Runs in the teacher visual mode: denser, more
   sober, same brand. */

import { $, el, timeAgo, plural } from '../core/util.js';
import { mountShell, mountSideNav, href } from '../core/shell.js';
import { statTile, exerciseCard, emptyState } from '../core/cards.js';
import { EXERCISES, getExercise } from '../data/exercises.js';
import { currentUser, teacherData, classResults, getState } from '../core/store.js';

mountShell({ page: 'teachers', nav: 'app', mode: 'teacher', footer: false });
mountSideNav($('#side-nav-host'), 't-home');

const user = currentUser();
if (user) $('#t-greeting').textContent = `Teacher tools — ${user.name.split(' ')[0]}`;

if (!user) {
  /* Teacher tools are explorable signed out; only saving needs an account. */
  $('#signed-out').hidden = false;
  $('#signed-out').append(el('div', { class: 'banner', style: 'margin-bottom:24px' },
    el('span', { 'aria-hidden': 'true', text: '👋' }),
    el('p', {}, 'You are browsing the teacher tools as a guest. ',
      el('a', { href: href('signin.html?new=1'), text: 'Create a teacher account' }),
      ' to keep your classes and assignments.')));
}

const t = teacherData();

/* --------------------------------- stats --------------------------------- */
const students = t.classes.reduce((a, c) => a + c.students.length, 0);
const results = t.classes.flatMap(c => c.exerciseIds.map(id => classResults(c.id, id))).filter(Boolean);
const avg = results.length ? Math.round(results.reduce((a, r) => a + r.average, 0) / results.length) : 0;
const answered = results.reduce((a, r) => a + r.answered, 0);

$('#t-stats').replaceChildren(
  statTile({ label: 'Classes', value: String(t.classes.length), foot: `${students} students`, icon: '🏫' }),
  statTile({ label: 'Class average', value: `${avg}%`, foot: 'Across all set work', icon: '📊', tone: 'green' }),
  statTile({ label: 'Questions answered', value: String(answered), foot: 'By your students', icon: '✅' }),
  statTile({ label: 'Assignments', value: String(t.assignments.length), foot: 'Created on this device', icon: '📨', tone: 'orange' })
);

/* -------------------------------- classes -------------------------------- */
$('#class-list').replaceChildren(...t.classes.map(c => {
  const r = classResults(c.id, c.exerciseIds[0]);
  return el('a', { class: 'list-item', href: href(`teacher/analytics.html?class=${c.id}`) },
    el('span', { class: 'tile-icon', 'aria-hidden': 'true', text: '🏫' }),
    el('span', { class: 'grow' },
      el('span', { class: 'list-title', style: 'display:block', text: c.name }),
      el('span', { class: 'list-sub', text: `${plural(c.students.length, 'student')} · ${plural(c.exerciseIds.length, 'exercise')} set` })),
    el('span', { class: 'row', style: 'gap:8px' },
      c.sample ? el('span', { class: 'badge', text: 'Sample' }) : null,
      el('strong', { class: 'mono small', text: r ? `${r.average}%` : '—' })));
}));

/* ------------------------------ assignments ------------------------------ */
const assignments = t.assignments.filter(a => getExercise(a.exerciseId));
$('#assignment-list').replaceChildren(...(assignments.length
  ? assignments.slice(0, 6).map(a => {
      const ex = getExercise(a.exerciseId);
      const cls = t.classes.find(c => c.id === a.classId);
      return el('a', { class: 'list-item', href: href(`exercise.html?id=${ex.id}&mode=online&code=${a.code}`) },
        el('span', { class: 'badge badge-primary mono', text: a.code }),
        el('span', { class: 'grow' },
          el('span', { class: 'list-title', style: 'display:block', text: a.title || ex.title }),
          el('span', { class: 'list-sub', text: `${cls?.name ?? 'No class'} · set ${timeAgo(a.created)}` })),
        el('span', { class: 'small muted', text: a.due ? `Due ${a.due}` : 'No due date' }));
    })
  : [el('div', { style: 'padding:8px 0' },
      el('p', { class: 'small muted', style: 'margin:0 0 12px',
        text: 'No assignments yet. Pick an exercise, choose a class, and share the code.' }),
      el('a', { class: 'btn btn-primary btn-sm', href: href('teacher/create.html'), text: 'Create an assignment' }))]));

/* ------------------------------- hardest Qs ------------------------------- */
const hardest = results.flatMap(r => r.hardest.map(h => ({ ...h, exercise: r.exercise, cls: r.class })))
  .sort((a, b) => a.percent - b.percent).slice(0, 5);

$('#hardest-list').replaceChildren(...hardest.map(h =>
  el('a', { class: 'list-item', href: href(`teacher/analytics.html?class=${h.cls.id}&exercise=${h.exercise.id}`) },
    el('span', { class: `tile-icon ${h.percent < 50 ? 'red' : 'orange'}`, style: 'font-size:13px;font-weight:700',
      'aria-hidden': 'true', text: `${h.percent}%` }),
    el('span', { class: 'grow' },
      el('span', { class: 'list-title', style: 'display:block', text: `Question ${h.index + 1} — ${h.question.prompt.slice(0, 64)}` }),
      el('span', { class: 'list-sub', text: `${h.exercise.title} · ${h.cls.name}` })),
    el('span', { class: 'small muted', text: `${h.correct}/${h.total} correct` }))));

/* ------------------------------- suggestions ------------------------------- */
const levels = new Set(t.classes.map(c => c.level));
const suggested = EXERCISES.filter(e => levels.has(e.level)).slice(0, 3);
$('#suggested').replaceChildren(...(suggested.length ? suggested : EXERCISES.slice(0, 3))
  .map(ex => exerciseCard(ex, { showProgress: false })));
