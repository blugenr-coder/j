/* Nothing may scroll sideways on a phone.
   A page that overflows horizontally is not a cosmetic problem: the whole
   layout shifts, fixed bars stretch past the screen, and taps land in the
   wrong place. This exists because the subject list did exactly that — the
   topic names were joined with no whitespace between them, so the browser saw
   one unbreakable word and ran it eight hundred pixels off the side.
   Start a static server first, then: node tools/check-mobile.mjs [baseUrl] */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:8099';

const PAGES = [
  'index.html', 'grades.html', 'subjects.html', 'subjects.html?subject=science',
  'library.html', 'how-it-works.html', 'join.html', 'signin.html',
  'dashboard.html', 'progress.html', 'favorites.html', 'achievements.html',
  'settings.html', '404.html',
  'exercise.html?id=ancient-rome', 'exercise.html?id=ancient-rome&mode=online',
  'teacher/index.html', 'teacher/classes.html', 'teacher/create.html',
  'teacher/analytics.html', 'teacher/builder.html'
];

/* A narrow modern phone and a small tablet. */
const SIZES = [[390, 844], [768, 1024]];

const browser = await chromium.launch();
let fail = 0;

for (const [width, height] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: width < 700, hasTouch: true });
  await ctx.route('**://fonts.googleapis.com/**', r => r.abort());
  await ctx.route('**://fonts.gstatic.com/**', r => r.abort());
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('worksheethub:v1', JSON.stringify({
        user: { name: 'Ana Ruiz', role: 'student', grade: 'middle', initials: 'AR', since: Date.now() }
      }));
    } catch {}
  });
  const page = await ctx.newPage();

  for (const path of PAGES) {
    await page.goto(`${BASE}/${path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const bad = await page.evaluate(() => {
      const limit = document.documentElement.clientWidth;
      const over = [];
      /* Content inside a deliberately scrollable container — a wide data table
         in its own `overflow-x: auto` box — is doing the right thing. */
      const inScroller = el => {
        for (let n = el.parentElement; n; n = n.parentElement) {
          const ox = getComputedStyle(n).overflowX;
          if (ox === 'auto' || ox === 'scroll') return true;
        }
        return false;
      };
      for (const el of document.querySelectorAll('body *')) {
        if (inScroller(el)) continue;
        for (const r of el.getClientRects()) {
          if (r.width && (r.right > limit + 1 || r.left < -1)) {
            over.push({
              sel: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') +
                   (typeof el.className === 'string' && el.className
                     ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
              left: Math.round(r.left), right: Math.round(r.right),
              text: (el.textContent || '').trim().slice(0, 34)
            });
            break;
          }
        }
        if (over.length > 5) break;
      }
      return {
        over,
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth
      };
    });

    const scrolls = bad.scroll > bad.client + 1;
    const ok = !scrolls && !bad.over.length;
    console.log(`${ok ? '✓' : '✗'} [${width}px] ${path}`);
    if (scrolls) { console.log(`    page scrolls sideways: ${bad.scroll}px of content in ${bad.client}px`); fail++; }
    for (const o of bad.over) {
      console.log(`    ${o.sel} runs ${o.left}→${o.right}  "${o.text}"`);
      fail++;
    }
  }
  await ctx.close();
}

await browser.close();
console.log(fail ? `\n${fail} overflow problem(s).` : '\nNothing overflows at phone or tablet width.');
process.exit(fail ? 1 : 0);
