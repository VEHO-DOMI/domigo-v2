// Class invite-code helpers (ported from v1 lib/invite-code.ts).

/** Normalize user input (uppercase, strip spaces + hyphens) before the DB lookup. */
export function normalizeInviteCode(raw: string): string {
  return raw.replace(/[\s-]+/g, "").toUpperCase();
}

/** Insert a hyphen in the middle for readability — "ABC-D2F". */
export function formatInviteCode(code: string): string {
  if (code.length <= 3) return code;
  const mid = Math.floor(code.length / 2);
  return code.slice(0, mid) + "-" + code.slice(mid);
}
