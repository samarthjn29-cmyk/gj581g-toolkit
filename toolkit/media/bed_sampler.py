#!/usr/bin/env python3
"""Music-bed sampler (Aliens ch5, 13 Nov 2026: Sam picked "Covert Affair" from 8 candidates by ear).
The first D seconds of a chapter's final voice over each candidate track at the video's bed level (default -29 LUFS),
sidechain-ducked like mix_bed.py, joined into one MP3 with a 1.5 s gap. Prints the start time of each candidate.
Usage: bed_sampler.py VOICE.wav OUT.mp3 [--dur 32] [--lufs -29] "Name=track.mp3" ...   (current track first)
Tracks: library music only (Kevin MacLeod / YouTube Audio Library / CC0). Never a song from an "Artist - Topic"
channel or any commercial release: Content ID claims it whatever the credit says."""
import sys, json, subprocess, argparse, tempfile, os
ap = argparse.ArgumentParser(); ap.add_argument('voice'); ap.add_argument('out'); ap.add_argument('tracks', nargs='+')
ap.add_argument('--dur', type=float, default=32); ap.add_argument('--lufs', type=float, default=-29); a = ap.parse_args()
def lufs(f):
    o = subprocess.run(['ffmpeg', '-nostats', '-i', f, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(json.loads(o[o.rindex('{'):o.rindex('}') + 1])['input_i'])
D = a.dur; tmp = tempfile.mkdtemp(); parts = []
for i, nt in enumerate(a.tracks):
    name, f = nt.split('=', 1); g = a.lufs - lufs(f); out = f'{tmp}/p{i}.wav'
    fc = (f"[0:a]atrim=0:{D},asetpts=PTS-STARTPTS,aformat=sample_rates=48000:channel_layouts=stereo,asplit[v][sc];"
          f"[1:a]atrim=0:{D},asetpts=PTS-STARTPTS,volume={g:.2f}dB,afade=t=in:d=1.5,afade=t=out:st={D-2}:d=2,aformat=sample_rates=48000:channel_layouts=stereo[b];"
          "[b][sc]sidechaincompress=threshold=0.05:ratio=3:attack=20:release=400[bd];[v][bd]amix=inputs=2:normalize=0,alimiter=limit=0.89,apad=pad_dur=1.5[o]")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a.voice, '-i', f, '-filter_complex', fc, '-map', '[o]', out], check=True); parts.append(out)
    t = i * (D + 1.5); print('%d:%02d  %s' % (t // 60, t % 60, name))
open(f'{tmp}/l.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{tmp}/l.txt', '-af', 'loudnorm=I=-16:TP=-1.5', '-c:a', 'libmp3lame', '-b:a', '160k', a.out], check=True)
