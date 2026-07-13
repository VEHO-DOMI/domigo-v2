/**
 * B-2 — non-prod story preview. A story bundle with NO release.json is invisible
 * to students AND to the /play pages (storyIdForGrade only returns released
 * canonicals) — correct in production, but it makes a pre-release overworld
 * impossible to LOOK at. Setting e.g. `DEV_STORY_G2=g2.st.the-spill` (dev only,
 * same non-prod guard as DEV_USER_ID) makes /play/2 serve that bundle with every
 * chapter treated as released; `DEV_STORY_G2=g2.st.the-spill:5` releases only
 * the first 5 chapters (so the locked/half-erased hub state can be seen too).
 * Never active in production builds; release.json remains the ONLY release
 * mechanism students can ever see.
 */

export interface DevStoryPreview {
  storyId: string;
  /** Treat only the first N chapters as released; null = all. */
  releaseUpTo: number | null;
}

export function devStoryOverride(grade: number): DevStoryPreview | null {
  if (process.env.NODE_ENV === "production") return null;
  const raw = process.env[`DEV_STORY_G${grade}`] ?? "";
  const m = /^(g[1-4]\.st\.[a-z0-9-]+)(?::(\d{1,2}))?$/.exec(raw);
  if (!m) return null;
  return { storyId: m[1]!, releaseUpTo: m[2] !== undefined ? Number(m[2]) : null };
}

/** The chapter ids the preview treats as released (first N in story order). */
export function devReleasedChapters(preview: DevStoryPreview, chapterIds: string[]): string[] {
  return preview.releaseUpTo === null ? chapterIds : chapterIds.slice(0, preview.releaseUpTo);
}
