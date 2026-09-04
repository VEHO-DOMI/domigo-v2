#!/usr/bin/env node
/**
 * N7 · DER SCHABLONEN-GENERATOR — das Werkzeug hinter den Magenta-Schablonen.
 *
 * Eine Schablone ist ein blattgrosses PNG, das der Maler UNTER sein Bild legt:
 * ★ N7A2c · SCHRAEGEN. Eine Masken-Zelle, die kein '#' ist, traegt das Glyph
 * ihrer Schraege (`z` `/` `\\` `1`-`4`). Dort ist nur die MATERIE-Seite unter der
 * Rutschbahn Pflicht; die Luft darueber bleibt in der Schablone LEER, weil sie
 * verbotenes Gebiet ist — ein Blatt, das die Rutsche zumauert, luegt um eine
 * halbe Zelle gegen die Kollision. Das gruene Steh-Band folgt dort der
 * Diagonale, nicht der Zell-Oberkante.
 *
 * Magenta = Pflicht-Materie (muss voll gedeckt werden), gruenes Band = die
 * Steh-Kante (dort beginnt die Malerei), transparent = verbotenes Gebiet. Genau
 * dieses Werkzeug hat die R7-Runde 1 (6 von 6 zurueckgewiesen) in Runde 2 (6 von
 * 6 angenommen) verwandelt — es lag aber nur als Prosa im Review vor, die sechs
 * PNGs wurden ohne Erzeuger committed (d89bbe4d). Gesetz aus dieser Rechnung:
 * Artefakt + Erzeuger + Selbsttest landen zusammen, sonst ist das Artefakt eine
 * Behauptung. Dies ist der nachgebaute Erzeuger.
 *
 * DER VERTRAG — am committeten Artefakt GEMESSEN, nicht aus der Prosa abgeschrieben.
 * Die sechs Schablonen in `docs/n6-auftrag/lieferung/masken/` tragen:
 *   · Zellfuellung  Magenta (255,0,255) Alpha  70   — halbdurchsichtig, damit der
 *                                                     Maler seine Malerei darunter sieht
 *   · Zellrand 2 px Magenta (255,0,255) Alpha 200   — die Zellgrenze bleibt lesbar
 *   · Band-Fuellung Gruen   (0,255,80)  Alpha 150   — die obersten 10 px einer Steh-Zelle
 *   · Band-Rand 2 px Gruen  (0,255,80)  Alpha 255
 *   · alles ausserhalb der Maske: transparent
 * Der Rand nimmt also die kraeftige Deckung derjenigen Zone, in der er liegt.
 * Das Blatt-Format ist der Zell-Vertrag des Silhouetten-Tors:
 * Breite = Spalten x pxPerCell + overpaint.l + overpaint.r, Hoehe entsprechend.
 *
 * STEH-ZELLE = Masken-Zelle, ueber der (a) keine Masken-Zelle desselben Koerpers
 * und (b) keine solide Grid-Zelle liegt. Ausserhalb des Rasters gilt LUFT — das
 * ist der eine Punkt, an dem diese Rechnung bewusst vom Silhouetten-Tor abweicht
 * (dort ist der Weltrand solide, `collide.ts#glyphAt`). Gemessen an den drei
 * Decken-Koerpern von p2, die bei r0 = 0 sitzen: sie TRAGEN ihr gruenes Band.
 * Die Schablone verlangt damit eine saubere Oberkante, wo das Tor keine fordert —
 * die strengere Seite, und die, an der die angenommene p2-Welle gemalt wurde.
 *
 * Aufrufe:
 *   node --experimental-strip-types scripts/make-body-stencils.mjs --phase p1
 *   node --experimental-strip-types scripts/make-body-stencils.mjs --phase p1 --body p1_hallenboden
 *   node --experimental-strip-types scripts/make-body-stencils.mjs --phase p1 --bodies entwurf.json
 *   node --experimental-strip-types scripts/make-body-stencils.mjs --selftest
 *
 * `--bodies` nimmt eine JSON-Datei mit einem Array von VisualBody-Objekten
 * (id, stem, c0, r0, rows, pxPerCell, overpaint) — denn die Schablone entsteht
 * VOR der Deklaration: ohne sie kann niemand das Blatt malen, das die
 * Deklaration spaeter beschreibt.
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { bodySlopeCells, slopeSurfaceInCell } from "../packages/game-paint/src/visualBodies.ts";
import { CH01_BODIES, P2_WAVE_BODIES, bodyCells, gridOf } from "../packages/game-paint/src/visualBodies.ts";
import { isSolid } from "../packages/game-paint/src/collide.ts";

const LEVEL = path.join(process.cwd(), "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const MASK_DIR = path.join(process.cwd(), "docs/n6-auftrag/lieferung/masken");

const BORDER_PX = 2;   // Zellrand
const BAND_PX = 10;    // Hoehe des Gruenbands ab Zell-Oberkante
const FILL_MAGENTA = [255, 0, 255, 70];
const EDGE_MAGENTA = [255, 0, 255, 200];
const FILL_GREEN = [0, 255, 80, 150];
const EDGE_GREEN = [0, 255, 80, 255];

/** Solide? Ausserhalb des Rasters gilt LUFT (siehe Kopf-Kommentar). */
const solidAt = (grid, c, r) => {
  const row = grid[r];
  if (row === undefined) return false;
  const glyph = row[c];
  return glyph === undefined ? false : isSolid(glyph);
};

