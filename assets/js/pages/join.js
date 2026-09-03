/* Join an assignment by code — section 15.
   Codes created in teacher mode live in this browser, so a code created here
   opens here. With a server behind it, the same screen would resolve any code. */
import { $, el, toast, timeAgo } from '../core/util.js';
import { mountShell, href } from '../core/shell.js';
import { emptyState } from '../core/cards.js';
import { findAssignment, getState } from '../core/store.js';
import { getExercise } from '../data/exercises.js';

mountShell({ page: 'join', nav: 'public' });

const input = $('#code');
input.addEventListener('input', () => {
  /* Format as XXX-XXX while typing, without fighting the caret at the end. */
  const raw = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  input.value = raw.length > 3 ? `${raw.slice(0, 3)}-${raw.slice(3)}` : raw;
  $('#join-error').hidden = true;
});

$('#join-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const assignment = findAssignment(input.value);
  if (!assignment || !getExercise(assignment.exerciseId)) {
    const err = $('#join-error');
    err.hidden = false;
    err.textContent = 'No assignment found with that code. Check it with your teacher — codes are made in teacher mode on this device in this build.';
    return;
  }
  location.href = href(`exercise.html?id=${assignment.exerciseId}&mode=online&code=${assignment.code}`);
});

/* Assignments already on this device, so the page is useful before any code
   is typed. */
const mine = (getState().teacher?.assignments ?? []).filter(a => getExercise(a.exerciseId));
$('#my-assignments').replaceChildren(mine.length
  ? el('div', { class: 'card' },
      el('h3', { style: 'font-size:var(--step-1)', text: 'Assignments on this device' }),
      el('div', { class: 'list list-divided' }, mine.map(a => {
        const ex = getExercise(a.exerciseId);
        return el('a', { class: 'list-item', href: href(`exercise.html?id=${ex.id}&mode=online&code=${a.code}`) },
          el('span', { class: 'badge badge-primary mono', text: a.code }),
          el('span', { class: 'grow' },
            el('span', { class: 'list-title', style: 'display:block', text: a.title || ex.title }),
            el('span', { class: 'list-sub', text: `${ex.level} · set ${timeAgo(a.created)}` })),
          el('span', { class: 'small muted', text: 'Open →' }));
      })))
  : el('p', { class: 'small muted center' },
      'No assignments have been created on this device yet. ',
      el('a', { href: href('teacher/create.html'), text: 'Create one in teacher mode' }), '.'));
