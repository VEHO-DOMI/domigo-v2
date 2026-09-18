#!/usr/bin/env node
// dach-018 · KEIN EIGENES PASSWORT MEHR — SPEC konto V1.1-FINAL §6 und §11
// (Zeile `test:no-local-login`), Nachtrag N-11.
// dach-074 · DATUMSABHAENGIG, nicht entschaerft.
//
// Nach dem Umstieg prueft DomiGo keine PIN und kein Passwort mehr; angemeldet
// wird bei konto. BIS zum Umstiegstag bleibt die alte PIN-Anmeldung als
// Rueckfall stehen (am 18.09. sperrte der Adapter ohne Rueckfall zwei Stunden
// lang alle aus) — aber nur so, dass sie sich am Tag SELBST schliesst:
//
//   vor dem Tag  · genau die zwei deklarierten Rueckfall-Anbieter `student` und
//                  `teacher` sind erlaubt, und jeder fragt in seinem `authorize`
//                  das Datum (`rueckfallOffen(`). Ein Anbieter ohne diese Frage
//                  ist rot. PIN-Felder duerfen nur auf Seiten stehen, die das
//                  Datum fragen; die fuenf alten Tueren fragen es in der ersten
//                  Zeile (`tuerZiel(`) und leiten dann mit 307 um, nie mit 308.
//   ab dem Tag   · jeder Rueckfall-Anbieter, jede PIN-Pruefung, jedes PIN-Feld,
//                  jede Tuer mit Datenbankzugriff und jeder Rueckfall-Eintrag der
//                  Liste ist rot: das Verhalten schliesst sich von selbst, der
//                  Code muss dann weg (Vorbild srdp scripts/test-no-local-login.ts).
//
// Was ueberlebt, steht in apps/web/konto-local-login-allowlist.json — jeder Eintrag
// mit Grund und FESTEM Ablauf: die zwei Rueckfall-Eintraege laufen AM Umstiegstag
// ab (`rueckfall: true`), die Reste 90 Tage danach.
//
// Sechs Pruefungen, jede mit der Uhr als Parameter (der Selbsttest stellt sie):
//   provider  · welche Credentials-Anbieter auth.ts traegt und ob jeder Rueckfall-
//               Anbieter das Datum fragt; der jwt-Callback entscheidet ueber
//               sitzungsRegel (auch alte Cookies ohne `via`).
//   formen    · PIN-Felder nur auf datumsfragenden Seiten, und nur vor dem Tag;
//               Stellen, die eine PIN schreiben, nur in den Tueren (vor dem Tag)
//               oder benannt in `tote_pin_schreiber`.
//   umleitung · jede der fuenf Tueren fragt `tuerZiel("<tuer>"` und leitet mit
//               `redirect(` (307) — nie 308, nie `permanentRedirect`.
//   datum     · der Schnitt in lib/konto/rueckfall.ts ist EXKLUSIV und liest die
//               eine Konstante; restGueltig rechnet Rueckfall-Eintraege exklusiv.
//   dev       · jede DEV_-Umgehung steht hinter einem Waechter auf VERCEL_ENV.
//   ablauf    · Rueckfall-Eintraege = Umstiegstag, Reste = Umstiegstag + 90 Tage,
//               aus der einen Konstante; mit einem gestellten Datum danach rot.
//
// Lauf: node scripts/check-no-local-login.mjs            (exit 1 bei jedem Verstoss)
//       node scripts/check-no-local-login.mjs --selftest (beweist die roten Lichter,
//                                                         beide Seiten des Datums)

import fs from "node:fs";
import path from "node:path";

const R = process.cwd();
const selftest = process.argv.includes("--selftest");

const ALLOWLIST = "apps/web/konto-local-login-allowlist.json";
const AUTH = "apps/web/auth.ts";
const UMSTIEG = "apps/web/lib/konto/umstieg.ts";
const RUECKFALL = "apps/web/lib/konto/rueckfall.ts";
const RESTE = "apps/web/lib/konto/reste.ts";
const REST_TAGE = 90;
const RUECKFALL_PROVIDER = ["student", "teacher"];

/** Die Anmeldeseiten und die fuenf Tueren, die eine PIN entgegennahmen. */
const SEITEN = ["apps/web/app/signin/page.tsx", "apps/web/app/admin/signin/page.tsx"];
const TUEREN = [
  { rel: "apps/web/app/join/[code]/page.tsx", tuer: "join" },
  { rel: "apps/web/app/lehrkraft/[token]/page.tsx", tuer: "lehrkraft" },
  { rel: "apps/web/app/lehrkraft/pin-reset/[token]/page.tsx", tuer: "pin-reset" },
  { rel: "apps/web/app/lehrkraft/pin-vergessen/page.tsx", tuer: "pin-vergessen" },
  { rel: "apps/web/app/bootstrap/page.tsx", tuer: "bootstrap" },
];

