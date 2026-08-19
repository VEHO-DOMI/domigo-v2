#!/usr/bin/env node
// R5-W4 · C2 · THE COLOUR TRUTH GATE — the card follows the sheet, by construction.
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
import path from "node:path";

const R = process.cwd();
const STORIES = "content/corpus/stories";
const ART = "apps/web/public/art/g1/paint";
const selftest = process.argv.includes("--selftest");

let failures = 0;
const reported = [];
const fail = (where, msg) => { failures++; reported.push(`${where}: ${msg}`); console.error(`✗ ${where}: ${msg}`); };

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
  obj_book: { word: "blue", family: "blue", warmCentre: null,
    why: "Blau mit Gold-Ecken. Gemessen 2026-08-15: blau 74 %, Verhältnis 2,8. Kokis Befund vom 15.08.: »Das Buch ist blau, aber es will rot.« R41s Zielpalette will es rot — das ist AQ12s Auftrag, nicht der der Karte. ★ AQ12 HAT geliefert, und das Blatt ist gut gemalt: ein Mensch liest ein rotes Buch. Dieses Tor nicht. Gemessen an der Lieferung: 58 413 Pixel im Rot-Band mit Median-Chroma 0,373 — knapp UNTER der PARCHMENT-Schwelle 0,45, also fallen 90 % der warmen Masse als Pergament weg und übrig bleiben die Goldecken bei 38,0°. Das ist eine Fehlzündung von Regel 4 an neuem Material: dort ist warm-und-flau die aged-paper-Grundierung, hier ist es der Bucheinband selbst. Die Regel zu ändern gehört dieser Session nicht (nur die READINGS-Zeilen), und »rot« auf 38,0° zu ratifizieren würde diese Tabelle entwerten — der Tisch steht als »braun« auf 35,7°, die Feder als »gelb« auf 39,1°, das wären drei Farbwörter in 3,4°. Wahrheit vor Varietät: das Blatt bleibt blau, und AQ12d ist mit der exakten Zahl bestellt (Deckel-Median-S·V ≥ 0,53; AQ12c hat 0,533 erreicht, die Zahl ist also treffbar). D-221." },
  eraser: { word: "pink", family: "pink", warmCentre: null,
    why: "Rosa Band, cremefarbenes Oberteil. NEU ANGESTRICHEN von Codex AQ12 und importiert in R5-W4b/C3: das Blatt war blau (blau 100 %), es misst jetzt rosa 100 %, Verhältnis 343. Damit fällt Kokis »viele Farben, aber jede richtig« auf diesem Wesen zum ersten Mal zusammen — die Karte ist in derselben Änderung von blue auf pink gekippt, weil dieses Tor sie sonst rot hält. Blinder Blatt-Prüfer vor dem Import: ANGENOMMEN (dasselbe Wesen, dieselbe Pose, 167 388 von 242 952 Pixeln byte-identisch, reiner Farbtondreh)." },
  obj_sharpener: { word: "blue", family: "blue", warmCentre: null,
    why: "Blauer Würfel mit Metall-Schlitz. Gemessen: blau 100 %. Kokis Befund: »Spitzer sagt gelb, ist blau.«" },
  heft: { word: "green", family: "green", warmCentre: null,
    why: "Grüne Deckel, cremefarbener Seitenblock. Gemessen: grün 76 %, Verhältnis 3,2 (nach der Pergament-Regel — ohne sie 51/49 und damit MIXED). Karte war schon richtig; Fables Vormessung sagte »Mischbild ohne klaren Sieger« und wird hiermit widerlegt." },
  obj_gluestick: { word: "orange", family: "warm", warmCentre: 24.6,
    why: "Kräftig orangefarbener Körper, cremefarbener Rahmen. Gemessen: warm 100 %, Mitte 24,6°, Median-Chroma 0,76 — der sattteste Warmton der neun. Kokis Befund: »Uhu-Stick sagt grün, ist orange.«" },
  obj_scissors: { word: "orange", family: "warm", warmCentre: 23.9,
    why: "Orange Griffe, cremefarbene Klingen. Gemessen: warm 100 %, Mitte 23,9°. Die Pergament-Regel wirft 35 % (die Klingen) weg — genau deshalb liest die Schere orange und nicht sandfarben." },
  obj_desk: { word: "brown", family: "warm", warmCentre: 35.7,
    why: "Honigfarbenes Holz. Gemessen: warm 100 %, Mitte 35,7°, Median-Chroma 0,56. Die Mitte liegt 11° von den beiden Orange-Blättern entfernt — das ist der Abstand, auf dem die Drift-Regel steht." },
  obj_schoolbag: { word: "brown", family: "warm", warmCentre: 35.9,
    why: "SCHWÄCHSTE Lesung der neun: cremefarbener Rucksack mit petrolfarbenem Besatz. Gemessen: warm 66 % / grün 26 %, Verhältnis 2,5 — und 51 % der Fläche fällt als Pergament weg. Das Blatt trägt kein sattes Braun; die Familie stimmt, der Ton ist Kunst-Schuld (D-130 — hier stand versehentlich D-133, das ist die glance.test-Fixture; korrigiert in R5-W4b/C3). Codex AQ12c hat einen braunen Anstrich geliefert, der die Zahl trifft (warm 100 %, Mitte 28,9°, S·V 0,533), dabei aber Petrol-Besatz, Messing und die bunten Bücher mitgebräunt — Wahrheit gegen Handwerk. Kokis Entscheidung vom 15.08.: nicht importieren, nachbestellen (AQ12f, nur der Stoffkörper). Bis dahin bleibt dieses Blatt und diese Lesung stehen. D-222." },
  pen: { word: "yellow", family: "warm", warmCentre: 58.0,
    why: "Sonnengelber Körper, oliver Deckel, goldene Feder. NEU ANGESTRICHEN von Codex AQ12 und importiert in R5-W4b/C3: die Warm-Mitte ist von 39,1° auf 58,0° gewandert (Drift 18,9° — dieses Tor stand deshalb rot, bis Blatt, Tabelle und Karte gemeinsam entschieden waren), das Median-Chroma von 0,40 auf 0,49. 58° ist Gelb ohne Diskussion; vorher war das Wort »gelb« über einem holzfarbenen Blatt eine Behauptung. Gemessen: warm 85 % / grün 13 %, Verhältnis 6,6, 56 % Pergament (der cremefarbene Manschettenblock). ★ D-131 (»das Blatt zeigt gar keine Füllfeder«) ist WIDERLEGT: ein blinder Prüfer hat das Wesen unabhängig als Füllfeder gelesen, und bei fünffacher Vergrößerung trägt es eine goldene Schreibfeder mit Mittelschlitz, Luftloch und geschulterter Federform unter einer Kappe mit Zierring. Bei Spielgröße liest sich die Feder wie eine Bleistiftspitze — daher der Irrtum in C2 und in der ersten Runde von C3." },
};

