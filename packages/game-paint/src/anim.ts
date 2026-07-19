// THE PAINTED BOOK — deterministic sheet-frame selection (the proven game-2d
// pattern): frames advance on accumulated WALK TIME / entity ticks, never on
// wall-clock, so manual-step harness runs and real RAF agree exactly.

/** Current frame index for a cycling sheet. */
export const sheetFrame = (ticks: number, frameCount: number, ticksPerFrame: number): number =>
  frameCount <= 1 ? 0 : Math.floor(ticks / Math.max(ticksPerFrame, 1)) % frameCount;

/** A two-state bob (wild/calm entity idle): frame 0/1 on a gentle cycle. */
export const bobFrame = (ticks: number, ticksPerFrame = 24): number => sheetFrame(ticks, 2, ticksPerFrame);
