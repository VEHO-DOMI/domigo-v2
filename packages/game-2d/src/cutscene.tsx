"use client";
/**
 * THE CUTSCENE PLAYER (doc 29 §2 — refoundation W3b). Full-screen picture-book:
 * ONE hi-res illustration fills the frame, the spoken line sits beneath it,
 * tap/Enter/click advances, stepped fades between shots. ZERO tasks inside
 * (the no-task-in-cutscene law) — taskSlots on a scene are ignored by design.
 * Cutscenes are LINEAR: choice scenes resolve to their else/first branch.
 *
 * Phaser-free (P-29b), like dialogue.tsx. The compact DialogueOverlay card
 * stays for in-level NPC lines; story beats (prologue, chapter door/restore)
 * route through THIS.
 */
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { Chapter, Scene } from "@domigo/content-schema";
import { DialogueReveal, GlossReveal, LangToggle, primaryLine, useLangMode } from "@domigo/game-feel";

const FADE_MS = 260;

/** Follow the linear chain from scenes[0] (FlagGate → else; choices → none). */
function linearScenes(chapter: Chapter): Scene[] {
  const byId = new Map(chapter.scenes.map((s) => [s.id, s]));
  const out: Scene[] = [];
  let cur: Scene | undefined = chapter.scenes[0];
  const guard = new Set<string>();
  while (cur && !guard.has(cur.id)) {
    guard.add(cur.id);
    out.push(cur);
    const raw: Scene["next"] = cur.next;
    const nextId: string | null = raw !== null && typeof raw === "object" && !Array.isArray(raw) ? raw.else : Array.isArray(raw) ? null : raw;
    cur = nextId === null || nextId === undefined ? undefined : byId.get(nextId);
  }
  return out;
}

const frame: CSSProperties = {
  position: "fixed", inset: 0, zIndex: 60, background: "#0a0912", color: "#f3f1ff",
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  fontFamily: "var(--font-body)", cursor: "pointer", userSelect: "none",
};

export function CutscenePlayer({ grade, chapter, castNames, beatArt, canSkip, onClose }: {
  grade: number;
  chapter: Chapter;
  castNames: Record<string, string>;
  /** scene.image stem → illustration URL (class CUTSCENE). Missing = text-only shot. */
  beatArt?: Record<string, string>;
  /** doc 29 §2: skippable after first view (dev preview passes true). */
  canSkip?: boolean;
  onClose: () => void;
}) {
  const mode = useLangMode(grade);
  const scenes = useMemo(() => linearScenes(chapter), [chapter]);
  const [i, setI] = useState(0);
  const [fading, setFading] = useState(false);
  const scene = scenes[i];

  const advance = () => {
    if (fading) return;
    if (i + 1 >= scenes.length) { onClose(); return; }
    setFading(true);
    window.setTimeout(() => { setI((x) => x + 1); setFading(false); }, FADE_MS);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); advance(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, fading, scenes.length]);

  if (!scene) { onClose(); return null; }
  const img = scene.image !== undefined ? beatArt?.[scene.image] : undefined;

  return (
    <div style={frame} onClick={advance} role="button" tabIndex={0} aria-label="Weiter">
      {/* the shot */}
      <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", opacity: fading ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` }}>
        {img !== undefined ? (
          <img src={img} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        ) : (
          // text-only shot: a quiet paper vignette (art lands per-stem; fallback law)
          <div style={{ width: "min(720px, 86vw)", height: "min(46vh, 380px)", borderRadius: 18, background: "radial-gradient(ellipse at 50% 42%, #23203a 0%, #131120 78%)", border: "1px solid #2c2a44" }} />
        )}
      </div>
      {/* the line */}
      <div style={{ width: "min(860px, 94vw)", padding: "14px 18px 22px", opacity: fading ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#8b7cf5", fontFamily: "var(--font-display)" }}>{castNames[scene.speaker] ?? scene.speaker}</div>
          <LangToggle grade={grade} />
        </div>
        <p style={{ fontSize: 20, lineHeight: 1.45, margin: "6px 0 4px" }}>{primaryLine(mode, scene.textEn, scene.scaffoldDe)}</p>
        <DialogueReveal key={`de-${scene.id}`} mode={mode} textEn={scene.textEn} scaffoldDe={scene.scaffoldDe} />
        <GlossReveal key={`gl-${scene.id}`} mode={mode} glosses={scene.glosses} />
        <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center" }}>
          <button type="button" className="dg-btn" onClick={advance}>{i + 1 >= scenes.length ? "Los geht's!" : "Weiter →"}</button>
          {canSkip === true && (
            <button type="button" className="dg-btn-secondary" onClick={onClose}>Überspringen</button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#6f6a8e" }}>{i + 1} / {scenes.length}</span>
        </div>
      </div>
    </div>
  );
}