/** Sheets whose measured reading is not confident enough to rule on. Every entry
 *  needs a REASON and an UNTIL, the same discipline scripts/paint-art-allowlist
 *  and the coverage ledger (law 17f) already carry. Empty today: after the
 *  parchment rule every one of the nine sheets ranks a family with margin. */
export const ART_DEBT = {};

// ── the walk ─────────────────────────────────────────────────────────────────
const readSheet = async (file) => {
  const { PNG } = await import("pngjs");
  return PNG.sync.read(fs.readFileSync(file));
};

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
  // 6 · the drift rule: the desk's ratified 35.7° must reject an orange repaint
  say("a repaint that moves the warm centre invalidates the ratified reading",
    Math.abs(24.6 - READINGS.obj_desk.warmCentre), (d) => d > DRIFT);
  // 7 · …and must accept the sheet it was ratified on
  say("NON-TAMPER · the sheet it was ratified on still passes the drift rule",
    Math.abs(35.7 - READINGS.obj_desk.warmCentre), (d) => d <= DRIFT);
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

  let bad = 0;
  for (const [name, got, ok] of cases) {
    const pass = ok(got);
    if (!pass) bad++;
    console.log(`  ${pass ? "✓" : "✗"} ${name}${pass ? "" : ` → ${JSON.stringify(got)}`}`);
  }
  if (bad > 0) { console.error(`check-colour-truth --selftest: ${bad} case(s) did NOT bite — this gate cannot be trusted`); process.exit(1); }
  console.log(`check-colour-truth --selftest: OK — ${cases.length} cases, every red light seen and every green case still green`);
  process.exit(0);
}

const files = [];
if (fs.existsSync(STORIES)) {
  for (const story of fs.readdirSync(STORIES)) {
    const dir = path.join(STORIES, story, "paint");
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".tasks.v2.json"))) files.push(path.join(dir, f));
  }
}

let measured = 0;
const table = [];
for (const file of files) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const chapter = json.chapter;
  for (const t of json.items ?? []) {
    if (t.kind !== "restore") continue;
    const id = t.id.replace(`g1.paint.${chapter}.`, "");
    const w = `${file} ${id}`;
    const skin = (t.skins ?? [])[0];
    if (skin === undefined) { fail(w, "a restore card with no skin — nothing binds it to a sheet"); continue; }

    // LAW 0 · the binding. The world washes `<skin>_a` and the card's portrait is
    // `stimulus.art`; if those two ever disagree, the child is asked about one
    // picture while looking at another, and every measurement below is moot.
    const stem = `${skin}_a`;
    if (t.stimulus?.art !== stem) {
      fail(w, `binding: skin »${skin}« washes ${stem}.png, but the card shows »${t.stimulus?.art}« — the question and the picture must be the same sheet`);
      continue;
    }
    const sheet = path.join(ART, chapter, `${stem}.png`);
    if (!fs.existsSync(sheet)) { fail(w, `binding: ${sheet} is not on disk`); continue; }

    const png = await readSheet(sheet);
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

// ── VACUITY — the gate proves it still sees ──────────────────────────────────
// Every law above runs on sheets this walk found. A walk that finds none reports
// a clean repo forever, which is the worst way for a picture check to break.
if (measured === 0) fail("VACUITY", "no restore card was measured — either the walk missed the task files or the kind was renamed; every law in this gate is asleep");
if (Object.keys(READINGS).length < measured) fail("VACUITY", `${measured} sheets measured but only ${Object.keys(READINGS).length} ratified readings — a skin without a row is a colour word nobody ratified`);
// …and the measurement itself must still be able to tell two colours apart.
if (measure(flat(214, 40, 30)).dominant === measure(flat(40, 90, 200)).dominant) {
  fail("VACUITY", "the measurement puts a red sheet and a blue sheet in the same family — it is not discriminating and every verdict above is noise");
}

console.log("\ncheck-colour-truth · die Ist-Palette:");
for (const line of table) console.log(line);
if (failures > 0) { console.error(`\ncheck-colour-truth: ${failures} violation(s) over ${measured} restore sheet(s)`); process.exit(1); }
console.log(`\ncheck-colour-truth: OK — ${measured} restore sheet(s) measured; every card's colour word is the family its own sheet carries, every reading is ratified against a measured number`);
