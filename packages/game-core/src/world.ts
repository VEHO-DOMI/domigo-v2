import type { WorldDefinition, WorldEffect, WorldPosition } from "@domigo/content-schema";

export interface WorldSaveV2 {
  schemaVersion: 2;
  worldId: string;
  areaId: string;
  spawnId: string;
  tilePosition: WorldPosition;
  visitedAreaIds: string[];
  savedAt: string;
}

export interface WorldEventRecord {
  eventId: string;
  eventType: "area-visited" | "task-completed" | "encounter-completed" | "item-collected";
  sourceId: string;
  areaId: string | null;
}

export interface ProjectedWorldState {
  worldId: string;
  currentAreaId: string;
  currentSpawnId: string;
  position: [number, number];
  visitedAreaIds: string[];
  storyFlags: Record<string, boolean>;
  completedTaskIds: string[];
  completedEncounterIds: string[];
  collectedItemIds: string[];
  itemIds: string[];
  unlockIds: string[];
  openedConnectionIds: string[];
  mapVariants: Record<string, string>;
  revealedInteractableIds: string[];
  /** Experience earned inside this world from the immutable ledger. */
  worldXp: number;
  /** Existing practice experience plus worldXp, calculated by the server. */
  xp: number;
  lastSavedAt: string | null;
}

export function emptyWorldState(world: WorldDefinition): ProjectedWorldState {
  const area = world.areas.find((candidate) => candidate.id === world.entry.areaId)!;
  const spawn = area.spawns.find((candidate) => candidate.id === world.entry.spawnId)!;
  return {
    worldId: world.id,
    currentAreaId: area.id,
    currentSpawnId: spawn.id,
    position: [spawn.position.x * area.tileSize + area.tileSize / 2, spawn.position.y * area.tileSize + area.tileSize / 2],
    visitedAreaIds: [area.id],
    storyFlags: {},
    completedTaskIds: [],
    completedEncounterIds: [],
    collectedItemIds: [],
    itemIds: [],
    unlockIds: [],
    openedConnectionIds: world.connections.filter((connection) => connection.requiredFlag === null).map((connection) => connection.id),
    mapVariants: {},
    revealedInteractableIds: [],
    worldXp: 0,
    xp: 0,
    lastSavedAt: null,
  };
}

export function applyWorldEffects(state: ProjectedWorldState, effects: readonly WorldEffect[]): ProjectedWorldState {
  const next: ProjectedWorldState = {
    ...state,
    storyFlags: { ...state.storyFlags },
    openedConnectionIds: [...state.openedConnectionIds],
    mapVariants: { ...state.mapVariants },
    revealedInteractableIds: [...state.revealedInteractableIds],
  };
  for (const effect of effects) {
    if (effect.kind === "set-flag") next.storyFlags[effect.flag] = true;
    else if (effect.kind === "open-connection" && !next.openedConnectionIds.includes(effect.connectionId)) next.openedConnectionIds.push(effect.connectionId);
    else if (effect.kind === "set-area-variant") next.mapVariants[effect.areaId] = effect.variantId;
    else if (effect.kind === "reveal-interactable" && !next.revealedInteractableIds.includes(effect.interactableId)) next.revealedInteractableIds.push(effect.interactableId);
  }
  return next;
}

export function projectWorldState(world: WorldDefinition, events: readonly WorldEventRecord[], worldXp: number, saved?: Partial<ProjectedWorldState> | null, practiceXp = 0): ProjectedWorldState {
  const empty = emptyWorldState(world);
  const area = world.areas.find((candidate) => candidate.id === saved?.currentAreaId)
    ?? world.areas.find((candidate) => candidate.id === empty.currentAreaId)!;
  const spawn = area.spawns.find((candidate) => candidate.id === saved?.currentSpawnId) ?? area.spawns[0]!;
  const fallbackPosition: [number, number] = [
    spawn.position.x * area.tileSize + area.tileSize / 2,
    spawn.position.y * area.tileSize + area.tileSize / 2,
  ];
  const candidatePosition = saved?.position;
  const usablePosition = Array.isArray(candidatePosition)
    && candidatePosition.length === 2
    && candidatePosition.every((value) => typeof value === "number" && Number.isFinite(value))
    && candidatePosition[0]! >= 0
    && candidatePosition[1]! >= 0
    && candidatePosition[0]! < area.width * area.tileSize
    && candidatePosition[1]! < area.height * area.tileSize;
  const position = usablePosition ? candidatePosition as [number, number] : fallbackPosition;
  const tileX = Math.floor(position[0] / area.tileSize);
  const tileY = Math.floor(position[1] / area.tileSize);
  const collisionToken = [...(area.layers.collision.rows[tileY] ?? "")][tileX] ?? "";
  const safePosition = area.layers.collision.blockedTokens.includes(collisionToken) ? fallbackPosition : position;
  const visited = Array.isArray(saved?.visitedAreaIds)
    ? saved.visitedAreaIds.filter((areaId): areaId is string => typeof areaId === "string" && world.areas.some((candidate) => candidate.id === areaId))
    : [];
  let state: ProjectedWorldState = {
    ...empty,
    currentAreaId: area.id,
    currentSpawnId: spawn.id,
    position: safePosition,
    visitedAreaIds: [...new Set([...visited, area.id])],
    worldXp,
    xp: practiceXp + worldXp,
    lastSavedAt: typeof saved?.lastSavedAt === "string" ? saved.lastSavedAt : null,
  };
  for (const event of events) {
    if (event.eventType === "area-visited" && event.areaId && !state.visitedAreaIds.includes(event.areaId)) state.visitedAreaIds.push(event.areaId);
    if (event.eventType === "task-completed" && !state.completedTaskIds.includes(event.sourceId)) state.completedTaskIds.push(event.sourceId);
    if (event.eventType === "encounter-completed") {
      if (!state.completedEncounterIds.includes(event.sourceId)) state.completedEncounterIds.push(event.sourceId);
      const encounter = world.encounters.find((candidate) => candidate.id === event.sourceId);
      if (encounter) {
        state = applyWorldEffects(state, [{ kind: "set-flag", flag: encounter.completionFlag }, ...encounter.effects]);
        if (encounter.reward.itemId && !state.itemIds.includes(encounter.reward.itemId)) state.itemIds.push(encounter.reward.itemId);
        if (encounter.reward.unlockId && !state.unlockIds.includes(encounter.reward.unlockId)) state.unlockIds.push(encounter.reward.unlockId);
      }
    }
    if (event.eventType === "item-collected" && !state.collectedItemIds.includes(event.sourceId)) state.collectedItemIds.push(event.sourceId);
    if (event.eventType === "item-collected") {
      const item = world.areas.flatMap((area) => area.interactables).find((candidate) => candidate.eventId === event.sourceId);
      if (item) {
        state = applyWorldEffects(state, item.effects);
        if (!state.itemIds.includes(event.sourceId)) state.itemIds.push(event.sourceId);
      }
    }
  }
  return state;
}

export const worldTaskRewardKey = (worldId: string, taskId: string) => `world:${worldId}:task:${taskId}`;
export const worldEncounterRewardKey = (worldId: string, encounterId: string) => `world:${worldId}:encounter:${encounterId}:complete`;
export const worldCollectibleRewardKey = (worldId: string, eventId: string) => `world:${worldId}:collectible:${eventId}`;
