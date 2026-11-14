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
ap.add_argument('--fg'); ap.add_argument('--fg_z', '--fg-z', type=float, default=0.15); ap.add_argument('--subdiv', type=int, default=8); ap.add_argument('--fov', type=float, default=0.8); ap.add_argument('--figures')   # DIR from figures.py: the still's animals and people walk (the still arg should then be DIR/plate_aligned.png)
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

# moving figures (Sam, 14 Nov 2026: "make the goats, camels and people move"): each cut-out stands on the relief at its foot
# point, at the depth the depth map gives there, facing the camera. figures.json entries may carry act: walk (dx, dy world
# units per second, bob), graze (a slow head-down rock about the feet), idle (a tiny breathing sway), flip (mirror).
FIG = []
if a.figures:
    import json, os
    _di = bpy.data.images.load(a.depth); DW, DH = _di.size; _px = list(_di.pixels)   # Blender's own image reader (no PIL in bpy's Python)
    class _D:
        def getpixel(self, p): x, y = p; return 255 * _px[((DH - 1 - y) * DW + x) * _di.channels]
    dimg = _D()
    for f in json.load(open(os.path.join(a.figures, 'figures.json'))):
        if f.get('act') == 'skip': continue
        u, v = f['x'], f['foot']; dv = dimg.getpixel((min(DW - 1, int(u * DW)), min(DH - 1, int(v * DH)))) / 255
        X, Y, Z = (u * 2 - 1) * aspect, 1 - v * 2, (dv - 1) * a.depth_amt + 0.004
        w, h = f['w'] * 2 * aspect, f['h'] * 2
        bpy.ops.mesh.primitive_plane_add(size=1); ob = bpy.context.object
        for vt in ob.data.vertices: vt.co.x *= w; vt.co.y = (vt.co.y + 0.5) * h   # origin at the feet
        ob.location = (X, Y, Z); ob.scale.x = -1 if f.get('flip') else 1
        ob.data.materials.append(emission_mat(f['file'], os.path.join(a.figures, f['file']), alpha=True)); FIG.append((ob, f))

# camera: framing the plane exactly at the start (orthographic-like with a long lens), then a small move
cam_d = 3.2; fov = 2 * math.atan(1 / cam_d)
bpy.ops.object.camera_add(location=(0, 0, cam_d)); cam = bpy.context.object; cam.data.sensor_fit = 'VERTICAL'; cam.data.angle = fov * (a.fov if hasattr(a, "fov") else 0.8)
sc.camera = cam; n = int(a.sec * a.fps); sc.frame_start, sc.frame_end = 1, n; sc.render.fps = a.fps
def key(f, loc, rot=(0, 0, 0)):
    cam.location = loc; cam.rotation_euler = rot; cam.keyframe_insert('location', frame=f); cam.keyframe_insert('rotation_euler', frame=f)
M = a.move
if M == 'dolly':   key(1, (-0.10, 0, cam_d)); key(n, (0.10, 0, cam_d))                                      # slide sideways: parallax
elif M == 'push':  key(1, (0, 0, cam_d)); key(n, (0, 0.02, cam_d - 0.55))                                   # move into the scene
elif M == 'crane': key(1, (0, -0.10, cam_d), (math.radians(-2), 0, 0)); key(n, (0, 0.10, cam_d - 0.2), (math.radians(2), 0, 0))
elif M == 'orbit': key(1, (-0.18, 0, cam_d), (0, math.radians(-3.2), 0)); key(n, (0.18, 0, cam_d), (0, math.radians(3.2), 0))
# Bezier keys (Blender's default) already ease in and out; Blender 5 slotted actions have no action.fcurves to edit
for ob, f in FIG:   # figure motion, keyed every frame (simple and exact)
    x0, y0, z0 = ob.location; act = f.get('act', 'idle'); ph = f.get('phase', 0.0)
    for fr in range(1, n + 1):
        t = (fr - 1) / a.fps
        if act == 'walk':
            st = f.get('step', 2.2); ob.location = (x0 + f.get('dx', 0.02) * t, y0 + f.get('dy', 0) * t + f.get('bob', 0.0025) * abs(math.sin(math.pi * st * t + ph)), z0)
            ob.rotation_euler = (0, 0, math.radians(f.get('rock', 1.5)) * math.sin(math.pi * st * t + ph))
        elif act == 'graze':
            k = 0.5 + 0.5 * math.sin(2 * math.pi * f.get('rate', 0.25) * t + ph); ob.rotation_euler = (0, 0, math.radians(f.get('rock', 5)) * (k - 0.5) * (-1 if f.get('flip') else 1))
            ob.location = (x0 + f.get('dx', 0.003) * math.sin(2 * math.pi * 0.1 * t + ph), y0, z0)
        else:
            ob.rotation_euler = (0, 0, math.radians(0.8) * math.sin(2 * math.pi * 0.4 * t + ph))
        ob.keyframe_insert('location', frame=fr); ob.keyframe_insert('rotation_euler', frame=fr)

r = sc.render; r.engine = 'CYCLES'; sc.cycles.samples = a.samples; sc.cycles.use_denoising = False; sc.cycles.device = 'CPU'
sc.cycles.max_bounces = 0; r.resolution_x, r.resolution_y = W, H; r.resolution_percentage = 100
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'   # colours exactly as painted (no Filmic/AgX)
import os, subprocess, tempfile, shutil   # PNG frames, then ffmpeg (the FFMPEG output settings moved in Blender 5)
tmp = tempfile.mkdtemp(dir=os.path.dirname(os.path.abspath(a.out))); r.image_settings.file_format = 'PNG'; r.filepath = tmp + '/f_'
bpy.ops.render.render(animation=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(a.fps), '-i', tmp + '/f_%04d.png', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', a.out], check=True)
shutil.rmtree(tmp)
