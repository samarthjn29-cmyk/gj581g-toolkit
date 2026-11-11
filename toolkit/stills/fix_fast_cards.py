#!/usr/bin/env python3
"""Sam, 10 Nov 2026: 'some stills are switching way too fast'. Short kinetic cards must not leave a sliver of the
picture before or after them. For each short card: a sliver after it (< MIN s before the next cut) is swallowed by
extending the card (to at most 3.0 s); a sliver before it (the shot under it started < MIN s earlier) means the card
is dropped. Short cards themselves last at least 1.6 s. Run after build_chapter --norender. Usage: fix_fast_cards.py s [...]  (env PROJ = project folder, RM, PUB as in
build_chapter.sh; defaults are Zeigarnik's)"""
import json, sys, os
MIN = 1.5
Z = os.environ.get('PROJ', '/home/claude/zeig'); RM = os.environ.get('RM', '/home/claude/twice/remotion'); PUB = os.environ.get('PUB', 'zeig')
for s in sys.argv[1:]:
    T = json.load(open(f'{RM}/public/{PUB}/{s}/timeline.json'))
    P = json.load(open(f'{Z}/stills/{s}.json'))
    cuts = sorted(x['t'] for x in T['shots']) + [T['dur']]
    full = [c for c in T['cards'] if c['kind'] in ('kinetic', 'title', 'number') or (c['kind'] == 'text' and c.get('bg'))]
    def key(c): return (c['at'], c.get('word'), c.get('k', 0), c.get('text'))
    edits = {}
    for c in T['cards']:
        if c.get('style') != 'short': continue
        a, d = c['t'], max(1.6, c['dur'])
        prev = max([x for x in cuts if x <= a + 0.01] + [e['t'] + e['dur'] for e in full if e is not c and e['t'] + e['dur'] <= a + 0.01])
        if 0.01 < a - prev < MIN: edits[key(c)] = None; print(f'{s}: drop  "{c["text"]}" (only {a - prev:.2f} s of picture before it)'); continue
        nxt = min([x for x in cuts if x > a + d - 0.01] + [e['t'] for e in full if e is not c and e['t'] > a])
        if nxt - (a + d) < MIN:
            if nxt - a <= 3.0: d = nxt - a; print(f'{s}: extend "{c["text"]}" to {d:.2f} s (covers the sliver after it)')
            else: edits[key(c)] = None; print(f'{s}: drop  "{c["text"]}" (sliver after, too long to cover)'); continue
        if abs(d - c['dur']) > 0.01: edits[key(c)] = round(d, 2)
    out = []
    for c in P['cards']:
        k = key(c)
        if k in edits:
            if edits[k] is None: continue
            c['dur'] = edits[k]
        out.append(c)
    P['cards'] = out
    json.dump(P, open(f'{Z}/stills/{s}.json', 'w'), indent=1, ensure_ascii=False)
