/**
 * R5-W6 · S2 · DIE ZWEI SPEICHER — und die Abschrift, die nicht driften darf.
 *
 * Der Stumm-Knopf ist seit Kokis Entscheidung zu T13 (18.08.2026) ein
 * DACH-Schalter: er schreibt in `domigo:pb:audio:v1` (das Malbuch) und in
 * `domigo:feel:v1` (Ton und Vibration der anderen Spiele). Den zweiten
 * Schlüssel exportiert `@domigo/game-feel` nicht — er steht dort als privates
 * `const KEY` in `index.tsx`. Wir führen ihn also ein zweites Mal, und eine
 * zweite Abschrift ist eine Abschrift, die auseinanderlaufen kann.
 *
 * Genau das prüft dieser Test: er liest game-feels Quelltext und vergleicht.
 * Wandert der Schlüssel dort (Fassung v2), geht hier ein rotes Licht an —
 * statt dass der Knopf still an einen Speicher schreibt, den niemand mehr
 * liest. Der Fehler wäre sonst unsichtbar: die Malbuch-Seite verhielte sich
 * völlig richtig, und nur die ANDEREN Spiele hätten den Ton nicht mitbekommen.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { AUDIO_DEFAULTS, AUDIO_SETTINGS_KEY, defaultsFor, FEEL_SETTINGS_KEY, readAudioSettings, setFeelSound, writeAudioSettings } from "./settings.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FEEL_SRC = path.resolve(HERE, "../../../game-feel/src/index.tsx");

describe("die Abschrift des fremden Schlüssels", () => {
  it("game-feel benutzt wirklich den Schlüssel, in den der Dach-Schalter schreibt", () => {
    const src = fs.readFileSync(FEEL_SRC, "utf8");
    const m = /const KEY = "([^"]+)"/.exec(src);
    expect(m, `in ${FEEL_SRC} steht kein \`const KEY = "…"\` mehr — die Abschrift hier kann nicht mehr geprüft werden`).not.toBeNull();
    expect(m?.[1], "der Dach-Schalter schreibt in einen Speicher, den game-feel nicht liest").toBe(FEEL_SETTINGS_KEY);
  });

  it("die beiden Schlüssel sind verschieden — das Malbuch erbt keine fremde Stille beim Laden", () => {
    expect(AUDIO_SETTINGS_KEY).not.toBe(FEEL_SETTINGS_KEY);
  });
});

describe("der Dach-Schalter schreibt vollständig", () => {
  const store = new Map<string, string>();
  beforeEach(() => {
    store.clear();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => { store.set(k, v); },
      },
    });
  });

  it("er lässt Bewegung und Sprache des Kindes stehen (lesen, ändern, schreiben)", () => {
    store.set(FEEL_SETTINGS_KEY, JSON.stringify({ sound: false, haptics: false, motion: "reduce", lang: "de-first" }));
    setFeelSound(true);
    const after = JSON.parse(store.get(FEEL_SETTINGS_KEY) as string) as Record<string, unknown>;
    expect(after.sound, "der Ton wurde nicht geschaltet").toBe(true);
    expect(after.haptics, "die Vibration folgt dem Knopf (T13)").toBe(true);
    // Das ist die Zeile, für die dieser Test existiert: ein Teil-Schreiben hätte
    // die Bewegungs-Vorgabe eines Kindes still auf „auto" zurückgesetzt.
    expect(after.motion, "die Bewegungs-Vorgabe wurde überschrieben").toBe("reduce");
    expect(after.lang, "die Sprach-Vorgabe wurde überschrieben").toBe("de-first");
  });

  it("er kommt auch mit einem leeren oder kaputten Speicher zurecht", () => {
    setFeelSound(false);
    expect(JSON.parse(store.get(FEEL_SETTINGS_KEY) as string)).toMatchObject({ sound: false, haptics: false });
    store.set(FEEL_SETTINGS_KEY, "{kaputt");
    setFeelSound(true);
    expect(JSON.parse(store.get(FEEL_SETTINGS_KEY) as string)).toMatchObject({ sound: true });
  });

  it("die Malbuch-Vorgabe ist R221: ÜBERALL stumm, bis die Schüler kommen — ein Tipp auf den Knopf bringt den vollen R124-Klang", () => {
    // Jede Umgebung startet stumm — auch Produktion (R214 deckte nur dev;
    // Perf-Messungen fahren Produktions-Bauten und spielten weiter Musik).
    expect(defaultsFor("production")).toEqual({ muted: true, music: true, sfx: true });
    expect(defaultsFor("test")).toEqual({ muted: true, music: true, sfx: true });
    expect(defaultsFor(undefined)).toEqual({ muted: true, music: true, sfx: true });
    expect(defaultsFor("development")).toEqual({ muted: true, music: true, sfx: true });
    expect(AUDIO_DEFAULTS).toEqual(defaultsFor(process.env.NODE_ENV));
    expect(AUDIO_DEFAULTS).toEqual({ muted: true, music: true, sfx: true });
    expect(readAudioSettings()).toEqual(AUDIO_DEFAULTS);
    // Die gespeicherte Geräte-Wahl gewinnt weiter über jeden Default.
    writeAudioSettings({ muted: false, music: true, sfx: true });
    expect(readAudioSettings()).toEqual({ muted: false, music: true, sfx: true });
  });
});
