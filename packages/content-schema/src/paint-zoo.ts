// CODEX DRAFT — NOT CANON · opt-in zoo contracts shared by the loader and game.
import { z } from "zod";
import { zooActorPoseCells } from "./zoo-pose-cells.ts";

const Id = z.string().min(1);
const Ticks = z.number().int().positive();
export const ZooCell = z.object({ c: z.number().int().nonnegative(), r: z.number().int().nonnegative() });
export const ZooPoint = z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) });
export const ZooActor = z.object({
  id: Id, skin: Id, displayHeightPx: z.number().positive(), anchor: ZooPoint,
  /** Registered source-frame width; omitted keeps the legacy drawing ratio. */
  displayWidthPx: z.number().finite().positive().optional(),
  attachTo: z.object({ actorId: Id, socket: Id, offsetPx: z.object({ x: z.number(), y: z.number() }) }).optional(),
});
export const ZooProp = z.object({
  id: Id, skin: Id, anchor: ZooPoint.optional(), worldAnchor: ZooCell.optional(),
  canvas: z.object({ widthPx: z.number().positive(), heightPx: z.number().positive() }).optional(),
  innerRect: z.object({ x: z.number().nonnegative(), y: z.number().nonnegative(), width: z.number().positive(), height: z.number().positive() }).optional(),
}).refine(p => !!p.anchor || !!p.worldAnchor, "prop needs an anchor");
/** Optional illustrated props for the classmate's existing task-bound snapshots. */
export const ClassmatePresentation = z.object({
  props: z.array(ZooProp),
  views: z.array(z.object({ taskId: Id, propIds: z.array(Id) })),
  homePropIds: z.array(Id).optional(),
}).superRefine((spec, ctx) => {
  const props = new Set<string>();
  spec.props.forEach((prop, index) => {
    if (props.has(prop.id)) ctx.addIssue({ code: "custom", path: ["props", index, "id"], message: "duplicate prop identity " + prop.id });
    props.add(prop.id);
  });
  const check = (ids: string[], path: (string | number)[]) => {
    const seen = new Set<string>();
    ids.forEach((id, index) => {
      if (seen.has(id)) ctx.addIssue({ code: "custom", path: [...path, index], message: "duplicate visible prop " + id });
      if (!props.has(id)) ctx.addIssue({ code: "custom", path: [...path, index], message: "unknown visible prop " + id });
      seen.add(id);
    });
  };
  const tasks = new Set<string>();
  spec.views.forEach((view, index) => {
    if (tasks.has(view.taskId)) ctx.addIssue({ code: "custom", path: ["views", index, "taskId"], message: "duplicate presentation task " + view.taskId });
    tasks.add(view.taskId);
    check(view.propIds, ["views", index, "propIds"]);
  });
  check(spec.homePropIds ?? [], ["homePropIds"]);
});

