#!/usr/bin/env python3
"""Music bed + ambience pass on a rendered chapter (Sam, 10 Nov 2026; exurb1a audio study).
Takes the rendered clip, keeps the picture (stream copy) and Sam's narration as is, and adds under it:
  - the chosen bed at BED_LUFS (about 19 dB under the -16 voice), sidechain-ducked 2-3 dB more while he speaks,
    2 s fade in, 3 s fade out, optional silent windows (bed dropped for the hardest line) and an end swell;
  - an optional ambience at AMB_LUFS, faded 1.5 s / 3 s.
Usage: mix_bed.py IN.mp4 OUT.mp4 --bed BED.wav [--amb AMB.mp3 --amb-lufs -40 --amb-from 0 --amb-to END]
                  [--mute A:B ...] [--swell START] [--bed-lufs -35]"""
import argparse, subprocess, re, json

def lufs(f):
    o = subprocess.run(['ffmpeg', '-nostats', '-i', f, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1])

def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))

ap = argparse.ArgumentParser(); ap.add_argument('inp'); ap.add_argument('out'); ap.add_argument('--bed', required=True)
ap.add_argument('--bed-lufs', type=float, default=-35); ap.add_argument('--amb'); ap.add_argument('--amb-lufs', type=float, default=-40)
ap.add_argument('--amb-from', type=float, default=0); ap.add_argument('--amb-to', type=float)
ap.add_argument('--mute', nargs='*', default=[]); ap.add_argument('--swell', type=float)
a = ap.parse_args()
D = dur(a.inp); F = 'aformat=sample_rates=48000:channel_layouts=stereo'
# bed gain envelope: mutes ramp over 0.6 s, swell +4 dB over 2 s
env = '1'
for m in a.mute:
    s, e = map(float, m.split(':'))
    env += f'*min(1,max(0,max(({s}-t)/0.6,(t-{e})/0.6)))'
if a.swell is not None:
    env += f'*(1+0.585*min(1,max(0,(t-{a.swell})/2)))'
g = a.bed_lufs - lufs(a.bed)
fc = [f'[0:a]{F},asplit[v][sc]',
      f"[1:a]atrim=0:{D:.3f},asetpts=PTS-STARTPTS,volume={g:.2f}dB,volume='{env}':eval=frame,"
      f'afade=t=in:d=2,afade=t=out:st={D - 3:.3f}:d=3,{F}[b]',
      '[b][sc]sidechaincompress=threshold=0.03:ratio=3:attack=40:release=400[bd]']
ins = ['-i', a.inp, '-stream_loop', '-1', '-i', a.bed]; mix = ['[v]', '[bd]']
if a.amb:
    t1 = a.amb_to or D; ad = t1 - a.amb_from; ag = a.amb_lufs - lufs(a.amb)
    ins += ['-stream_loop', '-1', '-i', a.amb]
    fc.append(f'[2:a]atrim=0:{ad:.3f},asetpts=PTS-STARTPTS,volume={ag:.2f}dB,afade=t=in:d=1.5,afade=t=out:st={max(0, ad - 3):.3f}:d=3,'
              f'adelay={int(a.amb_from * 1000)}:all=1,{F}[am]'); mix.append('[am]')
fc.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=first,alimiter=limit=0.95[out]")
subprocess.run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(fc), '-map', '0:v', '-map', '[out]',
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', f'{D:.3f}', a.out], check=True)
print(a.out, 'mixed; integrated', lufs(a.out), 'LUFS')
