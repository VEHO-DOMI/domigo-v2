/**
 * /lehrkraft/pin-vergessen — der Selbstbedienungs-Weg zurück ins eigene Konto.
 *
 * Die Seite liegt bewusst AUSSERHALB von /admin: wer hier landet, hat keine Sitzung,
 * und der Middleware-Matcher fängt /lehrkraft nicht (derselbe bewiesene Platz wie der
 * Einladungs-Link). Ein Token in der Adresse braucht sie NICHT — sie legt kein Konto
 * an, sie schickt höchstens Post an eine Adresse, die schon hinterlegt ist.
 *
 * ── DIE ANTWORT IST IMMER DIESELBE ──────────────────────────────────────────
 * Egal ob der Name existiert, ob eine Adresse hinterlegt ist, ob die Bremse gegriffen
 * hat oder ob der Versand gescheitert ist: es erscheint derselbe Satz. Jede Abweichung
 * wäre ein Auskunftsdienst darüber, welche Kolleginnen ein Konto haben — und genau
 * dieses Wissen ist der erste Schritt jedes Rate-Angriffs. Was schiefging, steht im
 * Server-Protokoll, nicht auf der Seite.
 *
 * ── FEHLT DER MAILWEG, SAGT DIE SEITE DAS ───────────────────────────────────
 * Ohne eingerichteten Versand erscheint gar kein Formular, sondern die ehrliche Karte
 * mit dem menschlichen Rückfallweg: die Großmeister-Hand setzt eine Übergangs-PIN
 * (K1b). Das ist eine Aussage über die INSTALLATION, nicht über eine Person — sie
 * verrät niemanden und darf deshalb offen dastehen.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  bumpAndCheck,
  getDb,
  getTeacherEmail,
  lookupTeacherForAuth,
  RESET_REQUEST_POLICY,
  resetThrottleKey,
  writeTeacherEvent,
} from "@domigo/db";
import { RESET_TOKEN_TTL_MINUTES, mintResetToken } from "@domigo/db/reset-tokens";
import { buildResetMail, mailerState, sendMail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
  fontSize: 14,
  fontWeight: 600,
  color: "var(--ink-soft)",
  fontFamily: "var(--font-body)",
} as const;

const NEUTRALER_SATZ =
  `Wenn zu diesem Namen eine E-Mail-Adresse hinterlegt ist, ist jetzt ein Link unterwegs. ` +
  `Er gilt ${RESET_TOKEN_TTL_MINUTES} Minuten. Schau auch im Spam-Ordner nach.`;

/**
 * Woher der Link seinen Anfang nimmt. Erst die gesetzte Umgebung, erst zuletzt der
 * Host-Kopf des Aufrufs: der Kopf ist vom Aufrufer frei wählbar, und ein Link in einer
 * echten Mail darf nicht auf eine fremde Adresse zeigen, nur weil jemand das so
 * hingeschrieben hat.
 */
