import Link from "next/link";
import { redirect } from "next/navigation";
import { getTeacherForPage } from "@/lib/identity";
import ChangePinForm from "./ChangePinForm";

export const dynamic = "force-dynamic";

/**
 * Teacher account settings (WS-AUTH Phase A). Today: change your own PIN — no more
 * asking for a database edit. The first time you change it, your account quietly
 * moves to the platform's writable accounts system (your classes and assignments
 * come with it). More account controls land here as Phase C ships.
 *
 * Teacher-only via getTeacherForPage (a real session or the non-prod dev fallback),
 * the same guard the class/assignment/Studio pages use.
 */
export default async function TeacherSettingsPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <Link href="/admin" style={{ color: "var(--muted)", fontSize: 14, textDecoration: "none" }}>← Back to admin</Link>
      <h1 style={{ fontSize: 28, margin: "8px 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Account settings</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Signed in as <strong>{teacher.name}</strong>.
      </p>

      <section className="dg-card" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Change your PIN</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 16px" }}>
          Enter your current PIN, then choose a new one (4–6 digits). You’ll sign in with the new PIN from now on.
        </p>
        <ChangePinForm />
      </section>
    </main>
  );
}
