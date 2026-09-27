/**
 * BRAND-2 · srdp-069 · werkzeugeFuer, Rolle für Rolle. Ohne DB, ohne React (node --test,
 * wie lib/levels.test.ts — apps/web hat kein vitest).
 *
 * Die erwarteten id-Folgen sind aus der Quelle abgelesen (lauter-einser-werkzeuge.json,
 * Fassung 4 vom 2026-09-19: fünf Einträge, nur »veho« ist allein für Lehrkräfte) und hier als
 * Text festgeschrieben — nicht aus der Datei zurückgerechnet, sonst prüfte der Test sich selbst.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CALLBACK_PFAD } from "./konto/basis.ts";
import { EIGENES_WERKZEUG, istSprung, MENUE_TITEL, werkzeugeFuer, zeileUeberDemNamen } from "./le-werkzeuge.ts";

const ids = (rolle: "student" | "teacher" | null) => werkzeugeFuer(rolle).map((w) => w.id).join(",");

describe("werkzeugeFuer", () => {
  it("Schüler sehen vier Einträge, ohne das Lehrer-Notizbuch", () => {
    assert.equal(ids("student"), "eng-us,eng-os,pup,konto");
  });
  it("Lehrkräfte sehen alle fünf, in Datei-Reihenfolge", () => {
    assert.equal(ids("teacher"), "eng-us,eng-os,pup,veho,konto");
  });
  it("Gäste sehen, was Schüler sehen", () => {
    assert.equal(ids(null), ids("student"));
  });
});

describe("Eintragsregeln", () => {
  it("DomiGos eigener Eintrag ist eng-us und nie ein Sprung", () => {
    assert.equal(EIGENES_WERKZEUG, "eng-us");
    const own = werkzeugeFuer("teacher").find((w) => w.id === EIGENES_WERKZEUG);
    assert.ok(own, "eng-us fehlt in der Werkzeug-Liste");
    assert.equal(istSprung(own), false);
  });
  it("Titel aus der Liste, seit Fassung 3 (Kokis Namen 18.09.)", () => {
    const titel = werkzeugeFuer("teacher").map((w) => w.titel);
    assert.deepEqual(titel, ["DomiGo", "DomiLingo", "LautGedacht", "Lehrer-Notizbuch VEHO", "Mein Bereich"]);
  });
  it("nur »live« wird ein Link — »kommt später« und »zieht um« nie", () => {
    const sprung = werkzeugeFuer("teacher").filter(istSprung).map((w) => w.id);
    // Seit Fassung 3: veho und konto stehen auf »live«, pup bleibt »kommt später«.
    assert.deepEqual(sprung, ["eng-os", "veho", "konto"]);
    for (const w of werkzeugeFuer("teacher")) {
      if (w.stand !== "live") assert.equal(istSprung(w), false, `${w.id} (${w.stand}) darf kein Link sein`);
    }
  });
  it("Zeile über dem Namen aus »anzeige« (Fassung 6, dach-140) — ohne Fach keine Zeile", () => {
    const zeilen = Object.fromEntries(werkzeugeFuer("teacher").map((w) => [w.id, zeileUeberDemNamen(w)]));
    assert.deepEqual(zeilen, {
      "eng-us": "Englisch · Unterstufe",
      "eng-os": "Englisch · Oberstufe",
      pup: "Psychologie und Philosophie",
      veho: "",
      konto: "",
    });
  });
  it("für LautGedacht (pup) erscheint keine Stufe (Kokis Entscheid pup-016a)", () => {
    const pup = werkzeugeFuer("student").find((w) => w.id === "pup");
    assert.ok(pup, "pup fehlt in der Werkzeug-Liste");
    assert.doesNotMatch(zeileUeberDemNamen(pup), /Oberstufe|Unterstufe/);
  });
});

describe("Fassung 4 (19.09., dach-063)", () => {
  it("das Menü heißt, wie die Datei es nennt: »Bereiche«", () => {
    assert.equal(MENUE_TITEL, "Bereiche");
  });
  it("DomiGo meldet über konto an: konto_app »go«, Rückkehr = eigene Adresse + die Rückkehr-Route", () => {
    const own = werkzeugeFuer("teacher").find((w) => w.id === EIGENES_WERKZEUG);
    assert.ok(own);
    assert.equal(own.konto_app, "go");
    assert.equal(own.konto_return, `${own.adresse}${CALLBACK_PFAD}`);
  });
  it("Anmelde-Apps je Eintrag, wie in der Quelle", () => {
    const apps = Object.fromEntries(werkzeugeFuer("teacher").map((w) => [w.id, w.konto_app]));
    assert.deepEqual(apps, { "eng-us": "go", "eng-os": "srdp", pup: null, veho: "tracker", konto: null });
  });
  it("Kopfzeilen-Wortlaut aus der Datei, nicht gebaut", () => {
    const own = werkzeugeFuer("teacher").find((w) => w.id === EIGENES_WERKZEUG);
    assert.equal(own?.anzeige, "Englisch · Unterstufe — DomiGo");
  });
});
