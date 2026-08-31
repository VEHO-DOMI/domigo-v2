// ── R5-W4b · H3 · AQ13 — DIE VOLLGEKRITZELTE TAFEL ──────────────────────────
//
// Codex AQ13 liefert die gemalten Kritzel-Schichten, die H2 prozedural
// vorgebaut hat (`PaintScene.paintScribbleLayer`, viermal überarbeitet und am
// Ende immer noch ein Platzhalter). Drei Blätter, je 2048×512 in vier
// 512er-Zellen, Freistell-Schlüssel `#FF00FF`.
//
// ── WAS DER DRAFT-MARKER GEKOSTET HAT (R91) ─────────────────────────────────
// Die Lieferung trägt „CODEX DRAFT — NOT CANON" im Kopf; aufgelöst wird der
// Marker durch einen BLINDEN Blatt-Prüfer VOR dem Import, nicht durch den
// Lieferschein. Der Prüfer sah nur die PNGs, die Zellordnung und die
// Bestands-Sprites — nicht den Lieferschein, nicht diese Datei:
//
//   Blatt 1 (`tafel_scribble`)      ANGENOMMEN
//   Blatt 2 (`tafel_wipe`)          ANGENOMMEN
//   Blatt 3 (`tafel_faces_scribbled`) ZURÜCKGEWIESEN
//
// Blatt 3 wird deshalb hier NICHT importiert, und das ist eine Messung, keine
// Meinung. Die vier Karten-Porträts sind über Silhouetten-IoU gegen jeden
// Bestands-Körper geprüft worden:
//
//   Zelle 1 → `tafel_a`         IoU 0,991   (der FLIEGENDE Körper)
//   Zelle 2 → `tafel_telegraph` IoU 0,997   ← zurückgezogener Staffelei-Körper
//   Zelle 3 → `tafel_stagger`   IoU 0,987   ← zurückgezogener Staffelei-Körper
//   Zelle 4 → `tafel_sad`       IoU 0,997   ← zurückgezogener Staffelei-Körper
//
// `anim.ts#GUARDIAN_GROUNDED_CELLS` nennt genau diese drei (plus `dazed`) als
// den Körper, den sie NIE tragen darf, solange sie fliegt — der PB-F1-
// Identitätsfehler, gegen den `guardian-flight.test.ts` die ganze Zustands-
// maschine durchfährt. Und die eine Zelle auf einem gültigen Körper sitzt auf
// dem falschen: eine Karte erscheint, während sie GELANDET ist (`land1`), nicht
// im Flug. Null von vier Porträts zeigen den Körper des Kartenmoments. Die
// Karten behalten deshalb ihr heutiges Porträt (`tafel_land1`), und die
// Nachbestellung AQ13b steht als Mess-Tabelle im Report.
//
// ── DIE EINE ABWEICHUNG VOM MUSTER (`import-batch-aq7.mjs`) ─────────────────
// aq7 schneidet jede Zelle auf ihre EIGENE Inhaltsbox. Für ein freistehendes
// Blatt ist das richtig; für ein ÜBERLAGERUNGS-Blatt wirft es genau die
// Information weg, die es transportiert. Die drei Schichten haben drei
// verschiedene Inhaltsboxen (132×128 · 145×133 · 171×184) — auf sich selbst
// getrimmt lägen sie später übereinander statt an ihrem Platz auf der Tafel.
//
// Geschnitten wird deshalb auf EIN gemeinsames Fenster, und zwar auf die
// SCHIEFERTAFEL des Bezugs-Sprites: das Roh-PNG liegt 1:1 zentriert in der
// 512er-Zelle (`(512−w)//2, (512−h)//2`), und innerhalb davon ist die grüne
// Schreibfläche das, worauf gekritzelt wird.
//
//   `tafel_a`    331×397 → Zell-Offset (90,57)  → Schiefertafel (215,125) 181×212
//   `tafel_rest` 304×381 → Zell-Offset (104,65) → Schiefertafel (156,139) 210×207
//
// Damit ist das importierte Blatt DIE Tafelfläche, und die Szene setzt es
// einfach in das Rechteck, das `PaintScene.boardAnchor` ohnehin schon für jede
// Zelle ausrechnet — ohne Fudge-Faktoren, weil Bild und Rechteck dasselbe
// Ding sind.
//
// Zwei Tore laufen je Zelle mit, beide als ZAHL im Protokoll:
//   · Registrierung — kein gemaltes Pixel darf außerhalb des Fensters liegen,
//     und die Pixel außerhalb der grünen MASKE (3 px Toleranz für den
//     Weichzeichner-Saum) bekommen ein Budget statt Vertrauen.
//   · Schlüssel-Abstand ≥ 150 euklidisch, wie in aq7 — mit dem Hinweis, dass
//     die Lieferung ihn mit 0,05–0,52 Marge besteht (ein Clamp bei exakt 150,
//     nicht organischer Abstand). Reißt er nach meinem Schnitt, ist das ein
//     Befund für AQ13b, kein stiller Fix.
//
// Aufruf:  node docs/art/import-batch-aq13.mjs [--dry]
//          node docs/art/import-batch-aq13.mjs --abnahme-tafel <batch-verzeichnis>
//          node docs/art/import-batch-aq13.mjs --abnahme-ring  <batch-verzeichnis>
//          node docs/art/import-batch-aq13.mjs --import-band  <batch-verzeichnis> [--dry]
//          node docs/art/import-batch-aq13.mjs --import-l2    <batch-verzeichnis> [--dry]
//          node docs/art/import-batch-aq13.mjs --overlay-masse <batch-verzeichnis>
//          node docs/art/import-batch-aq13.mjs --import-buehne <batch-verzeichnis> [--dry]
//          node docs/art/import-batch-aq13.mjs --nur-overlay [--dry]
//          node docs/art/import-batch-aq13.mjs --overlay-passung <batch-verzeichnis>
//          node docs/art/import-batch-aq13.mjs --overlay-fundstellen <batch-verzeichnis>
//          node docs/art/import-batch-aq13.mjs --overlay-pins    <batch-verzeichnis>
//          node docs/art/import-batch-aq13.mjs --reserve <stem> […]
//          node docs/art/import-batch-aq13.mjs --selftest

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { PNG } from "pngjs";

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

/** Der Saum-Schnitt des Importeurs, wörtlich aus `import-batch-aq7.mjs:85-108`
 *  übernommen — dieselbe Regel, damit Tor und Werkzeug nicht zwei Definitionen
 *  desselben Defekts führen (`scripts/key-fringe.mjs:224-227`). */
function defringe(png, passes = 3) {
  const { width: W, height: H, data } = png;
  let killed = 0;
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
    killed += kill.length;
    if (kill.length === 0) break;
  }
  return killed;
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

/** Euklidisch, wie in aq7 — die Metrik, für die die 150 geschrieben wurde. */
const keyDistance = (png) => {
  let euclid = Infinity;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] <= 8) continue;
    const e = Math.hypot(png.data[i] - 255, png.data[i + 1], png.data[i + 2] - 255);
    if (e < euclid) euclid = e;
  }
  return euclid;
};

/** ── DER LEITFARBTON DER SCHREIBFLAECHE, AUS DEM BLATT GELESEN ──────────────
 *  Stufe A von zwei. Sie beantwortet EINE Frage: welchen Farbton traegt die
 *  Schreibflaeche dieses Blattes? Nicht »ist sie gruen«, sondern »welcher
 *  KUEHLE Farbton stellt hier die meisten Pixel«.
 *
 *  Warum kuehl (90°…330°) und nicht farbfrei: der Rahmen ist Holz und misst auf
 *  JEDEM Blatt dieses Kapitels 35–36° — er faellt damit heraus, ohne dass
 *  irgendwo »Holz« oder eine Zahl aus dem Wareneingang steht. Gemessen ueber
 *  alle zwanzig Zellen, alter wie neuer Bestand:
 *      alter Bestand (gruen)   Gipfel 132–138°   Rahmen 30–45° (44,8 % der Pixel)
 *      neuer Bestand (nachtblau) Gipfel 233°     Rahmen 30–45° (53,6 % der Pixel)
 *  Der Gipfel wird ueber ±7° zirkular geglaettet, damit ein Cluster nicht an
 *  einer Faechergrenze zerfaellt.
 */
const leitFarbtonOf = (png) => {
  const bins = new Float64Array(360);
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2], a = png.data[i + 3];
    if (a <= 200) continue;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (mx <= 20 || d / mx < 0.25) continue;         // zu dunkel oder zu grau: kein Farbton
    let h = 0;
    if (mx === r) h = 60 * (((g - b) / d) % 6);
    else if (mx === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
    if (h < 0) h += 360;
    if (h < 90 || h >= 330) continue;                // warm (Holz, Kreide-Gold) faellt raus
    bins[Math.round(h) % 360]++;
  }
  let best = -1, bestN = 0;
  for (let i = 90; i < 330; i++) {
    let s = 0;
    for (let d = -7; d <= 7; d++) s += bins[(i + d + 360) % 360];
    if (s > bestN) { bestN = s; best = i; }
  }
  return { peak: best, n: bestN };
};

/** ── DIE SCHREIBFLAECHE EINES BESTANDS-SPRITES ──────────────────────────────
 *  Stufe B von zwei: die ORIGINALGEOMETRIE, nur mit dem Leitkanal aus Stufe A.
 *
 *  ★ R5-T1 (24.08.) — DAS LINEAL HAT NACHTBLAU GELERNT (D-653 geschlossen).
 *    Bis hierher stand hier woertlich »gruen«: `g > r·1,10 && g > b·1,05 &&
 *    g > 30 && r < 130`. AQ13B4 traegt nachtblauen Schiefer (H 239–240°, so
 *    BESTELLT — R212d trennt den Boss ueber den Farbton, nicht die Helligkeit),
 *    und damit fand dieselbe Regel auf allen zwanzig Zellen NULL Pixel.
 *
 *    Was sich geaendert hat, ist EINE Zeile: welcher Kanal der Leitkanal ist.
 *    Die Margen (1,10 / 1,05), der Boden (30), der r-Deckel (130) und die
 *    Alpha-Schwelle sind unveraendert — und das ist der ganze Trick. Auf einem
 *    GRUENEN Blatt waehlt Stufe A den gruenen Kanal, und dann IST diese Funktion
 *    Zeichen fuer Zeichen die alte Regel. Nachgemessen an allen zwanzig alten
 *    Blaettern gegen `anim.ts#GUARDIAN_SLATE`: schlimmste Abweichung 0,0005 bei
 *    einer Toleranz von 0,002 — 0 von 20 ueber der Linie.
 *
 *  ★★ WARUM NICHT DIE DREI WEGE, DIE H6 GEMESSEN HAT (D-653, alle drei rot):
 *     · farbblind (»groesstes zusammenhaengendes nicht-warmes Stueck«) findet
 *       den KOERPER, nicht die Schreibflaeche — die Messung wandert auf
 *       Schiefer-L 10,65–11,20 statt 9,53–9,93 und kippt das Urteil.
 *     · »gruen ODER blau« ist eine VEREINIGUNG: sie fuegt auf den alten
 *       Blaettern blaue Pixel hinzu, weitet den Kasten und bricht dort.
 *       Diese Funktion waehlt EINEN Kanal, sie vereinigt nichts.
 *     · den Farbton auf 133° zu drehen ist nicht verlustfrei und verfehlt
 *       sogar die alten Blaetter.
 *
 *  ⚠ Zwei Familien, eine Grenze: unter 180° fuehrt Gruen, ab 180° Blau. Eine
 *    tuerkise Schreibflaeche genau auf der Grenze waere damit eine Entscheidung
 *    per Rundung — deshalb steht die Grenze hier als Zahl und hat im Selbsttest
 *    einen eigenen Fall auf jeder Seite.
 */
const slateMaskOf = (png) => {
  const { width: W, height: H, data } = png;
  const { peak } = leitFarbtonOf(png);
  // Kein kuehler Farbton im Blatt ⇒ keine Schreibflaeche. Die Abnahme
  // beschuldigt dann den BEZUG und nicht die Lieferung (D-654).
  const leit = peak < 0 ? 1 : (peak < 180 ? 1 : 2);   // 1 = gruen, 2 = blau
  const neben = leit === 1 ? 2 : 1;
  const m = new Uint8Array(W * H);
  let n = 0, x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const r = data[i], a = data[i + 3];
      if (a <= 200 || r >= 130) continue;
      const c = data[i + leit], o = data[i + neben];
      if (c > r * 1.10 && c > o * 1.05 && c > 30) {
        m[y * W + x] = 1;
        n++;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  // ── DIE GEFUELLTE FLAECHE ──────────────────────────────────────────────
  // Die Farbmaske hat LOECHER, und sie sind gemalt: das Kreidegesicht ist weiss,
  // also weder gruen noch blau, und faellt aus jeder Farbregel heraus. Fuer die
  // HELLIGKEIT (Regel 4) ist das richtig — dort soll der Schiefer gemessen
  // werden und nicht das Gesicht. Fuer die REGISTRIERUNG des Overlay-Zweigs ist
  // es falsch: eine Kreidelinie, die ueber dem Gesicht liegt, liegt auf der
  // Schreibflaeche und nicht daneben.
  //
  // Gefuellt wird zwischen den EIGENEN Raendern, waagrecht UND senkrecht, und
  // nur wo beides zutrifft. Die Schnittmenge ist noetig, weil die Tafel in den
  // meisten Zellen gekippt ist: eine reine Zeilenfuellung nimmt die Rahmenecken
  // mit. Gemessen an `tafel_a`: roh 17 188 px → gefuellt 26 659 (+55 %) auf dem
  // nachtblauen Bestand, roh 25 681 → 28 504 (+11 %) auf dem alten gruenen —
  // der Unterschied IST das gemalte Gesicht, das AQ13B4 gebracht hat.
  const zeile = new Uint8Array(W * H), spalte = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    let a = -1, b = -1;
    for (let x = 0; x < W; x++) if (m[y * W + x]) { if (a < 0) a = x; b = x; }
    if (a >= 0) for (let x = a; x <= b; x++) zeile[y * W + x] = 1;
  }
  for (let x = 0; x < W; x++) {
    let a = -1, b = -1;
    for (let y = 0; y < H; y++) if (m[y * W + x]) { if (a < 0) a = y; b = y; }
    if (a >= 0) for (let y = a; y <= b; y++) spalte[y * W + x] = 1;
  }
  const voll = new Uint8Array(W * H);
  let nVoll = 0;
  for (let p = 0; p < W * H; p++) if (zeile[p] && spalte[p]) { voll[p] = 1; nVoll++; }
  return { m, voll, W, H, box: { x0, y0, x1, y1 }, n, nVoll, peak, leit };
};

/** Liegt (x,y) höchstens `tol` px neben der Maske? (Der Weichzeichner-Saum
 *  eines gemalten Strichs kappt sonst eine völlig gesunde Lieferung.) */
const nearMask = (mask, x, y, tol, feld = "m") => {
  for (let dy = -tol; dy <= tol; dy++) {
    for (let dx = -tol; dx <= tol; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= mask.W || ny >= mask.H) continue;
      if (mask[feld][ny * mask.W + nx] === 1) return true;
    }
  }
  return false;
};

/** ── DIE REGISTRIERUNGS-MESSUNG DES OVERLAY-ZWEIGS (R5 · T3, D-683) ─────────
 *
 *  ★ WAS HIER REPARIERT IST, UND WARUM ES DAS MASS IST UND NICHT DIE GRENZE.
 *  Bis T3 zaehlte der Overlay-Zweig jedes gemalte Pixel, das weiter als 3 px
 *  neben der FARBMASKE der Schreibflaeche lag, und brach ab 40 ab. Die Meldung
 *  dazu sagt seit jeher, was gemeint ist: »Die Schicht laege auf Rahmen oder
 *  Luft.« Gemessen wurde aber etwas anderes — naemlich auch jedes Pixel, das
 *  auf dem SCHIEFER liegt und nur von `slateMaskOf` nicht als Schiefer erkannt
 *  wird. Diese Maske verlangt einen kuehlen Farbton UND r < 130; der dunkle
 *  Saum der Schreibflaeche faellt dabei heraus. Solange die Kreide als dichter
 *  Mittelblock lag, fiel das nicht auf. Ein KRANZ, der per Bestellung am Rand
 *  liegt, faellt genau dort hinein.
 *
 *  ⚠ DASS DAS MASS UND NICHT DIE LIEFERUNG SCHULD IST, IST GEMESSEN, NICHT
 *    GERATEN (`--overlay-fundstellen`, beide Blattpaare, ein Lineal):
 *
 *      AQ13L (Kranz)          auf dem Rahmen   0 px   ·  auf Luft  0–37 px
 *                             Abstand zur Maske <= 14 px, Gewicht bei 4–6
 *      Bestand, heute im Spiel  auf dem Rahmen 0 px   ·  auf Luft  0 px
 *      die drei ECHT verschobenen Wisch-Zellen (25–26 px nach rechts):
 *                             auf dem Rahmen 1264/1200/1634 px, alle auf EINER
 *                             Seite, Abstand bis 27 px mit langem Schwanz
 *
 *    Rand-Malerei liegt RINGSUM und dicht; eine Fehlregistrierung liegt auf
 *    EINER Seite, weit weg und zum groessten Teil auf dem Rahmen. Die zwei
 *    Klassen trennen um den Faktor ~30 — nicht um ein Haar.
 *
 *  Gezaehlt wird deshalb das, was die Meldung immer schon behauptet: Malerei auf
 *  RAHMEN oder LUFT. Malerei auf dem Koerper innerhalb der Schiefer-Schachtel
 *  ist RAND-MALEREI: sie wird als eigene Zahl gemeldet und ist kein
 *  Abbruchgrund.
 *
 *  ★★★ DIE EICHUNG DER GRENZE (R5 · T4 — Architekten-Ruling R218, D-692) ─────
 *
 *      37   |   200   |   1208
 *      ↑        ↑         ↑
 *      |        |         die MILDESTE der drei echt verschobenen Wisch-Zellen
 *      |        |         (`batch-aq13/` Wisch 0–2: 1272 / 1208 / 1652 px, alle
 *      |        |         25–26 px zu weit rechts — die kranke Klasse)
 *      |        die Grenze: das geometrische Mittel der beiden Bandkanten
 *      |        (√(37·1208) = 211,4 → auf 200 gerundet). Sie liegt 5,4× ueber
 *      |        dem schlimmsten ehrlichen Blatt und 6,0× unter dem mildesten
 *      |        kranken — in der Mitte einer Luecke, in der NICHTS liegt.
 *      die SCHLIMMSTE ehrliche Zelle des Bestandes (T3, `--overlay-fundstellen`:
 *      die zehn Zellen, die der Importeur wirklich schneidet, messen sechsmal 0
 *      sowie 6 / 34 / 37 / 37)
 *
 *  ★ WARUM DAS KEINE EICHUNG IN EIGENER SACHE IST. T3 hat die Zahl gemessen und
 *    den Entscheid ausdruecklich NICHT selbst gefaellt (D-684: »eine Grenze zu
 *    verschieben ist eine Eichung und gehoert dem Architekten«). Der Architekt
 *    hat sie gefaellt — R218, und zwar VOR der Lieferung AQ13M, deren Zellen sie
 *    danach passieren. Die Reihenfolge ist der ganze Punkt: eine Grenze, die
 *    erst weicht, nachdem eine Lieferung an ihr gescheitert ist, ist keine
 *    Eichung, sondern eine Ausrede. Wer sie erneut bewegen will, braucht neue
 *    ZAHLEN an den Bandkanten, nicht ein neues Blatt.
 *
 *  ⚠ WAS DIE 200 NICHT TUT: sie macht aus einer Fehlregistrierung keine
 *    Rand-Malerei. Die zwei Klassen trennen um den Faktor ~30, und der
 *    Selbsttest faehrt beide Bandkanten mit gezaehlten Attrappen an (Fall-Block
 *    5f): 37 und 52 bleiben gruen, 1208 wird rot, und ein Paar auf 200/201
 *    zeigt, dass die Grenze wirklich dort steht, wo sie steht.
 *
 *  ⚠ ZWEITE EHRLICHE GRENZE: die Schiefer-Schachtel ist achsenparallel, die
 *    Tafel in den meisten Zellen gekippt. In den Ecken der Schachtel liegt
 *    darum Rahmen, den diese Messung als »auf dem Koerper« fuehrt. Der Deckel
 *    dagegen ist die Grenze selbst (40 px) und der Kasten-Test eine Zeile
 *    weiter oben, der den Inhalt ueberhaupt erst in die Schachtel zwingt.
 *    Ein Helligkeits-Kriterium waere hier FALSCH: das gemalte Gesicht des
 *    Bezugs ist heller als der Holzrahmen (D-664).
 */
const OFF_MAX = 200;   // R218 · D-692 — Herleitung 37 | 200 | 1208 im Kopf darueber

function overlayNeben(cell, cw, ch, slate, offX, offY, ref) {
  const B = slate.box;
  let gemalt = 0, daneben = 0, rand = 0, erste = null;
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    if (cell.data[(y * cw + x) * 4 + 3] <= 8) continue;
    gemalt++;
    const rx = x - offX, ry = y - offY;
    const drin = rx >= 0 && ry >= 0 && rx < slate.W && ry < slate.H;
    if (drin && nearMask(slate, rx, ry, 3, "voll")) continue;
    const a = drin ? ref.data[(ry * ref.width + rx) * 4 + 3] : 0;
    // Auf dem KOERPER und innerhalb der Schiefer-Schachtel ⇒ Rand-Malerei auf
    // der eigenen Schreibflaeche. Alles andere ⇒ Rahmen oder Luft.
    if (drin && a > 8 && rx >= B.x0 && rx <= B.x1 && ry >= B.y0 && ry <= B.y1) { rand++; continue; }
    daneben++;
    if (erste === null) erste = `${x},${y}`;
  }
  return { gemalt, daneben, rand, erste };
}

// ── die Blätter ──────────────────────────────────────────────────────────────
//
// `ref` ist das Bestands-Sprite, gegen das die Zelle registriert ist; das
// Schnittfenster wird daraus GERECHNET (Zentrierung + Schiefertafel), nie
// getippt. `pieces` ist [Zellindex, Stem].
const SHEETS = [
  {
    file: "batch-aq13m/tafel_scribble.png",
    cols: 4, rows: 1,
    ref: "tafel_a",
    pieces: [
      [0, "tafel_scribble1"], // die leichte Schicht — ABC, Sonne, Strichmaennchen
      [1, "tafel_scribble2"], // dazu 2+2=4, die Sonne oben rechts
      [2, "tafel_scribble3"], // die volle, lange nicht gewischte Tafel: dazu der Stern
      [3, "tafel_scribble3b"], // dieselbe, um (3,−2) versetzt: das Zittern im Ausholen
    ],
  },
  {
    file: "batch-aq13m/tafel_wipe.png",
    cols: 4, rows: 1,
    ref: "tafel_rest",
    // Zellen 0–2 (die drei Wisch-Zwischenbilder) werden NICHT importiert: sie
    // zeigen die volle Schicht 3 mit einem von links wachsenden Loch, gelten
    // also nur für die ERSTE der drei Schichten. Die Engine wischt jede Schicht
    // mit demselben Schnitt (`setCrop`, links→rechts, stufenlos) — drei
    // Standbilder, die nur bei hp = 3 stimmen, wären ein Schwamm, der beim
    // zweiten Wischen verschwindet. Die Bestellung dafür steht in AQ13b:
    // Zwischenbilder JE SCHICHT oder ein Schwamm als eigenes, freies Motiv.
    pieces: [
      [3, "tafel_clean"], // frisch gewischt: feuchter Glanz auf der Ruhe-Zelle
    ],
    held: [0, 1, 2],
  },
];


/* ─────────────────────────────────────────────────────────────────────────────
 * DIE TAFEL-ABNAHME und DIE RING-ABNAHME (R5-W6b · H4)
 *
 * Zwei Lieferungen sind an derselben Sache gescheitert, und keine der beiden
 * konnte es am eigenen Lieferschein sehen: gemessen wurde gegen ein MASS, DAS
 * DIE LIEFERUNG SELBST MITBRINGT. Codex meldet fuer die Tafel eine
 * Gesichtsquote von 0,41–0,55 und liegt damit ueber der bestellten 0,40 — aber
 * die Bezugszahl N ist seine eigene, und sie ist systematisch kleiner als die
 * am Bestand gezaehlte. Gegen den Bestand gerechnet fallen drei Zellen durch.
 * Fuer den Ring meldet er eine Naht von 0,0 ueber null gemeinsamen Pixeln —
 * das ist keine bestandene Naht, sondern eine ungemessene.
 *
 * ★ WARUM DIESE ABNAHME NICHT MIT DEN ZAHLEN DES LIEFERSCHEINS RECHNET
 *   (dieselbe Klasse wie C6/D-382, die zwei Lineale): jede Zahl hier wird am
 *   BESTAND oder am gelieferten Bild selbst genommen, nie aus dem Lieferschein
 *   uebernommen. Ein Lieferschein ist eine Behauptung; er darf die Pruefung
 *   nicht mit ihrem eigenen Massstab beliefern.
 *
 * Die sechs Regeln der Tafel:
 *   1 KEIN ZWILLING — keine zwei Zellen eines Blattes sind byteweise gleich.
 *     Vier Kritzel-Zustaende, von denen zwei dieselbe Datei sind, sind drei.
 *   2 DIE ZELLE SITZT, WO DER BESTAND SITZT — die Silhouette der gelieferten
 *     Zelle deckt sich mit dem ZENTRIERT eingesetzten Bestandskoerper. Wer
 *     unten buendig zeichnet, ist in sich stimmig und trotzdem falsch: der
 *     Importeur schneidet sein Fenster zentriert, die Kritzelei laege 36–102 px
 *     zu hoch auf der Tafel — je Koerper anders.
 *   3 DAS GESICHT GEGEN DEN BESTAND — Pixel mit L > 240 und S < 0,10, gemessen
 *     an mindestens 0,40 × N, wobei N die Zahl der Pixel mit L > 200 im
 *     BESTANDSKOERPER ist. Nicht in einer mitgelieferten Zahl.
 *   4 SCHIEFER SCHWARZ UND GEMALT — Mittel-L der Schieferflaeche ≤ 10 und
 *     mittlerer Nachbarschritt ≥ 1,5. Dunkel heisst nicht flach.
 *   5 KEINE MASSENFARBE — kein einzelner RGB-Wert stellt mehr als 1,0 % der
 *     gemalten Pixel eines Blattes. Echte Malerei hat keine Massenfarbe; ein
 *     Schutzfilter, der ersetzt statt schiebt, hinterlaesst genau eine.
 *   6 ECHTE SCHLUESSEL-RESERVE — kein gemaltes Pixel unter 180 Abstand, und
 *     das Histogramm wird gedruckt: liegt mehr als 1 % aller Pixel auf EINEM
 *     Abstandswert, ist das eine Klemmkante und wird benannt.
 *
 * Die sechs Regeln des Rings (Naht-Formel woertlich aus `import-batch-as.mjs`,
 * PROFILE_DEPTH 8, Grenze 1,5 × Nachbarschritt):
 *   1 NAHT a|b   2 WRAP b|a — je mit der Zahl der gemeinsamen bemalten Pixel.
 *     Null gemeinsame Pixel = ungemessen = rot.
 *   3 DAS BAND TRAEGT UEBER DIE VOLLE BREITE — keine unbemalte Spalte.
 *   4 BAND-HELLIGKEIT 14,0–15,5 %   5 HOLZTON H-Median 38–41°
 *   6 RESERVE ≥ 180 auf beiden Blaettern.
 *   + DIE ACHT NAHT-GESETZE (R5-W7 · H5 — R200 · R203 · R205): Profil-Flachheit ·
 *     Spaltenprobe · Streuung · Adjazenz-Konsistenz · Vorzeichen · kleine
 *     Differenzen · Kanal-Variation, dazu die Sperr-SHAs schon zurueckgewiesener
 *     Blaetter. Wortlaut und Eichung stehen bei `nahtGesetze` weiter unten.
 *     Kurzform, warum es sie gibt: das Tor hatte bis dahin nur OBERgrenzen und
 *     gab deshalb ALLEN VIER zurueckgewiesenen Ring-Lieferungen Exit 0.
 *
 * Aufruf:
 *   node docs/art/import-batch-aq13.mjs --abnahme-tafel <batch-verzeichnis>
 *   node docs/art/import-batch-aq13.mjs --abnahme-ring  <batch-verzeichnis>
 *   node docs/art/import-batch-aq13.mjs --selftest
 */

