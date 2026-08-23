/**
 * /admin/classes/[id] — DIE KLASSEN-FORTSCHRITTS-SICHT (K1a).
 *
 * Bis hierher konnte eine Lehrkraft zwei Dinge sehen: die Namensliste ihrer
 * Klasse und das Ergebnis EINER Aufgabe. Auf die Frage »wie steht meine Klasse
 * da?« gab es keine Antwort — die einzige Mastery-Ansicht (/admin) ist
 * jahrgangs-weit und misst nur den Story-Spielmodus. Die Daten lagen seit Juni
 * bereit: practice_attempts.class_id und study_path_progress.class_id werden auf
 * jedem Schreibpfad gefüllt und wurden von keinem Lesepfad benutzt (schema.ts
 * sagt es selbst: »for a future teacher view«). Diese Seite ist dieser Fall.
 *
 * AUTORISIERUNG — wörtlich das Muster der Roster-Seite (roster/page.tsx:38-62):
 * erst besitzer-skopiert (der Besitz IST die WHERE-Klausel), und NUR wenn das
 * leer bleibt und die Aufrufende Großmeisterin ist, wird die Klasse ungeskopt
 * aufgelöst, ihre EIGENTÜMER-Id davon abgelesen und der gewöhnliche,
 * besitzer-skopierte Dienst mit DEREN Id gefahren. Der Rang wird geprüft, bevor
 * irgendetwas gelesen wird; eine Prüfung nach dem Lesen ist keine Tür, sondern
 * eine Offenlegung mit einer Weiterleitung am Ende.
 *
 * Reine Server-Komponente: die Seite zeigt nur an. Das Anpassungs-Formular des
 * Großmeisters kommt in K1b als eigene Client-Datei daneben.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  UNKNOWN_TEACHER_LABEL,
  getClassForGrandmaster,
  getClassForTeacher,
  getDb,
  listClassTraps,
  listClassUnitProgress,
  listRoster,
  listStudentMeta,
  listStudentPathSummary,
  listStudentProgress,
  resolveTeacherNames,
  trapLabel,
  type OwnedClass,
} from "@domigo/db";
import { listApprovedUnits, loadTrapRegistry } from "@domigo/content-loader";
import { getTeacherForPage } from "@/lib/identity";
import { isGrandmaster } from "@/lib/grandmaster";
import { isSlugAllowed, visibleGradesFor } from "@/lib/grade-scope";

// Liest den Korpus zur Laufzeit über fs — nie statisch vorgerendert.
export const dynamic = "force-dynamic";

const th = {
  padding: "7px 8px",
  fontFamily: "var(--font-label)",
  fontWeight: 700,
  letterSpacing: "0.03em",
  textTransform: "uppercase",
  fontSize: 12,
  color: "var(--muted)",
  textAlign: "left",
} as const;
const td = { padding: "7px 8px", borderTop: "1px solid var(--card-border)" } as const;
const num = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" } as const;

/** Ein Anteil als Prozentzahl — »—«, solange nichts gemessen wurde. */
function quote(rate: number, attempts: number): string {
  return attempts === 0 ? "—" : `${Math.round(rate * 100)} %`;
}

/** Zeitpunkt in österreichischer Schreibweise, oder »—«. */
function wann(d: Date | null | undefined): string {
  if (!d) return "—";
  return `${d.toLocaleDateString("de-AT")}, ${d.toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })}`;
}

