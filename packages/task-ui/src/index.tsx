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
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { AudioRef, GrammarItem, GrammarStructure, Gloss, ListeningTask, VocabItem, WordBank } from "@domigo/content-schema";
import type { GrammarInput, Tier } from "@domigo/engine";
import { breaksCombo, gradeGrammar, gradeVocab, xpForTier } from "@domigo/engine";

const TIER_STYLE: Record<Tier, { bg: string; label: string }> = {
  correct: { bg: "var(--correct)", label: "Correct" },
  partial: { bg: "var(--partial)", label: "Partial" },
  close: { bg: "var(--accent)", label: "Close" },
  wrong: { bg: "var(--incorrect)", label: "Try again" },
};

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

/** Intermediate-wrong feedback shown before the task locks: a gentle "try again"
 *  (announced for screen readers), with the German Tipp surfaced from the 2nd try. */
function RetryNudge({ wrongCount, hintDe }: { wrongCount: number; hintDe: string }) {
  return (
    <div role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ color: "var(--incorrect)", fontWeight: 700, fontSize: 14 }}>Not quite — try again.</span>
      {wrongCount >= 2 && hintDe && (
        <div style={{ fontSize: 13, color: "#92400e", background: "#fef3c7", borderRadius: 8, padding: "6px 10px" }}>💡 {hintDe}</div>
      )}
    </div>
  );
}

export function GrammarItemView({ item, onResult, hideHint, autoFocus, hideXp }: { item: GrammarItem; onResult?: (tier: Tier, detail: ResultDetail) => void; hideHint?: boolean; autoFocus?: boolean; hideXp?: boolean }) {
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
  const correctText = fullAnswers.join("  /  ");

  return (
    <div style={card} role="group" aria-labelledby={promptId}>
      <div style={metaLabel}>{item.format} · level {item.difficulty}</div>
      <Prompt id={promptId} text={item.prompt.text} />
      {isChoice && <Choices options={choiceOptions} selected={choice} onSelect={setChoice} disabled={done} corrects={fullAnswers} />}
      {isMatch && <Dropdowns rows={item.pairs.map((p) => p.left)} options={matchRights} value={map} onChange={setMap} disabled={done} />}
      {isGroup && <Dropdowns rows={sortMembers} options={groupLabels} value={map} onChange={setMap} disabled={done} />}
      {TEXT_FORMATS.has(item.format) && <TextInputs count={blankCount} values={text} onChange={setText} disabled={done} onEnter={submit} autoFocusFirst={autoFocus} />}
      <GlossRow gloss={item.gloss} />
      {!hideHint && <HintRow hintDe={item.hintDe} />}
      {!done && <button className="dg-btn" style={{ alignSelf: "flex-start" }} onClick={submit}>{wrongCount > 0 ? "Try again" : "Check"}</button>}
      {retrying && <RetryNudge wrongCount={wrongCount} hintDe={item.hintDe} />}
      {done && tier && (
        <div role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <FeedbackBar tier={tier} xp={xp} hideXp={hideXp} />
          {tier !== "correct" && correctText && (
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>Answer: <strong>{correctText}</strong></div>
          )}
          {item.explainDe && <div style={{ fontSize: 13, color: "var(--muted)" }}>{item.explainDe}</div>}
        </div>
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
  const answer = item.sAnswers.filter((a) => a.tier === "full").map((a) => a.text).join("  /  ");
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
        <div role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <FeedbackBar tier={tier} xp={xp} hideXp={hideXp} />
          <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            {item.w} — <strong>{item.g}</strong>{tier !== "correct" && answer ? ` · answer: ${answer}` : ""}
          </div>
        </div>
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
