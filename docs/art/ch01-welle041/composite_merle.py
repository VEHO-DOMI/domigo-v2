"""welle-041 · Merle-Posen: Codex-Bearbeitung -> Zelle. Ausrichten, Farbe angleichen, nur die Zone uebernehmen."""
import sys, json, os
import numpy as np
from PIL import Image
ART = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../apps/web/public/art/g1/paint/ch01/")
edit_path, ref_json, base_stem, zone_json, out_path = sys.argv[1:6]
PAD = int(sys.argv[6]) if len(sys.argv) > 6 else 0  # transparent columns added on BOTH sides (origin 0.5,1 keeps the body in place)
R = json.load(open(ref_json)); K, ox, oy, w, h = R["K"], R["ox"], R["oy"], R["w"], R["h"]
ox -= PAD * K; w0 = w; w = w + 2 * PAD
zone = json.loads(zone_json)  # {"x0":f,"y0":f,"x1":f,"y1":f} fractions of the cell; keep = complement
F = 8
_b = Image.open(ART + base_stem + ".png").convert("RGBA"); assert _b.size == (w0, h), (_b.size, w0, h)
_p = Image.new("RGBA", (w, h), (0, 0, 0, 0)); _p.paste(_b, (PAD, 0))
base = np.asarray(_p).astype(np.float32) / 255
ed_img = Image.open(edit_path).convert("RGB")
if ed_img.size != (1024, 1536): ed_img = ed_img.resize((1024, 1536), Image.LANCZOS)
M = 240  # magenta margin so a search box never leaves the image
_e = Image.new("RGB", (1024 + 2 * M, 1536 + 2 * M), (255, 0, 255)); _e.paste(ed_img, (M, M)); ed_img = _e; ox += M; oy += M

def keyed(img):
    a = np.asarray(img).astype(np.float32)
    d = np.sqrt((a[..., 0] - 255) ** 2 + a[..., 1] ** 2 + (a[..., 2] - 255) ** 2)
    al = np.clip((d - 60) / 100, 0, 1)
    mag = np.array([255, 0, 255], np.float32)
    rgb = np.where(al[..., None] > 1e-3, (a - (1 - al[..., None]) * mag) / np.maximum(al[..., None], 1e-3), 0)
    return np.dstack([np.clip(rgb, 0, 255) / 255, al])

cx, by = ox + w * K / 2, oy + h * K
def cell(s, dx, dy):
    box = (cx - w * K * s / 2 + dx * K, by - h * K * s + dy * K, cx + w * K * s / 2 + dx * K, by + dy * K)
    return keyed(ed_img.resize((w, h), Image.LANCZOS, box=box))

yy, xx = np.mgrid[0:h, 0:w]
X0, Y0, X1, Y1 = zone["x0"] * w, zone["y0"] * h, zone["x1"] * w, zone["y1"] * h
inside = (xx >= X0) & (xx <= X1) & (yy >= Y0) & (yy <= Y1)
def edge_dist(v, lo, hi, lim):
    dl = np.where(lo <= 0, 1e9, v - lo); dh = np.where(hi >= lim - 1, 1e9, hi - v)
    return np.minimum(dl, dh)
dist = np.minimum(edge_dist(xx, X0, X1, w), edge_dist(yy, Y0, Y1, h))
wgt = np.where(inside, np.clip(dist / F, 0, 1), 0).astype(np.float32)
keep = (~inside) & (dist < 1e8)
keep = ~inside

def err(c):
    return float(np.abs((c[..., 3] > .5).astype(np.float32) - (base[..., 3] > .5))[keep].mean())
best = None
for s in np.arange(0.95, 1.051, 0.01):
    for dx in range(-12, 13, 3):
        for dy in range(-12, 13, 3):
            e = err(cell(s, dx, dy))
            if best is None or e < best[0]: best = (e, s, dx, dy)
_, s0, dx0, dy0 = best
for s in np.arange(s0 - 0.01, s0 + 0.0101, 0.0025):
    for dx in np.arange(dx0 - 3, dx0 + 3.01, 0.5):
        for dy in np.arange(dy0 - 3, dy0 + 3.01, 0.5):
            e = err(cell(s, dx, dy))
            if e < best[0]: best = (e, s, dx, dy)
e, s, dx, dy = best
c = cell(s, dx, dy)
# colour match on the kept, solid body
m = keep & (c[..., 3] > .95) & (base[..., 3] > .95)
before = float(np.abs(c[..., :3][m] - base[..., :3][m]).mean())
for ch in range(3):
    A = np.vstack([c[..., ch][m], np.ones(m.sum())]).T
    g, b = np.linalg.lstsq(A, base[..., ch][m], rcond=None)[0]
    c[..., ch] = np.clip(c[..., ch] * g + b, 0, 1)
after = float(np.abs(c[..., :3][m] - base[..., :3][m]).mean())
po = base[..., :3] * base[..., 3:]; pe = c[..., :3] * c[..., 3:]
A = base[..., 3] * (1 - wgt) + c[..., 3] * wgt
P = po * (1 - wgt[..., None]) + pe * wgt[..., None]
C = np.where(A[..., None] > 1e-4, P / np.maximum(A[..., None], 1e-4), 0)
out = (np.dstack([np.clip(C, 0, 1), A]) * 255 + .5).astype(np.uint8); out[out[..., 3] == 0, :3] = 0
al = out[..., 3] > 16; ys, xs = np.nonzero(al)
if PAD:  # trim the padding back symmetrically, leaving at least 4 px on the tighter side
    cut = max(0, min(int(xs.min()), int(w - 1 - xs.max())) - 4)
    out = out[:, cut:w - cut]; base = base[:, cut:w - cut]; w = w - 2 * cut
    al = out[..., 3] > 16; ys, xs = np.nonzero(al)
Image.fromarray(out).save(out_path)
# lost silhouette: edit alpha inside the zone that falls outside the cell cannot be measured here; report border contact
margins = dict(top=int(ys.min()), left=int(xs.min()), right=int(w - 1 - xs.max()), bottom=int(h - 1 - ys.max()))
changed = int((np.abs(out.astype(int) - (base * 255 + .5).astype(int)).max(axis=2) > 2).sum())
print(json.dumps(dict(out=out_path.split("/")[-1], size=[w, h], align=dict(err=round(e, 4), scale=round(float(s), 4), dx=float(dx), dy=float(dy)),
                      colour_mad=[round(before * 255, 2), round(after * 255, 2)], margins=margins, changed_px=changed)))
