import numpy as np, sys, json
from PIL import Image
ART="/Users/veho/Code/domigo-v2-welle035/apps/web/public/art/g1/paint/ch02/"
S=sys.argv[1]; name=sys.argv[2]; layers=sys.argv[3].split(",")
orig=np.zeros((512,512,4),np.float32)
comp=Image.new("RGBA",(512,512),(0,0,0,0))
for n in layers: comp.alpha_composite(Image.open(ART+n+".png").convert("RGBA"))
oa=np.asarray(comp).astype(np.float32)
ed=Image.open(f"{S}/gen/{name}_edit_1.png").convert("RGB")
def keyed(img):
    a=np.asarray(img).astype(np.float32)
    d=np.sqrt((a[...,0]-255)**2+a[...,1]**2+(a[...,2]-255)**2)
    return a,d
best=None
W=ed.size[0]
for sc in np.arange(0.985,1.016,0.005):
    size=int(round(512*sc))
    r=ed.resize((size,size),Image.LANCZOS); a,d=keyed(r); m=(d>120).astype(np.float32)
    for dx in range(-8,9):
        for dy in range(-8,9):
            # place r at offset (off) so that center scaling about bottom-center? use top-left offset
            ox=dx+(512-size)//2; oy=dy+(512-size)  # bottom-anchored
            canvas=np.zeros((512,512),np.float32)
            x0,y0=max(0,ox),max(0,oy); x1,y1=min(512,ox+size),min(512,oy+size)
            canvas[y0:y1,x0:x1]=m[y0-oy:y1-oy,x0-ox:x1-ox]
            om=(oa[...,3]>128).astype(np.float32)
            # compare only middle columns (unchanged body) 80..420
            e=np.abs(canvas[:,80:420]-om[:,80:420]).mean()
            if best is None or e<best[0]: best=(e,sc,dx,dy)
print(json.dumps({"err":float(best[0]),"scale":float(best[1]),"dx":best[2],"dy":best[3]}))
