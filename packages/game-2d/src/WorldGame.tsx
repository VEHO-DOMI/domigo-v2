"use client";
import Phaser from "phaser";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { GrammarItem, LocalizedText, VocabItem, WorldArea, WorldDefinition, WorldInteractable } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import type { ProjectedWorldState, ResolvedItem } from "@domigo/game-core";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { WorldScene, type WorldDebugState, type WorldLocation, type WorldPadState } from "./WorldScene.ts";

export interface ConnectedWorldAttempt {
  clientAttemptId: string; itemId: string; mode: string; input: unknown; latencyMs: number | null;
  hintUsed: boolean; worldContext: { worldId: string; encounterId: string }; previewToken: string;
}
export type ConnectedWorldAttemptFn = (attempt: ConnectedWorldAttempt) => Promise<{ ok: boolean; queued: boolean; worldState?: ProjectedWorldState }>;

export interface WorldGameProps {
  world: WorldDefinition;
  initialState: ProjectedWorldState;
  items: Record<string, ResolvedItem>;
  profileName: string;
  previewToken: string;
  playerSeed: number;
  persistenceAvailable: boolean;
  onAttempt: ConnectedWorldAttemptFn;
}

type Language = "de" | "en";
type DialogueOverlay = { kind: "dialogue"; title: string; lines: LocalizedText[]; nextEncounterId?: string; retryEncounterId?: string; retryTaskIndex?: number; note?: string };
type TaskOverlay = { kind: "task"; encounterId: string; taskId: string; taskIndex: number; instance: number; replay: boolean };
type Overlay = DialogueOverlay | TaskOverlay | null;

const modal: CSSProperties = { position: "absolute", inset: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 14, background: "radial-gradient(ellipse at center, rgba(23,53,37,.35), rgba(16,27,20,.82))" };
const panel: CSSProperties = { width: "min(590px, 100%)", maxHeight: "92%", overflowY: "auto", border: "2px solid #d8b75c", borderRadius: 18, padding: "18px 20px", background: "#fff8df", color: "#273126", boxShadow: "0 18px 55px rgba(0,0,0,.35)" };

function copy(text: LocalizedText, language: Language): string { return text[language]; }

function PadButton({ direction, label, glyph, pad }: { direction: keyof WorldPadState; label: string; glyph: string; pad: WorldPadState }) {
  const [, redraw] = useState(0);
  const set = (value: boolean) => { pad[direction] = value; redraw((n) => n + 1); };
  return <button type="button" aria-label={label} aria-pressed={pad[direction]} onPointerDown={(event) => { event.preventDefault(); set(true); try { event.currentTarget.setPointerCapture(event.pointerId); } catch {} }} onPointerUp={() => set(false)} onPointerCancel={() => set(false)} onPointerLeave={() => set(false)} style={{ width: 48, height: 48, border: "1px solid rgba(255,255,255,.45)", borderRadius: 13, background: pad[direction] ? "rgba(243,201,105,.88)" : "rgba(23,53,37,.76)", color: "white", fontSize: 19, touchAction: "none" }}>{glyph}</button>;
}

function DPad({ pad }: { pad: WorldPadState }) {
  return <div role="group" aria-label="Bewegen" style={{ position: "absolute", left: 10, bottom: 10, zIndex: 8, display: "grid", gridTemplateColumns: "48px 48px 48px", gridTemplateRows: "48px 48px 48px", gap: 2 }}>
    <div style={{ gridColumn: 2, gridRow: 1 }}><PadButton direction="up" label="Nach oben" glyph="▲" pad={pad} /></div>
    <div style={{ gridColumn: 1, gridRow: 2 }}><PadButton direction="left" label="Nach links" glyph="◀" pad={pad} /></div>
    <div style={{ gridColumn: 3, gridRow: 2 }}><PadButton direction="right" label="Nach rechts" glyph="▶" pad={pad} /></div>
    <div style={{ gridColumn: 2, gridRow: 3 }}><PadButton direction="down" label="Nach unten" glyph="▼" pad={pad} /></div>
  </div>;
}

