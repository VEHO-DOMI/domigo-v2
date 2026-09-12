// CODEX DRAFT — NOT CANON · opt-in art contracts shared by loader and tests.
import { z } from "zod";
export const ZooArtSet = z.literal("zoo-v2");
export const PaintCollectSkin = z.string().min(1);
export const PaintGunnerAim = z.literal("lock-on-telegraph");
export const PaintProjectileSkin = z.string().min(1);
export const PaintArtParams = z.object({artSet:ZooArtSet.optional(),gunnerAim:PaintGunnerAim.optional(),projectileSkin:PaintProjectileSkin.optional()});
export const PaintArtPhase = z.object({collectSkin:PaintCollectSkin.optional(),collectAnimation:ZooArtSet.optional()});
export const PaintArtLevel = z.object({collectSkin:PaintCollectSkin.optional(),heroArtSet:ZooArtSet.optional()});
