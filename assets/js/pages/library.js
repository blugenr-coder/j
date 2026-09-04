/* Exercise library — sections 5 and 19.
   Filter state lives in the URL, so any view is shareable and the back button
   works. The search box parses natural queries into those same filters. */

import { $, el, qs, setQs, plural, fill } from '../core/util.js';
import { mountShell, href } from '../core/shell.js';
import { exerciseCard, emptyState } from '../core/cards.js';
import { icon } from '../core/icons.js';
import { GRADES, SUBJECTS, SUBJECT_MAP, TOPIC_MAP, DIFFICULTIES, QUESTION_TYPES, GRADE_MAP } from '../data/catalog.js';
import { searchExercises, resolveQuery, facetCounts, isSet, valuesOf } from '../core/search.js';
import { STANDARDS } from '../data/standards.js';
import { t, whenReady } from '../core/i18n.js';

mountShell({ page: 'library', nav: 'public' });

const FILTERS = ['grade', 'level', 'subject', 'topic', 'framework', 'difficulty', 'type', 'format', 'length', 'pages'];

/* The library holds over a thousand worksheets and each card renders two real
   questions from its sheet, so results are paged. Rendering everything would
   materialise ten thousand questions to fill one screen. */
const PAGE_SIZE = 24;
let shown = PAGE_SIZE;

/* ------------------------------ filter state ------------------------------ */
const state = { text: '', sort: 'recommended' };
/* Each filter holds a list. A comma-separated list in the URL keeps a shared
   link readable — ?subject=science,math — and still round-trips exactly. */
const splitParam = v => (v ? String(v).split(',').filter(Boolean) : []);
const joinParam = list => (list && list.length ? list.join(',') : null);

function readUrl() {
  const p = new URL(location.href).searchParams;
  for (const k of FILTERS) state[k] = splitParam(p.get(k));
  state.sort = p.get('sort') || 'recommended';
  const raw = p.get('q');
  if (raw) {
    /* A raw query from the home page or a shared link. `resolveQuery` reads it
       as filters where that finds something and as plain text where it does
       not, so "spanish empire" is not read as the Spanish language. */
    const { filters } = resolveQuery(raw);
    for (const k of FILTERS) if (!state[k].length && filters[k]) state[k] = [filters[k]];
    state.text = filters.text ?? '';
    state.raw = raw;
  } else {
    state.text = p.get('text') || '';
    state.raw = state.text;
  }
}
function writeUrl() {
  setQs({
    ...Object.fromEntries(FILTERS.map(k => [k, joinParam(state[k])])),
    q: null,
    text: state.text || null,
    sort: state.sort === 'recommended' ? null : state.sort
  });
}

/* ------------------------------- rendering ------------------------------- */
const groupsHost = $('#filter-groups');
const resultsHost = $('#results');
const input = $('#q');

/* One filter group. Options are full-width rows with a count, not wrapping
   pills: at fifty-odd topics the pills wrapped into a ragged block that was
   impossible to scan, and a count is the thing that actually tells you whether
   a filter is worth clicking. */
const openGroups = new Set(['grade', 'subject', 'level']);
const expanded = new Set();
const COLLAPSE_AT = 8;

/* Choices in one group can strand choices in another: picking a topic implies
   its subject, and dropping a subject leaves its topics with nothing to belong
   to. This keeps the panel consistent without silently discarding a choice the
   reader can still see. */
function reconcile(key) {
  if (key === 'topic' && state.topic.length) {
    const subjects = new Set(state.topic.map(t => TOPIC_MAP[t]?.subject).filter(Boolean));
    state.subject = [...new Set([...state.subject, ...subjects])];
  }
  if (key === 'subject') {
    const allowed = new Set(state.subject);
    if (allowed.size) state.topic = state.topic.filter(t => allowed.has(TOPIC_MAP[t]?.subject));
  }
  if (key === 'grade') {
    const levels = new Set(state.grade.flatMap(g => GRADE_MAP[g]?.levels ?? []));
    if (levels.size) state.level = state.level.filter(l => levels.has(l));
  }
  if (key === 'level' && state.level.length) {
    const grades = new Set(state.level
      .map(l => GRADES.find(g => g.levels.includes(l))?.id).filter(Boolean));
    state.grade = [...new Set([...state.grade, ...grades])];
  }
}

