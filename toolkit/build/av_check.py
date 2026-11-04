#!/usr/bin/env python3
"""Post-render check of a finished clip (4 Nov 2026, after Sam's clip A notes: a stamp on screen for under a second,
a time-stretched line). Looks at the MP4 itself, not the code, and writes a report Claude reads before sending a clip.

  av_check.py clip.mp4 --timing tts/timing.json --mix tts/<mix>.wav --start <clip start s> \
      [--factcheck story/X_factcheck.csv] [--script story/X_script.json] [--numbers-ok screen_numbers_ok.txt] [--out dir]

Checks (HARD = must be fixed before sending; REVIEW = look at it):
  1 HARD   video and audio lengths match each other and the frame count
  2 HARD   the clip's audio is the approved mix at that point (correlation per 5 s window, offset <= 1 frame)
  3 REVIEW text on screen for less than MIN_ON s (stamps, labels, numbers) -- OCR of the picture above the caption band
  4 REVIEW numbers on screen that are not in the fact-check, the script or the project's reviewed list (screen_numbers_ok.txt)
  5 HARD   captions: the word being spoken is in the caption band; nothing captioned while only the Heckler speaks
  6 REVIEW text touching the frame edge or sitting in the caption band
  7 REVIEW silent gaps over 1 s, a picture that does not change for 6 s or more, loudness and true peak
  8 REVIEW narration pace: lines faster than 4.3 or slower than 2.0 words/s, or far from the clip's median
  9 REVIEW picture changes not near any spoken word (visual cues that may have drifted off their word)
Needs ffmpeg, tesseract, numpy, opencv (cv2), soundfile."""
import argparse, csv, json, os, re, subprocess, sys, tempfile, difflib
import numpy as np, cv2, soundfile as sf

MIN_ON = 1.5; FPS_OCR = 4; CAP_Y = (975, 1078)
ap = argparse.ArgumentParser(); ap.add_argument('mp4'); ap.add_argument('--timing', required=True); ap.add_argument('--mix', required=True)
ap.add_argument('--start', type=float, default=0.0); ap.add_argument('--factcheck'); ap.add_argument('--script'); ap.add_argument('--numbers-ok')
ap.add_argument('--out'); ap.add_argument('--fps', type=float, default=30.0)
A = ap.parse_args(); out = A.out or os.path.splitext(A.mp4)[0] + '_avcheck'; os.makedirs(out, exist_ok=True)
R = {'hard': [], 'review': [], 'info': []}
def hard(m): R['hard'].append(m)
def review(m): R['review'].append(m)
def info(m): R['info'].append(m)
def sh(cmd): return subprocess.run(cmd, capture_output=True, text=True)
def probe(stream):
    r = sh(['ffprobe', '-v', 'error', '-select_streams', stream, '-show_entries', 'stream=duration,nb_frames', '-of', 'json', A.mp4]); s = json.loads(r.stdout)['streams']
    return s[0] if s else {}

# ---- 1. lengths
v, a = probe('v:0'), probe('a:0'); vd, ad = float(v.get('duration', 0)), float(a.get('duration', 0)); nf = int(v.get('nb_frames', 0) or 0)
D = vd; info(f'video {vd:.3f} s ({nf} frames), audio {ad:.3f} s')
if not a: hard('no audio stream')
elif abs(vd - ad) > 0.1: hard(f'video {vd:.2f} s vs audio {ad:.2f} s')
if nf and abs(nf / A.fps - vd) > 0.05: hard(f'{nf} frames at {A.fps} fps = {nf / A.fps:.2f} s, container says {vd:.2f} s')

