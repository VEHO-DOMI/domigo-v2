#!/usr/bin/env node
// R5-W4 · C2 · THE COLOUR TRUTH GATE — the card follows the sheet, by construction.
//              …und seit R5-W6b · W5 (D-420/R132) in ZWEI Kapiteln: die Karte
//              gegen ihr BILD (Kapitel 1) und die Karte gegen ihre eigene
//              ANTWORT (Kapitel 2, vormals `scripts/check-colour-copy.mjs`).
//
// WHY THIS EXISTS. A `restore` card asks the child two questions: what is it, and
// what colour was it. The second answer sits in `ch01.tasks.v2.json` as a typed
// string, and until today NO gate in this repo ever opened a PNG — `check-paint-art`
// proves a stem EXISTS, nothing more. So the colour word was a claim about a
// picture that nobody had ever compared to the picture. Koki replayed the chapter
// on 2026-08-15 and read three of them straight off the screen:
//
//     »Das Buch ist blau, aber es will rot. Uhu-Stick sagt grün, ist orange.
//      Spitzer sagt gelb, ist blau. Lazy — nicht überprüft.«
//
// All three were true. This gate makes that class of defect unrepresentable: it
// opens the sheet the child actually sees, measures it, and holds the card to the
// measurement (R41 — »die Karte folgt dem GEMESSENEN Blatt«).
//
// Run: node scripts/check-colour-truth.mjs            (exit 1 on any violation)
//      node scripts/check-colour-truth.mjs --selftest (proves the red light works)
//
// ── WHAT IS MEASURED, AND HOW THE THRESHOLDS WERE DERIVED ────────────────────
//
// Every number below was derived at the NINE restore sheets of ch01, not chosen
// from a colour-theory table. The derivation is printed here so the next session
// can re-run it rather than trust it.
//
//  1. OPAQUE ONLY (α ≥ 200). A sprite's soft edge blends toward transparent and
//     carries the backdrop, not the object.
//
//  2. THE INK OUTLINE IS NOT A COLOUR (V < 0.22 dropped). Every sprite in this
//     book is drawn with a dark ink contour. Counting it would pull every sheet
//     toward »black«.
//
//  3. PAPER WHITE IS NOT A COLOUR (S < 0.38 dropped). Highlights, page white and
//     the eyes are near-neutral. Measured: the eraser's cream top sits at S 0.21
//     and the school bag's cream body at S 0.32 — both must go; the exercise
//     book's green sits at S 0.44 and the book's blue at S 0.46–0.55 — both must
//     stay. 0.38 is the only cut that does both.
//
//  4. PARCHMENT IS THE STYLE, NOT THE THING (warm hue with chroma < 0.45
//     dropped). This is the one non-obvious rule and it is what makes the gate
//     agree with a human eye. EVERY sprite in this book is painted on the same
//     aged-paper base: the exercise book's page block, the scissors' blades, the
//     glue stick's frame, the book's page edges, the school bag's canvas. That
//     cream is warm (hue ~35–50°) and survives rule 3, so without this rule the
//     exercise book measures »warm 51 % / green 49 %« — MIXED — when what a child
//     sees is plainly a green exercise book with paper in it. With the rule it
//     measures green 76 % (ratio 3.2). Measured warm-band median chroma across
//     the nine: glue stick 0.76 · desk 0.56 · book 0.46 · scissors 0.44 · pen
//     0.40 · exercise book 0.36 · school bag 0.35 · eraser 0.29. The real object
//     colours sit above 0.45, the parchment below it.
//
//  5. CHROMA-WEIGHTED, NOT PIXEL-COUNTED. A big dull area and a small vivid one
//     do not carry the same weight to an eye, and weighting by S·V is what makes
//     the scissors read as ORANGE (vivid handles) rather than as their own larger,
//     duller blades.
//
// ── WHAT THE GATE RULES ON, AND WHAT IT DELIBERATELY DOES NOT ────────────────
//
// The gate rules on the COLOUR FAMILY, and holds the fine word to a ratified
// reading. That split is not a compromise, it is where the measurement is honest:
//
//   · FAMILY is measurable with a wide margin. Measured ratios of first family to
//     second across the nine: 2.5 · 2.8 · 3.2 · 8.8 · 218 · 1457 · 3436 · 7804 ·
//     ∞. Nothing is close to the line.
//   · The FINE WORD inside the warm family is not. Brown IS dull orange — the
//     desk (brown) and the pen (yellow) sit 3.4° apart in hue, and the scissors
//     (orange) have a LOWER median chroma than the desk (brown) because half the
//     sprite is blades. Three separate derivations failed to find a rule with a
//     safe margin, so the gate does not pretend to have one (Drei-Strikes: an
//     honest stop beats a threshold bent until it agrees).
//
// What the gate DOES give the fine word is the property that actually matters:
// the reading is RATIFIED AGAINST A MEASURED NUMBER, and drift re-opens it. When
// Codex AQ12 repaints a sheet, the warm centre moves, the ratified reading goes
// stale, and this gate goes red until the card AND the table are re-decided in
// that same PR. That is »Karte == Blatt per Konstruktion«: the two cannot drift
// apart silently, which is the whole failure this file exists to end.
//
// The families also ARE the »distractors ≥ 60° apart« rule in the only unit this
// gate can defend. red/orange/yellow/brown all live inside one 90° warm arc and
// are NOT 60° apart from each other; blue, green, pink and violet are. So law D
// forbids a second word of the target's OWN family among the options — that is
// exactly »the child must not be able to read the answer off the picture«.

import fs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { checkDualColour, neutralSelftestCases } from "./achromatic-colour.mjs";
import { DUAL_READINGS } from "./achromatic-readings.mjs";
import { ROOT, orphanTaskFiles, paintChapters, skipLedger } from "./paint-chapters.mjs";

const R = process.cwd();
// L0 · D10: der Kapitel-Pfad kommt jetzt aus der geteilten Aufloesung, die vom
// Skript-Ordner aus rechnet — also rechnet auch der Kunst-Pfad von dort, sonst
// mischt ein Lauf ausserhalb des Wurzelordners absolute und relative Pfade.
const ART = path.join(ROOT, "apps", "web", "public", "art", "g1", "paint");
const selftest = process.argv.includes("--selftest");

let failures = 0;
const reported = [];
const fail = (where, msg) => { failures++; reported.push(`${where}: ${msg}`); console.error(`✗ ${where}: ${msg}`); };

/**
 * DIE BINDUNG ALS REINE ENTSCHEIDUNG (Entwurfs-Weg, 2026-09-04).
 *
 * Sie stand als drei verschachtelte `if` mitten im Datei-Lauf, und damit konnte
 * der `--selftest` sie nicht fahren: er beweist Funktionen, keine Dateibaeume.
 * Genau hier ist der Entwurfs-Weg eingebaut worden, also muss genau hier ein
 * rotes Licht nachweisbar sein — sonst ist die Ausnahme eine Behauptung.
 *
 *   `kein-skin`       die Karte bindet an gar kein Blatt
 *   `falsches-blatt`  sie nennt ein anderes Blatt, als die Welt entfaerbt
 *   `kein-blatt`      das genannte Blatt ist nicht gemalt — die MESSUNG entfaellt
 *   `messen`          alles da, das Blatt wird geoeffnet
 *
 * Die ersten beiden sind Aussagen der KARTE ueber sich selbst und brauchen keine
 * Kunst; sie bleiben deshalb auch im Entwurf hart. Nur `kein-blatt` kennt einen
 * Entwurfs-Weg (siehe unten am Lauf).
 */
export const bindingVerdict = ({ skin, art, sheetOnDisk }) => {
  if (skin === undefined) return { verdict: "kein-skin", stem: null };
  const stem = `${skin}_a`;
  if (art === undefined) {
    // ZWEI TORE, EIN FELD (gemessen an #398, beide CI-Laeufe vom 2026-09-04).
    // `check-game-tasks.mjs:943` VERBIETET, ein nicht gemaltes Blatt zu nennen
    // („would fall back silently to text"). Waere die Nennung hier auch im
    // Entwurf Pflicht, forderten die beiden Tore fuer dasselbe Feld das
    // Gegenteil, und ein Entwurfs-Kapitel haette keinen gruenen Weg: ohne Feld
    // rot bei uns, mit Feld rot dort. Also gilt: fehlt das Blatt ohnehin, ist
    // die fehlende Nennung DIESELBE Auslassung wie das fehlende Blatt — ein
    // Eintrag, eine Ratsche.
    // Ist das Blatt dagegen GEMALT, bleibt die fehlende Nennung rot: dann
    // ignoriert die Karte bestellte Kunst. Das ist genau das Gesetz, das
    // `check-game-tasks.mjs:939` aus der anderen Richtung fuehrt.
    return sheetOnDisk ? { verdict: "blatt-nicht-genannt", stem } : { verdict: "kein-blatt", stem };
  }
  if (art !== stem) return { verdict: "falsches-blatt", stem };
  if (!sheetOnDisk) return { verdict: "kein-blatt", stem };
  return { verdict: "messen", stem };
};

// ── the measurement ──────────────────────────────────────────────────────────
// R5-W6b · W5: die Schwellen und die drei Rechnungen, die aus einem Bildpunkt
// eine Materialklasse machen, stehen jetzt in `material-classes.mjs` — EINMAL,
// weil C5 gemeldet hat, dass dieselben Klassen in mehreren Skripten dreifach
// liegen (D-386). Hier werden sie unveraendert weiter-exportiert: jeder Leser
// dieses Tors sieht dieselben Namen und dieselben Werte wie vorher.
export {
  OPAQUE, INK_V, PAPER_S, PARCHMENT, PAPER_HUE, FIELD_MIN_SHARE,
  hsv, familyOf, WORD_FAMILY,
} from "./material-classes.mjs";
import {
  OPAQUE, INK_V, PAPER_S, PARCHMENT, PAPER_HUE, FIELD_MIN_SHARE,
  hsv, familyOf, WORD_FAMILY, fields,
} from "./material-classes.mjs";

