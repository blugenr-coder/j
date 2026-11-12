import * as THREE from '../vendor/three.module.min.js';
import { S } from './state.js';
import { Hangar } from './hangar.js';
import { Flight } from './flight.js';
import { UI } from './ui.js';
import { Input, isTouch } from './input.js';
import { Audio } from './audio.js';

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
Input.init(canvas);
Input.onLock = locked => document.body.classList.toggle('locked', locked);

let eventTimer = 0;
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  hangar.resize(w, h); flight.resize(w, h);
}
addEventListener('resize', resize); resize();

// menu
const $ = id => document.getElementById(id);
$('m-new').onclick = () => { Audio.unlock(); if (S.started && !confirm('Start a new program? Your current save is replaced.')) return; S.newGame(); game.hideMenu(); game.toHangar(); showHelp(); };
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
    if (!ui.modalOpen()) { eventTimer -= dt; if (eventTimer <= 0) { ui.hangarEvent(); eventTimer = 70 + Math.random() * 80; } }
    if (Input.hit('Tab') || Input.hit('KeyT')) ui.termOpen ? ui.closeTerminal() : ui.openTerminal();
    if (Input.hit('Escape') && ui.termOpen) ui.closeTerminal();
    hangar.render();
  } else if (game.mode === 'flight') {
    if (!ui.modalOpen() || flight.v.ended) flight.update(ui.modalOpen() ? 0 : dt);
    flight.render(dt);
  } else {
    // menu backdrop: slow camera drift in the hangar
    hangar.player.yaw += dt * 0.05;
    hangar.camera.rotation.set(-0.05, hangar.player.yaw, 0, 'YXZ');
    hangar.camera.position.set(-4, 1.65, 9);
    hangar.hands.r.visible = hangar.hands.l.visible = false;
    hangar.render();
  }
  if (Input.hit('Escape') && !ui.termOpen && game.mode !== 'menu') game.showMenu();
  Input.endFrame();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.__game = { game, S, hangar, flight, ui };
