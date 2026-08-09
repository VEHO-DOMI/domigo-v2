// THE PAINTED BOOK — deterministic sheet-frame selection (the proven game-2d
// pattern): frames advance on accumulated WALK TIME / entity ticks, never on
// wall-clock, so manual-step harness runs and real RAF agree exactly.

/** Current frame index for a cycling sheet. */
export const sheetFrame = (ticks: number, frameCount: number, ticksPerFrame: number): number =>
  frameCount <= 1 ? 0 : Math.floor(ticks / Math.max(ticksPerFrame, 1)) % frameCount;

/** doc 40 §2 · THE IDLE CYCLE stays 400 ms however many cells the art spends on
 *  it — 2 cells dwell 12 t each, 4 cells dwell 6 t (10 fps). Keeping the CYCLE
 *  constant and dividing it is what lets a richer idle sheet drop in without
 *  re-timing the world. */
export const IDLE_CYCLE_TICKS = 24;

/** The entity idle bob. `frameCount` is the number of painted idle cells the
 *  skin actually has (doc 40 §4's `bobFrame(frameCount)` upgrade). */
export const bobFrame = (ticks: number, frameCount = 2, ticksPerFrame = Math.max(1, Math.round(IDLE_CYCLE_TICKS / frameCount))): number =>
  sheetFrame(ticks, frameCount, ticksPerFrame);

/** Idle cell names in index order — `_a _b _c _d` (doc 40 §3's stem grammar). */
const IDLE_CELLS = ["a", "b", "c", "d"] as const;

// ── W4 · the entity POSE hook (batch AC's motion cells) ────────────────────
// Which sheet cell an entity shows this tick. Pure and Phaser-free so it is
// unit-testable on its own; PaintScene.entStateCell simply delegates here.
//
// The four motion poses are ADDITIVE by construction: when a `_run`/`_squash`/
// `_stomp`/`_bank` stem is absent, entTex's untouched fallback chain
// (pb-<skin>_<state> → pb-<skin>_a → fb-ent-<skin>) lands on the idle cell, so
// a missing stem can never break a render — the only-present law.
//
// Every threshold is DERIVED from the sim constant it depicts (imported, never
// re-typed), so a tuning change to the sim moves the pose with it.

import { AWAKEN_ROUNDS, BOUNCE_UP, ENEMY_WALK, FLYER_SWEEP_PX, JOY_ROLES } from "./entities.ts";
import { SUBS } from "./paint.ts";

// ── PK-R3b · R3-15 · THE DESATURATION GRAMMAR (doc 41 §2) ────────────────────
// OSWIN rained the colour out of the beings he bewitched, so a being you have
// not yet befriended renders GREY-WASHED and floods back to full colour the
// moment it is redeemed. That flood is the `restore` card's payoff made
// visible — the child's answer changes the picture, which is the whole reason
// the mechanic is worth a new task kind.
//
// It costs NO new art: the wash is a grey copy of the being's own sheet laid
// over it at this alpha, so every existing and future skin is covered by
// construction. (Phaser's `setTint` multiplies, which darkens rather than
// desaturates — an overlay is what actually drains colour.)

/** How much grey sits over an un-redeemed being. Enough that „the colour is
 *  gone" reads at 24 px, little enough that its SHAPE still names it — step 1
 *  of a restore card must stay answerable by looking. */
export const WASH_ALPHA = 0.72;
/** How long the colour takes to flood back in, in ticks (≈0.6 s at 60 Hz) —
 *  comfortably inside the joy lap (JOY_TICKS), so the flood and the
 *  Freudenrunde are one beat rather than two. */
export const COLOUR_FLOOD_TICKS = 36;

