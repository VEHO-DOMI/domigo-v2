// THE PAINTED BOOK — proof tapes (PB-T2): a recorded pad stream that the REAL
// engine (sim.ts) replays to its exit. THE LAW: no non-draft level ships
// without a green tape per phase — completability is proven by execution,
// never by the reachability model (level.ts is only the fast authoring guard).
//
// Format (paintProof@1, sidecar chNN.proof.json next to chNN.level.json):
//   { schema, level, phases: { <phaseId>: { abilities, pads, expect? } } }
//
// PB-F2 · WORLD ASSERTIONS. A tape used to prove only that the recorded BUTTONS
// still reach an exit — it could not see the world. The arena tape came back
// byte-identical after the guardian gained motion, proving nothing about the
// guardian (banked in doc 35, REVIEW 3). `expect` closes that hole: the
// end-state the run must land in — letters collected, where the exit led, cages
// freed, and for the arena whether the guardian actually went down.
// `pads` is run-length encoded: [tickCount, padMask][] — the tape stays
// readable in review (a few dozen runs per phase, not thousands of ticks).
// `abilities` = what the player has ENTERING the phase (the Fibel grant lands
// mid-p2; the replay shell accumulates grants exactly like PaintGame does).

import { IDLE_PAD, type Pad, posePairErrors } from "./player.ts";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import { DIP_Y_PX, KNOT_PERIOD_TICKS } from "./entities.ts";
import { SUBS } from "./paint.ts";
import type { Ability, PaintLevel } from "./level.ts";

export const PROOF_SCHEMA = "paintProof@1";

/** What the world must look like when the tape runs out (PB-F2). Every field
 *  is optional so an old tape stays valid — but a recorded tape writes them
 *  all, and the suite fails on any mismatch. */
export interface TapeExpect {
  lettersGot?: number;
  lettersTotal?: number;
  exitTo?: string;
  cagesFreed?: number;
  guardianDown?: boolean;
  tasksSolved?: number;
  /** PK-R2 · R3-5: did a redeemed being finish the run STILL PRESENT, in the
   *  joy/rest pair? Before this packet a freed friend was parked in a terminal
   *  `dazed` and forgotten, which is what made Koki's moth and book read as
   *  "nothing happened". A tape that ends with no present friend has lost the
   *  kindness economy, and that is now a failure the suite can see. */
  redeemedPresent?: boolean;
  /** PK-R6 · D · THE REAWAKENING'S END-STATE (doc 44 §3.3). How many classmates
   *  this run left AWAKE — redeemed, and standing in one of her own painted
   *  after-states (settle → joy → her spot, waving). It is deliberately not
   *  covered by `redeemedPresent`, which is an OR over every being in the phase
   *  and goes green on a freed moth while the chapter's one person sits grey in
   *  a cage the pilot walked past. That is exactly what every ch01 tape did
   *  until this packet: `cagesFreed: 0` on all five, and the one rescue in the
   *  chapter proven by nothing. Six rounds have to be RUN for this to be 1. */
  classmatesAwake?: number;
  /** PK-R3b · R3-16: Regel-Seiten and Bonus-Bücher this run walked into. A
   *  collectible the pilot never touches is not proof it is takeable — and a
   *  page that stops being takeable after a grid edit is exactly the silent
   *  regression the letter counts already guard against. */
  tipsGot?: number;
  booksGot?: number;
  /** PK-R3b · M-B: did this run end the CHAPTER — i.e. did the shell's
   *  chapter-end sequence (score page → door out) actually fire? The sequence
   *  lives in React, but its trigger is a sim event, and this is that trigger
   *  modelled exactly as PaintGame models it: an exit whose destination is
   *  „done". A phase that stops resolving to the end of the chapter now fails
   *  here rather than in a playtest. */
  scorePageShown?: boolean;
  // ── PK-R6 · E · THE FLIGHT FIGHT (doc 44 §4 ch01 C4) ──────────────────────
  // `guardianDown` alone said only „the knots were untied" — it went green on
  // the grounded duel and would go green on a boss who never moved. The rebuild
  // is a CHOREOGRAPHY, so the tape pins the choreography: that she flew a whole
  // readable shape, that every throw was announced, that the counter-window
  // opened, that she came DOWN to write her lie where the child could read it,
  // and that the consolation actually played.
  /** Full passes of a knot's path she completed (KNOT_PERIOD_TICKS each). */
  guardianPathsFlown?: number;
  /** Throws that left her hand — each one preceded by its telegraph, which
   *  `guardian-flight.test.ts` pins at ≥500 ms on every tier and knot. */
  guardianTelegraphs?: number;
  /** Counter-windows opened (the boss card's own beat). */
  guardianWindows?: number;
  /** Did she DIP to the writing altitude for a window — i.e. was the
   *  boss-evidence beat staged where a child can read four chalked words?
   *  This is the world half of doc 41 §4; the words themselves are rendered by
   *  PaintScene.writeEvidence off the card's own `evidence` field. */
  guardianWroteLow?: boolean;
  /** Did the consolation reach its end — she sank, rested, and was consoled? */
  guardianConsoled?: boolean;
}

