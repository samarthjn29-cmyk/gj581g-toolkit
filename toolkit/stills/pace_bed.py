# pace_bed.py SCENE TRACK LUFS [startword@near:endword@near ...]
# Slides TRACK so its beats land on as many picture changes as possible, writes music/bed_<scene>.wav,
# turns phrases into music drop-outs (silence under the deadpan line), and rewrites the bed args in mix_<scene>.sh.
import sys,json,re,subprocess,numpy as np,warnings;warnings.filterwarnings('ignore')
import librosa
s,track,lufs=sys.argv[1],sys.argv[2],sys.argv[3]; drops=sys.argv[4:]
T=json.load(open(f'/home/claude/twice/remotion/public/aliens/{s}/timeline.json')); W=T['words']; D=T['dur']
norm=lambda w:re.sub(r'[^a-z0-9]','',w.lower())
def find(w,near): c=[x for x in W if norm(x[0]).startswith(norm(w))]; return min(c,key=lambda x:abs(x[1]-near))
y,sr=librosa.load(f'music/{track}.mp3',sr=22050); L=len(y)/sr
_,b=librosa.beat.beat_track(y=y,sr=sr); B=librosa.frames_to_time(b,sr=sr)
cuts=np.array([x['t'] for x in T['shots'][1:]]+[c['t'] for c in T['cards'] if c['kind'] in('stamp','kinetic','banner','starburst','headline','title')])
span=min(D+5,L-1); best=(0,-1)
for o in np.arange(0,max(0.01,min(60,L-span)),0.01):
    bt=B[(B>=o)&(B<=o+span)]-o
    if len(bt)==0: continue
    h=int(sum(np.min(np.abs(bt-c))<0.06 for c in cuts))
    if h>best[1]: best=(o,h)
o=round(float(best[0]),2)
subprocess.run(['ffmpeg','-v','error','-y','-ss',str(o),'-i',f'music/{track}.mp3','-ar','48000','-ac','2',f'music/bed_{s}.wav'],check=True)
mutes=[]
for d in drops:
    a,bb=d.split(':'); w1,n1=a.split('@'); w2,n2=bb.split('@')
    x1=find(w1,float(n1)); x2=find(w2,float(n2)); mutes.append(f'{max(0,x1[1]-0.25):.2f}:{x2[2]+0.35:.2f}')
mx=open(f'mix_{s}.sh').read()
old=re.search(r'--bed \S+ --bed-lufs \S+( --mute( [0-9.]+:[0-9.]+)+)?',mx).group(0)
keep=re.findall(r'[0-9.]+:[0-9.]+',old.split('--mute')[1]) if '--mute' in old else []
allm=keep+mutes
new=f'--bed music/bed_{s}.wav --bed-lufs {lufs}'+(' --mute '+' '.join(allm) if allm else '')
open(f'mix_{s}.sh','w').write(mx.replace(old,new))
print(s,track,'offset',o,'beat hits',best[1],'of',len(cuts),'mutes',allm)
