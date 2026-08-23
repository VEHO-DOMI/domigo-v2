#!/usr/bin/env node
// K2a · Migration 0016 auf den v2-DEV-Zweig anwenden — und belegen, dass sie liegt.
//
// HARTE SPERRE (wie seed-dev.mjs und snapshot-dev-proof.mjs): das Skript bricht ab,
// wenn die Adresse in apps/web/.env.local nicht der v2-dev-Compute ist. Gegen die
// Produktion kann es nicht laufen — Prod gehoert der GO-Sitzung und dem Neon-Editor.
//
// WARUM UEBERHAUPT EIN SKRIPT: die Anweisungen kommen aus der GENERIERTEN Datei
// packages/db/drizzle/0016_*.sql, nie aus abgetipptem SQL. Damit kann die angewandte
// DDL nicht von der abweichen, die drizzle-kit spaeter gegen den Schnappschuss haelt.
//
// WIEDERHOLBAR: eine schon vorhandene Tabelle/Spalte ist kein Fehler, sondern der
// Zustand »liegt bereits«. Das Skript darf zweimal laufen, ohne zu luegen.
//
// Lauf: node packages/db/scripts/apply-0016-dev.mjs
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

// Relativ zu DIESER Datei, damit das Skript in jedem Worktree laeuft.
const REPO = fileURLToPath(new URL("../../../", import.meta.url));
const ENV_PATH = `${REPO}apps/web/.env.local`;
const MIGRATION = `${REPO}packages/db/drizzle/0016_polite_warbird.sql`;
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
console.log(`Migration 0016: ${statements.length} Anweisungen`);

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
console.log("\nBelege aus dem Katalog:");
const tabellen = await sql`
  select table_name from information_schema.tables
  where table_schema = 'domigo_v2'
    and table_name in ('teacher_events','teacher_reset_tokens','auth_throttle')
  order by table_name`;
console.log("  Tabellen:", tabellen.map((r) => r.table_name).join(", ") || "(keine)");

const spalten = await sql`
  select table_name, column_name, data_type, is_nullable
  from information_schema.columns
  where table_schema = 'domigo_v2'
    and (table_name in ('teacher_events','teacher_reset_tokens','auth_throttle')
         or (table_name = 'users' and column_name = 'email'))
  order by table_name, ordinal_position`;
for (const r of spalten) {
  console.log(`  ${r.table_name}.${r.column_name}  ${r.data_type}  nullable=${r.is_nullable}`);
}

const indizes = await sql`
  select indexname from pg_indexes
  where schemaname = 'domigo_v2'
    and tablename in ('teacher_events','teacher_reset_tokens','auth_throttle')
  order by indexname`;
console.log("  Indizes:", indizes.map((r) => r.indexname).join(", ") || "(keine)");

// ── Ruecknahme, falls sie je gebraucht wird ──────────────────────────────────
console.log(`
Ruecknahme (nur v2-dev, EINE Anweisung je Lauf):
  drop table if exists domigo_v2.auth_throttle;
  drop table if exists domigo_v2.teacher_reset_tokens;
  drop table if exists domigo_v2.teacher_events;
  alter table domigo_v2.users drop column if exists email;`);
