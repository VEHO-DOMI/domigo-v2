#!/bin/sh
# welle-041 · reproduce the five Merle cells from the committed Codex originals.
# 1. references (magenta canvas, 2.5x, bottom-anchored) — what Codex was given
#    python3 make_ref.py merle_a      /tmp/m/caged0_ref.png   (caged1 = originals/merle_caged0_edit.png)
#    python3 make_ref.py merle_settle1 /tmp/m/settle0_ref.png
#    python3 make_ref.py merle_wave0  /tmp/m/wave1_ref.png
#    python3 make_ref.py merle_walk1  /tmp/m/walk3_ref.png
# 2. Codex CLI, built-in image_gen in EDIT mode, prompts/*.txt:
#    codex exec --skip-git-repo-check -s workspace-write -C <dir> "$(cat prompts/merle_<n>.txt)" < /dev/null
# 3. composite (align on the kept body, match colour, take ONLY the zone, 8 px feather; last arg = symmetric padding)
set -e
cd "$(dirname "$0")"
O=../../../apps/web/public/art/g1/paint/ch01
python3 composite_merle.py originals/merle_caged0_edit.png  references/merle_caged0_ref.json  merle_a     '{"x0":0,"y0":0,"x1":1,"y1":0.80}'   $O/merle_caged0.png
python3 composite_merle.py originals/merle_caged1_edit.png  references/merle_caged0_ref.json  merle_a     '{"x0":0,"y0":0,"x1":1,"y1":0.80}'   $O/merle_caged1.png
python3 composite_merle.py originals/merle_settle0_edit.png references/merle_settle0_ref.json merle_settle1 '{"x0":0,"y0":0,"x1":1,"y1":0.62}' $O/merle_settle0.png
python3 composite_merle.py originals/merle_wave1_edit.png   references/merle_wave1_ref.json   merle_wave0 '{"x0":0.5,"y0":0,"x1":1,"y1":0.55}' $O/merle_wave1.png 40
python3 composite_merle.py originals/merle_walk3_edit.png   references/merle_walk3_ref.json   merle_walk1 '{"x0":0,"y0":0.36,"x1":1,"y1":1}'   $O/merle_walk3.png 40
# 4. from the repo root:
#    node --experimental-strip-types scripts/strip-key-fringe.mjs --specks --only merle_
#    oxipng -o 4 --strip none apps/web/public/art/g1/paint/ch01/merle_{caged0,caged1,settle0,wave1,walk3}.png
#    (cd apps/web && node --experimental-strip-types -e "import('./scripts/paint-art-manifest.ts').then(m=>m.writePaintArtManifest(process.cwd()))")
