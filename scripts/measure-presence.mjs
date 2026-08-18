#!/usr/bin/env node
// R5-W2 · J1-E · DOES THE PRIZE SEPARATE FROM ITS GROUND?
//
// Run:  node scripts/measure-presence.mjs <framesDir> [--json]
//       node scripts/measure-presence.mjs --selftest
//
// Two blind critics, order swapped, judged our sunlit hall against real Rayman
// frames and lost DECISIVELY on one criterion: „gold pickups in a gold room is
// the base error — the highest-contrast element in the composition is a hazard,
// not the prize." They measured our rule page at mean luminance 204 against a
// 207 local ground: the prize was DARKER than the wall. The engine backing took
// that to +9,2. Their target is +50. This is round 2 of a maximum of three.
//
// ── WHY A SCRIPT AND NOT AN EYE ──────────────────────────────────────────────
// Because round 1's number was disputed, and a disputed number is worth less
// than no number. So this tool is built to be citable:
//
//  · ONE luminance formula, the same three coefficients check-composition.mjs
//    uses (0.2126 / 0.7152 / 0.0722). One measure, two tools, no drift.
//  · IT HARD-FAILS on the factor-3 trap. LOGICAL_W is 352 and a snapshot is
//    1056 — measuring in logical coordinates against an image in render pixels
//    samples the wrong place entirely, and it does so silently. The frame must
//    be LOGICAL_W × RENDER_SCALE wide or nothing is measured.
//  · IT PRINTS the scale and the derived rectangle on every run. A measurement
//    whose frame you cannot reconstruct is an anecdote.
//  · --selftest synthesises a square of known luminance on a ground of known
//    luminance and asserts the answer to ±0,1. AN UNVERIFIED MEASURING TOOL IS
//    HOW A ROUND SHIPS A NUMBER NOBODY CAN DEFEND.
//
// ── AND WHY ΔL ALONE IS NOT ENOUGH ───────────────────────────────────────────
// Three companion numbers ride along, because a contrast win can be bought
// cheaply and each of these catches one of the ways:
//   clip%  — object pixels at or above 250 in any channel. A page made brighter
//            by blowing out its paper is not a page any more.
//   p95    — the object's 95th-percentile luminance. Catches a ΔL carried by a
//            single hot specular pixel rather than by the paper.
//   ΔH     — mean hue distance, object against ring. THE CRITICS' ACTUAL
//            COMPLAINT was gold-on-gold. A brightness win with ΔH ≈ 0 has not
//            fixed what they saw.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { PNG } from "pngjs";

const LOGICAL_W = 352;
const RENDER_SCALE = 3;
const EXPECT_W = LOGICAL_W * RENDER_SCALE; // 1056

// ── R28 (Fable, 2026-08-14): DER RADIUS IST DIE KANTE ───────────────────────
// Runde 2 zeigte, dass die Zahl fast vollständig davon abhängt, WO man misst:
// an der Kante +46,5 · zwei Objekthöhen weiter draußen +13,2. Die Unterlage
// reicht bis ~1,81 Objekthöhen und kann außerhalb davon naturgemäß nichts
// bewirken — ein Ziel, das sich auf einen anderen Ring bezieht als die Messung,
// ist kein Ziel. Also ist der KANTEN-Ring ab jetzt das Maß (dort trennt ein
// Kind), und der ferne Ring läuft als Begleitspalte mit, damit niemand einen
// Kantensieg mit einer verdunkelten Wand verwechselt.
export const EDGE_RING = { inner: 0.8, outer: 1.2 };
export const WALL_RING = { inner: 2.0, outer: 3.2 };
export const TARGET_DL = 50; // die Zahl der blinden Kritiker, AM KANTEN-RING

// ── R5-W6 · L1 · DAS KRITERIUM, HINGESCHRIEBEN BEVOR GEMESSEN WURDE ─────────
// J1 hat +50 fuer die REGEL-SEITE gesetzt: ein helles Blatt vor dunklem Grund,
// dort zeigt das Vorzeichen nach oben. Der Sammelbuchstabe ist der umgekehrte
// Fall — sein Gold ist Kanon (R41) und liegt bei Luminanz 201, die Wand von p1
// bei 219. Nach OBEN ist +50 dort nur zu haben, indem man entweder das Gold
// bricht oder die Wand uebermalt; keins von beidem gehoert dieser Bahn.
//
// Raymans eigenes Referenzbild (Kriterium a) trennt ebenfalls nicht nach oben:
// gesaettigte Kugeln vor ABSICHTLICH ABGEDUNKELTER Wand. Genau das sagt R37 —
// „Saettigung vor abgedunkelter Flaeche, nicht mehr Helligkeit".
//
// Also ist das Ziel der BETRAG der Trennung, mit genannter Richtung: ein Kind
// trennt ein dunkel umrandetes Ding vor heller Wand genauso zuverlaessig wie
// ein helles Ding vor dunkler. Der Farbton laeuft als zweiter Weg mit, weil
// eine reine Helligkeitsloesung Gold-auf-Gold nicht heilt.
export const TARGET_ABS_DL = 50;
export const TARGET_MIXED_DL = 30;
export const TARGET_MIXED_DH = 30;
/** Besteht dieses Paar aus Objekt und Grund das Kriterium? Eine Funktion, damit
 *  Messgeraet und Tor nicht zwei Meinungen haben koennen (die gebankte Falle:
 *  Erzeuger und Tor muessen dasselbe Lineal und dieselbe Schwelle fahren). */
