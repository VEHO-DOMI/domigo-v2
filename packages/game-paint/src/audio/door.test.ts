/**
 * R5 · T8 · DIE TÜR — stumm heisst stumm, und zwar KLASSENWEISE.
 *
 * WARUM ES DIESE DATEI GIBT. Koki hörte Musik auf Seiten, die eine Sitzung
 * geöffnet hatte — auf einem Bau NACH R214 und R221, also nach zwei Rulings,
 * die den Ton abgeschaltet hatten. Die Messung (T8, Posten 1) fand drei
 * Schlösser, die alle drei offen standen:
 *
 *   1. `music()` prüfte die Einstellungen ÜBERHAUPT NICHT — es decodierte und
 *      startete jedes Stück; »stumm« hiess nur »Lautstärke 0« in der
 *      Konfiguration.
 *   2. Diese Lautstärke wird beim Abspielen über einen MARKER verworfen.
 *      Phaser (`BaseSound#play`) ersetzt die Konfiguration des Klangs durch die
 *      des Markers, und deren Vorgabe ist `volume: 1`. Am laufenden Spiel
 *      gemessen: `addVolume: 0` neben `markerVolume: 1`, Spitzenpegel 0,17.
 *   3. Phasers Haupt-Stummschaltung (`sound.mute`) wurde beim Bau des Direktors
 *      nie gesetzt — der eine Riegel, der die anderen zwei aufgefangen hätte.
 *
 * DIE LEHRE, DIE DIESE DATEI FESTHÄLT: **eine Attrappe, die freundlicher ist
 * als die echte Tonmaschine, beweist nichts.** Die alten Tests reichten einen
 * Host herein, der die Lautstärke aus `add()` behielt — deshalb war
 * „stumm heisst stumm" jahrelang grün, während es im Browser laut war. Der Host
 * hier bildet Phasers Marker-Semantik NACH, und ein zweiter Test hält diese
 * Nachbildung am Quelltext von Phaser fest: wandert sie dort, geht hier ein
 * rotes Licht an, statt dass die Attrappe still zur Fiktion wird.
 *
 * Und: die Eintrittswege werden nicht von Hand aufgezählt, sondern aus dem
 * Direktor selbst gelesen (`Object.keys`). Ein neuer Weg, den jemand später
 * hinzufügt, ist damit automatisch abgedeckt — oder er macht diesen Test rot,
 * weil ihn niemand eingeordnet hat. Das ist der Unterschied zwischen einer
 * Liste in einem Test und einem Gesetz.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createAudioDirector, type AudioDirector, type HostSound, type SoundHost } from "./director.ts";
import { BUSES } from "./audioManifest.ts";
import type { AudioSettings } from "./settings.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIRECTOR_SRC = path.resolve(HERE, "./director.ts");

// ── Eine Attrappe, die sich wie Phaser benimmt ───────────────────────────────

interface Gespielt { key: string; volume: number; ueberMarker: boolean; gestoppt: boolean }

/**
 * Phasers Regel, nachgebaut: `add(key, { volume })` legt die Konfiguration des
 * KLANGS an; `play(markerName)` wirft sie weg und nimmt die des Markers, deren
 * fehlende Felder mit `{ volume: 1, … }` aufgefüllt sind. `setVolume()` schreibt
 * dagegen direkt auf den Verstärker und schlägt beides.
 */
