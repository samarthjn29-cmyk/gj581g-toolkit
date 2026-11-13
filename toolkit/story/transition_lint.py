#!/usr/bin/env python3
"""Chapter transitions (Sam, 13 Nov 2026: "we need better transitions to a new chapter. My tone shouldn't change dramatically
from one chapter to another ... say something like 'so here's the story'").
For each pair of chapters: the last line of chapter N and the first line of chapter N+1 must
  1. share an energy level (emotion tags in the same band, or one band apart at most), and
  2. be joined by a bridge: the new chapter's first line opens with a hand-off phrase ("So here's the story.", "Which brings us to...",
     "Now, ...", "And that's where ... comes in.") or carries `bridge: true` / a `bridge` text.
Also warns when the first line of a chapter carries a tag different from the last line of the one before (the safest recording is
the same tag across the join; change the tone two or three lines in).
Usage: transition_lint.py SCRIPT_CH0.json SCRIPT_CH1.json ...   (one file per chapter, in order; each {"lines": [...]})
       or one file with lines carrying `scene`.  Exit 1 on any FAIL."""
import json, sys, re
BAND = {'calm': 0, 'thoughtful': 0, 'warmly': 0, 'gently': 0, 'sincere': 0,
        'matter-of-fact': 1, 'knowingly': 1, 'deadpan': 1, 'intrigued': 1, 'curious': 1, 'dry': 1, 'wry': 1,
        'excited': 2, 'playful': 2, 'mischievously': 2, 'laughing': 2, 'dramatic': 2, 'surprised': 2, 'exasperated': 2}
BRIDGE = re.compile(r"^(so[,.!\s]|so here's|here's (the|where|how|what)|which brings|that brings|now[,.\s]|right[,.\s]|and (that|this|so|then|now|it's|it is)|"
                    r"back to|meanwhile|which is where|that's where|this is where|ok(ay)?[,.\s]|but here's|here is|let's|picture this|years later|fast forward)", re.I)
def chapters(paths):
    out = []
    for p in paths:
        d = json.load(open(p)); L = d['lines'] if isinstance(d, dict) else d
        if len(paths) == 1:
            cur = None
            for l in L:
                if l.get('scene') != cur: out.append([]); cur = l.get('scene')
                out[-1].append(l)
        else: out.append(L)
    return out
C = chapters(sys.argv[1:]); bad = 0
for i in range(1, len(C)):
    a, b = C[i - 1][-1], C[i][0]; ta, tb = (a.get('tag') or '').strip('[]'), (b.get('tag') or '').strip('[]')
    ba, bb = BAND.get(ta), BAND.get(tb); txt = b.get('text', '').strip()
    jump = (ba is not None and bb is not None and abs(ba - bb) > 1)
    bridged = bool(b.get('bridge')) or bool(BRIDGE.match(txt))
    tag = 'FAIL' if (jump or not bridged) else ('WARN' if ta != tb else 'ok  ')
    bad += tag == 'FAIL'
    print(f"{tag} ch{i-1}->ch{i}: [{ta}] ...{a.get('text','')[-45:]!r}  ->  [{tb}] {txt[:55]!r}"
          + ('  (tone jump)' if jump else '') + ('' if bridged else '  (no bridge line)') + ('  (tag changes across the join)' if ta != tb and tag != 'FAIL' else ''))
sys.exit(1 if bad else 0)
