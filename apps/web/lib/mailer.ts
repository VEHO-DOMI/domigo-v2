/**
 * K2a · THE MAILER — one message, one purpose: carry a recovery link.
 *
 * WHY BREVO, AND WHY BY HAND. Brevo's free tier accepts a SINGLE VERIFIED SENDER
 * ADDRESS, so an ordinary mailbox works and no domain has to be bought or proven.
 * (Resend, the obvious alternative, wants a verified domain.) Its send endpoint is
 * one JSON POST, so `fetch` does the whole job — no dependency joins the tree for
 * five lines of HTTP.
 *
 * THE MAIL NEVER CARRIES A PIN. It carries a link and nothing else that matters. A
 * mailbox is not a safe, and a PIN sitting in one outlives every reason it was sent.
 *
 * FAIL-CLOSED, AND SAID OUT LOUD. With no API key configured nothing is sent and
 * `mailerState` reports `off`, which the "PIN vergessen" page renders as an honest
 * card pointing at the human fallback (the operator's transitional PIN, K1b) — never
 * as a cheerful "check your inbox" for a mail that was never written.
 *
 * ── THE DEV TRANSPORT, AND WHY IT HAD TO EXIST ──────────────────────────────
 * The recovery token is stored as a HASH ONLY (packages/db/src/reset-tokens.ts), so
 * the plaintext link exists exactly once — inside the mail. It follows that nobody,
 * including us, can reconstruct a link from the database. To exercise the flow
 * end-to-end without a Brevo account and without sending real mail, `MAIL_TRANSPORT
 * = console` writes the message to the server log instead of sending it.
 *
 * That escape hatch is gated on `VERCEL_ENV !== "production"` — the same shape
 * lib/teacher.ts uses for its dev sign-in bypass. On production the variable is inert
 * even if someone sets it, so a recovery link can never be reduced to a log line
 * where the wrong pair of eyes finds it.
 */

export interface MailerConfig {
  apiKey: string;
  fromAddress: string;
  fromName: string;
}

export type MailerState =
  | { kind: "brevo"; config: MailerConfig }
  /** Dev only: the message goes to the server log so the flow can be walked. */
  | { kind: "console" }
  /** Nothing is configured — the surfaces must say so rather than pretend. */
  | { kind: "off" };

export interface Mail {
  to: string;
  subject: string;
  text: string;
}

/**
 * Read the environment once and decide how (and whether) mail can leave.
 *
 * The parameter is a plain record rather than NodeJS.ProcessEnv so a test can hand it
 * four keys instead of mutating the real environment — which is the only way to reach
 * every branch here without module mocking, and apps/web has none.
 */
export function mailerState(env: Record<string, string | undefined> = process.env): MailerState {
  if (env.MAIL_TRANSPORT === "console" && env.VERCEL_ENV !== "production") return { kind: "console" };
  const apiKey = (env.BREVO_API_KEY ?? "").trim();
  const fromAddress = (env.MAIL_FROM_ADDRESS ?? "").trim();
  if (!apiKey || !fromAddress) return { kind: "off" };
  return {
    kind: "brevo",
    config: { apiKey, fromAddress, fromName: (env.MAIL_FROM_NAME ?? "").trim() || "DomiGo" },
  };
}

/**
 * The recovery message. Pure — no environment, no clock, no network — so it can be
 * read by a test and asserted to carry the link and nothing secret.
 *
 * It says how long the link lives, and it tells a reader who did NOT ask for it that
 * ignoring the mail is the correct and sufficient response: her PIN is unchanged
 * until somebody actually opens the link.
 */
export function buildResetMail(link: string, ttlMinutes: number): Omit<Mail, "to"> {
  return {
    subject: "DomiGo — neue PIN vergeben",
    text: [
      "Hallo!",
      "",
      "Du hast für dein DomiGo-Lehrerkonto eine neue PIN angefordert.",
      "Öffne dazu diesen Link:",
      "",
      link,
      "",
      `Der Link gilt ${ttlMinutes} Minuten und lässt sich nur ein einziges Mal verwenden.`,
      "",
      "Wenn du das nicht warst, kannst du diese Nachricht einfach löschen — deine",
      "bisherige PIN bleibt gültig, solange niemand den Link öffnet.",
      "",
      "DomiGo",
    ].join("\n"),
  };
}

/**
 * Send one mail. Returns whether it left the building.
 *
 * A failure here is logged and reported to the caller, never thrown: the caller has
 * already minted a token and must answer the visitor with the same neutral sentence
 * either way — anything else would turn a mail outage into a way of asking the
 * server which accounts exist.
 */
export async function sendMail(mail: Mail, state: MailerState = mailerState()): Promise<boolean> {
  if (state.kind === "off") return false;

  if (state.kind === "console") {
    console.log(
      [
        "",
        "── MAIL (dev transport, nothing was sent) ──────────────",
        `An:      ${mail.to}`,
        `Betreff: ${mail.subject}`,
        "",
        mail.text,
        "────────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return true;
  }

  const { apiKey, fromAddress, fromName } = state.config;
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: fromName, email: fromAddress },
        to: [{ email: mail.to }],
        subject: mail.subject,
        textContent: mail.text,
      }),
    });
    if (!res.ok) {
      // The status, never the body: a provider error can echo back the recipient.
      console.error(`[mailer] Brevo refused the message: HTTP ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[mailer] send failed:", err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200));
    return false;
  }
}
