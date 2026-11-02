"""Decked out Data: narration in Sam's cloned voice (Chatterbox, MIT), v2 after Sam's pilot notes (1 Nov 2026).
Usage: clone_all.py slides.json ref.wav outdir [scene numbers...]
- One steady pace for the whole video (Sam: "keep the pace same"); 'fast' scenes are only a touch livelier.
- Text is voiced in chunks of about 12-28 words (whole sentences), so the clone neither drifts on long passages
  nor wobbles on tiny prompts. No '...' joins (they caused audible stalls).
- Runs of very short sentences ("Free. Twenty dollars. A hundred.") are read as one list with commas, so they flow.
- Each chunk is trimmed of its own leading/trailing silence; pauses are then set exactly:
  between chunks 0.16 s, [beat] 0.22 s, [pause] 0.45 s, [long pause] 0.9 s.
- Speaker guard: every chunk is compared with Sam's reference by Chatterbox's voice encoder; below SIM_MIN it is
  re-voiced with other seeds and the most Sam-like take is kept.
- {viewer: ...} lines use Chatterbox's built-in default voice (a different speaker).
- Breaths silenced (debreath at -28 dB, Sam's pick), then loudness-normalised.
Writes VO-NN.mp3, durations.json ([[n, seconds, planned, []], ...]) and sim.json (per-chunk similarity)."""
import sys, os, re, json, subprocess, tempfile, time
import numpy as np, soundfile as sf, torch, librosa
sys.path.insert(0, __import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), '..', 'story'))
from vo_lib import number_runs
from chatterbox.tts import ChatterboxTTS

FAST = {'brisk', 'quickening', 'crisp', 'building', 'reveal', 'amused', 'surprised', 'conspiratorial'}
SIM_MIN = float(os.environ.get('SIM_MIN', '0.80')); TRIES = int(os.environ.get('TRIES', '3'))

def profile(energy):
    w = set(re.findall(r'[a-z]+', (energy or '').lower().split(',')[0]))
    if w & FAST: return dict(exag=0.55, cfg=0.48, tempo=1.03, kind='fast')
    return dict(exag=0.48, cfg=0.46, tempo=1.00, kind='even')

GAP = {'beat': 0.22, 'pause': 0.45, 'long pause': 0.9}
CHUNK_GAP = 0.16

def tempo(a, sr, t):
    if abs(t - 1) < 0.01: return a
    with tempfile.TemporaryDirectory() as d:
        sf.write(f'{d}/i.wav', a, sr)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{d}/i.wav', '-af', f'atempo={t:.3f}', f'{d}/o.wav'], check=True)
        return sf.read(f'{d}/o.wav')[0]

def trim(a, sr, db=-42, pad=0.03):
    F = int(sr * 0.01); n = len(a) // F
    if n < 3: return a
    e = 20 * np.log10(np.array([np.sqrt(np.mean(a[i*F:(i+1)*F]**2) + 1e-12) for i in range(n)]))
    on = np.where(e > max(db, e.max() - 45))[0]
    if not len(on): return a
    s = max(0, on[0]*F - int(pad*sr)); t = min(len(a), (on[-1]+1)*F + int(pad*sr))
    return a[s:t]

def squeeze_gaps(a, sr, maxgap=0.30, keep=0.20, db=-40):
    """Shorten any silence inside a chunk longer than maxgap s to keep s (Sam: no stalls mid-sentence)."""
    F = int(sr * 0.01); n = len(a) // F
    if n < 10: return a
    e = 20 * np.log10(np.array([np.sqrt(np.mean(a[i*F:(i+1)*F]**2) + 1e-12) for i in range(n)]))
    q = e < max(db, e.max() - 40); out = []; last = 0; i = 0
    while i < n:
        if q[i]:
            j = i
            while j < n and q[j]: j += 1
            if (j - i) * 0.01 > maxgap and i > 0 and j < n:
                cut_a = i*F + int(keep/2*sr); cut_b = j*F - int(keep/2*sr)
                out.append(a[last:cut_a]); fd = min(int(0.01*sr), len(out[-1]))
                if fd: out[-1] = out[-1].copy(); out[-1][-fd:] *= np.linspace(1, 0, fd)
                last = cut_b
            i = j
        else: i += 1
    out.append(a[last:]); return np.concatenate(out)