export const separates = (dL, dH) =>
  Math.abs(dL) >= TARGET_ABS_DL || (Math.abs(dL) >= TARGET_MIXED_DL && (dH ?? 0) >= TARGET_MIXED_DH);
/** Das Kriterium als Satz — wird gedruckt, bevor eine Zahl faellt. */
export const CRITERION = `|dL| >= ${TARGET_ABS_DL} ODER (|dL| >= ${TARGET_MIXED_DL} UND dH >= ${TARGET_MIXED_DH} Grad), am KANTEN-Ring`;

const TILE = 16;
/** Die Bob-Formel aus `PaintScene.renderReadability` und die Anzeigegroesse aus
 *  `PaintScene.LETTER_PX`. Beide sind hier KOPIEN — und weil eine Kopie driftet,
 *  prueft `--selftest` sie unten gegen die Quelldatei nach (dasselbe Rezept, mit
 *  dem `shoot-world` seine Takt-Kopien haelt). */
const LETTER_PX = 14;
const letterOffset = (c, r) => (c + r) * 0.7;
const letterBobY = (tick, c, r) => Math.sin(tick / 18 + letterOffset(c, r)) * 1.6;
const letterGlint = (tick, c, r) => 0.9 + Math.abs(Math.sin(tick / 26 + letterOffset(c, r))) * 0.1;
/** cue.ts: die Marke ist 11 px hoch, ihre Silhouette laeuft -0,55 .. +0,45 um
 *  ihren Mittelpunkt und sitzt CUE_GAP_PX ueber der hoeheren der zwei Oberkanten. */
const CUE_SIZE = 11;
const CUE_GAP_PX = 7;
/**
 * Wie weit ein Buchstabe vom Kind entfernt sein muss, damit er gemessen wird.
 *
 * Erste Fassung war ein RADIUS aus Magnetfeld (sim.ts MAGNET_FIELD_PX = 1,6
 * Kacheln) plus Aufnahmebox — und ein Ausschnitt hat sie widerlegt: p9s »H« lag
 * 46,8 px entfernt, kam also durch, und der Kasten zeigte LEERE WAND. Der Grund
 * ist, dass ein Warp das Kind fallen laesst: es zieht auf dem Weg nach unten an
 * Buchstaben vorbei, die es im Standbild gar nicht mehr beruehrt. Ein Radius um
 * die ENDLAGE kann davon nichts wissen.
 *
 * Also ein grosszuegiges Rechteck statt eines knappen Kreises, und die Abdeckung
 * wird durch MEHR Kameralagen wiederhergestellt, nicht durch eine engere Regel:
 * lieber sechsmal schiessen als einmal die Wand messen und Buchstabe dazu sagen.
 */
const HERO_KEEPOUT_X_PX = TILE * 6;
const HERO_KEEPOUT_Y_PX = TILE * 8;
const COLLECT_ANCHOR_PX = 12;
/** Wie hoch das Kind gezeichnet ist (F6: „das Kind ist ~35 px") — gebraucht nur,
 *  um zu ERKENNEN, wann `cueMarkY` seinen Scheitel nimmt statt der Oberkante des
 *  Dings. Eine Naeherung, die eine Zeile VERWIRFT, nie eine, die eine misst. */
const HERO_H_PX = 35;

export const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** Hue in degrees, or null for a pixel with no chroma to speak of. */
export const hue = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d < 8) return null;
  let h;
  if (max === r) h = 60 * (((g - b) / d) % 6);
  else if (max === g) h = 60 * ((b - r) / d + 2);
  else h = 60 * ((r - g) / d + 4);
  return (h + 360) % 360;
};

export const hueGap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/** The measurement itself: the object's box against an ANNULUS around it.
 *
 *  DEFAULT = THE EDGE (0.8–1.2·h), by R28. That is where a child separates a
 *  thing from its ground, and it is where the backing can act at all. The far
 *  ring (2.0–3.2·h) is still measurable — pass WALL_RING — and the CLI prints
 *  it alongside, because a win at the edge bought by darkening the whole wall
 *  would be a different, worse change. The shaft column is NOT excluded: if a
 *  beam brightens the wall above the page, that is a real cost and belongs in
 *  the number. */
