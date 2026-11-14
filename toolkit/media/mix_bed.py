#!/usr/bin/env python3
"""Music bed + ambience pass on a rendered chapter (Sam, 10 Nov 2026; exurb1a audio study).
Takes the rendered clip, keeps the picture (stream copy) and Sam's narration as is, and adds under it:
  - the chosen bed at BED_LUFS (default -28.5: about 12.5 dB under the voice in the gaps, gj581g-voice s6-7,
    Sam 10 Nov 2026 'the bed never stops'), sidechain-ducked while he speaks, 2 s fade in, 3 s fade out,
    optional drops (--mute A:B, 0.5-1.5 s, 0.3 s ramps, before a punchline or reveal) and an end swell;
  - then the whole mix is re-levelled with a two-pass linear loudnorm to -16 LUFS, TP -1.5;
  - an optional ambience at AMB_LUFS, faded 1.5 s / 3 s.
Usage: mix_bed.py IN.mp4 OUT.mp4 --bed BED.wav [--amb AMB.mp3 --amb-lufs -40 --amb-from 0 --amb-to END]
                  [--mute A:B ...] [--muffle A:B ...] [--worldize A:B ...] [--swell START] [--bed-lufs -35] [--sfx FILE@T[:LUFS[:DUR[:gapG]]] ...]
  --sfx: a sound effect placed at T seconds (default -24 LUFS; DUR trims it, with a 0.15 s fade out), not ducked,
         mixed before the re-level (Aliens opening, 11 Nov 2026: boo, trombone, ka-ching, poppers, cheer, kiss)
         gapG (e.g. gap0.4): the drop-out before the hit (gag study 14 Nov 2026, TheOdd1sOut measured 0.3-0.5 s):
         everything else in the mix (voice, bed, ambience, other sounds) dips to silence for G s before T, 40 ms ramps,
         so the hit lands out of a hole. One a chapter, on the biggest sting, in a gap in the narration."""
import argparse, subprocess, re, json

def lufs(f):
    o = subprocess.run(['ffmpeg', '-nostats', '-i', f, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1])

def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))

ap = argparse.ArgumentParser(); ap.add_argument('inp'); ap.add_argument('out'); ap.add_argument('--bed', required=True)   # 'none': voice + sound effects only
ap.add_argument('--bed-lufs', type=float, default=-28.5); ap.add_argument('--amb'); ap.add_argument('--amb-lufs', type=float, default=-40)
ap.add_argument('--amb-from', type=float, default=0); ap.add_argument('--fade-in', type=float, default=2); ap.add_argument('--fade-out', type=float, default=3);   # inner chapters of a joined video: 0.25 / 0.25, so the bed doesn't dip at the joins (Moctar full-cut review, 14 Nov 2026)
ap.add_argument('--amb-to', type=float)
ap.add_argument('--mute', nargs='*', default=[]); ap.add_argument('--muffle', nargs='*', default=[]); ap.add_argument('--worldize', nargs='*', default=[]); ap.add_argument('--thin', nargs='*', default=[]); ap.add_argument('--lift', type=float); ap.add_argument('--button', type=float); ap.add_argument('--swell', type=float); ap.add_argument('--sfx', nargs='*', default=[])
a = ap.parse_args()
D = dur(a.inp); F = 'aformat=sample_rates=48000:channel_layouts=stereo'
# bed gain envelope: mutes ramp over 0.6 s, swell +4 dB over 2 s
env = '1'
for m in a.mute:
    s, e = map(float, m.split(':'))
    env += f'*min(1,max(0,max(({s}-t)/0.3,(t-{e})/0.3)))'
if a.swell is not None:
    env += f'*(1+0.585*min(1,max(0,(t-{a.swell})/2)))'
# BIG_MOVES B5 / B7 (Sam, 14 Nov 2026): --muffle A:B low-passes the bed and the ambience (the world goes muffled, like a shock);
# --worldize A:B band-passes the bed so it sounds as if it plays from a phone speaker. Sam's voice is never touched.
def _tr(spec, f): s0, e0 = map(float, spec.split(':')); return ''.join(f",{x}:enable='between(t,{s0},{e0})'" for x in f.split(','))
TREAT = ''.join(_tr(m, 'lowpass=f=380:p=2') for m in a.muffle) + ''.join(_tr(m, 'highpass=f=650,lowpass=f=2800') for m in a.worldize)
# music moves (music_moves.py, 14 Nov 2026): --thin A:B leaves a narrow mid band of the bed (one instrument's worth), --lift T
# raises the bed a semitone from T (rubberband, tempo kept), --button T cuts the bed on T with a 0.12 s tail for the button chord
TREAT += ''.join(_tr(m, 'highpass=f=700,lowpass=f=1900') for m in a.thin)
if a.button is not None: env += f'*min(1,max(0,({a.button}+0.12-t)/0.12))'

