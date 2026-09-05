/* The server.

   One process: the API under /api, and the site itself from the repository
   root. Started with `npm run serve`, or imported by the tests, which run it
   against an in-memory database on an ephemeral port.

   Configuration is environment variables with working defaults, because a
   backend that cannot be started without a config file is a backend nobody
   runs locally.
*/

import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { openDatabase } from './db.mjs';
import { Router, HttpError, json, context, crossSiteProblem } from './http.mjs';
import { readCookie, userForToken, pruneSessions, COOKIE } from './auth.mjs';
import { makeStaticHandler } from './static.mjs';
import { clientAddress, trustedHops } from './net.mjs';

import { register as registerAuth } from './routes/auth.mjs';
import { register as registerProgress } from './routes/progress.mjs';
import { register as registerClasses } from './routes/classes.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(here, '..');

export function createApp({ dbFile = join(REPO_ROOT, 'data', 'worksheethub.db'),
                            root = REPO_ROOT,
                            secureCookies = process.env.NODE_ENV === 'production',
                            proxyHops = trustedHops(),
                            origins = [] } = {}) {
  const db = openDatabase(dbFile);
  pruneSessions(db);
  /* Expired rows would otherwise pile up for the life of the process.
     Unref'd, so it never holds the process open by itself. */
  const sweep = setInterval(() => pruneSessions(db), 3600_000);
  sweep.unref?.();

  const router = new Router();
  registerAuth(router);
  registerProgress(router);
  registerClasses(router);

  const serveStatic = makeStaticHandler(root, { production: secureCookies });
  const allowedOrigins = new Set(origins);

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

    /* The page and its API are the same origin, so the only Origin header
       that should ever arrive is this server's own. */
    allowedOrigins.add(`http://${req.headers.host}`);
    allowedOrigins.add(`https://${req.headers.host}`);

    /* Cheap, unauthenticated, and says nothing a stranger should not know.
       Every platform wants one to decide whether an instance is alive. */
    if (url.pathname === '/api/health') {
      return json(res, 200, { ok: true, uptime: Math.round(process.uptime()) });
    }

    if (!url.pathname.startsWith('/api/')) {
      return serveStatic(req, res, url.pathname).catch(() => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error');
      });
    }

    try {
      const problem = crossSiteProblem(req, allowedOrigins);
      if (problem) throw new HttpError(403, problem);

      const token = readCookie(req.headers.cookie, COOKIE);
      const user = userForToken(db, token);

      const match = router.match(req.method, url.pathname);
      if (!match) throw new HttpError(404, 'No such endpoint.');
      if (match.methodMismatch) {
        throw new HttpError(405, `${req.method} is not allowed on that endpoint.`);
      }

      await match.handler(context(req, res, match.params, {
        db, user, token,
        secure: secureCookies,
        address: clientAddress(req, proxyHops)
      }));
      /* A handler that returns without writing is a bug in the handler, not
         something to leave the browser hanging on. */
      if (!res.writableEnded) json(res, 204, {});
    } catch (err) {
      fail(res, err);
    }
  });

  server.on('close', () => {
    clearInterval(sweep);
    try { db.close(); } catch { /* already closed */ }
  });
  server.db = db;
  return server;
}

function fail(res, err) {
  if (res.writableEnded) return;
  const status = err instanceof HttpError ? err.status : 500;
  if (status >= 500) console.error('[api]', err);
  json(res, status, {
    error: status >= 500 ? 'Something went wrong on the server.' : err.message,
    ...(err.extra ?? {})
  });
}

/* Started directly rather than imported by a test. */
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const port = Number(process.env.PORT ?? 8099);
  /* 0.0.0.0 in a container, where binding to loopback would make the server
     unreachable from outside it; loopback everywhere else, so a laptop does
     not quietly serve the local network. */
  const host = process.env.HOST ?? (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
  const dbFile = process.env.DATABASE ?? join(REPO_ROOT, 'data', 'worksheethub.db');
  const hops = trustedHops();
  const app = createApp({ dbFile, proxyHops: hops });

  app.listen(port, host, () => {
    console.log(`WorksheetHub on http://${host}:${port}`);
    console.log(`Database:      ${dbFile}`);
    console.log(`Cookies:       ${process.env.NODE_ENV === 'production' ? 'Secure (production)' : 'not Secure (development)'}`);
    console.log(`Trusted proxies: ${hops}`);
    if (process.env.NODE_ENV === 'production' && hops === 0) {
      console.warn('  ! Behind a proxy or load balancer, set TRUST_PROXY=1 or every');
      console.warn('    visitor shares one rate-limit bucket. See DEPLOY.md.');
    }
  });

  /* Close the database cleanly so WAL is checkpointed rather than left for
     the next start to recover. */
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      app.close(() => process.exit(0));
      setTimeout(() => process.exit(0), 2000).unref();
    });
  }
}
