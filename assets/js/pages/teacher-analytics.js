/* Class analytics — section 16.
   The headline is deliberately the question-level view: an average tells a
   teacher a class did badly, but not what to reteach on Monday. */

import { $, el, qs, setQs, plural } from '../core/util.js';
import { mountShell, mountSideNav, href } from '../core/shell.js';
import { statTile } from '../core/cards.js';
import { teacherData, classResults } from '../core/store.js';
import { getExercise } from '../data/exercises.js';

mountShell({ page: 'teachers', nav: 'app', mode: 'teacher', footer: false });
mountSideNav($('#side-nav-host'), 't-analytics');

const t = teacherData();
let classId = qs('class') ?? t.classes[0]?.id;
let exerciseId = qs('exercise');

const classSelect = $('#pick-class');
const exSelect = $('#pick-exercise');

classSelect.replaceChildren(...t.classes.map(c => el('option', { value: c.id, text: c.name })));
classSelect.value = classId;
classSelect.addEventListener('change', () => { classId = classSelect.value; exerciseId = null; sync(); });
exSelect.addEventListener('change', () => { exerciseId = exSelect.value; sync(); });

function sync() {
  const cls = t.classes.find(c => c.id === classId);
  if (!cls) return;
  if (!exerciseId || !cls.exerciseIds.includes(exerciseId)) exerciseId = cls.exerciseIds[0];

  exSelect.replaceChildren(...cls.exerciseIds.map(id =>
    el('option', { value: id, text: getExercise(id)?.title ?? id })));
  exSelect.value = exerciseId;
  setQs({ class: classId, exercise: exerciseId });
  render(classResults(classId, exerciseId));
}

function render(r) {
  if (!r) return;

  $('#sample-note').replaceChildren(r.class.sample
    ? el('div', { class: 'banner warn', style: 'margin-bottom:24px' },
        el('span', { 'aria-hidden': 'true', text: '⚠️' }),
        el('p', {}, el('strong', { text: 'Sample class. ' }),
          'These results are generated so the analytics view is usable before real students exist. ' +
          'They are deterministic — the same every reload — and clearly not live data.'))
    : el('span'));

  const passing = r.rows.filter(x => x.percent >= 60).length;
  $('#a-stats').replaceChildren(
    statTile({ label: 'Class average', value: `${r.average}%`, foot: r.exercise.title, icon: '📊' }),
    statTile({ label: 'Questions answered', value: String(r.answered), foot: `${plural(r.rows.length, 'student')}`, icon: '✅', tone: 'green' }),
    statTile({ label: 'At or above 60%', value: `${passing} / ${r.rows.length}`, foot: 'Students', icon: '🎯' }),
    statTile({ label: 'Hardest question', value: `${r.hardest[0]?.percent ?? 0}%`, foot: `Question ${(r.hardest[0]?.index ?? 0) + 1}`, icon: '⚠️', tone: 'orange' })
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
          ? el('span', { class: 'small', style: 'display:block;margin-top:4px;color:var(--primary)',
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
