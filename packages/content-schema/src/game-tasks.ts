/**
 * gameTasks@2 — the Painted-Book in-game task contract (PB-T6, Opus build lane).
 *
 * Supersedes the inline gameTasks@1 (choice|typed only, in apps/web/lib/
 * paint-content.ts). Lives in @domigo/content-schema — SHARED, not server-only —
 * so the client card kit (packages/game-paint/src/cards) imports these types and
 * the pure projection without a server-only cycle; the server loader imports the
 * zod schema for load-time validation.
 *
 * Design (frozen: docs/design/g1/paint/ch01-dossiers/tasks.md + README G1–G13):
 *  - kind is a DISCRIMINATED UNION. ch01 uses: choice · wheel · spell · order ·
 *    oddone · mistake · typed · memory. match/sort/slider are deferred to
 *    ch02/03/04 (G12) and join the union when those chapters build.
 *  - stimulus is REQUIRED (F22/G10): every card must state what on screen carries
 *    the answer — a story line, a painted image, or the encountered creature.
 *  - firstLetter/length are DERIVED from answer at render (deriveGapHints), never
 *    authored — killing the v1 drift class.
 *  - cross-field laws live ONCE in taskInvariantErrors(), reused by the zod
 *    superRefine AND scripts/check-game-tasks.mjs (guardrails by construction).
 */
import { z } from "zod";

// ── stimulus: the on-screen carrier of the answer (the F22/G10 law) ──────────
export const TaskStimulus = z.discriminatedUnion("type", [
  // the German story line (storyDe) is the whole context
  z.object({ type: z.literal("text") }),
  // a painted picture is the context (stem = the pb-* art stem; altDe describes it
  // for the blind-solve projection + accessibility)
  z.object({ type: z.literal("image"), stem: z.string().min(1), altDe: z.string().min(1) }),
  // the encountered creature displays a datum (e.g. the moth carrying its number)
  z.object({ type: z.literal("entity"), showsDe: z.string().min(1) }),
]);
export type TaskStimulus = z.infer<typeof TaskStimulus>;

export const TaskHints = z.object({
  deDesc: z.string().optional(), // shown at wrong-attempt 1 (the German description)
  deWord: z.string().optional(), // shown at wrong-attempt 2 (the German word/tip)
});
export type TaskHints = z.infer<typeof TaskHints>;

export const TASK_USES = ["quickfire", "encounter", "door", "rescue", "boss", "bonus"] as const;

// fields shared by every kind (spread into each member — discriminatedUnion needs
// plain object members, so cross-field checks live in taskInvariantErrors, not here)
const base = {
  id: z.string().min(1),
  use: z.enum(TASK_USES),
  stimulus: TaskStimulus,
  storyDe: z.string().min(1), // the German framing / instruction line (always present)
  promptEn: z.string().optional(), // the English question, when the task asks one
  hints: TaskHints.optional(),
  grounding: z.string().optional(), // author note (which unit item this exercises)
};