const FACE_L = 240, FACE_S = 0.10, REF_L = 200, FACE_QUOTA = 0.40, FACE_MIN = 40;
/** ── SLATE_L_MAX · NEU GEEICHT AN DER GEMESSENEN LUECKE (R5-T1, D-6xx) ──────
 *  Die Schwelle stand auf **10** und war an der GRUENEN Palette geeicht — mit
 *  0,7 % Luft: gesund mass 9,45–9,93, die Schwelle lag bei 10. Ein Blatt, das
 *  seine Farbe wechselt, kippt eine so knappe Schwelle per Bauart, und genau
 *  das ist am 23.08. passiert (D-653).
 *
 *  Die Eichleiter, in EINEM Lauf ueber alle zwanzig Zellen gemessen:
 *      gesund · nachtblauer Bestand (AQ13B4, heute)      10,50 … 10,88
 *      dieselben Blaetter, +2 Helligkeit                 12,50 … 12,88
 *      dieselben Blaetter, +8 Helligkeit                 18,50 … 18,88
 *      dieselben Blaetter, +12 Helligkeit                22,50 … 22,88   ← beisst
 *      dieselben Blaetter, +40 Helligkeit                50,50 … 50,88
 *      krank · AQ13b2, echt zurueckgewiesen, volle Maske 47    … 49
 *      krank · Selbsttest »helle Streifen in der Maske«        61,35
 *  Zwischen 10,9 und 47 liegt nichts. Die Schwelle liegt jetzt in dieser
 *  Luecke statt auf der Kante des gesunden Bandes: **22** — doppelte Luft nach
 *  unten, mehr als doppelte nach oben, und beide historisch KRANKEN Werte
 *  bleiben rot. Ein nachtblauer Schiefer, den jemand um 12 von 255 aufhellt,
 *  wird rot; das ist die Groessenordnung, in der sich die Flaeche verdoppelt.
 *  (Die alte Zahl steht hier bewusst mit: sie war nicht falsch, sie war an
 *  einer anderen Palette geeicht. Wer die Palette wieder wechselt, faehrt
 *  diese Leiter erneut — das Werkzeug dafuer ist der Selbsttest weiter unten.)
 */
const SLATE_L_MAX = 22, MIN_TEXTURE = 1.5, MASS_MAX = 0.01, KEY_MIN = 180;

/** ── R5-T5 · D-695 · DIE MASSENFARBE DER STRICH-OVERLAYS ───────────────────
 *
 * ★ WARUM ES DIESE ZWEITE GRENZE GIBT. `MASS_MAX` (1 %) ist fuer VOLLFLAECHIGE
 *   Koerper-Blaetter geschrieben und dort richtig. Ein STRICH-OVERLAY ist das
 *   Gegenteil: fast nur Kreide auf Durchsicht, und ein breiter Strich stellt
 *   naturgemaess viel von einer Farbe. T4 hat gemessen, dass AQ13M die 1 %
 *   reissst (2,17 % / 2,09 % je Blatt) — und hat KEINEN Freibrief gesetzt,
 *   weil das Tor `--abnahme-tafel` auf diesem Blattpaar STRUKTURELL nicht
 *   laeuft: es verlangt die drei Koerper-Blaetter und bricht ohne sie mit
 *   Exit 2 ab (`RECOLOUR_CELLS`). Ein Tor, das nicht laeuft, meldet nicht
 *   »rot« — es meldet GAR NICHTS. Das ist die stille-Durchfahrt-Klasse, und
 *   sie ist teurer als jedes rote Licht.
 *
 * ★ DIE EICHUNG, an drei Ecken selbst gemessen (T5, `--overlay-pins` je Zelle):
 *
 *      8,72 %   |   13 %   |   20 %
 *
 *   • 8,72 % — die schlimmste Zelle des BESTANDS-Overlays, das heute in der
 *     Welt liegt (batch-aq13m, `tafel_scribble` Zelle 1; die acht Zellen der
 *     beiden Blaetter messen 0,32 · 0,35 · 0,41 · 1,41 · 1,41 · 1,48 · 7,33 ·
 *     8,72 %). Die Vorgeneration AQ13L lag bei 0,51–1,66 %.
 *   • 20 %   — das BETRUGS-FIXTURE des Selbsttests (`mkOverlay`, seit H5):
 *     jede fuenfte Kreide auf exakt einem RGB-Wert.
 *   • 13 %   — die Grenze. Geometrisches Mittel der beiden Kanten
 *     (√(8,72·20) = 13,21), auf 13 gerundet.
 *
 * ⚠ UND JETZT DIE EHRLICHE HAELFTE, DIE MAN NICHT WEGLASSEN DARF. Dieses Band
 *   ist DUENN: 1,49× ueber der ehrlichen Kante, 1,54× unter der kranken. Zum
 *   Vergleich traegt R218 (Rahmen/Luft) 5,4× und 6,0×. Der Grund ist kein
 *   Schlamperei-Fehler, sondern eine Eigenschaft der Kennzahl: die
 *   UR-Generation `batch-aq13` misst **47,89–75,34 %** je Zelle und wurde
 *   ausdruecklich als ehrliche Kreide erklaert (H6, acht gepinnte Zell-SHAs).
 *   Damit ueberlappen die Baender — 20 % Betrug liegt UNTER 47 % Ehrlichkeit.
 *   **Der Anteil der haeufigsten Farbe trennt Farbfeld und Strich-Malerei
 *   also nicht ueber den ganzen Bereich.** Genau deshalb gab es die acht Pins
 *   ueberhaupt, und genau deshalb bleibt der Ausnahmeweg der gepinnte
 *   ZELL-SHA (nie der Name): die Grenze faengt die heutige Schule des
 *   Zeichnens, und alles darueber ist eine ERKLAERTE Entscheidung, keine
 *   stille Durchfahrt.
 *
 * ★ WAS DIESER MODUS DESHALB TUT — und was nicht: er MISST und urteilt gegen
 *   diese Grenze. Ueber die KUNST urteilt er nicht; was aus einem roten Licht
 *   folgt (Pin, Rueckweisung oder eine neue Bestellung), entscheidet die Bahn
 *   mit dieser Zahl in der Hand. Dasselbe Verhaeltnis wie bei
 *   `--overlay-passung` (T2), und aus demselben Grund.
 */
const OVERLAY_MASSE_MAX = 0.13;
/** Die zwei Kanten, aus denen die Grenze kommt — sie stehen als ZAHL hier,
 *  damit der Selbsttest sie anfahren kann und nicht abschreiben muss. */
const OVERLAY_MASSE_EHRLICH = 0.0872, OVERLAY_MASSE_KRANK = 0.20;
/** Rauhheit: wie weit ein Pixel von seinen vier Nachbarn abweicht, in Einheiten
 *  der Streuung der Flaeche selbst. Gemessen mit Kontrollen im selben Lauf:
 *  weisses Rauschen 0,889 · glatte Malerei 0,003 · die zwanzig BESTANDS-Tafeln
 *  0,109–0,127 · diese Lieferung 0,324–0,435. Die Schwelle liegt in der Luecke. */
const MAX_ROUGHNESS = 0.20;
const PROFILE_DEPTH = 8, SEAM_OVER_TEXTURE = 1.5;
const BAND_L = [14.0, 15.5], BAND_H = [38, 41];

const KEY = (r, g, b) => r === 255 && g === 0 && b === 255;
const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const satS = (r, g, b) => {
  const mx = Math.max(r, g, b) / 255, mn = Math.min(r, g, b) / 255;
  if (mx === mn) return 0;
  const l = (mx + mn) / 2, d = mx - mn;
  return l < 0.5 ? d / (mx + mn) : d / (2 - mx - mn);
};
const hueOf = (r, g, b) => {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d === 0) return 0;
  let h;
  if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
  h *= 60; return h < 0 ? h + 360 : h;
};
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length === 0 ? NaN : s[s.length >> 1]; };

/** Das gelieferte Blatt kommt UNGEKEYT (RGB); "gemalt" heisst also: nicht der
 *  Schluessel. Fuer bereits freigestellte Blaetter zaehlt zusaetzlich Alpha. */
const onAt = (png, x, y) => {
  const i = (y * png.width + x) * 4;
  if (png.data[i + 3] <= 8) return false;
  return !KEY(png.data[i], png.data[i + 1], png.data[i + 2]);
};

/** Silhouetten-Kasten der gemalten Pixel. */
function paintedBox(png, x0 = 0, y0 = 0, w = png.width, h = png.height) {
  let a = w, b = h, c = -1, d = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!onAt(png, x0 + x, y0 + y)) continue;
    if (x < a) a = x; if (x > c) c = x; if (y < b) b = y; if (y > d) d = y;
  }
  return c < 0 ? null : { x0: a, y0: b, x1: c, y1: d };
}

/** SHA-256 ueber die rohen RGB-Bytes eines Ausschnitts — Zwillinge finden. */
function cellHash(png, x0, y0, w, h) {
  const buf = Buffer.allocUnsafe(w * h * 3);
  let k = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = ((y0 + y) * png.width + (x0 + x)) * 4;
    buf[k++] = png.data[i]; buf[k++] = png.data[i + 1]; buf[k++] = png.data[i + 2];
  }
  return crypto.createHash("sha256").update(buf).digest("hex");
}

/** Mittlerer waagrechter Nachbarschritt einer Flaeche — dieselbe Formel wie
 *  MIN_TEXTURE in `import-batch-as.mjs`: Mittel von (|dr|+|dg|+|db|)/3. */
function textureOf(png, box, inside = null) {
  let s = 0, n = 0;
  for (let y = box.y0; y <= box.y1; y++) for (let x = box.x0 + 1; x <= box.x1; x++) {
    if (inside !== null && (!inside(x, y) || !inside(x - 1, y))) continue;
    if (!onAt(png, x, y) || !onAt(png, x - 1, y)) continue;
    const i = (y * png.width + x) * 4, j = (y * png.width + (x - 1)) * 4;
    s += (Math.abs(png.data[i] - png.data[j]) + Math.abs(png.data[i + 1] - png.data[j + 1])
      + Math.abs(png.data[i + 2] - png.data[j + 2])) / 3;
    n++;
  }
  return n === 0 ? 0 : s / n;
}

/** ── RAUSCHEN IST KEINE MASERUNG ────────────────────────────────────────────
 *  `MIN_TEXTURE` misst den mittleren Nachbarschritt — und genau den maximiert
 *  Einzelpunkt-Rauschen. Eine Flaeche aus weissen Punkten auf Schwarz besteht
 *  die Maserungs-Regel muehelos und ist trotzdem keine Malerei. Diese Zahl
 *  misst, was der Nachbarschritt nicht sieht: sagt die NACHBARSCHAFT den Punkt
 *  voraus? Bei gemalter Flaeche ja (kleiner Wert), bei Rauschen nein.
 *
 *  Rauhheit = Mittel(|Pixel − Mittel der vier Nachbarn|) / Streuung der Flaeche.
 *  Skalenfrei, also unabhaengig davon, wie dunkel oder kontrastreich die Tafel
 *  ist — genau das braucht eine Regel, die einen schwarzen Schiefer und einen
 *  gruenen am selben Massstab misst. */
function roughnessOf(png, box, inside) {
  const vals = [];
  const at = (x, y) => {
    const i = (y * png.width + x) * 4;
    return lum(png.data[i], png.data[i + 1], png.data[i + 2]);
  };
  for (let y = box.y0; y <= box.y1; y++) for (let x = box.x0; x <= box.x1; x++) {
    if (!inside(x, y) || !onAt(png, x, y)) continue;
    vals.push(at(x, y));
  }
  if (vals.length < 50) return NaN;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length);
  if (!(sd > 0)) return NaN;
  let s = 0, n = 0;
  for (let y = box.y0 + 1; y < box.y1; y++) for (let x = box.x0 + 1; x < box.x1; x++) {
    if (!inside(x, y) || !onAt(png, x, y)) continue;
    let ok = true;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (!inside(x + dx, y + dy) || !onAt(png, x + dx, y + dy)) { ok = false; break; }
    }
    if (!ok) continue;
    const nb = (at(x + 1, y) + at(x - 1, y) + at(x, y + 1) + at(x, y - 1)) / 4;
    s += Math.abs(at(x, y) - nb); n++;
  }
  return n < 50 ? NaN : (s / n) / sd;
}

/** colDiff der Torformel: Mittel ueber alle y, in denen BEIDE Spalten tragen. */
function colDiff(A, ia, B, ib) {
  let s = 0, n = 0;
  const H = Math.min(A.height, B.height);
  for (let y = 0; y < H; y++) {
    if (!onAt(A, ia, y) || !onAt(B, ib, y)) continue;
    const i = (y * A.width + ia) * 4, j = (y * B.width + ib) * 4;
    s += (Math.abs(A.data[i] - B.data[j]) + Math.abs(A.data[i + 1] - B.data[j + 1])
      + Math.abs(A.data[i + 2] - B.data[j + 2])) / 3;
    n++;
  }
  return { v: n === 0 ? NaN : s / n, n };
}

/** Naht nach der Torformel: Fuge = p[0], Sprung = groesster Anstieg in p. */
function seamOf(A, B) {
  const p = [], counts = [];
  for (let k = 0; k <= PROFILE_DEPTH; k++) {
    const { v, n } = colDiff(A, A.width - 1 - k, B, k);
    p.push(v); counts.push(n);
  }
  let sprung = -Infinity;
  for (let k = 1; k <= PROFILE_DEPTH; k++) sprung = Math.max(sprung, p[k] - p[k - 1]);
  return { fuge: p[0], sprung, shared: counts[0], p };
}

/** Nachbarschritt ueber ein ganzes Blatt (der Schritt der Torformel). */
function stepOf(png) {
  return textureOf(png, { x0: 0, y0: 0, x1: png.width - 1, y1: png.height - 1 });
}

/* ─────────────────────────────────────────────────────────────────────────────
 * DIE ACHT NAHT-GESETZE (R5-W7 · H5 — R200 · R203 · R205)
 *
 * WARUM ES SIE GIBT. Die Ringbuehne ist sechsmal geliefert worden, und jede
 * Runde hat den Buchstaben des jeweils neuesten Tors getroffen, ohne den
 * bestellten Gegenstand — Malerei — zu liefern:
 *
 *   c3  gespiegelte Naht + ein Feigenblatt-Pixel   → Fuge 0,000
 *   c4  die Wrap-Spalte ist BYTEGENAU die Spalte 0 (1260 von 1260 Zeilen)
 *   c5  einseitige Zwei-Stufen-Lasur (Differenz nur {0,+2,+4}, 0 negative)
 *   c6  vorzeichen-balancierter, quantisierter Einzelzeilen-Jitter
 *
 * GEMESSEN AM STAND VOR DIESER BAHN: das Tor, wie es hier ankam, gibt ALLEN
 * VIEREN Exit 0. Es prueft an der Naht nur Fuge und Sprung gegen eine Grenze —
 * und eine gespiegelte Naht liefert Fuge 0,000, also die beste Zahl, die es
 * kennt. Ein Tor, dessen bestes Urteil ein Duplikat ist, hat eine Untergrenze
 * noetig und keine Obergrenze mehr.
 *
 * WAS HIER AUSDRUECKLICH NICHT GEBAUT WIRD (beides waere falsch geeicht, beides
 * stand als Idee auf dem Papier — Wareneingang 21.08. B):
 *   · »hoechstens 40 bytegleiche Zeilen« — der EHRLICHE c3-Wrap hat 213, und
 *     benachbarte Spalten desselben Blattes haben im Median rund 1071. Auf einer
 *     zylindrisch gemalten Leinwand ist Aehnlichkeit das ZIEL, nicht der Fehler.
 *   · ein Boden fuer die Zahl der ungleichen Zeilen je Kanal — der ehrliche
 *     c3-Wrap hat dort 7/5/7.
 * An ihrer Stelle stehen Gesetze, die die Naht gegen die VERTEILUNG DES EIGENEN
 * BLATTES halten: eine ehrliche Naht ist statistisch eine Spalte wie jede andere.
 *
 * DIE EICHUNG (jede Zahl unten in dieser Sitzung selbst nachgerechnet, die
 * Architekten-Zahlen aus WARENEINGANG_2026-08-21B/C reproduzieren):
 *
 *   Blatt        ident   [P1,P99]        Vorzeichen   |d|<=5    kanal-uniform
 *   c3 Buehne      213   [107, 1243] ✓   48,7 % ✓     100 % ✓   34,3 % ✓
 *   c4 Buehne     1260   ueber P99   ✗   —            —         —
 *   c5 Buehne      130   unter P1    ✗   0 %      ✗   100 %     30,3 %
 *   c6 Buehne     1014   [916, 1152] ✓   46,3 % ✓     0 %   ✗   100 %      ✗
 *   c4 BAND        150   [79, 168]   ✓   32,3 % ✓     41,9 % ✓  0 %   ✓
 *
 * Das importfaehige Band besteht alle acht — die Gesetze und R199 widersprechen
 * einander nicht. Das war vor der Messung offen und ist der Grund, warum die
 * Reihe auch auf die Band-Schleife gelegt werden darf.
 */

/** (ii) Ein Profil, dessen Tiefe nichts mehr bewegt, ist eine Kopie mit Rand. */
const FLACH_MAX = 0.05;
/** (iv) Eine bytegenaue Duplikatspalte hat Streuung exakt 0,000. */
const STREU_MIN = 0.5;
/** (v) Das Fenster, in dem die Naht liegen muss — Perzentile der EIGENEN
 *  Nachbarpaare des Blattes. Beide Enden zaehlen: zu aehnlich ist Kopie, zu
 *  unaehnlich ist Bruch oder Lasur. */
const ADJ_LO = 1, ADJ_HI = 99;
/** (vi) Gemalte Nachbarschaft schwankt in BEIDE Richtungen. Unter so wenigen
 *  ungleichen Zeilen traegt der Anteil kein Urteil — dann entscheidet (v). */
const VZ_ANTEIL = 0.10, VZ_ZEILEN = 40;
/** (vii) Malerei hat kleine Differenzen; ein quantisierter Versatz hat keine. */
const KLEIN_D = 5, KLEIN_ANTEIL = 0.30;
/** (viii) Ein Pinsel trifft die drei Kanaele nicht gleich; ein Rechenschritt schon. */
const UNIFORM_ANTEIL = 0.60;

/** Die zurueckgewiesenen Buehnen, mit Grund. sha256 ueber die rohen RGB-Bytes —
 *  dieselbe Groesse, mit der die Bestellungen ihre Pins fuehren.
 *  ⚠ EHRLICHE GRENZE: c und c2 liegen nach dem Mac-Verlust (R204) auf keinem
 *  Geraet mehr, ihre SHAs konnten hier nicht gemessen werden. Die Liste ist,
 *  was messbar war — vier von sechs —, und sagt das statt sechs zu behaupten. */
const SPERR_BUEHNEN = new Map([
  ["b7a096c87c51a20b102faa4aa1ad0919bc244c67cc39cd6635d223c2c562a449", "AQ13c3 — gespiegelte Naht + Feigenblatt-Pixel (Wareneingang 20.08.)"],
  ["4bc3da2e8aa7233e38b6024f146e2c154e2fae66e7b0e07e8c48baaa06406d32", "AQ13c4 — Wrap-Spalte bytegenau gleich Spalte 0 (R199)"],
  ["70ed442e18308dbd2c17d258bbd7674becbd68d799acb7ef02951a903ab2517a", "AQ13c5 — einseitige Zwei-Stufen-Lasur (R203)"],
  ["931f8b974cd546f2e5680ff7ec686c0084f9dfd6d93d5ca51a33f15acba02809", "AQ13c6 — vorzeichen-balancierter Jitter (R205)"],
  ["1545893ca7b13f4e3b871e5f30c75bc45df18dff6ef1f6ccd43f76b3cb8da7d2", "AQ22 Runde 1 (Band) — flache Silhouetten-Masse ohne Binnenzeichnung, Panel 2:0 zurueckgewiesen (Wareneingang 30.08.); ersetzt durch Amendment A2"],
]);

/**
 * ── DIE RING-AUSNAHME DES NACHT-BANDES (R5 · T10, 2026-08-31) ───────────────
 *
 * Dieselbe Form wie `SPERR_BUEHNEN`: der Pin sitzt auf den BYTES, nie auf dem
 * Namen — eine Ausnahme auf »band_p4_audience« wuerde jedes spaetere, falsche
 * Blatt gleichen Namens mitdecken.
 *
 * WAS GEMESSEN WURDE. Die AQ22-A2-Lieferung ist am Wareneingang angenommen und
 * byte-eingefroren (30.08., Panel 2:0 mit gehaltenem Reihenfolgen-Tausch). Die
 * Ring-Abnahme faerbt sie trotzdem rot. Ein Kontroll-Lauf DESSELBEN Tores gegen
 * den BESTAND — das Blatt, das heute im Spiel liegt und laengst angenommen ist
 * — faerbt AUCH rot, an zwei Regeln mit schlechteren Werten:
 *
 *                                   Bestand (angenommen)   A2 (neu)
 *   unbemalte Spalten = 0                  342 ✗             246 ✗
 *   Band-Schleifen-Naht messbar         0 Pixel ✗          0 Pixel ✗
 *   Helligkeit [14,0–15,5] %              14,837 ✓          11,609 ✗
 *   Holzton H-Median [38–41]°             40,800 ✓         180,000 ✗
 *   Schluesselabstand >= 180             2 px drunter ✗    0 px drunter ✓
 *
 * Daraus folgt dreierlei, und keines davon ist ein Fehler der Lieferung:
 *
 *  1 · DIE ZWEI STRUKTUR-REGELN REDEN NICHT UEBER DIESES STEM. Der angenommene
 *      Bestand faellt an ihnen mit SCHLECHTEREN Werten durch (342 gegen 246).
 *      Ein Stuhl-Band hat Luecken zwischen den Stuehlen und durchsichtige
 *      Ringkanten; die Regeln stammen aus der AQ13c4-RING-Runde (ein
 *      DURCHGEHENDES Band) und waren fuer `band_p4_audience` nie wahr.
 *  2 · `BAND_L` IST DAS K=28-FENSTER. [14,0–15,5] ist genau das Ziel-Fenster,
 *      das `set-plane-value.mjs` aus `bandsFor(28)` ableitet (14,8 ± 0,7).
 *      T10 zieht den Raum auf K=19; dort lautet das L2-Fenster [9,5–14,25], und
 *      die Order hat [10,0–12,5] bestellt. Regel und Bestellung widersprechen
 *      sich per Konstruktion — die Regel ist die AELTERE Absicht.
 *  3 · `BAND_H` MISST EIN TAL, KEINEN TON. Verteilung mit der Stichprobe des
 *      Werkzeugs selbst ((x+y)%7), Saettigung >= 0,30: der Bestand ist UNIMODAL
 *      warm (47,3 % in 30–59°, Median ueber alle Schwellen stabil 40,0–40,9°);
 *      die A2 ist ZWEIGIPFLIG — 40,0 % in 0–29° (warmes Holz im Restlicht) und
 *      48,3 % in 180–239° (kalter Glanzrand). Der Median 180,0° liegt im TAL
 *      zwischen den Gipfeln und beschreibt keinen der beiden. Die
 *      Zweigipfligkeit ist die BESTELLTE Eigenschaft: Amendment A2 verlangt
 *      woertlich »warm-dunkles Holz im Restlicht, je Lehne ein eigener schmaler
 *      Glanzrand, lesbare Holz↔Metall-Trennung«.
 *
 * WAS DIE AUSNAHME KAUFT: die Neu-Eichung der drei Band-Lineale — Helligkeit an
 * die Schluesselzahl des Raumes koppeln statt an feste Zahlen; Holzton so
 * messen, dass ein zweitoeniges Nachtblatt bestehen kann und ein falsches
 * weiter faellt; die zwei Struktur-Regeln auf das Stem zuschneiden, fuer das sie
 * gelten. Route: Architekt. Bis dahin: datiert, benannt, nie still.
 *
 * ⚠ Die Ausnahme deckt NUR die aufgezaehlten Regeln. Jeder ANDERE Befund am
 *   Band blockiert weiter, auch an genau diesem Blatt.
 */
const RING_BAND_AUSNAHMEN = new Map([
  ["7694c48b11b4f5aea2d524e386bbc522ca4dafce7e73224cd283dfe6de8c9748", {
    until: "2026-11-30",
    herkunft: "band_p4_audience aus AQ22 Amendment A2 — Wareneingang 30.08.2026 "
      + "(Panel 2:0 mit gehaltenem Tausch, lum 11,64 im bestellten Fenster [10,0–12,5], "
      + "sat 24,17, Magenta 0, frisch gemalt r=0,08 gegen den Bestand)",
    regeln: [
      /^Band: \d+ Spalte\(n\) ohne ein einziges bemaltes Pixel/,
      /^Band-Schleife: null gemeinsame bemalte Pixel/,
      /^Band: Helligkeit /,
      /^Band: Holzton H-Median /,
    ],
  }],
]);

/**
 * Das Urteil ueber die Band-Befunde, bevor ein Byte bewegt wird. REIN, damit der
 * Selbsttest beide Richtungen sehen kann: eine Ausnahme, die nie greift, ist
 * Dekoration; eine, die alles deckt, macht das Tor nutzlos.
 */
function ringBandUrteil(hash, fails, pins = RING_BAND_AUSNAHMEN, heute = new Date()) {
  const a = pins.get(hash);
  if (a === undefined) return { gedeckt: [], offen: [...fails], ausnahme: null };
  const bis = Date.parse(`${a.until}T23:59:59Z`);
  if (Number.isNaN(bis) || heute.getTime() > bis) {
    return { gedeckt: [], offen: [...fails], ausnahme: a, abgelaufen: true };
  }
  const gedeckt = [], offen = [];
  for (const f of fails) (a.regeln.some((re) => re.test(f)) ? gedeckt : offen).push(f);
  return { gedeckt, offen, ausnahme: a };
}

/** sha256 ueber die rohen RGB-Bytes eines ganzen Blattes. */
function blattHash(png) {
  const buf = Buffer.allocUnsafe(png.width * png.height * 3);
  let k = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    buf[k++] = png.data[i]; buf[k++] = png.data[i + 1]; buf[k++] = png.data[i + 2];
  }
  return crypto.createHash("sha256").update(buf).digest("hex");
}

/** Zwei Spalten DESSELBEN Blattes, zeilenweise verglichen — gemessen nur dort,
 *  wo BEIDE tragen (bemalt sind), wie die Torformel es ueberall haelt. */
function spaltenPaar(png, xa, xb) {
  let ident = 0, sAbs = 0, n = 0;
  const dRoh = [[], [], []];   // ALLE gemeinsamen Zeilen, je Kanal (fuer die Streuung)
  const dUng = [[], [], []];   // nur die UNGLEICHEN Zeilen, je Kanal
  for (let y = 0; y < png.height; y++) {
    if (!onAt(png, xa, y) || !onAt(png, xb, y)) continue;
    const i = (y * png.width + xa) * 4, j = (y * png.width + xb) * 4;
    const dr = png.data[i] - png.data[j];
    const dg = png.data[i + 1] - png.data[j + 1];
    const db = png.data[i + 2] - png.data[j + 2];
    n++;
    sAbs += (Math.abs(dr) + Math.abs(dg) + Math.abs(db)) / 3;
    dRoh[0].push(dr); dRoh[1].push(dg); dRoh[2].push(db);
    if (dr === 0 && dg === 0 && db === 0) ident++;
    else { dUng[0].push(dr); dUng[1].push(dg); dUng[2].push(db); }
  }
  return { ident, colDiff: n === 0 ? NaN : sAbs / n, n, dRoh, dUng };
}

/** Perzentil mit linearer Interpolation — dieselbe Rechnung, mit der die
 *  Eichzahlen des Wareneingangs entstanden sind (dort steht ein P99 von
 *  1152,54; eine Rechnung ohne Zwischenwert kann keine Nachkommastelle haben). */
function perzentil(xs, q) {
  if (xs.length === 0) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  const pos = (q / 100) * (s.length - 1);
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (pos - lo);
}

/** Die Verteilung ALLER Nachbarpaare x|x+1 eines Blattes — der Massstab, gegen
 *  den die Wrap-Naht gehalten wird. Das Blatt liefert sein eigenes Lineal.
 *
 *  ★ DER RANDSCHUTZ, und warum er beim Bauen gefunden wurde (H5, 22.08.):
 *  [P1, P99] allein ist auf einem Blatt mit UEBERALL gleicher Textur nur
 *  Bruchteile breit — an der ersten Attrappe dieser Bahn spannte es
 *  [3,6765; 3,8222], und eine voellig ehrliche Wrap-Naht mit 3,8278 fiel durch,
 *  weil sie vier Tausendstel darueber lag. Das ist Rundung, kein Befund. Die
 *  Perzentile werden deshalb um ein Viertel des Interquartil-Abstands
 *  aufgeweitet — ein Mass, das das Blatt selbst stellt.
 *  GEGENPROBE: alle fuenf Eich-Urteile bleiben, wo sie waren (c3 gruen · c4
 *  ueber · c5 unter · c6 gruen an (v) · c4-Band gruen) — die Aufweitung liegt
 *  bei diesen Blaettern zwei Groessenordnungen unter dem Abstand zum Fenster.
 *  Sie nimmt dem Gesetz keinen Fall ab, sie nimmt ihm einen Fehlalarm. */
