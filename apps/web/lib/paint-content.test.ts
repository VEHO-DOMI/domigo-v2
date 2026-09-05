/**
 * L0 · D1/D4 · DER LADER DES GEMALTEN BUCHS — jetzt für jedes Kapitel.
 *
 * Zwei Dinge werden hier bewiesen, und beide waren vor der Level-Welle
 * unprüfbar, weil es nur ein Kapitel gab:
 *
 *   1. Der Lader lädt WIRKLICH mehr als ch01, weist eine erfundene Kapitel-Id
 *      ab, und die Entwurfs-Flagge überlebt das Parsen. Der letzte Punkt ist
 *      der heikelste: dieses Schema STRIPPT, was es nicht kennt, also wäre ein
 *      Kapitel, dessen `draft` niemand ins zod schriebe, im Browser plötzlich
 *      fertig — hinter der Lehrer-Tür heraus, für jedes Kind sichtbar.
 *
 *   2. Die Rollen-Liste existiert nur noch EINMAL. Sie stand hier als
 *      zod-Literal und in `@domigo/game-paint/level` als Union; dreimal fehlte
 *      auf DIESER Seite eine Rolle, die der Motor schon kannte, und jedes Mal
 *      war es ein 500 auf dem ausgelieferten Kapitel statt eines Typfehlers.
 *
 * `node --test`, wie die Nachbarn hier: apps/web hat kein vitest.
 */
import assert from "node:assert/strict";
import { register } from "node:module";
import { describe, it } from "node:test";
import { ENTITY_ROLES } from "@domigo/game-paint/level";

// `paint-content.ts` traegt `import "server-only"` — einen Bau-Waechter ohne
// Laufzeit-Inhalt, den Next selbst aufloest und den `node --test` nicht kennt.
// Der Haken gibt ihm ein leeres Modul, damit HIER die echte Datei geprueft wird
// und nicht eine Kopie ohne diese Zeile (siehe lib/testing/server-only-shim.mjs).
register(new URL("./testing/server-only-shim.mjs", import.meta.url));
const { CHAPTER_ID, chapterHasTasks, listPaintChapters, loadPaintLevel, parsePaintLevelFile } = await import("./paint-content.ts");

const STORY = "g1.st.lost-pages";

describe("L0 · D1 · der Kapitel-Lader", () => {
  it("findet mehr als ein Kapitel auf der Platte", () => {
    const chapters = listPaintChapters(STORY);
    assert.ok(chapters.includes("ch01"), `ch01 fehlt in [${chapters.join(", ")}]`);
    assert.ok(chapters.length >= 2, `nur ${chapters.length} Kapitel — die Bahn existiert, damit es mehrere sein können`);
  });

  it("lädt ch01 und ch02, jedes mit seiner eigenen Id", () => {
    assert.equal(loadPaintLevel(STORY, "ch01").chapter, "ch01");
    assert.equal(loadPaintLevel(STORY, "ch02").chapter, "ch02");
  });

  it("die Entwurfs-Flagge überlebt das Parsen — sonst stünde ein Rohbau offen", () => {
    assert.equal(loadPaintLevel(STORY, "ch02").draft, true);
    assert.notEqual(loadPaintLevel(STORY, "ch01").draft, true);
  });

  it("weist eine Kapitel-Id ab, die keine ist", () => {
    // die Form-Prüfung, die die Route VOR jedem Datei-Zugriff macht
    assert.equal(CHAPTER_ID.test("ch7"), false);
    assert.equal(CHAPTER_ID.test("ch07"), true);
    assert.equal(CHAPTER_ID.test("../etc"), false);
    assert.throws(() => loadPaintLevel(STORY, "ch7"), /bad chapter/);
  });

  it("ein Kapitel ohne Kartensatz ist kein Fehler, sondern ein Zustand", () => {
    assert.equal(chapterHasTasks(STORY, "ch01"), true);
    // L2-T1 03.09.: ch02 trägt Karten (vorher: die Prämisse war »ch02 hat noch keine«).
    // Der Titel dieses Falls stammt noch aus dieser Prämisse und ist damit zu weit —
    // beide Kapitel tragen jetzt einen Kartensatz. Umbenennen gehört nicht dieser Bahn
    // (Scope-Wand: nur dieser eine Fall); gemeldet im Report der Bahn L2-T1.
    assert.equal(chapterHasTasks(STORY, "ch02"), true);
  });
});

