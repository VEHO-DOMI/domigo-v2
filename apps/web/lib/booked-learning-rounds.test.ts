import assert from "node:assert/strict";
import { it } from "node:test";
import { createElement } from "react";
import { loadUnit } from "@domigo/content-loader";
import type { AttemptResult } from "./attempt-outbox.ts";
import { mount, nodes, text, click, settle } from "./modi/grammar-render-harness.ts";
const item = loadUnit("g2-u03").vocab[0]!;
for (const file of ["app/review/session/ReviewSession.tsx", "app/learn/[slug]/[node]/PathPracticeNode.tsx"]) {
  function fixture(preview = false) {
    const sent: { id: string; resolve: (r: AttemptResult) => void }[] = [];
    let receive: (id: string, r: AttemptResult) => void = () => {};
    const props = { preview, ownerId: "synthetic-owner", today: "2026-10-24", items: [{ kind: "vocab", item }],
      unitSlug: "g2-u03", nodeId: "synthetic", isCheckpoint: false, attemptMode: "journey:g2-u03:synthetic" };
    const view = mount(file, props, {
      "@/lib/useOutboxFlush": { useOutboxFlush(_enabled: boolean, _owner: string, reply: typeof receive) { receive = reply; } },
      "@/lib/preview-attempt": { attemptSender: () => (body: { clientAttemptId: string }) => new Promise<AttemptResult>(resolve => sent.push({ id: body.clientAttemptId, resolve })) },
      "@domigo/task-ui": {
        VocabItemView: ({ onResult, hideXp }: { onResult: (tier: string, detail: unknown) => void; hideXp: boolean }) => {
          assert.equal(hideXp, true, "card must not show local XP");
          return createElement("button", { onClick: () => onResult("correct", { itemId: item.id, input: { kind: "vocab", value: "synthetic" } }) }, "answer");
        }, GrammarItemView: ({ hideXp }: { hideXp: boolean }) => { assert.equal(hideXp, true); return null; },
      },
    });
    return { props, view, sent, reply: (id: string, r: AttemptResult) => receive(id, r),
      answer: () => click(nodes(view.render()).find(n => n.type === "button" && text(n.props.children) === "answer")!),
      xp: () => Number(nodes(view.render()).map(n => text(n.props.children)).find(s => /^\d+ XP/.test(s))?.match(/^(\d+) XP/)?.[1]) };
  }
  const booked: AttemptResult = { ok: true, queued: false, tier: "correct", xpAwarded: 99, receipt: { tier: "partial", xpAwarded: 7 }, streak: 2 };
  it(`${file}: waits for stored receipt and counts each booking once`, async () => {
    const f = fixture(); f.answer(); assert.equal(f.xp(), 0);
    f.reply(f.sent[0]!.id, booked); assert.equal(f.xp(), 7);
    f.reply(f.sent[0]!.id, { ...booked, receipt: { tier: "correct", xpAwarded: 99 } });
    assert.equal(f.xp(), 7, "a second receipt must not change even the intermediate display");
    f.sent[0]!.resolve(booked); await settle(); assert.equal(f.xp(), 7);
  });
  for (const reply of [
    { ok: false, queued: false, receipt: booked.receipt },
    { ok: false, queued: true, receipt: booked.receipt },
    { ok: true, queued: true, receipt: booked.receipt },
    { ok: true, queued: false, xpAwarded: 20 },
  ]) it(`${file}: unconfirmed or missing receipt stays zero (${JSON.stringify(reply)})`, async () => {
    const f = fixture(); f.answer(); f.sent[0]!.resolve(reply); await settle(); assert.equal(f.xp(), 0);
  });
  it(`${file}: preview ignores even a faulty positive receipt`, async () => {
    const f = fixture(true); f.answer(); f.sent[0]!.resolve(booked); await settle(); assert.equal(f.xp(), 0);
  });
  it(`${file}: duplicate callback and foreign receipt cannot add points`, () => {
    const f = fixture(); f.answer(); f.answer(); assert.equal(f.sent.length, 1);
    f.reply("foreign-attempt", booked); assert.equal(f.xp(), 0);
  });
  for (const changed of ["owner", "day", "preview", "content", ...(file.includes("Path") ? ["mode", "node"] : [])]) it(`${file}: ${changed} starts a round without stale points`, async () => {
    const f = fixture(); f.answer();
    if (changed === "owner") f.props.ownerId = "other-synthetic-owner";
    if (changed === "day") f.props.today = "2026-10-25";
    if (changed === "preview") f.props.preview = true;
    if (changed === "content") f.props.items = [{ kind: "vocab", item: { ...item, rev: item.rev + 1 } }];
    if (changed === "mode") f.props.attemptMode = "study:synthetic";
    if (changed === "node") f.props.nodeId = "another";
    f.view.render(); f.sent[0]!.resolve(booked); await settle(); assert.equal(f.xp(), 0);
    assert.doesNotMatch(text(f.view.render()), /Finish →/);
    f.answer(); assert.equal(f.sent.length, 2);
  });
  it(`${file}: unchanged content retains confirmed points`, async () => {
    const f = fixture(); f.answer(); f.sent[0]!.resolve(booked); await settle();
    f.props.items = f.props.items.map(x => ({ ...x, item: { ...x.item } })); assert.equal(f.xp(), 7);
  });
}
