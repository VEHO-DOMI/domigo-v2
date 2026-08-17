/**
 * R5 · S1 · Der Klang des Malbuchs — die öffentliche Fläche.
 *
 * In dieser Runde ruft niemand hier hinein: S2 verdrahtet das Modul, nachdem
 * Welle 5 durch ist. Bis dahin ist dieser Ordner eine fertige, geprüfte Fabrik
 * ohne Kunden — der Beweis dafür ist, dass `pnpm check:bundle` dieselbe Zahl
 * liefert wie vor diesem PR.
 *
 * Was S2 braucht, in der Reihenfolge, in der er es braucht:
 *   1. `createSharedContext()` → `audio: { context }` in der Phaser-Config
 *   2. `createAudioDirector({ sound: this.sound })` in `PaintScene#create`
 *   3. `director.decodeAfterCreate(phaseId)` NACH `create()` — nie im `preload`
 *   4. `director.on("sim", ev.type, ev)` im vorhandenen Trichter
 *      `handleSimEvents`, plus je eine Zeile für die Entity- und Szenen-Takte
 *   5. `director.music(phaseId)` beim Phasenwechsel
 *   6. `setMuted/setMusic/setSfx` für den Stumm-Knopf
 *
 * Der Kanon dazu steht in `docs/design/g1/paint/AUDIO_SPINE_CH01.md`.
 */

export {
  BUSES, ENTITY_REACTIONS, MUSIC_BY_PHASE, PLAYER_REACTIONS, SIM_REACTIONS, STEMS, TOAST_MATCHES,
  allReactions, audioUrl, filesOf, isPlay, isReserved, isSilent, manifestFiles, stemSpec,
  type AudioFamily, type Bus, type Pedagogy, type Reaction, type StemSpec, type Tap,
} from "./audioManifest.ts";

export { AUDIO_FILES, type AudioFileInfo } from "./audioFiles.ts";

export {
  createAudioDirector, createSharedContext, mapEvent,
  type AudioDirector, type DirectorDeps, type EventUnion, type HostSound, type SoundHost,
} from "./director.ts";

export {
  AUDIO_DEFAULTS, AUDIO_SETTINGS_KEY, readAudioSettings, writeAudioSettings,
  type AudioSettings,
} from "./settings.ts";

export {
  AUDIO_BUDGETS, AUDIO_DECODED_MB, AUDIO_DECODE_PHASE_MS, AUDIO_DISK_MB,
  AUDIO_MUSIC_PHASE_MB, AUDIO_SFX_DISK_MB, decodedBytes, type AudioBudget,
} from "./audioBudget.ts";
