#!/usr/bin/env node
/**
 * import-batch-aq15b-hop — R5-W6 · F7 · MERLES HÜPFER, ZWEITER ANLAUF.
 * Importiert Batch AQ15b-hop nach apps/web/public/art/g1/paint/ch01/.
 *
 *   node docs/art/import-batch-aq15b-hop.mjs [--dry]
 *
 * Eigene Datei, nicht `import-batch-aq15.mjs`: jene gehört der C-Bahn, und zwei
 * Sitzungen in einer Importer-Datei sind ein Konflikt ohne Gewinn.
 *
 * ── WARUM ES DIESE RUNDE GIBT ───────────────────────────────────────────────
 * AQ15 lieferte vier Zellen, von denen zwei einen in SPIELGRÖSSE sichtbaren
 * Fehler trugen (ein abgetrenntes Zopfstück von 1 049 Punkten in Zelle 3, eine
 * ungefüllte Fläche an Schulter/Kragen in Zelle 2) und von denen KEINE ein
 * Aufsetzen zeigte. AQ15b-hop repariert die zwei und ergänzt die Aufsetz-Zelle.
 * Gemessen an dieser Lieferung (dasselbe Instrument, das an AQ15 Zelle 3 das
 * 1 049-Punkt-Stück findet — Negativtest bestanden):
 *
 *   Zelle          Kasten                Fußlinie  Höhe  Teile ≥20  Schlüssel (eukl.)
 *   Z0 Absprung    35,40 – 465,495       495       456   6          181,0
 *   Z1 Scheitel    20,40 – 490,495       495       456   6          181,0
 *   Z2 Fall        60,40 – 455,495       495       456   5          181,0
 *   Z3 Aufsetzen   84,64 – 408,495       495       432   6          181,1
 *   Z4 Nachfedern  35,40 – 465,495       495       456   6          181,0
 *
 * Kein loses Stück ≥ 20 Punkten außerhalb des Bestands-Rigs (Kopf, Kleid, zwei
 * Handschuhe mit Kette, zwei Schuhe — der Bestand hat 6 bis 8 Teile).
 *
 * ── DER GEMEINSAME KASTEN, UND WARUM ER DAS GANZE STÜCK IST ─────────────────
 * `renderEntities` skaliert jede Zelle einzeln auf die Anzeigehöhe: k = targetH
 * / frameH. Auf tight getrimmten Zellen heißt das (a) die gestauchte Aufsetz-
 * Zelle wird auf volle Höhe ZURÜCKGESTRECKT — die Landung hört auf zu landen —
 * und (b) der Körper springt waagrecht, weil der Zuschnitt mit dem Handschuh
 * mitwandert und der Ursprung in der Mitte sitzt.
 *
 * Deshalb werden alle fünf Zellen auf EINEN gemeinsamen Kasten getrimmt
 * (20,40 – 490,495 ⇒ 471×456). Alle fünf bekommen damit dieselbe Skalierung,
 * die Stauchung der Landung überlebt bis zum Schirm, und die Fußlinie 495 liegt
 * in jeder Zelle auf der Unterkante — was bei `setOrigin(0.5, 1)` genau die
 * Standlinie ist. Denselben Kunstgriff benutzt der Guardian („ONE SCALE FOR THE
 * WHOLE FLIGHT SHEET"), dort über eine Referenzzelle statt über den Zuschnitt.
 *
 * ── DEAD_ART ────────────────────────────────────────────────────────────────
 * Fünf NEUE Stems. Die Absicht WAR, sie im selben PR zu verdrahten (anim.ts
 * `HOP_CELLS`), damit kein totes Blatt entsteht und die Decke 53 bleibt. Die
 * Reserve-Zellen Z5–Z7 sind reiner Schlüssel und werden nicht geschrieben —
 * geprüft, nicht angenommen.
 *
 * ── R5-W7 · F8 · DIESER KOPF HAT EINE ZEIT LANG ETWAS BEHAUPTET, DAS NIE WAR ─
 * Bis heute stand hier »alle fünf im selben PR verdrahtet (anim.ts
 * `HOP_CELLS`)« — im Indikativ, als wäre es geschehen. Es ist nie geschehen:
 * `HOP_CELLS` und `merle_hop0…4` kommen in `packages/game-paint/src` nirgends
 * vor (repo-weit gegriffen, 2026-08-21). Der Hüpfer trägt bis heute
 * `anim.ts HOP_CELL = "joy"`, also ihre Freuden-Zelle. Eine Sitzung, die diesem
 * Kopf glaubte, hätte nach Code gesucht, den es nicht gibt — und ihn beim
 * Nichtfinden für einen eigenen Fehler gehalten.
 *
 * STAND (R204, Mac-Verlust 2026-08-21): die Lieferungen `batch-aq15b-hop` UND
 * `batch-aq15b-hop2` sind mit dem ersten Mac verloren. `SHEET` unten zeigt
 * deshalb weiter auf den ersten Pfad und wird NICHT umgestellt — beide Blätter
 * sind gleich unerreichbar, und ein umgestellter Pfad auf eine ebenso fehlende
 * Datei wäre nur eine neue Behauptung. Nachbestellung AQ15B-HOP3 läuft über den
 * Architekten; Import UND Verdrahtung fahren in EINEM späteren PR (Bahn-Regel).
 * Bis dahin schreibt dieser Importer nichts, und DEAD_ART bleibt trivial 53.
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const LAB = process.env.CODEX_LAB ?? path.join(process.env.HOME, "Code", "codex-art-lab");
const OUT = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");
const DRY = process.argv.includes("--dry");

const SHEET = "batch-aq15b-hop/merle_hop.png";
const COLS = 4, ROWS = 2, CELL = 512;
const STEMS = ["merle_hop0", "merle_hop1", "merle_hop2", "merle_hop3", "merle_hop4"];
const FUSSLINIE = 495;
const TOL = 40;

const read = (p) => PNG.sync.read(fs.readFileSync(p));
const isMagenta = (r, g, b, tol = TOL) => Math.hypot(r - 255, g, b - 255) < tol;

function crop(src, x0, y0, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = ((y0 + y) * src.width + (x0 + x)) * 4;
      const di = (y * w + x) * 4;
      out.data[di] = src.data[si]; out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2]; out.data[di + 3] = src.data[si + 3];
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
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * 4 + 3] > 8) {
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
};
const keyDistance = (png) => {
  let euclid = Infinity, manhattan = Infinity;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] <= 8) continue;
    const dr = png.data[i] - 255, dg = png.data[i + 1], db = png.data[i + 2] - 255;
    const e = Math.hypot(dr, dg, db), m = Math.abs(dr) + Math.abs(dg) + Math.abs(db);
    if (e < euclid) euclid = e;
    if (m < manhattan) manhattan = m;
  }
  return { euclid, manhattan };
};
/** Wie viel der Silhouetten-Kante eine DUNKLE KONTUR trägt.
 *
 *  ★ DIE PRÜFUNG, DIE DIESE LIEFERUNG ZURÜCKGESCHICKT HAT (F7, 18.08.). Merles
 *  Rig liest bei 90 Bildschirm-Punkten nur, weil jedes schwebende Teil eine
 *  dunkle Kontur trägt — ohne sie zerfällt die Figur vor einer hellen Wand. In
 *  AQ15b-hop tragen vier von fünf Zellen an 75,0–75,1 % ihrer Randpunkte eine
 *  dunkle Kontur; die NEUE Aufsetz-Zelle trägt sie an 13,1 %. Ursache ist der
 *  Weg, auf dem sie entstand: ihre Teile sind kleiner gerechnet (Kopf 23 900
 *  statt 27 163 Punkte), und beim Verkleinern-und-neu-Keyen ist die Konturlinie
 *  mitgefressen worden. Am Blatt ist der Rand dort hell und warm (Farbton 40°,
 *  Helligkeit 74 %) statt dunkel und violett (300° / 37 %); in Spielgröße
 *  überlebt der Unterschied als +9,4 Punkte Helligkeit am äußeren Ring.
 *
 *  Ein blinder Prüfer hat es gefunden, diese Zahl hat es bewiesen — und damit
 *  gehört es hierher und nicht in einen Bericht: eine Zelle, deren Kontur beim
 *  Verkleinern verlorengeht, ist eine Fehlerklasse, kein Einzelfall.
 *
 *  ── R5-W7 · F8 · D-451 · WAS DIESE ZAHL NICHT WEISS, UND WAS SIE TROTZDEM ───
 *  ── RICHTIG GESEHEN HAT ─────────────────────────────────────────────────────
 *  W5 hat diese Rechnung über ALLE 28 `merle_*.png` gefahren: zehn liegen unter
 *  dem 50-%-Tor unten. Ich habe die zehn Zahlen nachgerechnet (Funktion aus
 *  dieser Datei geschnitten, nicht abgeschrieben) — sie stimmen auf die
 *  Nachkommastelle. Zwei Befunde, und sie zeigen in verschiedene Richtungen:
 *
 *  (1) DIESE ZAHL IST EINE BLATT-ZAHL, KEINE FIGUR-ZAHL. Sie mittelt über jeden
 *      deckenden Bildpunkt, den das Blatt trägt — auch über eine REQUISITE. Vier
 *      der zehn Zellen tragen eine grosse, blasse, konturlose Requisite, und die
 *      frisst die Zahl auf (Teil-Fläche · eigener Dunkelanteil):
 *        merle_act_window1  Fenster 63 824 px @ 17,7 %  (ihr Kleid: 64,1 %)
 *        merle_act_window0  Fenster 45 728 px @ 19,1 %  (ihr Kleid: 62,4 %)
 *        merle_act_scribble0  Tisch 40 494 px @  5,7 %  (ihr Kleid: 60,3 %)
 *        merle_act_scribble1  Tisch 37 151 px @  6,6 %  (ihr Kleid: 65,4 %)
 *      Für diese vier sagt die Blatt-Zahl über MERLE nichts. Wer sie als
 *      Figur-Urteil liest, misst ein Fenster.
 *
 *  (2) UND DER MANGEL IST TROTZDEM ECHT — prop-blind gegengeprüft an dem einen
 *      Ding, das in allen 28 Zellen dasselbe ist und nie eine Requisite sein
 *      kann: ihre zwei SCHUHE (rein geometrisch gewählt, 2500–5500 px mit
 *      Unterkante im untersten Blattviertel — nie über die Kontur, sonst suchte
 *      das Lineal, was es beweisen soll):
 *        act/settle-Familie   n=8   27,8 … 38,6 %   Median 31,6
 *        klassische Familie   n=13  64,9 … 87,5 %   Median 70,3
 *      Zwei Familien, NULL Überlappung, 26 Punkte Lücke. Sieben Zellen liefern
 *      kein geometrisch eindeutiges Schuhpaar (sie steht auf Möbeln oder die
 *      Schuhe hängen zusammen) — sie sind im Report vollständig aufgezählt und
 *      NICHT stillschweigend weggelassen.
 *
 *  ENTSCHEID (R180, F8): die zehn Zellen bekommen KEINE Tor-Ausnahme. Die
 *  Ausnahme war der bequeme Weg und die prop-blinde Messung nimmt ihn weg — es
 *  sind nicht zehn Einzelfälle mit Requisiten-Pech, es ist EINE Familie
 *  (`act_*` + `settle_*`), die beim Neu-Keyen ihre Kontur verloren hat: genau
 *  die Fehlerklasse, die oben schon die Aufsetz-Zelle zurückgeschickt hat.
 *  Route: Kommission »Merle-Kontur« beim Architekten, Abnahme-Bar = die
 *  Schuh-Zahl der klassischen Familie (Boden 64,9 %), nicht die Blatt-Zahl.
 *  KEIN Blatt wurde angefasst (Auftrag). */
