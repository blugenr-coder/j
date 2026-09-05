/* Progress page — section 11. Visual, but every number is derived from real
   answers rather than decoration. */

import { $, el, donut, formatMinutes, todayKey, pct } from '../core/util.js';
import { mountShell, mountSideNav, href, requireUser } from '../core/shell.js';
import { statTile, emptyState } from '../core/cards.js';
import { icon } from '../core/icons.js';
import { SUBJECT_MAP, TOPIC_MAP } from '../data/catalog.js';
import { findWhere, getExercise } from '../data/exercises.js';
import { summary, getState, scoreFor, statusFor } from '../core/store.js';

mountShell({ page: 'progress', nav: 'app', footer: false });

/* What to say when there is no weak topic: either nothing has been assessed
   yet, or everything assessed is above the threshold — which is good news and
   should read as such, plus somewhere useful to go next. */
/* Declared above the function that reads it. It used to sit below, which is a
   temporal dead zone: the moment a student had practised topics and none of
   them were weak, this panel threw instead of rendering. Nothing reached that
   branch until a full set of correct answers made it possible. */
const WEAK_LABEL = 85;

function nothingWeak(assessed) {
  if (!assessed.length) {
    return el('p', { class: 'small muted', style: 'margin:0',
      text: 'Answer at least two questions in a topic and it will be assessed here.' });
  }
  const strongest = assessed[assessed.length - 1];
  const next = findWhere(e => statusFor(e.id) === 'not-started');
  return el('div', { class: 'row', style: 'gap:16px;align-items:flex-start;padding:8px 0' },
    el('span', { class: 'tile-icon green' }, icon('check', { size: 18 })),
    el('span', { class: 'grow' },
      el('strong', { class: 'small', style: 'display:block', text: 'No weak topics right now' }),
      el('span', { class: 'small muted', text:
        `Every topic you have practised is at ${WEAK_LABEL}% or above — your best is ` +
        `${TOPIC_MAP[strongest.id]?.name ?? strongest.id} at ${strongest.percent}%. ` +
        'Try something new and this panel will start pointing at the gaps.' })),
    next ? el('a', { class: 'btn btn-ghost btn-sm', href: href(`exercise.html?id=${next.id}`), text: 'Try one' }) : null);
}

