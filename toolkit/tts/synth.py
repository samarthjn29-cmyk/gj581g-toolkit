"""Render Decked out Data voiceover clips with Kokoro (local, offline).
Usage: SPEED=1.1 [DIALECT=gb] [PRON=pron.json] [VIEWER=<voice id>] synth.py slides.json outdir voice_id [slide numbers...]
slides.json entries need n, dur and vo_marked (story/handoff.py writes them). Pauses in the markup become exact silences.
Writes VO-NN.mp3 and durations.json (merged with the existing file when only some slide numbers are given; feed it to handoff.py --vo-dur to retime the slides). Reports words missing from the dictionary."""
import sys, os, re, json, subprocess
import numpy as np, onnxruntime as ort
from scipy.io import wavfile
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
DL = os.environ.get('KOKORO_DIR', os.path.join(D, 'dl'))
from g2p import phonemize
SR = 24000
cfg = json.load(open(f'{DL}/repo/src/kokoro_onnx/config.json')); VOCAB = cfg['vocab']
sess = ort.InferenceSession(f'{DL}/kokoro-v1.0.onnx', providers=['CPUExecutionProvider'])
voices = np.load(f'{DL}/voices-v1.0.bin')
TOKEN = re.compile(r"\[(beat|pause|long pause|pause:\s*[0-9.]+)\]")
GAP = {'beat': 0.3, 'pause': 0.7, 'long pause': 1.2}

def tts(text, voice, speed):
    ph, miss = phonemize(text)
    ids = [VOCAB[c] for c in ph if c in VOCAB]
    out = []
    # keep each chunk under the model limit by splitting on sentence ends
    chunks, cur = [], []
    for c in ids:
        cur.append(c)
        if len(cur) > 380 and c in (VOCAB.get('.'), VOCAB.get('?'), VOCAB.get('!'), VOCAB.get(',')):
            chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    for ch in chunks:
        style = voices[voice][len(ch)]
        a = sess.run(None, {'tokens': np.array([[0, *ch, 0]], dtype=np.int64), 'style': style.astype(np.float32), 'speed': np.array([speed], dtype=np.float32)})[0]
        out.append(np.squeeze(a))
    return np.concatenate(out), miss

def trim(a, thr=0.004):
    idx = np.where(np.abs(a) > thr)[0]
    return a if len(idx) == 0 else a[max(0, idx[0] - 240): idx[-1] + 480]

VIEWER = re.compile(r"\{viewer:\s*([^}]*)\}")
def parse(marked):
    """Split a slide's marked text into ('s', seconds) silences and ('t', text, who) speech parts; who is
    'narrator' or 'viewer' ({viewer: ...} lines, spoken by the VIEWER voice; toolkit 1.9)."""
    text = marked.replace('*', ''); out = []
    pos = 0; chunks = []
    for m in VIEWER.finditer(text):
        chunks.append((text[pos:m.start()], 'narrator')); chunks.append((m.group(1), 'viewer')); pos = m.end()
    chunks.append((text[pos:], 'narrator'))
    for chunk, who in chunks:
        last = 0
        for m in TOKEN.finditer(chunk):
            out.append(('t', chunk[last:m.start()], who)); t = m.group(1)
            out.append(('s', GAP.get(t) if t in GAP else float(t.split(':')[1]))); last = m.end()
        out.append(('t', chunk[last:], who))
    return [p for p in out if p[0] == 's' or p[1].strip()]

def voice_for(who, voice):
    if who == 'viewer':
        v = os.environ.get('VIEWER')
        if not v: raise SystemExit('This script has {viewer: ...} lines: set VIEWER=<second Kokoro voice id> (e.g. am_eric)')
        return v
    return voice

def render(marked, voice, speed=1.0):
    pieces = [np.zeros(int(0.15 * SR), dtype=np.float32)]; miss = set()
    for part in parse(marked):
        if part[0] == 's': pieces.append(np.zeros(int(part[1] * SR), dtype=np.float32)); continue
        a, m = tts(part[1].strip(), voice_for(part[2], voice), speed); miss |= m
        pieces.append(trim(a).astype(np.float32)); pieces.append(np.zeros(int(0.12 * SR), dtype=np.float32))
    pieces.append(np.zeros(int(0.25 * SR), dtype=np.float32))
    return np.concatenate(pieces), miss

if __name__ == '__main__':
    slides = json.load(open(sys.argv[1])); out = sys.argv[2]; voice = sys.argv[3]
    want = set(int(x) for x in sys.argv[4:])
    os.makedirs(out, exist_ok=True); rep = []
    for d in slides:
        if want and d['n'] not in want: continue
        a, miss = render(' '.join(d['vo_marked']), voice, float(os.environ.get('SPEED', '1.1')))
        a = a / max(1e-6, np.max(np.abs(a))) * 0.89
        wav = f"{out}/VO-{d['n']:02d}.wav"; wavfile.write(wav, SR, (a * 32767).astype(np.int16))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ar', '44100', '-b:a', '160k', wav[:-4] + '.mp3'], check=True); os.remove(wav)
        rep.append((d['n'], round(len(a) / SR, 1), d['dur'], sorted(miss)))
        print(f"VO-{d['n']:02d}: {len(a)/SR:5.1f}s (planned {d['dur']}s) {'MISSING ' + str(sorted(miss)) if miss else ''}", flush=True)
    dj = f'{out}/durations.json'
    if want and os.path.exists(dj):   # re-rendering some clips: keep the other clips' entries
        done = {r[0] for r in rep}; rep = sorted([list(r) for r in json.load(open(dj)) if r[0] not in done] + [list(r) for r in rep])
    json.dump(rep, open(dj, 'w'))
