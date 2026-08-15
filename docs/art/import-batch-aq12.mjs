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