export const measure = (png, box, { inner = EDGE_RING.inner, outer = EDGE_RING.outer } = {}) => {
  const { width: W, height: H, data } = png;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const rIn = inner * box.h;
  const rOut = outer * box.h;

  const objL = [];
  const objHue = [];
  let clipped = 0;
  for (let y = Math.max(0, box.y); y < Math.min(H, box.y + box.h); y++) {
    for (let x = Math.max(0, box.x); x < Math.min(W, box.x + box.w); x++) {
      const i = (y * W + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      objL.push(lum(r, g, b));
      const hh = hue(r, g, b);
      if (hh !== null) objHue.push(hh);
      if (r >= 250 || g >= 250 || b >= 250) clipped++;
    }
  }

  const ringL = [];
  const ringHue = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - cx, dy = y - cy;
      const d = Math.hypot(dx, dy);
      if (d < rIn || d > rOut) continue;
      const i = (y * W + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      ringL.push(lum(r, g, b));
      const hh = hue(r, g, b);
      if (hh !== null) ringHue.push(hh);
    }
  }

  if (objL.length === 0) throw new Error("the object box is empty — it fell outside the frame");
  if (ringL.length < 200) throw new Error(`the ring holds only ${ringL.length} px — too few to be a ground (needs ≥200)`);

  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const pct = (a, p) => [...a].sort((x, y) => x - y)[Math.floor((a.length - 1) * p)];
  const meanHue = (a) => (a.length === 0 ? null : mean(a));

  const oh = meanHue(objHue), rh = meanHue(ringHue);
  return {
    lObj: mean(objL),
    lRing: mean(ringL),
    dL: mean(objL) - mean(ringL),
    p95: pct(objL, 0.95),
    clipPct: (100 * clipped) / objL.length,
    dH: oh === null || rh === null ? null : hueGap(oh, rh),
    objPx: objL.length,
    ringPx: ringL.length,
    rect: { ...box, rIn: Math.round(rIn), rOut: Math.round(rOut) },
  };
};

