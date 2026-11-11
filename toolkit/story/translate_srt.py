"""Translated .srt from per-line translations: each line keeps the English cue times; its translation is split
into the same number of cues in proportion to the English text, at punctuation or word boundaries.
Translate whole script lines (never cue fragments: the grammar breaks), one JSON {line id: translation} per language.
Usage: translate_srt.py EN_CUES.json LANG_LINES.json OUT.srt   (EN_CUES.json is align_srt.py's .json output)
Order of languages (packaging skill): Hindi, Spanish, Portuguese (Brazil), Indonesian, French, German."""
import json, sys, re
caps = json.load(open(sys.argv[1])); T = json.load(open(sys.argv[2])); OUTP = sys.argv[3]
def ts(x): x = max(0, x); return f"{int(x // 3600):02d}:{int(x % 3600 // 60):02d}:{int(x % 60):02d},{int(round((x % 1) * 1000)) % 1000:03d}"
groups = []
for c in caps:
    if groups and groups[-1][0] == c[3]: groups[-1][1].append(c)
    else: groups.append((c[3], [c]))
missing = [g for g, _ in groups if g not in T]
if missing: sys.exit(f'missing translations: {missing}')
out = []
for lid, cs in groups:
    words = T[lid].split(); n = len(cs)
    if n == 1: out.append((cs[0][0], cs[0][1], T[lid])); continue
    en = [len(c[2]) for c in cs]; tot = sum(en); cum = 0; cuts = []
    pos = [len(' '.join(words[:k + 1])) for k in range(len(words))]; full = pos[-1]
    for k in range(n - 1):
        cum += en[k]; target = full * cum / tot
        best = min(range(len(words) - 1), key=lambda j: abs(pos[j] - target) - (6 if re.search(r'[,.;:?!।]$', words[j]) else 0))
        cuts.append(best)
    cuts = sorted(set(cuts)); prev = -1; parts = []
    for cpos in cuts:
        if cpos > prev: parts.append(' '.join(words[prev + 1:cpos + 1])); prev = cpos
    parts.append(' '.join(words[prev + 1:]))
    parts = [p for p in parts if p]
    # map parts onto cue times (if fewer parts than cues, merge cue spans)
    m = len(parts); spans = [cs[round(i * n / m)][0] for i in range(m)] + [cs[-1][1]]
    for i, p in enumerate(parts): out.append((spans[i], (cs[round((i + 1) * n / m) - 1][1]), p))
open(OUTP, 'w').write('\n'.join(f"{i + 1}\n{ts(a)} --> {ts(b)}\n{t}\n" for i, (a, b, t) in enumerate(out)))
print(OUTP, len(out), 'cues', 'longest', max(len(t) for _, _, t in out))
