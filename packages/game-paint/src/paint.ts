// THE PAINTED BOOK — the feel contract (doc 31 §3; clean-room, see
// docs/study/rayman/rayman-grammar.md). Pure constants + unit helpers.
//
// UNITS: the logic grid is 16px tiles at a fixed 60Hz tick. All positions and
// velocities in the brains are INTEGER SUB-PIXELS ("subs", 256 subs = 1 px) —
// the studied engine's momentum accumulator, which is what makes slow drifts
// and half-pixel walks exact instead of floaty (tests assert zero drift).
//
// Every value is marked:
//   D: adopted verbatim from the studied 1995 source (do not retune casually —
//      paint.test.ts locks these; a change must be a deliberate, tested edit)
//   T: ours to tune by feel (the feel-tune session diffs exactly these)

export const TILE = 16; // D: px per logic tile
export const SUBS = 256; // D: subs per px (1/256-px accumulator)
export const TICK_MS = 1000 / 60; // D: fixed 60Hz logic tick
export const MAX_TICKS_PER_FRAME = 4; // proven game-2d accumulator clamp

// Viewport (doc 31 §2: the studied game's proportion, not Keen's frame).
export const VIEW_W_TILES = 22;
export const VIEW_H_TILES = 14;
export const LOGICAL_W = VIEW_W_TILES * TILE; // 352
export const LOGICAL_H = VIEW_H_TILES * TILE; // 224
export const RENDER_SCALE = 3; // canvas = 1056×672, camera zoom 3

export const PAINT = {
  // ── ground movement (momentum in subs/tick) ────────────────────────────────
  walkMax: 320, // T: 1.25 px/t (studied top speeds are data-driven — tune by feel)
  runMax: 576, // T: 2.25 px/t
  groundAccel: 32, // T: 0.125 px/t²
  airControlPct: 50, // T: % of ground accel while airborne
  runEngage: 448, // T: momentum ≥ 1.75 px/t engages run state…
  runDrop: 384, // T: …and drops below 1.5 px/t (hysteresis)
  frictionNormal: 6, // D: ground decel scale, normal worlds
  frictionSlippery: 3, // D: slippery worlds decay HALF as fast (3 < 6)
  frictionBase: 8, // T: decel = friction × base subs/tick (48 normal / 24 slippery)

  // ── jump & gravity (vy in subs/tick; gravity in subs/tick²) ───────────────
  jumpVy: -5 * 256, // D: initial jump velocity −5 px/t
  hangJumpVy: -5 * 256, // D (round-2 corrected): the hang-jump is a FULL jump — you clear the ledge by jumping up-and-over; Rayman 1 has no pull-up
  jumpHoldTicks: 12, // D: gravity suppressed while the button is held, ≤12 ticks
  lateNudgeTick: 23, // D: one extra gravity unit fires at jump-tick 23
  gravity: 256, // D: +1 px/t per tick
  fallCap: 4 * 256, // D: terminal fall +4 px/t
  riseCap: -10 * 256, // D: rise clamp −10 px/t

  // ── hover (the quill-rotor) ────────────────────────────────────────────────
  // R5 (Koki 2026-07-20): the glide is UNLIMITED while held — a deliberate
  // deviation from the studied 50-tick fuel (kid-friendlier; his call).
  hoverFallCap: 256, // D: slow fall capped at +1 px/t while hovering

  // ── forgiveness (OURS — the studied game had none; players are 10) ────────
  coyoteTicks: 6, // T: jump grace after walking off a ledge (100ms)
  bufferTicks: 8, // T: input buffer before landing (133ms)
  ledgeMagnetPx: 4, // T: snap-to-grab tolerance

  // ── the thrown fist ────────────────────────────────────────────────────────
  chargeMax: 63, // D: ground charge +1/tick, capped
  airCharge: 32, // D: an air throw uses a fixed charge
  fistTier1Max: 20, // T: charge < 21 → speed tier 1
  fistTier2Max: 41, // T: charge < 42 → speed tier 2
  fistSpeeds: [5 * 256, 8 * 256, 11 * 256], // D: px/t by charge tier
  fistRunBoostCap: 16 * 256, // D: total launch speed cap with run boost
  fistTravelBaseTiles: 4, // T: travel = base + charge/8 tiles, then U-turn
  fistReturnAccel: 128, // T: +0.5 px/t per tick accelerating home

  // ── the ring swing (a true pendulum) ───────────────────────────────────────
  swingRopePx: 96, // D: rope length ~95–100 px
  swingCircle: 512, // D: angle units per full circle
  swingDwellTicks: 5, // D: dwell at each arc extreme before the flip

  // ── damage & recovery (no death exists — encounters do, see player.ts) ────
  knockVx: 2 * 256, // D: knockback ±2 px/t (fast enemies ±5)
  knockVy: -3 * 256, // D: knockback −3 px/t (fast enemies −6)
  knockFastVx: 5 * 256, // D
  knockFastVy: -6 * 256, // D
  iframeTicks: 120, // D: ~2s invulnerability after a hit

  // ── the bouncer (plum-law) ─────────────────────────────────────────────────
  bouncerVy: -5 * 256, // D: free bounce
  bouncerRiddenVy: -3 * 256, // D: while the player rides it

  // ── camera ─────────────────────────────────────────────────────────────────
  camEaseDiv: 4, // D: scroll eases toward target by /4 per tick
  camMinSpeed: 3 * 256, // D: minimum follow speed once moving
  camAheadTiles: 4, // T: look-ahead — mover sits a third off-center
  camVertBandPct: 57, // D: vertical rest line ≈ 57% of view height
  camVertThresholdPx: TILE, // D: vertical follow engages past ±1 tile

  // ── entity activation ──────────────────────────────────────────────────────
  activationMarginPx: 60, // D: awake within ~1 screen + 60px hysteresis

  // ── encounter timers (existing platform law) ───────────────────────────────
  quickfireSeconds: { E: 6, M: 5, S: 4 } as const,
} as const;

