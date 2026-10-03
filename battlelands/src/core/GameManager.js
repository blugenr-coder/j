/* The conductor. Owns the app state machine and the frame loop:
     initializeGame → loadSave → showMainMenu → startMatch → (deploy → play)
     → calculateResults → awardXP/awardCurrency → saveProgress → showResults
   Everything else is a system it starts, feeds and stops. */

import { CONFIG } from './config.js';
import { AppState, gameState } from './GameState.js';
import { SaveManager } from './SaveManager.js';
import { bus } from './EventBus.js';
import { MatchManager, MatchPhase } from './MatchManager.js';
import { damp, lerp, easeOutCubic } from './math.js';
import { getMap } from '../world/MapManager.js';
import { getNav } from '../bots/BotNavigation.js';
import { getGround } from '../render/GroundRenderer.js';
import { Camera } from '../render/Camera.js';
import { Effects } from '../render/Effects.js';
import { Renderer } from '../render/Renderer.js';
import { AudioManager } from '../audio/AudioManager.js';
import { PlayerInput } from '../player/PlayerInput.js';
import { HUD } from '../ui/HUD.js';
import { MainMenu } from '../ui/MainMenu.js';
import { bootScreen, matchmakingScreen } from '../ui/Loading.js';
import { deployScreen } from '../ui/Deploy.js';
import { resultsScreen } from '../ui/Results.js';
import { Tutorial } from '../ui/Tutorial.js';
import { settingsHTML, bindSettings } from '../ui/Settings.js';
import { setAudio, modal, toast, $, el } from '../ui/dom.js';
import { icon } from '../ui/Icons.js';
import { t } from '../ui/i18n.js';
import { matchRewards, addXP, recordStats } from '../progression/XPManager.js';
import { refreshMissions, applyMatchToMissions, newAchievements, missionDef } from '../progression/Missions.js';
import { RARITY_INFO } from '../combat/WeaponManager.js';
import { defaultSettings } from './SaveManager.js';

export class GameManager {
  constructor() {
    this.ui = document.getElementById('ui');
    this.canvas = document.getElementById('game');
    this.state = AppState.BOOT;
    this.match = null;
    this.paused = false;
    this.last = performance.now();
  }

  get save() { return SaveManager.data; }
  get settings() { return SaveManager.data.settings; }

  /* ---- boot -------------------------------------------------------- */

