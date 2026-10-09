/* Fitting the 1920×1080 design to whatever window the player has.

   Two different fits, on purpose:
   - The scenery uses COVER: it always fills the window, cropping the edges of
     a window that is not 16:9. Nothing is ever stretched.
   - The interface uses CONTAIN: the logo and the loading bar always keep the
     composition they were designed in and are never cropped. */

export const DESIGN_W = 1920;
export const DESIGN_H = 1080;

export function fitCover(w, h) {
  const scale = Math.max(w / DESIGN_W, h / DESIGN_H);
  return { scale, x: (w - DESIGN_W * scale) / 2, y: (h - DESIGN_H * scale) / 2 };
}

export function fitContain(w, h) {
  const scale = Math.min(w / DESIGN_W, h / DESIGN_H);
  return { scale, x: (w - DESIGN_W * scale) / 2, y: (h - DESIGN_H * scale) / 2 };
}

/** Calls `fn(width, height)` now and after every resize, at most once a frame. */
export function onResize(fn) {
  let queued = false;
  const run = () => { queued = false; fn(window.innerWidth, window.innerHeight); };
  window.addEventListener('resize', () => {
    if (!queued) { queued = true; requestAnimationFrame(run); }
  });
  run();
}
