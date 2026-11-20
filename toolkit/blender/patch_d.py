"""Colour_v1 ch0 patch close-up, version D (audio 19.6-37.0 s), built in Blender Cycles.
- The cone layout and types come from the real classified map in Fong et al. 2025, Fig. 1B(iv) (CC BY 4.0), detected by detect.py;
  gaps and the surround are filled with a Poisson-disc mosaic in the same proportions (illustrative).
- It opens on the paper's three real infrared frames of the same patch (Fig. 1A(iii)), pinned to the retina plane, then the cells rise
  out of the photo at the positions of the real cones.
- Real light: translucent cones (subsurface), a lit tissue floor, emissive flares, a laser beam; camera with depth of field, a rack focus
  to the neighbour, motion blur and a small hand-held drift. Bloom, grain and vignette are added in post.
Run: bpy python patch_d.py [--test FRAME] ; writes patch_d.blend and project.json (screen positions for the overlay)."""
import bpy, json, math, random, sys
from mathutils import Vector, Quaternion

D = '/home/claude/colour/blender/'
FPS, T0, T1 = 30, 19.6, 37.0
F = lambda t: 1 + round((t - T0) * FPS)
CUE = dict(track=20.2, crossA=22.6, crossB=23.9, pulses=25.9, reveal=31.3, monly=31.8, mdone=34.4, nbr=34.75, end=37.0)
COL = {'L': (1.0, 0.16, 0.10), 'M': (0.18, 0.95, 0.32), 'S': (0.20, 0.32, 1.0)}
PALE = (0.62, 0.64, 0.70)
U = 0.1                       # world units per pixel of the 70 px panel
rnd = random.Random(581)

# ---------------- layout ----------------
real = json.load(open(D + 'cones.json'))
cells = [dict(x=(c['x'] - 34) * U, y=(34 - c['y']) * U, t=c['t'], real=True) for c in real]
def far(x, y, d): return all((c['x'] - x) ** 2 + (c['y'] - y) ** 2 > d * d for c in cells)
mix = [('L', .64), ('M', .30), ('S', .06)]
def pick():
    q = rnd.random(); return 'L' if q < .64 else 'M' if q < .94 else 'S'
for _ in range(60000):                       # Poisson-disc fill: gaps inside the real square, then the surround
    x, y = rnd.uniform(-10.5, 10.5), rnd.uniform(-7.0, 7.0)
    inside = abs(x) < 3.4 and abs(y) < 3.4
    if far(x, y, 0.50 if inside else 0.46): cells.append(dict(x=x, y=y, t=pick(), real=False))
surfz = lambda x, y: -(x * x + y * y) * 0.006
print('cells', len(cells), 'real', len(real))

# ---------------- scene ----------------
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'
sc.cycles.samples = 20; sc.render.use_persistent_data = True; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
sc.cycles.max_bounces = 4; sc.cycles.transmission_bounces = 2; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 2
sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.05
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1920, 1080, 100
sc.render.fps = FPS; sc.frame_start, sc.frame_end = 1, F(T1) - 1
sc.render.use_motion_blur = True; sc.render.motion_blur_shutter = 0.5
sc.view_settings.view_transform = 'AgX'
try: sc.view_settings.look = 'AgX - Medium High Contrast'
except Exception: pass
sc.render.image_settings.file_format = 'JPEG'; sc.render.image_settings.quality = 95
world = bpy.data.worlds.new('w'); sc.world = world; world.use_nodes = True
world.node_tree.nodes['Background'].inputs[0].default_value = (0.006, 0.008, 0.018, 1); world.node_tree.nodes['Background'].inputs[1].default_value = 1.0

def mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True; return m, m.node_tree.nodes, m.node_tree.links

# tissue floor: warm dark RPE with a soft noise bump
fm, fn, fl = mat('floor'); b = fn['Principled BSDF']
b.inputs['Base Color'].default_value = (0.045, 0.018, 0.016, 1); b.inputs['Roughness'].default_value = 0.65
nz = fn.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 3.0; nz.inputs['Detail'].default_value = 6
bm = fn.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = 0.25; fl.new(nz.outputs['Fac'], bm.inputs['Height']); fl.new(bm.outputs['Normal'], b.inputs['Normal'])
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, -0.18)); floor = bpy.context.object; floor.scale = (30, 20, 1); floor.data.materials.append(fm)

