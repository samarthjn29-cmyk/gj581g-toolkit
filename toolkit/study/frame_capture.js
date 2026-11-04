window.__run = async function(STEP){
  const C = window.__cap = {frames:[], diffs:[], status:'waiting ad', done:false};
  const p=document.querySelector('#movie_player'); let v=document.querySelector('video');
  for(let i=0;i<180;i++){ v=document.querySelector('video'); if(v) v.muted=true; if(!p.classList.contains('ad-showing') && v && v.duration>60) break; const s=document.querySelector('.ytp-skip-ad-button,.ytp-ad-skip-button-modern,.ytp-skip-ad-button__text'); if(s) s.click(); await new Promise(r=>setTimeout(r,1000)); }
  v=document.querySelector('video'); v.muted=true; v.pause();
  const dur=v.duration; C.dur=dur; C.status='sampling';
  const big=document.createElement('canvas'); big.width=320; big.height=180; const bg=big.getContext('2d');
  const sm=document.createElement('canvas'); sm.width=32; sm.height=18; const sg=sm.getContext('2d',{willReadFrequently:true});
  const grab=()=>{ sg.drawImage(v,0,0,32,18); const d=sg.getImageData(0,0,32,18).data; const g=new Float32Array(576); for(let i=0;i<576;i++) g[i]=(d[i*4]+d[i*4+1]+d[i*4+2])/3; return g; };
  const seek=(t)=>new Promise(r=>{ const h=()=>{v.removeEventListener('seeked',h); setTimeout(r,250);}; v.addEventListener('seeked',h); v.currentTime=t; setTimeout(r,4000); });
  for(let t=1; t<dur-1; t+=STEP){ await seek(t); if(p.classList.contains('ad-showing')) continue; bg.drawImage(v,0,0,320,180); C.frames.push([t, big.toDataURL('image/jpeg',0.6)]); C.prog=t; }
  C.status='pace';
  for(const st of [5, Math.floor(dur*0.5)]){ await seek(st); v.playbackRate=2; await v.play().catch(()=>{}); let prev=grab(); const t0=v.currentTime;
    while(v.currentTime < t0+90 && !v.ended){ await new Promise(r=>setTimeout(r,100)); if(p.classList.contains('ad-showing')) continue; const g=grab(); let s=0; for(let i=0;i<576;i++) s+=Math.abs(g[i]-prev[i]); s/=576; C.diffs.push([+v.currentTime.toFixed(2), +s.toFixed(2)]); prev=g; }
    v.pause(); }
  C.status='done'; C.done=true; return 'ok';
};
window.__metrics=function(){ const D=window.__cap.diffs; const out=[]; let seg=[]; for(let i=0;i<D.length;i++){ if(i>0 && D[i][0]-D[i-1][0]>5){ out.push(seg); seg=[]; } seg.push(D[i]); } out.push(seg);
 return out.map(s=>{ let cuts=[]; for(let i=1;i<s.length;i++){ const [t,d]=s[i]; if(d>18 && d>2.5*Math.max(s[i-1][1],1) && (!cuts.length || t-cuts[cuts.length-1]>0.6)) cuts.push(t);} const span=s[s.length-1][0]-s[0][0]; const motion=s.filter(x=>x[1]>1.5).length/s.length; const still=s.filter(x=>x[1]<0.3).length/s.length; const gaps=cuts.slice(1).map((c,i)=>c-cuts[i]).sort((a,b)=>a-b); return {start:s[0][0], span:+span.toFixed(1), cuts:cuts.length, cutsPerMin:+(cuts.length/span*60).toFixed(1), medianShot:gaps.length?+gaps[Math.floor(gaps.length/2)].toFixed(1):null, motion:+motion.toFixed(2), still:+still.toFixed(2)}; }); };
