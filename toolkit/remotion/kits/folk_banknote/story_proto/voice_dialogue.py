import sys, os, json, numpy as np, subprocess
os.environ.setdefault('KOKORO_DIR','/home/claude/kokoro'); sys.path.insert(0,'/home/claude/toolkit/toolkit/tts')
from synth import tts, trim, SR, voices
from scipy.io import wavfile
V={'barb':('af_heart',1.0),'ann':('bf_emma',0.97)}
L=json.load(open('story/dialogue.json')); LEAD=1.2; t=LEAD; out=[np.zeros(int(LEAD*SR),np.float32)]; tim=[]
os.makedirs('build/lines',exist_ok=True)
for l in L:
    a,m=tts(l['text'],*V[l['who']]); a=trim(a).astype(np.float32); a=a/np.max(np.abs(a))*0.85
    p=f"build/lines/{l['id']}.wav"; wavfile.write(p,SR,(a*32767).astype(np.int16))
    r=subprocess.run(['/home/claude/rhub/Rhubarb-Lip-Sync-1.13.0-Linux/rhubarb','-f','json','-q','--extendedShapes','GHX','-r','phonetic','--dialogFile','/dev/stdin',p],input=l['text'],capture_output=True,text=True)
    cues=json.loads(r.stdout)['mouthCues']
    tim.append(dict(l,start=round(t,3),end=round(t+len(a)/SR,3),mouth=[[round(c['start']+t,3),c['value']] for c in cues]))
    out+= [a,np.zeros(int(l['gap']*SR),np.float32)]; t+=len(a)/SR+l['gap']; print(l['id'],round(len(a)/SR,2),m)
TAIL=3.2; out.append(np.zeros(int(TAIL*SR),np.float32)); t+=TAIL
wavfile.write('public/dialogue.wav',SR,(np.concatenate(out)*32767).astype(np.int16))
json.dump(dict(total=round(t,3),lines=tim),open('src/data/dialogue_timing.json','w'),indent=1); print('total',round(t,2))
