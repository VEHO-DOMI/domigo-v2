/**
 * /join/[code] — the PUBLIC student self-claim page. Given a class invite code, it
 * lists that class's UNCLAIMED students by a privacy label (first name + last
 * initial only — never a full surname or anyone's PIN). A student picks themselves,
 * chooses a nickname + a 6-digit PIN, and a server action claims the provisional row
 * (hashing the PIN here so bcrypt stays out of @domigo/db) then auto-signs them in.
 * On a taken nickname or a row that moved, it re-renders with a clear message.
 * Echoes the /signin visual style (inline var(--…) tokens, dg-card/dg-btn/dg-input).
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { claimStudent, findActiveClassByCode, getDb, unclaimedForClaim } from "@domigo/db";
import { signIn } from "@/auth";
import { hashPin, STUDENT_PIN_PATTERN } from "@/lib/pin";
import { normalizeInviteCode } from "@/lib/invite-code";

export const dynamic = "force-dynamic";

const labelStyle = { display: "flex", flexDirection: "column", gap: 5, fontSize: 14, fontWeight: 600, color: "var(--ink-soft)", fontFamily: "var(--font-body)" } as const;

export default async function JoinPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { code } = await params;
  const sp = await searchParams;
  const normalized = normalizeInviteCode(code);

  const cls = await findActiveClassByCode(getDb(), normalized).catch(() => null);

  // Class missing/archived → a friendly dead-end (no student data, no leak).
  if (!cls) {
    return (
      <main style={{ maxWidth: 400, margin: "0 auto", padding: "24px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
        <h1 style={{ fontSize: 26, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Class not found</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
          That join link doesn&apos;t match a class. Double-check the code with your teacher, or{" "}
          <Link href="/signin" style={{ color: "var(--accent)", fontWeight: 600 }}>sign in</Link> if you have already joined.
        </p>
      </main>
    );
  }

  const candidates = await unclaimedForClaim(getDb(), normalized).catch(() => []);

  async function claim(formData: FormData) {
    "use server";
    const studentId = String(formData.get("studentId") ?? "");
    const displayName = String(formData.get("displayName") ?? "").trim();
    const pin = String(formData.get("pin") ?? "");

    if (!studentId || displayName === "" || !STUDENT_PIN_PATTERN.test(pin)) {
      redirect(`/join/${code}?error=input`);
    }

    const pinHash = await hashPin(pin);
    const result = await claimStudent(getDb(), { studentId, displayName, pinHash });
    if (result === "taken") redirect(`/join/${code}?error=taken`);
    if (result === "gone") redirect(`/join/${code}?error=gone`);

    // Claimed → sign them straight in (the just-set nickname + PIN authenticate v2-first).
    try {
      await signIn("student", { classCode: normalized, nickname: displayName, pin, redirect: true, redirectTo: "/home" });
    } catch (e) {
      if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
      redirect("/signin"); // claimed OK but auto-sign-in hiccuped — they can sign in manually
    }
  }

  const errorText: Record<string, string> = {
    input: "Pick your name, choose a nickname, and enter a 6-digit PIN.",
    taken: "That nickname is already taken in your class. Try another.",
    gone: "That name was just claimed or removed. Pick your name from the list again.",
  };
  const error = sp.error ? errorText[sp.error] : undefined;

  return (
    <main style={{ maxWidth: 400, margin: "0 auto", padding: "24px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Join {cls.name}</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Find your name, pick a nickname and a 6-digit PIN to log in with.</p>
      <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
        Schon beigetreten? · Already joined?{" "}
        <Link href="/signin" style={{ color: "var(--accent)", fontWeight: 600 }}>Zur Anmeldung →</Link>
      </p>

      {error && (
        <p style={{ background: "var(--incorrect-soft)", color: "var(--incorrect)", padding: "9px 13px", borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
          {error}
        </p>
      )}

      {candidates.length === 0 ? (
        <div className="dg-card" style={{ marginTop: 16 }}>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            Everyone on this class list has already joined. If you still need to get in, ask your teacher to reset your PIN, then{" "}
            <Link href="/signin" style={{ color: "var(--accent)", fontWeight: 600 }}>sign in here</Link>.
          </p>
        </div>
      ) : (
        <form action={claim} className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
          <fieldset style={{ border: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <legend style={{ ...labelStyle, marginBottom: 4, padding: 0 }}>1 · Which one is you?</legend>
            {candidates.map((c) => (
              <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--card-border)", borderRadius: 12, background: "var(--bg-sunken)", cursor: "pointer" }}>
                <input type="radio" name="studentId" value={c.id} required defaultChecked={candidates.length === 1} />
                <span style={{ fontWeight: 700, color: "var(--ink)" }}>{c.label}</span>
              </label>
            ))}
          </fieldset>

          <label style={labelStyle}>
            2 · Choose a nickname
            <input name="displayName" required maxLength={32} autoComplete="off" placeholder="e.g. Anna" className="dg-input" />
          </label>

          <label style={labelStyle}>
            3 · Choose a 6-digit PIN
            <input name="pin" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} type="password" autoComplete="off" placeholder="6 digits" className="dg-input" />
          </label>

          <button type="submit" className="dg-btn" style={{ marginTop: 4, padding: "12px 16px" }}>Join and start</button>
        </form>
      )}

      <p style={{ marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
        Already joined? <Link href="/signin" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign in here</Link>.
      </p>
    </main>
  );
}