# cones: one shared translucent material, tint and flare driven by each object's colour (rgb = tint, alpha = glow)
cm, cn, cl = mat('cone'); b = cn['Principled BSDF']
oi = cn.new('ShaderNodeObjectInfo')
sep = cn.new('ShaderNodeSeparateColor')
b.inputs['Roughness'].default_value = 0.28
b.inputs['Coat Weight'].default_value = 0.6; b.inputs['Coat Roughness'].default_value = 0.08
dk = cn.new('ShaderNodeMix'); dk.data_type = 'RGBA'; dk.inputs['Factor'].default_value = 0.55; dk.inputs['B'].default_value = (0.02, 0.02, 0.03, 1)
cl.new(oi.outputs['Color'], dk.inputs['A']); cl.new(dk.outputs['Result'], b.inputs['Base Color'])
lw = cn.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.35
core = cn.new('ShaderNodeMath'); core.operation = 'SUBTRACT'; core.inputs[0].default_value = 1.0; cl.new(lw.outputs['Facing'], core.inputs[1])
pw = cn.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 2.2; cl.new(core.outputs[0], pw.inputs[0])
em = cn.new('ShaderNodeMix'); em.data_type = 'RGBA'; em.inputs['Factor'].default_value = 0.45
cl.new(oi.outputs['Color'], em.inputs['A']); em.inputs['B'].default_value = (1, 1, 1, 1); em.inputs['Factor'].default_value = 0.3
cl.new(em.outputs['Result'], b.inputs['Emission Color'])
glow = cn.new('ShaderNodeMath'); glow.operation = 'MULTIPLY'; glow.inputs[1].default_value = 9.0
cl.new(oi.outputs['Alpha'], glow.inputs[0])
base = cn.new('ShaderNodeMath'); base.operation = 'MULTIPLY'; base.inputs[1].default_value = 0.9; cl.new(pw.outputs[0], base.inputs[0])   # waveguide core glow
tot = cn.new('ShaderNodeMath'); tot.operation = 'ADD'; cl.new(base.outputs[0], tot.inputs[0]); cl.new(glow.outputs[0], tot.inputs[1])
cl.new(tot.outputs[0], b.inputs['Emission Strength'])
bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=1); po = bpy.context.object; proto = po.data
for v in proto.vertices:                      # capsule: stretch the lower half into a column that sinks into the floor
    if v.co.z < 0: v.co.z = v.co.z * 2.6
bpy.ops.object.delete()
for p in proto.polygons: p.use_smooth = True
proto.materials.append(cm)
objs = []
for i, c in enumerate(cells):
    o = bpy.data.objects.new(f'c{i}', proto); sc.collection.objects.link(o)
    r = 0.19 * (1 + rnd.uniform(-0.08, 0.10)); c['r'] = r
    o.scale = (r, r, r * 1.25); c['z'] = surfz(c['x'], c['y'])
    o.location = (c['x'], c['y'], c['z']); objs.append(o)

# real infrared frames, pinned to the cell tops (emissive, so they read like the camera's own image)
irs = []
for k in range(3):
    m, n, l = mat(f'ir{k}'); n.remove(n['Principled BSDF']); out = n['Material Output']
    tx = n.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(D + f'ir{k}.png'); tx.interpolation = 'Cubic'
    es = n.new('ShaderNodeEmission'); l.new(tx.outputs['Color'], es.inputs['Color'])
    tr = n.new('ShaderNodeBsdfTransparent'); mx = n.new('ShaderNodeMixShader')
    l.new(tr.outputs[0], mx.inputs[1]); l.new(es.outputs[0], mx.inputs[2]); l.new(mx.outputs[0], out.inputs['Surface'])
    bpy.ops.mesh.primitive_plane_add(size=7.0, location=(-0.05, 0.05, 0.3 + k * 0.001)); p = bpy.context.object; p.data.materials.append(m)
    irs.append((p, mx, es))

