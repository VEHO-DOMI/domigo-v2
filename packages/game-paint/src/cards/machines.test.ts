import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { GameTasksFileV2 } from "@domigo/content-schema";
import {
  MACHINES, autoSolve, normText,
  choiceMachine, typedMachine, spellMachine, orderMachine,
  oddMachine, wheelMachine, mistakeMachine, memoryMachine,
} from "./machines.ts";

const exemplars = GameTasksFileV2.parse(
  JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json"), "utf8")),
).items;
const byKind = <K extends (typeof exemplars)[number]["kind"]>(k: K) =>
  exemplars.find((t) => t.kind === k)! as Extract<(typeof exemplars)[number], { kind: K }>;

// ── PARITY: the winning path grades correct for EVERY exemplar ────────────────
describe("card machines · parity — every exemplar auto-solves to correct", () => {
  it("covers all 8 kinds", () => expect(new Set(exemplars.map((t) => t.kind)).size).toBe(8));
  for (const t of exemplars) it(`${t.id} (${t.kind}) → correct`, () => expect(autoSolve(t)).toBe("correct"));
});

// ── choice ────────────────────────────────────────────────────────────────────
describe("choice", () => {
  const t = byKind("choice");
  it("pending before a pick, wrong on a distractor", () => {
    const s0 = choiceMachine.init(t);
    expect(choiceMachine.grade(s0)).toBe("pending");
    const bad = s0.options.find((o) => o !== t.answer)!;
    expect(choiceMachine.grade(choiceMachine.act(s0, { pick: bad }))).toBe("wrong");
  });
});

// ── typed ─────────────────────────────────────────────────────────────────────
describe("typed", () => {
  const t = byKind("typed"); // answer "hello", accept ["hello!","hi"]
  const run = (v: string) => { let s = typedMachine.init(t); s = typedMachine.act(s, { input: v }); return typedMachine.grade(typedMachine.act(s, { submit: true })); };
  it("pending before submit", () => expect(typedMachine.grade(typedMachine.act(typedMachine.init(t), { input: "hello" }))).toBe("pending"));
  it("accepts the answer + declared variants, lenient on case/punctuation", () => {
    expect(run("hello")).toBe("correct");
    expect(run("Hello!")).toBe("correct");
    expect(run("hi")).toBe("correct");
    expect(run("goodbye")).toBe("wrong");
  });
});

// ── spell ─────────────────────────────────────────────────────────────────────
describe("spell", () => {
  const t = byKind("spell"); // "pen" + extra "ta"
  it("pending mid-word, undo pops, wrong when a full word mismatches", () => {
    let s = spellMachine.init(t);
    s = spellMachine.act(s, { tapTray: 0 });
    expect(spellMachine.grade(s)).toBe("pending");
    const popped = spellMachine.act(s, { undo: true });
    expect(popped.used.length).toBe(0);
    // fill the first 3 distinct tray slots in fixed order — a full-length non-"pen" word ⇒ wrong (unless it happens to spell pen)
    let f = spellMachine.init(t);
    for (const i of [0, 1, 2]) f = spellMachine.act(f, { tapTray: i });
    const word = f.used.map((x) => f.tray[x]).join("").toLowerCase();
    expect(spellMachine.grade(f)).toBe(word === "pen" ? "correct" : "wrong");
  });
  it("cannot reuse a tray slot", () => {
    let s = spellMachine.init(t);
    s = spellMachine.act(s, { tapTray: 0 });
    s = spellMachine.act(s, { tapTray: 0 });
    expect(s.used).toEqual([0]);
  });
});

// ── order ─────────────────────────────────────────────────────────────────────
describe("order", () => {
  const t = byKind("order"); // This is my book .
  it("pending until full, wrong on a scrambled full order", () => {
    let s = orderMachine.init(t);
    s = orderMachine.act(s, { tapTray: 0 });
    expect(orderMachine.grade(s)).toBe("pending");
    // place every chip in raw tray order (a scramble unless the shuffle is identity)
    let f = orderMachine.init(t);
    for (let i = 0; i < f.tray.length; i++) f = orderMachine.act(f, { tapTray: i });
    const built = f.seq.map((i) => f.tray[i]);
    expect(orderMachine.grade(f)).toBe(built.every((c, i) => c === t.orderedChips[i]) ? "correct" : "wrong");
  });
});

