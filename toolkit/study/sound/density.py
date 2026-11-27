#!/usr/bin/env python3
"""Small-sound density study (27 Nov 2026). Per captured passage: demucs (voice / rest), then on the rest stem:
  - transients: isolated short bursts (attack < 80 ms) standing >= THR dB over the local 1.5 s median of the 1.5-10 kHz envelope;
    counted per minute, split into 'in a pause' / 'under speech'; each with its level against the voice median and its
    spectral centroid (brightness). 'off-grid' = not within 45 ms of the passage's quarter-beat grid (likely effects, not drums).
  - texture floor: in voice pauses of >= 0.35 s, the rest stem's 4-12 kHz level against the voice median, and the spectral
    flatness of that band (near 1 = noise-like hiss / room tone, near 0 = tonal).
  - rest-vs-voice level under speech and in pauses.
The rest stem holds music + effects + location sound together; the numbers say so.
Usage: density.py FILE.(webm|wav) START_SEC RATE [OUT_DIR]   (RATE 2 for the browser captures, 1 for a real-time wav)
Writes OUT_DIR/density/<name>.json and prints one summary line."""
import sys, os, json, subprocess
import numpy as np, librosa, soundfile as sf

path, start, rate = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
out = sys.argv[4] if len(sys.argv) > 4 else "."
name = os.path.basename(path).rsplit(".", 1)[0]
os.makedirs(f"{out}/sep", exist_ok=True); os.makedirs(f"{out}/density", exist_ok=True)
wav = f"{out}/sep/{name}.wav"
if not os.path.exists(wav):
    af = f"asetrate={int(48000 / rate)},aresample=44100" if rate != 1 else "aresample=44100"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", path, "-af", af, "-ac", "2", wav], check=True)
dd = f"{out}/sep/out/htdemucs/{name}"
if not os.path.exists(f"{dd}/no_vocals.wav"):
    subprocess.run(["python3", "-m", "demucs", "--two-stems", "vocals", "-n", "htdemucs", "-j", "2", "-o", f"{out}/sep/out", wav],
                   check=True, capture_output=True)
SR = 22050; HOP = 256  # 11.6 ms
rest, _ = librosa.load(f"{dd}/no_vocals.wav", sr=SR, mono=True)
voc, _ = librosa.load(f"{dd}/vocals.wav", sr=SR, mono=True)
n = min(len(rest), len(voc)); rest, voc = rest[:n], voc[:n]
dur = n / SR
fps = SR / HOP
db = lambda x: 20 * np.log10(np.maximum(x, 1e-9))

# --- voice activity and the voice reference level (50 ms blocks) ---------------------------------------------
vr = librosa.feature.rms(y=voc, frame_length=1024, hop_length=HOP)[0]
vdb = db(vr)
vref = float(np.median(vdb[vdb > np.percentile(vdb, 55)]))
active = vdb > vref - 22
# close tiny holes (< 0.2 s) so a word gap is not a pause
k = int(0.2 * fps)
act = active.copy()
i = 0
while i < len(act):
    if not act[i]:
        j = i
        while j < len(act) and not act[j]: j += 1
        if j - i < k and i > 0 and j < len(act): act[i:j] = True
        i = j
    else: i += 1
pause = ~act
# a pause core: drop 0.1 s at each edge so voice tails do not count
pc = pause.copy(); e = int(0.1 * fps)
from scipy.ndimage import binary_erosion
pc = binary_erosion(pause, iterations=e)
pc_long = pc.copy()
# keep only runs >= 0.35 s
runs = []; i = 0
while i < len(pc):
    if pc[i]:
        j = i
        while j < len(pc) and pc[j]: j += 1
        if j - i >= 0.35 * fps: runs.append((i, j))
        i = j
    else: i += 1
pcl = np.zeros(len(pc), bool)
for a, b in runs: pcl[a:b] = True

# --- rest level ---------------------------------------------------------------------------------------------
rr = librosa.feature.rms(y=rest, frame_length=1024, hop_length=HOP)[0]
rdb = db(rr)
m = min(len(rdb), len(vdb)); rdb, vdb, act, pcl = rdb[:m], vdb[:m], act[:m], pcl[:m]
rest_speech = float(np.median(rdb[act])) - vref if act.any() else None
rest_pause = float(np.median(rdb[pcl])) - vref if pcl.any() else None

