"""Build the player character in Blender and export it as game/models/character.glb.

Run with Blender's Python module (no Blender UI needed):

    pip install bpy==4.2.0 scikit-image numpy
    python game/blender/build_character.py

or inside a Blender install:  blender -b -P game/blender/build_character.py

How the model is made
---------------------
Every shape is described as a signed distance field (SDF): a function that
says, for any point, how far it is from the surface. Body parts are joined
with a *smooth* union, so the arms, neck and legs grow out of the torso as one
continuous skin instead of overlapping pieces. Marching cubes turns each field
into a mesh; Blender then decimates it, assigns materials and UVs, builds the
armature, skins every mesh to it, adds the facial shape keys and exports glTF.

Coordinates in this file are the game's (Three.js): Y up, +Z is where the
character faces, +X is the character's LEFT. They are converted to Blender's
Z-up only when meshes and bones are created, and the glTF exporter converts
them back, so the numbers here are the numbers the game sees.

The arms are modelled in an A-pose (40 degrees out) so the field never fuses
them to the torso; the game lowers them at load time.
"""

import math
import os
import shutil
import subprocess

import numpy as np
from skimage.measure import marching_cubes
import bpy
import bmesh

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'models', 'character.glb'))

V = lambda *a: np.array(a, dtype=float)


def unit(v):
    return v / np.linalg.norm(v)


# ───────────────────────── proportions ─────────────────────────
# Must agree with DIM in game/js/character.js.

HIP_Y = 1.10            # body bone (pelvis pivot)
SPINE_Y = 1.42
HEAD_PIVOT_Y = 2.28
HEAD_C = V(0, 2.78, 0)  # centre of the skull
HEAD_R = V(0.45, 0.50, 0.47)   # 0.9 wide, 1.0 tall
ARM_BIND = 0.7          # A-pose angle (radians) the arms are modelled at
UPPER, FORE = 0.32, 0.30


def arm_points(s):
    S = V(0.45 * s, 2.09, 0.0)
    d = V(math.sin(ARM_BIND) * s, -math.cos(ARM_BIND), 0.0)
    E = S + d * UPPER
    W = E + d * FORE
    return S, E, W, d


def leg_points(s):
    return V(0.2 * s, 1.15, 0), V(0.2 * s, 0.75, 0), V(0.2 * s, 0.35, 0)


# ───────────────────────── SDF toolkit ─────────────────────────

def dot(a, b):
    return (a * b).sum(-1)


def sd_sphere(P, c, r):
    return np.linalg.norm(P - c, axis=-1) - r


def sd_ellipsoid(P, c, r):
    q = (P - c) / r
    k0 = np.linalg.norm(q, axis=-1)
    k1 = np.linalg.norm((P - c) / (r * r), axis=-1)
    return k0 * (k0 - 1) / np.maximum(k1, 1e-9)


def sd_capsule(P, a, b, r):
    pa, ba = P - a, b - a
    h = np.clip(pa @ ba / (ba @ ba), 0, 1)
    return np.linalg.norm(pa - np.outer(h, ba), axis=-1) - r


def sd_round_cone(P, a, b, r1, r2):
    """Tapered capsule from a (radius r1) to b (radius r2). After I. Quilez."""
    ba = b - a
    l2 = ba @ ba
    rr = r1 - r2
    a2 = l2 - rr * rr
    il2 = 1.0 / l2
    pa = P - a
    y = pa @ ba
    z = y - l2
    w = pa * l2 - np.outer(y, ba)
    x2 = (w * w).sum(-1)
    y2 = y * y * l2
    z2 = z * z * l2
    k = np.sign(rr) * rr * rr * x2
    out = (np.sqrt(np.maximum(x2 * a2 * il2, 0)) + y * rr) * il2 - r1
    out = np.where(np.sign(y) * a2 * y2 < k, np.sqrt(x2 + y2) * il2 - r1, out)
    out = np.where(np.sign(z) * a2 * z2 > k, np.sqrt(x2 + z2) * il2 - r2, out)
    return out


def sd_round_box(P, c, half, r, axes=None):
    q = P - c
    if axes is not None:
        q = q @ axes            # columns of `axes` are the box's local axes
    q = np.abs(q) - (np.asarray(half) - r)
    return np.linalg.norm(np.maximum(q, 0), axis=-1) + np.minimum(q.max(-1), 0) - r


def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b + (a - b) * h - k * h * (1 - h)


def smax(a, b, k):
    return -smin(-a, -b, k)


