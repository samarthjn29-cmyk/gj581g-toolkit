# join chapters with a 1.2 s breath before each chapter (title frame held). The outgoing bed has already faded;
# the breath carries the NEXT chapter's track lead-in (the bars just before its bed offset), rising softly, and it
# keeps running into the chapter's first 2 s as the chapter's own bed fades in (constant level handoff). Soft whoosh.
# Voice untouched.
import subprocess,numpy as np,soundfile as sf,json,sys,os
C=sys.argv[1:-1]; OUT=sys.argv[-1]; SR=48000; BR=1.2; HO=2.0; TRIM=-3.0
O=json.load(open('music/bed_offsets.json'))
def aud(f,ss=None,t=None):
    a=['ffmpeg','-v','error']+(['-ss',f'{ss:.3f}','-t',f'{t:.3f}'] if ss is not None else [])+['-i',f,'-ac','2','-ar',str(SR),'-f','f32le','-']
    return np.frombuffer(subprocess.run(a,capture_output=True).stdout,np.float32).reshape(-1,2).copy()
wh,wsr=sf.read('sfx/sfx_whoosh.wav',dtype='float32'); wh=wh if wh.ndim==2 else np.stack([wh,wh],1)
if wsr!=SR: wh=np.stack([np.interp(np.linspace(0,len(wh)-1,int(len(wh)*SR/wsr)),np.arange(len(wh)),wh[:,k]) for k in range(2)],1).astype(np.float32)
rms=lambda z:float(np.sqrt((z**2).mean())+1e-9)
parts=[]; vids=[]
for i,pc in enumerate(C):
    s,clip=pc.split(':'); a=aud(clip); vids.append(clip)
    if i:
        o=O[s]; g=10**((o['target']-o['bed_lufs']+TRIM)/20); n=int(BR*SR); h=int(HO*SR)
        st=max(0,o['offset']-BR); seg=aud(f"music/{o['track']}.mp3",st,(o['offset']-st)+HO)*g
        pre=seg[:int((o['offset']-st)*SR)]
        if len(pre)<n:   # offset under 1.2 s: the bars before it are silence, so borrow 1.2 s from a few bars in (whoosh covers the seam)
            pre=aud(f"music/{o['track']}.mp3",o['offset']+6.0-BR,BR)*g
        pre=np.vstack([np.zeros((max(0,n-len(pre)),2),np.float32),pre])[-n:]
        post=seg[len(seg)-h:] if len(seg)>=h else np.zeros((h,2),np.float32)
        up=0.2+0.8*np.linspace(0,1,n)**1.5; pre*=up[:,None]
        post=post*(1-np.linspace(0,1,len(post)))[:,None]
        w=wh[:int(0.9*SR)]; w=w*(rms(pre[n//2:])*0.9/max(rms(w),1e-6)); ws=int(0.2*SR); pre[ws:ws+len(w)]+=w[:n-ws]
        a[:len(post)]+=post
        print(f'->{s}: lead-in gain {20*np.log10(g):.1f} dB, breath rms {20*np.log10(rms(pre)):.1f} dB')
        parts.append(pre)
    parts.append(a)
full=np.vstack(parts); sf.write('clips/_join_audio.wav',full,SR)
I=[];F='';n=len(vids)
for i,v in enumerate(vids):
    I+=['-i',v]; F+=(f'[{i}:v]tpad=start_duration={BR}:start_mode=clone[v{i}];' if i else f'[{i}:v]null[v{i}];')
F+=''.join(f'[v{i}]' for i in range(n))+f'concat=n={n}:v=1:a=0[v]'
subprocess.run(['ffmpeg','-v','error','-y',*I,'-i','clips/_join_audio.wav','-filter_complex',F,'-map','[v]','-map',f'{n}:a','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-c:a','pcm_s16le','clips/_join_pre.mkv'],check=True)
os.remove('clips/_join_audio.wav')
j=subprocess.run(['ffmpeg','-hide_banner','-i','clips/_join_pre.mkv','-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
J=json.loads(j[j.rfind('{'):j.rfind('}')+1])
af=f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={J['input_i']}:measured_TP={J['input_tp']}:measured_LRA={J['input_lra']}:measured_thresh={J['input_thresh']}:offset={J['target_offset']}:linear=true,aresample=48000"
subprocess.run(['ffmpeg','-v','error','-y','-i','clips/_join_pre.mkv','-c:v','copy','-af',af,'-c:a','aac','-b:a','192k','-movflags','+faststart',OUT],check=True)
os.remove('clips/_join_pre.mkv'); print('wrote',OUT)
