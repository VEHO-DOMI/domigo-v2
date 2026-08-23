/**
 * R5 · S1 · DIE TON-EINSTELLUNG DES MALBUCHS — gerätebezogen, eigener Schlüssel.
 *
 * Koki, 2026-08-17 (R124): **Ton standardmäßig AN, leise, mit sichtbarem
 * Stumm-Knopf**, und die Wahl wird pro Gerät gespeichert.
 *
 * ── R5-W6 · S2 · KOKIS ENTSCHEIDUNG ZU T13: EIN DACH-SCHALTER ───────────────
 * Der Absatz unten steht so, wie S1 ihn geschrieben hat, und er hat recht: zwei
 * Vorgaben in einen Schlüssel zu legen wäre eine Entscheidung, die niemand
 * getroffen hatte. Inzwischen ist sie getroffen — Koki, 18.08.2026, Tor T13:
 * **ein Knopf, zwei Speicher.** Ein Kind sieht einen Lautsprecher, tippt ihn an,
 * und es ist überall still.
 *
 * Die Speicher bleiben getrennt (das Malbuch erbt keine fremde Stille beim
 * Laden), aber der KNOPF schreibt in beide: `setFeelSound()` unten. Der Preis
 * war benannt und angenommen — wer im Malbuch den Ton anlässt, schaltet Ton und
 * Vibration auch in den anderen Spielen ein, die bisher auf AUS standen.
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

import { parseSettings } from "@domigo/game-feel/core";

export const AUDIO_SETTINGS_KEY = "domigo:pb:audio:v1";

export interface AudioSettings {
  /** der Stumm-Knopf: schaltet ALLES ab, ohne die zwei Wahlen darunter zu verlieren */
  readonly muted: boolean;
  readonly music: boolean;
  readonly sfx: boolean;
}

/** R124: an, leise. Die Lautstärke selbst steht in `BUSES` im Manifest.
 *  R214 (Koki, 2026-08-24): im DEV-Lauf startet das Malbuch STUMM — jede
 *  Arbeits-Session auf localhost spielte sonst Musik ohne Aus-Weg. Nur der
 *  Default kippt: eine gespeicherte Geräte-Wahl gewinnt weiter, der sichtbare
 *  Lautsprecher-Knopf schaltet jederzeit an, und Produktion (die Kinder)
 *  behält R124 unverändert. */
export const defaultsFor = (env: string | undefined): AudioSettings =>
  env === "development"
    ? { muted: true, music: true, sfx: true }
    : { muted: false, music: true, sfx: true };
export const AUDIO_DEFAULTS: AudioSettings = defaultsFor(process.env.NODE_ENV);

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

/**
 * R5-W6 · S2 · Die andere Hälfte des Dach-Schalters (T13).
 *
 * `@domigo/game-feel` hält seine Vorgabe unter einem eigenen Schlüssel. Wir
 * schreiben sie hier direkt, statt `setFeel()` aus dem Paket-Wurzelmodul zu
 * rufen: dessen `index.tsx` bringt die ganze React-Fläche mit (Konfetti,
 * Schreibmaschine, das Zahnrad), und das Malbuch importiert heute nur den
 * winzigen `typing-guard`. Ein Knopf ist keine 30 KB im Bündel wert — zumal
 * game-feel auf DIESER Seite gar nicht läuft, es also keine Zuhörer gibt, die
 * `setFeel()` benachrichtigen könnte. Was zählt, ist der geschriebene Wert, den
 * die anderen Seiten beim Laden lesen.
 *
 * `parseSettings` kommt aus dem React-freien `core` — damit ist es ein LESEN,
 * ÄNDERN, SCHREIBEN der ganzen Vorgabe: `motion` und `lang` des Kindes bleiben
 * stehen. Ein Teil-Schreiben hätte sie stillschweigend auf die Vorgabe
 * zurückgesetzt.
 *
 * Der Schlüssel steht hier ein zweites Mal — `game-feel` exportiert ihn nicht.
 * Damit die zwei Abschriften nicht auseinanderlaufen, prüft
 * `settings.test.ts` ihn gegen den Quelltext von game-feel: wandert er dort,
 * geht der Test rot, statt dass der Knopf still ins Leere schreibt.
 */
export const FEEL_SETTINGS_KEY = "domigo:feel:v1";

export const setFeelSound = (on: boolean): void => {
  try {
    const store = globalThis.localStorage;
    if (store === undefined || store === null) return;
    const current = parseSettings(store.getItem(FEEL_SETTINGS_KEY));
    store.setItem(FEEL_SETTINGS_KEY, JSON.stringify({ ...current, sound: on, haptics: on }));
  } catch {
    /* wie oben: der Ton bleibt für diese Sitzung richtig */
  }
};
