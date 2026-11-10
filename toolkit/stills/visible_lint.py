import json, sys
s0 = sys.argv[1]
t=json.load(open(f'/home/claude/twice/remotion/public/zeig/{s0}/timeline.json'))
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
