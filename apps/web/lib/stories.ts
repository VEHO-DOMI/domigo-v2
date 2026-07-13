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
  4: { icon: "📓", blurb: "write the week as it happens" },
};

export const DEFAULT_STORY_UI: StoryUi = { icon: "📖", blurb: "play your story, chapter by chapter" };

/**
 * HUB_THEME doctrine (bible 20 §6): a story may claim its own hub-card skin
 * (a `.dgh-<skin>` CSS family in globals.css) instead of the grade default
 * (`dgh-g1..dgh-g4`). "The Spill" is `ink` — pale paper, ink-blot corner,
 * blue-black accents; locked cards render half-erased (the Blank took them).
 */
export const HUB_SKIN: Record<string, string> = {
  "g2.st.the-spill": "ink",
};
