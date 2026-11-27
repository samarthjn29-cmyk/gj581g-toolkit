#!/usr/bin/env python3
"""Second step of the series-motif study: for the far repeats (>= 60 s apart) found by motif.py, check the timbre
(mean MFCC cosine on the rest stem) of both stretches, so a repeat on the same pitches AND the same sound reads as the
same figure on the same instrument, and a repeat with a different timbre reads as the figure on another instrument.
Also lists the whole-video map: which 30 s blocks contain a far repeat, and where the first and last returns fall (as a share of the video).
Usage: motif_pairs.py NAME OUT_DIR [MINGAP=60]"""
import sys, json
import numpy as np, librosa
name, out = sys.argv[1], sys.argv[2]
mingap = float(sys.argv[3]) if len(sys.argv) > 3 else 60.0
d = json.load(open(f"{out}/motif/{name}.json"))
y, SR = librosa.load(f"{out}/sep/out/htdemucs/{name}/no_vocals.wav", sr=22050, mono=True)
off = d["start"]
def mf(t, L):
    a, b = int((t - off) * SR), int((t - off + L) * SR)
    m = librosa.feature.mfcc(y=y[a:b], sr=SR, n_mfcc=13).mean(axis=1)[1:]
    return m / (np.linalg.norm(m) + 1e-9)
def desc(t, L):
    a, b = int((t - off) * SR), int((t - off + L) * SR)
    seg = y[a:b]
    h, pc = librosa.effects.hpss(seg)
    ons = len(librosa.onset.onset_detect(y=seg, sr=SR, units="time")) / max(L, 1e-6)
    cen = float(np.mean(librosa.feature.spectral_centroid(y=seg, sr=SR)))
    return {"harmonic_share": round(float(np.sum(h ** 2) / (np.sum(seg ** 2) + 1e-12)), 2), "onsets_per_s": round(ons, 2), "centroid": round(cen)}
rows = []
for a, b, L, s in d["repeats"]:
    if b - a >= mingap:
        rows.append({"first": a, "again": b, "len": L, "chroma": s, "gap": round(b - a, 1),
                     "timbre": round(float(mf(a, L) @ mf(b, L)), 2)})
rows.sort(key=lambda r: -(r["len"] * r["chroma"]))
tot = d["dur"]
blocks = sorted({int((r["again"] - off) // 30) * 30 + off for r in rows})
for r in rows[:4]:
    r["sound"] = desc(r["first"], r["len"])
res = {"name": name, "far_pairs": len(rows), "top": rows[:10],
       "blocks_with_return": blocks, "share_same_timbre": round(float(np.mean([r["timbre"] >= 0.9 for r in rows])), 2) if rows else None,
       "first_return": min([r["again"] for r in rows] or [0]), "last_return": max([r["again"] for r in rows] or [0])}
json.dump(res, open(f"{out}/motif/{name}_pairs.json", "w"), indent=1)
print(f"{name}: far pairs {len(rows)} | same-timbre share {res['share_same_timbre']} | returns fall in blocks {[int(b) for b in blocks][:14]} | "
      f"top: " + "; ".join(f"{r['first']:.0f}->{r['again']:.0f} ({r['len']:.0f}s, timbre {r['timbre']})" for r in rows[:4]))
