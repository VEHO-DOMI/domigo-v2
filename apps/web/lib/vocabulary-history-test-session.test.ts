/** Host callback contracts; real React/card/storage/server flows are separately exercised in browser evidence. */
import assert from "node:assert/strict";
import { it } from "node:test";
import { createElement } from "react";
import { loadUnit } from "@domigo/content-loader";
import type { ResultDetail } from "@domigo/task-ui";
import type { Tier } from "@domigo/engine";
import type { AttemptBody, AttemptPreparation } from "./attempt-outbox.ts";
import { mount, nodes, text, click } from "./modi/grammar-render-harness.ts";
const item = loadUnit("g2-u01").vocab[0]!;
type CardProps = { onResult: (tier: Tier, detail: ResultDetail) => void; onCheck?: (tier: Tier, detail: ResultDetail) => void; hideHint: boolean };
const detail = (): ResultDetail => ({ kind: "vocab", itemId: item.id, input: { kind: "vocab", value: "synthetic", pool: "carrier" },
  history: { schema: "vocabulary-completion@1", visitId: crypto.randomUUID(), itemRevision: 1, contentSnapshot: "synthetic snapshot", maxChecks: 3,
    checks: [{ reportedTier: "correct", helpShown: ["gloss"] }] },
  check: { id: crypto.randomUUID(), checkedAt: "2026-10-24T12:00:00.000Z", displayedContentSha256: null },
});
function host(kind = "vocab") {
  const props = { preview: false, ownerId: "synthetic-owner", slug: "g2-u01", testId: "synthetic-test", sections: [{ kind, titleDe: "synthetic section", items: [item], passage: "Synthetic text", passageGloss: [], audio: {} }] };
  const sent: { body: AttemptBody; owner: string | null; prepared: boolean }[] = [];
  const pending: Promise<unknown>[] = [];
  let card: CardProps;
  const capture = (p: CardProps) => { card = p; return createElement("span", {}, "synthetic card"); };
  const view = mount("app/tests/[slug]/TestSession.tsx", props, {
    "@domigo/task-ui": { VocabItemView: capture, GrammarItemView: capture, AudioClip: () => null },
    "@/lib/preview-attempt": { attemptSender: (_preview: boolean, owner: string | null) => (body: AttemptBody, prepare?: AttemptPreparation) => {
      const result = (async () => { sent.push({ body: prepare ? await prepare(body) : body, owner, prepared: !!prepare }); return { ok: true, queued: false }; })();
      pending.push(result); return result;
    } },
  });
  view.render();
  return { props, sent, view, settle: () => Promise.all(pending), card: () => card!, finish: () => click(nodes(view.render()).find(n => n.type === "button" && text(n.props.children) === "Finish →")!) };
}
it("repeated terminal callback/rerender makes one completion; a new visit is distinct", async () => {
  const h = host(), d = detail();
  assert.equal(h.card().hideHint, true);
  h.card().onResult("correct", d); h.card().onResult("correct", structuredClone(d));
  await h.settle(); h.view.render(); h.card().onResult("correct", d); await h.settle();
  assert.equal(h.sent.length, 1); assert.equal(h.sent[0]!.body.mode, "test:vocab"); assert.equal(h.sent[0]!.prepared, true);
  assert.equal(h.sent[0]!.body.hintUsed, true);
  h.card().onResult("correct", detail()); await h.settle(); assert.equal(h.sent.length, 2);
  h.finish(); assert.match(text(h.view.render()), /2\/2 auto-graded correct/);
});
it("nonterminal check sends only exact test:vocab source and no completion", async () => {
  const h = host(), d = detail();
  if (d.kind === "vocab") d.history!.checks = [{ reportedTier: "wrong", helpShown: ["gloss"] }];
  h.card().onCheck!("wrong", d); await h.settle();
  assert.equal(h.sent.length, 1); const b = h.sent[0]!.body;
  assert.equal(b.mode, "vocabulary-check"); assert.equal(b.vocabularyCheck!.sourceMode, "test:vocab");
  assert.deepEqual(b.vocabularyCheck!.helpShown, ["gloss"]); assert.equal(b.vocabularyHistory, undefined); assert.equal(h.sent[0]!.prepared, false);
  h.finish(); assert.match(text(h.view.render()), /0\/0 auto-graded correct/);
});
for (const transition of ["testId", "ownerId", "slug"] as const) it(`${transition} resets Finish/results and retains the old callback's owner`, async () => {
  const h = host(), oldCallback = h.card().onResult;
  oldCallback("correct", detail()); await h.settle(); h.finish(); assert.match(text(h.view.render()), /Test complete/);
  h.props[transition] = transition === "slug" ? "g2-u02" : "new-synthetic-identity";
  assert.doesNotMatch(text(h.view.render()), /Test complete/);
  oldCallback("correct", detail()); await h.settle(); assert.equal(h.sent.at(-1)!.owner, "synthetic-owner");
  h.card().onResult("correct", detail()); await h.settle(); assert.equal(h.sent.at(-1)!.owner, h.props.ownerId);
  h.finish(); assert.match(text(h.view.render()), /1\/1 auto-graded correct/);
});
for (const kind of ["grammar", "listening", "reading"]) it(`${kind} keeps its ordinary unprepared completion path`, async () => {
  const h = host(kind);
  assert.equal(h.card().onCheck, undefined); assert.equal(h.card().hideHint, true);
  h.card().onResult("partial", { kind: "grammar", itemId: "synthetic-grammar", input: { kind: "text", value: "answer" } });
  await h.settle(); assert.equal(h.sent.length, 1); assert.equal(h.sent[0]!.body.mode, `test:${kind}`);
  assert.equal(h.sent[0]!.prepared, false); assert.equal(h.sent[0]!.body.vocabularyHistory, undefined);
  h.finish(); assert.match(text(h.view.render()), /0\/1 auto-graded correct/);
});
