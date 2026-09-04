/* Every page must actually render something. Catches the failure mode where a
   page loads without errors but a container is empty or full of "[object
   HTMLDivElement]" because an array reached an API that wanted varargs.
   Start a static server first, then: node tools/check-render.mjs [baseUrl] */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:8099';

/* path → selectors that must contain at least one element. */
const PAGES = [
  ['index.html',                      ['#grade-cards .card', '#subject-cards .subject-row-card', '#featured-cards .ex-card', '#trust-stats .stat']],
  ['grades.html',                     ['#grade-cards .card', '#level-groups .chip']],
  ['subjects.html',                   ['#subject-cards .subject-row-card']],
  ['subjects.html?subject=science',   ['#topic-cards .card', '#subject-exercises .ex-card']],
  ['library.html',                    ['#results .ex-card', '#filter-groups .facet', '#filter-groups .filter-group']],
  ['library.html?grade=high',         ['#results .ex-card']],
  ['how-it-works.html',               ['#type-list .row']],
  ['join.html',                       ['#join-form']],
  ['signin.html',                     ['#grade option', '#role-choice .chip']],
  ['exercise.html?id=ancient-rome',   ['#gate-tags .badge', '.mode-choice .mode-option']],
  ['exercise.html?id=fractions-grade-6-simplifying&mode=online',
                                      ['#qnav button', '#question-card .question-prompt']],
  ['exercise.html?id=ancient-rome&mode=online', ['#qnav button', '#question-card .question-prompt', '#tips-list li']],
  ['print.html?id=ancient-rome',      ['.sheet', '.q-print', '.key-item']],
  ['dashboard.html',                  ['#stats .stat', '#recommended .ex-card', '.side-nav a']],
  ['progress.html',                   ['#stats .stat', '#day-chart', '.side-nav a']],
  ['favorites.html',                  ['.side-nav a']],
  ['achievements.html',               ['#ach-grid .achievement', '#ach-progress .donut']],
  ['settings.html',                   ['#data-summary .list-item', '#theme-choice .chip']],
  ['404.html',                        ['#nf-form']],
  ['teacher/index.html',              ['#t-stats .stat', '#class-list .list-item', '#hardest-list .list-item', '#suggested .ex-card']],
  ['teacher/create.html',             ['#f-class option', '#match-list button']],
  ['teacher/classes.html',            ['#class-list .class-card', '#c-level option']],
  ['teacher/analytics.html',          ['#a-stats .stat', '#hardest .list-item', '#question-bars .row', '#student-rows tr']],
  ['teacher/builder.html',            ['#add-buttons .chip', '#e-level option']]
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
await ctx.route('**://fonts.googleapis.com/**', r => r.abort());
await ctx.route('**://fonts.gstatic.com/**', r => r.abort());
/* A real teacher account: a class, an assignment, and one submission that
   actually came back. The teacher pages used to be seeded with invented
   students so they always had something to draw; now they show what happened,
   so the check has to make something happen. */
await ctx.addInitScript(() => {
  try {
    const answers = {};
    for (let i = 1; i <= 12; i++) answers[`q${i}`] = { correct: i % 3 !== 0 };
    localStorage.setItem('worksheethub:v1', JSON.stringify({
      user: { name: 'Ana Ruiz', role: 'student', grade: 'middle', initials: 'AR', since: Date.now() },
      teacher: {
        classes: [{
          id: 'c-check', name: 'Grade 8B — Mathematics', level: 'Grade 8', grade: 'middle',
          subject: 'math', code: 'ABC-123', created: Date.now(), archived: false,
          students: [{ id: 'stu-1', name: 'Marcus Bell', joinedAt: Date.now(), source: 'added' }],
          exerciseIds: ['linear-equations']
        }],
        assignments: [{
          id: 'a-check', code: 'XYZ-789', classId: 'c-check',
          exerciseId: 'linear-equations', worksheetIds: ['linear-equations'],
          title: null, due: null, note: null, created: Date.now()
        }]
      },
      submissions: {
        'a-check': { 'stu-1': { 'linear-equations': { correct: 8, total: 12, answers, at: Date.now() } } }
      }
    }));
  } catch {}
});
const page = await ctx.newPage();

let fail = 0;
for (const [path, selectors] of PAGES) {
  const problems = [];
  const errors = [];
  page.removeAllListeners('pageerror');
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(`${BASE}/${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  for (const sel of selectors) {
    if (await page.locator(sel).count() === 0) problems.push(`nothing matched ${sel}`);
  }

  /* Anything marked hidden must actually be gone: a class that sets `display`
     outranks the attribute, which once left the whole player on screen
     underneath a "not found" message. */
  const leaked = await page.locator('[hidden]').evaluateAll(
    els => els.filter(e => e.offsetParent !== null || e.getClientRects().length > 0)
              .map(e => e.id || e.className || e.tagName));
  for (const l of leaked) problems.push(`element marked hidden is still visible: ${l}`);

  /* The tell-tale of an array where a node was expected. */
  const body = await page.locator('body').innerText();
  if (body.includes('[object ')) problems.push('page contains a stringified object');
  if (body.includes('undefined,') || /\bNaN\b/.test(body)) problems.push('page contains undefined or NaN');
  for (const e of errors) problems.push(`page error: ${e}`);

  console.log(`${problems.length ? '✗' : '✓'} ${path}`);
  for (const p of problems) { console.log(`    ${p}`); fail++; }
}

await browser.close();
console.log(fail ? `\n${fail} problem(s).` : '\nEvery page rendered its content.');
process.exit(fail ? 1 : 0);
