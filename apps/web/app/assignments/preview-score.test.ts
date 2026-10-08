import assert from "node:assert/strict";
import { test } from "node:test";
import type { Tier } from "@domigo/engine";
import { AHS_DEFAULT_NOTENSCHLUESSEL, TIER_POINTS } from "../../../../packages/db/src/assignments.ts";
import { scoreSubmittedSession } from "../../../../packages/db/src/assignment-session.ts";
import { scoreCheckup } from "../../../../packages/db/src/checkup.ts";
import { rememberPreviewTier, scorePreviewAssignment, scorePreviewCheckup } from "./[id]/preview-score.ts";

const policy = { tierPoints: TIER_POINTS, notenSchluessel: AHS_DEFAULT_NOTENSCHLUESSEL };
const states: Array<Tier | undefined> = [undefined, "wrong", "close", "partial", "correct"];
const sections = [
  { position: 0, kind: "vocab" as const, itemIds: ["a", "b"], weightPct: 30, points: 7 },
  { position: 1, kind: "grammar" as const, itemIds: ["c"], weightPct: 70, points: 13 },
];

function attemptsOf(tiers: Map<string, Tier>) {
  return [...tiers].map(([itemId, tier]) => ({ itemId, tier, createdAt: new Date(0) }));
}

test("preview scorer agrees with canonical scorers for every tier, blank, mode and custom scale", () => {
  for (const a of states) for (const b of states) for (const c of states) {
    const tiers = new Map<string, Tier>();
    for (const [id, tier] of [["a", a], ["b", b], ["c", c]] as const) if (tier) tiers.set(id, tier);
    const attempts = attemptsOf(tiers);
    for (const mode of ["practice", "mock_test"] as const) {
      for (const notenSchluessel of [policy.notenSchluessel, { 1: 92, 2: 81, 3: 67, 4: 51 }]) {
        const expected = scoreSubmittedSession({ mode, sections, attempts, notenSchluessel });
        assert.deepEqual(scorePreviewAssignment(mode, sections, tiers, { ...policy, notenSchluessel }), {
          note: expected.note, displayPct: expected.displayPct,
        });
      }
    }
    assert.deepEqual(scorePreviewCheckup(sections, tiers, policy), scoreCheckup(sections, attempts));
  }
});

test("preview keeps only the first reported attempt and counts unresolved or unanswered authored items", () => {
  const tiers = new Map<string, Tier>();
  rememberPreviewTier(tiers, "a", "partial");
  rememberPreviewTier(tiers, "a", "correct");
  assert.equal(tiers.get("a"), "partial");
  const expected = scoreSubmittedSession({ mode: "practice", sections, attempts: attemptsOf(tiers) });
  assert.deepEqual(scorePreviewAssignment("practice", sections, tiers, policy), { note: expected.note, displayPct: expected.displayPct });
  assert.equal(expected.displayPct, 16.67);
});

test("preview scoring preserves empty sections, zero weights and exact grade boundaries", () => {
  const empty = [{ position: 0, kind: "vocab" as const, itemIds: [], weightPct: 0, points: 0 }];
  assert.deepEqual(scorePreviewAssignment("mock_test", empty, new Map(), policy), { note: 5, displayPct: 0 });
  assert.deepEqual(scorePreviewCheckup(empty, new Map(), policy), scoreCheckup(empty, []));
  const many = [{ position: 0, kind: "vocab" as const, itemIds: Array.from({ length: 1000 }, (_, i) => String(i)), weightPct: 100 }];
  const tiers = new Map<string, Tier>(many[0]!.itemIds.slice(0, 899).map((id) => [id, "correct"]));
  assert.deepEqual(scorePreviewAssignment("mock_test", many, tiers, policy), { note: 2, displayPct: 89.9 });
});