// ── the self-test: the part that makes the instrument citable ────────────────
const selftest = () => {
  const W = EXPECT_W, H = 672;
  const png = new PNG({ width: W, height: H });
  // ground: mid grey, luminance exactly 100 by construction
  const G = 100, O = 180;
  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = G; png.data[i + 1] = G; png.data[i + 2] = G; png.data[i + 3] = 255;
  }
  const box = { x: 500, y: 300, w: 40, h: 40 };
  for (let y = box.y; y < box.y + box.h; y++) {
    for (let x = box.x; x < box.x + box.w; x++) {
      const i = (y * W + x) * 4;
      png.data[i] = O; png.data[i + 1] = O; png.data[i + 2] = O;
    }
  }
  const m = measure(png, box);
  const fails = [];
  // grey has lum == its own channel value, so the analytic answers are exact
  if (Math.abs(m.lObj - O) > 0.1) fails.push(`object luminance ${m.lObj.toFixed(3)} ≠ ${O}`);
  if (Math.abs(m.lRing - G) > 0.1) fails.push(`ring luminance ${m.lRing.toFixed(3)} ≠ ${G}`);
  if (Math.abs(m.dL - (O - G)) > 0.1) fails.push(`ΔL ${m.dL.toFixed(3)} ≠ ${O - G}`);
  if (m.clipPct !== 0) fails.push(`clip% ${m.clipPct} ≠ 0 on a 180-grey square`);
  if (m.dH !== null) fails.push(`ΔH ${m.dH} is not null on a fully desaturated frame`);

  // ── THE COLOUR CASE, and it exists because the grey case above proved less
  //    than it looked. Tampering the luminance formula down to a plain channel
  //    mean left every grey assertion GREEN: on r=g=b the weighted and the
  //    unweighted formula agree exactly, so the one thing this measure is FOR —
  //    that green reads far brighter than blue at the same numeric value — was
  //    untested. Pure green on pure blue separates them violently:
  //      weighted  0.7152·255 − 0.0722·255 = +164.2
  //      flat mean 85 − 85                 =    0.0
  {
    const png2 = new PNG({ width: W, height: H });
    for (let i = 0; i < png2.data.length; i += 4) {
      png2.data[i] = 0; png2.data[i + 1] = 0; png2.data[i + 2] = 255; png2.data[i + 3] = 255; // blue ground
    }
    for (let y = box.y; y < box.y + box.h; y++) {
      for (let x = box.x; x < box.x + box.w; x++) {
        const i = (y * W + x) * 4;
        png2.data[i] = 0; png2.data[i + 1] = 255; png2.data[i + 2] = 0; // green object
      }
    }
    const c = measure(png2, box);
    const want = 0.7152 * 255 - 0.0722 * 255;
    if (Math.abs(c.dL - want) > 0.1) {
      fails.push(`green-on-blue ΔL ${c.dL.toFixed(2)} ≠ ${want.toFixed(2)} — the luminance formula is not weighted, and a flat channel mean would score this 0`);
    }
    // …and while we are here: two opposite hues must read as far apart
    if (c.dH === null || c.dH < 100) {
      fails.push(`green against blue reports ΔH ${c.dH} — the hue measure is not separating opposite hues`);
    }
  }

  // …and it must REFUSE a frame at the wrong scale, or the factor-3 trap is open
  const wrong = new PNG({ width: LOGICAL_W, height: 224 });
  let refused = false;
  try { assertScale(wrong); } catch { refused = true; }
  if (!refused) fails.push("a 352-wide frame was accepted — the factor-3 trap is open");

  // ── R5-W6 · L1 · DIE KOPIEN, GEGEN IHRE QUELLE GEHALTEN ──────────────────
  // Der --letters-Kasten wird aus vier Zahlen gerechnet, die anderswo leben:
  // die Anzeigegroesse, die Bob-Formel, der Marken-Abstand und der Massstab.
  // Eine Kopie driftet lautlos — und ein Kasten, der drei Pixel danebenliegt,
  // misst die Wand und meldet sie als Buchstaben. Also wird jede Kopie hier am
  // Original nachgelesen (dasselbe Rezept, mit dem `shoot-world` seine
  // Takt-Kopien haelt).
  {
    const hier = path.dirname(url.fileURLToPath(import.meta.url));
    const lies = (rel) => fs.readFileSync(path.join(hier, rel), "utf8");
    const scene = lies("../packages/game-paint/src/PaintScene.ts");
    const cueSrc = lies("../packages/game-paint/src/cue.ts");
    const paintSrc = lies("../packages/game-paint/src/paint.ts");
    const pin = (name, src, re, want) => {
      const m = src.match(re);
      if (m === null) { fails.push(`${name}: steht nicht mehr in seiner Quelldatei — die Kopie im --letters-Modus ist ungueltig`); return; }
      if (Number(m[1]) !== want) fails.push(`${name}: Quelle sagt ${m[1]}, dieses Werkzeug rechnet mit ${want}`);
    };
    pin("LETTER_PX", scene, /static readonly LETTER_PX = (\d+(?:\.\d+)?)/, LETTER_PX);
    pin("TILE", paintSrc, /export const TILE = (\d+)/, TILE);
    pin("RENDER_SCALE", paintSrc, /export const RENDER_SCALE = (\d+)/, RENDER_SCALE);
    pin("CUE_GAP_PX", cueSrc, /export const CUE_GAP_PX = (\d+(?:\.\d+)?)/, CUE_GAP_PX);
    // …und die Bob-Formel als Ganzes: Teiler, Weg und Versatz in EINER Zeile
    const bob = scene.match(/Math\.sin\(t \/ (\d+) \+ phase\) \* (\d+(?:\.\d+)?)/);
    if (bob === null) fails.push("die Bob-Formel steht nicht mehr als `Math.sin(t / N + phase) * A` in PaintScene — die Kopie im --letters-Modus ist ungueltig");
    else if (Number(bob[1]) !== 18 || Number(bob[2]) !== 1.6) fails.push(`Bob-Formel: Quelle sagt sin(t/${bob[1]})*${bob[2]}, dieses Werkzeug rechnet mit sin(t/18)*1.6`);
    const off = scene.match(/const phase = \(Number\(parts\[0\]\) \+ Number\(parts\[1\]\)\) \* (\d+(?:\.\d+)?); \/\/ per-letter offset/);
    if (off === null) fails.push("der Buchstaben-Versatz steht nicht mehr als `(c + r) * K` in renderReadability — die Kopie ist ungueltig");
    else if (Number(off[1]) !== 0.7) fails.push(`Buchstaben-Versatz: Quelle sagt ${off[1]}, dieses Werkzeug rechnet mit 0.7`);
    // …und das Kriterium muss unterscheiden koennen, sonst ist es Dekoration
    if (!separates(-52, 5)) fails.push("das Kriterium verwirft eine Trennung von -52 — es liest nur nach oben, obwohl es der BETRAG sein soll");
    if (separates(-29, 29)) fails.push("das Kriterium nimmt -29/29 an — beide Teilbedingungen muessten fehlschlagen");
    if (!separates(-31, 31)) fails.push("das Kriterium verwirft -31/31 — der gemischte Weg greift nicht");
    if (separates(20, null)) fails.push("das Kriterium nimmt +20 ohne Farbton an");
  }

  if (fails.length > 0) {
    for (const f of fails) console.error(`✗ ${f}`);
    console.error("\nmeasure-presence --selftest: FAILED — do not trust any number this tool prints");
    process.exit(1);
  }
  console.log(`measure-presence --selftest: OK`);
  console.log(`  object ${m.lObj.toFixed(2)} · ring ${m.lRing.toFixed(2)} · ΔL ${m.dL.toFixed(2)} (analytic ${O - G})`);
  console.log(`  ring sampled ${m.ringPx} px · a wrong-scale frame is refused`);
  console.log(`  Kopien gegen ihre Quelle geprueft (LETTER_PX · TILE · RENDER_SCALE · CUE_GAP_PX · Bob-Formel · Versatz) · Kriterium: ${CRITERION}`);
};

