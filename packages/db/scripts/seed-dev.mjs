/**
 * Legt FIKTIVE Testdaten im Neon-ENTWICKLUNGS-Branch (v2-dev) an, damit die
 * lokale Umgebung benutzbar ist. Keine echten Schülernamen - alle Namen erfunden.
 * Idempotent: erkennt bereits angelegte Testdaten am Namenspräfix "TEST-".
 * HARTE SPERRE: bricht ab, wenn die Adresse nicht der v2-dev-Compute ist.
 *
 * Aufruf:  pnpm --filter @domigo/db seed:dev
 * PINs kommen aus SEED_TEACHER_PIN / SEED_STUDENT_PIN (Vorgabewerte unten) -
 * im Repo stehen keine Zugangsdaten fest verdrahtet.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";
import fs from "node:fs";

// bcryptjs ist eine Abhängigkeit der Web-App (dem einzigen Paket, das PINs
// prüft) und unter pnpm nicht von packages/db aus auflösbar. Auflösung
// relativ zu DIESER Datei, damit das Skript in jedem Worktree läuft - ohne
// maschinen-absolute Pfade und ohne die Sperrdatei anzufassen.
const require = createRequire(import.meta.url);
const bcrypt = require(
  require.resolve("bcryptjs", { paths: [fileURLToPath(new URL("../../../apps/web/", import.meta.url))] }),
);

const ENV_PATH = fileURLToPath(new URL("../../../apps/web/.env.local", import.meta.url));
const DEV_COMPUTE = "ep-dry-sound-alj0davj";
const TEACHER_PIN = process.env.SEED_TEACHER_PIN ?? "471203"; // fiktive Test-PIN, nur Entwicklungs-DB
const STUDENT_PIN = process.env.SEED_STUDENT_PIN ?? "220814"; // fiktive Test-PIN, nur Entwicklungs-DB

const env = Object.fromEntries(
  fs.readFileSync(ENV_PATH, "utf8")
    .split("\n").filter((l) => l.includes("=") && !l.trimStart().startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const host = new URL(env.DATABASE_URL.replace(/^postgres(ql)?:\/\//, "https://")).hostname;
if (!host.includes(DEV_COMPUTE)) { console.error("ABBRUCH: nicht der v2-dev-Compute ->", host); process.exit(1); }
console.log("Ziel bestätigt (v2-dev):", host);

const sql = neon(env.DATABASE_URL);

// Erfundene Vornamen - bewusst keine Namen aus irgendeiner echten Klassenliste.
const NAMEN = [
  ["Tilda Brunner", "Nuri Falkenstein", "Emrik Sonnentag"],
  ["Malve Kirschner", "Jaro Wiesengrund", "Silka Ammerbach"],
  ["Odis Lindwurm", "Fenna Kupferhain", "Ravi Sturmfeder"],
  ["Wieke Talberg", "Cosmo Rehsteig", "Anouk Silberdisteln"],
];

const teacherHash = await bcrypt.hash(TEACHER_PIN, 12);
const studentHash = await bcrypt.hash(STUDENT_PIN, 12);

// -- Lehrkraft ---------------------------------------------------------------
let [teacher] = await sql`select id from domigo_v2.users where display_name = 'TEST-Lehrkraft' and role = 'teacher' limit 1`;
if (!teacher) {
  [teacher] = await sql`
    insert into domigo_v2.users (role, display_name, given_name, pin_hash, claimed_at)
    values ('teacher', 'TEST-Lehrkraft', 'Testina Probstein', ${teacherHash}, now())
    returning id`;
  console.log("Lehrkraft angelegt.");
} else {
  await sql`update domigo_v2.users set pin_hash = ${teacherHash} where id = ${teacher.id}`;
  console.log("Lehrkraft existierte - PIN neu gesetzt.");
}

// -- Klassen 1-4 + je 3 Schüler ---------------------------------------------
const out = [];
for (let grade = 1; grade <= 4; grade += 1) {
  const name = `TEST-${grade}A`;
  const code = `TST${grade}${["QW", "ER", "TZ", "UI"][grade - 1]}`;
  let [cls] = await sql`select id, invite_code from domigo_v2.classes where name = ${name} limit 1`;
  if (!cls) {
    [cls] = await sql`
      insert into domigo_v2.classes (name, invite_code, grade, teacher_id)
      values (${name}, ${code}, ${grade}, ${teacher.id})
      returning id, invite_code`;
  }
  const [{ n }] = await sql`select count(*)::int n from domigo_v2.users where class_id = ${cls.id}`;
  if (n === 0) {
    const [erster, ...rest] = NAMEN[grade - 1];
    // Haus-Konvention journal-then-flip (roster-service.ts): die Journal-Zeile
    // steht VOR den Zeilen, die sie beschreibt. Neon-HTTP kennt keine
    // Mehr-Anweisungs-Transaktion; ein Abbruch danach hinterlaesst darum eine
    // harmlose Journal-Waise statt einer unprotokollierten Änderung.
    await sql`
      insert into domigo_v2.roster_events (class_id, kind, payload, actor_id)
      values (${cls.id}, 'import', ${JSON.stringify({ source: "seed-dev-fiktiv", count: NAMEN[grade - 1].length })}, ${teacher.id})`;
    // Erster Schüler: BEANSPRUCHT (anmeldbar, Nickname + PIN)
    await sql`
      insert into domigo_v2.users (role, display_name, given_name, class_id, pin_hash, claimed_at)
      values ('student', ${"Test" + grade}, ${erster}, ${cls.id}, ${studentHash}, now())`;
    // Übrige: PROVISORISCH (leerer Hash => kann sich nicht anmelden, erscheint auf /join)
    for (const g of rest) {
      await sql`
        insert into domigo_v2.users (role, display_name, given_name, class_id, pin_hash, claimed_at)
        values ('student', ${g}, ${g}, ${cls.id}, '', null)`;
    }
  }
  const [student] = await sql`select id from domigo_v2.users where class_id = ${cls.id} and claimed_at is not null limit 1`;
  out.push({ grade, classId: cls.id, code: cls.invite_code, studentId: student.id });
  console.log(`  Stufe ${grade}: Klasse ${name} (Code ${cls.invite_code}) mit 3 Schülern, 1 beansprucht`);
}

// -- .env.local auf die neuen Test-Identitäten zeigen lassen -----------------
const g2 = out.find((o) => o.grade === 2);
const setze = { DEV_USER_ID: g2.studentId, DEV_CLASS_ID: g2.classId, DEV_TEACHER_ID: teacher.id, DEV_TEACHER_NAME: "TEST-Lehrkraft" };
const lines = fs.readFileSync(ENV_PATH, "utf8").split("\n");
const neu = lines.map((l) => {
  const k = Object.keys(setze).find((k) => l.startsWith(k + "="));
  return k ? `${k}=${setze[k]}` : l;
});
fs.copyFileSync(ENV_PATH, `${ENV_PATH}.bak-vor-seed`);
fs.writeFileSync(ENV_PATH, neu.join("\n"));
console.log("\n.env.local zeigt jetzt auf die Test-Identitäten (Stufe 2).");
console.log("Lehrkraft-PIN:", TEACHER_PIN, "| Schüler-PIN:", STUDENT_PIN, "| Nickname Schüler: Test<Stufe>");
console.log("Beitritts-Codes:", out.map((o) => `g${o.grade}=${o.code}`).join(" "));