// ── the kinds ────────────────────────────────────────────────────────────────
const ChoiceTask = z.object({
  ...base,
  kind: z.literal("choice"),
  options: z.array(z.string().min(1)).length(3), // exactly 3, A1 load
  answer: z.string().min(1), // must be one of options (taskInvariantErrors)
});
const TypedTask = z.object({
  ...base,
  kind: z.literal("typed"),
  answer: z.string().min(1),
  accept: z.array(z.string().min(1)).default([]), // declared variants (rubber/eraser)
});
const SpellTask = z.object({
  ...base,
  kind: z.literal("spell"),
  answer: z.string().min(1), // a single token (no spaces)
  extraLetters: z.string().default(""), // distractor letters mixed into the tray
});
const OrderTask = z.object({
  ...base,
  kind: z.literal("order"),
  orderedChips: z.array(z.string().min(1)).min(2), // the answer IS this order
});
const OddOneTask = z.object({
  ...base,
  kind: z.literal("oddone"),
  select: z.enum(["odd", "all"]).default("odd"), // odd-one-out vs find-all-that-belong
  items: z.array(z.string().min(1)).min(3),
  correct: z.array(z.string().min(1)).min(1), // ⊆ items
});
const MistakeTask = z.object({
  ...base,
  kind: z.literal("mistake"),
  sentence: z.array(z.string().min(1)).min(2), // words/tokens, each tappable
  errorIndex: z.number().int().nonnegative(), // the wrong word's index
  fix: z.object({
    mode: z.enum(["replace", "remove", "add"]),
    correction: z.string().optional(), // required for replace/add
    insertAfter: z.number().int().optional(), // for add: insert after this index
  }),
  correctionOptions: z.array(z.string().min(1)).length(3).optional(), // the quick fix choices
});
const WheelTask = z.object({
  ...base,
  kind: z.literal("wheel"),
  variant: z.enum(["digit-to-word", "word-to-digit"]),
  shown: z.string().min(1), // the datum on the creature (the digit "13", or the word)
  values: z.array(z.string().min(1)).min(3), // the ring the student spins
  answer: z.string().min(1), // ∈ values
});
const MemoryTask = z.object({
  ...base,
  kind: z.literal("memory"),
  pairs: z.array(z.object({ a: z.string().min(1), b: z.string().min(1) })).min(3).max(8),
});

const GameTaskUnion = z.discriminatedUnion("kind", [
  ChoiceTask, TypedTask, SpellTask, OrderTask, OddOneTask, MistakeTask, WheelTask, MemoryTask,
]);
export type GameTaskV2 = z.infer<typeof GameTaskUnion>;
export type TaskKind = GameTaskV2["kind"];

/** The task schema — the discriminated union PLUS the cross-field invariants
 *  (taskInvariantErrors), so a single task self-validates, not only in a file. */
export const GameTaskV2 = GameTaskUnion.superRefine((t, ctx) => {
  for (const msg of taskInvariantErrors(t)) ctx.addIssue({ code: "custom", message: msg });
});

// ── the cross-field content laws (ONE source of truth) ───────────────────────
/** Semantic invariants zod's shape check can't express. Returns human-readable
 *  error strings (empty = clean). Called by the file superRefine AND the CLI. */
export function taskInvariantErrors(t: GameTaskV2): string[] {
  const errs: string[] = [];
  const dup = (a: readonly string[]): boolean => new Set(a).size !== a.length;
  switch (t.kind) {
    case "choice":
      if (!t.options.includes(t.answer)) errs.push("answer is not among the 3 options");
      if (dup(t.options)) errs.push("duplicate option");
      break;
    case "wheel":
      if (!t.values.includes(t.answer)) errs.push("answer is not on the wheel");
      if (dup(t.values)) errs.push("duplicate wheel value");
      break;
    case "spell":
      if (/\s/.test(t.answer)) errs.push("spell answer must be a single token (no spaces)");
      if (t.extraLetters.replace(/\s/g, "").length < 1) errs.push("spell needs ≥1 distractor letter");
      break;
    case "order":
      if (new Set(t.orderedChips).size < 2) errs.push("order needs ≥2 distinct chips");
      break;
    case "oddone":
      for (const c of t.correct) if (!t.items.includes(c)) errs.push(`correct "${c}" is not among items`);
      if (t.select === "odd" && t.correct.length !== 1) errs.push("select=odd needs exactly one correct");
      if (dup(t.items)) errs.push("duplicate item");
      break;
    case "mistake":
      if (t.errorIndex < 0 || t.errorIndex >= t.sentence.length) errs.push("errorIndex out of range");
      if ((t.fix.mode === "replace" || t.fix.mode === "add") && !t.fix.correction) errs.push(`fix.mode ${t.fix.mode} needs a correction`);
      if (t.fix.mode === "remove" && t.fix.correction) errs.push("fix.mode remove must not carry a correction");
      if (t.correctionOptions && t.fix.correction && !t.correctionOptions.includes(t.fix.correction)) errs.push("correctionOptions must include the correction");
      break;
    case "memory": {
      const as = t.pairs.map((p) => p.a);
      const bs = t.pairs.map((p) => p.b);
      if (dup(as) || dup(bs)) errs.push("memory pairs must be unique on both sides");
      break;
    }
    case "typed":
      break;
  }
  return errs;
}