/**
 * Measure one RGBA raster. Returns the family shares, the dominant family (or
 * MIXED), and the chroma-weighted centre of the warm mass.
 *
 * `dims` ({w, h}) schaltet die zweite Unterscheidung (D-220) ein: ohne Breite
 * und Höhe gibt es keine Nachbarschaft, also auch kein „zusammenhängendes
 * Feld". Ein Aufruf ohne `dims` sagt das im Ergebnis (`fieldRule: false`), damit
 * niemand die alte Antwort für die neue hält.
 */
export function measure(data, dims = null) {
  const px = data.length / 4;
  const w = dims?.w ?? px;
  const h = dims?.h ?? 1;
  const fieldRule = dims !== null && w * h === px;

  // ── Durchgang 1 · wer ist Kandidat für „Pergament"? ───────────────────────
  const parchCandidate = new Uint8Array(px);
  const outOfPaperBand = new Uint8Array(px);
  let opaqueCount = 0;
  for (let p = 0; p < px; p++) {
    const i = p * 4;
    if (data[i + 3] < OPAQUE) continue;
    opaqueCount++;
    const [hu, s, v] = hsv(data[i], data[i + 1], data[i + 2]);
    if (v < INK_V || s < PAPER_S) continue;
    if (familyOf(hu) !== "warm" || s * v >= PARCHMENT) continue;
    parchCandidate[p] = 1;
    if (hu < PAPER_HUE[0] || hu > PAPER_HUE[1]) outOfPaperBand[p] = 1;
  }

  // ── Die zweite Unterscheidung · welche Kandidaten sind doch Farbe? ─────────
  // Ein gedecktes Farbfeld ist zusammenhängend, groß und liegt außerhalb des
  // Papier-Tonbands. Verstreute dunkle Töne (Schatten, Konturen, Kanten) sind
  // es nicht — auf dem Bestand messen sie zusammen bis zu 3,9 % der Fläche,
  // ihr größtes Feld aber nur 0,37 %.
  const rescued = new Uint8Array(px);
  let rescuedField = 0;
  if (fieldRule && opaqueCount > 0) {
    for (const blob of fields(outOfPaperBand, w, h)) {
      if (blob.length < FIELD_MIN_SHARE * opaqueCount) break; // sortiert: ab hier nur noch kleinere
      rescuedField += blob.length;
      for (const p of blob) rescued[p] = 1;
    }
  }

  // ── Durchgang 2 · die Bilanz ──────────────────────────────────────────────
  const fam = new Map();
  let total = 0, parchment = 0, opaque = 0;
  let wx = 0, wy = 0;
  for (let p = 0; p < px; p++) {
    const i = p * 4;
    if (data[i + 3] < OPAQUE) continue;
    opaque++;
    const [h_, s, v] = hsv(data[i], data[i + 1], data[i + 2]);
    if (v < INK_V || s < PAPER_S) continue;
    const chroma = s * v;
    const f = familyOf(h_);
    if (parchCandidate[p] === 1 && rescued[p] === 0) { parchment += chroma; continue; }
    fam.set(f, (fam.get(f) ?? 0) + chroma);
    total += chroma;
    if (f === "warm") { const rad = (h_ * Math.PI) / 180; wx += chroma * Math.cos(rad); wy += chroma * Math.sin(rad); }
  }
  const rank = [...fam.entries()].sort((a, b) => b[1] - a[1]);
  const share = (n) => (total === 0 ? 0 : n / total);
  const first = rank[0] ? share(rank[0][1]) : 0;
  const second = rank[1] ? share(rank[1][1]) : 0;
  // DOMINANT needs both a floor and a margin: 40 % of the chroma AND 1.5× the
  // runner-up. Measured margins on the nine sheets are 2.5 and up, so nothing
  // real is near this line — it exists to catch a sheet that has no colour.
  const dominant = total > 0 && first >= 0.40 && (second === 0 || first / second >= 1.5) ? rank[0][0] : "MIXED";
  let warmCentre = null;
  if (wx !== 0 || wy !== 0) {
    let a = (Math.atan2(wy, wx) * 180) / Math.PI;
    if (a < 0) a += 360;
    warmCentre = a;
  }
  return {
    dominant, warmCentre, opaque,
    shares: Object.fromEntries(rank.map(([f, n]) => [f, share(n)])),
    ratio: second === 0 ? Infinity : first / second,
    parchmentShare: total + parchment === 0 ? 0 : parchment / (total + parchment),
    // D-220: was die zweite Unterscheidung aus dem Pergament zurückgeholt hat.
    fieldRule,
    rescuedShare: opaque === 0 ? 0 : rescuedField / opaque,
  };
}

// ── THE RATIFIED READINGS ────────────────────────────────────────────────────
// One row per restore skin. `word` is what the card must say; `family` and
// `warmCentre` are what this sheet MEASURED when the reading was ratified.
//
// The drift rule is the point: if a repaint moves the warm centre by more than
// DRIFT degrees, or changes the family, the reading is stale and this gate goes
// red. A new sheet therefore cannot inherit an old colour word in silence — the
// import PR must change the picture, the table and the card together.
export const DRIFT = 6; // degrees; the orange↔brown gap measured here is ~11°
export const READINGS = {
  hund: { word: "brown", family: "warm", warmCentre: 36.573564913503525,
    sourceSha256: "719cf0df00811992181767d216b88ddf6bfe4587613a61f5d69495da286b8abb",
    why: "Imported brown dog with blue collar, inspected 2026-09-12. Unchanged measurement: warm share 0.9962899894561758, blue 0.0036864387333534654, margin 270.25811671359975, parchment 0.08477379264132974. The broad ochre-brown fur dominates; the small blue collar is an accent. This records the fine-word reading and measured centre; no blind pupil colour acceptance is claimed." },
  obj_book: {
    "word": "blue",
    "family": "blue",
    "warmCentre": null,
    "sourceSha256": "5a261651e885e0f456ac298171568f233a5784b2dcd1d45065f46a30831cfd97",
    "why": "Imported and visually inspected 2026-09-13. Lying closed blue book, upward blue cover with small goldcorners and cream pageblock; no face or arms. Unchanged instrument measures {\"shares\":{\"blue\":0.783032721253516,\"warm\":0.21695621737976656,\"green\":0.00001106136673193728},\"ratio\":3.609173918638489,\"warmCentre\":38.53531604098143,\"parchmentShare\":0.060398711460216706}. No blind pupil colour acceptance is claimed."
  },
  obj_schoolbag: {
    "word": "brown",
    "family": "warm",
    "warmCentre": 30.476462294542866,
    "sourceSha256": "b1f86fae145e4899a448af7228e794fbacde0a3d71af821659a12fcd618d69d8",
    "why": "Imported and visually inspected 2026-09-13. Brown cloth backpack preserves narrow petrol binding, brassbuckles and coloured books; ordinary sewn pocket with no face. Unchanged instrument measures {\"shares\":{\"warm\":0.8052441685172048,\"blue\":0.16800081690146196,\"violet\":0.015092049260718849,\"green\":0.007628883748999592,\"pink\":0.0040340815714210556},\"ratio\":4.793096744223019,\"warmCentre\":30.476462294542866,\"parchmentShare\":0.3472137092052961}. No blind pupil colour acceptance is claimed."
  },
  obj_desk: {
    "word": "green",
    "family": "green",
    "warmCentre": null,
    "sourceSha256": "4b79954f035891108844b80a4a6a10a898bce10c1b2c709af4d5ff416ac09931",
    "why": "Imported and visually inspected 2026-09-13 after blind reader identified the old desk as stool-like. Root-approved wide green school desk with broad writing surface and open book shelf. Proportional 560x400 import, no square squeezing. Unchanged full-object instrument measures {\"dominant\":\"green\",\"warmCentre\":56.74231899643538,\"opaque\":97707,\"shares\":{\"green\":0.6659731387396751,\"warm\":0.33402328003984094,\"pink\":3.581220501012332e-06},\"ratio\":1.9937925843379556,\"parchmentShare\":0.04095355418543243,\"fieldRule\":true,\"rescuedShare\":0}. Colour thresholds unchanged; independent pupil rereading follows."
  },
  obj_chair: {
    "word": "yellow",
    "family": "warm",
    "warmCentre": 40.7692712324958,
    "sourceSha256": "3bd5351ed09656001ab694a95d083369f7442ceb47ae0a9ec9d453dccdc63748",
    "why": "Imported and visually inspected 2026-09-13. Yellow painted schoolchair: seat, backrest and fourleg frame, no face or arms. Unchanged instrument measures {\"shares\":{\"warm\":0.9999499346057171,\"pink\":0.00005006539428281891},\"ratio\":19972.87645348422,\"warmCentre\":40.7692712324958,\"parchmentShare\":0.07296497424081153}. No blind pupil colour acceptance is claimed."
  },
  obj_gluestick: {
    "word": "orange",
    "family": "warm",
    "warmCentre": 28.193269019127357,
    "sourceSha256": "bd5f77a7e5f7faa475b0eb528e47c0e56e9deec1eeca7b9d5f8263094618d904",
    "why": "Imported and visually inspected 2026-09-13. Actual cylindrical orange glue stick with flatattached cap and ridged twistbase; the former squeezebottle is replaced. Unchanged instrument measures {\"shares\":{\"warm\":1},\"ratio\":\"Infinity\",\"warmCentre\":28.193269019127357,\"parchmentShare\":0.03597346245383181}. No blind pupil colour acceptance is claimed."
  },
  obj_sharpener: {
    "word": "red",
    "family": "warm",
    "warmCentre": 2.714120764062305,
    "sourceSha256": "e1ac0a2f35d87fd8c636630e13c3b9ae095ea4d8b5af7894a05bdb2753cf0fac",
    "why": "Imported and visually inspected 2026-09-13. Red cube sharpener with narrow silverblade and real pencilhole; red body and limbs. Unchanged instrument measures {\"shares\":{\"warm\":0.9999507631006366,\"pink\":0.00004923689936331342},\"ratio\":20308.971036582036,\"warmCentre\":2.714120764062305,\"parchmentShare\":0.04211281369050682}. No blind pupil colour acceptance is claimed."
  },
  eraser: {
    "word": "pink",
    "family": "pink",
    "warmCentre": null,
    "sourceSha256": "86c91217c897a35ee53c5c53226156611fbe2574a168245bfe49632004cc63c3",
    "why": "Imported and visually inspected 2026-09-13. Pink horizontal eraser body with small cream topedge and gloves. Unchanged instrument measures {\"shares\":{\"pink\":0.99216431406024,\"warm\":0.005658050598506741,\"violet\":0.0020887522660989386,\"green\":0.00008888307515314646},\"ratio\":175.3544435113552,\"warmCentre\":347.0265078274861,\"parchmentShare\":0.024194307231451745}. No blind pupil colour acceptance is claimed."
  },
};

