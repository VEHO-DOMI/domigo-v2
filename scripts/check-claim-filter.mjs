#!/usr/bin/env node
// dach-018 · DIE KLASSENWAND, MASCHINELL — SPEC konto V1.1-FINAL §5 L3, Nachtrag N-10.
//
// Die Regel lautet: jede Klassenabfrage in packages/db filtert ZUERST auf den
// Ausschnitt der Sitzung. Eine Regel ohne Tor rutscht bei der 27. Datei durch —
// genau dafuer steht dieses Blatt.
//
// Vier Pruefungen, und die letzte ist die, ohne die die anderen Deko sind:
//
//   pflicht   · jede Funktion mit einer Klassen-Bedingung nimmt `classScope:
//               ClassScope` als zweiten Parameter (direkt hinter `db`), ohne
//               Vorgabewert. Ein Vorgabewert waere »alles«, und »alles« ist die
//               Luecke, die diese Karte schliesst.
//   zuerst    · der Ausschnitt steht als ERSTES Glied im `and(…)` der Abfrage,
//               und NIE in der verneinten Form. Gemessen an drizzle-orm 0.45.2:
//               `inArray(spalte, [])` ergibt `false` (leerer Ausschnitt ⇒ kein
//               Ergebnis), `notInArray(spalte, [])` dagegen `true` — die
//               verneinte Form kehrt die Wand um, statt sie zu schliessen.
//   wache     · jeder Schreibweg mit Ausschnitt ruft `assertWritableScope`.
//               Ein leerer Ausschnitt macht aus einem UPDATE ein `where false`:
//               null Zeilen geaendert, Erfolg gemeldet.
//   herkunft  · `classScope(` wird in apps/web NUR in lib/identity.ts gerufen.
//               Der Typ kann nicht beweisen, woher seine Kennungen kommen:
//               `classScope([params.id])` uebersetzt sich tadellos und ist
//               genau das Loch. Was bleibt, ist EINE Baustelle — und diese
//               Pruefung ist es, die sie zu einer macht.
//
// Was nicht filtern KANN, steht in claim-filter-allowlist.json, je mit einem
// Satz. Und die Liste rostet nicht: ein Eintrag, dessen Funktion inzwischen
// einen Ausschnitt nimmt oder die es nicht mehr gibt, macht dieses Tor rot.
//
// Der Selbsttest verbiegt je eine Kopie IM SPEICHER und verlangt, dass GENAU
// die zustaendige Pruefung rot wird (Muster check-roster-twins.mjs). Ein rotes
// Licht, das auch ohne Manipulation brennt, beweist nichts.
//
// Lauf: node scripts/check-claim-filter.mjs            (exit 1 bei jedem Verstoss)
//       node scripts/check-claim-filter.mjs --selftest (beweist die roten Lichter)

import fs from "node:fs";
import path from "node:path";

const R = process.cwd();
const selftest = process.argv.includes("--selftest");
const DB_SRC = "packages/db/src";
const ALLOWLIST = "scripts/claim-filter-allowlist.json";
const WEB = "apps/web";
const SCOPE_HEIMAT = "apps/web/lib/identity.ts";
const SATZ_MIN = 40;

// Eine Bedingung auf einer Klassen-Spalte. Absichtlich STRUKTURELL (ein Praedikat
// auf einer Spalte), nicht textuell: eine Pruefung auf »erwaehnt v2Classes« fuellt
// die Ausnahme-Liste mit Lehrer-Funktionen, und eine Liste, die niemand liest,
// ist keine Kontrolle mehr.
const KLASSEN_PRAEDIKAT =
  /\b(?:eq|ne|inArray|notInArray)\(\s*(?:[A-Za-z0-9_]+\.classId|v2Classes\.(?:id|inviteCode|teacherId)|v1Classes\.(?:id|inviteCode)|v2IdentityUsers\.classId)/;
// Roh-SQL, das eine Klasse nennt (writing-review gehoertZuLehrkraft).
const KLASSEN_ROHSQL = /sql`[^`]*\$\{v2Classes\.id\}/;

