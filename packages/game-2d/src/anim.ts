/**
 * Pure walk-cycle frame selection (A1-3) — Phaser-free so it unit-tests without
 * a game loop, and deterministic given the accumulated walk time. The scene
 * accumulates `walkTimerMs` while the player moves and asks this which texture
 * to show; the cycle is neutral → step 1 → neutral → step 2, one phase per
 * WALK_STEP_MS, so a full loop is 4 × WALK_STEP_MS (≈600 ms).
 */

/** ms per walk phase; a full neutral-step1-neutral-step2 loop is 4× this. */
export const WALK_STEP_MS = 150;

/**
 * The texture key for the player right now. Idle or reduced-motion → the resting
 * frame (`p-<facing>`); moving → the foot-lift frames on phases 1 and 3.
 */
export function walkFrameKey(facing: string, walkTimerMs: number, moving: boolean, reducedMotion: boolean): string {
  if (!moving || reducedMotion) return `p-${facing}`;
  const phase = Math.floor(walkTimerMs / WALK_STEP_MS) % 4;
  if (phase === 1) return `p-${facing}-1`;
  if (phase === 3) return `p-${facing}-2`;
  return `p-${facing}`; // phases 0 and 2 are the neutral pass-through
}
