/**
 * R5-W6b · D4 · D-371 — DAS BAND FÜR DEN EINEN KLANG, DER KEINEN AUSLÖSER HATTE.
 *
 * `solve-thud` — der weiche, neutrale Ton auf eine falsche Antwort (BLUEPRINT
 * :371) — war seit S1 gemastert und seit S2 der einzige Stem ohne Weg: die
 * Bewertung liegt in `cards/`, und die Audio-Bahn durfte dort nicht hin.
 *
 * Was hier geprüft wird, ist die KETTE, nicht ihre Absicht:
 *   1. der Direktor macht aus dem Urteil einen Klang — genau einen;
 *   2. „richtig" bleibt hier still, weil die Hülle die Fanfare selbst spielt
 *      (der Doppelklang ist der Fehler, den diese Runde ausdrücklich vermeidet);
 *   3. die Karte meldet das Urteil an genau der Stelle, an der sie es fällt.
 *
 * Punkt 3 wird am QUELLTEXT gelesen und nicht gerendert: dieses Paket hat keine
 * DOM-Umgebung in den Tests, und ein erfundener Renderer wäre ein zweites Spiel,
 * das dann auch stimmen müsste. Der Quelltext-Test ist enger, als er aussieht —
 * er hält fest, in WELCHEM Zweig die Meldung steht, und genau dort liegt der
 * Unterschied zwischen »einmal je Fehlversuch« und »einmal je Tastendruck«.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  CARD_GRADE_STEMS, createAudioDirector, type HostSound, type SoundHost,
} from "../audio/director.ts";

const SRC = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (f: string): string => fs.readFileSync(path.join(SRC, f), "utf8");

/** eine Tonmaschine, die nur mitschreibt, was sie spielen sollte */
const fakeHost = (): { host: SoundHost; played: string[] } => {
  const played: string[] = [];
  const host: SoundHost = {
    add(key: string): HostSound {
      played.push(key);
      return { addMarker: () => true, play: () => true, stop: () => true, destroy: () => undefined, setVolume: () => undefined };
    },
    decodeAudio: () => undefined,
    removeByKey: () => undefined,
    mute: false,
    volume: 1,
  };
  return { host, played };
};

const director = async () => {
  const { host, played } = fakeHost();
  const d = createAudioDirector({ sound: host, hasFile: () => true, fetchAudio: async () => new ArrayBuffer(8) });
  await d.decodeAfterCreate("p1");
  return { d, played };
};

describe("R5-W6b · D4 · D-371 · die Wertung einer Karte klingt", () => {
  it("eine falsche Antwort spielt den Thud — genau einmal", async () => {
    const { d, played } = await director();
    d.card("wrong");
    expect(played.filter((f) => f.startsWith("solve-thud")).length).toBe(1);
    expect(played.length, `es klang noch etwas anderes mit: ${played.join(", ")}`).toBe(1);
  });

  it("eine richtige Antwort klingt hier NICHT — die Fanfare gehört der Hülle", async () => {
    const { d, played } = await director();
    d.card("correct");
    expect(played, "Doppelklang: PaintGame#resolveCorrect spielt »solve-ok« bereits selbst").toEqual([]);
    expect(CARD_GRADE_STEMS.correct).toBeNull();
  });

  it("zwei Fehlversuche sind zwei Thuds — der Ton hat kein Ratenlimit, das ihn verschluckt", async () => {
    const { d, played } = await director();
    d.card("wrong");
    d.card("wrong");
    // zwei Klänge, und wegen der Varianten-Rotation NICHT zweimal dieselbe Datei
    expect(played.length).toBe(2);
    expect(played[0]).not.toBe(played[1]);
  });

  it("der Thud ist neutral, nicht ein Urteil (BLUEPRINT :371)", async () => {
    const { STEMS } = await import("../audio/audioManifest.ts");
    const spec = STEMS.find((s) => s.stem === CARD_GRADE_STEMS.wrong);
    expect(spec, "der verdrahtete Stem steht gar nicht im Manifest").toBeDefined();
    expect(spec!.family).toBe("neutral");
    expect(spec!.bus).toBe("sfx");
  });

  it("die Karte meldet ihr Urteil im FALSCH-Zweig — und nirgends sonst", () => {
    const host = read("cards/CardHost.tsx");
    const wrongBranch = host.match(/if \(g === "wrong"\) \{[\s\S]*?\n {4}\}/)?.[0] ?? "";
    expect(wrongBranch, "der falsch-Zweig sieht anders aus als erwartet — Meldung von Hand nachlesen").not.toBe("");
    expect(wrongBranch).toMatch(/onGrade\?\.\("wrong"\)/);
    // genau ein Aufruf in der ganzen Datei: ein zweiter (etwa im `pending`-Pfad
    // oder im Zurücksetzen) wäre ein Thud je Tastendruck statt je Fehlversuch
    expect((host.match(/onGrade\?\./g) ?? []).length).toBe(1);
  });

  it("die Hülle reicht den Rückkanal an den CardHost — auf den Direktor, nicht auf einen Klangnamen", () => {
    const game = read("PaintGame.tsx");
    expect(game).toMatch(/onGrade=\{cardGrade\}/);
    expect(game).toMatch(/const cardGrade = \([\s\S]{0,80}directorRef\.current\?\.card\(grade\)/);
    // die Karte darf den Direktor NICHT selbst kennen — sonst wandert die
    // Klang-Entscheidung in die Karten-Bahn zurück, und das ist die Trennung,
    // an der S2 stehengeblieben ist
    // (gemeint sind IMPORTE — der Verweis im Kommentar darf und soll dort stehen)
    expect(read("cards/CardHost.tsx")).not.toMatch(/from "[^"]*audio\//);
  });
});
