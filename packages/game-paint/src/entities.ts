/**
 * entities — the chapter's living things, as PURE BRAINS (the arcade.ts law:
 * fixed 60 Hz ticks, integer subpixels, Phaser-free, fully unit-testable).
 *
 * Roles per the frozen ch01 sheet §4: chaser · gunner · flyer · bouncer ·
 * crusher · swarm · platform.move/fall/swing · cage · powerup · door.trigger ·
 * guardian. Encounters NEVER kill (doc 31 §1): touching a cross being opens a
 * TASK; solving it redeems the being (dazed-happy, out of play). The fist only
 * shoos and deflects — it never redeems (§3).
 *
 * Source-adopted numbers (audit r3): the G3 ride contract lands scene-side
 * (land tolerance max(|Δvy|+2, 4) px, detach at ≥9 px); G11 arena grammar
 * (camera lock + clock-gated pattern states + exit-on-victory) lives in the
 * guardian machine here.
 */
import { PAINT, SUBS, TILE } from "./paint.ts";
import { glyphAt, groundSurfaceAt, isSolid, walkSurfaceAhead } from "./collide.ts";
import { flightUnitAt, knotIndex, pathForKnot } from "./flight.ts";
import type { EntitySpec, LinkSpec } from "./level.ts";

export interface EntityState {
  id: string;
  role: EntitySpec["role"] | "guardian";
  skin: string;
  tier: "E" | "M" | "S";
  /** feet-center position in subs (the player convention). */
  x: number;
  y: number;
  vx: number;
  vy: number;
  dir: 1 | -1;
  /** role FSM: patrol|telegraph|act|recover|dazed — cages: closed|shaking|burst
   *  — guardian (PK-R6 · E, airborne): fly|telegraph|throw|dip|stagger|window|
   *  sink|sad|consoled. */
  state: string;
  timer: number;
  hp: number;
  homeX: number;
  homeY: number;
  redeemed: boolean;
  hidden: boolean; // revealed via links
  /** PK-R6 · C2 · guardians only: chalk thrown at this child that MISSED since
   *  the last counter-window. See DODGES_PER_WINDOW — this is the fist-less
   *  road into the fight. */
  dodges: number;
  /** PK-R6 · E · guardians only: how many pieces of chalk she has thrown this
   *  fight. It is the DETERMINISTIC cursor into the six painted chalk sticks
   *  (CHALK_COLOURS) — a count the replay reproduces exactly, where a random
   *  pick would give the proof tape a different-coloured arena every run. */
  throws: number;
  /** PK-R6 · D · classmates only: how many reawakening rounds she has been
   *  given back, 0 … AWAKEN_ROUNDS (doc 44 §3.3). It is a COUNT rather than a
   *  reuse of `hp`, because it is read by the renderer as well as the sim —
   *  anim.washAlphaFor turns it into how grey she still is, and a number that
   *  means "hits left" in one file and "colour restored" in another is the
   *  drift class the pose thresholds were derived to avoid. */
  awakenStep: number;
  /** PK-R6 · H1 · ticks since this being was FREED — the colour flood's own
   *  clock, and the reason it is not `timer`.
   *
   *  Found by the hold (round-1 critique, finding 5) and older than it: the
   *  flood was read off `timer`, which every state change resets. A freed moth
   *  therefore re-drained and re-flooded when its joy lap ended (150 t), and a
   *  freed classmate did it again at every settle → joy → rest → wave, i.e. she
   *  went grey for half a second every seven seconds for the rest of the
   *  chapter. Invisible while the flood was a 0.12 shimmer, and a lie the moment
   *  the flood became the ceremony's payoff. This counter only ever counts up. */
  freedTick: number;
  /** PK-R6 · E · guardians only: ticks spent ON THE PATH. It advances only while
   *  she is flying — she holds station to telegraph — so the shape is not cut
   *  short and restarted by every throw, which is what `timer` (reset per state)
   *  would have done. It is also what makes „she flew a whole path" a countable
   *  claim rather than a screenshot. */
  flightTick: number;
  params: Record<string, unknown>;
}

export interface ProjectileState {
  id: number;
  /** PK-R6 · E: `shard` is the piece a landed chalk leaves behind — it does not
   *  fly, it LIES there for SHARD_TICKS as a floor hazard (doc 44 §4 ch01 C4:
   *  „chalk shards linger 1 s as floor hazards"). */
  kind: "chalk" | "blob" | "shard";
  x: number;
  y: number;
  vx: number;
  vy: number;
  deflected: boolean;
  fromId: string;
  dead: boolean;
  /** ticks alive — a deflected piece that hits nothing shatters on this (R3-4). */
  age: number;
  /** PK-R6 · E · which of the six painted sticks this is (`chalk_red` …). Carried
   *  on the piece rather than recomputed by the renderer, so the stick that
   *  shatters is the stick that flew, and its shard inherits the same colour. */
  colour: string;
}

export type EntityEvent =
  | { type: "encounter"; id: string; role: string; skin: string }
  /** PK-R6 · C1: the child stepped up to a drained object and pressed ↑. The
   *  sim turns this into the being's `restore` card; solving it redeems the
   *  object and the colour floods back (anim.washAlphaFor). */
  | { type: "engaged"; id: string; role: string; skin: string }
  | { type: "cageHit"; id: string; hpLeft: number }
  | { type: "cageBurst"; id: string; skin: string }
  | { type: "cageGated"; id: string }
  /** PK-R6 · D: the child stepped up to a half-woken classmate and pressed ↑.
   *  The ceremony resumes at the round she is on — this is the anti-softlock
   *  half of the reawakening (PB-T1): „Später" on round 3 must not leave a
   *  friend standing grey with no way back into her own rescue. */
  | { type: "awakenAsk"; id: string; skin: string }
  | { type: "doorTouched"; id: string; kind: string }
  | { type: "powerupTaken"; id: string; grants: string }
  /** PK-R3b · R3-16: a static-state collectible was walked into — a Regel-Seite
   *  (which stops the world to show its rule) or a Bonus-Buch (which does not). */
  | { type: "pickupTaken"; id: string; role: "tip" | "book"; skin: string }
  | { type: "guardianStagger"; id: string }
  | { type: "guardianKnot"; id: string; knotsLeft: number }
  | { type: "guardianDown"; id: string }
  | { type: "projectileDeflected"; id: number }
  /** R3-4/R3-6 · a puff of chalk dust in world px — the ONLY way impact becomes
   *  visible without the sim knowing what a particle is. `chalk` = a piece
   *  shattering, `hit` = the fist landing on something solid. */
  | { type: "puff"; x: number; y: number; kind: "chalk" | "hit" }
  | { type: "shooed"; id: string };

export interface WorldInput {
  playerX: number; // subs
  playerY: number;
  playerIframes: number;
  /** R5-P1: Käfige gegated, solange der Phasen-Wächter steht (Arena-Gesetz). */
  cagesGated?: boolean;
  playerOverlayOpen: boolean; // world frozen while a task is up
  fist: { active: boolean; x: number; y: number } | null;
  /** PK-R6 · C1/C2 · THE ENGAGE PRESS. ch01 grants no fist (doc 44 §4: the
   *  ability arc starts bare), so the verb that reaches a bewitched thing can
   *  no longer be a punch. It is ↑ — the same key that already climbs a vine —
   *  pressed while standing at the thing. RISING EDGE only: the sim hands this
   *  in as an edge, never as "up is held", so walking up a vine past a drained
   *  desk cannot fire its card. */
  playerEngage?: boolean;
}

export interface EntityWorld {
  entities: EntityState[];
  projectiles: ProjectileState[];
  links: LinkSpec[];
  nextProjectileId: number;
  guardianKnots: number; // knots remaining on the arena guardian (0 = down)
}

const BODY_HALF_PX = 8;
const AGGRO_X_PX = 72;
/** Patrol speed of a walking enemy. Exported because the RENDERER derives its
 *  run-pose threshold from it (anim.entPoseCell) — one source of truth, so the
 *  pose can never silently drift out of step with the walk it depicts. */
export const ENEMY_WALK = Math.round(0.6 * SUBS);
const ENEMY_LUNGE = Math.round(1.6 * SUBS);
/** A bouncer's upward impulse at ground contact (same reason as ENEMY_WALK:
 *  the squash pose keys off it). */
export const BOUNCE_UP = Math.round(3.2 * SUBS);
/** Half-width, in px, of a flyer's sine patrol around its home — the bank pose
 *  fires near the extremes, where the flyer rolls into its turn. */
export const FLYER_SWEEP_PX = 40;
const GRAVITY = PAINT.gravity;

/** doc 40 §2 · THE TURN STATE — the study's "biggest missing beat". A creature
 *  that reverses used to flip on tick 1, which reads as a glitch rather than a
 *  decision; it now spends 18 t (300 ms) turning and the flip lands at the
 *  MIDPOINT. Exported because anim.ts derives its pose thresholds from the sim
 *  constants they depict, never from re-typed numbers. */
export const TURN_TICKS = 18;
export const TURN_FLIP_AT = Math.floor(TURN_TICKS / 2);
/** doc 40 §4 · the chalk a guardian throws lives on a leash: a deflected piece
 *  that hits nothing must SHATTER rather than sail on as a lingering orb. */
