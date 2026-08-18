/**
 * R5 · S1 · DIE TON-EINSTELLUNG DES MALBUCHS — gerätebezogen, eigener Schlüssel.
 *
 * Koki, 2026-08-17 (R124): **Ton standardmäßig AN, leise, mit sichtbarem
 * Stumm-Knopf**, und die Wahl wird pro Gerät gespeichert.
 *
 * ── Warum ein EIGENER Schlüssel und nicht `domigo:feel:v1` ──────────────────
 * `@domigo/game-feel` speichert dort seine Einstellung für die anderen Spiele —
 * und die steht auf **AUS** (Blueprint `:369`, „opt-in, default OFF"). Beides in
 * einen Schlüssel zu legen hieße: entweder erbt das Malbuch die Stille, oder die
 * anderen Spiele erben den Ton. Beides wäre eine Entscheidung, die niemand
 * getroffen hat. Also `domigo:pb:audio:v1`, und `domigo:feel:v1` bleibt
 * unberührt. (Ob die beiden später EIN Schalter werden sollen, liegt als Frage
 * bei Fable — siehe Report „Filed".)
 *
 * ── Warum gerätebezogen und nicht am Konto ─────────────────────────────────
 * Dieselbe Begründung wie bei game-feel: ein Tablet, das sich eine Klasse teilt,
 * bleibt leise, gleichgültig wer sich anmeldet. Der Ton ist eine Eigenschaft des
 * Raums, in dem gespielt wird, nicht des Kindes.
 */

export const AUDIO_SETTINGS_KEY = "domigo:pb:audio:v1";

export interface AudioSettings {
  /** der Stumm-Knopf: schaltet ALLES ab, ohne die zwei Wahlen darunter zu verlieren */
  readonly muted: boolean;
  readonly music: boolean;
  readonly sfx: boolean;
}

/** R124: an, leise. Die Lautstärke selbst steht in `BUSES` im Manifest. */
export const AUDIO_DEFAULTS: AudioSettings = { muted: false, music: true, sfx: true };

const isSettings = (v: unknown): v is AudioSettings =>
  typeof v === "object" && v !== null
  && typeof (v as AudioSettings).muted === "boolean"
  && typeof (v as AudioSettings).music === "boolean"
  && typeof (v as AudioSettings).sfx === "boolean";

/**
 * Lesen. Schlägt alles fehl — kein `localStorage` (Server-Rendering, privater
 * Modus), kaputter JSON, eine Fassung aus einer anderen Zeit — gilt die
 * Vorgabe. Eine Einstellung, die beim Lesen wirft, würde ein Spiel am Booten
 * hindern; ein Ton, der einmal zu laut anfängt, tut das nicht.
 */
export const readAudioSettings = (): AudioSettings => {
  try {
    const raw = globalThis.localStorage?.getItem(AUDIO_SETTINGS_KEY);
    if (raw === null || raw === undefined) return AUDIO_DEFAULTS;
    const parsed: unknown = JSON.parse(raw);
    return isSettings(parsed) ? parsed : AUDIO_DEFAULTS;
  } catch {
    return AUDIO_DEFAULTS;
  }
};

/** Schreiben. Stillschweigend wirkungslos, wo es kein `localStorage` gibt. */
export const writeAudioSettings = (next: AudioSettings): void => {
  try {
    globalThis.localStorage?.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(next));
  } catch {
    /* privater Modus, volle Quote — der Ton bleibt für diese Sitzung richtig */
  }
};
