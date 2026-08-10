// THE CARD SKINS (PB-T8 / Build-B-skins) — the painted faces. Each renders a
// machine STATE and dispatches ACTIONS; it holds no game logic (grading lives
// in the machine, wiring in CardHost). Tap-first (every kind is solvable by
// tapping); drag is a later enhancement. dispatch accepts one action or an
// array (single-tap-commit kinds fold atomically — no React stale closure).
import React from "react";
import { cardBtn } from "./CardShell.tsx";
import { scrollBehavior } from "./motion.ts";
import {
  WHEEL_ITEM_H, WHEEL_SETTLE_MS, spellSlots, spellTrayDisabled,
  wheelIndexAt, wheelLockActions, wheelScrollFor, wheelStep,
} from "./machines.ts";
import type {
  ChoiceState, ChoiceAction, TypedState, TypedAction, SpellState, SpellAction,
  OrderState, OrderAction, OddState, OddAction, WheelState, WheelAction,
  MistakeState, MistakeAction, MemoryState, MemoryAction, RestoreState, RestoreAction,
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
  // EXACTLY answer-length slots (so the child knows how many letters to place; the
  // tray carries decoys) + a tap-cap once the slots are full — the article form
  // ("a pen" over "pen") stays physically unbuildable. Both are pure helpers in
  // machines.ts so the rule is unit-tested and never drifts from this skin.
  const slots = spellSlots(state);
  return (
    <div style={col}>
      <div style={{ minHeight: 40, ...rowWrap }}>
        {slots.map((c, i) => (
          <span key={i} style={{ ...slot, color: c ? "#243048" : "#c9a36a" }}>{c ? c.toUpperCase() : "_"}</span>
        ))}
      </div>
      <div style={rowWrap}>
        {state.tray.map((c, i) => {
          const disabled = spellTrayDisabled(state, i);
          return (
            <button key={i} disabled={disabled} style={disabled ? used : tile}
              onClick={() => dispatch({ tapTray: i })}>{c.toUpperCase()}</button>
          );
        })}
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
          <button key={item} style={{ ...tile, backgroundColor: state.selected.includes(item) ? "#eddfb2" : undefined }}
            onClick={() => pick(item)}>{item}</button>
        ))}
      </div>
      {state.select === "all" && (
        <button style={{ ...cardBtn, alignSelf: "center" }} onClick={() => dispatch({ submit: true })}>Fertig</button>
      )}
    </div>
  );
}

// ── R3-9 · DAS KREIDE-RAD — the scroll dial (doc 42 §2, re-skinned) ──────────
// Mechanism mined from Keen's NumberWheel: the FULL value scale in one
// scroll-snap column, five rows visible, a lens over the middle one, gradient
// masks top and bottom, and the highlight painted by a NATIVE scroll listener
// (React's synthetic onScroll was unreliable inside a game overlay, and a dial
// spun by a thumb must not re-render React 25× a second).
//
// What Keen missed and this adds: AUTO-LOCK on settle. Releasing the dial IS
// the answer — no „Einloggen" press. A programmatic move (▲▼) deliberately does
// NOT auto-lock, so the fallback path stays a browse, with its own ✓ commit.
//
// STYLE_PAINT_V1 re-skin: slate face, chalk numerals, and the lens is Fibel's
// magnifier rather than Keen's neon rectangle.
const SLATE = "#2f3f4a";
const CHALK = "#f6f2e8";
const CHALK_DIM = "#93a3ad";

/**
 * The row height as RENDERED, never as declared — found in the browser during
 * PK-R3a. The card springs in with `transform: scale(0.94)`, and a child can
 * start dragging the dial while that is still true (page zoom does the same
 * thing permanently). Rows then measure ~41 px while the code believes 44, and
 * `round(scrollTop / 44)` drifts by a whole row once the scale is long enough —
 * the dial would lock in a number the child never put under the lens. Measuring
 * costs one layout read per scroll and removes the class.
 */
const rowHeightOf = (el: HTMLElement): number =>
  (el.children[0] as HTMLElement | undefined)?.getBoundingClientRect().height || WHEEL_ITEM_H;