SPOKEN = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'spoken.json'))) if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'spoken.json')) else {}
def spoken(t):
    for k, v in SPOKEN.items():
        if not k.startswith('_'): t = t.replace(k, v)
    return t

def debreath(x, sr, rel=-28, mn=90):
    F = int(sr * 0.02); n = len(x) // F
    if n < 5: return x
    db = 20 * np.log10(np.array([np.sqrt(np.mean(x[i*F:(i+1)*F]**2) + 1e-12) for i in range(n)]))
    thr = np.percentile(db, 95) + rel; q = db < thr; g = np.ones(len(x)); i = 0; fd = int(0.015 * sr)
    while i < n:
        if q[i]:
            j = i
            while j < n and q[j]: j += 1
            if (j - i) * 20 >= mn:
                a, b = i*F + int(0.01*sr), j*F - int(0.01*sr)
                if b > a:
                    g[a:b] = 0
                    g[max(0, a-fd):a] = np.minimum(g[max(0, a-fd):a], np.linspace(1, 0, a - max(0, a-fd)))
                    g[b:b+fd] = np.minimum(g[b:b+fd], np.linspace(0, 1, len(g[b:b+fd])))
            i = j
        else: i += 1
    return x * g

def listify(text):
    """'Free. Twenty dollars. A hundred.' -> 'Free, twenty dollars, a hundred.' (runs of 1-3 word sentences)."""
    ss = re.split(r'(?<=[.!])\s+', text.strip()); out = []; run = []
    def flush():
        if len(run) >= 3:
            body = ', '.join([run[0].rstrip('.!')] + [r[0].lower() + r[1:].rstrip('.!') if not r.startswith(('I ', "I'")) else r.rstrip('.!') for r in run[1:]])
            out.append(body + '.')
        else: out.extend(run)
        run.clear()
    for s in ss:
        if len(s.split()) <= 3 and not s.endswith('?'): run.append(s)
        else: flush(); out.append(s)
    flush(); return ' '.join(o for o in out if o)

def units(text):
    """[('t', text, viewer, gap_after)] at the script's sentence and pause marks; [beat] and [pause] become exact gaps."""
    text = text.replace('*', ''); out = []
    for m in re.finditer(r'\{viewer:\s*([^}]*)\}|([^{]+)', text):
        if m.group(1) is not None: out.append(['t', m.group(1).strip(), True, CHUNK_GAP]); continue
        parts = re.split(r'\s*\[(beat|pause|long pause|hold:[0-9.]+)\]\s*', m.group(2))
        for i, ptxt in enumerate(parts):
            if i % 2 == 1:
                if out: out[-1][3] = max(out[-1][3], GAP.get(ptxt) or float(ptxt.split(':')[1]))
                continue
            for s in re.split(r'(?<=[.?!…])\s+', ptxt.strip()):
                if re.search(r'[A-Za-z]', s): out.append(['t', s, False, CHUNK_GAP])
    return out

def chunks(us, lo=12, hi=28):
    """Group consecutive narrator sentences into chunks of lo-hi words; keep the largest gap inside as a soft join."""
    res = []; cur = None
    for u in us:
        n = len(u[1].split())
        if u[2]:
            if cur: res.append(cur); cur = None
            res.append(dict(text=u[1], viewer=True, gap=u[3])); continue
        if cur and (len(cur['text'].split()) < lo or (len(cur['text'].split()) + n <= hi and cur['gap'] <= GAP['beat'])) \
           and len(cur['text'].split()) + n <= hi + 6:
            cur['text'] += ' ' + u[1]; cur['gap'] = u[3]
        else:
            if cur: res.append(cur)
            cur = dict(text=u[1], viewer=False, gap=u[3])
    if cur: res.append(cur)
    return res

