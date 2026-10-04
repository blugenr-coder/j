/* BaseCharacter — the player's body, face and clothing layers.

   The body is built once, from fixed proportions, and never changes. A skin
   is only data: colours, textures, which clothing layers are visible, and a
   few accessories bolted to named attachment points. That is what guarantees
   every variant shares the exact same silhouette and the exact same rig, so
   one set of animations drives them all.

   Proportions (world units, total height ≈ 3.5):
     boots 0 → 0.35 · legs 0.35 → 1.10 · hips 1.10 → 1.45
     torso 1.45 → 2.22 · neck · head 2.44 → 3.44 (1.0 tall, 0.88 wide)

   Facing: the character looks down +Z. Its left side is +X. */

import * as THREE from '../vendor/three.module.min.js';
import { blob, headGeometry, limb, mat, mesh } from './shapes.js';

export const DIM = {
  height: 3.45,
  hipY: 1.10,           // body pivot above the ground
  head: { w: 0.9, h: 1.0, d: 0.94 },
  thigh: 0.40, shin: 0.40, ankle: 0.35,
  upperArm: 0.34, forearm: 0.30,
};

/* ── Original palette (taken from the reference's swatches, not its art) ── */
export const PALETTE = {
  skin: 0xf0b48e, shirt: 0xf2efe8, shorts: 0x2e3d5c, boots: 0x25262b,
  gloves: 0x2a2c31, brow: 0x2a1d17, eyeWhite: 0xffffff, pupil: 0x1b1714,
};

export class BaseCharacter {
  constructor() {
    this.root = new THREE.Group();
    this.root.name = 'BaseCharacter';

    this.mats = {
      skin: mat(PALETTE.skin, { roughness: 0.65 }),
      headSkin: mat(PALETTE.skin, { roughness: 0.6 }),
      shirt: mat(PALETTE.shirt),
      sleeve: mat(PALETTE.shirt),
      shorts: mat(PALETTE.shorts),
      pants: mat(PALETTE.shorts),
      sock: mat(0xffffff),
      belt: mat(0xdad8d2),
      boots: mat(PALETTE.boots, { roughness: 0.6 }),
      sole: mat(0x18181b),
      gloves: mat(PALETTE.gloves, { roughness: 0.7 }),
      brow: mat(PALETTE.brow, { roughness: 0.9 }),
      eyeWhite: mat(PALETTE.eyeWhite, { roughness: 0.35 }),
      pupil: mat(PALETTE.pupil, { roughness: 0.25 }),
      mouth: mat(0x6b2e24, { roughness: 0.9 }),
      mouthIn: mat(0x4a1c18, { roughness: 0.9 }),
      teeth: mat(0xffffff, { roughness: 0.4 }),
    };

    this.joints = {};
    this.layers = {};       // clothing meshes toggled by skins
    this.slots = {};        // rig groups that own a component outright
    this.parts = {};        // every mesh, filed under its component (see #indexParts)
    this.accessories = [];

    this.#buildBody();
    this.#buildHead();
    this.#buildFace();
    this.#indexParts();
    this.setExpression('normal');
  }

  /* ─────────────────────────── body ─────────────────────────── */

  #buildBody() {
    const { mats, joints, layers } = this;
    const slot = name => (this.slots[name] = Object.assign(new THREE.Group(), { name, userData: { part: name } }));

    // Body pivot sits at the hip line; every bounce and lean moves it.
    const body = joints.body = new THREE.Group();
    body.name = 'BodyPivot';
    body.position.y = DIM.hipY;
    this.root.add(body);

    // HIPS / SHORTS
    const shorts = slot('Shorts');
    body.add(shorts);
    const hips = mesh(blob(0.76, 0.42, 0.56, { box: 0.5, bottom: 0.94, top: 1.0 }), mats.shorts);
    hips.name = 'Hips';
    hips.position.y = 0.17;
    shorts.add(hips);
    const belt = mesh(blob(0.78, 0.075, 0.58, { box: 0.65 }), mats.belt);
    belt.position.y = 0.36;
    shorts.add(belt);

