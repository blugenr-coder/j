/* Find text that has run together because two elements sit side by side with
   no whitespace between them, and icons sitting flush against their label.
   This exists because `a.card` outranked `.grade-card` on specificity, so a
   grid that was meant to stack five spans laid them out inline instead and
   every label ran into the next — a fault no page-load or link check sees.
   Start a static server first, then: node tools/check-spacing.mjs */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const B = 'http://127.0.0.1:8099';
const PAGES = ['index.html','grades.html','subjects.html','subjects.html?subject=math','library.html',
  'how-it-works.html','dashboard.html','progress.html','achievements.html','settings.html','join.html',
  'signin.html','exercise.html?id=linear-equations','exercise.html?id=linear-equations&mode=online',
  'print.html?id=linear-equations','teacher/index.html','teacher/classes.html','teacher/create.html',
  'teacher/analytics.html','teacher/builder.html','404.html'];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
await ctx.route('**://fonts.g*/**', r => r.abort());
await ctx.addInitScript(() => { try {
  if (!localStorage.getItem('worksheethub:v1')) localStorage.setItem('worksheethub:v1', JSON.stringify({
    user:{name:'Ana Ruiz',role:'student',grade:'middle',initials:'AR',since:Date.now()}})); } catch{} });
const p = await ctx.newPage();
let total = 0;
for (const path of PAGES) {
  await p.goto(`${B}/${path}`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(700);
  const found = await p.evaluate(() => {
    const out = [];
    const describe = e => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ').filter(Boolean).slice(0,2).join('.') : '');
    /* Two element siblings whose text touches with no whitespace between. */
    const visible = e => e.getClientRects().length > 0;
    for (const el of document.querySelectorAll('body *')) {
      if (!visible(el)) continue;          /* a hidden box has no gaps to judge */
      const kids = [...el.childNodes];
      for (let i = 0; i < kids.length - 1; i++) {
        const a = kids[i], c = kids[i + 1];
        if (a.nodeType !== 1 || c.nodeType !== 1) continue;
        if (!a.textContent.trim() || !c.textContent.trim()) continue;
        const sa = getComputedStyle(a), sc = getComputedStyle(c);
        if (sa.display !== 'inline' || sc.display !== 'inline') continue;
        /* Generated content can supply the separator, in which case the boxes
           legitimately touch — the visible gap is inside the second one. */
        const gen = n => ['::before', '::after']
          .some(pp => { const v = getComputedStyle(n, pp).content; return v && v !== 'none' && v !== 'normal' && v !== '""'; });
        if (gen(a) || gen(c)) continue;

        const last = a.textContent.trim().slice(-1), first = c.textContent.trim()[0];
        if (/[A-Za-z0-9.,;:!?%)]/.test(last) && /[A-Za-z0-9(]/.test(first)) {
          const gap = c.getBoundingClientRect().left - a.getBoundingClientRect().right;
          if (gap < 1.5) out.push(`${describe(el)} → "${a.textContent.trim().slice(-18)}" + "${c.textContent.trim().slice(0,18)}"`);
        }
      }
    }
    /* An icon flush against the word after it. */
    for (const svg of document.querySelectorAll('.ico-svg')) {
      const next = svg.nextSibling;
      if (!next || !next.textContent?.trim()) continue;
      if (!svg.getClientRects().length) continue;
      const parent = svg.parentElement;
      const gapProp = parseFloat(getComputedStyle(parent).columnGap || '0');
      const styleGap = getComputedStyle(parent).display.includes('flex') || getComputedStyle(parent).display.includes('grid');
      if (!styleGap && !gapProp && !/\s$/.test(svg.outerHTML)) {
        out.push(`icon flush: ${describe(parent)} → "${next.textContent.trim().slice(0,24)}"`);
      }
    }
    return [...new Set(out)];
  });
  if (found.length) {
    console.log(`\n${path}`);
    for (const f of found) { console.log('   ' + f); total++; }
  }
}
console.log(`\n${total} spacing problem(s).`);
if (total) process.exitCode = 1;
await b.close();
