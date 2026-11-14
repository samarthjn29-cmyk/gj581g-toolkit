"""Every visible picture or full-screen card must stay long enough to be understood.
Sam, 10 Nov 2026: at least 1.5 s (LESSONS 115). Sam, 11 Nov 2026 (Aliens opening with gags): "Some clips are moving way too fast
without the viewer even understanding what the clip was about" -> the floor is now 2.0 s for pictures and full-screen cards
(a card timed to the spoken words, kinetic 'short', may be 1.5 s), and every text gag (aside, headline, banner, stamp,
starburst, pip) must stay up for its reading time: 0.8 s + 0.3 s a word (+0.7 s for a headline's spin-in).
Usage: visible_lint.py TIMELINE.json  (or a scene name: reads $RM/public/$PUB/<scene>/timeline.json)  [MIN=2.0 env]
Exits 1 on any segment under the floor or any text gag under its reading time."""
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from opaque import is_opaque
s0 = sys.argv[1]; MIN = float(os.environ.get('MIN', 2.0))
path = s0 if s0.endswith('.json') else f"{os.environ.get('RM', '/home/claude/twice/remotion')}/public/{os.environ.get('PUB', 'zeig')}/{s0}/timeline.json"
t=json.load(open(path))
full=[c for c in t['cards'] if is_opaque(c)]   # shared list in opaque.py (Moctar 14 Nov 2026: 'void' was missing)
ev=sorted(set([s['t'] for s in t['shots']]+[c['t'] for c in full]+[c['t']+c['dur'] for c in full]+[t['dur']]))
def what(x):
    for c in full:
        if c['t']<=x<c['t']+c['dur']: return 'CARD '+str(c.get('text') or c['kind'])[:30], c
    s=[s for s in t['shots'] if s['t']<=x][-1]; return s['id']+' '+str(s.get('img') or s.get('video') or s.get('page')), None
segs=[]
for a,b in zip(ev,ev[1:]):
    w,c=what((a+b)/2)
    if segs and segs[-1][2]==w: segs[-1][1]=b
    else: segs.append([a,b,w,c])
def floor(c): return 1.5 if (c and c['kind']=='kinetic' and c.get('style')=='short') else MIN
bad=0
for i,(a,b,w,c) in enumerate(segs):
    hold = (c or {}).get('joinhold', 0) if a < 0.01 else 0   # a chapter's first card also shows through the join breath (join_breath.py holds frame 0 for 1.2 s)
    short = b-a + hold < floor(c) and i < len(segs)-1   # the chapter's last segment may end early on the cut
    bad += short; print(f"{a:6.2f} {b-a:5.2f}{' <<' if short else '   '}  {w}")
for c in t['cards']:
    if c['kind'] not in ('aside','headline','banner','stamp','starburst','pip'): continue
    need = 0.8 + 0.3*len(str(c.get('text','')).split()) + (0.7 if c['kind']=='headline' else 0) if c['kind']!='pip' else 1.8
    end = min(c['t']+c['dur'], t['dur'])
    if end-c['t'] < need - 0.05: bad += 1; print(f"READ {c['t']:6.2f} {c['kind']} '{str(c.get('text',c.get('img')))[:40]}' up {end-c['t']:.2f} s, needs {need:.2f} s")
# An overlay gag must end on its own picture (Sam, Aliens ch1, 11 Nov 2026: "This red oval shouldn't come on the pilot"):
# a circle, bubble, notify, aside, starburst, label... that runs on past a picture change lands on the wrong picture.
OVER = ('callin', 'grey', 'count', 'circle', 'arrow', 'bubble', 'notify', 'aside', 'starburst', 'stamp', 'labels', 'tag', 'pip', 'lens', 'spotlight', 'censor', 'loading', 'freeze', 'sticker', 'caption', 'meter')
cuts = sorted(set([s['t'] for s in t['shots']] + [c['t'] for c in full]))
for c in t['cards']:
    if c['kind'] not in OVER or c.get('across'): continue   # across: true = deliberately spans the cut
    a, b = c['t'], c['t'] + c['dur']
    x = [k for k in cuts if a + 0.05 < k < b - 0.12]
    if x: bad += 1; print(f"CROSS {a:6.2f} {c['kind']} '{str(c.get('text', c.get('items', '')))[:30]}' runs {b - x[0]:.2f} s past the picture change at {x[0]:.2f}")
# Written visuals (Sam, 12 Nov 2026: "I would like more written visuals on the screen as that will help the viewers to understand
# the video. I think a few pictures have stayed on the clip without giving much information or visual gags."): warn on any
# stretch of more than 3 s where a picture is up with no card, label, bubble, tag or other gag on it.
spans = sorted([(c['t'], c['t'] + c['dur']) for c in t['cards']] + [(x['t'], x['t'] + x['dur']) for x in t['shots'] if x.get('words_in_pic')])   # words_in_pic: the picture itself carries the written words (a painted sign, YOU in the stars)
edges = sorted(set([0.0, t['dur']] + [a for a, b in spans] + [b for a, b in spans] + [s['t'] for s in t['shots']]))
bare = []
for a, b in zip(edges, edges[1:]):
    m = (a + b) / 2
    if not any(x <= m < y for x, y in spans): bare.append([a, b])
merged = []
for a, b in bare:
    if merged and abs(merged[-1][1] - a) < 1e-6: merged[-1][1] = b
    else: merged.append([a, b])
for a, b in merged:
    if b - a > 3.0: print(f"BARE  {a:6.2f} {b - a:.1f} s with no written text or gag on screen (add a label, tag, bubble or card)")
print('too fast:', bad)

# Sliver after a full-screen card (Sam, Aliens 13 Nov 2026, 9:16: the money panels ended 0.9 s before the chapter did and the
# bare picture under them flashed). Opaque card kinds must run to the next cut / chapter end, or leave >= 1.5 s of picture.
_cuts = sorted([x['t'] for x in t['shots']] + [t['dur']])
for c in t['cards']:
    if not is_opaque(c): continue
    e = c['t'] + c.get('dur', 4.5); nx = min([x for x in _cuts if x > e - 0.01] or [t['dur']]); g = nx - e
    if 0.03 < g < 1.5: bad = True; print(f"SLIVER {e:6.2f} {c['kind']} ends {g:.2f} s before the {'chapter end' if nx == t['dur'] else 'next cut'}: extend it (cutOut) or end it earlier")

sys.exit(1 if bad else 0)
