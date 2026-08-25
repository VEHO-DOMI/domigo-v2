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
 * K1b · ZWEI ZUSÄTZE.
 *
 * (1) EHRLICHE FEHLANZEIGE statt geschluckter Fehler. Bis hierher hing jeder Leser
 * an einem `.catch(() => [])`: ein echter Datenbank-Fehler rendete damit »Noch
 * niemand auf der Liste« für eine volle Klasse — ein plausibel-falscher Zustand,
 * die eine Lüge, die eine Beobachtungs-Fläche nie erzählen darf. Jeder Leser hat
 * jetzt einen dritten Zustand (Muster: `v2Failed` aus listAllClassesForGrandmaster):
 * gescheitert heißt UNVOLLSTÄNDIG, nicht leer, und die betroffene Sektion sagt es.
 * Der Klassen-Besitz-Check selbst degradiert weiter auf redirect — dort ist »ich
 * konnte nicht nachsehen« zu Recht dasselbe wie »du darfst nicht«.
 *
 * (2) DIE HAND DES GROSSMEISTERS (P-R5): je Kind eine Anpassungs-Zelle. Sie wird
 * nur gerendert, wenn der Rang server-seitig HIER geprüft wurde — und die Route
 * dahinter prüft ihn noch einmal selbst. Das Ausblenden ist Bequemlichkeit; die
 * Tür ist die Route.
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
import { listApprovedUnits, listJourneyUnits, loadTrapRegistry } from "@domigo/content-loader";
import { getTeacherForPage } from "@/lib/identity";
import { isGrandmaster } from "@/lib/grandmaster";
import { isSlugAllowed, visibleGradesFor } from "@/lib/grade-scope";
import ProgressAdjustCell from "./ProgressAdjustCell";

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

/**
 * Ein Leseversuch mit ehrlichem dritten Zustand. `ok:false` heißt »ich konnte
 * nicht nachsehen« und ist etwas anderes als ein leeres Ergebnis — der Ersatzwert
 * hält nur die Typen zusammen und wird nie als Wahrheit gezeigt.
 */
interface Gelesen<T> {
  ok: boolean;
  wert: T;
}
async function lies<T>(p: Promise<T>, ersatz: T): Promise<Gelesen<T>> {
  try {
    return { ok: true, wert: await p };
  } catch (err) {
    console.error("[admin/classes/[id]] Leser gescheitert:", err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200));
    return { ok: false, wert: ersatz };
  }
}