# ---- 2. audio = the approved mix
T = json.load(open(A.timing)); LINES = T['lines']; t0, t1 = A.start, A.start + D
def pcm(src, ss=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', f'{ss:.3f}', '-i', src] + (['-t', f'{dur:.3f}'] if dur else []) + ['-ac', '1', '-ar', '16000', '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, dtype=np.float32)
clip, ref = pcm(A.mp4), pcm(A.mix, t0, D)
n = min(len(clip), len(ref)); sr = 16000
if n < sr: hard('audio too short to compare')
else:
    best, lag = -1, 0  # offset search in +-0.2 s on the first 20 s
    for L in range(-int(0.2 * sr), int(0.2 * sr) + 1, 16):
        x, y = (clip[max(0, L):], ref[max(0, -L):]); m = min(len(x), len(y), sr * 20)
        if m < sr: continue
        cc = float(np.dot(x[:m], y[:m]) / (np.linalg.norm(x[:m]) * np.linalg.norm(y[:m]) + 1e-9))
        if cc > best: best, lag = cc, L
    for L in range(lag - 16, lag + 17):  # refine to the sample: a 1 ms error wrecks the correlation of the Heckler's higher voice
        x, y = (clip[max(0, L):], ref[max(0, -L):]); m = min(len(x), len(y), sr * 20)
        cc = float(np.dot(x[:m], y[:m]) / (np.linalg.norm(x[:m]) * np.linalg.norm(y[:m]) + 1e-9))
        if cc > best: best, lag = cc, L
    off = lag / sr; info(f'audio offset vs mix {off * 1000:+.0f} ms (corr {best:.3f})')
    if abs(off) > 0.06: hard(f'audio is {off * 1000:+.0f} ms off the mix')  # AAC encoder priming adds 20-45 ms; more than 60 ms is a real shift
    x, y = (clip[max(0, lag):], ref[max(0, -lag):]); m = min(len(x), len(y)); worst = (1, 0)
    for i in range(0, m - sr * 5, sr * 5):
        xs, ys = x[i:i + sr * 5], y[i:i + sr * 5]
        if np.sqrt((ys ** 2).mean()) < 1e-3: continue
        cc = float(np.dot(xs, ys) / (np.linalg.norm(xs) * np.linalg.norm(ys) + 1e-9))
        if cc < worst[0]: worst = (cc, i / sr)
    info(f'worst 5 s window: corr {worst[0]:.3f} at {worst[1]:.1f} s')
    if worst[0] < 0.9: hard(f'audio differs from the approved mix around {worst[1]:.1f}-{worst[1] + 5:.1f} s (corr {worst[0]:.2f}): stale or wrong track?')

# ---- frames for OCR
tmp = tempfile.mkdtemp(prefix='avc_', dir=out)
subprocess.run(['ffmpeg', '-v', 'error', '-i', A.mp4, '-vf', f'fps={FPS_OCR}', f'{tmp}/f_%05d.png'], check=True)
frames = sorted(f for f in os.listdir(tmp) if f.endswith('.png')); times = [(i + 0.5) / FPS_OCR for i in range(len(frames))]
def ocr(img, psm):
    p = f'{tmp}/_o.png'; cv2.imwrite(p, img); r = sh(['tesseract', p, '-', '--psm', str(psm), 'tsv']); rows = []
    for ln in r.stdout.splitlines()[1:]:
        f = ln.split('\t')
        if len(f) == 12 and f[11].strip() and float(f[10]) >= 0: rows.append(dict(x=int(f[6]), y=int(f[7]), w=int(f[8]), h=int(f[9]), conf=float(f[10]), text=f[11].strip(), line=(f[2], f[3], f[4])))
    return rows
norm = lambda s: re.sub(r'[^a-z0-9%$.,]', '', s.lower())
tok_times, numbers, edge = {}, {}, []
cap = {}
for fn, t in zip(frames, times):
    im = cv2.imread(f'{tmp}/{fn}'); H, W = im.shape[:2]; g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    body = g[:CAP_Y[0], :]; big = cv2.resize(body, None, fx=1.0, fy=1.0)
    for r in ocr(big, 11):
        if r['conf'] < 75 or len(r['text']) < 2: continue
        if r['h'] < 24: continue  # source lines and other small print: too small for reliable OCR; checked by the lints instead
        k = norm(r['text'])
        if len(k) >= 3: tok_times.setdefault(k, []).append(t)
        if re.search(r'\d', r['text']) and r['conf'] >= 80:
            num = re.sub(r'[^\d.]', '', r['text'].replace(',', '')).strip('.')
            if num and not (len(num) == 1 and not re.search(r'[%$₹]', r['text'])): numbers.setdefault(num, []).append((t, r['text']))
        if r['x'] < 24 or r['x'] + r['w'] > W - 24 or r['y'] < 8: edge.append((t, r['text']))
        if r['y'] + r['h'] > 988: edge.append((t, r['text'] + ' (into caption band)'))
    capimg = g[CAP_Y[0]:CAP_Y[1], :]; pill = int((capimg[20:80, 300:1620] < 70).sum())  # the dark caption pill
    cap[t] = ' '.join(r['text'] for r in ocr(255 - cv2.resize(capimg, None, fx=1.5, fy=1.5), 7) if r['conf'] > 30) if pill > 3000 else ''

# ---- 3. on screen too briefly
def spans(ts, gap=0.6):
    ts = sorted(ts); out_ = []; s = p = ts[0]
    for x in ts[1:]:
        if x - p > gap: out_.append((s, p)); s = x
        p = x
    out_.append((s, p)); return out_
