// THE CARD KIT — pure state machines (PB-T7 / Build-B1). No React, no Phaser.
//
// Every task kind is a machine: init(task, seed) → state · act(state, action) →
// state · grade(state) → "pending"|"correct"|"wrong" · solve(state) → the
// winning action sequence (so parity tests + the harness drive the real solution
// against the ACTUAL shuffled tray). The painted React skins (a later sub-step)
// render a state and dispatch actions; they hold no game logic of their own.
//
// Determinism: every shuffle uses content-schema's seededShuffle keyed by the
// task id — the on-screen order is reproducible and matches renderTaskText.
import { type GameTaskV2, seededShuffle } from "@domigo/content-schema";

export type Grade = "pending" | "correct" | "wrong";

type Of<Kind extends GameTaskV2["kind"]> = Extract<GameTaskV2, { kind: Kind }>;

/** Normalise a typed/choice string answer for lenient comparison: lowercase,
 *  drop a leading article, strip spaces + terminal punctuation (schoolbag ==
 *  "a school book!"). Mirrors the v1 normTyped, extended for punctuation. */
export const normText = (s: string): string =>
  s.trim().toLowerCase().replace(/^(a|an|the)\s+/, "").replace(/[.!?,;:]/g, "").replace(/\s+/g, "");

export interface CardMachine<S, A> {
  init(task: GameTaskV2, seed?: string): S;
  act(state: S, action: A): S;
  grade(state: S): Grade;
  /** the winning action sequence from THIS state (its own shuffled tray). */
  solve(state: S): A[];
}

// ── choice ───────────────────────────────────────────────────────────────────
export type ChoiceState = { kind: "choice"; options: string[]; answer: string; picked: string | null };
export type ChoiceAction = { pick: string };
export const choiceMachine: CardMachine<ChoiceState, ChoiceAction> = {
  init(task, seed = task.id) {
    const t = task as Of<"choice">;
    return { kind: "choice", options: seededShuffle(t.options, seed), answer: t.answer, picked: null };
  },
  act: (s, a) => ({ ...s, picked: a.pick }),
  grade: (s) => (s.picked === null ? "pending" : s.picked === s.answer ? "correct" : "wrong"),
  solve: (s) => [{ pick: s.answer }],
};

// ── typed ────────────────────────────────────────────────────────────────────
export type TypedState = { kind: "typed"; answer: string; accept: string[]; value: string; submitted: boolean };
export type TypedAction = { input: string } | { submit: true };
export const typedMachine: CardMachine<TypedState, TypedAction> = {
  init(task) {
    const t = task as Of<"typed">;
    return { kind: "typed", answer: t.answer, accept: t.accept ?? [], value: "", submitted: false };
  },
  act: (s, a) => ("input" in a ? { ...s, value: a.input, submitted: false } : { ...s, submitted: true }),
  grade(s) {
    if (!s.submitted) return "pending";
    const ok = new Set([s.answer, ...s.accept].map(normText));
    return ok.has(normText(s.value)) ? "correct" : "wrong";
  },
  solve: (s) => [{ input: s.answer }, { submit: true }],
};

// ── spell (tap tray letters in order) ────────────────────────────────────────
export type SpellState = { kind: "spell"; tray: string[]; answer: string; used: number[] };
export type SpellAction = { tapTray: number } | { undo: true };
export const spellMachine: CardMachine<SpellState, SpellAction> = {
  init(task, seed = task.id) {
    const t = task as Of<"spell">;
    const tray = seededShuffle([...t.answer.replace(/\s/g, ""), ...t.extraLetters.replace(/\s/g, "")], seed);
    return { kind: "spell", tray, answer: t.answer.replace(/\s/g, ""), used: [] };
  },
  act(s, a) {
    if ("undo" in a) return { ...s, used: s.used.slice(0, -1) };
    if (s.used.includes(a.tapTray) || a.tapTray < 0 || a.tapTray >= s.tray.length) return s;
    return { ...s, used: [...s.used, a.tapTray] };
  },
  grade(s) {
    const word = s.used.map((i) => s.tray[i]).join("").toLowerCase();
    if (word.length < s.answer.length) return "pending";
    return word === s.answer.toLowerCase() ? "correct" : "wrong";
  },
  solve(s) {
    // greedily pick tray indices spelling the answer, left to right
    const out: SpellAction[] = [];
    const taken = new Set<number>();
    for (const ch of s.answer.toLowerCase()) {
      const i = s.tray.findIndex((c, idx) => !taken.has(idx) && c.toLowerCase() === ch);
      if (i >= 0) { taken.add(i); out.push({ tapTray: i }); }
    }
    return out;
  },
};
// ── spell VIEW-logic (pure; consumed by the skin AND its tests) ────────────────
// The skin shows EXACTLY answer-length slots and stops accepting taps once they
// are full, so a longer form ("a pen" over "pen") is physically unbuildable — the
// devil's-advocate fix. Kept here, next to the machine, so it is unit-testable in
// the node test env (no DOM) and can never silently drift from the skin.
export const spellSlots = (s: SpellState): (string | null)[] => {
  const built = s.used.map((i) => s.tray[i]!);
  return Array.from({ length: s.answer.length }, (_, i) => built[i] ?? null);
};
export const spellTrayDisabled = (s: SpellState, i: number): boolean =>
  s.used.includes(i) || s.used.length >= s.answer.length;

