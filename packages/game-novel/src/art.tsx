"use client";
/**
 * @domigo/game-novel — procedural SVG fallback art for the FOURTEEN graphic novel.
 * Deterministic (seed = a hash of the character key, never Math.random — Law 9).
 * Real ligne-claire panels arrive via the art manifest (art.json → resolveNovelArt);
 * these inline avatars only render where an image isn't on disk yet, so the cast
 * stays recognisable from day one. The look-locks mirror the FOURTEEN image bible
 * (Ben = sandy hair + orange vest; Leah = glasses; Leo = headphones; Sara = silver
 * streak; You = seen-from-behind grey hoodie) so silhouettes read at a glance.
 */
import { useId, type CSSProperties } from "react";
import type { Comment } from "./novel-copy.ts";

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
  acc: "glasses" | "headphones" | "spiky" | "streak" | "back" | "none";
}
const SKIN = ["#ffdbac", "#f1c27d", "#e0ac69", "#c68642", "#a06a3f"] as const;
const HAIR = ["#2c1b18", "#171717", "#6b4226", "#d6b370", "#8a8a8a"] as const;
const SHIRT = ["#2563eb", "#0ea5e9", "#16a34a", "#9333ea", "#0891b2"] as const;

/** Look-locks for the FOURTEEN cast; anyone else gets a deterministic generic look. */
const CAST: Record<string, Look> = {
  ben: { skin: "#f1c27d", hair: "#d6b370", shirt: "#ea580c", acc: "spiky" }, // sandy hair + orange vest
  leah: { skin: "#e0ac69", hair: "#171717", shirt: "#1e3a8a", acc: "glasses" }, // bun + round glasses + denim
  leo: { skin: "#f1c27d", hair: "#171717", shirt: "#27272a", acc: "headphones" }, // headphones + black hoodie
  sara: { skin: "#c68642", hair: "#3f3f46", shirt: "#52525b", acc: "streak" }, // monochrome + silver streak
  you: { skin: "#e0ac69", hair: "#3b3b3b", shirt: "#64748b", acc: "back" }, // grey hoodie, seen from behind
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
            {acc === "spiky"
              ? <path d="M11 19 L14 9 L18 16 L21 7 L25 16 L29 8 L33 17 L37 11 L37 21 Q30 14 24 14 Q17 14 11 21 Z" fill={hair} />
              : <path d="M11 23 Q11 8 24 8 Q37 8 37 23 L37 27 Q33 15 24 15 Q15 15 11 27 Z" fill={hair} />}
            {acc === "streak" && <path d="M14 12 Q15 20 14 26" stroke="#e5e7eb" strokeWidth="2.5" fill="none" strokeLinecap="round" />}
            <circle cx="20" cy="22" r="1.7" fill="#1f2937" />
            <circle cx="28" cy="22" r="1.7" fill="#1f2937" />
            <path d="M21 27 Q24 29.5 27 27" stroke="#7f5539" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            {acc === "spiky" && <><circle cx="18" cy="26" r="0.7" fill="#b45309" /><circle cx="30" cy="26" r="0.7" fill="#b45309" /></>}
            {acc === "glasses" && <><circle cx="20" cy="22" r="3.2" fill="none" stroke="#1f2937" strokeWidth="1.1" /><circle cx="28" cy="22" r="3.2" fill="none" stroke="#1f2937" strokeWidth="1.1" /><path d="M23.2 22 H24.8" stroke="#1f2937" strokeWidth="1.1" /></>}
            {acc === "headphones" && <><path d="M11 23 Q11 11 24 11 Q37 11 37 23" stroke="#18181b" strokeWidth="2.2" fill="none" /><rect x="9.5" y="21" width="4" height="8" rx="2" fill="#18181b" /><rect x="34.5" y="21" width="4" height="8" rx="2" fill="#18181b" /></>}
          </>
        )}
      </g>
    </svg>
  );
}

const toneStyle: Record<Comment["tone"], CSSProperties> = {
  kind: { borderLeft: "3px solid #16a34a" },
  tease: { borderLeft: "3px solid #f59e0b" },
  cruel: { borderLeft: "3px solid #dc2626" },
};

/**
 * The comment section under the freshly-uploaded video — the consequence beat.
 * `line` frames how the player's accuracy treated Ben; `comments` are toned by it.
 */
export function CommentSection({ comments, line, label }: { comments: Comment[]; line: string; label: string }) {
  return (
    <div style={{ background: "#0f172a", borderRadius: 14, padding: "14px 16px", marginTop: 12 }}>
      <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>💬 {label}</div>
      <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 12px" }}>{line}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {comments.map((c, i) => (
          <div key={`${c.author}-${i}`} style={{ background: "#1e293b", borderRadius: 8, padding: "8px 11px", ...toneStyle[c.tone] }}>
            <div style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 600 }}>@{c.author}</div>
            <div style={{ color: "#f1f5f9", fontSize: 14 }}>{c.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
