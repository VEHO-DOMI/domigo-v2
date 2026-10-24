"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { chooseTrainerLanguage, chooseTrainerTheme, useTrainerLanguage, useTrainerTheme } from "@/lib/trainer/preferences";

export function trainerHref(path: string, grade: number, preview: boolean): string {
  return preview ? `${path}${path.includes("?") ? "&" : "?"}jahrgang=${grade}` : path;
}

export default function TrainerShell({ grade, preview, children, screen = "home", wordmark = true }: {
  grade: number; preview: boolean; children: ReactNode; screen?: string; wordmark?: boolean;
}) {
  const theme = useTrainerTheme(grade), language = useTrainerLanguage(grade);
  const label = ["", "1st", "2nd", "3rd", "4th"][grade];
  function toggleTheme() { chooseTrainerTheme(grade, theme === "dark" ? "light" : "dark"); }
  return <div className="og-root" data-grade={grade} data-theme={theme} data-screen={screen} lang={language}>
    {preview && <aside className="og-preview" lang="de">
      <span>Vorschau — nichts gespeichert</span>
      <nav aria-label="Jahrgang">{[1, 2, 3, 4].map((g) => <Link key={g} aria-current={g === grade ? "page" : undefined} href={`/${screen === "areas" ? "modi" : screen}?jahrgang=${g}`}>{g}</Link>)}</nav>
    </aside>}
    {wordmark && <header className="og-brand">
      <div className="og-brand-glow" aria-hidden="true" />
      <Link className="og-wordmark" href={trainerHref("/home", grade, preview)}>DomiGo</Link>
      <p className="og-tagline">English · Vocabulary &amp; Grammar</p>
      <p className="og-grade">{label} Grade</p>
    </header>}
    {grade === 1 && <nav className="og-language" aria-label="Sprache / Language">
      <button type="button" lang="de" aria-pressed={language === "de"} onClick={() => chooseTrainerLanguage("de")}>Deutsch</button>
      <button type="button" lang="en" aria-pressed={language === "en"} onClick={() => chooseTrainerLanguage("en")}>English</button>
    </nav>}
    {children}
    <footer className="og-footer">
      <button type="button" onClick={toggleTheme} aria-label={language === "de" ? "Hell oder dunkel umschalten" : "Switch light or dark appearance"}>◐ {theme === "dark" ? language === "de" ? "Dunkel" : "Dark" : language === "de" ? "Hell" : "Light"}</button>
      <Link href="/datenschutz">Datenschutz</Link>
    </footer>
  </div>;
}
