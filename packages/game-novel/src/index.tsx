/**
 * @domigo/game-novel — the G3 "FOURTEEN" DOM+SVG graphic-novel surface (client-only).
 * The app mounts <NovelGame> via next/dynamic({ssr:false}); per-episode content
 * arrives as props (story@1 chapter + resolved taskSlot items). No Phaser; reuses
 * @domigo/task-ui for grading and the injected onAttempt (mode:"game:g3"). The
 * comment-section consequence + production economy live here (novel-copy.ts).
 */
export { NovelGame } from "./NovelGame.tsx";
export type { NovelGameProps, NovelSave, NovelArt, GameAttempt, AttemptFn } from "./NovelGame.tsx";
export { CastAvatar, CommentSection } from "./art.tsx";
export { SeasonBoard, type EpisodeProgress } from "./season-board.tsx";
export { SUBSCRIBERS } from "./novel-copy.ts";
export type { Comment, CommentBand } from "./novel-copy.ts";
