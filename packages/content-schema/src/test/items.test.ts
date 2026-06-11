import assert from "node:assert/strict";
import { test } from "node:test";
import {
  GRAMMAR_FORMATS,
  GrammarFile,
  GrammarItem,
  VocabFile,
  VocabItem,
} from "../index.ts";
import {
  gameMeta,
  grammarFile,
  grammarItem,
  pres,
  variant,
  vocabFile,
  vocabItem,
} from "./fixtures.ts";

function red(result: { success: boolean }, msg: string): void {
  assert.equal(result.success, false, msg);
}

test("grammar: one valid item per format parses and JSON round-trips", () => {
  for (const format of GRAMMAR_FORMATS) {
    const parsed = GrammarItem.parse(grammarItem(format));
    const reparsed = GrammarItem.parse(JSON.parse(JSON.stringify(parsed)));
    assert.deepEqual(reparsed, parsed, format);
  }
  const file = grammarFile(GRAMMAR_FORMATS.map((f, i) =>
    grammarItem(f, { id: `g2u03.gi.should.${["gf","mc","cp","tr","ec","tf","qf","ff","sb","mt","ag","gs","mp"][i]}.001` }),
  ));
  assert.equal(GrammarFile.parse(file).items.length, 13);
});

test("vocab: valid item with gameMeta + variant round-trips", () => {
  const item = vocabItem({
    presentation: pres({
      gameMeta: gameMeta(),
      variants: [
        variant({
          prompt: { text: "Megan saw the ___ at the party.", lang: "en" },
        }),
      ],
    }),
  });
  const parsed = VocabItem.parse(item);
  const reparsed = VocabItem.parse(JSON.parse(JSON.stringify(parsed)));
  assert.deepEqual(reparsed, parsed);
  assert.equal(VocabFile.parse(vocabFile([item])).items.length, 1);
});

test("difficulty must be 1..3", () => {
  red(VocabItem.safeParse(vocabItem({ difficulty: 0 })), "difficulty 0");
  red(VocabItem.safeParse(vocabItem({ difficulty: 4 })), "difficulty 4");
  red(
    GrammarItem.safeParse(grammarItem("gap-fill", { difficulty: 4 })),
    "grammar difficulty 4",
  );
});

test("variants may only re-frame carrier text", () => {
  // blank-count change is the schema-checkable invariant
  red(
    GrammarItem.safeParse(
      grammarItem("gap-fill", {
        presentation: pres({
          variants: [
            variant({
              prompt: { text: "Two blanks: ___ and ___.", lang: "en" },
            }),
          ],
        }),
      }),
    ),
    "grammar variant changes blank count",
  );
  red(
    VocabItem.safeParse(
      vocabItem({
        presentation: pres({
          variants: [variant({ prompt: { text: "No blank here.", lang: "en" } })],
        }),
      }),
    ),
    "vocab variant drops the blank",
  );
  // answers are structurally unrepresentable on a variant — zod strips them
  const sneaky = variant({
    prompt: { text: "Nora says: we ___ open the door.", lang: "en" },
    answers: [{ text: "must", tier: "full" }],
  });
  const parsed = GrammarItem.parse(
    grammarItem("gap-fill", { presentation: pres({ variants: [sneaky] }) }),
  );
  assert.ok(!("answers" in parsed.presentation.variants[0]!));
});

test("translation direction is required iff translation", () => {
  red(
    GrammarItem.safeParse(grammarItem("translation", { direction: null })),
    "translation without direction",
  );
  red(
    GrammarItem.safeParse(grammarItem("gap-fill", { direction: "deToEn" })),
    "direction on gap-fill",
  );
});

