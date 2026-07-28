import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { GameTasksFileV2 } from "@domigo/content-schema";
import type { GameTaskV2 } from "@domigo/content-schema";
import {
  MACHINES, autoSolve, normText, spellSlots, spellTrayDisabled,
  choiceMachine, typedMachine, spellMachine, orderMachine,
  oddMachine, wheelMachine, mistakeMachine, memoryMachine, restoreMachine,
  WHEEL_ITEM_H, wheelIndexAt, wheelLockActions, wheelScrollFor, wheelStep,
} from "./machines.ts";

const shipped = GameTasksFileV2.parse(
  JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json"), "utf8")),
).items;

// PK-R3b · R3-13 — THE PARITY SUITE AFTER THE DISTRIBUTION MAP.
// This suite used to derive its exemplars purely from ch01, and asserted that
// they covered all eight kinds. Then doc 41 §1 shrank ch01's field palette and
// the chapter stopped shipping a `spell` card at all — so a machine the engine
// still owns (ch02 debuts spell in its own field) lost its only proof.
//
// The fix keeps content as the source of truth and makes the GAP explicit: a
// kind no shipped chapter uses is covered by a declared fixture, and the suite
// fails if a fixture ever shadows a kind the content DOES ship. Coverage of the
// machine registry stays total either way — which is the actual law.
const FIXTURES: Partial<Record<GameTaskV2["kind"], GameTaskV2>> = {
  spell: {
    id: "fixture.spell", use: "encounter", kind: "spell",
    stimulus: { type: "entity", showsDe: "Ein Stift wartet auf sein Wort" },
    storyDe: "Buchstabiere ihn!", answer: "pen", extraLetters: "bc", skins: ["pen"],
  },
};
const exemplars: GameTaskV2[] = [...shipped, ...Object.values(FIXTURES)];
const byKind = <K extends GameTaskV2["kind"]>(k: K) =>
  exemplars.find((t) => t.kind === k)! as Extract<GameTaskV2, { kind: K }>;

