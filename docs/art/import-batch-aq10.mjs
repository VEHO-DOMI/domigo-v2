#!/usr/bin/env node
/**
 * import-batch-aq10 — DIE VERSTREUTE UNIFORM (R5-W5 · G4, fortgeschrieben R5-W6 · G5).
 * Importiert die Uniform-Blätter nach apps/web/public/art/g1/paint/ch01/.
 * Quelle dieser Runde: batch-aq10b (die Nachbestellung), zellenweise.
 *
 *   node docs/art/import-batch-aq10.mjs [--dry]
 *
 * Same shape as import-batch-aq7 (chroma key → defringe → content trim, key
 * distance ≥ 150 Euclidean), plus TWO assertions this round. Both exist because
 * the commission named exactly these two ways to get the delivery wrong, and an
 * importer is the last cheap place to catch a claim.
 *
 * ── ASSERTION 1 · ZAHL DER TEILE (die Falle, die die Spec ausdrücklich nennt) ──
 * `socks` ist ein PAAR, `shoe` ist EINER. UNIFORM_SAMMELN_DESIGN §4: »Zeichnet
 * Codex ein Paar Schuhe, ist die Karte shoe falsch, sobald das Kind das Bild
 * sieht.« Das ist keine Geschmacksfrage, sondern zählbar: die Silhouette wird in
 * zusammenhängende Flächen zerlegt (4er-Nachbarschaft, Flächen unter 0,2 % der
 * Zelle sind Staub und zählen nicht). Erwartet: socks ≥ 2, shoe genau 1.
 *
 * ── ASSERTION 2 · DIE FARBE, GEGEN DIE BESTELLUNG GEMESSEN ────────────────────
 * Die Spec (§4) vergibt je Teil eine Farbe aus den zehn Buchfarben, mit zwei
 * harten Verboten: kein Gold/warmes Gelb (die Buchstaben sind Gold — EINE Quelle:
 * `letters.ts` LETTER_GOLD 0xf7c93f seit R146/L1; die 0xf0c040-Nennungen in dieser
 * Datei sind die alte dritte Kopie und nur noch Familien-Anker, kein Farbwert — und
 * tragen ein eigenes Halo — zwei leuchtende Sammelklassen zerteilen den Blick)
 * und kein Grau (Grau IST im Spiel der entfärbte Zustand). Ein getipptes
 * Farbwort, das nie gegen ein Pixel gehalten wurde, ist die Fehlerklasse P-65:
 * genau so trugen die Farb-Karten wochenlang falsche Antworten durch grüne Tore.
 *
 * Die Prüfung ist KEIN Verbot, sondern ein Deklarations-Zwang: jede Abweichung
 * muss unten mit gemessener Familie UND Grund stehen. Eine NICHT deklarierte
 * Abweichung bricht den Import — eine Lieferung kann also nicht still eine
 * Farbe verschieben.
 *
 * ── ASSERTION 3 · DER FREMDE SAUM (R5-W6 · G5, neu) ──────────────────────────
 * Ein ein Pixel breiter, gesättigter Kontur-Rand in einer Farbe, die dem Motiv
 * fremd ist. Er fällt durch jeden bestehenden Filter (der Modus sieht 2 % nicht,
 * das Gold-Maß fragt nur nach Gold, und die zwei Magenta-Filter verlangen
 * b > 120 — dieser Rand hat b = 45) und wird beim Verkleinern auf die echte
 * Anzeigehöhe zu einem farbigen Schimmer um das ganze Teil. Herleitung und
 * Kalibrierung stehen an `alienRim`.
 *
 * ── WAS DIESE RUNDE (AQ10b) IMPORTIERT, UND WAS NICHT ────────────────────────
 * AQ10b hat den Haltungs-Befund eingelöst (die Teile LIEGEN jetzt: zwei blinde
 * Prüfer unabhängig 7 von 9, Unordnung 4/5 gegen vorher 1/5) und das Gold
 * beseitigt (Hut 87,14 % → 0,00 %). Sie hat sich dabei aber vier neue Fehler
 * eingehandelt. Importiert wird deshalb ZELLENWEISE, nicht als Stapel:
 *   · NEU: sunglasses · hat · shirt · skirt · socks · hud_uniform
 *   · GEHALTEN (Bestandsschnitt bleibt Kanon): hairband · school tie ·
 *     sweater · shoe — jede mit ihrem gemessenen Grund an der `held`-Zeile.
 * Ein Teil-Import ist begründungspflichtig, nicht verboten: neun halb richtige
 * Blätter gegen vier ganz richtige zu tauschen wäre kein Fortschritt.
 *
 * ── WAS AUCH DIESE RUNDE BEWUSST NICHT IMPORTIERT ────────────────────────────
 *  · `uniform_portraits.png` + `uniform_portraits_2.png`: dieselben Teile in
 *    einem eigenen gemalten Kartenrahmen. Die Karten holen ihr Bild aus derselben
 *    Pickup-Zelle; ein zweiter Rahmen-Stil würde Kokis noch offenes Tor T6
 *    (Kartenkante/Karten-Material, AQ17) vorwegnehmen. Bleiben im Labor.
 *  · `uniform_pickups_2` Zellen 1 und 3: Reserve, vollflächig Magenta. (Das
 *    goldene Aufhebe-Funkeln, das in AQ10 auf Zelle 1 lag, hat die Bestellung
 *    AQ10b gestrichen — die Zelle ist jetzt leer.)
 * Ein importiertes Blatt, das niemand lädt, ist Gewicht, das die Kunst-Prüfung
 * mitschleppt — und DEAD_ART_CEILING steht auf 53 ohne jede Luft.
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
// ── R5-W5 · G4 · THE FRINGE, FROM THE GATE'S OWN MODULE ──────────────────────
// The aq7-shaped `defringe` below is not the same test `check-paint-art` runs:
// it kills magenta-ish EDGE pixels by a fixed threshold, while the gate uses
// `key-fringe.mjs`, which calibrates against each image's own interior and looks
// four pixels deep. This round proved the gap — all ten imported sheets passed
// the importer and then failed the gate with 12 525 fringe pixels between them,
// first pixel at row 0 of each cut edge. An importer whose idea of „clean" is
// weaker than the gate's just moves the work to a repair tool, so this one now
// finishes with the SAME function the gate judges by. `key-fringe.mjs` exists
// precisely so the two can never disagree about what a defect is.
import { keyFringe, stripKeyFringe } from "../../scripts/key-fringe.mjs";

const LAB = process.env.CODEX_LAB ?? path.join(process.env.HOME, "Code", "codex-art-lab");
const OUT = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");
const DRY = process.argv.includes("--dry");

const TOL = 40;
const read = (p) => PNG.sync.read(fs.readFileSync(p));
const isMagenta = (r, g, b, tol = TOL) => Math.hypot(r - 255, g, b - 255) < tol;

function crop(src, x0, y0, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = ((y0 + y) * src.width + (x0 + x)) * 4;
      const di = (y * w + x) * 4;
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = src.data[si + 3];
    }
  }
  return out;
}

function chromaKey(png, tol = TOL) {
  for (let i = 0; i < png.data.length; i += 4) {
    if (isMagenta(png.data[i], png.data[i + 1], png.data[i + 2], tol)) png.data[i + 3] = 0;
  }
  return png;
}

function defringe(png, passes = 3) {
  const { width: W, height: H, data } = png;
  for (let p = 0; p < passes; p++) {
    const kill = [];
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (data[i + 3] === 0) continue;
        let edge = false;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) { edge = true; continue; }
          if (data[(ny * W + nx) * 4 + 3] === 0) edge = true;
        }
        if (!edge) continue;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r > 120 && b > 120 && r - g > 55 && b - g > 55) kill.push(i);
      }
    }
    for (const i of kill) data[i + 3] = 0;
    if (kill.length === 0) break;
  }
  return png;
}

const contentBox = (png) => {
  const { width: W, height: H, data } = png;
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
};

/** Same gate and same two metrics as import-batch-aq7 (see its §keyDistance):
 *  EUCLIDEAN decides (the ≥150 threshold was written for it), Manhattan is
 *  printed alongside so the numbers stay comparable across rounds. */
