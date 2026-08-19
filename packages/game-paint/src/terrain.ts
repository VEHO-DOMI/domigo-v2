// THE PAINTED BOOK — der Gitter-Index des Bodenbaus (rein, Phaser-frei).
//
// ── WOZU DIESE DATEI DA IST (R5-W6b · E7, D-323) ────────────────────────────
// `PaintScene#buildTerrain` hat das Gitter bis zu ACHT Mal vollständig
// durchlaufen: einmal die Zeichen-Schleife und danach je einmal für Baumkrone,
// Planke, Stachel, Tintenspiegel, Grubenboden, Bodenstreifen und Eisstreifen.
// Jeder dieser Läufe fragte JEDE Zelle, ob sie sein Zeichen trägt, und verwarf
// fast jede Antwort. `buildProps` war ein neunter Lauf über dieselben Zellen.
//
// Hier steht der EINE Durchgang, der das ersetzt: ein Index, der jede Zelle
// unter ihr Zeichen einsortiert. Danach holt sich jeder Bauschritt nur noch
// seine eigenen Kandidaten.
//
// ── WARUM DAS EINE EIGENE DATEI IST ─────────────────────────────────────────
// `PaintScene.ts` zieht Phaser mit und ist deshalb in keinem Test lauffähig —
// es gibt im ganzen Paket keinen einzigen PaintScene-Test. `mass.ts` hat
// dieselbe Antwort schon gegeben: was der Renderer platziert, wird ausserhalb
// der Szene geplant, damit es OHNE Browser beweisbar ist. Genau deshalb kann
// `terrain.test.ts` die alte Voll-Scan-Rechnung gegen die neue halten und
// zeigen, dass beide dieselbe Objektliste in derselben Reihenfolge ergeben.
//
// ── DAS GESETZ, AN DEM ALLES HÄNGT ──────────────────────────────────────────
// Bei gleicher Tiefe entscheidet die Reihenfolge der Anlage, was oben liegt.
// Jede Liste hier ist deshalb ZEILENWEISE von oben nach unten und in jeder
// Zeile von links nach rechts — dieselbe Reihenfolge, die die alte
// Doppelschleife hatte. Wer diese Reihenfolge ändert, ändert das Bild.

import { type Grid, glyphAt, isSlope, isSolid } from "./collide.ts";

export type Cell = { readonly c: number; readonly r: number };
/** Eine waagerechte Kette benachbarter Zellen in EINER Zeile, `c0..c1`. */
export type Run = { c0: number; c1: number; readonly r: number };

export type TerrainIndex = {
  readonly w: number;
  readonly h: number;
  /** Zellen je Zeichen, zeilenweise. Ein Zeichen ohne Zellen fehlt in der Map. */
  readonly byGlyph: ReadonlyMap<string, readonly Cell[]>;
  /** Alle festen Zellen (`#`, `~`), zeilenweise. */
  readonly solid: readonly Cell[];
  /** Alle Steigungs-Zellen (`/ \ 1 2 3 4 z`), zeilenweise. */
  readonly slope: readonly Cell[];
};

/** EIN Durchgang durch das Gitter — der einzige, der bleibt. */
export const indexTerrain = (grid: Grid): TerrainIndex => {
  const h = grid.length;
  const w = grid[0]?.length ?? 0;
  const byGlyph = new Map<string, Cell[]>();
  const solid: Cell[] = [];
  const slope: Cell[] = [];
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const g = glyphAt(grid, c, r);
      const cell = { c, r };
      const bucket = byGlyph.get(g);
      if (bucket === undefined) byGlyph.set(g, [cell]);
      else bucket.push(cell);
      if (isSolid(g)) solid.push(cell);
      else if (isSlope(g)) slope.push(cell);
    }
  }
  return { w, h, byGlyph, solid, slope };
};

/** Die Zellen eines Zeichens, zeilenweise — leere Liste, wenn es keine gibt. */
export const cellsOf = (idx: TerrainIndex, glyph: string): readonly Cell[] =>
  idx.byGlyph.get(glyph) ?? [];

/**
 * Zwei zeilenweise Listen zu EINER zeilenweisen Liste verschmelzen.
 *
 * Nötig, weil die Zeichen-Schleife mehrere Zeichenklassen in EINER Reihenfolge
 * abarbeiten muss: zwei Listen hintereinander zu durchlaufen würde die
 * Anlage-Reihenfolge und damit bei gleicher Tiefe das Bild ändern.
 */
export const mergeRowMajor = (...lists: ReadonlyArray<readonly Cell[]>): readonly Cell[] => {
  const at = lists.map(() => 0);
  const out: Cell[] = [];
  const total = lists.reduce((a, l) => a + l.length, 0);
  for (let n = 0; n < total; n++) {
    let best = -1;
    for (const [i, list] of lists.entries()) {
      const cur = list[at[i] ?? 0];
      if (cur === undefined) continue;
      const bestCell = best === -1 ? undefined : lists[best]?.[at[best] ?? 0];
      if (bestCell === undefined || cur.r < bestCell.r || (cur.r === bestCell.r && cur.c < bestCell.c)) best = i;
    }
    if (best === -1) break;
    const cell = lists[best]?.[at[best] ?? 0];
    if (cell !== undefined) out.push(cell);
    at[best] = (at[best] ?? 0) + 1;
  }
  return out;
};

/**
 * Waagerechte Ketten aus einer KANDIDATEN-Liste bilden.
 *
 * Ersetzt den alten `runs(pred, draw)`-Läufer, der dafür das ganze Gitter
 * abgesucht hat. Das Ergebnis ist Zelle für Zelle dasselbe, solange zwei
 * Bedingungen gelten — und beide prüft `terrain.test.ts` an erfundenen Gittern
 * nach, nicht nur an ch01:
 *
 *   1. Die Kandidaten sind eine OBERMENGE der Zellen, für die `pred` wahr ist.
 *      (Sonst fehlt eine Kette, und im Bild fehlt ein Stück Boden.)
 *   2. Die Kandidaten stehen zeilenweise. (Sonst zerfällt eine Kette in Teile.)
 *
 * Eine Kette bricht, sobald die nächste Kandidatenzelle nicht die unmittelbar
 * folgende Spalte derselben Zeile ist — genau das tat die alte Schleife, wenn
 * `pred` in der Lücke falsch war.
 */
export const runsFrom = (
  candidates: readonly Cell[],
  pred: (c: number, r: number) => boolean,
): Run[] => {
  const out: Run[] = [];
  let open: Run | null = null;
  for (const { c, r } of candidates) {
    if (!pred(c, r)) { open = null; continue; }
    if (open !== null && open.r === r && open.c1 === c - 1) { open.c1 = c; continue; }
    open = { c0: c, c1: c, r };
    out.push(open);
  }
  return out;
};
