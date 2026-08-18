#!/usr/bin/env node
/**
 * R5-W4b · C3 · IMPORT BATCH AQ12 — die Farbe wird wahr.
 *
 * Kokis Replay vom 15.08.: »Das Buch ist blau, aber es will rot. Uhu-Stick sagt
 * grün, ist orange. Spitzer sagt gelb, ist blau. Lazy — nicht überprüft.«
 * C2 (#294) hat daraufhin die Karten an das GEMESSENE Blatt geheftet und ein Tor
 * gebaut, das eine PNG öffnet und die Karte daran festhält. Ehrlich, aber
 * einfarbig. Diese Runde bringt die VARIETÄT — und weil das Tor per Konstruktion
 * arbeitet, kippt es die Karte mit, sobald das Blatt sich ändert.
 *
 * WAS HIER IMPORTIERT WIRD, UND WAS NICHT (jede Zeile ist eine Entscheidung):
 *
 *   · RADIERGUMMI  ← AQ12 `eraser_recolour.png`, 5 Zellen. Blau → rosa.
 *     Das Blatt misst danach pink 99 % (Verhältnis 84). Die Karte kippt in
 *     derselben Änderung von `blue` auf `pink`.
 *
 *   · FÜLLFEDER    ← AQ12 `pen_recolour.png`, 4 Zellen. Warm-Mitte 39,1° → 58,0°.
 *     Das Kartenwort `yellow` bleibt — es wird durch diesen Import zum ersten Mal
 *     WAHR. Die ratifizierte Lesung in check-colour-truth muss mitwandern
 *     (Drift 18,9° > 6°, das Tor geht bis dahin rot — genau wie vorgesehen).
 *
 *   · BUCH         ← NICHT importiert. AQ12s rotes Buch ist gut gemalt und ein
 *     Mensch liest es als rot; das Tor nicht. Gemessen: 58 413 rote Pixel mit
 *     Median-Chroma (S·V) 0,373 — knapp unter der PARCHMENT-Schwelle 0,45, also
 *     fallen 90 % der warmen Masse als »Pergament« weg und übrig bleiben die
 *     Goldecken bei 38,0°. Auf 38,0° »rot« zu ratifizieren würde die Tabelle
 *     entwerten (Tisch braun 35,7°, Feder gelb 39,1°). Die Regel gehört dieser
 *     Session nicht, also: Blatt bleibt blau, AQ12d ist mit der exakten Zahl
 *     bestellt (Deckel-Median-S·V ≥ 0,53 — AQ12c hat 0,533 bewiesen). D-221.
 *
 *   · SCHULTASCHE  ← NICHT importiert. AQ12c trifft die Zahl (warm 100 %, 28,9°,
 *     S·V 0,533), bräunt aber ALLES mit: petrolfarbener Besatz, Messing und die
 *     bunten Bücher im Fach sind derselbe Orangeton geworden. Wahrheit gegen
 *     Handwerk — Kokis Entscheidung: nachbestellen (AQ12f), nicht importieren.
 *     Zusätzlich säße 28,9° nur 4,3° neben den ratifizierten Orange-Lesungen
 *     (Uhu-Stick 24,6°, Schere 23,9°). D-222.
 *
 *   · HEFT         ← NICHT importiert. C2 hat gemessen: es war schon grün (R79).
 *   · SPITZER      ← bleibt blau (R41-Palette).
 *   · `ranzen_*`   ← NICHT importiert. Dreifach belegt, dass AQ12bs
 *     `ranzen_brown.png` eine Null-Operation ist: eigene Messung Warm-Mitte 32,5°
 *     = Bestand 32,5°; AQ12bs eigener Lieferschein sagt »packs the current source
 *     pixels unchanged«; und `ranzen` ist ohnehin der p3-CRUSHER, nicht das Wesen
 *     der Farb-Karte (das ist `obj_schoolbag`).
 *
 * ── DER BLINDE BLATT-PRÜFER (R91 · P-65: ohne Prüfer kein Import) ────────────
 * »CODEX DRAFT — NOT CANON« wird NUR durch ein blindes Verdikt aufgelöst. Zwei
 * frische Prüfer, je zwei Bilder auf neutralem Grund, Reihenfolge getauscht, ohne
 * zu wissen, welches der Bestand ist. Wörtlich:
 *
 *   RADIERGUMMI — ANGENOMMEN. »A und B zeigen dasselbe Wesen in derselben Pose,
 *   nur umgefärbt — JA.« Belegt: 167 388 von 242 952 Pixeln byte-identisch;
 *   Schattierungsstruktur im Körper mittlere Differenz 3,8 von 256; Silhouetten
 *   bis auf Antialiasing deckungsgleich; »Eine gezielte Suche nach reinem
 *   Chromakey-Magenta ergab null Treffer in beiden Bildern.«
 *
 *   FÜLLFEDER — ANGENOMMEN, mit einem Befund. »Zeichnung und Pose sind identisch«
 *   (98 % Konturübereinstimmung), aber im NEUEN Blatt fand der Prüfer
 *   Freistellungs-Reste: »mehrere Stellen mit reinen Magenta-Pixeln (RGB ≈
 *   151/23/135) direkt am schwarzen Umriss« an Seil/Kappe, beiden Fäusten und dem
 *   linken Schuh, die im Bestand fehlen. Genau dafür existiert `defringe()` unten;
 *   der Import prüft danach mit `check-paint-art` (keyFringe, Schwelle EIN Pixel)
 *   nach, statt es zu behaupten.
 *
 *   ★ UND EIN BEFUND, DER EINE REPO-SCHULD WIDERLEGT: derselbe Prüfer hat das
 *   Wesen unabhängig als FÜLLFEDER identifiziert — »die durchgehende vertikale
 *   Linie bis zur Spitze plus das runde Luftloch (Atemloch)«. Nachgeprüft bei
 *   fünffacher Vergrößerung: das Blatt trägt eine goldene Schreibfeder mit
 *   Mittelschlitz, Luftloch und geschulterter Federform, darüber Kappe mit
 *   Zierring. D-131 (»pen_a zeigt gar keine Füllfeder«) ist WIDERLEGT — bei
 *   Spielgröße liest sich die Feder wie eine Bleistiftspitze, und darauf sind C2
 *   und diese Session zunächst beide hereingefallen. AQ12b hatte damit einen
 *   ZWEITEN Nib auf ein Blatt gesetzt, das schon einen hatte; deshalb las es sich
 *   als Papierhut. AQ12e wurde daraufhin zurückgezogen. D-223.
 *
 * ── WAS DIESES SKRIPT GEGENÜBER `import-batch-aq7.mjs` ZUSÄTZLICH TUT ────────
 *  1. GRÖSSEN-VERTRAG. Jede Zelle muss exakt das Maß ihrer Ziel-PNG treffen. Das
 *     Sollmaß wird AUS DER DATEI AUF DER PLATTE gelesen, nicht abgetippt (Muster
 *     `import-batch-aq6.mjs`), damit keine Zahl hier von der Wirklichkeit
 *     abdriften kann. WARUM das zählt: die Engine normiert die HÖHE auf
 *     `entDisplayH` und leitet die Breite aus dem Seitenverhältnis ab — das
 *     Seitenverhältnis IST die Pose. `eraser_squash` liest sich nur als Squash,
 *     weil es bei gleicher Höhe 14 % breiter ist als die Ruhepose. Ein anders
 *     zugeschnittener Kasten schwächt die Pose lautlos ab, und kein Tor merkt es.
 *  2. BESTANDS-SCHABLONE gegen Alpha-Geister. Codex' Bauer liest die Quellen mit
 *     `.convert("RGB")`; unter Alpha 0 steht in diesen PNGs buchstäblich #FF00FF
 *     (der Importer nullt beim Freistellen nur die Alpha-Ebene und lässt RGB
 *     stehen — `art-recompress.mjs` verweigert `-a` aus genau diesem Grund). Wer
 *     die Alpha-Ebene wegwirft, malt in Flächen, die unsichtbar sein sollten.
 *     Bei Blättern mit Anspruch »pixelidentische Silhouette« wird deshalb die
 *     Alpha-Maske des Bestands als Schablone gelegt und die Differenz GEDRUCKT.
 *  3. SCHLÜSSEL-REINHEIT. Zählt Pixel, die innerhalb der Key-Toleranz liegen,
 *     aber nicht exakt #FF00FF sind — ein weicher Schlüssel ist ein Saum in spe.
 *
 * ── WAS DER IMPORT DIE PHASEN KOSTET (gemessen, nicht geschätzt) ─────────────
 * Ein Ersatz bei identischen Maßen kann genau eine Perf-Größe bewegen: die
 * Bilddaten, die eine Phase lädt (`phaseArtScope` × Dateigröße, Budget 35 MB).
 * Vorher/nachher über alle fünf Phasen, gegen `origin/main`:
 *
 *     p1  23,13 → 23,11 MB   (−24,8 KB, 5 Blätter)
 *     p2  26,41 → 26,38 MB   (−32,2 KB, 6 Blätter)
 *     p3  21,73 → 21,73 MB   (unberührt)
 *     p4  21,96 → 21,96 MB   (unberührt)
 *     p9  15,31 → 15,31 MB   (unberührt)
 *
 * Die beiden berührten Phasen werden LEICHTER, weil die anschließende
 * Rekompression (`oxipng -o max --strip none`) mehr zurückholt, als der
 * Neuanstrich kostet: über die elf Blätter netto −57 KB, und
 * `check-png-identity` bezeugt, dass dabei kein einziger Pixel gewandert ist
 * (−7,3 % Dateigröße, Pixel identisch). Wer hier nachimportiert, misst dieselbe
 * Zeile neu, statt diese abzuschreiben — die Zahlen altern mit jedem Blatt.
 */