/** Sheets whose measured reading is not confident enough to rule on. Every entry
 *  needs a REASON and an UNTIL, the same discipline scripts/paint-art-allowlist
 *  and the coverage ledger (law 17f) already carry. Empty today: after the
 *  parchment rule every one of the nine sheets ranks a family with margin. */
export const ART_DEBT = {};

// Single neutral colours are a separate measurement, never a relaxed version
// of the chromatic or black-and-white instruments above. Regions are the
// author's anatomical material mask (rectangles or declared polygons with holes), not
// a colour-threshold-selected set of favourable pixels. Source hash + dimensions
// bind that mask to the inspected painting. The whole opaque interior is an
// independent denominator, so a shadow, eye or ink outline cannot stand in for
// the object. The painted curse is a runtime violet layer, not part of this
// restored source image; its world/card binding is checked by the renderer.
export const SINGLE_NEUTRAL_LIMITS = Object.freeze({
  blackMax: 105, blackSpread: 32, whiteMin: 185, whiteSpread: 32, whiteLuma: 200,
  greyMinLuma: 110, greyMaxLuma: 185, greySpread: 24,
  erosion: 2, minRegionSide: 20, regionCoverage: .80, componentShare: .70,
  regionCoreShare: .45, maskInteriorShare: .35, wholeInteriorTargetShare: .60,
});
// Root visually inspected the new neutral paintings on 2026-09-13.
// Their independently authored geometric readings remain source-hash bound.
// Shape: "ch01/pen": {word:"black",sourceSha256,width,height,
//   regions:[{id:"barrel",x,y,w,h}],why:"material, exclusions and measured values"}.
// No existing coloured source is silently ratified under its requested colour.
const neutralMaterialPlan=JSON.parse(fs.readFileSync(path.join(ROOT,"docs/art/ch01-story-gamepass/objects/measurements/neutral-polygon-readings.json"),"utf8"));
export const SINGLE_NEUTRAL_READINGS = Object.fromEntries(Object.entries(neutralMaterialPlan.readings).map(([skin,reading])=>[`ch01/${skin}`,reading]));
const SINGLE_NEUTRALS = new Set(["black", "white", "grey"]);
const qtile = (a) => { a.sort((a,b) => a-b); return a.length ? [.05,.5,.95].map(p => a[Math.floor((a.length-1)*p)]) : []; };
const erodeMask = (mask,w,h,radius) => {
  const out = new Uint8Array(w*h);
  for(let y=radius;y<h-radius;y++) for(let x=radius;x<w-radius;x++) {
    let full=true;
    for(let dy=-radius;dy<=radius&&full;dy++) for(let dx=-radius;dx<=radius;dx++)
      if(!mask[(y+dy)*w+x+dx]) { full=false; break; }
    if(full) out[y*w+x]=1;
  }
  return out;
};
const sumMask = mask => mask.reduce((sum,x) => sum+x,0);
export const singleNeutralPixel = (r,g,b,word) => {
  const lim=SINGLE_NEUTRAL_LIMITS, hi=Math.max(r,g,b), lo=Math.min(r,g,b);
  const spread=hi-lo, luma=.2126*r+.7152*g+.0722*b;
  if(word==="black") return hi<=lim.blackMax && spread<=lim.blackSpread;
  if(word==="white") return lo>=lim.whiteMin && spread<=lim.whiteSpread && luma>=lim.whiteLuma;
  if(word==="grey") return luma>=lim.greyMinLuma && luma<=lim.greyMaxLuma && spread<=lim.greySpread;
  return false;
};
// A polygon records anatomy before colour measurement. Pixel-centre membership
// never consults RGB. Rectangles retain their original integer-area contract.
const crossNeutral = (a,b,c) => (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const onNeutralSegment = (a,b,p) => crossNeutral(a,b,p)===0 && p[0]>=Math.min(a[0],b[0]) && p[0]<=Math.max(a[0],b[0]) && p[1]>=Math.min(a[1],b[1]) && p[1]<=Math.max(a[1],b[1]);
const neutralSegmentsMeet = (a,b,c,d) => {
 const abC=crossNeutral(a,b,c),abD=crossNeutral(a,b,d),cdA=crossNeutral(c,d,a),cdB=crossNeutral(c,d,b);
 return (abC*abD<0 && cdA*cdB<0) || onNeutralSegment(a,b,c) || onNeutralSegment(a,b,d) || onNeutralSegment(c,d,a) || onNeutralSegment(c,d,b);
};
const insideNeutralPolygon = (x,y,points) => {
 let inside=false;
 for(let i=0,j=points.length-1;i<points.length;j=i++) {
  const [a,b]=points[i],[c,d]=points[j];
  if((b>y)!==(d>y) && x<(c-a)*(y-b)/(d-b)+a) inside=!inside;
 }
 return inside;
};
const neutralLoopsMeet = (a,b) => a.some((p,i)=>b.some((q,j)=>neutralSegmentsMeet(p,a[(i+1)%a.length],q,b[(j+1)%b.length])));
export function neutralRegionGeometry(r,w,h) {
 const min=SINGLE_NEUTRAL_LIMITS.minRegionSide;
 if(r.outer===undefined && r.holes===undefined) {
  if(![r.x,r.y,r.w,r.h].every(Number.isInteger)||r.x<0||r.y<0||r.w<min||r.h<min||r.x+r.w>w||r.y+r.h>h) return null;
  return {x:r.x,y:r.y,w:r.w,h:r.h,area:r.w*r.h,mask:null};
 }
 if(['x','y','w','h'].some(k=>r[k]!==undefined)||!Array.isArray(r.outer)||!Array.isArray(r.holes??[])||(r.holes??[]).length>32) return null;
 const loops=[r.outer,...(r.holes??[])];
 for(const points of loops) {
  if(!Array.isArray(points)||points.length<3||points.length>256||points.some(p=>!Array.isArray(p)||p.length!==2||!p.every(Number.isInteger)||p[0]<0||p[1]<0||p[0]>w||p[1]>h)) return null;
  if(new Set(points.map(p=>p.join(','))).size!==points.length) return null;
  const signed=points.reduce((a,p,i)=>a+p[0]*points[(i+1)%points.length][1]-points[(i+1)%points.length][0]*p[1],0);
  if(signed===0) return null;
  for(let i=0;i<points.length;i++) {
   const prev=points[(i+points.length-1)%points.length],p=points[i],next=points[(i+1)%points.length];
   if(crossNeutral(prev,p,next)===0 && !onNeutralSegment(prev,next,p)) return null;
   for(let j=i+1;j<points.length;j++) {
    if(j===i+1 || (i===0&&j===points.length-1)) continue;
    if(neutralSegmentsMeet(p,next,points[j],points[(j+1)%points.length])) return null;
   }
  }
 }
 for(let i=1;i<loops.length;i++) {
  if(neutralLoopsMeet(r.outer,loops[i])||!insideNeutralPolygon(...loops[i][0],r.outer)) return null;
  for(let j=1;j<i;j++) if(neutralLoopsMeet(loops[i],loops[j])||insideNeutralPolygon(...loops[i][0],loops[j])||insideNeutralPolygon(...loops[j][0],loops[i])) return null;
 }
 const x=Math.min(...r.outer.map(p=>p[0])),y=Math.min(...r.outer.map(p=>p[1]));
 const rw=Math.max(...r.outer.map(p=>p[0]))-x,rh=Math.max(...r.outer.map(p=>p[1]))-y;
 if(rw<min||rh<min) return null;
 const mask=new Uint8Array(rw*rh);
 for(let yy=0;yy<rh;yy++) for(let xx=0;xx<rw;xx++) if(insideNeutralPolygon(x+xx+.5,y+yy+.5,r.outer)&&!loops.slice(1).some(hole=>insideNeutralPolygon(x+xx+.5,y+yy+.5,hole))) mask[yy*rw+xx]=1;
 const area=sumMask(mask);
 if(area<min*min) return null;
 return {x,y,w:rw,h:rh,area,mask};
}
export function measureSingleNeutral(png,reading) {
  const errors=[],regions=[],lim=SINGLE_NEUTRAL_LIMITS;
  const {width:w,height:h,data}=png;
  if(!reading || !SINGLE_NEUTRALS.has(reading.word) || !Number.isInteger(w) || !Number.isInteger(h)
    || w!==reading.width || h!==reading.height || data.length!==w*h*4)
    return {errors:["single-neutral: missing or mismatched material frame"],regions};
  if(!Array.isArray(reading.regions) || !reading.regions.length)
    return {errors:["single-neutral: no anatomical body mask"],regions};
  const opaque=new Uint8Array(w*h),target=new Uint8Array(w*h),used=new Uint8Array(w*h);
  for(let p=0;p<w*h;p++) {
    const i=p*4;
    if(data[i+3]<OPAQUE) continue;
    opaque[p]=1;
    if(singleNeutralPixel(data[i],data[i+1],data[i+2],reading.word)) target[p]=1;
  }
  const interior=erodeMask(opaque,w,h,lim.erosion),interiorCount=sumMask(interior);
  const wholeTarget=sumMask(target.map((v,i)=>v*interior[i]));
  const wholeTargetShare=interiorCount ? wholeTarget/interiorCount : 0;
  let maskInterior=0;
  const ids=new Set();
  for(const r of reading.regions) {
    const geometry=r && neutralRegionGeometry(r,w,h);
    if(!r || typeof r.id!=="string" || !r.id.trim() || ids.has(r.id) || !geometry) {
      errors.push("single-neutral: invalid or repeated anatomical region"); continue;
    }
    ids.add(r.id);
    const {area,x:rx,y:ry,w:rw,h:rh,mask:regionMask}=geometry,qualifying=new Uint8Array(rw*rh),lumas=[],spreads=[];
    let overlap=false;
    for(let y=0;y<rh;y++) for(let x=0;x<rw;x++) {
      if(regionMask && !regionMask[y*rw+x]) continue;
      const p=(ry+y)*w+rx+x,i=p*4;
      overlap ||= used[p]===1;
      if(!used[p] && interior[p]) maskInterior++;
      used[p]=1;
      if(interior[p] && target[p]) qualifying[y*rw+x]=1;
      if(opaque[p]) {
        lumas.push(.2126*data[i]+.7152*data[i+1]+.0722*data[i+2]);
        spreads.push(Math.max(...data.subarray(i,i+3))-Math.min(...data.subarray(i,i+3)));
      }
    }
    if(overlap) errors.push(`single-neutral: overlapping region ${r.id}`);
    const count=sumMask(qualifying),largest=fields(qualifying,rw,rh)[0]?.length??0;
    const core=sumMask(erodeMask(qualifying,rw,rh,lim.erosion));
    const m={id:r.id,area,coverage:count/area,componentShare:largest/area,coreShare:core/area,
      lumaQuantiles:qtile(lumas),chromaQuantiles:qtile(spreads)};
    regions.push(m);
    if(m.coverage<lim.regionCoverage || m.componentShare<lim.componentShare || m.coreShare<lim.regionCoreShare)
      errors.push(`single-neutral: ${r.id} is not a broad opaque ${reading.word} body material`);
  }
  const maskInteriorShare=interiorCount ? maskInterior/interiorCount : 0;
  if(maskInteriorShare<lim.maskInteriorShare) errors.push("single-neutral: anatomical mask is only a small detail of the object");
  if(wholeTargetShare<lim.wholeInteriorTargetShare) errors.push("single-neutral: target colour does not dominate the whole opaque body interior");
  return {errors,regions,interiorCount,maskInteriorShare,wholeTargetShare};
}
export function checkSingleNeutral({png,bytes,task,reading}) {
  const errors=[];
  if(!reading) return {errors:["single-neutral: no chapter-qualified anatomical reading"],regions:[]};
  if(!SINGLE_NEUTRALS.has(task.colour) || reading.word!==task.colour) errors.push("single-neutral: card and anatomical reading disagree");
  if(task.curseVisual!=="violet-ink") errors.push("single-neutral: no independent violet ink curse declared");
  if(typeof reading.why!=="string" || !reading.why.trim()) errors.push("single-neutral: reading has no material rationale");
  if(createHash("sha256").update(bytes).digest("hex")!==reading.sourceSha256) errors.push("single-neutral: source changed; body mask must be reviewed");
  const options=task.colourOptions??[];
  if(options.length!==3 || new Set(options).size!==3 || !options.includes(task.colour)
    || options.some(o=>WORD_FAMILY[o]===undefined)) errors.push("single-neutral: invalid taught-colour choices");
  if(options.filter(o=>WORD_FAMILY[o]==="neutral").length!==1) errors.push("single-neutral: a distractor shares the neutral target family");
  const measured=measureSingleNeutral(png,reading);
  return {...measured,errors:[...errors,...measured.errors]};
}
export function singleNeutralSelftestCases() {
  const bytes=Buffer.from("synthetic neutral specimen"),hash=createHash("sha256").update(bytes).digest("hex");
  const make=word=>{
    const width=80,height=80,data=new Uint8Array(width*height*4),v={black:50,white:240,grey:150}[word];
    for(let y=5;y<75;y++) for(let x=5;x<75;x++) data.set([v,v,v,255],(y*width+x)*4);
    return {png:{width,height,data},bytes,task:{colour:word,colourOptions:[word,"blue","pink"],curseVisual:"violet-ink"},
      reading:{word,sourceSha256:hash,width,height,regions:[{id:"main-body",x:12,y:12,w:56,h:56}],why:"Synthetic broad body, not an eye, outline or shadow."}};
  };
  const cases=[];
  const test=(name,word,mutate,green)=>{const a=make(word);mutate(a);const got=checkSingleNeutral(a);cases.push({name:`[single-neutral] ${name}`,pass:(got.errors.length===0)===green,errors:got.errors});};
  const recolour=(a,rgb)=>{for(let p=0;p<80*80;p++) if(a.png.data[p*4+3]) a.png.data.set(rgb,p*4);};
  for(const word of SINGLE_NEUTRALS) test(`${word} broad material`,word,()=>{},true);
  test("warm ivory is not white","white",a=>recolour(a,[208,185,134]),false);
  test("dark saturated blue is not black","black",a=>recolour(a,[25,50,120]),false);
  test("coloured blue-grey is not neutral grey","grey",a=>recolour(a,[90,145,180]),false);
  test("white does not satisfy grey","grey",a=>recolour(a,[240,240,240]),false);
  test("black does not satisfy grey","grey",a=>recolour(a,[45,45,45]),false);
  test("transparent white RGB is not painted material","white",a=>{for(let p=0;p<80*80;p++)a.png.data[p*4+3]=0;},false);
  test("only an opaque outline is not black material","black",a=>{for(let y=8;y<72;y++)for(let x=8;x<72;x++)a.png.data.set([30,90,180,255],(y*80+x)*4);},false);
  test("a genuine neutral shadow on a coloured body is not the body colour","black",a=>{
    recolour(a,[30,90,180]);for(let y=38;y<70;y++)for(let x=10;x<70;x++)a.png.data.set([50,50,50,255],(y*80+x)*4);
    a.reading.regions=[{id:"shadow-only",x:12,y:39,w:56,h:30}];
  },false);
  test("a small central eye is not enough even on neutral material","white",a=>{a.reading.regions=[{id:"eye",x:25,y:25,w:20,h:20}];},false);
  test("sparse neutral specks are not a continuous surface","grey",a=>{for(let y=5;y<75;y++)for(let x=5;x<75;x++)if(x%4===0||y%4===0)a.png.data.set([30,90,180,255],(y*80+x)*4);},false);
  test("a large transparent hole cannot count as coverage","white",a=>{for(let y=28;y<52;y++)for(let x=28;x<52;x++)a.png.data[(y*80+x)*4+3]=0;},false);
  test("overlapping masks cannot double the covered body","grey",a=>a.reading.regions.push({...a.reading.regions[0],id:"duplicate-area"}),false);
  test("source drift invalidates ratification","black",a=>a.bytes=Buffer.from("changed source"),false);
  test("wrong source dimensions invalidate material coordinates","white",a=>a.reading.width=81,false);
  test("missing body regions cannot pass","black",a=>a.reading.regions=[],false);
  test("a missing violet curse cannot make grey look restored","grey",a=>delete a.task.curseVisual,false);
  test("a second neutral choice cannot collapse the colour family","black",a=>a.task.colourOptions=["black","grey","pink"],false);
  test("a missing anatomical reading is red","black",a=>delete a.reading,false);
  test("wrong target name cannot inherit a reading","white",a=>a.reading.word="grey",false);
  test("a coloured accent does not erase a dominant neutral body","white",a=>{for(let y=8;y<14;y++)for(let x=8;x<72;x++)a.png.data.set([30,90,180,255],(y*80+x)*4);},true);
  const polygon=a=>{a.reading.regions=[{id:"main-body",outer:[[12,12],[68,12],[68,68],[12,68]],holes:[]}];};
  test("polygon broad body preserves the material contract","grey",polygon,true);
  {
   const a=make("white"),rect=measureSingleNeutral(a.png,a.reading);polygon(a);
   const poly=measureSingleNeutral(a.png,a.reading);
   cases.push({name:"[single-neutral] polygon rectangle is numerically identical to legacy rectangle",pass:JSON.stringify(rect)===JSON.stringify(poly)});
  }
  test("polygon anatomical hole excludes a nonmaterial screw","grey",a=>{
   polygon(a);a.reading.regions[0].holes=[[[30,30],[50,30],[50,50],[30,50]]];
   for(let y=30;y<50;y++)for(let x=30;x<50;x++)a.png.data.set([230,230,230,255],(y*80+x)*4);
  },true);
  test("polygon tiny eye cannot stand for the body","white",a=>{polygon(a);a.reading.regions[0].outer=[[25,25],[45,25],[45,45],[25,45]];},false);
  test("polygon painted miniature patch on coloured body is rejected","black",a=>{
   polygon(a);recolour(a,[30,90,180]);
   for(let y=25;y<55;y++)for(let x=25;x<55;x++)a.png.data.set([50,50,50,255],(y*80+x)*4);
   a.reading.regions[0].outer=[[25,25],[55,25],[55,55],[25,55]];
  },false);
  test("polygon thin sliver cannot impersonate a broad surface","grey",a=>{polygon(a);a.reading.regions[0].outer=[[12,12],[68,65],[68,68],[12,15]];},false);
  test("polygon crossing boundary is invalid","grey",a=>{polygon(a);a.reading.regions[0].outer=[[12,12],[68,68],[12,68],[68,12]];},false);
  test("polygon crossing with nonzero signed area is invalid","grey",a=>{polygon(a);a.reading.regions[0].outer=[[12,12],[68,60],[12,68],[60,12]];},false);
  test("polygon coordinates outside the source are invalid","grey",a=>{polygon(a);a.reading.regions[0].outer[0]=[-1,12];},false);
  test("polygon fractional coordinates are invalid","grey",a=>{polygon(a);a.reading.regions[0].outer[0]=[12.5,12];},false);
  test("polygon repeated vertex is invalid","grey",a=>{polygon(a);a.reading.regions[0].outer.push([12,12]);},false);
  test("polygon backtracking adjacent edge is invalid","grey",a=>{polygon(a);a.reading.regions[0].outer=[[12,12],[68,12],[40,12],[68,68],[12,68]];},false);
  test("polygon hole outside body is invalid","grey",a=>{polygon(a);a.reading.regions[0].holes=[[[1,1],[8,1],[8,8],[1,8]]];},false);
  test("polygon hole crossing body edge is invalid","grey",a=>{polygon(a);a.reading.regions[0].holes=[[[60,30],[72,30],[72,40],[60,40]]];},false);
  test("polygon touching hole is invalid","grey",a=>{polygon(a);a.reading.regions[0].holes=[[[12,30],[30,30],[30,40],[12,40]]];},false);
  test("polygon nested holes are invalid","grey",a=>{polygon(a);a.reading.regions[0].holes=[[[25,25],[55,25],[55,55],[25,55]],[[30,30],[40,30],[40,40],[30,40]]];},false);
  test("polygon overlaps cannot inflate material area","grey",a=>{polygon(a);a.reading.regions.push({...a.reading.regions[0],id:"overlapping-body"});},false);
  test("polygon source drift cannot inherit ratification","black",a=>{polygon(a);a.bytes=Buffer.from("changed polygon source");},false);
  test("polygon geometry never omits inconvenient coloured pixels","grey",a=>{polygon(a);for(let y=12;y<68;y++)for(let x=12;x<40;x++)a.png.data.set([30,90,180,255],(y*80+x)*4);},false);
  test("polygon transparency counts against its full geometric area","grey",a=>{polygon(a);for(let y=12;y<68;y++)for(let x=12;x<40;x++)a.png.data[(y*80+x)*4+3]=0;},false);
  test("polygon mixed shape declarations are invalid","grey",a=>{polygon(a);a.reading.regions[0].x=12;},false);

  return cases;
}

// ── the walk ─────────────────────────────────────────────────────────────────
const readSheet = async (file) => {
  const { PNG } = await import("pngjs");
  return PNG.sync.read(fs.readFileSync(file));
};


// Authoring probe of one proposed material mask. This is explicitly not the
// chapter gate: the normal file walker below still verifies the real task.
// node scripts/check-colour-truth.mjs --measure-single image.png reading.json
const probeSingleAt = process.argv.indexOf("--measure-single");
if (probeSingleAt >= 0) {
  const [sheetFile,readingFile] = process.argv.slice(probeSingleAt+1);
  if (!sheetFile || !readingFile) throw new Error("--measure-single needs a PNG and a reading JSON");
  const reading=JSON.parse(fs.readFileSync(readingFile,"utf8"));
  const png=await readSheet(sheetFile),bytes=fs.readFileSync(sheetFile);
  const task={colour:reading.word,colourOptions:[reading.word,"blue","pink"],curseVisual:"violet-ink"};
  const result=checkSingleNeutral({png,bytes,task,reading});
  console.log(JSON.stringify({scope:"single-source authoring probe, not the chapter gate",...result},null,2));
  process.exit(result.errors.length ? 1 : 0);
}


// ═══ KAPITEL 2 · DIE KOPIE (R5-W6b · W5 · D-420 · R132) ═════════════════════
//
// Bis heute stand das hier als eigene Datei `scripts/check-colour-copy.mjs`.
// C4 hatte sie richtig angelegt — in derselben Welle gehoerten Regel- und
// Selbsttestteil dieses Tors einer anderen Bahn, und zwei Sitzungen auf
// derselben Datei kosten mehr, als die Trennung schadet. Der Zustand sollte
// aber nicht bleiben (R132): zwei Tore, die dieselbe Frage aus zwei Richtungen
// stellen — die Karte gegen ihr BILD und die Karte gegen ihre eigene ANTWORT —
// altern getrennt, und dann faellt eines still hinter das andere zurueck.
//
// Reiner Umzug, keine Logikaenderung: dieselben zwei Gesetze, dieselben acht
// Selbsttest-Faelle, dieselben Vakuitaets-Fragen. Beide Kapitel zaehlen ihre
// Faelle weiter GETRENNT, damit man sieht, welches gerade misst.
//
// WHY THIS EXISTS, and it is a found defect, not a hypothetical. `check-colour-
// truth` (C2, R41) closed the gap between the card's answer and the PNG: it
// opens the sheet, measures it, and holds `colour` to the measurement. Nothing
// held the GERMAN LINES to that same answer. C3 repainted the eraser blue → pink
// and flipped `colour`, `colourAskDe` and the options in one change — and left
// the hint behind:
//
//     colour: "pink" · colourAskDe: „Der Radiergummi war rosa."
//     hints.deWord: „Auf Deutsch: der Radiergummi — und Blau."     ← shipped
//
// So the one child who opens the hint — the child who is stuck, i.e. the child
// who most needs it — was told the wrong word by the help itself, while every
// gate in the repo stayed green. This gate closes that class: whatever German a
// restore card writes about colour must agree with the answer the same card
// keys. The measurement half stays where it belongs; this is the copy half.
//
// TWO LAWS, and the second is the one that catches the real defect:
//   A · the ASK names the answer. `colourAskDe` must contain the German word for
//       the keyed colour — otherwise the question is about a different colour
//       than the chips are.
//   B · no OTHER colour word anywhere in the card's German help. A hint may name
//       no colour at all (the glue stick's says „der Uhu-Stick", which is the
//       better hint) — but if it names one, it is the answer's.
//
// WHAT IT DELIBERATELY DOES NOT READ: `stimulus.showsDe`. That line describes
// the DRAINED world („Das Buch lehnt grau an der Wand."), where grey is the law
// of the chapter rather than a claim about the object — a gate that read it
// would redden on every card in the book for being right.

/** The book's ten colour words in German, with the inflections a card line can
 *  carry. Written as one table so the gate and any future card copy read the
 *  same list — the D-123/D-251 lesson: a second spelling is a second law. */
export const DE_COLOUR = {
  red: ["rot", "rote", "roter", "rotes", "roten", "rotem"],
  orange: ["orange", "orangen", "oranges", "orangem", "orangefarben", "orangefarbene"],
  yellow: ["gelb", "gelbe", "gelber", "gelbes", "gelben", "gelbem"],
  brown: ["braun", "braune", "brauner", "braunes", "braunen", "braunem"],
  green: ["grün", "grüne", "grüner", "grünes", "grünen", "grünem"],
  blue: ["blau", "blaue", "blauer", "blaues", "blauen", "blauem"],
  pink: ["rosa", "rosafarben", "rosafarbene", "pink", "pinke", "pinker", "pinkes"],
  white: ["weiß", "weiße", "weißer", "weißes", "weißen", "weißem"],
  black: ["schwarz", "schwarze", "schwarzer", "schwarzes", "schwarzen", "schwarzem"],
  grey: ["grau", "graue", "grauer", "graues", "grauen", "grauem"],
};

/** One taught colour, or two distinct taught colours joined by and. */
export const keyedColours = (answer) => {
  if(typeof answer!=="string")return new Set();
  const words=answer.split(" and ");
  return words.length<=2 && new Set(words).size===words.length && words.every(w=>DE_COLOUR[w])?new Set(words):new Set();
};

/** Which colour words a German line names. Word boundaries matter both ways:
 *  „Blaubeere" is not blue and „rote" is red — so the longest inflection wins
 *  and a match must stand alone as a word. */
export function coloursIn(line) {
  const found = new Set();
  if (typeof line !== "string") return found;
  const words = (line.toLowerCase().match(/[a-zäöüß]+/g) ?? []);
  for (const [colour, forms] of Object.entries(DE_COLOUR)) {
    if (words.some((w) => forms.includes(w))) found.add(colour);
  }
  return found;
}

/** Synthesise a flat RGBA raster of one colour — the selftest's specimen. */
export function flat(r, g, b, n = 64) {
  const data = Buffer.alloc(n * n * 4);
  for (let i = 0; i < data.length; i += 4) { data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255; }
  return data;
}

/** …und ein Blatt mit Fläche, für die zweite Unterscheidung (D-220): ein
 *  Grundton, auf den `paint(x, y)` einzelne Bildpunkte setzen darf. Ohne
 *  Breite und Höhe gibt es keine Nachbarschaft und damit kein „Feld". */
export function sheet(base, n = 64) {
  const data = flat(base[0], base[1], base[2], n);
  const put = (x, y, rgb) => {
    const i = (y * n + x) * 4;
    data[i] = rgb[0]; data[i + 1] = rgb[1]; data[i + 2] = rgb[2]; data[i + 3] = 255;
  };
  return { data, dims: { w: n, h: n }, put, n };
}

// Die drei Töne, an denen die zweite Unterscheidung geprüft wird — gemessen an
// den echten Blättern, nicht erfunden:
/** gedecktes Rot wie AQ12s Bucheinband: Ton 5°, S·V 0,38 (gemessen 0,373) */
export const MUTED_RED = [158, 70, 62];
/** altpapierfarbene Grundierung wie auf allen neun Bestandsblättern: Ton 40°,
 *  S·V 0,36 — dieselbe Flauheit, aber im Papierband */
export const PARCHMENT_CREAM = [191, 161, 100];
/** sattes Gold wie die Ecken desselben Buchs: Ton 42°, S·V 0,78 */
export const VIVID_GOLD = [230, 170, 30];

if (selftest) {
  // The specimens run through the REAL measurement and the REAL laws, not a copy.
  const cases = [];
  const say = (name, got, ok) => cases.push([name, got, ok]);

  // 1 · a red sheet under a card that claims blue must go red on the FAMILY law
  const red = measure(flat(214, 40, 30));
  say("a red sheet cannot be a blue card", red, (m) => m.dominant === "warm" && WORD_FAMILY.blue !== m.dominant);
  // 2 · violet is no word this book owns
  const violet = measure(flat(140, 60, 200));
  say("violet is measured as violet — no book word claims it", violet,
    (m) => m.dominant === "violet" && Object.values(WORD_FAMILY).every((f) => f !== "violet"));
  // 3 · the parchment rule must be able to REFUTE, not only to confirm: a sheet
  //     that is ONLY parchment has no colour left to name
  const parch = measure(flat(228, 204, 156));
  say("a sheet that is only parchment names no colour", parch, (m) => m.dominant === "MIXED");
  // 4 · …and the same cut must NOT eat a real warm colour
  const vivid = measure(flat(228, 108, 12));
  say("NON-TAMPER · vivid orange survives the parchment cut", vivid,
    (m) => m.dominant === "warm" && m.warmCentre !== null && m.warmCentre < 30);
  // 5 · the ink outline must not become the answer
  const inky = measure(flat(20, 18, 14));
  say("the ink outline is not a colour", inky, (m) => m.dominant === "MIXED");
  // 6 · Historical brown-desk fixture: its ratified35.7° must reject an orange repaint.
  // The live desk is now green; keep this independent measured fixture stable.
  const historicalBrownDeskCentre = 35.7;
  say("a repaint that moves the warm centre invalidates the ratified reading",
    Math.abs(24.6 - historicalBrownDeskCentre), (d) => d > DRIFT);
  // 7 · …and must accept the sheet it was ratified on
  say("NON-TAMPER · the sheet it was ratified on still passes the drift rule",
    Math.abs(35.7 - historicalBrownDeskCentre), (d) => d <= DRIFT);
  // 8 · law D: a second word of the target's own family is a giveaway
  say("two warm words among the options give the answer away",
    ["orange", "yellow", "blue"].filter((w) => WORD_FAMILY[w] === "warm").length, (n) => n > 1);
  // 9 · …and the shipped shape does not
  say("NON-TAMPER · one warm word among the options is fine",
    ["brown", "pink", "blue"].filter((w) => WORD_FAMILY[w] === "warm").length, (n) => n === 1);

  // ── R5-W5 · W4 · D-220 · die zweite Unterscheidung, in beide Richtungen ────
  // Die Fälle sind an den echten Zahlen gebaut: ein gedecktes rotes Feld mit
  // S·V 0,38 (AQ12 misst 0,373) unter ein paar satten Goldecken. Ohne die
  // zweite Unterscheidung fällt das Feld als Pergament weg und gemessen wird
  // das Gold — genau der Vorfall, den D-220 beschreibt.
  const buch = sheet(MUTED_RED);
  for (let y = 20; y < 32; y++) for (let x = 20; x < 32; x++) buch.put(x, y, VIVID_GOLD);
  const buchAlt = measure(buch.data);                 // ohne Fläche = alte Antwort
  const buchNeu = measure(buch.data, buch.dims);
  say("ROT ZUERST · ohne die zweite Unterscheidung misst das rote Buch seine GOLDECKEN",
    buchAlt.warmCentre, (c) => c !== null && c > 30);
  say("…und mit ihr misst es das Buch: die Warm-Mitte springt auf Rot",
    buchNeu.warmCentre, (c) => c !== null && c < 20);
  say("…und sie sagt auch, wie viel sie zurückgeholt hat",
    buchNeu.rescuedShare, (s) => s > 0.5);

  // Die Gegenrichtung, und sie ist die wichtigere: die altpapierfarbene
  // Grundierung liegt im Papier-Tonband und muss weiter wegfallen, sonst
  // wandert die Warm-Mitte jedes Bestandsblatts.
  const grund = sheet(PARCHMENT_CREAM);
  for (let y = 24; y < 40; y++) for (let x = 24; x < 40; x++) grund.put(x, y, [228, 108, 12]);
  const grundNeu = measure(grund.data, grund.dims);
  say("NON-TAMPER · eine große CREMEFARBENE Fläche bleibt Grundierung, kein Farbfeld",
    grundNeu, (m) => m.rescuedShare === 0 && m.warmCentre !== null && m.warmCentre < 30);

  // …und verstreute dunkle Töne sind kein Feld, auch wenn sie zusammen viel
  // Fläche haben. Auf dem Bestand misst diese Streuung bis zu 3,9 % des Blatts,
  // ihr größtes zusammenhängendes Feld aber nur 0,37 %.
  const streu = sheet(VIVID_GOLD);
  let streuPunkte = 0;
  for (let y = 0; y < streu.n; y += 3) for (let x = 0; x < streu.n; x += 3) { streu.put(x, y, MUTED_RED); streuPunkte++; }
  const streuAnteil = streuPunkte / (streu.n * streu.n);
  const streuNeu = measure(streu.data, streu.dims);
  say(`NON-TAMPER · ${(streuAnteil * 100).toFixed(0)} % verstreute rote Punkte sind kein Feld`,
    streuNeu, (m) => m.rescuedShare === 0 && m.warmCentre !== null && m.warmCentre > 30);

  // Und der Tamper auf die Regel selbst: ein Blatt, das FLAUgemacht wurde, bis
  // alles unter die Pergament-Schwelle fällt, hat keine Farbe mehr zu nennen.
  const flau = sheet(PARCHMENT_CREAM);
  say("ein Blatt, das künstlich zu Pergament geflaut ist, nennt keine Farbe mehr",
    measure(flau.data, flau.dims), (m) => m.dominant === "MIXED");


  // ── KAPITEL 2 · die Kopie · eigene Faelle, eigene Zaehlung (D-420) ────────
  const kopieCases = [];
  const sagK = (name, got, ok) => kopieCases.push([name, got, ok]);
  // 1 · the shipped defect: a pink answer whose hint says „Blau"
  sagK("a hint that names another colour than the answer is caught",
    coloursIn("Auf Deutsch: der Radiergummi — und Blau."),
    (f) => f.has("blue") && !f.has("pink"));
  // 2 · NON-TAMPER · the same hint, repaired, must be clean
  sagK("NON-TAMPER · the repaired hint names the answer and nothing else",
    coloursIn("Auf Deutsch: der Radiergummi — und Rosa."),
    (f) => f.size === 1 && f.has("pink"));
  // 3 · a hint may name NO colour — the glue stick's shape
  sagK("NON-TAMPER · a hint with no colour word at all is allowed",
    coloursIn("Auf Deutsch: der Klebestift — der Uhu-Stick."), (f) => f.size === 0);
  // 4 · the ask must be readable as naming its colour
  sagK("NON-TAMPER · the ask line names its colour", coloursIn("Die Schultasche war braun."),
    (f) => f.has("brown"));
  // 5 · inflections are the point: „braune" is brown, and only brown
  sagK("NON-TAMPER · an inflected form still counts", coloursIn("die braune Tasche"),
    (f) => f.size === 1 && f.has("brown"));
  // 6 · …and the boundary must hold in the direction that fails OPEN: a word
  //     that merely CONTAINS a colour is not that colour. Without this the gate
  //     would call „Blaubeere" blue and start reddening on true lines.
  sagK("NON-TAMPER · a word that only contains a colour is not that colour",
    coloursIn("Die Blaubeere und der Rotkohl."), (f) => f.size === 0);
  // 7 · …and the same boundary must not swallow the real word beside it
  sagK("a real colour word beside a compound is still found",
    coloursIn("Die Blaubeere ist blau."), (f) => f.size === 1 && f.has("blue"));
  // 8 · two different colour words in one line is exactly law B's target
  sagK("two colours in one line are both seen", coloursIn("erst blau, jetzt rosa"),
    (f) => f.size === 2 && f.has("blue") && f.has("pink"));

  // ── DIE BINDUNG UND DER ENTWURFS-WEG (2026-09-04) ─────────────────────────
  // Sechs Faelle. Die ersten vier fahren `bindingVerdict`, die letzten zwei die
  // Ratsche selbst — denn die Ausnahme ist nur so viel wert wie der Exit-Code,
  // der sie beendet.
  //
  // 16 · KEINE Nennung, KEIN Blatt: dieselbe Auslassung, ein Eintrag. Waere das
  //      rot, forderte `check-game-tasks` fuer dasselbe Feld das Gegenteil und
  //      ein Entwurfs-Kapitel haette keinen gruenen Weg (an #398 gemessen).
  say("ohne Nennung UND ohne Blatt ist es dieselbe Auslassung, nicht ein zweiter Fehler",
    bindingVerdict({ skin: "hund", art: undefined, sheetOnDisk: false }),
    (b) => b.verdict === "kein-blatt" && b.stem === "hund_a");
  // 16b · …aber ist das Blatt GEMALT, ist die fehlende Nennung rot: dann legt
  //       die Karte den Text-Platzhalter ueber bestellte Kunst.
  say("ohne Nennung, aber MIT gemaltem Blatt, ist rot",
    bindingVerdict({ skin: "hund", art: undefined, sheetOnDisk: true }),
    (b) => b.verdict === "blatt-nicht-genannt");
  // 17 · …und ebenso, wenn sie ein FREMDES Blatt nennt
  say("eine Karte, die ein anderes Blatt nennt, ist rot",
    bindingVerdict({ skin: "hund", art: "pinguin_a", sheetOnDisk: true }),
    (b) => b.verdict === "falsches-blatt");
  // 18 · gar keine Bindung
  say("eine restore-Karte ohne skin bindet an nichts",
    bindingVerdict({ skin: undefined, art: "hund_a", sheetOnDisk: true }),
    (b) => b.verdict === "kein-skin");
  // 19 · DER ENTWURFS-WEG: Blatt korrekt genannt, aber noch nicht gemalt ⇒
  //      ausgelassen, NICHT rot und NICHT gemessen.
  say("ein korrekt genanntes, noch nicht gemaltes Blatt wird ausgelassen statt gemessen",
    bindingVerdict({ skin: "hund", art: "hund_a", sheetOnDisk: false }),
    (b) => b.verdict === "kein-blatt");
  // 20 · DIE RATSCHE, in der Richtung, die kosten wuerde: ein Kapitel OHNE
  //      draft-Flagge, dem ein Blatt fehlt, landet in `gaps()` — und `gaps()`
  //      ist oben ein `fail`. Ohne diesen Fall waere der Entwurfs-Weg ein Loch.
  say("eine Auslassung in einem Kapitel OHNE draft-Flagge wird zur Luecke",
    (() => { const l = skipLedger([{ chapter: "chZZ", draft: false }]); l.skip("chZZ", "colour-truth/messung", "Blatt fehlt"); return { gaps: l.gaps().length, rows: l.rows().length }; })(),
    (r) => r.gaps === 1 && r.rows === 1);
  // 21 · …und dieselbe Auslassung IM Entwurf ist keine Luecke, steht aber
  //      trotzdem namentlich da (nie still — das ist die andere Haelfte).
  say("dieselbe Auslassung IM Entwurf ist keine Luecke, wird aber benannt",
    (() => { const l = skipLedger([{ chapter: "chZZ", draft: true }]); l.skip("chZZ", "colour-truth/messung", "Blatt fehlt"); return { gaps: l.gaps().length, rows: l.rows().length }; })(),
    (r) => r.gaps === 0 && r.rows === 1);

  sagK("a two-colour key retains both taught words",keyedColours("black and white"),s=>s.size===2&&s.has("black")&&s.has("white"));
  sagK("an unknown second colour is rejected",keyedColours("black and silver"),s=>s.size===0);
  sagK("repeating one colour does not form two colours",keyedColours("black and black"),s=>s.size===0);

  for (const c of neutralSelftestCases()) say(c.name, c.pass, v => v);
  for (const c of singleNeutralSelftestCases()) say(c.name, c.pass, v => v);
  let kopieBad = 0;
  for (const [name, got, ok] of kopieCases) {
    const pass = ok(got);
    if (!pass) kopieBad++;
    console.log(`  ${pass ? "✓" : "✗"} [Kopie] ${name}${pass ? "" : ` → ${JSON.stringify([...got])}`}`);
  }

  let bad = 0;
  for (const [name, got, ok] of cases) {
    const pass = ok(got);
    if (!pass) bad++;
    console.log(`  ${pass ? "✓" : "✗"} ${name}${pass ? "" : ` → ${JSON.stringify(got)}`}`);
  }
  if (bad + kopieBad > 0) { console.error(`check-colour-truth --selftest: ${bad + kopieBad} case(s) did NOT bite (Messung ${bad} · Kopie ${kopieBad}) — this gate cannot be trusted`); process.exit(1); }
  console.log(`check-colour-truth --selftest: OK — ${cases.length} Faelle der MESSUNG + ${kopieCases.length} Faelle der KOPIE, every red light seen and every green case still green`);
  process.exit(0);
}

// ── L0 · D10 · DIESES TOR FRAGT JETZT DIE GETEILTE KAPITEL-AUFLOESUNG ────────
//
// Hier stand ein eigener `readdirSync` ueber den ganzen Korpus — die neunte
// Meinung darueber, was ein Kapitel ist. `scripts/paint-chapters.mjs` sagt in
// seinem Kopf, warum das eine Falle ist, und drei Tore fragen es laengst
// (`check-level-design`, `check-game-tasks`, `check-copy-register`). Dieses war
// das vierte, das es nicht tat — und es hat bezahlt: der eigene Lauf kannte das
// Wort ENTWURF nicht, also konnte ein Kapitel, dessen Kunst noch nicht gemalt
// ist, dieses Tor mit einer einzigen `restore`-Karte gar nicht bestehen. ch02,
// ch03 und ch04 standen mit sechs Karten davor (gemessen 2026-09-04).
//
// Die Doktrin, die damit gilt, ist die des Helfers, nicht eine neue: „Die
// Gesetze, deren EINGABEN dastehen, laufen trotzdem — ein Entwurf ist kein
// Freibrief. Was fehlt, wird NAMENTLICH als >uebersprungen (draft)< gedruckt,
// nie still."
const CHAPTERS = paintChapters();
const ledger = skipLedger(CHAPTERS);

// L0 · N6 · eine Kartendatei OHNE Level-Datei waere fuer die Aufloesung
// unsichtbar — und damit fuer dieses Tor. Der Helfer sammelt sie; still
// uebergehen darf man sie nicht, sonst tauscht dieser Umbau eine Blindheit
// gegen eine andere.
for (const o of orphanTaskFiles()) {
  fail(o.file, "Kartendatei ohne `chNN.level.json` — die geteilte Aufloesung fuehrt Kapitel ueber ihren Level-Ausweis; ohne ihn saehe dieses Tor die Datei nie (L0 · N6)");
}

// EINE Kartendatei je Kapitel, und das Kapitel ist der ORDNER-Ausweis.
const KARTENDATEIEN = CHAPTERS.filter((c) => c.hasTasks).map((c) => ({ chapter: c.chapter, file: c.tasksPath }));
const files = KARTENDATEIEN.map((k) => k.file);

// Das Namensmuster der geteilten Aufloesung ist streng (`chNN.tasks.v2.json`).
// Der alte Lauf dieses Tors war es nicht (`endsWith(".tasks.v2.json")`) — eine
// Datei wie `ch2.tasks.v2.json` sah er, die Aufloesung sieht sie nicht. Das
// Spiel laedt sie ebenfalls nie (`paint-content.ts:322` baut den Namen aus der
// Kapitel-Id), sie erreicht also kein Kind; aber sie waere GESCHRIEBENE ARBEIT,
// die still niemand prueft — genau die Klasse, gegen die `orphanTaskFiles`
// gebaut wurde. Also wird sie hier benannt statt uebergangen.
for (const c of CHAPTERS) {
  for (const f of fs.readdirSync(c.dir).filter((x) => x.endsWith(".tasks.v2.json"))) {
    if (!/^ch\d{2}\.tasks\.v2\.json$/.test(f)) {
      fail(path.join(c.dir, f), "Kartendatei mit abweichendem Namensmuster — die geteilte Kapitel-Aufloesung und der Lader des Spiels bauen beide `chNN.tasks.v2.json`; diese Datei wird von keinem von beiden je geoeffnet");
    }
  }
  break; // ein Story-Ordner je Kapitel-Liste; `c.dir` ist fuer alle derselbe Paint-Ordner
}

let measured = 0;
const table = [];
for (const { chapter, file } of KARTENDATEIEN) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  // DIE IDENTITAET KOMMT AUS DEM ORDNER, NICHT AUS DER DATEI.
  // Der erste Entwurf dieses Umbaus las `json.chapter` und nahm an, ein
  // Widerspruch faende sich schon von selbst. Ein blinder Pruefer hat das
  // Gegenteil gezeigt (2026-09-04): eine Kartendatei, die PHYSISCH im Ordner
  // eines FERTIGEN Kapitels liegt und sich intern nach einem ENTWURFS-Kapitel
  // benennt, erbt dessen Nachsicht — der Lauf endete mit exit 0 und null
  // Luecken, obwohl das Spiel die Datei als die des fertigen Kapitels laedt.
  // Die Nachsicht haengt jetzt am Ordner, und der Widerspruch selbst ist rot.
  if (json.chapter !== chapter) {
    fail(file, `die Datei liegt im Ordner von »${chapter}«, nennt sich aber »${json.chapter}« — das Spiel laedt sie als ${chapter} (paint-content.ts baut den Namen aus der Kapitel-Id), jedes Tor wuerde sie als ${json.chapter} beurteilen`);
    continue;
  }
  for (const t of json.items ?? []) {
    if (t.kind !== "restore") continue;
    const id = t.id.replace(`g1.paint.${chapter}.`, "");
    const w = `${file} ${id}`;
    // LAW 0 · the binding. The world washes `<skin>_a` and the card's portrait is
    // `stimulus.art`; if those two ever disagree, the child is asked about one
    // picture while looking at another, and every measurement below is moot.
    // Diese beiden Zweige sind Aussagen der KARTE ueber sich selbst — sie
    // brauchen keine Kunst und bleiben deshalb auch im Entwurf hart.
    const skin = (t.skins ?? [])[0];
    const sheet = skin === undefined ? null : path.join(ART, chapter, `${skin}_a.png`);
    const b = bindingVerdict({ skin, art: t.stimulus?.art, sheetOnDisk: sheet !== null && fs.existsSync(sheet) });
    const stem = b.stem;
    if (b.verdict === "kein-skin") { fail(w, "a restore card with no skin — nothing binds it to a sheet"); continue; }
    if (b.verdict === "blatt-nicht-genannt") {
      fail(w, `portrait: ${stem}.png ist gemalt, aber die Karte nennt kein stimulus.art — sie wuerde den Text-Platzhalter ueber bestellte Kunst legen (dasselbe Gesetz fuehrt check-game-tasks aus der anderen Richtung)`);
      continue;
    }
    if (b.verdict === "falsches-blatt") {
      fail(w, `binding: skin »${skin}« washes ${stem}.png, but the card shows »${t.stimulus?.art}« — the question and the picture must be the same sheet`);
      continue;
    }
    if (b.verdict === "kein-blatt") {
      // DER ENTWURFS-WEG. Das Blatt ist noch nicht gemalt, also ist die Farbe
      // dieser Karte nicht BELEGBAR — weder richtig noch falsch. Das wird
      // namentlich ausgelassen statt still uebergangen, und fuer ein Kapitel
      // OHNE `draft`-Flagge landet dieselbe Zeile in `ledger.gaps()` und wird
      // unten zum Exit-Code: die Auslassung darf den Entwurf nicht ueberleben.
      ledger.skip(chapter, "colour-truth/messung", `${stem}.png liegt nicht auf der Platte — die Farbaussage von »${id}« (»${t.colour}«) ist damit UNBELEGT`);
      continue;
    }

    const png = await readSheet(sheet);
    const dualReading = DUAL_READINGS[`${chapter}/${skin}`];
    if (dualReading || keyedColours(t.colour).size > 1) {
      measured++;
      const result = checkDualColour({ png, bytes: fs.readFileSync(sheet), task: t, reading: dualReading });
      for (const error of result.errors) fail(w, error);
      table.push(`  ${id.padEnd(22)} neutral body regions ${result.regions.map(r => `${r.id}:${(r.coverage*100).toFixed(1)}%/core${(r.coreShare*100).toFixed(1)}%`).join(" · ")} → Karte sagt ${t.colour}`);
      continue;
    }
    const singleReading = SINGLE_NEUTRAL_READINGS[`${chapter}/${skin}`];
    if (singleReading || SINGLE_NEUTRALS.has(t.colour)) {
      measured++;
      const result = checkSingleNeutral({ png, bytes: fs.readFileSync(sheet), task: t, reading: singleReading });
      for (const error of result.errors) fail(w, error);
      table.push(`  ${id.padEnd(22)} single neutral ${t.colour}, ${result.wholeTargetShare === undefined ? "UNBELEGT — keine gültige Körperlesart" : `whole interior ${(result.wholeTargetShare*100).toFixed(1)}%, mask ${(result.maskInteriorShare*100).toFixed(1)}%`}`);
      continue;
    }
    const m = measure(png.data, { w: png.width, h: png.height });
    measured++;
    const declaredFamily = WORD_FAMILY[t.colour];
    const centre = m.warmCentre === null ? "—" : `${m.warmCentre.toFixed(1)}°`;
    const shares = Object.entries(m.shares).map(([f, s]) => `${f} ${Math.round(s * 100)}%`).join(" · ");
    table.push(`  ${id.padEnd(22)} gemessen ${m.dominant.padEnd(6)} (${shares})  Warm-Mitte ${centre.padStart(6)}  →  Karte sagt ${t.colour}`);

    // LAW C · a sheet with no dominant family, or one in a family no book word
    // owns, may not be ruled on — it is ART DEBT, and it says so out loud.
    const debt = ART_DEBT[skin];
    if (m.dominant === "MIXED" || m.dominant === "violet") {
      if (debt === undefined) {
        fail(w, `${m.dominant === "violet" ? "violet is no colour word this book teaches" : "no family carries this sheet"} (${shares}) — a sheet this gate cannot read needs a declared ART_DEBT entry with a reason and an until, never a silent colour word`);
      } else if (!debt.reason || !debt.until) {
        fail(w, `ART_DEBT["${skin}"] needs a reason AND an until (see the ledger law 17f for the form)`);
      } else if (debt.until < new Date().toISOString().slice(0, 10)) {
        fail(w, `ART_DEBT["${skin}"] expired ${debt.until} — repaint the sheet or renew the entry with a fresh reason`);
      }
      continue;
    }
    if (debt !== undefined) {
      fail(w, `ART_DEBT["${skin}"] still stands, but the sheet now reads ${m.dominant} with margin — remove the entry, a stale exemption hides the next gap`);
    }

    // LAW A · the family law. This is the one that caught all three of Koki's.
    if (declaredFamily === undefined) {
      fail(w, `the card claims the colour »${t.colour}«, which is not one of this book's ten colour words`);
    } else if (declaredFamily === "neutral") {
      fail(w, `the card claims »${t.colour}«, a colourless word, over a sheet that measures ${m.dominant} (${shares})`);
    } else if (declaredFamily !== m.dominant) {
      fail(w, `THE CARD AND THE SHEET DISAGREE: the card says »${t.colour}« (${declaredFamily}), the sheet measures ${m.dominant} — ${shares}. R41: the card follows the measured sheet`);
    }

    // LAW B · the ratified reading, and its drift rule.
    const r = READINGS[skin];
    if (r === undefined) {
      fail(w, `no ratified reading for skin »${skin}« — add it to READINGS with the measured family, the measured warm centre and WHY, so a later repaint cannot inherit this colour word in silence`);
    } else {
      if (r.word !== t.colour) fail(w, `the ratified reading for »${skin}« is »${r.word}«, the card says »${t.colour}« — one of the two is stale`);
      if (r.family !== m.dominant) fail(w, `the reading for »${skin}« was ratified on family ${r.family}, the sheet now measures ${m.dominant} — the sheet was repainted; re-decide the card AND this entry in the same change`);
      if (r.warmCentre !== null && m.warmCentre !== null && Math.abs(r.warmCentre - m.warmCentre) > DRIFT) {
        fail(w, `the reading for »${skin}« was ratified at a warm centre of ${r.warmCentre}°, the sheet now measures ${m.warmCentre.toFixed(1)}° (drift ${Math.abs(r.warmCentre - m.warmCentre).toFixed(1)}° > ${DRIFT}°) — the picture changed, so the word must be re-decided`);
      }
      if (!r.why || r.why.trim().length === 0) fail(w, `the reading for »${skin}« carries no WHY — the reason is the review surface`);
    }

    // LAW D · the distractors. Two words of the TARGET's own family sit inside
    // one 90° warm arc, so the child can pick the right one off the picture
    // without knowing a single English word.
    const sameFamily = (t.colourOptions ?? []).filter((o) => WORD_FAMILY[o] === declaredFamily);
    if (sameFamily.length > 1) {
      fail(w, `the options [${(t.colourOptions ?? []).join(" · ")}] carry ${sameFamily.length} words of the answer's own family (${sameFamily.join(" · ")}) — inside one family the words are less than 60° apart, so the picture decides instead of the English`);
    }
    if (!(t.colourOptions ?? []).includes(t.colour)) {
      fail(w, `the answer »${t.colour}« is not among the options [${(t.colourOptions ?? []).join(" · ")}]`);
    }
  }
}