/** Which beings OSWIN's rain reached. The creatures, plus the CAGES: a knotted
 *  school bag is a redeemable being too, and two of ch01's restore cards are
 *  about exactly those bags — a card that says „ganz grau geworden" over a
 *  full-colour satchel would be the same lie R3-12 took off the boss.
 *
 *  PK-R6 · C1: and the DRAINED objects, which is the role the whole grammar
 *  was built for — ch01's field is now the grey classroom spread across the
 *  level, and „grey until you name it" is what makes it read as bewitched
 *  rather than as scenery. Doors, grants and platforms are furniture and were
 *  never drained.
 *
 *  PK-R6 · D: and the CLASSMATE, the one being the wash leaves in STAGES
 *  (awakenWash below) instead of all at once. doc 44 §3.3 asks for exactly
 *  this — „the classmate regains one degree of motion/colour" per round — and
 *  it costs no new grammar, only a step count where a boolean used to be. */
export const WASHED_ROLES = new Set<string>([...JOY_ROLES, "cage", "drained", "classmate"]);

// ── PK-R6 · D · THE SIX DEGREES (doc 44 §3.3) ────────────────────────────────
/** How grey a classmate still is after `step` of AWAKEN_ROUNDS rounds: the full
 *  ghost-wash divided into equal degrees, so every correct command takes a
 *  visible, equal bite out of the spell.
 *
 *  Why equal steps and not a curve: the rounds are equal work for the child, so
 *  a curve would pay two identical answers differently and the picture would
 *  stop being a progress bar the child can read. The LAST degree is the one the
 *  colour flood animates (washAlphaFor below), which is what makes the sixth
 *  round land as the flood doc 44 promises rather than as a seventh step.
 *
 *  Pure and exported so the stepping is unit-testable without a scene: the
 *  claim „she visibly lightens each round" is then a table, not a screenshot. */
export const awakenWash = (step: number, rounds: number = AWAKEN_ROUNDS): number =>
  WASH_ALPHA * (1 - Math.min(Math.max(step, 0), rounds) / Math.max(rounds, 1));

/** How opaque the grey wash over this being is right now, 0 … WASH_ALPHA.
 *  Pure: `timer` is the sim's own counter, which `redeemEntity` resets to 0 at
 *  the moment of redemption, so the flood starts exactly when the card is
 *  answered. Under reduced motion a redeemed being is simply already in
 *  colour — the end-states law, applied to the world instead of to CSS. */
export const washAlphaFor = (
  e: { role: string; redeemed: boolean; timer: number; awakenStep?: number },
  reducedMotion = false,
): number => {
  if (!WASHED_ROLES.has(e.role)) return 0; // furniture was never drained
  // PK-R6 · D: a classmate is drained BY DEGREES. Un-redeemed she stands at the
  // degree her rounds have earned (an instant step per round — the world is
  // frozen for the card, so a fade nobody's clock is running would be a change
  // the child never sees); redeemed, the flood animates the LAST degree away,
  // which is the sixth round's payoff and the same choreography every restored
  // being gets.
  const full = e.role === "classmate" ? awakenWash(Math.max((e.awakenStep ?? 0) - (e.redeemed ? 1 : 0), 0)) : WASH_ALPHA;
  if (!e.redeemed) return full;
  if (reducedMotion) return 0;
  const left = 1 - Math.min(Math.max(e.timer, 0), COLOUR_FLOOD_TICKS) / COLOUR_FLOOD_TICKS;
  return full * left;
};

/** Half the patrol speed: a chaser's vx is ±ENEMY_WALK while walking and 0 at
 *  an edge turn, so this cleanly separates "striding" from "stopped". */
export const RUN_VX = ENEMY_WALK / 2;
/** The fast part of a bouncer's arc, i.e. the squash at the bottom — the art
 *  shows the body flattened wide, which is contact, not apex. */
export const SQUASH_VY = BOUNCE_UP * 0.8;
/** Near the extremes of the flyer's sweep, where it rolls into the turn — the
 *  art shows the whole body banked over, which is a turn, not a straight run. */
export const BANK_X = FLYER_SWEEP_PX * SUBS * 0.8;

