"use client";
/**
 * @domigo/game-2d — the overworld React mount (campaign-agnostic since B-2).
 * Phaser renders the world on a canvas; the graded tasks + story dialogue render
 * as a DOM overlay ABOVE it (the one task renderer, @domigo/task-ui), so there
 * is no second grading path. Answers go out through the injected `onAttempt`
 * with the injected `mode` (the app wires the offline outbox + "game:gN");
 * all world-chrome strings arrive via `copy` (B-2: the engine carries no
 * campaign copy of its own — G1 passes its exact former strings, byte-identical).
 * The world layer never persists or grades itself.
 */
import Phaser from "phaser";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { Chapter, GrammarItem, Scene, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { ChoiceContent, DialogueReveal, feel, GlossReveal, LangToggle, primaryLine, useLangMode } from "@domigo/game-feel";
import { storyItemKey, type ResolvedItem } from "@domigo/game-core";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { battlePlan } from "./battle.ts";
import { BattleStage } from "./BattleStage.tsx";
import { OverworldScene, type OverworldState, type PadState } from "./OverworldScene.ts";
import { cellCenterPx, spawnFor, type ParsedZone } from "./world.ts";

/** ONE zone's cosmetic state as the scene reports it (position + cleared node
 *  cells). The app folds these into the v2 world container (world.ts). */
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

/**
 * B-2: every campaign-specific chrome string the overworld shows, injected by
 * the app (serializable — it crosses the server→client boundary). The G1 zone
 * page passes its exact former hardcoded strings; the G2 school campaign
 * passes its own German-first pack (apps/web/lib/world-copy.ts).
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

export interface PhaserGameProps {
  seed: number;
  /** The attempt `mode` this world posts ("game:g1", "game:g2", …) — B-2 killed
   *  the old `game:g1` hardcode; the app owns the string. */
  mode: string;
  /** Campaign chrome strings (see WorldCopy) — the engine renders, never authors. */
  copy: WorldCopy;
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
  /** W-1: the zone's parsed data floor plan (null ⇒ legacy THEMES room). */
  layout?: ParsedZone | null;
  /** W-1: the zone short the player walked in FROM (door spawn beats save pos). */
  from?: string | null;
  /** W-1: zone shorts with released chapters — doors to the rest are ink-sealed. */
  unlockedZones?: string[];
  /** W-1: door travel — the app fades and navigates to the target zone. */
  onNavigate?: (targetZoneShort: string) => void;
  /** Cosmetic resume state (position nullable — fresh entries have none). */
  initialSave?: { pos: [number, number] | null; cleared: Array<string | number> } | null;
  /** Persist ONE zone's cosmetic state (the app merges + debounces persistence). */
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
// G-A1: the plain ✦ TaskCard (and its encounterPanel frame) is gone — a ✦ now
// opens the BattleStage (BattleStage.tsx), which hosts the same task views.

function postAttempt(onAttempt: AttemptFn, mode: string, itemId: string, input: unknown): void {
  void onAttempt({ clientAttemptId: crypto.randomUUID(), itemId, mode, input, latencyMs: null, hintUsed: false });
}

function DialogueOverlay({ grade, mode: attemptMode, copy, chapter, castNames, storyItems, onAttempt, onClose }: {
  grade: number; mode: string; copy: WorldCopy; chapter: Chapter; castNames: Record<string, string>; storyItems: Record<string, ResolvedItem>; onAttempt: AttemptFn; onClose: () => void;
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

export function PhaserGame(props: PhaserGameProps) {
  const grade = props.grade ?? 1;
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<OverworldScene | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);
  // Shared with the scene: the d-pad writes, update() reads (one axis expression).
  const padRef = useRef<PadState>({ up: false, down: false, left: false, right: false });
  const [coarse, setCoarse] = useState(false);
  // G-A1: the BattleStage needs the motion verdict in render (state, not just
  // the scene config); resolved in the mount effect below.
  const [reducedMotion, setReducedMotion] = useState(false);
  // W-1: door-travel fade + the sealed-door toast.
  const [leaving, setLeaving] = useState(false);
  const [sealedToast, setSealedToast] = useState(false);
  // One deterministic presentation per ✦ node (pool rotation, word bank, dropdown).
  const plan = useMemo(() => battlePlan(props.encounters), [props.encounters]);

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
    // G-A1: the user's own FeelGear motion toggle finally reaches the scene too
    // (feel() is game-feel's imperative snapshot — OS-reduced always wins inside it).
    const reducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(window.location.search).get("motion") === "reduce" ||
      !feel().motionOK;
    setReducedMotion(reducedMotion);
    // W-1: walking in through a door spawns at that door's threshold — beating
    // the saved position (spawnFor is pure + unit-tested; null without `from`).
    const spawnPx = props.layout && props.from ? cellCenterPx(spawnFor(props.layout, props.from)) : null;
    const scene = new OverworldScene({
      seed: props.seed,
      playerSeed: props.playerSeed,
      zoneId: props.zoneId,
      generator: props.generator,
      tileArt: props.tileArt,
      layout: props.layout ?? null,
      unlockedZones: props.unlockedZones,
      spawnPx,
      // W-1 door travel: freeze the world, fade to ink, let the app navigate.
      // Reduced-motion skips the fade beat (instant travel).
      onDoor: (target) => {
        if (reducedMotion) {
          props.onNavigate?.(target);
        } else {
          setLeaving(true);
          window.setTimeout(() => props.onNavigate?.(target), 260);
        }
      },
      onSealedDoor: () => {
        setSealedToast(true);
        window.setTimeout(() => setSealedToast(false), 2200);
      },
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
        {`${coarse ? props.copy.moveHintCoarse : props.copy.moveHintFine} · ${props.copy.encounterHint} · ${props.copy.npcHint}`}
      </p>

      {/* W-1: the sealed-door bump line — a calm toast, auto-hides. */}
      {sealedToast && (
        <div role="status" style={{
          position: "absolute", left: "50%", bottom: 46, transform: "translateX(-50%)",
          background: "rgba(15, 14, 26, 0.88)", color: "#e8e6f5", fontSize: 13, fontWeight: 600,
          padding: "8px 14px", borderRadius: 999, whiteSpace: "nowrap", zIndex: 6,
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        }}>
          {props.copy.sealedLabel}
        </div>
      )}

      {/* W-1: door travel — an ink dip while the next zone loads. */}
      {leaving && (
        <div aria-hidden="true" style={{
          position: "fixed", inset: 0, zIndex: 120, background: "#14121f",
          animation: "dg-encounter-veil-in 240ms ease-out both",
        }} />
      )}

      {overlay?.kind === "encounter" && props.encounters[overlay.idx] && (
        <BattleStage
          key={overlay.idx}
          item={props.encounters[overlay.idx]!}
          presentation={plan[overlay.idx] ?? { pool: null, bank: null, dropdown: false }}
          skin={props.copy.stageSkin}
          label={props.copy.encounterLabel}
          continueLabel={props.copy.continueLabel}
          victoryLabel={props.copy.victoryLabel}
          mode={props.mode}
          reducedMotion={reducedMotion}
          onAttempt={props.onAttempt}
          onDone={() => closeEncounter(overlay.idx)}
        />
      )}
      {overlay?.kind === "dialogue" && (
        <DialogueOverlay grade={grade} mode={props.mode} copy={props.copy} chapter={props.chapter} castNames={props.castNames} storyItems={props.storyItems} onAttempt={props.onAttempt} onClose={closeDialogue} />
      )}
    </div>
  );
}
