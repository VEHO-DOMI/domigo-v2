/**
 * J-1 · journeys runtime verifier. Two tiers:
 *   • Tier 1 — DB-FREE (always): the pool partition (total-partition + reserved-wins)
 *     on a real unit; the F6 released-stop resolver against the REAL corpus (g1
 *     zones + g2/g3/g4 chapters resolve, the unreleased Spill + Lost-for-Words are
 *     rejected); the pure progress derivation (seed → unlock); the validate-journeys
 *     core (a resolvable gamePointer passes, an unresolvable one fails).
 *   • Tier 2 — DB-GATED (DATABASE_URL, a v2-dev branch): a real attempt round-trips
 *     — recordAttempt writes mode='journey:<unit>:<node>', getJourneyAttempts reads
 *     it back, a NON-journey attempt is NOT counted (F4), and a derived node
 *     completes → the next unlocks; a RESERVED item is EXCLUDED from getDueRefs
 *     (F2 — the mock pool never leaks). NEVER point DATABASE_URL at production.
 *
 *   node scripts/verify-journey.mjs
 *   DATABASE_URL=<v2-dev pooled> node scripts/verify-journey.mjs
 */
import assert from "node:assert/strict";
import { assignPool, loadUnit, partitionUnit } from "../packages/content-loader/src/index.ts";
import { bestTierPerItem, deriveJourneyProgress, journeyModeFor } from "../packages/db/src/journey-progress.ts";
import { buildReleasedStops, validateJourney } from "../packages/content-pipeline/src/validate-journeys.ts";
import { Journey } from "../packages/content-schema/src/index.ts";

let pass = 0;
const ok = (l) => {
  pass += 1;
  console.log(`  ✓ ${l}`);
};

// ── Tier 1 · DB-free ──────────────────────────────────────────────────────────
console.log("Tier 1 — DB-free (pools · released-stops · derivation · validator):");

const unit = loadUnit("g2-u03");
const ids = [...unit.vocab.map((v) => v.id), ...unit.grammar.map((g) => g.id)];
assert.ok(ids.length > 3, "g2-u03 has items");

// pools: total partition + reserved-wins
const part = partitionUnit(ids, new Set([ids[0]]), { [ids[1]]: "arcade" });
assert.equal(part.size, ids.length);
assert.ok([...part.values()].every(Boolean), "every item has a pool");
assert.equal(part.get(ids[0]), "mock"); // reserved-wins
assert.equal(part.get(ids[1]), "arcade"); // authored override
assert.equal(part.get(ids[2]), "practice"); // default remainder
assert.equal(assignPool(ids[0], new Set([ids[0]]), { [ids[0]]: "arcade" }), "mock"); // reserved beats override
ok(`total partition on g2-u03 (${ids.length} items): reserved→mock · override→arcade · default→practice`);

// F6 released-stop resolver against the real corpus
const stops = buildReleasedStops();
assert.ok(stops.get(1)?.has("z07"), "g1 z07 (lost-pages overworld)");
assert.ok(stops.get(2)?.has("ch03"), "g2 ch03 (wrong-name detective)");
assert.ok(!stops.get(2)?.has("z07"), "g2 NOT z07 (the-spill unreleased)");
assert.ok(stops.get(3)?.has("ch01"), "g3 ch01 (fourteen)");
assert.ok(stops.get(4)?.has("ch13") && !stops.get(4)?.has("ch14"), "g4 fourteen-live 13 chapters (Lost-for-Words excluded)");
ok("released-stop resolver: g1 zones + g2/g3/g4 chapters resolve; Spill + Lost-for-Words rejected (F6)");

