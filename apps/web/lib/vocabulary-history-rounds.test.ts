import assert from "node:assert/strict";
import { it } from "node:test";
import { createElement } from "react";
import { loadUnit } from "@domigo/content-loader";
import { mount, nodes, text, click, settle } from "./modi/grammar-render-harness.ts";
const item = loadUnit("g2-u01").vocab[0]!;
for (const file of ["app/review/session/ReviewSession.tsx", "app/learn/[slug]/[node]/PathPracticeNode.tsx"]) {
  for (const changed of (["revision", "wording", "owner", "checkpoint"] as const).filter(change => change !== "checkpoint" || !file.includes("review"))) it(`${file}: ${changed} starts a fresh unanswered round`, async () => {
    const props = { preview: false, ownerId: "synthetic-owner", items: [{ kind: "vocab", item }], unitSlug: "g2-u01", nodeId: "vocab-practice-1", isCheckpoint: false };
    let sent = 0;
    const view = mount(file, props, {
      "@/lib/preview-attempt": { attemptSender: () => async () => { sent++; return { ok: true, queued: false }; } },
      "@domigo/task-ui": { VocabItemView: ({ onResult }: { onResult: (tier: string, detail: unknown) => void }) => createElement("button", {
        onClick: () => onResult("correct", { kind: "vocab", itemId: item.id, input: { kind: "vocab", value: "synthetic" } }),
      }, "synthetic answer") },
    });
    const answer = () => click(nodes(view.render()).find(n => n.type === "button" && text(n.props.children) === "synthetic answer")!);
    answer(); await settle(); assert.equal(sent, 1); assert.match(text(view.render()), /Finish →/);
    if (changed === "revision") props.items = [{ kind: "vocab", item: { ...item, rev: item.rev + 1 } }];
    if (changed === "wording") props.items = [{ kind: "vocab", item: { ...item, s: "Changed ___ context." } }];
    if (changed === "owner") props.ownerId = "another-synthetic-owner";
    if (changed === "checkpoint") props.isCheckpoint = true;
    assert.doesNotMatch(text(view.render()), /Finish →/);
    answer(); await settle(); assert.equal(sent, 2);
    // A new object carrying identical content is not a new exercise.
    props.items = props.items.map(i => ({ ...i, item: { ...i.item } }));
    assert.match(text(view.render()), /Finish →/);
  });
}
