#!/usr/bin/env python3
"""Clean-start narration voicing (9 Nov 2026, Sam: "a clean start ... use my voice ... depth, some emotion").
One line at a time (Chatterbox rushes and drifts on long multi-sentence inputs), best of N takes per line, and NO
time-stretching or pitch-shifting afterwards (both made the voice echo). Pace comes from the generation settings and
from clean silent pauses between lines; depth comes from EQ only.
Per take: whisper word check (must match), speaking rate inside the line, voice similarity to the reference.
Choice: words must be right; then the take whose rate is closest to TARGET_WPS; similarity breaks ties.
Usage: voice_lines.py SCRIPT.json REF.wav OUTDIR SCENE [SCENE ...]
  env: EXAG (0.6) CFG (0.35) TEMP (0.7) TAKES (3) TARGET_WPS (2.75) LINES (comma list of line ids to (re)do)
Writes OUTDIR/<line id>.wav (trimmed, 0.06 s lead/tail) and OUTDIR/lines.json (rate, sim, heard per line). Resumable."""
import sys, os, re, json, difflib, numpy as np, soundfile as sf, librosa, torch
from chatterbox.tts import ChatterboxTTS
from faster_whisper import WhisperModel
from num2words import num2words
sj, ref, outd = sys.argv[1:4]; scenes = sys.argv[4:]
EX, CFG, TEMP = (float(os.environ.get(k, d)) for k, d in (('EXAG', '0.6'), ('CFG', '0.35'), ('TEMP', '0.7')))
TAKES = int(os.environ.get('TAKES', '3')); TWPS = float(os.environ.get('TARGET_WPS', '2.75'))
BAND = float(os.environ.get('BAND', '0.3')); MAXTAKES = int(os.environ.get('MAXTAKES', '7'))  # pace band: keep taking until a word-perfect take is within TARGET_WPS +- BAND (Sam, 9 Nov: 'a nice pace')
SEEDOFF = int(os.environ.get('SEED_OFFSET', '0'))  # new takes for a redo (same seeds give the same take)
ONLY = set(filter(None, os.environ.get('LINES', '').split(',')))
os.makedirs(outd, exist_ok=True); logf = f'{outd}/lines.json'; log = json.load(open(logf)) if os.path.exists(logf) else {}
S = json.load(open(sj)); L = [l for l in (S['lines'] if isinstance(S, dict) else S) if l['scene'] in scenes]
def toks(s):
    s = s.lower().replace('%', ' percent ').replace('’', "'")
    s = re.sub(r'\d+', lambda x: num2words(int(x.group()), to='year') if len(x.group()) == 4 else num2words(int(x.group())), s)
    return re.sub(r"[^a-z' ]", ' ', s.replace('-', ' ')).split()
m = ChatterboxTTS.from_pretrained(device='cpu'); sr = m.sr
m.prepare_conditionals(ref, exaggeration=EX)
ref_emb = m.ve.embeds_from_wavs([librosa.load(ref, sr=16000)[0]], sample_rate=16000, as_spk=True)
wm = WhisperModel('small.en', device='cpu', compute_type='int8', cpu_threads=2)
def spell(t):                                     # 1752 -> seventeen fifty-two, 1980s -> nineteen eighties, 79 -> seventy-nine
    def f(x):
        n, dec = x.group(1), x.group(2)
        w = num2words(int(n), to='year') if len(n) == 4 else num2words(int(n))
        if dec: w = w[:-1] + 'ies' if w.endswith('y') else w + 's'
        return w
    return re.sub(r"(\d+)(s\b)?", f, t)
def trim(a):
    _, (i0, i1) = librosa.effects.trim(a, top_db=40); return a[max(0, i0 - int(0.06 * sr)):i1 + int(0.06 * sr)]
for li, l in enumerate(L):
    lid = l['id']
    if ONLY and lid not in ONLY: continue
    if not ONLY and lid in log and os.path.exists(f'{outd}/{lid}.wav'): continue
    # numerals always go to the clone as words (it read "1752" as "one hundred and seventy-two"; Sam, 9 Nov 2026)
    text = l.get('say') or spell(l['text'])
    exp = toks(l['text']); best = None
    for k in range(MAXTAKES):                         # extra takes until words are right AND the pace is in the band
        torch.manual_seed(1000 + li * 37 + k * 101 + SEEDOFF)
        w = m.generate(text, exaggeration=EX, cfg_weight=CFG, temperature=TEMP).squeeze(0).numpy().astype(np.float32)
        a = trim(w); a16 = librosa.resample(a, orig_sr=sr, target_sr=16000)
        segs = list(wm.transcribe(a16, language='en', word_timestamps=True)[0]); words = [x for s in segs for x in s.words]
        heard = toks(' '.join(s.text for s in segs)); ok = difflib.SequenceMatcher(None, exp, heard, autojunk=False).ratio()
        span = (words[-1].end - words[0].start) if words else len(a) / sr
        rate = len(exp) / max(span, 0.3)
        sim = float(m.ve.voice_similarity(m.ve.embeds_from_wavs([a16], sample_rate=16000, as_spk=True), ref_emb))
        score = (ok >= 0.97, abs(rate - TWPS) <= BAND, sim if abs(rate - TWPS) <= BAND else -abs(rate - TWPS))
        if best is None or score > best[0]: best = (score, a, dict(words_ok=round(ok, 3), wps=round(rate, 2), sim=round(sim, 3), heard=' '.join(heard)))
        if k + 1 >= TAKES and best[0][0] and best[0][1]: break
    if not best[0][0]: best[2]['FAIL'] = 'words wrong in every take: listen, respell with "say", redo with LINES='
    sf.write(f'{outd}/{lid}.wav', best[1], sr); log[lid] = best[2]; json.dump(log, open(logf, 'w'), indent=1)
    print(lid, best[2], flush=True)
print('DONE', ' '.join(scenes), flush=True)