const phaserAehnlicherHost = ({ sofort = true }: { sofort?: boolean } = {}) => {
  const gespielt: Gespielt[] = [];
  const decoded: Array<(k: string) => void> = [];
  const offen: string[] = [];
  const host: SoundHost = {
    add(key: string, config?: { volume?: number }): HostSound {
      const eigen = config?.volume ?? 1;
      const marker = new Map<string, number>();
      let rec: Gespielt | null = null;
      const s: HostSound = {
        addMarker(m) { marker.set(m.name, m.config?.volume ?? 1); return true; },
        play(markerName) {
          const v = markerName === undefined ? eigen : (marker.get(markerName) ?? 1);
          rec = { key, volume: v, ueberMarker: markerName !== undefined, gestoppt: false };
          gespielt.push(rec);
          return true;
        },
        stop() { if (rec !== null) rec.gestoppt = true; return true; },
        destroy() {},
        setVolume(v: number) { if (rec !== null) rec.volume = v; },
      };
      return s;
    },
    decodeAudio(key: string) {
      offen.push(key);
      // Vorgabe: das Decodieren kommt zurück wie im Browser — sofort im
      // nächsten Takt. (Ohne das läuft JEDE Datei in die 5-Sekunden-Frist des
      // Direktors, und der Wächter braucht 65 s statt 65 ms. Gemessen.)
      // Die Renn-Tests unten schalten es ab und melden von Hand.
      if (sofort) setTimeout(() => { fertig(); }, 0);
    },
    onDecoded(cb) { decoded.push(cb); },
    removeByKey: () => true,
    mute: false,
    volume: 1,
  };
  function fertig(): void { for (const k of offen.splice(0)) for (const cb of decoded) cb(k); }
  return { host, gespielt, fertigDecodieren: fertig };
};

const baue = (host: SoundHost, settings: AudioSettings): AudioDirector =>
  createAudioDirector({ sound: host, hasFile: () => true, fetchAudio: async () => new ArrayBuffer(8), settings });

const STUMM: AudioSettings = { muted: true, music: true, sfx: true };
const LAUT: AudioSettings = { muted: false, music: true, sfx: true };
const tick = () => new Promise((r) => { setTimeout(r, 0); });

// ── Die Eintrittswege, aus dem Direktor GELESEN, nicht abgeschrieben ──────────

/** jeder Weg, über den ein Klang entstehen kann — Aufruf mit gültigen Werten */
const SPIELWEGE: Record<string, (d: AudioDirector) => unknown> = {
  decodeAfterCreate: (d) => d.decodeAfterCreate("p1"),
  music: (d) => d.music("p1"),
  on: (d) => d.on("sim", "cageFreed", {}),
  footstep: (d) => d.footstep("paper", 1),
  cue: (d) => d.cue("solve-ok", 2),
  card: (d) => d.card("wrong"),
  land: (d) => d.land(true),
};

/** alles, was per Bauart NICHTS abspielt — Schalter, Auskunft, Abbau */
const KEIN_SPIELWEG = ["enabled", "settings", "setMuted", "setMusic", "setSfx", "report", "dispose"];

/** Der Kern des Wächters, als Funktion — damit der Tamper ihn gegen eine
 *  ABSICHTLICH kaputte Attrappe laufen lassen kann. */
export const tuerBefunde = async (
  mach: (settings: AudioSettings) => { d: AudioDirector; gespielt: Gespielt[]; fertigDecodieren: () => void },
): Promise<string[]> => {
  const befunde: string[] = [];
  const { d, gespielt, fertigDecodieren } = mach(STUMM);

  const bekannt = new Set([...Object.keys(SPIELWEGE), ...KEIN_SPIELWEG]);
  for (const key of Object.keys(d)) {
    if (!bekannt.has(key)) befunde.push(`unbekannter Eintrittsweg \`${key}\` — trag ihn in SPIELWEGE oder KEIN_SPIELWEG ein, sonst ist er ungeprüft`);
  }

  for (const [name, ruf] of Object.entries(SPIELWEGE)) {
    if (!(name in d)) { befunde.push(`\`${name}\` gibt es am Direktor nicht mehr — der Wächter zielt ins Leere`); continue; }
    const vorher = gespielt.length;
    await ruf(d);
    await tick();
    fertigDecodieren();
    await tick();
    const neu = gespielt.slice(vorher).filter((g) => g.volume > 0);
    if (neu.length > 0) befunde.push(`\`${name}\` hat bei muted=true ${neu.length} Klang/Klänge gestartet: ${neu.map((g) => `${g.key}@${g.volume}`).join(", ")}`);
  }
  return befunde;
};

