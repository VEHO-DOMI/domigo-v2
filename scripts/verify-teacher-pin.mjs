/**
 * WS-AUTH Phase A · teacher self-service PIN verifier. Two tiers (like the other
 * verify-* scripts):
 *   • Tier 1 — DB-FREE (always): the auth primitives the route relies on —
 *     hashPin/verifyPin round-trip + the TEACHER_PIN_PATTERN (4–6 digits).
 *   • Tier 2 — DB-GATED (DATABASE_URL): the crux — upsertTeacherIdentity as
 *     PROMOTE (insert a fresh v2 teacher) and CHANGE-PIN (update the SAME id), and
 *     the load-bearing property that reusing the id keeps the teacher's classes
 *     AND assignments attached (no orphan) — plus lookupTeacherAuthById reading the
 *     new hash back.
 *
 *   node scripts/verify-teacher-pin.mjs                    # Tier 1
 *   DATABASE_URL=<v2-dev pooled> node scripts/verify-teacher-pin.mjs   # + Tier 2
 *
 * NEVER point DATABASE_URL at production — Tier 2 writes + deletes rows.
 */
import assert from "node:assert/strict";
import { hashPin, verifyPin, TEACHER_PIN_PATTERN } from "../apps/web/lib/pin.ts";

let pass = 0;
const ok = (l) => {
  pass += 1;
  console.log(`  ✓ ${l}`);
};

// ── Tier 1 · DB-free auth primitives ─────────────────────────────────────────
console.log("Tier 1 — DB-free auth primitives:");
{
  const h = await hashPin("1234");
  assert.equal(await verifyPin("1234", h), true, "the right PIN verifies");
  assert.equal(await verifyPin("9999", h), false, "a wrong PIN does not");
  assert.equal(await verifyPin("1234", ""), false, "an empty hash never verifies");
  ok("hashPin/verifyPin round-trip (right verifies, wrong + empty do not)");

  for (const good of ["1234", "12345", "123456"]) assert.ok(TEACHER_PIN_PATTERN.test(good), `${good} is a valid teacher PIN`);
  for (const bad of ["123", "1234567", "12a4", "", "12 4"]) assert.ok(!TEACHER_PIN_PATTERN.test(bad), `${bad} is rejected`);
  ok("TEACHER_PIN_PATTERN accepts 4–6 digits, rejects short/long/non-digit");
}

// ── Tier 2 · DB-gated promote + change-PIN + no-orphan ───────────────────────
if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  console.log("\nTier 2 — SKIPPED (no DATABASE_URL). Point it at the v2-dev Neon branch (pooled), then re-run.");
} else {
  console.log("\nTier 2 — DB-gated promote + change-PIN + no-orphan:");
  const { getDb, upsertTeacherIdentity, deleteTeacherIdentity, lookupTeacherAuthById, createClass, listClassesForTeacher, archiveClass } =
    await import("../packages/db/src/index.ts");
  const db = getDb();

  const teacherId = crypto.randomUUID(); // stands in for a real teacher's live session id
  let classId = null;
  const cleanup = async () => {
    if (classId) await archiveClass(db, classId, teacherId).catch(() => {});
    await deleteTeacherIdentity(db, teacherId).catch(() => {});
  };
  await cleanup(); // start clean even if a prior run died mid-way

  try {
    // PROMOTE: the first upsert INSERTs the writable v2 teacher (id reused from the caller).
    await upsertTeacherIdentity(db, { id: teacherId, displayName: "VerifyBot", pinHash: await hashPin("1111") });
    let row = await lookupTeacherAuthById(db, teacherId);
    assert.ok(row, "the promoted teacher is found by id");
    assert.equal(row.id, teacherId, "the v2 row REUSES the caller's id");
    assert.equal(row.displayName, "VerifyBot", "displayName set on promote");
    assert.equal(await verifyPin("1111", row.pinHash), true, "the initial PIN verifies");
    ok("promote → a writable v2 teacher exists at the reused id, PIN verifies");

    // Attach a class to that id — exactly what a real teacher owns (assignments.created_by
    // is the identical plain-uuid reference, so the class case proves the property).
    const cls = await createClass(db, { name: "VerifyClass", grade: 2, teacherId });
    classId = cls.id;

    // CHANGE PIN: a second upsert with the SAME id UPDATEs only the hash.
    await upsertTeacherIdentity(db, { id: teacherId, displayName: "IgnoredOnUpdate", pinHash: await hashPin("2222") });
    row = await lookupTeacherAuthById(db, teacherId);
    assert.equal(row.id, teacherId, "id unchanged after change-PIN");
    assert.equal(row.displayName, "VerifyBot", "displayName is NOT overwritten on a PIN change");
    assert.equal(await verifyPin("2222", row.pinHash), true, "the NEW PIN verifies");
    assert.equal(await verifyPin("1111", row.pinHash), false, "the OLD PIN no longer verifies");
    ok("change-PIN → same id, displayName kept, new PIN verifies, old rejected");

    // NO ORPHAN: the class still resolves under the reused id after the change.
    const owned = await listClassesForTeacher(db, teacherId);
    assert.ok(owned.some((c) => c.id === classId), "the class still belongs to the teacher after the PIN change");
    ok("no orphan → the teacher's class stays attached across the change (id reuse)");

    // REVERT: deleting the v2 identity falls the dual-read back to v1 (undo a promotion).
    assert.equal(await deleteTeacherIdentity(db, teacherId), true, "the v2 identity is removed");
    assert.equal(await lookupTeacherAuthById(db, teacherId), null, "no v2 (or v1) teacher at that id after revert");
    ok("revert → deleting the v2 row cleanly removes the promotion");
  } finally {
    await cleanup();
  }
}

console.log(`\n${pass} checks passed.`);