    // SPINE → TORSO, NECK, ARMS, HEAD
    const spine = joints.spine = new THREE.Group();
    spine.name = 'Spine';
    spine.position.y = 0.32;
    body.add(spine);

    const bodySlot = slot('Body');
    spine.add(bodySlot);
    const torsoGeo = (seg) => blob(0.82, 0.84, 0.56, { box: 0.42, top: 1.0, bottom: 0.86, front: 0.06, seg });
    const torso = mesh(torsoGeo(), mats.skin);
    torso.name = 'Torso';
    torso.position.y = 0.42;
    bodySlot.add(torso);

    // Shirt: the torso shape, slightly inflated, with its top clamped into a
    // scooped neckline so the skin of the chest and shoulders shows above.
    const shirtSlot = slot('Shirt');
    spine.add(shirtSlot);
    const shirtGeo = torsoGeo(64);
    shirtGeo.scale(1.045, 1.0, 1.06);
    {
      const p = shirtGeo.attributes.position;
      // Tank-top cut: straps over the shoulders, a scooped neck in front, a
      // shallower one at the back, and deep armholes at the sides.
      const ss = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
      for (let i = 0; i < p.count; i++) {
        const x = Math.abs(p.getX(i)), y = p.getY(i), z = p.getZ(i);
        const neck = z > 0 ? 0.16 : 0.28;
        const strap = ss(0.12, 0.18, x) * (1 - ss(0.27, 0.33, x));
        const arm = ss(0.3, 0.38, x);
        const collar = neck + (0.6 - neck) * strap - (neck - 0.1) * arm;
        if (y > collar) p.setY(i, collar);
        else if (y < -0.4) p.setY(i, -0.4);
      }
      shirtGeo.computeVertexNormals();
    }
    const shirt = mesh(shirtGeo, mats.shirt);
    shirt.name = 'ShirtTorso';
    shirt.position.y = 0.42;
    shirtSlot.add(shirt);
    layers.shirt = shirt;

    const neck = mesh(limb(0.19, 0.2, 0.26), mats.skin);
    neck.name = 'Neck';
    neck.position.y = 1.0;
    bodySlot.add(neck);

    // ARMS
    const arms = slot('Arms');
    spine.add(arms);
    for (const side of ['L', 'R']) {
      const s = side === 'L' ? 1 : -1;
      const sh = joints['sh' + side] = new THREE.Group();
      sh.name = `Shoulder${side}`;
      sh.position.set(0.45 * s, 0.67, 0);
      arms.add(sh);

      const delt = mesh(blob(0.3, 0.29, 0.3, { box: 0.1 }), mats.skin);
      delt.position.y = -0.04;
      sh.add(delt);
      const upper = mesh(limb(0.135, 0.125, DIM.upperArm), mats.skin);
      upper.name = `UpperArm${side}`;
      sh.add(upper);

      const sleeveUp = new THREE.Group();
      const sleeveDelt = mesh(blob(0.33, 0.32, 0.33, { box: 0.1 }), mats.sleeve);
      sleeveDelt.position.y = -0.04;
      sleeveUp.add(sleeveDelt);
      sleeveUp.add(mesh(limb(0.158, 0.148, 0.24), mats.sleeve));
      sh.add(sleeveUp);
      sleeveUp.userData.part = 'Shirt';
      (layers.sleeveUp ??= []).push(sleeveUp);

      const el = joints['el' + side] = new THREE.Group();
      el.name = `Elbow${side}`;
      el.position.y = -DIM.upperArm + 0.02;
      sh.add(el);
      const fore = mesh(limb(0.125, 0.115, DIM.forearm), mats.skin);
      fore.name = `Forearm${side}`;
      el.add(fore);

      const sleeveLo = new THREE.Group();
      const sl = mesh(limb(0.148, 0.138, DIM.forearm - 0.1), mats.sleeve);
      sleeveLo.add(sl);
      el.add(sleeveLo);
      sleeveLo.userData.part = 'Shirt';
      (layers.sleeveLo ??= []).push(sleeveLo);

      // HAND: fingerless glove (dark palm and cuff) with skin fingers curled
      // into a loose fist.
      const hand = joints['hand' + side] = new THREE.Group();
      hand.name = `Hand${side}`;
      hand.userData.part = 'Hands';
      hand.position.y = -DIM.forearm;
      el.add(hand);
      const cuff = mesh(limb(0.14, 0.14, 0.07), mats.gloves);
      cuff.position.y = 0.04;
      hand.add(cuff);
      const palm = mesh(blob(0.26, 0.24, 0.23, { box: 0.45 }), mats.gloves);
      palm.position.y = -0.11;
      hand.add(palm);
      const fingers = mesh(blob(0.235, 0.12, 0.2, { box: 0.5 }), mats.skin);
      fingers.position.set(0, -0.215, 0.03);
      hand.add(fingers);
      const thumb = mesh(blob(0.08, 0.12, 0.08, { box: 0.2 }), mats.skin);
      thumb.position.set(-0.09 * s, -0.13, 0.1);
      thumb.rotation.z = 0.4 * s;
      hand.add(thumb);
    }