function TaskPanel({ overlay, world, item, language, submitting, onResult, onClose }: { overlay: TaskOverlay; world: WorldDefinition; item: ResolvedItem; language: Language; submitting: boolean; onResult: (tier: Tier, detail: ResultDetail) => void; onClose: () => void }) {
  const encounter = world.encounters.find((candidate) => candidate.id === overlay.encounterId)!;
  return <div style={modal} role="dialog" aria-modal="true" aria-label="Lernaufgabe">
    <div style={panel}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
        <div><strong style={{ color: "#31583f" }}>{copy(encounter.intro[0]!, language)}</strong>{overlay.replay && <div style={{ fontSize: 12, color: "#786a42" }}>Übung wiederholen · keine zusätzlichen Erfahrungspunkte</div>}</div>
        <button type="button" className="dg-btn-secondary" onClick={onClose}>Schließen</button>
      </div>
      <div aria-busy={submitting} style={{ opacity: submitting ? .62 : 1, pointerEvents: submitting ? "none" : "auto" }}>
        {item.kind === "grammar" ? <GrammarItemView key={`${overlay.taskId}:${overlay.instance}`} item={item.item as GrammarItem} tactile hideXp onResult={onResult} /> : <VocabItemView key={`${overlay.taskId}:${overlay.instance}`} item={item.item as VocabItem} hideXp autoFocus onResult={onResult} />}
      </div>
      {submitting && <p role="status" style={{ margin: "10px 0 0", color: "#31583f", fontWeight: 700 }}>Wird sicher gespeichert …</p>}
    </div>
  </div>;
}

