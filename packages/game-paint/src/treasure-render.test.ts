// R5-W2 · I1 · THE RENDER LAYER DECIDES NOTHING.
//
// `cue.ts` is unit-tested to the frame: the bob has a beat, the light lags, the
// glow never goes out, reduced motion is a finished picture. None of that is
// worth anything if `PaintScene.renderTipFx` quietly does its own arithmetic —
// a `Math.sin(this.tickCount / 9)` added there would be invisible to every test
// in this repo AND would bypass the reduced-motion gate, which is the one
// accessibility contract this codebase treats as hard.
//
// So the division is policed the way this repo already polices its other
// untestable surfaces (PaintedIcons.test.ts, cards/emphasis.test.ts,
// check-paint-copy.mjs): read the source, find the method, and assert what it
// may contain. The vacuity check below is what stops this becoming a test that
// passes because it found nothing to look at.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const src = fs.readFileSync(path.resolve(__dirname, "PaintScene.ts"), "utf8");

/** the body of `renderTipFx`, brace-matched from its signature. */
const renderTipFxBody = (): string => {
  const at = src.indexOf("private renderTipFx(): void {");
  if (at < 0) throw new Error("renderTipFx not found — this test is blind, not green");
  let depth = 0;
  for (let i = src.indexOf("{", at); i < src.length; i++) {
    if (src[i] === "{") depth += 1;
    else if (src[i] === "}") {
      depth -= 1;
      if (depth === 0) return src.slice(at, i + 1);
    }
  }
  throw new Error("renderTipFx never closes");
};

describe("the Regel-Seite's light is drawn, not decided, in the scene", () => {
  const body = renderTipFxBody();

  it("found a real method to check (vacuity)", () => {
    expect(body.length).toBeGreaterThan(300);
    expect(body).toContain("treasureCue");
    expect(body).toContain("shaftQuads");
  });

  it("does no arithmetic of its own", () => {
    // `Math.` covers sin/cos/random alike; the clock is only ever PASSED on
    for (const banned of ["Math.", "Date.now", "this.tickCount /", "this.tickCount *"]) {
      expect(body.includes(banned), `renderTipFx contains \`${banned}\``).toBe(false);
    }
  });

  it("hands the reduced-motion flag down instead of interpreting it", () => {
    // it may PASS the flag; it may not branch on it, because a branch here is a
    // motion decision that no unit test can see
    expect(body).toContain("this.cfg.reducedMotion");
    expect(/if\s*\([^)]*reducedMotion/.test(body)).toBe(false);
  });

  it("the page's float is derived exactly ONCE in the scene", () => {
    // Two derivations of one motion is how a lag silently becomes a jitter, so
    // the scene may ask for the float in exactly one place — and it must be the
    // line that already owns the per-role vertical offset, not a second writer.
    //
    // Counting `img.y +=` was the obvious form and it is WRONG twice over: the
    // guardian's keep-in-frame is a legitimate second writer on a different
    // sprite, and the prose warning against a second writer contains the string
    // itself. Counted on the call instead, which is the thing that can actually
    // be duplicated.
    expect([...src.matchAll(/treasureBobPx\(/g)].length).toBe(1);
    expect(src).toContain("img.y += br.dy - lift;");
  });
});
