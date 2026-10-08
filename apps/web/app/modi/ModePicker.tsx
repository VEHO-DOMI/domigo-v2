"use client";
import { useState } from "react";
import Link from "next/link";
import type { Direction, PracticeMode } from "../practice/options";

export default function ModePicker({ grade, preview, chapters, due, story, areas }: {
  grade: number; preview: boolean; chapters: string[]; due: number | null; story: { title: string; href: string } | null; areas: boolean;
}) {
  const [selected, setSelected] = useState(chapters);
  const [mode, setMode] = useState<PracticeMode>(areas ? "grammar" : "full");
  const [direction, setDirection] = useState<Direction>("auto");
  const suffix = preview ? `?jahrgang=${grade}` : "";
  const modes: { mode: PracticeMode; icon: string; title: string; sub: string }[] = [
    { mode: "full", icon: "📚", title: "Full Run", sub: grade === 1 ? "Alle gewählten Wörter, gemischte Aufgaben" : "All selected words, mixed types" },
    { mode: "sprint", icon: "🏃", title: "Sprint", sub: grade === 1 ? "10 zufällige Wörter, kurze Runde" : "10 random words, quick round" },
    { mode: "mc", icon: "🎯", title: "Multiple Choice", sub: grade === 1 ? "Wähle aus 4 Antworten" : "Choose from 4 options" },
    { mode: "grammar", icon: "🧠", title: "Grammar Mode", sub: grade === 1 ? "Grammatik üben" : "Rules & Structures" },
  ];
  const params = new URLSearchParams({ mode, chapters: selected.join(","), direction });
  if (preview) params.set("jahrgang", String(grade));
  return <main className="og-setup">
    <header className="og-setup-header"><Link href={`/home${suffix}`}>← Back</Link><h1>Choose Mode</h1></header>
    <details className="og-chapters"><summary>{selected.length} Chapters · {grade === 1 ? "Chapter auswählen" : "Choose Chapters"}</summary><div>
      {chapters.map((slug) => <label key={slug}><input type="checkbox" checked={selected.includes(slug)} onChange={() => setSelected((old) => old.includes(slug) ? old.filter((s) => s !== slug) : [...old, slug])} />Chapter {Number(slug.slice(-2))}</label>)}
    </div></details>
    <div className="og-mode-list" role="group" aria-label="Übungsmodus">
      {modes.map((entry) => <button type="button" key={entry.mode} className="og-mode" aria-pressed={mode === entry.mode} onClick={() => setMode(entry.mode)}><span className="og-mode-icon">{entry.icon}</span><span><strong>{entry.title}</strong><small>{entry.sub}</small></span></button>)}
      {story && <Link className="og-mode" href={`${story.href}${suffix}`}><span className="og-mode-icon">📖</span><span><strong>Story</strong><small>{story.title}</small></span></Link>}
    </div>
    {mode !== "grammar" && <fieldset className="og-directions"><legend>{grade === 1 ? "Übungsformat" : "Exercise Type"}</legend>
      {([["auto", "🔄 Mix", "Random mix of all types"], ["carrier", "📝 Context", "Fill in the blank"], ["definition", "📖 Definition", "Find the word"], ["deToEn", "🇩🇪 → 🇬🇧", "Deutsch → English"], ["enToDe", "🇬🇧 → 🇩🇪", "English → Deutsch"]] as const)
        .filter(([id]) => mode !== "mc" || id === "definition" || id === "deToEn").map(([id, title, sub]) => <label className="og-direction" key={id}><input type="radio" name="direction" checked={(mode === "mc" && direction !== "deToEn" ? "definition" : direction) === id} onChange={() => setDirection(id)} /><span><strong>{title}</strong><small>{sub}</small></span></label>)}
    </fieldset>}
    <Link className="og-review-chip" href={`/review${suffix}`}>🔄 Smart Review{due === null ? "" : ` (${due})`}</Link>
    <div className="og-setup-footer">{selected.length > 0 ? <Link className="og-primary" href={`/practice?${params.toString()}`}>{grade === 1 ? "Starten" : "Go!"} 🚀</Link> : <p lang="de">Wähle mindestens ein Chapter.</p>}</div>
  </main>;
}
