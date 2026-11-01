"""Word-level timings for Kokoro narration clips (for burnt-in captions and a YouTube .srt).
Usage: KOKORO_DIR=... SPEED=1.1 align.py slides.json vo_dir voice_id out.json [slide numbers...]
Re-synthesises each text segment exactly as synth.py does (Kokoro on CPU is deterministic), so segment starts are exact;
inside a segment, word times are spread by phoneme count (+ punctuation weight) and snapped to nearby energy dips in the
real clip. Accuracy is roughly +/-0.1 s, fine for phrase captions and word highlights. Checks each rebuilt length against the clip."""
import sys, os, re, json, subprocess
import numpy as np
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import synth
from g2p import phonemize
SR = synth.SR

def load_mp3(p):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', p, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

def words_of(seg):
    out = []
    for w in seg.split():
        emph = '*' in w
        clean = w.replace('*', '')
        if re.search(r'[A-Za-z0-9]', clean): out.append({'w': clean, 'emph': emph})
    return out

def weight(w):
    ph, _ = phonemize(re.sub(r'[^A-Za-z\'’\- ]', ' ', w) or 'a')
    n = len([c for c in ph if c.strip()])
    if re.search(r'[,;:—]$', w): n += 3          # short breath after commas
    if re.search(r'[.?!…]$', w): n += 5
    return max(1, n)

def snap(t, env, hop, rad=0.12):
    i = int(t / hop); r = int(rad / hop)
    lo, hi = max(0, i - r), min(len(env) - 1, i + r)
    if hi <= lo: return t
    j = lo + int(np.argmin(env[lo:hi + 1] + 0.002 * np.abs(np.arange(lo, hi + 1) - i)))
    return j * hop

def align(d, vo_dir, voice, speed):
    marked = ' '.join(d['vo_marked'])
    parts = synth.parse(' '.join(d['vo_marked']).replace('*', '\u2217'))   # keep emphasis marks for captions
    real = load_mp3(f"{vo_dir}/VO-{d['n']:02d}.mp3")
    hop = 0.01; h = int(hop * SR)
    env = np.array([np.sqrt(np.mean(real[i:i + h] ** 2)) for i in range(0, len(real) - h, h)])
    t = 0.15; words = []
    for part in parts:
        if part[0] == 's': t += int(part[1] * SR) / SR; continue
        v, who = part[1].replace('\u2217', '*'), part[2]
        a, _ = synth.tts(v.replace('*', '').strip(), synth.voice_for(who, voice), speed); a = synth.trim(a)
        L = len(a) / SR; ws = words_of(v)
        wt = np.array([weight(x['w']) for x in ws], float); cum = np.concatenate([[0], np.cumsum(wt)]) / wt.sum()
        bounds = [t + c * L for c in cum]
        sn = [bounds[0]]
        for k in range(1, len(bounds) - 1):       # snap, but keep every word at least 60 ms long and in order
            lo = sn[-1] + 0.06; hi = bounds[-1] - 0.06 * (len(bounds) - 1 - k)
            sn.append(min(max(snap(bounds[k], env, hop), lo), max(lo, hi)))
        bounds = sn + [bounds[-1]]
        for k, x in enumerate(ws):
            words.append({**x, 's': round(bounds[k], 3), 'e': round(max(bounds[k + 1], bounds[k] + 0.05), 3), **({'who': 'viewer'} if who == 'viewer' else {})})
        t += L + int(0.12 * SR) / SR
    t += 0.25
    return words, round(t, 2), round(len(real) / SR, 2)

if __name__ == '__main__':
    slides = json.load(open(sys.argv[1])); vo_dir, voice, out = sys.argv[2], sys.argv[3], sys.argv[4]
    want = set(int(x) for x in sys.argv[5:]); speed = float(os.environ.get('SPEED', '1.1'))
    res = json.load(open(out)) if (want and os.path.exists(out)) else {}
    for d in slides:
        if want and d['n'] not in want: continue
        w, rebuilt, actual = align(d, vo_dir, voice, speed)
        res[str(d['n'])] = w
        print(f"VO-{d['n']:02d}: {len(w)} words, rebuilt {rebuilt}s vs clip {actual}s {'OK' if abs(rebuilt - actual) < 0.08 else 'MISMATCH'}", flush=True)
    json.dump(res, open(out, 'w'))
