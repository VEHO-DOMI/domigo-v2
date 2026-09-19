/**
 * dach-018 · DIE ROUTEN SELBST, nicht nur ihre Bausteine (GG, 18.09.).
 *
 * Bis hierher prüften die Tore die Teile: die Signatur-Prüfung, die
 * Anmelde-Entscheidung, die Empfänger-Funktionen. Was niemand prüfte, war die
 * Verdrahtung — und genau dort blieb die Manipulationsprobe des GG grün. Eine
 * Route, der man das `if (!ruf) return abgewiesen()` wegnimmt, sah bis heute
 * niemand.
 *
 * Also wird hier die echte Route geladen und mit einem echten `Request`
 * gerufen. Jede Route hat zwei Hälften:
 *   · ABWEISEN — vier Manipulationen, je eine eigene Zeile: falsche Signatur,
 *     abgelaufener Stempel, fremde Sorte, veränderter Körper.
 *   · DURCHLASSEN — ein gültiger Ruf muss NACHWEISLICH hinter das Tor kommen.
 *     Ohne diese zweite Hälfte wäre eine Route, die immer 401 sagt, grün.
 *
 * WIE ES OHNE DATENBANK GEHT. Der Beweis für »durchgelassen« ist jedes Mal
 * eine Antwort, die nur JENSEITS der Signatur-Prüfung entstehen kann und die
 * die Datenbank nie erreicht: 422 für einen Jahrgang, den DomiGo nicht
 * speichern kann · 404 für eine Klasse ohne Kennung · 400 für eine Löschung
 * ohne Person. Kein Netz, keine Fixture, und trotzdem eine Aussage.
 *
 * `@/…` löst der Haken in scripts/lib/alias-register.mjs auf — die Routen sind
 * Next-Dateien und benutzen den Alias wie jede andere Route im Repo.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, it } from "node:test";

// Muss stehen, BEVOR eine Route geladen wird: getDb() wirft ohne Adresse. Ein
// Netzzugriff entsteht daraus nicht — auf keinem der geprüften Wege wird
// abgefragt.
process.env.DATABASE_URL ??= "postgres://test:test@127.0.0.1:1/test";

import { neueSchluessel, signLogout, signPush, type StubSchluessel } from "../../scripts/lib/konto-stub.ts";
import { _setJwksFuerTest } from "./jwt.ts";
import { RUECKKEHR_STATUS, ZIEL_ABGEWIESEN, ZIEL_NACH_ANMELDUNG, zielNachRueckkehr } from "./callback.ts";
import { POST as logoutRoute } from "../../app/api/konto/logout/route.ts";
import { POST as classesRoute } from "../../app/api/konto/classes/route.ts";
import { POST as classTermRoute } from "../../app/api/konto/class-term/route.ts";
import { POST as accountDeletedRoute } from "../../app/api/konto/account-deleted/route.ts";

const SID = "sess-abcdefgh";
let k: StubSchluessel;
let fremd: StubSchluessel;

beforeEach(async () => {
  k = await neueSchluessel("stub-1");
  fremd = await neueSchluessel("fremd-1");
  _setJwksFuerTest(k.keySet); // nur `k` ist veröffentlicht
});

function ruf(pfad: string, token: string, koerper: string): Request {
  return new Request(`https://eng.invalid${pfad}`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: koerper,
  });
}

/** Die vier Manipulationen, einmal geschrieben, für jede Push-Route gefahren. */
async function vierManipulationen(
  route: (r: Request) => Promise<Response>,
  pfad: string,
  art: string,
  koerper: string,
) {
  const fremdeSorte = art === "class-term" ? "account-deleted" : "class-term";
  return {
    falscheSignatur: await route(ruf(pfad, await signPush(fremd, art, koerper), koerper)),
    abgelaufen: await route(ruf(pfad, await signPush(k, art, koerper, { laufzeitS: 3600 }), koerper)),
    fremdeSorte: await route(ruf(pfad, await signPush(k, fremdeSorte, koerper), koerper)),
    veraenderterKoerper: await route(
      ruf(pfad, await signPush(k, art, koerper), koerper.replace(/}$/, ', "extra": 1}')),
    ),
    ohneKopf: await route(new Request(`https://eng.invalid${pfad}`, { method: "POST", body: koerper })),
  };
}

