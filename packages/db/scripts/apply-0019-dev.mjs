#!/usr/bin/env node
// P-R8 · Migration 0019 auf den v2-DEV-Zweig anwenden — und belegen, dass danach
// kein Klarname mehr im Klassen-Journal steht.
//
// HARTE SPERRE (wie apply-0016/0017/0018-dev.mjs, seed-dev.mjs): das Skript bricht ab,
// wenn die Adresse in apps/web/.env.local nicht der v2-dev-Compute ist. Gegen die
// Produktion kann es nicht laufen — Prod gehoert Koki und dem Neon-Editor.
//
// WARUM UEBERHAUPT EIN SKRIPT: die Anweisungen kommen aus der GENERIERTEN Datei
// packages/db/drizzle/0019_*.sql, nie aus abgetipptem SQL. Damit fahren dieses Skript
// und Kokis Neon-Ritual byte-gleiche Anweisungen.
//
// ⚠ WAS 0019 ANDERS MACHT ALS 0016–0018: sie ist KEINE additive DDL, sie VERAENDERT
//   BESTANDSDATEN. Darum drei Dinge, die eine ADD-Migration nicht braucht:
//     · eine VORHER-Zaehlung je `kind` (wie viele Zeilen, wie viele mit Namensfeld),
//     · eine NACHHER-Zaehlung derselben Art,
//     · zwei Beweise: der schluesselgenaue aus der Migration selbst und ein
//       schluessel-UNABHAENGIGER Streifzug ueber JEDEN Zeichenketten-Wert jeder
//       Nutzlast — der findet auch ein Namensfeld, das niemand vorhergesehen hat.
//   Und: es gibt KEINE Ruecknahme. Die Loeschung ist der Zweck.
//
// WIEDERHOLBAR: jede Anweisung filtert auf die ALTE Form, ein zweiter Lauf saeubert
// darum 0 Zeilen. Das Skript darf zweimal laufen, ohne zu luegen.
//
// Lauf: node packages/db/scripts/apply-0019-dev.mjs
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

// Relativ zu DIESER Datei, damit das Skript in jedem Worktree laeuft.
const REPO = fileURLToPath(new URL("../../../", import.meta.url));
const ENV_PATH = `${REPO}apps/web/.env.local`;
const MIGRATION = `${REPO}packages/db/drizzle/0019_journal_ohne_klarnamen.sql`;
const DEV_COMPUTE = "ep-dry-sound-alj0davj";

// Die Felder, die vor 0019 einen Namen tragen konnten. Ausgeschrieben, nicht aus der
// Migration abgeleitet: eine Erwartung, die sich aus dem Pruefling speist, prueft nichts.
const NAMENSFELDER = ["names", "displayName", "givenName", "nickname", "name"];

