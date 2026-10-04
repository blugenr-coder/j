# Artoo — image to 3D studio

Upload an image, get a 3D model (GLB) back, rate it, and let your model learn
which generation settings give the best results for your kind of images.

This folder is a separate app from WorksheetHub in the rest of the repository.
It shares nothing with it except the `package.json` scripts.

## Two editions

- **Artifact** (`artifact/`) — one HTML page published on claude.ai as
  *Artoo Studio*. Everything runs in the viewer's browser: no server, no key,
  no cost. Signed-in viewers keep a private collection (claude.ai `db`), and
  exports are offered through claude.ai's file saving. Build it with
  `npm run build:artoo-artifact` → `artifact/dist/artoo-studio.html`.
  Publish it with the files from `node artoo/artifact/fetch-ai.mjs` under
  `ai/`, or the AI depth switch reports that it cannot start.
- **Server app** (`server.mjs` + `public/`) — the same browser engine, plus
  real image-to-3D through Meshy with your API key, and a shared dataset export.

## The browser engine (`public/js/engine.js`)

1. **Cutout** — floods the plain background in from the edges (or uses alpha),
   removes specks, keeps the largest piece. A slider sets the tolerance.
2. **Shape** — solves a Poisson equation inside the outline; its square root
   gives every part a round cross-section sized to its own width (arms stay
   thinner than bodies). A side photo replaces that guess with the measured
   profile and also carves the volume (visual hull, smooth-min seam).
3. **Surface** — samples the volume on a grid, extracts it with marching cubes
   and applies Taubin smoothing, which removes stair-steps without shrinking.
4. **Texture** — each face takes colour from the photo that faces it (front,
   back or side), from an atlas whose colours are bled past the outline so rims
   never pick up the backdrop.
5. **Style** — textured, clay, low-poly (flat facets, vertex colours) or voxel
   (exposed cube faces only).

Exports: GLB (textures embedded as JPEG), OBJ, and STL scaled to 100 mm tall.
It still cannot see what a photo hides; for that, use the Meshy engine.

Also: the voxel grid is fitted to the subject (not the photo), outlines and
height fields are Gaussian-smoothed, mirror-symmetric subjects get symmetric
depth, and models get a flat base so they stand (and print).

### AI tools (`public/js/ai.js`)

Two networks, int8 ONNX, run with ONNX Runtime Web on the CPU (one thread):

- **Depth Anything V2 Small** (Apache-2.0, 27 MB): relative depth, about
  1–3 s a picture at 392 px. It shapes the front relief, guides the cutout,
  and its large forms are carried round to the predicted back.
- **SlimSAM-77** (Segment Anything, Apache-2.0, 14 MB): separates the
  character from the background. Depth gives a rough guess of the subject;
  positive points go inside it, negative ones on the far background and the
  corners; three prompt sets × three proposals are scored on the model's own
  confidence, agreement with the guess, not running off the frame, and not
  holding far-away regions. Clicks in the "Fix the background" editor are
  extra points and must hold in the chosen mask. Encoding is several seconds
  once per picture; each click after that is a fraction of a second.

The artifact serves the runtime and models next to the page
(`node artoo/artifact/fetch-ai.mjs` downloads them into `artifact/dist/ai/`).

### Predicting what the picture does not show

No side or back photo is needed. As in a modeller's blockout, the back takes
the front's big forms (Gaussian low-pass of the AI relief) but not its small
ones; its colours come from the character's main palette (k-means, clusters
under 12 % of the subject such as eyes or mouths are dropped) instead of a
mirrored copy of the front, and faces the camera only grazes use the same
colours rather than stretched streaks.

### Modelling chat (artifact only)

Claude, through the claude.ai `sample` capability on the viewer's own
account, receives the cut-out picture and two renders of the model, and edits
it with page tools: `set_shape`, `fix_background`, `add_part`,
`update_part`, `remove_part`. Added parts are simple shapes in model space,
kept with the model, saved with it and exported with it.

### Copy check and auto-copy (`public/js/match.js`)

The model is rendered from the photo's viewpoint and scored on outline (front
silhouette IoU), side profile (with a side photo), relief (correlation with
the AI depth, interior only) and smoothness (normal-map roughness). Auto-copy
runs a coordinate search over smoothing, detail, AI-depth strength and
symmetry, at draft detail without textures (about 10 s), then rebuilds the
winner. Thickness is not searched: a front photo cannot show it, and a flatter
model would only score as smoother.

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
- **Browser** (`public/js/engine.js`, called "demo" in the API) — free and
  instant, described above. Hidden sides are inferred, not seen.

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
