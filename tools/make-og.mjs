/* Regenerate the share image — the card that unfurls when someone posts a link.

   It exists as a tool because the last one was made by hand and went stale
   without anyone noticing: it advertised 99,817 worksheets and 248 curriculum
   units long after there were 2,067,397 and 715. A picture of a number is a
   number nobody will ever update, so it reads the totals from the same data
   the site does.

     node tools/make-og.mjs

   Rendered in the browser that is already here rather than through an image
   library, which keeps the card in the same CSS the site is designed in.
*/

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
globalThis.localStorage ??= { getItem: () => null, setItem() {} };

const { TOTAL } = await import(join(ROOT, 'assets/js/data/exercises.js'));
const { UNIT_COUNT } = await import(join(ROOT, 'assets/js/data/units.js'));

const mark = readFileSync(join(ROOT, 'assets/img/icon.svg'), 'utf8')
  .replace(/width="\d+" height="\d+"/, 'width="104" height="104"');

const stats = [
  [TOTAL.toLocaleString('en-US'), 'worksheets'],
  [String(UNIT_COUNT), 'curriculum units'],
  ['Pre-K → College', 'every level']
];

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@700&display=swap">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;font-family:Inter,system-ui,sans-serif;
       color:#fff;overflow:hidden}
  .card{position:relative;width:1200px;height:630px;padding:64px 72px;
        display:flex;flex-direction:column;
        background:linear-gradient(135deg,#4B3FD4 0%,#3730BE 45%,#232CA0 100%)}
  /* The grid is the site's own paper texture, at the opacity it survives
     being shown at 300px wide in a chat window. */
  .card::before{content:'';position:absolute;inset:0;opacity:.14;
    background-image:linear-gradient(#fff 1px,transparent 1px),
                     linear-gradient(90deg,#fff 1px,transparent 1px);
    background-size:60px 60px}
  .row{position:relative;display:flex;align-items:center;gap:26px}
  .tile{width:104px;height:104px;border-radius:26px;overflow:hidden;
        box-shadow:0 10px 30px rgba(9,12,60,.35);flex:none}
  .name{font-family:Poppins,Inter,sans-serif;font-weight:700;font-size:50px;
        letter-spacing:-.5px}
  .name span{color:#A7ACEF}
  h1{position:relative;font-family:Poppins,Inter,sans-serif;font-weight:700;
     font-size:86px;line-height:1.04;letter-spacing:-2.5px;margin-top:52px}
  .sub{position:relative;margin-top:26px;font-size:29px;line-height:1.35;
       color:#C7CBF4;max-width:760px}
  .stats{position:relative;margin-top:auto;display:flex;gap:64px;align-items:flex-end}
  .n{font-family:Poppins,Inter,sans-serif;font-weight:700;font-size:42px;letter-spacing:-1px}
  .l{font-size:21px;color:#B3B8F0;margin-top:4px}
</style></head><body>
  <div class="card">
    <div class="row">
      <div class="tile">${mark}</div>
      <div class="name">Worksheet<span>Hub</span></div>
    </div>
    <h1>Practice anything.<br>Learn everything.</h1>
    <p class="sub">Every worksheet works online and on paper.</p>
    <div class="stats">
      ${stats.map(([n, l]) => `<div><div class="n">${n}</div><div class="l">${l}</div></div>`).join('')}
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 },
                                     deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle' });
/* Without this the card can be shot before the webfont swaps in, which shows
   up as a subtly different headline weight and nothing else. */
await page.evaluate(() => document.fonts.ready);
const buf = await page.screenshot({ type: 'png' });
await browser.close();

const out = join(ROOT, 'assets/img/og.png');
writeFileSync(out, buf);
console.log(`assets/img/og.png  1200x630  ${buf.length} bytes`);
console.log(`  ${TOTAL.toLocaleString('en-US')} worksheets, ${UNIT_COUNT} curriculum units`);