import fs from "node:fs";
import path from "node:path";
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

/** VERBATIM aus import-batch-aq7.mjs / import-batch-as.mjs. Das Prädikat liegt
 *  als Kopie in `scripts/key-fringe.mjs` (importerWouldDelete), weil der Defekt
 *  DEFINIERT ist als »ein Pixel, den irgendein Import löschen würde«. Wer es hier
 *  ändert, entkoppelt den Speck-Detektor — also nicht ändern. */
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

/** Gate EUCLIDEAN, report both — Manhattan ist immer ≥ Euclidean, ein Tor auf
 *  Manhattan ≥150 wäre also LOCKERER als die Zahl verspricht (aq7-Kopfkommentar). */
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

/** Pixel, die der Schlüssel-Toleranz zum Opfer fallen, aber nicht exakt der
 *  Schlüssel sind — ein weicher Schlüssel ist der Saum von morgen. */
const impureKey = (png) => {
  let n = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    if (!isMagenta(r, g, b)) continue;
    if (r !== 255 || g !== 0 || b !== 255) n++;
  }
  return n;
};

/** Die Alpha-Maske des BESTANDS über die Lieferung legen: alles außerhalb wird
 *  transparent. Gibt zurück, wie viele Pixel dabei gefallen sind (Geister) und
 *  wie viele der Bestand hat, die die Lieferung NICHT malt (Löcher). */
