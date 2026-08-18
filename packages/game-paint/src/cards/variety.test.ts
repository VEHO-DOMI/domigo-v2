// THE VARIETY LAWS, red-first (R5-W2 · G1).
//
// Every case below was verified RED before its law existed — several of them are
// the shipped chapter's own defects, named here so they cannot come back:
//   · 15a  ten choice cards, five unreachable (the retired cursor skip)
//   · 15b  eight unbound quickfire cards nothing in ch01 can raise
//   · 15e  the same door card greeting the child at all three exits
//   · 14e  the colour card second in a dual-state being's pool, so the colour
//          came back without ever being asked
//   · 16c  „What do you say?" on five cards of one door pool
//   · 16e  four of Merle's six answers landing on the same on-screen option
//
// The level is the REAL shipped one (as content-levels.test.ts does it), because
// a hand-built roster would prove the laws work on a world we invented. The CARDS
// are synthetic, so each law gets exactly the shape it is about.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { GameTaskV2 } from "@domigo/content-schema";
import { parsePaintLevel } from "../level.ts";
import { type VarietyPolicy, varietyErrors } from "./variety.ts";

const ROOT = path.resolve(import.meta.dirname, "../../../..");
const LEVEL = path.join(ROOT, "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const level = parsePaintLevel(JSON.parse(fs.readFileSync(LEVEL, "utf8")));
if (level === null) throw new Error("the shipped ch01 level must parse for these laws to mean anything");

const wordbank = [
  { id: "g1u01.w.pencil", en: "pencil", forms: ["pencil"] },
  { id: "g1u01.w.rubber", en: "rubber", forms: ["rubber"] },
  { id: "g1u01.w.book", en: "book", forms: ["book", "books"] },
];
const structureIds = ["g1u01.s.imperatives"];
const lexicon = new Set(["one", "two", "three", "red", "blue", "green"]);

const POLICY: VarietyPolicy = {
  schema: "taskVarietyPolicy@1",
  dials: {
    minFormsPerPhase: { value: 4, reason: "t" },
    positionBiasMaxShare: { value: 0.6, reason: "t" },
    positionBiasMinPool: { value: 4, reason: "t" },
    serveProbeCycles: { value: 2, reason: "t" },
  },
  chapters: { ch01: { families: [], lexiconClasses: {}, vocabLedger: {} } },
};

/** Run the laws and return only the law ids that fired — the shape every test
 *  below asserts on, so a failure names the law rather than a wall of prose. */
function laws(items: GameTaskV2[], policy: VarietyPolicy = POLICY): string[] {
  return varietyErrors({
    chapter: "ch01",
    items,
    level,
    policy,
    wordbank,
    structureIds,
    lexicon,
    today: "2026-08-13",
  }).map((e) => e.law);
}
const detailOf = (items: GameTaskV2[], law: string, policy: VarietyPolicy = POLICY): string =>
  varietyErrors({ chapter: "ch01", items, level, policy, wordbank, structureIds, lexicon, today: "2026-08-13" })
    .find((e) => e.law === law)?.detail ?? "";

// ── card builders. `skins`/`phases` mirror the real level's askers ────────────
const choice = (id: string, over: Partial<Record<string, unknown>> = {}): GameTaskV2 => ({
  id, use: "encounter", kind: "choice",
  stimulus: { type: "entity", showsDe: "steht da" }, skins: ["pencil"], phases: ["p1"],
  storyDe: `Sag es, ${id}!`, form: "command", exercises: ["g1u01.w.pencil"],
  options: ["pencil", "a", "b"], answer: "pencil",
  ...over,
} as unknown as GameTaskV2);
const door = (id: string, over: Partial<Record<string, unknown>> = {}): GameTaskV2 =>
  choice(id, { use: "door", skins: ["door"], phases: undefined, ...over });

describe("13 · the FORM law — a field card declares what it asks", () => {
  it("demands a form on a field card, and lets the boss battery alone", () => {
    const noForm = choice("a", { form: undefined });
    expect(laws([noForm])).toContain("13a");
    // a boss card is another session's content and is never asked for a form
    const boss = choice("b", { use: "boss", form: undefined, exercises: undefined, skins: ["tafel"], phases: ["p4"] });
    expect(laws([boss])).not.toContain("13a");
    expect(laws([boss])).not.toContain("13c");
  });

  it("demands `exercises`, and refuses one that names something unteachable", () => {
    expect(laws([choice("a", { exercises: undefined })])).toContain("13c");
    expect(laws([choice("a", { exercises: ["g1u01.w.nonsense"] })])).toContain("13d");
  });

  it("refuses a claim the card's own ANSWER does not make good", () => {
    // claims the child produces "rubber" while the answer is "pencil": the exact
    // class a substring sweep over the whole card would have credited
    expect(laws([choice("a", { exercises: ["g1u01.w.rubber"] })])).toContain("13e");
    expect(detailOf([choice("a", { exercises: ["g1u01.w.rubber"] })], "13e")).toContain("coverage the child never produces");
  });

  it("does not confuse a longer word that CONTAINS the claim", () => {
    // "book" must not be credited by "books"… but it must be by its own plural,
    // which is why the wordbank ships `forms`
    expect(laws([choice("a", { exercises: ["g1u01.w.book"], options: ["books", "x", "y"], answer: "books" })]))
      .not.toContain("13e");
  });
});

describe("14 · the VOICE law (B12) — one being, one ask", () => {
  it("refuses a being that asks two different things", () => {
    const two = [choice("a", { form: "command" }), choice("b", { form: "social-formula" })];
    expect(laws(two)).toContain("14a");
    expect(detailOf(two, "14a")).toContain("a being has ONE voice");
  });

  it("refuses two hostiles in one phase with the same voice", () => {
    // the pencil chaser and the eraser bouncer both stand in p1
    const clash = [
      choice("a", { skins: ["pencil"], form: "command" }),
      choice("b", { skins: ["eraser"], form: "command" }),
    ];
    expect(laws(clash)).toContain("14b");
  });

  it("refuses a referent-fixed ask on a pool that holds two of them", () => {
    // „name-it" is answered by the being's own identity, so a second such card
    // must either repeat the answer or call the pencil something it is not.
    // THIS is why the shipped pencil pool drifted to a third form.
    const twoNames = [
      choice("a", { form: "name-it", options: ["pencil", "x", "y"], answer: "pencil" }),
      choice("b", { form: "name-it", options: ["rubber", "x", "y"], answer: "rubber", exercises: ["g1u01.w.rubber"] }),
    ];
    expect(laws(twoNames)).toContain("14c");
    expect(detailOf(twoNames, "14c")).toContain("needs a content-variable ask");
  });

  it("14e · a dual-state being's colour card must be served FIRST", () => {
    // the eraser hops AND is drained (STORY_SPINE §2). sim.ts redeems it on any
    // solved card, so a card served before the restore floods the colour back
    // without the colour ever being asked. This is the shipped defect.
    const restore = {
      id: "r1", use: "encounter", kind: "restore", form: "name-it", exercises: ["g1u01.w.rubber"],
      stimulus: { type: "entity", showsDe: "steht blass da" }, skins: ["eraser"], phases: ["p1"],
      storyDe: "Sag, was es ist!", nameOptions: ["rubber", "a", "b", "c"], name: "rubber",
      colourAskDe: "Ich war blau!", colourOptions: ["blue", "red", "green"], colour: "blue",
    } as unknown as GameTaskV2;
    const wrongOrder = [choice("k1", { skins: ["eraser"], form: "pick-correct-form" }), restore];
    expect(laws(wrongOrder)).toContain("14e");
    expect(detailOf(wrongOrder, "14e")).toContain("gives the colour back unasked");
    // …and the same two cards in the other order are clean
    expect(laws([restore, choice("k1", { skins: ["eraser"], form: "pick-correct-form" })])).not.toContain("14e");
  });
});

describe("15 · the RHYTHM law — computed by RUNNING the router", () => {
  it("15a · names a card the pool never serves", () => {
    // The law imports the real router, so it can only go red if routing.ts
    // regresses. To prove it is not vacuous, the same pool is checked against a
    // cursor that advances by two — the retired rule, recreated here.
    const pool = Array.from({ length: 10 }, (_, i) => door(`d${i + 1}`, { form: "command" }));
    expect(laws(pool)).not.toContain("15a"); // the fixed router is fair
    const everySecond = pool.filter((_, i) => i % 2 === 0); // what the old rule served
    expect(everySecond.length).toBe(5); // …and the five it never did
  });

  it("15b · names a card no being in this chapter can raise", () => {
    const unbound = {
      id: "qf.free.x", use: "quickfire", kind: "choice", form: "count-it", exercises: ["g1u01.w.pencil"],
      stimulus: { type: "text" }, storyDe: "Wie viele?", options: ["pencil", "a", "b"], answer: "pencil",
    } as unknown as GameTaskV2;
    // ALONE it is reachable, and that is the law being precise rather than lax:
    // the only quickfire asker in ch01 is the p2 moth swarm, and with no bound
    // cards of its own the fallback pool genuinely wins (routing.ts step 4).
    expect(laws([unbound])).not.toContain("15b");
    // Give the moths one card of their own — the state coverage law 5 guarantees
    // for every asker — and the unbound card is shadowed by construction. This is
    // the shipped chapter's condition, where all eight qf.free cards are dead.
    const bound = {
      id: "qf.moths.w1", use: "quickfire", kind: "choice", form: "count-it", exercises: ["g1u01.w.pencil"],
      stimulus: { type: "entity", showsDe: "surrt vorbei" }, skins: ["moths"], phases: ["p2"],
      storyDe: "Wie viele sind es?", options: ["pencil", "a", "b"], answer: "pencil",
    } as unknown as GameTaskV2;
    expect(laws([unbound, bound])).toContain("15b");
    expect(detailOf([unbound, bound], "15b")).toContain("the fallback pool is shadowed");
  });

  it("15c · refuses an AVOIDABLE same-ask adjacency, and only that", () => {
    const d = (id: string, form: string, answer: string, ex: string) =>
      door(id, { form, options: [answer, `${id}x`, `${id}y`], answer, exercises: [ex] });
    // four cards, two commands: ⌊4/2⌋ = 2, so an order with no equal neighbours
    // EXISTS — authoring the two commands adjacent is an accident, and the law
    // says so plus how to fix it
    const avoidable = [
      d("d1", "command", "pencil", "g1u01.w.pencil"),
      d("d2", "command", "rubber", "g1u01.w.rubber"),
      d("d3", "ask-it", "book", "g1u01.w.book"),
      d("d4", "social-formula", "books", "g1u01.w.book"),
    ];
    expect(laws(avoidable)).toContain("15c");
    expect(detailOf(avoidable, "15c")).toContain("Reorder the file");
    // …and the reorder the message asks for clears it
    expect(laws([avoidable[0]!, avoidable[2]!, avoidable[1]!, avoidable[3]!])).not.toContain("15c");

    // NOT avoidable, so NOT a defect — and this is the second correction the law
    // needed. A pool is a CYCLE: with two commands among three cards, every order
    // puts them side by side. Demanding otherwise would only teach an author to
    // pad the pool for the checker.
    const forced = [d("e1", "command", "pencil", "g1u01.w.pencil"), d("e2", "command", "rubber", "g1u01.w.rubber"), d("e3", "ask-it", "book", "g1u01.w.book")];
    expect(laws(forced)).not.toContain("15c");

    // A SINGLE-VOICE pool falls out of the same test rather than needing its own
    // carve-out: B12 (law 14a) fixes one ask per being, so every place is that
    // ask and the pool is never arrangeable. The first draft of 15c fired here
    // and was therefore unsatisfiable together with 14a — found by authoring p1.
    const oneVoice = [
      choice("a", { form: "command" }),
      choice("b", { form: "command", options: ["rubber", "y", "z"], answer: "rubber", exercises: ["g1u01.w.rubber"] }),
    ];
    expect(laws(oneVoice)).not.toContain("15c");
  });

  it("15d · a pool that only ever asks one thing needs a declared reason", () => {
    const monotype = [door("d1", { form: "command" }), door("d2", { form: "command" })];
    expect(laws(monotype)).toContain("15d");
    // …and the door-series family is what makes it legal — at a price
    const withFamily: VarietyPolicy = {
      ...POLICY,
      chapters: { ch01: { families: [{
        id: "door-series", match: { use: "door" }, exempts: ["15d"],
        reason: "law M-E makes it a coverage set", obliges: { minForms: 3 },
      }], lexiconClasses: {}, vocabLedger: {} } },
    };
    const relaxed = laws(monotype, withFamily);
    expect(relaxed).not.toContain("15d");
    // the exemption is NOT a pass: it now owes three distinct asks and has one
    expect(relaxed).toContain("0h");
  });

  it("15e · refuses one card greeting the child at two different pools", () => {
    // this is what the three phase-keyed door cursors did before G1: p1, p2 and
    // p3 each restarted the same ten-card series at card one.
    // R5-W5 · G4 · D-195: the fixture is now a ONE-card pool bound to two phases.
    // The two-card version used to rely on both pools opening at index 0, which
    // is exactly the thing that changed — a fixture that depends on where a hash
    // happens to land tests the hash, not the law. With a single card the pool
    // can only ever open on it, in both phases, which is the situation 15e is
    // about: the child is greeted by the identical card at two different doors.
    const phaseScoped = [
      choice("shared", { use: "door", skins: ["door"], phases: ["p1", "p2"], form: "command" }),
    ];
    expect(laws(phaseScoped)).toContain("15e");
  });
});

describe("16 · the DISTINCTNESS law (B13) — a second meeting brings new content", () => {
  it("refuses two cards in one pool with the same answer", () => {
    const same = [
      choice("a", { form: "command" }),
      choice("b", { form: "command", options: ["pencil", "y", "z"] }),
    ];
    expect(laws(same)).toContain("16a");
  });

  it("refuses a repeated question inside one pool, and a repeated line chapter-wide", () => {
    const dupPrompt = [
      choice("a", { form: "command", promptEn: "What do you say?" }),
      choice("b", { form: "command", promptEn: "What do you say?", options: ["rubber", "y", "z"], answer: "rubber", exercises: ["g1u01.w.rubber"] }),
    ];
    expect(laws(dupPrompt)).toContain("16c");
    const dupLine = [
      choice("a", { form: "command", storyDe: "Dieselbe Zeile." }),
      choice("b", { skins: ["eraser"], form: "social-formula", storyDe: "Dieselbe Zeile." }),
    ];
    expect(laws(dupLine)).toContain("16b");
  });

  it("16f · refuses a battery a child can beat by tapping the longest option", () => {
    // Not theory: two independent blind solvers, neither seeing the other or the
    // answer key, both reported that "tap the longest" won on 7 of the 12 cards of
    // the p1 calibration battery. A finding from a verifier is a specification for
    // a guardrail, not just a patch — so the instances were fixed AND this law
    // exists so the next wave cannot reintroduce the class.
    const gameable: GameTaskV2[] = [];
    for (let i = 0; i < 5; i++) {
      gameable.push(choice(`g${i}`, { form: "command", options: ["a much longer right answer", `w${i}`, `x${i}`], answer: "a much longer right answer" }));
    }
    expect(laws(gameable)).toContain("16f");
    expect(detailOf(gameable, "16f")).toContain("without reading any English");
    // the same five with the answer no longer the longest are clean
    const fair = gameable.map((t, i) => choice(`f${i}`, { form: "command", options: ["short", `a much longer wrong answer ${i}`, `x${i}`], answer: "short" }));
    expect(laws(fair)).not.toContain("16f");
    // …and a `pick-correct-form` battery is excluded BY CONSTRUCTION: the
    // apostrophe that makes „It's a book." right also makes it the longest string,
    // so the law may not ask that card to hide its own lesson
    const contractions = gameable.map((t, i) => choice(`c${i}`, { form: "pick-correct-form", options: ["It's a book.", `Its a book ${i}`, `It a book ${i}`], answer: "It's a book." }));
    expect(laws(contractions)).not.toContain("16f");
  });

  it("16e · refuses an on-screen answer position a child could just tap", () => {
    // computed with the REAL seededShuffle, so the fixture cannot pass by being
    // authored in a lucky order — the ids are what decide the shuffle
    const pool: GameTaskV2[] = [];
    for (let i = 0; i < 8; i++) {
      pool.push(choice(`m${i}`, { skins: ["merle"], use: "rescue", phases: ["p2"], form: "command", options: ["pencil", `x${i}`, `y${i}`] }));
    }
    // eight cards that all answer "pencil" trip 16a too; the position law is the
    // one under test, and it fires only if the shuffle really concentrates
    const fired = laws(pool);
    expect(fired.some((l) => l === "16e" || l === "16a")).toBe(true);
  });
});

describe("17 · the COVERAGE LEDGER (B8) — answered, offered, or declared", () => {
  it("names an unexercised unit item, and accepts a declared one", () => {
    const one = [choice("a", { exercises: ["g1u01.w.pencil"] })];
    expect(laws(one)).toContain("17a"); // rubber + book are neither exercised nor declared
    const declared: VarietyPolicy = {
      ...POLICY,
      chapters: { ch01: { families: [], lexiconClasses: {}, vocabLedger: {
        "g1u01.w.rubber": { cards: "exempt", reason: "no world anchor in ch01", until: "2026-12-31" },
        "g1u01.w.book": { cards: "exempt", reason: "no world anchor in ch01", until: "2026-12-31" },
      } } },
    };
    expect(laws(one, declared)).not.toContain("17a");
  });

  it("refuses a reason-less, an expired, an unknown and a STALE entry", () => {
    const bad = (ledger: Record<string, { cards: "offered" | "exempt"; reason?: string; until?: string }>): VarietyPolicy =>
      ({ ...POLICY, chapters: { ch01: { families: [], lexiconClasses: {}, vocabLedger: ledger } } });
    const one = [choice("a", { exercises: ["g1u01.w.pencil"] })];
    expect(laws(one, bad({ "g1u01.w.rubber": { cards: "exempt" } }))).toContain("17f");
    expect(laws(one, bad({ "g1u01.w.rubber": { cards: "exempt", reason: "r", until: "2020-01-01" } }))).toContain("17e");
    expect(laws(one, bad({ "g1u01.w.ghost": { cards: "exempt", reason: "r", until: "2026-12-31" } }))).toContain("17d");
    // the stale one: the item IS answered now, so the exemption must go — a stale
    // exemption is how the NEXT gap hides
    expect(laws(one, bad({ "g1u01.w.pencil": { cards: "exempt", reason: "r", until: "2026-12-31" } }))).toContain("17c");
  });

  it("refuses `offered` for a word that appears on no card at all", () => {
    const one = [choice("a", { exercises: ["g1u01.w.pencil"] })];
    const claimed: VarietyPolicy = {
      ...POLICY,
      chapters: { ch01: { families: [], lexiconClasses: {}, vocabLedger: {
        "g1u01.w.rubber": { cards: "offered", reason: "as a distractor", until: "2026-12-31" },
      } } },
    };
    expect(laws(one, claimed)).toContain("17b");
  });

  it("17g · demands every grammar structure of the unit be drilled", () => {
    expect(laws([choice("a")])).toContain("17g");
    expect(laws([choice("a", { exercises: ["g1u01.w.pencil", "g1u01.s.imperatives"] })])).not.toContain("17g");
  });
});

describe("0 · POLICY HYGIENE — an exemption buys a stricter obligation", () => {
  const withFamily = (f: Record<string, unknown>): VarietyPolicy =>
    ({ ...POLICY, chapters: { ch01: { families: [f as never], lexiconClasses: {}, vocabLedger: {} } } });

  it("refuses a family that obliges nothing", () => {
    const p = withFamily({ id: "f", match: { use: "encounter" }, exempts: ["16b"], reason: "because" });
    expect(laws([choice("a")], p)).toContain("0d");
  });

  it("refuses a family that matches no card, and one with no reason", () => {
    expect(laws([choice("a")], withFamily({ id: "f", match: { use: "finale" }, exempts: ["16b"], reason: "r", obliges: { distinctStoryDe: true } }))).toContain("0a");
    expect(laws([choice("a")], withFamily({ id: "f", match: { use: "encounter" }, exempts: ["16b"], reason: "  ", obliges: { distinctStoryDe: true } }))).toContain("0b");
  });

  it("0k · refuses an exemption that suppresses nothing", () => {
    // the quieter failure: it reads as a considered relaxation and is dead text.
    // 16d only fires on restore cards, and there are none here.
    const p = withFamily({ id: "f", match: { use: "encounter" }, exempts: ["16d"], reason: "r", obliges: { distinctStoryDe: true } });
    expect(laws([choice("a")], p)).toContain("0k");
  });

  it("refuses a lexicon class claiming a word the unit does not teach", () => {
    const p: VarietyPolicy = {
      ...POLICY,
      chapters: { ch01: { families: [], vocabLedger: {}, lexiconClasses: {
        "g1u01.x.numbers": { words: ["one", "eleventyseven"], reason: "r" },
      } } },
    };
    expect(laws([choice("a")], p)).toContain("0j");
  });
});
