// R5-W6b · E7 · DER BEWEIS, DASS DIE ABKÜRZUNG DIESELBE LISTE ERGIBT.
//
// `buildTerrain` hat das Gitter bis zu acht Mal vollständig durchsucht;
// `terrain.ts` ersetzt das durch EINEN Durchgang plus Kandidatenlisten. Eine
// solche Umstellung ist entweder bildgleich oder wertlos — also steht die ALTE
// Rechnung hier wörtlich daneben, und beide werden gegeneinander gehalten:
// über alle fünf echten ch01-Flächen UND über erfundene Gitter, denn ch01
// enthält weder Planke noch Stachel noch Eis noch einen Steigungs-Glyph. Ein
// Test, der nur ch01 sieht, prüft die Hälfte der Zweige nicht.
//
// Verglichen wird die REIHENFOLGE mit: bei gleicher Tiefe entscheidet die
// Anlage-Reihenfolge, was oben liegt. Zwei Listen mit denselben Ketten in
// anderer Ordnung sind zwei verschiedene Bilder.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { type Grid, glyphAt, isSlope, isSolid } from "./collide.ts";
import { type Cell, type Run, cellsOf, indexTerrain, mergeRowMajor, runsFrom } from "./terrain.ts";

// ── die ALTE Rechnung, wörtlich aus PaintScene#buildTerrain @2a9b7a2 ─────────
// (nur `this.grid` → `grid` und die Zeichen-Rückrufe entfernt; die Logik ist
// Zeichen für Zeichen dieselbe.)
const runsNaive = (grid: Grid, pred: (c: number, r: number) => boolean): Run[] => {
  const h = grid.length;
  const w = grid[0]?.length ?? 0;
  const out: Run[] = [];
  for (let r = 0; r < h; r++) {
    let c = 0;
    while (c < w) {
      if (!pred(c, r)) { c++; continue; }
      let c1 = c;
      while (c1 + 1 < w && pred(c1 + 1, r)) c1++;
      out.push({ c0: c, c1, r });
      c = c1 + 1;
    }
  }
  return out;
};

/** Zeilenweise Zellenliste aus einem vollen Scan — die Referenz für den Index. */
const scanNaive = (grid: Grid, keep: (g: string, c: number, r: number) => boolean): Cell[] => {
  const out: Cell[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[0]?.length ?? 0); c++) {
      if (keep(glyphAt(grid, c, r), c, r)) out.push({ c, r });
    }
  }
  return out;
};

// ── die echten Flächen ───────────────────────────────────────────────────────
const CONTENT = path.resolve(__dirname, "../../../content/corpus/stories");
const realGrids: Array<{ id: string; grid: Grid }> = [];
if (fs.existsSync(CONTENT)) {
  for (const story of fs.readdirSync(CONTENT)) {
    const paintDir = path.join(CONTENT, story, "paint");
    if (!fs.existsSync(paintDir)) continue;
    for (const f of fs.readdirSync(paintDir).filter((x) => x.endsWith(".level.json"))) {
      const level = JSON.parse(fs.readFileSync(path.join(paintDir, f), "utf8")) as {
        draft?: boolean;
        phases: Array<{ id: string; rows: string[] }>;
        arena?: { id: string; rows: string[] } | null;
        bonus?: { id: string; rows: string[] } | null;
      };
      if (level.draft === true) continue;
      for (const p of [...level.phases, ...(level.arena ? [level.arena] : []), ...(level.bonus ? [level.bonus] : [])]) {
        if (p.rows.length > 0) realGrids.push({ id: `${f}·${p.id}`, grid: p.rows });
      }
    }
  }
}

// ── erfundene Gitter: jeder Zweig, den ch01 nicht hat ────────────────────────
// Absichtlich mit Lücken, Rändern, Einzelzellen und zwei Ketten in EINER Zeile:
// genau dort trennen sich »maximale Kette« und »irgendeine Kette«.
const madeUp: Array<{ id: string; grid: Grid }> = [
  { id: "planken mit Lücke", grid: ["........", ".==.===.", "########", "........"] },
  { id: "stacheln am Rand", grid: ["^......^", "^^....^^", "########", "........"] },
  { id: "eis und feste Decke", grid: ["########", "~~..~~~~", "........", "..~~~..."] },
  { id: "alle Steigungen", grid: ["/\\1234z.", "########", "........", "........"] },
  { id: "baumkrone mit Loch", grid: ["###.####", "##..####", "........", "########"] },
  { id: "tinte, mehrere Spiegel", grid: ["........", "ww..wwww", "ww..wwww", "########"] },
  { id: "einzelne Zellen", grid: ["=.^.~.w.", "........", "#.#.#.#.", "........"] },
  { id: "alles voll", grid: ["########", "########", "########", "########"] },
  { id: "alles leer", grid: ["........", "........", "........", "........"] },
  { id: "eine Zeile", grid: ["=^~w#/\\z"] },
];

const allGrids = [...realGrids, ...madeUp];

