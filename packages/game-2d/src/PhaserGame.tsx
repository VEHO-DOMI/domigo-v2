"use client";
/**
 * @domigo/game-2d — the G1 overworld React mount. Phaser renders the world on a
 * canvas; the graded tasks + story dialogue render as a DOM overlay ABOVE it
 * (the one task renderer, @domigo/task-ui), so there is no second grading path.
 * Answers go out through the injected `onAttempt` (the app wires the offline
 * outbox + mode:"game:g1"); the world layer never persists or grades itself.
 */
import Phaser from "phaser";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Chapter, GrammarItem, Scene, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { ChoiceContent, DialogueReveal, GlossReveal, LangToggle, primaryLine, useLangMode } from "@domigo/game-feel";
import type { ResolvedItem } from "@domigo/game-core";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { OverworldScene, type OverworldState, type PadState } from "./OverworldScene.ts";

/** Cosmetic save state persisted by the app (position + cleared node positions). */
export type GameSaveState = OverworldState;

export interface GameAttempt {
  clientAttemptId: string;
  itemId: string;
  mode: string;
  input: unknown;
  latencyMs: number | null;
  hintUsed: boolean;
}
export type AttemptFn = (a: GameAttempt) => Promise<{ ok: boolean; queued: boolean; streak?: number }>;

export interface PhaserGameProps {
  seed: number;
  /** The grade this overworld serves (L-1: drives the story-language default +
   *  the German chrome at grade 1). Defaults to 1 — today's only overworld. */
  grade?: number;
  /** A1-4: stable per-student avatar seed (the app derives it from the userId).
   *  Absent → falls back to the zone seed (the old, identity-bugged behavior). */
  playerSeed?: number;
  /** The map@1 zone id this overworld renders (scopes the save). */
  zoneId: string;
  /** The zone's `render.generator` → its visual theme (palette + layout + props). */
  generator: string;
  /** Wandering-encounter items (game-core resolved due/scope-random). */
  encounters: ResolvedItem[];
  /** The story chapter the Finn NPC plays. */
  chapter: Chapter;
  castNames: Record<string, string>;
  /** itemId → resolved item, for the chapter's taskSlots. */
  storyItems: Record<string, ResolvedItem>;
  onAttempt: AttemptFn;
  /** LOOK-1: real-art stems on disk (stem → URL) from apps/web/lib/tile-art.ts;
   *  the scene preloads these and falls back to procedural paint per kind. */
  tileArt?: Record<string, string>;
  /** Cosmetic resume state (player position + cleared nodes). */
  initialSave?: GameSaveState | null;
  /** Persist cosmetic state (the app debounces localStorage + /api/game-save). */
  onSave?: (s: GameSaveState) => void;
}

type Overlay = { kind: "encounter"; idx: number } | { kind: "dialogue" } | null;

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
/** A1-5: the accented "event" frame for a ✦ encounter card. */
const encounterPanel: CSSProperties = {
  ...panel,
  border: "2px solid var(--accent)",
  boxShadow: "0 0 0 4px var(--accent-soft), var(--shadow-elevated)",
};

function postAttempt(onAttempt: AttemptFn, itemId: string, input: unknown): void {
  void onAttempt({ clientAttemptId: crypto.randomUUID(), itemId, mode: "game:g1", input, latencyMs: null, hintUsed: false });
}

