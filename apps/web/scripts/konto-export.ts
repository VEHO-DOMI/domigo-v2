/**
 * dach-018 · THE SWITCH-OVER EXPORT (SPEC konto V1.1-FINAL §10 E3).
 *
 * On the switch-over day everything DomiGo knows about who its people are has to
 * be at the account service before the adapter is merged — otherwise the first
 * child to sign in has no account and the first teacher has no class.
 *
 * ORDER IS THE WHOLE THING, and it is not a preference:
 *   1. GROUPS first. The bridge (`app_class_links`) is written from the answer,
 *      and a membership without a bridge finds nothing (SPEC §10: "Schritt 4
 *      setzt Schritt 2 voraus").
 *   2. TEACHERS before children, because a group needs an owner that exists.
 *   3. CHILDREN last, each with the class the bridge now names.
 *
 * WHAT NEVER LEAVES THIS REPO: no e-mail, ever — not a child's (there is none)
 * and not a teacher's (`accounts` has no such column, and konto answers 400 to
 * the field). The PIN hash travels AS STORED (bcrypt, SPEC §4.2: imported
 * hashes keep working), never a PIN. The ops test class and its children stay
 * behind — konto makes its own test accounts (SPEC §3, I-7).
 *
 * IDEMPOTENT: the class code is the key on the group side, `app_user_id` on the
 * account side, so a second run answers 200 throughout and changes nothing. That
 * matters more than it sounds: the run happens once, on a school morning, and
 * the only safe recovery from a half-finished run is to run it again.
 *
 * COUNTS, NEVER NAMES. Every line this prints is a number. A switch-over log
 * with a class list in it would be the one file nobody thought to protect.
 *
 * Run (from the repo root):
 *   pnpm --filter web konto:export -- --dry-run
 *   pnpm --filter web konto:export -- --apply --konto https://… --kuerzel VEHO=<user-id>
 *
 * This session does NOT run it against anything real: the live run is the grand
 * architect's terminal card on the switch-over day, after a Neon branch.
 */
import { getDb, readKontoExport, type ExportKlasse, type ExportPerson } from "@domigo/db";

type Args = { dryRun: boolean; konto: string; secret: string; kuerzel: Map<string, string>; opsCode: string };

function args(argv: string[]): Args {
  const hole = (name: string): string => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? (argv[i + 1] ?? "") : "";
  };
  const kuerzel = new Map<string, string>();
  argv.forEach((a, i) => {
    if (a === "--kuerzel") {
      const [k, id] = (argv[i + 1] ?? "").split("=");
      if (k && id) kuerzel.set(id, k);
    }
  });
  return {
    dryRun: argv.includes("--dry-run"),
    konto: hole("konto") || (process.env.KONTO_BASE_URL ?? ""),
    secret: process.env.KONTO_APP_SECRET ?? "",
    kuerzel,
    opsCode: process.env.OPS_CLASS_CODE ?? "75YAHV",
  };
}

type Klasse = ExportKlasse;
type Person = ExportPerson;

async function schicke(a: Args, pfad: string, koerper: unknown): Promise<number> {
  if (a.dryRun) return 200;
  const res = await fetch(`${a.konto.replace(/\/+$/, "")}${pfad}`, {
    method: "POST",
    headers: { authorization: `Bearer ${a.secret}`, "content-type": "application/json" },
    body: JSON.stringify(koerper),
  });
  if (!res.ok) throw new Error(`${pfad} antwortete ${res.status}`);
  return res.status;
}

async function main() {
  const a = args(process.argv.slice(2));
  if (!a.dryRun && (!a.konto || a.secret.length < 24)) {
    console.error("konto:export — ohne --konto <URL> und KONTO_APP_SECRET laeuft nur --dry-run");
    process.exit(2);
  }

  const { klassen, leute, nurV1 } = await readKontoExport(getDb());
  const opsKlasse = klassen.find((k) => k.inviteCode === a.opsCode);
  const ausgelassen = new Set(opsKlasse ? [opsKlasse.id] : []);

  const echteKlassen = klassen.filter((k) => !ausgelassen.has(k.id));
  const lehrkraefte = leute.filter((p) => p.role === "teacher");
  const kinder = leute.filter((p) => p.role !== "teacher" && p.classId && !ausgelassen.has(p.classId));

  const ohneKuerzel = lehrkraefte.filter((t) => !a.kuerzel.has(t.id));
  if (ohneKuerzel.length > 0) {
    // 422 bei konto (R-F2: Kuerzel ist Pflicht) — lieber hier abbrechen, bevor
    // die Haelfte der Gruppen drueben liegt.
    console.error(`konto:export — ${ohneKuerzel.length} Lehrkraft/Lehrkraefte ohne Kuerzel. Je eine --kuerzel KUE=<user-id> angeben.`);
    process.exit(3);
  }

  // 1 · Lehrgruppen
  await schicke(a, "/api/import/lehrgruppen", {
    lehrgruppen: echteKlassen.map((k) => ({
      app_class_id: k.id,
      fach: "Englisch",
      gruppe_name: k.name,
      name: k.name,
      owner_app_user_id: k.teacherId,
      join_code: k.inviteCode,
      jahrgang: k.grade,
      archived_at: k.archivedAt ? new Date(k.archivedAt).toISOString() : null,
    })),
  });

  // 2 · Lehrkraefte
  await schicke(a, "/api/import/konten", {
    konten: lehrkraefte.map((t) => ({
      app_user_id: t.id,
      nick: t.displayName,
      credential_hash: t.pinHash,
      role: "teacher",
      kuerzel: a.kuerzel.get(t.id),
    })),
  });

  // 3 · Kinder
  await schicke(a, "/api/import/konten", {
    konten: kinder.map((s) => ({
      app_user_id: s.id,
      nick: s.displayName,
      credential_hash: s.pinHash,
      role: "student",
      app_class_id: s.classId,
    })),
  });

  console.log(
    [
      `konto:export ${a.dryRun ? "(Probe, nichts gesendet)" : "(gesendet)"}`,
      `  Lehrgruppen:   ${echteKlassen.length}${opsKlasse ? " (Ops-Klasse ausgelassen)" : ""}`,
      `  Lehrkraefte:   ${lehrkraefte.length}`,
      `  Kinder:        ${kinder.length}`,
      `  ausgelassen:   ${leute.length - lehrkraefte.length - kinder.length} Konten ohne Klasse oder aus der Ops-Klasse`,
      `  davon nur v1:  ${nurV1.klassen} Klassen, ${nurV1.leute} Konten (der Dual-Read hat sie einmal gezaehlt)`,
    ].join("\n"),
  );
}

await main();