export function WheelCard({ state, dispatch }: { state: WheelState; dispatch: Dispatch<WheelAction> }): React.ReactElement {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  /** where the DIAL is (the DOM is the truth between renders) */
  const idxRef = React.useRef(0);
  /** did a HUMAN cause the scroll that is settling? only then do we lock. */
  const userRef = React.useRef(false);
  const settleRef = React.useRef<number | null>(null);
  /** the scroll listener is bound once; it must always see the CURRENT machine
   *  state and dispatch, so both ride in a ref that every render refreshes. */
  const liveRef = React.useRef({ state, dispatch });
  liveRef.current = { state, dispatch };
  /** the imperative highlighter, exposed so every render can re-apply it */
  const paintRef = React.useRef<(() => void) | null>(null);

  const n = state.values.length;

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const paint = (): void => {
      const i = wheelIndexAt(el.scrollTop, n, rowHeightOf(el));
      idxRef.current = i;
      for (let k = 0; k < el.children.length; k++) {
        const d = el.children[k] as HTMLElement;
        d.style.fontSize = k === i ? "26px" : "17px";
        d.style.color = k === i ? CHALK : CHALK_DIM;
        d.style.opacity = k === i ? "1" : "0.72";
      }
    };
    const onScroll = (): void => {
      paint();
      if (settleRef.current !== null) window.clearTimeout(settleRef.current);
      settleRef.current = window.setTimeout(() => {
        settleRef.current = null;
        if (!userRef.current) return; // a ▲▼ step is a browse, not an answer
        userRef.current = false;
        const live = liveRef.current;
        live.dispatch(wheelLockActions(live.state, idxRef.current));
      }, WHEEL_SETTLE_MS);
    };
    const arm = (): void => { userRef.current = true; };
    paintRef.current = paint;
    el.scrollTop = wheelScrollFor(idxRef.current, rowHeightOf(el));
    paint();
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", arm, { passive: true });
    el.addEventListener("touchstart", arm, { passive: true });
    el.addEventListener("wheel", arm, { passive: true });
    return () => {
      if (settleRef.current !== null) window.clearTimeout(settleRef.current);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", arm);
      el.removeEventListener("touchstart", arm);
      el.removeEventListener("wheel", arm);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one dial per card
  }, []);

  // React owns the rows' declared styles; the LENS highlight is imperative, so
  // any re-render restores the flat JSX styles and the dial goes blank under the
  // magnifier. That happens on a real beat — a wrong lock escalates the hint
  // ladder, which re-renders — so the highlight is re-applied after every render.
  // (Found in the browser during PK-R3a, alongside the row-height defect.)
  React.useEffect(() => { paintRef.current?.(); });

  /** Move the dial without answering (the ▲▼ fallback). */
  const step = (delta: number): void => {
    const el = listRef.current;
    if (!el) return;
    userRef.current = false;
    el.scrollTo({ top: wheelScrollFor(wheelStep(idxRef.current, delta, n), rowHeightOf(el)), behavior: scrollBehavior() });
  };
  /** Tapping a row brings it under the lens AND answers with it — one tap, the
   *  same commitment a release carries. */
  const pickRow = (i: number): void => {
    const el = listRef.current;
    if (!el) return;
    userRef.current = true;
    el.scrollTo({ top: wheelScrollFor(i, rowHeightOf(el)), behavior: scrollBehavior() });
  };
  const lockNow = (): void => dispatch(wheelLockActions(liveRef.current.state, idxRef.current));

  return (
    <div style={{ ...col, alignItems: "center", gap: 6 }}>
      {/* the slate the being carries — F2-22: the datum was only ever named in
          the German line and never drawn, so the wheel could not be solved by
          looking. It is now ON the card, big enough to read across the room. */}
      <div style={{
        background: SLATE, color: CHALK, borderRadius: 8, border: "2px solid #8a7a58",
        padding: "4px 18px", fontSize: 26, fontWeight: 800, letterSpacing: 1,
        fontFamily: "var(--font-display, inherit)",
      }}>{state.shown}</div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <button aria-label="eins hoch" style={dialBtn} onClick={() => step(-1)}>▲</button>
          <button aria-label="eins runter" style={dialBtn} onClick={() => step(1)}>▼</button>
        </div>

        <div style={{
          position: "relative", height: WHEEL_ITEM_H * 5, width: 190, overflow: "hidden",
          borderRadius: 12, background: SLATE, border: "3px solid #8a7a58",
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.35)",
        }}>
          <div
            ref={listRef}
            data-testid="chalk-wheel"
            role="listbox"
            aria-label="Zahlenrad"
            style={{
              height: "100%", overflowY: "scroll", scrollSnapType: "y mandatory",
              paddingTop: WHEEL_ITEM_H * 2, paddingBottom: WHEEL_ITEM_H * 2,
              scrollbarWidth: "none", touchAction: "pan-y",
            }}
          >
            {state.values.map((v, i) => (
              <div
                key={v}
                role="option"
                aria-selected={state.values[state.index] === v}
                onClick={() => pickRow(i)}
                style={{
                  height: WHEEL_ITEM_H, display: "flex", alignItems: "center", justifyContent: "center",
                  scrollSnapAlign: "center", cursor: "pointer", color: CHALK_DIM, fontSize: 17,
                  fontWeight: 700, fontFamily: "var(--font-display, inherit)", letterSpacing: 0.5,
                  transition: "font-size 120ms, color 120ms, opacity 120ms",
                }}
              >
                {v}
              </div>
            ))}
          </div>
          {/* Fibel's magnifier: a chalk ring drawn over the middle row */}
          <div style={{
            position: "absolute", top: WHEEL_ITEM_H * 2, left: 10, right: 10, height: WHEEL_ITEM_H,
            border: `2px solid ${CHALK}`, borderRadius: 22, pointerEvents: "none", opacity: 0.85,
          }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: WHEEL_ITEM_H * 1.6, background: `linear-gradient(${SLATE}, transparent)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: WHEEL_ITEM_H * 1.6, background: `linear-gradient(transparent, ${SLATE})`, pointerEvents: "none" }} />
        </div>
      </div>

      {/* the fallback commit: the ▲▼ path browses, this answers */}
      <button style={{ ...cardBtn, fontSize: 14, padding: "6px 14px" }} onClick={lockNow}>✓ Das ist es!</button>
      <div style={{ fontSize: 12, color: "#8a7a58", fontFamily: "var(--font-label, inherit)" }}>zieh am Rad — oder tipp eine Zahl an</div>
    </div>
  );
}

const dialBtn: React.CSSProperties = {
  ...cardBtn, fontSize: 15, padding: "2px 8px", lineHeight: 1.1, minWidth: 32,
};

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

// ── PK-R3b · R3-15 · DIE FARBKARTE — ch01's core mechanic (doc 41 §2) ────────
// Two steps on one card, with the step you are on shown as a painted
// breadcrumb: the child always knows there is a second half coming, so the
// colour row does not arrive as a surprise second question.
//
// Step 2's swatches are the honest part. A colour word is the one bit of
// vocabulary a card can SHOW rather than describe, so each option carries its
// own paint blob — a child who cannot yet read „yellow" can still match the
// word to the colour the being asked for in German, which is exactly the
// A1 bridge the unit is teaching.
const SWATCHES: Record<string, string> = {
  red: "#c4402f", yellow: "#e8b93a", blue: "#3b5ea8", green: "#59a83c",
  orange: "#d97a2b", brown: "#8a5a3b", pink: "#d97a9a", white: "#fbf7ec",
  black: "#243048", grey: "#9a958c",
};

const stepDot = (on: boolean): React.CSSProperties => ({
  width: 9, height: 9, borderRadius: "50%", display: "inline-block",
  background: on ? "#8a5a2b" : "transparent", border: "1.5px solid #c9a36a",
});

export function RestoreCard({ state, dispatch }: { state: RestoreState; dispatch: Dispatch<RestoreAction> }): React.ReactElement {
  const onColour = state.step === "colour";
  return (
    <div style={{ ...col, alignItems: "stretch" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 2 }}>
        <span style={stepDot(true)} />
        <span style={stepDot(onColour)} />
        <span style={{ fontSize: 12, color: "#8a7a58", fontFamily: "var(--font-label, inherit)", marginLeft: 4 }}>
          {onColour ? "2 · die Farbe" : "1 · der Name"}
        </span>
      </div>

      {!onColour && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {state.nameOptions.map((o) => (
            <button key={o} style={{ ...cardBtn }} onClick={() => dispatch({ pickName: o })}>{o}</button>
          ))}
        </div>
      )}

      {onColour && (
        <>
          <p style={{ fontSize: 15, color: "#4a4030", margin: "0 0 8px" }}>{state.colourAskDe}</p>
          <div style={rowWrap}>
            {state.colourOptions.map((o) => (
              <button
                key={o}
                style={{ ...cardBtn, display: "flex", alignItems: "center", gap: 7 }}
                onClick={() => dispatch({ pickColour: o })}
              >
                <span
                  aria-hidden
                  style={{
                    width: 16, height: 16, borderRadius: "50%",
                    background: SWATCHES[o] ?? "#c9a36a", border: "1.5px solid #8a7a58",
                    display: "inline-block", flex: "0 0 auto",
                  }}
                />
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function MemoryCard({ state, dispatch }: { state: MemoryState; dispatch: Dispatch<MemoryAction> }): React.ReactElement {
  const faceUp = (i: number) => state.matched.includes(i) || state.up.includes(i);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(4, state.tray.length)}, 1fr)`, gap: 8 }}>
      {state.tray.map((c, i) => (
        <button key={i} style={{ ...tile, minHeight: 44, backgroundColor: state.matched.includes(i) ? "#d7e8c8" : faceUp(i) ? "#eddfb2" : "#e6dabc" }}
          onClick={() => dispatch({ flip: i })}>{faceUp(i) ? c.v : "❓"}</button>
      ))}
    </div>
  );
}
