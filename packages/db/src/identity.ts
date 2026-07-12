/**
 * P-1a · Pure identity helpers (DB-free, unit-tested) for the v2-native identity
 * foundation. These encode two things as testable pure functions so the auth
 * layer (auth.ts) and the future teacher-CRUD layer stay thin:
 *   1. `pickIdentity` — the ordered dual-read precedence (v2-native wins, then
 *      the v1 mirror, then null). Made explicit so the "v2 first" rule is a
 *      single tested primitive, not an ad-hoc `??` scattered across queries.
 *   2. invite-code minting — a 6-char code from an unambiguous alphabet, plus a
 *      collision-avoiding allocator. Pure (RNG injectable) so it is deterministic
 *      under test; the DB-touching allocator that feeds it the "taken" set lives
 *      in auth.ts (`allocateClassCode`).
 */

/**
 * Ordered dual-read precedence: the v2-native row wins, else the v1 mirror row,
 * else null. Uses `??` (not `||`) so a falsy-but-present value (e.g. grade `0`,
 * empty string) is still honored rather than skipped.
 */
export function pickIdentity<T>(v2Row: T | null | undefined, v1Row: T | null | undefined): T | null {
  return v2Row ?? v1Row ?? null;
}

/**
 * Invite-code alphabet: uppercase, with visually ambiguous glyphs removed
 * (no 0/O, no 1/I/L) so a code read off a screen or whiteboard can't be
 * mistyped. 31 characters.
 */
export const INVITE_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Length of a generated invite code. */
export const INVITE_CODE_LENGTH = 6;

/**
 * A single random 6-char invite code from the unambiguous alphabet. `rand`
 * defaults to `Math.random` but is injectable for deterministic tests; any
 * value in [0, 1] maps to a valid in-range index (the `Math.min` clamps the
 * `rand() === 1` edge so we never index past the alphabet).
 */
export function generateInviteCode(rand: () => number = Math.random): string {
  let code = "";
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    const idx = Math.min(INVITE_CODE_ALPHABET.length - 1, Math.floor(rand() * INVITE_CODE_ALPHABET.length));
    code += INVITE_CODE_ALPHABET[idx];
  }
  return code;
}

/**
 * Mint an invite code NOT already present in `taken`. Retries on collision;
 * after 50 consecutive failures it throws (defensive — with a 31^6 ≈ 887M code
 * space this is statistically impossible unless `taken` is degenerate, so a
 * throw means a bug, not bad luck). Pure: pass a deterministic `rand` to test.
 */
export function nextInviteCode(taken: ReadonlySet<string>, rand: () => number = Math.random): string {
  for (let tries = 0; tries < 50; tries++) {
    const code = generateInviteCode(rand);
    if (!taken.has(code)) return code;
  }
  throw new Error("nextInviteCode: exhausted 50 attempts finding a free invite code");
}
