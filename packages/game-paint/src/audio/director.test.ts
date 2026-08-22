/**
 * R5 · S1 · DER DIREKTOR — und der Beweis, dass er in dieser Runde nichts tut.
 *
 * Zwei Dinge werden hier bewiesen, und das zweite ist das wichtigere:
 *   1. die Zuordnung Ereignis → Klang trifft die richtige Zeile, auch dort, wo
 *      zwei Unionen denselben Namen benutzen;
 *   2. dieses Modul hat in S1 KEINEN Aufrufer — `PaintScene` und `PaintGame`
 *      importieren nichts von hier, und der Direktor ohne Tonmaschine ist ein
 *      No-op, der nie wirft.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  createAudioDirector, createSharedContext, mapEvent, type HostSound, type SoundHost,
} from "./director.ts";
import { STEMS, filesOf } from "./audioManifest.ts";
import { AUDIO_FILES } from "./audioFiles.ts";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const PKG = path.resolve(HERE, "..");

// ── Eine Attrappe der Tonmaschine ────────────────────────────────────────────
const fakeHost = (): { host: SoundHost; played: string[] } => {
  const played: string[] = [];
  const host: SoundHost = {
    add(key: string): HostSound {
      played.push(key);
      return {
        addMarker: () => true,
        play: () => true,
        stop: () => true,
        destroy: () => undefined,
        setVolume: () => undefined,
      };
    },
    decodeAudio: () => undefined,
    removeByKey: () => undefined,
    mute: false,
    volume: 1,
  };
  return { host, played };
};

describe("mapEvent — die Tabelle trifft die richtige Zeile", () => {
  it("trennt die zwei `encounter`: Tinte ist ein anderes Ereignis als ein Wesen", () => {
    expect(mapEvent("player", "encounter", { hazard: "w" }).stem).toBe("ink-splash");
    expect(mapEvent("entity", "encounter", {}).stem).toBe("bump");
  });

  it("trennt die zwei `guardianDown`: das Entity-Ereignis ist gefaltet, das Sim-Ereignis klingt", () => {
    expect(mapEvent("sim", "guardianDown", {}).stem).toBe("board-bloom");
    expect(mapEvent("entity", "guardianDown", {}).stem).toBeNull();
  });

  it("das letzte Wischen schweigt, weil das Aufblühen denselben Augenblick trägt", () => {
    expect(mapEvent("sim", "guardianWipe", { layersLeft: 2 }).stem).toBe("wipe");
    expect(mapEvent("sim", "guardianWipe", { layersLeft: 0 }).stem).toBeNull();
  });

  it("die Buchstaben-Fanfare kommt erst, wenn alle da sind", () => {
    expect(mapEvent("sim", "letters", { got: 3, total: 8 }).stem).toBeNull();
    expect(mapEvent("sim", "letters", { got: 8, total: 8 }).stem).toBe("letters-all");
  });

  it("der Kreidestaub klingt, der Faust-Treffer ist für ein späteres Kapitel reserviert", () => {
    expect(mapEvent("sim", "puff", { kind: "chalk" }).stem).toBe("puff-chalk");
    expect(mapEvent("sim", "puff", { kind: "hit" }).stem).toBeNull();
    expect(mapEvent("sim", "puff", { kind: "hit" }).why).toContain("Faust");
  });

  /**
   * R5-W7 · S3 · D-372 — DIESER TEST STAND FRÜHER ANDERSHERUM.
   *
   * Bis Welle 7 hiess er »Torschluss-Toasts werden am TEXT erkannt« und war
   * genau deshalb richtig UND das gemeldete Problem: der Klang hing an vier
   * Satz-Anfängen. Der Torschluss hat jetzt sein eigenes Ereignis, und was
   * hier geprüft wird, ist die Gegenrichtung — dass am Text NICHTS mehr hängt,
   * was ein Ereignis hat. Die Tinte bleibt die eine Ausnahme, weil
   * `onPlayerEvent` sie ausschliesslich als Meldung nach oben gibt.
   */
  it("am Text hängt nur noch die Tinte — der Torschluss hat sein Ereignis", () => {
    expect(mapEvent("sim", "toast", { msg: "Platsch!" }).stem).toBe("ink-splash");
    expect(mapEvent("sim", "toast", { msg: "Husch!" }).stem).toBe("toast");
    // die vier Torschluss-Sätze, wörtlich aus `sim.ts` — sie klingen als Toast
    // nicht mehr, weil sie ihr Echo-Feld tragen …
    for (const msg of [
      "Du hast noch etwas Wichtiges vergessen!",
      "Die Tür wartet auf ihr Wort!",
      "Die Tafel ist noch voller Kritzel!",
      "Erst die Tafel sauber — dann der Käfig.",
    ]) {
      const r = mapEvent("sim", "toast", { msg, echoes: "gate" });
      expect(r.stem, `»${msg}« klingt als Toast — das wäre ein zweiter Klang auf dem Beat`).toBeNull();
      expect(r.why.length, `»${msg}« schweigt ohne lesbaren Grund`).toBeGreaterThan(20);
    }
  });

  it("der Torschluss klingt am Ereignis — vier Gründe klingen, der Käfig schweigt", () => {
    for (const reason of ["powerup", "tuerwort", "tafel", "klassenfoto"]) {
      expect(mapEvent("sim", "gate", { reason }).stem, `Grund »${reason}« klingt nicht`).toBe("gate-waits");
    }
    // Der Käfig hat seinen Klang schon am EntityEvent — sonst wären es zwei.
    expect(mapEvent("entity", "cageGated", {}).stem).toBe("cage-locked");
    const caged = mapEvent("sim", "gate", { reason: "cageGated" });
    expect(caged.stem).toBeNull();
    expect(caged.why).toContain("cage-locked");
  });

  it("ein Ereignis, das es nicht gibt, ist still und sagt warum", () => {
    const r = mapEvent("sim", "gibtEsNicht", {});
    expect(r.stem).toBeNull();
    expect(r.why).toContain("unbekanntes Ereignis");
  });

  /**
   * Der Momentaufnahme-Test: ein VERTAUSCHTES Mapping muss sichtbar werden.
   * Ohne ihn wäre „card-open klingt beim Türöffnen" eine Änderung, die jeder
   * andere Test dieser Datei mitträgt.
   */
  it("Momentaufnahme der tragenden Zuordnungen", () => {
    expect({
      task: mapEvent("sim", "task", {}).stem,
      exit: mapEvent("sim", "exit", {}).stem,
      cageFreed: mapEvent("sim", "cageFreed", {}).stem,
      cageBurst: mapEvent("entity", "cageBurst", {}).stem,
      cageGated: mapEvent("entity", "cageGated", {}).stem,
      shooed: mapEvent("entity", "shooed", {}).stem,
      guardianStagger: mapEvent("entity", "guardianStagger", {}).stem,
      arenaBrief: mapEvent("sim", "arenaBrief", {}).stem,
      entityResolved: mapEvent("sim", "entityResolved", {}).stem,
      tip: mapEvent("sim", "tip", {}).stem,
      letterTaken: mapEvent("sim", "letterTaken", {}).stem,
      jumped: mapEvent("player", "jumped", {}).stem,
      landedSoft: mapEvent("player", "landed", { hard: false }).stem,
      landedHard: mapEvent("player", "landed", { hard: true }).stem,
    }).toEqual({
      task: "card-open",
      exit: "door-open",
      cageFreed: "cage-free",
      cageBurst: "cage-open",
      cageGated: "cage-locked",
      shooed: "shoo",
      guardianStagger: "boss-window",
      arenaBrief: "arena-brief",
      entityResolved: "being-answered",
      tip: "page-take",
      letterTaken: "letter-take",
      jumped: "jump",
      landedSoft: "land-soft",
      landedHard: "land-hard",
    });
  });
});