export const CHALK_LIFE_TICKS = 180;
/** PK-R6 · C2 · how many thrown pieces the child must let fall before the
 *  guardian over-reaches and opens a counter-window. Three is the arcade
 *  read — long enough that the window feels earned, short enough that a
 *  six-year-old who is only dodging still gets into the fight (the guardian
 *  throws every 150 t at tier E, so a window opens roughly every 7.5 s). */
export const DODGES_PER_WINDOW = 3;

// ── R3-5 · REDEMPTION CHANGES STATE, NEVER PRESENCE (doc 40 §3) ──────────────
// Redeeming used to park a being in a terminal `dazed` and stop stepping it:
// the freed moth never flew its Freudenrunde, the book drifted off as if
// nothing had happened, and the eraser wandered out of the level for good.
// doc 31's kindness economy demands the friend STAYS. So redemption now enters
// a state PAIR — `joy` (a lap around its home) → `rest` (settled AT home) —
// and the settle is what brings a wanderer back rather than letting it leave.
/** How long the Freudenrunde runs before the friend settles. */
export const JOY_TICKS = 150;

// ── PK-R6 · D · THE REAWAKENING (doc 44 §3.3) ────────────────────────────────
// „The freed classmate stands ghost-pale and acts out the unit's wrong-actions
// round by round — the pose IS the prompt … Correct → the classmate regains one
// degree of motion/colour; final round → full colour, joy loop, the cage opens."
/** How many rounds one reawakening runs. Six is doc 44 §3.3's own number
 *  („6 rounds, `Runde n/6`"), and it is a LAW rather than a tuning knob: the
 *  content gate (check-game-tasks layer 5) demands exactly this many bound
 *  rescue cards, and the wash divides the ghost-grey into exactly this many
 *  steps. One constant, three readers — a five-round chapter turns red. */
export const AWAKEN_ROUNDS = 6;
/** How long she stands in `settle` — eyes closing, hands coming together —
 *  before the Freudenrunde. Her own painted beat (`merle_settle0/1`): the
 *  moment of coming back to herself, which the joy would otherwise cut off. */
export const SETTLE_TICKS = 54;
/** How long a burst cage throws itself open, in ticks (≈270 ms at the 60 Hz
 *  contract; formerly anim.ts, re-exported there). R5-A8: the burst is a BEAT,
 *  not a resting state — its art shows the captive mid-escape, so after this
 *  window stepRedeemed settles the cage into `open` (the captive-free resting
 *  pair). The sim's post-burst hold (Sim.holdTicks) and the scene's pop
 *  (PaintScene.cagePopT) read the same number, so drawn = played. */
export const CAGE_OPEN_TICKS = 16;
/** Once settled at home a freed classmate WAVES now and then, so a friend who
 *  stays for the rest of the chapter reads as present rather than parked
 *  (doc 44 §1: redemption changes state, never presence). */
export const WAVE_EVERY_TICKS = 420;
export const WAVE_TICKS = 96;
/** How long the Tafel cries before the console beat answers it (R3-5). */
export const SAD_TICKS = 48;
/** Which roles are redeemable creatures. Cages, doors and powerups also carry
 *  `redeemed`, but they are doc 40 §3 STATIC-STATE — no rig, no orbit. */
export const JOY_ROLES = new Set(["chaser", "gunner", "flyer", "bouncer", "crusher", "swarm"]);
/** Airborne roles loop wide; ground roles bob in place so joy never reads as
 *  levitation. */
const joyRadiusPx = (role: string): { rx: number; ry: number; lift: number } =>
  role === "flyer" || role === "swarm" ? { rx: 26, ry: 12, lift: 10 } : { rx: 11, ry: 5, lift: 4 };

/** The post-redeem step: a lap of joy, then home to stay. */
const stepRedeemed = (e: EntityState): void => {
  // R3-15: the timer runs for EVERY redeemed being, not only the ones that fly a
  // lap — a knotted school bag gets its afterlife exactly like a moth does even
  // though it stays put. Before this the timer froze at redemption and a cage
  // would have been left half-drained forever.
  e.timer += 1;
  // PK-R6 · H1: …and the FLOOD runs on its own clock beside it (see freedTick),
  // because every branch below resets `timer` and a reset used to send the
  // colour back out of a being the child had already got it back into.
  e.freedTick += 1;
  // PK-R6 · D · THE FREED CLASSMATE'S OWN AFTERLIFE. She does not fly a lap
  // (she is a person, not a moth) and she may not be parked either: doc 44 §1
  // makes presence the point of freeing someone. So her states are her painted
  // ones — settle (coming back to herself) → joy (the Freudenrunde, in place) →
  // idle at her spot, waving now and then for the rest of the chapter.
  if (e.role === "classmate") {
    if (e.state === "settle" && e.timer > SETTLE_TICKS) { e.state = "joy"; e.timer = 0; }
    else if (e.state === "joy" && e.timer > JOY_TICKS) { e.state = "rest"; e.timer = 0; }
    else if (e.state === "rest" && e.timer > WAVE_EVERY_TICKS) { e.state = "wave"; e.timer = 0; }
    else if (e.state === "wave" && e.timer > WAVE_TICKS) { e.state = "rest"; e.timer = 0; }
    return;
  }
  // R5-A8: the burst is a BEAT — once the throw-open played, the cage rests
  // `open` (anim keeps burst for skins without open art, and the remount
  // spawns freed cages as `open` directly, so a bonus trip never replays it).
  if (e.role === "cage" && e.state === "burst" && e.timer > CAGE_OPEN_TICKS) e.state = "open";
  if (!JOY_ROLES.has(e.role)) return; // static-state beings hold their cell
  const { rx, ry, lift } = joyRadiusPx(e.role);
  if (e.state === "joy") {
    const t = e.timer;
    e.x = e.homeX + Math.round(Math.sin(t / 11) * rx * SUBS);
    e.y = e.homeY - Math.round(lift * SUBS) + Math.round(Math.sin(t / 7) * ry * SUBS);
    if (t > JOY_TICKS) { e.state = "rest"; e.timer = 0; }
  } else if (e.state === "rest") {
    // ease home and STAY there — this is what stops the eraser leaving (11.47.39)
    e.x += Math.round((e.homeX - e.x) / 8);
    e.y += Math.round((e.homeY - e.y) / 8);
    if (Math.abs(e.homeX - e.x) < SUBS && Math.abs(e.homeY - e.y) < SUBS) { e.x = e.homeX; e.y = e.homeY; }
  }
};

/**
 * PK-R6 · H1 · THE WORLD KEEPS ITS PROMISE WHILE THE CHILD WATCHES IT (round-1
 * critique, finding 5: „the reawakening the whole sequence is building toward
 * never actually lands on screen").
 *
 * The restore-hold (doc 44 §3.1.7) exists so the card gets out of the way and
 * the child WATCHES their answer change the world. It was holding a world that
 * had stopped: the shell froze the sim for the hold, `stepEntities` returns on
 * the first line when the overlay is open, and the colour flood is driven by
 * the very timer that freeze stops. The harness measured exactly that and it was
 * read as a timing artefact — „hold start: wash 0.72 … hold end: wash 0.72".
 *
 * So a hold now steps the REDEEMED beings and nothing else: the flood floods,
 * the friend settles and takes her joy lap, a burst cage plays its opening —
 * while the child, the enemies and every encounter stay exactly as frozen as
 * the freeze intends. It raises no events by construction (`stepRedeemed`
 * cannot), so a cinematic beat can never open a card behind its own card.
 */
export const stepRedeemedOnly = (w: EntityWorld): void => {
  for (const e of w.entities) {
    if (e.hidden || !e.redeemed) continue;
    stepRedeemed(e);
  }
};

/** Per-tier guardian script (sheet §6: telegraph/window shrink E→S, knots ≤5). */
// PK-R6 · E (doc 44 §4 ch01 C4): the Tafel FLIES. PK-C3's ground roll between
// two stations retires with the R4 canon — „Doc 41's grounded ‚erwachte
// Schultafel' … retire as mechanics; the board now flies" — and the rollSpeed/
// rollRangeTiles/rollTicks dials retire with it. What survives verbatim is the
// per-tier shape the sheet fixed: knots, and a telegraph and throw clock that
// tighten E→S.
export const GUARDIAN_SCRIPT = {
  E: { knots: 3, telegraphTicks: 60, throwEvery: 150, staggerTicks: 90 },
  M: { knots: 4, telegraphTicks: 45, throwEvery: 120, staggerTicks: 75 },
  S: { knots: 5, telegraphTicks: 32, throwEvery: 96, staggerTicks: 60 },
} as const;

// ── PK-R6 · E · THE FLYING TAFEL (doc 44 §4 ch01 C4 + §3.2 boss primitives) ──
// Every number here is either DERIVED from the arena and the camera (and locked
// by a test that recomputes the derivation), MINED verbatim from the shipped
// build, or marked `TASTE:` — the three kinds a reviewer has to judge
// differently. Nothing in this block is a number somebody once typed.

