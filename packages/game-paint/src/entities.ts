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
import { groundSurfaceAt, walkSurfaceAhead } from "./collide.ts";
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
   *  — guardian: idle|telegraph|throw|stagger|window|consoled. */
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
  /** PK-R6 · D · classmates only: how many reawakening rounds she has been
   *  given back, 0 … AWAKEN_ROUNDS (doc 44 §3.3). It is a COUNT rather than a
   *  reuse of `hp`, because it is read by the renderer as well as the sim —
   *  anim.washAlphaFor turns it into how grey she still is, and a number that
   *  means "hits left" in one file and "colour restored" in another is the
   *  drift class the pose thresholds were derived to avoid. */
  awakenStep: number;
  params: Record<string, unknown>;
}

export interface ProjectileState {
  id: number;
  kind: "chalk" | "blob";
  x: number;
  y: number;
  vx: number;
  vy: number;
  deflected: boolean;
  fromId: string;
  dead: boolean;
  /** ticks alive — a deflected piece that hits nothing shatters on this (R3-4). */
  age: number;
}

export type EntityEvent =
  | { type: "encounter"; id: string; role: string; skin: string }
  /** PK-R6 · C1: the child stepped up to a drained object and pressed ↑. The
   *  sim turns this into the being's `restore` card; solving it redeems the
   *  object and the colour floods back (anim.washAlphaFor). */
  | { type: "engaged"; id: string; role: string; skin: string }
  | { type: "cageHit"; id: string; hpLeft: number }
  | { type: "cageBurst"; id: string; skin: string }
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
  // lap — the colour flood (anim.washAlphaFor) is driven by it, and a knotted
  // school bag gets its colour back exactly like a moth does even though it
  // stays put. Before this the timer froze at redemption and a cage would have
  // been left half-drained forever.
  e.timer += 1;
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

/** Per-tier guardian script (sheet §6: telegraph/window shrink E→S, knots ≤5). */
// PK-C3 (gate verdict G4): the Tafel MOVES. Until now the guardian had no
// locomotion at all — it threw chalk from one spot for the whole fight, and
// the painted `tafel_roll` cell had no state to bind to (Build-D's F-5). After
// every throw it now ROLLS to the opposite station and settles, so the arena
// is a chase across the stage rather than a shooting gallery.
// Deterministic by construction: the direction comes from which side of home
// it currently stands on, never from a random roll — the proof tapes depend
// on this being reproducible tick for tick.
// `rollTicks` is a SAFETY NET, not the pacing knob — it must comfortably
// exceed a full station-to-station crossing (2 × range ÷ speed ≈ 205 ticks at
// every tier), or the roll times out halfway and the Tafel drifts to a
// meaningless spot. The live playtest caught exactly that: it settled at 246
// instead of its 216 station because a 260-tick cap could not cover 128 px at
// 0.375 px/tick.
export const GUARDIAN_SCRIPT = {
  E: { knots: 3, telegraphTicks: 60, throwEvery: 150, staggerTicks: 90, rollSpeed: 160, rollRangeTiles: 4, rollTicks: 320 },
  M: { knots: 4, telegraphTicks: 45, throwEvery: 120, staggerTicks: 75, rollSpeed: 200, rollRangeTiles: 5, rollTicks: 320 },
  S: { knots: 5, telegraphTicks: 32, throwEvery: 96, staggerTicks: 60, rollSpeed: 240, rollRangeTiles: 6, rollTicks: 320 },
} as const;