const lies = (rel) => fs.readFileSync(path.join(R, rel), "utf8");

function dbDateien() {
  return fs
    .readdirSync(path.join(R, DB_SRC))
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
    .map((f) => `${DB_SRC}/${f}`);
}

function webDateien(dir = WEB, out = []) {
  for (const e of fs.readdirSync(path.join(R, dir), { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) webDateien(rel, out);
    else if (/\.tsx?$/.test(e.name)) out.push(rel);
  }
  return out;
}

/** Den Koerper einer Funktion ab ihrer Kopfzeile, ueber Klammer-Tiefe. */
function koerper(src, ab) {
  const auf = src.indexOf("{", ab);
  if (auf < 0) return "";
  let tiefe = 0;
  for (let i = auf; i < src.length; i++) {
    if (src[i] === "{") tiefe++;
    else if (src[i] === "}") {
      tiefe--;
      if (tiefe === 0) return src.slice(auf, i + 1);
    }
  }
  return src.slice(auf);
}

/** Alle (exportierten wie privaten) Funktionen einer Datei mit Kopf und Koerper. */
function funktionen(src) {
  const raus = [];
  const re = /^(export )?(async )?function ([A-Za-z0-9_]+)\s*\(/gm;
  let m;
  while ((m = re.exec(src))) {
    const kopfEnde = src.indexOf("{", m.index);
    raus.push({
      name: m[3],
      exportiert: !!m[1],
      kopf: src.slice(m.index, kopfEnde < 0 ? src.length : kopfEnde),
      koerper: koerper(src, m.index),
    });
  }
  return raus;
}

/** Nimmt die Funktion `classScope: ClassScope` als ZWEITEN Parameter, ohne Vorgabe? */
function hatPflichtScope(kopf) {
  const p = kopf.slice(kopf.indexOf("("));
  const params = p
    .replace(/^\(/, "")
    .replace(/\)\s*:?[\s\S]*$/, "")
    .split(/,(?![^<(]*[>)])/)
    .map((s) => s.trim())
    .filter(Boolean);
  const zweiter = params[1] ?? "";
  return /^classScope\s*:\s*ClassScope\s*$/.test(zweiter);
}

/** Steht der Ausschnitt als ERSTES Glied jedes `and(…)`, das ihn ueberhaupt nennt? */
function zuerstGefiltert(k) {
  const fehler = [];
  if (/notInArray\(\s*[^,]+,\s*\[\.\.\.classScope\]/.test(k)) {
    fehler.push("der Ausschnitt steht in der VERNEINTEN Form — ein leerer Ausschnitt waere damit »alles«");
  }
  let i = 0;
  while ((i = k.indexOf("and(", i)) >= 0) {
    const auf = i + 3;
    let tiefe = 0;
    let erstesEnde = -1;
    for (let j = auf; j < k.length; j++) {
      if (k[j] === "(") tiefe++;
      else if (k[j] === ")") {
        tiefe--;
        if (tiefe === 0) { erstesEnde = j; break; }
      } else if (k[j] === "," && tiefe === 1 && erstesEnde < 0) { erstesEnde = j; break; }
    }
    const inhalt = k.slice(auf, erstesEnde < 0 ? k.length : erstesEnde);
    const ganz = k.slice(auf, k.indexOf("\n", auf) >= 0 ? k.indexOf(")", auf) + 1 : k.length);
    void ganz;
    if (k.slice(auf).includes("classScope") && !inhalt.includes("classScope")) {
      // Nur melden, wenn dieses `and(` den Ausschnitt ueberhaupt enthaelt.
      const bis = k.indexOf("));", auf);
      const block = k.slice(auf, bis < 0 ? auf + 400 : bis);
      if (block.includes("[...classScope]")) {
        fehler.push("der Ausschnitt ist nicht das ERSTE Glied der Bedingung");
      }
    }
    i = auf;
  }
  return fehler;
}

function lade(state) {
  return JSON.parse(state.files.get(ALLOWLIST));
}

const PRUEFUNGEN = {
  pflicht(state) {
    const raus = [];
    const erlaubt = lade(state).ausnahmen;
    for (const [rel, src] of state.db) {
      for (const f of funktionen(src)) {
        if (!f.exportiert) continue;
        const beruehrt = KLASSEN_PRAEDIKAT.test(f.koerper) || KLASSEN_ROHSQL.test(f.koerper);
        const schluessel = `${path.basename(rel)}#${f.name}`;
        if (!beruehrt) continue;
        if (hatPflichtScope(f.kopf)) {
          if (erlaubt[schluessel]) raus.push(`${schluessel}: steht in der Ausnahme-Liste, nimmt aber laengst einen Ausschnitt — Eintrag streichen`);
          continue;
        }
        const satz = erlaubt[schluessel];
        if (!satz) raus.push(`${schluessel}: filtert auf eine Klasse, nimmt aber keinen Pflicht-Ausschnitt (und steht in keiner Ausnahme)`);
        else if (satz.length < SATZ_MIN) raus.push(`${schluessel}: die Ausnahme braucht einen Satz, keine Notiz (mindestens ${SATZ_MIN} Zeichen)`);
      }
    }
    // Rost: ein Eintrag, dessen Funktion es nicht mehr gibt.
    const alle = new Set();
    for (const [rel, src] of state.db) for (const f of funktionen(src)) alle.add(`${path.basename(rel)}#${f.name}`);
    for (const schluessel of Object.keys(erlaubt)) {
      if (!alle.has(schluessel)) raus.push(`${schluessel}: Ausnahme fuer eine Funktion, die es nicht mehr gibt`);
    }
    return raus;
  },

  zuerst(state) {
    const raus = [];
    for (const [rel, src] of state.db) {
      for (const f of funktionen(src)) {
        if (!f.koerper.includes("classScope")) continue;
        for (const fehler of zuerstGefiltert(f.koerper)) raus.push(`${path.basename(rel)}#${f.name}: ${fehler}`);
      }
    }
    return raus;
  },

  /**
   * WACHE — der blinde Leser von dach-018 fand `releaseItems` ohne
   * `assertWritableScope`, waehrend jeder andere Schreibweg ihn ruft. Das war
   * kein Einzelfall, sondern eine Regel ohne Tor: `where false` aendert null
   * Zeilen und meldet Erfolg, und genau davor warnt der Kopf von scope.ts.
   * Seit diesem Befund haelt eine Pruefung die Regel statt einer Gewohnheit.
   */
  wache(state) {
    const raus = [];
    for (const [rel, src] of state.db) {
      for (const f of funktionen(src)) {
        if (!f.exportiert || !f.koerper.includes("classScope")) continue;
        const schreibt = /db\s*\.\s*(insert|update|delete)\(/.test(f.koerper);
        if (schreibt && !f.koerper.includes("assertWritableScope")) {
          raus.push(`${path.basename(rel)}#${f.name}: schreibt mit einem Ausschnitt, ruft aber keinen assertWritableScope — ein leerer Ausschnitt aendert null Zeilen und meldet Erfolg`);
        }
      }
    }
    return raus;
  },

  herkunft(state) {
    const raus = [];
    for (const [rel, src] of state.web) {
      if (rel === SCOPE_HEIMAT) continue;
      src.split("\n").forEach((zeile, i) => {
        if (/\bclassScope\(/.test(zeile)) {
          raus.push(`${rel}:${i + 1} baut einen Ausschnitt — das darf nur ${SCOPE_HEIMAT}`);
        }
      });
    }
    return raus;
  },
};

function laden() {
  const files = new Map([[ALLOWLIST, lies(ALLOWLIST)]]);
  const db = new Map(dbDateien().map((rel) => [rel, lies(rel)]));
  const web = new Map(webDateien().map((rel) => [rel, lies(rel)]));
  return { files, db, web };
}

function lauf(state) {
  const befunde = {};
  for (const [name, fn] of Object.entries(PRUEFUNGEN)) befunde[name] = fn(state);
  return befunde;
}

const klon = (s) => ({ files: new Map(s.files), db: new Map(s.db), web: new Map(s.web) });

const FAELLE = [
  {
    name: "ein Pflicht-Ausschnitt wird optional gemacht",
    pruefung: "pflicht",
    mach: (s) => {
      const c = klon(s);
      const rel = `${DB_SRC}/class-progress.ts`;
      c.db.set(rel, c.db.get(rel).replace("classScope: ClassScope, classId: string", "classScope: ClassScope = EMPTY_SCOPE, classId: string"));
      return c;
    },
  },
  {
    name: "die Wand wird verneint geschrieben",
    pruefung: "zuerst",
    mach: (s) => {
      const c = klon(s);
      const rel = `${DB_SRC}/class-progress.ts`;
      c.db.set(rel, c.db.get(rel).replace("inArray(practiceAttempts.classId, [...classScope])", "notInArray(practiceAttempts.classId, [...classScope])"));
      return c;
    },
  },
  {
    name: "ein Ausschnitt wird ausserhalb von lib/identity.ts gebaut",
    pruefung: "herkunft",
    mach: (s) => {
      const c = klon(s);
      c.web.set("apps/web/app/__selftest-scope.tsx", "const s = classScope([params.id]);");
      return c;
    },
  },
  {
    name: "ein Schreibweg verliert seinen Waechter",
    pruefung: "wache",
    mach: (s) => {
      const c = klon(s);
      const rel = `${DB_SRC}/assignment-service.ts`;
      c.db.set(rel, c.db.get(rel).replace('assertWritableScope(classScope, "releaseItems");', ""));
      return c;
    },
  },
  {
    name: "eine Ausnahme verliert ihren Satz",
    pruefung: "pflicht",
    mach: (s) => {
      const c = klon(s);
      const j = JSON.parse(c.files.get(ALLOWLIST));
      j.ausnahmen["ops-links.ts#loadOpsClass"] = "geht schon";
      c.files.set(ALLOWLIST, JSON.stringify(j, null, 2));
      return c;
    },
  },
  {
    name: "eine Ausnahme ueberlebt ihren Grund",
    pruefung: "pflicht",
    mach: (s) => {
      const c = klon(s);
      const j = JSON.parse(c.files.get(ALLOWLIST));
      j.ausnahmen["class-progress.ts#listClassTraps"] = "Diese Funktion nimmt laengst einen Ausschnitt; der Eintrag haette gestrichen werden muessen.";
      c.files.set(ALLOWLIST, JSON.stringify(j, null, 2));
      return c;
    },
  },
];

const echt = laden();
const befunde = lauf(echt);

if (selftest) {
  let schlecht = 0;
  for (const [name, liste] of Object.entries(befunde)) {
    if (liste.length) {
      console.error(`✗ Selbsttest unbrauchbar: ${name} ist schon ohne Manipulation rot`);
      schlecht++;
    }
  }
  for (const fall of FAELLE) {
    const r = lauf(fall.mach(echt));
    if (r[fall.pruefung].length === 0) {
      console.error(`✗ Selbsttest: »${fall.name}« liess ${fall.pruefung} gruen`);
      schlecht++;
    } else {
      console.log(`  ok   ${fall.pruefung} wird rot: ${fall.name}`);
    }
  }
  if (schlecht) process.exit(1);
  console.log(`check-claim-filter --selftest: OK — ${FAELLE.length} rote Lichter bewiesen`);
  process.exit(0);
}

let fehler = 0;
for (const [name, liste] of Object.entries(befunde)) {
  if (liste.length === 0) console.log(`  ok   ${name}`);
  for (const z of liste) {
    console.error(`✗ ${name}: ${z}`);
    fehler++;
  }
}
if (fehler) {
  console.error(`check-claim-filter: ${fehler} Verstoesse`);
  process.exit(1);
}
const gezaehlt = [...echt.db.values()].reduce((n, src) => n + funktionen(src).filter((f) => f.koerper.includes("classScope")).length, 0);
console.log(`check-claim-filter: OK — ${gezaehlt} Funktionen filtern auf den Ausschnitt, ${Object.keys(lade(echt).ausnahmen).length} begruendete Ausnahmen`);
