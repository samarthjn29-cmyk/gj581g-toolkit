"""Prepare muted clips for a Decked out Data deck: crop to the slot, fit to the slide's duration (gentle slow motion,
then loop), tint in the palette's Primary when text sits on top, save a cover frame, and write manifest.json.

Usage: prep.py <media_specs.json> <slides.json> <out_dir> [name ...]
media_specs.json:
  {"primary": "2B1B3F",
   "clips": {"s4_street": {"src": "media/mk/4000.mp4", "slide": 5, "w": 13.333, "h": 7.5, "tint": 0.72, "offset": 0},
             "s7_court":  {"src": ["media/mk/44468.mp4", "media/mk/750.mp4", "media/mk/2285.mp4"], "slide": 7, ...}}}
  w/h = slot size in inches (13.333 x 7.5 = full-bleed 1920x1080); tint 0 = none; paths relative to the specs file.
  src as a LIST = a cut sequence: the slide's duration is split across the clips (hard cuts), so the background
  changes every few seconds (target a visual change every 3-5 s). Optional "cut_at": [seconds, ...] to place the cuts
  on narration beats instead of evenly; optional "offset" may also be a list (one start time per clip).
Rerun after narration (slide durations change) or after a palette change (re-tint). Prints which clips loop and
writes each clip's cut times to the manifest (media/preview and handoff checks count them as visual events).
Theme look (toolkit 1.5): top-level "look": {"grade": "none|sepia|bw|warm|cool|faded", "grain": 0-25, "vignette": true}
applies to every clip (a clip's own "look" overrides it), before the tint: vintage = sepia + grain 12 + vignette,
retro = warm or faded + grain 8, modern = none. Rerun after changing the look.
Smooth starts (1.7.1, after a visible jump on Blindness slide 34): the cover image (PowerPoint's poster frame, shown during
the slide transition) is the clip's FIRST frame, so playback starts on the same picture; cut sequences are joined in one
re-encode (no stream-copy seams); every clip is H.264 High@4.1, CRF 24, keyframe at least every 2 s, faststart.
Prints a warning when a source must be upscaled more than 1.3x to fill its slot (soft picture; e.g. portrait clips
cropped to 16:9): pick a bigger or landscape source for that slot.
Smooth motion (1.7.2, after stutter on Blindness slides 18 and 34): each slot keeps its sources' native frame rate (the
most common one in a cut sequence; no 24->30 fps pulldown judder); a clip shorter than its share is slowed with frame
BLENDING (no repeated frames) and listed under 'Slowed' when over 1.15x (fix those: move the cut, add a clip to the
sequence, or pick a longer source; blending ghosts on fast or handheld motion); every clip gets a TAIL of 1 s (its last
frame held) so it never runs out before the slide advances. The manifest 'dur' stays the slide length."""
import subprocess, json, os, sys, tempfile
SPEC_PATH, SLIDES_PATH, OUT = sys.argv[1:4]
ONLY = set(sys.argv[4:])
os.makedirs(OUT, exist_ok=True)
spec = json.load(open(SPEC_PATH)); base = os.path.dirname(os.path.abspath(SPEC_PATH))
PRIMARY = spec['primary'].lstrip('#'); PX = 144
dur_of = lambda p: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)
slides = {s['n']: s for s in json.load(open(SLIDES_PATH))}
man_path = os.path.join(OUT, 'manifest.json')
manifest = json.load(open(man_path)) if os.path.exists(man_path) else {}
looping, UPSCALED, SLOWED = [], [], []
TAIL = float(spec.get('tail', 1.0))
def fps_of(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', p],
                       capture_output=True, text=True).stdout.strip() or '30/1'
    a, b = r.split('/')[:2]; v = float(a) / float(b or 1)
    return r if 15 <= v <= 61 else '30/1'
def slot_fps(srcs):
    fs = [fps_of(s) for s in srcs]
    return max(set(fs), key=lambda f: (fs.count(f), float(f.split('/')[0]) / float(f.split('/')[1])))
ENC = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
       '-g', '48', '-keyint_min', '24', '-sc_threshold', '0', '-movflags', '+faststart']

GRADES = {'sepia': 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131', 'bw': 'hue=s=0,eq=contrast=1.08',
          'warm': 'colorbalance=rs=.08:gs=.02:bs=-.08:rm=.05:bm=-.05,eq=saturation=1.05', 'cool': 'colorbalance=rs=-.06:bs=.08:bm=.05',
          'faded': 'eq=contrast=0.86:saturation=0.72:brightness=0.03,colorbalance=rs=.05:bs=-.03'}
LOOK0 = spec.get('look', {}); LOOK = LOOK0
def look_filters():
    f = []
    if LOOK.get('grade', 'none') not in ('none', None): f.append(GRADES[LOOK['grade']])
    if LOOK.get('grain'): f.append(f"noise=alls={int(LOOK['grain'])}:allf=t")
    if LOOK.get('vignette'): f.append('vignette=PI/5')
    return f

