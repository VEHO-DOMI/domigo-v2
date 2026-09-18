/**
 * /lehrkraft/pin-reset/[token] — hier wird der Link eingelöst.
 *
 * ── DER TOKEN WIRD NIE VERGLICHEN ───────────────────────────────────────────
 * Gespeichert ist nur sein Hash; gesucht wird per Hash. Es gibt in diesem Programm
 * also keine Stelle, an der zwei Token-Zeichenketten nebeneinanderliegen — die
 * Prüfung ist konstant in der Laufzeit, weil es nichts zu vergleichen gibt, nicht
 * weil jemand daran gedacht hat.
 *
 * ── EIN LINK, EIN MAL ───────────────────────────────────────────────────────
 * Der Blick beim Aufbau der Seite ist reine Höflichkeit (ein toter Link soll nicht
 * erst nach zwei getippten PINs auffallen). Entschieden wird beim Absenden, von EINEM
 * bewachten UPDATE: richtiger Hash, noch nicht verbraucht, noch nicht abgelaufen. Die
 * Zahl der zurückgegebenen Zeilen ist das Urteil — beim zweiten Klick auf denselben
 * Link sind es null. Neon-HTTP kennt keine Transaktionen; Lesen-dann-Schreiben wäre
 * genau das Rennen, das die Tabelle verhindern soll.
 *
 * ── DER NAME WIRD GELESEN, NIE GERATEN ──────────────────────────────────────
 * `upsertTeacherIdentity` schreibt bei der ersten Beförderung den Anmelde-Namen fest.
 * Ein Platzhalter würde die Kollegin aus ihrem eigenen Konto umbenennen (die K1b-Falle,
 * einmal bezahlt). Also kommt er aus derselben Doppel-Lesung wie bei der Anmeldung.
 *
 * ── ABGELAUFEN UND VERBRAUCHT SEHEN GLEICH AUS ──────────────────────────────
 * Beides ergibt dieselbe Fehlseite. Wer einen fremden Link testet, soll nicht erfahren,
 * ob er einmal echt war.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getDb,
  lookupTeacherAuthById,
  upsertTeacherIdentity,
  writeTeacherEvent,
} from "@domigo/db";
import { consumeResetToken, peekResetToken } from "@domigo/db/reset-tokens";
import { signIn } from "@/auth";
import { hashPin, STUDENT_PIN_PATTERN } from "@/lib/pin";

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

const fehlerText: Record<string, string> = {
  eingabe: "Bitte eine 6-stellige PIN vergeben — nur Ziffern.",
  pin: "Die beiden PINs stimmen nicht überein. Bitte beide Felder neu ausfüllen.",
  weg: "Dieser Link gilt nicht mehr. Fordere auf der Anmeldeseite einen neuen an.",
};

/** Die eine Fehlseite — für abgelaufen, verbraucht und erfunden gleichermaßen. */
function LinkTot({ ueberschrift, text }: { ueberschrift: string; text: string }) {
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
        {ueberschrift}
      </h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>{text}</p>
      <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 20 }}>
        <Link href="/lehrkraft/pin-vergessen" style={{ color: "var(--accent)", fontWeight: 600 }}>
          Neuen Link anfordern →
        </Link>
      </p>
    </main>
  );
}

export default async function PinResetSeite({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ fehler?: string }>;
}) {
  const { token } = await params;
  const sp = await searchParams;
  const blick = await peekResetToken(getDb(), token);

  if (!blick.ok && blick.reason === "no_table") {
    return (
      <LinkTot
        ueberschrift="Noch nicht eingerichtet"
        text="Der Weg per E-Mail ist auf dieser Installation noch nicht fertig eingerichtet. Koki kann dir eine Übergangs-PIN setzen."
      />
    );
  }
  if (!blick.ok) {
    return (
      <LinkTot
        ueberschrift="Link ungültig oder abgelaufen"
        text="Solche Links gelten 60 Minuten und lassen sich nur einmal verwenden. Fordere einfach einen neuen an."
      />
    );
  }

  async function setzen(formData: FormData) {
    "use server";
    const pin = String(formData.get("pin") ?? "");
    const pin2 = String(formData.get("pin2") ?? "");

    if (!STUDENT_PIN_PATTERN.test(pin)) redirect(`/lehrkraft/pin-reset/${token}?fehler=eingabe`);
    if (pin !== pin2) redirect(`/lehrkraft/pin-reset/${token}?fehler=pin`);

    // DAS Urteil. Ab hier ist der Link verbraucht, auch wenn danach etwas hakt — das
    // ist gewollt: ein Link, der nach einem Fehlschlag weiterlebt, ist kein Einmal-Link.
    const verbraucht = await consumeResetToken(getDb(), token);
    if (!verbraucht.ok) redirect(`/lehrkraft/pin-reset/${token}?fehler=weg`);

    const ziel = await lookupTeacherAuthById(getDb(), verbraucht.teacherId);
    if (!ziel) redirect(`/lehrkraft/pin-reset/${token}?fehler=weg`);

    const pinHash = await hashPin(pin);
    // Journal vor der Anwendung, wie überall im Haus.
    await writeTeacherEvent(getDb(), {
      teacherId: ziel.id,
      kind: "reset_consumed",
      actorId: ziel.id,
      payload: { selfService: true },
    });
    // `email` wird nicht mitgegeben: die hinterlegte Adresse bleibt, wie sie ist.
    await upsertTeacherIdentity(getDb(), { id: ziel.id, displayName: ziel.displayName, pinHash });

    // Sie meldet sich mit ihrer eigenen, gerade gesetzten PIN an — kein neuer
    // Anmeldeweg, kein Vertrauensvorschuss.
    try {
      await signIn("teacher", { nickname: ziel.displayName, pin, redirect: true, redirectTo: "/admin" });
    } catch (e) {
      if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
      redirect("/admin/signin"); // PIN gesetzt, nur die Auto-Anmeldung hat gehakt
    }
  }

  const fehler = sp.fehler ? (fehlerText[sp.fehler] ?? null) : null;

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
        Neue PIN vergeben
      </h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Sechs Ziffern, zweimal eingetippt. Danach bist du gleich angemeldet.
      </p>

      {fehler && (
        <p
          style={{
            background: "var(--incorrect-soft)",
            color: "var(--incorrect)",
            padding: "9px 13px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {fehler}
        </p>
      )}

      <form action={setzen} className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
        <label style={labelStyle}>
          Neue PIN
          <input
            name="pin"
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            type="password"
            autoComplete="new-password"
            className="dg-input"
          />
        </label>
        <label style={labelStyle}>
          Noch einmal
          <input
            name="pin2"
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            type="password"
            autoComplete="new-password"
            className="dg-input"
          />
        </label>
        <button type="submit" className="dg-btn" style={{ marginTop: 4, padding: "12px 16px" }}>
          PIN setzen und anmelden
        </button>
      </form>
    </main>
  );
}