export interface PhaseTape {
  abilities: Ability[];
  /** run-length encoded pad stream: [ticks, mask] */
  pads: Array<[number, number]>;
  /** the world state this run must end in — see TapeExpect */
  expect?: TapeExpect;
}

export interface ProofFile {
  schema: typeof PROOF_SCHEMA;
  level: string;
  phases: Record<string, PhaseTape>;
}

const BITS: Array<[keyof Pad, number]> = [
  ["left", 1],
  ["right", 2],
  ["up", 4],
  ["down", 8],
  ["jump", 16],
  ["punch", 32],
];

export const padToMask = (p: Pad): number => {
  let m = 0;
  for (const [k, bit] of BITS) if (p[k]) m |= bit;
  return m;
};

export const maskToPad = (m: number): Pad => {
  const p: Pad = { ...IDLE_PAD };
  for (const [k, bit] of BITS) p[k] = (m & bit) !== 0;
  return p;
};

export const encodePads = (masks: readonly number[]): Array<[number, number]> => {
  const runs: Array<[number, number]> = [];
  for (const m of masks) {
    const last = runs[runs.length - 1];
    if (last && last[1] === m) last[0]++;
    else runs.push([1, m]);
  }
  return runs;
};

export const decodePads = (runs: ReadonlyArray<readonly [number, number]>): number[] => {
  const out: number[] = [];
  for (const [n, m] of runs) for (let i = 0; i < n; i++) out.push(m);
  return out;
};

export interface ReplayResult {
  exited: boolean;
  exitTo: string | null;
  ticksUsed: number;
  tasksSolved: number;
  grantsPicked: string[];
  /** PB-F2: what the WORLD looked like at the end, for the assertions */
  world: Required<Omit<TapeExpect, "exitTo">> & { exitTo: string | null };
  /**
   * R5-W1 · F1 · every tick of this run where the drawn pose contradicted the
   * physical state (player.ts `posePairErrors`). Collected, never thrown: the
   * recorder shares this path and must be able to finish and REPORT, and a
   * count is worth more than the first offender. Capped so a systematic break
   * cannot turn one failure message into a wall of text.
   */
  poseViolations: { tick: number; errors: string[] }[];
}

/** How many offending ticks a replay keeps before it stops collecting. */
export const POSE_VIOLATION_CAP = 20;

// PB-R1 · R3-1 · THE CHAPTER SHELL. Some cards are once per CHAPTER, not once
// per phase — PaintGame keeps that state in refs that outlive a phase mount.
// A replay shell that forgets it cannot see a chapter-scoped bug, and for the
// ch01 freeze it did not: every phase tape replayed with a FRESH shell, so the
// second cage hint — the one PaintGame silently declines — never happened in
// CI. This object is that memory, threaded through a whole chapter's tapes.
export interface ChapterShellState {
  /** PaintGame.cageHintShownRef: the fist hint teaches once, then never again. */
  cageHintShown: boolean;
  /** PK-R3b · R3-16 — PaintGame's tipsTakenRef/booksTakenRef: a Regel-Seite
   *  taken before the Kleckskammer is still taken when the phase remounts. */
  pickedUp: string[];
}

export const newChapterShell = (): ChapterShellState => ({ cageHintShown: false, pickedUp: [] });

/**
 * Replay a phase tape through the REAL Sim — the same shell contract
 * PaintGame implements: tasks auto-solve the moment they open (the tape
 * proves MOVEMENT completability; task answerability is proven separately by
 * the blind-solve gates), grants accumulate, the first exit event ends it.
 */