const sheetSize = (body) => ({
  width: Math.max(...body.rows.map((r) => r.length), 1) * body.pxPerCell + body.overpaint.l + body.overpaint.r,
  height: body.rows.length * body.pxPerCell + body.overpaint.t + body.overpaint.b,
});

/** Die Schablone eines Koerpers als PNG-Objekt. Rein — kein Schreiben, kein Lesen. */
export const stencilOf = (body, grid) => {
  const px = body.pxPerCell;
  const { width, height } = sheetSize(body);
  const png = new PNG({ width, height });
  png.data.fill(0);
  // Eine Zelle gehoert dem Koerper, sobald sie nicht '.' ist — '#' solide,
  // sonst das Schraegen-Glyph. Damit gilt ein '#' UNTER einer gemalten Rampe
  // nicht mehr als Steh-Zelle: die Rampe deckt seine Kante bereits.
  const inMask = (dc, dr) => ((body.rows[dr]?.[dc] ?? ".") !== ".");
  const put = (x, y, rgba) => {
    const i = (y * width + x) * 4;
    png.data[i] = rgba[0];
    png.data[i + 1] = rgba[1];
    png.data[i + 2] = rgba[2];
    png.data[i + 3] = rgba[3];
  };
  body.rows.forEach((row, dr) => {
    for (let dc = 0; dc < row.length; dc++) {
      const kind = row[dc];
      if (kind === undefined || kind === ".") continue;
      const stand = !inMask(dc, dr - 1) && !solidAt(grid, body.c0 + dc, body.r0 + dr - 1);
      const x0 = body.overpaint.l + dc * px;
      const y0 = body.overpaint.t + dr * px;
      for (let dy = 0; dy < px; dy++) {
        for (let dx = 0; dx < px; dx++) {
          if (kind !== "#") {
            const s = slopeSurfaceInCell(kind, dx, px);
            if (dy < s) continue; // Luft ueber der Rutschbahn: die Schablone bleibt leer
            const green = dy < s + BAND_PX;
            const edge = dx < BORDER_PX || dx >= px - BORDER_PX || dy >= px - BORDER_PX || dy < s + BORDER_PX;
            put(x0 + dx, y0 + dy, green ? (edge ? EDGE_GREEN : FILL_GREEN) : (edge ? EDGE_MAGENTA : FILL_MAGENTA));
            continue;
          }
          const green = stand && dy < BAND_PX;
          const edge = dx < BORDER_PX || dx >= px - BORDER_PX || dy < BORDER_PX || dy >= px - BORDER_PX;
          put(x0 + dx, y0 + dy, green ? (edge ? EDGE_GREEN : FILL_GREEN) : (edge ? EDGE_MAGENTA : FILL_MAGENTA));
        }
      }
    }
  });
  return png;
};

/** Zwei Blaetter vergleichen. Gibt Maße + Pixel-Gleichheit in Prozent zurueck. */
export const compareSheets = (a, b) => {
  if (a.width !== b.width || a.height !== b.height) {
    return { sameSize: false, equalPct: 0, note: `${a.width}x${a.height} gegen ${b.width}x${b.height}` };
  }
  let equal = 0;
  const total = a.width * a.height;
  for (let i = 0; i < total; i++) {
    const j = i * 4;
    if (a.data[j] === b.data[j] && a.data[j + 1] === b.data[j + 1]
      && a.data[j + 2] === b.data[j + 2] && a.data[j + 3] === b.data[j + 3]) equal++;
  }
  return { sameSize: true, equalPct: (100 * equal) / total, note: `${equal}/${total} Pixel gleich` };
};

const levelGrids = () => JSON.parse(fs.readFileSync(LEVEL, "utf8"));

const SELFTEST_MIN_PCT = 99;

