"use client";
import { useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";

type Theme = "system" | "light" | "dark";
let currentTheme: Theme = "system";
const themeListeners = new Set<() => void>();
const subscribe = (listener: () => void) => { themeListeners.add(listener); return () => { themeListeners.delete(listener); }; };
const getTheme = () => currentTheme;
const serverTheme = (): Theme => "system";

export function trainerHref(path: string, grade: number, preview: boolean): string {
  return preview ? `${path}${path.includes("?") ? "&" : "?"}jahrgang=${grade}` : path;
}

export default function TrainerShell({ grade, preview, children, screen = "home", wordmark = true }: {
  grade: number; preview: boolean; children: ReactNode; screen?: string; wordmark?: boolean;
}) {
  const theme = useSyncExternalStore(subscribe, getTheme, serverTheme);
  const label = ["", "1st", "2nd", "3rd", "4th"][grade];
  function toggleTheme() {
    const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    currentTheme = dark ? "light" : "dark";
    themeListeners.forEach((listener) => listener());
  }
  return <div className="og-root" data-grade={grade} data-theme={theme} data-screen={screen}>
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
    {children}
    <footer className="og-footer">
      <button type="button" onClick={toggleTheme} aria-label="Hell oder dunkel umschalten">◐ {theme === "dark" ? "Dark" : theme === "light" ? "Light" : "Light / Dark"}</button>
      <Link href="/datenschutz">Datenschutz</Link>
    </footer>
  </div>;
}
