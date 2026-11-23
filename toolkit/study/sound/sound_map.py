"""Per captured segment: real-time wav -> demucs (voice / rest) -> words on the voice, music features on the rest,
a spectrogram picture, and a compact text map. Usage: process.py FILE.webm VIDEO_START RATE"""
import sys, os, json, subprocess, numpy as np, librosa, soundfile as sf
import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
path, start, rate = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
name = os.path.basename(path).replace(".webm", "")
os.makedirs("sep", exist_ok=True); os.makedirs("maps", exist_ok=True)
wav = f"sep/{name}.wav"
subprocess.run(["ffmpeg","-y","-v","error","-i",path,"-af",f"asetrate={int(48000/rate)},aresample=44100","-ac","2",wav], check=True)
if not os.path.exists(f"sep/out/htdemucs/{name}/no_vocals.wav"):
    subprocess.run(["python3","-m","demucs","--two-stems","vocals","-n","htdemucs","-j","2","-o","sep/out",wav], check=True, capture_output=True)
mus, sr = librosa.load(f"sep/out/htdemucs/{name}/no_vocals.wav", sr=22050, mono=True)
voc, _ = librosa.load(f"sep/out/htdemucs/{name}/vocals.wav", sr=16000, mono=True)
from faster_whisper import WhisperModel
M = WhisperModel("small.en", compute_type="int8")
segs, _ = M.transcribe(voc, language="en", word_timestamps=True)
words = [(round(w.start,2), round(w.end,2), w.word.strip()) for s in segs for w in s.words]
dur = len(mus)/sr; hop = 512
S = np.abs(librosa.stft(mus, n_fft=2048, hop_length=hop)); f = librosa.fft_frequencies(sr=sr, n_fft=2048)
fr = lambda t: int(t*sr/hop)
rmsm = 20*np.log10(librosa.feature.rms(S=S)[0]+1e-9)
vr = 20*np.log10(librosa.feature.rms(y=voc, hop_length=int(hop*16000/sr))[0]+1e-9)
cent = librosa.feature.spectral_centroid(S=S, sr=sr)[0]
H, P = librosa.decompose.hpss(S)
pr = (P**2).sum(0)/((H**2).sum(0)+(P**2).sum(0)+1e-12)
sub = 10*np.log10((S[f<60]**2).sum(0)+1e-10)
on = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S), sr=sr, hop_length=hop)
maj = np.array([6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88]); mnr = np.array([6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.17])
N = "C C# D D# E F F# G G# A A# B".split()
chroma = librosa.feature.chroma_cqt(y=librosa.effects.harmonic(mus), sr=sr, hop_length=hop)
def key(a,b):
    c = chroma[:, fr(a):fr(b)].mean(1)
    if c.sum() < 1e-6: return "-"
    sc = [(np.corrcoef(np.roll(maj,k),c)[0,1], N[k]) for k in range(12)] + [(np.corrcoef(np.roll(mnr,k),c)[0,1], N[k]+"m") for k in range(12)]
    s = max(sc); return f"{s[1]}" if s[0] > 0.5 else f"({s[1]}?)"
vmed = np.median(vr[vr > np.percentile(vr, 60)])
lines = [f"== {name}: video {start:.0f}-{start+dur:.0f} s | voice median {vmed:.1f} dB | music median {np.median(rmsm):.1f} dB (music - voice {np.median(rmsm)-vmed:+.1f} dB)"]
# 4 s blocks
for a in np.arange(0, dur-0.5, 4.0):
    b = min(dur, a+4); i, j = fr(a), fr(b)
    bpm = 0
    w = " ".join(x[2] for x in words if a <= x[0] < b)
    lines.append(f"{start+a:7.1f} mus {rmsm[i:j].mean():5.1f} ({rmsm[i:j].mean()-vmed:+5.1f}) bright {np.median(cent[i:j]):5.0f} perc {pr[i:j].mean():.2f} sub {sub[i:j].mean():5.1f} key {key(a,b):5s} | {w[:95]}")
# events in the music stem
ev = []
g = np.convolve(rmsm, np.ones(20)/20, "same"); k = 43  # ~1 s
for i in range(k, len(g)-k, 10):
    d = g[i+k//2]-g[i-k//2]
    if d < -10: ev.append((i, f"DROP {g[i-k//2]:.0f}->{g[i+k//2]:.0f}"))
    if d > 10: ev.append((i, f"ENTRY {g[i-k//2]:.0f}->{g[i+k//2]:.0f}"))
pk = librosa.util.peak_pick(on, pre_max=20, post_max=20, pre_avg=40, post_avg=40, delta=np.percentile(on,98)-np.median(on), wait=40)
for p in pk: ev.append((p, f"HIT (sub {sub[p]:.0f}, bright {cent[p]:.0f})"))
# risers: music level climbing steadily for >2 s
for i in range(0, len(g)-fr(2.5), fr(0.5)):
    seg = g[i:i+fr(2.5)]
    if np.all(np.diff(seg[::10]) > -0.3) and seg[-1]-seg[0] > 8: ev.append((i, f"RISER {seg[0]:.0f}->{seg[-1]:.0f}"))
ev.sort(); out=[]; last=-1e9
for i, t in ev:
    if i - last > fr(0.7): out.append(f"{start+i*hop/sr:.1f} {t}"); last = i
lines.append("events: " + "; ".join(out[:45]))
# novelty: cue changes (timbre/harmony)
F = np.vstack([librosa.feature.mfcc(S=librosa.power_to_db(S**2), n_mfcc=13), chroma])
F = librosa.util.sync(F, np.arange(0, F.shape[1], fr(0.5)))
bd = librosa.segment.agglomerative(F, max(2, int(dur/12)))
lines.append("cue changes ~ " + ", ".join(f"{start+b*0.5:.0f}" for b in bd[1:]))
txt = "\n".join(lines); print(txt); open(f"maps/{name}.txt","w").write(txt)
json.dump(words, open(f"maps/{name}.words.json","w"))
# picture
fig, ax = plt.subplots(figsize=(16, 4.5), dpi=80)
mel = librosa.power_to_db(librosa.feature.melspectrogram(y=mus, sr=sr, n_mels=96, hop_length=hop), ref=np.max)
librosa.display.specshow(mel, sr=sr, hop_length=hop, x_axis="time", y_axis="mel", ax=ax, fmax=11000)
for a, b, _ in words: ax.axvspan(a, b, ymin=0.97, ymax=1.0, color="w", alpha=0.9, lw=0)
ax.set_xticks(np.arange(0, dur, 5)); ax.set_xticklabels([f"{int(start+t)}" for t in np.arange(0, dur, 5)])
ax.set_title(f"{name}: music stem (white bar on top = voice)"); fig.tight_layout(); fig.savefig(f"maps/{name}.png"); plt.close(fig)