// ═══ KAPITEL 2 · DER LAUF DER KOPIE (D-420) ═════════════════════════════════
// Dieselbe Dateiliste, andere Frage: oben wurde die Karte gegen ihr BILD
// gehalten, hier gegen ihre eigene ANTWORT.
const taskFiles = files;
let kopieGeprueft = 0;
let kopieZeilen = 0;
for (const file of taskFiles) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const chapter = json.chapter;
  for (const t of json.items ?? []) {
    if (t.kind !== "restore") continue;
    const where = `${file} ${t.id.replace(`g1.paint.${chapter}.`, "")}`;
    const answer = t.colour;
    const answers=keyedColours(answer);
    if (answers.size===0) {
      fail(where, `the card keys »${answer}«, which is not one of this book's ten colour words — nothing to hold the German to`);
      continue;
    }
    kopieGeprueft += 1;

    // LAW A · the ask names the answer.
    const ask = t.colourAskDe;
    kopieZeilen += 1;
    const inAsk = coloursIn(ask);
    if (![...answers].every(a=>inAsk.has(a))) {
      fail(where, `the ask »${ask}« does not name the keyed colour »${answer}« (${[...answers].map(a=>DE_COLOUR[a][0]).join(" und ")}) — the German question and the chips are about different colours`);
    }

    // LAW B · no other colour word in the ask or in the help.
    const lines = [["colourAskDe", ask], ["hints.deDesc", t.hints?.deDesc], ["hints.deWord", t.hints?.deWord]];
    for (const [field, line] of lines) {
      if (typeof line !== "string") continue;
      if (field !== "colourAskDe") kopieZeilen += 1;
      for (const other of coloursIn(line)) {
        if (answers.has(other)) continue;
        fail(where, `${field} names »${other}« while the card's answer is »${answer}«: „${line}" — the child who opens the help is the child who is stuck, and this line tells them the wrong word`);
      }
    }
  }
}

