import Link from "next/link";
import type { DictionaryEntry } from "@/lib/woerterbuch";

/** Shared by the child's home and the dictionary's teacher preview. */
export default function WordOfTheDay({ entry, preview = false }: { entry: DictionaryEntry; preview?: boolean }) {
  return (
    <section lang="de" className="dg-card" data-word-of-the-day={entry.id} data-grade={entry.grade} aria-label="Wort des Tages" style={{ marginTop: 20, overflowWrap: "anywhere" }}>
      <h2 style={{ fontSize: 15, margin: "0 0 12px", color: "var(--accent-deep)", fontFamily: "var(--font-label)" }}>Wort des Tages{preview && ` · Jahrgang ${entry.grade}`}</h2>
      <p lang="en" style={{ fontSize: 26, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>{entry.word}</p>
      <p style={{ margin: "0 0 8px", fontWeight: 600 }}>{entry.german}</p>
      <p lang="en" style={{ margin: "0 0 8px", lineHeight: 1.6, color: "var(--text-secondary)" }}>{entry.example}</p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "4px 16px" }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Chapter {entry.chapter}</span>
        <Link href={`/woerterbuch${preview ? `?jahrgang=${entry.grade}` : ""}#wort-${entry.id}`} prefetch={false} style={{ display: "inline-flex", alignItems: "center", minHeight: 44, color: "var(--accent-deep)", fontWeight: 700 }}>Im Wörterbuch →</Link>
      </div>
    </section>
  );
}