if __name__ == '__main__':
    slides, ref, out = sys.argv[1], sys.argv[2], sys.argv[3]; want = {int(x) for x in sys.argv[4:]}
    os.makedirs(out, exist_ok=True)
    S = json.load(open(slides)); S = S if isinstance(S, list) else S['slides']
    m = ChatterboxTTS.from_pretrained(device='cpu'); sr = m.sr
    default_conds = m.conds
    m.prepare_conditionals(ref, exaggeration=0.5); sam_conds = m.conds
    rw, rsr = librosa.load(ref, sr=16000)
    ref_emb = m.ve.embeds_from_wavs([rw], sample_rate=16000, as_spk=True)
    def sim(a):
        a16 = librosa.resample(a.astype(np.float32), orig_sr=sr, target_sr=16000)
        return float(m.ve.voice_similarity(m.ve.embeds_from_wavs([a16], sample_rate=16000, as_spk=True), ref_emb))
    dj = f'{out}/durations.json'; rep = {r[0]: r for r in (json.load(open(dj)) if os.path.exists(dj) else [])}
    sj = f'{out}/sim.json'; simlog = json.load(open(sj)) if os.path.exists(sj) else {}
    for d in S:
        n = d['n']
        if want and n not in want: continue
        t0 = time.time(); p = profile(d.get('energy'))
        text = ' '.join(d['vo_marked']) if isinstance(d['vo_marked'], list) else d['vo_marked']
        cs = chunks(units(text)); pieces = [np.zeros(int(sr * 0.1))]; log = []
        for ci, c in enumerate(cs):
            t = spoken(listify(c['text']) if not c['viewer'] else c['text'])
            m.conds = default_conds if c['viewer'] else sam_conds
            best = None
            for k in range(1 if c['viewer'] else TRIES):
                torch.manual_seed(1000 + n * 37 + ci * 7 + k * 101 + int(os.environ.get('SEED_OFFSET', '0')))
                w = m.generate(t, exaggeration=0.5 if c['viewer'] else p['exag'], cfg_weight=0.5 if c['viewer'] else p['cfg'], temperature=0.6)
                a = squeeze_gaps(trim(w.squeeze(0).cpu().numpy().astype(np.float64), sr), sr)
                s = 1.0 if c['viewer'] else sim(a)
                if best is None or s > best[0]: best = (s, a, k)
                if s >= SIM_MIN: break
            s, a, k = best
            log.append(dict(chunk=t, sim=round(s, 3), take=k))
            tp = 1.0 if c['viewer'] else p['tempo'] * (0.98 if number_runs(t) else 1.0)
            pieces.append(tempo(a, sr, tp))
            if ci < len(cs) - 1: pieces.append(np.zeros(int(sr * c['gap'])))
        pieces.append(np.zeros(int(sr * 0.2)))
        x = debreath(np.concatenate(pieces), sr)
        with tempfile.TemporaryDirectory() as td:
            sf.write(f'{td}/v.wav', x, sr)
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{td}/v.wav', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
                            '-ar', '44100', '-b:a', '160k', f'{out}/VO-{n:02d}.mp3'], check=True)
        secs = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{out}/VO-{n:02d}.mp3'], capture_output=True, text=True).stdout)
        rep[n] = [n, round(secs, 1), d['dur'], []]; simlog[str(n)] = log
        json.dump(sorted(rep.values()), open(dj, 'w')); json.dump(simlog, open(sj, 'w'), indent=1)
        print(f"VO-{n:02d} {p['kind']:4s} {secs:5.1f}s (planned {d['dur']}s) in {time.time()-t0:.0f}s; sims {[l['sim'] for l in log]}", flush=True)
