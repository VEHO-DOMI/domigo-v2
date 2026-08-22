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

/** Die grüne Schreibfläche eines Bestands-Sprites — dieselbe Regel, mit der
 *  die Lieferung ihre eigene Registrierung geprüft hat, damit unsere und ihre
 *  Zahl vergleichbar sind (g deutlich über r und b, nicht dunkel, nicht warm). */
const slateMaskOf = (png) => {
  const { width: W, height: H, data } = png;
  const m = new Uint8Array(W * H);
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (a > 200 && g > r * 1.10 && g > b * 1.05 && g > 30 && r < 130) {
        m[y * W + x] = 1;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { m, W, H, box: { x0, y0, x1, y1 } };
};

/** Liegt (x,y) höchstens `tol` px neben der Maske? (Der Weichzeichner-Saum
 *  eines gemalten Strichs kappt sonst eine völlig gesunde Lieferung.) */
const nearMask = (mask, x, y, tol) => {
  for (let dy = -tol; dy <= tol; dy++) {
    for (let dx = -tol; dx <= tol; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= mask.W || ny >= mask.H) continue;
      if (mask.m[ny * mask.W + nx] === 1) return true;
    }
  }
  return false;
};

// ── die Blätter ──────────────────────────────────────────────────────────────
//
// `ref` ist das Bestands-Sprite, gegen das die Zelle registriert ist; das
// Schnittfenster wird daraus GERECHNET (Zentrierung + Schiefertafel), nie
// getippt. `pieces` ist [Zellindex, Stem].
const SHEETS = [
  {
    file: "batch-aq13/tafel_scribble.png",
    cols: 4, rows: 1,
    ref: "tafel_a",
    pieces: [
      [0, "tafel_scribble1"], // die leichte Schicht — ein paar Striche und 2+2
      [1, "tafel_scribble2"], // ABC, NO mit Durchstreichung, Kreisel
      [2, "tafel_scribble3"], // die volle, lange nicht gewischte Tafel
      [3, "tafel_scribble3b"], // dieselbe, um (3,−2) versetzt: das Zittern im Ausholen
    ],
  },
  {
    file: "batch-aq13/tafel_wipe.png",
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
const SLATE_L_MAX = 10, MIN_TEXTURE = 1.5, MASS_MAX = 0.01, KEY_MIN = 180;
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
]);

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
 *  ⚠ EHRLICHE GRENZE (H5, 22.08.): die Liste ist LEER, und das ist kein
 *  Versehen. Die Zell-SHAs der Kreide-Overlays stammen aus der Lieferung
 *  AQ13b3 — sie ist mit dem ersten Mac verloren (R204), und die Neulieferung
 *  AQ13B4 ist wegen der Codex-Pause nicht gefahren (R208). Gebaut ist deshalb
 *  die MECHANIK, bewiesen an einem synthetischen Paar; die Pins traegt der
 *  B4-Wareneingang nach (H6). Eine leere Liste aendert am Verhalten des Tores
 *  heute nichts — genau das ist die sichere Voreinstellung.
 *
 *  Form je Eintrag:  ["<sha256 ueber die rohen RGB-Bytes der ZELLE>", "Herkunft"]
 */
const OVERLAY_MASSE_FREI = new Map([
  // (leer bis zum AQ13B4-Wareneingang — siehe Kopf)
]);

/** Die Zellordnung der drei Koerper-Blaetter — Raster 4×2 à 512², wie bestellt. */
const RECOLOUR_CELLS = {
  tafel_recolour_a: ["a", "b", "c", "d", "bank_l1", "bank_r0", "bank_r1", "roll"],
  tafel_recolour_b: ["land0", "land1", "rest", "win", "windup", "windup0", "windup1", "throw"],
  tafel_recolour_c: ["spiral0", "spiral1", "spiral2", "spiral3"],
};

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

const failures = [];
const written = [];
const notes = [];

notes.push("· Blatt 3 (`tafel_faces_scribbled`) ist NICHT Teil dieses Imports — blinder Prüfer: ZURÜCKGEWIESEN, 0 von 4 Porträts auf dem Körper des Kartenmoments (Kopf dieser Datei).");

for (const sheet of SHEETS) {
  const src = path.join(LAB, sheet.file);
  if (!fs.existsSync(src)) { failures.push(`source sheet MISSING: ${sheet.file}`); continue; }
  const png = read(src);
  const cw = png.width / sheet.cols;
  const chh = png.height / sheet.rows;
  if (!Number.isInteger(cw) || !Number.isInteger(chh)) {
    failures.push(`${sheet.file}: ${png.width}×${png.height} does not divide into ${sheet.cols}×${sheet.rows}`);
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

    // 2 · …und wie viel davon liegt neben der grünen MASKE? Zahl, kein Vertrauen.
    let offMask = 0, firstOff = null;
    for (let y = 0; y < chh; y++) {
      for (let x = 0; x < cw; x++) {
        if (cell.data[(y * cw + x) * 4 + 3] <= 8) continue;
        const rx = x - offX, ry = y - offY;
        if (rx < 0 || ry < 0 || rx >= slate.W || ry >= slate.H || !nearMask(slate, rx, ry, 3)) {
          offMask++;
          if (firstOff === null) firstOff = `${x},${y}`;
        }
      }
    }
    const painted = (() => { let n = 0; for (let i = 3; i < cell.data.length; i += 4) if (cell.data[i] > 8) n++; return n; })();
    if (offMask > 40) {
      failures.push(
        `${stem}: ${offMask} gemalte Pixel liegen mehr als 3 px neben der grünen Fläche (zuerst bei ${firstOff}) — `
        + `das Blatt ist gegen ein anderes Sprite registriert als ${sheet.ref}`,
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
      + `${offMask} px neben der Fläche`.padEnd(26)
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
