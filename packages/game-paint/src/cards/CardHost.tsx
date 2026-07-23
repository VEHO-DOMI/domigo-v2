// CARD HOST (PB-T8 / Build-B-skins) — the glue between a v2 task and its
// painted skin. Owns the machine state + the wrong-attempt counter; on each
// dispatch it folds the action(s) over the current state, grades, and either
// RESOLVES (correct), escalates the hint + resets to a clean retry (wrong), or
// updates (pending). Mount fresh per task via a `key={task.id}` at the call site.
import React, { useState } from "react";
import type { GameTaskV2 } from "@domigo/content-schema";
import { MACHINES } from "./machines.ts";
import { CardShell } from "./CardShell.tsx";
import {
  ChoiceCard, TypedCard, SpellCard, OrderCard, OddCard, WheelCard, MistakeCard, MemoryCard, type Dispatch,
} from "./skins.tsx";
import type {
  ChoiceState, ChoiceAction, TypedState, TypedAction, SpellState, SpellAction,
  OrderState, OrderAction, OddState, OddAction, WheelState, WheelAction,
  MistakeState, MistakeAction, MemoryState, MemoryAction,
} from "./machines.ts";

export function CardHost({
  task, onResolve, onDismiss,
}: {
  task: GameTaskV2;
  onResolve: () => void;
  onDismiss: () => void;
}): React.ReactElement {
  const m = MACHINES[task.kind];
  const [state, setState] = useState<unknown>(() => m.init(task));
  const [attempts, setAttempts] = useState(0);

  const dispatch: Dispatch<unknown> = (a) => {
    const actions = Array.isArray(a) ? a : [a];
    let next = state;
    for (const act of actions) next = m.act(next, act);
    const g = m.grade(next);
    if (g === "correct") { onResolve(); return; }
    if (g === "wrong") { setAttempts((x) => x + 1); setState(m.init(task)); return; }
    setState(next);
  };

  return (
    <CardShell task={task} attempts={attempts} onDismiss={onDismiss}>
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
  }
}
