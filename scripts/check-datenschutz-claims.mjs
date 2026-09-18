#!/usr/bin/env node
// gomarke-008 · DIE DATENSCHUTZSEITE DARF NICHT STILL UNWAHR WERDEN.
//
// Seit PR #437 hat DomiGo eine Datenschutzseite, und jeder Satz darauf ist eine
// Behauptung über die Produktion. Zwei dieser Sätze hielt bisher NICHTS außer
// Disziplin (PR #437, Abschnitt »Befunde, die NICHT in diesen PR gehören«):
//
//   »Es gibt keine Werbung, keine Analyse- oder Tracking-Dienste, und die
//    Schriften kommen vom eigenen Server.«
//   »DomiGo speichert keine E-Mail-Adressen von Kindern.«
//
// Den ersten Satz widerlegt eine einzige Zeile — ein @vercel/analytics im Layout,
// eine Google-Schrift in einer CSS-Datei, und die Seite lügt, ohne dass jemand sie
// angefasst hat. Der zweite hängt daran, dass genau EIN Weg im Code die Spalte
// email der geteilten Tabelle users beschreibt; kommt ein zweiter dazu, ist der
// Satz eine Hoffnung. Beides ist prüfbar, also wird es geprüft.
//
// GESETZ 1 »keine Dritten«: keine eingecheckte, ausführbare oder ausgelieferte
// Datei unter apps/ oder packages/ nennt einen Analyse-, Werbe-, Tracking- oder
// Schrift-Dienst — weder als Import noch als Adresse in CSS, JSON oder Konfiguration.
//
// GESETZ 2 »eine Tür für die E-Mail«: die Spalte email von domigo_v2.users wird an
// genau einer Stelle geschrieben. Jede Datei, die v2IdentityUsers benutzt (oder
// rohes SQL auf users fährt) UND eine email-Zuweisung trägt, ist ein Schreiber;
// erlaubt sind die Tür und die Ausnahmen unten, mit Grund. RATSCHE: eine Ausnahme,
// die auf nichts mehr zeigt, geht VERALTET und färbt dieses Tor rot — dasselbe
// Muster, das check-journal-door.mjs und check-ci-gates.mjs tragen.
//
// Was hier NICHT geprüft wird, weil es schon ein Tor hat: next/font/google als
// Import gehört check-fonts.mjs (Schuld D-79). Dieses Tor sieht dafür mehr Dateien:
// check-fonts.mjs läuft über apps/web/app|components|lib, also gerade NICHT über
// next.config.ts, apps/web/public/ und die package.json — die Stellen, an denen ein
// Analyse-Schnipsel wirklich eintrifft. Verzeichnis-Wahl: git ls-files, denn was
// nicht eingecheckt ist, kann auch nicht ausgerollt werden (wie check-secrets.mjs).
// scripts/ bleibt außen vor: von dort geht nichts in den Browser, und dieses Tor
// müsste sich sonst selbst melden.
//
// Lauf: node scripts/check-datenschutz-claims.mjs            (exit 1 bei Verstoß)
//       node scripts/check-datenschutz-claims.mjs --selftest  (beweist das rote Licht)

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const R = process.cwd();
const selbsttest = process.argv.includes("--selftest");

const WURZELN = ["apps/", "packages/"];
const TEXT_ENDUNG = /\.(ts|tsx|js|jsx|mjs|cjs|mts|json|css|scss|md|html|txt|yml|yaml|svg)$/;
// Gesetz 1 liest nur, was ausgeführt oder ausgeliefert wird. Eine Lizenz- oder
// Notiz-Datei kann nicht telefonieren: apps/web/app/fonts/LICENSE.md ERKLÄRT, dass
// die Schriften einmal von einem Google-Server geholt und dann eingecheckt wurden —
// beim ersten Lauf dieses Tors war genau dieser Satz einer von zwei Fehlalarmen.
const AUSFUEHRBAR = /\.(ts|tsx|js|jsx|mjs|cjs|mts|json|css|scss|html|svg)$/;

