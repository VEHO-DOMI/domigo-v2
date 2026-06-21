import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/signin");
  if (session.user.role !== "teacher") redirect("/home");

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Hi, {session.user.name}</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        Teacher dashboard — class management &amp; per-class flags are coming soon.
      </p>
      <form action={doSignOut} style={{ marginTop: 28 }}>
        <button type="submit" style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 14, cursor: "pointer", textDecoration: "underline" }}>
          Sign out
        </button>
      </form>
    </main>
  );
}
