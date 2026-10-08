/**
 * cgo-047 · Das Band über jeder Kinderfläche, die eine Lehrkraft als Vorschau
 * öffnet (lib/student-view.ts). Es sagt, was das Spiel selbst nicht sagt: hier
 * wird NICHTS gespeichert — kein Versuch, kein Spielstand, keine Wiederholung.
 * Bewusst eine eigene Komponente: die /play-Kopfzeile in BrandHeader hält
 * scripts/check-umbrella-tokens.mjs bytegenau fest.
 */
import Link from "next/link";
import PreviewAssignmentLink from "./PreviewAssignmentLink";

export default function PreviewBanner({ grade, note }: { grade?: number; note?: string }) {
  return (
    <div
      role="status"
      data-preview-banner=""
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: "4px 14px", padding: "8px 16px", background: "var(--card)", borderBottom: "1.5px dashed var(--accent)", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)" }}
    >
      <span>
        <strong style={{ color: "var(--ink)" }}>Vorschau als Lehrkraft</strong>
        {grade ? ` · Klasse ${grade}` : ""} · nichts wird gespeichert
        {note ? ` · ${note}` : ""}
      </span>
      <Link href="/admin/explorer" style={{ color: "var(--accent)", fontWeight: 700 }}>← Zur Schüleransicht</Link>
      <PreviewAssignmentLink />
    </div>
  );
}
