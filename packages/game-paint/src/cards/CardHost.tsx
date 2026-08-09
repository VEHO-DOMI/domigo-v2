// CARD HOST (PB-T8 / Build-B-skins) — the glue between a v2 task and its
// painted skin. Owns the machine state + the wrong-attempt counter; on each
// dispatch it folds the action(s) over the current state, grades, and either
// RESOLVES (correct), escalates the hint + resets to a clean retry (wrong), or
// updates (pending). Mount fresh per task via a `key={task.id}` at the call site.
//
// PK-R3a · R3-8 added the two BEATS the mined choreography asks for (doc 42 §1):
// the verdict beat, and the chalk clock. Running the clock out is „Später",
// never a failure: no penalty, no redeem, the world simply resumes (the
// anti-softlock law, PB-T1). Under reduced motion the clock is not shown AND
// not run: an invisible countdown would be unfair.
//
// PK-R6 · C · OVERLAY 2.0 (doc 44 §3.1) changes two things here:
//
//  · THE CLOCK now comes from the POLICY (cards/timer.ts, doc 44 §2.9) instead
//    of from a hard-coded `use === "quickfire"`: quickfire and boss windows are
//    urgent, everything calm is untimed, and the class is read from the pool
//    that actually ASKED (`servedUse`) so a rescue answered out of the unbound
//    quickfire pool does not sprout a 45-second clock over a cage ceremony.
//
//  · THE RESOLUTION is now three beats in the order doc 44 §3.1.7 sets, which
//    is the REVERSE of what shipped: the answer flies home → the world's change
//    plays and is watched (the restore-hold, doc 42 §3) → only then the card
//    celebrates. Before, the ✓ played first and the world changed after the
//    card had already vanished, so a child never saw their own answer land.
import React, { useState } from "react";
import type { GameTaskV2 } from "@domigo/content-schema";
import { MACHINES } from "./machines.ts";
import { CardShell, Cheer, type CardAlign } from "./CardShell.tsx";
import { QUICKFIRE_MS, VERDICT_MS } from "./overlay-css.ts";
import { prefersReducedMotion } from "./motion.ts";
import { clockMsFor } from "./timer.ts";
import { RESTORE_HOLD_MS, type ResolutionBeat, answerTextOf, flightMs } from "./resolution.ts";
import {
  ChoiceCard, TypedCard, SpellCard, OrderCard, OddCard, WheelCard, MistakeCard, MemoryCard,
  RestoreCard, type Dispatch,
} from "./skins.tsx";
import type {
  ChoiceState, ChoiceAction, TypedState, TypedAction, SpellState, SpellAction,
  OrderState, OrderAction, OddState, OddAction, WheelState, WheelAction,
  MistakeState, MistakeAction, MemoryState, MemoryAction, RestoreState, RestoreAction,
} from "./machines.ts";

/**
 * PK-R6 · H1 · WHAT THE CHILD ACTUALLY WROTE (round-1 critique, finding 1).
 *
 * `answerTextOf` reads the answer KEY, which is the right thing for the letter
 * flight (the letters that come home are the word the book was missing). It is
 * the wrong thing for a world change that displays the answer: the ch01 finale
 * accepts „hello", „hi" and their „!" forms, and the console beat then promises
 * „Jetzt steht DEIN Wort da". A child who typed „hi" and watched „hello" appear
 * would be reading a card that lies about them.
 *
 * So: if the machine kept the child's own text (the typed and spell cards both
 * hold it in `value`), that is what comes back. Every other kind has no text the
 * child authored — a choice is a pick, an order is an arrangement — and falls
 * back to the key, which for those kinds IS what the child chose.
 */
export function writtenTextOf(state: unknown, task: GameTaskV2): string {
  const v = (state as { value?: unknown } | null)?.value;
  return typeof v === "string" && v.trim() !== "" ? v.trim() : answerTextOf(task);
}