// ── oddone ────────────────────────────────────────────────────────────────────
describe("oddone", () => {
  const t = byKind("oddone"); // items incl "chair" as the odd one
  it("single-select replaces; wrong item ⇒ wrong", () => {
    let s = oddMachine.init(t);
    const notOdd = t.items.find((i) => !t.correct.includes(i))!;
    s = oddMachine.act(s, { toggle: notOdd });
    s = oddMachine.act(s, { toggle: t.correct[0]! }); // replaces (single-select)
    expect(s.selected).toEqual([t.correct[0]]);
    const wrong = oddMachine.act(oddMachine.act(oddMachine.init(t), { toggle: notOdd }), { submit: true });
    expect(oddMachine.grade(wrong)).toBe("wrong");
  });
});

// ── wheel ─────────────────────────────────────────────────────────────────────
describe("wheel", () => {
  const t = byKind("wheel"); // values 11..16, answer thirteen
  it("pending until locked; rotate wraps; wrong lock ⇒ wrong", () => {
    const s0 = wheelMachine.init(t);
    expect(wheelMachine.grade(s0)).toBe("pending");
    const wrap = wheelMachine.act(s0, { rotate: -1 });
    expect(wrap.index).toBe(t.values.length - 1);
    const wrongIdx = t.values.indexOf(t.answer) === 0 ? 1 : 0;
    let w = wheelMachine.init(t);
    w = wheelMachine.act(w, { rotate: wrongIdx - w.index });
    expect(wheelMachine.grade(wheelMachine.act(w, { lock: true }))).toBe("wrong");
  });
});

// ── mistake ───────────────────────────────────────────────────────────────────
describe("mistake", () => {
  const t = byKind("mistake"); // "This is a rubber ." errorIndex 3 → ruler
  it("tapping the wrong word ⇒ wrong; right word then wrong fix ⇒ wrong", () => {
    const notErr = t.errorIndex === 0 ? 1 : 0;
    expect(mistakeMachine.grade(mistakeMachine.act(mistakeMachine.init(t), { tapWord: notErr }))).toBe("wrong");
    let s = mistakeMachine.act(mistakeMachine.init(t), { tapWord: t.errorIndex });
    expect(mistakeMachine.grade(s)).toBe("pending"); // now in fix phase
    const badFix = (t.correctionOptions ?? []).find((o) => o !== t.fix.correction)!;
    expect(mistakeMachine.grade(mistakeMachine.act(s, { pickFix: badFix }))).toBe("wrong");
  });
  it("remove-mode: finding the word IS the fix", () => {
    const rm = { ...t, fix: { mode: "remove" as const }, correctionOptions: undefined };
    const s = mistakeMachine.act(mistakeMachine.init(rm), { tapWord: t.errorIndex });
    expect(mistakeMachine.grade(s)).toBe("correct");
  });
});

// ── memory ────────────────────────────────────────────────────────────────────
describe("memory", () => {
  const t = byKind("memory");
  it("a mismatch stays pending and clears on the next flip", () => {
    let s = memoryMachine.init(t);
    // find two indices of DIFFERENT pairs
    const i = 0;
    const j = s.tray.findIndex((c) => c.pair !== s.tray[i]!.pair);
    s = memoryMachine.act(s, { flip: i });
    s = memoryMachine.act(s, { flip: j });
    expect(s.up.length).toBe(2);
    expect(memoryMachine.grade(s)).toBe("pending");
    const k = s.tray.findIndex((_, idx) => idx !== i && idx !== j);
    s = memoryMachine.act(s, { flip: k });
    expect(s.up).toEqual([k]); // the mismatch was cleared
  });
});

describe("normText", () => {
  it("normalises articles, case, spaces, punctuation", () => {
    expect(normText("a school book!")).toBe("schoolbook");
    expect(normText("The Pen.")).toBe("pen");
    expect(normText("Hello!")).toBe("hello");
  });
});

it("MACHINES covers exactly the 8 kinds", () => {
  expect(Object.keys(MACHINES).sort()).toEqual(["choice", "memory", "mistake", "oddone", "order", "spell", "typed", "wheel"]);
});
