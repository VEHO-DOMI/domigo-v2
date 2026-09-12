// CODEX DRAFT — NOT CANON · selected content may opt in to a wider card viewport.
import type { SceneDrawItem, SceneSnapshot } from "./scene-v2.ts";

/** Preserve the old crop unless explicitly enabled; pad the union only once. */
export const sceneCutoutBounds = (snapshot: Pick<SceneSnapshot, "view" | "fitContent">, items: readonly SceneDrawItem[]): SceneSnapshot["view"] => {
  const view = snapshot.view;
  let left = view.x, top = view.y, right = view.x + view.width, bottom = view.y + view.height;
  if (snapshot.fitContent === true) for (const item of items) {
    left = Math.min(left, item.x - item.w / 2);
    right = Math.max(right, item.x + item.w / 2);
    top = Math.min(top, item.y - item.h);
    bottom = Math.max(bottom, item.y);
  }
  const margin = 16;
  return { x: left - margin, y: top - margin, width: right - left + margin * 2, height: bottom - top + margin * 2 };
};
