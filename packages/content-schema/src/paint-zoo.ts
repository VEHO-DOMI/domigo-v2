// CODEX DRAFT — NOT CANON · opt-in zoo contracts shared by the loader and game.
import { z } from "zod";

const Id = z.string().min(1);
const Ticks = z.number().int().positive();
export const ZooCell = z.object({ c: z.number().int().nonnegative(), r: z.number().int().nonnegative() });
export const ZooPoint = z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) });
export const ZooActor = z.object({
  id: Id, skin: Id, displayHeightPx: z.number().positive(), anchor: ZooPoint,
  attachTo: z.object({ actorId: Id, socket: Id, offsetPx: z.object({ x: z.number(), y: z.number() }) }).optional(),
});
export const ZooProp = z.object({
  id: Id, skin: Id, anchor: ZooPoint.optional(), worldAnchor: ZooCell.optional(),
  canvas: z.object({ widthPx: z.number().positive(), heightPx: z.number().positive() }).optional(),
  innerRect: z.object({ x: z.number().nonnegative(), y: z.number().nonnegative(), width: z.number().positive(), height: z.number().positive() }).optional(),
}).refine(p => !!p.anchor || !!p.worldAnchor, "prop needs an anchor");
export const ZooPath = z.object({
  actorId: Id, ticks: Ticks, waypoints: z.array(ZooPoint).min(1).optional(),
  worldWaypoints: z.array(ZooCell).min(1).optional(), arrivalFlag: Id.optional(),
}).refine(p => !!p.waypoints !== !!p.worldWaypoints, "path needs exactly one coordinate system");
export const ZooBeat = z.object({
  id: Id, groupId: Id, viewId: Id,
  targetPositions: z.array(ZooPoint.extend({ actorId: Id, z: z.enum(["front", "behind"]) })),
  relations: z.array(z.object({ actorId: Id, propId: Id, relation: z.enum(["in", "on", "under", "behind", "next to", "in front of"]) })),
  moveTicks: Ticks, holdTicks: z.number().int().min(30), taskIds: z.array(Id).min(1),
  afterSolve: z.array(ZooPath), variant: z.boolean().optional(),
  teachBefore: z.object({ labelEn: Id, holdTicks: z.number().int().min(30), clearBeforeAsk: z.literal(true) }).optional(),
  countByActor: z.record(Id, z.number().int().positive()).optional(),
  emotionByActor: z.record(Id, Id).optional(),
});
export const StageV2 = z.object({
  groups: z.array(z.object({ id: Id, activate: ZooCell.extend({ radiusTiles: z.number().positive() }), observer: ZooCell, requires: z.array(Id) })).min(1),
  actors: z.array(ZooActor).min(1), props: z.array(ZooProp), beats: z.array(ZooBeat).min(1),
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
  mode: z.literal("zoo-lion"), plateCount: z.literal(4),
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

export type StageV2Spec = z.infer<typeof StageV2>;
export type ZooGuardianSpec = z.infer<typeof ZooGuardian>;
export type ZooRideSpec = z.infer<typeof ZooRide>;
export type TaskSequenceV2Spec = z.infer<typeof TaskSequenceV2>;
export type SequenceTransferSpec = z.infer<typeof SequenceTransfer>;
export type ZooBeatSpec = z.infer<typeof ZooBeat>;
