#!/usr/bin/env node
/**
 * P-R8 · DAS TOR, DAS DIE TUER ZUM KLASSEN-JOURNAL BEWACHT.
 *
 * WARUM ES DAS GIBT: Das Journal `domigo_v2.roster_events` trug volle Klarnamen
 * echter Kinder, weil die Regel »nur Ids, Zahlen, Laengen« nirgends stand — sie
 * war Disziplin, verteilt auf elf Schreibstellen in fuenf Modulen. P-R8 hat
 * daraus EINE Tuer gemacht (`packages/db/src/roster-events.ts`, mit Waechter).
 * Eine Tuer schuetzt aber nur, solange niemand danebengreift, und das naechste
 * Modul, das eine Journal-Zeile braucht, wird die Tuer nicht kennen.
 *
 * Also: die Regel hoert auf, eine Gewohnheit zu sein, und wird eine Pruefung.
 * Wer `insert(v2RosterEvents)` ausserhalb der Tuer schreibt — oder rohes
 * `insert into domigo_v2.roster_events` ausserhalb der deklarierten Ausnahmen —
 * faerbt CI rot, bevor die erste Zeile mit einem Namen in der Tabelle steht.
 *
 * RATSCHE: eine Ausnahme darf eine bekannte Luecke dulden, sie darf sie nie
 * ueberleben. Zeigt eine Ausnahme auf nichts mehr, geht sie STALE und faerbt
 * dieses Tor rot — dasselbe Muster, das check-ci-gates.mjs traegt.
 *
 * Lauf:  node scripts/check-journal-door.mjs
 * Probe: node scripts/check-journal-door.mjs --selftest
 *        (baut Verstoesse IM SPEICHER und weist nach, dass jede Regel und die
 *         Ratsche rot werden koennen — ein Tor, dem nie jemand beim Scheitern
 *         zugesehen hat, ist nicht als funktionierend nachgewiesen.)
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const REPO = fileURLToPath(new URL("../", import.meta.url));

/** Die eine Datei, die eine Journal-Zeile schreiben darf. */
const TUER = "packages/db/src/roster-events.ts";

/**
 * Deklarierte Ausnahmen fuer den ROH-SQL-Weg, je mit Grund. Jede muss auch
 * wirklich zutreffen (Ratsche unten) — eine Ausnahme ohne Verstoss ist tote
 * Erlaubnis und wird gemeldet.
 */
const AUSNAHMEN = [
  {
    datei: "packages/db/scripts/seed-dev.mjs",
    grund:
      "Der Dev-Saeer legt die Testklassen per rohem SQL an (kein drizzle im Skript) und schreibt " +
      "ausdruecklich { source, count } — erfundene Daten, keine Namen. Er laeuft nur gegen die v2-dev-Compute.",
  },
];

/** Wo gesucht wird, und was dabei nie mitgelesen wird. */
const WURZELN = ["apps", "packages", "scripts", "docs"];
const NIE = new Set(["node_modules", ".next", ".git", ".claude", "dist", ".turbo", ".vercel", "coverage"]);
const ENDUNGEN = [".ts", ".tsx", ".mjs", ".js", ".cjs", ".sql"];

/**
 * Diese Datei liest sich selbst nicht — sie traegt die gesuchten Zeichenketten
 * als SUCHSCHLUESSEL im Klartext, und ein Waechter, der seinen eigenen
 * Suchschluessel findet, meldet sich selbst an (die Falle, in die schon drei
 * Quelltext-Waechter dieses Repos getappt sind).
 */
const SELBST = "scripts/check-journal-door.mjs";

/** Alle in Frage kommenden Dateien, relativ zur Repo-Wurzel, maschinell aufgezaehlt. */
function alleDateien() {
  const raus = [];
  const lauf = (rel) => {
    const abs = REPO + rel;
    for (const eintrag of readdirSync(abs)) {
      if (NIE.has(eintrag)) continue;
      const kind = rel + "/" + eintrag;
      if (statSync(REPO + kind).isDirectory()) lauf(kind);
      else if (ENDUNGEN.some((e) => eintrag.endsWith(e)) && kind !== SELBST) raus.push(kind);
    }
  };
  for (const w of WURZELN) lauf(w);
  return raus.sort();
}

const REGELN = [
  {
    name: "drizzle-Weg",
    muster: /\.insert\s*\(\s*v2RosterEvents\s*\)/,
    erlaubt: (rel) => rel === TUER,
    hinweis: `nur ${TUER} darf das — rufe stattdessen writeRosterEvent(db, { … }) auf.`,
  },
  {
    name: "Roh-SQL-Weg",
    muster: /insert\s+into\s+(domigo_v2\.)?roster_events\b/i,
    erlaubt: (rel) => AUSNAHMEN.some((a) => a.datei === rel),
    hinweis: "rohes SQL umgeht den Waechter vollstaendig — entweder ueber die Tuer schreiben oder hier als Ausnahme MIT GRUND deklarieren.",
  },
];

