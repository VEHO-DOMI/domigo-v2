"use client";
/**
 * @domigo/task-ui — render + grade one approved item. Presentation-driven by the
 * item (not the route), so the games and Smart Review reuse these. Grading goes
 * through @domigo/engine; nothing here re-implements answer logic.
 *
 * Styling is the DomiGo brand (globals.css tokens): brand glass card, accent
 * gradient buttons (.dg-btn), focus-glow inputs (.dg-input), and the signature
 * multiple-choice option buttons (.dg-mc-option, correct/wrong tint). Colours come
 * from CSS vars so the accent themes per grade — presentation only, no logic change.
 */
import { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { AudioRef, GrammarItem, GrammarStructure, Gloss, ListeningTask, VocabItem, WordBank } from "@domigo/content-schema";
import type { ClassifiableItem, GrammarInput, Tier } from "@domigo/engine";
import { breaksCombo, classifyWrong, gradeGrammar, gradeVocab, xpForTier } from "@domigo/engine";
import { diffWords, playTier } from "@domigo/game-feel";
import { agAssemble, agSlots, agTiles, sbChips } from "./tactile.ts";

export { agAssemble, agSlots, agTiles, sbChips, sbAnswerOrder, seededShuffle } from "./tactile.ts";
export type { AgSlot, AgTile, SbChip } from "./tactile.ts";

/** The D-1 verdict register (docs/handover/14_feedback_register.md, G-D gate):
 *  fixed words, never randomized; wrong = a calm dark pill, never red — failure
 *  changes pace, not tone (Law 3). */
const TIER_STYLE: Record<Tier, { bg: string; label: string }> = {
  correct: { bg: "var(--correct)", label: "Stark!" },
  partial: { bg: "var(--partial)", label: "Fast!" },
  close: { bg: "var(--accent)", label: "Knapp!" },
  wrong: { bg: "var(--ink)", label: "Schau her:" },
};

// ---- the trap registry context (D-2 → D-1) --------------------------------

/** Student-facing slice of one trap-registry@1 entry (nameDe/icon/oneLinerDe). */
export interface TrapInfo {
  nameDe: string;
  icon: string;
  oneLinerDe: string;
}
export type TrapMap = Record<string, TrapInfo>;

const TrapContext = createContext<TrapMap>({});

/** Mounted once (root layout) with the server-loaded trap registry so every
 *  task surface can name the kind-of-wrong. Absent provider = no trap lines. */
export function TrapProvider({ traps, children }: { traps: TrapMap; children: ReactNode }) {
  return <TrapContext.Provider value={traps}>{children}</TrapContext.Provider>;
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic shuffle (seeded by item id) so SSR + client agree (no hydration drift). */
function useShuffled<T>(arr: T[], seed: string): T[] {
  return useMemo(() => {
    let state = hash(seed) || 1;
    const next = () => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 0xffffffff;
    };
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [out[i], out[j]] = [out[j]!, out[i]!];
    }
    return out;
  }, [arr, seed]);
}

const card: CSSProperties = {
  border: "1px solid var(--card-border)",
  borderRadius: 16,
  padding: 16,
  background: "var(--card)",
  boxShadow: "var(--shadow-card)",
  fontFamily: "var(--font-body)",
  color: "var(--text)",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};
const metaLabel: CSSProperties = {
  fontFamily: "var(--font-label)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--muted)",
};

function FeedbackBar({ tier, xp, hideXp }: { tier: Tier; xp: number; hideXp?: boolean }) {
  const s = TIER_STYLE[tier];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ background: s.bg, color: "#fff", borderRadius: 999, padding: "3px 13px", fontWeight: 700, fontSize: 14, fontFamily: "var(--font-label)" }}>
        {s.label}
      </span>
      {!hideXp && <span style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 600 }}>+{xp} XP</span>}
      {!hideXp && breaksCombo(tier) && <span style={{ color: "var(--muted)", fontSize: 13 }}>· combo reset</span>}
    </div>
  );
}

