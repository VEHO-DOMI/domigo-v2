"use client";
/**
 * THE BEAT RENDERER (bible 27 §6.4) — the story-scene overlay, Phaser-FREE.
 *
 * Extracted from PhaserGame.tsx so DOM surfaces (the world map's chapter
 * beats) can import it without dragging Phaser into SSR (P-29b). One scene
 * walker, one inline task pipe (@domigo/task-ui), both worlds: the overworld
 * mounts it over the canvas; the world map stages door/restoration beats
 * through it. Attempt semantics and copy injection are unchanged.
 */
import { useState, type CSSProperties } from "react";
import type { Chapter, GrammarItem, Scene, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { ChoiceContent, DialogueReveal, GlossReveal, LangToggle, primaryLine, useLangMode } from "@domigo/game-feel";
import { storyItemKey, type ResolvedItem } from "@domigo/game-core";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";

export interface GameAttempt {
  clientAttemptId: string;
  itemId: string;
  mode: string;
  input: unknown;
  latencyMs: number | null;
  hintUsed: boolean;
}
export type AttemptFn = (a: GameAttempt) => Promise<{ ok: boolean; queued: boolean; streak?: number }>;

/**
 * Campaign chrome strings — injected by the app (serializable — it crosses
 * the server→client boundary). The G1 zone page passes its exact former
 * hardcoded strings; the G2 school campaign passes its own German-first pack
 * (apps/web/lib/world-copy.ts).
 */
export interface WorldCopy {
  /** Under-canvas move hint, coarse-pointer variant ("Tipp dorthin, …"). */
  moveHintCoarse: string;
  /** Under-canvas move hint, keyboard variant ("Tippen oder Pfeiltasten / WASD"). */
  moveHintFine: string;
  /** "geh zu einem ✦ zum Üben" — joined as `{moveHint} · {encounterHint} · {npcHint}`. */
  encounterHint: string;
  /** "sprich mit Finn" / "sprich mit Frau Berger" (the zone's F NPC). */
  npcHint: string;
  /** The ✦ task-card header ("Ein Wort verblasst — hol es zurück!"). */
  encounterLabel: string;
  /** The after-answer button on a task card ("Weiter →"). */
  continueLabel: string;
  /** The linear-next dialogue button ("Weiter →"). */
  nextLabel: string;
  /** The end-of-dialogue button ("Schließen"). */
  closeLabel: string;
  /** G-A1: the BattleStage's theme — "ink" (school/Blank campaigns) or "book"
   *  (the G1 book world). Campaign-owned like every other chrome decision. */
  stageSkin: "ink" | "book";
  /** G-A1: caption over the recovered word on victory ("Zurückgeholt!"). */
  victoryLabel: string;
  /** W-1: the bump line on an ink-sealed door ("Versiegelt — …"). */
  sealedLabel: string;
}

const card: CSSProperties = {
  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
  // A1-5: a radial vignette (light centre → dark edges) funnels the eye to the card.
  background: "radial-gradient(ellipse 70% 60% at 50% 46%, rgba(15,23,42,0.32) 0%, rgba(15,23,42,0.74) 78%)",
  padding: 16, zIndex: 10,
};
const panel: CSSProperties = {
  background: "var(--card)", borderRadius: 20, padding: "20px 22px", maxWidth: 560, width: "100%",
  maxHeight: "92%", overflowY: "auto", fontFamily: "var(--font-body)", color: "var(--text)",
  border: "1px solid var(--card-border)", boxShadow: "var(--shadow-elevated)",
};

function postAttempt(onAttempt: AttemptFn, mode: string, itemId: string, input: unknown): void {
  void onAttempt({ clientAttemptId: crypto.randomUUID(), itemId, mode, input, latencyMs: null, hintUsed: false });
}

/** Inline task inside dialogue (no extra overlay chrome). */
function TaskCardInline({ item, mode, onAttempt, onDone, continueLabel }: { item: ResolvedItem; mode: string; onAttempt: AttemptFn; onDone: () => void; continueLabel: string }) {
  const [answered, setAnswered] = useState(false);
  const onResult = (_tier: Tier, detail: ResultDetail) => { setAnswered(true); postAttempt(onAttempt, mode, detail.itemId, detail.input); };
  return (
    <>
      {item.kind === "grammar"
        ? <GrammarItemView key={item.item.id} item={item.item as GrammarItem} onResult={onResult} />
        : <VocabItemView key={item.item.id} item={item.item as VocabItem} onResult={onResult} />}
      {answered && <button className="dg-btn" style={{ marginTop: 14 }} onClick={onDone}>{continueLabel}</button>}
    </>
  );
}

export function DialogueOverlay({ grade, mode: attemptMode, copy, chapter, castNames, storyItems, onAttempt, onClose, castArt, beatArt, cinematic }: {
  grade: number; mode: string; copy: WorldCopy; chapter: Chapter; castNames: Record<string, string>; storyItems: Record<string, ResolvedItem>; onAttempt: AttemptFn; onClose: () => void;
  /** doc 28 §6.4: speaker id → portrait URL (only-present stems; missing = name-only). */
  castArt?: Record<string, string>;
  /** scene.image stem → illustration URL. Missing = text-only beat. */
  beatArt?: Record<string, string>;
  /** Prologue mode: full-bleed illustrations, darker veil (doc 28 §3). */
  cinematic?: boolean;
}) {
  // L-1: the story language follows the device toggle (grade 1 defaults German-
  // first — meaning first, English on demand). Chrome strings come from the
  // injected `copy` pack (B-2); the toggle governs the story LINES only.
  const mode = useLangMode(grade);
  const byId = new Map(chapter.scenes.map((s) => [s.id, s]));
  const [sceneId, setSceneId] = useState(chapter.scenes[0]?.id ?? "");
  const [taskDone, setTaskDone] = useState(false);
  const scene: Scene | undefined = byId.get(sceneId);
  if (!scene) { onClose(); return null; }

  const slot = scene.taskSlots[0];
  const slotItem = slot ? storyItems[storyItemKey(slot.itemId, slot.variantKey)] : undefined;
  const taskBlocks = slot !== undefined && slotItem !== undefined && !taskDone;
  // FlagGate resolves to its `else` path here (the authored neutral default —
  // wiped-save doctrine); the flag-aware runtime arrives with the G4 package.
  const rawNext = scene.next;
  const sNext = rawNext !== null && typeof rawNext === "object" && !Array.isArray(rawNext) ? rawNext.else : rawNext;

  const go = (nextId: string | null) => { setTaskDone(false); if (nextId === null) onClose(); else setSceneId(nextId); };

  const illustration = scene.image !== undefined ? beatArt?.[scene.image] : undefined;
  const portrait = castArt?.[scene.speaker];

  return (
    <div style={cinematic ? { ...card, background: "rgba(10,9,18,0.92)" } : card}>
      <div style={cinematic ? { ...panel, maxWidth: 720 } : panel}>
        {illustration !== undefined && (
          // the illustration slot (doc 28 §6.4): full-bleed in cinematic mode
          <img
            src={illustration}
            alt=""
            style={{ width: cinematic ? "calc(100% + 44px)" : "100%", margin: cinematic ? "-20px -22px 12px" : "0 0 10px", borderRadius: cinematic ? "20px 20px 0 0" : 12, display: "block", imageRendering: "pixelated" }}
          />
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {portrait !== undefined && (
              <img src={portrait} alt="" style={{ width: 40, height: 40, borderRadius: 12, imageRendering: "pixelated", border: "1px solid var(--card-border)" }} />
            )}
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-display)" }}>{castNames[scene.speaker] ?? scene.speaker}</div>
          </div>
          <LangToggle grade={grade} />
        </div>
        <p style={{ fontSize: 18, margin: "6px 0 4px", color: "var(--text)" }}>{primaryLine(mode, scene.textEn, scene.scaffoldDe)}</p>
        <DialogueReveal key={`de-${scene.id}`} mode={mode} textEn={scene.textEn} scaffoldDe={scene.scaffoldDe} />
        <GlossReveal key={`gl-${scene.id}`} mode={mode} glosses={scene.glosses} />

        {taskBlocks ? (
          <div style={{ marginTop: 14, borderTop: "1px solid var(--card-border)", paddingTop: 12 }}>
            <TaskCardInline item={slotItem} mode={attemptMode} onAttempt={onAttempt} onDone={() => setTaskDone(true)} continueLabel={copy.continueLabel} />
          </div>
        ) : Array.isArray(sNext) ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {sNext.map((c) => (
              <button key={c.id} className="dg-btn-secondary" style={{ textAlign: "left", justifyContent: "flex-start", display: "block" }} onClick={() => go(c.next)}>
                <ChoiceContent mode={mode} textEn={c.textEn} scaffoldDe={c.scaffoldDe} />
              </button>
            ))}
          </div>
        ) : (
          <button className="dg-btn" style={{ marginTop: 14 }} onClick={() => go(sNext)}>
            {sNext === null ? copy.closeLabel : copy.nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
