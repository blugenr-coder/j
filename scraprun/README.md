# SCRAPRUN — loading screen

Self-contained browser prototype of the SCRAPRUN loading screen. No build
step, no dependencies, no external requests (fonts are bundled, OFL).

Run it with the repo server (`npm start`) and open
http://127.0.0.1:8099/scraprun/ — or any static server pointed at this folder.

- `?preview=8` adds a clearly-labelled 8 s artificial wait so the bar's
  animation can be reviewed. Off by default; the console announces it.
- When everything has loaded the screen shows READY and fires
  `window` event `scraprun:ready` — the hand-off point for the game.

## Layout

| Path | What it is |
| --- | --- |
| `js/core/loader.js` | Weighted task loader with real sub-progress (`fetchWithProgress`) |
| `js/game-assets.js` | Where the game's own assets get registered (empty for now) |
| `js/render/lowpoly.js` | Tiny flat-shaded 3D renderer for Canvas 2D |
| `js/scene/models.js` | Vehicles and props built from primitives (no model files exist) |
| `js/scene/junkyard.js` | Arena layout, depth layers |
| `js/scene/backdrop.js` | Sky, clouds, ridges, ground, shadows (2D) |
| `js/scene/atmosphere.js` | Dust, smoke, lamp bloom, sun rays |
| `js/scene/scene-view.js` | Layer cache, parallax camera drift, resize |
| `js/ui/*` | Logo (SVG), progress bar, screen composition |

Scenery fills the window (cover, cropped edges); the UI keeps its 1920×1080
composition (contain). `prefers-reduced-motion` disables the camera drift
and most animation.
