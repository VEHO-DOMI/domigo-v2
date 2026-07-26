// D1 · the slippery slide (glyph z) — Fable prototype, 2026-07-26.
// The slide OWNS grounded control while active: downhill push toward
// SLIDE_MAX (6 px/t), ramp-in 48 subs/tick, braking by holding back,
// jumps unaffected, momentum carried into the air (capture modality 15:
// the original's slide is a slope ADDITIVE, not friction).
import { describe, expect, it } from "vitest";
import { PAINT } from "./paint.ts";
import { IDLE_PAD, type Pad, type PlayerState, spawnPlayer, stepPlayer } from "./player.ts";

const pad = (p: Partial<Pad>): Pad => ({ ...IDLE_PAD, ...p });

const SLIDE_MAX_SUBS = 6 * 256;

/** A flat ledge feeding an 8-cell slide diagonal with a backed runout. */
const slideGrid = (slideGlyph: string): readonly string[] => {
  const rows: string[] = ["....................", "...................."];
  for (let i = 0; i < 8; i++) {
    // slide cell at col 2+i on row 2+i, backing mass to its left
    const row = ("#".repeat(2 + i) + slideGlyph).padEnd(20, ".");
    rows.push(i === 0 ? "##" + slideGlyph + ".".repeat(17) : row);
  }
  rows.push(".".repeat(9) + "#".repeat(10) + "."); // runout floor, top at r10
  rows.push("#".repeat(20)); // basement
  return rows;
};

const run = (grid: readonly string[], ticks: number) => {
  let st: PlayerState = spawnPlayer(12, 32);
  let prev = IDLE_PAD;
  for (let t = 0; t < 3; t++) {
    const out = stepPlayer(st, IDLE_PAD, prev, grid, {});
    st = out.st;
  }
  expect(st.grounded).toBe(true);
  let maxVx = 0;
  let sawSlide = false;
  const right = pad({ right: true });
  for (let t = 0; t < ticks; t++) {
    const out = stepPlayer(st, right, prev, grid, {});
    st = out.st;
    prev = right;
    if (st.grounded) maxVx = Math.max(maxVx, st.vx);
    if (st.onSlide) sawSlide = true;
  }
  return { st, maxVx, sawSlide };
};

describe("the z slide (D1)", () => {
  it("boosts grounded speed past walkMax toward SLIDE_MAX on z, never beyond", () => {
    const { maxVx, sawSlide } = run(slideGrid("z"), 260);
    expect(sawSlide).toBe(true);
    expect(maxVx).toBeGreaterThan(PAINT.walkMax + 256); // clearly boosted
    expect(maxVx).toBeLessThanOrEqual(SLIDE_MAX_SUBS);
  });

  it("tamper control: the same geometry as \\ never enters the slide band", () => {
    const { maxVx, sawSlide } = run(slideGrid("\\"), 260);
    expect(sawSlide).toBe(false);
    // brief cell-to-cell airings snap vx to the ±2 px/t air base (512 subs),
    // which the landing tick records as grounded — so the honest ceiling for
    // a non-slide descent is the air-snap base, far below the slide band.
    expect(maxVx).toBeLessThanOrEqual(512);
    expect(maxVx).toBeLessThan(SLIDE_MAX_SUBS / 2);
  });

  it("braking: holding back on the slide decelerates to a stop", () => {
    const grid = slideGrid("z");
    let st: PlayerState = spawnPlayer(12, 32);
    let prev = IDLE_PAD;
    for (let t = 0; t < 3; t++) ({ st } = stepPlayer(st, IDLE_PAD, prev, grid, {}));
    const right = pad({ right: true });
    for (let t = 0; t < 40; t++) {
      ({ st } = stepPlayer(st, right, prev, grid, {}));
      prev = right;
    }
    expect(st.onSlide).toBe(true);
    expect(st.vx).toBeGreaterThan(0);
    const left = pad({ left: true });
    let stopped = false;
    for (let t = 0; t < 120 && !stopped; t++) {
      ({ st } = stepPlayer(st, left, prev, grid, {}));
      prev = left;
      if (st.grounded && st.vx <= 0) stopped = true;
    }
    expect(stopped).toBe(true);
  });
});
