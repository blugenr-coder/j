/* Student dashboard — section 10. */

import { $, el, pct, formatMinutes, plural } from '../core/util.js';
import { mountShell, mountSideNav, href, requireUser } from '../core/shell.js';
import { statTile, exerciseRow, exerciseCard, emptyState } from '../core/cards.js';
import { GRADE_MAP, SUBJECT_MAP, ACHIEVEMENTS } from '../data/catalog.js';
import { EXERCISES, getExercise } from '../data/exercises.js';
import { currentUser, summary, continueTarget, recentExercises, scoreFor, getState, statusFor } from '../core/store.js';

mountShell({ page: 'dashboard', nav: 'app', footer: false });
if (requireUser('dashboard.html')) render();

function render() {
  const user = currentUser();
  mountSideNav($('#side-nav-host'), 'dashboard');

  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  $('#greeting').textContent = `${part}, ${user.name.split(' ')[0]}! 👋`;

  const s = summary();
  $('#greeting-sub').textContent = s.completed
    ? `${plural(s.completed, 'exercise')} finished so far. Keep it going.`
    : 'Pick something below and make a start — the first one is the hardest.';

  /* --------------------------------- stats --------------------------------- */
  $('#stats').replaceChildren(
    statTile({ label: 'Exercises completed', value: String(s.completed), foot: 'All time', icon: '📗', tone: 'green' }),
    statTile({ label: 'Average accuracy',    value: `${s.accuracy}%`,    foot: `${s.correct} correct answers`, icon: '📊' }),
    statTile({ label: 'Current streak',      value: String(s.streak),    foot: s.streak === 1 ? 'day' : 'days in a row', icon: '🔥', tone: 'orange' }),
    statTile({ label: 'Practice time',       value: formatMinutes(s.minutes), foot: 'Across all exercises', icon: '⏱️' })
  );

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
        el('span', { class: 'tile-icon lg', 'aria-hidden': 'true', text: SUBJECT_MAP[ex.subject]?.emoji ?? '📘' }),
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
      emptyState('🚀', 'Nothing in progress',
        'Start an exercise and it will wait for you here until it is finished.',
        el('a', { class: 'btn btn-primary', href: href('library.html'), text: 'Browse exercises' }))
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
  const recommended = [...EXERCISES].sort((a, b) => scoreRec(b) - scoreRec(a)).slice(0, 3);
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
      el('span', { style: 'font-size:22px', 'aria-hidden': 'true', text: a.emoji }),
      el('span', { class: 'grow' },
        el('span', { class: 'list-title', style: 'display:block', text: a.name }),
        el('span', { class: 'list-sub', text: a.desc })),
      el('span', { class: 'badge badge-success', text: 'Unlocked' }))),
    nextUp ? el('div', { class: 'list-item', style: 'opacity:.65' },
      el('span', { style: 'font-size:22px;filter:grayscale(1)', 'aria-hidden': 'true', text: nextUp.emoji }),
      el('span', { class: 'grow' },
        el('span', { class: 'list-title', style: 'display:block', text: nextUp.name }),
        el('span', { class: 'list-sub', text: nextUp.desc })),
      el('span', { class: 'badge', text: 'Next up' })) : null
  );
}
