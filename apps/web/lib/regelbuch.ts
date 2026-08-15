/**
 * regelbuch — DAS REGELBUCH, the durable half of the Regel-Seiten (doc 45 E3:
 * „im Spiel sammeln UND später im Spiel-Menü als Referenz-/Lernseiten
 * wiederauffindbar — it's twofold").
 *
 * WHERE THIS LIVES, AND WHY IT IS NOT THE SERVER (declared, R5-W2 · I1).
 * The obvious shortcut is `game_saves`, and it is closed by law: that column is
 * documented COSMETIC-ONLY and wipeable (packages/db/src/schema.ts), while a
 * collected rule page is a possession. The right server home is a column of its
 * own on the `hint_sparks` pattern — server-authoritative, additive migration —
 * and that is a migration Koki applies by hand in the Neon editor, which
 * deserves its own small PR rather than riding in on a card packet.
 *
 * Nothing is lost by waiting: the painted book is TEACHER-PREVIEW ONLY in
 * production (apps/web/app/(game)/play/[grade]/buch/page.tsx), so no child has a
 * collection to lose today. What matters is that the seam exists and is narrow:
 * `game-paint` stays network-free (its proof tapes depend on that), the game
 * reports what happened through one callback, and swapping this module's two
 * functions for a fetch is the whole of the server move.
 *
 * The storage idiom is the house one — the same `domigo:` key convention and
 * the same „quota/private mode cannot break the game" posture the four other
 * game clients use for their saves.
 */

/** One rule page as the library keeps it. Mirrors the game's TipPayload minus
 *  the entity id, plus where it was found and how many the chapter holds. */
export interface RegelbuchEntry {
  chapter: string;
  topicDe: string;
  /** R5-W4 · I2 — the Notion, so the hub reads the same four steps as the card. */
  erklaerungDe: string;
  merksatzDe: string;
  schluesselDe: string;
  /** R5-W4 · I2 — 2–4 English lines, ours, grounded in the unit's vocabulary. */
  beispieleEn: string[];
  /** ★ HOW MANY PAGES THE CHAPTER HOLDS, banked with the page rather than looked
   *  up by the board (R5-W4 · I2).
   *
   *  The hub has to draw a torn stub for every page still missing, so it needs a
   *  total — and the board is a client component with no access to the level
   *  file. The alternative was a literal („ch01 has 5"), and the house law is
   *  that a count comes from the level or it does not exist: the HUD, the score
   *  page and the Auftakt all read `tipsTotal`, and the one place that hard-coded
   *  a number is the bench fixture nobody trusts. So the number travels with the
   *  page, out of `bilanz.tipsTotal`, through the seam that already exists. */
  total: number;
  /** the unit page this rule lives on. Kept, never rendered (Koki, 2026-08-15). */
  belegDe: string;
}

export interface RegelbuchFile {
  /** bumped when the shape changes; an unreadable version is dropped, never
   *  migrated in place — this is a convenience cache, not a record.
   *
   *  v2 (R5-W4 · I2): `beispielEn` → `beispieleEn`, `erklaerungDe` and `total`
   *  arrive, the three J1-D fields leave. A v1 book is dropped rather than
   *  upgraded, and nothing is lost by that: the painted book is teacher-preview
   *  only in production, so no child has a collection today. */
  v: 2;
  entries: RegelbuchEntry[];
}

const KEY = "domigo:regelbuch:g1";

/** Everything collected so far, oldest first. Never throws: a corrupt or
 *  absent entry reads as „nothing collected yet", which is the honest answer
 *  and keeps a broken cache from breaking a page. */
export const readRegelbuch = (): RegelbuchEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw) as Partial<RegelbuchFile>;
    if (parsed?.v !== 2 || !Array.isArray(parsed.entries)) return [];
    return parsed.entries.filter(
      (e): e is RegelbuchEntry =>
        typeof e?.topicDe === "string" && e.topicDe !== "" && typeof e?.merksatzDe === "string"
        && Array.isArray(e?.beispieleEn),
    );
  } catch {
    return [];
  }
};

// ── the React seam ──────────────────────────────────────────────────────────
// `localStorage` is an EXTERNAL store, so it is read through the API React has
// for exactly that (useSyncExternalStore) rather than through an effect that
// calls setState. Two reasons, and the second is the one that bites: an effect
// hydrates with one value and repaints with another, and the lint rule that
// caught it („calling setState synchronously within an effect can trigger
// cascading renders") is right on the merits.
//
// The snapshot MUST be reference-stable or React re-renders forever, so the
// parsed list is cached against the raw string it came from.
let snapRaw: string | null = null;
let snapVal: RegelbuchEntry[] = [];
const EMPTY: RegelbuchEntry[] = [];

export const regelbuchSnapshot = (): RegelbuchEntry[] => {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null = null;
  try { raw = window.localStorage.getItem(KEY); } catch { return EMPTY; }
  if (raw === snapRaw) return snapVal;
  snapRaw = raw;
  snapVal = readRegelbuch();
  return snapVal;
};

/** The server (and the first client paint) sees an empty book — the same value
 *  every time, so hydration cannot disagree with itself. */
export const regelbuchServerSnapshot = (): RegelbuchEntry[] => EMPTY;

/** Another tab writing the book counts as a change here. */
export const subscribeRegelbuch = (onChange: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  const h = (e: StorageEvent): void => { if (e.key === KEY || e.key === null) onChange(); };
  window.addEventListener("storage", h);
  return () => window.removeEventListener("storage", h);
};

/** Put one page in the book. Idempotent on (chapter, topicDe) — the same page
 *  found twice across two runs is one page, and `tip-honesty` already proves a
 *  topic is unique within a chapter. Returns the new list. */
export const rememberRegelSeite = (entry: RegelbuchEntry): RegelbuchEntry[] => {
  const have = readRegelbuch();
  const next = have.some((e) => e.chapter === entry.chapter && e.topicDe === entry.topicDe)
    ? have
    : [...have, entry];
  if (typeof window !== "undefined" && next !== have) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ v: 2, entries: next } satisfies RegelbuchFile));
      snapRaw = null; // this tab wrote it, so its own cache is stale
    } catch {
      /* quota or private mode: the run keeps working, the library just does not grow */
    }
  }
  return next;
};