// ── PK-R6 · E · THE FLIGHT RIG vs THE RETIRED EASEL (doc 44 §4 ch01 C4) ──────
// The Tafel was REPAINTED as a flying board (stage G's `tafel_flight` sheet:
// hover ×4, banks, spirals, windups, throw, lands, rest, win). Four stems from
// her older sheet survived on disk and still show the GROUNDED EASEL — a
// different body on legs. Any mid-air state that resolved to one of them would
// swap the boss's body in the middle of her own fight: that is the PB-F1
// identity defect, the one this rig exists to end.
//
// So the retired cells are NAMED here, and `guardian-flight.test.ts` drives the
// real FSM across every tier and every knot, collects every state it can
// actually reach, and fails if any of them lands in this set. The list cannot
// rot, because the machine itself supplies the states.
export const GUARDIAN_GROUNDED_CELLS: ReadonlySet<string> = new Set(["sad", "dazed", "stagger", "telegraph"]);

/** The landed cells of the FLIGHT sheet (`rest0`/`rest1` in the AM contract).
 *  Grounded is CORRECT here and only here: she is beaten and has come down. */
export const GUARDIAN_LANDED_CELLS: ReadonlySet<string> = new Set(["rest", "win"]);

/** Her banked pairs, left and right. These cells carry their OWN direction, so
 *  the renderer must not also mirror them — see `CELL_IS_DIRECTIONAL`. (`roll`
 *  is the sheet's `bank_l0`; stage G mapped it to the name the turn state was
 *  already resolving to.) */
const BANK_L = ["roll", "bank_l1"] as const;
const BANK_R = ["bank_r0", "bank_r1"] as const;
/** The barrel-roll cells she wears through a turn. */
const SPIRAL_CELLS = ["spiral0", "spiral1", "spiral2", "spiral3"] as const;
/** The sinking wobble: the two `land` cells, alternating. */
const LAND_CELLS = ["land0", "land1"] as const;

/** Cells whose art already faces a direction. `PaintScene` suppresses `flipX`
 *  for these — mirroring a right-bank cell would draw a left bank while the
 *  guardian flies right, which is the same „picture disagrees with the world"
 *  class the facing law (R3-4) was written for. */
export const CELL_IS_DIRECTIONAL = (cell: string): boolean =>
  (BANK_L as readonly string[]).includes(cell) || (BANK_R as readonly string[]).includes(cell);

/** How fast she has to be travelling sideways before a bank reads as a bank,
 *  in subs/tick. TASTE, but bounded: below it she is nearly hovering, and a
 *  banked board that is not going anywhere reads as a glitch. */
export const FLIGHT_BANK_VX = Math.round(0.35 * SUBS);

/**
 * Which cell the flying Tafel wears this tick, from her own per-tick travel.
 * Pure, and derived from VELOCITY rather than from the path's name — so the
 * rule generalises to every path she will ever fly and the picture can never
 * disagree with the motion:
 *
 *   · climbing or diving faster than she is crossing → she is rolling through a
 *     turn: the `spiral` cells (the extremes of the spiral, the crossings of the
 *     figure-eight, the corners of a zigzag).
 *   · crossing at speed → the banked pair for the way she is going.
 *   · neither → she hovers (`_a.._d`).
 */
export const guardianFlightCell = (vx: number, vy: number, flightTick: number): string => {
  if (Math.abs(vy) > Math.abs(vx)) return SPIRAL_CELLS[bobFrame(flightTick, 4)] ?? "spiral0";
  if (Math.abs(vx) >= FLIGHT_BANK_VX) {
    const pair = vx > 0 ? BANK_R : BANK_L;
    return pair[bobFrame(flightTick, 2)] ?? pair[0];
  }
  return IDLE_CELLS[bobFrame(flightTick, 4)] ?? "a";
};

/** THE TELL, in three cells (doc 44 §4 ch01 C4: „she dips and rears"). The dwell
 *  is fixed rather than a fraction of the telegraph, so the REAR (`_windup`, the
 *  tallest cell on the sheet) is what holds right up to the release however long
 *  the tier and the knot make the tell — the last thing the child sees before
 *  the chalk leaves is always the same picture. TELEGRAPH_FLOOR_TICKS (30)
 *  guarantees all three get their turn. */