export function CardHost({
  task, onResolve, onWorldChange, onDismiss, align = "center", art, portraitWash, servedUse, round,
}: {
  task: GameTaskV2;
  /** the card is finished: close it (and hand on any beat it opened) */
  onResolve: () => void;
  /** the answer is home — CHANGE THE WORLD now, while the card is out of the
   *  way. Optional: a caller that has no world (a test, a story card) simply
   *  gets the change folded into onResolve as before.
   *
   *  PK-R6 · H1: it is handed WHAT THE CHILD WROTE (see `writtenTextOf`), so a
   *  world change that puts the answer on screen can put the child's own words
   *  there rather than the answer key's. */
  onWorldChange?: (written: string) => void;
  onDismiss: () => void;
  /** which side of the canvas to sit on (PB-F1/F2-20) */
  align?: CardAlign;
  /** the level's only-present art map (stem → url) for the portrait slot */
  art?: Record<string, string>;
  /** how drained the asker is right now — the portrait matches the world */
  portraitWash?: number;
  /** the pool the WORLD asked for, which is not always the card's authored
   *  `use` (the unbound-quickfire fallback). Drives the timer policy. */
  servedUse?: string;
  /** PK-R6 · D: „Runde n/6" when this card is one beat of a reawakening
   *  (doc 44 §3.3) — a ceremony a child can see the end of. */
  round?: { n: number; of: number };
}): React.ReactElement {
  const m = MACHINES[task.kind];
  const [state, setState] = useState<unknown>(() => m.init(task));
  const [attempts, setAttempts] = useState(0);
  const [beat, setBeat] = useState<ResolutionBeat>("ask");
  /** the card may only end ONCE — a late timer must not fire after an answer,
   *  and a second tap during the resolution must not resolve twice */
  const endedRef = React.useRef(false);
  const cbRef = React.useRef({ onResolve, onDismiss, onWorldChange });
  cbRef.current = { onResolve, onDismiss, onWorldChange };
  /** the resolution's timers, cleared on unmount. PK-R1's whole root cause was
   *  a rule with two clocks and a timer nobody owned; this packet does not add
   *  another one that can fire into a torn-down tree — so every beat's handle
   *  lands in ONE list and the unmount empties it. */
  const beatsRef = React.useRef<number[]>([]);
  const after = (ms: number, fn: () => void): void => {
    beatsRef.current.push(window.setTimeout(fn, ms));
  };
  React.useEffect(() => () => {
    for (const t of beatsRef.current) window.clearTimeout(t);
    beatsRef.current = [];
  }, []);

  // doc 44 §2.9 · the timer policy, from the one map every reader shares
  const clockMs = clockMsFor(servedUse ?? task.use, task.kind, prefersReducedMotion(), QUICKFIRE_MS);

  React.useEffect(() => {
    if (clockMs === 0) return;
    const t = window.setTimeout(() => {
      if (endedRef.current) return;
      endedRef.current = true;
      cbRef.current.onDismiss(); // the swarm gives up: no reward, no penalty
    }, clockMs);
    return () => window.clearTimeout(t);
  }, [clockMs]);

  const dispatch: Dispatch<unknown> = (a) => {
    if (endedRef.current) return;
    const actions = Array.isArray(a) ? a : [a];
    let next = state;
    for (const act of actions) next = m.act(next, act);
    const g = m.grade(next);
    if (g === "correct") {
      endedRef.current = true;
      // reduced motion: every beat is already in its finished state, so the
      // world changes and the card closes at once (the end-states law applied
      // to time rather than to CSS — a beat you cannot see may not be waited on)
      const written = writtenTextOf(next, task);
      if (prefersReducedMotion()) {
        cbRef.current.onWorldChange?.(written);
        cbRef.current.onResolve();
        return;
      }
      // ── the three beats, in doc 44 §3.1.7's order ──
      const answer = answerTextOf(task);
      const fly = flightMs(answer);
      setBeat("letters");
      after(fly, () => {
        setBeat("hold");                    // the card doffs …
        cbRef.current.onWorldChange?.(written); // … and the world changes, watched
        after(RESTORE_HOLD_MS, () => {
          setBeat("cheer");                 // only now does the card celebrate
          after(VERDICT_MS, () => cbRef.current.onResolve());
        });
      });
      return;
    }
    if (g === "wrong") { setAttempts((x) => x + 1); setState(m.init(task)); return; }
    setState(next);
  };

  const dismiss = (): void => {
    if (endedRef.current) return;
    endedRef.current = true;
    cbRef.current.onDismiss();
  };

  if (beat === "cheer") return <Cheer align={align} />;

  return (
    <CardShell
      task={task}
      attempts={attempts}
      onDismiss={dismiss}
      align={align}
      clockMs={clockMs}
      art={art}
      portraitWash={portraitWash}
      round={round}
      flight={beat === "letters" ? answerTextOf(task) : null}
      doff={beat === "hold"}
    >
      <Skin task={task} state={state} dispatch={dispatch} />
    </CardShell>
  );
}

function Skin({ task, state, dispatch }: { task: GameTaskV2; state: unknown; dispatch: Dispatch<unknown> }): React.ReactElement {
  const d = dispatch as Dispatch<never>;
  switch (task.kind) {
    case "choice": return <ChoiceCard state={state as ChoiceState} dispatch={d as Dispatch<ChoiceAction>} />;
    case "typed": return <TypedCard state={state as TypedState} dispatch={d as Dispatch<TypedAction>} />;
    case "spell": return <SpellCard state={state as SpellState} dispatch={d as Dispatch<SpellAction>} />;
    case "order": return <OrderCard state={state as OrderState} dispatch={d as Dispatch<OrderAction>} />;
    case "oddone": return <OddCard state={state as OddState} dispatch={d as Dispatch<OddAction>} />;
    case "wheel": return <WheelCard state={state as WheelState} dispatch={d as Dispatch<WheelAction>} />;
    case "mistake": return <MistakeCard state={state as MistakeState} dispatch={d as Dispatch<MistakeAction>} />;
    case "memory": return <MemoryCard state={state as MemoryState} dispatch={d as Dispatch<MemoryAction>} />;
    case "restore": return <RestoreCard state={state as RestoreState} dispatch={d as Dispatch<RestoreAction>} />;
  }
}
