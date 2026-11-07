# The scroll room in Blender (7 Nov 2026): a real 3D set for the same 15 s pilot (lib4-lib6).
# Built from the location bible (story/Scrolls_location_room.md): very small vaulted room, racks to head height round
# the walls, a freestanding case in the middle, rolls with title tags, a capsa, a lampstand, a mosaic floor.
# Rendered with Workbench (flat colours + outlines + cavity + soft shadow) so it reads as flat vector art.
# usage: bpyenv/bin/python room.py <out_dir> [still_frame|all] [res_x]
import bpy, bmesh, math, json, sys, os, random
from mathutils import Vector, Euler
from bpy_extras.object_utils import world_to_camera_view

OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/room'
MODE = sys.argv[2] if len(sys.argv) > 2 else 'stills'
RX = int(sys.argv[3]) if len(sys.argv) > 3 else 1280
os.makedirs(OUT, exist_ok=True)
random.seed(7)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

def hexc(h, a=1.0):
    h = h.lstrip('#'); lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return tuple(lin(int(h[i:i + 2], 16) / 255) for i in (0, 2, 4)) + (a,)
MATS = {}
def mat(name, col):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.diffuse_color = hexc(col); MATS[name] = m; return m
def obj_from_bm(name, bm, m):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); sc.collection.objects.link(o)
    if isinstance(m, list):
        for mm in m: o.data.materials.append(mm)
    else: o.data.materials.append(m)
    return o
def box(name, c, s, m, rot=(0, 0, 0)):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * s[0], v.co.y * s[1], v.co.z * s[2]))
    o = obj_from_bm(name, bm, m); o.location = c; o.rotation_euler = rot; return o
def cyl(name, c, r, h, m, rot=(0, 0, 0), seg=20, r2=None):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=h)
    o = obj_from_bm(name, bm, m); o.location = c; o.rotation_euler = rot; return o

# ---------------- palette (night, matches the Recraft pilot) ----------------
C = dict(plaster='#7a6d74', dado='#8e2b2a', vault='#2f5560', vault2='#244650', wood='#7b4b32', wood_d='#5a3423', hole='#2a1a16',
         roll='#efd8b0', roll_end='#e2c99a', roll_core='#8a6a4a', tag='#b8322b', tag2='#c99a3e', bronze='#8a6a3a', flame='#ffcf6a',
         floor_w='#bdbbb2', floor_b='#1c1f26', border='#7b2f2a', arch='#1f2a32', sheet='#efdcb6', ink='#3a2a22', stool='#6e4430', capsa='#6b3a26')

W, D, HS = 3.6, 4.2, 2.35  # width, depth, wall height up to the vault spring
R = W / 2

# floor: mosaic of black and white squares with a red border band
bm = bmesh.new(); t = 0.24; nx, ny = int(W / t), int(D / t)
for i in range(nx):
    for j in range(ny):
        x0, y0 = -R + i * t, j * t
        border = i == 0 or j == 0 or i == nx - 1 or j == ny - 1
        f = bm.faces.new([bm.verts.new((x0, y0, 0)), bm.verts.new((x0 + t, y0, 0)), bm.verts.new((x0 + t, y0 + t, 0)), bm.verts.new((x0, y0 + t, 0))])
        f.material_index = 2 if border else ((i + j) % 2)
obj_from_bm('floor', bm, [mat('floor_w', C['floor_w']), mat('floor_b', C['floor_b']), mat('border', C['border'])])

# walls: back wall (plaster above a red dado), side walls
box('back', (0, D + 0.05, HS / 2 + 1.0), (W, 0.1, HS + 2.0), mat('plaster', C['plaster']))
box('back_dado', (0, D - 0.005, 0.55), (W, 0.02, 1.1), mat('dado', C['dado']))
box('back_line', (0, D - 0.012, 1.12), (W, 0.02, 0.04), mat('wood_d', C['wood_d']))
for s in (-1, 1):
    box(f'side{s}', (s * (R + 0.05), D / 2, HS / 2), (0.1, D, HS), mat('plaster', C['plaster']))
