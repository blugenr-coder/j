# Deploying WorksheetHub

One process serves the API and the site. There is no build step, nothing to
install, and the database is a file. That makes deployment genuinely small —
but three settings decide whether it is *correct*, and two of them fail
silently if you get them wrong.

## The three that matter

| Variable | Set it to | What breaks without it |
|---|---|---|
| `NODE_ENV` | `production` | The session cookie loses `Secure`, so it can be sent over plain HTTP |
| `TRUST_PROXY` | `1` behind one proxy | **Every visitor shares one rate-limit bucket.** Ten wrong passwords lock out the whole site |
| `DATABASE` | a path on a **persistent disk** | The database is inside the container and every deploy wipes every account |

`TRUST_PROXY` is the one worth understanding. `req.socket.remoteAddress` is
the truth when the server faces the internet directly and a lie the moment
anything sits in front of it — behind nginx, a load balancer, Render, Fly or
Cloudflare, every request appears to come from the proxy. The fix is
`X-Forwarded-For`, and the trap is trusting it: that header is set by the
client on the way in, so a server that reads it *without* a proxy in front
lets an attacker send a different address on every request and the rate limit
stops existing.

Which failure you get depends on your deployment, so the app cannot decide it.
`TRUST_PROXY` is the number of proxies actually in front of the server, and
the address is counted in from the right by that many — the last one the
client could not have forged. The default is `0`, which is right for `npm
start` on a laptop and wrong for every hosted deployment. The server prints a
warning at boot if `NODE_ENV=production` and `TRUST_PROXY=0`.

Full list:

| Variable | Default | |
|---|---|---|
| `PORT` | `8099` | |
| `HOST` | `127.0.0.1`, or `0.0.0.0` in production | Loopback on a laptop so it does not quietly serve the local network |
| `DATABASE` | `data/worksheethub.db` | Created with its directory on first run |
| `NODE_ENV` | — | `production` adds `Secure` to the cookie and HSTS to responses |
| `TRUST_PROXY` | `0` | Proxies in front of this server |

## Docker

```bash
docker build -t worksheethub .
docker volume create worksheethub-data
docker run -d --name worksheethub \
  -p 8080:8080 \
  -v worksheethub-data:/data \
  -e TRUST_PROXY=1 \
  worksheethub
```

The image sets `NODE_ENV`, `PORT`, `HOST` and `DATABASE` already, runs as the
unprivileged `node` user, and declares `/data` as a volume. `TRUST_PROXY` is
left to you because only you know what is in front of it.

## Render

`render.yaml` is in the repository root; Render reads it on connect. It asks
for a 1GB disk at `/var/data` and sets `TRUST_PROXY=1`, because Render
terminates TLS at its own proxy. A persistent disk needs a paid instance type
— on the free plan the filesystem is ephemeral and every deploy starts with an
empty database.

## Fly.io

```bash
fly launch --no-deploy     # reads fly.toml
fly volumes create worksheethub_data --size 1
fly deploy
```

## A plain server, behind nginx

```nginx
server {
  listen 443 ssl http2;
  server_name worksheethub.example;

  ssl_certificate     /etc/letsencrypt/live/worksheethub.example/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/worksheethub.example/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:8099;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

`$proxy_add_x_forwarded_for` appends the real client address to whatever
arrived, which is exactly what `TRUST_PROXY=1` expects: it counts one in from
the right and lands on the address nginx wrote.

```ini
# /etc/systemd/system/worksheethub.service
[Unit]
Description=WorksheetHub
After=network.target

[Service]
Type=simple
User=worksheethub
WorkingDirectory=/srv/worksheethub
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=8099
Environment=TRUST_PROXY=1
Environment=DATABASE=/var/lib/worksheethub/worksheethub.db
ExecStart=/usr/bin/node server/index.mjs
Restart=always
RestartSec=5
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
ReadWritePaths=/var/lib/worksheethub

[Install]
WantedBy=multi-user.target
```

`HOST=127.0.0.1` so nothing reaches Node except through nginx.

## Static hosting, without the backend

The site still runs as a folder of files on GitHub Pages, Netlify or any CDN —
that is how most of the test suite drives it. What you lose is exactly the
thing the backend was built for: an account is then a name in `localStorage`,
progress lives in one browser, and a class code only resolves on the device
the class was made on. The sign-in and settings pages detect this and say so
rather than promising something they cannot do.

Deploy it that way only if that is what you want. There is no partial mode:
either the backend is reachable at `/api` or it is not.

## Health, backups and upgrades

`GET /api/health` returns `{ ok: true, uptime }` — unauthenticated, cheap, and
tells a stranger nothing. Point the platform's health check at it.

The database is one SQLite file plus its write-ahead log. Back it up with
SQLite's own online backup, which is safe while the server is running:

```bash
sqlite3 /var/lib/worksheethub/worksheethub.db ".backup '/backups/worksheethub-$(date +%F).db'"
```

Copying the file with `cp` while the server is live can capture a torn write.
Use `.backup`.

Upgrading is `git pull` and a restart. The schema carries a version and
migrates itself forward on boot; an existing database is never rebuilt.

## Before you open it to the public

- [ ] TLS in front, and `NODE_ENV=production` so the cookie is `Secure`
- [ ] `TRUST_PROXY` set to the number of proxies actually in front
- [ ] `DATABASE` on a disk that survives a deploy
- [ ] A backup that has been *restored* once, not just written
- [ ] `npm run check && npm run test:api && npm run test:backend` green on the
      commit you are deploying

## What this does not do yet

- **No password reset.** There is no email sender wired up, so a forgotten
  password is a support request: you reset it in the database by hand.
- **No email verification.** Anyone can register with any address.
- **One machine.** SQLite is a file, so this scales up rather than out. That
  is a real ceiling and a distant one — a school district fits comfortably —
  but scaling out means moving to Postgres first, not adding instances.
