"""Silence quiet non-speech stretches (breaths, mouth noise) between words.
Usage: debreath.py in.wav out.wav [rel_db=-25] [min_ms=90]
Frames 20 ms; speech level = 95th percentile RMS; runs of frames below speech+rel_db lasting >= min_ms
are faded to silence (15 ms fades). Short dips inside words are left alone."""
import sys, numpy as np, soundfile as sf
inp, out = sys.argv[1], sys.argv[2]
rel = float(sys.argv[3]) if len(sys.argv) > 3 else -25; mn = float(sys.argv[4]) if len(sys.argv) > 4 else 90
x, sr = sf.read(inp); mono = x if x.ndim == 1 else x.mean(1)
F = int(sr * 0.02); n = len(mono) // F
rms = np.array([np.sqrt(np.mean(mono[i*F:(i+1)*F]**2) + 1e-12) for i in range(n)]); db = 20*np.log10(rms)
thr = np.percentile(db, 95) + rel; quiet = db < thr
g = np.ones(len(mono)); i = 0; cut = 0
while i < n:
    if quiet[i]:
        j = i
        while j < n and quiet[j]: j += 1
        if (j - i) * 20 >= mn:
            a, b = i*F + int(0.01*sr), j*F - int(0.01*sr)   # keep 10 ms edges of the words
            if b > a:
                fd = int(0.015*sr); g[a:b] = 0
                g[max(0,a-fd):a] = np.minimum(g[max(0,a-fd):a], np.linspace(1,0,a-max(0,a-fd)))
                g[b:b+fd] = np.minimum(g[b:b+fd], np.linspace(0,1,len(g[b:b+fd])))
                cut += (b-a)/sr
        i = j
    else: i += 1
y = (x * g[:, None]) if x.ndim > 1 else x * g
sf.write(out, y, sr); print(f'{out}: silenced {cut:.2f}s, threshold {thr:.1f} dB')
