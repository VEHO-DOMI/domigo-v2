// PK-R6 · H1 · THE COLOUR-KEY FRINGE DETECTOR (+ repair), shared by the gate
// (check-paint-art.mjs) and the repair tool (strip-key-fringe.mjs) so the two
// can never disagree about what a defect is.
//
// WHAT WENT WRONG. The batch-AF paint was delivered over a MAGENTA key colour
// and cut out against it. Cutting leaves a skin of the key on every alpha
// boundary and on the image border — pure #ff00ff where the cut was clean, and
// a BLENDED pink where the delivered art was resampled afterwards. On a still
// prop nobody sees it. On the TRAVERSAL SURFACES it is reprinted at every loop
// of the texture: the ch01 hall floor tiles a 41-px course about twenty-six
// times across one screen, so a few stray pixels at the course's own wrap edge
// became a pink dot marching along the walkable band at the child's foot level,
// in every frame of every screenshot (PK-R6 round-1 critique, finding 1,
// severity critical).
//
// WHAT COUNTS AS A DEFECT. Magenta-ness is measured as M = min(red, blue) − green:
// how far green sits below BOTH its neighbours, which is what „magenta" means
// numerically and what the key colour maximises (M = 255 for pure #ff00ff).
// A pixel is a defect when BOTH hold:
//   · it is ON THE SKIN — within SKIN_PX of transparency or of the image border,
//     because a cut mark can only live where the cut happened; and
//   · its M is an OUTLIER against this image's own material — the near-top of
//     the M distribution over the image's INTERIOR, plus a margin.
//
// The baseline is per image and self-calibrating, and that is the whole safety
// argument. A fixed hue threshold cannot work here: ch01 ships both a honey-wood
// hall floor whose material never goes magenta at all (interior M ≈ 0) and a
// dusk stage floor that is genuinely violet through its thickness (interior M ≈
// 140). One number would either miss the hall's blended pink or repaint the
// stage. Measuring each image against itself catches the first and leaves the
// second alone — verified in both directions by the gate's tamper check.

import fs from "node:fs";
import { PNG } from "pngjs";

/** How deep the key can bleed inward from a cut. Four, measured: the pure key
 *  sits in the outer one or two, but where the delivered art was RESAMPLED the
 *  blend spreads — the ch01 hall course carries a salmon blob about five px
 *  across at the top corner of its own wrap edge, which is the piece that was
 *  actually printing a dot along the floor every 41 px. */
export const SKIN_PX = 4;
/** Below this alpha a pixel is "cut away" — the boundary the fringe clings to. */
export const CUT_ALPHA = 16;
/** How far above its own material's magenta-ness a skin pixel must sit before
 *  the key is the only explanation. Small on purpose: the key survives a resample
 *  as a SHALLOW blend (the ch01 hall course carries salmon at M ≈ 17 against wood
 *  at M ≈ −38), and it is the blend that tiles into the visible dot. The margin
 *  can be this small because the baseline is per image — the two genuinely violet
 *  courses in ch01 sit at M ≈ 140 and clear their own skin by eighty. */
export const OUTLIER_MARGIN = 8;
/** …and no pixel counts as fringe unless it is at least somewhat magenta, so an
 *  image with no magenta anywhere cannot have its darkest pixels "repaired". */
export const MIN_MAGENTA = 12;
/** Below this many interior pixels an image is all skin (a thin trim strip) and
 *  has no material to calibrate against — it falls back to MIN_MAGENTA alone. */
const MIN_INTERIOR = 64;
/** How far the repair looks for honest colour to replace a fringe pixel with,
 *  and how far it WIDENS the search before concluding there is none. */
const HEAL_RADIUS = 3;
const HEAL_RADIUS_MAX = 24;

/** How magenta a pixel is: how far green falls below both red and blue. */
export const magentaness = (r, g, b) => Math.min(r, b) - g;

/** Load a PNG as {w, h, px} with px the RGBA buffer. */
export const readPng = (file) => {
  const png = PNG.sync.read(fs.readFileSync(file));
  return { w: png.width, h: png.height, px: png.data, png };
};

/** True where a pixel lies within SKIN_PX of transparency or of the border. */
const skinTest = ({ w, h, px }) => {
  const alphaAt = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : px[(y * w + x) * 4 + 3]);
  return (x, y) => {
    if (x < SKIN_PX || y < SKIN_PX || x >= w - SKIN_PX || y >= h - SKIN_PX) return true;
    for (let dy = -SKIN_PX; dy <= SKIN_PX; dy++) {
      for (let dx = -SKIN_PX; dx <= SKIN_PX; dx++) {
        if (alphaAt(x + dx, y + dy) < CUT_ALPHA) return true;
      }
    }
    return false;
  };
};