function konturAnteil(png) {
  const { width: W, height: H, data } = png;
  const deckend = (i) => data[i + 3] > 8;
  let rand = 0, dunkel = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (!deckend(i)) continue;
      let amRand = false;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) { amRand = true; break; }
        if (!deckend((ny * W + nx) * 4)) { amRand = true; break; }
      }
      if (!amRand) continue;
      rand += 1;
      const v = Math.max(data[i], data[i + 1], data[i + 2]) / 255;
      if (v < 0.45) dunkel += 1;
    }
  }
  return rand === 0 ? 0 : dunkel / rand;
}

/** Zusammenhängende Teile (4er-Nachbarschaft), größte zuerst. */
function teile(png, minPx) {
  const { width: W, height: H, data } = png;
  const lab = new Int32Array(W * H);
  const raus = [];
  let cur = 0;
  const stapel = [];
  for (let p0 = 0; p0 < W * H; p0++) {
    if (data[p0 * 4 + 3] <= 8 || lab[p0]) continue;
    cur += 1; lab[p0] = cur; stapel.length = 0; stapel.push(p0);
    let n = 0, minx = W, miny = H, maxx = -1, maxy = -1;
    while (stapel.length > 0) {
      const p = stapel.pop(); n += 1;
      const x = p % W, y = (p - x) / W;
      if (x < minx) minx = x; if (x > maxx) maxx = x;
      if (y < miny) miny = y; if (y > maxy) maxy = y;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (data[q * 4 + 3] > 8 && !lab[q]) { lab[q] = cur; stapel.push(q); }
      }
    }
    if (n >= minPx) raus.push({ n, box: [minx, miny, maxx, maxy] });
  }
  return raus.sort((a, b) => b.n - a.n);
}

