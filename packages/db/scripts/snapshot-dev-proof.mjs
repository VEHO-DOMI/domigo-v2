/**
 * PROBELAUF fuer den Zustands-Schnappschuss (Migration 0014 + Runbook).
 *
 * Faehrt GENAU die Anweisungen aus `docs/runbooks/rollover-snapshot.md` — es
 * liest die markierten SQL-Bloecke ([R0], [R1a] …) aus dem Runbook selbst,
 * statt sie zu wiederholen. Dadurch KANN das Skript nicht vom Runbook
 * abweichen: was hier bewiesen wird, ist genau das, was Koki spaeter einfuegt.
 *
 * HARTE SPERRE: bricht ab, wenn die Adresse nicht der v2-dev-Compute ist.
 * Gegen die Produktion kann dieses Skript nicht laufen — Prod gehoert der
 * GO-Sitzung und dem Neon-Editor.
 *
 * Alle Ausgaben sind ZAEHLWERTE. Keine Anweisung gibt eine Personendaten-Zeile
 * aus; das INSERT … SELECT bewegt die Namen rein datenbank-intern.
 *
 * Aufruf:  node packages/db/scripts/snapshot-dev-proof.mjs
 */
import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const REPO = fileURLToPath(new URL("../../../", import.meta.url));
const RUNBOOK = `${REPO}docs/runbooks/rollover-snapshot.md`;
const MIGRATION = `${REPO}packages/db/drizzle/0014_black_agent_zero.sql`;
const ENV_PATH = `${REPO}apps/web/.env.local`;
const DEV_COMPUTE = "ep-dry-sound-alj0davj";
const LABEL = "2025-26";

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

// ── Die Runbook-Bloecke einlesen ─────────────────────────────────────────────
/** Liest jeden ```sql-Block aus dem Runbook und schluesselt ihn auf seine Marke. */
function runbookBloecke(pfad) {
  const text = fs.readFileSync(pfad, "utf8");
  const bloecke = new Map();
  for (const m of text.matchAll(/```sql\n([\s\S]*?)```/g)) {
    const body = m[1];
    const marke = body.match(/^--\s*\[([A-Za-z0-9]+)\]/m);
    if (!marke) throw new Error("SQL-Block ohne Marke im Runbook gefunden");
    if (bloecke.has(marke[1])) throw new Error(`Marke [${marke[1]}] kommt doppelt vor`);
    bloecke.set(marke[1], body.trimEnd());
  }
  return bloecke;
}
const R = runbookBloecke(RUNBOOK);
console.log("Runbook-Bloecke gelesen:", [...R.keys()].join(" "));
for (const marke of ["R0", "R1a", "R1b", "R1c", "R1v", "R2", "R3", "R4", "R5"]) {
  if (!R.has(marke)) { console.error(`ABBRUCH: Runbook-Block [${marke}] fehlt`); process.exit(1); }
}

// ── Beweis 1: die DDL im Runbook ist byte-gleich mit der Migrationsdatei ─────
/** Entfernt Kommentarzeilen und Randraum — verglichen wird das SQL selbst. */
const nurSql = (s) => s.split("\n").filter((l) => !l.trimStart().startsWith("--")).join("\n").trim();
const migStatements = fs.readFileSync(MIGRATION, "utf8")
  .split("--> statement-breakpoint").map((s) => s.trim()).filter(Boolean);
const ddlMarken = ["R1a", "R1b", "R1c"];
if (migStatements.length !== ddlMarken.length) {
  console.error(`ABBRUCH: Migration hat ${migStatements.length} Anweisungen, Runbook ${ddlMarken.length}`);
  process.exit(1);
}
ddlMarken.forEach((marke, i) => {
  const a = nurSql(R.get(marke));
  const b = migStatements[i].trim();
  console.log(`  DDL [${marke}] == Migration Anweisung ${i + 1}: ${a === b ? "JA" : "NEIN"}`);
  if (a !== b) {
    console.error("ABBRUCH: Runbook und Migration sind auseinandergelaufen.");
    console.error("Runbook :", JSON.stringify(a));
    console.error("Migration:", JSON.stringify(b));
    process.exit(1);
  }
});

// ── Helfer ───────────────────────────────────────────────────────────────────
const zeile = async (marke) => (await sql.query(R.get(marke)))[0];
const zeig = (titel, obj) => {
  console.log(`\n${titel}`);
  for (const [k, v] of Object.entries(obj)) console.log(`  ${k}: ${v}`);
};
let fehler = 0;
const pruefe = (name, ist, soll) => {
  const ok = String(ist) === String(soll);
  console.log(`  ${ok ? "OK  " : "ROT "} ${name}: ${ist} (erwartet ${soll})`);
  if (!ok) fehler += 1;
};

// ── Sauberer Start (nur Entwicklungs-Zweig, Tabelle gehoert dieser Welle) ────
const [{ da }] = await sql`select count(*)::int da from information_schema.tables
  where table_schema = 'domigo_v2' and table_name = 'rollover_snapshots'`;
