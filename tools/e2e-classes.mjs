/* End-to-end check of the class system: a teacher creates a class and sets
   work, a student joins and does it, and the result reaches the teacher.
   Start a static server first, then: node tools/e2e-classes.mjs [baseUrl] */

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

/* ----------------------------- teacher creates ----------------------------- */
await open('signin.html');
await page.fill('#name', 'Sam Ortega');
await page.click('button[data-role="teacher"]');
await page.click('button[type="submit"]');
await page.waitForTimeout(500);

await open('teacher/classes.html');
const before = await page.locator('.class-card').count();
await page.click('#new-class-btn');
await page.fill('#c-name', 'Grade 8 Maths — Period 3');
await page.selectOption('#c-level', 'Grade 8');
await page.selectOption('#c-subject', 'math');
await page.click('#create-class-btn');
await page.waitForTimeout(600);
ok('creating a class adds it to the list', await page.locator('.class-card').count() === before + 1);

const card = page.locator('.class-card').first();
ok('the new class is first and named correctly',
  (await card.locator('h3').innerText()).includes('Period 3'));
const code = (await card.locator('.class-stats .mono').innerText()).trim();
ok('the class has a join code in XXX-XXX form', /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(code));

/* --------------------------- roster and assignment --------------------------- */
await card.locator('a:has-text("Open")').click();
await page.waitForTimeout(700);
ok('the class page opens on its own URL', page.url().includes('teacher/class.html?id='));
const classUrl = page.url();

await page.fill('#student-name', 'Ana Ruiz');
await page.click('#add-student');
await page.waitForTimeout(300);
await page.fill('#student-name', 'Tom Novak');
await page.click('#add-student');
await page.waitForTimeout(400);
ok('students can be added to the roster', await page.locator('#roster .list-item').count() === 2);

await page.click('#set-work');
await page.waitForTimeout(800);
ok('setting work opens with this class preselected',
  (await page.locator('#f-class option:checked').innerText()).includes('Period 3'));
/* The list must be narrowed to what this class could actually be set. */
const offered = await page.locator('#match-list .list-sub').allInnerTexts();
ok('the worksheets offered match the class level',
  offered.length > 0 && offered.every(t => t.startsWith('Grade 8')));

/* Pick two worksheets — an assignment is a set, not one sheet. */
await page.locator('#match-list button').nth(0).click();
await page.waitForTimeout(200);
await page.locator('#match-list button').nth(1).click();
await page.waitForTimeout(300);
ok('two worksheets can be selected at once',
  await page.locator('#selected-strip .chip').count() === 2);
ok('the button reflects how many are being set',
  (await page.locator('#create-btn').innerText()).includes('Set 2 worksheets'));

await page.fill('#f-title', 'Friday homework');
await page.fill('#f-due', '2026-12-11');
await page.click('#create-btn');
await page.waitForSelector('#result-card .code-display');
ok('the assignment lists every worksheet it set',
  (await page.locator('#result-card ul li').count()) === 2);