// ── order (tap chips into sequence) ──────────────────────────────────────────
export type OrderState = { kind: "order"; tray: string[]; target: string[]; seq: number[] };
export type OrderAction = { tapTray: number } | { undo: true };
export const orderMachine: CardMachine<OrderState, OrderAction> = {
  init(task, seed = task.id) {
    const t = task as Of<"order">;
    return { kind: "order", tray: seededShuffle(t.orderedChips, seed), target: t.orderedChips, seq: [] };
  },
  act(s, a) {
    if ("undo" in a) return { ...s, seq: s.seq.slice(0, -1) };
    if (s.seq.includes(a.tapTray) || a.tapTray < 0 || a.tapTray >= s.tray.length) return s;
    return { ...s, seq: [...s.seq, a.tapTray] };
  },
  grade(s) {
    if (s.seq.length < s.target.length) return "pending";
    const built = s.seq.map((i) => s.tray[i]);
    return built.every((c, i) => c === s.target[i]) ? "correct" : "wrong";
  },
  solve(s) {
    const out: OrderAction[] = [];
    const taken = new Set<number>();
    for (const chip of s.target) {
      const i = s.tray.findIndex((c, idx) => !taken.has(idx) && c === chip);
      if (i >= 0) { taken.add(i); out.push({ tapTray: i }); }
    }
    return out;
  },
};

// ── oddone (toggle items, then submit; the skin auto-submits for "odd") ───────
export type OddState = { kind: "oddone"; select: "odd" | "all"; items: string[]; correct: string[]; selected: string[]; submitted: boolean };
export type OddAction = { toggle: string } | { submit: true };
export const oddMachine: CardMachine<OddState, OddAction> = {
  init(task, seed = task.id) {
    const t = task as Of<"oddone">;
    return { kind: "oddone", select: t.select ?? "odd", items: seededShuffle(t.items, seed), correct: t.correct, selected: [], submitted: false };
  },
  act(s, a) {
    if ("submit" in a) return { ...s, submitted: true };
    if (s.select === "odd") return { ...s, selected: [a.toggle] }; // single-select
    const has = s.selected.includes(a.toggle);
    return { ...s, selected: has ? s.selected.filter((x) => x !== a.toggle) : [...s.selected, a.toggle] };
  },
  grade(s) {
    if (!s.submitted) return "pending";
    const a = [...s.selected].sort();
    const b = [...s.correct].sort();
    return a.length === b.length && a.every((x, i) => x === b[i]) ? "correct" : "wrong";
  },
  solve: (s) => [...s.correct.map((c) => ({ toggle: c }) as OddAction), { submit: true }],
};

// ── wheel (rotate to a value, then lock by tapping it — G9) ───────────────────
export type WheelState = { kind: "wheel"; values: string[]; answer: string; index: number; locked: boolean };
export type WheelAction = { rotate: number } | { lock: true };
export const wheelMachine: CardMachine<WheelState, WheelAction> = {
  init(task) {
    // the wheel keeps AUTHORED order (a number ring is meaningful) — no shuffle
    const t = task as Of<"wheel">;
    return { kind: "wheel", values: t.values, answer: t.answer, index: 0, locked: false };
  },
  act(s, a) {
    if ("lock" in a) return { ...s, locked: true };
    const n = s.values.length;
    return { ...s, index: (((s.index + a.rotate) % n) + n) % n };
  },
  grade: (s) => (!s.locked ? "pending" : s.values[s.index] === s.answer ? "correct" : "wrong"),
  solve(s) {
    const target = s.values.indexOf(s.answer);
    return [{ rotate: target - s.index }, { lock: true }];
  },
};