// ── die sieben echten Prädikate aus buildTerrain, samt ihrer Kandidatenquelle ─
type Pass = {
  name: string;
  pred: (grid: Grid, kit: boolean) => (c: number, r: number) => boolean;
  candidates: (grid: Grid, idx: ReturnType<typeof indexTerrain>, kit: boolean) => readonly Cell[];
};
const passes: Pass[] = [
  {
    name: "baumkronen-saum",
    pred: (grid) => (c, r) => r <= 1 && isSolid(glyphAt(grid, c, r)) && !isSolid(glyphAt(grid, c, r + 1)),
    candidates: (_g, idx) => idx.solid.filter((x) => x.r <= 1),
  },
  {
    name: "planke",
    pred: (grid) => (c, r) => glyphAt(grid, c, r) === "=",
    candidates: (_g, idx) => cellsOf(idx, "="),
  },
  {
    name: "stachel",
    pred: (grid) => (c, r) => glyphAt(grid, c, r) === "^",
    candidates: (_g, idx) => cellsOf(idx, "^"),
  },
  {
    name: "tintenspiegel",
    pred: (grid) => (c, r) => glyphAt(grid, c, r) === "w" && glyphAt(grid, c, r - 1) !== "w",
    candidates: (_g, idx) => cellsOf(idx, "w"),
  },
  {
    name: "grubenboden",
    pred: (grid) => (c, r) => r > 1 && isSolid(glyphAt(grid, c, r)) && isSolid(glyphAt(grid, c, r - 1)) && glyphAt(grid, c, r) !== "~",
    candidates: (_g, idx) => idx.solid.filter((x) => x.r > 1),
  },
  {
    name: "bodenstreifen",
    pred: (grid) => (c, r) => {
      if (r <= 2) return false;
      const g = glyphAt(grid, c, r);
      if (!isSolid(g) || g === "~") return false;
      for (let k = 1; k <= 3; k++) if (isSolid(glyphAt(grid, c, r - k))) return false;
      return !isSlope(glyphAt(grid, c, r - 1));
    },
    candidates: (_g, idx) => idx.solid.filter((x) => x.r > 2),
  },
  {
    name: "eisstreifen",
    pred: (grid, kit) => (c, r) => {
      if (r < 3) return false;
      const g = glyphAt(grid, c, r);
      return (g === "~" || (!kit && g === "z")) && !isSolid(glyphAt(grid, c, r - 1));
    },
    candidates: (_g, idx, kit) => (kit ? cellsOf(idx, "~") : mergeRowMajor(cellsOf(idx, "~"), cellsOf(idx, "z"))),
  },
];

describe("terrain-Index (E7, D-323)", () => {
  it("findet echte Flächen zum Prüfen (sonst prüft dieser Test nichts)", () => {
    expect(realGrids.length).toBeGreaterThanOrEqual(5);
  });

  it("der Index enthält jede Zelle genau einmal, unter ihrem eigenen Zeichen", () => {
    for (const { id, grid } of allGrids) {
      const idx = indexTerrain(grid);
      const total = [...idx.byGlyph.values()].reduce((a, l) => a + l.length, 0);
      expect(total, id).toBe(idx.w * idx.h);
      for (const [glyph, cells] of idx.byGlyph) {
        expect(cells, `${id}/${glyph}`).toEqual(scanNaive(grid, (g) => g === glyph));
      }
      expect(idx.solid, `${id}/fest`).toEqual(scanNaive(grid, (g) => isSolid(g)));
      expect(idx.slope, `${id}/steigung`).toEqual(scanNaive(grid, (g) => isSlope(g) && !isSolid(g)));
    }
  });

  it("mergeRowMajor stellt die Zeilenordnung her, die die Anlage-Reihenfolge IST", () => {
    for (const { id, grid } of allGrids) {
      const idx = indexTerrain(grid);
      const merged = mergeRowMajor(cellsOf(idx, "="), cellsOf(idx, "^"), cellsOf(idx, "w"));
      expect(merged, id).toEqual(scanNaive(grid, (g) => g === "=" || g === "^" || g === "w"));
    }
  });

  for (const pass of passes) {
    it(`${pass.name}: dieselben Ketten in derselben Reihenfolge wie der volle Scan`, () => {
      for (const kit of [true, false]) {
        for (const { id, grid } of allGrids) {
          const idx = indexTerrain(grid);
          const pred = pass.pred(grid, kit);
          expect(runsFrom(pass.candidates(grid, idx, kit), pred), `${id} (kit=${kit})`)
            .toEqual(runsNaive(grid, pred));
        }
      }
    });
  }

  // ── TAMPER: der Test muss rot werden können, sonst beweist er nichts ───────
  // Getampert wird gegen den MESSWERT (die Kandidatenliste), nie gegen die
  // Erwartung (P-71). Und dass der Tamper wirklich sass, wird erzwungen: eine
  // Manipulation, die nichts verändert hat, hat nichts bewiesen.
  it("TAMPER · eine Kandidatenliste mit EINER fehlenden Zelle wird erkannt", () => {
    const grid = ["........", ".==.===.", "########", "........"];
    const idx = indexTerrain(grid);
    const pred = (c: number, r: number): boolean => glyphAt(grid, c, r) === "=";
    const voll = cellsOf(idx, "=");
    expect(voll.length).toBeGreaterThan(2);
    const verstuemmelt = voll.filter((_, i) => i !== 1); // genau eine Zelle fehlt
    expect(verstuemmelt.length).toBe(voll.length - 1); // der Tamper sass wirklich
    expect(runsFrom(voll, pred)).toEqual(runsNaive(grid, pred));
    expect(runsFrom(verstuemmelt, pred)).not.toEqual(runsNaive(grid, pred));
  });

  it("TAMPER · eine Kandidatenliste in falscher Reihenfolge wird erkannt", () => {
    const grid = ["........", ".==.===.", "########", "........"];
    const idx = indexTerrain(grid);
    const pred = (c: number, r: number): boolean => glyphAt(grid, c, r) === "=";
    const gedreht = [...cellsOf(idx, "=")].reverse();
    expect(gedreht[0]).not.toEqual(cellsOf(idx, "=")[0]); // der Tamper sass
    expect(runsFrom(gedreht, pred)).not.toEqual(runsNaive(grid, pred));
  });
});
