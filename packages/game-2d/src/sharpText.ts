import type Phaser from "phaser";
import { RENDER_SCALE } from "./arcade.ts";

/** v5.2 sharpness law: the camera renders at ×RENDER_SCALE, so any text
 *  rasterized at CSS density ships blurry. One factory hook per scene keeps
 *  every label crisp without touching the ~40 call sites. */
export function sharpenTextFactory(scene: Phaser.Scene): void {
  const raw = scene.add.text.bind(scene.add);
  scene.add.text = ((...args: Parameters<typeof raw>) => raw(...args).setResolution(RENDER_SCALE)) as typeof scene.add.text;
}