function stencil(out, incumbent) {
  let ghosts = 0, holes = 0;
  for (let i = 0; i < out.data.length; i += 4) {
    const here = out.data[i + 3] > 8;
    const there = incumbent.data[i + 3] > 8;
    if (here && !there) { out.data[i + 3] = 0; ghosts++; }
    else if (!here && there) holes++;
  }
  return { ghosts, holes };
}

// ── DIE ABNAHME-MESSUNG (C5, R5-W6) ──────────────────────────────────────────
// WARUM SIE HIER STEHT, und sie ist ein bezahlter Befund, keine Vorsichtsmaßnahme.
// Zweimal hintereinander (AQ12d/AQ12f am 17.08., AQ12d2/AQ12f2 am 18.08.) hat der
// Kunst-Lieferant seinen eigenen Lieferschein auf »PASS« gesetzt, während die
// Abnahme im Repo dieselben Blätter zurückschickte. Der Grund war nie Unehrlichkeit,
// sondern zwei LINEALE: die bestellte Zahl »lokale Struktur ≥ 8,0« stammt aus C4s
// Hochpass-Kern (Bestand = 10,01), der Lieferant maß denselben Bestand mit seinem
// Kern als 13,208 und las seine 9,317 als Erfolg. Absolutwerte sind zwischen zwei
// Kernen NICHT übersetzbar — die QUOTE gegen den Bestand ist es. Genau die 80 %
// standen ohnehin in beiden Bestellungen (Buch 8,0/10,01 · Tasche 7,3/9,09).
//
// Also misst dieses Skript beide Seiten mit EINEM Kern und entscheidet an der Quote:
//     node docs/art/import-batch-aq12.mjs --probe <stem> <lieferung.png>
//     node docs/art/import-batch-aq12.mjs --selftest
// Was die Probe prüft, ist das, was die letzten drei Runden entschieden hat:
//   1. Bestandsmaß und Alpha-Silhouette (Geister/Löcher),
//   2. die QUOTE der lokalen Struktur auf der Umfärb-Fläche — hält die Umfärbung
//      die Helligkeitsmodulation, oder ist sie eine Füllung mit Randschatten?
//   3. Reste des Bestands INNERHALB der Umfärb-Fläche: bytegleiche Inseln, die als
//      hartkantige Flicken stehenbleiben (AQ12f 1 337 px, AQ12F2 812 px),
//   4. der Schlüsselabstand.
// Die Probe ersetzt den blinden Blatt-Prüfer NICHT (R91/R133/R152) — sie sorgt
// dafür, dass Besteller und Abnahme über DIESELBE Zahl reden, bevor ein Mensch
// hinsieht.
const STRUCTURE_QUOTE_MIN = 0.80; // beide AQ12-Bestellungen: 80 % des Bestands
// Ein FLICKEN (zusammenhängendes Feld ab MIN_PATCH) ist immer ein Rückgabegrund —
// zwei blinde Prüfer haben genau daran AQ12f erkannt. Einzelne Streupunkte am
// Materialrand entstehen dagegen auch bei ehrlicher Arbeit (Antialiasing trifft
// zufällig denselben Byte-Wert); für sie gilt ein benannter Anteil statt Null.
const LEFTOVER_SHARE_MAX = 0.005; // 0,5 % der Umfärb-Fläche
const KEY_MIN = 180;              // D-231: kein Clamp bei 150