await page.goto(classUrl, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
ok('the assignment appears on the class page',
  (await page.locator('#assignment-list').innerText()).includes('Friday homework'));
ok('the progress grid lists both students',
  await page.locator('#matrix tbody tr').count() === 2);

/* -------------------------------- student -------------------------------- */
await open('signin.html');
await page.fill('#name', 'Ana Ruiz');
await page.click('button[data-role="student"]');
await page.click('button[type="submit"]');
await page.waitForTimeout(500);

await open('join.html');
await page.fill('#code', code.replace('-', ''));
await page.fill('#student-name', 'Ana Ruiz');
await page.click('button[type="submit"]');
await page.waitForTimeout(700);
ok('joining with the code adds the class',
  (await page.locator('#my-classes').innerText()).includes('Period 3'));
ok('the joined class shows the work that was set',
  (await page.locator('#my-classes').innerText()).includes('Friday homework'));

await open('join.html');
await page.fill('#code', 'ZZZZZZ');
await page.fill('#student-name', 'Ana Ruiz');
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
ok('an unknown code is refused with an explanation',
  !(await page.locator('#join-error').isHidden()));

await open('dashboard.html');
ok('assigned work appears on the dashboard',
  !(await page.locator('#assigned').isHidden()) &&
  (await page.locator('#assigned').innerText()).includes('Friday homework'));
ok('the due date is shown', (await page.locator('#assigned').innerText()).includes('2026-12-11'));

/* -------------------------- doing the assigned work -------------------------- */
await page.locator('#assigned-list .list-item').first().click();
await page.waitForTimeout(900);
ok('opening assigned work announces the assignment',
  (await page.locator('#main').innerText()).includes('Set as an assignment'));

/* Answer everything using the worksheet's own key, then finish. */
const answered = await page.evaluate(async () => {
  const params = new URL(location.href).searchParams;
  const m = await import('/assets/js/data/exercises.js');
  const ex = m.getExercise(params.get('id'));
  return ex.questions.length;
});
for (let i = 0; i < answered; i++) {
  const val = await page.evaluate(async (i) => {
    const m = await import('/assets/js/data/exercises.js');
    const ex = m.getExercise(new URL(location.href).searchParams.get('id'));
    const q = ex.questions[i];
    return { type: q.type, answer: q.answer };
  }, i);
  await page.goto(page.url().replace(/&q=\d+/, '') + `&q=${i}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(280);
  if (val.type === 'math' || val.type === 'blank') {
    await page.fill('.input-blank, input.input[aria-label="Your answer"]', String(val.answer));
  } else if (val.type === 'choice') {
    await page.locator('.opt').nth(val.answer).click();
  } else if (val.type === 'multi') {
    for (const idx of val.answer) await page.locator('.opt').nth(idx).click();
  } else if (val.type === 'written') {
    await page.fill('.textarea', 'A considered answer.');
  } else { continue; }
  await page.click('button:has-text("Check answer"), button:has-text("Save answer")');
  await page.waitForTimeout(220);
}
await page.click('button:has-text("See results")');
await page.waitForSelector('#results .result-hero');
ok('the assigned worksheet can be completed', true);

/* --------------------------- back to the teacher --------------------------- */
await page.goto(classUrl, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
const matrix = await page.locator('#matrix').innerText();
ok('the student now appears on the roster as joined',
  (await page.locator('#roster').innerText()).includes('Joined with the code'));
ok('the result reaches the teacher’s grid', /%/.test(matrix));

/* ------------------- setting work with no class at all ------------------- */
/* A fresh teacher landing on "Set work" has nothing in the class select. That
   used to be a blank dropdown and no way forward, so it is checked here on a
   context with empty storage rather than on the one that already has a class. */
const fresh = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await fresh.route('**://fonts.googleapis.com/**', r => r.abort());
await fresh.route('**://fonts.gstatic.com/**', r => r.abort());
const blank = await fresh.newPage();
blank.on('pageerror', e => errors.push(e.message));

await blank.goto(`${BASE}/signin.html`, { waitUntil: 'domcontentloaded' });
await blank.waitForTimeout(500);
await blank.fill('#name', 'Dana Iqbal');
await blank.click('button[data-role="teacher"]');
await blank.click('button[type="submit"]');
await blank.waitForTimeout(500);

await blank.goto(`${BASE}/teacher/create.html`, { waitUntil: 'domcontentloaded' });
await blank.waitForTimeout(700);
ok('with no classes the select says so instead of being blank',
  (await blank.locator('#f-class').inputValue()) === '' &&
  (await blank.locator('#f-class option').first().innerText()).includes('No classes yet'));
ok('a teacher with no classes is told why', await blank.locator('#f-class-empty').isVisible());
ok('there is a create class button on the set-work page',
  await blank.locator('#new-class-btn').isVisible());

await blank.click('#new-class-btn');
await blank.waitForTimeout(250);
ok('the create class panel opens', await blank.locator('#quick-class').isVisible());
await blank.fill('#q-name', 'Grade 7 Science');
await blank.selectOption('#q-level', 'Grade 7');
await blank.click('#q-create');
await blank.waitForTimeout(600);

ok('the new class is selected in the dropdown',
  (await blank.locator('#f-class option').first().innerText()).includes('Grade 7 Science') &&
  (await blank.locator('#f-class').inputValue()).startsWith('c-'));
ok('its join code is shown next to the class',
  /[A-Z0-9]{3}-[A-Z0-9]{3}/.test(await blank.locator('#f-class-code').innerText()));
ok('the class select is usable again', !(await blank.locator('#f-class').isDisabled()));
ok('the empty message is gone', !(await blank.locator('#f-class-empty').isVisible()));

/* And the class it created is a real one, visible on the class list. */
await blank.goto(`${BASE}/teacher/classes.html`, { waitUntil: 'domcontentloaded' });
await blank.waitForTimeout(600);
ok('the class created from the set-work page is a real class',
  (await blank.locator('.class-card').innerText()).includes('Grade 7 Science'));

/* Creating one from the class page puts the join code straight in front. */
await blank.click('#new-class-btn');
await blank.fill('#c-name', 'Grade 9 History');
await blank.selectOption('#c-level', 'Grade 9');
await blank.click('#create-class-btn');
await blank.waitForTimeout(500);
ok('creating a class shows its join code immediately',
  /[A-Z0-9]{3}-[A-Z0-9]{3}/.test(await blank.locator('#new-class-result .code-display').innerText()));

await fresh.close();

ok('no uncaught page errors', errors.length === 0);
if (errors.length) console.log(errors);

await browser.close();
console.log(`\n${pass} passed, ${fail} failed.`);
process.exit(fail ? 1 : 0);
