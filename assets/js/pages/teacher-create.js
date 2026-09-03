/* Assignment creation and sharing — sections 14 and 15. */

import { $, el, qs, toast, plural } from '../core/util.js';
import { icon } from '../core/icons.js';
import { subjectIcon } from '../core/cards.js';
import { mountShell, mountSideNav, href } from '../core/shell.js';
import { GRADES, SUBJECTS, SUBJECT_MAP, DIFFICULTIES, TOPIC_MAP } from '../data/catalog.js';
import { searchExercises } from '../core/search.js';
import { getExercise } from '../data/exercises.js';
import { teacherData, createAssignment } from '../core/store.js';

mountShell({ page: 'teachers', nav: 'app', mode: 'teacher', footer: false });
mountSideNav($('#side-nav-host'), 't-create');

const t = teacherData();
/* An assignment is a set of worksheets, not one: a week of homework is
   normally several sheets with a single due date. */
const chosen = new Set();

/* ------------------------------- the selects ------------------------------- */
const opt = (value, label) => el('option', { value, text: label });

const liveClasses = t.classes.filter(c => !c.archived);
$('#f-class').replaceChildren(...liveClasses.map(c => opt(c.id, c.name)));
if (qs('class') && liveClasses.some(c => c.id === qs('class'))) $('#f-class').value = qs('class');
$('#f-grade').replaceChildren(opt('', 'Any grade band'), ...GRADES.map(g => opt(g.id, `${g.name} — ${g.range}`)));

/** Levels shown depend on the band, so the two selects cannot contradict. */
function refreshLevels(keep = null) {
  const band = $('#f-grade').value;
  const levels = (band ? GRADES.filter(g => g.id === band) : GRADES).flatMap(g => g.levels);
  $('#f-level').replaceChildren(opt('', 'Any level in the band'), ...levels.map(l => opt(l, l)));
  if (keep && levels.includes(keep)) $('#f-level').value = keep;
}
$('#f-subject').replaceChildren(opt('', 'Any subject'), ...SUBJECTS.map(s => opt(s.id, s.name)));
$('#f-difficulty').replaceChildren(opt('', 'Any difficulty'), ...DIFFICULTIES.map(d => opt(d.id, d.name)));

function refreshTopics() {
  const subject = $('#f-subject').value;
  const topics = subject ? SUBJECT_MAP[subject].topics : Object.entries(TOPIC_MAP).map(([id, t]) => ({ id, name: t.name }));
  $('#f-topic').replaceChildren(opt('', 'Any topic'), ...topics.map(t => opt(t.id, t.name)));
}
refreshTopics();

/* Default to the chosen class's own level so the first list is relevant. */
const startClass = liveClasses.find(c => c.id === $('#f-class').value) ?? liveClasses[0];
if (startClass?.grade) $('#f-grade').value = startClass.grade;
if (startClass?.subject) { $('#f-subject').value = startClass.subject; refreshTopics(); }
refreshLevels(startClass?.level);

for (const id of ['#f-class', '#f-grade', '#f-level', '#f-subject', '#f-topic', '#f-difficulty', '#f-length']) {
  $(id).addEventListener('change', () => {
    if (id === '#f-subject') refreshTopics();
    if (id === '#f-grade') refreshLevels();
    if (id === '#f-class') {
      const cls = liveClasses.find(c => c.id === $('#f-class').value);
      if (cls?.grade) $('#f-grade').value = cls.grade;
      if (cls?.subject) { $('#f-subject').value = cls.subject; refreshTopics(); }
      refreshLevels(cls?.level);
    }
    refreshMatches();
  });
}

/* ------------------------------- the matches ------------------------------- */
function refreshMatches() {
  const results = searchExercises({
    grade: $('#f-grade').value || null,
    level: $('#f-level').value || null,
    subject: $('#f-subject').value || null,
    topic: $('#f-topic').value || null,
    difficulty: $('#f-difficulty').value || null,
    length: $('#f-length').value || null
  }).slice(0, 60);

  $('#match-count').textContent = results.length
    ? `${plural(results.length, 'worksheet')} match. Tick the ones to set.`
    : 'Nothing matches those choices — widen one of them.';

  $('#match-list').replaceChildren(...results.map(ex => {
    const on = chosen.has(ex.id);
    const row = el('button', {
      class: 'list-item', type: 'button',
      style: `border:0;background:${on ? 'var(--primary-tint)' : 'none'};font:inherit;text-align:left;width:100%;cursor:pointer`,
      onclick: () => { on ? chosen.delete(ex.id) : chosen.add(ex.id); refreshMatches(); drawSelected(); }
    },
      el('span', { class: `tile-icon ${on ? 'green' : ''}`, style: 'width:30px;height:30px' },
        on ? icon('check', { size: 15 }) : subjectIcon(ex.subject, { size: 15 })),
      el('span', { class: 'grow' },
        el('span', { class: 'list-title', style: 'display:block', text: ex.title }),
        el('span', { class: 'list-sub',
          text: `${ex.level} · ${ex.count} questions · ${ex.pages > 1 ? ex.pages + ' pages · ' : ''}${ex.difficulty}` })),
      el('span', { class: 'small muted', text: `${ex.minutes} min` })
    );
    return row;
  }));

  $('#create-btn').disabled = chosen.size === 0;
  $('#create-btn').textContent = chosen.size > 1
    ? `Set ${chosen.size} worksheets` : 'Create assignment';
}

