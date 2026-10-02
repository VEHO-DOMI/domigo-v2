"use client";
import { useEffect } from "react";
import { flushOutbox } from "./attempt-outbox.ts";

/** The slice of `window` the flush needs — injectable so the switch is testable without a DOM. */
export interface OnlineTarget {
  addEventListener(type: "online", listener: () => void): void;
  removeEventListener(type: "online", listener: () => void): void;
}

/**
 * The effect body of `useOutboxFlush`, pure enough for `node --test`
 * (lib/useOutboxFlush.test.ts): drain once, then on every reconnect. Returns
 * the cleanup, or nothing when `enabled` is false — the teacher preview
 * (cgo-047, lib/preview-attempt.ts): a teacher's flush would meet a 401 and DROP
 * the queued answers of the child who used this device before.
 */
export function startOutboxFlush(
  enabled: boolean,
  flush: () => Promise<unknown> = flushOutbox,
  target: OnlineTarget = window,
): (() => void) | undefined {
  if (!enabled) return undefined;
  void flush();
  const onOnline = (): void => {
    void flush();
  };
  target.addEventListener("online", onOnline);
  return () => target.removeEventListener("online", onOnline);
}

/**
 * Drain the offline attempt outbox on mount and whenever the browser reconnects.
 * `enabled: false` is the teacher preview; a hook cannot be called conditionally,
 * hence the switch instead of a skipped call.
 */
export function useOutboxFlush(enabled: boolean = true): void {
  useEffect(() => startOutboxFlush(enabled), [enabled]);
}
