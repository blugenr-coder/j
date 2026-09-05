/* Serving the site itself.

   The front end is still a folder of static files — that has not changed and
   should not. This serves them from the same process as the API so there is
   one thing to start, one port, and therefore no cross-origin configuration
   to get wrong between the page and its own backend. */

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join, normalize, extname, resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt':  'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

export function makeStaticHandler(root) {
  const base = resolve(root);

  return async function serve(req, res, pathname) {
    /* Path traversal is the one thing a static handler must not get wrong.
       Decode first, normalise, then confirm the result is still inside the
       root — checking the string before normalising catches nothing. */
    let decoded;
    try { decoded = decodeURIComponent(pathname); }
    catch { return send(res, 400, 'Bad path'); }
    if (decoded.includes('\0')) return send(res, 400, 'Bad path');

    let file = resolve(join(base, normalize(decoded)));
    if (file !== base && !file.startsWith(base + sep)) return send(res, 403, 'Forbidden');

    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) {
      file = join(file, 'index.html');
      info = await stat(file).catch(() => null);
    }
    if (!info?.isFile()) {
      /* A missing page gets the site's own 404, so a mistyped URL still looks
         like the product rather than like a server. */
      const notFound = join(base, '404.html');
      const nf = await stat(notFound).catch(() => null);
      if (nf?.isFile()) return stream(req, res, notFound, nf, 404);
      return send(res, 404, 'Not found');
    }
    return stream(req, res, file, info, 200);
  };
}

function stream(req, res, file, info, status) {
  const etag = `W/"${createHash('sha1')
    .update(`${info.size}-${info.mtimeMs}`).digest('base64url')}"`;

  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, { ETag: etag });
    return res.end();
  }

  const type = TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream';
  /* Revalidate every time. The library is one immutable build served from
     disk, but an HTML page that caches for a day is a page that shows an old
     sign-in state after somebody logs out. */
  res.writeHead(status, {
    'Content-Type': type,
    'Content-Length': info.size,
    'Cache-Control': 'no-cache',
    'ETag': etag,
    'X-Content-Type-Options': 'nosniff'
  });
  if (req.method === 'HEAD') return res.end();
  createReadStream(file).pipe(res);
}

function send(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(message);
}