const keyDistance = (png) => {
  let euclid = Infinity, manhattan = Infinity;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] <= 8) continue;
    const dr = png.data[i] - 255, dg = png.data[i + 1], db = png.data[i + 2] - 255;
    const e = Math.hypot(dr, dg, db);
    const m = Math.abs(dr) + Math.abs(dg) + Math.abs(db);
    if (e < euclid) euclid = e;
    if (m < manhattan) manhattan = m;
  }
  return { euclid, manhattan };
};

/** How many separate painted things the cell holds. 4-neighbourhood flood fill
 *  over the alpha mask; blobs under `MIN_SHARE` of the painted area are dust
 *  (an antialiased speck, a chalk fleck) and are not counted as a thing. */
const MIN_SHARE = 0.02;
const blobCount = (png) => {
  const { width: W, height: H, data } = png;
  const seen = new Uint8Array(W * H);
  const painted = [];
  for (let p = 0; p < W * H; p++) if (data[p * 4 + 3] > 8) painted.push(p);
  if (painted.length === 0) return 0;
  const sizes = [];
  for (const start of painted) {
    if (seen[start]) continue;
    let size = 0;
    const stack = [start];
    seen[start] = 1;
    while (stack.length > 0) {
      const p = stack.pop();
      size++;
      const x = p % W, y = (p - x) / W;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (seen[q] || data[q * 4 + 3] <= 8) continue;
        seen[q] = 1;
        stack.push(q);
      }
    }
    sizes.push(size);
  }
  return sizes.filter((s) => s / painted.length >= MIN_SHARE).length;
};

