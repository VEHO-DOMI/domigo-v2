/**
 * dach-018 · test:konto-export — WAS am Umstiegstag hinausgeht, und was nicht.
 *
 * Der Lauf selbst passiert einmal, an einem Schulmorgen, gegen den echten
 * Konto-Dienst. Prüfbar ist er trotzdem, weil die Abbildung pur ist: was
 * `baueRufe` zurückgibt, IST der Körper, der über die Leitung geht.
 *
 * Zwei Sorten von Aussagen stehen hier:
 *   · die Reihenfolge — Lehrgruppen vor Konten, Lehrkräfte vor Kindern. Sie ist
 *     kein Geschmack (SPEC §10 E3): die Klassen-Brücke wird aus der Antwort auf
 *     den ersten Ruf geschrieben, und eine Mitgliedschaft ohne Brücke findet
 *     nichts.
 *   · was NIE mitfährt — keine E-Mail (konto antwortet darauf mit 400), kein
 *     Test-Kind der Ops-Klasse (konto legt seine eigenen an, I-7), kein Feld,
 *     das die Positivliste nicht kennt.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { baueRufe, waehleAus, _argsFuerTest } from "../../scripts/konto-export.ts";

const OPS = "75YAHV";

const klassen = [
  { id: "cls-a", name: "2B", inviteCode: "ABC123", grade: 2, teacherId: "t-1", archivedAt: null },
  { id: "cls-alt", name: "1A", inviteCode: "OLD999", grade: 1, teacherId: "t-1", archivedAt: "2026-07-01T00:00:00Z" },
  { id: "cls-ops", name: "TEST P", inviteCode: OPS, grade: 2, teacherId: "t-1", archivedAt: null },
];

const leute = [
  { id: "t-1", displayName: "VEHO", role: "teacher", classId: null, pinHash: "$2b$12$lehrkraft" },
  { id: "k-1", displayName: "Fuchs", role: "student", classId: "cls-a", pinHash: "$2b$12$kind1" },
  { id: "k-2", displayName: "Reh", role: "student", classId: "cls-alt", pinHash: "$2b$12$kind2" },
  { id: "k-ops", displayName: "Testkind", role: "student", classId: "cls-ops", pinHash: "$2b$12$ops" },
  { id: "k-frei", displayName: "Ohne", role: "student", classId: null, pinHash: "$2b$12$frei" },
];

const args = _argsFuerTest(["--dry-run", "--kuerzel", "VEHO=t-1"]);

describe("wer mitfährt", () => {
  it("die Ops-Klasse und ihr Testkind bleiben hier — konto legt seine eigenen an", () => {
    const { echteKlassen, kinder } = waehleAus(klassen, leute, OPS);
    assert.deepEqual(echteKlassen.map((k) => k.id), ["cls-a", "cls-alt"]);
    assert.ok(!kinder.some((s) => s.id === "k-ops"), "das Testkind der Ops-Klasse faehrt mit");
  });

  it("ein Kind ohne Klasse faehrt nicht mit — es haette drueben keine Lehrgruppe", () => {
    const { kinder } = waehleAus(klassen, leute, OPS);
    assert.ok(!kinder.some((s) => s.id === "k-frei"));
  });

  it("eine archivierte Klasse faehrt MIT — sie wird drueben als archiviert angelegt", () => {
    const { echteKlassen } = waehleAus(klassen, leute, OPS);
    const alt = echteKlassen.find((k) => k.id === "cls-alt");
    assert.ok(alt, "die archivierte Klasse fehlt");
    assert.ok(alt.archivedAt, "sie verliert ihr Archiv-Datum");
  });
});

describe("was hinausgeht", () => {
  const { echteKlassen, lehrkraefte, kinder } = waehleAus(klassen, leute, OPS);
  const rufe = baueRufe(args, echteKlassen, lehrkraefte, kinder);

  it("die Reihenfolge ist Lehrgruppen → Lehrkräfte → Kinder", () => {
    assert.deepEqual(rufe.map((r) => r.pfad), [
      "/api/import/lehrgruppen",
      "/api/import/konten",
      "/api/import/konten",
    ]);
    const lehrer = rufe[1]!.koerper.konten as { role: string }[];
    const kids = rufe[2]!.koerper.konten as { role: string }[];
    assert.ok(lehrer.every((x) => x.role === "teacher"));
    assert.ok(kids.every((x) => x.role === "student"));
  });

  it("keine E-Mail, kein is_test, kein Feld ausserhalb der Positivliste", () => {
    const alles = JSON.stringify(rufe);
    assert.doesNotMatch(alles, /"email"/);
    assert.doesNotMatch(alles, /"is_test"/);
    assert.doesNotMatch(alles, /"real_name"/);
    assert.doesNotMatch(alles, /"avatar/);
    const erlaubtKonto = new Set(["app_user_id", "nick", "credential_hash", "role", "app_class_id", "kuerzel"]);
    for (const ruf of rufe.slice(1)) {
      for (const konto of ruf.koerper.konten as Record<string, unknown>[]) {
        for (const schluessel of Object.keys(konto)) {
          assert.ok(erlaubtKonto.has(schluessel), `unbekanntes Feld »${schluessel}« faehrt mit`);
        }
      }
    }
  });

  it("der PIN-Hash reist wie gespeichert — nie eine PIN", () => {
    const kids = rufe[2]!.koerper.konten as { credential_hash: string }[];
    assert.equal(kids[0]!.credential_hash, "$2b$12$kind1");
  });

  it("jede Lehrkraft traegt ihr Kürzel — ohne es antwortet konto mit 422", () => {
    const lehrer = rufe[1]!.koerper.konten as { kuerzel?: string }[];
    assert.equal(lehrer[0]!.kuerzel, "VEHO");
  });

  it("jede Lehrgruppe traegt Fach, Klassencode und Jahrgang", () => {
    const gruppen = rufe[0]!.koerper.lehrgruppen as Record<string, unknown>[];
    assert.equal(gruppen[0]!.fach, "Englisch");
    assert.equal(gruppen[0]!.join_code, "ABC123");
    assert.equal(gruppen[0]!.jahrgang, 2);
    assert.equal(gruppen[0]!.app_class_id, "cls-a");
  });
});
