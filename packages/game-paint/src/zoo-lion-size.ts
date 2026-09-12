import type { StageV2Spec } from "../../content-schema/src/paint-zoo.ts";
/** Explicit width opts a zoo lion into its authored rectangular canvas.
 * Old stages without width retain their historical 64px sizing. */
export const zooLionDisplaySize = (e: { params?: Record<string, unknown> }): { width: number; height: number } | null => {
  if ((e.params?.guardian as { mode?: string } | undefined)?.mode !== "zoo-lion") return null;
  const lion = (e.params?.stageV2 as StageV2Spec | undefined)?.actors.find(a => a.id === "lion");
  if (!lion || typeof lion.displayWidthPx !== "number" || !Number.isFinite(lion.displayWidthPx)
    || lion.displayWidthPx <= 0 || !Number.isFinite(lion.displayHeightPx) || lion.displayHeightPx <= 0) return null;
  return { width: lion.displayWidthPx, height: lion.displayHeightPx };
};
/** The real renderer delegates the explicit-size branch here; legacy retains
 * its existing reference-frame scale/roll branch. No world position changes. */
export const applyZooLionDisplaySize = (
  image: { setDisplaySize: (width: number, height: number) => unknown },
  e: { params?: Record<string, unknown> }, beat: number,
): boolean => {
  const size = zooLionDisplaySize(e);
  if (!size) return false;
  image.setDisplaySize(size.width * beat, size.height * beat);
  return true;
};