const luma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** Farbton/Sättigung/Helligkeit. Eigene Kopie, wie `isMagenta` und `keyDistance`
 *  auch: `scripts/check-colour-truth.mjs` misst beim Import sofort alle neun
 *  Blätter (Seiteneffekt) — ein Importer darf davon nicht abhängen. */
function hsv(r, g, b) {
  const R = r / 255, G = g / 255, B = b / 255;
  const mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn;
  let h = 0;
  if (d !== 0) {
    if (mx === R) h = 60 * (((G - B) / d) % 6);
    else if (mx === G) h = 60 * ((B - R) / d + 2);
    else h = 60 * ((R - G) / d + 4);
  }
  if (h < 0) h += 360;
  return [h, mx === 0 ? 0 : d / mx, mx];
}

/** Mittlerer |Hochpass| der Helligkeit über einer Maske.
 *  Kern: 3×3-Laplace [[0,-1,0],[-1,4,-1],[0,-1,0]] / 4. Ein Bildpunkt zählt nur,
 *  wenn seine vier Nachbarn ebenfalls in der Maske liegen — sonst misst man die
 *  Silhouettenkante statt der Malerei. Der Kern ist frei wählbar; entscheidend
 *  ist, dass BEIDE Bilder mit demselben gemessen werden. */
function localStructure(png, mask) {
  const { width: W, height: H, data } = png;
  const L = new Float64Array(W * H);
  for (let p = 0; p < W * H; p++) L[p] = luma(data[p * 4], data[p * 4 + 1], data[p * 4 + 2]);
  let sum = 0, n = 0;
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      if (!mask[p] || !mask[p - 1] || !mask[p + 1] || !mask[p - W] || !mask[p + W]) continue;
      sum += Math.abs((4 * L[p] - L[p - 1] - L[p + 1] - L[p - W] - L[p + W]) / 4);
      n++;
    }
  }
  return { struct: n === 0 ? 0 : sum / n, px: n };
}

const rgbSame = (a, b, i) =>
  a.data[i] === b.data[i] && a.data[i + 1] === b.data[i + 1] && a.data[i + 2] === b.data[i + 2];

/** Die Umfärb-Fläche: jeder undurchsichtige Bildpunkt, den die Lieferung anders
 *  malt als der Bestand. Wer umfärbt, verändert genau diese Fläche — also wird
 *  auf ihr gemessen, in BEIDEN Bildern an denselben Koordinaten. */
function recolourMask(inc, del) {
  const N = inc.width * inc.height;
  const m = new Uint8Array(N);
  let n = 0;
  for (let p = 0; p < N; p++) {
    if (inc.data[p * 4 + 3] < 200) continue;
    if (rgbSame(inc, del, p * 4)) continue;
    m[p] = 1; n++;
  }
  return { mask: m, n };
}

/** Reste der ALTEN HAUT innerhalb der Umfärb-Fläche.
 *
 *  Die erste Fassung dieser Funktion zählte jeden bytegleichen Bildpunkt neben der
 *  Umfärbung — und meldete damit die Goldecken, den Seitenblock, die Tuschekontur,
 *  den petrolfarbenen Besatz und die bunten Bücher als »Rest«: 6 494 px beim Buch,
 *  15 516 px bei der Tasche. Das ist die Klasse Fehler, gegen die dieses Skript
 *  gebaut ist, nur mit umgekehrtem Vorzeichen: ein Tor, das jede ehrliche Lieferung
 *  rot macht, ist so wertlos wie eins, das jede durchlässt. Ein REST ist deshalb
 *  definiert als ein unveränderter Bildpunkt, dessen Bestandsfarbe in derselben
 *  Haut liegt, die die Lieferung ringsum umgefärbt HAT — Gold neben Rot ist kein
 *  Rest, ein Stück Bestandsblau mitten im neuen Rot schon.
 *
 *  Das Band der alten Haut wird aus der Umfärb-Fläche selbst gelesen (Median-
 *  Farbton, 95-%-Streuung; S und V im 2,5–97,5-%-Band), nicht abgetippt. */
