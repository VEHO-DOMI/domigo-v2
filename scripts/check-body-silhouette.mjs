#!/usr/bin/env node
/**
 * R6 · DAS SILHOUETTEN-TOR — hält ein Körper-Gemälde seinen Zell-Vertrag?
 *
 * Drei Gesetze, alle am PNG selbst gemessen (nie an einer Selbstauskunft):
 *   1 · KERN-DECKUNG   — das innere 80 %-Fenster jeder Masken-Zelle ist ≥98 % opak.
 *   2 · ALPHA-EHRLICHKEIT — außerhalb von Maske+Overpaint(+Fransen-Gürtel 16 px)
 *       ist ≤0,5 % opak: nichts darf begehbar AUSSEHEN, was es nicht ist.
 *   3 · LAUF-LINIE     — über jeder Steh-Zelle beginnt die Malerei im Fenster
 *       [Zellkante−8 px, Zellkante+2 px]: die gemalte Kante IST die Kollision.
 *   4 · KEIN LOCH      — keine Pflicht-Zelle ist flach UND schwarz (SD < 2 bei
 *       Luminanz < 8). Deckendes Schwarz erfüllt Gesetz 1 und ist doch nichts.
 *
 * Aufrufe:
 *   node scripts/check-body-silhouette.mjs                      # alle CH01_BODIES
 *   node scripts/check-body-silhouette.mjs --sheet <png> --exemplar   # Wareneingang
 *   node scripts/check-body-silhouette.mjs --selftest           # drei Tamper
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { CH01_BODIES, DECLARED_BODIES, P2_EXEMPLAR_BODY, bodyCells, gridOf } from "../packages/game-paint/src/visualBodies.ts";
import { glyphAt, isSolid } from "../packages/game-paint/src/collide.ts";

const ART_DIR = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");
const LEVEL = path.join(process.cwd(), "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const OPAQUE = 128;   // Alpha-Schwelle „sichtbar deckend"
const FAINT = 16;     // Alpha-Schwelle „überhaupt vorhanden" (Gesetz 2)
const FRINGE_PX = 16; // Fransen-Gürtel um Masken-Zellen (K6 erlaubt Überhänge)
const VOID_SD = 2;    // Struktur-Schwelle „flach" (Gesetz 4)
const VOID_L = 8;     // Luminanz-Schwelle „schwarz" (Gesetz 4)

const levelGrids = () => JSON.parse(fs.readFileSync(LEVEL, "utf8"));

/** Misst die drei Gesetze eines Körpers an einem PNG. Gibt Fehlerzeilen zurück. */
export const measureBody = (body, png, grid) => {
  const errors = [];
  const px = body.pxPerCell;
  const wantW = Math.max(...body.rows.map((r) => r.length), 1) * px + body.overpaint.l + body.overpaint.r;
  const wantH = body.rows.length * px + body.overpaint.t + body.overpaint.b;
  if (png.width !== wantW || png.height !== wantH) {
    errors.push(`Blattmaß ${png.width}×${png.height}, Vertrag ${wantW}×${wantH}`);
    return errors; // ohne Maß stimmt keine weitere Geometrie
  }
  const alphaAt = (x, y) => (x < 0 || y < 0 || x >= png.width || y >= png.height)
    ? 0 : (png.data[(y * png.width + x) * 4 + 3] ?? 0);
  const inMask = new Set();
  body.rows.forEach((row, dr) => {
    for (let dc = 0; dc < row.length; dc++) if (row[dc] === "#") inMask.add(`${dc},${dr}`);
  });

  // Gesetz 1 · Kern-Deckung
  for (const key of inMask) {
    const [dc, dr] = key.split(",").map(Number);
    const x0 = body.overpaint.l + dc * px, y0 = body.overpaint.t + dr * px;
    const m = Math.round(px * 0.1);
    let opaque = 0, total = 0;
    for (let y = y0 + m; y < y0 + px - m; y++) {
      for (let x = x0 + m; x < x0 + px - m; x++) { total++; if (alphaAt(x, y) >= OPAQUE) opaque++; }
    }
    if (opaque / total < 0.98) {
      errors.push(`Kern-Deckung Zelle (${body.c0 + dc},${body.r0 + dr}): ${(100 * opaque / total).toFixed(1)} % < 98 %`);
    }
  }

  // Gesetz 2 · Alpha-Ehrlichkeit (mit Fransen-Gürtel um Masken-Zellen)
  const nearMask = (x, y) => {
    const dc = Math.floor((x - body.overpaint.l) / px), dr = Math.floor((y - body.overpaint.t) / px);
    for (let a = dr - 1; a <= dr + 1; a++) {
      for (let b = dc - 1; b <= dc + 1; b++) {
        if (!inMask.has(`${b},${a}`)) continue;
        const cx0 = body.overpaint.l + b * px - FRINGE_PX, cy0 = body.overpaint.t + a * px - FRINGE_PX;
        if (x >= cx0 && x < cx0 + px + 2 * FRINGE_PX && y >= cy0 && y < cy0 + px + 2 * FRINGE_PX) return true;
      }
    }
    return false;
  };
  let outsideTotal = 0, outsideInk = 0;
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      if (nearMask(x, y)) continue;
      outsideTotal++;
      if (alphaAt(x, y) >= FAINT) outsideInk++;
    }
  }
  if (outsideTotal > 0 && outsideInk / outsideTotal > 0.005) {
    errors.push(`Alpha außerhalb Maske+Gürtel: ${(100 * outsideInk / outsideTotal).toFixed(2)} % > 0,50 %`);
  }

  // Gesetz 3 · Lauf-Linie über jeder Steh-Zelle (Zelle im Körper, darüber keine Grid-Masse)
  for (const key of inMask) {
    const [dc, dr] = key.split(",").map(Number);
    const c = body.c0 + dc, r = body.r0 + dr;
    if (grid !== null && isSolid(glyphAt(grid, c, r - 1))) continue; // verdeckt
    if (inMask.has(`${dc},${dr - 1}`)) continue;
    const x0 = body.overpaint.l + dc * px, cellTop = body.overpaint.t + dr * px;
    let first = null;
    for (let y = Math.max(0, cellTop - px); y < cellTop + px && first === null; y++) {
      for (let x = x0 + 2; x < x0 + px - 2; x++) {
        if (alphaAt(x, y) >= OPAQUE) { first = y; break; }
      }
    }
    if (first === null || first < cellTop - 8 || first > cellTop + 2) {
      errors.push(`Lauf-Linie (${c},${r}): erste opake Zeile ${first ?? "—"}, Fenster [${cellTop - 8}, ${cellTop + 2}]`);
    }
  }
  // Gesetz 4 · KEIN LOCH. Die drei Gesetze oben messen ALPHA — und deckendes
  // Schwarz ist deckend. N7A1 hat die Lücke bezahlt: zwei p1-Blätter kamen mit
  // 100 % Deckung durch alle drei Gesetze, während 17 bzw. 15 Pflicht-Zellen
  // reines Schwarz waren (L = 0,0 · SD = 0,00) — der Maler hatte den Boden zu
  // früh abreißen lassen und den Rest gefüllt. Ein Kind wäre über ein schwarzes
  // Rechteck gelaufen, und kein Tor hätte es gesagt.
  //
  // Gemalte Dunkelheit hat Struktur: die dunkelste Zelle der ANGENOMMENEN
  // p2-Welle misst L = 10,8 (Exemplar 13,2; Ostwand 14,1), die schwächste
  // Struktur SD = 3,72. Ein Loch hat beides nicht.
  //
  // ★ N7A2 (2026-09-02): DIE ZWEITE HÄLFTE DER SCHWELLE WAR DIE LÜCKE.
  // Sie lautete „flach UND schwarz" (SD < 2 UND L < 8) — und die p3-Lieferung
  // kam mit 100 % Deckung durch alle vier Gesetze, während **136 ihrer 493
  // Pflicht-Zellen** ein völlig gleichförmiges Braun waren: rgb 83,60,36,
  // SD 0,00, Luminanz 24,8. Flach genug für die erste Bedingung, hell genug für
  // die zweite — also grün. Das ist derselbe Trick, den N7A1 in Schwarz bezahlt
  // hat, eine Sprosse höher.
  //
  // Der Kommentar unter dieser Zeile sagte schon immer, worum es geht: „sie
  // trennt nicht dunkel von hell, sondern gemalt von gefüllt". Genau das tut sie
  // jetzt — die Luminanz-Bedingung fällt, die Zahl bleibt in der Meldung.
  // GEMESSEN, bevor sie fiel: von den **1039 Pflicht-Zellen der abgenommenen
  // p1/p2-Wellen liegt KEINE unter SD 2**, die schwächste bei 3,72 (86 %
  // Luft über der Schwelle). Eine reine SD-Schwelle bricht also nichts, was
  // Koki angenommen hat — sie schließt nur das Schlupfloch.
  for (const key of inMask) {
    const [dc, dr] = key.split(",").map(Number);
    const x0 = body.overpaint.l + dc * px, y0 = body.overpaint.t + dr * px;
    const m = Math.round(px * 0.1);
    const values = [];
    for (let y = y0 + m; y < y0 + px - m; y++) {
      for (let x = x0 + m; x < x0 + px - m; x++) {
        const i = (y * png.width + x) * 4;
        if (alphaAt(x, y) >= OPAQUE) {
          values.push(0.299 * (png.data[i] ?? 0) + 0.587 * (png.data[i + 1] ?? 0) + 0.114 * (png.data[i + 2] ?? 0));
        }
      }
    }
    if (values.length === 0) continue; // Gesetz 1 hat das schon gemeldet
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sd = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);
    if (sd < VOID_SD) {
      errors.push(`Fuellung statt Malerei (${body.c0 + dc},${body.r0 + dr}): Wert-SD ${sd.toFixed(2)} < ${VOID_SD} bei Luminanz ${mean.toFixed(1)} — eine Zelle ohne Struktur ist gefuellt, nicht gemalt (schwaechste angenommene Zelle: SD 3,72)`);
    }
  }
  return errors;
};

