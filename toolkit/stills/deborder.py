import sys;from PIL import Image;import numpy as np
for p in sys.argv[1:]:
    raw=p.replace('.jpg','_raw.png'); im=Image.open(raw).convert('RGB'); a=np.asarray(im).astype(int); h,w,_=a.shape
    def edge(get,n):
        for i in range(n//6):
            if get(i).mean()<205 or get(i).std()>40: return i
        return 0
    t=edge(lambda i:a[i,w//4:3*w//4],h); b=edge(lambda i:a[h-1-i,w//4:3*w//4],h); l=edge(lambda i:a[h//4:3*h//4,i],w); r=edge(lambda i:a[h//4:3*h//4,w-1-i],w)
    print(p,t,b,l,r)
    if max(t,b,l,r)==0: continue
    m=lambda x:x+int(0.006*w) if x else 0
    c=im.crop((m(l),m(t),w-m(r),h-m(b))); cw,ch=c.size
    if cw/ch>16/9: nw=int(ch*16/9); c=c.crop(((cw-nw)//2,0,(cw-nw)//2+nw,ch))
    else: nh=int(cw*9/16); c=c.crop((0,(ch-nh)//2,cw,(ch-nh)//2+nh))
    c.resize((1376,768),Image.LANCZOS).save(p,quality=92)
