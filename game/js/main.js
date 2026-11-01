// Boot, renderer, camera rig, menus, lobby, match lifecycle and main loop.
import * as THREE from '../vendor/three.module.min.js';
import { World, SHOWCASE } from './world.js';
import { NavGrid } from './physics.js';
import { FX } from './fx.js';
import { HUD } from './hud.js';
import { Input } from './input.js';
import { Match } from './match.js';
import { audio } from './audio.js';
import { store, save, recordMatch, resetStats } from './storage.js';
import { CHARACTERS, MODES, xpForLevel, botName, WEAPONS } from './config.js';
import { makeCharacter, setCharacterWeapon } from './models.js';
import { mulberry32, fmtTime } from './util.js';

const $ = (id) => document.getElementById(id);
const canvas = $('game');

// ---------------------------------------------------------------- renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: store.settings.quality !== 'low', powerPreference: 'high-performance' });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#8fd8ff');
scene.fog = new THREE.Fog('#a8e3ff', 150, 420);
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.5, 900);

const hemi = new THREE.HemisphereLight('#c8ecff', '#86704a', 1.25);
scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff1d6', 2.3);
sun.castShadow = true;
sun.shadow.camera.left = -48; sun.shadow.camera.right = 48;
sun.shadow.camera.top = 48; sun.shadow.camera.bottom = -48;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 220;
sun.shadow.bias = -0.0006;
sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);

function applyQuality() {
  const q = store.settings.quality;
  const pr = q === 'high' ? Math.min(devicePixelRatio, 2) : q === 'medium' ? Math.min(devicePixelRatio, 1.4) : 1;
  renderer.setPixelRatio(pr);
  sun.castShadow = q !== 'low';
  const size = q === 'high' ? 2048 : 1024;
  if (sun.shadow.mapSize.x !== size) {
    sun.shadow.mapSize.set(size, size);
    if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
  }
  resize();
}
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);

// ---------------------------------------------------------------- state
let world, nav, fx, hud, input;
let match = null;
let mode = 'loading'; // loading | menu | lobby | match
let paused = false;
let zoom = 28;
const camPos = new THREE.Vector3(0, 60, 60);
const camLook = new THREE.Vector3();
let showcase = null;
const SHOW = SHOWCASE;
let fpsAcc = 0, fpsFrames = 0;
let snapCam = true;

// ---------------------------------------------------------------- boot
function setLoad(p, text) { $('load-fill').style.width = p + '%'; if (text) $('load-text').textContent = text; }

async function boot() {
  applyQuality();
  setLoad(15, 'Building the island…');
  await frame();
  world = new World(scene);
  setLoad(55, 'Placing loot crates…');
  await frame();
  world.resetCrates();
  setLoad(70, 'Teaching bots to walk…');
  await frame();
  nav = new NavGrid(world, world.physics);
  setLoad(85, 'Warming up…');
  await frame();
  fx = new FX(scene, camera);
  hud = new HUD(world);
  input = new Input(canvas);
  input.onMode = () => document.body.classList.toggle('touch', input.touchMode);
  document.body.classList.toggle('touch', input.touchMode);
  buildShowcase();
  setupMenus();
  // compile shaders once so the first match does not hitch
  renderer.compile(scene, camera);
  setLoad(100, 'Ready!');
  await frame();
  $('loading').classList.remove('on');
  goMenu();
  requestAnimationFrame(loop);
}
const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

// ---------------------------------------------------------------- showcase
function buildShowcase() {
  const podium = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.4, 20), new THREE.MeshStandardMaterial({ color: '#ffd23f', flatShading: true }));
  top.position.y = 0.2; top.receiveShadow = true; top.castShadow = true;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.08, 6, 30), new THREE.MeshStandardMaterial({ color: '#ff4f8b', emissive: '#ff4f8b', emissiveIntensity: 0.5 }));
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.42;
  podium.add(top, ring);
  podium.position.set(SHOW.x, 0, SHOW.z);
  scene.add(podium);
  showcase = { podium, model: null };
  setShowcaseCharacter();
}
function setShowcaseCharacter() {
  if (showcase.model) scene.remove(showcase.model);
  const c = CHARACTERS.find((x) => x.id === store.profile.character) || CHARACTERS[0];
  const m = makeCharacter(c);
  setCharacterWeapon(m, 'ar', 4);
  m.position.set(SHOW.x, 0.4, SHOW.z);
  scene.add(m);
  showcase.model = m;
  $('menu-char-name').textContent = c.name;
  $('menu-char-bio').textContent = c.bio;
  $('chip-avatar').style.background = c.shirt;
  $('chip-avatar').style.setProperty('--skin', c.skin);
}

