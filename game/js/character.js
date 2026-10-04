/* BaseCharacter — the player model built in Blender (game/blender/
   build_character.py → game/models/character.glb).

   The file holds one skinned body, its skeleton, every clothing layer and
   accessory, and the face with its expression shape keys. Nothing here
   creates geometry: a skin only recolours materials, swaps textures and
   shows or hides layers, so every variant keeps the exact same body.

   Animation stays procedural (animator.js). The animator writes simple
   joint angles onto proxy objects whose axes are the character's own
   (X = side, Y = up, Z = forward); sync() converts those onto the Blender
   bones, whatever their roll, so the animation code never has to know how
   the skeleton was authored.

   Facing: +Z. Character's left: +X. Total height ≈ 3.45 units. */

import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';

export const DIM = {
  height: 3.45,
  hipY: 1.10,           // body bone above the ground
  thigh: 0.40, shin: 0.40,
};

const ARM_BIND = 0.7;   // A-pose the arms were modelled in (radians)

const JOINTS = ['body', 'spine', 'head', 'shL', 'shR', 'elL', 'elR', 'hipL', 'hipR', 'knL', 'knR', 'anL', 'anR'];

/* Layers a skin may show; anything not listed is always on. */
export const OPTIONAL_LAYERS = ['ShirtTank', 'ShirtCrew', 'SleeveShort', 'SleeveLong', 'Shorts', 'Pants', 'Socks',
  'MaskBand', 'Helmet', 'Hood', 'Headband', 'HeadbandStripe', 'Sunglasses', 'Vest', 'VestPouches', 'Drawstrings'];

export class BaseCharacter {
  static async load(url) {
    const gltf = await new GLTFLoader().loadAsync(url);
    return new BaseCharacter(gltf.scene);
  }

  constructor(model) {
    this.root = new THREE.Group();
    this.root.name = 'BaseCharacter';
    this.root.add(model);
    this.model = model;

    this.bones = {};
    this.layers = {};
    this.materials = {};
    this.parts = {};      // every mesh, filed under the component it belongs to
    model.traverse(o => {
      if (o.isBone) this.bones[o.name] = o;
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.frustumCulled = false;      // bind-pose bounds don't follow the animation
        // the loader may hand out more than one instance of a material
        const m = o.material;
        const list = (this.materials[m.name] ??= []);
        if (!list.includes(m)) {
          list.push(m);
          m.userData.base = { color: m.color.getHex() };
        }
      }
    });
    for (const name of [...OPTIONAL_LAYERS, 'Body', 'Head', 'Eyes', 'Brows', 'MouthSmirk', 'MouthGrin', 'MouthOh',
      'Belt', 'Boots', 'Soles', 'BootCuffs', 'Gloves', 'Fingers']) {
      const o = model.getObjectByName(name);
      if (o) this.layers[name] = o;
    }
    const file = (part, ...names) => { this.parts[part] = names.map(n => this.layers[n]).filter(Boolean); };
    file('Head', 'Head', 'Helmet', 'Hood', 'Headband', 'HeadbandStripe', 'Sunglasses');
    file('Face', 'Eyes', 'Brows', 'MouthSmirk', 'MouthGrin', 'MouthOh', 'MaskBand');
    file('Body', 'Body');
    file('Shirt', 'ShirtTank', 'ShirtCrew', 'SleeveShort', 'SleeveLong', 'Vest', 'VestPouches', 'Drawstrings');
    file('Shorts', 'Shorts', 'Pants', 'Belt');
    file('Hands', 'Gloves', 'Fingers');
    file('Legs', 'Socks');
    file('Boots', 'Boots', 'Soles', 'BootCuffs');
    // Arms are part of the one continuous Body mesh; they're named here for
    // completeness so code iterating components finds them.
    this.parts.Arms = this.parts.Body;

