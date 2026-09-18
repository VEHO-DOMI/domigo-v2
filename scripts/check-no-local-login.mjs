#!/usr/bin/env node
// dach-018 · KEIN EIGENES PASSWORT MEHR — SPEC konto V1.1-FINAL §6 und §11
// (Zeile `test:no-local-login`), Nachtrag N-11.
//
// Nach dem Umstieg prueft DomiGo keine PIN und kein Passwort mehr; angemeldet
// wird bei konto. Was ueberlebt, steht in apps/web/konto-local-login-allowlist.json
// — zwei Eintraege, jeder mit einem Grund und einem FESTEN Ablaufdatum. Ab dem
// Tag danach ist dieses Tor rot, und der Sitzungs-Callback lehnt denselben
// Provider ab (auth.ts). Verlaengert wird das nur ueber eine neue Spec-Fassung.
//
// Vorbild: domi-tracker scripts/no-local-login.mjs (dach-019), an DomiGo
// angepasst — dort ist der Rest eine E-Mail-Form, hier sind es ein
// Maschinenpfad und die DEV_-Umgehungen.
//
// Fuenf Pruefungen:
//   provider  · in auth.ts gibt es keinen Credentials-Provider ausser
//               konto-handoff und den Eintraegen der Liste.
//   formen    · unter /signin, /admin/signin, /join/[code], /lehrkraft/* und
//               /bootstrap steht kein PIN-Feld mehr — kein type="password",
//               kein pattern="[0-9]{…}". Diese fuenf Tueren sind namentlich
//               genannt, weil genau sie es waren, die eine PIN entgegennahmen.
//   umleitung · dieselben Tueren antworten mit 308 auf den Konto-Dienst, ohne
//               Datenbankzugriff: ein Code, den es nicht mehr gibt, darf von
//               hier aus nicht beantwortbar sein.
//   dev       · jede DEV_-Umgehung steht hinter einem Waechter auf
//               VERCEL_ENV !== "production".
//   ablauf    · das Datum jedes Restes ist der Umstiegstag + 90 Tage, aus der
//               einen Konstante gerechnet — und mit einem gestellten Datum nach
//               dem Ablauf wird dieses Tor rot.
//
// Lauf: node scripts/check-no-local-login.mjs            (exit 1 bei jedem Verstoss)
//       node scripts/check-no-local-login.mjs --selftest (beweist die roten Lichter)

import fs from "node:fs";
import path from "node:path";

const R = process.cwd();
const selftest = process.argv.includes("--selftest");

const ALLOWLIST = "apps/web/konto-local-login-allowlist.json";
const AUTH = "apps/web/auth.ts";
const UMSTIEG = "apps/web/lib/konto/umstieg.ts";
const REST_TAGE = 90;

/** Die fuenf Tueren, die eine PIN entgegennahmen, und wohin sie jetzt fuehren. */
const TUEREN = [
  { rel: "apps/web/app/signin/page.tsx", ziel: null },
  { rel: "apps/web/app/admin/signin/page.tsx", ziel: null },
  { rel: "apps/web/app/join/[code]/route.ts", ziel: "kontoBeitrittUrl" },
  { rel: "apps/web/app/lehrkraft/[token]/route.ts", ziel: "/login?app=go" },
  { rel: "apps/web/app/lehrkraft/pin-reset/[token]/route.ts", ziel: "/login?app=go" },
  { rel: "apps/web/app/lehrkraft/pin-vergessen/route.ts", ziel: "/login?app=go" },
  { rel: "apps/web/app/bootstrap/route.ts", ziel: "/login?app=go" },
];

