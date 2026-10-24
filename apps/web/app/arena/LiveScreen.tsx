"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LiveLobby, LiveView } from "@/lib/arena/live-server";
import { createLivePoll, LivePollError } from "@/lib/arena/live-poll";
import { liveCopy, liveMessage } from "@/lib/arena/live-copy";
import { useTrainerLanguage } from "@/lib/trainer/preferences";
import { exampleLive } from "@/lib/arena/live-example";
interface Data {
    room?: LiveView;
    lobby?: LiveLobby;
    chapters?: {
        key: string;
        chapter: number;
    }[];
}
export interface LiveScreenProps {
    grade: number;
    preview: boolean;
    ownerId: string | null;
    id?: string;
    classId?: string;
    enabled: boolean;
}
export default function LiveScreen({ grade, preview, ownerId, id, classId, enabled }: LiveScreenProps) {
    const language = useTrainerLanguage(grade), c = liveCopy(language), router = useRouter();
    const teacher = !!classId;
    const [data, setData] = useState<Data>(() => preview ? { room: exampleLive(grade, teacher) } : {});
    const [error, setError] = useState(""), [busy, setBusy] = useState(false), [stopped, setStopped] = useState(false);
    const [units, setUnits] = useState<string[]>([]), [mode, setMode] = useState<"translation" | "definition" | "context">("translation"), [count, setCount] = useState<5 | 10 | 15>(5), [code, setCode] = useState("");
    const [draft, setDraft] = useState({ round: -1, value: "" }), [submitted, setSubmitted] = useState<number | null>(null), [closedRound, setClosedRound] = useState<number | null>(null), [tick, setTick] = useState(0);
    const inFlight = useRef(false), refresh = useRef<() => void>(() => { }), receivedAt = useRef(0), inviteSeenAt = useRef(0), mounted = useRef(false), writeController = useRef<AbortController | null>(null);
    const room = data.room;
    const text = draft.round === room?.round ? draft.value : "";
    const suffix = preview ? `?jahrgang=${grade}` : "";
    const back = teacher ? `/admin/classes/${classId}` : `/arena${suffix}`;
    const roomUrl = (roomId: string) => teacher ? `/admin/classes/${classId}/quiz?room=${roomId}` : `/arena/live/${roomId}`;
    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; writeController.current?.abort(); };
    }, []);
    useEffect(() => {
        if (preview || !enabled)
            return;
        const query = new URLSearchParams({ ...(id ? { id } : {}), ...(classId ? { classId } : {}) });
        const poll = createLivePoll<Data>({
            visible: () => document.visibilityState !== "hidden",
            load: async (signal) => {
                const response = await fetch(`/api/arena/live?${query}`, { signal, cache: "no-store" });
                const result = await response.json();
                if (!response.ok || !result.ok)
                    throw new LivePollError([400, 401, 403, 404, 410, 503].includes(response.status));
                return { value: result, done: ["complete", "cancelled"].includes(result.room?.phase) };
            },
            onValue: value => { receivedAt.current = Date.now(); if (value.room?.invited && !inviteSeenAt.current)
                inviteSeenAt.current = Date.now(); setData(value); setError(""); },
            onError: terminal => { setError("live_unavailable"); setStopped(terminal); if (terminal)
                setData({}); },
        });
        refresh.current = poll.wake;
        poll.start();
        document.addEventListener("visibilitychange", poll.wake);
        window.addEventListener("focus", poll.wake);
        return () => { poll.stop(); document.removeEventListener("visibilitychange", poll.wake); window.removeEventListener("focus", poll.wake); };
    }, [id, classId, preview, enabled]);
    const phase = room?.phase;
    useEffect(() => {
        if (!phase || preview || !["pending", "countdown", "active"].includes(phase))
            return;
        const timer = setInterval(() => setTick(value => value + 1), 200);
        return () => clearInterval(timer);
    }, [phase, preview]); // local display only; the server decides the deadline
    void tick;
    const serverNow = room ? room.serverNow + (receivedAt.current ? Date.now() - receivedAt.current : 0) : 0;
    const serverRemaining = room ? Math.max(0, Math.ceil(((room.phase === "pending" ? room.phaseAt + 30000 : room.phase === "active" ? room.phaseAt + 15000 : room.phaseAt) - serverNow) / 1000)) : 0;
    const remaining = room?.invited && inviteSeenAt.current ? Math.min(serverRemaining, Math.max(0, Math.ceil((inviteSeenAt.current + 25000 - Date.now()) / 1000))) : serverRemaining;
    const me = room?.players.find(p => p.me), other = room?.players.find(p => !p.me);
    const outcome = room?.kind === "battle" && room.phase === "complete" && me && other
        ? me.score > other.score ? `🏆 ${c.victory}` : me.score < other.score ? `💪 ${c.defeat}` : `🤝 ${c.draw}` : c.complete;
    async function post(path: string, body: unknown, answerRound?: number) {
        if (preview || !enabled || stopped || inFlight.current || !ownerId)
            return;
        inFlight.current = true;
        setBusy(true);
        setError("");
        const controller = new AbortController();
        writeController.current = controller;
        const timeout = setTimeout(() => controller.abort(), 10000);
        try {
            const response = await fetch(path, { method: "POST", signal: controller.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const result = await response.json();
            if (!mounted.current)
                return;
            if (!response.ok || !result.ok) {
                setError(result.error ?? "live_unavailable");
                if (answerRound !== undefined && [409, 410].includes(response.status))
                    setClosedRound(answerRound);
                refresh.current();
                return;
            }
            if (answerRound !== undefined) {
                setSubmitted(answerRound);
                setDraft({ round: -1, value: "" });
            }
            if (result.id)
                router.push(roomUrl(result.id));
            else
                refresh.current();
        }
        catch {
            if (mounted.current) {
                setError("live_unavailable");
                refresh.current();
            }
        }
        finally {
            clearTimeout(timeout);
            if (mounted.current) {
                inFlight.current = false;
                setBusy(false);
            }
        }
    }
    function action(action: string) { void post("/api/arena/live", { action, id: room?.id, ...(classId ? { classId } : {}) }); }
    function create(peer?: number) {
        if (!units.length) {
            setError("selection");
            return;
        }
        void post("/api/arena/live", { action: "create", ...(classId ? { classId } : {}), selection: { kind: teacher ? "quiz" : "battle", mode, units, count: teacher ? count : 5, ...(peer ? { peer, rosterVersion: data.lobby?.rosterVersion } : {}) } });
    }
    function answer(value: string) {
        if (!room || room.phase !== "active" || room.answered || submitted === room.round || closedRound === room.round || teacher || remaining <= 0)
            return;
        void post("/api/attempts", { ownerId, clientAttemptId: crypto.randomUUID(), mode: `${room.kind === "battle" ? "live" : "quiz"}:${room.id}`, input: { kind: room.kind === "battle" ? "vocab" : "choice", value }, context: { roomId: room.id, round: room.round } }, room.round);
    }
    const answered = room?.answered || submitted === room?.round;
    return <main className="og-screen arena-screen live-screen" lang={language}>
    <div className="arena-heading"><Link className="og-back" href={back}>← {c.back}</Link><h1>{teacher || room?.kind === "quiz" ? c.quiz : c.title}</h1></div>
    {preview && <p className="arena-notice">{c.preview}</p>}
    {!enabled && !preview ? <p className="arena-notice" role="status">{c.unavailable}</p> : <>
      {error && <div className="arena-notice" role="alert">{error === "selection" ? c.select : liveMessage(error, language)}{stopped && <button className="arena-text-button" type="button" onClick={() => window.location.reload()}>{c.retry}</button>}</div>}
      {!data.lobby && !room && !error && <p role="status">{c.loading}</p>}
      {data.lobby && !id && <>
        <section className="arena-picker"><h2>{teacher ? c.quiz : c.title}</h2><p>{teacher ? c.quizRules : c.rules}</p>
          <label className="live-field">{c.mode}<select value={mode} onChange={e => setMode(e.target.value as typeof mode)}>{(["translation", "definition", "context"] as const).map(key => <option value={key} key={key}>{c[key]}</option>)}</select></label>
          {teacher && <label className="live-field">{c.count}<select value={count} onChange={e => setCount(Number(e.target.value) as 5 | 10 | 15)}>{[5, 10, 15].map(n => <option key={n}>{n}</option>)}</select></label>}
          <fieldset className="live-chapters"><legend>{c.choose}</legend><div className="arena-chapter-grid">{data.chapters?.map(chapter => <button className="arena-chapter" type="button" aria-pressed={units.includes(chapter.key)} key={chapter.key} onClick={() => setUnits(current => current.includes(chapter.key) ? current.filter(key => key !== chapter.key) : [...current, chapter.key])}>Chapter {chapter.chapter}</button>)}</div></fieldset>
          {teacher ? <button className="og-primary" type="button" disabled={busy || !units.length} onClick={() => create()}>{c.create}</button> : <><h2>{c.peer}</h2><p>{c.peerHint}</p>{!data.lobby.peers.length && <p>{c.noPeers}</p>}{data.lobby.peers.map(peer => <button className="arena-peer" type="button" key={peer.number} disabled={busy || !units.length} onClick={() => create(peer.number)}><span>{peer.name}</span><span>{c.invite}</span></button>)}</>}
        </section>
        {!teacher && <form className="arena-picker" onSubmit={event => { event.preventDefault(); void post("/api/arena/live", { action: "join", code: code.trim().toUpperCase() }); }}><label className="live-field">{c.code}<input value={code} onChange={e => setCode(e.target.value.toUpperCase())} maxLength={6} autoComplete="off" autoCapitalize="characters" required pattern="[A-Z2-9]{6}"/></label><button type="submit" className="og-primary" disabled={busy || code.length !== 6}>{c.join}</button></form>}
        <section className="arena-list"><h2>{c.rooms}</h2>{!data.lobby.rooms.length && <p>{c.empty}</p>}{data.lobby.rooms.map(open => <Link className="arena-duel-card" key={open.id} href={roomUrl(open.id)}><strong>{open.kind === "quiz" ? c.quiz : `${c.title}${open.opponent ? ` · ${open.opponent}` : ""}`}</strong><p>{open.invited ? c.accept : c.waiting}</p></Link>)}</section>
      </>}
      {room && <>
        <p className="arena-muted">{room.kind === "quiz" ? c.quizRules : c.rules}</p>
        {room.phase === "pending" && <section className="arena-picker"><p>{room.invited ? c.invitation : c.pending} {remaining} {c.seconds}</p>{room.invited && <div className="live-actions"><button type="button" className="og-primary" disabled={busy || preview || remaining <= 0} onClick={() => action("accept")}>{c.accept}</button><button type="button" className="arena-chapter" disabled={busy || preview} onClick={() => action("decline")}>{c.decline}</button></div>}</section>}
        {room.phase === "lobby" && <section className="arena-picker">{room.code && <p className="live-code">{c.code}: <strong>{room.code}</strong></p>}<p>{c.waiting}</p>{room.canStart && <button className="og-primary" type="button" disabled={busy || preview} onClick={() => action("start")}>{c.start}</button>}</section>}
        {["countdown", "active"].includes(room.phase) && <section className="arena-question"><h2>{room.kind === "quiz" ? c.question : c.round} {room.round + 1}/{room.total}{room.question && ` · Chapter ${room.question.chapter}`}</h2><p className="live-clock">{room.phase === "countdown" ? c.ready : c.seconds}: {remaining}</p>
          {answered ? <p role="status">{c.saved}</p> : closedRound === room.round ? <p role="status">{c.closedQuestion}</p> : room.question && <><p className="arena-muted">{c[room.mode]}</p><p className="arena-prompt">{room.question.prompt}</p>{teacher && room.kind === "quiz" && <div className="arena-options" role="list">{room.question.options.map(option => <div className="arena-option" role="listitem" key={option}>{option}</div>)}</div>}{!teacher && (room.kind === "quiz" ? <div className="arena-options">{room.question.options.map(option => <button className="arena-option" type="button" key={option} disabled={busy || preview || room.phase !== "active" || remaining <= 0} onClick={() => answer(option)}>{option}</button>)}</div> : <form className="live-answer" onSubmit={event => { event.preventDefault(); answer(text); }}><label className="live-field">{c.answer}<input key={room.round} value={text} onChange={e => setDraft({ round: room.round, value: e.target.value })} maxLength={300} autoComplete="off" spellCheck={false} disabled={busy || preview || room.phase !== "active" || remaining <= 0}/></label><button className="og-primary" type="submit" disabled={busy || preview || !text.trim() || room.phase !== "active" || remaining <= 0}>{c.send}</button></form>)}</>}
          <p className="arena-muted">{room.answerCount}/{room.players.length}</p>
        </section>}
        {room.phase === "cancelled" ? <p className="arena-notice" role="status">{c.cancelled}</p> : <section className="arena-scoreboard"><h2>{room.phase === "complete" ? outcome : room.phase === "result" ? c.result : c.standing}</h2><ol className="live-ranking">{[...room.players].sort((a, b) => b.score - a.score || a.seat - b.seat).map(player => <li key={player.seat}><span>{player.name}{player.me ? ` (${c.me})` : ""}</span><strong>{player.score}</strong>{player.correct !== null && <span aria-label={player.correct ? c.correct : c.wrong}>{player.correct ? "✓" : "×"}</span>}</li>)}</ol><p className="arena-muted">{room.kind === "quiz" ? c.points : c.wins}</p>{!teacher && <p>+{room.xp} {c.xp}</p>}</section>}
        {room.canNext && <button type="button" className="og-primary" disabled={busy || preview} onClick={() => action("next")}>{room.round + 1 === room.total ? c.finish : c.next}</button>}
        {room.canClose && <button type="button" className="arena-text-button" disabled={busy || preview} onClick={() => action("close")}>{c.close}</button>}
      </>}
    </>}
  </main>;
}
