/* SCRAPRUN — boot.

   Registers the real loading work with the loader, in the order it has to
   happen, and starts it. The bar moves only as these tasks finish. */

import { LoadingManager, fetchWithProgress } from './core/loader.js';
import { buildJunkyard } from './scene/junkyard.js';
import { SceneView } from './scene/scene-view.js';
import { LoadingScreen } from './ui/loading-screen.js';
import { GAME_ASSETS } from './game-assets.js';
import { MainMenu } from './ui/menu/main-menu.js';
import { audio } from './core/audio.js';

const TIP = 'USE DIFFERENT PARTS TO FIND THE PERFECT BUILD FOR YOUR PLAYSTYLE.';
const FONTS = ['400 100px "Black Ops One"', '700 40px "Rajdhani"', '600 40px "Rajdhani"'];

const root = document.querySelector('.screen');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const world = buildJunkyard();
const scene = new SceneView(root.querySelector('.scene'), world, { reducedMotion });
const loader = new LoadingManager();
const screen = new LoadingScreen(root, { scene, loader, tip: TIP });
scene.start();

const timeout = (ms) => new Promise((r) => setTimeout(r, ms));
let menu = null;

/* Loading → main menu: once everything has loaded, hold READY for a beat,
   then the logo glides to the corner, the foreground changes and the
   buttons come in. */
window.addEventListener('scraprun:ready', async () => {
  await timeout(reducedMotion ? 200 : 900);
  root.classList.add('is-menu');
  scene.showMenuForeground();
  menu.open();
}, { once: true });
for (const type of ['pointerdown', 'keydown']) window.addEventListener(type, () => audio.unlock(), { capture: true });

loader
  .add('Fonts', async () => {
    /* If a font is missing the system fallback is acceptable; a stuck
       loading screen is not. */
    await Promise.race([Promise.all(FONTS.map((f) => document.fonts.load(f))), timeout(4000)]);
    screen.introduceLogo();
  }, { weight: 1 })
  .add('Arena geometry', () => { for (const band of ['far', 'mid', 'near', 'nearMenu']) world.prepare(band); }, { weight: 1 })
  .add('Arena floor', () => scene.buildGround(), { weight: 1 })
  .add('Sky', () => scene.buildLayer('sky'), { weight: 1 })
  .add('Yard', () => scene.buildLayer('far'), { weight: 2 })
  .add('Arena', () => scene.buildLayer('mid'), { weight: 2 })
  .add('Machines', () => scene.buildLayer('near'), { weight: 1 })
  .add('Main menu', () => { world.prepare('nearMenu'); scene.buildLayer('nearMenu'); menu = new MainMenu(root.querySelector('.stage')); }, { weight: 1 })
  .add('Atmosphere', () => { scene.prepareAtmosphere(); scene.reveal(); }, { weight: 1 });

for (const asset of GAME_ASSETS) {
  loader.add(asset.label, (report) => fetchWithProgress(asset.url, report), { weight: asset.weight ?? 1 });
}

/* Design review only: `?preview=SECONDS` (or `#preview` for 8 s) appends a labelled wait so the
   animation of the bar can be watched. It is never on by default, and the
   console says so whenever it is. */
const preview = Number(new URLSearchParams(location.search).get('preview')) || (location.hash === '#preview' ? 8 : 0);
if (preview > 0) {
  console.info(`[SCRAPRUN] preview mode: adding a ${preview}s artificial wait to the loading bar.`);
  loader.add('Preview wait', async (report) => {
    const start = performance.now();
    while (performance.now() - start < preview * 1000) {
      report((performance.now() - start) / (preview * 1000));
      await timeout(50);
    }
  }, { weight: Math.max(1, preview) });
}

loader.start().catch(() => { /* reported on screen by LoadingScreen */ });