# barrel vault: half cylinder along y, coloured in bands
bm = bmesh.new(); N = 24
for k in range(N):
    a0, a1 = math.pi * k / N, math.pi * (k + 1) / N
    for j in range(6):
        y0, y1 = j * D / 6, (j + 1) * D / 6
        v = [bm.verts.new((R * math.cos(a0), y0, HS + R * math.sin(a0))), bm.verts.new((R * math.cos(a1), y0, HS + R * math.sin(a1))),
             bm.verts.new((R * math.cos(a1), y1, HS + R * math.sin(a1))), bm.verts.new((R * math.cos(a0), y1, HS + R * math.sin(a0)))]
        f = bm.faces.new(v); f.material_index = j % 2
obj_from_bm('vault', bm, [mat('vault', C['vault']), mat('vault2', C['vault2'])])
# back lunette under the vault
bm = bmesh.new(); ring = [bm.verts.new((R * math.cos(math.pi * k / N), D, HS + R * math.sin(math.pi * k / N))) for k in range(N + 1)]
bm.faces.new(ring)
obj_from_bm('lunette', bm, mat('plaster', C['plaster']))

# front wall with an arched doorway (the camera walks in through it)
wall = box('front', (0, -0.15, (HS + R) / 2), (W + 0.4, 0.3, HS + R + 0.2), mat('arch', C['arch']))
cut1 = box('cut1', (0, -0.15, 1.0), (1.5, 0.6, 2.0), mat('arch', C['arch']))
cut2 = cyl('cut2', (0, -0.15, 2.0), 0.75, 0.6, mat('arch', C['arch']), rot=(math.pi / 2, 0, 0), seg=40)
for cut in (cut1, cut2):
    mod = wall.modifiers.new('b', 'BOOLEAN'); mod.operation = 'DIFFERENCE'; mod.object = cut
    bpy.context.view_layer.objects.active = wall; bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(cut)

# ---------------- racks of pigeonholes along both side walls ----------------
CELL, RD, RH, Y0, Y1 = 0.34, 0.36, 2.04, 0.25, D - 0.25
tags = []
def rack(side):
    x_wall = side * R; x_front = side * (R - RD)
    ncol = int((Y1 - Y0) / CELL); nrow = int(RH / CELL)
    wood, wd = mat('wood', C['wood']), mat('wood_d', C['wood_d'])
    box(f'rack_back{side}', (side * (R - 0.02), (Y0 + Y1) / 2, RH / 2), (0.04, ncol * CELL, RH), mat('hole', C['hole']))
    for i in range(ncol + 1):  # verticals
        box(f'rv{side}{i}', ((x_wall + x_front) / 2, Y0 + i * CELL, RH / 2), (RD, 0.03, RH), wood)
    for j in range(nrow + 1):  # shelves
        box(f'rh{side}{j}', ((x_wall + x_front) / 2, (Y0 + Y1) / 2, j * CELL + 0.015), (RD, ncol * CELL, 0.03), wood)
    box(f'rtop{side}', ((x_wall + x_front) / 2, (Y0 + Y1) / 2, RH + 0.05), (RD + 0.06, ncol * CELL + 0.06, 0.06), wd)
    for i in range(ncol):
        for j in range(nrow):
            yc, zc = Y0 + (i + 0.5) * CELL, j * CELL + 0.03
            n = random.choice([2, 3, 3, 4])
            spots = [(-0.08, 0.075), (0.08, 0.075), (0.0, 0.205), (-0.08, 0.205)][:n]
            for k, (dy, dz) in enumerate(spots):
                r = random.uniform(0.055, 0.072); L = RD - 0.04
                xc = side * (R - L / 2 - 0.02) + random.uniform(-0.03, 0.03) * side
                cyl(f'roll{side}{i}{j}{k}', (xc, yc + dy, zc + dz - 0.075 + r), r, L, mat('roll', C['roll']), rot=(0, math.pi / 2, 0), seg=16)
                cyl(f'core{side}{i}{j}{k}', (xc - side * (L / 2 + 0.002), yc + dy, zc + dz - 0.075 + r), r * 0.32, 0.01, mat('roll_core', C['roll_core']), rot=(0, math.pi / 2, 0), seg=12)
                if random.random() < 0.12:  # a title tag hanging from the end of the roll
                    tx = side * (R - RD - 0.005)
                    box(f'tag{side}{i}{j}{k}', (tx, yc + dy + 0.02, zc + dz - 0.075 - 0.02), (0.005, 0.05, 0.07), mat('tag' if random.random() < 0.6 else 'tag2', C['tag'] if random.random() < 0.6 else C['tag2']))
                    tags.append((tx, yc + dy, zc + dz))
