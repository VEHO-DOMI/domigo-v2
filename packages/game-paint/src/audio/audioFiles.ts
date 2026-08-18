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
  "arena-brief": { v: "b2638c30", bytes: 13524, durationSec: 1.055, kind: "sfx" },
  "being-answered-1": { v: "e5866fb2", bytes: 10389, durationSec: 0.8, kind: "sfx" },
  "being-answered-2": { v: "4dbc7790", bytes: 10076, durationSec: 0.778, kind: "sfx" },
  "board-bloom": { v: "01eef872", bytes: 18853, durationSec: 1.5, kind: "sfx" },
  "boss-window": { v: "fdea0f52", bytes: 6941, durationSec: 0.5, kind: "sfx" },
  "bump-1": { v: "4448cba5", bytes: 3806, durationSec: 0.245, kind: "sfx" },
  "bump-2": { v: "2768541b", bytes: 5060, durationSec: 0.35, kind: "sfx" },
  "cage-free-1": { v: "ad9c766e", bytes: 5060, durationSec: 0.341, kind: "sfx" },
  "cage-free-2": { v: "4d080625", bytes: 18853, durationSec: 1.5, kind: "sfx" },
  "cage-locked": { v: "2fc50b8a", bytes: 5060, durationSec: 0.35, kind: "sfx" },
  "cage-open-1": { v: "42e806f1", bytes: 6314, durationSec: 0.453, kind: "sfx" },
  "cage-open-2": { v: "7612f448", bytes: 7881, durationSec: 0.588, kind: "sfx" },
  "card-close-1": { v: "7be1f17f", bytes: 4433, durationSec: 0.297, kind: "sfx" },
  "card-close-2": { v: "1811b3e4", bytes: 4433, durationSec: 0.3, kind: "sfx" },
  "card-close-3": { v: "0dc27918", bytes: 4433, durationSec: 0.3, kind: "sfx" },
  "card-open-1": { v: "e7785b48", bytes: 4433, durationSec: 0.3, kind: "sfx" },
  "card-open-2": { v: "b74e993a", bytes: 4433, durationSec: 0.296, kind: "sfx" },
  "card-open-3": { v: "29004a37", bytes: 3179, durationSec: 0.184, kind: "sfx" },
  "door-open-1": { v: "bc37a5e7", bytes: 7881, durationSec: 0.6, kind: "sfx" },
  "door-open-2": { v: "c09004a6", bytes: 7881, durationSec: 0.6, kind: "sfx" },
  "gate-waits": { v: "ce58afd2", bytes: 2552, durationSec: 0.15, kind: "sfx" },
  "ink-splash-1": { v: "12ee0785", bytes: 5687, durationSec: 0.393, kind: "sfx" },
  "ink-splash-2": { v: "4cddc436", bytes: 5687, durationSec: 0.399, kind: "sfx" },
  "jump-1": { v: "9078addc", bytes: 4433, durationSec: 0.3, kind: "sfx" },
  "jump-2": { v: "81d89d2c", bytes: 4433, durationSec: 0.3, kind: "sfx" },
  "jump-3": { v: "273018fc", bytes: 4433, durationSec: 0.3, kind: "sfx" },
  "land-hard-1": { v: "cede6735", bytes: 6314, durationSec: 0.45, kind: "sfx" },
  "land-hard-2": { v: "b7596891", bytes: 6314, durationSec: 0.45, kind: "sfx" },
  "land-soft-1": { v: "5fe84f13", bytes: 4433, durationSec: 0.3, kind: "sfx" },
  "land-soft-2": { v: "ce9793fd", bytes: 4433, durationSec: 0.3, kind: "sfx" },
  "letter-take-1": { v: "adfa20be", bytes: 4120, durationSec: 0.28, kind: "sfx" },
  "letter-take-2": { v: "903ef7a5", bytes: 4433, durationSec: 0.3, kind: "sfx" },
  "letter-take-3": { v: "a831e96a", bytes: 3493, durationSec: 0.23, kind: "sfx" },
  "letters-all": { v: "c179e84f", bytes: 17912, durationSec: 1.424, kind: "sfx" },
  "merle-round-1": { v: "7622d883", bytes: 4433, durationSec: 0.298, kind: "sfx" },
  "merle-round-2": { v: "5ba40084", bytes: 7254, durationSec: 0.544, kind: "sfx" },
  "merle-round-3": { v: "fa878520", bytes: 7881, durationSec: 0.6, kind: "sfx" },
  "music-p1": { v: "551ce294", bytes: 313827, durationSec: 26.093, kind: "music" },
  "music-p2": { v: "a70d3a63", bytes: 450814, durationSec: 37.495, kind: "music" },
  "music-p3": { v: "0674598f", bytes: 412257, durationSec: 34.287, kind: "music" },
  "music-p4": { v: "aa405fb5", bytes: 384985, durationSec: 32.006, kind: "music" },
  "music-p9": { v: "292f6610", bytes: 346428, durationSec: 28.797, kind: "music" },
  "music-title": { v: "60b38564", bytes: 84368, durationSec: 6.955, kind: "music" },
  "music-win": { v: "009947e4", bytes: 31705, durationSec: 2.577, kind: "music" },
  "page-take-1": { v: "0969fc9a", bytes: 5374, durationSec: 0.367, kind: "sfx" },
  "page-take-2": { v: "9d5a7864", bytes: 5060, durationSec: 0.341, kind: "sfx" },
  "page-turn-1": { v: "5d801930", bytes: 5687, durationSec: 0.4, kind: "sfx" },
  "page-turn-2": { v: "75768a32", bytes: 5687, durationSec: 0.4, kind: "sfx" },
  "puff-chalk-1": { v: "a0ce8e10", bytes: 3806, durationSec: 0.25, kind: "sfx" },
  "puff-chalk-2": { v: "d3cb1929", bytes: 3806, durationSec: 0.25, kind: "sfx" },
  "shoo-1": { v: "4d8a88e0", bytes: 5060, durationSec: 0.35, kind: "sfx" },
  "shoo-2": { v: "007d6eb3", bytes: 5060, durationSec: 0.35, kind: "sfx" },
  "slide-1": { v: "6c599119", bytes: 6941, durationSec: 0.5, kind: "sfx" },
  "slide-2": { v: "364defcf", bytes: 6941, durationSec: 0.5, kind: "sfx" },
  "solve-ok-1": { v: "dcbaa64e", bytes: 4120, durationSec: 0.264, kind: "sfx" },
  "solve-ok-2": { v: "6a81155e", bytes: 3493, durationSec: 0.227, kind: "sfx" },
  "solve-ok-3": { v: "d7a467ab", bytes: 6314, durationSec: 0.451, kind: "sfx" },
  "solve-thud-1": { v: "46548f09", bytes: 4120, durationSec: 0.285, kind: "sfx" },
  "solve-thud-2": { v: "21167492", bytes: 4433, durationSec: 0.3, kind: "sfx" },
  "step-board-1": { v: "9eeaf307", bytes: 3806, durationSec: 0.25, kind: "sfx" },
  "step-board-2": { v: "c89b8851", bytes: 3806, durationSec: 0.25, kind: "sfx" },
  "step-board-3": { v: "8898bef6", bytes: 2552, durationSec: 0.144, kind: "sfx" },
  "step-board-4": { v: "cfb4c496", bytes: 1298, durationSec: 0.049, kind: "sfx" },
  "step-garden-1": { v: "f459c9f4", bytes: 3806, durationSec: 0.25, kind: "sfx" },
  "step-garden-2": { v: "c29e41e4", bytes: 3806, durationSec: 0.25, kind: "sfx" },
  "step-garden-3": { v: "3476802c", bytes: 3806, durationSec: 0.25, kind: "sfx" },
  "step-garden-4": { v: "af814bb6", bytes: 3806, durationSec: 0.25, kind: "sfx" },
  "step-paper-1": { v: "59f19b9f", bytes: 3806, durationSec: 0.25, kind: "sfx" },
  "step-paper-2": { v: "2b0b9e2d", bytes: 3806, durationSec: 0.25, kind: "sfx" },
  "step-paper-3": { v: "0579b2bb", bytes: 3806, durationSec: 0.25, kind: "sfx" },
  "step-paper-4": { v: "d859e21f", bytes: 3806, durationSec: 0.25, kind: "sfx" },
  "toast-1": { v: "373d8e7e", bytes: 3179, durationSec: 0.2, kind: "sfx" },
  "toast-2": { v: "a93c7f19", bytes: 3179, durationSec: 0.2, kind: "sfx" },
  "wipe-1": { v: "50658d64", bytes: 6941, durationSec: 0.5, kind: "sfx" },
  "wipe-2": { v: "5ae69893", bytes: 6941, durationSec: 0.5, kind: "sfx" },
  "wipe-3": { v: "27e636f9", bytes: 6941, durationSec: 0.5, kind: "sfx" },
};