test("per-format shape rules", () => {
  red(
    GrammarItem.safeParse(
      grammarItem("multiple-choice", { distractors: ["should", "can"] }),
    ),
    "mc with 2 distractors",
  );
  red(
    GrammarItem.safeParse(
      grammarItem("matching", {
        pairs: [
          { left: "We should", right: "go home." },
          { left: "You shouldn't", right: "shout." },
        ],
      }),
    ),
    "matching with 2 pairs",
  );
  red(
    GrammarItem.safeParse(
      grammarItem("matching-pairs", {
        answers: [{ text: "should", tier: "full" }],
      }),
    ),
    "answers on a pair format",
  );
  red(
    GrammarItem.safeParse(
      grammarItem("group-sort", {
        groups: [{ label: "should", members: ["sleep early", "eat fruit"] }],
      }),
    ),
    "group-sort with 1 group",
  );
  red(
    GrammarItem.safeParse(
      grammarItem("anagram", {
        answers: [{ text: "two words", tier: "full" }],
      }),
    ),
    "anagram multi-word answer",
  );
  red(
    GrammarItem.safeParse(
      grammarItem("gap-fill", {
        answers: [{ text: "should", tier: "partial" }],
      }),
    ),
    "no full-tier answer",
  );
});

test("gameMeta sanity is schema-level for shape", () => {
  red(
    VocabItem.safeParse(
      vocabItem({
        presentation: pres({
          gameMeta: gameMeta({ distractorPool: ["a", "b", "c"] }),
        }),
      }),
    ),
    "distractor pool of 3",
  );
  red(
    VocabItem.safeParse(
      vocabItem({
        presentation: pres({ gameMeta: gameMeta({ chipBudget: 13 }) }),
      }),
    ),
    "chip budget 13",
  );
});

test("grammar id coherence: unit, key, format code", () => {
  red(
    GrammarItem.safeParse(
      grammarItem("multiple-choice", { id: "g2u03.gi.should.gf.001" }),
    ),
    "id code gf vs format multiple-choice",
  );
  red(
    GrammarItem.safeParse(
      grammarItem("gap-fill", { structureId: "g2u04.s.should" }),
    ),
    "item unit ≠ structure unit",
  );
  red(
    GrammarItem.safeParse(
      grammarItem("gap-fill", { structureId: "g2u03.s.comparatives" }),
    ),
    "embedded key ≠ structure key",
  );
});

test("blank arity", () => {
  red(
    GrammarItem.safeParse(
      grammarItem("gap-fill", {
        prompt: { text: "No blank here.", lang: "en", blanks: 1 },
      }),
    ),
    "declared blank missing from text",
  );
  red(
    GrammarItem.safeParse(
      grammarItem("gap-fill", {
        prompt: { text: "One ___ here.", lang: "en", blanks: 2 },
      }),
    ),
    "blanks 2 with one marker",
  );
  red(
    GrammarItem.safeParse(
      grammarItem("gap-fill", {
        prompt: { text: "No blank.", lang: "en", blanks: 0 },
      }),
    ),
    "gap-fill with zero blanks",
  );
});

test("vocab refinements: headword leak, blank, mc discipline", () => {
  red(
    VocabItem.safeParse(
      vocabItem({ d: "A witch is a woman who does magic" }),
    ),
    "definition leaks headword",
  );
  red(VocabItem.safeParse(vocabItem({ s: "No blank in this sentence." })), "no blank");
  red(
    VocabItem.safeParse(vocabItem({ s: "Two ___ in this ___ sentence." })),
    "two blanks",
  );
  red(
    VocabItem.safeParse(vocabItem({ mc: ["ghost", "witch", "spider"] })),
    "mc contains headword",
  );
  red(
    VocabItem.safeParse(vocabItem({ mc: ["ghost", "ghost", "spider"] })),
    "duplicate distractor",
  );
  red(
    VocabItem.safeParse(
      vocabItem({ sAnswers: [{ text: "witch", tier: "partial" }] }),
    ),
    "sAnswers without full tier",
  );
});

test("file-level: prefix and duplicate ids", () => {
  red(
    VocabFile.safeParse(
      vocabFile([vocabItem(), vocabItem()]),
    ),
    "duplicate vocab ids",
  );
  red(
    VocabFile.safeParse(vocabFile([vocabItem({ id: "g2u04.w.witch" })])),
    "wrong unit prefix for file slug",
  );
  red(
    GrammarFile.safeParse(
      grammarFile([
        grammarItem("gap-fill"),
        grammarItem("gap-fill"),
      ]),
    ),
    "duplicate grammar ids",
  );
});