function TaskCard({ item, onAttempt, onDone, label, continueLabel }: { item: ResolvedItem; onAttempt: AttemptFn; onDone: () => void; label: string; continueLabel: string }) {
  const [answered, setAnswered] = useState(false);
  const onResult = (_tier: Tier, detail: ResultDetail) => {
    setAnswered(true);
    postAttempt(onAttempt, detail.itemId, detail.input); // optimistic; server re-grades + queues
  };
  return (
    <div style={encounterPanel} className="dg-encounter-card">
      <div style={{ fontSize: 12, color: "var(--accent)", marginBottom: 8, fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.02em", textTransform: "uppercase" }}>{label}</div>
      {item.kind === "grammar" ? (
        <GrammarItemView key={item.item.id} item={item.item as GrammarItem} onResult={onResult} />
      ) : (
        <VocabItemView key={item.item.id} item={item.item as VocabItem} onResult={onResult} />
      )}
      {answered && <button className="dg-btn" style={{ marginTop: 14 }} onClick={onDone}>{continueLabel}</button>}
    </div>
  );
}

function DialogueOverlay({ grade, chapter, castNames, storyItems, onAttempt, onClose }: {
  grade: number; chapter: Chapter; castNames: Record<string, string>; storyItems: Record<string, ResolvedItem>; onAttempt: AttemptFn; onClose: () => void;
}) {
  // L-1: the story language follows the device toggle (grade 1 defaults German-
  // first — meaning first, English on demand). Chrome is German at grade 1
  // unconditionally; the toggle governs the story LINES only. Tasks untouched.
  const mode = useLangMode(grade);
  const deChrome = grade === 1;
  const byId = new Map(chapter.scenes.map((s) => [s.id, s]));
  const [sceneId, setSceneId] = useState(chapter.scenes[0]?.id ?? "");
  const [taskDone, setTaskDone] = useState(false);
  const scene: Scene | undefined = byId.get(sceneId);
  if (!scene) { onClose(); return null; }

  const slot = scene.taskSlots[0];
  const slotItem = slot ? storyItems[slot.itemId] : undefined;
  const taskBlocks = slot !== undefined && slotItem !== undefined && !taskDone;
  // FlagGate resolves to its `else` path here (the authored neutral default —
  // wiped-save doctrine); the flag-aware runtime arrives with the G4 package.
  const rawNext = scene.next;
  const sNext = rawNext !== null && typeof rawNext === "object" && !Array.isArray(rawNext) ? rawNext.else : rawNext;

  const go = (nextId: string | null) => { setTaskDone(false); if (nextId === null) onClose(); else setSceneId(nextId); };

  return (
    <div style={card}>
      <div style={panel}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-display)" }}>{castNames[scene.speaker] ?? scene.speaker}</div>
          <LangToggle grade={grade} />
        </div>
        <p style={{ fontSize: 18, margin: "6px 0 4px", color: "var(--text)" }}>{primaryLine(mode, scene.textEn, scene.scaffoldDe)}</p>
        <DialogueReveal key={`de-${scene.id}`} mode={mode} textEn={scene.textEn} scaffoldDe={scene.scaffoldDe} />
        <GlossReveal key={`gl-${scene.id}`} mode={mode} glosses={scene.glosses} />

        {taskBlocks ? (
          <div style={{ marginTop: 14, borderTop: "1px solid var(--card-border)", paddingTop: 12 }}>
            <TaskCardInline item={slotItem} onAttempt={onAttempt} onDone={() => setTaskDone(true)} continueLabel={deChrome ? "Weiter →" : "Continue →"} />
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
            {sNext === null ? (deChrome ? "Schließen" : "Close") : deChrome ? "Weiter →" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Floating d-pad for coarse-pointer devices (A1-1) — G1's phones had NO way to
 * move until this. Buttons write into the SHARED PadState the scene reads in
 * its one axis expression, so touch behaves exactly like holding a key.
 * ≥48px targets; press states cover multi-touch, pointer-leave and cancel.
 */
function DPad({ pad }: { pad: PadState }) {
  const [, force] = useState(0);
  const btn = (dir: keyof PadState, label: string, glyph: string, grid: CSSProperties): ReturnType<typeof DPadButton> => (
    <DPadButton pad={pad} dir={dir} label={label} glyph={glyph} style={grid} onChange={() => force((n) => n + 1)} />
  );
  return (
    <div
      aria-label="Move"
      role="group"
      style={{
        position: "absolute", left: 10, bottom: 10, zIndex: 5,
        display: "grid", gridTemplateColumns: "48px 48px 48px", gridTemplateRows: "48px 48px 48px",
        gap: 2, opacity: 0.82, touchAction: "none", userSelect: "none",
      }}
    >
      {btn("up", "Move up", "▲", { gridColumn: 2, gridRow: 1 })}
      {btn("left", "Move left", "◀", { gridColumn: 1, gridRow: 2 })}
      {btn("right", "Move right", "▶", { gridColumn: 3, gridRow: 2 })}
      {btn("down", "Move down", "▼", { gridColumn: 2, gridRow: 3 })}
    </div>
  );
}

function DPadButton({ pad, dir, label, glyph, style, onChange }: {
  pad: PadState; dir: keyof PadState; label: string; glyph: string; style: CSSProperties; onChange: () => void;
}) {
  const set = (v: boolean) => { if (pad[dir] !== v) { pad[dir] = v; onChange(); } };
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pad[dir]}
      onPointerDown={(e) => {
        e.preventDefault();
        set(true);
        // capture so a finger sliding off still delivers pointerup here; best-effort
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic/stale pointer */ }
      }}
      onPointerUp={() => set(false)}
      onPointerCancel={() => set(false)}
      onPointerLeave={() => set(false)}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        ...style, width: 48, height: 48, borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)",
        background: pad[dir] ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.45)",
        color: "#fff", fontSize: 18, lineHeight: 1, cursor: "pointer", touchAction: "none",
      }}
    >
      {glyph}
    </button>
  );
}