    this.#setupRig();
    this.setExpression('normal');
  }

  /* ─────────────────────────── rig ─────────────────────────── */

  #setupRig() {
    const b = this.bones;
    this.model.updateMatrixWorld(true);

    // Lower the arms from the modelling A-pose to hanging straight down: the
    // pose the animator's angles are measured from.
    for (const [name, s] of [['shL', 1], ['shR', -1]]) {
      const bone = b[name];
      const world = bone.getWorldQuaternion(new THREE.Quaternion());
      const turn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -ARM_BIND * s);
      const parent = bone.parent.getWorldQuaternion(new THREE.Quaternion());
      bone.quaternion.copy(parent.invert().multiply(turn.multiply(world)));
      bone.updateMatrixWorld(true);
    }

    this.joints = {};
    this.rest = {};
    for (const name of JOINTS) {
      const bone = b[name];
      const w = bone.getWorldQuaternion(new THREE.Quaternion());
      this.rest[name] = {
        q: bone.quaternion.clone(),
        pos: bone.position.clone(),
        w, wInv: w.clone().invert(),
        parentInv: bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert(),
      };
      const proxy = new THREE.Object3D();
      if (name === 'body') proxy.position.y = DIM.hipY;
      this.joints[name] = proxy;
    }
  }

  /* Copy the proxies onto the bones. For a joint whose rest orientation in
     character space is W, a rotation Δ about character axes becomes the
     local rotation  q_rest · W⁻¹ · Δ · W. */
  sync() {
    const tmp = new THREE.Quaternion();
    const off = new THREE.Vector3();
    for (const name of JOINTS) {
      const bone = this.bones[name], r = this.rest[name], p = this.joints[name];
      tmp.copy(r.wInv).multiply(p.quaternion).multiply(r.w);
      bone.quaternion.copy(r.q).multiply(tmp);
      if (name === 'body') {
        off.set(p.position.x, p.position.y - DIM.hipY, p.position.z).applyQuaternion(r.parentInv);
        bone.position.copy(r.pos).add(off);
      }
      if (name === 'spine') bone.scale.copy(p.scale);
    }
  }

  /* ─────────────────────── expressions ─────────────────────── */

  static EXPRESSIONS = {
    normal:    { brows: {}, mouth: 'MouthSmirk' },
    happy:     { brows: { Happy: 1 }, mouth: 'MouthGrin' },
    angry:     { brows: { Angry: 1 }, mouth: 'MouthSmirk', frown: 1 },
    surprised: { brows: { Surprised: 1 }, mouth: 'MouthOh', small: 1 },
  };

  #morph(layer, key, value) {
    this.layers[layer]?.traverse(o => {
      const i = o.morphTargetDictionary?.[key];
      if (i !== undefined) o.morphTargetInfluences[i] = value;
    });
  }

  setExpression(name) {
    const e = BaseCharacter.EXPRESSIONS[name] ?? BaseCharacter.EXPRESSIONS.normal;
    this.expression = name;
    for (const k of ['Angry', 'Happy', 'Surprised']) this.#morph('Brows', k, e.brows[k] ?? 0);
    this.#morph('Eyes', 'Small', e.small ?? 0);
    this.#morph('MouthSmirk', 'Frown', e.frown ?? 0);
    this.mouthShape = e.mouth;
    this.#updateMouth();
  }

  #updateMouth() {
    for (const m of ['MouthSmirk', 'MouthGrin', 'MouthOh']) {
      if (this.layers[m]) this.layers[m].visible = !this.masked && m === this.mouthShape;
    }
  }

  /** 0 = open, 1 = closed. Driven by the animator for blinks. */
  setBlink(v) { this.#morph('Eyes', 'Blink', v); }

  /* ─────────────────────────── skins ─────────────────────────── */

  /**
   * skin = {
   *   id, colors: { MaterialName: 0xRRGGBB | { map: Texture, repeat: [u, v] } },
   *   show: [layer names from OPTIONAL_LAYERS], mask: bool
   * }
   */
  applySkin(skin) {
    const all = Object.values(this.materials).flat();
    for (const m of all) {
      m.map = null;
      m.color.setHex(m.userData.base.color);
    }
    for (const [name, v] of Object.entries(skin.colors ?? {})) {
      for (const m of this.materials[name] ?? []) {
        if (typeof v === 'number') { m.color.setHex(v); continue; }
        m.map = this.#texture(name, v);
        m.color.setHex(0xffffff);
      }
    }
    for (const m of all) m.needsUpdate = true;

    const show = new Set(skin.show ?? []);
    if (skin.mask) show.add('MaskBand');
    for (const name of OPTIONAL_LAYERS) if (this.layers[name]) this.layers[name].visible = show.has(name);
    this.masked = !!skin.mask;
    if (this.masked) for (const m of this.materials.HeadSkin) m.color.setHex(skin.maskColor ?? 0x1a1b1f);
    this.#updateMouth();
    this.skin = skin.id;
  }

  /* One texture can dress several materials at different scales (camo on a
     shirt and on trousers), so each material gets its own copy. */
  #texture(material, { map, repeat = [1, 1] }) {
    const key = `${material}:${map.uuid}:${repeat}`;
    let t = (this.textures ??= new Map()).get(key);
    if (!t) {
      t = map.clone();
      t.flipY = false;              // glTF UV convention
      t.repeat.set(...repeat);
      t.needsUpdate = true;
      this.textures.set(key, t);
    }
    return t;
  }
}
