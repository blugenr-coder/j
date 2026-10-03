/* The landing map: a compact overview of the island. Tap anywhere to set
   your drop point; a countdown deploys you automatically. Short on purpose. */
import { el, $, press, sfx } from './dom.js';
import { icon } from './Icons.js';
import { t } from './i18n.js';
import { drawFullMap } from './Minimap.js';

export function deployScreen(root, match, { onDeploy, tutorial }) {
  const n = el(`<div class="screen deploy">
    <div class="head"><div class="h2">${t('CHOOSE YOUR LANDING')}</div><div class="small">${t('TAP THE MAP')}</div></div>
    <div class="map-wrap"><canvas aria-label="${t('MAP')}"></canvas></div>
    <div class="foot"><div class="countdown num" id="cd">9</div><button class="btn btn-play" id="go">${icon('play', { size: 26 })}<span>${t('DEPLOY')}</span></button></div>
  </div>`);
  root.appendChild(n);
  const cv = $('canvas', n), wrap = $('.map-wrap', n);
  let marker = [match.player.landX, match.player.landY];
  const size = () => Math.floor(Math.min(wrap.clientWidth, wrap.clientHeight, 620));
  const draw = () => { const s = size(); cv.style.width = cv.style.height = s + 'px'; drawFullMap(cv, match, { marker, zone: false }); };
  draw();
  const onResize = () => draw();
  window.addEventListener('resize', onResize);

  cv.addEventListener('pointerdown', e => {
    const r = cv.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * match.map.size, y = ((e.clientY - r.top) / r.height) * match.map.size;
    match.setPlayerLanding(x, y);
    marker = [match.player.landX, match.player.landY];
    sfx('click');
    draw();
    tutorial?.done('land');
  });
  let done = false;
  const finish = () => {
    if (done) return; done = true;
    window.removeEventListener('resize', onResize);
    n.classList.add('out'); setTimeout(() => n.remove(), 200);
    onDeploy();
  };
  press($('#go', n), finish, { sound: 'deploy', vibrate: 20 });
  if (tutorial) tutorial.point('land', cv, t('TAP THE MAP TO PICK A LANDING SPOT'), 'center');
  return {
    update(remaining) {
      const v = Math.max(0, Math.ceil(remaining));
      const cd = $('#cd', n);
      if (cd && cd.textContent !== String(v)) { cd.textContent = v; if (v <= 3) sfx('tick'); }
      if (remaining <= 0) finish();
    },
    close: finish,
  };
}
