#!/usr/bin/env python3
"""V2.2 sampler builds (28 Nov 2026). Same cue times, level map idea, gentle duck, lifts and break as V2.1; what changes:
   PICTURE: v21 (small sounds as now) or v22 (small sounds +3 dB, ticks to 5 kHz);  BED: orig (Kevin MacLeod tracks) | aether | lumen.
usage: make_v22.py TAG v21|v22 orig|aether|lumen"""
import json, subprocess, sys, copy
sys.path.insert(0, "/home/claude/bedtest")
import make_v2 as V
import gap as G
tag, pic, bed = sys.argv[1:4]
O, LIB = V.O, V.LIB
LIFT = 3.0
NOLIFT = [(75.3, 79.95), (79.5, 84.7), (96.9, 98.6), (114.3, 115.3)]
for c in V.base["cues"]:
    if c["name"] == "3 what stays the same":
        c["from"] = round(c["from"] + 0.45, 3); c["at"] = 84.45; c["fadeIn"] = 0.25
if bed != "orig":
    f = f"/home/claude/bedtest/synth/{bed}.wav"
    for c in V.base["cues"]:
        if c["name"] in ("2 the stockings", "3 what stays the same", "4 from the inside"):
            c["file"] = f; c["from"] = c["at"]; c.pop("filter", None)


def build(level):
    spec = V.build(level)
    spans = sorted((a, b) for a, b, s in V.spans)
    for c in spec["cues"]:
        if c["name"] not in ("2 the stockings", "3 what stays the same"):
            continue
        lv = c["levels"]
        def at(t):
            for (t0, l0), (t1, l1) in zip(lv, lv[1:]):
                if t0 <= t <= t1:
                    return l0 + (l1 - l0) * (t - t0) / max(1e-6, t1 - t0)
            return lv[-1][1]
        add = []
        for (a0, b0), (a1, b1) in zip(spans, spans[1:]):
            g0, g1 = b0 + 0.05, a1 - 0.05
            if g1 - g0 < 0.45 or not (c["at"] < g0 and g1 < c["until"]):
                continue
            if any(g0 < y and x < g1 for x, y in NOLIFT):
                continue
            r = min(0.25, (g1 - g0) / 3)
            L = max(at(g0), at(g1)) + LIFT
            add += [[round(g0 + r, 2), L], [round(g1 - r, 2), L]]
        lv = sorted(lv + add, key=lambda p: p[0])
        out = []
        for p in lv:
            if out and p[0] <= out[-1][0]:
                p[0] = round(out[-1][0] + 0.01, 2)
            out.append(p)
        c["levels"] = out
    return spec


def render(spec):
    json.dump(spec, open(f"{O}/{tag}_cues.json", "w"), indent=1)
    r = subprocess.run(["python3", "scripts/mix-cue-bed.py", f"{O}/{tag}_cues.json", f"{O}/{tag}_bed.wav"], cwd=LIB, capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr[-1500:])
    lufs = [l for l in r.stdout.splitlines() if "integrated" in l][0].split("integrated")[1].split("LUFS")[0].strip()
    r = subprocess.run(["python3", "scripts/mix-act-bed.py", f"{O}/{pic}_stand_in.mov", "public/episodes/wcl-e01/02_brothers_paced_149wpm_even.wav",
                        f"{O}/{tag}_full.mp4", "--bed", f"{O}/{tag}_bed.wav", "--voice-at", "2.4", "--lufs", lufs, "--fade-in", "0.03", "--fade-out", "0.03",
                        "--break", "114.47:114.87", "--sweep", "26.37,115.06", "--bed-only", f"{O}/{tag}_bedonly.wav", "--no-pocket"],
                       cwd=LIB, capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr[-1500:])
    print(f"[{tag}] {r.stdout.strip().splitlines()[-1][-100:]}", flush=True)


level = {float(k): v for k, v in json.load(open(f"{O}/v21_levels.json")).items()}
for it in range(5):
    render(build(level))
    rows = {round(a, 2): g for a, b, vr, br, g, s in G.run(f"{O}/{tag}_bedonly.wav", 55, 142, quiet=True)}
    errs = {a: rows[round(a, 2)] - V.zone[a] for a in level}
    worst = max(abs(e) for a, e in errs.items() if a != 75.62)
    print(f"[{tag}] iter {it}: worst gap error {worst:.1f} dB", flush=True)
    if worst < 0.8: break
    for a, e in errs.items():
        level[a] += max(-12, min(12, e * 0.9))
json.dump({str(k): v for k, v in level.items()}, open(f"{O}/{tag}_levels.json", "w"), indent=1)
