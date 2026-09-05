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

import { writeFileSync } from 'node:fs';
import { robotsTxt, sitemapXml } from '../server/routes/seo.mjs';

const site = process.argv[2];
if (!site || !/^https?:\/\/[^/]+$/.test(site)) {
  console.error('Usage: node tools/make-sitemap.mjs https://your-domain\n');
  console.error('The domain is required and cannot be guessed: an absolute URL is');
  console.error('the one thing both of these files must have.');
  process.exit(1);
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
