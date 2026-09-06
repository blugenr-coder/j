/* Creating an account, from a browser test.

   This is shared because it was got wrong three times in the same way. The
   sign-in page has two modes and picks between them by asking the server
   whether it is there: with no server it wants a name, and with one it wants an
   email and a password, hiding the name and role fields unless you are
   creating an account rather than signing in. Tests written against the
   local-only form kept filling a name field that was no longer visible, then
   waiting thirty seconds for it and dying with a timeout that says nothing
   about the cause.

   So: ask for the create-account form, fill whatever is actually on screen, and
   let the caller assert. */

/** Unique per call, so a test can be run twice against the same database. */
const freshEmail = who => `${who}.${Date.now()}.${Math.random().toString(36).slice(2, 7)}@example.org`;

export const TEST_PASSWORD = 'practice-run-2024';

/**
 * @param page      Playwright page
 * @param base      origin, e.g. http://127.0.0.1:8099
 * @param name      the person's name
 * @param role      'student' | 'teacher'
 * @param next      optional page to land on
 */
export async function signUp(page, base, { name, role = 'student', next } = {}) {
  const url = new URL(`${base}/signin.html`);
  url.searchParams.set('new', '1');
  if (next) url.searchParams.set('next', next);
  await page.goto(url.href, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  const email = freshEmail(role);
  for (const [selector, value] of [
    ['#name', name],
    ['#email', email],
    /* Letters and a number: the server's own policy. A password that fails it
       leaves the page sitting on the form, and the only symptom downstream is a
       page that mysteriously knows nothing about the account. */
    ['#password', TEST_PASSWORD]
  ]) {
    if (await page.locator(selector).isVisible()) await page.fill(selector, value);
  }

  if (role === 'teacher') {
    const chip = page.locator('button[data-role="teacher"]');
    if (await chip.isVisible()) await chip.click();
  }

  await page.click('button[type="submit"]');
  await page.waitForTimeout(1200);
  return { email };
}

/**
 * Sign back in as an account signUp() already made. Needed wherever a test
 * plays two people in one browser: with a real server they are two accounts,
 * not one profile switching a role chip, so the teacher has to sign in again
 * after the student has been on the same page.
 */
export async function signIn(page, base, { email, password = TEST_PASSWORD, next } = {}) {
  const url = new URL(`${base}/signin.html`);
  if (next) url.searchParams.set('next', next);
  await page.goto(url.href, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  for (const [selector, value] of [['#email', email], ['#password', password]]) {
    if (await page.locator(selector).isVisible()) await page.fill(selector, value);
  }
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1200);
}
