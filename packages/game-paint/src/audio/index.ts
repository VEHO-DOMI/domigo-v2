/**
 * R5 · S1/S2 · Der Klang des Malbuchs — die öffentliche Fläche.
 *
 * S1 hat diesen Ordner als fertige Fabrik ohne Kunden abgeliefert; S2 (R5-W6)
 * hat ihn angeklemmt. Die Liste unten ist deshalb keine Anleitung mehr, sondern
 * eine Karte: sie sagt, WO im Spiel jeder dieser Aufrufe heute steht.
 *
 * Die Wege herein, in der Reihenfolge, in der das Spiel sie braucht:
 *   1. `createSharedContext()` → `audio: { context }` in der Phaser-Config
 *      (`PaintGame.tsx`, beim Bau des Spiels)
 *   2. `createAudioDirector({ sound: game.sound })` — ebenfalls in `PaintGame`,
 *      NICHT in der Szene: die Szene stirbt bei jedem Raumwechsel, der Direktor
 *      soll seine decodierte Bank behalten (siehe `PaintSceneCfg#audio`)
 *   3. `director.decodeAfterCreate(phaseId)` am Ende von `PaintScene#create` —
 *      nie im `preload`, der hält das erste Bild an
 *   4. `director.on("sim", …)` im Trichter `handleSimEvents`, `on("entity", …)`
 *      über `SimCfg#onEntityAudio`, `land`/`footstep`/`cue` im Szenen-Takt
 *      `footwork`, `cue(…)` in den Karten-Takten der Hülle
 *   5. `director.music(phaseId)` beim Phasenwechsel — aber erst, wenn Phasers
 *      Tonmaschine ENTSPERRT ist (`game.sound.locked`): ein Klang, der vorher
 *      startet, wird nicht in eine Warteschlange gelegt, er ist verloren
 *   6. `setMuted/setMusic/setSfx` am Stumm-Knopf in der HUD-Leiste
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
  BUSES, CUE_STEMS, ENTITY_REACTIONS, MUSIC_BY_PHASE, PLAYER_REACTIONS, SIM_REACTIONS,
  STEMS, SURFACE_BY_PHASE, TOAST_MATCHES,
  allReactions, audioUrl, filesOf, isPlay, isReserved, isSilent, manifestFiles, stemSpec, surfaceOfPhase,
  type AudioFamily, type Bus, type CueStem, type Pedagogy, type Reaction, type StemSpec, type Surface, type Tap,
} from "./audioManifest.ts";

export { AUDIO_FILES, type AudioFileInfo } from "./audioFiles.ts";

export {
  createAudioDirector, createSharedContext, mapEvent,
  type AudioDirector, type AudioReport, type DirectorDeps, type EventUnion, type HostSound, type SoundHost,
} from "./director.ts";

export {
  AUDIO_DEFAULTS, AUDIO_SETTINGS_KEY, FEEL_SETTINGS_KEY,
  readAudioSettings, setFeelSound, writeAudioSettings,
  type AudioSettings,
} from "./settings.ts";

export {
  AUDIO_BUDGETS, AUDIO_DECODED_MB, AUDIO_DECODE_PHASE_MS, AUDIO_DISK_MB,
  AUDIO_MUSIC_PHASE_MB, AUDIO_SFX_DISK_MB, decodedBytes, type AudioBudget,
} from "./audioBudget.ts";