async function basisAdresse(): Promise<string> {
  const gesetzt = (process.env.AUTH_URL ?? "").trim();
  if (gesetzt) return gesetzt.replace(/\/+$/, "");
  const prod = (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "").trim();
  if (prod) return `https://${prod}`;
  const h = await headers();
  const host = h.get("host") ?? "localhost:3013";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function PinVergessenSeite({
  searchParams,
}: {
  searchParams: Promise<{ gesendet?: string; zustand?: string }>;
}) {
  const sp = await searchParams;
  const versand = mailerState();
  const eingerichtet = versand.kind !== "off" && sp.zustand !== "nicht-eingerichtet";

  async function anfordern(formData: FormData) {
    "use server";
    const name = String(formData.get("nickname") ?? "").trim();
    // Auch ein leeres Feld bekommt die neutrale Antwort — eine Eingabe-Rüge wäre
    // harmlos, aber zwei verschiedene Antworten sind ein Unterschied, den jemand messen kann.
    if (name === "") redirect("/lehrkraft/pin-vergessen?gesendet=1");

    // Die Bremse gegen Mail-Belästigung: drei Anforderungen je Name und Stunde. Auch
    // eine Ablehnung endet im neutralen Satz.
    const erlaubt = await bumpAndCheck(getDb(), resetThrottleKey(name), RESET_REQUEST_POLICY);
    if (!erlaubt) redirect("/lehrkraft/pin-vergessen?gesendet=1");

    const zeile = await lookupTeacherForAuth(getDb(), name);
    if (!zeile) redirect("/lehrkraft/pin-vergessen?gesendet=1");
    // Eigene, duldsame Abfrage — bewusst NICHT Teil der Anmelde-Lesung (auth.ts sagt,
    // warum). Fehlt die Spalte noch, liefert sie null, und der Weg endet hier.
    const adresse = await getTeacherEmail(getDb(), zeile.id);
    if (!adresse) redirect("/lehrkraft/pin-vergessen?gesendet=1");

    const gemuenzt = await mintResetToken(getDb(), zeile.id);
    if (!gemuenzt.ok) {
      // Fehlt die Tabelle (das Fenster zwischen Merge und angewandter Migration), darf
      // die Seite nicht »Link unterwegs« behaupten. Der Zustand gilt für alle gleich
      // und verrät daher nichts über diesen Namen.
      redirect("/lehrkraft/pin-vergessen?zustand=nicht-eingerichtet");
    }

    await writeTeacherEvent(getDb(), {
      teacherId: zeile.id,
      kind: "reset_requested",
      actorId: zeile.id,
      payload: { ttlMinutes: RESET_TOKEN_TTL_MINUTES },
    });

    const link = `${await basisAdresse()}/lehrkraft/pin-reset/${gemuenzt.token}`;
    const mail = buildResetMail(link, RESET_TOKEN_TTL_MINUTES);
    // Der Rückgabewert wird bewusst nicht in die Antwort gespiegelt: ob der Versand
    // klappte, ist eine Auskunft über die Existenz des Kontos.
    await sendMail({ to: adresse, ...mail }, versand);

    redirect("/lehrkraft/pin-vergessen?gesendet=1");
  }

  return (
    <main
      style={{
        maxWidth: 460,
        margin: "0 auto",
        padding: "24px 20px 48px",
        fontFamily: "var(--font-body)",
        color: "var(--text)",
      }}
    >
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>
        PIN vergessen
      </h1>

      {!eingerichtet ? (
        <>
          <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
            Der Weg per E-Mail ist auf dieser Installation noch nicht eingerichtet.
          </p>
          <section className="dg-card" style={{ marginTop: 16 }}>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "var(--text-secondary)" }}>
              Melde dich bei Koki — er kann dir im Großmeister-Bereich eine <strong>Übergangs-PIN</strong> setzen.
              Damit kommst du sofort wieder hinein und vergibst unter <em>Einstellungen</em> gleich eine eigene.
            </p>
          </section>
        </>
      ) : sp.gesendet ? (
        <>
          <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>{NEUTRALER_SATZ}</p>
          <section className="dg-card" style={{ marginTop: 16 }}>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "var(--text-secondary)" }}>
              Kein Link angekommen? Dann ist bei diesem Namen vielleicht noch keine Adresse hinterlegt. Koki kann
              dir eine Übergangs-PIN setzen — danach kannst du deine Adresse unter <em>Einstellungen</em> eintragen,
              damit es beim nächsten Mal allein geht.
            </p>
          </section>
        </>
      ) : (
        <>
          <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
            Trag deinen Anmelde-Namen ein. Ist zu deinem Konto eine E-Mail-Adresse hinterlegt, schicken wir dir
            einen Link, mit dem du eine neue PIN vergibst.
          </p>
          <form action={anfordern} className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
            <label style={labelStyle}>
              Dein Anmelde-Name
              <input name="nickname" required maxLength={64} autoComplete="username" className="dg-input" />
            </label>
            <button type="submit" className="dg-btn" style={{ marginTop: 4, padding: "12px 16px" }}>
              Link anfordern
            </button>
          </form>
        </>
      )}

      <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 20 }}>
        <Link href="/admin/signin" style={{ color: "var(--accent)", fontWeight: 600 }}>
          Zurück zur Anmeldung →
        </Link>
      </p>
    </main>
  );
}
