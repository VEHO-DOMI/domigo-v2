/**
 * ERZEUGT von `docs/audio/master.mjs` — nicht von Hand ändern.
 *
 * Je Klang-Datei ihr Inhalts-Fingerabdruck (`v`, die ersten acht Stellen des
 * sha1), ihre Grösse und ihre Dauer. `audioManifest.ts#audioUrl()` hängt `v`
 * an die Adresse, damit die `immutable`-Kopfzeile aus `next.config.ts` halten
 * kann: eine neu gemasterte Datei kommt unter einer neuen Adresse an, eine
 * unveränderte behält ihre zwischengespeicherte Kopie.
 *
 * `scripts/check-audio.mjs` prüft, dass diese Zahlen mit
 * `docs/audio/audio.measured.json` und mit dem, was wirklich auf der Platte
 * liegt, übereinstimmen.
 */

export interface AudioFileInfo {
  readonly v: string;
  readonly bytes: number;
  readonly durationSec: number;
  readonly kind: "music" | "sfx";
}

export const AUDIO_FILES: Readonly<Record<string, AudioFileInfo>> = {
  "music-p1": { v: "8dead099", bytes: 462725, durationSec: 38.479, kind: "music" },
  "step-paper": { v: "1c01f919", bytes: 3806, durationSec: 0.25, kind: "sfx" },
};
