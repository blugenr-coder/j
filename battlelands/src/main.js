/* Entry point. */
import { GameManager } from './core/GameManager.js';

const gm = new GameManager();
gm.initializeGame().catch(err => {
  console.error(err);
  document.body.insertAdjacentHTML('beforeend', `<p style="position:fixed;inset:auto 0 0 0;padding:16px;background:#FF6B6B;color:#fff;font:700 14px sans-serif;z-index:99">Something went wrong starting the game. Reload to try again.</p>`);
});

// A tiny, read-mostly hook for automated tests and debugging in the console.
globalThis.__blr = {
  gm,
  get state() { return gm.state; },
  get match() { return gm.match; },
};