for s in (-1, 1): rack(s)

# ---------------- the central case, freestanding, rolls in pigeonholes on the front ----------------
CX, CY, CW, CDP, CH = 0.0, 3.05, 1.25, 0.55, 0.92
wood, wd = mat('wood', C['wood']), mat('wood_d', C['wood_d'])
box('case_back', (CX, CY + CDP / 2 - 0.02, CH / 2), (CW, 0.04, CH), mat('hole', C['hole']))
for s in (-1, 1): box(f'case_side{s}', (CX + s * CW / 2, CY, CH / 2), (0.04, CDP, CH), wood)
for j in range(3): box(f'case_sh{j}', (CX, CY, 0.06 + j * (CH - 0.12) / 2), (CW, CDP, 0.035), wood)
for i in range(1, 4): box(f'case_v{i}', (CX - CW / 2 + i * CW / 4, CY, CH / 2), (0.03, CDP, CH - 0.1), wood)
box('case_top', (CX, CY, CH + 0.02), (CW + 0.1, CDP + 0.08, 0.05), wd)
box('case_plinth', (CX, CY, 0.03), (CW + 0.06, CDP + 0.06, 0.06), wd)
for i in range(4):
    for j in range(2):
        xc, zb = CX - CW / 2 + (i + 0.5) * CW / 4, 0.08 + j * (CH - 0.12) / 2
        for k in range(random.choice([2, 3])):
            r = 0.06; cyl(f'croll{i}{j}{k}', (xc + (k - 1) * 0.1, CY - 0.02, zb + r + (0.13 if k == 2 else 0)), r, CDP - 0.08, mat('roll', C['roll']), rot=(math.pi / 2, 0, 0), seg=16)
            cyl(f'ccore{i}{j}{k}', (xc + (k - 1) * 0.1, CY - CDP / 2 + 0.035, zb + r + (0.13 if k == 2 else 0)), r * 0.32, 0.01, mat('roll_core', C['roll_core']), rot=(math.pi / 2, 0, 0), seg=12)
# the reading stand on the case, with an open scroll between two rollers
ST = Vector((CX - 0.1, CY - 0.05, CH + 0.05)); tilt = math.radians(28)
for s in (-1, 1):
    box(f'post{s}', (ST.x + s * 0.36, ST.y + 0.08, ST.z + 0.33), (0.035, 0.035, 0.68), wd, rot=(-tilt, 0, 0))
up = Vector((0, math.sin(tilt), math.cos(tilt)))
for k, h in enumerate((0.12, 0.58)):
    p = ST + Vector((0, 0.02, 0)) + up * h
    cyl(f'roller{k}', p, 0.03, 0.82, wood, rot=(0, math.pi / 2, 0), seg=16)
    for s in (-1, 1): cyl(f'knob{k}{s}', p + Vector((s * 0.43, 0, 0)), 0.04, 0.04, wd, rot=(0, math.pi / 2, 0), seg=16)
sheet_c = ST + Vector((0, 0.0, 0)) + up * 0.35
box('sheet', sheet_c, (0.72, 0.006, 0.46), mat('sheet', C['sheet']), rot=(-tilt, 0, 0))
ink = mat('ink', C['ink'])
for c in range(3):
    for l in range(9):
        w = random.uniform(0.13, 0.19)
        p = sheet_c + Vector((-0.24 + c * 0.24 + (w - 0.19) / 2, 0, 0)) + up * (0.19 - l * 0.045) - Vector((0, math.cos(tilt), -math.sin(tilt))) * 0.006
        box(f'ink{c}{l}', p, (w, 0.004, 0.012), ink, rot=(-tilt, 0, 0))

