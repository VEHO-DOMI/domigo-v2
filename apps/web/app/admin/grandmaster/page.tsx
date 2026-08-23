/**
 * /admin/grandmaster — the platform operator's ALL-CLASSES view (P3, Koki's
 * P-R1.3: "see every class — who has set one up, who has registered").
 *
 * An ordinary teacher sees only her own classes, by construction: authorization IS
 * the WHERE clause. This page is the one surface that looks across both registers,
 * so it is gated on isGrandmaster (an env allowlist — no app write path can grant
 * it) SERVER-SIDE, BEFORE the database is touched at all. Hiding the entry card on
 * /admin is convenience; this redirect is the security.
 *
 * Read-only by design: it lists, links and counts, and hands every action off to
 * the existing owner-scoped surfaces. Hence a plain server component — no client
 * component, no form, nothing to post.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb, listAllClassesForGrandmaster } from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";
import { isGrandmaster } from "@/lib/grandmaster";

export const dynamic = "force-dynamic";

const th = {
  padding: "7px 8px",
  fontFamily: "var(--font-label)",
  fontWeight: 700,
  letterSpacing: "0.03em",
  textTransform: "uppercase",
  fontSize: 12,
} as const;
const td = { padding: "7px 8px", borderTop: "1px solid var(--card-border)" } as const;

export default async function GrandmasterPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");
  // THE gate. Before any query — a rank check that runs after a read has already
  // happened is not a gate, it is a disclosure with a redirect on the end.
  if (!isGrandmaster(teacher.userId)) redirect("/admin");

  const { v2, legacy, v2Failed } = await listAllClassesForGrandmaster(getDb());
  const students = v2.reduce((n, c) => n + c.studentCount, 0);
  const claimed = v2.reduce((n, c) => n + c.claimedCount, 0);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <Link href="/admin" style={{ color: "var(--muted)", fontSize: 14, textDecoration: "none" }}>← Back to admin</Link>
      <h1 style={{ fontSize: 28, margin: "8px 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Alle Klassen</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Großmeister-Sicht: jede aktive Klasse der Plattform — wer sie eingerichtet hat, wie viele Kinder auf
        der Liste stehen und wie viele sich schon selbst angemeldet haben.
      </p>

      {v2Failed && (
        // The honest third state: NOT an empty list. An empty table here would
        // claim "there are no new classes" when the truth is "I could not look".
        <p style={{ background: "var(--bg-sunken)", border: "1px solid var(--incorrect)", color: "var(--incorrect)", padding: "9px 13px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
          Das neue Klassen-Register war gerade nicht lesbar — die Liste unten ist deshalb UNVOLLSTÄNDIG,
          nicht leer. Der Altbestand daneben stimmt.
        </p>
      )}

      <section className="dg-card" style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          Neues Register · {v2.length} {v2.length === 1 ? "Klasse" : "Klassen"}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 12px" }}>
          {v2.length === 0
            ? "Noch keine v2-Klasse angelegt."
            : `${students} auf den Listen · ${claimed} angemeldet · ${students - claimed} ausstehend.`}
        </p>
        {v2.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--muted)" }}>
                  <th style={th}>Klasse</th>
                  <th style={th}>Stufe</th>
                  <th style={th}>Eigentümerin</th>
                  <th style={th}>Code</th>
                  <th style={th}>Schüler</th>
                  <th style={th}>Angemeldet</th>
                  <th style={th}>Ausstehend</th>
                  <th style={th}>Angelegt</th>
                  <th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {v2.map((c) => (
                  <tr key={c.id}>
                    <td style={{ ...td, fontWeight: 700, color: "var(--ink)" }}>{c.name}</td>
                    <td style={td}>{c.grade}</td>
                    <td style={td}>{c.ownerName}</td>
                    <td style={{ ...td, fontFamily: "var(--font-label)", letterSpacing: "0.06em" }}>{c.inviteCode}</td>
                    <td style={td}>{c.studentCount}</td>
                    <td style={{ ...td, fontWeight: 700, color: "var(--correct)" }}>{c.claimedCount}</td>
                    <td style={{ ...td, color: c.studentCount - c.claimedCount > 0 ? "var(--partial)" : "var(--muted)" }}>
                      {c.studentCount - c.claimedCount}
                    </td>
                    <td style={{ ...td, color: "var(--text-secondary)" }}>{new Date(c.createdAt).toLocaleDateString("de-AT")}</td>
                    <td style={td}>
                      <Link href={`/admin/classes/${c.id}/roster`} style={{ color: "var(--accent)", fontWeight: 700, fontSize: 13 }}>Roster →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dg-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          Altbestand · {legacy.length} {legacy.length === 1 ? "Klasse" : "Klassen"}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 12px" }}>
          Das alte Register aus der Zeit vor der Eigentümerschaft — reine Kopfzahlen, keine Namen. Diese
          Klassen haben keinen Großmeister-Roster.
        </p>
        {legacy.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--muted)" }}>
                  <th style={th}>Klasse</th>
                  <th style={th}>Stufe</th>
                  <th style={th}>Schüler</th>
                </tr>
              </thead>
              <tbody>
                {legacy.map((c) => (
                  <tr key={c.id}>
                    <td style={{ ...td, fontWeight: 700, color: "var(--ink)" }}>{c.name} · Altbestand</td>
                    <td style={td}>{c.grade}</td>
                    <td style={td}>{c.studentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
