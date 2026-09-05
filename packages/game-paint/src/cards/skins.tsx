// THE CARD SKINS (PB-T8 / Build-B-skins) — the painted faces. Each renders a
// machine STATE and dispatches ACTIONS; it holds no game logic (grading lives
// in the machine, wiring in CardHost). Tap-first (every kind is solvable by
// tapping); drag is a later enhancement. dispatch accepts one action or an
// array (single-tap-commit kinds fold atomically — no React stale closure).
import React from "react";
import { cardBtn } from "./CardShell.tsx";
import { CardBack } from "./Glance.tsx";
import { scrollBehavior } from "./motion.ts";
import {
  WHEEL_ITEM_H, WHEEL_SETTLE_MS, spellSlots, spellTrayDisabled,
  wheelIndexAt, wheelLockActions, wheelRowPitch, wheelScrollFor, wheelStep,
} from "./machines.ts";
import type {
  ChoiceState, ChoiceAction, TypedState, TypedAction, SpellState, SpellAction,
  OrderState, OrderAction, OddState, OddAction, WheelState, WheelAction,
  MatchState, MatchAction, MistakeState, MistakeAction, MemoryState, MemoryAction, RestoreState, RestoreAction,
} from "./machines.ts";

export type Dispatch<A> = (a: A | A[]) => void;

const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 8 };
const rowWrap: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" };
const tile: React.CSSProperties = { ...cardBtn, minWidth: 46, fontWeight: 700, textTransform: "none" };
const used: React.CSSProperties = { ...tile, opacity: 0.3, cursor: "default" };
/** R5-W1 · D1: a target the child is BUILDING — the answer tray. It was a bare
 *  underline; the blind critic could not find the assembly area at all on the
 *  order card („no answer-assembly area is visible"). It is a chalk shelf now:
 *  recessed, ruled, and visibly waiting to be filled. */
const buildRow: React.CSSProperties = {
  ...rowWrap,
  minHeight: 52,
  alignItems: "center",
  padding: "7px 10px",
  borderRadius: "12px 9px 13px 10px / 10px 13px 9px 12px",
  background: "rgba(151,118,66,0.1)",
  boxShadow: "inset 0 2px 7px rgba(120,92,50,0.2)",
};
const slot: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  minWidth: 30, minHeight: 36, borderBottom: "3px solid #c9a36a", margin: "0 3px",
  fontWeight: 800, fontSize: 22, fontFamily: "var(--font-display, inherit)",
};

/** R5-W1 · D1: two columns for an EVEN set, one column otherwise. Two columns
 *  turn options from a list-to-read into a set-to-choose-from and keep the card
 *  short beside a being — but an odd set laid into them leaves a lonely last
 *  chip on its own row, which the blind critic called „a real scan-order
 *  downgrade" on the three-option card. Even sets grid; odd sets stack. */
const chipGrid = (n: number): React.CSSProperties => ({
  display: "grid",
  gridTemplateColumns: n >= 4 && n % 2 === 0 ? "1fr 1fr" : "1fr",
  gap: 8,
});

export function ChoiceCard({ state, dispatch }: { state: ChoiceState; dispatch: Dispatch<ChoiceAction> }): React.ReactElement {
  return (
    <div data-chips style={chipGrid(state.options.length)}>
      {state.options.map((opt) => (
        <button key={opt} style={{ ...cardBtn }} onClick={() => dispatch({ pick: opt })}>{opt}</button>
      ))}
    </div>
  );
}

