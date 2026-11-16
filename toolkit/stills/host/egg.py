"""Monocle Egg, rough 3D host (Mild Astonishment). Run: bpyenv python egg.py [still|anim] OUT
Builds the egg, waistcoat, eyes, monocle, eyebrow, mouth; mouth keyed from Rhubarb cues (mouth.json)."""
import bpy, bmesh, math, json, sys, os
from mathutils import Vector

MODE = sys.argv[1] if len(sys.argv) > 1 else 'still'
OUT = sys.argv[2] if len(sys.argv) > 2 else '/home/claude/host3d/still.png'
ENGINE = os.environ.get('ENGINE', 'CYCLES')
FPS = 24
HERE = os.path.dirname(os.path.abspath(__file__))

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

def hexc(h, a=1.0):
    h = h.lstrip('#'); r, g, b = (int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
    lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (lin(r), lin(g), lin(b), a)

def mat(name, col, rough=0.6, metal=0.0, emit=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = hexc(col)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Metallic'].default_value = metal
    if emit:
        p.inputs['Emission Color'].default_value = hexc(col); p.inputs['Emission Strength'].default_value = emit
    return m

M_SHELL = mat('shell', '#EFE6CF', 0.55)
M_VEST = mat('vest', '#8E2414', 0.7)
M_INK = mat('ink', '#19181E', 0.5)
M_WHITE = mat('white', '#FBF8F0', 0.3)
M_GOLD = mat('gold', '#C9A04A', 0.25, 1.0)
M_MOUTH = mat('mouth', '#3A1410', 0.6)
M_GLASS = mat('glass', '#FFFFFF', 0.05)
M_GLASS.node_tree.nodes['Principled BSDF'].inputs['Transmission Weight'].default_value = 1.0
M_GLASS.node_tree.nodes['Principled BSDF'].inputs['Alpha'].default_value = 0.25
M_GLASS.blend_method = 'BLEND' if hasattr(M_GLASS, 'blend_method') else None

def egg_mesh(name, s=1.0, cut=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=1.0)
    o = bpy.context.object; o.name = name
    for v in o.data.vertices:
        x, y, z = v.co
        z *= 1.3
        k = 1.0 - 0.13 * (z / 1.3)          # narrower at the top: an egg
        v.co = Vector((x * k * s, y * k * s, z * s))
    if cut is not None:                      # keep only the part below z=cut (waistcoat)
        bm = bmesh.new(); bm.from_mesh(o.data)
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z > cut], context='VERTS')
        bm.to_mesh(o.data); bm.free()
    for p in o.data.polygons: p.use_smooth = True
    return o

body = egg_mesh('egg'); body.data.materials.append(M_SHELL)
vest = egg_mesh('vest', 1.018, cut=-0.15); vest.data.materials.append(M_VEST)
sol = vest.modifiers.new('sol', 'SOLIDIFY'); sol.thickness = 0.02

def add(obj, parent):
    obj.parent = parent; return obj

def sphere(name, loc, r, m, sc=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=r, location=loc)
    o = bpy.context.object; o.name = name; o.scale = sc; o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = True
    return o

def surf_y(x, z):   # front surface of the egg at (x, z): y < 0 faces the camera
    zz = z / 1.3; k = 1.0 - 0.13 * zz
    r2 = max(0.0, 1 - zz * zz) * k * k - x * x
    return -math.sqrt(max(r2, 0.0))

# buttons on the waistcoat
for i, z in enumerate((-0.35, -0.6, -0.85)):
    y = surf_y(0, z) - 0.03
    sphere(f'button{i}', (0, y, z), 0.045, M_GOLD, (1, 0.5, 1))

# eyes: (x, z); the monocle sits on HIS left eye = viewer's right (+x)
EYES = {'L': (0.30, 0.42), 'R': (-0.30, 0.42)}
pupils = {}; lids = {}
for side, (x, z) in EYES.items():
    y = surf_y(x, z)
    w = sphere(f'eye{side}', (x, y + 0.03, z), 0.17, M_WHITE, (1, 0.55, 1.15))
    pupils[side] = sphere(f'pupil{side}', (x * 0.96, y - 0.055, z - 0.01), 0.07, M_INK, (1, 0.5, 1.1))
    lids[side] = w   # blink = squash the eye white and pupil
    w['pupil'] = pupils[side].name

