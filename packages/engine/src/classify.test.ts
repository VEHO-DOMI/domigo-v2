import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { classifyWrong, type ClassifiableItem } from "./classify.ts";

function item(fulls: string[], structureId?: string): ClassifiableItem {
  return {
    answers: fulls.map((text) => ({ text, tier: "full" as const })),
    structureId,
  };
}

describe("classifyWrong — the trap-registry classifier", () => {
  it("wilde-verben: regularised irregular past (goed)", () => {
    expect(classifyWrong(item(["He went home."]), "He goed home.")).toBe("wilde-verben");
  });

  it("wilde-verben: doubled-consonant regularisation (runned)", () => {
    expect(classifyWrong(item(["She ran to school."]), "She runned to school.")).toBe("wilde-verben");
  });

  it("gestern-falle: base form where past is wanted (regular)", () => {
    expect(classifyWrong(item(["Yesterday I played football."]), "Yesterday I play football.")).toBe(
      "gestern-falle",
    );
  });

  it("gestern-falle: base form where past is wanted (irregular)", () => {
    expect(classifyWrong(item(["Yesterday I went home."]), "Yesterday I go home.")).toBe("gestern-falle");
  });

  it("do-falle: German inversion instead of do-support", () => {
    expect(classifyWrong(item(["Do you play football?"]), "Play you football?")).toBe("do-falle");
  });

  it("not-allein: bare not without its auxiliary", () => {
    expect(classifyWrong(item(["I don't play football."]), "I play not football.")).toBe("not-allein");
  });

  it("he-she-it-s: missing 3rd-person s", () => {
    expect(
      classifyWrong(item(["She plays tennis."], "g1u05.s.present-simple"), "She play tennis."),
    ).toBe("he-she-it-s");
  });

  it("zaehl-falle: missing plural s on a plural structure", () => {
    expect(classifyWrong(item(["I have two apples."], "g1u03.s.plural"), "I have two apple.")).toBe(
      "zaehl-falle",
    );
  });

  it("jetzt-oder-immer: progressive used for a habit", () => {
    expect(classifyWrong(item(["I play football every day."]), "I am playing football every day.")).toBe(
      "jetzt-oder-immer",
    );
  });

  it("jetzt-oder-immer: simple form used for right-now", () => {
    expect(classifyWrong(item(["Look! He is playing football."]), "Look! He plays football.")).toBe(
      "jetzt-oder-immer",
    );
  });

  it("mischmasch: am + bare verb", () => {
    expect(classifyWrong(item(["I am playing football."]), "I am play football.")).toBe("mischmasch");
  });

  it("falsche-freunde: become for bekommen", () => {
    expect(classifyWrong(item(["I get a letter."]), "I become a letter.")).toBe("falsche-freunde");
  });

  it("falsche-freunde: does NOT fire when the right word is absent from the answers", () => {
    expect(classifyWrong(item(["The dog is brown."]), "The chef is brown.")).toBeNull();
  });

  it("wem-gehoerts: his/her swapped", () => {
    expect(classifyWrong(item(["Tom and his car."]), "Tom and her car.")).toBe("wem-gehoerts");
  });

  it("a-oder-an: article form is the only difference", () => {
    expect(classifyWrong(item(["I eat an apple."]), "I eat a apple.")).toBe("a-oder-an");
  });

  it("wie-ly: adjective where the adverb is wanted", () => {
    expect(classifyWrong(item(["He drives carefully."]), "He drives careful.")).toBe("wie-ly");
  });

  it("groesser-falle: more good instead of better", () => {
    expect(classifyWrong(item(["This film is better."]), "This film is more good.")).toBe(
      "groesser-falle",
    );
  });

  it("seit-falle: since with a duration", () => {
    expect(
      classifyWrong(item(["I have lived here for three years."]), "I live here since three years."),
    ).toBe("seit-falle");
  });

  it("wenn-falle: will inside the if-clause", () => {
    expect(
      classifyWrong(item(["If it rains, we stay at home."]), "If it will rain, we stay at home."),
    ).toBe("wenn-falle");
  });

  it("returns null for an unrelated wrong answer", () => {
    expect(classifyWrong(item(["The cat is black."]), "The dog is brown.")).toBeNull();
  });

  it("returns null for empty input and empty answer sets", () => {
    expect(classifyWrong(item(["She plays tennis."]), "   ")).toBeNull();
    expect(classifyWrong({ answers: [] }, "she play tennis")).toBeNull();
  });

  it("never claims a trap on a multi-error answer it cannot pin down", () => {
    expect(
      classifyWrong(item(["She plays tennis every day."], "g1u05.s.present-simple"), "tennis she like"),
    ).toBeNull();
  });

  it("only ever returns registry ids marked detect:true (trap-registry@1 coherence)", () => {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const registry = JSON.parse(
      fs.readFileSync(path.resolve(here, "../../../content/corpus/traps/traps.json"), "utf8"),
    ) as { traps: Array<{ id: string; detect: boolean }> };
    const detectable = new Set(registry.traps.filter((t) => t.detect).map((t) => t.id));
    const source = fs.readFileSync(path.resolve(here, "classify.ts"), "utf8");
    const returned = [...source.matchAll(/return "([a-z0-9-]+)"/g)].map((m) => m[1]!);
    expect(returned.length).toBeGreaterThan(0);
    for (const id of returned) expect(detectable, `classifier returns unknown/undetectable trap "${id}"`).toContain(id);
  });
});