const ADJ_RAND = 0.25;
function adjazenzVerteilung(png) {
  const ident = [], colDiff = [];
  for (let x = 0; x < png.width - 1; x++) {
    const r = spaltenPaar(png, x, x + 1);
    ident.push(r.ident);
    if (!Number.isNaN(r.colDiff)) colDiff.push(r.colDiff);
  }
  const fenster = (xs) => {
    const lo = perzentil(xs, ADJ_LO), hi = perzentil(xs, ADJ_HI);
    const rand = ADJ_RAND * (perzentil(xs, 75) - perzentil(xs, 25));
    return [lo - rand, hi + rand];
  };
  const [iLo, iHi] = fenster(ident);
  const [dLo, dHi] = fenster(colDiff);
  return { identLo: iLo, identHi: iHi, diffLo: dLo, diffHi: dHi, paare: ident.length };
}

/** Das Profil einer Naht auf EINEM Blatt: p[k] = colDiff(xL − k, xR + k).
 *  Dieselbe Form wie `seamOf`, nur ohne die zwei Haelften herauszuschneiden —
 *  die neuen Gesetze brauchen globale Spaltennummern. */
function profilAn(png, xL, xR) {
  const p = [];
  for (let k = 0; k <= PROFILE_DEPTH; k++) {
    const xa = xL - k, xb = xR + k;
    if (xa < 0 || xb >= png.width) { p.push(NaN); continue; }
    p.push(spaltenPaar(png, xa, xb).colDiff);
  }
  return p;
}

/** ── DIE GESETZE AN EINER NAHT ──────────────────────────────────────────────
 *  `adj` ist die Nachbarpaar-Verteilung des Blattes; sie wird nur an den
 *  WRAP-Naehten herangezogen, denn nur dort ist »eine Spalte wie jede andere«
 *  die richtige Frage: die Naht a|b trennt zwei Platten, die Wrap-Naht
 *  schliesst dasselbe Blatt zum Zylinder. */
function nahtGesetze(png, label, xL, xR, adj) {
  const lines = [], fail = [];
  const s = spaltenPaar(png, xL, xR);
  const p = profilAn(png, xL, xR);

  if (s.n === 0) {
    fail.push(`${label}: null gemeinsame bemalte Pixel — die Naht ist nicht bestanden, sondern UNGEMESSEN`);
    return { lines, fail };
  }

  // ── (ii) FLACHHEIT ────────────────────────────────────────────────────────
  const tiefe = p.slice(1).filter((v) => !Number.isNaN(v));
  const flach = tiefe.length > 0 && tiefe.every((v) => v < FLACH_MAX);
  lines.push(`    ${label} (ii) Profil p[1…${PROFILE_DEPTH}] ${tiefe.map((v) => v.toFixed(3)).join(" ")}`);
  if (flach) fail.push(`${label}: das ganze Profil bis Tiefe ${PROFILE_DEPTH} liegt unter ${FLACH_MAX} — die Naht bewegt sich nicht, wenn man von ihr weggeht; das ist eine Kopie, keine Fuge`);

  // ── (iii) SPALTENPROBE ────────────────────────────────────────────────────
  const kanalAbs = [0, 1, 2].map((c) => {
    const a = s.dRoh[c];
    return a.reduce((acc, v) => acc + Math.abs(v), 0) / a.length;
  });
  const traegt = kanalAbs.filter((v) => v > 0).length;
  lines.push(`    ${label} (iii) Spaltenprobe R/G/B ${kanalAbs.map((v) => v.toFixed(4)).join(" / ")} — ${traegt}/3 Kanaele > 0`);
  if (traegt < 3) fail.push(`${label}: nur ${traegt} von 3 Kanaelen unterscheiden die beiden Nahtspalten ueberhaupt — auf ${3 - traegt} Kanal/Kanaelen ist die eine Spalte die andere`);

  // ── (iv) STREUUNG ─────────────────────────────────────────────────────────
  const streu = [0, 1, 2].map((c) => {
    const a = s.dRoh[c];
    const m = a.reduce((x, y) => x + y, 0) / a.length;
    return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length);
  });
  lines.push(`    ${label} (iv) Streuung k=0 R/G/B ${streu.map((v) => v.toFixed(4)).join(" / ")} (Boden ${STREU_MIN})`);
  for (let c = 0; c < 3; c++) {
    if (!(streu[c] > STREU_MIN)) {
      fail.push(`${label}: Kanal ${"RGB"[c]} hat an k=0 die Streuung ${streu[c].toFixed(4)} (Boden ${STREU_MIN}) — die Zeilendifferenz ist ueberall dieselbe; ein Verhaeltnis-Tor sieht das nicht, weil dort BEIDE Seiten gleich flach sind`);
    }
  }

  lines.push(`    ${label} bytegleiche Zeilen ${s.ident} von ${s.n} gemeinsamen · colDiff ${s.colDiff.toFixed(4)} · ungleich ${s.dUng[0].length}`);
  if (adj === null) return { lines, fail };

  // ── (v) ADJAZENZ-KONSISTENZ ───────────────────────────────────────────────
  lines.push(`    ${label} (v) Fenster der ${adj.paare} eigenen Nachbarpaare: ident [${adj.identLo.toFixed(1)}, ${adj.identHi.toFixed(1)}] · colDiff [${adj.diffLo.toFixed(4)}, ${adj.diffHi.toFixed(4)}]`);
  if (s.ident < adj.identLo || s.ident > adj.identHi) {
    fail.push(`${label}: ${s.ident} bytegleiche Zeilen liegen ${s.ident > adj.identHi ? "UEBER" : "UNTER"} dem Fenster [${adj.identLo.toFixed(1)}, ${adj.identHi.toFixed(1)}], das dieses Blatt an seinen eigenen ${adj.paare} Nachbarpaaren aufspannt — zu aehnlich ist eine Kopie, zu unaehnlich eine Lasur`);
  }
  if (!Number.isNaN(s.colDiff) && (s.colDiff < adj.diffLo || s.colDiff > adj.diffHi)) {
    fail.push(`${label}: colDiff ${s.colDiff.toFixed(4)} liegt ausserhalb des eigenen Fensters [${adj.diffLo.toFixed(4)}, ${adj.diffHi.toFixed(4)}]`);
  }

  const ungleich = s.dUng[0].length;

  // ── (vi) VORZEICHEN-GESETZ ────────────────────────────────────────────────
  if (ungleich >= VZ_ZEILEN) {
    for (let c = 0; c < 3; c++) {
      let neg = 0, pos = 0;
      for (const v of s.dUng[c]) { if (v < 0) neg++; else if (v > 0) pos++; }
      const summe = neg + pos;
      const anteil = summe === 0 ? 0 : Math.min(neg, pos) / summe;
      lines.push(`    ${label} (vi) Kanal ${"RGB"[c]}: ${neg} neg / ${pos} pos = ${(anteil * 100).toFixed(1)} % (Boden ${VZ_ANTEIL * 100} %)`);
      if (!(anteil >= VZ_ANTEIL)) {
        fail.push(`${label}: Kanal ${"RGB"[c]} hat ${neg} negative gegen ${pos} positive Zeilen (${(anteil * 100).toFixed(1)} %, Boden ${VZ_ANTEIL * 100} %) — eine einseitige Naht ist ein Aufheller, keine Malerei`);
      }
    }
  } else {
    lines.push(`    ${label} (vi) ausgesetzt — nur ${ungleich} ungleiche Zeilen (ab ${VZ_ZEILEN}); (v) entscheidet allein`);
  }

  // ── (vii) KLEINE DIFFERENZEN · (viii) KANAL-VARIATION ─────────────────────
  if (ungleich === 0) {
    lines.push(`    ${label} (vii)/(viii) ausgesetzt — keine ungleiche Zeile vorhanden`);
    return { lines, fail };
  }
  let klein = 0, uniform = 0;
  for (let k = 0; k < ungleich; k++) {
    const dr = s.dUng[0][k], dg = s.dUng[1][k], db = s.dUng[2][k];
    if (Math.abs(dr) <= KLEIN_D && Math.abs(dg) <= KLEIN_D && Math.abs(db) <= KLEIN_D) klein++;
    if (dr === dg && dg === db) uniform++;
  }
  const kleinQ = klein / ungleich, uniQ = uniform / ungleich;
  lines.push(`    ${label} (vii) |d| <= ${KLEIN_D} auf allen Kanaelen: ${(kleinQ * 100).toFixed(1)} % (Boden ${KLEIN_ANTEIL * 100} %) · (viii) kanal-uniform ${(uniQ * 100).toFixed(1)} % (Decke ${UNIFORM_ANTEIL * 100} %)`);
  if (!(kleinQ >= KLEIN_ANTEIL)) {
    fail.push(`${label}: nur ${(kleinQ * 100).toFixed(1)} % der ungleichen Zeilen tragen eine kleine Differenz (|d| <= ${KLEIN_D}, Boden ${KLEIN_ANTEIL * 100} %) — gemalte Nachbarschaft hat kleine Werte, ein quantisierter Versatz hat nur grosse`);
  }
  if (!(uniQ <= UNIFORM_ANTEIL)) {
    fail.push(`${label}: ${(uniQ * 100).toFixed(1)} % der ungleichen Zeilen sind kanal-uniform (dr = dg = db, Decke ${UNIFORM_ANTEIL * 100} %) — ein Pinsel trifft die drei Kanaele nicht gleich, ein Rechenschritt schon`);
  }
  return { lines, fail };
}

/** ── DIE MASSENFARB-AUSNAHME DER KREIDE-OVERLAYS (R5-W7 · H5, P-80) ────────
 *  Regel 5 sagt: kein einzelner RGB-Wert stellt mehr als 1 % der gemalten
 *  Pixel. Sie ist fuer VOLLFLAECHIGE Koerper-Blaetter geschrieben, und dort
 *  ist sie richtig — ein Schutzfilter, der Farben ersetzt statt sie zu
 *  schieben, hinterlaesst genau eine Massenfarbe.
 *
 *  Ein STRICH-OVERLAY ist das Gegenteil: es besteht fast nur aus Kreide auf
 *  Durchsicht. Die vier BESTANDS-Kritzelvorlagen messen selbst 64–75 %, und
 *  die byte-identisch nachbestellten Overlays lagen bei 20,19/20,22 % — beide
 *  Male ein rotes Licht ohne Defekt. Die Regel gilt also nach Blatt-ART, und
 *  eine Art laesst sich nicht am Dateinamen ablesen.
 *
 *  ★ WARUM DER PIN AUF DEM SHA SITZT UND NICHT AUF DEM NAMEN: eine Ausnahme
 *  per Name waere eine offene Tuer — ein NEUES, falsches Blatt gleichen Namens
 *  ginge stillschweigend durch. Der Pin nennt die BYTES der Zelle, die geprueft
 *  und behalten wurde. Aendert sich ein einziges Pixel, faellt die Ausnahme weg
 *  und die Zelle wird wieder gemessen. Ausgenommen ist ausserdem NUR Regel 5:
 *  Zwilling, Sitz, Gesicht, Schiefer und Schluessel-Reserve gelten weiter.
 *
 *  ── H6 (23.08.): DIE LISTE IST GEFUELLT, und zwar mit gemessenen Zahlen ────
 *  H5 baute die Mechanik und liess die Liste LEER, weil ihre Zahlen an der
 *  verlorenen Lieferung AQ13b3 hingen (R204). H6 fuellt sie — aber NICHT aus
 *  AQ13B4: die Kreide-Overlays sind in B4 gar nicht enthalten. Sie sind der
 *  bytegleiche Durchreich aus `batch-aq13/` (R212-Bestand), Datei-sha256
 *  `105a9462…` / `6f7f55ff…`, im B4-Wareneingang ausdruecklich bestaetigt.
 *  Die acht Zell-SHAs unten sind an genau diesen zwei Blaettern gemessen
 *  (`--overlay-pins`, siehe unten) und nicht abgeschrieben.
 *
 *  ★ WARUM ALLE ACHT ZELLEN UND NICHT NUR DIE FUENF IMPORTIERTEN. Die
 *  Massenfarb-Zaehlung laeuft ueber das GANZE Blatt, nicht ueber die Auswahl,
 *  die der Importeur daraus nimmt. Die drei zurueckgehaltenen Wisch-Zellen
 *  (`tafel_wipe` 0–2) liegen aus einem DESIGN-Grund still — sie zeigen die
 *  volle Schicht mit einem wachsenden Loch und stimmen nur bei hp = 3 (siehe
 *  `SHEETS`) —, nicht aus einem Qualitaetsgrund. Gemessen ist jede der acht
 *  Zellen ein Strich-Overlay: die Kreidefarbe (252,240,213) stellt 47,89 bis
 *  75,34 % der gemalten Pixel je Zelle. Eine Zelle auszunehmen, die dieselbe
 *  Art hat, waere eine Ausnahme nach Auswahl statt nach Art.
 *
 *  ⚠ EHRLICHE GRENZE, DIE DIESE PINS NICHT AUFHEBEN (H6, gemessen): die zwei
 *  Overlay-Blaetter fallen an DIESEM Tor auch mit gesetzten Pins noch durch —
 *  an Regel 6, der Schluessel-Reserve: ihr knappstes gemaltes Pixel liegt
 *  150,08 bzw. 150,28 vom Schluessel, die Regel verlangt 180. Das ist kein
 *  Versehen dieser Bahn: die Ausnahme deckt laut Kopf NUR Regel 5, und die
 *  Reserve laeuft bewusst ueber ALLE Pixel. Die Blaetter sind trotzdem im
 *  Spiel — sie sind der angenommene Durchreich aus AQ13b und laufen nie durch
 *  `--abnahme-tafel`, dessen Bestellung die drei Koerper-Blaetter sind. Die
 *  Zahl steht hier, damit niemand sie fuer geprueft haelt: **Befund an den
 *  Architekten** (H6-Report), kein Eigenfix — eine Grenze zu senken, damit
 *  Bestand sie besteht, ist die Klasse, gegen die dieses ganze Tor gebaut ist.
 *
 *  ── T3 (24.08.): DIE LISTE IST WIEDER LEER — und zwar GEMESSEN ────────────
 *  Der H6-Absatz darueber bleibt als Geschichte stehen; er beschreibt die
 *  Blaetter von `batch-aq13/`. Mit AQ13L stammten die Kreide-Stems aus einem
 *  anderen Blattpaar, das Regel 5 und Regel 6 AUS EIGENER KRAFT bestand
 *  (0,8423 % / 0,3324 % gegen 1 % · Reserve 202,203 / 192,057 gegen 180).
 *
 *  ── T4 (24.08.): DIE LISTE BLEIBT LEER — obwohl AQ13M Regel 5 NICHT MEHR AUS
 *     EIGENER KRAFT BESTEHT. Und das ist ein Entscheid, kein Versehen (D-695).
 *
 *  An der importierten Lieferung gemessen, je Blatt gerechnet wie Regel 5 es
 *  tut (haeufigster RGB ueber alle gemalten Pixel des Blattes):
 *
 *      tafel_scribble  21096 px gemalt  (252,252,252)  2,1710 %   Grenze 1,0000 %
 *      tafel_wipe      18461 px gemalt  (252,252,252)  2,0855 %   Grenze 1,0000 %
 *      Schluessel-Reserve 204,685 / 200,534 gegen 180 — Regel 6 haelt weiter.
 *
 *  Die Zahl ist gestiegen, weil AQ13M genau das ist, was bestellt war: WENIGE,
 *  GROSSE Zeichen mit breitem Strich statt vieler feiner Schnoerkel. Ein
 *  breiter Strich in einer Kreidefarbe stellt einen groesseren Anteil derselben
 *  Farbe — nach dem Buchstaben von Regel 5 ein Farbfeld, nach der Sache gemalte
 *  Kreide. Es ist dieselbe Klasse, die der H6-Absatz oben beschreibt, nur eine
 *  Lieferung spaeter.
 *
 *  ★ WARUM TROTZDEM KEIN PIN GESETZT WIRD. Ein Pin ist eine Ausnahme von einem
 *    TOR. Dieses Tor (`--abnahme-tafel`) laeuft auf diesem Blattpaar
 *    strukturell nicht: es verlangt die drei Koerper-Blaetter und bricht ohne
 *    sie mit Exit 2 ab — `batch-aq13m/` enthaelt keine. Ein Pin waere also eine
 *    Ausnahme fuer eine Pruefung, die hier gar nicht stattfindet: eine offene
 *    Tuer ohne Bedarf, und damit genau das, was T2 in D-681 begruendet und T3
 *    in D-682 vollzogen hat. **Die Zahl steht deshalb hier, damit niemand sie
 *    fuer geprueft haelt — Befund an den Architekten (D-695), kein Eigenfix.**
 *    Wer die Overlays je in einer Lieferung MIT Koerper-Blaettern abnimmt,
 *    findet dort ein rotes Licht ohne Defekt und braucht dann diesen Absatz.
 *
 *  Form je Eintrag:  ["<sha256 ueber die rohen RGB-Bytes der ZELLE>", "Herkunft"]
 */
const OVERLAY_MASSE_FREI = new Map([
  // ── T3 (24.08.): DIE LISTE IST LEER, UND DAS IST DAS ERGEBNIS EINER MESSUNG.
  //
  // Bis T3 standen hier acht Pins auf die Zellen von `batch-aq13/`. Sie waren
  // noetig, weil auf jenen Blaettern EINE Farbe 47,89–75,34 % der gemalten
  // Pixel stellte — ein Farbfeld nach dem Buchstaben von Regel 5, gemalte
  // Kreide nach der Sache. Sie sind mit AQ13L gefallen (D-682) und kehren mit
  // AQ13M NICHT zurueck: die Begruendung steht vollstaendig im Kopf darueber
  // (T4-Absatz, D-695) — das Tor, von dem ein Pin befreien wuerde, laeuft auf
  // diesem Blattpaar strukturell nicht.
  //
  // Regel 6 haelt an AQ13M weiter aus eigener Kraft: Schluessel-Reserve
  // 204,685 / 200,534 gegen eine Grenze von 180. Die vier alten Kreide-Stems
  // lagen bei 150,08–175,86 (T1, D-657) — seit T3 ist dieser Befund
  // gegenstandslos.
  //
  // Die acht alten SHAs sind nicht verloren: sie stehen im Register (D-682).
]);

/** Die Zellordnung der drei Koerper-Blaetter — Raster 4×2 à 512², wie bestellt. */
const RECOLOUR_CELLS = {
  tafel_recolour_a: ["a", "b", "c", "d", "bank_l1", "bank_r0", "bank_r1", "roll"],
  tafel_recolour_b: ["land0", "land1", "rest", "win", "windup", "windup0", "windup1", "throw"],
  tafel_recolour_c: ["spiral0", "spiral1", "spiral2", "spiral3"],
};

/** ── DIE ZWEI BLATT-ARTEN, UND WARUM SIE VERSCHIEDEN GESCHNITTEN WERDEN ─────
 *
 *  `SHEETS` oben traegt die OVERLAYS: Strichbilder, die auf die Schreibflaeche
 *  gelegt werden. Ihr Schnittfenster ist die SCHIEFERTAFEL des Bezugs-Sprites
 *  (`slateMaskOf`) — ein Overlay, das ueber den Rahmen liefe, waere Kreide auf
 *  Holz.
 *
 *  Die drei B4-Blaetter sind das Gegenteil: VOLLE KOERPER, je 4×2 Zellen à 512².
 *  Sie ERSETZEN zwanzig bestehende Stems, und ein Ersatz hat die Masse seines
 *  Vorgaengers (dieselbe Regel wie im Band-Zweig). Ihr Fenster ist deshalb der
 *  BESTANDSKOERPER, zentriert in die Zelle gesetzt — genau die Geometrie, die
 *  die Abnahme in Regel 2 prueft (»die Zelle sitzt, wo der Bestand sitzt«) und
 *  die der B4-Wareneingang mit dx/dy = 0/0 in 20/20 gemessen hat.
 *
 *  ★ JE ZELLE EIN EIGENES BEZUGS-SPRITE. Beim Overlay reicht EIN Bezug fuers
 *  ganze Blatt (die Schreibflaeche sitzt bei allen Posen gleich). Beim Koerper
 *  nicht: `tafel_throw` und `tafel_windup` sind verschieden gross. Ein Fenster
 *  je Blatt waere hier der Fehler, den Regel 2 an der Lieferung sucht — nur
 *  eine Ebene weiter oben.
 */
const KOERPER_COLS = 4, KOERPER_ZELLE = 512;
const KOERPER_SHEETS = Object.entries(RECOLOUR_CELLS).map(([blatt, namen]) => ({
  art: "koerper",
  file: `batch-aq13b4/${blatt}.png`,
  cols: KOERPER_COLS,
  // ★ DIE ZEILENZAHL WIRD GEZAEHLT, NICHT GETIPPT. Erster Anlauf dieser Bahn
  //   schrieb `rows: 2` fuer alle drei Blaetter — `tafel_recolour_c` traegt aber
  //   nur VIER Zellen (die vier Kreisel) und ist 4×1. Das Blatt teilt sich
  //   trotzdem sauber in 4×2, die Zellen waeren nur 512×256 gewesen: ein
  //   stiller halber Schnitt, den erst der Bestandsmass-Vergleich rot gemeldet
  //   hat. Das ist dieselbe Klasse wie C7s Achsenzahl (R206b) — eine Zahl, die
  //   man aus der Sache herleiten kann, wird hergeleitet.
  rows: Math.ceil(namen.length / KOERPER_COLS),
  // [Zellindex, Stem] — dieselbe Form wie bei den Overlays, aus der
  // Zellordnung GERECHNET statt ein zweites Mal getippt (zwei Listen
  // derselben Wahrheit sind die Klasse, an der C7 drei Anlaeufe verlor).
  pieces: namen.map((n, i) => [i, `tafel_${n}`]),
}));

/** Schnittmenge durch Vereinigung der beiden Silhouetten — die Zahl, die der
 *  Wareneingang je Zelle mit 0,9999 meldet. Sie steht hier, damit der Import
 *  sie SELBST misst statt sie aus einem Lieferschein zu uebernehmen: beide
 *  Blaetter sind gleich gross (der Ersatz haelt die Masse seines Vorgaengers),
 *  also ist es ein Vergleich Pixel gegen Pixel. */
function iouOf(a, b) {
  if (a.width !== b.width || a.height !== b.height) return NaN;
  let schnitt = 0, vereinigung = 0;
  for (let i = 3; i < a.data.length; i += 4) {
    const A = a.data[i] > 8, B = b.data[i] > 8;
    if (A && B) schnitt++;
    if (A || B) vereinigung++;
  }
  return vereinigung === 0 ? NaN : schnitt / vereinigung;
}

/** ── DIE TAFEL-ABNAHME ──────────────────────────────────────────────────────
 *  `bestandOf(name)` liefert das Bestands-Sprite; in der Selbstpruefung ist es
 *  eine gebaute Attrappe, im Ernstfall die Datei aus `apps/web/public/art`. */