const PIN_FORM = /type=["']password["']|pattern=["']\[0-9\]\{/;
const CREDENTIALS = /Credentials\(\s*\{/g;
const PROVIDER_ID = /id:\s*(?:KONTO_PROVIDER|OPS_PROVIDER|["']([a-z-]+)["'])/g;

const lies = (rel) => fs.readFileSync(path.join(R, rel), "utf8");

/** Der Kalendertag in Wien, so wie die Schule ihn zaehlt. */
export function wienerTag(d) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Vienna" }).format(d);
}

function plusTage(iso, tage) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + tage);
  return d.toISOString().slice(0, 10);
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
    for (const id of ids) if (!erlaubt.has(id)) raus.push(`auth.ts: Provider »${id}« steht in keiner Rest-Liste`);
    if (anzahl > ids.length) raus.push(`auth.ts: ${anzahl} Credentials-Provider, aber nur ${ids.length} benannte Kennungen`);
    if (/verifyStudent|verifyTeacher/.test(src)) raus.push("auth.ts: eine PIN-Pruefung ist zurueck (verifyStudent/verifyTeacher)");
    return raus;
  },

  formen(state) {
    const raus = [];
    for (const t of TUEREN) {
      const src = state.files.get(t.rel);
      if (src === undefined) {
        raus.push(`${t.rel}: fehlt — eine der fuenf Tueren ist verschwunden statt umgeleitet`);
        continue;
      }
      if (PIN_FORM.test(src)) raus.push(`${t.rel}: hier steht wieder ein PIN-Feld`);
    }
    // Und die beiden Funktionen, die eine PIN erzeugen, haben keinen Aufrufer
    // mehr unter app/ — sonst gaebe es wieder einen Weg, eine anzulegen.
    const tote = JSON.parse(state.files.get(ALLOWLIST)).tote_pin_schreiber?.stellen ?? {};
    for (const [rel, src] of state.web) {
      if (!rel.startsWith("apps/web/app/")) continue;
      if (!/\bhashPin\(|\bcreateV2Teacher\(/.test(src)) continue;
      const satz = tote[rel];
      if (!satz) raus.push(`${rel}: legt wieder eine eigene PIN an`);
      else if (satz.length < 40) raus.push(`${rel}: eine tote PIN-Stelle braucht einen Satz, keine Notiz`);
    }
    // Rost: eine benannte Stelle, die keine PIN mehr schreibt, gehoert gestrichen.
    for (const rel of Object.keys(tote)) {
      const src = state.web.get(rel);
      if (src === undefined) raus.push(`${rel}: benannt, aber die Datei gibt es nicht mehr`);
      else if (!/\bhashPin\(|\bcreateV2Teacher\(/.test(src)) raus.push(`${rel}: benannt, schreibt aber laengst keine PIN mehr — Eintrag streichen`);
    }
    return raus;
  },

  umleitung(state) {
    const raus = [];
    for (const t of TUEREN) {
      if (!t.ziel) continue;
      const src = state.files.get(t.rel) ?? "";
      if (!src.includes("308")) raus.push(`${t.rel}: antwortet nicht mit 308`);
      if (!src.includes(t.ziel)) raus.push(`${t.rel}: leitet nicht auf ${t.ziel}`);
      if (/@domigo\/db/.test(src)) raus.push(`${t.rel}: greift auf die Datenbank zu — eine Weiterleitung darf nichts wissen`);
    }
    return raus;
  },

  dev(state) {
    const raus = [];
    for (const [rel, src] of state.web) {
      // Nur echte Benutzung, nicht die Erwaehnung in einem Kommentar.
      if (!/process\.env\.DEV_(USER|TEACHER|CLASS)_ID/.test(src)) continue;
      if (!src.includes('VERCEL_ENV !== "production"') && !src.includes('VERCEL_ENV === "production"')) {
        raus.push(`${rel}: nutzt eine DEV_-Umgehung ohne Waechter auf VERCEL_ENV`);
      }
    }
    return raus;
  },

  ablauf(state, jetzt = new Date()) {
    const raus = [];
    const liste = JSON.parse(state.files.get(ALLOWLIST));
    const konstante = (state.files.get(UMSTIEG).match(/UMSTIEGSTAG = "(\d{4}-\d{2}-\d{2})"/) ?? [])[1];
    if (!konstante) return ["lib/konto/umstieg.ts: der Umstiegstag ist keine Konstante mehr"];
    if (liste.umstiegstag !== konstante) {
      raus.push(`Allowlist: Umstiegstag ${liste.umstiegstag} ≠ Konstante ${konstante} — ein Datum, eine Quelle`);
    }
    const soll = plusTage(konstante, REST_TAGE);
    const heute = wienerTag(jetzt);
    for (const r of liste.reste) {
      if (r.ablauf !== soll) raus.push(`Rest »${r.provider}«: ablauf ${r.ablauf}, gerechnet waere ${soll} (Umstiegstag + ${REST_TAGE} Tage)`);
      if (heute > r.ablauf) raus.push(`Rest »${r.provider}«: abgelaufen am ${r.ablauf} — der Weg muss weg, nicht das Datum`);
      if (!r.grund || r.grund.length < 40) raus.push(`Rest »${r.provider}«: braucht einen Grund, keine Notiz`);
    }
    return raus;
  },
};

function laden() {
  const files = new Map();
  for (const rel of [ALLOWLIST, AUTH, UMSTIEG]) files.set(rel, lies(rel));
  for (const t of TUEREN) {
    try {
      files.set(t.rel, lies(t.rel));
    } catch {
      /* fehlt → die Pruefung meldet es */
    }
  }
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

function lauf(state, jetzt) {
  const befunde = {};
  for (const [name, fn] of Object.entries(PRUEFUNGEN)) befunde[name] = fn(state, jetzt);
  return befunde;
}

const klon = (s) => ({ files: new Map(s.files), web: new Map(s.web) });

const echt = laden();

if (selftest) {
  let schlecht = 0;
  const jetzt = lauf(echt);
  for (const [name, liste] of Object.entries(jetzt)) {
    if (liste.length) {
      console.error(`✗ Selbsttest unbrauchbar: ${name} ist schon ohne Manipulation rot: ${liste[0]}`);
      schlecht++;
    }
  }
  const liste = JSON.parse(echt.files.get(ALLOWLIST));
  const faelle = [
    {
      name: "ein PIN-Feld kehrt auf die Anmeldeseite zurueck",
      pruefung: "formen",
      mach: () => {
        const c = klon(echt);
        c.files.set("apps/web/app/signin/page.tsx", `<input type="password" name="pin" />`);
        return c;
      },
    },
    {
      name: "eine Weiterleitung fragt wieder die Datenbank",
      pruefung: "umleitung",
      mach: () => {
        const c = klon(echt);
        const rel = "apps/web/app/join/[code]/route.ts";
        c.files.set(rel, c.files.get(rel).replace('import { kontoBeitrittUrl }', 'import { getDb } from "@domigo/db";\nimport { kontoBeitrittUrl }'));
        return c;
      },
    },
    {
      name: "das Ablaufdatum eines Restes wird um ein Jahr verlaengert",
      pruefung: "ablauf",
      mach: () => {
        const c = klon(echt);
        const j = JSON.parse(c.files.get(ALLOWLIST));
        j.reste[0].ablauf = "2028-01-11";
        c.files.set(ALLOWLIST, JSON.stringify(j, null, 2));
        return c;
      },
    },
    {
      name: "ein fremder Credentials-Provider kehrt zurueck",
      pruefung: "provider",
      mach: () => {
        const c = klon(echt);
        c.files.set(AUTH, c.files.get(AUTH).replace('id: OPS_PROVIDER,', 'id: "teacher",'));
        return c;
      },
    },
  ];
  for (const fall of faelle) {
    const r = lauf(fall.mach());
    if (r[fall.pruefung].length === 0) {
      console.error(`✗ Selbsttest: »${fall.name}« liess ${fall.pruefung} gruen`);
      schlecht++;
    } else console.log(`  ok   ${fall.pruefung} wird rot: ${fall.name}`);
  }
  // Der Zeit-Fall: derselbe, unveraenderte Baum, einen Tag nach dem Ablauf.
  const nachAblauf = new Date(`${liste.reste[0].ablauf}T23:00:00Z`);
  nachAblauf.setUTCDate(nachAblauf.getUTCDate() + 1);
  if (lauf(echt, nachAblauf).ablauf.length === 0) {
    console.error("✗ Selbsttest: einen Tag nach dem Ablauf blieb das Tor gruen");
    schlecht++;
  } else console.log("  ok   ablauf wird rot: ein gestelltes Datum nach dem Ablauf");
  if (schlecht) process.exit(1);
  console.log(`check-no-local-login --selftest: OK — ${faelle.length + 1} rote Lichter bewiesen`);
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
console.log(`check-no-local-login: OK — 1 Anmeldeweg (konto-handoff) + ${reste.length} deklarierte Reste bis ${reste[0].ablauf}`);