describe("L0 · D4 · eine Rollenliste, nicht zwei", () => {
  it("das zod-Enum dieses Laders IST die Liste des Motors", () => {
    // Beide Richtungen, weil eine Teilmenge in jede Richtung anders wehtut:
    // fehlt hier eine Rolle, ist es ein 500; steht hier eine zu viel, parst
    // ein Level, das der Motor nicht spielen kann.
    const level = loadPaintLevel(STORY, "ch01");
    const benutzt = new Set(
      [...level.phases, level.arena, level.bonus]
        .filter((p) => p !== undefined)
        .flatMap((p) => p!.entities.map((e) => e.role)),
    );
    assert.ok(benutzt.size > 0, "das Kapitel setzt keine einzige Entity — der Fall prüfte nichts");
    for (const r of benutzt) {
      assert.ok((ENTITY_ROLES as readonly string[]).includes(r), `Rolle "${r}" wird gespielt, steht aber nicht in ENTITY_ROLES`);
    }
    // und die Liste selbst ist sauber: keine Doppelung, keine leere Zeile
    assert.equal(new Set(ENTITY_ROLES).size, ENTITY_ROLES.length);
    assert.ok(ENTITY_ROLES.every((r) => typeof r === "string" && r.length > 0));
  });
});

describe("L0 · N1 · R246 · der Sammel-Skin ist ein Level-Feld", () => {
  it("ch01 deklariert keinen — also Buchstaben, byte-gleich wie vorher", () => {
    assert.equal(loadPaintLevel(STORY, "ch01").collectSkin, undefined);
  });

  it("ch02 deklariert `feather`, und das Feld ÜBERLEBT das Parsen", () => {
    // Der ganze Sinn dieses Falls: das Schema strippt, was es nicht kennt.
    // Ohne die zod-Zeile stünde `feather` in der Datei, jedes Tor bliebe grün,
    // und im Browser sammelte ch02 wieder Buchstaben.
    assert.equal(loadPaintLevel(STORY, "ch02").collectSkin, "feather");
  });

  it("und ein Federn-Kapitel deklariert keine Trail-Wörter", () => {
    // Buchstaben buchstabieren, Federn nicht — das Gesetz `trail-words` sagt
    // das seit N1 auch, und der Inhalt hält sich daran.
    const ch02 = loadPaintLevel(STORY, "ch02");
    for (const ph of [...ch02.phases, ch02.arena, ch02.bonus]) {
      if (ph === undefined) continue;
      assert.equal(ph.words, undefined, `${ph.id} trägt Wörter, obwohl das Kapitel Federn sammelt`);
    }
  });
});

describe("L0 · N2 · die Fundstück-Wörter überleben das Parsen (D-921)", () => {
  it("ch01 deklariert keines — das HUD sagt weiter »Kleider«", () => {
    const ch01 = loadPaintLevel(STORY, "ch01");
    assert.equal(ch01.clothNounDe, undefined);
    assert.equal(ch01.clothPlaceDe, undefined);
  });

  it("ch02 deklariert alle vier, und alle vier kommen an", () => {
    const ch02 = loadPaintLevel(STORY, "ch02");
    assert.equal(ch02.clothNounDe, "Tierspuren");
    assert.equal(ch02.clothNounDatDe, "Tierspuren");
    assert.equal(ch02.clothNounSgDe, "Tierspur");
    assert.equal(ch02.clothPlaceDe, "Zoo-Gelände");
  });
});

describe("L0 · N7 · das Bonus-Budget überlebt das Parsen (D-831 = D-927)", () => {
  it("ch01 deklariert keines — die Kammer läuft weiter 35 Sekunden", () => {
    assert.equal(loadPaintLevel(STORY, "ch01").bonus?.budgetSec, undefined);
  });

  it("ch02 deklariert 30, und die 30 kommt an", () => {
    // Ohne die zod-Zeile stünde die 30 in der Datei und die Kammer liefe
    // trotzdem 35 — der stille Strip, gegen den diese ganze Test-Datei steht.
    assert.equal(loadPaintLevel(STORY, "ch02").bonus?.budgetSec, 30);
  });
});

