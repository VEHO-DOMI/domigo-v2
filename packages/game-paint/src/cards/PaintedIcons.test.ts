// PK-R6 · H1 · THE NO-EMOJI LAW FOR CEREMONY SURFACES (round-1 critique,
// ceremonies finding 2: „Unicode/system emoji used as bullet icons clash
// against the hand-painted art … replace every emoji glyph with a custom
// painted icon asset in the same brushstroke style").
//
// A rule with no check is a wish, and this one is easier to break than most: an
// emoji is one keystroke, it renders instantly on the author's machine, and it
// looks fine in a diff. It does NOT look fine on a school Windows laptop, which
// draws 🚪 as a different picture entirely — that is the whole reason the
// glyphs had to go. So the thirteen this packet replaced are now forbidden in
// the code of the file that used to carry them, and the painted set that
// replaced them has to stay complete.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { PAINTED_ICON_NAMES } from "./PaintedIcons.tsx";

/** The exact glyphs this packet removed — named, so the check can never be
 *  accused of banning arrows („↑", „←", „↻" are the game's own key cues and
 *  are not emoji) or the error banner's „⚠". */
const BANNED = ["✨", "🎨", "🔓", "📜", "📕", "📖", "🪢", "⏱", "🖤", "🖌", "🖼", "🏵", "🚪", "🔤", "🕊"];

/** Comments are where this packet EXPLAINS which emoji it removed, so they are
 *  stripped before the search — otherwise the fix's own record would fail it. */
const codeOnly = (src: string): string =>
  src.replace(/\/\*[^]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

describe("the ceremonies carry painted pictures, never platform emoji", () => {
  const file = path.resolve(__dirname, "../PaintGame.tsx");
  const src = fs.readFileSync(file, "utf8");
  const code = codeOnly(src);

  it("reads the file it is judging (the check is not vacuous)", () => {
    expect(src.length).toBeGreaterThan(1000);
    expect(code).toContain("PaintedIcon");
  });

  for (const glyph of BANNED) {
    it(`no ${glyph} in PaintGame's rendered output`, () => {
      expect(code.includes(glyph), `${glyph} is back in PaintGame.tsx — paint it instead (cards/PaintedIcons)`).toBe(false);
    });
  }

  it("every icon a ceremony asks for actually exists", () => {
    // a name typo renders an empty <svg> — invisible on screen, and silent in
    // every other check this repo runs
    const asked = [...code.matchAll(/<PaintedIcon\s+name="([a-z]+)"/g)].map((m) => m[1]);
    expect(asked.length, "no ceremony asks for a painted icon at all").toBeGreaterThan(5);
    for (const name of asked) {
      expect(PAINTED_ICON_NAMES, `PaintGame asks for an icon that does not exist: ${name}`).toContain(name);
    }
    // …and the ones chosen at runtime (a ceremony that branches) are real too
    for (const m of code.matchAll(/name=\{[^}]*?"([a-z]+)"\s*:\s*"([a-z]+)"\}/g)) {
      expect(PAINTED_ICON_NAMES).toContain(m[1]);
      expect(PAINTED_ICON_NAMES).toContain(m[2]);
    }
  });
});
