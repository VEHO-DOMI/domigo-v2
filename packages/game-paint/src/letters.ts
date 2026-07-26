// PB-C1 · THE LETTER TRAIL — doc 36 §3: "letters render their REAL glyphs".
//
// Until now every collectible drew the one painted stem `prop_letter`, which
// is a painted gold capital **A** — so a trail of eight letters spelled AAAA
// AAAA. The stem is retired from the letter face; the engine now draws the
// character itself in that stem's key (warm gold, amber contour, soft shadow).
//
// WHERE THE CHARACTERS COME FROM. The ch01 design sheet's currency row is the
// law: "trails are sentences: each breadcrumb run spells a REAL u01 word
// (P-E-N-C-I-L → the trail's end holds that thing)". A phase that names its
// words in the composition manifest spells them, in traversal order. A phase
// that names none falls back to a deterministic A→Z walk — still a real,
// DISTINCT character per collectible, never the repeated A.

/** The painted stem's own key, matched by the engine-drawn glyph. */
export const LETTER_STYLE = {
  fill: "#f7c93f",
  fillDeep: "#e0a021",
  stroke: "#a2560f",
  strokeWidth: 3,
  shadow: "rgba(36,48,72,0.45)",
  font: "bold 96px Georgia, 'Times New Roman', serif",
} as const;

export interface LetterGlyph {
  c: number;
  r: number;
  char: string;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Every `*` cell with the character it renders, in TRAVERSAL order (left to
 * right, top to bottom on ties) — the order a player actually collects them.
 */
export const letterGlyphs = (rows: readonly string[], words?: readonly string[]): LetterGlyph[] => {
  const cells: Array<{ c: number; r: number }> = [];
  rows.forEach((row, r) => {
    [...row].forEach((g, c) => {
      if (g === "*") cells.push({ c, r });
    });
  });
  cells.sort((a, b) => a.c - b.c || a.r - b.r);

  const spelled = (words ?? []).join("").toUpperCase().replace(/[^A-Z]/g, "");
  return cells.map((cell, i) => ({
    ...cell,
    char: spelled.length > 0 ? (spelled[i % spelled.length] ?? "?") : (ALPHABET[i % ALPHABET.length] ?? "?"),
  }));
};
