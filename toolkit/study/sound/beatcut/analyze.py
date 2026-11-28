import sys, json, numpy as np
rng=np.random.default_rng(7)
def dedupe(c, gap=0.16):
    # a run of detections spaced <= gap is one event (a flash, wipe or fast motion): keep its first time
    out=[]; last=None
    for t in sorted(c):
        if last is None or t-last>gap: out.append(t)
        last=t
    return np.array(out)
def phases(cuts, beats):
    b=np.array(beats); res=[]; dist=[]; per=[]
    for c in cuts:
        k=np.searchsorted(b,c)-1
        if k<0 or k+1>=len(b): continue
        P=b[k+1]-b[k]
        if not (0.25<P<1.2): continue
        res.append(2*np.pi*(c-b[k])/P); per.append(P)
        dist.append(min(c-b[k], b[k+1]-c))
    return np.array(res), np.array(dist), np.array(per)
def stats(cuts, beats, w=0.06):
    ph,d,P=phases(cuts,beats)
    if len(ph)<8: return None
    C=np.cos(ph).mean(); S=np.sin(ph).mean(); R=float(np.hypot(C,S)); n=len(ph)
    p=float(np.exp(-n*R*R))  # Rayleigh approx
    hit=float((d<=w).mean()); chance=float((2*w/P).mean())
    return dict(n=n, hit=hit, chance=chance, R=R, p=p, mean_phase_beats=float((np.angle(C+1j*S)%(2*np.pi))/(2*np.pi)), medP=float(np.median(P)))
def lagscan(cuts, beats, lags=np.arange(-0.6,0.601,0.02), w=0.06):
    best=None; allr=[]
    for L in lags:
        s=stats(cuts-L, beats, w)
        if s: allr.append((float(L), s['hit']-s['chance'], s['R'])); 
    return allr
def onset_test(cuts, onsets, dur, w=0.06, nperm=2000):
    on=np.array(onsets)
    def hit(x): 
        i=np.searchsorted(on,x); a=np.abs(x-on[np.clip(i-1,0,len(on)-1)]); b=np.abs(x-on[np.clip(i,0,len(on)-1)]); return (np.minimum(a,b)<=w).mean()
    h=hit(cuts); null=np.array([hit(rng.uniform(0,dur,len(cuts))) for _ in range(nperm)])
    return dict(hit=float(h), null_mean=float(null.mean()), p=float((null>=h).mean()))
def lag_perm(cuts, beats, dur, nperm=300, w=0.06):
    lags=np.arange(-0.6,0.601,0.02)
    def bestval(c):
        v=[]
        for L in lags:
            s=stats(c-L,beats,w)
            if s: v.append(s['hit']-s['chance'])
        return max(v) if v else -1
    obs=bestval(cuts); null=[bestval(np.sort(rng.uniform(0,dur,len(cuts)))) for _ in range(nperm)]
    return dict(obs=float(obs), null_mean=float(np.mean(null)), p=float((np.array(null)>=obs).mean()))
if __name__=='__main__':
    name, cutsfile, beatfile, start = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
    cuts=dedupe(np.array(json.load(open(cutsfile)))-start)
    B=json.load(open(beatfile)); cuts=cuts[(cuts>0)&(cuts<B['dur'])]
    print(name,'cuts',len(cuts),'tempo',round(B['tempo'],1),'acpeak',round(B['ac_peak'],3))
    for w in (0.04,0.06,0.1):
        print(' beat w=%.2f'%w, stats(cuts,B['beats'],w))
    print(' onset', onset_test(cuts,B['onsets'],B['dur']))
    print(' lag-perm', lag_perm(cuts,B['beats'],B['dur']))
    la=lagscan(cuts,B['beats']); bl=max(la,key=lambda r:r[1]); print(' lag best',bl,' lag0',[r for r in la if abs(r[0])<1e-9])