// pure derivation: seed → unlock
const jnodes = Journey.parse({
  schema: "journey@1",
  grade: 2,
  unit: 3,
  slug: "g2-u03",
  nodes: [
    { id: "p1", kind: "practice", titleDe: "A", titleEn: null, itemPool: "practice" },
    { id: "p2", kind: "practice", titleDe: "B", titleEn: null, itemPool: "practice" },
  ],
}).nodes;
const nodeItems = new Map([["p1", [ids[2]]], ["p2", [ids[3]]]]);
assert.deepEqual(
  deriveJourneyProgress(jnodes, nodeItems, new Map()).map((v) => `${v.id}:${v.status}`),
  ["p1:available", "p2:locked"],
);
assert.deepEqual(
  deriveJourneyProgress(jnodes, nodeItems, bestTierPerItem([{ itemId: ids[2], tier: "correct" }])).map((v) => `${v.id}:${v.status}`),
  ["p1:complete", "p2:available"],
);
ok("derivation: seeding p1's item → p1 complete, p2 unlocks");

// validate-journeys pure core
const gj = (zoneOrChapter) =>
  Journey.parse({ schema: "journey@1", grade: 2, unit: 3, slug: "g2-u03", nodes: [{ id: "g", kind: "game", titleDe: "S", titleEn: null, gamePointer: { grade: 2, zoneOrChapter } }] });
assert.deepEqual(validateJourney(gj("ch03"), (g, s) => g === 2 && s === "ch03", ids), []);
assert.equal(validateJourney(gj("z07"), () => false, ids).length, 1);
ok("validate-journeys core: a resolvable gamePointer passes, an unresolvable one fails");

// ── Tier 2 · DB-gated ─────────────────────────────────────────────────────────
if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  console.log("\nTier 2 — SKIPPED (no DATABASE_URL). Point it at the v2-dev Neon branch (pooled), then re-run.");
} else {
  console.log("\nTier 2 — DB-gated (attempt round-trip · journey-mode scope F4 · reserved exclusion F2):");
  const { getDb, recordAttempt, getJourneyAttempts, updateReviewQueue, getDueRefs, reserveItems, releaseItems } = await import("../packages/db/src/index.ts");
  const db = getDb();
  const userId = crypto.randomUUID();
  const classId = crypto.randomUUID();
  const [a, b] = [ids[2], ids[3]];
  const kindOf = (id) => (unit.vocab.some((v) => v.id === id) ? "vocab" : "grammar");

  // seed a JOURNEY attempt for `a`, and a non-journey (practice) attempt for `b`
  await recordAttempt(db, { userId, classId, itemId: a, kind: kindOf(a), unitSlug: "g2-u03", grade: 2, mode: journeyModeFor("g2-u03", "p1"), tier: "correct", clientAttemptId: crypto.randomUUID() });
  await recordAttempt(db, { userId, classId, itemId: b, kind: kindOf(b), unitSlug: "g2-u03", grade: 2, mode: "practice", tier: "correct", clientAttemptId: crypto.randomUUID() });

  const best = bestTierPerItem(await getJourneyAttempts(db, userId, "g2-u03"));
  assert.ok(best.has(a), "the journey attempt is counted");
  assert.ok(!best.has(b), "the practice-mode attempt is NOT counted (F4 — journey-mode scope)");
  ok("attempt round-trip: journey mode read back, non-journey mode excluded (F4)");

  const views = deriveJourneyProgress(jnodes, new Map([["p1", [a]], ["p2", [b]]]), best);
  assert.deepEqual(views.map((v) => `${v.id}:${v.status}`), ["p1:complete", "p2:available"]);
  ok("derivation over the REAL ledger: p1 complete, p2 unlocked");

  // F2 · a reserved item is excluded from getDueRefs (make it due first)
  await updateReviewQueue(db, userId, { itemId: a, kind: kindOf(a), unitSlug: "g2-u03", grade: 2 }, "correct", new Date(Date.now() - 100 * 86_400_000));
  assert.ok((await getDueRefs(db, userId, classId, { kind: "unit", slug: "g2-u03" }, 50)).some((r) => r.itemId === a), "a is due before reserving");
  await reserveItems(db, classId, [a]);
  assert.ok(!(await getDueRefs(db, userId, classId, { kind: "unit", slug: "g2-u03" }, 50)).some((r) => r.itemId === a), "a is EXCLUDED after reserving");
  ok("getDueRefs excludes a reserved item (F2 — the mock pool never leaks)");
  await releaseItems(db, classId, [a]); // cleanup (attempt/queue rows keyed to a throwaway user)
}

console.log(`\n${pass} checks passed.`);
