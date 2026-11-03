import json, subprocess, sys, numpy as np, soundfile as sf
C=sys.argv[1]; TEMPO=float(sys.argv[2]) if len(sys.argv)>2 else 1.0; D=json.load(open('mood.json')); sr=24000
def load(p,tempo=1.0):
    if tempo!=1.0:
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',p,'-af',f'atempo={tempo}','fast.wav']); p='fast.wav'
    a,s=sf.read(p,dtype='float32')
    if a.ndim>1: a=a.mean(1)
    if s!=sr:
        import scipy.signal as ss; a=ss.resample_poly(a,sr,s)
    idx=np.where(np.abs(a)>0.01)[0]; a=a[max(0,idx[0]-200):idx[-1]+2400] if len(idx) else a
    return a/ (np.sqrt(np.mean(a**2))+1e-9)*0.08
out=[]
for si,sc in enumerate(D):
    for li,row in enumerate(sc):
        f=f'cb/sam_{si}_{li}.wav' if row[0]=='N' else f'cb/{C}_{si}_{li}.wav'
        out+=[load(f, TEMPO if row[0]=='H' else 1.0), np.zeros(int((0.22 if TEMPO>1 else 0.3)*sr),'float32')]
    out.append(np.zeros(int(1.2*sr),'float32'))
a=np.clip(np.concatenate(out),-0.99,0.99); sf.write('tmp.wav',a,sr)
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','tmp.wav','-af','loudnorm=I=-16','-b:a','128k',f'Heckler_{C}_moods_x{TEMPO}.mp3'])