/** Die Fehlzeile einer Sektion — sagt UNVOLLSTÄNDIG, nie »nichts da«. */
function Fehlzeile({ was }: { was: string }) {
  return (
    <p style={{ background: "var(--bg-sunken)", border: "1px solid var(--incorrect)", color: "var(--incorrect)", padding: "9px 13px", borderRadius: 12, fontSize: 13, fontWeight: 700, margin: 0 }}>
      {was} konnte gerade nicht geladen werden. Was hier steht, ist deshalb UNVOLLSTÄNDIG — nicht leer.
      Lad die Seite in einem Moment noch einmal.
    </p>
  );
}

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
  // Der Rang: eine reine Umgebungs-Lese, vor jeder Abfrage. Er entscheidet hier
  // zweierlei — ob eine fremde Klasse überhaupt aufgelöst wird, und ob die
  // Anpassungs-Zelle gerendert wird.
  const grossmeister = isGrandmaster(teacher.userId);
  let cls: OwnedClass | null = await getClassForTeacher(getDb(), id, teacher.userId).catch(() => null);
  // Unter WESSEN Autorisierung die besitzer-skopierten Dienste laufen. Für jede
  // gewöhnliche Lehrkraft — und für den Großmeister in seiner EIGENEN Klasse —
  // ist das er selbst.
  let authorizingTeacherId = teacher.userId;
  let ueberschrift = cls?.name ?? "";
  let fremd = false;

  if (!cls && grossmeister) {
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

  const rosterR = await lies(listRoster(getDb(), id, authorizingTeacherId), []);
  const [attemptsR, pfadeR, einheitenR, fallenR] = await Promise.all([
    lies(listStudentProgress(getDb(), id), []),
    lies(listStudentPathSummary(getDb(), id), new Map()),
    lies(listClassUnitProgress(getDb(), id), []),
    lies(listClassTraps(getDb(), id), []),
  ]);
  const metaR = await lies(listStudentMeta(getDb(), rosterR.wert.map((r) => r.id)), new Map());
  const roster = rosterR.wert;
  const attempts = attemptsR.wert;
  const pfade = pfadeR.wert;
  const einheiten = einheitenR.wert;
  const fallen = fallenR.wert;
  const meta = metaR.wert;
  const proSchueler = new Map(attempts.map((a) => [a.userId, a]));
  // Ein Platzhalter je Leser: »—« heißt »noch nichts getan«, »?« heißt »nicht
  // gelesen«. Die beiden zu vermischen wäre genau der geschluckte Fehler eine
  // Ebene tiefer — eine Zahl, die es nicht gibt, sähe aus wie eine Null.
  const kV = attemptsR.ok ? "—" : "?";
  const kM = metaR.ok ? "—" : "?";
  const kP = pfadeR.ok ? "—" : "?";
  const zahlenUnvollstaendig = !attemptsR.ok || !metaR.ok || !pfadeR.ok;

  // Das Fallen-Register, auf dieselbe Projektion gebracht, die das Wurzel-Layout
  // schon für die Kinder-Flächen baut (id → Name/Icon/Einzeiler).
  const registry = new Map(
    (loadTrapRegistry()?.traps ?? []).map((t) => [t.id, { nameDe: t.nameDe, icon: t.icon, oneLinerDe: t.oneLinerDe }]),
  );

  // Was die Kinder dieser Klasse auf /practice tatsächlich vor sich haben —
  // gebildet aus genau denselben Funktionen, die /practice fährt.
  const stufen = visibleGradesFor(cls.grade);
  const sichtbareEinheiten = listApprovedUnits().filter((s) => isSlugAllowed(s, stufen));
  // Welche davon einen AUTHORED Lernweg tragen — dort leitet die Kinder-Seite
  // ihren Stand aus dem Versuchs-Protokoll ab, eine Handmarkierung bleibt für das
  // Kind also unsichtbar. Das Formular sagt es an der Einheit selbst.
  const mitLernweg = new Set(listJourneyUnits());
  const anpassbareEinheiten = sichtbareEinheiten.map((slug) => ({ slug, journey: mitLernweg.has(slug) }));

  const aktive = attempts.length;
  const versucheGesamt = attempts.reduce((n, a) => n + a.attempts, 0);

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          {ueberschrift} <span style={{ fontWeight: 400, fontSize: 15, color: "var(--muted)" }}>· Stufe {cls.grade} · Fortschritt</span>
        </h1>
        <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
          {/* K6a · der Einstieg in die Schreib-Abgaben. Nur ein Link: eine eigene
              Zugangs-Karte gehört auf die Klassen-Übersicht, nicht in diesen Kopf. */}
          <Link href={`/admin/classes/${cls.id}/schreiben`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>Schreib-Abgaben</Link>
          {/* K12 · die Tuer zu den Hoer-Transkripten. Gleiche Bauart wie oben:
              jede Flaeche bringt ihre eigene Tuer mit, damit niemandem eine
              Adresse gesagt werden muss. */}
          <Link href={`/admin/classes/${cls.id}/hoeren`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>Hör-Aufgaben</Link>
          <Link href={`/admin/classes/${cls.id}/roster`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>Namensliste</Link>
          <Link href="/admin/classes" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Klassen</Link>
        </div>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        {rosterR.ok && attemptsR.ok
          ? `${roster.length} auf der Liste · ${aktive} ${aktive === 1 ? "hat" : "haben"} schon geübt · ${versucheGesamt} Versuche insgesamt.`
          : "Ein Teil der Zahlen war gerade nicht lesbar — die Zusammenfassung fehlt deshalb hier."}
        {fremd ? " Du siehst diese Klasse als Großmeister — jede Änderung wird auf deinen Namen protokolliert." : ""}
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
        {zahlenUnvollstaendig && rosterR.ok && roster.length > 0 && (
          <p style={{ background: "var(--bg-sunken)", border: "1px solid var(--incorrect)", color: "var(--incorrect)", padding: "9px 13px", borderRadius: 12, fontSize: 13, fontWeight: 700, margin: "0 0 12px" }}>
            Ein Teil der Zahlen war gerade nicht lesbar. Die Namen unten stimmen; jede Zelle mit einem
            <strong> ? </strong> heißt »konnte ich nicht nachsehen« — nicht »noch nichts getan« (das bleibt das »—«).
          </p>
        )}
        {!rosterR.ok ? (
          <Fehlzeile was="Die Namensliste dieser Klasse" />
        ) : roster.length === 0 ? (
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
                  {grossmeister && <th style={th}>Anpassen</th>}
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
                      <td style={num}>{a ? a.attempts : kV}</td>
                      <td style={num}>{a ? a.itemsSolved : kV}</td>
                      <td style={num}>{a ? quote(a.correctRate, a.attempts) : kV}</td>
                      <td style={num}>{m ? m.xp : kM}</td>
                      <td style={num}>{m ? m.grammarXp : kM}</td>
                      <td style={num}>{m ? m.streak : kM}</td>
                      <td style={num}>{m ? m.dueCount : kM}</td>
                      <td style={num}>{p ? `${p.completedNodes} · ${p.totalStars} ★` : kP}</td>
                      <td style={{ ...td, color: "var(--text-secondary)" }}>{a ? wann(a.lastActiveAt) : kV}</td>
                      {grossmeister && (
                        <td style={{ ...td, verticalAlign: "top" }}>
                          <ProgressAdjustCell
                            classId={cls.id}
                            studentId={r.id}
                            studentLabel={r.givenName ?? r.displayName}
                            units={anpassbareEinheiten}
                          />
                        </td>
                      )}
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
        {!einheitenR.ok ? (
          <Fehlzeile was="Die Zahlen je Einheit" />
        ) : einheiten.length === 0 ? (
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
        {!fallenR.ok ? (
          <Fehlzeile was="Die Fallen-Auswertung" />
        ) : fallen.length === 0 ? (
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
