"""2.5D camera shot in Blender (Sam, 14 Nov 2026: "Let's create a 2.5D camera shot then").
A painted still becomes a relief: a finely subdivided plane pushed back by its depth map (layers.py / Depth Anything V2), the
painting on it as a flat emission (no lighting, so the gouache colours stay exactly as painted). A real 3D camera then moves
through it, so near things slide past far things with true parallax. Optional extra layers (a cut-out subject from part.py /
subject.py) float in front as separate planes, so their edges never stretch.
Run: blender -b -P depth_shot.py -- STILL.jpg DEPTH.png OUT.mp4 [--sec 6] [--move dolly|orbit|crane|push] [--depth 0.35]
     [--fps 30] [--res 1920 1080] [--samples 1] [--fg CUTOUT.png --fg-z 0.15]
Moves are small on purpose (the depth map only knows the front surface: a big orbit shows stretched smears behind objects)."""
import bpy, sys, math, argparse
argv = sys.argv[sys.argv.index('--') + 1:]
ap = argparse.ArgumentParser(); ap.add_argument('still'); ap.add_argument('depth'); ap.add_argument('out')
ap.add_argument('--sec', type=float, default=6); ap.add_argument('--move', default='dolly'); ap.add_argument('--depth_amt', '--depth', type=float, default=0.35)
ap.add_argument('--fps', type=int, default=30); ap.add_argument('--res', type=int, nargs=2, default=[1920, 1080]); ap.add_argument('--samples', type=int, default=1)
ap.add_argument('--fg'); ap.add_argument('--fg_z', '--fg-z', type=float, default=0.15); ap.add_argument('--subdiv', type=int, default=8)
a = ap.parse_args(argv)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; W, H = a.res; aspect = W / H

def emission_mat(name, img_path, alpha=False):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial'); em = nt.nodes.new('ShaderNodeEmission'); tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = bpy.data.images.load(img_path); tex.extension = 'EXTEND'; tex.interpolation = 'Cubic'
    tex.image.colorspace_settings.name = 'sRGB'
    nt.links.new(tex.outputs['Color'], em.inputs['Color'])
    if alpha:
        tr = nt.nodes.new('ShaderNodeBsdfTransparent'); mix = nt.nodes.new('ShaderNodeMixShader')
        nt.links.new(tex.outputs['Alpha'], mix.inputs['Fac']); nt.links.new(tr.outputs[0], mix.inputs[1]); nt.links.new(em.outputs[0], mix.inputs[2])
        nt.links.new(mix.outputs[0], out.inputs['Surface']); m.blend_method = 'HASHED' if hasattr(m, 'blend_method') else None
    else: nt.links.new(em.outputs[0], out.inputs['Surface'])
    return m

# the relief: plane 2*aspect x 2, subdivided, displaced back (-Y is away from the camera; we look down -Z, so push along -Z)
bpy.ops.mesh.primitive_plane_add(size=2); pl = bpy.context.object; pl.scale = (aspect, 1, 1)
bpy.ops.object.transform_apply(scale=True)
sub = pl.modifiers.new('sub', 'SUBSURF'); sub.subdivision_type = 'SIMPLE'; sub.levels = sub.render_levels = a.subdiv
dtex = bpy.data.textures.new('depth', 'IMAGE'); dtex.image = bpy.data.images.load(a.depth); dtex.image.colorspace_settings.name = 'Non-Color'
dtex.extension = 'EXTEND'
disp = pl.modifiers.new('disp', 'DISPLACE'); disp.texture = dtex; disp.texture_coords = 'UV'; disp.direction = 'Z'
disp.strength = a.depth_amt; disp.mid_level = 1.0   # depth map: white = near. mid_level 1 keeps the nearest point on the plane, the far pushed back
pl.data.materials.append(emission_mat('paint', a.still))

if a.fg:
    bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, a.fg_z)); fg = bpy.context.object; fg.scale = (aspect, 1, 1)
    fg.data.materials.append(emission_mat('fg', a.fg, alpha=True))

# camera: framing the plane exactly at the start (orthographic-like with a long lens), then a small move
cam_d = 3.2; fov = 2 * math.atan(1 / cam_d)
bpy.ops.object.camera_add(location=(0, 0, cam_d)); cam = bpy.context.object; cam.data.sensor_fit = 'VERTICAL'; cam.data.angle = fov * 0.92
sc.camera = cam; n = int(a.sec * a.fps); sc.frame_start, sc.frame_end = 1, n; sc.render.fps = a.fps
def key(f, loc, rot=(0, 0, 0)):
    cam.location = loc; cam.rotation_euler = rot; cam.keyframe_insert('location', frame=f); cam.keyframe_insert('rotation_euler', frame=f)
M = a.move
if M == 'dolly':   key(1, (-0.10, 0, cam_d)); key(n, (0.10, 0, cam_d))                                      # slide sideways: parallax
elif M == 'push':  key(1, (0, 0, cam_d)); key(n, (0, 0.02, cam_d - 0.55))                                   # move into the scene
elif M == 'crane': key(1, (0, -0.10, cam_d), (math.radians(-2), 0, 0)); key(n, (0, 0.10, cam_d - 0.2), (math.radians(2), 0, 0))
elif M == 'orbit': key(1, (-0.18, 0, cam_d), (0, math.radians(-3.2), 0)); key(n, (0.18, 0, cam_d), (0, math.radians(3.2), 0))
for fc in cam.animation_data.action.fcurves:
    for kp in fc.keyframe_points: kp.interpolation = 'BEZIER'; kp.easing = 'EASE_IN_OUT'

r = sc.render; r.engine = 'CYCLES'; sc.cycles.samples = a.samples; sc.cycles.use_denoising = False; sc.cycles.device = 'CPU'
sc.cycles.max_bounces = 0; r.resolution_x, r.resolution_y = W, H; r.resolution_percentage = 100
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'   # colours exactly as painted (no Filmic/AgX)
r.image_settings.file_format = 'FFMPEG'; r.ffmpeg.format = 'MPEG4'; r.ffmpeg.codec = 'H264'; r.ffmpeg.constant_rate_factor = 'HIGH'
r.filepath = a.out
bpy.ops.render.render(animation=True)