const MIN_PATCH = 12;

/** Die alte Haut als FARBWOLKE, nicht als Kasten.
 *
 *  Erster Versuch war ein Kasten (Farbton ± Streuung, S und V im 2,5–97,5-%-Band).
 *  Er war für das Buch zu eng (die 124 kühlen Streupunkte lagen knapp unter der
 *  S-Grenze und wurden nicht gesehen) und für die Tasche zu weit (das Kreuzprodukt
 *  der Extremwerte schluckte Messing und das goldene Buch). Eine Wolke aus den
 *  Farben, die WIRKLICH umgefärbt wurden, hat beide Fehler nicht: 36 Farbton- ×
 *  10 Sättigungs- × 10 Helligkeitsfächer, und ein Fach zählt erst ab MIN_BIN
 *  Bildpunkten — was in keinem Fach liegt, war nie diese Haut. */
const MIN_BIN = 10;
const REACH = 8; // px, in denen ein Rest von der neuen Fläche umschlossen sein muss
const binOf = (h, sat, val) =>
  (Math.min(35, Math.floor(h / 10)) * 10 + Math.min(9, Math.floor(sat * 10))) * 10
  + Math.min(9, Math.floor(val * 10));
function oldSkinCloud(inc, mask) {
  const N = inc.width * inc.height;
  const bins = new Int32Array(36 * 10 * 10);
  let n = 0;
  for (let p = 0; p < N; p++) {
    if (!mask[p]) continue;
    const [h, sat, val] = hsv(inc.data[p * 4], inc.data[p * 4 + 1], inc.data[p * 4 + 2]);
    bins[binOf(h, sat, val)]++; n++;
  }
  let live = 0;
  for (let i = 0; i < bins.length; i++) if (bins[i] >= MIN_BIN) live++;
  return { bins, n, live };
}

function leftovers(inc, del, mask) {
  const { width: W, height: H } = inc;
  const N = W * H;
  const cloud = oldSkinCloud(inc, mask);
  if (cloud.n === 0) return { total: 0, patches: [], cloud };
  const stale = new Uint8Array(N);
  let total = 0;
  for (let p = 0; p < N; p++) {
    if (inc.data[p * 4 + 3] < 200 || mask[p]) continue;
    if (!rgbSame(inc, del, p * 4)) continue;
    const [h, sat, val] = hsv(inc.data[p * 4], inc.data[p * 4 + 1], inc.data[p * 4 + 2]);
    if (cloud.bins[binOf(h, sat, val)] < MIN_BIN) continue;
    // UMSCHLOSSEN, nicht nur benachbart: ein Rest liegt IN der neuen Fläche. Am
    // Materialrand (Seitenblock, Besatz, Beschlag) findet man Umgefärbtes immer
    // auf einer Seite — das ist eine Grenze, kein Flicken. Verlangt werden
    // deshalb drei der vier Himmelsrichtungen innerhalb von REACH.
    const x = p % W, y = (p / W) | 0;
    let sides = 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      for (let k = 1; k <= REACH; k++) {
        const nx = x + dx * k, ny = y + dy * k;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) break;
        if (mask[ny * W + nx]) { sides++; break; }
      }
    }
    if (sides < 3) continue;
    stale[p] = 1; total++;
  }
  const seen = new Uint8Array(N), patches = [];
  for (let p0 = 0; p0 < N; p0++) {
    if (seen[p0] || !stale[p0]) continue;
    const st = [p0]; seen[p0] = 1; const blob = [];
    while (st.length > 0) {
      const q2 = st.pop(); blob.push(q2);
      const x = q2 % W, y = (q2 / W) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const r = ny * W + nx;
        if (!seen[r] && stale[r]) { seen[r] = 1; st.push(r); }
      }
    }
    if (blob.length < MIN_PATCH) continue;
    let bx0 = 1e9, by0 = 1e9, bx1 = -1, by1 = -1;
    for (const q2 of blob) {
      const x = q2 % W, y = (q2 / W) | 0;
      if (x < bx0) bx0 = x; if (x > bx1) bx1 = x;
      if (y < by0) by0 = y; if (y > by1) by1 = y;
    }
    patches.push({ n: blob.length, bx0, by0, bx1, by1 });
  }
  return { total, patches: patches.sort((a, b) => b.n - a.n), cloud };
}

