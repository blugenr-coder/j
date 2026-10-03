/* Runs every bot every frame: think on a staggered timer, follow the path,
   aim and shoot. Thinking is cheap but not free, so it happens a few times a
   second per bot, spread across frames so no single frame pays for all 31. */
import { CONFIG } from '../core/config.js';
import { dist, dist2, angleTo } from '../core/math.js';
import { applyMovement } from '../player/PlayerController.js';
import { think, BotState } from './BotBrain.js';
import { aimAndFire } from './BotCombat.js';

export class BotController {
  constructor(match, nav) {
    this.match = match;
    this.nav = nav;
  }

  update(dt) {
    const m = this.match;
    let pathBudget = CONFIG.bots.pathsPerFrame;
    for (const bot of m.entities) {
      if (!bot.isBot || !bot.alive || bot.airborne) continue;
      const b = bot.brain;
      b.thinkT -= dt;
      if (b.thinkT <= 0) {
        b.thinkT += CONFIG.bots.thinkInterval;
        think(m, bot);
      }
      if (b.needPath && pathBudget > 0 && b.dest) {
        pathBudget--;
        b.needPath = false;
        b.path = this.nav.findPath(bot.x, bot.y, b.dest[0], b.dest[1]) || [[b.dest[0], b.dest[1]]];
        b.pathIdx = 0;
      }
      this.steer(bot, dt);
      if (b.target && b.engaged) aimAndFire(m, bot, b.target, dt);
      else { bot.wantFire = false; bot.aiming = false; }
      this.tryLoot(bot);
    }
  }

  steer(bot, dt) {
    const b = bot.brain;
    const m = this.match;
    let ix = 0, iy = 0;
    if (b.unstickT > 0) {
      b.unstickT -= dt;
      ix = Math.cos(b.unstickA); iy = Math.sin(b.unstickA);
    } else if (b.path && b.dest) {
      let wp = b.path[b.pathIdx];
      while (wp && dist2(bot.x, bot.y, wp[0], wp[1]) < 22 * 22) {
        b.pathIdx++;
        wp = b.path[b.pathIdx];
      }
      if (wp) {
        const a = angleTo(bot.x, bot.y, wp[0], wp[1]);
        ix = Math.cos(a); iy = Math.sin(a);
        // Ease into a final stop instead of orbiting the point.
        if (b.pathIdx === b.path.length - 1) {
          const d = dist(bot.x, bot.y, wp[0], wp[1]);
          if (d < 60) { ix *= d / 60; iy *= d / 60; }
        }
      } else {
        b.path = null;
      }
    } else if (b.dest && !b.needPath) {
      const d = dist(bot.x, bot.y, b.dest[0], b.dest[1]);
      if (d > 25) { const a = angleTo(bot.x, bot.y, b.dest[0], b.dest[1]); ix = Math.cos(a); iy = Math.sin(a); }
    }

    // Stuck detection: wanted to move, barely did.
    const wants = ix * ix + iy * iy > 0.1;
    b.stuckT += dt;
    if (b.stuckT > 1.0) {
      const moved = dist(bot.x, bot.y, b.lastX, b.lastY);
      if (wants && moved < 18 && b.unstickT <= 0) {
        b.unstickT = 0.45; b.unstickA = m.rng.range(0, Math.PI * 2);
        b.needPath = true;
      }
      b.stuckT = 0; b.lastX = bot.x; b.lastY = bot.y;
    }

    applyMovement(m, bot, ix, iy, dt);
  }

  tryLoot(bot) {
    const m = this.match;
    const r = CONFIG.player.pickupRadius;
    m.loot.query(bot.x, bot.y, r, it => {
      if (m.loot.canAutoPickup(bot, it) || m.loot.isBetter(bot, it)) {
        // Only one pickup per frame keeps swaps from ping-ponging.
        if (m.loot.pickup(bot, it)) return false;
      }
    });
  }
}