/** THE FAIRNESS FLOOR. doc 44 §4 ch01 C4 asks for a telegraph of „≥500 ms"
 *  before every throw; 30 ticks at the 60 Hz contract IS 500 ms. It is a floor
 *  rather than a value because the per-knot escalation below SHORTENS the
 *  telegraph, and at tier S the third knot would otherwise reach 23 t (383 ms) —
 *  a tell too short to answer, which is the one thing a no-death boss may never
 *  do. The mined Keen boss holds the same line from the other side (its own
 *  suite asserts `telegraphMs[tier] >= 500` on every tier); ours is the floor
 *  that law becomes once the telegraph is allowed to move. */
export const TELEGRAPH_FLOOR_TICKS = 30;

/** How high she flies, as a half-height around her spawn row, in px. DERIVED:
 *  the arena is 20 rows (320 px) and the view is LOGICAL_H (224 px), so with the
 *  child on the arena floor the vertical scroll clamps to 96 and the visible
 *  band is y 96…320. Her spawn row (r11 → feet at 192) plus this band keeps her
 *  feet in 166…218 and her 52-px body in 114…218: inside the visible band with
 *  margin, above the child's head (226) and clear of the row-14 podium tops
 *  (224). `flight.test.ts` recomputes all of that from camera.ts and the level
 *  file and fails if any knot's path leaves the band — a readable path the child
 *  cannot SEE is not a readable path. */
export const FLIGHT_BAND_PX = 26;
/** How wide each knot's shape is, in px either side of her flight centre.
 *  Escalating: the arena gets bigger as she gets angrier. Bounded by the arena
 *  itself — see FLIGHT_MARGIN_PX. */
export const KNOT_SPAN_PX = [78, 92, 104] as const;
/** How long one full pass of a knot's path takes, in ticks (5.0 s / 4.3 s /
 *  3.7 s at 60 Hz). TASTE: the absolute values are feel; what is NOT taste is
 *  that they shorten — doc 44 asks for „three knots, escalating", and a path
 *  the child has already learned has to arrive faster to stay a fight. */
export const KNOT_PERIOD_TICKS = [300, 260, 220] as const;
/** How much faster her CLOCKS run per knot (throw rate and telegraph alike),
 *  as a multiplier on the tier script. The telegraph is clamped by
 *  TELEGRAPH_FLOOR_TICKS afterwards, so this can never buy speed with fairness.
 *  TASTE: 15 % then 28 % — one step the child feels, one they brace for. */
export const KNOT_RATE = [1, 0.85, 0.72] as const;
/** How close to the arena's edge her flight centre may drift, in px. Keeps a
 *  full-span path inside the stage instead of half-off it. */
export const FLIGHT_MARGIN_PX = 24;
/** How fast the flight CENTRE tracks the child, as an ease divisor and a cap in
 *  subs/tick. Mined in shape from the legacy `cloud` brain, which drifts toward
 *  the player's column before it fires — the reason is the fairness law again:
 *  a telegraph thrown from off screen cannot be answered, so she has to stay
 *  where the child can see her. Slow on purpose (TASTE: /48, ≤0.6 px/tick) —
 *  the PATH must dominate the drift, or the shape stops being learnable. */
export const CENTRE_EASE_DIV = 48;
export const CENTRE_MAX_STEP = Math.round(0.6 * SUBS);

/** The release beat: how long `tafel_throw` shows after the chalk leaves her
 *  hand. TASTE: 12 t (200 ms) — long enough to read as a throw, short enough
 *  that she is flying again before the chalk lands. */
export const THROW_TICKS = 12;
/** How long the chalk stays in the air, in ticks. The arc is SOLVED for this
 *  time (see the throw below), so it is the child's actual dodge window: 48 t =
 *  800 ms on top of a ≥500 ms telegraph. TASTE within the fairness envelope. */
export const CHALK_FLIGHT_TICKS = 44;
/** THE ARMING DELAY — the second half of the fairness law, found by test.
 *  A telegraph only buys the child time if the thing it announces then has to
 *  TRAVEL. She tracks the child (so her tell is on screen), which means she can
 *  end up nearly on top of them — and a piece of chalk aimed at their feet from
 *  20 px away entered the contact box on its FIRST tick, i.e. an unavoidable hit
 *  behind a perfectly fair 1-second tell. Chalk is therefore inert for its first
 *  10 ticks (167 ms): it always visibly leaves her hand before it can bite.
 *  Costs nothing at normal range — the arc is 44 ticks long. */
export const CHALK_ARM_TICKS = 10;
/** Per-tick fall on a piece of chalk, in subs. Kept VERBATIM from the shipped
 *  duel (`GRAVITY / 4`, R3-4's „long readable arc") — the arc the playtest
 *  already accepted, now aimed rather than lobbed straight ahead. */
export const CHALK_GRAVITY = Math.round(PAINT.gravity / 4);
/** How long a shattered piece lies on the floor as a hazard, in ticks. doc 44
 *  §4 ch01 C4: „chalk shards linger 1 s" — 60 t IS 1 s at the 60 Hz contract. */
export const SHARD_TICKS = 60;
/** How close the child has to come to a lying shard for it to bite, in px.
 *  DERIVED from the hero's own body rather than guessed: BODY_HALF_PX (8) plus
 *  a splinter's width. Deliberately SMALLER than the flying piece's box — a
 *  hazard you can see lying still has to be avoidable by looking, and a
 *  six-year-old walking a floor should not be caught by something beside them. */
export const SHARD_REACH_X_PX = 9;
export const SHARD_REACH_Y_PX = 12;
/**
 * The painted sticks she actually throws, cycled by throw index so the colour is
 * a function of the tick stream and nothing else.
 *
 * PK-R6 · H2 (round-2 finding 5: „the thrown chalk stick is a pale, thin sliver
 * close in value to the couches behind it"). The cycle led with `white`, so the
 * FIRST piece of the fight — the one the child is taught to read the whole boss
 * by — was the one stick in the set that carries no chroma at all, thrown across
 * a stage of cream upholstery and honey-wood book tiles. White chalk is right on
 * a blackboard and wrong as a projectile: it is the only colour here that cannot
 * separate from the p4 backdrop by hue, so it has nothing left to separate by but
 * value, and the arena's whole midground sits at chalk value.
 *
 * It is dropped from the THROW set (its sheet is untouched and still shipped —
 * see CHALK_PROJECTILE_STEMS) and the cycle now opens on the most saturated
 * stick in the box. Warm first, cool last: the p4 stage is dusk-blue, so the two
 * cool sticks are the ones that need the code-drawn light most and they arrive
 * after the child has already learnt what a thrown piece looks like.
 */
export const CHALK_COLOURS = ["red", "orange", "yellow", "green", "blue"] as const;

/** PK-R6 · H1 · THE PROJECTILE ART, as stems (round-1 critique, finding 5).
 *
 *  The chalk is the one prop in the fight the child MUST see, and every one of
 *  these sheets was delivered over the same magenta colour key as the terrain —
 *  at 6× the flying stick carried a bright pink comma along its lower edge. The
 *  traversal fringe gate already refuses that key on tiled surfaces; this is the
 *  same class on the piece the whole boss contract depends on being readable.
 *
 *  Derived from CHALK_COLOURS rather than written out, so a seventh stick is
 *  covered by the gate the day it is added. */
export const CHALK_PROJECTILE_STEMS: readonly string[] = [
  ...CHALK_COLOURS.map((c) => `chalk_${c}`),
  // named on its own now that it has left the throw cycle (round-2 finding 5):
  // the sheet still ships, the gate still guards its fringe, and the day a
  // chapter with a dark floor wants it back it is already clean.
  "chalk_white",
  "chalk_shard_a",
  "chalk_shard_b",
  "tafel_chalk",
];

/** THE COUNTER-WINDOW DIP (doc 44 §4 ch01 C4: „she writes her lie ON the
 *  board"). She leaves the flight band and comes down to the child — which is
 *  what makes four chalked words readable at 1×, and what guarantees the card's
 *  asker is on screen when it opens (the speaker law, doc 41 §3: a card whose
 *  asker has left the viewport WAITS, and a boss frozen off screen mid-window
 *  would wait forever). */
export const DIP_Y_PX = 236;
/**
 * How far short of the child she stops, in px — she dips in FRONT of them, not
 * on top of them.
 *
 * PK-R6 · H2 (round-2 finding 2: „Domi's sprite clips into the boss during the
 * sink pose — it reads as a z-order bug, not a choreographed contact pose").
 * 34 px was never a standoff: it is measured centre to centre, and half of HER
 * alone is more than that, so „in FRONT of them" put her drawing straight
 * through his. Now DERIVED rather than tasted, in the units both bodies are
 * drawn in: half the boy (BODY_HALF_PX, 8) + half the board she actually is at
 * the size PaintScene actually draws her (`entTargetH` for a guardian, 84 px
 * tall × the sheet's 0.62 aspect ⇒ ≈26 wide at the frame, half ≈13… and the
 * spread legs reach past it, so 25) + 12 px of daylight, so the contact pose
 * reads as two beings facing each other rather than one drawing over another.
 * Re-derive this the day either body is re-scaled.
 */
export const DIP_STANDOFF_PX = 45;
/** How long the dip takes. Matched to the evidence beat (PaintScene's
 *  EVIDENCE_BEAT_TICKS, 36 t) so the coming-down and the writing read as one
 *  movement rather than two. */
