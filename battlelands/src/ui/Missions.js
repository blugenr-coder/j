/* Daily missions with progress bars and claimable rewards, plus permanent
   achievements. */
import { icon } from './Icons.js';
import { $, $$, press, toast, esc, formatTime } from './dom.js';
import { t } from './i18n.js';
import { missionDef, missionText, ACHIEVEMENTS, refreshMissions, secondsToReset } from '../progression/Missions.js';
import { addXP } from '../progression/XPManager.js';

export function claimableCount(save) {
  return save.missions.list.filter(m => !m.claimed && m.progress >= missionDef(m.id).n).length
    + ACHIEVEMENTS.filter(a => !save.achievements[a.id] && a.test(save)).length;
}

export function renderMissions({ app, menu, panel }) {
  const s = app.save;
  if (refreshMissions(s)) app.persist();
  const draw = () => {
    const h = Math.floor(secondsToReset() / 3600), mnt = Math.floor((secondsToReset() % 3600) / 60);
    panel.innerHTML = `
      <div class="panel-head"><h1 class="h2">${t('MISSIONS')}</h1><span class="pill">${icon('clock', { size: 18 })}<span class="small" style="color:#fff">${t('NEW IN')} ${h}h ${mnt}m</span></span></div>
      <div class="scroll">
        <div class="section-title">${icon('missions', { size: 18 })}${t('DAILY MISSIONS')}</div>
        <div id="ml"></div>
        <div class="section-title">${icon('trophy', { size: 18 })}${t('ACHIEVEMENTS')}</div>
        <div id="al"></div>
      </div>`;
    const ml = $('#ml', panel);
    s.missions.list.forEach((m, i) => {
      const def = missionDef(m.id);
      const done = m.progress >= def.n;
      ml.insertAdjacentHTML('beforeend', `<div class="mission card ${done ? 'done' : ''} ${m.claimed ? 'claimed' : ''}" style="animation-delay:${i * 50}ms">
        <div class="t">${m.claimed ? icon('check', { size: 18, color: '#4ADE80' }) : ''}${esc(missionText(m, t))}</div>
        <div class="rw"><span class="small">${t('REWARD')}</span><span class="small" style="color:#60A5FA">+${def.xp} XP</span><span class="small" style="color:#FFD43B">+${def.coins} ${icon('coin', { size: 14, color: '#FFD43B', detail: '#B7791F' })}</span>
          ${done && !m.claimed ? `<button class="btn btn-success btn-sm" data-claim="${i}">${t('CLAIM')}</button>` : ''}</div>
        <div class="bar"><i style="width:${(m.progress / def.n) * 100}%"></i></div>
        <div class="prog num">${Math.min(m.progress, def.n)} / ${def.n}</div>
      </div>`);
    });
    const al = $('#al', panel);
    ACHIEVEMENTS.forEach(a => {
      const got = !!s.achievements[a.id];
      const ready = !got && a.test(s);
      al.insertAdjacentHTML('beforeend', `<div class="ach card ${got ? 'got' : ''}"><span class="badge">${icon(got ? 'trophy' : ready ? 'gift' : 'lock', { size: 24 })}</span>
        <span class="txt">${t(a.text)}<div class="small">+${a.coins} ${t('COINS')}</div></span>
        ${ready ? `<button class="btn btn-success btn-sm" data-ach="${a.id}">${t('CLAIM')}</button>` : got ? `<span class="small" style="color:#4ADE80">${t('DONE')}</span>` : ''}</div>`);
    });
    $$('[data-claim]', panel).forEach(b => press(b, () => {
      const m = s.missions.list[Number(b.dataset.claim)];
      const def = missionDef(m.id);
      m.claimed = true;
      s.coins += def.coins;
      const lv = addXP(s, def.xp);
      app.persist();
      app.audio.play(lv ? 'level' : 'buy');
      toast(`+${def.xp} XP  +${def.coins} ${t('COINS')}`, 'success');
      if (lv) toast(`${t('LEVEL UP!')} ${s.level}`, 'success', 2400);
      menu.bumpCoins(); draw();
    }, { sound: null }));
    $$('[data-ach]', panel).forEach(b => press(b, () => {
      const a = ACHIEVEMENTS.find(x => x.id === b.dataset.ach);
      s.achievements[a.id] = true;
      s.coins += a.coins;
      if (a.unlock && !s.owned.includes(a.unlock)) s.owned.push(a.unlock);
      app.persist();
      app.audio.play('buy');
      toast(`${t('ACHIEVEMENT')}: ${t(a.text)}  +${a.coins}`, 'success');
      menu.bumpCoins(); draw();
    }, { sound: null }));
  };
  draw();
  void formatTime;
}