    // LEGS
    const legs = slot('Legs');
    body.add(legs);
    for (const side of ['L', 'R']) {
      const s = side === 'L' ? 1 : -1;
      const hip = joints['hip' + side] = new THREE.Group();
      hip.name = `Hip${side}`;
      hip.position.set(0.2 * s, 0.05, 0);
      legs.add(hip);

      const thigh = mesh(limb(0.175, 0.155, DIM.thigh), mats.skin);
      thigh.name = `Thigh${side}`;
      hip.add(thigh);
      // shorts leg: the upper thigh is cloth
      const shortLeg = mesh(limb(0.215, 0.2, 0.26), mats.shorts);
      shortLeg.position.y = -0.02;
      hip.add(shortLeg);
      shortLeg.userData.part = 'Shorts';
      (layers.shortLegs ??= []).push(shortLeg);

      const kn = joints['kn' + side] = new THREE.Group();
      kn.name = `Knee${side}`;
      kn.position.y = -DIM.thigh;
      hip.add(kn);
      const shin = mesh(limb(0.155, 0.13, DIM.shin), mats.skin);
      shin.name = `Shin${side}`;
      kn.add(shin);

      const pants = new THREE.Group();
      pants.add(mesh(limb(0.19, 0.17, DIM.shin - 0.14), mats.pants));
      // the full-length thigh of long trousers
      const pantThigh = mesh(limb(0.212, 0.195, DIM.thigh), mats.pants);
      pantThigh.position.y = DIM.thigh;
      pants.add(pantThigh);
      kn.add(pants);
      pants.userData.part = 'Shorts';
      (layers.pants ??= []).push(pants);

      const sock = mesh(limb(0.163, 0.15, 0.14), mats.sock);
      sock.position.y = -DIM.shin + 0.24;
      kn.add(sock);
      (layers.socks ??= []).push(sock);

      const an = joints['an' + side] = new THREE.Group();
      an.name = `Ankle${side}`;
      an.userData.part = 'Boots';
      an.position.y = -DIM.shin;
      kn.add(an);

      // BOOT: chunky, toe pushed forward, separate sole and a top cuff
      const boot = mesh(blob(0.36, 0.3, 0.46, { box: 0.5, front: 0.12, top: 0.9 }), mats.boots);
      boot.name = `Boot${side}`;
      boot.position.set(0, -0.18, 0.07);
      an.add(boot);
      const shaft = mesh(limb(0.17, 0.18, 0.18), mats.boots);
      shaft.position.y = 0.1;
      const shaftCuff = mesh(limb(0.185, 0.185, 0.03), mats.sole);
      shaftCuff.position.y = 0.11;
      an.add(shaftCuff);
      an.add(shaft);
      const sole = mesh(blob(0.38, 0.08, 0.5, { box: 0.75 }), mats.sole);
      sole.position.set(0, -0.31, 0.075);
      an.add(sole);
    }
  }

  /* ─────────────────────────── head ─────────────────────────── */

  #buildHead() {
    const { joints, mats } = this;
    const head = joints.head = new THREE.Group();
    head.name = 'HeadPivot';
    head.position.y = 0.86;
    joints.spine.add(head);

    // Everything on the head hangs off its centre, so accessories and face
    // parts use head-local coordinates.
    const hc = this.headCenter = this.slots.Head = new THREE.Group();
    hc.name = 'Head';
    hc.userData.part = 'Head';
    hc.position.y = 0.5;
    head.add(hc);

    const { w, h, d } = DIM.head;
    const skull = headGeometry(w, h, d);
    this.headMesh = mesh(skull, mats.headSkin);
    this.headMesh.name = 'Skull';
    hc.add(this.headMesh);
    // A detached copy at the origin, so surface() works in head-local space
    // whatever the rig is doing.
    this.probe = new THREE.Mesh(skull);
    this.probe.updateMatrixWorld(true);
    const earInnerMat = mat(0xd98f6c, { roughness: 0.8 });

    // EARS
    for (const s of [1, -1]) {
      const { p } = this.surface(new THREE.Vector3(s, -0.06, -0.02));
      const ear = mesh(blob(0.11, 0.21, 0.15, { box: 0.1 }), mats.headSkin);
      ear.position.copy(p);
      ear.rotation.y = -0.25 * s;
      ear.rotation.z = -0.08 * s;
      hc.add(ear);
      const inner = mesh(blob(0.05, 0.11, 0.06, { box: 0 }), earInnerMat);
      inner.position.copy(p).add(new THREE.Vector3(0.04 * s, 0, 0.005));
      inner.rotation.y = -0.25 * s;
      hc.add(inner);
      (this.earInner ??= []).push(inner);
    }
  }

  /** Point on the skull surface along a head-local direction, with normal. */
  surface(dir) {
    const d = dir.clone().normalize();
    const ray = new THREE.Raycaster(d.clone().multiplyScalar(3), d.clone().negate(), 0, 6);
    const hit = ray.intersectObject(this.probe, false)[0];
    const n = hit.face.normal.clone();
    return { p: hit.point.clone(), n };
  }

  /* Place an object on the face: on the surface, sunk by `sink`, turned to
     face outward but biased toward the front so features don't splay. */
  #onFace(obj, dir, { sink = 0, front = 0.9 } = {}) {
    const { p, n } = this.surface(dir);
    const look = n.clone().add(new THREE.Vector3(0, 0, front)).normalize();
    obj.position.copy(p).addScaledVector(n, -sink);
    obj.lookAt(obj.position.clone().add(look));
    this.face.add(obj);
    return obj;
  }

  #buildFace() {
    const { mats } = this;
    const face = this.face = this.slots.Face = new THREE.Group();
    face.name = 'Face';
    face.userData.part = 'Face';
    this.headCenter.add(face);

    // EYES — big ovals, pupils toward the nose, a catch-light each
    this.eyes = [];
    for (const s of [1, -1]) {
      const eye = new THREE.Group();
      const white = mesh(blob(0.195, 0.235, 0.09, { box: 0.05 }), mats.eyeWhite, { shadow: false });
      eye.add(white);
      const pupil = mesh(blob(0.135, 0.175, 0.06, { box: 0.05 }), mats.pupil, { shadow: false });
      pupil.position.set(-0.006 * s, -0.004, 0.028);
      eye.add(pupil);
      const glint = mesh(new THREE.SphereGeometry(0.026, 10, 8), mats.eyeWhite, { shadow: false });
      glint.position.set(0.022 * s, 0.045, 0.055);
      eye.add(glint);
      this.#onFace(eye, new THREE.Vector3(0.37 * s, -0.04, 1), { sink: 0.04, front: 1.6 });
      eye.userData = { pupil, side: s, rest: eye.position.clone() };
      this.eyes.push(eye);
    }

    // BROWS — thick, dark, angled down toward the nose: confident, not cross
    this.brows = [];
    for (const s of [1, -1]) {
      const brow = mesh(blob(0.27, 0.09, 0.08, { box: 0.55, top: 0.85 }), mats.brow, { shadow: false });
      const holder = new THREE.Group();
      holder.add(brow);
      this.#onFace(holder, new THREE.Vector3(0.36 * s, 0.22, 1), { sink: 0.015, front: 1.4 });
      holder.userData = { brow, side: s, rest: holder.position.clone() };
      this.brows.push(holder);
    }

    // NOSE
    const nose = mesh(blob(0.085, 0.075, 0.07, { box: 0 }), mats.headSkin, { shadow: false });
    this.#onFace(nose, new THREE.Vector3(0, -0.2, 1), { sink: 0.012 });

    // MOUTH — a small smirk line, plus open shapes for the expressions
    const mouth = this.mouth = new THREE.Group();
    this.#onFace(mouth, new THREE.Vector3(0.04, -0.43, 1), { sink: 0.004, front: 2 });
    const arc = 1.5;
    const smirk = mesh(new THREE.TorusGeometry(0.095, 0.017, 8, 20, arc), mats.mouth, { shadow: false });
    smirk.rotation.z = -Math.PI / 2 - arc / 2 + 0.12;
    smirk.position.y = 0.06;
    smirk.userData.rz = smirk.rotation.z;
    mouth.add(smirk);
    const grin = new THREE.Group();
    const grinShape = new THREE.Mesh(new THREE.CircleGeometry(0.085, 24, Math.PI, Math.PI), mats.mouthIn);
    grinShape.scale.y = 0.85;
    grin.add(grinShape);
    const teeth = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.022), mats.teeth);
    teeth.position.set(0, -0.012, 0.001);
    grin.add(teeth);
    grin.position.z = 0.004;
    mouth.add(grin);
    const oh = new THREE.Mesh(new THREE.CircleGeometry(0.045, 20), mats.mouthIn);
    oh.scale.y = 1.25;
    oh.position.set(-0.03, -0.01, 0.004);
    mouth.add(oh);
    this.mouthShapes = { smirk, grin, oh };

    // MASK OPENING — skin-coloured band around the eyes, only shown when the
    // skull is covered (the masked skin recolours the head, not the eyes).
    const band = mesh(blob(0.64, 0.25, 0.05, { box: 0.6 }), mats.skin, { shadow: false });
    this.#onFace(band, new THREE.Vector3(0, 0.0, 1), { sink: 0.0, front: 3 });
    band.visible = false;
    this.layers.maskBand = band;
  }

  /* The rig decides where a mesh lives (a hand hangs off its elbow, a boot
     off its ankle), so components can't all be sibling groups. Instead every
     mesh is filed under the nearest ancestor that names a component:
       parts.Head, Face, Body, Shirt, Shorts, Arms, Hands, Legs, Boots
     which is what a skin editor or a material swap should iterate. */
  #indexParts() {
    const walk = (o, part) => {
      part = o.userData.part ?? part;
      if (o.isMesh) (this.parts[part] ??= []).push(o);
      for (const c of o.children) walk(c, part);
    };
    walk(this.root, 'Body');
  }

  /* ─────────────────────── expressions ─────────────────────── */

  static EXPRESSIONS = {
    normal:    { brow: 0.16, browY: 0,     mouth: 'smirk', pupil: 1.0 },
    happy:     { brow: -0.05, browY: 0.02, mouth: 'grin',  pupil: 1.0 },
    angry:     { brow: 0.42, browY: -0.03, mouth: 'smirk', pupil: 0.9, frown: true },
    surprised: { brow: -0.2, browY: 0.06,  mouth: 'oh',    pupil: 0.7 },
  };

  setExpression(name) {
    const e = BaseCharacter.EXPRESSIONS[name] ?? BaseCharacter.EXPRESSIONS.normal;
    this.expression = name;
    for (const h of this.brows) {
      h.userData.brow.rotation.z = e.brow * h.userData.side;
      h.userData.brow.position.y = e.browY;
    }
    for (const eye of this.eyes) eye.userData.pupil.scale.setScalar(e.pupil);
    for (const [k, m] of Object.entries(this.mouthShapes)) m.visible = k === e.mouth;
    // a frown is the same arc turned upside down
    const smirk = this.mouthShapes.smirk;
    smirk.rotation.z = smirk.userData.rz + (e.frown ? Math.PI : 0);
    smirk.position.y = e.frown ? -0.08 : 0.06;
  }

  /** 0 = open, 1 = closed. Driven by the animator for blinks. */
  setBlink(v) {
    for (const eye of this.eyes) eye.scale.y = Math.max(0.08, 1 - v);
  }

  /* ─────────────────────────── skins ─────────────────────────── */

  /**
   * Apply a skin definition (see skins.js). Only materials, layer visibility
   * and accessories change; no body geometry is ever touched.
   */
  applySkin(skin) {
    const { mats, layers } = this;
    for (const a of this.accessories) a.removeFromParent();
    this.accessories = [];

    const set = (m, v) => {
      if (v == null) return;
      if (v.isTexture) { m.map = v; m.color.set(0xffffff); }
      else { m.map = null; m.color.set(v); }
      m.needsUpdate = true;
    };
    const c = { ...BASE_SKIN.colors, ...skin.colors };
    set(mats.skin, c.skin);
    set(mats.headSkin, c.head ?? c.skin);
    set(mats.shirt, c.shirt);
    set(mats.sleeve, c.sleeve ?? c.shirt);
    set(mats.shorts, c.shorts);
    set(mats.pants, c.pants ?? c.shorts);
    set(mats.sock, c.sock ?? 0xffffff);
    set(mats.belt, c.belt);
    set(mats.boots, c.boots);
    set(mats.gloves, c.gloves);

    const sleeves = skin.sleeves ?? 'none';
    for (const g of layers.sleeveUp) g.visible = sleeves !== 'none';
    for (const g of layers.sleeveLo) g.visible = sleeves === 'long';
    for (const g of layers.pants) g.visible = !!skin.longPants;
    for (const g of layers.shortLegs) g.visible = !skin.longPants;
    for (const g of layers.socks) g.visible = !!skin.socks;
    layers.maskBand.visible = !!skin.mask;
    this.mouth.visible = !skin.mask;
    // the mask opening sits on the skull, so lift the eyes and brows clear of it
    for (const f of [...this.eyes, ...this.brows]) {
      f.position.copy(f.userData.rest);
      if (skin.mask) f.translateZ(0.035);
    }
    for (const e of this.earInner) e.visible = !skin.mask;

    if (skin.accessories) {
      for (const a of skin.accessories(this)) this.accessories.push(a);
    }
    this.skin = skin.id;
  }

  /** Attach an accessory to a named mount: head, spine, hipL, … */
  mount(where, obj) {
    const parent = where === 'head' ? this.headCenter : this.joints[where];
    obj.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    parent.add(obj);
    return obj;
  }
}

export const BASE_SKIN = {
  colors: {
    skin: PALETTE.skin, shirt: PALETTE.shirt, shorts: PALETTE.shorts,
    belt: 0xdad8d2, boots: PALETTE.boots, gloves: PALETTE.gloves,
  },
};