export const WINDUP_DWELL_TICKS = 10;
const windupCell = (timer: number): string =>
  timer < WINDUP_DWELL_TICKS ? "windup0" : timer < WINDUP_DWELL_TICKS * 2 ? "windup1" : "windup";

export interface EntPoseInput {
  role: string;
  state: string;
  timer: number;
  redeemed: boolean;
  vx: number;
  vy: number;
  x: number;
  homeX: number;
  /** PK-R6 · E · guardians only: ticks on the path, for the flight cell cycles.
   *  Defaulted so every existing caller (and every non-guardian) is unchanged. */
  flightTick?: number;
  /** How many painted idle cells this SKIN has on disk (doc 40 §4). The scene
   *  counts them; the hook stays pure. Defaults to the shipped 2, so a skin
   *  that never gains `_c/_d` keeps exactly today's cadence. */
  idleFrames?: number;
}

// ── PK-R6 · D · THE CLASSMATE'S CELLS (doc 44 §3.3, doc 40 §3 rig grammar) ───
// Her sheet is PAIRED all the way through — `caged0/1`, `settle0/1`, `wave0/1`,
// one pair per wrong action (`act_sing0/1` …) — except the joy cells, which the
// AL2 contract names `_joy` and `_joy1`. So the pair is looked up by NAME here
// rather than assembled from `${state}${n}`: a generic suffix would ask for
// `joy0`, entTex would fall back to `merle_a`, and the Freudenrunde would play
// as a girl standing still. One table, no arithmetic on cell names.
const CLASSMATE_CELLS: Record<string, readonly [string, string]> = {
  caged: ["caged0", "caged1"],
  settle: ["settle0", "settle1"],
  joy: ["joy", "joy1"],
  wave: ["wave0", "wave1"],
};

/** The pose a card's art binding names, as a STATE — `merle_act_sing1` +
 *  skin `merle` → `act_sing`. This is the whole reason the world and the card
 *  cannot disagree about what she is doing: the round declares its pose ONCE,
 *  in `stimulus.art` (which the portrait law already proves is a real cell of
 *  hers), and the world reads its state off that same string. Returns null for
 *  a stem that is not this being's, so a mis-bound card changes nothing rather
 *  than posing her as somebody else. */
export const poseStateOf = (stem: string, skin: string): string | null => {
  if (!stem.startsWith(`${skin}_`)) return null;
  const cell = stem.slice(skin.length + 1).replace(/\d+$/, "");
  return cell.length > 0 ? cell : null;
};

/** Which cell a classmate shows, given her state and her own tick. A state that
 *  begins `act_` is a WRONG-ACTION POSE the shell set from the open round's art
 *  binding (`merle_act_sing1` → `act_sing`), so its pair is `<state>0/1`. */
export const classmateCell = (state: string, timer: number): string => {
  const named = CLASSMATE_CELLS[state];
  if (named) return named[bobFrame(timer, 2)] ?? named[0];
  if (state.startsWith("act_")) return `${state}${bobFrame(timer, 2)}`;
  return IDLE_CELLS[bobFrame(timer, 4)] ?? "a"; // `rest` and anything unnamed: she idles
};