export const DIP_TICKS = 36;
/** How fast she settles the last stretch onto the ground when she is beaten, in
 *  subs/tick. TASTE: 1.1 px/tick — heavier than she flies, which is the whole
 *  point of the beat. */
export const SINK_SPEED = Math.round(1.1 * SUBS);

export const spawnEntities = (specs: EntitySpec[], links: LinkSpec[]): EntityWorld => ({
  entities: specs.map((s) => {
    const cellX = (s.c * TILE + TILE / 2) * SUBS;
    const cellY = (s.r + 1) * TILE * SUBS;
    // R5-A4: a kinematic platform spawns ON its path. The swing's path hangs
    // rope-length under the author cell — spawning at the cell popped the bob
    // down 40 px in its first tick (and spiked the ride delta with it).
    const p0 = s.role === "platform.move" || s.role === "platform.swing"
      ? platformPathAt(s.role, cellX, cellY, s.params ?? {}, 0)
      : null;
    return {
    id: s.id,
    role: s.role,
    skin: s.skin,
    tier: s.tier,
    x: p0 === null ? cellX : p0.x,
    y: p0 === null ? cellY : p0.y,
    vx: 0,
    vy: 0,
    dir: -1,
    // PK-R6 · D: a classmate starts `caged` — the painted cell of the person
    // still under the spell (`merle_caged0/1`, eyes down, hands limp). It is
    // what the child sees in the beat between the cage bursting and the first
    // round's pose, and it is what she falls back to if a round is deferred.
    // PK-R6 · E: a guardian is AIRBORNE from her first tick — there is no
    // grounded idle to fall out of, which is what keeps the old easel cells
    // (`tafel_sad`/`_dazed`/`_stagger`) unreachable while she flies.
    state: s.role === "cage" ? "closed" : s.role === "classmate" ? "caged"
      : s.role.startsWith("platform") ? "carry" : s.role === "guardian" ? "fly" : "patrol",
    timer: 0,
    hp: s.role === "cage" ? 2 : s.role === "guardian" ? GUARDIAN_SCRIPT[s.tier].knots : 1,
    homeX: cellX,
    homeY: cellY,
    redeemed: false,
    hidden: s.params?.hidden === true,
    dodges: 0,
    throws: 0,
    flightTick: 0,
    awakenStep: 0,
    freedTick: 0,
    params: s.params ?? {},
    };
  }),
  projectiles: [],
  links,
  nextProjectileId: 1,
  guardianKnots: -1,
});

const overlapsPlayer = (e: EntityState, inp: WorldInput, wPx = 14, hPx = 26): boolean => {
  const dx = Math.abs(e.x - inp.playerX) / SUBS;
  const pTop = inp.playerY / SUBS - 30;
  const eTop = e.y / SUBS - hPx;
  const vOverlap = e.y / SUBS > pTop && inp.playerY / SUBS > eTop;
  return dx < wPx && vOverlap;
};

const fistHits = (e: EntityState, fist: WorldInput["fist"], wPx = 14): boolean => {
  if (!fist || !fist.active) return false;
  return Math.abs(e.x - fist.x) / SUBS < wPx && Math.abs(e.y - SUBS * 14 - fist.y) / SUBS < 18;
};

// ── PK-R6 · C1/C2 · THE ENGAGE REACH (doc 44 §4 ch01) ───────────────────────
// „each stands grey in the world with an ↑ cue". The cue and the reach are ONE
// number: the arrow appears over exactly the thing a press would engage, so a
// child never presses ↑ at something the game silently considers out of range.
// Generous on purpose (the letter-magnet lesson, R3-16): a six-year-old parks
// their mascot roughly next to a desk, not on its centre pixel.
export const ENGAGE_REACH_PX = 22;
export const ENGAGE_REACH_Y_PX = 34;

/** The roles a ↑ press can reach. Cages are here because ch01 grants NO FIST
 *  (doc 44 §4 ability amendment) and a cage that only a punch can open would
 *  make the chapter's one classmate unrescuable — the fist path below stays
 *  exactly as it was for every chapter that does grant it.
 *
 *  PK-R6 · D: and a `classmate` mid-reawakening, which is the anti-softlock
 *  law (PB-T1) applied to a six-round ceremony — putting round 3 down with
 *  „Später" must leave a way back INTO it, and ↑ is the verb this chapter
 *  already teaches for stepping up to a bewitched being. */
export const ENGAGEABLE_ROLES = new Set<string>(["drained", "cage", "classmate"]);

const inEngageReach = (e: EntityState, playerX: number, playerY: number): boolean =>
  Math.abs(e.x - playerX) / SUBS < ENGAGE_REACH_PX
  && Math.abs(e.y - playerY) / SUBS < ENGAGE_REACH_Y_PX;

/**
 * Which being a ↑ press would engage right now, or null. PURE and exported so
 * the RENDERER draws the cue from the same answer the sim acts on — the „the
 * picture and the pickup can never disagree" rule the letter magnet already
 * follows. Nearest wins when two things stand close.
 */
export const engageTargetId = (
  w: EntityWorld,
  playerX: number,
  playerY: number,
): string | null => {
  let best: { id: string; d: number } | null = null;
  for (const e of w.entities) {
    if (e.hidden || e.redeemed || !ENGAGEABLE_ROLES.has(e.role)) continue;
    if (!inEngageReach(e, playerX, playerY)) continue;
    const d = Math.abs(e.x - playerX);
    if (best === null || d < best.d) best = { id: e.id, d };
  }
  return best?.id ?? null;
};

/** Ground snap for walking enemies (thin wrapper over the mover's surface probe). */
const groundAt = (grid: readonly string[], xSubs: number, ySubs: number): number | null => {
  const fromRow = Math.max(Math.floor(ySubs / SUBS / TILE) - 1, 0);
  const s = groundSurfaceAt(grid, xSubs / SUBS, fromRow, 4);
  return s === null ? null : s.yPx * SUBS;
};

/** PB-T2 · the kinematic platform path — ONE source of truth for the runtime
 *  step (above), the reachability validator (level.ts BFS sees the platform's
 *  swept cells through this), and any renderer. Pure function of (home, params,
 *  tick): platform.move rides a triangle wave; platform.swing a pendulum. */
export const platformPathAt = (
  role: "platform.move" | "platform.swing",
  homeX: number,
  homeY: number,
  params: Record<string, unknown>,
  tick: number,
): { x: number; y: number; period: number } => {
  if (role === "platform.move") {
    const dxT = Number(params.dxTiles ?? 4);
    const dyT = Number(params.dyTiles ?? 0);
    const period = Number(params.periodTicks ?? 240);
    const ph = (tick % period) / period;
    const wave = ph < 0.5 ? ph * 2 : 2 - ph * 2; // triangle 0→1→0
    return {
      x: homeX + Math.round(dxT * TILE * SUBS * wave),
      y: homeY + Math.round(dyT * TILE * SUBS * wave),
      period,
    };
  }
  const rope = Number(params.ropePx ?? 48);
  const period = Number(params.periodTicks ?? 180);
  const a = Math.sin((tick % period) / period * Math.PI * 2) * 0.9;
  // R5-A4: a pendulum bob RISES toward its turn-points (cos flattens the
  // rope). The old extra minus sign dipped it DOWN there instead — the
  // visible end-of-arc jerk on p3's upper mover.
  return {
    x: homeX + Math.round(Math.sin(a) * rope * SUBS),
    y: homeY + rope * SUBS + Math.round((Math.cos(a) - 1) * rope * SUBS * 0.25),
    period,
  };
};

/** PB-T1 · the walker's AHEAD probe (the entity ground contract): strict about
 *  edges — a drop deeper than one tile, a tall rise, a slope, or a one-way
 *  reads as "no ground" and the walker TURNS, unless the role opts in via
 *  `params.walkSlopes` (v1's forgiving 4-row probe sent pencils strolling
 *  down ramps and off ledges — the playtest's "random walking" class). */
const walkAheadAt = (grid: readonly string[], e: EntityState, xSubs: number): number | null => {
  const opts = e.params?.walkSlopes === true ? { maxDropTiles: 1, acceptSlopes: true, acceptOneWays: true } : { maxDropTiles: 1 };
  const s = walkSurfaceAhead(grid, xSubs / SUBS, e.y / SUBS, opts);
  return s === null ? null : s.yPx * SUBS;
};

// ── PK-R6 · E · the flight, as PURE FUNCTIONS (so the fight is a table) ──────

/** How long this knot's telegraph runs, in ticks — the tier script tightened by
 *  the knot's rate and then held at the fairness floor. THE floor is the point:
 *  every caller goes through here, so there is no path by which a shorter tell
 *  can reach a child. */
export const telegraphTicksFor = (tier: "E" | "M" | "S", hp: number, knots: number): number =>
  Math.max(TELEGRAPH_FLOOR_TICKS, Math.round(GUARDIAN_SCRIPT[tier].telegraphTicks * (KNOT_RATE[knotIndex(hp, knots)] ?? 1)));

/** How long she flies between throws, in ticks (same escalation, no floor — a
 *  faster rhythm is fair as long as each throw is still announced). */
