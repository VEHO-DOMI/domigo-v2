/**
 * @domigo/game-2d — Phaser overworld renderer (client-only). The app mounts
 * <PhaserGame> via next/dynamic({ssr:false}); per-grade content arrives as props
 * (it never imports content-loader or another game package).
 */
export { PhaserGame } from "./PhaserGame.tsx";
export type { PhaserGameProps, GameAttempt, AttemptFn, GameSaveState, WorldCopy } from "./PhaserGame.tsx";
export { OverworldScene } from "./OverworldScene.ts";
export { rasterize } from "./rasterize.ts";
// W-1 WORLD-ALIVE: the pure world brain (layout parsing, door spawns, save v2).
export { cellCenterPx, cellKey, mergeZoneState, migrateSave, parseCellKey, parseZoneLayout, spawnFor, zoneResume, zoneShort, WORLD_TILE } from "./world.ts";
export type { DoorCell, ParsedZone, WorldSaveV2, ZoneProgress } from "./world.ts";