export const entPoseCell = (e: EntPoseInput): string => {
  // PK-R6 · D: read FIRST, like the guardian's branch and for the same reason —
  // every generic rule below (the `dazed` catch-all, the run threshold) would
  // put a cell on her that her sheet does not have, and entTex would silently
  // fall back to her idle. A person acting out a wrong action is not a dazed
  // enemy, and a freed friend waving is not a dazed one either.
  if (e.role === "classmate") return classmateCell(e.state, e.timer);
  // PK-R6 · D · AN OPENED CAGE IS DRAWN OPEN. Read before the dazed catch-all,
  // which is what a redeemed cage used to fall into: `pencilcase_dazed` does not
  // exist, entTex dropped to `pencilcase_a` — and `_a` is the CLOSED case with
  // the captive still behind its bars. Nobody noticed while the person in the
  // art was the only person there was; the moment Merle steps out of it (§3.3)
  // the frame shows her twice, once free and once still locked up. `_burst` is
  // painted (an open, empty case, the zip flying off) and is what an opened cage
  // has always meant.
  if (e.role === "cage") {
    if (e.state === "burst" || e.redeemed) return "burst";
    if (e.state === "shaking") return "shake";
  }
  // ── PK-R6 · E · THE FLYING GUARDIAN'S CELLS (doc 44 §4 ch01 C4) ────────────
  // Read before every generic rule below, and answering ONLY out of the flight
  // sheet until she is beaten. The two terminal cells (`rest`, `win`) are the
  // flight sheet's own landed pair — she has come down, which is the one moment
  // grounded is right. Nothing here can reach `sad`/`dazed`/`stagger`/
  // `telegraph`: those are the retired easel (GUARDIAN_GROUNDED_CELLS).
  if (e.role === "guardian") {
    // the console beat's payoff — the blackboard as a friend. Read first: it is
    // TERMINAL (guardianKnotSolved never sets `redeemed`), so the dazed
    // catch-all below would otherwise eat it.
    if (e.state === "consoled") return "win";
    // R3-5 kept, doc 44 §2.2 re-aimed: the beaten board reacts before the
    // victory cell — she RESTS, exhausted, on the boards she just fell onto.
    if (e.state === "sad") return "rest";
    // she is still coming down: the sinking wobble
    if (e.state === "sink" || e.state === "dip") return LAND_CELLS[bobFrame(e.timer, 2)] ?? "land0";
    // PB-F1/F2-25: `window` IS the counter-task moment — the card asks the child
    // to LOOK at her, so she may not swap to a different drawing of herself
    // while it is up, and she may not keep wobbling either: the four chalked
    // words have to sit still to be read. She holds the settled land cell.
    if (e.state === "window") return "land1";
    // the fist path (chapters that grant one) reels her in the air
    if (e.state === "stagger") return LAND_CELLS[bobFrame(e.timer, 2)] ?? "land0";
    if (e.state === "telegraph") return windupCell(e.timer);
    if (e.state === "throw") return "throw";
    if (e.state === "fly") return guardianFlightCell(e.vx, e.vy, e.flightTick ?? e.timer);
    // R3-4's turn state, kept for any chapter whose guardian still walks
    if (e.state === "turn" || e.state === "roll") return "roll";
    // the catch-alls, pointed at the flight sheet rather than the easel
    if (e.redeemed || e.state === "dazed") return "land1";
    return IDLE_CELLS[bobFrame(e.timer, 4)] ?? "a"; // she hovers
  }
  // R3-5 · THE REDEEMED-PRESENCE PAIR (doc 40 §3). Read BEFORE the dazed
  // catch-all: a freed friend is not a dazed enemy, and `moths_rest` — painted,
  // shown by nothing (doc 38 §2) — is exactly the settled cell this asks for.
  if (e.state === "joy") return "joy";
  if (e.state === "rest") return "rest";
  if (e.redeemed || e.state === "dazed" || e.state === "consoled" || e.state === "shooed") return "dazed";
  // doc 40 §2 · the turn state, for every role that patrols
  if (e.state === "turn") return "turn";
  if (e.state === "telegraph") return "telegraph";
  // a crusher's `act` IS its slam — the stomp cell is that moment
  if (e.state === "act") return e.role === "crusher" ? "stomp" : "act";
  if (e.state === "burst") return "burst";
  if (e.state === "shaking") return "shake";
  if (e.role === "bouncer" && Math.abs(e.vy) >= SQUASH_VY) return "squash";
  if (e.role === "flyer" && Math.abs(e.x - e.homeX) >= BANK_X) return "bank";
  // platforms carry a per-tick ride delta in vx that is not a gait
  if (!e.role.startsWith("platform") && Math.abs(e.vx) >= RUN_VX) return "run";
  const frames = Math.min(Math.max(e.idleFrames ?? 2, 1), IDLE_CELLS.length);
  return IDLE_CELLS[bobFrame(e.timer, frames)] ?? "a";
};
