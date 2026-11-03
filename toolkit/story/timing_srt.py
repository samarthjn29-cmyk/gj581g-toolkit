# YouTube captions (.srt) from a build timing.json (scene/line voicing): shows each line's caption `text`
# (numbers as digits) timed by the spoken `say` word times. Chunks of <= 8 words, split at punctuation.
# Usage: python3 timing_srt.py timing.json out.srt
import json, re, sys
T = json.load(open(sys.argv[1]))
def ts(t): t = max(0, t); return f"{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{int(t % 60):02d},{int(round((t % 1) * 1000)) % 1000:03d}"
caps = []
for l in T['lines']:
    tw = l['text'].split(); W = l.get('words') or [[None, l['start'], l['end']]]; n, m = len(tw), len(W)
    chunks, cur = [], []
    for i, w in enumerate(tw):
        cur.append(i)
        if i == n - 1 or len(cur) >= 8 or (re.search(r'[.?!:;]$', w) and len(cur) >= 3) or (re.search(r',$', w) and len(cur) >= 5):
            chunks.append(cur); cur = []
    for c in chunks:  # text word index -> spoken token index by proportion (text "2010" is two spoken tokens)
        a = W[min(m - 1, round(c[0] * m / n))][1]; b = W[min(m - 1, max(round((c[-1] + 1) * m / n) - 1, round(c[0] * m / n)))][2]
        caps.append([a, b, ' '.join(tw[i] for i in c)])
for i in range(len(caps)):  # hold each caption a little, never over the next one
    nxt = caps[i + 1][0] - 0.02 if i + 1 < len(caps) else caps[i][1] + 0.8
    caps[i][1] = min(caps[i][1] + 0.4, nxt) if nxt > caps[i][1] else caps[i][1]
open(sys.argv[2], 'w').write('\n'.join(f"{i + 1}\n{ts(a)} --> {ts(b)}\n{t}\n" for i, (a, b, t) in enumerate(caps)))
print(len(caps), 'captions,', f"{T['total']:.1f} s")