# laser beam
lm, ln_, ll = mat('beam'); ln_.remove(ln_['Principled BSDF']); es = ln_.new('ShaderNodeEmission')
es.inputs['Color'].default_value = (0.55, 1.0, 0.92, 1); ll.new(es.outputs[0], ln_['Material Output'].inputs['Surface'])
bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.018, depth=1, location=(0, 0, 0.5)); beam = bpy.context.object
bpy.ops.object.transform_apply(location=True)          # origin at the bottom end
beam.data.materials.append(lm); beam.visible_shadow = False
for p in beam.data.polygons: p.use_smooth = True
SRC = Vector((7.0, 6.0, 11.0))

# light: soft key from top left, cool rim from the right, faint fill
def light(kind, loc, energy, col, size=4):
    L = bpy.data.lights.new(kind, kind); L.energy = energy; L.color = col
    if kind == 'AREA': L.size = size
    o = bpy.data.objects.new(kind, L); sc.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o
light('AREA', (-6, 5, 8), 900, (1.0, 0.92, 0.85), 6)
light('AREA', (9, -3, 3), 500, (0.55, 0.7, 1.0), 3)
light('AREA', (0, -8, 10), 120, (0.8, 0.85, 1.0), 10)

# ---------------- camera ----------------
camd = bpy.data.cameras.new('cam'); cam = bpy.data.objects.new('cam', camd); sc.collection.objects.link(cam); sc.camera = cam
camd.lens = 50; camd.sensor_width = 36; camd.dof.use_dof = True
focus = bpy.data.objects.new('focus', None); sc.collection.objects.link(focus); camd.dof.focus_object = focus
def camkey(t, pos, look, fstop):
    f = F(t); cam.location = pos
    fwd = (Vector(look) - Vector(pos)).normalized(); up = Vector((0, 1, 0)); right = fwd.cross(up).normalized(); up2 = right.cross(fwd)
    from mathutils import Matrix
    cam.rotation_euler = Matrix((right, up2, -fwd)).transposed().to_euler()
    cam.keyframe_insert('location', frame=f); cam.keyframe_insert('rotation_euler', frame=f)
    focus.location = look; focus.keyframe_insert('location', frame=f)
    camd.dof.aperture_fstop = fstop; camd.dof.keyframe_insert('aperture_fstop', frame=f)

# the neighbour: a real L cone near the middle that touches a real M cone
rl = [c for c in cells if c['real']]
def d(a, b): return math.hypot(a['x'] - b['x'], a['y'] - b['y'])
pairs = sorted(((d(a, b), a, b) for a in rl if a['t'] == 'L' for b in rl if b['t'] == 'M' and d(a, b) < 0.6), key=lambda p: math.hypot(p[1]['x'] - 0.6, p[1]['y'] + 0.3))
NB, NBM = pairs[0][1], pairs[0][2]
nbv = Vector((NB['x'], NB['y'], NB['z'] + 0.2))

camkey(19.6, (0, 0.0, 15.6), (0, 0.0, 0), 22)              # straight down on the real image, everything sharp
camkey(CUE['crossA'], (0.1, -0.4, 14.6), (0, 0, 0), 22)
camkey(26.0, (0.9, -5.2, 9.4), (0.1, 0.4, 0), 4.0)          # tilt and dolly in as the cells rise
camkey(31.3, (1.6, -5.9, 8.4), (0.2, 0.3, 0), 3.2)
camkey(CUE['nbr'], (1.9, -6.0, 8.0), (0.3, 0.2, 0), 3.0)
camkey(36.0, (NB['x'] + 1.0, NB['y'] - 3.4, 4.6), tuple(nbv), 1.4)   # push in, rack focus to the neighbour
camkey(37.0, (NB['x'] + 0.9, NB['y'] - 3.2, 4.4), tuple(nbv), 1.3)
def fcurves(idblock):
    ad = idblock.animation_data
    if not ad or not ad.action: return []
    fcs = getattr(ad.action, 'fcurves', None)
    if fcs is None: fcs = [fc for layer in ad.action.layers for strip in layer.strips for cb in strip.channelbags for fc in cb.fcurves]
    return list(fcs)
