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
import type { ResolvedItem } from "@domigo/game-core";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { OverworldScene, type OverworldState } from "./OverworldScene.ts";

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
  /** The map@1 zone id this overworld renders (scopes the save). */
  zoneId: string;
  /** Wandering-encounter items (game-core resolved due/scope-random). */
  encounters: ResolvedItem[];
  /** The story chapter the Finn NPC plays. */
  chapter: Chapter;
  castNames: Record<string, string>;
  /** itemId → resolved item, for the chapter's taskSlots. */
  storyItems: Record<string, ResolvedItem>;
  onAttempt: AttemptFn;
  /** Cosmetic resume state (player position + cleared nodes). */
  initialSave?: GameSaveState | null;
  /** Persist cosmetic state (the app debounces localStorage + /api/game-save). */
  onSave?: (s: GameSaveState) => void;
}

type Overlay = { kind: "encounter"; idx: number } | { kind: "dialogue" } | null;

const card: CSSProperties = {
  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
  background: "rgba(15,23,42,0.55)", padding: 16, zIndex: 10,
};
const panel: CSSProperties = {
  background: "var(--card)", borderRadius: 20, padding: "20px 22px", maxWidth: 560, width: "100%",
  maxHeight: "92%", overflowY: "auto", fontFamily: "var(--font-body)", color: "var(--text)",
  border: "1px solid var(--card-border)", boxShadow: "var(--shadow-elevated)",
};

function postAttempt(onAttempt: AttemptFn, itemId: string, input: unknown): void {
  void onAttempt({ clientAttemptId: crypto.randomUUID(), itemId, mode: "game:g1", input, latencyMs: null, hintUsed: false });
}

function TaskCard({ item, onAttempt, onDone, label }: { item: ResolvedItem; onAttempt: AttemptFn; onDone: () => void; label: string }) {
  const [answered, setAnswered] = useState(false);
  const onResult = (_tier: Tier, detail: ResultDetail) => {
    setAnswered(true);
    postAttempt(onAttempt, detail.itemId, detail.input); // optimistic; server re-grades + queues
  };
  return (
    <div style={panel}>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.02em", textTransform: "uppercase" }}>{label}</div>
      {item.kind === "grammar" ? (
        <GrammarItemView key={item.item.id} item={item.item as GrammarItem} onResult={onResult} />
      ) : (
        <VocabItemView key={item.item.id} item={item.item as VocabItem} onResult={onResult} />
      )}
      {answered && <button className="dg-btn" style={{ marginTop: 14 }} onClick={onDone}>Continue →</button>}
    </div>
  );
}

