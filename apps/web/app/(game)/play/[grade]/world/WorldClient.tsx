"use client";
/**
 * VS · client boundary for the world map. Owns three things:
 *  - the v3 keen save ({chapters, beats, pos}) — localStorage instant-resume +
 *    debounced PUT /api/game-save (the GameClient sync, replicated not imported);
 *  - the ch01 story beats, staged through the beat renderer (DialogueOverlay):
 *    the DOOR slice on first arrival, the RESTORE slice after ?done=ch01 — with
 *    the thrown-flag parabola playing under it (keen-metagame §1.6);
 *  - the Funken pouch display (server-authoritative; degraded/0 → hidden).
 * Beat task slots post REAL graded attempts (mode game:g1, the A4 outbox).
 */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Chapter, Scene } from "@domigo/content-schema";
import { type WorldCopy } from "@domigo/game-2d/dialogue";
import { CutscenePlayer } from "@domigo/game-2d/cutscene";
import { toggleGameFullscreen } from "@domigo/game-2d/fullscreen";
import type { MapGameProps } from "@domigo/game-2d";
import type { ResolvedItem } from "@domigo/game-core";
import { useOutboxFlush } from "@/lib/useOutboxFlush";

const MapGame = dynamic(() => import("@domigo/game-2d").then((m) => m.MapGame), {
  ssr: false,
  loading: () => <p style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Die Karte entfaltet sich…</p>,
});

const GAME_MODE = "game:g1:keen";
const LS_KEY = `domigo:gamesave:${GAME_MODE}`;

interface SaveV3 {
  v: 3;
  chapters: Record<string, { done: boolean }>;
  beats: Record<string, { door?: boolean; restore?: boolean; door2?: boolean }>;
  pos?: { c: number; r: number };
}
interface SavePayload { clientRev: number; state: unknown }

/** Whatever shape arrived (v3 / junk / nothing) → a v3 container. */
function toV3(state: unknown): SaveV3 {
  if (typeof state === "object" && state !== null && (state as { v?: unknown }).v === 3) {
    const s = state as Partial<SaveV3>;
    return { v: 3, chapters: s.chapters ?? {}, beats: s.beats ?? {}, ...(s.pos ? { pos: s.pos } : {}) };
  }
  return { v: 3, chapters: {}, beats: {} };
}

/** Slice the chapter's linear scene chain [from → stop) by beat anchor.
 *  Anchors are short keys ("s001"); scene ids are chapter-prefixed — match by
 *  suffix. The walk follows `next` (FlagGate takes its neutral `else`, the
 *  DialogueOverlay rule); the last included scene gets next:null so the
 *  overlay's close button ends the slice. */
function sliceChapter(chapter: Chapter, from: string, stop: string | null): Chapter {
  const byId = new Map(chapter.scenes.map((s) => [s.id, s]));
  const resolve = (anchor: string): Scene | undefined =>
    byId.get(anchor) ?? chapter.scenes.find((s) => s.id.endsWith(`.${anchor}`));
  const stopId = stop === null ? null : resolve(stop)?.id ?? null;
  const sliced: Scene[] = [];
  const seen = new Set<string>();
  let cur = resolve(from);
  while (cur !== undefined && cur.id !== stopId && !seen.has(cur.id)) {
    seen.add(cur.id);
    sliced.push(cur);
    const next = cur.next;
    const nextId = typeof next === "string" ? next : next !== null && !Array.isArray(next) ? next.else : null;
    cur = nextId === null ? undefined : byId.get(nextId);
  }
  const last = sliced[sliced.length - 1];
  if (last !== undefined) sliced[sliced.length - 1] = { ...last, next: null };
  return { ...chapter, scenes: sliced };
}

