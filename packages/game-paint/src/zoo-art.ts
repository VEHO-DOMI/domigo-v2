// CODEX DRAFT — NOT CANON · opt-in art names; absent art uses the draft kit.
import type { StageV2Spec, ZooGuardianSpec } from "../../content-schema/src/paint-zoo.ts";
import { TILE } from "./paint.ts";
export { ZOO_LION_CELLS } from "../../content-schema/src/zoo-pose-cells.ts";
export const zooLionCell = (state: string, timer: number): string => {
  switch (state) {
    case "review-return": case "prowl": return `walk${Math.floor(timer / 12) % 4}`;
    case "mark": return `mark${Math.min(1, Math.floor(timer / 30))}`;
    case "cast": return `cast${Math.min(1, Math.floor(timer / 6))}`;
    case "returned": return "returned";
    case "review-observe": case "observe": return "watch";
    case "review-report": case "report": return "listen";
    case "release": return `release${Math.floor(timer / 9) % 2}`;
    case "home": return "follow";
    case "lonely": case "finale": return `lonely${Math.floor(timer / 30) % 2}`;
    case "welcomed": return timer < 18 ? "welcome" : timer < 36 ? "lie0" : timer < 54 ? "lie1" : "sleep";
    default: return "sleep";
  }
};
/** A registered independent sign, never a coordinate inferred from the lion. */
export const zooEvidenceRect = (guardian: ZooGuardianSpec, stage: StageV2Spec): { x: number; y: number; w: number; h: number } => {
  const p = stage.props.find(p => p.id === guardian.evidencePropId);
  if (!p?.worldAnchor || !p.canvas || !p.innerRect) throw new Error("Zoo evidence sign has no registered rectangle");
  return { x: (p.worldAnchor.c + .5) * TILE - p.canvas.widthPx / 2 + p.innerRect.x + p.innerRect.width / 2,
    y: (p.worldAnchor.r + 1) * TILE - p.canvas.heightPx + p.innerRect.y + p.innerRect.height / 2,
    w: p.innerRect.width, h: p.innerRect.height };
};
