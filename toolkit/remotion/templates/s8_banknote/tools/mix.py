# Pilot audio: voice (loudnorm -16) + music cue (about -27 LUFS, ducked under voice) + self-made SFX at on-screen frames.
import json, subprocess, sys
D = '/home/claude/raise'
tim = json.load(open(f'{D}/tts/timing.json')); L = {l['id']: l for l in tim['lines']}; TOTAL = tim['total']
def tw(i, word, k=0):
    l = L[i]
    if 'words' in l: return [w for w in l['words'] if w[0].startswith(word.lower())][k][1]
    ws = l['text'].split(' '); n = -1; idx = 0
    for j, w in enumerate(ws):
        ww = ''.join(c for c in w.lower() if c.isalnum() or c in "-'")
        if n < k and ww.startswith(word.lower()):
            n += 1
            if n == k: idx = j
    ch = [len(w) + 1 for w in ws]
    return l['start'] + (l['end'] - l['start']) * sum(ch[:idx]) / sum(ch)
t0 = lambda i: L[i]['start']; F = 1 / 30
# (sound, seconds, gain dB) — each tied to an on-screen action
cues = [
 ('paper', 0.05, -18), ('typewriter', tw('a2', 'two') - 14 * F, -24), ('typewriter', tw('a3', 'prices') - 6 * F, -24), ('stamp', tw('a3', 'zero'), -16),
 ('paper', t0('b1') - 0.35, -18), ('typewriter', tw('b1', 'five') - 14 * F, -24), ('typewriter', tw('b2', 'prices') - 6 * F, -24), ('stamp', tw('b2', 'four'), -16),
 ('paper', t0('d1') - 0.35, -20), ('coin', tw('d3', 'one'), -18),
 ('paper', t0('p1') - 0.35, -20), ('ding', tw('p1', 'seventy') + 0.7, -19), ('ding', tw('p3', 'sixty') + 0.7, -21), ('stamp', tw('p4', 'twenty', 0) + 4 * F, -17), ('stamp', tw('p4', 'twenty', 2) + 4 * F, -17),
 ('whoosh', t0('s1') - 0.35, -18), ('stamp', tw('s2', 'four'), -15),
 ('stamp', t0('i1') - 0.2, -18), ('paper', tw('i2', 'number') - 0.2, -20),
 ('paper', t0('u1') - 0.35, -20), ('ding', t0('u3') - 0.45, -18), ('coin', t0('u3') + 0.2, -19),
 ('whoosh', t0('t1') - 0.35, -18), ('paper', t0('t2'), -18),
]
json.dump(cues, open(f'{D}/sfx_cues.json', 'w'), indent=0)
music = sys.argv[1] if len(sys.argv) > 1 else '/mnt/user-data/uploads/Decked out Data/media/music/Investigations.mp3'
inp = ['-i', f'{D}/tts/vo.wav', '-i', music] + sum([['-i', f'{D}/sfx/{s}.wav'] for s, _, _ in cues], [])
fc = [f'[0:a]aresample=48000,loudnorm=I=-16:TP=-1.5:LRA=11,asplit=2[vo][key]',
      f'[1:a]aresample=48000,atrim=0:{TOTAL},loudnorm=I=-24:TP=-6,afade=t=in:d=1.2,afade=t=out:st={TOTAL - 2.2}:d=2.2[m0]',
      '[m0][key]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=500:makeup=1[mus]']
labs = []
for i, (s, t, g) in enumerate(cues):
    fc.append(f'[{i + 2}:a]aresample=48000,volume={g}dB,adelay={int(max(0, t) * 1000)}:all=1[s{i}]'); labs.append(f'[s{i}]')
fc.append(f'[vo][mus]{"".join(labs)}amix=inputs={len(cues) + 2}:normalize=0:duration=first,alimiter=limit=0.9[out]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inp, '-filter_complex', ';'.join(fc), '-map', '[out]', '-ar', '48000', '-ac', '2', f'{D}/pilot_mix.wav'], check=True)
r = subprocess.run(['ffmpeg', '-i', f'{D}/pilot_mix.wav', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
print([l for l in r.splitlines() if 'I:' in l][-1])