AMBT = ''.join(_tr(m, 'lowpass=f=380:p=2') for m in a.muffle)
NOBED = a.bed == 'none'   # Sam, Aliens opening, 11 Nov 2026: "Remove the sound bed ... only gag sounds and my voice"
g = 0 if NOBED else a.bed_lufs - lufs(a.bed)
fc = [f'[0:a]{F},asplit[v][sc]',
      f"[1:a]atrim=0:{D:.3f},asetpts=PTS-STARTPTS,volume={g:.2f}dB,volume='{env}':eval=frame,"
      f'afade=t=in:d={a.fade_in},afade=t=out:st={D - a.fade_out:.3f}:d={a.fade_out},{F}' + TREAT + '[b]',
      '[b][sc]sidechaincompress=threshold=0.05:ratio=3:attack=20:release=400[bd]']
if a.lift is not None:   # rubberband has no timeline switch: a pitched copy of the bed takes over from T (30 ms crossfade)
    fc[1] = fc[1][:-3] + '[bp]'
    fc.insert(2, f"[bp]asplit[bx][by];[by]rubberband=pitch=1.05946,volume='min(1,max(0,(t-{a.lift})/0.03))':eval=frame[byl];"
                 f"[bx]volume='min(1,max(0,({a.lift}-t)/0.03))':eval=frame[bxl];[bxl][byl]amix=inputs=2:normalize=0[b]")
ins = ['-i', a.inp, '-stream_loop', '-1', '-i', a.bed]; mix = ['[v]', '[bd]']
if NOBED: fc = [f'[0:a]{F}[v]']; ins = ['-i', a.inp]; mix = ['[v]']
if a.amb:
    t1 = a.amb_to or D; ad = t1 - a.amb_from; ag = a.amb_lufs - lufs(a.amb)
    ins += ['-stream_loop', '-1', '-i', a.amb]
    fc.append(f'[2:a]atrim=0:{ad:.3f},asetpts=PTS-STARTPTS,volume={ag:.2f}dB,afade=t=in:d={min(1.5, a.fade_in)},afade=t=out:st={max(0, ad - a.fade_out):.3f}:d={a.fade_out},'
              f'adelay={int(a.amb_from * 1000)}:all=1,{F}' + AMBT + '[am]'); mix.append('[am]')
GAPS = []   # (start, end) windows where everything but the gapped hit is silenced
for spec in a.sfx:
    pr = spec.rsplit('@', 1)[1].split(':')
    if len(pr) > 3 and pr[3].startswith('gap'): GAPS.append((float(pr[0]) - float(pr[3][3:]), float(pr[0])))
def gapenv():   # 1 outside the gaps, 0 inside, 40 ms ramps on each side
    return '*'.join(f'min(1,max(0,max(({g0:.3f}-t)/0.04,(t-{g1:.3f})/0.04)))' for g0, g1 in GAPS) or '1'
if GAPS:   # voice, bed and ambience go through the gap envelope
    fc = [x.replace('[v][sc]', '[v0][sc]') if x.startswith('[0:a]') and '[v][sc]' in x else x for x in fc]
    if NOBED: fc[0] = fc[0].replace('[v]', '[v0]')
    fc.append(f"[v0]volume='{gapenv()}':eval=frame[v]")
    mix = [m for m in mix]
    for i, m in enumerate(mix):
        if m in ('[bd]', '[am]'): fc.append(f"{m}volume='{gapenv()}':eval=frame[{m[1:-1]}g]"); mix[i] = f'[{m[1:-1]}g]'
for spec in a.sfx:
    f, rest = spec.rsplit('@', 1); parts = rest.split(':'); at = float(parts[0])
    lu = float(parts[1]) if len(parts) > 1 and parts[1] else -24.0; du = float(parts[2]) if len(parts) > 2 and parts[2] else None
    k = len(ins) // 2 if False else sum(1 for x in ins if x == '-i'); ins += ['-i', f]
    sg = lu - lufs(f); tr = f'atrim=0:{du:.3f},afade=t=out:st={max(0, du - 0.15):.3f}:d=0.15,' if du else ''
    own = len(parts) > 3 and parts[3].startswith('gap'); ge = '' if own or not GAPS else f",volume='{gapenv()}':eval=frame"
    fc.append(f'[{k}:a]{tr}asetpts=PTS-STARTPTS,volume={sg:.2f}dB,adelay={int(at * 1000)}:all=1,{F}{ge}[s{k}]'); mix.append(f'[s{k}]')
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
