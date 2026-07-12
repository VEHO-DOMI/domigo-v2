import Link from "next/link";
import { redirect } from "next/navigation";
import { listReleasedStories } from "@domigo/content-loader";
import { getDb, getUnitMastery } from "@domigo/db";
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

  // Story mastery per released grade — derived from the corpus (a new grade's game
  // appears here the moment it releases) and rolled up from the attempts ledger.
  // Each query is wrapped: one grade's DB hiccup must never blank the whole view.
  const stories = listReleasedStories();
  const mastery = await Promise.all(stories.map((s) => getUnitMastery(getDb(), s.grade).catch(() => [])));
  const th = { padding: "7px 8px", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", fontSize: 12 } as const;

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Hi, {session.user.name}</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Teacher view. Live today: story mastery by unit for each shipped game, rolled up from the attempts ledger.
      </p>

      {stories.map((s, idx) => {
        const rows = mastery[idx] ?? [];
        return (
          <section key={s.storyId} className="dg-card" data-grade={s.grade} style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 17, margin: "0 0 10px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              G{s.grade} “{s.titleEn}” — mastery by unit
            </h2>
            {rows.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: 14 }}>No game attempts yet.</p>
            ) : (
              <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "var(--muted)" }}>
                    <th style={th}>Unit</th>
                    <th style={th}>Attempts</th>
                    <th style={th}>Items solved</th>
                    <th style={th}>Correct</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((m) => (
                    <tr key={m.unitSlug} style={{ borderTop: "1px solid var(--card-border)" }}>
                      <td style={{ padding: "7px 8px", fontWeight: 700 }}>{m.unitSlug}</td>
                      <td style={{ padding: "7px 8px" }}>{m.attempts}</td>
                      <td style={{ padding: "7px 8px" }}>{m.itemsSolved}</td>
                      <td style={{ padding: "7px 8px", color: m.correctRate >= 0.7 ? "var(--correct)" : m.correctRate >= 0.4 ? "var(--partial)" : "var(--incorrect)", fontWeight: 700 }}>{Math.round(m.correctRate * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        );
      })}

      <section className="dg-card" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 10px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Your classes</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 12px" }}>
          Create a class, share its invite code for students to join, and keep an eye on the roster.
        </p>
        <Link href="/admin/classes" className="dg-btn" style={{ display: "inline-block" }}>Manage classes →</Link>
      </section>

      <section className="dg-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 10px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Assignments</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 12px" }}>
          Compose, time and assign your own practice sets and mock tests (Schularbeit rehearsal), graded by your
          own Notenschlüssel.
        </p>
        <Link href="/admin/assignments" className="dg-btn" style={{ display: "inline-block" }}>Open the assignment builder →</Link>
      </section>

      <section className="dg-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 10px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Next for teachers</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: 0 }}>
          Landing through the summer program, in build order: the student runner + results for these assignments,
          grading captured writing submissions, and native content editing with a student “report a problem”
          inbox. Until each one ships, it doesn’t appear here — no dead buttons.
        </p>
      </section>

      <form action={doSignOut} style={{ marginTop: 28 }}>
        <button type="submit" style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 14, cursor: "pointer", textDecoration: "underline", fontFamily: "var(--font-body)" }}>
          Sign out
        </button>
      </form>
    </main>
  );
}
