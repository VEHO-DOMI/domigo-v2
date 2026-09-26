/**
 * dach-123 · Tor 3 — die feste Gestalt, die E1 trägt.
 *
 * E1 (gefragt wird mit der Kennung der Person, die SCHAUT) ist auf den beiden
 * Lehrer-Seiten nur in EINEM Fall überhaupt sichtbar: wenn der Großmeister in
 * eine fremde Klasse sieht. Überall sonst sind die zwei Kennungen gleich, ein
 * Fehler bliebe also monatelang unbemerkt. Darum wird der Aufruf hier nicht
 * »ungefähr« geprüft, sondern Zeichen für Zeichen: genau einmal je Seite, und
 * nur in der einen Gestalt. Wer davon abweichen muss, ändert dieses Tor
 * SICHTBAR und begründet es — das ist der Sinn der Strenge.
 *
 * Dazu die Versprechen, die kein Bild zeigt: nichts im Browser-Speicher, kein
 * Listen-Name in einem Formular, kein Zwischenspeicher im Router.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const lies = (rel: string): string => readFileSync(new URL(rel, import.meta.url), "utf8");

const ROSTER_SEITE = "../../app/admin/classes/[id]/roster/page.tsx";
const FORTSCHRITT_SEITE = "../../app/admin/classes/[id]/page.tsx";
const MANAGER = "../../app/admin/classes/[id]/roster/RosterManager.tsx";
const SEITEN = [ROSTER_SEITE, FORTSCHRITT_SEITE];

/**
 * Der Körper einer `const name = (…) => { … }`-Funktion, über zählende Klammern.
 * Findet der Wächter sie nicht, ist das Tor ROT — ein Tor, das ins Leere greift,
 * wäre grün, ohne etwas zu prüfen.
 */
function koerperVon(quelle: string, name: string): string {
  const start = quelle.indexOf(`const ${name} = `);
  assert.notEqual(start, -1, `${name} nicht gefunden — das Tor griffe ins Leere`);
  const auf = quelle.indexOf("{", quelle.indexOf("=>", start));
  assert.notEqual(auf, -1, `${name}: kein Körper gefunden`);
  let tiefe = 0;
  for (let i = auf; i < quelle.length; i += 1) {
    if (quelle[i] === "{") tiefe += 1;
    else if (quelle[i] === "}") {
      tiefe -= 1;
      if (tiefe === 0) return quelle.slice(auf, i + 1);
    }
  }
  throw new Error(`${name}: Körper nicht geschlossen`);
}

describe("E1 · der Abruf hat auf beiden Seiten EINE feste Gestalt", () => {
  for (const seite of SEITEN) {
    it(`${seite} ruft genau einmal, und nur als holeKlassenliste(teacher, cls.id)`, () => {
      const q = lies(seite);
      assert.equal((q.match(/holeKlassenliste\(/g) ?? []).length, 1, "genau ein Aufruf je Seite");
      assert.equal(
        (q.match(/holeKlassenliste\(\s*teacher\s*,\s*cls\.id\s*\)/g) ?? []).length,
        1,
        "jede andere Schreibweise — Zwischenvariable, Objekt-Literal, authorizingTeacherId — ist hier ein Fehler",
      );
      assert.equal(
        (q.match(/const teacher = await getTeacherForPage\(\)/g) ?? []).length,
        1,
        "genau eine Quelle für `teacher` auf der Seite",
      );
    });
  }

  it("die Fortschritts-Seite packt den Abruf NICHT in lies(), das protokollieren würde", () => {
    assert.doesNotMatch(lies(FORTSCHRITT_SEITE), /lies\(\s*holeKlassenliste/);
  });
});

describe("nichts gespeichert, nichts zwischengelagert", () => {
  for (const seite of SEITEN) {
    it(`${seite} bleibt force-dynamic`, () => {
      assert.match(lies(seite), /export const dynamic = "force-dynamic"/);
    });
  }

  for (const datei of [...SEITEN, MANAGER]) {
    it(`${datei} fasst keinen Browser-Speicher an`, () => {
      const q = lies(datei);
      assert.doesNotMatch(q, /localStorage/);
      assert.doesNotMatch(q, /sessionStorage/);
    });
  }

  it("next.config.ts verlängert das Router-Gedächtnis nicht (kein staleTimes)", () => {
    assert.doesNotMatch(lies("../../next.config.ts"), /staleTimes/);
  });
});

describe("der Listen-Name fliesst nirgends zurück (E4)", () => {
  it("weder startRename noch remove kennen kontoName", () => {
    const q = lies(MANAGER);
    const rename = koerperVon(q, "startRename");
    const entferne = koerperVon(q, "remove");
    // Wächter: die zwei Körper sind wirklich die gemeinten.
    assert.match(rename, /setEditName\(/);
    assert.match(entferne, /window\.confirm\(/);
    assert.doesNotMatch(rename, /kontoName/, "ein Klick auf Save schriebe den Schullisten-Namen dauerhaft nach DomiGo");
    assert.doesNotMatch(entferne, /kontoName/);
  });
});
