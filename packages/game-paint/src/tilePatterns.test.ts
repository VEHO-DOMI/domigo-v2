import { describe, expect, it } from "vitest";
import { PatternLedger } from "./tilePatterns.ts";

/**
 * R5-W3 · E5 · D-32. The defect these laws exist to prevent: Phaser gives every
 * TileSprite its own power-of-two copy of its source texture, so phase p2's 331
 * tiled pieces held ~341 MB of duplicates on the graphics card. The ledger keeps
 * one per source and hands the rest back.
 *
 * These are the bookkeeping laws — they need no graphics card, which is exactly
 * why they can run in CI. The saving itself is measured in a browser and
 * reported with the run; a test cannot see VRAM.
 */
describe("tile pattern ledger (D-32)", () => {
  it("keeps the first pattern of a key and hands every later duplicate back", () => {
    const led = new PatternLedger<{ id: number }>();
    const first = { id: 1 };
    const second = { id: 2 };
    const third = { id: 3 };

    expect(led.claim("mass_body_a", first)).toEqual({ use: first, handBack: null });
    expect(led.claim("mass_body_a", second)).toEqual({ use: first, handBack: second });
    expect(led.claim("mass_body_a", third)).toEqual({ use: first, handBack: third });

    expect(led.kept).toBe(1);
    expect(led.handedBack).toBe(2);
  });

  it("keeps one pattern PER key — different pictures never share", () => {
    const led = new PatternLedger<string>();
    led.claim("mass_body_a", "A");
    led.claim("mass_crust", "B");
    led.claim("mass_body_a", "A2");

    expect(led.kept).toBe(2);
    expect(led.handedBack).toBe(1);
    expect(led.owned().sort()).toEqual(["A", "B"]);
  });

  it("owns exactly what must be deleted at shutdown, and nothing twice", () => {
    const led = new PatternLedger<string>();
    ["a", "a", "b", "a", "c", "c"].forEach((k, i) => led.claim(k, `${k}-${i}`));
    // three distinct pictures ⇒ three textures to release, six sprites built
    expect(led.owned()).toHaveLength(3);
    expect(led.kept + led.handedBack).toBe(6);
  });

  it("the p2 case: 331 pieces cut from a handful of pictures", () => {
    // the real shape, measured 2026-08-14: 331 tiled pieces in p2's display list
    const led = new PatternLedger<number>();
    const sources = ["mass_body_a", "mass_body_b", "mass_crust", "mass_fade", "mass_sediment", "plank_loop"];
    for (let i = 0; i < 331; i++) led.claim(sources[i % sources.length] ?? "", i);

    expect(led.kept).toBe(sources.length);
    expect(led.handedBack).toBe(331 - sources.length);
    // the point of the whole exercise, stated as a number: 325 GPU textures
    // that used to stay resident are now handed back the moment they are made
    expect(led.handedBack).toBe(325);
  });

  it("clear() releases the ledger so a re-entered phase starts clean", () => {
    const led = new PatternLedger<string>();
    led.claim("a", "x");
    led.claim("a", "y");
    led.clear();

    expect(led.kept).toBe(0);
    expect(led.handedBack).toBe(0);
    // after a clear the next sprite must be KEPT, not silently pointed at a
    // texture the scene already gave back — that would draw from freed memory
    expect(led.claim("a", "z")).toEqual({ use: "z", handBack: null });
  });
});
