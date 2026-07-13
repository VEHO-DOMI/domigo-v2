"use client";
/**
 * The "Lost Pages" board on the g1 hub — the book's restoration log + the
 * cumulative reward surface (the G1 analog of the g2 Evidence Board / g3 Season
 * Board). A zone's page is "restored" once every one of its chapter's taskSlot
 * items has been solved (tier <> 'wrong'), derived from the authoritative
 * attempts ledger upstream — never the wipeable cosmetic save (Law 2). Brand-
 * styled (g1 green via the grade-indexed CSS vars). No Phaser — this is a plain
 * presentational component imported via the Phaser-free "@domigo/game-2d/board"
 * entry so it never bloats the hub chunk. Server passes the derived progress.
 */
import type { CSSProperties } from "react";

export interface ZoneProgress {
  zoneId: string;
  /** the unit number (= the page number in the book) */
  pageNo: number;
  titleEn: string;
  /** L-1: the German zone title (leads at grade 1). */
  titleDe?: string | null;
  /** every taskSlot item in the zone's chapter is solved */
  restored: boolean;
  /** the zone's chapter is released (unlocked) */
  unlocked: boolean;
}

const card: CSSProperties = {
  background: "var(--card)",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "var(--card-border)",
  borderRadius: 20,
  padding: "16px 18px",
  boxShadow: "var(--shadow-card)",
};

/** B-2: every campaign string on the board arrives via props (serializable —
 *  the server page passes them). G1's hub passes its exact former "Lost Pages"
 *  strings, so its rendered output is byte-identical to the pre-B-2 board. */
export interface ZoneBoardCopy {
  /** The per-zone unit noun rendered before the number ("Seite" / "Page"). */
  noun: string;
  /** The header progress line, already counted by the server ("3 / 15 Seiten zurückgeholt"). */
  countLabel: string;
  /** The all-done celebration line (rendered with the 📖 mark). */
  completeLabel: string;
}

export function ZoneBoard({ zones, label, copy }: { zones: ZoneProgress[]; label: string; copy: ZoneBoardCopy }) {
  const done = zones.filter((z) => z.restored).length;
  const complete = done === zones.length && zones.length > 0;
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-label)", letterSpacing: "0.03em" }}>📖 {label}</span>
        <span style={{ fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap", fontWeight: 600 }}>{copy.countLabel}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(138px, 1fr))", gap: 10 }}>
        {zones.map((z) => (
          <div
            key={z.zoneId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "9px 12px",
              borderRadius: 12,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: z.restored ? "var(--accent)" : "var(--card-border)",
              background: z.restored ? "var(--accent-soft)" : "var(--bg-sunken)",
              opacity: z.unlocked ? 1 : 0.5,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 15, lineHeight: 1 }}>{z.restored ? "✅" : z.unlocked ? "○" : "🔒"}</span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 10, fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: z.restored ? "var(--accent-deep)" : "var(--muted)" }}>{copy.noun} {z.pageNo}</span>
              <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: z.restored ? "var(--ink)" : "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{z.titleDe ?? z.titleEn}</span>
            </span>
          </div>
        ))}
      </div>
      {complete && (
        <p style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "var(--accent-deep)" }}>
          📖 {copy.completeLabel}
        </p>
      )}
    </div>
  );
}