// ── L3-M-a · TAUWERK UND BILGE ÜBERLEBEN DAS PARSEN ────────────────────────
//
// `PaintPhase` ist ein GESCHLOSSENES `z.object`: was hier nicht aufgezählt ist,
// wird STILL entfernt. Bei diesen beiden Feldern ist das besonders bösartig,
// weil die Gesetze auf der Platte gegen die DATEI laufen und grün blieben — das
// Gesetz prüfte dann eine Ring-Kette und eine steigende Bilge, die im Browser
// gar nicht existieren, und jeder Ring schwänge wieder an 96 px.
//
// ⚠ Kein Kapitel deklariert die Felder heute (die M-a-Bahn fasst kein Level an,
// G2 setzt sie), also prüft dieser Fall den PARSER an einem gebauten Objekt —
// genau die Stelle, an der der Strip passiert.
describe("L3-M-a · Tauwerk und Bilge überleben das Parsen", () => {
  const grid = [
    "############",
    ...Array.from({ length: 16 }, () => "............"),
    "..S....o..X.",
    "############",
    "############",
  ];
  const datei = (phaseOver: Record<string, unknown>): unknown => ({
    schema: "paintLevel@1",
    id: "g1-zod-test",
    chapter: "ch03",
    draft: true,
    name: "Test",
    goalDe: "x",
    whyDe: "x",
    hintsDe: [],
    collectNounDe: "x",
    abilities: ["jump", "swing", "punch"],
    phases: [{ id: "p1", nameDe: "T", surface: "normal", plates: {}, rows: grid, entities: [], links: [], exit: { to: "done" }, ...phaseOver }],
  });

  it("`swing` kommt vollständig an — Seil, Lift und Sperre", () => {
    const parsed = parsePaintLevelFile(datei({ swing: { ropePx: 48, releaseLiftPx: 4, regrabLockTicks: 20 } }));
    assert.deepEqual(parsed.phases[0]?.swing, { ropePx: 48, releaseLiftPx: 4, regrabLockTicks: 20 });
  });

  it("`bilge` kommt vollständig an — Band, Stände, Puls und die Griffe", () => {
    const bilge = {
      band: { c0: 1, c1: 10 },
      rStart: 17,
      rTop: 12,
      pulseTicks: 30,
      riseRows: 1,
      freezeTicks: 180,
      pumps: ["pumpe"],
      valve: "ventil",
    };
    const parsed = parsePaintLevelFile(datei({ bilge }));
    assert.deepEqual(parsed.phases[0]?.bilge, bilge);
  });

  it("und eine Phase ohne beides trägt beide als undefined — ch01/ch02 unberührt", () => {
    const parsed = parsePaintLevelFile(datei({}));
    assert.equal(parsed.phases[0]?.swing, undefined);
    assert.equal(parsed.phases[0]?.bilge, undefined);
  });

  it("die neue Rolle `pump.trigger` steht in der EINEN Rollenliste", () => {
    // dieselbe Zusicherung wie D4 oben: `ENTITY_ROLES` ist die Quelle, aus der
    // zod sein `z.enum` zieht — eine Rolle, die der Motor kennt und der Lader
    // nicht, käme als Parse-Fehler auf den Bildschirm des Kindes.
    assert.ok(ENTITY_ROLES.includes("pump.trigger"));
    const parsed = parsePaintLevelFile(datei({
      entities: [{ id: "pumpe", role: "pump.trigger", skin: "fb-ent-generic", c: 4, r: 17, tier: "E", params: { kind: "pump" } }],
    }));
    assert.equal(parsed.phases[0]?.entities[0]?.role, "pump.trigger");
    // ⚠ `params` ist ein OFFENES z.record — `kind` kommt hier ungeprüft durch.
    // Genau deshalb prüft das Gesetz `bilge-wiring` die Form selbst.
    assert.equal(parsed.phases[0]?.entities[0]?.params?.kind, "pump");
  });
});

