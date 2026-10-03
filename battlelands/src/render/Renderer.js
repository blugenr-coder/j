/* Draws the match. Layer order is the design's depth hierarchy:
   ground → loot → low props → characters → bushes → walls/roofs → canopies
   → effects → zone → screen-space text. Only what the camera can see is
   touched: every layer is collected through a spatial-grid query. */

import { CONFIG } from '../core/config.js';
import { getGround, GROUND_SCALE, COLORS } from './GroundRenderer.js';
import { drawTopDown } from '../player/PlayerAnimation.js';
import { activeWeapon } from '../player/PlayerStats.js';
import { iconImage } from '../ui/Icons.js';
import { itemIcon, itemColor } from '../world/LootManager.js';
import { RARITY_INFO } from '../combat/WeaponManager.js';
import { characterById } from '../progression/Cosmetics.js';
import { MatchPhase } from '../core/MatchManager.js';
import { dist } from '../core/math.js';

const NAVY = '#10162A';

export class Renderer {
  constructor(canvas, camera, effects, settings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.camera = camera;
    this.effects = effects;
    this.settings = settings;
    this.roofAlpha = new Map();
    this.hurt = 0;        // red vignette 0..1
    this.time = 0;
    this._low = []; this._walls = []; this._trees = []; this._tall = [];
  }

  resize() {
    const dprCap = this.settings.graphics === 'low' ? 1.25 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const w = window.innerWidth, h = window.innerHeight;
    this.canvas.width = Math.round(w * dpr); this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = w + 'px'; this.canvas.style.height = h + 'px';
    this.camera.resize(w, h, dpr);
    this.dpr = dpr;
  }