/** The colour family the cell actually reads as — the ten book colours of SB
 *  p. 12, measured instead of typed. Opaque pixels only; the family is the mode
 *  of the per-pixel classification, so stripes and trim do not outvote the body.
 *  `grey` and `yellow` are the two families the commission forbade, so they are
 *  named rather than folded into a neighbour. */
const familyOfPixel = (r, g, b) => {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const v = max / 255;
  const s = max === 0 ? 0 : (max - min) / max;
  if (v < 0.22) return "black";
  if (s < 0.18) return v > 0.72 ? "white" : "grey";
  const d = max - min;
  let h = 0;
  if (max === r) h = 60 * (((g - b) / d) % 6);
  else if (max === g) h = 60 * ((b - r) / d + 2);
  else h = 60 * ((r - g) / d + 4);
  if (h < 0) h += 360;
  // Die Bandgrenzen sind KALIBRIERT, nicht geraten — der Block unter dieser
  // Funktion haelt sie fest. Zwei Grenzen tragen die ganze Pruefung:
  //  · 36° trennt Orange von Gelb/GOLD. Das Gold der Buchstaben (0xf0c040) liegt
  //    bei 43,6° — mit der naheliegenden 45°-Grenze faellt es in »orange«, und
  //    das Tor koennte genau die Kollision nicht sehen, gegen die §4 geschrieben
  //    ist. Gold MUSS in derselben Familie landen wie ein goldgelber Hut.
  //  · Rosa ist im Buchfarben-Sinn ein BLASSES Rot (das Haarband misst #f0a890),
  //    kein Magenta. Ohne diese Zeile meldet die Zelle »red« und die Spec-Farbe
  //    »pink« waere dauerhaft rot — eine Abweichung, die keine ist. Die Schwelle
  //    liegt bei s < 0,70 UND v > 0,75, weil auch die SCHATTEN eines rosa Dings
  //    rosa sind (#d86048 ist der Schattenton des Haarbands, nicht ein rotes
  //    Ding). Der Fall, an dem richtig und plausibel-falsch auseinandergehen,
  //    steht unten in der Kalibrierung: Haarband (rosa, wie bestellt) gegen
  //    Socken (rot, eine echte Abweichung) — trennt das Geraet die zwei nicht,
  //    misst es nichts.
  if (h < 16 || h >= 330) return s < 0.7 && v > 0.75 ? "pink" : "red";
  if (h < 36) return v < 0.62 ? "brown" : "orange";
  if (h < 70) return v < 0.62 ? "brown" : "yellow";
  if (h < 160) return "green";
  if (h < 255) return "blue";
  if (h < 330) return "pink";
  return "red";
};

// ── Kalibrierung des Messgeraets (P-65: ein Tor, das seine eigene Klasse nicht
// trennen kann, sieht den Fehler nicht, fuer den es gebaut wurde) ────────────
for (const [hex, want, why] of [
  [0xf0c040, "yellow", "das Gold der Buchstaben (PaintScene LETTER-Farbe) — die Familie, die §4 fuer Kleidung VERBIETET"],
  [0xff8000, "orange", "reines Orange, eine der zehn Buchfarben, bleibt von Gold getrennt"],
  [0x785030, "brown", "ein mittleres Braun bleibt Braun und wird nicht zu Orange"],
  [0xf0a890, "pink", "blasses Rosa (Haarband-Koerper) ist Rosa, nicht Rot"],
  [0xd86048, "pink", "der SCHATTENTON desselben Haarbands — ein rosa Ding bleibt rosa, wo es dunkler wird"],
  [0xd83018, "red", "der Sockenton: gesaettigtes Rot bleibt Rot und wird nicht zu Rosa (das ist das Paar, an dem sich die Schwelle beweist)"],
  [0xa81800, "red", "der dunklere Sockenton bleibt ebenfalls Rot"],
  [0x787878, "grey", "Grau — im Spiel der entfaerbte Zustand, deshalb eine eigene Familie"],
]) {
  const got = familyOfPixel((hex >> 16) & 255, (hex >> 8) & 255, hex & 255);
  if (got !== want) {
    console.error(`✗ Kalibrierung: #${hex.toString(16).padStart(6, "0")} misst »${got}«, muss »${want}« sein — ${why}`);
    process.exit(1);
  }
}

