/**
 * @domigo/game-2d — Phaser overworld renderer (client-only). The app mounts
 * <PhaserGame> via next/dynamic({ssr:false}); per-grade content arrives as props
 * (it never imports content-loader or another game package).
 */
export { PhaserGame } from "./PhaserGame.tsx";
export type { PhaserGameProps, GameAttempt, AttemptFn, GameSaveState } from "./PhaserGame.tsx";
export { OverworldScene } from "./OverworldScene.ts";
export { rasterize } from "./rasterize.ts";
