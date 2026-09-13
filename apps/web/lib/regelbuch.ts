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

import type { PaintLevel } from "@domigo/game-paint/level";

/** One rule page as the library keeps it, plus its chapter and page count. */
export interface RegelbuchEntry {
  chapter: string;
  /** Stable level entity id. Optional so existing v3 collections still load. */
  ruleId?: string;
  topicDe: string;
  /** R5-W4 · I2 — the Notion, so the hub reads the same four steps as the card. */
  erklaerungDe: string;
  merksatzDe: string;
  schluesselDe: string;
  /** R5-W4 · I2 — 2–4 English lines, ours, grounded in the unit's vocabulary. */
  beispieleEn: string[];
  /** R5-W9 · N1 — die englischen Formen, die die Seite lehrt, und damit die
   *  Stellen, die im Beispiel markiert werden. */
  lehrtEn: string[];
  /** R5-W9 · N1 — die Lese-Form der Beispiele (wandel · gegensatz · dialog ·
   *  einzeln). Ohne sie zeichnete das Brett eine Liste, wo die Karte eine
   *  Verwandlung zeigt — genau die Drift zwischen Hub und Spiel, die Kokis
   *  Review am 15.08. schon einmal gefunden hat. */
  beispielMuster: string;
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
   *  only in production, so no child has a collection today.
   *
   *  v3 (R5-W9 · N1): `lehrtEn` und `beispielMuster` kommen dazu — ohne sie
   *  könnte das Hub-Brett die Seite nicht so zeichnen, wie das Spiel sie zeigt.
   *  Eine v2-Sammlung wird verworfen statt ergänzt, aus demselben Grund wie
   *  damals: das gemalte Buch ist in Produktion Lehrer-Vorschau, es gibt keine
   *  Kindersammlung, die etwas verlöre. Ein ergänztes v2 hiesse raten, welche
   *  Formen eine alte Seite lehrt — und eine geratene Marke ist schlechter als
   *  eine Seite, die man noch einmal findet. */
  v: 3;
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
    if (parsed?.v !== 3 || !Array.isArray(parsed.entries)) return [];
    return parsed.entries.filter(
      (e): e is RegelbuchEntry =>
        typeof e?.topicDe === "string" && e.topicDe !== "" && typeof e?.merksatzDe === "string"
        && Array.isArray(e?.beispieleEn) && Array.isArray(e?.lehrtEn)
        && typeof e?.beispielMuster === "string",
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
const localListeners = new Set<() => void>();

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
  localListeners.add(onChange);
  const h = (e: StorageEvent): void => { if (e.key === KEY || e.key === null) onChange(); };
  window.addEventListener("storage", h);
  return () => { localListeners.delete(onChange); window.removeEventListener("storage", h); };
};

/** Only these two authored ch01 titles changed before rule ids were stored.
 *  Explicit ids always win; no fuzzy matching or cross-chapter migration. */
const ruleIdentity = (entry: RegelbuchEntry): string | undefined => {
  if (typeof entry.ruleId === "string" && entry.ruleId !== "") return entry.ruleId;
  if (entry.chapter !== "ch01") return undefined;
  if (entry.topicDe === "Befehle — ohne you vor dem Verb" || entry.topicDe === "Befehle auf Englisch") return "p1-regel-befehle";
  if (entry.topicDe === "Plural: aus einem werden viele" || entry.topicDe === "Ein Buch und viele Bücher") return "p3-regel-plural";
  return undefined;
};

const sameRule = (left: RegelbuchEntry, right: RegelbuchEntry): boolean => {
  if (left.chapter !== right.chapter) return false;
  const leftId = ruleIdentity(left);
  const rightId = ruleIdentity(right);
  return leftId !== undefined && rightId !== undefined
    ? leftId === rightId
    : left.topicDe === right.topicDe;
};

/** Re-finding a page refreshes its copy in its original position. Stable ids
 *  survive title edits; legacy pages use exact topics or the two narrow aliases.
 *  Already duplicated copies of this rule coalesce, leaving all others intact. */
export const rememberRegelSeite = (entry: RegelbuchEntry): RegelbuchEntry[] => {
  const have = readRegelbuch();
  const matches = have.map((page, index) => sameRule(page, entry) ? index : -1).filter(index => index >= 0);
  const index = matches[0] ?? -1;
  const ruleId = ruleIdentity(entry) ?? (index < 0 ? undefined : ruleIdentity(have[index]));
  const refreshed = ruleId === undefined ? entry : { ...entry, ruleId };
  const next = index < 0 ? [...have, refreshed]
    : matches.length === 1 && JSON.stringify(have[index]) === JSON.stringify(refreshed) ? have
    : have.flatMap((page, i) => i === index ? [refreshed] : matches.includes(i) ? [] : [page]);
  if (typeof window !== "undefined" && next !== have) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ v: 3, entries: next } satisfies RegelbuchFile));
      snapRaw = null; // this tab wrote it, so its own cache is stale
      for (const listener of localListeners) listener();
    } catch {
      /* quota or private mode: the run keeps working, the library just does not grow */
    }
  }
  return next;
};

/** Current authored text for genuinely banked pages in this chapter. Identity
 * proves ownership; projecting current text never creates a new collected page.
 * Unrelated/retired entries remain untouched in the durable library. */
export const chapterRegelSeiten = (level: PaintLevel, entries: readonly RegelbuchEntry[]) => {
  const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  const phases = [...level.phases, ...(level.arena ? [level.arena] : []), ...(level.bonus ? [level.bonus] : [])];
  return phases.flatMap(phase => phase.entities).filter(entity => entity.role === "tip").flatMap(entity => {
    const params = entity.params ?? {};
    const page = {
      chapter: level.chapter, ruleId: entity.id, id: entity.id, skin: entity.skin,
      topicDe: String(params.topicDe ?? ""), erklaerungDe: String(params.erklaerungDe ?? ""),
      merksatzDe: String(params.merksatzDe ?? ""), schluesselDe: String(params.schluesselDe ?? ""),
      beispieleEn: strings(params.beispieleEn), lehrtEn: strings(params.lehrtEn),
      beispielMuster: String(params.beispielMuster ?? "einzeln"), belegDe: String(params.belegDe ?? ""),
      total: level.tipsTotal ?? 0,
    };
    return entries.some(entry => sameRule(entry, page)) ? [page] : [];
  });
};

/** Run at the app's chapter mount, outside rendering. Both the hub and the
 * internal archive then read the same corrected saved copy, including aliases. */
export const refreshChapterRegelbuch = (level: PaintLevel): void => {
  for (const { id: _id, skin: _skin, ...entry } of chapterRegelSeiten(level, readRegelbuch())) rememberRegelSeite(entry);
};
