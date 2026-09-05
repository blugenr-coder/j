/* Write the static robots.txt and sitemap.xml.

   The server generates both per request, so a deployment with a backend needs
   nothing from this. It exists for hosting the site as a folder of files,
   where there is nobody to ask what the domain is:

     node tools/make-sitemap.mjs https://worksheethub.example

   Both files have to carry absolute URLs. A sitemap of relative paths is
   rejected outright, and a `Sitemap:` line in robots.txt is ignored unless it
   is absolute — quietly, which is how a site ends up with a sitemap nobody
   has ever read.
*/

import { writeFileSync, rmSync } from 'node:fs';
import { robotsTxt, sitemapXml } from '../server/routes/seo.mjs';

/* The domain, from the argument or from whatever the host tells us at build
   time. Vercel and Netlify both publish it; taking it from there means the
   sitemap is right the first time rather than after somebody remembers to
   regenerate it. */
const fromEnv = process.env.SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  ?? (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
  ?? process.env.URL                      // Netlify
  ?? null;

const site = process.argv[2] ?? fromEnv;

if (!site || !/^https?:\/\/[^/]+$/.test(site)) {
  /* Deliberately not a failure. Called from a host's build command with no
     domain available, stopping the build would be a worse outcome than
     shipping without a sitemap — and a sitemap carrying the wrong domain is
     worse than both, so that is the one thing this will not do. */
  console.warn('No site URL given and none in the environment.');
  console.warn('Writing robots.txt with no Sitemap: line, and no sitemap.xml.');
  console.warn('Pass one to get both: node tools/make-sitemap.mjs https://your-domain\n');

  const bare = robotsTxt({ headers: { host: 'placeholder' }, socket: {} })
    .replace(/\nSitemap: .*\n/, '\n');
  writeFileSync('robots.txt', bare);
  rmSync('sitemap.xml', { force: true });
  process.exit(0);
}

const url = new URL(site);
/* The generators take their host from a request; this hands them one. */
const request = {
  headers: { host: url.host, 'x-forwarded-proto': url.protocol.replace(':', '') },
  socket: {}
};

writeFileSync('robots.txt', robotsTxt(request));
writeFileSync('sitemap.xml', sitemapXml(request));
console.log(`Wrote robots.txt and sitemap.xml for ${site}`);
console.log('Submit the sitemap at https://search.google.com/search-console');
