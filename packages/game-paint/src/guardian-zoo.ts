import { zooStageCell } from "./zoo-visuals.ts";
// CODEX DRAFT — NOT CANON · opt-in grounded guardian, independent of the slate.
import type { EntityState, EntityWorld, EntityEvent, WorldInput, ProjectileState } from "./entities.ts";
import type { ZooGuardianSpec, StageV2Spec } from "../../content-schema/src/paint-zoo.ts";
import { groundSurfaceAt } from "./collide.ts";
import { SUBS, TILE } from "./paint.ts";
import { sceneView, beginSceneBeat, createSceneState, scenePathAt, stepSceneBeat, worldPathPoints, worldSceneSnapshot, type SceneState, type SceneSnapshot } from "./scene-v2.ts";
import { zooLionCell } from "./zoo-art.ts";

export interface ZooState {
  round: number; card: number; deflects: number; homes: string[];
  scene: SceneState; bodyStartX?:number; review?: {
    taskId: string; slotId: string; savedScene: SceneState;
    savedBody: { x: number; y: number; dir: -1 | 1 };
    returnStart?: { x: number; y: number; actors: SceneState["actors"]; tick: number };
  }; homeStart?: { x: number; y: number }; waitingForRetry: boolean;
}
export const zooSpec = (e: EntityState): ZooGuardianSpec | undefined => {
  const g = e.params.guardian as ZooGuardianSpec | undefined;
  return g?.mode === "zoo-lion" ? g : undefined;
};
export const zooTaskId = (e: EntityState): string | undefined => {
  const g = zooSpec(e); const s = e.zoo;
  return !g || !s ? undefined : s.round === 4 ? g.finaleTaskId : g.rounds[s.round]?.taskIds[s.card];
};
/** The drawn lion owns the same grounded feet as its physical body. */
export const zooSnapshot=(e:EntityState):SceneSnapshot=>{
  const s=worldSceneSnapshot(e.id,e.homeX,e.homeY,e.zoo!.scene,e.params.stageV2!,Math.min(4,e.zoo!.round+1));
  const lion=s.actors.find(a=>a.id==="lion");
  if(lion){lion.worldX=e.x/SUBS;lion.worldY=e.y/SUBS;lion.displayHeightPx=64;lion.cell=zooLionCell(e.vx!==0&&["observe","review-observe"].includes(e.state)?"prowl":e.state,e.timer);}
  return s;
};
/** Walk the real body into its authored picture; no pose-to-body teleport. */
export const moveZooToBeat=(e:EntityState):void=>{
  const s=e.zoo!,beat=e.params.stageV2!.beats.find(b=>b.id===s.scene.beatId)!;
  const target=beat.targetPositions.find(p=>p.actorId==="lion");if(!target)return;
  const start=s.bodyStartX??e.x,end=e.homeX-80*SUBS+target.x*160*SUBS;
  const before=e.x;e.x=Math.round(start+(end-start)*Math.min(1,s.scene.ticks/beat.moveTicks));e.vx=e.x-before;
  if(e.vx)e.dir=e.vx>0?1:-1;
};
const state = (e: EntityState, next: string): void => { e.state = next; e.timer = 0; e.vx = 0; e.vy = 0; };
const prepareBeat = (e: EntityState): void => {
  const spec = e.params.stageV2 as StageV2Spec;
  const beat = spec.beats.find(b => b.taskIds.includes(zooTaskId(e)!));
  if (!beat || !e.zoo) throw new Error(`Zoo guardian ${e.id}: task has no scene`);
  beginSceneBeat(e.zoo.scene, beat, sceneView(e.homeX, e.homeY));
  e.zoo.bodyStartX=e.x;
  state(e, e.zoo.round === 4 ? "lonely" : "observe");
};