const assertScale = (png) => {
  if (png.width !== EXPECT_W) {
    throw new Error(
      `frame is ${png.width}px wide, expected ${EXPECT_W} (LOGICAL_W ${LOGICAL_W} × RENDER_SCALE ${RENDER_SCALE}).\n`
      + `  A frame at the wrong scale samples the wrong place and says nothing about it.`,
    );
  }
};

// ── CLI ──────────────────────────────────────────────────────────────────────
// R5-W6 · L1: alles ab hier laeuft NUR, wenn diese Datei selbst aufgerufen
// wurde. Ohne diese Schranke beendet ein blosses `import` den fremden Prozess
// (die Nutzungsmeldung unten ruft `process.exit(1)`) — und genau das braucht
// `check-composition.mjs`: es holt sich Luminanz, Farbton und Schwelle HIER,
// damit Messgeraet und Tor nicht zwei Lineale fuehren.
const invokedDirectly = process.argv[1] !== undefined
  && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);
if (invokedDirectly) {
const args = process.argv.slice(2);
if (args.includes("--selftest")) { selftest(); process.exit(0); }

const dir = args[0];
if (!dir) {
  console.error("usage: node scripts/measure-presence.mjs <framesDir> [--json]\n       node scripts/measure-presence.mjs --selftest");
  process.exit(1);
}
const asJson = args.includes("--json");
const role = args.indexOf("--role") === -1 ? "tip" : args[args.indexOf("--role") + 1];

// ── R5-W6 · L1 · ZWEI MESSSTELLEN, DIE KEINEN GETIPPTEN KASTEN BRAUCHEN ─────
//
// W1 hat die letzte weiche Stelle dieser Messkette benannt: von Hand getippte
// Kaesten. Fuer die Regel-Seite war sie geschlossen (der Zeichenort meldet seine
// Bildschirm-Lage im Zettel). Fuer die zwei Dinge, die diese Runde misst, meldet
// er sie NICHT: die Sammelbuchstaben sind keine Entities (sie leben als `*` im
// Gitter), und der Pfeil ist ueberhaupt kein Sprite, sondern ein Graphics-Zug.
//
// Beide Kaesten werden deshalb GERECHNET, aus Groessen, die der Zettel traegt
// (camX/camY/tick) und aus den Formeln, die der Renderer selbst fahrt — und dann
// mit `--crops` als Bild ausgeschrieben, damit jeder gemessene Kasten
// nachsehbar ist. Ein Kasten, den man nicht ansehen kann, ist eine Behauptung.
const wantLetters = args.includes("--letters");
const wantArrow = args.includes("--arrow");
const cropDir = args.indexOf("--crops") === -1 ? null : args[args.indexOf("--crops") + 1];
const LEVEL_PATH = args.indexOf("--level") === -1
  ? "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"
  : args[args.indexOf("--level") + 1];

const toScreen = (worldX, worldY, meta) => ({
  x: (worldX - meta.camX) * RENDER_SCALE,
  y: (worldY - meta.camY) * RENDER_SCALE,
});

const boxAround = (sx, sy, wPx, hPx) => ({
  x: Math.round(sx - (wPx * RENDER_SCALE) / 2),
  y: Math.round(sy - (hPx * RENDER_SCALE) / 2),
  w: Math.round(wPx * RENDER_SCALE),
  h: Math.round(hPx * RENDER_SCALE),
});

const insideFrame = (png, box) =>
  box.x >= 0 && box.y >= 0 && box.x + box.w <= png.width && box.y + box.h <= png.height;

/** Der Beleg: der gemessene Kasten mitsamt seinem Ring, als eigenes Bild. */
const writeCrop = (png, box, file) => {
  const pad = Math.round(box.h * 1.4);
  const x0 = Math.max(0, box.x - pad);
  const y0 = Math.max(0, box.y - pad);
  const x1 = Math.min(png.width, box.x + box.w + pad);
  const y1 = Math.min(png.height, box.y + box.h + pad);
  const out = new PNG({ width: x1 - x0, height: y1 - y0 });
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const si = (y * png.width + x) * 4;
      const di = ((y - y0) * out.width + (x - x0)) * 4;
      const onBox = (x === box.x || x === box.x + box.w - 1) && y >= box.y && y < box.y + box.h
        || (y === box.y || y === box.y + box.h - 1) && x >= box.x && x < box.x + box.w;
      out.data[di] = onBox ? 255 : png.data[si];
      out.data[di + 1] = onBox ? 0 : png.data[si + 1];
      out.data[di + 2] = onBox ? 255 : png.data[si + 2];
      out.data[di + 3] = 255;
    }
  }
  fs.writeFileSync(file, PNG.sync.write(out));
};