const familyOf = (png) => {
  const tally = new Map();
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] < 200) continue;
    const f = familyOfPixel(png.data[i], png.data[i + 1], png.data[i + 2]);
    tally.set(f, (tally.get(f) ?? 0) + 1);
  }
  let best = "—", bestN = 0, total = 0;
  for (const [f, n] of tally) { total += n; if (n > bestN) { best = f; bestN = n; } }
  return { family: best, share: total === 0 ? 0 : bestN / total };
};

/** Der Anteil ECHTEN Goldes an den deckenden Pixeln — Farbton 36-60°, dazu
 *  gesaettigt (s > 0,60) UND hell (v > 0,80).
 *
 *  Warum eine zweite, engere Messung neben `familyOf`: das Verbot aus §4 gilt
 *  fuer ANWESENHEIT, nicht fuer Dominanz. Ein blinder Blatt-Pruefer hat am
 *  17.08. eine goldene SCHNALLE am Schuh gefunden, die die Familien-Messung
 *  nicht sehen konnte (der Schuh misst 65 % braun; das Gold sind 1,4 % gelbe
 *  Pixel). Eine blosse Gelb-Anwesenheitspruefung trennt aber nichts: die
 *  Krawatte traegt 8,6 % und das Hemd 4,6 % warmes Gelb — beides sind
 *  Lichter im Malstil, beide wie bestellt. Erst die Saettigungs-/Helligkeits-
 *  Schranke trennt die Klasse sauber, gemessen an dieser Lieferung:
 *  Hut 87,14 % · Schuh 0,58 % · **alle sieben anderen exakt 0,00 %**.
 *  Ein Tor, das richtig und plausibel-falsch nicht trennt, ist Deko. */
const GOLD_SHARE_LIMIT = 0.0025;
const goldShare = (png) => {
  let n = 0, gold = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] < 200) continue;
    n++;
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const v = max / 255, s = max === 0 ? 0 : (max - min) / max;
    if (s <= 0.6 || v <= 0.8) continue;
    const d = max - min;
    let h = max === r ? 60 * (((g - b) / d) % 6) : max === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
    if (h < 0) h += 360;
    if (h >= 36 && h < 60) gold++;
  }
  return n === 0 ? 0 : gold / n;
};

/** ── ASSERTION 3 · DER FREMDE SAUM (neu, R5-W6 · G5) ────────────────────────
 *  Der Anteil der KONTUR-Pixel, die eine gesaettigte Farbe tragen, die NICHT die
 *  Familie des Motivs ist.
 *
 *  Warum es das gibt. AQ10b liefert drei Zellen mit einem ein Pixel breiten,
 *  vollgesaettigten roten Rand entlang der Schnittkante (rgb(254,0,45); im Rock
 *  liegen 2163 der 2279 roten Pixel direkt an einem transparenten Nachbarn).
 *  Kein bestehendes Tor sieht diese Klasse:
 *   · `familyOf` misst den MODUS — 2 % Rand kippen keinen braunen Rock;
 *   · `goldShare` fragt nur nach Gold;
 *   · `defringe` und `key-fringe.mjs` jagen MAGENTA (`r>120 && b>120 && …`) —
 *     dieser Rand hat b = 45 und faellt durch beide Filter;
 *   · und beim Verkleinern auf die Anzeigehoehe mittelt sich der Rand in das
 *     Motiv hinein: aus einem Pixel Rand wird ein roter Schimmer um das ganze
 *     Teil. Genau so ist er ueberhaupt aufgefallen — nicht am Blatt, sondern an
 *     einem selbst gebauten Bild in echter Spielgroesse.
 *
 *  Kalibriert an dieser Runde (der Fall, an dem richtig und plausibel-falsch
 *  auseinandergehen): alle zehn Blaetter des BESTANDS messen 0,000–0,117 %, die
 *  drei befallenen AQ10b-Zellen 2,48 / 2,70 / 4,56 %. Die Grenze liegt bei
 *  0,5 % — Faktor 5 unter dem kleinsten echten Befund und Faktor 4 ueber dem
 *  groessten sauberen Wert.
 *
 *  GRENZE DER MESSUNG, ausdruecklich: sie fragt nach einer FREMDEN Familie. Ein
 *  roter Rand um ein ueberwiegend rotes Motiv sieht sie nicht — die HUD-Ikone
 *  traegt genau diesen Fall (dominante Familie „red", Rand rot, gemessen
 *  0,002 %). Deshalb steht sie unten trotzdem als deklarierte Zeile. */