/* Filter options are one per row.
   They used to sit two to a row where the names were short, which stopped
   working once every row grew a checkbox and a count: "Printable" beside
   "111,222" does not fit half a 250px rail, and the names were being
   ellipsized to "Pri…". A translated name never fitted at all. One column is
   taller and always readable, and the groups collapse anyway. */

function filterGroup(label, key, options, counts, { any = null } = {}) {
  const chosen = valuesOf(state[key]);
  const nameOf = id => options.find(o => o.id === id)?.label ?? id;
  const chosenLabel = chosen.length === 1 ? nameOf(chosen[0])
                    : chosen.length ? `${chosen.length} selected` : '';
  const isOpen = openGroups.has(key) || chosen.length > 0;

  /* Drop the options with nothing behind them BEFORE deciding what to collapse.
     Slicing first hid NGSS behind "show all" and then filtered away the eleven
     empty frameworks in front of it, leaving a group that claimed there was
     nothing to narrow by while NGSS was the active filter. */
  const live = options.filter(o => (counts?.[o.id] ?? 0) > 0 || chosen.includes(o.id));
  const showAll = expanded.has(key) || live.length <= COLLAPSE_AT;
  const visible = showAll ? live : live.slice(0, COLLAPSE_AT);

  const box = el('details', { class: 'filter-group' });
  box.open = isOpen;
  box.addEventListener('toggle', () => {
    if (box.open) openGroups.add(key); else openGroups.delete(key);
  });

  const summary = el('summary', { class: 'filter-summary' },
    el('span', { class: 'filter-label', text: label }),
    chosen ? el('span', { class: 'filter-chosen', text: chosenLabel }) : null,
    el('span', { class: 'ico filter-caret' }, icon('chevron-down', { size: 15 })));
  box.append(summary);

  const opts = el('div', { class: 'filter-options' });

  /* An explicit "Any" row. Clicking the selected option again also clears the
     filter, but that is a thing you have to know; a row that says so is not. */
  if (any) {
    opts.append(el('button', {
      class: 'facet facet-any', type: 'button',
      'aria-pressed': String(!chosen),
      onclick: () => { if (!chosen.length) return; state[key] = []; apply({ resetPage: true }); }
    },
      el('span', { class: 'facet-name', text: any }),
      !chosen.length ? el('span', { class: 'facet-tick' }, icon('check', { size: 14 })) : null));
  }
  for (const o of visible) {
    const n = counts?.[o.id] ?? 0;
    const on = chosen.includes(o.id);
    opts.append(el('button', {
      /* A checkbox rather than a radio: clicking a second subject adds it. The
         tick is the affordance, and clicking a ticked option removes it. */
      class: 'facet', type: 'button', role: 'checkbox', 'aria-checked': String(on),
      'aria-pressed': String(on),
      onclick: () => {
        state[key] = on ? chosen.filter(v => v !== o.id) : [...chosen, o.id];
        reconcile(key);
        apply({ resetPage: true });
      }
    },
      el('span', { class: 'facet-box' }, on ? icon('check', { size: 12 }) : null),
      el('span', { class: 'facet-name', text: o.label }),
      el('span', { class: 'facet-n', text: n ? n.toLocaleString() : '' })));
  }

  if (!opts.childElementCount) opts.append(el('p', { class: 'small muted', text: 'Nothing left to narrow by.' }));
  else if (live.length > COLLAPSE_AT) {
    opts.append(el('button', {
      class: 'facet facet-more', type: 'button',
      text: showAll ? 'Show fewer' : `Show all ${live.length}`,
      onclick: () => { showAll ? expanded.delete(key) : expanded.add(key); apply({ pushUrl: false }); }
    }));
  }

  box.append(opts);
  return box;
}

