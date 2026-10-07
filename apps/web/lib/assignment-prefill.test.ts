import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listReleasedStories, loadReleasedChapters, loadStory } from "@domigo/content-loader";
import { resolveAssignmentPrefill } from "./assignment-prefill.ts";

describe("preview handoff resolves the actual approved source", () => {
  const query = { source: "unit", grade: "2", unit: "g2-u01" };
  it("carries year, Chapter, items and a local return link, without a class or write", () => {
    const p = resolveAssignmentPrefill(query)!;
    assert.equal(p.source.grade, 2);
    assert.match(p.title, /Chapter 1/);
    assert.equal(p.returnHref, "/practice/g2-u01");
    assert.ok(p.sections.every((s) => s.itemIds.length > 0));
  });
  for (const bad of [
    { grade: ["2", "3"] }, { grade: "2.0" }, { grade: "3" }, { grade: "9" },
    { source: "audio" }, { unit: "../g2-u01" }, { unit: "g2-u99" },
    { mode: "checkup" }, { classId: "foreign" }, { title: "forged" }, { chapter: "ch01" },
  ]) it(`refuses manipulated query ${JSON.stringify(bad)}`, () => assert.equal(resolveAssignmentPrefill({ ...query, ...bad }), null));
  it("maps released story Chapters using their actual unit and refuses locked Chapters", () => {
    let checked = 0;
    for (const story of listReleasedStories().filter((s) => s.role === "canonical")) {
      const released = loadReleasedChapters(story.storyId);
      for (const chapter of loadStory(story.storyId)!.chapters) {
        const short = chapter.id.split(".").at(-1)!;
        const p = resolveAssignmentPrefill({ source: "story", grade: story.grade, chapter: short });
        if (released.includes(chapter.id)) {
          assert.equal(p?.source.unit, `g${story.grade}-u${String(chapter.unit).padStart(2, "0")}`);
          checked++;
        } else assert.equal(p, null);
      }
      assert.equal(resolveAssignmentPrefill({ source: "story", grade: story.grade, chapter: "ch99" }), null);
    }
    assert.ok(checked > 0);
  });
  it("does not treat the teacher-only painted book as released assignment content", () => {
    assert.equal(resolveAssignmentPrefill({ source: "story", grade: 1, chapter: "ch01" }), null);
  });
});
