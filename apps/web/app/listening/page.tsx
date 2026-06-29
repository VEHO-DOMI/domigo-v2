import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listListeningUnits } from "@domigo/content-loader";

export const dynamic = "force-dynamic";

export default async function ListeningIndex() {
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");

  const units = listListeningUnits();
  const grades = [1, 2, 3, 4] as const;
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Listening</h1>
        <Link href="/home" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Home</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Play a clip and answer the questions.</p>
      {units.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No listening tasks yet.</p>
      ) : (
        grades.map((g) => {
          const inGrade = units.filter((s) => s.startsWith(`g${g}-`));
          if (inGrade.length === 0) return null;
          return (
            <section key={g} data-grade={g} style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: 16, color: "var(--accent)", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>Grade {g}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {inGrade.map((slug) => (
                  <Link key={slug} href={`/listening/${slug}`} className="dg-chip" style={{ fontSize: 14, padding: "8px 14px", color: "var(--text)", textDecoration: "none" }}>{slug}</Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}
