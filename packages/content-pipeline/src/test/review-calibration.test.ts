/**
 * Self-calibration against the REAL committed corpus (no iCloud needed):
 * a review generator that can't surface the pilot unit's known
 * duplicate-headword ("trick or treat" Word File + "Trick or treat!" phrase)
 * is wrong by construction.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { buildWordbankReview } from "../review-wordbank.ts";

test("g2-u03 review doc detects the known duplicate-headword (open or resolved-sticky)", () => {
  const review = buildWordbankReview("g2-u03");
  // Before ingest the flag is OPEN; after approval it appears as a sticky
  // resolved verdict. Either way the detector must have fired.
  const open = review.openFlags.filter(
    (f) => f.kind === "duplicate-headword" && (f.entryId ?? "").includes("trick-or-treat"),
  );
  const resolved = review.resolvedEarlier.filter((r) => r.key.includes("duplicate-headword") && r.key.includes("trick-or-treat"));
  assert.ok(
    open.length + resolved.length >= 1,
    `expected the trick-or-treat duplicate detected; open=[${review.openFlags.map((f) => f.key).join(",")}] resolved=[${review.resolvedEarlier.map((r) => r.key).join(",")}]`,
  );
  assert.match(review.markdown, /duplicate-headword/);
});

test("g2-u03 review doc is byte-stable and lists every entry", () => {
  const a = buildWordbankReview("g2-u03");
  const b = buildWordbankReview("g2-u03");
  assert.equal(a.markdown, b.markdown);
  assert.equal(a.rows.length >= 30, true, `expected the full table, got ${a.rows.length} rows`);
  assert.match(a.markdown, /<!-- domigo:review wordbank g2-u03 round=\d+ bank=[0-9a-f]{12} -->/);
});

test("g2-u03 v1 parity is computed from the committed snapshot", () => {
  const review = buildWordbankReview("g2-u03");
  assert.match(review.markdown, /\*\*v1 parity:\*\* \d+\/\d+ v1 words present/);
});
