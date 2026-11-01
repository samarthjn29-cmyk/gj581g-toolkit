"""Mix VO-NN.mp3 clips into one narration track, each starting 0.2 s after its slide starts.
Usage: mix_voice.py slides.json - vo_dir narration_track.mp3      (narration only: pass - as the bed)
       mix_voice.py slides.json bed.mp3 vo_dir mix.mp3 [voice_only.mp3]   (with a music/sfx bed, only if asked)
slides.json must carry the final start/dur (rerun handoff.py --vo-dur first)."""
import sys, json, subprocess, numpy as np
SR = 44100
def load(path):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
def save(x, path):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 's16le', '-ac', '1', '-ar', str(SR), '-i', '-', '-b:a', '192k', path], input=(np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes(), check=True)
sl = json.load(open(sys.argv[1])); bed = load(sys.argv[2]) * 0.7 if sys.argv[2] != '-' else np.zeros(1, np.float32)
total = int((sl[-1]['start'] + sl[-1]['dur']) * SR) + SR
voice = np.zeros(total, np.float32)
for d in sl:
    v = load(f"{sys.argv[3]}/VO-{d['n']:02d}.mp3"); st = int((d['start'] + 0.2) * SR)
    voice[st:st + len(v)] += v[:max(0, total - st)]
mix = np.zeros(total, np.float32); mix[:len(bed)] += bed[:total]; mix += voice
mix /= max(1.0, np.max(np.abs(mix)) / 0.95)
save(mix, sys.argv[4])
if len(sys.argv) > 5: save(voice, sys.argv[5])
print('mixed', round(total / SR, 1), 's')
