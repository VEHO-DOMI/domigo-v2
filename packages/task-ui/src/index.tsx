"use client";
/**
 * @domigo/task-ui — render + grade one approved item. Presentation-driven by the
 * item (not the route), so the games and Smart Review reuse these. Grading goes
 * through @domigo/engine; nothing here re-implements answer logic.
 */
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { GrammarItem, GrammarStructure, Gloss, VocabItem, WordBank } from "@domigo/content-schema";
import type { GrammarInput, Tier } from "@domigo/engine";
import { breaksCombo, gradeGrammar, gradeVocab, xpForTier } from "@domigo/engine";

const TIER_STYLE: Record<Tier, { bg: string; label: string }> = {
  correct: { bg: "#16a34a", label: "Correct" },
  partial: { bg: "#d97706", label: "Partial" },
  close: { bg: "#2563eb", label: "Close" },
  wrong: { bg: "#dc2626", label: "Try again" },
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
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};
const inputStyle: CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 16,
  minWidth: 120,
};
const btn: CSSProperties = {
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontSize: 15,
  cursor: "pointer",
  alignSelf: "flex-start",
};

function FeedbackBar({ tier, xp }: { tier: Tier; xp: number }) {
  const s = TIER_STYLE[tier];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ background: s.bg, color: "#fff", borderRadius: 999, padding: "3px 12px", fontWeight: 600, fontSize: 14 }}>
        {s.label}
      </span>
      <span style={{ color: "#374151", fontSize: 14 }}>+{xp} XP</span>
      {breaksCombo(tier) && <span style={{ color: "#9ca3af", fontSize: 13 }}>· combo reset</span>}
    </div>
  );
}

