# Voice the Heckler's lines (second voice) for the scene build: Chatterbox conditioned on her synthetic reference
# (voice_sample/heckler_isabella/ref.wav, made from Kokoro bf_isabella: no real person cloned), one mood setting per line,
# 4 seeds per line, the first take that passes the word check wins (short lines blur: "Lucky sod" -> "lucky sword").
# Her lines alone are played 20% faster (atempo 1.2; Sam changed it from 1.3 on 3 Nov 2026); the narrator is never sped up.
# Usage: cbx/bin/python3 heckler_lines.py voice_script.json heckler_ref.wav takesdir UNIT [UNIT ...]   (UNIT = H_<line id>)
import sys, os, re, json, difflib, subprocess, tempfile, numpy as np, soundfile as sf, torch, librosa
from chatterbox.tts import ChatterboxTTS
from faster_whisper import WhisperModel
from num2words import num2words
S = json.load(open(sys.argv[1])); S = S["lines"] if isinstance(S, dict) else S; ref, out = sys.argv[2], sys.argv[3]; want = sys.argv[4:]; os.makedirs(out, exist_ok=True)
TEMPO = float(os.environ.get('HECKLER_TEMPO', '1.2')); SEEDS = int(os.environ.get('HECKLER_SEEDS', '4'))
MOOD = {'impatient': (0.7, 0.45), 'pushy': (0.85, 0.35), 'deflated': (0.3, 0.6), 'exasperated': (0.95, 0.3), 'groan': (0.55, 0.5),
        'envious': (0.75, 0.4), 'grudging warm': (0.4, 0.55), 'grudgingly warm': (0.4, 0.55), 'wary': (0.45, 0.5),
        'resigned': (0.3, 0.6), 'suspicious': (0.6, 0.45)}
def toks(s):
    s = re.sub(r'\d+', lambda x: num2words(int(x.group())), s.lower().replace('’', "'"))
    return re.sub(r"[^a-z' ]", ' ', s.replace('-', ' ')).split()
m = ChatterboxTTS.from_pretrained(device='cpu'); sr = m.sr; m.prepare_conditionals(ref, exaggeration=0.5); conds = m.conds
wm = WhisperModel('small.en', device='cpu', compute_type='int8')
lj = f'{out}/log.json'
for u in want:
    L = [l for l in S if l['scene'] == u]; assert len(L) == 1 and L[0].get('who') not in (None, 'narrator'), f'{u}: not a single second-voice line'
    l = L[0]; text = l.get('say', l['text']); ex, cfg = MOOD.get(l.get('mood', ''), (0.6, 0.45))
    if os.environ.get('VOICE_EXAG'): ex, cfg = float(os.environ['VOICE_EXAG']), float(os.environ.get('VOICE_CFG', '0.5'))  # character voices (build.py P['voices'])
    best = None
    for k in range(SEEDS):
        torch.manual_seed(200 + 17 * k + int(os.environ.get('SEED_OFFSET', '0'))); m.conds = conds
        a = m.generate(text, exaggeration=ex, cfg_weight=cfg, temperature=0.8).squeeze().numpy()
        _, (i0, i1) = librosa.effects.trim(a, top_db=38); a = a[max(0, i0 - int(0.05 * sr)):i1 + int(0.08 * sr)]
        segs, _ = wm.transcribe(librosa.resample(a, orig_sr=sr, target_sr=16000), language='en'); heard = ' '.join(s.text.strip() for s in segs)
        r = difflib.SequenceMatcher(None, toks(text), toks(heard)).ratio()
        if best is None or r > best[0]: best = (r, a, heard)
        print(f'{u} seed {k}: words {r:.2f} | {heard}', flush=True)
        if r >= 0.99: break
    r, a, heard = best
    tmp = tempfile.mktemp(suffix='.wav'); sf.write(tmp, a, sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'atempo={TEMPO}', '-ar', str(sr), f'{out}/{u}.wav'], check=True); os.remove(tmp)
    log = json.load(open(lj)) if os.path.exists(lj) else {}
    log[u] = dict(ok=r >= 0.9, words=round(r, 3), sim=None, heard=heard, voice=l.get('who'), mood=l.get('mood'), tempo=TEMPO)
    json.dump(log, open(lj, 'w'), indent=1)
