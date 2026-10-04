"use client";
import { useEffect } from "react";
import { bindOutboxOwner, flushOutbox } from "./attempt-outbox.ts";

export interface OnlineTarget {
  addEventListener(type: "online", listener: () => void): void;
  removeEventListener(type: "online", listener: () => void): void;
}

/** A new page invalidates old drains, including A → preview → A transitions. */
export function startOutboxFlush(
  enabled: boolean,
  ownerId: string | null,
  flush: (ownerId: string | null) => Promise<unknown> = flushOutbox,
  target: OnlineTarget = window,
): () => void {
  const owner = enabled ? ownerId : null;
  const release = bindOutboxOwner(owner);
  if (!owner) return release;
  const onOnline = (): void => { void flush(owner); };
  onOnline();
  target.addEventListener("online", onOnline);
  return () => { release(); target.removeEventListener("online", onOnline); };
}

/** The server's owner and preview flag must both participate in the effect lifetime. */
export function useOutboxFlush(enabled: boolean, ownerId: string | null): void {
  useEffect(() => startOutboxFlush(enabled, ownerId), [enabled, ownerId]);
}
