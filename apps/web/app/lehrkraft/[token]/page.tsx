/**
 * /lehrkraft/[token] — der GEMEINSAME Einladungs-Link für Kolleginnen und Kollegen.
 *
 * Koki legt die Klassen des Schuljahres vorab an; alle Lehrkräfte bekommen DENSELBEN
 * Link. Wer ihn öffnet, sieht die noch freien Klassen, wählt die eigene, legt Namen
 * und PIN fest — und die Klasse gehört ihr. Danach ist sie eine ganz normale Lehrkraft.
 *
 * Das Muster ist der Schüler-Selbstbeitritt auf /join/[code], eine Etage höher.
 *
 * Warum ein Token in der Adresse und kein offenes Formular: ohne ihn wäre das hier ein
 * Konto-Anlage-Formular für jedermann. Der Token kommt aus TEACHER_INVITE_TOKEN und
 * wird EXAKT verglichen; fehlt oder leer ⇒ die Route existiert nicht (notFound), genau
 * wie der Großmeister-Rang bei leerer Liste zusperrt. Widerruf = Wert ändern + neu
 * ausrollen. Die Seite liegt bewusst AUSSERHALB von /admin, damit die Middleware sie
 * nicht in die Anmeldung umleitet — sie ist ja gerade für Leute ohne Konto da.
 *
 * Die Liste zeigt Name und Stufe, sonst nichts: kein Beitrittscode, kein Personendatum.
 */
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { claimClassAsTeacher, getDb, inviteTokenMatches, listClaimableClasses } from "@domigo/db";
import { signIn } from "@/auth";
import { grandmasterIds } from "@/lib/grandmaster";
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
  eingabe: "Bitte Klasse wählen, Namen eintragen und eine 6-stellige PIN vergeben.",
  pin: "Die beiden PINs stimmen nicht überein. Bitte beide Felder neu ausfüllen.",
  vergeben: "Dieser Name ist schon vergeben — nimm zum Beispiel »Maier B.« oder deinen Vornamen dazu.",
  weg: "Diese Klasse wurde gerade von jemand anderem übernommen. Such dir bitte eine andere aus der Liste.",
};

export default async function LehrkraftBeitrittSeite({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ fehler?: string }>;
}) {
  const { token } = await params;
  const sp = await searchParams;

  // DAS Tor. Vor jedem Datenbankzugriff — eine Prüfung nach dem Lesen wäre keine
  // Sperre, sondern eine Preisgabe mit Umleitung hinten dran.
  if (!inviteTokenMatches(token, process.env.TEACHER_INVITE_TOKEN)) notFound();

  const klassen = await listClaimableClasses(getDb(), grandmasterIds());

  async function beitreten(formData: FormData) {
    "use server";
    const classId = String(formData.get("classId") ?? "");
    const displayName = String(formData.get("displayName") ?? "").trim();
    const pin = String(formData.get("pin") ?? "");
    const pin2 = String(formData.get("pin2") ?? "");

    if (!classId || displayName === "" || !STUDENT_PIN_PATTERN.test(pin)) {
      redirect(`/lehrkraft/${token}?fehler=eingabe`);
    }
    if (pin !== pin2) redirect(`/lehrkraft/${token}?fehler=pin`);

    const pinHash = await hashPin(pin);
    const ergebnis = await claimClassAsTeacher(getDb(), {
      classId,
      ownerIds: grandmasterIds(),
      displayName,
      pinHash,
    });
    if (ergebnis === "taken") redirect(`/lehrkraft/${token}?fehler=vergeben`);
    if (ergebnis === "gone") redirect(`/lehrkraft/${token}?fehler=weg`);

    // Übernommen ⇒ direkt anmelden (Name + PIN von eben authentifizieren v2-zuerst),
    // dasselbe Muster wie der Schüler-Beitritt auf /join/[code].
    try {
      await signIn("teacher", { nickname: displayName, pin, redirect: true, redirectTo: "/admin" });
    } catch (e) {
      if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
      redirect("/admin/signin"); // übernommen, nur die Auto-Anmeldung hat gehakt
    }
  }

  const fehler = sp.fehler ? fehlerText[sp.fehler] : undefined;

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "24px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>
        Deine Klasse übernehmen
      </h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Such dir deine Klasse aus, trag deinen Namen ein und vergib eine 6-stellige PIN. Danach bist du
        gleich angemeldet und kannst deine Schülerliste einfügen.
      </p>
      <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
        Du hast deine Klasse schon übernommen?{" "}
        <Link href="/admin/signin" style={{ color: "var(--accent)", fontWeight: 600 }}>Zur Anmeldung →</Link>
      </p>

      {fehler && (
        <p style={{ background: "var(--incorrect-soft)", color: "var(--incorrect)", padding: "9px 13px", borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
          {fehler}
        </p>
      )}

      {klassen.length === 0 ? (
        <div className="dg-card" style={{ marginTop: 16 }}>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            Im Moment ist keine Klasse frei — entweder sind schon alle übernommen, oder deine ist noch
            nicht angelegt. Melde dich bei Koki; er legt sie an, dann funktioniert derselbe Link.
          </p>
        </div>
      ) : (
        <form action={beitreten} className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
          <fieldset style={{ border: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <legend style={{ ...labelStyle, marginBottom: 4, padding: 0 }}>1 · Welche Klasse ist deine?</legend>
            {klassen.map((k) => (
              <label key={k.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--card-border)", borderRadius: 12, background: "var(--bg-sunken)", cursor: "pointer" }}>
                <input type="radio" name="classId" value={k.id} required defaultChecked={klassen.length === 1} />
                <span style={{ fontWeight: 700, color: "var(--ink)" }}>{k.name}</span>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>Stufe {k.grade}</span>
              </label>
            ))}
          </fieldset>

          <label style={labelStyle}>
            2 · Dein Name (damit meldest du dich an)
            <input name="displayName" required maxLength={32} autoComplete="off" placeholder="z. B. Maier" className="dg-input" />
          </label>

          <label style={labelStyle}>
            3 · Deine PIN (6 Ziffern)
            <input name="pin" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} type="password" autoComplete="off" placeholder="6 Ziffern" className="dg-input" />
          </label>

          <label style={labelStyle}>
            4 · PIN noch einmal
            <input name="pin2" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} type="password" autoComplete="off" placeholder="6 Ziffern" className="dg-input" />
          </label>

          <button type="submit" className="dg-btn" style={{ marginTop: 4, padding: "12px 16px" }}>
            Klasse übernehmen
          </button>
        </form>
      )}
    </main>
  );
}