export const ZooPath = z.object({
  actorId: Id, ticks: Ticks, waypoints: z.array(ZooPoint).min(1).optional(),
  worldWaypoints: z.array(ZooCell).min(1).optional(), arrivalFlag: Id.optional(),
}).refine(p => !!p.waypoints !== !!p.worldWaypoints, "path needs exactly one coordinate system");
/** Omitted fields inherit the stage view; an empty list intentionally draws none. */
export const ZooSceneView = z.object({
  actorIds: z.array(Id).optional(), propIds: z.array(Id).optional(),
  fitContent: z.boolean().optional(),
}).superRefine((view, ctx) => {
  for (const field of ["actorIds", "propIds"] as const) {
    const seen = new Set<string>();
    for (const [index, id] of (view[field] ?? []).entries()) {
      if (seen.has(id)) ctx.addIssue({ code: "custom", path: [field, index], message: "duplicate visible identity " + id });
      seen.add(id);
    }
  }
});
export const ZooBeat = z.object({
  id: Id, groupId: Id, viewId: Id, view: ZooSceneView.optional(),
  targetPositions: z.array(ZooPoint.extend({ actorId: Id, z: z.enum(["front", "behind"]) })),
  relations: z.array(z.object({ actorId: Id, propId: Id, relation: z.enum(["in", "on", "under", "behind", "next to", "in front of"]) })),
  moveTicks: Ticks, holdTicks: z.number().int().min(30), taskIds: z.array(Id).min(1),
  afterSolve: z.array(ZooPath), variant: z.boolean().optional(),
  teachBefore: z.object({ labelEn: Id, holdTicks: z.number().int().min(30), clearBeforeAsk: z.literal(true) }).optional(),
  countByActor: z.record(Id, z.number().int().positive()).optional(),
  emotionByActor: z.record(Id, Id).optional(),
  /** Observed endpoint pose; never replaces the moving animation. */
  poseByActor: z.record(Id, Id).optional(),
});
export const StageV2 = z.object({
  groups: z.array(z.object({ id: Id, activate: ZooCell.extend({ radiusTiles: z.number().positive() }), observer: ZooCell, requires: z.array(Id) })).min(1),
  actors: z.array(ZooActor).min(1), props: z.array(ZooProp), beats: z.array(ZooBeat).min(1),
  view: ZooSceneView.optional(),
}).superRefine((stage, ctx) => {
  const actors = new Set(stage.actors.map(a => a.id));
  const props = new Set(stage.props.map(p => p.id));
  const check = (view: z.infer<typeof ZooSceneView> | undefined, at: (string | number)[]) => {
    for (const field of ["actorIds", "propIds"] as const) {
      const known = field === "actorIds" ? actors : props;
      for (const [index, id] of (view?.[field] ?? []).entries()) {
        if (!known.has(id)) ctx.addIssue({ code: "custom", path: [...at, field, index], message: "unknown visible " + (field === "actorIds" ? "actor " : "prop ") + id });
      }
    }
  };
  check(stage.view, ["view"]);
  stage.beats.forEach((beat, index) => {
    check(beat.view, ["beats", index, "view"]);
    for (const [id, cell] of Object.entries(beat.poseByActor ?? {})) {
      const matches = stage.actors.filter(a => a.id === id);
      const at = ["beats", index, "poseByActor", id];
      if (matches.length !== 1) ctx.addIssue({ code: "custom", path: at, message: "unknown or ambiguous pose actor " + id });
      else if (!zooActorPoseCells(matches[0]!.skin).includes(cell)) ctx.addIssue({ code: "custom", path: at, message: "unsupported pose " + cell + " for " + matches[0]!.skin });
    }
  });
});
export const TaskSequenceV2 = z.object({
  requiredIds: z.array(Id), variantIds: z.array(Id),
  reserveSlots: z.array(z.object({ slotId: Id, target: Id, taskId: Id, when: z.literal("optional-after-sequence"), countsAsRequired: z.literal(false) })).optional(),
});
export const SequenceTransfer = z.object({
  transferId: Id, target: z.object({ entityId: Id, actorId: Id.optional() }), actorId: Id.optional(),
  waypoints: z.array(ZooCell).min(2), ticks: Ticks, arrivalFlag: Id,
});
export const ZooGuardian = z.object({
  mode: z.literal("zoo-lion"), plateCount: z.literal(4), playAfterSolvePaths: z.boolean().optional(),
  rounds: z.array(z.object({
    taskIds: z.tuple([Id, Id]), sceneId: Id, homeActorId: Id,
    homeWaypoints: z.array(ZooPoint).min(2), homeTicks: z.number().int().min(90).max(120),
    returnAfterGroundContact: z.boolean().optional(), inactivePlatePropId: Id.optional(),
  })).length(4),
  projectileSkin: Id, evidencePropId: Id, arenaMinC: z.number().int().nonnegative(), arenaMaxC: z.number().int().positive(),
  prowlTicks: Ticks, prowlSpeedPxPerTick: z.number().positive(), telegraphTicks: z.array(z.number().int().min(45)).length(4),
  projectileSpeedPxPerTick: z.number().positive(), settleBetweenTicks: Ticks,
  finaleTaskId: Id, finaleAfter: z.literal("allHome"), welcomeWaypoints: z.array(ZooCell).min(2),
}).refine(g => g.arenaMaxC > g.arenaMinC && new Set(g.rounds.flatMap(r => r.taskIds).concat(g.finaleTaskId)).size === 9, "guardian needs a real arena and nine distinct tasks");
export const ZooRide = z.object({
  mode: z.literal("shuttle"), from: ZooCell, to: ZooCell, dwellTicks: Ticks,
  startOnBoard: z.literal(true), requiredForExit: z.boolean(), requires: z.array(Id),
  speedPxPerTick: z.number().positive(), deckWidthPx: z.literal(40),
}).refine(r => r.from.c !== r.to.c || r.from.r !== r.to.r, "ride must travel");

export type ClassmatePresentationSpec = z.infer<typeof ClassmatePresentation>;
export type ZooSceneViewSpec = z.infer<typeof ZooSceneView>;
export type StageV2Spec = z.infer<typeof StageV2>;
export type ZooGuardianSpec = z.infer<typeof ZooGuardian>;
export type ZooRideSpec = z.infer<typeof ZooRide>;
export type TaskSequenceV2Spec = z.infer<typeof TaskSequenceV2>;
export type SequenceTransferSpec = z.infer<typeof SequenceTransfer>;
export type ZooBeatSpec = z.infer<typeof ZooBeat>;