const RIM_SHARE_LIMIT = 0.005;
const alienRim = (png) => {
  const { width: W, height: H, data } = png;
  const home = familyOf(png).family;
  let opaque = 0, alien = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (data[i + 3] < 200) continue;
      opaque++;
      let edge = false;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) { edge = true; continue; }
        if (data[(ny * W + nx) * 4 + 3] < 200) edge = true;
      }
      if (!edge) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const v = max / 255, sat = max === 0 ? 0 : (max - min) / max;
      if (sat <= 0.6 || v <= 0.6) continue;
      if (familyOfPixel(r, g, b) === home) continue;
      alien++;
    }
  }
  return opaque === 0 ? 0 : alien / opaque;
};

/** stem → warum diese Zelle ihren fremden Saum behalten darf. */
const DECLARED_RIM = {
  cloth_skirt_a: "AQ10b malt den Rock in der bestellten Familie BRAUN, traegt aber den roten Kontur-Saum dieser Lieferung (2,70 %). Importiert trotzdem, weil der Bestand GRAU misst — und Grau ist im Spiel der ENTFAERBTE Zustand, also eine Bedeutungsluege auf einem Sammelobjekt. Ein Kontur-Pixel ist Kosmetik, eine falsche Bedeutung ist es nicht. Schuld D-392, Nachbestellung AQ10c.",
  hud_uniform: "Dieselbe Lieferung, derselbe Saum (an dieser Zelle von der Messung NICHT gesehen, weil ihre dominante Familie selbst rot ist — gemessen 0,002 %, tatsaechlich vorhanden). Importiert, weil die Bestands-Ikone 9,78 % Gold traegt und damit im HUD neben dem Buchstaben-Zaehler genau die Kollision zeichnet, gegen die §4 geschrieben ist. Schuld D-392, Nachbestellung AQ10c.",
};

/** stem → warum diese Zelle trotz des Gold-Verbots gold tragen darf.
 *
 *  R5-W6 · G5: LEER. AQ10b liefert Gold 0,00 % in jeder importierten Zelle — der
 *  goldgelbe Hut (87,14 %) ist ersetzt, und weil eine schale Deklaration den
 *  Import selbst bricht (siehe unten), muss die Karte hier leer sein.
 *  Die Schnalle des Schuhs (0,58 %) liegt weiter im Repo, weil der neue Schuh
 *  NICHT importiert wurde (Begruendung an seiner `held`-Zeile) — sie ist damit
 *  keine Aussage dieses Importers mehr, sondern eine Zeile im Schuldregister.
 *  Die Karte bleibt stehen, damit die naechste Lieferung wieder deklarieren
 *  kann statt still abzuweichen. */
const DECLARED_GOLD = {};

// ── the commission, cell by cell (UNIFORM_SAMMELN_DESIGN §4) ─────────────────
/** stem → the colour family the commission ordered. */
const SPEC_COLOUR = {
  cloth_hairband_a: "pink",
  cloth_sunglasses_a: "black",
  cloth_hat_a: "red",
  cloth_school_tie_a: "green",
  cloth_shirt_a: "white",
  cloth_sweater_a: "blue",
  cloth_skirt_a: "brown",
  cloth_socks_a: "white",
  cloth_shoe_a: "black",
};

/** stem → { got, why } for every cell whose measured family is NOT the ordered
 *  one. An undeclared deviation is a hard failure — that is the whole point of
 *  the map, and it is why the next delivery cannot quietly shift a colour.
 *
 *  R5-W6 · G5: LEER. Die vier Farbschulden von AQ10 (D-291) sind nicht mehr
 *  deklariert, sondern entschieden: Hut, Rock und Socken kommen in der
 *  bestellten Familie aus AQ10b; das Haarband und der Schuh werden NICHT
 *  importiert (ihre Gruende stehen an den `held`-Zeilen), also hat dieser
 *  Importer ueber sie nichts mehr zu sagen. Eine Deklaration auf einer Zelle,
 *  die gar nicht mehr geschrieben wird, waere toter Text, der wie eine
 *  Entscheidung aussieht. */