describe("R5 · T8 · die Tür prüft, und zwar an JEDEM Weg", () => {
  it("bei stumm startet KEIN Eintrittsweg einen hörbaren Klang", async () => {
    const befunde = await tuerBefunde((settings) => {
      const { host, gespielt, fertigDecodieren } = phaserAehnlicherHost();
      return { d: baue(host, settings), gespielt, fertigDecodieren };
    });
    expect(befunde, `\n  · ${befunde.join("\n  · ")}\n`).toEqual([]);
  });

  it("TAMPER 1 · ein Weg, der die Tür umgeht, MUSS gemeldet werden", async () => {
    const befunde = await tuerBefunde((settings) => {
      const { host, gespielt, fertigDecodieren } = phaserAehnlicherHost();
      const echt = baue(host, settings);
      // dieselbe Bauart wie vor dem Fix: Musik startet, die Stille hängt allein
      // an einer Lautstärke-Zahl — die der Marker verwirft.
      const kaputt: AudioDirector = Object.assign(Object.create(Object.getPrototypeOf(echt) as object) as AudioDirector, echt, {
        music: async (): Promise<void> => {
          const s = host.add("music-p1", { volume: 0 });
          s.addMarker({ name: "loop", start: 0, duration: 10, config: { loop: true } });
          s.play("loop");
        },
      });
      return { d: kaputt, gespielt, fertigDecodieren };
    });
    expect(befunde.some((b) => b.startsWith("`music`"))).toBe(true);
  });

  it("TAMPER 2 · ein NEUER, nicht eingeordneter Weg MUSS gemeldet werden", async () => {
    const befunde = await tuerBefunde((settings) => {
      const { host, gespielt, fertigDecodieren } = phaserAehnlicherHost();
      const d = Object.assign({}, baue(host, settings), { fanfare: () => host.add("x", { volume: 1 }).play() }) as unknown as AudioDirector;
      return { d, gespielt, fertigDecodieren };
    });
    expect(befunde.some((b) => b.includes("unbekannter Eintrittsweg `fanfare`"))).toBe(true);
  });

  it("die Haupt-Stummschaltung steht schon beim Bau — nicht erst beim ersten Tipp", () => {
    const { host } = phaserAehnlicherHost();
    baue(host, STUMM);
    expect(host.mute, "Phasers Haupt-Schalter blieb offen; die Stille hing an einer einzigen Zahl").toBe(true);
    const zweit = phaserAehnlicherHost();
    baue(zweit.host, LAUT);
    expect(zweit.host.mute).toBe(false);
  });
});