def part(src, off, need, W, H, tint, out, label, fps='30/1', tail=0.0):
    """One clip fitted to `need` seconds (blended slow motion up to 1.8x, then loop), at `fps`, plus `tail` s of held last frame."""
    have = dur_of(src) - off
    vf, loops = [], 0
    try:
        sw, sh = [int(x) for x in subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                  '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip().split(',')[:2]]
        up = max(W / sw, H / sh)
        if up > 1.3: UPSCALED.append(f'{label}: {os.path.basename(src)} {sw}x{sh} upscaled {up:.1f}x')
    except ValueError: pass
    if need > have * 1.8:
        loops = int(need // (have * 1.6)); have *= (loops + 1); looping.append(label + f' x{loops + 1}')
    if need > have * 1.005:
        f = need / have
        if f > 1.15: SLOWED.append(f'{label}: {os.path.basename(src)} x{f:.2f}')
        vf += [f'setpts={f:.4f}*PTS', f'framerate=fps={fps}']
    else:
        vf.append(f'fps={fps}')
    vf += [f'scale={W}:{H}:force_original_aspect_ratio=increase', f'crop={W}:{H}', 'setsar=1']
    vf += look_filters()
    if tint: vf.append(f'drawbox=x=0:y=0:w=iw:h=ih:color=0x{PRIMARY}@{tint}:t=fill')
    vf.append('format=yuv420p')
    vf.append(f'trim=duration={need:.3f}')
    if tail: vf.append(f'tpad=stop_mode=clone:stop_duration={tail:.2f}')
    cmd = ['ffmpeg', '-y', '-loglevel', 'error'] + (['-stream_loop', str(loops)] if loops else []) + ['-ss', str(off), '-i', src,
           '-an', '-vf', ','.join(vf), '-r', fps] + ENC + [out]
    subprocess.run(cmd, check=True)
    return loops

for name, c in spec['clips'].items():
    if ONLY and name not in ONLY: continue
    n = c['slide']; tint = c.get('tint', 0); LOOK = {**LOOK0, **c.get('look', {})}
    need = float(c.get('dur') or slides[n]['dur'])
    if c['w'] > 13: W, H = 1920, 1080
    else: W = int(round(c['w'] * PX / 2) * 2); H = int(round(c['h'] * PX / 2) * 2)
    srcs = c['src'] if isinstance(c['src'], list) else [c['src']]
    srcs = [os.path.join(base, s) for s in srcs]
    offs = c.get('offset', 0); offs = offs if isinstance(offs, list) else [offs] * len(srcs)
    mp4, png = os.path.join(OUT, name + '.mp4'), os.path.join(OUT, name + '.png')
    fps = c.get('fps') or slot_fps(srcs)
    if len(srcs) == 1:
        loops = part(srcs[0], offs[0], need, W, H, tint, mp4, f'slide {n} ({name})', fps, TAIL); cuts = []
    else:
        cuts = [float(x) for x in c['cut_at']] if c.get('cut_at') else [round(need * i / len(srcs), 2) for i in range(1, len(srcs))]
        bounds = [0.0] + cuts + [need]
        tmp = tempfile.mkdtemp(); parts = []
        for i, (s, o) in enumerate(zip(srcs, offs)):
            last = i == len(srcs) - 1
            pth = os.path.join(tmp, f'p{i}.mp4'); part(s, o, bounds[i + 1] - bounds[i], W, H, tint, pth, f'slide {n} ({name} part {i + 1})', fps, TAIL if last else 0); parts.append(pth)
        ins = sum((['-i', p] for p in parts), [])
        fc = ''.join(f'[{i}:v]setsar=1[s{i}];' for i in range(len(parts))) + ''.join(f'[s{i}]' for i in range(len(parts))) + f'concat=n={len(parts)}:v=1:a=0[v]'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error'] + ins + ['-filter_complex', fc, '-map', '[v]', '-an', '-r', fps] + ENC + [mp4], check=True)
    # cover = the first frame, so the poster PowerPoint shows during the transition matches where playback starts
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp4, '-frames:v', '1', png], check=True)
    manifest[name] = dict(slide=n, path=os.path.abspath(mp4), cover=os.path.abspath(png), dur=need, w=W, h=H, cuts=cuts)
    print(f'{name:14s} slide {n:2d} {need:5.1f}s (+{TAIL:g}s tail) {W}x{H} {fps}fps clips={len(srcs)} cuts={cuts} {os.path.getsize(mp4) // 1024} KB')
json.dump(manifest, open(man_path, 'w'), indent=1)
total = sum(os.path.getsize(m['path']) for m in manifest.values() if os.path.exists(m['path']))
print(f'manifest: {len(manifest)} clips, {total / 1e6:.1f} MB')
if looping: print('Looping (visible cut when a clip restarts):', ', '.join(looping))
if UPSCALED: print('Soft (source smaller than the slot):', '; '.join(UPSCALED))
if SLOWED: print('Slowed over 1.15x (blended; move a cut, add a clip or pick a longer source):', '; '.join(SLOWED))
