import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const from = sp.from && sp.from.startsWith("/") ? sp.from : "/admin";
  const error = sp.error;

  async function teacherSignIn(formData: FormData) {
    "use server";
    const nickname = String(formData.get("nickname") ?? "");
    const pin = String(formData.get("pin") ?? "");
    const dest = String(formData.get("from") ?? "/admin");
    try {
      await signIn("teacher", { nickname, pin, redirect: true, redirectTo: dest || "/admin" });
    } catch (e) {
      if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
      redirect(`/admin/signin?error=invalid`);
    }
  }

  const label = { display: "flex", flexDirection: "column", gap: 5, fontSize: 14, fontWeight: 600, color: "var(--ink-soft)", fontFamily: "var(--font-body)" } as const;

  return (
    <main style={{ maxWidth: 400, margin: "0 auto", padding: "24px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Teacher sign in</h1>
      {error && (
        <p style={{ background: "var(--incorrect-soft)", color: "var(--incorrect)", padding: "9px 13px", borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
          That nickname or PIN didn&apos;t match. Try again.
        </p>
      )}
      <form action={teacherSignIn} className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
        <input type="hidden" name="from" value={from} />
        <label style={label}>
          Nickname
          <input name="nickname" required maxLength={64} autoComplete="off" className="dg-input" />
        </label>
        <label style={label}>
          PIN
          <input name="pin" required inputMode="numeric" pattern="[0-9]{4,6}" minLength={4} maxLength={6} type="password" autoComplete="off" className="dg-input" />
        </label>
        <button type="submit" className="dg-btn" style={{ marginTop: 4, padding: "12px 16px" }}>Sign in</button>
      </form>
      <p style={{ marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
        Student? <Link href="/signin" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign in here</Link>.
      </p>
    </main>
  );
}
