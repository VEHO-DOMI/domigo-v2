/**
 * @domigo/game-2d — Phaser overworld renderer (client-only). The app mounts
 * <PhaserGame> via next/dynamic({ssr:false}); per-grade content arrives as props
 * (it never imports content-loader or another game package).
 */
export { PhaserGame } from "./PhaserGame.tsx";
export type { PhaserGameProps, GameAttempt, AttemptFn, GameSaveState, WorldCopy } from "./PhaserGame.tsx";
export { OverworldScene } from "./OverworldScene.ts";
export { WorldGame } from "./WorldGame.tsx";
export type { WorldGameProps, ConnectedWorldAttempt, ConnectedWorldAttemptFn } from "./WorldGame.tsx";
export { WorldScene } from "./WorldScene.ts";
export type { WorldDebugState, WorldLocation, WorldPadState, WorldSceneConfig } from "./WorldScene.ts";
export { rasterize } from "./rasterize.ts";