export const stepZooGuardian = (e: EntityState, w: EntityWorld, grid: readonly string[], inp: WorldInput, events: EntityEvent[]): void => {
  const g = zooSpec(e)!; const stage = e.params.stageV2 as StageV2Spec;
  const s = e.zoo ??= { round: 0, card: 0, deflects: 0, homes: [], scene: createSceneState(stage), waitingForRetry: false };
  if (w.guardianKnots < 0) w.guardianKnots = Math.max(0,e.hp);
  const floor = groundSurfaceAt(grid, e.x / SUBS, Math.max(0, Math.floor(e.homeY / SUBS / TILE) - 1), 4);
  if (floor) e.y = floor.yPx * SUBS;
  const round = g.rounds[s.round];
  switch (e.state) {
    case "prowl": {
      const min = (g.arenaMinC + 0.5) * TILE * SUBS; const max = (g.arenaMaxC + 0.5) * TILE * SUBS;
      const before = e.x;
      e.x = Math.max(min, Math.min(max, e.x + Math.round(g.prowlSpeedPxPerTick * SUBS) * e.dir)); e.vx = e.x - before;
      if (e.x === min || e.x === max) e.dir = e.dir === 1 ? -1 : 1;
      if (e.timer >= g.prowlTicks) { state(e, "mark"); e.dir = inp.playerX < e.x ? -1 : 1; }
      break;
    }
    case "mark":
      if (e.timer >= Math.max(s.round === 0 ? 60 : 45, g.telegraphTicks[s.round]!)) state(e, "cast");
      break;
    case "cast":
      if (e.timer === 1) {
        e.throws++;
        w.projectiles.push({ id: w.nextProjectileId++, kind: "plate", skin: g.projectileSkin,
          x: e.x, y: e.y - (s.round === 1 ? 12 : 18) * SUBS,
          vx: Math.round(g.projectileSpeedPxPerTick * SUBS) * e.dir, vy: 0,
          deflected: false, fromId: e.id, dead: false, age: 0, colour: g.projectileSkin,
          groundReturn: round?.returnAfterGroundContact === true });
      } else if (!w.projectiles.some(p => p.fromId === e.id && !p.dead)) state(e, "prowl");
      break;
    case "returned": if (e.timer >= g.settleBetweenTicks) prepareBeat(e); break;
    case "observe": case "lonely": {
      const beat = stage.beats.find(b => b.id === s.scene.beatId)!;
      const ready=stepSceneBeat(s.scene, stage, beat);moveZooToBeat(e);
      if (ready) {
        state(e, s.round === 4 ? "finale" : "report");
        events.push({ type: "zooQuestion", id: e.id, taskId: zooTaskId(e)!, finale: s.round === 4 });
      }
      break;
    }
    case "report": case "finale":
      if (s.waitingForRetry && inp.playerEngage) {
        s.waitingForRetry = false;
        events.push({ type: "zooQuestion", id: e.id, taskId: zooTaskId(e)!, finale: s.round === 4 });
      }
      break;
    case "release":
      if (e.timer >= g.settleBetweenTicks) {
        state(e, "home"); const actor = s.scene.actors.find(a => a.id === round!.homeActorId)!;
        s.homeStart = { x: actor.x, y: actor.y };
        w.guardianKnots = e.hp = 3 - s.round;
        events.push({ type: "zooRound", id: e.id, round: s.round + 1, actorId: round!.homeActorId });
      }
      break;
    case "home": {
      const actor = s.scene.actors.find(a => a.id === round!.homeActorId)!;
      Object.assign(actor, scenePathAt([s.homeStart!, ...round!.homeWaypoints], e.timer / round!.homeTicks)); actor.cell = zooStageCell(actor.skin,"moving",e.timer);
      if (e.timer >= round!.homeTicks) {
        actor.cell = "a"; s.homes.push(actor.id);
        events.push({ type: "zooHome", id: e.id, actorId: actor.id, round: s.round + 1 });
        s.round++; s.card = 0;
        if (s.round === 4) prepareBeat(e); else state(e, "prowl");
      }
      break;
    }
    case "welcomed": {
      const path = worldPathPoints(g.welcomeWaypoints); const p = scenePathAt(path, e.timer / 90);
      e.x = Math.round(p.x * SUBS); e.y = Math.round(p.y * SUBS);
      if (e.timer >= 90) { state(e, "done"); e.redeemed = true; events.push({ type: "guardianDown", id: e.id }); }
      break;
    }
  }
};

