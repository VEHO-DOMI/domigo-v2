/**
 * S-1 · Studio overlay verifier. Two tiers, like verify-checkup.mjs:
 *   • DB-FREE (always): passthrough + allowlist + the overlay round-trip on a
 *     real corpus item — proves the security core end to end without a DB.
 *   • DB-GATED (when DATABASE_URL is set): save → publish → the item serves the
 *     overridden prose → the crash-order orphan is harmless → revert → gone.
 *
 *   node scripts/verify-studio-overrides.mjs
 */
import assert from "node:assert/strict";
import { applyStudioOverlay, loadUnit, normalizePatchColumn, validatePatch } from "../packages/content-loader/src/index.ts";

let pass = 0;
const ok = (label) => {
  pass += 1;
  console.log(`  ✓ ${label}`);
};

// ── Tier 1 · DB-free ────────────────────────────────────────────────────────
console.log("Tier 1 — DB-free overlay core:");
const unit = loadUnit("g2-u03");
const v = unit.vocab[0];
const g = unit.grammar[0];

// prose applies; grading keys never move
const overV = applyStudioOverlay("vocab", v, { hintDe: "Neuer Hinweis." });
assert.equal(overV.hintDe, "Neuer Hinweis.");
assert.equal(overV.g, v.g);
assert.deepEqual(overV.translation, v.translation);
ok("vocab prose overlay applies; g/translation untouched");

// allowlist rejects grading keys
assert.equal(validatePatch("vocab", { g: "hacked" }, v).ok, false);
assert.equal(validatePatch("grammar", { answers: [{ text: "x", tier: "full" }] }, g).ok, false);
ok("allowlist rejects vocab.g and grammar.answers");

// blank + leak guards
assert.equal(validatePatch("vocab", { s: "no blank" }, v).ok, false);
assert.equal(validatePatch("vocab", { d: `about ${v.w}` }, v).ok, false);
ok("blank-count + headword-leak guards fire");

// passthrough on a sample of every grade
for (const slug of ["g1-u01", "g2-u03", "g3-u01", "g4-u01"]) {
  const u = loadUnit(slug);
  for (const it of u.vocab) assert.deepEqual(applyStudioOverlay("vocab", it, {}), it);
  for (const it of u.grammar) assert.deepEqual(applyStudioOverlay("grammar", it, {}), it);
}
ok("passthrough: empty overlay is identity across g1–g4 samples");

// ── Tier 2 · DB-gated ───────────────────────────────────────────────────────
if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  console.log(`\nTier 2 — SKIPPED (no DATABASE_URL). Apply migration 0009 to a dev branch, then re-run.`);
  console.log(`\n${pass} DB-free checks passed.`);
  process.exit(0);
}

console.log("\nTier 2 — DB-gated E2E:");
const { getDb, saveOverrideDraft, publishOverride, revertOverride, loadPublishedOverrides, loadOverrideRow, loadRevisions } = await import("../packages/db/src/index.ts");
const db = getDb();
const itemId = v.id;
const testHint = `S-1 verify ${Date.now()}`;

// clean slate
await revertOverride(db, { itemId, actorId: null }).catch(() => {});

// save draft → not yet served
await saveOverrideDraft(db, { itemId, unitSlug: "g2-u03", kind: "vocab", patch: { hintDe: testHint }, updatedBy: null });
let published = await loadPublishedOverrides(db, "g2-u03");
assert.ok(!published.some((r) => r.itemId === itemId), "draft is NOT in the published read");
ok("draft saved but not served");

// crash-order: a revision row alone (draft still) must not serve the edit
const draftRow = await loadOverrideRow(db, itemId);
assert.equal(draftRow?.status, "draft");
ok("crash-order: an unflipped draft is inert (reads ignore it)");

// publish → served, and the overlay applies
await publishOverride(db, { itemId, actorId: null });
published = await loadPublishedOverrides(db, "g2-u03");
const row = published.find((r) => r.itemId === itemId);
assert.ok(row, "published row present");
const served = applyStudioOverlay("vocab", v, normalizePatchColumn(row.patch));
assert.equal(served.hintDe, testHint, "the overridden hint is served");
assert.equal(served.g, v.g, "grading key still canon after publish");
ok("publish → overridden prose served, grading key canon");

// history journaled
const revs = await loadRevisions(db, itemId, 5);
assert.ok(revs.some((r) => r.action === "publish"), "publish journaled");
ok("publish journaled to content_revisions");

// revert → back to canon
await revertOverride(db, { itemId, actorId: null });
published = await loadPublishedOverrides(db, "g2-u03");
assert.ok(!published.some((r) => r.itemId === itemId), "reverted row gone");
ok("revert → item back to canon");

console.log(`\n${pass} checks passed (DB-free + E2E).`);