/** What is currently selected, always visible so nothing is set by accident. */
function drawSelected() {
  const strip = $('#selected-strip');
  strip.hidden = chosen.size === 0;
  if (!chosen.size) return;
  strip.replaceChildren(
    el('p', { class: 'card-title-sm', style: 'margin:0 0 8px', text: `Selected (${chosen.size})` }),
    el('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' },
      [...chosen].map(id => {
        const ex = getExercise(id);
        return el('button', {
          class: 'chip is-active', type: 'button',
          'aria-label': `Remove ${ex?.title ?? id}`,
          onclick: () => { chosen.delete(id); refreshMatches(); drawSelected(); }
        }, ex?.title ?? id, icon('close', { size: 12 }));
      })));
}

refreshMatches();
drawSelected();

/* -------------------------------- creation -------------------------------- */
$('#create-btn').addEventListener('click', () => {
  if (!chosen.size) return;
  const ids = [...chosen];
  const first = getExercise(ids[0]);
  const assignment = createAssignment({
    worksheetIds: ids,
    classId: $('#f-class').value,
    title: $('#f-title').value.trim() ||
      (ids.length === 1 ? first.title : `${first.title} + ${ids.length - 1} more`),
    due: $('#f-due').value || null,
    note: $('#f-note').value.trim() || null
  });
  showResult(assignment, ids.map(getExercise));
});

function showResult(assignment, sheets) {
  const cls = t.classes.find(c => c.id === assignment.classId);
  const first = sheets[0];
  const studentLink = new URL(href(`exercise.html?id=${first.id}&mode=online&code=${assignment.code}`), location.href).href;

  const card = $('#result-card');
  card.hidden = false;
  card.replaceChildren(
    el('div', { class: 'row-between', style: 'margin-bottom:16px' },
      el('h3', { style: 'margin:0;font-size:var(--step-1)', text: 'Assignment created' }),
      el('span', { class: 'badge badge-success', text: 'Ready to share' })),

    el('div', { class: 'grid', style: 'grid-template-columns:auto 1fr;gap:24px;align-items:center' },
      el('div', {},
        el('p', { class: 'card-title-sm', text: 'Assignment code' }),
        el('div', { class: 'code-display', text: assignment.code }),
        el('button', {
          class: 'btn btn-ghost btn-sm btn-block', type: 'button', style: 'margin-top:8px',
          text: 'Copy code',
          onclick: () => copy(assignment.code, 'Code copied')
        })),
      el('div', {},
        el('p', {}, el('strong', { text: assignment.title }), ` — ${plural(sheets.length, 'worksheet')}, `,
          `${sheets.reduce((n, s) => n + s.count, 0)} questions in total.`),
        el('ul', { class: 'small', style: 'margin:0 0 10px;padding-left:18px' },
          sheets.map(s => el('li', { text: `${s.title} — ${s.level}, ${s.count} questions` }))),
        el('p', { class: 'small muted' },
          `Set for ${cls?.name ?? 'no class'}${assignment.due ? `, due ${assignment.due}` : ''}.`),
        el('p', { class: 'small' }, 'Students in this class see it on their dashboard. Anyone else can ',
          el('a', { href: href('join.html'), text: 'join the class' }),
          ` with the code ${cls?.code ?? ''}.`),
        el('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap' },
          el('button', { class: 'btn btn-secondary btn-sm', type: 'button', text: 'Copy student link',
            onclick: () => copy(studentLink, 'Link copied') }),
          el('a', { class: 'btn btn-ghost btn-sm', href: href(`print.html?id=${first.id}`), text: 'Print copies' }),
          el('a', { class: 'btn btn-ghost btn-sm', href: href(`teacher/class.html?id=${assignment.classId}`),
            text: 'Open the class' }))
      )),

    el('div', { class: 'banner', style: 'margin-top:20px' },
      icon('info', { size: 18 }),
      el('p', { text: 'Students on this device see the assignment immediately. On another device they join the class with its code or link; sending results back is what needs a server.' }))
  );
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function copy(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
  } catch {
    /* Clipboard access is blocked in some contexts; show the value instead. */
    prompt('Copy this:', text);
  }
}
