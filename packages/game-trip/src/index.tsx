/**
 * @domigo/game-trip — the G4 "Lost for Words" DOM+SVG story surface (client-only).
 * The app mounts <TripGame> via next/dynamic({ssr:false}); per-chapter content
 * arrives as props (story@1 chapter + resolved taskSlot items). No Phaser; reuses
 * @domigo/task-ui for grading and the injected onAttempt (mode:"game:g4"). The
 * flag runtime (Choice.sets / FlagGate / flagLines) + the journal economy live
 * here (trip-copy.ts).
 */
export { TripGame } from "./TripGame.tsx";
export type { TripGameProps, TripSave, TripArt, GameAttempt, AttemptFn } from "./TripGame.tsx";
export { CastAvatar, castLook } from "./art.tsx";
export { JournalBoard, type DayProgress } from "./journal-board.tsx";
export { DAY_STAMP } from "./trip-copy.ts";
