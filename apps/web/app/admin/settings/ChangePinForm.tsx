"use client";
/**
 * Change-PIN form (WS-AUTH Phase A). Pure client state → POST /api/admin/teacher/pin.
 * The inline checks are only live feedback; the route re-validates authoritatively
 * (verifies the current PIN and enforces the 4–6-digit rule server-side) and writes
 * the new hash to the writable v2 identity. On success the teacher keeps their
 * current session (the id is unchanged) and signs in with the new PIN next time.
 */
import { useState, type CSSProperties } from "react";

const label: CSSProperties = { fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 4 };
const input: CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 18, letterSpacing: "0.12em", padding: "9px 12px", borderRadius: 10, border: "1px solid var(--card-border)", background: "var(--bg-sunken)", color: "var(--text)", width: "100%", maxWidth: 220 };

const NEW_PIN_RE = /^[0-9]{4,6}$/;

const ERROR_COPY: Record<string, string> = {
  wrong_current_pin: "That’s not your current PIN.",
  invalid_new_pin: "Your new PIN must be 4–6 digits.",
  forbidden: "Please sign in as a teacher and try again.",
  bad_request: "Something went wrong — please try again.",
  persist_failed: "Couldn’t save your new PIN — please try again.",
};

export default function ChangePinForm() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Keep inputs numeric so a PIN can't pick up stray characters.
  const digitsOnly = (v: string) => v.replace(/[^0-9]/g, "").slice(0, 6);

  const submit = async () => {
    setError(null);
    if (!currentPin) { setError("Enter your current PIN."); return; }
    if (!NEW_PIN_RE.test(newPin)) { setError("Your new PIN must be 4–6 digits."); return; }
    if (newPin !== confirmPin) { setError("The two new PINs don’t match."); return; }
    if (newPin === currentPin) { setError("Your new PIN must be different from the current one."); return; }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/teacher/pin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPin, newPin }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) {
        setDone(true);
        setCurrentPin(""); setNewPin(""); setConfirmPin("");
        return;
      }
      setError(ERROR_COPY[d.error as string] ?? "Something went wrong — please try again.");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <p style={{ color: "var(--correct)", fontWeight: 700, margin: 0 }}>
        ✓ Your PIN has been changed. Use it the next time you sign in.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label style={label}>Current PIN</label>
        <input style={input} type="password" inputMode="numeric" autoComplete="current-password"
          value={currentPin} onChange={(e) => setCurrentPin(digitsOnly(e.target.value))} />
      </div>
      <div>
        <label style={label}>New PIN (4–6 digits)</label>
        <input style={input} type="password" inputMode="numeric" autoComplete="new-password"
          value={newPin} onChange={(e) => setNewPin(digitsOnly(e.target.value))} />
      </div>
      <div>
        <label style={label}>Confirm new PIN</label>
        <input style={input} type="password" inputMode="numeric" autoComplete="new-password"
          value={confirmPin} onChange={(e) => setConfirmPin(digitsOnly(e.target.value))} />
      </div>
      <div>
        <button type="button" className="dg-btn" disabled={busy} onClick={submit} style={{ opacity: busy ? 0.6 : 1 }}>
          {busy ? "Saving…" : "Change PIN"}
        </button>
      </div>
      {error && <p style={{ color: "var(--incorrect)", fontSize: 14, margin: 0 }}>{error}</p>}
    </div>
  );
}