// ── the file wrapper ─────────────────────────────────────────────────────────
export const GameTasksFileV2 = z
  .object({
    schema: z.literal("gameTasks@2"),
    chapter: z.string().regex(/^ch\d{2}$/),
    unit: z.string().min(1),
    note: z.string().optional(),
    items: z.array(GameTaskV2).min(1), // each item's invariants run via GameTaskV2's refine
  })
  .superRefine((file, ctx) => {
    // file-level law only: unique ids (per-item invariants already ran above)
    const ids = new Set<string>();
    file.items.forEach((it, i) => {
      if (ids.has(it.id)) ctx.addIssue({ code: "custom", message: `duplicate task id ${it.id}`, path: ["items", i] });
      ids.add(it.id);
    });
  });
export type GameTasksFileV2 = z.infer<typeof GameTasksFileV2>;

// ── derived hints (never authored — the anti-drift law) ──────────────────────
/** The gap-fill hint ladder data, derived from the answer:
 *  firstLetter (esc-1, shown IN the gap) + per-word letter counts (esc-2, the
 *  exact underline count Koki's F18 spec asks for). */
export function deriveGapHints(answer: string): { firstLetter: string; words: number[]; letters: number } {
  const trimmed = answer.trim();
  const words = trimmed.split(/\s+/).map((w) => (w.match(/\p{L}/gu) ?? []).length).filter((n) => n > 0);
  return { firstLetter: trimmed[0] ?? "", words, letters: words.reduce((a, b) => a + b, 0) };
}

// ── deterministic shuffle (shared: the projection == what the student sees) ──
/** FNV-1a-seeded Fisher–Yates. No Math.random (repo law); the card renderer and
 *  renderTaskText MUST use this same function+seed so a blind-solver sees the
 *  student's exact option order. */
export function seededShuffle<T>(arr: readonly T[], seed: string): T[] {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

// ── the blind-solve / golden text projection ─────────────────────────────────
/** A plain-text rendering of EXACTLY what a student sees at first sight — the
 *  single source consumed by the blind-solve agents, golden tests, and the
 *  authoring checker. Never leaks more than the screen shows. */
export function renderTaskText(t: GameTaskV2): string {
  const lines: string[] = [];
  if (t.stimulus.type === "image") lines.push(`[Bild: ${t.stimulus.altDe}]`);
  else if (t.stimulus.type === "entity") lines.push(`[${t.stimulus.showsDe}]`);
  lines.push(t.storyDe);
  if (t.promptEn) lines.push(t.promptEn);
  switch (t.kind) {
    case "choice":
      lines.push("Optionen: " + seededShuffle(t.options, t.id).join(" · "));
      break;
    case "typed":
      lines.push("(tippe die Antwort)");
      break;
    case "spell": {
      const tray = [...t.answer.replace(/\s/g, ""), ...t.extraLetters.replace(/\s/g, "")];
      lines.push("Buchstaben: " + seededShuffle(tray, t.id).map((c) => c.toUpperCase()).join(" "));
      break;
    }
    case "order":
      lines.push("Chips: " + seededShuffle(t.orderedChips, t.id).map((c) => `[${c}]`).join(" "));
      break;
    case "oddone":
      lines.push((t.select === "all" ? "Wähle alle passenden: " : "Was passt NICHT? ") + seededShuffle(t.items, t.id).join(" · "));
      break;
    case "mistake":
      lines.push("Satz: " + t.sentence.map((w, i) => `${i}:${w}`).join(" "));
      break;
    case "wheel":
      lines.push(`Rad zeigt „${t.shown}" → dreh auf: ` + t.values.join(" · "));
      break;
    case "memory":
      lines.push("Paare (verdeckt): " + t.pairs.map((p) => `${p.a}↔${p.b}`).join(" | "));
      break;
  }
  return lines.join("\n");
}
