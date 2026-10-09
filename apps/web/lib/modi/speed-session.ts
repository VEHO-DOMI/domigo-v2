import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const SPEED_DURATION_MS = 60_000;
export interface SpeedSession { sessionStartedAt: number; nonce: string; signature: string }
function signingKey(): string {
  const key = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!key) throw new Error("Speed signing unavailable");
  return key;
}
function signature(ownerId: string, startedAt: number, nonce: string, key: string): string {
  return createHmac("sha256", key).update(JSON.stringify(["speed", ownerId, startedAt, nonce])).digest("hex");
}
export function startSpeedSession(ownerId: string, now = Date.now(), key = signingKey()): SpeedSession {
  const nonce = randomUUID();
  return { sessionStartedAt: now, nonce, signature: signature(ownerId, now, nonce, key) };
}
/** Reject before grading/storage, using server time, including offline replays. */
export function speedSessionValid(context: unknown, ownerId: string, now = Date.now(), key?: string): boolean {
  if (!context || typeof context !== "object") return false;
  const token = (context as { speedSession?: Partial<SpeedSession> }).speedSession;
  if (!token || typeof token.sessionStartedAt !== "number" || !Number.isSafeInteger(token.sessionStartedAt)
    || typeof token.nonce !== "string" || !/^[0-9a-f-]{36}$/.test(token.nonce)
    || typeof token.signature !== "string" || !/^[0-9a-f]{64}$/.test(token.signature)) return false;
  if (now < token.sessionStartedAt || now >= token.sessionStartedAt + SPEED_DURATION_MS) return false;
  try {
    return timingSafeEqual(Buffer.from(token.signature, "hex"), Buffer.from(signature(ownerId, token.sessionStartedAt, token.nonce, key ?? signingKey()), "hex"));
  } catch { return false; }
}