/** The correct answer with the changed parts made visible against the student's
 *  input (D-1 "Check" moment): their words struck through softly, the correct
 *  words bold — the explicit contrast, computed, never authored. */
function AnswerDiff({ input, answer }: { input: string; answer: string }) {
  const toks = diffWords(input, answer);
  // A diff that keeps nothing in common teaches nothing — show the answer plain.
  if (!toks.some((t) => t.type === "same")) {
    return <div style={{ fontSize: 15, color: "var(--text)" }}>Answer: <strong>{answer}</strong></div>;
  }
  return (
    <div style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.6 }}>
      {toks.map((t, i) => {
        if (t.type === "del") {
          return <span key={i} style={{ textDecoration: "line-through", color: "var(--muted)", marginRight: 5 }}>{t.text}</span>;
        }
        if (t.type === "ins") {
          return <strong key={i} style={{ background: "var(--accent-soft)", borderRadius: 4, padding: "0 3px", marginRight: 5 }}>{t.text}</strong>;
        }
        return <span key={i} style={{ marginRight: 5 }}>{t.text}</span>;
      })}
    </div>
  );
}

/**
 * The D-1 Feedback Card — the fixed post-answer moment (~one breath to consume):
 * verdict word → the correction as a computed diff → the trap named in kid-German
 * (when `classifyWrong` is confident) → the re-encounter promise. One tier chime
 * fires through @domigo/game-feel (opt-in, default OFF — silent in class).
 * Decoration never gates content: everything renders frame 0.
 */
function FeedbackCard({ tier, xp, hideXp, item, input, correct, others, explainDe }: {
  tier: Tier;
  xp: number;
  hideXp?: boolean;
  /** answers view for the trap classifier (grammar item / vocab carrier pool) */
  item: ClassifiableItem;
  /** the student's typed text, null for choice/matching/sort inputs */
  input: string | null;
  /** the first full answer (diff target) */
  correct: string;
  /** remaining accepted answers, shown after the diff */
  others?: string[];
  explainDe?: string | null;
}) {
  const traps = useContext(TrapContext);
  useEffect(() => { playTier(tier); }, [tier]);
  const trapId = tier === "wrong" && input !== null && input.trim() !== "" ? classifyWrong(item, input) : null;
  const trap = trapId !== null ? traps[trapId] : undefined;
  const showDiff = tier !== "correct" && correct !== "" && input !== null && input.trim() !== "";
  return (
    <div role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <FeedbackBar tier={tier} xp={xp} hideXp={hideXp} />
      {showDiff && <AnswerDiff input={input} answer={correct} />}
      {tier !== "correct" && !showDiff && correct !== "" && (
        <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>Answer: <strong>{correct}</strong></div>
      )}
      {tier !== "correct" && others !== undefined && others.length > 0 && (
        <div style={{ fontSize: 13, color: "var(--muted)" }}>auch richtig: {others.join("  /  ")}</div>
      )}
      {trap && (
        <div style={{ fontSize: 14, color: "var(--text)", background: "var(--bg-sunken)", border: "1px solid var(--card-border)", borderRadius: 10, padding: "7px 11px" }}>
          <span aria-hidden="true" style={{ marginRight: 6 }}>{trap.icon}</span>
          <strong>{trap.nameDe}</strong> — {trap.oneLinerDe}
        </div>
      )}
      {tier === "wrong" && <div style={{ fontSize: 13, color: "var(--accent-deep)", fontWeight: 600 }}>Das kommt gleich nochmal!</div>}
      {explainDe && <div style={{ fontSize: 13, color: "var(--muted)" }}>{explainDe}</div>}
    </div>
  );
}

