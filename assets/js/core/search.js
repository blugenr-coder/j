/* WorksheetHub — search and filtering.
   Section 19 of the plan asks for search that understands "fractions grade 6"
   without the user touching a filter. So the parser pulls structure out of the
   query first (grade, subject, topic, difficulty), and only what is left over
   is matched as free text. */

import { EXERCISES } from '../data/exercises.js';
import { GRADES, SUBJECTS, TOPIC_MAP, DIFFICULTIES, QUESTION_TYPES } from '../data/catalog.js';

/* Level words the parser understands, mapped to {grade band, level}. */
const LEVEL_WORDS = (() => {
  const map = new Map();
  for (const g of GRADES) {
    for (const level of g.levels) {
      const key = level.toLowerCase();
      map.set(key, { grade: g.id, level });
      const num = key.match(/^grade (\d+)$/);
      if (num) {
        map.set(`g${num[1]}`, { grade: g.id, level });
        map.set(`${num[1]}th`, { grade: g.id, level });
        map.set(`year ${num[1]}`, { grade: g.id, level });
      }
    }
    map.set(g.name.toLowerCase(), { grade: g.id, level: null });
  }
  map.set('prek', { grade: 'early', level: 'Pre-K' });
  map.set('pre-k', { grade: 'early', level: 'Pre-K' });
  map.set('pre k', { grade: 'early', level: 'Pre-K' });
  map.set('kinder', { grade: 'early', level: 'Kindergarten' });
  map.set('elementary', { grade: 'elementary', level: null });
  map.set('primary', { grade: 'elementary', level: null });
  map.set('middle', { grade: 'middle', level: null });
  map.set('high school', { grade: 'high', level: null });
  map.set('highschool', { grade: 'high', level: null });
  map.set('college', { grade: 'advanced', level: 'College' });
  map.set('university', { grade: 'advanced', level: 'College' });
  return map;
})();

const SUBJECT_WORDS = (() => {
  const map = new Map();
  for (const s of SUBJECTS) {
    map.set(s.name.toLowerCase(), s.id);
    map.set(s.id, s.id);
  }
  /* Everyday names people actually type. */
  Object.entries({
    maths: 'math', math: 'math', mathematics: 'math', algebra: 'math',
    english: 'ela', 'language arts': 'ela', ela: 'ela',
    science: 'science', biology: 'science', chemistry: 'science', physics: 'science',
    history: 'social', geography: 'social', 'social studies': 'social',
    spanish: 'languages', french: 'languages', german: 'languages',
    coding: 'cs', programming: 'cs', python: 'cs', 'computer science': 'cs'
  }).forEach(([k, v]) => map.set(k, v));
  return map;
})();

const TOPIC_WORDS = (() => {
  const map = new Map();
  for (const [id, t] of Object.entries(TOPIC_MAP)) {
    map.set(t.name.toLowerCase(), id);
    map.set(id, id);
  }
  return map;
})();

const DIFF_WORDS = new Map(DIFFICULTIES.map(d => [d.name.toLowerCase(), d.id]));

/**
 * Pull filters out of a natural query.
 * "fractions grade 6" -> { grade:'middle', level:'Grade 6', topic:'fractions', text:'' }
 */
export function parseQuery(input) {
  let q = ` ${String(input || '').toLowerCase().replace(/\s+/g, ' ').trim()} `;
  const found = { grade: null, level: null, subject: null, topic: null, difficulty: null };

  const take = (phrase, apply) => {
    const needle = ` ${phrase} `;
    const idx = q.indexOf(needle);
    if (idx === -1) return false;
    q = q.slice(0, idx) + ' ' + q.slice(idx + needle.length - 1);
    apply();
    return true;
  };

  /* Longest phrases first so "high school" wins over "high". */
  const phrasesBy = map => [...map.keys()].sort((a, b) => b.length - a.length);

  for (const p of phrasesBy(LEVEL_WORDS)) {
    if (found.grade) break;
    take(p, () => {
      const hit = LEVEL_WORDS.get(p);
      found.grade = hit.grade;
      found.level = hit.level;
    });
  }
  for (const p of phrasesBy(TOPIC_WORDS)) {
    if (found.topic) break;
    take(p, () => {
      found.topic = TOPIC_WORDS.get(p);
      found.subject ??= TOPIC_MAP[found.topic].subject;
    });
  }
  for (const p of phrasesBy(SUBJECT_WORDS)) {
    if (found.subject) break;
    take(p, () => { found.subject = SUBJECT_WORDS.get(p); });
  }
  for (const p of phrasesBy(DIFF_WORDS)) {
    if (found.difficulty) break;
    take(p, () => { found.difficulty = DIFF_WORDS.get(p); });
  }

  return { ...found, text: q.replace(/\b(worksheet|worksheets|exercise|exercises|practice|for|in|on|the)\b/g, '').replace(/\s+/g, ' ').trim() };
}

