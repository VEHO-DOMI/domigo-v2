import { describe, expect, it } from "vitest";
import { WALK_STEP_MS, walkFrameKey } from "./anim.ts";

const S = WALK_STEP_MS;

describe("walkFrameKey — the A1-3 walk cycle", () => {
  it("idle shows the resting frame regardless of the timer", () => {
    expect(walkFrameKey("down", 0, false, false)).toBe("p-down");
    expect(walkFrameKey("down", 5 * S, false, false)).toBe("p-down");
  });

  it("reduced-motion never plays the cycle, even while moving", () => {
    expect(walkFrameKey("left", 1.5 * S, true, true)).toBe("p-left");
    expect(walkFrameKey("up", 3.5 * S, true, true)).toBe("p-up");
  });

  it("cycles neutral → step1 → neutral → step2 → repeat while moving", () => {
    const seq = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => walkFrameKey("down", (k + 0.5) * S, true, false));
    expect(seq).toEqual([
      "p-down", "p-down-1", "p-down", "p-down-2", // phase 0..3
      "p-down", "p-down-1", "p-down", "p-down-2", // loops
    ]);
  });

  it("advances phase exactly on the WALK_STEP_MS boundary", () => {
    expect(walkFrameKey("down", S - 1, true, false)).toBe("p-down");   // still phase 0
    expect(walkFrameKey("down", S, true, false)).toBe("p-down-1");     // phase 1 begins
    expect(walkFrameKey("down", 2 * S - 1, true, false)).toBe("p-down-1");
    expect(walkFrameKey("down", 2 * S, true, false)).toBe("p-down");   // phase 2 (neutral)
  });

  it("keys the frame to the current facing", () => {
    for (const f of ["down", "up", "left", "right"]) {
      expect(walkFrameKey(f, 1.5 * S, true, false)).toBe(`p-${f}-1`);
    }
  });
});
