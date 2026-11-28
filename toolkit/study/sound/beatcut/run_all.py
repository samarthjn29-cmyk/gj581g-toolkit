import json, numpy as np
from analyze import *
D=json.load(open('all_cuts.json'))
P={ # name: (beatfile, start, step, channel)
 'ven':('vox_venezuela_full',0,0.1,'Vox'),'cre_0':('SDsound_vox_creatine_0',0,0.2,'Vox'),'cre_250':('SDsound_vox_creatine_250',250,0.2,'Vox'),
 'fascism_0':('JHsound_fascism_0',0,0.2,'JH'),'fascism_949':('JHsound_fascism_949',949,0.2,'JH'),
 'nukes_0':('JHsound_nukes_0',0,0.2,'JH'),'nukes_1078':('JHsound_nukes_1078',1078,0.2,'JH'),
 'ocean_0':('JHsound_ocean_0',0,0.2,'JH'),'ocean_840':('JHsound_ocean_840',840,0.2,'JH'),
 'prison_0':('JHsound_prison_0',0,0.2,'JH'),'prison_632':('JHsound_prison_632',632,0.2,'JH'),
 'swiss_0':('JHsound_swiss_0',0,0.2,'JH'),'swiss_650':('JHsound_swiss_650',650,0.2,'JH')}
D['ven']=json.load(open('vox_ven_cuts.json'))
lags=np.round(np.arange(-0.6,0.601,0.02),3)
def onhit(c,on,w=0.06):
    i=np.searchsorted(on,c); a=np.abs(c-on[np.clip(i-1,0,len(on)-1)]); b=np.abs(c-on[np.clip(i,0,len(on)-1)]); return (np.minimum(a,b)<=w)
res={}
for k,(bf,st,step,ch) in P.items():
    B=json.load(open(bf+'.json')); on=np.array(B['onsets'])
    gap=0.16 if step<0.15 else 0.25
    c=dedupe(np.array(D[k])-st,gap); c=c[(c>0.3)&(c<B['dur']-0.3)]
    curve=[onhit(c-L,on).mean() for L in lags]
    nullrate=np.mean([onhit(rng.uniform(0,B['dur'],len(c)),on).mean() for _ in range(300)])
    res[k]=dict(ch=ch,n=len(c),dur=B['dur'],tempo=B['tempo'],ac=B['ac_peak'],curve=curve,null=nullrate,cuts=c.tolist(),beats=B['beats'],onsets=B['onsets'])
    bi=int(np.argmax(curve)); print(k,ch,'n',len(c),'ac',round(B['ac_peak'],2),'best lag',lags[bi],'onset hit',round(curve[bi],2),'null',round(nullrate,2),'hit@0',round(curve[int(np.where(lags==0)[0][0])],2))
json.dump(res,open('res.json','w'))
