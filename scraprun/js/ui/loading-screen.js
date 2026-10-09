/* The loading screen: scenery behind, logo and progress in front.

   The interface lives on a fixed 1920×1080 stage that is scaled to fit the
   window (never cropped, never stretched); the scenery behind it fills the
   whole window. */

import { fitContain, onResize } from '../core/viewport.js';
import { createLogo } from './logo.js';
import { ProgressBar } from './progress-bar.js';

export class LoadingScreen {
  constructor(root, { scene, loader, tip }) {
    this.root = root;
    this.scene = scene;
    this.loader = loader;

    this.stage = root.querySelector('.stage');
    this.logo = createLogo();
    this.bar = new ProgressBar({ tip });
    this.stage.append(this.logo, this.bar.el);

    loader.addEventListener('progress', (e) => this.bar.set(e.detail.progress));
    loader.addEventListener('complete', () => this.bar.finish());
    loader.addEventListener('error', (e) => {
      this.failed = true;
      this.bar.fail(`${e.detail.label} could not be loaded. Restart the game; if it keeps happening, reinstall it.`);
      console.error('[SCRAPRUN] loading failed:', e.detail.label, e.detail.error);
    });

    onResize((w, h) => {
      const fit = fitContain(w, h);
      this.stage.style.transform = `translate(${fit.x}px, ${fit.y}px) scale(${fit.scale})`;
      scene.resize(w, h);
    });

    this.#loop();
  }

  /** Plays the logo entrance. Called once the fonts are in, so the logo never
      flashes in a fallback typeface. */
  introduceLogo() {
    this.root.classList.add('is-intro');
  }

  #loop() {
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!this.failed && this.bar.update(dt) && !this.done) {
        this.done = true;
        this.bar.showReady();
        /* The hand-off point for the game: everything registered with the
           loader has finished. */
        window.dispatchEvent(new CustomEvent('scraprun:ready'));
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
