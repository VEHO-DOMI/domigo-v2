/**
 * K12 · die Naht der Hoer-Flaeche, unter `node --test` (apps/web hat kein
 * vitest — dieselbe Bauart wie lib/grade-scope.test.ts).
 *
 * Zwei Sorten Faelle, bewusst getrennt:
 *   · REINE Faelle (Download-Name, Ausblendung) — sie beweisen die Regel;
 *   · BESTANDS-Faelle — sie lesen den echten Korpus und beweisen, dass die
 *     Regel auf ihn passt. Eine Zahl daraus ist ein ZEITPUNKT-Stand und steht
 *     deshalb nur dort, wo sie eine Eigenschaft belegt (»alle sieben tragen
 *     eine Aufnahme«), nie als Selbstzweck.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AudioRef } from "@domigo/content-schema";
import { dauerSchaetzung, downloadName, hoerStueckeFuerStufe, ohneSprechtextFuersKind, woerterZaehlen } from "./hoeren.ts";

const MIT_AUFNAHME: AudioRef = {
  script: "Hi! I am Emma. Last Tuesday our class had a science lesson.",
  voice: null,
  file: "/audio/listening/g2-u04/vote--amelia--598e1842.mp3",
  source: {
    provider: "elevenlabs",
    modelId: "eleven_multilingual_v2",
    voices: [{ role: null, slug: "amelia", name: "Amelia", voiceId: "ZF6FPAbjXT4488VcRRnw" }],
  },
};

describe("ohneSprechtextFuersKind — der Loesungstext faehrt nicht mit", () => {
  it("haelt den Sprechtext zurueck, sobald es eine Aufnahme gibt", () => {
    assert.equal(ohneSprechtextFuersKind(MIT_AUFNAHME).script, null);
  });

  it("laesst den Sprechtext drin, wenn es KEINE Aufnahme gibt (sonst waere die Aufgabe stumm)", () => {
    const ohne: AudioRef = { ...MIT_AUFNAHME, file: null };
    assert.equal(ohneSprechtextFuersKind(ohne).script, MIT_AUFNAHME.script);
  });

  it("gibt den Pfad und die Stimme unveraendert weiter — der Abspieler braucht beides", () => {
    const k = ohneSprechtextFuersKind({ ...MIT_AUFNAHME, voice: "Amelia" });
    assert.equal(k.file, MIT_AUFNAHME.file);
    assert.equal(k.voice, "Amelia");
  });

  it("ist eine POSITIV-Liste: was nicht genannt ist, faehrt nicht mit", () => {
    // Die Streichlisten-Falle der Registry: ein Spread wuerde jedes neue Feld
    // durchlassen. Hier wird ein erfundenes Zusatzfeld mitgegeben — es darf im
    // Ergebnis nicht auftauchen, und `source` ebenso wenig.
    const mitZusatz = { ...MIT_AUFNAHME, geheim: "loesung" } as AudioRef;
    const k = ohneSprechtextFuersKind(mitZusatz);
    assert.deepEqual(Object.keys(k).sort(), ["file", "script", "voice"]);
  });

  it("laesst in KEINEM Fall den Text irgendwo anders im Ergebnis stehen", () => {
    const alsText = JSON.stringify(ohneSprechtextFuersKind(MIT_AUFNAHME));
    assert.ok(!alsText.includes("science lesson"), alsText);
  });
});

describe("downloadName — ein sprechender Name fuer den Ordner der Lehrkraft", () => {
  it("baut Einheit + Aufgabe + Zweck zusammen", () => {
    assert.equal(downloadName("g2-u04", "vote"), "g2-u04-vote-hoeren.mp3");
  });

  it("traegt nie einen Pfadtrenner (ein Download-Name ist ein Name, kein Pfad)", () => {
    for (const [e, s] of [["g2/u04", "vo/te"], ["../g2-u04", "vote"], ["g2-u04", "a b"]] as const) {
      const n = downloadName(e, s);
      assert.ok(!n.includes("/"), n);
      assert.ok(!n.includes(".."), n);
      assert.ok(!n.includes(" "), n);
    }
  });

  it("unterscheidet zwei Aufgaben derselben Einheit", () => {
    assert.notEqual(downloadName("g2-u04", "vote"), downloadName("g2-u04", "market"));
  });
});

describe("woerterZaehlen", () => {
  it("zaehlt Woerter, nicht Leerraum", () => {
    assert.equal(woerterZaehlen("  Hi!  I  am\nEmma. "), 4);
  });
});

describe("hoerStueckeFuerStufe — der echte Bestand", () => {
  const zwei = hoerStueckeFuerStufe(2);

  it("liefert nur Einheiten der eigenen Stufe", () => {
    assert.ok(zwei.stuecke.length > 0, "Stufe 2 sollte Hoer-Stuecke haben");
    for (const s of zwei.stuecke) assert.ok(s.einheit.startsWith("g2-"), s.einheit);
  });

  it("liest den Sprechtext WOERTLICH aus dem Bestand — nicht leer, nicht gekuerzt", () => {
    for (const s of zwei.stuecke) {
      assert.ok(s.sprechtext.length > 0, s.aufgabeId);
      assert.equal(s.woerter, woerterZaehlen(s.sprechtext));
    }
  });

  it("nennt jede Aufnahme mit wurzel-absolutem Pfad (der K5a-Datei-Kontrakt)", () => {
    for (const s of zwei.stuecke) {
      if (s.datei !== null) assert.ok(s.datei.startsWith("/audio/"), `${s.aufgabeId}: ${s.datei}`);
    }
  });

  it("meldet keine unlesbare Einheit auf einem gesunden Bestand", () => {
    assert.deepEqual(zwei.unlesbar, []);
  });

  it("mischt keine fremde Stufe hinein", () => {
    for (const g of [1, 3, 4]) {
      for (const s of hoerStueckeFuerStufe(g).stuecke) assert.ok(s.einheit.startsWith(`g${g}-`), s.einheit);
    }
  });
});

describe("dauerSchaetzung — grob, gerundet, als Schaetzung beschriftet", () => {
  it("nennt sehr kurze Stuecke ehrlich »unter 1 Min.«", () => {
    assert.equal(dauerSchaetzung(60), "unter 1 Min.");
  });

  it("rundet auf halbe Minuten, mit deutschem Komma", () => {
    assert.equal(dauerSchaetzung(112), "ca. 1 Min.");
    assert.equal(dauerSchaetzung(168), "ca. 1,5 Min.");
    assert.equal(dauerSchaetzung(280), "ca. 2,5 Min.");
  });

  it("waechst monoton — mehr Woerter sind nie weniger Zeit", () => {
    const zahl = (t: string) => (t === "unter 1 Min." ? 0 : Number(t.replace("ca. ", "").replace(" Min.", "").replace(",", ".")));
    let vorher = -1;
    for (let w = 20; w <= 600; w += 20) {
      const jetzt = zahl(dauerSchaetzung(w));
      assert.ok(jetzt >= vorher, `${w} Woerter: ${jetzt} < ${vorher}`);
      vorher = jetzt;
    }
  });
});
