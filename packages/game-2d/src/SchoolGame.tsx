"use client";
/* eslint-disable @next/next/no-img-element -- local game art */
import Phaser from "phaser";
import { useEffect, useRef, useState } from "react";
import { bindTypingGuard } from "@domigo/game-feel/typing-guard";
import { feel } from "@domigo/game-feel";
import { schoolArt } from "./school-art.ts";
import { SchoolScene } from "./SchoolScene.ts";
import { SCHOOL_STATIONS, SCHOOL_START, CLUES, availableStation, schoolComplete, validSchoolPosition, type Direction } from "./school.ts";
import type { SchoolCard, SchoolFeedback, SchoolLine, SchoolView } from "./school-types.ts";
import type { Cell } from "./path.ts";

// Room names are the approved concept's §4, not new narrative copy.
const ROOMS = ["Klassenzimmer", "Aula", "Gang", "Biosaal", "Stadt", "Bibliothek", "Schulhof", "Turnhalle", "Kantine", "Fotowand", "Abstellkammer", "Stilles Zimmer", "Schulhof im Regen", "Sportplatz", "Buchecke"];
const ROOM_SLOTS = [10, 12, 11, 0, 4, 2, 7, 13, 8, 1, 6, 9, 14, 5, 3];
// Physical room numbers follow reading order; the unit index still selects
// the classroom. Keep labels over their painted rooms on the unchanged map.
const MAP_ROOMS = ROOMS.map((name, unit) => ({ name, unit, slot: ROOM_SLOTS[unit]! })).sort((a, b) => a.slot - b.slot);
type Draft = { value: string; placed: number[]; attemptId: string };
type Local = { v: 1; pos: Cell; seen: boolean; drafts: Record<string, Draft>; preview?: SchoolView };
function Lines({ lines }: { lines: SchoolLine[] }) { return <>{lines.map((l, i) => <p key={i} lang={l.en ? "en" : "de"}>{l.speaker && <strong>{l.speaker}<br /></strong>}{l.de ?? l.en}</p>)}</>; }