const readFrames = () => {
  const out = [];
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".png")).sort()) {
    const stem = f.replace(/\.png$/, "");
    const sidecar = path.join(dir, `${stem}.meta.json`);
    if (!fs.existsSync(sidecar)) continue;
    const meta = JSON.parse(fs.readFileSync(sidecar, "utf8"));
    const png = PNG.sync.read(fs.readFileSync(path.join(dir, f)));
    assertScale(png);
    for (const k of ["camX", "camY", "tick"]) {
      if (typeof meta[k] !== "number") {
        console.error(`✗ ${stem}: der Zettel traegt kein ${k} — ohne die Kamera wird aus einer Weltlage keine Bildlage`);
        process.exit(1);
      }
    }
    out.push({ stem, meta, png });
  }
  if (out.length === 0) { console.error(`✗ ${dir}: keine Bild+Zettel-Paare`); process.exit(1); }
  return out;
};

if (wantLetters || wantArrow) {
  if (cropDir) fs.mkdirSync(cropDir, { recursive: true });
  const frames = readFrames();
  const rowsOut = [];
  const skipped = [];

  if (wantLetters) {
    const { letterGlyphs } = await import("../packages/game-paint/src/letters.ts");
    const { compositionFor } = await import("../packages/game-paint/src/composition.ts");
    const level = JSON.parse(fs.readFileSync(LEVEL_PATH, "utf8"));
    const allPhases = [...level.phases, ...(level.arena ? [level.arena] : []), ...(level.bonus ? [level.bonus] : [])];
    for (const { stem, meta, png } of frames) {
      const ph = allPhases.find((p) => p.id === meta.phase);
      if (!ph) { console.error(`✗ ${stem}: Phase ${meta.phase} steht nicht in ${LEVEL_PATH}`); process.exit(1); }
      const spec = compositionFor("ch01", meta.phase);
      const glyphs = letterGlyphs(ph.rows, spec?.words);
      const hx = meta.hero?.x;
      const hy = typeof meta.hero?.y === "number" ? meta.hero.y - COLLECT_ANCHOR_PX : null;
      for (const g of glyphs) {
        const wx = g.c * TILE + TILE / 2;
        const wy = g.r * TILE + TILE / 2 + letterBobY(meta.tick, g.c, g.r);
        const s = toScreen(wx, wy, meta);
        const size = LETTER_PX * letterGlint(meta.tick, g.c, g.r);
        const box = boxAround(s.x, s.y, size, size);
        const label = `${meta.phase} ${g.char}(${g.c},${g.r})`;
        if (!insideFrame(png, box)) { skipped.push(`${stem} ${label}: ausserhalb des Bildes`); continue; }
        if (typeof hx === "number" && hy !== null
          && Math.abs(hx - wx) < HERO_KEEPOUT_X_PX && Math.abs(hy - wy) < HERO_KEEPOUT_Y_PX) {
          skipped.push(`${stem} ${label}: im Sperrfeld um das Kind (${HERO_KEEPOUT_X_PX}×${HERO_KEEPOUT_Y_PX} px) — Magnet oder Sturz koennten ihn geholt haben`);
          continue;
        }
        const m = measure(png, box);
        const wall = measure(png, box, WALL_RING);
        if (cropDir) writeCrop(png, box, path.join(cropDir, `${stem}_${meta.phase}_${g.char}_${g.c}_${g.r}.png`));
        rowsOut.push({ frame: stem, object: label, ...m, dLWall: wall.dL });
      }
    }
  }

  if (wantArrow) {
    const { ENGAGEABLE_ROLES, ENGAGE_REACH_PX, ENGAGE_REACH_Y_PX } = await import("../packages/game-paint/src/entities.ts");
    for (const { stem, meta, png } of frames) {
      const withScr = (meta.entities ?? []).filter((e) => ENGAGEABLE_ROLES.has(e.role) && e.breath?.scr);
      if (withScr.length === 0) { skipped.push(`${stem}: kein anspielbares Wesen mit gezeichneter Lage im Zettel`); continue; }
      const hx = meta.hero?.x ?? 0;
      const hy = meta.hero?.y ?? 0;
      // ── DIE STELLE, AN DER DIESES WERKZEUG SICH SELBST BEIM LUEGEN ERWISCHT ──
      // Der erste Lauf mass brav einen Kasten ueber dem Buch und meldete +38 —
      // und der Ausschnitt zeigte darin NUR WAND: das Kind stand 400 px weiter
      // weg, `engageTargetId` hatte niemanden gewaehlt, und es war ueberhaupt
      // kein Pfeil im Bild. Eine Zahl ueber ein Ding, das gar nicht gezeichnet
      // wurde, ist schlimmer als keine Zahl. Also fragt das Werkzeug jetzt
      // dieselbe Bedingung wie der Renderer (`inEngageReach`) und misst NUR,
      // wo die Marke wirklich steht.
      const cand = withScr.filter((e) => Math.abs(e.x - hx) < ENGAGE_REACH_PX && Math.abs(e.y - hy) < ENGAGE_REACH_Y_PX);
      if (cand.length === 0) {
        const nah = withScr.map((e) => `${e.id} dx=${Math.abs(e.x - hx).toFixed(0)} dy=${Math.abs(e.y - hy).toFixed(0)}`).join(", ");
        skipped.push(`${stem}: kein Wesen in Anspiel-Reichweite (${ENGAGE_REACH_PX}/${ENGAGE_REACH_Y_PX} px) — es ist KEIN Pfeil im Bild [${nah}]`);
        continue;
      }
      cand.sort((a, b) => Math.abs(a.x - hx) - Math.abs(b.x - hx));
      const e = cand[0];
      const scr = e.breath.scr;
      // ── DER ZWEITE KOPF, UND WARUM ER EINE ZEILE VERWIRFT ────────────────────
      // `cueMarkY` (cue.ts) setzt die Marke ueber die HOEHERE der zwei Oberkanten:
      // die des Dings ODER die des Kindes (F6, 17.08.). Der Zettel meldet nur die
      // des Dings. Steht das Kind hoeher — bei einem flachen Ding wie dem Buch tut
      // es das —, liegt der gerechnete Kasten auf seiner Frisur, und der Ausschnitt
      // hat genau das gezeigt: -51,5 gemeldet, Haare gemessen. Solche Zeilen werden
      // benannt und verworfen, nicht gerundet.
      const heroTopPx = (meta.hero?.y ?? 0) - HERO_H_PX;
      const thingTopPx = scr.y / RENDER_SCALE + meta.camY;
      // Der Verdacht wird MITGEDRUCKT, nicht zum Urteil gemacht: die 35 px sind
      // eine Naeherung (die gemalten Ganzkoerper-Zellen sind nicht alle gleich
      // hoch), und eine Naeherung darf eine Messung markieren, nie sie ersetzen.
      // Entschieden wird am Ausschnitt — der liegt neben jeder Zahl.
      const kindHoeher = heroTopPx < thingTopPx;
      // cueMarkY: die Marke sitzt CUE_GAP_PX ueber der Oberkante des Dings —
      // ODER ueber dem Kopf des Kindes, wenn der hoeher steht. Der Zettel kennt
      // nur die Oberkante des Dings; steht das Kind hoeher, zeigt der Ausschnitt
      // es, und die Zeile wird mit --box nachgemessen (im Report benannt).
      // `scr` ist bereits eine BILDSCHIRM-Lage (der Zeichenort meldet sie so) —
      // sie darf also NICHT noch einmal um die Kamera versetzt werden.
      // Silhouette: -0,55 .. +0,45 der Groesse um den Marken-Mittelpunkt, und der
      // Mittelpunkt sitzt CUE_GAP_PX ueber der Oberkante des Dings.
      const box = {
        x: Math.round(scr.x + scr.w / 2 - (CUE_SIZE * 0.9 * RENDER_SCALE) / 2),
        y: Math.round(scr.y - (CUE_GAP_PX + CUE_SIZE * 0.55) * RENDER_SCALE),
        w: Math.round(CUE_SIZE * 0.9 * RENDER_SCALE),
        h: Math.round(CUE_SIZE * RENDER_SCALE),
      };
      const label = `pfeil ueber ${e.id}${kindHoeher ? " [KIND HOEHER?]" : ""}`;
      if (!insideFrame(png, box)) { skipped.push(`${stem} ${label}: ausserhalb des Bildes`); continue; }
      const m = measure(png, box);
      const wall = measure(png, box, WALL_RING);
      if (cropDir) writeCrop(png, box, path.join(cropDir, `${stem}_pfeil_${e.id}.png`));
      rowsOut.push({ frame: stem, object: label, ...m, dLWall: wall.dL });
    }
  }

  if (asJson) {
    console.log(JSON.stringify({ criterion: CRITERION, rows: rowsOut, skipped }, null, 2));
  } else {
    console.log(`KRITERIUM (vor der Messung hingeschrieben): ${CRITERION}`);
    console.log(`scale ${RENDER_SCALE}× · Ring = KANTE ${EDGE_RING.inner}–${EDGE_RING.outer} × Objekthoehe (R28)\n`);
    console.log("frame                 objekt                       L_obj  L_ring     ΔL  ΔL_wall    p95  clip%     ΔH  trennt?");
    for (const r of rowsOut) {
      console.log(
        `${r.frame.padEnd(21)} ${String(r.object).padEnd(28)} `
        + `${r.lObj.toFixed(1).padStart(6)} ${r.lRing.toFixed(1).padStart(7)} `
        + `${(r.dL >= 0 ? "+" : "") + r.dL.toFixed(1)}`.padStart(7)
        + ` ${((r.dLWall >= 0 ? "+" : "") + r.dLWall.toFixed(1)).padStart(8)}`
        + ` ${r.p95.toFixed(0).padStart(6)} ${r.clipPct.toFixed(1).padStart(6)} `
        + `${r.dH === null ? "   n/a" : r.dH.toFixed(0).padStart(6)}`
        + `  ${separates(r.dL, r.dH) ? "JA" : "nein"}`,
      );
    }
    const pass = rowsOut.filter((r) => separates(r.dL, r.dH)).length;
    console.log(`\n${pass} von ${rowsOut.length} gemessenen Stellen trennen.`);
    if (skipped.length > 0) {
      console.log(`\nNICHT gemessen (${skipped.length}) — vollstaendig aufgezaehlt, nie stillschweigend weggelassen:`);
      for (const s of skipped) console.log(`  · ${s}`);
    }
    if (cropDir) console.log(`\nAusschnitte (jeder gemessene Kasten, magenta umrandet): ${path.resolve(cropDir)}`);
  }
  process.exit(0);
}

