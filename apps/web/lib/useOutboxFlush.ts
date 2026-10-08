"use client";
import { useEffect } from "react";
import { bindOutboxOwner, flushOutbox, subscribeOutboxReplies, type OutboxReplyListener } from "./attempt-outbox.ts";

export interface OnlineTarget {
  addEventListener(type: "online", listener: () => void): void;
  removeEventListener(type: "online", listener: () => void): void;
}

/** A new page invalidates old drains, including A → preview → A transitions. */
export function startOutboxFlush(
  enabled: boolean,
  ownerId: string | null,
  onReply?: OutboxReplyListener,
  flush: (ownerId: string | null) => Promise<unknown> = flushOutbox,
  target: OnlineTarget = window,
): () => void {
  const owner = enabled ? ownerId : null;
  const release = bindOutboxOwner(owner);
  if (!owner) return release;
  const unsubscribe = onReply ? subscribeOutboxReplies(owner, onReply) : undefined;
  const onOnline = (): void => { void flush(owner); };
  onOnline();
  target.addEventListener("online", onOnline);
  return () => { unsubscribe?.(); release(); target.removeEventListener("online", onOnline); };
}

/** The server's owner and preview flag must both participate in the effect lifetime. */
export function useOutboxFlush(enabled: boolean, ownerId: string | null, onReply?: OutboxReplyListener): void {
  useEffect(() => startOutboxFlush(enabled, ownerId, onReply), [enabled, ownerId, onReply]);
}