  async initializeGame() {
    this.loadSave();
    const boot = bootScreen(this.ui);
    this.audio = new AudioManager(this.settings);
    setAudio(this.audio);
    this.camera = new Camera();
    this.effects = new Effects(this.camera, this.settings);
    this.renderer = new Renderer(this.canvas, this.camera, this.effects, this.settings);
    this.input = new PlayerInput(this.settings);
    this.hud = new HUD(this.ui, { input: this.input, settings: this.settings, onPause: () => this.pause() });
    this.effects.onPlayerHit = () => { this.renderer.hurt = 1; };
    this.applySettings();

    // Build the shared world in slices so the bar visibly moves.
    const steps = [() => getMap(), () => getNav(getMap()), () => getGround(getMap())];
    for (let i = 0; i < steps.length; i++) {
      boot.progress((i + 0.3) / steps.length);
      await nextFrame();
      steps[i]();
    }
    boot.progress(1);
    await boot.close();

    // Audio needs a gesture; the first tap anywhere unlocks it.
    const unlock = () => { this.audio.unlock(); this.audio.setMusic(this.state === AppState.PLAYING ? 'match' : 'menu'); };
    window.addEventListener('pointerdown', unlock, { once: false, passive: true });
    window.addEventListener('keydown', unlock, { once: false });
    window.addEventListener('resize', () => this.onResize());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { this.audio.suspend(); if (this.state === AppState.PLAYING && this.match?.phase === MatchPhase.LIVE) this.pause(); }
      else this.audio.resume();
    });
    this.onResize();
    this.menu = new MainMenu(this.ui, this.appApi());
    this.showMainMenu();
    requestAnimationFrame(now => this.frame(now));
  }

  loadSave() {
    SaveManager.load();
    if (refreshMissions(this.save)) SaveManager.save();
  }

  appApi() {
    const gm = this;
    return {
      get save() { return SaveManager.data; },
      get settings() { return SaveManager.data.settings; },
      audio: this.audio,
      persist: () => SaveManager.save(),
      saveAvailable: () => SaveManager.available,
      applySettings: () => gm.applySettings(),
      resetSettings: () => { Object.assign(gm.settings, defaultSettings()); SaveManager.save(); gm.applySettings(); },
      resetProgress: () => { SaveManager.resetProgress(); refreshMissions(SaveManager.data); SaveManager.save(); gm.rebindSettings(); },
      play: () => gm.startMatch(),
    };
  }

  /* Settings objects are shared by reference; after a full reset, re-point. */
  rebindSettings() {
    const s = this.settings;
    this.audio.settings = s; this.effects.settings = s; this.renderer.settings = s; this.input.settings = s; this.hud.settings = s;
    this.menu.app = this.appApi();
    this.applySettings();
  }

  applySettings() {
    const s = this.settings;
    const b = document.body.classList;
    b.toggle('high-contrast', s.highContrast);
    b.toggle('large-ui', s.largeUi);
    b.toggle('reduced-motion', s.reducedMotion);
    const root = document.documentElement.style;
    root.setProperty('--btn-scale', s.buttonSize);
    root.setProperty('--joy-scale', s.joystickSize);
    document.documentElement.lang = s.language;
    this.audio?.applyVolumes();
    this.onResize();
  }

  onResize() {
    if (!this.renderer) return;
    this.renderer.resize();
    this.hud?.mini?.resize();
    this.input?.placeFixedJoystick();
  }

  /* ---- menu ---------------------------------------------------------- */

  showMainMenu(tab = 'home') {
    this.state = gameState.app = AppState.MENU;
    this.canvas.style.visibility = 'hidden';
    this.audio.setMusic('menu');
    this.menu.mount(tab);
  }

  /* ---- match lifecycle ---------------------------------------------- */

  startMatch({ quick = false } = {}) {
    if (this.state === AppState.MATCHMAKING) return;
    this.menu.unmount();
    this.state = gameState.app = AppState.MATCHMAKING;
    matchmakingScreen(this.ui, this.save.equipped.character, () => this.beginDeployment(), { quick });
  }

  beginDeployment() {
    const s = this.save;
    const seed = (Math.random() * 2 ** 32) >>> 0;
    const m = new MatchManager({ seed, playerName: s.name, skin: s.equipped.character, trail: s.equipped.trail, gentle: !s.tutorialDone });
    this.match = gameState.match = m;
    this.endScheduled = false;
    this.paused = false;
    this.wireMatchAudio(m);
    this.effects.attach(m);
    m.startDeployment();
    this.state = gameState.app = AppState.DEPLOY;
    this.canvas.style.visibility = 'visible';
    this.camera.setZoomMul(CONFIG.camera.deployZoom);
    this.camera.snap(m.map.size / 2, m.map.size / 2);
    this.audio.setMusic('match');
    this.tutorial = s.tutorialDone ? null : new Tutorial(this.ui, () => { this.save.tutorialDone = true; SaveManager.save(); });
    this.deployUI = deployScreen(this.ui, m, { onDeploy: () => this.onDeploy(), tutorial: this.tutorial });
  }

  onDeploy() {
    const m = this.match;
    if (!m) return;
    this.deployUI = null;
    m.deploy();
    this.camera.snap(m.player.x, m.player.y);
    this.state = gameState.app = AppState.PLAYING;
    this.hud.mount(m, this.canvas);
    this.hud.setControlsVisible(true);
    if (this.tutorial) this.tutorial.mountSkip(this.hud.node);
    m.bus.on('matchStart', () => {
      const go = this.hud.centerBanner(t('GO!'), '', 'win');
      go.querySelector('.h1').classList.add('go');
      setTimeout(() => go.remove(), 900);
    });
  }

  wireMatchAudio(m) {
    const a = this.audio, b = m.bus;
    const vol = (x, y) => { const p = m.player; const d = Math.hypot(x - p.x, y - p.y); return Math.max(0, 1 - d / 900); };
    b.on('shot', e => a.play('shot_' + e.weapon.id, e.ent === m.player ? 1 : vol(e.ent.x, e.ent.y) * 0.7));
    b.on('damage', e => {
      if (e.source === m.player && e.kind !== 'zone') { a.play(e.armor ? 'hit_armor' : 'hit'); }
      if (e.target === m.player) { a.play('hurt'); a.vibrate(e.amount > 20 ? 40 : 15); }
    });
    b.on('impact', e => a.play('impact', vol(e.x, e.y) * 0.6));
    b.on('elimination', e => {
      if (e.killer === m.player) { a.play('elim'); a.vibrate([20, 30, 40]); }
      else a.play('elim_other', vol(e.target.x, e.target.y));
    });
    b.on('explosion', e => { a.play('explosion', vol(e.x, e.y) + 0.15); if (vol(e.x, e.y) > 0.6) a.vibrate(50); });
    b.on('pickup', e => { if (e.ent === m.player) a.play(RARITY_INFO[e.item.rarity].rank >= 2 ? 'pickup_rare' : 'pickup'); });
    b.on('healDone', e => { if (e.ent === m.player) a.play('heal'); });
    b.on('reloadStart', e => { if (e.ent === m.player) a.play('reload'); });
    b.on('landed', e => { if (e.ent === m.player) { a.play('land'); a.vibrate(30); } });
    b.on('utility', e => { if (e.ent === m.player) a.play(e.key === 'soda' ? 'heal' : 'switch'); });
    b.on('emote', e => { if (e.ent !== m.player) a.play('emote', vol(e.ent.x, e.ent.y) * 0.5); });
  }

  pause() {
    if (this.state !== AppState.PLAYING || this.paused || !this.match) return;
    this.paused = true;
    const body = el(`<div style="text-align:left;max-height:52vh;overflow:auto;touch-action:pan-y">${settingsHTML(this.settings, true)}</div>`);
    bindSettings(body, this.appApi());
    const resume = () => { this.paused = false; this.last = performance.now(); };
    const mdl = modal({
      title: t('PAUSED'), body, cls: 'pause',
      actions: [
        { label: t('RESUME'), cls: 'btn-play', icon: 'play', onClick: resume },
        { label: t('LEAVE MATCH'), cls: 'btn-danger', icon: 'close', onClick: () => {
          modal({ title: t('LEAVE MATCH'), body: `<p>${t('Leave this match? You will be placed where you are.')}</p>`, dismissable: false, actions: [
            { label: t('LEAVE MATCH'), cls: 'btn-danger', onClick: () => { this.paused = false; this.finishMatch(true); } },
            { label: t('CANCEL'), cls: 'btn-secondary', sound: 'back', onClick: resume },
          ] });
        } },
      ],
    });
    // Closing with the X or the overlay also resumes.
    const obs = new MutationObserver(() => { if (!mdl.node.isConnected) { obs.disconnect(); if (this.paused && !$('.modal-overlay')) resume(); } });
    obs.observe(document.getElementById('modals'), { childList: true });
  }

  /* ---- frame --------------------------------------------------------- */

  frame(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const m = this.match;
    if (m && (this.state === AppState.DEPLOY || this.state === AppState.PLAYING) && !this.paused) {
      this.updateMatch(dt);
    }
    requestAnimationFrame(n => this.frame(n));
  }

  updateMatch(dt) {
    const m = this.match;
    const live = m.phase === MatchPhase.LIVE || m.phase === MatchPhase.DESCENT || m.phase === MatchPhase.OVER;
    const inp = this.state === AppState.PLAYING && live ? this.input.read(m, this.camera) : null;
    m.update(dt, inp);

    // Camera
    const p = m.player;
    if (m.phase === MatchPhase.DEPLOY) {
      this.camera.setZoomMul(CONFIG.camera.deployZoom);
      this.camera.follow(m.map.size / 2, m.map.size / 2, dt, 0, 0, this.settings.reducedMotion);
      this.deployUI?.update(m.phaseT);
    } else {
      if (m.phase === MatchPhase.DESCENT) {
        this.camera.setZoomMul(lerp(CONFIG.camera.deployZoom, 1, easeOutCubic(1 - p.z)));
      } else if (this.camera.zoomMul !== 1) {
        this.camera.setZoomMul(lerp(this.camera.zoomMul, 1, damp(6, dt)));
        if (Math.abs(this.camera.zoomMul - 1) < 0.002) this.camera.setZoomMul(1);
      }
      const lead = p.alive && (inp?.aiming || p.wantFire) ? 1 : 0.5;
      const mv = p.alive && p.moving;
      const ax = mv || lead === 1 ? Math.cos(lead === 1 ? p.aimAngle : p.moveAngle) * lead : 0;
      const ay = mv || lead === 1 ? Math.sin(lead === 1 ? p.aimAngle : p.moveAngle) * lead : 0;
      this.camera.follow(p.x, p.y, dt, ax, ay, this.settings.reducedMotion);
    }

    this.effects.update(dt, m);
    this.renderer.render(m, dt, { aiming: !!(inp && inp.aiming && this.input.fireTouch) || !!(inp && inp.aiming && this.input.mouse.active) });
    if (this.state === AppState.PLAYING) {
      this.hud.update(dt, m);
      this.tutorial?.update(dt, m, this.hud);
    }

    // End conditions
    if (!this.endScheduled && this.state === AppState.PLAYING) {
      if (!p.alive) {
        this.endScheduled = true;
        this.hud.setControlsVisible(false);
        this.hud.centerBanner(t('ELIMINATED'), `#${p.place} · ${p.kills} ${t('KILLS')}`, 'lose');
        setTimeout(() => this.finishMatch(), CONFIG.match.resultsDelay * 1000);
      } else if (m.phase === MatchPhase.OVER && m.winner === p) {
        this.endScheduled = true;
        this.hud.setControlsVisible(false);
        this.hud.centerBanner(t('VICTORY!'), t('LAST ONE STANDING'), 'win');
        this.audio.play('victory');
        setTimeout(() => this.finishMatch(), 2200);
      }
    }
  }

  /* calculateResults → awardXP → awardCurrency → saveProgress → showResults */
  finishMatch(left = false) {
    const m = this.match;
    if (!m || this.state === AppState.RESULTS) return;
    const s = this.save;
    let result = m.result;
    if (!result) {
      // Left mid-match: placed at the current standing.
      const p = m.player;
      p.place = m.aliveCount();
      p.deathT = m.time;
      result = m.calculateResults(false);
    }
    void left;
    const before = { level: s.level, xp: s.xp };
    const rewards = matchRewards(result);
    recordStats(s, result);
    const missionsDone = applyMatchToMissions(s, result);
    let missionXP = 0, missionCoins = 0;
    for (const mm of missionsDone) { const d = missionDef(mm.id); mm.claimed = true; missionXP += d.xp; missionCoins += d.coins; }
    rewards.missionXP = missionXP; rewards.missionCoins = missionCoins;
    addXP(s, rewards.totalXP + missionXP);
    s.coins += rewards.coins + missionCoins;
    const achievements = newAchievements(s);
    if (this.tutorial) { s.tutorialDone = true; this.tutorial.finish(); this.tutorial = null; }
    SaveManager.save();
    bus.emit('matchFinished', { result });

    // tear down the match UI
    this.hud.unmount();
    this.effects.detach();
    this.match = gameState.match = null;
    this.canvas.style.visibility = 'hidden';
    this.state = gameState.app = AppState.RESULTS;
    this.audio.setMusic('menu');
    const after = { level: s.level, xp: s.xp };
    const scr = resultsScreen(this.ui, {
      result, rewards, before, after, missionsDone, achievements, save: s, settings: this.settings,
      onPlayAgain: () => { scr.close(); this.startMatch({ quick: true }); },
      onMenu: () => { scr.close(); this.showMainMenu(); },
    });
  }
}

const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
void icon;
