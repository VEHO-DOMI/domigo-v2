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
const { CHAPTER_ID, chapterHasTasks, listPaintChapters, loadPaintLevel } = await import("./paint-content.ts");

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
    assert.equal(chapterHasTasks(STORY, "ch02"), false);
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
