/* The arena: where everything stands, and how the scene splits into depth
   layers.

   The world is rendered once into four cached layers — sky, far, mid, near —
   which the view then slides at different speeds to make a slow camera drift
   read as real depth (parallax). Each layer's band of depth is chosen so that
   no object straddles two bands; the ground is cut into matching strips so it
   moves with the things standing on it. */

import { Camera, renderFaces, place } from '../render/lowpoly.js';
import { createRng } from '../core/rng.js';
import { drawSky, drawRidges, drawGround, drawShadow } from './backdrop.js';
import * as M from './models.js';

const P = M.PALETTE;

/* Depth boundaries (metres from the camera) between layers. Objects keep
   clear of them: near < 14, mid 17–41, far > 45. */
const NEAR_EDGE = 15.5;
const FAR_EDGE = 43;

export const PARALLAX = { sky: 0.06, far: 0.22, mid: 0.5, near: 1 };

export function buildJunkyard(seed = 7) {
  const camera = new Camera({ pos: [0, 2.1, 0], pitch: 0.034, fov: 52 });

  /* Each entry: band, builder, where. Builders get their own seeded stream so
     editing one object does not reshuffle every other one. */
  const objects = [];
  let n = 0;
  const put = (band, build, at) => {
    const rng = createRng(seed * 1000 + (n++) * 7919);
    objects.push({ band, rng, build, at });
  };

  /* ---- near: the hero machine and the frame on the right ---- */
  put('near', (r) => M.vehicle(r, { body: P.blue, accent: P.orange, weapon: 'ram', length: 4.6, width: 2.4, wheelR: 0.66 }),
    { x: -3.3, z: 11.4, yaw: 0.86 });
  put('near', (r) => M.scrapPile(r, 3.2, 1.9), { x: 8.6, z: 13.2, yaw: 0.3 });
  put('near', (r) => M.tyreStack(r, 3, 0.55), { x: 5.9, z: 12.9 });
  put('near', (r) => M.barrel(r, P.red), { x: 4.5, z: 11.9 });
  put('near', (r) => M.barrel(r, P.hazard), { x: 5.1, z: 12.7 });
  put('near', (r) => M.tyreFlat(r, 0.5), { x: 4.0, z: 11.0 });
  put('near', (r) => M.barrel(r, P.hazard), { x: -8.6, z: 12.6 });

  /* ---- mid: the fight ---- */
  put('mid', (r) => M.vehicle(r, { body: P.red, accent: M.PALETTE.darkSteel, cabinColor: P.red, weapon: 'flipper', length: 3.8, width: 2.1, wheelR: 0.55, wing: false }),
    { x: 4.6, z: 19.5, yaw: 2.62 });
  put('mid', (r) => M.ramp(r, 3.6, 1.4, 4.2), { x: -8.6, z: 26.5, yaw: Math.PI / 2 });
  put('mid', (r) => M.vehicle(r, { body: P.green, accent: P.hazard, weapon: 'saw', length: 3.9, width: 2.1, wheelR: 0.55, stacks: false }),
    { x: -3.6, y: 1.25, z: 26.2, yaw: 0.22, roll: 0.16, noShadowLift: true });
  put('mid', (r) => M.tyreStack(r, 4), { x: -11.4, z: 22.5 });
  put('mid', (r) => M.tyreStack(r, 3), { x: -12.6, z: 23.8 });
  put('mid', (r) => M.tyreStack(r, 5), { x: 9.6, z: 25.5 });
  put('mid', (r) => M.tyreFlat(r), { x: 8.4, z: 24.2 });
  put('mid', (r) => M.barrel(r, P.red), { x: -6.2, z: 17.2 });
  put('mid', (r) => M.barrel(r, P.red), { x: -5.5, z: 17.8 });
  put('mid', (r) => M.barrel(r, P.hazard), { x: 7.4, z: 31 });
  put('mid', (r) => M.crate(r, 1.1), { x: 11.2, z: 33 });
  put('mid', (r) => M.crate(r, 0.9, P.steel), { x: 11.9, z: 32.1, yaw: 0.4 });
  put('mid', (r) => M.pipe(r, 5, 0.35), { x: -11, z: 30, yaw: 0.5 });
  for (let i = 0; i < 9; i++) {
    const x = -17 + i * 4.2;
    if (Math.abs(x + 1) < 2.5) continue;       // the gate in the middle
    put('mid', (r) => M.barrier(r, 3.6, i % 2 === 0), { x, z: 37.5 + Math.sin(i) * 0.6 });
  }
  put('mid', (r) => M.scaffold(r, { w: 2.6, d: 2.6, h: 6.2, flag: P.orange }), { x: -11.5, z: 39, yaw: 0.15 });
  put('mid', (r) => M.scaffold(r, { w: 2.6, d: 2.6, h: 5.2, flag: P.blue }), { x: 13.5, z: 40, yaw: -0.2 });
  put('mid', (r) => M.bunting(r, [-10.2, 6.6, 38.5], [-3, 4.6, 40.5], 9), {});
  put('mid', (r) => M.bunting(r, [12.2, 5.6, 39.6], [5.5, 4.4, 40.8], 8), {});

  /* ---- far: the yard beyond the arena ---- */
  put('far', (r) => M.floodlight(r, 9.5), { x: -17.5, z: 47 });
  put('far', (r) => M.floodlight(r, 10.5), { x: 20.5, z: 50 });
  put('far', (r) => M.scrapTower(r, 7), { x: -12.5, z: 50, yaw: 0.2 });
  put('far', (r) => M.scrapTower(r, 5), { x: -9.2, z: 56, yaw: -0.4 });
  put('far', (r) => M.scrapTower(r, 8), { x: 15.5, z: 55, yaw: 0.5 });
  put('far', (r) => M.scrapTower(r, 6), { x: 24, z: 62, yaw: -0.2 });
  put('far', (r) => M.container(r, M.PALETTE.blue), { x: -4.5, z: 52, yaw: 0.1 });
  put('far', (r) => M.container(r, P.red), { x: 7.5, z: 58, yaw: -0.15 });
  put('far', (r) => M.container(r, [63, 111, 122]), { x: 7.7, y: 2.6, z: 58.3, yaw: 0.05, noShadow: true });
  put('far', (r) => M.scrapPile(r, 11, 6.5), { x: -30, z: 74 });
  put('far', (r) => M.scrapPile(r, 12, 7), { x: 32, z: 80 });
  put('far', (r) => M.scrapPile(r, 16, 5), { x: 2, z: 96 });
  put('far', (r) => M.crane(r, 21, 24), { x: -38, z: 115, yaw: -0.15 });
  put('far', (r) => M.crane(r, 18, 20), { x: 46, z: 135, yaw: Math.PI + 0.25 });

  /* Lamps to bloom and smoke to emit, in world space; the view projects them. */
  const lamps = [];
  const smoke = [
    { pos: [-29, 6, 74], band: 'far', size: 1.3, rate: 0.9, tint: 'dark' },
    { pos: [33, 6.5, 80], band: 'far', size: 1.1, rate: 0.6, tint: 'dark' },
    { pos: [6.6, 0.4, 20.6], band: 'mid', size: 0.9, rate: 1.4, tint: 'dust' },
    { pos: [-6.4, 0.3, 26.5], band: 'mid', size: 0.8, rate: 1.0, tint: 'dust' }
  ];

  const built = new Map();
  const getBand = (band) => {
    if (!built.has(band)) {
      const list = objects.filter((o) => o.band === band).map((o) => {
        const model = o.build(o.rng);
        const { x = 0, y = 0, z = 0, yaw = 0, pitch = 0, roll = 0 } = o.at;
        const faces = place(model.faces, { x, y, z, yaw, pitch, roll });
        if (model.lamps) for (const l of model.lamps) lamps.push(place([{ p: [l], n: [0, 0, -1], c: [0, 0, 0] }], { x, y, z, yaw })[0].p[0]);
        return { faces, shadow: model.shadow && !o.at.noShadow ? { ...model.shadow, strength: o.at.noShadowLift ? 0.32 : undefined } : null, x, z };
      });
      built.set(band, list);
    }
    return built.get(band);
  };

  const paintBand = (band) => (ctx) => {
    const list = getBand(band);
    for (const o of list) if (o.shadow) drawShadow(ctx, camera, o.x, o.z, o.shadow);
    renderFaces(ctx, list.flatMap((o) => o.faces), camera);
  };

  const groundY = (z) => camera.project([0, 0, z])[1];

  return {
    camera,
    lamps,
    smoke,
    /* Layers, back to front. `ground` says which strip of floor a layer
       carries: from the given depth to the bottom of the screen. */
    layers: [
      { id: 'sky', parallax: PARALLAX.sky, paint: (ctx, W, H, pad) => {
        const rng = createRng(seed + 1);
        drawSky(ctx, camera, rng, W, H, pad);
        drawRidges(ctx, camera, rng, W, pad);
      } },
      { id: 'far', parallax: PARALLAX.far, ground: { fromY: camera.horizonY - 2 }, paint: paintBand('far') },
      { id: 'mid', parallax: PARALLAX.mid, ground: { fromY: groundY(FAR_EDGE) }, paint: paintBand('mid') },
      { id: 'near', parallax: PARALLAX.near, ground: { fromY: groundY(NEAR_EDGE) }, paint: paintBand('near') }
    ],
    paintGround: (ctx, W, H, pad) => drawGround(ctx, camera, createRng(seed + 2), W, H, pad),
    /* Building the meshes is part of the real loading work. */
    prepare: (band) => { getBand(band); }
  };
}
