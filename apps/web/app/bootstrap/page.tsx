/**
 * /bootstrap — ONE-TIME v2-native teacher bootstrap (lock-out recovery).
 *
 * Deliberately OUTSIDE /admin/* (the middleware matcher gates that whole
 * subtree behind a session — which is exactly what a locked-out owner doesn't
 * have). Reachable logged-out, like /join, but useless without its gates:
 *
 *   gate 1 — TEACHER_BOOTSTRAP_TOKEN env var must be set (owner-only, via
 *            Vercel). Unset ⇒ the page renders a dead "disabled" card and
 *            NEVER touches the database.
 *   gate 2 — one-shot: the moment ANY v2-native teacher exists, the page is
 *            permanently inert (renders "already done"), even with the token.
 *   gate 3 — the token check is timing-safe; the PIN is hashed with the app's
 *            own hashPin (never stored or logged raw) and must be 4–6 digits.
 *
 * On success it also re-points existing assignments to the new account so the
 * admin surface shows them again, then tells the owner to DELETE the env var.
 */
import { createHash, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { adoptAssignments, createV2Teacher, getDb, hasV2Teacher } from "@domigo/db";
import { hashPin, TEACHER_PIN_PATTERN } from "@/lib/pin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // bcrypt + DB

/** Timing-safe string compare via fixed-length digests (inputs differ in length). */
function tokenMatches(candidate: string, expected: string): boolean {
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

const card = { maxWidth: 460, margin: "48px auto", padding: 28, borderRadius: 16, background: "var(--card, #fff)", boxShadow: "0 8px 30px rgba(30,45,90,.08)" } as const;
const label = { display: "flex", flexDirection: "column", gap: 5, fontSize: 14, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 14 } as const;
const input = { padding: "10px 12px", borderRadius: 10, border: "1px solid var(--line, #dde3f0)", fontSize: 15 } as const;

const ERRORS: Record<string, string> = {
  token: "That setup token didn't match. Check the value you set in Vercel.",
  pin: "The PIN must be 4–6 digits (numbers only), and both PIN fields must match.",
  name: "Please enter a nickname (up to 40 characters).",
  used: "A v2 teacher account already exists — this page has done its job.",
};

export default async function BootstrapPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; done?: string; adopted?: string; name?: string }>;
}) {
  const sp = await searchParams;
  const tokenConfigured = !!process.env.TEACHER_BOOTSTRAP_TOKEN;

  // Gate 1 first — with no token configured this page never touches the DB.
  if (!tokenConfigured) {
    return (
      <main style={card}>
        <h1 style={{ marginTop: 0 }}>Setup disabled</h1>
        <p style={{ color: "var(--ink-soft)" }}>
          This one-time setup page is switched off. To enable it, set a <code>TEACHER_BOOTSTRAP_TOKEN</code>{" "}
          environment variable on the deployment, redeploy, and reload this page.
        </p>
      </main>
    );
  }

  if (sp.done) {
    return (
      <main style={card}>
        <h1 style={{ marginTop: 0 }}>Teacher account created ✓</h1>
        <p>
          Nickname <strong>{sp.name}</strong> is ready{sp.adopted && sp.adopted !== "0" ? <> — and {sp.adopted} existing assignment(s) were moved to it</> : null}.
        </p>
        <p>
          <a href="/admin/signin" style={{ fontWeight: 700 }}>Sign in now →</a>
        </p>
        <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
          Housekeeping: delete the <code>TEACHER_BOOTSTRAP_TOKEN</code> variable in Vercel again. (This page is
          already inert either way — it refuses once a teacher account exists.)
        </p>
      </main>
    );
  }

  // Gate 2 — one-shot: inert forever once a v2 teacher exists.
  if (await hasV2Teacher(getDb())) {
    return (
      <main style={card}>
        <h1 style={{ marginTop: 0 }}>Already set up</h1>
        <p style={{ color: "var(--ink-soft)" }}>
          A teacher account already exists, so this setup page is permanently inactive.{" "}
          <a href="/admin/signin">Go to the teacher sign-in →</a>
        </p>
      </main>
    );
  }

  async function bootstrap(formData: FormData) {
    "use server";
    const token = String(formData.get("token") ?? "");
    const nickname = String(formData.get("nickname") ?? "").trim();
    const pin = String(formData.get("pin") ?? "");
    const pin2 = String(formData.get("pin2") ?? "");

    const expected = process.env.TEACHER_BOOTSTRAP_TOKEN;
    if (!expected || !tokenMatches(token, expected)) redirect("/bootstrap?error=token");
    if (!nickname || nickname.length > 40) redirect("/bootstrap?error=name");
    if (!TEACHER_PIN_PATTERN.test(pin) || pin !== pin2) redirect("/bootstrap?error=pin");

    const db = getDb();
    if (await hasV2Teacher(db)) redirect("/bootstrap?error=used"); // race re-check
    const pinHash = await hashPin(pin);
    const id = await createV2Teacher(db, { displayName: nickname, pinHash });
    const adopted = await adoptAssignments(db, id);
    redirect(`/bootstrap?done=1&adopted=${adopted}&name=${encodeURIComponent(nickname)}`);
  }

  return (
    <main style={card}>
      <h1 style={{ marginTop: 0 }}>One-time teacher setup</h1>
      <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
        Creates the platform&apos;s v2-native teacher account. Needs the setup token you configured in Vercel.
      </p>
      {sp.error ? (
        <p style={{ color: "#b3372f", fontWeight: 600 }}>{ERRORS[sp.error] ?? "Something did not match — try again."}</p>
      ) : null}
      <form action={bootstrap}>
        <label style={label}>
          Setup token (from Vercel)
          <input style={input} name="token" type="password" autoComplete="off" required />
        </label>
        <label style={label}>
          Teacher nickname (what you&apos;ll type at sign-in)
          <input style={input} name="nickname" defaultValue="VEHO" maxLength={40} required />
        </label>
        <label style={label}>
          PIN (4–6 digits)
          <input style={input} name="pin" type="password" inputMode="numeric" pattern="[0-9]{4,6}" required />
        </label>
        <label style={label}>
          Repeat PIN
          <input style={input} name="pin2" type="password" inputMode="numeric" pattern="[0-9]{4,6}" required />
        </label>
        <button
          type="submit"
          style={{ padding: "12px 18px", borderRadius: 12, border: 0, background: "var(--accent, #3b56d4)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}
        >
          Create teacher account
        </button>
      </form>
    </main>
  );
}