function GlossRow({ gloss }: { gloss: Gloss[] }) {
  const [open, setOpen] = useState(false);
  if (gloss.length === 0) return null;
  return (
    <div style={{ fontSize: 13 }}>
      <button onClick={() => setOpen((o) => !o)} style={{ ...btn, background: "#f1f5f9", color: "#334155", padding: "4px 10px", fontSize: 13 }}>
        {open ? "Hide" : "Show"} word help ({gloss.length})
      </button>
      {open && (
        <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "#475569" }}>
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
  return (
    <div style={{ fontSize: 13 }}>
      <button onClick={() => setOpen((o) => !o)} style={{ ...btn, background: "#fef3c7", color: "#92400e", padding: "4px 10px", fontSize: 13 }}>
        {open ? "Hide" : "Tipp"}
      </button>
      {open && <span style={{ marginLeft: 8, color: "#92400e" }}>{hintDe}</span>}
    </div>
  );
}

function Prompt({ text }: { text: string }) {
  return <div style={{ fontSize: 17, lineHeight: 1.4, whiteSpace: "pre-wrap" }}>{text}</div>;
}

// ---- format-specific inputs ----------------------------------------------

function TextInputs({ count, values, onChange, disabled }: {
  count: number; values: string[]; onChange: (v: string[]) => void; disabled: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {Array.from({ length: count }, (_, i) => (
        <input
          key={i}
          style={inputStyle}
          value={values[i] ?? ""}
          disabled={disabled}
          placeholder={count > 1 ? `Blank ${i + 1}` : "Your answer"}
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

function Choices({ options, selected, onSelect, disabled }: {
  options: string[]; selected: string | null; onSelect: (v: string) => void; disabled: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {options.map((opt) => (
        <label key={opt} style={{ display: "flex", gap: 8, alignItems: "center", cursor: disabled ? "default" : "pointer" }}>
          <input type="radio" checked={selected === opt} disabled={disabled} onChange={() => onSelect(opt)} />
          {opt}
        </label>
      ))}
    </div>
  );
}

function Dropdowns({ rows, options, value, onChange, disabled }: {
  rows: string[]; options: string[]; value: Record<string, string>; onChange: (v: Record<string, string>) => void; disabled: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {rows.map((row) => (
        <div key={row} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ minWidth: 120, fontWeight: 500 }}>{row}</span>
          <span>→</span>
          <select
            style={inputStyle}
            disabled={disabled}
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

export function GrammarItemView({ item, onResult, hideHint }: { item: GrammarItem; onResult?: (tier: Tier, detail: ResultDetail) => void; hideHint?: boolean }) {
  const firstFull = item.answers.find((a) => a.tier === "full")?.text ?? "";
  const blankCount = Math.max(1, firstFull.split("|").length);
  const choiceOptions = useShuffled(
    [...new Set([...item.answers.filter((a) => a.tier === "full").map((a) => a.text), ...item.distractors])],
    item.id,
  );
  const matchRights = useShuffled(item.pairs.map((p) => p.right), item.id);
  const sortMembers = useShuffled(item.groups.flatMap((g) => g.members), item.id);
  const groupLabels = item.groups.map((g) => g.label);

  const [text, setText] = useState<string[]>([]);
  const [choice, setChoice] = useState<string | null>(null);
  const [map, setMap] = useState<Record<string, string>>({});
  const [tier, setTier] = useState<Tier | null>(null);

  const isChoice = item.format === "multiple-choice" || item.format === "context-picker";
  const isMatch = item.format === "matching" || item.format === "matching-pairs";
  const isGroup = item.format === "group-sort";
  const done = tier !== null;

  const submit = () => {
    let input: GrammarInput;
    if (isChoice) input = { kind: "choice", value: choice ?? "" };
    else if (isMatch) input = { kind: "matching", value: map };
    else if (isGroup) input = { kind: "groupSort", value: map };
    else input = { kind: "text", value: text.join(" | ") };
    const r = gradeGrammar(item, input);
    setTier(r.tier);
    onResult?.(r.tier, { kind: "grammar", itemId: item.id, input });
  };

  const xp = tier ? xpForTier(item.difficulty * 10, tier) : 0;
  const correctText = item.answers.filter((a) => a.tier === "full").map((a) => a.text).join("  /  ");

  return (
    <div style={card}>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>{item.format} · level {item.difficulty}</div>
      <Prompt text={item.prompt.text} />
      {isChoice && <Choices options={choiceOptions} selected={choice} onSelect={setChoice} disabled={done} />}
      {isMatch && <Dropdowns rows={item.pairs.map((p) => p.left)} options={matchRights} value={map} onChange={setMap} disabled={done} />}
      {isGroup && <Dropdowns rows={sortMembers} options={groupLabels} value={map} onChange={setMap} disabled={done} />}
      {TEXT_FORMATS.has(item.format) && <TextInputs count={blankCount} values={text} onChange={setText} disabled={done} />}
      <GlossRow gloss={item.gloss} />
      {!hideHint && <HintRow hintDe={item.hintDe} />}
      {!done && <button style={btn} onClick={submit}>Check</button>}
      {done && tier && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <FeedbackBar tier={tier} xp={xp} />
          {tier !== "correct" && correctText && (
            <div style={{ fontSize: 14, color: "#374151" }}>Answer: <strong>{correctText}</strong></div>
          )}
          {item.explainDe && <div style={{ fontSize: 13, color: "#6b7280" }}>{item.explainDe}</div>}
        </div>
      )}
    </div>
  );
}

// ---- vocab item ----------------------------------------------------------

export function VocabItemView({ item, onResult, hideHint }: { item: VocabItem; onResult?: (tier: Tier, detail: ResultDetail) => void; hideHint?: boolean }) {
  const [value, setValue] = useState("");
  const [tier, setTier] = useState<Tier | null>(null);
  const done = tier !== null;
  const submit = () => {
    const r = gradeVocab(item, value);
    setTier(r.tier);
    onResult?.(r.tier, { kind: "vocab", itemId: item.id, input: { kind: "vocab", value } });
  };
  const xp = tier ? xpForTier(item.difficulty * 10, tier) : 0;
  const answer = item.sAnswers.filter((a) => a.tier === "full").map((a) => a.text).join("  /  ");
  return (
    <div style={card}>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>vocab · level {item.difficulty}</div>
      <div style={{ fontSize: 14, color: "#475569" }}>{item.d}</div>
      <Prompt text={item.s} />
      <input style={inputStyle} value={value} disabled={done} placeholder="Your answer" onChange={(e) => setValue(e.target.value)} />
      <GlossRow gloss={item.gloss} />
      {!hideHint && <HintRow hintDe={item.hintDe} />}
      {!done && <button style={btn} onClick={submit}>Check</button>}
      {done && tier && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <FeedbackBar tier={tier} xp={xp} />
          <div style={{ fontSize: 14, color: "#374151" }}>
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
      <div style={{ fontSize: 12, color: "#94a3b8" }}>Word bank · {wordbank.entries.length} words</div>
      {[...groups.entries()].map(([theme, entries]) => (
        <div key={theme}>
          {theme !== "Words" && (
            <div style={{ fontWeight: 600, fontSize: 14, color: "#334155", marginBottom: 4 }}>{theme}</div>
          )}
          <ul style={{ margin: 0, paddingLeft: 18, color: "#0f172a", fontSize: 15, lineHeight: 1.6 }}>
            {entries.map((e) => (
              <li key={e.id}>
                <strong>{e.en}</strong> — {e.de.join(" / ")}
                {e.exampleSb && <span style={{ color: "#64748b", fontSize: 13 }}> · “{e.exampleSb}”</span>}
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
          <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>{s.nameDe}</div>
          {s.rules.map((r) => (
            <div key={r.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 15, color: "#0f172a", lineHeight: 1.4 }}>{r.de}</div>
              {r.examples.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 18, color: "#475569", fontSize: 14, lineHeight: 1.6 }}>
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
