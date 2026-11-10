#!/usr/bin/env python3
"""Say it, show it (Sam, 10 Nov 2026: "when we say mind in the script, can we use a mind or brain picture?").
Lists every line where a picturable noun is spoken but no shot is cued on that word, so each can be checked by eye:
either the shot already on screen shows it, or a shot of it goes in on the word. Idioms ("mind you") are skipped.
usage: noun_lint.py script.json plan1.json [plan2.json ...] [--keys mind,brain,door,...]"""
import json, re, sys
args = [a for a in sys.argv[1:] if not a.startswith('--')]
keys = next((a.split('=', 1)[1] for a in sys.argv[1:] if a.startswith('--keys=')), 'mind,brain,door,spring,waiter,cafe,café,coffee,notebook,box,clay,dog,puzzle,children,letter,thesis,lab,podium,cliff,timer,stamps,tabs,email,phone,bed,list,award,corridor,museum,light,paper')
KEY = [k.strip().lower() for k in keys.split(',') if k.strip()]
IDIOM = [r'\bmind you\b', r'\bnever mind\b', r'\bto mind\b']
S = json.load(open(args[0])); L = {l['id']: l['text'] for l in (S['lines'] if isinstance(S, dict) else S)}
for pf in args[1:]:
    P = json.load(open(pf)); cued = {}
    for s in P['shots']: cued.setdefault(s['at'], set()).add((s.get('word') or '').lower())
    for lid, words in cued.items():
        t = L.get(lid, '').lower()
        for i in IDIOM: t = re.sub(i, '', t)
        miss = [k for k in KEY if re.search(r'\b' + re.escape(k), t) and not any(w and (w.startswith(k[:5]) or k.startswith(w)) for w in words)]
        if miss: print(f"{P.get('scene', pf)} {lid}: says {', '.join(miss)}; shots cued on {sorted(w for w in words if w)}")
