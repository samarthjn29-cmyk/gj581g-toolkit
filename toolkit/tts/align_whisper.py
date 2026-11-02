"""Word timings for real or cloned narration (not Kokoro): faster-whisper word timestamps aligned to the script words.
Usage: align_whisper.py slides.json vo_dir out.json [scene numbers...]
Output like tts/align.py: {"n": [{"w": word, "s": start, "e": end, "emph": bool, "who": "viewer"?}]}, times from clip start."""
import sys, re, json, difflib
from faster_whisper import WhisperModel
sys.path.insert(0, __import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), '..', 'story'))
from vo_lib import TOKEN, VIEWER
slides, vo, out = sys.argv[1], sys.argv[2], sys.argv[3]; want = {int(x) for x in sys.argv[4:]}
S = json.load(open(slides)); S = S if isinstance(S, list) else S['slides']
model = WhisperModel('small.en', device='cpu', compute_type='int8')
res = json.load(open(out)) if __import__('os').path.exists(out) else {}
norm = lambda w: re.sub(r"[^a-z0-9']", '', w.lower().replace('’', "'"))
for d in S:
    n = d['n']
    if want and n not in want: continue
    text = ' '.join(d['vo_marked']) if isinstance(d['vo_marked'], list) else d['vo_marked']
    script = []
    for m in re.finditer(r'\{viewer:\s*([^}]*)\}|([^{]+)', text):
        who = 'viewer' if m.group(1) is not None else None
        for w in TOKEN.sub(' ', m.group(1) if who else m.group(2)).split():
            if re.search(r'[A-Za-z0-9]', w): script.append({'w': w.replace('*', ''), 'emph': '*' in w, **({'who': who} if who else {})})
    import subprocess, numpy as np
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f'{vo}/VO-{n:02d}.mp3', '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
    audio = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    segs, _ = model.transcribe(audio, word_timestamps=True, language='en', beam_size=5)
    rec = [w for s in segs for w in s.words]
    a = [norm(x['w']) for x in script]; b = [norm(w.word) for w in rec]
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    t = [None] * len(script)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size): t[blk.a + k] = (rec[blk.b + k].start, rec[blk.b + k].end)
    for op, i1, i2, j1, j2 in sm.get_opcodes():   # replaced spans: spread over the recognised span
        if op == 'replace' and j2 > j1:
            s0, e0 = rec[j1].start, rec[j2 - 1].end
            for k in range(i1, i2): t[k] = (s0 + (e0 - s0) * (k - i1) / (i2 - i1), s0 + (e0 - s0) * (k - i1 + 1) / (i2 - i1))
    for k in range(len(t)):   # fill gaps by interpolation
        if t[k] is None:
            prev = next((t[j] for j in range(k - 1, -1, -1) if t[j]), (0, 0)); nxt = next((t[j] for j in range(k + 1, len(t)) if t[j]), (prev[1] + 0.3, prev[1] + 0.6))
            t[k] = (prev[1], max(prev[1] + 0.05, min(nxt[0], prev[1] + 0.35)))
    matched = sum(blk.size for blk in sm.get_matching_blocks())
    res[str(n)] = [{**x, 's': round(s, 2), 'e': round(e, 2)} for x, (s, e) in zip(script, t)]
    print(f'VO-{n:02d}: {matched}/{len(script)} words matched ({"OK" if matched >= 0.85 * len(script) else "CHECK"})', flush=True)
json.dump(res, open(out, 'w'))
