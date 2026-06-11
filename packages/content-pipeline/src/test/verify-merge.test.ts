/** Stage-6 merge semantics (pure core). */
import assert from "node:assert/strict";
import { test } from "node:test";
import { mergeLensFlags, type VerifyFlagsT } from "../verify-items.ts";

const HASH = "abcdefabcdef";

function lensFile(lens: VerifyFlagsT["lens"], over: Partial<VerifyFlagsT> = {}): VerifyFlagsT {
  return {
    schema: "verify-flags@1",
    slug: "g2-u03",
    lens,
    itemsHash: HASH,
    promptHash: "111111111111",
    round: 1,
    by: `fable-lens-${lens}`,
    flags: [],
    summary: { itemsSeen: 10, flagged: 0 },
    ...over,
  };
}

const ALL = ["level-gloss", "answers", "translation", "register"] as const;

test("merge: all four lenses mandatory; staleness refused", () => {
  const missing = mergeLensFlags("g2-u03", ALL.slice(0, 3).map((l) => lensFile(l)), HASH, 1);
  assert.ok(missing.errors.some((e) => e.includes("register") && e.includes("missing")));

  const stale = mergeLensFlags(
    "g2-u03",
    ALL.map((l) => lensFile(l, l === "answers" ? { itemsHash: "000000000000" } : {})),
    HASH,
    1,
  );
  assert.ok(stale.errors.some((e) => e.includes("STALE")));
});

test("merge: union, no dedupe across lenses, counts", () => {
  const files = ALL.map((l) => lensFile(l));
  files[0]!.flags = [
    { key: "above-level:g2u03.w.witch", kind: "above-level", itemId: "g2u03.w.witch", severity: "fix", note: "x", suggestion: null },
  ];
  files[1]!.flags = [
    { key: "answer-incomplete:g2u03.w.witch", kind: "answer-incomplete", itemId: "g2u03.w.witch", severity: "warn", note: "y", suggestion: null },
  ];
  const { merged, errors } = mergeLensFlags("g2-u03", files, HASH, 1);
  assert.deepEqual(errors, []);
  assert.equal(merged.fixCount, 1);
  assert.equal(merged.warnCount, 1);
  assert.equal(merged.byItem["g2u03.w.witch"]!.length, 2);
});

test("merge: malformed flag keys and duplicates are errors", () => {
  const files = ALL.map((l) => lensFile(l));
  files[0]!.flags = [
    { key: "wrong-key", kind: "above-level", itemId: "g2u03.w.witch", severity: "fix", note: "x", suggestion: null },
    { key: "above-level:g2u03.w.ghost", kind: "above-level", itemId: "g2u03.w.ghost", severity: "fix", note: "x", suggestion: null },
    { key: "above-level:g2u03.w.ghost", kind: "above-level", itemId: "g2u03.w.ghost", severity: "fix", note: "x", suggestion: null },
  ];
  const { errors } = mergeLensFlags("g2-u03", files, HASH, 1);
  assert.ok(errors.some((e) => e.includes("wrong-key")));
  assert.ok(errors.some((e) => e.includes("duplicate flag")));
});
