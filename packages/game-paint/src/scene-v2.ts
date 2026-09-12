import { zooActorSkin, zooStageCell, zooPropLayers } from "./zoo-visuals.ts";
// CODEX DRAFT — NOT CANON · one scene model for the world and the frozen card.
import type { StageV2Spec, ZooBeatSpec } from "../../content-schema/src/paint-zoo.ts";
import { SUBS, TILE } from "./paint.ts";

export interface SceneActor {
  id: string; skin: string; x: number; y: number; z: "front" | "behind";
  displayHeightPx: number; cell: string; count: number; emotion?: string;
  worldX?: number; worldY?: number; hidden?: boolean;
}
export interface SceneSnapshot {
  entityId: string; beatId: string; viewId: string; round: number;
  view: { x: number; y: number; width: number; height: number };
  actors: SceneActor[]; props: StageV2Spec["props"]; relations: ZooBeatSpec["relations"];
}
export interface SceneState {
  beatId: string | null; ticks: number; actors: SceneActor[]; starts: SceneActor[];
  returning: boolean; returnTicks: number; label: string | null;
}
export const createSceneState = (spec: StageV2Spec): SceneState => ({
  beatId: null, ticks: 0, actors: spec.actors.map(a => ({
    id: a.id, skin: a.skin, x: a.anchor.x, y: a.anchor.y, z: "front",
    displayHeightPx: a.displayHeightPx, cell: "a", count: 1,
  })), starts: [], returning: false, returnTicks: 0, label: null,
});
export const sceneView = (xSubs: number, ySubs: number): SceneSnapshot["view"] => ({
  x: xSubs / SUBS - 80, y: ySubs / SUBS - 120, width: 160, height: 120,
});
export const beginSceneBeat = (s: SceneState, beat: ZooBeatSpec, view?: SceneSnapshot["view"]): void => {
  s.beatId = beat.id; s.ticks = 0; s.returning = false; s.returnTicks = 0; s.label = null;
  s.starts = structuredClone(s.actors);
  // A transferred actor is already at a visible world position. Interpolate
  // from that position, never from the local anchor authored before arrival.
  for (const start of s.starts) {
    if (start.worldX === undefined && start.worldY === undefined) continue;
    if (!view) throw new Error("A world-positioned actor needs its scene view before moving.");
    if (start.worldX !== undefined) start.x = (start.worldX - view.x) / view.width;
    if (start.worldY !== undefined) start.y = (start.worldY - view.y) / view.height;
  }
};
/** Authored polyline, no pathfinding. Endpoints are reached exactly. */
export const scenePathAt = (points: readonly { x: number; y: number }[], fraction: number): { x: number; y: number } => {
  const t = Math.max(0, Math.min(1, fraction)) * (points.length - 1);
  const i = Math.min(points.length - 2, Math.floor(t));
  if (points.length === 1) return { ...points[0]! };
  const a = points[i]!; const b = points[i + 1]!; const f = t - i;
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
};
export const stepSceneBeat = (s: SceneState, spec: StageV2Spec, beat: ZooBeatSpec): boolean => {
  s.ticks++;
  const f = Math.min(1, s.ticks / beat.moveTicks);
  for (const p of beat.targetPositions) {
    const a = s.actors.find(a => a.id === p.actorId)!;
    const start = s.starts.find(a => a.id === p.actorId)!;
    a.x = start.x + (p.x - start.x) * f; a.y = start.y + (p.y - start.y) * f; a.z = p.z;
    a.count = beat.countByActor?.[a.id] ?? 1; a.emotion = beat.emotionByActor?.[a.id];
    a.cell = zooStageCell(a.skin,f < 1 ? "moving" : "observing",s.ticks,a.emotion);
    delete a.worldX; delete a.worldY;
  }
  for (const def of spec.actors) {
    const attach = def.attachTo;
    if (!attach) continue;
    const a = s.actors.find(a => a.id === def.id)!;
    const target = s.actors.find(a => a.id === attach.actorId)!;
    // Socket applies only at the authored landing beat, not during approach.
    if (f === 1 && beat.relations.some(r => r.actorId === a.id && r.propId === target.id && r.relation === "on")) {
      a.x = target.x + attach.offsetPx.x / 160; a.y = target.y + attach.offsetPx.y / 120;
    }
  }
  const teach = beat.teachBefore;
  s.label = teach && s.ticks > beat.moveTicks && s.ticks <= beat.moveTicks + teach.holdTicks ? teach.labelEn : null;
  return s.ticks >= beat.moveTicks + (teach?.holdTicks ?? 0) + beat.holdTicks;
};
export const snapshotScene = (entityId: string, xSubs: number, ySubs: number, s: SceneState, spec: StageV2Spec, round = 0): SceneSnapshot => {
  const beat = spec.beats.find(b => b.id === s.beatId);
  if (!beat) throw new Error(`Scene ${entityId} has no observed beat`);
  return structuredClone({ entityId, beatId: beat.id, viewId: beat.viewId, round,
    view: sceneView(xSubs, ySubs),
    actors: s.actors, props: spec.props, relations: beat.relations });
};
/** A home is visible even when the child has not started its first question. */
export const worldSceneSnapshot = (entityId:string,xSubs:number,ySubs:number,s:SceneState,spec:StageV2Spec,round=0):SceneSnapshot =>
  s.beatId ? snapshotScene(entityId,xSubs,ySubs,s,spec,round) : structuredClone({entityId,beatId:"waiting",viewId:"waiting",round,
    view:sceneView(xSubs,ySubs),actors:s.actors,props:spec.props,relations:[]});
export const worldPathPoints = (points: readonly { c: number; r: number }[]): { x: number; y: number }[] =>
  points.map(p => ({ x: (p.c + 0.5) * TILE, y: (p.r + 1) * TILE }));

export interface SceneDrawItem { id: string; stem: string; x: number; y: number; w: number; h: number; depth: number; kind: "actor" | "prop" }
/** Shared placement, including repeated bodies and registered sign rectangles. */
export const sceneDrawItems = (s: SceneSnapshot): SceneDrawItem[] => {
  const items: SceneDrawItem[] = [];
  for (const a of s.actors.filter(a => !a.hidden)) for (let i = 0; i < a.count; i++) {
    const relation=s.relations.find(r=>r.actorId===a.id)?.relation;
    const depth=relation==="in"?2:relation==="behind"||relation==="under"?0:relation==="in front of"||relation==="on"||relation==="next to"?4:a.z==="behind"?0:2;
    items.push({ id: `${a.id}:${i}`, stem: `${zooActorSkin(a.skin)}_${a.cell}`, x: (a.worldX ?? s.view.x + a.x * s.view.width) + i * 18,
      y: a.worldY ?? s.view.y + a.y * s.view.height, w: a.displayHeightPx * .65, h: a.displayHeightPx,
      depth, kind: "actor" });
  }
  for (const p of s.props) for (const layer of zooPropLayers(p.skin)) {
    items.push({ id: zooPropLayers(p.skin).length===1?p.id:`${p.id}:${layer.stem}`, stem: layer.stem, x: p.worldAnchor ? (p.worldAnchor.c + .5) * TILE : s.view.x + (p.anchor?.x ?? .5) * s.view.width,
      y: p.worldAnchor ? (p.worldAnchor.r + 1) * TILE : s.view.y + (p.anchor?.y ?? .8) * s.view.height,
      w: p.canvas?.widthPx ?? 80, h: p.canvas?.heightPx ?? (zooPropLayers(p.skin).length>1?80:52), depth: layer.depth, kind: "prop" });
  }
  return items.sort((a, b) => a.depth - b.depth);
};
