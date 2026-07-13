import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const from = sp.from && sp.from.startsWith("/") ? sp.from : "/home";
  const error = sp.error;

  // D-0: the bridge for NEW students. Sign-in only works for claimed accounts; a
  // fresh student holding an invite code must go through /join/<code> to pick
  // themselves + set a PIN. Without this form, typing the code above just yields
  // "didn't match" with no way forward (the exact dead end hit on 2026-07-13).
  async function goToJoin(formData: FormData) {
    "use server";
    const code = String(formData.get("joinCode") ?? "").trim().toUpperCase();
    if (!code) redirect("/signin");
    redirect(`/join/${encodeURIComponent(code)}`);
  }

  async function studentSignIn(formData: FormData) {
    "use server";
    const classCode = String(formData.get("classCode") ?? "");
    const nickname = String(formData.get("nickname") ?? "");
    const pin = String(formData.get("pin") ?? "");
    const dest = String(formData.get("from") ?? "/home");
    try {
      await signIn("student", { classCode, nickname, pin, redirect: true, redirectTo: dest || "/home" });
    } catch (e) {
      if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
      redirect(`/signin?error=invalid&from=${encodeURIComponent(dest)}`);
    }
  }

  const label = { display: "flex", flexDirection: "column", gap: 5, fontSize: 14, fontWeight: 600, color: "var(--ink-soft)", fontFamily: "var(--font-body)" } as const;

  return (
    <main style={{ maxWidth: 400, margin: "0 auto", padding: "24px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Sign in</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Use your class code, nickname and PIN.</p>
      {error && (
        <p style={{ background: "var(--incorrect-soft)", color: "var(--incorrect)", padding: "9px 13px", borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
          That class code, nickname, or PIN didn&apos;t match. Try again.
        </p>
      )}
      <form action={studentSignIn} className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
        <input type="hidden" name="from" value={from} />
        <label style={label}>
          Class code
          <input name="classCode" required maxLength={32} autoCapitalize="characters" autoComplete="off" placeholder="e.g. ABC-D2F" className="dg-input" />
        </label>
        <label style={label}>
          Nickname
          <input name="nickname" required maxLength={32} autoComplete="off" className="dg-input" />
        </label>
        <label style={label}>
          PIN
          <input name="pin" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} type="password" autoComplete="off" placeholder="6 digits" className="dg-input" />
        </label>
        <button type="submit" className="dg-btn" style={{ marginTop: 4, padding: "12px 16px" }}>Sign in</button>
      </form>
      <form action={goToJoin} className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Neu hier? · New here?</p>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
          Erster Besuch? Gib den Beitritts-Code deiner Klasse ein und such dich aus der Liste aus — dort wählst du
          deinen Spitznamen und deine PIN.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            name="joinCode"
            maxLength={32}
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="Beitritts-Code, z.B. 78QVDZ"
            className="dg-input"
            style={{ flex: 1 }}
          />
          <button type="submit" className="dg-btn" style={{ padding: "10px 16px" }}>Beitreten →</button>
        </div>
      </form>
      <p style={{ marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
        Teacher? <Link href="/admin/signin" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign in here</Link>.
      </p>
    </main>
  );
}