  render(match, dt, ui = {}) {
    const ctx = this.ctx, cam = this.camera, map = match.map;
    this.time += dt;
    const player = match.player;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = COLORS.ocean;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    cam.apply(ctx);
    const v = cam.view(40);

    // Ground
    const g = getGround(map), k = GROUND_SCALE;
    const x0 = Math.max(0, v.x0), y0 = Math.max(0, v.y0), x1 = Math.min(map.size, v.x1), y1 = Math.min(map.size, v.y1);
    if (x1 > x0 && y1 > y0) ctx.drawImage(g, x0 * k, y0 * k, (x1 - x0) * k, (y1 - y0) * k, x0, y0, x1 - x0, y1 - y0);
    this._oceanShimmer(ctx, v, map);

    // Next safe zone outline (only once announced)
    const z = match.zone;
    if (match.phase === MatchPhase.LIVE && (z.stage === 'warning' || z.stage === 'shrinking') && z.nextCenter) {
      ctx.setLineDash([22, 16]); ctx.lineDashOffset = -this.time * 30;
      ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath(); ctx.arc(z.nextCenter.x, z.nextCenter.y, Math.max(1, z.nextRadius), 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Collect static props in view, by layer.
    const low = this._low, walls = this._walls, trees = this._trees, tall = this._tall;
    low.length = walls.length = trees.length = tall.length = 0;
    map.grid.query(v.x0 - 120, v.y0 - 120, v.x1 + 120, v.y1 + 120, ob => {
      if (ob.kind === 'pier') return;
      if (ob.building) return; // building walls are drawn with their building
      if (ob.kind === 'tree') trees.push(ob);
      else if (ob.height >= 55 || ob.kind === 'fortwall') tall.push(ob);
      else low.push(ob);
    });

    // Loot
    match.loot.grid.query(v.x0, v.y0, v.x1, v.y1, it => { if (it.active) this._drawItem(ctx, match, it, player); });

    // Shadows first so nothing casts onto its own top.
    ctx.fillStyle = 'rgba(16,22,42,0.18)';
    for (const t of trees) { ctx.beginPath(); ctx.ellipse(t.x + 14, t.y + 12, t.canopy * 0.9, t.canopy * 0.75, 0, 0, Math.PI * 2); ctx.fill(); }
    for (const o of low) this._drawLow(ctx, o);

    // Projectiles and thrown things
    this._drawProjectiles(ctx, match);

    // Characters (y-sorted)
    const ents = match.entities.filter(e => e.alive && e.x > v.x0 - 60 && e.x < v.x1 + 60 && e.y > v.y0 - 60 && e.y < v.y1 + 60);
    ents.sort((a, b) => a.y - b.y);
    // Player marker + aim guide under the player
    if (player.alive && !player.airborne) this._drawPlayerGuide(ctx, match, player, ui);
    for (const e of ents) this._drawEntity(ctx, match, e, player);

    // Bushes over characters: hiding in grass is a real mechanic.
    map.bushGrid.query(v.x0 - 60, v.y0 - 60, v.x1 + 60, v.y1 + 60, b => this._drawBush(ctx, b, player));

    // Buildings: walls + roofs
    map.buildingGrid.query(v.x0 - 100, v.y0 - 100, v.x1 + 100, v.y1 + 100, b => this._drawBuilding(ctx, b, player, dt));
    for (const o of tall) this._drawTall(ctx, o);
    for (const t of trees) this._drawTree(ctx, t, player);

    // Smoke clouds
    for (const s of match.smokes) {
      ctx.globalAlpha = Math.min(1, s.t / 1.5) * 0.85;
      for (let i = 0; i < 6; i++) {
        const a = i * 1.05 + this.time * 0.3;
        ctx.fillStyle = i % 2 ? '#E2E8F0' : '#CBD5E1';
        ctx.beginPath(); ctx.arc(s.x + Math.cos(a) * s.r * 0.45, s.y + Math.sin(a) * s.r * 0.45, s.r * 0.55, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Overhead: health bars, names, emotes (above roofs so they read)
    for (const e of ents) this._drawOverhead(ctx, match, e, player);

    this.effects.draw(ctx);

    // Zone: everything outside the circle is tinted and the edge glows.
    if (match.phase === MatchPhase.LIVE || match.phase === MatchPhase.OVER) this._drawZone(ctx, z, v);

    // Screen space
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.effects.drawText(ctx, cam, this.dpr, this.settings.largeUi ? 1.2 : 1);
    this._drawScreenFx(ctx, match, player);
  }

  /* ---------------------------------------------------------------- */

  _oceanShimmer(ctx, v, map) {
    if (this.settings.graphics === 'low') return;
    const B = map.border;
    if (v.x0 > B && v.y0 > B && v.x1 < map.size - B && v.y1 < map.size - B) return;
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 3;
    const step = 90;
    for (let x = Math.floor(v.x0 / step) * step; x < v.x1; x += step)
      for (let y = Math.floor(v.y0 / step) * step; y < v.y1; y += step) {
        if (x > B - 20 && y > B - 20 && x < map.size - B + 20 && y < map.size - B + 20) continue;
        const o = Math.sin(this.time * 1.5 + x * 0.05 + y * 0.03) * 8;
        ctx.beginPath(); ctx.arc(x + o, y + ((x / step) % 2) * 40, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      }
  }

  _drawItem(ctx, match, it, player) {
    const t = this.time;
    const age = match.time - it.bornT;
    const pop = age < 0.35 ? easeBack(Math.min(1, age / 0.35)) : 1;
    const bob = Math.sin(t * 3 + it.id) * 2.5;
    const col = itemColor(it);
    const rank = RARITY_INFO[it.rarity].rank;
    ctx.save();
    ctx.translate(it.x, it.y + bob);
    ctx.scale(pop, pop);
    // shadow
    ctx.fillStyle = 'rgba(16,22,42,0.25)'; ctx.beginPath(); ctx.ellipse(0, 18 - bob, 16, 5, 0, 0, Math.PI * 2); ctx.fill();
    if (rank >= 2 && this.settings.graphics !== 'low') {
      ctx.save(); ctx.rotate(t * (rank === 3 ? 1.2 : 0.8));
      ctx.fillStyle = col; ctx.globalAlpha = 0.22;
      for (let i = 0; i < 6; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(34, -6); ctx.lineTo(34, 6); ctx.closePath(); ctx.fill(); }
      ctx.restore(); ctx.globalAlpha = 1;
    }
    ctx.fillStyle = NAVY; ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 3.5; ctx.strokeStyle = col; ctx.stroke();
    const img = iconImage(itemIcon(it), col === '#94A3B8' ? '#F8FAFC' : col, 48);
    if (img && img.complete) ctx.drawImage(img, -12, -12, 24, 24);
    if (it.count > 1) {
      ctx.fillStyle = '#FFFFFF'; ctx.font = '900 11px Nunito, Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('×' + it.count, 0, 25);
    }
    // ▲ badge: an upgrade over what you carry
    // Only a real upgrade over something you hold — not every item when your hands are empty.
    if (player.alive && dist(player.x, player.y, it.x, it.y) < 420 && it.type !== 'heal' && !match.loot.canAutoPickup(player, it) && match.loot.isBetter(player, it)) {
      ctx.fillStyle = '#4ADE80'; ctx.beginPath(); ctx.arc(14, -14, 8, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = NAVY; ctx.stroke();
      ctx.fillStyle = NAVY; ctx.beginPath(); ctx.moveTo(14, -19); ctx.lineTo(19, -12); ctx.lineTo(9, -12); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  _box(ctx, x, y, w, h, H, top, side, r = 4) {
    const [ox, oy] = this.camera.lean(x + w / 2, y + h / 2, H);
    ctx.fillStyle = side;
    // faces toward the viewer
    if (oy > 0) quad(ctx, x, y, x + w, y, x + w + ox, y + oy, x + ox, y + oy);
    if (oy < 0) quad(ctx, x, y + h, x + w, y + h, x + w + ox, y + h + oy, x + ox, y + h + oy);
    if (ox > 0) quad(ctx, x, y, x, y + h, x + ox, y + h + oy, x + ox, y + oy);
    if (ox < 0) quad(ctx, x + w, y, x + w, y + h, x + w + ox, y + h + oy, x + w + ox, y + oy);
    ctx.fillStyle = top;
    rr(ctx, x + ox, y + oy, w, h, r); ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(16,22,42,0.55)'; ctx.stroke();
    return [ox, oy];
  }

  _cyl(ctx, x, y, r, H, top, side) {
    const [ox, oy] = this.camera.lean(x, y, H);
    const l = Math.hypot(ox, oy);
    ctx.fillStyle = side;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    if (l > 0.5) {
      const nx = -oy / l * r, ny = ox / l * r;
      quad(ctx, x + nx, y + ny, x - nx, y - ny, x - nx + ox, y - ny + oy, x + nx + ox, y + ny + oy);
    }
    ctx.fillStyle = top;
    ctx.beginPath(); ctx.arc(x + ox, y + oy, r, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(16,22,42,0.55)'; ctx.stroke();
    return [ox, oy];
  }

  _drawLow(ctx, o) {
    switch (o.kind) {
      case 'crate': {
        const [ox, oy] = this._box(ctx, o.x, o.y, o.w, o.h, 32, '#D9A066', '#A8743F', 3);
        ctx.strokeStyle = 'rgba(120,72,30,0.8)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(o.x + ox + 5, o.y + oy + 5); ctx.lineTo(o.x + ox + o.w - 5, o.y + oy + o.h - 5);
        ctx.moveTo(o.x + ox + o.w - 5, o.y + oy + 5); ctx.lineTo(o.x + ox + 5, o.y + oy + o.h - 5); ctx.stroke();
        break;
      }
      case 'container': {
        const [ox, oy] = this._box(ctx, o.x, o.y, o.w, o.h, o.height, o.color, shade(o.color, -0.3), 3);
        ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 2;
        const vert = o.h > o.w;
        for (let i = 1; i < 8; i++) {
          ctx.beginPath();
          if (vert) { const yy = o.y + oy + (o.h * i) / 8; ctx.moveTo(o.x + ox + 4, yy); ctx.lineTo(o.x + ox + o.w - 4, yy); }
          else { const xx = o.x + ox + (o.w * i) / 8; ctx.moveTo(xx, o.y + oy + 4); ctx.lineTo(xx, o.y + oy + o.h - 4); }
          ctx.stroke();
        }
        break;
      }
      case 'car': {
        const [ox, oy] = this._box(ctx, o.x, o.y, o.w, o.h, 24, o.color, shade(o.color, -0.35), 10);
        ctx.fillStyle = 'rgba(186,230,253,0.85)';
        const vert = o.h > o.w;
        if (vert) rr(ctx, o.x + ox + 5, o.y + oy + o.h * 0.25, o.w - 10, o.h * 0.22, 4); else rr(ctx, o.x + ox + o.w * 0.25, o.y + oy + 5, o.w * 0.22, o.h - 10, 4);
        ctx.fill();
        break;
      }
      case 'tent': {
        const [ox, oy] = this._box(ctx, o.x, o.y, o.w, o.h, 30, o.color, shade(o.color, -0.3), 6);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(o.x + ox + 4, o.y + oy + o.h / 2); ctx.lineTo(o.x + ox + o.w - 4, o.y + oy + o.h / 2); ctx.stroke();
        break;
      }
      case 'sandbag': this._box(ctx, o.x, o.y, o.w, o.h, 20, '#D6C08F', '#A8925F', 8); break;
      case 'fence': {
        ctx.fillStyle = o.color; ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = shade(o.color, -0.35);
        const vert = o.h > o.w;
        for (let i = 0; i <= (vert ? o.h : o.w); i += 30) vert ? ctx.fillRect(o.x - 2, o.y + i - 3, o.w + 4, 6) : ctx.fillRect(o.x + i - 3, o.y - 2, 6, o.h + 4);
        break;
      }
      case 'rock': {
        const [ox, oy] = this.camera.lean(o.x, o.y, o.height);
        ctx.fillStyle = '#6B7385'; ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#9AA3B5'; ctx.beginPath(); ctx.arc(o.x + ox, o.y + oy, o.r * 0.94, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(16,22,42,0.5)'; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(o.x + ox - o.r * 0.3, o.y + oy - o.r * 0.3, o.r * 0.3, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'barrel': this._cyl(ctx, o.x, o.y, o.r, 26, o.color, shade(o.color, -0.35)); break;
      case 'hay': {
        const [ox, oy] = this._cyl(ctx, o.x, o.y, o.r, 18, '#EBCB6B', '#C9A445');
        ctx.strokeStyle = 'rgba(160,120,40,0.7)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(o.x + ox, o.y + oy, o.r * 0.55, 0, Math.PI * 2); ctx.stroke();
        break;
      }
      case 'fountain': {
        this._cyl(ctx, o.x, o.y, o.r, 14, '#CBD5E1', '#94A3B8');
        const [ox, oy] = this.camera.lean(o.x, o.y, 14);
        ctx.fillStyle = '#60A5FA'; ctx.beginPath(); ctx.arc(o.x + ox, o.y + oy, o.r * 0.75, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(o.x + ox, o.y + oy, 5 + Math.sin(this.time * 5) * 2, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'campfire': {
        ctx.fillStyle = '#78350F';
        ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(0.6); ctx.fillRect(-o.r, -4, o.r * 2, 8); ctx.rotate(-1.2); ctx.fillRect(-o.r, -4, o.r * 2, 8); ctx.restore();
        const fl = Math.sin(this.time * 12) * 2;
        ctx.fillStyle = '#FF9F43'; ctx.beginPath(); ctx.arc(o.x, o.y - 2, 9 + fl, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFD43B'; ctx.beginPath(); ctx.arc(o.x, o.y - 3, 5 + fl * 0.5, 0, Math.PI * 2); ctx.fill();
        break;
      }
      default:
        if (o.type === 'circle') this._cyl(ctx, o.x, o.y, o.r, o.height, o.color || '#94A3B8', shade(o.color || '#94A3B8', -0.3));
        else this._box(ctx, o.x, o.y, o.w, o.h, o.height, o.color || '#94A3B8', shade(o.color || '#94A3B8', -0.3));
    }
  }

  _drawTall(ctx, o) {
    switch (o.kind) {
      case 'lighthouse': {
        const [ox, oy] = this._cyl(ctx, o.x, o.y, o.r, o.height, '#F8FAFC', '#E2E8F0');
        // stripes on the side
        ctx.fillStyle = '#EF4444';
        for (const f of [0.3, 0.65]) { ctx.beginPath(); ctx.arc(o.x + ox * f, o.y + oy * f, o.r, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = '#F8FAFC'; ctx.beginPath(); ctx.arc(o.x + ox, o.y + oy, o.r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(16,22,42,0.55)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#FFD43B'; ctx.beginPath(); ctx.arc(o.x + ox, o.y + oy, o.r * 0.45, 0, Math.PI * 2); ctx.fill();
        ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#FFF7AE'; ctx.translate(o.x + ox, o.y + oy); ctx.rotate(this.time * 0.8);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(260, -40); ctx.lineTo(260, 40); ctx.closePath(); ctx.fill(); ctx.restore();
        break;
      }
      case 'silo': {
        const [ox, oy] = this._cyl(ctx, o.x, o.y, o.r, o.height, '#E2E8F0', '#94A3B8');
        ctx.strokeStyle = 'rgba(100,116,139,0.6)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(o.x + ox, o.y + oy, o.r * 0.6, 0, Math.PI * 2); ctx.stroke();
        break;
      }
      case 'tower': this._cyl(ctx, o.x, o.y, o.r, o.height, '#A1A6B4', '#6F7482'); break;
      case 'pole': {
        const [ox, oy] = this.camera.lean(o.x, o.y, o.height);
        ctx.strokeStyle = '#6B7280'; ctx.lineWidth = o.r * 1.4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(o.x + ox, o.y + oy); ctx.stroke();
        ctx.fillStyle = '#FF6B6B'; ctx.beginPath(); ctx.arc(o.x + ox, o.y + oy, 4 + (Math.sin(this.time * 4) > 0 ? 2 : 0), 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'fortwall': this._box(ctx, o.x, o.y, o.w, o.h, o.height, '#A3A8B5', '#737886', 3); break;
      default:
        if (o.type === 'circle') this._cyl(ctx, o.x, o.y, o.r, o.height, o.color || '#94A3B8', shade(o.color || '#94A3B8', -0.3));
        else this._box(ctx, o.x, o.y, o.w, o.h, o.height, o.color || '#94A3B8', shade(o.color || '#94A3B8', -0.3));
    }
  }

  _drawTree(ctx, t, player) {
    const [ox, oy] = this.camera.lean(t.x, t.y, t.height);
    ctx.fillStyle = '#7C4A23'; ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2); ctx.fill();
    const under = player.alive && dist(player.x, player.y, t.x + ox, t.y + oy) < t.canopy;
    ctx.globalAlpha = under ? 0.45 : 1;
    const sway = this.settings.reducedMotion ? 0 : Math.sin(this.time * 1.3 + t.x * 0.01) * 1.5;
    const cx = t.x + ox + sway, cy = t.y + oy;
    ctx.fillStyle = '#2F8F46'; ctx.beginPath(); ctx.arc(cx, cy, t.canopy, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(16,22,42,0.45)'; ctx.stroke();
    ctx.fillStyle = '#3FAA55'; ctx.beginPath(); ctx.arc(cx - t.canopy * 0.18, cy - t.canopy * 0.2, t.canopy * 0.72, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#5CC46A'; ctx.beginPath(); ctx.arc(cx - t.canopy * 0.35, cy - t.canopy * 0.38, t.canopy * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }

  _drawBush(ctx, b, player) {
    const inside = player.alive && player.inBush === b;
    ctx.globalAlpha = inside ? 0.55 : 0.97;
    const sway = this.settings.reducedMotion ? 0 : Math.sin(this.time * 2 + b.x) * 1.2;
    const c1 = b.tint > 0.5 ? '#3E9B4F' : '#46A355', c2 = b.tint > 0.5 ? '#56B866' : '#62C070';
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.35, b.y + b.r * 0.1, b.r * 0.62, 0, Math.PI * 2);
    ctx.arc(b.x + b.r * 0.38 + sway, b.y + b.r * 0.05, b.r * 0.6, 0, Math.PI * 2);
    ctx.arc(b.x + sway * 0.5, b.y - b.r * 0.32, b.r * 0.66, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c2;
    ctx.beginPath(); ctx.arc(b.x - b.r * 0.15 + sway * 0.5, b.y - b.r * 0.4, b.r * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }

  _drawBuilding(ctx, b, player, dt) {
    const inside = player.alive && player.inBuilding === b;
    let a = this.roofAlpha.get(b) ?? 1;
    const target = inside ? 0.08 : 1;
    a += (target - a) * Math.min(1, dt * 10);
    this.roofAlpha.set(b, a);
    // Walls drawn as boxes whenever the roof isn't fully opaque.
    if (a < 0.98) {
      for (const w of b.walls) this._box(ctx, w.x, w.y, w.w, w.h, w.height, '#F1E4C8', '#B9A27A', 2);
    }
    if (a <= 0.02) return;
    ctx.globalAlpha = a;
    const H = 76;
    const [ox, oy] = this.camera.lean(b.x + b.w / 2, b.y + b.h / 2, H);
    const wallSide = '#CDB892';
    ctx.fillStyle = wallSide;
    const { x, y, w, h } = b;
    if (oy > 0) quad(ctx, x, y, x + w, y, x + w + ox, y + oy, x + ox, y + oy);
    if (oy < 0) quad(ctx, x, y + h, x + w, y + h, x + w + ox, y + h + oy, x + ox, y + h + oy);
    if (ox > 0) quad(ctx, x, y, x, y + h, x + ox, y + h + oy, x + ox, y + oy);
    if (ox < 0) quad(ctx, x + w, y, x + w, y + h, x + w + ox, y + h + oy, x + w + ox, y + oy);
    // roof
    const rx = x + ox - 6, ry = y + oy - 6, rw = w + 12, rh = h + 12;
    rr(ctx, rx, ry, rw, rh, 8);
    ctx.fillStyle = b.roof; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(16,22,42,0.6)'; ctx.stroke();
    // two-tone pitch along the long axis + ridge
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    if (rw >= rh) { rr(ctx, rx + 3, ry + 3, rw - 6, rh / 2 - 3, 6); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(rx + 10, ry + rh / 2); ctx.lineTo(rx + rw - 10, ry + rh / 2); ctx.stroke(); }
    else { rr(ctx, rx + 3, ry + 3, rw / 2 - 3, rh - 6, 6); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(rx + rw / 2, ry + 10); ctx.lineTo(rx + rw / 2, ry + rh - 10); ctx.stroke(); }
    // roof tiles: a few rows of darker lines
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 2;
    if (rw >= rh) for (let yy = ry + 12; yy < ry + rh - 6; yy += 14) { ctx.beginPath(); ctx.moveTo(rx + 6, yy); ctx.lineTo(rx + rw - 6, yy); ctx.stroke(); }
    else for (let xx = rx + 12; xx < rx + rw - 6; xx += 14) { ctx.beginPath(); ctx.moveTo(xx, ry + 6); ctx.lineTo(xx, ry + rh - 6); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }

  _drawProjectiles(ctx, match) {
    ctx.lineCap = 'round';
    match.projectiles.pool.forEach(p => {
      const len = p.aoe ? 0 : Math.min(46, p.travel + 1);
      const sp = Math.hypot(p.vx, p.vy) || 1;
      const tx = p.x - (p.vx / sp) * len, ty = p.y - (p.vy / sp) * len;
      if (p.aoe) {
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size + 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2); ctx.fill();
        return;
      }
      ctx.strokeStyle = p.color; ctx.lineWidth = p.size * 1.6; ctx.globalAlpha = 0.45;
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(p.x, p.y); ctx.stroke();
      ctx.globalAlpha = 1; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = p.size * 0.7;
      ctx.beginPath(); ctx.moveTo(p.x - (p.vx / sp) * len * 0.4, p.y - (p.vy / sp) * len * 0.4); ctx.lineTo(p.x, p.y); ctx.stroke();
    });
    match.throwables.pool.forEach(g => {
      ctx.fillStyle = 'rgba(16,22,42,0.25)'; ctx.beginPath(); ctx.ellipse(g.x, g.y, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
      const blink = g.t > g.flight && Math.sin(g.t * 30) > 0;
      ctx.fillStyle = blink ? '#FF6B6B' : '#3F4A63'; ctx.beginPath(); ctx.arc(g.x, g.y - g.z, 8, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = NAVY; ctx.stroke();
      if (g.t > g.flight) { ctx.strokeStyle = 'rgba(255,107,107,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(g.x, g.y, 115, 0, Math.PI * 2); ctx.stroke(); }
    });
    ctx.lineCap = 'butt';
  }

  _visible(match, e, player) {
    if (e === player) return 1;
    const d = dist(e.x, e.y, player.x, player.y);
    const firing = match.time - e.lastShotT < 0.8;
    if ((e.inBush) && d > 150 && !firing && player.alive) return 0;
    return 1;
  }

  _drawEntity(ctx, match, e, player) {
    if (e.airborne) { this._drawParachute(ctx, e); return; }
    const vis = this._visible(match, e, player);
    if (!vis) return;
    const w = activeWeapon(e);
    // ground shadow
    ctx.fillStyle = 'rgba(16,22,42,0.25)'; ctx.beginPath(); ctx.ellipse(e.x + 3, e.y + 14, 17, 7, 0, 0, Math.PI * 2); ctx.fill();
    if (e.inWater) { ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(e.x, e.y + 6, 24 + Math.sin(this.time * 6) * 2, 12, 0, 0, Math.PI * 2); ctx.stroke(); }
    if (e.spawnShield > 0 || e.speedBoostT > 0) { ctx.strokeStyle = 'rgba(255,212,59,0.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(e.x, e.y, 26, 0, Math.PI * 2); ctx.stroke(); }
    drawTopDown(ctx, e.x, e.y, {
      skin: e.skin, facing: e.facing, aim: e.aimAngle, walk: e.walkCycle, moving: e.moving,
      attack: e.attackAnim, flash: e.hitFlash, weapon: w.def.melee ? null : { icon: w.def.icon, color: w.def.color, melee: false },
      alpha: e === player && e.inBush ? 0.7 : 1,
    });
    if (e.healing) {
      const k = e.healing.t / e.healing.total;
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(16,22,42,0.5)'; ctx.beginPath(); ctx.arc(e.x, e.y, 27, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = e.healing.key === 'shieldcell' ? '#60A5FA' : '#4ADE80';
      ctx.beginPath(); ctx.arc(e.x, e.y, 27, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); ctx.stroke();
    }
  }

  _drawParachute(ctx, e) {
    const s = 1 + e.z * 1.3;
    const c = characterById(e.skin);
    // shadow on the ground grows as they fall
    ctx.fillStyle = `rgba(16,22,42,${0.12 + (1 - e.z) * 0.15})`;
    ctx.beginPath(); ctx.ellipse(e.x, e.y + 10, 16 * (1.4 - e.z * 0.6), 7 * (1.4 - e.z * 0.6), 0, 0, Math.PI * 2); ctx.fill();
    const lift = e.z * 120;
    ctx.save(); ctx.translate(e.x, e.y - lift); ctx.scale(s, s);
    // canopy
    ctx.strokeStyle = 'rgba(16,22,42,0.6)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-24, -22); ctx.lineTo(-6, 0); ctx.moveTo(24, -22); ctx.lineTo(6, 0); ctx.moveTo(0, -30); ctx.lineTo(0, -6); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -30, 32, 16, 0, Math.PI, Math.PI * 2); ctx.closePath();
    ctx.fillStyle = c.body; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = NAVY; ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.ellipse(0, -30, 11, 16, 0, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill();
    ctx.restore();
    drawTopDown(ctx, e.x, e.y - lift, { skin: e.skin, facing: Math.PI / 2, aim: Math.PI / 2, walk: 0, moving: false, attack: 0, flash: 0, weapon: null });
  }

  _drawPlayerGuide(ctx, match, p, ui) {
    // ring under the player: always findable
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,212,59,0.9)';
    ctx.beginPath(); ctx.ellipse(p.x, p.y + 4, 27, 22, 0, 0, Math.PI * 2); ctx.stroke();
    // direction chevron
    const a = p.aimAngle;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(a);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.moveTo(42, 0); ctx.lineTo(32, -7); ctx.lineTo(32, 7); ctx.closePath(); ctx.fill();
    ctx.restore();
    // manual aim line out to the weapon's range
    if (ui.aiming) {
      const w = activeWeapon(p);
      const range = w.def.melee ? 70 : w.def.range;
      const t = match.map.raycast(p.x, p.y, p.x + Math.cos(a) * range, p.y + Math.sin(a) * range, true);
      ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 3; ctx.setLineDash([10, 10]);
      ctx.beginPath(); ctx.moveTo(p.x + Math.cos(a) * 30, p.y + Math.sin(a) * 30); ctx.lineTo(p.x + Math.cos(a) * range * t, p.y + Math.sin(a) * range * t); ctx.stroke();
      ctx.setLineDash([]);
      if (w.def.pellets) {
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.arc(p.x, p.y, range, a - w.def.spread / 2, a + w.def.spread / 2); ctx.closePath(); ctx.fill();
      }
    }
  }

  _drawOverhead(ctx, match, e, player) {
    if (e.airborne) return;
    if (!this._visible(match, e, player)) return;
    // enemies show a health bar for a few seconds after being hit
    if (e !== player && match.time - e.lastHitT < 3) {
      const w = 40, x = e.x - w / 2, y = e.y - 40;
      ctx.fillStyle = 'rgba(16,22,42,0.8)'; rr(ctx, x - 2, y - 2, w + 4, 9, 4); ctx.fill();
      ctx.fillStyle = e.hp > 60 ? '#4ADE80' : e.hp > 30 ? '#FFD43B' : '#FF6B6B';
      rr(ctx, x, y, w * (e.hp / e.maxHp), 5, 2.5); ctx.fill();
      if (e.armor > 0) { ctx.fillStyle = '#60A5FA'; rr(ctx, x, y + 6, w * (e.armor / e.maxArmor), 2.5, 1); ctx.fill(); }
    }
    if (e.emote) {
      const k = Math.min(1, (2.2 - e.emote.t) * 6);
      const y = e.y - 62 - (1 - k) * 10;
      ctx.save(); ctx.translate(e.x, y); ctx.scale(k, k);
      ctx.fillStyle = '#FFFFFF'; rr(ctx, -22, -20, 44, 40, 14); ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = NAVY; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-6, 19); ctx.lineTo(0, 28); ctx.lineTo(6, 19); ctx.closePath(); ctx.fillStyle = '#FFFFFF'; ctx.fill();
      const glyph = { wave: 'wave', gg: 'gg', heart: 'heart', laugh: 'laugh', crown: 'crown', fire: 'fire' }[e.emote.id] || 'smile';
      const col = { heart: '#F472B6', fire: '#FF9F43', crown: '#FFB703' }[e.emote.id] || '#17213D';
      const img = iconImage(glyph, col, 64);
      if (img && img.complete) ctx.drawImage(img, -15, -15, 30, 30);
      ctx.restore();
    }
  }

  _drawZone(ctx, z, v) {
    const c = z.currentCenter, r = Math.max(0, z.currentRadius);
    ctx.save();
    ctx.beginPath();
    ctx.rect(v.x0 - 200, v.y0 - 200, v.x1 - v.x0 + 400, v.y1 - v.y0 + 400);
    ctx.arc(c.x, c.y, r, 0, Math.PI * 2, true);
    const hc = this.settings.highContrast;
    ctx.fillStyle = hc ? 'rgba(255,60,90,0.38)' : 'rgba(167,60,170,0.30)';
    ctx.fill('evenodd');
    // stripes outside make it read even without colour
    ctx.clip('evenodd');
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 14;
    const off = (this.time * 20) % 60;
    for (let x = Math.floor(v.x0 / 60) * 60 - 600; x < v.x1 + 200; x += 60) { ctx.beginPath(); ctx.moveTo(x + off, v.y0 - 200); ctx.lineTo(x + off + 600, v.y1 + 200); ctx.stroke(); }
    ctx.restore();
    // edge
    const pulse = z.stage === 'shrinking' ? 0.6 + Math.sin(this.time * 8) * 0.4 : 1;
    ctx.lineWidth = 8; ctx.strokeStyle = `rgba(255,107,107,${0.5 * pulse})`;
    ctx.beginPath(); ctx.arc(c.x, c.y, r + 4, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI * 2); ctx.stroke();
  }

  _drawScreenFx(ctx, match, p) {
    const W = this.canvas.width, H = this.canvas.height;
    this.hurt = Math.max(0, this.hurt - 0.04);
    const low = p.alive && p.hp < 30 && !p.airborne;
    const outside = p.alive && p.outsideZone;
    if (this.hurt > 0 || low || outside) {
      const a = Math.max(this.hurt * 0.55, low ? 0.25 + Math.sin(this.time * 6) * 0.1 : 0, outside ? 0.3 : 0);
      const col = outside && !this.hurt ? '167,60,170' : '255,70,70';
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    // Arrow to the safe zone when outside it
    if (outside) {
      const z = match.zone, cam = this.camera;
      const a = Math.atan2(z.currentCenter.y - p.y, z.currentCenter.x - p.x);
      const [sx, sy] = cam.worldToScreen(p.x, p.y);
      const R = 70;
      ctx.save(); ctx.translate((sx + Math.cos(a) * R) * this.dpr, (sy + Math.sin(a) * R) * this.dpr); ctx.rotate(a);
      ctx.scale(this.dpr, this.dpr);
      ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = NAVY; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(-8, -12); ctx.lineTo(-3, 0); ctx.lineTo(-8, 12); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  }
}

function quad(ctx, ax, ay, bx, by, cx, cy, dx, dy) {
  ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx, cy); ctx.lineTo(dx, dy); ctx.closePath(); ctx.fill();
}

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

const shadeCache = new Map();
export function shade(hex, amt) {
  const key = hex + amt;
  if (shadeCache.has(key)) return shadeCache.get(key);
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt);
  r = f(r); g = f(g); b = f(b);
  const out = `rgb(${r},${g},${b})`;
  shadeCache.set(key, out);
  return out;
}

function easeBack(t) { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }

void CONFIG;
