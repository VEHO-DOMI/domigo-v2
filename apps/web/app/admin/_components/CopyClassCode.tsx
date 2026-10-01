"use client";
import { useState } from "react";

export default function CopyClassCode({ code, name }: { code: string; name: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(code);
      setStatus("Code kopiert.");
    } catch {
      setStatus("Kopieren nicht möglich. Markiere den Code und kopiere ihn selbst.");
    }
  }
  return (
    <div className="teacher-code">
      <div><span className="teacher-code-label">Beitrittscode</span><code>{code}</code></div>
      <button type="button" onClick={copy} aria-label={`Beitrittscode für ${name} kopieren`}>Kopieren</button>
      <p role="status" className="teacher-copy-status">{status}</p>
    </div>
  );
}