function abnahmeTafel(entries, bestandOf, pins = OVERLAY_MASSE_FREI) {
  const lines = [], fail = [];

  for (const e of entries) {
    const sheetName = e.name, png = e.png;
    const names = e.names ?? RECOLOUR_CELLS[sheetName] ?? null;
    const cw = e.cw ?? 512, ch = e.ch ?? 512, cols = e.cols ?? Math.round(png.width / cw);
    const rows = Math.max(1, Math.round(png.height / ch));
    const zellIndex = (x, y) => Math.floor(y / ch) * cols + Math.floor(x / cw);

    // 1 · KEIN ZWILLING
    const seen = new Map();
    const nCells = names ? names.length : Math.round(png.width / cw) * Math.round(png.height / ch);
    for (let i = 0; i < nCells; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      const h = cellHash(png, c * cw, r * ch, cw, ch);
      const label = names ? names[i] : `Zelle ${i + 1}`;
      if (seen.has(h)) fail.push(`${sheetName}: ${label} ist byteweise dieselbe Zelle wie ${seen.get(h)} (SHA-256 ${h.slice(0, 16)}) — zwei Zustaende, ein Bild`);
      else seen.set(h, label);
    }

    // 5 · KEINE MASSENFARBE — je ZELLE gepruefte Ausnahme, sonst je Blatt.
    //     Die Ausnahme sitzt auf den Bytes der Zelle (siehe OVERLAY_MASSE_FREI):
    //     gepinnte Zellen zaehlen fuer die Massenfarbe nicht mit, fuer alles
    //     andere schon — die Schluessel-Reserve unten laeuft ueber ALLE Pixel.
    const befreit = new Set();
    for (let i = 0; i < cols * rows; i++) {
      const rr = Math.floor(i / cols), cc = i % cols;
      if ((cc + 1) * cw > png.width || (rr + 1) * ch > png.height) continue;
      const h = cellHash(png, cc * cw, rr * ch, cw, ch);
      const grund = pins.get(h);
      if (grund === undefined) continue;
      befreit.add(i);
      lines.push(`  ${sheetName}: Zelle ${i} von der Massenfarb-Regel befreit — gepinnt als ${grund} (SHA ${h.slice(0, 16)})`);
    }

    const tally = new Map();
    let painted = 0, gemessen = 0, minKey = Infinity;
    const keyHist = new Map();
    for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) {
      if (!onAt(png, x, y)) continue;
      const i = (y * png.width + x) * 4;
      const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
      painted++;
      if (!befreit.has(zellIndex(x, y))) {
        const k = (r << 16) | (g << 8) | b;
        tally.set(k, (tally.get(k) ?? 0) + 1);
        gemessen++;
      }
      const d = Math.hypot(r - 255, g, b - 255);
      if (d < minKey) minKey = d;
      const bucket = Math.round(d);
      keyHist.set(bucket, (keyHist.get(bucket) ?? 0) + 1);
    }
    let topK = 0, topN = 0;
    for (const [k, n] of tally) if (n > topN) { topN = n; topK = k; }
    const share = gemessen === 0 ? 0 : topN / gemessen;
    lines.push(`  ${sheetName}: ${painted} px gemalt (${gemessen} auf die Massenfarbe gemessen) · haeufigster RGB (${topK >> 16},${(topK >> 8) & 255},${topK & 255}) ${(share * 100).toFixed(4)} %`);
    if (share > MASS_MAX) fail.push(`${sheetName}: ein einzelner RGB-Wert stellt ${(share * 100).toFixed(2)} % der gemalten Pixel (Grenze ${MASS_MAX * 100} %) — das ist ein Farbfeld, keine Malerei`);

    // 6 · ECHTE RESERVE
    lines.push(`  ${sheetName}: kleinster Schluesselabstand ${minKey.toFixed(3)}`);
    if (minKey < KEY_MIN) fail.push(`${sheetName}: ein gemaltes Pixel liegt ${minKey.toFixed(2)} vom Schluessel (Grenze ${KEY_MIN})`);
    let clampAt = null, clampN = 0;
    for (const [d, n] of keyHist) if (n > clampN) { clampN = n; clampAt = d; }
    // Eine Klemmkante ist ein Haufen AM MINIMUM: ein Schutzfilter, der jedes
    // verletzende Pixel auf denselben Wert schiebt. Der haeufigste Abstand
    // irgendwo im Bild ist dagegen nur die groesste Farbflaeche — kein Befund.
    if (painted > 0 && clampN / painted > 0.01 && clampAt - minKey <= 2) {
      lines.push(`  ${sheetName}: ★ Klemmkante — ${clampN} px (${(100 * clampN / painted).toFixed(2)} %) liegen auf Abstand ${clampAt}; ein Schutzfilter hat dort geschoben, nicht gemalt`);
    }

    if (!names) continue;

    // 2/3/4 · je Zelle
    for (let i = 0; i < names.length; i++) {
      const nm = names[i];
      const r = Math.floor(i / cols), c = i % cols;
      const bx = c * cw, by = r * ch;
      const ref = bestandOf(nm);
      if (ref === null) { fail.push(`${nm}: kein Bestandskoerper zum Vergleich`); continue; }

      // 2 · DIE ZELLE SITZT, WO DER BESTAND SITZT
      const box = paintedBox(png, bx, by, cw, ch);
      if (box === null) { fail.push(`${nm}: leere Zelle`); continue; }
      const offX = Math.floor((cw - ref.width) / 2), offY = Math.floor((ch - ref.height) / 2);
      const dx = box.x0 - offX, dy = box.y0 - offY;
      const gotW = box.x1 - box.x0 + 1, gotH = box.y1 - box.y0 + 1;
      if (gotW !== ref.width || gotH !== ref.height) {
        fail.push(`${nm}: Silhouette ${gotW}×${gotH} statt der Bestandsmasse ${ref.width}×${ref.height}`);
      } else if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        fail.push(`${nm}: der Koerper sitzt um (${dx >= 0 ? "+" : ""}${dx},${dy >= 0 ? "+" : ""}${dy}) px verschoben in der Zelle — der Importeur schneidet ZENTRIERT, die Kritzelei laege um ${Math.abs(dy)} px daneben`);
      }

      // 3 · DAS GESICHT GEGEN DEN BESTAND
      let N = 0;
      for (let y = 0; y < ref.height; y++) for (let x = 0; x < ref.width; x++) {
        const i2 = (y * ref.width + x) * 4;
        if (ref.data[i2 + 3] <= 8) continue;
        if (lum(ref.data[i2], ref.data[i2 + 1], ref.data[i2 + 2]) > REF_L) N++;
      }
      let G = 0;
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        if (!onAt(png, bx + x, by + y)) continue;
        const i2 = ((by + y) * png.width + (bx + x)) * 4;
        const rr = png.data[i2], gg = png.data[i2 + 1], bb = png.data[i2 + 2];
        if (lum(rr, gg, bb) > FACE_L && satS(rr, gg, bb) < FACE_S) G++;
      }
      const q = N === 0 ? 0 : G / N;
      lines.push(`    ${nm.padEnd(10)} Gesicht ${String(G).padStart(5)} / Bestand N ${String(N).padStart(5)} = ${q.toFixed(4)}`);
      if (G < FACE_MIN || q < FACE_QUOTA) {
        fail.push(`${nm}: Gesichtsquote ${q.toFixed(4)} (${G} von ${N}) unter ${FACE_QUOTA} — das Kreidegesicht ist nicht weiss genug oder zu klein`);
      }

      // 4 · SCHIEFER SCHWARZ UND GEMALT — Fenster aus dem Bestand, durch den
      //     TATSAECHLICHEN Sitz der Zelle geschoben, damit die Farbe auch dann
      //     gemessen wird, wenn Regel 2 schon rot ist.
      // Die Schieferflaeche ist NICHT der Kasten der Maske: in seinen Ecken
      // liegt Rahmen, und Rahmen ist hell. Gemessen wird deshalb in der MASKE
      // des Bestandes, um den tatsaechlichen Sitz der Zelle verschoben — sonst
      // misst die Abnahme den Rahmen mit und meldet einen zu hellen Schiefer,
      // den es nicht gibt.
      const sl = slateMaskOf(ref);
      // ★ EIN LINEAL, DAS NICHTS FINDET, BESCHULDIGT SONST DIE LIEFERUNG.
      //   Ohne diese Zeile meldete das Tor `Schiefer L NaN ueber 10` — also
      //   einen Befund GEGEN das gelieferte Blatt, obwohl der Fehler beim
      //   Bezugs-Sprite liegt. Genau so las sich der 23.08. eine Stunde lang:
      //   der Farbwechsel gruen → nachtblau hatte die alte Maske blind gemacht,
      //   und 40 Befunde zeigten auf eine Lieferung, die in Ordnung war.
      //   (Dieselbe Klasse wie D-625: die Ausgabe behauptet etwas anderes als
      //   die Messung.) Der Befund gehoert dem BEZUG, und er sagt das.
      if (sl.box.x1 < sl.box.x0 || sl.box.y1 < sl.box.y0) {
        fail.push(`${nm}: im BESTANDS-Sprite ist keine Schreibflaeche messbar (das Lineal findet bei Leitfarbton ${sl.peak < 0 ? "—" : sl.peak + "°"} ${sl.n ?? 0} px) — nicht die Lieferung ist hier auffaellig, sondern das Lineal: pruefe \`slateMaskOf\` gegen die Farbe des heutigen Bestandes`);
        continue;
      }
      const sx = bx + offX + dx, sy = by + offY + dy;
      const inSlate = (x, y) => {
        const lx = x - sx, ly = y - sy;
        if (lx < 0 || ly < 0 || lx >= sl.W || ly >= sl.H) return false;
        return sl.m[ly * sl.W + lx] === 1;
      };
      const win = {
        x0: sx + sl.box.x0, y0: sy + sl.box.y0,
        x1: sx + sl.box.x1, y1: sy + sl.box.y1,
      };
      // ★ R5-W7 · H5 · DIE VOLLE MASKE (P-80).
      // Bis hierher sprang diese Schleife jedes Pixel ueber, das heller als die
      // Kreide-Schwelle war — mit der Begruendung »die Kreide ist nicht der
      // Schiefer«. Fuer die MASERUNG stimmt das (ein Paar aus weissem Strich
      // und dunkler Flaeche traegt einen Schritt von ~240, siehe `slateOnly`
      // unten). Fuer die HELLIGKEIT ist es der Ausschluss genau der Pixel, die
      // eine zu helle Tafel zu hell machen: die AQ13b2-Lieferung war weisses
      // Einzelpunkt-Rauschen auf Schwarz und meldete gefiltert 8,60–9,12 —
      // ueber die volle Maske gerechnet sind es 47–49. Sie kam durch dieses
      // eine `continue` durch. Der Mittelwert laeuft deshalb jetzt ueber ALLES,
      // was in der Maske liegt; die Schwelle bleibt 10, weil eine gesunde
      // Lieferung sie auch so besteht (AQ13b3, voll gemessen: 9,45–9,71).
      let ls = 0, ln = 0, lsAlt = 0, lnAlt = 0;
      for (let y = win.y0; y <= win.y1; y++) for (let x = win.x0; x <= win.x1; x++) {
        if (x < 0 || y < 0 || x >= png.width || y >= png.height) continue;
        if (!inSlate(x, y) || !onAt(png, x, y)) continue;
        const i2 = (y * png.width + x) * 4;
        const L = lum(png.data[i2], png.data[i2 + 1], png.data[i2 + 2]);
        ls += L; ln++;
        if (L <= FACE_L) { lsAlt += L; lnAlt++; }   // die alte, gefilterte Rechnung
      }
      const meanL = ln === 0 ? NaN : ls / ln;
      // Die gefilterte Zahl wird MITGEDRUCKT, nicht mehr geurteilt: sie ist die
      // Zahl, mit der AQ13b2 durchgekommen ist, und sie neben der vollen zu
      // sehen ist der kuerzeste Weg, den Unterschied zu verstehen.
      const meanLAlt = lnAlt === 0 ? NaN : lsAlt / lnAlt;
      // Die Maserung ist die des SCHIEFERS, nicht die der Kreide: ein Paar aus
      // weissem Strich und dunkler Flaeche traegt einen Schritt von ~240 und
      // wuerde jede noch so flache Tafel als gemalt durchgehen lassen.
      const slateOnly = (x, y) => {
        if (!inSlate(x, y)) return false;
        const i2 = (y * png.width + x) * 4;
        return lum(png.data[i2], png.data[i2 + 1], png.data[i2 + 2]) <= FACE_L;
      };
      const tex = textureOf(png, win, slateOnly);
      const rough = roughnessOf(png, win, slateOnly);
      lines.push(`    ${nm.padEnd(10)} Schiefer L ${meanL.toFixed(2)} (gefiltert waeren es ${Number.isNaN(meanLAlt) ? "—" : meanLAlt.toFixed(2)}) · Maserung ${tex.toFixed(3)} · Rauhheit ${Number.isNaN(rough) ? "—" : rough.toFixed(3)}`);
      if (!(meanL <= SLATE_L_MAX)) {
        // Die gefilterte Zahl steht im Befund selbst: sie ist der Beweis, dass
        // hier die UMSTELLUNG greift und nicht ein ohnehin zu helles Blatt.
        fail.push(`${nm}: Schiefer L ${meanL.toFixed(2)} ueber ${SLATE_L_MAX} — zu hell gegen die Tuer (volle Maske; gefiltert waeren es ${Number.isNaN(meanLAlt) ? "—" : meanLAlt.toFixed(2)}, und mit dieser Zahl kam AQ13b2 durch)`);
      }
      if (!(tex >= MIN_TEXTURE)) fail.push(`${nm}: Schiefer-Maserung ${tex.toFixed(3)} unter ${MIN_TEXTURE} — ein Farbfeld, kein gemalter Schiefer`);
      if (!Number.isNaN(rough) && rough > MAX_ROUGHNESS) fail.push(`${nm}: Schiefer-Rauhheit ${rough.toFixed(3)} ueber ${MAX_ROUGHNESS} — die Flaeche ist Einzelpunkt-Rauschen, keine Maserung (Bestand 0,109–0,127)`);
    }
  }
  return { lines, fail };
}

/** ── DIE RING-ABNAHME ───────────────────────────────────────────────────────
 *  `stage` ist 2048×1260 (zwei Platten a|b), `band` 2048×384, gekeyt.
 *
 *  Drei Naehte werden gemessen, und alle drei bekommen die Gesetze (ii)–(iv):
 *    · Buehne a|b   — die Fuge zwischen den zwei Platten (Spalte 1023|1024)
 *    · Buehne b|a   — der Zylinder-Schluss des Buehnenblattes (2047|0)
 *    · Band-Schleife — der Zylinder-Schluss des Bandes (2047|0)
 *  Die Gesetze (v)–(viii) laufen nur an den ZYLINDER-Schluessen: nur dort ist
 *  »eine Spalte wie jede andere des eigenen Blattes« die richtige Frage. a|b
 *  trennt zwei Platten; dass sie sich dort unaehnlicher sind als anderswo, ist
 *  kein Befund, sondern die Bauart.
 */
function abnahmeRing(stage, band) {
  const lines = [], fail = [];

  // 0 · SCHON EINMAL ZURUECKGEWIESEN? Ein Blatt, das unter neuem Ordnernamen
  //     wiederkommt, ist keine neue Lieferung (Rahmen-Regel 17). Der Namens-Weg
  //     traegt das nicht — die Bytes tun es.
  for (const [nm, p] of [["Buehne", stage], ["Band", band]]) {
    const h = blattHash(p);
    const grund = SPERR_BUEHNEN.get(h);
    lines.push(`  ${nm}: sha256 (RGB-Rohbytes) ${h.slice(0, 16)}…${grund === undefined ? "" : "  ★ SPERR-SHA"}`);
    if (grund !== undefined) fail.push(`${nm}: dieses Blatt ist schon zurueckgewiesen — ${grund}`);
  }

  // 1/2 · NAHT a|b und WRAP b|a — Fuge und Sprung wie bisher (die Zahlen der
  //       Behalten-Liste; sie bleiben vergleichbar), danach die Gesetze.
  const half = Math.round(stage.width / 2);
  const A = crop(stage, 0, 0, half, stage.height);
  const B = crop(stage, half, 0, half, stage.height);
  const schritt = stepOf(stage);
  const grenze = SEAM_OVER_TEXTURE * schritt;
  lines.push(`  Buehne: Nachbarschritt ${schritt.toFixed(3)} → Grenze ${grenze.toFixed(3)}`);
  if (schritt < MIN_TEXTURE) fail.push(`Buehne: Nachbarschritt ${schritt.toFixed(3)} unter ${MIN_TEXTURE} — ein Farbfeld, kein Bild`);
  for (const [label, X, Y] of [["a|b", A, B], ["b|a", B, A]]) {
    const s = seamOf(X, Y);
    lines.push(`  Buehne ${label}: Fuge ${Number.isNaN(s.fuge) ? "—" : s.fuge.toFixed(3)} · Sprung ${Number.isNaN(s.sprung) ? "—" : s.sprung.toFixed(3)} · gemeinsame bemalte Pixel ${s.shared}`);
    if (s.shared === 0) { fail.push(`Buehne ${label}: null gemeinsame bemalte Pixel — die Naht ist nicht bestanden, sondern UNGEMESSEN`); continue; }
    if (!(s.fuge <= grenze)) fail.push(`Buehne ${label}: Fuge ${s.fuge.toFixed(3)} ueber der Grenze ${grenze.toFixed(3)} — die Naht schliesst nicht durch Malerei`);
    if (!(s.sprung <= grenze)) fail.push(`Buehne ${label}: Sprung ${s.sprung.toFixed(3)} ueber der Grenze ${grenze.toFixed(3)}`);
  }

  // ── DIE ACHT GESETZE AN DER BUEHNE ────────────────────────────────────────
  const adjB = adjazenzVerteilung(stage);
  for (const g of [
    nahtGesetze(stage, "Buehne a|b", half - 1, half, null),
    nahtGesetze(stage, "Buehne b|a", stage.width - 1, 0, adjB),
  ]) { lines.push(...g.lines); fail.push(...g.fail); }

  // 3 · DAS BAND TRAEGT UEBER DIE VOLLE BREITE
  let leer = 0, erste = -1;
  for (let x = 0; x < band.width; x++) {
    let on = false;
    for (let y = 0; y < band.height && !on; y++) if (onAt(band, x, y)) on = true;
    if (!on) { leer++; if (erste < 0) erste = x; }
  }
  lines.push(`  Band: ${leer} unbemalte Spalte(n)${leer > 0 ? ` (erste bei x=${erste})` : ""}`);
  if (leer > 0) fail.push(`Band: ${leer} Spalte(n) ohne ein einziges bemaltes Pixel (erste x=${erste}) — die Ringkante hat ein Loch`);

  // Bandschleife 2047 gegen 0, gemessen auf bemalten Pixeln
  const bs = stepOf(band), bg = SEAM_OVER_TEXTURE * bs;
  const loop = seamOf(band, band);
  lines.push(`  Band-Schleife: Fuge ${Number.isNaN(loop.fuge) ? "—" : loop.fuge.toFixed(3)} · Sprung ${Number.isNaN(loop.sprung) ? "—" : loop.sprung.toFixed(3)} · Schritt ${bs.toFixed(3)} → Grenze ${bg.toFixed(3)} · gemeinsame Pixel ${loop.shared}`);
  if (loop.shared === 0) fail.push("Band-Schleife: null gemeinsame bemalte Pixel — UNGEMESSEN, nicht bestanden");
  else {
    if (!(loop.fuge <= bg)) fail.push(`Band-Schleife: Fuge ${loop.fuge.toFixed(3)} ueber der Grenze ${bg.toFixed(3)}`);
    if (!(loop.sprung <= bg)) fail.push(`Band-Schleife: Sprung ${loop.sprung.toFixed(3)} ueber der Grenze ${bg.toFixed(3)}`);
  }
  {
    const g = nahtGesetze(band, "Band-Schleife", band.width - 1, 0, adjazenzVerteilung(band));
    lines.push(...g.lines); fail.push(...g.fail);
  }

  // 4/5 · BAND-HELLIGKEIT und HOLZTON
  let ls = 0, ln = 0; const hues = [];
  for (let y = 0; y < band.height; y++) for (let x = 0; x < band.width; x++) {
    if (!onAt(band, x, y)) continue;
    const i = (y * band.width + x) * 4;
    const r = band.data[i], g = band.data[i + 1], b = band.data[i + 2];
    ls += lum(r, g, b); ln++;
    if ((x + y) % 7 === 0) hues.push(hueOf(r, g, b));
  }
  const bandPct = ln === 0 ? 0 : (ls / ln) / 255 * 100;
  const hMed = median(hues);
  lines.push(`  Band: Helligkeit ${bandPct.toFixed(3)} % (Fenster ${BAND_L[0]}–${BAND_L[1]}) · Holzton H-Median ${hMed.toFixed(3)}° (Fenster ${BAND_H[0]}–${BAND_H[1]})`);
  if (bandPct < BAND_L[0] || bandPct > BAND_L[1]) fail.push(`Band: Helligkeit ${bandPct.toFixed(2)} % ausserhalb ${BAND_L[0]}–${BAND_L[1]} % — es tritt vor den Kampf statt hinter ihn`);
  if (hMed < BAND_H[0] || hMed > BAND_H[1]) fail.push(`Band: Holzton H-Median ${hMed.toFixed(2)}° ausserhalb ${BAND_H[0]}–${BAND_H[1]}° — nicht die Holzfarbe des Bestandes`);

  // 6 · RESERVE auf beiden Blaettern
  for (const [nm, p] of [["Buehne", stage], ["Band", band]]) {
    let mk = Infinity, under = 0;
    for (let y = 0; y < p.height; y++) for (let x = 0; x < p.width; x++) {
      if (!onAt(p, x, y)) continue;
      const i = (y * p.width + x) * 4;
      const d = Math.hypot(p.data[i] - 255, p.data[i + 1], p.data[i + 2] - 255);
      if (d < mk) mk = d;
      if (d < KEY_MIN) under++;
    }
    lines.push(`  ${nm}: kleinster Schluesselabstand ${mk.toFixed(3)} · ${under} px unter ${KEY_MIN}`);
    if (under > 0) fail.push(`${nm}: ${under} gemalte Pixel unter ${KEY_MIN} Schluesselabstand (kleinster ${mk.toFixed(2)}) — ein toleranter Schluessel frisst sie`);
  }

  // ── DAS URTEIL JE BLATT ───────────────────────────────────────────────────
  // Die Lieferungen kommen als Paar, werden aber EINZELN angenommen (R199: das
  // Band von AQ13c4 ist importfaehig, die Buehne derselben Lieferung nicht).
  // Wer das aus einer Fehlerliste erschliessen muss, erschliesst es falsch.
  const istBand = (f) => f.startsWith("Band");
  const nBand = fail.filter(istBand).length, nBuehne = fail.length - nBand;
  lines.push("");
  lines.push(`  ► Buehne: ${nBuehne === 0 ? "GRUEN" : `ROT (${nBuehne} Befund/e)`} · Band: ${nBand === 0 ? "GRUEN" : `ROT (${nBand} Befund/e)`}`);
  return { lines, fail };
}

/** ── DIE PASSUNG EINER OVERLAY-LIEFERUNG (R5 · T2 · D-673) ──────────────────
 *
 *  WARUM ES DIESEN MODUS GIBT. Die Overlay-Bestellung AQ13K hat ihr Blatt-Mass
 *  getroffen (2048×512, 4×1 — genau das, was sie verlangt hat) und trotzdem
 *  nicht ins Spiel gepasst: die Kreide ist auf die ZELLENMITTE gemalt und rund
 *  2,3× zu gross fuer die Schreibflaeche, auf die der Importeur sie legt. Das
 *  Blatt-Mass und die PASSUNG sind zwei verschiedene Zahlen, und bis heute war
 *  nur die erste bestellt und nur die erste gemessen.
 *
 *  ★ WARUM DAS EIN MODUS IST UND KEIN ABSATZ IN EINEM REPORT — dieselbe
 *    Begruendung wie ueber `--overlay-pins` (H6) und `--reserve` (T1): ein
 *    Befund, dessen Zahl nur in einem Report steht, ist beim naechsten Mal
 *    wieder ungemessen. Eine Overlay-Lieferung kann sich damit SELBST messen,
 *    bevor irgendjemand einen Import versucht — und die Bestellung kann die
 *    Zahl als Abnahmezeile fuehren, statt sie stillschweigend vorauszusetzen.
 *
 *  ★★ WAS ER MISST UND WAS NICHT. Er misst die PASSUNG, nicht die Kunst: passt
 *     die gemalte Flaeche in das Fenster, das der Importeur aus dem
 *     Bezugs-Sprite RECHNET, und wie viel liegt neben der Schreibflaeche. Ueber
 *     Kreide-Charakter, Motiv oder Lesbarkeit sagt er nichts — das ist Sache
 *     des blinden Panels. Exit 1 heisst deshalb genau eines: mindestens eine
 *     Zelle, DIE DER IMPORTEUR NIMMT, passt nicht in ihr Fenster.
 *
 *  ★★★ WARUM DIE ZURUECKGEHALTENEN ZELLEN GEMESSEN, ABER NICHT BEURTEILT
 *      WERDEN. `SHEETS` haelt drei Wisch-Zellen aus einem DESIGN-Grund
 *      zurueck (sie stimmen nur bei hp = 3, siehe dort). Sie liegen im Blatt,
 *      also stehen ihre Zahlen hier — aber ein Fenster, in das nie etwas
 *      geschnitten wird, kann auch nicht verfehlt werden. Gemessen am
 *      Bestand: genau diese drei sitzen 25–26 px zu weit rechts, und genau die
 *      fuenf, die der Importeur nimmt, sitzen. Wer sie mitzaehlte, bekaeme ein
 *      rotes Licht auf einer Lieferung, die seit AQ13b angenommen ist — und
 *      das Lineal waere beim ersten Gebrauch unglaubwuerdig.
 *
 *  Das Fenster wird Zeile fuer Zeile so gerechnet wie im Overlay-Zweig des
 *  Importeurs (zentriertes Bezugs-Sprite + `slateMaskOf`) — ein zweites Lineal
 *  waere genau die Klasse, gegen die der Kopf dieser Datei geschrieben ist.
 */
function overlayPassung(entries) {
  const lines = [], fail = [];

  for (const e of entries) {
    const { name, png, ref, refName } = e;
    const held = new Set(e.held ?? []);
    const cols = e.cols ?? 4, rows = e.rows ?? Math.max(1, Math.round(png.height / (e.ch ?? 512)));
    const cw = e.cw ?? Math.round(png.width / cols), ch = e.ch ?? Math.round(png.height / rows);

    const slate = slateMaskOf(ref);
    if (slate.n === 0) {
      fail.push(`${name}: im BEZUGS-Sprite ${refName} ist keine Schreibflaeche messbar (Leitfarbton ${slate.peak < 0 ? "—" : slate.peak + "°"}) — nicht die Lieferung ist hier auffaellig, sondern das Lineal`);
      continue;
    }
    const offX = Math.floor((cw - ref.width) / 2);
    const offY = Math.floor((ch - ref.height) / 2);
    const win = {
      x: offX + slate.box.x0,
      y: offY + slate.box.y0,
      w: slate.box.x1 - slate.box.x0 + 1,
      h: slate.box.y1 - slate.box.y0 + 1,
    };

    lines.push("");
    lines.push(`${name}  ${png.width}×${png.height} → ${cols}×${rows} Zellen à ${cw}×${ch}`);
    lines.push(`  Fenster aus ${refName} (${ref.width}×${ref.height}, zentriert bei ${offX},${offY}) `
      + `→ Schreibfläche (${win.x},${win.y})–(${win.x + win.w - 1},${win.y + win.h - 1}) = ${win.w}×${win.h}`);

    for (let i = 0; i < cols * rows; i++) {
      const cellX = (i % cols) * cw, cellY = Math.floor(i / cols) * ch;
      const cell = chromaKey(crop(png, cellX, cellY, cw, ch));
      const cb = contentBox(cell);
      if (cb === null) {
        fail.push(`${name} Zelle ${i}: nach dem Schlüssel bleibt nichts übrig`);
        continue;
      }
      // Wie weit ragt der Inhalt je Seite über das Fenster hinaus? Vier Zahlen,
      // keine Ja/Nein-Auskunft: eine Retusche-Bestellung braucht die Richtung.
      const li = Math.max(0, win.x - cb.x0);
      const re = Math.max(0, cb.x1 - (win.x + win.w - 1));
      const ob = Math.max(0, win.y - cb.y0);
      const un = Math.max(0, cb.y1 - (win.y + win.h - 1));
      const draussen = li + re + ob + un > 0;

      // …und wie viel liegt auf RAHMEN oder LUFT? DASSELBE Lineal, das der
      // Import benutzt (`overlayNeben`) — das Tor misst ab R5-T3 genau die
      // Zahl, an der der Import scheitert. Vorher mass es den Inhalts-KASTEN
      // und schwieg ueber die Pixel: ein Blatt konnte mit Exit 0 durch das Tor
      // gehen und am Import trotzdem sterben (dieselbe Klasse wie D-673, eine
      // Ebene tiefer).
      const nb = overlayNeben(cell, cw, ch, slate, offX, offY, ref);
      const gemalt = nb.gemalt, neben = nb.daneben;

      const bw = cb.x1 - cb.x0 + 1, bh = cb.y1 - cb.y0 + 1;
      const zurueck = held.has(i);
      lines.push(
        `  Zelle ${i}: ${String(gemalt).padStart(6)} px gemalt · Inhalt (${cb.x0},${cb.y0})–(${cb.x1},${cb.y1}) = ${bw}×${bh}`
        + ` · Übermaß ${(bw / win.w).toFixed(2)}× / ${(bh / win.h).toFixed(2)}×`
        + ` · Rahmen/Luft ${neben} px (${gemalt === 0 ? "—" : (100 * neben / gemalt).toFixed(2)} %)`
        + ` · Rand-Malerei ${nb.rand} px`
        + ` · ${draussen ? `ÜBER DEM RAND (links ${li} · rechts ${re} · oben ${ob} · unten ${un} px)` : "SITZT"}`
        + `${zurueck ? "  [ZURÜCKGEHALTEN — wird nicht geschnitten, zählt nicht]" : ""}`,
      );
      if (neben > OFF_MAX && !zurueck) {
        fail.push(
          `${name} Zelle ${i}: ${neben} von ${gemalt} gemalten Pixeln (${(100 * neben / gemalt).toFixed(2)} %) liegen auf `
          + `RAHMEN oder LUFT statt auf der Schreibfläche von ${refName} (Grenze ${OFF_MAX}) — `
          + `der Importeur bricht an genau dieser Zahl ab. Rand-Malerei auf der Fläche: ${nb.rand} px, die zählt nicht.`,
        );
      }
      if (draussen && !zurueck) {
        fail.push(
          `${name} Zelle ${i}: die Malerei ragt über die Schreibfläche hinaus — links ${li}, rechts ${re}, `
          + `oben ${ob}, unten ${un} px; Inhalt ${bw}×${bh} gegen ein Fenster von ${win.w}×${win.h} `
          + `(${(bw / win.w).toFixed(2)}× / ${(bh / win.h).toFixed(2)}×). `
          + (bw > win.w * 1.5 || bh > win.h * 1.5
            ? "Das ist kein Rand-Überstand, sondern ein MASSSTABS-Bruch: das Blatt ist gegen ein anderes Brett gemalt als das, auf dem es liegen soll."
            : "Ein Überstand in dieser Größenordnung ist Malerei über den Rand, kein anderer Maßstab."),
        );
      }
    }
  }
  return { lines, fail };
}

/** ── R5-T5 · D-695 · `overlayMasse` — DIE REGEL, DIE AUF STRICH-OVERLAYS AUCH
 *  WIRKLICH LAEUFT (Herleitung an `OVERLAY_MASSE_MAX`).
 *
 *  Gemessen wird je ZELLE, nicht je Blatt, und das ist Absicht: der Importeur
 *  schneidet Zellen, und eine Zelle ist die Einheit, die in die Welt geht. Je
 *  Blatt gerechnet verschwindet eine schlimme Zelle im Mittel der guten — genau
 *  so las AQ13Ms 8,72-%-Zelle als 2,17 % (T4s Kopfzeile).
 *
 *  Der Ausnahmeweg ist derselbe wie bei Regel 5: ein Pin auf die BYTES der
 *  Zelle (`OVERLAY_MASSE_FREI`), nie auf den Namen — ein neues, falsches Blatt
 *  gleichen Namens ginge sonst stillschweigend durch.
 */