function buildFilters(counts) {
  const gradeSource = state.grade.length ? state.grade.map(g => GRADE_MAP[g]).filter(Boolean) : GRADES;
  const levelOptions = gradeSource.flatMap(g => g.levels.map(l => ({ id: l, label: l })));

  const topicSource = state.subject.length
    ? state.subject.map(id => SUBJECT_MAP[id]).filter(Boolean) : SUBJECTS;
  const topicOptions = topicSource.flatMap(s => s.topics.map(t => ({ id: t.id, label: t.name })));

  groupsHost.replaceChildren(
    filterGroup('Grade band', 'grade', GRADES.map(g => ({ id: g.id, label: g.name })), counts.grade, { any: 'Any grade band' }),
    filterGroup('Level', 'level', levelOptions, counts.level, { any: 'Any level' }),
    filterGroup('Subject', 'subject', SUBJECTS.map(s => ({ id: s.id, label: s.name })), counts.subject, { any: 'Any subject' }),
    filterGroup('Topic', 'topic', topicOptions, counts.topic, { any: 'Any topic' }),
    filterGroup('Curriculum framework', 'framework', FRAMEWORKS, counts.framework, { any: 'Any framework' }),
    filterGroup('Difficulty', 'difficulty', DIFFICULTIES.map(d => ({ id: d.id, label: d.name })), counts.difficulty, { any: 'Any difficulty' }),
    filterGroup('Question type', 'type', QUESTION_TYPES.map(t => ({ id: t.id, label: t.name })), counts.type, { any: 'Any question type' }),
    filterGroup('Format', 'format', [{ id: 'online', label: 'Online' }, { id: 'printable', label: 'Printable' }], counts.format, { any: 'Any format' }),
    filterGroup('Length', 'length', LENGTHS, counts.length, { any: 'Any length' }),
    filterGroup('Printed pages', 'pages', PAGE_OPTIONS, counts.pages, { any: 'Any page count' })
  );
}

/* Schools index their schemes of work against a standards framework, so the
   library can be filtered by one. See data/standards.js for the mapping. */
const FRAMEWORKS = [...new Set(Object.values(STANDARDS).map(s => s.framework))]
  .sort().map(f => ({ id: f, label: f }));

const LENGTHS = [
  { id: 'short',  label: 'Under 8 questions' },
  { id: 'medium', label: '8–12 questions' },
  { id: 'long',   label: '13–24 questions' },
  { id: 'xlong',  label: '25+ questions' }
];
const PAGE_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10].map(n => ({ id: String(n), label: `${n} page${n === 1 ? '' : 's'}` }));

const LABELS = {
  grade: id => GRADE_MAP[id]?.name ?? id,
  level: id => id,
  subject: id => SUBJECT_MAP[id]?.name ?? id,
  topic: id => TOPIC_MAP[id]?.name ?? id,
  difficulty: id => id[0].toUpperCase() + id.slice(1),
  type: id => QUESTION_TYPES.find(t => t.id === id)?.name ?? id,
  format: id => id === 'online' ? 'Online' : 'Printable',
  length: id => LENGTHS.find(l => l.id === id)?.label ?? id,
  pages: id => `${id} page${id === '1' ? '' : 's'}`,
  framework: id => id
};

