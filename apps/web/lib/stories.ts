/**
 * Per-grade story-tile chrome (icon + one-line blurb) for home and the /play
 * chooser. The story ids/titles/grades themselves are DERIVED from the corpus
 * via @domigo/content-loader (`listReleasedStories`/`storyIdForGrade`) — never
 * hardcode a story id in the app (a stale hardcoded map is what 400'd every g3
 * `.ci.` attempt). A released grade missing here falls back to DEFAULT_STORY_UI,
 * so shipping a new story never depends on this file.
 */
export interface StoryUi {
  icon: string;
  blurb: string;
}

export const STORY_UI: Record<number, StoryUi> = {
  1: { icon: "📖", blurb: "explore the zones, restore the pages" },
  2: { icon: "🔎", blurb: "solve the case, file by file" },
  3: { icon: "🎬", blurb: "run the channel, episode by episode" },
};

export const DEFAULT_STORY_UI: StoryUi = { icon: "📖", blurb: "play your story, chapter by chapter" };
