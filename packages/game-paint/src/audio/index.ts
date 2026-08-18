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
 * Drei Dinge, die S2 wissen muss und die hier bewusst offen sind:
 *
 * · **`decodeAudio` ist asynchron.** Phaser meldet das Ende über
 *   `Phaser.Sound.Events.DECODED`; dieser Direktor merkt sich eine Datei schon,
 *   wenn er sie abgeschickt hat. Ein Klang, der in genau diesem Fenster
 *   ausgelöst wird, bleibt still (statt zu werfen) — für S1 ist das die
 *   richtige Vorsicht, für S2 die Stelle, an der ein `once(DECODED)` das letzte
 *   Prozent holt.
 * · **Die Landung braucht ihre Schwelle vom Aufrufer.** `land(hard)` erwartet
 *   dieselbe Entscheidung, die `PaintScene#footwork` für den Kreidestaub schon
 *   trifft (`fallVy ≥ LAND_DUST_VY·2`) — damit Bild und Ton denselben Augenblick
 *   meinen. Der Direktor importiert diese Konstante NICHT: ein Wertimport aus
 *   `paint.ts` wäre die Laufzeit-Kante, die dieser PR nicht haben darf.
 * · **`footstep(surface)` bekommt den Untergrund aus der PHASE, nicht aus dem
 *   Glyph.** In ch01 gibt es genau zwei begehbare Glyphen (`#` und die Rutsche
 *   `z`) — die Räume unterscheiden sich im Material, die Kacheln nicht:
 *   p1 · p2 · p9 = `paper`, p3 = `garden`, p4 = `board`.
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
