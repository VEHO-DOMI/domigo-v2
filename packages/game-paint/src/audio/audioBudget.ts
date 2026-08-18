/**
 * R5 · S1 · DIE KLANG-BUDGETS — eine Stelle, damit keine Zahl driften kann.
 *
 * Gebaut nach dem Muster von `perfBudget.ts` (E5): jede Decke nennt ihre
 * Einheit, ihre deutsche Zeile für den Wächter-Aushang, wer sie durchsetzt, und
 * WARUM sie diese Zahl ist und keine andere. Eine Decke ohne Beleg ist eine
 * Meinung, und Meinungen driften.
 *
 * Getrennt von `perfBudget.ts` gehalten, obwohl beide Budgets sind: die Zahlen
 * dort gehören der Perf-Bahn (E6), und zwei Sessions, die dieselbe Datei
 * anfassen, kosten mehr Konflikt-Runden als eine zweite Datei kostet. Die zwei
 * Zeilen im Aushang `docs/PERF_WAECHTER.md` verbinden sie.
 */

export interface AudioBudget {
  readonly key: string;
  readonly limit: number;
  readonly unit: "MB" | "ms";
  /** die Zeile, wie sie im Wächter-Dokument steht */
  readonly de: string;
  readonly enforcedIn: string;
  readonly because: string;
}

export const AUDIO_BUDGETS: readonly AudioBudget[] = [
  {
    key: "AUDIO_DISK_MB",
    limit: 6,
    unit: "MB",
    de: "Audio (Platte) ≤ 6 MB",
    enforcedIn: "scripts/check-audio.mjs",
    because:
      "Alles, was das Kapitel an Klang mitbringt, in MP3 mono 96 kbps: fünf Musik-Schleifen à ~45 s (~530 KB je Stück) plus ~70 Effekt-Dateien von je 4–25 KB. Gemessen liegt das bei gut 3 MB; 6 MB lassen Platz für eine Neu-Lieferung und bleiben weit unter dem, was ein Kind auf einer Schulleitung vor dem ersten Bild wartet — die Musik einer Phase wird ohnehin erst NACH create() geholt.",
  },
  {
    key: "AUDIO_SFX_DISK_MB",
    limit: 1.5,
    unit: "MB",
    de: "Audio · Effekte (Platte) ≤ 1,5 MB",
    enforcedIn: "scripts/check-audio.mjs",
    because:
      "Die Effekt-Bank wird als GANZES decodiert und bleibt es. 1,5 MB sind bei 96 kbps rund 125 Sekunden Klang — die 69 Varianten dieses Kapitels brauchen davon etwa ein Fünftel. Die Decke fängt den Fall ab, in dem jemand eine Ambient-Schleife in die Bank legt, die dort nicht hingehört.",
  },
  {
    key: "AUDIO_MUSIC_PHASE_MB",
    limit: 1,
    unit: "MB",
    de: "Audio · Musik je Phase (Platte) ≤ 1 MB",
    enforcedIn: "scripts/check-audio.mjs",
    because:
      "Eine Phase hält genau ein Musikstück. Bei 96 kbps mono sind 1 MB rund 85 Sekunden — fast das Doppelte der geplanten 45-Sekunden-Schleife. Wer die Decke reißt, hat eine Schleife gebaut, die zu lang ist, um im Kopf zu bleiben.",
  },
  {
    key: "AUDIO_DECODED_MB",
    limit: 16,
    unit: "MB",
    de: "Audio (decodiert) ≤ 16 MB",
    enforcedIn: "scripts/check-audio.mjs",
    because:
      "Decodiertes Audio liegt im JS-Heap, NICHT im 35-MB-Texturbudget — deshalb eine eigene Decke mit eigenem Namen. Gerechnet wird deterministisch aus den Dauern: Sekunden × Kanäle × 48 000 × 4 Byte (float32; ein AudioContext läuft auf den meisten Geräten mit 48 kHz, auch wenn die Datei 44,1 kHz trägt). Gleichzeitig im Speicher: die ganze Effekt-Bank (~27 s ≙ 5,2 MB) plus die Musik EINER Phase (~45 s ≙ 8,6 MB) = rund 14 MB. 16 MB sind die Decke mit zwei MB Luft; wer eine zweite Phase gleichzeitig decodiert hält, reißt sie — und genau das soll auffallen.",
  },
  {
    key: "AUDIO_DECODE_PHASE_MS",
    limit: 300,
    unit: "ms",
    de: "Audio · Musik-Decode je Phase ≤ 300 ms",
    enforcedIn: "docs/PERF_WAECHTER.md",
    because:
      "`decodeAudioData` läuft neben dem Hauptstrang, aber ein Phasenwechsel, der eine halbe Sekunde auf seinen Klang wartet, beginnt stumm. 300 ms sind die Grenze, ab der die Stille als Fehler gelesen wird statt als Atemzug. NICHT maschinell erzwungen: es ist eine Laufzeit-Messung und braucht einen Browser — dieselbe ehrliche Einschränkung wie bei `FIRST_FRAME_GPU_MS` in `perfBudget.ts`. Ein Test, der nicht rot werden kann, ist schlimmer als kein Test, weil er wie Abdeckung aussieht.",
  },
] as const;

const lookup = (key: string): number => {
  const b = AUDIO_BUDGETS.find((x) => x.key === key);
  if (b === undefined) throw new Error(`audioBudget: no budget named ${key}`);
  return b.limit;
};

/** Alles, was das Kapitel an Klang auf der Platte mitbringt. */
export const AUDIO_DISK_MB = lookup("AUDIO_DISK_MB");
/** Nur die Effekt-Bank. */
export const AUDIO_SFX_DISK_MB = lookup("AUDIO_SFX_DISK_MB");
/** Das eine Musikstück einer Phase. */
export const AUDIO_MUSIC_PHASE_MB = lookup("AUDIO_MUSIC_PHASE_MB");
/** Spitze im JS-Heap — getrennt vom Texturbudget. */
export const AUDIO_DECODED_MB = lookup("AUDIO_DECODED_MB");
/** Wie lange ein Phasenwechsel auf seine Musik warten darf. */
export const AUDIO_DECODE_PHASE_MS = lookup("AUDIO_DECODE_PHASE_MS");

/**
 * Wie viel Speicher eine Datei decodiert belegt — deterministisch, ohne sie zu
 * öffnen. Der Wert ist eine Obergrenze: ein Kontext mit 44,1 kHz braucht
 * weniger, aber eine Decke, die auf die günstigere Annahme baut, ist keine.
 */
export const decodedBytes = (durationSec: number, channels = 1): number =>
  Math.ceil(durationSec * channels * 48_000 * 4);
