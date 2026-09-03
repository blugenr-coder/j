/* Teacher: one class — roster, assignments, and a grid of who has done what. */

import { $, el, qs, toast, plural, timeAgo } from '../core/util.js';
import { mountShell, mountSideNav, href, breadcrumb } from '../core/shell.js';
import { emptyState } from '../core/cards.js';
import { icon } from '../core/icons.js';
import { SUBJECT_MAP } from '../data/catalog.js';
import { getMeta } from '../data/exercises.js';
import {
  teacherData, findClass, addStudent, removeStudent, encodeClass,
  deleteAssignment, submissionsFor
} from '../core/store.js';

mountShell({ page: 'teachers', nav: 'app', mode: 'teacher', footer: false });
mountSideNav($('#side-nav-host'), 't-classes');

teacherData();
const cls = findClass(qs('id'));

if (!cls) {
  $('#class-body').hidden = true;
  $('#not-found').hidden = false;
  $('#not-found').append(emptyState('users', 'Class not found',
    'That class is not on this device.',
    el('a', { class: 'btn btn-primary', href: href('teacher/classes.html'), text: 'Back to classes' })));
} else {
  render();
}

function render() {
  document.title = `${cls.name} — WorksheetHub`;
  $('#crumb').replaceChildren(breadcrumb([
    { label: 'Teacher tools', path: 'teacher/index.html' },
    { label: 'Classes', path: 'teacher/classes.html' },
    { label: cls.name }
  ]));
  $('#class-name').textContent = cls.name;
  $('#class-meta').textContent =
    `${cls.level}${cls.subject ? ' · ' + SUBJECT_MAP[cls.subject].name : ''} · ${plural(cls.students.length, 'student')}`;
  $('#join-code').textContent = cls.code;
  $('#set-work').href = href(`teacher/create.html?class=${cls.id}`);

  const joinUrl = new URL(href(`join.html?c=${encodeClass(cls)}`), location.href).href;
  $('#copy-link').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(joinUrl); toast('Join link copied'); }
    catch { prompt('Copy this link:', joinUrl); }
  });

  $('#add-student').addEventListener('click', () => {
    const name = $('#student-name').value.trim();
    if (!name) { $('#student-name').focus(); return; }
    addStudent(cls.id, name);
    $('#student-name').value = '';
    drawRoster(); drawMatrix();
    toast(`${name} added`);
  });
  $('#student-name').addEventListener('keydown', e => { if (e.key === 'Enter') $('#add-student').click(); });

  drawAssignments(); drawRoster(); drawMatrix();
}

function classAssignments() {
  return (teacherData().assignments ?? []).filter(a => a.classId === cls.id);
}

function drawAssignments() {
  const list = classAssignments();
  $('#assignment-count').textContent = plural(list.length, 'assignment');
  $('#assignment-list').replaceChildren(...(list.length
    ? list.map(a => {
        const sheets = (a.worksheetIds ?? [a.exerciseId]).filter(Boolean).map(getMeta).filter(Boolean);
        const done = Object.keys(submissionsFor(a.id)).length;
        return el('div', { class: 'list-item', style: 'align-items:flex-start' },
          el('span', { class: 'tile-icon', style: 'width:32px;height:32px' }, icon('send', { size: 16 })),
          el('span', { class: 'grow' },
            el('span', { class: 'list-title', style: 'display:block', text: a.title }),
            el('span', { class: 'list-sub', style: 'display:block',
              text: `${plural(sheets.length, 'worksheet')}${a.due ? ` · due ${a.due}` : ''} · set ${timeAgo(a.created)}` }),
            el('span', { class: 'small', style: 'color:var(--text-3)',
              text: sheets.map(s => s.title).join(' · ') })),
          el('span', { class: 'row', style: 'gap:8px' },
            el('span', { class: `badge ${done ? 'badge-success' : ''}`,
              text: `${done}/${cls.students.length} started` }),
            el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Remove',
              onclick: () => {
                if (!confirm(`Remove "${a.title}"?`)) return;
                deleteAssignment(a.code); drawAssignments(); drawMatrix();
              } })));
      })
    : [el('div', { style: 'padding:8px 0' },
        el('p', { class: 'small muted', style: 'margin:0 0 12px',
          text: 'Nothing set yet. Choose worksheets and a due date, and everyone in the class gets them.' }),
        el('a', { class: 'btn btn-primary btn-sm', href: href(`teacher/create.html?class=${cls.id}`), text: 'Set work' }))]));
}

function drawRoster() {
  const current = findClass(cls.id);
  $('#roster-count').textContent = plural(current.students.length, 'student');
  $('#roster').replaceChildren(...(current.students.length
    ? current.students.map(st => el('div', { class: 'list-item' },
        el('span', { class: 'avatar', style: 'width:30px;height:30px;font-size:11px',
          text: st.name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() }),
        el('span', { class: 'grow' },
          el('span', { class: 'list-title', style: 'display:block', text: st.name }),
          el('span', { class: 'list-sub',
            text: st.source === 'joined' ? `Joined with the code ${timeAgo(st.joinedAt)}` : 'Added by you' })),
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Remove',
          onclick: () => { removeStudent(cls.id, st.id); drawRoster(); drawMatrix(); } })))
    : [el('p', { class: 'small muted', style: 'margin:0',
        text: 'Nobody yet. Share the join code, or add students by name above.' })]));
}

/** The grid a teacher actually looks at: students down, assignments across. */
function drawMatrix() {
  const current = findClass(cls.id);
  const list = classAssignments();

  if (!current.students.length || !list.length) {
    $('#matrix').replaceChildren(el('p', { class: 'small muted', style: 'margin:0' },
      !current.students.length
        ? 'Add students and set work, and their results will appear here.'
        : 'Set an assignment and progress will appear here.'));
    return;
  }

  const head = el('tr', {}, el('th', { text: 'Student' }),
    ...list.map(a => el('th', { title: a.title, text: a.title })),
    el('th', { text: 'Done' }));

  const rows = current.students.map(st => {
    let done = 0;
    const cells = list.map(a => {
      const sheets = (a.worksheetIds ?? [a.exerciseId]).filter(Boolean);
      const mine = submissionsFor(a.id)[st.id] ?? {};
      const completed = sheets.filter(id => mine[id]).length;
      if (completed === sheets.length && sheets.length) done++;
      if (!completed) return el('td', {}, el('span', { class: 'cell-dot', title: 'Not started' }));
      const pct = Math.round(sheets.reduce((sum, id) => sum + (mine[id]?.percent ?? 0), 0) / Math.max(1, completed));
      return el('td', {}, el('span', {
        class: `badge ${pct >= 75 ? 'badge-success' : pct >= 50 ? 'badge-warn' : 'badge-danger'}`,
        title: `${completed} of ${sheets.length} worksheets`,
        text: `${pct}%`
      }));
    });
    return el('tr', {}, el('td', {}, el('strong', { text: st.name })), ...cells,
      el('td', { class: 'mono small', text: `${done}/${list.length}` }));
  });

  const note = el('p', { class: 'hint', style: 'margin-top:12px' },
    'Results appear for students working in this browser. Sending them back from another device needs a server — see the README.');

  $('#matrix').replaceChildren(
    el('table', { class: 'table' }, el('thead', {}, head), el('tbody', {}, ...rows)), note);
}