/** Validating the active window also makes duplicate/stale answers harmless. */
export const solveZooTask = (e: EntityState, taskId: string | undefined): boolean => {
  const s = e.zoo;
  if (!s || !["report", "finale"].includes(e.state) || taskId !== zooTaskId(e)) return false;
  s.waitingForRetry = false;
  if (s.round === 4) { if (s.homes.length !== 4) return false; state(e, "welcomed"); }
  else if (++s.card === 2) state(e, "release");
  else prepareBeat(e);
  return true;
};

/** Optional questions borrow the scene. Everyone walks back while the player is free. */
export const beginZooReviewReturn = (e: EntityState): void => {
  const review = e.zoo!.review!;
  review.returnStart = { x: e.x, y: e.y, actors: structuredClone(e.zoo!.scene.actors), tick: 0 };
  e.zoo!.waitingForRetry = false;
  state(e, "review-return");
};
export const stepZooReviewReturn = (e: EntityState): void => {
  const review = e.zoo!.review!;
  const start = review.returnStart!;
  const f = Math.min(1, ++start.tick / 90);
  const before = e.x;
  e.x = Math.round(start.x + (review.savedBody.x - start.x) * f);
  e.y = Math.round(start.y + (review.savedBody.y - start.y) * f);
  e.vx = e.x - before;
  if (e.vx) e.dir = e.vx > 0 ? 1 : -1;
  e.timer = start.tick;
  for (const actor of e.zoo!.scene.actors) {
    const from = start.actors.find(a => a.id === actor.id)!;
    const to = review.savedScene.actors.find(a => a.id === actor.id)!;
    actor.x = from.x + (to.x - from.x) * f;
    actor.y = from.y + (to.y - from.y) * f;
    actor.cell = zooStageCell(actor.skin, "moving", start.tick);
  }
  if (f === 1) {
    e.zoo!.scene = review.savedScene;
    e.dir = review.savedBody.dir;
    delete e.zoo!.review;
    state(e, "done");
  }
};

/** Plates have their own collision path; ordinary chalk cannot unlock a lion. */
export const stepZooPlate = (p: ProjectileState, w: EntityWorld, grid: readonly string[], inp: WorldInput, events: EntityEvent[]): void => {
  const e = w.entities.find(e => e.id === p.fromId); const s = e?.zoo; const g = e && zooSpec(e);
  if (!e || !s || !g || e.state !== "cast") { p.dead = true; return; }
  p.age++;
  p.x += p.vx;
  if (p.groundReturn && !p.grounded) {
    p.y += SUBS;
    const floor = groundSurfaceAt(grid, p.x / SUBS, Math.floor(p.y / SUBS / TILE), 4);
    if (floor && p.y >= floor.yPx * SUBS - 8 * SUBS) { p.y = floor.yPx * SUBS - 8 * SUBS; p.grounded = true; p.vx *= -1; }
  }
  if (!p.deflected && (!p.groundReturn || p.grounded) && inp.fist?.active
    && Math.abs(p.x - inp.fist.x) < 20 * SUBS && Math.abs(p.y - inp.fist.y) < 26 * SUBS) {
    p.deflected = true; s.deflects++;
    p.vx = (p.x < e.x ? 1 : -1) * Math.round(g.projectileSpeedPxPerTick * 2 * SUBS);
    events.push({ type: "projectileDeflected", id: p.id });
  }
  if (p.deflected && Math.abs(p.x - e.x) < 22 * SUBS) {
    p.dead = true; state(e, "returned"); return;
  }
  if (!p.deflected && p.age > 8 && inp.playerIframes === 0 && Math.abs(p.x - inp.playerX) < 10 * SUBS && Math.abs(p.y - (inp.playerY - 15 * SUBS)) < 16 * SUBS) {
    p.dead = true; events.push({ type: "zooMiss", id: e.id });
  }
  if (p.age > 240 || p.x < (g.arenaMinC - 2) * TILE * SUBS || p.x > (g.arenaMaxC + 3) * TILE * SUBS) p.dead = true;
};
