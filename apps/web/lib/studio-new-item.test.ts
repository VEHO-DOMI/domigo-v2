import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";
import { GrammarItem } from "@domigo/content-schema";
import { buildGrammarItem, STUDIO_GRAMMAR_FORMATS, submitStudioItem, type NewGrammarInput, type StudioCreateResult } from "./studio-new-item.ts";
import { preGate } from "./studio-gate.ts";

const input: NewGrammarInput = {
  unitSlug: "g2-u03", structureId: "g2u03.s.should", format: "multiple-choice", occupiedIds: ["g2u03.gi.should.mc.001"],
  prompt: " You ___ drink some water. ", lang: "en", answers: [{ text: " should ", tier: "full" }],
  distractors: [" coulds ", "shoulds", "musts"], hintDe: " Denk an einen Ratschlag. ",
  explainDe: " Mit should gibst du einen Ratschlag. ", difficulty: 2,
};

describe("Studio grammar form construction", () => {
  for (const format of STUDIO_GRAMMAR_FORMATS) {
    it(`${format} produces a coherent full item whose authored key passes the real pre-gate`, () => {
      const { id, item } = buildGrammarItem({ ...input, format });
      assert.equal(item.id, id);
      assert.equal(GrammarItem.safeParse(item).success, true);
      assert.equal(item.prompt.blanks, 1);
      assert.equal(item.prompt.text, "You ___ drink some water.");
      assert.deepEqual(item.answers, [{ text: "should", tier: "full" }]);
      const result = preGate("grammar", item);
      assert.equal(result.ok, true, result.errors.join("; "));
      assert.ok(result.keyChecks.every((check) => check.tier === "correct"));
    });
  }
  it("retains authored partial answers, German prompts and free-text distractor semantics", () => {
    const { item } = buildGrammarItem({ ...input, format: "gap-fill", lang: "de", answers: [...input.answers, { text: " must ", tier: "partial" }] });
    assert.equal(item.prompt.lang, "de");
    assert.deepEqual(item.answers[1], { text: "must", tier: "partial" });
    assert.deepEqual(item.distractors, []);
    assert.equal(item.hintDe, "Denk an einen Ratschlag.");
    assert.equal(item.explainDe, "Mit should gibst du einen Ratschlag.");
  });
  it("does not build a structure from another unit", () => {
    assert.throws(() => buildGrammarItem({ ...input, structureId: "g2u04.s.should" }), /gewählten Einheit/);
  });
  it("schema rejects a grammar key with no full answer before any sandbox call", () => {
    const { item } = buildGrammarItem({ ...input, answers: [{ text: "should", tier: "partial" }] });
    assert.equal(preGate("grammar", item).ok, false);
  });
});

describe("Studio form request pipeline", () => {
  for (const kind of ["grammar", "vocab"] as const) {
    it(`${kind} preserves its kind through pre-gate, save and asynchronous publish`, async () => {
      const built = buildGrammarItem(input);
      const sent: Record<string, unknown>[] = [];
      const result = await submitStudioItem({ ...built, kind, unitSlug: input.unitSlug }, true, async (body) => {
        sent.push(body);
        return body.action === "publish" ? { ok: true, status: "checking", runId: "synthetic-run" } : { ok: true };
      });
      assert.deepEqual(sent.map((body) => body.action), ["pregate", "save", "publish"]);
      assert.equal(sent[0]!.kind, kind);
      assert.equal(sent[1]!.kind, kind);
      assert.equal(sent[1]!.draftAction, "create");
      assert.equal(sent[1]!.item, built.item);
      assert.equal(result.status, "checking");
    });
  }
  for (const failure of ["pregate", "save"] as const) {
    it(`a failed ${failure} cannot reach publish`, async () => {
      const sent: string[] = [];
      const result = await submitStudioItem({ ...buildGrammarItem(input), kind: "grammar", unitSlug: input.unitSlug }, true, async (body) => {
        sent.push(String(body.action));
        return { ok: body.action !== failure, errors: ["synthetic rejection"] };
      });
      assert.equal(result.ok, false);
      assert.deepEqual(sent, failure === "pregate" ? ["pregate"] : ["pregate", "save"]);
    });
  }
  it("saving a draft never starts the paid publish path", async () => {
    const sent: string[] = [];
    await submitStudioItem({ ...buildGrammarItem(input), kind: "grammar", unitSlug: input.unitSlug }, false, async (body) => {
      sent.push(String(body.action));
      return { ok: true };
    });
    assert.deepEqual(sent, ["pregate", "save"]);
  });
  for (const published of [true, false]) {
    it(`a ${published ? "started" : "failed"} publish preserves the confirmed saved draft ID for later edits`, async () => {
      const draftId = "11111111-1111-4111-8111-111111111111";
      const result = await submitStudioItem({ ...buildGrammarItem(input), kind: "grammar", unitSlug: input.unitSlug }, true, async (body) => {
        if (body.action === "save") return { ok: true, draftId, status: "draft" };
        if (body.action === "publish") return { ok: published, status: published ? "checking" : "blocked" };
        return { ok: true };
      });
      assert.equal(result.draftId, draftId);
      assert.equal(result.ok, published);
    });
  }
  it("an edit sends only the saved draft's row ID; a fresh form sends none", async () => {
    const draftId = "11111111-1111-4111-8111-111111111111";
    const saves: Record<string, unknown>[] = [];
    const post = async (body: Record<string, unknown>) => {
      if (body.action === "save") saves.push(body);
      return { ok: true, draftId };
    };
    const request = { ...buildGrammarItem(input), kind: "grammar" as const, unitSlug: input.unitSlug };
    await submitStudioItem(request, false, post);
    await submitStudioItem({ ...request, draftId }, false, post);
    assert.equal("draftId" in saves[0]!, false);
    assert.equal(saves[1]!.draftId, draftId);
  });
  it("a thrown publication request retains the saved draft ID and reports an unconfirmed publish", async () => {
    const draftId = "11111111-1111-4111-8111-111111111111";
    const result = await submitStudioItem<StudioCreateResult>({ ...buildGrammarItem(input), kind: "grammar", unitSlug: input.unitSlug }, true, async (body) => {
      if (body.action === "save") return { ok: true, draftId, status: "draft" };
      if (body.action === "publish") throw new Error("synthetic connection interrupted");
      return { ok: true };
    });
    assert.equal(result.ok, false);
    assert.equal(result.draftId, draftId);
    assert.equal(result.error, "publish_unconfirmed");
    assert.ok(result.errors?.length);
  });
  it("the visible form uses the shared pipeline and the real grammar renderer", () => {
    const source = fs.readFileSync(new URL("../app/admin/studio/new/NewItemForm.tsx", import.meta.url), "utf8");
    assert.match(source, /submitStudioItem\(\{ \.\.\.built, kind, unitSlug,/);
    assert.match(source, /savedDraft\?\.id === built.id \? \{ draftId: savedDraft.draftId \}/);
    assert.match(source, /<option value="grammar">Grammatik<\/option>/);
    assert.match(source, /GrammarItemView key=\{previewKey\} item=\{preview.item\}/);
    assert.doesNotMatch(source, /action: "(?:save|pregate)",[^\n]*kind: "vocab"/);
    const page = fs.readFileSync(new URL("../app/admin/studio/[slug]/page.tsx", import.meta.url), "utf8");
    assert.match(page, /loadCheckedStudioDraftsForUnit\(getDb\(\), \{ scope: teacher.classScope,/);
    assert.match(page, /fullDraft: \{ draftId: draft.id, item, action:/);
  });
});
