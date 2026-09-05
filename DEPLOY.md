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

## Google Cloud

**Use Compute Engine, not Cloud Run.** Cloud Run is the obvious answer and the
wrong one for this app: its filesystem is ephemeral, so the SQLite file is gone
on every cold start, and it scales to several instances, each of which would
have its own copy of a database that is meant to have one. You would lose every
account, quietly, and only notice when somebody could not sign in. Cloud Run is
right for this only after moving the data to Cloud SQL, which is a change to
the backend rather than a setting.

App Engine has the same ephemeral filesystem, and so does Cloud Functions.
Firebase Hosting is static only — see the next section for what that costs.

A single Compute Engine VM, on the other hand, is exactly the shape this app
is: one machine, one disk, one database file.

### One VM, with TLS

```bash
gcloud config set project YOUR_PROJECT
gcloud services enable compute.googleapis.com

gcloud compute instances create worksheethub \
  --zone=us-central1-a \
  --machine-type=e2-micro \
  --image-family=debian-12 --image-project=debian-cloud \
  --boot-disk-size=20GB --boot-disk-type=pd-standard \
  --tags=http-server,https-server \
  --metadata-from-file user-data=deploy/cloud-init.yaml
```

`e2-micro` in some US regions has historically been covered by Google's
always-free tier, but the terms change — check the current free-tier page
before assuming this costs nothing. It is a small instance either way; the
library is static files and the database is small.

The default VPC usually already allows 80 and 443 to those tags. If not:

```bash
gcloud compute firewall-rules create allow-http  --allow=tcp:80  --target-tags=http-server
gcloud compute firewall-rules create allow-https --allow=tcp:443 --target-tags=https-server
```

`deploy/cloud-init.yaml` installs Docker, clones the repository and starts
`deploy/docker-compose.yml` at first boot. That brings up two containers: the
app, and Caddy in front of it. Caddy fetches and renews the Let's Encrypt
certificate on its own — no certbot, no cron job to forget.

Then point your domain at the machine's external address:

```bash
gcloud compute instances describe worksheethub --zone=us-central1-a \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

Create an `A` record for that address, put the domain in `deploy/Caddyfile` in
place of `worksheethub.example.com`, and restart:

```bash
gcloud compute ssh worksheethub --zone=us-central1-a
sudo nano /srv/worksheethub/deploy/Caddyfile
sudo docker compose -f /srv/worksheethub/deploy/docker-compose.yml restart caddy
```

The certificate appears within a minute or so of DNS resolving.

**Testing before you have a domain.** Caddy cannot get a certificate for a bare
IP address, so use the `:80` block commented at the top of the Caddyfile — and
while you do, set `NODE_ENV` to something other than `production` in
`docker-compose.yml`. In production the session cookie is `Secure`, which means
the browser will not send it over plain HTTP and nobody will be able to stay
signed in. Put both back before you tell anyone the address.

### Updating it

```bash
gcloud compute ssh worksheethub --zone=us-central1-a
cd /srv/worksheethub && sudo git pull
sudo docker compose -f deploy/docker-compose.yml up -d --build
```

The schema migrates itself forward on boot and the database is on a named
volume, so an update does not touch the data.

### Backups

The volume lives on the VM's disk, so a disk snapshot is a backup of
everything:

```bash
gcloud compute disks snapshot worksheethub --zone=us-central1-a \
  --snapshot-names=worksheethub-$(date +%F)
```

For a copy you can inspect, take a real SQLite backup instead — safe to run
while the server is live, unlike `cp`:

```bash
sudo docker compose -f /srv/worksheethub/deploy/docker-compose.yml \
  exec app node -e "const{DatabaseSync}=require('node:sqlite'); \
  new DatabaseSync('/data/worksheethub.db').exec(\"VACUUM INTO '/data/backup.db'\")"
```

### If you want Cloud Run anyway

It is a reasonable thing to want: it scales to zero, it is cheap, and there is
no machine to look after. It needs the data moved out of SQLite first —
`server/db.mjs` is the only file that knows what the database is, and the
routes speak to it through prepared statements that Postgres also understands,
so the port is contained rather than sprawling. Cloud SQL for PostgreSQL with
the Cloud Run connector is the usual pairing. That is a real piece of work, not
a config change; the tests would carry over unchanged, which is what makes it
tractable.

## Static hosting, without the backend

The site still runs as a folder of files on Firebase Hosting, GitHub Pages,
Netlify or any CDN —
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

The database is one SQLite file plus its write-ahead log. **Copying it with
`cp` while the server is live can capture a torn write** — the copy looks fine
and restores as a corrupt database. Use one of SQLite's own online backups
instead; both are safe with the server running.

With the `sqlite3` CLI installed:

```bash
sqlite3 /var/lib/worksheethub/worksheethub.db ".backup '/backups/worksheethub-$(date +%F).db'"
```

Or with nothing but Node, which is what you have inside the container:

```bash
node -e "const{DatabaseSync}=require('node:sqlite'); \
  new DatabaseSync(process.env.DATABASE).exec(\"VACUUM INTO '/backups/worksheethub.db'\")"
```

`VACUUM INTO` writes a compacted copy with the write-ahead log already folded
in, so the result is a single file you can open anywhere.

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
