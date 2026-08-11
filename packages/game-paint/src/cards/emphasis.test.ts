// THE EMPHASIS GUARD (R5-W1 · D1) — one device, held by a machine.
//
// Item 3 of the packet asks for „EIN konsistentes Mittel für ‚das ist der
// Schlüssel' — überall gleich". A sentence in a doc cannot deliver that: the
// overlay already carried four different hand-built emphases (a 20 px 700 <p>
// on the task card, <strong> in the goal legend, <strong> in five ceremony
// panels, a <b> in the hint block), each added by someone who could not see
// the other three. So the rule is a test.
//
// The device is cards/Glance.tsx: `Key` for a whole line, `KeyBit` for a word
// or number inside one. Everything else is a finding.
//
// It scans SOURCE TEXT, like PaintedIcons.test.ts does — the package has no DOM
// test setup, and a text scan is what catches the case that matters anyway: a
// bold added by hand in a file nobody re-reads.
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const CARDS = HERE;
const PAINT_GAME = path.join(HERE, "..", "PaintGame.tsx");

/** every overlay source the rule governs: the card kit plus the file that
 *  draws the ceremony panels. Machine-listed, never hand-listed — a new skin
 *  file is covered the day it lands. */
const overlaySources = (): { file: string; src: string }[] => [
  ...readdirSync(CARDS)
    .filter((f) => (f.endsWith(".tsx") || f.endsWith(".ts")) && !f.endsWith(".test.ts") && !f.endsWith(".test.tsx"))
    .map((f) => ({ file: `cards/${f}`, src: readFileSync(path.join(CARDS, f), "utf8") })),
  { file: "PaintGame.tsx", src: readFileSync(PAINT_GAME, "utf8") },
];

/** Comments describe the rule and quote the markup they replaced, so only code
 *  is judged. Trailing comments count too — the icon union documents which
 *  emoji each painted mark REPLACED, one per line, after the code. */
const codeOnly = (src: string): string =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/\s+\/\/.*$/gm, "");

/** the two files that DEFINE the device are allowed to contain it */
const DEFINES_DEVICE = new Set(["cards/Glance.tsx", "cards/overlay-css.ts"]);

/** CONTROL TYPOGRAPHY is not emphasis, and this is where the line is drawn —
 *  explicitly, counted, and in a form the checker polices (an exception that is
 *  not declared is not an exception). A chip's own weight, a slot's letter, the
 *  slate's numeral and the dial's rows are the WEIGHT OF A CONTROL: they mark
 *  nothing out from anything, they simply are how a painted control is set. The
 *  counts are exact on purpose — one new hand-built bold anywhere in these
 *  files fails this test and has to argue with this comment. */
const CONTROL_WEIGHTS: Record<string, { count: number; why: string }> = {
  "cards/skins.tsx": { count: 5, why: "chip · answer slot · typed field · slate numeral · dial row" },
  "cards/CardShell.tsx": { count: 2, why: "the resolution beat's own type (Zurückgeholt! + the answer flying home)" },
};

describe("the emphasis guard (R5-W1 · D1)", () => {
  it("finds the overlay sources it is supposed to police", () => {
    const files = overlaySources().map((s) => s.file);
    expect(files).toContain("cards/CardShell.tsx");
    expect(files).toContain("cards/skins.tsx");
    expect(files).toContain("PaintGame.tsx");
    // non-vacuous: the sources are real files with real content
    for (const { file, src } of overlaySources()) expect(src.length, file).toBeGreaterThan(200);
  });

  it("has no hand-built <strong> or <b> anywhere in the overlay", () => {
    const offenders: string[] = [];
    for (const { file, src } of overlaySources()) {
      const code = codeOnly(src);
      for (const tag of ["<strong", "<b>"]) {
        if (code.includes(tag)) offenders.push(`${file}: ${tag} — use <KeyBit> (cards/Glance.tsx)`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("has no hand-built bold weight beyond the declared control typography", () => {
    const offenders: string[] = [];
    for (const { file, src } of overlaySources()) {
      if (DEFINES_DEVICE.has(file)) continue;
      const code = codeOnly(src);
      // fontWeight: 700 / 800 / "bold" in an inline style — the exact shape the
      // four drifted emphases had
      const hits = code.match(/fontWeight:\s*(700|800|900|"bold"|'bold')/g) ?? [];
      const allowed = CONTROL_WEIGHTS[file]?.count ?? 0;
      if (hits.length !== allowed) {
        offenders.push(`${file}: ${hits.length} hand-built bold(s), ${allowed} declared (${CONTROL_WEIGHTS[file]?.why ?? "none"}) — use <Key>/<KeyBit>, or declare it in CONTROL_WEIGHTS with a reason`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("the device is actually used (the guard cannot pass by emptiness)", () => {
    const shell = readFileSync(path.join(CARDS, "CardShell.tsx"), "utf8");
    const game = readFileSync(PAINT_GAME, "utf8");
    expect(shell).toMatch(/<Key\b/);
    expect(game).toMatch(/<Key(Bit)?\b/);
  });
});

// ── the no-emoji law, widened to the whole overlay ──────────────────────────
//
// PaintedIcons.test.ts has held this line since PK-R6 — but only over
// PaintGame.tsx. The card kit next door was never scanned, and it was carrying
// five of the banned glyphs in shipped code: 🖼 and ✨ in the stimulus lines,
// 💡 and 📖 on the hint rungs, ❓ eight times on a memory card. Every one of
// them is the reader's own operating-system font sitting on painted paper —
// the exact defect the law exists to prevent, in the exact place a child looks
// longest. The glyphs are painted marks now (cards/Glance.tsx), and the law
// covers the folder that broke it.
const BANNED = ["✨", "🎨", "🔓", "📜", "📕", "📖", "🪢", "⏱", "🖤", "🖌", "🖼", "🏵", "🚪", "🔤", "🕊", "❓", "💡"];

describe("the no-emoji law over the whole card kit", () => {
  it("no banned glyph appears in any overlay source", () => {
    const offenders: string[] = [];
    for (const { file, src } of overlaySources()) {
      const code = codeOnly(src);
      for (const g of BANNED) if (code.includes(g)) offenders.push(`${file}: ${g}`);
    }
    expect(offenders).toEqual([]);
  });

  it("the arrows and marks the game DOES use are untouched by the law", () => {
    // ↑ ← ↻ ⚠ are key cues, ✓ ▲ ▼ ⌫ are control marks — none is a picture of a
    // thing, so none is banned. Stated as a test so a later widening of the
    // list has to argue with this line first.
    for (const keep of ["↑", "←", "↻", "✓", "▲", "▼", "⌫"]) expect(BANNED).not.toContain(keep);
  });
});
