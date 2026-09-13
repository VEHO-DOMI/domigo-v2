/** Local painted-story progress, separate from account names and learning scores.
 * The app supplies a stable account scope and the canonical allowed classmates.
 * Storage failure is non-fatal; this module makes no network or database writes. */
export interface PaintStoryProfile {
  version: 1;
  displayName: string;
  /** Exact story editions read to the end, not a permanently true flag. */
  readPrologueVersions: string[];
  rescuedClassmateIds: string[];
  /** Local discovery survives chapter changes; older v1 saves default to false. */
  classPhotoFound: boolean;
}
export interface PaintProfileStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export interface PaintProfileContext {
  /** Required stable account key; anonymous callers must supply their own explicit scope. */
  playerKey: string;
  allowedClassmateIds: readonly string[];
  /** undefined uses browser storage, null disables persistence. */
  storage?: PaintProfileStorage | null;
}
export const PAINT_NAME_MAX_CODEPOINTS = 32;
const MAX_CLASSMATES = 15;
const MAX_PROLOGUE_EDITIONS = 16;
const empty = (): PaintStoryProfile => ({ version: 1, displayName: "", readPrologueVersions: [], rescuedClassmateIds: [], classPhotoFound: false });

/** Preserve ordinary Unicode names, normalize accents, remove invisible controls
 * and collapse whitespace. This never renames the signed-in account. */
export function cleanPaintDisplayName(value: unknown): string {
  if (typeof value !== "string") return "";
  const clean = value.normalize("NFC").replace(/[\p{Cc}\p{Cf}]/gu, " ").replace(/\s+/gu, " ").trim();
  return Array.from(clean).slice(0, PAINT_NAME_MAX_CODEPOINTS).join("").trim();
}
const profileKey = (playerKey: string): string | null =>
  typeof playerKey === "string" && playerKey.trim() !== "" && playerKey.length <= 256
    ? `domigo:paint-story:v1:${encodeURIComponent(playerKey)}` : null;
const storageFor = (ctx: PaintProfileContext): PaintProfileStorage | null => {
  if (ctx.storage !== undefined) return ctx.storage;
  try { return typeof window === "undefined" ? null : window.localStorage; } catch { return null; }
};
const validEdition = (value: unknown): value is string =>
  typeof value === "string" && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/.test(value);
const distinct = (value: unknown, accept: (id: unknown) => id is string, max: number): string[] =>
  Array.isArray(value) ? [...new Set(value.filter(accept))].slice(0, max) : [];
function sanitize(value: unknown, allowed: readonly string[]): PaintStoryProfile {
  if (typeof value !== "object" || value === null || !("version" in value) || value.version !== 1) return empty();
  const v = value as Partial<PaintStoryProfile>;
  const ids = new Set(allowed);
  return {
    version: 1,
    displayName: cleanPaintDisplayName(v.displayName),
    classPhotoFound: v.classPhotoFound === true,
    readPrologueVersions: distinct(v.readPrologueVersions, validEdition, MAX_PROLOGUE_EDITIONS),
    rescuedClassmateIds: distinct(v.rescuedClassmateIds, (id): id is string => typeof id === "string" && ids.has(id), MAX_CLASSMATES),
  };
}
export function readPaintStoryProfile(ctx: PaintProfileContext): PaintStoryProfile {
  try {
    const key = profileKey(ctx.playerKey);
    const raw = key === null ? null : storageFor(ctx)?.getItem(key);
    return raw ? sanitize(JSON.parse(raw), ctx.allowedClassmateIds) : empty();
  } catch { return empty(); }
}
/** Returns the sanitized state even when storage is blocked; the caller can keep
 * it in React state for this run. `persisted` distinguishes that from a durable save. */
export function savePaintStoryProfile(ctx: PaintProfileContext, profile: PaintStoryProfile): { profile: PaintStoryProfile; persisted: boolean } {
  const next = sanitize(profile, ctx.allowedClassmateIds);
  try {
    const key = profileKey(ctx.playerKey);
    const storage = storageFor(ctx);
    if (key === null || storage === null) return { profile: next, persisted: false };
    storage.setItem(key, JSON.stringify(next));
    return { profile: next, persisted: true };
  } catch { return { profile: next, persisted: false }; }
}
export const paintPrologueSeen = (profile: PaintStoryProfile, edition: string): boolean =>
  validEdition(edition) && profile.readPrologueVersions.includes(edition);
export function withPaintPrologueRead(profile: PaintStoryProfile, edition: string): PaintStoryProfile {
  if (!validEdition(edition)) return profile;
  return { ...profile, readPrologueVersions: [...new Set([edition, ...profile.readPrologueVersions])].slice(0, MAX_PROLOGUE_EDITIONS) };
}
export function withPaintClassmateRescued(profile: PaintStoryProfile, id: string, allowedIds: readonly string[]): PaintStoryProfile {
  if (!allowedIds.includes(id)) return profile;
  return { ...profile, rescuedClassmateIds: [...new Set([...profile.rescuedClassmateIds, id])].slice(0, MAX_CLASSMATES) };
}

/** Call once at the app's new-run boundary, never on a retry or phase remount.
 * If crypto is unavailable the caller can retain legacy deterministic behaviour.
 * An explicit recorded seed bypasses this function when replaying evidence. */
export function createPaintRunSeed(cryptoSource: Pick<Crypto, "getRandomValues"> | null | undefined = globalThis.crypto): string | undefined {
  if (!cryptoSource) return undefined;
  try {
    const bytes = cryptoSource.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  } catch { return undefined; }
}