const src = read(path.join(LAB, SHEET));
const failures = [];
const written = [];
const zellen = [];

for (let i = 0; i < COLS * ROWS; i++) {
  const cx = (i % COLS) * CELL, cy = Math.floor(i / COLS) * CELL;
  const img = defringe(chromaKey(crop(src, cx, cy, CELL, CELL)));
  const box = contentBox(img);
  if (i >= STEMS.length) {
    if (box !== null) failures.push(`Reservezelle Z${i}: trägt Farbe, obwohl sie reiner Schlüssel sein soll`);
    continue;
  }
  if (box === null) { failures.push(`Z${i}: der Schlüssel hat alles gefressen`); continue; }
  if (box.y1 !== FUSSLINIE) {
    failures.push(`Z${i}: Fußlinie ${box.y1} statt ${FUSSLINIE} — ein Blatt-Hub, den die Engine noch einmal addieren würde`);
    continue;
  }
  if (box.x0 === 0 || box.y0 === 0 || box.x1 === CELL - 1) {
    failures.push(`Z${i}: der Inhalt berührt den Zellrand (${box.x0},${box.y0},${box.x1}) — hier ist etwas abgeschnitten`);
    continue;
  }
  const gross = teile(img, 20);
  // ★ DIE ZAHL DER TEILE ALLEIN IST BLIND. AQ15 Zelle 3 trug ihr abgetrenntes
  // Zopfstück (1 049 Punkte) als ZWEITES Teil neben dem Körper — eine Prüfung
  // »höchstens acht Teile« hätte das durchgelassen, weil der Fehler nicht in der
  // ANZAHL steckt, sondern in der GRÖSSE. Der Bestands-Rig besteht aus großen
  // Stücken (merle_a: 27163 · 21865 · 5828 · 4873 · 4804 · 3077; das kleinste
  // Teil dieser Lieferung misst 2 773). Ein Fragment liegt darunter. Die Schwelle
  // steht deshalb ZWISCHEN dem bekannten Fehler und dem kleinsten echten Teil.
  const MIN_TEIL = 2000;
  const fragment = gross.find((t) => t.n < MIN_TEIL);
  if (fragment !== undefined) {
    failures.push(`Z${i}: ein Stück von ${fragment.n} Punkten @ ${fragment.box.join(",")} — `
      + `zu klein für ein Rig-Teil (kleinstes echtes Teil ≥${MIN_TEIL}), also ein Fragment wie AQ15s Zopfstück`);
    continue;
  }
  if (gross.length > 8 || gross.length < 5) {
    failures.push(`Z${i}: ${gross.length} Teile ≥20 Punkten — der Bestands-Rig hat 6 bis 8`);
    continue;
  }
  const kontur = konturAnteil(img);
  if (kontur < 0.5) {
    failures.push(`Z${i}: nur ${(kontur * 100).toFixed(1)} % der Silhouetten-Kante tragen eine dunkle Kontur `
      + `(die anderen Zellen dieses Blattes: ~75 %). Ohne Kontur zerfällt das schwebende Rig bei 90 px vor einer `
      + `hellen Wand — siehe konturAnteil`);
    continue;
  }
  zellen.push({ i, img, box, gross });
}

