/**
 * S-2 · Studio full-CRUD verifier. Three tiers (like verify-studio-overrides.mjs
 * plus the live crux):
 *   • Tier 1 — DB-FREE (always): the pre-gate on real corpus items — zod pass,
 *     un-gateable block, nothing-keyed block, plus mergeDrafts create/remove.
 *   • Tier 2 — DB-GATED (DATABASE_URL): the drafts layer round-trip — a created
 *     item is served ONLY once published (record-check-then-flip), then reverts.
 *   • Tier 3 — KEY-GATED (ANTHROPIC_API_KEY): the LIVE blind-solve. Proves a real
 *     item is solved correctly → publish allowed, AND that a self-consistent
 *     WRONG key (which the pre-gate CANNOT catch, because a key self-matches) is
 *     BLOCKED by the solver — the gate's whole reason to exist.
 *
 *   node scripts/verify-studio-crud.mjs                       # Tier 1 (+2 if DB)
 *   DATABASE_URL=… node scripts/verify-studio-crud.mjs        # + Tier 2
 *   ANTHROPIC_API_KEY=… node --conditions=react-server \
 *     scripts/verify-studio-crud.mjs                          # + Tier 3
 */
import assert from "node:assert/strict";
import { loadUnit, mergeDrafts } from "../packages/content-loader/src/index.ts";
import { preGate } from "../apps/web/lib/studio-gate.ts";

let pass = 0;
const ok = (l) => {
  pass += 1;
  console.log(`  ✓ ${l}`);
};

// ── Tier 1 · DB-free gate core ───────────────────────────────────────────────
console.log("Tier 1 — DB-free gate core:");
const unit = loadUnit("g4-u10");
const vocab = unit.vocab[0];
const gf = unit.grammar.find((g) => g.format === "gap-fill");
const mc = unit.grammar.find((g) => g.format === "multiple-choice");
const matching = unit.grammar.find((g) => g.format === "matching");

assert.equal(preGate("vocab", vocab).stage, "passed");
assert.equal(preGate("grammar", gf).stage, "passed");
assert.equal(preGate("grammar", mc).stage, "passed");
ok("real vocab / gap-fill / multiple-choice pass all three free layers");

assert.equal(preGate("vocab", {}).stage, "schema");
assert.equal(preGate("vocab", { ...vocab, d: `all about ${vocab.w}` }).stage, "schema");
ok("garbage + headword-leaking definition rejected at schema");

assert.equal(preGate("grammar", matching).stage, "un-gateable");
ok("matching format blocked as un-gateable (its affordances leak the key)");

const stripped = { ...gf, answers: gf.answers.filter((a) => a.tier !== "full") };
const sr = preGate("grammar", stripped);
assert.equal(sr.ok, false);
assert.ok(sr.stage === "schema" || sr.stage === "key-defect");
ok("an item with nothing keyed correct cannot pass");

const created = { ...vocab, id: "g4u10.w.merge-probe" };
let m = mergeDrafts(unit.vocab, unit.grammar, [{ itemId: created.id, kind: "vocab", action: "create", item: created }]);
assert.equal(m.vocab.length, unit.vocab.length + 1);
m = mergeDrafts(unit.vocab, unit.grammar, [{ itemId: vocab.id, kind: "vocab", action: "remove", item: null }]);
assert.equal(m.vocab.length, unit.vocab.length - 1);
ok("mergeDrafts: create appends, remove drops");

// ── Tier 2 · DB-gated drafts round-trip ──────────────────────────────────────
if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  console.log("\nTier 2 — SKIPPED (no DATABASE_URL). Apply migration 0010 to a dev branch, then re-run.");
} else {
  console.log("\nTier 2 — DB-gated drafts round-trip:");
  const { getDb, saveDraft, setDraftStatus, recordCheck, loadPublishedDrafts, loadDraftChecks, deleteDraft } = await import("../packages/db/src/index.ts");
  const db = getDb();
  const probe = { ...vocab, id: "g4u10.w.verify-probe" };
  await deleteDraft(db, probe.id).catch(() => {});

  const draftId = await saveDraft(db, { itemId: probe.id, unitSlug: "g4-u10", kind: "vocab", item: probe, action: "create", updatedBy: null });
  let pub = await loadPublishedDrafts(db, "g4-u10");
  assert.ok(!pub.some((d) => d.itemId === probe.id), "a saved (unpublished) draft must not be served");
  ok("saved draft is NOT served (only published drafts merge)");

  // record-check-THEN-flip (journal-then-flip)
  await recordCheck(db, { draftId, checkKind: "blind_solve", verdict: "pass", evidence: { note: "verify-studio-crud" } });
  await setDraftStatus(db, probe.id, "published");
  pub = await loadPublishedDrafts(db, "g4-u10");
  assert.ok(pub.some((d) => d.itemId === probe.id), "published created item is served");
  ok("record-check-then-flip → created item served");

  const checks = await loadDraftChecks(db, draftId);
  assert.ok(checks.some((c) => c.checkKind === "blind_solve"), "the check is journaled");
  ok("the passing check is journaled to content_checks");

  await deleteDraft(db, probe.id);
  pub = await loadPublishedDrafts(db, "g4-u10");
  assert.ok(!pub.some((d) => d.itemId === probe.id), "reverted created item is gone");
  ok("revert → created item gone (back to canon)");
}

// ── Tier 3 · live blind-solve gate (the crux) ────────────────────────────────
if (!process.env.ANTHROPIC_API_KEY) {
  console.log("\nTier 3 — SKIPPED (no ANTHROPIC_API_KEY). To exercise the live gate:");
  console.log("  ANTHROPIC_API_KEY=… node --conditions=react-server scripts/verify-studio-crud.mjs");
} else {
  console.log("\nTier 3 — live blind-solve gate:");
  let solveGate;
  try {
    ({ solveGate } = await import("../apps/web/lib/studio-solve.ts"));
  } catch (e) {
    console.log(`  ! could not load solveGate (${e.message?.split("\n")[0]}).`);
    console.log("  Re-run with: node --conditions=react-server scripts/verify-studio-crud.mjs");
    console.log(`\n${pass} checks passed (Tier 3 not run).`);
    process.exit(0);
  }

  const good = await solveGate({ kind: "grammar", item: gf, frame: preGate("grammar", gf).frame, grade: "g4" });
  assert.equal(good.ok, true, `a real item should solve + pass; got ${good.stage}: ${good.note}`);
  ok(`live: a real gap-fill is solved correctly → publish allowed (solved by ${good.model})`);

  // a self-consistent WRONG key: the pre-gate passes (a key self-matches), so
  // ONLY the live solver can catch it — this is the gate's unique value.
  const wrongKey = { ...gf, answers: gf.answers.map((a) => (a.tier === "full" ? { ...a, text: "studies" } : a)) };
  assert.equal(preGate("grammar", wrongKey).stage, "passed");
  const bad = await solveGate({ kind: "grammar", item: wrongKey, frame: preGate("grammar", wrongKey).frame, grade: "g4" });
  assert.equal(bad.ok, false, "a wrong-but-self-consistent key MUST be blocked by the live solve");
  ok("live: a self-consistent WRONG key passes the pre-gate but the solver BLOCKS it");
}

console.log(`\n${pass} checks passed.`);
