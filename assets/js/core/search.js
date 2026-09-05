/* WorksheetHub — search and filtering.
   Section 19 of the plan asks for search that understands "fractions grade 6"
   without the user touching a filter. So the parser pulls structure out of the
   query first (grade, subject, topic, difficulty), and only what is left over
   is matched as free text. */

import { FAMILIES, AUTHORED, CUSTOM, countWhere } from '../data/exercises.js';
import { GRADES, SUBJECTS, TOPIC_MAP, DIFFICULTIES, QUESTION_TYPES } from '../data/catalog.js';
import { UNIT_META } from '../data/generated.js';

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

/**
 * Read a query the way the reader meant it.
 *
 * `parseQuery` is greedy: it turns any word it recognises into a hard filter.
 * That is right for "fractions grade 6" and badly wrong for "spanish empire",
 * which it read as the Spanish *language* plus the leftover word "empire" —
 * and then returned nothing, because no Spanish vocabulary worksheet mentions
 * empires. "french revolution" and "english civil war" failed the same way.
 *
 * The parser proposes and the catalogue disposes: if the parsed reading finds
 * nothing, the whole query is used as free text instead. That keeps the good
 * case (a filtered, precise result) and repairs the bad one, without the
 * parser having to guess which sense of "Spanish" someone meant.
 *
 * @returns {{ filters: object, parsed: boolean }} filters to search with, and
 *          whether the structured reading survived.
 */
export function resolveQuery(raw) {
  const parsed = parseQuery(raw);
  const filters = {
    grade: parsed.grade ?? null, level: parsed.level ?? null,
    subject: parsed.subject ?? null, topic: parsed.topic ?? null,
    difficulty: parsed.difficulty ?? null, type: parsed.type ?? null,
    text: parsed.text
  };
  const structured = Object.entries(filters).some(([k, v]) => k !== 'text' && v);
  if (!structured) return { filters: { ...filters, text: raw.trim() }, parsed: false };
  if (searchExercises(filters).total > 0) return { filters, parsed: true };
  return { filters: { text: raw.trim() }, parsed: false };
}

/* What a worksheet can be matched against, built per worksheet on first use.
   Doing this eagerly would mean concatenating and lower-casing a string for
   every one of twenty-five thousand sheets before the page could paint, to
   serve a search box most visitors never type into. Only worksheets whose
   questions are already in memory contribute their question text. */
const haystackCache = new Map();
function haystack(ex) {
  let entry = haystackCache.get(ex.id);
  if (entry === undefined) {
    /* Four separate fields, deliberately not concatenated.
       `keywords` is the unit's own vocabulary, and it is long — a couple of
       kilobytes. Joining it into a per-worksheet string copied it into all
       eighty thousand of them: 3.8 seconds to build and 740MB of heap, for a
       string that is identical across every family of the same unit. Held by
       reference it costs nothing, because every family of a unit points at the
       same one.

       `extra` is built only if the cheaper fields all miss, which is rare. */
    entry = {
      ex,
      title: fold(ex.title),
      summary: fold(ex.summary),
      keywords: ex.unit ? (UNIT_META[ex.unit]?.keywords ?? '') : '',
      extra: null
    };
    haystackCache.set(ex.id, entry);
  }
  return entry;
}

/* Accents are a spelling detail, not a meaning. "mise-en-scene" found nothing
   while the library said "mise-en-scène"; the same goes for café, Dalí and
   résumé. Both sides of every comparison are folded to unaccented lower case,
   once, at the point the index entry is built. */
const ASCII = /^[\x00-\x7F]*$/;
export const fold = s => {
  const v = String(s);
  /* normalize() is not cheap, and almost every string in the library is plain
     ASCII. Testing first keeps the index build the same speed it was before
     accents were handled at all. */
  return (ASCII.test(v) ? v : v.normalize('NFD').replace(/[\u0300-\u036f]/g, '')).toLowerCase();
};

/** Level, topic, subject and any question text already in memory. */
function extraOf(entry) {
  if (entry.extra === null) {
    const ex = entry.ex;
    entry.extra = fold([ex.level, ex.topic, ex.subject,
                        ...(ex.questions ?? []).map(q => `${q.prompt} ${q.math ?? ''}`)]
      .join(' '));
  }
  return entry.extra;
}

