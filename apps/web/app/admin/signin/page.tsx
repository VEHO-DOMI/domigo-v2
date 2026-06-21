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

  return (
    <main style={{ maxWidth: 380, margin: "0 auto", padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Teacher sign in</h1>
      {error && (
        <p style={{ background: "#fef2f2", color: "#b91c1c", padding: "8px 12px", borderRadius: 8, fontSize: 14 }}>
          That nickname or PIN didn&apos;t match. Try again.
        </p>
      )}
      <form action={teacherSignIn} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        <input type="hidden" name="from" value={from} />
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          Nickname
          <input name="nickname" required maxLength={64} autoComplete="off" style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          PIN
          <input name="pin" required inputMode="numeric" pattern="[0-9]{4,6}" minLength={4} maxLength={6}
            type="password" autoComplete="off" style={inputStyle} />
        </label>
        <button type="submit" style={btnStyle}>Sign in</button>
      </form>
      <p style={{ marginTop: 20, fontSize: 13, color: "#94a3b8" }}>
        Student? <Link href="/signin" style={{ color: "#2563eb" }}>Sign in here</Link>.
      </p>
    </main>
  );
}

const inputStyle = { border: "1px solid #cbd5e1", borderRadius: 8, padding: "10px 12px", fontSize: 16 } as const;
const btnStyle = { background: "#111827", color: "#fff", border: "none", borderRadius: 8, padding: "11px 16px", fontSize: 16, cursor: "pointer", marginTop: 4 } as const;
