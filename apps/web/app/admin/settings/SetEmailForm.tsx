"use client";
/**
 * K2a · Store (or clear) the recovery address, guarded by the current PIN.
 *
 * Shaped after its neighbour ChangePinForm: the same inline style objects, the same
 * ERROR_COPY map keyed by the route's error ids, the same optimistic-free "do it,
 * then say what happened" flow. The current PIN is asked for because whoever can set
 * this address can have a reset link mailed to themselves.
 *
 * Clearing is a first-class action, not an oversight: emptying the field and saving
 * removes the address. A colleague leaving the school should be able to take her
 * inbox out of our database without asking anybody.
 */
import { useState, type CSSProperties } from "react";

const label: CSSProperties = {
  fontFamily: "var(--font-label)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--muted)",
  display: "block",
  marginBottom: 4,
};

const input: CSSProperties = {
  fontSize: 16,
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid var(--card-border)",
  background: "var(--bg-sunken)",
  color: "var(--text)",
  width: "100%",
  maxWidth: 340,
};

const pinInput: CSSProperties = {
  ...input,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 18,
  letterSpacing: "0.12em",
  maxWidth: 220,
};

const ERROR_COPY: Record<string, string> = {
  wrong_current_pin: "That’s not your current PIN.",
  invalid_email: "That doesn’t look like an email address.",
  too_many_attempts: "Too many tries. Wait ten minutes, then try again.",
  not_yet_available: "This isn’t switched on yet on this installation — ask Koki.",
  forbidden: "Please sign in as a teacher and try again.",
  bad_request: "Something went wrong — please try again.",
  persist_failed: "Couldn’t save the address — please try again.",
};

export default function SetEmailForm({ initialEmail }: { initialEmail: string | null }) {
  const [stored, setStored] = useState<string | null>(initialEmail);
  const [email, setEmail] = useState(initialEmail ?? "");
  const [currentPin, setCurrentPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setDone(null);
    if (!currentPin) {
      setError("Enter your current PIN.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/teacher/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPin, email }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) {
        setStored(d.email ?? null);
        setCurrentPin("");
        setDone(d.email ? "✓ Saved. That’s where a recovery link would go." : "✓ Removed. No address is stored any more.");
        return;
      }
      setError(ERROR_COPY[d.error as string] ?? "Something went wrong — please try again.");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>
        Currently stored: <strong>{stored ?? "nothing yet"}</strong>
      </p>
      <div>
        <label style={label} htmlFor="recovery-email">
          Email address
        </label>
        <input
          id="recovery-email"
          style={input}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--muted)" }}>
          Leave it empty and save to remove the stored address.
        </p>
      </div>
      <div>
        <label style={label} htmlFor="recovery-current-pin">
          Your current PIN
        </label>
        <input
          id="recovery-current-pin"
          style={pinInput}
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          value={currentPin}
          onChange={(e) => setCurrentPin(e.target.value)}
        />
      </div>
      <button type="button" className="dg-btn" disabled={busy} onClick={submit} style={{ opacity: busy ? 0.6 : 1, alignSelf: "flex-start" }}>
        {busy ? "Saving…" : "Save address"}
      </button>
      {done && <p style={{ color: "var(--correct)", fontWeight: 700, margin: 0 }}>{done}</p>}
      {error && <p style={{ color: "var(--incorrect)", fontSize: 14, margin: 0 }}>{error}</p>}
    </div>
  );
}
