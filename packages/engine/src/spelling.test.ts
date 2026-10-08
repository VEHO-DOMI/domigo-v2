import { describe, expect, it } from "vitest";
import { spellingAnswer, spellingLayout } from "./spelling.ts";
import { gradeVocab } from "./grade.ts";
import type { VocabItem } from "@domigo/content-schema";

describe("cgo-109 phrase-aware letter input", () => {
  it("keeps to/a/an/the, parentheses and sth/sb scaffolding fixed", () => {
    for (const [raw, target] of [["to look after sb. (care)", "lookafter"], ["a great idea", "greatidea"], ["an apple", "apple"], ["the rain", "rain"], ["to look at sth.", "lookat"], ["help s.o.", "help"]]) {
      const slots = spellingLayout(raw!);
      expect(slots.filter((slot) => !slot.fixed).map((slot) => slot.text).join("")).toBe(target);
      expect(spellingAnswer(slots, target!)).toBe(raw);
    }
  });
  it("preserves misspellings and excess input for the real grader", () => {
    const item = { translation: { deToEn: [{ text: "to admire", tier: "full" }] } } as VocabItem;
    const layout = spellingLayout("to admire");
    expect(gradeVocab(item, spellingAnswer(layout, "admire"), "deToEn").tier).toBe("correct");
    expect(gradeVocab(item, spellingAnswer(layout, "admiire"), "deToEn").tier).toBe("close");
    expect(gradeVocab(item, spellingAnswer(layout, "zzzzzzzzzz"), "deToEn").tier).toBe("wrong");
    expect(spellingAnswer(layout, "admirezzzz")).toBe("to admirezzzz");
  });
});
