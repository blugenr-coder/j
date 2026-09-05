/* The backend, through the browser, on two devices.

   Everything else tests one half. This tests the join: a teacher registers on
   one browser and sets work; a student registers on a *separate* browser
   context — its own cookies, its own localStorage, as different from the
   first as a phone is from a laptop — joins with the code, does the
   worksheet, and the result appears in the teacher's grid.

   That was the one thing the static build could not do, and it is stated as
   such in the interface. This is the test that says it now can.

   Start nothing first; this runs the real server itself:
     node tools/e2e-backend.mjs
*/

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { createApp } from '../server/index.mjs';

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  cond ? pass++ : fail++;
  console.log(`${cond ? '✓' : '✗'} ${label}`);
  if (!cond && detail !== undefined) console.log('   got:', String(detail).slice(0, 400));
};

const app = createApp({ dbFile: ':memory:', secureCookies: false });
await new Promise(r => app.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${app.address().port}`;

const browser = await chromium.launch();
const errors = [];

/** A separate browser context is a separate device: separate everything. */
async function device(label) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await ctx.route('**://fonts.googleapis.com/**', r => r.abort());
  await ctx.route('**://fonts.gstatic.com/**', r => r.abort());
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${label}: ${e.message}`));
  page.open = async (path) => {
    await page.goto(`${BASE}/${path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(650);
  };
  return page;
}

async function signUp(page, { email, password, name, role }) {
  await page.open('signin.html?new=1');
  await page.waitForSelector('#email-field:not([hidden])');
  await page.fill('#name', name);
  await page.fill('#email', email);
  await page.fill('#password', password);
  if (role === 'teacher') await page.click('button[data-role="teacher"]');
  await page.click('#submit-btn');
  await page.waitForTimeout(1200);
}

/* ============================ the teacher's laptop ============================ */
const laptop = await device('teacher');
await laptop.open('signin.html?new=1');
ok('the sign-in page asks for an email once a server is behind it',
  await laptop.locator('#email-field').isVisible());
ok('and says where the work will be saved',
  (await laptop.locator('#storage-text').innerText()).includes('every device'));

await signUp(laptop, { email: 'sam@school.org', password: 'chalkdust7', name: 'Sam Ortega', role: 'teacher' });
ok('registering as a teacher lands on the teacher home', laptop.url().includes('teacher/'), laptop.url());

await laptop.open('teacher/classes.html');
await laptop.click('#new-class-btn');
await laptop.fill('#c-name', 'Grade 8 Science');
await laptop.selectOption('#c-level', 'Grade 8');
await laptop.click('#create-class-btn');
await laptop.waitForTimeout(900);
const code = (await laptop.locator('#new-class-result .code-display').innerText()).trim();
ok('the class is created and shows a join code', /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(code), code);

/* The id and code came from the server, not from this browser. */
const stored = app.db.prepare('SELECT code, name FROM classes').all();
ok('the class exists in the database', stored.length === 1 && stored[0].code === code, stored);

await laptop.open('teacher/create.html');
await laptop.waitForTimeout(900);
await laptop.locator('#match-list .list-item').first().click();
await laptop.fill('#f-title', 'Cells homework');
await laptop.click('#create-btn');
await laptop.waitForTimeout(1000);
ok('the teacher can set work to the class',
  app.db.prepare('SELECT COUNT(*) AS n FROM assignments').get().n === 1);
const setWorksheet = JSON.parse(app.db.prepare('SELECT worksheet_ids FROM assignments').get().worksheet_ids)[0];

/* ============================= the student's phone ============================= */
const phone = await device('student');
await signUp(phone, { email: 'ana@school.org', password: 'riverbank3', name: 'Ana Ruiz', role: 'student' });
ok('registering as a student lands on the dashboard', phone.url().includes('dashboard'), phone.url());

await phone.open('join.html');
await phone.fill('#student-name', 'Ana Ruiz');
await phone.fill('#code', code);
await phone.click('#join-form button[type="submit"]');
await phone.waitForTimeout(1200);
ok('the student joins the class with the code',
  (await phone.locator('#my-classes').innerText()).includes('Grade 8 Science'),
  await phone.locator('#my-classes').innerText());

const roster = app.db.prepare(
  `SELECT cs.name, cs.source FROM class_students cs`).all();
ok('the student is on the roster in the database',
  roster.some(r => r.name === 'Ana Ruiz' && r.source === 'joined'), roster);

await phone.open('dashboard.html');
ok('the work set by the teacher shows on the student’s dashboard',
  (await phone.locator('#assigned').innerText()).includes('Cells homework'),
  await phone.locator('#assigned').innerText());

/* ------------------------------ doing the work ------------------------------ */
await phone.goto(`${BASE}/exercise.html?id=${setWorksheet}&mode=online`, { waitUntil: 'domcontentloaded' });
await phone.waitForTimeout(900);

const count = await phone.evaluate(() => window.__EX?.questions?.length ?? 0).catch(() => 0);
const total = await phone.locator('.qnav button').count();
ok('the assigned worksheet opens', total > 0, `${total} questions`);

/* Answer every question correctly, straight from the sheet's own answer key —
   this is a test of the plumbing, not of whether a robot can do biology. */
for (let i = 0; i < total; i++) {
  const val = await phone.evaluate(async (index) => {
    const { getExercise } = await import('/assets/js/data/exercises.js');
    const id = new URLSearchParams(location.search).get('id');
    const q = getExercise(id).questions[index];
    return { type: q.type, answer: q.answer };
  }, i);
  await phone.goto(`${BASE}/exercise.html?id=${setWorksheet}&mode=online&q=${i}`, { waitUntil: 'domcontentloaded' });
  await phone.waitForTimeout(260);
  if (val.type === 'math' || val.type === 'blank') {
    await phone.fill('.input-blank, input.input[aria-label="Your answer"]', String(val.answer));
  } else if (val.type === 'choice') {
    await phone.locator('.opt').nth(val.answer).click();
  } else if (val.type === 'multi') {
    for (const idx of val.answer) await phone.locator('.opt').nth(idx).click();
  } else if (val.type === 'written') {
    await phone.fill('.textarea', 'A considered answer.');
  } else { continue; }
  await phone.click('button:has-text("Check answer"), button:has-text("Save answer")');
  await phone.waitForTimeout(200);
}
await phone.click('button:has-text("See results")');
await phone.waitForSelector('#results .result-hero');
await phone.waitForTimeout(1400);   // let the outbox drain
ok('the student can finish the worksheet', true);

const saved = app.db.prepare('SELECT COUNT(*) AS n FROM answers').get().n;
ok('the answers reached the database', saved > 0, saved);
const score = app.db.prepare('SELECT correct, total, percent FROM scores').get();
ok('the score reached the database', Boolean(score), score);
const submission = app.db.prepare('SELECT * FROM submissions').get();
ok('the work was filed against the assignment automatically', Boolean(submission), submission);

/* ========================= back on the teacher's laptop ========================= */
const classId = app.db.prepare('SELECT id FROM classes').get().id;
await laptop.open(`teacher/class.html?id=${classId}`);
await laptop.waitForTimeout(1200);
const rosterText = await laptop.locator('#roster').innerText();
ok('the teacher sees the student who joined from another device',
  rosterText.includes('Ana Ruiz'), rosterText);
const matrix = await laptop.locator('#matrix').innerText();
ok('the teacher sees the result that came back from that device', /%/.test(matrix), matrix);
ok('the page no longer says results are limited to this browser',
  !matrix.includes('needs a server') &&
  !(await laptop.locator('#matrix').innerText()).includes('only for students working in this browser'), matrix);

await laptop.open(`teacher/analytics.html?class=${classId}`);
await laptop.waitForTimeout(1300);
const stats = await laptop.locator('#a-stats').innerText();
ok('analytics is built from the real submission', stats.includes('%'), stats);
const rows = await laptop.locator('#student-rows').innerText();
ok('the student is named in the results table', rows.includes('Ana Ruiz'), rows);

/* ============================ the same person, elsewhere ============================ */
const library = await device('same student, different device');
await library.open('signin.html');
await library.waitForSelector('#email-field:not([hidden])');
await library.fill('#email', 'ana@school.org');
await library.fill('#password', 'riverbank3');
await library.click('#submit-btn');
await library.waitForTimeout(1600);
ok('the student can sign in on a device that has never seen them', library.url().includes('dashboard'), library.url());

await library.open('progress.html');
await library.waitForTimeout(900);
const progressText = await library.locator('#main').innerText();
ok('their progress is there on the new device', /\d+%|\d+ worksheet/i.test(progressText), progressText.slice(0, 200));

await library.open('dashboard.html');
ok('and so is the work their teacher set',
  (await library.locator('#assigned').innerText()).includes('Cells homework'),
  await library.locator('#assigned').innerText());

/* ------------------------- changing what is on the account ------------------------- */
await library.open('settings.html');
await library.fill('#name', 'Ana R. Ruiz');
await library.click('#profile-form button[type="submit"]');
await library.waitForTimeout(1400);
ok('a profile change reaches the account, not just the browser',
  app.db.prepare('SELECT name FROM users WHERE email = ?').get('ana@school.org').name === 'Ana R. Ruiz',
  app.db.prepare('SELECT name FROM users WHERE email = ?').get('ana@school.org'));

/* ------------------------------- signing out ------------------------------- */
await library.open('settings.html');
await library.click('#signout-btn');
await library.waitForTimeout(900);
const sessionsLeft = app.db.prepare('SELECT COUNT(*) AS n FROM sessions').get().n;
ok('signing out ends the session on the server too', sessionsLeft === 2, sessionsLeft);

/* --------------------------- with the server gone --------------------------- */
/* The site was static before this backend existed and has to stay usable that
   way — a blocked API must degrade, not break. */
const offline = await device('no backend');
await offline.route('**/api/**', r => r.abort());
await offline.open('library.html');
ok('the library still renders with every API call failing',
  (await offline.locator('#results').count()) > 0);
await offline.open('signin.html?new=1');
ok('sign-in falls back to the name-only form with no server',
  await offline.locator('#email-field').isHidden());
ok('and says so plainly',
  (await offline.locator('#storage-text').innerText()).includes('without a server'),
  await offline.locator('#storage-text').innerText());

ok('no uncaught page errors', errors.length === 0, errors.join(' | '));

await browser.close();
await new Promise(r => app.close(r));
console.log(`\n${pass} passed, ${fail} failed.`);
process.exit(fail ? 1 : 0);
