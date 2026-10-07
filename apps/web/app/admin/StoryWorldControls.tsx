"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function StoryWorldControls({ grades, allowedGrades, available }: {
  grades: { grade: number; isOpen: boolean }[];
  allowedGrades: number[];
  available: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [refreshing, startTransition] = useTransition();

  async function save(grade: number, isOpen: boolean) {
    setPending(grade);
    setMessage("");
    try {
      const res = await fetch("/admin/story-world", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ grade, isOpen }),
      });
      if (!res.ok || res.redirected) throw new Error("save_failed");
      const result: unknown = await res.json();
      if (typeof result !== "object" || result === null || !("ok" in result) || result.ok !== true) {
        throw new Error("save_failed");
      }
      // Refresh the server's confirmed state, including the mastery sections.
      startTransition(() => router.refresh());
      setMessage(`Grade ${grade}: ${isOpen ? "open" : "parked"}.`);
    } catch {
      setMessage("Could not save. Reload and try again.");
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="dg-card" aria-labelledby="story-world-heading" style={{ marginTop: 24 }}>
      <h2 id="story-world-heading" style={{ fontSize: 17, margin: "0 0 10px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Story world</h2>
      <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
        Applies to all classes in the grade. Saved progress is kept. You can change grades taught by your active classes.
      </p>
      {!available && <p role="alert">Settings are unavailable. Release defaults are shown. Reload to try again.</p>}
      {grades.map(({ grade, isOpen }) => (
        <div key={grade} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
          <span style={{ flex: 1 }}>Grade {grade} — {isOpen ? "open" : "parked"}</span>
          <button type="button" className="dg-btn" aria-label={`Grade ${grade}: ${isOpen ? "park" : "open"} story world`}
            disabled={!available || !allowedGrades.includes(grade) || pending !== null || refreshing}
            onClick={() => void save(grade, !isOpen)} style={{ minHeight: 44 }}>
            {pending === grade ? "Saving…" : isOpen ? "Park" : "Open"}
          </button>
        </div>
      ))}
      <p role="status" aria-live="polite" style={{ fontSize: 14, minHeight: 20 }}>{message}</p>
    </section>
  );
}
