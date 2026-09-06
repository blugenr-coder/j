/* Interface translation.
   The app renders everything through the DOM helpers, so translation works on
   the rendered text rather than on keys sprinkled through the markup: a
   dictionary maps the English string to its translation, a walker replaces
   matching text nodes and attributes, and an observer catches anything a page
   script renders afterwards.

   That choice is deliberate. Keys in the markup would have meant touching
   every element in twenty-one pages, and would still have missed the strings
   built in JavaScript — which is most of them. Matching on the source text
   costs one dictionary lookup per text node and covers both.

   What is translated: the interface. What is not: the worksheets themselves.
   A Spanish reading of a chemistry question is a translation job with a right
   and a wrong answer, and inventing one would make the answer key wrong. The
   language units are the exception — they are already in their own language. */

import { STORAGE_KEY } from './storage-key.js';

export const LANGUAGES = [
  { code: 'en', name: 'English',    native: 'English',    dir: 'ltr' },
  { code: 'es', name: 'Spanish',    native: 'Español',    dir: 'ltr' },
  { code: 'fr', name: 'French',     native: 'Français',   dir: 'ltr' },
  { code: 'de', name: 'German',     native: 'Deutsch',    dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', native: 'Português',  dir: 'ltr' },
  { code: 'it', name: 'Italian',    native: 'Italiano',   dir: 'ltr' }
];

/* Never `value`: an <option value="Grade 8"> is what the filters match on, and
   translating it would break the filter it labels. The visible text of the
   option is a text node and gets translated on its own. */
const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
let active = null;          // { code, dict: Map, patterns: [] }
let observer = null;

/* ------------------------------ preference ------------------------------ */
export function currentLanguage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved = raw ? JSON.parse(raw).language : null;
    if (saved && LANGUAGES.some(l => l.code === saved)) return saved;
  } catch { /* storage may be unavailable; English is the fallback */ }
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return LANGUAGES.some(l => l.code === nav) ? nav : 'en';
}

function remember(code) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const state = raw ? JSON.parse(raw) : {};
    state.language = code;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* nothing to do: the page still switches for this visit */ }
}

/* ------------------------------ translation ------------------------------ */
/** Translate one string, or return it unchanged. */
/**
 * Substitute a pattern's captured groups into its template.
 * `$1` inserts the group as it was captured; `$1!` looks the group up in the
 * dictionary first, which is what lets one pattern cover a sentence whose
 * subject is itself a translatable phrase.
 */
function fill(template, m) {
  return template.replace(/\$(\d)(!?)/g, (_, i, deep) => {
    const raw = m[Number(i)] ?? '';
    if (!deep) return raw;
    return active.dict.get(raw.trim()) ?? raw;
  });
}

export function t(text) {
  if (!active || typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (trimmed.length < 2) return text;
  /* Markup wraps long sentences across lines, so the text node carries the
     indentation with it. The dictionary is written with single spaces. */
  const key = trimmed.replace(/\s+/g, ' ');
  const hit = active.dict.get(key) ?? active.dict.get(trimmed);
  if (hit !== undefined) return text.replace(trimmed, hit);

  for (const [re, one, many] of active.patterns) {
    const m = key.match(re);
    if (!m) continue;
    return text.replace(trimmed, fill((many && m[1] !== '1') ? many : one, m));
  }

  /* Composed lines — "Grade 8 · 12 questions · medium", "Elementary — Grades
     1–5" — are not in the dictionary as a whole, but each part is. */
  for (const sep of [' · ', ' — ']) {
    if (!key.includes(sep)) continue;
    const done = key.split(sep).map(one_ => {
      const hit2 = active.dict.get(one_);
      if (hit2 !== undefined) return hit2;
      for (const [re, one, many] of active.patterns) {
        const m = one_.match(re);
        if (!m) continue;
        return fill((many && m[1] !== '1') ? many : one, m);
      }
      return one_;
    });
    const joined = done.join(sep);
    if (joined !== key) return text.replace(trimmed, joined);
  }
  return text;
}

/* The English a node started with, so a later dictionary can be applied to
   the source rather than to a half-translated sentence. A WeakMap, so a node
   removed from the document takes its entry with it. */
const SOURCE = new WeakMap();

function translateTree(root) {
  if (!active || !root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      const tag = parent?.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
      /* `translate="no"` is the standard opt-out. The brand name uses it: a
         product name is not a word to be looked up. */
      if (parent?.closest('[translate="no"]')) return NodeFilter.FILTER_REJECT;
      return node.textContent.trim().length > 1
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);
  for (const n of nodes) {
    /* Translate from the ORIGINAL text, not from whatever is on the node now.
       Content packs arrive after the first pass, and a second pass over
       already-translated text can match nothing — the sentence is in the new
       language with an English term still embedded in it, which is exactly
       the shape no pattern is written for. Keeping the source means a
       dictionary that grows later applies retroactively. */
    const source = SOURCE.get(n) ?? n.textContent;
    const next = t(source);
    if (next !== n.textContent) {
      if (next !== source) SOURCE.set(n, source);
      n.textContent = next;
    }
  }

  const scope = root.nodeType === 1 ? [root, ...root.querySelectorAll('*')] : [...root.querySelectorAll('*')];
  for (const el of scope) {
    if (!el.getAttribute) continue;
    if (el.closest?.('[translate="no"]')) continue;
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (!v) continue;
      const key = `${a}:${v}`;
      const source = SOURCE.get(el)?.get(a) ?? v;
      const next = t(source);
      if (next !== v) {
        if (next !== source) {
          const map = SOURCE.get(el) ?? new Map();
          map.set(a, source);
          SOURCE.set(el, map);
        }
        el.setAttribute(a, next);
      }
    }
  }
}

