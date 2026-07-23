// THE CARD SKINS (PB-T8 / Build-B-skins) — the painted faces. Each renders a
// machine STATE and dispatches ACTIONS; it holds no game logic (grading lives
// in the machine, wiring in CardHost). Tap-first (every kind is solvable by
// tapping); drag is a later enhancement. dispatch accepts one action or an
// array (single-tap-commit kinds fold atomically — no React stale closure).
import React from "react";
import { cardBtn } from "./CardShell.tsx";
import type {
  ChoiceState, ChoiceAction, TypedState, TypedAction, SpellState, SpellAction,
  OrderState, OrderAction, OddState, OddAction, WheelState, WheelAction,
  MistakeState, MistakeAction, MemoryState, MemoryAction,
} from "./machines.ts";

export type Dispatch<A> = (a: A | A[]) => void;

const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 8 };
const rowWrap: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" };
const tile: React.CSSProperties = { ...cardBtn, minWidth: 40, fontWeight: 700, textTransform: "none" };
const used: React.CSSProperties = { ...tile, opacity: 0.3, cursor: "default" };
const slot: React.CSSProperties = { display: "inline-block", minWidth: 26, minHeight: 30, borderBottom: "2px solid #c9a36a", margin: "0 3px", fontWeight: 700, fontSize: 18 };

export function ChoiceCard({ state, dispatch }: { state: ChoiceState; dispatch: Dispatch<ChoiceAction> }): React.ReactElement {
  return (
    <div style={col}>
      {state.options.map((opt) => (
        <button key={opt} style={{ ...cardBtn }} onClick={() => dispatch({ pick: opt })}>{opt}</button>
      ))}
    </div>
  );
}

export function TypedCard({ state, dispatch }: { state: TypedState; dispatch: Dispatch<TypedAction> }): React.ReactElement {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      <input
        autoFocus
        value={state.value}
        onChange={(e) => dispatch({ input: e.target.value })}
        onKeyDown={(e) => { if (e.key === "Enter") dispatch({ submit: true }); }}
        style={{ fontSize: 16, padding: "8px 10px", borderRadius: 8, border: "1px solid #c9a36a", width: 190 }}
        placeholder="…"
      />
      <button style={cardBtn} onClick={() => dispatch({ submit: true })}>OK</button>
    </div>
  );
}

export function SpellCard({ state, dispatch }: { state: SpellState; dispatch: Dispatch<SpellAction> }): React.ReactElement {
  const built = state.used.map((i) => state.tray[i]);
  return (
    <div style={col}>
      <div style={{ minHeight: 34 }}>
        {built.length === 0 ? <span style={{ color: "#b7a980" }}>tippe die Buchstaben …</span>
          : built.map((c, i) => <span key={i} style={slot}>{c?.toUpperCase()}</span>)}
      </div>
      <div style={rowWrap}>
        {state.tray.map((c, i) => (
          <button key={i} disabled={state.used.includes(i)} style={state.used.includes(i) ? used : tile}
            onClick={() => dispatch({ tapTray: i })}>{c.toUpperCase()}</button>
        ))}
      </div>
      <button style={{ ...cardBtn, alignSelf: "center", fontSize: 13 }} disabled={state.used.length === 0}
        onClick={() => dispatch({ undo: true })}>⌫ zurück</button>
    </div>
  );
}

export function OrderCard({ state, dispatch }: { state: OrderState; dispatch: Dispatch<OrderAction> }): React.ReactElement {
  return (
    <div style={col}>
      <div style={{ minHeight: 36, ...rowWrap }}>
        {state.seq.length === 0 ? <span style={{ color: "#b7a980" }}>tippe die Wörter der Reihe nach …</span>
          : state.seq.map((i, k) => <span key={k} style={{ ...tile, cursor: "default" }}>{state.tray[i]}</span>)}
      </div>
      <div style={rowWrap}>
        {state.tray.map((c, i) => (
          <button key={i} disabled={state.seq.includes(i)} style={state.seq.includes(i) ? used : tile}
            onClick={() => dispatch({ tapTray: i })}>{c}</button>
        ))}
      </div>
      <button style={{ ...cardBtn, alignSelf: "center", fontSize: 13 }} disabled={state.seq.length === 0}
        onClick={() => dispatch({ undo: true })}>⌫ zurück</button>
    </div>
  );
}

