import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fs from "node:fs";
import { createHash } from "node:crypto";
import "../scripts/lib/school-test-harness.mjs";
const { SchoolBattery, schoolCardView, schoolView, gradeSchoolCard } = await import("./school-contract.ts");
const { schoolAttempt } = await import("./school-attempt.ts");
const source = fs.readFileSync(new URL("../../../content/corpus/stories/g2.st.ink-ghost-goes-to-school/ch01.tasks.v2.json", import.meta.url));
const battery = SchoolBattery.parse(JSON.parse(source.toString()));
describe("Year 2 immutable battery integration", () => {
  it("pins the actual input bytes, not a rewritten task collection", () => {
    assert.equal(createHash("md5").update(source).digest("hex"), "69f40bc6a2df7bbf886058512621f6db");
    assert.equal(battery.cards.length, 14);
  });
  it("sends only the named input fields; no key, explanation or reveal before solving", () => {
    const view = schoolView(battery, [], true);
    assert.deepEqual(view.recovered, {});
    assert.deepEqual(view.ending, []);
    for (const card of view.cards) {
      assert.deepEqual(Object.keys(card).sort(), ["before", "glosses", "id", "input", "placeDe", "prompt", "required", "situationDe", "station"].sort());
      assert.ok(!JSON.stringify(card).includes('"answers"'));
    }
    // Tamper by injecting a key into the server record: explicit projection strips it.
    const contaminated = { ...battery.cards[0]!, answer: "SECRET-ANSWER", teacherKey: "SECRET-KEY" };
    assert.ok(!JSON.stringify(schoolCardView(contaminated)).includes("SECRET"));
  });
  it("grades every authored full/partial key and distractor through the real engine", () => {
    for (const card of battery.cards) {
      for (const answer of card.item.answers) assert.equal(gradeSchoolCard(card, answer.text).tier, answer.tier === "full" ? "correct" : "partial", `${card.id}: ${answer.text}`);
      for (const distractor of card.item.distractors) {
        const result = gradeSchoolCard(card, distractor);
        assert.equal(result.tier, "wrong", card.id);
        assert.deepEqual(result.after, []);
        assert.equal(result.revealEn, null);
      }
    }
  });
  it("reveals only actually completed stations and restores the note and final summary", () => {
    const one = schoolView(battery, ["spur-1", "not-a-station"], false);
    assert.deepEqual(one.solved, ["spur-1"]);
    assert.deepEqual(Object.keys(one.recovered), ["spur-1"]);
    assert.deepEqual(one.ending, []);
    const full = schoolView(battery, battery.cards.filter((c) => c.required).map((c) => c.station), false);
    assert.equal(full.recovered.zettel?.revealEn, "I had a timetable once, too.");
    assert.equal(full.ending.length, 2);
  });
});

describe("school attempt boundary", () => {
  const card = battery.cards[0]!;
  const body = { station: card.station, value: card.item.answers[0]!.text, previewSolved: [] as string[] };
  it("teacher preview never reads or writes the student ledger", async () => {
    const forbidden = async (): Promise<never> => { throw new Error("student ledger touched"); };
    const result = await schoolAttempt(battery, body, true, { solvedIds: forbidden, save: forbidden });
    assert.deepEqual(result!.view.solved, [card.station]);
  });
  it("ignores forged student progress and cannot bypass the initial suspicion", async () => {
    let saves = 0;
    const result = await schoolAttempt(battery, { ...body, station: "zettel", previewSolved: battery.cards.map(c => c.station) }, false, { solvedIds: async () => new Set(), save: async () => { saves++; } });
    assert.equal(result, null); assert.equal(saves, 0);
  });
  it("requires the alibi before the note even after every clue is solved", async () => {
    const clues = battery.cards.filter(c => ["verdacht", "spur-1", "spur-2", "spur-3", "spur-4"].includes(c.station));
    const ids = new Set(clues.map(c => c.item.id));
    let saves = 0;
    const ledger = { solvedIds: async () => ids, save: async () => { saves++; } };
    const note = battery.cards.find(c => c.station === "zettel")!;
    const request = { station: note.station, value: note.item.answers[0]!.text, previewSolved: ["alibi"] };
    assert.equal(await schoolAttempt(battery, request, false, ledger), null);
    assert.equal(saves, 0);
    ids.add(battery.cards.find(c => c.station === "alibi")!.item.id);
    assert.ok(await schoolAttempt(battery, request, false, ledger));
    assert.equal(saves, 1);
  });
  it("reads authoritative progress after duplicate writes and propagates storage errors", async () => {
    const result = await schoolAttempt(battery, body, false, { solvedIds: async () => new Set(), save: async () => {} });
    assert.deepEqual(result!.view.solved, []);
    await assert.rejects(schoolAttempt(battery, body, false, { solvedIds: async () => new Set(), save: async () => { throw new Error("offline"); } }), /offline/);
  });
  it("records a fully correct attempt and restores it from the ledger", async () => {
    const ids = new Set<string>();
    const result = await schoolAttempt(battery, body, false, { solvedIds: async () => ids, save: async (c, result) => { assert.equal(result.tier, "correct"); ids.add(c.item.id); } });
    assert.deepEqual(result!.view.solved, [card.station]);
  });
});