# monocle ring + glass + chain to the waistcoat
mx, mz = EYES['L']; my = surf_y(mx, mz) - 0.07
bpy.ops.mesh.primitive_torus_add(major_radius=0.21, minor_radius=0.022, location=(mx, my, mz), rotation=(math.radians(90), 0, 0))
monocle = bpy.context.object; monocle.name = 'monocle'; monocle.data.materials.append(M_GOLD)
for p in monocle.data.polygons: p.use_smooth = True
bpy.ops.mesh.primitive_cylinder_add(radius=0.2, depth=0.005, location=(mx, my, mz), rotation=(math.radians(90), 0, 0))
glass = bpy.context.object; glass.name = 'glass'; glass.data.materials.append(M_GLASS)
cu = bpy.data.curves.new('chain', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.008
sp = cu.splines.new('BEZIER'); sp.bezier_points.add(2)
pts = [(mx + 0.2, my, mz - 0.05), (0.75, surf_y(0.62, 0) - 0.12, -0.05), (0.18, surf_y(0.18, -0.5) - 0.05, -0.5)]
for bp, p in zip(sp.bezier_points, pts):
    bp.co = p; bp.handle_left_type = bp.handle_right_type = 'AUTO'
chain = bpy.data.objects.new('chain', cu); sc.collection.objects.link(chain); chain.data.materials.append(M_GOLD)

# the eyebrow: a thick ink arc over the monocle eye; its pivot is animated
bpy.ops.object.empty_add(location=(mx, surf_y(mx, mz + 0.33) - 0.04, mz + 0.33)); brow_pivot = bpy.context.object; brow_pivot.name = 'browpivot'
cu = bpy.data.curves.new('brow', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.07; cu.bevel_resolution = 4
sp = cu.splines.new('BEZIER'); sp.bezier_points.add(2)
for bp, p in zip(sp.bezier_points, [(-0.24, 0.02, -0.06), (0.0, -0.02, 0.06), (0.24, 0.03, 0.0)]):
    bp.co = p; bp.handle_left_type = bp.handle_right_type = 'AUTO'
sp.bezier_points[0].radius = 0.5; sp.bezier_points[1].radius = 1.2; sp.bezier_points[2].radius = 0.6
brow = bpy.data.objects.new('brow', cu); sc.collection.objects.link(brow); brow.data.materials.append(M_INK); brow.parent = brow_pivot
# a small calm brow over the other eye
ox, oz = EYES['R']
cu2 = cu.copy(); cu2.bevel_depth = 0.03
brow2 = bpy.data.objects.new('brow2', cu2); sc.collection.objects.link(brow2); brow2.data.materials.append(M_INK)
brow2.location = (ox, surf_y(ox, oz + 0.27) - 0.03, oz + 0.25); brow2.scale = (0.8, 1, 0.6)

# mouth: a dark disc on the face; scale keyed per Rhubarb shape
MZ = 0.05; MY = surf_y(0, MZ) - 0.012
bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=1.0, depth=0.02, location=(0, MY, MZ), rotation=(math.radians(90), 0, 0))
mouth = bpy.context.object; mouth.name = 'mouth'; mouth.data.materials.append(M_MOUTH)
SHAPES = {'X': (0.20, 0.018), 'A': (0.19, 0.022), 'B': (0.22, 0.06), 'C': (0.24, 0.10), 'D': (0.27, 0.15),
          'E': (0.17, 0.11), 'F': (0.11, 0.08), 'G': (0.22, 0.045), 'H': (0.22, 0.08)}

# stubby arms and legs
def capsule(name, loc, rot, r, d, m):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, location=loc, rotation=rot)
    o = bpy.context.object; o.name = name; o.data.materials.append(m)
    b = o.modifiers.new('bev', 'BEVEL'); b.width = r * 0.9; b.segments = 6
    for p in o.data.polygons: p.use_smooth = True
    return o
armL = capsule('armL', (1.02, -0.05, -0.35), (0, math.radians(-35), 0), 0.07, 0.55, M_SHELL)
armR = capsule('armR', (-1.02, -0.05, -0.35), (0, math.radians(35), 0), 0.07, 0.55, M_SHELL)
for sx in (0.32, -0.32):
    capsule('leg', (sx, 0, -1.42), (0, 0, 0), 0.07, 0.4, M_SHELL)
    sphere('shoe', (sx, -0.08, -1.62), 0.13, M_INK, (1, 1.5, 0.55))

# everything hangs off a root for the idle bob
bpy.ops.object.empty_add(location=(0, 0, 0)); root = bpy.context.object; root.name = 'root'
for o in list(sc.objects):
    if o is not root and o.parent is None: o.parent = root

