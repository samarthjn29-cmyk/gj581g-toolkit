#!/usr/bin/env python3
"""The act's raw sound (narration + sound cues, no music bed) straight from the act file, without a Remotion render
(Sam, 24 Nov 2026: workflow idea 3, "Do 1,2,3 and 6"). It does what Episode.tsx <Sound> does: each cue starts on its
frame (round(atSec * 30)), plays its file (cue.file or the registry's first path) at volumeDb, with optional frame-wise
linear fades (fadeInSec; fadeOutSec only when endSec is set), cut at endSec, and everything stops at the act's last
frame. Every video in the library is muted, so this is the whole raw track. Output: 48 kHz stereo s16 WAV, the same
format a `--codec=wav` render gives; mix-act-bed.py then adds the bed.
usage: act-audio.py ACT.json OUT.wav [--check REMOTION.wav]   (--check: null test against a Remotion audio render)"""
import json, os, subprocess, sys
import numpy as np

FPS, SR = 30, 48000
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.dirname(HERE)
args = sys.argv[1:]
check = None
if "--check" in args:
    i = args.index("--check")
    check = args[i + 1]
    del args[i:i + 2]
act_path, out = args
act = json.load(open(act_path))
reg = json.load(open(os.path.join(LIB, "src", "registry", "registry.json")))["assets"]
frames = max(1, round(max(b["end"] for b in act["beats"]) * FPS))
n = round(frames * SR / FPS)
mix = np.zeros((n, 2), np.float64)


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


cache = {}
cues = ([act["voice"]] if act.get("voice") else []) + act.get("audio", [])
for c in cues:
    e = reg.get(c["id"])
    if not e or e["status"] != "Active":
        raise SystemExit(f"{c['id']}: not an Active registry asset")
    p = c.get("file") or e["paths"][0]
    if p not in e["paths"] and not any(x.endswith("/") and p.startswith(x) for x in e["paths"]):
        raise SystemExit(f"{p} is not listed under {c['id']}")
    if p not in cache:
        cache[p] = decode(os.path.join(LIB, p))
    a = cache[p]
    f0 = round(c["atSec"] * FPS)
    s0 = round(f0 * SR / FPS)
    dur_f = round(c["endSec"] * FPS) - f0 if c.get("endSec") is not None else None
    if dur_f is not None:
        a = a[: round(dur_f * SR / FPS)]
    a = a[: max(0, n - s0)]
    g = np.full(len(a), 10 ** ((c.get("volumeDb") or 0) / 20))
    t_f = np.arange(len(a)) * FPS / SR  # position in frames, as Remotion's volume(f) sees it (per frame)
    fr = np.floor(t_f)
    fi = round((c.get("fadeInSec") or 0) * FPS)
    fo = round((c.get("fadeOutSec") or 0) * FPS)
    if fi > 0:
        g *= np.clip(fr / fi, 0, 1)
    if fo > 0 and dur_f is not None:
        g *= np.clip((dur_f - fr) / fo, 0, 1)
    mix[s0:s0 + len(a)] += a * g[:, None]

pcm = np.clip(np.round(mix * 32767), -32768, 32767).astype("<i2")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", out],
               input=pcm.tobytes(), check=True)
print(f"{out}: {frames / FPS:.3f} s, {len(cues)} cues, peak {20 * np.log10(np.abs(mix).max() + 1e-12):.1f} dBFS")
if check:
    ref = decode(check)
    m = min(len(ref), len(mix))
    d = mix[:m] - ref[:m]
    rms = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
    print(f"null test vs {check}: signal {rms(ref[:m]):.1f} dBFS, difference {rms(d):.1f} dBFS (peak {20 * np.log10(np.abs(d).max() + 1e-12):.1f})")
