"use client";

import Link from "next/link";
import { useLearningText } from "@/lib/trainer/LearningShell";
import { useState } from "react";
import type { DictionaryEntry } from "@/lib/woerterbuch";
import { dictionaryResults } from "./search";

function WordList({ entries, showGrade }: { entries: readonly DictionaryEntry[]; showGrade: boolean }) {
  const t = useLearningText();
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {entries.map((entry) => (
        <li key={entry.id} id={`wort-${entry.id}`} data-word-id={entry.id} data-grade={entry.grade} style={{ padding: "18px 0", borderBottom: "1px solid var(--rule)", scrollMarginTop: 24, overflowWrap: "anywhere" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "6px 16px" }}>
            <h3 lang="en" style={{ fontSize: 20, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{entry.word}</h3>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{showGrade && t(`Jahrgang ${entry.grade} · `, `Grade ${entry.grade} · `)}Chapter {entry.chapter}</span>
          </div>
          <p lang="de" style={{ margin: "4px 0", fontWeight: 600 }}>{entry.german}</p>
          <p lang="en" style={{ margin: "8px 0", color: "var(--text-secondary)", lineHeight: 1.6 }}>{entry.example}</p>
          <Link href={`/practice/${entry.slug}`} prefetch={false} aria-label={t(`${entry.word}: Chapter ${entry.chapter} üben`, `${entry.word}: practise Chapter ${entry.chapter}`)} style={{ display: "inline-flex", alignItems: "center", minHeight: 44, color: "var(--ink)", fontWeight: 700 }}>{t("Üben →", "Practise →")}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Dictionary({ entries, showGrade }: { entries: DictionaryEntry[]; showGrade: boolean }) {
  const t = useLearningText();
  const [query, setQuery] = useState("");
  const { searching, matches, groups } = dictionaryResults(entries, query);
  return (
    <section aria-label={t("Wörter nachschlagen", "Look up words")} style={{ marginTop: 28 }}>
      <label htmlFor="dictionary-search" style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>{t("Wort suchen", "Find a word")}</label>
      <input id="dictionary-search" type="search" className="dg-input" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" spellCheck={false} aria-describedby="dictionary-help" placeholder={t("Englisch oder Deutsch", "English or German")} style={{ width: "100%", boxSizing: "border-box" }} />
      <p id="dictionary-help" style={{ fontSize: 14, margin: "8px 0", color: "var(--text-secondary)" }}>{t("Gib mindestens zwei Zeichen ein.", "Enter at least two characters.")}</p>
      <p role="status" aria-live="polite" style={{ fontSize: 14, color: "var(--text-secondary)" }}>{searching ? t(`${matches.length} Treffer`, `${matches.length} results`) : t(`${entries.length} Einträge · alphabetisch`, `${entries.length} entries · alphabetical`)}</p>
      {searching && matches.length === 0 && <p>{t("Kein Wort gefunden. Versuche ein anderes Wort auf Englisch oder Deutsch.", "No word found. Try another word in English or German.")}</p>}
      {searching ? groups.map(({ slug, words }) => (
        <section key={slug} aria-labelledby={`chapter-${slug}`} style={{ marginTop: 24 }}>
          <h2 id={`chapter-${slug}`} style={{ fontSize: 18, marginBottom: 0, color: "var(--ink)" }}>{showGrade && t(`Jahrgang ${words[0]!.grade} · `, `Grade ${words[0]!.grade} · `)}Chapter {words[0]!.chapter}</h2>
          <WordList entries={words} showGrade={showGrade} />
        </section>
      )) : <WordList entries={matches} showGrade={showGrade} />}
    </section>
  );
}