export const replayPhaseTape = (
  level: PaintLevel,
  phaseId: string,
  tape: PhaseTape,
  freedCages: readonly string[] = [],
  shell: ChapterShellState = newChapterShell(),
): ReplayResult => {
  const abilities: string[] = [...tape.abilities];
  const freed: string[] = [...freedCages];
  const sim = new Sim({
    level,
    phaseId,
    grantedAbilities: () => abilities,
    freedCageIds: () => freed,
    cageHintShown: () => shell.cageHintShown,
    collectedPickupIds: () => shell.pickedUp,
  });
  let exited = false;
  let exitTo: string | null = null;
  let tasksSolved = 0;
  // PK-R6 · E · the flight fight's own tally (declared here because `handle`
  // below writes to it — the counter-window is an EVENT, not a sampled state)
  let telegraphs = 0;
  let windows = 0;
  let wroteLow = false;
  let consoled = false;
  let pathTicks = 0;
  let prevState = "";
  let tipsGot = 0;
  let booksGot = 0;
  const grantsPicked: string[] = [];

  const handle = (evs: SimEvent[]): void => {
    for (const ev of evs) {
      if (ev.type === "task") {
        tasksSolved++;
        // PK-R6 · E · THE COUNTER-WINDOW, caught where it actually happens. It
        // is opened and (in a replay) answered inside ONE sim step, so a sampler
        // that looks at the world after the step never sees the `window` state
        // at all — it counted zero windows on a run that untied every knot.
        // The card request IS the window: `boss` use, `guardian` ctx.
        if (ev.req.use === "boss" && ev.req.ctx.type === "guardian") {
          windows++;
          const askerId = ev.req.ctx.id;
          const g = sim.world.entities.find((e) => e.id === askerId);
          // she must have come DOWN to write, or the four chalked words are
          // rendered somewhere a child cannot read them (doc 41 §4)
          if (g && g.y / SUBS >= DIP_Y_PX - 8) wroteLow = true;
        }
        handle(sim.solveTask(ev.req.ctx)); // may emit cageFreed/guardianDown
      } else if (ev.type === "powerup") {
        if (!abilities.includes(ev.grants)) abilities.push(ev.grants);
        grantsPicked.push(ev.grants);
        sim.setOverlay(false); // the grant card dismissed
      } else if (ev.type === "cageFreed") {
        freed.push(ev.id);
        sim.setOverlay(false); // the ceremony card dismissed
      } else if (ev.type === "guardianDown") {
        sim.setOverlay(false); // the console card closes scene-side
      } else if (ev.type === "cageHint") {
        // PB-F3: the one-time cage hint. PB-R1 · R3-1: „one-time" means once per
        // CHAPTER — on every later hint PaintGame returns without opening a card,
        // and therefore without dismissing one. Model that return EXACTLY: a
        // shell that always dismisses cannot see the freeze it caused.
        if (!shell.cageHintShown) {
          shell.cageHintShown = true;
          sim.setOverlay(false); // the hint card shown, then dismissed
        }
      } else if (ev.type === "tip") {
        // PK-R3b · R3-16: a rule page FREEZES the world (it is there to be read),
        // so the shell owes it a dismissal — exactly like the grant card. Without
        // this branch a pilot who walks over a Regel-Seite stops for good, and
        // every tape in the chapter would fail on a card nobody can see.
        tipsGot++;
        if (!shell.pickedUp.includes(ev.id)) shell.pickedUp.push(ev.id);
        sim.setOverlay(false);
      } else if (ev.type === "book") {
        booksGot++;
        if (!shell.pickedUp.includes(ev.id)) shell.pickedUp.push(ev.id);
      } else if (ev.type === "exit" && !exited) {
        exited = true;
        exitTo = ev.to;
      }
    }
  };

  // PK-R6 · E: the two beats that ARE states rather than announcements — how
  // much path she flew, and whether the consolation actually finished.
  const watchGuardian = (): void => {
    const g = sim.world.entities.find((e) => e.role === "guardian");
    if (!g) return;
    if (g.state !== prevState) {
      if (g.state === "throw") telegraphs++; // only a finished telegraph throws
      if (g.state === "consoled") consoled = true;
      prevState = g.state;
    }
    pathTicks = Math.max(pathTicks, g.flightTick);
  };

  const masks = decodePads(tape.pads);
  const poseViolations: { tick: number; errors: string[] }[] = [];
  let t = 0;
  for (; t < masks.length && !exited; t++) {
    handle(sim.step(maskToPad(masks[t] ?? 0)));
    watchGuardian();
    // R5-W1 · F1: the pose-honesty law swept over every shipped tick. A tape is
    // the only place we own a long, real, deterministic run of the actual game,
    // so it is the cheapest place to prove the drawing never lies.
    if (poseViolations.length < POSE_VIOLATION_CAP) {
      const errs = posePairErrors(sim.player);
      if (errs.length > 0) poseViolations.push({ tick: t, errors: errs });
    }
  }
  const world = {
    lettersGot: sim.lettersGot,
    lettersTotal: sim.lettersTotal,
    exitTo,
    cagesFreed: freed.length - freedCages.length,
    guardianDown: sim.guardianDefeated,
    tasksSolved,
    redeemedPresent: sim.world.entities.some((e) => e.redeemed && (e.state === "joy" || e.state === "rest")),
    // PK-R6 · D: her own after-states — the settle, the Freudenrunde and the
    // waving that follows it (entities.stepRedeemed). A classmate in any OTHER
    // state at the end of a run is one the sequence did not finish.
    classmatesAwake: sim.world.entities.filter(
      (e) => e.role === "classmate" && e.redeemed && ["settle", "joy", "rest", "wave"].includes(e.state),
    ).length,
    tipsGot,
    booksGot,
    // M-B: PaintGame opens the score page on exactly this condition — an exit
    // whose destination is the end of the chapter (PaintGame.handoff).
    scorePageShown: exitTo === "done",
    // PK-R6 · E · the flight fight's choreography, as countable world facts
    guardianPathsFlown: Math.floor(pathTicks / KNOT_PERIOD_TICKS[0]),
    guardianTelegraphs: telegraphs,
    guardianWindows: windows,
    guardianWroteLow: wroteLow,
    guardianConsoled: consoled,
  };
  return { exited, exitTo, ticksUsed: t, tasksSolved, grantsPicked, world, poseViolations };
};