export const throwEveryFor = (tier: "E" | "M" | "S", hp: number, knots: number): number =>
  Math.round(GUARDIAN_SCRIPT[tier].throwEvery * (KNOT_RATE[knotIndex(hp, knots)] ?? 1));

/** Where on her path she is, in SUBS, given her flight centre and her path tick.
 *  Exported because the flight-band test recomputes the whole traversal from
 *  here — the claim „her body never leaves the visible band" is then checked
 *  against the function the sim actually flies, not against a copy of it. */
export const flightPointAt = (
  centreXSubs: number,
  centreYSubs: number,
  hp: number,
  knots: number,
  flightTick: number,
): { x: number; y: number } => {
  const ki = knotIndex(hp, knots);
  const period = KNOT_PERIOD_TICKS[ki] ?? 300;
  const span = KNOT_SPAN_PX[ki] ?? 78;
  const { fx, fy } = flightUnitAt(pathForKnot(hp, knots), flightTick / period);
  return {
    x: centreXSubs + Math.round(fx * span * SUBS),
    y: centreYSubs + Math.round(fy * FLIGHT_BAND_PX * SUBS),
  };
};

export const stepEntities = (
  w: EntityWorld,
  grid: readonly string[],
  inp: WorldInput,
): EntityEvent[] => {
  const events: EntityEvent[] = [];
  if (inp.playerOverlayOpen) return events; // the world holds its breath during a task

  // PK-R6 · C1: resolve the ↑ press ONCE, to ONE being. Asking each entity
  // "am I in reach?" independently would open two cards for one press where a
  // desk and a cage stand together — and the second would be a card about a
  // being the child never chose.
  const engageId = inp.playerEngage === true ? engageTargetId(w, inp.playerX, inp.playerY) : null;

  for (const e of w.entities) {
    if (e.hidden) continue;
    // R3-5: a freed friend keeps LIVING (joy → rest); it is no longer skipped
    if (e.redeemed) { stepRedeemed(e); continue; }
    e.timer += 1;
    switch (e.role) {
      case "chaser": {
        if (e.state === "patrol") {
          e.vx = ENEMY_WALK * e.dir;
          const aheadX = e.x + e.vx * 8;
          const g = walkAheadAt(grid, e, aheadX);
          // R5-P1 (p1-Dossier-Vorleistung): ein AUTORISIERTES Patrouillen-Band —
          // der Läufer wendet an params.patrolMinC/MaxC wie an einer Kante, so
          // kann ein Lehr-Screen seine Null-Gefahr-Zone GARANTIEREN.
          const bandMin = e.params?.patrolMinC !== undefined ? (Number(e.params.patrolMinC) * TILE + TILE / 2) * SUBS : null;
          const bandMax = e.params?.patrolMaxC !== undefined ? (Number(e.params.patrolMaxC) * TILE + TILE / 2) * SUBS : null;
          const bandTurn = (bandMin !== null && e.dir < 0 && e.x <= bandMin) || (bandMax !== null && e.dir > 0 && e.x >= bandMax);
          // doc 40 §2 · the turn is its OWN beat now (18 t, flip at midpoint) —
          // a walker that reversed in one tick read as a glitch, not a decision
          if (g === null || bandTurn) { e.state = "turn"; e.timer = 0; e.vx = 0; } // edge/ramp/band turn
          else {
            e.x += e.vx;
            const snap = groundAt(grid, e.x, e.y);
            if (snap !== null) e.y = snap;
          }
          const sameBand = Math.abs(e.y - inp.playerY) / SUBS < 24;
          if (sameBand && Math.abs(e.x - inp.playerX) / SUBS < AGGRO_X_PX) { e.state = "telegraph"; e.timer = 0; }
        } else if (e.state === "turn") {
          if (e.timer === TURN_FLIP_AT) e.dir = (e.dir * -1) as 1 | -1;
          if (e.timer > TURN_TICKS) { e.state = "patrol"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          // doc 40 §2: 24 → 30 t (both were under the study's shortest telegraph)
          if (e.timer > 30) { e.state = "act"; e.timer = 0; e.dir = (inp.playerX >= e.x ? 1 : -1) as 1 | -1; }
        } else if (e.state === "act") {
          const g = walkAheadAt(grid, e, e.x + ENEMY_LUNGE * e.dir * 4);
          if (g !== null) { e.x += ENEMY_LUNGE * e.dir; const s2 = groundAt(grid, e.x, e.y); if (s2 !== null) e.y = s2; }
          if (e.timer > 40 || g === null) { e.state = "patrol"; e.timer = 0; }
        }
        break;
      }
      case "gunner": {
        const every = e.tier === "E" ? 210 : e.tier === "M" ? 160 : 120;
        const inRange = Math.abs(e.x - inp.playerX) / SUBS < 140;
        if (e.state === "patrol" && inRange && e.timer > every) { e.state = "telegraph"; e.timer = 0; }
        else if (e.state === "telegraph" && e.timer > 30) {
          e.state = "patrol"; e.timer = 0;
          const dir = inp.playerX >= e.x ? 1 : -1;
          w.projectiles.push({
            id: w.nextProjectileId++, kind: "blob", x: e.x, y: e.y - 10 * SUBS,
            vx: Math.round(1.4 * SUBS) * dir, vy: -Math.round(2.2 * SUBS), deflected: false, fromId: e.id, dead: false, age: 0, colour: "",
          });
        }
        break;
      }
      case "flyer": {
        // sine patrol around home altitude; dive when the player is below
        const t = e.timer;
        if (e.state === "patrol") {
          e.x = e.homeX + Math.round(Math.sin(t / 40) * FLYER_SWEEP_PX * SUBS);
          e.y = e.homeY + Math.round(Math.sin(t / 23) * 6 * SUBS);
          const below = inp.playerY > e.y && Math.abs(e.x - inp.playerX) / SUBS < 24;
          if (below && t > 90) { e.state = "telegraph"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          if (e.timer > 30) { e.state = "act"; e.timer = 0; } // doc 40 §2: 20 → 30 t
        } else if (e.state === "act") {
          e.y += Math.round(2.2 * SUBS);
          if (e.y >= inp.playerY || e.timer > 40) { e.state = "recover"; e.timer = 0; }
        } else if (e.state === "recover") {
          e.y -= Math.round(1.2 * SUBS);
          if (e.y <= e.homeY) { e.y = e.homeY; e.state = "patrol"; e.timer = 0; }
        }
        break;
      }
      case "bouncer": {
        // R5-A3 · the bouncer contract (doc 45): (1) land only by CROSSING a
        // surface — the same law moveBody holds the player to. The forgiving
        // probe scans from one row ABOVE the feet, so a sideways drift under a
        // higher column used to SNAP him up onto it; along rising terrain that
        // ratchet carried him off the top of the screen. (2) The horizontal
        // step probes the wall ahead EVERY tick, air included — the arc used
        // to be contract-free, so he drifted through columns and was then
        // lifted on top of them.
        const prevY = e.y;
        e.vy += GRAVITY;
        e.y += e.vy;
        const g = groundAt(grid, e.x, e.y);
        if (g !== null && e.vy > 0 && prevY <= g && e.y >= g) {
          e.y = g;
          e.vy = -BOUNCE_UP;
          const aheadG = walkAheadAt(grid, e, e.x + 20 * SUBS * e.dir);
          if (aheadG === null) e.dir = (e.dir * -1) as 1 | -1;
        }
        const step = Math.round(0.5 * SUBS) * e.dir;
        const edgeC = Math.floor(((e.x + step) / SUBS + 10 * e.dir) / TILE);
        const feetPx = e.y / SUBS;
        const blocked = isSolid(glyphAt(grid, edgeC, Math.floor((feetPx - 4) / TILE))) ||
          isSolid(glyphAt(grid, edgeC, Math.floor((feetPx - 14) / TILE)));
        if (blocked) e.dir = (e.dir * -1) as 1 | -1;
        else e.x += step;
        break;
      }
      case "crusher": {
        // rests high at home; slams when the player passes beneath
        if (e.state === "patrol") {
          const under = Math.abs(e.x - inp.playerX) / SUBS < 16 && inp.playerY > e.y;
          if (under) { e.state = "telegraph"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          if (e.timer > 28) { e.state = "act"; e.timer = 0; }
        } else if (e.state === "act") {
          e.y += Math.round(4 * SUBS);
          const g = groundAt(grid, e.x, e.y);
          if (g !== null && e.y >= g) {
            e.y = g; e.state = "recover"; e.timer = 0;
            // R3-6: a slam that lands silently reads as scenery. The dust is what
            // says „this thing DROPS" — the stomper's purpose, shown not stated.
            events.push({ type: "puff", x: e.x, y: e.y, kind: "chalk" });
          }
        } else if (e.state === "recover") {
          if (e.timer > 45) { e.y -= SUBS; if (e.y <= e.homeY) { e.y = e.homeY; e.state = "patrol"; } }
        }
        break;
      }
      case "swarm": {
        // the moth cloud drifts around home, leaning gently toward the player
        const t = e.timer;
        const lean = Math.sign(inp.playerX - e.x) * Math.min(Math.abs(inp.playerX - e.x) / 8, 0.4 * SUBS);
        e.x = e.homeX + Math.round(Math.sin(t / 30) * 24 * SUBS) + Math.round(lean * Math.min(t, 240) / 240);
        e.y = e.homeY + Math.round(Math.sin(t / 17) * 10 * SUBS);
        break;
      }
      case "platform.move": {
        const p = platformPathAt("platform.move", e.homeX, e.homeY, e.params, e.timer);
        e.vx = p.x - e.x; e.vy = p.y - e.y; // per-tick delta for the ride contract
        e.x = p.x; e.y = p.y;
        break;
      }
      case "platform.swing": {
        const p = platformPathAt("platform.swing", e.homeX, e.homeY, e.params, e.timer);
        e.vx = p.x - e.x; e.vy = p.y - e.y;
        e.x = p.x; e.y = p.y;
        break;
      }
      case "platform.fall": {
        if (e.state === "armed") {
          if (e.timer > 24) { e.state = "falling"; e.timer = 0; }
        } else if (e.state === "falling") {
          e.vy = Math.min(e.vy + GRAVITY, 3 * SUBS);
          e.y += e.vy;
          if ((e.y - e.homeY) / SUBS > 160) { e.state = "gone"; e.vy = 0; }
        }
        break;
      }
      // PK-R6 · C1 · THE DRAINED CLASSROOM OBJECT (doc 44 §4 ch01 field
      // restage). No brain, no menace, no contact damage: it stands where it
      // fell and waits. The child walks up and presses ↑; the sim turns the
      // event into its two-step `restore` card. Contact alone does NOTHING on
      // purpose — a desk that ambushed you with a vocabulary question every
      // time you brushed past would make the calm tutorial chapter hostile.
      case "drained": {
        if (e.id === engageId) {
          e.state = "shaking";
          e.timer = 0;
          events.push({ type: "engaged", id: e.id, role: e.role, skin: e.skin });
        } else if (e.state === "shaking" && e.timer > 30) e.state = "patrol";
        break;
      }
      // PK-R6 · D · THE BEWITCHED CLASSMATE (doc 44 §3.3). Like a drained
      // object she has no brain and no menace — she stands where she stepped
      // out of the cage, acting out whatever wrong action the open round asks
      // for (the pose is set by the shell from the card's own art binding, so
      // the picture in the card and the figure in the world are one
      // declaration). Contact does nothing; only ↑ resumes a deferred round.
      case "classmate": {
        if (e.id === engageId) events.push({ type: "awakenAsk", id: e.id, skin: e.skin });
        break;
      }
      case "cage": {
        // PK-R6 · C2: ↑ opens a cage in a chapter with no fist. One press frees
        // it — the two-hit rattle below is the FIST's grammar (wind up, feel the
        // weight, hit it again), and it stays exactly that for the chapters that
        // grant one. There is nothing to wind up about a hand on a latch.
        // R5-P1 (Arena-Dossier-Vorleistung): solange der Wächter der Phase
        // steht, ist der Käfig GEGATED (Toast-Klasse wie das ✕) — der
        // Klassenfoto-Beat darf nie mitten im Kampf feuern. Copy = P4-Platzhalter.
        if (inp.cagesGated === true && e.state !== "burst" && e.id === engageId) {
          events.push({ type: "cageGated", id: e.id });
          break;
        }
        if (e.state !== "burst" && e.id === engageId) {
          e.state = "burst"; e.redeemed = true; e.timer = 0; e.freedTick = 0;
          events.push({ type: "cageBurst", id: e.id, skin: e.skin });
        } else if (e.state === "closed" && fistHits(e, inp.fist, 16)) {
          e.hp -= 1;
          events.push({ type: "puff", x: inp.fist?.x ?? e.x, y: inp.fist?.y ?? e.y, kind: "hit" }); // R3-6
          if (e.hp <= 0) { e.state = "burst"; e.redeemed = true; e.timer = 0; e.freedTick = 0; events.push({ type: "cageBurst", id: e.id, skin: e.skin }); }
          else { e.state = "shaking"; e.timer = 0; events.push({ type: "cageHit", id: e.id, hpLeft: e.hp }); }
        } else if (e.state === "shaking" && e.timer > 30) e.state = "closed";
        break;
      }
      case "powerup": {
        if (overlapsPlayer(e, inp, 14, 20)) {
          e.redeemed = true;
          events.push({ type: "powerupTaken", id: e.id, grants: String(e.params.grants ?? "punch") });
        }
        break;
      }
      // PK-R3b · R3-16 · the static-state collectibles (doc 41 §5). No brain at
      // all: they sit where they were placed and are TAKEN on contact. The
      // generous 18×24 box is deliberate — a rule page a child brushes past and
      // does not get is the „only a small field gets them" complaint the letter
      // magnet exists to answer, and it applies here twice over.
      case "tip":
      case "book": {
        if (overlapsPlayer(e, inp, 18, 24)) {
          e.redeemed = true;
          e.timer = 0;
          events.push({ type: "pickupTaken", id: e.id, role: e.role, skin: e.skin });
        }
        break;
      }
      case "door.trigger": {
        if (overlapsPlayer(e, inp, 12, 26) && e.state !== "cooling") {
          e.state = "cooling"; e.timer = 0;
          events.push({ type: "doorTouched", id: e.id, kind: String(e.params.kind ?? "exit") });
        } else if (e.state === "cooling" && e.timer > 90 && !overlapsPlayer(e, inp, 12, 26)) {
          // R5-A2 (critic finding): a door re-arms only once the child has
          // STEPPED OFF it — returning from the Kleckskammer spawns ON the
          // door, and a timer-only re-arm reopened the pay card every ~1.5 s
          // over an empty purse. Same law as the ↑ rising edge (PK-R6 C1):
          // held contact never re-asks.
          e.state = "patrol";
        }
        break;
      }
      case "guardian": {
        const script = GUARDIAN_SCRIPT[e.tier];
        if (w.guardianKnots < 0) w.guardianKnots = script.knots;
        // ── PK-R6 · E · THE FLYING TAFEL (doc 44 §4 ch01 C4) ────────────────
        // „She hovers above the arena tracing readable paths — spirals,
        // figure-eights, zigzags … telegraph: she dips and rears, ≥500 ms …
        // throws colored chalk that arcs down and shatters."
        //
        // The whole machine is airborne: there is no grounded state left to
        // reach until she is BEATEN, which is the mechanical half of the
        // identity law (PB-F1). The grounded cells (`tafel_sad`/`_dazed`/
        // `_stagger`) belong to the retired easel and anim.ts now refuses to
        // resolve to them for any state this machine can be in mid-flight.

        // THE TERMINAL BEATS — she is down, and she comes to rest (doc 44 §4
        // ch01 C4: „she sinks to the ground, exhausted").
        if (e.state === "sink") {
          const floor = groundAt(grid, e.x, e.y);
          const floorY = floor ?? e.y;
          e.vx = 0;
          e.y = Math.min(e.y + SINK_SPEED, floorY);
          if (e.y >= floorY) { e.y = floorY; e.state = "sad"; e.timer = 0; }
          break;
        }
        if (e.state === "sad") {
          // R3-5 kept: the board reacts BEFORE the victory cell. What changed is
          // the reaction — doc 44 §2.2 flexibilised the signature beat („the
          // Tafel slumps exhausted"), so she rests rather than cries.
          if (e.timer > SAD_TICKS) { e.state = "consoled"; e.timer = 0; }
          break;
        }
        // `window` (the counter-task) and `consoled` are scene-driven states.
        if (e.state === "window" || e.state === "consoled") break;

        // THE DIP — three dodged throws over-reach her and she comes DOWN to
        // the child to write (doc 44 §4 ch01 C4 + the boss-evidence law, doc 41
        // §4). Coming down is not decoration: four chalked words have to be
        // readable at 1×, and the card's asker has to be ON SCREEN or the
        // speaker law parks the request against a boss who is no longer moving.
        if (e.state === "dip") {
          const side: 1 | -1 = e.x <= inp.playerX ? -1 : 1;
          const tx = inp.playerX + side * DIP_STANDOFF_PX * SUBS;
          const step = Math.round((tx - e.x) / 6);
          e.vx = step;
          e.x += step;
          e.y += Math.round((DIP_Y_PX * SUBS - e.y) / 6);
          e.dir = (inp.playerX >= e.x ? 1 : -1) as 1 | -1;
          if (e.timer > DIP_TICKS) {
            e.state = "stagger";
            e.timer = 0;
            e.vx = 0; // she has ARRIVED — a window that still carries travel
            e.vy = 0; // would drift her out from under her own chalked words
            eventsPushStagger(events, e.id);
          }
          break;
        }
        if (e.state === "stagger") {
          // the FIST path (every chapter that grants one): a deflected piece
          // reels her without the dip. She hangs there until her card opens;
          // the timeout is the no-card fallback that keeps her from freezing.
          e.vx = 0;
          if (e.timer > script.staggerTicks) { e.state = "fly"; e.timer = 0; }
          break;
        }

        // THE COUNTER-WINDOW OPENS — but only out of level flight. Interrupting
        // a windup would drop a telegraph the child has already started reading
        // and leave a throw that never comes; this is the „never mid-crossing"
        // rule of PK-C3 carried over to an aerial boss.
        if (e.dodges >= DODGES_PER_WINDOW && e.state === "fly") {
          e.dodges = 0;
          e.state = "dip";
          e.timer = 0;
          break;
        }

        // THE FLIGHT CENTRE follows the child — slowly, and clamped inside the
        // stage. Mined in shape from the legacy `cloud` brain (drift toward the
        // player's column, THEN telegraph, THEN fire): a tell thrown from off
        // screen is not a tell.
        const ki = knotIndex(e.hp, script.knots);
        const span = KNOT_SPAN_PX[ki] ?? 78;
        // R5-P1 (Arena-Dossier-Vorleistung): die Tafel gehört auf die BÜHNE.
        // params.stageMinC/stageMaxC klemmen das Flug-Zentrum auf das Bühnen-
        // Band (Zentrum ∈ [stageMin+Spann, stageMax−Spann]) — die Seitenbühnen
        // (Auftritt West, Sieg-Trakt Ost) sind damit mechanisch heilig; ohne
        // Params bleibt exakt das alte Welt-Verhalten.
        const stageMinPx = e.params?.stageMinC !== undefined ? Number(e.params.stageMinC) * TILE : FLIGHT_MARGIN_PX;
        const stageMaxPx = e.params?.stageMaxC !== undefined ? (Number(e.params.stageMaxC) + 1) * TILE : (grid[0]?.length ?? 0) * TILE - FLIGHT_MARGIN_PX;
        const loC = (stageMinPx + span) * SUBS;
        const hiC = Math.max(loC, (stageMaxPx - span) * SUBS);
        const wantC = Math.min(Math.max(inp.playerX, loC), hiC);
        const dC = wantC - e.homeX;
        e.homeX += Math.max(-CENTRE_MAX_STEP, Math.min(CENTRE_MAX_STEP, Math.trunc(dC / CENTRE_EASE_DIV)));

        if (e.state === "fly") {
          e.flightTick += 1;
          const p = flightPointAt(e.homeX, e.homeY, e.hp, script.knots, e.flightTick);
          e.vx = p.x - e.x; // the per-tick travel: what the bank cells depict
          e.vy = p.y - e.y;
          e.x = p.x;
          e.y = p.y;
          // she faces the way she flies, so a banked cell and its direction of
          // travel can never disagree (R3-4's facing law, moved into the air)
          if (Math.abs(e.vx) > SUBS / 4) e.dir = (e.vx > 0 ? 1 : -1) as 1 | -1;
          if (e.timer > throwEveryFor(e.tier, e.hp, script.knots)) { e.state = "telegraph"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          // THE TELL: she holds station and rears (windup0 → windup1 → windup).
          // Holding is what makes the shape readable — a boss that keeps tracing
          // its path while winding up gives the child two things to read at once.
          e.vx = 0;
          e.vy = 0;
          e.dir = (inp.playerX >= e.x ? 1 : -1) as 1 | -1;
          if (e.timer > telegraphTicksFor(e.tier, e.hp, script.knots)) {
            // THE ARC (doc 44 §3.2: the cloud-bolt brain „generalized to thrown
            // chalk"). The legacy bolt was a straight vertical line; chalk falls.
            // So the throw SOLVES its own arc: with `vy += g` applied before the
            // step, after n ticks y = y0 + n·vy0 + g·n(n+1)/2 — invert that for
            // the child's feet at exactly CHALK_FLIGHT_TICKS and both axes fall
            // out. Aimed at where they STAND, which is why moving is the answer.
            const colour = CHALK_COLOURS[e.throws % CHALK_COLOURS.length] ?? "white";
            e.throws += 1;
            const x0 = e.x + 10 * SUBS * e.dir;
            const y0 = e.y - 22 * SUBS;
            const T = CHALK_FLIGHT_TICKS;
            w.projectiles.push({
              id: w.nextProjectileId++, kind: "chalk", x: x0, y: y0,
              vx: Math.round((inp.playerX - x0) / T),
              vy: Math.round((inp.playerY - y0 - (CHALK_GRAVITY * T * (T + 1)) / 2) / T),
              deflected: false, fromId: e.id, dead: false, age: 0, colour,
            });
            e.state = "throw";
            e.timer = 0;
          }
        } else if (e.state === "throw") {
          if (e.timer > THROW_TICKS) { e.state = "fly"; e.timer = 0; }
        }
        break;
      }
      default:
        break;
    }

    // ── contact: cross beings open ENCOUNTERS (never damage-kill) ──
    const hostile = ["chaser", "gunner", "flyer", "bouncer", "crusher", "swarm"].includes(e.role);
    if (hostile && !e.redeemed && inp.playerIframes === 0 && overlapsPlayer(e, inp)) {
      events.push({ type: "encounter", id: e.id, role: e.role, skin: e.skin });
    }
    // the fist SHOOS hostiles (turn + brief daze), never redeems (§3)
    if (hostile && fistHits(e, inp.fist)) {
      if (e.state !== "shooed") {
        e.state = "shooed"; e.timer = 0; e.dir = (e.dir * -1) as 1 | -1;
        // R3-6: the punch used to pass THROUGH with nothing but a toast to show
        // for it (11.45.43). Contact is now visible where it happens.
        events.push({ type: "puff", x: inp.fist?.x ?? e.x, y: inp.fist?.y ?? e.y, kind: "hit" });
        events.push({ type: "shooed", id: e.id });
      }
    }
    if (e.state === "shooed" && e.timer > 40) e.state = "patrol";
  }

  // ── projectiles ──
  // PK-R6 · E: shards are BORN here (a landed piece leaves one), so they are
  // collected and appended AFTER the sweep — a shard pushed into the array
  // mid-`for…of` would be stepped on the tick it was created and lose a frame
  // of its 1-second life to the throw that made it.
  const born: ProjectileState[] = [];
  for (const p of w.projectiles) {
    if (p.dead) continue;
    // ── PK-R6 · E · THE LINGERING SHARD (doc 44 §4 ch01 C4) ─────────────────
    // „chalk shards linger 1 s as floor hazards". It does not move, it cannot be
    // deflected, and it is NOT a dodge — the dodge was already paid for by the
    // piece that made it. What it is, is a reason not to stand where the last
    // throw landed, which is what turns dodging from a reflex into a place.
    if (p.kind === "shard") {
      p.age++;
      if (p.age > SHARD_TICKS) {
        p.dead = true;
        events.push({ type: "puff", x: p.x, y: p.y, kind: "chalk" });
      } else if (
        inp.playerIframes === 0
        && Math.abs(p.x - inp.playerX) / SUBS < SHARD_REACH_X_PX
        && Math.abs(p.y - inp.playerY) / SUBS < SHARD_REACH_Y_PX
      ) {
        p.dead = true;
        const src = w.entities.find((e) => e.id === p.fromId);
        events.push({ type: "encounter", id: p.fromId, role: src?.role ?? "guardian", skin: src?.skin ?? "tafel" });
      }
      continue;
    }
    p.age++;
    // chalk floats on a long readable arc (the deflect window); blobs drop fast
    p.vy += p.kind === "chalk" ? CHALK_GRAVITY : Math.round(GRAVITY / 2);
    p.x += p.vx;
    p.y += p.vy;
    const g = groundAt(grid, p.x, p.y);
    // R3-4 · A MISS SHATTERS. Chalk that lands is dust, not a resting orb; a
    // deflected piece keeps its floor pass (it must fly home over the ground)
    // but only on a leash — past that it shatters too, so nothing lingers.
    if (g !== null && p.y >= g && !p.deflected) {
      p.dead = true;
      if (p.kind === "chalk") events.push({ type: "puff", x: p.x, y: p.y, kind: "chalk" });
      // ── PK-R6 · C2 · THE DODGE WINDOW (doc 44 §4 ch01: „dodging N throws
      // opens the counter-window") ──────────────────────────────────────────
      // A piece of chalk that reaches the floor is a piece the child got out of
      // the way of. Count it. This is the road into the fight that a chapter
      // with NO FIST has to have: the deflect path below still works and is
      // still the fast one, but it can no longer be the ONLY one, or ch01's
      // arena would be unwinnable the moment the fist moved to ch02.
      if (p.kind === "chalk") {
        // Counting only. WHEN the tally becomes a counter-window is the
        // guardian's own decision, taken in its machine above — by the time a
        // piece of chalk reaches the floor its thrower is already back on her
        // path, so opening the window from here would only ever interrupt a
        // telegraph the child had started reading.
        const src = w.entities.find((e) => e.id === p.fromId && e.role === "guardian" && !e.redeemed);
        if (src && src.state !== "stagger" && src.state !== "window" && src.state !== "dip") src.dodges += 1;
        // …and it leaves its splinter on the boards (doc 44 §4 ch01 C4)
        born.push({
          id: w.nextProjectileId++, kind: "shard", x: p.x, y: g,
          vx: 0, vy: 0, deflected: false, fromId: p.fromId, dead: false, age: 0, colour: p.colour,
        });
      }
    }
    if (p.deflected && p.kind === "chalk" && p.age > CHALK_LIFE_TICKS) {
      p.dead = true;
      events.push({ type: "puff", x: p.x, y: p.y, kind: "chalk" });
    }
    if (Math.abs(p.x) / SUBS > 4096 || p.y / SUBS > 4096) p.dead = true;
    // deflect: the fist bats a chalk piece back (§6 the deflect law)
    if (!p.deflected && inp.fist?.active && Math.abs(p.x - inp.fist.x) / SUBS < 20 && Math.abs(p.y - 8 * SUBS - inp.fist.y) / SUBS < 26) {
      p.deflected = true;
      p.vx = -p.vx * 2;
      p.vy = -SUBS; // a flat, fast return — it must CROSS the thrower's window, not sail over it
      // events for juice
      (p as ProjectileState).deflected = true;
      eventsPushDeflect(events, p.id);
    }
    // a deflected chalk piece staggers its guardian
    if (p.deflected && p.kind === "chalk") {
      const g0 = w.entities.find((e) => e.id === p.fromId && e.role === "guardian" && !e.redeemed);
      if (g0 && Math.abs(p.x - g0.x) / SUBS < 30 && Math.abs(p.y - (g0.y - 20 * SUBS)) / SUBS < 40) {
        p.dead = true;
        events.push({ type: "puff", x: p.x, y: p.y, kind: "chalk" }); // it breaks ON the board
        // PK-R6 · E: `dip` joins the two states a deflect may not interrupt —
        // she is already on her way down to open a window, and a second one
        // opened on top of it would ask two cards for one over-reach.
        if (g0.state !== "stagger" && g0.state !== "window" && g0.state !== "dip") {
          g0.state = "stagger";
          g0.timer = 0;
          eventsPushStagger(events, g0.id);
        }
      }
    }
    // an undeflected projectile touching the player = encounter (no death).
    // PK-R6 · E: …once it is ARMED. See CHALK_ARM_TICKS — a piece that can bite
    // on the tick it is thrown makes its own telegraph a lie.
    if (!p.deflected && inp.playerIframes === 0 && (p.kind !== "chalk" || p.age > CHALK_ARM_TICKS) &&
      Math.abs(p.x - inp.playerX) / SUBS < 10 && Math.abs(p.y - (inp.playerY - 15 * SUBS)) / SUBS < 16) {
      p.dead = true;
      const src = w.entities.find((e) => e.id === p.fromId);
      events.push({ type: "encounter", id: p.fromId, role: src?.role ?? "gunner", skin: src?.skin ?? p.kind });
    }
  }
  w.projectiles = w.projectiles.filter((p) => !p.dead);
  for (const s of born) w.projectiles.push(s);

  return events;
};

const eventsPushDeflect = (events: EntityEvent[], id: number): void => { events.push({ type: "projectileDeflected", id }); };
const eventsPushStagger = (events: EntityEvent[], id: string): void => { events.push({ type: "guardianStagger", id }); };

/** The scene calls this when the counter-window task is SOLVED: one knot unties. */
export const guardianKnotSolved = (w: EntityWorld, id: string): EntityEvent[] => {
  const g = w.entities.find((e) => e.id === id && e.role === "guardian");
  if (!g || g.redeemed) return [];
  g.hp -= 1;
  w.guardianKnots = g.hp;
  if (g.hp <= 0) {
    // PK-R6 · E · THE CONSOLATION (doc 44 §4 ch01 C4: „she sinks to the ground,
    // exhausted"). R3-5's law is untouched — a reaction still comes BEFORE the
    // victory cell — but the reaction is now the landing: `sink` settles her out
    // of the air onto the boards, `sad` is her resting there, and only then does
    // the console beat's `consoled` brighten her. She has already dipped low for
    // the window, so this is a short last fall, not a plummet.
    g.state = "sink";
    g.timer = 0;
    return [{ type: "guardianDown", id }];
  }
  // …and back into the air, on the NEXT knot's path from its own phase 0, so a
  // new shape starts cleanly instead of halfway through itself.
  g.state = "fly";
  g.timer = 0;
  g.flightTick = 0;
  g.dodges = 0;
  return [{ type: "guardianKnot", id, knotsLeft: g.hp }];
};

// ── PK-R6 · D · THE REAWAKENING MACHINE (doc 44 §3.3) ────────────────────────
// Deliberately NOT a new card machine. A reawakening is six ORDINARY cards in a
// row — the boss's knot battery is already exactly that shape (one world event
// per window, the world counting the rounds, `guardianKnotSolved` advancing it)
// and it is the shape that keeps the ceremony inside the shipped card kit
// instead of forking it. So this is the classmate's `guardianKnotSolved`: the
// world's counter, and nothing else.
//
// The one thing it does that no other redemption does is END IN STAGES. Every
// other being is drained or restored; she comes back by degrees, which is why
// the step is a number the renderer can read (anim.awakenWash) rather than a
// boolean the renderer can only wait for.

/** Which classmate stepped out of THIS cage, or null. The pointer runs from
 *  the person to the cage (EntityParams.cage), so a burst cage can find her —
 *  the `classmate-pair` level law proves the pointer exists before ship. */
export const classmateOfCage = (w: EntityWorld, cageId: string): EntityState | null =>
  w.entities.find((e) => e.role === "classmate" && e.params?.cage === cageId) ?? null;

/** One round of the reawakening is answered: she regains a degree. Returns
 *  `true` when THAT WAS THE LAST ONE — the caller (sim.solveTask) then plays the
 *  colour flood, the settle, the joy lap and counts the cage freed. */
export const awakenClassmate = (w: EntityWorld, id: string): boolean => {
  const e = w.entities.find((x) => x.id === id && x.role === "classmate");
  if (!e || e.redeemed) return false;
  e.awakenStep = Math.min(e.awakenStep + 1, AWAKEN_ROUNDS);
  e.timer = 0;
  if (e.awakenStep < AWAKEN_ROUNDS) {
    // between rounds she drops back to the caged cell: the spell has loosened
    // by one degree (the wash says so) but she is not acting anything out until
    // the next round's pose is set — a figure frozen in the LAST wrong action
    // while the world runs would read as the answer not having landed.
    e.state = "caged";
    return false;
  }
  e.redeemed = true;
  e.state = "settle";
  e.freedTick = 0; // the flood starts HERE, on its own clock (see freedTick)
  return true;
};

/** Bring a classmate all the way home without playing the rounds — the phase
 *  REMOUNT path (a chapter's Kleckskammer round trip rebuilds the Sim). Her
 *  cage is remembered in `freedCageIds`; she has to be remembered with it, or a
 *  child who buys Klecks' door after freeing her comes back to a friend sitting
 *  grey in a cage they already opened. */
export const restoreFreedClassmate = (e: EntityState, floodTicks = 0): void => {
  e.hidden = false;
  e.redeemed = true;
  e.awakenStep = AWAKEN_ROUNDS;
  e.state = "rest";
  e.timer = 0;
  // PK-R6 · H1: her flood clock starts PAST the flood, not at 0. A remounted
  // phase used to re-play the last degree of the spell letting go — a friend the
  // child freed ten minutes ago fading back in as if it were happening now.
  // Harmless while that degree was 0.12, and a lie the moment the flood became
  // the ceremony's payoff (0.40). Same rule as the once-per-freeing flourish: a
  // beat marks a CHANGE, and nothing changed here.
  //
  // The length is PASSED rather than imported: the flood belongs to the
  // renderer's wash grammar (anim.COLOUR_FLOOD_TICKS) and this file is what
  // that grammar reads FROM, so importing it back would close a module cycle
  // whose evaluation order the top-level constants here would then depend on.
  // The sim hands it in; `awakening.test.ts` pins that it hands in the real one.
  e.freedTick = Math.max(floodTicks, 0);
};

/** Redeem after a solved encounter task. R3-5: cross → JOY → settled at home,
 *  never "out of play" — the friend you made stays on the page. */
export const redeemEntity = (w: EntityWorld, id: string): void => {
  const e = w.entities.find((x) => x.id === id);
  if (!e) return;
  e.redeemed = true;
  e.timer = 0;
  e.freedTick = 0;
  e.state = JOY_ROLES.has(e.role) ? "joy" : "dazed";
};

/** Fire link actions when a trigger event lands (spawn/open/reveal → unhide). */
export const applyLinks = (w: EntityWorld, on: LinkSpec["on"], triggerId: string): string[] => {
  const revealed: string[] = [];
  for (const l of w.links) {
    if (l.trigger !== triggerId || l.on !== on) continue;
    for (const t of l.targets) {
      const e = w.entities.find((x) => x.id === t);
      if (e && e.hidden) { e.hidden = false; revealed.push(t); }
    }
  }
  return revealed;
};

/** G3 ride contract, scene-side helper: should the player attach to this platform? */
export const rideAttachCheck = (
  e: EntityState,
  playerFeetSubs: number,
  playerXSubs: number,
  playerVySubs: number,
): boolean => {
  if (!e.role.startsWith("platform")) return false;
  if (e.state === "gone") return false;
  const tolPx = Math.max(Math.abs(playerVySubs) / SUBS + 2, 4); // G3 verbatim
  const topPx = (e.y - 6 * SUBS) / SUBS;
  const dx = Math.abs(e.x - playerXSubs) / SUBS;
  return dx <= 20 && playerVySubs >= 0 && Math.abs(playerFeetSubs / SUBS - topPx) <= tolPx;
};
