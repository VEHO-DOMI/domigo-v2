#!/usr/bin/env node
// K2b · Migration 0017 auf den v2-DEV-Zweig anwenden — und belegen, dass sie liegt.
//
// HARTE SPERRE (wie apply-0016-dev.mjs, seed-dev.mjs und snapshot-dev-proof.mjs): das
// Skript bricht ab, wenn die Adresse in apps/web/.env.local nicht der v2-dev-Compute
// ist. Gegen die Produktion kann es nicht laufen — Prod gehoert der GO-Sitzung und dem
// Neon-Editor.
//
// WARUM UEBERHAUPT EIN SKRIPT: die Anweisungen kommen aus der GENERIERTEN Datei
// packages/db/drizzle/0017_*.sql, nie aus abgetipptem SQL. Damit kann die angewandte
// DDL nicht von der abweichen, die drizzle-kit spaeter gegen den Schnappschuss haelt.
//
// WIEDERHOLBAR: eine schon vorhandene Tabelle ist kein Fehler, sondern der Zustand
// »liegt bereits«. Das Skript darf zweimal laufen, ohne zu luegen.
//
// Lauf: node packages/db/scripts/apply-0017-dev.mjs
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

// Relativ zu DIESER Datei, damit das Skript in jedem Worktree laeuft.
const REPO = fileURLToPath(new URL("../../../", import.meta.url));
const ENV_PATH = `${REPO}apps/web/.env.local`;
const MIGRATION = `${REPO}packages/db/drizzle/0017_blue_pretty_boy.sql`;
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
console.log(`Migration 0017: ${statements.length} Anweisungen`);

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
  where table_schema = 'domigo_v2' and table_name = 'ops_link_uses'`;
console.log("  Tabellen:", tabellen.map((r) => r.table_name).join(", ") || "(keine)");

const spalten = await sql`
  select column_name, data_type, is_nullable, column_default
  from information_schema.columns
  where table_schema = 'domigo_v2' and table_name = 'ops_link_uses'
  order by ordinal_position`;
for (const r of spalten) {
  console.log(`  ops_link_uses.${r.column_name}  ${r.data_type}  nullable=${r.is_nullable}  default=${r.column_default ?? "-"}`);
}

// Der Primaerschluessel IST der Mechanismus (er entscheidet das Rennen um einen Link),
// darum wird er einzeln belegt und nicht nur als »Index vorhanden« mitgezaehlt.
const pk = await sql`
  select c.conname, pg_get_constraintdef(c.oid) as def
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where n.nspname = 'domigo_v2' and t.relname = 'ops_link_uses' and c.contype = 'p'`;
console.log("  Primaerschluessel:", pk.map((r) => `${r.conname} ${r.def}`).join(", ") || "(keiner!)");

// ── Ruecknahme, falls sie je gebraucht wird ──────────────────────────────────
console.log(`
Ruecknahme (nur v2-dev, EINE Anweisung je Lauf):
  drop table if exists domigo_v2.ops_link_uses;`);
