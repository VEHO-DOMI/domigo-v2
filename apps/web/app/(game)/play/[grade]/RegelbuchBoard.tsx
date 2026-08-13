"use client";
/**
 * RegelbuchBoard — DAS REGELBUCH on the hub (doc 45 E3).
 *
 * The rule pages the child has put back into the book, readable outside a run.
 * Client-side because the library lives in `localStorage` for now (see
 * lib/regelbuch.ts for why that is a declared step and not an oversight), and
 * because a server component cannot read it.
 *
 * NAMING CARE: this hub already calls the CHAPTERS „Seiten" — the ZoneBoard
 * beside this one says „Die verlorenen Seiten" and „X / Y Seiten zurückgeholt".
 * Both are true and they are not the same thing: a chapter is a story page of
 * the book, a Regel-Seite is a grammar page torn out of it. The copy here says
 * „Regel-Seiten" every time, never a bare „Seiten", so the two boards can sit
 * on one screen without teaching a child that they are one collection.
 */
import { useSyncExternalStore } from "react";
import {
  regelbuchServerSnapshot,
  regelbuchSnapshot,
  subscribeRegelbuch,
  type RegelbuchEntry,
} from "@/lib/regelbuch";

const CHAPTER_NAMES: Record<string, string> = {
  ch01: "Kapitel 1 — Zeit für die Schule",
};

export default function RegelbuchBoard(): React.ReactElement | null {
  // localStorage read through React's own external-store API: the server (and
  // the first paint) sees an empty book, the client swaps in the real one, and
  // the snapshot is reference-stable so this cannot loop.
  const entries: RegelbuchEntry[] = useSyncExternalStore(
    subscribeRegelbuch,
    regelbuchSnapshot,
    regelbuchServerSnapshot,
  );

  if (entries.length === 0) return null;

  const byChapter = new Map<string, RegelbuchEntry[]>();
  for (const e of entries) byChapter.set(e.chapter, [...(byChapter.get(e.chapter) ?? []), e]);

  return (
    <section style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", margin: "0 0 4px" }}>
        📜 Dein Regelbuch
      </h2>
      <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 12px" }}>
        {entries.length === 1
          ? "Eine Regel-Seite hast du zurückgeholt — hier kannst du sie immer nachlesen."
          : `${entries.length} Regel-Seiten hast du zurückgeholt — hier kannst du sie immer nachlesen.`}
      </p>
      {[...byChapter.entries()].map(([chapter, list]) => (
        <div key={chapter} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a8926a", margin: "0 0 6px" }}>
            {CHAPTER_NAMES[chapter] ?? chapter}
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {list.map((e) => (
              <div
                key={`${chapter}-${e.topicDe}`}
                style={{
                  background: "linear-gradient(135deg, #fffdf4, #f6ecd4)",
                  border: "2px solid #d9bd86",
                  borderRadius: "13px 9px 14px 10px / 10px 14px 9px 13px",
                  padding: "10px 13px",
                }}
              >
                <div style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a8926a", marginBottom: 3 }}>
                  {e.topicDe}
                </div>
                <div style={{ fontSize: 14.5, color: "#4a4030", lineHeight: 1.45 }}>{e.merksatzDe}</div>
                <div style={{ fontSize: 17, fontWeight: 800, fontFamily: "var(--font-display)", color: "#a8541a", marginTop: 4 }}>
                  {e.beispielEn}
                </div>
                <div style={{ fontSize: 12, fontStyle: "italic", color: "#8a7a58", marginTop: 2 }}>{e.belegDe}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
