"""Paint a blink for N_skyeye (Sam, 15 Nov 2026: "Can we make this eye blink?"). Adds a painted lid over the eye; nothing is cut."""
import numpy as np, cv2
from PIL import Image
rng=np.random.default_rng(3)
A=np.asarray(Image.open('../ai/N_skyeye.jpg').convert('RGB')).copy(); H,W=A.shape[:2]; s=W/1100
L=(340*s,240*s); R=(745*s,236*s); top=135*s; bot=315*s
def arc(y_mid,n=300):
    t=np.linspace(0,1,n+1); x=L[0]+(R[0]-L[0])*t; yb=L[1]+(R[1]-L[1])*t
    return np.stack([x, yb+(y_mid-(L[1]+R[1])/2)*4*t*(1-t)],1)
upper=arc(top); lower=arc(bot)
eye=np.zeros((H,W),np.uint8); cv2.fillPoly(eye,[np.vstack([upper,lower[::-1]]).astype(np.int32)],255)
ring=cv2.dilate(eye,np.ones((61,61),np.uint8))-cv2.dilate(eye,np.ones((21,21),np.uint8))
pix=A[ring>0]; base=np.median(pix[pix.sum(1)<260],0)
lidtex=cv2.GaussianBlur(np.ones_like(A,dtype=np.float32)*base + rng.normal(0,7,(H,W,1)),(0,0),5)
for _ in range(70):
    x=int(rng.uniform(L[0]+40*s,R[0]-40*s)); y=int(rng.uniform(top+20*s,bot-20*s)); cv2.circle(lidtex,(x,y),int(rng.uniform(2,5)*s/2.5),(225,222,120),-1,cv2.LINE_AA)
def frame(lid_y,out,full):
    lid=arc(lid_y); poly=np.vstack([upper,(lower if full else lid)[::-1]])
    m=np.zeros((H,W),np.uint8); cv2.fillPoly(m,[poly.astype(np.int32)],255); m=cv2.dilate(m,np.ones((15,15),np.uint8))
    mf=cv2.GaussianBlur(m,(0,0),4)[...,None]/255.
    img=(lidtex*mf+A*(1-mf)).clip(0,255).astype(np.uint8); th=max(4,int(7*s/2.5)); col=(14,28,20)
    cv2.polylines(img,[lid.astype(np.int32)],False,col,thickness=th*2,lineType=cv2.LINE_AA)
    n=len(lid)
    for i in range(30,n-25,24):
        x,y=lid[i]; dx=(i/n-0.5)*40*s/2.5; cv2.line(img,(int(x),int(y)),(int(x+dx),int(y+34*s/2.5)),col,thickness=th,lineType=cv2.LINE_AA)
    Image.fromarray(img).save(out,quality=93); return img
frame((top+bot)/2+5*s,'frames/N_skyeye_half.jpg',False)
c=frame(292*s,'frames/N_skyeye_closed.jpg',True)
Image.fromarray(c).resize((1100,614)).save('/tmp/claude-0/-home-claude/4f679353-75c2-5592-944f-4863c7efe9b2/scratchpad/closed2.jpg')