describe("POST /api/konto/logout — der Abmelde-Rückruf", () => {
  const koerper = JSON.stringify({ sid: SID });

  it("DURCHLASSEN: ein echt signierter Ruf wird mit 204 beantwortet", async () => {
    const res = await logoutRoute(ruf("/api/konto/logout", await signLogout(k, SID), koerper));
    assert.equal(res.status, 204);
  });

  it("ABWEISEN: falsche Signatur, abgelaufener Stempel, fehlender Kopf", async () => {
    assert.equal((await logoutRoute(ruf("/api/konto/logout", await signLogout(fremd, SID), koerper))).status, 401);
    assert.equal(
      (await logoutRoute(ruf("/api/konto/logout", await signLogout(k, SID, { laufzeitS: 3600 }), koerper))).status,
      401,
    );
    assert.equal(
      (await logoutRoute(new Request("https://eng.invalid/api/konto/logout", { method: "POST", body: koerper }))).status,
      401,
    );
  });

  it("ABWEISEN: der Körper nennt eine andere Sitzung als die Signatur", async () => {
    const fremderKoerper = JSON.stringify({ sid: "sess-fremdfremd" });
    const res = await logoutRoute(ruf("/api/konto/logout", await signLogout(k, SID), fremderKoerper));
    assert.equal(res.status, 401);
  });

  it("ABWEISEN: ein Push-Stempel taugt nicht als Abmeldung", async () => {
    const res = await logoutRoute(ruf("/api/konto/logout", await signPush(k, "class-term", koerper), koerper));
    assert.equal(res.status, 401);
  });
});

describe("POST /api/konto/classes — eine neue Lehrgruppe", () => {
  const pfad = "/api/konto/classes";
  const basis = { join_code: "ABC123", name: "2B", owner_app_user_id: "lehrkraft-1" };

  it("DURCHLASSEN: gültig signiert, aber ohne Jahrgang ⇒ 422 — die Prüfung war passiert", async () => {
    const koerper = JSON.stringify({ ...basis, jahrgang: null });
    const res = await classesRoute(ruf(pfad, await signPush(k, "classes", koerper), koerper));
    assert.equal(res.status, 422);
    const b = (await res.json()) as { feld?: string };
    assert.equal(b.feld, "jahrgang"); // der Grund ist ein FELDNAME, nie ein Wert (N-17)
  });

  it("DURCHLASSEN: ein Jahrgang ausserhalb 1..4 ist derselbe Fall", async () => {
    const koerper = JSON.stringify({ ...basis, jahrgang: 9 });
    const res = await classesRoute(ruf(pfad, await signPush(k, "classes", koerper), koerper));
    assert.equal(res.status, 422);
  });

  it("ABWEISEN: alle vier Manipulationen und der fehlende Kopf", async () => {
    const koerper = JSON.stringify({ ...basis, jahrgang: null });
    const r = await vierManipulationen(classesRoute, pfad, "classes", koerper);
    for (const [name, res] of Object.entries(r)) assert.equal(res.status, 401, `${name} wurde nicht abgewiesen`);
  });

  it("ABWEISEN: ein gültiger Stempel über einem Körper ohne Namen ⇒ 400, nie 500", async () => {
    const koerper = JSON.stringify({ jahrgang: 2 });
    const res = await classesRoute(ruf(pfad, await signPush(k, "classes", koerper), koerper));
    assert.equal(res.status, 400);
  });
});

