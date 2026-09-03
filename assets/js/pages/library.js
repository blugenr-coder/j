/* Exercise library — sections 5 and 19.
   Filter state lives in the URL, so any view is shareable and the back button
   works. The search box parses natural queries into those same filters. */

import { $, el, qs, setQs, plural, fill } from '../core/util.js';
import { mountShell, href } from '../core/shell.js';
import { exerciseCard, emptyState } from '../core/cards.js';
import { GRADES, SUBJECTS, SUBJECT_MAP, TOPIC_MAP, DIFFICULTIES, QUESTION_TYPES, GRADE_MAP } from '../data/catalog.js';
import { searchExercises, parseQuery } from '../core/search.js';

mountShell({ page: 'library', nav: 'public' });

const FILTERS = ['grade', 'level', 'subject', 'topic', 'difficulty', 'type', 'format', 'length', 'pages'];

/* The library holds over a thousand worksheets and each card renders two real
   questions from its sheet, so results are paged. Rendering everything would
   materialise ten thousand questions to fill one screen. */
const PAGE_SIZE = 24;
let shown = PAGE_SIZE;

/* ------------------------------ filter state ------------------------------ */
const state = { text: '', sort: 'recommended' };
function readUrl() {
  const p = new URL(location.href).searchParams;
  for (const k of FILTERS) state[k] = p.get(k) || null;
  state.sort = p.get('sort') || 'recommended';
  const raw = p.get('q');
  if (raw) {
    /* A raw query from the home page or a shared link: parse it once so the
       filter panel visibly reflects what the search understood. */
    const parsed = parseQuery(raw);
    for (const k of FILTERS) state[k] ??= parsed[k] ?? null;
    state.text = parsed.text;
    state.raw = raw;
  } else {
    state.text = p.get('text') || '';
    state.raw = state.text;
  }
}
function writeUrl() {
  setQs({
    ...Object.fromEntries(FILTERS.map(k => [k, state[k]])),
    q: null,
    text: state.text || null,
    sort: state.sort === 'recommended' ? null : state.sort
  });
}

/* ------------------------------- rendering ------------------------------- */
const groupsHost = $('#filter-groups');
const resultsHost = $('#results');
const input = $('#q');

function filterGroup(label, key, options) {
  const wrap = el('div', { class: 'filter-group' },
    el('span', { class: 'label', text: label }));
  const opts = el('div', { class: 'filter-options' });
  for (const o of options) {
    opts.append(el('button', {
      class: 'chip', type: 'button',
      'aria-pressed': String(state[key] === o.id),
      onclick: () => {
        state[key] = state[key] === o.id ? null : o.id;
        /* Choosing a topic implies its subject; changing subject drops a topic
           that no longer belongs to it. */
        if (key === 'topic' && state.topic) state.subject = TOPIC_MAP[state.topic].subject;
        if (key === 'subject' && state.topic && TOPIC_MAP[state.topic]?.subject !== state.subject) state.topic = null;
        if (key === 'grade' && state.level && !GRADE_MAP[state.grade]?.levels.includes(state.level)) state.level = null;
        apply({ resetPage: true });
      },
      text: o.label
    }));
  }
  wrap.append(opts);
  return wrap;
}

function buildFilters() {
  const levelOptions = (state.grade ? [GRADE_MAP[state.grade]] : GRADES)
    .flatMap(g => g.levels.map(l => ({ id: l, label: l })));

  const topicSource = state.subject ? [SUBJECT_MAP[state.subject]] : SUBJECTS;
  const topicOptions = topicSource.flatMap(s => s.topics.map(t => ({ id: t.id, label: t.name })));

  groupsHost.replaceChildren(
    filterGroup('Grade band', 'grade', GRADES.map(g => ({ id: g.id, label: g.name }))),
    filterGroup('Level', 'level', levelOptions),
    filterGroup('Subject', 'subject', SUBJECTS.map(s => ({ id: s.id, label: s.name }))),
    filterGroup('Topic', 'topic', topicOptions),
    filterGroup('Difficulty', 'difficulty', DIFFICULTIES.map(d => ({ id: d.id, label: d.name }))),
    filterGroup('Question type', 'type', QUESTION_TYPES.map(t => ({ id: t.id, label: t.name }))),
    filterGroup('Format', 'format', [{ id: 'online', label: 'Online' }, { id: 'printable', label: 'Printable' }]),
    filterGroup('Length', 'length', [
      { id: 'short', label: 'Under 8 questions' },
      { id: 'medium', label: '8–12 questions' },
      { id: 'long', label: '13+ questions' }
    ]),
    filterGroup('Printed pages', 'pages', [
      { id: '1', label: '1 page' }, { id: '2', label: '2 pages' },
      { id: '3', label: '3 pages' }, { id: '4', label: '4 pages' }
    ])
  );
}

