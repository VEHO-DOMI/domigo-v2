import type { PaintAttemptSender } from "./cards/attempt.ts";

export type AttemptReply = Awaited<ReturnType<PaintAttemptSender>>;
export interface AttemptAck {
  total: number;
  lastAward: number;
  revision: number;
  pending: ReadonlySet<string>;
  settled: ReadonlySet<string>;
}

export const emptyAttemptAck = (): AttemptAck => ({
  total: 0, lastAward: 0, revision: 0, pending: new Set(), settled: new Set(),
});

/** Session receipts, never an account balance or a local English score. */
export function acknowledgeAttempt(state: AttemptAck, { clientAttemptId, reply }: {
  clientAttemptId: string; reply: AttemptReply;
}): AttemptAck {
  if (state.settled.has(clientAttemptId)) return state;
  // The real outbox reports durable offline storage as ok:false, queued:true.
  // It is a promise of delivery, not a receipt and never an award.
  if (reply.queued) {
    if (state.pending.has(clientAttemptId)) return state;
    return { ...state, pending: new Set([...state.pending, clientAttemptId]) };
  }
  const points = reply.xpAwarded;
  if (!reply.ok || points === undefined || !Number.isFinite(points) || points < 0) return state;
  const pending = new Set(state.pending);
  pending.delete(clientAttemptId);
  return {
    ...state, pending, settled: new Set([...state.settled, clientAttemptId]),
    total: state.total + points,
    lastAward: points > 0 ? points : state.lastAward,
    revision: state.revision + (points > 0 ? 1 : 0),
  };
}
