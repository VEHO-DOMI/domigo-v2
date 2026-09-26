/**
 * dach-123 · Tor 1 — der reine Abgleich.
 *
 * Die teuerste Frage dieses Auftrags ist nicht, ob die vier Zeilen-Arten
 * entstehen, sondern ob je über einen NAMEN abgeglichen wird. Zwei Kinder
 * heissen gleich; ein Platzhalter aus der Zeit vor Lauter Einser trägt denselben
 * Namen wie das Kind auf der Schulliste. Wer da zusammenführt, führt zwei
 * Menschen zusammen. Darum haben die Namens-Proben hier Zähne: sie prüfen
 * wirklich dieselbe Zeichenkette und lassen sich nicht durch eine Abkürzung
 * erfüllen.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { listenName, mergeKlassenliste, type ListenKind, type LokaleZeile } from "./klassenliste-merge.ts";

const lokal = (id: string, givenName: string | null, displayName: string, claimed = true): LokaleZeile => ({
  id,
  givenName,
  displayName,
  claimed,
});
const kind = (last: string, first: string, status: ListenKind["status"], app_user_id: string | null = null, platz: number | null = null): ListenKind => ({
  platz,
  last_name: last,
  first_name: first,
  status,
  app_user_id,
});

describe("die vier Zeilen-Arten", () => {
  it("entstehen je aus ihrem Fall", () => {
    const { rows } = mergeKlassenliste(
      [lokal("u-1", "Anna", "Fuchs"), lokal("u-alt", "Bertl", "Bertl", false)],
      [
        kind("Weiss", "Anna", "angekommen", "u-1", 1),
        kind("Gruen", "Tim", "offen", null, 2),
        kind("Blau", "Mia", "name_gewaehlt", null, 3),
        kind("Rot", "Jo", "angekommen", "u-woanders", 4),
      ],
    );
    assert.deepEqual(
      rows.map((z) => z.art),
      ["joined", "not-joined", "not-joined", "joined-elsewhere", "local-only"],
    );
  });

  it("gibt einer joined-Zeile die lokale Zeile UND den Listen-Namen, und lässt givenName in Ruhe", () => {
    const { rows } = mergeKlassenliste([lokal("u-1", "Anna", "Fuchs")], [kind("Weiss", "Anna", "angekommen", "u-1", 7)]);
    const z = rows[0]!;
    assert.equal(z.art, "joined");
    if (z.art !== "joined") return;
    assert.equal(z.kontoName, "WEISS Anna");
    assert.equal(z.givenName, "Anna", "der Listen-Name darf nie in givenName landen");
    assert.equal(z.displayName, "Fuchs");
    assert.equal(z.claimed, true);
    assert.equal(z.platz, 7);
  });

  it("gibt einer local-only-Zeile kontoName: null", () => {
    const { rows } = mergeKlassenliste([lokal("u-9", null, "Igel")], []);
    const z = rows[0]!;
    assert.equal(z.art, "local-only");
    if (z.art !== "local-only") return;
    assert.equal(z.kontoName, null);
    assert.equal(z.givenName, null);
  });
});

describe("abgeglichen wird NUR über die Kennung", () => {
  it("lässt zwei Kinder mit demselben Namen zwei Zeilen bleiben", () => {
    const { rows, joinedCount, listCount } = mergeKlassenliste(
      [lokal("u-1", "Anna", "Fuchs"), lokal("u-2", "Anna", "Dachs")],
      [kind("Weiss", "Anna", "angekommen", "u-1"), kind("Weiss", "Anna", "angekommen", "u-2")],
    );
    assert.equal(rows.length, 2);
    assert.deepEqual(rows.map((z) => z.art), ["joined", "joined"]);
    assert.equal(joinedCount, 2);
    assert.equal(listCount, 2);
    const ids = rows.flatMap((z) => (z.art === "joined" ? [z.id] : []));
    assert.deepEqual(ids, ["u-1", "u-2"], "zwei Zeilen, zwei verschiedene Kennungen");
  });

  it("macht aus GLEICHEM Namen bei anderer Kennung KEIN joined", () => {
    const { rows, joinedCount } = mergeKlassenliste(
      [lokal("u-lokal", "Anna", "Anna")],
      [kind("Anna", "Anna", "angekommen", "u-fremd")],
    );
    assert.equal(joinedCount, 0);
    assert.deepEqual(rows.map((z) => z.art), ["joined-elsewhere", "local-only"]);
    // Zähne: die Namen sind hier wirklich Zeichen für Zeichen dieselben, sonst
    // würde dieser Fall auch bei einem Namens-Abgleich durchgehen.
    const listen = rows.find((z) => z.art === "joined-elsewhere");
    assert.equal(listen && listen.art === "joined-elsewhere" ? listen.kontoName : "", "ANNA Anna");
    assert.equal(listenName({ last_name: "Anna", first_name: "Anna" }), "ANNA Anna");
  });

  it("macht aus »angekommen« mit fremder Kennung joined-elsewhere", () => {
    const { rows } = mergeKlassenliste([lokal("u-1", "Anna", "Fuchs")], [kind("Rot", "Jo", "angekommen", "u-woanders")]);
    assert.deepEqual(rows.map((z) => z.art), ["joined-elsewhere", "local-only"]);
  });

  it("macht aus »angekommen« OHNE Kennung ebenfalls joined-elsewhere, nie joined", () => {
    const { rows, joinedCount } = mergeKlassenliste([lokal("u-1", "Anna", "Fuchs")], [kind("Rot", "Jo", "angekommen", null)]);
    assert.equal(joinedCount, 0);
    assert.equal(rows[0]!.art, "joined-elsewhere");
  });

  it("lässt EIN Kind zweimal dastehen, wenn ein alter Platzhalter denselben Namen trägt (E9)", () => {
    const { rows } = mergeKlassenliste(
      [lokal("u-platzhalter", "WEISS Anna", "WEISS Anna", false)],
      [kind("Weiss", "Anna", "offen", null, 1)],
    );
    assert.equal(rows.length, 2, "zusammenführen hiesse über den Namen abgleichen — verboten");
    assert.deepEqual(rows.map((z) => z.art), ["not-joined", "local-only"]);
    const oben = rows[0]!;
    const unten = rows[1]!;
    assert.equal(oben.art === "not-joined" ? oben.kontoName : "", "WEISS Anna");
    assert.equal(unten.art === "local-only" ? unten.givenName : "", "WEISS Anna");
  });
});

describe("Reihenfolge und Zähler", () => {
  it("zeigt die Liste in IHRER Reihenfolge, danach die Zeilen, die nur DomiGo kennt", () => {
    const { rows } = mergeKlassenliste(
      [lokal("u-b", "B", "B"), lokal("u-a", "A", "A"), lokal("u-x", "X", "X")],
      [kind("Zeta", "Zoe", "angekommen", "u-a", 1), kind("Alpha", "Ali", "offen", null, 2)],
    );
    assert.deepEqual(
      rows.map((z) => (z.art === "joined" || z.art === "local-only" ? z.id : z.kontoName)),
      ["u-a", "ALPHA Ali", "u-b", "u-x"],
    );
  });

  it("zählt joinedCount nur für joined und listCount als Länge der Liste", () => {
    const { joinedCount, listCount } = mergeKlassenliste(
      [lokal("u-1", "A", "A"), lokal("u-2", "B", "B")],
      [kind("W", "A", "angekommen", "u-1"), kind("G", "T", "offen"), kind("R", "J", "angekommen", "u-fremd")],
    );
    assert.equal(joinedCount, 1);
    assert.equal(listCount, 3);
  });

  it("baut eine Tabelle auch ganz OHNE lokale Zeile", () => {
    const kinder = [kind("A", "a", "offen"), kind("B", "b", "offen"), kind("C", "c", "name_gewaehlt")];
    const { rows, joinedCount, listCount } = mergeKlassenliste([], kinder);
    assert.equal(rows.length, kinder.length);
    assert.equal(joinedCount, 0);
    assert.equal(listCount, 3);
  });

  it("schreibt »NACHNAME Vorname«, trimmt, und lässt leere Teile weg", () => {
    assert.equal(listenName({ last_name: " weiss ", first_name: " Anna " }), "WEISS Anna");
    assert.equal(listenName({ last_name: "Weiss", first_name: "" }), "WEISS");
    assert.equal(listenName({ last_name: "", first_name: "Anna" }), "Anna");
    assert.equal(listenName({ last_name: "straße", first_name: "a" }), "STRASSE a");
  });
});

describe("Reinheit", () => {
  it("holt sich nichts von aussen — der ROHE Quelltext trägt die zwei verbotenen Wörter nirgends", () => {
    const quelle = readFileSync(new URL("./klassenliste-merge.ts", import.meta.url), "utf8");
    assert.doesNotMatch(quelle, /import/, "der Abgleich muss ohne fremde Datei prüfbar bleiben");
    assert.doesNotMatch(quelle, /require\(/, "der Abgleich muss ohne fremde Datei prüfbar bleiben");
  });
});