// ── VACUITY — a copy gate that reads nothing reports a clean repo forever ─────
if (kopieGeprueft === 0) fail("VACUITY", "no restore card was read — either the walk missed the task files or the kind was renamed; both laws above are asleep");
if (kopieZeilen < kopieGeprueft) fail("VACUITY", `${kopieGeprueft} cards but only ${kopieZeilen} German lines read — a card whose lines are all missing passes both laws by having nothing to say`);
// …and the reader itself must still be able to tell two colour words apart.
if (coloursIn("blau").has("pink") || !coloursIn("rosa").has("pink")) {
  fail("VACUITY", "the colour-word reader no longer distinguishes blue from pink — every verdict above is noise");
}

// ── DIE RATSCHE · eine Auslassung darf den Entwurf nicht ueberleben ─────────
//
// `skipLedger` legt jede Auslassung eines Kapitels OHNE `draft`-Flagge
// zusaetzlich in `gaps()`. Der Helfer sagt selbst, warum das einen Exit-Code
// braucht (L0b · D-792): „Ein Etikett ohne Exit-Code ist eine Notiz, kein Tor."
// Praktisch heisst das: ein Kapitel kann den Entwurf nicht verlassen, solange
// eine seiner Farbaussagen unbelegt ist — die `draft`-Flagge IST die Frist,
// und niemand muss ein Ablaufdatum pflegen.
const luecken = ledger.gaps();
const vorLuecken = failures;
for (const g of luecken) {
  fail("LUECKE", `${g} — dieses Kapitel traegt keine draft-Flagge, steht Kindern also offen; eine unbelegte Farbe darf ein fertiges Kapitel nicht verlassen`);
}
// DIE VERDRAHTUNG BEWEIST SICH SELBST. Ein blinder Pruefer hat gezeigt, dass
// der `--selftest` diese Schleife NICHT deckt: er faehrt `skipLedger` als reine
// Funktion, und ein Tamper genau hier bleibt fuer ihn unsichtbar, waehrend der
// echte Lauf still durchwinkt. Ein Selbsttest, der die Verdrahtung nicht sieht,
// ist genau das, wovor `check-ci-gates` warnt („A self-test proves the
// INSTRUMENT. Only a real run proves the WORK"). Also prueft der echte Lauf
// sich hier selbst: gemeldete Luecken MUESSEN Verstoesse gezaehlt haben.
if (luecken.length > 0 && failures === vorLuecken) {
  fail("VACUITY", `die Ratsche hat ${luecken.length} Luecke(n) gemeldet, aber kein Verstoss wurde gezaehlt — die Verdrahtung zwischen skipLedger und diesem Tor ist tot`);
}

