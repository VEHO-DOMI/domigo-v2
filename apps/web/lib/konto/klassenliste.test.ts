/**
 * dach-123 · Tor 2 — der Abruf der Klassenliste.
 *
 * Drei Versprechen, die nur hier prüfbar sind:
 *   1. E1 — gefragt wird mit der Kennung der Person, die SCHAUT. Ein Tor, das
 *      nur die Schreibweise des Aufrufs prüft, sähe einen vertauschten Körper
 *      nicht; darum wird hier das VERHALTEN gemessen, am aufgezeichneten Körper.
 *   2. Positivliste — was konto sonst noch schickt, kommt nicht durch. Der
 *      Doppelgänger schickt mit Absicht zwei überzählige Felder.
 *   3. E6 — kein Speichern, kein Protokoll: `cache: "no-store"`, und in KEINEM
 *      Zweig eine Konsolen-Zeile. Der Spion läuft über alle Fälle.
 */
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { neuerStub, type StubKonto } from "../../scripts/lib/konto-stub.ts";
import { holeKlassenliste } from "./claims.ts";

const PFAD = "/api/app-roster";

/** Ein Kind, so wie konto es schickt — mit zwei Feldern, die DomiGo nie sehen darf. */
const rohesKind = (extra: Record<string, unknown> = {}) => ({
  platz: 3,
  last_name: "Weiss",
  first_name: "Anna",
  status: "angekommen",
  app_user_id: "u-1",
  nick: "Fuchs",
  account_id: "acc_geheim",
  ...extra,
});

