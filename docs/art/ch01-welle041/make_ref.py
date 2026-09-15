import sys, json, os
from PIL import Image
ART=os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../apps/web/public/art/g1/paint/ch01/")
src, out = sys.argv[1], sys.argv[2]   # src: stem or path
im = Image.open(src if src.endswith(".png") else ART+src+".png").convert("RGBA")
K=2.5; CW,CH=1024,1536
big = im.resize((round(im.width*K), round(im.height*K)), Image.LANCZOS)
ox=(CW-big.width)//2; oy=CH-big.height-160
canvas=Image.new("RGBA",(CW,CH),(255,0,255,255)); canvas.alpha_composite(big,(ox,oy))
canvas.convert("RGB").save(out)
json.dump({"src":src,"K":K,"ox":ox,"oy":oy,"w":im.width,"h":im.height},open(out.replace(".png",".json"),"w"))
print(out, big.size, ox, oy)