function GlossRow({ gloss }: { gloss: Gloss[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  if (gloss.length === 0) return null;
  return (
    <div style={{ fontSize: 13 }}>
      <button className="dg-chip" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {open ? "Hide" : "Show"} word help ({gloss.length})
      </button>
      {open && (
        <ul id={id} style={{ margin: "6px 0 0", paddingLeft: 18, color: "var(--text-secondary)" }}>
          {gloss.map((g, i) => (
            <li key={i}>
              <strong>{g.word}</strong> = {g.de}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HintRow({ hintDe }: { hintDe: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div style={{ fontSize: 13 }}>
      <button className="dg-chip" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {open ? "Hide Tipp" : "💡 Tipp"}
      </button>
      {open && <span id={id} style={{ marginLeft: 8, color: "#92400e" }}>{hintDe}</span>}
    </div>
  );
}

function Prompt({ text, id }: { text: string; id?: string }) {
  return <div id={id} style={{ fontSize: 18, lineHeight: 1.4, whiteSpace: "pre-wrap", color: "var(--text)" }}>{text}</div>;
}

// ---- format-specific inputs ----------------------------------------------

function TextInputs({ count, values, onChange, disabled, onEnter, autoFocusFirst }: {
  count: number; values: string[]; onChange: (v: string[]) => void; disabled: boolean; onEnter?: () => void; autoFocusFirst?: boolean;
}) {
  const firstRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (autoFocusFirst && !disabled) firstRef.current?.focus(); }, [autoFocusFirst, disabled]);
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {Array.from({ length: count }, (_, i) => (
        <input
          key={i}
          ref={i === 0 ? firstRef : undefined}
          className="dg-input"
          style={{ minWidth: 120, flex: count > 1 ? "1 1 120px" : undefined }}
          value={values[i] ?? ""}
          disabled={disabled}
          aria-label={count > 1 ? `Blank ${i + 1}` : "Your answer"}
          placeholder={count > 1 ? `Blank ${i + 1}` : "Your answer"}
          onKeyDown={(e) => { if (e.key === "Enter" && !disabled) { e.preventDefault(); onEnter?.(); } }}
          onChange={(e) => {
            const next = [...values];
            next[i] = e.target.value;
            onChange(next);
          }}
        />
      ))}
    </div>
  );
}

function Choices({ options, selected, onSelect, disabled, corrects }: {
  options: string[]; selected: string | null; onSelect: (v: string) => void; disabled: boolean; corrects: string[];
}) {
  return (
    <div role="radiogroup" aria-label="Answer options" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map((opt) => {
        const isSel = selected === opt;
        // After grading, reveal: the right answer goes green; a wrong pick goes red.
        const tintClass = disabled
          ? corrects.includes(opt) ? " correct" : isSel ? " wrong" : ""
          : "";
        const selStyle: CSSProperties | undefined = isSel && !disabled
          ? { borderColor: "var(--accent)", background: "var(--accent-soft)" }
          : undefined;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={isSel}
            disabled={disabled}
            className={`dg-mc-option${tintClass}`}
            style={selStyle}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Dropdowns({ rows, options, value, onChange, disabled }: {
  rows: string[]; options: string[]; value: Record<string, string>; onChange: (v: Record<string, string>) => void; disabled: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {rows.map((row) => (
        <div key={row} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ minWidth: 120, fontWeight: 600 }}>{row}</span>
          <span aria-hidden="true" style={{ color: "var(--muted)" }}>→</span>
          <select
            className="dg-input"
            style={{ minWidth: 140 }}
            disabled={disabled}
            aria-label={`${row}: choose`}
            value={value[row] ?? ""}
            onChange={(e) => onChange({ ...value, [row]: e.target.value })}
          >
            <option value="">…</option>
            {options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

// ---- grammar item --------------------------------------------------------

const TEXT_FORMATS = new Set([
  "gap-fill", "translation", "transformation", "error-correction",
  "question-formation", "free-form", "sentence-building", "anagram",
]);

/** The graded input + item id, surfaced to the parent for attempt recording. */
export type ResultDetail =
  | { kind: "grammar"; itemId: string; input: GrammarInput }
  | { kind: "vocab"; itemId: string; input: { kind: "vocab"; value: string } };

/** Forgiving-retry ladder (Law 3): a wrong answer re-enables the input — nothing
 *  shown lost — up to MAX_WRONG tries (1st wrong → try again, 2nd → the Tipp is
 *  revealed, 3rd → the answer is shown). Only the TERMINAL outcome (a pass, or the
 *  final wrong) is reported via onResult, so every host still sees exactly one
 *  "task concluded" per item — now after the student's retries. Shared by both views. */
const MAX_WRONG = 3;

function useRetryGrading(
  gradeOnce: () => { tier: Tier; detail: ResultDetail },
  onResult?: (tier: Tier, detail: ResultDetail) => void,
) {
  const [tier, setTier] = useState<Tier | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const solved = tier !== null && tier !== "wrong";
  const exhausted = wrongCount >= MAX_WRONG;
  const done = solved || exhausted; // locked: inputs disabled, feedback shown
  const retrying = tier === "wrong" && !exhausted; // open for another try
  const submit = () => {
    if (done) return;
    const { tier: t, detail } = gradeOnce();
    setTier(t);
    if (t !== "wrong") {
      onResult?.(t, detail); // a pass concludes the task
      return;
    }
    const n = wrongCount + 1;
    setWrongCount(n);
    if (n >= MAX_WRONG) onResult?.(t, detail); // out of tries → conclude (never blocks)
  };
  return { tier, wrongCount, done, retrying, submit };
}

/** Intermediate-wrong feedback shown before the task locks: a calm retry nudge
 *  in the du-form register (never red, never "Falsch" — Law 3 as tone), with the
 *  German Tipp surfaced from the 2nd try. */
function RetryNudge({ wrongCount, hintDe }: { wrongCount: number; hintDe: string }) {
  return (
    <div role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ color: "var(--ink-soft)", fontWeight: 700, fontSize: 14 }}>↻ Noch nicht — versuch es gleich nochmal.</span>
      {wrongCount >= 2 && hintDe && (
        <div style={{ fontSize: 13, color: "#92400e", background: "#fef3c7", borderRadius: 8, padding: "6px 10px" }}>💡 {hintDe}</div>
      )}
    </div>
  );
}

// ---- the tactile task layer (ALIVE-T T1/T2) --------------------------------
// Letter tiles + word chips ASSEMBLE TEXT into the same state the keyboard
// writes — one GrammarInput, one grading path (Law 5). Deterministic tile
// order (seeded by item id, Law 9). The visible "Type instead" chip swaps to
// the classic inputs forever — tactile is an offer, never a wall.

const tileBtn: CSSProperties = {
  minWidth: 44, height: 44, padding: "0 10px", borderRadius: 10, fontSize: 18, fontWeight: 700,
  border: "1px solid var(--card-border)", background: "var(--bg-sunken)", color: "var(--text)",
  cursor: "pointer", fontFamily: "var(--font-body)", touchAction: "manipulation",
};
const slotBox: CSSProperties = {
  width: 34, height: 44, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center",
  fontSize: 20, fontWeight: 700, fontFamily: "var(--font-body)",
};
const srOnly: CSSProperties = {
  position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden",
  clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0,
};

/** T1 · anagram letter-tile tray: tap tiles to fill slots; tapping a filled
 *  slot pops it AND everything after it (the v1 spelling-bee ergonomic);
 *  apostrophes/hyphens are fixed, pre-filled slots. Backspace pops, Enter checks. */
function AnagramTray({ answer, seed, disabled, onChange, onEnter }: {
  answer: string; seed: string; disabled: boolean; onChange: (assembled: string) => void; onEnter: () => void;
}) {
  const slots = useMemo(() => agSlots(answer), [answer]);
  const tiles = useMemo(() => agTiles(answer, seed), [answer, seed]);
  const letterSlots = useMemo(() => slots.filter((s) => s.fixed === null).length, [slots]);
  const [placed, setPlaced] = useState<number[]>([]); // tile indices, in placement order

  const emit = (p: number[]) => {
    const chars: Array<string | null> = Array.from({ length: letterSlots }, (_, i) => (i < p.length ? tiles[p[i]!]!.ch : null));
    onChange(agAssemble(slots, chars));
  };
  const place = (ti: number) => {
    if (disabled || placed.includes(ti) || placed.length >= letterSlots) return;
    const p = [...placed, ti];
    setPlaced(p);
    emit(p);
  };
  const popTo = (k: number) => {
    if (disabled) return;
    const p = placed.slice(0, k);
    setPlaced(p);
    emit(p);
  };

  let letterIdx = -1;
  const assembled = agAssemble(slots, placed.map((ti) => tiles[ti]!.ch));
  return (
    <div
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Backspace" && placed.length > 0) { e.preventDefault(); popTo(placed.length - 1); }
        if (e.key === "Enter") { e.preventDefault(); onEnter(); }
      }}
    >
      <div aria-label="Your letters so far" style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
        {slots.map((s, i) => {
          if (s.fixed !== null) {
            return <span key={i} aria-hidden="true" style={{ ...slotBox, color: "var(--muted)" }}>{s.fixed}</span>;
          }
          letterIdx += 1;
          const k = letterIdx;
          const ti = placed[k];
          return ti !== undefined ? (
            <button key={i} type="button" aria-label={`Remove letter ${tiles[ti]!.ch}`} disabled={disabled} onClick={() => popTo(k)}
              style={{ ...slotBox, border: "1px solid var(--accent)", background: "var(--accent-soft)", color: "var(--ink)", cursor: "pointer" }}>
              {tiles[ti]!.ch}
            </button>
          ) : (
            <span key={i} aria-hidden="true" style={{ ...slotBox, borderBottom: "2px solid var(--card-border)", background: "var(--bg-sunken)" }} />
          );
        })}
      </div>
      <div role="group" aria-label="Letter tiles" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {tiles.map((t, ti) => (
          <button key={t.key} type="button" aria-label={`Letter ${t.ch}`} disabled={disabled || placed.includes(ti)} onClick={() => place(ti)}
            style={{ ...tileBtn, opacity: placed.includes(ti) ? 0.25 : 1 }}>
            {t.ch}
          </button>
        ))}
      </div>
      <span role="status" aria-live="polite" style={srOnly}>{assembled === "" ? "" : `So far: ${assembled}`}</span>
    </div>
  );
}

/** T2 · sentence-building word-chip builder: tap tray chips to append, tap a
 *  chip in the sentence to send it back. Punctuation never rides the tray
 *  (grade-neutral — the reveal shows the full sentence). */
function ChipBuilder({ promptText, disabled, onChange, onEnter }: {
  promptText: string; disabled: boolean; onChange: (assembled: string) => void; onEnter: () => void;
}) {
  const chips = useMemo(() => sbChips(promptText), [promptText]);
  const [chosen, setChosen] = useState<number[]>([]);

  const emit = (c: number[]) => onChange(c.map((i) => chips[i]!.text).join(" "));
  const add = (i: number) => {
    if (disabled || chosen.includes(i)) return;
    const c = [...chosen, i];
    setChosen(c);
    emit(c);
  };
  const removeAt = (k: number) => {
    if (disabled) return;
    const c = chosen.filter((_, idx) => idx !== k);
    setChosen(c);
    emit(c);
  };

  const assembled = chosen.map((i) => chips[i]!.text).join(" ");
  return (
    <div
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Backspace" && chosen.length > 0) { e.preventDefault(); removeAt(chosen.length - 1); }
        if (e.key === "Enter") { e.preventDefault(); onEnter(); }
      }}
    >
      <div aria-label="Your sentence so far" style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", minHeight: 48, padding: "6px 10px", borderRadius: 12, border: "1px solid var(--card-border)", background: "var(--bg-sunken)", marginBottom: 8 }}>
        {chosen.map((i, k) => (
          <button key={`${chips[i]!.key}@${k}`} type="button" aria-label={`Remove word ${chips[i]!.text}`} disabled={disabled} onClick={() => removeAt(k)}
            style={{ ...tileBtn, height: 36, fontSize: 15, border: "1px solid var(--accent)", background: "var(--accent-soft)", color: "var(--ink)" }}>
            {chips[i]!.text}
          </button>
        ))}
        {!disabled && chosen.length < chips.length && (
          <span aria-hidden="true" style={{ color: "var(--muted)", fontSize: 18, animation: undefined }}>▏</span>
        )}
      </div>
      <div role="group" aria-label="Word chips" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {chips.map((chip, i) => (
          <button key={chip.key} type="button" aria-label={`Add word ${chip.text}`} disabled={disabled || chosen.includes(i)} onClick={() => add(i)}
            style={{ ...tileBtn, height: 40, fontSize: 15, opacity: chosen.includes(i) ? 0.25 : 1 }}>
            {chip.text}
          </button>
        ))}
      </div>
      <span role="status" aria-live="polite" style={srOnly}>{assembled === "" ? "" : `So far: ${assembled}`}</span>
    </div>
  );
}

export function GrammarItemView({ item, onResult, hideHint, autoFocus, hideXp, tactile }: { item: GrammarItem; onResult?: (tier: Tier, detail: ResultDetail) => void; hideHint?: boolean; autoFocus?: boolean; hideXp?: boolean; tactile?: boolean }) {
  const promptId = useId();
  const firstFull = item.answers.find((a) => a.tier === "full")?.text ?? "";
  const blankCount = Math.max(1, firstFull.split("|").length);
  const fullAnswers = useMemo(() => item.answers.filter((a) => a.tier === "full").map((a) => a.text), [item.answers]);
  const choiceOptions = useShuffled(
    [...new Set([...fullAnswers, ...item.distractors])],
    item.id,
  );
  const matchRights = useShuffled(item.pairs.map((p) => p.right), item.id);
  const sortMembers = useShuffled(item.groups.flatMap((g) => g.members), item.id);
  const groupLabels = item.groups.map((g) => g.label);

  const [text, setText] = useState<string[]>([]);
  const [choice, setChoice] = useState<string | null>(null);
  const [map, setMap] = useState<Record<string, string>>({});

  const isChoice = item.format === "multiple-choice" || item.format === "context-picker";
  const isMatch = item.format === "matching" || item.format === "matching-pairs";
  const isGroup = item.format === "group-sort";

  const gradeOnce = (): { tier: Tier; detail: ResultDetail } => {
    let input: GrammarInput;
    if (isChoice) input = { kind: "choice", value: choice ?? "" };
    else if (isMatch) input = { kind: "matching", value: map };
    else if (isGroup) input = { kind: "groupSort", value: map };
    else input = { kind: "text", value: text.join(" | ") };
    const r = gradeGrammar(item, input);
    return { tier: r.tier, detail: { kind: "grammar", itemId: item.id, input } };
  };
  const { tier, wrongCount, done, retrying, submit } = useRetryGrading(gradeOnce, onResult);

  const xp = tier ? xpForTier(item.difficulty * 10, tier) : 0;
  const isText = TEXT_FORMATS.has(item.format);
  // T1/T2: the tactile renderers apply to single-blank anagram/sentence-building
  // with an authored answer; "Type instead" falls back to the classic inputs.
  const [typeInstead, setTypeInstead] = useState(false);
  const tactileMode =
    tactile === true && !typeInstead && blankCount === 1 && fullAnswers.length > 0 && (item.format === "anagram" || item.format === "sentence-building")
      ? item.format
      : null;

  return (
    <div style={card} role="group" aria-labelledby={promptId}>
      <div style={metaLabel}>{item.format} · level {item.difficulty}</div>
      <Prompt id={promptId} text={item.prompt.text} />
      {isChoice && <Choices options={choiceOptions} selected={choice} onSelect={setChoice} disabled={done} corrects={fullAnswers} />}
      {isMatch && <Dropdowns rows={item.pairs.map((p) => p.left)} options={matchRights} value={map} onChange={setMap} disabled={done} />}
      {isGroup && <Dropdowns rows={sortMembers} options={groupLabels} value={map} onChange={setMap} disabled={done} />}
      {isText && tactileMode === null && <TextInputs count={blankCount} values={text} onChange={setText} disabled={done} onEnter={submit} autoFocusFirst={autoFocus} />}
      {tactileMode === "anagram" && (
        <AnagramTray answer={fullAnswers[0]!} seed={item.id} disabled={done} onChange={(a) => setText([a])} onEnter={submit} />
      )}
      {tactileMode === "sentence-building" && (
        <ChipBuilder promptText={item.prompt.text} disabled={done} onChange={(a) => setText([a])} onEnter={submit} />
      )}
      {tactileMode !== null && !done && (
        <button className="dg-chip" style={{ alignSelf: "flex-start" }} onClick={() => setTypeInstead(true)}>⌨️ Type instead</button>
      )}
      <GlossRow gloss={item.gloss} />
      {!hideHint && <HintRow hintDe={item.hintDe} />}
      {!done && <button className="dg-btn" style={{ alignSelf: "flex-start" }} onClick={submit}>{wrongCount > 0 ? "Try again" : "Check"}</button>}
      {retrying && <RetryNudge wrongCount={wrongCount} hintDe={item.hintDe} />}
      {done && tier && (
        <FeedbackCard
          tier={tier}
          xp={xp}
          hideXp={hideXp}
          item={item}
          input={isText ? text.join(" | ") : null}
          correct={fullAnswers[0] ?? ""}
          others={fullAnswers.slice(1)}
          explainDe={item.explainDe}
        />
      )}
    </div>
  );
}

// ---- vocab item ----------------------------------------------------------

export function VocabItemView({ item, onResult, hideHint, autoFocus, hideXp }: { item: VocabItem; onResult?: (tier: Tier, detail: ResultDetail) => void; hideHint?: boolean; autoFocus?: boolean; hideXp?: boolean }) {
  const promptId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const gradeOnce = (): { tier: Tier; detail: ResultDetail } => {
    const r = gradeVocab(item, value);
    return { tier: r.tier, detail: { kind: "vocab", itemId: item.id, input: { kind: "vocab", value } } };
  };
  const { tier, wrongCount, done, retrying, submit } = useRetryGrading(gradeOnce, onResult);
  useEffect(() => { if (autoFocus && !done) inputRef.current?.focus(); }, [autoFocus, done, wrongCount]);
  const xp = tier ? xpForTier(item.difficulty * 10, tier) : 0;
  const fullAnswers = item.sAnswers.filter((a) => a.tier === "full").map((a) => a.text);
  return (
    <div style={card} role="group" aria-labelledby={promptId}>
      <div style={metaLabel}>vocab · level {item.difficulty}</div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>{item.d}</div>
      <Prompt id={promptId} text={item.s} />
      <input ref={inputRef} className="dg-input" style={{ minWidth: 120 }} value={value} disabled={done} aria-label="Your answer" placeholder="Your answer" onKeyDown={(e) => { if (e.key === "Enter" && !done) { e.preventDefault(); submit(); } }} onChange={(e) => setValue(e.target.value)} />
      <GlossRow gloss={item.gloss} />
      {!hideHint && <HintRow hintDe={item.hintDe} />}
      {!done && <button className="dg-btn" style={{ alignSelf: "flex-start" }} onClick={submit}>{wrongCount > 0 ? "Try again" : "Check"}</button>}
      {retrying && <RetryNudge wrongCount={wrongCount} hintDe={item.hintDe} />}
      {done && tier && (
        <>
          <FeedbackCard
            tier={tier}
            xp={xp}
            hideXp={hideXp}
            item={{ answers: item.sAnswers }}
            input={value}
            correct={fullAnswers[0] ?? ""}
            others={fullAnswers.slice(1)}
          />
          <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            {item.w} — <strong>{item.g}</strong>
          </div>
        </>
      )}
    </div>
  );
}

// ---- teaching views (non-graded study-path intro nodes) ------------------

/** Vocabulary intro — the unit word bank as a study list, grouped by theme. */
export function VocabIntroView({ wordbank }: { wordbank: WordBank }) {
  const groups = new Map<string, WordBank["entries"]>();
  for (const e of wordbank.entries) {
    const key = e.theme ?? "Words";
    const arr = groups.get(key) ?? [];
    arr.push(e);
    groups.set(key, arr);
  }
  return (
    <div style={{ ...card, gap: 14 }}>
      <div style={metaLabel}>Word bank · {wordbank.entries.length} words</div>
      {[...groups.entries()].map(([theme, entries]) => (
        <div key={theme}>
          {theme !== "Words" && (
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-secondary)", marginBottom: 4 }}>{theme}</div>
          )}
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text)", fontSize: 15, lineHeight: 1.6 }}>
            {entries.map((e) => (
              <li key={e.id}>
                <strong>{e.en}</strong> — {e.de.join(" / ")}
                {e.exampleSb && <span style={{ color: "var(--muted)", fontSize: 13 }}> · “{e.exampleSb}”</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Grammar intro — the unit's structures, taught in German with bilingual examples.
 *  Student-safe: shows nameDe + the German rule text + examples; never the
 *  teacher-facing English `name`/`category`/`description`. */
export function GrammarIntroView({ structures }: { structures: GrammarStructure[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {structures.map((s) => (
        <div key={s.id} style={{ ...card, gap: 10 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>{s.nameDe}</div>
          {s.rules.map((r) => (
            <div key={r.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.4 }}>{r.de}</div>
              {r.examples.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
                  {r.examples.map((ex, i) => (
                    <li key={i}>
                      <strong>{ex.en}</strong>
                      {ex.de && ex.de !== ex.en ? ` — ${ex.de}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ---- listening (B3): audio player + task view ----------------------------

/** A listening task as sent to the client — transcript stripped server-side. */
export type ClientListeningTask = Omit<ListeningTask, "transcript">;

/** Plays a clip: prefers a pre-generated file, else speaks the script via Web Speech (A1–A2 pace). */
export function AudioClip({ audio }: { audio: AudioRef }) {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => setReady(true), []);

  const play = () => {
    if (audio.file) {
      const el = new Audio(audio.file);
      el.onended = () => setPlaying(false);
      setPlaying(true);
      void el.play().catch(() => setPlaying(false));
      return;
    }
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(audio.script);
    u.lang = "en-GB";
    u.rate = 0.85; // slowed for A1–A2 listeners
    if (audio.voice) {
      const v = window.speechSynthesis.getVoices().find((x) => x.name === audio.voice);
      if (v) u.voice = v;
    }
    u.onend = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(u);
  };
  const stop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const supported = ready && (!!audio.file || (typeof window !== "undefined" && "speechSynthesis" in window));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button className="dg-btn" onClick={play} disabled={!supported || playing}>
        ▶ {playing ? "Playing…" : "Play audio"}
      </button>
      {playing && (
        <button className="dg-btn-secondary" onClick={stop}>Stop</button>
      )}
      {ready && !supported && <span style={{ fontSize: 13, color: "var(--muted)" }}>Audio unavailable on this device.</span>}
    </div>
  );
}

/** One listening task: heading + audio + its comprehension items (graded via GrammarItemView). */
export function ListeningTaskView({ task, onResult }: {
  task: ClientListeningTask;
  onResult?: (tier: Tier, detail: ResultDetail) => void;
}) {
  return (
    <div style={{ ...card, gap: 14 }}>
      <h3 style={{ fontSize: 17, margin: 0, fontFamily: "var(--font-display)" }}>{task.titleDe}</h3>
      <AudioClip audio={task.audio} />
      {task.items.map((it) => (
        <GrammarItemView key={it.id} item={it as unknown as GrammarItem} onResult={onResult} />
      ))}
    </div>
  );
}