// Eine Zeile, die den Dienst nur ERWÄHNT, ruft ihn nicht auf. Der zweite Fehlalarm
// beim ersten Lauf war der Kopf-Kommentar von apps/web/app/layout.tsx, der erklärt,
// warum die Schriften NICHT mehr von dort kommen. Also fällt der Kommentar-Teil einer
// Zeile vor der Prüfung weg — aber nur ein Doppelstrich, vor dem kein Doppelpunkt
// steht, sonst kürzt sich eine https-Adresse selbst weg und das Tor wäre blind.
const ohneKommentar = (zeile) =>
  zeile
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*(\/\/|\*|<!--|#).*$/, "")
    .replace(/(^|[^:])\/\/.*$/, "$1");

// ── Gesetz 1 · die Dienste, die diese Seite ausschließt ─────────────────────
// Jedes Muster trifft eine ADRESSE oder einen PAKETNAMEN, nie ein deutsches Wort:
// »plausible« steht als Hilfetext in der Oberfläche (app/admin/studio/new), und ein
// Tor, das bei richtiger Arbeit rot wird, wird abgeschaltet (check-secrets.mjs).
const DIENSTE = [
  { name: "Vercel Analytics", muster: /@vercel\/analytics/ },
  { name: "Vercel Speed Insights", muster: /@vercel\/speed-insights/ },
  { name: "Google Tag Manager", muster: /googletagmanager\.com/ },
  { name: "Google Analytics", muster: /google-analytics\.com|\bgtag\s*\(/ },
  { name: "Google Fonts (Adresse)", muster: /fonts\.(googleapis|gstatic)\.com/ },
  { name: "Plausible", muster: /plausible\.io|["']plausible-tracker["']/ },
  { name: "PostHog", muster: /posthog(-js|\.com)|from\s+["']posthog/ },
  { name: "Hotjar", muster: /hotjar\.com/ },
  { name: "Microsoft Clarity", muster: /clarity\.ms/ },
  { name: "Matomo", muster: /matomo\.(cloud|js|php)|_paq\.push/ },
  { name: "Mixpanel", muster: /mixpanel(-browser|\.com)/ },
  { name: "Segment", muster: /cdn\.segment\.com/ },
  { name: "Sentry", muster: /@sentry\// },
];

// Wer die Muster NENNEN darf, ohne sie zu benutzen — mit Grund, und unter derselben
// Ratsche wie die Ausnahmen von Gesetz 2.
const GESETZ1_AUSNAHMEN = [
  {
    datei: "apps/web/lib/datenschutz-page.test.ts",
    grund:
      "die Kopplung nennt die Paketnamen, damit dieses Tor nicht still verschwinden kann — sie prüft, sie lädt nichts",
  },
];

// ── Gesetz 2 · die eine Tür ─────────────────────────────────────────────────
const TUER = "packages/db/src/teacher-identity.ts";
const AUSNAHMEN = [
  {
    datei: "packages/db/src/schema.ts",
    grund:
      'erklärt die Spalte (text("email")) und warum Kinder keine bekommen — eine Deklaration, kein Schreiber',
  },
];
const NUTZT_TABELLE = /v2IdentityUsers/;
const MAIL_ZUWEISUNG = /(^|[^a-zA-Z])email\s*:/;
const ROHES_SQL = /(insert\s+into|update)\s+(domigo_v2\.)?"?users"?\b/i;

let fehler = 0;
const gemeldet = [];
const melde = (zeile) => {
  fehler++;
  gemeldet.push(zeile);
  console.error("✗ " + zeile);
};

/** jede eingecheckte Textdatei unter apps/ und packages/ */
const eingecheckt = () =>
  execFileSync("git", ["ls-files", "-z"], { cwd: R, maxBuffer: 64 * 1024 * 1024 })
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .filter((rel) => WURZELN.some((w) => rel.startsWith(w)))
    .filter((rel) => TEXT_ENDUNG.test(rel));

const liesEcht = (rel) => fs.readFileSync(path.join(R, rel), "utf8");

// Der Selbsttest hängt Dateien NUR IM SPEICHER an: vier echte Defekte, die gemeldet
// werden müssen, und fünf Beinahe-Treffer, die still bleiben müssen. Ein Selbsttest,
// der bloß beweist, dass etwas rot werden KANN, hat nicht bewiesen, dass das Tor
// unterscheidet (P-56).
const KOEDER = [
  ["apps/web/app/__selbsttest-analytics.tsx", 'import { Analytics } from "@vercel/analytics/react";\n'],
  ["apps/web/app/__selbsttest-schrift.css", '@import url("https://fonts.googleapis.com/css2?family=Inter");\n'],
  // der Gegenbeweis zum Kommentar-Filter: eine echte Zeile mit Kommentar dahinter
  // darf nicht durchrutschen
  ["apps/web/app/__selbsttest-hinterher.ts", 'const s = "https://cdn.segment.com/analytics.js"; // nur zur Ansicht\n'],
  [
    "packages/db/src/__selbsttest-zweite-tuer.ts",
    'import { v2IdentityUsers } from "./schema.ts";\nawait db.insert(v2IdentityUsers).values({ role: "student", email: eingabe.adresse });\n',
  ],
];
const BEINAHE = [
  ["apps/web/app/__selbsttest-wort.tsx", "// eine plausible Antwort, die ein Kind schreiben würde\nconst plausible = true;\n"],
  ["apps/web/app/__selbsttest-lokal.ts", 'import localFont from "next/font/local";\n// einmal von fonts.gstatic.com geholt und eingecheckt — erklärt, benutzt nicht\n'],
  ["apps/web/app/__selbsttest-lizenz.md", "Die Schriften wurden einmal von fonts.gstatic.com geholt und liegen jetzt im Repo.\n"],
  ["apps/web/lib/__selbsttest-mailer.ts", "// Lehrer-Mail, ganz ohne die Tabelle\nsende({ email: lehrkraft.adresse });\n"],
  ["packages/db/src/__selbsttest-leser.ts", 'import { v2IdentityUsers } from "./schema.ts";\nawait db.select().from(v2IdentityUsers);\n'],
];

const dateien = eingecheckt();
const erfunden = selbsttest ? new Map([...KOEDER, ...BEINAHE]) : new Map();
const alle = [...dateien, ...erfunden.keys()];
const lies = (rel) => (erfunden.has(rel) ? erfunden.get(rel) : liesEcht(rel));

// ── Gesetz 1 ────────────────────────────────────────────────────────────────
const getroffeneProsa = new Set();
for (const rel of alle) {
  if (!AUSFUEHRBAR.test(rel)) continue;
  const zeilen = lies(rel).split(/\r\n|\r|\n/);
  for (const dienst of DIENSTE) {
    zeilen.forEach((rohzeile, i) => {
      if (!dienst.muster.test(ohneKommentar(rohzeile))) return;
      if (GESETZ1_AUSNAHMEN.some((a) => a.datei === rel)) {
        getroffeneProsa.add(rel);
        return;
      }
      melde(
        rel + ":" + (i + 1) + " · Gesetz 1 »keine Dritten«: " + dienst.name + "\n    " + rohzeile.trim() + "\n" +
          "    ⇒ Die Datenschutzseite sagt »keine Werbung, keine Analyse- oder Tracking-Dienste, und die " +
          "Schriften kommen vom eigenen Server«. Entweder der Dienst geht, oder der Satz geht — und mit ihm " +
          "die Kopplung in apps/web/lib/datenschutz-page.test.ts.",
      );
    });
  }
}

// ── Gesetz 2 ────────────────────────────────────────────────────────────────
const tabellenNutzer = [];
const getroffeneAusnahmen = new Set();
for (const rel of alle) {
  const text = lies(rel);
  if (!NUTZT_TABELLE.test(text) && !ROHES_SQL.test(text)) continue;
  tabellenNutzer.push(rel);
  text.split(/\r\n|\r|\n/).forEach((zeile, i) => {
    const schreibtMail = MAIL_ZUWEISUNG.test(zeile) || (ROHES_SQL.test(zeile) && /email/i.test(zeile));
    if (!schreibtMail) return;
    if (rel === TUER) return;
    if (AUSNAHMEN.some((a) => a.datei === rel)) {
      getroffeneAusnahmen.add(rel);
      return;
    }
    melde(
      rel + ":" + (i + 1) + " · Gesetz 2 »eine Tür für die E-Mail«\n    " + zeile.trim() + "\n" +
        "    ⇒ Nur " + TUER + " darf die Spalte email der Tabelle users schreiben (sie tut es nur für " +
        "Lehrkräfte). Die Seite sagt »DomiGo speichert keine E-Mail-Adressen von Kindern« — entweder über " +
        "die Tür schreiben oder hier als Ausnahme MIT GRUND eintragen.",
    );
  });
}

// ── Die Ratschen: eine Ausnahme darf eine Lücke dulden, nie überleben ────────
for (const a of GESETZ1_AUSNAHMEN) {
  if (getroffeneProsa.has(a.datei)) continue;
  melde(
    "AUSNAHME VERALTET: " + a.datei + " nennt keinen der gesperrten Dienste mehr — Eintrag in " +
      "scripts/check-datenschutz-claims.mjs streichen.",
  );
}
for (const a of AUSNAHMEN) {
  if (getroffeneAusnahmen.has(a.datei)) continue;
  melde(
    "AUSNAHME VERALTET: " + a.datei + " weist der Spalte email gar nichts mehr zu — Eintrag in " +
      "scripts/check-datenschutz-claims.mjs streichen.",
  );
}

// ── Vakuitäts-Wächter: ein Tor ohne Gegenstand ist grün und wertlos ─────────
if (!selbsttest) {
  if (dateien.length === 0) {
    melde("keine eingecheckte Datei unter apps/ oder packages/ gefunden — dieses Tor prüft nichts mehr");
  }
  if (!tabellenNutzer.includes(TUER)) {
    melde(
      TUER + " benutzt v2IdentityUsers nicht mehr — Gesetz 2 hat seine Tür verloren und bewacht nichts; " +
        "dieses Tor neu lesen, nicht löschen",
    );
  }
}

// ── Selbsttest: die Köder müssen erkannt, die Beinahe-Treffer still sein ────
if (selbsttest) {
  const fehlend = KOEDER.map(([rel]) => rel).filter((rel) => !gemeldet.some((m) => m.startsWith(rel)));
  const falschAlarm = BEINAHE.map(([rel]) => rel).filter((rel) => gemeldet.some((m) => m.startsWith(rel)));
  // Eine VERALTETE Ausnahme zählt hier mit: sie ist ein echter Verstoß, und beim
  // ersten Lauf dieses Tors (17.09.) meldete der Selbsttest »echter Stand grün«,
  // während der Echtlauf genau daran rot war.
  const echteVerstoesse = gemeldet.filter((m) => !erfunden.has(m.split(":")[0]));

  if (fehlend.length > 0) {
    console.error("✗ SELBSTTEST GESCHEITERT: absichtlich eingebaut, aber nicht gemeldet: " + fehlend.join(", "));
    process.exit(1);
  }
  if (falschAlarm.length > 0) {
    console.error(
      "✗ SELBSTTEST GESCHEITERT: Beinahe-Treffer gemeldet, das Tor unterscheidet nicht: " + falschAlarm.join(", "),
    );
    process.exit(1);
  }
  if (echteVerstoesse.length > 0) {
    console.error("✗ SELBSTTEST GESCHEITERT: der echte Stand ist schon ohne Manipulation rot:");
    for (const m of echteVerstoesse) console.error("    " + m.split("\n")[0]);
    process.exit(1);
  }
  console.log(
    "check-datenschutz-claims SELBSTTEST: OK — " + KOEDER.length + " erfundene Defekte erkannt, " +
      BEINAHE.length + " Beinahe-Treffer still, echter Stand grün (" + dateien.length + " Dateien)",
  );
  process.exit(0);
}

if (fehler > 0) {
  console.error("check-datenschutz-claims: " + fehler + " Verstoß/Verstöße");
  process.exit(1);
}
console.log(
  "check-datenschutz-claims: OK — " + dateien.length + " eingecheckte Dateien ohne Analyse-, Werbe-, " +
    "Tracking- oder Schrift-Dienst; die Spalte email der Tabelle users hat eine Tür (" + TUER + ") und " +
    AUSNAHMEN.length + " begründete Ausnahme(n)",
);
