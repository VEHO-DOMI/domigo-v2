import { zooStageCell } from "./zoo-visuals.ts";
// CODEX DRAFT — NOT CANON · witnessed groups and authored return paths.
import type { StageV2Spec, ZooBeatSpec } from "../../content-schema/src/paint-zoo.ts";
import type { EntityState } from "./entities.ts";
import { SUBS, TILE } from "./paint.ts";
import { sceneView, beginSceneBeat, createSceneState, scenePathAt, snapshotScene, stepSceneBeat, worldPathPoints, type SceneState, type SceneSnapshot } from "./scene-v2.ts";

export interface StageRuntime {
  scene: SceneState; completedBeats: string[]; completedGroups: string[];
  retry: boolean; optionalTaskId?: string; returnedActors: string[];
}
export type StageResult =
  | { type: "question"; taskId: string; snapshot: SceneSnapshot }
  | { type: "home"; actorId: string; flag?: string }
  | { type: "complete" };
export const stageSpec = (e: EntityState): StageV2Spec | undefined => e.role === "scene.stage" ? e.params.stageV2 as StageV2Spec | undefined : undefined;
export const nearObserver = (spec: StageV2Spec, beat: ZooBeatSpec, playerX: number, playerY: number): boolean => {
  const g = spec.groups.find(g => g.id === beat.groupId)!;
  return Math.abs(playerX / SUBS - (g.observer.c + .5) * TILE) <= g.activate.radiusTiles * TILE
    && Math.abs(playerY / SUBS - (g.observer.r + 1) * TILE) <= 10;
};
export const stepStage = (e: EntityState, taskId: string | undefined, input: {
  visible: boolean; playerX: number; playerY: number; grounded: boolean; engage: boolean;
  flags: Set<string>; ownerAvailable: boolean;
}): StageResult[] => {
  const spec = stageSpec(e)!;
  const s = e.stageRuntime ??= { scene: createSceneState(spec), completedBeats: [], completedGroups: [], retry: false, returnedActors: [] };
  const events: StageResult[] = [];
  const active = spec.beats.find(b => b.id === s.scene.beatId);
  const desired = spec.beats.find(b => b.taskIds.includes(s.optionalTaskId ?? taskId ?? ""));
  if (!desired && e.state !== "returning") {
    if (e.state !== "complete") { e.state = "complete"; events.push({type:"complete"}); }
    return events;
  }
  const beat = e.state === "returning" ? active! : desired!;
  const g = spec.groups.find(g => g.id === beat.groupId)!;
  // Group ownership requires the actual observer, including his floor level.
  const canWatch = input.visible && input.grounded && nearObserver(spec, beat, input.playerX, input.playerY);
  if (!canWatch || !input.ownerAvailable || !g.requires.every(id => input.flags.has(id))) return events;
  if (e.state === "waiting" || e.state === "complete" || !active || (active.id !== beat.id && e.state !== "returning")) {
    beginSceneBeat(s.scene, beat, sceneView(e.homeX, e.homeY)); e.state = "moving"; s.returnedActors = []; s.retry = false;
  }
  if (e.state === "moving" || e.state === "observing") {
    const ready = stepSceneBeat(s.scene, spec, beat);
    if (s.scene.ticks >= beat.moveTicks) e.state = "observing";
    if (ready) {
      e.state = "asking";
      events.push({type:"question", taskId: s.optionalTaskId ?? taskId!, snapshot: snapshotScene(e.id,e.homeX,e.homeY,s.scene,spec)});
    }
  } else if (e.state === "asking" && s.retry && input.engage) {
    s.retry = false;
    events.push({type:"question", taskId: s.optionalTaskId ?? taskId!, snapshot: snapshotScene(e.id,e.homeX,e.homeY,s.scene,spec)});
  } else if (e.state === "returning") {
    s.scene.returnTicks++;
    for (const path of beat.afterSolve) {
      const a = s.scene.actors.find(a=>a.id===path.actorId)!;
      const start = s.scene.starts.find(a=>a.id===path.actorId)!;
      const f = s.scene.returnTicks/path.ticks;
      if (path.worldWaypoints) {
        const points = worldPathPoints(path.worldWaypoints);
        const p = scenePathAt([{x:start.worldX ?? e.homeX/SUBS-80+start.x*160,y:start.worldY ?? e.homeY/SUBS-120+start.y*120}, ...points],f);
        a.worldX=p.x; a.worldY=p.y;
      } else Object.assign(a,scenePathAt([{x:start.x,y:start.y},...path.waypoints!],f));
      a.cell=zooStageCell(a.skin,f<1?"moving":"home",s.scene.returnTicks);
      if (f>=1 && !s.returnedActors.includes(a.id)) {
        s.returnedActors.push(a.id); events.push({type:"home",actorId:a.id,flag:path.arrivalFlag});
      }
    }
    if (s.scene.returnTicks >= Math.max(1,...beat.afterSolve.map(p=>p.ticks))) {
      if (!s.optionalTaskId && !s.completedBeats.includes(beat.id)) s.completedBeats.push(beat.id);
      if (!s.optionalTaskId && spec.beats.filter(b=>b.groupId===g.id && !b.variant).every(b=>s.completedBeats.includes(b.id))) {
        if (!s.completedGroups.includes(g.id)) s.completedGroups.push(g.id);
        input.flags.add(g.id);
      }
      delete s.optionalTaskId; e.state="waiting";
    }
  }
  return events;
};
export const solveStage = (e: EntityState): void => {
  const s=e.stageRuntime!;
  e.state="returning"; s.scene.returnTicks=0; s.scene.starts=structuredClone(s.scene.actors); s.retry=false;
};