// ── DER GEMEINSAME KASTEN (siehe Kopf) ──────────────────────────────────────
const shared = zellen.length === STEMS.length ? {
  x0: Math.min(...zellen.map((z) => z.box.x0)), y0: Math.min(...zellen.map((z) => z.box.y0)),
  x1: Math.max(...zellen.map((z) => z.box.x1)), y1: Math.max(...zellen.map((z) => z.box.y1)),
} : null;

if (shared !== null) {
  for (const z of zellen) {
    const out = crop(z.img, shared.x0, shared.y0, shared.x1 - shared.x0 + 1, shared.y1 - shared.y0 + 1);
    const dist = keyDistance(out);
    if (dist.euclid < 150) {
      failures.push(`${STEMS[z.i]}: ein gemalter Punkt liegt ${dist.euclid.toFixed(2)} (euklidisch) vom Schlüssel — nötig sind ≥150`);
      continue;
    }
    const dest = path.join(OUT, `${STEMS[z.i]}.png`);
    const existierte = fs.existsSync(dest);
    if (!DRY) fs.writeFileSync(dest, PNG.sync.write(out));
    written.push(`${existierte ? "ersetzt" : "neu    "} ${STEMS[z.i]}.png`.padEnd(30)
      + `${out.width}×${out.height}`.padEnd(10)
      + `Inhalt ${z.box.x1 - z.box.x0 + 1}×${z.box.y1 - z.box.y0 + 1}`.padEnd(18)
      + `${z.gross.length} Teile   Schlüssel ${dist.euclid.toFixed(1)} eukl. / ${dist.manhattan} manh.`);
  }
  console.log(`  gemeinsamer Kasten: ${shared.x0},${shared.y0} – ${shared.x1},${shared.y1} `
    + `(${shared.x1 - shared.x0 + 1}×${shared.y1 - shared.y0 + 1}) — EINE Skalierung für alle fünf Zellen\n`);
}

for (const w of written) console.log(`  ${DRY ? "[trocken] " : ""}${w}`);
console.log("");
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq15b-hop: ${failures.length} Fehler — an dieser Lieferung wird nichts angenommen`);
  process.exit(1);
}
console.log(`import-batch-aq15b-hop: OK — ${written.length} Blatt/Blätter${DRY ? " (trocken, nichts geschrieben)" : ""}`);
