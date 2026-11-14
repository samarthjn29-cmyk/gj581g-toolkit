#!/usr/bin/env python3
"""Gag-school check (Sam, 11 Nov 2026: "if I ask you to use south park gags then you should only utilize south park gags").
A scene plan chooses its gag schools with  "gags": ["southpark"]  (names in gag_schools.json; 'house' is always allowed).
Every card must match a recipe of a chosen school, and every shot's camera move must be allowed by a chosen school.
A card may name its recipe ("recipe": "SP-correction"); otherwise the first matching recipe is used.
Without "gags" in the plan nothing is enforced, but the report still shows which school each gag comes from.
Usage: gag_lint.py PLAN.json [--list]   (--list prints every school and recipe)   Exit 1 on any gag outside the chosen schools."""
import json, sys, os
REG = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gag_schools.json')))['schools']
if '--list' in sys.argv:
    for k, s in REG.items():
        print(f"\n{k}: {s['name']}  (moves: {', '.join(s.get('moves', []))})")
        for r in s['recipes']: print(f"   {r['id']:<14} {r['name']}  [{r.get('status', 'built')}]")
    sys.exit(0)
P = json.load(open(sys.argv[1]))
chosen = P.get('gags')
if isinstance(chosen, str): chosen = [chosen]
bad = [g for g in (chosen or []) if g not in REG]
if bad: sys.exit(f"unknown gag school(s): {bad}. Known: {', '.join(REG)}")
allowed = None if chosen is None else ['house'] + chosen
def fits(card, m): return all((k in card) if v == '*' else card.get(k) == v for k, v in m.items())
def schools_of(card):
    if card.get('recipe'):
        return [(k, r) for k, s in REG.items() for r in s['recipes'] if r['id'] == card['recipe']]
    hits = [(k, r) for k, s in REG.items() for r in s['recipes'] if fits(card, r['match'])]
    best = max((len(r['match']) for _, r in hits), default=0)   # the most specific recipe wins (CORRECTION banner over any banner)
    return [(k, r) for k, r in hits if len(r['match']) == best]
fails = 0
print(f"gag schools: {', '.join(allowed) if allowed else 'any (no \"gags\" in the plan)'}")
for c in P.get('cards', []):
    hits = schools_of(c)
    ok = [h for h in hits if allowed is None or h[0] in allowed]
    where = f"{c.get('at')}/{c.get('word', '-')}"
    if not hits: fails += 1; print(f"  NO SCHOOL  {c['kind']:<10} {where}  (add a recipe to gag_schools.json or drop it)"); continue
    if not ok: fails += 1; print(f"  OUTSIDE    {c['kind']:<10} {where}  belongs to {sorted(set(k for k, _ in hits))}"); continue
    k, r = ok[0]
    if k != 'house': print(f"  ok         {c['kind']:<10} {where}  " + ', '.join(f"{rr['id']} ({REG[kk]['name']})" for kk, rr in ok))
# painted gags (Sam, 12 Nov 2026: "Going forward whatever gags we use should be created in the painted AI format"): every gag
# must have a painted look (Paint.jsx, or a P.on branch in Gags.jsx / StillsScene.jsx). Flat Lottie files and video overlays are
# not allowed; flat-only kinds must be given a painted variant before they are used.
PAINTED = {'signoff', 'bubble', 'tag', 'labels', 'circle', 'loading', 'notify', 'count', 'meter', 'stamp', 'aside', 'banner', 'starburst', 'headline',
           'counter', 'pip', 'clock', 'rain', 'overlay', 'glitch', 'kinetic', 'title', 'number', 'bars', 'chain', 'triptych', 'ruler', 'lens',
           'freeze', 'sticker', 'glint', 'text', 'info', 'route', 'pov', 'doc', 'split', 'later', 'chips', 'panels', 'clones', 'pile', 'doodle',
           'jack', 'outline', 'scroll', 'recap', 'hand', 'weather', 'quote', 'ots', 'black',
           # 13 Nov gag studies: drawn in the painted palette in Gags2.jsx (PAINT/HAND/paper)
           'tear', 'void', 'tumble', 'peel', 'letterbox', 'blocks', 'smear', 'linechart', 'listening', 'blueprint', 'bossbar', 'flow', 'telemetry', 'search', 'equation'}
CUTOUT = {'clones', 'jack', 'hand', 'recap', 'pile', 'sticker'}   # these carry a cut-out picture: it must be an AI-painted image (S3_*)
unpainted = 0
if (P.get('finish') or {}).get('gags') != 'flat':
    for c in P.get('cards', []):
        where = f"{c.get('at')}/{c.get('word', '-')}"
        if c['kind'] == 'lottie' or (c['kind'] == 'sticker' and c.get('file')): unpainted += 1; print(f"  NOT PAINTED {c['kind']:<10} {where}  flat Lottie {c.get('file')}: use an AI-painted image (sticker/clock/rain with img)")
        elif c['kind'] == 'overlay' and str(c.get('file', '')).endswith(('.mp4', '.webm', '.mov')): print(f"  note       overlay {where}: the painted kit draws painted grain instead of {c.get('file')}")
        elif c['kind'] in CUTOUT and any(str(c.get(k, '')).endswith('.png') and not str(c.get(k, '')).startswith('S3_') for k in ('img', 'host', 'cut')): print(f"  check      {c['kind']:<10} {where}  cut-out {c.get('img') or c.get('host') or c.get('cut')}: use an AI-painted cut-out (S3_*), not a flat stand-in")
        elif c['kind'] not in PAINTED: unpainted += 1; print(f"  NOT PAINTED {c['kind']:<10} {where}  this kind has no painted look yet: add one in kit/Paint.jsx first")
if allowed:
    moves = set(m for k in allowed for m in REG[k].get('moves', []))
    for s in P.get('shots', []):
        mv = s.get('move', 'drift')
        if mv not in moves: fails += 1; print(f"  MOVE       {s['id']} '{mv}' is not a move of {allowed} (allowed: {', '.join(sorted(moves))})")
print('outside the chosen schools:', fails, ' not painted:', unpainted)
sys.exit(1 if (fails and allowed) or unpainted else 0)
