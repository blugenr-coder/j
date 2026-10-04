# Drop Zone — 3D character prototype

A playable Three.js prototype of a stylised battle-royale character. The
character is modelled, rigged and exported in Blender; the game loads the
result (`models/character.glb`). Nothing to install to *play*: Three.js r170
and its glTF loader are vendored in `vendor/` (MIT, see
`vendor/three-LICENSE.txt`) because the site's CSP allows no third-party scripts.

Run: `npm start` (or any static server) and open `/game/`.
Controls: WASD run · Space jump · Q/E or drag to orbit · wheel to zoom ·
1–6 skins · F cycles expressions · H hides the help. `?skin=army` picks a skin.

| File | What it owns |
|------|--------------|
| `blender/build_character.py` | Builds the model in Blender: body, clothing, accessories, face, armature, weights, shape keys → `models/character.glb` |
| `js/character.js` | `BaseCharacter`: loads the model, maps procedural joint angles onto its bones, expressions, `applySkin()` |
| `js/skins.js` | The six skins as data (material colours/textures, which layers show) |
| `js/animator.js` | Procedural idle / run / jump / fall / land, blended by weight |
| `js/player.js` | Movement, gravity, jump (coyote time + buffer), collision, ground detection |
| `js/world.js` | Arena meshes and their box/cylinder colliders |
| `js/main.js` | Renderer, lights, orbit camera, input, UI, loop |
| `js/shapes.js` | Material/mesh helpers for the world |

## Rebuilding the model

```
pip install bpy==4.2.0 scikit-image numpy     # Blender as a Python module, ~500 MB
python game/blender/build_character.py         # ~15 s; writes models/character.glb
```

It also works inside a normal Blender install: `blender -b -P game/blender/build_character.py`.
If `npx` is available the script then quantizes the file with glTF-Transform
(about a third smaller; Three.js reads it without any decoder).

How it is built: every part is a signed distance field joined with smooth
unions, so arms, neck and legs grow out of the torso as one skin. Marching
cubes meshes each field; Blender cleans and decimates it, then every vertex
is snapped back onto the exact surface and given the surface's exact normal
(the field's gradient), so shading is smooth whatever the triangle count.
Garment edges are rounded intersections, so hems come out soft. Blender then
assigns materials and UVs, builds the armature, skins every layer with the
same weight function (so clothes bend exactly with the body; boots blend from
ankle to shin like real boots) and adds shape keys for blinking and
expressions. Arms are modelled in an A-pose; the game lowers them on load.

What the file contains:

* **Bones:** `body` (pelvis) → `spine` → `head`; `shL/elL/handL` (and R);
  `hipL/knL/anL` (and R).
* **Always-on meshes:** `Body` (one continuous skin), `Head`, `Eyes`, `Brows`,
  `MouthSmirk`, `MouthGrin`, `MouthOh`, `Belt`, `Gloves`, `Fingers`, `Boots`,
  `Soles`, `BootCuffs`.
* **Optional layers** (shown by skins): `ShirtTank`, `ShirtCrew`,
  `SleeveShort`, `SleeveLong`, `Shorts`, `Pants`, `Socks`, `MaskBand`,
  `Helmet`, `Hood`, `Headband`, `HeadbandStripe`, `Sunglasses`, `Vest`,
  `VestPouches`, `Drawstrings`.
* **Shape keys:** `Eyes.Blink`, `Eyes.Small`, `Brows.Angry/Happy/Surprised`,
  `MouthSmirk.Frown`.
* **Materials** (recoloured by skins): `Skin`, `HeadSkin`, `FaceSkin`,
  `Shirt`, `Sleeve`, `Shorts`, `Pants`, `Sock`, `Belt`, `Boots`, `Sole`,
  `Gloves`, `Helmet`, `Hood`, `Headband`, `Vest`, … Shirts, sleeves and
  trousers are UV-unwrapped as cylinders, so canvas textures (camo, jersey
  number, flowers) wrap around them.

Animation is procedural (`js/animator.js`): it writes angles about the
character's own axes, and `BaseCharacter.sync()` converts them onto the
Blender bones. A rigged model from an artist can replace the file as long as
it keeps the bone and layer names above.

## Adding a skin

Add an entry to `SKINS` in `js/skins.js`: `colors` maps material names to a
colour or `{ map, repeat }`, `show` lists optional layers, `mask: true` darkens
the head around the eye opening. Skins cannot touch geometry, so every one
keeps identical proportions and animation. A new garment or accessory is
added in `build_character.py` (a field function plus one `make(...)` line)
and then listed in `OPTIONAL_LAYERS` in `js/character.js`.
