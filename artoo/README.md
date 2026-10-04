# Artoo — image to 3D studio

Upload an image, get a 3D model (GLB) back, rate it, and let your model learn
which generation settings give the best results for your kind of images.

This folder is a separate app from WorksheetHub in the rest of the repository.
It shares nothing with it except the `package.json` scripts.

## Run it

```bash
npm run artoo                                   # demo engine only
MESHY_API_KEY=msy_xxx npm run artoo             # real image-to-3D
# → http://127.0.0.1:8100
```

No `npm install`, no build step. Node 22+. Data (uploads, GLBs, ratings) goes to
`artoo/data/`, which git ignores.

| Variable | Default | Purpose |
|---|---|---|
| `MESHY_API_KEY` | — | Turns on the Meshy engine. Get one at meshy.ai (paid credits). |
| `PORT` / `HOST` | `8100` / `127.0.0.1` | Where to listen. |
| `ARTOO_DATA` | `artoo/data` | Where to store everything. |
| `MESHY_API_URL` | Meshy's endpoint | Only for tests. |

## Pages

- **Home** (`/`) — the landing page, with a 3D elephant built in code.
- **Studio** (`/studio`) — choose a model, drop an image, generate 1–4 candidates, rate each.
- **Models** (`/models`) — create models, see which settings are winning, export the dataset.
- **Gallery** (`/gallery`) — every generation; open in 3D, rate, download.
- **How it works** (`/about`) — the explanation below, for users.

## What "train" means — and what it does not

The 3D shape comes from an image-to-3D neural network. **Artoo does not retrain
that network**: it takes many GPUs, a large 3D dataset and weeks of work.

What it trains is each model's **choice of settings**. A model holds 4–6 setting
variants (engine version, polygon budget, quads or triangles, textures…). Each
1–5 star rating counts as evidence for the variant that made that result.
Choosing what to generate next uses Thompson sampling (`server.mjs`,
`pickArms`): untested variants still get tried, and winners get picked more and
more often. Asking for several candidates generates *different* variants side by
side, which is the fastest way to train.

Every rated pair is kept and downloadable as JSONL (Models → Dataset). That is
the material a real fine-tune of an open-source 3D network would need later.

## Engines

- **Meshy** (`server.mjs`) — the server calls Meshy's Image to 3D API
  (`POST /openapi/v1/image-to-3d`, then polls the task), downloads the GLB as
  soon as it is ready (Meshy's links expire) and serves it locally. The key
  stays on the server. Each generation spends Meshy credits.
- **Demo** (`public/js/relief.js`) — free, runs in the browser: cuts the
  subject out of a plain background and inflates it into a 2.5D relief. It
  cannot see the back of an object. It exists so the full loop can be tried
  without a key.

Adding another engine (Tripo, Hunyuan3D, TRELLIS on your own GPU…) means a new
entry in `PRESETS` and a start/poll pair like `startMeshy` / `refreshMeshy`.

## Deploying

It needs a running Node process with a writable disk, so it does **not** run on
Vercel's static hosting like WorksheetHub does. Any VPS, Fly.io or Render with a
persistent volume works.

**Before putting it on the internet, add login.** There are no accounts: anyone
who can reach the server can generate with your Meshy key and spend your credits.
It listens on `127.0.0.1` by default for that reason.

## Test

```bash
npm run test:artoo
```

Starts the server and a stand-in for the Meshy API, then drives Chromium through
generate → rate → models → gallery → dataset export, checks phone-width layout
and console errors, and writes screenshots to `artoo/test/out/`.

three.js r186 is vendored in `public/vendor/three` (MIT, see its LICENSE).
