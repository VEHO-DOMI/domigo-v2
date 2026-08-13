/**
 * auftakt — HAS THIS CHILD ALREADY READ THIS CHAPTER'S OPENING?
 *
 * R5-W2 · J1-B. Koki's rule: the opening is skippable from the second entry into
 * the same chapter, „sonst ist der Auftakt eine Strafe für Wiederkehrer."
 *
 * `booted` inside PaintGame cannot answer this. It is `useState(false)`, it is
 * reset by every mount, and it gates one CSS class — so before this module, the
 * game could not tell a first visit from a tenth, and the opening replayed every
 * single time.
 *
 * The answer lives out here, in the app, for the same declared reason the
 * Regelbuch does: `game-paint` writes nothing — no fetch, no storage — and that
 * is the property its proof tapes replay the whole chapter on. The game reports
 * what happened through one callback; the shell decides what to keep.
 *
 * ── WHY localStorage ONLY, AND WHY THAT IS NOT A SHORTCUT ────────────────────
 * The Regelbuch's own header argues for a server column because „a collected
 * rule page is a possession". The argument runs the other way here, and it is
 * worth writing down rather than leaving as an omission: „I have already read
 * the opening" is not a possession. Nothing is lost if it is wiped — the worst
 * outcome is a child seeing a good opening a second time. Paying a
 * /api/game-save round trip, a clientRev merge and a debounce timer for that
 * would be cost with no matching risk. If it ever becomes one, these two
 * functions are the whole of the server move.
 */
const KEY = "domigo:auftakt:g1";

interface AuftaktFile { v: 1; seen: string[] }

/** SSR answers FALSE — »not seen«, i.e. SHOW the opening. That is the safe
 *  default in both directions: at worst a child who has read it sees it once
 *  more; never a child who has not being skipped past it. */
export const auftaktSeen = (chapter: string): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) return false;
    const parsed = JSON.parse(raw) as Partial<AuftaktFile>;
    if (parsed?.v !== 1 || !Array.isArray(parsed.seen)) return false;
    return parsed.seen.includes(chapter);
  } catch {
    return false; // corrupt JSON, a wrong version, a private-mode throw
  }
};

/** Remember that this chapter's opening has been read to its end. Idempotent. */
export const rememberAuftakt = (chapter: string): void => {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw === null ? null : (JSON.parse(raw) as Partial<AuftaktFile>);
    const seen = parsed?.v === 1 && Array.isArray(parsed.seen) ? parsed.seen : [];
    if (seen.includes(chapter)) return;
    const next: AuftaktFile = { v: 1, seen: [...seen, chapter] };
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota or private mode: the run keeps working, the opening simply replays */
  }
};

/** Test seam — the durable state is one key, so forgetting is one call. */
export const forgetAuftakt = (): void => {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
};
