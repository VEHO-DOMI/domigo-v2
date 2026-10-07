import type { GameTaskV2 } from "@domigo/content-schema";

/** Raw evidence only. The app owns delivery; the shared server owns tier and XP. */
export interface PaintAttemptBody {
  clientAttemptId: string;
  itemId: string;
  mode: "game:g1";
  input: { kind: "choice"; value: string };
  latencyMs: number;
  hintUsed: boolean;
}

export type PaintAttemptSender = (body: PaintAttemptBody) => Promise<{
  ok: boolean;
  queued: boolean;
  tier?: "correct" | "partial" | "close" | "wrong";
  xpAwarded?: number;
}>;

/** G-1 only: no invented corpus items and no conversion of other card kinds. */
export function paintAttemptBody(
  task: GameTaskV2,
  state: unknown,
  context: { clientAttemptId: string; openedAt: number; now: number; hintUsed: boolean },
): PaintAttemptBody | null {
  if (!task.corpusItem || task.kind !== "choice") return null;
  const picked = (state as { picked?: unknown } | null)?.picked;
  if (typeof picked !== "string" || !task.options.includes(picked)) return null;
  return {
    clientAttemptId: context.clientAttemptId,
    itemId: task.corpusItem,
    mode: "game:g1",
    input: { kind: "choice", value: picked },
    // Wall time since opening, including reading and any reference visit.
    latencyMs: Math.max(0, Math.round(context.now - context.openedAt)),
    hintUsed: context.hintUsed,
  };
}
