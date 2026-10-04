# Drop Zone — 3D character prototype

A playable Three.js prototype of a stylised battle-royale character. Nothing to
build or install; Three.js r170 is vendored in `vendor/` (MIT, see
`vendor/three-LICENSE.txt`) because the site's CSP allows no third-party scripts.

Run: `npm start` (or any static server) and open `/game/`.
Controls: WASD run · Space jump · Q/E or drag to orbit · wheel to zoom ·
1–6 skins · F cycles expressions · H hides the help. `?skin=army` picks a skin.

| File | What it owns |
|------|--------------|
| `js/character.js` | `BaseCharacter`: fixed proportions, rig, face, clothing layers, `applySkin()` |
| `js/skins.js` | The six skins as data (colours, textures, layers, accessories) |
| `js/animator.js` | Procedural idle / run / jump / fall / land, blended by weight |
| `js/player.js` | Movement, gravity, jump (coyote time + buffer), collision, ground detection |
| `js/world.js` | Arena meshes and their box/cylinder colliders |
| `js/main.js` | Renderer, lights, orbit camera, input, UI, loop |
| `js/shapes.js` | Rounded-primitive geometry helpers |

## Adding a skin

Add an entry to `SKINS` in `js/skins.js`. A skin can only recolour or texture
material slots, toggle layers (`sleeves: 'none'|'short'|'long'`, `longPants`,
`socks`, `mask`) and mount accessories (`c.mount('head' | 'spine' | …, obj)`).
It cannot touch body geometry, so every skin keeps identical proportions and
animations.

## Components

The rig dictates parenting (a hand hangs off its elbow), so components are a
registry rather than sibling groups: `character.parts.Head`, `Face`, `Body`,
`Shirt`, `Shorts`, `Arms`, `Hands`, `Legs`, `Boots` each list their meshes.