function render() {
  mountSideNav($('#side-nav-host'), 'progress');
  const s = summary();
  const state = getState();

  $('#stats').replaceChildren(
    statTile({ label: 'Average accuracy', value: `${s.accuracy}%`, foot: `${s.correct} of ${s.answered} answers correct`, iconName: 'target' }),
    statTile({ label: 'Worksheets completed', value: String(s.completed), foot: `${Object.keys(state.progress).length} opened in total`, iconName: 'check-circle', tone: 'green' }),
    statTile({ label: 'Practice time', value: formatMinutes(s.minutes), foot: 'Time actually spent answering', iconName: 'clock' }),
    statTile({ label: 'Current streak', value: `${s.streak}`, foot: s.streak === 1 ? 'day in a row' : 'days in a row', iconName: 'flame', tone: 'orange' })
  );

  /* ----------------------------- subject bars ----------------------------- */
  const rows = Object.entries(s.subjects).sort((a, b) => b[1].percent - a[1].percent);
  $('#subject-progress').replaceChildren(...(rows.length
    ? rows.map(([id, b]) => el('div', { class: 'subject-row' },
        el('span', {},
          el('strong', { class: 'small', style: 'display:block', text: SUBJECT_MAP[id]?.name ?? id }),
          el('span', { class: 'small muted', text: `${b.completed} of ${b.exercises} finished` })),
        el('div', { class: `bar bar-lg ${b.percent >= 80 ? 'green' : b.percent >= 60 ? '' : 'orange'}` },
          el('span', { style: `width:${b.percent}%` })),
        el('strong', { class: 'mono small', style: 'text-align:right', text: `${b.percent}%` })))
    : [el('p', { class: 'small muted', text: 'Answer some questions and your subject breakdown appears here.' })]));

  /* ------------------------------- day chart ------------------------------- */
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ key: todayKey(d), label: d.toLocaleDateString(undefined, { weekday: 'narrow' }), minutes: state.days[todayKey(d)] ?? 0 });
  }
  const peak = Math.max(10, ...days.map(d => d.minutes));
  $('#day-chart').replaceChildren(
    el('div', { class: 'row', style: 'gap:4px;align-items:flex-end;height:120px;margin:16px 0 8px' },
      days.map(d => el('div', {
        style: 'flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%',
        title: `${d.key}: ${formatMinutes(d.minutes)}`
      },
        el('div', {
          style: `height:${Math.max(3, (d.minutes / peak) * 100)}%;border-radius:4px;background:${d.minutes ? 'var(--primary)' : 'var(--surface-2)'}`
        })))),
    el('div', { class: 'row', style: 'gap:4px' },
      days.map(d => el('span', { class: 'small muted', style: 'flex:1;text-align:center', text: d.label }))),
    el('p', { class: 'small muted', style: 'margin-top:12px' },
      `${formatMinutes(days.reduce((a, d) => a + d.minutes, 0))} in the last two weeks.`)
  );

  /* ------------------------------ weak topics ------------------------------ */
  /* Accuracy per topic across everything answered, worst first. */
  const topics = {};
  for (const [id, run] of Object.entries(state.progress)) {
    const ex = getExercise(id);
    if (!ex) continue;
    const bucket = topics[ex.topic] ??= { correct: 0, answered: 0 };
    for (const q of ex.questions) {
      const a = run.answers?.[q.id];
      if (!a || a.correct === null) continue;
      bucket.answered++;
      if (a.correct) bucket.correct++;
    }
  }
  /* Only topics genuinely below par belong here. Telling someone to "focus on"
     a topic they scored 100% in is noise, and it teaches them to ignore the
     panel entirely. */
  const WEAK_BELOW = 85;
  const assessed = Object.entries(topics)
    .filter(([, b]) => b.answered >= 2)
    .map(([id, b]) => ({ id, percent: Math.round((b.correct / b.answered) * 100), ...b }))
    .sort((a, b) => a.percent - b.percent);
  const weak = assessed.filter(t => t.percent < WEAK_BELOW).slice(0, 4);

  $('#weak-topics').replaceChildren(...(weak.length
    ? weak.map(t => {
        const fix = findWhere(e => e.topic === t.id && statusFor(e.id) !== 'completed')
                 ?? findWhere(e => e.topic === t.id);
        return el('div', { class: 'list-item' },
          el('span', { class: `tile-icon ${t.percent >= 70 ? 'green' : t.percent >= 50 ? 'orange' : 'red'}`,
            'aria-hidden': 'true', text: `${t.percent}%` , style: 'font-size:13px;font-weight:700' }),
          el('span', { class: 'grow' },
            el('span', { class: 'list-title', style: 'display:block', text: TOPIC_MAP[t.id]?.name ?? t.id }),
            el('span', { class: 'list-sub', text: `${t.correct} of ${t.answered} correct` })),
          fix ? el('a', { class: 'btn btn-ghost btn-sm', href: href(`exercise.html?id=${fix.id}`), text: 'Practise' }) : null);
      })
    : [nothingWeak(assessed)]));

  /* -------------------------------- history -------------------------------- */
  const history = Object.keys(state.progress)
    .filter(id => getExercise(id))
    .sort((a, b) => (state.progress[b].updated ?? 0) - (state.progress[a].updated ?? 0));

  if (!history.length) {
    $('#history-rows').closest('.table-scroll').hidden = true;
    $('#history-empty').append(emptyState('progress', 'No history yet',
      'Once you start a worksheet it is listed here with your score.',
      el('a', { class: 'btn btn-primary', href: href('library.html'), text: 'Find a worksheet' })));
    return;
  }

  $('#history-rows').replaceChildren(...history.map(id => {
    const ex = getExercise(id);
    const sc = scoreFor(id);
    const status = statusFor(id);
    return el('tr', {},
      el('td', {}, el('a', { href: href(`exercise.html?id=${id}`), text: ex.title })),
      el('td', { class: 'small muted', text: ex.level }),
      el('td', {}, el('span', {
        class: `badge ${status === 'completed' ? 'badge-success' : status === 'in-progress' ? 'badge-warn' : ''}`,
        text: status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In progress' : 'Not started' })),
      el('td', { class: 'mono small', text: `${sc.answered} / ${sc.total}` }),
      el('td', { class: 'mono', style: 'font-weight:700', text: `${sc.percent}%` }),
      el('td', {}, el('a', { class: 'small', href: href(`print.html?id=${id}`), text: 'Print' }))
    );
  }));
}

/* Entry point last, after every declaration this file makes. Running it from
   the top of the file put the call above a const it reaches through two
   function hops, and the page threw the moment that branch was taken. */
if (requireUser('progress.html')) render();
