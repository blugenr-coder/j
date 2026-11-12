// Guided tutorial for the first contract, plus a "next step" hint afterwards.
// Each step is checked against the live game state, so the guide never gets stuck:
// whatever the player has already done is skipped, and if they undo something the
// guide steps back to it.
import * as THREE from '../vendor/three.module.min.js';
import { PART } from './data.js';
import { S } from './state.js';
import { isTouch } from './input.js';

const $ = s => document.querySelector(s);
const T = (desk, touch) => (isTouch ? touch : desk);

export class Guide {
  constructor(game, ui, hangar) {
    this.game = game; this.ui = ui; this.hangar = hangar;
    this.marks = {};
    this.start = null;
    this.hlEl = null;
    this.panel = $('#guide'); this.arrow = $('#guide-arrow');
    $('#guide-skip').addEventListener('click', e => { e.stopPropagation(); this.finish(true); });
    // 3D beacon: a light column with a bobbing arrow on top
    const g = new THREE.Group();
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 14, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0x45c4ee, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    col.position.y = 7; g.add(col);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.75, 0.95, 32), new THREE.MeshBasicMaterial({ color: 0x45c4ee, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; g.add(ring); this.ring = ring;
    const arr = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 4), new THREE.MeshBasicMaterial({ color: 0x45c4ee }));
    arr.rotation.x = Math.PI; g.add(arr); this.arr = arr;
    g.visible = false; hangar.scene.add(g); this.beacon = g;
  }

  get active() { return S.started && !S.flags.tutorialDone; }
  mark(k) { this.marks[k] = true; }
  restart() { S.flags.tutorialDone = false; this.marks = {}; this.start = null; S.save(); }
  finish(skipped) {
    S.flags.tutorialDone = true; S.save();
    this.panel.classList.remove('on'); this.arrow.classList.remove('on'); this.beacon.visible = false; this.highlight(null);
    this.ui.toast(skipped ? 'Tutorial skipped. The NEXT STEP line in the top-left panel keeps guiding you.' : 'Tutorial complete! From now on, follow the NEXT STEP line in the top-left panel.', 'good');
    this.ui.refreshTop();
  }

  // ---------- state helpers ----------
  plan() { return S.blueprints[S.plan]; }
  planMissing() {
    const bp = this.plan(); if (!bp) return null;
    const have = {}; S.inventory.forEach(p => { have[p.id] = (have[p.id] || 0) + 1; });
    const miss = [];
    for (const id of bp.ids) { if (have[id]) have[id]--; else miss.push(id); }
    return miss;
  }
  padComplete() {
    const bp = this.plan(); if (!bp || !bp.ids.length) return false;
    const want = bp.ids.slice().reverse(), have = S.padStack().map(p => p.id);
    return want.length === have.length && want.every((id, i) => id === have[i]);
  }
  nextItem() {
    const id = this.hangar.nextPlanId; if (!id) return null;
    let best = null, bd = 1e9; const P = this.hangar.player;
    for (const it of this.hangar.items.values()) {
      if (it.onPad || it.def.id !== id) continue;
      const d = Math.hypot(it.pos.x - P.x, it.pos.z - P.z); if (d < bd) { bd = d; best = it; }
    }
    return best;
  }

  // ---------- step resolution ----------
  // returns {n, total, title, text, world?, el?, small?}
  step() {
    const ui = this.ui, H = this.hangar, mode = this.game.mode;
    const total = 11;
    if (mode === 'flight') {
      const f = this.game.flight, v = f.v; if (!v) return null;
      if (v.ended) return null;
      if (!v.ignited) return { n: 8, total, title: 'Ignite the engine', text: T('Press <b>IGNITE</b> or the <kbd>Space</kbd> key. Engines take a second to spool up.', 'Tap the orange <b>IGNITE</b> button. Engines take a second to spool up.'), el: '#f-stage', small: 'If an engine fails to light, the button says RETRY IGNITION: press it again.' };
      const burning = v.live().some(p => p.burning);
      if (burning || v.vVert > 0) return { n: 9, total, title: 'Climb', text: `Goal: pass <b>1 km</b> (you are at ${Math.round(v.alt)} m). Wind and slightly crooked engines push it off course: keep it upright with ${T('<kbd>A</kbd> / <kbd>D</kbd>', 'the <b>◀ ▶</b> buttons')}. Small taps work best: it keeps turning after you let go. Watch PITCH on the left (0° = straight up).`, small: 'When the fuel runs out it keeps coasting up for a while. Objectives on the right turn green when done.' };
      if (!v.chuteOn) {
        const ok = v.speed < 300;
        return { n: 10, total, title: 'Open the parachute', text: ok ? `You are falling. Open the parachute now: ${T('press <b>CHUTE</b> or <kbd>P</kbd>', 'tap <b>CHUTE</b>')}.` : 'Too fast for the parachute (over 300 m/s it tears). Wait a moment…', el: ok ? '#f-chute' : null };
      }
      if (this.game.flight.warpI === 0 && v.alt > 400) return { n: 11, total, title: 'Speed up time', text: `Coming down under a parachute is slow. Press <b>+</b> next to the time-warp readout to go faster${T(' (or the <kbd>.</kbd> key)', '')}. It slows back to normal near the ground.`, el: '#f-warp-up' };
      return { n: 11, total, title: 'Land', text: `Touch down below <b>${v.landLimit().toFixed(0)} m/s</b> for a safe landing. The parachute does the work. Just wait.` };
    }
    if (mode !== 'hangar') return null;
    // the pre-flight review is open
    if ($('#modal.on .review')) return { n: 7, total, title: 'Pre-flight review', text: 'This screen lists any problems with your rocket. Press <b>ROLL OUT</b> to go to the launch pad.', el: '.review .pri' };
    const P = H.player;
    if (!this.start) this.start = { x: P.x, z: P.z, yaw: P.yaw };
    if (!this.marks.moved && (Math.hypot(P.x - this.start.x, P.z - this.start.z) > 1.2 || Math.abs(P.yaw - this.start.yaw) > 0.6)) this.mark('moved');
    if (!this.marks.moved) return { n: 1, total, title: 'Move around', text: T('<b>Click the screen</b> so the mouse controls your view, then walk with <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>.', 'Drag the <b>left side</b> of the screen to walk. Drag the <b>right side</b> to look around.'), small: 'You are in your rocket hangar. You build rockets here by hand.' };
    const missing = this.planMissing();
    const termOpen = ui.termOpen;
    if (!this.marks.termOpened && !termOpen) return { n: 2, total, title: 'Go to the terminal', text: `Follow the <b class="c">blue light</b> to the computer terminal and ${T('aim at it and press <kbd>E</kbd>', 'look at it and tap <b>USE</b>')}.`, world: () => H.terminal.position.clone().setY(1.2), small: T('Shortcut: the T key or the TERMINAL button at top right.', 'Shortcut: the TERMINAL button at top right.') };
    if (missing && missing.length) {
      if (!termOpen) return { n: 4, total, title: 'Buy your parts', text: 'Open the terminal again to buy the parts for your rocket.', world: () => H.terminal.position.clone().setY(1.2), el: '#btn-term' };
      if (ui.tab === 'contract' && !this.marks.readContract) return { n: 3, total, title: 'Your contract', text: 'This is your mission: <b>reach 1 km altitude, then land</b>. Your budget is shown at the top. Now open the <b>BLUEPRINTS</b> tab.', el: '#term-tabs [data-tab="blueprints"]' };
      if (ui.tab !== 'blueprints') return { n: 4, total, title: 'Open the blueprints', text: 'Go to the <b>BLUEPRINTS</b> tab. A starter rocket is already designed for you.', el: '#term-tabs [data-tab="blueprints"]' };
      return { n: 4, total, title: 'Buy the parts', text: `The <b>Starter hopper</b> needs ${missing.length} part${missing.length > 1 ? 's' : ''}. Press <b>BUY MISSING</b>. They are delivered to the yellow DELIVERY bay in the hangar.`, el: '.bp-actions .buy-missing', small: 'Later you will design your own rockets here: the list on the left adds parts, and the review on the right warns about build mistakes.' };
    }
    if (termOpen && !this.padComplete()) return { n: 5, total, title: 'Back to the hangar', text: 'Parts bought! Close the terminal and build the rocket with your hands.', el: '#term-close', small: 'There is also a CRANE ASSEMBLE button that builds it for you, but try it by hand first.' };
    if (!this.padComplete()) {
      const held = H.held, next = H.nextPlanId;
      const name = next ? PART[next].name : 'next part';
      if (held && held.def.id === next) return { n: 6, total, title: `Place the ${held.def.name}`, text: `Carry it to the <b>launch pad</b> (the orange ring) and aim at it. When the blue ghost appears, ${T('press <kbd>E</kbd>', 'tap <b>PLACE</b>')}.`, world: () => new THREE.Vector3(0, 0.5 + H.stackH, 0) };
      if (held) return { n: 6, total, title: 'Wrong part', text: `You are holding the ${held.def.name}, but the next one is the <b>${name}</b>. ${T('Press <kbd>E</kbd> away from the pad to drop it.', 'Tap <b>DROP</b> away from the pad.')}` };
      const it = this.nextItem();
      const built = S.pad.length, totalParts = this.plan()?.ids.length || 0;
      return { n: 6, total, title: `Build the rocket · part ${built + 1} of ${totalParts}`, text: `Rockets are built <b>from the bottom up</b>. Walk to the <b class="c">blue light</b> and ${T('press <kbd>E</kbd>', 'tap <b>GRAB</b>')} to pick up the <b>${name}</b>.`, world: it ? () => it.pos.clone().setY(it.def.h + 0.3) : null, small: 'The small hologram next to the pad shows the finished rocket. The orange part is the next one.' };
    }
    return { n: 7, total, title: 'Launch!', text: `Your rocket is complete. Walk to the red <b>LAUNCH</b> console and ${T('press <kbd>E</kbd>', 'tap <b>LAUNCH</b>')}.`, world: () => H.console.position.clone().setY(1.4) };
  }

  // short helper text for after the tutorial
  nextHint() {
    if (this.game.mode !== 'hangar') return '';
    const L = S.lvl(); const bp = this.plan();
    const needs = L.quests.map(q => q.type === 'sci' ? PART_BY_SCI[q.k] : q.type === 'deploy' ? (q.k === 'cube' ? 'sat_cube' : 'sat_com') : q.type === 'crew' ? 'crew' : null).filter(Boolean);
    const lacks = bp ? needs.filter(n => n === 'crew' ? !bp.ids.some(id => PART[id].crew) : !bp.ids.includes(n)) : needs;
    if (!bp || !bp.ids.length) return 'Design a rocket: Terminal → Blueprints';
    if (lacks.length) return `Your design is missing ${lacks.map(n => n === 'crew' ? 'a crew pod' : PART[n].name).join(', ')}: edit it in Blueprints`;
    const miss = this.planMissing();
    if (miss && miss.length) return `Buy ${miss.length} missing part${miss.length > 1 ? 's' : ''}: Terminal → Blueprints → Buy missing`;
    if (!this.padComplete()) { const n = this.hangar.nextPlanId; return n ? `Build: place the ${PART[n].name} on the pad (or use the crane)` : 'The pad does not match your blueprint: clear the pad or change the design'; }
    return 'Rocket ready: go to the red LAUNCH console';
  }

  highlight(sel) {
    const el = sel ? document.querySelector(sel) : null;
    if (el === this.hlEl) return;
    this.hlEl?.classList.remove('guide-hl');
    this.hlEl = el; el?.classList.add('guide-hl');
  }

  update(dt) {
    if (!this.active) { this.beacon.visible = false; return; }
    // never show over the flight report or a memo
    const report = $('#modal.on .report'), memo = $('#modal.on .memo'), menu = $('#menu.on');
    const s = report || memo || menu ? null : this.step();
    if (!s) { this.panel.classList.remove('on'); this.arrow.classList.remove('on'); this.beacon.visible = false; this.highlight(null); return; }
    if (this.ui.termOpen && this.ui.tab === 'contract') this.mark('seenContract');
    if (this.ui.termOpen) this.mark('termOpened');
    if (this.ui.termOpen && this.ui.tab === 'blueprints') this.mark('readContract');
    const key = s.title + s.text;
    if (this.lastKey !== key) {
      this.lastKey = key;
      $('#guide-n').textContent = `STEP ${s.n} / ${s.total}`;
      $('#guide-title').textContent = s.title;
      $('#guide-text').innerHTML = s.text;
      $('#guide-small').innerHTML = s.small || '';
      this.panel.classList.add('on');
      this.panel.classList.remove('pop'); void this.panel.offsetWidth; this.panel.classList.add('pop');
    }
    this.panel.classList.toggle('low', !!$('#modal.on .review'));
    this.highlight(s.el || null);
    // world target in the hangar: beacon + off-screen arrow
    const wp = this.game.mode === 'hangar' && s.world ? s.world() : null;
    this.beacon.visible = !!wp;
    if (!wp) { this.arrow.classList.remove('on'); return; }
    const t = performance.now() / 1000;
    this.beacon.position.set(wp.x, 0, wp.z);
    this.arr.position.y = wp.y + 0.9 + Math.sin(t * 3) * 0.15; this.arr.rotation.y = t * 1.5;
    this.ring.scale.setScalar(1 + (t % 1) * 0.6); this.ring.material.opacity = 0.9 * (1 - (t % 1));
    const cam = this.hangar.camera;
    const p = wp.clone().project(cam);
    const behind = p.z > 1;
    const W = innerWidth, Hh = innerHeight;
    let x = (p.x + 1) / 2 * W, y = (1 - p.y) / 2 * Hh;
    const m = 70;
    const onScreen = !behind && x > m && x < W - m && y > m && y < Hh - m;
    const dist = Math.hypot(wp.x - this.hangar.player.x, wp.z - this.hangar.player.z);
    if (onScreen) { this.arrow.classList.remove('on'); return; }
    if (behind) { x = W - x; y = Hh - y; }
    const cx = W / 2, cy = Hh / 2;
    let dx = x - cx, dy = y - cy;
    if (behind && Math.abs(dx) < 1 && Math.abs(dy) < 1) dx = 1;
    const k = Math.min((cx - m) / Math.abs(dx || 1e-6), (cy - m) / Math.abs(dy || 1e-6));
    const ax = cx + dx * k, ay = cy + dy * k;
    this.arrow.style.transform = `translate(${ax}px, ${ay}px)`;
    $('#guide-arrow i').style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
    $('#guide-arrow span').textContent = Math.round(dist) + ' m';
    this.arrow.classList.add('on');
  }
}

const PART_BY_SCI = { baro: 'sci_baro', thermo: 'sci_thermo', photo: 'sci_cam', sample: 'sci_sampler' };