# --- texture floor in pauses: 4-12 kHz band level and flatness ----------------------------------------------
S = np.abs(librosa.stft(rest, n_fft=2048, hop_length=HOP))
f = librosa.fft_frequencies(sr=SR, n_fft=2048)
hb = (f >= 4000) & (f <= 10500)
band = db(np.sqrt((S[hb] ** 2).mean(0)))[:m]
flat = librosa.feature.spectral_flatness(S=S[hb])[0][:m]
tex_level = float(np.median(band[pcl])) - vref if pcl.any() else None
tex_flat = float(np.median(flat[pcl])) if pcl.any() else None
speech_band = float(np.median(band[act])) - vref if act.any() else None

# --- transients ---------------------------------------------------------------------------------------------
tb = (f >= 1500) & (f <= 10000)
env = db(np.sqrt((S[tb] ** 2).mean(0)))
env = env[:m]
sm = np.convolve(env, np.ones(3) / 3, "same")
w = int(1.5 * fps)
from scipy.ndimage import median_filter
local = median_filter(sm, size=w, mode="nearest")
exc = sm - local
THR = 9.0
cand = []
i = 2
while i < m - 2:
    if exc[i] >= THR and sm[i] >= sm[i - 1] and sm[i] >= sm[i + 1]:
        # attack: how long it took to rise from 6 dB below peak to peak
        j = i
        while j > 0 and sm[j] > sm[i] - 6 and i - j < int(0.2 * fps): j -= 1
        attack = (i - j) / fps
        if attack <= 0.08:
            cand.append(i)
        i += int(0.12 * fps)
    else:
        i += 1
cent = librosa.feature.spectral_centroid(S=S, sr=SR)[0][:m]
# quarter-beat grid
y_on = librosa.onset.onset_strength(y=rest, sr=SR, hop_length=HOP)
tempo, beats = librosa.beat.beat_track(onset_envelope=y_on, sr=SR, hop_length=HOP)
tempo = float(np.atleast_1d(tempo)[0])
bt = librosa.frames_to_time(beats, sr=SR, hop_length=HOP)
grid_ok = len(bt) > 8
if grid_ok:
    per = np.median(np.diff(bt)) / 4
    off = lambda t: min(abs(((t - bt[0]) / per) - round((t - bt[0]) / per)) * per, 1)
events = []
for i in cand:
    t = i / fps
    lvl = float(np.max(rdb[max(0, i - 2): i + 3])) - vref
    ev = dict(t=round(start + t, 2), level_vs_voice=round(lvl, 1), centroid=int(np.mean(cent[i:i + 6])), in_pause=bool(pcl[i]),
              under_speech=bool(act[i]), excess_db=round(float(exc[i]), 1),
              off_grid=bool(grid_ok and off(t) > 0.045))
    events.append(ev)
mins = dur / 60
res = dict(name=name, start=start, dur=round(dur, 1), voice_ref_db=round(vref, 1),
           rest_minus_voice_speech=None if rest_speech is None else round(rest_speech, 1),
           rest_minus_voice_pause=None if rest_pause is None else round(rest_pause, 1),
           pause_s=round(float(pcl.sum() / fps), 1), pause_runs=len(runs),
           texture_4_10k_vs_voice_in_pauses=None if tex_level is None else round(tex_level, 1),
           texture_flatness=None if tex_flat is None else round(tex_flat, 3),
           highband_vs_voice_in_speech=None if speech_band is None else round(speech_band, 1),
           tempo=round(tempo, 1), n_transients=len(events), per_min=round(len(events) / mins, 1),
           per_min_off_grid=round(sum(e["off_grid"] for e in events) / mins, 1),
           in_pause=sum(e["in_pause"] for e in events), under_speech=sum(e["under_speech"] for e in events),
           median_level_vs_voice=round(float(np.median([e["level_vs_voice"] for e in events])), 1) if events else None,
           median_centroid=int(np.median([e["centroid"] for e in events])) if events else None, events=events)
json.dump(res, open(f"{out}/density/{name}.json", "w"), indent=1)
print(f"{name}: {res['dur']}s voice {res['voice_ref_db']} | rest-voice speech {res['rest_minus_voice_speech']} pause {res['rest_minus_voice_pause']} | "
      f"transients {res['n_transients']} ({res['per_min']}/min, off-grid {res['per_min_off_grid']}/min; pause {res['in_pause']} speech {res['under_speech']}) "
      f"median {res['median_level_vs_voice']} dB re voice, centroid {res['median_centroid']} Hz | texture 4-10k {res['texture_4_10k_vs_voice_in_pauses']} flat {res['texture_flatness']}")
