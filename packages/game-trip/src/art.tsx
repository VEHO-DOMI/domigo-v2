"use client";
/**
 * @domigo/game-trip — procedural SVG fallback art for "Lost for Words".
 * Deterministic (seed = a hash of the character key, never Math.random — Law 9).
 * Real art arrives via the art manifest later; these inline avatars render where
 * an image isn't on disk yet, with look-locks so the Leicester cast reads at a
 * glance (Niko = the ring on a cord; Callum = the cap; Nan = silver hair;
 * Frau Maier + Ms Blake = glasses; You = seen-from-behind grey hoodie, the
 * corpus-wide player convention).
 */
import { useId } from "react";

function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

interface Look {
  skin: string;
  hair: string;
  shirt: string;
  acc: "glasses" | "cap" | "ring" | "silver" | "back" | "none";
}
const SKIN = ["#ffdbac", "#f1c27d", "#e0ac69", "#c68642", "#a06a3f"] as const;
const HAIR = ["#2c1b18", "#171717", "#6b4226", "#d6b370", "#8a8a8a"] as const;
const SHIRT = ["#2563eb", "#0ea5e9", "#16a34a", "#9333ea", "#0891b2"] as const;

/** Look-locks for the Leicester cast; anyone else gets a deterministic generic look. */
const CAST: Record<string, Look> = {
  you: { skin: "#e0ac69", hair: "#3b3b3b", shirt: "#64748b", acc: "back" },
  niko: { skin: "#f1c27d", hair: "#2c1b18", shirt: "#dc2626", acc: "ring" }, // the ring on a cord
  sue: { skin: "#ffdbac", hair: "#6b4226", shirt: "#d97706", acc: "none" }, // the host mum — warm amber
  dev: { skin: "#c68642", hair: "#171717", shirt: "#0f766e", acc: "glasses" }, // runs the auction house
  callum: { skin: "#f1c27d", hair: "#d6b370", shirt: "#9333ea", acc: "cap" }, // the host brother, camera kid
  nan: { skin: "#ffdbac", hair: "#e5e7eb", shirt: "#7c3aed", acc: "silver" }, // Irish, biscuit tin, sharp
  katie: { skin: "#e0ac69", hair: "#6b4226", shirt: "#0ea5e9", acc: "none" },
  lewis: { skin: "#f1c27d", hair: "#d6b370", shirt: "#ea580c", acc: "none" }, // careless, not cruel
  ash: { skin: "#a06a3f", hair: "#171717", shirt: "#16a34a", acc: "none" },
  "frau-maier": { skin: "#ffdbac", hair: "#8a8a8a", shirt: "#0891b2", acc: "glasses" }, // the Austrian teacher
  "ms-blake": { skin: "#c68642", hair: "#2c1b18", shirt: "#1e3a8a", acc: "glasses" }, // the programme leader
  amy: { skin: "#ffdbac", hair: "#d6b370", shirt: "#db2777", acc: "none" },
};

export function castLook(charKey: string): Look {
  const locked = CAST[charKey];
  if (locked) return locked;
  const h = hashStr(charKey);
  return { skin: SKIN[h % SKIN.length]!, hair: HAIR[(h >> 3) % HAIR.length]!, shirt: SHIRT[(h >> 6) % SHIRT.length]!, acc: "none" };
}

/** A small procedural avatar with the character's signature feature. */
export function CastAvatar({ charKey, name, size = 46 }: { charKey: string; name: string; size?: number }) {
  const clip = useId();
  const { skin, hair, shirt, acc } = castLook(charKey);
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={name} style={{ flex: "0 0 auto", display: "block" }}>
      <defs><clipPath id={clip}><circle cx="24" cy="24" r="23" /></clipPath></defs>
      <circle cx="24" cy="24" r="23" fill="#fff" stroke={shirt} strokeWidth="2" />
      <g clipPath={`url(#${clip})`}>
        <rect x="0" y="0" width="48" height="48" fill="#f1f5f9" />
        <circle cx="24" cy="49" r="17" fill={shirt} />
        {acc === "back" ? (
          // seen from behind: hood + hair, no face
          <>
            <circle cx="24" cy="22" r="12" fill={hair} />
            <path d="M9 30 Q9 16 24 16 Q39 16 39 30 L39 40 L9 40 Z" fill={shirt} />
          </>
        ) : (
          <>
            <circle cx="24" cy="22" r="12" fill={skin} />
            <path d="M11 23 Q11 8 24 8 Q37 8 37 23 L37 27 Q33 15 24 15 Q15 15 11 27 Z" fill={hair} />
            {acc === "silver" && <path d="M11 23 Q11 8 24 8 Q37 8 37 23 L37 27 Q33 15 24 15 Q15 15 11 27 Z" fill="#e5e7eb" />}
            <circle cx="20" cy="22" r="1.7" fill="#1f2937" />
            <circle cx="28" cy="22" r="1.7" fill="#1f2937" />
            <path d="M21 27 Q24 29.5 27 27" stroke="#7f5539" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            {acc === "glasses" && <><circle cx="20" cy="22" r="3.2" fill="none" stroke="#1f2937" strokeWidth="1.1" /><circle cx="28" cy="22" r="3.2" fill="none" stroke="#1f2937" strokeWidth="1.1" /><path d="M23.2 22 H24.8" stroke="#1f2937" strokeWidth="1.1" /></>}
            {acc === "cap" && <path d="M10 18 Q10 7 24 7 Q38 7 38 18 L40 20 L30 21 Q27 13 24 13 Q13 13 10 20 Z" fill="#7e22ce" />}
            {acc === "ring" && <circle cx="24" cy="36" r="2.6" fill="none" stroke="#eab308" strokeWidth="1.6" />}
          </>
        )}
      </g>
    </svg>
  );
}