/** Die ganze Abnahme für EIN Blatt. Gibt die Zeilen und das Urteil zurück. */
export function probeSheet(incumbent, delivery) {
  const lines = [];
  const fail = [];
  const sizeOk = incumbent.width === delivery.width && incumbent.height === delivery.height;
  lines.push(`Maß           Bestand ${incumbent.width}×${incumbent.height}   Lieferung ${delivery.width}×${delivery.height}   ${sizeOk ? "gleich" : "ABWEICHEND"}`);
  if (!sizeOk) { fail.push("Maß weicht vom Bestand ab"); return { lines, fail }; }

  let ghosts = 0, holes = 0;
  for (let i = 0; i < incumbent.data.length; i += 4) {
    const here = delivery.data[i + 3] > 8, there = incumbent.data[i + 3] > 8;
    if (here && !there) ghosts++;
    else if (!here && there) holes++;
  }
  lines.push(`Silhouette    Geister ${ghosts}   Löcher ${holes}`);
  if (ghosts + holes > 0) fail.push(`Alpha-Silhouette weicht ab (${ghosts} Geister, ${holes} Löcher)`);

  const dist = keyDistance(delivery);
  lines.push(`Schlüssel     Abstand ${dist.euclid.toFixed(2)}e / ${dist.manhattan}m   (Ziel ≥ ${KEY_MIN})`);
  if (dist.euclid < KEY_MIN) fail.push(`Schlüsselabstand ${dist.euclid.toFixed(2)} < ${KEY_MIN}`);

  const { mask, n } = recolourMask(incumbent, delivery);
  const a = localStructure(incumbent, mask), b = localStructure(delivery, mask);
  const quote = a.struct === 0 ? 0 : b.struct / a.struct;
  lines.push(`Umfärb-Fläche ${n} px`);
  lines.push(`Struktur      Bestand ${a.struct.toFixed(3)}   Lieferung ${b.struct.toFixed(3)}   QUOTE ${(100 * quote).toFixed(1)} %   (Ziel ≥ ${(100 * STRUCTURE_QUOTE_MIN).toFixed(0)} %)`);
  if (quote < STRUCTURE_QUOTE_MIN) fail.push(`Struktur-Quote ${(100 * quote).toFixed(1)} % < ${(100 * STRUCTURE_QUOTE_MIN).toFixed(0)} % — die Umfärbung hat die Helligkeitsmodulation verloren`);

  const { total, patches, cloud } = leftovers(incumbent, delivery, mask);
  const share = n === 0 ? 0 : total / n;
  lines.push(`Alte Haut     ${cloud.live} belegte Farbfächer (ab ${MIN_BIN} px) aus ${cloud.n} umgefärbten Bildpunkten`);
  lines.push(`Reste         ${total} px (${(100 * share).toFixed(2)} % der Umfärb-Fläche)   Flicken ab ${MIN_PATCH} px: ${patches.length}   (Ziel: keine Flicken, ≤ ${(100 * LEFTOVER_SHARE_MAX).toFixed(1)} % Streupunkte)`);
  for (const p of patches.slice(0, 5))
    lines.push(`              · ${p.n} px   x${p.bx0}–${p.bx1} y${p.by0}–${p.by1}`);
  // KEIN Urteil, mit Grund (C5, ehrlich gemeldet): drei Fassungen dieses Zählers
  // haben je einen anderen Fehler gemacht — »jeder bytegleiche Nachbar« meldete
  // Gold, Seitenblock und Besatz (6 494 px am Buch), der Farb-Kasten war für das
  // Buch zu eng und für die Tasche zu weit, die Farbwolke mit Umschließung kommt
  // dem Befund nahe, zählt aber am Buch 953 px, für die ich keine Zeile im Bild
  // benennen kann (von Hand gemessen sind es 124 sichtbare kühle Reste). Eine
  // Zahl, die ich nicht erklären kann, darf kein rotes Licht auslösen. Also: sie
  // wird GEDRUCKT, damit der Prüfer weiß, WO er hinsehen muss, und das Urteil
  // fällt an der Struktur-Quote und am blinden Blatt-Prüfer. Offene Frage an den
  // Architekten (C5-Report, D-386).
  if (patches.length > 0)
    lines.push(`              (kein Urteil — Hinweis für den Blatt-Prüfer: hier zuerst hinsehen)`);

  return { lines, fail };
}