/* ------------------------------- word forms -------------------------------
   Searching for "cells" returned one worksheet and "cell" returned four
   thousand, because the match was a plain substring test and no title contains
   the word "cells". Nobody types the exact inflection a title happens to use,
   so both sides of the comparison are reduced to a stem first.

   This is deliberately a small suffix stripper rather than a real stemmer. It
   does not have to be linguistically right — it has to be the SAME on both
   sides, so "cells" and "cell" meet in the middle. It is conservative about
   short words, where chopping a letter changes the word ("gas", "bus", "is"). */
function stem(word) {
  const w = word.toLowerCase().replace(/[^a-z0-9'-]/g, '');
  if (w.length <= 3) return w;
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (/(?:ss|sh|ch|x|z)es$/.test(w)) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is')) return w.slice(0, -1);
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('ed') && w.length > 4 && !w.endsWith('eed')) return w.slice(0, -2);
  return w;
}

/**
 * How well one query word matches one worksheet, as a score.
 * Substring first, because that is what makes a half-typed word find things;
 * then the stem, which is what makes a plural find a singular. 0 means no
 * match at all, and one such word rules the worksheet out.
 */
/**
 * How well one query term matches one worksheet, as a score.
 *
 * A term is prepared once per search — its stem and truncated root — rather
 * than recomputed for each of seventy thousand families. Substring first,
 * because that is what makes a half-typed word find things; then the stem,
 * which is what makes a plural find a singular. 0 means no match at all, and
 * one such term rules the worksheet out.
 */
/* The keyword blob is one string per unit, shared by reference across every
   family of that unit — so a hundred and forty thousand families between them
   hold only about seven hundred distinct strings. Scanning each distinct
   string once per search instead of once per family is what keeps a one-word
   search fast as the library grows: "cell" went from 686ms to a fraction of
   that, and the cost no longer rises with the number of families. */
const KW_W = 1, KW_ALT = 2, KW_ST = 4, KW_ROOT = 8, KW_PLURAL = 16;
function keywordHits(term, keywords) {
  if (!keywords) return 0;
  let bits = term.kw.get(keywords);
  if (bits === undefined) {
    bits = 0;
    if (keywords.includes(term.w)) bits |= KW_W;
    if (term.alt && keywords.includes(term.alt)) bits |= KW_ALT;
    if (term.st && term.st.length > 3 && keywords.includes(term.st)) bits |= KW_ST;
    if (term.root && keywords.includes(term.root)) bits |= KW_ROOT;
    if (term.plural && keywords.includes(term.plural)) bits |= KW_PLURAL;
    term.kw.set(keywords, bits);
  }
  return bits;
}

function wordScore(entry, term) {
  const { w, st, root, alt, plural } = term;
  const kw = keywordHits(term, entry.keywords);
  if (entry.title.includes(w)) return 12;
  if (entry.summary.includes(w)) return 6;
  /* What the unit actually teaches. Ranked below the title and summary, so a
     worksheet named for the thing you searched for still comes first. */
  if (kw & KW_W) return 5;
  if (extraOf(entry).includes(w)) return 2;
  /* Hyphens are a spelling choice, not a meaning. The library says
     "transatlantic" and a teacher types "trans-atlantic"; neither is wrong and
     neither should return nothing. The joined form is tested at the same
     tiers, one point below the exact spelling. */
  if (alt) {
    if (entry.title.includes(alt)) return 11;
    if (entry.summary.includes(alt)) return 5;
    if (kw & KW_ALT) return 4;
    if (extraOf(entry).includes(alt)) return 2;
  }
  if (!st) return 0;
  /* Scored below an exact hit; these only decide whether a worksheet appears
     at all. "cells" finds Cell Structure and Cellular Respiration;
     "photosynthesise" finds photosynthesis. */
  if (st.length > 3) {
    if (entry.title.includes(st) || entry.summary.includes(st)) return 4;
    if (kw & KW_ST) return 4;
    if (extraOf(entry).includes(st)) return 3;
  }
  if (root && ((kw & KW_ROOT) || entry.title.includes(root)
               || entry.summary.includes(root) || extraOf(entry).includes(root))) return 2;
  /* Every stemming rule trims the end of a word, so the substring tests above
     already cover them — except -y → -ies, which rewrites. Searching "body"
     has to reach a worksheet that says "bodies", and no amount of trimming
     "body" produces "bodies". So that one form is spelled out and tested
     directly. An earlier version built a set of word stems per worksheet for
     this, which cost three and a half seconds on a one-word search. */
  if (plural && ((kw & KW_PLURAL) || entry.title.includes(plural)
                 || entry.summary.includes(plural) || extraOf(entry).includes(plural))) return 3;
  return 0;
}

/** Prepare the query once: the word, its stem, and a truncated root. */
function termsFrom(words) {
  return words.map(w => {
    const folded = fold(w);
    const st = stem(folded);
    const joined = folded.replace(/[-']/g, '');
    return {
      w: folded, st,
      root: st.length >= 7 ? st.slice(0, st.length - 2) : null,
      alt: joined !== folded && joined.length > 2 ? joined : null,
      plural: folded.endsWith('y') && folded.length > 3 ? `${folded.slice(0, -1)}ies` : null,
      /* One entry per distinct keyword blob, for the life of this search. */
      kw: new Map()
    };
  });
}

/**
 * Filter and rank the library.
 * @param {object} f  grade, level, subject, topic, difficulty, type, format,
 *                    length ('short'|'medium'|'long'), text, sort
 */
/* --------------------------------- facets --------------------------------- */
/**
 * One predicate per filter key, so the same rules drive both filtering and the
 * counts beside each option. Written once: a facet count that disagrees with
 * the filter it labels is worse than no count at all.
 */
/* One pass over the catalogue: the authored sheets, then the families. A
   family stands in for every sheet it holds, because they share every
   attribute anything here filters or sorts on. */
function* catalogue() {
  yield* AUTHORED;
  yield* CUSTOM;
  yield* FAMILIES;
}

/* One value per filter, tested against one worksheet. */
const IS = {
  grade:      (ex, v) => ex.grade === v,
  level:      (ex, v) => ex.level === v,
  subject:    (ex, v) => ex.subject === v,
  topic:      (ex, v) => ex.topic === v,
  difficulty: (ex, v) => ex.difficulty === v,
  type:       (ex, v) => ex.types.includes(v),
  format:     (ex, v) => v === 'online' ? !!ex.online : !!ex.printable,
  length:     (ex, v) => v === 'short' ? ex.count <= 7
                       : v === 'medium' ? ex.count > 7 && ex.count <= 12
                       : v === 'long' ? ex.count > 12 && ex.count <= 24
                       : ex.count > 24,
  pages:      (ex, v) => String(ex.pages ?? 1) === String(v),
  framework:  (ex, v) => ex.framework === v
};

/* A filter value may be one thing or several. Several means OR inside the
   group and AND between groups, which is what a reader expects: picking
   Biology and Chemistry widens the results, picking Biology and Grade 8
   narrows them. */
const anyOf = test => (ex, v) => Array.isArray(v) ? v.some(one => test(ex, one)) : test(ex, v);
const MATCH = Object.fromEntries(Object.entries(IS).map(([k, fn]) => [k, anyOf(fn)]));

export const FACET_KEYS = Object.keys(MATCH);

/** Is a filter actually set? An empty array is not a filter. */
export const isSet = v => Array.isArray(v) ? v.length > 0 : Boolean(v);

/** The chosen values of one filter, always as a list. */
export const valuesOf = v => Array.isArray(v) ? v : (v ? [v] : []);

function passesAll(ex, f, except = null) {
  for (const k of FACET_KEYS) {
    if (k === except || !isSet(f[k])) continue;
    if (!MATCH[k](ex, f[k])) return false;
  }
  return true;
}

/**
 * How many worksheets each filter option would return, counted in one pass.
 * An option under key K is counted when the worksheet passes every filter
 * except possibly K — which is what makes the numbers beside a group still
 * useful once you have chosen something in that same group.
 */
export function facetCounts(f = {}) {
  const text = (f.text ?? '').trim().toLowerCase();
  const terms = termsFrom(text ? text.split(/\s+/).filter(w => w.length > 1) : []);
  const out = Object.fromEntries(FACET_KEYS.map(k => [k, Object.create(null)]));
  let weight = 1;
  const bump = (k, v) => { out[k][v] = (out[k][v] ?? 0) + weight; };

  for (const ex of catalogue()) {
    weight = ex.sets ?? 1;
    if (terms.length && !matchesText(ex, terms)) continue;
    /* Which single filter, if any, this worksheet fails. */
    let failed = null, failures = 0;
    for (const k of FACET_KEYS) {
      if (!isSet(f[k])) continue;
      if (!MATCH[k](ex, f[k])) { failed = k; if (++failures > 1) break; }
    }
    if (failures > 1) continue;

    for (const k of FACET_KEYS) {
      if (failures === 1 && k !== failed) continue;
      if (k === 'grade') bump(k, ex.grade);
      else if (k === 'level') bump(k, ex.level);
      else if (k === 'subject') bump(k, ex.subject);
      else if (k === 'topic') bump(k, ex.topic);
      else if (k === 'difficulty') bump(k, ex.difficulty);
      else if (k === 'type') for (const t of ex.types) bump(k, t);
      else if (k === 'format') { if (ex.online) bump(k, 'online'); if (ex.printable) bump(k, 'printable'); }
      else if (k === 'length') bump(k, ex.count <= 7 ? 'short' : ex.count <= 12 ? 'medium' : ex.count <= 24 ? 'long' : 'xlong');
      else if (k === 'pages') bump(k, String(ex.pages ?? 1));
      else if (k === 'framework') { if (ex.framework) bump(k, ex.framework); }
    }
  }
  return out;
}

function matchesText(ex, terms) {
  const entry = haystack(ex);
  for (const t of terms) if (!wordScore(entry, t)) return false;
  return true;
}

export function searchExercises(f = {}) {
  const text = (f.text ?? '').trim().toLowerCase();
  const terms = termsFrom(text ? text.split(/\s+/).filter(w => w.length > 1) : []);

  const scored = [];
  for (const ex of catalogue()) {
    if (!passesAll(ex, f)) continue;

    let score = 0;
    if (terms.length) {
      const entry = haystack(ex);
      for (const t of terms) {
        const s = wordScore(entry, t);
        if (!s) { score = -1; break; }   // every word must appear somewhere
        score += s;
      }
      if (score < 0) continue;
    }
    if (ex.featured) score += 1;
    scored.push({ ex, score });
  }

  const sort = f.sort ?? (terms.length ? 'relevance' : 'recommended');
  const cmp = {
    relevance:  (a, b) => b.score - a.score || a.ex.title.localeCompare(b.ex.title),
    recommended:(a, b) => b.score - a.score || GRADES.findIndex(g => g.id === a.ex.grade) - GRADES.findIndex(g => g.id === b.ex.grade),
    title:      (a, b) => a.ex.title.localeCompare(b.ex.title),
    shortest:   (a, b) => a.ex.count - b.ex.count,
    longest:    (a, b) => b.ex.count - a.ex.count,
    easiest:    (a, b) => ['easy', 'medium', 'hard'].indexOf(a.ex.difficulty) - ['easy', 'medium', 'hard'].indexOf(b.ex.difficulty)
  }[sort] ?? cmp_default;
  function cmp_default(a, b) { return b.score - a.score; }

  const families = scored.sort(cmp).map(s => s.ex);

  /* The result is a lazy list. `total` counts every sheet in every matching
     family; `slice` expands only the ones about to be rendered. A search that
     matches half the library must not build half a million objects to say so. */
  let total = 0;
  for (const fam of families) total += fam.sets ?? 1;
  return {
    total,
    families,
    slice(offset, n) {
      const out = [];
      let seen = 0;
      for (const fam of families) {
        const sets = fam.sets ?? 1;
        if (seen + sets <= offset) { seen += sets; continue; }
        for (let i = Math.max(0, offset - seen); i < sets && out.length < n; i++) {
          out.push(fam.at ? fam.at(i) : fam);
        }
        seen += sets;
        if (out.length >= n) break;
      }
      return out;
    }
  };
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

export const FILTER_KEYS = ['grade', 'level', 'subject', 'topic', 'difficulty', 'type', 'format', 'length', 'pages', 'text', 'sort'];
export const TYPE_OPTIONS = QUESTION_TYPES;
