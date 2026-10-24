/** cgo-122: result bonuses approved by cgo-120(2), separate from answer XP. */
export const DUEL_WIN_BONUS = 100;
export const DUEL_DRAW_BONUS = 50;
export const DUEL_BONUS_PAIR_WEEK = 2;
export const DUEL_BONUS_USER_DAY = 3;
export const DUEL_BONUS_MIN_CORRECT = 8;
export const DUEL_BONUS_GAP_MS = 24 * 60 * 60 * 1000;
export type DuelBonusXp = 0 | 50 | 100;
/** Stored only on the final round. The closing attempt is the idempotency key;
 * no synthetic learning attempt, extra person identifier or copied counter. */
export interface DuelBonusReceipt {
  version: 1; at: string; attemptId: string; p1: DuelBonusXp; p2: DuelBonusXp;
}
export interface DuelBonusUsage {
  pairWeek: number; p1Day: number; p2Day: number; lastPairAt: Date | null;
}
export function resultBonus(p1Score: number, p2Score: number, usage: DuelBonusUsage, at: Date): Pick<DuelBonusReceipt, "p1" | "p2"> {
  for (const n of [p1Score,p2Score,usage.pairWeek,usage.p1Day,usage.p2Day]) if (!Number.isSafeInteger(n) || n < 0) throw Error("invalid_duel_bonus_usage");
  if (p1Score > 15 || p2Score > 15 || !Number.isFinite(at.getTime()) || usage.lastPairAt && !Number.isFinite(usage.lastPairAt.getTime())) throw Error("invalid_duel_bonus_usage");
  if (p1Score < DUEL_BONUS_MIN_CORRECT || p2Score < DUEL_BONUS_MIN_CORRECT || usage.pairWeek >= DUEL_BONUS_PAIR_WEEK
    || usage.lastPairAt && at.getTime() - usage.lastPairAt.getTime() < DUEL_BONUS_GAP_MS) return {p1:0,p2:0};
  const first = p1Score > p2Score ? DUEL_WIN_BONUS : p1Score === p2Score ? DUEL_DRAW_BONUS : 0;
  const second = p2Score > p1Score ? DUEL_WIN_BONUS : p2Score === p1Score ? DUEL_DRAW_BONUS : 0;
  return {p1:usage.p1Day < DUEL_BONUS_USER_DAY ? first : 0,p2:usage.p2Day < DUEL_BONUS_USER_DAY ? second : 0};
}
export function bonusReceipt(rounds: readonly {bonus?: DuelBonusReceipt}[]): DuelBonusReceipt | null {
  const b = rounds.length === 5 ? rounds[4]?.bonus : undefined;
  if (!b) return null;
  if (b.version !== 1 || typeof b.attemptId !== "string" || !b.attemptId || typeof b.at !== "string" || !Number.isFinite(Date.parse(b.at))
    || !["0,0","100,0","0,100","50,50","50,0","0,50"].includes(`${b.p1},${b.p2}`)) throw Error("invalid_duel_bonus_receipt");
  return b;
}
