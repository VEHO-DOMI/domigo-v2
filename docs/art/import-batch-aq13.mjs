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

/** Die Zellordnung der drei Koerper-Blaetter — Raster 4×2 à 512², wie bestellt. */
const RECOLOUR_CELLS = {
  tafel_recolour_a: ["a", "b", "c", "d", "bank_l1", "bank_r0", "bank_r1", "roll"],
  tafel_recolour_b: ["land0", "land1", "rest", "win", "windup", "windup0", "windup1", "throw"],
  tafel_recolour_c: ["spiral0", "spiral1", "spiral2", "spiral3"],
};

/** ── DIE TAFEL-ABNAHME ──────────────────────────────────────────────────────
 *  `bestandOf(name)` liefert das Bestands-Sprite; in der Selbstpruefung ist es
 *  eine gebaute Attrappe, im Ernstfall die Datei aus `apps/web/public/art`. */
function abnahmeTafel(entries, bestandOf) {
  const lines = [], fail = [];

  for (const e of entries) {
    const sheetName = e.name, png = e.png;
    const names = e.names ?? RECOLOUR_CELLS[sheetName] ?? null;
    const cw = e.cw ?? 512, ch = e.ch ?? 512, cols = e.cols ?? Math.round(png.width / cw);

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

    // 5 · KEINE MASSENFARBE (je Blatt)
    const tally = new Map();
    let painted = 0, minKey = Infinity;
    const keyHist = new Map();
    for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) {
      if (!onAt(png, x, y)) continue;
      const i = (y * png.width + x) * 4;
      const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
      const k = (r << 16) | (g << 8) | b;
      tally.set(k, (tally.get(k) ?? 0) + 1);
      painted++;
      const d = Math.hypot(r - 255, g, b - 255);
      if (d < minKey) minKey = d;
      const bucket = Math.round(d);
      keyHist.set(bucket, (keyHist.get(bucket) ?? 0) + 1);
    }
    let topK = 0, topN = 0;
    for (const [k, n] of tally) if (n > topN) { topN = n; topK = k; }
    const share = painted === 0 ? 0 : topN / painted;
    lines.push(`  ${sheetName}: ${painted} px gemalt · haeufigster RGB (${topK >> 16},${(topK >> 8) & 255},${topK & 255}) ${(share * 100).toFixed(4)} %`);
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
      let ls = 0, ln = 0;
      for (let y = win.y0; y <= win.y1; y++) for (let x = win.x0; x <= win.x1; x++) {
        if (x < 0 || y < 0 || x >= png.width || y >= png.height) continue;
        if (!inSlate(x, y) || !onAt(png, x, y)) continue;
        const i2 = (y * png.width + x) * 4;
        const L = lum(png.data[i2], png.data[i2 + 1], png.data[i2 + 2]);
        if (L > FACE_L) continue;           // die Kreide ist nicht der Schiefer
        ls += L; ln++;
      }
      const meanL = ln === 0 ? NaN : ls / ln;
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
      lines.push(`    ${nm.padEnd(10)} Schiefer L ${meanL.toFixed(2)} · Maserung ${tex.toFixed(3)} · Rauhheit ${Number.isNaN(rough) ? "—" : rough.toFixed(3)}`);
      if (!(meanL <= SLATE_L_MAX)) fail.push(`${nm}: Schiefer L ${meanL.toFixed(2)} ueber ${SLATE_L_MAX} — zu hell gegen die Tuer`);
      if (!(tex >= MIN_TEXTURE)) fail.push(`${nm}: Schiefer-Maserung ${tex.toFixed(3)} unter ${MIN_TEXTURE} — ein Farbfeld, kein gemalter Schiefer`);
      if (!Number.isNaN(rough) && rough > MAX_ROUGHNESS) fail.push(`${nm}: Schiefer-Rauhheit ${rough.toFixed(3)} ueber ${MAX_ROUGHNESS} — die Flaeche ist Einzelpunkt-Rauschen, keine Maserung (Bestand 0,109–0,127)`);
    }
  }
  return { lines, fail };
}

/** ── DIE RING-ABNAHME ───────────────────────────────────────────────────────
 *  `stage` ist 2048×1260 (zwei Platten a|b), `band` 2048×384, gekeyt. */
function abnahmeRing(stage, band) {
  const lines = [], fail = [];

  // 1/2 · NAHT a|b und WRAP b|a
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
      slateBase: 9, slateAmp: 8, rauschen: false, ...opts,
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

  // ── Fall 6 · DIE RESERVE ──────────────────────────────────────────────────
  add("Reserve: ein Pixel auf 179", "vom Schluessel", () => runTafel(mkCell(W, H, { face: 450, keyAt: 179 }), ["a"], 1, W, H));
  add("Reserve: knappstes Pixel auf 182", null, () => runTafel(mkCell(W, H, { face: 450, keyAt: 182 }), ["a"], 1, W, H));

  // ── Fall 7 · DIE UNGEMESSENE NAHT ─────────────────────────────────────────
  // Zwei Platten, deren einander zugewandte Spalten nicht bemalt sind: die
  // Formel liefert 0,0 — und 0,0 sieht wie eine perfekte Naht aus.
  const mkStage = (gap, wrapBreak) => mkPng(200, 60, (x, y) => {
    const nearEdge = x < 2 || x >= 198 || (x >= 98 && x < 102);
    if (gap && nearEdge) return [255, 0, 255];
    const base = 90 + ((x * 5 + y * 3) % 17);
    if (wrapBreak && x >= 198) return [base + 60, base + 60, base + 60];
    return [base, base - 20, base - 40];
  });
  /** Holzton H ≈ 39,4°, Helligkeit ueber den Faktor gesteuert. */
  const mkBand = (hole, dunkel) => mkPng(200, 40, (x, y) => {
    if (hole && x >= 150 && x < 170) return [255, 0, 255];
    const n = ((x * 3 + y * 7) % 4);
    const f = dunkel ? 1.0 : 1.30;
    return [Math.round(47 * f) + n, Math.round(36 * f) + n, Math.round(15 * f) + n];
  });
  add("Naht: null gemeinsame bemalte Pixel (0,0 ist ungemessen)", "UNGEMESSEN", () => abnahmeRing(mkStage(true, false), mkBand(false, true)));
  add("Naht: Platten schliessen durch Malerei", null, () => abnahmeRing(mkStage(false, false), mkBand(false, true)));

  // ── Fall 8 · DAS LOCH IM BAND und DIE HELLIGKEIT ──────────────────────────
  add("Band: 20 Spalten ohne ein bemaltes Pixel", "ohne ein einziges bemaltes Pixel", () => abnahmeRing(mkStage(false, false), mkBand(true, true)));
  add("Band: zu hell (ueber 15,5 %)", "Helligkeit", () => abnahmeRing(mkStage(false, false), mkBand(false, false)));

  // ── Fall 9 · DER WRAP, DER NUR AN EINER KANTE BRICHT ──────────────────────
  add("Wrap b|a: die letzte Spalte springt heraus", "b|a", () => abnahmeRing(mkStage(false, true), mkBand(false, true)));

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