clusters = []  # OCR reads the same label slightly differently from frame to frame ('₹54,500' / '%54,500' / '254,500'): group near-identical readings
for k in sorted(tok_times, key=lambda k: -len(tok_times[k])):
    for c in clusters:
        if difflib.SequenceMatcher(None, k, c[0]).ratio() >= 0.8: c[1].extend(tok_times[k]); break
    else: clusters.append([k, list(tok_times[k])])
tok_times = {k: ts for k, ts in clusters}
brief = []
for k, ts in tok_times.items():
    if len(k) < 4: continue
    for s, e in spans(ts, gap=2.0):  # OCR misses a reading now and then; only a label gone for good counts
        dur = e - s + 1 / FPS_OCR; reads = sum(1 for x in ts if s <= x <= e)
        if dur < MIN_ON and reads >= 2 and s > 0.6 and e < D - 0.6: brief.append((s, dur, k))  # a single reading is OCR flicker
brief.sort()
for s, dur, k in brief[:40]: review(f'{s:6.2f} s  "{k}" readable for only {dur:.2f} s (minimum {MIN_ON} s)')
info(f'{len(brief)} brief text spans (first 40 listed)')

# ---- 4. numbers vs sources
src_txt = ''
for p in [A.factcheck, A.script, A.numbers_ok]:
    if p and os.path.exists(p): src_txt += open(p, encoding='utf-8').read() + '\n'
src_txt += ' '.join(l['text'] for l in LINES)
known = set(re.sub(r'[^\d.]', '', x.replace(',', '')).strip('.') for x in re.findall(r'\d[\d,]*\.?\d*', src_txt))
def ok_num(num, raw):
    cands = [num, num.lstrip('0')] + ([num[1:]] if len(num) > 4 and raw[:1] in '2%' else [])  # a rupee sign read as '2' or '%'
    for c in cands:
        if c in known: return True
        d = len(c.split('.')[1]) if '.' in c else 0  # on-screen rounding of a checked figure (+0.84% shown as +0.8%, $382.02 as $382)
        if re.fullmatch(r'\d+(\.\d+)?', c) and any(re.fullmatch(r'\d+\.\d+', k) and len(k.split('.')[1]) > d and round(float(k), d) == float(c) for k in known): return True
    return False
for num, hits in sorted(numbers.items(), key=lambda kv: kv[1][0][0]):
    if not ok_num(num, hits[0][1]):
        t, raw = hits[0]; review(f'{t:6.2f} s  number "{raw}" on screen is not in the fact-check/script/reviewed list')

# ---- 5. captions
words = [(w[0], w[1] - t0, w[2] - t0, l) for l in LINES for w in l.get('words', []) if t0 <= w[1] < t1]
miss, heck_cap, checked, blank = [], [], 0, 0
for t, txt in cap.items():
    spoken = [w for w in words if w[1] - 0.05 <= t <= w[2] + 0.05]
    narr = [w for w in spoken if w[3].get('who') != 'heckler' and t - (w[3]['start'] - t0) > 0.3]  # captions page over at line starts
    if narr:
        if not txt.strip(): blank += 1; continue  # no pill seen, or OCR could not read a very short caption
        checked += 1; w = narr[0][0]; toks = [norm(x) for x in txt.split()]
        if not any(difflib.SequenceMatcher(None, norm(w), x).ratio() >= 0.75 for x in toks): miss.append((t, w, txt))
    elif spoken and len([x for x in txt.split() if re.fullmatch(r"[A-Za-z']{3,}", x)]) >= 2 and not any(l['start'] - t0 - 0.1 <= t <= l['end'] - t0 + 0.35 for l in LINES if l.get('who') != 'heckler'):
        heck_cap.append((t, txt))
rate = len(miss) / max(1, checked); info(f'captions: {checked} spoken moments checked, {len(miss)} without the spoken word ({rate:.0%}); {blank} moments with no readable caption')
if blank > 0.3 * max(1, checked + blank): hard(f'no readable caption at {blank} spoken moments: captions missing?')
if rate > 0.15: hard(f'captions miss the spoken word {rate:.0%} of the time: captions may be drifting')
for t, w, txt in (miss[:12] if rate > 0.08 else []): review(f'{t:6.2f} s  spoken "{w}", caption reads "{txt}"')
for t, txt in heck_cap: hard(f'{t:6.2f} s  caption shown while only the Heckler speaks: "{txt}"')

