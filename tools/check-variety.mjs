/* How repetitive is a worksheet, really?

   Two sheets from the same family never share a question — the numbers are
   drawn from a different seed — and that is easy to measure and reassuring and
   beside the point. What a teacher sees is the *sentence*: twenty rows of
   "Divide. 96 ÷ 8 = ?" is one question printed twenty times, however carefully
   the numbers differ.

   So this counts shapes, not questions. A shape is the printed prompt with
   every number replaced by a hash. The headline number is shapes per sheet:
   how many genuinely different things a learner is asked in one sitting.

     node tools/check-variety.mjs            all subjects, worst first
     node tools/check-variety.mjs math       one subject, topic by topic
*/

globalThis.localStorage = { getItem: () => null, setItem() {} };

const { FAMILIES } = await import('../assets/js/data/exercises.js');
const { generateQuestions } = await import('../assets/js/data/generated.js');

const only = process.argv[2] ?? null;
const SHEETS_PER_GROUP = 24;

const shapeOf = q => `${q.prompt ?? ''} ¶ ${q.math ?? ''}`
  .replace(/-?\d+(\.\d+)?/g, '#').replace(/\s+/g, ' ').trim();

const groups = new Map();
const fams = FAMILIES.filter(f => !only || f.subject === only);
const stride = Math.max(1, Math.floor(fams.length / (only ? 1200 : 3000)));

for (let i = 0; i < fams.length; i += stride) {
  const fam = fams[i];
  const key = only ? fam.topic : fam.subject;
  const rec = groups.get(key) ?? { sheets: 0, questions: 0, perSheet: 0, shapes: new Set() };
  if (rec.sheets >= SHEETS_PER_GROUP) continue;
  const qs = generateQuestions(fam.at(0));
  if (!qs.length) continue;
  const here = new Set();
  for (const q of qs) { const s = shapeOf(q); rec.shapes.add(s); here.add(s); }
  rec.sheets++;
  rec.questions += qs.length;
  rec.perSheet += here.size / qs.length;
  groups.set(key, rec);
}

const rows = [...groups].map(([name, r]) => ({
  [only ? 'topic' : 'subject']: name,
  sheets: r.sheets,
  'shapes in the bank': r.shapes.size,
  'different per sheet': `${Math.round(r.perSheet / r.sheets * 100)}%`,
  ratio: r.perSheet / r.sheets
})).sort((a, b) => a.ratio - b.ratio);

const worst = rows[0];
for (const r of rows) delete r.ratio;
console.table(rows);
console.log('"different per sheet" is the share of rows on a sheet that ask something the sheet has not asked already.');

/* A floor, not a target. Maths sits lowest and always will — a drill is a
   drill — but the day a subject drops under this, someone has added a
   thousand worksheets that are all the same worksheet. */
const FLOOR = only ? 0.18 : 0.40;
const ratio = Number(String(worst[only ? 'different per sheet' : 'different per sheet']).replace('%', '')) / 100;
if (ratio < FLOOR) {
  console.error(`\n${worst[only ? 'topic' : 'subject']} repeats too much: ` +
    `${Math.round(ratio * 100)}% of its rows are new, and the floor is ${Math.round(FLOOR * 100)}%.`);
  process.exit(1);
}
