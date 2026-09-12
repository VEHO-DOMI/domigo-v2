// CODEX DRAFT — NOT CANON · the exact observed data can cross a card boundary.
import { z } from "zod";
import { ZooBeat, ZooProp } from "./paint-zoo.ts";
export const SceneSnapshot = z.object({
  entityId:z.string().min(1),beatId:z.string().min(1),viewId:z.string().min(1),round:z.number().int().nonnegative(),
  view:z.object({x:z.number(),y:z.number(),width:z.number().positive(),height:z.number().positive()}),
  actors:z.array(z.object({id:z.string().min(1),skin:z.string().min(1),x:z.number(),y:z.number(),z:z.enum(["front","behind"]),
    displayHeightPx:z.number().positive(),cell:z.string().min(1),count:z.number().int().nonnegative(),emotion:z.string().optional(),
    worldX:z.number().optional(),worldY:z.number().optional(),hidden:z.boolean().optional()})),
  props:z.array(ZooProp),relations:ZooBeat.shape.relations,
});
export type SceneSnapshotData=z.infer<typeof SceneSnapshot>;
/** Visual facts only: no task answer, author commentary or transient teaching label. */
export function sceneSnapshotText(snapshot:SceneSnapshotData):string {
  const s=SceneSnapshot.parse(snapshot);
  return `[Szene ${s.viewId}: ${JSON.stringify({view:s.view,actors:s.actors.filter(a=>!a.hidden),props:s.props,relations:s.relations})}]`;
}