// ── VACUITY — the gate proves it still sees ──────────────────────────────────
// Every law above runs on sheets this walk found. A walk that finds none reports
// a clean repo forever, which is the worst way for a picture check to break.
if (measured === 0) fail("VACUITY", "no restore card was measured — either the walk missed the task files or the kind was renamed; every law in this gate is asleep");
if (Object.keys(READINGS).length + Object.keys(DUAL_READINGS).length + Object.keys(SINGLE_NEUTRAL_READINGS).length < measured) fail("VACUITY", `${measured} sheets measured but only ${Object.keys(READINGS).length + Object.keys(DUAL_READINGS).length + Object.keys(SINGLE_NEUTRAL_READINGS).length} ratified readings — a skin without a row is a colour word nobody ratified`);
// …and the measurement itself must still be able to tell two colours apart.
if (measure(flat(214, 40, 30)).dominant === measure(flat(40, 90, 200)).dominant) {
  fail("VACUITY", "the measurement puts a red sheet and a blue sheet in the same family — it is not discriminating and every verdict above is noise");
}

if (ledger.rows().length > 0) {
  console.log("\ncheck-colour-truth · was ausgelassen wurde (namentlich, nie still):");
  ledger.print();
}

console.log("\ncheck-colour-truth · die Ist-Palette:");
for (const line of table) console.log(line);
if (failures > 0) { console.error(`\ncheck-colour-truth: ${failures} violation(s) over ${measured} restore sheet(s)`); process.exit(1); }
console.log(`\ncheck-colour-truth: OK — Kapitel 1: ${measured} restore sheet(s) measured; every card's colour word is the family its own sheet carries, every reading is ratified against a measured number`);
console.log(`check-colour-truth: OK — Kapitel 2 (Kopie): ${kopieGeprueft} restore card(s), ${kopieZeilen} German line(s); every colour word the card writes is the colour the card keys`);