// ── Host-Sperre ──────────────────────────────────────────────────────────────
const env = Object.fromEntries(
  fs.readFileSync(ENV_PATH, "utf8")
    .split("\n").filter((l) => l.includes("=") && !l.trimStart().startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const host = new URL(env.DATABASE_URL.replace(/^postgres(ql)?:\/\//, "https://")).hostname;
if (!host.includes(DEV_COMPUTE)) {
  console.error("ABBRUCH: nicht der v2-dev-Compute ->", host);
  process.exit(1);
}
console.log("Ziel bestaetigt (v2-dev):", host);
const sql = neon(env.DATABASE_URL);

// ── Zaehlung je `kind` — dieselbe Abfrage vorher und nachher ─────────────────
const zaehlung = () => sql`
  select kind,
         count(*)::int as zeilen,
         count(*) filter (
           where payload -> 'names'       is not null
              or payload -> 'displayName' is not null
              or payload -> 'givenName'   is not null
              or payload -> 'nickname'    is not null
              or payload -> 'name'        is not null
         )::int as mit_namensfeld
  from domigo_v2.roster_events
  group by kind
  order by kind`;

const drucke = (titel, zeilen) => {
  console.log(`\n${titel}`);
  if (zeilen.length === 0) { console.log("  (keine Journal-Zeilen)"); return; }
  let summe = 0, summeNamen = 0;
  for (const r of zeilen) {
    summe += r.zeilen; summeNamen += r.mit_namensfeld;
    console.log(`  ${r.kind.padEnd(16)} ${String(r.zeilen).padStart(5)} Zeilen · ${String(r.mit_namensfeld).padStart(5)} mit Namensfeld`);
  }
  console.log(`  ${"SUMME".padEnd(16)} ${String(summe).padStart(5)} Zeilen · ${String(summeNamen).padStart(5)} mit Namensfeld`);
};

const vorher = await zaehlung();
drucke("VORHER — Bestand je Art:", vorher);

// ── Die Anweisungen aus der generierten Datei ────────────────────────────────
const statements = fs.readFileSync(MIGRATION, "utf8")
  .split("--> statement-breakpoint").map((s) => s.trim()).filter(Boolean);
console.log(`\nMigration 0019: ${statements.length} Anweisungen (aus der generierten Datei gelesen, nicht abgetippt)`);

for (const [i, stmt] of statements.entries()) {
  // Erste NICHT-Kommentarzeile als Kopf — die Kommentare stehen bewusst im SQL.
  const kopf = stmt.split("\n").find((z) => z.trim() && !z.trimStart().startsWith("--"))?.slice(0, 74) ?? "";
  try {
    const raus = await sql.query(stmt);
    const zeilen = Array.isArray(raus) ? raus : (raus?.rows ?? []);
    const wert = zeilen[0] ? Object.entries(zeilen[0]).map(([k, v]) => `${k}=${v}`).join(" ") : "(kein Ergebnis)";
    console.log(`  [${i + 1}] ${wert.padEnd(40)} ${kopf}`);
  } catch (err) {
    console.error(`  [${i + 1}] FEHLER  ${kopf}\n      ${err?.message ?? err}`);
    process.exit(1);
  }
}

const nachher = await zaehlung();
drucke("NACHHER — derselbe Bestand:", nachher);

// ── Beweis 1 · schluesselgenau ───────────────────────────────────────────────
const [{ offen }] = await sql`
  select count(*)::int as offen
  from domigo_v2.roster_events
  where payload -> 'names'       is not null
     or payload -> 'displayName' is not null
     or payload -> 'givenName'   is not null
     or payload -> 'nickname'    is not null
     or payload -> 'name'        is not null`;
console.log(`\nBeweis 1 (die fuenf bekannten Namensfelder): ${offen} Zeile(n) tragen noch eines — erwartet 0.`);

// ── Beweis 2 · schluessel-UNABHAENGIG ────────────────────────────────────────
// Der staerkere Beweis: er kennt keine Feldnamen. Jeder Zeichenketten-Wert jeder
// Nutzlast wird gegen dieselbe Form geprueft, die der Waechter im Code verlangt —
// id-foermig, und kein einzelnes grossgeschriebenes Wort. Was hier auffaellt, ist
// entweder ein Name oder ein Feld, das niemand deklariert hat.
const alle = await sql`select id, kind, payload from domigo_v2.roster_events`;
const idFoermig = (v) => typeof v === "string" && v.length <= 64 && /^[A-Za-z0-9._:-]+$/.test(v) && !/^[A-ZÄÖÜ][a-zäöüß]+$/.test(v);
const verdaechtig = [];
for (const zeile of alle) {
  const suche = (wert, pfad) => {
    if (typeof wert === "string") { if (!idFoermig(wert)) verdaechtig.push(`${zeile.kind} ${zeile.id} · ${pfad} = ${JSON.stringify(wert).slice(0, 60)}`); return; }
    if (Array.isArray(wert)) { wert.forEach((w, i) => suche(w, `${pfad}[${i}]`)); return; }
    if (wert && typeof wert === "object") { for (const [k, v] of Object.entries(wert)) suche(v, pfad ? `${pfad}.${k}` : k); }
  };
  suche(zeile.payload, "");
}
console.log(`Beweis 2 (jeder Zeichenketten-Wert jeder Nutzlast, ${alle.length} Zeilen): ${verdaechtig.length} auffaellige(r) Wert(e) — erwartet 0.`);
for (const v of verdaechtig.slice(0, 20)) console.log(`  ⚠ ${v}`);

if (offen > 0 || verdaechtig.length > 0) process.exit(1);

console.log(`
Ruecknahme: KEINE. Diese Migration LOESCHT die Namen — das ist ihr Zweck, und ein
zurueckschreibendes SQL gibt es nicht. Wer die alten Zeilen braucht, braucht eine
Kopie der Datenbank von VOR dem Lauf (auf der Produktion: ein Neon-Branch).`);
