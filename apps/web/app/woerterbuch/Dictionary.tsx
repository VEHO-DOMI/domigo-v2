"use client";

import Link from "next/link";
import { useState } from "react";
import type { DictionaryEntry } from "@/lib/woerterbuch";
import { dictionaryResults } from "./search";

function WordList({ entries, showGrade }: { entries: readonly DictionaryEntry[]; showGrade: boolean }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {entries.map((entry) => (
        <li key={entry.id} id={`wort-${entry.id}`} data-word-id={entry.id} data-grade={entry.grade} style={{ padding: "18px 0", borderBottom: "1px solid var(--rule)", scrollMarginTop: 24, overflowWrap: "anywhere" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "6px 16px" }}>
            <h3 lang="en" style={{ fontSize: 20, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{entry.word}</h3>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{showGrade && `Jahrgang ${entry.grade} · `}Chapter {entry.chapter}</span>
          </div>
          <p style={{ margin: "4px 0", fontWeight: 600 }}>{entry.german}</p>
          <p lang="en" style={{ margin: "8px 0", color: "var(--text-secondary)", lineHeight: 1.6 }}>{entry.example}</p>
          <Link href={`/practice/${entry.slug}`} prefetch={false} aria-label={`${entry.word}: Chapter ${entry.chapter} üben`} style={{ display: "inline-flex", alignItems: "center", minHeight: 44, color: "var(--accent-deep)", fontWeight: 700 }}>Üben →</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Dictionary({ entries, showGrade }: { entries: DictionaryEntry[]; showGrade: boolean }) {
  const [query, setQuery] = useState("");
  const { searching, matches, groups } = dictionaryResults(entries, query);
  return (
    <section aria-label="Wörter nachschlagen" style={{ marginTop: 28 }}>
      <label htmlFor="dictionary-search" style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Wort suchen</label>
      <input id="dictionary-search" type="search" className="dg-input" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" spellCheck={false} aria-describedby="dictionary-help" placeholder="Englisch oder Deutsch" style={{ width: "100%", boxSizing: "border-box" }} />
      <p id="dictionary-help" style={{ fontSize: 14, margin: "8px 0", color: "var(--text-secondary)" }}>Gib mindestens zwei Zeichen ein.</p>
      <p role="status" aria-live="polite" style={{ fontSize: 14, color: "var(--text-secondary)" }}>{searching ? `${matches.length} Treffer` : `${entries.length} Einträge · alphabetisch`}</p>
      {searching && matches.length === 0 && <p>Kein Wort gefunden. Versuche ein anderes Wort auf Englisch oder Deutsch.</p>}
      {searching ? groups.map(({ slug, words }) => (
        <section key={slug} aria-labelledby={`chapter-${slug}`} style={{ marginTop: 24 }}>
          <h2 id={`chapter-${slug}`} style={{ fontSize: 18, marginBottom: 0, color: "var(--accent-deep)" }}>{showGrade && `Jahrgang ${words[0]!.grade} · `}Chapter {words[0]!.chapter}</h2>
          <WordList entries={words} showGrade={showGrade} />
        </section>
      )) : <WordList entries={matches} showGrade={showGrade} />}
    </section>
  );
}
