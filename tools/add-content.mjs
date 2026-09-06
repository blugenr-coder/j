/* Merge translated strings into a subject's content pack.

   Translation happens a few hundred strings at a time, from the queue that
   rank-content.mjs prints. This takes a JSON object of English → translation
   and folds it into the pack, keeping what is already there and sorting the
   result so the file stays readable and the diffs stay small.

     node tools/add-content.mjs es science batch.json

   A string mapped to itself is dropped rather than written: an untranslated
   stub in the pack is bytes on the wire that change nothing on the page, and
   it would let the coverage number be inflated by an empty file.
*/

import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { SUBJECTS } from '../assets/js/data/catalog.js';

const [lang, subjectId, batchPath] = process.argv.slice(2);
const subject = SUBJECTS.find(s => s.id === subjectId);
if (!subject || !lang || !batchPath) {
  console.error('Usage: node tools/add-content.mjs <lang> <subject-id> <batch.json>');
  console.error('Subjects: ' + SUBJECTS.map(s => s.id).join(', '));
  process.exit(1);
}

const path = `assets/js/i18n/content/${lang}/${subjectId}.js`;
const merged = existsSync(path) ? { ...(await import(`../${path}`)).DICT } : {};
const batch = JSON.parse(readFileSync(batchPath, 'utf8'));

let added = 0, changed = 0, skipped = 0;
for (const [en, translated] of Object.entries(batch)) {
  if (!translated || translated === en) { skipped++; continue; }
  if (merged[en] === undefined) added++;
  else if (merged[en] !== translated) changed++;
  merged[en] = translated;
}

const keys = Object.keys(merged).filter(k => merged[k] && merged[k] !== k).sort();
const body = keys.map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])},`).join('\n');

mkdirSync(dirname(path), { recursive: true });
writeFileSync(path, `/* ${subject.name} — worksheet content in ${lang}.
   Written by hand, merged by tools/add-content.mjs, ordered by
   tools/rank-content.mjs: the commonest strings on screen come first in the
   queue, not first in the file. Only real translations live here — a string
   mapped to itself would be bytes on the wire that change nothing. */

export const DICT = {
${body}
};
`);

console.log(`${path}: ${keys.length} strings (+${added} new, ${changed} revised, ${skipped} left alone)`);
