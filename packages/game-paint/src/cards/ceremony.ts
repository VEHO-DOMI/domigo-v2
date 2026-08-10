// PK-R6 · H1 · THE CHAPTER'S PAYOFF, AS MATH (round-1 critique, ceremonies
// finding 4: „the score page is the clearest juice failure — a chapter-
// completion moment rendered as a static ‚0 von X' checklist with no count-up,
// no particles, no character reaction; the emotional payoff Rayman-tier games
// always sell with a fanfare beat is simply absent").
//
// He is describing the last thing a child sees in the chapter. Everything the
// beat needs is here as PURE FUNCTIONS, for the reason every other number in
// this game is: a celebration assembled inline in a render is a celebration
// nobody can test, and this one has to be provably honest — the numbers it
// counts up to are the run's real numbers, and the size of the flourish is the
// run's real completion, so the page can neither undersell a perfect chapter
// nor throw confetti at a child who freed nobody.
//
// DETERMINISTIC BY CONSTRUCTION: no Math.random anywhere (the sim law, applied
// to the ceremony), so a replayed tape celebrates exactly what the child saw.
import { rigPose } from "../rig.ts";
import {
  RIG_CELL, RIG_SRC_SCALE, RIG_PART_ORDER, type RigPartName,
  bodyStemFor, faceFor, hairStemFor, handStemsFor, shoeStemFor,
} from "../rigSpec.ts";
import type { PlayerPose } from "../player.ts";

// ── 1 · THE COUNT-UP ─────────────────────────────────────────────────────────

/** How long one line takes to count itself up. Short: five lines that each
 *  take a second would turn the payoff into a wait. */
export const COUNT_UP_MS = 560;
/** …and how far apart the lines start, so the page fills top to bottom like a
 *  hand writing it rather than five counters racing each other. */
export const COUNT_UP_STAGGER_MS = 150;
/** The whole beat, from the card landing to the last line resting. Callers use
 *  it to know when the celebration is over; `rows` is how many lines there are. */
export const countUpTotalMs = (rows: number): number =>
  Math.max(rows, 0) * COUNT_UP_STAGGER_MS + COUNT_UP_MS;

/** Ease-out cubic — fast first, resting at the end, the way a tally lands. */
const easeOut = (t: number): number => 1 - (1 - t) ** 3;

/**
 * What line `row` reads at `elapsedMs` after the card landed.
 *
 * THE HONESTY CLAUSE: it starts at 0, it is monotone, and it ends EXACTLY at
 * the target — never above it, not even for one frame. A score line that
 * overshoots and settles back would tell a child they had 33 of 32 letters,
 * which is the same class of lie the letter-honesty law exists to stop.
 */
export const countUpAt = (target: number, elapsedMs: number, row = 0): number => {
  if (target <= 0) return 0;
  const t = (elapsedMs - row * COUNT_UP_STAGGER_MS) / COUNT_UP_MS;
  if (t <= 0) return 0;
  if (t >= 1) return target;
  return Math.min(target, Math.round(target * easeOut(t)));
};

// ── 2 · THE FLOURISH ─────────────────────────────────────────────────────────

/** One thrown mote of the score page's burst (rendered by the `pb-spark` rule,
 *  which already exists for the card's own celebration and is already in the
 *  reduced-motion kill list — so this beat needs no new animation to kill). */
export interface Mote {
  dx: number;
  dy: number;
  size: number;
  delayMs: number;
  /** chalk-white, else amber — the book's own two-colour dust */
  chalk: boolean;
}

/** How complete the run was, 0…1, over the lines the chapter actually has.
 *  A line with no total (a chapter with no Regel-Seiten) is not counted — it
 *  would otherwise drag every chapter's celebration down for a thing it never
 *  hid. */
export const runCompletion = (rows: ReadonlyArray<{ got: number; total: number }>): number => {
  const real = rows.filter((r) => r.total > 0);
  if (real.length === 0) return 1;
  const sum = real.reduce((n, r) => n + Math.min(Math.max(r.got, 0) / r.total, 1), 0);
  return Math.min(Math.max(sum / real.length, 0), 1);
};

/** The smallest flourish the page ever throws, and the biggest.
 *  WHY A FLOOR: reaching the door out IS the chapter — a child who freed nobody
 *  still finished the book's page, and a completion beat with nothing in it is
 *  what the critic caught us shipping. WHY A CEILING that only a full run
 *  reaches: confetti for a 0/32 run reads as mockery, and this book does not
 *  mock a six-year-old. */
export const BURST_MIN = 7;
export const BURST_MAX = 22;

/**
 * The burst, thrown along a ring the INDEX alone decides — same completion,
 * same celebration, every single time (the deterministic-sim law, applied to
 * the payoff so a replayed tape shows the child's own party).
 */
