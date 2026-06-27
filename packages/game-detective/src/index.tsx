/**
 * @domigo/game-detective — the G2 DOM+SVG detective surface (client-only). The
 * app mounts <DetectiveGame> via next/dynamic({ssr:false}); per-chapter content
 * arrives as props (story@1 chapter + resolved taskSlot items). No Phaser; reuses
 * @domigo/task-ui for grading and the injected onAttempt (mode:"game:g2").
 */
export { DetectiveGame } from "./DetectiveGame.tsx";
export type { DetectiveGameProps, DetectiveSave, DetectiveArt, GameAttempt, AttemptFn } from "./DetectiveGame.tsx";