export function SchoolGame({ initial, playerKey }: { initial: SchoolView; playerKey: string }) {
  const storageKey = `domigo:school:69f40bc6:${encodeURIComponent(playerKey)}`;
  const [view, setView] = useState(initial);
  const [screen, setScreen] = useState<"hub" | "room" | "summary">("hub");
  const [intro, setIntro] = useState(false);
  const [journal, setJournal] = useState(false);
  const [card, setCard] = useState<SchoolCard | null>(null);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<SchoolScene | null>(null);
  const latest = useRef(view);
  latest.current = view;
  const local = useRef<Local>({ v: 1, pos: SCHOOL_START, seen: false, drafts: {} });
  const persist = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(local.current)); } catch { /* in-memory play still works */ }
  };
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null") as Local | null;
      if (saved?.v === 1) {
        local.current = { v: 1, pos: validSchoolPosition(saved.pos), seen: saved.seen === true, drafts: saved.drafts && typeof saved.drafts === "object" ? saved.drafts : {} };
        // Only teacher preview can resume cosmetic progress. Children's progress
        // always comes from the server attempt ledger in `initial`.
        if (initial.preview && saved.preview?.titleDe === initial.titleDe && Array.isArray(saved.preview.solved)) {
          const solved = saved.preview.solved.filter((s) => initial.cards.some((c) => c.station === s));
          const resumed = { ...initial, solved, recovered: saved.preview.recovered ?? {}, ending: schoolComplete(solved) ? saved.preview.ending : [] };
          local.current.preview = resumed;
          setView(resumed);
        }
      }
    } catch { /* a corrupt cosmetic save starts at the classroom door */ }
    setReady(true);
  }, [storageKey, initial]);
  useEffect(() => {
    if (screen !== "room" || !ready) return;
    const motion = feel().motionOK;
    const s = new SchoolScene({ solved: latest.current.solved, pos: local.current.pos, motion,
      onStation: (id) => setCard(latest.current.cards.find((c) => c.station === id) ?? null),
      onExit: () => setScreen("summary"), onMove: (pos) => { local.current.pos = pos; persist(); } });
    scene.current = s;
    const game = new Phaser.Game({ type: Phaser.AUTO, parent: host.current!, width: 720, height: 528, pixelArt: true,
      backgroundColor: "#272b31", fps: { target: 30 }, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, scene: s });
    const unbind = bindTypingGuard(game);
    s.setPaused(!local.current.seen);
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__school = { tap: (c: number, r: number) => s.tap(c, r), state: () => s.snapshot() };
    }
    return () => { unbind(); game.destroy(true); scene.current = null; delete (window as unknown as Record<string, unknown>).__school; };
    // The scene owns movement; React updates progress and pause state separately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, ready]);
  useEffect(() => { scene.current?.updateSolved(view.solved); }, [view.solved]);
  useEffect(() => { scene.current?.setPaused(intro || journal || card !== null); }, [intro, journal, card]);
  const enter = () => { setIntro(!local.current.seen); setScreen("room"); };
  const closeIntro = () => { local.current.seen = true; persist(); setIntro(false); };
  const accept = (next: SchoolView) => { setView(next); if (next.preview) local.current.preview = next; persist(); };
  const go = (id: string) => { const p = SCHOOL_STATIONS[id]; if (p) scene.current?.tap(p.c, p.r); };
  const clues = CLUES.filter((s) => view.solved.includes(s)).length;
  const complete = schoolComplete(view.solved);
  return <main className="school-game" lang="de">
    <style>{`
      .school-game{max-width:1040px;margin:0 auto;padding:18px 14px 32px;color:#f4ead4;font-family:var(--font-body);background:#202b32;border-radius:18px}
      .school-game *{box-sizing:border-box}.school-game h1{font-family:var(--font-display);font-size:clamp(23px,4vw,36px);margin:8px 0}.school-game h2{margin:8px 0 16px;font-size:24px}
      .school-top{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}.school-game button,.school-game a.school-button{min-height:44px;border:1px solid #c4aa76;background:#f0e2c4;color:#26343b;border-radius:9px;padding:10px 14px;font:inherit;font-weight:650;cursor:pointer;text-decoration:none}.school-game button:disabled{opacity:.55;cursor:default}.school-game button:focus-visible,.school-game a:focus-visible{outline:3px solid #a8c9ff;outline-offset:3px}
      .school-subtle{color:#c8c6bc;font-size:14px}.school-stats{display:flex;gap:20px;flex-wrap:wrap;padding:10px 0}.school-map{position:relative;background:#343f45;min-height:500px;border:1px solid #857255;border-radius:12px;overflow:hidden}.school-map>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.school-rooms{position:relative;display:grid;grid-template-columns:repeat(5,1fr);gap:15px;padding:35px 20px;min-height:500px}.school-rooms button{align-self:center;box-shadow:0 6px 14px #15212bb3}.school-rooms button:disabled{background:#253442e6;color:#d0cfcd;border-color:#7b8195;opacity:.9}.school-stage{position:relative;max-width:900px;margin:auto}.school-canvas{width:100%;aspect-ratio:15/11}.school-canvas canvas{display:block}.school-controls{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:12px 0}.school-locations{display:flex;gap:8px;flex-wrap:wrap;padding-top:12px}.school-locations button{font-size:14px;padding:7px 10px}.school-locations button[data-done=true]{background:#bacba7}.school-modal{position:fixed;inset:0;background:#162129ba;z-index:1000;display:grid;place-items:center;padding:18px;overflow:auto}.school-paper{background:#fff6e3;color:#28333a;border:2px solid #c1a576;border-radius:14px;padding:clamp(18px,4vw,32px);width:min(650px,100%);max-height:90dvh;overflow:auto;box-shadow:0 20px 80px #0008}.school-paper p{line-height:1.55}.school-prompt{font-size:clamp(18px,3vw,25px);line-height:1.5;font-weight:600}.school-options{display:flex;flex-direction:column;gap:10px;margin:18px 0}.school-options button{text-align:left}.school-options button[aria-pressed=true]{background:#c9ddf4;border:2px solid #466b94}.school-answer{width:100%;min-height:48px;border:2px solid #aa9471;border-radius:8px;padding:10px;font:inherit;background:white;color:#26343b}.school-chips{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.school-assembled{min-height:60px;border-bottom:2px solid #bcab8d;padding:10px 0}.school-feedback{padding:12px;background:#e4e9d5;border-radius:9px;margin:12px 0}.school-journal{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.school-journal article{padding:14px;background:#344550;border-radius:8px}.school-preview{display:block;color:#edce96;font-size:12px}.school-door{background:#b6cca5!important}
      @media(max-width:620px){.school-rooms{grid-template-columns:repeat(3,1fr);gap:9px;padding:18px 10px}.school-map,.school-rooms{min-height:540px}.school-rooms button{font-size:12px;padding:7px}.school-journal{grid-template-columns:1fr}.school-game{padding:12px 8px}.school-controls button{padding:9px 12px}.school-stats{gap:12px;font-size:13px}}
      .school-map{min-height:0;aspect-ratio:3/2}.school-map>img{object-fit:contain}.school-rooms{position:absolute;inset:8% 4% 22%;min-height:0;padding:0;grid-template-rows:repeat(3,1fr);gap:10px}.school-rooms button{align-self:end;justify-self:center;font-size:12px;padding:5px 10px;min-height:44px;max-width:95%}.school-rooms button:disabled{background:#253442db}@media(max-width:620px){.school-map{aspect-ratio:auto;min-height:620px}.school-map>img{object-fit:cover;opacity:.75}.school-rooms{inset:12px;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(5,1fr)}.school-rooms button{grid-column:auto!important;grid-row:auto!important;width:100%;align-self:center}}
    `}</style>
    <header className="school-top"><div>{view.preview && <span className="school-preview">Lehrer-Vorschau</span>}<h1>Der Tintengeist geht zur Schule</h1><div className="school-subtle">{view.titleDe}</div></div><a className="school-button" href="/play/2">Alle Räume</a></header>
    <div className="school-stats" aria-live="polite"><span>Spuren {clues}/4</span><span>Freunde {view.solved.includes("alibi") ? 1 : 0}/15</span><span>Zettel {view.solved.includes("zettel") ? 1 : 0}</span></div>

    {screen === "hub" && <section className="school-map" aria-label="Schulhaus"><img src={schoolArt("hub.png")} alt="" /><div className="school-rooms">{MAP_ROOMS.map((room) => <button key={room.unit} type="button" style={{ gridColumn: room.slot % 5 + 1, gridRow: Math.floor(room.slot / 5) + 1 }} disabled={room.unit > 0 || !ready} onClick={enter}>{room.slot + 1} · {room.name}{room.unit > 0 && <><br />Bald</>}</button>)}</div></section>}
    {screen === "room" && <>
      <div className="school-stage"><div className="school-canvas" ref={host} role="img" aria-label="Klassenzimmer" /></div>
      <div className="school-controls" aria-label="Bewegen">{([ ["left", "Links"], ["up", "Hinauf"], ["down", "Hinunter"], ["right", "Rechts"] ] as [Direction,string][]).map(([dir,label]) => <button key={dir} type="button" onClick={() => scene.current?.move(dir)} aria-label={label}>{label}</button>)}<button onClick={() => scene.current?.interact()}>Ansehen</button><button onClick={() => setJournal(true)}>Regelbuch</button><button onClick={() => setScreen("hub")}>Schulhaus</button>{complete && <button className="school-door" onClick={() => scene.current?.tap(SCHOOL_START.c, SCHOOL_START.r)}>Zur Tür</button>}</div>
      <p className="school-subtle">Pfeiltasten zum Gehen. Leertaste zum Ansehen.</p>
      <nav className="school-locations" aria-label="Orte im Klassenzimmer">{view.cards.filter((c) => availableStation(c.station, view.solved)).map((c) => <button key={c.id} onClick={() => go(c.station)} data-done={view.solved.includes(c.station)}>{c.placeDe}</button>)}</nav>
    </>}
    {screen === "summary" && <section><h2>Bilanz</h2><Lines lines={view.ending} /><div className="school-journal">{view.cards.filter((c) => view.recovered[c.station]?.revealEn).map((c) => <article key={c.id}><strong>{c.placeDe}</strong><p lang="en">{view.recovered[c.station]?.revealEn}</p></article>)}</div><div className="school-controls"><button onClick={enter}>Klassenzimmer</button><button onClick={() => setScreen("hub")}>Schulhaus</button></div></section>}
    {intro && <Modal title={view.titleDe} onClose={closeIntro}><Lines lines={view.intro} /><button onClick={closeIntro} autoFocus>Weiter</button></Modal>}
    {journal && <Modal title="Regelbuch" onClose={() => setJournal(false)}>{view.cards.filter((c) => view.recovered[c.station]?.revealEn).map((c) => <article key={c.id}><h3>{c.placeDe}</h3><p lang="en">{view.recovered[c.station]?.revealEn}</p></article>)}<button onClick={() => setJournal(false)} autoFocus>Zurück</button></Modal>}
    {card && <Task key={card.id} card={card} solved={view.solved} draft={local.current.drafts[card.station]} recovered={view.recovered[card.station]} onDraft={(draft) => { local.current.drafts[card.station] = draft; persist(); }} onView={accept} onClose={() => { setCard(null); setNotice(false); }} onNetwork={() => setNotice(true)} />}
    {notice && <div role="status" className="school-subtle">Die Verbindung fehlt. Deine Eingabe bleibt hier.</div>}
  </main>;
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const old = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = old; previous?.focus(); };
  }, []);
  return <div className="school-modal"><div className="school-paper" ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} onKeyDown={(e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Tab") {
      const nodes = Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),[tabindex="0"]') ?? []);
      const first = nodes[0], last = nodes[nodes.length-1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  }}><h2>{title}</h2>{children}</div></div>;
}

