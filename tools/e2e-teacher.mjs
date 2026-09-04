/* End-to-end check of the teacher flows.
   Start a static server first, then: node tools/e2e-teacher.mjs [baseUrl] */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:8099';
let pass = 0, fail = 0;
const ok = (label, cond) => { cond ? pass++ : fail++; console.log(`${cond ? '✓' : '✗'} ${label}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await ctx.route('**://fonts.googleapis.com/**', r => r.abort());
await ctx.route('**://fonts.gstatic.com/**', r => r.abort());
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));

const open = async (path) => {
  await page.goto(`${BASE}/${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
};

/* ------------------------------ become a teacher ------------------------------ */
await open('signin.html');
await page.fill('#name', 'Sam Ortega');
await page.click('button[data-role="teacher"]');
await page.click('button[type="submit"]');
await page.waitForTimeout(500);
ok('signing in as a teacher lands on the teacher tools', page.url().includes('teacher/index.html'));
ok('teacher visual mode is applied',
  await page.evaluate(() => document.documentElement.dataset.mode === 'teacher'));

/* -------------------------------- analytics -------------------------------- */
/* A teacher account starts empty and says so. Nothing on this page is invented
   for the sake of having something to draw. */
await open('teacher/analytics.html');
ok('an empty teacher account says there is nothing to show yet',
  (await page.locator('#sample-note').innerText()).toLowerCase().includes('class'));
ok('no student rows are invented before anyone hands work in',
  await page.locator('#student-rows tr').count() === 0);

/* Now give it something real: a class, work set to it, and one submission. */
await page.evaluate(() => {
  const raw = JSON.parse(localStorage.getItem('worksheethub:v1') ?? '{}');
  const answers = {};
  for (let i = 1; i <= 12; i++) answers[`q${i}`] = { correct: i % 4 !== 0 };
  const answers2 = {};
  for (let i = 1; i <= 12; i++) answers2[`q${i}`] = { correct: i % 3 !== 0 };
  raw.teacher = {
    classes: [{
      id: 'c-e2e', name: 'Grade 8B — Mathematics', level: 'Grade 8', grade: 'middle',
      subject: 'math', code: 'ABC-123', created: Date.now(), archived: false,
      students: [{ id: 's1', name: 'Marcus Bell' }, { id: 's2', name: 'Leila Haddad' }],
      exerciseIds: ['linear-equations']
    }],
    assignments: [{
      id: 'a-e2e', code: 'XYZ-789', classId: 'c-e2e', exerciseId: 'linear-equations',
      worksheetIds: ['linear-equations'], title: null, due: null, note: null, created: Date.now()
    }]
  };
  raw.submissions = {
    'a-e2e': {
      s1: { 'linear-equations': { correct: 9, total: 12, answers, at: Date.now() } },
      s2: { 'linear-equations': { correct: 8, total: 12, answers: answers2, at: Date.now() } }
    }
  };
  localStorage.setItem('worksheethub:v1', JSON.stringify(raw));
});

await open('teacher/analytics.html');
const hardest = await page.locator('#hardest .list-item').allInnerTexts();
ok('the hardest questions are listed with their prompts', hardest.length === 3 && hardest[0].includes('Question'));
const percents = await page.locator('#hardest .tile-icon').allInnerTexts();
const nums = percents.map(p => parseInt(p, 10));
ok('hardest questions are ordered worst first', nums.every((n, i) => i === 0 || nums[i - 1] <= n));
ok('only the students who handed work in have a row',
  await page.locator('#student-rows tr').count() === 2);

/* Results must be stable across reloads, or a teacher cannot trust them. */
const before = await page.locator('#student-rows').innerText();
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(400);
ok('results are stable across reloads',
  before === await page.locator('#student-rows').innerText());

/* ------------------------- create and share an assignment ------------------------- */
await open('teacher/create.html');
await page.selectOption('#f-subject', 'math');
await page.waitForTimeout(200);
await page.locator('#match-list button').first().click();
await page.waitForTimeout(250);
await page.fill('#f-title', 'Friday homework');
await page.click('#create-btn');
await page.waitForSelector('#result-card .code-display');
const code = (await page.locator('.code-display').innerText()).trim();
ok('an assignment code is generated in XXX-XXX form', /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(code));

/* The join flow itself is covered in full by tools/e2e-classes.mjs; here we
   only check the code field's formatting behaviour. */
await open('join.html');
await page.fill('#code', code.replace('-', ''));
ok('the code field formats itself as you type', (await page.inputValue('#code')) === code);

/* -------------------------------- the builder -------------------------------- */
await open('teacher/builder.html');
await page.click('#save-btn');
await page.waitForTimeout(200);
ok('saving an empty exercise is refused with a reason',
  (await page.locator('.toast').innerText()).includes('title'));

await page.fill('#e-title', 'Two-step equations');
await page.click('#add-buttons button:has-text("Math input")');
await page.waitForTimeout(150);
await page.locator('#question-editors input').nth(0).fill('Solve for x');
await page.locator('#question-editors input').nth(1).fill('5x + 5 = 30');
await page.locator('#question-editors input').nth(2).fill('5');
await page.click('#save-btn');
await page.waitForTimeout(300);
ok('a valid custom exercise saves', (await page.locator('#saved-list').innerText()).includes('Two-step equations'));

/* A saved exercise must be a real library citizen: searchable, playable, printable. */
await open('library.html?text=two-step');
ok('the custom worksheet appears in the library',
  (await page.locator('#results').innerText()).includes('Two-step equations'));

await page.locator('#results a:has-text("Start")').first().click();
await page.waitForTimeout(600);
ok('a fresh exercise asks online-or-printable before starting',
  await page.locator('#mode-gate').isVisible());
await page.click('#gate-online');
await page.waitForTimeout(500);
await page.fill('.input-blank', '5');
await page.click('button:has-text("Check answer")');
await page.waitForSelector('.feedback.ok');
ok('the custom exercise plays and marks like any other', true);

const exId = new URL(page.url()).searchParams.get('id');
await open(`print.html?id=${exId}`);
const sheetText = await page.locator('#sheets').innerText();
ok('the custom exercise prints with a worksheet and a key',
  sheetText.includes('Two-step equations') && sheetText.includes('Answer key'));

ok('no uncaught page errors', errors.length === 0);
if (errors.length) console.log(errors);

await browser.close();
console.log(`\n${pass} passed, ${fail} failed.`);
process.exit(fail ? 1 : 0);
