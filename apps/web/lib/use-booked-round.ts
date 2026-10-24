"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Tier } from "@domigo/engine";
import type { AttemptResult } from "./attempt-outbox.ts";
import { useOutboxFlush } from "@/lib/useOutboxFlush";

/** Points belong to a mounted round and a server booking, not local grading.
 * The parent key binds owner, preview, mode, content and Vienna day. */
export function useBookedRound(preview: boolean, ownerId: string | null) {
  const [results, setResults] = useState<Array<{ id: string; tier: Tier; xp: number }>>([]);
  const [streak, setStreak] = useState<number | null>(null);
  const pending = useRef(new Set<string>());
  const submitted = useRef(false);
  useEffect(() => { const owned = pending.current; return () => { owned.clear(); }; }, []);
  const receive = useCallback((id: string, reply: AttemptResult) => {
    const receipt = reply.receipt;
    if (preview || !reply.ok || reply.queued || !receipt || !pending.current.delete(id)) return;
    setResults(old => old.map(row => row.id === id ? { ...row, tier: receipt.tier, xp: receipt.xpAwarded } : row));
    if (typeof reply.streak === "number") setStreak(reply.streak);
  }, [preview]);
  useOutboxFlush(!preview, ownerId, receive);
  const begin = (tier: Tier): string | null => {
    if (submitted.current) return null;
    submitted.current = true;
    const id = crypto.randomUUID(); pending.current.add(id);
    setResults(old => [...old, { id, tier, xp: 0 }]);
    return id;
  };
  return { results, streak, begin, receive, nextQuestion: () => { submitted.current = false; } };
}