function Task({ card, solved, draft, recovered, onDraft, onView, onClose, onNetwork }: {
  card: SchoolCard; solved: string[]; draft?: Draft; recovered?: { after: SchoolLine[]; revealEn: string | null };
  onDraft: (d: Draft) => void; onView: (v: SchoolView) => void; onClose: () => void; onNetwork: () => void;
}) {
  const [value, setValue] = useState(draft?.value ?? "");
  const [placed, setPlaced] = useState<number[]>(draft?.placed ?? []);
  const attempt = useRef(draft?.attemptId ?? crypto.randomUUID());
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SchoolFeedback | null>(null);
  const [failed, setFailed] = useState(false);
  const done = solved.includes(card.station);
  const change = (v: string, p = placed) => { setValue(v); setPlaced(p); setResult(null); setFailed(false); attempt.current = crypto.randomUUID(); onDraft({ value: v, placed: p, attemptId: attempt.current }); };
  const submit = async () => {
    if (busy || !value.trim() || done) return;
    setBusy(true); setFailed(false);
    onDraft({ value, placed, attemptId: attempt.current });
    try {
      const response = await fetch("/api/school", { method: "POST", signal: AbortSignal.timeout(15000), headers: { "Content-Type": "application/json" }, body: JSON.stringify({ station: card.station, value, clientAttemptId: attempt.current, previewSolved: solved }) });
      if (!response.ok) throw new Error("retry");
      const data = await response.json() as { result: SchoolFeedback; view: SchoolView };
      setResult(data.result); onView(data.view);
      // A completed wrong attempt and a transport retry have different IDs.
      attempt.current = crypto.randomUUID();
    } catch { setFailed(true); onNetwork(); }
    finally { setBusy(false); }
  };
  const addChip = (index: number) => { if (card.input.kind !== "chips") return; const p = [...placed, index]; change(p.map((i) => card.input.kind === "chips" ? card.input.chips[i] : "").join(" "), p); };
  return <Modal title={card.placeDe} onClose={onClose}>
    <Lines lines={card.before} /><p>{card.situationDe}</p>
    {card.prompt && <p className="school-prompt" lang="en">{card.prompt}</p>}
    {card.input.kind === "choice" && <div className="school-options">{card.input.options.map((option) => <button lang="en" key={option} disabled={busy || done} aria-pressed={value === option} onClick={() => change(option)}>{option}</button>)}</div>}
    {card.input.kind === "text" && (card.input.blanks > 1 ? <div className="school-options">{Array.from({ length: card.input.blanks }, (_, i) => <label key={i}>{i === 0 ? "Erste Lücke" : "Zweite Lücke"}<input className="school-answer" lang="en" value={value.split("|")[i] ?? ""} onChange={(e) => { const parts = Array.from({ length: card.input.kind === "text" ? card.input.blanks : 1 }, (_, n) => value.split("|")[n] ?? ""); parts[i] = e.target.value; change(parts.join("|")); }} disabled={busy || done} autoCapitalize="off" autoCorrect="off" spellCheck={false} /></label>)}</div> : <textarea className="school-answer" aria-label="Deine Antwort" lang="en" value={value} onChange={(e) => change(e.target.value)} disabled={busy || done} autoCapitalize="off" autoCorrect="off" spellCheck={false} rows={2} />)}
    {card.input.kind === "chips" && <><div className="school-assembled" lang="en" aria-live="polite">{value || "…"}</div><div className="school-chips">{card.input.chips.map((chip, i) => <button key={i} lang="en" disabled={busy || done || placed.includes(i)} onClick={() => addChip(i)}>{chip}</button>)}</div><button disabled={busy || done || placed.length === 0} onClick={() => { const p=placed.slice(0,-1); change(p.map((i) => card.input.kind === "chips" ? card.input.chips[i] : "").join(" "),p); }}>Zurück</button></>}
    {card.glosses.map((g) => <p key={g}>{g}</p>)}
    {result && <div className="school-feedback" role="status">{result.tier === "correct" ? "Geschafft!" : "Noch nicht — versuch es gleich nochmal."}<p>{result.explainDe}</p></div>}
    {done && <><p lang="en">{recovered?.revealEn}</p><Lines lines={recovered?.after ?? []} /></>}
    {failed && <p role="alert">Die Verbindung fehlt. Deine Eingabe bleibt hier.</p>}
    <div className="school-controls">{!done && <button disabled={busy || !value.trim()} onClick={() => void submit()}>{busy ? "…" : failed ? "Nochmal versuchen" : "Prüfen"}</button>}<button onClick={onClose} disabled={busy}>{done ? "Weiter" : "Später"}</button></div>
  </Modal>;
}