/** Inline task inside dialogue (no extra overlay chrome). */
function TaskCardInline({ item, onAttempt, onDone, continueLabel }: { item: ResolvedItem; onAttempt: AttemptFn; onDone: () => void; continueLabel: string }) {
  const [answered, setAnswered] = useState(false);
  const onResult = (_tier: Tier, detail: ResultDetail) => { setAnswered(true); postAttempt(onAttempt, detail.itemId, detail.input); };
  return (
    <>
      {item.kind === "grammar"
        ? <GrammarItemView key={item.item.id} item={item.item as GrammarItem} onResult={onResult} />
        : <VocabItemView key={item.item.id} item={item.item as VocabItem} onResult={onResult} />}
      {answered && <button className="dg-btn" style={{ marginTop: 14 }} onClick={onDone}>{continueLabel}</button>}
    </>
  );
}

export function PhaserGame(props: PhaserGameProps) {
  const grade = props.grade ?? 1;
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<OverworldScene | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);
  // Shared with the scene: the d-pad writes, update() reads (one axis expression).
  const padRef = useRef<PadState>({ up: false, down: false, left: false, right: false });
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    // `?dpad=1` forces the pad on for playtesting (the `?motion=reduce` pattern).
    const forced = new URLSearchParams(window.location.search).has("dpad");
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarse(forced || mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCoarse(forced || e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const { width, height } = OverworldScene.dimensions();
    // A1-3: honor OS reduced-motion for the canvas (the walk cycle won't play);
    // `?motion=reduce` forces it on for playtesting (the `?dpad=1` pattern).
    const reducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(window.location.search).get("motion") === "reduce";
    const scene = new OverworldScene({
      seed: props.seed,
      playerSeed: props.playerSeed,
      zoneId: props.zoneId,
      generator: props.generator,
      tileArt: props.tileArt,
      encounterCount: props.encounters.length,
      onEncounter: (idx) => setOverlay({ kind: "encounter", idx }),
      onNpc: () => setOverlay({ kind: "dialogue" }),
      initial: props.initialSave ?? null,
      onState: (s) => props.onSave?.(s),
      pad: padRef.current,
      reducedMotion,
    });
    sceneRef.current = scene;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: hostRef.current ?? undefined,
      width, height,
      pixelArt: true,
      backgroundColor: "#1e293b",
      fps: { target: 30, min: 20 },
      physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 } } },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene,
    });
    // A1-2 pause-on-blur (Law 9): halt the sim while the tab is backgrounded so a
    // classroom student who tab-switches doesn't return to a drifted world or a
    // stale encounter. Audio is suspended globally by @domigo/game-feel's own
    // visibilitychange hook — not re-done here. Listener owned + cleaned up here.
    const onVisibility = () => scene.setBlurred(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);

    // Non-prod machine-playtest harness: `tap` calls the EXACT pointer code path;
    // `state` is a read-only snapshot. Setters are permanently out of scope —
    // the harness can drive input, never rewrite the world.
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>)["__domigo"] = {
        tap: (wx: number, wy: number) => scene.tapAt(wx, wy),
        state: () => scene.debugState(),
      };
    }
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (process.env.NODE_ENV !== "production") {
        delete (window as unknown as Record<string, unknown>)["__domigo"];
      }
      game.destroy(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeEncounter = (idx: number) => { sceneRef.current?.clearEncounter(idx); sceneRef.current?.resumePlayer(); setOverlay(null); };
  const closeDialogue = () => { sceneRef.current?.resumePlayer(); setOverlay(null); };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ position: "relative" }}>
        <div ref={hostRef} data-testid="game-canvas" style={{ width: "100%", aspectRatio: "15 / 11", background: "#1e293b", borderRadius: 8, overflow: "hidden" }} />
        {coarse && overlay === null && <DPad pad={padRef.current} />}
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 6 }}>
        {grade === 1
          ? `${coarse ? "Tipp dorthin, wo du hinwillst" : "Tippen oder Pfeiltasten / WASD"} · geh zu einem ✦ zum Üben · sprich mit Finn`
          : `${coarse ? "Tap where you want to go" : "Tap or use arrow keys / WASD"} · walk into a ✦ to practise · talk to Finn`}
      </p>

      {overlay?.kind === "encounter" && props.encounters[overlay.idx] && (
        <div style={card} className="dg-encounter-veil">
          <TaskCard
            item={props.encounters[overlay.idx]!}
            onAttempt={props.onAttempt}
            onDone={() => closeEncounter(overlay.idx)}
            label={grade === 1 ? "Ein Wort verblasst — hol es zurück!" : "A word is fading — bring it back!"}
            continueLabel={grade === 1 ? "Weiter →" : "Continue →"}
          />
        </div>
      )}
      {overlay?.kind === "dialogue" && (
        <DialogueOverlay grade={grade} chapter={props.chapter} castNames={props.castNames} storyItems={props.storyItems} onAttempt={props.onAttempt} onClose={closeDialogue} />
      )}
    </div>
  );
}