describe("POST /api/konto/class-term — eine Änderung nachziehen", () => {
  const pfad = "/api/konto/class-term";
  const basis = { name: "2B", jahrgang: 2, owner_app_user_id: "lehrkraft-1" };

  it("DURCHLASSEN: gültig signiert, aber ohne Klassenkennung ⇒ 404 — kein stilles Anlegen", async () => {
    const koerper = JSON.stringify({ ...basis, app_class_id: "" });
    const res = await classTermRoute(ruf(pfad, await signPush(k, "class-term", koerper), koerper));
    assert.equal(res.status, 404);
  });

  it("DURCHLASSEN: gültig signiert, mit Klasse aber ohne Jahrgang ⇒ 422", async () => {
    // Mit Kennung, damit die Klassen-Prüfung passiert ist und der Jahrgang
    // wirklich der Grund ist — beide liegen vor jedem Datenbankzugriff.
    const koerper = JSON.stringify({ ...basis, app_class_id: "cls-1", jahrgang: null });
    const res = await classTermRoute(ruf(pfad, await signPush(k, "class-term", koerper), koerper));
    assert.equal(res.status, 422);
  });

  it("ABWEISEN: alle vier Manipulationen und der fehlende Kopf", async () => {
    const koerper = JSON.stringify({ ...basis, app_class_id: "" });
    const r = await vierManipulationen(classTermRoute, pfad, "class-term", koerper);
    for (const [name, res] of Object.entries(r)) assert.equal(res.status, 401, `${name} wurde nicht abgewiesen`);
  });
});

describe("POST /api/konto/account-deleted — die Löschungs-Ankündigung", () => {
  const pfad = "/api/konto/account-deleted";

  it("DURCHLASSEN: gültig signiert, aber ohne Person ⇒ 400 — die Prüfung war passiert", async () => {
    const koerper = JSON.stringify({});
    const res = await accountDeletedRoute(ruf(pfad, await signPush(k, "account-deleted", koerper), koerper));
    assert.equal(res.status, 400);
  });

  it("ABWEISEN: alle vier Manipulationen und der fehlende Kopf", async () => {
    const koerper = JSON.stringify({ app_user_id: "kind-1" });
    const r = await vierManipulationen(accountDeletedRoute, pfad, "account-deleted", koerper);
    for (const [name, res] of Object.entries(r)) assert.equal(res.status, 401, `${name} wurde nicht abgewiesen`);
  });

  it("ABWEISEN: eine Abmeldung ist keine Löschung — der Stempel trägt keine Sorte", async () => {
    const koerper = JSON.stringify({ app_user_id: "kind-1" });
    const res = await accountDeletedRoute(ruf(pfad, await signLogout(k, SID), koerper));
    assert.equal(res.status, 401);
  });
});

describe("Die Rückkehr von konto (/api/auth/callback-konto)", () => {
  // Die Route selbst laesst sich unter plain `node --test` nicht laden: sie
  // importiert next-auth, und das findet in pnpms isolierter Ablage sein
  // eigenes `next/server` nicht. Geprueft wird deshalb die Entscheidung (pur)
  // und die Verdrahtung am Quelltext — beides geht rot, wenn jemand sie aendert.
  const datei = path.resolve(import.meta.dirname, "../../app/api/auth/callback-konto/route.ts");
  const quelle = fs.readFileSync(datei, "utf8");

  it("JEDE Abweisung landet auf derselben Karte — die Adresse verrät nichts", () => {
    assert.equal(zielNachRueckkehr(false), ZIEL_ABGEWIESEN);
    assert.equal(zielNachRueckkehr(true), ZIEL_NACH_ANMELDUNG);
    assert.equal(RUECKKEHR_STATUS, 303);
  });

  it("die Route benutzt NextResponse — mit dem globalen Response reist das Cookie nicht mit", () => {
    assert.match(quelle, /NextResponse\.redirect/);
    assert.doesNotMatch(quelle, /\bResponse\.redirect/);
  });

  it("die Route schluckt NUR eine AuthError — ein Datenbank-Fehler bleibt sichtbar", () => {
    assert.match(quelle, /err instanceof AuthError/);
    assert.match(quelle, /throw err;/);
  });

  it("ohne Ticket wird gar nicht erst angemeldet", () => {
    const vorSignIn = quelle.slice(0, quelle.indexOf("signIn("));
    assert.match(vorSignIn, /if \(!handoff\)/);
  });
});
