import assert from "node:assert/strict";
import { it } from "node:test";
import type { ReactNode } from "react";
import { loadUnit, listApprovedUnits, loadUnitStructures } from "@domigo/content-loader";
import type { GrammarItem } from "@domigo/content-schema";
import type { GrammarInput } from "@domigo/engine";
import type { AttemptBody, AttemptResult } from "../attempt-outbox.ts";
import { grammarTopics } from "./grammar.ts";
import { mount, nodes, text, byClass, click, fill, check, settle, type Props } from "./grammar-render-harness.ts";
const corpus = listApprovedUnits().flatMap((slug) => loadUnit(slug).grammar);
const sample = corpus.find((item) => item.id === "g4u04.gi.reported-questions.gf.002")!;
const response: AttemptResult = { ok: true, queued: false, tier: "correct", xpAwarded: 10 };
function exercise(item: GrammarItem, extras: Props = {}) { return mount("app/modi/grammar/GrammarExercise.tsx", { item, grade: 1, memory: false, submit: async () => response, next() {}, ...extras }); }
function answer(tree: ReactNode, value: string) {
  const fields = nodes(tree).filter((node) => node.type === "input");
  value.split("|").forEach((part, i) => fill(fields[i]!, part.trim()));
}
const contains = (sentence: string, phrase: string) => {
  const escaped = phrase.replaceAll("’", "'").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![\\p{L}\\p{N}'])${escaped}(?![\\p{L}\\p{N}'])`, "iu").test(sentence.replaceAll("’", "'"));
};

it("N1 corpus gloss never discloses an unprompted answer before a hint", (t) => {
  let withheld = 0; const grades = new Set<string>(), protectedItems = new Set<string>();
  for (const item of corpus) {
    grades.add(item.id.slice(0, 2));
    const view = exercise(item), visible = byClass(view.render(), "og-grammar-gloss").map(text).join(" ");
    for (const entry of item.gloss) {
      const shown = visible.includes(`${entry.word}: ${entry.de}`), allowed = item.format === "translation" || contains(item.prompt.text, entry.word);
      assert.equal(shown, allowed, `${item.id}: ${entry.word}`);
      if (!allowed && item.answers.some((a) => a.tier === "full" && contains(a.text, entry.word))) { withheld++; protectedItems.add(item.id); assert.equal(shown, false, item.id); }
    }
  }
  assert.deepEqual([...grades].sort(), ["g1", "g2", "g3", "g4"]); assert.ok(withheld > 0);
  t.diagnostic(`${corpus.length} corpus items checked; ${protectedItems.size} items with ${withheld} unprompted answer-gloss entries withheld`);
  const view = exercise(sample);
  assert.doesNotMatch(byClass(view.render(), "og-grammar-gloss").map(text).join(""), /whether/);
  click(byClass(view.render(), "og-grammar-hint")[0]!);
  assert.match(byClass(view.render(), "og-grammar-gloss").map(text).join(""), /whether: ob/);
});
it("N2 actual exercise checks submit exactly once with the displayed item, including a double click", async () => {
  const sent: { item: GrammarItem; input: GrammarInput }[] = []; let resolve!: (result: AttemptResult) => void;
  const view = exercise(sample, { submit: (item: GrammarItem, input: GrammarInput) => { sent.push({ item, input }); return new Promise<AttemptResult>((done) => { resolve = done; }); } });
  check(view.render()); assert.equal(sent.length, 0);
  const expected = sample.answers.find((a) => a.tier === "full")!.text;
  answer(view.render(), expected); const tree = view.render(); check(tree); check(tree);
  assert.equal(sent.length, 1); assert.equal(sent[0]!.item.id, byClass(tree, "og-grammar-exercise")[0]!.props["data-item"]);
  assert.deepEqual(JSON.parse(JSON.stringify(sent[0]!.input)), { kind: "text", value: expected.split("|").map((s) => s.trim()).join(" | ") });
  resolve(response); await settle(); assert.match(view.html(), /Richtig!/); assert.doesNotMatch(view.html(), /Stark!/);
  check(view.render()); assert.equal(sent.length, 1);
});
it("N3 actual Memory sends one complete map only after all pairs are assigned and Check is pressed", async () => {
  const item = corpus.find((entry) => entry.id.startsWith("g1") && entry.format === "matching-pairs" && entry.pairs.length >= 2)!;
  const sent: { id: string; input: GrammarInput }[] = [];
  const view = exercise(item, { memory: true, submit: async (entry: GrammarItem, input: GrammarInput) => { sent.push({ id: entry.id, input }); return response; } });
  for (let i = 0; i < item.pairs.length; i++) {
    check(view.render()); assert.equal(sent.length, 0, "incomplete map is not an attempt");
    click(byClass(view.render(), "og-memory-card")[i * 2]!); assert.equal(sent.length, 0);
    click(byClass(view.render(), "og-memory-card")[i * 2 + 1]!);
    click(nodes(view.render()).find((node) => node.type === "button" && text(node) === "A und B zuordnen")!);
    assert.equal(sent.length, 0, "pairing is not an attempt");
  }
  assert.equal(nodes(view.render()).find((node) => node.props.type === "submit")!.props.disabled, false);
  check(view.render()); await settle(); assert.equal(sent.length, 1); assert.equal(sent[0]!.id, item.id);
  assert.deepEqual(JSON.parse(JSON.stringify(sent[0]!.input)), { kind: "matching", value: Object.fromEntries(item.pairs.map((pair) => [pair.left, pair.right])) });
});
it("N4 actual HTML reveals only the requested hint, then the explanation after done", async () => {
  for (const grade of [1, 2, 3, 4]) {
    const item: GrammarItem = { ...sample, prompt: { ...sample.prompt, text: "Complete the sentence: ___.", blanks: 1 }, gloss: [], answers: [{ text: "ANSWER_SENTINEL", tier: "full" }], hintDe: "HINWEIS_DE_SENTINEL", hintEn: "HINT_EN_SENTINEL", explainDe: "ERKLAERUNG_DE_SENTINEL", explainEn: "EXPLANATION_EN_SENTINEL" };
    const view = exercise(item, { grade, submit: async () => ({ ok: true, queued: false, tier: "wrong", xpAwarded: 0 }) });
    assert.doesNotMatch(view.html(), /HINWEIS_DE_SENTINEL|HINT_EN_SENTINEL|ERKLAERUNG_DE_SENTINEL|EXPLANATION_EN_SENTINEL|ANSWER_SENTINEL/);
    answer(view.render(), "a submitted answer"); check(view.render()); await settle();
    assert.doesNotMatch(view.html(), /HINWEIS_DE_SENTINEL|HINT_EN_SENTINEL|ERKLAERUNG_DE_SENTINEL|EXPLANATION_EN_SENTINEL|ANSWER_SENTINEL/);
    click(byClass(view.render(), "og-grammar-hint")[0]!);
    assert.ok(view.html().includes(grade === 1 ? item.hintDe : item.hintEn!));
    assert.doesNotMatch(view.html(), /ERKLAERUNG_DE_SENTINEL|EXPLANATION_EN_SENTINEL|ANSWER_SENTINEL/);
    check(view.render()); await settle();
    assert.doesNotMatch(view.html(), /ERKLAERUNG_DE_SENTINEL|EXPLANATION_EN_SENTINEL|ANSWER_SENTINEL/);
    check(view.render()); await settle();
    assert.ok(view.html().includes(grade === 1 ? item.explainDe : item.explainEn!)); assert.match(view.html(), /ANSWER_SENTINEL/);
  }
});
it("N5 real ModeSwitch routes and stores the right year-specific preference; preview never writes", () => {
  for (const grade of [1, 2, 3, 4]) for (const preview of [false, true]) for (const mode of ["vocab", "grammar"]) {
    const view = mount("app/home/ModeSwitch.tsx", { grade, preview }); view.stored.set(`domigo-trainer-mode-g${grade}`, mode);
    const link = nodes(view.render()).find((node) => node.type === "a")!, current = preview ? "vocab" : mode;
    assert.equal(link.props["data-mode"], current);
    assert.equal(link.props.href, (current === "grammar" ? "/modi" : "/modi/grammar") + (preview ? `?jahrgang=${grade}` : ""));
    click(link); assert.deepEqual(view.writes, preview ? [] : [[`domigo-trainer-mode-g${grade}`, current === "grammar" ? "vocab" : "grammar"]]);
    assert.equal(view.stored.get(`domigo-trainer-mode-g${grade}`), preview ? mode : current === "grammar" ? "vocab" : "grammar");
    const explicit = mount("app/home/ModeSwitch.tsx", { grade, preview, mode: "grammar" });
    const back = nodes(explicit.render()).find((node) => node.type === "a")!;
    assert.equal(back.props.href, `/modi${preview ? `?jahrgang=${grade}` : ""}`); click(back);
    assert.deepEqual(explicit.writes, preview ? [] : [[`domigo-trainer-mode-g${grade}`, "vocab"]]);
  }
});
it("N6 actual session sends displayed IDs and shows only confirmed totals after the final task", async () => {
  const pool = loadUnit("g2-u01").grammar;
  const items = pool.filter((item) => item.structureId === pool[0]!.structureId && ["gap-fill", "error-correction", "sentence-building"].includes(item.format)).slice(0, 3);
  assert.equal(items.length, 3);
  assert.ok(items.every((item) => item.structureId === items[0]!.structureId));
  const replies: AttemptResult[] = [response, { ok: true, queued: false, tier: "close", xpAwarded: 3 }, { ok: false, queued: true, tier: "correct", xpAwarded: 999 }], sent: AttemptBody[] = [];
  const view = mount("app/modi/grammar/GrammarSession.tsx", { grade: 2, preview: false, ownerId: "synthetic", items, topics: grammarTopics(items, loadUnitStructures("g2-u01")) }, {
    "@/lib/preview-attempt": { attemptSender: () => async (body: AttemptBody) => { sent.push(body); return replies[sent.length - 1]; } },
  });
  click(byClass(view.render(), "og-grammar-topic")[0]!);
  click(nodes(view.render()).find((node) => node.type === "button" && text(node) === "Start →")!);
  for (let i = 0; i < items.length; i++) {
    assert.equal(byClass(view.render(), "og-game-result").length, 0, "no early results");
    const displayed = byClass(view.render(), "og-grammar-exercise")[0]!.props["data-item"];
    for (const field of nodes(view.render()).filter((node) => node.type === "input")) fill(field, "synthetic answer");
    check(view.render()); await settle();
    assert.equal(sent.length, i + 1); assert.equal(sent[i]!.itemId, displayed); assert.equal(sent[i]!.mode, "grammar");
    click(nodes(view.render()).find((node) => node.type === "button" && text(node) === "Next →")!);
  }
  assert.equal(byClass(view.render(), "og-game-result").length, 1);
  const totals = nodes(byClass(view.render(), "og-game-totals")[0]!.props.children).filter((node) => node.type === "div").map(text);
  assert.deepEqual(totals, ["3Answers", "1Correct", "13Grammar XP"]); assert.match(view.html(), /1.*answers not yet confirmed/);
  assert.equal(new Set(sent.map((body) => body.clientAttemptId)).size, 3);
});
it("N7 actual session has Memory only in year one, German only in year one, and no preview XP", async () => {
  for (const grade of [1, 2, 3, 4]) for (const preview of [false, true]) {
    const slug = `g${grade}-u01`, item = loadUnit(slug).grammar.find((entry) => entry.format === "gap-fill")!;
    const view = mount("app/modi/grammar/GrammarSession.tsx", { grade, preview, ownerId: preview ? null : "synthetic", items: [item], topics: grammarTopics([item], loadUnitStructures(slug)) }, { "@/lib/preview-attempt": { attemptSender: () => async () => response } });
    assert.equal(nodes(view.render()).find((node) => node.type === "main")!.props.lang, grade === 1 ? "de" : "en");
    assert.equal(byClass(view.render(), "og-grammar-tabs").length, grade === 1 ? 1 : 0); assert.equal(view.html().includes("Grammar Memory Match"), grade === 1);
    const memoryProbe = mount("app/modi/grammar/GrammarSession.tsx", { grade, preview, initialMemory: true, ownerId: null, items: [item], topics: grammarTopics([item], loadUnitStructures(slug)) }, { "@/lib/preview-attempt": { attemptSender: () => async () => response } });
    assert.equal(memoryProbe.html().includes("Decke die Karten auf"), grade === 1);
    click(byClass(view.render(), "og-grammar-topic")[0]!);
    click(nodes(view.render()).find((node) => node.type === "button" && text(node) === (grade === 1 ? "Starten →" : "Start →"))!);
    answer(view.render(), item.answers.find((entry) => entry.tier === "full")!.text); check(view.render()); await settle();
    click(nodes(view.render()).find((node) => node.type === "button" && text(node) === (grade === 1 ? "Weiter →" : "Next →"))!);
    assert.equal(view.html().includes("Grammar XP"), !preview);
    for (const link of nodes(byClass(view.render(), "og-game-result")[0]).filter((node) => node.type === "a")) assert.equal(String(link.props.href).includes(`?jahrgang=${grade}`), preview);
  }
});
