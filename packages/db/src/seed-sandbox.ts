/** Predictable records for the isolated comparison database only. */
import { eq } from "drizzle-orm";
import { loadStoryComprehension, loadUnit, loadWorld } from "@domigo/content-loader";
import { xpForTier } from "@domigo/engine";
import { getDb, reconcileWorldRewards, recordWorldInteraction, resetTestWorld, saveWorldLocation } from "./index.ts";
import { practiceAttempts, v2Classes, v2IdentityUsers } from "./schema.ts";

const WORLD_ID = "g1.world.lost-pages-school";
const CLASS_ID = "11111111-1111-4111-8111-111111111111";
const TEACHER_ID = "22222222-2222-4222-8222-222222222222";
const PROFILES = {
  fresh: { id: "33333333-3333-4333-8333-333333333333", name: "Veho Test — Fresh" },
  midway: { id: "44444444-4444-4444-8444-444444444444", name: "Veho Test — Midway" },
  complete: { id: "55555555-5555-4555-8555-555555555555", name: "Veho Test — Complete" },
} as const;
const TASKS = [
  { id: "g1u01.w.pencil", encounterId: "pencil-help", clientId: "10000000-0000-4000-8000-000000000001" },
  { id: "g1u01.gi.contractions.sb.002", encounterId: "desk-question", clientId: "10000000-0000-4000-8000-000000000002" },
  { id: "g1u01.gi.plurals.gs.001", encounterId: "library-restoration", clientId: "10000000-0000-4000-8000-000000000003" },
  { id: "g1u01.ci.whats-lost.mc.001", encounterId: "library-restoration", clientId: "10000000-0000-4000-8000-000000000004" },
] as const;

function assertSandboxDatabase(): void {
  if (!(process.env.DATABASE_URL ?? "")) throw new Error("DATABASE_URL is required");
  if (process.env.DOMIGO_SANDBOX_ENABLED !== "1") throw new Error("DOMIGO_SANDBOX_ENABLED=1 is required");
  if (process.env.DOMIGO_SANDBOX_DATABASE_CONFIRMED !== "1") {
    throw new Error("Set DOMIGO_SANDBOX_DATABASE_CONFIRMED=1 only after confirming the URL is the isolated Neon branch");
  }
}

function taskMeta(taskId: string): { kind: "vocab" | "grammar" | "reading"; xp: number } {
  const unit = loadUnit("g1-u01");
  const vocab = unit.vocab.find((item) => item.id === taskId);
  if (vocab) return { kind: "vocab", xp: xpForTier(vocab.difficulty * 10, "correct") };
  const grammar = unit.grammar.find((item) => item.id === taskId);
  if (grammar) return { kind: "grammar", xp: xpForTier(grammar.difficulty * 10, "correct") };
  const reading = loadStoryComprehension("g1.st.lost-pages")?.items.find((item) => item.id === taskId);
  if (reading) return { kind: "reading", xp: xpForTier(reading.difficulty * 10, "correct") };
  throw new Error(`Missing approved task: ${taskId}`);
}

async function addSolvedTasks(userId: string, count: number): Promise<void> {
  for (const task of TASKS.slice(0, count)) {
    const meta = taskMeta(task.id);
    await getDb().insert(practiceAttempts).values({
      userId, classId: CLASS_ID, itemId: task.id, kind: meta.kind, unitSlug: "g1-u01", grade: 1,
      mode: "game:g1-rpg", tier: "correct", correct: true, xpAwarded: meta.xp, latencyMs: 1200,
      hintUsed: false, context: { source: "sandbox-seed" }, worldId: WORLD_ID,
      worldEncounterId: task.encounterId, clientAttemptId: task.clientId,
    }).onConflictDoNothing({ target: [practiceAttempts.userId, practiceAttempts.clientAttemptId] });
  }
}

async function main(): Promise<void> {
  assertSandboxDatabase();
  const world = loadWorld("g1.st.lost-pages", "z01");
  if (!world || world.id !== WORLD_ID) throw new Error("world@1 sandbox definition is unavailable");
  const db = getDb();
  const now = new Date();
  await db.insert(v2IdentityUsers).values({ id: TEACHER_ID, role: "teacher", displayName: "Teacher Sandbox", givenName: "Teacher Sandbox", classId: null, pinHash: "!preview-token-only!", claimedAt: now, isTestProfile: true }).onConflictDoUpdate({ target: v2IdentityUsers.id, set: { displayName: "Teacher Sandbox", givenName: "Teacher Sandbox", isTestProfile: true } });
  await db.insert(v2Classes).values({ id: CLASS_ID, name: "Grade 1 RPG Sandbox", inviteCode: "RPGTEST1", grade: 1, teacherId: TEACHER_ID, smartReviewEnabled: false }).onConflictDoUpdate({ target: v2Classes.id, set: { name: "Grade 1 RPG Sandbox", grade: 1, teacherId: TEACHER_ID, smartReviewEnabled: false, archivedAt: null } });
  for (const profile of Object.values(PROFILES)) {
    await db.insert(v2IdentityUsers).values({ id: profile.id, role: "student", displayName: profile.name, givenName: "Veho Test", classId: CLASS_ID, pinHash: "!preview-token-only!", claimedAt: now, isTestProfile: true }).onConflictDoUpdate({ target: v2IdentityUsers.id, set: { role: "student", displayName: profile.name, givenName: "Veho Test", classId: CLASS_ID, isTestProfile: true } });
    await resetTestWorld(db, { userId: profile.id, worldId: world.id });
  }
  await saveWorldLocation(db, { userId: PROFILES.fresh.id, classId: CLASS_ID, world, areaId: "book-atrium", spawnId: "start", position: [336, 304] });
  await addSolvedTasks(PROFILES.midway.id, 2);
  await reconcileWorldRewards(db, { userId: PROFILES.midway.id, classId: CLASS_ID, world });
  await saveWorldLocation(db, { userId: PROFILES.midway.id, classId: CLASS_ID, world, areaId: "corridor", spawnId: "classroom-return", position: [272, 112] });
  await addSolvedTasks(PROFILES.complete.id, 4);
  await reconcileWorldRewards(db, { userId: PROFILES.complete.id, classId: CLASS_ID, world });
  await saveWorldLocation(db, { userId: PROFILES.complete.id, classId: CLASS_ID, world, areaId: "hidden-room", spawnId: "library-entry", position: [208, 272] });
  await recordWorldInteraction(db, { userId: PROFILES.complete.id, classId: CLASS_ID, world, interactionId: "golden-bookmark" });
  const rows = await db.select({ id: v2IdentityUsers.id }).from(v2IdentityUsers).where(eq(v2IdentityUsers.isTestProfile, true));
  console.log(`Seeded ${rows.length} test identities into the isolated RPG sandbox.`);
}
await main();