const DECLARED_DEVIATIONS = {};

/** stem → how many separate painted things the commission ordered. Only the two
 *  cells where the number carries a word's meaning are named. */
const SPEC_PIECES = { cloth_socks_a: 2, cloth_shoe_a: 1 };

// ── the sheets ───────────────────────────────────────────────────────────────
const SHEETS = [
  {
    // AQ10b Blatt 1 — dieselben acht Positionen wie AQ10, 4×2.
    file: "batch-aq10b/uniform_pickups.png", cols: 4, rows: 2,
    pieces: [
      [1, "cloth_sunglasses_a"], [2, "cloth_hat_a"],
      [4, "cloth_shirt_a"], [6, "cloth_skirt_a"], [7, "cloth_socks_a"],
    ],
    held: {
      0: "HAARBAND — AQ10b malt es dunkler neu, obwohl die Bestellung ausdruecklich »Familie halten« sagte: gemessen »red« (94,9 % der deckenden Pixel; die Rosa-Regel verlangt v > 0,75, das Band misst im Mittel 0,57). Ein zweites rotes Sammelobjekt liegt in p1 neben dem Hut. Der Bestandsschnitt misst »pink« und bleibt Kanon. (Ein blinder Blatt-Pruefer las die Zelle als »mauve/altrosa, aber Rosa« — Auge und kalibriertes Geraet sind sich ueber die Pixel einig und nur ueber das Etikett uneins; das Tor entscheidet, und es sagt rot.) D-390, Nachbestellung AQ10c.",
      3: "KRAWATTE — in der Schlaufe sitzt ein knallroter Teller, rgb(254,0,45), 9,92 % der Zelle, davon 3161 Pixel im INNEREN (also gemalter Inhalt, kein Saum). Bestellt war gruen mit weiss, sonst nichts; ein blinder Blatt-Pruefer nennt ihn mit hoher Sicherheit »eine zusaetzliche, nicht bestellte dritte Farbe an sichtbarer Stelle«. Der Bestandsschnitt ist gruen-weiss und sauber. D-391, Nachbestellung AQ10c.",
      5: "PULLOVER — traegt den roten Kontur-Saum dieser Lieferung (2,48 %, siehe `alienRim`). Der Bestandsschnitt ist blau, sauber und ohne Saum; die Farbe war nie eine Schuld. Hier gaebe es nur Haltung zu gewinnen und einen sichtbaren roten Schimmer zu verlieren — das ist kein Tausch. D-392, Nachbestellung AQ10c.",
    },
  },
  {
    // AQ10b Blatt 2 — der Schuh (Position 0), zwei leere Reserve-Zellen und die
    // HUD-Ikone. Das goldene Aufhebe-Funkeln aus AQ10 existiert in AQ10b nicht
    // mehr (Zelle 1 ist rein Schluessel) — die Bestellung hatte es gestrichen.
    file: "batch-aq10b/uniform_pickups_2.png", cols: 4, rows: 1,
    pieces: [[2, "hud_uniform"]],
    held: {
      0: "SCHUH — die Zelle enthaelt NEUN verschiedene Farben (der Bestandsschnitt: 34 916). Das ist keine Geschmacksfrage, sondern eine flache Silhouette ohne Sohle, ohne Oeffnung, ohne Binnenkontur: zwei blinde Pruefer, die nichts voneinander wussten, konnten sie unabhaengig NICHT als Schuh erkennen (»kann ich nicht erkennen«, »schwarz auf Schatten verschmilzt«). Ein Sammelobjekt, dessen Karte ein Bild zeigt und das Wort dazu fragt, muss sein Wort per Silhouette sagen (Squint-Test, §4). Der Bestandsschnitt ist lesbar, aber braun statt schwarz und traegt 0,58 % Gold an der Schnalle — diese Schuld bleibt bewusst offen, weil ein unlesbares Bild teurer ist als eine winzige Schnalle. D-393, Nachbestellung AQ10c.",
      1: "Reserve, rein Schluessel (in AQ10 stand hier das goldene Funkeln — gestrichen).",
      3: "Reserve, rein Schluessel.",
    },
  },
];