# ---------------- the lampstand (tripod, shaft, bronze oil lamp, flame) ----------------
LX, LY = 0.95, 3.35
br = mat('bronze', C['bronze'])
for k in range(3):
    a = k * 2 * math.pi / 3
    box(f'leg{k}', (LX + 0.12 * math.cos(a), LY + 0.12 * math.sin(a), 0.12), (0.03, 0.03, 0.26), br, rot=(0.6 * math.sin(a), -0.6 * math.cos(a), 0))
    cyl(f'foot{k}', (LX + 0.2 * math.cos(a), LY + 0.2 * math.sin(a), 0.03), 0.035, 0.06, br)
cyl('shaft', (LX, LY, 0.8), 0.018, 1.25, br)
cyl('plate', (LX, LY, 1.43), 0.12, 0.02, br)
lamp = cyl('lamp', (LX, LY, 1.49), 0.09, 0.08, br, r2=0.05); lamp.scale = (1.0, 0.65, 1.0)
box('nozzle', (LX - 0.12, LY, 1.5), (0.1, 0.04, 0.035), br)
flame = cyl('flame', (LX - 0.16, LY, 1.58), 0.025, 0.11, mat('flame', C['flame']), r2=0.002, seg=12)
LAMP_PT = Vector((LX - 0.16, LY, 1.6))

# ---------------- stool and a capsa (round scroll box) ----------------
stw = mat('stool', C['stool'])
cyl('stool_top', (-0.75, 2.35, 0.47), 0.2, 0.05, stw)
for k in range(3):
    a = k * 2 * math.pi / 3 + 0.3
    box(f'sleg{k}', (-0.75 + 0.12 * math.cos(a), 2.35 + 0.12 * math.sin(a), 0.23), (0.035, 0.035, 0.47), stw, rot=(0.15 * math.sin(a), -0.15 * math.cos(a), 0))
cyl('capsa', (-1.0, 1.25, 0.22), 0.16, 0.44, mat('capsa', C['capsa']))
cyl('capsa_rim', (-1.0, 1.25, 0.44), 0.165, 0.03, mat('wood_d', C['wood_d']))
for k, (dx, dy) in enumerate([(-0.05, 0.03), (0.05, -0.02), (0.0, 0.06)]):
    cyl(f'cap_roll{k}', (-1.0 + dx, 1.25 + dy, 0.5), 0.045, 0.22, mat('roll', C['roll']), rot=(random.uniform(-0.2, 0.2), random.uniform(-0.2, 0.2), 0), seg=14)

# ---------------- render settings: flat Workbench look ----------------
sc.render.engine = 'BLENDER_WORKBENCH'
sh = sc.display.shading
sh.light = os.environ.get('LIGHT', 'FLAT'); sh.color_type = 'MATERIAL'
sh.show_cavity = True; sh.cavity_type = 'BOTH'; sh.cavity_ridge_factor = 0.6; sh.cavity_valley_factor = 1.2
sh.show_object_outline = True; sh.object_outline_color = (0.05, 0.04, 0.04)
sh.show_shadows = True; sh.shadow_intensity = 0.45
sc.display.light_direction = (-0.35, 0.45, 0.82); sc.display.shadow_shift = 0.05; sc.display.shadow_focus = 0.3
sc.view_settings.view_transform = 'Standard'
sc.render.resolution_x = RX; sc.render.resolution_y = RX * 9 // 16
sc.render.film_transparent = False
sc.world = bpy.data.worlds.new('w'); sc.world.color = hexc('#0b0f16')[:3]
try: sc.display.render_aa = '8'
except Exception: pass

# ---------------- camera move (clip seconds, 30 fps) ----------------
FPS = 30; sc.render.fps = FPS; sc.frame_start = 0; sc.frame_end = 458
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.data.lens = 24; cam.data.sensor_width = 36
tgt = bpy.data.objects.new('tgt', None); sc.collection.objects.link(tgt)
con = cam.constraints.new('TRACK_TO'); con.target = tgt; con.track_axis = 'TRACK_NEGATIVE_Z'; con.up_axis = 'UP_Y'
T0 = 70.9
L4a, L5a, L6a = 71.34 - T0, 77.157 - T0, 81.048 - T0
def wt(a, b, text, word, k=0):
    import re
    hits = [m.start() for m in re.finditer(r"[A-Za-z']+", text) if text[m.start():m.end()].lower() == word]
    return a + hits[k] / len(text) * (b - a)
