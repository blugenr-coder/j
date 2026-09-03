/* Assignment creation and sharing — sections 14 and 15. */

import { $, el, toast, plural } from '../core/util.js';
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
let chosen = null;

/* ------------------------------- the selects ------------------------------- */
const opt = (value, label) => el('option', { value, text: label });

$('#f-class').replaceChildren(...t.classes.map(c => opt(c.id, c.name)));
$('#f-grade').replaceChildren(opt('', 'Any grade band'), ...GRADES.map(g => opt(g.id, `${g.name} — ${g.range}`)));
$('#f-subject').replaceChildren(opt('', 'Any subject'), ...SUBJECTS.map(s => opt(s.id, s.name)));
$('#f-difficulty').replaceChildren(opt('', 'Any difficulty'), ...DIFFICULTIES.map(d => opt(d.id, d.name)));

function refreshTopics() {
  const subject = $('#f-subject').value;
  const topics = subject ? SUBJECT_MAP[subject].topics : Object.entries(TOPIC_MAP).map(([id, t]) => ({ id, name: t.name }));
  $('#f-topic').replaceChildren(opt('', 'Any topic'), ...topics.map(t => opt(t.id, t.name)));
}
refreshTopics();

/* Default the class's own band so the first list is already relevant. */
const firstClass = t.classes[0];
if (firstClass) $('#f-grade').value = firstClass.grade;

for (const id of ['#f-class', '#f-grade', '#f-subject', '#f-topic', '#f-difficulty', '#f-length']) {
  $(id).addEventListener('change', () => {
    if (id === '#f-subject') refreshTopics();
    if (id === '#f-class') {
      const cls = t.classes.find(c => c.id === $('#f-class').value);
      if (cls) $('#f-grade').value = cls.grade;
    }
    refreshMatches();
  });
}

/* ------------------------------- the matches ------------------------------- */
function refreshMatches() {
  const results = searchExercises({
    grade: $('#f-grade').value || null,
    subject: $('#f-subject').value || null,
    topic: $('#f-topic').value || null,
    difficulty: $('#f-difficulty').value || null,
    length: $('#f-length').value || null
  });

  $('#match-count').textContent = results.length
    ? `${plural(results.length, 'worksheet')} match. Choose one.`
    : 'Nothing matches those choices — widen one of them.';

  if (chosen && !results.some(r => r.id === chosen)) chosen = null;

  $('#match-list').replaceChildren(...results.map(ex => {
    const row = el('button', {
      class: 'list-item', type: 'button',
      style: 'border:0;background:none;font:inherit;text-align:left;width:100%;cursor:pointer',
      onclick: () => { chosen = ex.id; refreshMatches(); }
    },
      el('span', { class: `tile-icon ${chosen === ex.id ? 'green' : ''}`, style: 'width:30px;height:30px;font-size:14px',
        }, chosen === ex.id ? icon('check', { size: 15 }) : subjectIcon(ex.subject, { size: 15 })),
      el('span', { class: 'grow' },
        el('span', { class: 'list-title', style: 'display:block', text: ex.title }),
        el('span', { class: 'list-sub', text: `${ex.level} · ${ex.count} questions · ${ex.difficulty}` })),
      el('span', { class: 'small muted', text: `${ex.minutes} min` })
    );
    if (chosen === ex.id) row.style.background = 'var(--primary-tint)';
    return row;
  }));

  $('#create-btn').disabled = !chosen;
}
refreshMatches();

/* -------------------------------- creation -------------------------------- */
$('#create-btn').addEventListener('click', () => {
  if (!chosen) return;
  const ex = getExercise(chosen);
  const assignment = createAssignment({
    exerciseId: chosen,
    classId: $('#f-class').value,
    title: $('#f-title').value.trim() || ex.title,
    due: $('#f-due').value || null,
    note: $('#f-note').value.trim() || null
  });
  showResult(assignment, ex);
});

function showResult(assignment, ex) {
  const cls = t.classes.find(c => c.id === assignment.classId);
  const studentLink = new URL(href(`exercise.html?id=${ex.id}&mode=online&code=${assignment.code}`), location.href).href;

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
        el('p', {}, el('strong', { text: assignment.title }), ` — ${ex.level}, ${ex.count} questions.`),
        el('p', { class: 'small muted' },
          `Set for ${cls?.name ?? 'no class'}${assignment.due ? `, due ${assignment.due}` : ''}.`),
        el('p', { class: 'small' }, 'Students go to ',
          el('a', { href: href('join.html'), text: 'Join with a code' }),
          ' and enter it, or open the direct link.'),
        el('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap' },
          el('button', { class: 'btn btn-secondary btn-sm', type: 'button', text: 'Copy student link',
            onclick: () => copy(studentLink, 'Link copied') }),
          el('a', { class: 'btn btn-ghost btn-sm', href: href(`print.html?id=${ex.id}`), text: 'Print copies' }),
          el('a', { class: 'btn btn-ghost btn-sm', href: href(`teacher/analytics.html?class=${assignment.classId}&exercise=${ex.id}`),
            text: 'See analytics' }))
      )),

    el('div', { class: 'banner', style: 'margin-top:20px' },
      icon('info', { size: 18 }),
      el('p', { text: 'In this build the code is stored in your browser, so it opens on this device. Wiring it to a server is what makes it work across a class.' }))
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
