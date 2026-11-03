"""LongChat: build LongChat_remotion/src/data/{slides,words}.json for scenes FIRST..LAST, copy their clips, and mix the
narration with the music cue(s) ducked underneath (first video with music, 1 Nov 2026).
Usage: lc_data.py FIRST LAST
Music cues come from MUSIC below: (first scene, file, offset s). Narration loudnormed to -16 LUFS, music to about -27 LUFS,
then side-chain ducked under speech; 1.5 s fades at cue changes. No sound effects."""
import json, sys, shutil, subprocess, os
FIRST, LAST = int(sys.argv[1]), int(sys.argv[2])
T = '/home/claude/LongChat_v1'; R = f'{T}/LongChat_remotion'
MUSIC = [(1, f'{T}/media/music/Investigations.mp3', 0.0), (12, f'{T}/media/music/Thinking Music.mp3', 0.0), (21, f'{T}/media/music/Inspired.mp3', 0.0)]
S = json.load(open(f'{T}/story/slides.json')); S = S if isinstance(S, list) else S['slides']
W = json.load(open(f'{T}/tts/words.json'))
dur = lambda n: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{T}/tts/vo/VO-{n:02d}.mp3'], capture_output=True, text=True).stdout)
out, t = [], 0.0
for d in S[FIRST - 1:LAST]:
    d = dict(d); n = int(d['n']); d['n'] = n
    d['dur'] = round(dur(n) + 0.35 + float(d.get('hold') or 0), 2); d['start'] = round(t, 2); t += d['dur']; out.append(d)
    shutil.copy(f'{T}/tts/vo/VO-{n:02d}.mp3', f'{R}/public/vo/VO-{n:02d}.mp3')
json.dump(out, open(f'{R}/src/data/slides.json', 'w')); json.dump(W, open(f'{R}/src/data/words.json', 'w'))
# 1) narration track
ins = sum([['-i', f"{T}/tts/vo/VO-{d['n']:02d}.mp3"] for d in out], [])
fl = ';'.join(f"[{i}:a]aresample=48000,adelay={int((d['start'] + 0.2) * 1000)}:all=1[a{i}]" for i, d in enumerate(out))
fl += ';' + ''.join(f'[a{i}]' for i in range(len(out))) + f'amix=inputs={len(out)}:normalize=0,apad,atrim=0:{t:.3f},loudnorm=I=-16:TP=-1.5:LRA=11[o]'
subprocess.run(['ffmpeg', '-y', '-v', 'error', *ins, '-filter_complex', fl, '-map', '[o]', '-ac', '1', '-ar', '48000', f'{R}/out/voice.wav'], check=True)
# 2) music bed: the cues that fall in this range, each from its scene start to the next cue (or the end), 1.5 s fades
starts = {d['n']: d['start'] for d in out}
# global time of each scene (all scenes before FIRST must be voiced): music keeps its place across clip joins
G, g = {}, 0.0
for d in S[:LAST]:
    n = int(d['n']); G[n] = g; g += dur(n) + 0.35 + float(d.get('hold') or 0)
clip0 = G[FIRST]
cues = [(a, fpath, off) for i, (a, fpath, off) in enumerate(MUSIC) if a <= LAST and (i + 1 == len(MUSIC) or MUSIC[i + 1][0] > FIRST)]  # drop cues already replaced before this clip
segs = []
for i, (a, fpath, off) in enumerate(cues):
    s0 = starts.get(a, 0.0) if a >= FIRST else 0.0
    nxt = [starts[b] for b, _, _ in cues[i + 1:] if b in starts]
    s1 = nxt[0] if nxt else t
    if s1 <= s0: continue
    segs.append((s0, s1, fpath, off + (0 if a >= FIRST else clip0 - G[a]), a >= FIRST, bool(nxt)))
import re as _re
def lufs(p):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', p, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(_re.findall(r'I:\s+(-?[0-9.]+) LUFS', r)[-1])
mins, mfl = [], []
for i, (s0, s1, fpath, off, fin, fout) in enumerate(segs):
    L = s1 - s0 + (1.5 if fout else 0.0)
    gain = -27.0 - lufs(fpath)   # one fixed gain per track, so levels match across clips
    mins += ['-stream_loop', '-1', '-i', fpath]
    fx = f"[{i}:a]aresample=48000,atrim={off:.3f}:{off + L:.3f},asetpts=PTS-STARTPTS,volume={gain:.2f}dB"
    if fin: fx += ",afade=t=in:d=1.5"
    if fout: fx += f",afade=t=out:st={L - 1.5:.3f}:d=1.5"
    mfl.append(fx + f",adelay={int(s0 * 1000)}:all=1[m{i}]")
if segs:
    mix = ''.join(f'[m{i}]' for i in range(len(segs)))
    mfl.append(f"{mix}amix=inputs={len(segs)}:normalize=0,apad,atrim=0:{t:.3f}[bed]")
    vi = len(segs)
    mfl.append(f"[{vi}:a]asplit=2[v1][v2];[bed][v1]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=500[duck];[v2][duck]amix=inputs=2:normalize=0,alimiter=limit=0.8:level=false[o]")
    subprocess.run(['ffmpeg', '-y', '-v', 'error', *mins, '-i', f'{R}/out/voice.wav', '-filter_complex', ';'.join(mfl), '-map', '[o]', '-ac', '2', '-ar', '48000', f'{R}/out/narration.wav'], check=True)
else:
    shutil.copy(f'{R}/out/voice.wav', f'{R}/out/narration.wav')
print([(d['n'], d['start'], d['dur']) for d in out], 'total', round(t, 2), 'music segs', [(round(a, 1), round(b, 1), os.path.basename(p), round(o, 1)) for a, b, p, o, _, _ in segs])
