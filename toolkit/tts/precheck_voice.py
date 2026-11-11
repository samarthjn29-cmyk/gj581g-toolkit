#!/usr/bin/env python3
"""Voice check on Sam's ElevenLabs files THE MOMENT THEY ARRIVE, before any picture work (Sam, 11 Nov 2026:
workflow change 1). A slip found here costs Sam two minutes in ElevenLabs; found after the render it costs a
chapter re-render (Zeigarnik: "blog" heard as "block" at 6:36 was only found on the joined video).

For every MP3/WAV in VOICE_DIR named NN_<scene>.<ext>, runs audit_clip.py on that file against the script lines of
<scene> (words, pauses, noise, pace, level), and writes one report VOICE_DIR/precheck_report.md, problems first.
Flags confirmed by a second model (small.en) are marked CONFIRMED; the rest are "probably spelling".
Usage: python3 precheck_voice.py VOICE_DIR SCRIPT.json [--names A,B,C]
Run with plain python3, alone (no render or other whisper job at the same time). Exit 1 if any CONFIRMED problem."""
import sys, os, re, json, glob, subprocess, argparse, numpy as np
ap = argparse.ArgumentParser(); ap.add_argument('voice_dir'); ap.add_argument('script'); ap.add_argument('--names', default='')
a = ap.parse_args()
HERE = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(a.script)); L = S['lines'] if isinstance(S, dict) else S
files = sorted(f for f in glob.glob(os.path.join(a.voice_dir, '*')) if re.match(r'\d+_.+\.(mp3|wav|m4a)$', os.path.basename(f), re.I))
if not files: sys.exit(f'no NN_<scene>.mp3 files in {a.voice_dir}')
small = None
def second_opinion(f, t, d=6.0):
    global small
    if small is None:
        from faster_whisper import WhisperModel
        small = WhisperModel('small.en', device='cpu', compute_type='int8')
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(max(0, t - 0.5)), '-t', str(d), '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout
    return ' '.join(s.text for s in small.transcribe(np.frombuffer(raw, np.float32), language='en', beam_size=5)[0]).lower()
n = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
out, confirmed = [], 0
for f in files:
    scene = re.sub(r'^\d+_', '', os.path.splitext(os.path.basename(f))[0])
    ids = [l['id'] for l in L if l.get('scene') == scene]
    if not ids: out.append(f'## {os.path.basename(f)}\nNo script lines with scene "{scene}"; file name must be NN_<scene>.\n'); continue
    rep = os.path.join(a.voice_dir, f'.precheck_{scene}.md')
    cmd = [sys.executable, os.path.join(HERE, 'audit_clip.py'), f, a.script, f'{ids[0]}-{ids[-1]}', '--out', rep]
    if a.names: cmd += ['--names', a.names]
    subprocess.run(cmd, capture_output=True, text=True)
    txt = open(rep).read() if os.path.exists(rep) else '(audit failed to run)'
    lines_out = []
    for line in txt.splitlines():
        m = re.match(r"(\S+) @\s*([\d.]+)s\s+WORDS: '(.*?)' -> '(.*?)'", line)
        if m:
            want = m.group(3)
            heard2 = second_opinion(f, float(m.group(2)))
            ok2 = n(want) in n(heard2.replace(' ', '')) or any(n(want) == n(w) for w in heard2.split())
            tag = 'probably spelling (second model heard it right)' if ok2 else 'CONFIRMED (both models)'
            confirmed += 0 if ok2 else 1
            lines_out.append(f'{line}  -> {tag}')
        else:
            lines_out.append(line)
    out.append(f'## {os.path.basename(f)} ({scene}, {len(ids)} lines)\n' + '\n'.join(lines_out) + '\n')
head = f'# Voice precheck: {len(files)} files, {confirmed} confirmed word problems\nSend Sam the CONFIRMED ones with file, time and line, before building any pictures.\n\n'
open(os.path.join(a.voice_dir, 'precheck_report.md'), 'w').write(head + '\n'.join(out))
print(head.strip()); print('report:', os.path.join(a.voice_dir, 'precheck_report.md'))
sys.exit(1 if confirmed else 0)
