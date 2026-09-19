/**
 * dach-074 · DER RUECKFALL, auf beiden Seiten des Datums — Verhalten, nicht Quelltext.
 *
 * Die Frage des GG an diesen PR lautet: Wer ist in der Minute nach dem Merge
 * ausgesperrt — und wer am Umstiegstag um 00:01? Jede Zeile hier beantwortet
 * einen Teil davon mit zwei gestellten Uhren, nie mit der echten Zeit:
 *
 *   VORABEND  = 12.10.2026, 23:59 Wien — der letzte Rueckfall-Moment
 *   NACHT     = 13.10.2026, 00:01 Wien — der erste Moment nach dem Umstieg
 *
 * Wo eine Route next-auth laedt (auth.ts, die Seiten), laesst sie sich unter
 * plain `node --test` nicht laden (pnpm-Ablage, ERR_MODULE_NOT_FOUND). Deshalb
 * liegt jede ihrer Entscheidungen in einem eigenen Modul, und das wird hier
 * gefahren; die Verdrahtung in den Seiten prueft das Tor check-no-local-login.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, it } from "node:test";

// Muss stehen, BEVOR ein @domigo/db-Modul geladen wird: getDb() wirft ohne Adresse.
process.env.DATABASE_URL ??= "postgres://test:test@127.0.0.1:1/test";

import { redirect } from "next/navigation.js"; // .js: Node löst den Unterpfad ohne Bundler nicht ohne Endung auf
import { EINLADUNG_UMGEZOGEN, pinScopeArt, rueckfallOffen, sitzungsRegel, tuerZiel, GESCHLOSSEN_SATZ, type Tuer } from "./rueckfall.ts";
import { restGueltig } from "./reste.ts";
import { verifyStudent, verifyTeacher } from "./pin-rueckfall.ts";
import { lokalesSchreibenZu } from "./rueckfall-antwort.ts";
import { abmeldeZiel, eigeneAdresse, KONTO_VIA } from "./abmelden.ts";
import { kontoBaseUrl } from "./basis.ts";

const VORABEND = new Date("2026-10-12T21:59:00Z"); // 23:59 Wien (MESZ, +02:00)
const NACHT = new Date("2026-10-12T22:01:00Z"); // 00:01 Wien am 13.10.
const KONTO = "konto-handoff";
const regel = (via: string | null, now: Date) => sitzungsRegel(via, now, KONTO, restGueltig);

describe("die Uhr: der Schnitt liegt exakt um 00:00 Wien am Umstiegstag", () => {
  it("am Vorabend um 23:59 ist der Rueckfall offen, um 00:01 zu", () => {
    assert.equal(rueckfallOffen(VORABEND), true);
    assert.equal(rueckfallOffen(NACHT), false);
  });
  it("restGueltig: student/teacher enden AM Tag (exklusiv), ops-link lebt weiter", () => {
    for (const p of ["student", "teacher"]) {
      assert.equal(restGueltig(p, VORABEND), true, `${p} am Vorabend`);
      assert.equal(restGueltig(p, NACHT), false, `${p} um 00:01`);
    }
    assert.equal(restGueltig("ops-link", NACHT), true);
    assert.equal(restGueltig("magic-link", VORABEND), false);
  });
});

describe("Sitzungen: wer nach dem Merge drin bleibt und wer am Tag rausfliegt", () => {
  it("ein heutiges Cookie OHNE via lebt vor dem Tag weiter und stirbt ab dem Tag", () => {
    assert.equal(regel(null, VORABEND), "rest");
    assert.equal(regel(null, NACHT), "tot");
  });
  it("eine PIN-Sitzung (student/teacher) lebt vor dem Tag und stirbt ab dem Tag", () => {
    for (const via of ["student", "teacher"]) {
      assert.equal(regel(via, VORABEND), "rest", via);
      assert.equal(regel(via, NACHT), "tot", via);
    }
  });
  it("eine konto-Sitzung gilt vor UND nach dem Tag (und wird jede Minute bei konto nachgefragt)", () => {
    assert.equal(regel(KONTO, VORABEND), "konto");
    assert.equal(regel(KONTO, NACHT), "konto");
  });
  it("der Maschinenpfad ops-link lebt ueber den Tag hinaus, ein unbekanntes via nie", () => {
    assert.equal(regel("ops-link", NACHT), "rest");
    assert.equal(regel("irgendwas", VORABEND), "tot");
  });
  it("auth.ts nennt den konto-Anbieter genauso wie das Abmelden (eine Kennung, zwei Leser)", () => {
    const src = fs.readFileSync(path.join(import.meta.dirname, "../../auth.ts"), "utf8");
    assert.match(src, new RegExp(`KONTO_PROVIDER = "${KONTO_VIA}"`));
    assert.equal(KONTO_VIA, KONTO);
  });
});

describe("Klassenwand einer PIN-Sitzung: sie sieht, was sie auf main sah", () => {
  it("vor dem Tag: PIN-Kind → seine Klasse, PIN-Lehrkraft → ihre Klassen, altes Cookie ebenso", () => {
    assert.equal(pinScopeArt("student", "student", VORABEND), "kind");
    assert.equal(pinScopeArt("teacher", "teacher", VORABEND), "lehrkraft");
    assert.equal(pinScopeArt(null, "teacher", VORABEND), "lehrkraft");
    assert.equal(pinScopeArt(null, "student", VORABEND), "kind");
  });
  it("eine konto-Sitzung und ops-link behalten die Claims-Regel; ab dem Tag niemand mehr", () => {
    assert.equal(pinScopeArt(KONTO, "teacher", VORABEND), null);
    assert.equal(pinScopeArt("ops-link", "student", VORABEND), null);
    assert.equal(pinScopeArt("teacher", "teacher", NACHT), null);
    assert.equal(pinScopeArt(null, "student", NACHT), null);
  });
});

describe("PIN-Anmeldung: vor dem Tag erreicht sie die Datenbank, ab dem Tag nicht einmal das", () => {
  // Die Datenbank spricht neon-http, also fetch. Jeder Ruf wird gezaehlt und
  // scheitert — »hat die Datenbank gefragt« ist der Beweis, dass die Pruefung
  // HINTER dem Datum weiterlief; »null ohne einen Ruf«, dass das Datum sie stoppte.
  const echtesFetch = globalThis.fetch;
  let rufe = 0;
  const zaehlendesFetch = (async () => {
    rufe++;
    throw new Error("keine Datenbank im Test");
  }) as typeof fetch;
  afterEach(() => {
    globalThis.fetch = echtesFetch;
  });

  it("Kind: vor dem Tag fragt verifyStudent die Datenbank", async () => {
    rufe = 0;
    globalThis.fetch = zaehlendesFetch;
    await verifyStudent("ABC123", "Nick", "123456", VORABEND).catch(() => null);
    assert.ok(rufe > 0, "vor dem Tag muss die PIN-Pruefung die Datenbank erreichen");
  });
  it("Kind: ab dem Tag null, ohne einen einzigen Datenbank-Ruf", async () => {
    rufe = 0;
    globalThis.fetch = zaehlendesFetch;
    assert.equal(await verifyStudent("ABC123", "Nick", "123456", NACHT), null);
    assert.equal(rufe, 0);
  });
  it("Lehrkraft: vor dem Tag fragt verifyTeacher die Datenbank", async () => {
    rufe = 0;
    globalThis.fetch = zaehlendesFetch;
    await verifyTeacher("Koki", "1234", VORABEND).catch(() => null);
    assert.ok(rufe > 0);
  });
  it("Lehrkraft: ab dem Tag null, ohne einen einzigen Datenbank-Ruf", async () => {
    rufe = 0;
    globalThis.fetch = zaehlendesFetch;
    assert.equal(await verifyTeacher("Koki", "1234", NACHT), null);
    assert.equal(rufe, 0);
  });
});

describe("die fuenf alten Tueren: vor dem Tag main, danach 307 zu konto", () => {
  const TUEREN: Tuer[] = ["join", "lehrkraft", "pin-reset", "pin-vergessen", "bootstrap"];

  it("die Erklaerseite der alten Einladung gibt es wirklich, ohne Datenbank und mit dem Satz", () => {
    const seite = fs.readFileSync(path.join(import.meta.dirname, "../../app", EINLADUNG_UMGEZOGEN.slice(1), "page.tsx"), "utf8");
    assert.match(seite, /Dieser Einladungs-Link stammt aus der Zeit vor Lauter Einser\./);
    assert.doesNotMatch(seite, /@domigo\/db/);
  });
  it("vor dem Tag fuehrt keine Tuer weg — die Seite ist die von main", () => {
    for (const t of TUEREN) assert.equal(tuerZiel(t, "ABC123", VORABEND), null, t);
  });
  it("ab dem Tag: /join/<code> zum Beitritt bei konto, die Einladung auf die Erklaerseite, der Rest zur Anmeldung", () => {
    assert.equal(tuerZiel("join", "ABC 12", NACHT), `${kontoBaseUrl()}/beitritt/ABC%2012`);
    assert.equal(tuerZiel("lehrkraft", "", NACHT), EINLADUNG_UMGEZOGEN);
    for (const t of TUEREN.filter((x) => x !== "join" && x !== "lehrkraft")) {
      assert.equal(tuerZiel(t, "", NACHT), `${kontoBaseUrl()}/login?app=go`, t);
    }
  });
  it("die Weiterleitung der Seiten ist redirect() — und das antwortet 307, nicht 308", () => {
    const ziel = tuerZiel("join", "ABC123", NACHT)!;
    let digest = "";
    try {
      redirect(ziel);
    } catch (e) {
      digest = String((e as { digest?: string }).digest ?? "");
    }
    assert.match(digest, /^NEXT_REDIRECT;[a-z]+;/);
    assert.ok(digest.includes(`;${ziel};307;`), `erwartet 307, bekommen: ${digest}`);
  });
});

describe("lokale Klassen-Schreiber: vor dem Tag offen, danach 405 mit dem Satz", () => {
  it("vor dem Tag keine Antwort — die Route arbeitet wie auf main", () => {
    assert.equal(lokalesSchreibenZu(VORABEND), null);
  });
  it("ab dem Tag 405, mit dem Satz und der Adresse des Lehrer-Raums", async () => {
    const r = lokalesSchreibenZu(NACHT)!;
    assert.equal(r.status, 405);
    const body = (await r.json()) as { satz: string; lehrerraum: string; ok: boolean };
    assert.equal(body.ok, false);
    assert.equal(body.satz, GESCHLOSSEN_SATZ);
    assert.equal(body.lehrerraum, `${kontoBaseUrl()}/lehrerraum/lehrgruppen`);
  });
});

describe("Abmelden: nur eine konto-Sitzung geht weiter zu konto", () => {
  it("via konto-handoff → konto /logout mit unserer eigenen Adresse als Rueckweg", () => {
    const ziel = new URL(abmeldeZiel(KONTO, "https://konto.example"));
    assert.equal(ziel.origin + ziel.pathname, "https://konto.example/logout");
    assert.equal(ziel.searchParams.get("return"), eigeneAdresse());
    assert.match(eigeneAdresse(), /^https:\/\/[a-z-]+\.[a-z]+\.[a-z]+\/$/);
  });
  it("PIN-Sitzung, altes Cookie und ops-link enden hier, auf der Startseite", () => {
    for (const via of ["student", "teacher", null, undefined, "ops-link"]) {
      assert.equal(abmeldeZiel(via, "https://konto.example"), "/", String(via));
    }
  });
});
