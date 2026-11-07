# The Nile bank at dusk in Blender (flat Workbench look), for the "reed ... Nile" beat of the scroll-room pilot.
# usage: bpyenv/bin/python nile.py <out_dir> [stills|all] [res_x]
import bpy, bmesh, math, sys, os, random
from mathutils import Vector

OUT = sys.argv[1]; MODE = sys.argv[2] if len(sys.argv) > 2 else 'stills'; RX = int(sys.argv[3]) if len(sys.argv) > 3 else 1280
os.makedirs(OUT, exist_ok=True); random.seed(11)
bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene

def hexc(h):
    h = h.lstrip('#'); lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return tuple(lin(int(h[i:i + 2], 16) / 255) for i in (0, 2, 4)) + (1.0,)
MATS = {}
def mat(col):
    if col in MATS: return MATS[col]
    m = bpy.data.materials.new(col); m.diffuse_color = hexc(col); MATS[col] = m; return m
def link(name, bm, col):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); sc.collection.objects.link(o); o.data.materials.append(mat(col)); return o
def poly(name, pts, col, y):  # a flat shape in the x-z plane at depth y
    bm = bmesh.new(); bm.faces.new([bm.verts.new((x, y, z)) for x, z in pts]); return link(name, bm, col)
def cyl(name, c, r, h, col, rot=(0, 0, 0), seg=10, r2=None):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=h)
    o = link(name, bm, col); o.location = c; o.rotation_euler = rot; return o

# sky in bands (flat), sun, hills, far bank with houses and palms
bands = ['#3d3b52', '#4f4660', '#655067', '#7d5a68', '#97666a']
for i, c in enumerate(bands):
    poly(f'sky{i}', [(-200, 2 + i * -0.0 + (4 - i) * 9), (200, (4 - i) * 9 + 2), (200, (5 - i) * 9 + 2), (-200, (5 - i) * 9 + 2)], c, 120 + i * 0.01)
poly('skylow', [(-200, -5), (200, -5), (200, 11), (-200, 11)], '#a9726a', 121)
bm = bmesh.new(); N = 40; ring = [bm.verts.new((-8 + 5 * math.cos(2 * math.pi * k / N), 110, 4.5 + 5 * math.sin(2 * math.pi * k / N))) for k in range(N)]; bm.faces.new(ring); link('sun', bm, '#f6bd62')
hill = [(-120, 0)] + [(x, 3.5 + 2.2 * math.sin(x * 0.07) + 1.2 * math.sin(x * 0.19 + 1)) for x in range(-120, 121, 6)] + [(120, 0)]
poly('hills', hill, '#c49a8c', 100)
poly('farbank', [(-120, -0.5), (120, -0.5), (120, 1.3), (-120, 1.3)], '#b9877a', 90)
for k in range(9):  # mud-brick houses
    x = 8 + k * 4.2 + random.uniform(-1, 1); w = random.uniform(2.2, 3.8); h = random.uniform(1.6, 3.2)
    poly(f'house{k}', [(x, 1.2), (x + w, 1.2), (x + w, 1.2 + h), (x, 1.2 + h)], '#a77a6a' if k % 2 else '#b88a78', 89.5)
    poly(f'door{k}', [(x + w * 0.4, 1.2), (x + w * 0.55, 1.2), (x + w * 0.55, 1.9), (x + w * 0.4, 1.9)], '#5a3a32', 89.4)
def palm(name, x, y, h):
    cyl(name + 't', (x, y, h / 2), 0.18, h, '#5e4a3a', rot=(0, 0.05, 0), seg=8)
    for k in range(9):
        a = -math.pi * 0.95 + k * math.pi * 0.95 / 8 * 2
        bm = bmesh.new(); L = 3.0
        pts = [(0, 0), (L * 0.5, 0.35), (L, -0.6), (L * 0.5, -0.05)]
        bm.faces.new([bm.verts.new((x + px * math.cos(a) * 0.8, y, h + px * math.sin(a) * 0.35 + pz)) for px, pz in pts]); link(name + f'l{k}', bm, '#3e4d3a')
