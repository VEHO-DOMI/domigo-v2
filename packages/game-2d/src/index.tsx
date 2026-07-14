/**
 * @domigo/game-2d — Phaser overworld renderer (client-only). The app mounts
 * <PhaserGame> via next/dynamic({ssr:false}); per-grade content arrives as props
 * (it never imports content-loader or another game package).
 */
export { PhaserGame } from "./PhaserGame.tsx";
export type { PhaserGameProps, GameAttempt, AttemptFn, GameSaveState, WorldCopy } from "./PhaserGame.tsx";
export { OverworldScene } from "./OverworldScene.ts";
export { rasterize } from "./rasterize.ts";
// KA-1: the arcade mock (Tintenlauf) — mounted via next/dynamic ssr:false only.
export { ArcadeGame } from "./ArcadeGame.tsx";
export type { ArcadeGameProps } from "./ArcadeGame.tsx";