describe("No-op — ein fehlender Ton macht kein Spiel kaputt", () => {
  it("ohne Tonmaschine ist der Direktor abgeschaltet und wirft nie", async () => {
    const d = createAudioDirector({});
    expect(d.enabled).toBe(false);
    await expect(d.decodeAfterCreate("p1")).resolves.toBeUndefined();
    await expect(d.music("p1")).resolves.toBeUndefined();
    expect(() => d.on("sim", "cageFreed", {})).not.toThrow();
    expect(() => d.footstep("paper", 1)).not.toThrow();
    expect(() => d.land(true)).not.toThrow();
    expect(() => d.dispose()).not.toThrow();
  });

  it("mit Tonmaschine, aber ohne eine einzige Datei, bleibt er abgeschaltet", () => {
    const { host } = fakeHost();
    const d = createAudioDirector({ sound: host, hasFile: () => false });
    expect(d.enabled).toBe(false);
  });

  it("`createSharedContext` gibt null zurück, wo es keinen AudioContext gibt", () => {
    const had = "AudioContext" in globalThis;
    if (!had) expect(createSharedContext()).toBeNull();
  });
});

describe("Abspiel-Regeln", () => {
  const withHost = (opts: Partial<Parameters<typeof createAudioDirector>[0]> = {}) => {
    const { host, played } = fakeHost();
    const d = createAudioDirector({ sound: host, hasFile: () => true, fetchAudio: async () => new ArrayBuffer(8), ...opts });
    return { d, played };
  };

  it("stumm heisst stumm", async () => {
    const { d, played } = withHost({ settings: { muted: true, music: true, sfx: true } });
    await d.decodeAfterCreate("p1");
    d.on("sim", "cageFreed", {});
    expect(played).toEqual([]);
  });

  it("Schritte haben ein Ratenlimit — zwei in derselben Millisekunde sind einer", async () => {
    let t = 1000;
    const { d, played } = withHost({ now: () => t });
    await d.decodeAfterCreate("p1");
    d.footstep("paper");
    d.footstep("paper");
    expect(played.length).toBe(1);
    t += 200;
    d.footstep("paper");
    expect(played.length).toBe(2);
  });

  it("Varianten kommen reihum, nie zweimal dieselbe hintereinander", async () => {
    let t = 0;
    const { d, played } = withHost({ now: () => (t += 500) });
    await d.decodeAfterCreate("p1");
    for (let i = 0; i < 8; i++) d.footstep("paper");
    for (let i = 1; i < played.length; i++) expect(played[i]).not.toBe(played[i - 1]);
    expect(new Set(played).size).toBe(4); // vier Varianten, alle benutzt
  });

  it("die Buchstaben-Stufe steigt mit der Zahl statt reihum zu laufen", async () => {
    const { d, played } = withHost();
    await d.decodeAfterCreate("p1");
    d.on("sim", "letterTaken", { got: 1 });
    d.on("sim", "letterTaken", { got: 2 });
    d.on("sim", "letterTaken", { got: 3 });
    d.on("sim", "letterTaken", { got: 9 });
    expect(played).toEqual(["letter-take-1", "letter-take-2", "letter-take-3", "letter-take-3"]);
  });

  it("die Musik einer Phase wird geholt, die vorige freigegeben", async () => {
    const { host } = fakeHost();
    const remove = vi.fn();
    const d = createAudioDirector({
      sound: { ...host, removeByKey: remove }, hasFile: () => true,
      fetchAudio: async () => new ArrayBuffer(8),
    });
    await d.music("p1");
    await d.music("p2");
    expect(remove).toHaveBeenCalledWith("music-p1");
  });

  it("dieselbe Phase zweimal wechselt die Musik nicht", async () => {
    const { host } = fakeHost();
    const remove = vi.fn();
    const d = createAudioDirector({
      sound: { ...host, removeByKey: remove }, hasFile: () => true,
      fetchAudio: async () => new ArrayBuffer(8),
    });
    await d.music("p1");
    await d.music("p1");
    expect(remove).not.toHaveBeenCalled();
  });
});