// The player's collision body (feet-anchored: x = center, y = FEET line).
export const BODY_W = 12; // T: px — narrower than the ~35px-tall drawn hero
export const BODY_H = 30; // T: px

// ── unit helpers ─────────────────────────────────────────────────────────────
export const toSubs = (px: number): number => Math.round(px * SUBS);
export const fromSubs = (subs: number): number => Math.floor(subs / SUBS);
export const tileOfPx = (px: number): number => Math.floor(px / TILE);
export const tileOfSubs = (subs: number): number => Math.floor(subs / (SUBS * TILE));

/** Fist damage from charge: (charge>>4)+1 → 1..4 (D). */
export const fistDamage = (charge: number): number => (Math.min(charge, PAINT.chargeMax) >> 4) + 1;

/** Fist speed tier index 0..2 from charge (T boundaries, D speeds). */
export const fistSpeedTier = (charge: number): number =>
  charge <= PAINT.fistTier1Max ? 0 : charge <= PAINT.fistTier2Max ? 1 : 2;

/** Fist launch speed in subs/t: tier speed + run boost max(|vx|−5px, 0), capped (D). */
export const fistLaunchSpeed = (charge: number, runVxSubs: number): number => {
  const tier = fistSpeedTier(charge);
  const base = tier === 0 ? PAINT.fistSpeeds[0] : tier === 1 ? PAINT.fistSpeeds[1] : PAINT.fistSpeeds[2];
  const boost = Math.max(Math.abs(runVxSubs) - 5 * SUBS, 0);
  return Math.min(base + boost, PAINT.fistRunBoostCap);
};

/** Fist travel distance in px before the U-turn: (base + charge/8) tiles (T). */
export const fistTravelPx = (charge: number): number =>
  Math.round((PAINT.fistTravelBaseTiles + charge / 8) * TILE);

/** Ground momentum decay for one input-less tick (D law shape, T base). */
export const groundDecay = (vxSubs: number, slippery: boolean): number => {
  const friction = slippery ? PAINT.frictionSlippery : PAINT.frictionNormal;
  const step = friction * PAINT.frictionBase;
  if (vxSubs > 0) return Math.max(vxSubs - step, 0);
  if (vxSubs < 0) return Math.min(vxSubs + step, 0);
  return 0;
};