const rows = [];
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".png")).sort()) {
  const stem = f.replace(/\.png$/, "");
  const sidecar = path.join(dir, `${stem}.meta.json`);
  if (!fs.existsSync(sidecar)) {
    console.error(`✗ ${stem}: no ${stem}.meta.json — a frame without its object box cannot be measured`);
    process.exit(1);
  }
  const meta = JSON.parse(fs.readFileSync(sidecar, "utf8"));
  const png = PNG.sync.read(fs.readFileSync(path.join(dir, f)));
  assertScale(png);
  if (meta.scale !== undefined && meta.scale !== RENDER_SCALE) {
    console.error(`✗ ${stem}: sidecar says scale ${meta.scale}, this tool measures at ${RENDER_SCALE}`);
    process.exit(1);
  }
  // R5-W3 · W1: die Box darf aus dem Zettel kommen, den `shoot-world.mjs`
  // schreibt — der Zeichenort meldet die Bildschirm-Lage selbst. Von Hand
  // getippte Boxen waren die letzte weiche Stelle in dieser Messkette.
  const box = meta.box ?? (() => {
    const ent = (meta.entities ?? []).find((e) => e.role === role && e.breath?.scr);
    if (!ent) return null;
    const s = ent.breath.scr;
    return { x: Math.round(s.x), y: Math.round(s.y), w: Math.round(s.w), h: Math.round(s.h) };
  })();
  if (box === null) {
    console.error(`✗ ${stem}: weder meta.box noch ein »${role}« mit gezeichneter Bildschirm-Lage im Zettel`);
    process.exit(1);
  }
  const m = measure(png, box);
  const wall = measure(png, box, WALL_RING);
  rows.push({
    frame: stem,
    object: meta.object ?? (meta.entities ?? []).find((e) => e.role === role)?.id ?? "?",
    ...m,
    dLWall: wall.dL,
  });
}