const LABELS = {
  grade: id => GRADE_MAP[id]?.name ?? id,
  level: id => id,
  subject: id => SUBJECT_MAP[id]?.name ?? id,
  topic: id => TOPIC_MAP[id]?.name ?? id,
  difficulty: id => id[0].toUpperCase() + id.slice(1),
  type: id => QUESTION_TYPES.find(t => t.id === id)?.name ?? id,
  format: id => id === 'online' ? 'Online' : 'Printable',
  length: id => ({ short: 'Under 8 questions', medium: '8–12 questions', long: '13+ questions' }[id]),
  pages: id => `${id} page${id === '1' ? '' : 's'}`
};

function buildActiveFilters() {
  const host = $('#active-filters');
  const active = FILTERS.filter(k => state[k]);
  if (!active.length && !state.text) { host.replaceChildren(); return; }

  const chips = active.map(k => el('button', {
    class: 'chip is-active', type: 'button',
    'aria-label': `Remove filter ${LABELS[k](state[k])}`,
    onclick: () => { state[k] = null; apply({ resetPage: true }); }
  }, `${LABELS[k](state[k])}`, el('span', { 'aria-hidden': 'true', text: '×' })));

  if (state.text) {
    chips.unshift(el('button', {
      class: 'chip is-active', type: 'button',
      onclick: () => { state.text = ''; input.value = ''; apply({ resetPage: true }); }
    }, `“${state.text}”`, el('span', { 'aria-hidden': 'true', text: '×' })));
  }
  host.replaceChildren(...chips);
}

function apply({ pushUrl = true, resetPage = false } = {}) {
  if (resetPage) shown = PAGE_SIZE;
  if (pushUrl) writeUrl();
  /* Filtering to a grade band tunes the type scale with it. */
  document.body.dataset.band = state.grade ? (GRADE_MAP[state.grade]?.band ?? 'mid') : 'mid';
  buildFilters();
  buildActiveFilters();

  const results = searchExercises({ ...state, sort: state.sort });
  $('#result-count').textContent = results.length
    ? `${results.length.toLocaleString()} worksheet${results.length === 1 ? '' : 's'}`
    : 'No worksheets match';

  const page = results.slice(0, shown);
  fill(resultsHost,
    results.length
      ? page.map(ex => exerciseCard(ex))
      : emptyState('search', 'Nothing matches those filters',
          'Try removing a filter, or search for a topic like “fractions” or “photosynthesis”.',
          el('button', { class: 'btn btn-secondary', type: 'button', text: 'Clear all filters',
            onclick: () => { clearAll(); } }))
  );

  const more = $('#load-more');
  const remaining = results.length - page.length;
  more.hidden = remaining <= 0;
  if (remaining > 0) {
    fill(more,
      el('p', { class: 'small muted', text: `Showing ${page.length.toLocaleString()} of ${results.length.toLocaleString()}` }),
      el('button', {
        class: 'btn btn-secondary', type: 'button',
        text: `Show ${Math.min(PAGE_SIZE, remaining)} more`,
        onclick: () => { shown += PAGE_SIZE; apply({ pushUrl: false }); }
      }));
  }
}

function clearAll() {
  for (const k of FILTERS) state[k] = null;
  state.text = '';
  input.value = '';
  apply({ resetPage: true });
}

/* --------------------------------- wiring --------------------------------- */
readUrl();
input.value = state.raw ?? state.text ?? '';

if (state.raw && state.raw !== state.text) {
  const note = $('#parse-note');
  const understood = FILTERS.filter(k => state[k]).map(k => LABELS[k](state[k]));
  if (understood.length) {
    note.hidden = false;
    note.textContent = `Understood as: ${understood.join(' · ')}${state.text ? ` + “${state.text}”` : ''}`;
  }
}

$('#search-form').addEventListener('submit', e => {
  e.preventDefault();
  const parsed = parseQuery(input.value);
  for (const k of FILTERS) state[k] = parsed[k] ?? state[k];
  state.text = parsed.text;
  $('#parse-note').hidden = true;
  apply({ resetPage: true });
});

let debounce;
input.addEventListener('input', () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    if (!input.value.trim()) { state.text = ''; apply({ resetPage: true }); }
  }, 300);
});

$('#sort').value = state.sort;
$('#sort').addEventListener('change', e => { state.sort = e.target.value; apply({ resetPage: true }); });
$('#clear-filters').addEventListener('click', clearAll);
window.addEventListener('popstate', () => { readUrl(); input.value = state.text; apply({ pushUrl: false }); });

apply({ pushUrl: false });
