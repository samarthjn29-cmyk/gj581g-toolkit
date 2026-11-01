# YouTube captions (.srt) from the same word timings and phrase chunks as the burnt-in captions.
import json, re, sys
W = json.load(open('src/data/words.json')); S = json.load(open('src/data/slides.json'))
chunks = []
for d in S:
    ws = [dict(w, s=d['start'] + 0.2 + w['s'], e=d['start'] + 0.2 + w['e']) for w in W.get(str(d['n']), [])]
    cur = []
    for i, w in enumerate(ws):
        cur.append(w); nx = ws[i + 1] if i + 1 < len(ws) else None; ch = sum(len(q['w']) + 1 for q in cur)
        if not nx or re.search(r'[.?!…]$', w['w']) or ch > 44 or (re.search(r'[,;:—]$', w['w']) and ch > 22) or (nx and nx['s'] - w['e'] > 0.45) or (nx and nx.get('who') != w.get('who')):
            chunks.append(cur); cur = []
ts = lambda t: f"{int(t//3600):02d}:{int(t%3600//60):02d}:{int(t%60):02d},{int(round((t%1)*1000)) % 1000:03d}"
out = []
for i, c in enumerate(chunks):
    s = c[0]['s']; e = min(c[-1]['e'] + 0.5, chunks[i + 1][0]['s'] - 0.02) if i + 1 < len(chunks) else c[-1]['e'] + 0.8
    txt = ' '.join(w['w'].replace('*', '') for w in c)
    out.append(f"{i+1}\n{ts(s)} --> {ts(e)}\n{'– ' + txt if c[0].get('who') == 'viewer' else txt}\n")
open(sys.argv[1], 'w').write('\n'.join(out)); print(len(out), 'captions')
