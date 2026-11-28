#!/usr/bin/env python3
"""V2.2 act 2 raw sound (28 Nov 2026: small sounds audible, +3 dB, ticks low-passed at 5 kHz instead of 3.2 kHz; study 2 option B) (27 Nov 2026 evening, Sam: "Keep the original one and make the changes").
Voice untouched. Sound effects: a gentle high cut (low-pass 7 kHz) on all of them; the dot-grid ticks rebuilt as one
soft muffled tick per dot, on each dot's light-up time (ScaleField: litAtSec + k*step); pen strokes on three hero
highlights in the book page; a paper room tone under the whole act at -44 LUFS (not ducked).
Writes out/v22_raw_sound.wav (voice + SFX + room tone) and out/v22_stand_in.mov (v3 picture + that sound)."""
import json, copy, subprocess, os
import numpy as np, soundfile as sf

LIB = "/home/claude/gj581g-toolkit/toolkit/library"
O = "/home/claude/bedtest/out"
SR = 48000
act = json.load(open(f"{LIB}/src/episodes/ep01-act02-v2.json"))


def peak_db(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", f"{LIB}/{path}", "-af", "volumedetect", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    return float(r.split("max_volume:")[1].split("dB")[0])


# --- dot ticks: replace the dot-lighting ticks with one tick per dot -----------------------------------------
sf_beat = [b for b in act["beats"] if b.get("component") == "ScaleField"][0]
light_times = set()
ticks = []
TICK_PEAK = -24.0  # dBFS before the muffle; voice peaks about -2 to -4
files = ["public/sfx/kit/mechanical/stopwatch_tick_v1.wav", "public/sfx/kit/mechanical/stopwatch_tick_v2.wav",
         "public/sfx/kit/mechanical/stopwatch_tick_v3.wav"]
pk = {f: peak_db(f) for f in files}
for ph in sf_beat["props"]["phases"]:
    t0 = sf_beat["start"] + ph["litAtSec"]
    light_times.add(round(t0, 2))
    step = min(0.12, max(0.06, 0.9 / max(1, ph["lit"])))
    for k in range(ph["lit"]):
        f = files[k % 3]
        ticks.append({"id": "SFX-018", "file": f, "atSec": round(t0 + k * step, 3), "volumeDb": round(TICK_PEAK - pk[f], 1)})
sfx = []
for c in act["audio"]:
    if c["id"] == "SFX-018" and round(c["atSec"], 2) in light_times:
        continue  # the old ticker run / single tick on the dots
    sfx.append(c)

# --- pen strokes on the hero highlights (SFX-017) ------------------------------------------------------------
page = [b for b in act["beats"] if b.get("component") == "SourcePageStory"][0]
HERO = [8.38, 11.54, 28.1]  # 'sensible dark colour' line, 'a bluish dark drab' (quote), the neighbours' verdict box
for m in page["props"]["marks"]:
    if any(abs(m["atSec"] - h) < 0.01 for h in HERO):
        f = "public/sfx/kit/tactile/marker_stroke.wav" if m.get("kind") != "line" else "public/sfx/kit/tactile/pencil_stroke.wav"
        sfx.append({"id": "SFX-017", "file": f, "atSec": round(page["start"] + m["atSec"], 3),
                    "volumeDb": round(-21.0 - peak_db(f), 1)})


def render(spec, name):
    p = f"{O}/{name}.json"
    json.dump(spec, open(p, "w"), indent=1)
    subprocess.run(["python3", "scripts/act-audio.py", p, f"{O}/{name}.wav"], cwd=LIB, check=True, capture_output=True)
    return sf.read(f"{O}/{name}.wav")[0]


va = copy.deepcopy(act); va["audio"] = []
sa = copy.deepcopy(act); sa.pop("voice"); sa["audio"] = sfx
ta = copy.deepcopy(act); ta.pop("voice"); ta["audio"] = ticks
voice = render(va, "v22_voice")
for name, spec, lp in (("v22_sfx", sa, "lowpass=f=7000,lowpass=f=7000"), ("v22_ticks", ta, "lowpass=f=5000,lowpass=f=5000")):
    render(spec, name)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{O}/{name}.wav", "-af", lp, "-c:a", "pcm_f32le", f"{O}/{name}_lp.wav"], check=True)
sfxs = sf.read(f"{O}/v22_sfx_lp.wav")[0]
tks = sf.read(f"{O}/v22_ticks_lp.wav")[0]

# --- room tone: Pixabay quiet room (SFX-028), looped with 1 s crossfades, -44 LUFS ---------------------------
rt_raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{LIB}/public/sfx/kit/pixabay/room_tone_quiet.wav", "-f", "f32le",
                         "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
rt = np.frombuffer(rt_raw, np.float32).reshape(-1, 2).astype(np.float64)
n = len(voice); xf = SR
loop = rt.copy()
ramp = np.linspace(0, 1, xf)[:, None]
while len(loop) < n + xf:
    loop = np.concatenate([loop[:-xf], loop[-xf:] * (1 - ramp) + rt[:xf] * ramp, rt[xf:]])
loop = loop[:n]
fi = int(0.5 * SR); loop[:fi] *= np.linspace(0, 1, fi)[:, None]; loop[-fi:] *= np.linspace(1, 0, fi)[:, None]
sf.write(f"{O}/v22_room.wav", loop, SR, subtype="FLOAT")
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", f"{O}/v22_room.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
I = float(r.split("Integrated loudness:")[1].split("I:")[1].split("LUFS")[0])
room = loop * 10 ** ((-44.0 - I) / 20)

raw = voice + sfxs[:n] + tks[:n] + room
sf.write(f"{O}/v22_raw_sound.wav", raw.astype(np.float32), SR, subtype="PCM_16")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{O}/act2_stand_in.mov", "-i", f"{O}/v22_raw_sound.wav", "-map", "0:v", "-map", "1:a",
                "-c:v", "copy", "-c:a", "pcm_s16le", f"{O}/v22_stand_in.mov"], check=True)
print(f"ticks {len(ticks)} at {sorted(light_times)}; pen strokes {[c['atSec'] for c in sfx if c['id']=='SFX-017' and c['atSec']>60]}; "
      f"room tone was {I:.1f} LUFS -> -44; peak raw {20*np.log10(np.abs(raw).max()):.1f} dBFS")
