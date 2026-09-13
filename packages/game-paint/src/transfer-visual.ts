// CODEX DRAFT — NOT CANON · the travelling body uses its destination's drawing contract.
import type { EntityState } from "./entities.ts";
import type { TransferState } from "./learning.ts";
import type { SceneDrawItem } from "./scene-v2.ts";
import { entDisplayH } from "./anim.ts";
import { zooActorSkin, zooEntityCell, zooStageCell } from "./zoo-visuals.ts";

/** Only active, present-room transfers draw; the simulation owns position and arrival. */
export const transferDrawItem = (transfer: TransferState, target: EntityState | undefined): SceneDrawItem | null => {
  if (!target || target.id !== transfer.targetId || transfer.tick < 0 || transfer.tick >= transfer.ticks) return null;
  const actor = target.stageRuntime?.scene.actors.find(a => a.id === transfer.actorId);
  const bodySkin = !actor && target.skin === "zoozug" && ["train", "zug"].includes(transfer.skin) ? target.skin : transfer.skin;
  const skin = actor ? zooActorSkin(bodySkin) : bodySkin;
  const height = actor?.displayHeightPx ?? entDisplayH({ ...target, skin });
  const cell = actor ? zooStageCell(bodySkin, "moving", transfer.tick)
    : zooEntityCell({ ...target, skin, state: skin === "zoozug" ? "shuttle-out" : "roam", timer: transfer.tick });
  return { id: `transfer:${transfer.id}`, stem: `${skin}_${cell}`, x: transfer.x, y: transfer.y,
    w: !actor && target.role.startsWith("platform") ? 40 : height * .65, h: height, depth: 2, kind: "actor" };
};