// ── L0 · D1 · DIE WEITERLEITUNG DARF DIE ABFRAGE NICHT VERSCHLUCKEN ─────────
//
// Der Defekt, den erst der PERF-Vertrag gefunden hat: `/play/1/buch` leitete
// auf `/play/1/buch/ch01` um und liess `?phase=p2&perf=1` fallen. Jedes Tor
// blieb grün — die Route antwortet ja —, und alle fünf Phasen der Messung
// meldeten »die Szene wurde nie fertig geladen (Lehrer-Tür zu?)«. Dieselben
// Parameter SIND die Lehrer-Debug-Tür.
//
// Ein Test kann eine Next-Route hier nicht ausführen (sie ist server-only und
// ruft `redirect()`), also prüft dieser Fall die QUELLE: das Ziel wird aus den
// `searchParams` zusammengesetzt und nicht als Literal geschrieben. Die
// laufende Gegenprobe steht im PR (HTTP-Rauchtest gegen den echten Bau).
describe("L0 · D1 · der Weiterleitungs-Stumpf", () => {
  it("baut sein Ziel aus den searchParams, statt sie zu verlieren", async () => {
    const fs = await import("node:fs");
    const url = new URL("../app/(game)/play/[grade]/buch/page.tsx", import.meta.url);
    const src = fs.readFileSync(url, "utf8");
    assert.match(src, /URLSearchParams/, "die Abfrage wird nicht mitgenommen — genau der Defekt, den der Perf-Vertrag gefunden hat");
    assert.match(src, /searchParams/, "die Route liest die Abfrage gar nicht");
    // …und der Wächter kann sehen, was er sucht: ein Literal-Ziel ohne Abfrage
    // wäre genau die alte Zeile, und die ist hier nicht mehr.
    assert.doesNotMatch(src, /redirect\(`\/play\/\$\{grade\}\/buch\/ch01`\)/, "das Ziel ist wieder ein Literal ohne Abfrage");
  });
});

describe("L0b · D-790 · tipsTotal darf 0 sein (Ruling 2026-09-02)", () => {
  // Geprüft wird der PARSER, den auch der Lader fährt — mit den ECHTEN Bytes
  // von ch02 auf der Platte, an denen genau eine Zahl gedreht ist. Kein
  // erfundenes Level (das würde die anderen Regeln mitprüfen, die hier nicht
  // zur Debatte stehen) und keine Datei im Korpus (dort lesen die Tore).
  // L2-P1 (2026-09-03): ch02 ist kein Gerüst mehr — p1 setzt zwei Regel-Seiten.
  // Die Fixture nimmt die echten Bytes und ENTFERNT die Regel-Seiten selbst, damit
  // »0 = 0« unabhängig davon gilt, wie viele Seiten ein Kapitel gerade setzt; ein
  // Lader-Test darf keinen Kapitel-INHALT pinnen (jede Kapitel-Bahn bräche ihn).
  const roh = () => {
    const l = JSON.parse(JSON.stringify(loadPaintLevel(STORY, "ch02")));
    for (const ph of l.phases) ph.entities = ph.entities.filter((e: { role: string }) => e.role !== "tip");
    return l;
  };

  it("ch02 deklariert genau so viele Regel-Seiten, wie es setzt — die Prämisse »deklariert = platziert«", () => {
    // die Prämisse des Rulings: `tip-honesty` verlangt nur »deklariert =
    // platziert«; 0 = 0 ist genauso gesetzestreu wie 2 = 2.
    const ch02 = loadPaintLevel(STORY, "ch02");
    const tips = ch02.phases.flatMap((p) => p.entities.filter((e) => e.role === "tip"));
    assert.equal(ch02.tipsTotal ?? 0, tips.length);
  });

  it("ein Kapitel mit `tipsTotal: 0` lädt", () => {
    const level = parsePaintLevelFile({ ...roh(), tipsTotal: 0 });
    assert.equal(level.tipsTotal, 0);
  });

  it("…und `-1` wird weiterhin abgewiesen — die 0 ist erlaubt, Unsinn nicht", () => {
    assert.throws(() => parsePaintLevelFile({ ...roh(), tipsTotal: -1 }));
  });

  it("das ausgelieferte ch01 bleibt unberührt", () => {
    assert.equal(loadPaintLevel(STORY, "ch01").tipsTotal, 5);
  });
});