def ss(a, b, v):
    t = np.clip((v - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def above(P, y):      # inside where P.y > y
    return y - P[:, 1]


def below(P, y):      # inside where P.y < y
    return P[:, 1] - y


# ───────────────────────── body fields ─────────────────────────

def torso(P):
    return smin(sd_ellipsoid(P, V(0, 1.86, 0), V(0.40, 0.42, 0.275)),
                sd_ellipsoid(P, V(0, 2.02, 0), V(0.43, 0.24, 0.285)), 0.1)


def pelvis(P):
    return sd_ellipsoid(P, V(0, 1.30, 0), V(0.37, 0.24, 0.27))


def trunk(P):
    return smin(torso(P), pelvis(P), 0.12)


def neck(P):
    return sd_round_cone(P, V(0, 2.12, 0), V(0, 2.42, 0), 0.19, 0.18)


def delt(P, s):
    S, _, _, _ = arm_points(s)
    return sd_sphere(P, S + V(0, -0.03, 0), 0.155)


def upper_arm(P, s):
    S, E, _, _ = arm_points(s)
    return sd_round_cone(P, S, E, 0.138, 0.124)


def forearm(P, s):
    _, E, W, _ = arm_points(s)
    return sd_round_cone(P, E, W, 0.124, 0.113)


def arm(P, s):
    return smin(delt(P, s), smin(upper_arm(P, s), forearm(P, s), 0.04), 0.05)


def thigh(P, s):
    H, K, _ = leg_points(s)
    return sd_round_cone(P, H, K, 0.175, 0.152)


def shin(P, s):
    _, K, A = leg_points(s)
    return sd_round_cone(P, K, A + V(0, 0.03, 0), 0.152, 0.128)


def leg(P, s):
    return smin(thigh(P, s), shin(P, s), 0.04)


def body_skin(P):
    d = smin(trunk(P), neck(P), 0.06)
    for s in (1, -1):
        d = smin(d, arm(P, s), 0.05)
        d = smin(d, leg(P, s), 0.06)
    return d


def arm_t(P, s):
    """Distance along the arm from the shoulder."""
    S, _, _, d = arm_points(s)
    return (P - S) @ d


# ── head ──

def head_base(P):
    q = P - HEAD_C
    yn = q[:, 1] / HEAD_R[1]
    t = np.clip(-yn, 0, 1) ** 1.6
    sx = np.where(yn < 0, 1 - 0.12 * t, 1 + 0.03 * np.sin(np.pi * np.clip(yn, 0, 1)))
    sz = 1 - 0.06 * t
    q = np.stack([q[:, 0] / sx, q[:, 1], q[:, 2] / sz], 1)
    return sd_ellipsoid(q, V(0, 0, 0), HEAD_R)


def head_full(P):
    d = head_base(P)
    for s in (1, -1):
        ear = sd_ellipsoid(P, V(0.435 * s, 2.73, -0.01), V(0.06, 0.108, 0.078))
        ear = smax(ear, -sd_sphere(P, V(0.5 * s, 2.73, 0.015), 0.045), 0.01)
        d = smin(d, ear, 0.03)
    nose = sd_ellipsoid(P, V(0, 2.6, 0.445), V(0.047, 0.042, 0.042))
    return smin(d, nose, 0.03)


# ── clothing ──
# Garments are body fields pushed outward and trimmed. Trims use a slightly
# rounded intersection so hems come out as soft, clean edges rather than
# the stair-steps a hard cut leaves after meshing.

def cut(a, b):
    return smax(a, b, 0.022)


def collar_y(P, front, back, strap_top=2.6, arm_y=1.97):
    """Tank-top cut: scooped neck, straps over the shoulders, deep armholes."""
    x, z = np.abs(P[:, 0]), P[:, 2]
    neck_y = back + (front - back) * ss(-0.08, 0.08, z)
    strap = ss(0.11, 0.17, x) * (1 - ss(0.27, 0.33, x))
    armhole = ss(0.30, 0.38, x)
    return neck_y + (strap_top - neck_y) * strap - (neck_y - arm_y) * armhole


def shirt_tank(P):
    d = trunk(P) - 0.028
    d = cut(d, P[:, 1] - collar_y(P, 2.10, 2.20))
    d = cut(d, above(P, 1.40))
    for s in (1, -1):
        S, E, _, _ = arm_points(s)
        d = cut(d, -sd_capsule(P, S, E, 0.165))
    return d


def shirt_crew(P):
    d = trunk(P) - 0.03
    d = smin(d, neck(P) - 0.028, 0.05)
    d = cut(d, below(P, 2.26))
    return cut(d, above(P, 1.40))


def sleeve(P, length, off=0.032):
    d = np.full(len(P), 1e9)
    for s in (1, -1):
        part = smin(delt(P, s), upper_arm(P, s), 0.05)
        if length > UPPER:
            part = smin(part, forearm(P, s), 0.04)
        part = part - off
        t = arm_t(P, s)
        part = cut(part, t - length)
        part = cut(part, -0.25 - t)
        d = np.minimum(d, part)
    return d


def legwear(P, bottom, top=1.44, off=0.035, shins=False):
    d = pelvis(P)
    for s in (1, -1):
        d = smin(d, leg(P, s) if shins else thigh(P, s), 0.08)
    d = d - off
    d = cut(d, above(P, bottom))
    return cut(d, below(P, top))


def belt(P):
    d = smin(pelvis(P), torso(P), 0.12) - 0.05
    d = cut(d, above(P, 1.385))
    return cut(d, below(P, 1.465))


def socks(P):
    d = np.minimum(shin(P, 1), shin(P, -1)) - 0.03
    return cut(cut(d, above(P, 0.52)), below(P, 0.75))


def boot(P, s):
    x = 0.2 * s
    shaft = sd_round_cone(P, V(x, 0.18, 0.0), V(x, 0.6, 0.0), 0.185, 0.178)
    foot = sd_round_box(P, V(x, 0.155, 0.075), (0.155, 0.1, 0.225), 0.075)
    toe = sd_ellipsoid(P, V(x, 0.15, 0.2), V(0.17, 0.12, 0.14))
    d = smin(smin(shaft, foot, 0.08), toe, 0.06)
    return cut(d, above(P, 0.07))


def boots(P):
    return np.minimum(boot(P, 1), boot(P, -1))


def soles(P):
    return np.minimum(*(sd_round_box(P, V(0.2 * s, 0.05, 0.08), (0.19, 0.05, 0.27), 0.045) for s in (1, -1)))


def boot_cuffs(P):
    d = np.minimum(*(sd_round_cone(P, V(0.2 * s, 0.585, 0), V(0.2 * s, 0.62, 0), 0.195, 0.195) for s in (1, -1)))
    return d


def hand_frame(s):
    _, _, W, d = arm_points(s)
    f = V(0, 0, 1)
    side = unit(np.cross(d, f))
    return W, np.stack([side, d, f], 1), d, f


def gloves(P):
    out = np.full(len(P), 1e9)
    for s in (1, -1):
        W, axes, d, f = hand_frame(s)
        cuff = sd_capsule(P, W - d * 0.03, W + d * 0.05, 0.142)
        palm = sd_round_box(P, W + d * 0.125, (0.125, 0.115, 0.11), 0.06, axes)
        out = np.minimum(out, smin(cuff, palm, 0.04))
    return out


def fingers(P):
    out = np.full(len(P), 1e9)
    for s in (1, -1):
        W, axes, d, f = hand_frame(s)
        fing = sd_round_box(P, W + d * 0.225 + f * 0.03, (0.118, 0.062, 0.1), 0.055, axes)
        inner = V(-s, 0, 0)
        thumb = sd_ellipsoid(P, W + d * 0.14 + f * 0.1 + inner * 0.075, V(0.045, 0.06, 0.045))
        out = np.minimum(out, smin(fing, thumb, 0.02))
    return out


# ── accessories ──

def helmet(P):
    shell = cut(head_base(P) - 0.065, above(P, 2.975))
    brim = sd_ellipsoid(P, V(0, 2.985, 0.025), V(0.575, 0.028, 0.6))
    return smin(shell, brim, 0.015)


def hood(P):
    q = P - HEAD_C
    shell = np.abs(head_base(P) - 0.08) - 0.028
    ell = np.sqrt((q[:, 0] / 0.32) ** 2 + ((q[:, 1] + 0.07) / 0.38) ** 2) - 1
    opening = cut(0.04 - q[:, 2], ell * 0.3)
    d = cut(shell, -opening)
    return cut(d, above(P, 2.26))


def _band_y(P):
    return P[:, 1] + 0.1 * (P[:, 2] - HEAD_C[2])


def headband(P):
    return cut(np.abs(head_base(P) - 0.02) - 0.02, np.abs(_band_y(P) - 3.0) - 0.05)


def headband_stripe(P):
    return cut(np.abs(head_base(P) - 0.032) - 0.012, np.abs(_band_y(P) - 3.0) - 0.016)


def mask_band(P):
    q = P - HEAD_C
    ell = (np.sqrt((q[:, 0] / 0.34) ** 2 + ((q[:, 1] - 0.05) / 0.135) ** 2) - 1) * 0.12
    d = cut(head_base(P) - 0.004, ell)
    return cut(d, 0.05 - q[:, 2])


def vest(P):
    d = trunk(P) - 0.075
    d = cut(d, above(P, 1.47))
    d = cut(d, P[:, 1] - collar_y(P, 2.05, 2.2, strap_top=2.6, arm_y=2.0))
    for s in (1, -1):
        S, E, _, _ = arm_points(s)
        d = cut(d, -sd_capsule(P, S, E, 0.2))
    return d


def vest_pouches(P):
    return np.minimum.reduce([sd_round_box(P, V(x, 1.66, 0.335), (0.075, 0.085, 0.05), 0.022) for x in (-0.2, 0.0, 0.2)])


def drawstrings(P):
    return np.minimum(*(sd_capsule(P, V(0.08 * s, 1.98, 0.318), V(0.075 * s, 2.2, 0.31), 0.014) for s in (1, -1)))


# ───────────────────────── meshing ─────────────────────────

def polygonize(fn, lo, hi, voxel):
    lo, hi = np.asarray(lo, float) - voxel * 2, np.asarray(hi, float) + voxel * 2
    axes = [np.arange(lo[i], hi[i] + voxel, voxel) for i in range(3)]
    G = np.stack(np.meshgrid(*axes, indexing='ij'), -1)
    vals = fn(G.reshape(-1, 3)).reshape(G.shape[:3])
    verts, faces, _, _ = marching_cubes(vals, 0.0, spacing=(voxel,) * 3, allow_degenerate=False)
    verts += lo
    # make sure triangles wind outward (positive signed volume)
    a, b, c = verts[faces[:, 0]], verts[faces[:, 1]], verts[faces[:, 2]]
    if (a * np.cross(b, c)).sum() < 0:
        faces = faces[:, ::-1]
    return verts, faces


def to_bl(v):
    v = np.asarray(v, float).reshape(-1, 3)
    return np.stack([v[:, 0], -v[:, 2], v[:, 1]], 1)


def from_bl(v):
    v = np.asarray(v, float).reshape(-1, 3)
    return np.stack([v[:, 0], v[:, 2], -v[:, 1]], 1)


COLL = None


def new_object(name, verts, faces):
    me = bpy.data.meshes.new(name)
    me.from_pydata(to_bl(verts).tolist(), [], np.asarray(faces).tolist())
    me.validate()
    me.update()
    ob = bpy.data.objects.new(name, me)
    COLL.objects.link(ob)
    return ob


def cleanup(ob):
    """Weld duplicate vertices, drop zero-area faces, make every face point
    outward and leave only triangles. Marching cubes produces slivers whose
    normals are undefined; left in, they render as black specks."""
    bm = bmesh.new()
    bm.from_mesh(ob.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bmesh.ops.dissolve_degenerate(bm, edges=bm.edges, dist=1e-5)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bm.to_mesh(ob.data)
    bm.free()
    ob.data.update()


def orient(ob):
    """Only make faces point outward; keeps vertex and face order intact
    (shape keys and material indices depend on it)."""
    bm = bmesh.new()
    bm.from_mesh(ob.data)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(ob.data)
    bm.free()


def apply_modifiers(ob):
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    ob.modifiers.clear()
    old = ob.data
    ob.data = me
    bpy.data.meshes.remove(old)
    me.name = ob.name


def decimate(ob, target_tris):
    n = len(ob.data.polygons)
    if n <= target_tris:
        return
    m = ob.modifiers.new('decimate', 'DECIMATE')
    m.ratio = target_tris / n
    apply_modifiers(ob)


def mesh_verts(ob):
    co = np.empty(len(ob.data.vertices) * 3)
    ob.data.vertices.foreach_get('co', co)
    return from_bl(co)


def face_centres(ob):
    me = ob.data
    c = np.empty(len(me.polygons) * 3)
    me.polygons.foreach_get('center', c)
    return from_bl(c)


def gradient(fn, P, e=5e-4):
    g = np.empty_like(P)
    for i in range(3):
        o = np.zeros(3)
        o[i] = e
        g[:, i] = (fn(P + o) - fn(P - o)) / (2 * e)
    return g


def snap(ob, fn, voxel):
    """Pull every vertex back onto the exact surface. Decimation moves
    vertices off it; a few clamped Newton steps put them back, so the
    silhouette follows the true curve instead of the simplified one."""
    P = mesh_verts(ob)
    for _ in range(4):
        d = fn(P)
        g = gradient(fn, P)
        gg = np.maximum((g * g).sum(1), 1e-8)
        step = np.clip(d / gg, -voxel, voxel)[:, None] * g
        P = P - step
    ob.data.vertices.foreach_set('co', to_bl(P).ravel())
    ob.data.update()


def exact_normals(ob, fn):
    """Shade from the surface's true normal (the field's gradient) rather
    than from the triangles. This is what removes faceting and streaks: the
    lighting is as smooth as the math, whatever the triangle count."""
    P = mesh_verts(ob)
    g = gradient(fn, P)
    n = g / np.maximum(np.linalg.norm(g, axis=1, keepdims=True), 1e-9)
    ob.data.normals_split_custom_set_from_vertices(to_bl(n).tolist())


def sdf_object(name, fn, lo, hi, voxel, tris):
    verts, faces = polygonize(fn, lo, hi, voxel)
    ob = new_object(name, verts, faces)
    cleanup(ob)
    decimate(ob, tris)
    cleanup(ob)
    snap(ob, fn, voxel)
    return ob


# ── parametric meshes for the face and glasses ──

def sphere_mesh(nu=24, nv=16):
    verts = [(0, 1, 0)]
    for j in range(1, nv):
        th = math.pi * j / nv
        for i in range(nu):
            ph = 2 * math.pi * i / nu
            verts.append((math.sin(th) * math.sin(ph), math.cos(th), math.sin(th) * math.cos(ph)))
    verts.append((0, -1, 0))
    faces = []
    ring = lambda j, i: 1 + (j - 1) * nu + (i % nu)
    for i in range(nu):
        faces.append((0, ring(1, i + 1), ring(1, i)))
        faces.append((len(verts) - 1, ring(nv - 1, i), ring(nv - 1, i + 1)))
    for j in range(1, nv - 1):
        for i in range(nu):
            a, b, c, d = ring(j, i), ring(j, i + 1), ring(j + 1, i + 1), ring(j + 1, i)
            faces += [(a, b, c), (a, c, d)]
    return np.array(verts, float), np.array(faces)


def blob(w, h, d, box=0.0, nu=24, nv=16):
    v, f = sphere_mesh(nu, nv)
    e = 1 - box * 0.85
    v = np.sign(v) * np.abs(v) ** e
    return v * V(w / 2, h / 2, d / 2), f


def crescent(R, r, arc, start, nu=32, nv=12, flat=0.55):
    """A tube bent along an arc that tapers to rounded points at both ends:
    a brush-stroke line for the mouth, with no caps or seams."""
    verts, faces = [], []
    for i in range(nu + 1):
        t = i / nu
        a = start + arc * t
        rad = r * max(math.sin(math.pi * t), 0.0) ** 0.55
        rad = max(rad, r * 0.04)
        for j in range(nv):
            b = 2 * math.pi * j / nv
            rr = R + math.cos(b) * rad
            verts.append((math.cos(a) * rr, math.sin(a) * rr, math.sin(b) * rad * flat))
    for i in range(nu):
        for j in range(nv):
            a0, a1 = i * nv + j, i * nv + (j + 1) % nv
            b0, b1 = a0 + nv, a1 + nv
            faces += [(a0, b0, b1), (a0, b1, a1)]
    # close the two pointed ends with a fan
    v = list(verts)
    for i, (ring, flip) in enumerate(((0, True), (nu, False))):
        a = start + arc * (ring / nu)
        v.append((math.cos(a) * R, math.sin(a) * R, 0.0))
        c = len(v) - 1
        for j in range(nv):
            q0, q1 = ring * nv + j, ring * nv + (j + 1) % nv
            faces.append((c, q1, q0) if flip else (c, q0, q1))
    return np.array(v, float), np.array(faces)


class Frame:
    """A local frame on the head surface: z points out of the face."""

    def __init__(self, o, x, y, z):
        self.o, self.M = o, np.stack([x, y, z], 1)

    def world(self, v):
        return self.o + np.asarray(v) @ self.M.T


def head_surface(direction):
    d = unit(np.asarray(direction, float))
    lo, hi = 0.0, 1.0
    for _ in range(40):                     # bisection along the ray from the centre
        mid = (lo + hi) / 2
        if head_base((HEAD_C + d * mid)[None])[0] < 0:
            lo = mid
        else:
            hi = mid
    p = HEAD_C + d * lo
    e = 1e-4
    g = V(*[(head_base((p + np.eye(3)[i] * e)[None])[0] - head_base((p - np.eye(3)[i] * e)[None])[0]) for i in range(3)])
    return p, unit(g)


def face_frame(direction, sink=0.0, front=0.9):
    p, n = head_surface(direction)
    z = unit(n + V(0, 0, front))
    x = unit(np.cross(V(0, 1, 0), z))
    y = np.cross(z, x)
    return Frame(p - n * sink, x, y, z)


def rotz(v, a):
    c, s = math.cos(a), math.sin(a)
    return np.stack([v[:, 0] * c - v[:, 1] * s, v[:, 0] * s + v[:, 1] * c, v[:, 2]], 1)


# ───────────────────────── materials ─────────────────────────

MATS = {}


def srgb(hexv):
    out = []
    for k in (16, 8, 0):
        c = ((hexv >> k) & 255) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


def material(name, hexv, rough=0.75, metal=0.0, double=False):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = srgb(hexv)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    m.use_backface_culling = not double
    MATS[name] = m
    return m


def set_material(ob, *names, index=None):
    for n in names:
        ob.data.materials.append(MATS[n])
    if index is not None:
        ob.data.polygons.foreach_set('material_index', np.asarray(index, dtype=np.int32))


def smooth(ob):
    ob.data.shade_smooth()


# ───────────────────────── UVs ─────────────────────────

def set_uv(ob, fn):
    """fn(points) -> (u, v) per point; evaluated per face corner, with the
    wrap-around seam fixed per triangle so no face spans the whole texture."""
    me = ob.data
    nl = len(me.loops)
    vi = np.empty(nl, dtype=np.int64)
    me.loops.foreach_get('vertex_index', vi)
    P = mesh_verts(ob)[vi]
    u, v = fn(P)
    tri = np.arange(nl).reshape(-1, 3)      # meshes are all triangles
    uu = u[tri]
    span = uu.max(1) - uu.min(1)
    wrap = (span > 0.5)[:, None] & (uu < 0.5)
    uu = uu + wrap
    uv = me.uv_layers.new(name='UVMap')
    uv.data.foreach_set('uv', np.stack([uu.ravel(), v], 1).ravel())


def uv_body(y0, y1):
    def fn(P):
        u = 0.5 + np.arctan2(P[:, 0], P[:, 2]) / (2 * np.pi)
        return u, (P[:, 1] - y0) / (y1 - y0)
    return fn


def uv_arms(P):
    u = np.zeros(len(P))
    v = np.zeros(len(P))
    for s in (1, -1):
        m = np.sign(P[:, 0]) == s
        S, _, _, d = arm_points(s)
        f = V(0, 0, 1)
        side = unit(np.cross(d, f))
        q = P[m] - S
        u[m] = 0.5 + np.arctan2(q @ side * s, q @ f) / (2 * np.pi)
        v[m] = 1 - (q @ d) / 0.9
    return u, v


def uv_legwear(P):
    """Each half is unwrapped around its own leg, all the way up to the
    waist, so the only seams run down the centre front and back, where
    real trousers have them, and the texture never jumps sideways."""
    xs = np.where(P[:, 0] >= 0, 0.2, -0.2)
    u = 0.5 + np.arctan2(P[:, 0] - xs, P[:, 2]) / (2 * np.pi)
    return u, P[:, 1] / 0.9


# ───────────────────────── armature & skinning ─────────────────────────

BONES = {}   # name -> (head, tail, parent)


def define_bones():
    BONES['body'] = (V(0, HIP_Y, 0), V(0, SPINE_Y, 0), None)
    BONES['spine'] = (V(0, SPINE_Y, 0), V(0, HEAD_PIVOT_Y, 0), 'body')
    BONES['head'] = (V(0, HEAD_PIVOT_Y, 0), V(0, 3.25, 0), 'spine')
    for s, side in ((1, 'L'), (-1, 'R')):
        S, E, W, d = arm_points(s)
        BONES['sh' + side] = (S, E, 'spine')
        BONES['el' + side] = (E, W, 'sh' + side)
        BONES['hand' + side] = (W, W + d * 0.24, 'el' + side)
        H, K, A = leg_points(s)
        BONES['hip' + side] = (H, K, 'body')
        BONES['kn' + side] = (K, A, 'hip' + side)
        BONES['an' + side] = (A, A + V(0, -0.2, 0.22), 'kn' + side)


def build_armature():
    arm = bpy.data.armatures.new('Rig')
    rig = bpy.data.objects.new('Rig', arm)
    COLL.objects.link(rig)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode='EDIT')
    for name, (h, t, parent) in BONES.items():
        b = arm.edit_bones.new(name)
        b.head = to_bl(h)[0]
        b.tail = to_bl(t)[0]
        if parent:
            b.parent = arm.edit_bones[parent]
    bpy.ops.object.mode_set(mode='OBJECT')
    return rig


def weight_shapes():
    """Volumes that say which bone owns which part of the body."""
    shapes = [
        ('body', 'cap', V(-0.2, 1.27, 0), V(0.2, 1.27, 0), 0.26),
        ('spine', 'cap', V(0, 1.6, 0), V(0, 2.05, 0), 0.38),
        ('spine', 'cap', V(-0.28, 2.05, 0), V(0.28, 2.05, 0), 0.22),
        ('spine', 'cap', V(0, 2.15, 0), V(0, 2.3, 0), 0.19),
        ('head', 'sph', HEAD_C, None, 0.48),
    ]
    for s, side in ((1, 'L'), (-1, 'R')):
        S, E, W, d = arm_points(s)
        H, K, A = leg_points(s)
        shapes += [
            ('sh' + side, 'cap', S, E, 0.14),
            ('el' + side, 'cap', E, W, 0.125),
            ('hand' + side, 'cap', W, W + d * 0.25, 0.13),
            ('hip' + side, 'cap', H, K, 0.18),
            ('kn' + side, 'cap', K, A, 0.15),
        ]
        # No ankle volume: the ankle moves only the rigid boots. Letting it
        # pull on the shins as well dragged trouser hems through the boots.
    return shapes


def compute_weights(P, blend=0.17):
    names = list(BONES)
    D = np.full((len(P), len(names)), 1e9)
    for bone, kind, a, b, r in weight_shapes():
        d = sd_sphere(P, a, r) if kind == 'sph' else sd_capsule(P, a, b, r)
        j = names.index(bone)
        D[:, j] = np.minimum(D[:, j], d)
    W = np.clip(1 - (D - D.min(1, keepdims=True)) / blend, 0, 1) ** 2
    # glTF carries four influences per vertex: keep the strongest four
    weakest = np.argsort(W, 1)[:, :-4]
    np.put_along_axis(W, weakest, 0, 1)
    return names, W / W.sum(1, keepdims=True)


def boot_weights(P):
    """Boots bend like boots: the foot turns with the ankle, the shaft
    follows the shin, blended across the ankle so the leather flexes."""
    names = list(BONES)
    W = np.zeros((len(P), len(names)))
    t = ss(0.3, 0.5, P[:, 1])
    left = P[:, 0] >= 0
    for side, m in (('L', left), ('R', ~left)):
        W[m, names.index('an' + side)] = 1 - t[m]
        W[m, names.index('kn' + side)] = t[m]
    return W


def skin(ob, rig, rigid=None, weights=None):
    """Bind to the armature. rigid: a bone name, or fn(P) -> bone name per
    vertex. weights: fn(P) -> full weight matrix. Neither: body weights."""
    P = mesh_verts(ob)
    names = list(BONES)
    if weights is not None:
        W = weights(P)
    elif rigid is None:
        names, W = compute_weights(P)
    else:
        W = np.zeros((len(P), len(names)))
        labels = rigid(P) if callable(rigid) else np.full(len(P), rigid)
        for j, n in enumerate(names):
            W[labels == n, j] = 1
    for j, n in enumerate(names):
        idx = np.nonzero(W[:, j] > 1e-3)[0]
        if not len(idx):
            continue
        vg = ob.vertex_groups.new(name=n)
        for i in idx:
            vg.add([int(i)], float(W[i, j]), 'REPLACE')
    ob.parent = rig
    mod = ob.modifiers.new('Armature', 'ARMATURE')
    mod.object = rig


def by_side(prefix):
    return lambda P: np.where(P[:, 0] >= 0, prefix + 'L', prefix + 'R')


def add_shape_keys(ob, keys):
    """keys: {name: points (game coords) in vertex order}."""
    ob.shape_key_add(name='Basis', from_mix=False)
    for name, P in keys.items():
        k = ob.shape_key_add(name=name, from_mix=False)
        k.data.foreach_set('co', to_bl(P).ravel())


# ───────────────────────── face ─────────────────────────

def merge(parts):
    """parts: list of (verts, faces, material_index) -> verts, faces, mat index per face."""
    vs, fs, ms, off = [], [], [], 0
    for v, f, m in parts:
        vs.append(v)
        fs.append(f + off)
        ms.append(np.full(len(f), m))
        off += len(v)
    return np.vstack(vs), np.vstack(fs), np.concatenate(ms)


EXPRESSION_BROWS = {          # (inner-down rotation, lift) relative to the face
    'Basis': (0.16, 0.0),
    'Angry': (0.42, -0.03),
    'Happy': (-0.05, 0.02),
    'Surprised': (-0.2, 0.06),
}


def build_eyes():
    pieces = []          # (frame, local verts, faces, material index)
    for s in (1, -1):
        fr = face_frame(V(0.37 * s, -0.04, 1), sink=0.035, front=1.6)
        wv, wf = blob(0.195, 0.235, 0.09, 0.05)
        pv, pf = blob(0.135, 0.175, 0.06, 0.05)
        gv, gf = blob(0.052, 0.052, 0.052, 0, 10, 8)
        pieces += [(fr, wv, wf, 0),
                   (fr, pv + V(-0.006 * s, -0.004, 0.028), pf, 1),
                   (fr, gv + V(0.022 * s, 0.045, 0.055), gf, 0)]
    v, f, mi = merge([(fr.world(lv), lf, m) for fr, lv, lf, m in pieces])
    # Blink squashes each eye onto its centre line; Small shrinks the pupils.
    blink = [fr.world(lv * V(1, 0.08, 1)) for fr, lv, _, _ in pieces]
    small = [fr.world(lv.mean(0) + (lv - lv.mean(0)) * 0.7) if m == 1 else fr.world(lv)
             for fr, lv, _, m in pieces]
    return v, f, mi, {'Blink': np.vstack(blink), 'Small': np.vstack(small)}


def build_brows():
    pieces = []
    for s in (1, -1):
        fr = face_frame(V(0.36 * s, 0.22, 1), sink=0.015, front=1.4)
        lv, f = blob(0.27, 0.09, 0.08, 0.55)
        lv = lv * np.where(lv[:, 1:2] > 0, V(0.85, 1, 0.85), V(1, 1, 1))  # taper the top edge
        pieces.append((s, fr, lv, f))
    v, f, _ = merge([(fr.world(rotz(lv, EXPRESSION_BROWS['Basis'][0] * s)), f, 0) for s, fr, lv, f in pieces])
    keys = {}
    for name, (rot, lift) in EXPRESSION_BROWS.items():
        if name == 'Basis':
            continue
        keys[name] = np.vstack([fr.world(rotz(lv, rot * s) + V(0, lift, 0)) for s, fr, lv, f in pieces])
    return v, f, keys


def build_mouth():
    fr = face_frame(V(0.04, -0.43, 1), sink=0.004, front=2)
    arc = 1.5
    rz = -math.pi / 2 - arc / 2 + 0.12
    sv, sf = crescent(0.095, 0.02, arc, 0)
    smirk = rotz(sv, rz) + V(0, 0.06, 0)
    frown = rotz(sv, rz + math.pi) + V(0, -0.08, 0)
    gv, gf = blob(0.17, 0.145, 0.03, 0.1)
    gv[:, 1] = np.minimum(gv[:, 1], 0.0)             # D-shaped open grin
    tv, tf = blob(0.15, 0.024, 0.02, 0.7)
    tv = tv + V(0, -0.013, 0.008)
    ov, of = blob(0.09, 0.112, 0.03, 0.05)
    ov = ov + V(-0.03, -0.01, 0)
    return {
        'smirk': (fr.world(smirk), sf, {'Frown': fr.world(frown)}),
        'grin': merge([(fr.world(gv), gf, 0), (fr.world(tv), tf, 1)]),
        'oh': (fr.world(ov), of),
    }


def build_sunglasses():
    parts = []
    for s in (1, -1):
        fr = face_frame(V(0.37 * s, -0.04, 1), sink=0.035, front=1.6)
        lv, lf = blob(0.23, 0.17, 0.05, 0.55)
        parts.append((fr.world(lv + V(0, 0.02, 0.085)), lf, 0))
        bv, bf = blob(0.25, 0.04, 0.05, 0.6)
        parts.append((fr.world(bv + V(0, 0.1, 0.09)), bf, 1))
        tv, tf = blob(0.025, 0.025, 0.42, 0.8)
        parts.append((tv + V(0.405 * s, 2.82, 0.17), tf, 1))
    fr = face_frame(V(0, 0.02, 1), sink=0.0, front=3)
    bv, bf = blob(0.1, 0.025, 0.03, 0.6)
    parts.append((fr.world(bv + V(0, 0.06, 0.07)), bf, 1))
    return merge(parts)


# ───────────────────────── build ─────────────────────────

def main():
    global COLL
    bpy.ops.wm.read_factory_settings(use_empty=True)
    COLL = bpy.context.scene.collection

    for args in [
        ('Skin', 0xf0b48e, 0.62), ('HeadSkin', 0xf0b48e, 0.58), ('FaceSkin', 0xf0b48e, 0.58),
        ('Shirt', 0xf2efe8, 0.8), ('Sleeve', 0xf2efe8, 0.8), ('Shorts', 0x2e3d5c, 0.8),
        ('Pants', 0x2e3d5c, 0.85), ('Sock', 0xffffff, 0.85), ('Belt', 0xdad8d2, 0.6),
        ('Boots', 0x25262b, 0.72), ('Sole', 0x18181b, 0.7), ('Gloves', 0x2a2c31, 0.65),
        ('Brow', 0x2a1d17, 0.9), ('EyeWhite', 0xffffff, 0.3), ('Pupil', 0x1b1714, 0.2),
        ('Mouth', 0x6b2e24, 0.9), ('MouthIn', 0x4a1c18, 0.9), ('Teeth', 0xffffff, 0.4),
        ('Helmet', 0x56653a, 0.85), ('Hood', 0x3a4357, 0.92), ('Headband', 0xffffff, 0.85),
        ('HeadbandStripe', 0xd8323a, 0.85), ('Vest', 0x1d2026, 0.9), ('Pouch', 0x2a2e35, 0.9),
        ('String', 0xe8e8e8, 0.8),
    ]:
        material(*args)
    material('Lens', 0x14161c, 0.15, 0.4)
    material('Frame', 0xf2b632, 0.35, 0.5)
    MATS['Hood'].use_backface_culling = False

    define_bones()
    rig = build_armature()

    X = 1.05
    objs = {}

    def make(name, fn, lo, hi, voxel, tris, mats, rigid=None, uv=None, weights=None):
        ob = sdf_object(name, fn, lo, hi, voxel, tris)
        set_material(ob, *mats)
        if uv:
            set_uv(ob, uv)
        smooth(ob)
        exact_normals(ob, fn)
        skin(ob, rig, rigid, weights)
        objs[name] = ob
        print(f'  {name:16s} {len(ob.data.polygons):6d} tris')
        return ob

    print('Meshing…')
    make('Body', body_skin, (-X, 0.3, -0.36), (X, 2.48, 0.36), 0.02, 14000, ['Skin'])
    make('ShirtTank', shirt_tank, (-0.5, 1.36, -0.34), (0.5, 2.36, 0.34), 0.016, 5500, ['Shirt'], uv=uv_body(1.38, 2.32))
    make('ShirtCrew', shirt_crew, (-0.5, 1.36, -0.34), (0.5, 2.3, 0.34), 0.016, 5500, ['Shirt'], uv=uv_body(1.38, 2.32))
    make('SleeveShort', lambda P: sleeve(P, 0.21), (-0.9, 1.7, -0.25), (0.9, 2.3, 0.25), 0.014, 3200, ['Sleeve'], uv=uv_arms)
    make('SleeveLong', lambda P: sleeve(P, 0.55), (-1.05, 1.3, -0.25), (1.05, 2.3, 0.25), 0.015, 5500, ['Sleeve'], uv=uv_arms)
    make('Shorts', lambda P: legwear(P, 0.86), (-0.48, 0.8, -0.34), (0.48, 1.5, 0.34), 0.016, 4800, ['Shorts'], uv=uv_legwear)
    make('Pants', lambda P: legwear(P, 0.5, off=0.04, shins=True), (-0.48, 0.45, -0.34), (0.48, 1.5, 0.34), 0.016, 6000, ['Pants'], uv=uv_legwear)
    make('Socks', socks, (-0.42, 0.48, -0.22), (0.42, 0.74, 0.22), 0.012, 1600, ['Sock'])
    make('Belt', belt, (-0.46, 1.34, -0.34), (0.46, 1.5, 0.34), 0.012, 2200, ['Belt'])
    make('Boots', boots, (-0.45, 0.05, -0.25), (0.45, 0.65, 0.45), 0.014, 4400, ['Boots'], weights=boot_weights)
    make('Soles', soles, (-0.45, -0.02, -0.25), (0.45, 0.12, 0.42), 0.012, 1400, ['Sole'], rigid=by_side('an'))
    make('BootCuffs', boot_cuffs, (-0.45, 0.55, -0.24), (0.45, 0.66, 0.24), 0.01, 1400, ['Sole'], weights=boot_weights)
    make('Gloves', gloves, (-1.05, 1.05, -0.2), (1.05, 1.65, 0.25), 0.012, 3200, ['Gloves'], rigid=by_side('hand'))
    make('Fingers', fingers, (-1.1, 0.95, -0.15), (1.1, 1.5, 0.28), 0.011, 2200, ['Skin'], rigid=by_side('hand'))

    # Head, and the eye opening the masked skin leaves uncovered: a thin
    # patch of the skull, raised a hair, cut to a soft-edged oval.
    head = sdf_object('Head', head_full, (-0.56, 2.2, -0.52), (0.56, 3.32, 0.52), 0.014, 14000)
    set_material(head, 'HeadSkin')
    smooth(head)
    exact_normals(head, head_full)
    skin(head, rig, 'head')
    print(f'  Head             {len(head.data.polygons):6d} tris')
    make('MaskBand', mask_band, (-0.42, 2.66, 0.0), (0.42, 3.02, 0.52), 0.007, 2400, ['FaceSkin'], rigid='head')

    def face_part(name, v, f, mats, mi=None, keys=None):
        ob = new_object(name, v, f)
        orient(ob)
        set_material(ob, *mats, index=mi)
        smooth(ob)
        if keys:
            add_shape_keys(ob, keys)
        skin(ob, rig, 'head')
        return ob

    v, f, mi, keys = build_eyes()
    face_part('Eyes', v, f, ['EyeWhite', 'Pupil'], mi, keys)
    v, f, keys = build_brows()
    face_part('Brows', v, f, ['Brow'], keys=keys)
    mouth = build_mouth()
    v, f, keys = mouth['smirk']
    face_part('MouthSmirk', v, f, ['Mouth'], keys=keys)
    v, f, mi = mouth['grin']
    face_part('MouthGrin', v, f, ['MouthIn', 'Teeth'], mi)
    v, f = mouth['oh']
    face_part('MouthOh', v, f, ['MouthIn'])

    print('Accessories…')
    make('Helmet', helmet, (-0.62, 2.85, -0.62), (0.62, 3.42, 0.66), 0.014, 3200, ['Helmet'], rigid='head')
    make('Hood', hood, (-0.62, 2.2, -0.62), (0.62, 3.42, 0.6), 0.012, 5500, ['Hood'], rigid='head')
    make('Headband', headband, (-0.54, 2.85, -0.54), (0.54, 3.12, 0.54), 0.01, 2000, ['Headband'], rigid='head')
    make('HeadbandStripe', headband_stripe, (-0.55, 2.9, -0.55), (0.55, 3.08, 0.55), 0.008, 1400, ['HeadbandStripe'], rigid='head')
    make('Vest', vest, (-0.56, 1.42, -0.4), (0.56, 2.25, 0.42), 0.016, 4000, ['Vest'])
    make('VestPouches', vest_pouches, (-0.3, 1.55, 0.26), (0.3, 1.77, 0.4), 0.008, 900, ['Pouch'])
    make('Drawstrings', drawstrings, (-0.12, 1.95, 0.28), (0.12, 2.23, 0.35), 0.005, 300, ['String'])
    v, f, mi = build_sunglasses()
    face_part('Sunglasses', v, f, ['Lens', 'Frame'], mi)

    total = sum(len(o.data.polygons) for o in bpy.data.objects if o.type == 'MESH')
    print(f'Total {total} triangles across all layers')

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=OUT, export_format='GLB', export_yup=True, use_visible=False,
        export_skins=True, export_morph=True, export_morph_normal=False,
        export_animations=False, export_materials='EXPORT', export_texcoords=True,
        export_normals=True, export_tangents=False, export_apply=False,
    )
    print('Wrote', OUT, os.path.getsize(OUT) // 1024, 'KB')
    quantize(OUT)


def quantize(path):
    """Store positions, normals and weights as small integers
    (KHR_mesh_quantization): about a third smaller, read natively by
    Three.js with no decoder, so it works under the site's strict CSP.
    Needs Node; skipped with a note if npx isn't available."""
    npx = shutil.which('npx')
    if not npx:
        print('npx not found: leaving the model unquantized')
        return
    tmp = path + '.tmp.glb'
    subprocess.run([npx, '--yes', '@gltf-transform/cli@4', 'quantize', path, tmp], check=True)
    os.replace(tmp, path)
    print('Quantized', path, os.path.getsize(path) // 1024, 'KB')


if __name__ == '__main__':
    main()
