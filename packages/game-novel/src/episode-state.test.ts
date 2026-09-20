import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { Story, StoryComprehensionFile, StoryEconomy, type GrammarItem } from "@domigo/content-schema";
import { gradeGrammar } from "@domigo/engine";
import { audienceAt, commentsAfter, episodeEnding, isFixSlot, validTakes } from "./episode-state.ts";
import { episodeComments, resultLine } from "./novel-copy.ts";

const read = (file: string) => JSON.parse(fs.readFileSync(new URL(`../../../${file}`, import.meta.url), "utf8"));
const base = "content/corpus/stories/g3.st.fourteen/";
const story = Story.parse(read(base + "story.json"));
const economy = StoryEconomy.parse(read(base + "economy.json")).episodes;
const items = StoryComprehensionFile.parse(read(base + "comprehension.json")).items;
const overlay = read("content/overlays/g3-fourteen-feedback.json") as { items: typeof items; bindings: { itemId: string; sceneId: string; slot: string }[] };

test("audience reveal never leaks later episodes and survives the no-upload arc", () => {
  for (const [index, c] of story.chapters.entries()) {
    assert.equal(audienceAt(c, c.scenes[0]!.id, false, economy)?.chapterId, economy[index - 1]?.chapterId);
    assert.equal(audienceAt(c, c.scenes.at(-1)!.id, true, economy)?.chapterId, c.id);
    const firstReveal = c.scenes.findIndex((s) => s.textEn.includes("{{"));
    if (firstReveal > 0) {
      assert.equal(audienceAt(c, c.scenes[firstReveal - 1]!.id, false, economy)?.chapterId, economy[index - 1]?.chapterId);
      assert.equal(audienceAt(c, c.scenes[firstReveal]!.id, false, economy)?.chapterId, c.id);
    }
  }
});

test("no upload or celebration during the rupture; no false clean-take praise", () => {
  for (const unit of [11, 12, 13]) {
    assert.doesNotMatch(JSON.stringify(episodeEnding(unit)), /uploaded|is live|congratulations|🎬/i);
  }
  assert.equal(episodeComments(0, 1, "reckoning").line, episodeComments(1, 1, "reckoning").line);
  assert.doesNotMatch(resultLine("grammar", "partial", 5).text, /clean|views/i);
  assert.doesNotMatch(resultLine("grammar", "correct").text, /\+/);
  assert.match(resultLine("grammar", "correct", 7).text, /Writing \+7/);
});

test("cosmetic answers are confined to this chapter; late episodes retire fixing Ben", () => {
  const c = story.chapters[0]!;
  assert.deepEqual(validTakes(c, { "fix-bens-line": { tier: "wrong" }, nonsense: { tier: "correct" }, recap: { tier: "invented" } }), { "fix-bens-line": { tier: "wrong" } });
  for (const late of story.chapters.filter((c) => c.unit >= 12)) assert.ok(!late.scenes.some((s) => s.taskSlots.some((t) => isFixSlot(t.slot))));
});

test("every authored feedback task resolves, uses a different form, accepts all its keys and rejects blanks", () => {
  for (const c of story.chapters.slice(1)) {
    const refs = c.scenes.flatMap((s) => s.taskSlots.map((t) => t.itemId));
    const authored = overlay.items.filter((i) => refs.includes(i.id));
    assert.equal(authored.length, 2, c.id);
    assert.equal(new Set(authored.map((i) => i.format)).size, 2, c.id);
    assert.ok(authored.some((i) => ["gap-fill", "sentence-building"].includes(i.format)), c.id);
  }
  for (const authored of overlay.items) {
    const live = items.find((i) => i.id === authored.id);
    assert.deepEqual(live, authored, `${authored.id}: overlay drift`);
    const item = authored as unknown as GrammarItem;
    const kind = ["multiple-choice", "context-picker"].includes(item.format) ? "choice" : "text";
    if (item.pairs.length) {
      const value = Object.fromEntries(item.pairs.map((p) => [p.left, p.right]));
      assert.equal(gradeGrammar(item, { kind: "matching", value }).tier, "correct", item.id);
      assert.equal(gradeGrammar(item, { kind: "matching", value: {} }).tier, "wrong", item.id);
      assert.notEqual(gradeGrammar(item, { kind: "matching", value: Object.fromEntries(item.pairs.map((p, i) => [p.left, item.pairs[(i + 1) % item.pairs.length]!.right])) }).tier, "correct", item.id);
    } else if (item.groups.length) {
      const value = Object.fromEntries(item.groups.flatMap((g) => g.members.map((m) => [m, g.label])));
      assert.equal(gradeGrammar(item, { kind: "groupSort", value }).tier, "correct", item.id);
      assert.equal(gradeGrammar(item, { kind: "groupSort", value: {} }).tier, "wrong", item.id);
    } else {
      for (const answer of item.answers.filter((a) => a.tier === "full")) assert.equal(gradeGrammar(item, { kind, value: answer.text }).tier, "correct", `${item.id}: ${answer.text}`);
      assert.equal(gradeGrammar(item, { kind, value: "" }).tier, "wrong", item.id);
      for (const answer of item.distractors) assert.equal(gradeGrammar(item, { kind, value: answer }).tier, "wrong", `${item.id}: distractor`);
    }
  }
});

test("new items level-gate every visible field, including matching pairs and group labels", async () => {
  const { buildAllowedMatcher } = await import("../../content-pipeline/src/cumulative-bank.ts");
  const names = read(base + "names.json").names.map((n: { name: string }) => n.name) as string[];
  for (const item of overlay.items) {
    const text = [item.prompt.text, ...item.answers.map((a) => a.text), ...item.distractors,
      ...item.pairs.flatMap((p) => [p.left, p.right]), ...item.groups.flatMap((g) => [g.label, ...g.members])].join(" ");
    const unknown = buildAllowedMatcher(`g3-u${item.id.slice(3, 5)}`).unknownTokens(text, { extraPhrases: [...names, ...item.gloss.map((g) => g.word)] });
    assert.deepEqual(unknown, [], `${item.id}: ${unknown.join(", ")}`);
  }
});

test("sentence tiles really build every accepted word order", async () => {
  const { sbChips, sbAnswerOrder } = await import("../../task-ui/src/tactile.ts");
  for (const item of overlay.items.filter((i) => i.format === "sentence-building")) {
    const chips = sbChips(item.prompt.text);
    for (const answer of item.answers.filter((a) => a.tier === "full")) {
      const order = sbAnswerOrder(chips, answer.text);
      assert.ok(order, `${item.id}: ${answer.text}`);
      assert.equal(order.length, chips.length, `${item.id}: every chip is used`);
    }
  }
});

 test("the compilation comments follow the reveal, never spoil it", () => {
  assert.equal(commentsAfter(10, "fix-bens-line"), true);
  assert.equal(commentsAfter(11, "fix-bens-line"), false);
  assert.equal(commentsAfter(11, "recap"), true);
  assert.equal(commentsAfter(12, "recap"), false);
});
