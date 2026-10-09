import assert from "node:assert/strict";
import fs from "node:fs";
import { it } from "node:test";
import { loadUnit, loadUnitStructures, listApprovedUnits } from "@domigo/content-loader";
import { gradeGrammar, type GrammarInput } from "@domigo/engine";
import { grammarTopics, grammarRound, memoryEligible, GRAMMAR_FORMATS } from "./grammar.ts";
import { knownAttemptMode, validModeInput } from "./attempt-policy.ts";
const read = (file: string) => fs.readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
const items = listApprovedUnits().flatMap((slug) => loadUnit(slug).grammar);
const catalog = listApprovedUnits().flatMap(loadUnitStructures);

it("G01 topic labels come from the real structure catalog, grouped by Chapter", () => {
  const topics = grammarTopics(items, catalog);
  for (const topic of topics) {
    const structure = catalog.find((s) => s.id === topic.id)!;
    assert.ok(structure, topic.id);
    assert.equal(topic.name, structure.name); assert.equal(topic.nameDe, structure.nameDe); assert.equal(topic.chapter, structure.unit);
    assert.equal(topic.count, items.filter((i) => i.structureId === topic.id).length);
  }
  assert.match(read("app/modi/grammar/page.tsx"), /chapters\.flatMap\(loadUnitStructures\)/);
});
it("G02 missing names use the explicit Chapter/key fallback", () => {
  const item = items[0]!;
  const topic = grammarTopics([item], [])[0]!;
  assert.equal(topic.name, `Chapter ${Number(item.structureId.match(/u(\d+)/)![1])} · ${item.structureId.split(".s.")[1]}`);
  assert.equal(topic.nameDe, topic.name);
});
it("G03 rounds cannot cross structure/format boundaries or exceed ten items", () => {
  const item = items.find((i) => i.format === "gap-fill")!;
  const round = grammarRound(items, item.structureId, "gap-fill", false, () => .4);
  assert.ok(round.length > 0 && round.length <= 10);
  assert.ok(round.every((i) => i.structureId === item.structureId && i.format === "gap-fill"));
  assert.equal(grammarRound(items, "absent", "mix", false).length, 0);
});
it("G04 every offered format has corpus evidence and a real engine-perfect answer", () => {
  assert.equal(GRAMMAR_FORMATS.length, 13);
  for (const format of GRAMMAR_FORMATS) {
    const examples = items.filter((i) => i.format === format);
    assert.ok(examples.length, format);
    for (const item of examples) {
      const input: GrammarInput = format === "matching" || format === "matching-pairs" ? { kind: "matching", value: Object.fromEntries(item.pairs.map((p) => [p.left, p.right])) }
        : format === "group-sort" ? { kind: "groupSort", value: Object.fromEntries(item.groups.flatMap((g) => g.members.map((m) => [m, g.label]))) }
          : { kind: format === "multiple-choice" || format === "context-picker" ? "choice" : "text", value: item.answers.find((a) => a.tier === "full")!.text };
      assert.equal(gradeGrammar(item, input).tier, "correct", item.id);
    }
  }
});
it("G05 memory keeps whole authored pairs, rejects ambiguous or oversized decks", () => {
  const item = items.find((i) => i.id.startsWith("g1") && memoryEligible(i))!;
  assert.ok(item);
  const round = grammarRound(items, item.structureId, "mix", true);
  assert.equal(round.length, 1); assert.ok(memoryEligible(round[0]!));
  assert.ok(items.includes(round[0]!));
  assert.equal(memoryEligible({ ...item, pairs: [item.pairs[0]!, item.pairs[0]!] }), false);
  assert.equal(memoryEligible({ ...item, pairs: Array.from({ length: 9 }, (_, i) => ({ left: String(i), right: String(i) })) }), false);
  assert.equal(memoryEligible({ ...item, format: "gap-fill" }), false);
});
it("G06 grammar policy rejects vocab items and vocab inputs", () => {
  assert.equal(knownAttemptMode("grammar"), true);
  for (const kind of ["text", "choice", "matching", "groupSort"]) assert.equal(validModeInput("grammar", items[0]!.id, { kind }), true);
  assert.equal(validModeInput("grammar", "g1u01.w.001", { kind: "text" }), false);
  assert.equal(validModeInput("grammar", items[0]!.id, { kind: "vocab" }), false);
});
it("G07 every submission is grammar-tagged; only preview can grade locally and XP is receipt-only", () => {
  const session = read("app/modi/grammar/GrammarSession.tsx");
  assert.match(session, /mode: "grammar"/);
  assert.match(session, /preview \? \{ \.\.\.reply, tier: gradeGrammar\(item, input\)\.tier \} : reply/);
  assert.match(session, /all\.filter\(\(receipt\) => receipt\.ok\)/);
  assert.match(session, /receipt\.xpAwarded \?\? 0/);
  for (const file of ["GrammarExercise", "GrammarMemory", "GrammarSession"]) {
    const source = read(`app/modi/grammar/${file}.tsx`);
    assert.doesNotMatch(source, /xpForTier|difficulty\s*\*|award.*XP|grammarXp\s*[+=]/);
    if (file !== "GrammarSession") assert.doesNotMatch(source, /gradeGrammar/);
  }
});
it("G08 hint ladder records every check, tracks hints and reveals authored explanations", () => {
  const source = read("app/modi/grammar/GrammarExercise.tsx");
  for (const pattern of [/await submit\(item, input, hint \|\| wrong >= 2\)/, /wrong >= 3/, /hint \|\| wrong >= 2/, /item\.hintDe/, /item\.explainDe/, /locked\.current \|\| done/]) assert.match(source, pattern);
  assert.match(read("app/modi/grammar/GrammarSession.tsx"), /\/review\$\{suffix\}/);
});
it("G09 memory is year-one-only and never judges assignments locally", () => {
  assert.match(read("app/modi/grammar/GrammarSession.tsx"), /grade === 1 && initialMemory/);
  assert.match(read("app/modi/grammar/page.tsx"), /grade === 1 && query\.memory === "1"/);
  const memory = read("app/modi/grammar/GrammarMemory.tsx");
  assert.doesNotMatch(memory, /gradeGrammar|\.left\s*===.*\.right|xpAwarded/);
  assert.match(read("app/modi/grammar/GrammarExercise.tsx"), /kind: "matching", value: map/);
});
it("G10 mode preference is device-only, year-scoped and never written in preview", async () => {
  const { rememberTrainerArea } = await import("./preference.ts");
  const stored: [string, string][] = [];
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage"), oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { setItem: (key: string, value: string) => stored.push([key, value]) } });
  Object.defineProperty(globalThis, "window", { configurable: true, value: { dispatchEvent: () => true } });
  try {
    rememberTrainerArea(1, "grammar", true); assert.equal(stored.length, 0);
    rememberTrainerArea(1, "grammar", false); assert.deepEqual(stored, [["domigo-trainer-mode-g1", "grammar"]]);
  } finally {
    if (oldStorage) Object.defineProperty(globalThis, "localStorage", oldStorage); else Reflect.deleteProperty(globalThis, "localStorage");
    if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow); else Reflect.deleteProperty(globalThis, "window");
  }
});