for k, x in enumerate([12, 15, 30, 38, 44]): palm(f'palm{k}', x, 85, random.uniform(5, 7))
# water and the near bank
poly('water', [(-150, -40), (150, -40), (150, -0.5), (-150, -0.5)], '#0f5a5a', 60)
bm = bmesh.new(); bm.faces.new([bm.verts.new(v) for v in [(-60, -6, 0), (60, -6, 0), (60, 60, 0), (-60, 60, 0)]]); link('waterplane', bm, '#0f5a5a')
bm = bmesh.new(); bm.faces.new([bm.verts.new(v) for v in [(-60, -20, 0.05), (1, -20, 0.05), (4, -9, 0.05), (2.5, -2, 0.05), (-1, 6, 0.05), (-6, 14, 0.05), (-60, 22, 0.05)]]); link('sand', bm, '#e8cfb4')
for k in range(6):  # sun glints on the water
    w = 6.5 - k * 0.8; bm = bmesh.new(); z = 0.06; yy = 70 - k * 9
    bm.faces.new([bm.verts.new(v) for v in [(-8 - w, yy, z), (-8 + w, yy, z), (-8 + w, yy + 0.8, z), (-8 - w, yy + 0.8, z)]]); link(f'glint{k}', bm, '#f6bd62')
# a papyrus boat pulled up on the sand
bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=8, radius=1.0)
for v in bm.verts: v.co = Vector((v.co.x * 2.4, v.co.y * 0.6, abs(v.co.z) * -0.35 + 0.35 + 0.18 * v.co.x ** 2))
boat = link('boat', bm, '#a8875a'); boat.location = (3.2, -4.0, 0.05); boat.rotation_euler = (0, 0, 0.35)
# papyrus reeds: smooth stems, umbrella heads of thin rays
reeds = []
def reed(name, x, y, h, lean):
    stem = cyl(name + 's', (x, y, h / 2), 0.05, h, '#9aa983', seg=6, r2=0.035); stem.rotation_euler = (0, lean, 0)
    head = bpy.data.objects.new(name + 'h', None); sc.collection.objects.link(head); head.parent = stem; head.location = (0, 0, h / 2)
    for k in range(22):
        a = 2 * math.pi * k / 22; b = math.radians(random.uniform(25, 70))
        r = cyl(name + f'r{k}', (0, 0, 0), 0.012, 1.0, '#2a3a2e', seg=4)
        r.parent = head; d = Vector((math.cos(a) * math.sin(b), math.sin(a) * math.sin(b) * 0.5, math.cos(b)))
        r.location = d * 0.5; r.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    reeds.append((stem, head, lean))
for k in range(48):
    x = random.uniform(-16, 1.5); y = random.uniform(-9, 8); h = random.uniform(4.0, 7.5)
    reed(f'reed{k}', x, y, h, random.uniform(-0.12, 0.18))

sc.render.engine = 'BLENDER_WORKBENCH'; sh = sc.display.shading
sh.light = 'FLAT'; sh.color_type = 'MATERIAL'; sh.show_cavity = False; sh.show_object_outline = True; sh.object_outline_color = (0.06, 0.05, 0.05)
sc.view_settings.view_transform = 'Standard'; sc.render.resolution_x = RX; sc.render.resolution_y = RX * 9 // 16
sc.world = bpy.data.worlds.new('w'); sc.world.color = hexc('#3d3b52')[:3]
FPS = 30; sc.render.fps = FPS; sc.frame_start = 0; sc.frame_end = 105
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam; cam.data.lens = 28
for f in range(0, 106):
    u = f / 105
    cam.location = (-1 + 1.6 * u, -19 + 1.0 * u, 2.4); cam.rotation_euler = (math.radians(90), 0, math.radians(-6 + 2 * u)); cam.keyframe_insert('location', frame=f); cam.keyframe_insert('rotation_euler', frame=f)
    for k, (stem, head, lean) in enumerate(reeds):
        sw = 0.025 * math.sin(f / FPS * 1.4 + k)
        stem.rotation_euler = (0, lean + sw, 0); stem.keyframe_insert('rotation_euler', frame=f)
if MODE == 'stills':
    for f in (0, 100):
        sc.frame_set(f); sc.render.filepath = os.path.join(OUT, f'nile_{f:03d}.png'); bpy.ops.render.render(write_still=True)
else:
    sc.render.filepath = os.path.join(OUT, 'n_'); bpy.ops.render.render(animation=True)
print('done')