export function TypedCard({ state, dispatch }: { state: TypedState; dispatch: Dispatch<TypedAction> }): React.ReactElement {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "stretch" }}>
      {/* R5-W1 · D1: the line the child writes ON is the answer, so it is set
          in the display face at the size the answer deserves — a 16 px form
          field with a hairline border was the one piece of plain web UI left
          in the middle of a painted card. */}
      <input
        autoFocus
        value={state.value}
        onChange={(e) => dispatch({ input: e.target.value })}
        // N7B2 · D-788 · DIE ZWEITE WAND. Phasers Horcher sitzt am Fenster und
        // schaltet die Standardaktion jeder erfassten Taste ab, ohne das Ziel zu
        // prüfen — w, a, s und das Leerzeichen kämen in diesem Feld nie an.
        // `PaintScene.setOverlay` nimmt das Abfangen zwar weg, solange eine
        // Karte steht (erste Wand); diese Zeile hält das Ereignis zusätzlich
        // hier auf, damit ein Weg, der die Szene nicht durchläuft, das Tippen
        // nicht wieder kaputtmachen kann. React hängt am Wurzel-Container: was
        // hier gestoppt wird, erreicht `window` nicht mehr.
        onKeyDown={(e) => { e.stopPropagation(); if (e.key === "Enter") dispatch({ submit: true }); }}
        style={{
          fontSize: 22, fontFamily: "var(--font-display, inherit)", fontWeight: 800,
          textAlign: "center", color: "#33291a", padding: "8px 12px", minHeight: 46, width: 200,
          borderRadius: "12px 9px 13px 10px / 10px 13px 9px 12px",
          border: "2px solid #c9a36a", borderBottomWidth: 3,
          background: "rgba(255,253,244,0.75)",
          boxShadow: "inset 0 2px 7px rgba(120,92,50,0.16)",
        }}
        placeholder="…"
      />
      <button style={{ ...cardBtn, minWidth: 64 }} onClick={() => dispatch({ submit: true })}>OK</button>
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
      {/* the word being built outranks the letters it is built from: the slots
          are the answer, the tray is the supply (blind critic: „blanks
          underweighted vs. tiles") */}
      <div style={buildRow}>
        {slots.map((c, i) => (
          <span key={i} style={{ ...slot, color: c !== null ? "#243048" : "#c9a36a" }}>{c !== null ? c.toUpperCase() : "_"}</span>
        ))}
      </div>
      <div data-chips style={rowWrap}>
        {state.tray.map((c, i) => {
          const disabled = spellTrayDisabled(state, i);
          return (
            <button key={i} disabled={disabled} style={disabled ? used : tile}
              onClick={() => dispatch({ tapTray: i })}>{c.toUpperCase()}</button>
          );
        })}
      </div>
      <button style={{ ...cardBtn, alignSelf: "center", fontSize: 13, minHeight: 38 }} disabled={state.used.length === 0}
        onClick={() => dispatch({ undo: true })}>⌫ zurück</button>
    </div>
  );
}

export function OrderCard({ state, dispatch }: { state: OrderState; dispatch: Dispatch<OrderAction> }): React.ReactElement {
  return (
    <div style={col}>
      {/* the sentence being built, on its own shelf — with one empty slot per
          word still to come, so a child can SEE how far the answer runs before
          they have written any of it */}
      <div style={buildRow}>
        {/* one slot per word of the TARGET, never per tray tile: the tray is a
            shuffle of the answer today, and a slot row that quietly assumed so
            would be wrong the day a decoy is added */}
        {state.target.map((_, k) => {
          const i = state.seq[k];
          return i === undefined
            ? <span key={`slot-${k}`} style={{ ...slot, color: "#c9a36a", minWidth: 34 }}>_</span>
            : <span key={`w-${k}`} style={{ ...tile, cursor: "default", minHeight: 38, padding: "7px 13px" }}>{state.tray[i]}</span>;
        })}
      </div>
      <div data-chips style={rowWrap}>
        {state.tray.map((c, i) => (
          <button key={i} disabled={state.seq.includes(i)} style={state.seq.includes(i) ? used : tile}
            onClick={() => dispatch({ tapTray: i })}>{c}</button>
        ))}
      </div>
      {/* the line that says HOW — it used to be the placeholder inside the
          empty tray and vanished with the first tap. A blind round preferred
          the old card for exactly this („adds an explicit hint the other
          lacks"), so it stays: same words, now a permanent quiet line under
          the shelf instead of a disappearing placeholder. */}
      <p className="pb-quiet" style={{ margin: "-2px 0 0" }}>tippe die Wörter der Reihe nach …</p>
      <button style={{ ...cardBtn, alignSelf: "center", fontSize: 13, minHeight: 38 }} disabled={state.seq.length === 0}
        onClick={() => dispatch({ undo: true })}>⌫ zurück</button>
    </div>
  );
}