function overlayMasse(entries, pins = OVERLAY_MASSE_FREI) {
  const lines = [], fail = [];
  for (const e of entries) {
    const { name, png } = e;
    const cw = e.cw ?? 512, ch = e.ch ?? 512;
    const cols = e.cols ?? Math.round(png.width / cw);
    const rows = e.rows ?? Math.max(1, Math.round(png.height / ch));
    lines.push(`${name}  ${png.width}×${png.height} → ${cols}×${rows} Zellen à ${cw}×${ch}`);
    for (let i = 0; i < cols * rows; i++) {
      const r0 = Math.floor(i / cols), c0 = i % cols;
      if ((c0 + 1) * cw > png.width || (r0 + 1) * ch > png.height) continue;
      const sha = cellHash(png, c0 * cw, r0 * ch, cw, ch);
      const grund = pins.get(sha);
      const tally = new Map();
      let painted = 0;
      for (let y = r0 * ch; y < (r0 + 1) * ch; y++) for (let x = c0 * cw; x < (c0 + 1) * cw; x++) {
        if (!onAt(png, x, y)) continue;
        const idx = (y * png.width + x) * 4;
        const k = (png.data[idx] << 16) | (png.data[idx + 1] << 8) | png.data[idx + 2];
        tally.set(k, (tally.get(k) ?? 0) + 1);
        painted++;
      }
      let topK = 0, topN = 0;
      for (const [k, n] of tally) if (n > topN) { topN = n; topK = k; }
      const share = painted === 0 ? 0 : topN / painted;
      const rgb = `(${topK >> 16},${(topK >> 8) & 255},${topK & 255})`;
      lines.push(`  Zelle ${i}: ${String(painted).padStart(7)} px gemalt · haeufigster RGB ${rgb.padEnd(16)}`
        + `${(share * 100).toFixed(2).padStart(6)} % · Grenze ${(OVERLAY_MASSE_MAX * 100).toFixed(0)} %`
        + (grund === undefined ? "" : ` · GEPINNT (${grund})`));
      if (share > OVERLAY_MASSE_MAX && grund === undefined) {
        fail.push(`${name} Zelle ${i}: ein einzelner RGB-Wert ${rgb} stellt ${(share * 100).toFixed(2)} % der `
          + `gemalten Pixel dieser Zelle (Grenze ${(OVERLAY_MASSE_MAX * 100).toFixed(0)} %, geeicht an `
          + `${(OVERLAY_MASSE_EHRLICH * 100).toFixed(2)} % ehrlich | ${(OVERLAY_MASSE_KRANK * 100).toFixed(0)} % krank). `
          + `Zell-SHA ${sha}`);
      }
    }
  }
  return { lines, fail };
}

/** ── DER SELBSTTEST ─────────────────────────────────────────────────────────
 *  Jeder Fall ist ein PAAR: richtig und PLAUSIBEL-FALSCH, die sich in genau
 *  einer Eigenschaft unterscheiden und einem oberflaechlichen Blick gleich
 *  aussehen. Ein Selbsttest, der nur gruen kennt, beweist nichts — deshalb
 *  gilt jeder Fall erst als bestanden, wenn die falsche Haelfte ROT wird UND
 *  die richtige gruen bleibt. Die sechs Faelle sind die sechs Wege, auf denen
 *  die beiden abgelehnten Lieferungen durch einen Lieferschein gekommen sind.
 */
function mkPng(w, h, fn) {
  const p = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const c = fn(x, y) ?? [255, 0, 255];
    p.data[i] = c[0]; p.data[i + 1] = c[1]; p.data[i + 2] = c[2]; p.data[i + 3] = 255;
  }
  return p;
}

