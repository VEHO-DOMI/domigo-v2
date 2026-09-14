/**
 * BRAND-2 · srdp-069 · werkzeugeFuer, Rolle für Rolle. Ohne DB, ohne React (node --test,
 * wie lib/levels.test.ts — apps/web hat kein vitest).
 *
 * Die erwarteten id-Folgen sind aus der Quelle abgelesen (lauter-einser-werkzeuge.json,
 * Fassung 2026-09-13: fünf Einträge, nur »veho« ist allein für Lehrkräfte) und hier als
 * Text festgeschrieben — nicht aus der Datei zurückgerechnet, sonst prüfte der Test sich selbst.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EIGENES_WERKZEUG, istSprung, kategorieLabel, werkzeugeFuer } from "./le-werkzeuge.ts";

const ids = (rolle: "student" | "teacher" | null) => werkzeugeFuer(rolle).map((w) => w.id).join(",");

describe("werkzeugeFuer", () => {
  it("Schüler sehen vier Einträge, ohne den Lehrer-Raum", () => {
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
  it("nur »live« wird ein Link — »kommt später« und »zieht um« nie", () => {
    const sprung = werkzeugeFuer("teacher").filter(istSprung).map((w) => w.id);
    assert.deepEqual(sprung, ["eng-os"]);
    for (const w of werkzeugeFuer("teacher")) {
      if (w.stand !== "live") assert.equal(istSprung(w), false, `${w.id} (${w.stand}) darf kein Link sein`);
    }
  });
  it("Kategorie-Label: »Fach · Stufe«, bei leerer Stufe nur das Fach", () => {
    const byId = Object.fromEntries(werkzeugeFuer("teacher").map((w) => [w.id, w]));
    assert.equal(kategorieLabel(byId["eng-us"]), "Englisch · Unterstufe");
    assert.equal(kategorieLabel(byId["veho"]), "Lehrkräfte");
  });
});
