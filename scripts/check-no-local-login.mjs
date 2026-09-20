#!/usr/bin/env node
// dach-018 · KEIN EIGENES PASSWORT MEHR — SPEC konto V1.1-FINAL §6 und §11
// (Zeile `test:no-local-login`), Nachtrag N-11.
// dach-108 · OHNE DATUM (Koki 19.09., E-3 »Tabula rasa«, E-8 »kein Datum in einem Tor«).
//
// DomiGo prueft keine PIN und kein Passwort; angemeldet wird nur bei konto. Bis zum
// 19.09. stand die alte PIN-Anmeldung als datierter Rueckfall daneben und dieses Tor
// schaute auf die Uhr. Jetzt gibt es keine Uhr mehr: was es prueft, gilt an jedem Tag
// gleich, und kein Tag kann es rot oder gruen machen.
//
// Was neben konto ueberlebt, steht in apps/web/konto-local-login-allowlist.json —
// jeder Eintrag mit Grund und OHNE Ablaufdatum (ops-link, dev-identity).
//
// Sieben Pruefungen:
//   provider  · auth.ts traegt nur konto-handoff und deklarierte Reste; keine
//               unbenannten Credentials, keine PIN-Pruefung; der jwt-Callback
//               entscheidet ueber sitzungsRegel, und die gibt einem Cookie ohne
//               `via` (aus der PIN-Zeit) keine Sitzung.
//   formen    · kein PIN-Feld irgendwo unter apps/web/app; eine Stelle, die eine PIN
//               schreibt, nur benannt in `tote_pin_schreiber` (mit Satz), und eine
//               benannte Stelle, die keine mehr schreibt, ist Rost.
//   umleitung · jede der fuenf alten Tueren gibt es noch und sie tut NUR
//               redirect(tuerZiel("<tuer>", …)) — 307, nie 308, keine Datenbank,
//               keine Server-Aktion, kein Formular.
//   klassen   · jede lokale Klassen-/Listen-Schreibroute antwortet NUR mit
//               lokalesSchreibenZu() (405 + Satz + Lehrer-Raum).
//   datum     · kein Datum und keine Uhr in den Regel-Modulen, den Tueren und den
//               Anmeldeseiten; kein Ablauf-/Stichtagsfeld in der Allowlist.
//   dev       · jede DEV_-Umgehung steht hinter einem Waechter auf VERCEL_ENV.
//   reste     · jeder Rest mit Grund (≥ 40 Zeichen); ein PIN-Anbieter ist nie ein Rest.
//
// Lauf: node scripts/check-no-local-login.mjs            (exit 1 bei jedem Verstoss)
//       node scripts/check-no-local-login.mjs --selftest (beweist jedes rote Licht)

import fs from "node:fs";
import path from "node:path";

const R = process.cwd();
const selftest = process.argv.includes("--selftest");

const ALLOWLIST = "apps/web/konto-local-login-allowlist.json";
const AUTH = "apps/web/auth.ts";
const REGELN = "apps/web/lib/konto/regeln.ts";
const RESTE = "apps/web/lib/konto/reste.ts";
const ANTWORT = "apps/web/lib/konto/klassen-antwort.ts";
/** Die Anbieter der alten PIN-Anmeldung — keiner darf zurueckkehren, auch nicht als Rest. */
const PIN_PROVIDER = ["student", "teacher"];

/** Die Anmeldeseiten und die fuenf Tueren, die eine PIN entgegennahmen. */
const SEITEN = ["apps/web/app/signin/page.tsx", "apps/web/app/admin/signin/page.tsx"];
const TUEREN = [
  { rel: "apps/web/app/join/[code]/page.tsx", tuer: "join" },
  { rel: "apps/web/app/lehrkraft/[token]/page.tsx", tuer: "lehrkraft" },
  { rel: "apps/web/app/lehrkraft/pin-reset/[token]/page.tsx", tuer: "pin-reset" },
  { rel: "apps/web/app/lehrkraft/pin-vergessen/page.tsx", tuer: "pin-vergessen" },
  { rel: "apps/web/app/bootstrap/page.tsx", tuer: "bootstrap" },
];
/** Die lokalen Schreibrouten fuer Klassen und Klassenlisten, je mit ihren Verben. */
const KLASSEN_SCHREIBER = [
  { rel: "apps/web/app/api/admin/classes/route.ts", verben: ["POST"] },
  { rel: "apps/web/app/api/admin/classes/[id]/route.ts", verben: ["PATCH", "POST", "DELETE"] },
  { rel: "apps/web/app/api/admin/classes/[id]/roster/route.ts", verben: ["POST"] },
];