const PIN_FORM = /type=["']password["']|pattern=["']\[0-9\]\{/;
const PIN_SCHREIBER = /\bhashPin\(|\bcreateV2Teacher\(/;
const CREDENTIALS = /Credentials\(\s*\{/g;
const PROVIDER_ID = /id:\s*(?:KONTO_PROVIDER|OPS_PROVIDER|["']([a-z-]+)["'])/g;
const DATUMSFRAGE = /rueckfallOffen\(/;

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

function umstiegstag(state) {
  return (state.files.get(UMSTIEG).match(/UMSTIEGSTAG = "(\d{4}-\d{2}-\d{2})"/) ?? [])[1] ?? null;
}

/** Ist der Rueckfall zur gestellten Uhr noch offen? (dieselbe Regel wie rueckfall.ts) */
function offen(state, jetzt) {
  const tag = umstiegstag(state);
  return tag !== null && wienerTag(jetzt) < tag;
}

/** Der Text eines Anbieters in auth.ts: ab seiner Kennung bis zum naechsten Anbieter. */
function anbieterBlock(src, id) {
  const ab = src.indexOf(`id: "${id}"`);
  if (ab < 0) return null;
  const bis = src.indexOf("Credentials(", ab);
  return src.slice(ab, bis < 0 ? ab + 900 : bis);
}

const PRUEFUNGEN = {
  provider(state, jetzt) {
    const raus = [];
    const src = state.files.get(AUTH);
    const liste = JSON.parse(state.files.get(ALLOWLIST));
    const rueckfallListe = new Set(liste.reste.filter((r) => r.rueckfall === true).map((r) => r.provider));
    const erlaubt = new Set(["konto-handoff", ...liste.reste.map((r) => r.provider)]);
    const anzahl = (src.match(CREDENTIALS) ?? []).length;
    const ids = [];
    let m;
    PROVIDER_ID.lastIndex = 0;
    while ((m = PROVIDER_ID.exec(src))) ids.push(m[1] ?? (m[0].includes("KONTO") ? "konto-handoff" : "ops-link"));
    for (const id of ids) if (!erlaubt.has(id)) raus.push(`auth.ts: Provider »${id}« steht in keiner Rest-Liste`);
    if (anzahl > ids.length) raus.push(`auth.ts: ${anzahl} Credentials-Provider, aber nur ${ids.length} benannte Kennungen`);

    for (const id of ids) {
      if (!rueckfallListe.has(id)) continue;
      if (!RUECKFALL_PROVIDER.includes(id)) {
        raus.push(`auth.ts: »${id}« ist als Rueckfall deklariert, aber nur student/teacher duerfen einer sein`);
        continue;
      }
      if (!offen(state, jetzt)) {
        raus.push(`auth.ts: der Rueckfall-Anbieter »${id}« steht noch da, der Umstiegstag ist vorbei — der Weg muss weg`);
        continue;
      }
      const block = anbieterBlock(src, id) ?? "";
      if (!DATUMSFRAGE.test(block)) raus.push(`auth.ts: der Rueckfall-Anbieter »${id}« fragt in authorize nicht rueckfallOffen()`);
    }
    if (/\bverifyStudent\b|\bverifyTeacher\b/.test(src) && !offen(state, jetzt)) {
      raus.push("auth.ts: eine PIN-Pruefung (verifyStudent/verifyTeacher) steht nach dem Umstiegstag noch da");
    }
    if (!/sitzungsRegel\(/.test(src)) raus.push("auth.ts: der jwt-Callback entscheidet nicht ueber sitzungsRegel (alte Cookies ohne via!)");
    return raus;
  },

  formen(state, jetzt) {
    const raus = [];
    const vorher = offen(state, jetzt);
    for (const rel of SEITEN) {
      const src = state.files.get(rel);
      if (src === undefined) {
        raus.push(`${rel}: fehlt`);
        continue;
      }
      if (!PIN_FORM.test(src)) continue;
      if (!vorher) raus.push(`${rel}: hier steht nach dem Umstiegstag noch ein PIN-Feld`);
      else if (!DATUMSFRAGE.test(src)) raus.push(`${rel}: ein PIN-Feld, das den Umstiegstag nicht fragt (rueckfallOffen)`);
    }
    for (const t of TUEREN) {
      const src = state.files.get(t.rel);
      if (src === undefined) {
        raus.push(`${t.rel}: fehlt — eine der fuenf Tueren ist verschwunden statt umgeleitet`);
        continue;
      }
      if (PIN_FORM.test(src) && !vorher) raus.push(`${t.rel}: hier steht nach dem Umstiegstag noch ein PIN-Feld`);
    }
    // Die Funktionen, die eine PIN erzeugen: unter app/ nur in den Tueren (und nur
    // vor dem Tag) oder benannt in tote_pin_schreiber, mit einem Satz.
    const tote = JSON.parse(state.files.get(ALLOWLIST)).tote_pin_schreiber?.stellen ?? {};
    const tuerDateien = new Set(TUEREN.map((t) => t.rel));
    for (const [rel, src] of state.web) {
      if (!rel.startsWith("apps/web/app/")) continue;
      if (!PIN_SCHREIBER.test(src)) continue;
      if (tuerDateien.has(rel)) {
        if (!vorher) raus.push(`${rel}: legt nach dem Umstiegstag noch eine eigene PIN an`);
        continue;
      }
      const satz = tote[rel];
      if (!satz) raus.push(`${rel}: legt wieder eine eigene PIN an`);
      else if (satz.length < 40) raus.push(`${rel}: eine tote PIN-Stelle braucht einen Satz, keine Notiz`);
    }
    // Rost: eine benannte Stelle, die keine PIN mehr schreibt, gehoert gestrichen.
    for (const rel of Object.keys(tote)) {
      const src = state.web.get(rel);
      if (src === undefined) raus.push(`${rel}: benannt, aber die Datei gibt es nicht mehr`);
      else if (!PIN_SCHREIBER.test(src)) raus.push(`${rel}: benannt, schreibt aber laengst keine PIN mehr — Eintrag streichen`);
    }
    return raus;
  },

  umleitung(state, jetzt) {
    const raus = [];
    const vorher = offen(state, jetzt);
    for (const t of TUEREN) {
      const src = state.files.get(t.rel);
      if (src === undefined) continue; // formen meldet es
      if (!src.includes(`tuerZiel("${t.tuer}"`)) raus.push(`${t.rel}: fragt tuerZiel("${t.tuer}", …) nicht — ab dem Tag fuehrte sie nirgendwohin`);
      if (!/if \(ziel\) redirect\(ziel\)/.test(src)) raus.push(`${t.rel}: leitet das tuerZiel nicht mit redirect(ziel) um`);
      if (/permanentRedirect\(|status:\s*308|,\s*308\s*\)/.test(src)) raus.push(`${t.rel}: eine dauerhafte Weiterleitung (308) — der Browser merkte sie sich ueber jeden Rueckfall hinaus`);
      if (!vorher && /@domigo\/db/.test(src)) raus.push(`${t.rel}: greift nach dem Umstiegstag noch auf die Datenbank zu — die Tuer gehoert jetzt ganz zu konto`);
      // Jede Server-Aktion einer Tuer fragt das Datum selbst (ein offener Tab ueber Mitternacht).
      const aktionen = (src.match(/"use server";/g) ?? []).length;
      const wachen = (src.match(/assertRueckfallOffen\(\)/g) ?? []).length;
      if (wachen < aktionen) raus.push(`${t.rel}: ${aktionen} Server-Aktionen, aber nur ${wachen} fragen assertRueckfallOffen()`);
    }
    const rf = state.files.get(RUECKFALL);
    if (/permanentRedirect\(|status:\s*308/.test(rf)) raus.push("lib/konto/rueckfall.ts: eine dauerhafte Weiterleitung (308)");
    return raus;
  },

  datum(state) {
    const raus = [];
    const rf = state.files.get(RUECKFALL);
    if (!/return wienerTag\(now\) < UMSTIEGSTAG;/.test(rf)) {
      raus.push("lib/konto/rueckfall.ts: rueckfallOffen schneidet nicht EXKLUSIV an der einen Konstante (wienerTag(now) < UMSTIEGSTAG)");
    }
    if (!/if \(via === null\) return rueckfallOffen\(now\) \? "rest" : "tot";/.test(rf)) {
      raus.push("lib/konto/rueckfall.ts: sitzungsRegel laesst alte Cookies ohne via nicht genau bis zum Umstiegstag leben");
    }
    const rs = state.files.get(RESTE);
    if (!/r\.rueckfall === true \? wienerTag\(now\) < r\.ablauf/.test(rs)) {
      raus.push("lib/konto/reste.ts: restGueltig rechnet Rueckfall-Eintraege nicht exklusiv — am Umstiegstag selbst lebte die PIN noch");
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

  ablauf(state, jetzt) {
    const raus = [];
    const liste = JSON.parse(state.files.get(ALLOWLIST));
    const konstante = umstiegstag(state);
    if (!konstante) return ["lib/konto/umstieg.ts: der Umstiegstag ist keine Konstante mehr"];
    if (liste.umstiegstag !== konstante) {
      raus.push(`Allowlist: Umstiegstag ${liste.umstiegstag} ≠ Konstante ${konstante} — ein Datum, eine Quelle`);
    }
    const soll = plusTage(konstante, REST_TAGE);
    const heute = wienerTag(jetzt);
    for (const r of liste.reste) {
      if (r.rueckfall === true) {
        if (r.ablauf !== konstante) raus.push(`Rueckfall »${r.provider}«: ablauf ${r.ablauf}, muss der Umstiegstag ${konstante} sein`);
        if (heute >= r.ablauf) raus.push(`Rueckfall »${r.provider}«: abgelaufen am ${r.ablauf} (00:00 Wien) — der Weg muss weg, nicht das Datum`);
      } else {
        if (r.ablauf !== soll) raus.push(`Rest »${r.provider}«: ablauf ${r.ablauf}, gerechnet waere ${soll} (Umstiegstag + ${REST_TAGE} Tage)`);
        if (heute > r.ablauf) raus.push(`Rest »${r.provider}«: abgelaufen am ${r.ablauf} — der Weg muss weg, nicht das Datum`);
      }
      if (!r.grund || r.grund.length < 40) raus.push(`Rest »${r.provider}«: braucht einen Grund, keine Notiz`);
    }
    return raus;
  },
};

function laden() {
  const files = new Map();
  for (const rel of [ALLOWLIST, AUTH, UMSTIEG, RUECKFALL, RESTE]) files.set(rel, lies(rel));
  for (const rel of [...SEITEN, ...TUEREN.map((t) => t.rel)]) {
    try {
      files.set(rel, lies(rel));
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

function lauf(state, jetzt = new Date()) {
  const befunde = {};
  for (const [name, fn] of Object.entries(PRUEFUNGEN)) befunde[name] = fn(state, jetzt);
  return befunde;
}

const klon = (s) => ({ files: new Map(s.files), web: new Map(s.web) });

const echt = laden();

if (selftest) {
  let schlecht = 0;
  const konstante = umstiegstag(echt);
  // Die zwei Uhren um den Schnitt: 23:59 am Vortag und 00:01 am Umstiegstag, Wien.
  const vorAbend = new Date(`${konstante}T00:00:00+02:00`);
  vorAbend.setUTCMinutes(vorAbend.getUTCMinutes() - 1);
  const nachMitternacht = new Date(`${konstante}T00:01:00+02:00`);
  const VOR = vorAbend;

  const alle = (b) => Object.values(b).flat();
  const jetzt = lauf(echt, VOR);
  for (const [name, liste] of Object.entries(jetzt)) {
    if (liste.length) {
      console.error(`✗ Selbsttest unbrauchbar: ${name} ist schon ohne Manipulation rot: ${liste[0]}`);
      schlecht++;
    }
  }
  const faelle = [
    {
      name: "ein PIN-Feld ohne Datumsfrage auf der Anmeldeseite",
      pruefung: "formen",
      mach: () => {
        const c = klon(echt);
        c.files.set("apps/web/app/signin/page.tsx", `<input type="password" name="pin" />`);
        return c;
      },
    },
    {
      name: "eine Tuer fragt das Datum nicht mehr (tuerZiel entfernt)",
      pruefung: "umleitung",
      mach: () => {
        const c = klon(echt);
        const rel = "apps/web/app/join/[code]/page.tsx";
        c.files.set(rel, c.files.get(rel).replace('tuerZiel("join"', 'keinZiel("join"'));
        return c;
      },
    },
    {
      name: "eine Tuer leitet dauerhaft um (permanentRedirect / 308)",
      pruefung: "umleitung",
      mach: () => {
        const c = klon(echt);
        const rel = "apps/web/app/join/[code]/page.tsx";
        c.files.set(rel, c.files.get(rel).replace("if (ziel) redirect(ziel)", "if (ziel) permanentRedirect(ziel)"));
        return c;
      },
    },
    {
      name: "eine Server-Aktion einer Tuer fragt das Datum nicht",
      pruefung: "umleitung",
      mach: () => {
        const c = klon(echt);
        const rel = "apps/web/app/bootstrap/page.tsx";
        c.files.set(rel, c.files.get(rel).replace(/assertRueckfallOffen\(\);[^\n]*\n/, ""));
        return c;
      },
    },
    {
      name: "das Ablaufdatum eines Restes wird um ein Jahr verlaengert",
      pruefung: "ablauf",
      mach: () => {
        const c = klon(echt);
        const j = JSON.parse(c.files.get(ALLOWLIST));
        j.reste.find((r) => !r.rueckfall).ablauf = "2028-01-11";
        c.files.set(ALLOWLIST, JSON.stringify(j, null, 2));
        return c;
      },
    },
    {
      name: "das Rueckfall-Datum wird eine Woche verschoben",
      pruefung: "ablauf",
      mach: () => {
        const c = klon(echt);
        const j = JSON.parse(c.files.get(ALLOWLIST));
        j.reste.find((r) => r.rueckfall).ablauf = "2026-10-20";
        c.files.set(ALLOWLIST, JSON.stringify(j, null, 2));
        return c;
      },
    },
    {
      name: "ein fremder Credentials-Provider kehrt zurueck",
      pruefung: "provider",
      mach: () => {
        const c = klon(echt);
        c.files.set(AUTH, c.files.get(AUTH).replace("id: OPS_PROVIDER,", 'id: "magic-link",'));
        return c;
      },
    },
    {
      name: "der Rueckfall-Anbieter student fragt das Datum nicht mehr",
      pruefung: "provider",
      mach: () => {
        const c = klon(echt);
        const src = c.files.get(AUTH);
        const ab = src.indexOf('id: "student"');
        const block = anbieterBlock(src, "student");
        c.files.set(AUTH, src.slice(0, ab) + block.replaceAll("rueckfallOffen()", "true") + src.slice(ab + block.length));
        return c;
      },
    },
    {
      name: "der Schnitt wird inklusiv (<=): die PIN lebte am Umstiegstag noch",
      pruefung: "datum",
      mach: () => {
        const c = klon(echt);
        c.files.set(RUECKFALL, c.files.get(RUECKFALL).replace("return wienerTag(now) < UMSTIEGSTAG;", "return wienerTag(now) <= UMSTIEGSTAG;"));
        return c;
      },
    },
  ];
  for (const fall of faelle) {
    const r = lauf(fall.mach(), VOR);
    if (r[fall.pruefung].length === 0) {
      console.error(`✗ Selbsttest: »${fall.name}« liess ${fall.pruefung} gruen`);
      schlecht++;
    } else console.log(`  ok   ${fall.pruefung} wird rot: ${fall.name}`);
  }

  // Die Zeit-Faelle: DERSELBE, unveraenderte Baum auf beiden Seiten des Schnitts.
  const vorher = alle(lauf(echt, VOR));
  if (vorher.length !== 0) {
    console.error(`✗ Selbsttest: am Vorabend (${wienerTag(VOR)} 23:59 Wien) ist das Tor schon rot`);
    schlecht++;
  } else console.log(`  ok   gruen am ${wienerTag(VOR)} um 23:59 Wien (Rueckfall offen)`);
  const nachher = lauf(echt, nachMitternacht);
  for (const name of ["provider", "ablauf"]) {
    if (nachher[name].length === 0) {
      console.error(`✗ Selbsttest: am Umstiegstag um 00:01 blieb ${name} gruen`);
      schlecht++;
    } else console.log(`  ok   ${name} wird rot am ${wienerTag(nachMitternacht)} um 00:01 Wien: ${nachher[name][0]}`);
  }
  if (schlecht) process.exit(1);
  console.log(`check-no-local-login --selftest: OK — ${faelle.length + 3} rote/gruene Lichter bewiesen, Uhr gestellt (nicht die echte Zeit)`);
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
const rueckfall = reste.filter((r) => r.rueckfall);
const uebrige = reste.filter((r) => !r.rueckfall);
console.log(
  `check-no-local-login: OK — konto-handoff + ${rueckfall.length} Rueckfall-Anbieter bis ${rueckfall[0]?.ablauf ?? "—"} (exklusiv) + ${uebrige.length} deklarierte Reste bis ${uebrige[0]?.ablauf ?? "—"}`,
);
