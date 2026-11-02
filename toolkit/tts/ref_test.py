# Choose a voice reference by evidence (2 Nov 2026): clone a passage Sam ALSO recorded, score the clone against his real
# readings of that same passage (speaker similarity), keep the highest. Run once per candidate reference (one process each).
# Usage: cbx/bin/python3 ref_test.py candidate_ref.wav out.wav "<passage text>" "<glob of Sam's real readings of it>"
# Never use a candidate's own words as the test passage (cut the reference from one part of the take, test on another).
import sys, os, glob, re, difflib, numpy as np, soundfile as sf, torch, librosa
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from clone_all import trim, squeeze_gaps
from chatterbox.tts import ChatterboxTTS
from faster_whisper import WhisperModel
ref, out, TEXT, REAL = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
m = ChatterboxTTS.from_pretrained(device='cpu'); sr = m.sr; m.prepare_conditionals(ref, exaggeration=0.5)
wm = WhisperModel('small.en', device='cpu', compute_type='int8')
emb = lambda y: m.ve.embeds_from_wavs([y.astype(np.float32)], sample_rate=16000, as_spk=True)
reals = [emb(librosa.load(f, sr=16000)[0]) for f in sorted(glob.glob(REAL))]
tok = lambda s: re.sub(r"[^a-z ]", ' ', s.lower().replace('%', ' percent').replace('2', 'two').replace('1', 'one')).split()
best = None
for k in range(4):
    torch.manual_seed(4242 + k * 97)
    a = squeeze_gaps(trim(m.generate(TEXT, exaggeration=0.5, cfg_weight=0.5, temperature=0.8).squeeze(0).cpu().numpy().astype(np.float64), sr), sr, maxgap=0.40, keep=0.30)
    a16 = librosa.resample(a.astype(np.float32), orig_sr=sr, target_sr=16000)
    h = ' '.join(s.text.strip() for s in wm.transcribe(a16, language='en')[0])
    r = difflib.SequenceMatcher(None, tok(TEXT), tok(h), autojunk=False).ratio()
    s = float(np.mean([m.ve.voice_similarity(emb(a16), e) for e in reals]))
    print(f'try {k}: words {r:.2f} sim-to-real-reading {s:.3f} | {h}', flush=True)
    if r >= 0.9 and (best is None or s > best[0]): best = (s, a)
    if best and k >= 1: break
sf.write(out, best[1], sr); print(f'RESULT {ref} {best[0]:.3f}')
