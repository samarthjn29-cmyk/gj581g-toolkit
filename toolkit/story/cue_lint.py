#!/usr/bin/env python3
"""Cue lint: flags cue(n, 'word') calls whose word is spoken more than once in VO-n without an index.
cue() matches case-insensitively and returns the first occurrence, so a repeated word fires on its first use
(the LongChat "Hold that thought" bug, 1 Nov 2026). Usage: cue_lint.py scenes.jsx slides.json"""
import json, re, sys
src, sl = open(sys.argv[1]).read(), json.load(open(sys.argv[2])); sl = sl if isinstance(sl, list) else sl['slides']
norm = lambda w: re.sub(r"[^a-z0-9'\-]", '', w.lower().replace('’', "'"))
VO = {int(d['n']): [norm(w) for w in d['vo_plain'].split()] for d in sl}
bad = 0
for m in re.finditer(r"cue\((\d+),\s*'([^']+)'(?:,\s*(\d+))?", src):
    n, w, k = int(m.group(1)), norm(m.group(2)), m.group(3)
    hits = sum(1 for x in VO.get(n, []) if x == w) or sum(1 for x in VO.get(n, []) if x.startswith(w))
    if hits == 0: print(f'MISSING  cue({n}, {m.group(2)!r}): not in the script'); bad += 1
    elif hits > 1 and k is None: print(f'REPEATED cue({n}, {m.group(2)!r}): spoken {hits}x, add an index (0 = first)'); bad += 1
print('cue lint:', 'clean' if not bad else f'{bad} issue(s)')
