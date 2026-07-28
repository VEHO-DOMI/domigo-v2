// CARD HOST (PB-T8 / Build-B-skins) — the glue between a v2 task and its
// painted skin. Owns the machine state + the wrong-attempt counter; on each
// dispatch it folds the action(s) over the current state, grades, and either
// RESOLVES (correct), escalates the hint + resets to a clean retry (wrong), or
// updates (pending). Mount fresh per task via a `key={task.id}` at the call site.
//
// PK-R3a · R3-8 adds the two BEATS the mined choreography asks for (doc 42 §1):
//  · the VERDICT beat — a solved card says so before the world comes back,
//    instead of vanishing mid-tap,
//  · the CHALK CLOCK on quickfire cards — the swarm's pestering has an end.
//    Running out is „Später", never a failure: no penalty, no redeem, the world
//    simply resumes (the anti-softlock law, PB-T1). Under reduced motion the
//    clock is not shown AND not run: an invisible countdown would be unfair.
import React, { useState } from "react";
import type { GameTaskV2 } from "@domigo/content-schema";
import { MACHINES } from "./machines.ts";
import { CardShell, type CardAlign } from "./CardShell.tsx";
import { QUICKFIRE_MS, VERDICT_MS } from "./overlay-css.ts";
import { prefersReducedMotion } from "./motion.ts";
import {
  ChoiceCard, TypedCard, SpellCard, OrderCard, OddCard, WheelCard, MistakeCard, MemoryCard,
  RestoreCard, type Dispatch,
} from "./skins.tsx";
import type {
  ChoiceState, ChoiceAction, TypedState, TypedAction, SpellState, SpellAction,
  OrderState, OrderAction, OddState, OddAction, WheelState, WheelAction,
  MistakeState, MistakeAction, MemoryState, MemoryAction, RestoreState, RestoreAction,
} from "./machines.ts";

export function CardHost({
  task, onResolve, onDismiss, align = "center",
}: {
  task: GameTaskV2;
  onResolve: () => void;
  onDismiss: () => void;
  /** which side of the canvas to sit on (PB-F1/F2-20) */
  align?: CardAlign;
}): React.ReactElement {
  const m = MACHINES[task.kind];
  const [state, setState] = useState<unknown>(() => m.init(task));
  const [attempts, setAttempts] = useState(0);
  const [verdict, setVerdict] = useState(false);
  /** the card may only end ONCE — a late timer must not fire after an answer,
   *  and a second tap during the verdict beat must not resolve twice */
  const endedRef = React.useRef(false);
  const cbRef = React.useRef({ onResolve, onDismiss });
  cbRef.current = { onResolve, onDismiss };
  /** the verdict beat's timer, cleared on unmount. PK-R1's whole root cause was
   *  a rule with two clocks and a timer nobody owned; this packet does not add
   *  another one that can fire into a torn-down tree. */
  const beatRef = React.useRef<number | null>(null);
  React.useEffect(() => () => { if (beatRef.current !== null) window.clearTimeout(beatRef.current); }, []);

  const clockMs = task.use === "quickfire" && !prefersReducedMotion() ? QUICKFIRE_MS : 0;

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
      if (prefersReducedMotion()) { cbRef.current.onResolve(); return; }
      setVerdict(true);
      beatRef.current = window.setTimeout(() => { beatRef.current = null; cbRef.current.onResolve(); }, VERDICT_MS);
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

  return (
    <CardShell task={task} attempts={attempts} onDismiss={dismiss} align={align} clockMs={clockMs} verdict={verdict}>
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
