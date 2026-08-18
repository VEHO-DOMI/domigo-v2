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
import path from "node:path";
import { fileURLToPath } from "node:url";
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

// ── R5-W5 · W4 · DIE EINE QUELLE FÜR DIE SCHLÜSSELFARBE ─────────────────────
//
// H3 hat gemeldet, was der Kommentar bei `importerWouldDelete` oben schon als
// Gefahr benennt: dieselbe Frage — „ist dieser Bildpunkt Schlüsselfarbe?" —
// wird an fünf Stellen im Repo beantwortet. Einmal hier, und je einmal in
// import-batch-aq12/aq15/aq13/as. Nach der Importer-Regel sauber, nach der
// Tor-Regel rot: 424 / 180 / 50 px.
//
// Und die vier Kopien sind bereits AUSEINANDERGELAUFEN, gemessen 2026-08-17:
//   · `keyDistance` liefert in aq12 und aq15 zwei Maße ({euclid, manhattan}),
//     in aq13 nur eines (euclid) — dieselbe Frage, zwei Antwortformen.
//   · `impureKey` existiert in aq12 und aq15 und fehlt in aq13 und as.
//   · die Saumregel heißt in as `isFringe`, in den anderen dreien ist sie ohne
//     Namen in eine `if`-Zeile getippt.
// Der Wortlaut der Saumregel ist heute noch überall gleich. Das ist Glück, kein
// Zustand: nichts hält ihn gleich.
//
// Also stehen die Regeln ab hier EINMAL, benannt und exportiert. Die Importer
// gehören anderen Bahnen (C4/A7/H4) und werden hier NICHT angefasst — was diese
// Runde stattdessen liefert, ist Sichtbarkeit: `key-rules.test.ts` liest die
// Regel jedes Importers aus seiner Quelle, jagt denselben Prüf-Pixelsatz durch
// beide und wird ROT, sobald eine Kopie etwas anderes sagt als dieses Modul.

/** Die Schlüsselfarbe selbst: reines Magenta, über das die Lieferungen gemalt
 *  und aus dem sie geschnitten werden. */
export const KEY_RGB = Object.freeze([255, 0, 255]);

/** Wie weit ein Bildpunkt von der Schlüsselfarbe abliegen darf und trotzdem
 *  Schlüssel IST. 40 ist der Wert, den alle vier Importer tragen (`TOL`) —
 *  gemessen, nicht gewählt: er lässt die Kompressions-Unschärfe der Lieferung
 *  durch und greift nicht in gemalte Magenta-Töne. */
export const KEY_TOL = 40;

/** Ist dieser Bildpunkt die Schlüsselfarbe? (der Importer-`isMagenta`) */
export const isKeyPixel = (r, g, b, tol = KEY_TOL) =>
  Math.hypot(r - KEY_RGB[0], g - KEY_RGB[1], b - KEY_RGB[2]) < tol;

/** RGBA-Puffer aus allem, was hier als Bild durchgereicht wird: `readPng`
 *  liefert `{px}`, pngjs liefert `{data}`. */
const pixelsOf = (img) => img.px ?? img.data;

/**
 * Wie nah kommt das NÄCHSTE undurchsichtige Bildpunkt-Paar der Schlüsselfarbe?
 * Beide Maße, weil beide gebraucht werden: der euklidische Abstand ist die
 * Zahl, an der `isKeyPixel` hängt; der Manhattan-Abstand fängt einen Rest, der
 * in einem einzigen Kanal sitzt und im euklidischen Mittel untergeht.
 *
 * `Infinity` heißt: kein undurchsichtiger Bildpunkt im Bild.
 */
export const keyDistance = (img) => {
  const px = pixelsOf(img);
  let euclid = Infinity;
  let manhattan = Infinity;
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] <= 8) continue;
    const dr = px[i] - KEY_RGB[0];
    const dg = px[i + 1] - KEY_RGB[1];
    const db = px[i + 2] - KEY_RGB[2];
    const e = Math.hypot(dr, dg, db);
    const m = Math.abs(dr) + Math.abs(dg) + Math.abs(db);
    if (e < euclid) euclid = e;
    if (m < manhattan) manhattan = m;
  }
  return { euclid, manhattan };
};

/**
 * Wie viele Bildpunkte sind Schlüsselfarbe, ohne EXAKT die Schlüsselfarbe zu
 * sein. Das ist der Zustand, den ein Importer sehen will, bevor er schneidet:
 * reines #ff00ff schneidet sauber weg, ein angeschmutzter Schlüssel hinterlässt
 * genau den Saum, den dieses Modul oben wieder herausrechnen muss.
 */