export function WorldGame(props: WorldGameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<WorldScene | null>(null);
  const padRef = useRef<WorldPadState>({ up: false, down: false, left: false, right: false });
  const stateRef = useRef(props.initialState);
  const [worldState, setWorldState] = useState(props.initialState);
  const [area, setArea] = useState<WorldArea>(() => props.world.areas.find((candidate) => candidate.id === props.initialState.currentAreaId) ?? props.world.areas[0]!);
  const [nearby, setNearby] = useState<WorldInteractable | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [language, setLanguage] = useState<Language>("de");
  const [coarse, setCoarse] = useState(false);
  const [saveStatus, setSaveStatus] = useState(props.persistenceAvailable ? "Gespeichert" : "Nur lokal");
  const [submitting, setSubmitting] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [debug, setDebug] = useState<WorldDebugState | null>(null);

  const applyAuthoritative = (next: ProjectedWorldState, redrawWorld = true) => { stateRef.current = next; setWorldState(next); if (redrawWorld) sceneRef.current?.applyState(next); };
  const closeOverlay = () => { setOverlay(null); setSubmitting(false); sceneRef.current?.setPaused(false); };
  const startEncounter = (encounterId: string, forceInstance = 0, replayTaskIndex = 0) => {
    const encounter = props.world.encounters.find((candidate) => candidate.id === encounterId); if (!encounter) return closeOverlay();
    const replay = stateRef.current.completedEncounterIds.includes(encounterId);
    const taskIndex = replay ? replayTaskIndex : Math.max(0, encounter.taskRefs.findIndex((taskId) => !stateRef.current.completedTaskIds.includes(taskId)));
    const nextTask = encounter.taskRefs[taskIndex] ?? encounter.taskRefs[0]!;
    setOverlay({ kind: "task", encounterId, taskId: nextTask, taskIndex, instance: Date.now() + forceInstance, replay });
    sceneRef.current?.setPaused(true);
  };

  const handleInteraction = async (item: WorldInteractable) => {
    const state = stateRef.current;
    if (item.connectionId) {
      const connection = props.world.connections.find((candidate) => candidate.id === item.connectionId);
      if (connection?.requiredFlag && !state.storyFlags[connection.requiredFlag]) {
        sceneRef.current?.setPaused(true); setOverlay({ kind: "dialogue", title: copy(item.prompt, language), lines: connection.lockedText ? [connection.lockedText] : item.dialogue }); return;
      }
      sceneRef.current?.transition(item.connectionId); return;
    }
    sceneRef.current?.setPaused(true);
    if (item.kind === "collectible") {
      setSaveStatus("Wird gespeichert …");
      try {
        const response = await fetch(`/api/game-world/${props.world.id}/events`, { method: "POST", headers: { "content-type": "application/json", "x-domigo-preview-token": props.previewToken }, body: JSON.stringify({ interactionId: item.id }) });
        const data = await response.json() as { ok?: boolean; state?: ProjectedWorldState };
        if (!response.ok || !data.ok || !data.state) throw new Error("collectible not saved");
        applyAuthoritative(data.state); setSaveStatus("Gespeichert");
        setOverlay({ kind: "dialogue", title: copy(item.prompt, language), lines: item.dialogue, note: "+2 Erfahrungspunkte · einmalige Entdeckung" });
      } catch { setSaveStatus("Wartet auf Verbindung"); setOverlay({ kind: "dialogue", title: "Noch nicht gespeichert", lines: [{ de: "Die Entdeckung wird erst bestätigt, wenn die Sandbox-Datenbank erreichbar ist.", en: "The discovery is confirmed only when the sandbox database is reachable." }] }); }
      return;
    }
    if (item.dialogue.length) setOverlay({ kind: "dialogue", title: copy(item.prompt, language), lines: item.dialogue, ...(item.encounterId ? { nextEncounterId: item.encounterId } : {}) });
    else if (item.encounterId) startEncounter(item.encounterId);
    else closeOverlay();
  };
  const interactionRef = useRef(handleInteraction); interactionRef.current = handleInteraction;

  const saveLocation = async (location: WorldLocation) => {
    setSaveStatus("Wird gespeichert …");
    try {
      const response = await fetch(`/api/game-world/${props.world.id}/location`, { method: "POST", headers: { "content-type": "application/json", "x-domigo-preview-token": props.previewToken }, body: JSON.stringify(location) });
      const data = await response.json() as { ok?: boolean; state?: ProjectedWorldState };
      if (!response.ok || !data.ok || !data.state) throw new Error("location not saved");
      applyAuthoritative(data.state, false); localStorage.removeItem(`domigo-world-pending:${props.world.id}`); setSaveStatus("Gespeichert");
    } catch { localStorage.setItem(`domigo-world-pending:${props.world.id}`, JSON.stringify({ ...location, savedAt: new Date().toISOString() })); setSaveStatus("Lokal vorgemerkt"); }
  };
  const locationRef = useRef(saveLocation); locationRef.current = saveLocation;

  useEffect(() => {
    sessionStorage.setItem(`domigo-preview:${props.world.id}`, props.previewToken);
    const forcedPad = new URLSearchParams(location.search).has("dpad"); const pointer = matchMedia("(pointer: coarse)");
    setCoarse(forcedPad || pointer.matches); const onPointer = (event: MediaQueryListEvent) => setCoarse(forcedPad || event.matches); pointer.addEventListener("change", onPointer);
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).get("motion") === "reduce";
    let initialSceneState = props.initialState;
    try {
      const pending = JSON.parse(localStorage.getItem(`domigo-world-pending:${props.world.id}`) ?? "null") as Partial<WorldLocation> | null;
      const pendingArea = props.world.areas.find((candidate) => candidate.id === pending?.areaId);
      if (pendingArea && typeof pending?.spawnId === "string" && pendingArea.spawns.some((candidate) => candidate.id === pending.spawnId) && Array.isArray(pending.position) && pending.position.length === 2 && pending.position.every((value) => typeof value === "number" && Number.isFinite(value))) {
        initialSceneState = { ...props.initialState, currentAreaId: pendingArea.id, currentSpawnId: pending.spawnId, position: pending.position as [number, number] };
      }
    } catch { localStorage.removeItem(`domigo-world-pending:${props.world.id}`); }
    const scene = new WorldScene({ world: props.world, initialState: initialSceneState, playerSeed: props.playerSeed, pad: padRef.current, reducedMotion, onNearby: setNearby, onInteract: (item) => void interactionRef.current(item), onLocation: (value) => void locationRef.current(value), onArea: setArea });
    sceneRef.current = scene; const size = WorldScene.dimensions();
    const game = new Phaser.Game({ type: Phaser.AUTO, parent: hostRef.current ?? undefined, width: size.width, height: size.height, pixelArt: true, backgroundColor: "#173525", fps: { target: 30, min: 20 }, physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 } } }, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, scene });
    const onVisibility = () => scene.setBlurred(document.visibilityState === "hidden"); document.addEventListener("visibilitychange", onVisibility);
    const flushPendingLocation = () => {
      try {
        const pending = JSON.parse(localStorage.getItem(`domigo-world-pending:${props.world.id}`) ?? "null") as Partial<WorldLocation> | null;
        if (pending?.areaId && pending.spawnId && Array.isArray(pending.position) && pending.position.length === 2) void locationRef.current(pending as WorldLocation);
      } catch { localStorage.removeItem(`domigo-world-pending:${props.world.id}`); }
    };
    window.addEventListener("online", flushPendingLocation);
    if (process.env.NODE_ENV !== "production") (window as unknown as Record<string, unknown>).__domigo = { tap: (x: number, y: number) => scene.tapAt(x, y), interact: () => scene.interact(), state: () => scene.debugState(), jump: (areaId: string, spawnId?: string) => scene.jumpTo(areaId, spawnId) };
    return () => { pointer.removeEventListener("change", onPointer); document.removeEventListener("visibilitychange", onVisibility); window.removeEventListener("online", flushPendingLocation); if (process.env.NODE_ENV !== "production") delete (window as unknown as Record<string, unknown>).__domigo; game.destroy(true); };
    // The Phaser scene owns its lifecycle; live state reaches it through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (!debugEnabled) return; sceneRef.current?.setDebugCollision(true); const timer = window.setInterval(() => setDebug(sceneRef.current?.debugState() ?? null), 250); return () => { clearInterval(timer); sceneRef.current?.setDebugCollision(false); }; }, [debugEnabled]);

  const onTaskResult = async (tier: Tier, detail: ResultDetail) => {
    if (overlay?.kind !== "task") return;
    const encounter = props.world.encounters.find((candidate) => candidate.id === overlay.encounterId)!;
    const wasComplete = stateRef.current.completedEncounterIds.includes(encounter.id);
    setSubmitting(true);
    const result = await props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: detail.itemId, mode: "game:g1-rpg", input: detail.input, latencyMs: null, hintUsed: false, worldContext: { worldId: props.world.id, encounterId: encounter.id }, previewToken: props.previewToken });
    setSubmitting(false);
    if (result.worldState) applyAuthoritative(result.worldState);
    if (tier !== "correct") {
      setOverlay({ kind: "dialogue", title: "Noch einmal", lines: encounter.retry, retryEncounterId: encounter.id, retryTaskIndex: overlay.taskIndex, ...(result.queued ? { note: "Die Antwort ist offline vorgemerkt und wird später in der Lehreransicht erscheinen." } : !result.ok ? { note: "Die Antwort konnte noch nicht gespeichert werden." } : {}) });
      return;
    }
    if (result.worldState) {
      if (!result.worldState.completedTaskIds.includes(detail.itemId)) { setOverlay({ kind: "dialogue", title: "Nicht bestätigt", lines: encounter.retry, retryEncounterId: encounter.id }); return; }
      if (overlay.replay && overlay.taskIndex < encounter.taskRefs.length - 1) { startEncounter(encounter.id, 1, overlay.taskIndex + 1); return; }
      const complete = encounter.taskRefs.every((taskId) => result.worldState!.completedTaskIds.includes(taskId));
      if (complete) setOverlay({ kind: "dialogue", title: "Geschafft", lines: encounter.success, note: !wasComplete && result.worldState.completedEncounterIds.includes(encounter.id) ? "+5 Begegnungs-Erfahrungspunkte beim ersten Abschluss" : undefined });
      else startEncounter(encounter.id, 1);
    } else if (result.queued) setOverlay({ kind: "dialogue", title: "Antwort vorgemerkt", lines: [{ de: "Die Aufgabe wartet sicher im Offline-Ausgang. Der Weg öffnet sich erst nach der Serverbestätigung.", en: "The task is safely queued offline. The route opens only after server confirmation." }] });
    else setOverlay({ kind: "dialogue", title: "Nicht gespeichert", lines: [{ de: "Die Sandbox hat die Antwort nicht angenommen. Du kannst die Aufgabe erneut öffnen.", en: "The sandbox did not accept the answer. You can open the task again." }], retryEncounterId: encounter.id });
  };

  const variant = area.variants.find((candidate) => candidate.id === worldState.mapVariants[area.id]);
  const prompt = nearby ? copy(nearby.prompt, language) : null;
  return <section data-grade="1" style={{ width: "100%", maxWidth: 760, margin: "0 auto", color: "#273126" }}>
    <header style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 8 }}>
      <div><h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 23 }}>{copy(variant?.title ?? area.title, language)}</h1><div style={{ color: "var(--muted)", fontSize: 12 }}>{props.profileName} · {worldState.xp} XP gesamt ({worldState.worldXp} in dieser Welt)</div></div>
      <div style={{ display: "flex", gap: 7 }}><button type="button" className="dg-btn-secondary" onClick={() => setLanguage((value) => value === "de" ? "en" : "de")}>{language === "de" ? "DE · English" : "EN · Deutsch"}</button>{process.env.NODE_ENV !== "production" && <button type="button" className="dg-btn-secondary" aria-pressed={debugEnabled} onClick={() => setDebugEnabled((value) => !value)}>Debug</button>}</div>
    </header>
    <div style={{ position: "relative", border: "3px solid #31583f", borderRadius: 14, overflow: "hidden", background: "#173525", boxShadow: "0 12px 34px rgba(23,53,37,.24)" }}>
      <div ref={hostRef} data-testid="connected-world-canvas" style={{ width: "100%", aspectRatio: "15 / 11" }} />
      {coarse && overlay === null && <><DPad pad={padRef.current} /><button type="button" aria-label="Aktion" onClick={() => sceneRef.current?.interact()} style={{ position: "absolute", right: 16, bottom: 25, zIndex: 9, width: 72, height: 72, borderRadius: "50%", border: "3px solid #fff8df", background: "#c8993f", color: "#173525", fontWeight: 900, boxShadow: "0 5px 15px rgba(0,0,0,.3)" }}>Aktion</button></>}
      {prompt && overlay === null && <div role="status" style={{ position: "absolute", zIndex: 10, left: "50%", bottom: coarse ? 104 : 15, transform: "translateX(-50%)", width: "max-content", maxWidth: "88%", padding: "7px 11px", borderRadius: 10, background: "rgba(255,248,223,.95)", border: "1px solid #d8b75c", color: "#173525", fontSize: 13, fontWeight: 800, textAlign: "center" }}>{prompt} <span style={{ color: "#85631f" }}>· E / Leertaste</span></div>}
      {overlay?.kind === "dialogue" && <div style={modal} role="dialog" aria-modal="true"><div style={panel}><h2 style={{ margin: "0 0 8px", color: "#31583f" }}>{overlay.title}</h2>{overlay.lines.map((line, index) => <p key={index} style={{ fontSize: 18, lineHeight: 1.5 }}>{copy(line, language)}</p>)}{overlay.note && <p style={{ color: "#85631f", fontWeight: 700 }}>{overlay.note}</p>}<button type="button" className="dg-btn" autoFocus onClick={() => overlay.nextEncounterId ? startEncounter(overlay.nextEncounterId) : overlay.retryEncounterId ? startEncounter(overlay.retryEncounterId, 1, overlay.retryTaskIndex ?? 0) : closeOverlay()}>{overlay.nextEncounterId ? "Aufgabe starten" : overlay.retryEncounterId ? "Noch einmal" : "Schließen"}</button></div></div>}
      {overlay?.kind === "task" && props.items[overlay.taskId] && <TaskPanel overlay={overlay} world={props.world} item={props.items[overlay.taskId]!} language={language} submitting={submitting} onResult={(tier, detail) => void onTaskResult(tier, detail)} onClose={closeOverlay} />}
      {debugEnabled && debug && <pre data-testid="world-debug" style={{ position: "absolute", top: 8, left: 8, zIndex: 30, margin: 0, maxWidth: "62%", padding: 8, borderRadius: 7, background: "rgba(8,17,11,.88)", color: "#d8f5d0", fontSize: 10, whiteSpace: "pre-wrap", pointerEvents: "none" }}>{JSON.stringify({ ...debug, saveStatus }, null, 2)}</pre>}
    </div>
    <footer style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 7, color: "var(--muted)", fontSize: 12 }}><span>{coarse ? "Tippe auf den Boden oder nutze das Steuerkreuz." : "Pfeiltasten / WASD · tippen oder klicken zum Laufen · E / Leertaste für Aktion"}</span><span role="status">{saveStatus}</span></footer>
  </section>;
}
