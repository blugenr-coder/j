/* End-to-end check of the practice loop.
   Start a static server first (npx http-server -p 8099 -s .) then run:
     node tools/e2e.mjs [baseUrl]
   Drives a real browser through every interactive question type and asserts
   the feedback, navigation and scoring behave. */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:8099';
let pass = 0, fail = 0;
const ok = (label, cond) => { cond ? pass++ : fail++; console.log(`${cond ? '✓' : '✗'} ${label}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 950 } });
/* The font CDN is not needed for these checks and adds seconds per page;
   the stylesheets carry real fallback stacks. */
await ctx.route('**://fonts.googleapis.com/**', r => r.abort());
await ctx.route('**://fonts.gstatic.com/**', r => r.abort());

const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));

const open = async (path) => {
  await page.goto(`${BASE}/${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
};

/* ------------------------------ the library ------------------------------ */
/* Cards, not just a count: replaceChildren silently stringifies an array, so
   the count can be right while the page renders nothing usable. */
await open('library.html');
ok('the library renders a card per exercise',
  await page.locator('.ex-card').count() === 26);
await open('library.html?q=fractions%20grade%206');
ok('a natural-language query filters to the right exercise',
  await page.locator('.ex-card').count() === 1 &&
  (await page.locator('.ex-card h3').innerText()).includes('Fractions'));
ok('the query is explained back to the user',
  (await page.locator('#parse-note').innerText()).includes('Grade 6'));
await open('library.html?text=zzzznope');
ok('no matches shows an empty state, not a blank page',
  await page.locator('.empty').count() === 1);
await open('subjects.html?subject=math');
ok('a subject page lists its exercises',
  await page.locator('.ex-card').count() > 5);

/* ---------------------- math input: right then wrong ---------------------- */
await open('exercise.html?id=linear-equations&mode=online&q=0');
await page.fill('.input-blank', 'x = 5');
await page.click('button:has-text("Check answer")');
await page.waitForSelector('.feedback.ok');
ok('math answer "x = 5" marked correct', await page.locator('.feedback.ok h4').innerText() === 'Correct 🎉');
ok('score sidebar shows 1 correct', (await page.locator('#score-value').innerText()).startsWith('1 /'));
await page.click('button:has-text("Next question")');
ok('question 1 chip turns green once you move on',
  await page.locator('#qnav button').first().evaluate(b => b.classList.contains('is-correct')));
await page.waitForTimeout(200);
await page.fill('.input-blank', '99');
await page.click('button:has-text("Check answer")');
await page.waitForSelector('.feedback.no');
ok('wrong answer shows "Almost!" and not the answer',
  (await page.locator('.feedback.no').innerText()).includes('Almost!') &&
  !(await page.locator('.feedback.no').innerText()).includes('3x = 21'));

await page.click('.feedback.no button:has-text("See explanation")');
await page.waitForTimeout(150);
ok('explanation reveals the answer only on request',
  (await page.locator('.feedback.no .explain').innerText()).includes('7'));

await page.click('.feedback.no button:has-text("Try again")');
await page.waitForTimeout(200);
await page.fill('.input-blank', '7');
await page.click('button:has-text("Check answer")');
await page.waitForSelector('.feedback.ok');
ok('retry after a wrong answer is accepted', true);

/* ------------------------------ multiple choice ------------------------------ */
await open('exercise.html?id=linear-equations&mode=online&q=4');
await page.locator('.opt').nth(0).click();
await page.click('button:has-text("Check answer")');
await page.waitForSelector('.feedback.ok');
ok('multiple choice marks the right option', await page.locator('.opt.opt-correct').count() === 1);

/* ------------------------------ multiple answers ------------------------------ */
await open('exercise.html?id=linear-equations&mode=online&q=8');
await page.locator('.opt').nth(0).click();
await page.locator('.opt').nth(2).click();
await page.click('button:has-text("Check answer")');
await page.waitForSelector('.feedback');
ok('multi-select with both answers is correct', await page.locator('.feedback.ok').count() === 1);

/* --------------------------------- ordering --------------------------------- */
await open('exercise.html?id=linear-equations&mode=online&q=10');
ok('ordering question renders movable rows', await page.locator('.order-item').count() === 4);
/* The first row's "up" arrow is correctly disabled, so move the second row. */
await page.locator('.order-item').nth(1).locator('button[aria-label^="Move"]').first().click();
await page.waitForTimeout(120);
await page.click('button:has-text("Check answer")');
await page.waitForSelector('.feedback');
ok('ordering can be submitted and marked', await page.locator('.feedback').count() === 1);

/* --------------------------------- matching --------------------------------- */
await open('exercise.html?id=parts-of-speech&mode=online&q=3');
const lefts = page.locator('.match-col').first().locator('.match-item');
const rights = page.locator('.match-col').last().locator('.match-item');
const rightLabels = await rights.allInnerTexts();
const targets = ['Noun', 'Verb', 'Adjective', 'Adverb'];
for (let i = 0; i < 4; i++) {
  await lefts.nth(i).click();
  await rights.nth(rightLabels.findIndex(t => t.includes(targets[i]))).click();
}
await page.click('button:has-text("Check answer")');
await page.waitForSelector('.feedback.ok');
ok('matching all four pairs is marked correct', true);

/* ---------------------------------- graph ---------------------------------- */
await open('exercise.html?id=linear-functions-graphs&mode=online&q=3');
await page.fill('input[aria-label="x coordinate"]', '3');
await page.fill('input[aria-label="y coordinate"]', '2');
await page.click('button:has-text("Check answer")');
await page.waitForSelector('.feedback.ok');
ok('graph point (3, 2) marked correct via keyboard entry', true);

/* ----------------------------- written response ----------------------------- */
await open('exercise.html?id=linear-equations&mode=online&q=11');
await page.fill('.textarea', 'Substituting the value back checks both sides really are equal.');
await page.click('button:has-text("Save answer")');
await page.waitForSelector('.feedback.info');
ok('written response is saved, not auto-marked',
  (await page.locator('.feedback.info').innerText()).includes('Sample answer'));

/* -------------------------- finishing and results -------------------------- */
await page.click('button:has-text("See results")');
await page.waitForSelector('#results .result-hero');
const resultText = await page.locator('#results').innerText();
ok('results screen shows a percentage', /\d+%/.test(resultText));
ok('results screen offers the printable', resultText.includes('Print this worksheet'));
ok('results screen offers another attempt', resultText.includes('Try again'));

/* ------------------------- progress reaches dashboard ------------------------- */
await open('signin.html?next=dashboard.html');
await page.fill('#name', 'Ana Ruiz');
await page.click('button[type="submit"]');
await page.waitForTimeout(400);
await open('dashboard.html');
const dash = await page.locator('#main').innerText();
ok('dashboard reflects the practice just done', dash.includes('Linear Equations'));

ok('no uncaught page errors', errors.length === 0);
if (errors.length) console.log(errors);

await browser.close();
console.log(`\n${pass} passed, ${fail} failed.`);
process.exit(fail ? 1 : 0);