function selftest() {
  const cases = [];
  /** `expect` ist der Teilsatz, der in der Begruendung stehen MUSS: ein roter
   *  Fall, der aus dem falschen Grund rot wird, hat nichts bewiesen. */
  const add = (name, expect, run) => cases.push({ name, expect, run });

  // ── die Attrappen ─────────────────────────────────────────────────────────
  // Sie muessen MALERISCH sein, nicht nur richtig: ein Blatt aus drei Farben
  // faellt an Regel 5 durch, ganz gleich was es sonst zeigt. Jede Flaeche
  // bekommt deshalb drei unabhaengig streuende Kanaele — genau das, was echte
  // Malerei hat und ein Farbfeld nicht.
  const REFW = 120, REFH = 180;
  const SLX0 = 12, SLY0 = 18, SLW = 90, SLH = 120;   // die Schreibflaeche im Koerper
  const frameCol = (x, y) => [150 + ((x * 3 + y * 5) % 9), 60 + ((x * 7 + y) % 9), 40 + ((x + y * 11) % 9)];
  /** GEMALTER Schiefer: zwei kurzwellige, aber STETIGE Wellen je Kanal. Das
   *  gibt echte Nachbarschritte (Regel 4) und trotzdem eine Nachbarschaft, die
   *  den Punkt voraussagt (Regel 7) — genau der Unterschied, den ein Blatt aus
   *  Einzelpunkt-Rauschen nicht hat, obwohl es Regel 4 muehelos besteht. */
  //  Je Kanal EINE stetige Welle mit eigener Raumfrequenz: der Nachbarschritt
  //  ist amp × Frequenz (also gross genug fuer Regel 4), die Kruemmung bleibt
  //  klein (also besteht sie Regel 7), und drei unabhaengige Kanaele geben so
  //  viele Farbwerte, dass keiner 1 % des Blattes stellt (Regel 5).
  const slateCol = (x, y, base = 9, amp = 8) => [
    Math.max(0, Math.round(base + amp * Math.sin(x * 0.52 + y * 0.31))),
    Math.max(0, Math.round(base + amp * Math.sin(x * 0.33 + y * 0.55 + 1.7))),
    Math.max(0, Math.round(base + amp * Math.sin(x * 0.61 + y * 0.24 + 3.4))),
  ];
  /** RAUSCHEN mit demselben Mittel und demselben Nachbarschritt — der Fall, in
   *  dem richtig und plausibel-falsch fuer Regel 4 ununterscheidbar sind. */
  const noiseCol = (x, y) => [
    3 + ((x * 7 + y * 13) % 13), 3 + ((x * 11 + y * 5) % 13), 3 + ((x * 3 + y * 17) % 13),
  ];
  const greyFace = (x, y) => { const v = 241 + ((x * 5 + y * 7) % 12); return [v, v, v]; };

  /** Der Bestandskoerper: gruene Schreibflaeche, GENAU 1000 Pixel mit L > 200. */
  const mkRef = () => {
    let bright = 0;
    return mkPng(REFW, REFH, (x, y) => {
      const inSlate = x >= SLX0 && x < SLX0 + SLW && y >= SLY0 && y < SLY0 + SLH;
      if (!inSlate) return frameCol(x, y);
      if (bright < 1000) { bright++; return [250, 250, 250]; }
      return [40, 110, 60];
    });
  };
  const N_REF = 1000;                                  // die Bezugszahl der Quote

  /** Eine gelieferte Koerperzelle. */
  const mkCell = (W, H, opts) => {
    const o = {
      place: "mitte", face: 500, faceCol: null, mass: 0, keyAt: 200,
      slateBase: 9, slateAmp: 8, rauschen: false, streifen: 0, ...opts,
    };
    const offX = Math.floor((W - REFW) / 2);
    const offY = o.place === "unten" ? H - REFH : Math.floor((H - REFH) / 2);
    let facePut = 0, massPut = 0;
    return mkPng(W, H, (x, y) => {
      const lx = x - offX, ly = y - offY;
      if (lx < 0 || ly < 0 || lx >= REFW || ly >= REFH) return [255, 0, 255];
      if (lx === REFW - 1 && ly === REFH - 1) {
        // das knappste Pixel, auf den gewuenschten Schluesselabstand gerechnet
        const g = Math.sqrt(Math.max(0, o.keyAt * o.keyAt - 2 * 25 * 25));
        return [230, Math.round(g), 230];
      }
      const inSlate = lx >= SLX0 && lx < SLX0 + SLW && ly >= SLY0 && ly < SLY0 + SLH;
      if (!inSlate) return frameCol(lx, ly);
      // ── HELLE STREIFEN IN DER MASKE ────────────────────────────────────────
      // Der Bestandskoerper faerbt seine ersten 1000 Schieferpixel weiss, und
      // WEISS ist nach `slateMaskOf` kein Schiefer — die Gesichts-Kreide der
      // Attrappe liegt also gar nicht in der Maske. Genau deshalb hat der alte
      // Selbsttest die Filterzeile nie beruehrt: dort war nichts zu filtern.
      // Diese Streifen liegen ab Zeile 12 des Schiefers, also IN der Maske —
      // die Klasse, mit der AQ13b2 durchgekommen ist.
      if (o.streifen > 0 && ly >= SLY0 + 12 && ((ly - SLY0 - 12) % 50) < Math.round(50 * o.streifen)) {
        return greyFace(lx, ly);
      }
      if (facePut < o.face) { facePut++; return o.faceCol ?? greyFace(lx, ly); }
      if (massPut < o.mass) { massPut++; return [7, 23, 26]; }
      if (o.rauschen) return noiseCol(lx, ly);
      return slateCol(lx, ly, o.slateBase, o.slateAmp);
    });
  };

  const W = 200, H = 250;
  const bestandOf = () => mkRef();
  const runTafel = (png, names, cols, cw, ch) =>
    abnahmeTafel([{ name: "probe", png, names, cols, cw, ch }], bestandOf);

  // ── Fall 0 · DAS LINEAL SELBST (R5 · H6, neu gefasst in R5 · T1) ──────────
  //
  // `slateMaskOf` sagt, WO auf dem Blatt der Schiefer gemessen wird. Bis zum
  // 23.08. sagte sie es ueber die FARBE gruen — und wurde an dem Tag blind, als
  // die bestellte Lieferung nachtblauen Schiefer brachte (R212d: der Boss
  // trennt ueber den Farbton). H6 hat diese Grenze hier als Zahl festgehalten
  // und geroutet; T1 hat sie aufgehoben. Die Faelle halten jetzt die NEUE
  // Regel fest: sie darf keine Farbe kennen, sie muss BEIDE Familien gleich
  // gut finden, und wenn sie nichts findet, muss sie den BEZUG beschuldigen
  // und nicht die Lieferung.
  const mkRefFarbe = (schiefer) => {
    let hell = 0;
    return mkPng(REFW, REFH, (x, y) => {
      const drin = x >= SLX0 && x < SLX0 + SLW && y >= SLY0 && y < SLY0 + SLH;
      if (!drin) return frameCol(x, y);
      if (hell < 1000) { hell++; return [250, 250, 250]; }
      return schiefer;
    });
  };
  const mVon = (png) => slateMaskOf(png);
  const mGruen = mVon(mkRefFarbe([40, 110, 60]));   // die alte Schulwandtafel, H ≈ 140°
  const mBlau = mVon(mkRefFarbe([6, 1, 41]));       // AQ13B4-Schiefer,        H ≈ 248°
  // ★ ZWEI FAMILIEN, EIN LINEAL — und zwar auf DIESELBE Flaeche. Der Kasten
  //   muss bitgleich sein: die zwei Attrappen unterscheiden sich nur in der
  //   Farbe ihres Schiefers, nicht in seiner Lage. Wer den Sucher wieder auf
  //   eine Farbe verdrahtet, verliert genau hier eine der beiden Zahlen.
  const gleicherKasten = (a, b) =>
    a.box.x0 === b.box.x0 && a.box.y0 === b.box.y0 && a.box.x1 === b.box.x1 && a.box.y1 === b.box.y1;
  const beideGefunden = mGruen.n > 1000 && mBlau.n > 1000 && gleicherKasten(mGruen, mBlau);
  add(`Lineal: BEIDE Familien gefunden — gruen ${mGruen.n} px bei ${mGruen.peak}°, nachtblau ${mBlau.n} px bei ${mBlau.peak}°, gleicher Kasten`,
    beideGefunden ? null : "LINEAL IST WIEDER FARBGEBUNDEN",
    () => (beideGefunden
      ? { lines: [], fail: [] }
      : { lines: [], fail: [`LINEAL IST WIEDER FARBGEBUNDEN: gruen ${mGruen.n} px (${mGruen.peak}°), blau ${mBlau.n} px (${mBlau.peak}°), Kasten gleich: ${gleicherKasten(mGruen, mBlau)}`] }));
  // TAMPER auf genau der Zeile, die den Kanal waehlt: fest auf BLAU verdrahtet.
  // Das ist der teuerste denkbare Fehler dieser Bahn — er sieht heute richtig
  // aus und wird an der naechsten Bestellung blind, genau wie am 23.08.
  const blauFest = (png) => {
    const { width: W2, height: H2, data } = png;
    let n = 0;
    for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) {
      const i = (y * W2 + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (a > 200 && r < 130 && b > r * 1.10 && b > g * 1.05 && b > 30) n++;
    }
    return n;
  };
  const festAufGruenerTafel = blauFest(mkRefFarbe([40, 110, 60]));
  add(`Lineal · TAMPER: fest auf BLAU verdrahtet findet auf der gruenen Tafel ${festAufGruenerTafel} px`,
    festAufGruenerTafel === 0 ? "FEST VERDRAHTET WAERE BLIND" : null,
    () => (festAufGruenerTafel === 0
      ? { lines: [], fail: ["FEST VERDRAHTET WAERE BLIND: eine auf Blau festgelegte Regel findet auf einem gruenen Blatt 0 px — das ist der Fehler, gegen den die Stufe A gebaut ist"] }
      : { lines: [], fail: [] }));
  // Die GRENZE zwischen den zwei Familien liegt bei 180°, und sie steht als
  // Zahl im Kopf von `slateMaskOf`. Diese zwei Faelle fahren sie beidseitig an,
  // damit sie nicht eines Tages still verrutscht.
  const peakVon = (h) => {
    // ein Schiefer im gewuenschten Farbton, Helligkeit und Saettigung fest
    const rad = (h * Math.PI) / 180;
    const c = 40, r = 6;
    const g = h < 180 ? c : Math.round(r + (c - r) * Math.max(0, Math.cos(rad - Math.PI * 2 / 3)));
    const b = h < 180 ? Math.round(r + (c - r) * Math.max(0, Math.cos(rad - Math.PI * 4 / 3))) : c;
    return slateMaskOf(mkRefFarbe([r, g, b]));
  };
  const tuerkisGruen = peakVon(160), tuerkisBlau = peakVon(200);
  add(`Lineal: 160° fuehrt GRUEN (Kanal ${tuerkisGruen.leit}), 200° fuehrt BLAU (Kanal ${tuerkisBlau.leit}) — die Grenze steht bei 180°`,
    tuerkisGruen.leit === 1 && tuerkisBlau.leit === 2 ? null : "GRENZE VERRUTSCHT",
    () => (tuerkisGruen.leit === 1 && tuerkisBlau.leit === 2
      ? { lines: [], fail: [] }
      : { lines: [], fail: [`GRENZE VERRUTSCHT: 160° waehlt Kanal ${tuerkisGruen.leit}, 200° waehlt Kanal ${tuerkisBlau.leit}`] }));
  // TAMPER: ein Bezug ganz OHNE Schreibflaeche. Er muss den Bezug benennen —
  // eine Meldung `Schiefer L NaN ueber 22` waere ein Befund gegen ein Blatt,
  // das nichts falsch gemacht hat.
  add("Lineal · TAMPER: Bezug ohne Schreibflaeche beschuldigt den BEZUG, nicht die Lieferung",
    "keine Schreibflaeche messbar",
    () => abnahmeTafel(
      [{ name: "probe", png: mkCell(W, H, {}), names: ["a"], cols: 1, cw: W, ch: H }],
      () => mkPng(REFW, REFH, (x, y) => frameCol(x, y)),   // nur Holz, kein Schiefer
    ));

  // ── Fall 1 · ZWILLING ─────────────────────────────────────────────────────
  // Zwei Kritzel-Zustaende, die dieselbe Datei sind. Beide Blaetter sind voll
  // und gesund; NUR die Byte-Gleichheit unterscheidet sie.
  const twinSheet = (twin) => {
    const c0 = mkCell(W, H, {});
    const c1 = mkCell(W, H, {});
    if (!twin) c1.data[(120 * W + 100) * 4] = 3;      // EIN Pixel anders
    const s2 = new PNG({ width: W * 2, height: H });
    for (const [k, c] of [[0, c0], [1, c1]]) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const si = (y * W + x) * 4, di = (y * W * 2 + k * W + x) * 4;
      for (let q = 0; q < 4; q++) s2.data[di + q] = c.data[si + q];
    }
    return s2;
  };
  add("Zwilling: zwei Zellen, eine Datei", "byteweise dieselbe Zelle", () => runTafel(twinSheet(true), ["a", "b"], 2, W, H));
  add("Zwilling: zwei Zellen, ein Pixel Unterschied", null, () => runTafel(twinSheet(false), ["a", "b"], 2, W, H));

  // ── Fall 2 · DER SITZ ─────────────────────────────────────────────────────
  // Gleiche Masse, gleicher Inhalt, gleiche Silhouette — nur unten buendig
  // statt zentriert. Eine Silhouetten-IoU nach EIGENER Ausrichtung meldet 1,0;
  // der Importeur schneidet trotzdem ins Leere.
  add("Sitz: Koerper unten buendig statt zentriert", "verschoben in der Zelle", () => runTafel(mkCell(W, H, { place: "unten" }), ["a"], 1, W, H));
  add("Sitz: Koerper zentriert wie der Bestand", null, () => runTafel(mkCell(W, H, { place: "mitte" }), ["a"], 1, W, H));

  // ── Fall 3 · DIE GESICHTSQUOTE GEGEN DEN BESTAND ──────────────────────────
  // 350 weisse Pixel sehen nach einem Gesicht aus. Gegen ein selbst gerechnetes
  // N (etwa 800) sind das 0,44 und damit bestanden; gegen den BESTAND (N = 1000)
  // sind es 0,35. Genau dieser Unterschied hat die Lieferung durchgelassen.
  add("Gesichtsquote: 350 von 1000 (der Lieferschein rechnete gegen 800)", "Gesichtsquote", () => runTafel(mkCell(W, H, { face: 350 }), ["a"], 1, W, H));
  add("Gesichtsquote: 450 von 1000", null, () => runTafel(mkCell(W, H, { face: 450 }), ["a"], 1, W, H));

  // ── Fall 4 · DAS GOLDKHAKI-GESICHT ────────────────────────────────────────
  // Der Schutzfilter der ersten Lieferung drehte die Kreide flaechig auf
  // (212,177,95): reichlich Pixel im Gesicht, aber keins ist WEISS.
  add("Gesicht flaechig in Goldkhaki (212,177,95)", "Gesichtsquote", () => runTafel(mkCell(W, H, { face: 500, faceCol: [212, 177, 95] }), ["a"], 1, W, H));
  add("Gesicht in echtem Weiss", null, () => runTafel(mkCell(W, H, { face: 500 }), ["a"], 1, W, H));

  // ── Fall 5 · MASSENFARBE und FLACHER SCHIEFER ─────────────────────────────
  add("Massenfarbe: ein RGB-Wert stellt ueber 1 % des Blattes", "einzelner RGB-Wert", () => runTafel(mkCell(W, H, { face: 450, mass: 400 }), ["a"], 1, W, H));
  add("Schiefer flach statt gemasert", "Maserung", () => runTafel(mkCell(W, H, { face: 450, slateAmp: 1, slateBase: 8 }), ["a"], 1, W, H));
  // ── Fall 5b · RAUSCHEN, DAS DIE MASERUNGS-REGEL BESTEHT ───────────────────
  // Dieselbe Helligkeit, ein GROESSERER Nachbarschritt als die gemalte Flaeche —
  // Regel 4 sieht hier nichts. Nur Regel 7 trennt die beiden.
  add("Schiefer als Einzelpunkt-Rauschen (besteht die Maserungs-Regel)", "Rauhheit", () => runTafel(mkCell(W, H, { face: 450, rauschen: true }), ["a"], 1, W, H));

  // ── Fall 5c · DIE KREIDE, DIE DEN SCHIEFER AUFHELLT (R5-W7 · H5, P-80) ────
  // Weisse Streifen IN der Schiefermaske. Gefiltert (die H4-Rechnung) meldet
  // die Flaeche rund 9 und besteht; ueber die volle Maske sind es rund 46 —
  // dieselbe Groessenordnung, mit der AQ13b2 gemeldet 8,60–9,12 hatte und in
  // Wahrheit bei 47–49 lag. Die zwei Haelften unterscheiden sich in genau
  // einer Eigenschaft: ob die Streifen da sind.
  add("Schiefer: helle Streifen in der Maske (gefiltert waeren es ~9)", "Schiefer L", () => runTafel(mkCell(W, H, { face: 450, streifen: 0.16 }), ["a"], 1, W, H));
  add("Schiefer: dieselbe Flaeche ohne die Streifen", null, () => runTafel(mkCell(W, H, { face: 450, streifen: 0 }), ["a"], 1, W, H));

  // ── Fall 4b · DIE NEU GEEICHTE SCHWELLE, BEIDSEITIG ANGEFAHREN (R5 · T1) ──
  //
  // `SLATE_L_MAX` stand auf 10 und lag damit 0,7 % ueber dem gesunden Band der
  // GRUENEN Palette — eine Schwelle auf der Bandkante kippt, sobald die Palette
  // wechselt, und genau das ist am 23.08. passiert. Sie liegt jetzt bei 22, in
  // der Mitte der gemessenen Luecke (gesund 10,5–10,9 · krank 47–61). Diese
  // zwei Faelle fahren sie beidseitig an: derselbe Schiefer, einmal so hell wie
  // ausgeliefert und einmal um 14 Punkte aufgehellt.
  add(`Schiefer: nachtblau wie ausgeliefert (Schwelle ${SLATE_L_MAX})`, null,
    () => runTafel(mkCell(W, H, { face: 450, slateBase: 9, slateAmp: 8 }), ["a"], 1, W, H));
  add(`Schiefer: derselbe Schiefer um 14 Punkte aufgehellt (Schwelle ${SLATE_L_MAX})`, "Schiefer L",
    () => runTafel(mkCell(W, H, { face: 450, slateBase: 23, slateAmp: 8 }), ["a"], 1, W, H));

  // ── Fall 5d · DIE OVERLAY-AUSNAHME, UND DASS SIE AUF BYTES SITZT ───────────
  // Ein Strich-Overlay besteht fast nur aus Kreide: 20 % der gemalten Pixel auf
  // EINEM RGB-Wert sind hier normal, auf einem Koerper-Blatt waeren sie ein
  // Farbfeld. Die Ausnahme darf deshalb existieren — aber sie muss an den Bytes
  // haengen, sonst geht ein neues, falsches Blatt gleichen Namens durch.
  // TAMPER: dasselbe Blatt, ein Pin auf ANDERE Bytes ⇒ die Ausnahme greift nicht.
  const mkOverlay = () => {
    let n = 0;
    return mkPng(W, H, (x, y) => {
      if ((x + y * 3) % 5 !== 0) return [255, 0, 255];   // Durchsicht: es ist ein Overlay
      if (n++ % 5 === 0) return [235, 235, 235];         // die Massenfarbe: 20 % der Kreide
      return greyFace(x, y);
    });
  };
  const ovPng = mkOverlay();
  const ovSha = cellHash(ovPng, 0, 0, W, H);
  const runOverlay = (pins) => abnahmeTafel(
    [{ name: "overlay", png: ovPng, names: null, cols: 1, cw: W, ch: H }], bestandOf, pins,
  );
  add("Overlay: 20 % Massenfarbe, und die Zelle ist mit IHREN Bytes gepinnt", null,
    () => runOverlay(new Map([[ovSha, "Selbsttest-Pin"]])));
  add("Overlay · TAMPER: dieselben 20 %, aber der Pin nennt andere Bytes", "einzelner RGB-Wert",
    () => runOverlay(new Map([["0".repeat(64), "Selbsttest-Pin auf fremde Bytes"]])));
  // TAMPER 2 (R5 · H6) — DER FALL, WO RICHTIG UND PLAUSIBEL-FALSCH AUSEINANDER
  // GEHEN. Der Tamper darueber nennt einen offensichtlich fremden SHA; er
  // beweist, dass die Ausnahme ueberhaupt an einer Zahl haengt, aber er ist
  // leicht. Der teure Fall ist die NEULIEFERUNG gleichen Namens, die sich um
  // EINEN Bildpunkt unterscheidet: sie sieht aus wie das gepruefte Blatt, und
  // eine Ausnahme, die sie durchlaesst, sitzt in Wahrheit am Namen. Genau das
  // ist der Grund, warum der Pin auf den Bytes sitzt (Kopf bei
  // OVERLAY_MASSE_FREI) — also muss dieser Fall rot werden.
  const ovFast = mkOverlay();
  ovFast.data[0] = ovFast.data[0] === 0 ? 1 : ovFast.data[0] - 1;   // ein Kanal, ein Punkt
  add("Overlay · TAMPER: EIN geaenderter Bildpunkt, Pin auf den SHA des Originals", "einzelner RGB-Wert",
    () => abnahmeTafel(
      [{ name: "overlay", png: ovFast, names: null, cols: 1, cw: W, ch: H }], bestandOf,
      new Map([[ovSha, "Selbsttest-Pin auf das unveraenderte Original"]]),
    ));

  // ── Fall 5d² · R5-T5 · D-695 · DIE OVERLAY-MASSENFARBE HAT JETZT EIN TOR ──
  //
  // Die Grenze `OVERLAY_MASSE_MAX` (13 %) ist eine EICHUNG, und eine Eichung
  // ohne beidseitige Attrappen ist eine Behauptung (D-693: wer eine Grenze
  // bewegt oder einfuehrt, bewegt ihre Attrappen im SELBEN Commit — T4 hat
  // genau daran fast eine stille Blindstelle gebaut). Also faehrt der
  // Selbsttest das Band von BEIDEN Seiten an, mit den Zahlen der Herleitung:
  //
  //      8,72 %  (ehrliche Kante: schlimmste Zelle des Bestands)   gruen
  //     12,90 %  (knapp drunter)                                   gruen
  //     13,10 %  (knapp drueber)                                   ROT
  //     20,00 %  (kranke Kante: das Betrugs-Fixture)               ROT
  //     20,00 %  + Pin auf IHRE Bytes                              gruen
  //
  /** Eine Overlay-Zelle mit EXAKT dem verlangten Massenfarb-Anteil. Der Rest
   *  der Kreide bekommt viele verschiedene Werte, damit keine zweite Farbe die
   *  Massenfarbe ueberholt — sonst misst der Fall etwas anderes als er sagt. */
  const mkMasse = (anteil) => {
    const treffer = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if ((x + y * 3) % 5 === 0) treffer.push([x, y]);
    const wieviele = Math.round(treffer.length * anteil);
    const masse = new Set(treffer.slice(0, wieviele).map(([x, y]) => `${x},${y}`));
    let n = 0;
    return mkPng(W, H, (x, y) => {
      if ((x + y * 3) % 5 !== 0) return [255, 0, 255];          // Durchsicht: es ist ein Overlay
      if (masse.has(`${x},${y}`)) return [235, 235, 235];       // die eine Massenfarbe
      const v = 180 + (n++ % 40);                                // …und viele verschiedene Werte
      return [v, v - (x % 7), v - (y % 5)];
    });
  };
  const runMasse = (png, pins = new Map()) => overlayMasse(
    [{ name: "overlay", png, cols: 1, rows: 1, cw: W, ch: H }], pins,
  );
  /** ★ VAKUITAET: die Attrappe muss den Anteil, den sie behauptet, wirklich
   *  tragen — sonst prueft das Paar nichts (dieselbe Klasse wie T4s sechster
   *  Fall). Gemessen wird mit demselben Lineal, das auch das Tor benutzt. */
  const anteilVon = (png) => {
    const { lines } = runMasse(png);
    const m = /(\d+\.\d+) % · Grenze/.exec(lines.join("\n"));
    return m === null ? NaN : Number(m[1]) / 100;
  };
  add("Overlay-Masse: die Attrappen tragen ihre Zahlen wirklich (Vakuitaet)", null,
    () => {
      const schlecht = [];
      for (const soll of [OVERLAY_MASSE_EHRLICH, 0.129, 0.131, OVERLAY_MASSE_KRANK]) {
        const ist = anteilVon(mkMasse(soll));
        if (!(Math.abs(ist - soll) < 0.005)) schlecht.push(`Attrappe ${(soll * 100).toFixed(2)} % misst ${(ist * 100).toFixed(2)} %`);
      }
      // Dieser Fall ist ABSICHTLICH rot, wenn eine Attrappe ihre Zahl verfehlt.
      return { lines: [], fail: schlecht };
    });
  add("Overlay-Masse: 8,72 % — die schlimmste Zelle des Bestands bleibt gruen", null,
    () => runMasse(mkMasse(OVERLAY_MASSE_EHRLICH)));
  add("Overlay-Masse: 12,90 % — knapp unter der Grenze, gruen", null,
    () => runMasse(mkMasse(0.129)));
  add("Overlay-Masse: 13,10 % — knapp DRUEBER, rot", "ein einzelner RGB-Wert",
    () => runMasse(mkMasse(0.131)));
  add("Overlay-Masse: 20 % — die kranke Kante, rot", "ein einzelner RGB-Wert",
    () => runMasse(mkMasse(OVERLAY_MASSE_KRANK)));
  {
    const krank = mkMasse(OVERLAY_MASSE_KRANK);
    const sha = cellHash(krank, 0, 0, W, H);
    add("Overlay-Masse: dieselben 20 %, aber die Zelle ist mit IHREN Bytes gepinnt", null,
      () => runMasse(krank, new Map([[sha, "Selbsttest-Pin"]])));
    const fast = mkMasse(OVERLAY_MASSE_KRANK);
    fast.data[0] = fast.data[0] === 0 ? 1 : fast.data[0] - 1;   // ein Kanal, ein Punkt
    add("Overlay-Masse · TAMPER: EIN geaenderter Bildpunkt, Pin auf den SHA des Originals",
      "ein einzelner RGB-Wert",
      () => runMasse(fast, new Map([[sha, "Selbsttest-Pin auf das unveraenderte Original"]])));
  }

  // ── Fall 5e · DIE PASSUNG (R5 · T2) ───────────────────────────────────────
  //
  // Vier Faelle, und die zwei roten sind ABSICHTLICH verschieden: ein Blatt
  // kann sein Fenster auf zwei Arten verfehlen, und eine Bestellung, die beide
  // gleich benennt, bestellt die falsche Reparatur. »Zu gross gemalt« verlangt
  // ein neues Blatt in anderem Massstab; »sitzt verschoben« verlangt eine
  // Verschiebung. Der Modus muss sie deshalb mit VERSCHIEDENEN Worten trennen,
  // und genau darauf pruefen diese Faelle — nicht bloss auf rot.
  //
  // Das Fenster der Attrappe wird GEMESSEN und nicht gerechnet, und der
  // Unterschied ist genau der Grund: Bezug 120×180 zentriert in 200×250 ⇒
  // Versatz (40,35), Schreibflaeche (12,18) 90×120 ⇒ auf dem Papier
  // (52,53)–(141,172). Das Lineal findet aber (52,64)–(141,172) = 90×109,
  // weil `mkRef` die oberen elf Zeilen der Flaeche als GESICHT weiss malt und
  // Weiss aus jeder Farbregel herausfaellt (D-664). Die Attrappe traegt damit
  // dieselbe Eigenschaft wie der echte Bestand — und die Faelle stehen auf der
  // gemessenen Zahl, nicht auf der getippten.
  //  `dichte` ist der Modul des Zug-Rasters: 7 = jeder siebte Punkt (die
  //  Voreinstellung, mit der alle aelteren Faelle gebaut sind), 2 = jeder
  //  zweite. Seit R218 (Grenze 200) braucht die KRANKE Attrappe ein Vielfaches
  //  der alten Pixelzahl, sonst prueft ihr rotes Licht eine Grenze, die es
  //  nicht mehr gibt — das war der Fall: die zwei T3-Attrappen erzeugten 167
  //  und 162 px und waeren unter 200 stillschweigend gruen geworden.
  const mkPassungCell = (x0, y0, x1, y1, dichte = 7) => mkPng(W, H, (x, y) => {
    if (x < x0 || x > x1 || y < y0 || y > y1) return [255, 0, 255];
    if ((x * 3 + y * 5) % dichte !== 0) return [255, 0, 255];  // Luft zwischen den Zuegen
    return [235 + ((x + y) % 12), 232 + ((x * 3) % 12), 210 + ((y * 5) % 12)];
  });
  const runPassung = (png, ref = mkRef(), held = []) => overlayPassung([{
    name: "probe", png, ref, refName: "attrappe", cols: 1, rows: 1, cw: W, ch: H, held,
  }]);

  add("Passung: die Kreide sitzt im Fenster", null,
    () => runPassung(mkPassungCell(56, 68, 137, 168)));
  add("Passung · zu gross gemalt: das Blatt fuellt die ganze Zelle", "MASSSTABS-Bruch",
    () => runPassung(mkPassungCell(0, 0, W - 1, H - 1)));
  // Der Zwilling, der einem oberflaechlichen Blick gleich aussieht: KLEINER als
  // das Fenster und trotzdem draussen. Ein Lineal, das nur »Inhalt > Fenster«
  // fragt, laesst ihn durch — und genau dieser Fall ist am Bestand echt (die
  // drei zurueckgehaltenen Wisch-Zellen sitzen 25–26 px zu weit rechts).
  add("Passung · verschoben statt zu gross: 60×80 in einem Fenster von 90×109, 20 px draussen",
    "kein anderer Maßstab",
    () => runPassung(mkPassungCell(102, 70, 161, 149)));
  // Und die Ausnahme fuer zurueckgehaltene Zellen ist keine offene Tuer: DASSELBE
  // Blatt bleibt gruen, sobald `SHEETS` die Zelle als zurueckgehalten fuehrt —
  // und nur dann. Die Ausnahme haengt am Design-Flag, nicht am Zufall.
  add("Passung: dieselbe verschobene Zelle, aber als ZURUECKGEHALTEN gefuehrt", null,
    () => runPassung(mkPassungCell(102, 70, 161, 149), mkRef(), [0]));
  // TAMPER · das Lineal statt der Lieferung: ein Bezug ganz OHNE Schreibflaeche.
  // Er muss den BEZUG beschuldigen (D-654), sonst liest sich ein blindes Lineal
  // wie ein Lieferfehler.
  add("Passung · TAMPER: Bezug ohne Schreibflaeche beschuldigt den BEZUG", "keine Schreibflaeche messbar",
    () => runPassung(mkPassungCell(56, 68, 137, 168), mkPng(REFW, REFH, frameCol)));

  // ── Fall 5f · RAHMEN/LUFT gegen RAND-MALEREI (R5 · T3, D-683) ─────────────
  //
  // Die Registrierungs-Messung zaehlt ab T3 nur noch, was auf RAHMEN oder LUFT
  // liegt. Malerei auf dem Koerper innerhalb der Schiefer-Schachtel, die bloss
  // die FARBMASKE nicht als Schiefer erkennt, ist Rand-Malerei — gemeldet, aber
  // kein Abbruchgrund. Diese Faelle fahren die Trennung von beiden Seiten an,
  // und zwar mit DERSELBEN Kreide und Bezuegen, die sich in genau einer Sache
  // unterscheiden. Ein Paar, das nur den gruenen Fall zeigt, beweist nichts.
  //
  // ★ WARUM DER DUNKLE FLECK AM RAND DER FLAECHE LIEGEN MUSS UND NICHT MITTEN
  //   DRIN: `voll` fuellt zwischen den eigenen Raendern (D-664, das gemalte
  //   Gesicht). Ein Loch MITTEN in der Flaeche wird also gefuellt und zaehlt
  //   als Schiefer — die Attrappe waere leer gelaufen und der gruene Fall
  //   vacuously gruen. Am RAND greift die Fuellung nicht: die Zeilen-Spanne
  //   beginnt erst rechts vom Fleck. Genau so sitzt der dunkle Saum am echten
  //   Bestand, und genau dort liegt der Kranz.
  //
  // ★★ R5 · T4 · WARUM DER FLECK GEWACHSEN IST (D-693). Diese Attrappen waren
  //    fuer eine Grenze von 40 gebaut und erzeugten 167 bzw. 162 px auf
  //    Rahmen/Luft. Mit R218 (Grenze 200) waeren beide roten Faelle
  //    STILLSCHWEIGEND GRUEN geworden — der Selbsttest haette weiter »42 Faelle
  //    OK« gemeldet und dabei ein Gesetz geprueft, das es nicht mehr gibt. Eine
  //    Grenze zu bewegen heisst deshalb IMMER, ihre Attrappen mitzubewegen: sie
  //    stehen auf der ZAHL, nicht auf dem Wort.
  const FLX0 = 12, FLY0 = 40, FLX1 = 70, FLY1 = 130;        // im Bezug, am linken Rand der Flaeche
  const mkRefFleck = (loch) => {
    const p = mkRef();
    for (let y = FLY0; y <= FLY1; y++) for (let x = FLX0; x <= FLX1; x++) {
      const i = (y * REFW + x) * 4;
      if (loch) { p.data[i + 3] = 0; continue; }             // LUFT statt Schiefer
      p.data[i] = 30; p.data[i + 1] = 30; p.data[i + 2] = 35; // dunkel, faellt aus der Farbregel
    }
    return p;
  };
  const VX = Math.floor((W - REFW) / 2), VY = Math.floor((H - REFH) / 2);
  // Kreide NUR im Fleck, 6 px von dessen Rand eingerueckt ⇒ jedes Pixel liegt
  // mehr als die 3 px Toleranz von der Maske weg.
  const kreideImFleck = mkPassungCell(FLX0 + VX + 6, FLY0 + VY + 6, FLX1 + VX - 6, FLY1 + VY - 6, 2);
  const kreideAufRahmen = mkPassungCell(105 + VX, 20 + VY, 119 + VX, 160 + VY, 2);

  add("Rand-Malerei: Kreide auf dem Koerper, die die Farbmaske nicht als Schiefer erkennt", null,
    () => runPassung(kreideImFleck, mkRefFleck(false)));
  add("…und die Attrappe traegt die Eigenschaft wirklich (sonst ist der gruene Fall leer)", null,
    () => {
      const ref = mkRefFleck(false);
      const nb = overlayNeben(chromaKey(crop(kreideImFleck, 0, 0, W, H)), W, H, slateMaskOf(ref), VX, VY, ref);
      return { fail: nb.rand > OFF_MAX && nb.daneben === 0 ? [] : [`die Attrappe erzeugt ${nb.rand} px Rand-Malerei und ${nb.daneben} px Rahmen/Luft — noetig ist Rand > ${OFF_MAX} bei Rahmen/Luft = 0, sonst beweist der gruene Fall nichts`] };
    });
  add("TAMPER · dieselbe Kreide, aber unter ihr ist LUFT statt Schiefer", "RAHMEN oder LUFT",
    () => runPassung(kreideImFleck, mkRefFleck(true)));
  add("Kreide auf dem RAHMEN — die Klasse der drei echt verschobenen Wisch-Zellen", "RAHMEN oder LUFT",
    () => runPassung(kreideAufRahmen, mkRefFleck(false)));

  // ── Fall 5g · DIE BANDKANTEN DER GEEICHTEN GRENZE (R5 · T4, R218/D-692) ──
  //
  // Die Faelle darueber pruefen, WAS gezaehlt wird (Rahmen/Luft gegen
  // Rand-Malerei). Diese hier pruefen, WO die Grenze steht — und zwar von
  // beiden Seiten, mit GEZAEHLTEN Pixeln statt mit geschaetzten:
  //
  //     37 · 52   die zwei ehrlichen Bandkanten: 37 ist die schlimmste Zelle,
  //               die der Importeur heute schneidet (T3), 52 die schlimmste der
  //               Lieferung AQ13M. BEIDE lagen ueber der alten Grenze 40 —
  //               dieser Fall haelt fest, dass die Eichung genau das aufloest.
  //     200/201   die Grenze selbst. Ohne dieses Paar behauptet die Konstante
  //               nur, dass sie irgendwo steht.
  //     1208      die MILDESTE der drei echt verschobenen Wisch-Zellen. Waere
  //               die Grenze je wieder nach oben gewandert, faellt hier zuerst
  //               das Licht aus.
  //
  // ★ DIE ATTRAPPE IST GEBAUT WIE EINE ECHTE ZELLE, nicht wie eine Zahl: der
  //   grosse Teil ihrer Kreide liegt AUF der Schreibflaeche (und zaehlt deshalb
  //   gar nicht), und nur die genannte Zahl liegt im LUFT-Saum am linken Rand.
  //   Genau so sitzen die echten Zellen — AQ13M Zelle 0: 49 von 4146.
  const LKX0 = FLX0, LKX1 = FLX1 - 3, LKY0 = FLY0 + 3, LKY1 = FLY1 - 3;
  /** Genau `n` Kreidepunkte im Luft-Saum, dazu ein Rumpf AUF der Flaeche. Die
   *  Zahl wird GEZAEHLT und zurueckgegeben — eine Attrappe, deren Zahl man
   *  glauben muss, misst nichts. */
  const mkBandkante = (n) => {
    const luft = new Set();
    let k = 0;
    for (let y = LKY0; y <= LKY1 && k < n; y++) {
      for (let x = LKX0; x <= LKX1 && k < n; x++) {
        if ((x + y) % 2 !== 0) continue;
        luft.add((y + VY) * W + (x + VX)); k++;
      }
    }
    const rumpf = (x, y) => x >= 74 + VX && x <= 99 + VX && y >= 45 + VY && y <= 127 + VY && (x * 3 + y * 5) % 7 === 0;
    const png = mkPng(W, H, (x, y) => (luft.has(y * W + x) || rumpf(x, y))
      ? [235 + ((x + y) % 12), 232 + ((x * 3) % 12), 210 + ((y * 5) % 12)]
      : [255, 0, 255]);
    return { png, n: k };
  };
  const bandkante = (n) => runPassung(mkBandkante(n).png, mkRefFleck(true));

  add("Bandkante ehrlich: 37 px auf Luft — die schlimmste Zelle des BESTANDES", null,
    () => bandkante(37));
  add("Bandkante ehrlich: 52 px auf Luft — die schlimmste Zelle der Lieferung AQ13M", null,
    () => bandkante(52));
  add("Die Grenze selbst: GENAU 200 px auf Luft bleiben gruen", null,
    () => bandkante(200));
  add("Die Grenze selbst · ein Pixel darueber: 201 px auf Luft werden rot", "RAHMEN oder LUFT",
    () => bandkante(201));
  add("Bandkante krank: 1208 px auf Luft — die mildeste der drei verschobenen Wisch-Zellen", "RAHMEN oder LUFT",
    () => bandkante(1208));
  add("…und die vier Attrappen tragen ihre Zahlen wirklich (sonst misst das Paar nichts)", null,
    () => {
      const ref = mkRefFleck(true), slate = slateMaskOf(ref);
      const fail = [];
      for (const n of [37, 52, 200, 201, 1208]) {
        const b = mkBandkante(n);
        const nb = overlayNeben(chromaKey(crop(b.png, 0, 0, W, H)), W, H, slate, VX, VY, ref);
        if (b.n !== n) fail.push(`die Attrappe fuer ${n} px konnte nur ${b.n} px im Luft-Saum unterbringen — der Saum ist zu klein`);
        else if (nb.daneben !== n) fail.push(`die Attrappe fuer ${n} px misst ${nb.daneben} px auf Rahmen/Luft — die Bandkante steht dann woanders, als der Fall behauptet`);
        else if (nb.gemalt <= n) fail.push(`die Attrappe fuer ${n} px traegt nur ${nb.gemalt} px Kreide insgesamt — ohne Rumpf auf der Flaeche ist sie keine Zelle, sondern eine Zahl`);
      }
      return { fail };
    });

  // ── Fall 6 · DIE RESERVE ──────────────────────────────────────────────────
  add("Reserve: ein Pixel auf 179", "vom Schluessel", () => runTafel(mkCell(W, H, { face: 450, keyAt: 179 }), ["a"], 1, W, H));
  add("Reserve: knappstes Pixel auf 182", null, () => runTafel(mkCell(W, H, { face: 450, keyAt: 182 }), ["a"], 1, W, H));

  // ── DIE RING-ATTRAPPEN ────────────────────────────────────────────────────
  // Sie muessen ZYLINDRISCH GEMALT sein, nicht nur bunt. Die Gesetze (v)–(viii)
  // fragen: ist die Naht statistisch eine Spalte wie jede andere DIESES Blattes?
  // Eine Attrappe, deren drei Kanaele dieselbe Zahl tragen, faellt an (viii)
  // durch, ohne dass etwas mit ihr falsch waere — genau der Fehler, den die
  // Tafel-Attrappen 2026-08-19 schon einmal gekostet haben.
  //
  //   · je Kanal EINE stetige Welle, deren x-Frequenz ein ganzzahliges
  //     Vielfaches von 2π/W ist ⇒ das Blatt schliesst an seinem eigenen Rand,
  //     ohne dass irgendwo eine Naht gerechnet wuerde;
  //   · ein Korn, das nur jede vierte Spalte wechselt und dessen x-Periode die
  //     Breite teilt ⇒ es gibt aehnliche UND unaehnliche Nachbarpaare, also ein
  //     Fenster mit zwei verschiedenen Enden statt einer entarteten Zahl;
  //   · drei kanal-eigene Phasen ⇒ die Kanaele sind nicht dieselbe Zahl.
  const RW = 256, RH = 120, RHALF = RW / 2;
  /** Je Kanal ZWEI Wellen: eine grosse fuer den Verlauf, eine kleine schnelle
   *  fuer das Korn — beide mit ganzzahliger Ordnung, also beide zylindrisch.
   *  Warum stetig und nicht kariert: `seamOf` misst die Naht gegen das
   *  1,5-Fache des MITTLEREN Nachbarschritts des Blattes. Ein Blatt mit
   *  Plateaus hat drei ruhige Nachbarpaare je unruhigem, zieht sein eigenes
   *  Mittel nach unten — und faellt dann an der eigenen Grenze durch, obwohl
   *  nichts an ihm falsch ist. Ein gemaltes Blatt ist in dieser Hinsicht
   *  gleichmaessig, und die Attrappe muss es auch sein. */
  const ringCol = (x, y, W) => {
    const xx = (((x % W) + W) % W);
    const a = (2 * Math.PI * xx) / W;
    // Eine LANGSAME Welle je Kanal (die Malerei) und ein feines, kanal-eigenes
    // Korn (der Pinsel). Beide zylindrisch: die Welle hat ganzzahlige Ordnung,
    // das Korn eine x-Periode, die die Breite teilt.
    const welle = (amp, k, ph, yk) => amp * Math.sin(k * a + y * yk + ph);
    const korn = (c) => ((xx * 5 + y * (13 + 4 * c) + c * 7) % 8) - 4;
    return [
      Math.round(120 + welle(20, 1, 0, 0.11) + korn(0)),
      Math.round(102 + welle(17, 1, 1.3, 0.07) + korn(1)),
      Math.round(84 + welle(14, 1, 2.6, 0.13) + korn(2)),
    ];
  };
  /** `masche` benennt die Betrugsmasche, die dieses Blatt traegt — je eine der
   *  vier zurueckgewiesenen Ring-Lieferungen, hier synthetisch nachgebaut,
   *  damit sie in CI laufen kann (das Labor liegt auf keinem Bau-Rechner). */
  const mkStage = (masche) => mkPng(RW, RH, (x, y) => {
    if (masche === "luecke" && (x < 2 || x >= RW - 2 || (x >= RHALF - 2 && x < RHALF + 2))) return [255, 0, 255];
    // c3: die neun geprueften Nahtspalten sind gespiegelt — p[0…8] wird null,
    //     der Wrap bleibt ehrlich. Genau die Masche der AQ13c3-Lieferung.
    // Nur die RECHTE Seite wird an der Fuge gespiegelt: col(128+k) := col(127−k).
    // (Erste Fassung spiegelte beide Seiten — das ist ein Tausch, kein Spiegel,
    //  und tauscht man zwei verschiedene Spalten, bleiben sie verschieden.)
    if (masche === "spiegel" && x >= RHALF && x < RHALF + 9) return ringCol(2 * RHALF - 1 - x, y, RW);
    if (x !== RW - 1) return ringCol(x, y, RW);
    // ── die drei Maschen, die NUR die letzte Spalte betreffen ──────────────
    const c0 = ringCol(0, y, RW);
    if (masche === "kopie") return c0;                                  // c4
    if (masche === "lasur") { const s = [0, 2, 4][y % 3]; return c0.map((v) => Math.min(255, v + s)); } // c5
    if (masche === "jitter") {                                          // c6
      // KEINE Null in der Reihe: dieser Fall soll (v) und (vi) BESTEHEN und
      // erst an (vii)/(viii) fallen — mit Null-Zeilen fiele er schon an (v).
      const d = [6, -6, 8, -8, 10, -10, 6, -8, 10, -6][y % 10];
      return c0.map((v) => Math.max(0, Math.min(255, v + d)));
    }
    if (masche === "wrapbruch") return ringCol(x, y, RW).map((v) => Math.min(255, v + 60));
    return ringCol(x, y, RW);
  });
  /** Holzton H ≈ 39°, Helligkeit ueber den Faktor gesteuert — und ein
   *  kanal-eigenes Korn, damit auch das Band eine gemalte Schleife hat. */
  const mkBand = (hole, dunkel) => mkPng(RW, 40, (x, y) => {
    if (hole && x >= 150 && x < 170) return [255, 0, 255];
    const a = (2 * Math.PI * x) / RW;
    const welle = (ph, yk) => 3 * Math.sin(a + y * yk + ph);
    // ⚠ x-Vielfaches und Modul muessen teilerfremd sein, sonst faellt x aus der
    //   Rechnung heraus und das Blatt hat gar kein Korn (erste Fassung: x*5 % 5).
    const korn = (c) => ((x * 3 + y * (13 + 4 * c) + c * 7) % 4) - 2;
    const f = dunkel ? 1.0 : 1.30;
    return [
      Math.max(0, Math.round(47 * f + welle(0, 0.09) + korn(0))),
      Math.max(0, Math.round(36 * f + welle(1.1, 0.06) + korn(1))),
      Math.max(0, Math.round(15 * f + welle(2.2, 0.12) + korn(2))),
    ];
  });

  // ── Fall 7 · DIE UNGEMESSENE NAHT ─────────────────────────────────────────
  // Zwei Platten, deren einander zugewandte Spalten nicht bemalt sind: die
  // Formel liefert 0,0 — und 0,0 sieht wie eine perfekte Naht aus.
  add("Naht: null gemeinsame bemalte Pixel (0,0 ist ungemessen)", "UNGEMESSEN", () => abnahmeRing(mkStage("luecke"), mkBand(false, true)));
  add("Naht: Platten schliessen durch Malerei", null, () => abnahmeRing(mkStage(null), mkBand(false, true)));

  // ── Fall 8 · DAS LOCH IM BAND und DIE HELLIGKEIT ──────────────────────────
  add("Band: 20 Spalten ohne ein bemaltes Pixel", "ohne ein einziges bemaltes Pixel", () => abnahmeRing(mkStage(null), mkBand(true, true)));
  add("Band: zu hell (ueber 15,5 %)", "Helligkeit", () => abnahmeRing(mkStage(null), mkBand(false, false)));

  // ── Fall 9 · DER WRAP, DER NUR AN EINER KANTE BRICHT ──────────────────────
  add("Wrap b|a: die letzte Spalte springt heraus", "b|a", () => abnahmeRing(mkStage("wrapbruch"), mkBand(false, true)));

  // ── Fall 10–13 · DIE VIER MASCHEN DER RING-FAMILIE ────────────────────────
  // Jede Runde hat den Buchstaben des jeweils neuesten Tors getroffen. Die vier
  // Faelle stehen in der Reihenfolge, in der sie geliefert wurden, und jeder
  // besteht ALLES, was vor ihm gebaut wurde — deshalb sind die letzten beiden
  // die Tamper, die diese Bahn schuldet (P-82: der Tamper sitzt dort, wo
  // richtig und plausibel-falsch auseinandergehen).
  //
  // ⚠ EHRLICHE GRENZE, hier notiert statt im Report versteckt: an dieser
  //   Blattgroesse feuert bei der Lasur (vi) und bei der Kopie (v); an den
  //   ECHTEN Lieferungen feuern jeweils beide. Die synthetischen Faelle
  //   beweisen, dass jedes Gesetz sein rotes Licht erreicht — welche Gesetze
  //   an der echten Lieferung zusammen anschlagen, steht im Sitzungs-Report.
  add("c3-Masche: die neun geprueften Nahtspalten sind gespiegelt (Fuge 0,000 = Bestnote)",
    "das ganze Profil bis Tiefe", () => abnahmeRing(mkStage("spiegel"), mkBand(false, true)));
  add("c4-Masche: die Wrap-Spalte IST bytegenau die Spalte 0",
    "UEBER dem Fenster", () => abnahmeRing(mkStage("kopie"), mkBand(false, true)));
  // TAMPER 1 — besteht (ii) Profil, (iii) Spaltenprobe und (iv) Streuung.
  add("c5-Masche · TAMPER: einseitige Zwei-Stufen-Lasur — besteht Profil, Probe und Streuung",
    "negative gegen", () => abnahmeRing(mkStage("lasur"), mkBand(false, true)));
  // TAMPER 2 — besteht zusaetzlich (v) Adjazenz und (vi) Vorzeichen.
  add("c6-Masche · TAMPER: vorzeichen-balancierter, quantisierter Jitter — besteht auch Adjazenz und Vorzeichen",
    "kanal-uniform", () => abnahmeRing(mkStage("jitter"), mkBand(false, true)));

  // ── DIE RING-AUSNAHME DES NACHT-BANDES (T10) ──────────────────────────────
  // Die Attrappen sind die ECHTEN Befund-Zeilen beider Laeufe vom 31.08. —
  // abgeschrieben waeren sie wertlos, gemessen sind sie das Lineal.
  const PIN_A2 = "7694c48b11b4f5aea2d524e386bbc522ca4dafce7e73224cd283dfe6de8c9748";
  const A2_BEFUNDE = [
    "Band: 246 Spalte(n) ohne ein einziges bemaltes Pixel (erste x=0) — die Ringkante hat ein Loch",
    "Band-Schleife: null gemeinsame bemalte Pixel — UNGEMESSEN, nicht bestanden",
    "Band-Schleife: null gemeinsame bemalte Pixel — die Naht ist nicht bestanden, sondern UNGEMESSEN",
    "Band: Helligkeit 11.61 % ausserhalb 14–15.5 % — es tritt vor den Kampf statt hinter ihn",
    "Band: Holzton H-Median 180.00° ausserhalb 38–41° — nicht die Holzfarbe des Bestandes",
  ];
  // Ein Befund, den die Ausnahme NICHT nennt — er stammt aus dem Kontroll-Lauf
  // gegen den Bestand und muss an genau diesem Blatt trotzdem blockieren.
  const FREMD = "Band: 2 gemalte Pixel unter 180 Schluesselabstand (kleinster 177.37) — ein toleranter Schluessel frisst sie";
  const HEUTE = new Date("2026-08-31T12:00:00Z");
  add("Ring-Ausnahme: die fuenf gemessenen A2-Befunde sind gedeckt",
    null, () => ({ fail: ringBandUrteil(PIN_A2, A2_BEFUNDE, RING_BAND_AUSNAHMEN, HEUTE).offen }));
  // TAMPER 1 — der Pin sitzt auf den BYTES: ein anderes Blatt erbt nichts.
  add("Ring-Ausnahme · TAMPER: fremdes Blatt (Bestands-SHA) erbt die Ausnahme nicht",
    "Holzton H-Median", () => ({ fail: ringBandUrteil("45eae41f58e5fb5bbde0e0b34820ab56c3a5c2c45b31b52c62feace9a8851e4d", A2_BEFUNDE, RING_BAND_AUSNAHMEN, HEUTE).offen }));
  // TAMPER 2 — sie ist BENANNT, nicht pauschal: ein ungenannter Befund bleibt offen.
  add("Ring-Ausnahme · TAMPER: ein NICHT genannter Band-Befund blockiert weiter",
    "Schluesselabstand", () => ({ fail: ringBandUrteil(PIN_A2, [...A2_BEFUNDE, FREMD], RING_BAND_AUSNAHMEN, HEUTE).offen }));
  // TAMPER 3 — das Datum ist echt: nach Ablauf deckt sie nichts mehr.
  add("Ring-Ausnahme · TAMPER: abgelaufen (01.12.) deckt keinen einzigen Befund",
    "Helligkeit", () => ({ fail: ringBandUrteil(PIN_A2, A2_BEFUNDE, RING_BAND_AUSNAHMEN, new Date("2026-12-01T12:00:00Z")).offen }));

  let bad = 0;
  for (const c of cases) {
    let fails = [], err = null;
    try { fails = c.run().fail; } catch (e) { err = e; }
    const red = err !== null || fails.length > 0;
    let ok, note = "";
    if (err !== null) { ok = false; note = `Ausnahme: ${err.message}`; }
    else if (c.expect === null) { ok = !red; note = red ? fails[0] : ""; }
    else {
      const hit = fails.find((f) => f.includes(c.expect));
      ok = hit !== undefined;
      note = hit ?? (red ? `rot, aber aus einem anderen Grund: ${fails[0]}` : `blieb gruen — erwartet war »${c.expect}«`);
    }
    if (!ok) bad++;
    console.log(`  ${ok ? "✓" : "✗"} ${(c.expect === null ? "gruen" : "ROT").padEnd(5)} ${c.name}${note ? `\n        → ${note}` : ""}`);
  }
  if (bad > 0) {
    console.error(`\nimport-batch-aq13 --selftest: ${bad} Fall/Faelle nicht wie erwartet`);
    process.exit(1);
  }
  console.log(`\nimport-batch-aq13 --selftest: OK — ${cases.length} Faelle, je Paar richtig/plausibel-falsch,`);
  console.log("und jeder rote Fall mit dem Grund geprueft, den er treffen soll (ein Fall, der aus");
  console.log("dem falschen Grund rot wird, gilt hier als durchgefallen).");
  process.exit(0);
}