# camera, lights, world
bpy.ops.object.camera_add(location=(0.5, -9.0, -0.15), rotation=(math.radians(89), 0, math.radians(3)))
cam = bpy.context.object; sc.camera = cam; cam.data.lens = 50
def area(loc, rot, e, size, col='#FFF4E0'):
    bpy.ops.object.light_add(type='AREA', location=loc, rotation=rot); l = bpy.context.object
    l.data.energy = e; l.data.size = size; l.data.color = hexc(col)[:3]; return l
area((-3, -4, 3), (math.radians(55), 0, math.radians(-35)), 260, 3)          # warm key
area((3.5, -2, 1), (math.radians(80), 0, math.radians(60)), 60, 2, '#E8EEFF')  # cool fill
area((0, 3, 3), (math.radians(-60), 0, math.radians(180)), 300, 2)            # rim
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = hexc('#E5E3D2')
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.35
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 6, 0), rotation=(math.radians(90), 0, 0))
bg = bpy.context.object; bg.data.materials.append(mat('bg', '#3E5A47', 0.9))
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, -1.74)); bpy.context.object.data.materials.append(mat('floor', '#2F4536', 0.9))

# ---- animation
sc.render.fps = FPS
cues = json.load(open(os.path.join(HERE, 'mouth.json')))['mouthCues'] if os.path.exists(os.path.join(HERE, 'mouth.json')) else []
dur = cues[-1]['end'] if cues else 2.0
sc.frame_start = 1; sc.frame_end = int(dur * FPS) + 12

def key(o, path, frame, val, interp='BEZIER'):
    setattr(o, path, val); o.keyframe_insert(path, frame=frame)
    for fc in (o.animation_data.action.fcurves if hasattr(o.animation_data.action, 'fcurves') else []):
        if fc.data_path == path:
            for kp in fc.keyframe_points:
                if int(kp.co.x) == int(frame): kp.interpolation = interp

for c in cues:
    w_, h_ = SHAPES.get(c['value'], SHAPES['X'])
    f = 1 + round(c['start'] * FPS)
    key(mouth, 'scale', f, (w_, h_, 1.0), 'LINEAR')
if not cues:
    key(mouth, 'scale', 1, (SHAPES['B'][0], SHAPES['B'][1], 1.0))

# eyebrow: raise on "the look" (~1.6 s) and on "So I believe them" (~4.1 s)
def brow_at(t, up):
    f = 1 + round(t * FPS)
    key(brow_pivot, 'location', f, (mx, brow_pivot.location.y, mz + 0.33 + (0.13 if up else 0.0)))
    key(brow_pivot, 'rotation_euler', f, (0, math.radians(-10 if up else 0), 0))
for t, up in [(0, False), (1.45, False), (1.65, True), (2.6, True), (2.85, False), (3.95, False), (4.15, True), (5.0, True)]:
    brow_at(t, up)
# blink at 0.9 s and 3.4 s
for t in (0.9, 3.4):
    f = 1 + round(t * FPS)
    for eye in lids.values():
        for o in (eye, sc.objects[eye['pupil']]):
            s0 = tuple(o.scale)
            key(o, 'scale', f - 2, s0); key(o, 'scale', f, (s0[0], s0[1], s0[2] * 0.08)); key(o, 'scale', f + 2, s0)
# idle bob and a small lean
for i, f in enumerate(range(1, sc.frame_end + 1, 18)):
    key(root, 'location', f, (0, 0, 0.025 * math.sin(i * 1.3)))
    key(root, 'rotation_euler', f, (0, math.radians(2.2 * math.sin(i * 0.9)), math.radians(4 * math.sin(i * 0.6))))

# ---- render
r = sc.render
r.resolution_x, r.resolution_y = (1280, 720) if MODE == 'still' else (960, 540)
r.resolution_percentage = 100
if ENGINE == 'CYCLES':
    r.engine = 'CYCLES'; sc.cycles.samples = 48 if MODE == 'still' else 20; sc.cycles.use_denoising = True; sc.cycles.device = 'CPU'
else:
    r.engine = 'BLENDER_EEVEE'
sc.view_settings.view_transform = 'AgX'
if MODE == 'still':
    sc.frame_set(int(1.9 * FPS)); r.filepath = OUT; r.image_settings.file_format = 'PNG'
    bpy.ops.render.render(write_still=True)
else:
    r.filepath = OUT; r.image_settings.file_format = 'PNG'
    if os.environ.get('FSTART'): sc.frame_start = int(os.environ['FSTART'])
    bpy.ops.render.render(animation=True)
print('done', MODE, OUT)
