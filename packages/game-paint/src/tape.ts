// THE PAINTED BOOK — proof tapes (PB-T2): a recorded pad stream that the REAL
// engine (sim.ts) replays to its exit. THE LAW: no non-draft level ships
// without a green tape per phase — completability is proven by execution,
// never by the reachability model (level.ts is only the fast authoring guard).
//
// Format (paintProof@1, sidecar chNN.proof.json next to chNN.level.json):
//   { schema, level, phases: { <phaseId>: { abilities, pads } } }
// `pads` is run-length encoded: [tickCount, padMask][] — the tape stays
// readable in review (a few dozen runs per phase, not thousands of ticks).
// `abilities` = what the player has ENTERING the phase (the Fibel grant lands
// mid-p2; the replay shell accumulates grants exactly like PaintGame does).

import { IDLE_PAD, type Pad } from "./player.ts";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import type { Ability, PaintLevel } from "./level.ts";

export const PROOF_SCHEMA = "paintProof@1";

export interface PhaseTape {
  abilities: Ability[];
  /** run-length encoded pad stream: [ticks, mask] */
  pads: Array<[number, number]>;
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
}

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
): ReplayResult => {
  const abilities: string[] = [...tape.abilities];
  const freed: string[] = [...freedCages];
  const sim = new Sim({
    level,
    phaseId,
    grantedAbilities: () => abilities,
    freedCageIds: () => freed,
  });
  let exited = false;
  let exitTo: string | null = null;
  let tasksSolved = 0;
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
  return { exited, exitTo, ticksUsed: t, tasksSolved, grantsPicked };
};

/** Convenience: the TaskRequest type re-export the pilots use. */
export type { TaskRequest };
