#!/usr/bin/env python3
"""Pace lint (2 Nov 2026, after Sam asked to adopt beat treatments and pacing rules from the Reddit review).
"AI is great at volume, bad at taste: boring edits and too many sound effects." This catches both before render.

Storyboard = the script JSON, one entry per narration line, with two extra fields:
  "treatment": one of TREATMENTS (what kind of picture carries this line)
  "changes":   words in the line where the picture visibly changes (a number lands, a card appears, a cut),
               e.g. ["two", "zero"]; a line start always counts as a change when its treatment or scene differs.
Timing: tts/timing.json from the build (real word times), or none -> estimated at 2.6 words/s (animatic stage).
SFX: a JSON list of [sound, seconds, gain] (the mix writes sfx_cues.json).

Checks
  TREATMENT  every line has a known treatment
  STILL      no stretch longer than MAX_STILL s without a picture change (warn above WARN_STILL)
  SAMEY      no run of the same treatment longer than MAX_RUN s (monotony)
  MONTAGE    no decorative-montage run over 20 s without evidence (channel rule)
  SFX        at most SFX_PER_MIN in any 60 s window, at least SFX_GAP s apart
Usage: pace_lint.py storyboard.json [timing.json] [sfx_cues.json]   (exit 1 on any FAIL)"""
import json, re, sys
TREATMENTS = {'character', 'document', 'chart', 'number', 'map', 'typography', 'evidence-footage', 'montage', 'archive', 'photo', 'motion-graphic', 'title'}
MAX_STILL, WARN_STILL, MAX_RUN, SFX_PER_MIN, SFX_GAP = 6.0, 4.5, 20.0, 8, 1.5
norm = lambda w: re.sub(r"[^a-z0-9']", '', w.lower().replace('’', "'"))

def load(argv):
    S = json.load(open(argv[1])); S = S if isinstance(S, list) else S.get('lines', S.get('slides'))
    T = None; sfx = []
    for p in argv[2:]:
        d = json.load(open(p))
        if isinstance(d, dict) and 'lines' in d: T = {l['id']: l for l in d['lines']}
        elif isinstance(d, list): sfx = d
    return S, T, sfx

def times(S, T):
    """start/end of each line and the time of each word (real if timing given, else 2.6 words/s + 0.3 s gaps)."""
    out, t = [], 0.5
    for l in S:
        if T and l['id'] in T:
            tl = T[l['id']]; ws = tl.get('words') or []
            out.append(dict(l, start=tl['start'], end=tl['end'], wt=[(w[0], w[1]) for w in ws])); continue
        ws = [norm(w) for w in l.get('say', l['text']).split() if norm(w)]; d = len(ws) / 2.6
        out.append(dict(l, start=t, end=t + d, wt=[(w, t + d * i / len(ws)) for i, w in enumerate(ws)])); t += d + 0.3
    return out

def main(argv):
    S, T, sfx = load(argv); L = times(S, T); fails = warns = 0
    def rep(kind, level, msg):
        nonlocal fails, warns
        print(f'{level:4s} {kind:9s} {msg}'); fails += level == 'FAIL'; warns += level == 'WARN'
    for l in L:
        if l.get('treatment') not in TREATMENTS: rep('TREATMENT', 'FAIL', f"{l['id']}: treatment {l.get('treatment')!r} not in {sorted(TREATMENTS)}")
    # picture-change points
    pts = []; prev = None
    for l in L:
        key = (l.get('scene'), l.get('treatment'))
        if key != prev: pts.append((l['start'], f"{l['id']} start ({l.get('treatment')})"))
        prev = key
        for c in l.get('changes', []):
            cw, k = (c, 0) if isinstance(c, str) else (c[0], c[1])
            hits = [t for w, t in l['wt'] if w.startswith(norm(cw))]
            if len(hits) > k: pts.append((hits[k], f"{l['id']} '{cw}'"))
            else: rep('STILL', 'FAIL', f"{l['id']}: change word {cw!r} ({k}) not in the line")
    pts.sort(); end = L[-1]['end'] if L else 0
    for (a, la), (b, lb) in zip(pts, pts[1:] + [(end, 'end')]):
        g = b - a
        if g > MAX_STILL: rep('STILL', 'FAIL', f'{g:4.1f} s without a picture change: {la} -> {lb}')
        elif g > WARN_STILL: rep('STILL', 'WARN', f'{g:4.1f} s without a picture change: {la} -> {lb}')
    # treatment runs
    run = [L[0]] if L else []
    for l in L[1:] + [None]:
        if l is not None and l.get('treatment') == run[0].get('treatment'): run.append(l); continue
        dur = run[-1]['end'] - run[0]['start']; tr = run[0].get('treatment')
        if dur > MAX_RUN: rep('SAMEY', 'FAIL', f"{dur:4.1f} s of '{tr}' ({run[0]['id']}..{run[-1]['id']}): vary the picture")
        if tr == 'montage' and dur > 20: rep('MONTAGE', 'FAIL', f"{dur:4.1f} s of montage without evidence ({run[0]['id']}..{run[-1]['id']})")
        if l is not None: run = [l]
    # sound effects
    ts = sorted(float(x[1]) for x in sfx)
    for i, t in enumerate(ts):
        n = sum(1 for u in ts if t <= u < t + 60)
        if n > SFX_PER_MIN: rep('SFX', 'FAIL', f'{n} sound effects in the minute from {t:.1f} s (max {SFX_PER_MIN})'); break
    for a, b in zip(ts, ts[1:]):
        if b - a < SFX_GAP: rep('SFX', 'WARN', f'sound effects {b - a:.2f} s apart at {a:.1f} s')
    mins = max(end / 60, 1e-6)
    print(f"pace lint: {len(L)} lines, {len(pts)} picture changes ({len(pts) / mins:.0f}/min), {len(ts)} sfx ({len(ts) / mins:.1f}/min): "
          + ('clean' if not fails and not warns else f'{fails} fail(s), {warns} warning(s)'))
    return 1 if fails else 0

if __name__ == '__main__': sys.exit(main(sys.argv))
