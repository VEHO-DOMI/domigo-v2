"use client";
/**
 * The teacher's class list (P-1b) — since dach-018 a LIST, not a manager.
 *
 * Creating, renaming, archiving and un-archiving a class all wrote
 * `classes.name`, `classes.grade` or `classes.archived_at`. After the switch to
 * the account service those columns have exactly one writer, and it is not
 * DomiGo (SPEC konto V1.1-FINAL §10 E1). Two writers on one field is how a
 * rename comes back by itself the next night and nobody understands why — and
 * an archive here would have been worse still: locked in DomiGo while the
 * account service happily kept signing the children in.
 *
 * So the four buttons are gone and one sentence stands where they were. What
 * stays is everything a teacher reads on this page: the classes, their sizes,
 * their class codes to copy, and the way into a class.
 */
import Link from "next/link";
import { useState, type CSSProperties } from "react";

interface ClassSummary {
  id: string;
  name: string;
  inviteCode: string;
  grade: number;
  studentCount: number;
  createdAt: string | Date;
}

/** An archived class — the same summary plus WHEN it was retired. */
interface ArchivedClassSummary extends ClassSummary {
  archivedAt: string | Date;
}

const card: CSSProperties = { border: "1px solid var(--card-border)", borderRadius: 16, padding: 16, background: "var(--card)", boxShadow: "var(--shadow-card)", marginTop: 14 };
const label: CSSProperties = { fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 4 };
const codeStyle: CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 22, fontWeight: 800, letterSpacing: "0.16em", color: "var(--ink)" };

export default function ClassesManager({
  initialClasses,
  initialArchived,
  lehrerraumUrl,
}: {
  initialClasses: ClassSummary[];
  initialArchived: ArchivedClassSummary[];
  /** Where classes are made now. Resolved on the server — no address in client code. */
  lehrerraumUrl: string;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = async (c: ClassSummary) => {
    try {
      await navigator.clipboard?.writeText(c.inviteCode);
      setCopiedId(c.id);
      setTimeout(() => setCopiedId((id) => (id === c.id ? null : id)), 1500);
    } catch {
      /* clipboard blocked — the code is right there to read/type */
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Classes</h1>
        <Link href="/admin" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Teacher home</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Share a class code — students type it to join. Progress and rosters are here.
      </p>

      <div style={card}>
        <p style={{ margin: 0, fontSize: 15 }}>
          Klassen legen Sie im Lehrer-Raum an — dort geben Sie ihnen auch einen neuen Namen, einen
          Jahrgang oder ein Archiv.
        </p>
        <a href={lehrerraumUrl} className="dg-btn" style={{ display: "inline-block", marginTop: 12, padding: "10px 16px", textDecoration: "none" }}>
          Zum Lehrer-Raum
        </a>
      </div>

      {initialClasses.length === 0 ? (
        <p style={{ color: "var(--muted)", marginTop: 24 }}>Noch keine Klasse. Der Lehrer-Raum legt die erste an.</p>
      ) : (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          {initialClasses.map((c) => (
            <div key={c.id} className="dg-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    {c.name} <span style={{ fontWeight: 400, fontSize: 13, color: "var(--muted)" }}>· Grade {c.grade}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                    {c.studentCount === 0 ? "No students yet" : `${c.studentCount} ${c.studentCount === 1 ? "student" : "students"}`}
                    {" · created "}{new Date(c.createdAt).toLocaleDateString("de-AT")}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                  <Link href={`/admin/classes/${c.id}`} style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700 }}>Fortschritt</Link>
                  <Link href={`/admin/classes/${c.id}/roster`} style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700 }}>Roster</Link>
                </div>
              </div>

              {/* class code — prominent; students type it at the account service */}
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12, background: "var(--bg-sunken)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 14px" }}>
                <div>
                  <div style={label}>Invite code</div>
                  <div style={codeStyle}>{c.inviteCode}</div>
                </div>
                <button type="button" className="dg-chip" onClick={() => copyCode(c)} style={{ marginLeft: "auto" }}>
                  {copiedId === c.id ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {initialArchived.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontFamily: "var(--font-display)", color: "var(--ink)", margin: "0 0 4px" }}>Archiviert</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 0 }}>
            Eine archivierte Klasse weckt der Lehrer-Raum wieder; danach koennen sich die Kinder wieder anmelden.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {initialArchived.map((c) => (
              <div key={c.id} className="dg-card" style={{ opacity: 0.75 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                  {c.name} <span style={{ fontWeight: 400, fontSize: 13, color: "var(--muted)" }}>· Grade {c.grade}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                  {c.studentCount === 0 ? "No students" : `${c.studentCount} ${c.studentCount === 1 ? "student" : "students"}`}
                  {" · archiviert "}{new Date(c.archivedAt).toLocaleDateString("de-AT")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