export default async function ClassProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const { id } = await params;
  let cls: OwnedClass | null = await getClassForTeacher(getDb(), id, teacher.userId).catch(() => null);
  // Unter WESSEN Autorisierung die besitzer-skopierten Dienste laufen. Für jede
  // gewöhnliche Lehrkraft — und für den Großmeister in seiner EIGENEN Klasse —
  // ist das er selbst.
  let authorizingTeacherId = teacher.userId;
  let ueberschrift = cls?.name ?? "";
  let fremd = false;

  if (!cls && isGrandmaster(teacher.userId)) {
    const foreign = await getClassForGrandmaster(getDb(), id).catch(() => null);
    if (foreign) {
      cls = foreign;
      authorizingTeacherId = foreign.teacherId;
      const names = await resolveTeacherNames(getDb(), [foreign.teacherId]).catch(() => new Map<string, string>());
      const owner = names.get(foreign.teacherId) ?? UNKNOWN_TEACHER_LABEL;
      ueberschrift = `${foreign.name} · ${owner} · Großmeister-Zugriff`;
      fremd = true;
    }
  }

  if (!cls) redirect("/admin/classes"); // nicht die Klasse dieser Lehrkraft (oder es gibt sie nicht)

  const roster = await listRoster(getDb(), id, authorizingTeacherId).catch(() => []);
  const [attempts, pfade, einheiten, fallen] = await Promise.all([
    listStudentProgress(getDb(), id).catch(() => []),
    listStudentPathSummary(getDb(), id).catch(() => new Map()),
    listClassUnitProgress(getDb(), id).catch(() => []),
    listClassTraps(getDb(), id).catch(() => []),
  ]);
  const meta = await listStudentMeta(getDb(), roster.map((r) => r.id)).catch(() => new Map());
  const proSchueler = new Map(attempts.map((a) => [a.userId, a]));

  // Das Fallen-Register, auf dieselbe Projektion gebracht, die das Wurzel-Layout
  // schon für die Kinder-Flächen baut (id → Name/Icon/Einzeiler).
  const registry = new Map(
    (loadTrapRegistry()?.traps ?? []).map((t) => [t.id, { nameDe: t.nameDe, icon: t.icon, oneLinerDe: t.oneLinerDe }]),
  );

  // Was die Kinder dieser Klasse auf /practice tatsächlich vor sich haben —
  // gebildet aus genau denselben Funktionen, die /practice fährt.
  const stufen = visibleGradesFor(cls.grade);
  const sichtbareEinheiten = listApprovedUnits().filter((s) => isSlugAllowed(s, stufen));

  const aktive = attempts.length;
  const versucheGesamt = attempts.reduce((n, a) => n + a.attempts, 0);

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          {ueberschrift} <span style={{ fontWeight: 400, fontSize: 15, color: "var(--muted)" }}>· Stufe {cls.grade} · Fortschritt</span>
        </h1>
        <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
          <Link href={`/admin/classes/${cls.id}/roster`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>Namensliste</Link>
          <Link href="/admin/classes" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Klassen</Link>
        </div>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        {roster.length} auf der Liste · {aktive} {aktive === 1 ? "hat" : "haben"} schon geübt · {versucheGesamt} Versuche insgesamt.
        {fremd ? " Du siehst diese Klasse als Großmeister — jede Änderung würde auf deinen Namen protokolliert." : ""}
      </p>

      {/* ── 1 · Die Kinder ─────────────────────────────────────────────── */}
      <section className="dg-card" style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Die Kinder</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 12px" }}>
          »Gelöst« zählt verschiedene Aufgaben, die beim Üben mindestens einmal besser als falsch beantwortet wurden;
          »richtig« ist der strengere Anteil der ganz richtigen Antworten. Punkte laufen in <strong>zwei getrennten
          Töpfen</strong> — Vokabel-XP und Grammatik-XP —, darum stehen sie nebeneinander: eine 0 in einer Spalte heißt
          nur »auf diesem Weg noch nichts«, nicht »nichts getan«. »Fällig« sind Wiederholungs-Karten, deren Termin
          erreicht ist. Ein »—« heißt: noch kein einziger Versuch.
        </p>
        {roster.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
            Noch niemand auf der Liste. Über die Namensliste Namen einfügen und den Beitritts-Link teilen.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={th}>Kind</th>
                  <th style={th}>Status</th>
                  <th style={{ ...th, textAlign: "right" }}>Versuche</th>
                  <th style={{ ...th, textAlign: "right" }}>Gelöst</th>
                  <th style={{ ...th, textAlign: "right" }}>Richtig</th>
                  <th style={{ ...th, textAlign: "right" }}>XP</th>
                  <th style={{ ...th, textAlign: "right" }}>Gramm.-XP</th>
                  <th style={{ ...th, textAlign: "right" }}>Serie</th>
                  <th style={{ ...th, textAlign: "right" }}>Fällig</th>
                  <th style={{ ...th, textAlign: "right" }}>Lernpfad</th>
                  <th style={th}>Zuletzt aktiv</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((r) => {
                  const a = proSchueler.get(r.id);
                  const m = meta.get(r.id);
                  const p = pfade.get(r.id);
                  return (
                    <tr key={r.id}>
                      <td style={{ ...td, fontWeight: 700, color: "var(--ink)" }}>
                        {r.givenName ?? r.displayName}
                        {r.givenName && r.givenName !== r.displayName ? (
                          // Vor dem Beitritt IST der Spitzname der Platzhalter-Vorname — ihn dann zweimal
                          // zu drucken sähe aus wie zwei Namen für ein Kind.
                          <span style={{ fontWeight: 400, color: "var(--muted)" }}> · {r.displayName}</span>
                        ) : null}
                      </td>
                      <td style={{ ...td, color: r.claimed ? "var(--correct)" : "var(--partial)", fontWeight: 700, fontSize: 13 }}>
                        {r.claimed ? "angemeldet" : "noch nicht angemeldet"}
                      </td>
                      <td style={num}>{a ? a.attempts : "—"}</td>
                      <td style={num}>{a ? a.itemsSolved : "—"}</td>
                      <td style={num}>{a ? quote(a.correctRate, a.attempts) : "—"}</td>
                      <td style={num}>{m ? m.xp : "—"}</td>
                      <td style={num}>{m ? m.grammarXp : "—"}</td>
                      <td style={num}>{m ? m.streak : "—"}</td>
                      <td style={num}>{m ? m.dueCount : "—"}</td>
                      <td style={num}>{p ? `${p.completedNodes} · ${p.totalStars} ★` : "—"}</td>
                      <td style={{ ...td, color: "var(--text-secondary)" }}>{wann(a?.lastActiveAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── 2 · Die Einheiten ──────────────────────────────────────────── */}
      <section className="dg-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Die Einheiten</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 12px" }}>
          Die ganze Klasse zusammengefasst, je Einheit — und über <strong>alle</strong> Wege gerechnet: Üben, Wiederholen,
          Lernpfad und Spiel zählen gleichermaßen.
        </p>
        {einheiten.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>Diese Klasse hat noch keine Einheit angefasst.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={th}>Einheit</th>
                  <th style={{ ...th, textAlign: "right" }}>Versuche</th>
                  <th style={{ ...th, textAlign: "right" }}>Gelöste Aufgaben</th>
                  <th style={{ ...th, textAlign: "right" }}>Richtig</th>
                </tr>
              </thead>
              <tbody>
                {einheiten.map((u) => (
                  <tr key={u.unitSlug}>
                    <td style={{ ...td, fontFamily: "var(--font-label)", letterSpacing: "0.04em", color: "var(--ink)" }}>{u.unitSlug}</td>
                    <td style={num}>{u.attempts}</td>
                    <td style={num}>{u.itemsSolved}</td>
                    <td style={num}>{quote(u.correctRate, u.attempts)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── 3 · Die häufigsten Fallen ──────────────────────────────────── */}
      <section className="dg-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Die häufigsten Fallen</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 12px" }}>
          Nicht »wie viel falsch«, sondern <strong>welche Art</strong> von falsch — benannt in derselben Sprache, die die
          Kinder in ihrer Rückmeldung lesen.
        </p>
        {fallen.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>Noch keine benannte Falle erfasst.</p>
        ) : (
          <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {fallen.map((f) => {
              const l = trapLabel(registry, f.trapId);
              return (
                <li key={f.trapId} style={{ display: "flex", gap: 10, alignItems: "baseline", padding: "8px 0", borderTop: "1px solid var(--card-border)" }}>
                  <span style={{ fontSize: 20, width: 26, flexShrink: 0 }}>{l.icon ?? "•"}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ color: "var(--ink)" }}>{l.nameDe}</strong>
                    {l.oneLinerDe ? <span style={{ color: "var(--text-secondary)" }}> — {l.oneLinerDe}</span> : null}
                    {l.known ? null : (
                      <span style={{ color: "var(--muted)", fontSize: 13 }}> (Falle nicht mehr im Register)</span>
                    )}
                  </span>
                  <span style={{ fontWeight: 800, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{f.count}×</span>
                </li>
              );
            })}
          </ol>
        )}
        <p style={{ color: "var(--muted)", fontSize: 12.5, margin: "12px 0 0", lineHeight: 1.5 }}>
          Erfasst werden nur <strong>getippte</strong> Antworten. Aufgaben zum Ankreuzen, Zuordnen und Sortieren sowie die
          Schularbeits-Proben zählen hier (noch) nicht mit — die Liste zeigt also einen Ausschnitt, nicht das ganze Bild.
        </p>
      </section>

      {/* ── 4 · Was deine Klasse sieht ─────────────────────────────────── */}
      <section className="dg-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Was deine Klasse sieht</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 12px" }}>
          Diese Klasse steht auf <strong>Stufe {cls.grade}</strong>. Ein Kind dieser Klasse hat beim Üben genau diese{" "}
          {sichtbareEinheiten.length} Einheiten vor sich — die anderen Schuljahre bekommt es gar nicht zu Gesicht.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {sichtbareEinheiten.map((slug) => (
            <span key={slug} className="dg-chip" style={{ fontSize: 13, padding: "6px 12px", color: "var(--text)" }}>{slug}</span>
          ))}
        </div>
        <p style={{ color: "var(--muted)", fontSize: 12.5, margin: "12px 0 0", lineHeight: 1.5 }}>
          Eine Aufgabe in der Kinder-Ansicht ausprobieren geht hier bewusst nicht: als Lehrkraft gehörst du keiner Klasse an,
          ein Übungslauf würde abgewiesen und nichts aufzeichnen. Der Weg dafür ist das <strong>Studio</strong> und dort
          »Vorschau wie ein Kind«.
        </p>
      </section>
    </main>
  );
}
