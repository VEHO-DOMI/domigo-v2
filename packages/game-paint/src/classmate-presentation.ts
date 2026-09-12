// CODEX DRAFT — NOT CANON · data-only props shared by the observed card and world.
import type { ClassmatePresentationSpec } from "../../content-schema/src/paint-zoo.ts";

/** The home view is selected only after redemption; missing contracts/views draw no extra props. */
export const classmatePresentationProps = (spec: ClassmatePresentationSpec | undefined, taskId: string): ClassmatePresentationSpec["props"] => {
  if (!spec) return [];
  const ids = taskId === "home" ? spec.homePropIds ?? [] : spec.views.find(view => view.taskId === taskId)?.propIds ?? [];
  // Keep declaration order for registered overlays, and freeze nested anchors/canvases too.
  return structuredClone(spec.props.filter(prop => ids.includes(prop.id)));
};

/** Optional question-frozen drawing layout; contains no language or actor-state mutation. */
export const classmateOwnerPresentation = (spec: ClassmatePresentationSpec | undefined, taskId: string, ownerId: string) => {
  const view = spec?.views.find(view => view.taskId === taskId);
  if (!view || (!view.ownerRect && view.showFriends === undefined)) return {};
  return { ownerPresentation: { ownerId, ...(view.ownerRect ? { rect: structuredClone(view.ownerRect) } : {}), ...(view.showFriends === undefined ? {} : { showFriends: view.showFriends }) } };
};