describe("R5 · T8 · die Lautstärke überlebt den Marker", () => {
  it("Musik spielt mit dem Musik-Bus, nicht mit voller Kraft", async () => {
    const { host, gespielt, fertigDecodieren } = phaserAehnlicherHost();
    const d = baue(host, LAUT);
    const p = d.music("p1");
    await tick(); fertigDecodieren(); await p;
    const musik = gespielt.filter((g) => g.key.startsWith("music-"));
    expect(musik.length, "genau ein Stück").toBe(1);
    expect(musik[0]?.ueberMarker, "das Raum-Stück läuft als Schleife, also über einen Marker").toBe(true);
    expect(musik[0]?.volume, `der Marker hat die Lautstärke verworfen (${musik[0]?.volume} statt ${BUSES.music})`).toBeCloseTo(BUSES.music, 5);
  });

  it("jeder `addMarker` im Direktor nennt eine Lautstärke — und der Wächter kann rot", () => {
    const src = fs.readFileSync(DIRECTOR_SRC, "utf8");
    const aufrufe = [...src.matchAll(/\.addMarker\(\{[^}]*\}[^)]*\)/g)].map((m) => m[0]);
    expect(aufrufe.length, "kein einziger addMarker-Aufruf gefunden — der Wächter zielt ins Leere").toBeGreaterThan(0);
    const ohne = aufrufe.filter((a) => !/volume\s*:/.test(a));
    expect(ohne, `ein Marker ohne Lautstärke spielt mit voller Kraft: ${ohne.join(" | ")}`).toEqual([]);
    // TAMPER, an einer Kopie im Speicher: nimm die Lautstärke weg ⇒ muss auffallen
    const verbogen = src.replace(/config: \{ loop: true, volume: vol \}/, "config: { loop: true }");
    expect(verbogen, "die Tamper-Ersetzung hat nichts getroffen — der Wächter prüft eine Schreibweise, die es nicht gibt").not.toBe(src);
    const verbogeneAufrufe = [...verbogen.matchAll(/\.addMarker\(\{[^}]*\}[^)]*\)/g)].map((m) => m[0]).filter((a) => !/volume\s*:/.test(a));
    expect(verbogeneAufrufe.length, "der verbogene Quelltext blieb unentdeckt").toBeGreaterThan(0);
  });

  it("die Attrappe bildet Phasers Marker-Regel nach — am Quelltext von Phaser geprüft", () => {
    const kandidaten = [
      path.resolve(HERE, "../../../../node_modules/phaser/src/sound/BaseSound.js"),
      path.resolve(HERE, "../../../../node_modules/.pnpm/phaser@3.90.0/node_modules/phaser/src/sound/BaseSound.js"),
    ];
    const treffer = kandidaten.find((f) => fs.existsSync(f));
    if (treffer === undefined) {
      // Kein Fehlalarm, wo die Quelle nicht liegt (fremde Installation) — aber
      // auch keine stille Grün-Meldung: die Annahme wird benannt.
      expect(true, "Phasers Quelltext nicht gefunden — die Marker-Annahme ist hier UNGEPRÜFT").toBe(true);
      return;
    }
    const src = fs.readFileSync(treffer, "utf8");
    expect(src, "`play(marker)` nimmt nicht mehr die Marker-Konfiguration — die Attrappe hier ist zur Fiktion geworden")
      .toContain("this.currentConfig = this.currentMarker.config");
    const addMarker = src.slice(src.indexOf("addMarker: function"), src.indexOf("addMarker: function") + 1200);
    expect(addMarker, "die Marker-Vorgabe `volume: 1` ist weg — die Annahme dieser Datei muss neu gemessen werden")
      .toMatch(/config:\s*\{[^}]*volume:\s*1/);
  });
});

describe("R5 · T8 · ein Stück, das niemandem mehr gehört, darf es nicht geben", () => {
  it("zwei Phasenwechsel im selben Fenster lassen genau EIN Stück laufen", async () => {
    const { host, gespielt, fertigDecodieren } = phaserAehnlicherHost({ sofort: false });
    const d = baue(host, LAUT);
    const a = d.music("p1");
    const b = d.music("p2");
    await tick(); fertigDecodieren(); await Promise.all([a, b]);
    const laufend = gespielt.filter((g) => !g.gestoppt);
    expect(laufend.length, `es laufen ${laufend.length}: ${laufend.map((g) => g.key).join(", ")}`).toBe(1);
  });

  it("wer abgebaut ist, fängt nicht mehr an", async () => {
    const { host, gespielt, fertigDecodieren } = phaserAehnlicherHost({ sofort: false });
    const d = baue(host, LAUT);
    const p = d.music("p1");
    await tick();
    d.dispose();
    fertigDecodieren();
    await p;
    expect(gespielt.filter((g) => !g.gestoppt), "ein Stück hat den Abbau seiner Seite überlebt").toEqual([]);
  });

  it("und der Stumm-Knopf erreicht wirklich JEDES laufende Stück", async () => {
    const { host, gespielt, fertigDecodieren } = phaserAehnlicherHost({ sofort: false });
    const d = baue(host, LAUT);
    const a = d.music("p1");
    const b = d.music("p2");
    await tick(); fertigDecodieren(); await Promise.all([a, b]);
    d.setMuted(true);
    const laut = gespielt.filter((g) => !g.gestoppt && g.volume > 0);
    expect(laut, `nach dem Tipp klingen noch: ${laut.map((g) => `${g.key}@${g.volume}`).join(", ")}`).toEqual([]);
    expect(host.mute, "der Haupt-Schalter ist der Riegel über allem").toBe(true);
  });
});
