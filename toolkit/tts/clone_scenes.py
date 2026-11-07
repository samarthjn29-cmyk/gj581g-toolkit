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
S = json.load(open(sys.argv[1])); S = S["lines"] if isinstance(S, dict) else S; ref, out = sys.argv[2], sys.argv[3]; want = set(sys.argv[4:]); os.makedirs(out, exist_ok=True)
EXAG, CFG, TEMP = (float(os.environ.get(k, d)) for k, d in (('EXAG', '0.5'), ('CFG', '0.5'), ('TEMP', '0.8')))
TRIES = int(os.environ.get('TRIES', '8')); OKR, OKS = 0.93, 0.80
ALIAS = {'anne': 'ann', 'barbra': 'barbara', 'babra': 'barbara', 'rays': 'raise'}
def toks(s):
    s = s.lower().replace('%', ' percent ').replace('’', "'").replace('pay slip', 'payslip').replace('pay-slip', 'payslip').replace('take away', 'takeaway').replace('take-away', 'takeaway')
    s = re.sub(r'(?<=\d),(?=\d{3}\b)', '', s)  # '54,500' -> '54500' (whisper writes thousands with a comma; it was read as 'fifty-four five hundred', 3 Nov)
    s = re.sub(r'(\d+)\.(\d+)', lambda x: num2words(int(x.group(1))) + ' point ' + ' '.join('oh' if d == '0' else num2words(int(d)) for d in x.group(2)), s)  # whisper writes 'one point oh five' as 1.05
    s = re.sub(r"(\d+)s\b", lambda x: num2words(int(x.group(1))) + 's', s)
    s = re.sub(r'\d+', lambda x: num2words(int(x.group()), to='year') if len(x.group()) == 4 else num2words(int(x.group())), s)
    s = re.sub(r'\bone (hundred|thousand)\b', r'a \1', s)  # whisper writes 'a hundred' as 100 -> 'one hundred'
    return [ALIAS.get(w, w) for w in re.sub(r"[^a-z' ]", ' ', s.replace('-', ' ')).split()]
m = ChatterboxTTS.from_pretrained(device='cpu'); sr = m.sr
if os.path.isdir(ref):  # a saved voice profile (e.g. voice_sample/sam_voice_v1): identical voice, settings from profile.json unless set in env
    from chatterbox.tts import Conditionals
    prof = json.load(open(f'{ref}/profile.json'))['settings']
    EXAG = float(os.environ.get('EXAG', prof['exaggeration'])); CFG = float(os.environ.get('CFG', prof['cfg_weight'])); TEMP = float(os.environ.get('TEMP', prof['temperature']))
    m.conds = Conditionals.load(f'{ref}/conds.pt').to('cpu'); ref = f'{ref}/ref.wav'
else:
    m.prepare_conditionals(ref, exaggeration=EXAG)
