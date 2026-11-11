"""Every visible picture or full-screen card must stay at least 1.5 s (Sam, 10 Nov 2026; LESSONS 115).
Usage: visible_lint.py TIMELINE.json  (or a scene name: reads $RM/public/$PUB/<scene>/timeline.json)
Lists each visible segment, marks those under 1.6 s with <<, exits 1 if any is under 1.5 s."""
import json, sys, os
s0 = sys.argv[1]
path = s0 if s0.endswith('.json') else f"{os.environ.get('RM', '/home/claude/twice/remotion')}/public/{os.environ.get('PUB', 'zeig')}/{s0}/timeline.json"
t=json.load(open(path))
full=[c for c in t['cards'] if c['kind'] in('kinetic','title','number') or (c['kind']=='text' and c.get('bg'))]
ev=sorted(set([s['t'] for s in t['shots']]+[c['t'] for c in full]+[c['t']+c['dur'] for c in full]+[t['dur']]))
def what(x):
    for c in full:
        if c['t']<=x<c['t']+c['dur']: return 'CARD '+str(c.get('text'))[:30]
    s=[s for s in t['shots'] if s['t']<=x][-1]; return s['id']+' '+str(s.get('img') or s.get('video') or s.get('page'))
segs=[]
for a,b in zip(ev,ev[1:]):
    w=what((a+b)/2)
    if segs and segs[-1][2]==w: segs[-1][1]=b
    else: segs.append([a,b,w])
for a,b,w in segs: print(f"{a:6.2f} {b-a:5.2f}{' <<' if b-a<1.6 else '   '}  {w}")
print('short:', sum(1 for a,b,w in segs if b-a<1.6), 'of', len(segs))
sys.exit(1 if any(b-a<1.5 for a,b,w in segs[:-1]) else 0)   # the chapter's last segment may end early on the cut
