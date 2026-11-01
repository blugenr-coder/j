# Skybrawl — Island Royale

A colourful 32-player top-down battle royale that runs in the browser.
Original game: own name, island, characters, weapons and rules. No
external assets — every model is built from code and every sound is
synthesised with WebAudio.

Open `/game/` on the site (or serve the repository root with any static
server and open `http://localhost:PORT/game/`). There is no build step.

## How a match goes

1. **Lobby** — 32 seats; open seats are filled with bots.
2. **Plane** — flies across the island. Jump with `SPACE`/click (or the
   JUMP button). Everyone is pushed out at 80 % of the route.
3. **Skydive** — free fall, then the parachute opens; steer to land.
4. **Loot** — weapons, ammo, medkits, armor, grenades, Zoom Soda. Smash
   crates (gold crates hold better loot). Ammo is picked up by walking over
   it; everything else with `E`.
5. **Storm** — five phases; it pauses, then shrinks to the next circle
   (white ring on the ground and the map). Outside it you lose health
   every second, ignoring armor.
6. **Last one standing wins.** Results show placement, eliminations,
   damage, accuracy, time survived and XP; *Play again* restarts.

## Controls

| Desktop | Action | Touch |
|---|---|---|
| `WASD` / arrows | Move | Left half: virtual joystick |
| Mouse | Aim | Right half: aim joystick (fires when pushed far) |
| Left click | Shoot | 🔫 button (auto-aims at the nearest visible enemy) |
| `R` | Reload | R button |
| `E` | Pick up / swap weapon | ✋ button (appears near loot) |
| `1`–`4` | Switch weapon | Tap a weapon slot |
| `Q` / `G` / `C` | Medkit / grenade / Zoom Soda | Item buttons at the top |
| `M` | Island map | 🗺 button |
| Mouse wheel | Zoom | — |
| `Esc` / `P` | Pause | ⏸ button |

## Content

- **Weapons** (`js/config.js`): Pip Pistol, Buzzsaw SMG, Striker AR,
  Boomstick (shotgun), Longshot (sniper), Thumper HMG. Each has its own
  damage, fire rate, range, spread, reload time, magazine and ammo type.
  Five rarities (Common → Legendary) raise damage and magazine size and
  tighten spread. Projectiles are simulated (visible tracers) with
  segment hit tests against walls, crates and players.
- **Island** (`js/world.js`): Pebble Town (plaza, fountain, clock tower),
  Maple Row (houses, yards, pool), Fort Grizzly (walled base, watchtowers,
  radar), Rustworks (factories, chimneys, tanks), Big Box Depot
  (warehouse, trucks), Clover Farms (barn, silos, windmill, crops),
  Whisper Woods (forest, cabin), Sunny Shore (beach huts, lifeguard
  tower), Windy Fields, Old Lighthouse, a river with three bridges, roads
  and a shipwreck. Buildings are enterable; their roofs fade when you walk
  in, and a yellow silhouette shows you when a wall hides you.
- **Bots** (`js/ai.js`): pick a landing spot, loot what they need, break
  crates, see with line of sight, hear gunshots, react to damage, keep a
  preferred range per weapon, strafe, chase, throw grenades at enemies in
  cover, retreat and heal, flee armed enemies when unarmed, and stay ahead
  of the storm. They walk with A* on a navigation grid, so doorways and
  bridges work. Difficulty: Easy, Normal, Hard or Mixed (settings).
- **Modes**: Classic Solo (~4 min) and Rush Solo (more loot, faster storm).
- **Menu**: character selection (6 brawlers), settings (volumes, graphics
  quality, bot difficulty, camera shake, FPS counter), profile (name,
  level/XP) and lifetime statistics, all saved in `localStorage`.

## Code map

| File | Role |
|---|---|
| `js/main.js` | Boot, renderer, camera rig, menus, lobby, match lifecycle, main loop |
| `js/match.js` | Rules of one match: plane, drop, bullets, grenades, damage, loot pickup, storm, end |
| `js/fighter.js` | A participant (player or bot): movement, firing, reload, heal, animation |
| `js/ai.js` | Bot perception and decisions; returns the same intent the player's input does |
| `js/input.js` | Keyboard, mouse and touch → intent |
| `js/world.js` | Island generation, colliders, loot and crate spots |
| `js/physics.js` | Spatial hash, circle/box collision, raycasts, navigation grid + A* |
| `js/loot.js`, `js/zone.js`, `js/fx.js`, `js/audio.js`, `js/hud.js` | Loot, storm, effects, sound, HUD |
| `js/config.js` | All balance numbers |
| `vendor/three.module.min.js` | Three.js r170 (MIT), kept local because the site's CSP only allows same-origin scripts |

### Adding real multiplayer later

Gameplay never reads the keyboard: each frame a controller produces an
*intent* (`{ mx, mz, aimX, aimZ, fire, reload, slot, heal, grenade, soda,
jump, pickup }`) and `Fighter.update(dt, intent)` applies it. Today the
controllers are `Input` (local player) and `BotBrain`. A networked game
would add a controller that receives remote intents and send
fighter/loot/zone snapshots to clients. Running the match on an
authoritative server needs one more step that is not done yet: `Match`,
`Fighter` and `LootManager` still create their Three.js meshes and call
the HUD directly, so the rendering side has to be split out (or stubbed)
first. The island is generated from a fixed seed, so every client already
builds the same map locally.

### Debugging

`window.__sky` exposes the current match, world and settings in the
browser console (e.g. `__sky.match.player.health = 1e9`).
