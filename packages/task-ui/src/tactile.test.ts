import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { GrammarItem } from "@domigo/content-schema";
import { gradeGrammar } from "@domigo/engine";
import { agAssemble, agSlots, agTiles, sbAnswerOrder, sbChips, seededShuffle } from "./tactile.ts";

describe("sbChips", () => {
  it("splits, trims, drops pure punctuation, and instance-keys duplicates", () => {
    const chips = sbChips("I'm / class / in / one / . / class");
    expect(chips.map((c) => c.text)).toEqual(["I'm", "class", "in", "one", "class"]);
    expect(chips[1]!.key).not.toBe(chips[4]!.key);
  });

  it("strips a German instruction prefix ending in ':' or '.', preserving separators inside tokens", () => {
    expect(sbChips("Bring die Wörter in die richtige Reihenfolge: never / I / been").map((c) => c.text)).toEqual([
      "never", "I", "been",
    ]);
    expect(sbChips("Bring die Wörter in die richtige Reihenfolge. at / the / 7:30 / train").map((c) => c.text)).toEqual([
      "at", "the", "7:30", "train",
    ]);
    expect(sbChips("Reihenfolge. at / begins / 3 p.m.").map((c) => c.text)).toEqual(["at", "begins", "3 p.m."]);
    // no instruction: separators inside tokens never trigger a strip
    expect(sbChips("at / 7:30 / school").map((c) => c.text)).toEqual(["at", "7:30", "school"]);
  });
});

describe("sbAnswerOrder", () => {
  it("finds the assembly order case- and punctuation-insensitively, allowing distractor leftovers", () => {
    // the real g1u01 item: "the" is an authored distractor chip that stays in the tray
    const chips = sbChips("isn't / on / it / desk / the / my");
    const order = sbAnswerOrder(chips, "It isn't on my desk.")!;
    expect(order.map((i) => chips[i]!.text)).toEqual(["it", "isn't", "on", "my", "desk"]);
  });

  it("returns null when a needed word is missing from the tray", () => {
    const chips = sbChips("a / b / c");
    expect(sbAnswerOrder(chips, "a b d")).toBeNull();
  });
});

describe("anagram tiles + slots", () => {
  it("fixes apostrophes/hyphens as pre-filled slots and shuffles only letters", () => {
    const slots = agSlots("isn't");
    expect(slots.map((s) => s.fixed)).toEqual([null, null, null, "'", null]);
    const tiles = agTiles("isn't", "g1u01.gi.contractions.ag.002");
    expect(tiles.map((t) => t.ch).sort()).toEqual(["i", "n", "s", "t"]);
  });

  it("assembles the answer back from its own tiles in slot order", () => {
    const slots = agSlots("I'm");
    expect(agAssemble(slots, ["I", "m"])).toBe("I'm");
    expect(agAssemble(slots, ["I", null])).toBe("I'");
  });

  it("shuffles deterministically by seed", () => {
    const a = agTiles("through", "seed-1").map((t) => t.key);
    expect(agTiles("through", "seed-1").map((t) => t.key)).toEqual(a);
    expect(seededShuffle([1, 2, 3, 4, 5], "x")).toEqual(seededShuffle([1, 2, 3, 4, 5], "x"));
  });
});

// ── THE PARITY SWEEP — the CI gate of the tactile layer ──────────────────────
// For EVERY sentence-building item in the corpus: the tray must be able to
// assemble a full answer, and that assembly must grade `correct` through the
// real engine. For EVERY anagram: assembling the first full answer from its
// own tiles must grade `correct`. A failure here means an item the tactile
// UI cannot solve — a corpus bug or a helper bug, either way a release blocker.

function repoRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
}

function allGrammarItems(): GrammarItem[] {
  const unitsDir = path.join(repoRoot(), "content", "corpus", "units");
  const out: GrammarItem[] = [];
  for (const slug of fs.readdirSync(unitsDir).sort()) {
    const p = path.join(unitsDir, slug, "grammar.json");
    if (!fs.existsSync(p)) continue;
    const parsed = JSON.parse(fs.readFileSync(p, "utf8")) as { items: GrammarItem[] };
    out.push(...parsed.items);
  }
  return out;
}

describe("corpus parity (every tactile item is solvable and grades correct)", () => {
  const items = allGrammarItems();
  const sb = items.filter((i) => i.format === "sentence-building");
  const ag = items.filter((i) => i.format === "anagram");

  it("covers the expected corpus (232 sb / 109 ag)", () => {
    expect(sb.length).toBeGreaterThanOrEqual(232);
    expect(ag.length).toBeGreaterThanOrEqual(109);
  });

  it("every sentence-building item: chips assemble a full answer that grades correct", () => {
    const failures: string[] = [];
    for (const item of sb) {
      const chips = sbChips(item.prompt.text);
      const fulls = item.answers.filter((a) => a.tier === "full").map((a) => a.text);
      const order = fulls.map((f) => sbAnswerOrder(chips, f)).find((o) => o !== null) ?? null;
      if (order === null) {
        failures.push(`${item.id}: no full answer assembles from the tray`);
        continue;
      }
      const value = order.map((i) => chips[i]!.text).join(" ");
      const tier = gradeGrammar(item, { kind: "text", value }).tier;
      if (tier !== "correct") failures.push(`${item.id}: assembled "${value}" graded ${tier}`);
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("every anagram: the tile assembly of the first full answer grades correct", () => {
    const failures: string[] = [];
    for (const item of ag) {
      const answer = item.answers.find((a) => a.tier === "full")?.text;
      if (answer === undefined) {
        failures.push(`${item.id}: no full answer`);
        continue;
      }
      const slots = agSlots(answer);
      const letters = agTiles(answer, item.id)
        .slice()
        .sort((a, b) => Number(a.key.split("#")[1]) - Number(b.key.split("#")[1]))
        .map((t) => t.ch);
      const value = agAssemble(slots, letters);
      if (value !== answer.normalize("NFC")) {
        failures.push(`${item.id}: tiles rebuild "${value}" ≠ "${answer}"`);
        continue;
      }
      const tier = gradeGrammar(item, { kind: "text", value }).tier;
      if (tier !== "correct") failures.push(`${item.id}: assembled "${value}" graded ${tier}`);
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
});
