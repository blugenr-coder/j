# Battlelands Remake

A fast, top-down, 32-player mobile battle royale that runs in the browser.
It recreates the *feel* of Battlelands Royale — short matches, a fixed high
camera, one-thumb movement, a big attack button, a shrinking zone — with
entirely original art, characters, sounds, map and names. Nothing is copied
from the original game: every character, icon and sound is drawn or
synthesised in code.

The game lives in this folder and shares nothing with the rest of the
repository. No build step, no dependencies, no asset downloads.

## Play it

Serve the repository root with any static server and open `/battlelands/`:

```bash
npm start                           # the repo's own server → http://127.0.0.1:8099/battlelands/
python3 -m http.server 8099         # or any static server
```

It also works under the site's strict Content-Security-Policy (no inline
script, no third-party script).

### Controls

| Touch | Keyboard / mouse | Action |
|---|---|---|
| Drag on the left half | WASD / arrows | Move |
| Tap the attack button | Click / Space | Shoot the nearest visible enemy (auto-aim) |
| Hold the attack button | Hold click | Keep firing |
| Drag the attack button | Mouse | Aim yourself (aim assist nudges you onto targets) |
| Weapon slots | 1 / 2 | Switch weapon |
| Loot card / PICK UP | E | Take or swap the item you stand on |
| Heal button (appears when you carry heals) | Q | Heal |
| Utility button | F | Frag bomb / smoke / speed soda |
| Reload button | R | Reload |
| Smile button | T | Emote |
| Minimap | M | Full map |
| Pause | Esc / P | Pause, settings, leave match |

## The loop

`MAIN MENU → PLAY → matchmaking → choose landing → parachute → land → loot →
fight → zone shrinks → win or get eliminated → RESULTS (XP, coins, missions)
→ PLAY AGAIN`.

A match is 1 human + 31 bots. In the headless simulation a match lasts about
four minutes after landing; about 20 players are left at 1:15, and the last
few fight it out inside a small final circle.

## Code map

```
src/
  core/        GameManager (app flow + frame loop), MatchManager (one match, no DOM),
               GameState, EventBus, SaveManager, config (every tunable), math, rng,
               SpatialGrid, Pool
  player/      PlayerController (movement + actions), PlayerStats (combatant),
               PlayerInput (touch / keyboard / mouse), PlayerAnimation (character art)
  combat/      WeaponManager (archetypes + firing), ProjectileSystem, DamageSystem,
               HitDetection
  bots/        BotController (per frame), BotBrain (personalities + decisions),
               BotNavigation (grid A*), BotCombat (aim, weapon choice)
  world/       MapManager (handcrafted island), LootManager (tables + pickup rules),
               ZoneManager, SpawnManager (landings)
  render/      Camera, Renderer, GroundRenderer, Effects
  ui/          MainMenu, HUD, Inventory, Minimap, Deploy, Loading, Results, Collection,
               Shop, Missions, Settings, Tutorial, Icons, Cards, i18n (EN/ES), dom
  audio/       AudioManager (WebAudio synthesis, no files)
  progression/ XPManager, Missions (daily + achievements), Cosmetics (catalogue)
```

`MatchManager` touches no DOM or canvas. Rendering, audio and the HUD listen
to its event bus. That one-way flow is what lets a whole match run in Node.

## Tuning

Everything that shapes the feel is in `src/core/config.js`:

- **Camera:** `cameraZoom`, `cameraHeight` (how far tall things lean),
  `cameraFollowSpeed`, `cameraSmoothing`, `cameraBoundary`, `viewUnits`.
- **Movement:** `moveSpeed`, `acceleration`, `deceleration`,
  `rotationSpeed`, `collisionRadius`.
- **Zone:** per-phase `wait / warning / shrink / radius / dps / targetAlive`,
  plus how much the alive count may stretch or squeeze each wait.
- **Bots:** think rate, path budget, view range, and the damage multipliers
  that set the pace (bot → human and bot → bot).

Weapons are in `src/combat/WeaponManager.js`; loot tables, rarity weights,
location weights and spawn rules in `src/world/LootManager.js`.

## Tests

```bash
npm run test:battlelands       # map sanity + 4 headless full matches
npm run test:battlelands:e2e   # browser run on a phone viewport (serve on :8123 first)
```

- `tests/check-map.mjs` — buildings stay on dry land and don't overlap;
  every loot spot is standable and reachable on the navigation grid.
- `tests/simulate.mjs [n]` — n full matches with an autopilot player: each
  must end with one winner, nothing may go NaN or leave the island, loot must
  be identical for the same seed and different for different seeds. Prints
  match length and how many are alive at 1:15, 2:00, 3:00 and 4:30.
- `tests/e2e.mjs [url]` — Chromium on a 390×844 touch screen: every menu tab,
  PLAY, landing choice, joystick by touch, attack button by touch, pause, an
  elimination, results, PLAY AGAIN, a win, back to the menu, progress saved,
  and no console errors.

## Known limits

- Offline only: the 31 other players are bots. Matchmaking is simulated.
- Coins are fake; the shop never touches real payments.
- Progress is saved in `localStorage` on this device only.
- Music and sound are simple synthesised loops and effects, not composed audio.