export const burstMotes = (completion: number): Mote[] => {
  const c = Math.min(Math.max(completion, 0), 1);
  const n = BURST_MIN + Math.round((BURST_MAX - BURST_MIN) * c);
  return Array.from({ length: n }, (_, i) => {
    // the ring is walked in a wide, non-repeating stride so successive motes
    // never sit next to each other — a plain i/n ring reads as a clock face
    const ang = ((i * 2.39996) % (Math.PI * 2)) + (i % 3) * 0.11;
    const dist = 64 + (i % 5) * 17;
    return {
      dx: Math.round(Math.cos(ang) * dist),
      dy: Math.round(Math.sin(ang) * dist * 0.82) - 10, // thrown a little upward
      size: 4 + (i % 4) * 1.6,
      delayMs: 40 + (i % 7) * 34,
      chalk: i % 2 === 0,
    };
  });
};

// ── 3 · THE CHILD, MID-CHEER ─────────────────────────────────────────────────

/** One painted part of the hero, ready to be positioned in the DOM. */
export interface HeroPart {
  part: RigPartName;
  /** the art stem this part wears (resolved against the level's art map) */
  stem: string;
  /** px from the figure's centre — the same registration the scene uses */
  x: number;
  y: number;
  /** radians */
  rot: number;
  /** rendered px (parts register by CELL CENTRE, so every part is square) */
  size: number;
  /** the far hand is mirrored, exactly as the scene mirrors it */
  flip: boolean;
  /** …and sits a step darker, which is what welds it to the body's light */
  dim: boolean;
}

/** The hero is ~35 logical px tall in the world (rigSpec's RIG_SRC_SCALE). */
const HERO_LOGICAL_H = 35;

/**
 * THE CHEERING CHILD (finding 4's „stage the character sprite mid-cheer/jump as
 * the visual focal point", and finding 6's „consistently tiny and pushed to a
 * frame corner").
 *
 * He is not re-drawn for the ceremony and he is not a second sprite: this is the
 * SHIPPED rig — the same `rigPose` the scene renders every frame, in the leap
 * pose whose own dossier note is „both hands rise above shoulder line, open,
 * fingers spread wide — the silhouette FLARES" — wearing the `head_celebrate`
 * face that has been on disk since the rig landed and had never once been shown.
 * Posed at `reducedMotion`, because a ceremony figure must be a finished
 * picture, not one frame of an oscillation (the end-states law).
 *
 * Returns parts in draw order back-to-front. A stem the level has no art for
 * simply resolves to nothing at the call site and the figure is not drawn at
 * all — the keen-art law, unchanged.
 */
export const heroParts = (heightPx: number, pose: PlayerPose = "jump"): HeroPart[] => {
  const k = heightPx / HERO_LOGICAL_H;
  const p = rigPose({
    pose, walkTime: 0, tick: 0, vxSubs: 0, vySubs: 0, charge: -1,
    landedAgo: 999, reducedMotion: true,
  });
  const stems: Record<RigPartName, string> = {
    body: bodyStemFor(pose),
    head: faceFor(pose, 0, true), // celebrating: head_celebrate
    hair: hairStemFor(pose, 0),
    handF: handStemsFor(pose).front,
    handB: handStemsFor(pose).back,
    footF: shoeStemFor(pose),
    footB: shoeStemFor(pose),
    rotor: "rotor_a",
  };
  const at: Record<RigPartName, { dx: number; dy: number; rot: number; hidden?: boolean }> = {
    body: p.body, head: p.head, hair: p.hair, handF: p.handF, handB: p.handB,
    footF: p.footF, footB: p.footB, rotor: p.rotor,
  };
  const out: HeroPart[] = [];
  for (const part of RIG_PART_ORDER) {
    const a = at[part];
    if (a.hidden === true) continue; // the quill only exists while hovering
    // the scene's own rule: hands are ~half a head, so they draw at 0.62×
    const size = RIG_CELL * RIG_SRC_SCALE * k * (part.startsWith("hand") ? 0.62 : 1);
    out.push({
      part, stem: stems[part],
      x: a.dx * k, y: a.dy * k, rot: a.rot,
      size, flip: part === "handB", dim: part === "handB",
    });
  }
  return out;
};

/** Has this level's hero art landed? (The two parts a figure cannot be drawn
 *  without — everything else degrades gracefully, a missing torso does not.)
 *  Asked BEFORE the ceremony lays out its stage, so a chapter with no hero
 *  batch yet gets a tighter card instead of a hole where a child should be. */
export const heroArtPresent = (art: Record<string, string>, pose: PlayerPose = "jump"): boolean => {
  const need = heroParts(1, pose).filter((p) => p.part === "body" || p.part === "head");
  return need.length === 2 && need.every((p) => art[p.stem] !== undefined);
};
