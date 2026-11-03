# The Heckler (second voice, Dollar Yardstick video 2 onwards)
- Voice: Chatterbox conditioned on `ref_bf_isabella.wav`, a 9 s line made with Kokoro `bf_isabella` (a synthetic identity: no real person's voice is cloned).
- Per-line mood tag -> (exaggeration, cfg): impatient 0.7/0.45, pushy 0.85/0.35, deflated 0.3/0.6, exasperated 0.95/0.3, groan 0.55/0.5, envious 0.75/0.4, grudging warm 0.4/0.55.
- Her lines are played 30% faster (`atempo=1.3`), hers only; the narrator is never sped up.
- `cbmood.py <voice|none>` voices `mood.json` (N = Sam's clone, H = heckler); `reroll.py` for misheard lines; `assemble.py <voice> [tempo]` builds a sampler.
- Her lines are never captioned or shown in a bubble. Character: `remotion/kits/folk_banknote/heckler.jsx` (Folk, bob, mustard-gold jumper, gold hoops; mood faces in `rig.jsx`).
- Chatterbox in the container: `python3 -m venv cbenv && cbenv/bin/pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu && cbenv/bin/pip install chatterbox-tts` (about 10 min).
