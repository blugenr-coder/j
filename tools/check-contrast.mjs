/* Text you cannot read is a bug, not a style preference.
   Walks every page in both themes, finds each element that paints its own
   text, works out the background actually behind it, and fails anything below
   the WCAG AA contrast ratio for its size. This exists because a band styled
   `background: var(--text); color: #fff` inverted in dark mode and turned into
   white text on a white card — which no render or link check could see.
   Start a static server first, then: node tools/check-contrast.mjs [baseUrl] */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:8099';

const PAGES = [
  'index.html', 'grades.html', 'subjects.html', 'library.html', 'how-it-works.html',
  'join.html', 'signin.html', 'dashboard.html', 'progress.html', 'favorites.html',
  'achievements.html', 'settings.html', '404.html',
  'exercise.html?id=ancient-rome', 'exercise.html?id=ancient-rome&mode=online',
  'teacher/index.html', 'teacher/classes.html', 'teacher/create.html',
  'teacher/analytics.html', 'teacher/builder.html'
];

const AA_NORMAL = 4.5, AA_LARGE = 3;

const audit = () => {
  const parse = c => {
    const m = c.match(/[\d.]+/g);
    if (!m) return null;
    /* Chromium serialises color-mix() as `color(srgb 1 1 1 / .88)`, whose
       channels run 0–1 rather than 0–255. Reading those as 8-bit values makes
       a white header look almost black, which is how this checker first
       "found" a hundred failures that were not there. */
    const k = /^color\(/.test(c) ? 255 : 1;
    return { r: +m[0] * k, g: +m[1] * k, b: +m[2] * k, a: m[3] === undefined ? 1 : +m[3] };
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1
  });
  const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  /* The painted background behind an element: walk up until something opaque. */
  const backdrop = el => {
    let node = el, acc = null;
    while (node && node !== document.documentElement.parentNode) {
      const cs = getComputedStyle(node);
      /* A gradient hides whatever is under it; sample its darkest plausible stop
         by falling back to the element's own colour space is unreliable, so
         treat any image background as opaque-unknown and skip the element. */
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return 'image';
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) {
        acc = acc ? over(acc, c) : c;
        if (acc.a >= 0.999) return acc;
      }
      node = node.parentElement;
    }
    return acc ?? { r: 255, g: 255, b: 255, a: 1 };
  };

  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'NOSCRIPT'].includes(el.tagName)) continue;
    /* Only elements that paint text of their own. */
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
    const fg = parse(cs.color);
    if (!fg || fg.a === 0) continue;
    const bg = backdrop(el);
    if (bg === 'image') continue;
    const size = parseFloat(cs.fontSize);
    const bold = +cs.fontWeight >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const r = ratio(over(fg, bg), bg);
    const need = large ? 3 : 4.5;
    if (r < need) {
      out.push({
        r: Math.round(r * 100) / 100, need,
        sel: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') +
             (el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).join('.')}` : ''),
        text: el.textContent.trim().slice(0, 46), color: cs.color,
        bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`
      });
    }
  }
  return out;
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
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

let fail = 0;
for (const theme of ['light', 'dark']) {
  for (const path of PAGES) {
    await page.goto(`${BASE}/${path}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
    await page.waitForTimeout(400);
    const bad = await page.evaluate(audit);
    console.log(`${bad.length ? '✗' : '✓'} [${theme}] ${path}`);
    for (const b of bad) {
      console.log(`    ${b.r}:1 (needs ${b.need}) ${b.sel}`);
      console.log(`      "${b.text}"  ${b.color} on ${b.bg}`);
      fail++;
    }
  }
}

await browser.close();
console.log(fail ? `\n${fail} unreadable element(s).` : '\nEvery text element meets AA contrast in both themes.');
process.exit(fail ? 1 : 0);
