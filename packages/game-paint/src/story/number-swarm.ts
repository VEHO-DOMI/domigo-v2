/** Chapter-one typography, shared by the world and a card's illustration.
 * No answer enters this model: all six numbers have equal visual weight.
 * Positions are offsets from the encounter's feet, in logical world pixels.
 */
export const NUMBER_SWARM_BOUNDS = { x: -20, y: -35, width: 40, height: 36 } as const;

export function isNumberSwarm(chapter: string, entity: { role: string; skin: string }): boolean {
  return chapter === "ch01" && entity.role === "swarm" && entity.skin === "moths";
}

export interface NumberSwarmFrame {
  runSeed?: string;
  entityId: string;
  /** Simulation ticks only: a paused simulation keeps the same glyph positions. */
  tick: number;
  reducedMotion: boolean;
}

export interface NumberSwarmGlyph {
  value: number;
  text: string;
  x: number;
  y: number;
  rotation: number;
  height: number;
}

function hash(text: string): number {
  let value = 2166136261;
  for (let i = 0; i < text.length; i++) value = Math.imul(value ^ text.charCodeAt(i), 16777619);
  return value >>> 0;
}

/** Stateless and independent of frame/call order, retries and other encounters.
 * A different level start changes the paper numbers, not a render-time random
 * generator. Reduced motion removes the internal drift while the caller still
 * anchors the whole group to the moving encounter.
 */
export function numberSwarmLayout(frame: NumberSwarmFrame): NumberSwarmGlyph[] {
  const seed = JSON.stringify(["number-swarm", frame.runSeed ?? "default", frame.entityId]);
  const unit = (key: string): number => hash(`${seed}:${key}`) / 4294967296;
  const values = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(unit(`shuffle:${i}`) * (i + 1));
    [values[i], values[j]] = [values[j]!, values[i]!];
  }
  return values.slice(0, 6).map((value, i) => {
    const phase = unit(`phase:${i}`) * Math.PI * 2;
    const time = frame.reducedMotion ? 0 : frame.tick / (31 + i * 3);
    const dx = frame.reducedMotion ? 0 : Math.sin(time + phase) * 0.7;
    const dy = frame.reducedMotion ? 0 : Math.cos(time * 0.83 + phase) * 0.7;
    return {
      value, text: String(value), height: 12,
      x: (i % 2 ? 8.5 : -8.5) + (unit(`x:${i}`) - 0.5) * 1.1 + dx,
      y: -27 + Math.floor(i / 2) * 10 + (unit(`y:${i}`) - 0.5) * 1.1 + dy,
      rotation: (unit(`tilt:${i}`) - 0.5) * 0.09 + (frame.reducedMotion ? 0 : Math.sin(time * 0.7 + phase) * 0.035),
    };
  });
}