const failures = [];
const written = [];
const notes = [];

const sheetOf = (rel) => {
  const p = path.join(LAB, rel);
  return fs.existsSync(p) ? read(p) : null;
};

for (const sheet of SHEETS) {
  const png = sheetOf(sheet.file);
  if (!png) { failures.push(`${sheet.file}: not found under ${LAB}`); continue; }

  const cw = png.width / sheet.cols;
  const ch = png.height / sheet.rows;
  if (!Number.isInteger(cw) || !Number.isInteger(ch)) {
    failures.push(`${sheet.file}: ${png.width}×${png.height} does not divide into ${sheet.cols}×${sheet.rows}`);
    continue;
  }

  for (const [h, why] of Object.entries(sheet.held ?? {})) {
    notes.push(`· GEHALTEN ${sheet.file} Zelle ${h} — nicht importiert: ${why}`);
  }

  const prepared = new Map();
  for (const [pos, stem] of sheet.pieces) {
    const img = crop(png, (pos % sheet.cols) * cw, Math.floor(pos / sheet.cols) * ch, cw, ch);
    chromaKey(img);
    defringe(img);
    prepared.set(pos, { stem, img });
  }

  for (const [, { stem, img }] of prepared) {
    const box = contentBox(img);
    if (!box) { failures.push(`${stem}: keyed to nothing`); continue; }
    const out = crop(img, box.x0, box.y0, box.x1 - box.x0 + 1, box.y1 - box.y0 + 1);

    const dist = keyDistance(out);
    if (dist.euclid < 150) {
      failures.push(`${stem}: a painted pixel sits ${dist.euclid.toFixed(2)} (Euclidean) from the import colour — needs ≥150, or a tolerant key eats it`);
      continue;
    }

    // ── assertion 1 · the count carries the word ─────────────────────────────
    const want = SPEC_PIECES[stem];
    if (want !== undefined) {
      const got = blobCount(out);
      const ok = want === 1 ? got === 1 : got >= want;
      if (!ok) {
        failures.push(`${stem}: the cell holds ${got} separate painted thing(s), the word needs ${want === 1 ? "exactly 1" : `at least ${want}`} — »socks« is a pair and »shoe« is ONE; a drawn pair of shoes makes the card wrong the moment the child sees it (§4)`);
        continue;
      }
      notes.push(`✓ Zahl: ${stem} zeigt ${got} Teil(e) — wie bestellt (${want === 1 ? "genau 1" : `≥ ${want}`})`);
    }

    // ── assertion 2 · the colour, measured against the commission ────────────
    const spec = SPEC_COLOUR[stem];
    if (spec !== undefined) {
      const { family, share } = familyOf(out);
      const decl = DECLARED_DEVIATIONS[stem];
      if (family === spec) {
        if (decl) {
          failures.push(`${stem}: declared as a deviation (»${decl.got}«) but measures ${family} — the delivery was repaired and the declaration is stale; remove it`);
          continue;
        }
        notes.push(`✓ Farbe: ${stem} misst ${family} (${(share * 100).toFixed(0)} % der deckenden Pixel) — wie bestellt`);
      } else if (decl && decl.got === family) {
        notes.push(`⚠ Farbe DEKLARIERT: ${stem} bestellt »${spec}«, misst »${family}« (${(share * 100).toFixed(0)} %) — ${decl.why}`);
      } else {
        failures.push(`${stem}: ordered »${spec}«, measures »${family}« (${(share * 100).toFixed(0)} % of the opaque pixels)${decl ? ` — declared as »${decl.got}«, which is a third value again` : " — UNDECLARED"}. A colour word nobody held against a pixel is how the restore cards carried wrong answers for weeks (P-65). Repair the sheet, or declare it here with a reason and a debt number.`);
        continue;
      }
    }

    // ── assertion 2b · das Gold-Verbot gilt fuer ANWESENHEIT ────────────────
    // R5-W6 · G5 · die Klammer war zu eng: sie hing an `SPEC_COLOUR`, und die
    // HUD-Ikone hat keine Farb-Zusage. Also lief `hud_uniform` seit AQ10 ganz
    // ohne Gold-Pruefung durch — gemessen am importierten Bestand: 9,78 %.
    // Die Ikone zeigt dieselbe Uniform und sitzt im HUD neben dem Buchstaben-
    // Zaehler, also genau dort, wo die Kollision am teuersten ist. Das Verbot
    // gilt fuer JEDES Blatt, das dieser Importer schreibt.
    {
      const gs = goldShare(out);
      const why = DECLARED_GOLD[stem];
      if (gs >= GOLD_SHARE_LIMIT && why === undefined) {
        failures.push(`${stem}: ${(gs * 100).toFixed(2)} % der Flaeche ist gesaettigtes Gold — §4 verbietet Gold an dieser Klasse ausdruecklich (die Buchstaben sind 0xf0c040 und haben ein eigenes Halo). Repariere das Blatt, oder deklariere die Stelle hier mit Grund und Schuldnummer.`);
        continue;
      }
      if (gs < GOLD_SHARE_LIMIT && why !== undefined) {
        failures.push(`${stem}: traegt eine Gold-Deklaration, misst aber nur ${(gs * 100).toFixed(2)} % — das Blatt wurde repariert, die Deklaration ist schal; entferne sie`);
        continue;
      }
      if (why !== undefined) notes.push(`⚠ Gold DEKLARIERT: ${stem} ${(gs * 100).toFixed(2)} % — ${why}`);
      notes.push(`✓ Gold: ${stem} ${(gs * 100).toFixed(2)} %`);
    }

    // ── assertion 3 · der fremde Saum ───────────────────────────────────────
    {
      const rs = alienRim(out);
      const why = DECLARED_RIM[stem];
      if (rs >= RIM_SHARE_LIMIT && why === undefined) {
        failures.push(`${stem}: ${(rs * 100).toFixed(2)} % der Flaeche ist ein KONTUR-Saum in einer fremden, gesaettigten Farbe (Grenze ${(RIM_SHARE_LIMIT * 100).toFixed(1)} %; der Bestand misst 0,00-0,12 %). Weder der Magenta-Filter noch key-fringe.mjs sehen ihn, und beim Verkleinern auf 54 px wird daraus ein farbiger Schimmer um das ganze Teil. Repariere das Blatt, oder deklariere die Zelle in DECLARED_RIM mit Grund und Schuldnummer.`);
        continue;
      }
      if (rs < RIM_SHARE_LIMIT && why !== undefined) {
        notes.push(`⚠ Saum DEKLARIERT (unter der Messgrenze, ${(rs * 100).toFixed(3)} %): ${stem} — ${why}`);
      } else if (why !== undefined) {
        notes.push(`⚠ Saum DEKLARIERT: ${stem} ${(rs * 100).toFixed(2)} % — ${why}`);
      } else {
        notes.push(`✓ Saum: ${stem} ${(rs * 100).toFixed(2)} % fremde Kontur`);
      }
    }

    // ── the gate's own fringe pass, before anything is written ──────────────
    // `key-fringe.mjs` speaks {w,h,px}, pngjs speaks {width,height,data} — the
    // view below shares the SAME pixel buffer, so healing writes straight into
    // the image we are about to save. (Handing it the pngjs object directly is a
    // silent no-op: every field it reads is undefined, it finds nothing, and the
    // importer reports clean while the gate reports 12 525 fringe pixels. That
    // happened once in this session; the assertion below is why it cannot again.)
    const view = { w: out.width, h: out.height, px: out.data };
    const fringe = keyFringe(view).length;
    if (fringe > 0) {
      stripKeyFringe(view);
      const left = keyFringe(view).length;
      if (left > 0) {
        failures.push(`${stem}: ${left} fringe px survive the shared repair — check-paint-art would reject this sheet`);
        continue;
      }
      notes.push(`· Saum: ${stem} — ${fringe} Randpixel geheilt (dieselbe Funktion, nach der das Tor urteilt)`);
    }

    const dest = path.join(OUT, `${stem}.png`);
    const existed = fs.existsSync(dest);
    if (!DRY) fs.writeFileSync(dest, PNG.sync.write(out));
    written.push(`${existed ? "overwrote" : "wrote    "} ${stem}.png`.padEnd(30)
      + `${out.width}×${out.height}`.padEnd(10)
      + `key-distance ${dist.euclid.toFixed(1)} euclid / ${dist.manhattan} manhattan`);
  }
}

for (const n of notes) console.log(n);
console.log("");
for (const w of written) console.log(`  ${DRY ? "[dry] " : ""}${w}`);
console.log("");
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq10: ${failures.length} failure(s) — nothing about this delivery is accepted`);
  process.exit(1);
}
console.log(`import-batch-aq10: OK — ${written.length} stem(s)${DRY ? " (dry run, nothing written)" : ""}`);
