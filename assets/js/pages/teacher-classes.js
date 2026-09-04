/* Teacher: the class list, and creating one. */

import { $, el, toast, plural, timeAgo } from '../core/util.js';
import { mountShell, mountSideNav, href } from '../core/shell.js';
import { emptyState } from '../core/cards.js';
import { icon, iconHtml } from '../core/icons.js';
import { GRADES, SUBJECTS, SUBJECT_MAP } from '../data/catalog.js';
import { teacherData, createClass, deleteClass, encodeClass, getState } from '../core/store.js';

mountShell({ page: 'teachers', nav: 'app', mode: 'teacher', footer: false });
mountSideNav($('#side-nav-host'), 't-classes');

const opt = (v, l) => el('option', { value: v, text: l });
$('#c-level').replaceChildren(...GRADES.flatMap(g => g.levels.map(l => opt(l, l))));
$('#c-subject').replaceChildren(opt('', 'No single subject'), ...SUBJECTS.map(s => opt(s.id, s.name)));
$('#c-level').value = 'Grade 8';

$('#new-class-btn').addEventListener('click', () => {
  const panel = $('#new-class-panel');
  panel.hidden = !panel.hidden;
  if (!panel.hidden) $('#c-name').focus();
});
$('#cancel-class-btn').addEventListener('click', () => { $('#new-class-panel').hidden = true; });

$('#create-class-btn').addEventListener('click', () => {
  const name = $('#c-name').value.trim();
  if (!name) { toast('Give the class a name first'); $('#c-name').focus(); return; }
  const cls = createClass({ name, level: $('#c-level').value, subject: $('#c-subject').value || null });
  $('#c-name').value = '';
  $('#new-class-panel').hidden = true;
  toast('Class created');
  showNewClass(cls);
  draw();
});

/* The join code is the whole point of creating a class, so it is put in front
   of the teacher at the moment it exists rather than left to be hunted for. */
function showNewClass(cls) {
  const joinUrl = new URL(href(`join.html?c=${encodeClass(cls)}`), location.href).href;
  const host = $('#new-class-result');
  host.hidden = false;
  host.replaceChildren(el('div', { class: 'banner', style: 'margin-bottom:24px' },
    icon('check-circle', { size: 18 }),
    el('div', { class: 'grow' },
      el('p', {}, el('strong', { text: cls.name }), ' is ready. Students join with this code:'),
      el('div', { class: 'row', style: 'gap:10px;flex-wrap:wrap;align-items:center;margin-top:8px' },
        el('span', { class: 'code-display', text: cls.code }),
        el('button', { class: 'btn btn-secondary btn-sm', type: 'button', text: 'Copy join link',
          onclick: () => copy(joinUrl, 'Join link copied') }),
        el('a', { class: 'btn btn-ghost btn-sm', href: href(`teacher/create.html?class=${cls.id}`),
          text: 'Set work for it' })))));
}

function draw() {
  const t = teacherData();
  const classes = t.classes.filter(c => !c.archived);
  const assignments = t.assignments ?? [];

  $('#class-list').replaceChildren(...classes.map(c => {
    const set = assignments.filter(a => a.classId === c.id);
    const joinUrl = new URL(href(`join.html?c=${encodeClass(c)}`), location.href).href;

    return el('article', { class: 'card class-card' },
      el('div', { class: 'row-between', style: 'align-items:flex-start' },
        el('div', {},
          el('h3', { style: 'margin:0 0 2px;font-size:var(--step-1)' },
            el('a', { href: href(`teacher/class.html?id=${c.id}`), style: 'color:inherit', text: c.name })),
          el('div', { class: 'small muted' },
            `${c.level}${c.subject ? ' · ' + SUBJECT_MAP[c.subject].name : ''} · created ${timeAgo(c.created)}`)),
        null),

      el('div', { class: 'class-stats' },
        el('div', {}, el('strong', { text: String(c.students.length) }), el('span', { text: 'students' })),
        el('div', {}, el('strong', { text: String(set.length) }), el('span', { text: 'assignments' })),
        el('div', {}, el('strong', { class: 'mono', text: c.code }), el('span', { text: 'join code' }))),

      el('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap;margin-top:16px' },
        el('a', { class: 'btn btn-primary btn-sm', href: href(`teacher/class.html?id=${c.id}`), text: 'Open' }),
        el('a', { class: 'btn btn-ghost btn-sm', href: href(`teacher/create.html?class=${c.id}`), text: 'Set work' }),
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Copy join link',
          onclick: () => copy(joinUrl, 'Join link copied') }),
        el('button', {
          class: 'btn btn-ghost btn-sm', type: 'button', text: 'Delete',
          style: 'color:var(--bad-ink)',
          onclick: () => {
            if (!confirm(`Delete "${c.name}" and its assignments? This cannot be undone.`)) return;
            deleteClass(c.id); draw(); toast('Class deleted');
          }
        }))
    );
  }));

  $('#class-empty').replaceChildren(...(classes.length ? [] : [emptyState('users', 'No classes yet',
    'Create a class, share its join code, and set worksheets to everyone at once.',
    el('button', { class: 'btn btn-primary', type: 'button', text: 'Create a class',
      onclick: () => { $('#new-class-panel').hidden = false; $('#c-name').focus(); } }))]));
}

async function copy(text, message) {
  try { await navigator.clipboard.writeText(text); toast(message); }
  catch { prompt('Copy this:', text); }
}

draw();