// ---------------------------------------------------------------- menus
function openModal(id) { $(id).classList.add('on'); audio.click(); if (id === 'modal-stats') renderStats(); if (id === 'modal-profile') renderProfile(); if (id === 'modal-settings') renderSettings(); }
function closeModal(el) { el.classList.remove('on'); }

function setupMenus() {
  document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => { audio.unlock(); openModal(b.dataset.open); }));
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => { closeModal(b.closest('.modal')); audio.click(); }));
  document.querySelectorAll('.modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m && m.id !== 'pause') closeModal(m); }));

  // modes
  const mp = $('mode-pick');
  for (const m of Object.values(MODES)) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mode-card' + (store.settings.mode === m.id ? ' sel' : '');
    b.innerHTML = `<span class="dot"></span><b></b><small></small>`;
    b.querySelector('b').textContent = m.name;
    b.querySelector('small').textContent = m.desc;
    b.addEventListener('click', () => {
      store.settings.mode = m.id; save();
      mp.querySelectorAll('.mode-card').forEach((x) => x.classList.remove('sel'));
      b.classList.add('sel');
      audio.unlock(); audio.click();
    });
    mp.appendChild(b);
  }

  // characters
  const grid = $('char-grid');
  for (const c of CHARACTERS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'char-card' + (store.profile.character === c.id ? ' sel' : '');
    b.innerHTML = `<div class="sw"><i></i><i></i><i></i><i></i></div><b></b><span></span>`;
    const sw = b.querySelectorAll('.sw i');
    [c.shirt, c.hatColor, c.pants, c.skin].forEach((col, i) => { sw[i].style.background = col; });
    b.querySelector('b').textContent = c.name;
    b.querySelector('span').textContent = c.bio;
    b.addEventListener('click', () => {
      store.profile.character = c.id; save();
      grid.querySelectorAll('.char-card').forEach((x) => x.classList.remove('sel'));
      b.classList.add('sel');
      setShowcaseCharacter();
      audio.click();
    });
    grid.appendChild(b);
  }

  // settings inputs
  const bindRange = (id, key) => $(id).addEventListener('input', (e) => { store.settings[key] = +e.target.value; audio.setVolumes({ [key]: +e.target.value }); save(); });
  bindRange('set-master', 'master'); bindRange('set-music', 'music'); bindRange('set-sfx', 'sfx');
  $('set-quality').addEventListener('change', (e) => { store.settings.quality = e.target.value; save(); applyQuality(); });
  $('set-difficulty').addEventListener('change', (e) => { store.settings.botDifficulty = e.target.value; save(); });
  $('set-shake').addEventListener('change', (e) => { store.settings.shake = e.target.checked; save(); });
  $('set-fps').addEventListener('change', (e) => { store.settings.fps = e.target.checked; save(); $('fps').textContent = ''; });
  $('set-name').addEventListener('input', (e) => { store.profile.name = e.target.value.trim().slice(0, 14) || 'Player'; save(); renderChip(); });
  // Two-step reset built into the page (browser confirm dialogs are not
  // available everywhere the game is embedded).
  let resetArmed = null;
  $('reset-stats').addEventListener('click', () => {
    const b = $('reset-stats');
    if (!resetArmed) {
      b.textContent = 'Tap again to reset';
      resetArmed = setTimeout(() => { resetArmed = null; b.textContent = 'Reset'; }, 3000);
      return;
    }
    clearTimeout(resetArmed); resetArmed = null;
    b.textContent = 'Reset';
    resetStats(); renderStats(); renderChip();
  });
  audio.setVolumes({ master: store.settings.master, music: store.settings.music, sfx: store.settings.sfx });

  $('play-btn').addEventListener('click', () => { audio.unlock(); audio.click(); goLobby(); });
  $('lobby-cancel').addEventListener('click', () => { clearInterval(lobbyTimer); goMenu(); });
  $('resume-btn').addEventListener('click', () => setPaused(false));
  $('pause-btn').addEventListener('click', () => setPaused(true));
  $('quit-btn').addEventListener('click', () => { setPaused(false); endMatch(); goMenu(); });
  $('again-btn').addEventListener('click', () => { audio.click(); endMatch(); goLobby(); });
  $('menu-btn').addEventListener('click', () => { audio.click(); endMatch(); goMenu(); });
  // first interaction anywhere unlocks audio (browsers require a gesture)
  addEventListener('pointerdown', () => audio.unlock(), { once: true });
  addEventListener('keydown', () => audio.unlock(), { once: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden && mode === 'match' && match && !match.result) setPaused(true); });
  renderChip();
}


