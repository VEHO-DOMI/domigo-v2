// R5-W2 · I1 · THE BENCH SEES EVERY CARD.
//
// `scripts/shoot-card-bench.mjs` carries the surface list that the blind critics
// are photographed from, and its own comment says it is "kept in step with
// dev/CardGallery.tsx" — by hand. That is a drift class, not a drift risk: a
// surface added to the gallery and not to the list is simply never shot, and it
// fails SILENTLY, as a card that quietly stops being reviewed. This packet added
// one (the reading card's second beat) and hit exactly that, so the class gets a
// gate rather than the instance getting a fix.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../../../..");
const gallery = fs.readFileSync(path.join(root, "packages/game-paint/src/dev/CardGallery.tsx"), "utf8");
const bench = fs.readFileSync(path.join(root, "scripts/shoot-card-bench.mjs"), "utf8");

/** every id the gallery registers, from its two registrar calls. */
const gallerySurfaces = (): string[] =>
  [...gallery.matchAll(/\b(?:card|ceremony)\(\s*"([a-z0-9-]+)"/g)].map((m) => m[1]!);

/** the exported list the shooter walks. */
const benchSurfaces = (): string[] => {
  const block = /export const SURFACES = \[([\s\S]*?)\];/.exec(bench);
  if (block === null) throw new Error("SURFACES list not found — the scan is blind, not green");
  return [...block[1]!.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]!);
};

describe("the card bench and the shooter agree", () => {
  it("finds enough surfaces to be worth checking (vacuity)", () => {
    // a regex that matched nothing would make both assertions below pass forever
    expect(gallerySurfaces().length).toBeGreaterThan(15);
    expect(benchSurfaces().length).toBeGreaterThan(15);
  });

  it("every gallery surface is one the shooter photographs", () => {
    const shot = new Set(benchSurfaces());
    expect(gallerySurfaces().filter((s) => !shot.has(s))).toEqual([]);
  });

  it("the shooter names no surface the gallery does not have", () => {
    const have = new Set(gallerySurfaces());
    expect(benchSurfaces().filter((s) => !have.has(s))).toEqual([]);
  });
});
