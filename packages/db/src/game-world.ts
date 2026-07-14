import { and, asc, eq, sql } from "drizzle-orm";
import type { WorldDefinition } from "@domigo/content-schema";
import { projectWorldState, worldCollectibleRewardKey, worldEncounterRewardKey, worldTaskRewardKey, type ProjectedWorldState, type WorldEventRecord } from "@domigo/game-core";
import { gameWorldEvents, practiceAttempts, reviewQueue, studentWorldStates, userProgress, v2IdentityUsers, xpEntries } from "./schema.ts";
import type { Db } from "./index.ts";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function asProjected(value: unknown): Partial<ProjectedWorldState> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Partial<ProjectedWorldState> : null;
}

async function addXp(db: Db, input: { userId: string; worldId: string; sourceType: string; sourceId: string; amount: number; reason: string; idempotencyKey: string }): Promise<boolean> {
  if (input.amount <= 0) return false;
  const inserted = await db.insert(xpEntries).values(input).onConflictDoNothing({ target: [xpEntries.userId, xpEntries.idempotencyKey] }).returning({ id: xpEntries.id });
  return inserted.length > 0;
}

async function appendEvent(db: Db, input: { userId: string; worldId: string; eventId: string; eventType: WorldEventRecord["eventType"]; sourceId: string; areaId: string | null; payload?: unknown }): Promise<boolean> {
  const inserted = await db.insert(gameWorldEvents).values({ ...input, payload: input.payload ?? {} }).onConflictDoNothing({ target: [gameWorldEvents.userId, gameWorldEvents.worldId, gameWorldEvents.eventId] }).returning({ id: gameWorldEvents.id });
  return inserted.length > 0;
}

async function projectionInputs(db: Db, userId: string, worldId: string) {
  const [savedRows, eventRows, xpRows, practiceXpRows] = await Promise.all([
    db.select().from(studentWorldStates).where(and(eq(studentWorldStates.userId, userId), eq(studentWorldStates.worldId, worldId))).limit(1),
    db.select({ eventId: gameWorldEvents.eventId, eventType: gameWorldEvents.eventType, sourceId: gameWorldEvents.sourceId, areaId: gameWorldEvents.areaId }).from(gameWorldEvents).where(and(eq(gameWorldEvents.userId, userId), eq(gameWorldEvents.worldId, worldId))).orderBy(asc(gameWorldEvents.createdAt)),
    db.select({ total: sql<number>`coalesce(sum(${xpEntries.amount}), 0)::int` }).from(xpEntries).where(and(eq(xpEntries.userId, userId), eq(xpEntries.worldId, worldId))),
    db.select({ total: sql<number>`${userProgress.xp} + ${userProgress.grammarXp}` }).from(userProgress).where(eq(userProgress.userId, userId)).limit(1),
  ]);
  const saved = savedRows[0];
  return {
    saved,
    events: eventRows.filter((row): row is typeof row & { eventType: WorldEventRecord["eventType"] } => row.eventType === "area-visited" || row.eventType === "task-completed" || row.eventType === "encounter-completed" || row.eventType === "item-collected"),
    worldXp: xpRows[0]?.total ?? 0,
    practiceXp: practiceXpRows[0]?.total ?? 0,
  };
}

export async function loadStudentWorldState(db: Db, userId: string, world: WorldDefinition): Promise<ProjectedWorldState> {
  const input = await projectionInputs(db, userId, world.id);
  const saved = input.saved;
  const partial = saved ? {
    ...asProjected(saved.statePayload),
    currentAreaId: saved.currentAreaId,
    currentSpawnId: saved.currentSpawnId,
    position: [saved.posX, saved.posY] as [number, number],
    visitedAreaIds: asStringArray(saved.visitedAreaIds),
    lastSavedAt: saved.updatedAt.toISOString(),
  } : null;
  return projectWorldState(world, input.events, input.worldXp, partial, input.practiceXp);
}