function renderChip() {
  const p = store.profile;
  $('chip-name').textContent = p.name;
  $('chip-level').textContent = p.level;
  $('chip-xp').style.width = (p.xp / xpForLevel(p.level)) * 100 + '%';
}
function renderProfile() {
  const p = store.profile;
  $('set-name').value = p.name;
  $('prof-level').textContent = p.level;
  $('prof-xp').style.width = (p.xp / xpForLevel(p.level)) * 100 + '%';
  $('prof-xp-text').textContent = `${p.xp} / ${xpForLevel(p.level)} XP to level ${p.level + 1}`;
}
function renderSettings() {
  const s = store.settings;
  $('set-master').value = s.master; $('set-music').value = s.music; $('set-sfx').value = s.sfx;
  $('set-quality').value = s.quality; $('set-difficulty').value = s.botDifficulty;
  $('set-shake').checked = s.shake; $('set-fps').checked = s.fps;
}
function renderStats() {
  const s = store.stats;
  const rows = [
    ['Matches', s.matches], ['Wins', s.wins],
    ['Win rate', s.matches ? Math.round((s.wins / s.matches) * 100) + '%' : '—'], ['Top 5', s.top5],
    ['Eliminations', s.kills], ['K/D', s.deaths ? (s.kills / s.deaths).toFixed(2) : s.kills],
    ['Best kills', s.bestKills], ['Best place', s.bestPlace ? '#' + s.bestPlace : '—'],
    ['Damage dealt', s.damage], ['Time played', fmtTime(s.timePlayed)],
  ];
  $('stat-grid').innerHTML = '';
  for (const [k, v] of rows) {
    const d = document.createElement('div');
    d.className = 'stat';
    d.innerHTML = '<b></b><span></span>';
    d.querySelector('b').textContent = v;
    d.querySelector('span').textContent = k;
    $('stat-grid').appendChild(d);
  }
}

// ---------------------------------------------------------------- flow
function goMenu() {
  mode = 'menu';
  snapCam = true;
  hideScreens();
  $('menu').classList.add('on');
  hud.show(false);
  showcase.podium.visible = true; showcase.model.visible = true;
  renderChip();
  audio.music('menu');
  audio.ambience(false);
  input.enabled = false;
  world.resetCrates();
}

function hideScreens() {
  for (const id of ['menu', 'lobby', 'results']) $(id).classList.remove('on', 'win');
  document.querySelectorAll('.modal').forEach((m) => m.classList.remove('on'));
}

let lobbyTimer = null;
function goLobby() {
  mode = 'lobby';
  hideScreens();
  $('lobby').classList.add('on');
  const m = MODES[store.settings.mode] || MODES.classic;
  $('lobby-mode').textContent = m.name + ' · ' + m.desc;
  $('lobby-max').textContent = m.players;
  const list = $('lobby-list');
  list.innerHTML = '';
  const me = document.createElement('span');
  me.className = 'me'; me.textContent = store.profile.name;
  list.appendChild(me);
  let n = 1;
  const rng = mulberry32((Math.random() * 1e9) | 0);
  const tick = () => {
    n = Math.min(m.players, n + 1 + Math.floor(rng() * 3));
    $('lobby-n').textContent = n;
    $('lobby-fill').style.width = (n / m.players) * 100 + '%';
    while (list.children.length < n) {
      const s = document.createElement('span');
      s.textContent = botName(rng);
      list.appendChild(s);
    }
    if (n >= m.players) {
      clearInterval(lobbyTimer);
      setTimeout(() => { if (mode === 'lobby') startMatch(); }, 450);
    }
  };
  $('lobby-n').textContent = 1;
  $('lobby-fill').style.width = (1 / m.players) * 100 + '%';
  clearInterval(lobbyTimer);
  lobbyTimer = setInterval(tick, 110);
}

