"""Every visible picture or full-screen card must stay long enough to be understood.
Sam, 10 Nov 2026: at least 1.5 s (LESSONS 115). Sam, 11 Nov 2026 (Aliens opening with gags): "Some clips are moving way too fast
without the viewer even understanding what the clip was about" -> the floor is now 2.0 s for pictures and full-screen cards
(a card timed to the spoken words, kinetic 'short', may be 1.5 s), and every text gag (aside, headline, banner, stamp,
starburst, pip) must stay up for its reading time: 0.8 s + 0.3 s a word (+0.7 s for a headline's spin-in).
Usage: visible_lint.py TIMELINE.json  (or a scene name: reads $RM/public/$PUB/<scene>/timeline.json)  [MIN=2.0 env]
Exits 1 on any segment under the floor or any text gag under its reading time."""
import json, sys, os
s0 = sys.argv[1]; MIN = float(os.environ.get('MIN', 2.0))
path = s0 if s0.endswith('.json') else f"{os.environ.get('RM', '/home/claude/twice/remotion')}/public/{os.environ.get('PUB', 'zeig')}/{s0}/timeline.json"
t=json.load(open(path))
full=[c for c in t['cards'] if (c['kind'] in('kinetic','title','number','bars') and c.get('style')!='rise') or (c['kind']=='text' and c.get('bg'))]   # 'rise' text sits over the picture, not a full-screen card
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
    short = b-a < floor(c) and i < len(segs)-1   # the chapter's last segment may end early on the cut
    bad += short; print(f"{a:6.2f} {b-a:5.2f}{' <<' if short else '   '}  {w}")
for c in t['cards']:
    if c['kind'] not in ('aside','headline','banner','stamp','starburst','pip'): continue
    need = 0.8 + 0.3*len(str(c.get('text','')).split()) + (0.7 if c['kind']=='headline' else 0) if c['kind']!='pip' else 1.8
    end = min(c['t']+c['dur'], t['dur'])
    if end-c['t'] < need - 0.05: bad += 1; print(f"READ {c['t']:6.2f} {c['kind']} '{str(c.get('text',c.get('img')))[:40]}' up {end-c['t']:.2f} s, needs {need:.2f} s")
print('too fast:', bad)
sys.exit(1 if bad else 0)