// ── die Blätter ──────────────────────────────────────────────────────────────
// `pieces` ist [Zellindex, Stem]. Die Zellordnung ist NICHT aus dem Lieferschein
// übernommen, sondern gemessen: der Inhaltskasten jeder Zelle wurde gegen die
// Bestandsmaße gehalten und stimmt bei allen neun Zellen exakt überein.
const SHEETS = [
  {
    file: "batch-aq12/eraser_recolour.png", cols: 4, rows: 2,
    pieces: [[0, "eraser_a"], [1, "eraser_b"], [2, "eraser_act"], [3, "eraser_dazed"], [4, "eraser_squash"]],
    note: "RADIERGUMMI blau → rosa · Prüfer: ANGENOMMEN · Zellen 5–7 sind Reserve",
  },
  {
    file: "batch-aq12/pen_recolour.png", cols: 4, rows: 1,
    pieces: [[0, "pen_a"], [1, "pen_b"], [2, "pen_act"], [3, "pen_dazed"]],
    note: "FÜLLFEDER Warm-Mitte 39,1° → 58,0° · Prüfer: ANGENOMMEN mit Saum-Befund",
  },
];

const notes = [];
const written = [];
const failures = [];

const sheetOf = (rel) => {
  const p = path.join(LAB, rel);
  return fs.existsSync(p) ? read(p) : null;
};

// ── CLI: die Abnahme-Probe und ihr Selbsttest ────────────────────────────────
if (process.argv.includes("--selftest")) {
  // Ein Maß, das nichts zurückweist, misst nichts. Der Selbsttest baut deshalb
  // den Fall, in dem RICHTIG und PLAUSIBEL-FALSCH auseinandergehen: eine flache
  // Füllung trifft dieselbe Farbe wie eine echte Umfärbung und hat trotzdem kein
  // Bild mehr. Genau daran ist AQ12d gescheitert, und genau das hat der
  // Lieferschein »PASS« genannt.
  const SZ = 60;
  const make = (fn) => {
    const png = new PNG({ width: SZ, height: SZ });
    for (let y = 0; y < SZ; y++) for (let x = 0; x < SZ; x++) {
      const i = (y * SZ + x) * 4;
      const [r, g, b] = fn(x, y);
      png.data[i] = r; png.data[i + 1] = g; png.data[i + 2] = b; png.data[i + 3] = 255;
    }
    return png;
  };
  // Bestand: blau mit Wolken (Helligkeit moduliert)
  const mod = (x, y) => 0.5 + 0.35 * Math.sin(x / 3.1) * Math.cos(y / 2.7);
  const incumbent = make((x, y) => { const m = mod(x, y); return [40 * m, 70 * m, 190 * m]; });
  // (a) ehrliche Umfärbung: Farbton gedreht, Modulation behalten
  const good = make((x, y) => { const m = mod(x, y); return [200 * m, 40 * m, 30 * m]; });
  // (b) flache Füllung in derselben Farbfamilie — die Falle
  const flat = make(() => [200 * 0.5, 40 * 0.5, 30 * 0.5]);
  // (c) ehrliche Umfärbung mit einem stehengebliebenen Bestandsflicken
  const patch = make((x, y) => {
    const m = mod(x, y);
    if (x >= 20 && x < 35 && y >= 20 && y < 35) return [40 * m, 70 * m, 190 * m];
    return [200 * m, 40 * m, 30 * m];
  });

  const cases = [
    ["ehrliche Umfärbung besteht", good, (f) => f.length === 0],
    ["flache Füllung fällt an der STRUKTUR", flat, (f) => f.some((m) => m.includes("Struktur-Quote"))],
    ["stehengebliebener Flicken wird als Fundort GEMELDET", patch, (f, lines) =>
      lines.some((l) => /·\s+\d+ px\s+x2\d–3\d y2\d–3\d/.test(l))],
  ];
  let bad = 0;
  for (const [name, sheet, ok] of cases) {
    const { fail, lines } = probeSheet(incumbent, sheet);
    const pass = ok(fail, lines);
    if (!pass) bad++;
    console.log(`  ${pass ? "✓" : "✗"} ${name}${fail.length > 0 ? `  →  ${fail.join(" · ")}` : ""}`);
  }
  if (bad > 0) {
    console.error(`\nimport-batch-aq12 --selftest: ${bad} Fall/Fälle nicht wie erwartet`);
    process.exit(1);
  }
  console.log("\nimport-batch-aq12 --selftest: OK — die Probe sieht ihr rotes Licht an der flachen Füllung, meldet den Flicken als Fundort und lässt die ehrliche Umfärbung durch");
  process.exit(0);
}