// ── mistake (tap the wrong word, then fix it) ────────────────────────────────
export type MistakeState = {
  kind: "mistake"; sentence: string[]; errorIndex: number;
  mode: "replace" | "remove" | "add"; correction: string | null; correctionOptions: string[];
  phase: "find" | "fix" | "done"; result: Grade;
};
export type MistakeAction = { tapWord: number } | { pickFix: string };
export const mistakeMachine: CardMachine<MistakeState, MistakeAction> = {
  init(task, seed = task.id) {
    const t = task as Of<"mistake">;
    return {
      kind: "mistake", sentence: t.sentence, errorIndex: t.errorIndex, mode: t.fix.mode,
      correction: t.fix.correction ?? null,
      correctionOptions: t.correctionOptions ? seededShuffle(t.correctionOptions, seed) : [],
      phase: "find", result: "pending",
    };
  },
  act(s, a) {
    if (s.phase === "find" && "tapWord" in a) {
      if (a.tapWord !== s.errorIndex) return { ...s, phase: "done", result: "wrong" }; // wrong word tapped
      if (s.mode === "remove") return { ...s, phase: "done", result: "correct" }; // finding it IS the fix
      return { ...s, phase: "fix" };
    }
    if (s.phase === "fix" && "pickFix" in a) {
      return { ...s, phase: "done", result: a.pickFix === s.correction ? "correct" : "wrong" };
    }
    return s;
  },
  grade: (s) => (s.phase === "done" ? s.result : "pending"),
  solve(s) {
    const acts: MistakeAction[] = [{ tapWord: s.errorIndex }];
    if (s.mode !== "remove" && s.correction) acts.push({ pickFix: s.correction });
    return acts;
  },
};

// ── memory (flip pairs; forgiving — pending until all matched) ────────────────
export type MemoryCard = { v: string; pair: number };
export type MemoryState = { kind: "memory"; tray: MemoryCard[]; up: number[]; matched: number[] };
export type MemoryAction = { flip: number };
export const memoryMachine: CardMachine<MemoryState, MemoryAction> = {
  init(task, seed = task.id) {
    const t = task as Of<"memory">;
    const cards: MemoryCard[] = t.pairs.flatMap((p, i) => [{ v: p.a, pair: i }, { v: p.b, pair: i }]);
    return { kind: "memory", tray: seededShuffle(cards, seed), up: [], matched: [] };
  },
  act(s, a) {
    const i = a.flip;
    if (s.matched.includes(i) || s.up.includes(i) || i < 0 || i >= s.tray.length) return s;
    if (s.up.length >= 2) return { ...s, up: [i] }; // a mismatch was showing — clear + start fresh
    const up = [...s.up, i];
    if (up.length === 2 && s.tray[up[0]!]!.pair === s.tray[up[1]!]!.pair) {
      return { ...s, up: [], matched: [...s.matched, up[0]!, up[1]!] };
    }
    return { ...s, up };
  },
  grade: (s) => (s.matched.length === s.tray.length ? "correct" : "pending"),
  solve(s) {
    const out: MemoryAction[] = [];
    const byPair = new Map<number, number[]>();
    s.tray.forEach((c, i) => { const g = byPair.get(c.pair) ?? []; g.push(i); byPair.set(c.pair, g); });
    for (const [, idxs] of byPair) for (const i of idxs) out.push({ flip: i });
    return out;
  },
};

// ── the registry ─────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MACHINES: Record<GameTaskV2["kind"], CardMachine<any, any>> = {
  choice: choiceMachine, typed: typedMachine, spell: spellMachine, order: orderMachine,
  oddone: oddMachine, mistake: mistakeMachine, wheel: wheelMachine, memory: memoryMachine,
};

/** Drive a task from init to a graded end via its own solution — the harness +
 *  parity tests use this. Returns the final grade (should be "correct"). */
export function autoSolve(task: GameTaskV2, seed = task.id): Grade {
  const m = MACHINES[task.kind];
  let s = m.init(task, seed);
  for (const a of m.solve(s)) s = m.act(s, a);
  return m.grade(s);
}
