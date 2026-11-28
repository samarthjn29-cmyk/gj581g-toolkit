import json, numpy as np
from analyze import *
R=json.load(open('res.json'))
LAG={'ven':0.28}
rows=[]; allph={'JH':[],'Vox':[]}; hitsum={'JH':[0,0,0.0],'Vox':[0,0,0.0]}
for k,r in R.items():
    L=LAG.get(k,0.0); c=np.array(r['cuts'])-L
    c=c[c>0]
    ph,d,P=phases(c,r['beats'])
    n=len(ph)
    C=np.cos(ph).mean(); S=np.sin(ph).mean(); Rr=float(np.hypot(C,S)); p=float(np.exp(-n*Rr*Rr))
    hit=(d<=0.06); chance=(0.12/P)
    # permutation null for hit rate: random cut times uniform over passage
    nulls=[]
    for _ in range(500):
        u=rng.uniform(0,r['dur'],len(c)); ph2,d2,P2=phases(u,r['beats']); nulls.append((d2<=0.06).mean())
    pp=float((np.array(nulls)>=hit.mean()).mean())
    # half-beat (off-beat) hit too
    rows.append((k,r['ch'],n,round(r['ac'],2),round(r['tempo']),round(hit.mean()*100),round(chance.mean()*100),round(Rr,2),round(p,3),round(pp,3)))
    allph[r['ch']]+=ph.tolist(); hitsum[r['ch']][0]+=int(hit.sum()); hitsum[r['ch']][1]+=n; hitsum[r['ch']][2]+=float(chance.sum())
print('passage ch n ac tempo hit% chance% R p_ray p_perm')
for x in rows: print(*x)
for ch in allph:
    ph=np.array(allph[ch]); n=len(ph); C=np.cos(ph).mean(); S=np.sin(ph).mean(); Rr=np.hypot(C,S)
    print(ch,'pooled n',n,'hit',hitsum[ch][0],'/',hitsum[ch][1],'=',round(100*hitsum[ch][0]/hitsum[ch][1]),'% chance',round(100*hitsum[ch][2]/hitsum[ch][1]),'% R',round(Rr,3),'p',float(np.exp(-n*Rr*Rr)))
# only passages with clear beat (ac>=0.45)
for ch in ['JH','Vox']:
    pass
sel=[r for r in rows if r[3]>=0.45]; print('clear-beat passages:',[(x[0],x[5],x[6]) for x in sel])
