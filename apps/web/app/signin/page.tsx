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

  return (
    <main style={{ maxWidth: 380, margin: "0 auto", padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Sign in</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>Use your class code, nickname and PIN.</p>
      {error && (
        <p style={{ background: "#fef2f2", color: "#b91c1c", padding: "8px 12px", borderRadius: 8, fontSize: 14 }}>
          That class code, nickname, or PIN didn&apos;t match. Try again.
        </p>
      )}
      <form action={studentSignIn} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        <input type="hidden" name="from" value={from} />
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          Class code
          <input name="classCode" required maxLength={32} autoCapitalize="characters" autoComplete="off"
            placeholder="e.g. ABC-D2F" style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          Nickname
          <input name="nickname" required maxLength={32} autoComplete="off" style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          PIN
          <input name="pin" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6}
            type="password" autoComplete="off" placeholder="6 digits" style={inputStyle} />
        </label>
        <button type="submit" style={btnStyle}>Sign in</button>
      </form>
      <p style={{ marginTop: 20, fontSize: 13, color: "#94a3b8" }}>
        Teacher? <Link href="/admin/signin" style={{ color: "#2563eb" }}>Sign in here</Link>.
      </p>
    </main>
  );
}

const inputStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 16,
} as const;

const btnStyle = {
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "11px 16px",
  fontSize: 16,
  cursor: "pointer",
  marginTop: 4,
} as const;