/**
 * R5-W6 · S2 · HIER STAND DIE UMGEKEHRTE BEHAUPTUNG.
 *
 * S1 hat an dieser Stelle bewiesen, dass NIEMAND das Modul importiert — das war
 * damals die Aussage des PRs („die Fabrik steht, das Spiel ist unverändert").
 * Genau dieser Test ist beim ersten Lauf dieser Sitzung rot geworden, und das
 * war er zu Recht: die Behauptung stimmt nicht mehr.
 *
 * Er wird nicht gelöscht, sondern UMGEDREHT. Ein Test, der eine Abwesenheit
 * bewacht hat, wird zu einem, der die Anwesenheit bewacht — denn die neue
 * Gefahr ist die Umkehrung der alten: nicht »jemand hat zu früh verdrahtet«,
 * sondern »jemand hat beim Aufräumen eine der vier Anschlussstellen wieder
 * herausgenommen, und das Kapitel ist still, ohne dass ein Tor es merkt«.
 * Ein stummes Spiel sieht in keinem Diff und auf keinem Schirmbild anders aus.
 */
describe("die vier Anschlussstellen sind verdrahtet (S2)", () => {
  // `PKG` ist der src-Ordner (siehe oben), die Pfade sind relativ dazu.
  const read = (rel: string): string => fs.readFileSync(path.join(PKG, rel), "utf8");

  it("der Trichter der Spiel-Logik hört mit — EINE Zeile für alle SimEvents", () => {
    const src = read("PaintScene.ts");
    expect(src, "PaintScene#handleSimEvents ruft den Direktor nicht mehr").toMatch(
      /audio\?\.on\(\s*["']sim["']/,
    );
  });

  it("die gefalteten EntityEvents hören mit (die eine Zeile in sim.ts)", () => {
    expect(read("sim.ts"), "sim.ts reicht die EntityEvents nicht mehr durch").toMatch(
      /onEntityAudio\?\.\(ev\)/,
    );
    expect(read("PaintScene.ts"), "PaintScene klemmt den Durchreicher nicht an").toMatch(
      /onEntityAudio:\s*\(ev\)\s*=>/,
    );
  });

  it("der Szenen-Takt trägt Schritt, Landung, Sprung und Rutsche", () => {
    const src = read("PaintScene.ts");
    for (const [what, re] of [
      ["Schritt", /audio\?\.footstep\(/],
      ["Landung", /audio\?\.land\(/],
      ["Sprung", /audio\?\.on\(\s*["']player["']\s*,\s*["']jumped["']/],
      ["Rutsche", /audio\?\.cue\(\s*["']slide["']/],
    ] as const) {
      expect(src, `${what} klingt nicht mehr`).toMatch(re);
    }
  });

  it("die Bank wird NACH create() geholt, nie im preload", () => {
    const src = read("PaintScene.ts");
    expect(src, "decodeAfterCreate fehlt").toMatch(/audio\?\.decodeAfterCreate\(/);
    // Der Loader hält das erste Bild an. Eine Klang-Bank im `preload` wäre ein
    // Kapitel, das später anfängt, damit ein Schritt klingen kann.
    const preload = /preload\(\)\s*:\s*void\s*\{[\s\S]*?\n  \}/.exec(src)?.[0] ?? "";
    expect(preload, "die Klang-Bank steht im preload").not.toMatch(/audio|decodeAfterCreate/);
  });

  it("die Hülle baut genau EINEN Direktor und gibt ihn wieder frei", () => {
    const src = read("PaintGame.tsx");
    expect((src.match(/createAudioDirector\(/g) ?? []).length, "mehr als ein Direktor").toBe(1);
    expect(src, "der Direktor wird nie freigegeben").toMatch(/director\.dispose\(\)/);
    expect(src, "der geteilte Kontext fehlt in der Phaser-Konfiguration").toMatch(/audio:\s*\{\s*context:\s*audioCtx\s*\}/);
    // Der Direktor darf NICHT in der Szene gebaut werden: sie stirbt bei jedem
    // Raumwechsel, und mit ihr die decodierte Bank (siehe PaintSceneCfg#audio).
    expect(read("PaintScene.ts"), "die Szene baut sich einen eigenen Direktor").not.toMatch(/createAudioDirector\(/);
  });

  it("die Musik wartet auf das Entsperren — sonst ist sie für immer weg", () => {
    const src = read("PaintGame.tsx");
    expect(src, "niemand hört auf Phasers UNLOCKED").toMatch(/Sound\.Events\.UNLOCKED/);
    expect(src, "die Musik startet ungeprüft in einen gesperrten Kontext").toMatch(/game\.sound\.locked/);
  });

  it("die Bank ist klein genug, um als Ganzes zu leben, die Musik nicht", () => {
    const bank = STEMS.filter((s) => s.bus === "sfx").flatMap(filesOf)
      .map((f) => AUDIO_FILES[f]?.durationSec ?? 0).reduce((a, b) => a + b, 0);
    expect(bank, `Effekt-Bank ${bank.toFixed(1)} s`).toBeLessThan(60);
  });
});
