/* Entry point: renderer, lights, camera rig, input, UI and the game loop. */

import * as THREE from '../vendor/three.module.min.js';
import { BaseCharacter } from './character.js';
import { SKINS, skinById } from './skins.js';
import { Animator } from './animator.js';
import { Player } from './player.js';
import { buildWorld } from './world.js';

/* ───────────── renderer & scene ───────────── */

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8fc8f2);
scene.fog = new THREE.Fog(0x8fc8f2, 60, 150);

scene.add(new THREE.HemisphereLight(0xdff1ff, 0x5b7a3a, 1.35));
const sun = new THREE.DirectionalLight(0xfff1dc, 2.3);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const sc = sun.shadow.camera;
sc.left = -22; sc.right = 22; sc.top = 22; sc.bottom = -22; sc.near = 1; sc.far = 80;
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);
const SUN_OFFSET = new THREE.Vector3(14, 26, 10);
// a soft rim from behind so the silhouette separates from the grass
const rim = new THREE.DirectionalLight(0xbfd9ff, 0.6);
rim.position.set(-10, 8, -14);
scene.add(rim);

const world = buildWorld(scene);

/* ───────────── the player ───────────── */

const params = new URLSearchParams(location.search);
const character = new BaseCharacter();
character.applySkin(skinById(params.get('skin') ?? 'default'));
scene.add(character.root);
const animator = new Animator(character);
const player = new Player(character, animator, world.colliders, world.spawn);

/* ───────────── camera rig ─────────────
   Elevated 3/4 view that orbits the player. Yaw is free (drag / Q E),
   pitch is clamped to keep the battle-royale look, distance zooms. */

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);
const cam = { yaw: 0, pitch: 0.68, dist: 12, target: new THREE.Vector3(), yawGoal: 0, distGoal: 12, pitchGoal: 0.68 };
cam.target.copy(player.pos).add(new THREE.Vector3(0, 1.7, 0));

function updateCamera(dt, snap = false) {
  const k = snap ? 1 : 1 - Math.exp(-7 * dt);
  cam.yaw += (cam.yawGoal - cam.yaw) * (snap ? 1 : 1 - Math.exp(-10 * dt));
  cam.pitch += (cam.pitchGoal - cam.pitch) * (snap ? 1 : 1 - Math.exp(-10 * dt));
  cam.dist += (cam.distGoal - cam.dist) * (snap ? 1 : 1 - Math.exp(-8 * dt));
  // lead slightly in the direction of travel so the player sees ahead
  const lead = new THREE.Vector3(player.vel.x, 0, player.vel.z).multiplyScalar(0.12);
  const goal = player.pos.clone().add(new THREE.Vector3(0, 1.7, 0)).add(lead);
  cam.target.lerp(goal, k);
  const cp = Math.cos(cam.pitch);
  camera.position.set(
    cam.target.x + Math.sin(cam.yaw) * cp * cam.dist,
    cam.target.y + Math.sin(cam.pitch) * cam.dist,
    cam.target.z + Math.cos(cam.yaw) * cp * cam.dist,
  );
  camera.lookAt(cam.target);
}

/* ───────────── input ───────────── */

const keys = new Set();
const expressions = Object.keys(BaseCharacter.EXPRESSIONS);
addEventListener('keydown', e => {
  if (e.target.closest?.('button') && (e.code === 'Space' || e.code === 'Enter')) e.preventDefault();
  keys.add(e.code);
  if (e.code === 'Space') { player.requestJump(); e.preventDefault(); }
  const n = Number(e.key);
  if (n >= 1 && n <= SKINS.length) setSkin(SKINS[n - 1].id);
  if (e.code === 'KeyF') setExpression(expressions[(expressions.indexOf(character.expression) + 1) % expressions.length]);
  if (e.code === 'KeyH') document.body.classList.toggle('hide-help');
});
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', () => keys.clear());

let drag = null;
canvas.addEventListener('pointerdown', e => {
  drag = { x: e.clientX, y: e.clientY, id: e.pointerId };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', e => {
  if (!drag || drag.id !== e.pointerId) return;
  cam.yawGoal -= (e.clientX - drag.x) * 0.006;
  cam.pitchGoal = Math.min(1.25, Math.max(0.35, cam.pitchGoal + (e.clientY - drag.y) * 0.004));
  drag.x = e.clientX; drag.y = e.clientY;
});
canvas.addEventListener('pointerup', () => { drag = null; });
canvas.addEventListener('pointercancel', () => { drag = null; });
canvas.addEventListener('wheel', e => {
  cam.distGoal = Math.min(26, Math.max(7, cam.distGoal * (1 + Math.sign(e.deltaY) * 0.1)));
  e.preventDefault();
}, { passive: false });

function readMove() {
  let f = 0, r = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) f += 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) f -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) r += 1;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) r -= 1;
  const len = Math.hypot(f, r) || 1;
  f /= len; r /= len;
  // camera-relative: forward is away from the camera
  const sy = Math.sin(cam.yaw), cy = Math.cos(cam.yaw);
  return { x: -sy * f + cy * r, z: -cy * f - sy * r };
}

/* ───────────── UI ───────────── */

const skinBar = document.getElementById('skins');
for (const [i, s] of SKINS.entries()) {
  const b = document.createElement('button');
  b.type = 'button';
  b.dataset.skin = s.id;
  b.innerHTML = `<span class="num">${i + 1}</span>${s.name}`;
  b.addEventListener('click', () => { setSkin(s.id); b.blur(); });
  skinBar.append(b);
}
const faceBar = document.getElementById('faces');
for (const name of expressions) {
  const b = document.createElement('button');
  b.type = 'button';
  b.dataset.face = name;
  b.textContent = name[0].toUpperCase() + name.slice(1);
  b.addEventListener('click', () => { setExpression(name); b.blur(); });
  faceBar.append(b);
}
function setSkin(id) {
  character.applySkin(skinById(id));
  for (const b of skinBar.children) b.classList.toggle('on', b.dataset.skin === id);
  const u = new URL(location.href);
  u.searchParams.set('skin', id);
  history.replaceState(null, '', u);
}
function setExpression(name) {
  character.setExpression(name);
  for (const b of faceBar.children) b.classList.toggle('on', b.dataset.face === name);
}
setSkin(character.skin);
setExpression('normal');

/* ───────────── loop ───────────── */

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
const chestSeam = scene.userData.chestSeam;
const sky = scene.userData.sky;
let paused = false;

function frame() {
  const dt = Math.min(clock.getDelta(), 1 / 20);
  if (!paused) tick(dt);
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

function tick(dt) {
  if (keys.has('KeyQ')) cam.yawGoal += 2.2 * dt;
  if (keys.has('KeyE')) cam.yawGoal -= 2.2 * dt;
  player.update(dt, readMove());
  updateCamera(dt);

  // shadows follow the player so they stay crisp near the character
  sun.position.copy(player.pos).add(SUN_OFFSET);
  sun.target.position.copy(player.pos);

  const t = clock.elapsedTime;
  chestSeam.material.color.setHSL(0.53, 0.9, 0.7 + 0.15 * Math.sin(t * 3));
  sky.clouds.rotation.y = t * 0.004;
  sky.balloon.position.y = 22 + Math.sin(t * 0.4) * 0.8;
}

updateCamera(0, true);
requestAnimationFrame(frame);
document.body.classList.add('ready');

// Handle for debugging and automated checks.
window.__game = { THREE, scene, camera, cam, character, animator, player, renderer, setSkin, setExpression, tick,
  pause(v = true) { paused = v; }, render() { renderer.render(scene, camera); }, updateCamera };
