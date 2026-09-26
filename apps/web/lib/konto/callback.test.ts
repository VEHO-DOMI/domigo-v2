/**
 * welle-076 · DIE RÜCKKEHR MIT ZIEL — und alles, was kein Ziel sein darf.
 *
 * Ein Kind, das auf der Startseite »Jahrgang 2« anklickt und noch nicht
 * angemeldet ist, soll nach konto auf /play/2 landen, nicht auf /home. Die
 * Gefahr daran ist eine einzige: dass `from` jemanden auf eine FREMDE Seite
 * schickt. Deshalb prüft diese Datei zuerst die Absagen und erst dann den Weg.
 *
 * Die Route selbst lädt unter `node --test` nicht (next-auth, siehe
 * lib/konto/callback.ts). Die Verdrahtung wird deshalb am Quelltext gelesen —
 * derselbe Griff wie in routen.test.ts.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { devDurchlass } from "../dev-durchlass.ts";
import { ZIEL_ABGEWIESEN, ZIEL_NACH_ANMELDUNG, zielAusFrom, zielNachRueckkehr } from "./callback.ts";

const lies = (rel: string) => fs.readFileSync(path.resolve(import.meta.dirname, rel), "utf8");

describe("zielAusFrom — nur ein Jahrgang des Spiels, sonst nichts", () => {
  it("DURCHLASSEN: /play/1 bis /play/4 kommen genau so zurück", () => {
    for (const n of [1, 2, 3, 4]) assert.equal(zielAusFrom(`/play/${n}`), `/play/${n}`);
  });

  it("ABWEISEN: jede Form eines fremden Hosts", () => {
    for (const boese of [
      "//evil.example",
      "//evil.example/play/1",
      "/\\evil.example",
      "\\\\evil.example",
      "https://evil.example/play/1",
      "http:/play/1",
      "javascript:alert(1)",
      " /play/1",
      "%2F%2Fevil.example",
    ]) {
      assert.equal(zielAusFrom(boese), null, boese);
      assert.equal(zielNachRueckkehr(true, boese), ZIEL_NACH_ANMELDUNG, boese);
    }
  });

  it("ABWEISEN: eigene Pfade, die nicht auf der Liste stehen", () => {
    for (const fremd of [
      "/play/0",
      "/play/5",
      "/play/12",
      "/play",
      "/play/",
      "/play/1/",
      "/play/1/world",
      "/play/1/../../admin",
      "/play/1?x=1",
      "/play/1#a",
      "/play/1\n",
      "/play/1\t",
      "/PLAY/1",
      "/home",
      "/admin",
      "/admin/signin",
    ]) {
      assert.equal(zielAusFrom(fremd), null, JSON.stringify(fremd));
    }
  });

  it("ABWEISEN: nichts, leer, kein Text", () => {
    assert.equal(zielAusFrom(null), null);
    assert.equal(zielAusFrom(undefined), null);
    assert.equal(zielAusFrom(""), null);
    assert.equal(zielNachRueckkehr(true), ZIEL_NACH_ANMELDUNG);
    assert.equal(zielNachRueckkehr(true, null), ZIEL_NACH_ANMELDUNG);
  });
});

describe("zielNachRueckkehr — der Erfolg darf zielen, die Abweisung nie", () => {
  it("ein Erfolg mit erlaubtem from landet im Jahrgang", () => {
    assert.equal(zielNachRueckkehr(true, "/play/3"), "/play/3");
  });

  it("die TAMPER-PROBE der Karte: from=//evil ⇒ /home", () => {
    assert.equal(zielNachRueckkehr(true, "//evil"), "/home");
  });

  it("eine Abweisung liest from nicht — dieselbe Karte, woher auch immer", () => {
    assert.equal(zielNachRueckkehr(false, "/play/2"), ZIEL_ABGEWIESEN);
    assert.equal(zielNachRueckkehr(false, "//evil"), ZIEL_ABGEWIESEN);
  });
});

describe("die Verdrahtung (am Quelltext)", () => {
  it("die Route reicht from aus der Adresse in den Erfolgsweg", () => {
    const quelle = lies("../../app/api/auth/callback-konto/route.ts");
    assert.match(quelle, /searchParams\.get\("from"\)/);
    assert.match(quelle, /zielNachRueckkehr\(true, from\)/);
    // die beiden Abweisungen bleiben ohne from
    assert.equal((quelle.match(/zielNachRueckkehr\(false\)/g) ?? []).length, 2);
  });

  it("die Middleware bewacht /play/<n>, damit /signin das from überhaupt bekommt", () => {
    const quelle = lies("../../middleware.ts");
    const matcher = /matcher:\s*\[([^\]]*)\]/.exec(quelle)?.[1] ?? "";
    assert.match(matcher, /"\/play\/:grade"/);
  });
});

describe("die Lehrer-Tür bleibt offen (dev, nie in Produktion)", () => {
  it("/play/<n> öffnet auch DEV_TEACHER_ID allein — wie getPlayerForPage", () => {
    assert.equal(devDurchlass("/play/1", { DEV_TEACHER_ID: "t" }), true);
    assert.equal(devDurchlass("/play/2", { DEV_USER_ID: "s" }), true);
    assert.equal(devDurchlass("/play/2", {}), false);
  });

  it("/admin nur DEV_TEACHER_ID, Schülerseiten nur DEV_USER_ID — unverändert", () => {
    assert.equal(devDurchlass("/admin", { DEV_TEACHER_ID: "t" }), true);
    assert.equal(devDurchlass("/admin", { DEV_USER_ID: "s" }), false);
    assert.equal(devDurchlass("/home", { DEV_USER_ID: "s" }), true);
    assert.equal(devDurchlass("/home", { DEV_TEACHER_ID: "t" }), false);
  });

  it("in Produktion öffnet keine Entwicklungs-Identität irgendetwas", () => {
    const alle = { VERCEL_ENV: "production", DEV_USER_ID: "s", DEV_TEACHER_ID: "t" };
    for (const p of ["/play/1", "/admin", "/home"]) assert.equal(devDurchlass(p, alle), false, p);
  });

  it("die Middleware fragt genau diese Funktion", () => {
    assert.match(lies("../../middleware.ts"), /devDurchlass\(pathname, process\.env\)/);
  });
});