export function OddCard({ state, dispatch }: { state: OddState; dispatch: Dispatch<OddAction> }): React.ReactElement {
  const pick = (item: string) =>
    state.select === "odd" ? dispatch([{ toggle: item }, { submit: true }]) : dispatch({ toggle: item });
  return (
    <div style={col}>
      <div style={rowWrap}>
        {state.items.map((item) => (
          <button key={item} style={{ ...tile, background: state.selected.includes(item) ? "#f0e2b8" : "#fffdf6" }}
            onClick={() => pick(item)}>{item}</button>
        ))}
      </div>
      {state.select === "all" && (
        <button style={{ ...cardBtn, alignSelf: "center" }} onClick={() => dispatch({ submit: true })}>Fertig</button>
      )}
    </div>
  );
}

export function WheelCard({ state, dispatch }: { state: WheelState; dispatch: Dispatch<WheelAction> }): React.ReactElement {
  const n = state.values.length;
  const prev = state.values[(state.index - 1 + n) % n];
  const next = state.values[(state.index + 1) % n];
  return (
    <div style={{ ...col, alignItems: "center", gap: 4 }}>
      <button style={{ ...cardBtn, fontSize: 20, border: "none", background: "transparent" }} onClick={() => dispatch({ rotate: -1 })}>▲</button>
      <div style={{ color: "#c3b892", fontSize: 14 }}>{prev}</div>
      <button style={{ ...cardBtn, fontSize: 22, fontWeight: 800, padding: "10px 28px" }} onClick={() => dispatch({ lock: true })}>
        {state.values[state.index]}
      </button>
      <div style={{ color: "#c3b892", fontSize: 14 }}>{next}</div>
      <button style={{ ...cardBtn, fontSize: 20, border: "none", background: "transparent" }} onClick={() => dispatch({ rotate: 1 })}>▼</button>
      <div style={{ fontSize: 12, color: "#8a7a58" }}>dreh & tipp die Zahl an</div>
    </div>
  );
}

export function MistakeCard({ state, dispatch }: { state: MistakeState; dispatch: Dispatch<MistakeAction> }): React.ReactElement {
  if (state.phase === "fix") {
    return (
      <div style={col}>
        <div style={{ fontSize: 14, color: "#6b6250" }}>Womit ersetzt du es?</div>
        <div style={rowWrap}>
          {state.correctionOptions.map((o) => (
            <button key={o} style={tile} onClick={() => dispatch({ pickFix: o })}>{o}</button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={{ ...rowWrap, fontSize: 18 }}>
      {state.sentence.map((w, i) => (
        <button key={i} style={{ ...tile, textTransform: "none" }} onClick={() => dispatch({ tapWord: i })}>{w}</button>
      ))}
    </div>
  );
}

export function MemoryCard({ state, dispatch }: { state: MemoryState; dispatch: Dispatch<MemoryAction> }): React.ReactElement {
  const faceUp = (i: number) => state.matched.includes(i) || state.up.includes(i);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(4, state.tray.length)}, 1fr)`, gap: 8 }}>
      {state.tray.map((c, i) => (
        <button key={i} style={{ ...tile, minHeight: 44, background: state.matched.includes(i) ? "#dff0d8" : faceUp(i) ? "#f0e2b8" : "#e9dfc4" }}
          onClick={() => dispatch({ flip: i })}>{faceUp(i) ? c.v : "❓"}</button>
      ))}
    </div>
  );
}
