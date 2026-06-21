/**
 * @domigo/game-core — the grade-agnostic game brain. Pure TS (no React / Phaser /
 * DOM / node:fs): encounter resolution, quest clear-derivation, perf presets.
 * game-2d renders against this; per-grade content is DATA validated by the G0
 * schemas, so games never import one another.
 */
export * from "./encounter.ts";
export * from "./quest.ts";
export * from "./perf.ts";