export const impureKey = (img) => {
  const px = pixelsOf(img);
  let n = 0;
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    if (!isKeyPixel(r, g, b)) continue;
    if (r !== KEY_RGB[0] || g !== KEY_RGB[1] || b !== KEY_RGB[2]) n++;
  }
  return n;
};

/** Der Prüf-Pixelsatz, an dem Modul und Importer verglichen werden. Er ist so
 *  gebaut, dass RICHTIG und PLAUSIBEL-FALSCH auseinandergehen: die Paare 3/4
 *  und 5/6 liegen KNAPP diesseits und jenseits jeder Schwelle. Ein Satz aus
 *  reinem Magenta und reinem Grau würde jede denkbare Regel gleich beantworten
 *  und deshalb nichts unterscheiden (die Lehre aus W3s erstem, blindem Tamper). */
export const RULE_FIXTURE = Object.freeze([
  { rgb: [255, 0, 255], was: "der reine Schlüssel" },
  { rgb: [128, 128, 128], was: "neutrales Grau — nichts davon" },
  { rgb: [232, 22, 232], was: "Schlüssel mit Kompressions-Unschärfe: Abstand 32, KNAPP innerhalb TOL 40" },
  { rgb: [222, 32, 222], was: "eine Spur weiter draußen: Abstand 47, KNAPP außerhalb TOL 40" },
  { rgb: [121, 65, 121], was: "Saum: r/b = 121 (> 120), r−g = 56 (> 55) — KNAPP darüber" },
  { rgb: [120, 64, 120], was: "derselbe Ton, ein Punkt tiefer: r/b = 120, r−g = 56 — KNAPP darunter" },
  { rgb: [200, 145, 200], was: "blasses Altrosa: hell genug, aber r−g = 55 ist NICHT > 55" },
  // Die beiden folgenden Töne trennen die r−g- und die b−g-Schwelle EINZELN.
  // Ohne sie deckt die jeweils andere Bedingung eine verschobene Schwelle zu —
  // gemessen, nicht vermutet: ein Tamper auf `r − g > 54` in
  // import-batch-aq13.mjs lief 2026-08-17 GRÜN durch, weil jeder Prüfton
  // dieselbe Zahl in beiden Differenzen trug.
  { rgb: [200, 145, 210], was: "r−g = 55 genau, b−g = 65 — trennt die r−g-Schwelle allein" },
  { rgb: [210, 145, 200], was: "b−g = 55 genau, r−g = 65 — trennt die b−g-Schwelle allein" },
  { rgb: [120, 64, 200], was: "r = 120 genau, b weit darüber — trennt die r-Schwelle allein" },
  { rgb: [200, 64, 120], was: "b = 120 genau, r weit darüber — trennt die b-Schwelle allein" },
  { rgb: [180, 5, 90], was: "sattes Rot-Violett: r hoch, b zu niedrig — kein Saum" },
  { rgb: [90, 20, 200], was: "Blau-Violett: b hoch, r zu niedrig — kein Saum" },
  { rgb: [140, 60, 190], was: "echte violette Malerei, wie sie p2 und das Rutschen-Kit tragen" },
]);

