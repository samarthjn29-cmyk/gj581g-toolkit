#!/home/claude/cbenv/bin/python3
"""Beat times of a music bed, for cut-on-the-beat stretches (BIG_MOVES B8, Sam 14 Nov 2026). Writes BED.beats.json next to the bed.
Usage: beats.py BED.wav   (librosa beat tracker; the bed starts at 0 s in every chapter mix, so these are chapter times)"""
import sys, json, librosa
y, sr = librosa.load(sys.argv[1], sr=22050, mono=True)
tempo, fr = librosa.beat.beat_track(y=y, sr=sr)
bt = [round(float(x), 3) for x in librosa.frames_to_time(fr, sr=sr)]
json.dump({'tempo': float(tempo if not hasattr(tempo, '__len__') else tempo[0]), 'beats': bt}, open(sys.argv[1] + '.beats.json', 'w'))
print(f'{len(bt)} beats, {float(tempo if not hasattr(tempo, "__len__") else tempo[0]):.1f} bpm')
