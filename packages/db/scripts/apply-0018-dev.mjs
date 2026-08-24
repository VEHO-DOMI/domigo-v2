#!/usr/bin/env node
// K6a · Migration 0018 auf den v2-DEV-Zweig anwenden — und belegen, dass sie liegt.
//
// HARTE SPERRE (wie apply-0016-dev.mjs / apply-0017-dev.mjs / seed-dev.mjs): das Skript
// bricht ab, wenn die Adresse in apps/web/.env.local nicht der v2-dev-Compute ist. Gegen
// die Produktion kann es nicht laufen — Prod gehoert der GO-Sitzung und dem Neon-Editor.
//
// WARUM UEBERHAUPT EIN SKRIPT: die Anweisungen kommen aus der GENERIERTEN Datei
// packages/db/drizzle/0018_*.sql, nie aus abgetipptem SQL. Damit kann die angewandte DDL
// nicht von der abweichen, die drizzle-kit spaeter gegen den Schnappschuss haelt.
//
// WIEDERHOLBAR: eine schon vorhandene Spalte ist kein Fehler, sondern der Zustand »liegt
// bereits« (42701, duplicate_column). Das Skript darf zweimal laufen, ohne zu luegen.
//
// WAS 0018 TUT: vier NULLBARE Spalten auf writing_submissions — graded_at, graded_by,
// score, feedback. Rein additiv: keine bestehende Zeile aendert sich, keine bestehende
// Abfrage bricht, und eine unbenotete Abgabe bleibt exakt das, was sie heute schon ist.
//
// Lauf: node packages/db/scripts/apply-0018-dev.mjs
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

// Relativ zu DIESER Datei, damit das Skript in jedem Worktree laeuft.
const REPO = fileURLToPath(new URL("../../../", import.meta.url));
const ENV_PATH = `${REPO}apps/web/.env.local`;
const MIGRATION = `${REPO}packages/db/drizzle/0018_nostalgic_gertrude_yorkes.sql`;
const DEV_COMPUTE = "ep-dry-sound-alj0davj";

// Genau die vier Spalten, die 0018 hinzufuegt. Ausgeschrieben, nicht aus der Migration
// abgeleitet: eine Erwartung, die sich aus dem Pruefling speist, prueft nichts.
const NEUE_SPALTEN = ["graded_at", "graded_by", "score", "feedback"];

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
console.log(`Migration 0018: ${statements.length} Anweisungen`);

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
const spalten = await sql`
  select column_name, data_type, is_nullable, column_default
  from information_schema.columns
  where table_schema = 'domigo_v2' and table_name = 'writing_submissions'
  order by ordinal_position`;
for (const r of spalten) {
  console.log(`  writing_submissions.${r.column_name}  ${r.data_type}  nullable=${r.is_nullable}  default=${r.column_default ?? "-"}`);
}

// Die NULLBARKEIT ist der Mechanismus, nicht bloss ein Attribut: sie ist der Unterschied
// zwischen »noch niemand hat es gelesen« (null) und »eine Lehrkraft hat null Punkte
// gegeben« (0). Darum wird sie einzeln geprueft statt nur mitgedruckt.
const fehlend = NEUE_SPALTEN.filter((n) => !spalten.some((r) => r.column_name === n));
const nichtNullbar = NEUE_SPALTEN.filter((n) => spalten.some((r) => r.column_name === n && r.is_nullable !== "YES"));
console.log("  Neue Spalten vorhanden:", fehlend.length === 0 ? `alle ${NEUE_SPALTEN.length}` : `FEHLEN: ${fehlend.join(", ")}`);
console.log("  Alle vier nullbar:", nichtNullbar.length === 0 ? "ja" : `NEIN: ${nichtNullbar.join(", ")}`);
if (fehlend.length > 0 || nichtNullbar.length > 0) process.exit(1);

// Und der Bestand: kein Datensatz darf sich durch eine additive Migration veraendert
// haben. Eine Zeile, die vorher da war, ist danach unbenotet — nicht mit 0 benotet.
const bestand = await sql`
  select count(*)::int as zeilen,
         count(*) filter (where score is not null)::int as benotet
  from domigo_v2.writing_submissions`;
console.log(`  Bestand: ${bestand[0].zeilen} Abgaben, davon ${bestand[0].benotet} benotet`);

// ── Ruecknahme, falls sie je gebraucht wird ──────────────────────────────────
console.log(`
Ruecknahme (nur v2-dev, EINE Anweisung je Lauf):
  alter table domigo_v2.writing_submissions drop column if exists feedback;
  alter table domigo_v2.writing_submissions drop column if exists score;
  alter table domigo_v2.writing_submissions drop column if exists graded_by;
  alter table domigo_v2.writing_submissions drop column if exists graded_at;`);
