import sys, os, json, numpy as np
os.environ.setdefault('KOKORO_DIR','/home/claude/kokoro'); sys.path.insert(0,'/home/claude/toolkit/toolkit/tts')
from synth import tts, trim, SR
from scipy.io import wavfile
GAP={'p2':0.25,'p3':0.55,'p5':0.3,'p6':0.55,'p7':0.25}
L=json.load(open('story/narr.json')); t=0.5; out=[np.zeros(int(0.5*SR),np.float32)]; tim=[]
for l in L:
    if l['id'] in GAP: g=GAP[l['id']]; out.append(np.zeros(int(g*SR),np.float32)); t+=g
    a,m=tts(l['text'],'am_michael',1.0); a=trim(a).astype(np.float32); a=a/np.max(np.abs(a))*0.85
    tim.append(dict(l,start=round(t,3),end=round(t+len(a)/SR,3))); out.append(a); t+=len(a)/SR
out.append(np.zeros(int(1.2*SR),np.float32)); t+=1.2
wavfile.write('public/narr.wav',SR,(np.concatenate(out)*32767).astype(np.int16))
json.dump(dict(total=round(t,3),lines=tim),open('src/data/narr.json','w'),indent=1); print(round(t,2),[(x['id'],x['start']) for x in tim])