const selftest = () => {
  const level = levelGrids();
  const grid = gridOf(level, "p2");
  let worst = 100;
  for (const body of P2_WAVE_BODIES) {
    const file = path.join(MASK_DIR, `${body.stem}.MASKE.png`);
    if (!fs.existsSync(file)) {
      console.error(`Selbsttest: committete Schablone fehlt (${file})`);
      return 1;
    }
    const committed = PNG.sync.read(fs.readFileSync(file));
    const built = stencilOf(body, grid);
    const cmp = compareSheets(built, committed);
    if (!cmp.sameSize || cmp.equalPct < SELFTEST_MIN_PCT) {
      console.error(`✗ ${body.stem}: ${cmp.equalPct.toFixed(3)} % gleich (${cmp.note}) — verlangt sind ${SELFTEST_MIN_PCT} %`);
      return 1;
    }
    worst = Math.min(worst, cmp.equalPct);
    console.log(`✓ ${body.stem} (${bodyCells(body).length} Zellen, ${built.width}x${built.height}): ${cmp.equalPct.toFixed(3)} % Pixel-Gleichheit`);
  }

  // TAMPER · eine Masken-Zelle kippen. Das Blattmaß bleibt gleich, nur der Inhalt
  // aendert sich — der Vergleich muss also auf PIXELN rot werden, nicht auf Maßen.
  const victim = P2_WAVE_BODIES.find((b) => b.id === "p2_pultreihe_r9");
  if (victim === undefined) {
    console.error("Selbsttest: Tamper-Koerper p2_pultreihe_r9 nicht gefunden");
    return 1;
  }
  const bent = { ...victim, rows: victim.rows.map((r, i) => (i === 0 ? `.${r.slice(1)}` : r)) };
  const bentCmp = compareSheets(stencilOf(bent, grid), PNG.sync.read(fs.readFileSync(path.join(MASK_DIR, `${victim.stem}.MASKE.png`))));
  if (bentCmp.sameSize && bentCmp.equalPct >= SELFTEST_MIN_PCT) {
    console.error(`Selbsttest-TAMPER blieb GRUEN: eine gekippte Masken-Zelle ergab ${bentCmp.equalPct.toFixed(3)} % Gleichheit`);
    return 1;
  }
  console.log(`✓ Tamper: eine gekippte Masken-Zelle faellt auf ${bentCmp.equalPct.toFixed(3)} % (< ${SELFTEST_MIN_PCT} %) — rot`);
  console.log(`make-body-stencils: Selbsttest OK — 6 Schablonen nachgebaut (schlechteste ${worst.toFixed(3)} %), 1 Tamper rot`);
  return 0;
};

const readBodiesFile = (file) => {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(raw)) throw new Error(`${file}: erwartet wird ein ARRAY von VisualBody-Objekten`);
  for (const b of raw) {
    for (const key of ["id", "stem", "c0", "r0", "rows", "pxPerCell", "overpaint"]) {
      if (b?.[key] === undefined) throw new Error(`${file}: Koerper ${b?.id ?? "(ohne id)"} fehlt das Feld "${key}"`);
    }
    for (const key of ["l", "r", "t", "b"]) {
      if (b.overpaint[key] === undefined) throw new Error(`${file}: Koerper ${b.id} fehlt overpaint.${key}`);
    }
  }
  return raw;
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.includes("--selftest")) return selftest();
  const value = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : null;
  };
  const phase = value("--phase") ?? "p1";
  const bodiesFile = value("--bodies");
  const only = value("--body");
  const outDir = value("--out") ?? MASK_DIR;

  const level = levelGrids();
  const grid = gridOf(level, phase);
  let bodies = bodiesFile !== null ? readBodiesFile(bodiesFile) : [...(CH01_BODIES[phase] ?? [])];
  if (only !== null) bodies = bodies.filter((b) => b.id === only);
  if (bodies.length === 0) {
    console.error(`make-body-stencils: kein Koerper fuer Phase ${phase}${only !== null ? ` / --body ${only}` : ""}.`);
    console.error("Fuer noch UNDEKLARIERTE Koerper: --bodies <json-datei> mit einem Array von VisualBody-Objekten.");
    return 1;
  }

  fs.mkdirSync(outDir, { recursive: true });
  for (const body of bodies) {
    const png = stencilOf(body, grid);
    const file = path.join(outDir, `${body.stem}.MASKE.png`);
    fs.writeFileSync(file, PNG.sync.write(png));
    const cells = bodyCells(body);
    // dieselbe Frage wie in stencilOf: eine Zelle unter einer GEMALTEN Rampe
    // ist keine Steh-Zelle mehr, die Rampe deckt ihre Kante.
    const stand = cells.filter(({ c, r }) => {
      const dc = c - body.c0, dr = r - body.r0;
      return (body.rows[dr - 1]?.[dc] ?? ".") === "." && !solidAt(grid, c, r - 1);
    }).length;
    const schraegen = bodySlopeCells(body).length;
    const schraegText = schraegen > 0 ? `, ${schraegen} gemalte Schraegen` : "";
    console.log(`✓ ${path.relative(process.cwd(), file)} — ${png.width}x${png.height}, ${cells.length} Zellen${schraegText}, ${stand} Steh-Zellen`);
  }
  return 0;
};

process.exit(main());
