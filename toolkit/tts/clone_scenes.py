# Voice each scene as one passage in Sam's clone (more natural than line by line: the intonation carries across sentences),
# with a word check, a speaker check, breaths kept and natural sentence pauses (Sam, 2 Nov 2026: line-by-line sounded fake).
# Lines marked "tight": true must be one continuous phrase (no pause inside; e.g. "Sixty-four percent said Barbara").
# Resumable; one process per scene (memory). Settings from env: EXAG, CFG, TEMP (defaults 0.5 / 0.5 / 0.8 = Chatterbox's own).
# Usage: cbx/bin/python3 clone_scenes.py script.json ref.wav outdir [scene ...]   -> outdir/<scene>.wav + log.json
import sys, os, re, json, difflib, numpy as np, soundfile as sf, torch, librosa
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from clone_all import trim, squeeze_gaps
from chatterbox.tts import ChatterboxTTS
from faster_whisper import WhisperModel
from num2words import num2words
S = json.load(open(sys.argv[1])); ref, out = sys.argv[2], sys.argv[3]; want = set(sys.argv[4:]); os.makedirs(out, exist_ok=True)
EXAG, CFG, TEMP = (float(os.environ.get(k, d)) for k, d in (('EXAG', '0.5'), ('CFG', '0.5'), ('TEMP', '0.8')))
TRIES = int(os.environ.get('TRIES', '6')); OKR, OKS = 0.93, 0.80
ALIAS = {'anne': 'ann', 'barbra': 'barbara', 'babra': 'barbara', 'rays': 'raise'}
def toks(s):
    s = s.lower().replace('%', ' percent ').replace('’', "'").replace('pay slip', 'payslip').replace('pay-slip', 'payslip')
    s = re.sub(r"(\d+)s\b", lambda x: num2words(int(x.group(1))) + 's', s)
    s = re.sub(r'\d+', lambda x: num2words(int(x.group()), to='year') if len(x.group()) == 4 else num2words(int(x.group())), s)
    return [ALIAS.get(w, w) for w in re.sub(r"[^a-z' ]", ' ', s.replace('-', ' ')).split()]
m = ChatterboxTTS.from_pretrained(device='cpu'); sr = m.sr; m.prepare_conditionals(ref, exaggeration=EXAG)
ref_emb = m.ve.embeds_from_wavs([librosa.load(ref, sr=16000)[0]], sample_rate=16000, as_spk=True)
wm = WhisperModel('small.en', device='cpu', compute_type='int8')
def gaps(a, db=-38, min_s=0.12):
    F = int(sr * 0.01); e = 20 * np.log10(np.array([np.sqrt(np.mean(a[i*F:(i+1)*F]**2) + 1e-12) for i in range(len(a) // F)]))
    q = e < e.max() + db; res, i = [], 0
    while i < len(q):
        if q[i]:
            j = i
            while j < len(q) and q[j]: j += 1
            if i > 0 and j < len(q) and (j - i) / 100 > min_s: res.append((i / 100, j / 100))
            i = j
        else: i += 1
    return res
lj = f'{out}/log.json'; log = json.load(open(lj)) if os.path.exists(lj) else {}
scenes = list(dict.fromkeys(l['scene'] for l in S))
for si, sc in enumerate(scenes):
    if (want and sc not in want) or (not want and log.get(sc, {}).get('ok')): continue
    L = [l for l in S if l['scene'] == sc]; text = ' '.join(l.get('say', l['text']) for l in L); exp = toks(text)
    tight = [toks(l.get('say', l['text'])) for l in L if l.get('tight')]
    must = [toks(x) for l in L for x in l.get('must', [])]  # meaning-carrying phrases that must be heard exactly (e.g. "pay slip")
    best = None
    for k in range(TRIES):
        torch.manual_seed(7000 + si * 61 + k * 97 + int(os.environ.get('SEED_OFFSET', '0')))
        w = m.generate(text, exaggeration=EXAG, cfg_weight=CFG, temperature=TEMP)
        a = squeeze_gaps(trim(w.squeeze(0).cpu().numpy().astype(np.float64), sr), sr, maxgap=0.40, keep=0.30)
        segs, _ = wm.transcribe(librosa.resample(a.astype(np.float32), orig_sr=sr, target_sr=16000), language='en', word_timestamps=True); segs = list(segs)  # a generator: read it once
        h = ' '.join(s_.text.strip() for s_ in segs); H = [(tk, w_.start, w_.end) for s_ in segs for w_ in s_.words for tk in toks(w_.word)]
        r = difflib.SequenceMatcher(None, exp, [x[0] for x in H], autojunk=False).ratio()
        s = float(m.ve.voice_similarity(m.ve.embeds_from_wavs([librosa.resample(a.astype(np.float32), orig_sr=sr, target_sr=16000)], sample_rate=16000, as_spk=True), ref_emb))
        ok_t = True
        for tt in tight:  # find the tight phrase in the heard words and reject any pause inside it
            hw = [x[0] for x in H]
            for j in range(len(hw) - len(tt) + 1):
                if hw[j:j + len(tt)] == tt:
                    t_a, t_b = H[j][1], H[j + len(tt) - 1][2]
                    if any(t_a + 0.05 < g0 and g1 < t_b - 0.05 for g0, g1 in gaps(a, min_s=0.10)): ok_t = False
        hw_all = [x[0] for x in H]
        ok_m = all(any(hw_all[j:j + len(mm)] == mm for j in range(len(hw_all))) for mm in must)
        ok_t = ok_t and ok_m
        score = r + 0.5 * s + (0.3 if ok_t else 0)
        print(f"{sc} try {k}: words {r:.2f} sim {s:.2f}{'' if ok_t else (' MISSING-MUST' if not ok_m else ' PAUSE-IN-TIGHT')} | {h}", flush=True)
        if best is None or score > best[0]: best = (score, a, h, r, s, ok_t)
        if r >= OKR and s >= OKS and ok_t: break
    _, a, h, r, s, ok_t = best
    sf.write(f'{out}/{sc}.wav', a, sr)  # breaths kept (Sam: removing them made it sound fake)
    log[sc] = dict(heard=h, words=round(r, 3), sim=round(s, 3), tight_ok=ok_t, ok=bool(r >= OKR and s >= OKS and ok_t)); json.dump(log, open(lj, 'w'), indent=1)
print('DONE', sum(v['ok'] for v in log.values()), '/', len(scenes), 'scenes passing')