/**
 * The magenta-ness this image's own material reaches, as the 99.9th percentile
 * over its interior. The top tenth of a percent rather than the maximum: a
 * single stray interior pixel (there are a handful, left by the same delivery)
 * must not raise the bar for the whole image.
 */
export const materialMagentaness = (img) => {
  const { w, h, px } = img;
  const onSkin = skinTest(img);
  const inner = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (px[i + 3] < CUT_ALPHA || onSkin(x, y)) continue;
      inner.push(magentaness(px[i], px[i + 1], px[i + 2]));
    }
  }
  if (inner.length < MIN_INTERIOR) return null;
  inner.sort((a, b) => a - b);
  return inner[Math.min(inner.length - 1, Math.floor(inner.length * 0.999))];
};

/** The M above which a skin pixel of THIS image is the key and not the paint. */
export const fringeThreshold = (img) => {
  const material = materialMagentaness(img);
  return material === null ? MIN_MAGENTA : Math.max(material + OUTLIER_MARGIN, MIN_MAGENTA);
};

/**
 * Every fringe pixel in an image, as {x, y, i} with i an index into the RGBA
 * buffer. Pure; the gate runs this over the whole traversal kit on every CI run.
 */
export const keyFringe = (img, threshold = fringeThreshold(img)) => {
  const { w, h, px } = img;
  const onSkin = skinTest(img);
  const hits = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (px[i + 3] < CUT_ALPHA) continue;
      if (magentaness(px[i], px[i + 1], px[i + 2]) <= threshold) continue;
      if (!onSkin(x, y)) continue;
      hits.push({ x, y, i });
    }
  }
  return hits;
};

/**
 * Heal every fringe pixel: take the mean of the honest colour around it (opaque,
 * not itself over the threshold) in the smallest window that contains any.
 *
 * A fringe pixel with NO honest colour within HEAL_RADIUS_MAX is not part of any
 * painted mass — it is a loose strand of the key floating in the transparency,
 * which is what a cut-out leaves behind when it clips a stray. Those are cut
 * away (alpha 0). Cutting is safe only under that "nothing painted for 24 px"
 * test: an earlier version cut whenever radius 3 came up empty, which opened new
 * transparency beside real art, which grew the skin, which exposed the next
 * pixel — five passes in and it was still eating. With the wide test the tool
 * converges in one pass and the second finds nothing.
 */
export const stripKeyFringe = (img) => {
  const threshold = fringeThreshold(img);
  const hits = keyFringe(img, threshold);
  const isBad = (r, g, b) => magentaness(r, g, b) > threshold;
  return { ...healHits(img, hits, isBad), threshold };
};

/** The heal, shared by both defect classes. `isBad` says which colours may not
 *  be borrowed from — the two classes disagree about what a defect IS, and
 *  agree completely about how to repair one. */
const healHits = (img, hits, isBad) => {
  const { w, h, px } = img;
  if (hits.length === 0) return { healed: 0, cut: 0, total: 0 };
  let healed = 0;
  let cut = 0;
  // read from a snapshot so a healed pixel cannot seed the next heal (the
  // result would depend on scan order, and a deterministic tool may not)
  const src = Uint8Array.from(px);
  const honest = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return null;
    const j = (y * w + x) * 4;
    if (src[j + 3] < CUT_ALPHA) return null;
    if (isBad(src[j], src[j + 1], src[j + 2])) return null;
    return j;
  };
  for (const p of hits) {
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    let nearest = null; // the closest honest pixel found, for the fallback below
    for (let rad = HEAL_RADIUS; rad <= HEAL_RADIUS_MAX && n === 0; rad *= 2) {
      for (let dy = -rad; dy <= rad; dy++) {
        for (let dx = -rad; dx <= rad; dx++) {
          const j = honest(p.x + dx, p.y + dy);
          if (j === null) continue;
          if (nearest === null || dx * dx + dy * dy < nearest.d) nearest = { j, d: dx * dx + dy * dy };
          r += src[j];
          g += src[j + 1];
          b += src[j + 2];
          n++;
        }
      }
    }
    if (n === 0 || nearest === null) { px[p.i + 3] = 0; cut++; continue; }
    let out = [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
    // A MEAN CAN BE MAGENTA even when nothing it averaged is: p2's night
    // classroom sets warm red-browns against deep blues, and their midpoint
    // lands squarely in the key. Averaging there would re-create the very defect
    // we are removing (72 px survived a first repair exactly this way), so a
    // still-magenta mean is discarded for the NEAREST honest pixel — the colour
    // the cut was standing in front of.
    if (isBad(out[0], out[1], out[2])) {
      out = [src[nearest.j], src[nearest.j + 1], src[nearest.j + 2]];
    }
    px[p.i] = out[0];
    px[p.i + 1] = out[1];
    px[p.i + 2] = out[2];
    healed++;
  }
  return { healed, cut, total: hits.length };
};