if (da > 0) {
  await sql`drop table domigo_v2.rollover_snapshots`;
  console.log("\nVorlauf: bestehende Tabelle aus einem frueheren Probelauf entfernt (nur v2-dev).");
}

// ── Schritt 0 · Schema gegenmessen ───────────────────────────────────────────
console.log("\n=== Schritt 0 · Schema gegenmessen [R0] ===");
const schema = await sql.query(R.get("R0"));
for (const t of schema) console.log(`  ${t.tabelle}: ${t.spalten} Spalten`);
pruefe("gemessene Tabellen", schema.length, 7);
const userSpalten = schema.find((t) => t.tabelle === "public.users")?.spaltenliste ?? "";
for (const s of ["real_name", "xp", "grammar_xp", "level", "grammar_level", "streak",
                 "last_session_date", "total_sprints", "total_flashcards", "avatar_key",
                 "created_at", "last_seen_at"]) {
  if (!userSpalten.split(", ").includes(s)) { console.log(`  ROT  public.users hat keine Spalte ${s}`); fehler += 1; }
}
console.log("  OK   alle zwoelf von Schritt 3 benoetigten public.users-Spalten vorhanden");

// ── Schritt 1 · Migration 0014 anwenden ──────────────────────────────────────
console.log("\n=== Schritt 1 · Migration 0014 anwenden [R1a] [R1b] [R1c] ===");
for (const marke of ddlMarken) { await sql.query(R.get(marke)); console.log(`  [${marke}] angewandt`); }
const v = await zeile("R1v");
zeig("Verifikation [R1v] aus information_schema / pg_indexes:", v);
pruefe("Spalten", v.spalten, 13);
pruefe("Indexe", v.indexe, 3);

// ── Schritt 2 · Vorher-Messung ───────────────────────────────────────────────
console.log("\n=== Schritt 2 · Vorher-Messung [R2] ===");
const vorher = await zeile("R2");
zeig("Zaehlwerte (dev — klein, aber dieselben Formeln):", vorher);

// ── Schritt 3 · Der Schnappschuss ────────────────────────────────────────────
console.log("\n=== Schritt 3 · Der Schnappschuss [R3] ===");
const ins1 = await zeile("R3");
pruefe("eingefuegte_zeilen", ins1.eingefuegte_zeilen, vorher.schueler_v1);

// ── Schritt 4 · Nachher-Verifikation ─────────────────────────────────────────
console.log("\n=== Schritt 4 · Nachher-Verifikation [R4] ===");
const nach = await zeile("R4");
zeig("Zaehlwerte:", nach);
pruefe("zeilen == erwartet", nach.zeilen, nach.erwartet);
pruefe("versuche_im_schnappschuss == versuche_im_ledger", nach.versuche_im_schnappschuss, nach.versuche_im_ledger);
pruefe("ohne_klassenname == Schritt 2", nach.ohne_klassenname, vorher.ohne_klassenname);
pruefe("leitner_null (coalesce greift)", nach.leitner_null, 0);

// ── Schritt 5 · Rueckweg ─────────────────────────────────────────────────────
console.log("\n=== Schritt 5 · Rueckweg [R5] ===");
const del1 = await zeile("R5");
pruefe("geloeschte_zeilen == eingefuegte", del1.geloeschte_zeilen, ins1.eingefuegte_zeilen);

// ── Wiederholbarkeit: erneut einfuegen ───────────────────────────────────────
console.log("\n=== Wiederholbarkeit · [R3] erneut ===");
const ins2 = await zeile("R3");
pruefe("eingefuegte_zeilen beim zweiten Mal", ins2.eingefuegte_zeilen, ins1.eingefuegte_zeilen);

// ── Tamper: ein zweiter Lauf desselben Etiketts MUSS abprallen ───────────────
console.log("\n=== Tamper · [R3] ein drittes Mal, ohne vorherigen Rueckweg ===");
let code = null;
try { await zeile("R3"); } catch (e) { code = e.code ?? e.sourceError?.code ?? e.originalError?.code ?? String(e.message); }
pruefe("Fehlercode (23505 = Unique-Verletzung)", code, "23505");
const [{ n: nachTamper }] = await sql`select count(*)::int n from domigo_v2.rollover_snapshots where label = ${LABEL}`;
pruefe("Zeilen nach dem abgeprallten Lauf unveraendert", nachTamper, ins1.eingefuegte_zeilen);

// ── Aufraeumen ───────────────────────────────────────────────────────────────
console.log("\n=== Aufraeumen ===");
const del2 = await zeile("R5");
pruefe("geloeschte_zeilen", del2.geloeschte_zeilen, ins2.eingefuegte_zeilen);
const [{ n: rest }] = await sql`select count(*)::int n from domigo_v2.rollover_snapshots`;
pruefe("Restzeilen in der Tabelle", rest, 0);

console.log(`\n${fehler === 0 ? "ALLES GRUEN" : `${fehler} PRUEFUNG(EN) ROT`} — Probelauf beendet.`);
process.exit(fehler === 0 ? 0 : 1);
