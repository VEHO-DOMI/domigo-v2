import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { ComprehensionItem, Story, StoryComprehensionFile, storyGrammarMatches } from "../index.ts";
const read = (path: string) => JSON.parse(readFileSync(new URL(`../../../../${path}`, import.meta.url), "utf8"));
const base = "content/corpus/stories/g3.st.fourteen/";
const story = Story.parse(read(base + "story.json"));
const items = StoryComprehensionFile.parse(read(base + "comprehension.json")).items;

test("all tagged FOURTEEN tasks belong to an original chapter scene and a real unit structure", () => {
  const tagged = items.filter((i) => i.structureId);
  assert.equal(tagged.length, 15);
  for (const item of tagged) {
    const unit = Number(item.id.slice(3, 5));
    const chapter = story.chapters.find((c) => c.unit === unit)!;
    const structures = read(`content/corpus/units/g3-u${String(unit).padStart(2, "0")}/grammar.json`).items.map((i: { structureId: string }) => i.structureId);
    assert.ok(storyGrammarMatches(item, chapter, structures), item.id);
    assert.equal(storyGrammarMatches({ ...item, structureId: `g3u${String(unit).padStart(2, "0")}.s.nonexistent` }, chapter, structures), false, "unknown catalog key");
    assert.equal(storyGrammarMatches(item, { ...chapter, unit: unit + 1 }, structures), false, "wrong chapter unit");
    assert.equal(storyGrammarMatches(item, { ...chapter, scenes: [] }, structures), false, "orphan task");
  }
});
test("structureId is additive, same-unit only; an untagged reading task still parses", () => {
  const item = items.find((i) => i.structureId)!;
  const { structureId: _structureId, ...reading } = item;
  assert.deepEqual(ComprehensionItem.parse(reading), reading);
  assert.deepEqual(ComprehensionItem.parse(item), item);
  assert.equal(ComprehensionItem.safeParse({ ...item, structureId: "g2u01.s.present-simple" }).success, false);
  assert.equal(ComprehensionItem.safeParse({ ...item, structureId: "g3u02.s.present-simple" }).success, false);
  assert.equal(ComprehensionItem.safeParse({ ...item, structureId: "invented" }).success, false);
});
