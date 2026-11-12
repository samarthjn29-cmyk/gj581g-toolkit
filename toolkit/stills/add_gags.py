# add_gags.py SCENE GAGS.json : each gag has "near" (clip time of its cue word) and "word"; fills "at" (line id) and "k"
import json,sys,re
s,gf=sys.argv[1:3]
T=json.load(open(f'/home/claude/twice/remotion/public/aliens/{s}/timeline.json')); W=T['words']
L=json.load(open(f'/home/claude/aliens/voice/final/timing_{s}.json'))['lines']
P=json.load(open(f'/home/claude/aliens/stills/{s}.json'))
norm=lambda w:re.sub(r'[^a-z0-9]','',w.lower())
t0=T.get('t0',0)
for g in json.load(open(gf)):
    near=g.pop('near'); w=g['word']
    line=[l for l in L if l['start']-0.35<=near+t0<=l['end']+0.35]
    if not line: print('NO LINE',w,near); continue
    l=line[0]; ls,le=l['start']-t0,l['end']-t0
    hits=[x for x in W if ls-0.3<=x[1]<=le+0.3 and norm(x[0]).startswith(norm(w))]
    if not hits: print('NO WORD',w,near,l['id']); continue
    k=min(range(len(hits)),key=lambda i:abs(hits[i][1]-near))
    g['at']=l['id']; 
    if k: g['k']=k
    P['cards'].append(g); print('ok',g['kind'],w,l['id'],k,round(hits[k][1],2))
json.dump(P,open(f'/home/claude/aliens/stills/{s}.json','w'),indent=1)