function startMatch() {
  if (match) endMatch();
  hideScreens();
  showcase.podium.visible = false; showcase.model.visible = false;
  match = new Match({
    scene, world, nav, fx, hud, mode: store.settings.mode, settings: store.settings, profile: store.profile,
    onEnd: (r) => showResults(r),
  });
  mode = 'match';
  paused = false;
  document.body.classList.add('in-match');
  hud.show(true);
  $('killfeed').innerHTML = '';
  input.enabled = true;
  zoom = 28;
  audio.music(null);
  audio.ambience(true);
  hud.banner('Get ready!', 'Jump out over a spot you like');
  const t = match.cameraTarget();
  camLook.set(t.x, 0, t.z);
}

function endMatch() {
  if (!match) return;
  match.dispose();
  match = null;
  document.body.classList.remove('in-match');
  fx.clear();
  hud.show(false);
  $('crosshair').style.display = 'none';
  $('bigmap').classList.remove('on');
}

function showResults(r) {
  const prog = recordMatch(r);
  const el = $('results');
  el.classList.toggle('win', r.won);
  $('res-place').textContent = '#' + r.placement;
  $('res-title').textContent = r.won ? 'CHAMPION!' : r.placement <= 5 ? 'So close!' : 'Eliminated';
  $('res-sub').textContent = r.won ? `Last one standing out of ${r.players}` : r.stormKill ? 'The storm got you' : r.killer ? `Eliminated by ${r.killer}` : `Placed ${r.placement} of ${r.players}`;
  const stats = [['Eliminations', r.kills], ['Damage', r.damage], ['Accuracy', r.accuracy + '%'], ['Survived', fmtTime(r.survived)], ['Placement', `${r.placement}/${r.players}`], ['XP earned', '+' + prog.xpGained]];
  $('res-stats').innerHTML = '';
  for (const [k, v] of stats) {
    const d = document.createElement('div');
    d.className = 'stat';
    d.innerHTML = '<b></b><span></span>';
    d.querySelector('b').textContent = v;
    d.querySelector('span').textContent = k;
    $('res-stats').appendChild(d);
  }
  const p = store.profile;
  $('res-xp-text').textContent = `Level ${p.level}${prog.levelUps ? ' — LEVEL UP!' : ''}`;
  $('res-xp').style.width = (p.xp / xpForLevel(p.level)) * 100 + '%';
  el.classList.add('on');
  input.enabled = false;
}

function setPaused(on) {
  if (mode !== 'match' || !match || match.result) return;
  paused = on;
  $('pause').classList.toggle('on', on);
  input.mouse.down = false;
}