if (asJson) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  console.log(`scale ${RENDER_SCALE}× · frames ${EXPECT_W}px wide`);
  console.log(`ring = THE EDGE ${EDGE_RING.inner}–${EDGE_RING.outer} × object height (R28) · wall ring ${WALL_RING.inner}–${WALL_RING.outer} alongside\n`);
  console.log("frame                 object                  L_obj  L_ring     ΔL  ΔL_wall    p95  clip%     ΔH");
  for (const r of rows) {
    console.log(
      `${r.frame.padEnd(21)} ${String(r.object).padEnd(22)} `
      + `${r.lObj.toFixed(1).padStart(6)} ${r.lRing.toFixed(1).padStart(7)} `
      + `${(r.dL >= 0 ? "+" : "") + r.dL.toFixed(1)}`.padStart(7)
      + ` ${((r.dLWall >= 0 ? "+" : "") + r.dLWall.toFixed(1)).padStart(8)}`
      + ` ${r.p95.toFixed(0).padStart(6)} ${r.clipPct.toFixed(1).padStart(6)} `
      + `${r.dH === null ? "   n/a" : r.dH.toFixed(0).padStart(6)}`,
    );
  }
  const best = Math.max(...rows.map((r) => r.dL));
  console.log(`\n(target: ΔL ≥ +${TARGET_DL} AT THE EDGE — the blind critics' number, given its radius by R28)`);
  console.log(`  best in this set: ${(best >= 0 ? "+" : "") + best.toFixed(1)} → ${best >= TARGET_DL ? "TARGET MET" : `${(TARGET_DL - best).toFixed(1)} short`}`);
}
}
