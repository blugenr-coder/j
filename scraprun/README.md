# SCRAPRUN — loading screen and main menu

Self-contained browser prototype of SCRAPRUN's loading screen and main menu. No build
step, no dependencies, no external requests (fonts are bundled, OFL).

Run it with the repo server (`npm start`) and open
http://127.0.0.1:8099/scraprun/ — or any static server pointed at this folder.

- `?preview=8` adds a clearly-labelled 8 s artificial wait so the bar's
  animation can be reviewed. Off by default; the console announces it.
- When everything has loaded the screen shows READY, fires the `window`
  event `scraprun:ready`, and moves into the main menu.

## Main menu

Main menu → Play (Practice / Survival) · Garage · Settings · Quit.
Up/Down move, Enter selects, Escape goes back; the mouse drives the same
selection. Practice, Survival and the Garage are placeholders that say so.

- Settings (master / music / effects volume) are saved in localStorage and
  drive real Web Audio gain nodes. UI sounds are synthesised; there are no
  audio files or music yet. Display mode uses the Fullscreen API where the
  browser allows it.
- Scrap lives in `js/core/store.js` (`progress`, `addScrap()`); the HUD
  follows it.
- Quit calls `window.scraprunHost.quit()` if a desktop wrapper provides it;
  in a browser it shows a goodbye screen instead of closing the tab.

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
| `js/ui/*` | Logo (SVG), progress bar, screen composition, icons |
| `js/ui/menu/*` | Main menu screens and keyboard/mouse navigation |
| `js/core/store.js`, `js/core/audio.js` | Saved settings and progress; audio buses |

Scenery fills the window (cover, cropped edges); the UI keeps its 1920×1080
composition (contain). `prefers-reduced-motion` disables the camera drift
and most animation.