# hand-held: a little noise on the camera location
try:
    for fc in fcurves(cam):
        if fc.data_path == 'location':
            md = fc.modifiers.new('NOISE'); md.scale = 40; md.strength = 0.05; md.phase = fc.array_index * 13.7
except Exception as e: print('noise modifier skipped', e)

# ---------------- animation ----------------
def key_obj(o, t, rgb, a, scale=None):
    f = F(t); o.color = (*rgb, a); o.keyframe_insert('color', frame=f)
    if scale is not None: o.scale = scale; o.keyframe_insert('scale', frame=f)

# rise: the cells come up out of the photo, the real ones first, centre-out; the surround grows in after
for o, c in zip(objs, cells):
    dc = math.hypot(c['x'], c['y']); t0 = CUE['crossA'] + (0 if c['real'] else 0.4) + dc * 0.05
    full = o.scale.copy(); o.location.z = c['z'] - 0.45; o.keyframe_insert('location', frame=1); o.keyframe_insert('location', frame=F(t0))
    o.scale = full * 0.02; o.keyframe_insert('scale', frame=1); o.keyframe_insert('scale', frame=F(t0))
    o.location.z = c['z']; o.keyframe_insert('location', frame=F(t0 + 0.7)); o.scale = full; o.keyframe_insert('scale', frame=F(t0 + 0.7))
    key_obj(o, 19.6, PALE, 0.0); key_obj(o, t0, PALE, 0.0)
    c['pale'] = PALE
# the IR frames flicker between the three real frames (eye twitch), then fade as the cells come through
for k, (p, mx, es) in enumerate(irs):
    def kv(t, v): mx.inputs[0].default_value = v; mx.inputs[0].keyframe_insert('default_value', frame=F(t))
    kv(19.6, 1.0 if k == 0 else 0.0)
    t = 20.2; j = 0
    while t < CUE['crossA'] + 0.25:
        on = (j % 3 == k); kv(t, 1.0 if on else 0.0); kv(t + 0.38, 1.0 if on else 0.0); t += 0.4; j += 1
    tf = CUE['crossA'] + 0.3; kv(tf, 1.0 if k == 0 else 0.0)
    if k == 0:
        n = int((CUE['crossB'] - tf) * FPS)
        for q in range(1, n + 1): kv(tf + q / FPS, (1 - q / n) ** 1.6)   # fade, keyed per frame (constant interpolation)
    else: kv(CUE['crossB'], 0.0)
    es.inputs['Strength'].default_value = 1.15; es.inputs['Strength'].keyframe_insert('default_value', frame=1)

# flares: quick strike, slow fall-off (keys on the object's colour alpha)
glowkeys = {i: [] for i in range(len(cells))}
def flare(i, t, peak=1.0, hold=None):
    glowkeys[i] += [(t - 0.02, None), (t + 0.08, peak), (t + 0.5, peak * 0.22 if hold is None else hold), (t + 1.1, 0.0 if hold is None else hold)]
real_idx = [i for i, c in enumerate(cells) if c['real']]
order = real_idx[:]; rnd.shuffle(order)
pulse_t = [CUE['pulses'] + 0.15 + k * 0.33 for k in range(int((CUE['reveal'] - CUE['pulses'] - 0.1) / 0.33))]
targets = []
for k, t in enumerate(pulse_t): i = order[k]; flare(i, t); targets.append((t, i, t + 0.14))
entry = (3.2, 3.2)
ms = sorted([i for i, c in enumerate(cells) if c['t'] == 'M' and abs(c['x']) < 6.5 and abs(c['y']) < 4.2],
            key=lambda i: math.hypot(cells[i]['x'] - entry[0], cells[i]['y'] - entry[1]))
span = CUE['mdone'] - CUE['monly'] - 0.3
for k, i in enumerate(ms):
    t = CUE['monly'] + 0.1 + span * k / len(ms); flare(i, t, 1.0, hold=0.16); targets.append((t, i, t + 0.06))