export function OddCard({ state, dispatch }: { state: OddState; dispatch: Dispatch<OddAction> }): React.ReactElement {
  const pick = (item: string) =>
    state.select === "odd" ? dispatch([{ toggle: item }, { submit: true }]) : dispatch({ toggle: item });
  return (
    <div style={col}>
      <div data-chips style={rowWrap}>
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

export function WheelCard({ state, dispatch }: { state: WheelState; dispatch: Dispatch<WheelAction> }): React.ReactElement {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  /**
   * R5-W4 · D3 · F-20 · ONE PITCH, READ BY EVERYTHING.
   *
   * The old defect was not only the unit (see `wheelRowPitch`) — it was that
   * the LENS was never measured at all. The ring, the padding, the frame and
   * the fades were all pinned to the declared `WHEEL_ITEM_H` while the bold
   * index alone was computed against a measured height, so the moment those two
   * numbers parted the chalk ring and the chosen row pointed at different
   * places BY CONSTRUCTION. They now read one variable. It starts at the
   * declared height, and the measurement writes back into the same value the
   * rows are declared with — so declaration and measurement converge in one
   * pass instead of arguing.
   */
  const pitchRef = React.useRef(WHEEL_ITEM_H);
  const [rowH, setRowH] = React.useState(WHEEL_ITEM_H);
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
    /** re-read the layout pitch, and let the DECLARED height follow it */
    const measure = (): number => {
      const p = wheelRowPitch(el.children[0] as HTMLElement | undefined);
      pitchRef.current = p;
      // converges: the rows are declared AT this value, so the next read agrees
      setRowH((prev) => (Math.abs(prev - p) >= 0.5 ? p : prev));
      return p;
    };
    const paint = (): void => {
      const i = wheelIndexAt(el.scrollTop, n, measure());
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
    el.scrollTop = wheelScrollFor(idxRef.current, measure());
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
    el.scrollTo({ top: wheelScrollFor(wheelStep(idxRef.current, delta, n), pitchRef.current), behavior: scrollBehavior() });
  };
  /** Tapping a row brings it under the lens AND answers with it — one tap, the
   *  same commitment a release carries. */
  const pickRow = (i: number): void => {
    const el = listRef.current;
    if (!el) return;
    userRef.current = true;
    el.scrollTo({ top: wheelScrollFor(i, pitchRef.current), behavior: scrollBehavior() });
  };
  const lockNow = (): void => dispatch(wheelLockActions(liveRef.current.state, idxRef.current));

  return (
    <div style={{ ...col, alignItems: "center", gap: 6 }}>
      {/* the slate the being carries — F2-22: the datum was only ever named in
          the German line and never drawn, so the wheel could not be solved by
          looking. It is now ON the card, big enough to read across the room. */}
      <div style={{
        background: SLATE, color: CHALK,
        // R5-W1 · D1: the slate is a painted object, so it wears the book's
        // four different corners rather than a uniform 8 px web radius
        borderRadius: "13px 9px 14px 10px / 10px 14px 9px 13px",
        border: "2.5px solid #8a7a58",
        padding: "6px 20px", fontSize: 28, fontWeight: 800, letterSpacing: 1,
        fontFamily: "var(--font-display, inherit)",
        boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3), 0 2px 6px rgba(40,28,12,0.22)",
      }}>{state.shown}</div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <button aria-label="eins hoch" style={dialBtn} onClick={() => step(-1)}>▲</button>
          <button aria-label="eins runter" style={dialBtn} onClick={() => step(1)}>▼</button>
        </div>

        <div style={{
          position: "relative", height: rowH * 5, width: 190, overflow: "hidden",
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
              paddingTop: rowH * 2, paddingBottom: rowH * 2,
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
                  height: rowH, display: "flex", alignItems: "center", justifyContent: "center",
                  scrollSnapAlign: "center", cursor: "pointer", color: CHALK_DIM, fontSize: 17,
                  fontWeight: 700, fontFamily: "var(--font-display, inherit)", letterSpacing: 0.5,
                  transition: "font-size 120ms, color 120ms, opacity 120ms",
                }}
              >
                {v}
              </div>
            ))}
          </div>
          {/* Fibel's magnifier: a chalk ring drawn over the middle row. It sits
              at TWO PITCHES down, the same pitch the index is computed with —
              that identity is the whole fix (F-20). */}
          <div style={{
            position: "absolute", top: rowH * 2, left: 10, right: 10, height: rowH,
            border: `2px solid ${CHALK}`, borderRadius: 22, pointerEvents: "none", opacity: 0.85,
          }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: rowH * 1.6, background: `linear-gradient(${SLATE}, transparent)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: rowH * 1.6, background: `linear-gradient(transparent, ${SLATE})`, pointerEvents: "none" }} />
        </div>
      </div>

      {/* the fallback commit: the ▲▼ path browses, this answers */}
      <button className="pb-btn-primary" style={{ ...cardBtn, fontSize: 15, padding: "8px 18px", minHeight: 40 }} onClick={lockNow}>Das ist es!</button>
      <div className="pb-quiet" style={{ margin: 0 }}>zieh am Rad — oder tipp eine Zahl an</div>
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
        <div data-chips style={rowWrap}>
          {state.correctionOptions.map((o) => (
            <button key={o} style={tile} onClick={() => dispatch({ pickFix: o })}>{o}</button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div data-chips style={{ ...rowWrap, fontSize: 18 }}>
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
        <div data-chips style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {state.nameOptions.map((o) => (
            <button key={o} style={{ ...cardBtn }} onClick={() => dispatch({ pickName: o })}>{o}</button>
          ))}
        </div>
      )}

      {onColour && (
        <>
          {/* R5-W1 · D1: the colour question moved UP into the card's key line
              (CardShell reads it from this state) — while this half is open it
              IS the ask, and an ask set in 15 px body type under the step dots
              was the exact line Koki's eye slid past on the 11th. */}
          <div data-chips style={rowWrap}>
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

/**
 * L2-M-a · R249 · ZWEI SPALTEN, EINE ZUORDNUNG.
 *
 * Links das Ding, rechts die Lage. Das Kind tippt links, dann rechts. Was sitzt,
 * wird blass und ist nicht mehr anfassbar — dieselbe `used`-Sprache wie bei der
 * Reihenfolge-Karte, damit „erledigt" ueberall gleich aussieht.
 */
export function MatchCard({ state, dispatch }: { state: MatchState; dispatch: Dispatch<MatchAction> }): React.ReactElement {
  const rightsDone = new Set(state.matched.map((l) => state.key[l]));
  const spalte = (
    werte: string[],
    fertig: (v: string) => boolean,
    gewaehlt: (v: string) => boolean,
    tap: (v: string) => MatchAction,
  ): React.ReactElement => (
    <div style={{ ...col, flex: 1, minWidth: 0 }}>
      {werte.map((v) => (
        <button
          key={v}
          disabled={fertig(v)}
          style={{
            ...(fertig(v) ? used : tile),
            textTransform: "none",
            width: "100%",
            ...(gewaehlt(v) ? { backgroundColor: "#f7ecd0" } : {}),
          }}
          onClick={() => dispatch(tap(v))}
        >
          {v}
        </button>
      ))}
    </div>
  );
  return (
    <div data-chips style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      {spalte(state.left, (v) => state.matched.includes(v), (v) => state.pickedLeft === v, (v) => ({ tapLeft: v }))}
      {spalte(state.right, (v) => rightsDone.has(v), () => false, (v) => ({ tapRight: v }))}
    </div>
  );
}

export function MemoryCard({ state, dispatch }: { state: MemoryState; dispatch: Dispatch<MemoryAction> }): React.ReactElement {
  const faceUp = (i: number) => state.matched.includes(i) || state.up.includes(i);
  return (
    <div data-chips style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(4, state.tray.length)}, 1fr)`, gap: 8 }}>
      {state.tray.map((c, i) => {
        const done = state.matched.includes(i);
        return (
          <button
            key={i}
            // R5-W1 · D1 (blind critic, worst surface in the set): eight
            // identical „❓" in the reader's own font said „error", not „turn
            // me over". A face-down card is the BOOK's own back now, a matched
            // pair is inked green and stops inviting a tap, and a face-up card
            // shows its word in the display face at the size the answer
            // deserves.
            style={{
              ...tile, minHeight: 54, padding: "6px 8px", cursor: done ? "default" : "pointer",
              backgroundColor: done ? "#d7e8c8" : faceUp(i) ? "#f7ecd0" : undefined,
              color: done ? "#3f6329" : undefined,
              fontSize: 18, fontFamily: "var(--font-display, inherit)",
            }}
            aria-label={faceUp(i) ? c.v : "umgedrehte Karte"}
            onClick={() => dispatch({ flip: i })}
          >
            {faceUp(i) ? c.v : <CardBack n={i + 1} />}
          </button>
        );
      })}
    </div>
  );
}