// ---------------------------------------------------------------- camera
const raycaster = new THREE.Raycaster();
const aimPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.1);
const ndc = new THREE.Vector2();
const tmpV = new THREE.Vector3();
function aimAt(mx, my) {
  ndc.set((mx / innerWidth) * 2 - 1, -(my / innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  return raycaster.ray.intersectPlane(aimPlane, tmpV) ? { x: tmpV.x, z: tmpV.z } : null;
}

function updateCamera(dt, now) {
  const pitch = 0.98;
  let tx, ty, tz, dist;
  if (mode === 'match' && match) {
    const t = match.cameraTarget();
    tx = t.x; tz = t.z; ty = t.y || 0;
    dist = t.plane ? 74 : t.air ? 50 : zoom;
    const p = match.player;
    if (p.state === 'alive' && !input.touchMode) {
      // lead the camera toward the cursor a little
      const lx = (input.mouse.x / innerWidth - 0.5) * 2, lz = (input.mouse.y / innerHeight - 0.5) * 2;
      tx += lx * 5; tz += lz * 4;
    } else if (p.state === 'alive') {
      tx += Math.sin(p.angle) * 3; tz += Math.cos(p.angle) * 3;
    }
    // stay inside the world
    tx = Math.max(-190, Math.min(190, tx)); tz = Math.max(-190, Math.min(190, tz));
  } else {
    // menu: orbit gently around the showcase character, framed to the left
    const a = Math.sin(now * 0.15) * 0.25;
    const cx = SHOW.x, cz = SHOW.z;
    const narrow = innerWidth < 760;
    const desired = new THREE.Vector3(cx + Math.sin(a) * 10 + (narrow ? 0 : 1.5), 3.4, cz + Math.cos(a) * (narrow ? 14 : 10.5));
    const look = new THREE.Vector3(cx + (narrow ? 0 : 3.4), 1.5, cz);
    const k = snapCam ? 1 : 1 - Math.exp(-dt * 3);
    snapCam = false;
    camPos.lerp(desired, k);
    camLook.lerp(look, k);
    camera.position.copy(camPos);
    camera.lookAt(camLook);
    sun.position.set(cx + 30, 60, cz + 25);
    sun.target.position.set(cx, 0, cz);
    if (showcase.model) {
      showcase.model.rotation.y = Math.sin(now * 0.6) * 0.5 + 0.3;
      showcase.model.userData.torso.scale.y = 1 + Math.sin(now * 3) * 0.02;
    }
    return;
  }
  const k = 1 - Math.exp(-dt * 7);
  camLook.x += (tx - camLook.x) * k;
  camLook.y += (ty - camLook.y) * k;
  camLook.z += (tz - camLook.z) * k;
  const want = new THREE.Vector3(camLook.x, camLook.y + Math.sin(pitch) * dist, camLook.z + Math.cos(pitch) * dist);
  camPos.lerp(want, 1 - Math.exp(-dt * 5));
  camera.position.copy(camPos);
  if (store.settings.shake && fx.shake > 0) {
    const s = fx.shake * 0.35;
    camera.position.x += (Math.random() - 0.5) * s;
    camera.position.y += (Math.random() - 0.5) * s;
    camera.position.z += (Math.random() - 0.5) * s;
  }
  camera.lookAt(camLook);
  sun.position.set(camLook.x + 30, 70, camLook.z + 25);
  sun.target.position.set(camLook.x, 0, camLook.z);
  audio.listener.x = camLook.x; audio.listener.z = camLook.z;
}

function autoAim() {
  const p = match.player;
  const w = p.weapon();
  let best = null, bd = (w.melee ? 3 : w.range) ** 2;
  for (const f of match.fighters) {
    if (f === p || f.state !== 'alive') continue;
    const d = (f.x - p.x) ** 2 + (f.z - p.z) ** 2;
    if (d < bd && world.physics.lineOfSight(p.x, p.z, f.x, f.z)) { bd = d; best = f; }
  }
  return best;
}

// ---------------------------------------------------------------- loop
let last = performance.now();
function loop(t) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (t - last) / 1000);
  last = t;
  const now = t / 1000;

  if (mode === 'match' && match) {
    if ((input.pressed('escape') || input.pressed('p')) && !match.result) setPaused(!paused && !$('bigmap').classList.contains('on'));
    if (input.pressed('m') || input.pressed('act:map')) toggleMap();
    if (input.pressed('escape') && $('bigmap').classList.contains('on')) toggleMap(false);
    if (input.wheel && !input.keys.has('shift')) zoom = Math.max(17, Math.min(40, zoom + input.wheel * 2));
    if (!paused) {
      const p = match.player;
      const it = input.enabled ? input.intent(p, aimAt, autoAim) : { mx: 0, mz: 0, aimX: p.x, aimZ: p.z + 1 };
      if (it.pickupKey && p.state === 'alive') { const item = match.playerPrompt(); if (item) match.pickup(p, item); }
      match.camX = camLook.x; match.camZ = camLook.z;
      match.update(dt, it);
      fx.update(dt, match.bullets);
    }
    for (const f of match.fighters) f.updateVisual(dt, camera, match.now);
    updateCamera(dt, now);
    world.updateRoofs(match.cameraTarget().x, match.cameraTarget().z, dt);
    fx.updateNumbers(paused ? 0 : dt, innerWidth, innerHeight);
    hud.update(match, input);
    hud.drawMinimap(match);
    if ($('bigmap').classList.contains('on')) hud.drawBigMap(match);
    hud.updateCrosshair(input, match.player, match.player.state === 'alive' && !paused && !match.result);
  } else {
    updateCamera(dt, now);
    fx && fx.update(dt, []);
  }
  world.update(now);
  renderer.render(scene, camera);
  input.endFrame();

  if (store.settings.fps) {
    fpsAcc += dt; fpsFrames++;
    if (fpsAcc > 0.5) { $('fps').textContent = Math.round(fpsFrames / fpsAcc) + ' FPS · ' + renderer.info.render.calls + ' draws'; fpsAcc = 0; fpsFrames = 0; }
  }
}

function toggleMap(force) {
  const m = $('bigmap');
  const on = force ?? !m.classList.contains('on');
  m.classList.toggle('on', on);
  if (on) hud.drawBigMap(match);
}

// Handle for automated tests and debugging from the console.
window.__sky = { get match() { return match; }, get world() { return world; }, startMatch, goMenu, store };

boot().catch((e) => {
  console.error(e);
  $('load-text').textContent = 'Could not start: ' + e.message + ' — your browser may not support WebGL.';
});
