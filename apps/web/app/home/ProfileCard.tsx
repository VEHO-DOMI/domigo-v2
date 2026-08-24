/**
 * K7a · DIE PROFIL-KARTE — was ein Kind seit Juli sammelt, endlich sichtbar.
 *
 * Server-Komponente ohne jede Interaktivität: sie bekommt fertige Zahlen und
 * rechnet mit lib/levels.ts, sie liest selbst NICHTS aus der Datenbank. Das ist
 * Absicht — so kann sie den Degradations-Vertrag von /home nicht brechen: dort
 * fängt ein try/catch jeden Lesefehler ab, und ohne Daten wird die Karte
 * einfach nicht gerendert. Die Landeseite darf nie ein 500 werfen.
 *
 * Die Komposition folgt der Design-Studie :503-518 (Pill → Vibe-Zeile →
 * XP-Balken → Gesamt-Balken → Stats-Zeile), reduziert auf das, was diese Bahn
 * liefert: Avatar, Badge-Reihe und der Klassen-Balken gehören zu K7b.
 *
 * Zu den Farben: die Balken-FÜLLUNG trägt die Pill-Klassen aus globals.css.
 * Dadurch lesen Pill und Balken dieselbe Zonen-Farbe aus derselben Zeile —
 * statt eines zweiten Satzes Hexwerte, der beim nächsten Design-Dreh
 * auseinanderläuft. globals.css selbst bleibt unangetastet.
 */
import type { CSSProperties } from "react";
import {
  type Register,
  barFraction,
  formatXp,
  grammarTitle,
  levelFor,
  overallLevelFor,
  prestigeStars,
  vocabTitle,
} from "@/lib/levels";

/** Die Teal-Rampe der Gesamt-Leiter, Studie :513 — die einzige eigene Farbe hier. */
const OVERALL_GRADIENT = "linear-gradient(90deg, #0d9488, #14b8a6)";

const SECTION_LABEL: CSSProperties = {
  fontSize: "0.68rem",
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  fontWeight: 700,
  fontFamily: "var(--font-label)",
  color: "var(--text-secondary)",
};

const BAR_LABEL: CSSProperties = {
  fontSize: 11.5,
  fontFamily: "var(--font-label)",
  color: "var(--text-secondary)",
  whiteSpace: "nowrap",
};

const VIBE: CSSProperties = {
  fontStyle: "italic",
  fontSize: "0.72rem",
  color: "var(--muted)",
};

/** Ein Topf: Überschrift, Level-Pill, Vibe-Zeile, Balken zur nächsten Stufe. */
function Pool({
  label,
  xp,
  title,
}: {
  label: string;
  xp: number;
  title: (level: number, prestige: number) => { name: string; vibe: string };
}) {
  const state = levelFor(xp);
  const { name, vibe } = title(state.level, state.prestige);
  const stars = prestigeStars(state.prestige);
  const fill = `${Math.round(barFraction(state.xpIntoLevel, state.xpToNext) * 100)}%`;

  // Unter Prestige zählt die Leiter, darüber der Rang: die Enden des Balkens
  // müssen benennen, wovon wohin es geht — sonst steht die Zahl in der Mitte
  // ohne Ziel da.
  const fromLabel = state.prestige > 0 ? stars : `Lv ${state.level}`;
  const toLabel = state.prestige > 0 ? prestigeStars(state.prestige + 1) : `Lv ${state.level + 1}`;

  return (
    <div>
      <div style={SECTION_LABEL}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
        <span className={`lvl-pill lvl-pill--bold zone-${state.zone}`}>
          {stars !== "" && <span aria-hidden="true">{stars}</span>}
          Lv {state.level} · {name}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-deep)", fontFamily: "var(--font-label)" }}>
          {formatXp(xp)} XP
        </span>
      </div>
      <p style={{ ...VIBE, margin: "5px 0 8px" }}>{vibe}</p>
      <div className="xp-track">
        <div className={`lvl-pill--bold zone-${state.zone}`} style={{ height: "100%", width: fill, borderRadius: 5 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 5 }}>
        {state.xpToNext === null ? (
          <span style={{ ...BAR_LABEL, color: "var(--accent-deep)", fontWeight: 700 }}>✨ Max level!</span>
        ) : (
          <>
            <span style={BAR_LABEL}>{fromLabel}</span>
            <span style={{ ...BAR_LABEL, fontWeight: 700, color: "var(--text)" }}>
              {formatXp(state.xpToNext)} XP to next
            </span>
            <span style={BAR_LABEL}>{toLabel}</span>
          </>
        )}
      </div>
    </div>
  );
}

export interface ProfileCardProps {
  /** Der Vokabel-Topf, `user_progress.xp`. */
  xp: number;
  /** Der Grammatik-Topf, `user_progress.grammar_xp` — bewusst getrennt geführt. */
  grammarXp: number;
  /** Tage in Folge, oder `null`, wenn gerade keine Serie läuft. */
  streak: number | null;
  /** Sanfte Leiter (1. Klasse) oder Gamer-Leiter (2.–4.). */
  register: Register;
}

export default function ProfileCard({ xp, grammarXp, streak, register }: ProfileCardProps) {
  const overall = overallLevelFor(xp + grammarXp);
  const overallFill = `${Math.round(barFraction(overall.xpIntoLevel, overall.xpToNext) * 100)}%`;

  return (
    <section
      className="dg-card card-accent-top"
      style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 16 }}
    >
      <Pool label="Vocabulary" xp={xp} title={(level, prestige) => vocabTitle(level, prestige, register)} />
      <Pool label="Grammar" xp={grammarXp} title={(level, prestige) => grammarTitle(level, prestige, register)} />

      <div>
        <div style={SECTION_LABEL}>Overall</div>
        <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--ink)", margin: "6px 0 0" }}>
          🌍 Lv {overall.level} · {overall.name}
        </div>
        <p style={{ ...VIBE, margin: "4px 0 8px" }}>{overall.vibe}</p>
        <div className="xp-track">
          <div style={{ height: "100%", width: overallFill, borderRadius: 5, background: OVERALL_GRADIENT }} />
        </div>
        <div style={{ marginTop: 5 }}>
          {overall.xpToNext === null ? (
            <span style={{ ...BAR_LABEL, color: "var(--accent-deep)", fontWeight: 700 }}>✨ Max level!</span>
          ) : (
            <span style={BAR_LABEL}>
              <strong style={{ color: "var(--text)" }}>{formatXp(overall.xpToNext)} XP</strong> to Lv {overall.level + 1}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", borderTop: "1px solid var(--rule)", paddingTop: 12 }}>
        <span style={BAR_LABEL}>
          <strong style={{ color: "var(--text)", fontSize: 13 }}>{formatXp(xp + grammarXp)}</strong> XP total
        </span>
        {streak !== null && (
          <span style={BAR_LABEL}>
            <strong style={{ color: "#c2410c", fontSize: 13 }}>🔥 {streak}</strong>-day streak
          </span>
        )}
      </div>
    </section>
  );
}
