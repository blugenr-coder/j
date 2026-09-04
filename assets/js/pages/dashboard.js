/* Student dashboard — section 10, plus the work a teacher has set. */

import { $, el, pct, formatMinutes, plural } from '../core/util.js';
import { mountShell, mountSideNav, href, requireUser } from '../core/shell.js';
import { statTile, exerciseRow, exerciseCard, emptyState, subjectIcon, subjectTone } from '../core/cards.js';
import { GRADE_MAP, SUBJECT_MAP, ACHIEVEMENTS } from '../data/catalog.js';
import { icon } from '../core/icons.js';
import { takeWhere, getExercise } from '../data/exercises.js';
import { currentUser, summary, continueTarget, recentExercises, scoreFor, getState, statusFor,
         assignedToMe, enrollments } from '../core/store.js';

mountShell({ page: 'dashboard', nav: 'app', footer: false });
if (requireUser('dashboard.html')) render();

function render() {
  const user = currentUser();
  mountSideNav($('#side-nav-host'), 'dashboard');

  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  $('#greeting').textContent = `${part}, ${user.name.split(' ')[0]}`;

  const s = summary();
  $('#greeting-sub').textContent = s.completed
    ? `${plural(s.completed, 'worksheet')} finished so far. Keep it going.`
    : 'Pick something below and make a start — the first one is the hardest.';

  /* --------------------------------- stats --------------------------------- */
  $('#stats').replaceChildren(
    statTile({ label: 'Worksheets completed', value: String(s.completed), foot: 'All time', iconName: 'check-circle', tone: 'green' }),
    statTile({ label: 'Average accuracy',    value: `${s.accuracy}%`,    foot: `${s.correct} correct answers`, iconName: 'target' }),
    statTile({ label: 'Current streak',      value: String(s.streak),    foot: s.streak === 1 ? 'day' : 'days in a row', iconName: 'flame', tone: 'orange' }),
    statTile({ label: 'Practice time',       value: formatMinutes(s.minutes), foot: 'Across all worksheets', iconName: 'clock' })
  );

  /* ------------------------------ assigned work ------------------------------ */
  drawAssigned();

  /* ------------------------------ continue card ------------------------------ */
  const continueId = continueTarget();
  const card = $('#continue-card');
  if (continueId) {
    const ex = getExercise(continueId);
    const sc = scoreFor(continueId);
    const done = pct(sc.answered, sc.total);
    card.replaceChildren(
      el('p', { class: 'card-title-sm', text: 'Continue working' }),
      el('div', { class: 'row', style: 'gap:16px;align-items:flex-start' },
        el('span', { class: `tile-icon lg ${subjectTone(ex.subject)}` }, subjectIcon(ex.subject, { size: 24 })),
        el('div', { class: 'grow' },
          el('h3', { style: 'margin:0 0 2px;font-size:var(--step-1)', text: ex.title }),
          el('div', { class: 'small muted', style: 'margin-bottom:12px',
            text: `${ex.level} · question ${Math.min(sc.answered + 1, sc.total)} of ${sc.total}` }),
          el('div', { class: 'bar' }, el('span', { style: `width:${done}%` })),
          el('div', { class: 'row-between small muted', style: 'margin-top:6px' },
            el('span', { text: `${done}% answered` }),
            el('span', { text: `${sc.correct} correct so far` }))
        )
      ),
      el('a', { class: 'btn btn-primary btn-block', style: 'margin-top:20px',
        href: href(`exercise.html?id=${ex.id}&mode=online`), text: 'Continue worksheet' })
    );
  } else {
    card.replaceChildren(
      el('p', { class: 'card-title-sm', text: 'Continue working' }),
      emptyState('sparkle', 'Nothing in progress',
        'Start a worksheet and it will wait for you here until it is finished.',
        el('a', { class: 'btn btn-primary', href: href('library.html'), text: 'Browse worksheets' }))
    );
  }

  /* ------------------------------ recent list ------------------------------ */
  const recent = recentExercises(5);
  $('#recent-list').replaceChildren(...(recent.length
    ? recent.map(id => {
        const ex = getExercise(id);
        const sc = scoreFor(id);
        const status = statusFor(id);
        return exerciseRow(ex, {
          trailing: el('span', { class: 'row', style: 'gap:8px' },
            el('span', { class: `badge ${status === 'completed' ? 'badge-success' : status === 'in-progress' ? 'badge-warn' : ''}`,
              text: status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In progress' : 'Not started' }),
            el('strong', { class: 'mono small', text: `${sc.percent}%` }))
        });
      })
    : [el('p', { class: 'small muted', text: 'Nothing yet — your finished worksheets will appear here.' })]));

  /* ----------------------------- recommendations ----------------------------- */
  /* Recommend inside the learner's own band first, preferring untouched
     exercises and subjects they are weakest in. */
  const weakest = Object.entries(s.subjects).sort((a, b) => a[1].percent - b[1].percent)[0]?.[0];
  const band = user.grade;
  const scoreRec = ex => {
    let n = 0;
    if (ex.grade === band) n += 5;
    if (GRADE_MAP[ex.grade]?.band === GRADE_MAP[band]?.band) n += 2;
    if (statusFor(ex.id) === 'not-started') n += 3;
    if (weakest && ex.subject === weakest) n += 4;
    return n;
  };
  /* Scoring every worksheet in the library to pick three would be a million
     comparisons; the candidates that could win are the ones in the student's
     own band, so those are the ones ranked. */
  const candidates = takeWhere(ex => GRADE_MAP[ex.grade]?.band === GRADE_MAP[band]?.band, 400);
  const recommended = candidates.sort((a, b) => scoreRec(b) - scoreRec(a)).slice(0, 3);
  $('#recommended').replaceChildren(...recommended.map(ex => exerciseCard(ex)));

  /* ----------------------------- subject progress ----------------------------- */
  const subjectRows = Object.entries(s.subjects);
  $('#subject-progress').replaceChildren(...(subjectRows.length
    ? subjectRows.map(([id, b]) => el('div', { class: 'subject-row' },
        el('span', { class: 'small', style: 'font-weight:600', text: SUBJECT_MAP[id]?.name ?? id }),
        el('div', { class: `bar ${b.percent >= 80 ? 'green' : b.percent >= 60 ? '' : 'orange'}` },
          el('span', { style: `width:${b.percent}%` })),
        el('span', { class: 'small mono muted', style: 'text-align:right', text: `${b.percent}%` })))
    : [el('p', { class: 'small muted', text: 'Answer a few questions and your subject breakdown appears here.' })]));

  /* ------------------------------ achievements ------------------------------ */
  const unlocked = getState().achievements;
  const shown = ACHIEVEMENTS.filter(a => unlocked.includes(a.id)).slice(-3);
  const nextUp = ACHIEVEMENTS.find(a => !unlocked.includes(a.id));
  $('#achievement-list').replaceChildren(
    ...shown.map(a => el('div', { class: 'list-item' },
      el('span', { class: 'tile-icon orange', style: 'width:32px;height:32px' }, icon(a.icon, { size: 17 })),
      el('span', { class: 'grow' },
        el('span', { class: 'list-title', style: 'display:block', text: a.name }),
        el('span', { class: 'list-sub', text: a.desc })),
      el('span', { class: 'badge badge-success', text: 'Unlocked' }))),
    nextUp ? el('div', { class: 'list-item', style: 'opacity:.65' },
      el('span', { class: 'tile-icon', style: 'width:32px;height:32px' }, icon(nextUp.icon, { size: 17 })),
      el('span', { class: 'grow' },
        el('span', { class: 'list-title', style: 'display:block', text: nextUp.name }),
        el('span', { class: 'list-sub', text: nextUp.desc })),
      el('span', { class: 'badge', text: 'Next up' })) : null
  );
}


/**
 * Worksheets set to the classes this student has joined. Shown above their own
 * practice, because a due date beats a recommendation.
 */
function drawAssigned() {
  const work = assignedToMe();
  const section = $('#assigned');
  if (!work.length) { section.hidden = true; return; }
  section.hidden = false;

  const today = new Date().toISOString().slice(0, 10);
  const cards = [];

  for (const a of work) {
    const sheets = (a.worksheetIds ?? [a.exerciseId]).filter(Boolean).map(getExercise).filter(Boolean);
    const done = sheets.filter(w => statusFor(w.id) === 'completed').length;
    const overdue = a.due && a.due < today && done < sheets.length;

    cards.push(el('article', { class: `card ${overdue ? 'assigned-overdue' : ''}` },
      el('div', { class: 'row-between', style: 'align-items:flex-start' },
        el('div', {},
          el('div', { class: 'small muted', text: a.class?.name ?? 'Class' }),
          el('h3', { style: 'margin:2px 0 0;font-size:var(--step-1)', text: a.title })),
        a.due
          ? el('span', { class: `badge ${overdue ? 'badge-danger' : 'badge-warn'}`,
              text: overdue ? `Overdue ${a.due}` : `Due ${a.due}` })
          : null),

      a.note ? el('p', { class: 'small', style: 'margin:10px 0 0', text: a.note }) : null,

      el('div', { class: 'list list-divided', style: 'margin-top:12px' },
        sheets.map(w => {
          const finished = statusFor(w.id) === 'completed';
          return el('a', { class: 'list-item', href: href(`exercise.html?id=${w.id}&mode=online&code=${a.code}`) },
            el('span', { class: `tile-icon ${finished ? 'green' : ''}`, style: 'width:30px;height:30px' },
              icon(finished ? 'check' : 'library', { size: 15 })),
            el('span', { class: 'grow' },
              el('span', { class: 'list-title', style: 'display:block', text: w.title }),
              el('span', { class: 'list-sub',
                text: `${w.level} · ${w.count} questions${w.pages > 1 ? ` · ${w.pages} pages` : ''}` })),
            el('span', { class: 'small mono muted',
              text: finished ? `${scoreFor(w.id).percent}%` : 'Not started' }));
        })),

      el('div', { class: 'row-between', style: 'margin-top:14px' },
        el('span', { class: 'small muted', text: `${done} of ${sheets.length} finished` }),
        el('div', { class: `bar ${done === sheets.length ? 'green' : ''}`, style: 'flex:1;max-width:160px' },
          el('span', { style: `width:${Math.round((done / Math.max(1, sheets.length)) * 100)}%` })))
    ));
  }

  $('#assigned-list').replaceChildren(...cards);
}