# colour reveal, centre-out wave
for i, (o, c) in enumerate(zip(objs, cells)):
    tr = CUE['reveal'] + math.hypot(c['x'], c['y']) * 0.06
    keys = sorted([(tr - 0.01, 'pale'), (tr + 0.45, 'col')] + [(t, g) for t, g in glowkeys[i]], key=lambda x: x[0])
    cur_rgb, cur_a = PALE, 0.0
    def rgb_at(t): return PALE if t < tr + 0.2 else COL[c['t']]
    def a_at(t):   # evaluate the flare envelope at t
        a = 0.0; ks = glowkeys[i]
        for j in range(0, len(ks), 4):
            (s, _), (p, pk), (q, mid), (e, end) = ks[j:j + 4]
            if t <= s: continue
            if t < p: v = pk * (t - s) / (p - s)
            elif t < q: v = pk + (mid - pk) * (t - p) / (q - p)
            elif t < e: v = mid + (end - mid) * (t - q) / (e - q)
            else: v = end
            a = max(a, v)
        return a
    times = sorted(set([round(t, 3) for t, _ in keys]))
    for t in times:
        if t < CUE['crossA']: continue
        key_obj(o, t, rgb_at(t), a_at(t))
    key_obj(o, CUE['end'] + 0.1, rgb_at(CUE['end']), a_at(CUE['end']))
    # the neighbour gets a soft focus light of its own at the end (it stays dark: never aimed at)

# beam: constant-interpolated jumps between targets, visible only while it fires
bm_es = es
def beamkey(t, i, strength):
    c = cells[i]; tp = Vector((c['x'], c['y'], c['z'] + c['r'] * 1.2)); v = SRC - tp
    beam.location = tp; beam.rotation_mode = 'QUATERNION'; beam.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(v)
    beam.scale = (1 if strength > 0 else 0, 1 if strength > 0 else 0, v.length); f = F(t)
    for pth in ('location', 'rotation_quaternion', 'scale'): beam.keyframe_insert(pth, frame=f)
    bm_es.inputs['Strength'].default_value = strength; bm_es.inputs['Strength'].keyframe_insert('default_value', frame=f)
beamkey(19.6, targets[0][1], 0.0)
for t, i, off in targets:
    beamkey(t - 0.001, i, 0.0); beamkey(t, i, 26.0)
    if off - t > 0.1: beamkey(off, i, 0.0)
beamkey(CUE['mdone'] + 0.05, targets[-1][1], 0.0)
def set_interp(idblock, kind):
    for fc in fcurves(idblock):
        for k in fc.keyframe_points: k.interpolation = kind
set_interp(beam, 'CONSTANT'); set_interp(lm.node_tree, 'CONSTANT')
for p, mx, es_ in irs: set_interp(p.data.materials[0].node_tree, 'CONSTANT')
for o in objs: set_interp(o, 'LINEAR')

# ---------------- screen positions for the overlay (neighbour, its M partner, laser entry) ----------------
from bpy_extras.object_utils import world_to_camera_view
proj = {}
for f in range(1, sc.frame_end + 1):
    sc.frame_set(f); co = world_to_camera_view(sc, cam, nbv); cm2 = world_to_camera_view(sc, cam, Vector((NBM['x'], NBM['y'], NBM['z'] + 0.2)))
    px = 0.19 / max(0.1, (cam.matrix_world.translation - nbv).length) * camd.lens / camd.sensor_width * 1920
    proj[f] = [round(co.x * 1920, 1), round((1 - co.y) * 1080, 1), round(px, 1), round(cm2.x * 1920, 1), round((1 - cm2.y) * 1080, 1)]
json.dump({'fps': FPS, 't0': T0, 'frames': proj}, open(D + 'project.json', 'w'))
sc.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=D + 'patch_d.blend')
print('saved; frames', sc.frame_end, 'neighbour', round(NB['x'], 2), round(NB['y'], 2))

if '--test' in sys.argv:
    import time
    for f in [int(x) for x in sys.argv[sys.argv.index('--test') + 1].split(',')]:
        sc.frame_set(f); sc.render.filepath = f'/tmp/claude-0/-home-claude/4f679353-75c2-5592-944f-4863c7efe9b2/scratchpad/c3/d_{f:04d}.jpg'
        t = time.time(); bpy.ops.render.render(write_still=True); print('frame', f, round(time.time() - t, 1), 's')
