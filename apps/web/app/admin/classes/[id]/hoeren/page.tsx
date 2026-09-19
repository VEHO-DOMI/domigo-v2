/**
 * /admin/classes/[id]/hoeren — DAS TRANSKRIPT FUER DIE LEHRKRAFT (K12,
 * P-R13 Punkt 7a).
 *
 * Koki nach dem Ohr-Urteil ueber Staffel 1: eine Lehrkraft braucht je
 * Hoer-Aufgabe den Sprechtext SICHTBAR und die Tonspur zum Herunterladen —
 * fuer Vorbereitung, Differenzierung, Ausdrucke. Bis hierher gab es davon
 * nichts: im ganzen /admin-Verzeichnis war der einzige Treffer auf »listening«
 * ein Kommentar ueber etwas Ungebautes (der Schularbeits-Baukasten, M-2b).
 * Sieben fertige Hoer-Stuecke lagen im Bestand, und keine Lehrkraft konnte
 * eines davon lesen.
 *
 * DER TEXT WIRD NICHT KOPIERT. Er kommt zur Laufzeit aus `audio.script` — der
 * einzigen Quelle, die das Tor V-LC7 mit dem `transcript` wortgleich haelt.
 * Eine zweite Abschrift im Lehrer-Backend waere genau die driftende Kopie, die
 * K5a ausdruecklich verhindert hat.
 *
 * AUTORISIERUNG — woertlich das Muster der Schreib-Abgaben (K6a, die es von der
 * Fortschritts-Seite hat, die es von der Namensliste hat): erst
 * besitzer-skopiert (der Besitz IST die WHERE-Bedingung), und NUR wenn das leer
 * bleibt und die Aufrufende Grossmeisterin ist, wird die Klasse ungeskopt
 * aufgeloest und die Kopfzeile gekennzeichnet. Der Rang wird geprueft, BEVOR
 * irgendetwas gelesen wird.
 *
 * ⚠ WAS DIESE SEITE NICHT IST. Sie ist keine Bearbeitungs-Flaeche. Aufgaben von
 * Lehrkraften bearbeiten zu lassen (P-R13 Punkt 7b) kollidiert mit dem
 * Content-als-Code-Modell — das Repo ist die Quelle, und eine Lehrer-Aenderung
 * wuerde davon wegdriften. Das ist ein offenes Architekten-Design-Tor, kein
 * Schnellschnitt; hier steht nur Lesen und Herunterladen.
 *
 * ⚠ UND SIE IST NUR HIER. Das Transkript verraet die Loesungen: kein Kind
 * bekommt es zu sehen — auch nicht im Seiten-Paket (die Gegenrichtung dieser
 * Bahn steht in lib/hoeren.ts#ohneSprechtextFuersKind).
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  UNKNOWN_TEACHER_LABEL,
  getClassForGrandmaster,
  getClassForTeacher,
  getDb,
  resolveTeacherNames,
  type OwnedClass,
} from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";
import { isGrandmaster } from "@/lib/grandmaster";
import { dauerSchaetzung, downloadName, hoerStueckeFuerStufe, type HoerBestand } from "@/lib/hoeren";

// Liest den Korpus zur Laufzeit ueber fs — nie statisch vorgerendert.
export const dynamic = "force-dynamic";

const hinweis = {
  background: "var(--bg-sunken)",
  padding: "9px 13px",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 700,
  margin: "16px 0 0",
} as const;

export default async function HoerAufgabenPage({ params }: { params: Promise<{ id: string }> }) {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const { id } = await params;
  // Der Rang: eine reine Umgebungs-Lese, VOR jeder Abfrage.
  const grossmeister = isGrandmaster(teacher.userId);
  let cls: OwnedClass | null = await getClassForTeacher(getDb(), id, teacher.userId).catch(() => null);
  let ueberschrift = cls?.name ?? "";
  let fremd = false;

  if (!cls && grossmeister) {
    const foreign = await getClassForGrandmaster(getDb(), id).catch(() => null);
    if (foreign) {
      cls = foreign;
      const names = await resolveTeacherNames(getDb(), [foreign.teacherId]).catch(() => new Map<string, string>());
      const owner = names.get(foreign.teacherId) ?? UNKNOWN_TEACHER_LABEL;
      ueberschrift = `${foreign.name} · ${owner} · Großmeister-Zugriff`;
      fremd = true;
    }
  }

  if (!cls) redirect("/admin/classes"); // nicht die Klasse dieser Lehrkraft (oder es gibt sie nicht)

  // Der Bestand wird gelesen, nicht behauptet. Eine einzelne kaputte Datei
  // nennt lib/hoeren.ts namentlich; faellt das Lesen GANZ aus, sagt die Seite
  // »unvollstaendig« statt »nichts da« (K1b-Doktrin).
  let bestand: HoerBestand | null = null;
  try {
    bestand = hoerStueckeFuerStufe(cls.grade);
  } catch (err) {
    console.error(
      "[admin/classes/[id]/hoeren] Bestand nicht lesbar:",
      err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200),
    );
  }

  const stuecke = bestand?.stuecke ?? [];
  const mitAufnahme = stuecke.filter((s) => s.datei !== null).length;

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          {ueberschrift} <span style={{ fontWeight: 400, fontSize: 15, color: "var(--muted)" }}>· Stufe {cls.grade} · Hör-Aufgaben</span>
        </h1>
        <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
          <Link href={`/admin/classes/${cls.id}`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>Fortschritt</Link>
          <Link href={`/admin/classes/${cls.id}/schreiben`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>Schreib-Abgaben</Link>
          <Link href="/admin/classes" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Klassen</Link>
        </div>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Jedes Hör-Stück dieser Stufe: der <strong>gesprochene Text zum Mitlesen</strong> und die{" "}
        <strong>Tonspur zum Herunterladen</strong> — für Vorbereitung, Differenzierung und Ausdrucke. Der Text steht
        hier so, wie er im Bestand liegt; es gibt keine zweite Fassung, die auseinanderlaufen könnte.{" "}
        <strong>Beim Kind erscheint davon nichts</strong> — der Text verrät die Antworten.
        {fremd ? " Du siehst diese Klasse als Großmeister." : ""}
      </p>

      {/* ── Zustand: ich konnte gar nicht nachsehen ──────────────────────── */}
      {bestand === null ? (
        <p style={{ ...hinweis, border: "1px solid var(--incorrect)", color: "var(--incorrect)" }}>
          Die Hör-Aufgaben konnten gerade nicht gelesen werden. Was hier steht, ist deshalb UNVOLLSTÄNDIG — nicht
          leer. Lad die Seite in einem Moment noch einmal.
        </p>
      ) : (
        <>
          {/* ── Zustand: einzelne Einheiten unlesbar, der Rest steht ─────── */}
          {bestand.unlesbar.length > 0 && (
            <p style={{ ...hinweis, border: "1px solid var(--partial)", color: "var(--partial)" }}>
              Diese Einheiten konnten nicht gelesen werden und fehlen unten:{" "}
              {bestand.unlesbar.join(", ")}. Alles andere ist vollständig.
            </p>
          )}

          {/* ── Zustand: auf dieser Stufe gibt es noch nichts ────────────── */}
          {stuecke.length === 0 ? (
            <section className="dg-card" style={{ marginTop: 20 }}>
              <p style={{ color: "var(--muted)", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                Für Stufe {cls.grade} gibt es derzeit keine Hör-Aufgaben. Sobald eine Einheit dieser Stufe eine
                bekommt, steht sie hier — ohne dass jemand diese Seite anfassen muss.
              </p>
            </section>
          ) : (
            <>
              <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 16 }}>
                {stuecke.length} {stuecke.length === 1 ? "Hör-Stück" : "Hör-Stücke"} · {mitAufnahme} mit fertiger
                Aufnahme
              </p>

              {stuecke.map((s) => (
                <section key={s.aufgabeId} className="dg-card" style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: 17, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                      {s.titelDe}
                    </h2>
                    <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-label)", letterSpacing: "0.03em", textTransform: "uppercase", fontWeight: 700 }}>
                      {s.einheit}
                    </span>
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: 13, margin: "6px 0 12px" }}>
                    {s.woerter} Wörter · {dauerSchaetzung(s.woerter)} geschätzt
                    {s.stimmen.length > 0 ? ` · Stimme: ${s.stimmen.join(", ")}` : ""}
                  </p>

                  {/* Herunterladen. Kein eigener Weg dafuer: die Datei wird
                      ohnehin oeffentlich ausgeliefert (das Kind laedt sie, um
                      sie zu hoeren). Gebraucht wird nur der sprechende Name —
                      der Pfad behaelt seinen Fingerabdruck. */}
                  {s.datei ? (
                    <a className="dg-btn" href={s.datei} download={downloadName(s.einheit, s.schluessel)} style={{ display: "inline-block", textDecoration: "none" }}>
                      ⬇ Tonspur herunterladen
                    </a>
                  ) : (
                    <p style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>
                      Für dieses Stück gibt es noch keine Aufnahme — im Unterricht spricht es der Browser vor. Der
                      Text unten stimmt trotzdem.
                    </p>
                  )}

                  {/* Aufklappbar, damit die Seite scanbar bleibt. Zum Ausdrucken
                      vorher aufklappen — ein geschlossenes <details> druckt nicht mit. */}
                  <details style={{ marginTop: 12 }}>
                    <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 14, color: "var(--accent)" }}>
                      Transkript anzeigen
                    </summary>
                    <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 15, margin: "10px 0 0", color: "var(--text)" }}>
                      {s.sprechtext}
                    </p>
                  </details>
                </section>
              ))}
            </>
          )}
        </>
      )}
    </main>
  );
}
