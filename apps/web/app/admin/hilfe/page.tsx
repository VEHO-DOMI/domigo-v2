/**
 * /admin/hilfe — die eine Seite, die eine Lehrkraft zum Loslegen braucht.
 *
 * Drei Schritte, zwei Warnungen, sonst nichts. Reine Server-Komponente (keine
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

// dach-108 · Klassen, Klassenlisten und die Anmeldung liegen bei Lauter Einser
// (Koki 19.09., E-3): die Schritte »Schülerliste einfügen«, »PIN wählen« und die
// Warnungen zu Archivieren und »Reset PIN« beschrieben Wege, die es in DomiGo nicht
// mehr gibt. Diese Seite sagt, wo es jetzt geht.
const schritte: { titel: string; text: string }[] = [
  {
    titel: "1 · Deine Klasse kommt aus Lauter Einser",
    text: "Klassen und Klassenlisten legst du im Lehrerzimmer von Lauter Einser an. In DomiGo erscheint die Klasse danach von selbst hinter der Schaltfläche »Manage classes →« — anlegen, umbenennen oder eine Liste einfügen musst und kannst du hier nicht.",
  },
  {
    titel: "2 · Beitritts-Link austeilen",
    text: "Auf der Roster-Seite deiner Klasse steht der Beitritts-Link samt Code, mit einer Schaltfläche »Copy join link«. Er führt zur Beitrittsseite bei Lauter Einser; dort meldet sich jedes Kind an. DomiGo selbst nimmt keine PIN und kein Passwort entgegen.",
  },
  {
    titel: "3 · Ergebnisse lesen",
    text: "Im Baukasten (»Open the assignment builder →«) stellst du Übungen und Schularbeits-Proben zusammen und siehst danach, wer wie weit gekommen ist. Auf der Lehrer-Startseite steht außerdem je Einheit, wie sicher deine Klasse schon ist.",
  },
];

const warnungen: { titel: string; text: string }[] = [
  {
    titel: "Klassen pflegst du bei Lauter Einser",
    text: "Eine Klasse anlegen, umbenennen oder archivieren und eine Klassenliste einfügen geht nur im Lehrerzimmer von Lauter Einser. An diesen Stellen zeigt DomiGo den Satz »Klassen und Klassenlisten pflegst du im Lehrerzimmer von Lauter Einser.« mit einem Link dorthin.",
  },
  {
    titel: "Passwort vergessen?",
    text: "Angemeldet wird nur über das Konto bei Lauter Einser — für dich und für die Kinder. Ein vergessenes Passwort wird dort zurückgesetzt, nicht in DomiGo. Eine DomiGo-PIN gibt es nicht mehr.",
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
        In drei Schritten startklar
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
