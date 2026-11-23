#!/usr/bin/env python3
"""Render a music bed from a CUE SHEET (Johnny Harris sound study, 23 Nov 2026, options A-D and F; Sam: "Full Harris
style" for act 3). Instead of one bed at one level, an act gets 3-4 cues, each entering on the line that turns the
story, each at the level its moment needs; quiet spans drop the music under a thesis line, a quote or a punchline;
a riser can lead into a turn and the music can play alone at the act's ends. The voice is never touched.

usage: mix-cue-bed.py CUES.json OUT.wav
CUES.json:
  {"dur": 210.0,
   "cues": [{"name": "the talk", "file": "public/music/x.mp3", "from": 280.2, "at": 0, "until": 51.0,
             "fadeIn": 0.03, "fadeOut": 1.2, "lufs": -33, "filter": "dynaudnorm=f=3000:g=31"(optional),
             "levels": [[0, -26], [2.0, -26], [2.8, -33]]  (optional: act time, LUFS; linear between points)}],
   "quiet": [[A, B, -50, ramp]],      act time span where the WHOLE bed sits at that LUFS-equivalent level
                                       (relative to each cue's own level: -50 means 'cue level - (cue lufs - (-50))'),
                                       ramps inside the span, default 0.3 s
   "events": [{"file": "...wav", "at": 100.0, "lufs": -30}]}   one-shots (risers, hits) placed at act time
Levels are integrated LUFS of each cue measured over the part used, so 'lufs' is the level of that moment before the
pocket duck in mix-act-bed.py. Then: mix-act-bed.py ACT.mp4 VOICE OUT --bed OUT.wav --lufs <printed> --fade-in 0.03
--fade-out 0.03 (the cue sheet does its own fades)."""
import sys, json, subprocess
import numpy as np, soundfile as sf

SR = 48000
spec = json.load(open(sys.argv[1])); out = sys.argv[2]
dur = float(spec["dur"]); N = int(dur * SR)
bed = np.zeros((N, 2), dtype=np.float64)


def load(path, start=0.0, length=None, filt=None):
    args = ["ffmpeg", "-v", "error", "-ss", str(start), *(["-t", str(length)] if length else []), "-i", path]
    if filt:
        args += ["-af", filt]
    args += ["-f", "f32le", "-ac", "2", "-ar", str(SR), "-"]
    raw = subprocess.run(args, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)


def lufs(x):
    import pyloudnorm as pyln
    return pyln.Meter(SR).integrated_loudness(x)


def ramp_env(n, fi, fo):
    e = np.ones(n); a, b = int(fi * SR), int(fo * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if b: e[-b:] *= np.linspace(1, 0, b)
    return e


report = []
for c in spec["cues"]:
    length = c["until"] - c["at"]
    x = load(c["file"], c.get("from", 0), length, c.get("filter"))
    n = min(len(x), int(length * SR))
    if n < int(length * SR) - SR // 10:
        sys.exit(f"cue '{c['name']}': the track ends {length - n / SR:.1f} s before its 'until'")
    x = x[:n]
    L = lufs(x); g = 10 ** ((c["lufs"] - L) / 20); x = x * g
    t = c["at"] + np.arange(n) / SR
    if c.get("levels"):
        pts = np.array(c["levels"], dtype=float)
        lv = np.interp(t, pts[:, 0], pts[:, 1]); x = x * (10 ** ((lv - c["lufs"]) / 20))[:, None]
    x = x * ramp_env(n, c.get("fadeIn", 0.03), c.get("fadeOut", 0.5))[:, None]
    i0 = int(c["at"] * SR); bed[i0:i0 + n] += x[: N - i0]
    report.append((c["name"], c["file"].split("/")[-1], c["at"], c["until"], round(L, 1), c["lufs"]))

# quiet spans: the bed drops to a level relative to the cue level in force at that time
tt = np.arange(N) / SR
cue_l = np.full(N, np.nan)
for c in spec["cues"]:
    m = (tt >= c["at"]) & (tt < c["until"]); cue_l[m] = c["lufs"]
gain = np.ones(N)
for q in spec.get("quiet", []):
    a, b, lev = q[0], q[1], q[2]; r = q[3] if len(q) > 3 else 0.3
    m = (tt >= a) & (tt <= b)
    if not m.any():
        continue
    base = np.nanmedian(cue_l[m]) if np.isfinite(cue_l[m]).any() else lev
    drop = 10 ** ((lev - base) / 20)
    w = np.clip(np.minimum((tt - a) / r, (b - tt) / r), 0, 1)
    gain *= 1 - (1 - drop) * w
bed *= gain[:, None]

for e in spec.get("events", []):
    x = load(e["file"]); L = lufs(x) if len(x) > SR * 0.4 else None
    if L is not None and np.isfinite(L):
        x = x * 10 ** ((e["lufs"] - L) / 20)
    else:  # short one-shot: set by peak instead (lufs field read as dBFS peak)
        x = x * 10 ** (e["lufs"] / 20) / max(np.abs(x).max(), 1e-9)
    i0 = int(e["at"] * SR); n = min(len(x), N - i0); bed[i0:i0 + n] += x[:n]
    report.append((e.get("name", "event"), e["file"].split("/")[-1], e["at"], round(e["at"] + len(x) / SR, 2), "-", e["lufs"]))

pk = np.abs(bed).max()
if pk > 0.89:
    bed *= 0.89 / pk
sf.write(out, bed.astype(np.float32), SR, subtype="FLOAT")
for r in report:
    print("  %-14s %-28s %7.2f-%-7.2f track %s LUFS -> %s" % r)
print(f"bed: {dur:.1f} s, integrated {lufs(bed):.2f} LUFS (pass this as --lufs to mix-act-bed.py), peak {20*np.log10(np.abs(bed).max()):.1f} dBFS")
