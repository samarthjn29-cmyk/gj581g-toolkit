import sys, numpy as np, librosa
SR=22050; HOP=2048; fps=SR/HOP
def load(n):
    y,_=librosa.load(f"sep/out/htdemucs/{n}/no_vocals.wav",sr=SR,mono=True)
    c=librosa.feature.chroma_cqt(y=y,sr=SR,hop_length=HOP); c=c/(np.linalg.norm(c,axis=0,keepdims=True)+1e-9)
    W=int(round(fps)); m=c.shape[1]-W+1
    S=np.concatenate([c[:,i:i+m] for i in range(W)],axis=0); S/= (np.linalg.norm(S,axis=0,keepdims=True)+1e-9)
    rms=librosa.feature.rms(y=y,frame_length=4096,hop_length=HOP)[0][:m]
    return y,S,rms>0.15*np.median(rms[rms>0])
a,b=sys.argv[1],sys.argv[2]
ya,Sa,la=load(a); yb,Sb,lb=load(b)
sim=Sa.T@Sb
minlen=int(4*fps); THR=0.92
res=[]
for k in range(-(sim.shape[0]-minlen), sim.shape[1]-minlen):
    d=np.diag(sim,k=k)
    i0=max(0,-k); idx=np.arange(len(d))
    la_=la[i0:i0+len(d)]; lb_=lb[i0+k:i0+k+len(d)]
    n=min(len(d),len(la_),len(lb_)); ok=(d[:n]>=THR)&la_[:n]&lb_[:n]
    i=0
    while i<n:
        if ok[i]:
            j=i
            while j<n and ok[j]: j+=1
            if j-i>=minlen: res.append(((i0+i)/fps,(i0+i+k)/fps,(j-i)/fps,float(d[i:j].mean())))
            i=j
        else: i+=1
res.sort(key=lambda r:-r[2])
kept=[]
for r in res:
    if not any(abs(r[0]-q[0])<2 and abs(r[1]-q[1])<2 for q in kept): kept.append(r)
print(a,'vs',b,'matches >=4 s:',len(kept),'| longest',[ (round(r[0]),round(r[1]),round(r[2],1),round(r[3],2)) for r in kept[:6]])