describe("holeKlassenliste gegen den Doppelgaenger", () => {
  let stub: StubKonto;
  const echtesFetch = globalThis.fetch;
  const echteKonsole = { log: console.log, info: console.info, warn: console.warn, error: console.error };
  let konsole = 0;

  beforeEach(() => {
    stub = neuerStub();
    process.env.KONTO_APP_SECRET = stub.secret;
    process.env.KONTO_BASE_URL = "https://konto.invalid";
    globalThis.fetch = stub.fetch;
    konsole = 0;
    const zaehle = () => { konsole += 1; };
    console.log = zaehle;
    console.info = zaehle;
    console.warn = zaehle;
    console.error = zaehle;
  });
  afterEach(() => {
    console.log = echteKonsole.log;
    console.info = echteKonsole.info;
    console.warn = echteKonsole.warn;
    console.error = echteKonsole.error;
    globalThis.fetch = echtesFetch;
    delete process.env.KONTO_APP_SECRET;
    delete process.env.KONTO_BASE_URL;
    // Gilt fuer JEDEN Fall oben, auch die Fehlerzweige: diese eine Funktion
    // schreibt nichts ins Protokoll, damit kein Name je in eine Zeile geraet.
    assert.equal(konsole, 0, "holeKlassenliste darf in keinem Zweig eine Konsolen-Zeile schreiben");
  });

  it("nimmt bei 200 genau die fünf Felder je Kind — überzähliges kommt nicht durch", async () => {
    stub.rosterAntwort = { status: 200, body: { namen_gesperrt: false, kinder: [rohesKind()] } };
    const e = await holeKlassenliste({ userId: "lehrkraft-A" }, "klasse-1");
    assert.equal(e.ok, true);
    if (!e.ok) return;
    assert.equal(e.namenGesperrt, false);
    assert.equal(e.kinder.length, 1);
    assert.deepEqual(Object.keys(e.kinder[0]!).sort(), ["app_user_id", "first_name", "last_name", "platz", "status"]);
    assert.deepEqual(e.kinder[0], { platz: 3, last_name: "Weiss", first_name: "Anna", status: "angekommen", app_user_id: "u-1" });
  });

  it("meldet die Namens-Sperre der Schule", async () => {
    stub.rosterAntwort = { status: 200, body: { namen_gesperrt: true, kinder: [rohesKind({ last_name: "", first_name: "" })] } };
    const e = await holeKlassenliste({ userId: "lehrkraft-A" }, "klasse-1");
    assert.equal(e.ok && e.namenGesperrt, true);
    assert.equal(e.ok && e.kinder.length, 1, "die ANZAHL stimmt auch ohne Namen");
  });

  it("lässt ein Kind mit kaputtem Status weg, statt es halb zu bauen", async () => {
    stub.rosterAntwort = {
      status: 200,
      body: { namen_gesperrt: false, kinder: [rohesKind({ status: "irgendwas" }), rohesKind({ status: "offen", app_user_id: null }), { first_name: "Ohne", status: "offen" }] },
    };
    const e = await holeKlassenliste({ userId: "lehrkraft-A" }, "klasse-1");
    assert.equal(e.ok && e.kinder.length, 1, "kaputter Status und fehlender Nachname fallen weg");
    assert.equal(e.ok && e.kinder[0]!.status, "offen");
  });

  it("macht aus kaputten Einzelfeldern null statt Unsinn", async () => {
    stub.rosterAntwort = {
      status: 200,
      body: { namen_gesperrt: false, kinder: [rohesKind({ platz: 2.5, app_user_id: "" })] },
    };
    const e = await holeKlassenliste({ userId: "lehrkraft-A" }, "klasse-1");
    assert.equal(e.ok && e.kinder[0]!.platz, null);
    assert.equal(e.ok && e.kinder[0]!.app_user_id, null);
  });

  it("nennt jeden Ablehnungsgrund beim Namen und wirft nie", async () => {
    for (const [status, grund] of [
      [404, "unknown-class"],
      [403, "refused"],
      [500, "unreachable"],
      [204, "unreachable"],
    ] as const) {
      stub.rosterAntwort = { status, body: { error: "x" } };
      const e = await holeKlassenliste({ userId: "lehrkraft-A" }, "klasse-1");
      assert.equal(e.ok, false);
      assert.equal(e.ok === false && e.grund, grund, `Status ${status}`);
    }
  });

  it("nennt ein falsches Geheimnis »refused« (401 des Doppelgaengers)", async () => {
    process.env.KONTO_APP_SECRET = "ein-anderes-geheimnis-mit-genug-zeichen";
    const e = await holeKlassenliste({ userId: "lehrkraft-A" }, "klasse-1");
    assert.equal(e.ok === false && e.grund, "refused");
  });

  it("nennt kaputtes JSON »unreachable«", async () => {
    stub.rosterAntwort = { status: 200, roh: "{kein json" };
    const e = await holeKlassenliste({ userId: "lehrkraft-A" }, "klasse-1");
    assert.equal(e.ok === false && e.grund, "unreachable");
  });

  it("nennt einen Netzfehler »unreachable«", async () => {
    globalThis.fetch = (() => Promise.reject(new Error("weg"))) as typeof fetch;
    const e = await holeKlassenliste({ userId: "lehrkraft-A" }, "klasse-1");
    assert.equal(e.ok === false && e.grund, "unreachable");
  });

  it("fragt OHNE Geheimnis gar nicht erst — null Aufrufe", async () => {
    delete process.env.KONTO_APP_SECRET;
    const e = await holeKlassenliste({ userId: "lehrkraft-A" }, "klasse-1");
    assert.equal(e.ok === false && e.grund, "unreachable");
    assert.equal(stub.rufe.length, 0);
  });

  it("fragt ohne Kennung gar nicht erst — null Aufrufe", async () => {
    assert.equal((await holeKlassenliste({ userId: "" }, "klasse-1")).ok, false);
    assert.equal((await holeKlassenliste({ userId: "lehrkraft-A" }, "")).ok, false);
    assert.equal(stub.rufe.length, 0);
  });

  it("E1 · fragt mit der Kennung der Person, die SCHAUT — gemessen am Körper", async () => {
    await holeKlassenliste({ userId: "lehrkraft-A" }, "klasse-1");
    const ruf = stub.rufe.filter((r) => r.pfad === PFAD);
    assert.equal(ruf.length, 1);
    assert.deepEqual(ruf[0]!.koerper, { app_class_id: "klasse-1", app_user_id: "lehrkraft-A" });
  });

  it("fragt per POST, mit genau zwei Schlüsseln, ohne Kennung in der Adresse, ohne Zwischenspeicher", async () => {
    let adresse = "";
    const gemerkt = stub.fetch;
    globalThis.fetch = ((eingabe: RequestInfo | URL, init?: RequestInit) => {
      adresse = typeof eingabe === "string" ? eingabe : eingabe instanceof URL ? eingabe.href : eingabe.url;
      return gemerkt(eingabe, init);
    }) as typeof fetch;

    await holeKlassenliste({ userId: "lehrkraft-A" }, "klasse-1");
    const ruf = stub.rufe.find((r) => r.pfad === PFAD)!;
    assert.equal(ruf.methode, "POST", "GET stellte die Kennungen in jedes Zugriffs-Protokoll");
    assert.equal(ruf.cache, "no-store");
    assert.deepEqual(Object.keys(ruf.koerper as object).sort(), ["app_class_id", "app_user_id"]);
    assert.ok(adresse.endsWith(PFAD), `die Adresse trägt nichts ausser dem Pfad: ${adresse}`);
    assert.doesNotMatch(adresse, /klasse-1|lehrkraft-A/);
  });
});