async function cacheProjection(db: Db, userId: string, classId: string, world: WorldDefinition): Promise<ProjectedWorldState> {
  const state = await loadStudentWorldState(db, userId, world);
  const now = new Date();
  await db.insert(studentWorldStates).values({ userId, classId, worldId: world.id, currentAreaId: state.currentAreaId, currentSpawnId: state.currentSpawnId, posX: Math.round(state.position[0]), posY: Math.round(state.position[1]), visitedAreaIds: state.visitedAreaIds, statePayload: state, createdAt: now, updatedAt: now }).onConflictDoUpdate({
    target: [studentWorldStates.userId, studentWorldStates.worldId],
    set: { visitedAreaIds: state.visitedAreaIds, statePayload: state, updatedAt: now },
  });
  return state;
}

export async function saveWorldLocation(db: Db, input: { userId: string; classId: string; world: WorldDefinition; areaId: string; spawnId: string; position: [number, number] }): Promise<ProjectedWorldState> {
  const area = input.world.areas.find((candidate) => candidate.id === input.areaId);
  if (!area || !area.spawns.some((candidate) => candidate.id === input.spawnId)) throw new Error("invalid world location");
  const maxX = area.width * area.tileSize;
  const maxY = area.height * area.tileSize;
  if (input.position[0] < 0 || input.position[1] < 0 || input.position[0] >= maxX || input.position[1] >= maxY) throw new Error("world position outside area");
  const tileX = Math.floor(input.position[0] / area.tileSize);
  const tileY = Math.floor(input.position[1] / area.tileSize);
  const collisionToken = [...(area.layers.collision.rows[tileY] ?? "")][tileX] ?? "";
  if (area.layers.collision.blockedTokens.includes(collisionToken)) throw new Error("world position is blocked");
  await appendEvent(db, { userId: input.userId, worldId: input.world.id, eventId: `visit:${area.id}`, eventType: "area-visited", sourceId: area.id, areaId: area.id });
  const previous = await loadStudentWorldState(db, input.userId, input.world);
  const visited = [...new Set([...previous.visitedAreaIds, area.id])];
  const now = new Date();
  await db.insert(studentWorldStates).values({ userId: input.userId, classId: input.classId, worldId: input.world.id, currentAreaId: area.id, currentSpawnId: input.spawnId, posX: Math.round(input.position[0]), posY: Math.round(input.position[1]), visitedAreaIds: visited, statePayload: { ...previous, currentAreaId: area.id, currentSpawnId: input.spawnId, position: input.position, visitedAreaIds: visited }, createdAt: now, updatedAt: now }).onConflictDoUpdate({
    target: [studentWorldStates.userId, studentWorldStates.worldId],
    set: { currentAreaId: area.id, currentSpawnId: input.spawnId, posX: Math.round(input.position[0]), posY: Math.round(input.position[1]), visitedAreaIds: visited, updatedAt: now },
  });
  return loadStudentWorldState(db, input.userId, input.world);
}

export async function reconcileWorldRewards(db: Db, input: { userId: string; classId: string; world: WorldDefinition }): Promise<ProjectedWorldState> {
  const attempts = await db.select({ itemId: practiceAttempts.itemId, encounterId: practiceAttempts.worldEncounterId, tier: practiceAttempts.tier, xpAwarded: practiceAttempts.xpAwarded }).from(practiceAttempts).where(and(eq(practiceAttempts.userId, input.userId), eq(practiceAttempts.worldId, input.world.id)));
  let projected = await loadStudentWorldState(db, input.userId, input.world);
  for (const encounter of input.world.encounters) {
    if (encounter.requiresFlag && !projected.storyFlags[encounter.requiresFlag]) continue;
    const solved = new Set<string>();
    for (const attempt of attempts) {
      if (attempt.encounterId !== encounter.id || attempt.tier !== "correct") continue;
      solved.add(attempt.itemId);
      await appendEvent(db, { userId: input.userId, worldId: input.world.id, eventId: `task:${encounter.id}:${attempt.itemId}`, eventType: "task-completed", sourceId: attempt.itemId, areaId: null });
      await addXp(db, { userId: input.userId, worldId: input.world.id, sourceType: "task", sourceId: attempt.itemId, amount: attempt.xpAwarded, reason: `First successful task in ${encounter.id}`, idempotencyKey: worldTaskRewardKey(input.world.id, attempt.itemId) });
    }
    if (encounter.taskRefs.every((taskId) => solved.has(taskId))) {
      await appendEvent(db, { userId: input.userId, worldId: input.world.id, eventId: `encounter:${encounter.id}`, eventType: "encounter-completed", sourceId: encounter.id, areaId: null });
      await addXp(db, { userId: input.userId, worldId: input.world.id, sourceType: "encounter", sourceId: encounter.id, amount: encounter.reward.xp, reason: `Completed ${encounter.id}`, idempotencyKey: worldEncounterRewardKey(input.world.id, encounter.id) });
      projected = await loadStudentWorldState(db, input.userId, input.world);
    }
  }
  return cacheProjection(db, input.userId, input.classId, input.world);
}