const synthSheet = (body, mutate) => {
  const px = body.pxPerCell;
  const w = Math.max(...body.rows.map((r) => r.length), 1) * px + body.overpaint.l + body.overpaint.r;
  const h = body.rows.length * px + body.overpaint.t + body.overpaint.b;
  const png = new PNG({ width: w, height: h });
  body.rows.forEach((row, dr) => {
    for (let dc = 0; dc < row.length; dc++) {
      if (row[dc] !== "#") continue;
      for (let y = body.overpaint.t + dr * px; y < body.overpaint.t + (dr + 1) * px; y++) {
        for (let x = body.overpaint.l + dc * px; x < body.overpaint.l + (dc + 1) * px; x++) {
          const i = (y * w + x) * 4;
          // ★ N7A2 · DAS PRUEFBLATT MUSS GEMALTE MATERIE SEIN, NICHT FARBE.
          // Hier stand ein flacher Ton (90,70,120, SD 0,00) — sauber genug fuer
          // die alte Fassung von Gesetz 4, die zusaetzlich Dunkelheit verlangte.
          // Mit der reinen Struktur-Schwelle faellt die eigene Vorrichtung durch,
          // und das ist die richtige Antwort: eine Fixture, die das Gesetz bricht,
          // kann es nicht pruefen. Die Stoerung ist DETERMINISTISCH (kein Zufall,
          // sonst flackert der Test) und ergibt SD ~ 14 je Zelle — im Feld der
          // angenommenen Kunst (3,72 bis 33,85).
          const n = ((x * 7 + y * 13) % 17) * 3;
          png.data[i] = 90 + n; png.data[i + 1] = 70 + n; png.data[i + 2] = 120 + n; png.data[i + 3] = 255;
        }
      }
    }
  });
  mutate?.(png, w, h);
  return png;
};

