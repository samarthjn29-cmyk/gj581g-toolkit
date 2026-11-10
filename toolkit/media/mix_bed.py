#!/usr/bin/env python3
"""Music bed + ambience pass on a rendered chapter (Sam, 10 Nov 2026; exurb1a audio study).
Takes the rendered clip, keeps the picture (stream copy) and Sam's narration as is, and adds under it:
  - the chosen bed at BED_LUFS (default -28.5: about 12.5 dB under the voice in the gaps, gj581g-voice s6-7,
    Sam 10 Nov 2026 'the bed never stops'), sidechain-ducked while he speaks, 2 s fade in, 3 s fade out,
    optional drops (--mute A:B, 0.5-1.5 s, 0.3 s ramps, before a punchline or reveal) and an end swell;
  - then the whole mix is re-levelled with a two-pass linear loudnorm to -16 LUFS, TP -1.5;
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
ap.add_argument('--bed-lufs', type=float, default=-28.5); ap.add_argument('--amb'); ap.add_argument('--amb-lufs', type=float, default=-40)
ap.add_argument('--amb-from', type=float, default=0); ap.add_argument('--amb-to', type=float)
ap.add_argument('--mute', nargs='*', default=[]); ap.add_argument('--swell', type=float)
a = ap.parse_args()
D = dur(a.inp); F = 'aformat=sample_rates=48000:channel_layouts=stereo'
# bed gain envelope: mutes ramp over 0.6 s, swell +4 dB over 2 s
env = '1'
for m in a.mute:
    s, e = map(float, m.split(':'))
    env += f'*min(1,max(0,max(({s}-t)/0.3,(t-{e})/0.3)))'
if a.swell is not None:
    env += f'*(1+0.585*min(1,max(0,(t-{a.swell})/2)))'
g = a.bed_lufs - lufs(a.bed)
fc = [f'[0:a]{F},asplit[v][sc]',
      f"[1:a]atrim=0:{D:.3f},asetpts=PTS-STARTPTS,volume={g:.2f}dB,volume='{env}':eval=frame,"
      f'afade=t=in:d=2,afade=t=out:st={D - 3:.3f}:d=3,{F}[b]',
      '[b][sc]sidechaincompress=threshold=0.05:ratio=3:attack=20:release=400[bd]']
ins = ['-i', a.inp, '-stream_loop', '-1', '-i', a.bed]; mix = ['[v]', '[bd]']
if a.amb:
    t1 = a.amb_to or D; ad = t1 - a.amb_from; ag = a.amb_lufs - lufs(a.amb)
    ins += ['-stream_loop', '-1', '-i', a.amb]
    fc.append(f'[2:a]atrim=0:{ad:.3f},asetpts=PTS-STARTPTS,volume={ag:.2f}dB,afade=t=in:d=1.5,afade=t=out:st={max(0, ad - 3):.3f}:d=3,'
              f'adelay={int(a.amb_from * 1000)}:all=1,{F}[am]'); mix.append('[am]')
fc.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=first,alimiter=limit=0.89[out]")
tmp = a.out + '.pre.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(fc), '-map', '[out]',
                '-t', f'{D:.3f}', tmp], check=True)
# two-pass linear loudnorm of the mixed track to -16 LUFS, TP -1.5
o = subprocess.run(['ffmpeg', '-nostats', '-i', tmp, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                   capture_output=True, text=True).stderr
m = json.loads(o[o.rindex('{'):o.rindex('}') + 1])
ln = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a.inp, '-i', tmp, '-map', '0:v', '-map', '1:a', '-af', ln + ',aresample=48000',
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', f'{D:.3f}', a.out], check=True)
import os; os.remove(tmp)
L = lufs(a.out)
print(a.out, 'mixed; integrated', L, 'LUFS')
if L < -17: raise SystemExit('FAIL: final under -17 LUFS, do not send')