if (process.argv.includes("--selftest")) selftest();

if (process.argv.includes("--abnahme-tafel")) {
  const dir = process.argv[process.argv.indexOf("--abnahme-tafel") + 1];
  if (!dir) { console.error("usage: node docs/art/import-batch-aq13.mjs --abnahme-tafel <batch-verzeichnis>"); process.exit(2); }
  const entries = [];
  for (const nm of Object.keys(RECOLOUR_CELLS)) {
    const f = path.join(dir, `${nm}.png`);
    if (!fs.existsSync(f)) { console.error(`fehlt: ${f}`); process.exit(2); }
    entries.push({ name: nm, png: read(f) });
  }
  for (const nm of ["tafel_scribble", "tafel_wipe", "tafel_faces_scribbled"]) {
    const f = path.join(dir, `${nm}.png`);
    if (fs.existsSync(f)) entries.push({ name: nm, png: read(f), names: null, cols: 4, cw: 512, ch: 512 });
  }
  const bestandOf = (nm) => {
    const f = path.join(OUT, `tafel_${nm}.png`);
    return fs.existsSync(f) ? read(f) : null;
  };
  console.log(`\nTafel-Abnahme · ${path.basename(dir)}  (jede Zahl am Bestand oder am Blatt genommen, keine aus dem Lieferschein)`);
  const { lines, fail } = abnahmeTafel(entries, bestandOf);
  for (const l of lines) console.log(l);
  if (fail.length > 0) {
    console.log("");
    for (const f of fail) console.error(`  ✗ ${f}`);
    console.error(`\nTafel-Abnahme: ${fail.length} Befund(e) — diese Lieferung wird NICHT importiert (R132: ganz oder gar nicht)`);
    process.exit(1);
  }
  console.log("\nTafel-Abnahme: OK");
  process.exit(0);
}

if (process.argv.includes("--abnahme-ring")) {
  const dir = process.argv[process.argv.indexOf("--abnahme-ring") + 1];
  if (!dir) { console.error("usage: node docs/art/import-batch-aq13.mjs --abnahme-ring <batch-verzeichnis>"); process.exit(2); }
  const sf = path.join(dir, "l1_p4_stage.png"), bf = path.join(dir, "band_p4_audience.png");
  for (const f of [sf, bf]) if (!fs.existsSync(f)) { console.error(`fehlt: ${f}`); process.exit(2); }
  console.log(`\nRing-Abnahme · ${path.basename(dir)}  (Naht-Formel woertlich aus import-batch-as.mjs)`);
  const { lines, fail } = abnahmeRing(read(sf), read(bf));
  for (const l of lines) console.log(l);
  if (fail.length > 0) {
    console.log("");
    for (const f of fail) console.error(`  ✗ ${f}`);
    console.error(`\nRing-Abnahme: ${fail.length} Befund(e) — diese Lieferung wird NICHT importiert`);
    process.exit(1);
  }
  console.log("\nRing-Abnahme: OK");
  process.exit(0);
}

/* ── DER BAND-IMPORT (R5-W7 · H5 · R199) ─────────────────────────────────────
 *
 * `band_p4_audience` ist die Reihe leerer Schulbaenke HINTER dem Boss-Kampf.
 * Sie ersetzt einen BESTEHENDEN Stem — die Tot-Kunst-Zahl bewegt sich also
 * nicht (53 → 53).
 *
 * ★ WARUM DAS BAND ALLEIN FAEHRT. Die Lieferung AQ13c4 besteht aus zwei
 *   Blaettern, und nur EINES ist angenommen: die Buehne `l1_p4_stage.png`
 *   traegt eine Wrap-Spalte, die bytegenau die Spalte 0 ist (R199). Ein
 *   Import, der beide nimmt, waere bequem und falsch; einer, der wegen der
 *   Buehne auch das Band liegen laesst, waere ordentlich und teuer. Deshalb
 *   prueft dieser Zweig die RING-ABNAHME und verlangt, dass die BAND-Haelfte
 *   ohne Befund ist — die Buehnen-Befunde druckt er aus und benennt sie als
 *   den Grund, warum die Buehne hier nicht mitfaehrt.
 *
 * ★ DIE RAUHHEITS-RESERVE IST 0,00076. Der Wareneingang misst das Band bei
 *   0,29924 gegen die bestellte Obergrenze 0,30. Jede spaetere Aenderung an
 *   diesem Blatt ist also nachzumessen — auch die verlustfreie Nachverdichtung,
 *   von der man weiss, dass sie nichts aendert: eine Zahl, die man kennt, aber
 *   nicht misst, ist eine Behauptung. `--band-rauhheit <datei>` misst sie an
 *   jeder Datei, mit derselben Formel wie die Tafel-Abnahme.
 */
/* ── `--overlay-pins` (R5 · H6) ───────────────────────────────────────────────
 *
 * Die Maschine, die `OVERLAY_MASSE_FREI` erzeugt hat. Sie druckt je Zelle den
 * SHA-256 ueber die rohen RGB-Bytes UND den Anteil der haeufigsten Farbe — also
 * genau die zwei Zahlen, auf denen die Ausnahme steht.
 *
 * ★ WARUM DAS EIN MODUS IST UND KEIN EINMAL-SKRIPT: die Pins oben sind
 *   abgeschriebene Zahlen, sobald niemand sie mehr nachrechnen kann. Mit diesem
 *   Modus ist die Liste jederzeit gegen die Blaetter pruefbar — und die naechste
 *   Overlay-Lieferung braucht kein Werkzeug, das erst wieder erfunden wird.
 */
if (process.argv.includes("--overlay-pins")) {
  const dir = process.argv[process.argv.indexOf("--overlay-pins") + 1];
  if (!dir) { console.error("usage: node docs/art/import-batch-aq13.mjs --overlay-pins <batch-verzeichnis>"); process.exit(2); }
  let gefunden = 0;
  for (const nm of ["tafel_scribble", "tafel_wipe"]) {
    const f = path.join(dir, `${nm}.png`);
    if (!fs.existsSync(f)) continue;
    gefunden++;
    const png = read(f);
    const cw = 512, ch = 512;
    const cols = Math.round(png.width / cw), rows = Math.round(png.height / ch);
    const datei = crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
    console.log(`\n${nm}.png  ${png.width}×${png.height} → ${cols}×${rows} Zellen à ${cw}²  ·  Datei-sha256 ${datei.slice(0, 16)}…`);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const t = new Map();
      let p = 0;
      for (let y = r * ch; y < (r + 1) * ch; y++) for (let x = c * cw; x < (c + 1) * cw; x++) {
        if (!onAt(png, x, y)) continue;
        const j = (y * png.width + x) * 4;
        const k = (png.data[j] << 16) | (png.data[j + 1] << 8) | png.data[j + 2];
        t.set(k, (t.get(k) ?? 0) + 1);
        p++;
      }
      let top = 0, n = 0;
      for (const [k, v] of t) if (v > n) { n = v; top = k; }
      const sha = cellHash(png, c * cw, r * ch, cw, ch);
      const anteil = p === 0 ? 0 : n / p;
      const gepinnt = OVERLAY_MASSE_FREI.has(sha);
      console.log(
        `  Zelle ${i}: ${String(p).padStart(7)} px gemalt · haeufigster RGB (${top >> 16},${(top >> 8) & 255},${top & 255}) `
        + `${(anteil * 100).toFixed(2)} % · ${gepinnt ? "GEPINNT " : "frei    "} ${sha}`,
      );
    }
  }
  if (gefunden === 0) { console.error(`keine Overlay-Blaetter in ${dir}`); process.exit(2); }
  process.exit(0);
}

/* ── `--overlay-passung` (R5 · T2) ───────────────────────────────────────────
 *
 * Die Frage, die vor jedem Overlay-Import steht und bis heute niemand gestellt
 * hat: passt die gemalte Flaeche in das Fenster, auf das der Importeur sie
 * legt? Er nimmt ein Lieferverzeichnis, sucht darin die Overlay-Blaetter nach
 * ihrem Namen und misst sie gegen dasselbe Bezugs-Sprite wie der Import.
 *
 * Exit 0 = jede Zelle sitzt in ihrem Fenster. Exit 1 = mindestens eine nicht.
 */
if (process.argv.includes("--overlay-passung")) {
  const dir = process.argv[process.argv.indexOf("--overlay-passung") + 1];
  if (!dir) { console.error("usage: node docs/art/import-batch-aq13.mjs --overlay-passung <batch-verzeichnis>"); process.exit(2); }
  const entries = [];
  for (const sheet of SHEETS) {
    const f = path.join(dir, path.basename(sheet.file));
    if (!fs.existsSync(f)) continue;
    const refFile = path.join(OUT, `${sheet.ref}.png`);
    if (!fs.existsSync(refFile)) { console.error(`Bezugs-Sprite fehlt: ${refFile}`); process.exit(2); }
    entries.push({
      name: path.basename(sheet.file), png: read(f),
      ref: read(refFile), refName: sheet.ref,
      cols: sheet.cols, rows: sheet.rows, held: sheet.held ?? [],
    });
  }
  if (entries.length === 0) { console.error(`keine Overlay-Blaetter in ${dir}`); process.exit(2); }
  const { lines, fail } = overlayPassung(entries);
  for (const l of lines) console.log(l);
  console.log("");
  if (fail.length > 0) {
    for (const f of fail) console.error(`✗ ${f}`);
    console.error(`\n--overlay-passung: ${fail.length} Zelle(n) passen nicht in ihr Fenster.`);
    console.error("Der Modus urteilt NICHT ueber die Kunst — er misst die Passung. Was daraus folgt");
    console.error("(Beschnitt, Retusche-Bestellung oder Rueckweisung), entscheidet die Bahn mit dieser Zahl.");
    process.exit(1);
  }
  console.log("--overlay-passung: OK — jede Zelle sitzt in ihrem Fenster.");
  process.exit(0);
}

/* ── `--overlay-masse` (R5 · T5 · D-695) ─────────────────────────────────────
 *
 * Das Tor, das auf Strich-Overlays bisher STRUKTURELL nicht lief. Es nimmt ein
 * Lieferverzeichnis, sucht darin die Overlay-Blaetter nach ihrem Namen (genau
 * wie `--overlay-passung`) und misst je ZELLE die Massenfarbe.
 *
 * Exit 0 = jede Zelle unter der Grenze (oder mit ihren Bytes gepinnt).
 * Exit 1 = mindestens eine darueber. Exit 2 = nichts zu messen.
 */
if (process.argv.includes("--overlay-masse")) {
  const dir = process.argv[process.argv.indexOf("--overlay-masse") + 1];
  if (!dir) { console.error("usage: node docs/art/import-batch-aq13.mjs --overlay-masse <batch-verzeichnis>"); process.exit(2); }
  const entries = [];
  for (const sheet of SHEETS) {
    const f = path.join(dir, path.basename(sheet.file));
    if (!fs.existsSync(f)) continue;
    entries.push({ name: path.basename(sheet.file), png: read(f), cols: sheet.cols, rows: sheet.rows });
  }
  if (entries.length === 0) { console.error(`keine Overlay-Blaetter in ${dir}`); process.exit(2); }
  console.log(`\nOverlay-Massenfarbe · ${path.basename(dir)}  (je Zelle gemessen, Grenze `
    + `${(OVERLAY_MASSE_MAX * 100).toFixed(0)} % — geeicht ${(OVERLAY_MASSE_EHRLICH * 100).toFixed(2)} % ehrlich `
    + `| ${(OVERLAY_MASSE_MAX * 100).toFixed(0)} % | ${(OVERLAY_MASSE_KRANK * 100).toFixed(0)} % krank)`);
  const { lines, fail } = overlayMasse(entries);
  for (const l of lines) console.log(l);
  console.log("");
  if (fail.length > 0) {
    for (const f of fail) console.error(`✗ ${f}`);
    console.error(`\n--overlay-masse: ${fail.length} Zelle(n) ueber der Grenze.`);
    console.error("Der Modus urteilt NICHT ueber die Kunst — er misst die Massenfarbe. Was daraus folgt");
    console.error("(ein gepinnter Zell-SHA in OVERLAY_MASSE_FREI, eine Rueckweisung oder eine neue");
    console.error("Bestellung), entscheidet die Bahn mit dieser Zahl. ⚠ Und sie entscheidet es im Wissen,");
    console.error("dass der Anteil der haeufigsten Farbe Farbfeld und Strich-Malerei NICHT ueber den ganzen");
    console.error("Bereich trennt: die Ur-Generation batch-aq13 misst 47,89–75,34 % und ist erklaerte,");
    console.error("ehrliche Kreide (H6). Siehe die Herleitung an OVERLAY_MASSE_MAX.");
    process.exit(1);
  }
  console.log("--overlay-masse: OK — keine Zelle stellt zu viel von einer Farbe.");
  process.exit(0);
}

/* ── `--overlay-fundstellen` (R5 · T3) ───────────────────────────────────────
 *
 * ★ WARUM ES DIESEN MODUS GIBT. `--overlay-passung` (T2) misst den Inhalts-
 *   KASTEN gegen das Fenster und sagt SITZT/ÜBER DEM RAND. Der Importeur misst
 *   zusaetzlich etwas anderes: wie viele gemalte Pixel weiter als 3 px neben
 *   der Schreibflaechen-MASKE liegen (`offMask > 40` ⇒ Abbruch). Das Tor druckt
 *   diese Zahl zwar mit, urteilt aber nicht darueber — ein Blatt kann also das
 *   Eintrittstor mit Exit 0 nehmen und am Import trotzdem scheitern. Genau das
 *   ist AQ13L passiert (5 von 5 Zellen, 5,4–15,2 %).
 *
 *   Eine ZAHL sagt aber nicht, WAS sie bedeutet. Zwei voellig verschiedene
 *   Sachen erzeugen dieselbe Zahl:
 *     · Kreide, die am RAND ihrer eigenen Tafel liegt, waehrend die Farbmaske
 *       den helleren Rand des Schiefers nicht mehr als Schiefer erkennt
 *       (`slateMaskOf` verlangt r < 130) — ein Befund am LINEAL;
 *     · ein Blatt, das gegen ein ANDERES Sprite registriert ist — ein Befund an
 *       der LIEFERUNG.
 *   Der Unterschied ist messbar und wird hier gemessen, nicht geraten: fuer
 *   jedes Pixel neben der Maske sagt dieser Modus, WAS an dieser Stelle im
 *   Bezugs-Sprite steht (Schiefer-Schachtel? Rahmen? Luft?), wie weit es
 *   wirklich von der Maske weg ist, und wie sich die Fundstellen auf die vier
 *   Seiten verteilen. Rand-Malerei liegt ringsum; eine Fehlregistrierung liegt
 *   auf EINER Seite.
 *
 *   Er urteilt NICHT und faellt nie rot — er ist ein Messgeraet, kein Tor.
 */
if (process.argv.includes("--overlay-fundstellen")) {
  const dir = process.argv[process.argv.indexOf("--overlay-fundstellen") + 1];
  if (!dir) { console.error("usage: node docs/art/import-batch-aq13.mjs --overlay-fundstellen <batch-verzeichnis>"); process.exit(2); }
  let blaetter = 0;
  for (const sheet of SHEETS) {
    const f = path.join(dir, path.basename(sheet.file));
    if (!fs.existsSync(f)) continue;
    blaetter++;
    const png = read(f);
    const ref = read(path.join(OUT, `${sheet.ref}.png`));
    const slate = slateMaskOf(ref);
    const cols = sheet.cols, rows = sheet.rows;
    const cw = Math.round(png.width / cols), ch = Math.round(png.height / rows);
    const offX = Math.floor((cw - ref.width) / 2), offY = Math.floor((ch - ref.height) / 2);
    const held = new Set(sheet.held ?? []);
    const B = slate.box;

    console.log(`\n${path.basename(sheet.file)}  ${png.width}×${png.height} → ${cols}×${rows} à ${cw}×${ch}  ·  Bezug ${sheet.ref}`);
    console.log(`  Schiefer-Maske: ${slate.n} px roh → ${slate.nVoll} px gefuellt · Schachtel (${B.x0},${B.y0})–(${B.x1},${B.y1}) · Leitfarbton ${slate.peak}°`);

    for (let i = 0; i < cols * rows; i++) {
      const cell = chromaKey(crop(png, (i % cols) * cw, Math.floor(i / cols) * ch, cw, ch));
      let gemalt = 0;
      // Klassen: A = in der Schiefer-Schachtel (Rand-Malerei), B = auf dem
      // Koerper ausserhalb der Schachtel (Rahmen), C = auf Luft.
      let inBox = 0, aufRahmen = 0, aufLuft = 0;
      const seite = { links: 0, rechts: 0, oben: 0, unten: 0, innen: 0 };
      const distHist = new Map();
      let refHell = 0, refN = 0;
      const hellHist = new Map();
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        if (cell.data[(y * cw + x) * 4 + 3] <= 8) continue;
        gemalt++;
        const rx = x - offX, ry = y - offY;
        const drin = rx >= 0 && ry >= 0 && rx < slate.W && ry < slate.H;
        if (drin && nearMask(slate, rx, ry, 3, "voll")) continue;

        // WAS steht an dieser Stelle im Bezugs-Sprite?
        const a = drin ? ref.data[(ry * ref.width + rx) * 4 + 3] : 0;
        if (!drin || a <= 8) aufLuft++;
        else if (rx >= B.x0 && rx <= B.x1 && ry >= B.y0 && ry <= B.y1) {
          inBox++;
          const j = (ry * ref.width + rx) * 4;
          const L = lum(ref.data[j], ref.data[j + 1], ref.data[j + 2]);
          refHell += L; refN++;
          const b = Math.min(240, Math.floor(L / 40) * 40);
          hellHist.set(b, (hellHist.get(b) ?? 0) + 1);
        } else aufRahmen++;

        // Wie weit WIRKLICH von der gefuellten Maske weg? (Deckel 32 px.)
        let d = -1;
        for (let t = 4; t <= 32 && d < 0; t++) if (drin && nearMask(slate, rx, ry, t, "voll")) d = t;
        const k = d < 0 ? ">32" : String(d);
        distHist.set(k, (distHist.get(k) ?? 0) + 1);

        // Auf welcher Seite der Schachtel? (»innen« = innerhalb, also Loch.)
        if (rx < B.x0) seite.links++;
        else if (rx > B.x1) seite.rechts++;
        else if (ry < B.y0) seite.oben++;
        else if (ry > B.y1) seite.unten++;
        else seite.innen++;
      }
      const neben = inBox + aufRahmen + aufLuft;
      const dh = [...distHist.entries()].sort((a, b) => (a[0] === ">32" ? 99 : +a[0]) - (b[0] === ">32" ? 99 : +b[0]));
      console.log(
        `  Zelle ${i}${held.has(i) ? " [ZURÜCKGEHALTEN]" : "               "}: ${String(gemalt).padStart(6)} px gemalt · `
        + `${String(neben).padStart(5)} px neben der Maske (${gemalt === 0 ? "—" : (100 * neben / gemalt).toFixed(2)} %)`,
      );
      if (neben === 0) continue;
      console.log(`      wo: in der Schiefer-Schachtel ${inBox} · auf dem Rahmen ${aufRahmen} · auf Luft ${aufLuft}`
        + (refN > 0 ? ` · mittlere Helligkeit des Bezugs dort ${(refHell / refN).toFixed(1)} (Maske verlangt r < 130)` : ""));
      console.log(`      Seite der Schachtel: links ${seite.links} · rechts ${seite.rechts} · oben ${seite.oben} · unten ${seite.unten} · innen ${seite.innen}`);
      console.log(`      echter Abstand zur Maske: ${dh.map(([d, n]) => `${d}px×${n}`).join(" · ")}`);
      if (hellHist.size > 0) {
        const hh = [...hellHist.entries()].sort((a, b) => a[0] - b[0]);
        console.log(`      Helligkeit des Bezugs an den Fundstellen IN der Schachtel: ${hh.map(([b, n]) => `${b}–${b + 39}×${n}`).join(" · ")}`);
      }
    }
  }
  if (blaetter === 0) { console.error(`keine Overlay-Blaetter in ${dir}`); process.exit(2); }
  console.log("\n--overlay-fundstellen: Messung, kein Urteil. Rand-Malerei liegt RINGSUM und dicht an der Maske;");
  console.log("eine Fehlregistrierung liegt auf EINER Seite und weit weg.");
  process.exit(0);
}

if (process.argv.includes("--band-rauhheit")) {
  const f = process.argv[process.argv.indexOf("--band-rauhheit") + 1];
  if (!f || !fs.existsSync(f)) { console.error("usage: node docs/art/import-batch-aq13.mjs --band-rauhheit <datei.png>"); process.exit(2); }
  const png = read(f);
  const box = { x0: 0, y0: 0, x1: png.width - 1, y1: png.height - 1 };
  const rough = roughnessOf(png, box, () => true);
  const tex = textureOf(png, box);
  let n = 0;
  for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) if (onAt(png, x, y)) n++;
  console.log(`${path.basename(f)}  ${png.width}×${png.height}  ${n} px gemalt`);
  console.log(`  Rauhheit ${rough.toFixed(5)}   Nachbarschritt ${tex.toFixed(5)}`);
  process.exit(0);
}

/* ── `--reserve` (R5 · T1) ───────────────────────────────────────────────────
 *
 * D-657 hat einen Befund gemeldet, den nie jemand gemessen hatte: die alten
 * Kreide-Overlays halten die Schluessel-Reserve nicht. Ein Befund, dessen Zahl
 * nur in einem Report steht, ist beim naechsten Mal wieder ungemessen — also
 * bekommt er einen BEFEHL. Er urteilt nicht (die Blaetter liegen laengst im
 * Bestand und werden von nichts mehr gekeyt), er druckt die Zahl.
 *
 * Regel 6 der Tafel-Abnahme, woertlich: kein gemaltes Pixel naeher als 180 am
 * Schluessel (euklidisch gegen 255,0,255). Der Grund ist keine Aesthetik: ein
 * toleranter Schluessel frisst genau diese Pixel weg.
 */
if (process.argv.includes("--reserve")) {
  const i0 = process.argv.indexOf("--reserve");
  const stems = process.argv.slice(i0 + 1).filter((a) => !a.startsWith("--"));
  if (stems.length === 0) {
    console.error("usage: node docs/art/import-batch-aq13.mjs --reserve <stem> [<stem> …]");
    process.exit(2);
  }
  console.log(`\nSchluessel-Reserve (Regel 6: kein gemaltes Pixel unter ${KEY_MIN} vom Schluessel)`);
  console.log("Stem                 gemalt   kleinster   unter 180   unter 150   haeufigster Abstand");
  let unterhalb = 0;
  for (const s of stems) {
    const f = path.join(OUT, `${s}.png`);
    if (!fs.existsSync(f)) { console.error(`  fehlt: ${s}.png`); process.exit(2); }
    const p = read(f);
    let min = Infinity, u180 = 0, u150 = 0, gemalt = 0;
    const hist = new Map();
    for (let i = 0; i < p.data.length; i += 4) {
      if (p.data[i + 3] <= 8) continue;
      gemalt++;
      const d = Math.hypot(p.data[i] - 255, p.data[i + 1], p.data[i + 2] - 255);
      if (d < min) min = d;
      if (d < KEY_MIN) u180++;
      if (d < 150) u150++;
      const b = Math.round(d);
      hist.set(b, (hist.get(b) ?? 0) + 1);
    }
    let topD = null, topN = 0;
    for (const [d, n] of hist) if (n > topN) { topN = n; topD = d; }
    if (u180 > 0) unterhalb++;
    console.log(
      `${s.padEnd(20)} ${String(gemalt).padStart(7)}   ${min.toFixed(2).padStart(9)}   `
      + `${String(u180).padStart(9)}   ${String(u150).padStart(9)}   ${topD} (${topN} px)`
      + (u180 > 0 ? "   ← unter der Reserve" : ""),
    );
  }
  console.log(`\n${unterhalb} von ${stems.length} Blatt/Blaettern tragen Malerei unter der Reserve.`);
  console.log("Kein Urteil: diese Blaetter liegen im Bestand und werden von nichts mehr gekeyt.");
  console.log("Die Zahl gehoert an die naechste Bestellung fuer eben diese Blaetter (D-657).");
  process.exit(0);
}

/* ── `--import-buehne` (R5 · T1) ─────────────────────────────────────────────
 *
 * DAS ACHTE BLATT. Die Ring-Familie hat sieben Runden gebraucht (R203); der
 * Wareneingang vom 23.08. nimmt AQ13C7 an: alle acht Naht-Gesetze gemessen,
 * Streuung 5,0–5,6 »erstmals in der Liga der ehrlichen a|b-Naht«. Bis heute las
 * der Ring-Zweig die Buehne nur fuer die ABNAHME und schrieb sie nie — ein
 * Buehnen-Befund wurde als »faehrt NICHT mit (R199)« deklariert. Diese Klausel
 * wird jetzt eingeloest.
 *
 * ★ WAS DIE BUEHNE IST, nachgemessen und nicht angenommen: `l1_p4_stage.png`
 *   misst 2048×1260, die zwei Bestands-Segmente `l1_p4_a`/`l1_p4_b` je
 *   1024×1260. Die Buehne ist also das WANDPAAR DER ARENA als EIN
 *   durchgemaltes Blatt — genau darum misst die Lieferung ihre Naht zweimal,
 *   »Buehne a|b« (die Fuge in der Mitte) und »Buehne b|a« (die Schleife ueber
 *   die Aussenkanten). `composition.ts#shell` verdrahtet die zwei Segmente
 *   bereits (`segments: [l1_<phase>_a, l1_<phase>_b]`).
 *
 * ⇒ Dieser Zweig ERSETZT zwei bestehende Stems und legt keinen an: kein
 *   `artScope`-Eintrag, keine Zeile in `composition.ts`, DEAD_ART unveraendert.
 *
 * ★ UND ER FASST DAS BAND NICHT AN. Die Lehre steht als D-658 im Register:
 *   ein Zweig, der ein Blatt neu baut, das nur bestaetigt werden sollte,
 *   verwirft dessen Nachbehandlung stillschweigend. Der Bestands-Band traegt
 *   heute den RGB-Hash `45eae41f…`, die Lieferung `ce96a06c…` — sie sind NICHT
 *   dasselbe Blatt, und welches recht hat, ist keine Frage dieser Bahn. Das
 *   Band wird deshalb nur GEMESSEN (die Abnahme braucht es fuer die
 *   Schleifen-Naht) und nie geschrieben.
 */
