#!/usr/bin/env node
// K9b-Nachzug · Migration 0015 auf den v2-DEV-Zweig anwenden — und belegen, dass sie liegt.
//
// WARUM ES DIESES SKRIPT NACHTRAEGLICH GIBT: 0015 war die einzige Migration der
// Reihe ohne eigenes Anwend-Skript. Als der v2-dev-Zweig am 24.08. aus main
// zurueckgesetzt wurde, stand er auf 0014 — und K9b musste 0015 mit einem
// Einweg-Skript nachziehen, das niemand wiederfindet. Genau diese Luecke schliesst
// die Datei hier: dieselbe Sperre, dieselbe Quelle, dieselbe Beweisfuehrung wie
// apply-0016/0017/0018-dev.mjs.
//
// HARTE SPERRE (wie seed-dev.mjs und snapshot-dev-proof.mjs): das Skript bricht ab,
// wenn die Adresse in apps/web/.env.local nicht der v2-dev-Compute ist. Gegen die
// Produktion kann es nicht laufen — Prod gehoert der GO-Sitzung und dem Neon-Editor.
//
// WARUM UEBERHAUPT EIN SKRIPT: die Anweisungen kommen aus der GENERIERTEN Datei
// packages/db/drizzle/0015_*.sql, nie aus abgetipptem SQL. Damit kann die angewandte
// DDL nicht von der abweichen, die drizzle-kit spaeter gegen den Schnappschuss haelt.
//
// WIEDERHOLBAR: ein schon vorhandener Index ist kein Fehler, sondern der Zustand
// »liegt bereits«. Das Skript darf zweimal laufen, ohne zu luegen.
//
// Lauf: node packages/db/scripts/apply-0015-dev.mjs
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

// Relativ zu DIESER Datei, damit das Skript in jedem Worktree laeuft.
const REPO = fileURLToPath(new URL("../../../", import.meta.url));
const ENV_PATH = `${REPO}apps/web/.env.local`;
const MIGRATION = `${REPO}packages/db/drizzle/0015_mixed_eddie_brock.sql`;
const DEV_COMPUTE = "ep-dry-sound-alj0davj";

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

// ── Die Anweisungen aus der generierten Datei ────────────────────────────────
const statements = fs.readFileSync(MIGRATION, "utf8")
  .split("--> statement-breakpoint").map((s) => s.trim()).filter(Boolean);
console.log(`Migration 0015: ${statements.length} Anweisungen`);

// 42P07 = Relation/Index existiert bereits, 42701 = Spalte existiert bereits.
const schonDa = (err) => {
  const t = String(err?.message ?? err);
  return /already exists/i.test(t) || err?.code === "42P07" || err?.code === "42701";
};

for (const [i, stmt] of statements.entries()) {
  const kopf = stmt.split("\n")[0].slice(0, 78);
  try {
    await sql.query(stmt);
    console.log(`  [${i + 1}] angewandt   ${kopf}`);
  } catch (err) {
    if (schonDa(err)) { console.log(`  [${i + 1}] lag bereits  ${kopf}`); continue; }
    console.error(`  [${i + 1}] FEHLER      ${kopf}\n      ${err?.message ?? err}`);
    process.exit(1);
  }
}

// ── Beweise: was der Katalog jetzt sagt ──────────────────────────────────────
// 0015 legt zwei Indizes an; der Katalog ist die einzige Quelle, die zaehlt.
console.log("\nBelege aus dem Katalog:");
const indizes = await sql`
  select tablename, indexname from pg_indexes
  where schemaname = 'domigo_v2'
    and indexname in ('practice_attempts_class_time_idx','study_path_progress_class_idx')
  order by indexname`;
for (const r of indizes) console.log(`  ${r.tablename}.${r.indexname}`);
if (indizes.length !== 2) {
  console.error(`  FEHLER: erwartet 2 Indizes, gefunden ${indizes.length}`);
  process.exit(1);
}
console.log("  -> beide Indizes von 0015 liegen.");

// ── Ruecknahme, falls sie je gebraucht wird ──────────────────────────────────
console.log(`
Ruecknahme (nur v2-dev, EINE Anweisung je Lauf):
  drop index if exists domigo_v2.practice_attempts_class_time_idx;
  drop index if exists domigo_v2.study_path_progress_class_idx;`);