function DialogueOverlay({ chapter, castNames, storyItems, onAttempt, onClose }: {
  chapter: Chapter; castNames: Record<string, string>; storyItems: Record<string, ResolvedItem>; onAttempt: AttemptFn; onClose: () => void;
}) {
  const byId = new Map(chapter.scenes.map((s) => [s.id, s]));
  const [sceneId, setSceneId] = useState(chapter.scenes[0]?.id ?? "");
  const [taskDone, setTaskDone] = useState(false);
  const [showGloss, setShowGloss] = useState(false);
  const scene: Scene | undefined = byId.get(sceneId);
  if (!scene) { onClose(); return null; }

  const slot = scene.taskSlots[0];
  const slotItem = slot ? storyItems[slot.itemId] : undefined;
  const taskBlocks = slot !== undefined && slotItem !== undefined && !taskDone;
  const sNext = scene.next; // string | Choice[] | null

  const go = (nextId: string | null) => { setTaskDone(false); setShowGloss(false); if (nextId === null) onClose(); else setSceneId(nextId); };

  return (
    <div style={card}>
      <div style={panel}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-display)" }}>{castNames[scene.speaker] ?? scene.speaker}</div>
        <p style={{ fontSize: 18, margin: "6px 0 4px", color: "var(--text)" }}>{scene.textEn}</p>
        {scene.scaffoldDe && <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 6px" }}>{scene.scaffoldDe}</p>}
        {scene.glosses.length > 0 && (
          <div style={{ fontSize: 13 }}>
            <button className="dg-chip" onClick={() => setShowGloss((g) => !g)}>
              {showGloss ? "Hide help" : "Show word help"}
            </button>
            {showGloss && <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "var(--text-secondary)" }}>{scene.glosses.map((g) => <li key={g.word}>{g.word} = {g.de}</li>)}</ul>}
          </div>
        )}

        {taskBlocks ? (
          <div style={{ marginTop: 14, borderTop: "1px solid var(--card-border)", paddingTop: 12 }}>
            <TaskCardInline item={slotItem} onAttempt={onAttempt} onDone={() => setTaskDone(true)} />
          </div>
        ) : Array.isArray(sNext) ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {sNext.map((c) => (
              <button key={c.id} className="dg-btn-secondary" style={{ textAlign: "left", justifyContent: "flex-start" }} onClick={() => go(c.next)}>{c.textEn}</button>
            ))}
          </div>
        ) : (
          <button className="dg-btn" style={{ marginTop: 14 }} onClick={() => go(sNext)}>{sNext === null ? "Close" : "Next →"}</button>
        )}
      </div>
    </div>
  );
}

/** Inline task inside dialogue (no extra overlay chrome). */
function TaskCardInline({ item, onAttempt, onDone }: { item: ResolvedItem; onAttempt: AttemptFn; onDone: () => void }) {
  const [answered, setAnswered] = useState(false);
  const onResult = (_tier: Tier, detail: ResultDetail) => { setAnswered(true); postAttempt(onAttempt, detail.itemId, detail.input); };
  return (
    <>
      {item.kind === "grammar"
        ? <GrammarItemView key={item.item.id} item={item.item as GrammarItem} onResult={onResult} />
        : <VocabItemView key={item.item.id} item={item.item as VocabItem} onResult={onResult} />}
      {answered && <button className="dg-btn" style={{ marginTop: 14 }} onClick={onDone}>Continue →</button>}
    </>
  );
}

export function PhaserGame(props: PhaserGameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<OverworldScene | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);

  useEffect(() => {
    const { width, height } = OverworldScene.dimensions();
    const scene = new OverworldScene({
      seed: props.seed,
      zoneId: props.zoneId,
      encounterCount: props.encounters.length,
      onEncounter: (idx) => setOverlay({ kind: "encounter", idx }),
      onNpc: () => setOverlay({ kind: "dialogue" }),
      initial: props.initialSave ?? null,
      onState: (s) => props.onSave?.(s),
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
    return () => game.destroy(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeEncounter = (idx: number) => { sceneRef.current?.clearEncounter(idx); sceneRef.current?.resumePlayer(); setOverlay(null); };
  const closeDialogue = () => { sceneRef.current?.resumePlayer(); setOverlay(null); };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 720, margin: "0 auto" }}>
      <div ref={hostRef} data-testid="game-canvas" style={{ width: "100%", aspectRatio: "15 / 11", background: "#1e293b", borderRadius: 8, overflow: "hidden" }} />
      <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 6 }}>Arrow keys / WASD to move · walk into a ✦ to practise · talk to Finn</p>

      {overlay?.kind === "encounter" && props.encounters[overlay.idx] && (
        <div style={card}>
          <TaskCard item={props.encounters[overlay.idx]!} onAttempt={props.onAttempt} onDone={() => closeEncounter(overlay.idx)} label="A word is fading — bring it back!" />
        </div>
      )}
      {overlay?.kind === "dialogue" && (
        <DialogueOverlay chapter={props.chapter} castNames={props.castNames} storyItems={props.storyItems} onAttempt={props.onAttempt} onClose={closeDialogue} />
      )}
    </div>
  );
}
