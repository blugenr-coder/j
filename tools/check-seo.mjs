/* What a crawler gets.

   Search Console reports these failures weeks after a deploy, in a dashboard
   nobody opens daily, in language that describes the symptom rather than the
   cause ("Alternate page with proper canonical tag", "Discovered — currently
   not indexed"). Checking them here turns that into a build failure.

   Runs the real server and asks it the way Googlebot would:
     node tools/check-seo.mjs
*/

import { createApp } from '../server/index.mjs';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  cond ? pass++ : fail++;
  console.log(`${cond ? '✓' : '✗'} ${label}`);
  if (!cond && detail !== undefined) console.log('   got:', String(detail).slice(0, 300));
};

const app = createApp({ dbFile: ':memory:', secureCookies: false });
await new Promise(r => app.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${app.address().port}`;
const origin = new URL(BASE).origin;

/* ------------------------------- robots.txt ------------------------------- */
let res = await fetch(`${BASE}/robots.txt`);
const robots = await res.text();
ok('robots.txt is served', res.status === 200, res.status);
ok('it is served as text/plain', (res.headers.get('content-type') ?? '').startsWith('text/plain'),
  res.headers.get('content-type'));
ok('its Sitemap line is absolute, or Google ignores it',
  new RegExp(`^Sitemap: ${origin}/sitemap\\.xml$`, 'm').test(robots),
  robots.split('\n').find(l => l.startsWith('Sitemap')));
ok('pages behind a sign-in are disallowed',
  ['/dashboard.html', '/settings.html', '/teacher/'].every(p => robots.includes(`Disallow: ${p}`)));
ok('the public pages are not disallowed',
  !robots.includes('Disallow: /library.html\n') && !robots.includes('Disallow: /grades.html'));

/* ------------------------------- sitemap.xml ------------------------------- */
res = await fetch(`${BASE}/sitemap.xml`);
const sitemap = await res.text();
ok('sitemap.xml is served', res.status === 200, res.status);
ok('it is served as XML, not as a download',
  (res.headers.get('content-type') ?? '').includes('xml'), res.headers.get('content-type'));

const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
ok('it lists some URLs', locs.length > 0, locs.length);
ok('every URL is absolute — the protocol requires it',
  locs.every(l => l.startsWith('http://') || l.startsWith('https://')), locs.slice(0, 3));
ok('every URL is on this origin', locs.every(l => l.startsWith(origin)), locs.slice(0, 3));

/* A sitemap listing a page that 404s or redirects is a Search Console error
   per URL, and the commonest way to get one is renaming a page. */
for (const loc of locs) {
  const r = await fetch(loc, { redirect: 'manual' });
  ok(`  ${new URL(loc).pathname} answers 200`, r.status === 200, r.status);
}

/* No page behind a sign-in should be in there. */
ok('nothing behind a sign-in is listed',
  !locs.some(l => /dashboard|settings|progress|teacher|favorites|achievements/.test(l)), locs);

/* --------------------------- what each page says --------------------------- */
const pages = [
  ...readdirSync('.').filter(f => f.endsWith('.html')),
  ...readdirSync('teacher').filter(f => f.endsWith('.html')).map(f => join('teacher', f))
];

const listed = new Set(locs.map(l => new URL(l).pathname.replace(/^\/$/, '/index.html')));
let missingTitle = [], missingDesc = [], unmarked = [], longTitles = [];

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const canonical = /rel="canonical"/.test(html);
  const noindex = /name="robots" content="noindex/.test(html);

  if (!title.trim()) missingTitle.push(page);
  if (!desc.trim()) missingDesc.push(page);
  /* Every page must say one thing or the other. A page with neither is a page
     whose indexing is decided by whatever Google infers. */
  if (!canonical && !noindex) unmarked.push(page);
  if (title.length > 65) longTitles.push(`${page} (${title.length})`);
}

ok('every page has a title', missingTitle.length === 0, missingTitle);
ok('every page has a meta description', missingDesc.length === 0, missingDesc);
ok('every page is either canonical or noindex, never neither', unmarked.length === 0, unmarked);
ok('no title is long enough to be truncated in a result', longTitles.length === 0, longTitles);

/* The pages in the sitemap must be the indexable ones, and vice versa. */
const contradictions = [];
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const noindex = /name="robots" content="noindex/.test(html);
  const inSitemap = listed.has(`/${page}`);
  if (noindex && inSitemap) contradictions.push(`${page} is noindex but in the sitemap`);
}
ok('the sitemap does not list a page that tells Google not to index it',
  contradictions.length === 0, contradictions);

/* --------------------------- the crawl trap --------------------------- */
/* The library keeps its filters in the URL, so it has an unbounded number of
   query-string permutations. Without a self-referencing canonical, each one is
   a separate page competing with the others. */
const library = readFileSync('library.html', 'utf8');
ok('the library canonicalises its filter permutations to one URL',
  /<link rel="canonical" href="library\.html">/.test(library));

/* ---------------------------- structured data ---------------------------- */
const index = readFileSync('index.html', 'utf8');
const ld = index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
ok('index.html carries structured data', Boolean(ld));
let parsed = null;
try { parsed = JSON.parse(ld ?? 'null'); } catch { /* reported below */ }
ok('the structured data is valid JSON', Boolean(parsed));

const site = parsed?.['@graph']?.find(n => n['@type'] === 'WebSite');
const target = site?.potentialAction?.target?.urlTemplate ?? '';
ok('it declares a WebSite', Boolean(site));
/* A search action pointing at a parameter the page ignores is worse than
   none: it publishes a search box that returns the unfiltered library. */
const param = target.match(/[?&]([a-z_]+)=\{search_term_string\}/)?.[1];
ok('its search action names a parameter the library actually reads',
  param === 'text', target);

await new Promise(r => app.close(r));
console.log(`\n${pass} passed, ${fail} failed.`);
process.exit(fail ? 1 : 0);