export async function recordWorldInteraction(db: Db, input: { userId: string; classId: string; world: WorldDefinition; interactionId: string }): Promise<ProjectedWorldState> {
  const item = input.world.areas.flatMap((area) => area.interactables.map((interactable) => ({ area, interactable }))).find(({ interactable }) => interactable.id === input.interactionId);
  if (!item || item.interactable.kind !== "collectible" || !item.interactable.eventId) throw new Error("invalid world interaction");
  const state = await loadStudentWorldState(db, input.userId, input.world);
  if (item.interactable.requiresFlag && !state.storyFlags[item.interactable.requiresFlag]) throw new Error("interaction prerequisite not met");
  if (state.currentAreaId !== item.area.id) throw new Error("interaction is not in the current area");
  await appendEvent(db, { userId: input.userId, worldId: input.world.id, eventId: `item:${item.interactable.eventId}`, eventType: "item-collected", sourceId: item.interactable.eventId, areaId: item.area.id });
  await addXp(db, { userId: input.userId, worldId: input.world.id, sourceType: "discovery", sourceId: item.interactable.eventId, amount: item.interactable.rewardXp, reason: "Optional discovery", idempotencyKey: worldCollectibleRewardKey(input.world.id, item.interactable.eventId) });
  return cacheProjection(db, input.userId, input.classId, input.world);
}

export async function resetTestWorld(db: Db, input: { userId: string; worldId: string }): Promise<void> {
  const test = await db.select({ isTestProfile: v2IdentityUsers.isTestProfile }).from(v2IdentityUsers).where(eq(v2IdentityUsers.id, input.userId)).limit(1);
  if (test[0]?.isTestProfile !== true) throw new Error("reset is restricted to test profiles");
  await db.delete(xpEntries).where(and(eq(xpEntries.userId, input.userId), eq(xpEntries.worldId, input.worldId)));
  await db.delete(gameWorldEvents).where(and(eq(gameWorldEvents.userId, input.userId), eq(gameWorldEvents.worldId, input.worldId)));
  await db.delete(practiceAttempts).where(and(eq(practiceAttempts.userId, input.userId), eq(practiceAttempts.worldId, input.worldId)));
  await db.delete(studentWorldStates).where(and(eq(studentWorldStates.userId, input.userId), eq(studentWorldStates.worldId, input.worldId)));
  await db.delete(reviewQueue).where(eq(reviewQueue.userId, input.userId));
  await db.delete(userProgress).where(eq(userProgress.userId, input.userId));
}

export async function getWorldReview(db: Db, worldId: string) {
  const profiles = await db.select({ id: v2IdentityUsers.id, displayName: v2IdentityUsers.displayName, classId: v2IdentityUsers.classId }).from(v2IdentityUsers).where(and(eq(v2IdentityUsers.role, "student"), eq(v2IdentityUsers.isTestProfile, true)));
  const out = [];
  for (const profile of profiles) {
    const [state, attempts, xp] = await Promise.all([
      db.select().from(studentWorldStates).where(and(eq(studentWorldStates.userId, profile.id), eq(studentWorldStates.worldId, worldId))).limit(1),
      db.select().from(practiceAttempts).where(and(eq(practiceAttempts.userId, profile.id), eq(practiceAttempts.worldId, worldId))).orderBy(asc(practiceAttempts.createdAt)),
      db.select().from(xpEntries).where(and(eq(xpEntries.userId, profile.id), eq(xpEntries.worldId, worldId))).orderBy(asc(xpEntries.createdAt)),
    ]);
    out.push({ profile, state: state[0] ?? null, attempts, xp });
  }
  return out;
}
