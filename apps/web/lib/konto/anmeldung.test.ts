/**
 * dach-018 · test:konto-handoff, zweite Haelfte — wer hereinkommt und wer nicht.
 *
 * Die Entscheidung ist mit Absicht PUR (`entscheide`): so laesst sie sich ohne
 * Datenbank pruefen, und — wichtiger — so faellt sie garantiert VOR jedem
 * Schreiben. Eine Abweisung, die erst nach dem Anlegen faellt, hinterlaesst
 * einen halben Nutzer, den niemand je wieder anfasst.
 *
 * Der Tausch selbst laeuft gegen den Doppelgaenger: eine echte Uebergabe, ein
 * echter Fehlschlag beim zweiten Mal.
 */
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { neuerStub, type StubKonto } from "../../scripts/lib/konto-stub.ts";
import { entscheide } from "./anmeldung.ts";
import { exchangeHandoff, fetchClaims, meldeAppLink, type Claims } from "./claims.ts";

const KLASSE = "cccccccc-0000-4000-8000-000000000001";

function lehrkraft(rollen: { area: string; role: string }[]): Claims {
  return {
    sub: "acc_1",
    kind: "teacher",
    "kürzel": "VEHO",
    display: "VEHO",
    sid: "sess-abcdefgh",
    acting_for: null,
    roles: rollen as Claims["roles"],
    scope: { school_year: "2026/27", classes: [{ id: "cls_1", term_id: "trm_1", name: "2B", jahrgang: 2, term_started_at: "", fach: "Englisch", own: true, app_class_id: KLASSE }] },
    features: { master_view: false, editor: false },
    app_user_id: null,
    issued_at: "",
    expires_at: "",
  };
}

function kind(appClassId: string | null): Claims {
  return {
    sub: "acc_2",
    kind: "student",
    nick: "Fuchs",
    display: "Fuchs",
    sid: "sess-ijklmnop",
    acting_for: null,
    roles: [],
    scope: { school_year: "2026/27", classes: [{ id: "cls_1", term_id: "trm_1", name: "2B", jahrgang: 2, term_started_at: "", fach: "Englisch", own: false, app_class_id: appClassId }] },
    features: { master_view: false, editor: false },
    app_user_id: null,
    issued_at: "",
    expires_at: "",
  };
}

describe("wer hereinkommt (SPEC §5 L2/L3, entschieden VOR jedem Schreiben)", () => {
  it("eine Lehrkraft mit der Rolle im Bereich go kommt herein", () => {
    const r = entscheide(lehrkraft([{ area: "go", role: "teacher" }]));
    assert.equal(r.ok, true);
    assert.deepEqual(r.ok && r.scope, [KLASSE]);
  });

  it("eine Lehrkraft OHNE die Rolle wird abgewiesen — und zwar hier, nicht erst auf der Seite", () => {
    assert.deepEqual(entscheide(lehrkraft([{ area: "srdp", role: "teacher" }])), { ok: false, grund: "keine-rolle" });
    assert.deepEqual(entscheide(lehrkraft([])), { ok: false, grund: "keine-rolle" });
  });

  it("die Rolle muss fuer DIESEN Bereich gelten — admin anderswo reicht nicht", () => {
    assert.deepEqual(entscheide(lehrkraft([{ area: "konto", role: "admin" }])), { ok: false, grund: "keine-rolle" });
  });

  it("ein Kind mit Bruecke bekommt genau EINE Klasse", () => {
    const r = entscheide(kind(KLASSE));
    assert.equal(r.ok && r.kindKlasse, KLASSE);
    assert.equal(r.ok && r.scope.length, 1);
  });

  it("ein Kind ohne Bruecke wird abgewiesen — seine Lehrgruppe gibt es in DomiGo nicht", () => {
    assert.deepEqual(entscheide(kind(null)), { ok: false, grund: "keine-klasse" });
  });
});

describe("der Tausch gegen den Doppelgaenger", () => {
  let stub: StubKonto;
  const echtesFetch = globalThis.fetch;

  beforeEach(() => {
    stub = neuerStub();
    process.env.KONTO_APP_SECRET = stub.secret;
    process.env.KONTO_BASE_URL = "https://konto.invalid";
    globalThis.fetch = stub.fetch;
  });
  afterEach(() => {
    globalThis.fetch = echtesFetch;
    delete process.env.KONTO_APP_SECRET;
    delete process.env.KONTO_BASE_URL;
  });

  it("eine gueltige Uebergabe liefert die Claims", async () => {
    stub.claims.set("tok-1", lehrkraft([{ area: "go", role: "teacher" }]));
    const c = await exchangeHandoff("tok-1");
    assert.equal(c?.sub, "acc_1");
  });

  it("TAMPER: dieselbe Uebergabe ein zweites Mal ⇒ keine Claims, keine Sitzung", async () => {
    // Der Doppelgaenger schickt beim zweiten Mal 409 MIT gueltigem Koerper. Das
    // ist die schaerfere Probe: der STATUS entscheidet, nicht die Form. Wer die
    // Absage ignoriert und nur den Koerper anschaut, faellt hier durch — und
    // genau das ist die Manipulation, die diese Zeile fangen soll.
    stub.claims.set("tok-1", lehrkraft([{ area: "go", role: "teacher" }]));
    assert.ok(await exchangeHandoff("tok-1"));
    assert.equal(await exchangeHandoff("tok-1"), null);
  });

  it("ohne App-Geheimnis wird gar nicht erst getauscht", async () => {
    delete process.env.KONTO_APP_SECRET;
    assert.equal(await exchangeHandoff("tok-1"), null);
  });

  it("»revoked« beendet die Sitzung, ein unerreichbares konto NICHT", async () => {
    stub.widerrufen.add("sess-weg");
    assert.deepEqual(await fetchClaims("sess-weg"), { status: "revoked" });

    globalThis.fetch = (() => Promise.reject(new Error("Netz weg"))) as typeof fetch;
    assert.deepEqual(await fetchClaims("sess-abcdefgh"), { status: "unreachable" });
  });

  it("die Bruecke wird genau EINMAL gemeldet", async () => {
    await meldeAppLink("acc_1", "user-1");
    assert.equal(stub.rufe.filter((r) => r.pfad === "/api/app-links").length, 1);
  });
});
