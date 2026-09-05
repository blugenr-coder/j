/* robots.txt and sitemap.xml, built from the request.

   Both files have to carry absolute URLs — the sitemap protocol requires it,
   and a `Sitemap:` line in robots.txt is ignored unless it is absolute. That
   is awkward for a site whose domain is not known when the files are written,
   and the usual answer is a build step that bakes one in and goes stale the
   first time the domain changes.

   With a server there is a better one: the request knows its own host. These
   are generated per request, so they are correct on localhost, on a staging
   domain and in production without anybody configuring anything.

   The static copies in the repository exist for hosting the site with no
   server at all; `npm run sitemap` writes those. */

const PUBLIC_PAGES = [
  ['/', '1.0', 'weekly'],
  ['/grades.html', '0.9', 'monthly'],
  ['/subjects.html', '0.9', 'monthly'],
  ['/library.html', '0.9', 'weekly'],
  ['/how-it-works.html', '0.7', 'monthly'],
  ['/signin.html', '0.5', 'yearly']
];

/* Everything behind a sign-in. A crawler reaching these gets an empty state or
   a redirect, so indexing them spends crawl budget to publish nothing. They
   also carry a noindex tag: robots.txt stops the crawl, a meta tag stops the
   indexing, and a page linked from elsewhere needs the second one. */
const PRIVATE_PATHS = [
  '/dashboard.html', '/progress.html', '/settings.html', '/favorites.html',
  '/achievements.html', '/join.html', '/print.html', '/teacher/'
];

export const publicPages = () => PUBLIC_PAGES.map(([path]) => path);

function originOf(req) {
  /* Behind a proxy the scheme the visitor used is in a header; the socket only
     knows about the hop from the proxy, which is plain HTTP. */
  const proto = String(req.headers['x-forwarded-proto'] ?? '').split(',')[0].trim()
    || (req.socket.encrypted ? 'https' : 'http');
  const host = String(req.headers['x-forwarded-host'] ?? req.headers.host ?? 'localhost').split(',')[0].trim();
  return `${proto}://${host}`;
}

export function robotsTxt(req) {
  const origin = originOf(req);
  return `# WorksheetHub
User-agent: *
Allow: /

# Behind a sign-in: a crawler gets an empty state or a redirect.
${PRIVATE_PATHS.map(p => `Disallow: ${p}`).join('\n')}

# The library's filters live in the URL, so it has an unbounded number of
# query-string permutations. Every one of them canonicalises to /library.html,
# but there is no reason to spend crawl budget discovering that.
Disallow: /library.html?

Sitemap: ${origin}/sitemap.xml
`;
}

export function sitemapXml(req) {
  const origin = originOf(req);
  const today = new Date().toISOString().slice(0, 10);
  const urls = PUBLIC_PAGES.map(([path, priority, freq]) => `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function register(router) {
  router.get('/robots.txt', async ctx => {
    ctx.res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    });
    ctx.res.end(robotsTxt(ctx.req));
  });

  router.get('/sitemap.xml', async ctx => {
    ctx.res.writeHead(200, {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    });
    ctx.res.end(sitemapXml(ctx.req));
  });
}