// ── R5-W3 · A5 · D-51 · THE SECOND CLASS: A SPECK THE IMPORTER WOULD ERASE ───
//
// A blind format checker found 12 violations of the IMPORTER's deletion rule in
// the AQ6 sheet and traced them to the production master: `satchel_a.png` has
// exactly three such pixels — (114,267) (114,268) (212,320) — and every sheet
// built from it inherits them, four cells at a time.
//
// The register prescribed `strip-key-fringe.mjs`. That is a NO-OP here, and the
// reason is in this file's own header: a fringe pixel must be ON THE SKIN,
// „because a cut mark can only live where the cut happened". These three are
// deep in the interior. The detector is not wrong — it is answering a different
// question, and D-51 is a different defect: not a cut mark, but a pixel that the
// IMPORTER's own predicate would silently delete on the next round-trip. So it
// gets its own name, its own detector, and the same repair.
//
// The predicate is the importers' own, verbatim (import-batch-as.mjs#isFringe,
// import-batch-aq7.mjs:101), because the defect is DEFINED as „a pixel any
// import would delete". Copying it here rather than re-deriving it is the point:
// two definitions of one defect is how a gate and a tool come to disagree.
export const importerWouldDelete = (r, g, b) => r > 120 && b > 120 && r - g > 55 && b - g > 55;

/** How big a matching blob may be and still be a SPECK rather than paint.
 *
 *  This cap is the whole safety argument, and it is measured, not guessed: over
 *  the 326 shipped stems the bare predicate matches ~85 000 px across 80 stems —
 *  p2's night classroom and the slide kit are genuinely violet and would be
 *  repainted. Restricted to 8-connected components of at most four pixels it
 *  matches ~47 px across 18 stems. A four-pixel island of near-key colour inside
 *  a painting is not a material; it is a leftover. */
export const SPECK_MAX_PX = 4;

/** Isolated pixels that match the importer's deletion predicate and belong to no
 *  painted mass. Returns the same `{x, y, i}` shape `keyFringe` does. */
export const keySpecks = (img, maxPx = SPECK_MAX_PX) => {
  const { w, h, px } = img;
  const bad = (i) => px[i + 3] >= CUT_ALPHA && importerWouldDelete(px[i], px[i + 1], px[i + 2]);
  const seen = new Uint8Array(w * h);
  const hits = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (seen[p] === 1 || !bad(p * 4)) continue;
      // 8-connected flood over the WHOLE component before judging its size.
      // Stopping early looks like an optimisation and is a defect: the pixels
      // already queued stay marked while their unvisited neighbours do not, so
      // the next scan line re-seeds the same mass as a fresh blob, and a violet
      // wall dissolves into hundreds of „specks". Measured while building this:
      // the early-exit version reported 199 px on one chalk sprite alone.
      const blob = [];
      const stack = [p];
      seen[p] = 1;
      while (stack.length > 0) {
        const q = stack.pop();
        blob.push(q);
        const qx = q % w;
        const qy = (q - qx) / w;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = qx + dx;
            const ny = qy + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const n = ny * w + nx;
            if (seen[n] === 1 || !bad(n * 4)) continue;
            seen[n] = 1;
            stack.push(n);
          }
        }
      }
      if (blob.length > maxPx) continue; // a mass of real paint, not a speck
      for (const q of blob) hits.push({ x: q % w, y: (q - (q % w)) / w, i: q * 4 });
    }
  }
  return hits;
};

/** Heal the specks with the same repair the fringe gets. */
export const stripKeySpecks = (img) => healHits(img, keySpecks(img), importerWouldDelete);

export const writePng = (file, img) => {
  img.png.data = Buffer.from(img.px.buffer, img.px.byteOffset, img.px.byteLength);
  fs.writeFileSync(file, PNG.sync.write(img.png));
};
