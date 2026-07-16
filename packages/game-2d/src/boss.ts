/**
 * The boss duel brain (bible 27 §3 + doc 25 §5.4, pure and unit-tested).
 *
 * Punch-Out re-keyed to language production: the guardian attacks in scripted
 * patterns with legible telegraphs; DODGE = read the tell and leave the lane;
 * every dodged attack opens a COUNTER WINDOW where a production task fires;
 * a correct answer unravels one KNOT. Hearts are the one stamina pool
 * (bible §2b): being hit costs a heart, guess-mashing outside a window costs
 * a heart, wrong-in-window only closes the window (patience, not punishment).
 * Zero knots left = the guardian dissolves and yields the fragment.
 *
 * The INVERSION mode (ch15 / care-duels): hearts cannot be lost, attacks
 * never damage — a wrong answer closes the window and the pattern repeats.
 * The duel cannot be failed, only prolonged.
 */
import type { ResolvedItem } from "@domigo/game-core";
import type { Tier } from "./arcade.ts";
import { rescuePlan, type RescueTask } from "./arcade.ts";

// ---------------------------------------------------------------------------
// The script — data per guardian identity (bible §3 table). Loaded from
// content (`keen/chNN.boss.json`); this type is its contract.
// ---------------------------------------------------------------------------
export interface BossScript {
  id: string;
  /** the guardian's display name — „Der Stundenplan-Schlinger" */
  name: string;
  /** one-line intro copy (German-first, sad-not-scary register) */
  intro: string;
  /** the win copy when the last knot unravels */
  outro: string;
  /** counter-windows to win (segments of the guardian's body) */
  knots: number;
  /** attack-lane sequence, cycled (0|1|2 of the three lanes) */
  pattern: number[];
  /** ms the tell shows before the attack, per tier (≥500 — always readable) */
  telegraphMs: Record<Tier, number>;
  /** ms the lane sweep lasts */
  attackMs: number;
  /** counter-window length in seconds, per tier (generous — production time) */
  windowSeconds: Record<Tier, number>;
  /** short between-round lines, cycled (the guardian's voice; DE) */
  taunts: string[];
  /** inversion mode (bible §2b): no heart loss, cannot be failed */
  inversion?: boolean;
}

export const LANES = 3;

// ---------------------------------------------------------------------------
// The FSM — pure stepper; the scene renders, the DOM overlay owns the task.
// ---------------------------------------------------------------------------
export type BossPhase =
  | { kind: "enter"; untilMs: number } // the guardian assembles; intro shows
  | { kind: "idle"; untilMs: number }
  | { kind: "telegraph"; lane: number; untilMs: number }
  | { kind: "attack"; lane: number; untilMs: number }
  | { kind: "window"; deadlineMs: number } // task overlay open (DOM side)
  | { kind: "knot"; untilMs: number } // a knot just unraveled — celebration
  | { kind: "beaten" };

export interface BossEvents {
  /** the attack landed — the player was in the lane (a heart, unless inversion) */
  hit: boolean;
  /** the attack was dodged — open the counter-window task overlay */
  openWindow: boolean;
  /** play the telegraph tell (sfx/flash) */
  tell: boolean;
}

const NO_EVENTS: BossEvents = { hit: false, openWindow: false, tell: false };

export const BOSS_TIMING = {
  enterMs: 1600,
  idleMs: 950,
  knotMs: 1300,
  hitRecoverMs: 1100, // extra idle after landing a hit (breathing room)
} as const;

/** One step of the duel. `attackIdx` counts attacks so far (drives the
 *  pattern); the caller increments it when a telegraph starts. */
export function stepBoss(
  phase: BossPhase,
  now: number,
  playerLane: number,
  script: BossScript,
  tier: Tier,
  attackIdx: number,
): { next: BossPhase; events: BossEvents } {
  switch (phase.kind) {
    case "enter":
      return now >= phase.untilMs ? { next: { kind: "idle", untilMs: now + BOSS_TIMING.idleMs }, events: NO_EVENTS } : { next: phase, events: NO_EVENTS };
    case "idle": {
      if (now < phase.untilMs) return { next: phase, events: NO_EVENTS };
      const lane = script.pattern[attackIdx % Math.max(script.pattern.length, 1)] ?? 1;
      return { next: { kind: "telegraph", lane, untilMs: now + script.telegraphMs[tier] }, events: { ...NO_EVENTS, tell: true } };
    }
    case "telegraph":
      return now >= phase.untilMs ? { next: { kind: "attack", lane: phase.lane, untilMs: now + script.attackMs }, events: NO_EVENTS } : { next: phase, events: NO_EVENTS };
    case "attack": {
      if (now < phase.untilMs) return { next: phase, events: NO_EVENTS };
      const struck = playerLane === phase.lane && script.inversion !== true;
      if (struck) return { next: { kind: "idle", untilMs: now + BOSS_TIMING.idleMs + BOSS_TIMING.hitRecoverMs }, events: { ...NO_EVENTS, hit: true } };
      return { next: { kind: "window", deadlineMs: now + script.windowSeconds[tier] * 1000 }, events: { ...NO_EVENTS, openWindow: true } };
    }
    case "window":
      // the DOM overlay resolves the window via windowResolved(); expiring
      // here (timeout) just closes it — no heart (bible §2b)
      return now >= phase.deadlineMs ? { next: { kind: "idle", untilMs: now + BOSS_TIMING.idleMs }, events: NO_EVENTS } : { next: phase, events: NO_EVENTS };
    case "knot":
      return now >= phase.untilMs ? { next: { kind: "idle", untilMs: now + BOSS_TIMING.idleMs }, events: NO_EVENTS } : { next: phase, events: NO_EVENTS };
    case "beaten":
      return { next: phase, events: NO_EVENTS };
  }
}

/** The DOM overlay reports the window's outcome. Correct unravels a knot
 *  (celebration beat, then beaten when it was the last); wrong just closes
 *  the window — the pattern repeats (§2b). */
export function windowResolved(correct: boolean, knotsLeft: number, now: number): { next: BossPhase; knotsLeft: number } {
  if (!correct) return { next: { kind: "idle", untilMs: now + BOSS_TIMING.idleMs }, knotsLeft };
  const left = knotsLeft - 1;
  return left <= 0 ? { next: { kind: "beaten" }, knotsLeft: 0 } : { next: { kind: "knot", untilMs: now + BOSS_TIMING.knotMs }, knotsLeft: left };
}

// ---------------------------------------------------------------------------
// The counter-window task plan — production-focused, on the proven rescue
// machinery (typed vocab carrier ↔ grammar chips, scaffold-down on retry).
// One plan per duel; windows consume tasks in order and RETRY the same task
// (scaffolded) after a wrong answer.
// ---------------------------------------------------------------------------
export function bossPlan(items: ResolvedItem[], knots: number, seed: number): RescueTask[] {
  // spares: every knot can be retried scaffolded, so draw a spare per knot
  return rescuePlan(items, seed, knots * 2);
}
