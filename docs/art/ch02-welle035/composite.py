import numpy as np, sys, json
from PIL import Image
ART="/Users/veho/Code/domigo-v2-welle035/apps/web/public/art/g1/paint/ch02/"
S, name, layer, zones_json = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
zones=json.loads(zones_json)  # list of [x0,y0,x1,y1,feather_side]
orig=np.asarray(Image.open(ART+layer+".png").convert("RGBA")).astype(np.float32)/255
ed=np.asarray(Image.open(f"{S}/gen/{name}_edit_1.png").convert("RGB").resize((512,512),Image.LANCZOS)).astype(np.float32)
d=np.sqrt((ed[...,0]-255)**2+ed[...,1]**2+(ed[...,2]-255)**2)
a=np.clip((d-60)/100,0,1)
mag=np.array([255,0,255],np.float32)
rgb=np.where(a[...,None]>0.001,(ed-(1-a[...,None])*mag)/np.maximum(a[...,None],1e-3),0)
rgb=np.clip(rgb,0,255)/255
edit=np.dstack([rgb,a])
w=np.zeros((512,512),np.float32); F=8
yy,xx=np.mgrid[0:512,0:512]
for x0,y0,x1,y1 in zones:
    inside=(xx>=x0)&(xx<=x1)&(yy>=y0)&(yy<=y1)
    # distance to the zone's inner vertical border (x0 if zone extends right, x1 if left)
    dist=np.minimum(np.minimum(xx-x0,x1-xx),np.minimum(yy-y0,y1-yy))
    edge_ok=np.ones_like(w)
    wz=np.clip(dist/F,0,1)
    # canvas borders don't need feathering
    wz=np.where((x1>=511)&(xx>x1-F),np.clip((xx-x0)/F,0,1)*np.clip(np.minimum(yy-y0,y1-yy)/F if y1<511 else (yy-y0)/F,0,1),wz)
    w=np.maximum(w,np.where(inside,wz,0))
# premultiplied lerp
po=orig[...,:3]*orig[...,3:]; pe=edit[...,:3]*edit[...,3:]
A=orig[...,3]*(1-w)+edit[...,3]*w
P=po*(1-w[...,None])+pe*w[...,None]
C=np.where(A[...,None]>1e-4,P/np.maximum(A[...,None],1e-4),0)
out=np.dstack([np.clip(C,0,1),A])
out8=(out*255+0.5).astype(np.uint8); out8[out8[...,3]==0,:3]=0
Image.fromarray(out8,"RGBA").save(f"{S}/gen/{layer}.png")
changed=np.abs(out8.astype(int)-(orig*255+0.5).astype(int)).max(axis=2)>2
ys,xs=np.nonzero(changed)
print(layer, "changed px", int(changed.sum()), "bbox", (int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())) if len(xs) else None)
al=out8[...,3]>0; ys,xs=np.nonzero(al); print("trim", int(xs.min()),int(ys.min()),int(xs.max()-xs.min()+1),int(ys.max()-ys.min()+1))
