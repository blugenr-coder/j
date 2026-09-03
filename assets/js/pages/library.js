/* Exercise library — sections 5 and 19.
   Filter state lives in the URL, so any view is shareable and the back button
   works. The search box parses natural queries into those same filters. */

import { $, el, qs, setQs, plural } from '../core/util.js';
import { mountShell, href } from '../core/shell.js';
import { exerciseCard, emptyState } from '../core/cards.js';
import { GRADES, SUBJECTS, SUBJECT_MAP, TOPIC_MAP, DIFFICULTIES, QUESTION_TYPES, GRADE_MAP } from '../data/catalog.js';
import { searchExercises, parseQuery } from '../core/search.js';

mountShell({ page: 'library', nav: 'public' });

const FILTERS = ['grade', 'level', 'subject', 'topic', 'difficulty', 'type', 'format', 'length'];

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
        apply();
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
    filterGroup('Grade band', 'grade', GRADES.map(g => ({ id: g.id, label: `${g.emoji} ${g.name}` }))),
    filterGroup('Level', 'level', levelOptions),
    filterGroup('Subject', 'subject', SUBJECTS.map(s => ({ id: s.id, label: s.name }))),
    filterGroup('Topic', 'topic', topicOptions),
    filterGroup('Difficulty', 'difficulty', DIFFICULTIES.map(d => ({ id: d.id, label: `${d.dot} ${d.name}` }))),
    filterGroup('Question type', 'type', QUESTION_TYPES.map(t => ({ id: t.id, label: `${t.emoji} ${t.name}` }))),
    filterGroup('Format', 'format', [{ id: 'online', label: '💻 Online' }, { id: 'printable', label: '🖨️ Printable' }]),
    filterGroup('Length', 'length', [
      { id: 'short', label: 'Under 8 questions' },
      { id: 'medium', label: '8–10 questions' },
      { id: 'long', label: '11+ questions' }
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
  length: id => ({ short: 'Under 8 questions', medium: '8–10 questions', long: '11+ questions' }[id])
};

function buildActiveFilters() {
  const host = $('#active-filters');
  const active = FILTERS.filter(k => state[k]);
  if (!active.length && !state.text) { host.replaceChildren(); return; }

  const chips = active.map(k => el('button', {
    class: 'chip is-active', type: 'button',
    'aria-label': `Remove filter ${LABELS[k](state[k])}`,
    onclick: () => { state[k] = null; apply(); }
  }, `${LABELS[k](state[k])}`, el('span', { 'aria-hidden': 'true', text: '×' })));

  if (state.text) {
    chips.unshift(el('button', {
      class: 'chip is-active', type: 'button',
      onclick: () => { state.text = ''; input.value = ''; apply(); }
    }, `“${state.text}”`, el('span', { 'aria-hidden': 'true', text: '×' })));
  }
  host.replaceChildren(...chips);
}

function apply({ pushUrl = true } = {}) {
  if (pushUrl) writeUrl();
  buildFilters();
  buildActiveFilters();

  const results = searchExercises({ ...state, sort: state.sort });
  $('#result-count').textContent = results.length
    ? `${plural(results.length, 'exercise')} found`
    : 'No exercises match';

  resultsHost.replaceChildren(
    results.length
      ? results.map(ex => exerciseCard(ex))
      : emptyState('🔍', 'Nothing matches those filters',
          'Try removing a filter, or search for a topic like “fractions” or “photosynthesis”.',
          el('button', { class: 'btn btn-secondary', type: 'button', text: 'Clear all filters',
            onclick: () => { clearAll(); } }))
  );
}

function clearAll() {
  for (const k of FILTERS) state[k] = null;
  state.text = '';
  input.value = '';
  apply();
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
  apply();
});

let debounce;
input.addEventListener('input', () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    if (!input.value.trim()) { state.text = ''; apply(); }
  }, 300);
});

$('#sort').value = state.sort;
$('#sort').addEventListener('change', e => { state.sort = e.target.value; apply(); });
$('#clear-filters').addEventListener('click', clearAll);
window.addEventListener('popstate', () => { readUrl(); input.value = state.text; apply({ pushUrl: false }); });

apply({ pushUrl: false });
