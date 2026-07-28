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

import { IDLE_PAD, type Pad } from "./player.ts";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
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
}

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
  let tipsGot = 0;
  let booksGot = 0;
  const grantsPicked: string[] = [];

  const handle = (evs: SimEvent[]): void => {
    for (const ev of evs) {
      if (ev.type === "task") {
        tasksSolved++;
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

  const masks = decodePads(tape.pads);
  let t = 0;
  for (; t < masks.length && !exited; t++) {
    handle(sim.step(maskToPad(masks[t] ?? 0)));
  }
  const world = {
    lettersGot: sim.lettersGot,
    lettersTotal: sim.lettersTotal,
    exitTo,
    cagesFreed: freed.length - freedCages.length,
    guardianDown: sim.guardianDefeated,
    tasksSolved,
    redeemedPresent: sim.world.entities.some((e) => e.redeemed && (e.state === "joy" || e.state === "rest")),
    tipsGot,
    booksGot,
    // M-B: PaintGame opens the score page on exactly this condition — an exit
    // whose destination is the end of the chapter (PaintGame.handoff).
    scorePageShown: exitTo === "done",
  };
  return { exited, exitTo, ticksUsed: t, tasksSolved, grantsPicked, world };
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
  cmp("tipsGot", world.tipsGot);
  cmp("booksGot", world.booksGot);
  cmp("scorePageShown", world.scorePageShown);
  return errs;
};

/** Convenience: the TaskRequest type re-export the pilots use. */
export type { TaskRequest };