if (process.argv.includes("--probe")) {
  const at = process.argv.indexOf("--probe");
  const stem = process.argv[at + 1], file = process.argv[at + 2];
  if (!stem || !file) {
    console.error("usage: node docs/art/import-batch-aq12.mjs --probe <stem> <lieferung.png>");
    process.exit(2);
  }
  const dest = path.join(OUT, `${stem}.png`);
  if (!fs.existsSync(dest)) { console.error(`✗ kein Bestand: ${dest}`); process.exit(2); }
  if (!fs.existsSync(file)) { console.error(`✗ keine Lieferung: ${file}`); process.exit(2); }
  const { lines, fail } = probeSheet(read(dest), read(file));
  console.log(`\nABNAHME-PROBE · ${stem}`);
  console.log(`  Bestand   ${dest}`);
  console.log(`  Lieferung ${file}\n`);
  for (const l of lines) console.log(`  ${l}`);
  console.log("");
  if (fail.length > 0) {
    for (const f of fail) console.error(`  ✗ ${f}`);
    console.error(`\nABNAHME: ZURÜCK — ${fail.length} Bestell-Zahl(en) verfehlt. Der blinde Blatt-Prüfer entscheidet zusätzlich (R91/R133/R152), nie diese Probe allein.`);
    process.exit(1);
  }
  console.log("  ABNAHME: die Zahlen stimmen. Jetzt entscheidet der blinde Blatt-Prüfer in ZWEI Größen (R133/R152) — erst danach wird importiert.");
  process.exit(0);
}

// ── der Import ───────────────────────────────────────────────────────────────
for (const sheet of SHEETS) {
  const png = sheetOf(sheet.file);
  if (png === null) { failures.push(`source sheet MISSING: ${sheet.file}`); continue; }
  const cw = png.width / sheet.cols;
  const chh = png.height / sheet.rows;
  if (!Number.isInteger(cw) || !Number.isInteger(chh)) {
    failures.push(`${sheet.file}: ${png.width}×${png.height} does not divide into ${sheet.cols}×${sheet.rows}`);
    continue;
  }
  notes.push(`· ${sheet.note}`);

  for (const [pos, stem] of sheet.pieces) {
    const img = crop(png, (pos % sheet.cols) * cw, Math.floor(pos / sheet.cols) * chh, cw, chh);
    const impure = impureKey(img);
    chromaKey(img);
    const fringed = defringe(img);

    const box = contentBox(img);
    if (!box) { failures.push(`${stem}: keyed to nothing`); continue; }
    const out = crop(img, box.x0, box.y0, box.x1 - box.x0 + 1, box.y1 - box.y0 + 1);

    // ── GRÖSSEN-VERTRAG, gelesen von der Platte ──────────────────────────────
    const dest = path.join(OUT, `${stem}.png`);
    if (!fs.existsSync(dest)) {
      failures.push(`${stem}: this import REPLACES an existing sheet, but ${dest} is not on disk — a new stem would need a wiring decision and a DEAD_ART slot`);
      continue;
    }
    const incumbent = read(dest);
    if (out.width !== incumbent.width || out.height !== incumbent.height) {
      failures.push(`${stem}: cut to ${out.width}×${out.height}, the sheet it replaces is ${incumbent.width}×${incumbent.height} — the engine normalises HEIGHT and derives width from the aspect, so a different box silently re-proportions the pose`);
      continue;
    }

    // ── BESTANDS-SCHABLONE gegen Alpha-Geister ───────────────────────────────
    const { ghosts, holes } = stencil(out, incumbent);

    const dist = keyDistance(out);
    if (dist.euclid < 150) {
      failures.push(`${stem}: a painted pixel sits ${dist.euclid.toFixed(2)} (Euclidean) from the import colour — needs ≥150, or a tolerant key eats it`);
      continue;
    }

    if (!DRY) fs.writeFileSync(dest, PNG.sync.write(out));
    written.push(
      `overwrote ${stem}.png`.padEnd(30)
      + `${out.width}×${out.height}`.padEnd(10)
      + `key ${dist.euclid.toFixed(1)}e/${dist.manhattan}m`.padEnd(20)
      + `Saum ${String(fringed).padStart(4)}  unreiner Schlüssel ${String(impure).padStart(4)}  `
      + `Geister ${String(ghosts).padStart(4)}  Löcher ${String(holes).padStart(4)}`,
    );
  }
}

for (const n of notes) console.log(n);
console.log("");
for (const w of written) console.log(`  ${DRY ? "[dry] " : ""}${w}`);
console.log("");
console.log("  Saum = vom defringe gelöschte Schlüssel-Randpixel · unreiner Schlüssel = in Toleranz, aber nicht exakt #FF00FF");
console.log("  Geister = gemalt, wo der Bestand transparent ist (von der Schablone entfernt) · Löcher = Bestand malt, Lieferung nicht");
console.log("");
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq12: ${failures.length} failure(s) — nothing about this delivery is accepted`);
  process.exit(1);
}
console.log(`import-batch-aq12: OK — ${written.length} stem(s)${DRY ? " (dry run, nothing written)" : ""}`);
