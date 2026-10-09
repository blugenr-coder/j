/* The arena: where everything stands, and how the scene splits into depth
   layers.

   The world is rendered once into four cached layers — sky, far, mid, near —
   which the view then slides at different speeds to make a slow camera drift
   read as real depth (parallax). Each layer's band of depth is chosen so that
   no object straddles two bands; the ground is cut into matching strips so it
   moves with the things standing on it. */

import { Camera, renderFaces, renderCastShadows, place } from '../render/lowpoly.js';
import { createRng } from '../core/rng.js';
import { drawSky, drawRidges, drawGround, drawShadow } from './backdrop.js';
import * as M from './models.js';

const P = M.PALETTE;

/* Depth boundaries (metres from the camera) between layers. Objects keep
   clear of them: near < 14.5, mid 16.5–40, far > 43. */
const NEAR_EDGE = 15.5;
const FAR_EDGE = 41.5;

export const PARALLAX = { sky: 0.06, far: 0.22, mid: 0.5, near: 1 };

export function buildJunkyard(seed = 7) {
  /* A high, diorama-like view: the logo and loading bar sit over the far
     yard, and the machines fill the lower half of the frame. */
  const camera = new Camera({ pos: [0, 5.4, -4.5], pitch: 0.17, fov: 50 });

  /* Each entry: band, builder, where. Builders get their own seeded stream so
     editing one object does not reshuffle every other one. */
  const objects = [];
  let n = 0;
  const put = (band, build, at) => {
    const rng = createRng(seed * 1000 + (n++) * 7919);
    objects.push({ band, rng, build, at });
  };

  /* ---- near: the hero machine and the frame on the right ---- */
  put('near', (r) => M.vehicle(r, { body: P.blue, accent: P.orange, weapon: 'ram', length: 4.6, width: 2.4, wheelR: 0.66, withCargo: true }),
    { x: -2.9, z: 11.4, yaw: 0.78 });
  put('near', (r) => M.barrel(r, P.red), { x: 4.7, z: 12.6 });
  put('near', (r) => M.barrel(r, P.hazard), { x: 5.3, z: 13.4 });
  put('near', (r) => M.tyreStack(r, 3, 0.55), { x: 6.2, z: 13.9 });
  put('near', (r) => M.tyreFlat(r, 0.5), { x: 3.9, z: 11.6 });
  put('near', (r) => M.pipe(r, 2.2, 0.18), { x: 2.6, z: 10.4, yaw: -0.4 });
  put('near', (r) => M.tyreFlat(r, 0.45), { x: 1.6, z: 9.9 });

  /* ---- near, main menu: the menu has its own foreground, swapped in when
     loading ends, because the left of the frame belongs to the buttons and
     the hero machine moves to the right. ---- */
  put('nearMenu', (r) => M.buggy(r, { body: P.blue, accent: P.orange }), { x: 3.3, z: 10.4, yaw: 2.35, scale: 1.3 });
  put('nearMenu', (r) => M.tyreStack(r, 4, 0.55), { x: 6.4, z: 13.2 });
  put('nearMenu', (r) => M.tyreStack(r, 2, 0.55), { x: 7.3, z: 12.6 });
  put('nearMenu', (r) => M.barrel(r, P.hazard), { x: 5.6, z: 13.8 });
  put('nearMenu', (r) => M.tyreFlat(r, 0.5), { x: 0.6, z: 9.6 });
  put('nearMenu', (r) => M.pipe(r, 2.4, 0.18), { x: -0.6, z: 11.8, yaw: 0.6 });
  put('nearMenu', (r) => M.warningSign(r), { x: -2.6, z: 13.6, yaw: 0.2 });

  /* ---- mid: the fight, the start gantry and the garages ---- */
  put('mid', (r) => M.buggy(r, { body: P.red, accent: P.hazard }), { x: 4.0, z: 20.5, yaw: 2.55 });
  put('mid', (r) => M.ramp(r, 3.4, 1.3, 4), { x: -5.6, z: 21.8, yaw: Math.PI / 2 + 0.1 });
  put('mid', (r) => M.muscleCar(r, { body: P.green, accent: P.hazard }), { x: -1.4, y: 0.8, z: 21.5, yaw: 0.25, roll: 0.12, noShadowLift: true });
  put('mid', (r) => M.gantry(r, { span: 13, h: 7 }), { x: -0.5, z: 31 });
  const signs = [[P.orange, P.hazard], [P.red, P.white], [P.blue, P.hazard], [P.hazard, P.red]];
  for (let i = 0; i < 4; i++) {
    put('mid', (r) => M.garage(r, { w: 5.2, d: 5, h: 3.8 + (i % 2) * 0.6, sign: signs[i][0], signAccent: signs[i][1] }),
      { x: 11.6, z: 19.5 + i * 5.6, yaw: 1.3 });
  }
  put('mid', (r) => M.bunting(r, [8.8, 4.6, 17.5], [8.4, 4.8, 37], 16), {});
  put('mid', (r) => M.bunting(r, [-6.9, 7.4, 30.6], [5.9, 7.4, 30.6], 12), {});
  put('mid', (r) => M.barrel(r, P.red), { x: 7.6, z: 24.6 });
  put('mid', (r) => M.barrel(r, P.blue), { x: 8.1, z: 25.5 });
  put('mid', (r) => M.tyreStack(r, 4), { x: 7.9, z: 30.2 });
  for (let i = 0; i < 4; i++) put('mid', (r) => M.barrier(r, 3.4, i % 2 === 0), { x: -11.4, z: 18.5 + i * 3.9, yaw: Math.PI / 2 + 0.05 });
  put('mid', (r) => M.tyreStack(r, 4), { x: -12.8, z: 25.5 });
  put('mid', (r) => M.tyreStack(r, 3), { x: -13.6, z: 26.8 });
  put('mid', (r) => M.scaffold(r, { w: 2.6, d: 2.6, h: 5, flag: P.orange }), { x: -13.5, z: 32, yaw: 0.15 });
  put('mid', (r) => M.crate(r, 1.1), { x: -11.2, z: 27.4 });
  put('mid', (r) => M.pipe(r, 4.5, 0.35), { x: 2.5, z: 36.5, yaw: 0.4 });
  put('mid', (r) => M.signTower(r, { text: 'JUNKYARD ARENA', h: 3.6 }), { x: 0.6, z: 39.5 });
  put('mid', (r) => M.warningSign(r), { x: -8.2, z: 17.5, yaw: 0.3 });
  put('mid', (r) => M.warningSign(r), { x: 6.8, z: 18.2, yaw: -0.4 });

  /* ---- far: the yard and the desert beyond ---- */
  put('far', (r) => M.floodlight(r, 10), { x: -16, z: 45 });
  put('far', (r) => M.floodlight(r, 11), { x: 19, z: 47 });
  put('far', (r) => M.scrapTower(r, 7), { x: -11.5, z: 47, yaw: 0.2 });
  put('far', (r) => M.scrapTower(r, 6), { x: 13, z: 50, yaw: 0.5 });
  put('far', (r) => M.container(r, P.blue), { x: -4.5, z: 49, yaw: 0.1 });
  put('far', (r) => M.container(r, P.red), { x: 5.5, z: 53, yaw: -0.15 });
  put('far', (r) => M.container(r, [63, 111, 122]), { x: 5.7, y: 2.6, z: 53.3, yaw: 0.05, noShadow: true });
  put('far', (r) => M.scrapPile(r, 10, 6), { x: -28, z: 62 });
  put('far', (r) => M.rock(r, { h: 15, r: 5 }), { x: -22, z: 56 });
  put('far', (r) => M.rock(r, { h: 24, r: 8 }), { x: -38, z: 78 });
  put('far', (r) => M.rock(r, { h: 14, r: 5 }), { x: 27, z: 60 });
  put('far', (r) => M.rock(r, { h: 26, r: 9 }), { x: 44, z: 84 });
  put('far', (r) => M.rock(r, { h: 18, r: 7 }), { x: -6, z: 95 });
  put('far', (r) => M.rock(r, { h: 22, r: 8 }), { x: 15, z: 105 });
  put('far', (r) => M.crane(r, 21, 24), { x: -46, z: 120, yaw: -0.15 });

  /* Lamps to bloom and smoke to emit, in world space; the view projects them. */
  const lamps = [];
  const smoke = [
    { pos: [-27, 5.5, 62], band: 'far', size: 1.3, rate: 0.9, tint: 'dark' },
    { pos: [10, 4.6, 33], band: 'mid', size: 0.6, rate: 0.5, tint: 'dark' },
    { pos: [5.6, 0.4, 21.5], band: 'mid', size: 0.8, rate: 1.3, tint: 'dust' },
    { pos: [-3.4, 0.3, 21.6], band: 'mid', size: 0.55, rate: 0.6, tint: 'dust' }
  ];

  const built = new Map();
  const getBand = (band) => {
    if (!built.has(band)) {
      const list = objects.filter((o) => o.band === band).map((o) => {
        const model = o.build(o.rng);
        const { x = 0, y = 0, z = 0, yaw = 0, pitch = 0, roll = 0, scale = 1 } = o.at;
        const faces = place(model.faces, { x, y, z, yaw, pitch, roll, scale });
        if (model.shadow && scale !== 1) model.shadow = { ...model.shadow, rx: model.shadow.rx * scale, rz: model.shadow.rz * scale, h: model.shadow.h * scale };
        if (model.lamps) for (const l of model.lamps) lamps.push(place([{ p: [l], n: [0, 0, -1], c: [0, 0, 0] }], { x, y, z, yaw })[0].p[0]);
        return { faces, shadow: model.shadow && !o.at.noShadow ? { ...model.shadow, strength: o.at.noShadowLift ? 0.32 : undefined } : null, x, z };
      });
      built.set(band, list);
    }
    return built.get(band);
  };

  const paintBand = (band) => (ctx) => {
    const list = getBand(band);
    const faces = list.flatMap((o) => o.faces);
    /* soft contact shadow first, then the hard cast shadow on top */
    for (const o of list) if (o.shadow) drawShadow(ctx, camera, o.x, o.z, { ...o.shadow, strength: (o.shadow.strength ?? 0.55) * 0.6 });
    renderCastShadows(ctx, faces, camera, { strength: band === 'far' ? 0.35 : 0.62 });
    renderFaces(ctx, faces, camera, { rng: createRng(seed + band.length * 31) });
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
      { id: 'near', parallax: PARALLAX.near, ground: { fromY: groundY(NEAR_EDGE) }, paint: paintBand('near') },
      { id: 'nearMenu', parallax: PARALLAX.near, ground: { fromY: groundY(NEAR_EDGE) }, paint: paintBand('nearMenu') }
    ],
    paintGround: (ctx, W, H, pad) => drawGround(ctx, camera, createRng(seed + 2), W, H, pad),
    /* Building the meshes is part of the real loading work. */
    prepare: (band) => { getBand(band); }
  };
}
