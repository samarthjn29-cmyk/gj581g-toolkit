# Voice each script line in Sam's clone with a word check: Whisper transcript vs script, re-roll until complete
# and speaker-similar. Resumable: lines already in takes/lines/<id>.wav with a passing check are skipped.
# Usage: cbx/bin/python3 clone_lines.py script.json ref.wav outdir [line ids...]
import sys, os, json, re, subprocess, difflib, numpy as np, soundfile as sf, torch, librosa
sys.path.insert(0, '/home/claude/gj581g-toolkit/toolkit/tts')
from clone_all import trim, squeeze_gaps, debreath
from chatterbox.tts import ChatterboxTTS
from faster_whisper import WhisperModel
from num2words import num2words
S = json.load(open(sys.argv[1])); ref = sys.argv[2]; out = sys.argv[3]; want = set(sys.argv[4:]); os.makedirs(out, exist_ok=True)
TRIES = int(os.environ.get('TRIES', '6')); OKR, OKS = 0.93, 0.78
m = ChatterboxTTS.from_pretrained(device='cpu'); sr = m.sr; m.prepare_conditionals(ref, exaggeration=0.5)
ref_emb = m.ve.embeds_from_wavs([librosa.load(ref, sr=16000)[0]], sample_rate=16000, as_spk=True)
wm = WhisperModel('small.en', device='cpu', compute_type='int8')
def sim(a): return float(m.ve.voice_similarity(m.ve.embeds_from_wavs([librosa.resample(a.astype(np.float32), orig_sr=sr, target_sr=16000)], sample_rate=16000, as_spk=True), ref_emb))
def words(s):
    s = s.lower().replace('%', ' percent ').replace('’', "'")
    s = re.sub(r"(\d+)s\b", lambda x: num2words(int(x.group(1))) + 's', s)
    s = re.sub(r'\d+', lambda x: num2words(int(x.group()), to='year') if len(x.group()) == 4 else num2words(int(x.group())), s)
    return [{'anne': 'ann', 'an': 'ann'}.get(w, w) for w in re.sub(r"[^a-z' ]", ' ', s.replace('-', ' ')).split()]
def heard(a):
    segs, _ = wm.transcribe(librosa.resample(a.astype(np.float32), orig_sr=sr, target_sr=16000), language='en')
    return ' '.join(x.text.strip() for x in segs)
log = json.load(open(f'{out}/log.json')) if os.path.exists(f'{out}/log.json') else {}
for li, l in enumerate(S):
    if (want and l['id'] not in want) or (not want and log.get(l['id'], {}).get('ok')): continue
    text = l.get('say', l['text']); exp = words(text); best = None
    for k in range(TRIES):
        torch.manual_seed(9000 + li * 53 + k * 131 + int(os.environ.get('SEED_OFFSET', '0')))
        w = m.generate(text, exaggeration=0.48, cfg_weight=0.46, temperature=0.6)
        a = squeeze_gaps(trim(w.squeeze(0).cpu().numpy().astype(np.float64), sr), sr, maxgap=0.45, keep=0.3)
        h = heard(a); r = difflib.SequenceMatcher(None, exp, words(h), autojunk=False).ratio(); s = sim(a)
        score = r + 0.5 * s; print(f"{l['id']} try {k}: words {r:.2f} sim {s:.2f} | {h}", flush=True)
        if best is None or score > best[0]: best = (score, a, h, r, s)
        if r >= OKR and s >= OKS: break
    _, a, h, r, s = best
    sf.write(f'{out}/{l["id"]}.wav', debreath(a, sr), sr)
    log[l['id']] = dict(heard=h, words=round(r, 3), sim=round(s, 3), ok=bool(r >= OKR and s >= OKS)); json.dump(log, open(f'{out}/log.json', 'w'), indent=1)
print('DONE', sum(v['ok'] for v in log.values()), '/', len(S), 'passing')