/* Everything an exercise can be matched against, built once. */
const HAYSTACK = new Map(EXERCISES.map(ex => [
  ex.id,
  [ex.title, ex.summary, ex.level, ex.topic, ex.subject,
   ...ex.questions.map(q => `${q.prompt} ${q.math ?? ''}`)].join(' ').toLowerCase()
]));

/**
 * Filter and rank the library.
 * @param {object} f  grade, level, subject, topic, difficulty, type, format,
 *                    length ('short'|'medium'|'long'), text, sort
 */
export function searchExercises(f = {}) {
  const text = (f.text ?? '').trim().toLowerCase();
  const words = text ? text.split(/\s+/).filter(w => w.length > 1) : [];

  const scored = [];
  for (const ex of EXERCISES) {
    if (f.grade && ex.grade !== f.grade) continue;
    if (f.level && ex.level !== f.level) continue;
    if (f.subject && ex.subject !== f.subject) continue;
    if (f.topic && ex.topic !== f.topic) continue;
    if (f.difficulty && ex.difficulty !== f.difficulty) continue;
    if (f.type && !ex.types.includes(f.type)) continue;
    if (f.format === 'online' && !ex.online) continue;
    if (f.format === 'printable' && !ex.printable) continue;
    if (f.length === 'short'  && ex.count > 7) continue;
    if (f.length === 'medium' && (ex.count <= 7 || ex.count > 10)) continue;
    if (f.length === 'long'   && ex.count <= 10) continue;

    let score = 0;
    if (words.length) {
      const hay = HAYSTACK.get(ex.id);
      const title = ex.title.toLowerCase();
      for (const w of words) {
        if (title.includes(w)) score += 12;
        else if (ex.summary.toLowerCase().includes(w)) score += 6;
        else if (hay.includes(w)) score += 2;
        else { score = -1; break; }   // every word must appear somewhere
      }
      if (score < 0) continue;
    }
    if (ex.featured) score += 1;
    scored.push({ ex, score });
  }

  const sort = f.sort ?? (words.length ? 'relevance' : 'recommended');
  const cmp = {
    relevance:  (a, b) => b.score - a.score || a.ex.title.localeCompare(b.ex.title),
    recommended:(a, b) => b.score - a.score || GRADES.findIndex(g => g.id === a.ex.grade) - GRADES.findIndex(g => g.id === b.ex.grade),
    title:      (a, b) => a.ex.title.localeCompare(b.ex.title),
    shortest:   (a, b) => a.ex.count - b.ex.count,
    longest:    (a, b) => b.ex.count - a.ex.count,
    easiest:    (a, b) => ['easy', 'medium', 'hard'].indexOf(a.ex.difficulty) - ['easy', 'medium', 'hard'].indexOf(b.ex.difficulty)
  }[sort] ?? cmp_default;
  function cmp_default(a, b) { return b.score - a.score; }

  return scored.sort(cmp).map(s => s.ex);
}

/** Suggestions for the search box: exercises, then topics that exist. */
export function suggest(input, limit = 6) {
  const text = String(input || '').trim().toLowerCase();
  if (text.length < 2) return [];
  const parsed = parseQuery(text);
  const out = searchExercises({ ...parsed }).slice(0, limit)
    .map(ex => ({ kind: 'exercise', id: ex.id, label: ex.title, sub: `${ex.level} · ${TOPIC_MAP[ex.topic]?.name ?? ex.topic}` }));

  if (out.length < limit) {
    for (const [id, t] of Object.entries(TOPIC_MAP)) {
      if (out.length >= limit) break;
      if (t.name.toLowerCase().includes(text)) {
        out.push({ kind: 'topic', id, label: t.name, sub: 'Topic' });
      }
    }
  }
  return out;
}

export const FILTER_KEYS = ['grade', 'level', 'subject', 'topic', 'difficulty', 'type', 'format', 'length', 'text', 'sort'];
export const TYPE_OPTIONS = QUESTION_TYPES;
