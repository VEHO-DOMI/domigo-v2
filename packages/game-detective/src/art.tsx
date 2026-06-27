"use client";
/**
 * @domigo/game-detective — procedural SVG art (the GO-NO-GO first pass).
 * All-procedural + deterministic (seed = a hash of the character/clue key, never
 * Math.random — Law 9), so the same character renders identically everywhere and
 * no external art packs ship. Inline SVG (not the art-gen raster pipeline, which
 * targets Phaser textures). Deliberately simple + restyle-friendly: palettes and
 * shapes live here so Koki's art direction is a one-file change.
 */
import { useId, type CSSProperties } from "react";

/** FNV-1a → uint32 seed. */
function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
/** mulberry32 — same deterministic PRNG as @domigo/art-gen. */
function rngFrom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pick<T>(r: () => number, xs: readonly T[]): T {
  return xs[Math.floor(r() * xs.length)]!;
}

const SKIN = ["#ffdbac", "#f1c27d", "#e0ac69", "#c68642", "#a06a3f", "#8d5524"] as const;
const HAIR = ["#2c1b18", "#4a2f1b", "#6b4226", "#171717", "#b55239", "#d6b370", "#8a8a8a", "#3b3b6d"] as const;
const SHIRT = ["#2563eb", "#0ea5e9", "#16a34a", "#db2777", "#9333ea", "#ea580c", "#0891b2", "#ca8a04"] as const;

/** Deterministic palette for a character key — shared by the chip + name tint. */
export function characterPalette(charKey: string): { skin: string; hair: string; shirt: string } {
  const r = rngFrom(hashStr(charKey));
  return { skin: pick(r, SKIN), hair: pick(r, HAIR), shirt: pick(r, SHIRT) };
}

/** A small procedural portrait — head, hair (3 styles), shoulders, simple face. */
export function CharacterChip({ charKey, name, size = 44 }: { charKey: string; name: string; size?: number }) {
  const clip = useId();
  const r = rngFrom(hashStr(charKey));
  const skin = pick(r, SKIN);
  const hair = pick(r, HAIR);
  const shirt = pick(r, SHIRT);
  const hairStyle = Math.floor(r() * 3);
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={name} style={{ flex: "0 0 auto", display: "block" }}>
      <defs>
        <clipPath id={clip}><circle cx="24" cy="24" r="23" /></clipPath>
      </defs>
      <circle cx="24" cy="24" r="23" fill="#fff" stroke={shirt} strokeWidth="2" />
      <g clipPath={`url(#${clip})`}>
        <rect x="0" y="0" width="48" height="48" fill="#f1f5f9" />
        <circle cx="24" cy="49" r="17" fill={shirt} />
        <circle cx="24" cy="22" r="12" fill={skin} />
        {hairStyle === 0 && <path d="M12 20 Q14 9 24 9 Q34 9 36 20 Q30 14 24 14 Q18 14 12 20 Z" fill={hair} />}
        {hairStyle === 1 && <path d="M11 23 Q11 8 24 8 Q37 8 37 23 L37 28 Q34 16 24 16 Q14 16 11 28 Z" fill={hair} />}
        {hairStyle === 2 && <path d="M14 16 Q18 10 24 10 Q30 10 34 16 Q30 13 24 13 Q18 13 14 16 Z" fill={hair} />}
        <circle cx="20" cy="22" r="1.6" fill="#1f2937" />
        <circle cx="28" cy="22" r="1.6" fill="#1f2937" />
        <path d="M21 27 Q24 29.5 27 27" stroke="#7f5539" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const cork: CSSProperties = {
  background:
    "radial-gradient(circle at 30% 30%, rgba(255,255,255,.35) 0 1px, transparent 1px) 0 0/13px 13px, #d8b888",
  border: "1px solid #b8945e",
  borderRadius: 12,
  padding: 14,
  minHeight: 150,
  boxShadow: "inset 0 1px 6px rgba(80,50,10,.25)",
};
const pinned: CSSProperties = {
  position: "relative",
  background: "#fffef7",
  border: "1px solid #e7d9a8",
  borderRadius: 4,
  padding: "10px 12px 9px",
  fontSize: 13,
  color: "#3f3a26",
  marginBottom: 12,
  boxShadow: "0 2px 5px rgba(60,40,10,.3)",
};

function Pin() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ position: "absolute", top: -6, left: "50%", marginLeft: -7 }}>
      <circle cx="7" cy="6" r="4.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
      <circle cx="5.5" cy="4.5" r="1.3" fill="#fca5a5" />
    </svg>
  );
}

/** The case-file corkboard — solved clues as pinned notes (slight deterministic tilt). */
export function EvidenceBoard({ clues, label, images }: { clues: { key: string; text: string }[]; label: string; images?: Record<string, string> }) {
  return (
    <div style={cork}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#4a3613", marginBottom: 12, textShadow: "0 1px 0 rgba(255,255,255,.3)" }}>
        🔍 {label}
      </div>
      {clues.length === 0 ? (
        <p style={{ fontSize: 12, color: "#6b5527", margin: 0 }}>No clues yet. Solve clues to pin them here.</p>
      ) : (
        clues.map((c, i) => {
          const tilt = (hashStr(c.key) % 5) - 2; // -2..2 deg
          const img = images?.[c.key];
          return (
            <div key={c.key} style={{ ...pinned, transform: `rotate(${tilt}deg)`, marginTop: i === 0 ? 4 : undefined, display: "flex", alignItems: "center", gap: 8 }}>
              <Pin />
              {img && <img src={img} alt="" width={40} height={40} style={{ borderRadius: 4, objectFit: "cover", flex: "0 0 auto", border: "1px solid #e7d9a8" }} />}
              <span><span style={{ color: "#15803d", fontWeight: 700 }}>✓</span> {c.text}</span>
            </div>
          );
        })
      )}
    </div>
  );
}
