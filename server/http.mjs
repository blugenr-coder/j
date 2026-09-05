/* The small amount of framework this needs.

   A router, a JSON body reader with a size cap, and one place where every
   response is written. Not a framework — about a hundred lines, so that the
   backend stays as dependency-free as the front end it serves. */

const MAX_BODY = 1024 * 1024;   // 1MB: generous for a worksheet, mean for an attacker

export class Router {
  constructor() { this.routes = []; }

  /** add('POST', '/api/classes/:id/students', handler) */
  add(method, pattern, handler) {
    const names = [];
    const source = pattern
      .replace(/[.+*?^${}()|[\]\\]/g, '\\$&')
      .replace(/:([a-zA-Z_]+)/g, (_, name) => { names.push(name); return '([^/]+)'; });
    this.routes.push({ method, regex: new RegExp(`^${source}$`), names, handler });
    return this;
  }

  get(p, h)    { return this.add('GET', p, h); }
  post(p, h)   { return this.add('POST', p, h); }
  put(p, h)    { return this.add('PUT', p, h); }
  patch(p, h)  { return this.add('PATCH', p, h); }
  delete(p, h) { return this.add('DELETE', p, h); }

  match(method, path) {
    let pathExists = false;
    for (const route of this.routes) {
      const m = route.regex.exec(path);
      if (!m) continue;
      pathExists = true;
      if (route.method !== method) continue;
      const params = {};
      route.names.forEach((name, i) => { params[name] = decodeURIComponent(m[i + 1]); });
      return { handler: route.handler, params };
    }
    /* A known path with the wrong verb is a 405, not a 404. Saying so is what
       makes a typo in a fetch call findable in ten seconds. */
    return pathExists ? { methodMismatch: true } : null;
  }
}

/** An error a handler can throw to produce a specific status and message. */
export class HttpError extends Error {
  constructor(status, message, extra = null) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

export const badRequest  = (m, extra) => new HttpError(400, m, extra);
export const unauthorised = (m = 'Sign in to do that.') => new HttpError(401, m);
export const forbidden   = (m = 'That is not yours.') => new HttpError(403, m);
export const notFound    = (m = 'Not found.') => new HttpError(404, m);
export const conflict    = (m) => new HttpError(409, m);

export function json(res, status, body, headers = {}) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(text),
    'Cache-Control': 'no-store',
    ...headers
  });
  res.end(text);
}

/** Read and parse a JSON body, refusing anything oversized or malformed. */
export function readJson(req) {
  return new Promise((resolve, reject) => {
    const declared = Number(req.headers['content-length'] ?? 0);
    if (declared > MAX_BODY) return reject(new HttpError(413, 'That is too large to send.'));

    const chunks = [];
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new HttpError(413, 'That is too large to send.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('error', reject);
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch { reject(new HttpError(400, 'That request body is not valid JSON.')); }
    });
  });
}

/* --------------------------- cross-site defence ---------------------------
   SameSite=Lax already stops the session cookie riding along on a cross-site
   POST from a form or an image. What it does not stop is a *simple* request
   made with fetch from another origin — and only a POST can be one. A simple
   request is GET, HEAD or POST with a form or plain-text content type; it is
   sent without a preflight, so nothing else gets a chance to refuse it.

   So a POST must declare application/json, which takes it out of that set and
   forces a preflight this server never grants. PUT, PATCH and DELETE are
   never simple requests whatever they carry, so requiring a content type on
   them buys nothing and breaks the one verb that legitimately has no body.
   Getting that wrong is how a DELETE endpoint ends up refusing every honest
   request while the hole it was guarding stays open.

   The Origin header, when the browser sends one, must be this site either
   way. */
const NEEDS_JSON = new Set(['POST', 'PUT', 'PATCH']);

export function crossSiteProblem(req, allowedOrigins) {
  if (req.method === 'GET' || req.method === 'HEAD') return null;

  const origin = req.headers.origin;
  if (origin && !allowedOrigins.has(origin)) {
    return 'That request came from somewhere this server does not serve.';
  }
  if (NEEDS_JSON.has(req.method)) {
    const type = String(req.headers['content-type'] ?? '');
    if (!type.startsWith('application/json')) {
      return 'Send this request as application/json.';
    }
  }
  return null;
}

/** Everything a handler is given. */
export function context(req, res, params, extras) {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  return { req, res, params, url, query: url.searchParams, ...extras };
}