L4 = 'Walk inside, and you find a small room lined with shelves. And on the shelves, books.'
L5 = 'Back then, books were scrolls, made of papyrus, not pages.'
L6 = 'Papyrus is a kind of paper made from a reed that grows along the river Nile.'
t_scr = wt(L5a, 80.648 - T0, L5, 'scrolls'); t_pap = wt(L5a, 80.648 - T0, L5, 'papyrus')
READER = Vector((-0.55, 2.55, 0.0)); WALK_END = Vector((0.92, 2.2, 0.0))
keys = [  # (t, cam location, target)
    (0.0, (0, -2.4, 1.55), (0, 3.0, 1.25)),
    (5.2, (0, 0.55, 1.45), (0, 3.2, 1.05)),
    (t_scr - 0.4, (0.05, 0.75, 1.45), (0, 3.2, 1.05)),
    (t_scr + 0.7, (0.35, 1.15, 1.35), (READER.x, READER.y, 1.05)),
    (t_pap - 0.1, (0.35, 1.2, 1.35), (READER.x + 0.05, READER.y, 1.05)),
    (t_pap + 1.2, (sheet_c.x, sheet_c.y - 0.95, sheet_c.z + 0.12), tuple(sheet_c)),
    (15.3, (sheet_c.x, sheet_c.y - 0.86, sheet_c.z + 0.1), tuple(sheet_c)),
]
def ease(u): return u * u * (3 - 2 * u)
def at(t):
    for (ta, ca, ga), (tb, cb, gb) in zip(keys, keys[1:]):
        if t <= tb:
            u = ease(max(0, min(1, (t - ta) / (tb - ta))))
            return Vector(ca).lerp(Vector(cb), u), Vector(ga).lerp(Vector(gb), u)
    return Vector(keys[-1][1]), Vector(keys[-1][2])
for f in range(sc.frame_start, sc.frame_end + 1):
    c, g = at(f / FPS); cam.location = c; tgt.location = g
    cam.keyframe_insert('location', frame=f); tgt.keyframe_insert('location', frame=f)

# ---------------- per-frame screen positions for the overlays (lamp, characters, tags) ----------------
def walker_at(t):
    u = ease(max(0, min(1, (t - 0.6) / 4.8)))
    return Vector((0.25, 0.15, 0)).lerp(WALK_END, u), u
proj = []
for f in range(sc.frame_start, sc.frame_end + 1):
    sc.frame_set(f); t = f / FPS
    def P(v):
        p = world_to_camera_view(sc, cam, Vector(v)); return [round(p.x, 5), round(1 - p.y, 5), round(p.z, 4)]
    wpos, wu = walker_at(t)
    proj.append({'lamp': P(LAMP_PT), 'reader_feet': P(READER), 'reader_head': P(READER + Vector((0, 0, 1.68))),
                 'walker_feet': P(wpos), 'walker_head': P(wpos + Vector((0, 0, 1.62))), 'walk_u': round(wu, 4),
                 'sheet': P(sheet_c), 'rackL': P((-R + RD, 2.0, 1.2)), 'rackR': P((R - RD, 2.0, 1.2))})
json.dump({'fps': FPS, 'frames': proj, 'tags_n': len(tags)}, open(os.path.join(OUT, 'proj.json'), 'w'))

if MODE == 'stills':
    for f in (0, 60, 150, 230, 300, 380, 440):
        sc.frame_set(f); sc.render.filepath = os.path.join(OUT, f'still_{f:03d}.png'); bpy.ops.render.render(write_still=True)
elif MODE == 'proj':
    pass
elif MODE == 'all':
    sc.render.filepath = os.path.join(OUT, 'f_'); sc.render.image_settings.file_format = 'PNG'
    bpy.ops.render.render(animation=True)
else:
    f = int(MODE); sc.frame_set(f); sc.render.filepath = os.path.join(OUT, f'still_{f:03d}.png'); bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'room.blend'))
print('done', len(sc.objects), 'objects')