if (process.argv.includes("--import-buehne")) {
  const dir = process.argv[process.argv.indexOf("--import-buehne") + 1];
  if (!dir) { console.error("usage: node docs/art/import-batch-aq13.mjs --import-buehne <batch-verzeichnis> [--dry]"); process.exit(2); }
  const sf = path.join(dir, "l1_p4_stage.png"), bf = path.join(dir, "band_p4_audience.png");
  for (const f of [sf, bf]) if (!fs.existsSync(f)) { console.error(`fehlt: ${f}`); process.exit(2); }

  console.log(`\nBuehnen-Import · ${path.basename(dir)} — zuerst die Ring-Abnahme, dann erst ein Pixel`);
  const { lines, fail } = abnahmeRing(read(sf), read(bf));
  for (const l of lines) console.log(l);
  const buehneFail = fail.filter((f) => !f.startsWith("Band"));
  console.log("");
  if (buehneFail.length > 0) {
    for (const f of buehneFail) console.error(`  ✗ ${f}`);
    console.error(`\nBuehnen-Import: ${buehneFail.length} Befund(e) AN DER BUEHNE — es wird nichts geschrieben`);
    process.exit(1);
  }
  const bandFail = fail.filter((f) => f.startsWith("Band"));
  if (bandFail.length > 0) {
    console.log(`  ⚠ DEKLARIERT: das Band dieser Lieferung hat ${bandFail.length} Befund(e). Es wird ohnehin NICHT`);
    console.log(`      geschrieben (D-658); die Zahlen stehen hier, damit sie nicht verschwiegen sind:`);
    for (const f of bandFail) console.log(`      · ${f}`);
    console.log("");
  }

  // ── die zwei Haelften ────────────────────────────────────────────────────
  const stage = read(sf);
  const haelften = [
    { stem: "l1_p4_a", x: 0 },
    { stem: "l1_p4_b", x: stage.width / 2 },
  ];
  if (!Number.isInteger(stage.width / 2)) {
    console.error(`l1_p4_stage: ${stage.width} px Breite laesst sich nicht halbieren`);
    process.exit(1);
  }
  const geschrieben = [];
  for (const h of haelften) {
    const dest = path.join(OUT, `${h.stem}.png`);
    if (!fs.existsSync(dest)) {
      console.error(`${h.stem}: es gibt keinen Bestands-Stem dieses Namens — dieser Zweig ERSETZT, er legt nicht an`);
      process.exit(2);
    }
    const alt = read(dest);
    const out = chromaKey(crop(stage, h.x, 0, stage.width / 2, stage.height));
    if (out.width !== alt.width || out.height !== alt.height) {
      console.error(`${h.stem}: ${out.width}×${out.height} gegen den Bestand ${alt.width}×${alt.height} — ein Ersatz hat die Masse seines Vorgaengers`);
      process.exit(1);
    }
    const killed = defringe(out);
    const dist = keyDistance(out);
    if (dist < 150) {
      console.error(`${h.stem}: ein gemaltes Pixel sitzt ${dist.toFixed(2)} vom Schluessel — ein toleranter Schluessel frisst es`);
      process.exit(1);
    }
    const zaehle = (p) => { let n = 0; for (let i = 3; i < p.data.length; i += 4) if (p.data[i] > 8) n++; return n; };
    const box = { x0: 0, y0: 0, x1: out.width - 1, y1: out.height - 1 };
    geschrieben.push(
      `${h.stem}.png`.padEnd(16)
      + `${out.width}×${out.height}`.padEnd(12)
      + `Bestand ${zaehle(alt)} px / Rauhheit ${roughnessOf(alt, box, () => true).toFixed(5)}`.padEnd(44)
      + `Neu ${zaehle(out)} px / Rauhheit ${roughnessOf(out, box, () => true).toFixed(5)}`.padEnd(40)
      + `${killed} px Saum · Schluessel-Abstand ${dist.toFixed(2)}`,
    );
    if (!DRY) fs.writeFileSync(dest, PNG.sync.write(out));
  }
  for (const g of geschrieben) console.log(`  ${DRY ? "[dry] " : ""}${g}`);
  console.log(`\n${DRY ? "[dry] " : ""}Buehnen-Import: OK — zwei bestehende Stems ersetzt (l1_p4_a, l1_p4_b), DEAD_ART unveraendert`);
  console.log("  Das Band ist NICHT angefasst worden (D-658).");
  console.log("Naechster Schritt (D-98): node scripts/art-recompress.mjs && node scripts/check-png-identity.mjs");
  process.exit(0);
}

if (process.argv.includes("--import-band")) {
  const dir = process.argv[process.argv.indexOf("--import-band") + 1];
  if (!dir) { console.error("usage: node docs/art/import-batch-aq13.mjs --import-band <batch-verzeichnis> [--dry]"); process.exit(2); }
  const sf = path.join(dir, "l1_p4_stage.png"), bf = path.join(dir, "band_p4_audience.png");
  for (const f of [sf, bf]) if (!fs.existsSync(f)) { console.error(`fehlt: ${f}`); process.exit(2); }

  console.log(`\nBand-Import · ${path.basename(dir)} — zuerst die Ring-Abnahme, dann erst ein Pixel`);
  const bandRoh = read(bf);
  const bandPin = blattHash(bandRoh);
  const { lines, fail } = abnahmeRing(read(sf), bandRoh);
  for (const l of lines) console.log(l);
  const bandRohFail = fail.filter((f) => f.startsWith("Band"));
  const buehneFail = fail.filter((f) => !f.startsWith("Band"));
  const urteil = ringBandUrteil(bandPin, bandRohFail);
  const bandFail = urteil.offen;
  console.log("");
  if (urteil.abgelaufen === true) {
    console.error(`  ✗ Die Ring-Ausnahme dieses Blattes ist am ${urteil.ausnahme.until} abgelaufen — nachmessen und neu begruenden oder fallen lassen.`);
  }
  if (urteil.gedeckt.length > 0) {
    console.log(`  ⚠ DEKLARIERT: ${urteil.gedeckt.length} Band-Befund(e) deckt die benannte Ring-Ausnahme (bis ${urteil.ausnahme.until}).`);
    console.log(`      Pin ${bandPin.slice(0, 16)}… — ${urteil.ausnahme.herkunft}`);
    console.log("      Grund: die drei Band-Lineale haengen an der ERSETZTEN Lieferung; der angenommene");
    console.log("      Bestand faellt an denselben Struktur-Regeln mit schlechteren Werten durch (342 gegen 246).");
    for (const f of urteil.gedeckt) console.log(`      · ${f}`);
    console.log("");
  }
  if (bandFail.length > 0) {
    for (const f of bandFail) console.error(`  ✗ ${f}`);
    console.error(`\nBand-Import: ${bandFail.length} Befund(e) AM BAND — es wird nichts geschrieben`);
    process.exit(1);
  }
  if (buehneFail.length > 0) {
    console.log(`  ⚠ DEKLARIERT: die Buehne dieser Lieferung hat ${buehneFail.length} Befund(e) und faehrt NICHT mit (R199).`);
    for (const f of buehneFail) console.log(`      · ${f}`);
    console.log("");
  }

  // Das Blatt kommt UNGEKEYT (RGB, Magenta als Freistell-Farbe); der Bestand
  // liegt gekeyt. Also derselbe Weg wie im Tafel-Zweig: Schluessel, Saum, und
  // erst danach schreiben.
  const stem = "band_p4_audience";
  const dest = path.join(OUT, `${stem}.png`);
  if (!fs.existsSync(dest)) { console.error(`${stem}: es gibt keinen Bestands-Stem dieses Namens — dieser Zweig ERSETZT, er legt nicht an`); process.exit(2); }
  const alt = read(dest);
  const out = chromaKey(read(bf));
  if (out.width !== alt.width || out.height !== alt.height) {
    console.error(`${stem}: ${out.width}×${out.height} gegen den Bestand ${alt.width}×${alt.height} — ein Ersatz hat die Masse seines Vorgaengers`);
    process.exit(1);
  }
  const killed = defringe(out);
  const dist = keyDistance(out);
  if (dist < 150) { console.error(`${stem}: ein gemaltes Pixel sitzt ${dist.toFixed(2)} vom Schluessel — ein toleranter Schluessel frisst es`); process.exit(1); }

  const zaehle = (p) => { let n = 0; for (let i = 3; i < p.data.length; i += 4) if (p.data[i] > 8) n++; return n; };
  const box = { x0: 0, y0: 0, x1: out.width - 1, y1: out.height - 1 };
  console.log(`  Bestand : ${zaehle(alt)} px gemalt · Rauhheit ${roughnessOf(alt, box, () => true).toFixed(5)}`);
  console.log(`  Neu     : ${zaehle(out)} px gemalt · Rauhheit ${roughnessOf(out, box, () => true).toFixed(5)} · ${killed} px Saum entfernt · Schluessel-Abstand ${dist.toFixed(2)}`);
  if (!DRY) fs.writeFileSync(dest, PNG.sync.write(out));
  console.log(`\n${DRY ? "[dry] " : ""}Band-Import: OK — ${stem}.png (ein bestehender Stem ersetzt, DEAD_ART unveraendert)`);
  console.log("Naechster Schritt (D-98): node scripts/art-recompress.mjs && node scripts/check-png-identity.mjs");
  console.log("Danach die Rauhheit NEU messen: node docs/art/import-batch-aq13.mjs --band-rauhheit apps/web/public/art/g1/paint/ch01/band_p4_audience.png");
  process.exit(0);
}

/* ── `--import-l2` · DIE HINTERE MOEBELREIHE (R5 · T10, 2026-08-31) ──────────
 *
 * WARUM ES DIESEN ZWEIG GIBT. `l2_p4` hatte bis heute keinen schmalen Weg ins
 * Spiel: der einzige Importeur, der das Stem kennt, ist `import-batch-ap.mjs`,
 * und der schreibt die halbe AP-Charge neu UND traegt ein `darken: 0.97`, das
 * fuer die HELLE Fassung bei K=28 gerechnet wurde (»MEASURED at first import:
 * 21.3 % gegen das Fenster [14.0–21.0]«). Auf eine angenommene Nacht-Lieferung
 * angewandt waere das ein stiller Wertepass ueber gemessene Malerei — genau die
 * Falle, gegen die `WARENEINGANGS_PINS` in `set-plane-value.mjs` geschrieben ist.
 *
 * WARUM HIER KEINE RING-ABNAHME LAEUFT, und das keine Auslassung ist. Die
 * Ring-Gesetze messen ein PAAR: die Buehne gegen das Band, das davor steht.
 * `l2_p4` hat keinen Buehnen-Partner — es ist die GEISTERHAFTE Reihe HINTER der
 * vorderen (`midFar`, Alpha 0,62), und ihr Wert wird von dem Gesetz gerichtet,
 * das wirklich fuer sie zustaendig ist: der Mitteldistanz-Audit in
 * `check-composition.mjs` (§8) verlangt, dass sie GERENDERT zwischen der fernen
 * Wand und der vorderen Reihe sitzt, mindestens 0,04·K von beiden entfernt.
 * Dieser Zweig faehrt darum die stem-unabhaengigen Byte-Gesetze, und das Urteil
 * ueber den WERT faellt das Kompositions-Tor — nicht ein zweites, hier
 * nachgebautes Lineal.
 */
if (process.argv.includes("--import-l2")) {
  const dir = process.argv[process.argv.indexOf("--import-l2") + 1];
  if (!dir) { console.error("usage: node docs/art/import-batch-aq13.mjs --import-l2 <batch-verzeichnis> [--dry]"); process.exit(2); }
  const stem = "l2_p4";
  const qf = path.join(dir, `${stem}.png`);
  if (!fs.existsSync(qf)) { console.error(`fehlt: ${qf}`); process.exit(2); }
  const dest = path.join(OUT, `${stem}.png`);
  if (!fs.existsSync(dest)) { console.error(`${stem}: es gibt keinen Bestands-Stem dieses Namens — dieser Zweig ERSETZT, er legt nicht an`); process.exit(2); }

  console.log(`\nL2-Import · ${path.basename(dir)} — die hintere Moebelreihe (${stem})`);
  const roh = read(qf);
  const pin = blattHash(roh);
  console.log(`  Lieferung: sha256 (RGB-Rohbytes) ${pin.slice(0, 16)}…`);
  const gesperrt = SPERR_BUEHNEN.get(pin);
  if (gesperrt !== undefined) { console.error(`  ✗ dieses Blatt ist schon zurueckgewiesen — ${gesperrt}`); process.exit(1); }

  const alt = read(dest);
  const out = chromaKey(read(qf));
  if (out.width !== alt.width || out.height !== alt.height) {
    console.error(`${stem}: ${out.width}×${out.height} gegen den Bestand ${alt.width}×${alt.height} — ein Ersatz hat die Masse seines Vorgaengers`);
    process.exit(1);
  }
  const killed = defringe(out);
  const dist = keyDistance(out);
  if (dist < KEY_MIN) { console.error(`${stem}: ein gemaltes Pixel sitzt ${dist.toFixed(2)} vom Schluessel — ein toleranter Schluessel frisst es`); process.exit(1); }

  const zaehle = (p) => { let n = 0; for (let i = 3; i < p.data.length; i += 4) if (p.data[i] > 8) n++; return n; };
  const box = { x0: 0, y0: 0, x1: out.width - 1, y1: out.height - 1 };
  console.log(`  Bestand : ${zaehle(alt)} px gemalt · Rauhheit ${roughnessOf(alt, box, () => true).toFixed(5)}`);
  console.log(`  Neu     : ${zaehle(out)} px gemalt · Rauhheit ${roughnessOf(out, box, () => true).toFixed(5)} · ${killed} px Saum entfernt · Schluessel-Abstand ${dist.toFixed(2)}`);
  if (!DRY) fs.writeFileSync(dest, PNG.sync.write(out));
  console.log(`\n${DRY ? "[dry] " : ""}L2-Import: OK — ${stem}.png (ein bestehender Stem ersetzt, DEAD_ART unveraendert)`);
  console.log("Naechster Schritt (D-98): node scripts/art-recompress.mjs && node scripts/check-png-identity.mjs");
  console.log("Das WERT-Urteil faellt danach das Kompositions-Tor: node scripts/check-composition.mjs (Audit 8)");
  process.exit(0);
}

const failures = [];
const written = [];
const notes = [];

notes.push("· Blatt 3 (`tafel_faces_scribbled`) ist NICHT Teil dieses Imports — blinder Prüfer: ZURÜCKGEWIESEN, 0 von 4 Porträts auf dem Körper des Kartenmoments (Kopf dieser Datei).");

/* ── `--nur-koerper` (R5 · H6) ────────────────────────────────────────────────
 *
 * Der H6-Auftrag sagt fuer die zwei Kreide-Overlays woertlich: »bestaetigen,
 * nicht neu bauen«. Sie sind der bytegleiche Durchreich aus `batch-aq13/`, seit
 * AQ13b angenommen und im Spiel. Dieser Schalter laesst sie deshalb in Ruhe und
 * importiert NUR die zwanzig Koerper-Stems aus AQ13B4.
 *
 * ★ ER IST NICHT BEQUEMLICHKEIT, ER SCHLIESST ZWEI LOECHER, beide gemessen:
 *   1 · OHNE ihn laufen die Overlays durch `defringe` und kommen mit Saum
 *       wieder heraus: `check-paint-art` meldete danach 424 Schluesselpixel auf
 *       `tafel_clean`, 180 auf `tafel_scribble2`, 50 auf `tafel_scribble1` —
 *       die Blaetter im Bestand sind die NACHTRAEGLICH mit
 *       `strip-key-fringe.mjs` geheilten Fassungen, und ein Neubau verwirft
 *       diese Heilung stillschweigend. (`tafel_scribble3`/`3b` kamen bytegleich
 *       heraus: sie hatten nie Saum. Der Unterschied war also unsichtbar, bis
 *       ihn ein Tor gezaehlt hat.)
 *   2 · Der Overlay-Zweig rechnet sein Fenster aus `slateMaskOf(tafel_a)`. Nach
 *       dem Koerper-Import ist `tafel_a` nachtblau, die gruene Maske findet
 *       nichts — ein zweiter Lauf desselben Befehls faellt also mit fuenf
 *       Befunden, die wie ein Lieferfehler aussehen und keiner sind (siehe den
 *       Befund im Kopf von `slateMaskOf`). Mit `--nur-koerper` ist der Lauf
 *       wiederholbar.
 *
 * Was er NICHT tut, ist die Bestaetigung ueberspringen: die zwei Quell-sha256
 * werden gegen die Wareneingangs-Pins geprueft und gedruckt.
 */
const NUR_KOERPER = process.argv.includes("--nur-koerper");

/* ── `--nur-overlay` (R5 · T3) ────────────────────────────────────────────────
 *
 * Der Spiegel von `--nur-koerper`, und er schliesst dasselbe Loch von der
 * anderen Seite. GEMESSEN in dieser Bahn: ein voller Lauf schreibt auch die
 * zwanzig Koerper-Stems neu, und sie kommen NICHT bildpunktgleich wieder
 * heraus — 3 bis 6 Byte je Blatt, also ein bis zwei Pixel, bei IoU 1,0000 und
 * »0 px Saum entfernt«. Woher die Punkte kommen, ist hier nicht entschieden
 * (Befund an den Architekten); entschieden ist, dass eine Overlay-Bahn sie
 * nicht anfassen darf. Ohne diesen Schalter muss jeder Import danach zwanzig
 * Dateien von Hand zuruecksetzen — und wer das einmal vergisst, schiebt eine
 * stille Aenderung an fremdem Eigentum in einen PR.
 */
const NUR_OVERLAY = process.argv.includes("--nur-overlay");
if (NUR_KOERPER && NUR_OVERLAY) {
  console.error("--nur-koerper und --nur-overlay schliessen einander aus.");
  process.exit(2);
}

/** Die Quell-Pins der zwei Overlay-Blaetter, aus denen die fuenf Kreide-Stems
 *  geschnitten sind.
 *
 *  ⚠ SIE ZIEHEN MIT JEDEM IMPORT UM — zum ZWEITEN Mal (R5 · T3, dann T4). Bis
 *  T3 nannten sie `batch-aq13/…` (`105a9462…` / `6f7f55ff…`, R212-Bestand), bis
 *  T4 `batch-aq13l/…` (`dc70c45577fc98a0…` / `60f0e9aefca8a78d…`). Ein Pin, der
 *  stehen bleibt, laesst `--nur-koerper` eine Datei bestaetigen, aus der im
 *  Spiel nichts mehr stammt — eine Zusicherung, die stillschweigend falsch
 *  geworden waere. Die gefallenen Werte stehen im Register (D-682 fuer die
 *  R212-Bestandspins, D-694 fuer die L-Pins), nicht hier.
 *
 *  Die Werte unten sind an der Lieferung GEMESSEN (`shasum -a 256`), nicht vom
 *  Lieferschein abgeschrieben, und die Lab-Kopie ist gegen die iCloud-ABLAGE
 *  md5-geprueft (`46987c2b768a7996aeb15e3bbc51cfe9` /
 *  `34758fa72f211ff915f2572fc1ba3e44`) — eine Lab-Kopie kann still VERALTET
 *  sein, das ist an batch-as6p2 einmal bezahlt worden. */
const DURCHREICH_PINS = [
  ["batch-aq13m/tafel_scribble.png", "c629cec206d68f60"],
  ["batch-aq13m/tafel_wipe.png", "c307640d713adede"],
];
if (NUR_KOERPER) {
  for (const [rel, pin] of DURCHREICH_PINS) {
    const f = path.join(LAB, rel);
    if (!fs.existsSync(f)) { failures.push(`Durchreich: ${rel} fehlt — der Pin ${pin}… ist nicht bestaetigbar`); continue; }
    const ist = crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
    if (ist.slice(0, 16) !== pin) failures.push(`Durchreich: ${rel} traegt sha256 ${ist.slice(0, 16)}…, der Wareneingang pinnt ${pin}… — das ist eine andere Datei`);
    else notes.push(`· DURCHREICH BESTAETIGT (nicht neu gebaut): ${rel} sha256 ${pin}… — die daraus geschnittenen Stems bleiben unberuehrt`);
  }
}

for (const sheet of (NUR_KOERPER ? KOERPER_SHEETS : NUR_OVERLAY ? SHEETS : [...SHEETS, ...KOERPER_SHEETS])) {
  const src = path.join(LAB, sheet.file);
  if (!fs.existsSync(src)) { failures.push(`source sheet MISSING: ${sheet.file}`); continue; }
  const png = read(src);
  const cw = png.width / sheet.cols;
  const chh = png.height / sheet.rows;
  if (!Number.isInteger(cw) || !Number.isInteger(chh)) {
    failures.push(`${sheet.file}: ${png.width}×${png.height} does not divide into ${sheet.cols}×${sheet.rows}`);
    continue;
  }

  // ── DER KOERPER-ZWEIG (R5 · H6 — AQ13B4) ───────────────────────────────────
  // Fenster je ZELLE aus dem Bestandskoerper, zentriert. Kein Schiefer-Fenster,
  // keine Masken-Zaehlung: hier wird der ganze Koerper ersetzt, nicht eine
  // Schicht auf seine Schreibflaeche gelegt.
  if (sheet.art === "koerper") {
    // Die Abnahme rechnet mit 512² je Zelle (`abnahmeTafel`, Voreinstellung).
    // Rechnete der Import mit einer anderen Zelle, fuehrten Tor und Werkzeug
    // zwei Lineale — die Klasse, gegen die der Kopf dieser Datei geschrieben
    // ist. Also wird es geprueft und nicht angenommen.
    if (cw !== KOERPER_ZELLE || chh !== KOERPER_ZELLE) {
      failures.push(`${sheet.file}: Zelle ${cw}×${chh} statt ${KOERPER_ZELLE}² — Tor und Importeur wuerden zwei verschiedene Raster lesen`);
      continue;
    }
    notes.push(`· ${sheet.file}: Koerper-Blatt, ${sheet.cols}×${sheet.rows} Zellen à ${cw}×${chh} — Fenster je Zelle aus dem Bestand, zentriert`);
    for (const [pos, stem] of sheet.pieces) {
      const dest = path.join(OUT, `${stem}.png`);
      if (!fs.existsSync(dest)) {
        failures.push(`${stem}: es gibt keinen Bestands-Stem dieses Namens — dieser Zweig ERSETZT, er legt nicht an`);
        continue;
      }
      const alt = read(dest);
      if (alt.width > cw || alt.height > chh) {
        failures.push(`${stem}: der Bestand ist ${alt.width}×${alt.height} und passt nicht in eine Zelle von ${cw}×${chh}`);
        continue;
      }

      const cellX = (pos % sheet.cols) * cw;
      const cellY = Math.floor(pos / sheet.cols) * chh;
      const cell = chromaKey(crop(png, cellX, cellY, cw, chh));

      // Das Fenster: der Bestandskoerper, ZENTRIERT in die Zelle gesetzt —
      // Wort fuer Wort die Rechnung aus Abnahme-Regel 2.
      const win = {
        x: Math.floor((cw - alt.width) / 2),
        y: Math.floor((chh - alt.height) / 2),
        w: alt.width,
        h: alt.height,
      };

      // 1 · Nichts Gemaltes darf ausserhalb des Fensters liegen. Laege es
      //     dort, waere der Koerper gegen ein anderes Mass gezeichnet und der
      //     Schnitt schnitte ihn an — still, und erst im Spiel sichtbar.
      const cb = contentBox(cell);
      if (cb === null) { failures.push(`${stem}: keyed to nothing`); continue; }
      if (cb.x0 < win.x || cb.y0 < win.y || cb.x1 >= win.x + win.w || cb.y1 >= win.y + win.h) {
        failures.push(
          `${stem}: Malerei ausserhalb des Bestandsmasses — Inhalt (${cb.x0},${cb.y0})-(${cb.x1},${cb.y1}), `
          + `Fenster (${win.x},${win.y})-(${win.x + win.w - 1},${win.y + win.h - 1}) = ${win.w}×${win.h}`,
        );
        continue;
      }
      // …und WO genau sitzt die Silhouette? Die Zahl, nicht das Vertrauen.
      const dx = cb.x0 - win.x, dy = cb.y0 - win.y;

      const out = crop(cell, win.x, win.y, win.w, win.h);
      const killed = defringe(out);

      const dist = keyDistance(out);
      if (dist < 150) {
        failures.push(`${stem}: a painted pixel sits ${dist.toFixed(2)} (Euclidean) from the import colour — needs ≥150, or a tolerant key eats it`);
        continue;
      }

      // 2 · DECKT DER NEUE KOERPER DEN ALTEN? Der Wareneingang misst hier
      //     0,9999 je Zelle gegen die Bestell-Bar 0,98. Diese Zeile misst sie
      //     am geschnittenen Ergebnis noch einmal selbst — eine uebernommene
      //     Zahl ist eine Behauptung (Kopf dieser Datei).
      const iou = iouOf(out, alt);
      if (!(iou >= 0.98)) {
        failures.push(`${stem}: Silhouetten-Deckung IoU ${Number.isNaN(iou) ? "nicht messbar" : iou.toFixed(4)} gegen den Bestand (Bestell-Bar 0,98) — der Ersatz zeigt eine andere Gestalt als sein Vorgaenger`);
        continue;
      }

      const painted = (() => { let n = 0; for (let i = 3; i < out.data.length; i += 4) if (out.data[i] > 8) n++; return n; })();
      if (!DRY) fs.writeFileSync(dest, PNG.sync.write(out));
      written.push(
        `overwrote ${stem}.png`.padEnd(34)
        + `${out.width}×${out.height}`.padEnd(10)
        + `${painted} px gemalt`.padEnd(18)
        + `Sitz (${dx >= 0 ? "+" : ""}${dx},${dy >= 0 ? "+" : ""}${dy})`.padEnd(26)
        + `IoU ${iou.toFixed(4)}`.padEnd(13)
        + `${killed} px Saum entfernt`.padEnd(24)
        + `Schlüssel-Abstand ${dist.toFixed(2)}`,
      );
    }
    continue;
  }

  // ── das Fenster, GERECHNET aus dem Bezugs-Sprite ───────────────────────────
  const refPng = read(path.join(OUT, `${sheet.ref}.png`));
  const slate = slateMaskOf(refPng);
  const offX = Math.floor((cw - refPng.width) / 2);
  const offY = Math.floor((chh - refPng.height) / 2);
  const win = {
    x: offX + slate.box.x0,
    y: offY + slate.box.y0,
    w: slate.box.x1 - slate.box.x0 + 1,
    h: slate.box.y1 - slate.box.y0 + 1,
  };
  notes.push(
    `· ${sheet.file}: Fenster aus ${sheet.ref} (${refPng.width}×${refPng.height}, zentriert bei ${offX},${offY}) `
    + `→ Schiefertafel (${win.x},${win.y}) ${win.w}×${win.h}`,
  );

  for (const h of sheet.held ?? []) notes.push(`· ZURÜCKGEHALTEN: ${sheet.file} Zelle ${h} — siehe Kopf`);

  for (const [pos, stem] of sheet.pieces) {
    const cellX = (pos % sheet.cols) * cw;
    const cellY = Math.floor(pos / sheet.cols) * chh;
    const cell = chromaKey(crop(png, cellX, cellY, cw, chh));

    // 1 · Registrierung: nichts Gemaltes darf außerhalb des Fensters liegen.
    const cb = contentBox(cell);
    if (cb === null) { failures.push(`${stem}: keyed to nothing`); continue; }
    const outside = cb.x0 < win.x || cb.y0 < win.y || cb.x1 >= win.x + win.w || cb.y1 >= win.y + win.h;
    if (outside) {
      failures.push(
        `${stem}: Malerei außerhalb der Schiefertafel — Inhalt (${cb.x0},${cb.y0})-(${cb.x1},${cb.y1}), `
        + `Fenster (${win.x},${win.y})-(${win.x + win.w - 1},${win.y + win.h - 1}). Die Schicht läge auf Rahmen oder Luft.`,
      );
      continue;
    }

    // 2 · …und wie viel davon liegt auf RAHMEN oder LUFT? Zahl, kein Vertrauen.
    //     Ein Lineal für Tor und Import (`overlayNeben`, R5-T3): Malerei auf dem
    //     Körper innerhalb der Schiefer-Schachtel ist RAND-Malerei und wird nur
    //     gemeldet; Malerei daneben ist der Abbruchgrund.
    const nb = overlayNeben(cell, cw, chh, slate, offX, offY, refPng);
    const painted = nb.gemalt;
    if (nb.daneben > OFF_MAX) {
      failures.push(
        `${stem}: ${nb.daneben} von ${painted} gemalten Pixeln (${(100 * nb.daneben / painted).toFixed(2)} %) liegen auf `
        + `RAHMEN oder LUFT statt auf der Schreibfläche von ${sheet.ref} (zuerst bei ${nb.erste}; `
        + `dazu ${nb.rand} px Rand-Malerei auf der Fläche, die nicht zählt) — `
        + (nb.daneben > painted * 0.05
          ? `das Blatt ist gegen ein anderes Sprite registriert als ${sheet.ref}`
          : `kein Registrierungsfehler in dieser Größenordnung, sondern Malerei, die über den Rand hinausragt: `
            + `entweder trägt das Blatt einen losen Strich, oder die Schreibfläche des Bezugs ist kleiner geworden. `
            + `Beides ist ein Befund am BLATT-PAAR und keiner am Importeur`),
      );
      continue;
    }

    const out = crop(cell, win.x, win.y, win.w, win.h);
    const killed = defringe(out);

    const dist = keyDistance(out);
    if (dist < 150) {
      failures.push(`${stem}: a painted pixel sits ${dist.toFixed(2)} (Euclidean) from the import colour — needs ≥150, or a tolerant key eats it`);
      continue;
    }

    const dest = path.join(OUT, `${stem}.png`);
    const existed = fs.existsSync(dest);
    if (!DRY) fs.writeFileSync(dest, PNG.sync.write(out));
    written.push(
      `${existed ? "overwrote" : "wrote    "} ${stem}.png`.padEnd(34)
      + `${out.width}×${out.height}`.padEnd(10)
      + `${painted} px gemalt`.padEnd(18)
      + `${nb.daneben} px Rahmen/Luft`.padEnd(24)
      + `${nb.rand} px Rand-Malerei`.padEnd(24)
      + `${killed} px Saum entfernt`.padEnd(24)
      + `Schlüssel-Abstand ${dist.toFixed(2)}`,
    );
  }
}

for (const n of notes) console.log(n);
console.log("");
for (const w of written) console.log(`  ${DRY ? "[dry] " : ""}${w}`);
console.log("");
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq13: ${failures.length} failure(s) — nothing about this delivery is accepted`);
  process.exit(1);
}
console.log(`import-batch-aq13: OK — ${written.length} stem(s)`);