// ── PARITY: the winning path grades correct for EVERY exemplar ────────────────
describe("card machines · parity — every exemplar auto-solves to correct", () => {
  it("every machine in the registry has an exemplar", () => {
    expect([...new Set(exemplars.map((t) => t.kind))].sort()).toEqual(Object.keys(MACHINES).sort());
  });
  it("no fixture shadows a kind the shipped content actually carries", () => {
    const live = new Set(shipped.map((t) => t.kind));
    for (const k of Object.keys(FIXTURES)) {
      expect(live.has(k as GameTaskV2["kind"]), `${k} is shipped in ch01 — delete its fixture and test the real card`).toBe(false);
    }
  });
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
  const t = byKind("typed"); // derive from the actual first typed card (robust to content order)
  const run = (v: string) => { let s = typedMachine.init(t); s = typedMachine.act(s, { input: v }); return typedMachine.grade(typedMachine.act(s, { submit: true })); };
  it("pending before submit", () => expect(typedMachine.grade(typedMachine.act(typedMachine.init(t), { input: t.answer }))).toBe("pending"));
  it("accepts the answer + declared variants, lenient on case/punctuation", () => {
    expect(run(t.answer)).toBe("correct");
    expect(run(t.answer.toUpperCase())).toBe("correct"); // case-lenient
    expect(run(t.answer + "!")).toBe("correct"); // punctuation-lenient
    for (const a of t.accept) expect(run(a)).toBe("correct"); // declared variants
    expect(run("zznotaword")).toBe("wrong");
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
    // fill the first answer-length tray slots in fixed order — a FULL word that
    // is not the answer ⇒ wrong (length read off the exemplar, not assumed)
    let f = spellMachine.init(t);
    for (let i = 0; i < t.answer.length; i++) f = spellMachine.act(f, { tapTray: i });
    const word = f.used.map((x) => f.tray[x]).join("").toLowerCase();
    expect(spellMachine.grade(f)).toBe(word === t.answer.toLowerCase() ? "correct" : "wrong");
  });
  it("cannot reuse a tray slot", () => {
    let s = spellMachine.init(t);
    s = spellMachine.act(s, { tapTray: 0 });
    s = spellMachine.act(s, { tapTray: 0 });
    expect(s.used).toEqual([0]);
  });
  it("view: exactly answer-length slots, empty→filled, tap capped at word length (a longer form is unbuildable)", () => {
    const s0 = spellMachine.init(t);
    expect(spellSlots(s0).length).toBe(t.answer.length);          // N gaps, not tray length
    expect(spellSlots(s0).every((c) => c === null)).toBe(true);   // all empty at first sight
    expect(spellTrayDisabled(s0, 0)).toBe(false);                 // tray is tappable while gaps remain
    // mid-build: the used letter greys out; others stay open
    const mid = spellMachine.act(s0, { tapTray: 0 });
    expect(spellTrayDisabled(mid, 0)).toBe(true);
    if (t.answer.length > 1) expect(spellTrayDisabled(mid, 1)).toBe(false);
    // full word (from a fresh state so solve's indices don't collide with a manual tap)
    let full = spellMachine.init(t);
    for (const a of spellMachine.solve(full)) full = spellMachine.act(full, a);
    expect(full.used.length).toBe(t.answer.length);
    expect(spellSlots(full).every((c) => c !== null)).toBe(true); // every gap now shows a letter
    for (let i = 0; i < full.tray.length; i++) expect(spellTrayDisabled(full, i)).toBe(true); // cap: no (N+1)th letter
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

  // ── R3-9 · the scroll-dial's view logic (the whole DOM↔machine contract) ──
  describe("scroll-dial view logic (R3-9)", () => {
    const n = t.values.length;

    it("maps a scroll position to the value under the lens, rounding to the row", () => {
      expect(wheelIndexAt(0, n)).toBe(0);
      expect(wheelIndexAt(WHEEL_ITEM_H * 2, n)).toBe(2);
      expect(wheelIndexAt(WHEEL_ITEM_H * 2 + 21, n)).toBe(2); // still that row
      expect(wheelIndexAt(WHEEL_ITEM_H * 2 + 23, n)).toBe(3); // past the halfway
    });

    it("clamps an overscroll to the ends of the scale — never off the ring", () => {
      expect(wheelIndexAt(-400, n)).toBe(0);
      expect(wheelIndexAt(WHEEL_ITEM_H * (n + 9), n)).toBe(n - 1);
    });

    it("round-trips index → scrollTop → index", () => {
      for (let i = 0; i < n; i++) expect(wheelIndexAt(wheelScrollFor(i), n)).toBe(i);
    });

    // FOUND IN THE BROWSER (PK-R3a): the card springs in at `scale(0.94)`, so
    // while that transform is live the rows measure ~41.4 px, not the declared
    // 44. With the declared height hard-coded, `round(scrollTop / 44)` drifts by
    // a whole row once the scale is long enough — the dial would lock a number
    // the child never put under the lens. The skin now MEASURES the row; these
    // cases prove the helpers are honest at any rendered height.
    it("resolves the right row at a SCALED render height, all the way down a long scale", () => {
      const scaled = 44 * 0.94; // the spring-in transform, mid-flight
      for (let i = 0; i < 20; i++) {
        expect(wheelIndexAt(wheelScrollFor(i, scaled), 20, scaled)).toBe(i);
      }
    });

    it("the hard-coded height is what drifts — the measured one does not", () => {
      const scaled = 44 * 0.94;
      // row 19 sits at 786 px when rendered scaled; read against the DECLARED
      // 44 px that is row 18 — one whole row of silent wrongness.
      expect(wheelIndexAt(wheelScrollFor(19, scaled), 20)).toBe(18);
      expect(wheelIndexAt(wheelScrollFor(19, scaled), 20, scaled)).toBe(19);
    });

    it("the ▲▼ step stops at the ends (a column has a top and a bottom)", () => {
      expect(wheelStep(0, -1, n)).toBe(0);
      expect(wheelStep(n - 1, 1, n)).toBe(n - 1);
      expect(wheelStep(2, 1, n)).toBe(3);
    });

    it("locking at the dial's index grades the SAME as the machine's own solve", () => {
      const s = wheelMachine.init(t);
      const target = s.values.indexOf(s.answer);
      let after = s;
      for (const a of wheelLockActions(s, target)) after = wheelMachine.act(after, a);
      expect(wheelMachine.grade(after)).toBe("correct");
    });

    it("locking at any OTHER row grades wrong — the dial cannot flatter the child", () => {
      const s = wheelMachine.init(t);
      const target = s.values.indexOf(s.answer);
      for (let i = 0; i < n; i++) {
        if (i === target) continue;
        let after = s;
        for (const a of wheelLockActions(s, i)) after = wheelMachine.act(after, a);
        expect(wheelMachine.grade(after)).toBe("wrong");
      }
    });

    it("catches the machine up from a stale index (a wrong attempt reset it to 0)", () => {
      // the DOM keeps the dial where the child left it; the machine restarts at
      // 0 after a wrong answer. `rotate` is relative, so the two must still meet.
      const fresh = wheelMachine.init(t); // index 0
      const target = fresh.values.indexOf(fresh.answer);
      let after = fresh;
      for (const a of wheelLockActions(fresh, target)) after = wheelMachine.act(after, a);
      expect(after.values[after.index]).toBe(fresh.answer);
    });
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

// ── restore (PK-R3b · R3-15) ──────────────────────────────────────────────────
describe("restore — name it, then give the colour back", () => {
  const t = byKind("restore");
  it("pending until BOTH steps are answered", () => {
    const s0 = restoreMachine.init(t);
    expect(restoreMachine.grade(s0)).toBe("pending");
    const named = restoreMachine.act(s0, { pickName: t.name });
    expect(named.step).toBe("colour");
    expect(restoreMachine.grade(named)).toBe("pending"); // half-restored is not restored
    expect(restoreMachine.grade(restoreMachine.act(named, { pickColour: t.colour }))).toBe("correct");
  });
  it("a wrong NAME ends the card wrong — the colour step is never reached", () => {
    const s0 = restoreMachine.init(t);
    const bad = s0.nameOptions.find((o) => o !== t.name)!;
    const after = restoreMachine.act(s0, { pickName: bad });
    expect(after.step).toBe("done");
    expect(restoreMachine.grade(after)).toBe("wrong");
  });
  it("a wrong COLOUR after the right name is still wrong", () => {
    const named = restoreMachine.act(restoreMachine.init(t), { pickName: t.name });
    const bad = named.colourOptions.find((o) => o !== t.colour)!;
    expect(restoreMachine.grade(restoreMachine.act(named, { pickColour: bad }))).toBe("wrong");
  });
  it("the two rows shuffle INDEPENDENTLY — the colour cannot be read off the name", () => {
    // both rows seeded from the same task id would move in lockstep, so a child
    // who learned „the answer is the second one" would be right twice.
    const many = shipped.filter((x) => x.kind === "restore");
    expect(many.length).toBeGreaterThan(1);
    const nameAt = many.map((x) => restoreMachine.init(x).nameOptions.indexOf(x.name));
    const colourAt = many.map((x) => restoreMachine.init(x).colourOptions.indexOf(x.colour));
    expect(nameAt).not.toEqual(colourAt);
  });
  it("an action for the wrong step is ignored, not mis-graded", () => {
    const s0 = restoreMachine.init(t);
    expect(restoreMachine.act(s0, { pickColour: t.colour })).toEqual(s0);
  });
});

it("MACHINES covers exactly the 9 kinds", () => {
  expect(Object.keys(MACHINES).sort()).toEqual(["choice", "memory", "mistake", "oddone", "order", "restore", "spell", "typed", "wheel"]);
});