const PIN_FORM = /type=["']password["']|pattern=["']\[0-9\]\{/;
const PIN_SCHREIBER = /\bhashPin\(|\bcreateV2Teacher\(/;
const CREDENTIALS = /Credentials\(\s*\{/g;
const PROVIDER_ID = /id:\s*(?:KONTO_PROVIDER|OPS_PROVIDER|["']([a-z-]+)["'])/g;
/** Ein Kalenderdatum oder eine Uhr im Code. Kommentare zaehlen nicht (siehe code()). */
const DATUM = /\b20\d\d-\d\d-\d\d\b|\bnew Date\(|\bDate\.now\(|Intl\.DateTimeFormat|\bwienerTag\b/;
/** Felder, mit denen eine Liste etwas an einem Tag enden liesse. */
const DATUMSFELD = /"(ablauf|until|bis|\w*tag)"\s*:/i;

const lies = (rel) => fs.readFileSync(path.join(R, rel), "utf8");

/** Der Quelltext ohne Kommentare — ein Datum in einer Erklaerung schaltet nichts. */
function code(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");
}

/** Der Rumpf einer exportierten Routen-Funktion `export … function VERB(`. */
function rumpf(src, verb) {
  const m = new RegExp(`export\\s+(?:async\\s+)?function\\s+${verb}\\s*\\([^)]*\\)[^{]*\\{`).exec(src);
  if (!m) return null;
  let tiefe = 1;
  let i = m.index + m[0].length;
  const ab = i;
  while (i < src.length && tiefe > 0) {
    if (src[i] === "{") tiefe++;
    else if (src[i] === "}") tiefe--;
    i++;
  }
  return src.slice(ab, i - 1);
}

const PRUEFUNGEN = {
  provider(state) {
    const raus = [];
    const src = state.files.get(AUTH);
    const liste = JSON.parse(state.files.get(ALLOWLIST));
    const erlaubt = new Set(["konto-handoff", ...liste.reste.map((r) => r.provider)]);
    const anzahl = (src.match(CREDENTIALS) ?? []).length;
    const ids = [];
    let m;
    PROVIDER_ID.lastIndex = 0;
    while ((m = PROVIDER_ID.exec(src))) ids.push(m[1] ?? (m[0].includes("KONTO") ? "konto-handoff" : "ops-link"));
    for (const id of ids) {
      if (PIN_PROVIDER.includes(id)) raus.push(`auth.ts: der PIN-Anbieter »${id}« ist zurueck — DomiGo prueft keine PIN mehr`);
      else if (!erlaubt.has(id)) raus.push(`auth.ts: Provider »${id}« steht in keiner Rest-Liste`);
    }
    if (anzahl > ids.length) raus.push(`auth.ts: ${anzahl} Credentials-Provider, aber nur ${ids.length} benannte Kennungen`);
    if (/\bverifyStudent\b|\bverifyTeacher\b|\bverifyPin\b/.test(code(src))) {
      raus.push("auth.ts: eine PIN-Pruefung (verifyStudent/verifyTeacher/verifyPin) steht wieder da");
    }
    if (!/sitzungsRegel\(/.test(code(src))) raus.push("auth.ts: der jwt-Callback entscheidet nicht ueber sitzungsRegel (alte Cookies ohne via!)");
    const rg = code(state.files.get(REGELN));
    if (!/if \(via === null\) return "tot";/.test(rg)) {
      raus.push("lib/konto/regeln.ts: sitzungsRegel gibt einem Cookie ohne via (aus der PIN-Zeit) nicht fest »tot«");
    }
    return raus;
  },

  formen(state) {
    const raus = [];
    for (const [rel, src] of state.web) {
      if (!rel.startsWith("apps/web/app/")) continue;
      if (PIN_FORM.test(src)) raus.push(`${rel}: ein PIN-/Passwort-Feld — DomiGo nimmt keine PIN mehr entgegen`);
    }
    for (const rel of SEITEN) if (!state.web.has(rel)) raus.push(`${rel}: fehlt`);
    const tote = JSON.parse(state.files.get(ALLOWLIST)).tote_pin_schreiber?.stellen ?? {};
    for (const [rel, src] of state.web) {
      if (!rel.startsWith("apps/web/app/")) continue;
      if (!PIN_SCHREIBER.test(code(src))) continue;
      const satz = tote[rel];
      if (!satz) raus.push(`${rel}: legt wieder eine eigene PIN an`);
      else if (satz.length < 40) raus.push(`${rel}: eine tote PIN-Stelle braucht einen Satz, keine Notiz`);
    }
    // Rost: eine benannte Stelle, die keine PIN mehr schreibt, gehoert gestrichen.
    for (const rel of Object.keys(tote)) {
      const src = state.web.get(rel);
      if (src === undefined) raus.push(`${rel}: benannt, aber die Datei gibt es nicht mehr`);
      else if (!PIN_SCHREIBER.test(code(src))) raus.push(`${rel}: benannt, schreibt aber laengst keine PIN mehr — Eintrag streichen`);
    }
    return raus;
  },

  umleitung(state) {
    const raus = [];
    for (const t of TUEREN) {
      const src = state.web.get(t.rel);
      if (src === undefined) {
        raus.push(`${t.rel}: fehlt — eine der fuenf Tueren ist verschwunden statt umgeleitet (ein alter Link liefe ins Leere)`);
        continue;
      }
      const c = code(src);
      if (!c.includes(`redirect(tuerZiel("${t.tuer}"`)) raus.push(`${t.rel}: leitet nicht mit redirect(tuerZiel("${t.tuer}", …)) weiter`);
      if (/permanentRedirect\(|status:\s*308|,\s*308\s*\)/.test(c)) raus.push(`${t.rel}: eine dauerhafte Weiterleitung (308) — der Browser merkte sie sich fuer immer`);
      if (/@domigo\/db/.test(c)) raus.push(`${t.rel}: greift auf die Datenbank zu — die Tuer gehoert ganz zu konto`);
      if (/"use server"/.test(c)) raus.push(`${t.rel}: traegt eine Server-Aktion — eine Tuer nimmt nichts mehr entgegen`);
      if (/<form\b/.test(c)) raus.push(`${t.rel}: traegt ein Formular — eine Tuer nimmt nichts mehr entgegen`);
    }
    if (/permanentRedirect\(|status:\s*308/.test(code(state.files.get(REGELN)))) raus.push("lib/konto/regeln.ts: eine dauerhafte Weiterleitung (308)");
    return raus;
  },

  klassen(state) {
    const raus = [];
    for (const k of KLASSEN_SCHREIBER) {
      const src = state.web.get(k.rel);
      if (src === undefined) {
        raus.push(`${k.rel}: fehlt`);
        continue;
      }
      for (const verb of k.verben) {
        const r = rumpf(code(src), verb);
        if (r === null) raus.push(`${k.rel}: ${verb} fehlt — Next antwortete dann 405 OHNE Satz und Lehrer-Raum`);
        else if (r.trim() !== "return lokalesSchreibenZu();") {
          raus.push(`${k.rel}: ${verb} tut mehr als lokalesSchreibenZu() — Klassen und Listen pflegt nur konto`);
        }
      }
    }
    return raus;
  },

  datum(state) {
    const raus = [];
    const pruefe = [REGELN, RESTE, ANTWORT, ...SEITEN, ...TUEREN.map((t) => t.rel), ...KLASSEN_SCHREIBER.map((k) => k.rel)];
    for (const rel of pruefe) {
      const src = state.web.get(rel) ?? state.files.get(rel);
      if (src === undefined) continue; // die zustaendige Pruefung meldet das Fehlen
      const m = code(src).match(DATUM);
      if (m) raus.push(`${rel}: »${m[0]}« — ein Datum oder eine Uhr, und nichts hier darf an einem Tag umschalten`);
    }
    const liste = state.files.get(ALLOWLIST);
    const f = liste.match(DATUMSFELD);
    if (f) raus.push(`Allowlist: das Feld »${f[1]}« — ein Rest endet, wenn ihn jemand streicht, nie an einem Tag`);
    const d = liste.match(/\b20\d\d-\d\d-\d\d\b/);
    if (d) raus.push(`Allowlist: das Datum ${d[0]} — die Liste traegt keine Daten`);
    return raus;
  },

  dev(state) {
    const raus = [];
    for (const [rel, src] of state.web) {
      // Nur echte Benutzung, nicht die Erwaehnung in einem Kommentar.
      if (!/process\.env\.DEV_(USER|TEACHER|CLASS)_ID/.test(code(src))) continue;
      if (!src.includes('VERCEL_ENV !== "production"') && !src.includes('VERCEL_ENV === "production"')) {
        raus.push(`${rel}: nutzt eine DEV_-Umgehung ohne Waechter auf VERCEL_ENV`);
      }
    }
    return raus;
  },

  reste(state) {
    const raus = [];
    const liste = JSON.parse(state.files.get(ALLOWLIST));
    for (const r of liste.reste) {
      if (PIN_PROVIDER.includes(r.provider)) raus.push(`Rest »${r.provider}«: ein PIN-Anbieter ist nie ein Rest`);
      if (!r.grund || r.grund.length < 40) raus.push(`Rest »${r.provider}«: braucht einen Grund, keine Notiz`);
    }
    return raus;
  },
};

function laden() {
  const files = new Map();
  for (const rel of [ALLOWLIST, AUTH, REGELN, RESTE, ANTWORT]) files.set(rel, lies(rel));
  const web = new Map();
  const gehe = (dir) => {
    for (const e of fs.readdirSync(path.join(R, dir), { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) gehe(rel);
      else if (/\.tsx?$/.test(e.name)) web.set(rel, lies(rel));
    }
  };
  gehe("apps/web/app");
  gehe("apps/web/lib");
  web.set(AUTH, files.get(AUTH));
  web.set("apps/web/middleware.ts", lies("apps/web/middleware.ts"));
  return { files, web };
}

function lauf(state) {
  const befunde = {};
  for (const [name, fn] of Object.entries(PRUEFUNGEN)) befunde[name] = fn(state);
  return befunde;
}

const klon = (s) => ({ files: new Map(s.files), web: new Map(s.web) });
/** Eine Datei in der Kopie aendern — und beweisen, dass die Aenderung ANKAM. */
function aendere(c, rel, von, zu, wo = "web") {
  const map = c[wo];
  const alt = map.get(rel);
  if (alt === undefined || !alt.includes(von)) throw new Error(`Selbsttest-Manipulation kam nicht an: »${von}« nicht in ${rel}`);
  map.set(rel, alt.replace(von, zu));
  if (wo === "files" && c.web.has(rel)) c.web.set(rel, map.get(rel));
}

const echt = laden();

if (selftest) {
  let schlecht = 0;
  for (const [name, liste] of Object.entries(lauf(echt))) {
    if (liste.length) {
      console.error(`✗ Selbsttest unbrauchbar: ${name} ist schon ohne Manipulation rot: ${liste[0]}`);
      schlecht++;
    }
  }
  const json = (c, fn) => {
    const j = JSON.parse(c.files.get(ALLOWLIST));
    fn(j);
    c.files.set(ALLOWLIST, JSON.stringify(j, null, 2));
  };
  const faelle = [
    {
      name: "ein fremder Credentials-Provider kehrt zurueck",
      pruefung: "provider",
      mach: (c) => aendere(c, AUTH, "id: OPS_PROVIDER,", 'id: "magic-link",', "files"),
    },
    {
      name: "der PIN-Anbieter student kehrt in auth.ts zurueck",
      pruefung: "provider",
      mach: (c) => aendere(c, AUTH, "    Credentials({\n      id: KONTO_PROVIDER,", '    Credentials({\n      id: "student",\n      credentials: { pin: {} },\n      authorize: () => null,\n    }),\n    Credentials({\n      id: KONTO_PROVIDER,', "files"),
    },
    {
      name: "ein altes Cookie ohne via wird wieder eine Sitzung",
      pruefung: "provider",
      mach: (c) => aendere(c, REGELN, 'if (via === null) return "tot";', 'if (via === null) return "rest";', "files"),
    },
    {
      name: "ein PIN-Feld auf der Anmeldeseite",
      pruefung: "formen",
      mach: (c) => aendere(c, "apps/web/app/signin/page.tsx", "<form action={goToJoin}", '<input type="password" name="pin" /><form action={goToJoin}'),
    },
    {
      name: "eine neue Stelle unter app/ legt eine PIN an",
      pruefung: "formen",
      mach: (c) => c.web.set("apps/web/app/api/neu/route.ts", "export async function POST() { await hashPin(\"123456\"); }"),
    },
    {
      name: "eine benannte tote PIN-Stelle gibt es nicht mehr (Rost)",
      pruefung: "formen",
      mach: (c) => json(c, (j) => (j.tote_pin_schreiber.stellen["apps/web/app/gibt-es-nicht.ts"] = "x".repeat(50))),
    },
    {
      name: "eine Tuer fuehrt nicht mehr ueber tuerZiel",
      pruefung: "umleitung",
      mach: (c) => aendere(c, "apps/web/app/join/[code]/page.tsx", 'redirect(tuerZiel("join", code))', 'redirect("/")'),
    },
    {
      name: "eine Tuer leitet dauerhaft um (permanentRedirect / 308)",
      pruefung: "umleitung",
      mach: (c) => aendere(c, "apps/web/app/bootstrap/page.tsx", 'redirect(tuerZiel("bootstrap", ""))', 'permanentRedirect(tuerZiel("bootstrap", ""))'),
    },
    {
      name: "eine Tuer nimmt wieder etwas entgegen (Server-Aktion + Datenbank)",
      pruefung: "umleitung",
      mach: (c) => aendere(c, "apps/web/app/lehrkraft/pin-vergessen/page.tsx", "export default", 'import { getDb } from "@domigo/db";\nasync function anfordern() { "use server"; getDb(); }\nexport default'),
    },
    {
      name: "eine Tuer verschwindet statt umzuleiten",
      pruefung: "umleitung",
      mach: (c) => c.web.delete("apps/web/app/lehrkraft/pin-reset/[token]/page.tsx"),
    },
    {
      name: "der Listen-Import schreibt wieder selbst",
      pruefung: "klassen",
      mach: (c) => aendere(c, "apps/web/app/api/admin/classes/[id]/roster/route.ts", "  return lokalesSchreibenZu();", "  if (Math.random() > 2) return lokalesSchreibenZu();\n  return importRoster();"),
    },
    {
      name: "eine Klassen-Schreibroute verliert ihr Verb (405 ohne Satz)",
      pruefung: "klassen",
      mach: (c) => aendere(c, "apps/web/app/api/admin/classes/[id]/route.ts", "export function DELETE(): Response {", "function DELETE(): Response {"),
    },
    {
      name: "ein Stichtag kehrt in die Regel zurueck",
      pruefung: "datum",
      mach: (c) => aendere(c, REGELN, 'if (via === null) return "tot";', 'if (via === null) return new Date() < new Date("2026-10-13") ? "rest" : "tot";', "files"),
    },
    {
      name: "eine Tuer schaltet an einem Tag um",
      pruefung: "datum",
      mach: (c) => aendere(c, "apps/web/app/join/[code]/page.tsx", "  const { code } = await params;", '  const { code } = await params;\n  if (Date.now() < 0) return null;'),
    },
    {
      name: "ein Rest bekommt wieder ein Ablaufdatum",
      pruefung: "datum",
      mach: (c) => json(c, (j) => (j.reste[0].ablauf = "2027-01-11")),
    },
    {
      name: "eine DEV_-Umgehung ohne Waechter",
      pruefung: "dev",
      mach: (c) => c.web.set("apps/web/lib/neu.ts", "export const x = process.env.DEV_USER_ID;"),
    },
    {
      name: "teacher kehrt als deklarierter Rest zurueck",
      pruefung: "reste",
      mach: (c) => json(c, (j) => j.reste.push({ provider: "teacher", grund: "ein Grund, der lang genug ist, um sonst durchzugehen", dateien: [] })),
    },
    {
      name: "ein Rest ohne Grund",
      pruefung: "reste",
      mach: (c) => json(c, (j) => (j.reste[0].grund = "kurz")),
    },
  ];
  for (const fall of faelle) {
    const c = klon(echt);
    try {
      fall.mach(c);
    } catch (e) {
      console.error(`✗ Selbsttest: »${fall.name}« — ${e.message}`);
      schlecht++;
      continue;
    }
    const r = lauf(c);
    if (r[fall.pruefung].length === 0) {
      console.error(`✗ Selbsttest: »${fall.name}« liess ${fall.pruefung} gruen`);
      schlecht++;
    } else console.log(`  ok   ${fall.pruefung} wird rot: ${fall.name}`);
  }
  // Jede Pruefung muss mindestens ein rotes Licht bewiesen haben.
  for (const name of Object.keys(PRUEFUNGEN)) {
    if (!faelle.some((f) => f.pruefung === name)) {
      console.error(`✗ Selbsttest: fuer ${name} gibt es keinen Fall — ein Tor ohne rotes Licht ist eine Behauptung`);
      schlecht++;
    }
  }
  if (schlecht) process.exit(1);
  console.log(`check-no-local-login --selftest: OK — ${faelle.length} rote Lichter + der gruene echte Stand bewiesen, ohne Uhr`);
  process.exit(0);
}

let fehler = 0;
for (const [name, liste] of Object.entries(lauf(echt))) {
  if (liste.length === 0) console.log(`  ok   ${name}`);
  for (const z of liste) {
    console.error(`✗ ${name}: ${z}`);
    fehler++;
  }
}
if (fehler) {
  console.error(`check-no-local-login: ${fehler} Verstoesse`);
  process.exit(1);
}
const reste = JSON.parse(echt.files.get(ALLOWLIST)).reste;
console.log(`check-no-local-login: OK — konto-handoff + ${reste.length} deklarierte Reste (${reste.map((r) => r.provider).join(", ")}), ohne Ablaufdatum`);