const selftest = () => {
  // L-Form mit 64er-Zellen: der leere Quadrant (oben rechts) hat jenseits des
  // 16-px-Fransen-Gürtels echtes »Außen«-Territorium für Gesetz 2.
  const body = { id: "st", stem: "st", c0: 1, r0: 1, rows: ["#.", "##"], pxPerCell: 64, overpaint: { l: 0, r: 0, t: 8, b: 8 } };
  const grid = ["....", ".#..", ".##.", "...."];
  const clean = measureBody(body, synthSheet(body), grid);
  if (clean.length !== 0) { console.error("Selbsttest: sauberes Blatt fällt durch:", clean); return 1; }
  const tampers = [
    ["Kern-Loch", (png, w) => { for (let d = 0; d < 40; d++) for (let e = 0; e < 40; e++) png.data[(((8 + 76 + d) * w + 12 + e) * 4) + 3] = 0; }],
    // Geister-Blob mitten im leeren Quadranten (Zelle dc1/dr0), >16 px von jeder Masken-Zelle
    ["Geister-Fläche", (png, w) => { for (let d = 0; d < 28; d++) for (let e = 0; e < 28; e++) { const i = (((8 + 18 + d) * w + 64 + 18 + e) * 4); png.data[i + 3] = 255; png.data[i] = 200; } }],
    ["Lauf-Linie versackt", (png, w) => { for (let x = 0; x < 64; x++) for (let y = 8; y < 8 + 14; y++) png.data[(y * w + x) * 4 + 3] = 0; }],
    // Gesetz 4: die Zelle bleibt voll deckend — nur schwarz. Genau die Lieferung,
    // die N7A1 mit 100 % Deckung durch die ersten drei Gesetze brachte.
    ["Loch statt Malerei", (png, w) => { for (let y = 8 + 64; y < 8 + 128; y++) for (let x = 0; x < 64; x++) { const i = (y * w + x) * 4; png.data[i] = 0; png.data[i + 1] = 0; png.data[i + 2] = 0; png.data[i + 3] = 255; } }],
    // ★ N7A2 · DERSELBE TRICK IN MITTLERER HELLIGKEIT — der Fall, der die alte
    // Fassung passiert hat. rgb 83,60,36 ist woertlich die Fuellung, mit der die
    // erste p3-Lieferung 136 ihrer 493 Pflicht-Zellen gedeckt hat: SD 0,00 bei
    // Luminanz 24,8. Flach genug fuer die erste Bedingung, hell genug fuer die
    // zweite — also gruen. Ohne diesen Fall waere die Verschaerfung unbewiesen.
    ["Fuellung statt Malerei (mittelhell, nicht schwarz)", (png, w) => { for (let y = 8 + 64; y < 8 + 128; y++) for (let x = 0; x < 64; x++) { const i = (y * w + x) * 4; png.data[i] = 83; png.data[i + 1] = 60; png.data[i + 2] = 36; png.data[i + 3] = 255; } }],
  ];
  for (const [name, mutate] of tampers) {
    const errors = measureBody(body, synthSheet(body, mutate), grid);
    if (errors.length === 0) { console.error(`Selbsttest-TAMPER "${name}" blieb GRÜN`); return 1; }
  }
  // N7A1 · DAS RASTER KOMMT AUS DER GETEILTEN AUFLÖSUNG. p4 wohnt in `arena`,
  // p9 in `bonus`; vorher las dieses Tor `level.phases[idx]` und wäre an jedem
  // p4-/p9-Körper abgestürzt — ein Tor, das nur die Räume kennt, für die es je
  // gelaufen ist. Der Fall misst einen Dummy-Körper GEGEN das Arena-Raster.
  const level = levelGrids();
  const arena = gridOf(level, "p4");
  if (arena !== level.arena.rows) { console.error("Selbsttest: gridOf('p4') liefert nicht das Arena-Raster"); return 1; }
  let seat = null;
  for (let r = 0; r < arena.length && seat === null; r++) {
    for (let c = 0; c < (arena[r]?.length ?? 0); c++) if (isSolid(glyphAt(arena, c, r))) { seat = { c, r }; break; }
  }
  if (seat === null) { console.error("Selbsttest: das Arena-Raster hat keine solide Zelle"); return 1; }
  const p4dummy = { id: "p4_dummy", stem: "p4_dummy", c0: seat.c, r0: seat.r, rows: ["#"], pxPerCell: 64, overpaint: { l: 0, r: 0, t: 12, b: 16 } };
  const p4errors = measureBody(p4dummy, synthSheet(p4dummy), arena);
  if (p4errors.length !== 0) { console.error("Selbsttest: p4-Dummy am Arena-Raster faellt durch:", p4errors); return 1; }
  let gemeldet = false;
  try { gridOf(level, "p7"); } catch { gemeldet = true; }
  if (!gemeldet) { console.error("Selbsttest: gridOf hat eine unbekannte Phase NICHT gemeldet"); return 1; }
  console.log(`check-body-silhouette: p4 aus dem Arena-Raster gelesen (Dummy auf (${seat.c},${seat.r}), kein Absturz), unbekannte Phase meldet sich`);
  console.log("check-body-silhouette: Selbsttest OK — 1 sauber + 5 Tamper rot + p4/p9-Raster");
  return 0;
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.includes("--selftest")) return selftest();
  const jobs = [];
  if (args.includes("--exemplar") || args.includes("--body")) {
    const sheetIdx = args.indexOf("--sheet");
    const sheet = sheetIdx >= 0 ? args[sheetIdx + 1] : null;
    if (sheet === null) { console.error("Wareneingang braucht --sheet <png>"); return 1; }
    const wanted = args.includes("--body") ? args[args.indexOf("--body") + 1] : P2_EXEMPLAR_BODY.id;
    const found = DECLARED_BODIES.find((d) => d.body.id === wanted);
    if (found === undefined) {
      console.error(`unbekannter Körper: ${wanted} — deklariert sind: ${DECLARED_BODIES.map((d) => d.body.id).join(", ")}`);
      return 1;
    }
    jobs.push({ body: found.body, file: sheet, phase: found.phase });
  } else {
    for (const [phase, bodies] of Object.entries(CH01_BODIES)) {
      for (const body of bodies) {
        jobs.push({ body, file: path.join(ART_DIR, `${body.stem}.png`), phase });
      }
    }
  }
  if (jobs.length === 0) { console.log("check-body-silhouette: 0 Körper deklariert — nichts zu messen"); return 0; }
  const level = levelGrids();
  let failed = 0;
  for (const { body, file, phase } of jobs) {
    if (!fs.existsSync(file)) { console.error(`✗ ${body.id}: Blatt fehlt (${file})`); failed++; continue; }
    const png = PNG.sync.read(fs.readFileSync(file));
    const grid = gridOf(level, phase);
    const errors = measureBody(body, png, grid);
    if (errors.length === 0) {
      console.log(`✓ ${body.id} (${bodyCells(body).length} Zellen): alle vier Gesetze halten`);
    } else {
      failed++;
      console.error(`✗ ${body.id}:`);
      for (const e of errors) console.error(`    ${e}`);
    }
  }
  return failed === 0 ? 0 : 1;
};

process.exit(main());
