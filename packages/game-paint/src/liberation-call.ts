// CODEX DRAFT — NOT CANON · one local invitation for the B1 chapter.
import type { EntityState } from "./entities.ts";
import { SUBS } from "./paint.ts";
export function liberationCallTarget(entities: readonly EntityState[], x: number, y: number): string | null {
  let best: EntityState | undefined;
  let distance = Infinity;
  for (const e of entities) {
    if (!e.params.fullDrain || e.redeemed || e.hidden) continue;
    const dx = Math.abs(e.x - x) / SUBS, dy = Math.abs(e.y - y) / SUBS;
    if (dx > 150 || dy > 110) continue;
    const d = Math.hypot(dx, dy);
    if (d < distance) { best = e; distance = d; }
  }
  return best?.id ?? null;
}
export function liberationCallMotion(tick: number, strong: boolean, reduced: boolean) {
  const strength = strong ? 1.8 : 1;
  return {
    dx: reduced ? 0 : Math.sin(tick / 8) * 1.6 * strength,
    dy: reduced ? 0 : -(1 + Math.sin(tick / 13)) * 2.4 * strength,
    rot: reduced ? 0 : Math.sin(tick / 8) * .035 * strength,
    arrowSize: strong ? 17 : 11,
    auraAlpha: strong ? .10 : .065,
  };
}
