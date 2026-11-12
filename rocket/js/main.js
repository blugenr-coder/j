import * as THREE from '../vendor/three.module.min.js';
import { S } from './state.js';
import { Hangar } from './hangar.js';
import { Flight } from './flight.js';
import { UI } from './ui.js';
import { Input, isTouch } from './input.js';
import { Audio } from './audio.js';
import { Guide } from './guide.js';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isTouch, logarithmicDepthBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, isTouch ? 1.5 : 2));
renderer.shadowMap.enabled = !isTouch; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const game = {
  mode: 'menu',
  showMenu() { this.prevMode = this.mode === 'menu' ? this.prevMode : this.mode; document.getElementById('menu').classList.add('on'); Input.release(); document.getElementById('m-continue').style.display = S.started ? '' : 'none'; document.getElementById('m-resume').style.display = this.prevMode && this.prevMode !== 'menu' ? '' : 'none'; },
  hideMenu() { document.getElementById('menu').classList.remove('on'); },
  toHangar() {
    flight.stop(); flight.cleanup();
    this.mode = 'hangar'; S.resetVisit();
    ui.enterHangar(); hangar.enter();
    if (guide.active && S.level > 0) guide.finish(false);
    eventTimer = 4 + Math.random() * 4; // a memo usually greets you
  },
  launch() {
    S.save();
    this.mode = 'flight';
    flight.start();
  },
};

const ui = new UI(game);
const hangar = new Hangar(renderer, ui);
const flight = new Flight(renderer, ui);
game.hangar = hangar; game.flight = flight;
const guide = new Guide(game, ui, hangar); game.guide = guide;
Input.init(canvas);
Input.onLock = locked => document.body.classList.toggle('locked', locked);

let eventTimer = 0, hintT = 0;
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  hangar.resize(w, h); flight.resize(w, h);
}
addEventListener('resize', resize); resize();

// menu
const $ = id => document.getElementById(id);
$('m-new').onclick = () => { Audio.unlock(); if (S.started && !confirm('Start a new program? Your current save is replaced.')) return; S.newGame(); guide.restart(); game.hideMenu(); game.toHangar(); };
$('m-tut').onclick = () => { Audio.unlock(); if (!S.started) S.newGame(); guide.restart(); game.hideMenu(); if (game.mode !== 'hangar') game.toHangar(); };
$('m-continue').onclick = () => { Audio.unlock(); game.hideMenu(); if (game.mode !== 'hangar') game.toHangar(); };
$('m-resume').onclick = () => { Audio.unlock(); game.hideMenu(); };
$('m-help').onclick = () => showHelp();
function showHelp() { $('help').classList.add('on'); }
$('help-close').onclick = () => $('help').classList.remove('on');
if (S.load()) { $('m-continue').style.display = ''; }
game.showMenu();

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (game.mode === 'hangar') {
    hangar.update(dt);
    // random memos wait until the tutorial is over
    if (!ui.modalOpen() && !guide.active) { eventTimer -= dt; if (eventTimer <= 0) { ui.hangarEvent(); eventTimer = 70 + Math.random() * 80; } }
    hintT -= dt; if (hintT <= 0) { hintT = 0.5; ui.refreshHint(); }
    if (Input.hit('Tab') || Input.hit('KeyT')) ui.termOpen ? ui.closeTerminal() : ui.openTerminal();
    if (Input.hit('Escape') && ui.termOpen) ui.closeTerminal();
    hangar.render();
  } else if (game.mode === 'flight') {
    if (!ui.modalOpen() || flight.v.ended) flight.update(ui.modalOpen() ? 0 : dt);
    flight.render(dt);
  } else {
    // menu backdrop: slow camera drift in the hangar
    hangar.player.yaw += dt * 0.05;
    hangar.camera.rotation.set(0.02, Math.sin(performance.now() / 9000) * 0.6, 0, 'YXZ');
    hangar.camera.position.set(0, 2.2, 16);
    hangar.hands.r.visible = hangar.hands.l.visible = false;
    hangar.render();
  }
  guide.update(dt);
  if (Input.hit('Escape') && !ui.termOpen && game.mode !== 'menu') game.showMenu();
  Input.endFrame();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.__game = { game, S, hangar, flight, ui };
