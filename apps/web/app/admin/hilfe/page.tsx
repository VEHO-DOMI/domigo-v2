/**
 * /admin/hilfe — die eine Seite, die eine Lehrkraft zum Loslegen braucht.
 *
 * Vier Schritte, zwei Warnungen, sonst nichts. Reine Server-Komponente (keine
 * Datenbank, kein Zustand), damit sie sich zuverlässig ausdrucken lässt: die
 * Druckregeln unten blenden die Navigation aus und setzen schwarz auf weiß, weil
 * die Farbtoken des Bildschirms im Ausdruck grau werden.
 *
 * Erreichbar für JEDE Lehrkraft über die Karte auf /admin — kein Rang, kein Link,
 * den man auswendig wissen muss. Die Middleware verlangt für /admin/* ohnehin eine
 * angemeldete Lehrkraft, hier steht also nichts Öffentliches.
 */
import Link from "next/link";

export const dynamic = "force-dynamic";

const schritte: { titel: string; text: string }[] = [
  {
    titel: "1 · Deine Klasse ist schon da",
    text: "Du musst nichts anlegen. Hinter der Schaltfläche »Manage classes →« steht deine Klasse bereits — mit Namen und Stufe, so wie sie im Stundenplan heißt. Die Oberfläche ist noch auf Englisch beschriftet; die Wege sind dieselben.",
  },
  {
    titel: "2 · Schülerliste einfügen",
    text: "Bei deiner Klasse auf »Roster« gehen und die Namen ins große Feld einfügen: ein Name je Zeile, Vor- und Zuname. Eine Spalte aus einer Tabelle kannst du direkt hineinkopieren; doppelte Namen sortiert die Seite selbst aus. Dann auf die Schaltfläche »Import«, auf der schon steht, wie viele Namen es sind.",
  },
  {
    titel: "3 · Beitritts-Link austeilen",
    text: "Ganz oben auf der Roster-Seite steht der Beitritts-Link samt Code, mit einer Schaltfläche »Copy join link«. Den gibst du den Kindern — jedes sucht sich in der Liste, wählt einen Spitznamen und eine 6-stellige PIN, und ist drin. Du trägst dafür nichts ein und siehst keine PIN.",
  },
  {
    titel: "4 · Ergebnisse lesen",
    text: "Im Baukasten (»Open the assignment builder →«) stellst du Übungen und Schularbeits-Proben zusammen und siehst danach, wer wie weit gekommen ist. Auf der Lehrer-Startseite steht außerdem je Einheit, wie sicher deine Klasse schon ist.",
  },
];

const warnungen: { titel: string; text: string }[] = [
  {
    titel: "Eine Klasse nie archivieren",
    text: "Die rote Schaltfläche »Archive« in der Klassenliste sperrt alle Kinder dieser Klasse aus ihrem Zugang aus, und einen Weg zurück gibt es zurzeit nicht. Wenn eine Klasse wirklich weg soll, sag Koki Bescheid.",
  },
  {
    titel: "PIN vergessen? Für Kinder im Roster, für dich per E-Mail",
    text: "Bei jedem Kind im Roster steht »Reset PIN«. Danach steht das Kind wieder auf der Beitritts-Seite und wählt Spitzname und PIN neu. Du siehst nie eine PIN und musst dir auch keine ausdenken. Für deine EIGENE PIN lohnt es sich, unter »Account settings« einmal eine E-Mail-Adresse zu hinterlegen: dann kommst du mit »PIN vergessen?« auf der Anmeldeseite selbst wieder hinein, per Link. Ohne hinterlegte Adresse geht es weiterhin — dann setzt dir Koki eine Übergangs-PIN.",
  },
];

const h2 = { fontSize: 17, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" } as const;
const p = { color: "var(--text-secondary)", fontSize: 14.5, margin: 0, lineHeight: 1.55 } as const;

export default function HilfeSeite() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <style>{`
        @media print {
          /* Der Bildschirm-Hintergrund würde als graue Fläche mitdrucken. */
          html, body { background: #fff !important; }
          .dg-nodruck { display: none !important; }
          main { max-width: none !important; padding: 0 !important; color: #000 !important; }
          .dg-card { border: 1px solid #999 !important; background: #fff !important; break-inside: avoid; }
          h1, h2 { color: #000 !important; }
          p, li { color: #000 !important; }
        }
      `}</style>

      <Link href="/admin" className="dg-nodruck" style={{ color: "var(--muted)", fontSize: 14, textDecoration: "none" }}>
        ← Zurück
      </Link>

      <h1 style={{ fontSize: 28, margin: "8px 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>
        In vier Schritten startklar
      </h1>
      <p style={{ ...p, marginBottom: 8 }}>Eine Seite, zum Ausdrucken oder Danebenlegen.</p>

      {schritte.map((s) => (
        <section key={s.titel} className="dg-card" style={{ marginTop: 14 }}>
          <h2 style={h2}>{s.titel}</h2>
          <p style={p}>{s.text}</p>
        </section>
      ))}

      <h2 style={{ ...h2, fontSize: 20, marginTop: 28 }}>Zwei Dinge zum Merken</h2>
      {warnungen.map((w) => (
        <section key={w.titel} className="dg-card" style={{ marginTop: 12, borderLeft: "4px solid var(--partial)" }}>
          <h2 style={h2}>{w.titel}</h2>
          <p style={p}>{w.text}</p>
        </section>
      ))}

      <div className="dg-nodruck" style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/admin/classes" className="dg-btn" style={{ display: "inline-block" }}>Zu deinen Klassen →</Link>
        <Link href="/admin/assignments" className="dg-btn" style={{ display: "inline-block" }}>Zum Baukasten →</Link>
      </div>
    </main>
  );
}
