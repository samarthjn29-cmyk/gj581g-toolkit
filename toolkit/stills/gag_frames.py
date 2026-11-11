#!/usr/bin/env python3
"""Placement review pack for the fresh reviewer agent (Sam, 11 Nov 2026, after Aliens ch3: "There are a lot of issues with
the gags placement and scene cuts ... a reviewer is required which reviews the placement of visual elements on the pictures").

For every gag card: three 640 px frames (just after it lands, middle, just before it leaves). For every picture change: the
frame 0.12 s before and 0.12 s after. Each row is captioned with the time, the card or shot, and the words being spoken, so a
reviewer who never saw the plan can judge whether the gag sits on the right thing at the right moment.
Also writes OUT_timing.txt, a mechanical report:
  CUT-MIDWORD  a picture change that lands inside a word (more than 0.08 s after the word starts and 0.08 s before it ends)
  CUT-EARLY/LATE  a cued cut more than 0.25 s from its cue word
  SFX-ON-WORD  a gag sound (from the mix script) that overlaps a spoken word
Usage: gag_frames.py CLIP.mp4 TIMELINE.json OUT_PREFIX [--mix mix_x.sh]"""
import json, subprocess, sys, os, re, tempfile
from PIL import Image, ImageDraw, ImageFont
a = sys.argv[1:]; clip, tl, out = a[:3]; mix = a[a.index('--mix') + 1] if '--mix' in a else None
T = json.load(open(tl)); W = T.get('words', []); D = T['dur']
FULL = ('kinetic', 'title', 'number', 'bars', 'chain', 'later', 'split', 'triptych', 'ruler', 'advert', 'grid', 'namesake', 'variants', 'headline_full')
def said(t0, t1): return ' '.join(w[0] for w in W if w[2] > t0 and w[1] < t1)
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
except Exception: F = ImageFont.load_default()
td = tempfile.mkdtemp()
def grab(t):
    t = max(0, min(D - 0.05, t)); p = f'{td}/{t:.2f}.jpg'
    if not os.path.exists(p): subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', clip, '-frames:v', '1', '-vf', 'scale=640:-2', p], check=True)
    return Image.open(p)
rows = []   # (caption, [(time, label)])
for i, c in enumerate(sorted(T['cards'], key=lambda c: c['t'])):
    t0, t1 = c['t'], min(c['t'] + c['dur'], D); txt = str(c.get('text') or c.get('title') or c.get('items') or c.get('img') or '')[:50].replace('\n', ' ')
    tag = 'FULL-SCREEN' if c['kind'] in FULL and c.get('style') != 'rise' else 'OVERLAY'
    rows.append((f"G{i + 1} {c['kind']} ({tag}) '{txt}'  {t0:.2f}-{t1:.2f}s  spoken: \"{said(t0 - 0.3, t1)}\"",
                 [(t0 + min(0.3, (t1 - t0) / 3), 'lands'), ((t0 + t1) / 2, 'middle'), (t1 - 0.1, 'leaves')]))
cuts = sorted(set([s['t'] for s in T['shots'] if s['t'] > 0.05] + [c['t'] for c in T['cards'] if c['kind'] in FULL and c.get('style') != 'rise'] +
                  [c['t'] + c['dur'] for c in T['cards'] if c['kind'] in FULL and c.get('style') != 'rise' and c['t'] + c['dur'] < D - 0.1]))
for k, t in enumerate(cuts):
    sh = [s for s in T['shots'] if s['t'] <= t + 0.01]
    rows.append((f"C{k + 1} picture change at {t:.2f}s -> {sh[-1]['id'] if sh else ''} {sh[-1].get('img', '') if sh else ''}  spoken around it: \"{said(t - 0.8, t + 0.8)}\"",
                 [(t - 0.12, 'before'), (t + 0.12, 'after')]))
per = 6; pages = []
for p in range(0, len(rows), per):
    chunk = rows[p:p + per]; sheet = Image.new('RGB', (640 * 3 + 20, len(chunk) * (360 + 34) + 10), (24, 24, 24)); d = ImageDraw.Draw(sheet)
    for r, (cap, fr) in enumerate(chunk):
        y = 10 + r * 394; d.text((10, y), cap[:190], fill=(255, 220, 90), font=F)
        for j, (t, lab) in enumerate(fr):
            im = grab(t); sheet.paste(im, (10 + j * 640, y + 26)); d.text((16 + j * 640, y + 30), f'{lab} {t:.2f}s', fill=(255, 60, 60), font=F)
    fn = f'{out}_{len(pages) + 1}.jpg'; sheet.save(fn, quality=82); pages.append(fn)
rep = []
for s in T['shots']:
    t = s['t']
    for w in W:
        if w[1] + 0.08 < t < w[2] - 0.08: rep.append(f"CUT-MIDWORD {t:.2f}s {s['id']} lands inside '{w[0]}' ({w[1]:.2f}-{w[2]:.2f})")
    if s.get('word'):
        near = min((w for w in W if re.sub(r'[^a-z0-9]', '', w[0].lower()).startswith(re.sub(r'[^a-z0-9]', '', s['word'].lower()))), key=lambda w: abs(w[1] - t), default=None)
        if near and abs(near[1] - t) > 0.25: rep.append(f"CUT-{'EARLY' if t < near[1] else 'LATE'} {t:.2f}s {s['id']} cue '{s['word']}' is at {near[1]:.2f}")
if mix:
    for f, t, rest in re.findall(r'([\w./]+\.wav)@([\d.]+)((?::[-\d.]+){0,2})', open(mix).read()):
        t = float(t); parts = rest.split(':'); dur = float(parts[2]) if len(parts) > 2 and parts[2] else 0.4
        hit = [w for w in W if w[1] < t + dur - 0.03 and w[2] > t + 0.03]
        if hit: rep.append(f"SFX-ON-WORD {t:.2f}s {os.path.basename(f)} ({dur:.2f}s) overlaps: {' '.join(w[0] for w in hit)}")
open(f'{out}_timing.txt', 'w').write('\n'.join(rep) + ('\n' if rep else 'no timing problems\n'))
print(len(rows), 'rows on', len(pages), 'sheets;', len(rep), 'timing findings ->', f'{out}_timing.txt'); print('\n'.join(pages))