export const spawnEntities = (specs: EntitySpec[], links: LinkSpec[]): EntityWorld => ({
  entities: specs.map((s) => ({
    id: s.id,
    role: s.role,
    skin: s.skin,
    tier: s.tier,
    x: (s.c * TILE + TILE / 2) * SUBS,
    y: (s.r + 1) * TILE * SUBS,
    vx: 0,
    vy: 0,
    dir: -1,
    // PK-R6 · D: a classmate starts `caged` — the painted cell of the person
    // still under the spell (`merle_caged0/1`, eyes down, hands limp). It is
    // what the child sees in the beat between the cage bursting and the first
    // round's pose, and it is what she falls back to if a round is deferred.
    state: s.role === "cage" ? "closed" : s.role === "classmate" ? "caged"
      : s.role.startsWith("platform") ? "carry" : s.role === "guardian" ? "idle" : "patrol",
    timer: 0,
    hp: s.role === "cage" ? 2 : s.role === "guardian" ? GUARDIAN_SCRIPT[s.tier].knots : 1,
    homeX: (s.c * TILE + TILE / 2) * SUBS,
    homeY: (s.r + 1) * TILE * SUBS,
    redeemed: false,
    hidden: s.params?.hidden === true,
    dodges: 0,
    awakenStep: 0,
    params: s.params ?? {},
  })),
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
  return {
    x: homeX + Math.round(Math.sin(a) * rope * SUBS),
    y: homeY + Math.round((Math.cos(a) - 1) * -rope * SUBS * 0.25) + rope * SUBS,
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
          // doc 40 §2 · the turn is its OWN beat now (18 t, flip at midpoint) —
          // a walker that reversed in one tick read as a glitch, not a decision
          if (g === null) { e.state = "turn"; e.timer = 0; e.vx = 0; } // edge/ramp turn
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
            vx: Math.round(1.4 * SUBS) * dir, vy: -Math.round(2.2 * SUBS), deflected: false, fromId: e.id, dead: false, age: 0,
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
        e.vy += GRAVITY;
        e.y += e.vy;
        const g = groundAt(grid, e.x, e.y);
        if (g !== null && e.y >= g && e.vy > 0) {
          e.y = g;
          e.vy = -BOUNCE_UP;
          const aheadG = walkAheadAt(grid, e, e.x + 20 * SUBS * e.dir);
          if (aheadG === null) e.dir = (e.dir * -1) as 1 | -1;
        }
        e.x += Math.round(0.5 * SUBS) * e.dir;
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
        if (e.state !== "burst" && e.id === engageId) {
          e.state = "burst"; e.redeemed = true; e.timer = 0;
          events.push({ type: "cageBurst", id: e.id, skin: e.skin });
        } else if (e.state === "closed" && fistHits(e, inp.fist, 16)) {
          e.hp -= 1;
          events.push({ type: "puff", x: inp.fist?.x ?? e.x, y: inp.fist?.y ?? e.y, kind: "hit" }); // R3-6
          if (e.hp <= 0) { e.state = "burst"; e.redeemed = true; e.timer = 0; events.push({ type: "cageBurst", id: e.id, skin: e.skin }); }
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
        } else if (e.state === "cooling" && e.timer > 90) e.state = "patrol";
        break;
      }
      case "guardian": {
        const script = GUARDIAN_SCRIPT[e.tier];
        if (w.guardianKnots < 0) w.guardianKnots = script.knots;
        // ── PK-R6 · C2 · THE DODGE WINDOW (doc 44 §4 ch01: „dodging N throws
        // opens the counter-window") ────────────────────────────────────────
        // The fist-less road into the fight. Chalk that lands on the boards
        // instead of on the child is counted where it shatters; the window
        // opens HERE, the moment she is standing still enough to be caught
        // over-reaching. Never mid-roll: a stagger during a crossing drops her
        // wherever the slide had got to and she then idles off-station — the
        // „settling at 246 instead of its 216" defect from the live playtest.
        // Waiting costs the child nothing (she stands far longer than she
        // rolls) and keeps the deflect path below exactly as it was for every
        // chapter that does grant a fist.
        if (e.dodges >= DODGES_PER_WINDOW && e.state !== "roll" && e.state !== "stagger" && e.state !== "window") {
          e.dodges = 0;
          e.state = "stagger";
          e.timer = 0;
          eventsPushStagger(events, e.id);
          break;
        }
        if (e.state === "idle") {
          if (e.timer > script.throwEvery) {
            // R3-4 · THE FACING LAW: it may never throw at a back it is turned
            // to. Koki filmed exactly that (11.50.09) — the roll left `dir`
            // pointing at its home station while the throw aimed at the player,
            // so the board hurled chalk over its own shoulder. Turning is now
            // its own beat, and the throw reads the FACING, not the player.
            e.state = e.dir !== (inp.playerX >= e.x ? 1 : -1) ? "turn" : "telegraph";
            e.timer = 0;
          }
        } else if (e.state === "turn") {
          // doc 40 §2: 18 t, and the flip lands at the MIDPOINT — never tick 1
          if (e.timer === TURN_FLIP_AT) e.dir = (inp.playerX >= e.x ? 1 : -1) as 1 | -1;
          if (e.timer > TURN_TICKS) { e.state = "telegraph"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          if (e.timer > script.telegraphTicks) {
            const dir = e.dir; // the SPAWN SIDE IS THE FACING (R3-4, unit-tested)
            w.projectiles.push({
              id: w.nextProjectileId++, kind: "chalk", x: e.x + 14 * SUBS * dir, y: e.y - 24 * SUBS,
              vx: Math.round(2.5 * SUBS) * dir, vy: -3 * SUBS, deflected: false, fromId: e.id, dead: false, age: 0,
            });
            // …and then roll to the OTHER station (G4)
            e.state = "roll"; e.timer = 0;
            e.dir = e.x <= e.homeX ? 1 : -1;
          }
        } else if (e.state === "roll") {
          const target = e.homeX + e.dir * script.rollRangeTiles * TILE * SUBS;
          e.x += e.dir * script.rollSpeed;
          const arrived = e.dir > 0 ? e.x >= target : e.x <= target;
          if (arrived || e.timer > script.rollTicks) {
            if (arrived) e.x = target;
            e.state = "idle"; e.timer = 0;
          }
        } else if (e.state === "stagger") {
          // a deflect stops the roll dead — the stagger is the counter-window
          if (e.timer > script.staggerTicks) { e.state = "idle"; e.timer = 0; }
        } else if (e.state === "sad") {
          // R3-5 · doc 38's named cheap win: `tafel_sad` was painted and shown by
          // nothing, because the last knot jumped straight to the victory cell.
          // The board now CRIES first, and the console beat answers that.
          if (e.timer > SAD_TICKS) { e.state = "consoled"; e.timer = 0; }
        }
        // "window" (the counter-task) and "consoled" are scene-driven states.
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
  for (const p of w.projectiles) {
    if (p.dead) continue;
    p.age++;
    // chalk floats on a long readable arc (the deflect window); blobs drop fast
    p.vy += Math.round(GRAVITY / (p.kind === "chalk" ? 4 : 2));
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
        // guardian's own decision, taken in its machine below — by the time a
        // piece of chalk reaches the floor its thrower has already left the
        // throw in a roll, so opening the window from here would only ever
        // interrupt a crossing and strand her off-station.
        const src = w.entities.find((e) => e.id === p.fromId && e.role === "guardian" && !e.redeemed);
        if (src && src.state !== "stagger" && src.state !== "window") src.dodges += 1;
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
        if (g0.state !== "stagger" && g0.state !== "window") {
          g0.state = "stagger";
          g0.timer = 0;
          eventsPushStagger(events, g0.id);
        }
      }
    }
    // an undeflected projectile touching the player = encounter (no death)
    if (!p.deflected && inp.playerIframes === 0 &&
      Math.abs(p.x - inp.playerX) / SUBS < 10 && Math.abs(p.y - (inp.playerY - 15 * SUBS)) / SUBS < 16) {
      p.dead = true;
      const src = w.entities.find((e) => e.id === p.fromId);
      events.push({ type: "encounter", id: p.fromId, role: src?.role ?? "gunner", skin: src?.skin ?? p.kind });
    }
  }
  w.projectiles = w.projectiles.filter((p) => !p.dead);

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
    g.state = "sad"; // R3-5: the crying beat comes BEFORE the victory cell
    g.timer = 0;
    return [{ type: "guardianDown", id }];
  }
  g.state = "idle";
  g.timer = 0;
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
  return true;
};

/** Bring a classmate all the way home without playing the rounds — the phase
 *  REMOUNT path (a chapter's Kleckskammer round trip rebuilds the Sim). Her
 *  cage is remembered in `freedCageIds`; she has to be remembered with it, or a
 *  child who buys Klecks' door after freeing her comes back to a friend sitting
 *  grey in a cage they already opened. */
export const restoreFreedClassmate = (e: EntityState): void => {
  e.hidden = false;
  e.redeemed = true;
  e.awakenStep = AWAKEN_ROUNDS;
  e.state = "rest";
  e.timer = 0;
};

/** Redeem after a solved encounter task. R3-5: cross → JOY → settled at home,
 *  never "out of play" — the friend you made stays on the page. */
export const redeemEntity = (w: EntityWorld, id: string): void => {
  const e = w.entities.find((x) => x.id === id);
  if (!e) return;
  e.redeemed = true;
  e.timer = 0;
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
