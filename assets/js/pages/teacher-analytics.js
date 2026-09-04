/* Class analytics — section 16.
   The headline is deliberately the question-level view: an average tells a
   teacher a class did badly, but not what to reteach on Monday. */

import { $, el, qs, setQs, plural } from '../core/util.js';
import { mountShell, mountSideNav, href } from '../core/shell.js';
import { statTile } from '../core/cards.js';
import { icon } from '../core/icons.js';
import { teacherData, classResults } from '../core/store.js';
import { getExercise } from '../data/exercises.js';

mountShell({ page: 'teachers', nav: 'app', mode: 'teacher', footer: false });
mountSideNav($('#side-nav-host'), 't-analytics');

const t = teacherData();
let classId = qs('class') ?? t.classes[0]?.id;
let exerciseId = qs('exercise');

const classSelect = $('#pick-class');
const exSelect = $('#pick-exercise');

/* With no classes the select was simply blank, which reads as a broken page
   rather than an empty one. Say so, and disable it. */
const live = t.classes.filter(c => !c.archived);
classSelect.replaceChildren(...(live.length
  ? live.map(c => el('option', { value: c.id, text: c.name }))
  : [el('option', { value: '', text: 'No classes yet' })]));
classSelect.disabled = !live.length;
if (classId) classSelect.value = classId;
classSelect.addEventListener('change', () => { classId = classSelect.value; exerciseId = null; sync(); });
exSelect.addEventListener('change', () => { exerciseId = exSelect.value; sync(); });

/* Every worksheet this class has been set, in the order it was set. */
function setWork(cls) {
  const ids = [];
  for (const a of t.assignments ?? []) {
    if (a.classId !== cls.id) continue;
    for (const id of a.worksheetIds ?? [a.exerciseId]) if (id && !ids.includes(id)) ids.push(id);
  }
  for (const id of cls.exerciseIds ?? []) if (!ids.includes(id)) ids.push(id);
  return ids;
}

function sync() {
  const cls = t.classes.find(c => c.id === classId);
  if (!cls) return emptyView('Create a class and set some work, and this page fills itself in.');
  const work = setWork(cls);
  if (!work.length) return emptyView(`${cls.name} has no work set yet. Set a worksheet and results appear here as they come in.`);
  if (!exerciseId || !work.includes(exerciseId)) exerciseId = work[0];

  exSelect.replaceChildren(...work.map(id =>
    el('option', { value: id, text: getExercise(id)?.title ?? id })));
  exSelect.value = exerciseId;
  setQs({ class: classId, exercise: exerciseId });

  const results = classResults(classId, exerciseId);
  if (!results) {
    return emptyView('Nobody in this class has handed this worksheet in yet. ' +
      'Share the class code, and every submission lands here.');
  }
  render(results);
}

/* No invented rows. Until real students hand real work in, the page says so. */
function emptyView(message) {
  $('#sample-note').replaceChildren(
    el('div', { class: 'banner', style: 'margin-bottom:24px' },
      icon('info', { size: 18 }),
      el('div', {},
        el('p', { text: message }),
        el('a', {
          class: 'btn btn-primary btn-sm', style: 'margin-top:10px',
          href: href(live.length ? 'teacher/create.html' : 'teacher/classes.html'),
          text: live.length ? 'Set some work' : 'Create a class'
        }))));
  for (const id of ['#a-stats', '#hardest', '#question-bars', '#student-rows']) {
    const host = $(id);
    if (host) host.replaceChildren();
  }
}

function render(r) {
  if (!r) return;

  $('#sample-note').replaceChildren(el('span'));

  const passing = r.rows.filter(x => x.percent >= 60).length;
  $('#a-stats').replaceChildren(
    statTile({ label: 'Class average', value: `${r.average}%`, foot: r.exercise.title, iconName: 'progress' }),
    statTile({ label: 'Questions answered', value: String(r.answered), foot: `${plural(r.rows.length, 'student')}`, iconName: 'check-circle', tone: 'green' }),
    statTile({ label: 'At or above 60%', value: `${passing} / ${r.rows.length}`, foot: 'Students', iconName: 'users' }),
    statTile({ label: 'Hardest question', value: `${r.hardest[0]?.percent ?? 0}%`, foot: `Question ${(r.hardest[0]?.index ?? 0) + 1}`, iconName: 'alert', tone: 'orange' })
  );

  /* ---------------------------- hardest questions ---------------------------- */
  $('#hardest').replaceChildren(...r.hardest.map(h =>
    el('div', { class: 'list-item', style: 'align-items:flex-start' },
      el('span', { class: `tile-icon ${h.percent < 50 ? 'red' : 'orange'}`, style: 'font-size:13px;font-weight:700',
        'aria-hidden': 'true', text: `${h.percent}%` }),
      el('span', { class: 'grow' },
        el('span', { class: 'list-title', style: 'display:block', text: `Question ${h.index + 1}` }),
        el('span', { class: 'list-sub', text: h.question.prompt }),
        h.question.explanation
          ? el('span', { class: 'small', style: 'display:block;margin-top:4px;color:var(--link)',
              text: `Worked answer: ${h.question.explanation}` })
          : null),
      el('span', { class: 'small muted', style: 'white-space:nowrap', text: `${h.correct}/${h.total}` }))));

  /* ------------------------------ per-question ------------------------------ */
  $('#question-bars').replaceChildren(...r.perQuestion.map(q =>
    el('div', { class: 'row', style: 'gap:12px;padding:5px 0', title: q.question.prompt },
      el('span', { class: 'small mono muted', style: 'width:26px;text-align:right', text: String(q.index + 1) }),
      el('div', { class: `bar grow ${q.percent >= 75 ? 'green' : q.percent >= 50 ? '' : 'orange'}` },
        el('span', { style: `width:${q.percent}%` })),
      el('span', { class: 'small mono', style: 'width:38px;text-align:right', text: `${q.percent}%` }))));

  /* -------------------------------- students -------------------------------- */
  $('#student-count').textContent = plural(r.rows.length, 'student');
  const sorted = [...r.rows].sort((a, b) => b.percent - a.percent);
  $('#student-rows').replaceChildren(...sorted.map(row =>
    el('tr', {},
      el('td', {}, el('strong', { text: row.student.name })),
      el('td', {}, el('span', {
        class: `badge ${row.percent >= 75 ? 'badge-success' : row.percent >= 50 ? 'badge-warn' : 'badge-danger'}`,
        text: `${row.percent}%` })),
      el('td', { class: 'mono small', text: `${row.correct} / ${row.total}` }),
      el('td', {}, el('div', { class: `bar ${row.percent >= 75 ? 'green' : row.percent >= 50 ? '' : 'orange'}` },
        el('span', { style: `width:${row.percent}%` }))))));
}

sync();