# ---- 6. layout
seen = set()
for t, txt in edge:
    if txt not in seen: seen.add(txt); review(f'{t:6.2f} s  text at the frame edge: "{txt}"')

# ---- 7. silence, static picture, loudness
r = sh(['ffmpeg', '-v', 'info', '-i', A.mp4, '-map', '0:a', '-af', 'silencedetect=n=-35dB:d=1.0', '-f', 'null', '-'])
for s_, e_ in re.findall(r'silence_start: ([\d.]+).*?silence_end: ([\d.]+)', r.stderr, re.S):
    if float(s_) > 0.3 and float(e_) < D - 0.3: review(f'{float(s_):6.2f} s  silent gap of {float(e_) - float(s_):.1f} s')
r = sh(['ffmpeg', '-v', 'info', '-i', A.mp4, '-map', '0:a', '-af', 'ebur128=peak=true:framelog=quiet', '-f', 'null', '-'])
I = re.findall(r'I:\s+(-?[\d.]+) LUFS', r.stderr); P = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r.stderr)
if I: info(f'loudness {I[-1]} LUFS, true peak {P[-1] if P else "?"} dBFS')
if I and abs(float(I[-1]) + 16) > 1.5: review(f'loudness {I[-1]} LUFS (target -16)')
if P and float(P[-1]) > -1.0: review(f'true peak {P[-1]} dBFS (limit -1)')
small = subprocess.run(['ffmpeg', '-v', 'error', '-i', A.mp4, '-vf', 'fps=10,scale=192:108,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
fr = np.frombuffer(small, dtype=np.uint8).reshape(-1, 108, 192).astype(np.float32)[:, :int(108 * CAP_Y[0] / 1080), :]
hh, ww = fr.shape[1] // 8 * 8, 192; cells = np.abs(np.diff(fr[:, :hh, :ww], axis=0)).reshape(len(fr) - 1, 8, hh // 8, 12, ww // 12).mean(axis=(2, 4))
dif = cells.max(axis=(1, 2)); base = float(np.median(dif)); thr = max(base * 3, 1.5)  # a change anywhere on screen (one cell of a 12 x 8 grid) counts
ch = np.where(dif > thr)[0] / 10.0
last = 0.0
for c in list(ch) + [D]:
    if c - last >= 6.0: review(f'{last:6.2f} s  picture barely changes for {c - last:.1f} s (pace rule: 6 s)')
    last = c

# ---- 8. pace
rates = []
for l in LINES:
    if l.get('who') == 'heckler' or not (t0 <= l['start'] < t1): continue
    nw = len(l['text'].split())
    if nw >= 5: rates.append((nw / max(0.1, l['end'] - l['start']), l))
if rates:
    med = float(np.median([x for x, _ in rates])); info(f'narration median pace {med:.2f} words/s')
    for x, l in rates:
        if x > 4.3 or x < 2.0 or abs(x - med) / med > 0.35: review(f"{l['start'] - t0:6.2f} s  {l['id']} at {x:.2f} words/s (median {med:.2f}): rushed, dragged or stretched?")

# ---- 9. picture changes far from any word
starts = np.array([w[1] for w in words] + [l['start'] - t0 for l in LINES] + [l['end'] - t0 for l in LINES])
events = []; prev = -9
for c in ch:
    if c - prev > 0.3: events.append(c)
    prev = c
far = [c for c in events if len(starts) and np.min(np.abs(starts - c)) > 0.6]
info(f'{len(events)} picture changes, {len(far)} more than 0.6 s from any spoken word')
for c in far[:15]: review(f'{c:6.2f} s  picture change not near any spoken word (cue drift?)')

# ---- report
for f in os.listdir(tmp): os.remove(f'{tmp}/{f}')
os.rmdir(tmp)
md = [f'# AV check: {os.path.basename(A.mp4)}', '', f'Clip starts at {t0:.2f} s of the timeline. **{len(R["hard"])} hard, {len(R["review"])} to review.**', '']
for k, title in [('hard', 'Hard faults (fix before sending)'), ('review', 'To review'), ('info', 'Measurements')]:
    md += [f'## {title}', ''] + [f'- {m}' for m in R[k]] + (['- none'] if not R[k] else []) + ['']
open(f'{out}/report.md', 'w').write('\n'.join(md)); json.dump(R, open(f'{out}/report.json', 'w'), indent=1)
print(f'{os.path.basename(A.mp4)}: {len(R["hard"])} hard, {len(R["review"])} review -> {out}/report.md'); sys.exit(1 if R['hard'] else 0)