ref_emb = m.ve.embeds_from_wavs([librosa.load(ref, sr=16000)[0]], sample_rate=16000, as_spk=True)
wm = WhisperModel('small.en', device='cpu', compute_type='int8')
def joinnum(ws):
    """Whisper's word timestamps split decimals ("1" + ".09"), so "1.09" became "one nine" and a correct take failed its
    must phrase (Twice shrink_3, 8 tries, 3 Nov 2026). Rejoin a word that starts with a decimal point or digit-comma to the previous number."""
    out = []
    for w, a0, a1 in ws:
        if out and re.match(r'^[.,]\d', w.strip()) and re.search(r'\d$', out[-1][0].strip()): out[-1] = (out[-1][0].rstrip() + w.strip(), out[-1][1], a1)
        else: out.append((w, a0, a1))
    return out
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
# pace band (7 Nov 2026, Emergence study: 152-171 wpm overall, narrow; our Cave clone read 187 wpm inside lines, 144-242 line to line):
# every line of 5+ words must be spoken at MINWPS-MAXWPS words/s, measured first word to last word (2.65-2.95 = 159-177 wpm)
MAXWPS = float(os.environ.get('MAXWPS', '2.95')); MINWPS = float(os.environ.get('MINWPS', '2.3')); PACE_TRIES = int(os.environ.get('PACE_TRIES', '6'))
SLOW_EXAG = float(os.environ.get('SLOW_EXAG', '0.4')); FLOWGAP = float(os.environ.get('FLOWGAP', '0.30')); MINVOICED = float(os.environ.get('MINVOICED', '0.68'))  # rushed takes also calm down: lower exaggeration speaks slower in Chatterbox
lj = f'{out}/log.json'; log = json.load(open(lj)) if os.path.exists(lj) else {}
scenes = list(dict.fromkeys(l['scene'] for l in S))
MAXLINES = int(os.environ.get('MAXLINES', '4'))  # long scenes are voiced in parts of <= 4 lines and joined: an 8-line passage rushed (4-5 w/s) and ran out of memory (clip B real, 3 Nov)
def repeats(exp, heard, n=3):
    """Stretches of 3+ words heard more often than the script says them, e.g. the clone looping 'because everyone else
    swaps through' twice (video 3, 5 Nov 2026: three such loops passed the word check at 0.98). Returns the repeated texts."""
    out = []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, exp, heard, autojunk=False).get_opcodes():
        extra = heard[j1:j2]
        if op in ('insert', 'replace') and (j2 - j1) - (i2 - i1) >= n:
            near = ' ' + ' '.join(exp[max(0, i1 - 25):i1 + 25]) + ' '
            grams = [' '.join(extra[q:q + n]) for q in range(len(extra) - n + 1)]
            if grams and sum((' ' + g + ' ') in near for g in grams) >= max(1, len(grams) // 2): out.append(' '.join(extra))
    return out
def voice_part(L, si, pi):
    text = ' '.join(l.get('say', l['text']) for l in L); exp = toks(text)
    tight = [toks(l.get('say', l['text'])) for l in L if l.get('tight')]
    must = [toks(x) for l in L for x in l.get('must', [])]  # meaning-carrying phrases that must be heard exactly (e.g. "pay slip")
    best = None; slow_down = False
    for k in range(TRIES):
        torch.manual_seed(7000 + si * 61 + pi * 13 + k * 97 + int(os.environ.get('SEED_OFFSET', '0')))
        cfg = CFG if not slow_down else 0.3  # rushed takes: guidance down at once (lower cfg = slower delivery); never 0.2: those takes come out choppy (Cave climb, 7 Nov 2026, Sam: "weird breaks")
        ex = EXAG if not slow_down else min(EXAG, SLOW_EXAG)
        w = m.generate(text, exaggeration=ex, cfg_weight=cfg, temperature=TEMP)
        a = squeeze_gaps(trim(w.squeeze(0).cpu().numpy().astype(np.float64), sr), sr, maxgap=0.40, keep=0.30)
        segs, _ = wm.transcribe(librosa.resample(a.astype(np.float32), orig_sr=sr, target_sr=16000), language='en', word_timestamps=True); segs = list(segs)  # a generator: read it once
        h = ' '.join(s_.text.strip() for s_ in segs); H = [(tk, w0, w1) for wd, w0, w1 in joinnum([(w_.word, w_.start, w_.end) for s_ in segs for w_ in s_.words]) for tk in toks(wd)]
        for j in range(len(H) - 1, 0, -1):  # whisper gives words one by one, so 'take' 'away' never became 'takeaway' (take1 scored 0.87 on a clean take)
            pair = (H[j - 1][0], H[j][0])
            if pair in (('take', 'away'), ('pay', 'slip')): H[j - 1:j + 1] = [(''.join(pair), H[j - 1][1], H[j][2])]
        r = difflib.SequenceMatcher(None, exp, [x[0] for x in H], autojunk=False).ratio()
        s = float(m.ve.voice_similarity(m.ve.embeds_from_wavs([librosa.resample(a.astype(np.float32), orig_sr=sr, target_sr=16000)], sample_rate=16000, as_spk=True), ref_emb))
        ok_t = True
        for tt in tight:  # find the tight phrase in the heard words and reject any pause inside it
            hw = [x[0] for x in H]
            for j in range(len(hw) - len(tt) + 1):
                if hw[j:j + len(tt)] == tt:
                    t_a, t_b = H[j][1], H[j + len(tt) - 1][2]
                    if any(t_a + 0.05 < g0 and g1 < t_b - 0.05 for g0, g1 in gaps(a, db=-28, min_s=0.09)): ok_t = False  # stricter: Sam heard a 0.13 s dip (-28 dB) after "Barbara's" as a pause (3 Nov)
        hw_all = [x[0][:-2] if x[0].endswith("'s") and not any("'s" in t for mm in must for t in mm) else x[0] for x in H]  # a must 'sam' also matches "Sam's" (name test, 3 Nov)
        ok_m = all(any(hw_all[j:j + len(mm)] == mm for j in range(len(hw_all))) for mm in must)
        rep = repeats(exp, [x[0] for x in H]); ok_m = ok_m and not rep  # a looped stretch fails like a missing must-word
        ok_t = ok_t and ok_m
        # pace: no line of 5+ words faster than MAXWPS spoken words/s (Sam on clip A: "Barbara's only buys..." far too fast, 4.3 w/s)
        sm = difflib.SequenceMatcher(None, exp, [x[0] for x in H], autojunk=False); e2h = {}
        for bl in sm.get_matching_blocks():
            for q in range(bl.size): e2h[bl.a + q] = bl.b + q
        fast = []; pos = 0; worst = 0.0; chop = 0.0
        # flow: no pause over FLOWGAP s between two words of the same phrase (no punctuation between them)
        punct = [bool(re.search(r'[.,?!:;]$', t)) for l in L for t in re.findall(r"[A-Za-z0-9'-]+[.,?!:;]?", l.get('say', l['text'])) for _ in toks(t)]
        for q in range(min(len(exp), len(punct)) - 1):
            if not punct[q] and q in e2h and q + 1 in e2h and e2h[q + 1] == e2h[q] + 1:
                gq = H[e2h[q + 1]][1] - H[e2h[q]][2]
                if gq > FLOWGAP: fast.append(f"choppy '{exp[q]} {exp[q + 1]}' {gq:.2f}s"); chop += gq - FLOWGAP
        for l in L:
            n = len(toks(l.get('say', l['text']))); idx = [e2h[q] for q in range(pos, pos + n) if q in e2h]; pos += n
            if n >= 5 and len(idx) >= 2 and H[idx[-1]][2] > H[idx[0]][1]:
                v = n / (H[idx[-1]][2] - H[idx[0]][1])
                if v > MAXWPS: fast.append(f"{l['id']} {v:.2f}w/s"); worst = max(worst, v - MAXWPS)
                elif v < MINWPS: fast.append(f"{l['id']} slow {v:.2f}w/s"); worst = max(worst, MINWPS - v)
        # breathiness (7 Nov 2026, Sam: Cave climb take "sounds really bad"): share of speech frames with a clear pitch;
        # Sam's normal takes 0.72-0.74, the bad cfg 0.3 / exaggeration 0.4 take 0.49 (0.63 by this frame test, others 0.71-0.74). Below MINVOICED the take fails.
        Fv = int(sr * 0.03); vv = []
        for i0 in range(0, len(a) - Fv, Fv):
            fr = a[i0:i0 + Fv]
            if 20 * np.log10(np.sqrt(np.mean(fr ** 2)) + 1e-12) < -40: continue
            w_ = fr - fr.mean(); ac = np.correlate(w_, w_, 'full')[Fv - 1:]; vv.append(ac[int(sr / 400):int(sr / 70)].max() / (ac[0] + 1e-12) > 0.45)
        vfrac = float(np.mean(vv)) if vv else 0.0
        if vfrac < MINVOICED: fast.append(f'breathy {vfrac:.2f}'); chop += (MINVOICED - vfrac) * 2
        ok_core = ok_t  # words that must be heard and tight phrases are fine; only the pace may still fail
        ok_p = not fast; ok_t = ok_t and ok_p; slow_down = (slow_down or any(' slow ' not in f and not f.startswith(('choppy', 'breathy')) for f in fast)) and not any(f.startswith('breathy') for f in fast)  # a breathy take goes back to Sam's own settings  # only rushed takes slow the next try
        score = r + 0.5 * s + (0.2 if ok_core else 0) + (0.1 if ok_p else 0) - 0.05 * worst - 0.5 * chop  # a choppy take loses to a slightly rushed one  # among rushed takes, prefer the least rushed
        print(f"{sc}{'.' + str(pi) if pi else ''} try {k} (cfg {cfg}): words {r:.2f} sim {s:.2f}{'' if ok_t else ((' REPEAT: ' + ' | '.join(rep)) if rep else ' MISSING-MUST' if not ok_m else ' TOO-FAST ' + ','.join(fast) if not ok_p else ' PAUSE-IN-TIGHT')} | {h}", flush=True)
        if best is None or score > best[0]: best = (score, a, h, r, s, ok_t, ok_core)
        del w, segs; import gc; gc.collect()  # long scenes were OOM-killed (-9) part-way through 8 tries (clip B infl, real)
        if r >= OKR and s >= OKS and ok_t: break
        # pace-only failures: lowering cfg rarely fixed them (Raise_v1: 4 clean of 71 takes at 0.3), so stop after PACE_TRIES
        # once the best take is right in every other way, and keep the least rushed one (flagged for Sam's ear)
        if k + 1 >= PACE_TRIES and best[3] >= OKR and best[4] >= OKS and best[6]: break
    return best
for si, sc in enumerate(scenes):
    if (want and sc not in want) or (not want and log.get(sc, {}).get('ok')): continue
    LL = [l for l in S if l['scene'] == sc]; n = -(-len(LL) // MAXLINES); per = -(-len(LL) // n)
    parts = []
    for i in range(0, len(LL), per):  # each part is saved as it finishes, so a retry after a memory kill resumes instead of starting over
        pf, pj = f'{out}/{sc}.part{i // per}.wav', f'{out}/{sc}.part{i // per}.json'
        key = ' '.join(l.get('say', l['text']) for l in LL[i:i + per])
        if os.path.exists(pf) and os.path.exists(pj) and json.load(open(pj)).get('text') == key:
            d = json.load(open(pj)); parts.append((0, sf.read(pf)[0], d['h'], d['r'], d['s'], d['ok'])); print(f'{sc} part {i // per}: kept from the last run', flush=True); continue
        b = voice_part(LL[i:i + per], si, i // per); parts.append(b)
        sf.write(pf, b[1], sr); json.dump(dict(text=key, h=b[2], r=b[3], s=b[4], ok=b[5]), open(pj, 'w'))
    gap = np.zeros(int(sr * 0.35))
    a = np.concatenate([x for p_ in parts for x in (p_[1], gap)][:-1]); h = ' '.join(p_[2] for p_ in parts)
    r = float(np.mean([p_[3] for p_ in parts])); s = min(p_[4] for p_ in parts); ok_t = all(p_[5] for p_ in parts)
    sf.write(f'{out}/{sc}.wav', a, sr)  # breaths kept (Sam: removing them made it sound fake)
    for i in range(len(parts)):
        for ext in ('wav', 'json'):
            if os.path.exists(f'{out}/{sc}.part{i}.{ext}'): os.remove(f'{out}/{sc}.part{i}.{ext}')
    log[sc] = dict(heard=h, words=round(r, 3), sim=round(s, 3), tight_ok=ok_t, ok=bool(min(p_[3] for p_ in parts) >= OKR and s >= OKS and ok_t), parts=len(parts)); json.dump(log, open(lj, 'w'), indent=1)
print('DONE', sum(v['ok'] for v in log.values()), '/', len(scenes), 'scenes passing')
