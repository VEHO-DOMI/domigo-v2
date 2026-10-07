import "server-only";
import { listReleasedStories, loadStory, type ReleasedStory } from "@domigo/content-loader";
import { getDb, listStoryWorldSettings } from "@domigo/db";

const PAINT_STORY = "g1.st.lost-pages";

/** Fresh per request: only the immutable corpus is cached, never the DB setting. */
export async function readStoryWorlds() {
  const fallback = listReleasedStories();
  let settings: { grade: number; isOpen: boolean }[] = [];
  let available = true;
  try {
    settings = await listStoryWorldSettings(getDb());
  } catch {
    // Missing migration or DB outage: exactly the committed release defaults.
    // The admin sees the outage and cannot mistake a fallback for a saved value.
    available = false;
  }
  const open = (grade: number) => settings.find((s) => s.grade === grade)?.isOpen
    ?? fallback.some((s) => s.grade === grade && s.role === "canonical");
  const stories: ReleasedStory[] = fallback.filter((s) => open(s.grade));
  if (open(1) && !stories.some((s) => s.grade === 1 && s.role === "canonical")) {
    const paint = loadStory(PAINT_STORY);
    if (paint) stories.push({ storyId: PAINT_STORY, grade: 1, titleEn: paint.title.en, role: "canonical" });
  }
  stories.sort((a, b) => a.grade - b.grade || a.storyId.localeCompare(b.storyId));
  return {
    available,
    stories,
    grades: [1, 2, 3, 4].map((grade) => ({ grade, isOpen: open(grade) })),
  };
}

export async function listOpenStories(): Promise<ReleasedStory[]> {
  return (await readStoryWorlds()).stories;
}

export async function openStoryIdForGrade(grade: number): Promise<string | null> {
  return (await listOpenStories()).find((s) => s.grade === grade && s.role === "canonical")?.storyId ?? null;
}
