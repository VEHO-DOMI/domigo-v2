/**
 * @domigo/game-trip — the grade-4 DOM+SVG story surface (client-only), shared by
 * every trip story (B-3: "FOURTEEN: LIVE" canonical, "Lost for Words" parked).
 * The app mounts <TripGame> via next/dynamic({ssr:false}); per-chapter content
 * arrives as props (story@1 chapter + resolved taskSlot items). No Phaser; reuses
 * @domigo/task-ui for grading and the injected onAttempt (mode:"game:g4"). The
 * flag runtime (Choice.sets / FlagGate / flagLines) is here; the per-story skin
 * (title / economy nouns / stamps) is `tripCopyFor(storyId)` in trip-copy.ts.
 */
export { TripGame } from "./TripGame.tsx";
export type { TripGameProps, TripSave, TripArt, GameAttempt, AttemptFn } from "./TripGame.tsx";
export { CastAvatar, castLook } from "./art.tsx";
export { JournalBoard, type DayProgress } from "./journal-board.tsx";
export { tripCopyFor, type TripCopy } from "./trip-copy.ts";