/**
 * PB-R1 · R3-1 · THE CHAPTER REPLAY: every phase tape of one chapter, in order,
 * through ONE shell. Per-phase replays each start with a blank shell and so can
 * only ever prove a phase playable IN ISOLATION; a child plays the chapter, and
 * the once-per-chapter cards are exactly where the two diverge. This is the
 * guard that turns a chapter-scoped shell bug red.
 */
export const replayChapterTapes = (
  level: PaintLevel,
  phases: Record<string, PhaseTape>,
  order: readonly string[],
): Array<{ phaseId: string; result: ReplayResult }> => {
  const shell = newChapterShell();
  const out: Array<{ phaseId: string; result: ReplayResult }> = [];
  for (const phaseId of order) {
    const tape = phases[phaseId];
    if (!tape) continue;
    out.push({ phaseId, result: replayPhaseTape(level, phaseId, tape, [], shell) });
  }
  return out;
};

/** The world assertions, as human-readable mismatches (empty = the run ended
 *  where the tape says it must). Used by the proof-tape suite and the
 *  recorder, so the two can never drift. */
export const worldAssertionErrors = (expect: TapeExpect | undefined, world: ReplayResult["world"]): string[] => {
  if (!expect) return [];
  const errs: string[] = [];
  const cmp = (key: keyof TapeExpect, got: unknown): void => {
    const want = expect[key];
    if (want !== undefined && want !== got) errs.push(`${key}: tape says ${String(want)}, the run produced ${String(got)}`);
  };
  cmp("lettersGot", world.lettersGot);
  cmp("lettersTotal", world.lettersTotal);
  cmp("exitTo", world.exitTo);
  cmp("cagesFreed", world.cagesFreed);
  cmp("guardianDown", world.guardianDown);
  cmp("tasksSolved", world.tasksSolved);
  cmp("redeemedPresent", world.redeemedPresent);
  cmp("classmatesAwake", world.classmatesAwake);
  cmp("tipsGot", world.tipsGot);
  cmp("booksGot", world.booksGot);
  cmp("scorePageShown", world.scorePageShown);
  cmp("guardianPathsFlown", world.guardianPathsFlown);
  cmp("guardianTelegraphs", world.guardianTelegraphs);
  cmp("guardianWindows", world.guardianWindows);
  cmp("guardianWroteLow", world.guardianWroteLow);
  cmp("guardianConsoled", world.guardianConsoled);
  return errs;
};

/** Convenience: the TaskRequest type re-export the pilots use. */
export type { TaskRequest };