// ── Selbsttest (Werkbank; die Gesetze fahren in CI als key-rules.test.ts) ────
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
    && process.argv.includes("--selftest")) {
  let bad = 0;
  const check = (name, got, want) => {
    if (got === want) console.log(`  ✓ ${name}`);
    else { bad++; console.error(`  ✗ ${name} — erwartet ${want}, bekommen ${got}`); }
  };

  // 1 · Der Schlüssel-Test unterscheidet an seiner Schwelle, nicht irgendwo.
  check("reines #ff00ff ist der Schlüssel", isKeyPixel(255, 0, 255), true);
  check("Abstand 32 ist noch Schlüssel", isKeyPixel(232, 22, 232), true);
  check("Abstand 47 ist es nicht mehr", isKeyPixel(222, 32, 222), false);
  check("Grau ist kein Schlüssel", isKeyPixel(128, 128, 128), false);

  // 2 · Die Saumregel ebenso — und zwar auf dem Punkt genau.
  check("r/b 121, r−g 56 ist Saum", importerWouldDelete(121, 65, 121), true);
  check("r/b 120 ist es nicht (die Schwelle ist >, nicht ≥)", importerWouldDelete(120, 64, 120), false);
  check("r−g genau 55 ist kein Saum", importerWouldDelete(200, 145, 200), false);
  // …und der Ton, an dem die NACKTE Regel gefährlich wird: echte violette
  // Malerei erfüllt sie. Das ist kein Fehler der Regel, sondern der Grund,
  // warum `keySpecks` Klumpen über SPECK_MAX_PX gar nicht erst ansieht — die
  // Zahl im Kommentar oben (~85 000 px über 80 Blätter) ist genau diese Masse.
  check("echte violette Malerei erfüllt die NACKTE Saumregel", importerWouldDelete(140, 60, 190), true);

  // 3 · DIE UNTERSCHEIDUNG, auf die es ankommt: die beiden Regeln beantworten
  //     NICHT dieselbe Frage. Ein Prüfsatz, auf dem sie immer übereinstimmen,
  //     würde eine vertauschte Regel nie bemerken.
  const divergent = RULE_FIXTURE.filter(({ rgb }) =>
    isKeyPixel(...rgb) !== importerWouldDelete(...rgb));
  if (divergent.length === 0) {
    bad++;
    console.error("  ✗ Prüfsatz UNTAUGLICH: Schlüssel-Regel und Saum-Regel sagen überall dasselbe "
      + "— er könnte die eine nicht von der anderen unterscheiden");
  } else {
    console.log(`  ✓ Prüfsatz unterscheidet die beiden Regeln (${divergent.length} von ${RULE_FIXTURE.length} Tönen)`);
  }

  // 4 · Abstand und Unreinheit an einem gebauten Bild, nicht an einer Behauptung.
  const mk = (rgba) => {
    const p = new PNG({ width: rgba.length, height: 1 });
    rgba.forEach(([r, g, b, a], n) => {
      p.data[n * 4] = r; p.data[n * 4 + 1] = g; p.data[n * 4 + 2] = b; p.data[n * 4 + 3] = a ?? 255;
    });
    return p;
  };
  check("keyDistance findet den reinen Schlüssel (euklidisch 0)",
    keyDistance(mk([[255, 0, 255], [10, 10, 10]])).euclid, 0);
  check("keyDistance findet den reinen Schlüssel (Manhattan 0)",
    keyDistance(mk([[255, 0, 255], [10, 10, 10]])).manhattan, 0);
  check("keyDistance übersieht einen DURCHSICHTIGEN Schlüsselpunkt",
    keyDistance(mk([[255, 0, 255, 0], [255, 255, 255]])).euclid, Math.hypot(0, 255, 0));
  check("Manhattan sieht einen Rest, der in EINEM Kanal sitzt",
    keyDistance(mk([[255, 40, 255]])).manhattan, 40);
  check("impureKey zählt den angeschmutzten Schlüssel, nicht den reinen",
    impureKey(mk([[255, 0, 255], [232, 22, 232], [128, 128, 128]])), 1);

  // 5 · Der Größen-Deckel ist die ganze Sicherheits-Behauptung von keySpecks:
  //     ein Fleck aus vier Punkten ist ein Rest, eine violette FLÄCHE ist Malerei.
  //     Beide Antworten müssen an einem gebauten Bild fallen, nicht im Kommentar.
  const violet = (w, h) => {
    const p = new PNG({ width: w, height: h });
    for (let i = 0; i < p.data.length; i += 4) {
      p.data[i] = 140; p.data[i + 1] = 60; p.data[i + 2] = 190; p.data[i + 3] = 255;
    }
    return { w, h, px: p.data };
  };
  // 2×2 = vier zusammenhängende Punkte: genau SPECK_MAX_PX, also noch ein Rest…
  check(`ein Fleck von ${SPECK_MAX_PX} Punkten zählt als Rest`, keySpecks(violet(2, 2)).length, 4);
  // …6×6 = 36: eine Fläche, und die fasst das Werkzeug nicht an.
  check("eine violette FLÄCHE (36 Punkte) fasst keySpecks nicht an", keySpecks(violet(6, 6)).length, 0);

  if (bad > 0) { console.error("key-fringe --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log("key-fringe --selftest: OK — Schlüssel- und Saumregel treffen ihre Schwellen auf den Punkt, "
    + "der Prüfsatz unterscheidet sie, beide Abstandsmaße und die Unreinheit sind an gebauten Bildern belegt.");
  process.exit(0);
}
