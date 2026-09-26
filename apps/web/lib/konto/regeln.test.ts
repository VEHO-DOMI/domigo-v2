/**
 * dach-108 · DIE FESTEN REGELN — Verhalten, nicht Quelltext, und ohne Uhr.
 *
 * Bis zu diesem PR fuhr diese Datei jede Regel auf zwei gestellten Uhren (Vorabend
 * und Nacht des Umstiegstags). Seit Kokis Entscheid vom 19.09. (E-3, E-8) gibt es
 * keinen Umstiegstag mehr: was damals »ab dem Tag« galt, gilt jetzt immer. Die Frage
 * an diesen PR lautet deshalb: Wer kommt hinein — und wer nicht, auch nicht mit
 * einem alten Cookie oder einem alten Link?
 *
 * Wo eine Route next-auth laedt (auth.ts, die Seiten), laesst sie sich unter
 * plain `node --test` nicht laden (pnpm-Ablage, ERR_MODULE_NOT_FOUND). Deshalb
 * liegt jede ihrer Entscheidungen in einem eigenen Modul, und das wird hier
 * gefahren; die Verdrahtung in den Seiten prueft das Tor check-no-local-login.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { redirect } from "next/navigation.js"; // .js: Node löst den Unterpfad ohne Bundler nicht ohne Endung auf
import { EINLADUNG_UMGEZOGEN, GESCHLOSSEN_SATZ, sitzungsRegel, tuerZiel, type Tuer } from "./regeln.ts";
import { RESTE, restZulaessig } from "./reste.ts";
import { lokalesSchreibenZu } from "./klassen-antwort.ts";
import { abmeldeZiel, eigeneAdresse, KONTO_VIA } from "./abmelden.ts";
import { kontoBaseUrl } from "./basis.ts";

const KONTO = "konto-handoff";
const regel = (via: string | null) => sitzungsRegel(via, KONTO, restZulaessig);
const APP = path.join(import.meta.dirname, "../../app");
const lies = (rel: string) => fs.readFileSync(path.join(import.meta.dirname, "../..", rel), "utf8");

describe("Reste: nur, was die Allowlist nennt — und keiner laeuft ab", () => {
  it("die Allowlist nennt genau ops-link und dev-identity, ohne Ablaufdatum", () => {
    assert.deepEqual(RESTE.map((r) => r.provider).sort(), ["dev-identity", "ops-link"]);
    for (const r of RESTE) assert.equal("ablauf" in r, false, `${r.provider} traegt ein Ablaufdatum`);
  });
  it("ops-link ist zulaessig; student, teacher und Erfundenes nie", () => {
    assert.equal(restZulaessig("ops-link"), true);
    for (const p of ["student", "teacher", "magic-link", ""]) assert.equal(restZulaessig(p), false, p);
  });
});

describe("Sitzungen: nur konto und der deklarierte Maschinenpfad", () => {
  it("ein altes Cookie OHNE via (aus der PIN-Zeit) ist keine Sitzung", () => {
    assert.equal(regel(null), "tot");
  });
  it("eine PIN-Sitzung (student/teacher) ist keine Sitzung", () => {
    for (const via of ["student", "teacher"]) assert.equal(regel(via), "tot", via);
  });
  it("eine konto-Sitzung gilt (und wird jede Minute bei konto nachgefragt)", () => {
    assert.equal(regel(KONTO), "konto");
  });
  it("der Maschinenpfad ops-link lebt, ein unbekanntes via nie", () => {
    assert.equal(regel("ops-link"), "rest");
    assert.equal(regel("irgendwas"), "tot");
  });
  it("auth.ts nennt den konto-Anbieter genauso wie das Abmelden (eine Kennung, zwei Leser)", () => {
    const src = lies("auth.ts");
    assert.match(src, new RegExp(`KONTO_PROVIDER = "${KONTO_VIA}"`));
    assert.equal(KONTO_VIA, KONTO);
  });
  it("auth.ts kennt keinen PIN-Anbieter mehr: nur konto-handoff und ops-link", () => {
    const src = lies("auth.ts");
    const ids = [...src.matchAll(/^\s*id:\s*([A-Z_]+|"[a-z-]+")/gm)].map((m) => m[1]);
    assert.deepEqual(ids, ["KONTO_PROVIDER", "OPS_PROVIDER"]);
    assert.doesNotMatch(src, /verifyStudent|verifyTeacher|id:\s*"(student|teacher)"/);
  });
});

describe("die fuenf alten Tueren: immer 307 zum festen Ziel", () => {
  const TUEREN: Tuer[] = ["join", "lehrkraft", "pin-reset", "pin-vergessen", "bootstrap"];

  it("die Erklaerseite der alten Einladung gibt es wirklich, ohne Datenbank und mit dem Satz", () => {
    const seite = fs.readFileSync(path.join(APP, EINLADUNG_UMGEZOGEN.slice(1), "page.tsx"), "utf8");
    assert.match(seite, /Dieser Einladungs-Link stammt aus der Zeit vor Lauter Einser\./);
    assert.doesNotMatch(seite, /@domigo\/db/);
  });
  it("/join/<code> zum Beitritt bei konto, die Einladung auf die Erklaerseite, der Rest zur Anmeldung", () => {
    assert.equal(tuerZiel("join", "ABC 12"), `${kontoBaseUrl()}/beitritt/ABC%2012`);
    assert.equal(tuerZiel("lehrkraft", ""), EINLADUNG_UMGEZOGEN);
    for (const t of TUEREN.filter((x) => x !== "join" && x !== "lehrkraft")) {
      assert.equal(tuerZiel(t, ""), `${kontoBaseUrl()}/login?app=go`, t);
    }
  });
  it("die Weiterleitung der Seiten ist redirect() — und das antwortet 307, nicht 308", () => {
    for (const t of TUEREN) {
      const ziel = tuerZiel(t, "ABC123");
      let digest = "";
      try {
        redirect(ziel);
      } catch (e) {
        digest = String((e as { digest?: string }).digest ?? "");
      }
      assert.match(digest, /^NEXT_REDIRECT;[a-z]+;/, t);
      assert.ok(digest.includes(`;${ziel};307;`), `${t}: erwartet 307, bekommen: ${digest}`);
    }
  });
});

describe("lokale Klassen-Schreiber: immer 405 mit dem Satz", () => {
  it("405, mit dem Satz und der Adresse des Lehrer-Raums", async () => {
    const r = lokalesSchreibenZu();
    assert.equal(r.status, 405);
    const body = (await r.json()) as { satz: string; lehrerraum: string; ok: boolean };
    assert.equal(body.ok, false);
    assert.equal(body.satz, GESCHLOSSEN_SATZ);
    assert.equal(body.lehrerraum, `${kontoBaseUrl()}/lehrerraum/lehrgruppen`);
  });
  it("jede der fuenf Schreib-Routen antwortet damit — und mit nichts anderem", async () => {
    // Die beiden reinen Schreib-Dateien werden GELADEN und gefahren.
    const routen: Array<[string, string[]]> = [
      ["api/admin/classes/[id]/route.ts", ["PATCH", "POST", "DELETE"]],
      ["api/admin/classes/[id]/roster/route.ts", ["POST"]],
    ];
    for (const [datei, verben] of routen) {
      const mod = (await import(path.join(APP, datei))) as Record<string, () => Response>;
      for (const v of verben) {
        const r = mod[v]!();
        assert.equal(r.status, 405, `${datei} ${v}`);
        assert.equal(((await r.json()) as { satz: string }).satz, GESCHLOSSEN_SATZ, `${datei} ${v}`);
      }
    }
    // api/admin/classes/route.ts traegt daneben das lesende GET (next/server, Sitzung)
    // und laesst sich unter plain node nicht laden: sein POST wird am Quelltext
    // festgehalten — genau ein Aufruf, kein Zweig davor.
    const liste = fs.readFileSync(path.join(APP, "api/admin/classes/route.ts"), "utf8");
    assert.match(liste, /export function POST\(\): Response \{\n {2}return lokalesSchreibenZu\(\);\n\}/);
    assert.doesNotMatch(liste, /createClass/);
  });
});

describe("Abmelden: nur eine konto-Sitzung geht weiter zu konto", () => {
  it("via konto-handoff → konto /logout mit unserer eigenen Adresse als Rueckweg", () => {
    const ziel = new URL(abmeldeZiel(KONTO, "https://konto.example"));
    assert.equal(ziel.origin + ziel.pathname, "https://konto.example/logout");
    assert.equal(ziel.searchParams.get("return"), eigeneAdresse());
    assert.match(eigeneAdresse(), /^https:\/\/[a-z-]+\.[a-z]+\.[a-z]+\/$/);
  });
  it("altes PIN-Cookie, altes Cookie ohne via und ops-link enden hier, auf der Startseite", () => {
    for (const via of ["student", "teacher", null, undefined, "ops-link"]) {
      assert.equal(abmeldeZiel(via, "https://konto.example"), "/", String(via));
    }
  });
});
