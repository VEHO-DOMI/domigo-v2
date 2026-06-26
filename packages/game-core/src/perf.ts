/**
 * Cheap-Android perf presets. Cosmetic + safe to persist in game_saves.state
 * (Law 9 perf budget). The renderer (game-2d) reads these; the floor is "low".
 */
export type PerfPreset = "low" | "high";

export interface PerfConfig {
  fpsTarget: number;
  pixelArt: boolean;
  antialias: boolean;
  maxParticles: number;
  dprCap: number;
}

export const PERF_PRESETS: Record<PerfPreset, PerfConfig> = {
  low: { fpsTarget: 30, pixelArt: true, antialias: false, maxParticles: 0, dprCap: 1 },
  high: { fpsTarget: 60, pixelArt: true, antialias: false, maxParticles: 24, dprCap: 2 },
};

/** Default to the cheap-phone floor; the device/user can opt up to "high". */
export const DEFAULT_PERF_PRESET: PerfPreset = "low";