function buildActiveFilters() {
  const host = $('#active-filters');
  /* One chip per chosen value, not per group: with several subjects selected,
     a single "Subject ×" chip would hide what is actually on and remove three
     choices at one click. */
  const active = FILTERS.flatMap(k => valuesOf(state[k]).map(v => [k, v]));
  const label = document.getElementById('filter-toggle-label');
  if (label) label.textContent = active.length ? `Filters (${active.length})` : 'Filters';
  if (!active.length && !state.text) { host.replaceChildren(); return; }

  const chips = active.map(([k, v]) => el('button', {
    class: 'chip is-active', type: 'button',
    'aria-label': `Remove filter ${LABELS[k](v)}`,
    onclick: () => {
      state[k] = valuesOf(state[k]).filter(x => x !== v);
      reconcile(k);
      apply({ resetPage: true });
    }
  }, `${LABELS[k](v)}`, el('span', { 'aria-hidden': 'true', text: '×' })));

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
  /* One grade selected tints the page for that band; several is no longer one
     band, so the neutral tint is the honest answer. */
  document.body.dataset.band = state.grade.length === 1
    ? (GRADE_MAP[state.grade[0]]?.band ?? 'mid') : 'mid';
  buildFilters(facetCounts(state));
  buildActiveFilters();

  const results = searchExercises({ ...state, sort: state.sort });
  const total = results.total;
  $('#result-count').textContent = total
    ? `${total.toLocaleString()} worksheet${total === 1 ? '' : 's'}`
    : 'No worksheets match';

  const page = results.slice(0, shown);
  fill(resultsHost,
    total
      ? page.map(ex => exerciseCard(ex))
      : emptyState('search', 'Nothing matches those filters',
          'Try removing a filter, or search for a topic like “fractions” or “photosynthesis”.',
          el('button', { class: 'btn btn-secondary', type: 'button', text: 'Clear all filters',
            onclick: () => { clearAll(); } }))
  );

  const more = $('#load-more');
  const remaining = total - page.length;
  more.hidden = remaining <= 0;
  if (remaining > 0) {
    fill(more,
      el('p', { class: 'small muted', text: `Showing ${page.length.toLocaleString()} of ${total.toLocaleString()}` }),
      el('button', {
        class: 'btn btn-secondary', type: 'button',
        text: `Show ${Math.min(PAGE_SIZE, remaining)} more`,
        onclick: () => { shown += PAGE_SIZE; apply({ pushUrl: false }); }
      }));
  }
}

function clearAll() {
  for (const k of FILTERS) state[k] = [];
  state.text = '';
  input.value = '';
  apply({ resetPage: true });
}

/* --------------------------------- wiring --------------------------------- */
readUrl();
input.value = state.raw ?? state.text ?? '';

if (state.raw && state.raw !== state.text) {
  const note = $('#parse-note');
  const understood = FILTERS.flatMap(k => valuesOf(state[k]).map(v => LABELS[k](v)));
  if (understood.length) {
    note.hidden = false;
    note.textContent = `Understood as: ${understood.join(' · ')}${state.text ? ` + “${state.text}”` : ''}`;
  }
}

$('#search-form').addEventListener('submit', e => {
  e.preventDefault();
  const { filters } = resolveQuery(input.value);
  for (const k of FILTERS) state[k] = filters[k] ? [filters[k]] : [];
  state.text = filters.text ?? '';
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

/* The filter rail is a screenful on a phone, so below the breakpoint it starts
   closed and the results are the first thing you see. Above it, the button is
   not rendered at all and the panel is always open. */
const narrow = window.matchMedia('(max-width: 900px)');
const panel = $('#filter-panel');
const toggle = $('#filter-toggle');
function syncPanel() {
  if (!narrow.matches) { panel.hidden = false; toggle.setAttribute('aria-expanded', 'true'); return; }
  panel.hidden = toggle.getAttribute('aria-expanded') !== 'true';
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  syncPanel();
});
narrow.addEventListener('change', syncPanel);
syncPanel();
window.addEventListener('popstate', () => { readUrl(); input.value = state.text; apply({ pushUrl: false }); });

/* Wait for the language pack before the first render. The filter panel picks
   one or two columns from how long the option names are, and that answer is
   different in every language. */
await whenReady();
apply({ pushUrl: false });
