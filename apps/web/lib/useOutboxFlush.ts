"use client";
import { useEffect } from "react";
import { flushOutbox } from "./attempt-outbox";

/**
 * Drain the offline attempt outbox on mount and whenever the browser reconnects.
 * `enabled: false` is the teacher preview (cgo-047, lib/preview-attempt.ts): a
 * teacher's flush would meet a 401 and DROP the queued answers of the child who
 * used this device before — so the preview never touches the outbox. A hook
 * cannot be called conditionally, hence the switch instead of a skipped call.
 */
export function useOutboxFlush(enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled) return;
    void flushOutbox();
    const onOnline = (): void => {
      void flushOutbox();
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [enabled]);
}