/* Anything a page script renders after load gets the same treatment. */
function watch() {
  if (observer || typeof MutationObserver === 'undefined') return;
  observer = new MutationObserver(records => {
    if (!active) return;
    observer.disconnect();
    for (const r of records) {
      for (const node of r.addedNodes) {
        if (node.nodeType === 1) translateTree(node);
        else if (node.nodeType === 3) {
          const next = t(node.textContent);
          if (next !== node.textContent) node.textContent = next;
        }
      }
    }
    observer.observe(document.body, { childList: true, subtree: true });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ----------------------------- content packs -----------------------------
   The interface is a few hundred strings and ships with the language. The
   worksheet *content* — every term, definition and statement in 715 units —
   is 36,000 strings per language, which is far too much to load on a page
   that may never show a worksheet.

   So content is split per subject and fetched only when a page is about to
   show that subject. Merging it into the same dictionary is all that is
   needed: translation already works by matching source text, so an answer
   option is translated by the same path as a button label, with no change to
   the generator that produced it. */
const contentLoaded = new Set();

/**
 * Load the content dictionary for one subject, then re-translate the page.
 * Safe to call repeatedly and safe to call when there is no pack: a subject
 * that has not been translated yet simply leaves its content in English
 * rather than failing.
 */
export async function loadContent(subject) {
  if (!subject) return false;
  /* A page calls this while it renders, which is before initLanguage() has
     finished fetching the pack — so without this wait `active` is still null,
     the call returns immediately, and the content is silently never loaded.
     That failure looks exactly like a missing translation. */
  await whenReady();
  if (!active) return false;
  const key = `${active.code}/${subject}`;
  if (contentLoaded.has(key)) return true;
  contentLoaded.add(key);
  try {
    const mod = await import(`../i18n/content/${active.code}/${subject}.js`);
    for (const [en, translated] of Object.entries(mod.DICT ?? {})) {
      if (!active.dict.has(en)) active.dict.set(en, translated);
    }
    if (document.body) translateTree(document.body);
    return true;
  } catch {
    /* No pack for this subject yet. Not an error: the content stays English
       and every other language feature keeps working. */
    return false;
  }
}

/* -------------------------------- loading -------------------------------- */
const loaded = new Map();

async function load(code) {
  if (code === 'en') return null;
  if (loaded.has(code)) return loaded.get(code);
  try {
    const mod = await import(`../i18n/${code}.js`);
    const pack = {
      code,
      dict: new Map(Object.entries(mod.DICT ?? {})),
      patterns: (mod.PATTERNS ?? []).map(([re, one, many]) => [new RegExp(re), one, many])
    };
    loaded.set(code, pack);
    return pack;
  } catch {
    /* A missing or broken pack must not take the page down with it. */
    return null;
  }
}

/**
 * Apply a language to the whole document and remember the choice.
 * Switching to English reloads, because a translated page cannot be turned
 * back into English by looking words up — the dictionary only runs one way.
 */
export async function setLanguage(code, { reload = true } = {}) {
  remember(code);
  const lang = LANGUAGES.find(l => l.code === code) ?? LANGUAGES[0];
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.dir;
  if (reload) { location.reload(); return; }
  active = await load(code);
  if (active) { translateTree(document.body); watch(); }
}

/* The pack loads over the network, so anything whose *layout* depends on the
   translated text — not just its content — has to wait for it. `whenReady()`
   is that wait; the MutationObserver covers everything else. */
let ready = null;
export function whenReady() { return ready ?? Promise.resolve(); }

/** Called once by the shell, before anything is rendered. */
export function initLanguage() {
  ready = start();
  return ready;
}

async function start() {
  const code = currentLanguage();
  const lang = LANGUAGES.find(l => l.code === code) ?? LANGUAGES[0];
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.dir;
  if (code === 'en') return;
  active = await load(code);
  if (!active) return;
  translateTree(document.body);
  watch();
}
