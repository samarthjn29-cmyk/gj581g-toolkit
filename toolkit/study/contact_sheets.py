import json,sys,base64,re,os
from PIL import Image, ImageDraw
out=sys.argv[1]; files=sys.argv[2:]; frames=[]
for f in files:
    d=json.load(open(f)); t=d[0]['text'] if isinstance(d,list) else d
    t=t.split('\n\n(captured at')[0].strip()
    arr=json.loads(json.loads(t)) if t.startswith('"') else json.loads(t)
    frames+=arr
os.makedirs(out,exist_ok=True)
import io
ims=[]
for ts,u in frames:
    b=base64.b64decode(u.split(',',1)[1]); im=Image.open(io.BytesIO(b)).convert('RGB'); ims.append((ts,im))
W,H=240,135; per=48
for k in range(0,len(ims),per):
    g=ims[k:k+per]; sh=Image.new('RGB',(W*8,(H+18)*6),'black'); d=ImageDraw.Draw(sh)
    for i,(ts,im) in enumerate(g):
        x,y=(i%8)*W,(i//8)*(H+18); sh.paste(im.resize((W,H)),(x,y)); d.text((x+4,y+H+3),f"{int(ts//60)}:{int(ts%60):02d}",fill=(255,255,0))
    sh.save(f'{out}/sheet{k//per}.jpg',quality=80)
json.dump([ts for ts,_ in ims],open(f'{out}/times.json','w'))
print(len(ims),'frames ->',(len(ims)+per-1)//per,'sheets')