export default function WorldClient(props: {
  seed: number;
  playerSeed?: number;
  /** attempt mode ("game:g1") — beat task slots are REAL graded attempts. */
  mode: string;
  copy: WorldCopy;
  world: MapGameProps["world"];
  /** per-chapter beat anchors from world.json (door/restore scene keys). */
  beats: Record<string, { door: string; restore: string }>;
  chapter: Chapter;
  /** doc 28 §3: the ch00 cold-open — plays ONCE (save.beats.ch00) before the map. */
  prologue?: Chapter | null;
  castNames: Record<string, string>;
  storyItems: Record<string, ResolvedItem>;
  /** doc 28 §6.4: speaker→portrait + illustration-stem→URL (only-present law). */
  castArt?: Record<string, string>;
  beatArt?: Record<string, string>;
  /** doc 28 §5: the world map's generated art (page_underlay, buildings…). */
  mapArt?: Record<string, string>;
  serverSave: SavePayload | null;
  /** ?done=chNN — the level's doneHref triggers the restoration flow. */
  done?: string;
}) {
  useOutboxFlush();
  const router = useRouter();
  const { serverSave } = props;
  const ch = props.chapter.id.split(".").pop() ?? "ch01";

  // ── the save sync (GameClient's logic, replicated): local vs server, higher
  //    clientRev wins; every change → localStorage now + a debounced PUT ──
  const [initial] = useState<SavePayload | null>(() => {
    if (typeof window === "undefined") return serverSave;
    let local: SavePayload | null = null;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) local = JSON.parse(raw) as SavePayload;
    } catch { /* ignore */ }
    return local && (!serverSave || local.clientRev > serverSave.clientRev) ? local : serverSave;
  });
  const saveRef = useRef<SaveV3>(toV3(initial?.state ?? null));
  const revRef = useRef(initial?.clientRev ?? 0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Render-safe snapshot of the at-load save (the render body must never read
  // saveRef.current — React's no-ref-in-render rule). Mutations during the
  // session go through saveRef; anything the render depends on (done-state,
  // door-beat, start pos) is captured here once and only changes via a full
  // navigation (closeRestore → router.replace) that reloads the page.
  const at = useMemo(() => toV3(initial?.state ?? null), [initial]);

  const put = (payload: SavePayload) => {
    void fetch("/api/game-save", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ gameMode: GAME_MODE, schemaVersion: 3, clientRev: payload.clientRev, state: payload.state }),
    }).catch(() => { /* cosmetic, best-effort */ });
  };
  const persist = () => {
    revRef.current += 1;
    const payload: SavePayload = { clientRev: revRef.current, state: saveRef.current };
    try { localStorage.setItem(LS_KEY, JSON.stringify(payload)); } catch { /* quota/private mode */ }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => put(payload), 1500);
  };

  // flush a pending save when the tab hides/closes (the GameClient idiom)
  useEffect(() => {
    const flush = () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
      timer.current = null;
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) put(JSON.parse(raw) as SavePayload);
      } catch { /* ignore */ }
    };
    const onHidden = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, []);

  // ── the restoration flow: ?done=ch01 → thrown flag plays, then the restore
  //    beat over it; closing marks the chapter done and clears the param ──
  const restoring = props.done === ch && at.chapters[ch]?.done !== true;
  const [showRestore, setShowRestore] = useState(false);
  useEffect(() => {
    if (!restoring) return;
    const t = window.setTimeout(() => setShowRestore(true), 1800);
    return () => window.clearTimeout(t);
  }, [restoring]);

  // ── the PROLOGUE (doc 28 §3): the cold-open plays ONCE, before everything ──
  // v4 W0: the key is VERSIONED (`door2`) — saves that closed the old 4-shot
  // prologue replay the rebuilt 13-shot one once (Koki's prod save never saw it)
  const [prologueOpen, setPrologueOpen] = useState(
    () => props.prologue != null && at.beats["ch00"]?.door2 !== true,
  );
  const closePrologue = () => {
    saveRef.current.beats["ch00"] = { ...(saveRef.current.beats["ch00"] ?? {}), door2: true };
    persist();
    setPrologueOpen(false);
  };

  // ── the door beat: plays over the map on first arrival ──
  const [doorOpen, setDoorOpen] = useState(() => at.beats[ch]?.door !== true);

  const anchors = props.beats[ch] ?? null;
  const doorChapter = useMemo(
    () => (anchors ? sliceChapter(props.chapter, anchors.door, anchors.restore) : null),
    [anchors, props.chapter],
  );
  const restoreChapter = useMemo(
    () => (anchors ? sliceChapter(props.chapter, anchors.restore, null) : null),
    [anchors, props.chapter],
  );

  const chaptersDone = Object.keys(at.chapters).filter((k) => at.chapters[k]?.done === true);
  const mapChaptersDone = restoring ? [...new Set([...chaptersDone, ch])] : chaptersDone;

  const [note, setNote] = useState<string | null>(null);
  const dialogueOpen = prologueOpen || (doorOpen && !restoring && doorChapter !== null) || (showRestore && restoreChapter !== null);
  // MapScene captures callbacks at mount — route them through a ref so an open
  // overlay reliably blocks door entry even from the stale closure. Synced in
  // an effect (never assigned during render — React's no-ref-in-render rule).
  const dialogueOpenRef = useRef(dialogueOpen);
  useEffect(() => { dialogueOpenRef.current = dialogueOpen; }, [dialogueOpen]);

  // (beat task attempts are gone with the no-task-in-cutscene law, doc 29 §2)
  const onEnter = (chapter: string) => {
    if (dialogueOpenRef.current) return;
    router.push(`/play/1/run?level=g1-${chapter}&from=world`);
  };
  const onNote = (text: string) => setNote(text);
  const onMove = (c: number, r: number) => {
    saveRef.current.pos = { c, r };
    persist();
  };

  const closeDoor = () => {
    saveRef.current.beats[ch] = { ...(saveRef.current.beats[ch] ?? {}), door: true };
    persist();
    setDoorOpen(false);
  };
  const closeRestore = () => {
    saveRef.current.chapters[ch] = { done: true };
    saveRef.current.beats[ch] = { ...(saveRef.current.beats[ch] ?? {}), restore: true };
    persist();
    setShowRestore(false);
    router.replace("/play/1/world");
  };

  // ── the Funken pouch (server-authoritative; 0/degraded → hidden) ──
  const [sparks, setSparks] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    void fetch("/api/funken")
      .then((r) => r.json())
      .then((j: { ok?: boolean; sparks?: number }) => {
        if (alive && j.ok === true && typeof j.sparks === "number" && j.sparks > 0) setSparks(j.sparks);
      })
      .catch(() => { /* degraded → hidden */ });
    return () => { alive = false; };
  }, []);

  return (
    <main style={{ padding: "16px 12px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", maxWidth: 720, margin: "0 auto 10px", gap: 8 }}>
        <h1 style={{ fontSize: 21, margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>Die verlorenen Seiten — Weltkarte</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
          {sparks !== null && <span style={{ fontSize: 14, fontWeight: 700, color: "#b8962e" }}>✺ {sparks} Funken</span>}
          <span style={{ display: "inline-flex", gap: 14, alignItems: "center" }}>
            <Link href="/play/1" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Alle Räume</Link>
            <button type="button" onClick={() => toggleGameFullscreen()} title="Vollbild" style={{ fontSize: 15, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>⛶</button>
            {props.prologue != null && (
              <button type="button" onClick={() => setPrologueOpen(true)} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                📖 Prolog
              </button>
            )}
          </span>
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
        <MapGame
          key={`${mapChaptersDone.join(",")}|${restoring ? "justdone" : ""}`}
          world={props.world}
          chaptersDone={mapChaptersDone}
          justDone={restoring ? ch : undefined}
          startPos={at.pos ?? null}
          art={props.mapArt}
          seed={props.seed}
          playerSeed={props.playerSeed}
          onEnter={onEnter}
          onNote={onNote}
          onMove={onMove}
        />

        {/* Jona's note — short, sad, never scary; a quiet paper card */}
        {note !== null && !dialogueOpen && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,13,26,0.8)", padding: 16 }}>
            <div style={{ background: "#f6f2e4", color: "#2c2138", borderRadius: 4, padding: "22px 24px", maxWidth: 380, width: "100%", textAlign: "center", transform: "rotate(-1deg)", border: "1px solid #dcd7c4", boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8f8ab0", marginBottom: 8 }}>Ein Zettel</div>
              <p style={{ fontSize: 17, fontFamily: "var(--font-display)", fontStyle: "italic", margin: "0 0 16px", lineHeight: 1.5 }}>{note}</p>
              <button type="button" className="dg-btn" onClick={() => setNote(null)}>Weiter</button>
            </div>
          </div>
        )}

        {/* the DOOR beat — the chapter's opening scenes, at the building door */}
        {/* the door beat waits for the prologue (one stage at a time) */}
        {doorOpen && !prologueOpen && !restoring && doorChapter !== null && (
          <CutscenePlayer
            grade={1}
            chapter={doorChapter}
            castNames={props.castNames}
            beatArt={props.beatArt}
            canSkip={process.env.NODE_ENV !== "production"}
            onClose={closeDoor}
          />
        )}

        {/* the RESTORE beat — after the thrown flag lands (~1.8s under it) */}
        {showRestore && restoreChapter !== null && (
          <CutscenePlayer
            grade={1}
            chapter={restoreChapter}
            castNames={props.castNames}
            beatArt={props.beatArt}
            canSkip={process.env.NODE_ENV !== "production"}
            onClose={closeRestore}
          />
        )}

        {/* THE PROLOGUE (doc 28 §3) — the cold-open, cinematic, once ever */}
        {prologueOpen && props.prologue != null && (
          <CutscenePlayer
            grade={1}
            chapter={props.prologue}
            castNames={props.castNames}
            beatArt={props.beatArt}
            canSkip={process.env.NODE_ENV !== "production"}
            onClose={closePrologue}
          />
        )}
      </div>
    </main>
  );
}
