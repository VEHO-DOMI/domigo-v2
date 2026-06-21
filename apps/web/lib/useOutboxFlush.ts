"use client";
import { useEffect } from "react";
import { flushOutbox } from "./attempt-outbox";

/** Drain the offline attempt outbox on mount and whenever the browser reconnects. */
export function useOutboxFlush(): void {
  useEffect(() => {
    void flushOutbox();
    const onOnline = (): void => {
      void flushOutbox();
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);
}
