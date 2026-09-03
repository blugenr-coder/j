/* Crawl every page (including the links the shell renders at runtime) and
   report any internal link that does not resolve.
   Start a static server first, then: node tools/check-links.mjs [baseUrl] */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = (process.argv[2] ?? 'http://127.0.0.1:8099').replace(/\/$/, '');
const START = ['index.html', 'library.html', 'grades.html', 'subjects.html', 'how-it-works.html',
  'signin.html', 'join.html', 'dashboard.html', 'progress.html', 'favorites.html',
  'achievements.html', 'settings.html', '404.html', 'exercise.html?id=linear-equations',
  'print.html?id=linear-equations', 'teacher/index.html', 'teacher/create.html',
  'teacher/analytics.html', 'teacher/builder.html'];

const browser = await chromium.launch();
const ctx = await browser.newContext();
/* Signed in, so guarded pages render instead of redirecting. */
await ctx.addInitScript(() => {
  try {
    localStorage.setItem('worksheethub:v1', JSON.stringify({
      user: { name: 'Ana Ruiz', role: 'student', grade: 'middle', initials: 'AR', since: Date.now() }
    }));
  } catch {}
});
/* The font CDN is not needed for these checks and adds seconds per page;
   the stylesheets carry real fallback stacks. */
await ctx.route('**://fonts.googleapis.com/**', r => r.abort());
await ctx.route('**://fonts.gstatic.com/**', r => r.abort());

const page = await ctx.newPage();

const seen = new Set();
const broken = [];
const checked = new Map();

async function exists(url) {
  if (checked.has(url)) return checked.get(url);
  const res = await page.request.get(url).catch(() => null);
  const ok = Boolean(res && res.status() < 400);
  checked.set(url, ok);
  return ok;
}

for (const path of START) {
  const url = `${BASE}/${path}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(500);

  const links = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
  for (const raw of links) {
    if (!raw || raw.startsWith('#') || /^(https?:|mailto:|tel:|data:|javascript:)/.test(raw)) continue;
    const resolved = new URL(raw, url).href;
    if (!resolved.startsWith(BASE)) continue;
    const key = `${path} → ${raw}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (!(await exists(resolved.split('#')[0]))) broken.push(key);
  }
}

await browser.close();
console.log(`Checked ${seen.size} links across ${START.length} pages.`);
if (broken.length) {
  console.error(`\n${broken.length} broken:\n  ` + broken.join('\n  '));
  process.exit(1);
}
console.log('No broken internal links.');
