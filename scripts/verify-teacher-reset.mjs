/**
 * K2a · Wiedereinstieg verifier — the recovery link, the teacher journal and the
 * sign-in brake, proved against real Postgres rather than against a mock.
 *
 *   • Tier 1 — DB-FREE (always): the pure parts — domain-separated hashing, the
 *     token shape, the mailer's fail-closed states, and the mail carrying a link
 *     and no PIN.
 *   • Tier 2 — DB-GATED (DATABASE_URL): the three things a mock CANNOT settle —
 *     that the one-statement throttle upsert is legal SQL and really turns its
 *     window, that a second consumption of the same link touches ZERO rows, and
 *     that an expired link is equally dead. Plus the journal round-trip.
 *
 *   node scripts/verify-teacher-reset.mjs                                # Tier 1
 *   DATABASE_URL=<v2-dev pooled> node scripts/verify-teacher-reset.mjs   # + Tier 2
 *
 * NEVER point DATABASE_URL at production — Tier 2 writes + deletes rows. The host
 * lock below refuses anything that is not the v2-dev compute, so the warning is a
 * machine and not a note.
 */
import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { buildResetMail, mailerState } from "../apps/web/lib/mailer.ts";

// The workspace deps live in packages/db, not at the repo root, so a bare
// `import "@neondatabase/serverless"` from scripts/ does not resolve. Resolving it
// FROM that package is the honest fix and works in every worktree.
const requireFromDb = createRequire(new URL("../packages/db/package.json", import.meta.url));

let pass = 0;
const ok = (l) => {
  pass += 1;
  console.log(`  ✓ ${l}`);
};

const DEV_COMPUTE = "ep-dry-sound-alj0davj";

// ── Tier 1 · DB-free ─────────────────────────────────────────────────────────
console.log("Tier 1 — DB-free (hashing, token shape, mailer):");
{
  const { hashResetToken, newResetToken, RESET_TOKEN_TTL_MINUTES } = await import("../packages/db/src/reset-tokens.ts");

  const t = newResetToken();
  assert.ok(/^[A-Za-z0-9_-]+$/.test(t), "the token survives a URL path untouched");
  assert.ok(t.length >= 40, "32 random bytes, base64url");
  assert.notEqual(newResetToken(), t, "two tokens differ");
  ok("newResetToken is URL-safe, long, and not repeating");

  const naive = createHash("sha256").update(t, "utf8").digest("hex");
  assert.notEqual(hashResetToken(t), naive, "the hash is domain-separated");
  assert.equal(hashResetToken(t), createHash("sha256").update(`domigo-reset:${t}`, "utf8").digest("hex"), "…with the declared prefix");
  assert.notEqual(hashResetToken("a"), hashResetToken("b"), "different tokens, different hashes");
  ok("hashResetToken is domain-separated and injective on the sample");

  assert.deepEqual(mailerState({}), { kind: "off" }, "nothing configured ⇒ off");
  assert.deepEqual(mailerState({ BREVO_API_KEY: "k" }), { kind: "off" }, "half a configuration ⇒ off");
  assert.equal(mailerState({ MAIL_TRANSPORT: "console" }).kind, "console", "dev transport outside production");
  assert.equal(mailerState({ MAIL_TRANSPORT: "console", VERCEL_ENV: "production" }).kind, "off", "…inert ON production");
  ok("mailerState is fail-closed, and the dev transport cannot exist on production");

  const link = "https://example.invalid/lehrkraft/pin-reset/AbC_123-xyz";
  const mail = buildResetMail(link, RESET_TOKEN_TTL_MINUTES);
  assert.ok(mail.text.includes(link), "the mail carries the link");
  const prosa = mail.text.split(link).join(" ");
  assert.ok(!/(?<!\d)\d{4,6}(?!\d)/.test(prosa), "no PIN-shaped number anywhere in the prose");
  ok("the mail carries a link and never a PIN");
}