/**
 * Der Durchlauf. `lies` ist einspeisbar, damit der Selbsttest Kopien im Speicher
 * verbiegen kann, ohne die Platte anzufassen.
 */
function pruefe(dateien, lies) {
  const verstoesse = [];
  const getroffen = new Set();
  for (const rel of dateien) {
    const zeilen = lies(rel).split(/\r\n|\r|\n/);
    for (const regel of REGELN) {
      zeilen.forEach((zeile, i) => {
        if (!regel.muster.test(zeile)) return;
        if (regel.erlaubt(rel)) {
          getroffen.add(rel);
          return;
        }
        verstoesse.push(`  ${rel}:${i + 1} · ${regel.name}\n    ${zeile.trim()}\n    ⇒ ${regel.hinweis}`);
      });
    }
  }
  // Ratsche: eine Ausnahme, die auf nichts mehr zeigt, ist tote Erlaubnis.
  const stale = AUSNAHMEN.filter((a) => !getroffen.has(a.datei)).map(
    (a) => `  AUSNAHME VERALTET: ${a.datei} schreibt gar keine Journal-Zeile mehr — Eintrag in ${SELBST} streichen.`,
  );
  return { verstoesse, stale };
}

const vonPlatte = (rel) => readFileSync(REPO + rel, "utf8");

// ── Selbsttest ───────────────────────────────────────────────────────────────
if (process.argv.includes("--selftest")) {
  console.log("Selbsttest des Journal-Tors:\n\n1 · der echte Baum — erwartet: GRUEN");
  const echteDateien = alleDateien();
  const echt = pruefe(echteDateien, vonPlatte);
  if (echt.verstoesse.length > 0 || echt.stale.length > 0) {
    console.error("\nFEHLGESCHLAGEN: der echte Baum ist schon rot:\n" + [...echt.verstoesse, ...echt.stale].join("\n"));
    process.exit(1);
  }
  console.log("  gruen.");

  // Zwei erfundene Verstoesse, je einer pro Regel. Nur im Speicher.
  const proben = [
    {
      was: "eine Vorbei-Schreibstelle im drizzle-Weg",
      datei: "packages/db/src/erfundenes-modul.ts",
      inhalt: 'await db.insert(v2RosterEvents).values({ classId, kind: "import", payload: { names } });\n',
    },
    {
      was: "eine Vorbei-Schreibstelle im Roh-SQL-Weg",
      datei: "packages/db/scripts/erfundenes-skript.mjs",
      inhalt: "await sql`insert into domigo_v2.roster_events (class_id, kind, payload) values (…)`;\n",
    },
  ];
  let schritt = 2;
  for (const probe of proben) {
    console.log(`\n${schritt} · ${probe.was} — erwartet: ROT`);
    const { verstoesse } = pruefe([...echteDateien, probe.datei], (rel) => (rel === probe.datei ? probe.inhalt : vonPlatte(rel)));
    if (verstoesse.length === 0) {
      console.error("\nFEHLGESCHLAGEN: der Verstoss blieb unbemerkt — das Tor sieht nicht, was es zu sehen behauptet.");
      process.exit(1);
    }
    console.log("  ROT wie erwartet:\n" + verstoesse.join("\n"));
    schritt += 1;
  }

  console.log(`\n${schritt} · eine Ausnahme, die auf nichts mehr zeigt — erwartet: ROT (Ratsche)`);
  const ohneSaeer = echteDateien.filter((d) => !AUSNAHMEN.some((a) => a.datei === d));
  const { stale } = pruefe(ohneSaeer, vonPlatte);
  if (stale.length === 0) {
    console.error("\nFEHLGESCHLAGEN: die Ratsche greift nicht — eine tote Erlaubnis darf nicht still weiterleben.");
    process.exit(1);
  }
  console.log("  ROT wie erwartet:\n" + stale.join("\n"));
  console.log("\nSelbsttest bestanden: gruen am echten Baum, rot an jeder Regel und an der Ratsche.");
  process.exit(0);
}

// ── Der echte Lauf ───────────────────────────────────────────────────────────
console.log("Journal-Tuer (roster_events):");
const dateien = alleDateien();
const { verstoesse, stale } = pruefe(dateien, vonPlatte);
if (verstoesse.length > 0 || stale.length > 0) {
  console.error(
    `\nAM WAECHTER VORBEI GESCHRIEBEN — ${verstoesse.length} Stelle(n), ${stale.length} tote Ausnahme(n).\n` +
      "Jede Journal-Zeile geht durch writeRosterEvent (P-R8): dort und nur dort wird die\n" +
      "Nutzlast gegen das Vokabular geprueft, damit nie wieder ein Kindername in der Tabelle landet.\n\n" +
      [...verstoesse, ...stale].join("\n"),
  );
  process.exit(1);
}
console.log(`  ${dateien.length} Dateien gelesen · genau eine Schreibstelle, und die ist die Tuer (${TUER}) · ${AUSNAHMEN.length} deklarierte Ausnahme(n), alle noch zutreffend.`);
