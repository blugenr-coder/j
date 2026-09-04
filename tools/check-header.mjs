/* Header fit.
   A flex item with `min-width: 0` can be squeezed narrower than its own
   content and then paints over its neighbours — the bounding boxes still say
   there is no overlap, so a screenshot is the only thing that shows it. This
   walks the header at every width a real screen has, in every language, and
   fails any element whose content is wider than the box it was given.

   Needs the dev server: npm start, then node tools/check-header.mjs */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = process.env.BASE ?? 'http://127.0.0.1:8099';
const LANGS = ['en', 'es', 'fr', 'de', 'pt', 'it'];
const PAGES = ['index.html', 'library.html', 'how-it-works.html', 'teachers.html'];
/* Real device widths plus the awkward gaps between them. */
const WIDTHS = [360, 390, 414, 480, 600, 768, 820, 900, 940, 1024, 1100, 1180,
                1280, 1366, 1440, 1600, 1920];

const browser = await chromium.launch();
let failures = 0, checked = 0;

for (const lang of LANGS) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 720 } });
    await ctx.route('**://fonts.g*/**', r => r.abort());
    await ctx.addInitScript(([l]) => {
      try {
        if (!localStorage.getItem('worksheethub:v1'))
          localStorage.setItem('worksheethub:v1', JSON.stringify({ language: l }));
      } catch { /* private mode: the page still renders in English */ }
    }, [lang]);
    const page = await ctx.newPage();
    for (const path of PAGES) {
      await page.goto(`${BASE}/${path}`, { waitUntil: 'load' });
      /* The shell sets data-nav-ready once the header has been measured against
         the text it will actually show — after the fonts and the language pack
         have landed. Waiting for that beats guessing a delay. */
      await page.waitForFunction(() => document.documentElement.dataset.navReady === '1',
                                 null, { timeout: 8000, polling: 100 }).catch(() => {});
      await page.waitForTimeout(120);
      const bad = await page.evaluate(() => {
        const out = [];
        const header = document.querySelector('.site-header');
        if (!header) return out;
        for (const el of header.querySelectorAll('*')) {
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.overflowX === 'auto' || cs.overflowX === 'scroll') continue;
          const r = el.getBoundingClientRect();
          if (!r.width) continue;
          /* 2px of slack: sub-pixel text metrics round against us. */
          if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
            out.push(`${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/)[0]} ` +
                     `content ${el.scrollWidth} in ${el.clientWidth}`);
          }
          if (r.right > window.innerWidth + 1) {
            out.push(`${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/)[0]} runs past the viewport`);
          }
        }
        return [...new Set(out)];
      });
      checked++;
      if (bad.length) {
        failures++;
        console.log(`✗ [${lang} ${width}px] ${path}`);
        for (const b of bad.slice(0, 4)) console.log(`    ${b}`);
      }
    }
    await ctx.close();
  }
}
await browser.close();
console.log(failures
  ? `\n${failures} header problem(s) across ${checked} checks.`
  : `\nHeader fits at every width, in every language (${checked} checks).`);
process.exit(failures ? 1 : 0);