// ── Tier 2 · DB-gated ────────────────────────────────────────────────────────
const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
if (!url) {
  console.log("\nTier 2 — SKIPPED (no DATABASE_URL). Point it at the v2-dev Neon branch (pooled), then re-run.");
} else {
  const host = new URL(url.replace(/^postgres(ql)?:\/\//, "https://")).hostname;
  if (!host.includes(DEV_COMPUTE)) {
    console.error(`\nABBRUCH: nicht der v2-dev-Compute -> ${host}`);
    process.exit(1);
  }
  console.log(`\nTier 2 — DB-gated (Ziel bestaetigt, v2-dev: ${host}):`);

  const { getDb, bumpAndCheck, clearThrottle, writeTeacherEvent } = await import("../packages/db/src/index.ts");
  // reset-tokens has its own entry point — it imports node:crypto and must stay out of
  // the Edge-runtime chain that index.ts feeds (see index.ts for the whole story).
  const { consumeResetToken, mintResetToken, peekResetToken } = await import("../packages/db/src/reset-tokens.ts");
  const neonMod = await import(requireFromDb.resolve("@neondatabase/serverless"));
  const neon = neonMod.neon ?? neonMod.default?.neon ?? neonMod.default;
  const raw = neon(url); // for setup, inspection and teardown — the module under test uses drizzle
  const db = getDb();

  const teacherId = randomUUID();
  const actorId = randomUUID();
  const key = `teacher:verify-${randomUUID().slice(0, 8)}`;

  const cleanup = async () => {
    await raw.query("delete from domigo_v2.teacher_reset_tokens where teacher_id = $1", [teacherId]);
    await raw.query("delete from domigo_v2.teacher_events where teacher_id = $1", [teacherId]);
    await raw.query("delete from domigo_v2.auth_throttle where key = $1", [key]);
  };
  await cleanup(); // start clean even if a prior run died mid-way

  try {
    // ── the brake, against real SQL ──────────────────────────────────────────
    // A mock cannot tell us whether `ON CONFLICT DO UPDATE` may reference the
    // schema-qualified target row. Postgres can.
    const politik = { limit: 3, windowMinutes: 10 };
    for (let i = 1; i <= 3; i += 1) {
      assert.equal(await bumpAndCheck(db, key, politik), true, `attempt ${i} is allowed`);
    }
    assert.equal(await bumpAndCheck(db, key, politik), false, "the fourth is refused");
    ok("the one-statement upsert counts, and refuses exactly past the limit (3 ok, 4th refused)");

    const [row] = await raw.query("select count from domigo_v2.auth_throttle where key = $1", [key]);
    assert.equal(row.count, 4, "every attempt was counted, the refused one included");
    ok("the counter is a real column value, not an inference");

    // Push the stored window into the past: the SAME statement must reset it to 1.
    await raw.query("update domigo_v2.auth_throttle set window_start = now() - interval '11 minutes' where key = $1", [key]);
    assert.equal(await bumpAndCheck(db, key, politik), true, "a new window allows again");
    const [nachher] = await raw.query("select count from domigo_v2.auth_throttle where key = $1", [key]);
    assert.equal(nachher.count, 1, "the counter restarted at one rather than incrementing");
    ok("an expired window is turned by the same statement (count back to 1)");

    await clearThrottle(db, key);
    const leer = await raw.query("select count from domigo_v2.auth_throttle where key = $1", [key]);
    assert.equal(leer.length, 0, "success wipes the row");
    ok("clearThrottle removes the counter");

    // ── the link: one shot, and dead when stale ──────────────────────────────
    const gemuenzt = await mintResetToken(db, teacherId);
    assert.equal(gemuenzt.ok, true, "a token is minted");

    const [gespeichert] = await raw.query("select token_hash from domigo_v2.teacher_reset_tokens where teacher_id = $1", [teacherId]);
    assert.equal(gespeichert.token_hash, createHash("sha256").update(`domigo-reset:${gemuenzt.token}`, "utf8").digest("hex"), "the stored value is the hash");
    assert.notEqual(gespeichert.token_hash, gemuenzt.token, "the plaintext is NOT in the table");
    ok("the row holds the hash and the plaintext exists only in the caller's hand");

    assert.deepEqual(await peekResetToken(db, gemuenzt.token), { ok: true }, "the link reads as live");
    const ersteEinloesung = await consumeResetToken(db, gemuenzt.token);
    assert.deepEqual(ersteEinloesung, { ok: true, teacherId }, "the first click wins and names the teacher");
    ok("a live link is spendable exactly once — the first click");

    const zweiteEinloesung = await consumeResetToken(db, gemuenzt.token);
    assert.deepEqual(zweiteEinloesung, { ok: false, reason: "invalid" }, "the second click matches zero rows");
    assert.deepEqual(await peekResetToken(db, gemuenzt.token), { ok: false, reason: "invalid" }, "…and the page agrees");
    ok("the SECOND click on the same link is dead (the guarded UPDATE touched 0 rows)");

    // An expired one, made expired by the database's own clock.
    const abgelaufen = await mintResetToken(db, teacherId, 60);
    assert.equal(abgelaufen.ok, true, "a second token is minted");
    await raw.query("update domigo_v2.teacher_reset_tokens set expires_at = now() - interval '1 minute' where token_hash = $1",
      [createHash("sha256").update(`domigo-reset:${abgelaufen.token}`, "utf8").digest("hex")]);
    assert.deepEqual(await consumeResetToken(db, abgelaufen.token), { ok: false, reason: "invalid" }, "an expired link matches zero rows");
    assert.deepEqual(await consumeResetToken(db, abgelaufen.token), zweiteEinloesung, "expired and spent are indistinguishable");
    ok("an EXPIRED link is dead too, and looks exactly like a spent one");

    // A token nobody ever minted.
    assert.deepEqual(await consumeResetToken(db, "erfunden-und-nie-gemuenzt"), { ok: false, reason: "invalid" }, "an invented token matches nothing");
    ok("an invented link is dead, with the same answer again");

    // ── the journal ──────────────────────────────────────────────────────────
    assert.equal(await writeTeacherEvent(db, { teacherId, kind: "pin_reset_by_grandmaster", actorId, payload: { transitional: true } }), true, "the journal accepts a row");
    const eintraege = await raw.query("select kind, actor_id, payload from domigo_v2.teacher_events where teacher_id = $1", [teacherId]);
    assert.equal(eintraege.length, 1, "exactly one entry");
    assert.equal(eintraege[0].actor_id, actorId, "the HAND is recorded, and it is not the account");
    assert.notEqual(eintraege[0].actor_id, teacherId, "…the two ids genuinely differ");
    assert.deepEqual(eintraege[0].payload, { transitional: true }, "the payload survives as written");
    ok("the journal records whose account and whose hand, round-tripped through jsonb");

    const geheim = await writeTeacherEvent(db, {
      teacherId,
      kind: "email_set",
      actorId: teacherId,
      payload: { emailSet: true, leaked: "kollegin@example.invalid" },
    });
    assert.equal(geheim, true, "the row lands");
    const alle = await raw.query("select payload from domigo_v2.teacher_events where teacher_id = $1", [teacherId]);
    assert.ok(!JSON.stringify(alle).includes("example.invalid"), "no address reached the table");
    ok("a careless payload is redacted BEFORE it reaches the database");
  } finally {
    await cleanup();
  }
}

console.log(`\n${pass} checks passed.`);
