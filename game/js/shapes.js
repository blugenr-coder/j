/* Small material and mesh helpers for the world. (The character itself is
   modelled in Blender: see game/blender/build_character.py.) */

import * as THREE from '../vendor/three.module.min.js';

export function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0, ...opts });
}

export function mesh(geo, material, { shadow = true } = {}) {
  const m = new THREE.Mesh(geo, material);
  m.castShadow = shadow;
  m.receiveShadow = true;
  return m;
}
