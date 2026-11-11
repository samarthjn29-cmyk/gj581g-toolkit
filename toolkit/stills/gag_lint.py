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
if allowed:
    moves = set(m for k in allowed for m in REG[k].get('moves', []))
    for s in P.get('shots', []):
        mv = s.get('move', 'drift')
        if mv not in moves: fails += 1; print(f"  MOVE       {s['id']} '{mv}' is not a move of {allowed} (allowed: {', '.join(sorted(moves))})")
print('outside the chosen schools:', fails)
sys.exit(1 if fails and allowed else 0)
